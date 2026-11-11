// Bölüm 33 · ALTLIK OYUNU (v4 "hikâye" dili; storyboard: hikayeler/bolum_033_v5.md).
// Logline: Hikmet Bey yuvarlak masada altlık oyununda yenilmez olduğunu iddia eder. Defne ilk altlığı tam ortaya koyar,
// sonra Hikmet'in her hamlesini ortanın tam karşısına kopyalar.
// Akılda kalacak tek şey: ortayı al, sonra karşındakinin her hamlesini ortanın tam karşısına koy; son yer hep senindir.
// Üç set aynı dünyada yan yana durur: oda (masa başı, yüzler) · üstten (masanın üstü, çaprazdan; kollar kadrajın
// kenarından girer) · çay ocağı (Necmi'nin tepsisi). Altlık yerleri masa biriminde (masa yarıçapı = 1) tanımlıdır;
// iki görünüş aynı yerleri kendi izdüşümüyle çizer. Merkeze göre simetri afin izdüşümde korunur.
// Geometri build anında denetlenir: altlıklar binmez, masadan taşmaz, oyun sonunda boş yer kalmaz (yerKalmadi).
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b033_oda', UST = 'b033_ust', OCK = 'b033_ocak', BX = 3000, OX = 6000;
const RA = 1 / 3.4;                       // altlık yarıçapı (masa yarıçapı = 1). 8 altlık sığar, 9. sığmaz (3,4 < 3,61)
const HALKA = 0.70;                       // kenar altlıklarının merkez uzaklığı (≤ 1 − RA = 0,706: taşmaz)
// oda: yuvarlak masa yatık elips; Hikmet solda, Defne sağda, masanın arka köşelerinde
const TC = [540, 1270], TRX = 260, TRY = 80, TKAL = 24, HIK_X = 290, DEF_X = 790, SAY_H = 160, SAY_D = 900;
// üstten (çapraz): masa elipsi, kenar kalınlığı; kollar sol / sağ kenardan girer
const UC = [BX + 540, 885], URX = 430, URY = 310, UKAL = 44, KOL_S = 300;
const H_ORG = [BX - 420, 760], D_ORG = [BX + 1500, 760];
// çay ocağı: tezgâh, tepsi
const NX = OX + 540, TEZ = 1262, TEP = [NX, 1292], TEP_RX = 250, TEP_RY = 32;
// Hikmet'in altlıkları bordo (kravatının rengi; yeleğin hardalı ve masanın ahşabı üstünde seçilir), Defne'ninkiler petrol; mercan yalnız "olmaz" içindir
const BORDO = ['#93303A', '#5E1D24', '#B9535B', PAL.cream], TEAL = ['#2F7F7A', '#215E5A', '#5AA59E', PAL.cream], MERCAN = [PAL.coral, '#A9452B', '#EE8B6C', PAL.cream];

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const pol = (a, r) => [r * Math.cos(a * D), r * Math.sin(a * D)];
const neg = ([u, v]) => [-u, -v];
const odaP = ([u, v]) => [TC[0] + u * TRX, TC[1] + v * TRY];
const ustP = ([u, v]) => [UC[0] + u * URX, UC[1] + v * URY];

// ═══════════════════════════ Oyunlar (masa biriminde) ═══════════════════════════
// Yanlış deneme: Defne kenarlardan oynar. Yedi kenar yeri eşit aralıklı; ortayı en son Hikmet alır (8. altlık).
const KENAR = [0, 1, 2, 3, 4, 5, 6].map(k => pol(k * 360 / 7, HALKA));
const YANLIS = [['d', 0], ['h', 4], ['d', 6], ['h', 3], ['d', 1], ['h', 5], ['d', 2], ['h', -1]].map(([kim, i]) => ({ kim, p: i < 0 ? [0, 0] : KENAR[i] }));
// Doğru oyun: Defne ortaya; Hikmet kendi yarısına üç kez, Defne her seferinde merkezin tam karşısına.
const HIK3 = [[192, 0.70], [130, 0.68], [258, 0.70]].map(([a, r]) => pol(a, r));
const DOGRU = [{ kim: 'd', p: [0, 0] }, ...HIK3.flatMap(p => [{ kim: 'h', p }, { kim: 'd', p: neg(p) }])];
const GEZ_D = [pol(25.7, HALKA), pol(334, HALKA)];                         // Defne'nin yer aradığı iki boşluk
const GEZ_H = [161, 225, 284, 341].map(a => pol(a, HALKA));               // Hikmet'in masanın çevresinde aradığı boşluklar
// Kural gösterimi: kancadaki altlık A, Defne'nin altlığı, üst üste binen B, masadan taşan C
const A0 = [-0.6, -0.12], DM = [0.52, 0.1], B0 = [A0[0] + 0.31, A0[1] + 0.1], C0 = [-0.33, 0.87];

// Geometri denetimi: binme, taşma, sondaki boş yer (örnekleme: 0,01 birim ızgara)
function denetle(ad, ps) {
  const sorun = [];
  ps.forEach((p, i) => { if (Math.hypot(...p) > 1 - RA + 1e-9) sorun.push(`${i}. altlık taşıyor`); ps.slice(0, i).forEach((q, j) => { if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 2 * RA) sorun.push(`${j}–${i} biniyor`); }); });
  let bos = 0;
  for (let x = -1; x <= 1; x += 0.01) for (let y = -1; y <= 1; y += 0.01) if (Math.hypot(x, y) <= 1 - RA && ps.every(p => Math.hypot(p[0] - x, p[1] - y) >= 2 * RA)) bos++;
  if (bos) sorun.push(`${bos} boş nokta kaldı`);
  if (sorun.length) console.warn(`b033 ${ad}: ${sorun.join(', ')}`);
  return !sorun.length;
}
const yerKalmadi = { yanlis: denetle('yanlış oyun', YANLIS.map(m => m.p)), dogru: denetle('doğru oyun', DOGRU.map(m => m.p)) };
const simetrik = DOGRU.every(m => DOGRU.some(q => Math.hypot(q.p[0] + m.p[0], q.p[1] + m.p[1]) < 1e-9));
if (!simetrik) console.warn('b033: doğru oyun simetrik değil');

