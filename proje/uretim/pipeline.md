# Görsel Üretim Pipeline'ı (v0.1)

> Durum: **Taslak.** Hazırlayan: `animasyon-uretim`, 2026-10-08 (T-001). Ses tarafı: `proje/uretim/ses-pipeline.md`
> Fiyat ve özellik bilgileri **2026-10-08** tarihli web araştırmasına dayanır. Kaynakların çoğu üçüncü taraf incelemeleridir ve bazıları birbiriyle çelişir; çelişkiler tabloda belirtildi.
> ⚠️ **Erişim notu:** Bu bulut ortamından `docs.midjourney.com`, `suno.com`, `elevenlabs.io` gibi resmi sayfalara erişilemedi (DNS hatası). Resmi fiyat sayfaları doğrudan okunamadı; satın almadan önce resmi sayfadan kontrol edin.

---

## 1. Araç seçimi (görsel)

### 1.1 Karar tablosu
Puanlar 1-5 (5 = en iyi). "Öğrenme" sütununda 5 = en kolay.

| Kategori | **Seçim** | Kalite | Tutarlılık | Maliyet | Öğrenme | Gerekçe (kısa) |
|---|---|---|---|---|---|---|
| Konsept ve anahtar kare | **Midjourney V8.x** (Standard plan) | 5 | 4 | 3 | 4 | 2026 karşılaştırmalarında "estetik" ve stilize sanatta açık ara önde; stil referansıyla (`--sref`) kendi stil karelerimize kilitlenebiliyor. Zayıf yanı: promptu harfiyen izlemekte rakiplerden geri |
| Tutarlılık, düzenleme, model sheet varyasyonu | **Nano Banana Pro** (Gemini / Google AI Pro) | 4 | 5 | 4 | 5 | Çoklu referans görselle karakter/canlı tutarlılığı ve sohbetle düzenleme ("sadece sporu daha küçük yap") güçlü. Aynı abonelik Flow/Veo kredisi de veriyor |
| Görselden videoya | **Kling 3.0** (Pro plan; referanslı işlerde 3.0 Omni) | 4 | 4 | 4 | 4 | Başlangıç + bitiş karesi, 1080p, uygun saniye maliyeti; Omni modunda "element" ile nesne tutarlılığı. Arena sıralamalarında üst sıralarda |
| Geleneksel 2D / boyama / temizlik | **Krita** (+ Krita AI Diffusion eklentisi) | 4 | - | 5 (ücretsiz) | 3 | Ücretsiz, açık kaynak. AI karelerin elle düzeltilmesi, katmanlara ayırma, inpaint |
| Ara kare / düzeltme | Gerekirse **ToonCrafter** veya Kling başlangıç-bitiş karesi | 3 | 3 | 5 | 2 | Sahne 1'de ara kareye neredeyse ihtiyaç yok; bkz. 1.3 |
| Kurgu, renk, 2.5D kamera (parallax) | **DaVinci Resolve 21** (ücretsiz sürüm) | 5 | - | 5 | 3 | Kurgu + renk + Fusion (katmanlı kamera hareketi) + Fairlight (ses) tek programda |
| Upscale | **Gerek yok** (1080p üretim). Gerekirse Topaz Video | - | - | - | - | Kling ve Midjourney zaten 1080p/2K veriyor; pilot hedefi 1080p |

### 1.2 Kategori başına seçenekler (ücretsiz/düşük bütçe ↔ en kaliteli)

