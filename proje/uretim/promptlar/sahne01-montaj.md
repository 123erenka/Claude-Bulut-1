# Sahne 1 - Vesta Montajı: Prompt Şablonları (v0.1)

> Durum: **Taslak.** Hazırlayan: `animasyon-uretim`, 2026-10-08 (T-001).
> Dayanak: `proje/hikaye/bolum01-senaryo.md` (plan 1a-1i), `proje/stil/stil-rehberi.md`, `proje/uretim/pipeline.md`
> Promptlar araçlarda daha tutarlı çalıştığı için **İngilizce**; açıklamalar Türkçe.
> Kurallar: Promptlarda dizinin adı, yaratıcıları, orijinal kareler ya da başka sanatçı adları **yok**. Görsel dil yalnızca kelimelerle ve projenin kendi stil kareleriyle (`--sref`) tarif edilir. Bu sahnede insan karakter yok.

---

## 0. Nasıl kullanılır
1. Her plan için önce **anahtar kare (KF)** promptu → Midjourney.
2. Seçilen kare Nano Banana Pro'da **rötuş/bitiş karesi** promptuyla düzeltilir (gerekiyorsa).
3. Sonra **hareket (VID)** promptu → Kling 3.0 Image-to-Video (ya da karşılaştırma testinde Seedance/Veo; aynı metin kullanılabilir).
4. Köşeli parantezli bloklar **her seferinde aynen** yapıştırılır: `[STİL]`, `[NEG]`, `[ALTIN]`, `[C0X]`. Blok metni değişirse sürüm numarası artırılır (v0.1 → v0.2) ve eski çıktılar o sürümle etiketli kalır.
5. Her üretimde prompt, parametreler, seed (MJ) ve sonuç `proje/uretim/s01/s01_log.md` içine yazılır.

### 0.1 Sabit bloklar
**[STİL] v0.1**
```
flat-color 2D animation background art, hand-drawn look, thin even linework in dark colored lines (never pure black), flat cel fills with at most one soft shadow tone, subtle paper grain and fine stipple texture, delicate hatching on organic surfaces, soft diffused atmospheric light, strong aerial perspective where distant shapes fade into the pale sky color and lose their outlines, muted pastel palette, clean graphic shapes, ligne-claire-influenced science-fiction illustration, quiet, strange and beautiful
```

**[NEG] v0.1** (Midjourney'de `--no` ile, Kling'de "Negative prompt" alanına)
```
3d render, cgi, photorealistic, photograph, glossy, plastic, specular highlights, airbrushed gradients, thick black outlines, anime eyes, chibi, cute mascot, neon, oversaturated, hdr, lens flare, bokeh, depth of field blur, text, letters, watermark, logo, signature, frame border, people, human figures
```
> Midjourney'de `--no` kısa listelerle daha iyi çalışır. Uzunsa şu çekirdeği kullanın: `--no 3d render, photorealistic, glossy, thick black outlines, text, watermark, people`

**[ALTIN] v0.1**
```
a thin luminous golden life-current made of drifting motes of warm gold light and tiny glowing spores, flowing steadily toward the right side of the frame; the gold is the only saturated, glowing element in the image, with a soft small glow
```

**[ŞAFAK PALETİ] v0.1**
```
pale dawn palette: cream, soft peach, dusty mint, light lilac, misty pale sky; cool lilac-blue shadows
```

