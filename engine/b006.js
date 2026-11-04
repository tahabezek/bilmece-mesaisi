// Bölüm 6 · YAŞ. Mekân: ofiste doğum günü (süs zinciri, masada pasta, Hikmet Bey'de külah şapka).
// İpucu: Necmi Abi'nin tebrik kartında ad kutuları yetmez (17 harf). Kanıt: harf sayısı × 2.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, desk, riddleCard, clock } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, thinkCounter } from './sahne.js';

const NAME = ['HİKMET', 'KALAYCIOĞLU'];
const EX = [['ALİ ER', 5, 10], ['AYŞE AK', 6, 12], ['MUSTAFA KAYA', 11, 22]];

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    clap: L.d1.t0, chips: [T('h2b:0'), T('h2b:4'), T('h2b:8')], me: T('h2c:0'), slice: T('h3:1'),
    think0: T('h3>'), clue: T('n1'), tries: [T('d2:0'), T('d2:3')], angry: T('h4'), hatOff: T('h4:2'),
    write: [T('n1:4'), T('n1:7')], seventeen: T('n1:8'),
    buldum: T('d3'), proof: T('d3:1') - 0.04,
    harf: T('d4:2'), iki: T('d4:4'), hikmet: T('d4:6'), onyedi: T('d4:8'), otuzdort: T('d4:11'),
    happy: T('d4>') + 0.1, cta: T('d5') - 0.2, end: T('d5>') + 0.1,
  };
  const cam = [
    [0, 1, 560, 960, 'cut'],
    [0.5, 1.05, 540, 990],
    [L.h2a.t0, 1.12, 520, 900],
    [tm.think0 + 0.1, 1.3, 260, 1060],
    [tm.angry - 0.05, 1.32, 520, 1000],
    [tm.clue - 0.1, 1.35, 1000, 1060],
    [tm.write[0], 1.42, 1010, 1050],
    [tm.seventeen, 1.5, 1030, 1040],
    [tm.buldum, 1.3, 220, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.45, 540, 1020, 'cut'],
    [T('h5:5'), 1.62, 540, 990],
    [tm.cta, 1.6, 200, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 540, y: 1500, s: 255, expr: 'mutlu', head: { tilt: -4, look: [-0.4, 0.1] }, armL: { sh: 150, el: 20 }, armR: { sh: 150, el: 20 } });
  const hik = [
    [L.h1.t1, { armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } }, 0.4],
    [L.h2a.t0, { armR: { sh: 140, el: 10 }, head: { tilt: 6, look: [-0.3, -0.2] } }, 0.35, ease.enter],
    [tm.me - 0.1, { armR: { sh: 25, el: -160 }, head: { tilt: -4, look: [-0.6, 0] } }, 0.35, ease.enter],
    [tm.slice - 0.1, { armR: { sh: 60, el: -40 } }, 0.3],
    [tm.think0 + 0.4, { armR: { sh: 20, el: -60 } }],
    [tm.angry - 0.05, { expr: 'kizgin', armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, head: { tilt: -8, look: [-0.9, 0] } }, 0.2, ease.enter],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [-0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 150, y: 1520, s: 250, expr: 'mutlu', head: { tilt: 6, look: [0.8, -0.2] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.h2a.t0 + 0.2, { expr: 'notr', head: { tilt: -2, look: [0.7, -0.5] } }],
    [tm.think0 + 0.1, { expr: { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 }, head: { tilt: -8, look: [0.9, -0.2] }, armR: { sh: 18, el: -168 } }],
    [tm.angry, { expr: 'saskin', blink: 0, head: { tilt: 6, look: [0.9, -0.1] }, armR: { sh: 20, el: -60 } }, 0.2, ease.enter],
    [tm.clue + 0.3, { blink: null, expr: 'notr', head: { tilt: -4, look: [0.9, 0] } }, 0.4],
    [tm.seventeen, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1520, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

function bunting(K, x0, x1, y, sag, t) {
  const { ctx } = K, cols = [PAL.mustard, PAL.coral, PAL.teal, PAL.cream];
  const yAt = x => y + sag * (1 - Math.pow((2 * (x - x0)) / (x1 - x0) - 1, 2));
  ctx.beginPath(); for (let x = x0; x <= x1; x += 20) (x === x0 ? ctx.moveTo(x, yAt(x)) : ctx.lineTo(x, yAt(x))); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  let i = 0;
  for (let x = x0 + 40; x < x1 - 30; x += 90, i++) {
    const a = 0.05 * Math.sin(t * 1.3 + i);
    ctx.save(); ctx.translate(x, yAt(x)); ctx.rotate(a);
    K.poly([[-30, 0], [30, 0], [0, 62]], cols[i % 4], LW * 0.7); ctx.restore();
  }
}

function hat(K, x, y, rot, k) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  K.poly([[-0.24, 0], [0.24, 0], [0, -0.62]], PAL.teal, LW / k);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-0.24, 0); ctx.lineTo(0.24, 0); ctx.lineTo(0, -0.62); ctx.closePath(); ctx.clip();
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-0.3, -0.1 - i * 0.15); ctx.lineTo(0.3, -0.04 - i * 0.15); ctx.lineWidth = 0.05; ctx.strokeStyle = PAL.mustard; ctx.stroke(); }
  ctx.restore();
  K.circ(0, -0.64, 0.07, PAL.coral, LW / k);
  ctx.restore();
}

