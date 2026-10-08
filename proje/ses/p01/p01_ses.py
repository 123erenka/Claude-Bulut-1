"""P01 (sisli vadi) için 4 katmanlı özgün ses sentezi. Kullanım: python3 p01_ses.py <cikti_klasoru>"""
import sys, os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
DUR = 12.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(227)
out = sys.argv[1]
os.makedirs(out, exist_ok=True)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def smooth_noise(rate_hz, n=N, seed=None):
    """Yavaş değişen rastgele eğri (0-1)."""
    r = np.random.default_rng(seed)
    pts = int(DUR * rate_hz) + 3
    ctrl = r.random(pts)
    xs = np.linspace(0, DUR, pts)
    y = np.interp(t, xs, ctrl)
    y = lp(y, rate_hz * 1.5, 1)
    y -= y.min()
    return y / (y.max() + 1e-9)


def pink(n, seed):
    r = np.random.default_rng(seed)
    w = r.standard_normal(n)
    f = np.fft.rfft(w)
    k = np.arange(len(f))
    k[0] = 1
    f /= np.sqrt(k)
    p = np.fft.irfft(f, n)
    return p / np.max(np.abs(p))


def reverb(x, secs=2.5, decay=3.0, seed=1, mix=0.35):
    r = np.random.default_rng(seed)
    n = int(SR * secs)
    ir = r.standard_normal(n) * np.exp(-decay * np.arange(n) / SR * (5 / secs))
    ir = lp(ir, 6000, 1)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[: len(x)]
    return (1 - mix) * x + mix * wet


def pan(x, p):
    """p: -1 sol, +1 sağ (sabit ya da dizi)."""
    a = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def fade(x, fin=1.5, fout=2.0):
    env = np.ones(len(x))
    i, o = int(fin * SR), int(fout * SR)
    env[:i] = np.linspace(0, 1, i) ** 2
    env[-o:] = np.linspace(1, 0, o) ** 2
    return x * env[:, None] if x.ndim == 2 else x * env


def norm(x, peak=0.89):
    return x * peak / (np.max(np.abs(x)) + 1e-9)


# 1) ORTAM: şafak rüzgârı + sis hışırtısı + uzaktan tek bir canlı çağrısı
gust_l = 0.35 + 0.65 * smooth_noise(0.35, seed=11)
gust_r = 0.35 + 0.65 * smooth_noise(0.35, seed=12)
wind_l = bp(pink(N, 21), 120, 1400) * gust_l
wind_r = bp(pink(N, 22), 120, 1400) * gust_r
hiss = bp(rng.standard_normal(N), 2500, 7000) * 0.06 * smooth_noise(0.6, seed=13)
amb = np.stack([wind_l + hiss, wind_r + hiss], axis=1)
# canlı çağrısı (~7. sn): kayan, titreşimli, iki formantlı alçak bir ses
c0, cd = 7.0, 1.6
ci = (t >= c0) & (t < c0 + cd)
tc = t[ci] - c0
f = 520 - 140 * (tc / cd) ** 0.7 + 8 * np.sin(2 * np.pi * 5.5 * tc)
ph = 2 * np.pi * np.cumsum(f) / SR
call = np.zeros(N)
call[ci] = (np.sin(ph) + 0.4 * np.sin(2 * ph + 0.3) + 0.15 * np.sin(3.01 * ph)) * np.sin(np.pi * tc / cd) ** 1.5
call = bp(call, 300, 2200)
call = reverb(lp(call, 1800), secs=3.5, mix=0.7, seed=3)
amb += pan(norm(call, 0.12), -0.55)
amb = fade(norm(amb, 0.8))

