// Bölüm sahnelerinin ortak araçları: kamera, poz izleri, dudak hareketi, konuşma balonu, ikonlar.
// Hepsi t'nin saf fonksiyonu; zaman bilgisi engine/zaman.js çizelgesinden gelir (ses saattir).
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { CARDS, EXPR, mixExpr, drawCharacter, basePose, INK } from './cast.js';
import { PAL, LW, room, counter } from './office.js';

export const UI = [320, 30], CAM = [170, 26], BIG = [120, 24];   // yay ön ayarları (sertlik/sönüm)

// Kamera: anahtarlar [t, zoom, cx, cy, 'cut'?]. Her hedef değişimi bir yay (kapalı form), zoom log uzayında.
// 'cut' anahtarı önceki yayları sıfırlar: o andan itibaren değer kesin olarak o anahtardır.
// Kayma: her anahtardan sonra kamera saniyede `drift` (log zoom) yaklaşır, en fazla 7 sn; sonraki anahtarda bu
// birikim aynı kamera yayıyla geri alınır, yeni kayma sıfırdan başlar (kesintisiz, ölü kare yok).
export function camAt(keys, t, drift = 0.018) {
  let i0 = 0;
  for (let i = 0; i < keys.length; i++) if (keys[i][0] <= t && (i === 0 || keys[i][4] === 'cut')) i0 = i;
  const k0 = keys[i0], v = [Math.log(k0[1]), k0[2], k0[3]];
  for (let i = i0; i < keys.length && keys[i][0] <= t; i++) {
    const b = keys[i], nx = keys[i + 1];
    if (i > i0) {
      const a = keys[i - 1], u = spring(t - b[0], b[5]?.[0] ?? CAM[0], b[5]?.[1] ?? CAM[1]);
      v[0] += (Math.log(b[1]) - Math.log(a[1])) * u; v[1] += (b[2] - a[2]) * u; v[2] += (b[3] - a[3]) * u;
    }
    const end = nx && nx[4] !== 'cut' ? nx[0] : Infinity;
    const acc = drift * Math.min(7, Math.min(t, end) - b[0]);
    v[0] += t < end ? acc : acc * (1 - spring(t - end, CAM[0], CAM[1]));
  }
  return { zoom: Math.exp(v[0]), cx: v[1], cy: v[2] };
}
export function applyCam(ctx, cam, W = 1080, H = 1920) {
  ctx.translate(W / 2, H / 2); ctx.scale(cam.zoom, cam.zoom); ctx.translate(-cam.cx, -cam.cy);
}
export const toScreen = (cam, [x, y], W = 1080, H = 1920) => [(x - cam.cx) * cam.zoom + W / 2, (y - cam.cy) * cam.zoom + H / 2];

// Poz izi: anahtarlar [t, kısmi poz, süre=0.35, eğri=ease.state]. Her anahtar o ana kadarki poza karışır.
function lerpAny(a, b, u, k) {
  if (k === 'expr') return mixExpr(a, b, u);
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * u;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((x, i) => lerpAny(x, b[i], u));
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const o = { ...a };
    for (const key of Object.keys(b)) o[key] = key in a ? lerpAny(a[key], b[key], u, key) : b[key];
    return o;
  }
  return u < 0.5 ? a : b;
}
export function poseAt(card, base, keys, t) {
  let p = structuredClone(base);
  p.expr = typeof p.expr === 'string' ? { ...EXPR[p.expr] } : p.expr;
  for (const [tk, part, d = 0.35, curve = ease.state] of keys) {
    if (tk > t) break;
    const tgt = lerpAny(p, part, 1);
    p = lerpAny(p, tgt, d > 0 ? curve(seg(t, tk, d)) : 1);
  }
  return p;
}
export function charBase(key, o) {
  const p = basePose(CARDS[key], o.view || 'front');
  for (const k of Object.keys(o)) p[k] = o[k] && typeof o[k] === 'object' && !Array.isArray(o[k]) && typeof p[k] === 'object' ? { ...p[k], ...o[k] } : o[k];
  return p;
}
// karakteri çizer; dünya koordinatında el ve baş konumlarını döndürür
export function drawChar(ctx, key, p, t) {
  const sk = drawCharacter(ctx, CARDS[key], p, t);
  const fx = (p.view === 'side' ? p.facing : 1) * p.s;
  const w = q => [p.x + q[0] * fx, p.y + q[1] * p.s];
  return { handL: w(sk.handL), handR: w(sk.handR), head: w(sk.head) };
}

