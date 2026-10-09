"""Bursa zaman haritası için müzik ve efekt sentezi (yalnızca numpy).

Kullanım: python3 ses/ses.py cikti/ses.wav
Zamanlamalar src/timeline.js ve src/main.js ile birebir aynıdır.
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 300.0
N = int(SR * DUR)
rng = np.random.default_rng(1326)

L = np.zeros(N)
R = np.zeros(N)


def idx(t):
    return int(max(0, min(N, round(t * SR))))


def env_ar(n, a, r):
    """n örneklik zarf: a sn atak, r sn bırakma."""
    e = np.ones(n)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na > 0:
        e[:na] = np.linspace(0, 1, na)
    if nr > 0:
        e[n - nr:] *= np.linspace(1, 0, nr)
    return e


def add(sig, t, gain=1.0, pan=0.0):
    i0 = idx(t)
    i1 = min(N, i0 + len(sig))
    if i1 <= i0:
        return
    s = sig[: i1 - i0] * gain
    lg, rg = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    L[i0:i1] += s * lg
    R[i0:i1] += s * rg


def fft_filter(x, lo, hi):
    """FFT ile bant geçiren filtre (uzun sinyaller için hızlı)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    if hi:
        m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def hz(note):
    """MIDI nota -> Hz"""
    return 440.0 * 2 ** ((note - 69) / 12)


def pluck(freq, sec, bright=0.5, decay=0.996):
    """Karplus-Strong telli çalgı (ud / lir benzeri)."""
    n = int(sec * SR)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p)
    buf = np.convolve(buf, [bright, 1 - bright], mode='same')
    blocks = []
    for _ in range(n // p + 1):
        blocks.append(buf)
        buf = decay * 0.5 * (buf + np.roll(buf, -1))
    out = np.concatenate(blocks)[:n]
    return out * env_ar(n, 0.002, 0.08)


def pad(freqs, sec, a=2.0, r=2.0, detune=0.003, bright=0.25):
    n = int(sec * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for d in (-detune, 0, detune):
            ph = rng.uniform(0, 2 * np.pi)
            s += np.sin(2 * np.pi * f * (1 + d) * t + ph)
            s += bright * np.sin(2 * np.pi * 2 * f * (1 + d) * t + ph) * 0.5
            s += bright * 0.4 * np.sin(2 * np.pi * 3 * f * (1 + d) * t + ph) * 0.33
    s /= max(1, len(freqs) * 3)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 0.13 * t)
    return s * trem * env_ar(n, a, r)


def ney(freq, sec):
    """Ney benzeri nefesli ton: sinüs + nefes gürültüsü + vibrato."""
    n = int(sec * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    tone = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = fft_filter(rng.standard_normal(n), freq * 0.8, freq * 3) * 0.35
    return (tone + breath) * env_ar(n, 0.25, 0.4)


def drum(kind='dum', sec=0.6):
    n = int(sec * SR)
    t = np.arange(n) / SR
    if kind == 'dum':  # davul / bendir bas vuruşu
        f = 60 + 70 * np.exp(-t * 18)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
        s += fft_filter(rng.standard_normal(n), 80, 600) * np.exp(-t * 30) * 0.3
    elif kind == 'tek':  # ince vuruş
        s = fft_filter(rng.standard_normal(n), 900, 5000) * np.exp(-t * 40) * 0.6
        s += np.sin(2 * np.pi * 330 * t) * np.exp(-t * 25) * 0.3
    else:  # kick (modern)
        f = 45 + 90 * np.exp(-t * 30)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    return s


def bell(freq, sec=5.0):
    n = int(sec * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for ratio, amp, dec in [(0.5, 0.6, 0.8), (1, 1, 1.2), (1.19, 0.5, 1.6), (1.5, 0.35, 2), (2.0, 0.3, 2.4), (2.74, 0.2, 3), (3.0, 0.15, 3.5)]:
        s += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * dec)
    return s * env_ar(n, 0.003, 0.3) * 0.4


def jingle(sec=0.25):
    n = int(sec * SR)
    t = np.arange(n) / SR
    f = rng.uniform(2600, 4200)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.47 * t)) * np.exp(-t * 22)


