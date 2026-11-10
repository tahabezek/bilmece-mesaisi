// Bölüm 26 · ŞİŞEDEKİ ARMUT (diziden, 76. bölüm). Ağzı dar şişede koca armut; şişe kesilmemiş, armut bütün →
// armut minicikken dalına şişe geçirildi, armut şişenin içinde büyüdü, sonra dalından kesildi.
import * as KL from './kalip.js';
const { PAL, LW, INK, ease, seg, clamp01, lerp, pop, pill, stamp } = KL;

export function build(ep, tl) {
  return KL.build(ep, tl, {
    focus: [600, 1140],
    extra: T => ({ neck: T('h2a:1'), big: T('h2a:4'),
      box: T('n1:2'), grow0: T('n1:5'), grow1: T('n1:8'), sq: T('n1:9'),
      tiny: T('d4:2'), slip: T('d4:4'), pGrow0: T('d5:1'), pGrow1: T('d5>') - 0.9, cut: T('d5:5'), win: T('d5:6') }),
  });
}

const GLASS = 'rgba(190,225,215,0.38)';
// şişe: ağzı yukarıda; (x, y) gövdenin alt ortası
function bottle(K, x, y, k, back = true) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const body = () => { ctx.beginPath(); ctx.moveTo(-34, -300); ctx.lineTo(-34, -240); ctx.bezierCurveTo(-34, -200, -120, -190, -120, -130); ctx.lineTo(-120, -20); ctx.quadraticCurveTo(-120, 0, -100, 0); ctx.lineTo(100, 0); ctx.quadraticCurveTo(120, 0, 120, -20); ctx.lineTo(120, -130); ctx.bezierCurveTo(120, -190, 34, -200, 34, -240); ctx.lineTo(34, -300); };
  if (back) { body(); ctx.fillStyle = GLASS; ctx.fill(); }
  else { body(); ctx.lineWidth = LW / k; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); K.rect(-40, -312, 80, 18, null, LW * 0.8 / k, 6);
    ctx.globalAlpha = 0.55; K.line(-90, -120, -90, -40, 10 / k, '#FFFFFF'); ctx.globalAlpha = 1; }
  ctx.restore();
}
// armut: (x, y) alt ortası, s ölçek
function pear(K, x, y, s, stem = 40) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -150); ctx.bezierCurveTo(30, -150, 34, -110, 44, -80); ctx.bezierCurveTo(90, -50, 86, 0, 0, 0); ctx.bezierCurveTo(-86, 0, -90, -50, -44, -80); ctx.bezierCurveTo(-34, -110, -30, -150, 0, -150); ctx.closePath();
  K.fs('#C9CF5A', LW / s);
  ctx.globalAlpha = 0.5; K.ell(-28, -50, 12, 22, '#E6E89A', 0); ctx.globalAlpha = 1;
  K.line(0, -150, 4, -150 - stem, LW * 0.9 / s, '#6B4A2B');
  ctx.restore();
}
// kabak: sq 0..1 yuvarlaktan kareye
function pumpkin(K, x, y, s, sq) {
  const r = lerp(60, 12, sq); K.rect(x - 60 * s, y - 110 * s, 120 * s, 110 * s, '#E58A3A', LW, r * s);
  for (const dx of [-25, 0, 25]) K.line(x + dx * s, y - 104 * s, x + dx * s, y - 6 * s, 3, '#B8682A');
  K.line(x, y - 110 * s, x + 6 * s, y - 132 * s, LW, '#6B4A2B');
}