| Kategori | Ücretsiz / düşük bütçe | **Seçilen** | En kaliteli / pahalı | Fiyat notu (2026-10-08) |
|---|---|---|---|---|
| Konsept görseli | Nano Banana 2 (Gemini uygulamasında ücretsiz, günlük sınırlı) | Midjourney Standard | Midjourney Pro (gizli mod) + GPT Image 2 (prompt sadakati en yüksek) | MJ: Basic $10, Standard $30 (15 sa hızlı + sınırsız Relax), Pro $60, Mega $120 /ay. Sürüm bilgisi kaynaklar arasında çelişkili (V8.1 / V8.2). GPT Image 2: ChatGPT Plus $20/ay |
| Tutarlılık | Nano Banana 2 (ücretsiz) veya yerelde Krita AI Diffusion + IP-Adapter | Nano Banana Pro (Google AI Pro) | Kendi çizimlerimizle eğitilmiş **LoRA** (FLUX.2) + ComfyUI | Google AI Pro ~$19.99/ay (~1.000 Flow kredisi; kredi rakamları kaynaklar arasında çelişkili). Ücretsiz Gemini'de Nano Banana Pro günde ~2 görsel (doğrulanamadı) |
| Görselden videoya | Kling ücretsiz günlük kredi (filigranlı) veya **Wan 2.2** yerelde (açık kaynak, Apache 2.0, 8 GB+ VRAM) | Kling 3.0 Pro | Seedance 2.0 (Dreamina/CapCut; 2D/anime stilinde öne çıkıyor) ve Veo 3.1 (Flow) ile karşılaştırmalı test | Kling: Standard ~$10 (660 kredi), Pro ~$37 (3.000 kredi), Premier ~$92 /ay liste fiyatı; 3.0 1080p sessiz ~8 kredi/sn (kaynaklar çelişkili, 6-58 kredi/sn arası rakamlar var). Seedance: Dreamina ~$18-84/ay (çelişkili) |
| Kurgu / renk | DaVinci Resolve 21 (ücretsiz) | Aynı | Resolve Studio (ücretli, bazı AI araçları ve gürültü giderme) | Resolve 21 Haziran 2026'da çıktı, 21.1 Eylül 2026 |
| Upscale | Gerek yok | Gerek yok | Topaz Video (animasyon için Gaia modeli) | ~$299/yıl (kaynaklar çelişkili; kalıcı lisans kalkmış olabilir) |

### 1.3 Neden bu seçimler (kısa)
- **İki görsel aracı birlikte:** Midjourney stili ve atmosferi en iyi veren araç; ama aynı canlıyı farklı açılardan aynı tutmakta ve küçük düzeltmelerde Nano Banana Pro daha güvenilir. İş bölümü: **MJ = ilk görüntü ve atmosfer, Nano Banana Pro = model sheet, varyasyon ve rötuş.**
- **Kling 3.0:** 2D stile özel bağımsız test bulamadım. Kaynaklar 2D/anime için Seedance 2.0 ve Wan'ı da öne çıkarıyor. Bu yüzden ilk haftada **3 planlık bir karşılaştırma testi** öneriyorum (bkz. 3.3, adım 6). Kling'i seçme nedenim: başlangıç+bitiş karesi, fiyat/performans, kolay erişim ve geniş kullanıcı tabanı.
- **Sahne 1'in büyük kısmı tam AI video gerektirmiyor:** Kök kesiti (1e) ve göl (1g) gibi planlar katmanlı bir görselin Resolve/Fusion'da yavaş kamera hareketiyle (2.5D) canlandırılmasıyla **daha temiz ve stile daha sadık** olur. AI video, titreme ve stil kayması riski taşıdığı için yalnızca gerçekten hareket gereken yerde kullanılır.
- **Ara kare araçları (RIFE, ToonCrafter):** RIFE'nin kendi deposu 2D animasyon için pek uygun olmadığını söylüyor; ToonCrafter düşük çözünürlüklü (512×320, 16 kare). Sahne 1'de kullanılmayacak; karakter animasyonu aşamasında yeniden değerlendirilecek.
- **Sora 2 önerilmiyor:** OpenAI API'si 24 Eylül 2026'da kapandı (kaynak: üçüncü taraf karşılaştırma).
- **Udio önerilmiyor** (ses tarafı): indirme kapalı.