def horn(freqs, sec):
    """Boru / pirinç benzeri ton (testere dişi, filtrelenmiş)."""
    n = int(sec * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
        ph = np.cumsum(f * vib) / SR
        s += 2 * (ph % 1) - 1
    s = fft_filter(s / len(freqs), 0, 1800)
    return s * env_ar(n, 0.12, 0.6)


def whoosh(sec=1.6):
    n = int(sec * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    e = np.sin(np.pi * t / sec) ** 2
    lo = fft_filter(x, 300, 1200) * e
    return lo * 0.6


# --------------------------------------------------------------- MÜZİK
D = 50  # D3

# Bölüm pad'leri: (başlangıç, bitiş, notalar, kazanç)
PADS = [
    (0, 10, [D - 12, D - 5], 0.32),
    (8, 31, [D - 12, D - 5, D + 3], 0.30),             # Antik: D minör renk
    (29, 54, [D - 12, D - 5, D + 2], 0.30),            # sus2
    (52, 74, [D - 12, D - 11, D - 5], 0.32),           # gerilim: D-Eb
    (72, 93, [D - 12, D - 5, D - 11, D + 1], 0.34),    # kuşatma
    (91, 129, [D - 12, D - 5, D + 4 - 12, D + 3], 0.30),  # Hicaz rengi (F#)
    (127, 150, [D - 12, D - 11, D - 6], 0.34),         # yıkım
    (148, 181, [D - 12, D - 5, D + 4], 0.30),          # yeniden doğuş
    (179, 199, [D - 12, D - 11, D - 7], 0.34),         # yangın / deprem
    (197, 227, [D - 12, D - 5, D + 3, D + 7], 0.28),   # geç dönem / savaş
    (225, 262, [D - 12, D - 5, D + 4, D + 9], 0.28),   # sanayi: D majör
    (260, 300, [D - 12, D - 5, D + 4, D + 7, D + 11], 0.30),  # bugün
]
for t0, t1, notes, g in PADS:
    add(pad([hz(n) for n in notes], t1 - t0, a=2.5, r=2.5), t0, g)

# Antik lir: D Dorian
dorian = [D, D + 2, D + 3, D + 5, D + 7, D + 9, D + 10, D + 12]
t = 9.5
while t < 50:
    seq = rng.choice(len(dorian), size=4)
    for k, j in enumerate(seq):
        add(pluck(hz(dorian[j] + 12), 2.0, bright=0.6, decay=0.9975), t + k * 0.45, 0.22, pan=rng.uniform(-0.4, 0.4))
    t += rng.choice([3.0, 3.6, 4.2])

# Bizans çanı
for tb in (43.2, 46.4, 49.6):
    add(bell(hz(D - 2), 5), tb, 0.35, pan=0.2)

# Hicaz makamı: D Eb F# G A Bb C D
hicaz = [D, D + 1, D + 4, D + 5, D + 7, D + 8, D + 10, D + 12, D + 13, D + 16]


def hicaz_phrase(t0, t1, density, octave=12, gain=0.24):
    t = t0
    pos = 4
    while t < t1:
        steps = int(rng.integers(3, 7))
        for _ in range(steps):
            pos = int(np.clip(pos + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(hicaz) - 1))
            dur = rng.choice([0.375, 0.375, 0.75])
            add(pluck(hz(hicaz[pos] + octave), 1.6, bright=0.45, decay=0.9965), t, gain, pan=rng.uniform(-0.3, 0.3))
            t += dur
            if t > t1:
                break
        # cümle sonu: karar sesine yakın uzun nota
        add(pluck(hz(hicaz[rng.choice([0, 4, 7])] + octave), 2.4, bright=0.4, decay=0.998), t, gain * 0.9)
        t += density


hicaz_phrase(94, 127, 1.6)
hicaz_phrase(150, 178, 1.3)
# ney uzun notaları
for t0, n, d in [(96, D + 7, 3.5), (101, D + 5, 3.0), (106, D + 4, 4.0), (113, D + 8, 3.0), (118, D + 7, 4.5),
                 (152, D + 12, 3.5), (157, D + 10, 3.0), (162, D + 8, 3.0), (168, D + 7, 4.5), (174, D + 4, 3.5)]:
    add(ney(hz(n + 12), d), t0, 0.16, pan=-0.15)

# Bendir / davul ritimleri
def rhythm(t0, t1, bpm, pattern, gain=0.5):
    beat = 60 / bpm
    t = t0
    i = 0
    while t < t1:
        k = pattern[i % len(pattern)]
        if k == 'D':
            add(drum('dum'), t, gain)
        elif k == 't':
            add(drum('tek', 0.2), t, gain * 0.5, pan=0.3)
        t += beat / 2
        i += 1


rhythm(56, 72, 60, ['D', '-', '-', '-'], 0.35)
rhythm(72, 88, 92, ['D', '-', 't', '-', 'D', 't', 't', '-'], 0.55)
rhythm(96, 127, 80, ['D', '-', 't', '-', 't', '-', 't', '-'], 0.28)
rhythm(128, 136, 120, ['D', 'D', 't', '-'], 0.55)
rhythm(139, 146, 110, ['D', '-', 'D', 't'], 0.45)
rhythm(150, 178, 84, ['D', '-', 't', 't', 'D', '-', 't', '-'], 0.25)
rhythm(209, 221, 112, ['D', '-', 't', '-'], 0.45)

# Modern dönem: yumuşak nabız + arpej
beat = 60 / 100
t = 246.0
while t < 291:
    add(drum('kick'), t, 0.32)
    t += beat
arp_chords = [[D, D + 4, D + 7, D + 11], [D - 2, D + 2, D + 5, D + 9], [D - 5, D - 1, D + 2, D + 7], [D - 3, D + 2, D + 4, D + 9]]
t = 236.0
ci = 0
while t < 292:
    ch = arp_chords[ci % 4]
    for k in range(8):
        n = ch[k % 4] + (12 if k >= 4 else 0) + 12
        add(pluck(hz(n), 1.0, bright=0.7, decay=0.994), t + k * beat / 2, 0.13 if t < 246 else 0.17, pan=(-0.35 if k % 2 else 0.35))
    t += beat * 4
    ci += 1

# Geç Osmanlı / erken Cumhuriyet: piyano benzeri melodi
piano = [D + 12, D + 15, D + 19, D + 17, D + 15, D + 14, D + 12, D + 10]
t = 197.5
k = 0
while t < 209:
    add(pluck(hz(piano[k % len(piano)]), 2.2, bright=0.8, decay=0.9975), t, 0.2)
    t += 0.75
    k += 1
t = 221.5
while t < 234:
    add(pluck(hz(piano[(k * 3) % len(piano)] + 2), 2.2, bright=0.8, decay=0.9975), t, 0.18)
    t += 0.75
    k += 1

# Fetih ve kurtuluş boruları
add(horn([hz(D), hz(D + 7)], 2.4), 86.0, 0.22)
add(horn([hz(D + 5), hz(D + 12)], 2.0), 88.0, 0.2)
add(horn([hz(D), hz(D + 4), hz(D + 7)], 3.0), 219.6, 0.24)
add(horn([hz(D + 5), hz(D + 9), hz(D + 12)], 3.5), 222.4, 0.22)

# Kapanış akoru
add(pad([hz(n) for n in [D - 12, D - 5, D + 4, D + 7, D + 12, D + 16]], 8, a=0.4, r=4.5, bright=0.4), 292.5, 0.45)
add(bell(hz(D + 12), 6), 293.5, 0.25)

# --------------------------------------------------------------- EFEKTLER
# rüzgâr: giriş ve kapanış
w = fft_filter(noise(12), 150, 900)
w *= (0.6 + 0.4 * np.sin(np.linspace(0, 6, len(w)))) * env_ar(len(w), 2, 4)
add(w, 0, 0.12)
add(w[: int(9 * SR)] * env_ar(int(9 * SR), 2, 3), 291, 0.1)

# kaplıca suyu
water = fft_filter(noise(12), 900, 6000)
bub = np.zeros_like(water)
for _ in range(220):
    p = int(rng.uniform(0, len(bub) - 2000))
    tt = np.arange(1500) / SR
    f0 = rng.uniform(500, 1400)
    bub[p:p + 1500] += np.sin(2 * np.pi * f0 * (1 + tt * 6) * tt) * np.exp(-tt * 60) * 0.6
add((water * 0.25 + bub) * env_ar(len(water), 1.5, 2), 18.5, 0.12, pan=-0.3)


def hooves(t0, t1, gain=0.3, rate=7.0):
    t = t0
    while t < t1:
        tt = np.arange(int(0.08 * SR)) / SR
        c = fft_filter(rng.standard_normal(len(tt)), 120, 1200) * np.exp(-tt * 60)
        fade = min(1, (t - t0) / 1.0, (t1 - t) / 1.0)
        add(c, t, gain * max(fade, 0), pan=rng.uniform(-0.5, 0.5))
        t += rng.uniform(0.6, 1.4) / rate


hooves(62.5, 72.5, 0.25)
hooves(127.5, 133, 0.32, 9)
hooves(135.5, 141, 0.18, 7)
hooves(138.5, 142, 0.25, 8)
hooves(209, 213, 0.22, 7)
hooves(216.5, 221, 0.32, 9)


def fire(t0, t1, gain=0.35):
    sec = t1 - t0
    base = fft_filter(noise(sec), 200, 2500) * 0.3
    n = len(base)
    for _ in range(int(sec * 45)):
        p = int(rng.uniform(0, n - 800))
        tt = np.arange(600) / SR
        base[p:p + 600] += rng.standard_normal(600) * np.exp(-tt * 300) * rng.uniform(0.5, 1.5)
    roar = fft_filter(noise(sec), 40, 250) * 0.7
    add((base + roar) * env_ar(n, 0.8, 1.5), t0, gain)


fire(131.8, 138.5, 0.4)
fire(142.3, 148.5, 0.35)
fire(180.8, 186.5, 0.4)
fire(236.0, 240.0, 0.38)


def quake(t0, sec, gain):
    n = int(sec * SR)
    tt = np.arange(n) / SR
    rumble = fft_filter(rng.standard_normal(n), 18, 90) * 2.5
    rumble *= np.exp(-tt / (sec * 0.45)) * np.clip(tt / 0.15, 0, 1)
    deb = np.zeros(n)
    for _ in range(int(sec * 25)):
        p = int(rng.uniform(0, n * 0.7))
        m = int(0.12 * SR)
        if p + m < n:
            deb[p:p + m] += fft_filter(rng.standard_normal(m), 300, 4000) * np.exp(-np.arange(m) / SR * 30) * rng.uniform(0.2, 1)
    add(rumble + deb * 0.5, t0, gain)


quake(188.6, 6.0, 0.6)
quake(267.0, 2.5, 0.25)

# tren düdüğü ve tıkırtı
tw = np.arange(int(1.6 * SR)) / SR
whistle = (np.sin(2 * np.pi * 880 * tw) + 0.6 * np.sin(2 * np.pi * 1108 * tw) + 0.4 * np.sin(2 * np.pi * 1320 * tw))
whistle *= env_ar(len(tw), 0.08, 0.5) * 0.4
add(whistle, 203.4, 0.22, pan=-0.4)
t = 203.0
while t < 209.5:
    tt = np.arange(int(0.06 * SR)) / SR
    add(fft_filter(rng.standard_normal(len(tt)), 300, 3000) * np.exp(-tt * 70), t, 0.12, pan=-0.4)
    t += 0.22 if int(t * 10) % 2 else 0.14

# kervan çanları
t = 158.5
while t < 172.5:
    add(jingle(), t, 0.12, pan=0.5)
    t += rng.uniform(0.25, 0.7)

# fabrika ve şehir uğultusu
fac = fft_filter(noise(12), 60, 400)
fac *= env_ar(len(fac), 1, 2)
add(fac, 229.0, 0.12)
city = fft_filter(noise(DUR - 238), 80, 1500)
city *= np.linspace(0, 1, len(city)) ** 1.5 * env_ar(len(city), 3, 5)
add(city, 238.0, 0.09)

# yönetim değişimlerinde geçiş "whoosh"
for tr in (30.0, 41.9, 91.5, 210.6, 220.2):
    add(whoosh(), tr - 0.6, 0.18)

# ayrıca: başlık vurgusu
add(drum('dum', 2.0), 1.2, 0.5)
add(pad([hz(D - 24), hz(D - 12)], 6, a=0.05, r=5), 1.2, 0.3)
add(drum('dum', 2.0), 188.7, 0.7)

# --------------------------------------------------------------- MASTER
mix = np.stack([L, R], axis=1)
mix /= max(1e-9, np.percentile(np.abs(mix), 99.95)) / 0.7
mix = np.tanh(mix * 1.1)
mix /= np.abs(mix).max()
fade = np.ones(N)
fade[-int(2.5 * SR):] = np.linspace(1, 0, int(2.5 * SR))
mix *= fade[:, None]
mix = (mix * 0.93 * 32767).astype(np.int16)

out = sys.argv[1] if len(sys.argv) > 1 else 'ses.wav'
with wave.open(out, 'wb') as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(mix.tobytes())
print('yazıldı:', out)
