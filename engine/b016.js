// Bölüm 16 · ON İKİ AVUÇ TUZ (yayın #1; dizinin tuz bilmecesinden). Mekân: çay ocağı; ocakta kaynayan tencere, tuz kutusu.
// 5 + 5 + 2 avuç tuz, pişen yine tuzsuz → tencerede kabuklu yumurta haşlanıyordu. İpucu: Necmi'nin portakalı (şeker kabuktan geçmez).
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, desk, plant, clock } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    pot: T('h2a:0'), s1: T('h2a:9'), s2: T('h2b:5'), s3: T('h2b:12'), eat: T('h2c:0'),
    think0: T('h3>'), da: T('da'), d2: T('d2'), hd: T('hd'), n0: T('n0'), hn: T('hn'), hc: T('hn>') + 0.3,
    clue: T('n1'), cd: T(ep.countdown), sugar: T('n1:2'), cut: T('n1:4'), rule: T('n1:7'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    egg: T('d3>') + 0.15, salt: T('d4:6'), shell: T('d4:9'), nogo: T('d4:11'), peel: T('d5:0'), tuzsuz: T('d5:3'), water: T('d5:8'),
    happy: T('h4') - 0.15, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1.14, 520, 1060, 'cut'],
    [0.6, 1.18, 600, 1070],
    [L.d1.t0 - 0.05, 1.28, 840, 1060],
    [tm.pot - 0.1, 1.3, 580, 1120],
    [L.h2b.t0 - 0.05, 1.34, 560, 1130],
    [tm.eat - 0.05, 1.22, 380, 1050],
    [L.h3.t0 - 0.05, 1.28, 300, 1040],
    [tm.think0 + 0.1, 1.3, 820, 1060],
    [tm.d2, 1.36, 830, 1070],
    [tm.hd - 0.05, 1.26, 320, 1040],
    [tm.n0 - 0.1, 1.3, 1180, 1040],
    [tm.hn - 0.05, 1.22, 420, 1040],
    [tm.hc - 0.05, 1.18, 560, 1050],
    [tm.cd - 5, 1.1, 560, 1040],
    [tm.clue - 0.1, 1.3, 1110, 900],
    [tm.cut, 1.4, 1130, 880],
    [tm.buldum - 0.05, 1.32, 840, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 400, 1060, 'cut'],
    [T('h4:4'), 1.45, 420, 1080],
    [tm.cta, 1.6, 840, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const hikBase = charBase('hikmet', { x: 190, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 80, el: 20 } });
  const hik = [
    [L.h1.t0 + 1.4, { armR: { sh: 140, el: 10 } }, 0.35, ease.enter],
    [tm.pot - 0.2, { armR: { sh: 70, el: 20 }, head: { tilt: 6, look: [0.9, 0.3] } }, 0.35, ease.enter],
    [tm.eat - 0.1, { armR: { sh: 150, el: -20 }, head: { tilt: -4, look: [0.7, 0] } }, 0.3, ease.enter],
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.hd - 0.05, { expr: 'mutlu', armR: { sh: 155, el: -5 }, head: { tilt: 6, look: [0.8, 0] } }, 0.25, ease.enter],
    [tm.n0, { armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hn - 0.05, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'mutlu', armR: { sh: 25, el: -160 }, armL: { sh: 20, el: -60 } }, 0.3],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 880, y: 1520, s: 245, expr: 'saskin', head: { tilt: -4, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [-0.6, 0.5] } }, 0.35],
    [tm.think0 + 0.1, { expr: think, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: 'mutlu', armL: { sh: 95, el: 10 }, armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [-0.9, 0] } }, 0.3, ease.enter],
    [tm.hd + 0.2, { expr: 'saskin', blink: 0, armL: { sh: 12, el: -10 } }, 0.2],
    [tm.n0 + 0.6, { blink: null, expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.rule, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// ocak + tencere (buhar sürekli döngü)
function stove(K, x, y, t, salts) {
  const { ctx, rect, line, ell } = K;
  rect(x - 170, y, 340, 60, '#5D6A61', LW, 10);
  for (const dx of [-80, 80]) ell(x + dx, y + 2, 50, 10, '#2F3A36', LW * 0.6);
  // tencere
  rect(x - 130, y - 150, 260, 150, '#8FA093', LW, 16);
  rect(x - 150, y - 160, 300, 26, '#728276', LW, 10);
  line(x - 150, y - 110, x - 185, y - 110, LW * 1.4); line(x + 150, y - 110, x + 185, y - 110, LW * 1.4);
  for (let i = 0; i < 3; i++) {   // buhar
    const ph = (t * 0.6 + i / 3) % 1, a = Math.sin(Math.PI * ph);
    ctx.save(); ctx.globalAlpha = 0.5 * a; ctx.beginPath();
    for (let k = 0; k <= 12; k++) { const v = k / 12; ctx.lineTo(x - 60 + i * 60 + Math.sin(v * 6 + t * 3 + i) * 12, y - 175 - ph * 120 - v * 60); }
    ctx.lineWidth = 6; ctx.strokeStyle = '#E6EEF0'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  }
  // tuz kutusu
  rect(x - 300, y - 90, 90, 130, PAL.paper, LW, 10); rect(x - 300, y - 60, 90, 40, '#3E86B5', 0, 0); K.text('TUZ', x - 255, y - 32, 26, PAL.paper, 900);
  void salts;
}
// avuç tuz düşer (beyaz taneler)
function saltFall(K, x, y, u) {
  if (u <= 0 || u >= 1) return;
  const { ctx } = K;
  for (let i = 0; i < 14; i++) { const dx = ((i * 37) % 60) - 30, dy = u * 170 + ((i * 53) % 30); ctx.save(); ctx.globalAlpha = 1 - u * 0.5; K.circ(x + dx, y - 230 + dy, 5, '#FFFFFF', 2); ctx.restore(); }
}
function egg(K, x, y, k, peel = 0, salty = 0, t = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (peel < 1) { ctx.save(); ctx.globalAlpha = 1 - peel; K.ell(0, 0, 70, 92, '#F3E3C8', LW / k); ctx.restore(); }   // kabuk
  K.ell(0, 4, 58, 80, '#FFFFFF', LW * 0.6 / k); K.circ(0, 16, 32, '#F2B33D', LW * 0.6 / k);
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
  clock(K, 1480, 760, 58, 12, 30 + Math.floor(t / 5), t);
  plant(K, 1660, 1500, 0.9, t);
  const np = charBase('necmi', { x: 1200, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', armL: { sh: 140, el: 10 }, head: { tilt: -6, look: [-0.8, -0.2] } });
  if (t >= tm.hn && t < tm.clue - 0.3) Object.assign(np, { expr: 'saskin' });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 30, el: -120 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  desk(K, 330, 1320, 600, { h: 200 });   // tezgâh
  stove(K, 600, 1260, t);
  // avuç tuzlar
  [tm.s1, tm.s2, tm.s3].forEach(a => saltFall(K, 600, 1260, clamp01((t - (a - 0.5)) / 0.8)));
  let h = null;
  if (t < tm.cta) { const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', armR: { sh: 95, el: 5 }, head: { tilt: -8, look: [0.9, 0.2] } });
    h = drawChar(ctx, 'hikmet', hp, t); }
  // tencere üstünde avuç sayacı
  const cnt = t < tm.s1 ? 0 : t < tm.s2 ? 5 : t < tm.s3 ? 10 : 12;
  if (cnt && t < tm.buldum) {
    const a = cnt === 5 ? tm.s1 : cnt === 10 ? tm.s2 : tm.s3, v = 1 + 0.25 * Math.exp(-Math.pow((t - a - 0.15) / 0.2, 2));
    ctx.save(); ctx.translate(600, 1010); ctx.scale(v, v); K.rect(-120, -40, 240, 80, INK, 0, 40); K.text(`${cnt} avuç tuz`, 0, 14, 38, PAL.paper, 900); ctx.restore();
  }
  ctx.restore();

  const heads = { hikmet: h?.head, defne: d?.head, necmi: n?.head };
  if (t >= tm.happy) { const cap = captionAt(tl, t), hd = heads[cap?.line.who]; return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) }); }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 56 }), top = 300 + cardH;
  triesCol(K, t, [{ s: 'Şeker mi? Su mu çok?', t0: tm.d2, strike: at(tl, 'hd:1') }], { x: 540, y: top + 80, gap: 84, size: 52, fadeAt: tm.hd + 1.4 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: portakal, şeker kabukta kalır
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    const cutU = ease.state(seg(t, tm.cut, 0.5));
    // bütün portakal → ikiye kesilmiş
    ctx.save(); ctx.translate(-150 - 40 * cutU, 0); K.circ(0, 0, 90, '#F2A33A', LW);
    if (t >= tm.sugar - 0.04) for (let i = 0; i < 10; i++) { const a = -Math.PI * (0.15 + 0.07 * i); K.circ(Math.cos(a) * 88, Math.sin(a) * 88, 6, '#FFFFFF', 2); }
    ctx.restore();
    if (cutU > 0) { ctx.save(); ctx.globalAlpha = cutU; ctx.translate(90, 0); K.circ(0, 0, 90, '#F2A33A', LW); K.circ(0, 0, 72, '#FFD27A', LW * 0.6); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; K.line(0, 0, Math.cos(a) * 70, Math.sin(a) * 70, 3, '#F2A33A'); } K.text('EKŞİ', 0, 130, 34, PAL.red, 900); ctx.restore(); }
    if (t >= tm.rule - 0.04) { const v = spring(t - (tm.rule - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(0, -112); ctx.scale(v, v); K.rect(-240, -36, 480, 72, PAL.coral, LW * 0.8, 36); K.text('KABUKTAN GEÇMİYOR', 0, 13, 34, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}

// kanıt: tencere kesiti; tuz taneleri suda, kabuğa çarpıp geri döner; soyulan yumurta tuzsuz
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.014 * u; ctx.save(); ctx.translate(0, -7 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.6)'; ctx.fillRect(-100, -100, 1280, 2120);
  // tencere kesiti
  const px = 540, py = 760;
  rect(px - 330, py - 300, 660, 560, '#8FA093', LW, 30);
  rect(px - 300, py - 220, 600, 450, '#BFE0EE', LW * 0.6, 20);   // su
  // tuz taneleri (sürekli yavaş döner)
  if (t >= tm.salt - 0.04) {
    for (let i = 0; i < 46; i++) {
      const bx = px - 280 + ((i * 97) % 560), by = py - 200 + ((i * 59) % 420), w = Math.sin(t * 1.5 + i) * 6;
      const dx = bx - px, dy = by - (py + 20), inside = (dx * dx) / (120 * 120) + (dy * dy) / (155 * 155) < 1;
      if (inside) continue;
      K.circ(bx + w, by + Math.cos(t * 1.2 + i) * 5, 8, '#FFFFFF', 2.5);
    }
  }
  // yumurta: soyulunca yukarı çıkar
  const pu = ease.state(seg(t, tm.peel, 0.7));
  if (t >= tm.egg - 0.04) {
    const v = spring(t - (tm.egg - 0.04), UI[0], UI[1]);
    egg(K, px, py + 20, v * 1.7, pu, 0, t);
  }
  // kabuğa çarpan tanelerden ok
  if (t >= tm.shell - 0.04 && pu < 0.5) {
    const v = spring(t - (tm.shell - 0.04), UI[0], UI[1]);
    ctx.save(); ctx.globalAlpha = clamp01(v); K.line(px - 210, py - 120, px - 120, py - 60, 7, PAL.red); K.line(px - 120, py - 60, px - 190, py - 20, 7, PAL.red); ctx.restore();
  }
  if (t >= tm.nogo - 0.04) { const v = spring(t - (tm.nogo - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(540, 360); ctx.scale(v, v); rect(-320, -50, 640, 100, INK, 0, 50); text('TUZ KABUKTAN GEÇMEZ', 0, 17, 46, PAL.paper, 900); ctx.restore(); }
  if (t >= tm.tuzsuz - 0.04) { const v = spring(t - (tm.tuzsuz - 0.04), 420, 26); ctx.save(); ctx.translate(540, 1110); ctx.rotate(-0.05); ctx.scale(1.5 - 0.5 * v, 1.5 - 0.5 * v); ctx.globalAlpha = clamp01(v * 2); rect(-200, -56, 400, 112, PAL.green, LW, 22); text('İÇİ TUZSUZ', 0, 20, 56, PAL.paper, 900); ctx.restore(); }
  if (t >= tm.water - 0.04) { const v = spring(t - (tm.water - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(px, py + 200); ctx.scale(v, v); rect(-250, -40, 500, 80, '#3E86B5', LW, 40); text('12 avuç tuz suda kaldı', 0, 14, 36, PAL.paper, 900); ctx.restore(); }
  ctx.restore();
  const dp = charBase('defne', { x: 210, y: 2060, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t); drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.tuzsuz, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 880, y: 2070, s: 235, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1290, head: null });
}
