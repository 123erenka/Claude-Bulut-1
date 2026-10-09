// Belirli saniyelerden kare alır: node snap.mjs out_dir t1 t2 ...
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
const root = new URL('.', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json' };
export function serve() {
  return new Promise((res) => {
    const s = createServer(async (q, r) => {
      try { const p = join(root, decodeURIComponent(q.url.split('?')[0])); const b = await readFile(p); r.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); r.end(b); }
      catch { r.writeHead(404); r.end(); }
    }).listen(0, () => res(s));
  });
}
// GPU modu: gerçek ekran kartı (yerel bilgisayar). Yazılım modu: SwiftShader (GPU'suz bulut).
// RENDER_GPU=1 ortam değişkeni ya da --gpu bayrağı GPU modunu açar.
export const GPU = process.env.RENDER_GPU === '1' || process.argv.includes('--gpu');
const GPU_ARGS = ['--ignore-gpu-blocklist', '--enable-gpu', '--enable-gpu-rasterization', '--use-angle=default'];
const SOFT_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
export async function openPage(port, query = '') {
  // Bazı sistemlerde başsız (headless) Chromium GPU kullanmaz; RENDER_HEADED=1 pencereli açar.
  const browser = await chromium.launch({ headless: process.env.RENDER_HEADED !== '1', args: GPU ? GPU_ARGS : SOFT_ARGS });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${port}/index.html${query}`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 180000 });
  return { browser, page };
}

// Hangi grafik birimiyle çizildiğini döndürür (SwiftShader ise yazılım modundasınız demektir)
export async function glRenderer(page) {
  return page.evaluate(() => {
    const gl = document.querySelector('canvas').getContext('webgl2');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
}
// Kullanım: node snap.mjs out_dir t1 t2 ... [--gpu] [--sheet]
// --sheet: kareleri ayrıca tek bir kontrol ızgarasında (sheet.jpg) birleştirir.
if (process.argv[1].endsWith('snap.mjs')) {
  const [out, ...rest] = process.argv.slice(2);
  const ts = rest.filter((a) => !a.startsWith('--'));
  const s = await serve();
  const t0 = Date.now();
  const { browser, page } = await openPage(s.address().port);
  console.log('load', (Date.now() - t0) / 1000, 's buildings', await page.evaluate(() => window.buildingCount), '·', await glRenderer(page));
  for (const t of ts) {
    const a = Date.now();
    await page.evaluate((t) => window.renderAt(t), parseFloat(t));
    await page.locator('#stage').screenshot({ path: `${out}/t${t}.jpg`, type: 'jpeg', quality: 85 });
    console.log('t', t, (Date.now() - a) / 1000, 's');
  }
  await browser.close(); s.close();
  if (process.argv.includes('--sheet')) {
    const { execFileSync } = await import('child_process');
    const cols = Math.min(4, ts.length), rows = Math.ceil(ts.length / cols);
    const inputs = ts.flatMap((t) => ['-i', `${out}/t${t}.jpg`]);
    const filt = ts.map((_, i) => `[${i}:v]scale=480:270[v${i}]`).join(';') + ';' + ts.map((_, i) => `[v${i}]`).join('') +
      `xstack=inputs=${ts.length}:layout=` + ts.map((_, i) => `${(i % cols) * 480}_${Math.floor(i / cols) * 270}`).join('|') + `:fill=black[o]`;
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', ts.length > 1 ? filt : '[0:v]scale=480:270[o]', '-map', '[o]', '-frames:v', '1', `${out}/sheet.jpg`]);
    console.log('ızgara:', `${out}/sheet.jpg`, `${cols}x${rows}`);
  }
}