// ═══════════════════════════ Nesneler ═══════════════════════════
// Altlık: yuvarlak, kenarı koyu, içi açık, dikiş halkası. (x, y) üst yüzün merkezi; ry/rx eğiklik; kal kalınlık
function altlik(K, [x, y], rx, ry, renk, { kal = 9, kalk = 0, durum = 0, yesil = 0, golge = true } = {}) {
  const { ctx } = K, c = durum < 0 ? renk.map((r, i) => H.mixHex(r, MERCAN[i], clamp01(-durum))) : renk, lw = Math.max(3, LW * Math.min(1, rx / 110));
  if (golge && kalk > 0.01) { ctx.save(); ctx.globalAlpha = 0.22 * kalk; K.ell(x + 10 * kalk, y + 6 + 8 * kalk, rx, ry, INK, 0); ctx.restore(); }
  const yy = y - 34 * kalk;
  K.ell(x, yy + kal, rx, ry, c[1], lw); K.rect(x - rx, yy, rx * 2, kal, c[1], 0);
  K.ell(x, yy, rx, ry, c[0], lw);
  K.ell(x, yy, rx * 0.74, ry * 0.74, c[2], lw * 0.6);
  ctx.save(); ctx.setLineDash([rx * 0.09, rx * 0.07]); ctx.beginPath(); ctx.ellipse(x, yy, rx * 0.6, ry * 0.6, 0, 0, TAU); ctx.lineWidth = lw * 0.55; ctx.strokeStyle = c[3]; ctx.stroke(); ctx.restore();
  if (yesil > 0.02) { ctx.save(); ctx.globalAlpha = yesil; ctx.beginPath(); ctx.ellipse(x, yy, rx + 14, ry + 14 * ry / rx, 0, 0, TAU); ctx.lineWidth = 11; ctx.strokeStyle = PAL.green; ctx.stroke(); ctx.restore(); }
  return [x, yy];
}
// Elde tutulan altlık (yüzü kameraya dönük daire)
function altlikYuz(K, [x, y], r, renk, rot = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  K.ell(0, 0, r, r * 0.94, renk[1], LW * 0.8); K.ell(0, -3, r * 0.94, r * 0.88, renk[0], LW * 0.8); K.ell(0, -3, r * 0.68, r * 0.64, renk[2], LW * 0.5);
  ctx.setLineDash([r * 0.1, r * 0.08]); ctx.beginPath(); ctx.ellipse(0, -3, r * 0.56, r * 0.52, 0, 0, TAU); ctx.lineWidth = 4; ctx.strokeStyle = renk[3]; ctx.stroke();
  ctx.restore();
}
// Deste (üst üste altlıklar)
function deste(K, [x, y], rx, ry, renk, n = 6, kal = 9) { for (let i = 0; i < n; i++) altlik(K, [x, y - i * kal], rx, ry, renk, { kal, golge: false }); }
// İnce belli çay bardağı (y = taban), tabaklı
function bardak(K, x, y, k = 1, tabak = true) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (tabak) K.ell(0, 0, 34, 9, PAL.cream, LW * 0.6);
  K.poly([[-18, -62], [18, -62], [11, -36], [19, -11], [13, -2], [-13, -2], [-19, -11], [-11, -36]], '#B5532A', LW * 0.6);
  K.rect(-18, -66, 36, 13, '#F1E6D2', LW * 0.5, 3);
  ctx.restore();
}
// Çift demlik (y = taban): altta metal çaydanlık, üstte porselen demlik
function demlik(K, x, y, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.line(46, -78, 78, -40, 13); K.line(46, -78, 78, -40, 6, PAL.metalDark);                                        // sap (sağda)
  K.poly([[-56, -6], [56, -6], [50, -78], [-50, -78]], PAL.metal, LW); K.ell(0, -4, 56, 9, PAL.metalDark, LW * 0.7);
  K.poly([[-50, -46], [-86, -74], [-80, -82], [-48, -62]], PAL.metal, LW * 0.8);                                   // emzik
  K.ell(0, -80, 44, 10, PAL.metalDark, LW * 0.7);
  K.poly([[-30, -84], [-52, -104], [-48, -110], [-26, -98]], PAL.red, LW * 0.6);                                  // demlik emziği
  K.poly([[-28, -82], [28, -82], [36, -100], [30, -122], [-30, -122], [-36, -100]], PAL.red, LW * 0.8); K.line(-34, -100, 34, -100, 7, PAL.cream);
  K.ell(0, -123, 30, 7, '#A8382A', LW * 0.6); K.circ(0, -133, 8, PAL.cream, LW * 0.6);
  ctx.restore();
  return { sap: [x + 64 * k, y - 60 * k] };
}
// Simitli tabak (y = taban)
function tabak(K, x, y, k = 1) {
  K.ell(x, y - 4 * k, 58 * k, 14 * k, PAL.cream, LW * 0.7);
  K.ell(x, y - 16 * k, 40 * k, 13 * k, '#B9772F', LW * 0.7); K.ell(x, y - 18 * k, 16 * k, 5 * k, '#E7D3A8', LW * 0.5);
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; K.circ(x + Math.cos(a) * 28 * k, y - 18 * k + Math.sin(a) * 8 * k, 2.6 * k, '#F4E8C8', 0); }
}
// Önkol + el, nesnenin üstüne (masa / tezgâh karakterden sonra çizildiği için)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Üstten planda kol: kadrajın dışındaki org noktasından ele uzanan yen + el (hedef varsa işaret parmağı)
function uzunKol(K, key, org, el, hedef) {
  const c = H.CARDS[key], { ctx } = K, w = c.arm.w * KOL_S, lw = c.line * KOL_S, u = H.unit(el, org), bilek = [el[0] + u[0] * 44, el[1] + u[1] * 44];
  ctx.save(); ctx.lineCap = 'butt';
  for (const [ww, col] of [[w + lw * 2, INK], [w, c.arm.color]]) H.strokeLine(ctx, org, bilek, ww, col);
  H.strokeLine(ctx, [bilek[0] + u[0] * 12, bilek[1] + u[1] * 12], bilek, w + lw * 2, INK); H.strokeLine(ctx, [bilek[0] + u[0] * 14, bilek[1] + u[1] * 14], [bilek[0] + u[0] * 4, bilek[1] + u[1] * 4], w, c.arm.shade);
  ctx.restore();
  if (hedef) H.isaret(K, key, el, KOL_S, hedef, 1.25); else H.grip(K, key, el, KOL_S);
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
function masaOda(K, t) {
  const [x, y] = TC;
  K.ell(x, 1560, 120, 26, PAL.woodDark, LW); K.rect(x - 26, y + TKAL, 52, 1556 - y - TKAL, PAL.wood, LW, 4);
  K.ell(x, y + TKAL, TRX, TRY, PAL.woodDark, LW); K.rect(x - TRX, y, TRX * 2, TKAL, PAL.woodDark, 0); K.line(x - TRX, y, x - TRX, y + TKAL); K.line(x + TRX, y, x + TRX, y + TKAL);
  K.ell(x, y, TRX, TRY, PAL.woodTop, LW);
  const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, TRX - 4, TRY - 3, 0, 0, TAU); ctx.clip();
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.ellipse(x - 30, y + 6, TRX * i / 4, TRY * i / 4, 0, 0.3, 2.6); ctx.lineWidth = 3; ctx.strokeStyle = '#B57F47'; ctx.stroke(); }
  ctx.restore();
  void t;
}
M.mekanEkle(ODA, {
  gen: [0, 1080], dongu: ['pencerede martı', 'duvar saatinin saniye kolu'],
  capa: { masa: TC }, kadraj: { genis: [1.12, 540, 1132], bahis: [1.2, 540, 1110], defne: [1.35, 842, 1010] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1600, isik });
    M.pencere(K, 900, 520, 330, 360, { isik, t: t + 3 });
    // beyaz tahta: toplantı odası (yazısız çizgiler)
    K.rect(372, 520, 336, 210, '#F4F1E8', LW, 8); K.rect(372, 730, 336, 14, PAL.metal, LW * 0.7, 4);
    K.line(400, 568, 560, 568, 6, '#3E6E6F'); K.line(400, 606, 640, 606, 6, '#3E6E6F'); K.line(400, 644, 520, 644, 6, PAL.coral); K.circ(620, 660, 30, null, 5);
    M.duvarSaati(K, 540, 444, 40, 14.4, t);
    for (let i = 0; i < 5; i++) H.yaprak(K, 66, 1250, 210 + (i % 2) * 50, -0.85 + i * 0.42 + 0.04 * Math.sin(t * 1.1 + i), i % 2 ? PAL.green : '#4C8240', 1);
    K.poly([[20, 1250], [112, 1250], [100, 1360], [32, 1360]], PAL.coral, LW);
  },
});
// Üstten: halı zemin, sandalye sırtları, vantilatör gölgesi (döngü), yan sehpada çay (buhar döngüsü)
function sandalyeUst(K, x, y, a) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-95, -70, 190, 150, PAL.wood, LW, 18); K.rect(-82, -58, 164, 120, '#B07A44', LW * 0.6, 14); K.rect(-105, 74, 210, 40, PAL.woodDark, LW, 14);
  ctx.restore();
}
M.mekanEkle(UST, {
  gen: [BX, BX + 1080], dongu: ['vantilatör gölgesi', 'çay buharı'],
  capa: { masa: UC }, kadraj: { masa: [1.0, BX + 540, 960] },
  arka(K, t) {
    const { ctx } = K; ctx.fillStyle = '#4E6B62'; ctx.fillRect(BX - 900, -400, 2900, 2800);
    for (let i = -10; i < 30; i++) K.line(BX - 900 + i * 120, -400, BX - 900 + i * 120 + 1400, 2400, 3, '#486359');
    for (let i = -10; i < 30; i++) K.line(BX - 900 + i * 120, 2400, BX - 900 + i * 120 + 1400, -400, 3, '#486359');
    sandalyeUst(K, BX + 120, 640, -0.9); sandalyeUst(K, BX + 960, 640, 0.9); sandalyeUst(K, BX + 120, 1180, -2.3); sandalyeUst(K, BX + 960, 1180, 2.3);
    // gölge ve masa
    ctx.save(); ctx.globalAlpha = 0.28; K.ell(UC[0] + 16, UC[1] + UKAL + 22, URX + 6, URY + 4, INK, 0); ctx.restore();
    K.ell(UC[0], UC[1] + UKAL, URX, URY, PAL.woodDark, LW); K.rect(UC[0] - URX, UC[1], URX * 2, UKAL, PAL.woodDark, 0);
    K.line(UC[0] - URX, UC[1], UC[0] - URX, UC[1] + UKAL); K.line(UC[0] + URX, UC[1], UC[0] + URX, UC[1] + UKAL);
    K.ell(UC[0], UC[1], URX, URY, PAL.woodTop, LW);
    ctx.save(); ctx.beginPath(); ctx.ellipse(UC[0], UC[1], URX - 4, URY - 3, 0, 0, TAU); ctx.clip();
    for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.ellipse(UC[0] - 60, UC[1] + 20, URX * i / 5.2, URY * i / 5.2, 0, 0.4, 2.4); ctx.lineWidth = 4; ctx.strokeStyle = '#B57F47'; ctx.stroke(); ctx.beginPath(); ctx.ellipse(UC[0] + 40, UC[1] - 10, URX * i / 5.6, URY * i / 5.6, 0, 3.6, 5.4); ctx.stroke(); }
    ctx.restore();
    // yan sehpa ve çay bardağı (üstten): buhar döngüsü
    K.ell(BX + 1010, 1330, 120, 88, PAL.woodDark, LW); K.ell(BX + 1010, 1318, 120, 88, PAL.woodTop, LW);
    K.ell(BX + 980, 1312, 44, 32, PAL.cream, LW * 0.7); K.ell(BX + 980, 1306, 26, 19, '#B5532A', LW * 0.6); K.ell(BX + 980, 1306, 15, 11, '#7E3518', 0);
    H.buhar(K, BX + 980, 1280, t, { k: 0.7, n: 2, ara: 30 });
  },
  isik(K, t) {   // vantilatör gölgesi: masanın üstünde dönen üç kanat (düz renkli çokgen)
    const { ctx } = K, a0 = t * 1.35; ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = INK;
    for (let k = 0; k < 3; k++) { const a = a0 + k * TAU / 3; ctx.beginPath(); ctx.moveTo(UC[0], UC[1] - 40); for (const [r, da] of [[260, -0.2], [560, -0.12], [600, 0.08], [300, 0.22]]) ctx.lineTo(UC[0] + Math.cos(a + da) * r, UC[1] - 40 + Math.sin(a + da) * r * 0.74); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  },
});
M.mekanEkle(OCK, {
  gen: [OX, OX + 1080], dongu: ['çaydanlık buharı', 'duvar saatinin saniye kolu'],
  capa: { tepsi: TEP }, kadraj: { necmi: [1.22, NX, 1132] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: OX - 600, x1: OX + 1700, isik, duvar: 'fayans', zemin: 'karo' });
    M.duvarSaati(K, OX + 860, 760, 50, 14.5, t);
    // arka tezgâh ve ocak: çaydanlık buharı
    K.rect(OX - 120, 1110, 420, 400, PAL.wood, LW); K.rect(OX - 140, 1090, 460, 30, PAL.woodTop, LW, 6);
    K.rect(OX + 40, 1060, 200, 30, PAL.metalDark, LW, 6); demlik(K, OX + 140, 1062, 0.9); H.buhar(K, OX + 64, 980, t, { k: 0.8 });
    K.rect(OX - 120, 830, 400, 20, PAL.woodTop, LW, 5);
    for (let i = 0; i < 3; i++) { K.rect(OX - 90 + i * 120, 750, 80, 80, ['#CFE3DD', PAL.cream, '#E6C98E'][i], LW, 12); K.rect(OX - 84 + i * 120, 738, 68, 20, PAL.red, LW * 0.6, 6); }
  },
  on(K) {   // ön tezgâh: üst yüz (tepsinin oturduğu), ön kenar, dolap kapakları
    K.rect(OX - 400, TEZ, 1900, 70, PAL.woodTop, LW, 0);
    K.rect(OX - 400, TEZ + 70, 1900, 26, PAL.woodDark, LW, 0);
    K.rect(OX - 400, TEZ + 96, 1900, 700, PAL.wood, LW, 0);
    for (let i = 0; i < 5; i++) { K.rect(OX - 150 + i * 290, TEZ + 120, 260, 260, '#B07A44', LW * 0.8, 10); K.rect(OX - 40 + i * 290, TEZ + 140, 40, 14, PAL.metalDark, LW * 0.6, 6); }
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05, koy0: 0.3,
    h1y: T('h1:5'), vur1: T('h1:2'), vur2: T('h1:4'),
    h2a: T('h2a'), dm: T('h2a:1') + 0.05, bin: T('h2a:4'), binAl: T('h2a:6') - 0.15, tas: T('h2a:7'), tasAl: T('h2b') + 0.1,
    h2b: T('h2b'), yer: T('h2b:2'), temiz: T('h2b:4'), ver0: T('h2b:5'), ver1: T('h2b:7'),
    h3: T('h3'), kaz: T('h3:1') - 0.1, cay: T('h3:2'),
    d2: T('d2'), hd: T('hd'), son: T('hd:5'), ara0: T('hd:5') + 0.3, ara1: T('hd:5') + 0.75,   // yer arama sayaç perdesi kararmadan görünsün
    yanlis: [T('d2') + 0.2, T('d2:1') + 0.15, T('d2:2'), T('d2:4') + 0.15, T('hd') - 0.35, T('hd:1'), T('hd:2') + 0.15, T('hd:5')],
    sayac: cd0 + 1.5, bak: cd - 1.9, ocak: cd - 1.55,
    n1: T('n1'), dem: T('n1:2') + 0.25, bR: T('n1:6'), bL: T('n1:7') + 0.15, tab: T('n1:10'),
    orta: T('d3:4'), cevap: T('d3:2') - 0.2,
    dogru: [T('d3:4'), T('d4:3') - 0.06, T('d4:8'), T('d5:1'), T('d5:2') + 0.25, T('d5:3') + 0.15, T('d5:7')],
    cizgi: [[T('d4:5'), T('d4:7')], [T('d5:1') + 0.05, T('d5:2') + 0.05], [T('d5:3') + 0.2, T('d5:5')]],
    gez: T('d5:7') + 0.12,
    espri: T('h4') - 0.2, cayV: T('h4'), topla: T('h4:3'), at: T('h4:5') + 0.05, tut: T('h4:5') + 0.6,
    cta: T('d6') - 0.15,
  };
  tm.gezD = [tm.gez + 0.4, tm.gez + 0.8, tm.gez + 1.2, tm.gez + 1.6];
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, 1.16, 525, 1126], [1.0, ...M.kadraj(ODA, 'genis')]] },
    { id: 'ust1', t0: tm.h2a - 0.08, cam: [[0, ...M.kadraj(UST, 'masa')], [tm.h2b, 1.03, BX + 548, 952]] },
    { id: 'bahis', t0: tm.h3 - 0.1, cam: [[0, ...M.kadraj(ODA, 'bahis')]] },
    { id: 'ust2', t0: tm.d2 - 0.12, cam: [[0, ...M.kadraj(UST, 'masa')], [tm.hd, 1.04, BX + 556, 955], [tm.ara0 - 0.1, 1.07, BX + 610, 950]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 1.06, 540, 1124], [tm.ocak - 0.3, 1.09, 545, 1118]] },
    { id: 'ocak', t0: tm.ocak, cam: [[0, ...M.kadraj(OCK, 'necmi')], [T('n1:4'), 1.26, NX, 1138]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...M.kadraj(UST, 'masa')], [T('d4:4'), 1.03, BX + 540, 952], [T('d5:7'), 1.06, BX + 528, 956]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.14, 540, 1124], [tm.topla, 1.18, 566, 1112]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.4, 832, 1012], [tm.cta + 1.5, 1.45, 830, 1006]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // hamleler: yanlış deneme (8) ve doğru oyun (7); her biri temas anında masaya iner
  const yanlis = YANLIS.map((m, i) => ({ ...m, t: tm.yanlis[i], gir: 0.42 }));
  const dogru = DOGRU.map((m, i) => ({ ...m, t: tm.dogru[i], gir: i === 0 ? tm.dogru[0] - tm.cevap : i === 1 ? 1.0 : 0.42 }));   // Hikmet'in ilk hamlesi düşünerek gelir
  const kural = [
    { kim: 'd', p: DM, t: tm.dm, al: tm.temiz + 0.25 },
    { kim: 'h', p: B0, t: tm.bin, al: tm.binAl, mercan: true },
    { kim: 'h', p: C0, t: tm.tas, al: tm.tasAl, mercan: true },
  ];

  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.15] }, ...POZ.dur });
  const hik = [
    [tm.koy0 + 0.2, { expr: 'mutlu', head: { tilt: 6, look: [0.9, 0.1] } }, 0.3],
    [tm.h1y, { head: { tilt: -3, look: [0.6, 0.6] } }, 0.3],
    [tm.h3 - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [0.9, 0.05] } }, 0.01],
    [tm.cay, { head: { tilt: 7, look: [0.9, 0] } }, 0.25],
    [tm.sayac, { x: SAY_H, expr: 'mutlu', head: { tilt: -3, look: [0.9, 0.1] }, ...POZ.ikaz }, 0.01],
    [tm.bak, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 4, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.05, { x: HIK_X, expr: 'saskin', head: { tilt: 3, look: [0.9, 0.05] } }, 0.01],
    [tm.espri, { expr: 'yorgun', head: { tilt: 5, look: [0.85, 0.2] } }, 0.01],
    [tm.topla, { expr: 'mutlu', head: { tilt: -4, look: [0.9, 0.1] } }, 0.3],
    [tm.cta, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.1] } }, 0.3],
  ];
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.2] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: 5, look: [-0.85, 0.1] } }, 0.4],
    [tm.h3 - 0.1, { expr: 'notr', head: { tilt: 3, look: [-0.85, 0.15] } }, 0.01],
    [tm.cay - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [-0.85, 0.05] } }, 0.25],
    [tm.sayac, { x: SAY_D, expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -6, look: [-0.4, -0.5] } }, 0.01],
    [tm.sayac + 0.9, { head: { tilt: 6, look: [-0.5, 0.5] } }, 0.35],
    [tm.bak, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 5, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.06, { x: DEF_X }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.espri, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: -4, look: [-0.85, 0.15] } }, 0.01],
    [tm.at, { expr: 'saskin', head: { tilt: 3, look: [-0.7, 0.3] } }, 0.2],
    [tm.tut + 0.2, { expr: 'mutlu', head: { tilt: 6, look: [-0.3, 0.1] } }, 0.3],
    [tm.cta - 0.05, { head: { tilt: 7, look: [-0.1, 0.05] } }, 0.35],
  ];
  return { tm, film, yanlis, dogru, kural, hik, hikBase, def, defBase, yerKalmadi };
}

