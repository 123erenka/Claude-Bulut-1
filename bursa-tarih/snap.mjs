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
export async function openPage(port, query = '') {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${port}/index.html${query}`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 180000 });
  return { browser, page };
}
if (process.argv[1].endsWith('snap.mjs')) {
  const [out, ...ts] = process.argv.slice(2);
  const s = await serve();
  const t0 = Date.now();
  const { browser, page } = await openPage(s.address().port);
  console.log('load', (Date.now() - t0) / 1000, 's buildings', await page.evaluate(() => window.buildingCount));
  for (const t of ts) {
    const a = Date.now();
    await page.evaluate((t) => window.renderAt(t), parseFloat(t));
    await page.locator('#stage').screenshot({ path: `${out}/t${t}.jpg`, type: 'jpeg', quality: 85 });
    console.log('t', t, (Date.now() - a) / 1000, 's');
  }
  await browser.close(); s.close();
}
