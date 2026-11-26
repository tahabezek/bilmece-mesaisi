// Yayın öncesi denetim (YAYIN_KURALLARI.md). İzleyicinin göreceği dosyaya, yani prebuilt/<id>.mp4'e bakar.
//   node tools/denetim.mjs 064-islak-not [065-zarflar …]        → otomatik kapılar + rapor + inceleme kareleri
//   node tools/denetim.mjs 064-islak-not --onayla "not"          → otomatik kapılar geçerse denetim mührü yazılır
// Rapor ve kareler: out/denetim/<id>.md, <id>_serit.png (saniyede 1 kare), <id>_kare0.png, <id>_son.png.
// Mühür bolumler/<id>.json içinde: { denetim: { surum, sha, tarih, not } }. tools/yayin.mjs yalnız mührü
// güncel kural sürümüyle ve aynı video dosyasıyla eşleşen bölümü kuyruğa alır.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import ff from 'ffmpeg-static';
import { staticServer, openBrowser } from './still.mjs';
import { KURAL_SURUM } from './kurallar.mjs';

const args = process.argv.slice(2);
const onayIdx = args.indexOf('--onayla');
const onayNot = onayIdx >= 0 ? (args[onayIdx + 1] && !args[onayIdx + 1].includes('-') ? args[onayIdx + 1] : '') : null;
const ids = args.filter((a, i) => !a.startsWith('--') && !(onayIdx >= 0 && i === onayIdx + 1));
const OUT = path.join('out', 'denetim');
fs.mkdirSync(OUT, { recursive: true });

