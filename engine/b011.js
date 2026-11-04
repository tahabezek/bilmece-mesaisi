// Bölüm 11 · KARANLIKTA TERS DOSYALAR (yayın #3). Mekân: elektrik kesik arşiv; ay ışığı, loş.
// 20 dosyanın 5'i ters; görmeden iki yığına ayır, tersler eşit olsun. Cevap: rastgele 5 al, hepsini çevir.
// İpucu: Necmi karanlıkta 5 bardağı ters çevirmiş, dik/ters sayıları yer değiştirmiş. Kanıt: ışıklı gösterim, iki senaryo.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, riddleCard, desk, cabinet } from './office.js';
import { at } from './zaman.js';
import { UI, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, triesCol, countdown, glance } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    files: T('h2a:1'), five: T('h2a:6'), flipOk: T('h2b:6'), split: T('h2c:1'),
    think0: T('h3>'), da: T('da'), d2: T('d2'), n0: T('n0'), hn: T('hn'),
    clue: T('n1'), cd: T(ep.countdown), g5: T('n1:1'), gflip: T('n1:5'), gswap: T('n1:14'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    take: T('d4:1'), t1: T('d4:6'), r1: T('d4:11'), flip1: T('d5:2'), eq1: T('d5:11'),
    s2: T('h4') + 0.2, flip2: T('d5b:4'), eq2: T('d5b:8'),
    happy: T('h5') - 0.15, cta: T('d6') - 0.2, end: T('d6>') + 0.1,
  };
  const cam = [
    [0, 1.1, 560, 1040, 'cut'],
    [0.6, 1.14, 520, 1050],
    [L.d1.t0 - 0.05, 1.28, 760, 1060],
    [tm.files - 0.1, 1.2, 640, 1090],
    [L.h2b.t0 - 0.05, 1.22, 380, 1050],
    [tm.split - 0.1, 1.18, 560, 1070],
    [L.h3.t0 - 0.05, 1.28, 300, 1040],
    [tm.think0 + 0.1, 1.3, 760, 1060],
    [tm.d2, 1.36, 740, 1080],
    [tm.n0 - 0.1, 1.3, 1120, 1040],
    [tm.hn - 0.05, 1.22, 420, 1040],
    [tm.cd - 5, 1.1, 560, 1040],
    [tm.clue - 0.1, 1.3, 1100, 900],
    [tm.gflip, 1.4, 1120, 880],
    [tm.buldum - 0.05, 1.32, 740, 1080, 'cut'],
    [tm.proof, 1, 540, 960, 'cut'],
    [tm.happy, 1.32, 300, 1040, 'cut'],
    [T('h5:3'), 1.45, 280, 1020],
    [tm.cta, 1.6, 740, 1100, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const think = { brow: 0.02, browTilt: 0.3, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 };
  const think2 = { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 };
  const hikBase = charBase('hikmet', { x: 190, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] }, armL: { sh: 20, el: -60 }, armR: { sh: 80, el: 20 } });
  const hik = [
    [L.h1.t0 + 1.2, { armR: { sh: 140, el: 10 } }, 0.35, ease.enter],
    [tm.files - 0.2, { armR: { sh: 70, el: 20 }, head: { tilt: 6, look: [0.9, 0.3] } }, 0.35, ease.enter],
    [L.h2c.t0, { armR: { sh: 150, el: -20 }, head: { tilt: -4, look: [0.7, 0] } }, 0.3, ease.enter],
    [tm.think0 + 0.3, { armR: { sh: 20, el: -60 } }],
    [tm.hn - 0.05, { expr: 'kizgin', armR: { sh: 155, el: -5 }, head: { tilt: -6, look: [0.9, 0] } }, 0.2, ease.enter],
    [tm.clue + 0.3, { expr: 'notr', armR: { sh: 20, el: -60 }, head: { tilt: 4, look: [0.9, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -6, look: [0.9, 0] } }, 0.25],
  ];
  const defBase = charBase('defne', { x: 760, y: 1520, s: 245, expr: 'notr', head: { tilt: -4, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 12, el: -10 } });
  const def = [
    [L.d1.t0, { expr: 'saskin', head: { tilt: 6, look: [-0.8, -0.3] } }, 0.25],
    [L.h2a.t0, { expr: 'notr', head: { tilt: 2, look: [-0.3, 0.7] } }, 0.35],
    [tm.think0 + 0.1, { expr: think, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }],
    [tm.d2, { expr: think2, armL: { sh: 70, el: -30 }, armR: { sh: 70, el: -30 }, head: { tilt: 2, look: [0, 0.8] } }, 0.3],
    [tm.n0, { armL: { sh: 12, el: -10 }, armR: { sh: 20, el: -60 }, head: { tilt: -4, look: [0.9, 0] } }, 0.3],
    [tm.hn + 0.6, { expr: think2, head: { tilt: 8, look: [-0.4, -0.8] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.clue + 0.3, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.1] }, armR: { sh: 20, el: -60 } }, 0.4],
    [tm.gswap, { expr: 'saskin', blink: 0 }, 0.2],
    [tm.buldum - 0.05, { y: 1430, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.happy, { y: 1520, expr: 'mutlu', head: { tilt: 8, look: [-0.8, -0.1] }, armR: { sh: 25, el: -160 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta - 0.2, { head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  return { tm, cam, hik, hikBase, def, defBase };
}

// dosya: f 0..1 çevirme (0 = mevcut yüz, 1 = öbür yüz); ters = arka yüz üstte
export function file(K, x, y, w, ters, flip, lit = 1) {
  const { ctx } = K, c = Math.cos(Math.PI * flip), showBack = (c >= 0) === ters;
  ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.04, Math.abs(c)), 1);
  const h = w * 1.3;
  if (showBack) { K.rect(-w / 2, -h / 2, w, h, lit ? PAL.coral : '#6E5B55', LW * 0.8, 6); K.line(-w * 0.3, -h * 0.3, w * 0.3, h * 0.3, 5, lit ? '#A9452C' : '#4F423E'); K.line(w * 0.3, -h * 0.3, -w * 0.3, h * 0.3, 5, lit ? '#A9452C' : '#4F423E'); }
  else { K.rect(-w / 2, -h / 2, w, h, lit ? PAL.cream : '#7D7A70', LW * 0.8, 6); K.rect(-w * 0.32, -h * 0.36, w * 0.64, h * 0.16, lit ? PAL.mustard : '#6E6550', 0, 3); for (let i = 0; i < 3; i++) K.line(-w * 0.3, -h * 0.05 + i * h * 0.14, w * 0.3, -h * 0.05 + i * h * 0.14, 4, lit ? '#C9BFA9' : '#5F5C55'); }
  ctx.restore();
}
function glass(K, x, y, k, up) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, up ? k : -k);
  K.poly([[-26, -40], [26, -40], [18, 40], [-18, 40]], '#D7EAE6', LW / k); K.line(-22, -28, 22, -28, 3 / k, '#9FC2BC'); ctx.restore();
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t, 0.03);   // karanlıkta parlaklık farkı düşük: kamera kayması biraz güçlü
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.proof && t < tm.happy) return proof(K, t, tl, S);
  const happy = t >= tm.happy && t < tm.cta;

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -600, x1: 1800, floorY: 1500, window: false, t });
  cabinet(K, 1380, 1060, 210, 440, 0); cabinet(K, -420, 1060, 210, 440, 0);
  // Necmi (sağda), elinde söndürülmüş fener
  const np = charBase('necmi', { x: 1180, y: 1500, s: 225, expr: 'notr', head: { tilt: 6, look: [-0.7, 0.1] }, armR: { sh: 20, el: -60 }, armL: { sh: 30, el: -120 } });
  if (t >= tm.n0 - 0.1 && t < tm.hn + 0.2) Object.assign(np, { expr: 'mutlu', armL: { sh: 140, el: 10 }, head: { tilt: -6, look: [-0.8, -0.2] } });
  if (t >= tm.hn + 0.2 && t < tm.clue - 0.3) Object.assign(np, { expr: 'saskin', armL: { sh: 20, el: -60 } });
  if (t >= tm.clue - 0.3 && t < tm.buldum) Object.assign(np, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.1] }, armR: { sh: 30, el: -140 }, armL: { sh: 30, el: -140 } });
  np.talk = talkAt(tl, 'necmi', t);
  const n = t >= tm.cta ? null : drawChar(ctx, 'necmi', np, t);
  // Defne masanın arkasında
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd); dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  desk(K, 360, 1330, 700, { h: 200 });
  // 20 dosya masada (karanlıkta hepsi aynı görünür)
  for (let r = 0; r < 2; r++) for (let i = 0; i < 10; i++) file(K, 420 + i * 58 + r * 26, 1290 - r * 18, 44, false, 0, 0);
  // Hikmet solda
  let h = null;
  if (t < tm.cta) { const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
    if (happy) Object.assign(hp, { expr: 'saskin', armR: { sh: 25, el: -165 }, armL: { sh: 25, el: -165 }, head: { tilt: -10, look: [0.3, 0.6] } });
    h = drawChar(ctx, 'hikmet', hp, t); }
  ctx.restore();
  // karanlık: loş mavi örtü + kenar kararması
  ctx.save(); ctx.fillStyle = 'rgba(10,22,34,0.42)'; ctx.fillRect(0, 0, 1080, 1920);
  const g = ctx.createRadialGradient(540, 1100, 300, 540, 1100, 1100); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(6,12,20,0.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
  // ay ışığı: masadaki tek bir ters dosya seçilir (kanca; 'hangisi ters?')
  if (!happy && t < tm.buldum) {
    ctx.save(); applyCam(ctx, cam);
    const lx = 420 + 4 * 58, ly = 1290;
    ctx.save(); ctx.globalAlpha = 0.16; ctx.beginPath(); ctx.moveTo(lx - 30, 300); ctx.lineTo(lx + 120, 300); ctx.lineTo(lx + 50, ly + 30); ctx.lineTo(lx - 50, ly + 30); ctx.closePath(); ctx.fillStyle = '#DDEBFF'; ctx.fill(); ctx.restore();
    file(K, lx, ly, 44, true, 0, 1);
    ctx.restore();
  }

  const heads = { hikmet: h?.head, defne: d?.head, necmi: n?.head };
  if (t >= tm.happy) { const cap = captionAt(tl, t), hd = heads[cap?.line.who]; return caption(K, cap, { y: 300, head: hd && toScreen(cam, hd) }); }
  const cardH = riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 52 }), top = 300 + cardH;
  triesCol(K, t, [{ s: '10 + 10?', t0: tm.d2, strike: T(tl, 'd2:4') }], { x: 540, y: 1170, gap: 84, size: 56, fadeAt: tm.n0 - 0.2 });
  countdown(K, t, tm.cd, { top: top + 20 });
  // ipucu: 5 bardak (2 dik, 3 ters) → hepsi çevrilir → 3 dik, 2 ters
  if (t >= tm.clue - 0.1 && t < tm.buldum) {
    const u = spring(t - (tm.clue - 0.1), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, top + 200); ctx.scale(u, u);
    K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 24);
    const ups0 = [true, false, true, false, false];
    const fl = ease.state(seg(t, tm.gflip, 0.5));
    if (t >= tm.g5 - 0.04) ups0.forEach((up, i) => { const x = -240 + i * 120, upNow = fl < 0.5 ? up : !up; const k = 1 - 0.6 * Math.sin(Math.PI * fl); ctx.save(); ctx.translate(x, -10); ctx.scale(1, k); glass(K, 0, 0, 1, upNow); ctx.restore(); });
    const nUp = fl < 0.5 ? 2 : 3;
    if (t >= tm.g5 - 0.04) K.text(`dik: ${nUp}   ters: ${5 - nUp}`, 0, 110, 40, INK, 900);
    if (t >= tm.gswap - 0.04) { const v = spring(t - (tm.gswap - 0.04), UI[0], UI[1]); ctx.save(); ctx.translate(0, -118); ctx.scale(v, v); K.rect(-210, -36, 420, 72, PAL.coral, LW * 0.8, 36); K.text('SAYILAR YER DEĞİŞTİ', 0, 13, 32, PAL.paper, 900); ctx.restore(); }
    ctx.restore();
  }
  const cap = captionAt(tl, t), hd = heads[cap?.line.who];
  caption(K, cap, { y: 1250, head: hd && toScreen(cam, hd) });
}
const T = (tl, e) => at(tl, e);

