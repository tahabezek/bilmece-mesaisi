// Bölüm 19 · SON GELEN KAZANIR (dizinin jokey bilmecesinden). Arabası son gelen kazanır → "Arabaları değiştirin."
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [560, 1100],
    extra: T => ({ rule: T('h2a:3'), stop: T('h2b:0'), go: T('h2c:6'),
      pens: T('n1:4'), swapP: T('n1:9'), breakP: T('n1:12'),
      swap: T('d4:2'), race1: T('d4:12'), race2: T('d5:4'), win: T('d5>') - 0.2 }),
  });
}

// yukarıdan araba: renk = sahibi, harf = sürücü
function car(K, x, y, col, driver, rot = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  K.rect(-46, -80, 92, 160, col, LW, 22); K.rect(-34, -50, 68, 40, '#CFE3EC', LW * 0.6, 8); K.rect(-34, 30, 68, 26, '#CFE3EC', LW * 0.6, 8);
  K.circ(0, -4, 22, PAL.paper, LW * 0.7); K.text(driver, 0, 7, 26, INK, 900);
  ctx.restore();
}
// pist: y0 başlangıç, yF bitiş
function track(K, x, y0, yF) {
  K.rect(x - 260, yF - 40, 520, y0 - yF + 120, '#5D6A61', LW, 20);
  K.line(x, yF, x, y0 + 60, 4, '#E9DCC2');
  for (let i = 0; i < 8; i++) K.rect(x - 260 + i * 65, yF - 34, 32, 20, i % 2 ? PAL.paper : INK, 0, 0);
  K.text('BİTİŞ', x, yF - 52, 34, PAL.paper, 900);
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    screen: (K, t, S, top) => {
      // hikâye paneli (h2a–h3): iki araba yolda durmuş
      if (t < tm.rule - 0.1 || t > tm.think0 + 0.4) return;
      const u = KL.spring(t - (tm.rule - 0.1), 320, 30) * (1 - ease.exit(seg(t, tm.think0, 0.4))), { ctx } = K;
      ctx.save(); ctx.translate(790, top + 260); ctx.scale(u * 0.7, u * 0.7);
      track(K, 0, 240, -160);
      const moving = t >= tm.go, p = moving ? ease.enter(seg(t, tm.go, 0.9)) : 0, idle = moving ? 0 : 6 * Math.sin(t * 3);
      car(K, -120, lerp(180, -120, p) + idle * 0.2, PAL.mustard, 'N'); car(K, 120, lerp(180, -120, p), PAL.teal, 'K');
      if (!moving && t >= tm.stop) { K.text('Zzz', -60, 70, 40, PAL.paper, 900); }
      ctx.restore();
    },
    tries: [{ s: 'Kuralı değiştir?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text('NECMİ\'NİN TORUNLARI', 0, -108, 30, '#6B6355', 900);
      const sw = ease.state(seg(t, tm.swapP, 0.6));
      const pen = (x, col, a) => { K.ctx.save(); K.ctx.translate(x, 0); K.ctx.rotate(a); K.rect(-14, -70, 28, 140, col, LW, 8); K.poly([[-14, 70], [14, 70], [0, 100]], '#E8D2A8', LW * 0.7); K.ctx.restore(); };
      pop(K, t, tm.pens, () => { pen(lerp(-140, 140, sw), PAL.red, -0.3); pen(lerp(140, -140, sw), '#3E86B5', 0.3); });
      pop(K, t, tm.breakP, v => { K.ctx.translate(0, 120); K.ctx.scale(v, v); pill(K, 0, 0, 'DEĞİŞTİRİP KIRIYORLAR', PAL.coral, PAL.paper, 28); });
    },
    proof: (K, t) => {
      const { ctx } = K, X = 540;
      ctx.save(); ctx.translate(0, 120); track(K, X, 760, 220); ctx.restore();
      // sürücüler yer değiştirir: Necmi teal (Kerem'in) arabasına, Kerem hardal (Necmi'nin) arabasına
      const sw = ease.state(seg(t, tm.swap, 0.7)), r1 = ease.enter(seg(t, tm.race1, 1.6)), r2 = ease.enter(seg(t, tm.race2, 1.6));
      const yN = lerp(880, 400, Math.max(r1, r2) * 0.95), yK = lerp(880, 400, r2 * 0.9);
      car(K, X - 130, yK, PAL.mustard, sw > 0.5 ? 'K' : 'N');   // Necmi'nin arabası
      car(K, X + 130, yN, PAL.teal, sw > 0.5 ? 'N' : 'K');      // Kerem'in arabası
      pill(K, X - 130, 1030, 'Necmi\'nin', PAL.mustard, INK, 28); pill(K, X + 130, 1030, 'Kerem\'in', PAL.teal, PAL.paper, 28);
      if (t < tm.race1) pop(K, t, tm.swap, v => { ctx.translate(X, 1120); ctx.scale(v, v); pill(K, 0, 0, '⇄ ARABALARI DEĞİŞTİRİRLER', INK, PAL.paper, 40); });
      if (t >= tm.race1) { ctx.save(); ctx.globalAlpha = clamp01((t - tm.race1) / 0.3); pill(K, X, 1120, 'Rakibin arabası önce gelirse, seninki son gelir', PAL.coral, PAL.paper, 30); ctx.restore(); }
      stamp(K, t, tm.win, X, 1210, 'İKİSİ DE GAZA BASAR', PAL.green, 52);
    },
  });
}
