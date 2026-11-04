// Bölüm 10 · KİM KİME BAKIYOR (açılış bölümü, yayın #1). Mekân: açık ofis; dört karakter yan yana.
// Necmi (evli) → Kerem (stajyer, ?) → Hikmet (bekâr). Soru: evli biri bekâr birine bakıyor mu? Cevap: evet (iki durum).
// İpucu: Necmi'nin çiçek mantığı ("kızgınsa da değilse de çiçekçiye gidiyorum"). Kanıt: iki durum paneli.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, plant, clock } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

const X = { defne: 195, necmi: 425, genc: 650, hikmet: 880 };

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    ar1: T('h2a:2'), ar2: T('h2a:6'), evli: T('h2b:1'), bekar: T('h2b:3'), soru: T('h2b:7'), q: T('h2c:3'),
    g1: T('g1'), sus: T('h3'), think0: T('h3>'), da: T('da'), d2: T('d2'), hd: T('hd'), n0: T('n0'), hc: T('hc'),
    clue: T('n1'), cd: T(ep.countdown), br1: T('n1:5'), br2: T('n1:8'), both: T('n1:12'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    p1: T('d4:0'), p1a: T('d4:2'), p1ok: T('d4:7'), p2: T('d5:0'), p2a: T('d5:2'), p2ok: T('d5:9'), evet: T('d5>') + 0.05,
    happy: T('h4') - 0.15, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1.12, 540, 1060, 'cut'],
    [0.6, 1.16, 600, 1060],
    [L.d1.t0 - 0.05, 1.26, 300, 1080],
    [L.h2a.t0 - 0.05, 1.1, 540, 1050],
    [L.h2b.t0 - 0.05, 1.14, 600, 1050],
    [L.h2c.t0 - 0.05, 1.18, 640, 1050],
    [tm.g1 - 0.05, 1.32, 760, 1030],
    [tm.sus - 0.05, 1.25, 820, 1020],
    [tm.think0 + 0.1, 1.3, 260, 1050],
    [tm.hd - 0.05, 1.25, 820, 1020],
    [tm.n0 - 0.1, 1.25, 470, 1030],
    [tm.hc - 0.05, 1.12, 640, 1000],
    [tm.cd - 5, 1.04, 540, 990],
    [tm.clue - 0.1, 1.3, 430, 900],
    [tm.both, 1.4, 440, 880],
    [tm.buldum - 0.05, 1.32, 220, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 840, 1030, 'cut'],
    [T('h4:4'), 1.45, 860, 1010],
    [tm.cta, 1.6, 200, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const hikBase = charBase('hikmet', { x: X.hikmet, y: 1500, s: 245, expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const hik = [
    [L.h1.t0 + 0.6, { armR: { sh: 140, el: 10 } }, 0.35, ease.enter],
    [tm.ar1 - 0.2, { armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 }, head: { tilt: 0, look: [-0.9, 0.1] } }, 0.3, ease.enter],
    [tm.ar2 - 0.15, { armL: { sh: 25, el: -160 }, head: { tilt: -4, look: [-0.6, 0] } }, 0.3, ease.enter],
    [tm.bekar - 0.1, { armL: { sh: 150, el: -10 }, expr: 'mutlu' }, 0.3, ease.enter],
    [L.h2c.t0, { armL: { sh: 20, el: -60 }, armR: { sh: 140, el: 10 }, head: { tilt: 6, look: [-0.9, -0.2] } }, 0.35],
    [tm.sus - 0.05, { expr: 'kizgin', armR: { sh: 155, el: -5 }, armL: { sh: 20, el: -60 }, head: { tilt: -8, look: [-0.9, 0] } }, 0.2, ease.enter],
    [tm.sus + 1.6, { expr: 'mutlu', armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 }, head: { tilt: 4, look: [-0.9, 0] } }, 0.35],
    [tm.hd - 0.05, { expr: 'mutlu', armR: { sh: 150, el: -10 } }, 0.25, ease.enter],
    [tm.n0, { armR: { sh: 20, el: -60 } }, 0.3],
    [tm.hc - 0.05, { expr: 'kizgin', armR: { sh: 155, el: -5 }, head: { tilt: -6, look: [-0.9, 0] } }, 0.2],
    [tm.clue + 0.3, { expr: 'notr', armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [-0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [-0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: X.defne, y: 1520, s: 245, expr: 'mutlu', head: { tilt: 6, look: [0.8, -0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [0.9, 0] } }],
    [tm.think0 + 0.1, { expr: think, head: { tilt: -8, look: [0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: 'mutlu', armL: { sh: 70, el: -30 }, head: { tilt: 4, look: [0.9, 0] } }, 0.3],
    [tm.hd + 0.2, { expr: 'saskin', blink: 0, armL: { sh: 12, el: -10 } }, 0.2],
    [tm.n0 + 0.4, { blink: null, expr: think2, head: { tilt: -8, look: [0.5, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: 4, look: [0.9, 0] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.both, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [0.9, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// etiket (dünya uzayı): baş üstünde hap
function tag(K, x, y, s, label, fill, col, u) {
  if (u <= 0) return;
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
  ctx.font = `900 ${s}px Rubik`; const w = ctx.measureText(label).width + s * 1.1;
  K.rect(-w / 2, -s * 0.85, w, s * 1.45, fill, LW, s * 0.72); K.text(label, 0, s * 0.33, s, col, 900);
  ctx.restore();
}
// bakış oku: a → b (dünya), p ilerleme, hi vurgulu
function gaze(K, a, b, lift, p, col, w = LW * 1.6) {
  if (p <= 0) return;
  const { ctx } = K, mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - lift;
  const pt = u => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1]];
  ctx.beginPath(); for (let i = 0; i <= 30; i++) { const q = pt(p * i / 30); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
  ctx.lineWidth = w + 6; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
  ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke();
  const e = pt(p), e0 = pt(Math.max(0, p - 0.06)), ang = Math.atan2(e[1] - e0[1], e[0] - e0[0]);
  ctx.save(); ctx.translate(e[0], e[1]); ctx.rotate(ang); K.poly([[10, 0], [-22, -16], [-22, 16]], col, LW * 0.8); ctx.restore();
}
function flower(K, x, y, k) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.line(0, 10, 0, 70, 6, PAL.green);
  for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; K.circ(Math.cos(a) * 20, Math.sin(a) * 20, 15, PAL.coral, 4); }
  K.circ(0, 0, 13, PAL.mustard, 4); ctx.restore();
}

function scene(K, t, tl, S, opts) {
  const { ctx } = K, { tm } = S, { happy } = opts;
  room(K, { x0: -600, x1: 1700, floorY: 1500, t });
  clock(K, 1180, 700, 58, 5, 10 + Math.floor(t / 4), t);
  plant(K, -40, 1500, 0.9, t);
  plant(K, 1200, 1500, 0.8, t + 3);
  // Necmi (evli) → Kerem'e bakar
  const np = charBase('necmi', { x: X.necmi, y: 1505, s: 215, expr: 'notr', head: { tilt: 4, look: [0.9, 0] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.n0 - 0.1 && t < tm.hc) Object.assign(np, { expr: 'mutlu', head: { tilt: -4, look: [-0.7, -0.1] }, armR: { sh: 140, el: 10 } });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 6, look: [-0.6, -0.2] }, armR: { sh: 25, el: -160 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  // Kerem (stajyer, ?) → Hikmet'e bakar
  const gp = charBase('genc', { x: X.genc, y: 1505, s: 220, expr: 'notr', head: { tilt: -4, look: [0.9, -0.05] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } });
  if (t >= tm.g1 - 0.05 && t < tm.sus + 0.1) Object.assign(gp, { expr: 'mutlu', armR: { sh: 120, el: 20 }, head: { tilt: 4, look: [-0.6, 0] } });
  if (t >= tm.sus + 0.1 && t < tm.sus + 2.2) Object.assign(gp, { expr: 'saskin', armR: { sh: 25, el: -165 }, armL: { sh: 25, el: -165 } });
  gp.talk = talkAt(tl, 'genc', t);
  const g = t >= tm.cta ? null : drawChar(ctx, 'genc', gp, t);
  // Hikmet (bekâr)
  const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
  if (happy) Object.assign(hp, { expr: 'saskin', head: { tilt: -8, look: [-0.9, 0.2] }, armR: { sh: 25, el: -160 }, armL: { sh: 20, el: -60 } });
  const h = drawChar(ctx, 'hikmet', hp, t);
  // Defne
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  // bakış okları ve etiketler (sahnede, kamera ile birlikte)
  if (!happy && t < tm.cta) {
    const hn = n.head, hg = g.head, hh = h.head, up = 70;
    const pulse = a => 1 + 0.22 * Math.exp(-Math.pow((t - a - 0.15) / 0.18, 2));   // kelimesinde kısa vurgu
    gaze(K, [hn[0] + 45, hn[1] - 70], [hg[0] - 45, hg[1] - 75], up, 1, PAL.mustard, LW * 1.6 * pulse(tm.ar1));
    gaze(K, [hg[0] + 45, hg[1] - 70], [hh[0] - 45, hh[1] - 75], up, 1, PAL.mustard, LW * 1.6 * pulse(tm.ar2));
    const ty = y => y - 150;
    tag(K, hn[0], ty(hn[1]), 42, 'EVLİ', PAL.mustard, INK, pulse(tm.evli));
    tag(K, hh[0], ty(hh[1]), 42, 'BEKÂR', PAL.coral, PAL.paper, pulse(tm.bekar));
    tag(K, hg[0], ty(hg[1]), 46, '?', PAL.cream, INK, pulse(tm.soru));
  }
  return { n, g, h, d };
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;
  ctx.save(); applyCam(ctx, cam);
  const { n, g, h, d } = scene(K, t, tl, S, { happy });
  ctx.restore();

  const heads = { hikmet: h?.head, defne: d?.head, necmi: n?.head, genc: g?.head };
  if (t >= tm.happy) {
    const cap = captionAt(tl, t), hd = heads[cap?.line.who];
    return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) });
  }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 52 }), top = 300 + cardH;
  triesCol(K, t, [{ s: 'Bilinemez?', t0: tm.d2, strike: tm.hd + 0.1 }], { x: 540, y: 1170, gap: 84, size: 54, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: Necmi'nin çiçek mantığı
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    K.text('Hanım kızgın mı? Bilinmiyor.', 0, -100, 34, '#6B6355', 900);
    const rows = [[tm.br1, 'KIZGINSA', -40], [tm.br2, 'DEĞİLSE', 50]];
    rows.forEach(([a, lb, y]) => {
      if (t < a - 0.04) return; const v = spring(t - (a - 0.04), UI[0], UI[1]);
      ctx.save(); ctx.translate(0, y); ctx.scale(v, v);
      K.text(lb, -150, 18, 52, INK, 900); K.text('→', 40, 16, 50, INK, 900); flower(K, 140, -10, 0.9);
      ctx.restore();
    });
    if (t >= tm.both - 0.04) { const v = spring(t - (tm.both - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(0, 130); ctx.scale(v, v); K.rect(-260, -40, 520, 80, PAL.coral, LW * 0.8, 40); K.text('İKİ DURUMDA DA ÇİÇEK', 0, 15, 38, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}

// kanıt: önce "Kerem EVLİYSE" paneli tam genişlikte; d5'te sola çıkar, "BEKÂRSA" sağdan girer (tek yön: sağdan sola).
// Vuruşta ikisi küçülüp üst üste dizilir, "İKİSİNDE DE EVET" damgası.
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.012 * u; ctx.save(); ctx.translate(0, -6 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(-100, -100, 1280, 2120);
  const fin = ease.state(seg(t, tm.evet - 0.35, 0.5));   // son dizilim
  const swap = ease.state(seg(t, tm.p2 - 0.1, 0.5));
  // panel 1
  if (t >= tm.p1 - 0.04) {
    const v = spring(t - (tm.p1 - 0.04), UI[0], UI[1]);
    const x = lerp(lerp(540 + (1 - v) * 300, -600, swap), 540, fin), y = lerp(720, 470, fin), k = lerp(1, 0.62, fin);
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = clamp01(v * 2);
    drawPanel(K, t, 'Kerem EVLİYSE', 'EVLİ', PAL.mustard, INK, 2, tm.p1 + 0.6, tm.p1ok); ctx.restore();
  }
  if (t >= tm.p2 - 0.1) {
    const x = lerp(lerp(1640, 540, swap), 540, fin), y = lerp(720, 860, fin), k = lerp(1, 0.62, fin);
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    drawPanel(K, t, 'Kerem BEKÂRSA', 'BEKÂR', PAL.coral, PAL.paper, 1, tm.p2 + 0.6, tm.p2ok); ctx.restore();
  }
  if (t >= tm.evet) {
    const v = spring(t - tm.evet, 420, 26);
    ctx.save(); ctx.translate(540, 1140); ctx.rotate(-0.05); ctx.scale(1.6 - 0.6 * v, 1.6 - 0.6 * v); ctx.globalAlpha = clamp01(v * 2);
    rect(-330, -70, 660, 140, PAL.green, LW * 1.2, 22); text('İKİSİNDE DE EVET', 0, 24, 66, PAL.paper, 900);
    ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 210, y: 2060, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  drawChar(ctx, 'defne', dp, t);
  const hu = ease.enter(seg(t, tm.evet, 0.4));
  drawChar(ctx, 'hikmet', charBase('hikmet', { x: 880, y: 2070, s: 235, expr: hu > 0.5 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } }), t);
  caption(K, captionAt(tl, t), { y: 1290, head: null });
}

// tek panel (yerel uzay, merkez 0,0; 960×520): üç büyük baş, iki ok; 'which' yeşil yanacak ok (1: Necmi→Kerem, 2: Kerem→Hikmet)
function drawPanel(K, t, title, kTag, kFill, kCol, which, aAt, okAt) {
  const { ctx, rect, text } = K;
  rect(-480, -250, 960, 500, PAL.cream, LW, 30);
  ctx.font = '900 46px Rubik'; const tw = ctx.measureText(title).width + 60;
  rect(-tw / 2, -300, tw, 84, INK, 0, 42); text(title, 0, -243, 46, PAL.paper, 900);
  const P = [[-310, 'necmi', 'EVLİ', PAL.mustard, INK], [0, 'genc', kTag, kFill, kCol], [310, 'hikmet', 'BEKÂR', PAL.coral, PAL.paper]];
  P.forEach(([x, key, lb, f, c]) => {
    ctx.save(); ctx.beginPath(); ctx.roundRect(x - 140, -200, 280, 330, 24); ctx.clip();
    drawChar(ctx, key, charBase(key, { x, y: 610, s: 250, expr: 'notr', head: { tilt: 0, look: [0.9, 0] } }), t);
    ctx.restore();
    tag(K, x, 185, 46, lb, f, c, 1);
  });
  const on = t >= aAt - 0.04, okU = t >= okAt - 0.04 ? spring(t - (okAt - 0.04), UI[0], UI[1]) : 0;
  const a1 = which === 1 && on, a2 = which === 2 && on;
  gaze(K, [-240, -170], [-75, -170], 50, 1, a1 ? PAL.green : '#B9B2A2', a1 ? LW * 2 : LW);
  gaze(K, [75, -170], [240, -170], 50, 1, a2 ? PAL.green : '#B9B2A2', a2 ? LW * 2 : LW);
  if (okU > 0) { ctx.save(); ctx.translate(420, -220); ctx.scale(okU, okU); K.circ(0, 0, 50, PAL.green, LW); K.text('✓', 0, 20, 62, PAL.paper, 900); ctx.restore(); }
}