### 1.4 Kullanım koşulları özeti (ticari olmayan hayran projesi için)
| Araç | Önemli koşul | Projeye etkisi |
|---|---|---|
| Midjourney | Ücretli planlarda çıktıların sahibi kullanıcı. **Basic ve Standard'da görseller herkese açık galeride görünür**; gizli (stealth) mod yalnızca Pro/Mega'da ve "en iyi çaba" sözü. Midjourney görseller üzerinde geniş bir lisans tutar. Ücretsiz deneme yok | Hayran projesi için sorun değil, ama tasarımlar yayından önce galeride görünebilir. Gizlilik istenirse Pro ($60) |
| Google (Nano Banana, Veo/Flow) | Görsellere görünmez SynthID filigranı ekleniyor | Sorun değil; YouTube çizgi film/animasyon için AI etiketi zorunluluğu getirmiyor (fotogerçekçi içerik için zorunlu) |
| Kling | Ücretsiz planda filigran ve ticari kullanım yok; ücretsiz üretimler herkese açık akışta görünebilir. Kling yüklenen ve üretilen içerik için geniş lisans alıyor (üçüncü taraf okuması; resmi metin okunamadı) | Ticari kullanım zaten yok. Filigran olmaması için ücretli plan gerekli |
| FLUX.2 [dev] | Ticari olmayan lisans; LoRA türevleri de bu lisansa bağlı | Hayran projesi için uygun. FLUX.2 [klein] 4B Apache 2.0 (serbest) |
| Wan 2.2 | Apache 2.0 | Serbest. Wan 2.5-2.7 ağırlıkları yayımlanmadı, sadece API |
| Hepsi | **Güncelleme (2026-10-08, kullanıcı kararı):** Kullanıcı 1. sezon görsellerini stil ve karakter referansı olarak kullanacak | Her araçta sahibi olunmayan görsellerin yüklenmesine dair koşullar kullanıcı tarafından kontrol edilmeli; Midjourney Basic/Standard'da çıktılar herkese açık galeride görünür |

---

## 2. Dosya düzeni ve adlandırma

```
proje/uretim/
  s01/                      # sahne 1
    1a/ 1b/ ... 1i/         # her plan ayrı klasör
      ref/                  # storyboard karesi, referanslar
      kf/                   # anahtar kareler (keyframe)
      lay/                  # katmanlar (2.5D planlar)
      vid/                  # AI video denemeleri
      fin/                  # onaylı son çıktı
    s01_log.md              # üretim kaydı (süre, kredi, sorunlar)
proje/stil/kareler/         # onaylı stil kareleri
```

