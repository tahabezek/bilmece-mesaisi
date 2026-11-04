// Bölüm 13 · İZİN KURASI (yayın #10, de Bono'nun çakıl taşları). Mekân: Hikmet Bey'in odası, büyük saksıda siyah-beyaz çakıl.
// Torbada iki siyah taş (hile). Defne taşı çekip çakıllara düşürür; torbada kalan siyah → onunki "beyaz" sayılır.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, desk, clock } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    s1: T('h2a:4'), s2: T('h2a:7'), see: T('dsee'), think0: T('h3>'), da: T('da'), d2: T('d2'), n0: T('n0'), hn: T('hn'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), pens: T('n1:0'), lost: T('n1:3'), look: T('n1:8'), rule: T('n1:11'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    draw: T('d4:0'), drop: T('d4:5'), gone: T('d4:7'), open: T('d5:0'), rest: T('d5:3'), white: T('d5:5'),
    happy: T('h4') - 0.15, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1.12, 520, 1050, 'cut'],
    [0.6, 1.16, 480, 1050],
    [L.d1.t0 - 0.05, 1.28, 820, 1060],
    [tm.s1 - 0.3, 1.32, 400, 1050],
    [L.h2b.t0 - 0.05, 1.22, 360, 1040],
    [tm.see - 0.05, 1.36, 820, 1070],
    [L.h3.t0 - 0.05, 1.26, 320, 1040],
    [tm.think0 + 0.1, 1.3, 800, 1060],
    [tm.d2, 1.36, 820, 1070],
    [tm.n0 - 0.1, 1.3, 1160, 1040],
    [tm.hn - 0.05, 1.24, 380, 1040],
    [tm.hc - 0.05, 1.18, 540, 1040],
    [tm.cd - 5, 1.1, 540, 1040],
    [tm.clue - 0.1, 1.3, 1100, 900],
    [tm.look, 1.4, 1120, 880],
    [tm.buldum - 0.05, 1.32, 820, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 330, 1040, 'cut'],
    [T('h4:4'), 1.45, 310, 1020],
    [tm.cta, 1.6, 820, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const hikBase = charBase('hikmet', { x: 230, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 95, el: 30 } });
  const hik = [
    [tm.s1 - 0.4, { head: { tilt: 8, look: [0.6, 0.6] } }, 0.3],
    [L.h2b.t0, { head: { tilt: -4, look: [0.8, 0] } }, 0.3],
    [tm.see, { expr: { brow: 0.02, browTilt: 0.2, eye: 0.8, pupil: 1, curve: 0.5, open: 0.1, w: 1.1 }, head: { tilt: 6, look: [0.9, -0.2] } }, 0.2],
    [L.h3.t0, { expr: 'mutlu' }, 0.3],
    [tm.hn - 0.05, { expr: 'kizgin', head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'mutlu', head: { tilt: 4, look: [0.8, 0] } }, 0.3],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 820, y: 1520, s: 245, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [-0.7, 0.3] } }, 0.35],
    [tm.see - 0.05, { expr: 'saskin', blink: 0, head: { tilt: 8, look: [-0.8, 0.4] }, armR: { sh: 25, el: -165 } }, 0.2, ease.enter],
    [tm.think0 + 0.1, { blink: null, expr: think, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: think2, head: { tilt: 6, look: [-0.5, -0.7] } }, 0.3],
    [tm.n0, { head: { tilt: -4, look: [0.9, 0] }, armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hn + 0.6, { expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.rule, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

function bag(K, x, y, k) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(-60, -40); ctx.quadraticCurveTo(-80, 70, 0, 80); ctx.quadraticCurveTo(80, 70, 60, -40); ctx.closePath(); K.fs('#B98A55', LW / k);
  K.ell(0, -40, 62, 16, '#8C6438', LW / k); K.line(-40, -30, 40, -30, 5 / k, '#6B4A28'); ctx.restore();
}
function stone(K, x, y, r, black) { K.ell(x, y, r, r * 0.8, black ? '#2B2E2C' : '#F1EEE6', LW * 0.8); }
// saksı + siyah/beyaz çakıl (tohumlu, sabit)
function pebblePot(K, x, y) {
  const { poly } = K;
  poly([[x - 120, y - 120], [x + 120, y - 120], [x + 95, y + 60], [x - 95, y + 60]], PAL.coral);
  for (let i = 0; i < 26; i++) { const a = (i * 137.5) % 360 * Math.PI / 180, r = 18 + (i * 7) % 90; stone(K, x + Math.cos(a) * Math.min(100, r), y - 132 + Math.sin(a) * 14 - (i % 3) * 6, 13, i % 2 === 0); }
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1800, floorY: 1500, t });
  clock(K, 1460, 760, 58, 4, 30 + Math.floor(t / 5), t);
  pebblePot(K, 560, 1440);
  const np = charBase('necmi', { x: 1180, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', armL: { sh: 95, el: 10 }, head: { tilt: -6, look: [-0.8, 0.3] } });
  if (t >= tm.hn && t < tm.clue - 0.3) Object.assign(np, { expr: 'saskin' });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 25, el: -160 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  let h = null;
  if (t < tm.cta) {
    const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', armL: { sh: 25, el: -165 }, head: { tilt: -8, look: [0.6, 0.4] } });
    h = drawChar(ctx, 'hikmet', hp, t);
    // torba Hikmet'in sağ elinde; taşlar düşer
    const bx = h.handR[0] + 10, by = h.handR[1] + 70;
    [tm.s1, tm.s2].forEach(a => { const v = clamp01((t - (a - 0.35)) / 0.35); if (v > 0 && v < 1) stone(K, bx, by - 160 + 140 * ease.exit(v), 16, true); });
    bag(K, bx, by, 1.25);
  }
  ctx.restore();

  const heads = { hikmet: h?.head, defne: d?.head, necmi: n?.head };
  if (t >= tm.happy) { const cap = captionAt(tl, t), hd = heads[cap?.line.who]; return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) }); }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 52 }), top = 300 + cardH;
  // Defne'nin gördüğü: torbanın içi (iki siyah)
  const seeEnd = at(tl, 'h3') - 0.25;
  if (t >= tm.see - 0.05 && t < seeEnd + 0.35) {
    const v = spring(t - (tm.see - 0.05), UI[0], UI[1]) * (1 - ease.exit(seg(t, seeEnd, 0.35)));
    ctx.save(); ctx.translate(540, top + 150); ctx.scale(v, v);
    K.rect(-300, -90, 600, 180, '#FBF6EC', LW, 24); stone(K, -210, 0, 40, true); stone(K, -110, 0, 40, true);
    K.text('İKİSİ DE SİYAH', 95, 0, 40, PAL.red, 900); K.text('beyaz yok!', 95, 48, 32, '#6B6355', 800);
    ctx.restore();
  }
  triesCol(K, t, [{ s: 'Hileyi söyle?', t0: tm.d2, strike: at(tl, 'd2:2') + 0.2 }, { s: 'Çekme?', t0: at(tl, 'd2:3'), strike: at(tl, 'd2>') - 0.1 }], { x: 540, y: 1130, gap: 84, size: 52, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: iki kalem, biri kaybolur; kalana bakınca kaybolan anlaşılır
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    const lostU = ease.exit(seg(t, tm.lost, 0.4));
    const pen = (x, col, a) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, -10); ctx.rotate(-0.5); K.rect(-14, -80, 28, 160, col, LW, 8); K.poly([[-14, 80], [14, 80], [0, 110]], '#E8D2A8', LW * 0.7); ctx.restore(); };
    if (t >= tm.pens - 0.04) { pen(-200, PAL.red, 1 - lostU); pen(-60, '#3E86B5', 1); if (lostU > 0.5) K.text('?', -200, 10, 70, PAL.red, 900); }
    if (t >= tm.look - 0.04) { const v = spring(t - (tm.look - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(-60, 110); ctx.scale(v, v); K.text('KALAN: MAVİ', 0, 0, 30, '#3E86B5', 900); ctx.restore(); }
    if (t >= tm.rule - 0.04) { const v = spring(t - (tm.rule - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(180, -10); ctx.scale(v, v); K.rect(-150, -60, 300, 120, PAL.coral, LW * 0.8, 26); K.text('KAYBOLAN:', 0, -12, 30, PAL.paper, 900); K.text('KIRMIZI', 0, 34, 40, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}

// kanıt: torbadan taş çekilir → çakıllara düşer (kaybolur) → torbada kalan siyah → çekilen "beyaz" sayılır
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.02 * u; ctx.save(); ctx.translate(0, -8 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(-100, -100, 1280, 2120);
  // torba solda, saksı sağda (taş soldan sağa uçar)
  const opened = t >= tm.open;
  const wob = t > tm.gone && t < tm.open + 0.4 ? 0.06 * Math.sin((t - tm.gone) * 9) : 0;   // torba titrer: Hikmet gerildi
  ctx.save(); ctx.translate(300, 680); ctx.rotate(wob); ctx.translate(-300, -680); bag(K, 300, 680, 2.6); ctx.restore();
  ctx.save(); ctx.translate(780, 980); ctx.scale(1.5, 1.5); ctx.translate(-780, -980); pebblePot(K, 780, 980); ctx.restore();
  // çekilen taş: torbadan çıkar, yay çizerek saksıya düşer
  if (t >= tm.draw) {
    const a = ease.state(seg(t, tm.draw, 0.6)), b = seg(t, tm.drop - 0.1, 0.55);
    if (b <= 0) stone(K, 300, lerp(680, 470, a), 40, true);
    else if (b < 1) { const x = lerp(300, 780, b), y = lerp(470, 790, b) - Math.sin(Math.PI * b) * 180; stone(K, x, y, 40, true); }
  }
  if (t >= tm.gone - 0.04) { const v = spring(t - (tm.gone - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(780, 620); ctx.scale(v, v); K.circ(0, 0, 70, PAL.cream, LW); text('?', 0, 30, 92, PAL.red, 900); ctx.restore(); }
  // torbada kalan: büyük siyah taş
  if (opened) {
    const v = spring(t - tm.open, UI[0], UI[1]);
    ctx.save(); ctx.translate(300, 450); ctx.scale(v, v); stone(K, 0, 0, 64, true); ctx.restore();
    if (t >= tm.rest - 0.04) { rect(90, 300, 420, 80, INK, 0, 40); text('KALAN: SİYAH', 300, 355, 44, PAL.paper, 900); }
  }
  if (t >= tm.white - 0.04) {
    const v = spring(t - (tm.white - 0.04), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 1130); ctx.scale(v, v);
    rect(-420, -80, 840, 160, PAL.green, LW, 30); stone(K, -350, 0, 36, false);
    text('ÇEKİLEN BEYAZ SAYILIR', 50, 18, 50, PAL.paper, 900);
    ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 210, y: 2060, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t); drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.white, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 880, y: 2070, s: 235, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 70, hu), el: lerp(-30, 40, hu) }, armR: { sh: lerp(20, 70, hu), el: lerp(-30, 40, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1290, head: null });
}
