// Nesnel kapılar (teslimden önce): süre, "Buldum!" anı, ses seviyesi, hareketsizlik.
//   node tools/kapi.mjs 023-mum [024-uc-gun …]
// Kısa kalıp (research/analiz_2026-11-10.md): kart ≤ 2 satır,
// −14 LUFS ±1, true peak ≤ −1 dBTP, donma yok: saniyelik YDIF ortalaması ≥ 0,1 (onaylı v2 bölümleri 0,11–0,4 arası;
// donmuş kare ≈ 0,03). Sert sınırlar: süre ≤ 60 sn, Buldum ≤ 38 sn (hedef 40–55 sn / ≤ 35 sn).
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import ff from 'ffmpeg-static';

let fail = 0;
for (const id of process.argv.slice(2)) {
  const ep = JSON.parse(fs.readFileSync(`bolumler/${id}.json`, 'utf8'));
  const tl = JSON.parse(fs.readFileSync(`assets/voice/${id}/timeline.json`, 'utf8'));
  const mp4 = fs.existsSync(`out/bolum_${id}.mp4`) ? `out/bolum_${id}.mp4` : `prebuilt/${id}.mp4`, rows = [];
  const ok = (name, pass, val) => { rows.push(`${pass ? '✅' : '❌'} ${name}: ${val}`); if (!pass) fail++; };
  const d3 = tl.lines.find(l => l.id === 'd3');
  // (21 Kas) cevapsız tasarım: video "Buldum!"dan önce kesilir (tools/cevapsiz.mjs), yayınlanan süre = kesim + takip kartı.
  // Kurulum acelesiz anlatılsın diye "Buldum" sınırı 50 sn'ye çıkar; süre kapısı kesilmiş sürüme uygulanır.
  const cvp = !!ep.cevapsizTasarim, son = tl.lines[tl.lines.length - 1];
  const sure = cvp ? (d3.t0 - 0.12) + (tl.duration - (son.t1 + 0.1)) : tl.duration;
  ok('süre', sure <= 60, sure.toFixed(1) + ' sn' + (cvp ? ' (cevapsız kesim)' : ''));
  const bl = cvp ? 50 : 38 + ((ep.cdSure || 5) - 5);   // (16 Kas) uzun sayaçlı bölümde sınır sayaç farkı kadar kayar
  ok('Buldum', d3.t0 <= bl, d3.t0.toFixed(1) + ' sn (sınır ' + bl + ')');
  ok('kart', ep.card.length <= 2 && ep.card.every(s => s.length <= 40), ep.card.map(s => s.length).join('+') + ' harf');
  if (fs.existsSync(mp4)) {
    const lo = spawnSync(ff, ['-hide_banner', '-nostats', '-i', mp4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 27 }).stderr;
    const I = Number(/Integrated loudness:\s*\n\s*I:\s+(-?[\d.]+)/.exec(lo)?.[1]);
    const TP = Number(/True peak:\s*\n\s*Peak:\s+(-?[\d.]+)/.exec(lo)?.[1]);
    ok('ses', Math.abs(I + 14) <= 1 && TP <= -1, `${I} LUFS, TP ${TP}`);
    const st = spawnSync(ff, ['-hide_banner', '-i', mp4, '-vf', 'scale=270:480,signalstats,metadata=print:key=lavfi.signalstats.YDIF', '-an', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).stderr;
    const yd = [...st.matchAll(/pts_time:([\d.]+)[\s\S]*?YDIF=([\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])]);
    const sec = {}; for (const [t, v] of yd) (sec[Math.floor(t)] ||= []).push(v);
    const low = Object.entries(sec).map(([s, a]) => [Number(s), a.reduce((x, y) => x + y, 0) / a.length]).filter(([, m]) => m < 0.1);
    ok('hareket', low.length === 0, low.length ? 'durgun saniyeler ' + low.map(([s, m]) => `${s}(${m.toFixed(2)})`).join(' ') : 'donma yok (her saniye ≥ 0,1)');
  } else rows.push('… video yok (render bekliyor)');
  console.log(`\n${id}\n  ` + rows.join('\n  '));
}
process.exitCode = fail ? 1 : 0;
