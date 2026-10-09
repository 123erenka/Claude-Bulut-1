// Bursa'nın tarihsel zaman çizelgesi: video saniyesi <-> yıl eşlemesi,
// hükümdarlar, nüfus tahminleri, olay kartları ve kamera planı.
// Koordinatlar: 1 birim = 1 km. Orijin = Bursa Hisarı (Tophane).
// x = doğu (+), z = güney (+). (Kuzey = -z)

export const DURATION = 300; // saniye

// [video saniyesi, yıl]  (negatif yıl = MÖ)
export const YEAR_KEYS = [
  [0, -260],
  [8, -202],
  [30, -74],
  [42, 330],
  [52, 1000],
  [62, 1302],
  [72, 1317],
  [92, 1326],
  [104, 1339],
  [128, 1400],
  [136, 1402],
  [146, 1413],
  [158, 1426],
  [174, 1600],
  [180, 1800],
  [186, 1801],
  [194, 1855],
  [206, 1905],
  [212, 1920],
  [220, 1922],
  [230, 1938],
  [236, 1958],
  [246, 1971],
  [258, 1990],
  [270, 2002],
  [280, 2014],
  [290, 2026],
  [300, 2026],
];

export function yearAt(t) {
  const k = YEAR_KEYS;
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i][0]) {
      const [t0, y0] = k[i - 1], [t1, y1] = k[i];
      return y0 + ((t - t0) / (t1 - t0)) * (y1 - y0);
    }
  }
  return k[k.length - 1][1];
}

export function timeAtYear(y) {
  const k = YEAR_KEYS;
  if (y <= k[0][1]) return k[0][0];
  for (let i = 1; i < k.length; i++) {
    if (y <= k[i][1] && k[i][1] > k[i - 1][1]) {
      const [t0, y0] = k[i - 1], [t1, y1] = k[i];
      return t0 + ((y - y0) / (y1 - y0)) * (t1 - t0);
    }
  }
  return DURATION;
}

export function formatYear(y) {
  y = Math.floor(y);
  if (y < 0) return 'MÖ ' + (-y);
  if (y === 0) return 'MS 1';
  if (y < 1000) return 'MS ' + y;
  return String(y);
}

// Hükümdar / yönetim (sol üst)
export const RULERS = [
  { from: -999, name: 'Bitinya Krallığı', emblem: 'bithynia' },
  { from: -74, name: 'Roma Cumhuriyeti / İmparatorluğu', emblem: 'rome' },
  { from: 330, name: 'Doğu Roma (Bizans) İmparatorluğu', emblem: 'byzantium' },
  { from: 1326, name: 'Osmanlı Beyliği', emblem: 'ottoman_early' },
  { from: 1383, name: 'Osmanlı Devleti', emblem: 'ottoman_early' },
  { from: 1844, name: 'Osmanlı İmparatorluğu', emblem: 'ottoman' },
  { from: 1920.52, name: 'Yunan işgali (1920–1922)', emblem: 'occupation' },
  { from: 1922.7, name: 'Ankara Hükümeti (TBMM)', emblem: 'tbmm' },
  { from: 1923.8, name: 'Türkiye Cumhuriyeti', emblem: 'turkey' },
];

export function rulerAt(y) {
  let r = RULERS[0];
  for (const x of RULERS) if (y >= x.from) r = x;
  return r;
}

// Nüfus tahminleri (şehir merkezi). Eski dönemler kaba tahmindir.
export const POP_KEYS = [
  [-260, 0],
  [-202, 3000],
  [-74, 8000],
  [120, 15000],
  [600, 15000],
  [1000, 10000],
  [1317, 8000],
  [1326, 6000],
  [1400, 30000],
  [1402, 30000],
  [1403, 15000],
  [1413, 20000],
  [1414, 16000],
  [1490, 35000],
  [1580, 60000],
  [1800, 60000],
  [1855, 70000],
  [1856, 60000],
  [1905, 76000],
  [1920, 72000],
  [1927, 61690],
  [1950, 103800],
  [1960, 153900],
  [1970, 276000],
  [1980, 445100],
  [1990, 834600],
  [2000, 1194700],
  [2010, 1750000],
  [2026, 2250000],
];

