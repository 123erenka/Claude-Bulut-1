# Stil Rehberi (taslak v0.1)

> Durum: **Taslak, yönetmen ve kullanıcı onayı bekliyor.** Hazırlayan: `animasyon-uretim`, 2026-10-08 (T-001).
> Bu rehber projenin görsel dilini **kelimelerle** tanımlar. Orijinal dizinin karelerine, adına ya da yaratıcılarına dayanmaz. Rehber onaylanınca, ilk iş olarak buna göre **5-6 "stil karesi"** üretilecek ve bundan sonra bütün araçlarda referans olarak o kareler kullanılacak (bkz. bölüm 9).
> Dayanak: `proje/hikaye/bolum01-pilot.md`, `proje/hikaye/bolum01-senaryo.md`

---

## 1. Tek cümlede stil
**İnce, renkli çizgili, düz boyalı, elle çizilmiş hissi veren 2D bilimkurgu illüstrasyonu; organik ve tuhaf bir doğa, yumuşak ve havadar bir ışık, uzun ve sessiz planlar.**

## 2. Çizgi
| Özellik | Kural |
|---|---|
| Kalınlık | İnce ve neredeyse eşit. 1080p karede yaklaşık 1-2 px. Ön plandaki nesnelerde en fazla 3 px |
| Renk | **Saf siyah değil.** Her nesnenin çizgisi kendi dolgu renginin koyu ve hafif doygun hâli (ör. turuncu kabuğa koyu kahve-kırmızı çizgi) |
| Uzaklık | Uzaktaki nesnelerde çizgi incelir, açılır ve sonunda kaybolur; en uzak dağlarda çizgi yok, sadece düz renk |
| Detay | Organik yüzeylerde (kabuk, kök, yaprak damarı) ince tarama ve noktalama (stipple) ile doku. Tarama yönü yüzeyin biçimini takip eder |
| Kaçın | Kalın, kontur gibi dış hatlar; kaligrafik, kalınlığı çok değişen fırça çizgisi; "sticker" görünümü |

