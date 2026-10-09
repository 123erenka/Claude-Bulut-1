// Videoyu kare kare render edip tek geçişte son MP4'ü (1080p + ses) üretir.
//
//   node render.mjs [--out cikti/bursa-zaman-haritasi.mp4] [--fps 30] [--workers auto]
//                   [--from 0] [--to 300] [--crf 22] [--maxrate 3000k] [--gpu] [--no-audio]
//
// - İşçiler ortak bir kuyruktan sıradaki kareyi alır (iş yükü kendiliğinden dengelenir:
//   ağır modern dönem kareleri tek bir işçiye yığılmaz).
// - Kareler sıraya dizilip tek bir ffmpeg sürecine akıtılır; ses aynı anda eklenir.
//   Ara dosya, birleştirme ya da ikinci kodlama yoktur.
// - --gpu (veya RENDER_GPU=1): gerçek ekran kartıyla çizer. GPU'suz bulutta yazılım modu kullanılır.
import { spawn, execFileSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { cpus } from 'os';
import { dirname } from 'path';
import { serve, openPage, glRenderer, GPU } from './snap.mjs';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const out = arg('out', 'cikti/bursa-zaman-haritasi.mp4');
const fps = +arg('fps', 30);
const from = +arg('from', 0), to = +arg('to', 300);
const crf = arg('crf', '22'), maxrate = arg('maxrate', '3000k');
// GPU'da çizim ucuz, darboğaz ekran görüntüsü almaktır: birkaç işçi yeterli.
// Yazılım modunda her işçi çekirdek yer; çekirdek sayısının bir eksiği.
const autoWorkers = GPU ? 4 : Math.max(1, cpus().length - 1);
const workers = arg('workers', 'auto') === 'auto' ? autoWorkers : +arg('workers');
const audio = process.argv.includes('--no-audio') ? null : arg('audio', 'cikti/ses.wav');
mkdirSync(dirname(out), { recursive: true });

if (audio && !existsSync(audio)) {
  console.log('ses üretiliyor →', audio);
  mkdirSync(dirname(audio), { recursive: true });
  execFileSync('python3', ['ses/ses.py', audio], { stdio: 'inherit' });
}

const f0 = Math.round(from * fps), f1 = Math.round(to * fps), total = f1 - f0;
const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
if (audio) ffArgs.push('-ss', String(from), '-t', String(to - from), '-i', audio);
ffArgs.push('-map', '0:v');
if (audio) ffArgs.push('-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest');
ffArgs.push('-c:v', 'libx264', '-preset', 'medium', '-crf', crf, '-maxrate', maxrate, '-bufsize', String(parseInt(maxrate) * 2) + 'k',
  '-pix_fmt', 'yuv420p', '-r', String(fps), '-movflags', '+faststart', out);
const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
const ffDone = new Promise((r) => ff.on('close', r));

// Sıralı yazım: işçiler kareleri karışık sırada bitirir, burada sıraya dizilir.
const LOOKAHEAD = workers * 8; // bellek sınırı: yazılmamış en fazla bu kadar kare beklesin
const pending = new Map();
let nextWrite = f0, nextTake = f0, written = 0;
const t0 = Date.now();
let waiters = [];

async function flush() {
  while (pending.has(nextWrite)) {
    const buf = pending.get(nextWrite); pending.delete(nextWrite);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    nextWrite++; written++;
    if (written % 100 === 0 || written === total) {
      const el = (Date.now() - t0) / 1000, rate = written / el;
      console.log(`${written}/${total} kare · ${rate.toFixed(2)} kare/sn · kalan ~${((total - written) / rate / 60).toFixed(1)} dk`);
    }
  }
  const w = waiters; waiters = []; w.forEach((r) => r());
}

async function take() {
  while (nextTake < f1 && nextTake >= nextWrite + LOOKAHEAD) await new Promise((r) => waiters.push(r));
  return nextTake < f1 ? nextTake++ : null;
}

const server = await serve();
const port = server.address().port;
let writing = Promise.resolve();

async function work(w) {
  const { browser, page } = await openPage(port);
  if (w === 0) console.log(`${workers} işçi · ${GPU ? 'GPU' : 'yazılım'} modu · çizici: ${await glRenderer(page)}`);
  for (let f = await take(); f !== null; f = await take()) {
    await page.evaluate((t) => window.renderAt(t), f / fps);
    pending.set(f, await page.screenshot({ type: 'jpeg', quality: 93 }));
    writing = writing.then(flush);
  }
  await browser.close();
}

await Promise.all([...Array(workers).keys()].map(work));
await writing;
ff.stdin.end();
await ffDone;
server.close();
console.log(`bitti: ${out} · ${((Date.now() - t0) / 60000).toFixed(1)} dk`);
