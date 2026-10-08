# Pilot - Storyboard ve Yapay Zekâ Promptları (v1)

> Durum: **Taslak, ilk üretim testi için hazır.** Hazırlayan: ana oturum (yönetmen + üretim), 2026-10-08.
> Dayanak: `proje/hikaye/bolum01-senaryo.md`, `proje/stil/stil-rehberi.md`, `proje/uretim/pipeline.md`, `proje/uretim/promptlar/sahne01-montaj.md`
> Bölümün tamamı değil, **hikâyeyi taşıyan 19 kare** seçildi. Bu kareler bölümün storyboard'u gibi: sırayla dizildiğinde bölüm baştan sona okunabilir. Önce bunları üretip onaylıyoruz, aradaki planlar bu karelerin stilinden türetilecek.
> Promptlar **İngilizce** (araçlar İngilizcede daha tutarlı), açıklamalar Türkçe.
> **Ana araç Google Flow + Nano Banana 2.1.** Bu promptları Flow'a uyarlama kuralları ve hazır stil testi promptları: `proje/uretim/flow-rehberi.md`

---

## 0. Önce oku: önemli uyarılar

1. **Promptlara dizinin adını yazma.** "Scavenger Reign style" ya da yaratıcıların adını yazmak çoğu araçta işe yaramaz. Bazı araçlar bu tür istekleri zayıflatıyor ya da reddediyor. Stili iki şey taşır:
   - aşağıdaki **[STİL]** bloğu (görsel dilin kelimelerle tarifi),
   - senin eklediğin **referans görseller** (stil referansı ve karakter referansı).
2. **Karakterler referansla gelir, promptla değil.** Azi, Levi, Ursula, Barry, Kris, Kamen, Mia ve Demeter için promptlarda yalnızca **poz, hareket ve ifade** yazıyor. Görünüşleri senin ekleyeceğin `[REF: ...]` görsellerinden gelecek. Karakterin görünüşünü prompta uzun uzun yazma; referansla çatışır ve tutarlılığı bozar.
3. **Kullanım koşulları:** Orijinal dizinin karelerini bir araca referans olarak yüklemeden önce o aracın koşullarına bak. Bazı araçlar sahibi olmadığın görsellerin yüklenmesini kısıtlıyor. Ayrıca Midjourney'in Basic ve Standard planlarında ürettiğin her şey herkese açık galeride görünür.
4. **Her karede tek karakter, tek hareket.** Birden fazla referanslı karakteri aynı karede üretmek tutarlılığı bozar. İki karakterli karelerde (P05, P15, P18) önce arka planı üret, karakterleri ayrı ayrı ekle (Nano Banana Pro gibi çoklu referanslı düzenleyicide) ya da Krita'da birleştir.
5. **Video kısa ve yavaş olsun.** Görselden videoya kliplerde 5-10 saniye, tek bir hareket. Kamera için mutlaka yaz: `locked camera` ya da `very slow push-in`. Yazmazsan araç kamerayı gereksiz yere oynatır.
6. **Altın akım her zaman sağa akar.** Montajdaki bütün karelerde (P01-P05) altın akım ekranın sağına doğru gitmeli. Kurgu bunun üzerine kurulu.
7. **Sabit blokları değiştirmeden yapıştır.** `[STİL]`, `[NEG]`, `[ALTIN]` ve diğer bloklar her promptta aynen kullanılır. Değiştirirsen sürüm numarasını artır (v1 → v2).
8. **Kalite kontrol:** Her çıktıda şunlara bak:
   - el ve parmak sayısı, böceklerde bacak sayısı (altı),
   - çizgilerin kareden kareye titremesi,
   - 3D/plastik görünüm,
   - yazı ya da filigran.
   Sorunlu kareyi at, düzeltmeye çalışma; yeniden üret.
9. **Kayıt tut:** Her üretimde prompt, araç, seed ve sonucu `proje/uretim/log.md` dosyasına yaz. Beğendiğin karenin seed'i, sonraki karelerin tutarlılığı için altın değerinde.
10. **Ses:** Kling ve Veo gibi araçlar videoya kendi seslerini ekleyebiliyor. Bunu **kapat.** Ses ayrı tasarlanacak (`proje/ses/ses-muzik-rehberi.md`).

---

## 1. Sabit bloklar