**Adlandırma:** `E01_S01_P1b_<AŞAMA>_<ARAÇ>_v###.<uzantı>`
- AŞAMA: `SB` storyboard, `KF` anahtar kare, `LAY` katman, `VID` video, `FIN` son
- ARAÇ: `mj`, `nbp` (Nano Banana Pro), `kl` (Kling), `sd` (Seedance), `veo`, `krt` (Krita), `dvr` (Resolve)
- Örnek: `E01_S01_P1b_KF_mj_v003.png`, `E01_S01_P1b_VID_kl_v002.mp4`
- Her üretimin promptu ve ayarı `s01_log.md` içine kopyalanır (Kling'de seed yok; tekrar üretilebilirlik için kayıt şart).

**Teknik standart:** 16:9, 1920×1080, 24 fps, görsel PNG (8 bit sRGB), video MP4 (H.264) indirilip Resolve'de ProRes/DNxHR ara formata çevrilir.

---

## 3. Sahne 1 (Vesta montajı) adım adım pipeline

### 3.1 Planlara göre yöntem
| Plan | Süre | Yöntem | Neden |
|---|---|---|---|
| 1a çiy damlası | 0:12 | **A** AI video (başlangıç karesi) | Damlanın uzayıp kopması doğal bir fizik hareketi |
| 1b sisli vadi | 0:12 | **C** hibrit: katmanlı arka plan + sağa kaydırma (Resolve) + sis yüzücüleri AI video | Kamera hareketi kontrollü, canlılar AI ile |
| 1c altın taşıyıcı | 0:12 | **A** AI video (başlangıç + bitiş karesi) | Kısa yürüyüş + sporu bırakma. Bacak hatası riski: QC |
| 1d dağ otlakçısı | 0:14 | **C** hibrit: katmanlı manzara + çok yavaş yaklaşma (Resolve) + canlının tek adımı ve spor bulutu AI | AI dev canlıyı fazla hızlı yürütme eğiliminde; kamera ayrı kontrol edilmeli |
| 1e kök kesiti | 0:12 | **B** 2.5D: uzun dikey görsel + dikey kaydırma + nabız ışığı Fusion'da maske/parıltı animasyonu | Tamamen kontrollü, titreme yok |
| 1f nefes alan çiçek | 0:10 | **A** AI video, **başlangıç = bitiş karesi** (döngü) | Açılıp kapanma döngüsü |
| 1g göl | 0:12 | **B** 2.5D: sabit görsel + tohumlar (Fusion parçacık ya da AI) + su altı gölgesi (maskeli, bulanık koyu şekil) | Gölge "hiç tam görünmemeli": elle kontrol en güvenlisi |
| 1h zar bitkileri | 0:10 | **A** AI video | Rüzgâr salınımı AI'nın en iyi yaptığı hareketlerden |
| 1i takip / açıklık | 0:11 | **A** AI video (başlangıç + bitiş karesi), gerekirse 2 parça | En riskli plan. Bitiş karesi sahne 2a ile birebir eşleşmeli |

### 3.2 Zaman ve maliyet özeti (tahmini)
| Adım | Süre (kişi-saat) | Maliyet |
|---|---|---|
| 0-2 Hazırlık, stil kareleri, P0 tasarımlar | 12-20 sa | MJ + Google AI Pro aboneliği içinde |
| 3-4 Storyboard + 9 anahtar kare | 8-12 sa | Abonelik içinde |
| 5 Katmanlama (1b, 1d, 1e, 1g) | 4-6 sa | Ücretsiz (Krita) |
| 6 Hareket (AI video + 2.5D) | 10-16 sa | Kling: ~6 plan × ~6 deneme × 10 sn × ~8 kredi/sn ≈ 2.900 kredi → Pro plan (3.000 kredi) yetiyor. Kredi/sn rakamı çelişkili; ilk denemelerde gerçek tüketimi kaydedin |
| 7-8 QC + düzeltme | 4-8 sa | Ücretsiz |
| 9-10 Renk eşleme + kurgu | 4-6 sa | Ücretsiz (Resolve) |
| **Toplam** | **~42-68 sa** | **~$87/ay** (MJ Standard $30 + Google AI Pro ~$20 + Kling Pro ~$37). Düşük bütçe: ~$0-20 (bkz. 3.4) |

### 3.3 Adımlar

**Adım 0 - Kurulum (1 kez)**
- Hesaplar: Midjourney (web arayüzü), Google AI Pro (Gemini + Flow), Kling.
- Yazılım: Krita (ücretsiz), DaVinci Resolve 21 (ücretsiz).
- Klasör yapısını oluştur (bölüm 2).

**Adım 1 - Stil kareleri** (stil rehberi bölüm 10)
- Araç: Midjourney. Prompt: `[STİL BLOĞU] + sahne tarifi`, `--ar 16:9 --style raw`, negatif için `--no` ile [NEGATİF BLOK].
- Her stil karesi için 4-8 deneme; en iyi 1'i seç → Krita'da renk ve çizgi düzeltmesi.
- **Çıkış:** `proje/stil/kareler/STIL_0X_<ad>_v1.png` → **yönetmen + kullanıcı onayı**.
- Onaydan sonra bütün MJ promptlarında `--sref <stil karesi URL'leri>` kullanılır. (`--sref`, `--sw` stil ağırlığı ve V8'deki referans parametrelerini MJ'nin güncel belgelerinden doğrulayın; belgeler bu ortamdan okunamadı.)

**Adım 2 - P0 canlı tasarımları** (tasarım listesi C01-C10)
- Midjourney ile her canlı için 2-3 tur keşif (`--sref` stil kareleri + canlı tanım bloğu).
- Seçilen tasarım → Nano Banana Pro'da model sheet: "aynı canlıyı ön/yan/arka/3/4 göster, aynı renk ve çizgiyle, beyaz zemin üzerinde".
- Krita'da temizlik. **Çıkış:** `proje/karakterler/canlilar/C0X_<ad>_MS_v1.png` → **yönetmen onayı**.
- Onaylanan tasarımın görsel tarifi, prompt şablonundaki **canlı tanım bloğuna** (v1) yazılır ve bundan sonra aynen kullanılır.

**Adım 3 - Storyboard karesi** (her plan)
- Krita'da kaba çizim (çöp adam düzeyi yeterli) ya da MJ'den hızlı taslak: kompozisyon, ufuk, altın akımın yönü (sağa), kamera hareketinin başlangıç ve bitişi.
- **Çıkış:** `.../ref/E01_S01_P1x_SB_krt_v001.png`

**Adım 4 - Anahtar kare**
- Araç: Midjourney, şablon: `proje/uretim/promptlar/sahne01-montaj.md`.
- Ayarlar: `--ar 16:9 --style raw --sref <stil kareleri> --seed <kaydet>`; storyboard karesi kompozisyon için görsel prompt olarak eklenebilir.
- Seçilen kare → Nano Banana Pro'da rötuş (canlıyı model sheet'e uydur, altın akımı ayarla) → Krita'da son temizlik.
- Başlangıç + bitiş karesi gereken planlarda (1c, 1i) bitiş karesi, başlangıç karesinden Nano Banana Pro ile **düzenlenerek** türetilir (sıfırdan üretilmez; tutarlılık için).
- **Çıkış:** `.../kf/E01_S01_P1x_KF_<araç>_v###.png` (1920×1080)