// ═══════════════════════════ Üstten: hamle durumu ═══════════════════════════
// Bir hamle: el altlıkla org yönünden gelir, temas anında bırakır, kalır ve döner. `al` verilirse el geri gelip altlığı götürür.
const ER = 0.52;   // elin altlık merkezinden uzaklığı (yarıçap oranı)
function elNok(c, org, kalk = 0) { const u = H.unit(c, org); return [c[0] + u[0] * RA * URX * ER, c[1] + u[1] * RA * URY * ER - 34 * kalk]; }
function hamle(m, t, org) {
  const P = ustP(m.p), gir = m.gir ?? 0.42, kal = 0.1, cik = 0.34, t0 = m.t - gir;
  if (t < t0) return null;
  const u0 = H.unit(P, org), E = [P[0] + u0[0] * 780, P[1] + u0[1] * 780];
  let c = P, kalk = 0, el = null, durum = 0;
  if (t < m.t) { c = H.yay(E, P, ease.state(seg(t, t0, gir)), 0); kalk = 1 - ease.state(seg(t, m.t - 0.16, 0.16)); el = elNok(c, org, kalk); }
  else if (m.al == null || t < m.al - 0.3) { const w = ease.state(seg(t, m.t + kal, cik)); if (w < 0.99) { const e = elNok(P, org); el = [lerp(e[0], e[0] + u0[0] * 800, w), lerp(e[1], e[1] + u0[1] * 800, w)]; } }
  else {   // geri alma: el gelir (0,3 sn), altlığı kaldırıp götürür (0,4 sn)
    const e = elNok(P, org);
    if (t < m.al) { const w = ease.state(seg(t, m.al - 0.3, 0.3)); el = [lerp(e[0] + u0[0] * 800, e[0], w), lerp(e[1] + u0[1] * 800, e[1], w)]; }
    else { const w = ease.state(seg(t, m.al + 0.06, 0.4)); if (w >= 1) return null; kalk = ease.enter(seg(t, m.al, 0.14)); c = H.yay(P, E, w, 0); el = elNok(c, org, kalk); }
  }
  if (m.mercan) durum = -ease.state(seg(t, m.t - 0.02, 0.16));
  return { c, kalk, el, durum, kim: m.kim, temas: t >= m.t, m };
}
// Yer arama: el altlıkla durak durak gezer (altlık havada, mercan), sonra çekilir
function gezinti(t, kim, org, duraklar, t0, cik) {
  if (t < t0 - 0.45) return null;
  const P = duraklar.map(([tt, p]) => [tt, ustP(p)]), u0 = H.unit(P[0][1], org), E = [P[0][1][0] + u0[0] * 800, P[0][1][1] + u0[1] * 800];
  let c;
  if (t < P[0][0]) c = H.yay(E, P[0][1], ease.state(seg(t, t0 - 0.45, P[0][0] - t0 + 0.45)), 0);
  else { c = P[0][1]; for (let i = 1; i < P.length; i++) c = H.yay(c, P[i][1], ease.state(seg(t, P[i][0] - 0.3, 0.3)), 30); }
  const son = P[P.length - 1][1], uc = H.unit(son, org), w = ease.state(seg(t, cik, 0.4));
  if (w >= 1) return null;
  c = [lerp(c[0], son[0] + uc[0] * 800, w), lerp(c[1], son[1] + uc[1] * 800, w)];
  let titre = 0; for (const [tt] of P) titre += H.sars(t, tt, 0.4, 9);
  c = [c[0] + 9 * titre, c[1]];
  return { c, kalk: 1, el: elNok(c, org, 1), durum: -ease.state(seg(t, P[0][0] - 0.1, 0.2)), kim };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'ust1' || id === 'ust2' || id === 'cevap') ustSahne(K, t, S, B);
    else if (id === 'ocak') ocakSahne(K, t, tl, S, B);
    else odaSahne(K, t, tl, S, B);
  },
  ekran(K, t, { sc }) {
    // etiketler kamera kaymasıyla oynamasın: ekran yeri etiketin geldiği andaki kameradan hesaplanır
    const { tm } = S, id = sc.id, sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'ust1') {
      const p1 = sabit(tm.bin)([UC[0] + B0[0] * URX + 40, UC[1] + B0[1] * URY - 168]), hw1 = H.tag(K, t, tm.bin + 0.02, tm.binAl + 0.1, p1, K.up('binmek yok'), PAL.coral, PAL.paper, 48);
      H.mark(K, t, tm.bin + 0.1, tm.binAl + 0.1, [p1[0] + hw1 + 40, p1[1]], false);
      const p2 = sabit(tm.tas)([UC[0] + C0[0] * URX + 70, UC[1] + C0[1] * URY - 186]), hw2 = H.tag(K, t, tm.tas + 0.02, tm.tasAl + 0.05, p2, K.up('taşmak yok'), PAL.coral, PAL.paper, 48);
      H.mark(K, t, tm.tas + 0.1, tm.tasAl + 0.05, [p2[0] + hw2 + 40, p2[1]], false);
    }
    if (id === 'ust2') H.mark(K, t, tm.ara0 + 0.05, tm.sayac - 0.25, sabit(tm.ara0)([UC[0] + 0.76 * URX, UC[1] + 0.06 * URY]), false);
    if (id === 'cevap') {
      const p = sabit(tm.gezD[3])([UC[0] - 0.5 * URX, UC[1] - 1.08 * URY]), hw = H.tag(K, t, tm.gezD[3] + 0.1, tm.espri - 0.2, p, K.up('yer yok'), PAL.coral, PAL.paper, 48);
      H.mark(K, t, tm.gezD[3] + 0.18, tm.espri - 0.2, [p[0] + hw + 40, p[1]], false);
    }
  },
});

