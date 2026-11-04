// Bölüm 1 · BADANA. Sahne t'nin saf fonksiyonu; bütün anlar ses çizelgesinden (at(tl, "satır:kelime")) okunur.
// Yön: film boyunca baskın hareket soldan sağa (bakışlar, kayan harfler, kamera geçişleri).
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK } from './cast.js';
import { PAL, LW, room, windowIst, clock, desk, monitor, riddleCard, counter, teaGlass } from './office.js';
import { at } from './zaman.js';
import { UI, BIG, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, icon, brush, endCard, countdown, glance } from './sahne.js';
import { CARDS } from './cast.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    icons: [T('h2a:7'), T('h2b:4'), T('h2c:5'), T('h2d:6')],
    clock: T('hs') - 0.9, think0: T('h3>'), cd: T(ep.countdown), hs: T('hs'), da2: T('da2'),
    tries: [T('d2:0'), T('d2:1'), T('d2:5'), T('d2:6')], strike: [T('d2:4'), T('d2:8')],
    necmiIn: T('n1') - 0.5, necmiStop: T('n1') + 0.9, brushUp: T('n1:5'),
    buldum: T('d3'), ladder: T('d3:1') - 0.04,
    drops: [T('d4a:3'), T('d4b:4'), T('d4c:4')],
    defeat: T('d4c>') + 0.1, cta: T('d5') - 0.2, end: T('d5>') + 0.1,
  };
  const HK = { x: 735, y: 1500, s: 270 }, DF = { x: 400, y: 1590, s: 290 };
  // kamera: [t, zoom, cx, cy, 'cut']
  const cam = [
    [0, 1, 540, 960, 'cut'],
    [0.5, 1.06, 560, 1010],
    [L.h2a.t0, 1.16, 680, 950],
    [L.h2c.t0, 1.12, 610, 945],
    [L.h3.t0 - 0.1, 1.0, 520, 960],
    [tm.think0 + 0.2, 1.3, 350, 1060],
    [L.d2.t0, 1.22, 380, 1040],
    [tm.hs - 0.95, 1.0, 500, 960],
    [tm.da2, 1.28, 360, 1060],
    [tm.cd - 5, 1.1, 430, 1010],
    [tm.necmiIn, 1.02, 370, 1030],
    [tm.buldum, 1.22, 470, 1040, 'cut'],
    [tm.ladder, 1, 540, 960, 'cut'],
    [tm.defeat, 1.7, 800, 980, 'cut'],
    [tm.defeat + 0.3, 1.76, 800, 990],
    [tm.cta, 1.7, 340, 1040, 'cut'],
    [tm.cta + 0.4, 1.78, 340, 1050],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hik = [
    [0.6, { lean: -8, head: { tilt: -8, look: [-0.8, 0.4] } }, 0.9],
    [L.h1.t1, { lean: -2, head: { tilt: -2, look: [-0.5, 0.2] } }],
    [L.h2a.t0, { lean: 0, expr: 'mutlu', head: { tilt: 4, look: [0, 0] }, armR: { sh: 150, el: 20 }, armL: { sh: 20, el: -150 } }, 0.4, ease.enter],
    [L.h2b.t0, { lean: -4, head: { tilt: 8, look: [-0.6, 0.1] }, armR: { sh: 65, el: 35 }, armL: { sh: 65, el: 35 } }, 0.4, ease.enter],
    [L.h2c.t0, { lean: 3, head: { tilt: -7, look: [0.3, -0.2] }, armR: { sh: 15, el: -20 }, armL: { sh: 150, el: 20 } }, 0.4, ease.enter],
    [L.h2d.t0, { lean: -6, expr: { brow: 0.05, browTilt: -0.15, eye: 0.6, pupil: 1, curve: 0.6, open: 0.2, w: 1.15, smileEyes: true }, head: { tilt: 10, look: [-0.7, 0.3] }, armR: { sh: 20, el: -150 }, armL: { sh: 20, el: -150 } }, 0.4, ease.enter],
    [L.h3.t0, { armR: { sh: 70, el: -60 }, armL: { sh: 30, el: -150 }, head: { tilt: -6, look: [-0.9, -0.2] } }],
    [tm.think0 + 0.3, { armR: { sh: 12, el: -140 }, armL: { sh: 12, el: -140 }, head: { tilt: -4, look: [-0.6, 0.3] } }],
    [tm.buldum, { expr: 'saskin', head: { tilt: 8, look: [-0.8, 0] }, armR: { sh: 25, el: 30 }, armL: { sh: 25, el: 30 } }, 0.2],
    [tm.defeat, { expr: 'korku', head: { tilt: 10, look: [0, 0.6] }, lean: 4, armR: { sh: 8, el: -4 }, armL: { sh: 8, el: -4 } }, 0.25],
    [L.h4.t0 + 0.6, { expr: 'yorgun', head: { tilt: 14, look: [0.2, 0.8] }, lean: 8 }, 0.8],
  ];
  const hikBase = charBase('hikmet', { ...HK, expr: 'mutlu', lean: -14, head: { tilt: -14, look: [-0.8, 0.4] }, armL: { sh: 28, el: -60 }, armR: { sh: 10, el: 0 } });
  const defBase = charBase('defne', { ...DF, expr: 'notr', head: { tilt: -4, look: [-0.4, 0.3] }, armL: { sh: 25, el: -60 }, armR: { sh: 25, el: -60 } });
  const def = [
    [L.h1.t0 + 0.08, { y: DF.y - 90, expr: 'saskin', head: { tilt: 10, look: [0.9, -0.5] }, armL: { sh: 25, el: -150 }, armR: { sh: 25, el: -150 }, blink: 0 }, 0.22, ease.enter],
    [L.h1.t0 + 0.42, { y: DF.y }, 0.5],
    [L.d1.t0, { expr: { brow: 0.02, browTilt: 0.3, eye: 0.75, pupil: 1, curve: -0.1, open: 0.1, w: 0.9 }, blink: null, armL: { sh: 30, el: 60 }, armR: { sh: 30, el: 60 }, head: { tilt: -6, look: [0.9, -0.3] } }],
    [L.h2a.t0 + 0.4, { expr: 'notr', armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } }],
    [tm.icons[0], { head: { tilt: -4, look: [0.2, -0.9] } }, 0.3],
    [tm.icons[1], { expr: { brow: 0.06, browTilt: 0.2, eye: 1, pupil: 1, curve: 0, open: 0, w: 0.8 }, head: { tilt: 6, look: [0.6, -0.6] } }, 0.3],
    [tm.icons[2], { expr: 'saskin', head: { tilt: -8, look: [0.9, -0.4] }, armL: { sh: 25, el: -150 } }, 0.3],
    [tm.icons[3], { expr: { brow: 0.02, browTilt: 0.35, eye: 0.6, pupil: 1, curve: -0.15, open: 0, w: 0.8 }, head: { tilt: 4, look: [0.5, -0.2] }, armL: { sh: 20, el: -60 }, armR: { sh: 18, el: -168 } }, 0.3],
    [tm.think0 + 0.1, { expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: -10, look: [-0.4, -0.9] }, armR: { sh: 18, el: -168 }, armL: { sh: 22, el: -120 } }],
    [tm.strike[0], { head: { tilt: 8, look: [0.4, -0.9] } }, 0.5],
    [tm.strike[1], { expr: 'yorgun', head: { tilt: -4, look: [0, 0.4] }, armR: { sh: 25, el: -150 }, armL: { sh: 25, el: -150 } }, 0.5],
    [tm.hs - 0.9, { expr: 'saskin', head: { tilt: -6, look: [-0.9, -0.6] } }, 0.3],
    [tm.da2, { expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: -10, look: [-0.4, -0.9] }, armR: { sh: 18, el: -168 }, armL: { sh: 22, el: -120 } }],
    [tm.necmiIn + 0.5, { expr: 'notr', head: { tilt: -6, look: [-0.9, 0] }, armR: { sh: 20, el: -60 }, armL: { sh: 20, el: -60 } }],
    [tm.brushUp, { expr: 'saskin', head: { tilt: -2, look: [-0.9, -0.2] } }, 0.2],
    [tm.buldum - 0.05, { y: DF.y - 120, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: DF.y, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 120, el: -40 }, armL: { sh: 20, el: -60 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 135, el: -60 } }, 0.5],
  ];
  const necBase = charBase('necmi', { x: -260, y: 1500, s: 230, view: 'side', facing: 1, expr: 'yorgun', armR: { sh: 40, el: 50 } });
  // merdiven pozları: her düşüşte Defne kelimeyi gösterir, Hikmet Bey biraz daha çöker
  const ladDefBase = charBase('defne', { x: 300, y: 1900, s: 260, expr: 'mutlu', armR: { sh: 160, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: 6 } });
  const ladHikBase = charBase('hikmet', { x: 800, y: 1920, s: 240, expr: 'saskin', head: { tilt: -8, look: [-0.5, -0.5] }, armL: { sh: 20, el: 120 }, armR: { sh: 20, el: 120 } });
  const D = tm.drops.map(d => d - 0.45);
  const ladDef = [
    [D[0], { armR: { sh: 130, el: -30 }, armL: { sh: 30, el: -40 }, head: { tilt: -4, look: [0.6, -0.8] } }, 0.4, ease.enter],
    [D[1], { armR: { sh: 165, el: 0 }, armL: { sh: 150, el: 10 }, head: { tilt: 8, look: [0.2, -0.6] } }, 0.4, ease.enter],
    [D[2], { armR: { sh: 120, el: -60 }, armL: { sh: 20, el: -150 }, head: { tilt: -6, look: [0.8, -0.2] }, expr: { brow: 0.04, browTilt: -0.1, eye: 0.6, pupil: 1, curve: 0.8, open: 0.3, w: 1.25, smileEyes: true } }, 0.4, ease.enter],
  ];
  const ladHik = [
    [D[0], { head: { tilt: 6, look: [-0.7, -0.7] }, armR: { sh: 150, el: 120 }, armL: { sh: 20, el: 60 } }, 0.4, ease.enter],
    [D[1], { expr: 'korku', head: { tilt: -10, look: [-0.4, -0.8] }, armR: { sh: 150, el: 140 }, armL: { sh: 150, el: 140 } }, 0.4, ease.enter],
    [D[2], { expr: 'yorgun', head: { tilt: 12, look: [-0.3, 0.6] }, lean: 6, armR: { sh: 8, el: -4 }, armL: { sh: 8, el: -4 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase, necBase, ladDef, ladDefBase, ladHik, ladHikBase };
}

const icons = ['is', 'sehir', 'hayvan', 'can'];

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  const card = ep.card;

  // ── merdiven sahnesi: BADANA → ADANA → DANA → ANA ──
  if (t >= tm.ladder && t < tm.defeat) return ladder(K, t, ep, tl, S);
  if (t >= tm.end) return endCard(K, t, t - tm.end);

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -700, x1: 1400, floorY: 1500, t });
  windowIst(K, 640, 660, 300, 250, t);
  // saat: "erken çıkarsın"da akrep yelkovan 17:00'ye koşar
  const cu = ease.state(seg(t, tm.clock - 0.1, 0.9));
  clock(K, 190, 770, 74, 12 + cu * 4, 0, t);   // zaman geçiyor: öğlen → dört

  // Necmi Abi: soldan yürüyerek girer, "badana"da fırçayı kaldırır
  let nec = null;
  if (t > tm.necmiIn - 0.1 && t < tm.ladder) nec = necmi(K, t, tl, S);
  // Hikmet Bey (masanın arkasında, ayakta)
  const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
  const h = t >= tm.cta ? null : drawChar(ctx, 'hikmet', hp, t);
  // Defne
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  if (t >= tm.cta - 0.2) { dp.head = { ...dp.head, look: [0, 0] }; }
  const d = t >= tm.defeat && t < tm.cta ? null : drawChar(ctx, 'defne', dp, t);
  desk(K, 40, 1340, 1000);
  monitor(K, 165, 1120, 230);
  teaGlass(ctx, 880, 1342, 260, LW / 260);
  ctx.restore();

  // ── ekran katmanı ──
  // düşünme: denenen kelimeler Defne'nin solunda alt alta belirir, elenenlerin üstü çizilir
  if (t >= tm.tries[0] && t < tm.hs + 0.4) {
    const names = ['KASAP', 'ASAP?', 'TERZİ', 'ERZİ?'], fade = 1 - clamp01((t - tm.hs + 0.6) / 0.4);
    names.forEach((s, i) => {
      const a = tm.tries[i] - 0.04; if (t < a) return;
      const u = spring(t - a, UI[0], UI[1]);
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(195 - (1 - u) * 40, 730 + i * 112); ctx.scale(0.6 + 0.4 * u, 0.6 + 0.4 * u);
      K.text(s, 4, 5, 64, INK, 900); K.text(s, 0, 0, 64, s.endsWith('?') ? PAL.trim : PAL.paper, 900);
      const sk = s.endsWith('?') ? tm.strike[i === 1 ? 0 : 1] : 1e9, su = ease.enter(seg(t, sk, 0.25));
      if (su > 0) K.line(-100, -22, -100 + 200 * su, -22, 10, PAL.coral);
      ctx.restore();
    });
  }
  // bilmece kartı + ipucu ikonları (sorunun dört basamağı)
  // bilmece çözüldü: kart ve ikonlar yenilgi ve çağrı çekimlerinde yüzlerin önünden kalkar
  if (t >= tm.defeat) return caption(K, captionAt(tl, t), { y: 300, head: toScreen(cam, t >= tm.cta ? d.head : h.head) });
  const cardH = riddleCard(K, 70, 300, 940, card, ep.num, { size: 58 });
  const iconOut = 1 - ease.exit(seg(t, tm.think0, 0.3));
  if (iconOut > 0) icons.forEach((k, i) => {
    const a = tm.icons[i] - 0.04; if (t < a) return;
    const u = spring(t - a, UI[0], UI[1]) * iconOut, x = 210 + i * 220, y = 300 + cardH + 96;
    ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
    K.circ(0, 0, 62, PAL.cream, LW);
    icon(K, k, 0, 4, 0.82);
    ctx.restore();
    if (i < 3) { ctx.globalAlpha = clamp01((t - a) / 0.2) * iconOut; K.text('›', x + 110, y + 18, 60, PAL.paper, 900); ctx.globalAlpha = 1; }
  });
  countdown(K, t, tm.cd, { top: 300 + cardH + 20 });
  // konuşma balonu
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'necmi' && nec ? nec.head : null;
  caption(K, cap, { y: 1240, head: head && toScreen(cam, head) });
}

