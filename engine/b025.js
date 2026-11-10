// Bölüm 25 · KAYIP 10 LİRA (diziden, 38. bölüm; hesap yanılsaması). 270'in içinde kuryenin 20'si zaten var:
// 250 restoran + 20 Kerem = 270; doğru toplam 270 + geri alınan 30 = 300. 20'yi bir daha eklemek çift saymak.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 1180],
    extra: T => ({ paid: T('h2a:4'), back50: T('h2a:8'), k20: T('h2b:1'), d10: T('h2b:4'),
      s270: T('h2c:3'), s290: T('h2c:8'), miss: T('h2c:11'),
      c1: T('n1:4'), c2: T('n1:6'), c3: T('n1:8'),
      bar: T('d4:3'), split250: T('d4:8'), split20: T('d4:12'),
      wrong: T('d5:0'), right: T('d5:9'), plus30: T('d5:12'), win: T('d5:14') }),
  });
}

// masadaki fiş + para
function receipt(K, x, y, t, tm) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.06);
  K.rect(-70, -110, 140, 200, '#FFFFFF', LW * 0.8, 6);
  K.text('FİŞ', 0, -70, 30, INK, 900);
  for (let i = 0; i < 3; i++) K.line(-46, -36 + i * 26, 46, -36 + i * 26, 5, '#C9BFA9');
  K.text('300 TL', 0, 66, 34, INK, 900);
  ctx.restore();
  // üç kişinin yüzlükleri
  for (let i = 0; i < 3; i++) { const a = tm.paid + i * 0.15; if (t < a) continue; const u = ease.enter(seg(t, a, 0.3)); K.rect(x + 110 + i * 60, y + 40 - 30 * (1 - u), 50, 30, '#9BC49A', LW * 0.6, 4); }
}

// hesap satırları (ekran katmanı): soru sırasında birikir
const ROWS = [
  ['paid', '3 kişi × 100 = 300', PAL.cream],
  ['back50', 'İndirim: 50 geri → Kerem 20, herkese 10', PAL.cream],
  ['s270', 'Herkes 90 ödedi: 3 × 90 = 270', PAL.cream],
  ['s290', '270 + Kerem 20 = 290 ?', PAL.mustard],
];

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    proofDrift: 0.008,
    cardSize: 52,
    mid: (K, t) => { K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood); receipt(K, 470, 1220, t, tm); },
    screen: (K, t, S, top) => {
      if (t > tm.think0 + 0.5 || t < tm.paid - 0.1) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      KL.slot(K, t, [...ROWS.map(([k, s], i) => [tm[k], s, i === 3 ? PAL.mustard : INK, i === 3 ? INK : PAL.paper]), [tm.miss, '10 lira nerede?', PAL.coral]], top + 75, out, 40);
    },
    tries: [{ s: 'Kerem mi sakladı?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text("NECMİ'NİN HANIMI", 0, -108, 34, '#6B6355', 900);
      [['HARCAMA', tm.c1, -180], ['KASA', tm.c2, 180]].forEach(([h, a, x]) => {
        K.rect(x - 150, -70, 300, 150, '#FFFFFF', LW * 0.8, 10); K.text(h, x, -32, 30, '#6B6355', 900);
        const on = t >= a; if (on) K.rect(x - 130, -6, 260, 52, PAL.mustard, 0, 8);
        K.text('Çay: 20 TL', x, 34, 36, INK, 900);
      });
      pop(K, t, tm.c3, v => { K.ctx.translate(0, 115); K.ctx.scale(v, v); pill(K, 0, 0, 'AYNI PARA İKİ KERE!', PAL.coral, PAL.paper, 32); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      // 270'lik çubuk: içi 250 restoran + 20 Kerem
      pop(K, t, tm.bar, v => {
        ctx.translate(540, 520); ctx.scale(v, v);
        K.text('ÖDENEN: 270', 0, -90, 46, PAL.paper, 900);
        const W = 720, w250 = W * 250 / 270, sp = ease.state(seg(t, tm.split250, 0.4));
        K.rect(-W / 2, -40, W, 90, PAL.cream, LW, 14);
        if (sp > 0) { ctx.save(); ctx.globalAlpha = sp; K.rect(-W / 2, -40, w250, 90, PAL.teal, LW, 14); K.text('RESTORAN 250', -W / 2 + w250 / 2, 20, 40, PAL.paper, 900); ctx.restore(); }
        const s2 = ease.state(seg(t, tm.split20, 0.4));
        if (s2 > 0) { ctx.save(); ctx.globalAlpha = s2; K.rect(-W / 2 + w250, -40, W - w250, 90, PAL.coral, LW, 0); K.text('KEREM 20', W / 2, 100 + 10 * (1 - s2), 40, PAL.paper, 900, 'right'); ctx.restore(); }
      });
      // yanlış toplam: 20 ikinci kez eklenir
      pop(K, t, tm.wrong, v => {
        ctx.translate(540, 760); ctx.scale(v, v);
        pill(K, 0, 0, '270 + 20 = 290', PAL.cream, INK, 50);
        const u = ease.enter(seg(t, tm.wrong + 1.2, 0.3)); if (u > 0) K.line(-200, 0, -200 + 400 * u, -6, 10, PAL.red);
        if (u > 0.9) K.text('20 iki kere sayıldı', 0, 92, 36, PAL.paper, 800);
      });
      // doğru toplam
      pop(K, t, tm.right, v => {
        ctx.translate(540, 990); ctx.scale(v, v);
        pill(K, 0, 0, t >= tm.plus30 ? '270 + geri 30 = 300 ✓' : '270 + …', PAL.green, PAL.paper, 50);
      });
      stamp(K, t, tm.win, 540, 1180, 'KAYIP YOK: 300 = 300', PAL.green, 56);
    },
  });
}
