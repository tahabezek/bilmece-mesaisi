// Bölüm 4 · ÇANTA. Mekân: muhasebe köşesi (solda Necmi Abi'nin defter ve kasası, sağda Defne'nin masası).
// Kanca: müdür kendi bilmecesini yanlış biliyor (1 lira); kanıt defter sayfasında satır satır (+3).
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, windowIst, desk, monitor, riddleCard, clock } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

const BAGS = ['#B5523B', '#2F7F7A', '#D19A2E', '#7E5A9A', '#5E9A4E'];
const ROWS = [['AL', -5], ['SAT', 6], ['AL', -7], ['SAT', 8], ['AL', -9], ['SAT', 10]];

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    chips: [[T('h2a:0'), T('h2a:2')], [T('h2b:0'), T('h2b:3')], [T('h2c:0'), T('h2c:2')]],
    wallet: T('h2d:4'), offer: T('h3:2'), think0: T('h3>'), clue: T('n1'), cd: T(ep.countdown), dq: T('dq'), hq: T('hq'),
    tries: [T('d2:2'), T('d2:10')], bravo: T('h4'), ledgerTap: T('n1:5'),
    buldum: T('d3'), proof: T('d3:2') + 0.25,
    rows: [T('d4a:0'), T('d4a:2'), T('d4b:0'), T('d4b:2'), T('d4c:0'), T('d4c:2')], total: T('d4c:4'),
    defeat: T('d4c>') + 0.1, cta: T('d5') - 0.2, end: T('d5>') + 0.1,
  };
  const cam = [
    [0, 1, 560, 960, 'cut'],
    [0.5, 1.06, 580, 1000],
    [L.h2a.t0, 1.15, 560, 990],
    [L.h2d.t0, 1.22, 520, 975],
    [tm.think0 + 0.1, 1.25, 760, 1080],
    [L.d2.t0, 1.18, 740, 1060],
    [tm.bravo, 1.22, 520, 1000],
    [tm.dq, 1.25, 760, 1080],
    [tm.hq, 1.22, 520, 1000],
    [tm.cd - 5, 1.08, 600, 1020],
    [tm.clue - 0.1, 1.35, 230, 1060],
    [tm.buldum, 1.3, 760, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.defeat, 1.5, 480, 1030, 'cut'],
    [tm.cta, 1.65, 790, 1110, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 480, y: 1520, s: 255, expr: 'mutlu', head: { tilt: -6, look: [0.6, 0.1] }, armL: { sh: 16, el: -62 }, armR: { sh: 16, el: -62 } });
  const hik = [
    [L.h2a.t0, { head: { tilt: 4, look: [0.5, -0.2] } }],
    [L.h2d.t0 + 0.3, { armR: { sh: 25, el: -150 }, head: { tilt: -6, look: [0.6, 0.2] } }, 0.35, ease.enter],
    [tm.offer - 0.1, { armR: { sh: 70, el: -60 }, head: { tilt: 8, look: [0.8, 0] } }, 0.35, ease.enter],
    [tm.think0 + 0.4, { armR: { sh: 16, el: -62 }, head: { tilt: -4, look: [0.7, 0.2] } }],
    [tm.bravo - 0.05, { expr: { brow: 0.06, browTilt: -0.15, eye: 0.6, pupil: 1, curve: 0.85, open: 0.45, w: 1.3, smileEyes: true }, armR: { sh: 160, el: 10 }, head: { tilt: 8, look: [0.4, -0.3] } }, 0.3, ease.enter],   // yığın sol elde kalır
    [tm.clue + 0.2, { expr: 'saskin', armR: { sh: 16, el: -62 }, armL: { sh: 16, el: -62 }, head: { tilt: -6, look: [-0.9, 0.1] } }, 0.35],
    [tm.buldum, { head: { tilt: 6, look: [0.9, 0] } }, 0.25],
    [tm.defeat, { expr: 'korku', head: { tilt: 10, look: [0, 0.6] }, armR: { sh: 15, el: 10 }, armL: { sh: 15, el: 10 } }, 0.3],
    [L.h5.t0 + 0.8, { expr: 'yorgun', head: { tilt: 14, look: [0.2, 0.8] }, lean: 6 }, 0.7],
  ];
  const defBase = charBase('defne', { x: 800, y: 1590, s: 280, expr: 'notr', head: { tilt: -4, look: [-0.7, 0.2] }, armL: { sh: 25, el: -60 }, armR: { sh: 25, el: -60 } });
  const def = [
    [L.d1.t0, { expr: 'saskin', head: { tilt: 8, look: [-0.9, -0.3] } }, 0.25],
    [L.h2a.t0 + 0.3, { expr: 'notr', head: { tilt: -4, look: [-0.7, -0.4] } }],
    [tm.think0 + 0.1, { expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: -10, look: [-0.3, -0.9] }, armR: { sh: 18, el: -168 }, armL: { sh: 22, el: -120 } }],
    [tm.tries[1], { expr: 'mutlu', head: { tilt: 6, look: [-0.6, -0.2] }, armR: { sh: 25, el: -60 }, armL: { sh: 25, el: -60 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -6, look: [-0.9, 0.1] } }, 0.35],
    [tm.ledgerTap, { expr: 'saskin', blink: 0, head: { tilt: 4, look: [-0.9, -0.2] } }, 0.25, ease.enter],
    [tm.buldum - 0.05, { y: 1470, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1590, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 }, armL: { sh: 20, el: -60 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

function bag(K, x, y, col, k = 1, rot = 0) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  ctx.beginPath(); ctx.arc(0, -46, 26, Math.PI, 0); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke();
  K.poly([[-62, -40], [62, -40], [72, 34], [-72, 34]], col, LW);
  K.rect(-14, -24, 28, 18, PAL.paper, LW * 0.6, 4);
  ctx.restore();
}

// Necmi Abi'nin masası: defter (açık sayfa) ve kasa
function necmiDesk(K, t, tl, S) {
  const { ctx } = K, { tm } = S;
  const up = ease.enter(seg(t, tm.clue - 0.3, 0.4)), tap = ease.enter(seg(t, tm.ledgerTap - 0.1, 0.3));
  const p = charBase('necmi', { x: 215, y: 1500, s: 220, expr: up > 0.5 ? 'notr' : 'yorgun', head: { tilt: lerp(14, -4, up), look: [lerp(0.2, 0.9, up), lerp(0.8, 0, up)] },
    armR: { sh: lerp(20, 40, Math.max(tap, up)), el: lerp(-120, -100, Math.max(tap, up)) }, armL: { sh: 20, el: -120 } });
  p.talk = talkAt(tl, 'necmi', t);
  const n = drawChar(ctx, 'necmi', p, t);
  desk(K, -20, 1340, 440);
  // defter + kasa
  if (!(t >= tm.clue + 0.2 && t < tm.buldum)) { K.rect(60, 1288, 230, 56, PAL.paper, LW, 6); K.line(175, 1290, 175, 1342, 4); }
  for (let i = 0; i < 3; i++) { K.line(56, 1302 + i * 12, 140, 1302 + i * 12, 3, '#9C9384'); K.line(170, 1302 + i * 12, 254, 1302 + i * 12, 3, '#9C9384'); }
  K.rect(310, 1268, 110, 76, PAL.metal, LW, 8); K.rect(338, 1282, 54, 14, INK, 0, 4);
  if (t >= tm.clue + 0.2 && t < tm.buldum) {   // defter elde, açık sayfa izleyiciye dönük
    const lu = ease.enter(seg(t, tm.clue + 0.2, 0.4));
    ctx.save(); ctx.translate(n.handR[0] + 40, lerp(1290, n.handR[1] - 30, lu)); ctx.rotate(-0.08 * lu);
    K.rect(-110, -78, 220, 150, PAL.paper, LW, 6); K.line(0, -76, 0, 70, 4);
    for (let i = 0; i < 5; i++) { K.line(-96, -54 + i * 24, -14, -54 + i * 24, 3, '#9C9384'); K.line(14, -54 + i * 24, 96, -54 + i * 24, 3, '#9C9384'); }
    ctx.restore();
  }
  return n;
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.defeat) return ledger(K, t, tl, S);

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1500, floorY: 1500, t });
  windowIst(K, 330, 620, 260, 220, t);
  const n = necmiDesk(K, t, tl, S);
  // Defne (masasında)
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const hideD = t >= tm.defeat && t < tm.cta;
  const d = hideD ? null : drawChar(ctx, 'defne', dp, t);
  desk(K, 560, 1340, 560);
  monitor(K, 990, 1130, 200);
  // Hikmet Bey (önde, kucağında çantalar); yenilgide çantalar tek tek düşer
  const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
  const h = t >= tm.cta ? null : drawChar(ctx, 'hikmet', hp, t);
  if (h) {
    const hx = h.handL[0] + 0.32 * hp.s, hy = h.handL[1];   // yığın sol elde (sağ el jest yapabilir)
    const given = ease.state(seg(t, tm.offer - 0.1, 0.4)) * (1 - ease.state(seg(t, tm.think0 + 0.4, 0.4)));
    BAGS.forEach((c, i) => {
      const fallT = tm.defeat + 0.25 + i * 0.22, f = Math.max(0, t - fallT);
      let x = hx + (i % 2 ? 6 : -6), y = hy - 6 - i * 40, r = (i % 2 ? 0.05 : -0.04);
      if (i === 4 && t < tm.defeat) { x += given * 150; y += given * 40; }
      if (f > 0) { x += f * (i % 2 ? 140 : -120); y = Math.min(1700, y + 900 * f * f); r += f * (i % 2 ? 3 : -3); }
      bag(K, x, y, c, 0.66, r);
    });
  }
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.defeat) return caption(K, captionAt(tl, t), { y: 300, head: toScreen(cam, t >= tm.cta ? d.head : h.head) });
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
  // fiyat çipleri: al → sat; düşünme başlayınca kalkar
  const out = 1 - ease.exit(seg(t, tm.think0, 0.3));
  if (out > 0) tm.chips.forEach(([a, b], i) => {
    if (t < a - 0.04) return;
    const u = spring(t - (a - 0.04), UI[0], UI[1]) * out, x = 260 + i * 280, y = 300 + cardH + 90;
    ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
    K.rect(-120, -46, 240, 92, PAL.cream, LW, 46);
    K.text(String(ROWS[i * 2][1] * -1), -60, 20, 54, PAL.red, 900);
    if (t >= b - 0.04) { const v = spring(t - (b - 0.04), UI[0], UI[1]); K.text('→', 0, 18, 46, INK, 900); ctx.save(); ctx.translate(62, 0); ctx.scale(v, v); K.text(String(ROWS[i * 2 + 1][1]), 0, 20, 54, PAL.green, 900); ctx.restore(); }
    ctx.restore();
  });
  // Defne'nin yanlış hesabı
  triesCol(K, t, [{ s: '+1 −1 +1 −1 +1', t0: tm.tries[0] }, { s: '= 1 KÂR?', t0: tm.tries[1] }], { x: 500, y: 600, gap: 74, size: 52, fadeAt: tm.bravo - 0.1 });
  countdown(K, t, tm.cd, { top: 300 + cardH + 20 });
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' ? n.head : null;
  caption(K, cap, { y: 1250, head: head && toScreen(cam, head) });
}