# 2) UÇAN CANLILAR: ipeksi zar dalgalanması, soldan sağa geçen iki geçiş
flut = np.zeros((N, 2))
for start, length, seed in [(1.8, 4.5, 31), (5.6, 5.0, 32)]:
    i = (t >= start) & (t < start + length)
    tl = t[i] - start
    env = np.sin(np.pi * tl / length) ** 2
    lfo = 0.55 + 0.45 * np.sin(2 * np.pi * (5 + 2.5 * np.sin(2 * np.pi * 0.4 * tl)) * tl)
    src = np.zeros(N)
    src[i] = rng.standard_normal(i.sum()) * env * lfo
    src = bp(src, 500, 2600) + 0.5 * bp(src, 180, 450)
    p = np.zeros(N)
    p[i] = -0.8 + 1.6 * tl / length
    flut += pan(src, p)
flut[:, 0] = reverb(flut[:, 0], 2.0, mix=0.3, seed=4)
flut[:, 1] = reverb(flut[:, 1], 2.0, mix=0.3, seed=5)
flut = fade(norm(flut, 0.8))

# 3) ALTIN İZ: seyrek, kristalimsi pırıltılar, zamanla sağa kayan
notes = 440 * 2 ** (np.array([19, 21, 24, 26, 28, 31, 33, 36]) / 12)  # pentatonik, yüksek
shim = np.zeros((N, 2))
tt = 0.3
while tt < DUR - 0.5:
    fr = rng.choice(notes) * (1 + rng.normal(0, 0.002))
    L = int(SR * rng.uniform(0.6, 1.4))
    s = int(tt * SR)
    L = min(L, N - s)
    tn = np.arange(L) / SR
    tone = (np.sin(2 * np.pi * fr * tn) + 0.3 * np.sin(2 * np.pi * fr * 2.76 * tn)) * np.exp(-tn * rng.uniform(3, 6))
    tone *= np.minimum(1, tn / 0.004) * rng.uniform(0.3, 1.0)
    p = np.clip(-0.6 + 1.4 * tt / DUR + rng.normal(0, 0.15), -1, 1)
    shim[s : s + L] += pan(tone, p)
    tt += rng.exponential(0.22)
shim[:, 0] = reverb(shim[:, 0], 3.0, mix=0.6, seed=6)
shim[:, 1] = reverb(shim[:, 1], 3.0, mix=0.6, seed=7)
shim = fade(norm(shim, 0.8))

# 4) NABIZ: yerin altından, boğuk, yavaş kalp atışı (lub-dub)
pulse = np.zeros(N)
beat = 1.15
for k in range(int(DUR / beat) + 1):
    for off, amp in [(0.0, 1.0), (0.26, 0.6)]:
        s = int((k * beat + off) * SR)
        L = int(0.45 * SR)
        if s >= N:
            continue
        L = min(L, N - s)
        tn = np.arange(L) / SR
        fr = 48 + 22 * np.exp(-tn * 18)
        ph = 2 * np.pi * np.cumsum(fr) / SR
        pulse[s : s + L] += amp * np.sin(ph) * np.exp(-tn * 9) * np.minimum(1, tn / 0.008)
pulse = lp(pulse, 160)
pulse *= np.linspace(0.25, 1.0, N)  # montaj boyunca yükselecek; burada hafifçe artıyor
pulse = fade(norm(pan(pulse, 0.0), 0.8))

# Kaydet: katmanlar + karışım
layers = {"1_ortam": amb, "2_ucan_canlilar": flut, "3_altin_iz": shim, "4_nabiz": pulse}
for name, x in layers.items():
    wavfile.write(os.path.join(out, f"P01_{name}.wav"), SR, (x * 32767).astype(np.int16))

gains = {"1_ortam": 1.0, "2_ucan_canlilar": 0.45, "3_altin_iz": 0.22, "4_nabiz": 0.28}
mix = sum(layers[k] * g for k, g in gains.items())
mix = hp(mix.T, 25).T
mix = norm(mix, 0.71)  # ~ -3 dBFS tepe
wavfile.write(os.path.join(out, "P01_karisim.wav"), SR, (mix * 32767).astype(np.int16))
print("tamam", list(layers) + ["karisim"])