## 3. Renk ve boyama
- **Düz dolgu:** Her alan tek ana renk + en fazla **bir** yumuşak gölge tonu. Gradyan yalnızca gökyüzünde, siste ve suda.
- **Gölge:** Gölgeler griye değil, ortamın ışık rengine kayar (şafakta gölge mor-mavi, akşamda kahve-mor).
- **Doku:** Bütün karede çok hafif bir kâğıt grenli doku (post'ta ortak bir gren katmanıyla eşitlenir).
- **Doygunluk:** Genel palet **pastel ve hafif soluk**. Karede en doygun ve parlayan öğe **altın yaşam akımıdır**; başka hiçbir öğe onunla yarışmaz.

### 3.1 Pilotun renk dili
| Mod | Ne zaman | Ana renkler (öneri, HEX) | Not |
|---|---|---|---|
| **Şafak (temel)** | Sahne 1 | Krem `#F3E9D2`, soluk şeftali `#F4C9A8`, tozlu mint `#B9D3C2`, açık leylak `#C9C0DA`, sisli gök `#E6E4EC` | Sakin, havadar, düşük kontrast |
| **Mucize (sıcak)** | Altın akım, sahne 2 doğumu, fener ışıkları | Altın `#E8B04A`, kehribar `#F2A541`, turuncu `#E07A3A`, sıcak krem ışık `#FFE7B0` | Işık kaynağı gibi davranır, çevresine sıcak yansıma verir |
| **Gizem / tehdit (soğuk)** | Sahne 2 sonu, 5, 6, 8, 9, 10 | Gri-leylak `#8C86A6`, mor `#5B4E7A`, kurşun mavi `#4A5D7A`, solmuş gri-yeşil `#8A9389`, kül grisi `#A7A3A0` | Kontrast artar, doygunluk düşer |
| **Solma (doğumun bedeli)** | 2j-2l | Sahne 1'deki renklerin aynısı, doygunluk %70 azaltılmış, değer biraz koyulaşmış | Aynı biçimler, rengi çekilmiş: "bedel" renkle okunur |
| **Gece** | Sahne 10 | Derin çivit `#1E2240`, gece moru `#2E2A4F`, biyolüminesan camgöbeği `#7FE0C2`, soluk yıldız `#DDE3F0` | Biyolüminesans yumuşak, küçük ışık noktaları |
| **Tarikat gemisi** | 5, 8, 9 | Kemik / fildişi `#D9D0BC`, bakır pası yeşili `#5E8C7C`, koyu erik `#3A2838`, soğuk gölge `#232733` | Tek sıcak nokta: bebek Levi'nin altın ışığı |

> HEX değerleri **başlangıç önerisidir**; stil kareleri onaylandığında o karelerden ölçülen değerlerle güncellenecek.

## 4. Işık
- **Yumuşak ve dağınık:** Sert, keskin gölge yok. Işık havada asılı gibi; sis, toz ve spor ışığı taşır.
- **Hava perspektifi:** Uzaklaştıkça değer açılır, renk gökyüzünün rengine kayar, kontrast düşer, çizgi kaybolur. Derinlik bununla kurulur.
- **Işık kaynağı olarak canlılar:** Altın akım, fener sümüklüleri, gece bitkileri kendi ışığını yayar. Parıltı (glow) **küçük ve yumuşak**, çevresine renkli bir hale verir; mercek parlaması (lens flare) yok.
- **Kenar ışığı:** Şafak ve alacakaranlıkta siluetleri ayırmak için ince, sıcak ya da soğuk bir kenar ışığı.

## 5. Canlı ve bitki tasarım dili
Bu projenin canlıları **özgündür**. Ortak ilkeler:
1. **İşlev biçimi belirler.** Her canlının ekosistemde bir görevi var (taşır, tozlaştırır, avlanır, depolar); biçimi o görevi gösterir.
2. **Tanıdık ama tuhaf:** Böcek, deniz canlısı, mantar, bitki gibi tanıdık yapılardan yola çıkılır ama oranlar, eklem sayısı, malzeme beklenmedik biçimde değişir.
3. **Yüz yok ya da çok az:** İnsansı yüz, büyük sevimli gözler, "maskot" ifadesi yok. Göz varsa küçük, çoklu ya da beklenmedik yerde.
4. **Malzemeler:** Yarı saydam zarlar, damarlı yüzeyler, segmentli kabuklar, lifli dokular, ıslak parlaklık yerine **mat** yüzey.
5. **Renk kodu:** Altın renk yalnızca yaşam akımıyla ilişkili şeylerde (spor, toz, damar ışığı). Canlıların kendi renkleri paletin pastel ve toprak tonlarından seçilir.
6. **Ölçek kontrastı:** Mikro (çiy damlası içindeki canlılar) ile makro (dağ büyüklüğünde canlı) arasındaki fark montajın ritmini taşır.

## 6. İnsan, kıyafet, yapı
- İnsan figürleri sade, gerçekçi oranlı, abartısız; yüzlerde az çizgi.
- Kıyafetler işlevsel, yıpranmış, yamalı; düz renk.
- Teknoloji (Demeter, koloni ekipmanı): endüstriyel, ağır, köşeli; Vesta'nın organik biçimleriyle kontrast oluşturur. Koloni yapıları bu iki dilin karışımı (teknolojik parçalar + canlı/bitki kullanımı).
- **Tarikat:** bkz. `proje/uretim/tasarim-listesi.md` (özgün tasarlanacak; tören, kemik/fildişi, sargı, kazıma motifleri yönünde bir başlangıç tarifi orada).
- Orijinal dizinin karakterleri (Azi, Levi, Ursula, Barry, Kris, Kamen, Mia) için bu rehber yalnızca **çizgi, renk ve ışık kurallarını** verir; karakterlerin kendisi kullanıcının hazırlayacağı model sheet'lere göre çizilir (bkz. tasarım listesi, "K" grubu).

## 7. Kamera ve kompozisyon
- **Sabit ya da çok yavaş hareket.** Planların çoğu kilitli kamera; hareket varsa yavaş kaydırma, yavaş zum, yavaş vinç.
- **Uzun tutuşlar:** Plan süresi hareketin bitmesinden sonra da devam edebilir; sessizliğe yer açılır.
- **Ölçek:** Geniş planlarda küçük figür / küçük canlı, büyük manzara. Ufuk çizgisi genelde alçak ya da yüksek; ortada nadiren.
- **Yön:** Sahne 1'de altın akım **her planda ekranın sağına doğru** akar (senaryo kuralı). Kompozisyonlar bu yön çizgisini destekler.
- **Lens hissi:** Geniş açı ama bozulmasız; abartılı perspektif, balıkgözü yok. Alan derinliği bulanıklığı (bokeh) yok ya da çok az; derinliği hava perspektifi verir.
- **Kadraj:** 16:9, 1920×1080, 24 fps (en-boy oranı yönetmenin onayına sunuldu, bkz. T-003).

## 8. Hareket dili (taslak)
- Doğa hareketleri (rüzgâr, sis, su, nefes) yavaş, döngüsel, ağırlıklı.
- Ani hareket yalnızca tehdit anlarında (sahne 7) ve kısa.
- **Kare ritmi:** Kamera hareketleri 24 fps akıcı. Karakter ve canlı hareketinin 24 fps akıcı mı, yoksa elle çizilmiş his için "ikişerli" (12 fps) mi olacağı **yönetmen kararı** (T-003). Seçime göre post'ta yeniden zamanlama yapılır.

## 9. Kaçınılacaklar (bütün araçlarda negatif prompt'un temeli)
3D render / CGI görünümü · fotogerçekçilik · parlak, plastik yüzey ve speküler parlama · ağır gradyan ve hava fırçası gölgeleri · kalın siyah dış hat · anime/chibi oranları, büyük parlak gözler · neon ve aşırı doygunluk · HDR görünümü · lens flare, bokeh · yazı, logo, imza, filigran · kare kare titreyen çizgi ve doku

## 10. Stil kareleri ve referans kuralı
1. Rehber onaylanınca 5-6 stil karesi üretilir: (a) şafak manzarası, (b) detay/makro, (c) altın akım, (d) gece biyolüminesansı, (e) tarikat gemisi içi, (f) koloni akşamı.
2. Kareler yönetmen ve kullanıcı tarafından onaylanır → `proje/stil/kareler/` altına `STIL_01_safak_v1.png` gibi adlarla kaydedilir.
3. Bundan sonra **bütün** görsel üretiminde stil referansı olarak yalnızca bu kareler kullanılır (Midjourney `--sref`, Nano Banana referans görseli, ileride LoRA eğitimi).
4. Orijinal dizinin kareleri referans, stil referansı ya da eğitim verisi olarak **kullanılmaz** (telif ve projenin özgünlüğü).

## 11. Sabit prompt blokları (İngilizce, bütün araçlarda aynen tekrarlanır)
Araçlar İngilizce promptlarda daha tutarlı çalıştığı için bloklar İngilizcedir. Ayrıntılı kullanım: `proje/uretim/promptlar/sahne01-montaj.md`.

**[STİL BLOĞU v0.1]**
```
flat-color 2D animation background art, hand-drawn look, thin even linework in dark colored lines (never pure black), flat cel fills with at most one soft shadow tone, subtle paper grain and fine stipple texture, delicate hatching on organic surfaces, soft diffused atmospheric light, strong aerial perspective where distant shapes fade into the pale sky color and lose their outlines, muted pastel palette, clean graphic shapes, ligne-claire-influenced science-fiction illustration, quiet, strange and beautiful
```

**[NEGATİF BLOK v0.1]**
```
3d render, cgi, photorealistic, photograph, glossy, plastic, specular highlights, airbrushed gradients, thick black outlines, anime eyes, chibi, cute mascot, neon, oversaturated, hdr, lens flare, bokeh, depth of field blur, text, letters, watermark, logo, signature, frame border
```

**[ALTIN AKIM BLOĞU v0.1]**
```
a thin luminous golden life-current made of drifting motes of warm gold light and tiny glowing spores, flowing steadily toward the right side of the frame; the gold is the only saturated, glowing element in the image, with a soft small glow
```

## Kullanıcıya sorular (stil)
1. Elle çizim yapabiliyor musunuz (tablet / Krita / Procreate)? Stil karelerini düzeltmek ve karakter model sheet'leri için önemli.
2. Önerilen palet ve "pastel, soluk" genel ton istediğiniz atmosfere uyuyor mu?
