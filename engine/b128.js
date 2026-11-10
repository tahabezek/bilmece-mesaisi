// Bölüm 28F · ÇITA VE KARGO (Fable 5.2 yönetimi; 028 ile aynı bilmece, ayrı sahneleme, karşılaştırma sürümü).
// Logline: 1,5 metrelik çıta 1 metrelik kutuya dik de sığmaz, kapağa çapraz da; kutunun İÇİNDEN köşeden köşeye sığar.
// Akılda kalacak tek şey: bir kutunun en uzun yeri iç köşegenidir (1 m'lik küpte √3 ≈ 1,73 m).
// Kalıbın (kalip.js) sahne akışı kullanılmaz: kutu ile çıta başroldedir, her deneme gerçek kutuda gerçek çıtayla oynanır.
// Her şey t'nin saf fonksiyonu; zamanlar ses çizelgesinden (kelime başları) gelir.
// Ortak yardımcılar (ters kinematik, tutuş, etiket, işaret, altyazı bölme, "Buldum!", bölüm çerçevesi) engine/hikaye.js'tedir.
// reach çağrılarının son parametresi (dirsek = 1) 028F'in onaylı görüntüsünü sabitler; yeni bölümlerde yazılmaz ('oto').
import { room, plant } from './office.js';
import {
  ease, seg, spring, clamp01, lerp, INK, CARDS, PAL, LW, UI, at, clock, poseAt, charBase, drawChar, talkAt, glance, THINK, IFADE,
  D2R, along, unit, mixStick, mixHex, nearOn, strokeLine, reach, shoulder, grip, dimLine, ring, tag, mark, buldumHop, buldumIsin, cerceve,
} from './hikaye.js';

// ——— kutu: eğik izdüşüm; 1 m = 380 px. P3(x sağa, y yukarı, z derine) metre → dünya pikseli ———
// Derinlik ekseni dik seçildi (76, −184): iç köşegen (A→G) ön yüzün çaprazından (A→C) açıkça ayrılır; 45°'lik
// alışılmış izdüşümde ikisi üst üste biner ve cevap "ön yüzde çapraz" gibi okunur.
const B0 = { x0: 350, y0: 1560, a: 380, dx: 76, dy: -184 };
const P3 = (x, y, z, B = B0) => [B.x0 + B.a * x + B.dx * z, B.y0 - B.a * y + B.dy * z];
const CARD = '#C99A5B', CARD2 = '#B5874A', CARDTOP = '#D9B47A', WOOD = '#F5DC9A', WOOD2 = '#CFAE66', MINT = '#8FD27A';
const IN = { F: ['#8C6A3B', '#4C3D27'], L: ['#A27B45', '#63502F'], B: ['#B08A52', '#725C38'] };   // iç yüzler: [normal, cam kutuda]
const TH1 = 48 * D2R, TH2 = Math.atan(1 / Math.SQRT2);   // çıtanın tabanla açısı: kutuya girerken 48°, karşı üst köşeye bakarken 35,26°
const DEF_X = 975, DEF_X2 = 1005, DEF_XP = 905, DEF_XB = 1010, HIK_X = 300, NEC_X = 1370, CLK = [725, 870];

// ——— çıta konumları (dünya pikseli, [alt uç, üst uç]) ———
const S_U = lift => [P3(0.38, lift, 0.45), P3(0.38, 1.5 + lift, 0.45)];                         // kutunun içinde dik (0,5 m dışarıda)
const S_L = () => [P3(0, 1, 0), P3(1.5 / Math.SQRT2, 1, 1.5 / Math.SQRT2)];                      // kapağın çaprazında (9 cm taşar)
const S_E = () => [P3(1, 1, 0), P3(1, 1, 1.5)];                                                  // sayaçta ikinci deneme: kenar boyunca (0,5 m taşar)
const S_H = dx => [[dx - 136, 1498], [dx - 144, 928]];                                           // Defne'nin elinde, asa gibi
const S_R = (dx, hop = 0) => [[dx - 165, 1235 - hop], [dx - 205, 665 - hop]];                    // havaya kaldırılmış
const S_R2 = (dx, hop = 0) => [[dx - 62, 1262 - hop], [dx - 330, 762 - hop]];                   // "köşeden köşeye": çapraz tutuş
const S_T = (th, B = B0) => { const c = Math.cos(th) / Math.SQRT2 * 1.5; return [P3(0, 0, 0, B), P3(c, Math.sin(th) * 1.5, c, B)]; };   // alt köşeden, taban çaprazı düzleminde th açısıyla

