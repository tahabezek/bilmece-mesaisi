// Bölüm 9 · ÇAY OCAĞI. Mekân: koridor kavşağı, iki yönlü tabela (← ARŞİV · ÇAY OCAĞI →). Necmi Abi sandalyede bulmaca çözer.
// İpucu: "Bu cümle yanlıştır." (yalancı paradoksu). Kanıt: döngü. Çay ocağı → cümle doğru → arşiv → cümle yanlış → çay ocağı…
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, plant } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    arsiv: T('h2a:6'), cay: T('h2b:1'), never: T('h2b:4'),
    think0: T('h3>'), da: T('da'), neither: T('da:10'), d2: T('d2'), hd: T('hd'), d2b: T('d2b'), hd2: T('hd2'),
    n0: T('n0'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), sent: T('n1:4'), loop1: T('n1:7'), loop2: T('n1:9'), burn: T('n1:11'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    quote: T('d4:2'), toCay: T('h4:1'), dogru: T('d5:3'), toArs: T('h5:1'), yanlis: T('d6:3'), back: T('d6:6'),
    crash: T('d6>') + 0.05, cta: T('d7') - 0.2, end: T('d7>') + 0.1,
  };
  const cam = [
    [0, 1, 560, 960, 'cut'],
    [0.5, 1.05, 540, 990],
    [tm.arsiv - 0.1, 1.15, 480, 960],
    [tm.never - 0.1, 1.25, 330, 1020],
    [L.h3.t0 - 0.05, 1.3, 300, 1040],
    [tm.think0 + 0.1, 1.3, 800, 1060],
    [tm.d2 - 0.05, 1.3, 680, 1060],
    [tm.hd - 0.05, 1.18, 520, 880],
    [tm.d2b - 0.05, 1.3, 680, 1060],
    [tm.hd2 - 0.05, 1.18, 560, 880],
    [tm.n0 - 0.1, 1.32, 1200, 1060],
    [tm.hc - 0.05, 1.3, 280, 1040],
    [tm.cd - 5, 1.1, 560, 1000],
    [tm.clue - 0.1, 1.32, 1120, 900],
    [tm.loop1, 1.42, 1140, 880],
    [tm.buldum - 0.05, 1.3, 820, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.cta, 1.6, 820, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 190, y: 1500, s: 255, expr: 'mutlu', head: { tilt: -4, look: [0.5, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const hik = [
    [L.h1.t0 + 0.1, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -6, look: [0.9, 0] } }, 0.3, ease.enter],
    [L.d1.t0 + 0.2, { expr: 'notr', armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } }, 0.35],
    [tm.arsiv - 0.1, { expr: 'mutlu', armR: { sh: 150, el: -10 }, head: { tilt: 6, look: [0.3, -0.6] } }, 0.35, ease.enter],
    [tm.cay - 0.1, { armR: { sh: 20, el: -60 }, armL: { sh: 150, el: -10 }, head: { tilt: -6, look: [-0.3, -0.6] } }, 0.35, ease.enter],
    [tm.never - 0.1, { armL: { sh: 20, el: -60 }, armR: { sh: 25, el: -160 }, head: { tilt: 4, look: [0.7, 0] } }, 0.3],
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.hd - 0.05, { expr: 'mutlu', armR: { sh: 150, el: -10 }, head: { tilt: 6, look: [0.6, -0.4] } }, 0.25, ease.enter],
    [tm.d2b - 0.05, { armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hd2 - 0.05, { expr: 'kizgin', armL: { sh: 150, el: -10 }, head: { tilt: -6, look: [0.8, -0.2] } }, 0.25, ease.enter],
    [tm.n0, { expr: 'notr', armL: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0] } }, 0.3],
    [tm.hc - 0.05, { expr: 'mutlu', armR: { sh: 25, el: -160 }, armL: { sh: 25, el: -160 } }, 0.3],
    [tm.clue + 0.3, { armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 900, y: 1520, s: 250, expr: 'notr', head: { tilt: -6, look: [-0.8, 0] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const def = [
    [L.d1.t0, { expr: 'mutlu', armR: { sh: 150, el: -10 }, head: { tilt: 8, look: [-0.8, -0.2] } }, 0.3, ease.enter],
    [L.h2a.t0, { expr: 'notr', armR: { sh: 20, el: -60 } }, 0.3],
    [tm.think0 + 0.1, { expr: think, head: { tilt: 8, look: [-0.9, -0.3] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: 'mutlu', armR: { sh: 20, el: -60 }, armL: { sh: 70, el: -30 }, head: { tilt: -4, look: [-0.9, 0] } }, 0.3],
    [tm.hd + 0.3, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.d2b, { blink: null, expr: 'mutlu', armL: { sh: 12, el: -10 }, armR: { sh: 25, el: -160 } }, 0.3],
    [tm.hd2 + 0.3, { expr: 'saskin', blink: 0, armR: { sh: 20, el: -60 } }, 0.2],
    [tm.n0, { blink: null, expr: 'notr', head: { tilt: -4, look: [0.9, 0] } }, 0.3],
    [tm.hc + 0.5, { expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.loop2, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1520, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// yön tabelası: dir -1 sol / +1 sağ, lit 0..1 vurgusu
function arrowSign(K, x, y, w, dir, label, lit) {
  const { ctx } = K, h = 92, tip = 46;
  const pts = dir < 0 ? [[x - w / 2, y], [x - w / 2 + tip, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2 + tip, y + h / 2]]
    : [[x + w / 2, y], [x + w / 2 - tip, y - h / 2], [x - w / 2, y - h / 2], [x - w / 2, y + h / 2], [x + w / 2 - tip, y + h / 2]];
  ctx.save(); ctx.translate(x, y); ctx.scale(1 + 0.08 * lit, 1 + 0.08 * lit); ctx.translate(-x, -y);
  K.poly(pts, lit > 0.01 ? (lit > 0.5 ? PAL.mustard : PAL.cream) : PAL.cream, LW);
  K.text(label, x + dir * 18, y + 15, 40, INK, 900);
  ctx.restore();
}

function newspaper(K, x, y, k, t) {
  const { ctx, rect, line } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.06 + 0.01 * Math.sin(t * 1.3)); ctx.scale(k, k);
  rect(-120, -80, 240, 160, '#F1ECE0', LW, 4);
  K.text('BULMACA', 0, -42, 30, INK, 900);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) rect(-90 + j * 36, -20 + i * 24, 32, 22, (i + j) % 3 === 0 ? INK : '#FFFFFF', 2, 2);
  void line;
  ctx.restore();
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.cta) return proof(K, t, tl, S);

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1700, floorY: 1500, window: false, t });
  // tabela direği
  K.rect(528, 560, 24, 940, PAL.woodDark, LW, 6);
  const litA = Math.max(ease.enter(seg(t, tm.arsiv - 0.1, 0.25)) * (1 - seg(t, tm.arsiv + 1, 0.3)), ease.enter(seg(t, tm.hd, 0.2)) * (1 - seg(t, tm.hd + 1.4, 0.3)));
  const litC = Math.max(ease.enter(seg(t, tm.cay - 0.1, 0.25)) * (1 - seg(t, tm.cay + 1, 0.3)), ease.enter(seg(t, tm.hd2, 0.2)) * (1 - seg(t, tm.hd2 + 1.4, 0.3)));
  arrowSign(K, 410, 670, 240, -1, 'ARŞİV', litA);
  arrowSign(K, 700, 670, 300, 1, 'ÇAY OCAĞI', litC);
  plant(K, -60, 1500, 0.9, t);
  // Necmi Abi sağda sandalyede, gazete
  K.rect(1150, 1260, 240, 30, PAL.woodDark, LW, 6); K.rect(1170, 1290, 20, 210, PAL.woodDark, LW * 0.7); K.rect(1350, 1290, 20, 210, PAL.woodDark, LW * 0.7); K.rect(1340, 960, 30, 330, PAL.woodDark, LW, 6);
  const np = charBase('necmi', { x: 1260, y: 1440, s: 225, expr: 'notr', head: { tilt: 10, look: [-0.3, 0.8] }, armR: { sh: 30, el: -120 }, armL: { sh: 30, el: -120 } });
  if (t >= tm.n0 - 0.1 && t < tm.clue - 0.3) Object.assign(np, { expr: 'mutlu', head: { tilt: -6, look: [-0.8, -0.1] }, armR: { sh: 120, el: 20 } });
  if (t >= tm.clue - 0.3) Object.assign(np, { expr: t >= tm.burn ? 'saskin' : 'notr', head: { tilt: 6 + (t >= tm.burn ? 6 * Math.sin(t * 9) : 0), look: [-0.4, 0.5] } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  if (n && t < tm.cta) newspaper(K, (n.handL[0] + n.handR[0]) / 2, (n.handL[1] + n.handR[1]) / 2 + 10, 0.9, t);
  // Hikmet Bey
  let h = null;
  if (t < tm.cta) { const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t); h = drawChar(ctx, 'hikmet', hp, t); }
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.cta) {
    const cap = captionAt(tl, t);
    return caption(K, cap, { y: 300, head: d?.head && toScreen(cam, d.head) });
  }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 }), top = 300 + cardH;
  // analiz çipi
  if (t >= tm.neither - 0.04 && t < tm.d2 - 0.1) {
    const u = spring(t - (tm.neither - 0.04), UI[0], UI[1]) * (1 - ease.exit(seg(t, tm.d2 - 0.4, 0.3)));
    ctx.save(); ctx.translate(540, 1100); ctx.scale(u, u);
    K.rect(-340, -56, 680, 112, INK, 0, 56);
    K.text('ne DOĞRU', -150, 20, 54, PAL.mustard, 900); K.text('ne YANLIŞ', 160, 20, 54, PAL.coral, 900);
    ctx.restore();
  }
  triesCol(K, t, [{ s: 'Hava güzel.', t0: tm.d2, strike: tm.hd + 0.1 }, { s: 'Ben müdürüm.', t0: tm.d2b, strike: tm.hd2 + 0.1 }], { x: 540, y: 1060, gap: 84, size: 50, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: gazetedeki cümle ve döngü
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(500, top + 200); ctx.scale(u * 0.85, u * 0.85);
    K.rect(-380, -170, 760, 340, '#F1ECE0', LW, 8);
    K.text('BULMACA', -230, -110, 34, '#6B6355', 900);
    if (t >= tm.sent - 0.04) { const v = spring(t - (tm.sent - 0.04), UI[0], UI[1]); ctx.save(); ctx.scale(v, v); K.text('"Bu cümle yanlıştır."', 0, -20, 54, INK, 900); ctx.restore(); }
    loopRow(K, t, 0, 90, tm.loop1, tm.loop2, 1);
    ctx.restore();
  }
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' ? n?.head : null;
  caption(K, cap, { y: 1250, head: head && toScreen(cam, head) });
}

// DOĞRU ⇄ YANLIŞ küçük döngü satırı
function loopRow(K, t, x, y, t1, t2, k) {
  const { ctx } = K;
  const a = t >= t1 - 0.04 ? spring(t - (t1 - 0.04), UI[0], UI[1]) : 0, b = t >= t2 - 0.04 ? spring(t - (t2 - 0.04), UI[0], UI[1]) : 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (a > 0) { ctx.save(); ctx.translate(-190, 0); ctx.scale(a, a); K.rect(-120, -36, 240, 72, PAL.mustard, LW * 0.8, 36); K.text('DOĞRU', 0, 14, 38, INK, 900); ctx.restore(); }
  if (b > 0) { ctx.save(); ctx.translate(190, 0); ctx.scale(b, b); K.rect(-120, -36, 240, 72, PAL.coral, LW * 0.8, 36); K.text('YANLIŞ', 0, 14, 38, PAL.paper, 900); ctx.restore(); }
  if (b > 0.5) { const s = 1 + 0.1 * Math.sin(t * 8); ctx.save(); ctx.scale(s, s); K.text('⇄', 0, 18, 60, INK, 900); ctx.restore(); }
  ctx.restore();
}

// kanıt: alıntı kartı + iki kutu arasında gidip gelen Defne çipi; sonunda KURAL ÇÖKTÜ
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.012 * u; ctx.save(); ctx.translate(0, -8 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(-100, -100, 1280, 2120);
  // alıntı
  if (t >= tm.quote - 0.04) {
    const v = spring(t - (tm.quote - 0.04), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 400); ctx.scale(v, v);
    rect(-430, -90, 860, 180, PAL.paper, LW, 24);
    text('"Beni çay ocağına', 0, -14, 54, INK, 900); text('göndereceksiniz."', 0, 52, 54, INK, 900);
    ctx.restore();
  }
  // kutular
  const BX = { cay: [280, 760], ars: [800, 760] };
  const hiC = (t >= tm.toCay && t < tm.toArs) || t >= tm.back ? 1 : 0, hiA = t >= tm.toArs && t < tm.back ? 1 : 0;
  [['cay', 'ÇAY OCAĞI', hiC], ['ars', 'ARŞİV', hiA]].forEach(([k, lb, hi]) => {
    const [x, y] = BX[k];
    rect(x - 170, y - 90, 340, 180, hi ? PAL.mustard : PAL.cream, LW, 24); text(lb, x, y + 16, 46, INK, 900);
  });
  // oklar: üstte ÇAY → ARŞİV (DOĞRU çıktı), altta ARŞİV → ÇAY (YANLIŞ oldu)
  const arc = (y0, sgn, p, col) => {
    if (p <= 0) return;
    ctx.beginPath();
    for (let i = 0; i <= 30 * p; i++) { const v = i / 30, x = lerp(sgn > 0 ? 330 : 750, sgn > 0 ? 750 : 330, v), y = y0 - sgn * 0 + Math.sin(Math.PI * v) * (sgn > 0 ? -90 : 90); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.lineWidth = LW * 1.4; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke();
  };
  const pA = ease.state(seg(t, tm.dogru, 0.6)), pB = ease.state(seg(t, tm.yanlis, 0.6));
  arc(650, 1, pA, PAL.mustard); arc(870, -1, pB, PAL.coral);
  if (pA > 0.6) { rect(370, 506, 340, 80, PAL.mustard, LW * 0.8, 40); text('DOĞRU çıkar', 540, 561, 44, INK, 900); }
  if (pB > 0.6) { rect(370, 930, 340, 80, PAL.coral, LW * 0.8, 40); text('YANLIŞ olur', 540, 985, 44, PAL.paper, 900); }
  // Defne çipi
  const legs = [[tm.toCay, 'cay'], [tm.toArs, 'ars'], [tm.back, 'cay']];
  let pos = [540, 620], prev = [540, 620];
  for (const [tt, k] of legs) { if (t < tt) break; const tgt = [BX[k][0], BX[k][1] - 130]; const v = ease.state(seg(t, tt, 0.45)); pos = [lerp(prev[0], tgt[0], v), lerp(prev[1], tgt[1], v) - Math.sin(Math.PI * v) * 40]; prev = tgt; }
  if (t >= tm.toCay - 0.3) { rect(pos[0] - 100, pos[1] - 36, 200, 72, PAL.coral, LW * 0.8, 36); text('Defne', pos[0], pos[1] + 16, 44, PAL.paper, 900); }
  // KURAL ÇÖKTÜ damgası
  if (t >= tm.crash) {
    const v = spring(t - tm.crash, 420, 26);
    ctx.save(); ctx.translate(540, 1100); ctx.rotate(-0.08); ctx.scale(1.6 - 0.6 * v, 1.6 - 0.6 * v); ctx.globalAlpha = clamp01(v * 2);
    rect(-280, -70, 560, 140, null, LW * 1.6, 18); ctx.strokeStyle = PAL.red; ctx.lineWidth = 12; ctx.stroke();
    text('KURAL ÇÖKTÜ', 0, 24, 74, PAL.red, 900);
    ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 270, y: 1920, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  drawChar(ctx, 'defne', dp, t);
  drawChar(ctx, 'necmi', charBase('necmi', { x: 560, y: 1930, s: 215, expr: 'mutlu', head: { tilt: 6, look: [0, -0.6] }, armR: { sh: 30, el: -110 }, armL: { sh: 30, el: -110 } }), t);
  const hu = ease.enter(seg(t, tm.crash, 0.4)), hp = charBase('hikmet', { x: 840, y: 1940, s: 230, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6 - 14 * hu, look: [-0.6, -0.6 + 0.9 * hu] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  if (t >= tm.toCay && t < tm.toCay + 0.8) hp.armL = { sh: 150, el: -10 };
  if (t >= tm.toArs && t < tm.toArs + 0.8) hp.armR = { sh: 150, el: -10 };
  hp.talk = talkAt(tl, 'hikmet', t);
  drawChar(ctx, 'hikmet', hp, t);
  caption(K, captionAt(tl, t), { y: 1200, head: null });
}
