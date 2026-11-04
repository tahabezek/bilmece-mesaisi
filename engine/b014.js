// Bölüm 14 · MASADAN TAŞAN KLASÖRLER (yayın #11). Mekân: Hikmet Bey'in masası (sağ kenar boşluğa bakar).
// 4 özdeş klasör: üstten aşağı 1/2, 1/4, 1/6, 1/8 kaydırılır → toplam 25/24 > 1: en üstteki tamamen masanın dışında.
// İpucu: Necmi'nin torunu kitap merdivenine "en üstten" başlamış.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, desk, clock, plant } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

const COL = [PAL.teal, PAL.mustard, PAL.coral, '#5E7FA8'];

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    stack: T('h2a:4'), q: T('h2b:2'), think0: T('h3>'), da: T('da'), d2: T('d2'), two: T('d2:2'), fall: T('hd'), n0: T('n0'), hn: T('hn'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), stair: T('n1:3'), top: T('n1:9'), b2: T('n1:12'), b3: T('n1:16'), b4: T('n1:19'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    c1: T('d4:2'), c2: T('d4:6'), c3: T('d4:9'), c4: T('d4:13'), sum: T('d5:0'), air: T('d5:6'),
    happy: T('h4') - 0.15, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1.12, 560, 1050, 'cut'],
    [0.6, 1.16, 600, 1060],
    [L.d1.t0 - 0.05, 1.28, 840, 1060],
    [tm.stack - 0.1, 1.3, 680, 1140],
    [L.h2b.t0 - 0.05, 1.22, 380, 1050],
    [L.h3.t0 - 0.05, 1.28, 300, 1040],
    [tm.think0 + 0.1, 1.3, 820, 1060],
    [tm.d2, 1.36, 760, 1130],
    [tm.fall + 0.6, 1.25, 400, 1060],
    [tm.n0 - 0.1, 1.3, 1160, 1040],
    [tm.hn - 0.05, 1.24, 380, 1040],
    [tm.hc - 0.05, 1.18, 540, 1040],
    [tm.cd - 5, 1.1, 560, 1040],
    [tm.clue - 0.1, 1.3, 1100, 900],
    [tm.top, 1.4, 1120, 880],
    [tm.buldum - 0.05, 1.32, 840, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 420, 1060, 'cut'],
    [T('h4:2'), 1.45, 480, 1080],
    [tm.cta, 1.6, 860, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const hikBase = charBase('hikmet', { x: 170, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const hik = [
    [L.h1.t0 + 0.3, { armR: { sh: 140, el: 10 } }, 0.35, ease.enter],
    [tm.stack - 0.2, { armR: { sh: 70, el: 20 }, head: { tilt: 6, look: [0.9, 0.3] } }, 0.35, ease.enter],
    [L.h2b.t0, { armR: { sh: 150, el: -20 }, head: { tilt: -4, look: [0.7, 0] } }, 0.3, ease.enter],
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.fall - 0.05, { expr: 'mutlu', armR: { sh: 155, el: -5 }, head: { tilt: 6, look: [0.8, 0.3] } }, 0.25, ease.enter],
    [tm.n0, { armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hn - 0.05, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'mutlu', armR: { sh: 25, el: -160 }, armL: { sh: 20, el: -60 } }, 0.3],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 930, y: 1520, s: 245, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [-0.6, 0.5] } }, 0.35],
    [tm.think0 + 0.1, { expr: think, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: 'mutlu', armL: { sh: 80, el: 20 }, armR: { sh: 20, el: -60 }, head: { tilt: 6, look: [-0.9, 0.4] } }, 0.3, ease.enter],
    [tm.fall, { expr: 'saskin', blink: 0, armL: { sh: 25, el: -165 } }, 0.2, ease.enter],
    [tm.n0 + 0.4, { blink: null, armL: { sh: 12, el: -10 }, expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.top, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// klasör (yandan): sağ ucu xr, üst kenarı y, uzunluk len, kalınlık h, açı a (sol alt köşe etrafında değil, merkez etrafında)
function folder(K, xr, y, len, h, col, a = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(xr - len / 2, y + h / 2); ctx.rotate(a);
  K.rect(-len / 2, -h / 2, len, h, col, LW, 6); K.rect(len / 2 - 26, -h / 2 + 6, 16, h - 12, PAL.cream, LW * 0.5, 3);
  ctx.restore();
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1800, floorY: 1500, t });
  clock(K, 1460, 760, 58, 2, 40 + Math.floor(t / 5), t);
  plant(K, 1650, 1500, 0.9, t);
  const np = charBase('necmi', { x: 1200, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', armL: { sh: 140, el: 10 }, head: { tilt: -6, look: [-0.8, -0.2] } });
  if (t >= tm.hn && t < tm.clue - 0.3) Object.assign(np, { expr: 'saskin' });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 25, el: -160 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  let h = null;
  if (t < tm.cta) { const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', armR: { sh: 95, el: 5 }, head: { tilt: -8, look: [0.9, 0.2] } });
    h = drawChar(ctx, 'hikmet', hp, t); }
  // masa: sağ kenarı x=660
  desk(K, 300, 1300, 420, { h: 200 });
  const edge = 720, len = 260, fh = 44, y0 = 1300 - fh;
  const after = t >= tm.happy;   // kanıttan sonra masada 4'lü yığın kalır (süreklilik)
  if (!after) folder(K, edge + len / 2, y0, len, fh, COL[0]);   // yarısı dışarıda (kare 0'dan itibaren)
  if (after) { // mutlu sahne: kanıttaki 4'lü yığın masada
    const off = [len / 8, len / 8 + len / 6, len / 8 + len / 6 + len / 4, len / 8 + len / 6 + len / 4 + len / 2];
    for (let k = 0; k < 4; k++) folder(K, edge + off[k], y0 - k * fh, len, fh, COL[3 - k]);
  } else if (t >= tm.two - 0.04) {
    // Defne'nin denemesi: ikincisi de yarım kayar → düşer
    const f = clamp01((t - tm.fall) / 0.6), x = edge + len, y = y0 - fh;
    if (f <= 0) folder(K, x, y, len, fh, COL[1]);
    else if (f < 1) folder(K, x + 60 * f, y + 230 * f * f, len, fh, COL[1], 1.2 * f);
    else folder(K, x + 60, y + 230, len, fh, COL[1], 1.2);
  }
  ctx.restore();

  const heads = { hikmet: h?.head, defne: d?.head, necmi: n?.head };
  if (t >= tm.happy) { const cap = captionAt(tl, t), hd = heads[cap?.line.who]; return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) }); }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 52 }), top = 300 + cardH;
  triesCol(K, t, [{ s: 'Yarım + yarım?', t0: tm.two, strike: tm.fall + 0.1 }], { x: 540, y: 1130, gap: 84, size: 52, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: torunun kitap merdiveni, üstten aşağı
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    K.rect(-360, 110, 330, 22, PAL.woodTop, LW * 0.6, 4);
    const books = [[tm.stair, 3], [tm.b2, 2], [tm.b3, 1], [tm.b4, 0]];   // üstten aşağı belirir
    const xr = [-60, 0, 70, 160];
    books.forEach(([a, k]) => { if (t < a - 0.04) return; const v = spring(t - (a - 0.04), UI[0], UI[1]); ctx.save(); ctx.globalAlpha = clamp01(v * 2); folder(K, xr[k], 110 - (k + 1) * 40, 210, 40, COL[3 - k]); ctx.restore(); });
    if (t >= tm.top - 0.04) { const v = spring(t - (tm.top - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(200, -80); ctx.scale(v, v); K.rect(-150, -40, 300, 80, PAL.coral, LW * 0.8, 40); K.text('EN ÜSTTEN', 0, -2, 32, PAL.paper, 900); K.text('BAŞLA', 0, 28, 28, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}

// kanıt: masa solda (kenar x=330). 4 klasör önce hizalı; üstten aşağı kaydırılır.
function proof(K, t, tl, S) {
  const { ctx, rect, text, line } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.03 * u; ctx.save(); ctx.translate(-5 * u, -8 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(-100, -100, 1280, 2120);
  const edge = 520, Lb = 400, fh = 74, yT = 1050;
  rect(-100, yT, edge + 100, 40, PAL.woodTop, LW, 6); rect(-80, yT + 40, edge + 50, 260, PAL.wood, LW);
  const st = [ease.state(seg(t, tm.c1, 0.6)) * Lb / 2, ease.state(seg(t, tm.c2, 0.6)) * Lb / 4, ease.state(seg(t, tm.c3, 0.6)) * Lb / 6, ease.state(seg(t, tm.c4, 0.6)) * Lb / 8];
  // blok k (0 = en alt): sağ ucu = kenar + (alttakilerin toplam kayması)
  const right = k => edge + st[3] + (k >= 1 ? st[2] : 0) + (k >= 2 ? st[1] : 0) + (k >= 3 ? st[0] : 0);
  // vuruşta boşluğa yaklaş: kenar ile en üst klasörün sol ucu arası
  const zu = ease.state(seg(t, tm.air - 0.4, 1.6)), fx = edge + 10, fy = yT - 3.5 * fh;
  ctx.save(); ctx.translate(lerp(fx, 380, zu), lerp(fy, 760, zu)); ctx.scale(1 + 1.0 * zu, 1 + 1.0 * zu); ctx.translate(-fx, -fy);
  for (let k = 0; k < 4; k++) folder(K, right(k), yT - (k + 1) * fh, Lb, fh, COL[3 - k]);
  const lab = [[tm.c1, 3, '1/2'], [tm.c2, 2, '1/4'], [tm.c3, 1, '1/6'], [tm.c4, 0, '1/8']];
  lab.forEach(([a, k, s]) => { if (t < a - 0.04) return; const v = spring(t - (a - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(right(k) - 110, yT - (k + 0.5) * fh + 15); ctx.scale(v, v); text(s, 0, 0, 44, PAL.paper, 900); ctx.restore(); });
  ctx.save(); ctx.setLineDash([14, 12]); line(edge, yT, edge, yT - 4 * fh - 120, 5, PAL.paper); ctx.restore();
  if (t >= tm.air - 0.04) {
    const lx = right(3) - Lb, yy = yT - 4 * fh - 30;
    line(edge, yy, lx, yy, 6, PAL.green); line(edge, yy - 14, edge, yy + 14, 5, PAL.green); line(lx, yy - 14, lx, yy + 14, 5, PAL.green);
    ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = PAL.green; ctx.fillRect(edge, yT - 4 * fh, lx - edge, fh); ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  if (t >= tm.air - 0.04) { const v = spring(t - (tm.air - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(540, 360); ctx.scale(v, v); rect(-300, -60, 600, 120, PAL.green, LW, 30); text('TAMAMEN HAVADA', 0, 20, 58, PAL.paper, 900); ctx.restore(); }
  if (t >= tm.sum - 0.04) {
    const v = spring(t - (tm.sum - 0.04), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 1170); ctx.scale(v, v); rect(-440, -52, 880, 104, INK, 0, 52); text('1/2 + 1/4 + 1/6 + 1/8 = 1,04 klasör', 0, 18, 46, PAL.paper, 900); ctx.restore();
  }
  const dp = charBase('defne', { x: 210, y: 2080, s: 245, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t); drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.air, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 880, y: 2090, s: 235, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1290, head: null });
}