function necmi(K, t, tl, S) {
  const { ctx } = K, { tm } = S;
  const p = structuredClone(S.necBase);
  const u = ease.state(seg(t, tm.necmiIn, tm.necmiStop - tm.necmiIn));
  p.x = lerp(-260, 130, u);
  if (u < 1) {   // yürüme: faz adım uzunluğuna bağlı (ayak kaymasın)
    const ph = (p.x + 260) / 300;
    const a = ph * Math.PI * 2, swing = 22 * Math.min(1, (1 - u) * 4);
    p.legL = { hip: Math.sin(a) * swing, knee: 6 + Math.max(0, Math.sin(a + 1.7)) * 34 };
    p.legR = { hip: Math.sin(a + Math.PI) * swing, knee: 6 + Math.max(0, Math.sin(a + Math.PI + 1.7)) * 34 };
    p.bob = (1 - Math.abs(Math.cos(a))) * 0.03;
    p.lean = 4;
  }
  const up = ease.enter(seg(t, tm.brushUp - 0.3, 0.4));
  p.armR = { sh: lerp(40, 115, up), el: lerp(50, 20, up) };
  p.armL = { sh: lerp(-10, 20, up), el: 20 };
  p.expr = up > 0.5 ? 'notr' : 'yorgun';
  p.talk = talkAt(tl, 'necmi', t);
  const n = drawChar(ctx, 'necmi', p, t);
  brush(K, n.handR[0], n.handR[1] + 14, lerp(0.6, -0.2, up), 0.95);
  return n;
}