export function build(ep, tl) {
  const T = e => at(tl, e);
  const cd = T(ep.countdown), take = T('d2:1') - 0.05, close = T('d5>') - 0.12, push = T('h4>') + 0.15, umbIn = T('n1:5') - 0.1, tiltEnd = T('d4:7') + 0.1;
  const tm = {
    drop: 0.3, tag15: T('h1:1'), tag1: T('h1:4'), plus50: T('h1:7') - 0.04,
    rule: T('h2a'), dimD: T('h2a:2') - 0.04, dimH: T('h2a:4') - 0.04, dimAll: T('h2a:6'),
    cond: T('h2b'), tok: [T('h2b:1') - 0.04, T('h2b:2') - 0.04, T('h2b:3') - 0.04], tokX: T('h2b:4') - 0.02,
    h3: T('h3'), erken: T('h3:2'),
    d2: T('d2'), take, land: take + 0.75,
    hd: T('hd'), lid: T('hd:1') - 0.1, v141: T('hd:3') - 0.04, lens: T('hd:5') - 0.04, v9: T('hd:8') - 0.04,
    cd, cd0: cd - 5, pick: cd - 4.5, try2: cd - 3.0, try3: cd - 1.55,
    clue: T('n1'), umb1: T('n1:3'), umbIn, umbLand: umbIn + 0.6, aha: T('n1:8'),
    buldum: T('d3'), kose: T('d3:1') - 0.05, proof: T('d3>') + 0.05,
    ins: T('d4'), insLand: T('d4:4'), tilt: T('d4:5') - 0.05, tiltEnd, back: tiltEnd + 0.05, ringG: T('d4:9'),
    meas: T('d5'), dg: T('d5') + 0.22, v173: T('d5:3') - 0.04, eq: T('d5:6') - 0.04, close,   // close: şemadan sahneye dönüş ve kolinin kapanışı
    h4: T('h4'), ama: T('h4:2'), pat: T('h4:3'), push, cta: T('d6') - 0.15, end: T('d6>') + 0.1,
  };
  // Kamera: [t, zoom, cx, cy, 'cut'?]. Kart ekrandayken başlar kartın altında (≥ 505 px) kalır.
  const cam = [
    [0, 0.94, 640, 1222, 'cut'],
    [tm.rule - 0.05, 0.95, 645, 1222],
    [tm.cond - 0.05, 1.3, 425, 1063],          // Hikmet + yasak kartları, sonra "erken çıkarsın" (duvar saati)
    [tm.d2 - 0.1, 0.94, 648, 1222],
    [tm.lid, 0.96, 655, 1222],                 // kapak çaprazı; taşan uç mercekle büyütülür (yüzler kadrajda kalır)
    [tm.cd0 - 0.25, 0.94, 648, 1222],
    [tm.cd0 + 2.4, 0.96, 650, 1222],
    [tm.clue - 0.02, 1.25, 1590, 1250],        // Necmi ve dolabı (sayaç çekildikten sonra)
    [tm.clue + 0.8, 1.26, 1600, 1251],
    [tm.umbLand + 0.2, 1.27, 1612, 1252],
    [tm.buldum - 0.05, 1.35, 845, 1040, 'cut'],
    [tm.proof, 1.22, 600, 1375, 'cut'],        // Defne çıtayı cam kutuya yerleştirir
    [tm.back, 1.1, 655, 1330],                 // Defne bir adım geri çekilirken kamera da açılır
    [tm.meas, 1.25, 582, 1340, 'cut'],          // şema: tel kafes küp; kapağın çaprazı ile iç köşegen aynı resimde
    [tm.close, 1.0, 650, 1235, 'cut'],
    [tm.h4 - 0.1, 1.02, 652, 1232],
    [tm.ama - 0.05, 1.05, 660, 1232],
    [tm.push, 1.0, 730, 1215, 'cut'],
    [tm.cta, 1.4, 852, 1262],
    [tm.cta + 1.4, 1.46, 848, 1250],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: HIK_X, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -3, look: [0.7, 0.25] }, armL: { sh: 14, el: -40 }, armR: { sh: 60, el: 40 } });
  const hik = [
    [T('h1:6'), { head: { tilt: 5, look: [0.9, -0.05] } }, 0.35],
    [tm.rule - 0.1, { expr: 'notr', armL: { sh: 150, el: -25 }, head: { tilt: -2, look: [0.6, 0.5] } }, 0.35, ease.enter],
    [tm.cond - 0.1, { armL: { sh: 118, el: -70 }, head: { tilt: 3, look: [0.6, -0.4] } }, 0.3],
    [tm.tokX, { expr: 'kizgin', armL: { sh: 152, el: -18 } }, 0.2, ease.enter],
    [tm.h3 - 0.1, { expr: 'mutlu', armL: { sh: 14, el: -40 }, head: { tilt: 8, look: [0.9, -0.35] } }, 0.35],   // saate bakar
    [tm.take + 0.1, { armR: { sh: 20, el: -60 }, head: { tilt: 2, look: [0.7, 0.45] }, expr: 'notr' }, 0.3],
    [tm.hd - 0.05, { expr: 'mutlu', armR: { sh: 155, el: -5 }, head: { tilt: 6, look: [0.8, 0] } }, 0.25, ease.enter],
    [tm.lid, { armR: { sh: 64, el: 22 }, head: { tilt: 2, look: [0.7, 0.5] } }, 0.35],
    [tm.cd0 - 0.2, { armR: { sh: 25, el: -160 }, head: { tilt: -4, look: [0.8, 0.1] } }, 0.4],
    [tm.try2 + 0.72, { armR: { sh: 152, el: -8 }, head: { tilt: 7, look: [0.9, 0.1] } }, 0.3, ease.enter],   // "yine olmadı": parmak sallar
    [tm.try3 + 0.1, { armR: { sh: 25, el: -160 }, head: { tilt: -4, look: [0.8, 0.1] } }, 0.35],
    [tm.buldum, { expr: 'saskin', armR: { sh: 20, el: -60 } }, 0.25],
    [tm.proof, { expr: 'notr', head: { tilt: 4, look: [0.7, 0.55] } }, 0.01],
    [tm.v173, { expr: 'saskin', head: { tilt: -4, look: [0.6, 0.45] } }, 0.3],
    [tm.close + 0.2, { armL: { sh: 150, el: 10 }, armR: { sh: 150, el: 10 } }, 0.35, ease.enter],   // eller havada: yenildi
    [tm.h4 - 0.2, { expr: 'yorgun', armL: { sh: 14, el: -40 }, armR: { sh: 20, el: -60 }, head: { tilt: 5, look: [0.9, 0] } }, 0.35],
    [tm.ama - 0.05, { expr: 'mutlu', lean: 9, head: { tilt: -5, look: [0.85, 0.25] } }, 0.3],
  ].sort((a, b) => a[0] - b[0]);
  const defBase = charBase('defne', { x: DEF_X, y: 1500, s: 245, expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.15] }, armR: { sh: 16, el: -30 }, armL: { sh: 12, el: -10 } });
  const def = [
    [0.75, { expr: 'notr', head: { tilt: 5, look: [-0.8, -0.1] } }, 0.4],
    [tm.plus50, { head: { tilt: -6, look: [-0.7, -0.3] }, armR: { sh: 18, el: -168 } }, 0.35],
    [tm.rule, { head: { tilt: 2, look: [-0.7, 0.5] }, armR: { sh: 16, el: -30 } }, 0.35],
    [tm.h3 + 0.2, { head: { tilt: -6, look: [-0.9, -0.2] } }, 0.25],          // saate bakar
    [tm.erken, { expr: 'mutlu', head: { tilt: 6, look: [-0.5, 0.1] } }, 0.3],
    [tm.d2 - 0.1, { lean: -18, x: DEF_X - 10, head: { tilt: -8, look: [-0.8, 0.3] } }, 0.35, ease.enter],
    [tm.land + 0.15, { lean: 0, x: DEF_X, armL: { sh: 95, el: 10 }, head: { tilt: 4, look: [-0.9, 0] } }, 0.35],
    [tm.hd + 0.12, { expr: 'saskin', x: DEF_X2, lean: 5, armL: { sh: 12, el: -10 }, head: { tilt: 4, look: [-0.8, 0.3] } }, 0.25, ease.enter],
    [tm.cd0 - 0.1, { lean: 0, expr: THINK, head: { tilt: -8, look: [-0.6, -0.4] }, armR: { sh: 18, el: -168 } }, 0.4],
    [tm.try2 - 0.05, { lean: -18, armR: { sh: 16, el: -30 } }, 0.4],
    [tm.try3 + 0.1, { lean: 0, armR: { sh: 18, el: -168 } }, 0.45],
    [tm.clue - 0.2, { expr: 'notr', head: { tilt: 4, look: [0.9, 0.1] }, armR: { sh: 16, el: -30 } }, 0.4],
    [tm.aha - 0.3, { expr: 'saskin', head: { tilt: -2, look: [0.9, 0.2] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.proof, { x: DEF_XP, lean: -20, head: { tilt: -6, look: [-0.8, 0.45] }, armR: { sh: 20, el: -50 } }, 0.01],
    [tm.back, { lean: 0, x: DEF_XB, head: { tilt: 4, look: [-0.7, 0.3] } }, 0.45],   // bir adım geri: üst köşe açıkta kalsın
    [tm.ringG - 0.1, { armR: { sh: 150, el: -30 }, head: { tilt: -4, look: [-0.7, 0.1] } }, 0.3, ease.enter],
    [tm.close - 0.05, { armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 }, head: { tilt: 6, look: [0, -0.2] } }, 0.3, ease.enter],
    [tm.h4 - 0.2, { armR: { sh: 16, el: -30 }, armL: { sh: 12, el: -10 }, head: { tilt: 6, look: [-0.8, 0] } }, 0.35],
    [tm.pat, { expr: 'saskin', lean: 4, head: { tilt: -4, look: [-0.8, 0.3] } }, 0.25, ease.enter],
  ].sort((a, b) => a[0] - b[0]);
  const necBase = charBase('necmi', { x: NEC_X, y: 1500, s: 225, expr: 'mutlu', head: { tilt: -4, look: [-0.8, 0] }, armL: { sh: 20, el: -60 }, armR: { sh: 20, el: -60 } });
  const nec = [
    [tm.umbIn - 0.05, { head: { tilt: 6, look: [0.8, 0.3] } }, 0.3],
    [tm.umbLand + 0.1, { armL: { sh: 150, el: -20 }, armR: { sh: 24, el: 16 }, head: { tilt: -5, look: [-0.8, 0] } }, 0.35, ease.enter],
    [tm.aha - 0.05, { armR: { sh: 58, el: 28 }, head: { tilt: 7, look: [0.7, 0.25] } }, 0.3, ease.enter],   // "sığdı!": dolabın içini gösterir
    [tm.aha + 0.4, { armR: { sh: 24, el: 16 }, armL: { sh: 20, el: -60 }, head: { tilt: -6, look: [-0.8, 0] } }, 0.3],
    [tm.buldum, { expr: 'saskin', armL: { sh: 20, el: -60 } }, 0.25],
  ];
  return { tm, cam, hik, hikBase, def, defBase, nec, necBase };
}