// Dudak: karakterin repliği sürerken kelime içindeki hece fazından ağız açıklığı (0..1)
const VOW = /[aeıioöuüâî]/gi;
export function talkAt(tl, who, t) {
  for (const l of tl.lines) {
    if (l.who !== who || t < l.t0 - 0.02 || t > l.t1) continue;
    for (const w of l.words) {
      if (t < w.t0 || t >= w.t1) continue;
      const syl = Math.max(1, (w.w.match(VOW) || []).length), ph = (t - w.t0) / (w.t1 - w.t0) * syl;
      return 0.25 + 0.75 * Math.abs(Math.sin(Math.PI * ph));
    }
    return 0;
  }
  return 0;
}
// Konuşan kim: o anki satır (balon için). Kısa satır en az 1,25 sn ekranda kalır, sonraki satır gelince kesilir.
// Uzun replik (> 60 harf) balonda cümle cümle gösterilir; her parça kendi ilk kelimesinin ölçülmüş anında gelir.
export function captionAt(tl, t) {
  const L = tl.lines;
  for (let i = L.length - 1; i >= 0; i--) {
    const l = L[i], end = Math.min(Math.max(l.t1 + 0.3, l.t0 + 1.25), (L[i + 1]?.t0 ?? 1e9) - 0.04);
    if (t < l.t0 - 0.04 || t >= end) continue;
    const parts = chunks(l);
    let k = 0; while (k + 1 < parts.length && t >= parts[k + 1].t0 - 0.04) k++;
    const p = parts[k], pEnd = k + 1 < parts.length ? parts[k + 1].t0 - 0.04 : end;
    return { line: l, text: p.text, age: t - (p.t0 - 0.04), left: pEnd - t };
  }
  return null;
}
function chunks(l) {
  const tw = l.text.split(' ');
  if (l.text.length <= 60 || tw.length !== l.words.length) return [{ text: l.text, t0: l.t0 }];
  const out = []; let cur = null;
  tw.forEach((w, i) => {
    if (!cur) cur = { words: [], t0: i ? l.words[i].t0 : l.t0 };
    cur.words.push(w);
    if (/[.?!…]["”»]?$/.test(w) || i === tw.length - 1) { out.push(cur); cur = null; }
  });
  // kısa cümleler birleşir (ör. "Kasap? Asap…" tek başına kalmasın)
  const merged = [];
  for (const c of out) {
    const last = merged[merged.length - 1];
    if (last && (last.words.join(' ').length < 16 || (last.words.join(' ') + ' ' + c.words.join(' ')).length <= 48)) last.words.push(...c.words);
    else merged.push({ ...c, words: [...c.words] });
  }
  return merged.map(c => ({ text: c.words.join(' '), t0: c.t0 }));
}

// metni genişliğe göre satırlara böl (en fazla 3)
export function wrap(ctx, s, size, weight, maxW) {
  ctx.font = `${weight} ${size}px Rubik`;
  const out = []; let cur = '';
  for (const w of s.split(' ')) {
    const nx = cur ? cur + ' ' + w : w;
    if (ctx.measureText(nx).width > maxW && cur) { out.push(cur); cur = w; } else cur = nx;
  }
  if (cur) out.push(cur);
  if (out.length === 2) {   // iki satırı dengele: alt satırda tek kelime kalmasın
    const ws = s.split(' ');
    let best = out, bw = 1e9;
    for (let k = 1; k < ws.length; k++) {
      const a = ws.slice(0, k).join(' '), b = ws.slice(k).join(' '), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
      if (m <= maxW && m < bw) { bw = m; best = [a, b]; }
    }
    return best;
  }
  return out;
}

// Konuşma balonu (ekran uzayı): üst kenarı y, yatay merkezi cx; kuyruk konuşanın başına doğru (yukarı ya da aşağı)
const WHO_COL = { hikmet: PAL.mustard, defne: PAL.coral, necmi: '#7E8460', genc: PAL.teal };
export function caption(K, cap, { y, head, maxW = 820, size = 48 }) {
  if (!cap) return;
  const { ctx } = K, l = cap.line;
  const inU = UI ? spring(cap.age, UI[0], UI[1]) : 1, out = clamp01(cap.left / 0.12);
  const lines = wrap(ctx, cap.text ?? l.text, size, 700, maxW - 80);
  ctx.font = `700 ${size}px Rubik`;
  const w = Math.min(maxW, Math.max(...lines.map(s => ctx.measureText(s).width)) + 84), lh = size * 1.24, h = lines.length * lh + 46;
  const cx = Math.min(Math.max(head ? head[0] : 540, 90 + w / 2), 930 - w / 2);   // sağdaki 120 px platform düğmelerinin altı boş kalır
  const up = head && head[1] < y;   // kuyruk yukarıda mı
  ctx.save();
  ctx.globalAlpha = out;
  ctx.translate(cx, y + (up ? 0 : h)); ctx.scale(0.7 + 0.3 * inU, 0.7 + 0.3 * inU); ctx.translate(-cx, -(y + (up ? 0 : h)));
  const x = cx - w / 2;
  // kuyruk (iç seste düşünce balonu: iki daire)
  if (head) {
    const tx = Math.min(Math.max(head[0], x + 70), x + w - 70), by = up ? y + 4 : y + h - 4;
    const tipY = up ? Math.max(head[1] + 150, y - 120) : Math.min(head[1] - 150, y + h + 120), tipX = tx + (head[0] - tx) * 0.8;
    if (l.ic) { for (const [k, r] of [[0.35, 16], [0.75, 10]]) { ctx.beginPath(); ctx.arc(lerp(tx, tipX, k), lerp(by, tipY, k), r, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = LW * 0.8; ctx.strokeStyle = INK; ctx.stroke(); } }
    else { ctx.beginPath(); ctx.moveTo(tx - 26, by); ctx.lineTo(tipX, tipY); ctx.lineTo(tx + 26, by); ctx.closePath();
      ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); }
  }
  ctx.beginPath(); ctx.roundRect(x + 8, y + 10, w, h, 32); ctx.fillStyle = INK; ctx.fill();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 32); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = INK;
  if (l.ic) ctx.setLineDash([16, 10]); ctx.stroke(); ctx.setLineDash([]);
  if (l.ic) { ctx.font = '900 30px Rubik'; const pw = ctx.measureText('içinden').width + 36; ctx.beginPath(); ctx.roundRect(x + 24, y - 24, pw, 44, 22); ctx.fillStyle = INK; ctx.fill(); K.text('içinden', x + 24 + pw / 2, y + 8, 30, PAL.paper, 900); }
  // konuşanın renk şeridi
  ctx.beginPath(); ctx.roundRect(x + 18, y + 18, 12, h - 36, 6); ctx.fillStyle = WHO_COL[l.who] || INK; ctx.fill();
  lines.forEach((s, i) => K.text(s, cx + 10, y + 23 + size * 0.86 + i * lh, size, INK, 700));
  ctx.restore();
}

// ——— bölüm ikonları (ölçek k = yarıçap ~ 50·k) ———
export function icon(K, kind, x, y, k = 1) {
  const { ctx, rect, circ, ell, poly, line } = K;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const lw = LW / k * Math.min(1, k * 1.1);
  if (kind === 'is') {   // evrak çantası
    rect(-30, -44, 60, 22, null, lw, 10); rect(-52, -28, 104, 70, PAL.woodDark, lw, 12); line(-52, -2, 52, -2, lw); rect(-10, -8, 20, 14, PAL.mustard, lw * 0.8, 3);
  } else if (kind === 'sehir') {   // harita iğnesi
    poly([[-30, -6], [30, -6], [0, 52]], PAL.red, lw); circ(0, -16, 36, PAL.red, lw); circ(0, -16, 13, PAL.paper, lw * 0.7);
  } else if (kind === 'hayvan') {   // dana başı
    poly([[-22, -38], [-34, -66], [-12, -42]], '#E9DCC2', lw * 0.7); poly([[22, -38], [34, -66], [12, -42]], '#E9DCC2', lw * 0.7);   // boynuz
    ell(-58, -18, 22, 11, '#8A5A3C', lw * 0.8, 0.35); ell(58, -18, 22, 11, '#8A5A3C', lw * 0.8, -0.35);   // yana açık kulaklar
    ell(0, 0, 46, 46, '#F1EDE2', lw); ell(-16, -10, 17, 20, '#8A5A3C', 0); ell(16, 30, 30, 18, '#8A5A3C', 0); ell(0, 24, 30, 18, '#D9A08C', lw * 0.7);
    circ(-14, -10, 6, INK, 0); circ(14, -10, 6, INK, 0); circ(-10, 22, 4, INK, 0); circ(10, 22, 4, INK, 0);
  } else if (kind === 'can') {   // kalp
    ctx.beginPath(); ctx.moveTo(0, 44); ctx.bezierCurveTo(-74, -6, -32, -62, 0, -22); ctx.bezierCurveTo(32, -62, 74, -6, 0, 44); K.fs(PAL.coral, lw);
  } else if (kind === 'rulo') {   // badana rulosu (cevabın işi)
    rect(-52, -50, 104, 46, PAL.paper, lw, 14); line(0, -4, 0, 30, lw * 1.3); rect(-10, 28, 20, 44, PAL.woodDark, lw * 0.8, 6);
    for (const dx of [-30, 0, 30]) line(dx, -44, dx - 6, -10, lw * 0.5, '#D8CDB8');
  }
  ctx.restore();
}

// badana fırçası (geniş, saplı): el konumunda, açı a
export function brush(K, x, y, a, k = 1) {
  const { ctx, rect, line } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
  rect(-8, -100, 16, 120, PAL.woodDark, LW, 6);
  rect(-48, -150, 96, 56, '#E3D9C6', LW, 8);
  rect(-44, -112, 88, 14, '#A9A296', LW * 0.8, 3);
  for (let i = -36; i <= 36; i += 12) line(i, -146, i, -118, 3, '#C9BFA9');
  ctx.restore();
}

// Kapanış jingle'ı (timeline.json'daki outro): bolum.html setOutro ile verir; takip kartı sözleri kelime kelime yakar.
let OUTRO = null;
export const setOutro = o => { OUTRO = o || null; };
function karaoke(K, t) {
  const { ctx } = K, o = OUTRO, L = o.lines, rel = t - o.t0;
  if (rel < -0.25) return;
  const pair = rel >= L[2].t0 - 0.35 ? 1 : 0, show = [L[pair * 2], L[pair * 2 + 1]];
  const a = spring(rel - (pair ? L[2].t0 - 0.35 : -0.25), UI[0], UI[1]);
  ctx.save(); ctx.translate(540, 1255); ctx.scale(0.9 + 0.1 * a, 0.9 + 0.1 * a); ctx.globalAlpha = Math.min(1, a * 1.4);
  K.rect(-450, -125, 910, 250, INK, 0, 30); K.rect(-460, -135, 910, 250, PAL.paper, LW, 30);
  const size = 70; ctx.font = `900 ${size}px Rubik`;
  show.forEach((ln, i) => {
    const sp = ctx.measureText(' ').width, ws = ln.words.map(w => ctx.measureText(w.w).width);
    let x = -(ws.reduce((s, v) => s + v, 0) + sp * (ws.length - 1)) / 2;
    const y = -22 + i * 100;
    ln.words.forEach((w, j) => {
      const on = rel >= w.t0 - 0.04, cur = on && rel < w.t1;
      ctx.save(); ctx.globalAlpha *= on ? 1 : 0.28;
      K.text(w.w, x, y, size, cur ? PAL.coral : INK, 900, 'left'); ctx.restore();
      x += ws[j] + sp;
    });
  });
  ctx.restore();
}

// Takip kartı (her bölümün sonu): Hikmet Bey kapı pervazının arkasından bakar. u = kartın başından beri geçen süre.
export function endCard(K, t, u) {
  const { ctx } = K;
  ctx.fillStyle = PAL.wall; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); const z = OUTRO ? 1 + 0.08 * (1 - Math.exp(-u / 3)) : 1 + 0.025 * u; ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);   // sürekli yavaş yaklaşma: kart hiç donmaz
  room(K, { floorY: 1500, t });
  // Hikmet Bey sağdaki kapı pervazının arkasından kafasını uzatır
  // jingle varsa Hikmet Bey tam "Hikmet" kelimesinde kapıdan uzanır
  const hw = OUTRO && OUTRO.lines[0].words.find(w => w.w.startsWith('Hikmet'));
  const peek = hw ? ease.enter(seg(t, OUTRO.t0 + hw.t0 - 0.35, 0.6)) : ease.enter(seg(u, 0.5, 0.6));
  K.rect(760, 520, 340, 1000, '#1C3638', 0);   // kapı boşluğu
  ctx.save(); ctx.beginPath(); ctx.rect(800, 0, 400, 1920); ctx.clip();
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: lerp(1260, 1030, peek), y: 1560, s: 300, expr: 'mutlu', lean: -24, head: { tilt: -22, look: [-0.9, 0.1] }, armL: { sh: 70, el: -60 } }), t);
  ctx.restore();
  K.rect(760, 500, 46, 1020, PAL.trim, LW, 6);
  const a = spring(u, BIG[0], BIG[1]);
  ctx.save(); ctx.translate(430, 820); ctx.scale(0.85 + 0.15 * a, 0.85 + 0.15 * a);
  K.rect(-330, -170, 670, 330, INK, 0, 30); K.rect(-340, -180, 670, 330, PAL.paper, LW, 30);
  K.rect(-310, -232, 400, 68, PAL.mustard, LW, 34); K.text(K.up('Bilmece Mesaisi'), -110, -185, 36, INK, 900);
  K.text('Her gün', -5, -60, 76, INK, 900); K.text('yeni bilmece', -5, 30, 76, INK, 900);
  K.rect(-190, 70, 370, 76, PAL.coral, LW, 38); K.text('Takip et', -5, 124, 48, PAL.paper, 800);
  ctx.restore();
  ctx.restore();
  if (OUTRO) karaoke(K, t);
}

