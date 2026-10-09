// Arazi, akarsular ve şehir büyüme modeli (deterministik).
// 1 birim = 1 km. Orijin = Bursa Hisarı. x = doğu, z = güney (kuzey = -z).

export const VEX = 1.5; // dikey abartma

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash2(x, z) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(z | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}

export function fbm(x, z, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, z * f); f *= 2.03; a *= 0.5; }
  return s;
}

export const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// Uludağ sırtı: [x, z, yükseklik(km), genişlik]
const RIDGE = [
  [-14, 5.5, 0.6, 3.2],
  [-3, 5.2, 1.0, 3.2],
  [5, 6.8, 1.65, 3.8],
  [14, 11.5, 2.54, 4.8],
  [26, 17, 1.7, 6.0],
];

function ridge(x, z) {
  let best = 0;
  for (let i = 0; i < RIDGE.length - 1; i++) {
    const [ax, az, ah, aw] = RIDGE[i], [bx, bz, bh, bw] = RIDGE[i + 1];
    const dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz;
    let u = ((x - ax) * dx + (z - az) * dz) / L2;
    u = Math.max(0, Math.min(1, u));
    const px = ax + dx * u, pz = az + dz * u;
    const d = Math.hypot(x - px, z - pz);
    const h = ah + (bh - ah) * u, w = aw + (bw - aw) * u;
    best = Math.max(best, h * Math.exp(-(d / w) * (d / w)));
  }
  return best;
}

export const HISAR = { x: 0.05, z: 0.05, rx: 0.4, rz: 0.29 };

export function terrainHeight(x, z) {
  let h = 0.1 + 0.012 * fbm(x * 0.3, z * 0.3);
  const m = ridge(x, z);
  h += m * (1 + 0.22 * fbm(x * 0.45 + 3.1, z * 0.45 + 7.7, 5));
  // dağlık doku: vadiler ve sırtlar
  const rg = 1 - Math.abs(fbm(x * 0.55 + 1.3, z * 0.55 - 2.1, 5));
  h += smooth(0.25, 1.2, m) * (0.22 * rg * rg - 0.08);
  // kuzeydeki tepeler (Mudanya yönü)
  const s = smooth(9, 16, -z);
  h += 0.3 * s * (0.6 + 0.5 * fbm(x * 0.3 + 11, z * 0.3 - 4));
  // dağın arkasındaki yaylalar
  h += 0.9 * smooth(13, 26, z) * (0.6 + 0.5 * fbm(x * 0.2 + 3, z * 0.2));
  // doğudaki tepeler (Kestel ötesi)
  h += 0.18 * smooth(16, 24, x) * (0.6 + 0.5 * fbm(x * 0.4, z * 0.4 + 9));
  // Hisar travertin düzlüğü
  const e = ((x - HISAR.x) / (HISAR.rx + 0.03)) ** 2 + ((z - HISAR.z) / (HISAR.rz + 0.03)) ** 2;
  h += 0.035 * (1 - smooth(0.7, 1.25, e));
  // nehir yatakları hafifçe aşağıda
  const rd = riverDist(x, z);
  h -= 0.012 * (1 - smooth(0.05, 0.4, rd)) * (1 - smooth(0.3, 0.8, m));
  return h;
}

// ---- Akarsular ----
export const RIVERS = [
  { name: 'Nilüfer Çayı', w: 0.06, pts: [[30, 8], [24, 2], [18, -1.5], [12, -4.5], [6, -6.3], [0, -6.9], [-5, -6.4], [-9, -6.1], [-14, -7.4], [-20, -8.8], [-30, -10]] },
  { name: 'Gökdere', w: 0.025, pts: [[2.6, 6], [1.9, 2.5], [1.35, 0.7], [1.2, -0.8], [1.6, -3], [2.4, -5], [3.2, -6.5]] },
  { name: 'Cilimboz', w: 0.018, pts: [[-0.6, 3.5], [-0.35, 1.2], [-0.3, 0.45], [-0.55, -0.8], [-1.1, -3], [-1.6, -5], [-2.2, -6.8]] },
  { name: 'Deliçay', w: 0.02, pts: [[7.5, 5], [6.6, 1.5], [6.2, -1.5], [6.5, -4], [6.8, -6.3]] },
];

function segDist(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz;
  let u = ((px - ax) * dx + (pz - az) * dz) / L2;
  u = Math.max(0, Math.min(1, u));
  return Math.hypot(px - (ax + dx * u), pz - (az + dz * u));
}

export function riverDist(x, z) {
  let d = 1e9;
  for (const r of RIVERS) for (let i = 0; i < r.pts.length - 1; i++) {
    const [ax, az] = r.pts[i], [bx, bz] = r.pts[i + 1];
    d = Math.min(d, segDist(x, z, ax, az, bx, bz));
  }
  return d;
}

