// Bölüm sesi: replikler ölçülmüş yerlerine konur (ses saattir), müzik yatağı ve efektler aynı zaman çizelgesinden
// (engine/zaman.js) üretilir. Kanalın imza müziği: Re majör, 120 bpm (vuruş = 15 kare), I–vi–IV–V döngüsü,
// pizzicato bas + marimba + fırça. Müzik hiç kesilmez; düşünme bölümünde saat tik-takına iner, "Buldum!"da tek
// vuruşla (impact) geri gelir. Filmde tek riser, tek impact. Ses −14 LUFS, true peak ≤ −1 dBTP (bitmiş dosyada ölçülür).
//   node tools/ses.mjs bolumler/001-badana.json  → out/ses_<id>.mp3, assets/voice/<id>/mix.wav + timeline.json
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import { mulberry32 } from '../engine/core.js';
import { timeline, at } from '../engine/zaman.js';

const SR = 48000;
const ep = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const vdir = path.join('assets', 'voice', ep.id);
const tl = timeline(ep, JSON.parse(fs.readFileSync(path.join(vdir, 'words.json'), 'utf8')));
const T = e => at(tl, e), mus = ep.music || {};
// kapanış jingle'ı (ep.outro = assets/muzik/jingle.json ya da OUTRO ortam değişkeni): müzik yatağının son akoru yerine,
// CTA'dan sonraki ilk ölçü başında çalar; takip kartı jingle bitene kadar uzar, sözler kartta kelime kelime yanar.
const OUTRO_FILE = process.env.OUTRO || ep.outro;
const OUT = OUTRO_FILE ? JSON.parse(fs.readFileSync(OUTRO_FILE, 'utf8')) : null;
if (OUT) {
  const bar0 = tl.beat * 4, e0 = mus.end ? T(mus.end) : tl.duration - 2;
  OUT.endT = e0; OUT.t0 = Math.ceil((e0 + 0.05) / bar0) * bar0;
  tl.duration = Math.round((OUT.t0 + OUT.len + 0.2) * 1000) / 1000;
}
const D = tl.duration, N = Math.ceil(D * SR), beat = tl.beat, bar = beat * 4;