// kanıt: "ışıklı gösterim" (izleyici görür, Defne görmez). Üstte senin 5'lik yığının, altta öbür 15.
function proof(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.proof;
  const z = 1 + 0.012 * u; ctx.save(); ctx.translate(0, -6 * u); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  room(K, { floorY: 1500, window: false, t });
  ctx.fillStyle = 'rgba(31,36,33,0.6)'; ctx.fillRect(-100, -100, 1280, 2120);
  rect(300, 300, 480, 64, PAL.mustard, LW, 32); text('IŞIKLI GÖSTERİM', 540, 345, 36, INK, 900);
  const sc2 = t >= tm.s2;   // ikinci senaryo: 4 ters seçilmiş
  const L1 = sc2 ? [true, true, true, false, true] : [false, true, false, true, false];
  const R1 = sc2 ? [9] : [2, 7, 11];
  const flipAt = sc2 ? tm.flip2 : tm.flip1, eqAt = sc2 ? tm.eq2 : tm.eq1;
  const fl = t >= flipAt ? clamp01((t - flipAt) / 0.45) : 0;
  const reset = sc2 ? ease.enter(seg(t, tm.s2, 0.35)) : 1;
  // senin yığının (5)
  if (t >= tm.take - 0.04) {
    const v = spring(t - (tm.take - 0.04), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 560); ctx.scale(v * reset, v * reset);
    rect(-440, -150, 880, 300, PAL.cream, LW, 26); text('SENİN YIĞININ: 5', -410, -105, 34, '#6B6355', 900, 'left');
    L1.forEach((ters, i) => file(K, -320 + i * 160, 15, 110, ters, ease.state(clamp01((fl - i * 0.08) / 0.6)), 1));
    ctx.restore();
  }
  // öbür yığın (15)
  if (t >= tm.take + 0.3) {
    const v = spring(t - (tm.take + 0.3), UI[0], UI[1]);
    ctx.save(); ctx.translate(540, 960); ctx.scale(v, v);
    rect(-440, -170, 880, 340, PAL.cream, LW, 26); text('ÖBÜR YIĞIN: 15', -410, -125, 34, '#6B6355', 900, 'left');
    for (let i = 0; i < 15; i++) file(K, -320 + (i % 5) * 160, -40 + Math.floor(i / 5) * 92, 60, R1.includes(i), 0, 1);
    ctx.restore();
  }
  // sayaçlar
  const lCount = fl > 0.5 ? L1.filter(x => !x).length : L1.filter(x => x).length;
  const showL = t >= (sc2 ? tm.s2 + 0.3 : tm.t1) - 0.04, showR = t >= (sc2 ? tm.s2 + 0.3 : tm.r1) - 0.04;
  const pill = (x, y, label, hot) => { rect(x - 130, y - 40, 260, 80, hot ? PAL.green : INK, LW * 0.8, 40); text(label, x, y + 15, 40, PAL.paper, 900); };
  const eq = t >= eqAt - 0.04;
  if (showL) pill(860, 420, `ters: ${lCount}`, eq);
  if (showR) pill(860, 800, `ters: ${R1.length}`, eq);
  if (t >= tm.eq2 - 0.04) {
    const v = spring(t - (tm.eq2 - 0.04), 420, 26);
    ctx.save(); ctx.translate(540, 1170); ctx.rotate(-0.05); ctx.scale(1.6 - 0.6 * v, 1.6 - 0.6 * v); ctx.globalAlpha = clamp01(v * 2);
    rect(-260, -66, 520, 132, PAL.green, LW * 1.2, 22); text('HEP EŞİT', 0, 24, 70, PAL.paper, 900); ctx.restore();
  }
  ctx.restore();
  const dp = charBase('defne', { x: 210, y: 2060, s: 250, expr: 'mutlu', armR: { sh: 150, el: -10 }, armL: { sh: 20, el: 10 }, head: { tilt: -4, look: [0.4, -0.6] } });
  dp.talk = talkAt(tl, 'defne', t); drawChar(ctx, 'defne', dp, t);
  const hp = charBase('hikmet', { x: 880, y: 2070, s: 235, expr: t >= tm.eq2 ? 'saskin' : 'notr', head: { tilt: 6, look: [-0.6, -0.6] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  if (t >= tm.s2 - 0.3 && t < tm.s2 + 1.2) hp.armR = { sh: 150, el: -10 };
  hp.talk = talkAt(tl, 'hikmet', t); drawChar(ctx, 'hikmet', hp, t);
  caption(K, captionAt(tl, t), { y: 1290, head: null });
}