function ladder(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  room(K, { floorY: 1500, t });
  ctx.fillStyle = 'rgba(31,36,33,0.55)'; ctx.fillRect(0, 0, 1080, 1920);
  const word = 'BADANA', step = tm.drops.filter(d => t >= d - 0.45).length;   // kaç harf düştü (görsel kelimeden 0,45 sn önce başlar)
  const cw = 132, y = 760;
  // kart: kalan harf sayısına göre daralır
  const nNow = 6 - step, uS = step ? ease.state(seg(t, tm.drops[step - 1] - 0.45, 0.41)) : 1;
  const wNow = lerp((nNow + 1) * cw, nNow * cw, uS) + 60;
  const inU = spring(t - tm.ladder, BIG[0], BIG[1]);
  ctx.save(); ctx.translate(540, y); ctx.scale(0.8 + 0.2 * inU, 0.8 + 0.2 * inU);
  K.rect(-wNow / 2 + 10, -130, wNow, 200, INK, 0, 26);
  K.rect(-wNow / 2, -140, wNow, 200, PAL.paper, LW, 26);
  // harfler: düşen harf sola-aşağı yuvarlanır, kalanlar ortaya kayar
  for (let j = 0; j < 6; j++) {
    const gone = j < step, fallT = gone ? tm.drops[j] - 0.45 : 0;
    const restIdx = j - step, nAfter = 6 - step, nBefore = nAfter + 1;
    let x = (restIdx - (nAfter - 1) / 2) * cw;
    if (!gone && step) x = lerp((restIdx + 1 - (nBefore - 1) / 2) * cw, x, uS);
    if (gone) {
      const f = t - fallT; if (f > 1.2) continue;
      const nB = 6 - j, x0 = (0 - (nB - 1) / 2) * cw;
      ctx.save(); ctx.translate(x0 - f * 160, -40 + 900 * f * f); ctx.rotate(-f * 2.2); ctx.globalAlpha = clamp01(1.2 - f);
      K.text(word[j], 0, 50, 150, PAL.coral, 900); ctx.restore();
      continue;
    }
    K.text(word[j], x, 10, 150, INK, 900);
  }
  ctx.restore();
  // üstte cevabın resmi: rulo → iğne → dana → kalp (her kelimeyle değişir)
  const kinds = ['rulo', 'sehir', 'hayvan', 'can'], labels = ['BADANA', 'ADANA', 'DANA', 'ANA'];
  const k0 = step ? tm.drops[step - 1] - 0.04 : tm.ladder;
  const iu = spring(t - k0, UI[0], UI[1]);
  ctx.save(); ctx.translate(540, 470); ctx.scale(iu, iu);
  K.circ(0, 0, 118, PAL.cream, LW); icon(K, kinds[step], 0, 6, 1.6);
  ctx.restore();
  // alt şerit: dört basamak, bulundukça tik
  const kindsQ = ['is', 'sehir', 'hayvan', 'can'];
  kindsQ.forEach((k, i) => {
    const x = 210 + i * 220, yy = 1010, done = i <= step;
    ctx.globalAlpha = done ? 1 : 0.45;
    K.circ(x, yy, 58, done ? PAL.cream : '#9AA59E', LW); icon(K, k, x, yy + 4, 0.74);
    ctx.globalAlpha = 1;
    if (done) {
      const cu = spring(t - (i ? tm.drops[i - 1] - 0.04 : tm.ladder + 0.2), UI[0], UI[1]);
      ctx.save(); ctx.translate(x + 42, yy - 42); ctx.scale(cu, cu); K.circ(0, 0, 24, PAL.green, LW * 0.8);
      K.line(-10, 0, -2, 9, 6, PAL.paper); K.line(-2, 9, 12, -9, 6, PAL.paper); ctx.restore();
    }
  });
  // karakterler altta: Defne sevinçli, Hikmet şaşkın
  const dp = poseAt(CARDS.defne, S.ladDefBase, S.ladDef, t); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  drawChar(ctx, 'hikmet', poseAt(CARDS.hikmet, S.ladHikBase, S.ladHik, t), t);
  caption(K, captionAt(tl, t), { y: 1130, head: d.head });
}