// ——— çizim parçaları ———
function stickDraw(K, s, red = null) {
  const { ctx } = K; ctx.save(); ctx.lineCap = 'round';
  strokeLine(ctx, s[0], s[1], 31, INK); strokeLine(ctx, s[0], s[1], 19, WOOD);
  const n = unit(s[0], s[1]), o = [-n[1] * 3.5, n[0] * 3.5], a = along(s, 0.02), b = along(s, 0.98);
  ctx.lineCap = 'butt'; strokeLine(ctx, [a[0] + o[0], a[1] + o[1]], [b[0] + o[0], b[1] + o[1]], 4, WOOD2);
  if (red && red[1] > red[0]) { ctx.lineCap = 'round'; strokeLine(ctx, along(s, red[0]), along(s, red[1]), 19, PAL.coral); }
  ctx.restore();
}

// kutu: o = { g: cam kutu (0..1), side / fb: yan ve ön-arka kapak açısı (derece; 12 açık, 270 kapalı), tape: 0..1, stk: etiket (0..1), mid(): iç katman }
function box(K, B, o = {}) {
  const { ctx } = K, g = o.g || 0, P = (x, y, z) => P3(x, y, z, B);
  const A = P(0, 0, 0), Bp = P(1, 0, 0), C = P(1, 1, 0), Dp = P(0, 1, 0), E = P(0, 0, 1), F = P(1, 0, 1), G = P(1, 1, 1), H = P(0, 1, 1);
  const ps = (o.side ?? 12) * D2R, pf = (o.fb ?? 12) * D2R, Lf = 0.5, fa = 1 - g;
  const flap = (h0, h1, off) => [P(...h0), P(...h1), P(h1[0] + off[0], h1[1] + off[1], h1[2] + off[2]), P(h0[0] + off[0], h0[1] + off[1], h0[2] + off[2])];
  const fl = {
    left: flap([0, 1, 0], [0, 1, 1], [-Lf * Math.sin(ps), -Lf * Math.cos(ps), 0]),
    right: flap([1, 1, 0], [1, 1, 1], [Lf * Math.sin(ps), -Lf * Math.cos(ps), 0]),
    back: flap([0, 1, 1], [1, 1, 1], [0, -Lf * Math.cos(pf), Lf * Math.sin(pf)]),
    front: flap([0, 1, 0], [1, 1, 0], [0, -Lf * Math.cos(pf), -Lf * Math.sin(pf)]),
  };
  const dflap = (k, col) => { if (fa < 0.02) return; ctx.save(); ctx.globalAlpha = fa; K.poly(fl[k], col, LW); ctx.restore(); };
  const sideOver = ps > Math.PI, fbOver = pf > Math.PI;
  if (!sideOver) dflap('left', CARDTOP);
  if (!fbOver) dflap('back', CARDTOP);
  K.poly([A, Bp, F, E], mixHex(IN.F[0], IN.F[1], g), LW * 0.8); K.poly([A, Dp, H, E], mixHex(IN.L[0], IN.L[1], g), LW * 0.8); K.poly([E, F, G, H], mixHex(IN.B[0], IN.B[1], g), LW * 0.8);
  if (g > 0.02) {   // cam kutuda arkada kalan üç kenar: krem kesik çizgi
    ctx.save(); ctx.globalAlpha = g; ctx.setLineDash([16, 13]); ctx.lineCap = 'butt';
    for (const q of [A, F, H]) strokeLine(ctx, E, q, 5, PAL.trim);
    ctx.restore();
  }
  o.mid?.();
  ctx.save(); ctx.globalAlpha = 1 - 0.62 * g; K.poly([Bp, F, G, C], CARD2, 0); K.poly([A, Bp, C, Dp], CARD, 0); ctx.restore();
  K.poly([Bp, F, G, C], null, LW); K.poly([A, Bp, C, Dp], null, LW);
  if (fa > 0.02) {   // koli baskıları: "bu yüzü yukarı" okları + adres etiketi
    ctx.save(); ctx.globalAlpha = fa;
    const f = (u, v) => [B.x0 + B.a * u, B.y0 - B.a * v];
    for (const u of [0.13, 0.25]) { const [x, y] = f(u, 0.09); K.line(x, y, x, y - 62, 9, '#8C6A3A'); K.poly([[x - 17, y - 56], [x, y - 84], [x + 17, y - 56]], '#8C6A3A', 0); }
    K.line(f(0.07, 0.06)[0], f(0, 0.06)[1], f(0.31, 0.06)[0], f(0, 0.06)[1], 7, '#8C6A3A');
    const [lx, ly] = f(0.58, 0.3); K.rect(lx, ly, B.a * 0.34, B.a * 0.2, PAL.cream, LW * 0.6, 5);
    for (let i = 0; i < 3; i++) K.line(lx + 14, ly + 20 + i * 19, lx + B.a * 0.34 - 14 - (i === 2 ? 40 : 0), ly + 20 + i * 19, 5, '#B9AE98');
    ctx.restore();
  }
  if (!sideOver) dflap('right', '#C4975A');
  if (!fbOver) dflap('front', CARDTOP);
  if (sideOver) { dflap('left', '#CFA869'); dflap('right', '#CFA869'); }
  if (fbOver) { dflap('back', CARDTOP); dflap('front', CARDTOP); }
  const tp = o.tape || 0;
  if (tp > 0) {   // koli bandı: üst dikiş boyunca, yan yüzden aşağı
    const u = Math.min(1, tp / 0.75), v = clamp01((tp - 0.75) / 0.25) * 0.26;
    K.poly([P(0, 1, 0.43), P(u, 1, 0.43), P(u, 1, 0.57), P(0, 1, 0.57)], '#EFE3C8', LW * 0.6);
    if (v > 0) K.poly([P(1, 1, 0.43), P(1, 1, 0.57), P(1, 1 - v, 0.57), P(1, 1 - v, 0.43)], '#E3D5B6', LW * 0.6);
  }
  if (o.stk > 0) {   // yeşil "SIĞDI!" etiketi ön yüze yapışır
    const v = o.stk; ctx.save(); ctx.translate(B.x0 + B.a * 0.47, B.y0 - B.a * 0.66); ctx.rotate(-0.07); ctx.scale(1.5 - 0.5 * v, 1.5 - 0.5 * v); ctx.globalAlpha = clamp01(v * 2);
    K.rect(-142 + 6, -52 + 8, 284, 104, INK, 0, 16); K.rect(-142, -52, 284, 104, PAL.green, LW, 16);
    K.text(K.up('sığdı!'), 0, 24, 68, PAL.paper, 900); ctx.restore();
  }
  return { A, B: Bp, C, D: Dp, E, F, G, H };
}

