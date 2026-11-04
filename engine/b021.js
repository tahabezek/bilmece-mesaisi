// Bölüm 21 · CUMA–SALI (diziden). Cuma nerede Salı'dan önce gelir? → Sözlükte (alfabede C, S'den önce).
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 940],
    extra: T => ({ book: T('n1:0'), top: T('n1:2'), bottom: T('n1:6'), az: T('n1:10'),
      abc: T('d3>') + 0.1, cC: T('d4:5'), cS: T('d4:7'), dict: T('d5:7'), win: T('d5:10') }),
  });
}

const DAYS = ['Pzt', 'Salı', 'Çar', 'Per', 'Cuma', 'Cmt', 'Paz'];
function weekBoard(K, x, y, t, hiSali, hiCuma) {
  K.rect(x - 330, y - 110, 660, 220, PAL.cream, LW, 16); K.rect(x - 330, y - 110, 660, 50, PAL.coral, LW, 16); K.text('HAFTA', x, y - 72, 30, PAL.paper, 900);
  DAYS.forEach((d, i) => { const dx = x - 282 + i * 94, hi = (d === 'Salı' && hiSali) || (d === 'Cuma' && hiCuma); K.rect(dx - 40, y - 40, 80, 120, hi ? PAL.mustard : '#FFFFFF', LW * 0.7, 10); K.text(d, dx, y + 30, 24, INK, 900); });
}
const ABC = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    cardSize: 66,
    back: (K, t) => weekBoard(K, 600, 900, t, true, true),
    tries: [{ s: 'Başka ülkede mi?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text('NECMİ\'NİN REHBERİ', 0, -108, 30, '#6B6355', 900);
      pop(K, t, tm.book, v => { K.ctx.scale(v, v); K.rect(-150, -80, 300, 190, '#FFFFFF', LW, 12);
        ['Ahmet', 'Bekir', 'Mehmet', 'Zeki'].forEach((n, i) => { const hi = (i === 0 && t >= tm.top) || (i === 3 && t >= tm.bottom); if (hi) K.rect(-140, -72 + i * 46, 280, 42, PAL.mustard, 0, 6); K.text(n, -120, -40 + i * 46, 36, INK, 900, 'left'); }); });
      pop(K, t, tm.az, v => { K.ctx.translate(250, 0); K.ctx.scale(v, v); pill(K, 0, 0, 'A → Z', PAL.coral, PAL.paper, 40); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      // alfabe şeridi: C ve S yanar
      if (t >= tm.abc - 0.04) ABC.forEach((ch, i) => {
        const v = clamp01((t - tm.abc - i * 0.03) / 0.2); if (v <= 0) return;
        const x = 120 + (i % 10) * 92, y = 380 + Math.floor(i / 10) * 92, hi = (ch === 'C' && t >= tm.cC) || (ch === 'S' && t >= tm.cS);
        ctx.save(); ctx.globalAlpha = v; K.rect(x - 38, y - 38, 76, 76, hi ? PAL.mustard : PAL.cream, LW * 0.7, 12); K.text(ch, x, y + 16, 42, INK, 900); ctx.restore();
      });
      // sözlük sayfası
      pop(K, t, tm.dict, v => { ctx.translate(540, 900); ctx.scale(v, v);
        K.rect(-380, -150, 760, 300, '#FBF6EC', LW, 14); K.line(0, -140, 0, 140, 3, '#C9BFA9'); K.text('SÖZLÜK', -190, -105, 30, '#6B6355', 900);
        [['cam', 0], ['cuma', 1], ['çay', 0], ['dolap', 0]].forEach(([w, hi], i) => { if (hi) K.rect(-360, -80 + i * 56, 340, 50, PAL.mustard, 0, 6); K.text(w, -340, -42 + i * 56, 42, INK, hi ? 900 : 700, 'left'); });
        [['raf', 0], ['saat', 0], ['salı', 1], ['şeker', 0]].forEach(([w, hi], i) => { if (hi) K.rect(20, -80 + i * 56, 340, 50, PAL.mustard, 0, 6); K.text(w, 40, -42 + i * 56, 42, INK, hi ? 900 : 700, 'left'); });
      });
      stamp(K, t, tm.win, 540, 1150, 'SÖZLÜKTE: CUMA → SALI', PAL.green, 54);
    },
  });
}