### 0.2 Canlı tanım blokları (v0 = taslak; model sheet onayı sonrası v1 ile değiştirilecek)
**[C01 SİS YÜZÜCÜSÜ] v0**
```
mist-swimmers: flat, blanket-sized, translucent ray-like gliding creatures, bodies made of a thin pale membrane with branching visible veins, softly rippling edges, no visible eyes, faint gold pollen dust trailing behind them
```
**[C02 ALTIN TAŞIYICI] v0**
```
gold-carrier: a palm-sized six-legged insect with a segmented shell in dark mustard and pale turquoise, exactly six thin jointed legs, two long thin antennae, a shallow cup-shaped hollow on its back holding one round glowing gold spore, fine hatching on the shell
```
**[C03 DAĞ OTLAKÇISI] v0**
```
mountain grazer: a colossal, slow four-legged creature as large as a mountain, its broad back covered by an entire forest and mossy meadows, legs like weathered rock pillars, a small low-hanging head, half-dissolved in distant haze, seen from very far away
```
**[C04 NEFES ALAN ÇİÇEK] v0**
```
breathing flower: a knee-high bulbous flower with thick, fleshy, ribbed petals in cream and coral, a dark velvety center; it slowly opens and closes like a lung and releases a puff of gold dust each time it opens
```
**[C05 ÇİY CANLILARI] v0**
```
microscopic translucent creatures with tiny curling tails swimming inside the water drop, drawn as simple flat shapes
```
**[C06 GÖL GÖLGESİ] v0**
```
a vast, dark, elongated shadow gliding beneath the water surface, its shape never fully readable, no details
```
**[C07 ZAR BİTKİSİ] v0**
```
membrane plants: tall thin reed-like stalks three meters high, each topped by a sail-like translucent membrane with branching veins, rippling in the wind like slow flags
```
**[C08 DOĞUM ÇİÇEĞİ] v0** (yönetmen onayı bekliyor)
```
birth flower: a large closed flower bud as tall as a person, its pale petals tightly folded, softly glowing gold from within, standing alone in the center of a small forest clearing
```

### 0.3 Ortak ayarlar
**Midjourney (anahtar kare)**
```
--ar 16:9 --style raw --sref <STIL_01..06 URL'leri> --sw 300 --stylize 150 --seed <rastgele, kaydet>
```
- `--sw` (stil ağırlığı) 200-500 arası dene; stil kayıyorsa artır. `--stylize` düşük tutulursa promptu daha harfiyen izler.
- V8'de parametre adları ve aralıkları değişmiş olabilir; MJ belgelerinden doğrulayın (bu ortamdan okunamadı).
- Stil kareleri onaylanmadan önceki ilk turda `--sref` yerine sadece `[STİL]` bloğu kullanılır.

**Kling 3.0 (hareket)**
- Mod: Image to Video · Model: 3.0 (referanslı/çok öğeli işlerde 3.0 Omni) · Oran: 16:9 · Çözünürlük: 1080p · **Native audio: kapalı** · Süre: 5 ya da 10 sn · Test = standart mod, final = pro mod.
- Kling'de seed yok: başlangıç karesi + prompt + ayarları kayda yazın.
- Hareket promptu yapısı: **[ne hareket ediyor, nasıl, ne hızda] + [kamera] + [stil koruma cümlesi]**. Kısa tutun; uzun hareket promptları stil kaymasını artırır.

**[STİL KORUMA] v0.1** (her hareket promptunun sonuna)
```
keep the exact flat 2D hand-drawn style, thin colored linework and flat colors of the source image; no 3D shading, no new objects, no flicker
```

---

## 1a - Çiy damlası (ÇYP, sabit, 0:12) · Yöntem A
**Amaç:** Sessiz açılış. Mikro dünya. Damla uzar, kopar; toprağa düştüğü yerde altın pırıltı.

**KF (Midjourney)**
```
extreme close-up of the tip of a single curled leaf at dawn, one large clear dew drop hanging from the tip, inside the drop [C05 ÇİY CANLILARI], the drop refracts a tiny upside-down image of the pale sky, the background is soft flat color shapes of distant foliage, a small patch of dark soil far below at the bottom right with a faint gold glimmer, [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, glossy, water splash realism, text, people
```

**Bitiş karesi (isteğe bağlı, Nano Banana Pro düzenleme):** Gerekmez; damlanın kopması tek başlangıç karesiyle üretilir.

**VID (Kling)**
```
the dew drop slowly swells and stretches at the leaf tip while the tiny creatures inside drift and curl, then the drop detaches and falls out of frame; a brief soft gold glimmer appears on the soil below; the leaf springs back slightly; locked-off static camera, [STİL KORUMA]
```
Negatif ek: `camera movement, zoom, splash, realistic water simulation`
**QC odak:** Damla içindeki canlılar düz şekil olarak kalmalı (gerçekçi mikroskop görüntüsüne kaymasın). Süre 12 sn: 10 sn klip + son karede 2 sn hold.

---

## 1b - Sisli vadi (GP, sağa hafif kaydırma, 0:12) · Yöntem C
**Amaç:** İlk manzara. Ölçek ve atmosfer. Sis yüzücüleri altın toz izi bırakıyor.

