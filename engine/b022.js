// Bölüm 22 · BUZLU LİMONATA (dizinin "buzdaki ilaç" bilmecesinden; ölüm yerine mide bozulması).
// Bozuk olan buzdu: hızlı içen buz erimeden bitirdi, yavaş içenin bardağında buz eridi.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 1150],
    extra: T => ({ ice: T('h2a:3'), fast: T('h2b:0'), slow: T('h2b:7'),
      cg: T('n1:1'), cice: T('n1:2'), melt: T('n1:9'), rule: T('n1:10'),
      bad: T('d4:1'), kStart: T('d4:5'), kEnd: T('d4:11'), hMelt: T('d5:3'), hMix: T('d5:6'), win: T('d5:10') }),
  });
}

// bardak: level 0..1 sıvı, ice 0..1 buz boyutu, tint 0..1 bozuk su (yeşil)
function glass(K, x, y, k, level, ice, tint = 0, iceBad = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const h = 200, w0 = 70, w1 = 56;
  if (level > 0) { const ly = h / 2 - h * level; ctx.beginPath(); ctx.moveTo(-lerp(w1, w0, 1 - level), ly); ctx.lineTo(lerp(w1, w0, 1 - level), ly); ctx.lineTo(w1, h / 2); ctx.lineTo(-w1, h / 2); ctx.closePath();
    const r = Math.round(lerp(246, 170, tint)), g = Math.round(lerp(226, 205, tint)), b = Math.round(lerp(120, 110, tint)); ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fill(); }
  if (ice > 0.02) for (let i = 0; i < 3; i++) { const s = 34 * ice; K.rect(-50 + i * 36 - s / 2, h / 2 - h * Math.max(level, 0.2) - 4 + (i % 2) * 18, s, s, iceBad ? '#CFE8C8' : '#E8F6FA', LW * 0.6 / k, 6); }
  K.poly([[-w0, -h / 2], [w0, -h / 2], [w1, h / 2], [-w1, h / 2]], null, LW / k);
  ctx.restore();
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    mid: (K, t) => {
      K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood);
      // sürahi + iki bardak
      K.poly([[480, 1150], [580, 1150], [600, 1300], [460, 1300]], 'rgba(246,226,120,0.85)'); K.poly([[470, 1120], [590, 1120], [580, 1150], [480, 1150]], null);
      glass(K, 680, 1250, 0.5, 0.8, 1); glass(K, 780, 1250, 0.5, 0.8, 1);
    },
    screen: (K, t, S, top) => {
      if (t > tm.think0 + 0.5 || t < tm.fast - 0.1) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      pop(K, t, tm.fast, v => { K.ctx.translate(540, 960); K.ctx.scale(v * out, v * out); pill(K, 0, 0, 'Kerem: hızlı → iyi', PAL.teal, PAL.paper, 40); });
      pop(K, t, tm.slow, v => { K.ctx.translate(540, 1060); K.ctx.scale(v * out, v * out); pill(K, 0, 0, 'Hikmet: yavaş → hasta', PAL.coral, PAL.paper, 40); });
    },
    tries: [{ s: 'Mide mi sağlam?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text('NECMİ\'NİN HANIMI', 0, -108, 30, '#6B6355', 900);
      const m = ease.state(seg(t, tm.melt, 1.6));
      pop(K, t, tm.cg, () => { glass(K, -170, 10, 0.8, 0.75 + 0.1 * m, t >= tm.cice ? 1 - 0.8 * m : 0); });
      pop(K, t, tm.rule, v => { K.ctx.translate(120, 0); K.ctx.scale(v, v); pill(K, 0, 0, 'Buz erirse tadı değişir', PAL.coral, PAL.paper, 30); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      const kd = ease.state(seg(t, tm.kStart, Math.max(0.6, tm.kEnd - tm.kStart)));
      const hm = ease.state(seg(t, tm.hMelt, 1.4)), mix = ease.state(seg(t, tm.hMix, 1.6)), hd = 0.25 * ease.state(seg(t, tm.hMelt, 3));
      pop(K, t, tm.bad, v => { ctx.translate(540, 360); ctx.scale(v, v); pill(K, 0, 0, 'Buzun suyu temiz değildi', INK, PAL.paper, 40); });
      // Kerem: bir dikişte (buz erimeden boşalır)
      glass(K, 300, 760, 1.6, 0.85 * (1 - kd), 1, 0, 1);
      pill(K, 300, 1010, 'KEREM: bir dikişte', PAL.teal, PAL.paper, 38);
      if (kd > 0.95) pill(K, 300, 540, 'buz erimedi ✓', PAL.green, PAL.paper, 36);
      // Hikmet: yavaş (buz erir, bozuk su karışır)
      glass(K, 780, 760, 1.6, 0.85 - hd, 1 - 0.85 * hm, mix, 1);
      pill(K, 780, 1010, 'HİKMET: yavaş', PAL.coral, PAL.paper, 38);
      if (mix > 0.6) pill(K, 780, 540, 'buz eridi ✗', PAL.red, PAL.paper, 36);
      stamp(K, t, tm.win, 540, 1150, 'SORUN BUZDAYDI', PAL.green, 60);
    },
  });
}
