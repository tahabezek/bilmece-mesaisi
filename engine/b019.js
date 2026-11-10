// Bölüm 19 · SON GELEN KAZANIR (v4 "hikâye" dili; yöntem engine/b128.js, ortak motor engine/hikaye.js + engine/mekan.js).
// Logline: Hikmet Bey otoparkta tuhaf bir yarış başlatır: arabası bitişe en son gelen kazanacak. İki araba çizgide
// rölantide bekler, ta ki megafondan tek bir cümle duyulana kadar.
// Akılda kalacak tek şey: başkasının arabasındaysan gaza basarsın.
// Sahneleme: yol eğik izdüşümle çizilir (uzak şerit yukarıda ve sağa kayık). Yakın şeritte hardal araba (kapısında NECMİ),
// uzak şeritte petrol rengi araba (kapısında KEREM). Arabalar üstü açık: sürücü göğüsten yukarı görünür, kapı izleyiciye
// doğru açılır (menteşe arkada), sürücü kapı boşluğundan iner ve biner. Dış mekân geniş olduğu için kadro 0,7 ölçekte
// çizilir; kapıdaki ad levhaları ekranda 44 px'in altına inmez.
// Storyboard'dan bilinçli sapmalar (rapora yazıldı):
//  · Megafonla bağıran, arabalara en yakın kişidir: d2'de Defne megafonu kapınca çizgi başına geçer, Hikmet sağa çekilir;
//    megafon ondan sonra hep Defne'de kalır (kesme arkasında elden ele ışınlanmasın).
//  · Sayaçta Necmi ön cam yerine kapısındaki adını parlatır: sayacın halkasının solunda görünür kalır ve "kendi arabası"nı kurar.
//  · "KURAL" tabelası direğinde döner: megafon direğe vurunca yüzünü gösterir (h2b), kupa planından önce yine yan döner.
// Her şey t'nin saf fonksiyonu; bütün anlar ses çizelgesinin kelime çapalarından gelir.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, kisi, oyna, POZ, IFADE, PAL, INK, LW, D2R } = H;

// ——— ölçek ve yerleşim (dünya pikseli) ———
const BS = { hikmet: 175, defne: 172, necmi: 158, genc: 163 };      // karakter ölçeği (iç mekân ölçeğinin 0,7'si)
const Q = BS.hikmet / 200;                                           // kişiye bağlı uzaklıkların katsayısı
const C = 0.78;                                                      // araba ölçeği (araba birimi → piksel)
const YF = 1335, YN = 1575, YG = 1700;                               // zemin çizgileri: uzak şerit, yakın şerit, yol kenarı (Hikmet, Defne)
const XN = 300, XF = 468, EG = (XF - XN) / (YN - YF);                // arabaların çizgideki yeri; EG: 1 px derinlik = EG px sağa
const PL = 865, PR = 1035, PR2 = 1060;                               // çizgi başı (megafonla bağıranın yeri), Defne'nin ilk yeri, Hikmet'in sonraki yeri
const SX = 735, TB = { w: 262, h: 250, y: 786 };                     // "KURAL" tabelası: direk x'i, levha
const CX = 655, CY = 1335;                                           // geniş kadrajın merkezi (yüzler ekranda x ≤ 960'ta kalır)
const YK = YF - 172, YOL0 = YK + 34, YOL1 = YN + 78;                 // uzak kaldırımın üstü, asfaltın üst ve alt kenarı
const CAR = { ak: 186, r: 56, kusak: -215, etek: -50, k0: -122, k1: 122, koltuk: [-62, -128], dir: [90, -240], kol: [94, -194], on: 272, arka: -268 };
const GERI = 46;                                                     // arabalar kare 0'da çizgide; ilk 2 sn'de bu kadar geri kaçarlar (XN, XF: kaçtıktan sonraki yer)
const XL = XN + CAR.on * C + GERI + 10;                              // start çizgisinin yakın şeritteki x'i
const XR = 1640, KUPA = [1495, YG - 6];                              // bitiş çizgisi (yakın şeritte), kupa sehpası
const KN = [XR + EG * (YN - YOL1 - 14), YOL1 + 14], KF = [XR + EG * (YN - YOL0 + 12), YOL0 - 12], KH = 128;   // kurdele direkleri (taban) ve boyu
const CIK = [22, 48];                                                // arabadan inenin durduğu yer (araba ortasına göre)
const VW = 2550, TA = 0.3;                                           // kalkış: TA sn'de VW px/sn'ye çıkar (ekranda ≈ 2400 px/sn)
const TS = 47;                                                       // mekân içi yazı (0,95 zoom'da ekranda ≥ 44 px)
const MK = 0.95;                                                     // megafon ölçeği
const MY = Math.PI + 0.32;                                           // megafon ağızdayken baktığı yön (sola, 18° yukarı)
const NYOL = [[XN - 100, YN + CIK[1]], [XN + 262, YN + 32], [XN + 400, YN - 75], [XF + 136, YF + 42]];   // Necmi'nin sayaçtaki yolu: kendi kapısından Kerem'in kapısına
const DALGIN = { brow: 0.05, browTilt: -0.05, eye: 0.8, pupil: 1, curve: 0.3, open: 0, w: 0.9 };
const ESNEME = { brow: 0.06, browTilt: 0.1, eye: 0.12, pupil: 1, curve: 0, open: 0.95, w: 0.62, round: true };

// ——— küçük yardımcılar ———
const EX = n => (typeof n === 'string' ? H.EXPR[n] : n);
// İfade izi: [[t, ad | ifade]…]; her anahtar 0,22 sn'de öncekine karışır
function ifade(keys, t, d = 0.22) {
  let e = { ...EX(keys[0][1]) };
  for (const [tk, n] of keys) {
    if (tk > t) break;
    const b = EX(n), u = ease.state(seg(t, tk, d)), o = {};
    for (const k of Object.keys(H.EXPR.notr)) o[k] = lerp(e[k] ?? H.EXPR.notr[k], b[k] ?? H.EXPR.notr[k], u);
    o.smileEyes = u < 0.5 ? e.smileEyes : b.smileEyes; o.round = u < 0.5 ? e.round : b.round; e = o;
  }
  return e;
}
const konusuyor = (tl, id, t, i0 = 0) => { const l = tl.L[id]; return t >= l.words[i0].t0 - 0.03 && t <= l.t1; };
// Ağzın yeri (yandan görünüş): megafonun ağızlığı buraya gelir
function agizYeri(key, p) { const c = H.CARDS[key], h = H.eklem(key, p, 'head'); return [h[0] + (p.facing || 1) * 0.86 * (c.head.w / 2 * 1.05) * p.s, h[1] + 0.33 * p.s]; }
// Çok parçalı yürüyüş (yandan): pts köşeleri; adım fazı toplam yola kilitli (H.yuru), yüz her parçanın yönüne döner
function yolda(key, t, pts, t0, t1, poz = {}) {
  const L = []; let top = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); top += d; }
  const p = H.yuru(key, t, { t0, t1, x0: 0, x1: top, s: BS[key], poz });
  let d = p.x, i = 0; while (i < L.length - 1 && d > L[i]) d -= L[i++];
  const u = L[i] ? Math.min(1, d / L[i]) : 0, a = pts[i], b = pts[i + 1];
  p.x = lerp(a[0], b[0], u); p.y = lerp(a[1], b[1], u); p.facing = b[0] >= a[0] ? 1 : -1;
  return p;
}