export function popAt(y) {
  const k = POP_KEYS;
  if (y <= k[0][0]) return 0;
  for (let i = 1; i < k.length; i++) {
    if (y <= k[i][0]) {
      const [y0, p0] = k[i - 1], [y1, p1] = k[i];
      return p0 + ((y - y0) / (y1 - y0)) * (p1 - p0);
    }
  }
  return k[k.length - 1][1];
}

// Olay kartları (sağ alt). t: başlangıç saniyesi, d: süre
export const EVENTS = [
  { t: 1, d: 7, title: 'Uludağ\'ın eteğinde', text: 'Antik çağda Mysia Olympos\'u denen dağın kuzey eteği; önünde verimli bir ova, yamaçta sıcak su kaynakları.' },
  { t: 9, d: 11, title: 'MÖ ~200 · Prusa kuruluyor', text: 'Bitinya Kralı I. Prusias, ovaya bakan travertin düzlüğe bir kale-şehir kurdurur. Şehir onun adıyla anılır: Prusa.' },
  { t: 21, d: 9, title: 'Sıcak sular', text: 'Batıdaki kaplıcalar (bugünkü Çekirge) şehrin en eski cazibe noktasıdır.' },
  { t: 31, d: 11, title: 'MÖ 74 · Roma dönemi', text: 'Bitinya Roma\'ya miras kalır. Şehrin adı Prusa ad Olympum olur. MS 111\'de vali Genç Plinius, Prusa\'nın hamamlarını imparatora yazar.' },
  { t: 43, d: 9, title: 'Bizans Prusası', text: 'Kale içinde kiliseler yükselir; kaplıcalar imparatorlar için de bir dinlenme yeridir.' },
  { t: 52, d: 10, title: '7.–11. yüzyıl · Akınlar', text: 'Arap akınları ve 11. yüzyıl sonunda kısa süren Selçuklu hâkimiyeti. Şehir surların arkasına çekilir.' },
  { t: 63, d: 9, title: '1302 · Osman Bey bölgede', text: 'Koyunhisar zaferinden sonra Osmanlı akıncıları Bursa ovasına ulaşır.' },
  { t: 72, d: 10, title: '1317–1326 · Uzun kuşatma', text: 'Osman Bey şehri doğrudan saldırmak yerine çevresine iki havale kulesi (Balabancık ve Aktimur) kurdurup aç bırakır.' },
  { t: 83, d: 9, title: '6 Nisan 1326 · Bursa düşüyor', text: 'Orhan Bey, kuşatılmış şehrin teslimini kabul eder. Bursa, Osmanlıların ilk büyük başkenti olur.' },
  { t: 93, d: 10, title: 'Osman Gazi Türbesi', text: 'Babası Osman Bey, vasiyeti üzerine Hisar\'daki eski bir şapele (Gümüşlü Kümbet) defnedilir.' },
  { t: 104, d: 10, title: 'Surların dışına taşan şehir', text: 'Orhan Gazi Külliyesi (1339) ve Bey Hanı yeni çarşının çekirdeği olur. Şehir doğuya, ovaya doğru büyür.' },
  { t: 114, d: 8, title: '1366–1385 · Çekirge', text: 'I. Murad, kaplıcaların yanına Hüdavendigar Külliyesi\'ni yaptırır.' },
  { t: 122, d: 9, title: '1396–1400 · Ulu Cami', text: 'Yıldırım Bayezid, Niğbolu zaferinden sonra 20 kubbeli Ulu Cami\'yi yaptırır. Doğuda Yıldırım Külliyesi yükselir.' },
  { t: 131, d: 9, title: '1402 · Timur ordusu', text: 'Ankara Savaşı\'ndan sonra Timur\'un torunu Muhammed Sultan Bursa\'yı yağmalar ve yakar.' },
  { t: 141, d: 9, title: '1413 · Karamanoğlu kuşatması', text: 'Fetret karmaşasında Karamanoğlu Mehmed Bey şehri kuşatır; çarşı ve mahalleler yeniden yanar.' },
  { t: 150, d: 10, title: '1419–1426 · Yeniden doğuş', text: 'Yeşil Cami ve Yeşil Türbe, Emir Sultan ve Muradiye Külliyesi. Şehir "yeşil Bursa" kimliğini kazanır.' },
  { t: 160, d: 9, title: 'İpek Yolu\'nun ucu', text: 'İran\'dan gelen ham ipek kervanları Koza Han\'da (1491) alınıp satılır. Bursa ipeği Avrupa\'ya kadar ulaşır.' },
  { t: 169, d: 8, title: 'Başkent değişse de...', text: 'Başkent önce Edirne\'ye, 1453\'te İstanbul\'a taşınır; Bursa sultan türbeleriyle manevi başkent kalır.' },
  { t: 180, d: 7, title: '1801 · Büyük yangın', text: 'Çarşı ve hanlar bölgesi alevler içinde kalır; yüzlerce dükkân ve ev yanar.' },
  { t: 188, d: 9, title: '28 Şubat 1855 · Büyük deprem', text: 'Peş peşe gelen iki büyük deprem şehri yıkar. Ulu Cami\'nin kubbeleri, Osman ve Orhan türbeleri çöker.' },
  { t: 197, d: 9, title: 'Ahmet Vefik Paşa (1879–1882)', text: 'Geniş caddeler, hükümet konağı, tiyatro. Osmanlı çarşısının yanında modern bir şehir merkezi doğar.' },
  { t: 203, d: 8, title: '1892 · Mudanya demiryolu · 1905 Saat Kulesi', text: 'Bursa denize trenle bağlanır. Tophane Saat Kulesi şehrin yeni simgesi olur.' },
  { t: 211, d: 8, title: '8 Temmuz 1920 · İşgal', text: 'Kurtuluş Savaşı sırasında Bursa Yunan ordusu tarafından işgal edilir.' },
  { t: 219, d: 7, title: '11 Eylül 1922 · Kurtuluş', text: 'Büyük Taarruz\'un ardından Türk süvarileri şehre girer.' },
  { t: 226, d: 8, title: '1938 · Merinos Fabrikası', text: 'Cumhuriyetin ilk büyük yünlü dokuma fabrikası açılır; Atatürk açılışta bulunur.' },
  { t: 233, d: 6, title: '1958 · Kapalıçarşı yangını', text: 'Tarihi çarşı yeniden yanar ve aslına uygun biçimde onarılır.' },
  { t: 246, d: 9, title: '1961–1971 · Sanayi patlaması', text: 'Türkiye\'nin ilk Organize Sanayi Bölgesi Bursa\'da kurulur. 1971\'de Tofaş ve Renault üretime başlar. Göçle şehir ovaya yayılır.' },
  { t: 240, d: 6, title: '1963 · Uludağ teleferiği', text: 'Şehir merkezini dağdaki yaylalara bağlayan teleferik açılır.' },
  { t: 256, d: 8, title: 'Ova betonlaşıyor', text: '1975\'te Uludağ Üniversitesi, 1987\'de Nilüfer ilçesi. Verimli Bursa ovası hızla konut ve fabrikalarla dolar.' },
  { t: 264, d: 6, title: '17 Ağustos 1999 · Marmara Depremi', text: 'Gölcük merkezli deprem Bursa\'da da hissedilir; fay hatları üzerindeki şehir için güçlü bir uyarı olur.' },
  { t: 270, d: 4, title: '2002 · Bursaray', text: 'Hafif raylı sistem doğu ile batıyı birbirine bağlar.' },
  { t: 274, d: 9, title: '2014 · UNESCO Dünya Mirası', text: '"Bursa ve Cumalıkızık: Osmanlı İmparatorluğu\'nun Doğuşu" listeye girer: Hanlar Bölgesi, külliyeler ve Cumalıkızık köyü.' },
  { t: 284, d: 9, title: 'Bugün', text: 'Yaklaşık 2,2 milyon kişi Uludağ ile ova arasındaki bu şeritte yaşıyor. Şehrin kalbi hâlâ 2200 yıl önceki tepede.' },
];

