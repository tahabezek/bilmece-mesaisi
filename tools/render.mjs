// Kare kare render: engine/bolum.html'i headless Chrome'da açar, her kareyi renderFrame(t) ile sıfırdan çizdirir,
// tuvali doğrudan okur (ekran görüntüsü değil), ffmpeg ile sesle birleştirir (H.264, yuv420p, BT.709, +faststart).
//   node tools/render.mjs 001-badana [--s 0.5] [--out out/taslak_001.mp4] [--from 0 --to 43]   → video
//   node tools/render.mjs 001-badana --sheet [--s 0.35]                                       → temas kâğıdı
//     temas kâğıdı: her replik başından 0,3 sn sonra bir kare (out/temas_<id>.png); --at 3,12.5 belirli anlar
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import { staticServer, openBrowser } from './still.mjs';

const args = process.argv.slice(2), id = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const S = Number(opt('s', args.includes('--sheet') ? 0.35 : 1)), FPS = 30, WORKERS = Number(opt('j', Math.max(2, Math.min(6, os.cpus().length - 2))));
const tlj = JSON.parse(fs.readFileSync(path.join('assets', 'voice', id, 'timeline.json'), 'utf8'));
const W = Math.round(1080 * S) & ~1, H = Math.round(1920 * S) & ~1;

const srv = await staticServer();
const browser = await openBrowser();
const url = `http://127.0.0.1:${srv.address().port}/engine/bolum.html?id=${id}&s=${S}`;
async function page() {
  const p = await browser.newPage();
  await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('sayfa hatası:', e.message));
  await p.goto(url); await p.waitForFunction('window.__ready === true', { timeout: 60000, polling: 250 });   // (12 Kas) rAF yoklaması arka sekmede takılıyordu
  return p;
}
const grab = (p, t, type) => p.evaluate((t, type) => { window.renderFrame(t); return document.getElementById('c').toDataURL(type, 0.93).split(',')[1]; }, t, type);

try {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bilmece-'));
  if (args.includes('--sheet')) {
    // temas kâğıdı: replik başları + 0,3 sn ve son kart
    const ts = opt('at') ? opt('at').split(',').map(Number) : [0, ...tlj.lines.map(l => l.t0 + 0.3), tlj.duration - 0.6];
    const p = await page();
    for (const [i, t] of ts.entries()) fs.writeFileSync(path.join(tmp, `k${String(i).padStart(3, '0')}.png`), Buffer.from(await grab(p, t, 'image/png'), 'base64'));
    const cols = 6, rows = Math.ceil(ts.length / cols), out = path.join('out', `temas_${id}.png`);
    const r = spawnSync(ffmpegPath, ['-v', 'error', '-y', '-framerate', '1', '-i', path.join(tmp, 'k%03d.png'), '-vf', `tile=${cols}x${rows}:padding=8:color=0x1F2421`, '-frames:v', '1', out]);
    if (r.status) throw new Error(r.stderr.toString());
    console.log('temas kâğıdı:', out, ts.map(t => t.toFixed(1)).join(' '));
  } else {
    const from = Number(opt('from', 0)), to = Math.min(Number(opt('to', tlj.duration)), tlj.duration);
    const n0 = Math.round(from * FPS), n1 = Math.round(to * FPS), type = S < 1 ? 'image/jpeg' : 'image/png', ext = S < 1 ? 'jpg' : 'png';
    const pages = await Promise.all(Array.from({ length: WORKERS }, page));
    let next = n0, done = 0; const t0 = Date.now();
    await Promise.all(pages.map(async p => {
      while (next < n1) {
        const n = next++;
        fs.writeFileSync(path.join(tmp, `f${String(n - n0).padStart(5, '0')}.${ext}`), Buffer.from(await grab(p, n / FPS, type), 'base64'));
        if (++done % 150 === 0) console.log(`${done}/${n1 - n0} kare · ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
      }
    }));
    const out = opt('out', path.join('out', S < 1 ? `taslak_${id}.mp4` : `bolum_${id}.mp4`));
    const r = spawnSync(ffmpegPath, ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, `f%05d.${ext}`),
      '-ss', String(from), '-t', String(to - from), '-i', path.join('assets', 'voice', id, 'mix.wav'),
      '-c:v', 'libx264', '-preset', S < 1 ? 'veryfast' : 'slow', '-crf', S < 1 ? '22' : '17', '-pix_fmt', 'yuv420p',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-vf', 'scale=out_color_matrix=bt709',
      '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { maxBuffer: 1 << 26 });
    if (r.status) throw new Error(r.stderr.toString());
    console.log('video:', out, `${n1 - n0} kare, ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
} finally { await browser.close(); srv.close(); }
