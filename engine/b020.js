// Bölüm 20 · KAYIP BAKLAVA (hikâyeli mantık). Necmi "Kerem yedi", Kerem "Ben yemedim", Defne "Necmi yemedi"; yalnız biri doğru → Necmi.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [620, 1080],
    extra: T => ({ s1: T('h2b:0'), s2: T('h2b:4'), s3: T('h2b:8'), one: T('h2c:2'),
      dice: T('n1:2'), each: T('n1:11'), hit: T('n1:14'),
      r1: T('d4:3'), r2: T('d4:8'), r3: T('d5:1'), only: T('d5:8'), win: T('d5:10') }),
  });
}

const ST = [['NECMİ', 'Kerem yedi', PAL.mustard], ['KEREM', 'Ben yemedim', PAL.teal], ['DEFNE', 'Necmi yemedi', PAL.coral]];
// varsayım: kim yedi → her ifadenin doğruluğu
const TRUTH = { Kerem: [true, false, true], Defne: [false, true, true], Necmi: [false, true, false] };

function fridge(K, x, y) {
  K.rect(x - 120, y - 420, 240, 420, '#E6ECEA', LW, 18); K.line(x - 120, y - 280, x + 120, y - 280, LW);
  K.rect(x + 80, y - 400, 14, 90, '#9AA39A', LW * 0.6, 6); K.rect(x + 80, y - 250, 14, 120, '#9AA39A', LW * 0.6, 6);
  // boş baklava tepsisi (dolabın önünde, masada)
}
function tray(K, x, y, crumbs) {
  K.ell(x, y, 120, 26, '#C9CEC4', LW);
  for (let i = 0; i < crumbs; i++) K.circ(x - 60 + i * 30, y - 6, 5, '#D9A441', 2);
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    back: (K, t) => fridge(K, 1000, 1500),
    mid: (K, t) => { K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood); tray(K, 620, 1300, 5); },
    front: (K, t, S, o) => {   // mutlu sahnede Necmi'nin bıyığında şerbet damlası
      if (!o.happy || !o.n) return;
      const g = 1 + 0.15 * Math.sin(t * 6); K.ctx.save(); K.ctx.translate(o.n.head[0] + 10, o.n.head[1] + 70); K.ctx.scale(g, g);
      K.ctx.beginPath(); K.ctx.moveTo(0, -14); K.ctx.quadraticCurveTo(12, 4, 0, 12); K.ctx.quadraticCurveTo(-12, 4, 0, -14); K.fs('#E8A93A', LW * 0.6); K.ctx.restore();
    },
    screen: (K, t, S, top) => {
      if (t > tm.think0 + 0.5) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      [tm.s1, tm.s2, tm.s3].forEach((a, i) => pop(K, t, a, v => { K.ctx.translate(540, 930 + i * 96); K.ctx.scale(v * out, v * out); pill(K, 0, 0, ST[i][0] + ': "' + ST[i][1] + '"', ST[i][2], i === 0 ? INK : PAL.paper, 40); }));
      pop(K, t, tm.one, v => { K.ctx.translate(540, 1220); K.ctx.scale(v * out, v * out); pill(K, 0, 0, 'Yalnız 1 doğru', INK, PAL.paper, 40); });
    },
    tries: [{ s: 'Kerem mi?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text('NECMİ\'NİN ANAHTARLARI', 0, -108, 30, '#6B6355', 900);
      const key = (x, ok, tried) => { K.ctx.save(); K.ctx.translate(x, -10); K.circ(0, -30, 28, tried ? (ok ? PAL.green : '#C9C2B0') : PAL.mustard, LW); K.rect(-8, -6, 16, 80, tried ? (ok ? PAL.green : '#C9C2B0') : PAL.mustard, LW * 0.8, 4); K.rect(8, 40, 22, 12, null, LW * 0.6); if (tried) K.text(ok ? '✓' : '✗', 0, -18, 34, PAL.paper, 900); K.ctx.restore(); };
      const k = Math.floor(clamp01((t - tm.each) / 1.8) * 3);
      pop(K, t, tm.dice, () => { key(-180, false, k >= 1); key(0, false, k >= 2); key(180, true, k >= 3); });
      pop(K, t, tm.each, v => { K.ctx.translate(0, 115); K.ctx.scale(v, v); pill(K, 0, 0, 'TEK TEK DENE', PAL.coral, PAL.paper, 32); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      // başlık satırı: üç ifade
      ST.forEach(([who, s, col], i) => { const x = 445 + i * 150; pill(K, x, 340, who, col, i === 0 ? INK : PAL.paper, 26); K.text('sözü', x, 392, 24, PAL.paper, 800); }); K.text('doğru', 835, 392, 24, PAL.paper, 800);
      const rows = [['Kerem yediyse', 'Kerem', tm.r1], ['Defne yediyse', 'Defne', tm.r2], ['Necmi yediyse', 'Necmi', tm.r3]];
      rows.forEach(([lab, who, a], r) => pop(K, t, a, v => {
        const y = 560 + r * 170, win = who === 'Necmi' && t >= tm.only;
        ctx.translate(505, y); ctx.scale(v, v);
        K.rect(-415, -66, 830, 132, win ? '#DCEFD6' : PAL.cream, LW, 24);
        K.text(lab, -285, 14, 34, INK, 900);
        TRUTH[who].forEach((ok, i) => { const x = -60 + i * 150; K.circ(x, 0, 32, ok ? PAL.green : '#C9C2B0', LW * 0.8); K.text(ok ? '✓' : '✗', x, 13, 36, PAL.paper, 900); });
        const n = TRUTH[who].filter(Boolean).length;
        pill(K, 330, 0, n + ' ✓', n === 1 ? PAL.green : PAL.red, PAL.paper, 34);
      }));
      stamp(K, t, tm.win, 540, 1150, 'BAKLAVAYI NECMİ YEDİ', PAL.coral, 56);
    },
  });
}
