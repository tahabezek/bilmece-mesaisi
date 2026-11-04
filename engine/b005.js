// Bölüm 5 · A HARFİ. Mekân: çay ocağı (tezgâh, semaver, çay tepsisi); Necmi Abi köşede bulmaca çözer.
// Kanıt: harf karoları; DAKİKA'da 2, SANİYE'de 1, YIL'da 0 a.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS, teaGlass } from './cast.js';
import { PAL, LW, room, door, desk, riddleCard } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, thinkCounter } from './sahne.js';

const up = s => s.toLocaleUpperCase('tr-TR');

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    nums: [T('h2b:3'), T('h2c:3'), T('h2d:3')], walk: [L.h2a.t0 - 0.1, L.h2a.t0 + 1.0], offer: T('h3:4'),
    think0: T('h3>'), clue: T('n1'), tries: [T('d2:0'), T('d2:2')], strike: T('d2:4'),
    type: [T('n1:5') - 0.55, T('n1:5') - 0.02],
    buldum: T('d3'), proof: T('d3:1') - 0.04,
    rows: { dakika: T('d4:0'), iki: T('d4:2'), saniye: T('d4:6'), bir: T('d4:8'), yil: T('d4:10'), hic: T('d4:12') },
    defeat: T('d4>') + 0.1, cupUp: T('h4:3'), cta: T('d5') - 0.2, end: T('d5>') + 0.1,
  };
  const cam = [
    [0, 1, 640, 960, 'cut'],
    [0.5, 1.04, 660, 980],
    [L.h2a.t0, 1.12, 780, 990],
    [L.h2d.t0, 1.17, 800, 995],
    [L.h3.t0, 1.22, 840, 1000],
    [tm.think0 + 0.1, 1.3, 600, 1000],
    [tm.clue - 0.1, 1.35, 200, 1050],
    [tm.type[1], 1.48, 250, 1030],
    [tm.buldum, 1.3, 640, 1010, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.defeat, 1.35, 860, 1030, 'cut'],
    [tm.cupUp, 1.5, 820, 1020],
    [tm.cta, 1.6, 640, 1010, 'cut'],
    [tm.cta + 1.6, 1.72, 640, 1000],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 1110, y: 1520, s: 250, view: 'side', facing: -1, lean: -10, expr: 'mutlu', head: { tilt: -8, look: [-0.8, 0.1] }, armR: { sh: 10, el: 20 }, armL: { sh: 10, el: 20 } });
  const hik = [
    [L.h1.t1, { lean: 0, head: { tilt: -2, look: [-0.7, 0] } }],
    [tm.nums[0] - 0.1, { armL: { sh: 120, el: 20 } }, 0.3, ease.enter],
    [tm.nums[1] - 0.1, { armL: { sh: 145, el: 10 } }, 0.3, ease.enter],
    [tm.nums[2] - 0.1, { armL: { sh: 70, el: 60 }, head: { tilt: 8, look: [-0.8, 0.2] } }, 0.3, ease.enter],
    [tm.offer - 0.1, { armR: { sh: 85, el: 0 }, head: { tilt: 4, look: [-0.9, 0.2] } }, 0.3, ease.enter],
    [tm.think0 + 0.4, { armR: { sh: 10, el: 20 }, armL: { sh: 10, el: 20 }, head: { tilt: -4, look: [-0.7, 0.2] } }],
    [tm.clue + 0.3, { expr: 'saskin', head: { tilt: 0, look: [-0.9, 0] } }, 0.3],
  ];
  const defBase = charBase('defne', { x: 640, y: 1500, s: 270, expr: 'notr', head: { tilt: 6, look: [0.6, 0.5] }, armR: { sh: 40, el: -70 }, armL: { sh: 20, el: -40 }, props: { R: 'tea' } });
  const def = [
    [L.h1.t0 + 0.08, { y: 1440, expr: 'saskin', blink: 0, head: { tilt: -8, look: [0.9, -0.3] } }, 0.2, ease.enter],
    [L.h1.t0 + 0.4, { y: 1500 }, 0.45],
    [L.d1.t0, { blink: null, expr: { brow: 0.03, browTilt: -0.1, eye: 0.8, pupil: 1, curve: 0.4, open: 0.1, w: 1.05 }, head: { tilt: -4, look: [0.9, -0.1] } }],
    [tm.nums[0], { expr: 'notr', head: { tilt: 4, look: [0.5, -0.8] } }, 0.3],
    [tm.nums[2], { expr: 'saskin', head: { tilt: -6, look: [0.7, -0.6] } }, 0.3],
    [tm.think0 + 0.1, { expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: -10, look: [-0.3, -0.9] }, armL: { sh: 18, el: -168 } }],
    [tm.strike, { expr: 'yorgun', head: { tilt: 8, look: [0.2, 0.3] } }, 0.4],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [-0.9, 0] }, armL: { sh: 20, el: -40 } }, 0.35],
    [tm.type[1], { expr: 'saskin', blink: 0, head: { tilt: 4, look: [-0.9, -0.2] } }, 0.25, ease.enter],
    [tm.buldum - 0.05, { y: 1410, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1500, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 120, el: -60 }, armL: { sh: 125, el: -50 }, props: {} }, 0.01],
    [tm.cta + 0.4, { armL: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

function semaver(K, x, y, t) {
  const { ctx, rect, ell, line } = K;
  rect(x - 56, y - 30, 112, 30, '#7A6A4A', LW, 6);
  rect(x - 72, y - 236, 144, 210, '#C9A35C', LW, 30);
  line(x - 70, y - 180, x + 70, y - 180, 5, '#A88440'); line(x - 70, y - 90, x + 70, y - 90, 5, '#A88440');
  rect(x - 104, y - 92, 40, 18, '#A88440', LW * 0.8, 6); rect(x - 112, y - 78, 14, 26, '#A88440', LW * 0.6, 4);
  rect(x - 22, y - 262, 44, 30, '#7A6A4A', LW, 6);
  ell(x, y - 296, 54, 38, PAL.coral, LW); rect(x - 10, y - 342, 20, 14, PAL.coral, LW * 0.8, 6);
  K.poly([[x + 44, y - 300], [x + 92, y - 330], [x + 90, y - 318], [x + 50, y - 286]], PAL.coral, LW * 0.8);
  // buhar: iki kıvrım, sürekli yükselir (döngü)
  ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(244,237,224,0.75)'; ctx.lineCap = 'round';
  for (let k = 0; k < 2; k++) {
    const ph = ((t * 0.6 + k * 0.5) % 1), y0 = y - 350 - ph * 120;
    ctx.globalAlpha = Math.sin(Math.PI * ph);
    ctx.beginPath(); for (let i = 0; i <= 12; i++) { const yy = y0 - i * 6, xx = x + 96 + (k ? 18 : 0) + 10 * Math.sin(i * 0.7 + t * 3 + k); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
  }
  ctx.restore();
}

function kitchen(K, t) {
  const { ctx, rect, line } = K;
  rect(300, 760, 860, 420, '#E9E1D0', 0);
  for (let x = 300; x <= 1160; x += 72) line(x, 760, x, 1180, 3, '#CFC5B0');
  for (let y = 760; y <= 1180; y += 72) line(300, y, 1160, y, 3, '#CFC5B0');
  door(K, 1180, 700, 330, 800, 'ÇAY OCAĞI');
  rect(1180, 700, 330, 800, '#1C3638', 0);   // açık kapı
  void ctx; void t;
}

function tray(K, x, y, k = 1) {
  K.ell(x, y, 150 * k, 22 * k, '#C9C3B6', LW);
  for (const gx of [-90, -30, 30, 90]) teaGlass(K.ctx, x + gx * k, y - 6 * k, 230 * k, LW / (230 * k));
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.defeat) return proof(K, t, tl, S);
  const defeat = t >= tm.defeat && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1700, floorY: 1500, t });
  kitchen(K, t);
  // Necmi Abi: solda gazete okur; yenilgi çekiminde bardağını uzatır
  let n = null;
  if (!defeat) {
    const look = ease.state(seg(t, tm.clue - 0.3, 0.4));
    // "altı harfli"de kalemi havada tutup düşünür, sonra yazar (kol eylemi; bulmaca çekimi durağan kalmasın)
    const scratch = ease.state(seg(t, tm.clue + 0.5, 0.35)) * (1 - ease.state(seg(t, tm.type[0] - 0.4, 0.35)));
    const wr = t >= tm.type[0] && t < tm.type[1] + 0.3 ? Math.sin((t - tm.type[0]) * 22) : 0;
    const np = charBase('necmi', { x: 120, y: 1520, s: 230, view: 'side', facing: 1, expr: scratch > 0.5 ? 'yorgun' : 'notr', head: { tilt: lerp(10, -2, look) + 8 * scratch, look: [0.6, lerp(0.6, 0.1, look)] }, armL: { sh: 60, el: 40 }, armR: { sh: lerp(50, 95, scratch) + 8 * wr, el: lerp(50, 55, scratch) } });
    np.talk = talkAt(tl, 'necmi', t);
    n = drawChar(ctx, 'necmi', np, t);
    ctx.save(); ctx.translate(n.handL[0] + 10, n.handL[1] - 40); ctx.rotate(-0.12);   // gazete arka elde
    K.rect(-10, -70, 150, 120, '#ECE6D8', LW * 0.8, 4); for (let i = 0; i < 5; i++) K.line(6, -50 + i * 20, 120, -50 + i * 20, 3, '#9C9384');
    ctx.restore();
  }
  // Hikmet Bey: kapıdan bakar, sonra içeri girer
  let h = null;
  if (t < tm.cta) {
    const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    const u = ease.state(seg(t, tm.walk[0], tm.walk[1] - tm.walk[0]));
    hp.x = lerp(1110, 980, u);
    if (u > 0 && u < 1) { const a = (1110 - hp.x) / 110 * Math.PI * 2; hp.legL = { hip: Math.sin(a) * 18, knee: 4 + Math.max(0, Math.sin(a + 1.7)) * 28 }; hp.legR = { hip: Math.sin(a + Math.PI) * 18, knee: 4 + Math.max(0, Math.sin(a + Math.PI + 1.7)) * 28 }; }
    if (defeat) { Object.assign(hp, { view: 'front', x: 980, facing: 1, lean: 0, expr: 'yorgun', head: { tilt: 10, look: [-0.6, 0.4] }, armR: { sh: 40, el: -90 }, armL: { sh: 40, el: -90 } }); }
    h = drawChar(ctx, 'hikmet', hp, t);
  }
  // Defne tezgâhın arkasında
  const dp = poseAt(CARDS.defne, S.defBase, S.def, t); dp.talk = talkAt(tl, 'defne', t);
  const d = defeat ? null : drawChar(ctx, 'defne', dp, t);
  desk(K, 300, 1180, 880, { h: 320 });
  semaver(K, 420, 1180, t);
  if (!defeat) tray(K, 860, 1176, 0.9);
  else if (h) tray(K, (h.handL[0] + h.handR[0]) / 2, 1150, 0.8);   // tepsi tezgâhın önünde, Hikmet Bey'in elinde
  // yenilgi: Necmi Abi de bardağını uzatır
  if (defeat) {
    const cu = ease.enter(seg(t, tm.cupUp - 0.1, 0.35));
    const np = charBase('necmi', { x: 740, y: 1520, s: 230, view: 'side', facing: 1, expr: 'mutlu', head: { tilt: -6, look: [0.6, -0.2] }, armR: { sh: lerp(20, 95, cu), el: lerp(30, 0, cu) }, props: { R: 'tea' } });
    n = drawChar(ctx, 'necmi', np, t);
  }
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.defeat) {
    const cap = captionAt(tl, t), who = cap?.line.who, hd = who === 'defne' ? d?.head : h?.head;
    return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) });
  }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 50 });
  const out = 1 - ease.exit(seg(t, tm.think0, 0.3));
  if (out > 0) ['DAKİKA', 'SANİYE', 'YIL'].forEach((w, i) => {
    const a = tm.nums[i] - 0.04; if (t < a) return;
    const u = spring(t - a, UI[0], UI[1]) * out, x = 275 + i * 265, y = 300 + cardH + 90;
    ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
    K.rect(-115, -50, 230, 100, PAL.cream, LW, 24);
    K.text(w, -24, 12, 36, '#6B6355', 900); K.text(String(2 - i), 82, 22, 64, PAL.coral, 900);
    ctx.restore();
  });
  triesCol(K, t, [{ s: 'YELKOVAN?', t0: tm.tries[0], strike: tm.strike }, { s: 'AKREP?', t0: tm.tries[1], strike: tm.strike }], { x: 270, y: 760, gap: 100, size: 54, fadeAt: tm.clue - 0.45 });
  thinkCounter(K, t, tm.clue, { x: 840, y: 700, r: 80 });
  // bulmaca: altı kutu, DAKİKA harf harf yazılır
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 690); ctx.scale(u, u);
    K.rect(-250, -112, 500, 62, INK, 0, 31); K.text('Altı harfli zaman birimi', 0, -68, 40, PAL.paper, 800);
    [...'DAKİKA'].forEach((ch, i) => {
      const x = -275 + i * 92;
      K.rect(x, -40, 86, 86, '#FFFFFF', LW, 6);
      const lt = tm.type[0] + (tm.type[1] - tm.type[0]) * i / 5;
      if (t >= lt) { const v = spring(t - lt, UI[0], UI[1]); ctx.save(); ctx.translate(x + 43, 3); ctx.scale(v, v); K.text(ch, 0, 22, 62, INK, 900); ctx.restore(); }
    });
    ctx.restore();
  }
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' ? n?.head : null;
  caption(K, cap, { y: 1250, head: head && toScreen(cam, head) });
}

