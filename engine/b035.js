// Bölüm 35 · KAŞAR KALIBI (v4 "hikâye" dili; storyboard: hikayeler/bolum_035_v5.md).
// Logline: Necmi meze tabağı için koca bir küp kaşarı 27 eşit küpe bölecektir. Hikmet "6 kesim gerekir" der. Defne dilimleri
// yan yana dizerek daha azına iner gibi olur, ama ortadaki küp buna izin vermez.
// Akılda kalacak tek şey: ortadaki küpün altı yüzü de içeridedir ve düz bir kesim ona en fazla bir yüz açar.
// Üç set aynı dünyada yan yana durur: ocak (çay ocağının tezgâhı, yüzler) · yakın (tahtanın yakın planı, kollar kadrajın
// kenarından girer) · kahraman (aynı tahta, büyük; kaşar yarı saydam, ortadaki küp hardal).
// Kaşar gerçek 3B kutularla çizilir: eğik izdüşüm (derinlik ekseni sağa ve yukarı), üç yüz görünür (üst, ön, sağ). Her parça
// özgün 3 × 3 × 3 kalıbın koordinatlarında bir kutudur; dış yüzler kabuk rengi, bıçağın açtığı yüzler taze renktir.
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const OCK = 'b035_ocak', YAK = 'b035_yakin', KAH = 'b035_kahraman', BX = 3000, CX = 6000;
// eğik izdüşüm: P(x, y, z) = [x0 + a·x + 0,42a·y, y0 − a·z − 0,34a·y]; birim = bir küçük küp
const mkP = (x0, y0, a) => ({ x0, y0, a, dx: 0.42 * a, dy: -0.34 * a });
const PO = mkP(330, 1290, 62), PY = mkP(BX + 300, 1330, 86), PK = mkP(CX + 300, 1380, 130);
const P = (o, [x, y, z]) => [o.x0 + o.a * x + o.dx * y, o.y0 - o.a * z + o.dy * y];
const VD = [-0.42, 1, -0.34];                                         // bakış yönü (izdüşümün sıfır vektörü): büyük = uzak
// ocak: karakterler ve tezgâh
const B_H = 250, B_N = 700, B_D = 870, HIK_X = 235, NEC_X = 790, DEF_X = 900, DEF_0 = 1320, NEC_IP = 1150, ES_H = 170, ES_N = 700, ES_D = 1125, SAY_H = 230, SAY_D = 830;
const TABAK0 = [150, 1316];                                           // ödül tabağı tezgâhta (Hikmet'in yanında)
// renkler
const KAS_DIS = '#EEC458', KAS_IC = '#FBE6A2', HARDAL = PAL.mustard, MERCAN = PAL.coral;
const LOK = '#F2CCD6', LOK_PUDRA = '#FFFDF8', CELIK = '#C9D3CC', SAP = '#5A3B22';
const KOL_S = 300;

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const tik = (t, a, d = 0.24) => Math.sin(Math.PI * seg(t, a - d, d));
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const lerp3 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
// eksen-açı dönüşü (Rodrigues); ax birim vektör
function rotV(v, ax, ang) {
  if (!ang) return v; const [kx, ky, kz] = ax, c = Math.cos(ang), s = Math.sin(ang), d = dot3(ax, v) * (1 - c);
  return [v[0] * c + (ky * v[2] - kz * v[1]) * s + kx * d, v[1] * c + (kz * v[0] - kx * v[2]) * s + ky * d, v[2] * c + (kx * v[1] - ky * v[0]) * s + kz * d];
}
const D111 = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];

// ═══════════════════════════ 3B kutu ═══════════════════════════
// pc = { b: [x0, x1, y0, y1, z0, z1] (kalıp koordinatı), off: [dx, dy, dz], ax, ang (merkez çevresinde dönüş), alpha,
//        renk(dis, i, sg) → dolgu, izgara: 0..1 (çentik çizgileri), yuz(K, i, sg, q, pts) ek süs, dis: tüm yüzler dış mı }
const merkez = pc => { const b = pc.b; return [(b[0] + b[1]) / 2, (b[2] + b[3]) / 2, (b[4] + b[5]) / 2]; };
const dunyaFn = pc => { const c = merkez(pc), off = pc.off || [0, 0, 0]; return p => add3(add3(rotV(sub3(p, c), pc.ax, pc.ang || 0), c), off); };
const derin = pc => dot3(dunyaFn(pc)(merkez(pc)), VD);
function kutu(K, o, pc, { lw = 5, izgara = 1 } = {}) {
  const { ctx } = K, b = pc.b, lo = [b[0], b[2], b[4]], hi = [b[1], b[3], b[5]], Wf = dunyaFn(pc), S = p => P(o, Wf(p));
  if (pc.lw != null) lw = pc.lw;
  ctx.save(); if (pc.alpha != null) ctx.globalAlpha *= pc.alpha;
  for (let i = 0; i < 3; i++) for (const sg of [-1, 1]) {
    const n = [0, 0, 0]; n[i] = sg; const nw = rotV(n, pc.ax, pc.ang || 0);
    if (dot3(nw, VD) >= -1e-6) continue;
    const j = (i + 1) % 3, k = (i + 2) % 3, v = sg < 0 ? lo[i] : hi[i];
    const q = (a, c) => { const p = [0, 0, 0]; p[i] = v; p[j] = a; p[k] = c; return S(p); };
    const pts = [q(lo[j], lo[k]), q(hi[j], lo[k]), q(hi[j], hi[k]), q(lo[j], hi[k])];
    const dis = pc.dis ?? (sg < 0 ? Math.abs(lo[i]) < 1e-6 : Math.abs(hi[i] - 3) < 1e-6);
    let renk = pc.renk ? pc.renk(dis, i, sg) : dis ? KAS_DIS : KAS_IC;
    if (nw[2] > 0.5) renk = H.mixHex(renk, '#FFFFFF', 0.22); else if (nw[0] > 0.5) renk = H.mixHex(renk, INK, 0.12);
    K.poly(pts, renk, lw);
    const iz = (pc.izgara ?? 1) * izgara;
    if (iz > 0.01) {
      ctx.save(); ctx.globalAlpha *= Math.min(1, 0.42 * iz); ctx.lineCap = 'round';
      for (let a = Math.floor(lo[j] + 1e-6) + 1; a < hi[j] - 1e-6; a++) H.strokeLine(ctx, q(a, lo[k]), q(a, hi[k]), lw * (0.45 + 0.3 * Math.max(0, iz - 1)), INK);
      for (let a = Math.floor(lo[k] + 1e-6) + 1; a < hi[k] - 1e-6; a++) H.strokeLine(ctx, q(lo[j], a), q(hi[j], a), lw * (0.45 + 0.3 * Math.max(0, iz - 1)), INK);
      ctx.restore();
    }
    if (pc.yuz) pc.yuz(K, i, sg, q, pts);
  }
  ctx.restore();
}
// Parçaları uzaktan yakına çizer (merkez derinliği)
function kutular(K, o, list, opt) { for (const pc of [...list].sort((a, b) => derin(b) - derin(a))) kutu(K, o, pc, opt); }
function kutuNokta(o, pc, [sx, sy]) {   // merkezi ekranda (sx, sy)'ye getiren off (y ekseni sabit)
  const c = merkez(pc), s = P(o, c); return [(sx - s[0]) / o.a, 0, -(sy - s[1]) / o.a];
}

