// Videoyu kare kare render eder: node render.mjs --out dir [--fps 30] [--workers 3] [--from 0] [--to 300]
// Her işçi kendi tarayıcısında ardışık bir kare aralığını çizip ffmpeg'e JPEG akışı gönderir.
import { spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { serve, openPage } from './snap.mjs';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const out = arg('out', 'cikti/parcalar');
const fps = +arg('fps', 30), workers = +arg('workers', 3);
const from = +arg('from', 0), to = +arg('to', 300);
mkdirSync(out, { recursive: true });

const f0 = Math.round(from * fps), f1 = Math.round(to * fps);
const total = f1 - f0;
const server = await serve();
const port = server.address().port;
const per = Math.ceil(total / workers);
const t0 = Date.now();
let done = 0;

async function work(w) {
  const a = f0 + w * per, b = Math.min(f1, a + per);
  if (a >= b) return null;
  const file = `${out}/parca_${String(w).padStart(2, '0')}.mp4`;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const { browser, page } = await openPage(port);
  for (let f = a; f < b; f++) {
    await page.evaluate((t) => window.renderAt(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    done++;
    if (done % 50 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`${done}/${total} kare · ${(done / el).toFixed(2)} kare/sn · kalan ~${((total - done) / (done / el) / 60).toFixed(1)} dk`);
    }
  }
  await browser.close();
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  return file;
}

const files = (await Promise.all([...Array(workers).keys()].map(work))).filter(Boolean);
writeFileSync(`${out}/liste.txt`, files.map((f) => `file '${f.split('/').pop()}'`).join('\n') + '\n');
server.close();
console.log('bitti', ((Date.now() - t0) / 60000).toFixed(1), 'dk');