// ---- Şehir büyüme bölgeleri ----
// type: old (geleneksel ev), mid (19-20. yy), apt (apartman), ind (sanayi), campus
// year: bölgenin yerleşime açıldığı yıl, span: binaların yayılma süresi (yıl)
export const ZONES = [
  { cx: 0.05, cz: 0.05, rx: 0.39, rz: 0.28, year: -202, span: 500, type: 'old', dens: 0.85, rot: 0 },
  { cx: 9.9, cz: 1.2, rx: 0.22, rz: 0.15, year: 1320, span: 80, type: 'old', dens: 0.9, rot: 0 }, // Cumalıkızık
  { cx: -2.8, cz: -1.25, rx: 0.32, rz: 0.22, year: 1340, span: 100, type: 'old', dens: 0.5, rot: 0 }, // Çekirge
  { cx: 0.85, cz: 0.15, rx: 0.5, rz: 0.3, year: 1330, span: 60, type: 'old', dens: 0.85, rot: 10 },
  { cx: 1.6, cz: 0.3, rx: 0.45, rz: 0.3, year: 1395, span: 50, type: 'old', dens: 0.8, rot: 10 },
  { cx: 3.1, cz: -0.95, rx: 0.4, rz: 0.3, year: 1392, span: 60, type: 'old', dens: 0.6, rot: 0 },
  { cx: 2.5, cz: 0.0, rx: 0.32, rz: 0.25, year: 1425, span: 60, type: 'old', dens: 0.7, rot: 0 },
  { cx: -0.8, cz: -0.5, rx: 0.36, rz: 0.26, year: 1424, span: 60, type: 'old', dens: 0.75, rot: 0 },
  { cx: 0.3, cz: -0.25, rx: 3.6, rz: 0.75, year: 1450, span: 150, type: 'old', dens: 0.85, rot: 14 },
  { cx: 0.3, cz: -0.35, rx: 4.2, rz: 1.0, year: 1860, span: 60, type: 'mid', dens: 0.6, rot: 14 },
  { cx: -0.6, cz: -1.7, rx: 0.7, rz: 0.5, year: 1892, span: 30, type: 'mid', dens: 0.6, rot: 0 },
  { cx: 0.2, cz: -0.8, rx: 4.6, rz: 1.5, year: 1945, span: 22, type: 'apt', dens: 0.8, rot: 12 },
  { cx: -4.8, cz: -3.9, rx: 1.3, rz: 0.8, year: 1964, span: 12, type: 'ind', dens: 0.9, rot: 0 }, // OSB
  { cx: 1.0, cz: -4.2, rx: 0.9, rz: 0.55, year: 1970, span: 6, type: 'ind', dens: 0.9, rot: 0 }, // Tofaş
  { cx: 0.0, cz: -1.6, rx: 6.5, rz: 2.3, year: 1964, span: 18, type: 'apt', dens: 0.75, rot: 10 },
  { cx: -15.8, cz: -4.9, rx: 1.0, rz: 0.7, year: 1976, span: 15, type: 'campus', dens: 0.8, rot: 0 },
  { cx: 13.1, cz: -1.6, rx: 1.2, rz: 0.8, year: 1975, span: 20, type: 'apt', dens: 0.6, rot: 0 },
  { cx: 2.0, cz: -9.4, rx: 2.0, rz: 1.2, year: 1984, span: 20, type: 'ind', dens: 0.85, rot: 0 }, // Demirtaş OSB
  { cx: -2.5, cz: -2.3, rx: 8.5, rz: 2.8, year: 1980, span: 15, type: 'apt', dens: 0.7, rot: 8 },
  { cx: -8.2, cz: -3.3, rx: 2.2, rz: 1.3, year: 1986, span: 14, type: 'apt', dens: 0.75, rot: 0 }, // Nilüfer
  { cx: 5.5, cz: -1.0, rx: 2.8, rz: 1.2, year: 1982, span: 18, type: 'apt', dens: 0.7, rot: 0 },
  { cx: -4.0, cz: -2.9, rx: 12, rz: 3.6, year: 1998, span: 16, type: 'apt', dens: 0.55, rot: 6 },
  { cx: -15.0, cz: -4.0, rx: 2.0, rz: 1.0, year: 2002, span: 18, type: 'apt', dens: 0.6, rot: 0 }, // Görükle
  { cx: 12.5, cz: -1.8, rx: 2.3, rz: 1.1, year: 2003, span: 18, type: 'apt', dens: 0.55, rot: 0 },
  { cx: -1.0, cz: -6.0, rx: 3.0, rz: 1.5, year: 2005, span: 18, type: 'apt', dens: 0.5, rot: 0 },
  { cx: -3.0, cz: -3.0, rx: 14.5, rz: 4.3, year: 2010, span: 15, type: 'apt', dens: 0.4, rot: 5 },
];