// ═══════════════════════════ Bıçak ═══════════════════════════
// 3B: O ağız ucunun köşesi, U boy yönü (uca → sapa), V sırt yönü (ağızdan sırta). parca: ağzın çizilecek [u0, u1, v0, v1] dikdörtgenleri
const BL = 3.8, BH = 0.8, BS = 1.5;
function bicak3(K, o, O, U, V, { L = BL, Hb = BH, Ls = BS, lw = 5, parca = null, sap = true, agiz = true, alpha = 1 } = {}) {
  const { ctx } = K, Q = (u, v) => P(o, add3(O, add3(mul3(U, u), mul3(V, v))));
  ctx.save(); ctx.globalAlpha *= alpha;
  if (sap) {
    K.poly([Q(L, Hb * 0.08), Q(L + 0.22, Hb * 0.08), Q(L + 0.22, Hb * 0.92), Q(L, Hb * 0.92)], '#9AA59D', lw * 0.8);
    K.poly([Q(L + 0.22, Hb * 0.2), Q(L + Ls, Hb * 0.26), Q(L + Ls, Hb * 0.8), Q(L + 0.22, Hb * 0.86)], SAP, lw);
    for (const u of [0.55, 1.05]) K.circ(...Q(L + u, Hb * 0.53), lw * 0.9, CELIK, lw * 0.4);
  }
  if (agiz) {
    const rects = parca || [[0, L, 0, Hb]];
    for (const [u0, u1, v0, v1] of rects) {
      if (u1 - u0 < 0.02 || v1 - v0 < 0.02) continue;
      const uc = u0 < 0.35 ? [Q(u0, Math.max(v0, Hb * 0.55)), Q(Math.min(u1, 0.35), v0)] : [Q(u0, v0)];
      const pts = [...uc, Q(u1, v0), Q(u1, v1), Q(u0, v1)];
      K.poly(pts, CELIK, lw);
      ctx.save(); ctx.globalAlpha *= 0.8; H.strokeLine(ctx, Q(Math.max(u0, 0.4), v0 + (v1 - v0) * 0.18), Q(u1 - 0.05, v0 + (v1 - v0) * 0.18), lw * 0.6, '#EEF3EF'); ctx.restore();
    }
  }
  ctx.restore();
  return { tutus: Q(L + Ls * 0.62, Hb * 0.53), uc: Q(0, Hb * 0.4) };
}
// 2B (ocak görünüşü): tip ağız ucu, a boy yönünün açısı, n ağızdan sırta doğru (+1 / −1)
function bicak2(K, tip, a, { L = 170, h = 34, ls = 78, n = 1, lw = LW * 0.8 } = {}) {
  const c = Math.cos(a), s = Math.sin(a), nx = s * n, ny = -c * n, Q = (u, v) => [tip[0] + c * u + nx * v, tip[1] + s * u + ny * v];
  K.poly([Q(0, h * 0.5), Q(16, 0), Q(L, 0), Q(L, h), Q(10, h)], CELIK, lw);
  K.poly([Q(L, h * 0.08), Q(L + 8, h * 0.08), Q(L + 8, h * 0.92), Q(L, h * 0.92)], '#9AA59D', lw * 0.8);
  K.poly([Q(L + 8, h * 0.18), Q(L + ls, h * 0.24), Q(L + ls, h * 0.82), Q(L + 8, h * 0.86)], SAP, lw);
  return { tutus: Q(L + ls * 0.6, h * 0.52) };
}

