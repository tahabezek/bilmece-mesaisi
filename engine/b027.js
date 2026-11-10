// Bölüm 27 · EVVELSİ GÜN 25, SENEYE 28 (diziden, 78. bölüm). Bugün 1 Ocak, doğum günü 31 Aralık:
// 30 Aralık'ta 25, 31 Aralık'ta 26; bu yılın 31 Aralık'ında 27, seneye 28.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [520, 1120],
    extra: T => ({ a25: T('h1:6'), a28: T('h1:10'), id: T('h2a:3'),
      c31: T('n1:2'), cCake: T('n1:6'), cNew: T('n1:10'),
      bday: T('d4:2'), s30: T('d4:5'), s31: T('d4:10'), s27: T('d5:1'), s28: T('d5:6'), win: T('d5:8') }),
  });
}

// kimlik kartı (masada)
function idCard(K, x, y, u) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(-0.08); ctx.scale(u, u);
  K.rect(-90, -56, 180, 112, '#DCE9F0', LW * 0.8, 10); K.rect(-90, -56, 180, 26, PAL.red, LW * 0.8, 10);
  K.rect(-74, -18, 50, 60, '#B9C7CE', LW * 0.5, 6); K.circ(-49, 0, 14, '#8E9CA3', 0);
  for (let i = 0; i < 3; i++) K.line(-10, -10 + i * 20, 70, -10 + i * 20, 5, '#8E9CA3');
  ctx.restore();
}
// takvim yaprağı (ipucu kutusu)
function leaf(K, x, y, day, month, fill) {
  K.rect(x - 100, y - 110, 200, 220, PAL.cream, LW, 14); K.rect(x - 100, y - 110, 200, 56, fill, LW, 14);
  K.text(month, x, y - 70, 30, PAL.paper, 900); K.text(day, x, y + 50, 96, INK, 900);
}
// kanıt satırı: tarih etiketi + yaş balonu
function row(K, t, a, y, label, age, { hi = false, cake = false } = {}) {
  if (t < a - 0.04) return;
  const { ctx } = K, v = KL.spring(t - (a - 0.04), 320, 30);
  ctx.save(); ctx.translate(540, y); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
  K.rect(-400, -50, 600, 100, hi ? PAL.mustard : PAL.cream, LW, 20);
  K.text(label, -100, 16, 40, INK, 900);
  K.circ(300, 0, 62, hi ? INK : PAL.teal, LW); K.text(String(age), 300, 22, 60, PAL.paper, 900);
  if (cake) { K.rect(186, -30, 44, 34, '#F4D6B8', LW * 0.6, 6); K.line(208, -30, 208, -50, 4, PAL.coral); }
  ctx.restore();
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    proofDrift: 0.006,
    mid: (K, t) => {
      K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood);
      if (t >= tm.id - 0.2) idCard(K, 600, 1280, ease.enter(seg(t, tm.id - 0.2, 0.3)));
    },
    screen: (K, t, S, top) => {
      if (t > tm.think0 + 0.5 || t < tm.a25 - 0.1) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      KL.slot(K, t, [[tm.a25, 'Evvelsi gün: 25 yaş'], [tm.a28, '25 → seneye 28 ?!', PAL.coral]], top + 75, out);
    },
    tries: [{ s: 'Yanlış mı sayıyor?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text("NECMİ'NİN OĞLU", 0, -108, 34, '#6B6355', 900);
      pop(K, t, tm.clue, v => { K.ctx.translate(-150, 30); K.ctx.scale(v * 0.9, v * 0.9); leaf(K, 0, 0, '31', 'ARALIK', PAL.red);
        if (t >= tm.cCake) { K.rect(30, 40, 60, 44, '#F4D6B8', LW * 0.6, 6); K.line(60, 40, 60, 14, 4, PAL.coral); } });
      pop(K, t, tm.cNew, v => { K.ctx.translate(150, 30); K.ctx.scale(v * 0.9, v * 0.9); leaf(K, 0, 0, '1', 'OCAK', PAL.teal); });
      if (t >= tm.cNew) { const u = ease.enter(seg(t, tm.cNew + 0.1, 0.3)); K.line(-40, 30, -40 + 70 * u, 30, 8, INK); }
    },
    proof: (K, t) => {
      row(K, t, tm.s30, 440, 'Geçen yıl 30 Aralık', 25);
      row(K, t, tm.s31, 570, 'Geçen yıl 31 Aralık', 26, { cake: true });
      row(K, t, tm.proof + 0.2, 700, 'BUGÜN: 1 Ocak', 26, { hi: true });
      row(K, t, tm.s27, 830, 'Bu yıl 31 Aralık', 27, { cake: true });
      row(K, t, tm.s28, 960, 'Seneye 31 Aralık', 28, { cake: true });
      // "evvelsi gün" ve "seneye" vurgusu
      if (t >= tm.s30) { const u = ease.enter(seg(t, tm.s30, 0.3)); K.ctx.save(); K.ctx.globalAlpha = u; pill(K, 330, 375, 'evvelsi gün', PAL.coral, PAL.paper, 30); K.ctx.restore(); }
      stamp(K, t, tm.win, 540, 1150, 'BUGÜN 1 OCAK!', PAL.green, 60);
    },
  });
}