function decode(file) {
  const r = spawnSync(ffmpegPath, ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
  if (r.status) throw new Error('ffmpeg çözme: ' + file);
  return new Float32Array(r.stdout.buffer.slice(r.stdout.byteOffset, r.stdout.byteOffset + r.stdout.length));
}

const VO = new Float32Array(N), Ml = new Float32Array(N), Mr = new Float32Array(N), Fl = new Float32Array(N), Fr = new Float32Array(N);
const rnd = mulberry32(ep.num * 977 + 13), noise = () => rnd() * 2 - 1;
const addM = (i, l, r = l) => { if (i >= 0 && i < N) { Ml[i] += l; Mr[i] += r; } };
const addF = (i, l, r = l) => { if (i >= 0 && i < N) { Fl[i] += l; Fr[i] += r; } };
const pre = 2 / 30;   // efekt, görsel oturmadan 2 kare önce başlar

// ── replikler (her biri −3 dBFS tepeye) ──
for (const ln of tl.lines) {
  const x = decode(path.join(vdir, ln.id + '.mp3'));
  let pk = 1e-9; for (const v of x) pk = Math.max(pk, Math.abs(v));
  const g = 0.708 / pk, i0 = Math.round(ln.t0 * SR);
  for (let i = 0; i < x.length; i++) if (i0 + i < N) VO[i0 + i] += x[i] * g;
}

// ── çalgılar ──
const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);   // MIDI → Hz
// pizzicato bas: Karplus-Strong (tohumlu gürültüyle, deterministik)
function pluck(t0, midi, amp, len = 0.55, pan = 0) {
  const f = NOTE(midi), P = Math.max(2, Math.round(SR / f)), buf = new Float32Array(P);
  let lp = 0; for (let i = 0; i < P; i++) { lp += 0.5 * (noise() - lp); buf[i] = lp; }
  const n0 = Math.round(t0 * SR), L = Math.round(len * SR);
  for (let n = 0, i = 0; n < L; n++, i = (i + 1) % P) {
    const nx = buf[(i + 1) % P]; buf[i] = 0.4985 * (buf[i] + nx);
    const env = Math.min(1, (L - n) / (0.04 * SR)), v = buf[i] * amp * env * 2.2;
    addM(n0 + n, v * (1 - pan), v * (1 + pan));
  }
}
function marimba(t0, midi, amp, pan = 0) {
  const f = NOTE(midi), n0 = Math.round(t0 * SR);
  for (let n = 0; n < 0.7 * SR; n++) {
    const t = n / SR, v = (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 7) + 0.28 * Math.sin(2 * Math.PI * f * 3.93 * t) * Math.exp(-t * 28)
      + (n < 96 ? noise() * 0.12 * (1 - n / 96) : 0)) * amp;
    addM(n0 + n, v * (1 - pan), v * (1 + pan));
  }
}
function kick(t0, amp) { let ph = 0; for (let n = 0; n < 0.3 * SR; n++) { const t = n / SR, f = 50 + 70 * Math.exp(-t * 32); ph += 2 * Math.PI * f / SR; addM(Math.round(t0 * SR) + n, Math.sin(ph) * Math.exp(-t * 12) * amp); } }
function hat(t0, amp) { let lp = 0; for (let n = 0; n < 0.05 * SR; n++) { const x = noise(); lp += 0.3 * (x - lp); const v = (x - lp) * Math.exp(-n / SR * 70) * amp; addM(Math.round(t0 * SR) + n, v * 0.8, v); } }
function brush(t0, amp) { let a = 0, b = 0; for (let n = 0; n < 0.16 * SR; n++) { const x = noise(); a += 0.35 * (x - a); b += 0.08 * (a - b); const v = (a - b) * Math.exp(-n / SR * 22) * amp; addM(Math.round(t0 * SR) + n, v, v * 0.9); } }
function pad(a, b, notes) {   // hafif akortsuz sinüs akoru, alçak geçiren süzgeçle; uçlarda 0,15 sn geçiş
  const n0 = Math.round(a * SR), n1 = Math.min(N, Math.round(b * SR)), al = 1 - Math.exp(-2 * Math.PI * 1200 / SR);
  let lp = 0;
  for (let n = n0; n < n1; n++) {
    const t = n / SR, e = Math.min(1, (t - a) / 0.15, (b - t) / 0.15);
    let v = 0; for (const m of notes) { const f = NOTE(m); v += Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.003 * 2 * t); }
    lp += al * (v - lp); addM(n, lp * e * 0.05, lp * e * 0.047);
  }
}
function keys(t0, midi, amp, len = 2) {   // yumuşak elektrik piyano: sinüs + oktav, yavaş sönüm, hafif tremolo
  const f = NOTE(midi), n0 = Math.round(t0 * SR), L = Math.round(len * SR);
  for (let n = 0; n < L; n++) {
    const t = n / SR, env = Math.min(1, t / 0.02) * Math.exp(-t * 1.1) * Math.min(1, (L - n) / (0.25 * SR));
    const v = (Math.sin(2 * Math.PI * f * t) + 0.22 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t * 3)) * env * amp * (1 + 0.07 * Math.sin(2 * Math.PI * 4.5 * t));
    addM(n0 + n, v * 0.96, v);
  }
}
function tick(t0, f, amp) { for (let n = 0; n < 0.05 * SR; n++) { const t = n / SR; addM(Math.round(t0 * SR) + n, (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 110) + noise() * Math.exp(-t * 400) * 0.6) * amp); } }

