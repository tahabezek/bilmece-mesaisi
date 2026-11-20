// Cevapsız sürüm (20 Kas 2026, kullanıcı: "artık cevapları verme"): bitmiş videoyu "Buldum!"dan hemen önce keser,
// sona aynı videonun takip kartını ekler. Yeniden render gerekmez. Asıl dosya out/bolum_<id>_cevapli.mp4 olarak saklanır.
//   node tools/cevapsiz.mjs 047-bardaklar [051-kimin-sayisi …]
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import ff from 'ffmpeg-static';

for (const id of process.argv.slice(2)) {
  const tl = JSON.parse(fs.readFileSync(`assets/voice/${id}/timeline.json`, 'utf8'));
  const ep = JSON.parse(fs.readFileSync(`bolumler/${id}.json`, 'utf8'));
  const d3 = tl.lines.find(l => l.id === 'd3');
  const son = tl.lines[tl.lines.length - 1];
  const tc = +(d3.t0 - 0.12).toFixed(3);            // "Buldum!" sesinden hemen önce
  const te = +(son.t1 + 0.1).toFixed(3);            // takip kartının başladığı an (son repliğin bitişi + 0,1)
  const src = `out/bolum_${id}_cevapli.mp4`, dst = `out/bolum_${id}.mp4`;
  if (!fs.existsSync(src)) fs.copyFileSync(dst, src);
  const f = `[0:v]trim=0:${tc},setpts=PTS-STARTPTS[v0];[0:v]trim=start=${te},setpts=PTS-STARTPTS[v1];` +
    `[0:a]atrim=0:${tc},asetpts=PTS-STARTPTS,afade=t=out:st=${(tc - 0.3).toFixed(3)}:d=0.3[a0];` +
    `[0:a]atrim=start=${te},asetpts=PTS-STARTPTS,afade=t=in:d=0.2[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]`;
  const r = spawnSync(ff, ['-v', 'error', '-y', '-i', src, '-filter_complex', f, '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(id, r.stderr); process.exitCode = 1; continue; }
  // açıklama: "cevap videonun sonunda" türü cümleler çıkar
  ep.caption = ep.caption.replace(/\s*(Cevap|Cevabı) videonun sonunda\.?/g, '').replace(/\n{3,}/g, '\n\n').trim();
  ep.cevapsiz = { kesim: tc, kart: te, tarih: '2026-11-20' };
  fs.writeFileSync(`bolumler/${id}.json`, JSON.stringify(ep, null, 1) + '\n');
  console.log(`${id}: ${tc} sn'de kesildi, takip kartı ${te} sn'den; yeni süre ≈ ${(tc + (tl.duration - te)).toFixed(1)} sn`);
}
