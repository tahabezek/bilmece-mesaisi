// Standart bölüm kalıbı: kamera, pozlar, karakter yerleşimi, sayaç, ipucu kartı, kanıt ve kapanış.
// Bölüm dosyası yalnızca dekoru (back/mid/front), ekran katmanını (screen), ipucu içeriğini (clue) ve kanıtı (proof) verir.
// Beklenen replik kimlikleri: h1 d1 h2a [h2b h2c] h3 da d2 [hd] n0 hn [hc] n1 d3 d4 d5 [d5b] h4 <son satır = paylaşım çağrısı>.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, plant, clock } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export const THINK = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
export const THINK2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };

// o = { focus: [x, y] (h2a'da kameranın baktığı dekor), extra: (T, L) => ({...}) ek zamanlar, hikX, defX }
export function build(ep, tl, o = {}) {
  const T = e => at(tl, e), L = tl.L, has = id => !!L[id];
  const last = tl.lines[tl.lines.length - 1].id;
  // Kısa kalıp (v3, 2026-11-10): d1, da, n0, hn isteğe bağlı. Olmayan satırın anı NONE olur; o ana bağlı
  // kamera ve poz anahtarları atılır, karşılaştırmalar (t >= NONE) hiç tutmaz.
  const NONE = 1e9;
  const tm = {
    think0: T('h3>'), da: has('da') ? T('da') : NONE, d2: T('d2'), hd: has('hd') ? T('hd') : T('d2>') + 0.3,
    n0: has('n0') ? T('n0') : NONE, hn: has('hn') ? T('hn') : NONE,
    hc: has('hc') ? T('hc') : has('hn') ? T('hn>') + 0.3 : NONE, clue: T('n1'), cd: T(ep.countdown),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    happy: T('h4') - 0.15, cta: T(last) - 0.2, end: T(last + '>') + 0.1,
    ...(o.extra ? o.extra(T, L) : {}),
  };
  const f = o.focus || [580, 1120];
  const cam = [
    [0, 1.14, 520, 1060, 'cut'],
    [0.6, 1.18, 560, 1070],
    ...(has('d1') ? [[L.d1.t0 - 0.05, 1.28, 840, 1060]] : []),
    [L.h2a.t0 - 0.05, 1.3, f[0], f[1]],
    ...(has('h2b') ? [[L.h2b.t0 - 0.05, 1.22, 400, 1050]] : []),
    ...(has('h2c') ? [[L.h2c.t0 - 0.05, 1.2, 560, 1060]] : []),
    [L.h3.t0 - 0.05, 1.28, 300, 1040],
    [tm.think0 + 0.1, 1.3, 820, 1060],
    [tm.d2, 1.36, 830, 1070],
    [tm.hd - 0.05, 1.26, 320, 1040],
    [tm.n0 - 0.1, 1.3, 1180, 1040],
    [tm.hn - 0.05, 1.22, 420, 1040],
    [tm.hc - 0.05, 1.18, 560, 1050],
    [tm.cd - 5, 1.1, 560, 1040],
    [tm.clue - 0.1, 1.3, 1110, 900],
    [tm.clue + 2.6, 1.4, 1130, 880],
    [tm.buldum - 0.05, 1.32, 840, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 400, 1060, 'cut'],
    [tm.happy + 1.8, 1.45, 420, 1080],
    [tm.cta, 1.6, 840, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ].filter(k => k[0] < NONE / 2).sort((a, b) => a[0] - b[0]);
  const hikBase = charBase('hikmet', { x: o.hikX ?? 190, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 80, el: 20 } });
  const hik = [
    [L.h1.t0 + 1.2, { armR: { sh: 140, el: 10 } }, 0.35, ease.enter],
    [L.h2a.t0 - 0.2, { armR: { sh: 70, el: 20 }, head: { tilt: 6, look: [0.9, 0.3] } }, 0.35, ease.enter],
    ...(has('h2c') ? [[L.h2c.t0 - 0.1, { armR: { sh: 150, el: -20 }, head: { tilt: -4, look: [0.7, 0] } }, 0.3, ease.enter]] : []),
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.hd - 0.05, { expr: 'mutlu', armR: { sh: 155, el: -5 }, head: { tilt: 6, look: [0.8, 0] } }, 0.25, ease.enter],
    [tm.n0, { armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hn - 0.05, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'mutlu', armR: { sh: 25, el: -160 }, armL: { sh: 20, el: -60 } }, 0.3],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ].filter(k => k[0] < NONE / 2).sort((a, b) => a[0] - b[0]);
  const defBase = charBase('defne', { x: o.defX ?? 880, y: 1520, s: 245, expr: 'saskin', head: { tilt: -4, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [-0.6, 0.5] } }, 0.35],
    [tm.think0 + 0.1, { expr: THINK, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: 'mutlu', armL: { sh: 95, el: 10 }, armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [-0.9, 0] } }, 0.3, ease.enter],
    [tm.hd + 0.2, { expr: 'saskin', blink: 0, armL: { sh: 12, el: -10 } }, 0.2],
    [(tm.n0 < NONE / 2 ? tm.n0 : has('hd') ? T('hd>') : T('d2>')) + 0.6, { blink: null, expr: THINK2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ].sort((a, b) => a[0] - b[0]);
  return { tm, cam, hik, hikBase, def, defBase };
}