**[STİL] v1**
```
flat-color 2D animation art, hand-drawn look, thin even linework in dark colored lines (never pure black), flat cel fills with at most one soft shadow tone, subtle paper grain and fine stipple texture, delicate hatching on organic surfaces, soft diffused atmospheric light, strong aerial perspective where distant shapes fade into the pale sky color and lose their outlines, muted pastel palette, clean graphic shapes, ligne-claire-influenced science-fiction illustration, quiet, strange and beautiful, 16:9 cinematic frame
```

**[NEG] v1**
```
3d render, cgi, photorealistic, photograph, glossy, plastic, specular highlights, airbrushed gradients, thick black outlines, anime eyes, chibi, cute mascot, neon, oversaturated, hdr, lens flare, bokeh, depth of field blur, text, letters, watermark, logo, signature, frame border, extra fingers, extra limbs
```
> Midjourney'de kısa hâli: `--no 3d render, photorealistic, glossy, thick black outlines, text, watermark`

**[ALTIN] v1**
```
a thin luminous golden life-current made of drifting motes of warm gold light and tiny glowing spores, flowing steadily toward the right side of the frame; the gold is the only saturated, glowing element in the image, with a soft small glow
```

**[ŞAFAK] v1**
```
pale dawn palette: cream, soft peach, dusty mint, light lilac, misty pale sky; cool lilac-blue shadows
```

**[SOLMA] v1**
```
the same plants and creatures drained of color: desaturated grey-lilac and ash tones, wilted, curled and dry, lifeless, cold muted light
```

**[GECE] v1**
```
night palette: deep indigo and night purple sky, small soft points of cyan-green bioluminescence on plants, pale cold starlight, low contrast, calm
```

**[GEMİ İÇİ] v1**
```
cult ship interior palette: bone and ivory surfaces, oxidized copper-green details, dark plum shadows, cold dim light; the only warm light source is a small golden glow
```

**[KOLONİ AKŞAM] v1**
```
warm evening palette: soft orange and amber lantern light against dusky violet-blue surroundings, long soft shadows
```

### Özgün tasarım blokları (bu projeye ait; referans gerekmez)
**[MASKELİLER] v1**
```
silent masked cult figures in long layered robes of undyed pale cloth, faces fully covered by smooth ivory-bone masks with no mouth and two narrow eye slits, a small flower motif carved into the forehead of the mask, feet wrapped in strips of cloth, slow solemn posture
```
**[TARİKAT GEMİSİ] v1**
```
an enormous slow-moving ship that looks half-built and half-grown: ribbed bone-white hull sections like a giant spine, patches of oxidized copper plating, long trailing tendril-like antennae, tiny warm lights along its flank, drifting silently past stars
```
**[FENER SÜMÜKLÜSÜ] v1**
```
lantern slug: a slow, loaf-sized, soft-bodied creature with a translucent pale back that glows soft amber when fed a leaf
```
**[PUSU KABUĞU] v1**
```
ambush shell: a round creature that looks exactly like a smooth grey stone when closed; when it opens, the shell splits into two hinged halves revealing a pale ribbed inner body and short hooked limbs
```
> Montajdaki canlıların blokları (`[C01]`-`[C06]`): `proje/uretim/promptlar/sahne01-montaj.md`

### Referans yuvaları (görselleri sen ekleyeceksin)
| Yuva | Ne eklenecek |
|---|---|
| `[REF: STİL]` | Onaylanan stil kareleri (yoksa 1. sezondan seçtiğin, sahnenin ışığına benzeyen 1-3 kare) |
| `[REF: Azi]` `[REF: Levi]` `[REF: Ursula]` `[REF: Barry]` `[REF: Kris]` `[REF: Kamen]` `[REF: Mia]` | Her karakter için önden, yandan ve yakın plan birer temiz referans |
| `[REF: Yavru Levi]` | 1. sezon finalindeki bebek Levi'nin referansı |
| `[REF: Demeter]` | Gemi enkazının dış görünüş referansı |

---

## 2. Storyboard - 19 kare

**Kısaltmalar:** KF = anahtar kare (görsel promptu) · VID = hareket (görselden videoya promptu) · ☀ sıcak · ❄ soğuk

### Bölüm A - Vesta montajı ve doğum (sahne 1-2)