// ═══════════════════════════ Diğer nesneler ═══════════════════════════
// Lokum (tüm yüzleri pudralı): pudra noktaları tohumlu
function lokumPc(b, off, ax, ang) {
  return {
    b, off, ax, ang, dis: true, izgara: 0, renk: () => LOK,
    yuz(K, i, sg, q) {
      const r = H.mulberry32(17 + i * 7 + (sg > 0 ? 3 : 0)), lo = [b[0], b[2], b[4]], hi = [b[1], b[3], b[5]], j = (i + 1) % 3, k = (i + 2) % 3;
      for (let n = 0; n < 9; n++) { const u = lerp(lo[j] + 0.12, hi[j] - 0.12, r()), v = lerp(lo[k] + 0.12, hi[k] - 0.12, r()), p = q(u, v); K.circ(p[0], p[1], 3.2 + 2.4 * r(), LOK_PUDRA, 0); }
    },
  };
}
// Küçük tabak (ocak görünüşü): (x, y) tabağın ortası
function tabak(K, [x, y], k = 1) { K.ell(x, y + 4 * k, 66 * k, 17 * k, INK, 0); K.ell(x, y, 66 * k, 17 * k, PAL.cream, LW * 0.8); K.ell(x, y - 2 * k, 44 * k, 10 * k, '#EFE6D2', LW * 0.4); }
// Önkol + el, nesnenin üstüne
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Kadrajın dışındaki org noktasından ele uzanan yen + el (hedef varsa işaret parmağı)
function uzunKol(K, key, org, el, hedef, s = KOL_S) {
  const c = H.CARDS[key], { ctx } = K, w = c.arm.w * s, lw = c.line * s, u = H.unit(el, org), bilek = [el[0] + u[0] * 44 * s / 300, el[1] + u[1] * 44 * s / 300];
  ctx.save(); ctx.lineCap = 'butt';
  for (const [ww, col] of [[w + lw * 2, INK], [w, c.arm.color]]) H.strokeLine(ctx, org, bilek, ww, col);
  H.strokeLine(ctx, [bilek[0] + u[0] * 12, bilek[1] + u[1] * 12], bilek, w + lw * 2, INK); H.strokeLine(ctx, [bilek[0] + u[0] * 14, bilek[1] + u[1] * 14], [bilek[0] + u[0] * 4, bilek[1] + u[1] * 4], w, c.arm.shade);
  ctx.restore();
  if (hedef) H.isaret(K, key, el, s, hedef, 1.25); else H.grip(K, key, el, s);
}
// Tahta (kesme tahtası): kalıbın altında, yan yana dizilişe yeter
const TAHTA = { b: [-3.8, 6.8, -0.5, 3.55, -0.24, 0], dis: true, izgara: 0, renk: () => '#D9A866' };
function tahta(K, o, lw) {
  kutu(K, o, TAHTA, { lw });
  const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.35;
  for (let i = 1; i < 5; i++) H.strokeLine(ctx, P(o, [-3.6, i * 0.8 - 0.4, 0]), P(o, [6.6, i * 0.8 - 0.4, 0]), lw * 0.5, '#B98544');
  ctx.restore();
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
// Arka duvar dolapları ve askılık (ocak)
M.mekanEkle(OCK, {
  gen: [0, 1400], dongu: ['ocakta çaydanlık buharı', 'duvar saatinin saniye kolu'],
  capa: { tahta: P(PO, [1.5, 1.5, 0]), tabak: TABAK0 }, kadraj: { genis: [0.98, 535, 1085], defne: [1.35, DEF_X, 1010], necmi: [1.38, NEC_IP, 1040] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1900, isik, duvar: 'fayans', zemin: 'karo' });
    // üst dolaplar (petrol kapaklı) ve aradaki duvar saati
    for (let i = 0; i < 3; i++) { const x = 40 + i * 170; K.rect(x, 430, 160, 300, '#3E7C77', LW, 8); K.rect(x + 16, 448, 128, 264, '#4A8C86', LW * 0.6, 6); K.circ(x + (i === 1 ? 128 : 32), 690, 9, PAL.metal, LW * 0.5); }
    M.duvarSaati(K, 700, 560, 60, 9.4, t);
    // askılık: kepçe, kevgir, spatula
    K.line(560, 800, 900, 800, 12, INK); K.line(560, 800, 900, 800, 6, PAL.metal);
    for (const [x, L, tip] of [[610, 150, 'k'], [700, 130, 's'], [790, 160, 'v']]) {
      K.line(x, 800, x, 800 + L, 9, INK); K.line(x, 800, x, 800 + L, 4, PAL.metalDark);
      if (tip === 'k') K.ell(x, 800 + L + 14, 26, 18, PAL.metal, LW * 0.7);
      else if (tip === 'v') { K.circ(x, 800 + L + 24, 30, '#B9C4BC', LW * 0.7); for (let j = -1; j <= 1; j++) K.line(x - 18, 800 + L + 24 + j * 12, x + 18, 800 + L + 24 + j * 12, 3, PAL.metalDark); }
      else K.rect(x - 22, 800 + L, 44, 54, PAL.metal, LW * 0.7, 6);
    }
    // sağ duvar: raf (kavanozlar, lokum kutusunun yeri), altında arka tezgâh ve ocakta çaydanlık
    K.rect(960, 820, 420, 22, PAL.woodTop, LW, 6);
    for (const [x, h, c] of [[990, 92, '#E8D9B5'], [1070, 70, '#D9603F'], [1140, 104, '#E8D9B5'], [1300, 80, '#CFE3DD']]) { K.rect(x, 820 - h, 56, h, c, LW * 0.8, 10); K.rect(x - 4, 820 - h - 14, 64, 18, PAL.metal, LW * 0.6, 5); }
    K.rect(940, 1130, 480, 30, '#CFC8BA', LW, 6); K.rect(950, 1160, 460, 340, PAL.woodDark, LW, 0);
    K.rect(1180, 1104, 170, 26, INK, 0, 6); K.circ(1225, 1104, 18, '#5D6A61', LW * 0.6); K.circ(1305, 1104, 18, '#5D6A61', LW * 0.6);
    K.poly([[1250, 1100], [1350, 1100], [1340, 1030], [1260, 1030]], PAL.red, LW); K.poly([[1268, 1028], [1332, 1028], [1340, 1004], [1326, 980], [1274, 980], [1260, 1004]], '#B23A2A', LW * 0.8);
    K.line(1350, 1060, 1384, 1040, 10); H.buhar(K, 1300, 968, t, { k: 0.9 });
  },
  on(K) {   // ada tezgâhı: üst yüz (eğik izdüşümde yatay düzlem) ve ön yüz (karakterlerin belini örter)
    const a = P(PO, [-4.4, -0.75, -0.24]), b = P(PO, [11.2, -0.75, -0.24]), c = P(PO, [11.2, 4.2, -0.24]), d = P(PO, [-4.4, 4.2, -0.24]);
    K.poly([a, b, c, d], '#E3DED3', LW);
    K.rect(a[0], a[1], b[0] - a[0], 36, '#CFC8BA', LW, 0);
    K.rect(a[0] + 10, a[1] + 36, b[0] - a[0] - 20, 700, PAL.wood, LW, 0);
    for (let i = 0; i < 6; i++) K.rect(a[0] + 50 + i * 200, a[1] + 70, 170, 260, '#B07A44', LW * 0.8, 10);
  },
});
// Yakın plan zemini: duvar karosu, tezgâh yüzü, çay bardağı (buhar) ve kapalı lokum kutusu (ipucunun tohumu)
function yakinZemin(K, t, o, ox, { kutuGor = true, bardakX = -3.2 } = {}) {
  const { ctx } = K, duvarY = P(o, [0, 11, -0.24])[1];
  ctx.fillStyle = '#DCE7E2'; ctx.fillRect(ox - 1400, -600, 4000, duvarY + 600);
  for (let i = 0; i < 26; i++) K.line(ox - 1400 + i * 150, -600, ox - 1400 + i * 150, duvarY, 4, '#BFD2CB');
  for (let j = 0; j < 14; j++) K.line(ox - 1400, -600 + j * 150, ox + 2600, -600 + j * 150, 4, '#BFD2CB');
  ctx.fillStyle = '#E3DED3'; ctx.fillRect(ox - 1400, duvarY, 4000, 2400); K.line(ox - 1400, duvarY, ox + 2600, duvarY, LW);
  ctx.save(); ctx.globalAlpha = 0.5; for (let i = 0; i < 9; i++) K.line(ox - 1400 + i * 420, duvarY + 40, ox - 1700 + i * 420, duvarY + 1400, 3, '#D1CABD'); ctx.restore();
  // çay bardağı (sol arka) ve buharı
  const g = P(o, [bardakX, 8.4, -0.24]), k = o.a / 86;
  ctx.save(); ctx.translate(g[0], g[1]); ctx.scale(k * 2.2, k * 2.2);
  K.ell(0, 0, 34, 9, PAL.cream, 3); K.poly([[-18, -62], [18, -62], [11, -36], [19, -11], [13, -2], [-13, -2], [-19, -11], [-11, -36]], '#A5491A', 3);
  ctx.restore(); H.buhar(K, g[0], g[1] - 150 * k, t, { k: 1.1 * k, n: 2, ara: 24 * k });
  // kapalı lokum kutusu (sağ arka)
  if (kutuGor) { kutu(K, o, { b: [7.2, 10, 7.6, 9.8, -0.24, 0.7], off: [0, 0, 0], dis: true, izgara: 0, renk: () => '#D9603F' }, { lw: LW * o.a / 86 }); const u = P(o, [8.6, 8.7, 0.7]); K.ell(u[0], u[1], 0.9 * o.a, 0.32 * o.a, '#F2CCD6', LW * 0.6 * o.a / 86); }
}
M.mekanEkle(YAK, {
  gen: [BX - 600, BX + 1600], dongu: ['çay buharı', 'tezgâhta kayan pencere ışığı'],
  kadraj: { tahta: [1.0, BX + 485, 1160] },
  arka(K, t) { yakinZemin(K, t, PY, BX); tahta(K, PY, LW * 0.9); },
  isik(K, t) { const k = 50 * Math.sin(t * 0.45); H.isikSeridi(K, [[BX - 300 + k, 300], [BX + 60 + k, 300], [BX + 700 + k, 1700], [BX + 340 + k, 1700]], { renk: '#FFF4D6', a: 0.13 }); },
});
M.mekanEkle(KAH, {
  gen: [CX - 600, CX + 1600], dongu: ['çay buharı', 'tezgâhta kayan pencere ışığı'],
  kadraj: { kalip: [1.2, CX + 590, 1105] },
  arka(K, t) { yakinZemin(K, t, PK, CX, { kutuGor: false, bardakX: -4.6 }); kutu(K, PK, { b: [-1.4, 4.6, -0.7, 3.9, -0.24, 0], dis: true, izgara: 0, renk: () => '#D9A866' }, { lw: LW }); },
  isik(K, t) { const k = 50 * Math.sin(t * 0.45); H.isikSeridi(K, [[CX - 300 + k, 300], [CX + 60 + k, 300], [CX + 700 + k, 1700], [CX + 340 + k, 1700]], { renk: '#FFF4D6', a: 0.1 }); },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05, tap: 0.3,
    h27: T('h1:3') - 0.04, kupB: T('h1:5') - 0.1, alti: T('h1:7'),
    y1: T('h2a') - 0.08, s1a: T('h2a:2') - 0.2, tas1: T('h2a:4'), kon1: T('h2a:5') + 0.05,
    oda2: T('h2b') - 0.08, az: T('h2b:1'), odul: T('h3:1') - 0.3, ver: T('h3:3') - 0.25,
    y2: T('d2') - 0.12, s2a: T('d2:1') - 0.12, tas2: T('d2:2') - 0.05, kon2: T('d2:4'), c3a: T('d2:6') - 0.3, c4a: T('d2:7'),
    hd: T('hd'), al: T('hd:1') - 0.05, kalk: T('hd:2'), gos: T('hd:5') - 0.04, yap: T('hd:7') - 0.04,
    sayac: T('hd>') + 0.18, ipucu: cd + 0.3,
    n1: T('n1'), lAl: T('n1:1') - 0.12, lDon: T('n1:2'), lDonB: T('n1:6'), hepsi: T('n1:6'),
    cevap: T('d3:2') - 0.1, xr: T('d4') - 0.04, alt6: T('d4:2') - 0.04,
    kes: [T('d4:6'), T('d4:8'), T('d5:0'), T('d5:4'), T('d5:7'), T('d5:10')],
    espri: T('h4') - 0.35, verE: T('h4:1') - 0.1, mudur: T('h4:4'), buy: T('h4:6'),
    cta: T('d6') - 0.15,
  };
  tm.s1b = tm.s1a + 0.5; tm.s2b = tm.s2a + 0.45; tm.c3b = tm.c3a + 0.5; tm.c4b = tm.c4a + 0.5; tm.cikB = tm.c4b + 0.12;
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, ...M.kadraj(OCK, 'genis')], [tm.alti - 0.3, 1.0, 540, 1080]] },
    { id: 'yakin1', t0: tm.y1, cam: [[0, 1.22, BX + 600, 1150], [tm.tas1, 1.18, BX + 660, 1150]] },
    { id: 'oda2', t0: tm.oda2, cam: [[0, 0.96, 585, 1080], [tm.odul, 0.98, 585, 1074], [tm.ver - 0.3, 0.97, 592, 1078]] },
    { id: 'yakin2', t0: tm.y2, cam: [[0, ...M.kadraj(YAK, 'tahta')], [tm.hd, 1.03, BX + 470, 1150]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 1.04, 545, 990], [tm.ipucu - 0.3, 1.07, 545, 984]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, ...M.kadraj(OCK, 'necmi')], [tm.lDon, 1.42, NEC_IP + 4, 1034]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(OCK, 'defne')]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...M.kadraj(KAH, 'kalip')], [tm.kes[0], 1.21, CX + 592, 1102], [tm.kes[3], 1.23, CX + 594, 1098], [tm.kes[5] + 0.3, 1.24, CX + 596, 1096]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.1, 460, 1070], [tm.buy, 1.13, 465, 1064]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.4, ES_D - 8, 1000], [tm.cta + 1.5, 1.45, ES_D - 10, 994]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -3, look: [0.75, 0.35] }, ...POZ.dur });
  const hik = [
    [1.0, { head: { tilt: 4, look: [0.9, 0.1] } }, 0.35],
    [tm.alti - 0.1, { expr: 'notr', head: { tilt: 6, look: [0.95, 0.05] } }, 0.3],
    [tm.oda2, { x: B_H, expr: 'mutlu', head: { tilt: 4, look: [0.9, 0.1] } }, 0.01],
    [tm.az - 0.1, { ...POZ.ikaz, head: { tilt: 7, look: [0.95, 0] } }, 0.3, ease.enter],
    [tm.odul - 0.2, { armR: POZ.dur.armR, head: { tilt: -2, look: [0.5, 0.6] } }, 0.3],
    [tm.ver, { head: { tilt: 5, look: [0.95, 0.1] } }, 0.3],
    [tm.sayac, { x: SAY_H, expr: 'mutlu', head: { tilt: 5, look: [0.95, 0.05] } }, 0.01],
    [tm.cd + 0.1, { expr: 'notr', head: { tilt: 4, look: [0.95, 0] } }, 0.3],
    [tm.buldum - 0.05, { x: HIK_X, expr: 'saskin', head: { tilt: 3, look: [0.9, 0.05] } }, 0.01],
    [tm.espri, { x: ES_H, expr: 'notr', head: { tilt: 4, look: [0.9, 0.15] } }, 0.01],
    [tm.verE + 0.6, { expr: 'saskin', head: { tilt: -3, look: [0.4, 0.7] } }, 0.3],
    [tm.buy - 0.1, { expr: 'yorgun', head: { tilt: 6, look: [0.9, 0.2] } }, 0.3],
  ];
  const defBase = kisi('defne', { x: DEF_0, expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.3] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: 4, look: [-0.85, 0.15] } }, 0.4],
    [tm.alti, { head: { tilt: -3, look: [-0.6, 0.55] } }, 0.3],
    [tm.oda2, { x: B_D, expr: 'notr', head: { tilt: -4, look: [-0.85, 0.2] } }, 0.01],
    [tm.odul, { expr: 'mutlu', head: { tilt: 5, look: [-0.8, 0.1] } }, 0.3],
    [tm.ver, { head: { tilt: -3, look: [-0.6, 0.45] } }, 0.25],
    [tm.sayac, { x: SAY_D, expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -6, look: [-0.7, 0.35] } }, 0.01],
    [tm.cd - 2.3, { head: { tilt: 5, look: [-0.4, 0.55] } }, 0.35],
    [tm.cd - 1.9, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -4, look: [-0.9, 0.15] } }, 0.25],
    [tm.cd + 0.1, { head: { tilt: 5, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.06, { x: DEF_X, ...POZ.dur }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.espri, { x: ES_D, expr: 'mutlu', ...POZ.dur, head: { tilt: -4, look: [-0.85, 0.3] } }, 0.01],
    [tm.cta - 0.05, { head: { tilt: 6, look: [-0.1, 0.05] } }, 0.35],
  ];
  return { tm, film, hik, hikBase, def, defBase };
}