// kapalı şemsiye: p uç (demir), q sap; k0/k1 uçlardaki ölçek (derinlik)
function umbrella(K, p, q, k0 = 1, k1 = 1) {
  const { ctx } = K, len = Math.hypot(q[0] - p[0], q[1] - p[1]), w = u => lerp(k0, k1, u);
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(Math.atan2(q[1] - p[1], q[0] - p[0])); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const st = (pts, lw, col) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.stroke(); };
  st([[0, 0], [len * 0.1, 0]], 13 * w(0), INK); st([[0, 0], [len * 0.1, 0]], 5 * w(0), '#C9C3B6');
  const hk = 24 * w(1);   // kıvrık sap
  ctx.beginPath(); ctx.moveTo(len * 0.7, 0); ctx.lineTo(len - hk, 0); ctx.arc(len - hk, hk, hk, -Math.PI / 2, Math.PI * 0.45);
  ctx.lineWidth = 19 * w(0.9); ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9 * w(0.9); ctx.strokeStyle = '#8A5A2E'; ctx.stroke();
  K.poly([[len * 0.08, -6 * w(0.08)], [len * 0.6, -22 * w(0.6)], [len * 0.74, -15 * w(0.74)], [len * 0.74, 15 * w(0.74)], [len * 0.6, 22 * w(0.6)], [len * 0.08, 6 * w(0.08)]], PAL.teal, LW * w(0.5));
  st([[len * 0.12, 0], [len * 0.72, 0]], 3.5, '#1F5E5A');
  K.rect(len * 0.44, -21 * w(0.44), 15 * w(0.44), 42 * w(0.44), '#E9D9B8', LW * 0.6 * w(0.44), 3);
  ctx.restore();
}
// Necmi'nin elbise dolabı (önden, kapağı açık): içi tek kaçışlı derinlikle çizilir, sekiz köşenin hepsi görünür
const CAB = { x: 1508, y: 1134, w: 300, h: 366 }, CO = { x: 1524, y: 1150, w: 268, h: 334 }, CK = 0.4;
const cabBack = () => { const cx = CO.x + CO.w / 2, cy = CO.y + CO.h / 2, bw = CO.w * CK, bh = CO.h * CK; return [[cx - bw / 2, cy - bh / 2], [cx + bw / 2, cy - bh / 2], [cx + bw / 2, cy + bh / 2], [cx - bw / 2, cy + bh / 2]]; };
const U_UP = [[1486, 1496], [1486, 1040]], U_IN = [[CO.x + 16, CO.y + CO.h - 12], [cabBack()[1][0] - 9, cabBack()[1][1] + 12]];
function cabinetNecmi(K, shade) {
  const { ctx } = K, [b0, b1, b2, b3] = cabBack();
  K.rect(CAB.x + 18, CAB.y + CAB.h - 4, 22, 16, '#5D6A61', LW * 0.7); K.rect(CAB.x + CAB.w - 40, CAB.y + CAB.h - 4, 22, 16, '#5D6A61', LW * 0.7);
  K.rect(CAB.x, CAB.y, CAB.w, CAB.h, PAL.metal, LW, 8);
  const o0 = [CO.x, CO.y], o1 = [CO.x + CO.w, CO.y], o2 = [CO.x + CO.w, CO.y + CO.h], o3 = [CO.x, CO.y + CO.h];
  K.poly([o0, o1, b1, b0], '#48534C', LW * 0.7); K.poly([o3, o2, b2, b3], '#7E8C81', LW * 0.7);
  K.poly([o0, b0, b3, o3], '#6B786E', LW * 0.7); K.poly([o1, b1, b2, o2], '#55615A', LW * 0.7);
  K.poly([b0, b1, b2, b3], '#5F6C63', LW * 0.7);
  for (const u of [0.36, 0.7]) { const q = (m, n) => [lerp(m[0], n[0], u), lerp(m[1], n[1], u)]; ctx.save(); ctx.beginPath(); [q(o0, b0), q(o1, b1), q(o2, b2), q(o3, b3)].forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.lineWidth = 3.5; ctx.strokeStyle = '#3F4A43'; ctx.stroke(); ctx.restore(); }   // derinlik halkaları
  // askı çubuğu ve boş askı: burası bir elbise dolabı
  K.line(lerp(o0[0], b0[0], 0.5), lerp(o0[1], b0[1], 0.5) + 26, lerp(o1[0], b1[0], 0.5), lerp(o1[1], b1[1], 0.5) + 26, 6, '#C9C3B6');
  const hx = CO.x + CO.w * 0.36, hy = CO.y + 52;
  ctx.save(); ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy + 12); ctx.lineTo(hx - 34, hy + 34); ctx.lineTo(hx + 34, hy + 34); ctx.lineTo(hx, hy + 12); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  if (shade > 0) {   // derinlik ipucu: şemsiyenin tabandaki izi (ön sol alt → arka sağ alt)
    ctx.save(); ctx.globalAlpha = 0.32 * shade; ctx.lineCap = 'round'; K.line(o3[0] + 14, o3[1] - 8, b2[0] - 6, b2[1] + 4, 13, INK); ctx.restore();
  }
  K.rect(CO.x, CO.y, CO.w, CO.h, null, LW);
  // açık kapak (sağa yaslanmış), havalandırma yarıkları ve kolu
  const dx = CAB.x + CAB.w;
  K.poly([[dx, CAB.y], [dx + 58, CAB.y - 26], [dx + 58, CAB.y + CAB.h + 22], [dx, CAB.y + CAB.h]], PAL.metalDark, LW);
  for (let i = 0; i < 3; i++) K.line(dx + 14, CAB.y + 30 + i * 16 - 6, dx + 44, CAB.y + 30 + i * 16 - 19, 5, '#4C5850');
  K.rect(dx + 34, CAB.y + CAB.h * 0.5, 12, 44, '#5D6A61', LW * 0.6, 6);
}