#### P01 · Sahne 1b · Sisli vadi (açılış kuruluş planı) ☀
*Bölümün ilk geniş planı. İzleyiciyi Vesta'ya geri sokar.*
- **Kadraj:** Çok geniş plan, alçak ufuk, sis vadinin içini dolduruyor.
- **Referans:** `[REF: STİL]`
- **KF:**
```
[STİL] [ŞAFAK] a wide misty valley at dawn on an alien planet, layered soft hills fading into pale haze, strange tall plant silhouettes on the ridges, several [C01 SİS YÜZÜCÜSÜ] gliding slowly through the mist in the middle distance, [ALTIN] trailing behind them, low horizon, vast and calm
```
- **VID:** `very slow pan to the right, the mist-swimmers glide gently to the right, mist drifting slowly, golden motes floating, calm, no sudden motion`

#### P02 · Sahne 1c · Altın taşıyıcı (detay) ☀
- **Kadraj:** Makro, böcek kadrajın sol üçte birinde, kökteki yarık sağda.
- **Referans:** `[REF: STİL]`
- **KF:**
```
[STİL] [ŞAFAK] macro close-up, a [C02 ALTIN TAŞIYICI] walking along a thick twisted root toward a small crack on the right, the glowing gold spore on its back, fine hatching on the bark, soft dawn light, [ALTIN]
```
- **VID:** `locked camera, the insect walks a few steps to the right on its six legs and tips the gold spore into the crack, the spore sinks in with a soft glow, small natural movements`

#### P03 · Sahne 1d · Dağ otlakçısı (ölçek) ☀
- **Kadraj:** Çok geniş plan. Canlı uzak dağların önünde, kadrajın küçük bir parçası.
- **Referans:** `[REF: STİL]`
- **KF:**
```
[STİL] [ŞAFAK] extremely wide shot of distant mountains, a [C03 DAĞ OTLAKÇISI] taking one slow step on a far slope, a cloud of golden spores rising from where its foot lands, heavy aerial perspective, the creature partly dissolved in haze, [ALTIN]
```
- **VID:** `nearly locked camera with an extremely slow push-in, the giant creature completes one very slow heavy step, a soft cloud of gold spores rises and drifts to the right`

#### P04 · Sahne 1e · Kök kesiti ☀
- **Kadraj:** Dikey kesit görünüm; toprağın üstü kadrajın tepesinde ince bir şerit.
- **Referans:** `[REF: STİL]`
- **KF:**
```
[STİL] cross-section view of the ground, a thin strip of surface plants at the top, below it a dense network of tangled roots in earthy browns and muted reds, golden light pulsing through the roots like a heartbeat and flowing to the right, [ALTIN]
```
- **VID:** `slow downward camera tilt, the golden light pulses rhythmically through the roots and travels to the right, roots stay still`