// ═══════════════════════════ Kaşarın durumu (tahta koordinatı) ═══════════════════════════
// Necmi z = 2'de yatay keser, üst dilimi bıçağın üstünde sağa taşır. Defne z = 1'de keser, orta dilimi sola taşır; sonra
// y = 1 ve y = 2'de üç dilimi birden keser (4 kesim). Hikmet orta dilimin ortadaki çubuğunu kaldırır: ortadaki küp iki
// komşusuna yapışıktır. Cevaptan sonra (espri) tahtada 26 küp aralıklı durur; ortadaki tabakta.
const SAG = [3.4, 0, -2], SOL = [-3.4, 0, -1];
const tasiYol = (t, a, b, hedef, kalk = 1.1) => { const u = ease.state(seg(t, a, b - a)); return [hedef[0] * u, hedef[1] * u, hedef[2] * u + kalk * 4 * u * (1 - u)]; };
// y-kesimleri: uzun bıçak bir uçta iner (0,12 sn), sonra dizilişin boyunca sürter. dir −1: sağdan sola (3. kesim), +1: soldan sağa (4. kesim)
const SW_INIS = 0.12, BL_Y = 3.9, SW = [2.9, -3.7];
function supur(t, a, b, dir) {   // bıçağın sol ucu (kalıp x'i)
  const [s0, s1] = dir < 0 ? SW : [SW[1], SW[0]];
  return t < a + SW_INIS ? s0 : lerp(s0, s1, ease.state(seg(t, a + SW_INIS, b - a - SW_INIS)));
}
function kesimAni(a, b, dir, cx) {   // bıçağın ortası dilimin ortasını geçtiği an (dilim o an ayrılır)
  const [s0, s1] = dir < 0 ? SW : [SW[1], SW[0]], u = (cx - BL_Y / 2 - s0) / (s1 - s0);
  if (u <= 0) return a + SW_INIS;
  let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (ease.state(m) < u) lo = m; else hi = m; }   // ease.state tersi
  return a + SW_INIS + (b - a - SW_INIS) * hi;
}
function kasarAt(t, tm) {
  if (t >= tm.cevap) {   // espri ve sonrası: 26 küp meze için tahtaya 3 × 9 dizilmiş; ortadaki yer boş (o küp tabakta)
    const L = [], kup = [];
    for (let z = 2; z >= 0; z--) for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) if (!(x === 1 && y === 1 && z === 1)) kup.push([x, y, z]);
    let n = 0;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) {
      if (r === 1 && c === 4) continue;
      const [x, y, z] = kup[n++];
      L.push({ b: [x, x + 1, y, y + 1, z, z + 1], off: [-3.3 + c * 1.12 - x, r * 1.12 - y, -z] });
    }
    return L;
  }
  if (t < tm.s1b) return [{ b: [0, 3, 0, 3, 0, 3], off: [0, 0, 0] }];
  const ust = tasiYol(t, tm.tas1, tm.kon1, SAG, 1.0);
  if (t < tm.s2b) return [{ b: [0, 3, 0, 3, 0, 2], off: [0, 0, 0] }, { b: [0, 3, 0, 3, 2, 3], off: ust }];
  const orta = tasiYol(t, tm.tas2, tm.kon2, SOL, 2.2);
  const dilimler = [['ust', 2, ust, 3.4], ['alt', 0, [0, 0, 0], 0], ['orta', 1, orta, -3.4]];
  const t3 = x0 => kesimAni(tm.c3a, tm.c3b, -1, x0 + 1.5), t4 = x0 => kesimAni(tm.c4a, tm.c4b, 1, x0 + 1.5), L = [];
  for (const [ad, z, off, x0] of dilimler) {
    const k3 = t >= t3(x0), k4 = t >= t4(x0), zb = [z, z + 1];
    const bantlar = !k3 ? [[0, 3]] : !k4 ? [[0, 1], [1, 3]] : [[0, 1], [1, 2], [2, 3]];
    for (const [y0, y1] of bantlar) {
      const dy = (y0 === 0 && k3 ? -0.06 * W(t, t3(x0), 0.15) : 0) + (y0 >= 2 && k4 ? 0.06 * W(t, t4(x0), 0.15) : 0) + (y0 === 1 && y1 === 3 ? 0 : 0);
      const pc = { b: [0, 3, y0, y1, zb[0], zb[1]], off: [off[0], off[1] + dy, off[2]], ad: ad + y0 };
      if (ad === 'orta' && y0 === 1 && y1 === 2 && t >= tm.kalk - 0.02) { pc.cubuk = true; }
      L.push(pc);
    }
  }
  return L;
}
// Hikmet'in kaldırdığı çubuk (yakın planda): kalıp koordinatı + kaldırma
const CUBUK = { b: [0, 3, 1, 2, 1, 2] };
function cubukOff(t, tm) {
  const u = ease.enter(seg(t, tm.kalk, 0.42));
  return [SOL[0] + 2.0 * u, SOL[1] - 0.9 * u, SOL[2] + 2.0 * u];
}