const up = s => String(s).toLocaleUpperCase('tr-TR').replace(/[’'"“”.,;:!?()…\-–—]/g, ' ').replace(/\s+/g, ' ').trim();
// ekranda hiçbir zaman: cevap kapağı ("CEVAP: ASLA"), "Buldum!" (kesimden sonra gelmeli), eski "NEDEN?" sayacı
const GENEL_YASAK = [/^s*CEVAPs*:/i, /BULDUM/i, /^s*NEDENs*?s*$/i];
const YASAK_ACIKLAMA = [/cevap\s*(kapakta|videoda|videonun|yorumda|yorumlarda|:)/i, /cevab[ıi]\s*(kapakta|videonun|yorumda|yorumlarda)/i,
  /yorum(a|lara)?\s*yaz/i, /videonun sonunda/i, /zengin k[ıi]z/i];
const sha = f => createHash('sha1').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
const sure = f => { const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(spawnSync(ff, ['-hide_banner', '-i', f], { encoding: 'utf8' }).stderr); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : NaN; };

let srv, browser;
async function metinDokumu(id, araliklar) {
  srv ||= await staticServer(); browser ||= await openBrowser();
  const p = await browser.newPage();
  await p.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  const hatalar = []; p.on('pageerror', e => hatalar.push(e.message));
  await p.goto(`http://127.0.0.1:${srv.address().port}/engine/bolum.html?id=${id}&s=1`);
  await p.waitForFunction('window.__ready === true', { timeout: 60000, polling: 250 });
  await p.evaluate(() => {
    const P = CanvasRenderingContext2D.prototype;
    for (const fn of ['fillText', 'strokeText']) {
      const o = P[fn];
      P[fn] = function (s, x, y, ...r) {
        const m = this.getTransform(), px = parseFloat(/(\d+(?:\.\d+)?)px/.exec(this.font)?.[1] || 0) * Math.hypot(m.c, m.d);
        if (this.globalAlpha > 0.05 && String(s).trim()) window.__k.push([String(s), Math.round(px)]);
        return o.call(this, s, x, y, ...r);
      };
    }
  });
  const harita = new Map();   // metin → { t0, t1, px: oturmuş (en büyük) boy }
  for (const [a, b, kayma] of araliklar) {
    for (let t = a; t <= b + 1e-6; t += 0.1) {
      const k = await p.evaluate(t => { window.__k = []; window.renderFrame(t); return window.__k; }, t);
      for (const [s, px] of k) {
        const v = harita.get(s), tv = +(t + kayma).toFixed(1);
        if (!v) harita.set(s, { t0: tv, t1: tv, px }); else { v.t1 = tv; v.px = Math.max(v.px, px); }   // giriş animasyonundaki küçülme sayılmaz: oturmuş boyut
      }
    }
  }
  await p.close();
  return { harita, hatalar };
}

function kareler(id, mp4, d) {
  const o = n => path.join(OUT, `${id}_${n}.png`);
  spawnSync(ff, ['-v', 'error', '-y', '-i', mp4, '-vf', 'fps=1,scale=270:-2,tile=10x6:padding=4:color=0x1F2421', '-frames:v', '1', o('serit')]);
  spawnSync(ff, ['-v', 'error', '-y', '-ss', '0', '-i', mp4, '-vf', 'scale=540:-2', '-frames:v', '1', o('kare0')]);
  return [o('serit'), o('kare0')];
}

let toplamHata = 0;
for (const id of ids) {
  const rows = [], uyari = [];
  const ok = (ad, gecti, deger) => { rows.push(`${gecti ? '✅' : '❌'} ${ad}: ${deger}`); if (!gecti) toplamHata++; return gecti; };
  const jf = `bolumler/${id}.json`, ep = JSON.parse(fs.readFileSync(jf, 'utf8'));
  const tl = JSON.parse(fs.readFileSync(`assets/voice/${id}/timeline.json`, 'utf8'));
  const mp4 = `prebuilt/${id}.mp4`, outMp4 = `out/bolum_${id}.mp4`;
  const hataOnce = toplamHata;

  // 1. bölüm dosyası
  ok('yayın dışı değil', !ep.disabled, ep.disabled ? 'disabled' : 'açık');
  ok('cevap kapağı yok', !ep.kapak, ep.kapak ? `kapak: "${ep.kapak}"` : 'yok');
  ok('cevapsız kesim', !!ep.cevapsiz, ep.cevapsiz ? `kesim ${ep.cevapsiz.kesim} sn, kart ${ep.cevapsiz.kart} sn` : 'cevapsiz alanı yok: tools/cevapsiz.mjs çalışmamış');
  ok('sızıntı listesi', Array.isArray(ep.sizinti), Array.isArray(ep.sizinti) ? (ep.sizinti.length ? ep.sizinti.join(', ') : '(boş: kelime düzeyinde yasak yok, yalnız göz denetimi)') : 'yok: bölüm dosyasına "sizinti": [cevabı ele veren sözler] yazılmalı');
  ok('kart', ep.card?.length === 2 && ep.card.every(s => s.length <= 40), ep.card.map(s => s.length).join('+') + ' harf');
  if (ep.card.some(s => s.length > 34)) uyari.push(`kart satırı ${ep.card.map(s => s.length).join('+')} harf: 34'ü aşan satır ekranda 44 px'in altına küçülür`);
  ok('sayaç 10 sn', ep.cdSure === 10, String(ep.cdSure));
  const d3 = tl.lines.find(l => l.id === 'd3');
  ok('kesim Buldum!dan önce', ep.cevapsiz && ep.cevapsiz.kesim < d3.t0, ep.cevapsiz ? `kesim ${ep.cevapsiz.kesim} < Buldum ${d3.t0.toFixed(2)}` : '—');

  // 2. açıklama metni
  const cap = ep.caption || '';
  ok('açıklama "Zeka sorusu:" ile başlar', cap.startsWith('Zeka sorusu:'), cap.slice(0, 40));
  const capYasak = YASAK_ACIKLAMA.filter(r => r.test(cap)).map(String);
  ok('açıklamada cevap vaadi ya da yorum çağrısı yok', !capYasak.length, capYasak.length ? capYasak.join(' ') : 'temiz');
  const capSiz = (ep.sizinti || []).filter(s => up(cap).includes(up(s)));
  ok('açıklamada sızıntı yok', !capSiz.length, capSiz.length ? capSiz.join(', ') : 'temiz');
  ok('hashtag ≤ 5', (ep.hashtags || []).length <= 5 && ep.hashtags.every(h => /^#\S+$/.test(h)), (ep.hashtags || []).join(' '));

  // 3. video dosyası
  if (!ok('hazır video', fs.existsSync(mp4), mp4)) { console.log(`\n${id}\n  ` + rows.join('\n  ')); continue; }
  const h = sha(mp4);
  if (fs.existsSync(outMp4)) ok('prebuilt = son render', sha(outMp4) === h, sha(outMp4) === h ? h : `prebuilt ${h} ≠ out ${sha(outMp4)}: node tools/yayin.mjs --hazirla`);
  const d = sure(mp4), beklenen = ep.cevapsiz ? ep.cevapsiz.kesim + (tl.duration - ep.cevapsiz.kart) : NaN;
  ok('süre ≤ 60 ve kesilmiş sürüm', d <= 60 && Math.abs(d - beklenen) < 0.25, `${d.toFixed(2)} sn (beklenen ${beklenen.toFixed(2)})`);
  const lo = spawnSync(ff, ['-hide_banner', '-nostats', '-i', mp4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 27 }).stderr;
  const I = Number(/Integrated loudness:\s*\n\s*I:\s+(-?[\d.]+)/.exec(lo)?.[1]), TP = Number(/True peak:\s*\n\s*Peak:\s+(-?[\d.]+)/.exec(lo)?.[1]);
  ok('ses', Math.abs(I + 14) <= 1 && TP <= -1, `${I} LUFS, TP ${TP}`);
  const st = spawnSync(ff, ['-hide_banner', '-i', mp4, '-vf', 'scale=270:480,signalstats,metadata=print:key=lavfi.signalstats.YDIF', '-an', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).stderr;
  const sec = {}; for (const m of st.matchAll(/pts_time:([\d.]+)[\s\S]*?YDIF=([\d.]+)/g)) (sec[Math.floor(+m[1])] ||= []).push(+m[2]);
  const dur = Object.entries(sec).map(([s, a]) => [+s, a.reduce((x, y) => x + y, 0) / a.length]).filter(([, m]) => m < 0.1);
  ok('hareket', !dur.length, dur.length ? 'durgun: ' + dur.map(([s, m]) => `${s}(${m.toFixed(2)})`).join(' ') : 'her saniye ≥ 0,1');

  // 4. ekranda yazan her şey (izleyicinin gördüğü iki parça: 0 → kesim, takip kartı)
  const { harita, hatalar } = await metinDokumu(id, [[0, ep.cevapsiz.kesim, 0], [ep.cevapsiz.kart + 0.02, tl.duration - 0.05, ep.cevapsiz.kesim - ep.cevapsiz.kart]]);
  ok('sahne hatasız', !hatalar.length, hatalar.length ? hatalar.join(' | ') : 'konsol hatası yok');
  const ekranSiz = [];
  for (const [s, v] of harita) {
    for (const r of GENEL_YASAK) if (r.test(s)) ekranSiz.push(`"${s}" (${v.t0}–${v.t1} sn) ← ${r}`);
    for (const y of ep.sizinti || []) if (up(s).includes(up(y))) ekranSiz.push(`"${s}" (${v.t0}–${v.t1} sn) ← ${y}`);
  }
  ok('ekranda cevap ya da yasak söz yok', !ekranSiz.length, ekranSiz.length ? ekranSiz.join('; ') : `${harita.size} ayrı yazı tarandı, temiz`);
  const altyazilar = tl.lines.filter(l => l.t0 < ep.cevapsiz.kesim).map(l => l.id);
  const kucuk = [...harita].filter(([s, v]) => v.px < 40 && v.t1 - v.t0 >= 1 && /\p{L}{3,}/u.test(s));
  if (kucuk.length) uyari.push('40 px altı okunacak yazı: ' + kucuk.slice(0, 8).map(([s, v]) => `"${s.slice(0, 30)}" ${v.px} px`).join('; '));
  const [serit, kare0] = kareler(id, mp4, d);

  // rapor
  const md = [`# Denetim: ${id} (kural sürümü ${KURAL_SURUM}, ${new Date().toISOString().slice(0, 16)})`, '',
    `Video: \`${mp4}\` (${h}), ${d.toFixed(2)} sn. Kareler: \`${serit}\` (saniyede 1 kare, soldan sağa ve satır satır; 0'dan sayılan k. kare ≈ k + 0,5 sn), \`${kare0}\`.`, '',
    '## Otomatik kapılar', ...rows.map(r => '- ' + r), '', '## Uyarılar', ...(uyari.length ? uyari.map(u => '- ' + u) : ['- yok']), '',
    '## Açıklama metni', '```', cap, '', (ep.hashtags || []).join(' '), '```', '',
    `## Kesilmiş filmde söylenen replikler (${altyazilar.join(', ')})`, ...tl.lines.filter(l => l.t0 < ep.cevapsiz.kesim).map(l => `- ${l.t0.toFixed(1)} sn · ${l.id} · ${ep.voice.lines.find(v => v.id === l.id)?.text}`), '',
    '## Ekranda yazan her şey (metin · görünür olduğu aralık · oturmuş boyu)', '| metin | sn | px |', '|---|---|---|',
    ...[...harita].sort((a, b) => a[1].t0 - b[1].t0).map(([s, v]) => `| ${s.replace(/\|/g, '/')} | ${v.t0}–${v.t1} | ${v.px} |`)];
  fs.writeFileSync(path.join(OUT, `${id}.md`), md.join('\n') + '\n');

  const gecti = toplamHata === hataOnce;
  console.log(`\n${id}  ${gecti ? 'OTOMATİK KAPILAR GEÇTİ' : 'KALDI'}\n  ` + rows.join('\n  ') + (uyari.length ? '\n  ⚠️ ' + uyari.join('\n  ⚠️ ') : '') + `\n  rapor: ${path.join(OUT, id + '.md')}`);
  if (onayNot !== null) {
    if (!gecti) { console.log('  mühür YAZILMADI: önce ❌ kapılar düzelmeli'); continue; }
    ep.denetim = { surum: KURAL_SURUM, sha: h, tarih: new Date().toLocaleDateString('sv-SE'), not: onayNot || '' };
    fs.writeFileSync(jf, JSON.stringify(ep, null, 1) + '\n');
    console.log(`  🔒 denetim mührü yazıldı (sürüm ${KURAL_SURUM}, ${h})`);
  }
}
if (browser) await browser.close();
if (srv) srv.close();
process.exitCode = toplamHata ? 1 : 0;