// ═══════════════════════════ nesneler ═══════════════════════════
// ——— megafon: el kabzada; yon = koninin baktığı yön (radyan; 0 sağ, π sol, −π/2 yukarı). on: 0 yandan … 1 kameraya dönük ———
function megDonusum(yon) { const f = Math.cos(yon) < 0 ? -1 : 1; return [f, f > 0 ? yon : Math.PI - yon]; }
function megYer(el, yon) {   // ağızlığın ve zil ağzının dünya konumu
  const [f, a] = megDonusum(yon), c = Math.cos(a), s = Math.sin(a), W = ([x, y]) => [el[0] + f * (x * c - y * s) * MK, el[1] + (x * s + y * c) * MK];
  return { agiz: W([-58, -46]), zil: W([88, -46]) };
}
const megEl = (agiz, yon) => { const g = megYer([0, 0], yon); return [agiz[0] - g.agiz[0], agiz[1] - g.agiz[1]]; };   // ağızlık `agiz`dayken elin yeri
function megafon(K, el, yon, on = 0) {
  const { ctx } = K, [f, a] = megDonusum(yon), q = 1 - on;
  ctx.save(); ctx.translate(el[0], el[1]); ctx.scale(f * MK, MK); ctx.rotate(a * q);
  K.rect(-10, -36, 20, 52, '#5D6A61', LW / MK, 8);                                                    // kabza
  if (q > 0.05) {
    K.poly([[-42 * q, -58], [-42 * q, -34], [80 * q, -2], [80 * q, -90]], PAL.coral, LW / MK);          // koni
    K.poly([[14 * q, -67], [30 * q, -71], [30 * q, -21], [14 * q, -25]], PAL.cream, 0);                 // bant
    K.rect(-58 * q, -61, 18 * q, 30, INK, 0, 5);                                                        // ağızlık
  }
  const rx = lerp(10, 50, on);
  K.ell(82 * q, -46, rx, 50, PAL.cream, LW / MK);                                                       // zil ağzı
  if (on > 0.3) { K.ell(82 * q, -46, rx * 0.74, 37, PAL.coral, LW * 0.8 / MK); K.ell(82 * q, -46, rx * 0.34, 17, '#7A2E1C', LW * 0.7 / MK); }
  ctx.restore();
}
// Megafondan çıkan ses yayları (sürekli akar; a = görünürlük)
function sesYayi(K, zil, yon, t, a = 1, ac = 0.55) {
  if (a <= 0.02) return; const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const u = ((t * 2.3 + i / 3) % 1 + 1) % 1;
    ctx.globalAlpha = a * Math.min(1, 2.4 * (1 - u)); ctx.beginPath(); ctx.arc(zil[0], zil[1], 34 + 84 * u, yon - ac, yon + ac);
    ctx.lineWidth = 17 - 3 * u; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8 - 2 * u; ctx.strokeStyle = PAL.cream; ctx.stroke();   // krem yay, mürekkep kenar: arabanın önünde de seçilir
  }
  ctx.restore();
}
// ——— damalı bayrak: el = sapın tutulduğu yer, aci = sapın dikeyden açısı (− sola yatar), yon = kumaşın yanı ———
function bayrak(K, el, aci, t, yon = -1) {
  const { ctx } = K, W = 132, Hh = 92, nx = 4, ny = 3;
  const P = (i, j) => { const u = i / nx; return [yon * (6 + W * u), -212 + Hh * j / ny + 10 * u * Math.sin(u * 5.2 - t * 7.5 + j * 0.55)]; };
  ctx.save(); ctx.translate(el[0], el[1]); ctx.rotate(aci); ctx.scale(0.88, 0.88);
  K.rect(-6, -218, 12, 262, PAL.woodDark, LW * 0.8, 5);
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) K.poly([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], (i + j) % 2 ? INK : PAL.paper, 0);
  const kenar = []; for (let i = 0; i <= nx; i++) kenar.push(P(i, 0)); for (let i = nx; i >= 0; i--) kenar.push(P(i, ny));
  K.poly(kenar, null, LW * 0.8);
  ctx.restore();
}
// ——— "KURAL" tabelası: direğinde döner. u = 0 yan duruyor (ince), 1 yüzü dönük; sars: vuruş titremesi ———
function tabela(K, u, sars) {
  const { ctx } = K, { w, h, y } = TB, s = Math.max(0.06, u), ww = w * s;
  K.rect(SX - 9, y + h - 12, 18, YOL0 - 6 - (y + h - 12), PAL.woodDark, LW, 4);
  ctx.save(); ctx.translate(SX, y + h); ctx.rotate(sars * 0.045); ctx.translate(-SX, -(y + h));
  K.rect(SX - ww / 2 + 7 * s, y + 9, ww, h, INK, 0, Math.min(14, ww / 2)); K.rect(SX - ww / 2, y, ww, h, u < 0.12 ? PAL.woodTop : PAL.cream, LW, Math.min(14, ww / 2));
  if (u > 0.3) {
    ctx.save(); ctx.translate(SX, 0); ctx.scale(s, 1); ctx.globalAlpha = clamp01((u - 0.3) / 0.35);
    K.rect(-w / 2 + 14, y + 14, w - 28, 62, PAL.mustard, LW * 0.7, 10); K.text(K.up('kural'), 0, y + 14 + 47, 48, INK, 900);
    ['Arabası', 'son gelen', 'kazanır.'].forEach((s2, i) => K.text(s2, 0, y + 126 + i * 52, TS, INK, 800));
    ctx.restore();
  }
  ctx.restore();
}
// ——— kupa ve sehpası: (x, y) sehpanın tabanı; n = kabarma (0..1), sal = sallanma (−1..1) ———
function kupa(K, [x, y], n = 0, sal = 0) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sal * 0.06);
  K.rect(-34, -128, 68, 128, PAL.woodTop, LW, 6); K.rect(-50, -144, 100, 22, PAL.wood, LW, 6);
  ctx.translate(0, -144); ctx.rotate(sal * 0.08); ctx.scale(1 + 0.2 * n, 1 + 0.2 * n);
  K.rect(-30, -18, 60, 18, PAL.woodDark, LW, 4); K.rect(-9, -46, 18, 30, PAL.mustard, LW);
  ctx.lineCap = 'round';
  for (const m of [-1, 1]) for (const [lw, col] of [[17, INK], [6, '#E2B13C']]) { ctx.beginPath(); ctx.arc(m * 47, -92, 21, m > 0 ? -Math.PI * 0.5 : Math.PI * 0.5, m > 0 ? Math.PI * 0.5 : Math.PI * 1.5); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-48, -124); ctx.lineTo(48, -124); ctx.quadraticCurveTo(46, -54, 0, -44); ctx.quadraticCurveTo(-46, -54, -48, -124); ctx.closePath(); K.fs(PAL.mustard, LW);
  K.rect(-55, -134, 110, 16, '#E2B13C', LW, 7); K.line(-24, -108, -24, -78, 8, '#F6E3BC');
  if (n > 0.05) { ctx.globalAlpha = Math.min(1, n * 1.5); for (const a of [-2.2, -1.57, -0.94]) K.line(Math.cos(a) * 86, -96 + Math.sin(a) * 86, Math.cos(a) * (104 + 22 * n), -96 + Math.sin(a) * (104 + 22 * n), 9, PAL.cream); }   // parıltı çizgileri
  ctx.restore();
}
// ——— yolu enine kesen damalı şerit (start ve bitiş çizgisi): x0 = yakın şeritteki x'i ———
function damaSerit(K, x0) {
  const n = 13, dy = (YOL1 - YOL0) / n, X = y => x0 + EG * (YN - y), w = 24;
  for (let j = 0; j < n; j++) for (let i = 0; i < 2; i++) { const y0 = YOL0 + j * dy, y1 = y0 + dy; K.poly([[X(y0) + (i - 1) * w, y0], [X(y0) + i * w, y0], [X(y1) + i * w, y1], [X(y1) + (i - 1) * w, y1]], (i + j) % 2 ? INK : PAL.paper, 0); }
  K.poly([[X(YOL0) - w, YOL0], [X(YOL0) + w, YOL0], [X(YOL1) + w, YOL1], [X(YOL1) - w, YOL1]], null, LW * 0.7);
}
function bitisTaki(K) {   // uzak kaldırımda iki direk arasında "BİTİŞ" pankartı
  const x0 = 1570, x1 = 1850, yT = 882, n = 12, w = (x1 - x0 - 22) / n;
  for (const x of [x0, x1]) K.rect(x - 11, yT, 22, YK - 40 - yT, PAL.woodDark, LW, 5);
  K.rect(x0 + 11, yT + 10, x1 - x0 - 22, 142, PAL.cream, 0);
  for (let i = 0; i < n; i++) { K.rect(x0 + 11 + i * w, yT + 10, w, 20, i % 2 ? INK : PAL.paper, 0); K.rect(x0 + 11 + i * w, yT + 132, w, 20, i % 2 ? PAL.paper : INK, 0); }
  K.rect(x0 + 11, yT + 10, x1 - x0 - 22, 142, null, LW, 4);
  K.text(K.up('bitiş'), (x0 + x1) / 2, yT + 108, 78, INK, 900);
}
function kurdeleDirek(K, [x, y]) {
  K.rect(x - 9, y - KH, 18, KH, PAL.cream, 0, 5); for (let i = 0; i < 3; i++) K.rect(x - 9, y - KH + 14 + i * 38, 18, 18, PAL.coral, 0);
  K.rect(x - 9, y - KH, 18, KH, null, LW, 5); K.circ(x, y - KH, 13, PAL.mustard, LW * 0.8);
}
// Bitiş kurdelesi: tKop anında uzak şeritteki noktasından kopar; iki ucu arabaların gittiği yöne (sağa) savrulur
const KOP = (YOL1 + 14 - YF) / (YOL1 - YOL0 + 26);   // kurdelenin uzak şeride denk gelen noktası (0 yakın direk … 1 uzak direk)
function kurdele(K, t, tKop = 1e9) {
  const { ctx } = K, a = [KN[0], KN[1] - KH], b = [KF[0], KF[1] - KH];
  const serit = pts => { for (const [lw, col] of [[21, INK], [11, PAL.coral]]) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); } };
  if (t < tKop) return serit([a, b]);
  const m = H.along([a, b], KOP), u = ease.enter(seg(t, tKop, 0.35)), r = t - tKop;
  for (const [p, f] of [[a, 0], [b, 1.7]]) {
    const L = Math.hypot(m[0] - p[0], m[1] - p[1]), uc = [lerp(m[0], p[0] + L * 0.86, u), lerp(m[1], p[1] + L * 0.32 + 14 * Math.sin(r * 11 + f), u)], pts = [];
    for (let i = 0; i <= 8; i++) { const v = i / 8; pts.push([lerp(p[0], uc[0], v), lerp(p[1], uc[1], v) + (Math.sin(v * 6.5 - r * 13 + f) * 13 * v + 26 * Math.sin(Math.PI * v)) * u]); }
    serit(pts);
  }
}
// Toz bulutu (tek seferlik): t0'da (x, y)'den `yon` yanına doğru açılır, yükselip dağılır. Tohumlu; kareden kareye aynı.
function tozPat(K, x, y, t, t0, { n = 7, tohum = 3, sure = 1.1, yay = 240, k = 1, yon = -1 } = {}) {
  if (t < t0 || t > t0 + sure * 1.7) return; const { ctx } = K, rnd = H.mulberry32(tohum);
  ctx.save();
  for (let i = 0; i < n; i++) {
    const a = rnd(), b = rnd(), d = sure * (0.7 + 0.8 * rnd()), rr = rnd(), u = seg(t, t0 + i * 0.025, d);
    if (u <= 0 || u >= 1) continue;
    const e = ease.enter(u); ctx.globalAlpha = 0.92 * (1 - u) ** 1.3;
    K.circ(x + yon * yay * (0.15 + 0.85 * a) * e, y - 16 - 110 * b * e, (20 + 46 * rr) * k * (0.45 + 0.55 * e), '#D8D2C6', LW * 0.55);
  }
  ctx.restore();
}

/// Jant kapağı: kalkışta yakın arabanın arka tekerinden fırlar (havada döner); espri planında çizgiden sağa yuvarlanır,
// Hikmet'in yanında yavaşlayıp yere yatar
function jant(K, t, tm) {
  const { ctx } = K, r = 34, t0 = tm.tL + 0.1; let x, y, aci, yat = 0;
  if (t < t0 || (t >= tm.tK && t < tm.tE)) return;
  if (t < tm.tK) { const p = H.yay([XN - CAR.ak * C, YN - CAR.r * C], [XN + 190, YN - 18 - r], seg(t, t0, 0.62), 240); x = p[0]; y = p[1]; aci = (t - t0) * 15; }
  else { const u = seg(t, tm.tE + 0.05, 1.65), x0 = 560; x = lerp(x0, PR2 + 172, 1 - (1 - u) ** 2); yat = ease.state(seg(t, tm.tE + 1.6, 0.4)); y = YN - 18 - r * (1 - 0.8 * yat); aci = (x - x0) / r; }
  ctx.save(); ctx.translate(x, y); ctx.scale(1, 1 - 0.64 * yat); ctx.rotate(aci);
  K.circ(0, 0, r, PAL.metal, LW); for (let i = 0; i < 5; i++) { const a = i * Math.PI * 0.4; K.line(Math.cos(a) * 10, Math.sin(a) * 10, Math.cos(a) * 26, Math.sin(a) * 26, 6, INK); } K.circ(0, 0, 9, PAL.cream, LW * 0.6);
  ctx.restore();
}
// ——— araba (yandan, sağa bakar; birimler CAR ölçeğinde, zemin ortası (0, 0)) ———
function govdeYolu(ctx) {
  ctx.moveTo(-260, CAR.etek); ctx.lineTo(-268, -130); ctx.quadraticCurveTo(-270, -222, -232, -228);
  ctx.lineTo(-134, -236); ctx.lineTo(CAR.k0, CAR.kusak); ctx.lineTo(CAR.k1, CAR.kusak); ctx.lineTo(134, -234); ctx.lineTo(228, -214);
  ctx.quadraticCurveTo(273, -204, 273, -148); ctx.lineTo(268, CAR.etek); ctx.closePath();
}
const arabaDon = (K, c) => { const { ctx } = K; ctx.save(); ctx.translate(c.x, c.y + (c.tit || 0)); ctx.rotate((c.egim || 0) * D2R); ctx.scale(C, C); };
function plaka(K, c, lw) {   // kapıdaki ad levhası (kimin arabası): nabız = vurgu
  const { ctx } = K, fs = TS / C;
  ctx.save(); ctx.translate(0, -124); ctx.scale(1 + 0.16 * (c.nabiz || 0), 1 + 0.16 * (c.nabiz || 0));
  K.rect(-114, -40, 228, 80, PAL.cream, lw, 13); K.text(K.up(c.ad), 0, fs * 0.36, fs, INK, 900);
  ctx.restore();
}
// Arabanın arkada kalan kısmı: iç boşluk, koltuk, direksiyon. Sürücü bundan SONRA, arabaOn'dan ÖNCE çizilir.
function arabaArka(K, c) {
  const lw = LW / C; arabaDon(K, c);
  K.rect(CAR.k0, CAR.kusak - 6, CAR.k1 - CAR.k0, CAR.etek - CAR.kusak + 6, '#4A3B30', 0);
  K.rect(CAR.k0 - 8, CAR.kusak - 18, CAR.k1 - CAR.k0 + 16, 20, c.golge, lw * 0.8, 7);                   // öteki yanın üst kenarı
  K.poly([[-146, -138], [-96, -138], [-104, -326], [-140, -330]], '#7A5A3C', lw); K.rect(-150, -380, 44, 60, '#7A5A3C', lw, 15);   // sırtlık ve başlık
  K.rect(-136, -144, 150, 24, '#6B4E33', lw * 0.8, 9);                                                   // minder
  K.line(128, -222, CAR.dir[0] + 8, CAR.dir[1] + 6, 15, INK); K.line(128, -222, CAR.dir[0] + 8, CAR.dir[1] + 6, 7, PAL.metal);   // direksiyon mili
  K.ctx.save(); K.ctx.translate(CAR.dir[0], CAR.dir[1]); K.ctx.rotate(-0.38); K.ell(0, 0, 11, 40, '#3A3F3C', lw); K.ctx.restore();
  K.ctx.restore();
}
function teker(K, x, y, r, aci, lw) {
  K.circ(x, y, r, '#3A3F3C', lw); K.circ(x, y, r * 0.52, PAL.metal, lw * 0.8);
  for (let i = 0; i < 5; i++) { const a = aci + i * Math.PI * 0.4; K.line(x + Math.cos(a) * r * 0.16, y + Math.sin(a) * r * 0.16, x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, lw * 0.9, INK); }
  K.circ(x, y, r * 0.13, PAL.cream, lw * 0.6);
}
// Arabanın izleyiciye bakan yanı: gövde (kapı açıksa boşluğu delik), tekerler, cam, farlar. c.kapi 0..1.
function arabaOn(K, c) {
  const { ctx } = K, lw = LW / C, a = clamp01(c.kapi || 0) * 72 * D2R, kw = CAR.k1 - CAR.k0, xa = CAR.k0 + kw * Math.cos(a), rk = CAR.r + 20;
  const yol = () => { ctx.beginPath(); govdeYolu(ctx); if (a > 0.02) { ctx.moveTo(xa, CAR.kusak); ctx.lineTo(xa, CAR.etek - 2); ctx.lineTo(CAR.k1, CAR.etek - 2); ctx.lineTo(CAR.k1, CAR.kusak); ctx.closePath(); } };
  arabaDon(K, c);
  const cam = [[136, -230], [180, -224], [126, -404], [110, -400]];                                       // ön cam: yarı saydam (arkasındaki yüz seçilir), çerçevesi mürekkep
  ctx.save(); ctx.globalAlpha = 0.5; K.poly(cam, '#CFE3DD', 0); ctx.restore(); K.poly(cam, null, lw);
  K.line(150, -236, 122, -386, 5, "#F7FBFA");
  K.rect(-286, -72, 26, 14, PAL.metalDark, lw * 0.8, 5);                                                 // egzoz borusu
  K.rect(-246, -266, 114, 44, '#4A3B30', lw, 18);                                                        // katlanmış tente
  yol(); ctx.fillStyle = c.renk; ctx.fill('evenodd');
  ctx.save(); yol(); ctx.clip('evenodd');
  ctx.fillStyle = c.golge; ctx.fillRect(-300, -96, 600, 60);
  for (const wx of [-CAR.ak, CAR.ak]) { ctx.beginPath(); ctx.arc(wx, -CAR.r - 2, rk, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fillStyle = '#26302B'; ctx.fill(); }
  ctx.restore();
  yol(); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  for (const wx of [-CAR.ak, CAR.ak]) { ctx.beginPath(); ctx.arc(wx, -CAR.r - 2, rk, Math.PI, Math.PI * 2); ctx.lineWidth = lw; ctx.stroke(); teker(K, wx, -CAR.r, CAR.r, c.aci || 0, lw); }
  K.line(-254, -154, CAR.k0 - 8, -154, 4, c.golge); K.line(CAR.k1 + 8, -154, 258, -154, 4, c.golge);   // kuşak çizgisi
  if (a <= 0.02) {   // kapalı kapı: dikişler, kol, ad levhası
    K.line(CAR.k0, CAR.kusak, CAR.k0, CAR.etek - 6, lw * 0.7); K.line(CAR.k1, CAR.kusak, CAR.k1, CAR.etek - 6, lw * 0.7);
    K.rect(CAR.kol[0] - 18, CAR.kol[1] - 8, 36, 16, PAL.metal, lw * 0.7, 8); plaka(K, c, lw);
  }
  K.rect(256, -96, 28, 26, PAL.cream, lw * 0.8, 10); K.rect(-282, -100, 26, 26, PAL.cream, lw * 0.8, 10);   // tamponlar
  K.ell(265, -166, 9, 22, '#FBF6EC', lw * 0.8); K.rect(-273, -198, 12, 40, c.fren ? '#FF7A52' : PAL.red, lw * 0.7, 5);   // far, stop
  K.ell(202, -196, 16, 9, c.sinyal ? '#FFB02E' : '#B9772A', lw * 0.7);                                   // sinyal lambası
  ctx.restore();
}
// Açık kapı kanadı (menteşe arkada, ön kenarı izleyiciye savrulur): en önde çizilir
function arabaKapi(K, c) {
  const a = clamp01(c.kapi || 0) * 72 * D2R; if (a <= 0.02) return;
  const { ctx } = K, lw = LW / C, kw = CAR.k1 - CAR.k0, cs = Math.cos(a), sn = Math.sin(a), xa = CAR.k0 + kw * cs;
  arabaDon(K, c);
  K.poly([[CAR.k0, CAR.kusak], [xa, CAR.kusak - 16 * sn], [xa, CAR.etek + 22 * sn], [CAR.k0, CAR.etek - 2]], H.mixHex(c.renk, c.golge, 0.7 * sn), lw);
  ctx.save(); ctx.translate(CAR.k0, 6 * sn); ctx.scale(cs, 1 + 0.1 * sn); ctx.translate(-CAR.k0, 0);
  if (cs > 0.45) plaka(K, c, lw);
  K.rect(CAR.kol[0] - 18, CAR.kol[1] - 8, 36, 16, PAL.metal, lw * 0.7, 8);
  ctx.restore(); ctx.restore();
}
const kolYeri = c => { const cs = Math.cos(clamp01(c.kapi || 0) * 72 * D2R); return [c.x + (CAR.k0 + (CAR.kol[0] - CAR.k0) * cs) * C, c.y + CAR.kol[1] * C]; };   // kapı kolu (dünya)
const dirYeri = (c, alt) => [c.x + (CAR.dir[0] + (alt ? 12 : -12)) * C, c.y + (CAR.dir[1] + (alt ? 30 : -34)) * C + (c.tit || 0)];   // direksiyonda el yeri
const levhaYeri = c => [c.x, c.y - 124 * C];
// Arabanın içindeki karakter eteğin altına taşmasın
function icKirp(K, c, fn) { const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.rect(c.x - 340 * C, c.y - 1600, 680 * C, 1600 + CAR.etek * C); ctx.clip(); fn(); ctx.restore(); }
// Egzoz pufları: gaza basılınca sıklaşır (faz, gaz süresinin integrali: sıçrama olmaz)
function egzoz(K, c, t, tm) {
  const { ctx } = K, hizli = Math.max(0, Math.min(t, tm.hd) - (tm.atil - 0.25)) + Math.max(0, t - (tm.d5 - 0.1));
  const faz = t / 0.95 + hizli * (1 / 0.34 - 1 / 0.95) + (c.uzak ? 0.4 : 0), k = c.gaz ? 0.95 : 0.72, x = c.x + (CAR.arka - 22) * C, y = c.y - 64 * C;
  ctx.save();
  for (let j = 0; j < 3; j++) { const u = ((faz + j / 3) % 1 + 1) % 1, e = ease.enter(u); ctx.globalAlpha = 0.9 * (1 - u); K.circ(x - 105 * k * e, y - 42 * k * u * u, (9 + 20 * e) * k, '#D8D2C6', LW * 0.55); }
  ctx.restore();
}
function hizCizgi(K, c) {
  if (c.v < 500) return; const { ctx } = K, L = Math.min(280, c.v * 0.1), x = c.x + CAR.arka * C - 16;
  ctx.save(); ctx.globalAlpha = 0.85; for (const [dy, k] of [[-170, 1], [-118, 0.66], [-66, 0.88]]) K.line(x, c.y + dy * C, x - L * k, c.y + dy * C, 8, PAL.cream); ctx.restore();
}
// Arabanın çizgiye göre kayması. Kare 0'da ikisi de çizgide; ilk 2 sn'de sırayla geri kaçarlar (kimse önde kalmak istemez):
// yakın 20 px, uzak 34 px, yakın 26 px daha, uzak 12 px daha. Yanlış denemede 50 px atılır, sürünür, frenler, geri kayar → kalkış
const KAC = [[[0.1, 20, 0.4], [1.3, 26, 0.45]], [[0.4, 34, 0.45], [1.75, 12, 0.35]]];   // [yakın, uzak]: [an, px, süre]
function arabaX(t, tm, g = 0) {
  let x = GERI; for (const [a, px, d] of KAC[g ? 1 : 0]) x -= px * ease.state(seg(t, a, d));
  x += 50 * ease.enter(seg(t, tm.atil + g * 0.3, 0.34)) + 18 * seg(t, tm.atil + 0.34, tm.hd - tm.atil - 0.34);
  x -= 68 * ease.state(seg(t, tm.geriKay + g * 0.5, 0.75));
  const tau = t - tm.tL - g * 0.15; if (tau > 0) x += tau < TA ? VW * tau * tau / (2 * TA) : VW * (tau - TA / 2);
  return x;
}
function araba(t, tm, uzak) {
  const g = uzak ? 0.14 : 0, dx = arabaX(t, tm, g), gaz = (t >= tm.atil - 0.25 && t < tm.hd) || t >= tm.d5 - 0.1;
  return {
    uzak, x: (uzak ? XF : XN) + dx, y: uzak ? YF : YN, renk: uzak ? PAL.teal : PAL.mustard, golge: uzak ? '#25655F' : '#AE7D20', ad: uzak ? 'Kerem' : 'Necmi',
    aci: dx / (CAR.r * C), v: (dx - arabaX(t - 1 / 60, tm, g)) * 60, gaz, tit: (gaz ? 2.4 : 1) * Math.sin(t * (gaz ? 120 : 75) + (uzak ? 1.3 : 0)),
    egim: -2.2 * H.nabiz(t, tm.atil, 0.42) + 2.6 * H.nabiz(t, tm.hd, 0.45) - 3.2 * ease.enter(seg(t, tm.tL, 0.14)) * (1 - seg(t, tm.tL + 0.25, 0.4)),
    fren: KAC[uzak ? 1 : 0].some(([a, , d]) => t >= a - 0.03 && t < a + d + 0.12) || (t >= tm.hd - 0.02 && t < tm.geriKay + 0.9), kapi: 0, nabiz: 0, sinyal: false,
  };
}

// ——— sürücü: u = 0 koltukta (yandan, sağa dönük) … 1 arabanın önünde ayakta. Kalça koltuktan iniş yerine taşınır. ———
function binis(key, c, u, o = {}) {
  const s = BS[key], st = H.CARDS[key].stance?.knee || 0, e = ease.state(clamp01(u));
  const p = kisi(key, {
    s, view: 'side', facing: 1, lean: lerp(o.lean ?? 5, 0, e), expr: o.expr || 'notr', head: { tilt: lerp(o.tilt ?? 0, 0, e), look: [0, 0] },
    legL: { hip: lerp(72, st * 0.5, e), knee: lerp(56, st, e) }, legR: { hip: lerp(80, st * 0.5, e), knee: lerp(62, st, e) },
    armL: { sh: lerp(40, -4, e), el: lerp(50, 8, e) }, armR: { sh: lerp(44, 6, e), el: lerp(52, 10, e) },
  });
  const pel = H.eklem(key, { ...p, x: 0, y: 0 }, 'pelvis'), ayak = H.eklem(key, kisi(key, { s, view: 'side', x: 0, y: 0 }), 'pelvis');
  p.x = lerp(c.x + CAR.koltuk[0] * C, c.x + CIK[0], e) - pel[0];
  p.y = lerp(c.y + CAR.koltuk[1] * C + (c.tit || 0), c.y + CIK[1] + ayak[1], e) - pel[1];
  return p;
}
// Koltukta önden görünüş (camdan bakan sürücü): kalça koltukta, bacaklar gövdenin arkasında kalır
function koltuktaOnden(key, c, o = {}) {
  const p = kisi(key, { s: BS[key], x: 0, y: 0, ...POZ.dur, ...o }), pel = H.eklem(key, p, 'pelvis');
  p.x = c.x + (CAR.koltuk[0] + 14) * C; p.y = c.y + CAR.koltuk[1] * C + (c.tit || 0) - pel[1];
  return p;
}

// ═══════════════════════════ mekân: şirket otoparkı ═══════════════════════════
M.mekanEkle('b019_otopark', {
  gen: [-700, 3100], zemin: YG,
  dongu: ['egzoz pufları', 'damalı bayrağın dalgası'],
  capa: { yakinKapi: [XN + CIK[0], YN + CIK[1]], uzakKapi: [XF + CIK[0], YF + CIK[1]], cizgi: [XL, YN], tabela: [SX, TB.y + TB.h], kupa: KUPA, bitis: [XR, YN] },
  kadraj: { genis: [0.95, CX, CY], gosterir: [1.1, 444, 1305], arabalar: [1.2, 330, 1272], tabela: [1.0, 740, 1232], kupa: [0.96, 1320, CY], sayac: [1.0, 600, CY + 8], bitis: [1.0, 1740, CY - 10] },
  arka(K, t, { durum: d }) {
    const { ctx } = K, x0 = -700, x1 = 3100;
    M.acikHava(K, { x0, x1, floorY: YOL0, zemin: 'asfalt', gunes: null, t });
    K.rect(x0, YOL0 + 880, x1 - x0, 700, '#5D6A61', 0);   // asfalt kadrajın altına kadar sürer
    // şirket binası (cephe), kaldırım
    K.rect(x0, 560, 1330 - x0, YK - 46 - 560, '#EFE6D2', LW); K.rect(x0, YK - 150, 1330 - x0, 104, '#DDD0B6', 0); K.line(x0, YK - 150, 1330, YK - 150, 4, '#C9BFA9');
    K.rect(96, 800, 170, 178, PAL.wall, LW, 6); K.line(181, 800, 181, 978, LW * 0.7); K.rect(84, 978, 194, 18, PAL.trim, LW * 0.8, 4);
    K.rect(1318, 546, 26, YK - 46 - 546, '#DDD0B6', LW);
    K.rect(x0, YK - 46, x1 - x0, 46, '#CFC6B4', 0); K.line(x0, YK - 46, x1, YK - 46, LW * 0.7); K.rect(x0, YK, x1 - x0, 34, '#BDB4A2', LW * 0.8);
    // yol çizgileri: şerit kesikleri, alt kenar
    ctx.save(); ctx.globalAlpha = 0.8;
    for (let x = x0 + 40; x < x1; x += 190) K.rect(x, (YF + YN) / 2 + 22, 96, 11, PAL.trim, 0, 5);
    K.rect(x0, YOL1, x1 - x0, 9, PAL.trim, 0);
    ctx.restore();
    damaSerit(K, XL); damaSerit(K, XR);
    if (d.iz) for (const [xc, y] of [[XF, YF], [XN, YN]]) {   // kalkıştan kalan lastik izleri
      const xa = xc - CAR.ak * C, xb = Math.min(xa + d.iz, 3000);
      ctx.save(); ctx.globalAlpha = 0.72; K.line(xa, y - 3, xb, y - 3, 15, '#39433D'); K.line(xa + 10, y - 24, xb, y - 24, 9, '#39433D'); ctx.restore();
    }
    bitisTaki(K); kurdeleDirek(K, KF);
    tabela(K, d.tabela || 0, d.sars || 0);
  },
  on(K, t, { durum: d }) { kurdeleDirek(K, KN); kupa(K, KUPA, d.kupa || 0, d.sal || 0); },
});

// ═══════════════════════════ zaman, kamera ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e);
  const cd = T(ep.countdown), cd0 = cd - 5, proof = T('d3>') + 0.05, tL = T('d5:5'), tK = tL + 0.66;
  const tm = {
    cd, cd0, buldum: T('d3'), proof, end: T('d6>') + 0.1,
    necmiPt: T('h2a') - 0.04, keremPt: T('h2a:2') - 0.04, indir: T('h2a:5') + 0.1, elfren: T('h2a:6') + 0.08, yaslan: T('h2a:8'),
    onden: T('h2a>') - 0.1, vur1: T('h2b') + 0.03, tek: T('h2b:2') - 0.04, ikisi: T('h2b:4') - 0.04,
    h3: T('h3'), kupa: T('h3:1') - 0.04,
    d2: T('d2'), kap: T('d2') - 0.47, gec: T('d2') + 0.18, kes1: T('d2:2') + 0.17, atil: T('d2:3'),
    hd: T('hd'), kes2: T('hd') - 0.06, geriKay: T('hd:1'),
    in1: cd0 + 0.2, adim: cd0 + 1.22, bezAl: cd0 + 1.52, sil: cd0 + 1.82, bezKoy: cd0 + 2.92, yuruN: cd0 + 3.15, vardi: cd + 0.08,
    dalga: [cd0 + 0.35, cd0 + 1.45, cd0 + 2.55], saat: cd0 + 3.6,
    clue: T('n1'), kes3: T('n1') - 0.02, birak: T('n1:1'), dalgin: T('n1:3'), senin: T('n1:4') - 0.04, bin: T('n1:6'),
    yan: T('d3:1') - 0.1,
    kapiF: proof + 0.1, kCik: proof + 0.24, kYur: proof + 0.8, kVar: proof + 2.1, kBin: proof + 2.15, nYur: proof + 0.85, nBin: proof + 1.2,
    d4: T('d4'), rakip: T('d4:2'), d5: T('d5'), kendi: T('d5:1') - 0.04, tL, tK, tE: T('h4') - 0.11, h4: T('h4'), hizli: T('h4:5'), cta: T('d6') - 0.15,
  };
  const film = H.sahneler([
    { id: 'start', t0: 0, cam: [
      [0, ...M.kadraj('b019_otopark', 'genis')],
      [T('h2a') - 0.05, ...M.kadraj('b019_otopark', 'gosterir')],             // megafon önce hardal, sonra petrol rengi arabayı gösterir
      [T('h2a:6') - 0.12, ...M.kadraj('b019_otopark', 'arabalar')],           // arabalara yaklaşır: el freni, direksiyona yaslanma
      [T('h2b') - 0.1, ...M.kadraj('b019_otopark', 'tabela')],                // tabela, Hikmet, Defne
      [tm.h3 - 0.12, ...M.kadraj('b019_otopark', 'kupa')],                    // sağa kayar: bitiş takı ve kupa
      [tm.kap - 0.12, 1.3, 1000, YG - 290],                                   // megafon elden ele
    ] },
    { id: 'arabalar', t0: tm.kes1, kisa: true, cam: [[0, 1.12, 480, 1295]] },                      // bakış kesmesi: Defne → arabalar
    { id: 'olmaz', t0: tm.kes2, cam: [
      [0, 1.0, 800, CY - 20], [tm.geriKay + 0.1, 1.02, 792, CY - 16],                               // konuşan Hikmet ekranın ortasında; arabaların burnu geri kayar
      [cd0 - 0.2, ...M.kadraj('b019_otopark', 'sayac')], [cd0 + 2.6, 1.0, 602, CY + 10],             // sayaç: Necmi solda, Defne'nin bayrağı sağda kalır
    ] },
    { id: 'ipucu', t0: tm.kes3, cam: [[0, 1.4, 380, 1207], [tm.dalgin, 1.43, 383, 1206]] },
    { id: 'buldum', t0: tm.buldum - 0.05, cam: [[0, 1.3, 975, 1290]] },    // Defne ortada; solda ona dönen Necmi, sağda Hikmet (üçünün de başı kartın altında, kadrajda)
    { id: 'takas', t0: proof, cam: [[0, 0.94, CX, CY], [tm.kVar - 0.3, 0.97, CX - 14, CY + 8], [tL - 0.04, 0.94, CX + 100, CY]] },
    { id: 'bitis', t0: tK, kisa: true, cam: [[0, ...M.kadraj('b019_otopark', 'bitis')]] },
    { id: 'toz', t0: tm.tE, cam: [[0, 1.3, PR2 - 76, YG - 315], [tm.h4 + 1.3, 1.33, PR2 - 72, YG - 317], [tm.cta, 1.4, PL - 30, YG - 290], [tm.cta + 1.4, 1.45, PL - 32, YG - 296]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  film.uyar();
  const camB = film.cam(tK + 0.01), solB = camB.cx - 540 / camB.zoom;
  tm.tKop = tK - 0.02 + (XR + (XF - XN) - solB) / 2400;   // öndeki (uzak şerit) arabanın burnu kurdeleye değer
  return { tm, film, camB };
}

// ═══════════════════════════ oyuncular ═══════════════════════════
// Binen sürücü kapıyı içeriden eliyle çeker, sonra eli direksiyona gider: yakın elin hedefi
function kapiCek(t, tb, c, u) {
  const wk = ease.state(seg(t, tb + 0.42, 0.14)) * (1 - ease.state(seg(t, tb + 0.8, 0.16))), d = dirYeri(c), k = kolYeri(c);
  return [[lerp(d[0], k[0], wk), lerp(d[1], k[1] - 6, wk)], Math.max(wk, 1 - ease.state(seg(u, 0, 0.3))), 'A'];
}
// Necmi: yakın arabada → sayaçta iner, kapısındaki adını parlatır, dalgın dalgın Kerem'in kapısına yürür → ipucu → uzak arabaya biner
function necmiAt(t, tl, tm, cN, cF) {
  const key = 'necmi', s = BS[key];
  const ex = ifade([[0, 'yorgun'], [tm.atil, 'saskin'], [tm.geriKay + 0.6, 'notr'], [tm.sil - 0.2, 'mutlu'], [tm.yuruN, DALGIN], [tm.clue - 0.02, 'saskin'], [tm.birak, 'korku'],
    [tm.dalgin - 0.1, 'mutlu'], [tm.buldum - 0.05, 'saskin'], [tm.nYur, 'mutlu']], t);
  const W3 = NYOL[3];
  if (t < tm.in1 + 0.16) {   // yakın arabada: el frenini çeker; atılınca geriye, frende öne savrulur
    const lean = 5 - 9 * H.nabiz(t, tm.elfren, 0.6) - 9 * H.nabiz(t, tm.atil, 0.5) + 15 * H.nabiz(t, tm.hd, 0.5);
    const p = binis(key, cN, 0, { lean, expr: ex });
    const fr = [cN.x - 26, cN.y - 154], fr2 = [cN.x - 40, cN.y - 212];
    const el = H.iz([[0, dirYeri(cN)], [tm.elfren - 0.24, fr, 0.2], [tm.elfren - 0.02, fr2, 0.2, ease.enter], [tm.elfren + 0.75, dirYeri(cN), 0.35]], t);
    const kol = t >= tm.elfren - 0.12 && t < tm.elfren + 0.85;
    return { yer: 'yakinIc', ciz(K, heads) {
      const a = oyna(K, t, tl, key, p, { heads, R: [el, 1, 'A'], L: [dirYeri(cN, true), 1, 'A'] });
      if (kol) { K.line(cN.x - 18, cN.y - 108, a.handR[0], a.handR[1] + 4, 13, INK); K.line(cN.x - 18, cN.y - 108, a.handR[0], a.handR[1] + 4, 6, PAL.metal); a.tut('R'); }
    } };
  }
  if (t < tm.in1 + 0.74) {   // iner
    const u = seg(t, tm.in1 + 0.16, 0.56), p = binis(key, cN, u, { expr: ex });
    return { yer: u < 0.38 ? 'yakinIc' : 'on', ciz(K, heads) { oyna(K, t, tl, key, p, { heads, R: [dirYeri(cN), 1 - ease.state(seg(u, 0, 0.3)), 'A'] }); } };
  }
  if (t < tm.yuruN) {   // geri geri iki adım atar, bezini çıkarır, kapısındaki adını parlatır, bezi cebine koyar
    const xs = NYOL[0][0], y = NYOL[0][1];
    if (t < tm.adim) {   // inince kapısını eliyle kapatır
      const p = kisi(key, { s, view: 'side', facing: 1, x: XN + CIK[0], y, expr: ex, head: { tilt: 0, look: [0, 0] }, armL: { sh: -4, el: 8 }, armR: { sh: 6, el: 10 } });
      return { yer: 'on', ciz(K, heads) { oyna(K, t, tl, key, p, { heads, R: [kolYeri(cN), 1 - ease.state(seg(t, tm.in1 + 0.92, 0.1)), 'A'] }); } };
    }
    if (t < tm.adim + 0.36) { const p = H.yuru(key, t, { t0: tm.adim, t1: tm.adim + 0.36, x0: XN + CIK[0], x1: xs, y, s, geri: true, poz: { expr: ex } }); return { yer: 'on', ciz(K, heads) { oyna(K, t, tl, key, p, { heads }); } }; }
    const egil = H.iz([[0, 0], [tm.sil - 0.3, 20, 0.3], [tm.bezKoy - 0.05, 0, 0.3]], t);
    const p = kisi(key, { s, view: 'side', facing: 1, x: xs, y, lean: egil, expr: ex, head: { tilt: egil * 0.5, look: [0, 0] }, armL: { sh: -4, el: 8 }, armR: { sh: 6, el: 10 } });
    const cep = [xs + 14, y - 154], L0 = [XN - 56, YN - 124 * C], w = 0.5 - 0.5 * Math.cos(2 * Math.PI * seg(t, tm.sil, 1.1) * 3), lev = [L0[0] + 86 * w, L0[1] + 10 * Math.sin(Math.PI * w)];
    const el = H.iz([[0, cep], [tm.bezAl + 0.2, [xs + 40, y - 172], 0.2], [tm.sil - 0.2, L0, 0.2], [tm.bezKoy, cep, 0.24]], t);
    const hedef = t >= tm.sil && t < tm.bezKoy ? lev : el, wEl = ease.state(seg(t, tm.bezAl, 0.2)) * (1 - ease.state(seg(t, tm.bezKoy + 0.24, 0.12)));
    const bez = t >= tm.bezAl + 0.2 && t < tm.bezKoy + 0.22;
    return { yer: 'on', ciz(K, heads) {
      const a = oyna(K, t, tl, key, p, { heads, R: [hedef, wEl, 'A'] });
      if (bez) { const [hx, hy] = a.handR; K.poly([[hx - 19, hy - 15], [hx + 15, hy - 19], [hx + 21, hy + 13], [hx - 4, hy + 21], [hx - 21, hy + 8]], '#DDE9E4', LW * 0.7); a.tut('R'); }
    } };
  }
  if (t < tm.vardi) {   // dalgın dalgın Kerem'in arabasına yürür (yakın arabanın burnunu dolanır)
    const p = yolda(key, t, NYOL, tm.yuruN, tm.vardi, { expr: ex, head: { tilt: -6, look: [0.2, -0.5] } });
    return { yer: p.y > YN - 20 ? 'on' : 'ara', ciz(K, heads) { oyna(K, t, tl, key, p, { heads }); } };
  }
  if (t < tm.nBin) {   // Kerem'in kapısında: kola uzanır, irkilip elini çeker, mahcup mahcup anlatır; sonra kapıyı Kerem'e açar
    const don = t >= tm.buldum - 0.05 && t < tm.proof - 0.02;   // "Buldum!": megafona döner
    const binW = ease.state(seg(t, tm.vardi + 0.08, 0.25)) * (1 - ease.enter(seg(t, tm.birak, 0.2)));   // kapıyı açıp binmeye davranır
    const x = W3[0] - 5 * binW + 6 * ease.enter(seg(t, tm.birak + 0.12, 0.25)) + (don ? 46 : 0) + 20 * ease.state(seg(t, tm.kapiF + 0.2, 0.3));
    const yur = t >= tm.nYur ? H.yuru(key, t, { t0: tm.nYur, t1: tm.nBin, x0: x, x1: cF.x + CIK[0], y: YF + CIK[1], s, poz: { expr: ex } }) : null;
    const p = yur || kisi(key, { s, view: 'side', facing: don ? 1 : -1, x, y: W3[1], lean: 7 * binW - 7 * H.nabiz(t, tm.birak + 0.1, 0.7), expr: ex, head: { tilt: 0, look: [0, 0] }, armL: { sh: -4, el: 8 }, armR: { sh: 6, el: 10 } });
    const wKol = ease.state(seg(t, tm.vardi - 0.1, 0.2)) * (1 - ease.state(seg(t, tm.birak + 0.2, 0.14))) + ease.state(seg(t, tm.proof - 0.02, 0.12)) * (1 - ease.state(seg(t, tm.kapiF + 0.22, 0.2)));
    const wOzur = ease.enter(seg(t, tm.birak + 0.24, 0.2)) * (1 - ease.state(seg(t, tm.dalgin - 0.15, 0.25)));   // kapıyı kapatır, eller havada: "kusura bakma"
    const kafa = H.eklem(key, p, 'head'), wKas = ease.state(seg(t, tm.dalgin - 0.1, 0.3)) * (1 - ease.state(seg(t, tm.senin - 0.2, 0.25)));   // ensesini kaşır
    const lev = levhaYeri(cF), wGos = ease.state(seg(t, tm.senin - 0.1, 0.28)) * (1 - ease.state(seg(t, tm.bin + 0.55, 0.3)));   // "senin arabana": levhayı gösterir
    if (!yur && wOzur > 0) { p.armR = { sh: lerp(p.armR.sh, 118, wOzur), el: lerp(p.armR.el, 62, wOzur) }; p.armL = { sh: lerp(p.armL.sh, 104, wOzur), el: lerp(p.armL.el, 70, wOzur) }; }
    return { yer: 'ara', ciz(K, heads) {
      const R = wKol > 0.01 ? [kolYeri(cF), wKol, 'A'] : wKas > 0.01 ? [[kafa[0] + 52, kafa[1] - 28], wKas, 'B'] : wGos > 0.01 ? [lev, wGos, 'A'] : undefined;
      const a = oyna(K, t, tl, key, p, { heads, R: yur ? undefined : R });
      if (!yur && wGos > 0.6 && wKol < 0.01) a.isaret('R', lev);
    } };
  }
  // Kerem'in arabasına biner ve sürer
  const u = 1 - seg(t, tm.nBin, 0.52), gaz = t >= tm.d5 - 0.1;
  const p = binis(key, cF, u, { lean: 5 + 7 * ease.state(seg(t, tm.d5 - 0.1, 0.4)) - 10 * H.nabiz(t, tm.tL, 0.5), expr: ex });
  return { yer: u > 0.38 ? 'ara' : 'uzakIc', ciz(K, heads) { oyna(K, t, tl, key, p, { heads, R: kapiCek(t, tm.nBin, cF, u), L: [dirYeri(cF, true), gaz ? 1 : 0, 'A'] }); } };
}
// Kerem (genc kartı, konuşmaz): uzak arabada direksiyona yaslanır → ipucunda camdan bakar → iner, burnu dolanır, yakın arabaya biner
function keremAt(t, tl, tm, cN, cF) {
  const key = 'genc';
  const ex = ifade([[0, 'notr'], [tm.yaslan - 0.1, 'yorgun'], [tm.atil, 'saskin'], [tm.geriKay + 0.7, 'yorgun'], [tm.cd0 + 2.0, ESNEME], [tm.cd0 + 2.9, 'yorgun'], [tm.vardi - 0.35, 'notr'], [tm.vardi + 0.2, 'saskin'],
    [tm.dalgin + 0.3, 'notr'], [tm.senin + 0.5, 'mutlu'], [tm.buldum - 0.05, 'saskin'], [tm.kCik + 0.3, 'notr'], [tm.kBin + 0.5, 'mutlu']], t);
  if (t < tm.vardi - 0.35) {   // uzak arabada, yandan
    const yas = ease.state(seg(t, tm.yaslan - 0.1, 0.5)) * (1 - ease.state(seg(t, tm.atil - 0.05, 0.2))) + ease.state(seg(t, tm.geriKay + 0.7, 0.6)) * (1 - ease.state(seg(t, tm.vardi - 0.75, 0.35)));   // Necmi yaklaşınca doğrulur
    const p = binis(key, cF, 0, { lean: 4 + 11 * yas - 9 * H.nabiz(t, tm.atil, 0.5) + 12 * H.nabiz(t, tm.hd, 0.5), tilt: 12 * yas, expr: ex });   // başı ön cama girmeyecek kadar yaslanır
    return { yer: 'uzakIc', ciz(K) { oyna(K, t, null, key, p, { R: [dirYeri(cF), 1, 'A'], L: [dirYeri(cF, true), 1, 'A'] }); } };
  }
  if (t < tm.kCik) {   // camdan (önden) şaşkın bakar; Necmi anlatınca başını sallar
    const p = koltuktaOnden(key, cF, { lean: -9, expr: ex, head: { tilt: H.iz([[0, -5], [tm.buldum - 0.05, 4, 0.2]], t), look: [0.85, H.iz([[0, -0.1], [tm.buldum - 0.05, -0.4, 0.2]], t)] } });
    H.onayla(p, t, tm.bin + 0.3, 2, 0.3);
    return { yer: 'uzakIc', ciz(K) { oyna(K, t, null, key, p, {}); } };
  }
  if (t < tm.kYur) { const u = seg(t, tm.kCik, 0.55), p = binis(key, cF, u, { expr: ex }); return { yer: u < 0.38 ? 'uzakIc' : 'ara', ciz(K) { oyna(K, t, null, key, p, {}); } }; }
  if (t < tm.kBin) {   // Necmi'nin arabasına koşar adım gider
    const p = yolda(key, t, [[cF.x + CIK[0], YF + CIK[1]], [XN + 310, YN - 60], [XN + 235, YN + CIK[1]], [XN + CIK[0], YN + CIK[1]]], tm.kYur, tm.kVar, { expr: ex });
    if (t >= tm.kVar) p.facing = 1;
    const wk = ease.state(seg(t, tm.kBin - 0.3, 0.16));   // son adımda kapının koluna uzanır, kapıyı kendi açar
    return { yer: p.y > YN - 20 ? 'on' : 'ara', ciz(K) { oyna(K, t, null, key, p, { R: wk > 0.01 ? [kolYeri(cN), wk, 'A'] : undefined }); } };
  }
  const u = 1 - seg(t, tm.kBin, 0.53), gaz = t >= tm.d5 - 0.1;
  const p = binis(key, cN, u, { lean: 5 + 7 * ease.state(seg(t, tm.d5 - 0.1, 0.4)) - 10 * H.nabiz(t, tm.tL, 0.5), expr: ex });
  return { yer: u > 0.38 ? 'on' : 'yakinIc', ciz(K) { oyna(K, t, null, key, p, { R: kapiCek(t, tm.kBin, cN, u), L: [dirYeri(cN, true), gaz ? 1 : 0, 'A'] }); } };
}

// Megafonun Hikmet'ten Defne'ye geçişi (d2): Hikmet karın hizasında uzatır, Defne kapar (megafon yüzlerin altında kalır)
const MEG_A = [PL + 70, YG - 232], MEG_B = [PR - 56, YG - 222];
const megVer = (t, tm) => H.elVer(t, tm.kap, MEG_A, MEG_B, { bulus: [PL + 76, YG - 238], uzat: 0.25, ortak: 0.15, cek: 0.25 });

function hikmetCiz(K, t, tl, tm, heads) {
  const key = 'hikmet', s = BS[key];
  const ex = ifade([[0, 'mutlu'], [tm.onden, 'notr'], [tm.vur1 - 0.12, 'kizgin'], [tm.tek - 0.1, 'mutlu'], [tm.gec - 0.1, 'saskin'], [tm.kes2, 'kizgin'], [tm.cd0 - 0.3, 'notr'],
    [tm.buldum - 0.1, 'saskin'], [tm.tL + 0.1, 'korku'], [tm.tE, 'yorgun']], t);
  if (t < tm.onden) {   // yandan, arabalara dönük: megafon ağzında (h1), sonra megafonla arabaları tek tek gösterir (h2a)
    const p = kisi(key, { s, view: 'side', facing: -1, x: PL, y: YG, lean: 4, expr: ex, head: { tilt: -3, look: [0, 0] } });
    const agiz = agizYeri(key, p), elAgiz = megEl([agiz[0] - 2, agiz[1] + 2], MY);
    const yon = H.iz([[0, MY], [tm.necmiPt - 0.14, Math.PI - 0.42, 0.3], [tm.keremPt - 0.1, Math.PI + 0.14, 0.3], [tm.indir, Math.PI + 1.15, 0.4]], t);
    const el = H.iz([[0, elAgiz], [tm.necmiPt - 0.14, [PL - 100 * Q, YG - 240 * Q], 0.3], [tm.keremPt - 0.1, [PL - 108 * Q, YG - 318 * Q], 0.3], [tm.indir, [PL - 44 * Q, YG - 300 * Q], 0.4]], t);
    const a = oyna(K, t, tl, key, p, { heads, R: [el, 1, 'A'] });
    megafon(K, a.handR, yon); a.tut('R');
    if (t < tm.necmiPt - 0.14) sesYayi(K, megYer(a.handR, yon).zil, yon, t, konusuyor(tl, 'h1', t) ? 1 : 0);
    return null;
  }
  if (t < tm.gec) {   // önden, çizgi başında: megafonu tabelanın direğine vurur; "tek" derken parmağını kaldırır, arabaları gösterir; megafonu uzatır
    const v = megVer(t, tm), L0 = [PL - 76, YG - 266], C0 = [PL + 4, YG - 236], R0 = [PL + 62, YG - 234];
    const mp = t >= tm.kap ? v.p : H.iz([[tm.onden, L0], [tm.vur1 - 0.3, [PL - 86, YG - 372], 0.2], [tm.vur1 - 0.1, [PL - 100, YG - 446], 0.1, ease.exit], [tm.vur1 + 0.16, L0, 0.4],
      [tm.tek - 0.46, C0, 0.26], [tm.tek - 0.16, R0, 0.25], [tm.h3 - 0.02, MEG_A, 0.3]], t);
    const yon = H.iz([[tm.onden, Math.PI + 0.9], [tm.vur1 - 0.3, Math.PI + 1.15, 0.2], [tm.vur1 - 0.1, Math.PI + 0.75, 0.1], [tm.vur1 + 0.16, Math.PI + 0.9, 0.4],
      [tm.tek - 0.46, Math.PI * 1.5, 0.26], [tm.tek - 0.16, Math.PI * 1.5 + 0.3, 0.25]], t);
    const wL = 1 - ease.state(seg(t, tm.tek - 0.2, 0.16)), wR = ease.state(seg(t, tm.tek - 0.44, 0.2)) * (t >= tm.kap ? v.verW : 1);   // megafon göğüste sol elden sağ ele geçer
    const solW = H.kaldir(t, [[tm.tek - 0.1, tm.h3 - 0.3]], { cik: 0.28, inis: 0.25 }), gos = ease.state(seg(t, tm.ikisi - 0.12, 0.3));   // sol el: önce "tek", sonra arabalar
    const bak = H.iz([[tm.onden, [0.6, -0.2, 3]], [tm.vur1 - 0.3, [-0.7, -0.7, -5], 0.2], [tm.vur1 + 0.3, [0.7, 0.1, 4], 0.3], [tm.ikisi - 0.1, [-0.8, 0.15, -4], 0.3], [tm.h3 - 0.1, [0.8, 0.05, 5], 0.3]], t);
    const p = kisi(key, { s, x: PL, y: YG, expr: ex, head: { tilt: bak[2], look: [bak[0], bak[1]] }, armL: { sh: 14, el: -40 }, armR: { sh: 20, el: -60 } });
    const tekEl = H.elYeri(key, p, 'L', 'yukari'), arabalar = [PL - 330, YG - 292], solEl = [lerp(tekEl[0], PL - 190, gos), lerp(tekEl[1], YG - 300, gos)];
    const a = oyna(K, t, tl, key, p, { heads, L: wL > 0.01 ? [mp, wL, 'A'] : solW > 0.01 ? [solEl, solW, 'A'] : undefined, R: wR > 0.01 ? [mp, wR, 'A'] : undefined });
    const meg = () => { megafon(K, mp, yon); if (wL > 0.5) a.tut('L'); if (wR > 0.5) a.tut('R'); };
    if (wL <= 0.01 && solW > 0.4) { if (gos < 0.5) a.parmak('L', solW, { toplam: 1, yon: -Math.PI / 2, boy: 1.3 }); else a.isaret('L', arabalar); }
    if (t >= tm.kap) return meg;   // elden ele geçerken megafon Defne'den SONRA çizilir (iki el de üstünde)
    meg(); return null;
  }
  // sağ yerde (megafon artık Defne'de): "Olmaz!" derken parmak sallar; sayaçta bayrağa ve saatine bakar; kalkışta rüzgârda kalır; sonunda toz içinde
  const p = kisi(key, { s, x: PR2, y: YG, expr: ex, head: { tilt: 0, look: [0, 0] }, armL: { sh: 14, el: -40 }, armR: { sh: 20, el: -60 } });
  H.yanAdim(p, t, { t0: tm.gec - 0.06, x0: PL, x1: PR2, adim: 2, sure: 0.24, ara: 0.04 });
  const bak = H.iz([[0, [-0.8, 0.25, -3]], [tm.kes2, [-0.8, 0.1, 5]], [tm.cd0 - 0.2, [-0.8, 0.15, -3], 0.4], [tm.dalga[0] + 0.3, [-0.6, -0.8, -6], 0.3], [tm.dalga[0] + 1.0, [-0.8, 0.15, -3], 0.3],
    [tm.dalga[2] + 0.3, [-0.6, -0.8, -6], 0.3], [tm.saat, [0.45, 0.75, 6], 0.3], [tm.saat + 1.15, [-0.85, 0.1, -3], 0.3],
    [tm.buldum - 0.1, [-0.7, 0, 4], 0.2], [tm.proof, [-0.85, 0.1, -2], 0.2], [tm.tL + 0.2, [0.85, 0, 5], 0.3], [tm.tE, [0.85, 0.05, 7], 0.01], [tm.tE + 1.1, [0.9, 0.7, 5], 0.3], [tm.hizli - 0.02, [0, 0.1, 2], 0.35]], t);
  p.head = { ...p.head, tilt: bak[2], look: [bak[0], bak[1]] };
  const ikaz = ease.enter(seg(t, tm.kes2 - 0.1, 0.2)) * (1 - ease.state(seg(t, tm.geriKay + 0.9, 0.35)));
  const saat = H.kaldir(t, [[tm.saat, tm.saat + 1.1]], { cik: 0.3, inis: 0.3 }), ruzgar = ease.enter(seg(t, tm.tL + 0.12, 0.25)) * (t < tm.tE ? 1 : 0);
  p.armR = { sh: lerp(lerp(lerp(20, 152 + 12 * Math.sin((t - tm.hd) * 13), ikaz), 46, saat), 150, ruzgar), el: lerp(lerp(lerp(-60, -8, ikaz), -118, saat), 10, ruzgar) };
  if (ruzgar > 0) { p.armL = { sh: lerp(14, 150, ruzgar), el: lerp(-40, 10, ruzgar) }; p.lean = 9 * ruzgar; }
  if (t >= tm.tE) { p.armL = { sh: 12, el: -10 }; p.armR = { sh: 16, el: -30 }; p.lean = 4; }
  oyna(K, t, tl, key, p, { heads });
  return null;
}

function defneCiz(K, t, tl, tm, heads) {
  const key = 'defne', s = BS[key];
  const ex = ifade([[0, 'saskin'], [0.9, 'notr'], [tm.vur1, 'saskin'], [tm.tek + 0.3, IFADE.dusun], [tm.kupa, 'mutlu'], [tm.hd - 0.05, 'saskin'], [tm.cd0 - 0.1, IFADE.dusun],
    [tm.clue - 0.2, 'notr'], [tm.buldum - 0.05, 'mutlu']], t);
  const hop = H.buldumHop(t, tm.buldum, 56), yg = YG - hop;
  const yanEl = (x, y) => [x + 44, y - 205];   // yandan görünüşte bayrak indirilir: uzak el belin arkasında, sap aşağı bakar
  if (t < tm.gec) {   // ilk yerinde, önden: bayrak sağ elinde; megafonu Hikmet'in elinden kapar
    const v = megVer(t, tm), FR = [PR + 73, YG - 388];
    const bak = H.iz([[0, [-0.85, 0.2, -4]], [0.9, [-0.8, 0.1, 4], 0.4], [tm.vur1 - 0.1, [-0.9, -0.5, -5], 0.3], [tm.tek + 0.3, [-0.6, -0.3, -7], 0.3], [tm.h3 - 0.05, [0.85, 0.1, 5], 0.3], [tm.kap - 0.1, [-0.7, 0.4, -3], 0.2]], t);
    const dus = H.kaldir(t, [[tm.tek + 0.3, tm.h3 - 0.1]], { cik: 0.35, inis: 0.3 });
    const p = kisi(key, { s, x: PR, y: YG, lean: 5 * H.nabiz(t, 0.42, 0.5), expr: ex, head: { tilt: bak[2], look: [bak[0], bak[1]] }, armL: { sh: lerp(12, 18, dus), el: lerp(-10, -168, dus) }, armR: { sh: 16, el: -30 } });
    const a = oyna(K, t, tl, key, p, { heads, R: [FR, 1, 'A'], L: t >= tm.kap ? [v.p, v.alW, 'A'] : undefined });
    bayrak(K, a.handR, -0.1 + 0.16 * H.sars(t, 0.42, 0.6, 5), t); a.tut('R');   // megafonun sesiyle irkilir: bayrak titrer
    return t >= tm.kap ? { el: v.alW > 0.5 && t >= v.tK ? () => a.tut('L') : null } : null;
  }
  if (t < tm.kes2) {   // megafonla çizgi başına geçer (Hikmet'in önünden), arabalara bağırır: "İlk gelen kazansın!"
    const tv = tm.gec + 0.42, yur = t < tv;
    const p = yur ? H.yuru(key, t, { t0: tm.gec, t1: tv, x0: PR, x1: PL, y: YG, s, poz: { expr: ex } }) : kisi(key, { s, view: 'side', facing: -1, x: PL, y: YG, lean: 6, expr: ex, head: { tilt: -4, look: [0, 0] } });
    if (yur) p.y += 20 * Math.sin(Math.PI * p.u);
    const agiz = agizYeri(key, p), w = ease.state(seg(t, tm.gec + 0.36, 0.26));   // megafonu Hikmet'in önünden geçtikten sonra ağzına götürür
    const el = megEl([agiz[0] - 2, agiz[1] + 2], MY), tasi = [p.x - 50, p.y - 232], hedef = [lerp(tasi[0], el[0], w), lerp(tasi[1], el[1], w)], yon = lerp(Math.PI + 0.8, MY, w);
    bayrak(K, yanEl(p.x, p.y), Math.PI - 0.16, t, 1);
    const a = oyna(K, t, tl, key, p, { heads, R: [hedef, 1, 'A'], L: [yanEl(p.x, p.y), 1, 'A'] });
    megafon(K, a.handR, yon); a.tut('R');
    sesYayi(K, megYer(a.handR, yon).zil, yon, t, w > 0.9 && konusuyor(tl, 'd2', t, 1) ? 1 : 0);
    return null;
  }
  const yandan = t >= tm.yan && t < tm.proof + 0.25;
  if (yandan) {   // "Arabaları değiştirin!": megafon ağzında, arabalara dönük
    const p = kisi(key, { s, view: 'side', facing: -1, x: PL, y: YG, lean: 7, expr: ex, head: { tilt: -5, look: [0, 0] } });
    const agiz = agizYeri(key, p), el = megEl([agiz[0] - 2, agiz[1] + 2], MY);
    bayrak(K, yanEl(p.x, p.y), Math.PI - 0.16, t, 1);
    const a = oyna(K, t, tl, key, p, { heads, R: [el, 1, 'A'], L: [yanEl(p.x, p.y), 1, 'A'] });
    megafon(K, a.handR, MY); a.tut('R');
    sesYayi(K, megYer(a.handR, MY).zil, MY, t, konusuyor(tl, 'd3', t, 1) ? 1 : 0);
    return null;
  }
  // çizgi başında, önden: bayrak sağ elinde, megafon sol elinde (d2'den sonra hep Defne'de kalır). Sayaçta bayrağı üç kez sallar;
  // "rakibinin arabasını" derken megafonla arabaları gösterir; kalkışta bayrağı indirir
  const dal = tm.dalga.reduce((q, a) => q + Math.sin(2 * Math.PI * seg(t, a, 0.95)), 0);
  const indi = ease.exit(seg(t, tm.tL - 0.3, 0.2)) * (1 - ease.state(seg(t, tm.tL + 0.55, 0.5)));   // kalkış işareti
  const bAci = -0.1 + 0.42 * dal - 1.9 * indi;
  const FR = [PL + 73 - 30 * indi, yg - 388 + 12 * Math.abs(dal) + 130 * indi];
  const bak = H.iz([[tm.kes2, [0.8, -0.3, 5]], [tm.geriKay, [-0.85, 0.2, -4], 0.3], [tm.clue - 0.3, [-0.8, 0.1, 3], 0.3], [tm.buldum - 0.06, [0, -0.3, 6], 0.01], [tm.proof + 0.25, [-0.8, 0.2, -3], 0.01],
    [tm.d5, [0, 0, 3], 0.3], [tm.kendi + 0.5, [-0.85, 0.15, -3], 0.3], [tm.tL + 0.1, [0.85, 0, 5], 0.3], [tm.tE, [0.75, 0.1, 5], 0.01], [tm.cta, [0, 0, 3], 0.3]], t);
  const p = kisi(key, { s, x: PL, y: yg, expr: ex, head: { tilt: bak[2], look: [bak[0], bak[1]] }, armL: { sh: 12, el: -10 }, armR: { sh: 16, el: -30 } });
  if (t >= tm.cd0 && t < tm.cd) H.glance(p, t, tm.cd);
  const on = ease.state(seg(t, tm.cta, 0.32));   // d6: megafonu kameraya çevirir
  const mL = H.iz([[tm.kes2, [PL - 63, yg - 250]], [tm.proof + 0.25, [PL - 63, YG - 250], 0.01], [tm.rakip - 0.1, [PL - 108, YG - 262], 0.3], [tm.d5 - 0.3, [PL - 63, YG - 250], 0.3], [tm.cta, [PL - 86, YG - 232], 0.32]], t);
  const yon = H.iz([[tm.kes2, Math.PI + 0.95], [tm.proof + 0.25, Math.PI + 0.95, 0.01], [tm.rakip - 0.1, Math.PI + 0.05, 0.3], [tm.d5 - 0.3, Math.PI + 0.95, 0.3]], t);
  const a = oyna(K, t, tl, key, p, { heads, R: [FR, 1, 'A'], L: [mL, 1, 'A'] });
  H.buldumIsin(K, t, tm.buldum, H.eklem(key, p, 'head'), { son: tm.yan, k: s / 245 });
  bayrak(K, a.handR, bAci, t); a.tut('R');
  megafon(K, a.handL, yon, on); a.tut('L');
  if (on > 0.9 && konusuyor(tl, 'd6', t)) { const m = [a.handL[0], a.handL[1] - 46 * MK]; sesYayi(K, m, Math.PI, t, 1, 0.5); sesYayi(K, m, 0, t, 1, 0.5); }
  return null;
}

// ═══════════════════════════ sahne ═══════════════════════════
function bitis(K, t, tl, S, heads) {   // kısa plan: iki araba soldan girer, kurdeleyi koparır; kupa sehpası sallanır
  const { tm, camB } = S, yari = CAR.on * C, mk = (uzak, tKes) => ({ ...araba(tm.tL + 0.5, tm, uzak), x: H.giris(camB, t, tKes, 2400, yari), v: 2400, aci: t * 40, egim: -1.2, gaz: true });
  const cF = mk(true, tm.tK - 0.02), cN = mk(false, tm.tK + 0.1), sal = H.sars(t, tm.tKop - 0.04, 0.75, 6.5);
  M.mekanCiz(K, 'b019_otopark', 'arka', t, { durum: {} });
  const sur = (key, c) => { const p = binis(key, c, 0, { lean: 13, expr: 'mutlu' }); oyna(K, t, key === 'necmi' ? tl : null, key, p, { heads: key === 'necmi' ? heads : undefined, R: [dirYeri(c), 1, 'A'], L: [dirYeri(c, true), 1, 'A'] }); };
  arabaArka(K, cF); icKirp(K, cF, () => sur('necmi', cF)); arabaOn(K, cF); hizCizgi(K, cF);
  kurdele(K, t, tm.tKop);
  arabaArka(K, cN); icKirp(K, cN, () => sur('genc', cN)); arabaOn(K, cN); hizCizgi(K, cN);
  for (const c of [cF, cN]) H.puf(K, c.x + CAR.arka * C - 10, c.y - 30, t, { k: 1.2, n: 3, periyot: 0.3, yol: 170, kalk: 50 });
  tozPat(K, XR + (XF - XN) + 40, YF - 10, t, tm.tKop + 0.02, { n: 8, tohum: 11, sure: 1.0, yay: 200, k: 1.05 });
  tozPat(K, XR + 60, YN - 6, t, tm.tKop + 0.14, { n: 8, tohum: 17, sure: 1.0, yay: 220, k: 1.15 });
  M.mekanCiz(K, 'b019_otopark', 'on', t, { durum: { sal } });
}

function dunya(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B;
  if (sc.id === 'bitis') return bitis(K, t, tl, S, heads);
  const open = (a, d = 0.26) => ease.state(seg(t, a, d));
  const cN = araba(t, tm, false), cF = araba(t, tm, true);
  cN.kapi = Math.max(open(tm.in1) * (1 - open(tm.in1 + 0.76, 0.22)), open(tm.kBin - 0.2, 0.24) * (1 - open(tm.kBin + 0.55, 0.22)));
  cF.kapi = Math.max(0.7 * open(tm.vardi - 0.02, 0.3) * (1 - open(tm.birak + 0.02, 0.2)), open(tm.kapiF) * (1 - open(tm.nBin + 0.55, 0.22)));
  cN.nabiz = H.nabiz(t, tm.necmiPt + 0.04) + H.nabiz(t, tm.kendi + 0.04);
  cF.nabiz = H.nabiz(t, tm.keremPt + 0.04) + H.nabiz(t, tm.senin + 0.04) + H.nabiz(t, tm.kendi + 0.04);
  cF.sinyal = sc.id === 'ipucu' && (t * 2.2) % 1 < 0.5;   // ipucu planının ikinci döngüsü: dörtlüsü yanıp söner
  const tab = ease.enter(seg(t, tm.vur1, 0.36)) * (1 - ease.state(seg(t, tm.h3 - 0.28, 0.3)));
  M.mekanCiz(K, 'b019_otopark', 'arka', t, { durum: { tabela: tab, sars: H.sars(t, tm.vur1, 0.55, 8), iz: t >= tm.tL ? Math.max(0, arabaX(t, tm) - 30) : 0 } });
  const kisiler = [necmiAt(t, tl, tm, cN, cF), keremAt(t, tl, tm, cN, cF)], ciz = yer => { for (const a of kisiler) if (a.yer === yer) a.ciz(K, heads); };
  // uzak şerit → aradakiler → yakın şerit → öndekiler
  arabaArka(K, cF); icKirp(K, cF, () => ciz('uzakIc')); arabaOn(K, cF); egzoz(K, cF, t, tm); hizCizgi(K, cF); ciz('ara'); arabaKapi(K, cF);
  arabaArka(K, cN); icKirp(K, cN, () => ciz('yakinIc')); arabaOn(K, cN); egzoz(K, cN, t, tm); hizCizgi(K, cN); ciz('on'); arabaKapi(K, cN);
  kurdele(K, t);
  // kalkış: teker dumanı; sonrasında çizgide dağılan toz
  for (const [x, y, th] of [[XF, YF, 5], [XN, YN, 9]]) {
    tozPat(K, x - CAR.ak * C, y, t, tm.tL - 0.03, { n: 9, tohum: th, sure: 1.25, yay: 250, k: 1.1 });
    tozPat(K, x + 120, y, t, tm.tL + 0.16, { n: 7, tohum: th + 20, sure: 1.3, yay: 330, k: 1.2, yon: 1 });
  }
  if (t >= tm.tE) for (const [x, y, f] of [[600, YF - 8, 0], [760, YN - 10, 0.5], [960, YF + 70, 0.25]]) H.puf(K, x, y, t + f * 2.3, { k: 1.25, n: 3, periyot: 2.3, yon: -0.25, yol: 170, kalk: 70 });
  jant(K, t, tm);
  M.mekanCiz(K, 'b019_otopark', 'on', t, { durum: { kupa: H.nabiz(t, tm.kupa, 0.5) } });
  // Hikmet ve Defne. Defne sonra çizilir: çizgi başına geçerken Hikmet'in önünden yürür; megafon elden ele geçerken ikisinin de üstünde
  const meg = hikmetCiz(K, t, tl, tm, heads), d = defneCiz(K, t, tl, tm, heads);
  if (meg) meg();
  if (d && d.el) d.el();
  if (t >= tm.tE) H.puf(K, PR2 - 120, YG - 26, t, { k: 1.1, n: 2, periyot: 2.8, yon: -0.3, yol: 150, kalk: 60 });   // Hikmet toz içinde
}

export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  // sayacın ikinci yarısı: kamera yürüyen Necmi'yi izler (Necmi sayacın solunda, ekranda x ≈ 290'da kalır)
  kamera(cam, t, B) { const { tm } = S; if (B.sc.id === 'olmaz' && t > tm.yuruN) Object.assign(cam, H.kamKaris(cam, { cx: Math.min(yolda('necmi', t, NYOL, tm.yuruN, tm.vardi).x + 250, 880) }, ease.state(seg(t, tm.yuruN, 0.7)))); },
  dunya(K, t, B) { dunya(K, t, tl, S, B); },
});