**Adım 5 - Katmanlama** (yalnızca 1b, 1d, 1e, 1g)
- Krita'da ön / orta / arka plan katmanlarına ayırma; arkada kalan boş alanları Krita AI Diffusion ya da Nano Banana Pro ile doldurma (inpaint).
- 1e için 1920×3240 dikey görsel (MJ `--ar 9:16` ile üretip genişletme ya da 3 kareyi birleştirme).
- **Çıkış:** `.../lay/` altında katman başına PNG (saydam arka plan).

**Adım 6 - Hareket**
- **A planları (Kling 3.0):** Image-to-Video → başlangıç karesi (+ gerekiyorsa bitiş karesi) → hareket promptu (şablon) + negatif prompt → 16:9, 1080p, **native ses kapalı**, süre 5 ya da 10 sn (3.0'da 15 sn'ye kadar seçenek olabilir; arayüzde doğrulayın). Test denemeleri düşük kaliteli/standart modda, finaller Pro/1080p'de.
- Plan süresi klipten uzunsa: klibin sonunu Resolve'de dondur (hold) ya da yavaşlat (%80'in altına inme, titreme yapar). Sahne 1 sabit planlarında "hold" stil rehberiyle uyumlu.
- **İlk hafta karşılaştırma testi:** 1b, 1f, 1h planlarını aynı anahtar kareyle Kling 3.0, Seedance 2.0 (Dreamina) ve Veo 3.1 (Flow, Google AI Pro kredisiyle) üzerinde dene. QC listesine göre puanla; kazanan araç sahne 1'in geri kalanında kullanılır. Sonucu `proje/ARACLAR.md`'ye yaz.
- **B planları (Resolve Fusion):** Katmanları Fusion'da 3D uzayda farklı derinliklere yerleştir (ImagePlane3D + Camera3D) → yavaş kamera hareketi. 1e'deki nabız: kök çizgilerinden çıkarılmış maske + parıltı (Glow) + zamanla kayan bir ışık dalgası.
- **C planları:** B ile kamera hareketi + A ile canlandırılmış canlı katmanı. Canlı katmanı AI videoda düz renkli zemin üzerine üretilip Resolve'de Delta Keyer / Magic Mask ile ayrılır (Magic Mask'ın ücretsiz sürümde olup olmadığını doğrulayın; değilse düz zemin + renk anahtarı).
- **Çıkış:** `.../vid/E01_S01_P1x_VID_<araç>_v###.mp4`