// Tarihi doku korunan alanlar (apartmanlaşmaz)
export const PROTECTED = [
  [0.05, 0.05, 0.45], [0.65, 0.17, 0.3], [1.6, 0.4, 0.25], [-0.8, -0.55, 0.22], [9.9, 1.2, 0.3], [2.5, 0.0, 0.15],
];

// Bina yerleşmesin (anıt çevreleri)
export const KEEPOUT = [
  [0.47, 0.15, 0.13], [0.6, 0.33, 0.1], [0.66, 0.2, 0.11], [0.79, 0.22, 0.08], [0.97, 0.06, 0.1],
  [-2.81, -1.39, 0.09], [-2.62, -1.22, 0.1], [3.1, -1.05, 0.08], [1.55, 0.41, 0.08], [1.52, 0.5, 0.05],
  [2.49, 0.0, 0.08], [-0.81, -0.58, 0.12], [0.0, -0.17, 0.04], [-0.7, -1.8, 0.08], [-0.94, -1.61, 0.24],
  [2.7, 0.6, 0.06], [-4.2, -4.6, 0.2], [0.13, 0.09, 0.05], [0.2, 0.15, 0.05], [-0.08, 0.0, 0.07],
];

function zoneNorm(zn, x, z) {
  const r = (zn.rot * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  const dx = x - zn.cx, dz = z - zn.cz;
  const lx = dx * c + dz * s, lz = -dx * s + dz * c;
  return Math.sqrt((lx / zn.rx) ** 2 + (lz / zn.rz) ** 2);
}

export function generateBuildings() {
  const rnd = mulberry32(1326);
  const out = [];
  const STEP = 0.042;
  const spacing = { old: 0.042, mid: 0.055, apt: 0.05, ind: 0.14, campus: 0.11 };
  const used = new Set();
  for (let x = -18; x <= 16; x += STEP) {
    for (let z = -11.5; z <= 2.5; z += STEP) {
      const jx = x + (rnd() - 0.5) * STEP * 0.8, jz = z + (rnd() - 0.5) * STEP * 0.8;
      let best = null, bestE = 0;
      const wob = 0.18 * fbm(jx * 1.7, jz * 1.7);
      for (const zn of ZONES) {
        const e = zoneNorm(zn, jx, jz);
        const lim = zn.rx > 2 ? 1 + wob * 1.3 : 1 + wob * 0.5;
        if (e < lim && (!best || zn.year < best.year)) { best = zn; bestE = e / lim; }
      }
      if (!best) continue;
      const sp = spacing[best.type];
      const ortho = best.type !== 'old' && best.type !== 'mid';
      let bx = jx, bz = jz, ang = 0;
      if (ortho) {
        ang = 0.24 + 0.6 * fbm(jx * 0.22 + 5, jz * 0.22 + 2);
        const c = Math.cos(ang), s2 = Math.sin(ang);
        const gu = best.type === 'ind' ? 0.16 : 0.062, gv = best.type === 'ind' ? 0.12 : 0.05;
        let u = jx * c - jz * s2, v = jx * s2 + jz * c;
        const iu = Math.round(u / gu), iv = Math.round(v / gv);
        if (best.type !== 'ind' && (((iu % 5) + 5) % 5 === 0 || ((iv % 4) + 4) % 4 === 0)) continue; // sokaklar
        const key = best.type[0] + iu + ',' + iv;
        if (used.has(key)) continue;
        used.add(key);
        u = iu * gu; v = iv * gv;
        bx = u * c + v * s2; bz = -u * s2 + v * c;
      }
      const edgeF = 0.55 + 0.45 * (1 - bestE * bestE);
      let p = best.type === 'apt' ? best.dens * edgeF * 1.25 : best.type === 'ind' ? best.dens * edgeF * 0.35 : (STEP / sp) ** 2 * best.dens * edgeF;
      if (rnd() > p) continue;
      // arazi kısıtları
      const h = terrainHeight(bx, bz);
      if (h > 0.5) continue;
      const hx = terrainHeight(bx + 0.04, bz) - h, hz = terrainHeight(bx, bz + 0.04) - h;
      if (Math.hypot(hx, hz) / 0.04 > 0.22) continue;
      if (riverDist(bx, bz) < (best.type === 'ind' ? 0.15 : 0.06)) continue;
      // Hisar surlarının dış bandına bina koyma
      const he = Math.sqrt(((bx - HISAR.x) / HISAR.rx) ** 2 + ((bz - HISAR.z) / HISAR.rz) ** 2);
      if (he > 0.9 && he < 1.12) continue;
      if (best.type === 'old' && best.year < 0 && he >= 1.0) continue;
      if (KEEPOUT.some(([kx, kz, kr]) => Math.hypot(bx - kx, bz - kz) < kr)) continue;
      let type = best.type;
      if (type === 'apt' && best.year >= 1985 && rnd() < 0.05) type = 'tower';
      const year = best.year + Math.pow(rnd(), best.type === 'old' ? 1 : 0.8) * best.span;
      const nb = makeBuilding(rnd, bx, bz, h, type, year);
      if (ortho) nb.rotY = ang + (rnd() - 0.5) * 0.06;
      out.push(nb);
    }
  }
  // Eski evlerin apartmanlara dönüşmesi (1955-1995)
  const extra = [];
  for (const b of out) {
    if ((b.type === 'old' || b.type === 'mid') && b.year < 1940) {
      const prot = PROTECTED.some(([px, pz, pr]) => Math.hypot(b.x - px, b.z - pz) < pr);
      if (!prot && rnd() < 0.75) {
        const y = 1955 + rnd() * 40;
        b.deathYear = y;
        extra.push(makeBuilding(rnd, b.x, b.z, b.h, 'apt', y + 0.5));
      }
    }
  }
  return out.concat(extra);
}

const PALETTE = {
  old: { wall: [0xeadcc2, 0xe2cfae, 0xf2e9d8, 0xd9c09c, 0xe8d6c0], roof: [0xb4553a, 0xa24a31, 0xc2663f, 0x9c4632] },
  mid: { wall: [0xe8d8b8, 0xdcbfa0, 0xd0d6c4, 0xeee2cc, 0xc9b79a], roof: [0xa8503a, 0x9a4735, 0xb85d40] },
  apt: { wall: [0xe9d8b4, 0xd9c7a7, 0xe8cfc0, 0xcfd8d0, 0xf1ece2, 0xbfb8ad, 0xe6e2d9, 0xdcc9a0, 0xd6b9a0], roof: [0xa5523a, 0x9b5a45, 0xb0654a, 0x8f4f3c] },
  tower: { wall: [0xb7c4cf, 0xa9b8c4, 0xcfd6dc] },
  ind: { wall: [0xc8ccd0, 0xb9c0c6, 0xd6d8da], roof: [0x9fb3c2, 0xd0d4d8, 0x8fa4b4] },
  campus: { wall: [0xe8e0d0, 0xd8d0c0], roof: [0x9a5a44] },
};

function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }

function makeBuilding(rnd, x, z, h, type, year) {
  const P = PALETTE[type];
  let w, d, ht, roof = 0;
  const S = 1.6; // görünürlük için yatay abartma
  switch (type) {
    case 'old': w = (0.014 + rnd() * 0.012) * S; d = (0.012 + rnd() * 0.01) * S; ht = (0.006 + rnd() * 0.005) * 2; roof = ht * 0.55; break;
    case 'mid': w = (0.018 + rnd() * 0.014) * S; d = (0.016 + rnd() * 0.012) * S; ht = (0.009 + rnd() * 0.007) * 2; roof = ht * 0.4; break;
    case 'apt': {
      w = (0.026 + rnd() * 0.01) * S; d = (0.018 + rnd() * 0.008) * S;
      const fl = year < 1970 ? 3 + rnd() * 2 : year < 1990 ? 4 + rnd() * 4 : 5 + rnd() * 7;
      ht = fl * 0.003 * 2;
      if (rnd() < 0.42) roof = 0.008;
      break;
    }
    case 'tower': w = (0.022 + rnd() * 0.01) * S; d = w; ht = (0.05 + rnd() * 0.06) * 2; break;
    case 'ind': w = (0.06 + rnd() * 0.08) * S; d = (0.04 + rnd() * 0.05) * S; ht = (0.008 + rnd() * 0.006) * 2; roof = ht * 0.25; break;
    case 'campus': w = (0.04 + rnd() * 0.03) * S; d = (0.015 + rnd() * 0.01) * S; ht = 0.012 * 2; roof = 0.004; break;
  }
  return {
    x, z, h, type, year, deathYear: Infinity,
    w, d, ht, roof,
    rotY: (rnd() - 0.5) * 0.5 + 0.24 + (type === 'old' ? (rnd() - 0.5) * 0.6 : 0),
    wall: pick(rnd, P.wall), roofC: P.roof ? pick(rnd, P.roof) : null,
    seed: rnd(),
  };
}
