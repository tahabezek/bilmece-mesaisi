// Bölüm 28 · ÇITA VE KARGO (diziden, 82. bölüm). Hiçbir kenar 1 m'yi geçemez; 1,5 m'lik ince çıta →
// 1 m'lik küp kutuda köşeden karşı köşeye: √3 ≈ 1,73 m (kapak çaprazı √2 ≈ 1,41 m yetmez).
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [640, 1120],
    extra: T => ({ stick: T('h1:2'), rule: T('h2a:3'), diag2: T('d2:4'), v141: T('hd:3'),
      cStraight: T('n1:3'), cDiag: T('n1:6'), cCorner: T('n1:7'), cFit: T('n1:10'),
      cube: T('d4:2'), s0: T('d4:6'), s1: T('d4>'), len: T('d5:2'), fit: T('d5:6'), win: T('d5:7') }),
  });
}

const CARD = '#C99A5B', CARD2 = '#B5874A';
// eğik izdüşümlü küp: ön yüz sol alt (x, y), kenar a, derinlik (dx, dy)
function cube(K, x, y, a, dx, dy, { fill = true } = {}) {
  const P = { A: [x, y], B: [x + a, y], C: [x + a, y - a], D: [x, y - a] };
  const Q = Object.fromEntries(Object.entries(P).map(([k, [px, py]]) => [k, [px + dx, py + dy]]));
  if (fill) { K.poly([P.D, P.C, Q.C, Q.D], '#D9B47A', LW); K.poly([P.B, Q.B, Q.C, P.C], CARD2, LW); K.poly([P.A, P.B, P.C, P.D], CARD, LW); }
  return { P, Q };
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    proofDrift: 0.006,
    back: (K, t) => { K.line(760, 1500, 820, 860, 26, '#E3C48E'); K.line(760, 1500, 820, 860, 6, '#B08850'); },   // duvara dayalı çıta
    mid: (K, t) => {
      // yerde kargo kutusu
      cube(K, 380, 1500, 290, 90, -70);
      K.line(380 + 60, 1500 - 145, 380 + 230, 1500 - 145, 10, '#8C6A3A');
    },
    screen: (K, t, S, top) => {
      if (t > tm.think0 + 0.5 || t < tm.stick - 0.1) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      KL.slot(K, t, [[tm.stick, 'Çıta: 1,5 m', PAL.mustard, INK], [tm.rule, 'Kutunun kenarı en fazla 1 m']], top + 75, out);
    },
    tries: [{ s: 'Kapağa çapraz?', t0: tm.d2, strike: tm.hd + 0.1 }],
    front: (K, t) => {
      // yanlış deneme: kapak çaprazı 1,41 m (ekran değil sahne: kutunun üstünde)
      if (t < tm.diag2 || t > tm.cd - 4.6) return;
      const u = ease.enter(seg(t, tm.diag2, 0.4)), { P, Q } = cube(K, 380, 1500, 290, 90, -70, { fill: false });
      K.line(P.D[0], P.D[1], lerp(P.D[0], Q.C[0], u), lerp(P.D[1], Q.C[1], u), 8, PAL.coral);
    },
    clue: (K, t) => {
      K.text("NECMİ'NİN DOLABI", 0, -108, 34, '#6B6355', 900);
      // dolap (eğik küp) ve şemsiye: düz ✗ → çapraz ✗ → köşeden köşeye ✓
      const { P, Q } = cube(K, -320, 135, 150, 60, -45);
      const ph = t >= tm.cCorner ? 2 : t >= tm.cDiag ? 1 : t >= tm.cStraight ? 0 : -1;
      const seg3 = [[[P.A[0] + 85, P.A[1]], [P.A[0] + 85, P.A[1] - 230]], [P.A, [P.C[0] + 30, P.C[1] - 30]], [P.A, Q.C]][Math.max(ph, 0)];
      if (ph >= 0) { K.line(seg3[0][0], seg3[0][1], seg3[1][0], seg3[1][1], 12, ph === 2 ? PAL.green : PAL.coral); }
      const lab = ['düz ✗', 'çapraz ✗', 'köşeden köşeye ✓'][Math.max(ph, 0)];
      if (ph >= 0) pill(K, 140, 10, lab, ph === 2 ? PAL.green : PAL.coral, PAL.paper, 34);
      pop(K, t, tm.cFit, v => { K.ctx.translate(140, 100); K.ctx.scale(v, v); K.text('sığdı!', 0, 0, 40, INK, 900); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      const show = ease.enter(seg(t, tm.proof, 0.4));
      ctx.save(); ctx.globalAlpha = show;
      const a = 380, x0 = 250, y0 = 990, dx = 190, dy = -150;
      const { P, Q } = cube(K, x0, y0, a, dx, dy, { fill: false });
      // yarı saydam kutu: arka kenarlar kesik çizgi
      ctx.setLineDash([16, 14]); K.line(P.A[0], P.A[1], Q.A[0], Q.A[1], 4, '#E9DCC2'); K.line(Q.A[0], Q.A[1], Q.B[0], Q.B[1], 4, '#E9DCC2'); K.line(Q.A[0], Q.A[1], Q.D[0], Q.D[1], 4, '#E9DCC2'); ctx.setLineDash([]);
      for (const [p, q] of [[P.A, P.B], [P.B, P.C], [P.C, P.D], [P.D, P.A], [P.B, Q.B], [P.C, Q.C], [P.D, Q.D], [Q.B, Q.C], [Q.C, Q.D]]) K.line(p[0], p[1], q[0], q[1], 6, PAL.cream);
      K.text('1 m', (P.A[0] + P.B[0]) / 2, P.A[1] + 50, 40, PAL.paper, 900);
      K.text('1 m', P.A[0] - 60, (P.A[1] + P.D[1]) / 2, 40, PAL.paper, 900);
      K.text('1 m', (P.B[0] + Q.B[0]) / 2 + 50, (P.B[1] + Q.B[1]) / 2 + 20, 40, PAL.paper, 900);
      ctx.restore();
      // yüz çaprazı (karşılaştırma): 1,41 m
      if (t >= tm.cube + 0.4) { const u = clamp01((t - tm.cube - 0.4) / 0.4) * (1 - 0.6 * clamp01((t - tm.len) / 0.4)); ctx.save(); ctx.globalAlpha = 0.85 * u; K.line(P.D[0], P.D[1], Q.C[0], Q.C[1], 6, PAL.coral); ctx.restore(); }
      // çıta: alt köşeden karşı üst köşeye
      const s = ease.state(seg(t, tm.s0, Math.max(0.8, tm.s1 - tm.s0)));
      if (s > 0) { K.line(P.A[0], P.A[1], lerp(P.A[0], Q.C[0], s), lerp(P.A[1], Q.C[1], s), 16, '#E3C48E'); K.line(P.A[0], P.A[1], lerp(P.A[0], Q.C[0], s), lerp(P.A[1], Q.C[1], s), 5, '#B08850'); }
      KL.slot(K, t, [[tm.cube + 0.4, 'kapak çaprazı: 1,41 m ✗', PAL.coral], [tm.len, 'köşeden köşeye: 1,73 m ✓', PAL.green]], 370);
      pop(K, t, tm.fit, v => { ctx.translate(540, 1080); ctx.scale(v, v); pill(K, 0, 0, 'çıta 1,5 m < 1,73 m', PAL.cream, INK, 40); });
      stamp(K, t, tm.win, 540, 1190, 'KUTUYA SIĞAR', PAL.green, 60);
    },
  });
}
