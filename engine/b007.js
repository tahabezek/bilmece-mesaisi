// Bölüm 7 · ŞALTER. Mekân: arşiv koridoru (camsız çelik arşiv kapısı, yanında üç şalterli pano).
// İpucu: Necmi Abi kışın ellerini o ampulde ısıtırmış; kapattıktan sonra da sıcak kalırmış. Kanıt: ışık + sıcaklık = 3 durum.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, cabinet, plant } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    door: T('h2a:6'), panel: T('h2a:9'), once: T('h2b:6'),
    think0: T('h3>'), da: T('da'), flip: T('da:1'), d2: T('d2'), n0: T('n0'), hn: T('hn'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), warm: T('n1:4'), off: T('n1:6'), hot: T('n1:9'),
    buldum: T('d3'), proof: T('d3:1') - 0.04,
    s1on: T('d4:0'), ten: T('d4:2'), s1off: T('d4:7'), s2on: T('d4:8'), enter: T('d4:10'),
    r2: T('d5:0'), r1: T('d5:3'), r3: T('d5:7'),
    happy: T('d5>') + 0.1, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1, 560, 960, 'cut'],
    [0.5, 1.05, 540, 990],
    [tm.door - 0.1, 1.15, 620, 1000],
    [tm.panel - 0.1, 1.3, 760, 1040],
    [L.h2b.t0 - 0.05, 1.18, 440, 1010],
    [L.h3.t0 - 0.05, 1.25, 330, 1030],
    [tm.think0 + 0.1, 1.3, 820, 1060],
    [L.d2.t0, 1.38, 840, 1040],
    [tm.n0 - 0.1, 1.32, 1260, 1060],
    [tm.hn - 0.05, 1.22, 420, 1020],
    [tm.hc - 0.05, 1.3, 260, 1040],
    [tm.cd - 5, 1.1, 560, 1000],
    [tm.clue - 0.1, 1.35, 1100, 900],
    [tm.off, 1.45, 1120, 880],
    [tm.buldum, 1.3, 860, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.3, 420, 1020, 'cut'],
    [T('h4:3'), 1.42, 380, 1000],
    [tm.cta, 1.6, 880, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 190, y: 1500, s: 255, expr: 'mutlu', head: { tilt: -4, look: [0.5, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const hik = [
    [L.h1.t0 + 0.2, { armR: { sh: 120, el: 20 } }, 0.35, ease.enter],
    [tm.door - 0.1, { expr: 'notr', armR: { sh: 95, el: 5 }, head: { tilt: 6, look: [0.9, -0.1] } }, 0.35, ease.enter],
    [tm.once - 0.1, { armR: { sh: 150, el: -20 }, head: { tilt: -4, look: [0.7, 0] } }, 0.3, ease.enter],
    [tm.think0 + 0.3, { expr: 'mutlu', armR: { sh: 20, el: -60 } }],
    [tm.hn - 0.05, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -8, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.hc - 0.05, { expr: 'mutlu', armR: { sh: 25, el: -160 }, armL: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.8, 0] } }, 0.3],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 900, y: 1520, s: 250, expr: 'mutlu', head: { tilt: -6, look: [-0.8, -0.2] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0 + 0.2, { expr: 'notr', head: { tilt: -2, look: [-0.8, -0.3] } }],
    [tm.think0 + 0.1, { expr: { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 }, head: { tilt: 8, look: [-0.9, -0.2] }, armR: { sh: 18, el: -168 } }],
    [tm.flip - 0.1, { armL: { sh: 95, el: 10 }, head: { tilt: -4, look: [-0.9, -0.1] } }, 0.25, ease.enter],
    [tm.d2 + 0.6, { armL: { sh: 12, el: -10 }, armR: { sh: 18, el: -168 }, expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: 8, look: [-0.5, -0.8] } }, 0.35],
    [tm.n0, { head: { tilt: -4, look: [0.9, 0] } }, 0.3],
    [tm.hn, { expr: 'saskin', blink: 0, head: { tilt: 4, look: [-0.9, -0.1] }, armR: { sh: 20, el: -60 } }, 0.2, ease.enter],
    [tm.hc + 0.5, { blink: null, expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { blink: null, expr: 'notr', head: { tilt: -4, look: [0.9, 0] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.hot, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1520, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// ampul: glow 0..1 ışık, heat 0..1 sıcaklık dalgası, cold 0..1 soğuk (mavi kar tanesi)
export function bulb(K, x, y, r, glow, heat, t, cold = 0) {
  const { ctx, rect, circ, line } = K;
  if (glow > 0) {
    ctx.save(); ctx.globalAlpha = 0.35 * glow; circ(x, y, r * 1.9, '#F7D774', 0); ctx.globalAlpha = 0.5 * glow; circ(x, y, r * 1.45, '#F7D774', 0); ctx.restore();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2, k = 1.55 + 0.06 * Math.sin(t * 6 + i); ctx.save(); ctx.globalAlpha = glow; line(x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25, x + Math.cos(a) * r * k * 1.15, y + Math.sin(a) * r * k * 1.15, LW * 1.1, '#E2A72E'); ctx.restore(); }
  }
  const glass = glow > 0 ? `rgb(${lerp(206, 250, glow)},${lerp(206, 222, glow)},${lerp(198, 120, glow)})` : cold > 0 ? `rgb(${lerp(206, 196, cold)},${lerp(206, 222, cold)},${lerp(198, 236, cold)})` : '#CECEC6';
  ctx.beginPath(); ctx.moveTo(x - r * 0.42, y + r * 0.78); ctx.bezierCurveTo(x - r * 0.5, y + r * 0.35, x - r * 1.02, y + r * 0.1, x - r, y - r * 0.2);
  ctx.arc(x, y - r * 0.2, r, Math.PI, 0); ctx.bezierCurveTo(x + r * 1.02, y + r * 0.1, x + r * 0.5, y + r * 0.35, x + r * 0.42, y + r * 0.78); ctx.closePath(); K.fs(glass, LW);
  // akkor tel
  ctx.beginPath(); ctx.moveTo(x - r * 0.25, y + r * 0.6); ctx.lineTo(x - r * 0.25, y); for (let i = 0; i <= 6; i++) ctx.lineTo(x - r * 0.25 + i * r * 0.5 / 6, y - (i % 2) * r * 0.16); ctx.lineTo(x + r * 0.25, y + r * 0.6);
  ctx.lineWidth = LW * 0.6; ctx.strokeStyle = glow > 0.5 ? '#C2412F' : heat > 0.3 ? '#B5603A' : '#7A7A70'; ctx.stroke();
  for (let i = 0; i < 3; i++) rect(x - r * 0.46, y + r * 0.78 + i * r * 0.2, r * 0.92, r * 0.2, '#9AA39A', LW * 0.7, 4);
  rect(x - r * 0.24, y + r * 1.38, r * 0.48, r * 0.16, INK, 0, 4);
  if (heat > 0) for (let i = -1; i <= 1; i++) {   // sıcaklık dalgaları: yukarı akan dalgalı çizgiler
    ctx.save(); ctx.globalAlpha = heat; ctx.beginPath();
    for (let k = 0; k <= 20; k++) { const v = k / 20, yy = y - r * 1.3 - v * r * 1.2, xx = x + i * r * 0.55 + Math.sin(v * 9 - t * 5 + i) * r * 0.12; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.lineWidth = LW * 1.1; ctx.strokeStyle = PAL.coral; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  }
  if (cold > 0) {   // kar tanesi
    ctx.save(); ctx.globalAlpha = cold; ctx.translate(x + r * 1.15, y - r * 1.1);
    for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); line(-r * 0.32, 0, r * 0.32, 0, LW * 0.9, '#3E86B5'); }
    ctx.restore();
  }
}

// tek şalter: on 0..1 (kol yukarı = açık)
export function toggle(K, x, y, on, label, k = 1) {
  const { ctx, rect, text } = K;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  rect(-40, -66, 80, 132, PAL.cream, LW / k, 12);
  rect(-16, -42, 32, 84, '#5D6A61', LW * 0.7 / k, 10);
  const yy = lerp(22, -22, on);
  rect(-24, yy - 18, 48, 36, on > 0.5 ? PAL.mustard : '#B9B2A2', LW / k, 10);
  if (label) text(label, 0, 112, 46, PAL.trim, 900);
  ctx.restore();
}

// arşiv kapısı: camsız çelik kapı (içerisi görünmez), üstünde ARŞİV levhası
function archiveDoor(K, x, y, w, h) {
  const { rect, text, line, circ } = K;
  rect(x - 18, y - 18, w + 36, h + 18, PAL.trim);
  rect(x, y, w, h, '#6F7C74');
  for (let i = 0; i < 3; i++) rect(x + 26, y + 30 + i * (h - 60) / 3, w - 52, (h - 60) / 3 - 18, '#7E8B82', LW * 0.6, 6);
  rect(x + w * 0.18, y - 110, w * 0.64, 70, PAL.mustard, LW, 10); text('ARŞİV', x + w / 2, y - 60, 44, INK, 900);
  circ(x + w * 0.84, y + h * 0.55, 18, '#C9C2B0'); line(x + w * 0.84, y + h * 0.55, x + w * 0.72, y + h * 0.55, LW * 1.4);
}

function panel(K, x, y, st) {   // üç şalterli pano (dünya uzayı)
  K.rect(x - 150, y - 100, 300, 200, '#E9DCC2', LW, 14);
  st.forEach((on, i) => toggle(K, x - 90 + i * 90, y, on, null, 0.95));
  K.text('1   2   3', x, y + 140, 34, PAL.trim, 900);
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1800, floorY: 1500, window: false, t });
  archiveDoor(K, 380, 820, 250, 680);
  // pano: Defne analizde şalteri açıp kapatır (kapı kapalı, hiçbir şey görünmez)
  const f = t - tm.flip, s1 = f >= 0 && f < 1.6 ? 1 : 0, s2 = t >= tm.d2 && t < tm.d2 + 1.6 ? 1 : 0;
  panel(K, 760, 1040, [s1 || s2 ? 1 : 0, s2, 0]);
  // Necmi Abi sağda, dolabının önünde
  cabinet(K, 1440, 1060, 200, 440, 0);
  plant(K, 1680, 1500, 0.9, t);
  const np = charBase('necmi', { x: 1260, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.6, 0.2] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn) Object.assign(np, { expr: 'mutlu', armR: { sh: 150, el: 10 }, armL: { sh: 150, el: 10 }, head: { tilt: -6, look: [-0.8, -0.2] } });
  if (t >= tm.hn && t < tm.clue) Object.assign(np, { expr: 'saskin', head: { tilt: 8, look: [-0.9, 0] } });
  if (t >= tm.clue - 0.3) { const rub = t >= tm.warm - 0.2 && t < tm.off + 0.4; Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 30 + (rub ? 8 * Math.sin(t * 16) : 0), el: -150 }, armL: { sh: 30 - (rub ? 8 * Math.sin(t * 16) : 0), el: -150 } }); }
  np.talk = talkAt(tl, 'necmi', t);
  const n = happy || t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  // Hikmet Bey solda
  let h = null;
  if (t < tm.cta) {
    const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'kizgin', head: { tilt: -6, look: [0.9, 0] }, armR: { sh: 95, el: 5 } });
    h = drawChar(ctx, 'hikmet', hp, t);
  }
  // Defne
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  if (happy) Object.assign(dp, { expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 } });
  const d = drawChar(ctx, 'defne', dp, t);
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.happy) {
    const cap = captionAt(tl, t), who = cap?.line.who, hd = who === 'defne' ? d?.head : h?.head;
    return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) });
  }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 52 });
  // analiz: 3 şalter / 2 durum çipi
  const top = 300 + cardH;
  if (t >= tm.d2 + 1.2 && t < tm.hn - 0.1) {
    const u = spring(t - (tm.d2 + 1.2), UI[0], UI[1]) * (1 - ease.exit(seg(t, tm.hn - 0.4, 0.3)));
    ctx.save(); ctx.translate(540, top + 75); ctx.scale(u, u);
    K.rect(-330, -58, 660, 116, INK, 0, 58); ctx.globalAlpha = 1;
    K.text('3 şalter', -170, 22, 58, PAL.mustard, 900); K.text('≠', 0, 22, 64, PAL.paper, 900); K.text('2 durum', 170, 22, 58, PAL.trim, 900);
    ctx.restore();
  }
  triesCol(K, t, [{ s: 'Birini aç, gir?', t0: tm.flip, strike: tm.d2 + 0.2 }, { s: 'İkisini aç?', t0: tm.d2, strike: tm.d2 + 1.1 }], { x: 540, y: top + 75, gap: 80, size: 50, fadeAt: tm.d2 + 1.15 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu kartı: Necmi'nin anısı. Eller ampulde; ampul kapanır, sıcaklık kalır
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(330, top + 200); ctx.scale(u * 0.75, u * 0.75);
    K.rect(-300, -200, 600, 400, '#FBF6EC', LW, 24);
    const off = t >= tm.off - 0.04;
    bulb(K, 0, -10, 70, off ? 1 - ease.exit(seg(t, tm.off - 0.04, 0.25)) : 1, off ? 1 : 0.5, t);
    // avuçlar
    for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 120, 40); ctx.scale(sx, 1); K.ell(0, 0, 50, 70, '#E8B48E', LW, -0.3); ctx.restore(); }
    K.text(off ? 'KAPALI…' : 'AÇIK', 0, 170, 40, off ? '#6B6355' : PAL.mustard, 900);
    if (t >= tm.hot - 0.04) { const v = spring(t - (tm.hot - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(180, -150); ctx.scale(v, v); K.rect(-110, -38, 220, 76, PAL.coral, LW * 0.8, 38); K.text('AMA SICAK', 0, 14, 34, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' ? n?.head : null;
  caption(K, cap, { y: 1250, head: head && toScreen(cam, head) });
}

// kanıt: üst sırada 3 şalter, ortada büyük ampul; sonra üç sonuç kartı
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.012 * u; ctx.save(); ctx.translate(0, -8 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(-100, -100, 1280, 2120);
  // adım rozeti
  const step = t < tm.s1off ? 'ADIM 1' : t < tm.enter ? 'ADIM 2' : 'İÇERİ GİR';
  rect(390, 330, 300, 70, PAL.mustard, LW, 35); text(step, 540, 380, 40, INK, 900);
  // şalterler
  const on1 = t >= tm.s1on && t < tm.s1off ? 1 : 0, on2 = t >= tm.s2on ? 1 : 0;
  [on1, on2, 0].forEach((on, i) => toggle(K, 330 + i * 210, 540, ease.state(clamp01(on)), String(i + 1), 1));
  // 10 dakika halkası (birinci açıkken dolar)
  if (t >= tm.ten - 0.1 && t < tm.s1off + 0.4) {
    const a = 1 - ease.exit(seg(t, tm.s1off + 0.1, 0.3)), p = clamp01((t - tm.ten) / Math.max(0.5, tm.s1off - tm.ten));
    ctx.save(); ctx.globalAlpha = a; ctx.translate(330, 760);
    K.circ(0, 0, 62, PAL.paper, LW); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); ctx.closePath(); ctx.fillStyle = PAL.mustard; ctx.fill();
    text('10 dk', 0, 114, 46, PAL.paper, 900); ctx.restore();
  }
  // ortadaki ampul (adım 1: yanar ve ısınır; adım 2: söner ama sıcak, ikinci açık)
  if (t < tm.r2 - 0.2) {
    const heat = clamp01((t - tm.ten) / 1.2);
    bulb(K, 650, 790, 70, on1, heat, t);
    text(t < tm.s1off ? 'ısınıyor' : 'kapalı ama sıcak', 650, 980, 46, PAL.trim, 900);
  }
  // sonuç kartları: yanıyor → 2 · sönük + sıcak → 1 · sönük + soğuk → 3
  const R = [[tm.r2, 1, 0, 0, '2'], [tm.r1, 0, 1, 0, '1'], [tm.r3, 0, 0, 1, '3']];
  R.forEach(([a, g, hh, c, nm], i) => {
    if (t < a - 0.04) return;
    const v = spring(t - (a - 0.04), UI[0], UI[1]), x = 240 + i * 300, y = 870;
    ctx.save(); ctx.translate(x, y); ctx.scale(v, v);
    rect(-130, -180, 260, 380, PAL.cream, LW, 24);
    bulb(K, 0, -85, 46, g, hh, t, c);
    if (g) text('YANIYOR', 0, 62, 44, INK, 900);
    else { text('SÖNÜK', 0, 38, 40, '#6B6355', 900); text(hh ? 'SICAK' : 'SOĞUK', 0, 86, 46, hh ? PAL.coral : '#3E86B5', 900); }
    rect(-62, 108, 124, 76, g ? PAL.mustard : hh ? PAL.coral : '#3E86B5', LW, 38); text(nm, 0, 164, 56, PAL.paper, 900);
    ctx.restore();
  });
  ctx.restore();
  const dp = charBase('defne', { x: 270, y: 1920, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  drawChar(ctx, 'defne', dp, t);
  drawChar(ctx, 'necmi', charBase('necmi', { x: 560, y: 1930, s: 215, expr: 'mutlu', head: { tilt: 6, look: [0, -0.6] }, armR: { sh: 30, el: -110 }, armL: { sh: 30, el: -110 } }), t);
  const hu = ease.enter(seg(t, tm.r3, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 840, y: 1940, s: 230, expr: hu > 0.5 ? 'kizgin' : 'saskin', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 70, hu), el: lerp(-30, 40, hu) }, armR: { sh: lerp(20, 70, hu), el: lerp(-30, 40, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1200, head: null });
}
