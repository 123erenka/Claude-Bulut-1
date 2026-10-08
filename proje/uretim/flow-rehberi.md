# Google Flow + Nano Banana 2.1 Üretim Rehberi (v1)

> Durum: **Kullanıcının seçtiği ana araç (2026-10-08).** Bütün görsel ve video üretimi Google Flow içinde yapılacak.
> Storyboard ve promptlar: `proje/uretim/promptlar/pilot-storyboard.md`
> Bilgiler 2026-10-08 itibarıyla Google'ın Flow blogu, Flow yardım sayfası ve SSS'si ile Nano Banana 2.1 haberlerinden derlendi. "Doğrulanmadı" yazan yerleri Flow'un içinde kontrol et.

---

## 1. Flow'da ne var?

| Özellik | Ne işe yarar | Bizim kullanımımız |
|---|---|---|
| **Görsel üretimi (Nano Banana 2.1)** | Metinden ve referans görsellerden görsel üretir. Flow'da görsel üretimi ücretsiz | Storyboard'un 19 anahtar karesi |
| **Görsel düzenleme** | Bir alanı kement (lasso) ile seçip ya da üzerine çizip doğal dille değiştirme ("şunu kaldır", "buraya şunu ekle") | Bozuk el, fazla bacak, yanlış renk gibi küçük düzeltmeler |
| **Ingredients (malzemeler)** | Görselleri (ve videoları) karakter, nesne, mekân ya da stil referansı olarak kaydeder, tekrar tekrar kullanırsın | Karakter referansları, stil kareleri, özgün canlılar |
| **Frames (kareler)** | Bir başlangıç karesi ve istersen bir bitiş karesi verirsin, Veo arasındaki hareketi üretir | Planların çoğu. Özellikle "bir hâlden diğerine" geçen planlar |
| **Ingredients ile video** | Referansları kullanarak, kompozisyonu Veo'ya bırakarak video üretir | Karakterli ama kadrajı serbest planlar |
| **Extend (uzatma)** | Bir klibi devam ettirir | 8 saniyeden uzun planlar (P03, P19) |
| **Video düzenleme** | Videoya komutla nesne ekleme ya da çıkarma, pan/zoom gibi kamera hareketini yönlendirme | Küçük düzeltmeler |