// Denenen tahminler (ekran uzayı): sol sütunda alt alta belirir, elenenin üstü çizilir.
// items: [{ s, t0, strike? }] · fadeAt: sütunun kalktığı an
export function triesCol(K, t, items, { x = 195, y = 730, gap = 112, fadeAt = 1e9, size = 64 } = {}) {
  const { ctx } = K, fade = 1 - clamp01((t - fadeAt) / 0.4);
  if (fade <= 0) return;
  items.forEach((it, i) => {
    const a = it.t0 - 0.04; if (t < a) return;
    const u = spring(t - a, UI[0], UI[1]);
    ctx.save(); ctx.globalAlpha = fade; ctx.translate(x - (1 - u) * 40, y + i * gap); ctx.scale(0.6 + 0.4 * u, 0.6 + 0.4 * u);
    ctx.font = `900 ${size}px Rubik`; const bw = ctx.measureText(it.s).width + 44;   // koyu zemin: hareketli arka planda da okunsun
    ctx.globalAlpha = fade * 0.82; K.rect(-bw / 2, -size * 0.92, bw, size * 1.22, INK, 0, size * 0.3); ctx.globalAlpha = fade;
    K.text(it.s, 0, 0, size, it.s.endsWith('?') ? PAL.trim : PAL.paper, 900);
    const su = it.strike ? ease.enter(seg(t, it.strike, 0.25)) : 0;
    if (su > 0) { ctx.font = `900 ${size}px Rubik`; const w = ctx.measureText(it.s).width / 2 + 10; K.line(-w, -size * 0.34, -w + 2 * w * su, -size * 0.34, 10, PAL.coral); }
    ctx.restore();
  });
}

