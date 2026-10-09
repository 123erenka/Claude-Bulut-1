# Sonraki adım: şehirden bağımsız site altyapısı

Bu dosya yeni bir sohbette (yerel bilgisayarda) devam etmek için yazıldı. Kullanıcının kabul ettiği kararlar:

- Mevcut Bursa animasyonu **şehirden bağımsız bir motora + şehir veri dosyasına** ayrılacak.
- Çıktının ana biçimi **etkileşimli site** olacak; video bu sitenin "dışa aktar" ürünü olacak.
- Render: işçiler ortak kuyruktan kare alır, tek geçişte doğrudan hedef kalitede 1080p + ses kodlanır (**yapıldı**, `render.mjs`).
- Render ekran kartıyla yapılacak (`--gpu`), kontrol için tek tek kare yerine kontrol ızgarası kullanılacak (`snap.mjs --sheet`, **yapıldı**).

## Mevcut durum (bu sohbetin sonu)

- `src/main.js` sahne motoru, ama içinde Bursa'ya özgü sabitler var: anıtlar (`L(...)` çağrıları), ordular (`troop(...)`),
  yıkımlar (`DESTRUCTIONS`), yollar/raylar (`ROADS`, `RAIL_MUDANYA`, `BURSARAY`), etiketler (`LABELS`), bayrak konumu.
- `src/world.js`: arazi (`RIDGE`, `HISAR`, `RIVERS`) ve büyüme bölgeleri (`ZONES`, `PROTECTED`, `KEEPOUT`) Bursa'ya özgü.
- `src/timeline.js`: tamamen Bursa verisi (yıl eşlemesi, yönetimler, nüfus, olaylar, kamera planı).
- `ses/ses.py`: olay zamanları elle yazılmış.

## Hedef yapı

```
motor/                  şehirden bağımsız
  sahne.js              arazi, binalar, anıt tipleri, ordular, parçacıklar, etiketler, arayüz
  anitlar.js            anıt üreticileri: cami, külliye, han, kilise, sur, fabrika, stadyum, istasyon...
  kamera.js             olay listesinden otomatik kamera planı (+ isteğe bağlı elle düzeltme)
  ses.py                olay tiplerine bağlı efekt + bölüm müziği şablonları
sehirler/
  bursa/sehir.json      tüm Bursa verisi (aşağıdaki şema)
site/
  index.html            yıl kaydırıcısı, oynat/duraklat, olay listesi, şehir seçici, "video olarak indir"
render.mjs, snap.mjs    sehir.json'u parametre olarak alır: node render.mjs --sehir bursa --gpu
```

## `sehir.json` taslak şeması

```jsonc
{
  "ad": "Bursa", "merkez": { "lat": 40.1855, "lon": 29.0560 },   // koordinatlar lat/lon, motor km'ye çevirir
  "sure": 300,
  "yillar": [[0, -260], [8, -202], ...],                            // video saniyesi → yıl
  "yonetimler": [{ "yil": -999, "ad": "Bitinya Krallığı", "arma": "bithynia" }, ...],
  "nufus": [[-202, 3000], ...],
  "arazi": { "dag": [...], "duzluk": {...}, "akarsular": [...] },   // ileride: SRTM + OSM'den otomatik
  "bolgeler": [{ "lat": ..., "lon": ..., "rx": 0.4, "rz": 0.28, "yil": -202, "sure": 500, "tip": "eski", "yogunluk": 0.85 }],
  "anitlar": [{ "ad": "Ulu Cami", "tip": "ulu_cami", "lat": ..., "lon": ..., "yil": 1396, "bitis": 1400, "deprem": [1855, 1863] }],
  "olaylar": [
    { "yil": 1402, "tip": "yangin", "lat": ..., "lon": ..., "yaricap": 1.4, "baslik": "1402 · Timur ordusu", "metin": "..." },
    { "yil": 1855, "tip": "deprem", ... }, { "yil": 1326, "tip": "kusatma", ... }, { "yil": 1920, "tip": "ordu", "yol": [...] }
  ],
  "ulasim": [{ "ad": "Mudanya demiryolu", "tip": "ray", "yil": 1892, "bitis": 1953, "yol": [...] }],
  "etiketler": [...]
}
```

## Yapılacaklar sırası

1. `timeline.js` + `world.js` + `main.js` içindeki Bursa verisini `sehirler/bursa/sehir.json`'a taşı; motor bu dosyayı yüklesin.
   Başarı ölçütü: aynı saniyelerde alınan kontrol ızgarası, taşımadan önceki ile görsel olarak aynı.
2. Otomatik kamera: her olay/anıt için konum + zaman → kamera hedefi, uzaklığı olayın yarıçapından, bekleme süresi
   kart süresinden. Elle yazılmış 70 kamera noktası yerine kural; gerekirse `sehir.json` içinde düzeltme alanı.
3. Site arayüzü: yıl kaydırıcısı (`renderAt(t)` zaten deterministik), oynat/duraklat, olay listesine tıklayınca o ana
   atlama, mobil uyum. Video dışa aktarımı ilk aşamada `render.mjs`, ileride tarayıcıda WebCodecs ile.
4. `ses.py` olay listesini `sehir.json`'dan okusun (yangın/deprem/ordu efektleri olay tipinden).
5. İkinci şehirle test (ör. İstanbul tarihi yarımada veya İzmir): yeni şehir sadece `sehir.json` yazarak çalışmalı.
6. İleride: OSM (kıyı, nehir, yol), SRTM (yükseklik), Wikidata (anıt koordinatları) ile arazi ve konumları otomatik çek;
   şehir dosyasını bir LLM araştırma adımı üretsin (web araması + yapılandırılmış çıktı).

## Verimlilik kuralları (önceki oturumdan çıkarılan dersler)

- Görsel kontrolü **tek ızgara görseliyle** yap (`--sheet`), kareleri tek tek açma: bağlam ve maliyet şişiyor.
- Önizleme turlarını birleştir: birden çok düzeltmeyi uygula, sonra tek seferde kontrol et.
- Uzun işleri (render) bekleme döngüsüyle izleme; bitince bildirim gelsin.
- Render'ı hedef kalitede bir kez kodla; ara dosya/yeniden kodlama yok.
- İlk kare shader derlemesi içerir (~5–10 sn); hız ölçümünde ilk kareyi sayma.
