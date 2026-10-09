import * as THREE from 'three';
import {
  DURATION, yearAt, timeAtYear, formatYear, rulerAt, popAt, EVENTS, CAMERA_KEYS,
} from './timeline.js';
import {
  VEX, terrainHeight, fbm, hash2, smooth, mulberry32, RIVERS, ZONES, HISAR, generateBuildings,
} from './world.js';

const W = 1920, H = 1080;
const stage = document.getElementById('stage');
const QP = new URLSearchParams(location.search);
const renderer = new THREE.WebGLRenderer({ antialias: QP.get('aa') !== '0', alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = QP.get('sh') !== '0';
renderer.shadowMap.type = QP.get('soft') === '1' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
stage.insertBefore(renderer.domElement, stage.firstChild);

const scene = new THREE.Scene();
const FOG = new THREE.Color(0xdfe5e4);
scene.fog = new THREE.Fog(FOG, 10, 100);
const camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 400);

const hemi = new THREE.HemisphereLight(0xdfeaff, 0x5a6a48, 1.1);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
sun.castShadow = true;
sun.shadow.mapSize.set(+(QP.get('sm') || 2048), +(QP.get('sm') || 2048));
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.002;
scene.add(sun, sun.target);
const SUN_DIR = new THREE.Vector3(-0.62, 0.62, -0.48).normalize();

const ty = (x, z) => terrainHeight(x, z) * VEX;
const tt = (y) => timeAtYear(y);

// ------------------------------------------------------------------ ARAZİ
function axisCoords(min, max, center, fine, coarse, r0, r1) {
  const out = [];
  // merkezden iki yöne
  let x = center; const right = [];
  while (x < max) { right.push(x); x += fine + (coarse - fine) * smooth(r0, r1, Math.abs(x - center)) + 0.8 * smooth(24, 45, Math.abs(x - center)); }
  right.push(max);
  x = center; const left = [];
  while (x > min) { x -= fine + (coarse - fine) * smooth(r0, r1, Math.abs(x - center)) + 0.8 * smooth(24, 45, Math.abs(x - center)); left.push(Math.max(x, min)); if (x <= min) break; }
  return left.reverse().concat(right);
}

const XS = axisCoords(-60, 64, 0.4, 0.035, 0.32, 1.6, 14).map((x) => x);
const ZS = axisCoords(-50, 44, -0.2, 0.035, 0.32, 1.2, 12);
const NX = XS.length, NZ = ZS.length;

function zoneYear(x, z) {
  // binalarla aynı bölge mantığı (yaklaşık)
  let y = Infinity, span = 0, dens = 0;
  const wob = 0.18 * fbm(x * 1.7, z * 1.7);
  for (const zn of ZONES) {
    const r = (zn.rot * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    const dx = x - zn.cx, dz = z - zn.cz;
    const lx = dx * c + dz * s, lz = -dx * s + dz * c;
    const e = Math.sqrt((lx / zn.rx) ** 2 + (lz / zn.rz) ** 2);
    const lim = zn.rx > 2 ? 1 + wob * 1.3 : 1 + wob * 0.5;
    if (e < lim && zn.year < y) { y = zn.year; span = zn.span; dens = zn.dens * (zn.type === 'ind' ? 1.1 : 1); }
  }
  return [y, span, dens];
}

// Tarla dokusu (ova bölgesi)
const FX0 = -20, FX1 = 22, FZ0 = -14, FZ1 = 4;
function makeFieldTexture() {
  const PX = 146; // piksel / km
  const cw = Math.round((FX1 - FX0) * PX), chh = Math.round((FZ1 - FZ0) * PX);
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = chh;
  const ctx = cv.getContext('2d');
  const rnd = mulberry32(77);
  const cols = ['#9db26a', '#a9b874', '#c3bd7e', '#88a55c', '#b39f72', '#7f9d58', '#c9c08a', '#a2ad66', '#b8b878', '#94a862'];
  ctx.fillStyle = '#9aae68'; ctx.fillRect(0, 0, cw, chh);
  // bahçe deseni
  const pc = document.createElement('canvas'); pc.width = pc.height = 6;
  const px = pc.getContext('2d'); px.fillStyle = 'rgba(0,0,0,0)'; px.fillRect(0, 0, 8, 8);
  px.fillStyle = '#557f3e'; px.beginPath(); px.arc(3, 3, 1.5, 0, Math.PI * 2); px.fill();
  const orchard = ctx.createPattern(pc, 'repeat');
  const zonesA = [[FX0, 3, 0.35], [3, FX1, -0.18]];
  for (const [x0, x1, ang] of zonesA) {
    ctx.save();
    ctx.beginPath(); ctx.rect((x0 - FX0) * PX, 0, (x1 - x0) * PX, chh); ctx.clip();
    ctx.translate(((x0 + x1) / 2 - FX0) * PX, chh / 2);
    ctx.rotate(ang);
    const R = Math.hypot(x1 - x0, FZ1 - FZ0) * PX * 0.6;
    let v = -R;
    while (v < R) {
      const hv = (0.14 + rnd() * 0.12) * PX;
      let u = -R;
      while (u < R) {
        const hu = (0.22 + rnd() * 0.2) * PX;
        const strips = rnd() < 0.35 ? 2 + Math.floor(rnd() * 3) : 1;
        for (let k = 0; k < strips; k++) {
          ctx.fillStyle = cols[Math.floor(rnd() * cols.length)];
          ctx.fillRect(u + (hu / strips) * k, v, hu / strips + 0.5, hv + 0.5);
        }
        if (rnd() < 0.22) { ctx.fillStyle = orchard; ctx.fillRect(u + 2, v + 2, hu - 4, hv - 4); }
        ctx.strokeStyle = 'rgba(70,95,50,0.55)'; ctx.lineWidth = 1.4; ctx.strokeRect(u, v, hu, hv);
        u += hu;
      }
      // köy yolu
      if (rnd() < 0.12) { ctx.fillStyle = '#c9b993'; ctx.fillRect(-R, v - 1.5, 2 * R, 3); }
      v += hv;
    }
    ctx.restore();
  }
  // nehir kıyısı ağaçları
  ctx.fillStyle = '#4b7436';
  for (const r of RIVERS) {
    const p = resample(r.pts, 0.02);
    for (const [x, z] of p) for (let k = 0; k < 2; k++) {
      const ox = (rnd() - 0.5) * 0.12, oz = (rnd() - 0.5) * 0.12;
      ctx.beginPath(); ctx.arc((x + ox - FX0) * PX, (z + oz - FZ0) * PX, 2 + rnd() * 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.flipY = false; tex.anisotropy = +(QP.get('an') || 1);
  tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

const terrain = (() => {
  const n = NX * NZ;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const fieldA = new Float32Array(n), urbA = new Float32Array(n), urbCol = new Float32Array(n * 3);
  const uy = new Float32Array(n), us = new Float32Array(n), ud = new Float32Array(n);
  const c = new THREE.Color(), c2 = new THREE.Color();
  let i = 0;
  for (let iz = 0; iz < NZ; iz++) for (let ix = 0; ix < NX; ix++, i++) {
    const x = XS[ix], z = ZS[iz];
    const h = terrainHeight(x, z);
    pos[i * 3] = x; pos[i * 3 + 1] = h * VEX; pos[i * 3 + 2] = z;
    const sl = Math.hypot(terrainHeight(x + 0.05, z) - h, terrainHeight(x, z + 0.05) - h) / 0.05;
    c.setHex(0x9aae68);
    c.offsetHSL(0, 0, fbm(x * 0.8, z * 0.8) * 0.04);
    c2.setHex(0x6f8f4c); c.lerp(c2, smooth(0.2, 0.4, h));
    c2.setHex(0x3d6538); c.lerp(c2, smooth(0.38, 0.7, h) * (0.85 + 0.15 * fbm(x * 2, z * 2)));
    c2.setHex(0x2f5532); c.lerp(c2, smooth(0.9, 1.3, h) * 0.6);
    c2.setHex(0x8d8e78); c.lerp(c2, smooth(1.55, 1.9, h + 0.15 * fbm(x, z)));
    c2.setHex(0x9b978a); c.lerp(c2, smooth(0.55, 1.1, sl) * smooth(0.3, 0.6, h));
    c2.setHex(0xf3f5f7); c.lerp(c2, smooth(2.05, 2.25, h + 0.18 * fbm(x * 1.3, z * 1.3)));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    const edge = Math.min(x - FX0, FX1 - x, z - FZ0, FZ1 - z);
    fieldA[i] = smooth(0, 1.5, edge) * (1 - smooth(0.17, 0.3, h));
    const [zy, zs, zd] = zoneYear(x, z);
    uy[i] = zy; us[i] = zs; ud[i] = zd;
    c2.setHex(zy < 1900 ? 0xc2ab88 : 0x9e9a92); c2.offsetHSL(0, 0, (hash2(ix, iz) - 0.5) * 0.03);
    urbCol[i * 3] = c2.r; urbCol[i * 3 + 1] = c2.g; urbCol[i * 3 + 2] = c2.b;
  }
  const idx = [];
  for (let iz = 0; iz < NZ - 1; iz++) for (let ix = 0; ix < NX - 1; ix++) {
    const a = iz * NX + ix, b = a + 1, d = a + NX, e = d + 1;
    if ((ix + iz) % 2) idx.push(a, d, b, b, d, e); else idx.push(a, d, e, a, e, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aField', new THREE.BufferAttribute(fieldA, 1));
  g.setAttribute('aUrb', new THREE.BufferAttribute(urbA, 1));
  g.setAttribute('aUrbCol', new THREE.BufferAttribute(urbCol, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const fieldTex = makeFieldTexture();
  const tm = QP.get('mat') === 'std' ? new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95, metalness: 0 }) : new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  tm.onBeforeCompile = (sh) => {
    sh.uniforms.fieldMap = { value: fieldTex };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aField; attribute float aUrb; attribute vec3 aUrbCol; varying float vField; varying float vUrb; varying vec3 vUrbCol; varying vec2 vFUV;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvField = aField; vUrb = aUrb; vUrbCol = aUrbCol; vFUV = vec2((position.x - (${FX0.toFixed(1)})) / ${(FX1 - FX0).toFixed(1)}, (position.z - (${FZ0.toFixed(1)})) / ${(FZ1 - FZ0).toFixed(1)});`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D fieldMap; varying float vField; varying float vUrb; varying vec3 vUrbCol; varying vec2 vFUV;')
      .replace('#include <color_fragment>', '#include <color_fragment>\nvec3 fc = pow(texture2D(fieldMap, vFUV).rgb, vec3(2.2));\ndiffuseColor.rgb = mix(diffuseColor.rgb, fc, clamp(vField, 0.0, 1.0));\ndiffuseColor.rgb = mix(diffuseColor.rgb, vUrbCol, clamp(vUrb, 0.0, 1.0));');
  };
  const m = new THREE.Mesh(g, tm);
  m.receiveShadow = true;
  scene.add(m);
  let lastYear = null;
  function update(year) {
    if (lastYear !== null && Math.abs(year - lastYear) < 0.25) return;
    lastYear = year;
    for (let k = 0; k < n; k++) {
      urbA[k] = uy[k] < Infinity ? smooth(uy[k], uy[k] + us[k] * 0.7 + 5, year) * Math.min(1, ud[k] * 1.05) : 0;
    }
    g.attributes.aUrb.needsUpdate = true;
  }
  return { update };
})();

// ------------------------------------------------------------------ ŞERİTLER (nehir, yol, ray)
function resample(pts, step) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
    const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / step));
    for (let k = 0; k < n; k++) out.push([ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n]);
  }
  out.push(pts[pts.length - 1]);
  // hafif yumuşatma
  for (let it = 0; it < 3; it++) for (let i = 1; i < out.length - 1; i++) {
    out[i] = [(out[i - 1][0] + out[i][0] * 2 + out[i + 1][0]) / 4, (out[i - 1][1] + out[i][1] * 2 + out[i + 1][1]) / 4];
  }
  return out;
}

function pathLengths(p) {
  const L = [0];
  for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  return L;
}

function pointAt(p, L, s) {
  s = Math.max(0, Math.min(L[L.length - 1], s));
  let i = 1; while (i < L.length - 1 && L[i] < s) i++;
  const f = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
  const x = p[i - 1][0] + (p[i][0] - p[i - 1][0]) * f, z = p[i - 1][1] + (p[i][1] - p[i - 1][1]) * f;
  return [x, z, Math.atan2(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])];
}

function ribbon(pts, width, color, lift, step = 0.04, opts = {}) {
  const p = resample(pts, step);
  const pos = [], idx = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)];
    let dx = b[0] - a[0], dz = b[1] - a[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    const nx = -dz, nz = dx;
    for (const s of [-1, 1]) {
      const x = p[i][0] + nx * s * width / 2, z = p[i][1] + nz * s * width / 2;
      pos.push(x, ty(x, z) + lift, z);
    }
    if (i < p.length - 1) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: opts.rough ?? 0.6, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const m = new THREE.Mesh(g, mat);
  m.receiveShadow = true;
  scene.add(m);
  const total = idx.length;
  return { mesh: m, p, L: pathLengths(p), reveal(f) { g.setDrawRange(0, Math.floor((total / 6) * Math.max(0, Math.min(1, f))) * 6); m.visible = f > 0; } };
}

for (const r of RIVERS) ribbon(r.pts, r.w * 2, 0x4f86a8, 0.003, 0.05, { rough: 0.25 });

// tarihi yollar ve modern ulaşım
const ROADS = [
  { pts: [[3.1, -0.95], [6, -1.2], [10, -1.5], [13, -1.6], [20, -1.8], [36, -2.2]], w: 0.03, c: 0xcdbb98, from: tt(1330), to: tt(1336) }, // Ankara yolu
  { pts: [[-0.6, -0.9], [-1.5, -3], [-4, -7], [-8, -12], [-12, -18], [-15, -28]], w: 0.03, c: 0xcdbb98, from: tt(1340), to: tt(1350) }, // Mudanya yolu
  { pts: [[-2.8, -1.3], [-6, -2.5], [-10, -3.8], [-16, -4.6], [-34, -6]], w: 0.025, c: 0xcdbb98, from: tt(1400), to: tt(1420) },
  { pts: [[-12, -4.6], [-7, -4.9], [-3, -3.9], [0.5, -3.1], [5, -2.6], [12, -2.6], [20, -2.4]], w: 0.06, c: 0x6d6d6d, from: tt(1987), to: tt(1993) }, // çevre yolu
  { pts: [[7, -28], [5, -18], [2, -12], [-4, -8.3], [-12, -8.6], [-20, -7.2], [-34, -5.4]], w: 0.08, c: 0x5e5e5e, from: tt(2016), to: tt(2019) }, // otoyol
];
const roadObjs = ROADS.map((r) => ({ ...r, rb: ribbon(r.pts, r.w * 2, r.c, 0.004, 0.08) }));

const RAIL_MUDANYA = { pts: [[-0.7, -1.8], [-2.5, -4.5], [-6, -8.5], [-10, -13], [-13, -19], [-15, -28]], from: tt(1890), to: tt(1892), end: tt(1953) };
const railRb = ribbon(RAIL_MUDANYA.pts, 0.01, 0x6a5e54, 0.005, 0.06);
const BURSARAY = [
  { pts: [[-9.5, -4.6], [-6, -3.3], [-3, -2.2], [-0.6, -1.25], [0.9, -0.7], [3, -0.75], [4.6, -0.95]], from: tt(2001), to: tt(2002) },
  { pts: [[-9.5, -4.6], [-12.5, -5.0], [-15.6, -4.8]], from: tt(2010), to: tt(2011) },
  { pts: [[4.6, -0.95], [8.5, -1.25], [13.0, -1.55]], from: tt(2013), to: tt(2014) },
];
const brObjs = BURSARAY.map((b) => ({ ...b, rb: ribbon(b.pts, 0.05, 0x2e6fb0, 0.012, 0.06) }));

// ------------------------------------------------------------------ BİNALAR
const buildings = generateBuildings();
for (const b of buildings) {
  b.tb = tt(b.year);
  b.td = b.deathYear === Infinity ? Infinity : tt(b.deathYear);
  b.tc = Infinity; b.mode = b.deathYear === Infinity ? null : 'replace';
}

// Yıkımlar: yangınlar ve depremler
const DESTRUCTIONS = [
  { t: 132.2, kind: 'fire', x: 0.8, z: 0.05, r: 1.4, p: 0.7, rb: [138, 145] },     // 1402 Timur
  { t: 142.6, kind: 'fire', x: 1.0, z: -0.1, r: 1.8, p: 0.45, rb: [147, 153] },    // 1413 Karamanoğlu
  { t: 181.0, kind: 'fire', x: 0.62, z: 0.2, r: 0.5, p: 0.9, rb: [186.2, 188.2] }, // 1801 yangını
  { t: 188.7, kind: 'quake', x: 0.4, z: 0.0, r: 6.0, p: 0.5, rb: [196, 205] },     // 1855 depremi
  { t: 236.1, kind: 'fire', x: 0.62, z: 0.25, r: 0.22, p: 0.95, rb: [238.5, 241] }, // 1958 Kapalıçarşı
];
const fireSpots = [], dustSpots = [];
{
  const rnd = mulberry32(1855);
  for (const ev of DESTRUCTIONS) {
    const born = [];
    let spots = 0;
    for (const b of buildings) {
      if (!(b.tb <= ev.t && ev.t < b.td) || b.type === 'ind' || b.type === 'apt' || b.type === 'tower') continue;
      const d = Math.hypot(b.x - ev.x, b.z - ev.z);
      const fall = 1 - smooth(ev.r * 0.6, ev.r, d);
      if (rnd() > ev.p * fall) continue;
      const nb = { ...b, seed: rnd() };
      const oldTd = b.td, oldMode = b.mode;
      if (ev.kind === 'fire') {
        b.tc = ev.t + (d / ev.r) * 2.2 + rnd() * 0.6;
        b.td = b.tc + 1.4 + rnd() * 0.5; b.mode = 'fire';
        if (rnd() < (ev.r < 0.6 ? 0.35 : 0.08) && spots < 70) { fireSpots.push({ x: b.x, z: b.z, t0: b.tc, t1: b.td + 0.8 }); spots++; }
      } else {
        b.td = ev.t + rnd() * 0.8; b.mode = 'quake';
        if (rnd() < 0.1 && spots < 90) { dustSpots.push({ x: b.x, z: b.z, t0: b.td, t1: b.td + 2.2 }); spots++; }
      }
      nb.tb = ev.rb[0] + rnd() * (ev.rb[1] - ev.rb[0]);
      nb.td = oldTd; nb.mode = oldMode; nb.tc = Infinity;
      if (nb.tb < nb.td) born.push(nb);
    }
    buildings.push(...born);
  }
}

const bodyGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const roofGeo = new THREE.ConeGeometry(0.7071, 1, 4, 1).rotateY(Math.PI / 4).translate(0, 0.5, 0);
const bMat = QP.get('mat') === 'std' ? new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, flatShading: true }) : new THREE.MeshLambertMaterial({ flatShading: true });
const bodies = new THREE.InstancedMesh(bodyGeo, bMat, buildings.length);
const roofed = buildings.filter((b) => b.roof > 0);
const roofs = new THREE.InstancedMesh(roofGeo, bMat, roofed.length);
for (const m of [bodies, roofs]) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; scene.add(m); }
bodies.setColorAt(0, new THREE.Color()); roofs.setColorAt(0, new THREE.Color());
const CHAR = new THREE.Color(0x2b2420), EMBER = new THREE.Color(0xd2542a);
const tmpC = new THREE.Color(), tmpC2 = new THREE.Color();

const frustum = new THREE.Frustum(), projM = new THREE.Matrix4(), sph = new THREE.Sphere();
function updateBuildings(t, dist) {
  const bm = bodies.instanceMatrix.array, rm = roofs.instanceMatrix.array;
  const bc = bodies.instanceColor.array, rc = roofs.instanceColor.array;
  projM.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(projM);
  const margin = 0.04 + dist * 0.04;
  let ri = 0, bi = 0;
  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    if (t < b.tb || t > b.td + 0.6) continue;
    sph.center.set(b.x, b.h * VEX, b.z); sph.radius = margin + b.ht;
    if (!frustum.intersectsSphere(sph)) continue;
    let sy = 0, sxz = 1;
    if (t >= b.tb) {
      const g = smooth(b.tb, b.tb + 0.7, t);
      sy = g; sxz = 0.6 + 0.4 * g;
      if (t >= b.td) {
        const k = b.mode === 'quake' ? 0.3 : 0.5;
        const dd = 1 - smooth(b.td, b.td + k, t);
        sy *= b.mode === 'quake' ? Math.max(dd, 0) : dd;
        if (b.mode === 'replace') sxz *= 0.5 + 0.5 * dd;
      }
    }
    const visible = sy > 0.001;
    if (!visible) continue;
    const s = Math.sin(b.rotY), c = Math.cos(b.rotY);
    const sx = visible ? b.w * sxz : 0, sz = visible ? b.d * sxz : 0, h = visible ? b.ht * sy : 0;
    const y = b.h * VEX - 0.004;
    let o = bi * 16;
    bm[o] = c * sx; bm[o + 1] = 0; bm[o + 2] = -s * sx; bm[o + 3] = 0;
    bm[o + 4] = 0; bm[o + 5] = visible ? h + 0.004 : 0; bm[o + 6] = 0; bm[o + 7] = 0;
    bm[o + 8] = s * sz; bm[o + 9] = 0; bm[o + 10] = c * sz; bm[o + 11] = 0;
    bm[o + 12] = b.x; bm[o + 13] = y; bm[o + 14] = b.z; bm[o + 15] = 1;
    // renk
    tmpC.setHex(b.wall);
    let burn = 0;
    if (t >= b.tc) {
      burn = smooth(b.tc, b.tc + 1.0, t);
      tmpC2.copy(EMBER).lerp(CHAR, smooth(b.tc + 0.3, b.tc + 1.2, t));
      tmpC.lerp(tmpC2, burn);
    }
    bc[bi * 3] = tmpC.r; bc[bi * 3 + 1] = tmpC.g; bc[bi * 3 + 2] = tmpC.b;
    bi++;
    if (b.roof > 0) {
      const rh = visible ? b.roof * sy : 0;
      o = ri * 16;
      rm[o] = c * sx * 1.12; rm[o + 1] = 0; rm[o + 2] = -s * sx * 1.12; rm[o + 3] = 0;
      rm[o + 4] = 0; rm[o + 5] = rh; rm[o + 6] = 0; rm[o + 7] = 0;
      rm[o + 8] = s * sz * 1.12; rm[o + 9] = 0; rm[o + 10] = c * sz * 1.12; rm[o + 11] = 0;
      rm[o + 12] = b.x; rm[o + 13] = y + h + 0.004; rm[o + 14] = b.z; rm[o + 15] = 1;
      tmpC.setHex(b.roofC);
      if (burn > 0) tmpC.lerp(tmpC2, burn);
      rc[ri * 3] = tmpC.r; rc[ri * 3 + 1] = tmpC.g; rc[ri * 3 + 2] = tmpC.b;
      ri++;
    }
  }
  bodies.count = bi; roofs.count = ri;
  bodies.instanceMatrix.needsUpdate = true; roofs.instanceMatrix.needsUpdate = true;
  bodies.instanceColor.needsUpdate = true; roofs.instanceColor.needsUpdate = true;
}

// ------------------------------------------------------------------ ANITLAR
const LS = 2.6; // anıt abartma katsayısı
const M = {};
const mat = (c, o = {}) => (M[c + JSON.stringify(o)] ||= new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0, flatShading: true, ...o }));
const STONE = 0xeee6d6, LEAD = 0x8c959e, BRICK = 0xb77a55, TILE = 0xa9563b, GREEN = 0x2f8f74;

function box(g, w, h, d, c, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(bodyGeo, mat(c)); m.scale.set(w, h, d); m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true; g.add(m); return m;
}
const sphGeo = new THREE.SphereGeometry(1, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2);
function dome(g, r, c, x, y, z) {
  const m = new THREE.Mesh(sphGeo, mat(c)); m.scale.set(r, r * 0.95, r); m.position.set(x, y, z);
  m.castShadow = true; g.add(m); return m;
}
const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 10).translate(0, 0.5, 0);
const octGeo = new THREE.CylinderGeometry(1, 1, 1, 8).translate(0, 0.5, 0);
const coneGeo = new THREE.ConeGeometry(1, 1, 10).translate(0, 0.5, 0);
function minaret(g, x, z, h, c = STONE, cap = LEAD) {
  const grp = new THREE.Group(); grp.position.set(x, 0, z);
  const r = 0.0045 * LS;
  const s = new THREE.Mesh(cylGeo, mat(c)); s.scale.set(r, h, r); s.castShadow = true; grp.add(s);
  const bal = new THREE.Mesh(cylGeo, mat(c)); bal.scale.set(r * 1.6, h * 0.025, r * 1.6); bal.position.y = h * 0.78; grp.add(bal);
  const k = new THREE.Mesh(coneGeo, mat(cap)); k.scale.set(r * 1.05, h * 0.2, r * 1.05); k.position.y = h; k.castShadow = true; grp.add(k);
  g.add(grp); return grp;
}

function mosque({ w, d, h, domeR, mins = [], minH = 0.07, wall = STONE, domeC = LEAD, cap = LEAD, extraDomes = [] }) {
  const g = new THREE.Group();
  w *= LS; d *= LS; h *= LS; domeR *= LS; minH *= LS;
  box(g, w, h, d, wall);
  const drum = new THREE.Mesh(octGeo, mat(wall)); drum.scale.set(domeR * 1.02, h * 0.18, domeR * 1.02); drum.position.y = h; drum.castShadow = true; g.add(drum);
  g.userData.domes = [dome(g, domeR, domeC, 0, h * 1.18, 0)];
  for (const [dx, dz, rr] of extraDomes) g.userData.domes.push(dome(g, rr * LS, domeC, dx * LS, h, dz * LS));
  // son cemaat yeri
  box(g, w * 0.9, h * 0.6, d * 0.28, wall, 0, 0, -d * 0.62);
  for (let k = -1; k <= 1; k++) g.userData.domes.push(dome(g, w * 0.13, domeC, k * w * 0.3, h * 0.6, -d * 0.62));
  g.userData.mins = mins.map(([dx, dz]) => minaret(g, dx * LS, dz * LS, minH, wall, cap));
  return g;
}

function uluCami() {
  const g = new THREE.Group();
  const w = 0.069 * LS, d = 0.056 * LS, h = 0.016 * LS;
  box(g, w, h, d, STONE);
  g.userData.domes = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
    const x = -w / 2 + (i + 0.5) * (w / 5), z = -d / 2 + (j + 0.5) * (d / 4);
    const dr = new THREE.Mesh(octGeo, mat(STONE)); dr.scale.set(w / 11, h * 0.25, w / 11); dr.position.set(x, h, z); g.add(dr);
    g.userData.domes.push(dome(g, w / 11.5, LEAD, x, h * 1.25, z), dr);
  }
  g.userData.mins = [minaret(g, -w / 2 - 0.004, -d / 2 - 0.004, 0.08 * LS), minaret(g, w / 2 + 0.004, -d / 2 - 0.004, 0.08 * LS)];
  return g;
}

function han(w, d, h, c = 0xd9b48c, domesN = 0) {
  const g = new THREE.Group();
  w *= LS; d *= LS; h *= LS; const t = w * 0.2;
  box(g, w, h, t, c, 0, 0, -d / 2 + t / 2); box(g, w, h, t, c, 0, 0, d / 2 - t / 2);
  box(g, t, h, d, c, -w / 2 + t / 2); box(g, t, h, d, c, w / 2 - t / 2);
  box(g, w * 0.98, h * 0.12, t * 1.1, TILE, 0, h, -d / 2 + t / 2); box(g, w * 0.98, h * 0.12, t * 1.1, TILE, 0, h, d / 2 - t / 2);
  box(g, t * 1.1, h * 0.12, d, TILE, -w / 2 + t / 2, h); box(g, t * 1.1, h * 0.12, d, TILE, w / 2 - t / 2, h);
  const m = box(g, t * 0.8, h * 0.8, t * 0.8, STONE); dome(g, t * 0.45, LEAD, 0, h * 0.8, 0);
  g.userData.domes = [m];
  return g;
}

function bedesten() {
  const g = new THREE.Group();
  const w = 0.064 * LS, d = 0.034 * LS, h = 0.012 * LS;
  box(g, w, h, d, 0xd8c7aa);
  g.userData.domes = [];
  for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) g.userData.domes.push(dome(g, w / 16, LEAD, -w / 2 + (i + 0.5) * w / 7, h, -d / 2 + (j + 0.5) * d / 2));
  return g;
}

function church(w = 0.03, d = 0.05) {
  const g = new THREE.Group();
  w *= LS; d *= LS; const h = 0.014 * LS;
  box(g, w, h, d, BRICK);
  box(g, w * 0.55, h * 0.6, w * 0.4, BRICK, 0, 0, d / 2 + w * 0.15);
  const dr = new THREE.Mesh(cylGeo, mat(BRICK)); dr.scale.set(w * 0.3, h * 0.35, w * 0.3); dr.position.y = h; g.add(dr);
  g.userData.domes = [dome(g, w * 0.32, TILE, 0, h * 1.35, 0)];
  return g;
}

function turbe(r = 0.01, c = STONE, domeC = LEAD, h = 0.014) {
  const g = new THREE.Group();
  r *= LS; h *= LS;
  const b = new THREE.Mesh(octGeo, mat(c)); b.scale.set(r, h, r); b.castShadow = true; g.add(b);
  g.userData.domes = [dome(g, r * 0.95, domeC, 0, h, 0), b];
  return g;
}

function romanBath() {
  const g = new THREE.Group();
  const w = 0.05 * LS, d = 0.03 * LS, h = 0.01 * LS;
  box(g, w, h, d, 0xd8c3a0);
  const vault = new THREE.CylinderGeometry(1, 1, 1, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2);
  for (let k = -1; k <= 1; k++) { const v = new THREE.Mesh(vault, mat(TILE)); v.scale.set(d * 0.5, w * 0.28, d * 0.15); v.position.set(k * w * 0.33, h, 0); v.rotation.y = Math.PI / 2; v.castShadow = true; g.add(v); }
  return g;
}

function clockTower() {
  const g = new THREE.Group();
  const s = 0.008 * LS, h = 0.033 * LS * 1.4;
  box(g, s, h, s, 0xe6dccb);
  box(g, s * 1.3, h * 0.08, s * 1.3, 0xcfc3ad, 0, h * 0.8);
  const k = new THREE.Mesh(new THREE.ConeGeometry(s * 0.8, h * 0.25, 4).rotateY(Math.PI / 4).translate(0, h * 0.125, 0), mat(LEAD)); k.position.y = h; g.add(k);
  return g;
}

function factory(w, d, teeth, chimneyH, c = 0xb6744f) {
  const g = new THREE.Group();
  w *= LS; d *= LS;
  const h = 0.01 * LS;
  box(g, w, h, d, c);
  const prism = new THREE.CylinderGeometry(0.7071, 0.7071, 1, 3).rotateX(Math.PI / 2);
  for (let i = 0; i < teeth; i++) {
    const p = new THREE.Mesh(prism, mat(0xcfd6da)); p.scale.set((w / teeth) * 0.7, h * 0.6, d * 0.98);
    p.position.set(-w / 2 + (i + 0.5) * (w / teeth), h + h * 0.12, 0); p.castShadow = true; g.add(p);
  }
  if (chimneyH) { const ch = new THREE.Mesh(cylGeo, mat(0x9a5a3c)); ch.scale.set(0.004 * LS, chimneyH * LS, 0.004 * LS); ch.position.set(w * 0.42, 0, d * 0.4); ch.castShadow = true; g.add(ch); g.userData.chimney = [w * 0.42, chimneyH * LS, d * 0.4]; }
  return g;
}

function stadium() {
  const g = new THREE.Group();
  const r = 0.05 * LS;
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.92, 0.012 * LS, 24, 1, true), mat(0x7fbf3f, { side: THREE.DoubleSide }));
  ring.scale.z = 0.75; ring.position.y = 0.006 * LS; g.add(ring);
  const f = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.7, r * 0.7, 0.002, 24), mat(0x4f9a3a)); f.scale.z = 0.7; g.add(f);
  return g;
}

function station() {
  const g = new THREE.Group();
  box(g, 0.035 * LS, 0.009 * LS, 0.012 * LS, 0xd9b38c);
  box(g, 0.037 * LS, 0.003 * LS, 0.014 * LS, TILE, 0, 0.009 * LS, 0);
  return g;
}

function tent(c) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.014, 6).translate(0, 0.007, 0), mat(c)); m.castShadow = true; g.add(m);
  return g;
}

function tower(h = 0.03) {
  const g = new THREE.Group();
  box(g, 0.012 * LS, h * LS, 0.012 * LS, 0xc9b08a);
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(g, 0.003 * LS, 0.004 * LS, 0.003 * LS, 0xc9b08a, dx * 0.0045 * LS, h * LS, dz * 0.0045 * LS);
  return g;
}

// Landmark kaydı: grow (t0..t1), opsiyonel yok olma (hide), yeniden yapım
const landmarks = [];
function L(obj, x, z, t0, t1, o = {}) {
  obj.position.set(x, ty(x, z) - 0.003, z);
  obj.rotation.y = o.rot ?? 0.24;
  scene.add(obj);
  const lm = { obj, x, z, t0, t1, hide: o.hide ?? Infinity, fade: o.fade ?? 0.6, quake: o.quake, name: o.name };
  landmarks.push(lm);
  return lm;
}

// Bizans dönemi
const churchA = L(church(0.024, 0.04), 0.13, 0.09, 42.5, 44.5, { hide: 92.5 });
const churchB = L(church(0.03, 0.05), -0.08, 0.0, 44, 46, { hide: 150 });
const bath = L(romanBath(), -2.62, -1.22, 31.5, 33.5);
// Osmanlı kuşatma kuleleri
const towerE = L(tower(0.032), 1.3, -0.15, 72.5, 74.5, { hide: 100 });
const towerW = L(tower(0.032), -1.05, -0.15, 73, 75, { hide: 100 });
// Osmanlı
const osmanT = L(turbe(0.011), 0.13, 0.09, 93, 94.5, { quake: [188.9, 199.5] });
const orhanT = L(turbe(0.012), 0.2, 0.15, 104, 105.5, { quake: [189.1, 199.8] });
const orhanC = L(mosque({ w: 0.028, d: 0.028, h: 0.012, domeR: 0.011, mins: [[-0.018, -0.016]], minH: 0.055, extraDomes: [[0.0, 0.009, 0.008]] }), 0.79, 0.22, 104.5, 106.5);
const hudavendigar = L(mosque({ w: 0.036, d: 0.028, h: 0.016, domeR: 0.01, mins: [[-0.022, -0.016]], minH: 0.06 }), -2.81, -1.39, 114, 116.5, { quake: [188.8, 199] });
const ulu = L(uluCami(), 0.47, 0.15, 122, 126, { quake: [188.8, 200.5] });
const bedes = L(bedesten(), 0.6, 0.33, 124, 126);
const yildirim = L(mosque({ w: 0.03, d: 0.03, h: 0.014, domeR: 0.011, mins: [[-0.02, -0.018]], minH: 0.06, extraDomes: [[0, 0.012, 0.009]] }), 3.1, -1.05, 122.5, 125);
const yesil = L(mosque({ w: 0.03, d: 0.03, h: 0.016, domeR: 0.012, mins: [[-0.02, -0.018], [0.02, -0.018]], minH: 0.06, cap: GREEN, extraDomes: [[0, 0.012, 0.01]] }), 1.55, 0.41, 150, 152.5, { quake: [189.0, 200] });
const yesilT = L(turbe(0.012, 0x2b8f86, 0x2b8f86, 0.018), 1.52, 0.5, 151, 153);
const emir = L(mosque({ w: 0.03, d: 0.026, h: 0.014, domeR: 0.011, mins: [[-0.02, -0.016], [0.02, -0.016]], minH: 0.055 }), 2.49, 0.0, 152, 154, { quake: [188.9, 202] });
const muradiye = L(mosque({ w: 0.028, d: 0.026, h: 0.013, domeR: 0.011, mins: [[-0.018, -0.016]], minH: 0.055 }), -0.81, -0.58, 154, 156);
const muradiyeT = [[-0.77, -0.53], [-0.85, -0.52], [-0.78, -0.63], [-0.87, -0.63]].map(([x, z], i) => L(turbe(0.007), x, z, 155 + i * 0.4, 156 + i * 0.4));
const koza = L(han(0.05, 0.05, 0.012), 0.66, 0.2, 163, 165, { rot: 0.3 });
const hukumet = L((() => { const g = new THREE.Group(); box(g, 0.05 * LS, 0.014 * LS, 0.022 * LS, 0xe9e0cf); box(g, 0.052 * LS, 0.003 * LS, 0.024 * LS, TILE, 0, 0.014 * LS); return g; })(), 0.97, 0.06, 199, 201);
const saat = L(clockTower(), 0.0, -0.17, 205.5, 207);
const rStation = L(station(), -0.7, -1.8, 202.5, 203.5, { hide: 234.5 });
const merinos = L(factory(0.12, 0.08, 6, 0.05), -0.94, -1.61, 229.5, 231.5);
const telefLow = L(station(), 2.7, 0.6, 239.5, 240.5);
const telefTop = L(station(), 6.3, 9.5, 239.5, 240.5);
const arena = L(stadium(), -4.2, -4.6, 280.5, 282);

// Hisar surları
const wall = (() => {
  const g = new THREE.Group(); scene.add(g);
  const N = 30, segs = [];
  const pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = 1 + 0.06 * Math.sin(a * 3 + 1) + 0.04 * Math.cos(a * 5);
    pts.push([HISAR.x + Math.cos(a) * HISAR.rx * r, HISAR.z + Math.sin(a) * HISAR.rz * r]);
  }
  const wallH = 0.012 * LS, thick = 0.006 * LS;
  for (let i = 0; i < N; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % N];
    const len = Math.hypot(bx - ax, bz - az);
    const mx = (ax + bx) / 2, mz = (az + bz) / 2;
    const s = new THREE.Mesh(bodyGeo, mat(0xc9b08a)); s.castShadow = s.receiveShadow = true;
    s.position.set(mx, Math.min(ty(ax, az), ty(bx, bz)) - 0.004, mz);
    s.rotation.y = Math.atan2(bx - ax, bz - az);
    s.userData = { len, thick, h: wallH };
    g.add(s);
    const tw = new THREE.Mesh(bodyGeo, mat(0xbfa47d)); tw.castShadow = true;
    tw.position.set(ax, ty(ax, az) - 0.004, az);
    tw.userData = { tower: true };
    g.add(tw);
    segs.push({ s, tw, i });
  }
  function update(t) {
    for (const { s, tw, i } of segs) {
      const t0 = 9.5 + (i / N) * 6;
      const k = smooth(t0, t0 + 1.2, t);
      s.visible = tw.visible = k > 0.001;
      s.scale.set(thick, wallH * k + 0.0001, s.userData.len * 1.02);
      tw.scale.set(0.011 * LS, wallH * 1.5 * k + 0.0001, 0.011 * LS);
    }
  }
  return { update, pts };
})();

const ringGeo = new THREE.RingGeometry(0.8, 1.0, 48).rotateX(-Math.PI / 2);
for (const lm of landmarks) {
  const r = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  r.position.set(lm.x, ty(lm.x, lm.z) + 0.004, lm.z); r.renderOrder = 2; scene.add(r); lm.ring = r;
}
function updateLandmarks(t) {
  for (const lm of landmarks) {
    {
      const k = (t - lm.t0) / 3.2;
      const on = k > 0 && k < 1 && lm.t0 > 20;
      lm.ring.visible = on;
      if (on) { const rr = 0.05 + 0.1 * k; lm.ring.scale.set(rr, 1, rr); lm.ring.material.opacity = 0.9 * Math.sin(Math.PI * k); }
    }
    const g = smooth(lm.t0, lm.t1, t);
    const hidden = t >= lm.hide + lm.fade;
    lm.obj.visible = g > 0.001 && !hidden;
    let sy = g;
    if (t >= lm.hide) sy *= 1 - smooth(lm.hide, lm.hide + lm.fade, t);
    lm.obj.scale.set(1, Math.max(sy, 0.0001), 1);
    if (lm.quake) {
      const [qa, qb] = lm.quake;
      const broken = t >= qa && t < qb;
      const f = broken ? smooth(qa, qa + 0.4, t) : 0;
      for (const d of lm.obj.userData.domes || []) d.visible = !broken || f < 0.5;
      (lm.obj.userData.mins || []).forEach((m, i) => {
        m.rotation.z = broken ? (i % 2 ? 1 : -1) * 1.45 * smooth(qa + 0.1 * i, qa + 0.6 + 0.1 * i, t) : 0;
        m.visible = !(broken && t > qa + 1.5);
      });
    }
  }
}

// ------------------------------------------------------------------ BAYRAK / ARMA
function drawEmblem(ctx, type, w, h) {
  ctx.clearRect(0, 0, w, h);
  const star = (cx, cy, r, n = 5, rot = -Math.PI / 2) => {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? r * 0.4 : r; const a = rot + (i * Math.PI) / n; ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  };
  const crescent = (cx, cy, r, col, bg, off = 0.25, r2 = 0.8) => {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx + r * off, cy, r * r2, 0, Math.PI * 2); ctx.fill();
  };
  switch (type) {
    case 'bithynia':
      ctx.fillStyle = '#2b3f7a'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#e9c35c'; star(w / 2, h / 2, h * 0.32, 8, 0);
      ctx.strokeStyle = '#e9c35c'; ctx.lineWidth = h * 0.04; ctx.strokeRect(h * 0.06, h * 0.06, w - h * 0.12, h - h * 0.12);
      break;
    case 'rome':
      ctx.fillStyle = '#8e1b1b'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#e9c35c'; ctx.font = `700 ${h * 0.38}px Playfair`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('SPQR', w / 2, h / 2 + h * 0.02);
      ctx.strokeStyle = '#e9c35c'; ctx.lineWidth = h * 0.04; ctx.strokeRect(h * 0.06, h * 0.06, w - h * 0.12, h - h * 0.12);
      break;
    case 'byzantium': {
      ctx.fillStyle = '#a8231d'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#efc54e'; const t = h * 0.12;
      ctx.fillRect(w / 2 - t / 2, 0, t, h); ctx.fillRect(0, h / 2 - t / 2, w, t);
      ctx.font = `700 ${h * 0.34}px Playfair`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const [px, py, flip] of [[0.25, 0.25, 1], [0.75, 0.25, -1], [0.25, 0.75, 1], [0.75, 0.75, -1]]) {
        ctx.save(); ctx.translate(w * px, h * py + h * 0.02); ctx.scale(flip, 1); ctx.fillText('B', 0, 0); ctx.restore();
      }
      break;
    }
    case 'ottoman_early':
      ctx.fillStyle = '#b3201c'; ctx.fillRect(0, 0, w, h);
      crescent(w * 0.48, h / 2, h * 0.3, '#f4efe2', '#b3201c', 0.3, 0.78);
      break;
    case 'ottoman':
    case 'tbmm':
    case 'turkey':
      ctx.fillStyle = '#e30a17'; ctx.fillRect(0, 0, w, h);
      crescent(w * 0.375, h / 2, h * 0.25, '#fff', '#e30a17', 0.25, 0.8);
      ctx.fillStyle = '#fff'; star(w * 0.375 + h * 0.31, h / 2, h * 0.125, 5, Math.PI);
      break;
    case 'occupation': {
      const s = h / 9;
      for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? '#fff' : '#0d5eaf'; ctx.fillRect(0, i * s, w, s + 0.5); }
      ctx.fillStyle = '#0d5eaf'; ctx.fillRect(0, 0, s * 5, s * 5);
      ctx.fillStyle = '#fff'; ctx.fillRect(s * 2, 0, s, s * 5); ctx.fillRect(0, s * 2, s * 5, s);
      break;
    }
  }
}

const emblemCache = {};
function emblemCanvas(type) {
  if (emblemCache[type]) return emblemCache[type];
  const c = document.createElement('canvas'); c.width = 192; c.height = 128;
  drawEmblem(c.getContext('2d'), type, 192, 128);
  return (emblemCache[type] = c);
}

// Hisar bayrağı
const flag = (() => {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(cylGeo, mat(0x5b4a3a)); pole.scale.set(0.0012 * 1.8, 0.05 * 1.8, 0.0012 * 1.8); g.add(pole);
  const tex = new THREE.CanvasTexture(emblemCanvas('bithynia')); tex.colorSpace = THREE.SRGBColorSpace;
  const geo = new THREE.PlaneGeometry(0.03 * 1.8, 0.02 * 1.8, 12, 1).translate(0.015 * 1.8, 0, 0);
  const cloth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.9 }));
  cloth.position.y = 0.04 * 1.8; g.add(cloth);
  const x = 0.02, z = -0.06; g.position.set(x, ty(x, z), z); scene.add(g);
  const base = geo.attributes.position.array.slice();
  let cur = 'bithynia';
  return {
    update(t, type) {
      g.visible = t > 12;
      if (type !== cur) { cur = type; drawEmblem(tex.image.getContext('2d'), type, 192, 128); tex.needsUpdate = true; }
      const p = geo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) { const u = base[i] / (0.03 * 1.8); p[i + 2] = Math.sin(base[i] * 260 - t * 6) * 0.004 * u; }
      geo.attributes.position.needsUpdate = true;
      g.rotation.y = 2.4;
    },
  };
})();

// ------------------------------------------------------------------ BİRLİKLER (ordu, kervan)
const unitGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const TROOPS = [];
function troop(color, n, cols, sp, keys, o = {}) { TROOPS.push({ color: new THREE.Color(color), n, cols, sp, keys, size: o.size ?? 0.012, h: o.h ?? 0.012, label: o.label, wob: o.wob ?? 1 }); }
// 1302-1317 Osmanlı akıncıları
troop(0xc0392b, 30, 6, 0.04, [[62.5, 12, -6], [68, 3, -2.5], [71, 1.6, -1.2], [72.5, 1.4, -1.0]], { label: 'Osmanlı akıncıları' });
// Kuşatma halkası
const SIEGE = [];
for (let k = 0; k < 6; k++) {
  const a = -Math.PI * 0.95 + (k / 5) * Math.PI * 0.9; // kuzey yarım
  const x = HISAR.x + Math.cos(a) * 0.85, z = HISAR.z + Math.sin(a) * 0.65;
  SIEGE.push([x, z]);
  troop(0xc0392b, 12, 4, 0.035, [[72, x * 3, z * 3 - 1], [75, x, z], [84, x, z], [87.5, HISAR.x + (x - HISAR.x) * 0.6, HISAR.z + (z - HISAR.z) * 0.6]]);
}
for (let k = 0; k < 3; k++) {
  const a = Math.PI * 0.15 + (k / 2) * Math.PI * 0.7; // güney (yamaç) tarafı
  const x = HISAR.x + Math.cos(a) * 0.75, z = HISAR.z + Math.sin(a) * 0.6;
  SIEGE.push([x, z]);
  troop(0xc0392b, 10, 4, 0.035, [[72, x * 2, z * 2 + 1], [75, x, z], [84, x, z], [87.5, HISAR.x + (x - HISAR.x) * 0.6, HISAR.z + (z - HISAR.z) * 0.6]]);
}
// Bizans muhafızları
for (let k = 0; k < 8; k++) {
  const [x, z] = wall.pts[(k * 4) % wall.pts.length];
  troop(0x6c3483, 4, 2, 0.02, [[72, x, z], [84, x, z], [85.5, x, z]], { size: 0.01 });
}
// 1402 Timur süvarileri
troop(0x2c3e50, 50, 8, 0.045, [[127.5, 16, -2], [130.5, 4, -0.8], [132.5, 1.0, 0.0], [135.5, 1.4, -0.3], [139, 9, -1.5], [141, 16, -2]], { label: 'Timur ordusu' });
// 1413 Karamanoğlu
troop(0x7d5a2b, 40, 8, 0.045, [[138.5, 14, -1.2], [141.5, 2.6, -0.4], [146, 2.4, -0.3], [149, 12, -1.2]], { label: 'Karamanoğlu ordusu' });
// İpek kervanları
troop(0x8a6a44, 14, 1, 0.05, [[158, 16, -1.8], [164, 6, -1.2], [167.5, 2.2, -0.5], [169.5, 0.66, 0.2]], { size: 0.01, label: 'İpek kervanı' });
troop(0x8a6a44, 12, 1, 0.05, [[162, 16, -1.8], [168, 6, -1.2], [171, 2.2, -0.5], [173, 0.66, 0.2]], { size: 0.01 });
// 1920 Yunan ordusu
troop(0x1f5fae, 60, 10, 0.05, [[209, -10, -12], [211.5, -2, -2.6], [213, 0.3, -0.5], [217, 0.3, -0.5], [219, -6, -6], [221, -14, -14]], { label: 'Yunan ordusu' });
// 1922 Türk süvarileri
troop(0xc0392b, 60, 10, 0.05, [[216.5, 14, -1.8], [219, 3, -0.8], [220.5, 0.6, -0.3], [223, 0.6, -0.3], [224, 0.6, -0.3]], { label: 'Türk süvarileri' });

const troopCount = TROOPS.reduce((s, t) => s + t.n, 0);
const troopMesh = new THREE.InstancedMesh(unitGeo, new THREE.MeshStandardMaterial({ roughness: 0.7, flatShading: true }), troopCount);
troopMesh.castShadow = true; troopMesh.frustumCulled = false; scene.add(troopMesh);
troopMesh.setColorAt(0, new THREE.Color());
const tents = [];
function addTents(cx, cz, n, r, c, t0, t1, seed) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, rr = r * Math.sqrt(rnd());
    const x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr * 0.7;
    const o = tent(rnd() < 0.2 ? 0xc0392b : c); o.position.set(x, ty(x, z), z); o.scale.setScalar(LS); scene.add(o);
    tents.push({ o, t0: t0 + rnd() * 1.5, t1 });
  }
}
for (const [x, z] of SIEGE) addTents(x, z, 6, 0.12, 0xf2ead8, 73, 88, Math.floor(x * 1000 + z * 77) + 5);
addTents(2.6, -0.5, 18, 0.35, 0xe8dcc0, 141.5, 147, 1413);
addTents(1.6, -0.5, 14, 0.3, 0xd8d0c0, 130.5, 136, 1402);

function trackPos(keys, t) {
  if (t < keys[0][0] || t > keys[keys.length - 1][0]) return null;
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const [t0, x0, z0] = keys[i - 1], [t1, x1, z1] = keys[i];
    const f = (t - t0) / (t1 - t0 || 1); const e = f * f * (3 - 2 * f);
    return [x0 + (x1 - x0) * e, z0 + (z1 - z0) * e, Math.atan2(x1 - x0, z1 - z0), Math.hypot(x1 - x0, z1 - z0) > 0.01];
  }
  return null;
}

function updateTroops(t) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let k = 0;
  for (const tr of TROOPS) {
    const pos = trackPos(tr.keys, t);
    const first = tr.keys[0][0], last = tr.keys[tr.keys.length - 1][0];
    const env = smooth(first, first + 0.6, t) * (1 - smooth(last - 0.6, last, t));
    tr.cur = pos && env > 0.01 ? pos : null;
    for (let i = 0; i < tr.n; i++, k++) {
      if (!tr.cur) { m.makeScale(0, 0, 0); troopMesh.setMatrixAt(k, m); continue; }
      const [x, z, head, moving] = pos;
      const row = Math.floor(i / tr.cols), col = i % tr.cols;
      const ox = (col - (tr.cols - 1) / 2) * tr.sp + (hash2(i, 7) - 0.5) * tr.sp * 0.6;
      const oz = -row * tr.sp + (hash2(i, 9) - 0.5) * tr.sp * 0.6;
      const ch = Math.cos(head), sh = Math.sin(head);
      const wx = x + ox * ch + oz * sh, wz = z - ox * sh + oz * ch;
      const bob = moving ? Math.abs(Math.sin(t * 9 + i)) * 0.003 : 0;
      p.set(wx, ty(wx, wz) + bob, wz);
      q.setFromAxisAngle(up, head);
      const sc = tr.size * 1.7 * env;
      s.set(sc * 0.7, tr.h * 1.4 * env, sc);
      m.compose(p, q, s); troopMesh.setMatrixAt(k, m);
      troopMesh.setColorAt(k, tr.color);
    }
  }
  troopMesh.instanceMatrix.needsUpdate = true; troopMesh.instanceColor.needsUpdate = true;
  for (const tn of tents) {
    const g = smooth(tn.t0, tn.t0 + 0.6, t) * (1 - smooth(tn.t1 - 0.6, tn.t1, t));
    tn.o.visible = g > 0.01; tn.o.scale.set(LS * g, LS * g, LS * g);
  }
}

// ------------------------------------------------------------------ TREN, TELEFERİK, BURSARAY
const movers = new THREE.InstancedMesh(unitGeo, new THREE.MeshStandardMaterial({ roughness: 0.6, flatShading: true }), 64);
movers.castShadow = true; movers.frustumCulled = false; scene.add(movers); movers.setColorAt(0, new THREE.Color());
const cable = (() => {
  const pts = [[2.7, 0.6], [4.6, 7.8], [6.3, 9.5]].map(([x, z]) => new THREE.Vector3(x, ty(x, z) + 0.035, z));
  const g = new THREE.BufferGeometry().setFromPoints(pts);
  const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x222222 })); scene.add(l);
  return { l, pts };
})();

function updateMovers(t) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color();
  let k = 0;
  const put = (x, y, z, rot, sx, sy, sz, c) => {
    if (k >= 64) return;
    p.set(x, y, z); q.setFromAxisAngle(up, rot); s.set(sx, sy, sz); m.compose(p, q, s);
    movers.setMatrixAt(k, m); movers.setColorAt(k, col.setHex(c)); k++;
  };
  // Mudanya treni
  railRb.reveal(smooth(RAIL_MUDANYA.from, RAIL_MUDANYA.to, t) * (t < RAIL_MUDANYA.end ? 1 : 0));
  if (t > RAIL_MUDANYA.to && t < RAIL_MUDANYA.end) {
    const Ltot = railRb.L[railRb.L.length - 1];
    const s0 = ((t - RAIL_MUDANYA.to) * 1.6) % Ltot;
    for (let c = 0; c < 5; c++) {
      const [x, z, a] = pointAt(railRb.p, railRb.L, Ltot - s0 + c * 0.05);
      put(x, ty(x, z) + 0.006, z, a, 0.012 * LS, 0.01 * LS, 0.04 * LS, c === 0 ? 0x2b2b2b : 0x6b3b2b);
    }
  }
  // teleferik
  const tf = smooth(239.5, 240.5, t);
  cable.l.visible = tf > 0.01;
  if (tf > 0.01) {
    for (let c = 0; c < 8; c++) {
      const f = ((t * 0.05 + c / 8) % 1);
      const seg = f < 0.75 ? 0 : 1, lf = seg === 0 ? f / 0.75 : (f - 0.75) / 0.25;
      const a = cable.pts[seg], b = cable.pts[seg + 1];
      put(a.x + (b.x - a.x) * lf, a.y + (b.y - a.y) * lf - 0.012, a.z + (b.z - a.z) * lf, 0, 0.01 * LS, 0.008 * LS, 0.01 * LS, 0xd0302a);
    }
  }
  // Bursaray
  for (const b of brObjs) {
    const f = smooth(b.from, b.to, t); b.rb.reveal(f);
    if (f >= 1) {
      const Lt = b.rb.L[b.rb.L.length - 1];
      for (const dir of [0, 1]) {
        const sPos = ((t * 0.9 + dir * Lt * 0.5) % (Lt * 2));
        const s1 = sPos < Lt ? sPos : Lt * 2 - sPos;
        for (let c = 0; c < 3; c++) {
          const [x, z, a] = pointAt(b.rb.p, b.rb.L, s1 + c * 0.045);
          put(x, ty(x, z) + 0.014, z, a, 0.014 * LS, 0.01 * LS, 0.04 * LS, 0xe8eef2);
        }
      }
    }
  }
  for (; k < 64; k++) { m.makeScale(0, 0, 0); movers.setMatrixAt(k, m); }
  movers.instanceMatrix.needsUpdate = true; movers.instanceColor.needsUpdate = true;
  for (const r of roadObjs) r.rb.reveal(smooth(r.from, r.to, t));
}

// ------------------------------------------------------------------ PARÇACIKLAR (ateş, duman, toz, buhar)
const MAXP = 9000;
function particleSystem(additive) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(MAXP * 3), col = new Float32Array(MAXP * 4), size = new Float32Array(MAXP);
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('pcolor', new THREE.BufferAttribute(col, 4));
  g.setAttribute('psize', new THREE.BufferAttribute(size, 1));
  const m = new THREE.ShaderMaterial({
    uniforms: { scale: { value: H / (2 * Math.tan((38 * Math.PI) / 360)) } },
    vertexShader: `attribute vec4 pcolor; attribute float psize; varying vec4 vC; uniform float scale;
      void main(){ vC = pcolor; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = psize * scale / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec4 vC; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vC.rgb, vC.a * a); }`,
    transparent: true, depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts);
  let n = 0;
  return {
    reset() { n = 0; },
    add(x, y, z, s, r, gg, b, a) { if (n >= MAXP) return; pos[n * 3] = x; pos[n * 3 + 1] = y; pos[n * 3 + 2] = z; size[n] = s; col[n * 4] = r; col[n * 4 + 1] = gg; col[n * 4 + 2] = b; col[n * 4 + 3] = a; n++; },
    flush() { g.setDrawRange(0, n); g.attributes.position.needsUpdate = true; g.attributes.pcolor.needsUpdate = true; g.attributes.psize.needsUpdate = true; },
  };
}
const smokeP = particleSystem(false), fireP = particleSystem(true);
smokeP.renderOrderHint = 1;

const EMITTERS = [];
// kaplıca buharı
for (const [x, z] of [[-2.7, -1.3], [-2.5, -1.18], [-2.35, -1.28]]) EMITTERS.push({ kind: 'steam', x, z, t0: 0, t1: 400, n: 10, r: 0.02 });
for (const [x, z, t0, t1] of [[0.6, 0.33, 236.3, 239.5], [0.66, 0.2, 236.8, 239.2], [0.6, 0.28, 181.3, 185], [0.7, 0.18, 181.8, 185.5]]) EMITTERS.push({ kind: 'fire', x, z, t0, t1, n: 22, r: 0.05 });
for (const f of fireSpots) EMITTERS.push({ kind: 'fire', x: f.x, z: f.z, t0: f.t0, t1: f.t1, n: 14, r: 0.03 });
for (const d of dustSpots) EMITTERS.push({ kind: 'dust', x: d.x, z: d.z, t0: d.t0, t1: d.t1, n: 10, r: 0.05 });
// ordugâh ocakları
for (const [x, z] of SIEGE) EMITTERS.push({ kind: 'camp', x, z, t0: 74, t1: 87, n: 6, r: 0.02 });
// fabrika bacaları
EMITTERS.push({ kind: 'chimney', x: -0.94 + 0.08, z: -1.61 + 0.06, y: 0.09, t0: 231, t1: 290, n: 12, r: 0.01 });
for (let i = 0; i < 6; i++) EMITTERS.push({ kind: 'chimney', x: -4.8 + (hash2(i, 3) - 0.5) * 2, z: -3.9 + (hash2(i, 4) - 0.5) * 1.2, y: 0.03, t0: 247 + i, t1: 300, n: 8, r: 0.02, big: 1 });

function updateParticles(t) {
  smokeP.reset(); fireP.reset();
  EMITTERS.forEach((e, ei) => {
    if (t < e.t0 || t > e.t1 + 4) return;
    const env = smooth(e.t0, e.t0 + 0.5, t) * (1 - smooth(e.t1, e.t1 + 1.5, t));
    if (env <= 0.001) return;
    const gy = ty(e.x, e.z) + (e.y || 0);
    for (let i = 0; i < e.n; i++) {
      const life = e.kind === 'fire' ? 1.1 : e.kind === 'dust' ? 2.2 : e.kind === 'steam' ? 3.0 : 3.5;
      const ph = hash2(ei * 131 + i, 17);
      const T = t - e.t0 + ph * life;
      const cyc = Math.floor(T / life), age = (T % life) / life;
      const rx = (hash2(ei * 977 + i, cyc) - 0.5) * 2 * e.r, rz = (hash2(ei * 577 + i, cyc + 999) - 0.5) * 2 * e.r;
      const fade = Math.sin(Math.PI * age) * env;
      if (e.kind === 'fire') {
        const y = gy + 0.01 + age * 0.05;
        fireP.add(e.x + rx * (1 - age * 0.5), y, e.z + rz, 0.05 * (1 - age * 0.6), 1.0, 0.45 + 0.3 * (1 - age), 0.12, 0.9 * fade);
        // duman
        const sa = (T * 0.6 % life) / life;
        smokeP.add(e.x + rx + sa * 0.08, gy + 0.04 + sa * 0.22, e.z + rz - sa * 0.04, 0.06 + sa * 0.16, 0.18, 0.16, 0.15, 0.5 * Math.sin(Math.PI * sa) * env);
      } else if (e.kind === 'dust') {
        smokeP.add(e.x + rx * (1 + age), gy + 0.01 + age * 0.05, e.z + rz * (1 + age), 0.05 + age * 0.12, 0.62, 0.56, 0.48, 0.65 * fade);
      } else if (e.kind === 'steam') {
        smokeP.add(e.x + rx + age * 0.03, gy + 0.01 + age * 0.08, e.z + rz, 0.02 + age * 0.05, 0.96, 0.97, 0.98, 0.5 * fade);
      } else if (e.kind === 'camp') {
        smokeP.add(e.x + rx + age * 0.04, gy + 0.01 + age * 0.08, e.z + rz, 0.015 + age * 0.04, 0.55, 0.53, 0.5, 0.45 * fade);
      } else if (e.kind === 'chimney') {
        const b = e.big ? 2 : 1;
        smokeP.add(e.x + age * 0.06 * b, gy + age * 0.09 * b, e.z + rx * 0.3, (0.02 + age * 0.06) * b, 0.75, 0.74, 0.72, 0.45 * fade);
      }
    }
  });
  smokeP.flush(); fireP.flush();
}

// ------------------------------------------------------------------ ETİKETLER
const LABELS = [
  ['Uludağ (Mysia Olympos)', 14, 12.8, 0.1, 0, 12, 'major'],
  ['Bursa Ovası', -3, -5, 0, 1, 12, 'area'],
  ['Prusa', HISAR.x, HISAR.z, 0.05, 11, 52, 'major'],
  ['Sıcak su kaynakları', -2.55, -1.25, 0.05, 18, 30, 'minor'],
  ['Hamam', -2.62, -1.22, 0.05, 32, 42, 'minor'],
  ['Kilise', 0.13, 0.09, 0.06, 43, 52, 'minor'],
  ['Bursa Ovası', -2, -4, 0, 56, 70, 'area'],
  ['Nilüfer Çayı', -6, -6.3, 0.02, 56, 70, 'minor'],
  ['Balabancık Kulesi', 1.3, -0.15, 0.08, 74, 90, 'minor'],
  ['Aktimur Kulesi', -1.05, -0.15, 0.08, 74, 90, 'minor'],
  ['Bursa Hisarı', HISAR.x, HISAR.z, 0.06, 74, 92, 'major'],
  ['Osman Gazi Türbesi', 0.13, 0.09, 0.05, 95, 104, 'major'],
  ['Orhan Gazi Külliyesi', 0.79, 0.22, 0.07, 106, 114, 'major'],
  ['Çekirge · Hüdavendigar', -2.81, -1.39, 0.1, 115, 122, 'major'],
  ['Ulu Cami', 0.47, 0.15, 0.08, 124, 131, 'major'],
  ['Yıldırım Külliyesi', 3.1, -1.05, 0.08, 124, 131, 'minor'],
  ['Yeşil Cami', 1.55, 0.41, 0.09, 152, 160, 'major'],
  ['Emir Sultan', 2.49, 0.0, 0.08, 153, 160, 'minor'],
  ['Muradiye', -0.81, -0.58, 0.08, 155, 160, 'minor'],
  ['Koza Han', 0.66, 0.2, 0.05, 164, 172, 'major'],
  ['Hanlar Bölgesi', 0.62, 0.22, 0.06, 180, 187, 'major'],
  ['Hükümet Konağı', 0.97, 0.06, 0.06, 200, 205, 'minor'],
  ['Saat Kulesi', 0.0, -0.17, 0.1, 206, 211, 'minor'],
  ['İstasyon', -0.7, -1.8, 0.05, 204, 211, 'minor'],
  ['→ Mudanya', -6, -8.5, 0.03, 204, 211, 'minor'],
  ['Merinos Fabrikası', -0.94, -1.61, 0.08, 230, 236, 'major'],
  ['Kapalıçarşı', 0.62, 0.25, 0.05, 235, 240, 'major'],
  ['Teleferik', 4.6, 7.8, 0.12, 241, 247, 'major'],
  ['Organize Sanayi Bölgesi', -4.8, -3.9, 0.04, 249, 257, 'major'],
  ['Tofaş', 1.0, -4.2, 0.04, 250, 257, 'minor'],
  ['Osmangazi', 0.0, -1.2, 0.02, 258, 266, 'area'],
  ['Nilüfer', -8.2, -3.3, 0.02, 258, 266, 'area'],
  ['Yıldırım', 4.5, -1.0, 0.02, 258, 266, 'area'],
  ['Uludağ Üniversitesi', -15.8, -4.9, 0.04, 258, 266, 'minor'],
  ['Demirtaş OSB', 2.0, -9.4, 0.04, 258, 266, 'minor'],
  ['Bursaray', -3, -2.2, 0.04, 270, 274, 'major'],
  ['Hanlar · Ulu Cami', 0.55, 0.2, 0.08, 275, 282, 'minor'],
  ['Cumalıkızık', 9.9, 1.2, 0.04, 276, 290, 'major'],
  ['Kestel', 13.1, -1.6, 0.03, 282, 292, 'minor'],
  ['Görükle', -15.0, -4.0, 0.03, 282, 292, 'minor'],
  ['Timsah Arena', -4.2, -4.6, 0.06, 283, 290, 'minor'],
  ['Uludağ', 14, 12.8, 0.1, 286, 300, 'major'],
];
const labelEl = document.getElementById('labels');
const labelNodes = LABELS.map((l) => { const d = document.createElement('div'); d.className = 'lbl ' + l[6]; d.textContent = l[0]; labelEl.appendChild(d); return d; });
const troopLabelNodes = TROOPS.map((tr) => { if (!tr.label) return null; const d = document.createElement('div'); d.className = 'lbl army'; d.textContent = tr.label; labelEl.appendChild(d); return d; });
const v3 = new THREE.Vector3();
function placeLabel(node, x, y, z, alpha) {
  v3.set(x, y, z).project(camera);
  if (v3.z > 1 || alpha <= 0.01 || Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05) { node.style.opacity = 0; return; }
  node.style.opacity = alpha;
  node.style.left = ((v3.x + 1) / 2) * W + 'px';
  node.style.top = ((1 - v3.y) / 2) * H + 'px';
}
function updateLabels(t) {
  LABELS.forEach((l, i) => {
    const [, x, z, dy, t0, t1] = l;
    const a = smooth(t0, t0 + 0.6, t) * (1 - smooth(t1 - 0.6, t1, t));
    placeLabel(labelNodes[i], x, ty(x, z) + dy, z, a);
  });
  TROOPS.forEach((tr, i) => {
    const n = troopLabelNodes[i]; if (!n) return;
    if (!tr.cur) { n.style.opacity = 0; return; }
    placeLabel(n, tr.cur[0], ty(tr.cur[0], tr.cur[1]) + 0.07, tr.cur[1], 1);
  });
}

// ------------------------------------------------------------------ KAMERA
function hermite(keys, idx, t) {
  // monoton kübik interpolasyon (bekleme noktalarında taşma yapmaz)
  const n = keys.length;
  let i = 0; while (i < n - 2 && t > keys[i + 1][0]) i++;
  const val = (k) => (idx === 3 ? Math.log(k[3]) : k[idx]);
  const T = (j) => keys[Math.max(0, Math.min(n - 1, j))][0];
  const P = (j) => val(keys[Math.max(0, Math.min(n - 1, j))]);
  const sec = (j) => { const dt = T(j + 1) - T(j); return dt > 0 ? (P(j + 1) - P(j)) / dt : 0; };
  const tan = (j) => {
    const d0 = j > 0 ? sec(j - 1) : sec(j), d1 = j < n - 1 ? sec(j) : sec(j - 1);
    if (d0 * d1 <= 0) return 0;
    const w0 = 2 * (T(j + 1) - T(j)) + (T(j) - T(j - 1)), w1 = (T(j + 1) - T(j)) + 2 * (T(j) - T(j - 1));
    return (w0 + w1) / (w0 / d0 + w1 / d1);
  };
  const t1 = T(i), t2 = T(i + 1), h = t2 - t1;
  const f = Math.max(0, Math.min(1, (t - t1) / h));
  const p1 = P(i), p2 = P(i + 1), m1 = tan(i) * h, m2 = tan(i + 1) * h;
  const f2 = f * f, f3 = f2 * f;
  const v = (2 * f3 - 3 * f2 + 1) * p1 + (f3 - 2 * f2 + f) * m1 + (-2 * f3 + 3 * f2) * p2 + (f3 - f2) * m2;
  return idx === 3 ? Math.exp(v) : v;
}

const QUAKES = [[188.7, 4.0, 1.0], [267.0, 2.0, 0.25]];
function shakeAmp(t) {
  let a = 0;
  for (const [t0, d, s] of QUAKES) if (t >= t0 && t < t0 + d) a = Math.max(a, s * (1 - (t - t0) / d) * smooth(t0, t0 + 0.15, t));
  return a;
}

function updateCamera(t) {
  const tx = hermite(CAMERA_KEYS, 1, t), tz = hermite(CAMERA_KEYS, 2, t);
  const dist = hermite(CAMERA_KEYS, 3, t);
  const az = (hermite(CAMERA_KEYS, 4, t) * Math.PI) / 180, el = (hermite(CAMERA_KEYS, 5, t) * Math.PI) / 180;
  const tyy = ty(tx, tz);
  const tgt = new THREE.Vector3(tx, tyy, tz);
  const pos = new THREE.Vector3(tx + Math.sin(az) * Math.cos(el) * dist, tyy + Math.sin(el) * dist, tz - Math.cos(az) * Math.cos(el) * dist);
  // araziye gömülmeyi önle
  pos.y = Math.max(pos.y, ty(pos.x, pos.z) + 0.15 * dist * 0.2 + 0.05);
  const sa = shakeAmp(t);
  if (sa > 0) {
    const k = dist * 0.012 * sa;
    pos.x += Math.sin(t * 61) * k; pos.y += Math.sin(t * 47 + 1) * k; pos.z += Math.cos(t * 53) * k;
    tgt.x += Math.sin(t * 43 + 2) * k * 0.6;
  }
  camera.position.copy(pos);
  camera.lookAt(tgt);
  camera.near = Math.max(0.01, dist * 0.02);
  camera.far = dist * 12 + 90;
  camera.updateProjectionMatrix();
  scene.fog.near = dist * 2.5 + 4; scene.fog.far = dist * 6 + 45;
  // gölge kamerası hedefi takip etsin
  const sh = sun.shadow.camera, half = Math.min(dist * 0.85, 12);
  sh.left = -half; sh.right = half; sh.top = half; sh.bottom = -half; sh.near = 0.1; sh.far = 80; sh.updateProjectionMatrix();
  sun.position.copy(tgt).addScaledVector(SUN_DIR, 30);
  sun.target.position.copy(tgt);
  sun.shadow.bias = -0.0002 - dist * 0.00002;
  return dist;
}

// ------------------------------------------------------------------ ARAYÜZ
const $ = (s) => document.querySelector(s);
const ui = {
  emWrap: $('#ruler .em'), nmWrap: $('#ruler .nm'),
  popV: $('#pop .v'), popN: $('#pop .n'), pop: $('#pop'),
  yearV: $('#year .v'), yearE: $('#year .e'), bar: $('#bar i'),
  card: $('#card'), cardT: $('#card .t'), cardX: $('#card .x'),
  title: $('#title'), tA: $('#title .a'), tB: $('#title .b'), tC: $('#title .c'),
  tint: $('#tint'), flash: $('#flash'), ruler: $('#ruler'), year: $('#year'),
};
const rulerNodes = {};
function rulerNode(r) {
  if (rulerNodes[r.name]) return rulerNodes[r.name];
  const c = document.createElement('canvas'); c.width = 192; c.height = 128; drawEmblem(c.getContext('2d'), r.emblem, 192, 128);
  const n = document.createElement('div'); n.textContent = r.name;
  ui.emWrap.appendChild(c); ui.nmWrap.appendChild(n);
  return (rulerNodes[r.name] = { c, n });
}
let lastRuler = null, rulerSwitchT = -10, prevRuler = null;
function eraName(y) {
  if (y < -74) return 'Helenistik dönem';
  if (y < 330) return 'Roma dönemi';
  if (y < 1326) return 'Bizans dönemi';
  if (y < 1453) return 'Erken Osmanlı · başkent';
  if (y < 1839) return 'Osmanlı dönemi';
  if (y < 1923) return 'Geç Osmanlı';
  if (y < 1960) return 'Erken Cumhuriyet';
  return 'Sanayi şehri';
}
const fmt = new Intl.NumberFormat('tr-TR');

function updateUI(t, year) {
  const r = rulerAt(year);
  if (!lastRuler || r.name !== lastRuler.name) {
    prevRuler = lastRuler; lastRuler = r;
    // deterministik geçiş zamanı: yönetim değişiminin video zamanı
    rulerSwitchT = tt(r.from);
  }
  for (const k in rulerNodes) { rulerNodes[k].c.style.opacity = 0; rulerNodes[k].n.style.opacity = 0; }
  const f = smooth(rulerSwitchT, rulerSwitchT + 0.8, t);
  const cur = rulerNode(r); cur.c.style.opacity = f; cur.n.style.opacity = f;
  if (prevRuler && f < 1) { const p = rulerNode(prevRuler); p.c.style.opacity = 1 - f; p.n.style.opacity = 1 - f; }
  flag.update(t, r.emblem);

  const pop = popAt(year);
  const rounded = pop >= 100000 ? Math.round(pop / 1000) * 1000 : Math.round(pop / 100) * 100;
  ui.popV.textContent = (year < 1927 ? '≈ ' : '') + fmt.format(rounded);
  ui.popN.textContent = year < 1927 ? 'tahmini · şehir merkezi' : 'şehir merkezi';
  ui.yearV.textContent = formatYear(year);
  ui.yearE.textContent = eraName(year);
  ui.bar.style.width = ((t / DURATION) * 100).toFixed(2) + '%';

  // olay kartı
  let ev = null;
  for (const e of EVENTS) if (t >= e.t && t < e.t + e.d) ev = e;
  if (ev) {
    ui.cardT.textContent = ev.title; ui.cardX.textContent = ev.text;
    const a = smooth(ev.t, ev.t + 0.5, t) * (1 - smooth(ev.t + ev.d - 0.5, ev.t + ev.d, t));
    ui.card.style.opacity = a;
    ui.card.style.transform = `translateY(${(1 - a) * 14}px)`;
  } else ui.card.style.opacity = 0;

  // başlık ve kapanış
  const hudA = smooth(6.5, 8, t) * (1 - smooth(293, 294.5, t));
  for (const el of [ui.ruler, ui.pop, ui.year, $('#bar')]) el.style.opacity = hudA;
  if (t < 9) {
    ui.tA.textContent = 'BURSA'; ui.tB.textContent = 'Uludağ\'ın eteğinde 2200 yıl'; ui.tC.textContent = 'Prusa · Brusa · Hüdavendigâr · Bursa';
    ui.title.style.opacity = smooth(0.3, 1.8, t) * (1 - smooth(6.2, 7.6, t));
  } else if (t > 292.5) {
    ui.tA.textContent = 'BURSA'; ui.tB.textContent = 'MÖ ~200 → 2026';
    ui.tC.textContent = 'Temsilî canlandırmadır · yerleşim alanları ve eski nüfuslar yaklaşıktır';
    ui.title.style.opacity = smooth(293.5, 295.5, t);
  } else ui.title.style.opacity = 0;

  // renk tonlaması (yangın / toz)
  let fire = 0, dust = 0;
  for (const d of DESTRUCTIONS) {
    if (d.kind === 'fire') fire = Math.max(fire, smooth(d.t, d.t + 1, t) * (1 - smooth(d.t + 3.5, d.t + 5.5, t)));
    else dust = Math.max(dust, smooth(d.t, d.t + 0.3, t) * (1 - smooth(d.t + 2, d.t + 5, t)));
  }
  if (fire > dust) { ui.tint.style.background = '#ffb27a'; ui.tint.style.opacity = fire * 0.45; }
  else { ui.tint.style.background = '#c9b9a2'; ui.tint.style.opacity = dust * 0.5; }
  // kuşatma/işgal anlarında hafif koyulaşma
  const war = Math.max(smooth(72, 74, t) * (1 - smooth(85, 87, t)), smooth(209, 211, t) * (1 - smooth(219.5, 221, t)));
  if (war > fire && war > dust) { ui.tint.style.background = '#b8b0c8'; ui.tint.style.opacity = war * 0.3; }
  ui.flash.style.opacity = Math.max(0, 1 - Math.abs(t - 188.75) * 6) * 0.35;
}

// ------------------------------------------------------------------ ANA DÖNGÜ
function renderAt(t) {
  t = Math.max(0, Math.min(DURATION, t));
  const year = yearAt(t);
  terrain.update(year);
  const dist = updateCamera(t);
  camera.updateMatrixWorld();
  updateBuildings(t, dist);
  wall.update(t);
  updateLandmarks(t);
  updateTroops(t);
  updateMovers(t);
  updateParticles(t);
  updateLabels(t);
  updateUI(t, year);
  renderer.render(scene, camera);
}

window.renderAt = renderAt;
window.DURATION = DURATION;
window.buildingCount = buildings.length;

const params = new URLSearchParams(location.search);
document.fonts.ready.then(() => {
  if (params.has('play')) {
    const start = performance.now() - parseFloat(params.get('play') || 0) * 1000;
    const loop = () => { renderAt((performance.now() - start) / 1000); requestAnimationFrame(loop); };
    loop();
  } else {
    renderAt(parseFloat(params.get('t') || 0));
  }
  window.ready = true;
});