// kanıt: defter sayfası satır satır dolar; KASA sütunu −5, +1, −6, +2, −7, +3
function ledger(K, t, tl, S) {
  const { ctx, rect, text, line } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.012 * u; ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, t });
  ctx.fillStyle = 'rgba(31,36,33,0.45)'; ctx.fillRect(0, 0, 1080, 1920);
  const inU = spring(u, 120, 24);
  ctx.save(); ctx.translate(540, 840); ctx.scale(0.85 + 0.15 * inU, 0.85 + 0.15 * inU); ctx.translate(-540, -840);
  rect(170, 470, 740, 660, INK, 0, 18); rect(160, 460, 740, 660, PAL.paper, LW, 18);
  text('İŞLEM', 310, 528, 44, '#4A4438', 900); text('TUTAR', 550, 528, 44, '#4A4438', 900); text('KASA', 770, 528, 44, '#4A4438', 900);
  line(180, 552, 880, 552, 4, '#9C9384'); line(440, 480, 440, 1100, 3, '#C9BFA9'); line(660, 480, 660, 1100, 3, '#C9BFA9');
  let kasa = 0;
  ROWS.forEach(([k, v], i) => {
    kasa += v;
    const a = tm.rows[i] - 0.04; if (t < a) return;
    const ru = spring(t - a, UI[0], UI[1]), y = 610 + i * 86;
    ctx.save(); ctx.globalAlpha = clamp01(ru * 1.4);
    text(`${k} ${Math.abs(v)}`, 310, y + 18, 50, INK, 800);
    text((v > 0 ? '+' : '−') + Math.abs(v), 550, y + 18, 54, v > 0 ? PAL.green : PAL.red, 900);
    text((kasa > 0 ? '+' : kasa < 0 ? '−' : '') + Math.abs(kasa), 770, y + 18, 54, INK, 900);
    if (i % 2 === 1) line(190, y + 40, 870, y + 40, 3, '#D8CDB8');
    ctx.restore();
  });
  // sonuç
  if (t >= tm.total - 0.04) {
    const v = spring(t - (tm.total - 0.04), UI[0], UI[1]);
    ctx.save(); ctx.translate(730, 1200); ctx.scale(v, v);
    rect(-120, -50, 240, 96, PAL.coral, LW, 48); text('+3', 0, 24, 64, PAL.paper, 900); ctx.restore();
    ctx.save(); ctx.globalAlpha = v; K.rect(200, 1150, 360, 96, PAL.cream, LW, 48); text('3 LİRA KÂR', 380, 1218, 52, PAL.green, 900); ctx.restore();
  }
  ctx.restore();
  // altta: Defne gösterir, Hikmet Bey çantalarına sarılmış
  const k = tm.rows.filter(r => t >= r).length;
  const dp = charBase('defne', { x: 280, y: 1910, s: 250, expr: 'mutlu', armR: { sh: 140 + (k % 2) * 20, el: -20 }, armL: { sh: 20, el: 10 }, head: { tilt: k % 2 ? 6 : -4, look: [0.5, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.total, 0.4));
  const hp = charBase('hikmet', { x: 800, y: 1930, s: 235, expr: hu > 0.5 ? 'korku' : 'saskin', head: { tilt: lerp(-6, 10, hu), look: [-0.5, -0.6] }, armL: { sh: lerp(16, 150, hu), el: lerp(-62, 130, hu) }, armR: { sh: lerp(16, 150, hu), el: lerp(-62, 130, hu) } });
  const h = drawChar(ctx, 'hikmet', hp, t);
  if (hu < 0.15) BAGS.slice(0, 3).forEach((c, i) => bag(K, (h.handL[0] + h.handR[0]) / 2, Math.min(h.handL[1], h.handR[1]) - 6 - i * 36, c, 0.58));
  ctx.restore();
  caption(K, captionAt(tl, t), { y: 300, head: null });
  void d;
}