// ═══════════════════════════ Kahraman an: altı kesim ═══════════════════════════
const KES = [['x', 2, 1], ['x', 1, -1], ['y', 1, -1], ['y', 2, 1], ['z', 2, 1], ['z', 1, 1]];   // [eksen, düzlem, açılan tarafın yönü]
const AXI = { x: 0, y: 1, z: 2 }, G = 0.32;
function kahramanOff(t, tm, [x, y, z]) {
  const o = [0, 0, 0], u = k => ease.state(seg(t, tm.kes[k] + 0.02, 0.3)), birles = 0.16 * (1 - ease.state(seg(t, tm.cevap, 0.4)));
  o[0] = (x - 1) * birles; o[1] = (y - 1) * birles; o[2] = z * birles;
  if (x === 2) o[0] += G * u(0); if (x === 0) o[0] -= G * u(1);
  if (y === 0) o[1] -= G * u(2); if (y === 2) o[1] += G * u(3);
  if (z === 2) o[2] += G * u(4); if (z >= 1) o[2] += G * u(5);
  return o;
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h1: 7, d4: 6, d5: 7 },
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'yakin1' || id === 'yakin2') yakinSahne(K, t, S, B);
    else if (id === 'cevap') kahramanSahne(K, t, S, B);
    else ocakSahne(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'yakin1') H.adimEtiket(K, t, [[tm.s1b - 0.05, 'KESİM 1']], tm.oda2 - 0.2, [300, B.top + 70], 56);
    if (id === 'yakin2') {
      H.adimEtiket(K, t, [[tm.y2 + 0.3, 'KESİM 1'], [tm.s2b, 'KESİM 2'], [tm.c3b, 'KESİM 3'], [tm.c4b, 'KESİM 4', MERCAN]], tm.sayac - 0.2, [300, B.top + 70], 56);
      if (S.yapisik) H.mark(K, t, tm.yap, tm.sayac - 0.2, S.yapisik, false);
    }
    if (id === 'cevap') {
      H.adimEtiket(K, t, tm.kes.map((k, i) => [k, 'KESİM ' + (i + 1), i === 5 ? PAL.green : INK]), tm.espri - 0.25, [540, 400], 60);
      H.mark(K, t, tm.kes[5] + 0.14, tm.espri - 0.25, [780, 400], true);
    }
  },
});