**KF (Midjourney)** - kaydırma payı için geniş üret
```
wide landscape of a deep misty valley at dawn, layered silhouettes of strange rounded hills and tall fungal trees fading into pale haze, a slow river of mist filling the valley floor, several [C01 SİS YÜZÜCÜSÜ] gliding inside the mist at different distances, [ALTIN], [ŞAFAK PALETİ], low horizon, very calm, [STİL] --ar 21:9 --style raw --sref <...> --no 3d render, photorealistic, people, text
```
> 21:9 üretilir; kamera sağa kaydığı için 16:9 kadrajdan daha geniş görsel gerekir.

**Katmanlama (Krita):** Ön plan tepe silüeti / sis + sis yüzücüleri / uzak tepeler / gökyüzü (4 katman).

**VID (Kling)** - yalnızca sis yüzücüleri katmanı için, düz zemin üzerinde
```
three translucent membrane creatures glide slowly from left to right inside drifting mist, their rippling edges undulating gently, a faint trail of gold dust following them; static camera, [STİL KORUMA]
```
**Kamera (Resolve Fusion):** 12 sn'de kadraj genişliğinin ~%8'i kadar sağa kaydırma, ease-in/ease-out. Ön plan katmanı arkaya göre ~2 kat hızlı (parallax).
**QC odak:** Sis yüzücüleri balık ya da kuş gibi görünmemeli; kanat çırpma yok, dalgalanma var.

---

## 1c - Altın taşıyıcı (DP, sabit, 0:12) · Yöntem A (başlangıç + bitiş karesi)
**Amaç:** Akımın "taşınması". Spor köke bırakılır ve emilir.

**KF başlangıç (Midjourney)**
```
macro close-up of a thick twisting tree root surface with fine bark hatching and a narrow dark crack in it, [C02 ALTIN TAŞIYICI] walking along the root from the left toward the crack, the gold spore glowing on its back, soft blurred flat-color moss shapes in the background, [ALTIN], [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, glossy, extra legs, text, people
```

**Bitiş karesi (Nano Banana Pro düzenleme, başlangıç karesi yüklenerek)**
```
Edit this image: keep everything identical (style, colors, linework, composition, the insect's design). Move the insect slightly to the right so it stands right next to the crack, its back cup is now empty, and the gold spore is half sunk into the crack, glowing softly. Do not change anything else.
```

**VID (Kling, başlangıç + bitiş karesi)**
```
the small six-legged insect walks slowly along the root with careful stepping legs, stops at the crack, tilts its back and the glowing gold spore rolls into the crack and is softly absorbed with a faint pulse of light; locked-off static camera, [STİL KORUMA]
```
Negatif ek: `extra legs, missing legs, morphing body, camera movement`
**QC odak:** **Bacak sayısı (6)** her karede. Bozulursa: hareketi kısalt (5 sn) + 2 sn başlangıç hold.

---

## 1d - Dağ otlakçısı (GP çok geniş, çok yavaş yaklaşma, 0:14) · Yöntem C
**Amaç:** Ölçek ve ihtişam. Dev bir adım, yükselen altın spor bulutu.

**KF (Midjourney)**
```
extremely wide view of distant pale mountains at dawn, on a long gentle slope [C03 DAĞ OTLAKÇISI] mid-step, so large that its forested back merges with the mountain ridge, a soft cloud of gold spores rising from where its front foot touches the ground, layered haze between foreground hills and the creature, tiny trees in the foreground for scale, [ALTIN], [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, text, people
```

**Katmanlama:** ön plan tepeler + ağaçlar / pus / canlı + dağ / gökyüzü.

**VID (Kling)** - canlı katmanı (dağ ve canlı birlikte, ön plan maskelenmiş)
```
the colossal creature very slowly completes one heavy step, its forested back sways almost imperceptibly, a soft cloud of gold spores billows up from the ground under its foot and drifts to the right; extremely slow motion, enormous scale, static camera, [STİL KORUMA]
```
Negatif ek: `fast movement, walking cycle, running, camera movement, zoom`
**Kamera (Resolve Fusion):** 14 sn'de %4-5 yavaş zum (push-in), katmanlar arası hafif parallax.
**QC odak:** Hız. AI dev canlıyı hızlı yürütürse klibi %50-70 yavaşlat ya da yalnızca spor bulutunu AI ile üretip canlıyı sabit bırak. 9c'de bu silüet yeniden kullanılacak: silüeti ayrı katman olarak sakla.