- **Nano Banana 2.1** (6 Ekim 2026'da çıktı): Tasarım kalitesi, maskeyle düzenleme ve karakter tutarlılığı iyileşti. Tek üretimde **14 referansa** kadar, aynı anda en fazla **4 karakteri** ve **10 nesneyi** tutarlı tutabiliyor. 4K'ya kadar çıktı veriyor.
- ⚠️ **Nano Banana 2, 29 Ekim 2026'da kapanıyor.** Model seçiminde **2.1**'in seçili olduğundan emin ol. Flow'da varsayılan model başka olabilir (yardım sayfasında Nano Banana Pro yazıyor).
- **Klip süresi** ikincil kaynaklara göre **8 saniye** (doğrulanmadı). Uzun planlar Extend ile uzatılır.
- **Filigran:** Google, görsellere görünmez SynthID filigranı ekliyor. Ekranda görünmüyor, sorun değil.

---

## 2. Kurulum (bir kez)

1. Flow'da yeni bir proje aç: **`SR2 - Pilot`**.
2. En-boy oranını **16:9** seç. Bütün kareler ve klipler aynı oranda olmalı.
3. Görsel modeli olarak **Nano Banana 2.1**'i seç.
4. **Ingredients kütüphanesini kur.** Görselleri aşağıdaki adlarla yükle; prompt içinde bu adlarla anacağız:

| Ingredient adı | Ne yükleyeceksin | İpucu |
|---|---|---|
| `STIL-safak` `STIL-gece` `STIL-gemi` `STIL-koloni` | Her ışık modu için 1-3 stil karesi | Stil referansında **kişi olmasın**, sadece manzara ve ışık. Yoksa Veo o kişiyi de sahneye taşır |
| `Azi` `Levi` `Ursula` `Barry` `Kris` `Kamen` `Mia` | Her karakter için önden, yandan ve yakın plan birer temiz görsel | **Düz ya da sade arka planlı** görseller seç. Arka plan kalabalıksa karaktere karışır |
| `YavruLevi` `Demeter` | Bebek Levi ve gemi enkazı referansı | Aynı şekilde sade arka plan |
| `C01-sisyuzucu` `C02-altintasiyici` `C03-dagotlakcisi` ... | Özgün canlıların onaylanan tasarımları | Bunları önce Nano Banana ile kendimiz üreteceğiz (bkz. adım 3) |

> ⚠️ **Kullanım koşulları:** 1. sezon karelerini yüklemeden önce Flow'un ve Google'ın üretken yapay zekâ kullanım politikalarına bak. Projemiz ticari değil, ama sahibi olmadığın görsellerin yüklenmesi araç koşullarına tabi.

---

## 3. Üretim akışı (her kare için)

```
1. Anahtar kare (Nano Banana 2.1)  →  2. Düzeltme (kement ile)  →  3. Onay  →  4. Video (Frames)  →  5. Gerekirse Extend  →  6. İndir, DaVinci'ye aktar
```

1. **Anahtar kareyi üret.** Önce 4 varyasyon üret, en iyisini seç. Görsel üretimi ücretsiz, burada istediğin kadar dene.
2. **Düzelt.** Hataları kement aracıyla seçip düzelt ("bu böceğin altı bacağı olsun", "bu yazıyı kaldır").
3. **Onayla.** Kareyi bana ya da yönetmen agent'ına göster. Video kredisi harcamadan önce kare doğru olmalı.
4. **Videoya çevir.** Çoğu plan için **Frames** modunu kullan. Bitiş karesi gereken planlar aşağıda.
5. **Uzat.** 8 saniyeden uzun planlarda Extend kullan.
6. **İndir.** Klipleri indir ve kurguyu DaVinci Resolve'da yap.

### Hangi plan hangi modda?
| Mod | Planlar | Neden |
|---|---|---|
| **Frames: başlangıç + bitiş karesi** | **P07** (kapalı tomurcuk → açılmış çiçek) · **P08** (açıklığın yakın görünüşü → yukarıdan solmuş halka) · **P17** (uzanan el → yumruk) · **P18a** (karanlık duvar → duvardaki Vesta görüntüsü) | Bir hâlden diğerine geçen planlar. Bitiş karesini vermek Veo'nun yolunu kontrol etmeni sağlar |
| **Frames: sadece başlangıç karesi** | P01, P02, P03, P04, P05, P06, P09, P10, P11, P12, P13, P14, P15, P16, P18b, P19 | Kadraj sabit, sadece içinde hareket var |
| **Ingredients ile video** | İlk testte kullanma | Kompozisyonu Veo'ya bırakır; storyboard'a sadık kalmak zorlaşır. Frames sonuç vermezse yedek yöntem |

---

## 4. Promptları Flow'a uyarlama

`pilot-storyboard.md`'deki promptlar her araçta çalışacak şekilde "blok" yapısında yazıldı. Nano Banana ise **akıcı, doğal cümlelerle** daha iyi çalışıyor. Flow'da şu kuralları uygula:

1. **Referansı adıyla an.** Promptlarda `[REF: Azi]` yazan yerde, o görseli ingredient olarak ekle ve cümlede adıyla an: *"the woman from the `Azi` reference"*. Google da promptta hangi ingredient'a dayandığını açıkça yazmayı öneriyor.
2. **Stil referansını başta söyle.** Her promptun ilk cümlesi: *"Match the art style, line quality and colors of the `STIL-safak` reference exactly."*
3. **`[STİL]` bloğunu sona ekle.** Referans stili taşır, blok onu pekiştirir.
4. **Negatif prompt alanı yoksa** (doğrulanmadı), `[NEG]` listesini cümle olarak yaz: *"Avoid any 3D, glossy, photorealistic look, thick black outlines, text and watermarks."*
5. **Karakterin görünüşünü yazma.** Sadece poz, hareket ve ifade.
6. **Video promptunda kamerayı ilk cümlede söyle:** *"Locked camera."* ya da *"Very slow push-in."*
7. **Ses:** Veo kendi sesini üretiyor. Kapatma seçeneği olup olmadığı doğrulanmadı. Seçenek yoksa kurguda klibin sesini sil; bizim ses tasarımımız ayrı yapılacak.

---

## 5. Hazır Flow promptları: stil testi (P01, P07, P12)

### P01 · Sisli vadi
**Ingredients:** `STIL-safak`
**Görsel (Nano Banana 2.1):**
```
Match the art style, line quality and colors of the STIL-safak reference exactly. A very wide, calm shot of a misty valley at dawn on an alien planet. Soft layered hills fade into pale haze, with strange tall plant silhouettes on the ridges. In the middle distance, several blanket-sized, translucent, ray-like creatures glide slowly through the mist; their thin pale membranes show branching veins and they have no visible eyes. Behind them drifts a thin trail of glowing gold motes flowing toward the right side of the frame; this gold is the only saturated, glowing thing in the image. Low horizon, vast and quiet. Flat-color 2D animation art with a hand-drawn look, thin even dark-colored linework (never pure black), flat fills with one soft shadow tone, subtle paper grain, soft diffused light, strong aerial perspective, muted pastel dawn palette of cream, soft peach, dusty mint and light lilac. Avoid any 3D, glossy or photorealistic look, thick black outlines, text and watermarks.
```
**Video (Frames, sadece başlangıç):**
```
Very slow pan to the right. The translucent creatures glide gently to the right through the mist, the mist drifts slowly, and the gold motes float along with them. Calm, no sudden motion, the art style stays exactly the same as the image.
```

### P07 · Doğum (başlangıç + bitiş karesi)
**Ingredients:** `STIL-safak`, `YavruLevi`
**Görsel 1 - başlangıç karesi (kapalı tomurcuk):**
```
Match the art style, line quality and colors of the STIL-safak reference exactly. Close-up of a single knee-high flower bud in a small forest clearing at dawn. The bud is closed and perfectly still, glowing faintly from inside with warm gold light. Thin golden currents flow into it from the surrounding plants. Quiet, holding its breath. Flat-color 2D animation art with a hand-drawn look, thin even dark-colored linework, flat fills, subtle paper grain, soft diffused light, muted pastel palette where the gold is the only saturated color. Avoid any 3D, glossy or photorealistic look, thick black outlines, text and watermarks.
```
**Görsel 2 - bitiş karesi (açılmış çiçek):** Görsel 1'i ingredient olarak da ekle ki çiçek ve arka plan aynı kalsın.
```
Match the art style, line quality and colors of the STIL-safak reference and keep the same flower and background as the previous image. The same flower is now fully open, its petals unfolded outward. Inside it lies a tiny palm-sized newborn, exactly like the YavruLevi reference, curled up and glowing warm gold. Light spills out of the flower onto the surroundings; this is the most luminous moment of the scene. Same flat-color 2D hand-drawn style. Avoid any 3D, glossy or photorealistic look, text and watermarks.
```
**Video (Frames, başlangıç = Görsel 1, bitiş = Görsel 2):**
```
Locked camera with a very slow push-in. The closed bud trembles slightly, then its petals slowly unfold, warm golden light blooms outward, and the tiny newborn inside stirs once. Smooth, slow, magical. The art style stays exactly the same.
```
> Kurguda: Görsel 1'in **hareketsiz** hâli 1-2 saniye ekranda kalacak (müzikteki "tam sessizlik" anı), sonra bu klip başlayacak.

### P12 · Ritüel salonu
**Ingredients:** `STIL-gemi`, `YavruLevi`
**Görsel:**
```
Match the art style, line quality and colors of the STIL-gemi reference exactly. A wide, symmetrical shot of a tall ritual hall inside a strange ship, with ribbed, bone-like walls. In the center stands a raised altar where a tiny glowing newborn rests, exactly like the YavruLevi reference; its small golden glow is the only warm light in the room. On both sides, rows of silent masked figures bow slowly toward the altar. They wear long layered robes of undyed pale cloth, smooth ivory-bone masks with no mouth and two narrow eye slits, a small flower motif carved into each mask's forehead, and feet wrapped in strips of cloth. Dust floats in the cold, dim light. Bone and ivory surfaces, oxidized copper-green details, dark plum shadows. Flat-color 2D animation art with a hand-drawn look, thin even dark-colored linework, flat fills, subtle paper grain. Avoid any 3D, glossy or photorealistic look, thick black outlines, text and watermarks.
```
**Video (Frames, sadece başlangıç):**
```
Locked camera. The masked figures bow slowly one after another, their robes moving softly, and the small golden glow on the altar pulses gently like a heartbeat. Solemn and quiet. The art style stays exactly the same.
```

---

## 6. Diğer 16 kare
`pilot-storyboard.md`'deki promptları 4. bölümdeki 7 kurala göre dönüştür. İstersen her kareyi bana söyle, Flow'a hazır hâlini yazayım.

## 7. Kredi tasarrufu
- **Bütün denemeleri görselde yap.** Görsel ücretsiz, video kredi harcıyor.
- Video için önce **tek çıktı** üret. Beğenmezsen promptu düzelt, sonra çoğalt.
- Videoyu 1080p'ye yükseltmeyi (upscale) sadece **onaylanan** kliplerde yap.

## 8. Kayıt
Her üretimde `proje/uretim/log.md` dosyasına şunları yaz: kare no, kullanılan ingredient'lar, prompt, model, kaç deneme yapıldı, sonuç (✅/❌) ve ne düzeltildi.