function token(K, x, y, r, kind, v, xu) {   // yasak kartları: 0 kırmak · 1 kesmek · 2 bükmek (r = yarı kenar; ikonlar 58'lik karta göre çizilir)
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(v * r / 58, v * r / 58); ctx.globalAlpha = clamp01(v * 1.6);
  K.rect(-58 + 6, -58 + 8, 116, 116, INK, 0, 22); K.rect(-58, -58, 116, 116, PAL.paper, LW, 22);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const W = draw => { ctx.beginPath(); draw(); ctx.strokeStyle = INK; ctx.lineWidth = 24; ctx.stroke(); ctx.strokeStyle = WOOD; ctx.lineWidth = 13; ctx.stroke(); };
  if (kind === 0) { W(() => { ctx.moveTo(-40, 20); ctx.lineTo(-7, -2); }); W(() => { ctx.moveTo(8, -4); ctx.lineTo(40, 20); }); K.line(-10, -34, -4, -21, 7); K.line(11, -34, 5, -21, 7); K.line(0, -40, 0, -26, 7); }
  if (kind === 1) { W(() => { ctx.moveTo(-42, 24); ctx.lineTo(-9, 24); }); W(() => { ctx.moveTo(9, 24); ctx.lineTo(42, 24); }); K.line(-16, -22, 10, 14, 9); K.line(16, -22, -10, 14, 9); K.circ(-20, -31, 11, PAL.paper, 8); K.circ(20, -31, 11, PAL.paper, 8); }
  if (kind === 2) W(() => { ctx.moveTo(-40, 26); ctx.quadraticCurveTo(0, -56, 40, 26); });
  if (xu > 0) {   // yasak: kırmızı çerçeve + çapraz çizgi
    ctx.globalAlpha *= clamp01(xu * 2); ctx.beginPath(); ctx.roundRect(-52, -52, 104, 104, 17); ctx.lineWidth = 11; ctx.strokeStyle = PAL.red; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-44, -44); ctx.lineTo(lerp(-44, 44, xu), lerp(-44, 44, xu)); ctx.lineWidth = 13; ctx.stroke();
  }
  ctx.restore();
}
// Mercek: kapağın G köşesi büyütülmüş hâlde (sade çizim, 3,2 kat): çıtanın köşeden taşan 9 santimi. Asıl köşeye ince çizgiyle bağlanır.
function lens(K, t, a, b, [x, y], r, p, flash) {
  const { ctx } = K, v = spring(t - a, UI[0], UI[1]), out = 1 - ease.exit(seg(t, b, 0.2)), k = (0.5 + 0.5 * v) * out;
  if (k <= 0.01) return;
  ctx.save(); ctx.globalAlpha = clamp01(v * 1.6) * out; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const d = Math.hypot(p[0] - x, p[1] - y), ux = (p[0] - x) / d, uy = (p[1] - y) / d;
  K.line(x + ux * r * k, y + uy * r * k, p[0] - ux * 36, p[1] - uy * 36, 7, INK);
  ctx.beginPath(); ctx.arc(p[0], p[1], 36, 0, Math.PI * 2); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  ctx.translate(x, y); ctx.scale(k, k);
  K.circ(7, 9, r, INK, 0);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = PAL.wall; ctx.fillRect(-r, -r, 2 * r, 2 * r);
  const G = [-30, 30], vC = unit(P3(1, 1, 1), P3(1, 1, 0)), vS = unit(P3(0, 1, 0), P3(1, 1, 1)), R = 420;
  const o = 0.0607 * Math.hypot(B0.a + B0.dx, B0.dy) * 3.2 * (1 + 0.1 * Math.sin(Math.PI * seg(t, flash - 0.04, 0.4)));
  K.poly([G, [G[0] - R, G[1]], [G[0] - R + vC[0] * R, G[1] + vC[1] * R], [G[0] + vC[0] * R, G[1] + vC[1] * R]], IN.B[0], 0);          // kutunun ağzı (içi)
  K.poly([G, [G[0] + vC[0] * R, G[1] + vC[1] * R], [G[0] + vC[0] * R, G[1] + vC[1] * R + R], [G[0], G[1] + R]], CARD2, 0);          // yan yüz
  for (const [ex, ey] of [[-1, 0], vC, [0, 1]]) K.line(G[0], G[1], G[0] + ex * R, G[1] + ey * R, 9);
  const s0 = [G[0] - vS[0] * 320, G[1] - vS[1] * 320], s1 = [G[0] + vS[0] * o, G[1] + vS[1] * o];
  for (const [w, col, q0, q1] of [[46, INK, s0, s1], [30, WOOD, s0, s1], [30, PAL.coral, [G[0] + vS[0] * 6, G[1] + vS[1] * 6], s1]]) strokeLine(ctx, q0, q1, w, col);
  // ölçü kıskacı ve "9 cm"
  const n = [vS[1] * 48, -vS[0] * 48], a0 = [G[0] + n[0], G[1] + n[1]], a1 = [s1[0] + n[0], s1[1] + n[1]];
  K.line(a0[0], a0[1], a1[0], a1[1], 7, PAL.paper); for (const q of [a0, a1]) K.line(q[0] - n[0] * 0.3, q[1] - n[1] * 0.3, q[0] + n[0] * 0.3, q[1] + n[1] * 0.3, 7, PAL.paper);
  K.text('9 cm', (a0[0] + a1[0]) / 2 - 18, Math.min(a0[1], a1[1]) - 22, 56, PAL.paper, 900);
  ctx.restore();
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = PAL.paper; ctx.stroke();
  ctx.restore();
}

const SPLIT = { d4: 5 };   // replik kimliği → ikinci parçanın ilk kelimesi (uzun tek cümle balonda iki parça)

// ——— çıtanın t anındaki durumu ———
function stickAt(t, tm, hop) {
  if (t < tm.take) {   // kare 0: Hikmet çıtayı kutuya bırakır; "bir metrelik kutuya" derken bir kez daha bastırır, girmez
    const u = seg(t, 0, tm.drop), b = seg(t, tm.tag1 - 0.05, 0.36);
    return { s: S_U(0.35 * (1 - u * u) + 0.13 * Math.sin(Math.PI * b) ** 2), layer: 'in' };
  }
  if (t < tm.pick) { const u = ease.state(seg(t, tm.take, tm.land - tm.take)); return { s: mixStick(S_U(0), S_L(), u, 150), layer: u < 0.42 ? 'in' : 'out' }; }
  if (t < tm.try2) return { s: mixStick(S_L(), S_H(DEF_X2), ease.state(seg(t, tm.pick, 0.8)), 70), layer: 'out' };
  if (t < tm.buldum - 0.02) {   // sayaç sürerken Defne bir kez daha dener: kenar boyunca yatırır (yine yarım metre taşar), geri alır
    const u = ease.state(seg(t, tm.try2, 0.7)) - ease.state(seg(t, tm.try3, 0.7));
    return { s: mixStick(S_H(DEF_X2), S_E(), u, 90), layer: 'out', v: u };
  }
  if (t < tm.kose) return { s: mixStick(S_H(DEF_X2), S_R(DEF_X2, hop), ease.enter(seg(t, tm.buldum - 0.02, 0.3))), layer: 'out' };
  if (t < tm.proof) return { s: mixStick(S_R(DEF_X2, hop), S_R2(DEF_X2, hop), ease.state(seg(t, tm.kose, 0.35))), layer: 'out' };
  if (t < tm.insLand) return { s: mixStick(S_R(DEF_XP), S_T(TH1), ease.state(seg(t, tm.ins, tm.insLand - tm.ins)), 40), layer: 'in', th: TH1 };
  const th = lerp(TH1, TH2, ease.state(seg(t, tm.tilt, tm.tiltEnd - tm.tilt)));
  return { s: S_T(th), layer: 'in', th };
}