// h = { back(K,t,S), mid(K,t,S), front(K,t,S,{h,d,n}), screen(K,t,S,top), tries: [{s,t0,strike}], clue(K,t,S), proof(K,t,S), cardSize }
export function draw(K, t, ep, tl, S, h) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t, h.drift ?? 0.018);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proofFrame(K, t, tl, S, h);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1800, floorY: 1500, t, window: h.window ?? true });
  clock(K, 1480, 760, 58, 3, 10 + Math.floor(t / 5), t);
  plant(K, 1660, 1500, 0.9, t);
  h.back?.(K, t, S, { happy });
  const np = charBase('necmi', { x: 1200, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', armL: { sh: 140, el: 10 }, head: { tilt: -6, look: [-0.8, -0.2] } });
  if (t >= tm.hn && t < tm.clue - 0.3) Object.assign(np, { expr: 'saskin' });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 30, el: -120 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  h.mid?.(K, t, S, { happy });
  let hk = null;
  if (t < tm.cta) {
    const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', armR: { sh: 95, el: 5 }, head: { tilt: -8, look: [0.9, 0.2] } });
    hk = drawChar(ctx, 'hikmet', hp, t);
  }
  h.front?.(K, t, S, { h: hk, d, n, happy });
  ctx.restore();

  const heads = { hikmet: hk?.head, defne: d?.head, necmi: n?.head };
  if (t >= tm.happy) { const cap = captionAt(tl, t), hd = heads[cap?.line.who]; return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) }); }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: h.cardSize ?? 54 }), top = 300 + cardH;
  h.screen?.(K, t, S, top);
  if (h.tries) triesCol(K, t, h.tries, { x: 540, y: top + 80, gap: 84, size: 50, fadeAt: tm.hd + 1.4 });
  countdown(K, t, tm.cd, { top: top + 20 });
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    h.clue?.(K, t, S);
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}

function proofFrame(K, t, tl, S, h) {
  const { ctx } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + (h.proofDrift ?? 0.016) * u; ctx.save(); ctx.translate(0, -7 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.6)'; ctx.fillRect(-100, -100, 1280, 2120);
  h.proof?.(K, t, S);
  ctx.restore();
  const dp = charBase('defne', { x: 210, y: 2060, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t); drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.win ?? tm.happy - 1.5, 0.4));
  const hp = charBase('hikmet', { x: 880, y: 2070, s: 235, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } });
  hp.talk = talkAt(tl, 'hikmet', t); drawChar(ctx, 'hikmet', hp, t);
  caption(K, captionAt(tl, t), { y: 1290, head: null });
}

// Tek satırlık bilgi yuvası (kısa kalıp): kartın hemen altında yalnız en son bilgi görünür; yüzlere binmez.
// items: [[t, metin, dolgu?, yazı rengi?]] · out: 0..1 çıkış çarpanı
export function slot(K, t, items, y, out = 1, size = 44) {
  let cur = null; for (const it of items) if (t >= it[0] - 0.04) cur = it;
  if (!cur || out <= 0) return;
  const v = spring(t - (cur[0] - 0.04), 320, 30), { ctx } = K;
  ctx.save(); ctx.translate(540, y); ctx.scale((0.7 + 0.3 * v) * out, (0.7 + 0.3 * v) * out); ctx.globalAlpha = clamp01(v * 1.6) * out;
  pill(K, 0, 0, cur[1], cur[2] ?? INK, cur[3] ?? PAL.paper, size);
  ctx.restore();
}

// küçük yardımcılar
export const pop =(K, t, a, fn) => { if (t < a - 0.04) return; const v = spring(t - (a - 0.04), UI[0], UI[1]); K.ctx.save(); fn(v); K.ctx.restore(); };
export function pill(K, x, y, label, fill, col = PAL.paper, size = 40) {
  const { ctx } = K; ctx.font = `900 ${size}px Rubik`; const w = ctx.measureText(label).width + size * 1.2;
  K.rect(x - w / 2, y - size * 0.95, w, size * 1.9, fill, LW * 0.8, size * 0.95); K.text(label, x, y + size * 0.35, size, col, 900);
}
export function stamp(K, t, a, x, y, label, fill = PAL.green, size = 64) {
  if (t < a) return; const v = spring(t - a, 420, 26), { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.05); ctx.scale(1.6 - 0.6 * v, 1.6 - 0.6 * v); ctx.globalAlpha = clamp01(v * 2);
  pill(K, 0, 0, label, fill, PAL.paper, size); ctx.restore();
}
export { at, PAL, LW, INK, ease, seg, spring, clamp01, lerp };
