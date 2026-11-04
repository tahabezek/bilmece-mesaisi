// Bölüm 18 · KUMBARA (diziden). Her doğum gününde 1 lira, 12 yaşında 3 lira → 29 Şubat doğumlu (2016, 2020, 2024).
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 1150],
    extra: T => ({ coins: T('h2b:6'), cake: T('n1:4'), ratio: T('n1:8'),
      cal: T('d4:0'), leap: T('d4:8'), c1: T('d5:3'), c2: T('d5:4'), c3: T('d5:5'), win: T('d5:8') }),
  });
}

function piggy(K, x, y, open, t) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y);
  K.ell(0, 0, 120, 85, '#E8A0A8', LW); K.circ(100, -20, 34, '#E8A0A8', LW); K.ell(126, -16, 12, 16, '#D4838C', LW * 0.6);
  K.circ(70, -36, 6, INK, 0); K.poly([[40, -70], [60, -110], [78, -66]], '#E8A0A8', LW * 0.8);
  for (const dx of [-60, -20, 30, 70]) K.rect(dx - 12, 70, 24, 40, '#E8A0A8', LW * 0.8, 6);
  K.rect(-30, -88, 60, 10, INK, 0, 4);
  if (open > 0) for (let i = 0; i < 3; i++) { const v = clamp01(open * 3 - i); if (v <= 0) continue; K.circ(-80 + i * 80, 150 - 40 * Math.sin(Math.PI * v), 22, PAL.mustard, LW * 0.8); K.text('1', -80 + i * 80, 160 - 40 * Math.sin(Math.PI * v), 22, INK, 900); }
  ctx.restore();
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    mid: (K, t) => { K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood); piggy(K, 600, 1210, ease.state(seg(t, tm.coins - 0.3, 1.2)), t); },
    tries: [{ s: 'Delik mi? Hırsız mı?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text('NECMİ\'NİN ARKADAŞI', 0, -108, 30, '#6B6355', 900);
      pop(K, t, tm.cake - 0.6, v => { K.ctx.translate(-170, 10); K.ctx.scale(v, v); pill(K, 0, 0, '52 yaş', INK, PAL.paper, 44); });
      pop(K, t, tm.cake, v => { K.ctx.translate(170, 10); K.ctx.scale(v, v); K.rect(-90, -40, 180, 80, '#F4EFE3', LW, 14); K.rect(-90, -40, 180, 26, PAL.coral, LW, 14); K.text('13 pasta', 0, 30, 30, INK, 900); });
      pop(K, t, tm.ratio, v => { K.ctx.translate(0, 120); K.ctx.scale(v, v); pill(K, 0, 0, '4 YILDA BİR?', PAL.coral, PAL.paper, 30); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      pop(K, t, tm.cal, v => { ctx.translate(540, 360); ctx.scale(v, v); pill(K, 0, 0, 'doğdu: 29 Şubat 2012', INK, PAL.paper, 40); });
      // 2013–2024 şeridi: yalnız artık yıllarda 29 Şubat var
      for (let i = 0; i < 12; i++) {
        const y = 2013 + i, leap = y % 4 === 0, x = 150 + (i % 4) * 260, yy = 520 + Math.floor(i / 4) * 210;
        if (t < tm.cal + 0.05 * i) continue;
        const hi = leap && t >= tm.leap;
        K.rect(x - 110, yy - 70, 220, 160, hi ? PAL.mustard : PAL.cream, LW, 18);
        K.text(String(y), x, yy - 22, 40, INK, 900);
        K.text(leap ? '29 Şubat ✓' : '28 Şubat', x, yy + 30, 28, leap ? PAL.green : '#8A847A', 900);
        const ci = [2016, 2020, 2024].indexOf(y);
        if (ci >= 0) { const a = [tm.c1, tm.c2, tm.c3][ci]; if (t >= a - 0.3) { const u = clamp01((t - a + 0.3) / 0.3); K.circ(x + 80, yy - 60 + 40 * ease.enter(u), 24, PAL.mustard, LW * 0.8); K.text('1', x + 80, yy - 51 + 40 * ease.enter(u), 24, INK, 900); } }
      }
      stamp(K, t, tm.win, 540, 1180, '12 YILDA 3 DOĞUM GÜNÜ', PAL.green, 52);
    },
  });
}