export function draw(K, t, ep, tl, S) {
  const { tm } = S; let st = null, dia = false;
  cerceve(K, t, ep, tl, S, {
    split: SPLIT,
    dunya(K, t, { heads }) {
      room(K, { x0: -600, x1: 2600, floorY: 1500, t });
      for (let x = 1360; x < 2900; x += 140) K.line(x, 1500, x - 260, 2400, 3, PAL.floorDark);
      dia = t >= tm.meas && t < tm.close;
      if (!dia) clock(K, CLK[0], CLK[1], 52 * (1 + 0.24 * Math.sin(Math.PI * seg(t, tm.erken - 0.06, 0.45))), 4, 40 + t * 0.2, t);   // "erken çıkarsın": saat bir kez kabarır
      st = dia ? (diagram(K, t, tm), null) : t >= tm.push ? (pushScene(K, t, tl, S, heads), null) : mainScene(K, t, tl, S, heads);
    },
    ekran(K, t, { kart, ekr }) {   // kart ekrandayken A etiketleri (kart ile sayaç arasında), şemada D etiketleri
      if (kart) { if (st) labelsA(K, t, tm, ekr, st); }
      else if (t >= tm.meas && t < tm.push) labelsD(K, t, tm, dia, ekr);
    },
  });
}

function mainScene(K, t, tl, S, heads) {
  const { ctx } = K, { tm } = S;
  // ——— Necmi'nin köşesi (sağda): dolap, şemsiye, saksı ———
  plant(K, 1960, 1500, 0.9, t);
  const uu = ease.state(seg(t, tm.umbIn, tm.umbLand - tm.umbIn)), um = mixStick(U_UP, U_IN, uu, 60);
  cabinetNecmi(K, seg(t, tm.umbLand - 0.1, 0.3));
  if (uu >= 0.5) umbrella(K, um[0], um[1], 1.4, lerp(1.4, 0.5, uu));
  const np = poseAt(CARDS.necmi, S.necBase, S.nec, t), wN = 1 - ease.state(seg(t, tm.umbIn + 0.3, 0.25));
  reach('necmi', np, 'R', along(um, 0.7), wN, 1);
  np.talk = talkAt(tl, 'necmi', t);
  const nk = drawChar(ctx, 'necmi', np, t); heads.necmi = nk.head;
  if (uu < 0.5) {   // şemsiye Necmi'nin elinde, dolabın yanında dik: sapı dolabın üstünden taşar
    umbrella(K, um[0], um[1], 1.4, lerp(1.4, 0.5, uu));
    if (wN > 0.5) grip(K, 'necmi', nk.handR, 225);
    if (t >= tm.umb1 - 0.04 && uu < 0.02) {   // "dolaptan uzun": taşan kısım mercan kıskaçla işaretlenir
      const v = ease.enter(seg(t, tm.umb1 - 0.04, 0.3)), x = U_UP[1][0] + 62, y1 = lerp(CAB.y, U_UP[1][1], v);
      K.line(x, CAB.y, x, y1, 9, PAL.coral); K.line(x - 14, CAB.y, x + 14, CAB.y, 8, PAL.coral); K.line(x - 14, y1, x + 14, y1, 8, PAL.coral);
    }
  }

  // ——— Hikmet (kutunun sol arkasında) ———
  const hop = buldumHop(t, tm.buldum);
  const stk = stickAt(t, tm, hop);
  const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t);
  const wHold = 1 - ease.state(seg(t, tm.take + 0.12, 0.25));
  reach('hikmet', hp, 'R', along(stk.s, 0.84), wHold, 1);
  const tap = 26 * Math.abs(Math.sin(Math.PI * 2.2 * Math.max(0, t - tm.pat - 0.25)));
  reach('hikmet', hp, 'R', [P3(0.16, 1, 0.3)[0], P3(0.16, 1, 0.3)[1] - tap], ease.state(seg(t, tm.pat, 0.3)), 1);
  hp.talk = talkAt(tl, 'hikmet', t);
  const hk = drawChar(ctx, 'hikmet', hp, t); heads.hikmet = hk.head;

  // ——— kutu ve çıta ———
  const c = tm.close, inProof = t >= tm.proof;
  const g = inProof && t < c ? ease.state(seg(t, tm.proof + 0.05, 0.6)) : 0;
  const red = inProof
    ? (stk.th && 1.5 * Math.sin(stk.th) > 1.005 && t >= tm.insLand - 0.2 ? [1 / (1.5 * Math.sin(stk.th)), 1] : null)
    : t < tm.take ? (t >= tm.plus50 && t < tm.rule ? [1 / 1.5, 1] : null)
      : t >= tm.lens && t < tm.pick + 0.1 ? [Math.SQRT2 / 1.5, 1] : stk.v > 0.9 ? [1 / 1.5, 1] : null;
  const A = P3(0, 0, 0), G = P3(1, 1, 1);
  const bx = box(K, B0, {
    g, side: t < c ? 12 : lerp(170, 270, ease.state(seg(t, c + 0.02, 0.28))), fb: t < c ? 12 : lerp(170, 270, ease.state(seg(t, c + 0.2, 0.28))),   // şemadan dönüşte kapaklar dikilmiş bekler, içe kapanır
    tape: ease.state(seg(t, c + 0.48, 0.22)), stk: t >= c + 0.75 ? spring(t - (c + 0.75), UI[0], UI[1]) : 0,
    mid: () => {
      if (g > 0.02 && stk.th && t >= tm.insLand - 0.05) {   // derinlik ipucu: çıtanın tabandaki izi ve ucundan inen dikme
        const cc = Math.cos(stk.th) / Math.SQRT2 * 1.5, f = P3(cc, 0, cc);
        ctx.save(); ctx.globalAlpha = 0.45 * g; ctx.lineCap = 'round'; K.line(A[0], A[1], f[0], f[1], 18, INK); ctx.restore();
        ctx.save(); ctx.globalAlpha = 0.8 * g; ctx.setLineDash([10, 12]); K.line(stk.s[1][0], stk.s[1][1], f[0], f[1], 5, PAL.trim); ctx.restore();
      }
      if (stk.layer === 'in') stickDraw(K, inProof && g < 0.5 ? [along(stk.s, 0.05), stk.s[1]] : stk.s, red);   // kutu matken alt ucun yuvarlağı köşeden taşmasın
      if (g > 0.02) { ring(K, A, t, tm.insLand); ring(K, G, t, tm.ringG); }
    },
  });
  // kenar ölçüleri: kare 0'da genişlik, kuralda derinlik ve yükseklik (üçü de C köşesinde buluşur)
  if (t < tm.cond) {
    const out = 1 - ease.exit(seg(t, tm.cond - 0.2, 0.2)), edge = (p, q, v) => { if (v > 0) { ctx.lineCap = 'round'; strokeLine(ctx, p, along([p, q], v), 18, INK); strokeLine(ctx, p, along([p, q], v), 10, PAL.mustard); } };
    ctx.save(); ctx.globalAlpha = out;
    edge(bx.D, bx.C, 1); edge(bx.C, bx.G, ease.enter(seg(t, tm.dimD, 0.3))); edge(bx.C, bx.B, ease.enter(seg(t, tm.dimH, 0.3)));
    ctx.restore();
  }
  if (wHold > 0.5) grip(K, 'hikmet', hk.handR, 250);
  if (!inProof && t >= tm.plus50 && t < tm.rule + 0.05) {   // dışarıda kalan yarım metre: kıskaç
    const v = ease.enter(seg(t, tm.plus50, 0.3)) * (1 - ease.exit(seg(t, tm.rule - 0.15, 0.2))), a = along(stk.s, 1 / 1.5), b = stk.s[1], x = a[0] + 34;
    ctx.save(); ctx.globalAlpha = v; K.line(x, a[1], x, lerp(a[1], b[1], v), 8, PAL.coral); K.line(x - 13, a[1], x + 13, a[1], 8, PAL.coral); K.line(x - 13, b[1], x + 13, b[1], 8, PAL.coral); ctx.restore();
  }
  if (!inProof && t >= tm.land - 0.05 && t < tm.pick + 0.3) {   // "kapak": kutunun ağzı krem kesik çizgiyle belirir; çıta onun çaprazında yatar
    const v = ease.enter(seg(t, tm.land - 0.05, 0.35)) * (1 - ease.exit(seg(t, tm.pick, 0.25)));
    ctx.save(); ctx.globalAlpha = 0.22 * v; K.poly([bx.D, bx.C, bx.G, bx.H], PAL.paper, 0); ctx.restore();
    ctx.save(); ctx.globalAlpha = v; ctx.setLineDash([16, 12]); ctx.lineJoin = 'round'; ctx.beginPath(); [bx.D, bx.C, bx.G, bx.H].forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.lineWidth = 6; ctx.strokeStyle = PAL.cream; ctx.stroke(); ctx.restore();
  }
  if (stk.layer === 'out') stickDraw(K, stk.s, red);
  if (!inProof && t >= tm.v141 && t < tm.pick + 0.2) {   // kapağın çaprazı: D'den G'ye mercan ölçü çizgisi; çıta G'den öteye taşar
    const n = unit(bx.D, bx.G), o = [n[1] * 34, -n[0] * 34];
    ctx.save(); ctx.globalAlpha = 1 - ease.exit(seg(t, tm.pick, 0.2));
    dimLine(K, [bx.D[0] + o[0], bx.D[1] + o[1]], [bx.G[0] + o[0], bx.G[1] + o[1]], ease.state(seg(t, tm.v141, 0.4)), PAL.coral, 8); ctx.restore();
  }

  // ——— Defne ———
  const dp = glance(poseAt(CARDS.defne, S.defBase, S.def, t), t, tm.cd);
  dp.y -= hop;
  const sh = shoulder('defne', dp, 'L'), hv = stk.v || 0;
  const wA = ease.state(seg(t, tm.take - 0.1, 0.3)) * (1 - ease.state(seg(t, tm.land + 0.15, 0.25)));
  const wB = ease.state(seg(t, tm.pick + 0.05, 0.3)) * (1 - ease.state(seg(t, tm.tiltEnd, 0.3)));
  const rng = t < tm.pick ? [0.72, 0.93]
    : t < tm.buldum ? [lerp(0.86, 0.5 + 0.06 * hv, seg(t, tm.pick + 0.3, 0.5)), lerp(0.93, 0.58 + 0.1 * hv, seg(t, tm.pick + 0.3, 0.5))]
      : t < tm.proof ? [0.4, 0.5] : [lerp(0.42, 0.88, seg(t, tm.ins, 0.5)), lerp(0.5, 0.95, seg(t, tm.ins, 0.5))];
  reach('defne', dp, 'L', nearOn(stk.s, sh, rng[0], rng[1]), Math.max(wA, wB), 1);
  dp.talk = talkAt(tl, 'defne', t);
  buldumIsin(K, t, tm.buldum, [dp.x, dp.y - 545], { son: tm.proof });   // "Buldum!": başının çevresinde kısa ışın çizgileri
  heads.defne = drawChar(ctx, 'defne', dp, t).head;
  return { stk, bx };
}