// ——— oda: masa başı (yüzler) ———
function odaSahne(K, t, tl, S, { heads, sc }) {
  const { tm } = S, id = sc.id, hop = H.buldumHop(t, tm.buldum), ust = [];
  M.mekanCiz(K, ODA, 'arka', t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= hop;
  // Hikmet sol el: çay bardağı (göğüs önünde; bahiste ve espride kalkar)
  const kalkB = H.kaldir(t, [[tm.kaz, tm.h3 + 2.0], [tm.cayV - 0.15, tm.topla - 0.1]]);
  const bL = (() => { const g = H.elYeri('hikmet', hp, 'L', 'gogus'), y = H.elYeri('hikmet', hp, 'L', 'yukari'); return [lerp(g[0], y[0] + 30, kalkB), lerp(g[1], y[1] + 40, kalkB)]; })();
  H.reach('hikmet', hp, 'L', bL, 1, 'A');
  // Hikmet sağ el: kancada altlığı masaya vurur · espride elindeki son altlığı Defne'ye atar
  let atis = null;
  if (id === 'oda') {
    // "masada" ve "kimse"de altlığa parmakla vurur (iddia)
    const A = odaP(A0), c = H.dus(t, 0, tm.koy0, [A[0] + 10, A[1] - 120], A), w = 1 - W(t, 2.25, 0.32);
    const vur = 26 * (Math.sin(Math.PI * seg(t, tm.vur1 - 0.26, 0.26)) + Math.sin(Math.PI * seg(t, tm.vur2 - 0.26, 0.26)));
    if (w > 0.01) { H.reach('hikmet', hp, 'R', [c[0] + 6, c[1] - 12 - vur], w); }
    ust.push(() => { altlik(K, c, RA * TRX, RA * TRY, BORDO, { kal: 6, kalk: t < tm.koy0 ? 0.3 : 0 }); if (w > 0.5) kolUst(K, 'hikmet', hp, 'R'); });
  }
  if (id === 'espri' || id === 'cta') {
    const g = H.elYeri('hikmet', hp, 'R', 'gogus'), geri = [g[0] - 20, g[1] - 40], ileri = [g[0] + 70, g[1] - 120];
    const sav = ease.state(seg(t, tm.at - 0.3, 0.3)) * (1 - ease.state(seg(t, tm.at + 0.15, 0.4)));
    H.reach('hikmet', hp, 'R', [lerp(geri[0], ileri[0], sav), lerp(geri[1], ileri[1], sav)], 1);
    atis = { birak: tm.at };
  }
  // Defne sağ el: bahiste deste göğüs önünde; buldumda havada altlık · sol el: sayaçta altlık, espride yakalar, çağrıda kaldırır
  if (id === 'bahis') H.reach('defne', dp, 'R', H.elYeri('defne', dp, 'R', 'gogus'), 1);
  let yakala = null;
  if (id === 'sayac') H.reach('defne', dp, 'L', H.elYeri('defne', dp, 'L', 'gogus'), 1);
  if (id === 'espri' || id === 'cta') {
    const g = H.elYeri('defne', dp, 'L', 'gogus'), uz = [g[0] - 70, g[1] - 70], yk = H.elYeri('defne', dp, 'L', 'yukari');
    const wU = W(t, tm.tut - 0.35, 0.3) * (1 - W(t, tm.tut + 0.25, 0.35)), wK = W(t, tm.cta + 0.05, 0.45);
    let e = [lerp(g[0], uz[0], wU), lerp(g[1], uz[1], wU)]; e = [lerp(e[0], yk[0] + 10, wK), lerp(e[1], yk[1] + 95, wK)];
    H.reach('defne', dp, 'L', e, 1, 'A'); yakala = true;
  }

  const h = oyna(K, t, tl, 'hikmet', hp, { heads });
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const d = oyna(K, t, tl, 'defne', dp, { heads });
  masaOda(K, t);
  // masadaki altlıklar (sahneye göre oyunun durumu)
  const masa = id === 'sayac' ? S.yanlis : (id === 'espri' || id === 'cta') ? S.dogru : [];
  for (const m of [...masa].sort((a, b) => a.p[1] - b.p[1])) altlik(K, odaP(m.p), RA * TRX, RA * TRY, m.kim === 'h' ? BORDO : TEAL, { kal: 6 });
  for (const f of ust) f();
  // ellerdeki nesneler
  bardak(K, h.handL[0], h.handL[1] + 34, 1.15); H.buhar(K, h.handL[0], h.handL[1] - 50, t, { k: 0.5, n: 2, ara: 22 }); h.tut('L');
  if (id === 'bahis') { deste(K, [d.handR[0], d.handR[1] + 22], 58, 17, TEAL, 6, 7); d.tut('R'); }
  if (id === 'sayac') { altlikYuz(K, [d.handL[0] + 4, d.handL[1] - 46], 60, TEAL, -0.1); d.tut('L'); }
  if (id === 'buldum') { altlikYuz(K, [d.handR[0], d.handR[1] - 54], 60, TEAL, 0.12); d.tut('R'); }
  if (atis) {   // Hikmet'in elindeki son altlık: Defne'ye uçar, Defne yakalar
    const A = [h.handR[0] + 6, h.handR[1] - 50], Bp = [d.handL[0] - 4, d.handL[1] - 50];
    const u = seg(t, tm.at, tm.tut - tm.at);
    if (t < tm.at) { altlikYuz(K, A, 60, BORDO, 0.1); h.tut('R'); }
    else if (t < tm.tut) altlikYuz(K, H.yay(A, Bp, u, 170), 60, BORDO, 0.1 + u * TAU * 0.75);
    if (t >= tm.tut && yakala) { altlikYuz(K, Bp, 60, BORDO, 0.1 + TAU * 0.75); d.tut('L'); }
  }
}

// ——— üstten: masanın üstü (kollar kadrajın kenarından girer) ———
function ustSahne(K, t, S, { heads, sc, cam }) {
  const { tm } = S, { ctx } = K, id = sc.id, rx = RA * URX, ry = RA * URY;
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.hikmet = ekrandan(20, 520); heads.defne = ekrandan(1060, 520);   // konuşanlar kadraj dışında: balon kuyruğu onlara yatar
  M.mekanCiz(K, UST, 'arka', t);
  const org = kim => kim === 'h' ? H_ORG : D_ORG, renk = o => o.kim === 'h' ? BORDO : TEAL;
  let liste = [];
  if (id === 'ust1') {
    // kancadaki A masada; "temiz"de Hikmet onu alır
    const a = hamle({ kim: 'h', p: A0, t: -1, gir: 0.1, al: tm.temiz }, t, H_ORG); if (a) { a.el = t > tm.temiz - 0.3 ? a.el : null; liste.push(a); }
    for (const m of S.kural) { const s = hamle(m, t, org(m.kim)); if (s) liste.push(s); }
  }
  if (id === 'ust2') {
    for (const m of S.yanlis) { const s = hamle(m, t, org(m.kim)); if (s) liste.push(s); }
    const g = gezinti(t, 'd', D_ORG, [[tm.ara0, GEZ_D[0]], [tm.ara1, GEZ_D[1]]], tm.ara0 - 0.1, tm.ara1 + 0.55); if (g) liste.push(g);
  }
  if (id === 'cevap') {
    for (const m of S.dogru) { const s = hamle(m, t, org(m.kim)); if (s) liste.push(s); }
    const g = gezinti(t, 'h', H_ORG, GEZ_H.map((p, i) => [tm.gezD[i], p]), tm.gez + 0.05, tm.espri + 0.2); if (g) liste.push(g);
  }
  // masadakiler önce, havadakiler sonra
  const yerde = liste.filter(s => s.kalk < 0.01), havada = liste.filter(s => s.kalk >= 0.01);
  for (const s of yerde) {
    const yes = s.m && id === 'cevap' && s.kim === 'd' ? H.nabiz(t, s.m.t, 0.6) * (s.m.t === S.dogru[0].t ? 1 : 0.9) : 0;
    altlik(K, s.c, rx, ry, renk(s), { durum: s.durum, yesil: yes });
  }
  // ortadan geçen kesik çizgi: Hikmet'in altlığından merkezden geçip karşı noktaya (doğru oyun)
  if (id === 'cevap') S.tm.cizgi.forEach(([a, b], i) => {
    const Hm = S.dogru[1 + 2 * i], Dm = S.dogru[2 + 2 * i], v = ease.state(seg(t, a, b - a)), sol = 1 - ease.state(seg(t, Dm.t + 0.2, 0.35));
    if (v <= 0.001 || sol <= 0.001) return;
    const p0 = ustP(Hm.p), p1 = ustP(Dm.p), q = [lerp(p0[0], p1[0], v), lerp(p0[1], p1[1], v)];
    ctx.save(); ctx.globalAlpha = sol; ctx.lineCap = 'round'; ctx.setLineDash([26, 18]);
    H.strokeLine(ctx, p0, q, 16, INK); H.strokeLine(ctx, p0, q, 8, PAL.cream);
    if (v > 0.85 && t < Dm.t) { ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.ellipse(p1[0], p1[1], rx, ry, 0, 0, TAU); ctx.lineWidth = 8; ctx.strokeStyle = PAL.cream; ctx.globalAlpha = sol * ease.state(seg(v, 0.85, 0.15)); ctx.stroke(); }
    ctx.restore();
    H.ring(K, UC, t, a, PAL.cream);
  });
  // ust1: "yer" — Hikmet'in parmağı boş masaya dokunur; "ilk hamle senin" — deste Defne'ye kayar
  let desteEl = null;
  if (id === 'ust1') {
    const D0 = ustP([-0.62, 0.06]), D1 = ustP([0.4, 0.06]), u = ease.state(seg(t, tm.ver0, tm.ver1 - tm.ver0 - 0.1)), al = ease.state(seg(t, tm.ver1 + 0.12, 0.45));
    if (t > tm.ver0 - 0.45 && al < 1) {
      const gir = ease.state(seg(t, tm.ver0 - 0.45, 0.45)), uh = H.unit(D0, H_ORG);
      let c = [lerp(D0[0] + uh[0] * 800, D1[0], 0), 0];
      c = t < tm.ver0 ? [lerp(D0[0] + uh[0] * 800, D0[0], gir), lerp(D0[1] + uh[1] * 800, D0[1], gir)] : [lerp(D0[0], D1[0], u), D0[1]];
      const ud = H.unit(D1, D_ORG); c = [lerp(c[0], D1[0] + ud[0] * 800, al), lerp(c[1], D1[1] + ud[1] * 800, al)];
      deste(K, [c[0], c[1] + 6], rx, ry, TEAL, 6, 9);
      desteEl = { c, ust: [c[0], c[1] - 5 * 9 + 6] };
    }
  }
  for (const s of havada) altlik(K, s.c, rx, ry, renk(s), { durum: s.durum, kalk: s.kalk });
  // eller (altlıkların üstünde)
  for (const s of liste) if (s.el) uzunKol(K, s.kim === 'h' ? 'hikmet' : 'defne', org(s.kim), s.el);
  if (id === 'ust1') {
    // parmak dokunuşu ("yer")
    const tp = ustP([0.05, -0.42]), w = pw(t, tm.yer - 0.05, tm.yer + 0.3, 0.3, 0.3);
    if (w > 0.01) { const uh = H.unit(tp, H_ORG), kalk = 22 * Math.sin(Math.PI * seg(t, tm.yer - 0.24, 0.24)); const el = [tp[0] + uh[0] * 70 + uh[0] * 800 * (1 - w), tp[1] + uh[1] * 70 - kalk + uh[1] * 800 * (1 - w)]; uzunKol(K, 'hikmet', H_ORG, el, [tp[0], tp[1] - kalk * 0.5]); }
    if (desteEl) {
      const wH = t < tm.ver1 + 0.05 ? 1 : 1 - ease.state(seg(t, tm.ver1 + 0.05, 0.35)), wD = ease.state(seg(t, tm.ver1 - 0.4, 0.3));
      const eh = [desteEl.ust[0] - rx * 0.62, desteEl.ust[1]], ed = [desteEl.ust[0] + rx * 0.62, desteEl.ust[1]], uh = H.unit(eh, H_ORG), ud = H.unit(ed, D_ORG);
      if (wH > 0.01) uzunKol(K, 'hikmet', H_ORG, [eh[0] + uh[0] * 800 * (1 - wH), eh[1] + uh[1] * 800 * (1 - wH)]);
      if (wD > 0.01) uzunKol(K, 'defne', D_ORG, [ed[0] + ud[0] * 800 * (1 - wD), ed[1] + ud[1] * 800 * (1 - wD)]);
    }
  }
  M.mekanCiz(K, UST, 'isik', t);
}

// ——— çay ocağı: Necmi sofrayı ortadan kurar ———
function ocakSahne(K, t, tl, S, { heads }) {
  const { tm } = S;
  M.mekanCiz(K, OCK, 'arka', t);
  const np = kisi('necmi', { x: NX, expr: 'mutlu', head: { tilt: 3, look: [0.1, 0.75] }, ...POZ.rahat });
  if (t > tm.n1 - 0.2) np.head.look = [0, 0.85];
  // yerler (tepsi üstü, y = taban)
  const yer = { dem: [NX, TEP[1] - 2], bR: [NX + 112, TEP[1] + 4], bL: [NX - 112, TEP[1] + 4], tR: [NX + 178, TEP[1] + 8], tL: [NX - 178, TEP[1] + 8] };
  // sağ el: demlik (sapından tutar) → ortaya; sonra tezgâhın altından bardak, sonra tabak
  const demHava = [NX + 150, 1215], demT = tm.dem;
  const demPos = t < demT - 0.6 ? demHava : t < demT ? H.tasi(t, demT - 0.6, 0.6, demHava, yer.dem, 50) : yer.dem;
  // tezgâhın altından çıkan nesne yolu: gizli → tepe (tp) → temas (tc)
  const cik = (tc, p) => { const gz = [p[0] + 30, 1460], tep = [p[0], p[1] - 70]; if (t < tc - 0.75) return { p: gz, gizli: true }; if (t < tc - 0.25) { const u = ease.state(seg(t, tc - 0.75, 0.5)); return { p: [lerp(gz[0], tep[0], u), lerp(gz[1], tep[1], u)], gizli: u < 0.55 }; } return { p: H.yay(tep, p, ease.state(seg(t, tc - 0.25, 0.25)), 0), gizli: false }; };
  const bRo = cik(tm.bR, yer.bR), bLo = cik(tm.bL, yer.bL), tRo = cik(tm.tab, yer.tR), tLo = cik(tm.tab, yer.tL);
  // el hedefleri
  let hR, wR = 1, hL, wL = 1, sil = false;
  if (t < demT + 0.15) hR = [demPos[0] + 64, demPos[1] - 60];
  else if (t < tm.tab - 0.8) { const o = t < tm.bR + 0.15 ? bRo : null; hR = o ? [o.p[0] + 22, o.p[1] - 34] : [yer.bR[0] + 40, 1360]; if (!o) wR = 1 - W(t, tm.bR + 0.15, 0.3) * 0; }
  else hR = [tRo.p[0] + 40, tRo.p[1] - 16];
  if (t < tm.n1 + 0.4) { const a = t * 7.5; hL = [NX - 120 + 34 * Math.cos(a), TEP[1] - 12 + 10 * Math.sin(a)]; sil = true; }
  else if (t < tm.tab - 0.8) { const o = t < tm.bL + 0.15 ? bLo : null; hL = o ? [o.p[0] - 22, o.p[1] - 34] : [yer.bL[0] - 40, 1360]; if (t < tm.bL - 0.75) hL = [NX - 160, 1380]; }
  else hL = [tLo.p[0] - 40, tLo.p[1] - 16];
  const a = oyna(K, t, tl, 'necmi', np, { heads, R: [hR, wR, 'B'], L: [hL, wL, 'B'] });
  // tezgâhın arkasında kalanlar (gizli nesneler)
  if (bRo.gizli && t < tm.bR) bardak(K, bRo.p[0], bRo.p[1], 1.05);
  if (bLo.gizli && t < tm.bL) bardak(K, bLo.p[0], bLo.p[1], 1.05);
  if (tRo.gizli) tabak(K, tRo.p[0], tRo.p[1]); if (tLo.gizli) tabak(K, tLo.p[0], tLo.p[1]);
  M.mekanCiz(K, OCK, 'on', t);
  // tepsi
  K.ell(TEP[0], TEP[1] + 8, TEP_RX, TEP_RY, '#9FAAA0', LW); K.ell(TEP[0], TEP[1], TEP_RX, TEP_RY, PAL.metal, LW); K.ell(TEP[0], TEP[1], TEP_RX - 22, TEP_RY - 7, '#A9B6AC', LW * 0.6);
  K.rect(NX - 360, TEP[1] - 4, 70, 24, PAL.cream, LW * 0.6, 6);   // bez yeri (sildikten sonra)
  // tepsidekiler
  const dk = demlik(K, demPos[0], demPos[1], 1.0);
  if (t > demT - 0.1) H.buhar(K, demPos[0] - 82, demPos[1] - 96, t, { k: 0.55, n: 2, ara: 20 });
  for (const [o, tc] of [[bRo, tm.bR], [bLo, tm.bL]]) if (!o.gizli) bardak(K, o.p[0], o.p[1], 1.05);
  for (const o of [tRo, tLo]) if (!o.gizli) tabak(K, o.p[0], o.p[1]);
  // tutan eller (nesnenin üstünde)
  if (t < demT + 0.15) kolUst(K, 'necmi', np, 'R');
  else if ((t < tm.bR + 0.15 && !bRo.gizli) || (t >= tm.tab - 0.8 && !tRo.gizli)) kolUst(K, 'necmi', np, 'R');
  if (sil) { K.rect(a.handL[0] - 32, a.handL[1] - 8, 64, 26, PAL.cream, LW * 0.7, 8); kolUst(K, 'necmi', np, 'L'); }
  else if ((t < tm.bL + 0.15 && t > tm.bL - 0.75 && !bLo.gizli) || (t >= tm.tab - 0.8 && !tLo.gizli)) kolUst(K, 'necmi', np, 'L');
  void dk;
}