// kanıt: harf karoları; a'lar yanar, sağda sayısı
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof, R = tm.rows;
  const z = 1 + 0.018 * u; ctx.save(); ctx.translate(0, -12 * u); ctx.translate(540, 760); ctx.scale(z, z); ctx.translate(-540, -760);   // yavaş yaklaşma + yukarı kayma (kenarlar kesilmez)
  ctx.save(); ctx.translate(-120, 0); room(K, { floorY: 1500, t }); kitchen(K, t); semaver(K, 420, 1180, t); ctx.restore();
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(0, 0, 1080, 1920);
  const rows = [['DAKİKA', 0, R.iki, 2], ['SANİYE', R.saniye, R.bir, 1], ['YIL', R.yil, R.hic, 0]];
  rows.forEach(([w, a0, lit, cnt], r) => {
    if (t < a0 - 0.04) return;
    const ru = spring(t - (a0 - 0.04), UI[0], UI[1]), y = 470 + r * 168, x0 = 150;
    ctx.save(); ctx.globalAlpha = clamp01(ru * 1.3);
    [...w].forEach((ch, i) => {
      const isA = ch === 'A', on = isA && t >= (r === 0 ? tm.proof : lit) - 0.04;
      const pu = on ? spring(t - ((r === 0 ? tm.proof : lit) - 0.04), UI[0], UI[1]) : 0;
      const x = x0 + i * 106;
      ctx.save(); ctx.translate(x + 50, y + 50); ctx.scale(1 + 0.12 * pu * (1 - clamp01((t - lit) / 0.6)), 1 + 0.12 * pu * (1 - clamp01((t - lit) / 0.6)));
      rect(-50, -50, 100, 100, on ? PAL.coral : '#FFFFFF', LW, 8);
      text(ch, 0, 24, 66, on ? PAL.paper : INK, 900);
      ctx.restore();
    });
    if (t >= lit - 0.04) {
      const cu = spring(t - (lit - 0.04), UI[0], UI[1]);
      ctx.save(); ctx.translate(860, y + 50); ctx.scale(cu, cu);
      K.circ(0, 0, 58, cnt ? PAL.mustard : '#9AA59E', LW); text(String(cnt), 0, 24, 66, INK, 900);
      ctx.restore();
    }
    ctx.restore();
  });
  ctx.restore();
  // altta: Defne, Necmi (gazeteyle), Hikmet Bey
  const dp = charBase('defne', { x: 260, y: 1910, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  drawChar(ctx, 'defne', dp, t);
  drawChar(ctx, 'necmi', charBase('necmi', { x: 560, y: 1920, s: 220, expr: 'mutlu', head: { tilt: 6, look: [0, -0.6] }, armR: { sh: 30, el: -110 }, armL: { sh: 30, el: -110 } }), t);
  const hu = ease.enter(seg(t, R.hic, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 840, y: 1930, s: 235, expr: hu > 0.5 ? 'korku' : 'saskin', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 130, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 130, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1010, head: null });
  void up;
}