// Re majör: D – Bm – G – A. Bas yürüyüşü ve marimba figürü akor başına.
const CH = [
  { bass: [38, 45, 42, 45], mel: [74, 78, 81, 78, 76, 74, 76, 78] },   // D
  { bass: [35, 42, 38, 42], mel: [74, 78, 74, 71, 73, 74, 78, 81] },   // Bm
  { bass: [31, 38, 35, 38], mel: [79, 78, 74, 71, 74, 78, 79, 81] },   // G
  { bass: [33, 40, 37, 40], mel: [76, 73, 69, 73, 76, 79, 78, 76] },   // A
];
const span = k => (mus[k] ? [T(mus[k][0]), T(mus[k][1])] : [-1, -1]);
const [th0, th1] = span('think'), endT = mus.end ? T(mus.end) : OUT ? OUT.endT : D - 2;
const inThink = t => t >= th0 && t < th1;
// son akor: konuşma bittikten sonraki ilk ölçü başına oturur ve sona kadar çınlar
const lastBar = Math.ceil((endT + 0.05) / bar) * bar;
// üslup: 'marimba' (ilk sürüm), 'yumusak' (davulsuz klavye yatağı), 'yok' (yalnız ortam sesi). MUZIK ortam değişkeni geçersiz kılar.
const STYLE = process.env.MUZIK || mus.style || 'marimba';
if (STYLE === 'yumusak') {
  for (let b = 0; b * bar < D; b++) {
    const t = b * bar, c = CH[b % 4];
    if (t >= lastBar) break;
    const after = mus.hit && t >= T(mus.hit);
    for (const m of [c.bass[0] + 24, c.bass[2] + 24, c.bass[1] + 24]) keys(t, m, after ? 0.045 : 0.038, bar + 0.4);
    keys(t + bar / 2, c.bass[1] + 36, 0.019, bar / 2 + 0.3);
    keys(t, c.bass[0], 0.095, bar);   // derin bas
  }
} else if (STYLE === 'yok') {
  let a = 0, b2 = 0;   // ofis ortam sesi: çok kısık, kahverengi gürültü
  for (let n = 0; n < N; n++) { a += 0.02 * (noise() - a); b2 += 0.05 * (a - b2); addM(n, b2 * 0.05, b2 * 0.048); }
}
for (let b = 0; STYLE === 'marimba' && b * beat < D; b++) {
  const t = b * beat, c = CH[Math.floor(b / 4) % 4], k = b % 4;
  if (t >= lastBar) break;
  if (inThink(t)) {   // düşünme: yumuşak akor yatağı (müzik hiç susmasın) + bas 1. ve 3. vuruşta + saat tik-tak
    if (k === 0 || !inThink(t - beat)) pad(t, Math.min((Math.floor(b / 4) + 1) * bar, th1) + 0.15, [c.bass[0] + 12, c.bass[2] + 12, c.bass[1] + 12]);
    if (k % 2 === 0) pluck(t, c.bass[k], 0.3, 1.1);
    tick(t, k % 2 ? 1400 : 2100, 0.16);
    continue;
  }
  const after = mus.hit && t >= T(mus.hit);   // "Buldum!"dan sonra melodi bir oktav parlar
  pluck(t, c.bass[k], 0.3);
  kick(t, k === 0 ? 0.28 : k === 2 ? 0.18 : 0);
  if (k === 1 || k === 3) brush(t, 0.22);
  hat(t + beat / 2, 0.07);
  for (const h of [0, 1]) {
    const m = c.mel[k * 2 + h], tt = t + h * beat / 2;
    if ((b + h) % 3 === 2 && !after) continue;   // figürde boşluklar: konuşmayla yarışmasın
    marimba(tt, m + (after ? 12 : 0), after ? 0.05 : 0.06, Math.sin(b * 1.7 + h) * 0.35);
  }
}
// kapanış: Re majör akoru (marimba tremolo + bas)
if (OUT) {   // yatak jingle başlarken 0,15 sn'de susar; jingle efekt kanalına (kısılmaz) konuşmayla aynı tepe seviyesinde
  const n0 = Math.round(OUT.t0 * SR), f = Math.round(0.15 * SR);
  for (let n = n0 - f; n < N; n++) if (n >= 0) { const g = Math.max(0, (n0 - n) / f); Ml[n] *= g; Mr[n] *= g; }
  const r = spawnSync(ffmpegPath, ['-v', 'error', '-i', OUT.file, '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
  if (r.status) throw new Error('ffmpeg çözme: ' + OUT.file);
  const J = new Float32Array(r.stdout.buffer.slice(r.stdout.byteOffset, r.stdout.byteOffset + r.stdout.length));
  let pk = 1e-9; for (const v of J) pk = Math.max(pk, Math.abs(v));
  const g = (Number(process.env.OUTRO_GAIN) || 1.0) / pk;
  for (let i = 0; i < J.length / 2; i++) addF(n0 + i, J[2 * i] * g, J[2 * i + 1] * g);
} else if (lastBar < D && STYLE === 'yumusak') {
  for (const m of [62, 66, 69, 74]) keys(lastBar, m, 0.03, D - lastBar);
  keys(lastBar, 38, 0.07, D - lastBar);
} else if (lastBar < D && STYLE === 'marimba') {
  pluck(lastBar, 38, 0.38, D - lastBar); pluck(lastBar, 26, 0.3, D - lastBar);
  for (let t = lastBar, i = 0; t < D - 0.3; t += 1 / 14, i++) marimba(t, [74, 78, 81, 86][i % 4], 0.045 * Math.max(0.2, 1 - (t - lastBar) / (D - lastBar)), (i % 2 ? 0.3 : -0.3));
}

// ── efektler ──
const FX = {
  pop(t0) { let ph = 0; for (let n = 0; n < 0.09 * SR; n++) { const t = n / SR, f = 520 + 900 * (t / 0.09); ph += 2 * Math.PI * f / SR; addF(Math.round((t0 - pre) * SR) + n, Math.sin(ph) * Math.sin(Math.PI * t / 0.09) * 0.16); } },
  drop(t0) {   // harf düşer: aşağı ıslık + küçük tok
    let ph = 0; const n0 = Math.round((t0 - 0.3) * SR);
    for (let n = 0; n < 0.3 * SR; n++) { const u = n / (0.3 * SR), f = 1500 * Math.pow(0.3, u); ph += 2 * Math.PI * f / SR; addF(n0 + n, Math.sin(ph) * Math.sin(Math.PI * u) * 0.07); }
    for (let n = 0; n < 0.12 * SR; n++) { const t = n / SR; addF(Math.round(t0 * SR) + n, (Math.sin(2 * Math.PI * 150 * t) * 0.6 + noise() * 0.3) * Math.exp(-t * 40) * 0.25); }
  },
  knock(t0) { let lp = 0; for (let n = 0; n < 0.14 * SR; n++) { const t = n / SR; lp += 0.2 * (noise() - lp); addF(Math.round((t0 - 0.01) * SR) + n, (Math.sin(2 * Math.PI * 170 * t) * Math.exp(-t * 38) + lp * 2.5 * Math.exp(-t * 70)) * 0.32); } },
  swish(t0, len = 0.32) { let lp = 0; const n0 = Math.round((t0 - len * 0.7) * SR), L = Math.round(len * SR); for (let n = 0; n < L; n++) { const u = n / L, fc = 500 + 3500 * Math.sin(Math.PI * u); lp += (1 - Math.exp(-2 * Math.PI * fc / SR)) * (noise() - lp); const e = Math.pow(Math.sin(Math.PI * u), 2) * 0.28; addF(n0 + n, lp * e * (1.2 - u), lp * e * (0.2 + u)); } },
  stamp(t0) { let lp = 0; for (let n = 0; n < 0.25 * SR; n++) { const t = n / SR; lp += 0.05 * (noise() - lp); addF(Math.round((t0 - pre) * SR) + n, (Math.sin(2 * Math.PI * 90 * t) * Math.exp(-t * 25) + lp * 4 * Math.exp(-t * 30)) * 0.42); } },
  buzz(t0) { for (let n = 0; n < 0.32 * SR; n++) { const t = n / SR, s = Math.sign(Math.sin(2 * Math.PI * 98 * t)) + Math.sign(Math.sin(2 * Math.PI * 104 * t)); addF(Math.round((t0 - pre) * SR) + n, s * 0.035 * Math.min(1, (0.32 - t) / 0.03)); } },
  zip([a, b]) { const n0 = Math.round(a * SR), n1 = Math.round(b * SR); let lp = 0; for (let n = n0; n < n1; n++) { const t = (n - n0) / SR; lp += 0.3 * (noise() - lp); addF(n, lp * (0.5 + 0.5 * Math.sign(Math.sin(2 * Math.PI * 38 * t))) * 0.2 * Math.min(1, (n1 - n) / (0.02 * SR))); } },
  ding(t0) { for (const [f, d] of [[1318.5, 0], [1046.5, 0.32]]) for (let n = 0; n < 0.9 * SR; n++) { const t = n / SR; addF(Math.round((t0 + d) * SR) + n, (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 6)) * Math.exp(-t * 4) * 0.07); } },
  horn(t0) {   // kâğıt düdük: vızıltılı testere, yükselen perde + titreme (doğum günü)
    let ph = 0, lp = 0; const n0 = Math.round(t0 * SR), L = Math.round(0.55 * SR);
    for (let n = 0; n < L; n++) { const t = n / SR, f = 520 + 140 * Math.min(1, t / 0.12) + 14 * Math.sin(2 * Math.PI * 9 * t); ph += 2 * Math.PI * f / SR; lp += 0.25 * ((((ph / Math.PI) % 2) - 1) - lp); addF(n0 + n, lp * Math.min(1, t / 0.02) * Math.min(1, (0.55 - t) / 0.08) * 0.22); }
  },
  womp(t0) {   // yenilgi: inen trombon (dört nota, sonuncusu titrek)
    let ph = 0; [[57, 0.26], [56, 0.26], [55, 0.26], [54, 0.85]].reduce((s, [m, len], i) => {
      const n0 = Math.round(s * SR), L = Math.round(len * SR); let lp = 0;
      for (let n = 0; n < L; n++) { const t = n / SR, f = NOTE(m) * (1 + (i === 3 ? 0.012 * Math.sin(2 * Math.PI * 6 * t) : 0)); ph += 2 * Math.PI * f / SR; lp += 0.06 * ((((ph / Math.PI) % 2) - 1) - lp); addF(n0 + n, lp * Math.min(1, t / 0.02) * Math.min(1, (len - t) / 0.06) * 0.32); }
      return s + len;
    }, t0);
  },
};
for (const [k, e] of ep.sfx || []) {
  if (Array.isArray(e)) FX[k](e.map(T)); else FX[k](T(e));
}
if (ep.countdown) {
  const c1 = T(ep.countdown);
  for (let k = 5; k >= 1; k--) {
    const t0 = c1 - k, f = k <= 3 ? 2700 : 2000, amp = k <= 3 ? 0.3 : 0.24;
    for (let n = 0; n < 0.07 * SR; n++) { const t = n / SR; addF(Math.round(t0 * SR) + n, (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 70) + noise() * Math.exp(-t * 350) * 0.5) * amp); }
  }
}
// tek riser: ipucu repliği boyunca yükselir, "Buldum!"un üstünde biter
if (mus.riser) {
  const [a, b] = span('riser'); let lp = 0, ph = 0; const n0 = Math.round(a * SR), n1 = Math.round(b * SR);
  for (let n = n0; n < n1; n++) { const u = (n - n0) / (n1 - n0), fc = 300 * Math.pow(16, u); lp += (1 - Math.exp(-2 * Math.PI * fc / SR)) * (noise() - lp); ph += 2 * Math.PI * NOTE(57) * Math.pow(2, u) / SR; addF(n, (lp * 0.8 + Math.sin(ph) * 0.12) * Math.pow(u, 2.2) * 0.24); }
}
// tek impact: "Buldum!" — Re majör marimba darbesi + derin vuruş + zil
if (mus.hit) {
  const t0 = T(mus.hit), n0 = Math.round((t0 - pre) * SR); let ph = 0, lp = 0;
  for (let n = 0; n < 1.6 * SR; n++) { const t = n / SR, f = 36 + 60 * Math.exp(-t * 7); ph += 2 * Math.PI * f / SR; lp += 0.5 * (noise() - lp); addF(n0 + n, (Math.sin(ph) * Math.exp(-t * 3) * 0.55 + (noise() - lp) * Math.exp(-t * 3.2) * 0.12)); }
  if (STYLE === 'marimba') for (const m of [62, 66, 69, 74]) marimba(t0 - pre, m + 12, 0.08);
  else for (const m of [62, 66, 69, 74]) keys(t0 - pre, m + 12, 0.05, 1.6);
}