// ——— ocak: tezgâh (yüzler) ———
function necmiAt(t, tm, id) {
  if (id === 'ipucu') return kisi('necmi', { x: NEC_IP, expr: t > tm.n1 - 0.15 ? 'mutlu' : 'notr', head: t > tm.lAl + 0.25 ? { tilt: -5, look: [-0.75, 0.05] } : { tilt: 3, look: [0.35, 0.75] }, ...POZ.dur });
  if (id === 'sayac') return kisi('necmi', { x: 1200, expr: 'notr', ...POZ.dur, head: { tilt: 0, look: [-0.9, 0.1] } });
  if (id === 'buldum') return kisi('necmi', { x: NEC_X - 20, expr: 'saskin', head: { tilt: 4, look: [0.9, 0.1] }, ...POZ.dur });
  if (id === 'espri' || id === 'cta') return kisi('necmi', { x: ES_N, expr: 'mutlu', head: { tilt: -4, look: [-0.9, 0.2] }, ...POZ.dur });
  const p = kisi('necmi', { x: id === 'oda2' ? B_N : NEC_X, expr: id === 'oda' ? 'notr' : 'mutlu', head: { tilt: -3, look: [-0.8, 0.45] }, ...POZ.dur });
  if (id === 'oda') { H.onayla(p, t, tm.alti + 0.1, 2, 0.3); if (t > 1.2) p.head.look = [-0.9, 0.1]; }
  if (id === 'oda2' && t > tm.ver - 0.3) p.head.look = [0.9, 0.2];
  return p;
}
function ocakSahne(K, t, tl, S, { heads, sc }) {
  const { tm } = S, id = sc.id, hop = H.buldumHop(t, tm.buldum);
  M.mekanCiz(K, OCK, 'arka', t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= hop;
  if (id === 'sayac') { H.onayla(hp, t, tm.cd - 2.6, 2, 0.3); H.omuzSilk(dp, t, tm.cd - 1.7, 0.5); }
  const np = necmiAt(t, tm, id);
  const ust = [];   // tezgâhtan sonra çizilecek eller ve eldekiler

  // ——— Necmi: bıçak (kanca: kalıbın üstünde; oda2: elinde, sonra Defne'ye verir) ———
  let kasarBicak = null;
  if (id === 'oda') {
    const ini = 0.3, inme = tik(t, ini, 0.3) * 0;
    const z = 3.0 + 0.42 * (1 - W(t, ini - 0.22, 0.22)) + 0.42 * W(t, ini + 0.12, 0.35) * 0.5 + inme;
    kasarBicak = { O: [2 - W(t, tm.kupB, 0.3) + W(t, tm.alti + 0.7, 0.3), -0.45, z + 0.25 * tik(t, tm.kupB + 0.15, 0.3) + 0.25 * tik(t, tm.alti + 0.85, 0.3)], U: [0, 1, 0], V: [0, 0, 1] };
    const tut = P(PO, add3(kasarBicak.O, [0, BL + BS * 0.62, BH * 0.53]));
    H.reach('necmi', np, 'L', tut, 1, 'A');
  }
  let elBicak = null;
  if (id === 'oda2') {   // Necmi bıçağı sapı önde Defne'ye uzatır; iki el sapta buluşur
    const A = [B_N + 40, 1190], Bp = [B_D - 60, 1185], v = H.elVer(t, tm.ver, A, Bp, { bulus: [(B_N + B_D) / 2 + 6, 1150] });
    const p = t < tm.ver ? A : v.p;
    H.reach('necmi', np, 'R', [p[0] - 16, p[1] + 4], v.verW, 'A');
    H.reach('defne', dp, 'L', [p[0] + 16, p[1] + 4], v.alW, 'A');
    elBicak = { p, a: -Math.PI / 2 + 0.3, nTut: v.verW > 0.5, dTut: v.alW > 0.5 };
  }
  // ——— Hikmet: kancada kalıbı gösterir; h3'te ödül tabağını kaldırır; sayaçta çubuğu tutar ———
  let hTabak = null, hCubuk = false, hIsaret = null;
  if (id === 'oda') {
    const hedef = P(PO, [0, 0.6, 2.2]), w = W(t, 0.5, 0.3) * (1 - W(t, tm.alti - 0.2, 0.3));
    H.reach('hikmet', hp, 'R', [hedef[0] - 70, hedef[1] + 40], w, 'A'); if (w > 0.6) hIsaret = hedef;
  }
  if (id === 'oda2') {
    const u = H.kaldir(t, [[tm.odul + 0.25, tm.ver + 0.6]], { cik: 0.4, inis: 0.3 }), w = W(t, tm.odul - 0.05, 0.28) * (1 - W(t, tm.ver + 0.9, 0.3));
    const yuk = H.elYeri('hikmet', hp, 'R', 'yukari'), el = [lerp(TABAK0[0] + 40, yuk[0] - 10, u), lerp(TABAK0[1] - 6, yuk[1] + 30, u)];
    if (w > 0.01) { H.reach('hikmet', hp, 'R', el, w, u > 0.3 ? 'B' : 'A'); hTabak = { p: [el[0] - 40, el[1] + 6], u }; }
  }
  if (id === 'sayac') {
    const el = [SAY_H + 190, 1060]; H.reach('hikmet', hp, 'R', el, 1, 'A'); hCubuk = true;
  }
  // ——— Defne: kanca: parmak sayar; sayaç: sol eliyle 1'den 5'e sayar ———
  let dParmak = 0;
  if (id === 'oda') { H.reach('defne', dp, 'L', H.elYeri('defne', dp, 'L', 'gogus'), W(t, 0.4, 0.3), 'A'); dParmak = 1 + Math.floor(seg(t, 0.7, 3.2) * 3.99); }
  if (id === 'sayac') {
    const w = W(t, tm.sayac + 0.2, 0.3) * (1 - W(t, tm.cd - 2.05, 0.3)), g = H.elYeri('defne', dp, 'L', 'gogus');
    H.reach('defne', dp, 'L', [g[0] - 30, g[1] - 40], w, 'A'); if (w > 0.5) dParmak = 1 + Math.floor(seg(t, tm.sayac + 0.45, 2.5) * 4.99);
  }
  // ——— Necmi ipucu: sağ elinde lokum kutusu (gövdesinin sağında), sol elindeki kürdanla ortadaki lokumu yüzünün soluna kaldırır ———
  let lokum = null;
  if (id === 'ipucu') {
    const lu = ease.enter(seg(t, tm.lAl + 0.1, 0.42)), donus = TAU * ease.state(seg(t, tm.lDon, tm.lDonB - tm.lDon));
    const kc = P(LO, [1.65, 1.65, 0.55]), lp = [kc[0] - 250 * lu, kc[1] - 150 * lu];
    lokum = { lu, donus, kc, lp };
    H.reach('necmi', np, 'R', P(LO, [3.45, 0.6, 0.35]), 1, 'A');
    const w = W(t, tm.n1 - 0.25, 0.28), dur = H.elYeri('necmi', np, 'L', 'gogus');
    const kur = [lp[0] - 62, lp[1] + 74];   // kürdanın eldeki ucu
    lokum.kur = kur;
    H.reach('necmi', np, 'L', [lerp(dur[0], kur[0], w), lerp(dur[1], kur[1], w)], 1, 'A');
  }
  // ——— espri: Necmi tabağı (ortadaki küp) Hikmet'e verir ———
  let eTabak = null;
  if (id === 'espri' || id === 'cta') {
    const A = [ES_N - 130, 1120], Bp = [ES_H + 150, 1105], v = H.elVer(t, tm.verE, A, Bp, { bulus: [(ES_N + ES_H) / 2, 1070] });
    const kal = ease.state(seg(t, tm.mudur, 0.4)), el0 = t < tm.verE ? A : v.p, el = [el0[0] - 20 * kal, el0[1] - 70 * kal];
    H.reach('necmi', np, 'L', [el[0] + 40, el[1] + 8], id === 'cta' ? 0 : v.verW, 'A');
    const ac = W(t, tm.buy - 0.15, 0.3);
    if (ac > 0) H.reach('necmi', np, 'L', [ES_N - 200, 1120], ac * (1 - v.verW), 'B');
    H.reach('hikmet', hp, 'R', [el[0] - 40, el[1] + 8], v.alW, 'A');
    eTabak = { p: el, nTut: v.verW > 0.05 && id !== 'cta', hTut: v.alW > 0.5 };
  }
  // ——— CTA: Defne bir köşe küpünü yanağının yanına kaldırır ———
  let dKup = null;
  if (id === 'cta') {
    const w = W(t, tm.cta + 0.05, 0.45), hb = H.eklem('defne', dp, 'head'), g = H.elYeri('defne', dp, 'L', 'gogus');
    H.reach('defne', dp, 'L', [lerp(g[0], hb[0] - 118, w), lerp(g[1], hb[1] + 70, w)], 1, 'A'); dKup = w;
  }

  // ——— çizim: karakterler → tezgâh → tahta ve kaşar → eldekiler ———
  // kancada ve bahiste Necmi Defne'nin önünde durur (kısa boylu, yüzü saçın arkasında kalmasın); ipucunda yalnız Necmi
  let nec = null, h = null, d = null;
  const ciz = {
    n: () => { nec = oyna(K, t, tl, 'necmi', np, { heads }); },
    h: () => { h = oyna(K, t, tl, 'hikmet', hp, { heads }); },
    d: () => { H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof }); d = oyna(K, t, tl, 'defne', dp, { heads }); },
  };
  for (const k of id === 'ipucu' ? ['n'] : id === 'oda' || id === 'oda2' ? ['h', 'd', 'n'] : ['n', 'h', 'd']) ciz[k]();
  M.mekanCiz(K, OCK, 'on', t);
  tahta(K, PO, LW * 0.7);
  // tahtadaki parçalar (sayaçta çubuk Hikmet'in elinde)
  const parcalar = kasarAt(t, tm).filter(p => !(hCubuk && p.cubuk) && !(id === 'sayac' && p.ad === 'orta1'));
  kutular(K, PO, parcalar, { lw: LW * 0.62, izgara: 1 + 1.4 * H.nabiz(t, tm.h27, 0.5) });
  // tezgâhta yatan bıçak (sayaç ve sonrası) ve ödül tabağı
  if (id !== 'oda' && id !== 'oda2' && id !== 'ipucu') bicak2(K, P(PO, [-0.2, -0.3, 0.02]), -0.06, { L: 150, h: 30, ls: 70 });
  if (!hTabak && !eTabak) tabak(K, TABAK0, 0.9);
  if (kasarBicak) { const r = bicak3(K, PO, kasarBicak.O, kasarBicak.U, kasarBicak.V, { lw: LW * 0.62 }); void r; nec.tut('L'); }
  if (elBicak) {   // dik tutulan bıçak: tutuş noktası sapın ortası, ağız aşağıda
    const { p, a } = elBicak, c = Math.cos(a), s = Math.sin(a), L = 150, h = 30, ls = 70;
    bicak2(K, [p[0] - c * (L + ls * 0.6) - s * h * 0.52, p[1] - s * (L + ls * 0.6) + c * h * 0.52], a, { L, h, ls });
    if (elBicak.nTut) nec.tut('R'); if (elBicak.dTut) d.tut('L');
  }
  if (hIsaret) h.isaret('R', hIsaret);
  if (hTabak) { if (hTabak.u < 0.5) tabak(K, hTabak.p, 0.9); kolUst(K, 'hikmet', hp, 'R'); if (hTabak.u >= 0.5) { const e = h.handR; K.circ(e[0] + 4, e[1] - 52, 58, PAL.cream, LW * 0.8); K.circ(e[0] + 4, e[1] - 52, 38, '#EFE6D2', LW * 0.4); h.tut('R'); } }
  if (hCubuk) { const e = h.handR; kutu(K, PO, { ...CUBUK, off: kutuNokta(PO, CUBUK, [e[0] + 6, e[1] - 30]) }, { lw: LW * 0.62 }); h.tut('R'); }
  if (dParmak) d.parmak('L', dParmak, { toplam: 5 });
  if (lokum) lokumKutusu(K, t, lokum, nec, tm, id);
  if (eTabak) {
    tabak(K, eTabak.p, 1.15);
    const kup = { b: [1, 2, 1, 2, 1, 2] };
    kutu(K, PO, { ...kup, off: kutuNokta(PO, kup, [eTabak.p[0], eTabak.p[1] - 30]) }, { lw: LW * 0.62 });
    if (eTabak.nTut) nec.tut('L'); if (eTabak.hTut || id === 'cta') h.tut('R');
  }
  if (dKup != null) { const e = d.handL, kup = { b: [2, 3, 0, 1, 2, 3] }; kutu(K, PO, { ...kup, off: kutuNokta(PO, kup, [e[0] - 4, e[1] - 40]) }, { lw: LW * 0.62 }); d.tut('L'); }
  for (const f of ust) f();
}
// Lokum kutusu (Necmi'nin elinde, açık tepsi): 3 × 3 lokum, ortadaki kürdanla kalkar ve (1,1,1) ekseni çevresinde bir tur döner
const LO = mkP(1088, 1250, 64);
function lokumKutusu(K, t, L, nec, tm) {
  const o = LO, lw = LW * 0.6;   // açık tepsi kutu (kapaklı sürümde kapak Necmi'nin yüzünü örtüyordu)
  kutu(K, o, { b: [-0.15, 3.45, -0.15, 3.45, 0, 1.0], dis: true, izgara: 0, renk: () => '#D9603F' }, { lw });
  const ic = [P(o, [0, 0, 1.0]), P(o, [3.3, 0, 1.0]), P(o, [3.3, 3.3, 1.0]), P(o, [0, 3.3, 1.0])]; K.poly(ic, '#9C3A26', lw * 0.6);
  // lokumlar (iç tabanda, üstleri kutunun ağzına yakın)
  const list = [];
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
    if (x === 1 && y === 1) continue;
    list.push(lokumPc([x * 1.1 + 0.05, x * 1.1 + 1.05, y * 1.1 + 0.05, y * 1.1 + 1.05, 0.0, 0.98], [0, 0, 0]));
  }
  kirp(K, ic, () => kutular(K, o, list, { lw }));
  // ortadaki lokum
  const orta = lokumPc([1.15, 2.15, 1.15, 2.15, 0.0, 0.98], [0, 0, 0], D111, L.donus);
  orta.off = kutuNokta(o, orta, L.lp);
  if (L.lu < 0.3) kirp(K, ic, () => kutu(K, o, orta, { lw })); else kutu(K, o, orta, { lw });

  nec.tut('R');
  if (t > tm.n1 - 0.05) {   // kürdan: elden lokumun ortasına
    const { ctx } = K, a = L.kur, b = L.lp; ctx.save(); ctx.lineCap = 'round'; H.strokeLine(ctx, a, b, 8, INK); H.strokeLine(ctx, a, b, 3.6, '#E9D3A8'); ctx.restore();
    nec.tut('L');
  }
}
// pts çokgenine kırparak çizer (kutunun ağzı)
function kirp(K, pts, fn) {
  const { ctx } = K; ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip(); fn(); ctx.restore();
}

