# Agent'lar Arası Talepler

`animasyon-yonetmeni` ↔ `animasyon-uretim` iletişim dosyası. Ana oturum, burada "bekliyor" durumunda olan talepler için ilgili agent'ı çağırır.

**Format:**
```
## [T-001] [yonetmen → uretim] Kısa başlık
- Tarih:
- Durum: bekliyor / sürüyor / tamamlandı / reddedildi
- İstek:
- Dayanak belgeler:
- Kabul kriterleri:
- Yanıt:
```

---

## [T-001] [yonetmen → uretim] Pilot için görsel geliştirme planı
- Tarih: 2026-10-08
- Durum: bekliyor
- İstek: Pilot bölümün görsel geliştirme aşaması için bir plan hazırla:
  1. **Stil rehberi taslağı** (`proje/stil/stil-rehberi.md`): Dizinin görsel dilini kelimelerle tarif et (çizgi, renk, ışık, doku, kamera). Pilotun renk dili: mucize anları sıcak (altın, turuncu), gizem/tehdit soğuk (mor, gri, mavi).
  2. **Tasarım listesi:** Pilotta tasarlanması gereken her şey: yeni canlılar (sis yüzücüleri, altın taşıyıcı, dağ otlakçısı, nefes alan çiçek, göl gölgesi, zar bitkileri, fener sümüklüleri, pusu kabuğu, su toplayan bitkiler), ortamlar (montajdaki biyomlar, doğum açıklığı, koloni, Kamen'in bahçesi, tarikatın gemisi içi ve dışı, Kris'in hücresi), yavru Levi, tarikatın maskeleri ve kıyafetleri. Her biri için öncelik ve hangi sahnede kullanıldığı.
  3. **Araç ve pipeline önerisi:** Konsept görseli, karakter/canlı tutarlılığı ve görselden videoya için en uygun güncel yapay zekâ araçları (güncel web araştırmasıyla, fiyat ve kullanım koşulları dahil). Pilotun üretim testine sahne 1 (Vesta montajı) ile başlanacak; bu sahne için adım adım pipeline.
  4. **Prompt şablonları:** Sahne 1'deki 9 plan için birer prompt şablonu (`proje/uretim/promptlar/`).
- Dayanak belgeler: `proje/hikaye/bolum01-pilot.md` (sahne listesi v2, montaj plan listesi, canlılar tablosu), `proje/hikaye/sezon2-taslak.md`, `proje/kanon/sezon1-ozet.md`
- Kabul kriterleri: Stil rehberi taslağı, önceliklendirilmiş tasarım listesi, araç tablosu (gerekçeli, tarihli), sahne 1 pipeline'ı ve 9 prompt şablonu dosyalarda hazır.
- Kısıt: Yeni canlılar ve tarikat tasarımları projeye özgü ve özgün olmalı. Promptlarda dizinin adına veya orijinal karelere dayanma; görsel dili kelimelerle tarif et. Orijinal dizinin karakterlerini (Azi, Levi vb.) sen üretme; onlar için sadece kullanıcının izleyeceği yöntemi (model sheet, referans hazırlama) planla.
- Yanıt:

## [T-002] [yonetmen → uretim] Ses ve müzik için araç önerisi
- Tarih: 2026-10-08
- Durum: bekliyor
- İstek: `proje/ses/ses-muzik-rehberi.md` dosyasındaki pilot ses planı ve 4 leitmotif için ses efekti üretimi, ses tasarımı ve müzik üretimi araçlarını araştır ve öner. Üretilen müziğin kullanım hakları ve koşulları özellikle kontrol edilmeli. Leitmotiflerin farklı hâllerinin (sıcak, soğuk, ters) tutarlı üretilmesi için bir yöntem öner.
- Dayanak belgeler: `proje/ses/ses-muzik-rehberi.md`, `proje/hikaye/bolum01-pilot.md`
- Kabul kriterleri: Araç tablosu (gerekçeli, tarihli) ve leitmotif üretim yöntemi `proje/uretim/ses-pipeline.md` dosyasında.
- Yanıt:
