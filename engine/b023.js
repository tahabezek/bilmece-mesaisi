// Bölüm 23 · DOĞUM GÜNÜ MUMLARI (diziden, 75. bölüm; sağlam sürüm "sabah kaç mum kalır?").
// 10 mum yandı, 4'ü söndü, kimse yeniden yakmadı → yanan 6 mum gece boyunca eriyip bitti; sabah 4 mum kalır.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 1180],
    extra: T => ({ lit: T('h1:6'), wind: T('h2a:0'), off: T('h2a:4'), night: T('h2b:0'),
      cLit: T('n1:2'), cMorning: T('n1:4'), cPool: T('n1:11'),
      pSix: T('d4:1'), pMelt0: T('d4:3'), pMelt1: T('d4>'), pFour: T('d5:1'), win: T('d5:3') }),
  });
}

const OFF = [1, 4, 6, 8];   // rüzgârda sönen mumlar
const COL = [PAL.coral, PAL.teal, PAL.mustard];

// alev: deterministik titreme
function flame(K, x, y, s, t, i) {
  const { ctx } = K, f = 1 + 0.08 * Math.sin(t * 13 + i * 1.7) + 0.05 * Math.sin(t * 7.3 + i);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * f);
  K.path([[0, -34], [11, -8], [8, 4], [0, 8], [-8, 4], [-11, -8]]); K.fs('#F6C445', LW * 0.6 / s);
  K.ell(0, -2, 4, 7, '#FFF4C8', 0);
  ctx.restore();
}
// mum: h 0..1 (kalan boy), on: yanıyor mu, smoke: sönme dumanı 0..1
function candle(K, x, y, k, i, h, on, t, smoke = 0) {
  const { ctx } = K, H = 70 * k * h, w = 14 * k;
  if (h > 0.03) {
    K.rect(x - w / 2, y - H, w, H, '#FBF6EC', LW * 0.6, 3);
    ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - H, w, H); ctx.clip();
    for (let s = 0; s < 6; s++) K.line(x - w / 2, y - H + s * 14 * k, x + w / 2, y - H + s * 14 * k - 8 * k, 4 * k, COL[i % 3]);
    ctx.restore();
    K.line(x, y - H, x, y - H - 9 * k, 3, INK);
    if (on) flame(K, x, y - H - 10 * k, k * 0.9, t, i);
    if (smoke > 0 && smoke < 1) { ctx.save(); ctx.globalAlpha = 0.5 * (1 - smoke); K.circ(x + 6 * k * smoke, y - H - 20 * k - 50 * k * smoke, 6 * k * (1 + smoke), '#C9C2B6', 0); ctx.restore(); }
  }
  // erimiş mum gölü
  const pool = clamp01((1 - h) * 1.4);
  if (pool > 0.05) K.ell(x, y + 2, 16 * k * pool, 5 * k * pool, COL[i % 3], LW * 0.4);
}
// pasta: st = { on(i), h(i), smoke(i) }
function cake(K, x, y, k, t, st) {
  K.rect(x - 180 * k, y - 20 * k, 360 * k, 140 * k, '#F4D6B8', LW, 18 * k);
  K.rect(x - 180 * k, y - 20 * k, 360 * k, 40 * k, '#FBF6EC', LW, 18 * k);
  for (let j = 0; j < 7; j++) K.circ(x - 150 * k + j * 50 * k, y + 20 * k, 9 * k, PAL.coral, LW * 0.5);
  K.rect(x - 210 * k, y + 116 * k, 420 * k, 16 * k, '#E9DCC2', LW, 8 * k);
  for (let i = 0; i < 10; i++) candle(K, x - 157 * k + i * 35 * k, y - 18 * k, k, i, st.h(i), st.on(i), t, st.smoke(i));
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  const storyOn = i => t >= tm.lit && !(OFF.includes(i) && t >= tm.off);
  return KL.draw(K, t, ep, tl, S, {
    proofDrift: 0.008,
    mid: (K, t) => {
      K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood);
      const after = t >= tm.proof;   // kanıttan sonra: sabah, yalnız sönen 4 mum ayakta
      cake(K, 600, 1210, 0.62, t, { on: i => !after && storyOn(i), h: i => after && !OFF.includes(i) ? 0 : 1, smoke: i => !after && OFF.includes(i) ? clamp01((t - tm.off) / 1.2) : 0 });
    },
    screen: (K, t, S, top) => {
      if (t > tm.think0 + 0.5 || t < tm.lit - 0.1) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      KL.slot(K, t, [[tm.lit, '10 mum yandı', PAL.mustard, INK], [tm.off, "4'ü söndü, kimse yakmadı"], [tm.night, 'Sabaha kadar dokunan yok', PAL.teal]], top + 75, out);
    },
    tries: [{ s: '6 mum?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text("NECMİ'NİN ŞAMDANI", 0, -108, 34, '#6B6355', 900);
      const m = ease.state(seg(t, tm.cMorning + 0.3, Math.max(0.8, tm.cPool - tm.cMorning)));
      pop(K, t, tm.clue, v => {
        K.ctx.translate(-170, 70); K.ctx.scale(v, v);
        K.rect(-60, 0, 120, 18, '#C9A24A', LW * 0.8, 6); K.rect(-14, -20, 28, 24, '#C9A24A', LW * 0.7, 4);
        candle(K, 0, -20, 1.7, 0, 1 - m, m < 0.98, t);
      });
      pop(K, t, tm.cPool, v => { K.ctx.translate(140, 0); K.ctx.scale(v, v); pill(K, 0, 0, 'Yanan mum erir, biter', PAL.coral, PAL.paper, 32); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      const melt = ease.state(seg(t, tm.pMelt0, Math.max(1, tm.pMelt1 - tm.pMelt0)));
      const morning = melt >= 0.5;
      pill(K, 540, 360, morning ? 'SABAH 08:00' : 'GECE 21:00', morning ? PAL.mustard : INK, morning ? INK : PAL.paper, 46);
      cake(K, 540, 800, 2.0, t, {
        on: i => !OFF.includes(i) && melt < 0.97,
        h: i => OFF.includes(i) ? 1 : 1 - melt,
        smoke: () => 0,
      });
      // altı mum: sayılır
      if (t >= tm.pSix) for (let i = 0, n = 0; i < 10; i++) {
        if (OFF.includes(i)) continue; n++;
        const a = tm.pSix + 0.08 * n; if (t < a) continue;
        ctx.save(); ctx.globalAlpha = clamp01((t - a) / 0.2) * (1 - melt); K.text(String(n), 540 - 314 + i * 70, 480, 38, PAL.coral, 900); ctx.restore();
      }
      pop(K, t, tm.pMelt1, v => { ctx.translate(310, 1100); ctx.scale(v, v); pill(K, 0, 0, '6 mum eridi', PAL.coral, PAL.paper, 38); });
      pop(K, t, tm.pFour, v => { ctx.translate(770, 1100); ctx.scale(v, v); pill(K, 0, 0, '4 mum kaldı', PAL.teal, PAL.paper, 38); });
      if (t >= tm.pFour) for (const i of OFF) { const u = clamp01((t - tm.pFour) / 0.3); ctx.save(); ctx.globalAlpha = u; K.ell(540 - 314 + i * 70, 690, 30, 92, null, LW); ctx.restore(); }
      stamp(K, t, tm.win, 540, 1215, 'SABAH PASTADA 4 MUM', PAL.green, 56);
    },
  });
}