// ——— Defne'nin bıçağı (yakın 2): yatay kesim ve taşıma (z tipi) → havada döner → iki uzun sürtme (y tipi) ———
const bicPoz = (tip, O) => tip === 'z' ? { O, U: [0, 1, 0], V: [1, 0, 0], tip, L: BL } : { O, U: [1, 0, 0], V: [0, 0, 1], tip, L: BL_Y };
function karisBic(a, b, u) {
  const n = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  return { O: lerp3(a.O, b.O, u), U: n(lerp3(a.U, b.U, u)), V: n(lerp3(a.V, b.V, u)), tip: 'gecis', L: lerp(a.L, b.L, u) };
}
// Yatay kesim: bıçak yatay, ağzı arkaya bakar, sap sağda (tutan el kaşarın dışında, hep görünür). Önden girer, arkaya
// kadar keser, dilimin ortasına geri kayar, dilimi bıçağın üstünde taşır, sonra öne doğru çekilip çıkar.
function yatayBicak(t, { gir, a, b, tas, kon, z0, hedef, kalk }) {
  const yE = t < a ? lerp(-2.6, -0.55, W(t, gir, 0.35)) : t < b ? lerp(-0.55, 3.5, ease.state(seg(t, a, b - a))) : t < kon ? lerp(3.5, 2.0, W(t, b, 0.15)) : lerp(2.0, -1.9, W(t, kon + 0.04, 0.3));
  const off = tasiYol(t, tas, kon, hedef, kalk), dx = t < b ? 0 : off[0];
  return { O: [-0.4 + dx, yE, z0 + off[2] - 0.02], U: [1, 0, 0], V: [0, -1, 0], tip: 'z', L: BL, xl: dx, xr: 3 + dx };
}
function defneBicak(t, tm) {
  const zPoz = t => yatayBicak(t, { gir: tm.y2 + 0.15, a: tm.s2a, b: tm.s2b, tas: tm.tas2, kon: tm.kon2, z0: 1, hedef: SOL, kalk: 2.2 });
  const yPoz = t => {
    let xL, y, z;
    if (t < tm.c3b) { xL = supur(t, tm.c3a, tm.c3b, -1); y = 1; z = -0.04 + 2.2 * (1 - ease.state(seg(t, tm.c3a, SW_INIS))); }
    else if (t < tm.c4a) { const u = seg(t, tm.c3b, tm.c4a - tm.c3b); xL = SW[1]; y = 1 + ease.state(u); z = -0.04 + 1.3 * Math.sin(Math.PI * u); }
    else { const e = ease.state(seg(t, tm.c4b, 0.4)); xL = supur(t, tm.c4a, tm.c4b, 1) + 2 * e; y = 2; z = -0.04 + 2.4 * e; }
    return bicPoz('y', [xL, y, z]);
  };
  const g0 = tm.kon2 + 0.3;
  if (t < g0) return zPoz(t);
  if (t < tm.c3a) return karisBic(zPoz(g0), yPoz(tm.c3a), ease.state(seg(t, g0, tm.c3a - g0)));
  return yPoz(t);
}

// ——— yakın: tahta, kaşar, bıçak; kollar kadrajın kenarından ———
function yakinSahne(K, t, S, { heads, cam, sc }) {
  const { tm } = S, id = sc.id, o = PY;
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.hikmet = ekrandan(-40, 600); heads.necmi = ekrandan(540, -80); heads.defne = ekrandan(1120, 600);
  M.mekanCiz(K, YAK, 'arka', t);
  const parcalar = kasarAt(t, tm);
  // ——— bıçak ve kol ———
  let bic = null, kolKim = null, org = null;
  if (id === 'yakin1') {   // Necmi: z = 2'de yatay keser, dilimi bıçağın üstünde sağa taşır, bıçağı çeker
    bic = yatayBicak(t, { gir: tm.y1 + 0.1, a: tm.s1a, b: tm.s1b, tas: tm.tas1, kon: tm.kon1, z0: 2, hedef: SAG, kalk: 1.0 });
    kolKim = 'necmi'; org = [BX + 1300, 260];
  } else {
    if (t < tm.cikB + 0.45) { bic = defneBicak(t, tm); kolKim = 'defne'; org = [BX + 1500, 300]; }
  }
  // Hikmet: orta dilimin ortadaki çubuğunu kaldırır
  let cubuk = null;
  if (id === 'yakin2' && t >= tm.al - 0.3) {
    cubuk = { ...CUBUK, off: cubukOff(t, tm), ax: [0, 0, 1], ang: 0.18 * ease.enter(seg(t, tm.kalk, 0.42)) };
  }
  // ——— çizim ———
  const lw = LW * 0.9;
  kutular(K, o, parcalar.filter(p => !(cubuk && p.cubuk)), { lw });
  if (bic && bic.tip === 'z') {   // yatay bıçak: ağzın kaşarın solunda, sağında ve önünde kalan kısmı; sap ve el sağda
    const Ox = bic.O[0], cu = v => Math.max(0, Math.min(BL, v)), cv = v => Math.max(0, Math.min(BH, v)), a = cu(bic.xl - Ox), b = cu(bic.xr - Ox);
    const r = bicak3(K, o, bic.O, bic.U, bic.V, { lw, parca: [[0, a, 0, BH], [b, BL, 0, BH], [a, b, cv(bic.O[1]), BH]] });
    uzunKol(K, kolKim, org, r.tutus);
  }
  if (bic && bic.tip === 'y') {   // dikey bıçak: dilimlerin üstünde kalan kısmı (z > 1) ve sap; el sapta
    const zb = bic.O[2], v0 = Math.max(0, 1 - zb);
    const r = bicak3(K, o, bic.O, bic.U, bic.V, { lw, L: bic.L, parca: [[0, bic.L, Math.min(BH, v0), BH]] });
    uzunKol(K, kolKim, org, r.tutus);
  }
  if (bic && bic.tip === 'gecis') { const r = bicak3(K, o, bic.O, bic.U, bic.V, { lw, L: bic.L }); uzunKol(K, kolKim, org, r.tutus); }
  if (cubuk) {
    kutu(K, o, cubuk, { lw });
    const Wf = dunyaFn(cubuk), sp = (x, y, z) => P(o, Wf([x, y, z])), ekr = q => [540 + (q[0] - cam.cx) * cam.zoom, 960 + (q[1] - cam.cy) * cam.zoom];
    const yap = W(t, tm.yap, 0.2);
    if (yap > 0.01) { const { ctx } = K; ctx.save(); ctx.globalAlpha = yap; ctx.lineCap = 'round'; for (const x of [1, 2]) { H.strokeLine(ctx, sp(x, 1, 1), sp(x, 1, 2), 14, MERCAN); H.strokeLine(ctx, sp(x, 1, 2), sp(x, 2, 2), 14, MERCAN); } ctx.restore(); }
    if (t >= tm.gos) H.ring(K, sp(1.5, 1, 1.5), t, tm.gos, HARDAL);
    const q = ekr(sp(3, 1, 2)); S.yapisik = [q[0] + 70, q[1] - 60];
    const el = sp(1.5, 1.5, 2.05), w = W(t, tm.al - 0.28, 0.28);
    const H_ORG = [BX - 560, 1010], kolEl = [lerp(H_ORG[0] + 200, el[0], w), lerp(H_ORG[1], el[1] - 20, w)];
    uzunKol(K, 'hikmet', H_ORG, kolEl);
  } else S.yapisik = null;
  M.mekanCiz(K, YAK, 'isik', t);
}

// Açılan yüz: görünen yüz yarı saydam mercan dolgu + kalın çizgi; arkadaki yüz yalnız kesik mercan çizgi. Yeni açılan yüz bir kez kabarır.
function yuzIsaret(K, q, a, nb, arka) {
  const { ctx } = K; ctx.save();
  if (!arka) { ctx.globalAlpha = a * (0.32 + 0.3 * nb); K.poly(q, MERCAN, 0); }
  ctx.globalAlpha = a; ctx.beginPath(); q.forEach(([x, y], n) => (n ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
  if (arka) ctx.setLineDash([16, 10]); ctx.lineWidth = (arka ? 7 : 10) + 8 * nb; ctx.lineJoin = 'round'; ctx.strokeStyle = MERCAN; ctx.stroke(); ctx.restore();
}
// ——— kahraman an: kaşar yarı saydam, ortadaki küp hardal; her kesim bir yüz açar ———
function kahramanSahne(K, t, S, { heads, cam }) {
  const { tm } = S, o = PK, lw = LW * 1.05;
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.defne = ekrandan(1120, 700);
  M.mekanCiz(K, KAH, 'arka', t);
  const xr = ease.state(seg(t, tm.xr, 0.35)), list = [];
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) {
    const orta = x === 1 && y === 1 && z === 1;
    list.push({ b: [x, x + 1, y, y + 1, z, z + 1], off: kahramanOff(t, tm, [x, y, z]), orta, alpha: orta ? 1 : 1 - 0.8 * xr, izgara: 0, lw: orta ? null : LW * (1.05 - 0.5 * xr) });
  }
  const sirali = list.sort((a, b) => derin(b) - derin(a));
  const om = sirali.find(p => p.orta), oW = dunyaFn(om), sp = q => P(o, oW(q));
  // ortadaki küpün yüzleri: [eksen, işaret] → kesim sırası
  const YUZ = [[0, 1, 0], [0, -1, 1], [1, -1, 2], [1, 1, 3], [2, 1, 4], [2, -1, 5]];
  const yuzPts = (i, sg) => { const j = (i + 1) % 3, k = (i + 2) % 3, v = sg > 0 ? 2 : 1; const q = (a, c) => { const p = [0, 0, 0]; p[i] = v; p[j] = a; p[k] = c; return sp(p); }; return [q(1, 1), q(2, 1), q(2, 2), q(1, 2)]; };
  const acik = k => W(t, tm.kes[k] - 0.02, 0.12);
  const gizli = (i, sg) => { const n = [0, 0, 0]; n[i] = sg; return dot3(n, VD) >= 0; };
  for (const p of sirali) {
    if (p.orta) {
      // açılan yüzler küpten sonra: öndekiler dolgulu, arkadakiler kesik çizgi
      kutu(K, o, { ...p, alpha: xr > 0.01 ? 1 : 1, renk: () => xr > 0.01 ? H.mixHex(KAS_IC, HARDAL, xr) : KAS_IC, ...(xr > 0.5 ? { alpha: 0.94 } : {}) }, { lw });
      for (const [i, sg, k] of YUZ) if (acik(k) > 0.01) yuzIsaret(K, yuzPts(i, sg), acik(k), H.nabiz(t, tm.kes[k] + 0.02, 0.45), gizli(i, sg));
      // "altı yüzü": kenarlar hardal nabız
      if (xr > 0.5) { const nb = H.nabiz(t, tm.alt6, 0.5); if (nb > 0.01) { K.ctx.save(); K.ctx.globalAlpha = nb; for (const [i, sg] of YUZ) { const q = yuzPts(i, sg); K.ctx.beginPath(); q.forEach(([x, y], n) => (n ? K.ctx.lineTo(x, y) : K.ctx.moveTo(x, y))); K.ctx.closePath(); K.ctx.lineWidth = 12; K.ctx.strokeStyle = H.mixHex(HARDAL, '#FFFFFF', 0.3); K.ctx.stroke(); } K.ctx.restore(); } }
    } else kutu(K, o, p, { lw });
  }
  if (xr > 0.3) H.ring(K, sp([1.5, 1.5, 1.5]), t, tm.xr + 0.25, HARDAL);
  { let k = -1; for (let j = 0; j < 6; j++) if (t >= tm.kes[j] - 0.4 && t < tm.kes[j] + 0.55) k = j;
    if (k >= 0) { const [ax, c] = KES[k], a = ease.state(seg(t, tm.kes[k] - 0.4, 0.2)) * (1 - ease.state(seg(t, tm.kes[k] + 0.3, 0.25))), e0 = -G - 0.15, e1 = 3 + G + 0.15, zt = 3 + 2 * G + 0.15;
      const q = (u, v) => P(o, ax === 'x' ? [c, u, v] : ax === 'y' ? [u, c, v] : [u, v, c]);
      const pts = ax === 'z' ? [q(e0, e0), q(e1, e0), q(e1, e1), q(e0, e1)] : [q(e0, -0.05), q(e1, -0.05), q(e1, zt), q(e0, zt)];
      const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.2 * a; K.poly(pts, MERCAN, 0); ctx.globalAlpha = 0.85 * a; ctx.setLineDash([22, 14]); ctx.beginPath(); pts.forEach(([x, y], n) => (n ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.lineWidth = 6; ctx.strokeStyle = MERCAN; ctx.stroke(); ctx.restore(); } }
  // bıçak: her kesimde ilgili düzlemden geçer (yarı saydam sahnede tamamı görünür)
  const D_ORG = [CX + 1500, 520];
  let aktif = -1; for (let k = 0; k < 6; k++) if (t >= tm.kes[k] - 0.55) aktif = k;
  if (aktif >= 0) {
    const k = aktif, [ax, c] = KES[k], tc = tm.kes[k], u = seg(t, tc - 0.4, 0.4), geri = ease.state(seg(t, tc + 0.05, 0.3)), gel = 1 - ease.state(seg(t, tc - 0.55, 0.15));
    const ext = 3 + 2 * G, Lk = ext + 1.0;
    const off = kahramanOff(tc - 0.01, tm, [1, 1, 1]);   // düzlemin yeri: o anki ortadaki küp ve komşuları
    let O, U, V;
    if (ax === 'x') { const z = lerp(4.6, -0.1, ease.state(u)) + 3 * geri + 3 * gel; O = [c + off[0], -G - 0.5, z]; U = [0, 1, 0]; V = [0, 0, 1]; }
    else if (ax === 'y') { const z = lerp(4.6, -0.1, ease.state(u)) + 3 * geri + 3 * gel; O = [-G - 0.5, c + off[1], z]; U = [1, 0, 0]; V = [0, 0, 1]; }
    else { const zc = c + off[2] + (c === 1 ? 0 : 0); const x = lerp(ext + 0.2, -G - 1.2, ease.state(u)) + 4 * geri + 4 * gel; O = [x, -G - 0.5, zc]; U = [0, 1, 0]; V = [1, 0, 0]; }
    const r = bicak3(K, o, O, U, V, { lw, L: Lk, Hb: 0.9, Ls: 1.6, alpha: 0.92 });
    uzunKol(K, 'defne', D_ORG, r.tutus, null, 380);
  }
  M.mekanCiz(K, KAH, 'isik', t);
}