#### P05 · Sahne 2a · Doğum açıklığı: Azi ve Levi ☀
*Montajın vardığı yer. Sahne 2'nin kuruluş planı.*
- **Kadraj:** Geniş plan. Ortada ışıklı çiçek; solda diz çökmüş Azi, sağda çömelmiş Levi. Akım sağdan değil, **arkadan** çiçeğe akıyor.
- **Referans:** `[REF: STİL]` + `[REF: Azi]` + `[REF: Levi]` (uyarı 4'e göre ayrı ayrı ekle)
- **KF (önce arka plan):**
```
[STİL] [ŞAFAK] a small forest clearing at dawn, in the center a single knee-high glowing flower bud, many golden currents converging from the surrounding plants into the bud, [ALTIN], empty space on the left and right of the flower for two figures, soft light falling into the clearing
```
- **KF (karakterleri ekleme talimatı):** `place [REF: Azi] kneeling on the left, quietly watching the flower; place [REF: Levi] crouched on the right, roots growing from its hands and feet into the soil; keep the art style of the background exactly`
- **VID:** `locked camera, the golden currents flow slowly into the flower bud, the figures stay almost still, only breathing, calm anticipation`

#### P06 · Sahne 2b-2c · Levi ve gezegen aynı nabızda ☀
*Levi'nin gezegenle organik bağının kalbi.*
- **Kadraj:** Yakın plan. Levi'nin toprağa gömülü kökleri kadrajın altında, ışık yukarı tırmanıyor.
- **Referans:** `[REF: STİL]` + `[REF: Levi]`
- **KF:**
```
[STİL] close-up of [REF: Levi]'s hands pressed into the soil, roots growing from its fingers deep into the ground, golden light climbing up from the roots into its body, its body glowing softly in the same rhythm, one hand resting on the glowing flower bud, [ALTIN]
```
- **VID:** `locked camera, golden light climbs from the roots into the body in slow rhythmic pulses like a heartbeat, the glow passes from the hand into the flower bud`

#### P07 · Sahne 2g · Doğum ⭐ ☀
*Bölümün ilk büyük anı. Bu kareye en çok emeği ver.*
- **Kadraj:** Yakın plan, çiçek kadrajın ortasında; ışık çiçeğin içinden yüzlere yansıyor.
- **Referans:** `[REF: STİL]` + `[REF: Yavru Levi]`
- **KF:**
```
[STİL] close-up of the glowing flower fully opening, its petals unfolding outward, inside it a tiny palm-sized newborn [REF: Yavru Levi] curled up and glowing warm gold, light spilling out of the flower onto the surroundings, the most luminous moment of the scene, [ALTIN]
```
- **VID:** `locked camera, very slow push-in, the petals unfold slowly, warm golden light blooms outward, the tiny newborn stirs once`
- **Not:** Açılmanın hemen öncesi (2f) için aynı çiçeğin **kapalı ve hareketsiz** hâlini ayrı bir kare olarak üret; kurguda 1-2 saniyelik "tam sessizlik" anı o kareyle yapılacak.

#### P08 · Sahne 2j · Solmuş halka (doğumun bedeli) ⭐ ❄
*Bölümün tematik ikilemi tek karede.*
- **Kadraj:** Yüksekten, kuşbakışına yakın geniş plan. Ortada küçük, sıcak ışıklı açıklık; çevresinde çember şeklinde gri, ölü bir alan; en dışta hâlâ renkli orman.
- **Referans:** `[REF: STİL]`
- **KF:**
```
[STİL] high wide view looking down at a forest, in the center a small clearing with a tiny warm golden glow and two small figures, around it a perfect wide ring of [SOLMA] where the plants have died, beyond the ring the forest is still full of soft pastel color, the contrast between the dead ring and the living forest is the focus, cold quiet morning light
```
- **VID:** `slow crane up and pull back, revealing more of the grey dead ring around the clearing, no other motion except a light breeze`
- **Not:** Bu kare için önce P05'in arka planını kullanıp uzaklaştırmayı (outpaint) dene; böylece açıklık iki karede birebir aynı olur.

### Bölüm B - Koloni ve tarikat (sahne 4-5)

#### P09 · Sahne 4a · Koloni, Demeter'in altında ☀
- **Kadraj:** Geniş kuruluş planı. Demeter'in dev, yıkık silueti kadrajın üçte ikisini kaplıyor; altında küçük, sıcak ışıklı bir koloni.
- **Referans:** `[REF: STİL]` + `[REF: Demeter]`
- **KF:**
```
[STİL] [KOLONİ AKŞAM] wide establishing shot at dusk, the huge broken hull of the crashed ship [REF: Demeter] towering over a small makeshift colony, patched tents and salvaged metal shelters mixed with living plants used as walls, many small warm amber lights from [FENER SÜMÜKLÜSÜ] creatures hanging along the paths, tiny distant people, smoke from a cooking fire
```
- **VID:** `locked camera, the lantern creatures pulse gently, smoke rises slowly, tiny figures move in the distance`

#### P10 · Sahne 4f · Barry kenarda yalnız ❄
- **Kadraj:** Orta plan. Ön planda bulanık değil, net ama sıcak ışıklı kalabalık masa (sol); sağda, ışığın dışında, bir kasanın üzerinde tek başına Barry.
- **Referans:** `[REF: STİL]` + `[REF: Barry]`
- **KF:**
```
[STİL] [KOLONİ AKŞAM] medium shot, on the left a long communal table full of people eating in warm lantern light, on the right outside the light [REF: Barry] sitting alone on a supply crate eating from a bowl, a clear empty gap between him and the table, his side of the frame cooler and dimmer
```
- **VID:** `very slow push-in toward the lonely figure, people at the table move and talk softly, he eats slowly and glances at the table once`

#### P11 · Sahne 5a · Tarikatın gemisi (uzay) ❄
*Tarikatın ilk görünüşü. Tamamen özgün tasarım.*
- **Kadraj:** Geniş plan, gemi kadrajın sağından sola doğru yavaşça geçiyor.
- **Referans:** `[REF: STİL]`
- **KF:**
```
[STİL] deep space with soft pale stars, [TARİKAT GEMİSİ] entering the frame from the right, seen from below and slightly behind, it feels ancient, enormous and quiet, muted bone, copper-green and plum colors
```
- **VID:** `locked camera, the ship drifts very slowly from right to left, its tendrils sway slightly, tiny lights along its flank flicker softly`

#### P12 · Sahne 5b-5d · Ritüel salonu ❄ (tek sıcak nokta ☀)
- **Kadraj:** Geniş plan, simetrik. Ortada sunak ve üzerinde bebek Levi; iki yanda sıra sıra eğilen maskeliler.
- **Referans:** `[REF: STİL]` + `[REF: Yavru Levi]`
- **KF:**
```
[STİL] [GEMİ İÇİ] wide symmetrical shot of a tall ritual hall with ribbed bone-like walls, in the center a raised altar where a tiny glowing [REF: Yavru Levi] rests, the small golden glow is the only warm light, rows of [MASKELİLER] bowing slowly toward the altar on both sides, dust floating in the cold light
```
- **VID:** `locked camera, the masked figures bow slowly in turn, robes moving softly, the small golden glow on the altar pulses gently`

#### P13 · Sahne 5e-5f · Kris kenarda izliyor ❄
- **Kadraj:** Orta plan. Ön planda (sol) Kris, kova taşıyor; arka planda (sağ) sunak ve altın ışık.
- **Referans:** `[REF: STİL]` + `[REF: Kris]`
- **KF:**
```
[STİL] [GEMİ İÇİ] medium shot, [REF: Kris] in worn, patched servant clothes carrying a bucket in the foreground at the side of the hall, her face blank, eyes fixed on the small golden glow on the altar in the background, masked figures as dim shapes between them
```
- **VID:** `locked camera, she stops walking and stares at the altar for a moment, then lowers her eyes and keeps scrubbing the floor`

### Bölüm C - Kamen ve kabul (sahne 6-8)

#### P14 · Sahne 6c-6d · Kamen'in bahçesi ❄
- **Kadraj:** Orta-geniş plan. Kamen çömelmiş; bitkiler ona doğru eğik; ufuk karanlık.
- **Referans:** `[REF: STİL]` + `[REF: Kamen]`
- **KF:**
```
[STİL] twilight in violet and blue, a small strange and beautiful garden at the edge of a camp, [REF: Kamen] crouching in the soil planting a seedling, the surrounding alien plants gently leaning toward him as if attracted, a dark empty horizon behind
```
- **VID:** `locked camera, the plants lean very slowly toward him, then a faint tremor shakes the soil and a few grains of dust jump, he lifts his head and looks around, nothing is there`

#### P15 · Sahne 7c · Pusu kabuğu saldırısı ❄
*Bölümün tek ani aksiyon anı.*
- **Kadraj:** Orta plan, alçak açı. Kabuk açılmış, kolonistin bacağına atılmış; havada bir tabak.
- **Referans:** `[REF: STİL]`
- **KF:**
```
[STİL] [KOLONİ AKŞAM] low medium shot, a grey [PUSU KABUĞU] bursting open next to a startled colonist who was about to sit down, its hooked limbs grabbing his leg, a food bowl flying in the air, other people frozen in the background
```
- **VID:** `sudden fast motion: the stone-like shell snaps open and lunges, the bowl falls, then everything freezes; keep the motion short and sharp`
- **Not:** Barry'nin hamlesi (7e) için ayrı bir klip üret. İki hareketi tek klipte isteme.

#### P16 · Sahne 7i · Ursula kabı uzatıyor ☀
*Bölümün sıcak kalbi. Barry ilk kez kabul görüyor.*
- **Kadraj:** Orta plan, yandan. Solda Ursula elinde kap, sağda Barry; aralarında masadaki boş yer.
- **Referans:** `[REF: STİL]` + `[REF: Ursula]` + `[REF: Barry]` (uyarı 4)
- **KF (arka plan):**
```
[STİL] [KOLONİ AKŞAM] medium side shot of a long communal table in warm lantern light, one empty seat in the middle of the bench, people watching quietly in the background
```
- **KF (karakterleri ekleme talimatı):** `place [REF: Ursula] standing on the left, wearing an oversized old captain's jacket, holding out a food bowl and nodding toward the empty seat; place [REF: Barry] on the right, hesitating; keep the art style of the background exactly`
- **VID:** `locked camera, she holds out the bowl, he hesitates for a moment, then takes it and slowly sits down at the empty seat`

#### P17 · Sahne 8d-8e · Kris'in eli ❄
*Paralel kurgunun karşılığı: Barry otururken Kris bırakıyor.*
- **Kadraj:** Çok yakın plan, sadece el. Arka planda uzaklaşan küçük altın ışık.
- **Referans:** `[REF: STİL]` + `[REF: Kris]` (sadece el ve kol kıyafeti için)
- **KF:**
```
[STİL] [GEMİ İÇİ] extreme close-up of a woman's worn hand reaching out in the foreground, in the background two masked figures carrying a small golden glow away down a dark corridor
```
- **VID:** `locked camera, the hand reaches out slowly, stops, then pulls back and closes into a fist as the golden glow moves away`

### Bölüm D - Gece (sahne 9-10)

#### P18 · Sahne 9c-9d · Hücre duvarında Vesta ❄ (+ altın ☀)
*Bebek Levi'nin Kris'e Vesta'yı "gösterdiği" an.*
- **Kadraj:** İki kare: (a) duvar, (b) Kris'in yüzü.
- **Referans:** `[REF: STİL]` + `[REF: Kris]` (sadece b karesi için)
- **KF (a):**
```
[STİL] [GEMİ İÇİ] a dark narrow cell, golden light seeping under the door and spreading across the wall, in the light on the wall a soft glowing image appears: distant mountains with the silhouette of a [C03 DAĞ OTLAKÇISI] walking, like a projection made of light
```
- **KF (b):** `[STİL] [GEMİ İÇİ] close-up of [REF: Kris]'s face lit only by warm golden light from the side, her expression shifting from surprise to a cold, calculating look, in the dark corner behind her the faint shape of a masked figure`
- **VID (a):** `locked camera, the golden light slowly spreads on the wall and forms the faint image of the mountain creature, then fades`
- **VID (b):** `locked camera, very slow push-in on her face, her eyes narrow slightly, the light fades to darkness`

#### P19 · Sahne 10d-10f · Hareket eden ışık ⭐ ❄
*Bölümün son ve ikinci büyük anı.*
- **Kadraj:** İki kare: (a) gökyüzü ve iki küçük siluet, (b) Azi'nin gözüne çok yakın plan.
- **Referans:** `[REF: STİL]` + `[REF: Azi]` + `[REF: Mia]`
- **KF (a):**
```
[STİL] [GECE] wide night shot, an enormous starry sky over an alien landscape with softly glowing plants, two tiny figures sitting together on a rock at the bottom of the frame, among the stars one small light that is slightly brighter and clearly moving
```
- **KF (b):** `[STİL] [GECE] extreme close-up of [REF: Azi]'s eye, in the reflection on the eye a tiny moving light among the stars, cold and tense`
- **VID (a):** `locked camera, the stars are still, one small light moves slowly across the sky from left to right, the plants glow and pulse very softly`
- **VID (b):** `locked camera, extremely slow push-in on the eye, the tiny reflected light moves, the eye does not blink`
- **Not:** Bölüm bu karenin doruğunda **sert kesmeyle kararıyor.** Klibi gerektiğinden uzun üret, kesme yerini kurguda seç.

> Not: P01-P04 montajın tamamı değil; montajın diğer planları (1a, 1f, 1g, 1h, 1i) için `sahne01-montaj.md`.

---

## 3. Önerilen üretim sırası
1. **Stil testi:** P01 + P07 + P12. Üç farklı ışık modu (şafak, mucize, gemi içi). Bu üçü tutarsa stil tutuyor demektir.
2. **Özgün tasarımlar:** P03, P11, P15 (dağ otlakçısı, tarikat gemisi, pusu kabuğu). Referans gerekmiyor, hızlı ilerler.
3. **Karakterli kareler:** P05, P06, P10, P13, P14, P16, P17, P18, P19. Karakter referansların hazır olduktan sonra.
4. **En son:** P08 (solmuş halka). P05'in arka planından türetileceği için ona bağlı.
5. Her adımdan sonra kareleri bana ya da yönetmen agent'ına gönder; stil kurallarını o karelere göre güncelleriz.