// ── miks: müzik konuşmanın altında yaklaşık −10 dB kısılır (yan zincir), efektler sabit ──
let env = 0; const att = 1 - Math.exp(-1 / (0.04 * SR)), rel = 1 - Math.exp(-1 / (0.4 * SR));
const L = new Float32Array(N), R = new Float32Array(N);
const fadeOut = Math.round(0.35 * SR);
let sv = 1e-12, sm = 1e-12, ns = 0;
for (let i = 0; i < N; i++) {
  const x = Math.abs(VO[i]); env += (x > env ? att : rel) * (x - env);
  const duck = STYLE === 'marimba' ? 0.75 * (1 - 0.68 * Math.min(1, env * 7)) : 0.7 * (1 - 0.8 * Math.min(1, env * 7)), tail = Math.min(1, (N - i) / fadeOut);
  L[i] = (VO[i] + Ml[i] * duck + Fl[i]) * tail; R[i] = (VO[i] + Mr[i] * duck + Fr[i]) * tail;
  if (env > 0.05) { sv += VO[i] * VO[i]; sm += (Ml[i] * duck) ** 2; ns++; }
}
const bedDb = 10 * Math.log10(sm / sv);   // konuşma sırasında müzik yatağı konuşmaya göre (dB)
const inter = new Float32Array(N * 2); for (let i = 0; i < N; i++) { inter[2 * i] = L[i]; inter[2 * i + 1] = R[i]; }
const raw = Buffer.from(inter.buffer);

