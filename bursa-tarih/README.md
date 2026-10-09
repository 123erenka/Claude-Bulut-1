# Bursa Zaman Haritası

Bursa'nın MÖ ~200'den 2026'ya kadar büyümesini ve değişimini gösteren **5 dakikalık 3D harita animasyonu**.
Format, referans alınan "şehrin tarihi" videolarına benzer: low-poly 3D arazi, sol altta yıl sayacı,
sol üstte yönetim + arma, sağ üstte nüfus, sağ altta olay kartları, anlatıcı yok; müzik ve efektler var.

Odak noktası tarihi çekirdek: **Hisar** (antik Prusa / Bizans kalesi), **Hanlar Bölgesi** ve
erken Osmanlı külliyeleri. Şehir büyüdükçe kamera Çekirge, Yıldırım, Emir Sultan, Muradiye,
Merinos, Organize Sanayi Bölgesi, Nilüfer, Görükle, Kestel ve Cumalıkızık'a açılır.

## Sahne akışı (300 sn)

| Süre | Dönem | Gösterilenler |
|---|---|---|
| 0:00–0:30 | MÖ ~200 · Bitinya | Uludağ ve ova, Prusa'nın travertin düzlükte kuruluşu, surlar, Çekirge kaplıcaları |
| 0:30–1:02 | Roma · Bizans | Prusa ad Olympum, Plinius ve hamamlar, kale içi kiliseler, Arap akınları |
| 1:02–1:32 | 1302–1326 | Osmanlı akıncıları, havale kuleleri (Balabancık, Aktimur), kuşatma, 6 Nisan 1326 teslim |
| 1:32–2:10 | Erken Osmanlı başkenti | Osman Gazi Türbesi, Orhan Gazi Külliyesi, Hüdavendigar, Ulu Cami, Yıldırım Külliyesi |
| 2:10–2:30 | 1402 · 1413 | Timur ordusunun yağması, Karamanoğlu kuşatması (yangınlar) |
| 2:30–3:00 | Yeniden doğuş | Yeşil Cami/Türbe, Emir Sultan, Muradiye, İpek Yolu kervanları, Koza Han |
| 3:00–3:30 | 1801 · 1855 | Çarşı yangını, büyük deprem (yıkım + toz + sarsıntı), yeniden yapım |
| 3:17–3:46 | Geç Osmanlı | Ahmet Vefik Paşa, Mudanya demiryolu, Saat Kulesi, 1920 işgal, 1922 kurtuluş |
| 3:46–4:30 | Cumhuriyet · sanayi | Merinos, Kapalıçarşı yangını, teleferik, OSB, Tofaş/Renault, göç ve ovaya yayılma |
| 4:30–5:00 | Bugün | Nilüfer, Bursaray, 1999 depremi, UNESCO (Bursa ve Cumalıkızık), Timsah Arena, otoyol |

## Teknik yapı

- `index.html` + `src/main.js`: three.js sahnesi (arazi, binalar, anıtlar, ordular, ateş/duman/toz parçacıkları, kamera, arayüz).
- `src/world.js`: prosedürel arazi (Uludağ sırtı, Hisar düzlüğü, akarsular) ve şehir büyüme bölgeleri; her bina bir doğuş yılına sahiptir.
- `src/timeline.js`: video saniyesi ↔ yıl eşlemesi, yönetimler, nüfus tahminleri, olay kartları, kamera planı.
- `ses/ses.py`: müzik (Dorian lir, Hicaz makamında ud/ney, davul ritimleri, modern arpej) ve efektlerin sentezi (yalnızca numpy).
- `render.mjs`: Playwright + başsız Chromium ile kare kare render, ffmpeg ile kodlama (paralel işçiler).
- `snap.mjs`: belirli saniyelerden önizleme karesi alır.

Tüm sahne zamana göre deterministiktir: `window.renderAt(t)` her çağrıldığında aynı kareyi üretir.

## Kullanım

```bash
cd bursa-tarih
npm install                       # three, yazı tipleri, playwright

# Önizleme kareleri (ör. 95. ve 190. saniye)
mkdir -p onizleme && node snap.mjs onizleme 95 190

# Tarayıcıda gerçek zamanlı oynatma (kare atlayabilir)
npx http-server . -p 8080         # sonra: http://localhost:8080/index.html?play=0

# Tam render (30 fps, 3 işçi) + ses + birleştirme
node render.mjs --out cikti/parcalar --fps 30 --workers 3 --from 0 --to 300
python3 ses/ses.py cikti/ses.wav
ffmpeg -f concat -safe 0 -i cikti/parcalar/liste.txt -i cikti/ses.wav \
  -c:v copy -c:a aac -b:a 192k -shortest cikti/bursa-zaman-haritasi.mp4
```

Yazılımsal GPU'lu (SwiftShader) bir bulut makinede 4 çekirdekle ~1 kare/sn hızında render alınır
(5 dakika ≈ 2,5 saat). Gerçek GPU'lu bir bilgisayarda çok daha hızlıdır.

URL parametreleri: `?t=123` (tek kare), `?play=0` (oynat), `?aa=0` (kenar yumuşatma kapalı),
`?sh=0` (gölgeler kapalı), `?mat=std` (PBR malzeme).

## Doğruluk notu

Bu bir **temsilî canlandırmadır**. Anıtların konumları gerçek koordinatlardan (Hisar merkezli km cinsinden)
yaklaşık olarak alınmıştır; görünür olmaları için ölçekleri büyütülmüştür. Yerleşim alanlarının
yayılışı ve 1927 öncesi nüfuslar tahminidir. Ayrıntılar: [`NOTLAR.md`](NOTLAR.md).