**Adım 7 - Kalite kontrol** (bölüm 5'teki liste)
- Her denemeyi QC listesiyle puanla; sorunları `s01_log.md` içine yaz.

**Adım 8 - Düzeltme**
- Tek karelik hatalar: kareyi PNG dizisine çevir → Krita'da elle boya → geri birleştir.
- Titreyen doku: yeniden üret (hareket promptunu sadeleştir) ya da o bölgeyi sabit katmanla örtüp maskele.
- Bozuk anatomi (1c bacakları): bitiş karesi ekleyerek yeniden üret; olmazsa hareketi kısalt ya da yakın planı kesmeyle böl.

**Adım 9 - Renk eşleme** (Resolve, Color sayfası)
- Bütün planları bir "referans plan"a (onaylı stil karesine en yakın olan) eşle: beyaz noktası, doygunluk, gölge rengi.
- Altın akımın tonu her planda aynı olmalı: altın için Qualifier ile seçip tek bir sıcak ton hedefine çek.
- Bütün planlara aynı kâğıt greni katmanı (stil rehberi) → AI'nın farklı dokularını birleştirir.
- Sahne 2'ye geçişte (1i → 2a) renk birebir aynı.

**Adım 10 - Kurgu ve teslim**
- Resolve, 24 fps, 1920×1080 zaman çizelgesi; senaryodaki sürelerle ön montaj (animatik yerine geçer).
- Geçici ses: ses pipeline'ındaki SFX taslakları.
- **Çıkış:** `E01_S01_FIN_dvr_v###.mov` (ProRes 422) + yönetmen için H.264 önizleme.
- **Kayıt:** Toplam süre, kredi tüketimi, deneme sayısı, başarı oranı → `s01_log.md` → sezon formatı kararına veri (sezon taslağındaki üretim notu).

### 3.4 Düşük bütçe varyantı (~$0-20/ay)
| Adım | Araç |
|---|---|
| Stil kareleri, anahtar kare | Gemini'de ücretsiz Nano Banana 2 (günlük sınır) + Krita'da elle düzeltme |
| Tutarlılık | Nano Banana 2 referans görseli; ya da GPU varsa Krita AI Diffusion (SDXL/FLUX + IP-Adapter, NVIDIA 6 GB+ VRAM önerilir) |
| Video | Kling ücretsiz günlük kredi (filigranlı, yalnızca test) ya da yerelde Wan 2.2 (ComfyUI, 5B model ~8 GB VRAM; 14B ilk-son kare modeli daha fazla ister). **Sahne 1'de B yöntemini (2.5D) artır**: 1b, 1d, 1g, 1h de katmanlı görsel + Fusion ile yapılabilir |
| Kurgu/renk | DaVinci Resolve 21 ücretsiz |

---

## 4. Uzun vadeli tutarlılık: LoRA (sezon için, pilotta isteğe bağlı)
- **Ne zaman:** Pilot testi sonrası, onaylı 15-30 stil karesi ve model sheet birikince.
- **Veri:** Yalnızca projenin kendi stil kareleri, kullanıcının kendi çizimleri ve onaylı model sheet'ler. Orijinal dizinin kareleri **kesinlikle kullanılmaz**.
- **Model:** FLUX.2 [klein] 4B Base (Apache 2.0, ince ayar için önerilen taban) ya da FLUX.2 [dev] (ticari olmayan lisans; hayran projesine uygun).
- **Araç:** Yerel ComfyUI/eğitim betikleri (güçlü NVIDIA GPU) ya da bulut eğitim servisleri. Alternatif: Adobe Firefly Custom Models (10-30 kendi görselin, ~500 kredi, kişisel model; 2026 Mart'ta açık beta).
- **Ayrı LoRA'lar:** (1) stil LoRA'sı, (2) her ana canlı/karakter için ayrı LoRA.

---

## 5. Kalite kontrol listesi (her çıktı için)
| # | Kontrol | Geçer | Tipik sorun → çözüm |
|---|---|---|---|
| 1 | **Stil:** çizgi ince ve renkli mi, dolgu düz mü, palet doğru mu? | Stil karesiyle yan yana konunca aynı dünyadan | 3D/gerçekçi kayma → `--style raw`, `--sref` ağırlığını artır, negatif bloğa "3d render" ekle; videoda hareket promptunu kısalt |
| 2 | **Işık:** yumuşak, hava perspektifi var mı? Altın akım tek doygun öğe mi? | Evet | Fazla parıltı → Resolve'de altın tonunu düşür |
| 3 | **Tasarım:** canlı model sheet'e uygun mu (oran, bacak/segment sayısı, renk)? | Sheet ile birebir | Bacak/uzuv hatası → Nano Banana Pro ile kare düzelt, videoyu bitiş karesiyle yeniden üret |
| 4 | **Hareket:** doğal mı, hızı doğru mu (dev canlı yavaş!)? Titreme, eriyen çizgi, morf var mı? | Kare kare bakışta temiz | Titreme → yeniden üret / sabit katmanla örte; hız → Resolve'de yeniden zamanla |
| 5 | **Kamera:** storyboard'daki hareket (sabit/kaydırma/zum) ve yön tutuyor mu? Altın akım sağa mı akıyor? | Evet | AI istemsiz kamera hareketi → promptta "locked-off static camera" + negatife "camera movement"; gerekiyorsa B yöntemine geç |
| 6 | **Zamanlama:** senaryo süresine yetiyor mu? | ±1 sn | Hold / yavaşlatma / ikinci klip |
| 7 | **Süreklilik:** 1i son kare = 2a ilk kare; 1f ve 2k aynı çiçek | Birebir | Bitiş karesini kilitle |
| 8 | **Artefakt:** yazı, filigran, logo, imza benzeri izler | Yok | Kırp / inpaint |

---

## Kullanıcıya sorular
1. **Aylık bütçe?** (a) ~$0-20, (b) ~$50-90 (önerilen kurulum), (c) $100+ (Seedance/Veo karşılaştırmasıyla birlikte geniş deneme)
2. **Bilgisayar:** NVIDIA ekran kartınız var mı, kaç GB VRAM? (Yerel Wan, Krita AI Diffusion, LoRA eğitimi için belirleyici)
3. **Deneyim:** Midjourney, Krita/Photoshop ya da DaVinci Resolve kullandınız mı? (Teknik destek yönergelerinin ayrıntı düzeyi buna göre)
4. Tasarımların yayından önce Midjourney'in herkese açık galerisinde görünmesi sorun mu? (Sorunsa Pro plan, $60)
5. Haftada kaç saat ayırabilirsiniz? (Sahne 1 tahmini ~42-68 kişi-saat)

## Kaynaklar (erişim tarihi 2026-10-08)
- Görsel modeller karşılaştırması: [dupple.com](https://dupple.com/learn/best-ai-image-generators), [tech-insider.org](https://tech-insider.org/best-ai-image-generator-2026/), [gradually.ai](https://www.gradually.ai/en/ai-image-generators/)
- Midjourney fiyat ve koşullar: [eesel.ai](https://eesel.ai/blog/midjourney-pricing), [aiproductivity.ai](https://aiproductivity.ai/pricing/midjourney/), [terms.law](https://terms.law/2026/01/15/midjourney-commercial-use-rights-complete-2026-guide/), [docs.midjourney.com/terms](https://docs.midjourney.com/docs/terms-of-service) (bu ortamdan açılamadı)
- Video modelleri: [dupple.com](https://dupple.com/learn/best-ai-video-generators), [morphed.app (2D/anime testi, satıcı blogu)](https://morphed.app/blog/ai-video-generator-for-anime), [invideo.io](https://invideo.io/faq/what-is-the-best-ai-video-model-for-generating-anime/)
- Kling fiyat ve koşullar: [hooked.so](https://www.hooked.so/compare/kling-ai-pricing), [cloudzero.com](https://www.cloudzero.com/blog/kling-ai-pricing/), [apiframe.ai](https://apiframe.ai/guides/kling-versions-explained), [cometapi.com](https://www.cometapi.com/are-kling-videos-private/), [Kling 3.0 Omni kılavuzu](https://kling.ai/pt/quickstart/klingai-video-3-omni-model-user-guide), [piapi.ai karşılaştırma](https://piapi.ai/id/blogs/kling-3-0-vs-kling-3-0-omni-video-quality)
- Seedance: [atlascloud.ai](https://www.atlascloud.ai/blog/seedance-2.0-pricing-full-cost-breakdown-2026), [capcut.com](https://www.capcut.com/resource/seedance-2-0-review)
- Veo / Flow: [blog.google](https://blog.google/technology/ai/veo-updates-flow/), [support.google.com/flow](https://support.google.com/flow/answer/16352836), [mindstudio.ai](https://www.mindstudio.ai/blog/google-flow-pricing-credits-tiers-explained)
- Nano Banana: [gemini.google](https://gemini.google/overview/image-generation/), [atlascloud.ai](https://www.atlascloud.ai/blog/guides/nanobanana-14-reference-images-consistency)
- Wan açık kaynak durumu: [howaiworks.ai](https://howaiworks.ai/blog/alibaba-wan-open-weights-stopped-at-2-2), [docs.comfy.org](https://docs.comfy.org/tutorials/video/wan/wan-video.md), [blog.comfy.org](https://blog.comfy.org/p/wan27-is-now-available-in-comfyui)
- FLUX.2 lisans: [HF FLUX.2-dev LICENSE](https://huggingface.co/black-forest-labs/FLUX.2-dev/blob/main/LICENSE.txt), [BFL klein eğitim](https://docs.us.bfl.ai/flux_2/flux2_klein_training)
- Krita AI Diffusion: [GitHub](https://github.com/Acly/krita-ai-diffusion/releases)
- Ara kare: [AceVFI survey](https://arxiv.org/pdf/2506.01061), [runcomfy ToonCrafter](https://www.runcomfy.com/comfyui-workflows/comfyui-tooncrafter-generate-cartoon-interpolation)
- Adobe Firefly: [the-decoder.com](https://the-decoder.com/adobe-firefly-now-bundles-30-ai-models-and-lets-users-train-custom-styles-on-their-own-images/), [itbrief.co.uk](https://itbrief.co.uk/story/adobe-adds-custom-models-to-firefly-in-public-beta)
- Resolve 21: [newsshooter.com](https://www.newsshooter.com/2026/06/02/davinci-resolve-21-final-release/), [sportsvideo.org](https://www.sportsvideo.org/2026/09/09/ibc-2026-blackmagic-design-releases-davinci-resolve-21-1/)
- Topaz: [getapp.com](https://www.getapp.com/all-software/a/topaz-video/), [myarchitectai.com](https://www.myarchitectai.com/blog/topaz-ai-pricing)
- YouTube AI etiketi: [blog.google](https://blog.google/intl/en-in/products/platforms/improving-ai-labels-for-viewers-and-creators/), [air.io](https://air.io/en/youtube-glossary/what-is-youtubes-ai-content-disclosure-policy)