// ── seviye: ölç → sabit kazanç → iki aşamalı sınırlayıcı → bitmiş dosyada yeniden ölç ──
const loud = (args, input) => {
  const r = spawnSync(ffmpegPath, [...args, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { input, maxBuffer: 1 << 28 });
  const s = r.stderr.toString(), I = /I:\s+(-?[\d.]+) LUFS/.exec(s.slice(s.lastIndexOf('Summary')))[1], P = /Peak:\s+(-?[\d.]+) dBFS/.exec(s.slice(s.lastIndexOf('Summary')))[1];
  return { I: Number(I), TP: Number(P) };
};
const IN = ['-v', 'info', '-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', '-'];
const m0 = loud(IN, raw);
const gain = -14 - m0.I;
fs.mkdirSync('out', { recursive: true });
const outFile = path.join('out', process.env.MUZIK ? `ses_${ep.id}_${process.env.MUZIK}.mp3` : `ses_${ep.id}.mp3`), wavFile = path.join(vdir, 'mix.wav');
const chain = `volume=${gain.toFixed(2)}dB,alimiter=limit=0.82:attack=2:release=60:level=false,alimiter=limit=0.84:attack=1:release=40:level=false`;
let r = spawnSync(ffmpegPath, ['-v', 'error', '-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', '-', '-af', chain, '-y', wavFile], { input: raw, maxBuffer: 1 << 28 });
if (r.status) throw new Error(r.stderr.toString());
r = spawnSync(ffmpegPath, ['-v', 'error', '-i', wavFile, '-c:a', 'libmp3lame', '-b:a', '256k', '-y', outFile]);
if (r.status) throw new Error(r.stderr.toString());
const m1 = loud(['-v', 'info', '-i', outFile]);

fs.writeFileSync(path.join(vdir, 'timeline.json'), JSON.stringify({ id: ep.id, duration: D, beat, ...(OUT ? { outro: { t0: OUT.t0, lines: OUT.lines } } : {}), lines: tl.lines.map(({ id, who, text, t0, t1, words }) => ({ id, who, text, t0, t1, words })) }, null, 1));
// kontrol: konuşma hızı (≤ 3,5 kelime/sn), en uzun konuşmasız ara
const rate = tl.lines.map(l => [l.id, l.words.length / (l.t1 - l.t0)]).filter(([, v]) => v > 3.5);
let gapMax = 0; tl.lines.forEach((l, i) => i && (gapMax = Math.max(gapMax, l.t0 - tl.lines[i - 1].t1)));
console.log(`${ep.id}: ${D.toFixed(2)} sn · ${tl.lines.length} replik · ölçülen ${m1.I} LUFS, tepe ${m1.TP} dBFS (true peak) · en uzun ara ${gapMax.toFixed(2)} sn · konuşma altında müzik ${bedDb.toFixed(1)} dB` + (rate.length ? ` · HIZLI: ${rate.map(([k, v]) => k + ' ' + v.toFixed(1)).join(', ')}` : ''));
for (const l of tl.lines) console.log(`  ${l.t0.toFixed(2).padStart(6)}–${l.t1.toFixed(2).padStart(6)}  ${l.who.padEnd(6)} ${l.text}`);