export function draw(K, t, ep, tl, S) {
  const tm = S.tm;
  return KL.draw(K, t, ep, tl, S, {
    proofDrift: 0.008,
    mid: (K, t) => {
      K.rect(330, 1320, 600, 40, PAL.woodTop, LW, 8); K.rect(346, 1360, 568, 200, PAL.wood);
      bottle(K, 600, 1320, 0.82, true); pear(K, 600, 1305, 1.25, 30); bottle(K, 600, 1320, 0.82, false);
    },
    screen: (K, t, S, top) => {
      if (t > tm.think0 + 0.5 || t < tm.neck - 0.1) return;
      const out = 1 - ease.exit(seg(t, tm.think0, 0.4));
      KL.slot(K, t, [[tm.neck, 'Şişenin ağzı: 3 cm'], [tm.big, 'Armut: 9 cm, ağız: 3 cm', PAL.coral]], top + 75, out);
    },
    tries: [{ s: 'Isıtıp yumuşatmak?', t0: tm.d2, strike: tm.hd + 0.1 }],
    clue: (K, t) => {
      K.text("NECMİ'NİN HANIMI", 0, -108, 34, '#6B6355', 900);
      const g = ease.state(seg(t, tm.grow0, Math.max(0.8, tm.grow1 - tm.grow0)));
      pop(K, t, tm.clue, v => {
        K.ctx.translate(-150, 110); K.ctx.scale(v, v);
        pumpkin(K, 0, 0, lerp(0.35, 1, g), g);
        K.rect(-66, -118, 132, 118, null, LW, 4);   // kutu
      });
      pop(K, t, tm.sq, v => { K.ctx.translate(170, 0); K.ctx.scale(v, v); pill(K, 0, 0, 'KARE KABAK!', PAL.coral, PAL.paper, 38); });
    },
    proof: (K, t) => {
      const { ctx } = K;
      const slip = ease.state(seg(t, tm.slip - 0.2, 0.9));
      const g = ease.state(seg(t, tm.pGrow0, Math.max(1, tm.pGrow1 - tm.pGrow0)));
      const cut = ease.state(seg(t, tm.cut, 0.5)), drop = 60 * cut;
      // dal (üstte, soldan)
      ctx.save(); ctx.lineCap = 'round';
      K.line(60, 530, 720, 580, 26, '#6B4A2B'); K.line(380, 555, 450, 470, 12, '#6B4A2B');
      for (const [lx, ly, a] of [[230, 540, -0.6], [430, 490, 0.5], [680, 560, -0.3]]) { ctx.save(); ctx.translate(lx, ly); ctx.rotate(a); K.ell(0, -30, 22, 44, '#7FAE5A', LW * 0.7); ctx.restore(); }
      ctx.restore();
      const px = 540, by = 1000 + drop;   // şişenin altı
      const sy = lerp(1250, by, slip);     // şişe aşağıdan yukarı geçirilir
      ctx.save(); if (cut > 0) { ctx.translate(540, 566); ctx.rotate(0.04 * cut); ctx.translate(-540, -566); }
      const s = lerp(0.22, 1.25, g), py = lerp(720, by - 40, g), top = py - 150 * s, BR = 566;
      const ba = clamp01(slip * 3);
      if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; bottle(K, px, sy, 1.15, true); ctx.restore(); }
      pear(K, px, py, s, cut > 0.5 ? 20 / s : (top - BR + 4) / s);
      if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; bottle(K, px, sy, 1.15, false); const ny = sy - 359; if (slip > 0.95) { K.line(px - 44, ny + 6, px - 70, BR - 6, 4, '#E9DCC2'); K.line(px + 44, ny + 6, px + 64, BR - 2, 4, '#E9DCC2'); } ctx.restore(); }
      ctx.restore();
      if (cut > 0) { K.line(505, 610, 575, 590, 8, PAL.red); }
      pop(K, t, tm.tiny, v => { ctx.translate(770, 640); ctx.scale(v, v); pill(K, 0, 0, 'minicik armut', PAL.cream, INK, 32); });
      pop(K, t, tm.pGrow0, v => { ctx.translate(770, 760); ctx.scale(v, v); pill(K, 0, 0, 'içeride büyüdü', PAL.teal, PAL.paper, 32); });
      stamp(K, t, tm.win, 540, 1180, 'ŞİŞENİN İÇİNDE BÜYÜDÜ', PAL.green, 54);
    },
  });
}