// Kapanış: Defne koca koliyi iterek götürür (Hikmet arkadan el sallar), sonra koliye yaslanıp paylaşım çağrısını söyler.
function pushScene(K, t, tl, S, heads) {
  const { ctx } = K, { tm } = S, r = t - tm.push;
  const u1 = ease.state(seg(r, 0.05, 0.4)), u2 = ease.state(seg(r, 0.48, 0.38)), X = 693 + 66 * u1 + 66 * u2;
  const up = ease.state(seg(t, tm.cta - 0.05, 0.35));   // doğrulma
  const hp = charBase('hikmet', { x: HIK_X, y: 1500, s: 250, expr: 'mutlu', head: { tilt: -6, look: [0.8, 0.15] }, armL: { sh: 14, el: -40 }, armR: { sh: lerp(152 + 13 * Math.sin(r * 10), 20, up), el: lerp(-16, -60, up) } });
  hp.talk = talkAt(tl, 'hikmet', t); heads.hikmet = drawChar(ctx, 'hikmet', hp, t).head;
  box(K, { ...B0, x0: X }, { side: 270, fb: 270, tape: 1, stk: 1 });
  const shove = Math.sin(Math.PI * seg(r, 0.05, 0.4)) + Math.sin(Math.PI * seg(r, 0.48, 0.38));   // her itişte gövde öne yüklenir
  const dp = charBase('defne', {
    x: X - lerp(118, 100, up), y: 1500, s: 245, lean: lerp(13 + 6 * shove, 5, up), expr: 'notr',
    head: { tilt: lerp(10, 5, up), look: [lerp(0.8, 0, up), lerp(0.3, 0, up)] },
    legL: { hip: lerp(24, 3, up), knee: 0 }, legR: { hip: lerp(-4, 3, up), knee: lerp(16, 0, up) },
    armL: { sh: 12, el: -10 }, armR: { sh: 16, el: -30 },
  });
  dp.expr = up < 0.5 ? IFADE.zorlanma : 'mutlu';
  reach('defne', dp, 'L', [X + 6, 1420], 1 - up, 1);
  reach('defne', dp, 'R', [lerp(X + 6, X + 52, up), lerp(1318, 1156, up)], 1, 1);
  const gu = ease.state(seg(t, tm.cta + 0.1, 0.4));   // sol el belde
  dp.armL = { sh: lerp(dp.armL.sh, 38, gu * up), el: lerp(dp.armL.el, -118, gu * up) };
  dp.talk = talkAt(tl, 'defne', t); heads.defne = drawChar(ctx, 'defne', dp, t).head;
}

