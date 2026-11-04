// Bölüm 17 · KAÇ BALIK? (diziden). "İkisi hariç hepsi lüfer / istavrit / hamsi" → 3 balık, her türden bir.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 1150],
    extra: T => ({ b1: T('h2b:0'), b2: T('h2b:4'), b3: T('h2b:8'),
      fruit: T('n1:3'), any: T('n1:12'),
      f1: T('d4:1'), f2: T('d4:3'), f3: T('d4:5'), row1: T('d4:6'), row2: T('d5:0'), row3: T('d5:3'), win: T('d5:7') }),
  });
}

const FISH = [['LÜFER', '#5E7FA8'], ['İSTAVRİT', '#9AA9B0'], ['HAMSİ', '#3F5A66']];
export function fish(K, x, y, k, col, dim = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = 1 - 0.65 * dim;
  K.poly([[60, 0], [95, -28], [95, 28]], col, LW / k);
  K.ell(0, 0, 70, 30, col, LW / k); K.circ(-42, -6, 6, INK, 0); K.line(-20, -22, -20, 22, 3 / k, 'rgba(0,0,0,0.25)');
  ctx.restore();
}
function bucket(K, x, y, t) {
  K.poly([[x - 90, y - 140], [x + 90, y - 140], [x + 70, y], [x - 70, y]], '#8FA093');
  K.ell(x, y - 140, 90, 18, '#C9D6CF', LW);
  for (let i = 0; i < 3; i++) { const a = Math.sin(t * 2 + i) * 0.15; K.ctx.save(); K.ctx.translate(x - 40 + i * 40, y - 150); K.ctx.rotate(-1.2 + a); fish(K, 0, 0, 0.45, FISH[i][1]); K.ctx.restore(); }
  K.text('?', x, y - 50, 70, PAL.paper, 900);
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    cardSize: 58,
    mid: (K, t) => { K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood); bucket(K, 600, 1320, t);
    },
    screen: (K, t, S, top) => {
      // h2b'de üç ifade kartın altında alt alta belirir (düşünme başlayınca kalkar)
      if (t > tm.think0 + 0.5) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      [tm.b1, tm.b2, tm.b3].forEach((a, i) => pop(K, t, a, v => { K.ctx.translate(715, top + 120 + i * 84); K.ctx.scale(v * out, v * out); pill(K, 0, 0, 'İkisi hariç hepsi ' + FISH[i][0].toLocaleLowerCase('tr-TR'), INK, PAL.paper, 34); }));
    },
    tries: [{ s: '2 + 2 + 2 = 6?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text('NECMİ\'NİN PAZARI', 0, -108, 30, '#6B6355', 900);
      const fr = [['elma', PAL.red], ['armut', '#B9C24A'], ['ayva', '#E8C24A']];
      fr.forEach(([n, c], i) => pop(K, t, tm.fruit + i * 0.25, v => { K.ctx.translate(-220 + i * 220, 0); K.ctx.scale(v, v); K.circ(0, 0, 52, c, LW); K.text(n, 0, 95, 32, INK, 900); }));
      pop(K, t, tm.any, v => { K.ctx.translate(0, 130); K.ctx.scale(v, v); pill(K, 0, 0, 'HER BİRİNDEN BİR', PAL.coral, PAL.paper, 30); });
    },
    proof: (K, t) => {
      // üstte üç balık; altta üç satır: her satırda bir tür vurgulu, diğer ikisi "hariç"
      FISH.forEach(([n, c], i) => pop(K, t, [tm.f1, tm.f2, tm.f3][i], v => { K.ctx.translate(250 + i * 290, 420); K.ctx.scale(v, v); fish(K, 0, 0, 1.1, c); K.text(n, 0, 90, 34, PAL.paper, 900); }));
      [tm.row1, tm.row2, tm.row3].forEach((a, r) => pop(K, t, a, v => {
        const y = 640 + r * 150; K.ctx.translate(540, y); K.ctx.scale(v, v);
        K.rect(-440, -60, 880, 120, PAL.cream, LW, 24);
        FISH.forEach(([n, c], i) => { fish(K, -350 + i * 140, 0, 0.5, c, i === r ? 0 : 1); if (i !== r) K.line(-350 + i * 140 - 45, -28, -350 + i * 140 + 45, 28, 6, PAL.red); });
        K.text('2 hariç: ' + FISH[r][0].toLocaleLowerCase('tr-TR'), 160, 14, 38, INK, 900);
        if (t > a + 0.4) { K.circ(400, 0, 30, PAL.green, LW * 0.8); K.text('✓', 400, 13, 36, PAL.paper, 900); }
      }));
      stamp(K, t, tm.win, 540, 1130, '3 BALIK', PAL.green, 70);
    },
  });
}
