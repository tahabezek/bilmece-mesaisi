// Bölüm 12 · KURUYAN SALATALIK (yayın #5). Mekân: çay ocağı; tezgâhta salatalık kasası ve kantar.
// 100 kg, %99 su → kuruyunca %98 su: 50 kg. İpucu: Necmi hamamda "su atmış", kemiği aynı. Kanıt: 100 karelik ızgara → 50.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, desk, plant, clock } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    crate: T('h2a:1'), su99: T('h2a:7'), dry: T('h2b:3'), su98: T('h2b:7'), q: T('h2c:2'),
    think0: T('h3>'), da: T('da'), d2: T('d2'), hd: T('hd'), n0: T('n0'), hn: T('hn'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), sc: T('n1:1'), drop: T('n1:8'), same: T('n1:14'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    green: T('d4:3'), dry0: T('d4:9'), pct2: T('d5:4'), shrink: T('d5:7'), fifty: T('d5:12'),
    happy: T('h4') - 0.15, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1.1, 560, 1040, 'cut'],
    [0.6, 1.15, 600, 1050],
    [L.d1.t0 - 0.05, 1.28, 820, 1060],
    [tm.crate - 0.1, 1.25, 560, 1100],
    [L.h2b.t0 - 0.05, 1.2, 420, 1050],
    [L.h2c.t0 - 0.05, 1.28, 300, 1040],
    [tm.think0 + 0.1, 1.3, 820, 1060],
    [tm.d2, 1.36, 830, 1070],
    [tm.hd - 0.05, 1.25, 320, 1040],
    [tm.n0 - 0.1, 1.3, 1180, 1040],
    [tm.hn - 0.05, 1.22, 420, 1040],
    [tm.hc - 0.05, 1.18, 560, 1040],
    [tm.cd - 5, 1.1, 560, 1040],
    [tm.clue - 0.1, 1.3, 1110, 900],
    [tm.drop, 1.4, 1130, 880],
    [tm.buldum - 0.05, 1.32, 840, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 320, 1040, 'cut'],
    [T('h4:3'), 1.45, 300, 1020],
    [tm.cta, 1.6, 840, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const hikBase = charBase('hikmet', { x: 200, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const hik = [
    [L.h1.t0 + 0.3, { armR: { sh: 140, el: 10 } }, 0.35, ease.enter],
    [tm.crate - 0.2, { armR: { sh: 70, el: 20 }, head: { tilt: 6, look: [0.9, 0.3] } }, 0.35, ease.enter],
    [L.h2c.t0, { armR: { sh: 150, el: -20 }, head: { tilt: -4, look: [0.7, 0] } }, 0.3, ease.enter],
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.hd - 0.05, { expr: 'mutlu', armR: { sh: 155, el: -5 }, head: { tilt: 6, look: [0.8, 0] } }, 0.25, ease.enter],
    [tm.n0, { armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hn - 0.05, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'mutlu', armR: { sh: 25, el: -160 }, armL: { sh: 20, el: -60 } }, 0.3],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 860, y: 1520, s: 245, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [-0.6, 0.5] } }, 0.35],
    [tm.think0 + 0.1, { expr: think, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: 'mutlu', armL: { sh: 95, el: 10 }, armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [-0.9, 0] } }, 0.3, ease.enter],
    [tm.hd + 0.2, { expr: 'saskin', blink: 0, armL: { sh: 12, el: -10 } }, 0.2],
    [tm.n0 + 0.6, { blink: null, expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.same, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

function cucumber(K, x, y, a, k) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
  K.ell(0, 0, 46, 14, PAL.green, LW / k); K.line(-30, -4, 26, -6, 3 / k, '#4C8240'); ctx.restore();
}
function crate(K, x, y) {
  const { rect, line } = K;
  for (let i = 0; i < 9; i++) cucumber(K, x - 110 + (i % 5) * 52 + (i > 4 ? 26 : 0), y - 70 - (i > 4 ? 22 : 0), (i * 0.37) % 0.6 - 0.3, 0.9);
  rect(x - 150, y - 70, 300, 90, PAL.wood, LW, 6); line(x - 140, y - 40, x + 140, y - 40, 4, PAL.woodDark); line(x - 140, y - 10, x + 140, y - 10, 4, PAL.woodDark);
}
// kantar: göstergede metin (ya da '?' notu)
function scale(K, x, y, label, covered) {
  const { rect, text } = K;
  rect(x - 110, y - 20, 220, 40, '#9AA39A', LW, 8);
  rect(x - 80, y + 20, 160, 90, '#C9CEC4', LW, 10);
  rect(x - 62, y + 34, 124, 50, '#2F3A36', LW * 0.6, 6);
  if (covered) { K.ctx.save(); K.ctx.translate(x + 6, y + 58); K.ctx.rotate(-0.12); rect(-48, -32, 96, 64, '#F2D25C', LW * 0.6, 4); text('?', 0, 18, 48, INK, 900); K.ctx.restore(); }
  else text(label, x, y + 72, 34, '#9BE07A', 900);
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1800, floorY: 1500, t });
  clock(K, 1480, 760, 58, 3, 20 + Math.floor(t / 5), t);
  plant(K, 1650, 1500, 0.9, t);
  const np = charBase('necmi', { x: 1200, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', armL: { sh: 140, el: 10 }, head: { tilt: -6, look: [-0.8, -0.2] } });
  if (t >= tm.hn && t < tm.clue - 0.3) Object.assign(np, { expr: 'saskin' });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 30, el: -120 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  if (happy) Object.assign(dp, { expr: 'mutlu' });
  const d = drawChar(ctx, 'defne', dp, t);
  desk(K, 360, 1320, 660, { h: 200 });   // tezgâh
  crate(K, 520, 1310);
  scale(K, 800, 1205, '100 kg', t >= tm.dry - 0.1);
  let h = null;
  if (t < tm.cta) { const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', armR: { sh: 95, el: 5 }, head: { tilt: -8, look: [0.9, 0.2] } });
    h = drawChar(ctx, 'hikmet', hp, t); }
  ctx.restore();

  const heads = { hikmet: h?.head, defne: d?.head, necmi: n?.head };
  if (t >= tm.happy) { const cap = captionAt(tl, t), hd = heads[cap?.line.who]; return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) }); }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 }), top = 300 + cardH;
  triesCol(K, t, [{ s: '99 kg?', t0: tm.d2, strike: tm.hd + 0.1 }, { s: '98 kg?', t0: tm.d2 + 1.45, strike: tm.hd + 0.1 }], { x: 540, y: 1150, gap: 84, size: 56, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: hamam tartısı 82 → 80, damlalar, "su gider, kuru kalır"
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    const kg = t < tm.sc + 0.2 ? 82 : Math.round(lerp(82, 80, clamp01((t - tm.sc - 0.2) / 0.8)));
    K.rect(-300, -90, 260, 150, '#C9CEC4', LW, 16); K.rect(-260, -66, 180, 70, '#2F3A36', LW * 0.6, 8); K.text(`${kg} kg`, -170, -18, 42, '#9BE07A', 900);
    if (t >= tm.drop - 0.04) for (let i = 0; i < 3; i++) { const v = clamp01((t - tm.drop - i * 0.15) / 0.5); if (v <= 0) continue; ctx.save(); ctx.globalAlpha = 1 - v * 0.6; ctx.translate(40 + i * 70, -60 + v * 90); ctx.beginPath(); ctx.moveTo(0, -24); ctx.quadraticCurveTo(18, 0, 0, 14); ctx.quadraticCurveTo(-18, 0, 0, -24); K.fs('#7FC4E8', LW * 0.6); ctx.restore(); }
    if (t >= tm.same - 0.04) { const v = spring(t - (tm.same - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(0, 110); ctx.scale(v, v); K.rect(-270, -38, 540, 76, PAL.coral, LW * 0.8, 38); K.text('SU GİTTİ, NECMİ AYNI', 0, 14, 36, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}

// kanıt: 10×10 ızgara (99 mavi su + 1 yeşil kuru). Kurudukça mavi kareler gider; yeşil %2 olunca 50 kare kalır.
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.012 * u; ctx.save(); ctx.translate(0, -6 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.6)'; ctx.fillRect(-100, -100, 1280, 2120);
  // kalan kare sayısı: 100 → (d4 sonunda) 80 → (d5'te) 50
  const p1 = ease.state(seg(t, tm.dry0, 1.6)), p2 = ease.state(seg(t, tm.shrink, 1.4));
  const total = Math.round(100 - 20 * p1 - 30 * p2);
  const cell = 64, x0 = 540 - 5 * cell, y0 = 380;
  rect(x0 - 24, y0 - 24, 10 * cell + 48, 10 * cell + 48, PAL.cream, LW, 22);
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10, x = x0 + c * cell, y = y0 + r * cell;
    if (i === 0) { const g = t >= tm.green - 0.04 ? 1 + 0.15 * Math.exp(-Math.pow((t - tm.green - 0.2) / 0.2, 2)) : 1; ctx.save(); ctx.translate(x + cell / 2, y + cell / 2); ctx.scale(g, g); rect(-cell / 2 + 4, -cell / 2 + 4, cell - 8, cell - 8, PAL.green, LW * 0.8, 8); ctx.restore(); continue; }
    if (i >= total) { rect(x + 4, y + 4, cell - 8, cell - 8, null, 2, 8); continue; }   // kurumuş: boş çerçeve
    rect(x + 4, y + 4, cell - 8, cell - 8, '#7FC4E8', LW * 0.5, 8);
  }
  // sağ üstte oran ve ağırlık
  const kg = total;
  rect(700, 1080, 300, 96, INK, 0, 48); text(`${kg} kg`, 850, 1145, 58, kg <= 50 ? PAL.mustard : PAL.paper, 900);
  if (t >= tm.green - 0.04) { rect(80, 1080, 560, 96, PAL.green, LW * 0.8, 48); const pc = (100 / total).toFixed(2).replace(/\.?0+$/, '').replace('.', ','); text(`kuru: 1 kg = %${pc}`, 360, 1143, 44, PAL.paper, 900); }
  if (t >= tm.fifty - 0.04) {
    const v = spring(t - (tm.fifty - 0.04), 420, 26);
    ctx.save(); ctx.translate(540, 760); ctx.rotate(-0.05); ctx.scale(1.6 - 0.6 * v, 1.6 - 0.6 * v); ctx.globalAlpha = clamp01(v * 2);
    rect(-240, -76, 480, 152, PAL.coral, LW * 1.2, 24); text('50 KİLO', 0, 28, 84, PAL.paper, 900); ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 210, y: 2060, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t); drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.fifty, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 880, y: 2070, s: 235, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1290, head: null });
}