// ——— ekran etiketleri: kart ekrandayken (A) ve kanıtta (B) ———
function labelsA(K, t, tm, sc, { stk, bx }) {
  if (t < tm.h3) {
    const e = tm.cond - 0.2, top = sc(S_U(0)[1]);   // etiket çıtanın oturduğu yere göre durur (okunurken oynamaz)
    tag(K, t, 0, e, [top[0] + 96, top[1] + 72], '1,5 m', PAL.mustard, INK, 46, [tm.tag15]);
    tag(K, t, 0, e, sc(along([bx.D, bx.C], 0.26)), '1 m', INK, PAL.paper, 44, [tm.tag1, tm.dimAll]);
    tag(K, t, tm.dimD, e, sc(along([bx.C, bx.G], 0.55)), '1 m', INK, PAL.paper, 44, [tm.dimAll]);
    tag(K, t, tm.dimH, e, sc(along([bx.C, bx.B], 0.5)), '1 m', INK, PAL.paper, 44, [tm.dimAll]);
    const p = sc(along(stk.s, 0.8)); tag(K, t, tm.plus50, tm.rule - 0.15, [p[0] + 150, p[1] + 52], '+50 cm', PAL.coral, PAL.paper, 46);
    // yasaklar: kırmak, kesmek, bükmek (Hikmet'in orta planında, başının sağında)
    const out = 1 - ease.exit(seg(t, tm.h3 - 0.25, 0.2));
    tm.tok.forEach((a, i) => { if (t >= a && out > 0) token(K, 598 + i * 154, 580, 70, i, (0.6 + 0.4 * spring(t - a, UI[0], UI[1])) * out, ease.enter(seg(t, tm.tokX, 0.25))); });
  }
  if (t >= tm.v141 && t < tm.cd0 + 0.1) {
    const m = sc(along([bx.D, bx.G], 0.42)), e = tm.cd0 - 0.2;
    tag(K, t, tm.v141, e, [m[0] - 34, m[1] - 84], '1,41 m', PAL.coral, PAL.paper, 50);
    lens(K, t, tm.lens, e, [432, 1086], 150, sc(bx.G), tm.v9);
  }
}
// Şema etiketleri sabit ekran konumlarında durur (okunurken oynamaz); küp altlarında hafifçe döner.
// Üstte iki satırlık gösterge: mercan = kapak çaprazı (yetmez), yeşil = iç köşegen (yeter). Sağ altta sonuç.
function labelsD(K, t, tm, dia, sc) {
  if (dia) {
    const e = tm.close, w1 = tag(K, t, tm.meas + 0.1, e, [488, 338], 'kapak çaprazı 1,41 m', PAL.coral, PAL.paper, 44); mark(K, t, tm.meas + 0.28, e, [488 + w1 + 32, 338], false);
    const w2 = tag(K, t, tm.v173, e, [488, 442], 'iç köşegen 1,73 m', PAL.green, PAL.paper, 48); mark(K, t, tm.v173 + 0.18, e, [488 + w2 + 32, 442], true);
    // küpün kenarları: 1 m (ön yüz dönmez; etiketler sabit)
    const P = (x, y, z) => sc(P3(x, y, z)), D = P(0, 1, 0), A = P(0, 0, 0), C = P(1, 1, 0), G = P(1, 1, 1), a1 = clamp01((t - tm.meas) / 0.25);
    K.ctx.save(); K.ctx.globalAlpha = a1;
    K.text('1 m', A[0] - 62, (A[1] + D[1]) / 2 + 60, 38, PAL.cream, 900); K.text('1 m', (D[0] + C[0]) / 2 + 60, D[1] - 16, 38, PAL.cream, 900); K.text('1 m', lerp(C[0], G[0], 0.42) + 58, lerp(C[1], G[1], 0.42) + 26, 38, PAL.cream, 900);
    K.ctx.restore();
  }
  tag(K, t, tm.eq, tm.close + 0.5, [636, 1120], '1,5 m < 1,73 m', PAL.cream, INK, 56);
}
// Şema (d5): oda kararır, karakterler çekilir, kutu tel kafes bir küpe iner. Kapağın çaprazı (mercan, 1,41) üst yüzde durur;
// onun bir kopyasının öndeki ucu D köşesinden A köşesine 1 metre iner, uzar ve yeşile döner: iç köşegen (1,73).
// Küp yavaşça döner (derinlik ekseni 104 → 48 px) ki çıtanın ARKA üst köşeye gittiği görülsün.
function diagram(K, t, tm) {
  const { ctx } = K, B = { ...B0, dx: lerp(104, 48, seg(t, tm.meas, tm.close - tm.meas)) }, P = (x, y, z) => P3(x, y, z, B);
  ctx.save(); ctx.globalAlpha = 0.74; ctx.fillStyle = INK; ctx.fillRect(-3000, -3000, 8000, 8000); ctx.restore();
  const A = P(0, 0, 0), Bp = P(1, 0, 0), C = P(1, 1, 0), D = P(0, 1, 0), E = P(0, 0, 1), F = P(1, 0, 1), G = P(1, 1, 1), H = P(0, 1, 1), st = S_T(TH2, B);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.07; K.poly([A, Bp, C, D], PAL.paper, 0); K.poly([Bp, F, G, C], PAL.paper, 0); ctx.globalAlpha = 1;
  ctx.setLineDash([16, 14]); for (const q of [A, F, H]) strokeLine(ctx, E, q, 5, '#B9AE98');          // arkada kalan üç kenar
  const c = Math.cos(TH2) / Math.SQRT2 * 1.5, f = P(c, 0, c);                                        // çıtanın tabandaki izi ve ucundan inen dikme
  ctx.setLineDash([8, 12]); ctx.globalAlpha = 0.55; strokeLine(ctx, A, f, 4, PAL.trim); strokeLine(ctx, st[1], f, 4, PAL.trim); ctx.globalAlpha = 1; ctx.setLineDash([]);
  for (const [p, q] of [[H, G], [F, G], [D, H]]) strokeLine(ctx, p, q, 7, PAL.cream);
  ctx.restore();
  stickDraw(K, st);
  ctx.save(); ctx.lineCap = 'round';
  for (const [p, q] of [[A, Bp], [Bp, C], [C, D], [D, A], [Bp, F], [C, G]]) strokeLine(ctx, p, q, 8, PAL.cream);   // ön kenarlar çıtanın önünden geçer
  ctx.restore();
  dimLine(K, D, G, ease.state(seg(t, tm.meas + 0.02, 0.3)), PAL.coral, 9);   // kapağın çaprazı: üst yüzde
  const u = ease.state(seg(t, tm.dg, 0.6));
  if (u > 0) {   // çaprazın ön ucu 1 m aşağı iner → iç köşegen
    const n = unit(A, G), o = [n[1] * 38, -n[0] * 38];
    dimLine(K, [lerp(D[0], A[0] + o[0], u), lerp(D[1], A[1] + o[1], u)], [lerp(G[0], G[0] + o[0], u), lerp(G[1], G[1] + o[1], u)], 1, mixHex(PAL.coral, MINT, clamp01(u * 1.4 - 0.2)), 9);
  }
  K.circ(A[0], A[1], 15, PAL.mustard, LW * 0.7); K.circ(G[0], G[1], 15, PAL.mustard, LW * 0.7);
}
