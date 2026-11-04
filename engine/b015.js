// Bölüm 15 · YAKA KARTLARI (yayın #12). Mekân: genel müdürlük sınav odası; Hikmet ile Defne yan yana, sırtlarında renkli kart.
// Plan: Defne gördüğünü yazar ("aynı"), Hikmet gördüğünün tersini yazar ("farklı") → her durumda biri doğru.
// İpucu: Necmi ile hanımı biri "aynı" biri "farklı" der. Kanıt: 4 satırlık tablo.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, clock, plant } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

const RED = PAL.red, BLUE = '#3E86B5';
const X = { hikmet: 300, defne: 760 };

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    cards: T('h2a:5'), see: T('h2a:7'), blind: T('h2b:0'), write: T('h2b:7'), one: T('h2c:0'), plan: T('h2c:6'),
    think0: T('h3>'), da: T('da'), d2: T('d2'), hd: T('hd'), n0: T('n0'), hn: T('hn'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), ayni: T('n1:6'), farkli: T('n1:9'), hakli: T('n1:14'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    dcol: T('d4:0'), dfill: T('d4:7'), hcol: T('d5:0'), hfill: T('d5:5'), rows: T('d5:6'), win: T('d5:11'),
    happy: T('h4') - 0.15, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1.12, 540, 1050, 'cut'],
    [0.6, 1.16, 500, 1050],
    [L.d1.t0 - 0.05, 1.28, 760, 1060],
    [tm.cards - 0.2, 1.12, 540, 1040],
    [L.h2b.t0 - 0.05, 1.2, 420, 1040],
    [tm.one - 0.05, 1.16, 540, 1040],
    [L.h3.t0 - 0.05, 1.28, 320, 1040],
    [tm.think0 + 0.1, 1.3, 760, 1060],
    [tm.d2, 1.36, 740, 1070],
    [tm.hd - 0.05, 1.26, 330, 1040],
    [tm.n0 - 0.1, 1.3, 1160, 1040],
    [tm.hn - 0.05, 1.22, 420, 1040],
    [tm.hc - 0.05, 1.16, 540, 1040],
    [tm.cd - 5, 1.1, 540, 1040],
    [tm.clue - 0.1, 1.3, 1100, 900],
    [tm.farkli, 1.4, 1120, 880],
    [tm.buldum - 0.05, 1.32, 760, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 360, 1040, 'cut'],
    [T('h4:4'), 1.45, 340, 1020],
    [tm.cta, 1.6, 760, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const hikBase = charBase('hikmet', { x: X.hikmet, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const hik = [
    [L.h1.t0 + 0.3, { armR: { sh: 140, el: 10 } }, 0.35, ease.enter],
    [tm.cards - 0.2, { armR: { sh: 25, el: -160 }, head: { tilt: 4, look: [0.9, 0] } }, 0.3],
    [tm.blind, { armR: { sh: 20, el: -60 }, head: { tilt: -6, look: [-0.4, -0.3] } }, 0.3],
    [tm.one, { armR: { sh: 150, el: -20 }, head: { tilt: 4, look: [0.8, 0] } }, 0.3, ease.enter],
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.hd - 0.05, { expr: 'kizgin', armR: { sh: 155, el: -5 }, head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.n0, { expr: 'mutlu', armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hn - 0.05, { expr: 'kizgin', armL: { sh: 70, el: 40 }, armR: { sh: 70, el: 40 }, head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'mutlu', armR: { sh: 25, el: -160 }, armL: { sh: 20, el: -60 } }, 0.3],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: X.defne, y: 1520, s: 245, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [-0.8, 0] } }, 0.35],
    [tm.think0 + 0.1, { expr: think, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: 'mutlu', armL: { sh: 95, el: 10 }, armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [-0.9, 0] } }, 0.3, ease.enter],
    [tm.hd + 0.2, { expr: 'saskin', blink: 0, armL: { sh: 12, el: -10 } }, 0.2],
    [tm.n0 + 0.4, { blink: null, expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.hakli, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// sırttaki kart (karakterin arkasında, omuzdan görünür)
function backCard(K, x, y, s, col, side, u) {
  if (u <= 0) return;
  const { ctx } = K; ctx.save(); ctx.translate(x + side * 0.52 * s, y - 2.2 * s); ctx.rotate(side * 0.22); ctx.scale(u, u);
  K.rect(-46, -62, 92, 124, col, LW, 10); K.rect(-30, -44, 60, 12, 'rgba(255,255,255,0.6)', 0, 4); ctx.restore();
}
function chip(K, x, y, col, w = 70, h = 46) { K.rect(x - w / 2, y - h / 2, w, h, col, LW * 0.8, 10); }
function check(K, x, y, ok, u) {
  if (u <= 0) return; const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
  K.circ(0, 0, 30, ok ? PAL.green : '#B9B2A2', LW * 0.8); K.text(ok ? '✓' : '✗', 0, 13, 36, PAL.paper, 900); ctx.restore();
}
function gaze(K, a, b, lift, col) {
  const { ctx } = K, mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - lift;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(mx, my, b[0], b[1]);
  ctx.lineWidth = LW * 1.6 + 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = LW * 1.6; ctx.strokeStyle = col; ctx.stroke();
  const ang = Math.atan2(b[1] - my, b[0] - mx); ctx.save(); ctx.translate(b[0], b[1]); ctx.rotate(ang); K.poly([[10, 0], [-22, -16], [-22, 16]], col, LW * 0.8); ctx.restore();
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1800, floorY: 1500, t });
  clock(K, 1460, 760, 58, 11, 50 + Math.floor(t / 5), t);
  plant(K, -60, 1500, 0.9, t);
  const np = charBase('necmi', { x: 1200, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', armL: { sh: 140, el: 10 }, head: { tilt: -6, look: [-0.8, -0.2] } });
  if (t >= tm.hn && t < tm.clue - 0.3) Object.assign(np, { expr: 'saskin' });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 25, el: -160 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  const cu = t >= tm.cards ? spring(t - tm.cards, UI[0], UI[1]) : 0;
  // kartlar karakterin arkasında: Hikmet KIRMIZI, Defne MAVİ (izleyici görür)
  if (t < tm.cta) backCard(K, X.hikmet, 1500, 250, RED, -1, cu);
  backCard(K, X.defne, 1520, 245, BLUE, 1, cu);
  let h = null;
  if (t < tm.cta) { const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', armR: { sh: 25, el: -160 }, head: { tilt: -8, look: [0.9, 0.2] } });
    h = drawChar(ctx, 'hikmet', hp, t); }
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  // bakışlar: herkes yalnız ötekinin kartını görür
  const gv = t >= tm.see && t < tm.think0 + 1 && h;
  if (gv) {
    ctx.save(); ctx.globalAlpha = clamp01((t - tm.see) / 0.3) * (1 - clamp01((t - tm.think0 - 0.6) / 0.4));
    gaze(K, [h.head[0] + 40, h.head[1] - 200], [X.defne + 0.52 * 245, 1520 - 2.2 * 245 - 80], 170, PAL.mustard);
    gaze(K, [d.head[0] - 40, d.head[1] - 200], [X.hikmet - 0.52 * 250, 1500 - 2.2 * 250 - 80], 120, PAL.mustard);
    ctx.restore();
  }
  ctx.restore();

  const heads = { hikmet: h?.head, defne: d?.head, necmi: n?.head };
  if (t >= tm.happy) { const cap = captionAt(tl, t), hd = heads[cap?.line.who]; return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) }); }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 52 }), top = 300 + cardH;
  triesCol(K, t, [{ s: 'İkimiz de KIRMIZI? %75', t0: tm.d2, strike: tm.hd + 0.1 }], { x: 540, y: 1150, gap: 84, size: 46, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: Necmi ile hanımı
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    K.text('NECMİ İLE HANIMI', 0, -108, 30, '#6B6355', 900);
    const pill = (a, x, y, label, fill) => { if (t < a - 0.04) return; const v = spring(t - (a - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(x, y); ctx.scale(v, v); K.rect(-160, -40, 320, 80, fill, LW * 0.8, 40); K.text(label, 0, 14, 36, PAL.paper, 900); ctx.restore(); };
    pill(tm.ayni, -170, -35, 'HANIM: AYNI', PAL.teal);
    pill(tm.farkli, 170, -35, 'NECMİ: FARKLI', PAL.mustard);
    pill(tm.hakli, 0, 70, 'BİRİ HEP HAKLI', PAL.coral);
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}

// kanıt: 4 durum × (Defne'nin kartı, Hikmet'in kartı, Defne yazar = Hikmet'inki, Hikmet yazar = Defne'ninkinin tersi)
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.014 * u; ctx.save(); ctx.translate(0, -7 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.6)'; ctx.fillRect(-100, -100, 1280, 2120);
  const C = [RED, BLUE], cx = [150, 310, 600, 880], hy = 380;
  rect(40, hy - 50, 1000, 620, PAL.cream, LW, 26);
  text("Defne'nin", cx[0], hy - 18, 28, '#6B6355', 900); text('kartı', cx[0], hy + 14, 28, '#6B6355', 900); text("Hikmet'in", cx[1], hy - 18, 28, '#6B6355', 900); text('kartı', cx[1], hy + 14, 28, '#6B6355', 900);
  if (t >= tm.dcol - 0.04) text('Defne yazar', cx[2], hy, 32, INK, 900);
  if (t >= tm.hcol - 0.04) text('Hikmet yazar', cx[3], hy, 32, INK, 900);
  const R = [[0, 0], [0, 1], [1, 0], [1, 1]];   // [Defne, Hikmet] renk indeksleri
  R.forEach(([dc, hc], i) => {
    const y = hy + 90 + i * 120, same = dc === hc, hi = t >= tm.rows - 0.04 + i * 0.12;
    if (hi) { ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = same ? PAL.teal : PAL.mustard; ctx.fillRect(56, y - 52, 968, 104); ctx.restore(); }
    chip(K, cx[0], y, C[dc]); chip(K, cx[1], y, C[hc]);
    if (t >= tm.dfill - 0.04 + i * 0.1) { chip(K, cx[2] - 40, y, C[hc]); check(K, cx[2] + 50, y, hc === dc, spring(t - (tm.dfill + i * 0.1), UI[0], UI[1])); }
    if (t >= tm.hfill - 0.04 + i * 0.1) { chip(K, cx[3] - 40, y, C[1 - dc]); check(K, cx[3] + 50, y, 1 - dc === hc, spring(t - (tm.hfill + i * 0.1), UI[0], UI[1])); }
    if (hi) text(same ? 'aynı' : 'farklı', 480, y + 52, 24, same ? PAL.teal : '#A87A1E', 900);
  });
  if (t >= tm.win - 0.04) {
    const v = spring(t - (tm.win - 0.04), 420, 26);
    ctx.save(); ctx.translate(540, 1130); ctx.rotate(-0.05); ctx.scale(1.6 - 0.6 * v, 1.6 - 0.6 * v); ctx.globalAlpha = clamp01(v * 2);
    rect(-330, -66, 660, 132, PAL.green, LW * 1.2, 22); text('HER SATIRDA BİR ✓', 0, 22, 58, PAL.paper, 900); ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 210, y: 1960, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t); drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.win, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 880, y: 1970, s: 235, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1300, head: null });
}
