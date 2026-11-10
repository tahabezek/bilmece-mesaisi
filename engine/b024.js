// Bölüm 24 · ART ARDA ÜÇ GÜN (diziden, 125. bölüm). Salı, Perşembe, Cumartesi yasak; haftanın her üçlüsünde
// biri var → gün adı söylemeden: dün, bugün, yarın.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 900],
    extra: T => ({ a1: T('d1:0'), x1: T('h2a:1'), x2: T('h2a:2'), x3: T('h2a:4'),
      w1: T('d2:2'), w2: T('d2:3'), w3: T('d2:4'), gapShow: T('hd:3'), triples: T('hd:5'),
      c1: T('n1:5'), c2: T('n1:7'), c3: T('n1:9'),
      p1: T('d3:1'), p2: T('d3:2'), p3: T('d3:3'), win: T('d4:7') }),
  });
}

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const BAN = { 1: 'x1', 3: 'x2', 5: 'x3' };   // yasak günler ve yasaklandıkları an

// hafta şeridi (ekran katmanı, kartın altında): yasak günler kırmızı çarpı; hi = { gün indeksi: renk }
function weekStrip(K, y, t, tm, hi = {}) {
  DAYS.forEach((d, i) => {
    const dx = 216 + i * 108, b = BAN[i] && t >= tm[BAN[i]];
    K.rect(dx - 48 + 6, y - 46 + 8, 96, 92, INK, 0, 12);
    K.rect(dx - 48, y - 46, 96, 92, hi[i] || (b ? '#F2B8A8' : PAL.cream), LW * 0.7, 12);
    K.text(d, dx, y + 14, 38, INK, 900);
    if (b) { const u = ease.enter(seg(t, tm[BAN[i]], 0.25)); K.ctx.save(); K.ctx.globalAlpha = 0.75; K.line(dx - 38, y - 38, dx - 38 + 76 * u, y - 38 + 76 * u, 6, PAL.red); K.line(dx + 38, y - 38, dx + 38 - 76 * u, y - 38 + 76 * u, 6, PAL.red); K.ctx.restore(); }
  });
}

// koparmalı takvim yaprağı
function page(K, x, y, label, sub, fill) {
  K.rect(x - 130 + 8, y - 150 + 10, 260, 300, INK, 0, 16);
  K.rect(x - 130, y - 150, 260, 300, PAL.cream, LW, 16);
  K.rect(x - 130, y - 150, 260, 70, fill, LW, 16);
  for (const dx of [-70, 0, 70]) K.circ(x + dx, y - 150, 9, PAL.paper, LW * 0.6);
  K.text(label, x, y + 30, label.length > 4 ? 52 : 64, INK, 900);
  K.text(sub, x, y + 100, 26, '#6B6355', 800);
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    cardSize: 60,
    screen: (K, t, S, top) => {
      if (t < tm.a1 - 0.2 || t > tm.cd - 4.7) return;
      const hi = {};
      if (t >= tm.a1 && t < tm.x1) Object.assign(hi, { 2: PAL.mustard, 3: PAL.mustard, 4: PAL.mustard });
      if (t >= tm.w1) { hi[6] = PAL.mustard; if (t >= tm.w2) hi[0] = PAL.mustard; if (t >= tm.w3) hi[2] = PAL.mustard; if (t >= tm.gapShow) hi[1] = '#F2B8A8'; }
      const u = KL.spring(t - (tm.a1 - 0.2), 320, 30); K.ctx.save(); K.ctx.globalAlpha = clamp01(u * 1.6); K.ctx.translate(540, top + 90); K.ctx.scale(0.8 + 0.2 * u, 0.8 + 0.2 * u); K.ctx.translate(-540, -(top + 90));
      weekStrip(K, top + 90, t, tm, hi); K.ctx.restore();
    },
    clue: (K, t) => {
      K.text("NECMİ'NİN SÖZÜ", 0, -108, 34, '#6B6355', 900);
      K.text('“İşi yarına bırakmam…”', 0, -50, 40, INK, 800);
      [['YARINA', tm.c1], ['DÜN', tm.c2], ['BUGÜN', tm.c3]].forEach(([w, a], i) =>
        pop(K, t, a, v => { K.ctx.translate(-240 + i * 240, 30); K.ctx.scale(v, v); pill(K, 0, 0, w, PAL.mustard, INK, 46); }));
      pop(K, t, tm.c3 + 0.5, v => { K.ctx.translate(0, 112); K.ctx.scale(v, v); K.text('Bunlar da gün değil mi?', 0, 0, 30, INK, 800); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      [['DÜN', tm.p1, PAL.teal], ['BUGÜN', tm.p2, PAL.mustard], ['YARIN', tm.p3, PAL.coral]].forEach(([w, a, f], i) =>
        pop(K, t, a, v => { ctx.translate([250, 540, 830][i], 560); ctx.rotate((i - 1) * 0.04); ctx.scale(v * 0.85, v * 0.85); page(K, 0, 0, w, 'art arda', f); }));
      // oklar: üç gün birbirini izliyor
      for (const i of [0, 1]) { const a = [tm.p2, tm.p3][i], u = ease.enter(seg(t, a + 0.1, 0.3)); if (u > 0) { const x0 = [250, 540][i] + 118, x1 = [540, 830][i] - 118; K.line(x0, 560, lerp(x0, x1, u), 560, 10, INK); } }
      // hafta şeridi: hiçbir yasak gün söylenmedi
      if (t >= tm.win - 0.6) {
        const u = clamp01((t - tm.win + 0.6) / 0.3);
        ctx.save(); ctx.globalAlpha = u;
        DAYS.forEach((d, i) => { const x = 210 + i * 110, ban = i in BAN; K.rect(x - 48, 850, 96, 90, ban ? '#F2B8A8' : PAL.cream, LW * 0.7, 10); K.text(d, x, 908, 30, INK, 900); if (ban) K.line(x - 36, 860, x + 36, 930, 6, PAL.red); });
        K.text('Hiçbir gün adı söylenmedi ✓', 540, 1020, 44, PAL.paper, 900);
        ctx.restore();
      }
      stamp(K, t, tm.win, 540, 1170, 'DÜN · BUGÜN · YARIN', PAL.green, 60);
    },
  });
}
