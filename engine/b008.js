// Bölüm 8 · TÜTSÜ. Mekân: toplantı odası (bozuk duvar saati, sepette toplanmış telefonlar, Necmi'nin tütsü tepsisi).
// İpucu: Necmi tütsüyü iki ucundan yakmış, yarım saatte bitmiş. Kanıt: A iki uçtan (30 dk) + B önce tek uç, sonra iki uç (15 dk) = 45.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, desk, clock, plant } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    clock: T('h2a:2'), phones: T('h2a:5'), sticks: T('h2a:9'), uneven: T('h2b:6'),
    think0: T('h3>'), da: T('da'), d2: T('d2'), n0: T('n0'), hn: T('hn'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), lit: T('n1:2'), done: T('n1:7'), half: T('n1:5'),
    buldum: T('d3'), proof: T('d3:1') - 0.04,
    aLit: T('d4:2'), bLit: T('d4:5'), aDone: T('d4:11'), bLit2: T('d5:4'), bRun: T('d5:7'), bDone: T('d5:14'),
    sum: [T('d6:0'), T('d6:2'), T('d6:4')],
    happy: T('d6>') + 0.1, cta: T('d7') - 0.2, end: T('d7>') + 0.1,
  };
  const cam = [
    [0, 1, 560, 960, 'cut'],
    [0.5, 1.05, 540, 990],
    [tm.clock - 0.1, 1.22, 900, 960],
    [tm.phones - 0.1, 1.15, 420, 1040],
    [tm.sticks - 0.1, 1.3, 560, 1100],
    [L.h2b.t0 + 0.6, 1.2, 380, 1030],
    [L.h3.t0 - 0.05, 1.28, 300, 1030],
    [tm.think0 + 0.1, 1.3, 840, 1060],
    [L.d2.t0, 1.38, 860, 1040],
    [tm.n0 - 0.1, 1.32, 580, 1060],
    [tm.hn - 0.05, 1.25, 360, 1030],
    [tm.hc - 0.05, 1.3, 260, 1040],
    [tm.cd - 5, 1.1, 560, 1000],
    [tm.clue - 0.1, 1.3, 600, 920],
    [tm.done, 1.4, 600, 900],
    [tm.buldum, 1.3, 860, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.3, 380, 1020, 'cut'],
    [T('h4:4'), 1.42, 340, 1000],
    [tm.cta, 1.6, 880, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 180, y: 1500, s: 255, expr: 'mutlu', head: { tilt: -4, look: [0.5, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const hik = [
    [L.h1.t0 + 0.2, { armR: { sh: 25, el: -160 } }, 0.35, ease.enter],
    [tm.clock - 0.1, { expr: 'kizgin', head: { tilt: 6, look: [0.7, -0.6] }, armR: { sh: 20, el: -60 } }, 0.3],
    [tm.phones - 0.1, { expr: 'mutlu', armR: { sh: 38, el: 45 }, head: { tilt: -4, look: [0.8, 0.3] } }, 0.35, ease.enter],
    [tm.uneven - 0.1, { armR: { sh: 150, el: -20 }, head: { tilt: 6, look: [0.6, 0] } }, 0.3, ease.enter],
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.hn - 0.05, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -8, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'notr', armR: { sh: 25, el: -160 }, armL: { sh: 25, el: -160 }, head: { tilt: 4, look: [0.8, 0] } }, 0.3],
    [tm.clue + 0.3, { armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.2] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 900, y: 1520, s: 250, expr: 'mutlu', head: { tilt: -6, look: [-0.8, -0.2] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const def = [
    [tm.clock, { expr: 'notr', head: { tilt: 4, look: [-0.5, -0.7] } }],
    [L.h2a.t0 + 0.2, { head: { tilt: -2, look: [-0.8, -0.3] } }],
    [tm.think0 + 0.1, { expr: think, head: { tilt: 8, look: [-0.9, -0.2] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: think2, armL: { sh: 70, el: -30 }, head: { tilt: -6, look: [-0.5, -0.8] } }, 0.3],
    [tm.n0, { armL: { sh: 12, el: -10 }, head: { tilt: -4, look: [-0.9, 0.1] } }, 0.3],
    [tm.hn, { expr: 'saskin', blink: 0, head: { tilt: 4, look: [-0.9, -0.1] }, armR: { sh: 20, el: -60 } }, 0.2, ease.enter],
    [tm.hc + 0.5, { blink: null, expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { blink: null, expr: 'notr', head: { tilt: -4, look: [-0.9, 0.2] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.done, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1520, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// tütsü çubuğu (yatay): kalan [a,b] (0..1), ateşli uçlar ea/eb; düzensiz kalınlık = düzensiz yanma
function stick(K, x0, x1, y, a, b, ea, eb, t, k = 1) {
  const { ctx, line } = K, L = x1 - x0, th = v => (11 + 5 * Math.sin(v * 17 + 1) + 3 * Math.sin(v * 41)) * k;
  // kül izi
  ctx.save(); ctx.setLineDash([6 * k, 10 * k]); line(x0, y, x1, y, 4 * k, '#8E8A80'); ctx.restore();
  if (b > a) {
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const v = lerp(a, b, i / 40); ctx.lineTo(x0 + v * L, y - th(v)); }
    for (let i = 40; i >= 0; i--) { const v = lerp(a, b, i / 40); ctx.lineTo(x0 + v * L, y + th(v)); }
    ctx.closePath(); K.fs('#7A4A2E', LW * 0.7 * Math.min(1, k * 1.2));
  }
  for (const [on, v] of [[ea, a], [eb, b]]) {
    if (!on || b <= a) continue;
    const x = x0 + v * L, f = 1 + 0.15 * Math.sin(t * 23 + v * 9);
    ctx.save(); ctx.globalAlpha = 0.45; K.circ(x, y, 26 * k * f, '#F2B33D', 0); ctx.restore();
    K.circ(x, y, 12 * k, PAL.coral, LW * 0.6 * k);
    // duman: yukarı kıvrılan ince çizgi
    ctx.save(); ctx.globalAlpha = 0.55; ctx.beginPath();
    for (let i = 0; i <= 16; i++) { const u = i / 16; ctx.lineTo(x + Math.sin(u * 7 - t * 3 + v * 5) * 14 * k * u, y - 20 * k - u * 110 * k); }
    ctx.lineWidth = 4 * k; ctx.strokeStyle = '#D8D2C4'; ctx.stroke(); ctx.restore();
  }
}

// tek uçtan düzensiz yanma eğrisi: f(0.5) = 0.38 (yarı zamanda yarıya varmaz)
const uneven = u => clamp01(u + 0.24 * Math.sin(Math.PI * u) * -0.5 + 0.06 * Math.sin(2 * Math.PI * u));

function brokenClock(K, x, y, r, t) {
  clock(K, x, y, r, 7, 20, 0);
  K.line(x - r * 0.7, y - r * 0.5, x - r * 0.1, y - r * 0.05, 4, INK); K.line(x - r * 0.1, y - r * 0.05, x - r * 0.25, y + r * 0.5, 4, INK);
  K.ctx.save(); K.ctx.translate(x + r * 0.8, y + r * 0.9); K.ctx.rotate(-0.15);
  K.rect(-74, -26, 148, 52, PAL.coral, LW * 0.7, 8); K.text('BOZUK', 0, 14, 32, PAL.paper, 900); K.ctx.restore();
  void t;
}

function phoneBasket(K, x, y) {
  const { rect } = K;
  [[-50, -0.25, '#3B4A4A'], [-10, 0.1, '#5A3B3B'], [34, -0.05, '#3B3F5A'], [60, 0.3, '#4A4A3B']].forEach(([dx, a, c]) => {
    K.ctx.save(); K.ctx.translate(x + dx, y - 40); K.ctx.rotate(a); rect(-20, -40, 40, 80, c, LW * 0.7, 8); rect(-14, -32, 28, 58, '#A9C2B6', 0, 4); K.ctx.restore();
  });
  rect(x - 90, y - 30, 180, 60, PAL.woodDark, LW, 10);
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1700, floorY: 1500, t });
  brokenClock(K, 1060, 820, 62, t);
  plant(K, 1200, 1500, 0.9, t);
  // Necmi Abi masanın arkasında
  const np = charBase('necmi', { x: 580, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [0, 0.6] }, armR: { sh: 30, el: -120 }, armL: { sh: 30, el: -120 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', head: { tilt: -6, look: [0.6, -0.4] }, armR: { sh: 140, el: 10 } });
  if (t >= tm.hn && t < tm.clue) Object.assign(np, { expr: 'saskin', head: { tilt: 8, look: [-0.9, 0] } });
  if (t >= tm.clue - 0.3) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [0.2, 0.7] }, armR: { sh: 40, el: -100 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = happy || t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  desk(K, 300, 1320, 560, { h: 180 });
  phoneBasket(K, 400, 1320);
  // tütsü tepsisi
  K.rect(560, 1296, 240, 26, PAL.metal, LW * 0.8, 10);
  const lit = t >= tm.lit && t < tm.buldum ? 1 : 0, cu = clamp01((t - tm.lit) / Math.max(0.5, tm.done - tm.lit));
  stick(K, 580, 780, 1282, lit ? cu * 0.55 : 0, lit ? 1 - cu * 0.45 : 1, lit, lit, t, 0.7);
  stick(K, 580, 780, 1262, 0, 1, 0, 0, t, 0.7);
  // Hikmet Bey
  let h = null;
  if (t < tm.cta) {
    const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', head: { tilt: -6, look: [0.9, -0.2] }, armR: { sh: 120, el: 30 }, armL: { sh: 20, el: -60 } });
    h = drawChar(ctx, 'hikmet', hp, t);
  }
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  if (happy) Object.assign(dp, { expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 } });
  const d = drawChar(ctx, 'defne', dp, t);
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.happy) {
    const cap = captionAt(tl, t), who = cap?.line.who, hd = who === 'defne' ? d?.head : h?.head;
    return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) });
  }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 52 }), top = 300 + cardH;
  triesCol(K, t, [{ s: 'Ortadan böl?', t0: T0(tl, 'da:7'), strike: tm.d2 - 0.1 }, { s: 'Arka arkaya? 2 saat', t0: tm.d2 + 0.3, strike: T0(tl, 'd2>') - 0.3 }], { x: 540, y: top + 75, gap: 80, size: 50, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu kartı: iki uçtan yanan tütsü, yarım saat
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 170); ctx.scale(u, u);
    K.rect(-330, -140, 660, 280, '#FBF6EC', LW, 24);
    const cu = clamp01((t - tm.lit) / Math.max(0.5, tm.done - tm.lit)), on = t >= tm.lit ? 1 : 0;
    stick(K, -260, 260, 60, on ? cu * 0.62 : 0, on ? 1 - cu * 0.38 : 1, on && cu < 1, on && cu < 1, t, 1);
    if (cu >= 1) K.text('bitti', 0, 122, 34, '#6B6355', 900);
    if (t >= tm.half - 0.04) { const v = spring(t - (tm.half - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(0, -78); ctx.scale(v, v); K.rect(-200, -40, 400, 80, PAL.coral, LW * 0.8, 40); K.text('İKİ UÇ → 30 dk', 0, 15, 42, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' ? n?.head : null;
  caption(K, cap, { y: 1250, head: head && toScreen(cam, head) });
}
const T0 = (tl, e) => at(tl, e);

// kanıt: A ve B tütsüleri, yanma zamanı sayacı (dakika)
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.012 * u; ctx.save(); ctx.translate(0, -8 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(-100, -100, 1280, 2120);
  // A: iki uç → buluşma 0.62'de (düzensiz ama tam 30 dk)
  const aU = clamp01((t - tm.aLit) / Math.max(0.5, tm.aDone - tm.aLit));
  const aOn = t >= tm.aLit && aU < 1;
  // B: tek uç (düzensiz) 0 → uneven(1)=? ; yarı zamanda 0.38'e kadar yanar; sonra iki uç
  const bU = clamp01((t - tm.bLit) / Math.max(0.5, tm.aDone - tm.bLit));
  const bA = t < tm.bLit ? 0 : 0.38 * uneven(bU) / uneven(1);
  const rU = clamp01((t - tm.bRun) / Math.max(0.5, tm.bDone - tm.bRun)), meet = 0.7;
  const bLeft = t < tm.bRun ? bA : lerp(0.38, meet, rU), bRight = t < tm.bRun ? 1 : lerp(1, meet, rU);
  const bOnL = t >= tm.bLit && rU < 1, bOnR = t >= tm.bLit2 && rU < 1;
  text('A', 130, 560, 64, PAL.mustard, 900); text('B', 130, 860, 64, PAL.mustard, 900);
  stick(K, 200, 940, 540, aOn || aU < 1 ? aU * 0.62 : 0.62, aOn || aU < 1 ? 1 - aU * 0.38 : 0.62, aOn, aOn, t, 1.3);
  stick(K, 200, 940, 840, bLeft, bRight, bOnL, bOnR, t, 1.3);
  if (t >= tm.aDone - 0.05) { const v = spring(t - (tm.aDone - 0.05), UI[0], UI[1]); ctx.save(); ctx.translate(570, 540); ctx.scale(v, v); rect(-150, -42, 300, 84, PAL.cream, LW * 0.8, 42); text('A bitti', 0, 17, 46, INK, 900); ctx.restore(); }
  // dakika sayacı
  const mins = t < tm.aLit ? 0 : t < tm.aDone ? 30 * aU : t < tm.bRun ? 30 : 30 + 15 * rU;
  ctx.save(); ctx.translate(540, 360); rect(-170, -62, 340, 124, PAL.paper, LW, 62); text(`${Math.floor(mins + 1e-6)} dk`, 0, 26, 78, mins >= 45 - 1e-6 ? PAL.coral : INK, 900); ctx.restore();
  if (t >= tm.sum[0] - 0.04) {
    const parts = ['30', '+ 15', '= 45 dk'];
    ctx.save(); ctx.translate(540, 1060);
    rect(-360, -64, 720, 128, PAL.coral, LW, 64);
    parts.forEach((p, i) => { if (t < tm.sum[i] - 0.04) return; const v = spring(t - (tm.sum[i] - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate([-250, -70, 170][i], 26); ctx.scale(v, v); text(p, 0, 0, 66, PAL.paper, 900); ctx.restore(); });
    ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 270, y: 1920, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  drawChar(ctx, 'defne', dp, t);
  drawChar(ctx, 'necmi', charBase('necmi', { x: 560, y: 1930, s: 215, expr: 'mutlu', head: { tilt: 6, look: [0, -0.6] }, armR: { sh: 30, el: -110 }, armL: { sh: 30, el: -110 } }), t);
  const hu = ease.enter(seg(t, tm.sum[2], 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 840, y: 1940, s: 230, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1200, head: null });
}