---

## 1e - Kök kesiti (OP, yavaş aşağı kaydırma, 0:12) · Yöntem B
**Amaç:** Görünmeyen ağ. Akım köklerde nabız gibi atıyor.

**KF (Midjourney)** - dikey uzun görsel
```
cross-section view of the underground: from a thin strip of grass and soil surface at the top down into a deep dense web of intertwined roots of many thicknesses, layered soil bands in earthy muted tones, small stones and tiny burrowing creatures, glowing gold light running inside the roots like veins, [ALTIN], [STİL] --ar 9:16 --style raw --sref <...> --no 3d render, photorealistic, text, people
```
> 9:16 çıktıyı Krita'da 1920 px genişliğe ölçekleyip 1920×3240 olacak şekilde üst/alt genişletin (Nano Banana Pro ya da Krita AI Diffusion ile genişletme). Altın damarları **ayrı katmanda** tutun (maske için).

**Hareket (Resolve Fusion, AI video yok):**
- Görsel yukarıdan aşağıya 12 sn'de kaydırılır (ease-in/out).
- Nabız: altın damar katmanından maske → Glow → kökler boyunca soldan sağa kayan bir parlaklık dalgası, yaklaşık 60 BPM (ses pipeline'ındaki nabızla aynı tempo).
**QC odak:** Nabız ritmi müzikteki nabızla senkron (ses pipeline'ı, tempo haritası).

---

## 1f - Nefes alan çiçek (DP, hafif nefes ritminde zum, 0:10) · Yöntem A (döngü)
**Amaç:** Montajın sakin "nefesi". Sahne 2k'deki solmuş eşiyle bağ.

**KF (Midjourney)** - çiçek açık hâlde
```
close-up of [C04 NEFES ALAN ÇİÇEK] fully open, gold dust drifting from its center toward the right, a tiny translucent winged creature hovering just above it, soft flat-color leaves and stems around, [ALTIN], [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, glossy, text, people
```

**Ek kare (Nano Banana Pro):** Aynı kareden **kapalı** hâl
```
Edit this image: keep everything identical. The flower's fleshy petals are now gently closed into a rounded bulb, no gold dust is visible, the tiny creature is gone. Do not change style, colors, linework or composition.
```
> Bu kapalı kare ve **solmuş varyantı** (2k için: "the same flower, closed, drained of color, grey and dried, petals slightly shriveled") aynı oturumda üretilip saklanır.

**VID (Kling)** - iki klip: (1) başlangıç = kapalı, bitiş = açık; (2) başlangıç = açık, bitiş = kapalı → arka arkaya = döngü
```
the fleshy flower slowly opens like a breathing lung, releasing a soft puff of gold dust that drifts to the right; a tiny translucent creature lands gently on a petal; slow, calm, rhythmic; static camera, [STİL KORUMA]
```
**Kamera (Resolve):** Nefes ritminde %1-2 zum içeri/dışarı (keyframe ile).
**QC odak:** Çiçek başka bir çiçeğe "morf" olmamalı; taç yaprak sayısı sabit.

---

## 1g - Göl (GP, sabit, 0:12) · Yöntem B
**Amaç:** Gizem. Suyun altından geçen ve hiç tam görünmeyen bir şey.

**KF (Midjourney)** - göl boş, gölge sonradan eklenecek
```
wide view of a vast still lake at dawn, mirror-like surface reflecting pale sky and soft hills, scattered small glowing seeds floating on the surface in a gentle line drifting toward the right, reeds and strange plants at the near shore, misty far shore, very calm, [ALTIN], [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, people, boats, text
```

**Katmanlama:** gökyüzü + uzak kıyı / su yüzeyi / tohumlar (ayrı) / yakın kıyı bitkileri.
**Hareket (Resolve Fusion):**
- Tohumlar: ayrı katmandan kopyalanıp 12 sn'de sağa ~%5 kaydırma + hafif yukarı-aşağı salınım (ya da Fusion parçacık sistemi).
- **[C06 GÖL GÖLGESİ]:** Krita'da çizilmiş, uzun, koyu, yumuşak kenarlı bir şekil; su katmanının altına konur, %20-30 opaklık, yoğun bulanıklık, 8-10 sn'de soldan sağa geçer. Geçerken yüzeyde çok hafif bir halka (displace).
- Su yüzeyine çok hafif dalga (Displace + yavaş gürültü).
**QC odak:** Gölge "balık" ya da "canavar" olarak okunmamalı; yalnızca büyüklük hissi.

---

## 1h - Zar bitkileri (OP, rüzgârla salınım, 0:10) · Yöntem A
**Amaç:** Akımın havada da taşındığını göstermek; Yaşam akımı motifinin ilk tınısı burada.

**KF (Midjourney)**
```
medium shot of a field of [C07 ZAR BİTKİSİ] against a pale dawn sky, the membranes backlit so their branching veins show, gold light pulsing inside the veins, gold motes drifting off the membranes toward the right, a few seed pods on the stalks, [ALTIN], [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, flags, fabric, text, people
```

**VID (Kling)**
```
the tall thin stalks sway slowly in a steady wind, the translucent membranes ripple and billow like sails, gold light pulses through their veins and small gold motes drift off to the right; gentle, continuous motion; static camera, [STİL KORUMA]
```
Negatif ek: `fabric, cloth flags, camera movement, flicker`
**QC odak:** Zarlar kumaş bayrağa dönüşmemeli; damarlar karede sabit kalmalı (kaynama yok).

---

## 1i - Takip ve açıklık (Takip, kamera akımı izler, 0:11) · Yöntem A (başlangıç + bitiş karesi)
**Amaç:** Bütün akımların birleşmesi ve sahne 2'ye kesintisiz geçiş. **Montajın en riskli planı.**

**KF başlangıç (Midjourney)**
```
inside a dim dawn forest of tall strange trees with hanging membranes and fungal shelves, many thin golden currents from different directions merging into one bright flowing river of gold motes that runs between the trunks toward the right and into the depth of the frame, a soft bright opening visible far ahead between the trees, [ALTIN], [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, text, people
```

**KF bitiş = açıklık (Midjourney + Nano Banana Pro)** - **sahne 2a'nın ortamıyla birebir aynı olmalı**
```
a small round forest clearing at dawn seen from the edge of the trees, in its center [C08 DOĞUM ÇİÇEĞİ], the river of gold motes flowing across the grass into the base of the flower, the flower glowing a little brighter, soft light falling into the clearing, the surrounding plants and creatures vivid and alive, [ALTIN], [ŞAFAK PALETİ], [STİL] --ar 16:9 --style raw --sref <...> --no 3d render, photorealistic, text, people
```
> **Karakter yok.** Senaryoya göre 2a'da Azi ve Levi çiçeğin başında. Önerim: 1i, çiçeğe odaklı ve karakterler kadraj dışında biter; 2a'da hareket yavaşlayıp genişleyerek karakterleri gösterir. Karakterli kareler kullanıcının model sheet'lerinden çizilir. **Bu sahneleme yönetmen onayı bekliyor (T-003).**
> Bu bitiş karesi aynı zamanda sahne 2'nin **ortam referansı** ve 2j'deki solmuş varyantın kaynağıdır.

**VID (Kling, başlangıç + bitiş karesi)**
```
smooth continuous forward tracking shot gliding low between the tree trunks, following the river of gold motes, the trees part and the camera emerges into the clearing, slowing down as it approaches the glowing flower bud; steady, dreamlike, no shake, [STİL KORUMA]
```
Negatif ek: `camera shake, fast motion, cuts, people, morphing trees`
**Yedek plan:** Tek klip tutmazsa 2 parça: (1) orman içi takip (5 sn, yalnız başlangıç karesi), (2) ormandan açıklığa çıkış (5-6 sn, başlangıç = 1. klibin son karesi, bitiş = açıklık karesi). Birleşme noktasında Resolve'de 4-6 karelik çapraz geçiş.
**QC odak:** Son kare ile açıklık karesi birebir (çiçek tasarımı, renk). Ağaçlar kayarken eriyip birleşmemeli.

---

## Üretim sırası önerisi (risk ve öğrenme eğrisine göre)
1. **1h** (en kolay AI hareketi: araç ve ayarları öğrenmek için)
2. **1f** (döngü tekniği)
3. **1e, 1g** (Fusion 2.5D tekniği)
4. **1b, 1d** (hibrit)
5. **1a, 1c** (ince hareket, anatomi riski)
6. **1i** (en riskli; sahne 2 tasarımları netleşince)
