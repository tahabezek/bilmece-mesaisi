// Bölüm 3 · İSTANBUL. Mekân: Hikmet Bey'in odası (duvar haritası, küre, takvim) + Necmi Abi'nin masası.
// Yön: harita üstünde tahminler elenir, ipucu etiket şeridinden gelir; şerit soldan sağa okunur.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, windowIst, calendar, desk, globe, riddleCard, counter } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard } from './sahne.js';

const STRIP = 'YUNANİSTANBULGARİSTAN';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    gr: T('h2:0'), bg: T('h2:2'), sinir: T('d2'), x1: T('h3'), meric: T('d3'), x2: T('h4:3'),
    week: T('h5:3'), think0: T('h5>'), cnt0: T('n1') - 5.8, cnt1: T('n1') - 0.8, edirne: T('d4:0'), yok: T('d4:2'),
    necmi: T('n1') - 0.8, zip: [T('n1') - 0.72, T('n1') - 0.06], grumble: T('n1:2'),
    buldum: T('d5'), strip: T('d5:1') - 0.04, brA: T('d6:0'), brB: T('d6:1'), ist: T('d6:5'),
    defeat: T('d6>') + 0.1, cta: T('d7') - 0.2, end: T('d7>') + 0.1,
  };
  const cam = [
    [0, 1, 560, 960, 'cut'],
    [0.5, 1.05, 600, 1000],
    [tm.gr - 0.15, 1.8, 330, 790, 'cut'],   // ara plan: yalnız harita
    [tm.sinir - 0.1, 1.3, 380, 960, 'cut'],
    [L.h5.t0 - 0.1, 1.3, 960, 960],
    [tm.think0 + 0.2, 1.3, 380, 960],
    [tm.necmi, 1.4, -510, 1150, 'cut'],
    [tm.buldum - 0.05, 1.3, 330, 1060, 'cut'],
    [tm.strip, 1, 540, 960, 'cut'],
    [tm.defeat, 1.55, 880, 1060, 'cut'],
    [tm.cta, 1.7, 330, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 830, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -6, look: [-0.6, 0.2] }, armR: { sh: 40, el: 40 }, armL: { sh: 10, el: -10 } });
  const hik = [
    [0.9, { armR: { sh: 15, el: -10 } }, 0.4],
    [tm.x1 - 0.05, { expr: 'kizgin', head: { tilt: 6, look: [-0.8, 0] } }, 0.15],
    [tm.meric, { expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.2] } }],
    [tm.x2 - 0.05, { expr: 'kizgin', armL: { sh: 120, el: 30 } }, 0.15, ease.enter],
    [L.h5.t0, { expr: 'mutlu', armL: { sh: 10, el: -10 }, armR: { sh: 128, el: -12 }, head: { tilt: 8, look: [0.9, -0.4] } }, 0.35, ease.enter],   // sağ kol yukarıdaki takvimi gösterir
    [tm.think0 + 0.3, { armL: { sh: 12, el: -140 }, armR: { sh: 12, el: -140 }, head: { tilt: -4, look: [-0.6, 0.2] } }],
    [tm.defeat, { expr: 'korku', head: { tilt: 10, look: [0.8, -0.4] }, armL: { sh: 150, el: 130 }, armR: { sh: 150, el: 130 } }, 0.3, ease.enter],
    [L.h6.t0 + 0.8, { expr: 'yorgun', head: { tilt: 14, look: [0.3, 0.7] }, lean: 6 }, 0.7],
  ];
  const defBase = charBase('defne', { x: 330, y: 1520, s: 240, expr: 'notr', head: { tilt: 6, look: [0.8, -0.2] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.d1.t0, { expr: 'mutlu', head: { tilt: -4, look: [0.9, -0.1] } }],
    [tm.gr, { expr: 'notr', head: { tilt: 4, look: [-0.3, -0.9] } }],
    [tm.sinir - 0.1, { expr: { brow: 0.04, browTilt: -0.05, eye: 1, pupil: 1, curve: 0.3, open: 0.1, w: 1 }, armR: { sh: 140, el: -20 } }, 0.3, ease.enter],
    [tm.x1, { expr: 'saskin', armR: { sh: 20, el: -60 } }, 0.25],
    [tm.meric - 0.1, { expr: { brow: 0.04, browTilt: 0.2, eye: 0.9, pupil: 1, curve: 0, open: 0.1, w: 0.8 }, armR: { sh: 18, el: -168 }, head: { tilt: -8, look: [-0.4, -0.8] } }, 0.3],
    [tm.x2, { expr: 'yorgun', head: { tilt: 6, look: [0.2, 0.3] } }, 0.4],
    [L.h5.t0, { expr: 'saskin', head: { tilt: -4, look: [0.9, -0.3] }, armR: { sh: 20, el: -60 } }, 0.3],
    [tm.think0 + 0.2, { expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: -10, look: [-0.3, -0.9] }, armR: { sh: 18, el: -168 } }],
    [tm.yok, { head: { tilt: 10, look: [0.4, -0.2] }, expr: 'mutlu' }, 0.18],
    [tm.yok + 0.36, { head: { tilt: -10, look: [-0.4, -0.2] } }, 0.18],
    [tm.yok + 0.72, { head: { tilt: 4, look: [0, 0] } }, 0.25],
    [tm.buldum - 0.05, { y: 1430, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1520, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// duvar haritası (üslup: düz renk, sade sınırlar). Yerel koordinat 520×340. st: { gr, bg, sinir, meric, x1, x2, edirne } 0..1
const GR = [[30, 120], [90, 150], [200, 160], [330, 150], [345, 185], [300, 200], [230, 210], [200, 250], [220, 300], [170, 330], [120, 280], [60, 230], [30, 180]];
const BG = [[30, 30], [330, 22], [420, 60], [430, 120], [330, 150], [200, 160], [90, 150], [30, 120]];
const TR = [[330, 150], [430, 120], [520, 140], [520, 260], [400, 250], [352, 210], [345, 185]];
const BORDER = [[30, 120], [90, 150], [200, 160], [330, 150]];
const MERIC = [[330, 150], [338, 168], [345, 185], [352, 212], [362, 250]];
function wallMap(K, x, y, st) {
  const { ctx, rect, poly, text } = K;
  rect(x - 16, y - 16, 552, 372, PAL.woodDark, LW, 10);
  ctx.save(); ctx.translate(x, y);
  rect(0, 0, 520, 340, '#7FB2C2', LW * 0.6, 4);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 520, 340); ctx.clip();
  const mix = (a, b, u) => { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',')})`; };
  poly(TR, '#F1EDE2', LW * 0.6);
  poly(BG, mix('#EBD9A6', '#D19A2E', st.bg), LW * 0.6);
  poly(GR, mix('#EBC3B2', '#D9603F', st.gr), LW * 0.6);
  // sınır (Sınır?) ve Meriç (nehir?)
  const pl = (pts, w, col) => { ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
  if (st.sinir > 0) pl(BORDER, 4 + 8 * st.sinir, PAL.mustard);
  pl(MERIC, 8 + 6 * st.meric, '#1F5F86');
  ctx.restore();
  text(K.up('Bulgaristan'), 220, 98, 30, INK, 900);
  text(K.up('Yunanistan'), 150, 222, 30, INK, 900);
  text(K.up('Türkiye'), 448, 196, 26, INK, 800);
  // elenen tahminler: kırmızı çarpı
  const X = (cx, cy, u) => { if (u <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(u, u); K.circ(0, 0, 30, PAL.red, LW * 0.7); K.line(-12, -12, 12, 12, 7, PAL.paper); K.line(12, -12, -12, 12, 7, PAL.paper); ctx.restore(); };
  X(200, 160, st.x1); X(348, 200, st.x2);
  // Edirne iğnesi (Türkiye tarafında)
  if (st.edirne > 0) {
    ctx.save(); ctx.translate(372, 160); ctx.scale(st.edirne, st.edirne);
    poly([[-12, -4], [12, -4], [0, 22]], PAL.teal, LW * 0.6); K.circ(0, -12, 16, PAL.teal, LW * 0.6); K.circ(0, -12, 6, PAL.paper, 0);
    text('Edirne', 0, -36, 24, INK, 800);
    ctx.restore();
  }
  ctx.restore();
}

// etiket şeridi: dört parça (YUNAN | İSTAN | BUL | GARİSTAN); ölçülerek dizilir
function stripParts(ctx, fsz) {
  ctx.font = `900 ${fsz}px Rubik`;
  const segs = ['YUNAN', 'İSTAN', 'BUL', 'GARİSTAN'], ws = segs.map(s => ctx.measureText(s).width);
  return { segs, ws, total: ws.reduce((a, b) => a + b, 0) };
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t, 0.024);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.strip && t < tm.defeat) return stripScene(K, t, tl, S);

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -1000, x1: 1500, floorY: 1500, t });
  windowIst(K, 700, 600, 280, 240, t);
  const pop = a => (t >= a - 0.04 ? spring(t - (a - 0.04), UI[0], UI[1]) : 0);
  wallMap(K, 70, 560, {
    gr: ease.state(seg(t, tm.gr - 0.04, 0.3)), bg: ease.state(seg(t, tm.bg - 0.04, 0.3)),
    sinir: ease.enter(seg(t, tm.sinir - 0.04, 0.25)), meric: ease.enter(seg(t, tm.meric - 0.04, 0.25)),
    x1: pop(tm.x1), x2: pop(tm.x2), edirne: pop(tm.edirne),
  });
  // takvim: "bir hafta"da gelecek haftanın yedi günü sırayla yeşil
  const marks = {}; for (let d = 9; d <= 15; d++) if (t >= tm.week - 0.04 + (d - 9) * 0.07) marks[d] = PAL.green;
  calendar(K, 1040, 640, 180, 'KASIM', marks);
  // Necmi Abi'nin masası (solda, ayrı çekim)
  necmi(K, t, tl, S);
  // Hikmet Bey masasının arkasında, küre masada
  const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
  const h = t >= tm.cta || (t >= tm.gr - 0.15 && t < tm.sinir - 0.1) ? null : drawChar(ctx, 'hikmet', hp, t);
  desk(K, 560, 1340, 560);
  globe(K, 1000, 1230, 70, 0.3 + 1.6 * ease.enter(seg(t, 0.15, 2.4)) + 0.02 * t);
  const dp = poseAt(CARDS.defne, S.defBase, S.def, t); dp.talk = talkAt(tl, 'defne', t);
  const insert = t >= tm.gr - 0.15 && t < tm.sinir - 0.1;   // harita ara planında karakter yok
  const d = (t >= tm.defeat && t < tm.cta) || insert ? null : drawChar(ctx, 'defne', dp, t);
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.defeat) {
    const hd = t >= tm.cta ? d.head : h.head;
    return caption(K, captionAt(tl, t), { y: t >= tm.cta ? 300 : 1240, head: toScreen(cam, hd) });
  }
  riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 58 });
  if (t >= tm.cnt0 - 0.2 && t < tm.cnt1 + 0.6) {
    const u = spring(t - (tm.cnt0 - 0.2), UI[0], UI[1]), out = 1 - ease.exit(seg(t, tm.cnt1 + 0.25, 0.3)), left = Math.max(0, tm.cnt1 - t);
    ctx.save(); ctx.translate(860, 1110); ctx.scale(u * out, u * out); counter(K, 0, 0, 92, left / 5, String(Math.ceil(left - 1e-6))); ctx.restore();
  }
  const cap = captionAt(tl, t), who = cap?.line.who;
  const nh = S._necmiHead;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' ? nh : null;
  caption(K, cap, { y: 1250, head: head && toScreen(cam, head) });
}

// Necmi Abi: masasında etiket makinesi; şerit boşluksuz basılır
function necmi(K, t, tl, S) {
  const { ctx } = K, { tm } = S;
  if (t < tm.necmi - 0.5 || t >= tm.buldum - 0.06) { S._necmiHead = null; return; }
  const ang = ease.enter(seg(t, tm.grumble - 0.1, 0.3));
  const p = charBase('necmi', { x: -510, y: 1500, s: 230, expr: ang > 0.5 ? 'kizgin' : 'notr', head: { tilt: lerp(-6, 8, ang), look: [0.5, 0.5 - ang] }, armR: { sh: 30, el: -120 }, armL: { sh: 30, el: -120 } });
  p.talk = talkAt(tl, 'necmi', t);
  const n = drawChar(ctx, 'necmi', p, t);
  S._necmiHead = n.head;
  desk(K, -760, 1340, 500);
  // makine ellerin arasında, şerit sağa doğru çıkar
  const mx = (n.handL[0] + n.handR[0]) / 2, my = Math.min(n.handL[1], n.handR[1]) - 10;
  const u = clamp01((t - tm.zip[0]) / (tm.zip[1] - tm.zip[0]));
  const fsz = 34, { total } = stripParts(ctx, fsz), len = total * u + 16;
  if (u > 0) {
    ctx.save(); ctx.translate(mx + 60, my - 10); ctx.rotate(-0.22 - 0.06 * ang);   // yukarı-sağa: sayaçla çakışmasın
    K.rect(0, -24, len + 20, 46, '#F2F0E8', LW * 0.7, 4);
    ctx.save(); ctx.beginPath(); ctx.rect(0, -24, len + 20, 46); ctx.clip();
    K.text(STRIP, 10, 12, fsz, INK, 900, 'left'); ctx.restore();
    ctx.restore();
  }
  K.rect(mx - 64, my - 46, 130, 84, PAL.coral, LW, 14); K.rect(mx - 42, my - 30, 72, 30, '#CFE3D8', LW * 0.6, 4);
}

// çözüm: şerit büyür, İSTANBUL yanar; üstte YUNANİSTAN, altta BULGARİSTAN parantezi
function stripScene(K, t, tl, S) {
  const { ctx, rect, text, line } = K, { tm } = S, u = t - tm.strip;
  const z = 1 + 0.03 * u; ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);   // sürekli yavaş yaklaşma
  room(K, { floorY: 1500, t });
  ctx.fillStyle = 'rgba(31,36,33,0.35)'; ctx.fillRect(0, 0, 1080, 1920);
  // karakterler altta: Necmi makineyle, Defne ortada, Hikmet Bey sağda
  const hk = ease.enter(seg(t, tm.ist - 0.3, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 850, y: 1730, s: 210, expr: hk > 0.5 ? 'korku' : 'saskin', head: { tilt: 6, look: [-0.7, -0.4] }, armL: { sh: lerp(20, 150, hk), el: lerp(-150, 130, hk) }, armR: { sh: lerp(20, 150, hk), el: lerp(-150, 130, hk) } }), t);
  const nu = ease.enter(seg(t, tm.brA, 0.4)), nu2 = ease.enter(seg(t, tm.ist, 0.4));
  const n = drawChar(ctx, 'necmi', charBase('necmi', { x: 210, y: 1730, s: 220, expr: nu2 > 0.5 ? 'mutlu' : 'saskin', head: { tilt: lerp(-6, 10, nu) - 14 * nu2, look: [0.6, lerp(-0.6, -0.2, nu)] }, armR: { sh: 55, el: -60 }, armL: { sh: lerp(20, 140, nu2), el: lerp(-20, 30, nu2) } }), t);
  rect(n.handR[0] - 35, n.handR[1] - 62, 120, 84, PAL.coral, LW, 14);
  const dp = charBase('defne', { x: 540, y: 1770, s: 270, expr: 'mutlu', armR: { sh: 150 + 12 * ease.state(seg(t, tm.brA, 0.4)), el: -10 }, armL: { sh: 30, el: 20 }, head: { tilt: -4, look: [0, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  // şerit
  const inU = spring(u, 120, 24);
  let fsz = 64; const P0 = stripParts(ctx, fsz); fsz = Math.min(64, 64 * 800 / P0.total);
  const { segs, ws, total } = stripParts(ctx, fsz), y = 720;
  const lift = ease.enter(seg(t, tm.ist - 0.04, 0.35));
  ctx.save(); ctx.translate(540, y); ctx.scale(0.8 + 0.2 * inU, 0.8 + 0.2 * inU); ctx.rotate(-0.03 * (1 - lift));
  rect(-total / 2 - 26, -62, total + 52, 100, '#F2F0E8', LW, 6);
  const xs = []; let x = -total / 2; for (const w of ws) { xs.push(x); x += w; }
  // İSTANBUL vurgusu (İSTAN + BUL)
  const hx = xs[1], hw = ws[1] + ws[2];
  rect(hx - 6, -56 - 10 * lift, hw + 12, 88 + 10 * lift, PAL.coral, 0, 8);
  segs.forEach((s, i) => { const hi = i === 1 || i === 2; ctx.globalAlpha = hi ? 1 : 0.45; text(s, xs[i], 10, fsz, hi ? PAL.paper : INK, 900, 'left'); });
  ctx.globalAlpha = 1;
  // parantezler
  const br = (x0, x1, yy, dir, label, col, a0) => {
    const bu = ease.enter(seg(t, a0 - 0.04, 0.3)); if (bu <= 0) return;
    ctx.save(); ctx.globalAlpha = bu;
    const xe = lerp(x0, x1, bu);
    line(x0, yy, xe, yy, 7, col); line(x0, yy, x0, yy - dir * 22, 7, col); if (bu > 0.98) line(x1, yy, x1, yy - dir * 22, 7, col);
    rect((x0 + x1) / 2 - 150, yy + (dir < 0 ? -78 : 22), 300, 56, col, LW * 0.8, 28);
    text(label, (x0 + x1) / 2, yy + (dir < 0 ? -38 : 62), 36, PAL.paper, 900);
    ctx.restore();
  };
  br(xs[0], xs[1] + ws[1], -82, -1, 'YUNANİSTAN', PAL.teal, tm.brA);
  br(xs[2], xs[3] + ws[3], 58, 1, 'BULGARİSTAN', PAL.mustard, tm.brB);
  ctx.restore();
  ctx.restore();
  caption(K, captionAt(tl, t), { y: 960, head: d.head });
}