// Kamera planı: [t, hedef x, hedef z, uzaklık(km), azimut(derece), eğim(derece)]
// azimut 0 => kamera hedefin kuzeyinde, güneye (Uludağ'a) bakar. Kuzey = -z.
export const CAMERA_KEYS = [
  [0, 2, 6, 26, 8, 16],
  [6, 1, 2, 14, 2, 22],
  [9, 0.05, 0.05, 2.4, -15, 36],
  [16, 0.05, 0.05, 2.0, 15, 32],
  [20, -2.2, -1.0, 2.2, -30, 30],
  [27, -1.6, -0.7, 3.2, -10, 32],
  [31, -2.6, -1.2, 1.6, 20, 30],
  [37, -1.0, -0.4, 4.0, 0, 34],
  [43, 0.05, 0.05, 1.6, 35, 32],
  [50, 0.1, -0.1, 3.0, 15, 36],
  [56, 0.0, -2.0, 9.0, -5, 30],
  [63, 2.0, -2.0, 7.0, 20, 30],
  [70, 0.1, -0.2, 4.5, 10, 38],
  [80, 0.1, -0.2, 3.8, -15, 40],
  [86, 0.1, 0.0, 2.2, 0, 34],
  [93, 0.13, 0.09, 1.0, -30, 28],
  [97, 0.13, 0.09, 1.1, -20, 28],
  [100, 0.4, 0.1, 2.0, 0, 30],
  [105, 0.79, 0.22, 1.2, 15, 30],
  [107.5, 0.79, 0.22, 1.3, 25, 30],
  [110, 0.2, -0.2, 3.5, -10, 32],
  [114, -2.81, -1.39, 1.3, -25, 30],
  [116.5, -2.81, -1.39, 1.4, -10, 30],
  [119, -1.2, -0.6, 3.5, 0, 32],
  [122.5, 0.5, 0.15, 1.3, 15, 30],
  [126, 1.6, -0.4, 3.5, 20, 32],
  [130, 1.2, -0.3, 6.0, 25, 36],
  [137, 1.0, -0.1, 4.5, 0, 38],
  [141, 2.0, -0.3, 5.0, 20, 36],
  [147, 1.0, 0.0, 3.5, -5, 34],
  [150.5, 1.55, 0.41, 1.3, -15, 28],
  [152.5, 1.55, 0.41, 1.4, 0, 28],
  [154.5, 1.2, 0.0, 3.0, 10, 32],
  [157, -0.8, -0.55, 1.4, -20, 30],
  [159, -0.8, -0.55, 1.5, -5, 30],
  [161, 4.0, -0.8, 8.0, 25, 30],
  [164, 0.66, 0.2, 1.3, 10, 32],
  [166, 0.66, 0.2, 1.4, 30, 32],
  [170, 0.5, -0.4, 6.0, 0, 34],
  [176, 0.5, -0.4, 7.5, -10, 32],
  [181, 0.62, 0.2, 2.0, -10, 36],
  [183.5, 0.62, 0.2, 2.2, 5, 36],
  [187, 0.6, -0.1, 4.5, 10, 36],
  [195, 0.6, -0.2, 4.0, -5, 34],
  [199, 0.97, 0.06, 1.6, 10, 30],
  [201, 0.97, 0.06, 1.7, 25, 30],
  [203, -0.5, -1.4, 3.0, -25, 32],
  [206.5, 0.0, -0.17, 1.2, 0, 26],
  [208, 0.0, -0.17, 1.3, 20, 26],
  [210.5, 0.0, -1.0, 7.0, 0, 34],
  [219, 1.5, -0.6, 6.0, 15, 34],
  [223, 0.0, -0.8, 6.0, 0, 34],
  [228, -0.94, -1.61, 1.6, -15, 30],
  [231.5, -0.94, -1.61, 1.9, 10, 30],
  [235.5, 0.62, 0.25, 1.6, 10, 34],
  [237.8, 0.62, 0.25, 1.8, 25, 34],
  [240, 3.6, 3.0, 6.5, 45, 22],
  [245, -1.5, -2.5, 10.0, -5, 30],
  [251, -3.5, -3.5, 9.0, -20, 32],
  [257, -4.0, -3.0, 18.0, -10, 32],
  [264, -2.0, -2.0, 12.0, 5, 32],
  [268.5, -3.0, -2.2, 7.0, 15, 30],
  [274, 0.6, 0.1, 3.0, -5, 30],
  [279, 9.9, 1.2, 2.2, -10, 28],
  [281.2, 9.9, 1.2, 2.0, -25, 28],
  [283.5, -3.0, -3.5, 9.0, -20, 30],
  [288, 0.0, -2.0, 22.0, 0, 24],
  [300, 2.0, 2.0, 34.0, 0, 20],
];