// pasta: iki kat, mum etiketi (? → 34), alev; slice: dilim dışarı kayar (0..1)
function cake(K, x, y, label, flame, slice, t) {
  const { ctx, rect, ell, text } = K;
  rect(x - 170, y - 120, 340, 120, '#F4EFE3', LW, 18);
  rect(x - 170, y - 120, 340, 40, PAL.coral, LW, 18);
  for (let i = 0; i < 6; i++) ell(x - 140 + i * 56, y - 78, 16, 14, PAL.coral, 0);
  rect(x - 110, y - 200, 220, 84, '#F4EFE3', LW, 16); rect(x - 110, y - 200, 220, 30, PAL.mustard, LW, 16);
  // dilim
  if (slice > 0) { ctx.save(); ctx.translate(x + 200 * slice, y + 10 * slice); K.poly([[0, -120], [70, -110], [70, 0], [0, 0]], '#F4EFE3', LW); K.poly([[0, -120], [70, -110], [70, -80], [0, -80]], PAL.coral, LW * 0.8); ctx.restore(); }
  // mum: etiket şeklinde
  ctx.save(); ctx.translate(x, y - 196);
  K.text(label, 4, 6, 78, INK, 900); K.text(label, 0, 0, 78, PAL.mustard, 900);
  if (flame > 0) {
    const f = 1 + 0.08 * Math.sin(t * 19) + 0.05 * Math.sin(t * 31);
    ctx.save(); ctx.translate(0, -74); ctx.scale(flame * f, flame * f);
    ctx.beginPath(); ctx.moveTo(0, -36); ctx.quadraticCurveTo(22, -6, 0, 10); ctx.quadraticCurveTo(-22, -6, 0, -36); K.fs('#F2B33D', LW * 0.6); ctx.restore();
  }
  ctx.restore();
  void text;
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1700, floorY: 1500, t });
  bunting(K, -200, 1300, 600, 70, t);
  clock(K, 900, 780, 62, 3, 30, t);
  // Necmi Abi sağ masada tebrik kartı yazar
  const wr = t >= tm.write[0] && t < tm.write[1];
  const np = charBase('necmi', { x: 1070, y: 1500, s: 225, expr: 'notr', head: { tilt: 12, look: [-0.3, 0.8] }, armR: { sh: wr ? 30 + 6 * Math.sin(t * 18) : 30, el: -120 }, armL: { sh: 20, el: -120 } });
  if (t >= tm.clue - 0.3) np.head = { tilt: 2, look: [-0.8, 0.1] };
  np.talk = talkAt(tl, 'necmi', t);
  const n = happy || t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  desk(K, 860, 1340, 420);
  K.rect(940, 1300, 170, 44, PAL.cream, LW * 0.8, 4);
  // Hikmet Bey masanın arkasında
  let h = null;
  if (t < tm.cta) {
    const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'mutlu', head: { tilt: 8, look: [0, -0.2] }, armR: { sh: 140, el: 10 }, armL: { sh: 140, el: 10 } });
    h = drawChar(ctx, 'hikmet', hp, t);
    const crook = happy ? 0 : ease.enter(seg(t, tm.hatOff - 0.1, 0.25)) * 0.55;
    hat(K, h.head[0] + crook * 40, h.head[1] - 0.5 * hp.s, (hp.head.tilt || 0) * Math.PI / 180 * 0.6 + crook, hp.s);
  }
  // Defne
  const dp = poseAt(CARDS.defne, S.defBase, S.def, t); dp.talk = talkAt(tl, 'defne', t);
  const ca = t - tm.clap;
  if (ca >= 0 && ca < 1.4) { const k = Math.abs(Math.sin(ca * Math.PI * 3.2)); dp.armR = { sh: 30 + 25 * k, el: -150 }; dp.armL = { sh: 30 + 25 * k, el: -150 }; }
  const d = happy ? null : drawChar(ctx, 'defne', dp, t);
  desk(K, 250, 1300, 580, { h: 200 });
  const flame = happy ? 1 : 1 - ease.exit(seg(t, tm.hatOff - 0.05, 0.25));
  cake(K, 540, 1300, happy ? '34' : '?', flame, ease.state(seg(t, tm.slice - 0.1, 0.4)), t);
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.happy) {
    const cap = captionAt(tl, t), who = cap?.line.who, hd = who === 'defne' ? d?.head : h?.head;
    return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) });
  }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
  const out = 1 - ease.exit(seg(t, tm.think0, 0.3));
  if (out > 0) EX.forEach(([nm, , age], i) => {
    const a = tm.chips[i] - 0.04; if (t < a) return;
    const u = spring(t - a, UI[0], UI[1]) * out, x = 285 + i * 255, y = 300 + cardH + 96;
    ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
    K.rect(-115, -56, 230, 112, PAL.cream, LW, 24);
    K.text(nm, 0, -12, 28, '#6B6355', 900); K.text(String(age), 0, 44, 52, PAL.coral, 900);
    ctx.restore();
  });
  triesCol(K, t, [{ s: '55?', t0: tm.tries[0], strike: tm.angry + 0.15 }, { s: '60?', t0: tm.tries[1], strike: tm.angry + 0.15 }], { x: 340, y: 625, gap: 78, size: 58, fadeAt: tm.clue - 0.45 });
  thinkCounter(K, t, tm.clue, { x: 150, y: 640, r: 72 });
  // tebrik kartı: AD SOYAD kutuları yetmez
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 650); ctx.scale(u, u);
    K.rect(-380, -96, 760, 190, '#FBF6EC', LW, 18);
    K.text('AD SOYAD', -250, -50, 30, '#6B6355', 900);
    const letters = [...NAME.join('')], nb = 13, bw = 52, x0 = -nb * bw / 2;
    for (let i = 0; i < nb; i++) K.rect(x0 + i * bw, -26, bw - 4, 64, '#FFFFFF', LW * 0.6, 4);
    letters.forEach((ch, i) => {
      const lt = tm.write[0] + (tm.write[1] - tm.write[0] - 0.2) * i / (letters.length - 1); if (t < lt) return;
      const v = spring(t - lt, UI[0], UI[1]);
      if (i < nb) { ctx.save(); ctx.translate(x0 + i * bw + 24, 20); ctx.scale(v, v); K.text(ch, 0, 0, 40, INK, 900); ctx.restore(); }
      else { const j = i - nb; ctx.save(); ctx.translate(x0 + nb * bw + 10 + (j % 2) * 18, -6 + Math.floor(j / 2) * 30); ctx.scale(v, v); K.text(ch, 0, 0, 24, PAL.red, 900); ctx.restore(); }
    });
    if (t >= tm.seventeen - 0.04) { const v = spring(t - (tm.seventeen - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(250, -52); ctx.scale(v, v); K.rect(-70, -30, 140, 60, PAL.coral, LW * 0.8, 30); K.text('17 HARF', 0, 12, 30, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' ? n?.head : null;
  caption(K, cap, { y: 1250, head: head && toScreen(cam, head) });
}

// kanıt: örnekler (harf × 2), sonra HİKMET KALAYCIOĞLU'nun 17 harfi tek tek yanar → 34
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.015 * u; ctx.save(); ctx.translate(0, -12 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);   // yavaş yaklaşma + yukarı kayma
  room(K, { floorY: 1500, t });
  ctx.fillStyle = 'rgba(31,36,33,0.5)'; ctx.fillRect(0, 0, 1080, 1920);
  // örnek satırları
  EX.forEach(([nm, n, age], i) => {
    const y = 450 + i * 84, a = tm.proof + i * 0.12;
    if (t < a) return;
    ctx.save(); ctx.globalAlpha = clamp01((t - a) / 0.2);
    text(nm, 440, y, 44, PAL.paper, 900, 'right');
    if (t >= tm.harf - 0.04) text(`${n} harf`, 470, y, 44, PAL.trim, 800, 'left');
    if (t >= tm.iki - 0.04) text(`× 2 = ${age}`, 665, y, 44, PAL.mustard, 900, 'left');
    ctx.restore();
  });
  // Hikmet Kalaycıoğlu: harf karoları sırayla yanar
  if (t >= tm.hikmet - 0.3) {
    const all = [...NAME[0], ...NAME[1]], span = tm.onyedi - tm.hikmet;
    let idx = 0;
    NAME.forEach((w, r) => {
      const n = w.length, tw = 74, x0 = 540 - n * tw / 2, y = 760 + r * 100;
      [...w].forEach((ch, i) => {
        const k = idx++, lt = tm.hikmet + span * k / (all.length - 1), on = t >= lt;
        rect(x0 + i * tw + 3, y - 40, tw - 6, 84, on ? PAL.coral : '#FFFFFF', LW * 0.8, 8);
        text(ch, x0 + i * tw + tw / 2, y + 20, 50, on ? PAL.paper : INK, 900);
      });
    });
    const cnt = Math.min(17, Math.max(0, Math.floor((t - tm.hikmet) / (span / 16)) + 1));
    ctx.save(); ctx.translate(540, 990); K.rect(-150, -42, 300, 84, PAL.cream, LW, 42); text(`${cnt} harf`, 0, 18, 50, INK, 900); ctx.restore();
  }
  if (t >= tm.otuzdort - 0.04) {
    const v = spring(t - (tm.otuzdort - 0.04), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 1100); ctx.scale(v, v); rect(-210, -54, 420, 108, PAL.coral, LW, 54); text('17 × 2 = 34', 0, 22, 64, PAL.paper, 900); ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 270, y: 1920, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t);
  drawChar(ctx, 'defne', dp, t);
  drawChar(ctx, 'necmi', charBase('necmi', { x: 560, y: 1930, s: 215, expr: 'mutlu', head: { tilt: 6, look: [0, -0.6] }, armR: { sh: 30, el: -110 }, armL: { sh: 30, el: -110 } }), t);
  const hu = ease.enter(seg(t, tm.otuzdort, 0.4));
  const h = drawChar(ctx, 'hikmet', charBase('hikmet', { x: 840, y: 1940, s: 230, expr: hu > 0.5 ? 'mutlu' : 'saskin', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) }, armR: { sh: lerp(20, 150, hu), el: lerp(-30, 10, hu) } }), t);
  hat(K, h.head[0], h.head[1] - 0.5 * 230, 0.1, 230);
  caption(K, captionAt(tl, t), { y: 1200, head: null });
}