// Düşünme sayacı: cnt1 ipucunun geldiği an (sayaç tam o anda sıfıra iner), cnt0 = cnt1 − 5
export function thinkCounter(K, t, cnt1, { x = 860, y = 1110, r = 92 } = {}) {
  const cnt0 = cnt1 - 5;
  if (t < cnt0 - 0.2 || t >= cnt1 + 0.6) return;
  const { ctx } = K, u = spring(t - (cnt0 - 0.2), UI[0], UI[1]), out = 1 - ease.exit(seg(t, cnt1 + 0.25, 0.3)), left = Math.max(0, cnt1 - t);
  ctx.save(); ctx.translate(x, y); ctx.scale(u * out, u * out);
  counter(K, 0, 0, r, left / 5, String(Math.ceil(left - 1e-6)));
  ctx.restore();
}

// "SEN DE DÜŞÜN" geri sayımı (izleyicinin payı): t1 sayacın sıfırlandığı an (ipucundan hemen önce), 5 sn.
// Büyük, ekranın ortasında; her saniye sayı vurgulanır, son 3 saniye halka mercan. Konuşma yok, ses tarafında saat tıkırtısı.
// share: soruyu alıp düşünmek için çıkan izleyiciye paylaşım çağrısı. 2026-11-10 analizi: ortalama izleyici sorunun
// hemen ardından (~25. sn) çıkıyor, sondaki çağrıyı görmüyor. Sayacın 1. saniyesinde belirir.
export function countdown(K, t, t1, { top = 540, share = null } = {}) {
  const t0 = t1 - 5;
  if (t < t0 - 0.3 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = spring(t - (t0 - 0.25), UI[0], UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(5, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 540, y = 990, r = 190;
  // perde: bilmece kartının altı kararır (kart okunur kalır), karakterler arkada düşünmeye devam eder
  ctx.save(); ctx.globalAlpha = 0.5 * clamp01((t - t0 + 0.3) / 0.3) * out; ctx.fillStyle = INK; ctx.fillRect(0, top, 1080, 1920 - top); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  ctx.font = '900 70px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 80;
  K.rect(-bw / 2 + 8, -r - 140 + 10, bw, 100, INK, 0, 50); K.rect(-bw / 2, -r - 140, bw, 100, PAL.mustard, LW, 50);
  K.text('SEN DE DÜŞÜN!', 0, -r - 66, 70, INK, 900);
  K.circ(10, 12, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / 5)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 56, 160, hot ? PAL.red : INK, 900); ctx.restore();
  K.text('İpucu geliyor…', 0, r + 80, 52, PAL.paper, 800);
  if (share && t >= t0 + 0.9) {
    const v = spring(t - (t0 + 0.9), UI[0], UI[1]); ctx.save(); ctx.translate(0, r + 200); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 46px Rubik'; const sw = ctx.measureText(share).width + 70;
    K.rect(-sw / 2 + 8, -48 + 10, sw, 96, INK, 0, 48); K.rect(-sw / 2, -48, sw, 96, PAL.coral, LW, 48); K.text(share, 0, 16, 46, PAL.paper, 900);
    ctx.restore();
  }
  ctx.restore();
}

// Sayaç sırasında düşünen bakış: her saniye başka yöne (durağanlık olmasın); p = poz (yerinde değişir)
export function glance(p, t, t1) {
  const t0 = t1 - 5;
  if (t < t0 || t >= t1) return p;
  const L = [[-0.7, -0.8], [0.6, -0.85], [0, -0.95], [-0.5, -0.4], [0.55, -0.6], [0, -0.3]];
  const k = Math.min(4, Math.floor(t - t0)), u = ease.state(clamp01((t - t0 - k) / 0.3));
  const a = L[k], b = L[k + 1];
  p.head = { ...p.head, look: [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], tilt: (p.head?.tilt || 0) + 6 * Math.sin((t - t0) * 1.3) };
  return p;
}
