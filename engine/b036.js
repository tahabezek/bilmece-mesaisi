// Bölüm 36 · YEMEKTEKİ YALANCILAR (v4 "hikâye" dili; storyboard: hikayeler/bolum_036_v5.md).
// Logline: Ofisin akşam yemeğinde yuvarlak masadaki herkes "Solumdaki yalancı" demiştir; Hikmet yedi kişi saymıştır.
// Defne bayrakları sırayla diker, yedinci yerde iki doğrucu yan yana gelir: yedi kişiyle tur kapanmaz. Masa örtüsünün
// altından Kerem çıkar, sekizinci yer açılır ve doğrucu–yalancı dizisi tam kapanır.
// Akılda kalacak tek şey: herkes "solumdaki yalancı" diyorsa doğrucu ile yalancı sırayla oturur; böyle bir masada kişi sayısı tek olamaz.
// Üç set aynı dünyada yan yana durur: oda (masa başı, yüzler; Defne solda, Hikmet sağda) · üstten (masanın üstü; kollar
// kadrajın kenarından girer: Defne soldan, Hikmet sağdan, Kerem üst kenardan) · büfe (Necmi'nin tepsisi).
// Yerler masa biriminde (masa yarıçapı = 1); iki görünüş aynı yerleri kendi izdüşümüyle çizer. "Sol" kuralı: masaya
// dönük oturan kişinin solu, üstten bakışta ekran açısının arttığı yöndür (i → i + 1). Boşluk (yedinci ile birinci
// arası, Kerem'in yeri) masanın arkasındadır (270°); Kerem orada yerde yatar, ayakkabısının ucu kare 0'dan beri örtünün
// önünden görünür. Kerem'in solu Hikmet'in yeridir (0): odada Kerem sağa, Hikmet'i gösterir.
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b036_oda', UST = 'b036_ust', BUF = 'b036_bufe', BX = 3000, OX = 6000;
const GAP = 270, HALKA = 0.70, PR = 0.17, ORTU = 1.1;
const A7 = i => GAP + (i + 0.5) * 360 / 7, A8 = i => GAP + (i + 1) * 45;
const pol = (a, r) => [r * Math.cos(a * D), r * Math.sin(a * D)];
// oda: masa yatık elips; Defne solda, Hikmet sağda (masanın arkasında); örtü yere kadar
const TC = [545, 1250], TRX = 290, TRY = 90, ETEK = 1468, DEF_X = 345, HIK_X = 750, KER_X = 545;
// üstten
const UC = [BX + 540, 900], URX = 400, URY = 300;
const D_ORG = [BX - 430, 1150], H_ORG = [BX + 1510, 760];
// büfe: tezgâh, tepsi
const NX = OX + 540, TEZ = 1206, TEP = [NX, 1282], TEP_RX = 132, TEP_RY = 66;
const odaP = ([u, v]) => [TC[0] + u * TRX, TC[1] + v * TRY];
const ustP = ([u, v]) => [UC[0] + u * URX, UC[1] + v * URY];
const YESIL = PAL.green, MERCAN = PAL.coral;
const RENK = i => i % 2 ? MERCAN : YESIL;                  // Defne'nin dizisi: 0 doğrucu (Hikmet'in yeri), sonra sırayla
const KURDAN = [-0.3, 0.05];                               // kürdanlık (bayraklar) masada

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));

// Mantık denetimi (build anında): n kişilik masada herkes "solumdaki yalancı" diyorsa her kişi solundakinin tersidir;
// dizi ancak n çiftse kapanır. Yedi kişide çelişki, sekizde kapanış.
function kapanir(n) { for (const ilk of [true, false]) { const s = [ilk]; for (let i = 1; i < n; i++) s.push(!s[i - 1]); if (s[n - 1] !== s[0]) return true; } return false; }
if (kapanir(7) || !kapanir(8)) console.warn('b036: mantık denetimi tutmadı');

// ═══════════════════════════ Nesneler ═══════════════════════════
// Kürdan bayrak: (x, y) dibi; sap dik, üçgen bayrak sağa
function bayrak(K, [x, y], renk, k = 1, { kab = 0, rot = 0 } = {}) {
  const { ctx } = K, s = k * (1 + 0.28 * kab);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  K.line(0, 0, 0, -66, 9, INK); K.line(0, 0, 0, -66, 4.5, '#E3C893');
  K.poly([[0, -66], [44, -55], [0, -42]], renk, 4.5);
  ctx.restore();
}
// Tabak (üstten / yatık): rx, ry; içinde dünkü yemekten kalan pilav ve iki köfte
function tabak(K, [x, y], rx, ry, { yemek = true } = {}) {
  const lw = Math.max(3, LW * Math.min(1, rx / 70));
  K.ell(x, y + ry * 0.12, rx, ry, '#D9D0BE', lw); K.ell(x, y, rx, ry, PAL.cream, lw); K.ell(x, y, rx * 0.68, ry * 0.68, '#F1E9D8', lw * 0.5);
  if (yemek) {
    K.ell(x - rx * 0.12, y - ry * 0.05, rx * 0.34, ry * 0.3, '#F6EED6', lw * 0.5);
    K.ell(x + rx * 0.28, y + ry * 0.12, rx * 0.15, ry * 0.15, '#8A4B2A', lw * 0.5); K.ell(x + rx * 0.14, y + ry * 0.3, rx * 0.13, ry * 0.13, '#8A4B2A', lw * 0.5);
  }
}
// Çatal (üstten): tabağın içinde, a yönüne bakar
function catal(K, [x, y], a, L = 74) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.line(-L * 0.5, 0, L * 0.18, 0, 12, INK); K.line(-L * 0.5, 0, L * 0.18, 0, 6, '#C9CFC6');
  for (const o of [-9, -3, 3, 9]) { K.line(L * 0.18, o * 0.8, L * 0.5, o, 6, INK); K.line(L * 0.18, o * 0.8, L * 0.5, o, 2.5, '#C9CFC6'); }
  K.rect(L * 0.12, -11, 12, 22, '#C9CFC6', 3, 4);
  ctx.restore();
}
// Kürdanlık: küçük bardak, içinde bayraklar (n kaldı)
function kurdanlik(K, [x, y], k, n, { kabY = 0, kabM = 0 } = {}) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const dizi = [[-14, -0.22, 1], [-5, -0.08, 0], [4, 0.06, 1], [12, 0.18, 0], [-10, -0.32, 0], [9, 0.3, 1]].slice(0, n);
  for (const [dx, r, m] of dizi) bayrak(K, [dx, -28], m ? MERCAN : YESIL, 0.82, { kab: m ? kabM : kabY, rot: r });
  K.poly([[-24, -36], [24, -36], [18, 0], [-18, 0]], '#CFE3DD', LW * 0.7); K.ell(0, -36, 24, 6, '#E8F2EF', LW * 0.5);
  ctx.restore();
}
// Çay bardağı (y = taban)
function cayB(K, x, y, k = 1, { halka = 0 } = {}) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (halka > 0.02) { ctx.save(); ctx.globalAlpha = halka; K.ell(0, 0, 44, 13, null, 0); ctx.beginPath(); ctx.ellipse(0, -2, 48, 15, 0, 0, TAU); ctx.lineWidth = 12; ctx.strokeStyle = MERCAN; ctx.stroke(); ctx.restore(); }
  K.ell(0, 0, 30, 8, PAL.cream, LW * 0.55);
  K.poly([[-18, -62], [18, -62], [11, -36], [19, -11], [13, -2], [-13, -2], [-19, -11], [-11, -36]], '#B5532A', LW * 0.6);
  K.rect(-18, -66, 36, 13, '#F1E6D2', LW * 0.5, 3);
  ctx.restore();
}
// Su bardağı (y = taban): düz, açık mavi su
function suB(K, x, y, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.poly([[-19, -70], [19, -70], [15, -2], [-15, -2]], '#EAF4F2', LW * 0.6);
  K.poly([[-17, -46], [17, -46], [15, -5], [-15, -5]], '#9FD0D6', 0); K.line(-17, -46, 17, -46, 3, '#6FAEB8');
  K.line(-9, -62, -7, -16, 4, '#FFFFFF');
  ctx.restore();
}
// Çift demlik (y = taban)
function demlik(K, x, y, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.line(46, -78, 78, -40, 13); K.line(46, -78, 78, -40, 6, PAL.metalDark);
  K.poly([[-56, -6], [56, -6], [50, -78], [-50, -78]], PAL.metal, LW); K.ell(0, -4, 56, 9, PAL.metalDark, LW * 0.7);
  K.poly([[-50, -46], [-86, -74], [-80, -82], [-48, -62]], PAL.metal, LW * 0.8);
  K.ell(0, -80, 44, 10, PAL.metalDark, LW * 0.7);
  K.poly([[-28, -82], [28, -82], [36, -100], [30, -122], [-30, -122], [-36, -100]], PAL.red, LW * 0.8); K.line(-34, -100, 34, -100, 7, PAL.cream);
  K.ell(0, -123, 30, 7, '#A8382A', LW * 0.6); K.circ(0, -133, 8, PAL.cream, LW * 0.6);
  ctx.restore();
}
// Önkol + el, nesnenin üstüne
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Üstten planda kol: kadraj dışındaki org noktasından ele uzanan yen + el (hedef varsa işaret parmağı)
function uzunKol(K, key, org, el, hedef, S = 300) {
  const c = H.CARDS[key], { ctx } = K, w = c.arm.w * S, lw = c.line * S, u = H.unit(el, org), bilek = [el[0] + u[0] * 44 * S / 300, el[1] + u[1] * 44 * S / 300];
  ctx.save(); ctx.lineCap = 'butt';
  for (const [ww, col] of [[w + lw * 2, INK], [w, c.arm.color]]) H.strokeLine(ctx, org, bilek, ww, col);
  H.strokeLine(ctx, [bilek[0] + u[0] * 12, bilek[1] + u[1] * 12], bilek, w + lw * 2, INK); H.strokeLine(ctx, [bilek[0] + u[0] * 14, bilek[1] + u[1] * 14], [bilek[0] + u[0] * 4, bilek[1] + u[1] * 4], w, c.arm.shade);
  ctx.restore();
  if (hedef) H.isaret(K, key, el, S, hedef, 1.25); else H.grip(K, key, el, S);
}

// ═══════════════════════════ Masa durumu (iki görünüş aynı durumu okur) ═══════════════════════════
// Yer açıları: 7'li düzen → (Kerem çıkınca) 8'li düzen. Bayraklar: dikilme anı ve renk izi.
function masaDurumu(t, S) {
  const { tm } = S, ac = ease.state(seg(t, tm.ac0, tm.ac1 - tm.ac0));
  const yerler = [];
  for (let i = 0; i < 7; i++) {
    const a = lerp(A7(i), A8(i), ac);
    let renk = null, kab = 0;
    if (t >= tm.dik[i]) renk = RENK(i);
    if (i === 6 && t >= tm.sw.dik) renk = MERCAN;                  // ikinci deneme: mercan dikilir
    if (i === 6 && t >= tm.cv.yesil) renk = YESIL;                 // cevapta yeniden yeşil (çelişki birinciyle)
    yerler.push({ i, a, p: pol(a, HALKA), renk, yesilEk: i === 6 && t >= tm.sw.dik && t < tm.sw.al, mercanEk: i === 6 && t >= tm.cv.yesil && t < tm.cv.cekMercan, kab });
  }
  const kerem = t >= tm.kTab - 0.4 ? { a: GAP, r: lerp(1.02, HALKA, ease.state(seg(t, tm.kTab - 0.4, 0.4))), renk: t >= tm.kDik ? MERCAN : null } : null;
  return { yerler, kerem, ac };
}
// Bayrak vurgusu (nabız) ve çelişki yanıp sönmesi
function vurgu(t, S, i) {
  const { tm } = S; let k = 0;
  for (const [tt, j] of tm.cv.dokun) if (j === i) k = Math.max(k, H.nabiz(t, tt, 0.34));
  for (const [tt, j] of tm.halkaSira) if (j === i) k = Math.max(k, H.nabiz(t, tt, 0.34));
  return k;
}
function catisma(t, S) {   // [i, j, alfa] çiftleri (mercan yanıp sönen halka)
  const { tm } = S, out = [], blink = (a, b) => (t >= a && t < b) ? 0.55 + 0.45 * Math.cos(TAU * (t - a) / 0.42) : 0;
  const a1 = blink(tm.cat1, tm.sw.dik); if (a1) out.push([6, 0, a1]);
  const a2 = blink(tm.cat2, tm.cv.yesil); if (a2) out.push([5, 6, a2]);
  const a3 = blink(tm.cat3, tm.kTab - 0.6); if (a3) out.push([6, 0, a3]);
  return out;
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
// Oda: yuvarlak masa, yere kadar örtü (keten, petrol şeritli)
function masaOda(K, t, S, { ayakkabi = true } = {}) {
  const { ctx } = K, [x, y] = TC;
  ctx.save(); ctx.globalAlpha = 0.25; K.ell(x, ETEK + 22, TRX + 40, 26, INK, 0); ctx.restore();
  // etek: ön yarım elips + yere inen kumaş, fistolu alt kenar
  ctx.beginPath(); ctx.moveTo(x - TRX - 6, y); ctx.lineTo(x - TRX - 18, ETEK);
  const n = 12; for (let i = 0; i < n; i++) { const x0 = x - TRX - 18 + (2 * TRX + 36) * i / n, x1 = x - TRX - 18 + (2 * TRX + 36) * (i + 1) / n; ctx.quadraticCurveTo((x0 + x1) / 2, ETEK + 14, x1, ETEK); }
  ctx.lineTo(x + TRX + 6, y); ctx.ellipse(x, y, TRX + 6, TRY + 4, 0, 0, Math.PI); ctx.closePath(); K.fs('#EFE5D2');
  for (let i = 1; i < 8; i++) { const fx = x - TRX + 2 * TRX * i / 8, fy = y + TRY * Math.sqrt(Math.max(0, 1 - ((fx - x) / TRX) ** 2)); K.line(fx, fy + 10, fx + (fx - x) * 0.05, ETEK - 6, 3, '#D8CBB2'); }
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y + 26, TRX + 7, TRY + 5, 0, 0.05, Math.PI - 0.05); ctx.lineWidth = 12; ctx.strokeStyle = '#3E6E6F'; ctx.stroke(); ctx.restore();
  K.ell(x, y, TRX + 6, TRY + 4, '#F6EEDF', LW);
  if (ayakkabi) {   // Kerem'in ayakkabılarının ucu: örtünün altında yerde yatıyor, ayakları öne doğru
    for (const dx of [-24, 24]) { K.ell(x + dx, ETEK + 6, 20, 12, '#2B3A4A', LW * 0.7); K.ell(x + dx, ETEK + 13, 20, 6, PAL.cream, LW * 0.5); }
  }
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, TRX - 18, TRY - 8, 0, 0, TAU); ctx.lineWidth = 3; ctx.setLineDash([16, 12]); ctx.strokeStyle = '#C9B996'; ctx.stroke(); ctx.restore();
  void t; void S;
}
M.mekanEkle(ODA, {
  gen: [0, 1080], dongu: ['pencerede martı', 'duvar saatinin saniye kolu'],
  capa: { masa: TC }, kadraj: { genis: [1.22, 545, 1085], defne: [1.38, 368, 1010] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1600, isik });
    M.pencere(K, 640, 470, 380, 400, { isik, t: t + 5 });
    // perde (iki yanda)
    for (const [x0, s] of [[600, 1], [1060, -1]]) K.poly([[x0, 440], [x0 + 70 * s, 440], [x0 + 60 * s, 900], [x0 - 8 * s, 900]], '#C7A35A', LW);
    K.rect(580, 428, 520, 18, PAL.woodDark, LW * 0.7, 6);
    // çerçeveli resim (yazısız) ve duvar saati
    K.rect(150, 520, 230, 170, PAL.woodDark, LW, 6); K.rect(168, 538, 194, 134, '#CFE3DD', LW * 0.6, 3);
    K.poly([[168, 672], [240, 590], [292, 640], [330, 600], [362, 672]], '#5E9A4E', LW * 0.5); K.circ(320, 572, 16, PAL.mustard, LW * 0.5);
    M.duvarSaati(K, 470, 600, 44, 9.6, t);
    // köşede saksı
    for (let i = 0; i < 5; i++) H.yaprak(K, 1010, 1260, 200 + (i % 2) * 50, -0.85 + i * 0.42 + 0.04 * Math.sin(t * 1.1 + i), i % 2 ? PAL.green : '#4C8240', 1);
    K.poly([[962, 1260], [1058, 1260], [1046, 1370], [974, 1370]], PAL.mustard, LW);
  },
});
// Üstten: ahşap parke, sandalyeler, örtülü masa; ışık şeridinde perde gölgesi (döngü) ve köşede çay buharı (döngü)
function sandalyeUst(K, x, y, a) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-78, -62, 156, 124, PAL.wood, LW, 16); K.rect(-66, -50, 132, 100, '#B07A44', LW * 0.6, 12); K.rect(-86, 58, 172, 34, PAL.woodDark, LW, 12);
  ctx.restore();
}
function ortuUst(K) {
  const { ctx } = K, [x, y] = UC, rx = URX * ORTU, ry = URY * ORTU;
  ctx.save(); ctx.globalAlpha = 0.26; K.ell(x + 18, y + 26, rx + 6, ry + 6, INK, 0); ctx.restore();
  // fistolu kenar
  ctx.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, r = 1 + 0.018 * Math.cos(a * 32); const px = x + Math.cos(a) * rx * r, py = y + Math.sin(a) * ry * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); K.fs('#F6EEDF');
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, rx * 0.93, ry * 0.93, 0, 0, TAU); ctx.lineWidth = 12; ctx.strokeStyle = '#3E6E6F'; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, URX * 0.95, URY * 0.95, 0, 0, TAU); ctx.lineWidth = 3; ctx.setLineDash([16, 12]); ctx.strokeStyle = '#C9B996'; ctx.stroke(); ctx.restore();
}
M.mekanEkle(UST, {
  gen: [BX, BX + 1080], dongu: ['ışık şeridinde perde gölgesi', 'köşede çay buharı'],
  capa: { masa: UC }, kadraj: { masa: [1.12, BX + 540, 925] },
  arka(K, t) {
    const { ctx } = K; ctx.fillStyle = '#B48A57'; ctx.fillRect(BX - 900, -400, 2900, 2800);
    for (let i = -10; i < 30; i++) K.line(BX - 900, -400 + i * 110, BX + 2000, -400 + i * 110, 3, '#A27A4A');
    for (let i = -10; i < 30; i++) for (let j = 0; j < 12; j++) K.line(BX - 900 + j * 260 + (i % 2) * 130, -400 + i * 110, BX - 900 + j * 260 + (i % 2) * 130, -290 + i * 110, 3, '#A27A4A');
    // köşe sehpası, çay bardağı (buhar döngüsü)
    K.ell(BX + 990, 1360, 110, 80, PAL.woodDark, LW); K.ell(BX + 990, 1348, 110, 80, PAL.woodTop, LW);
    K.ell(BX + 965, 1342, 40, 29, PAL.cream, LW * 0.7); K.ell(BX + 965, 1336, 24, 17, '#B5532A', LW * 0.6); K.ell(BX + 965, 1336, 14, 10, '#7E3518', 0);
    H.buhar(K, BX + 965, 1312, t, { k: 0.7, n: 2, ara: 30 });
  },
  isik(K, t) {   // pencereden düşen ışık şeridi; perdenin gölgesi salınır
    const { ctx } = K, s = 26 * Math.sin(t * 1.3);
    ctx.save(); ctx.globalAlpha = 0.13; ctx.fillStyle = '#FFF4D6';
    ctx.beginPath(); ctx.moveTo(BX - 200, 200); ctx.lineTo(BX + 340, 200); ctx.lineTo(BX + 860, 1700); ctx.lineTo(BX + 320, 1700); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 0.08; ctx.fillStyle = INK;
    ctx.beginPath(); ctx.moveTo(BX - 200, 200); ctx.lineTo(BX - 120 + s, 200); ctx.quadraticCurveTo(BX + 300 + s * 2, 900, BX + 420 + s, 1700); ctx.lineTo(BX + 320, 1700); ctx.closePath(); ctx.fill();
    ctx.restore();
  },
});
M.mekanEkle(BUF, {
  gen: [OX, OX + 1080], dongu: ['semaverde buhar', 'duvar saatinin saniye kolu'],
  capa: { tepsi: TEP }, kadraj: { necmi: [1.45, NX, 1200] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: OX - 600, x1: OX + 1700, isik });
    M.duvarSaati(K, OX + 820, 760, 50, 9.6, t);
    // arka büfe: raf ve fincanlar; demlik buharı
    K.rect(OX + 20, 1010, 380, 500, PAL.wood, LW); K.rect(OX, 990, 420, 30, PAL.woodTop, LW, 6);
    demlik(K, OX + 140, 992, 0.85); H.buhar(K, OX + 68, 910, t, { k: 0.8 });
    K.rect(OX + 30, 760, 380, 18, PAL.woodTop, LW, 5);
    for (let i = 0; i < 4; i++) { K.ell(OX + 80 + i * 90, 752, 30, 8, PAL.cream, LW * 0.5); K.rect(OX + 58 + i * 90, 708, 44, 42, ['#CFE3DD', PAL.cream, '#E6C98E', '#CFE3DD'][i], LW * 0.6, 8); }
  },
  on(K) {   // ön tezgâh: üst yüz (tepsinin oturduğu), ön kenar, kapaklar
    K.rect(OX - 400, TEZ, 1900, 130, PAL.woodTop, LW, 0);
    K.rect(OX - 400, TEZ + 130, 1900, 26, PAL.woodDark, LW, 0);
    K.rect(OX - 400, TEZ + 156, 1900, 700, PAL.wood, LW, 0);
    for (let i = 0; i < 5; i++) { K.rect(OX - 150 + i * 290, TEZ + 180, 260, 260, '#B07A44', LW * 0.8, 10); K.rect(OX - 40 + i * 290, TEZ + 200, 40, 14, PAL.metalDark, LW * 0.6, 6); }
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05, koy0: 0.3,
    yedi: T('h1:3'), sucla: T('h1:7'),
    h2a: T('h2a'), kurd: T('h2a:1') + 0.1, dogru: T('h2a:5') - 0.04, yalan: T('h2a:9') - 0.04, etiketSon: T('h2b:3'),
    h2b: T('h2b'), sol: T('h2b:4') - 0.02,
    h2c: T('h2c'), yanlis: T('h2c:3'), al: T('h2c:5') - 0.25,
    d2: T('d2'), hd: T('hd'),
    sayac: cd0 + 1.5, bak: cd - 0.75, bufe: cd - 0.05,
    n1: T('n1'), son: T('n1:6'), yine: T('n1:8'),
    cevap: T('d3:2') - 0.1,
    espri: T('h4') - 0.2, kerem: T('h4'), goster: T('h4:2') - 0.12,
    cta: T('d6') - 0.15,
  };
  // yanlış deneme: Defne yedi bayrağı sırayla diker (d2 boyunca), Hikmet iki yeşile dokunur, çelişki
  const p0 = T('d2') + 0.18, dd = (T('hd:1') - 0.05 - p0) / 6;
  tm.dik = [0, 1, 2, 3, 4, 5, 6].map(i => p0 + i * dd);
  tm.hDok = [T('hd:2'), T('hd:4')];
  tm.cat1 = T('hd:5') - 0.06;
  // ikinci deneme (sayaçta, sessiz): yedinciye mercan dikilir, yeşil çekilir; bu kez beşinciyle çakışır
  tm.sw = { gir: cd0 - 0.05, dik: cd0 + 0.35, al: cd0 + 0.6, cik: cd0 + 0.75 };
  tm.cat2 = tm.sw.al + 0.15;
  // cevap: parmak yerleri sırayla gezer; yedincide yeşil geri dikilir; birinciyle çakışır
  tm.cv = {
    gir: T('d4') - 0.45,
    dokun: [[T('d4'), 0], [T('d4:2') - 0.04, 1], [T('d4:3'), 1], [T('d4:5') - 0.04, 2], [T('d4:6'), 3], [T('d4:6') + 0.25, 4], [T('d4:6') + 0.5, 5], [T('d4:7') - 0.05, 6]],
  };
  tm.cv.yesil = T('d4:7') + 0.12; tm.cv.cekMercan = tm.cv.yesil + 0.2; tm.cv.bir = T('d4:8') + 0.12; tm.cv.cik = T('d5') - 0.35;
  tm.cat3 = tm.cv.bir + 0.06;
  // Kerem: örtü kabarır, başı çıkar; yerler açılır; tabağını iter, mercan bayrağını diker; tur kapanır
  tm.kabar = T('d5') + 0.02; tm.kBas = T('d5') + 0.2; tm.kBay = T('d5:2') - 0.1;
  tm.ac0 = T('d5:3') - 0.1; tm.ac1 = T('d5:4') + 0.12; tm.kTab = T('d5:5') + 0.02; tm.kDik = T('d5:6') - 0.08;
  tm.halka0 = T('d5:6') + 0.12;
  tm.halkaSira = [0, 1, 2, 3, 4, 5, 6, 7].map(k => [tm.halka0 + k * 0.06, k]);
  tm.tamam = T('d5:7') - 0.04;
  // büfe: Necmi bardakları dizer. Sıra masadakiyle aynı: 3 (ön), 4, 5, 6, 0, 1 → son çay 2'ye (3'ün yanına)
  tm.bar = [0, 1, 2, 3, 4, 5].map(k => cd + 0.22 + k * 0.45);
  tm.sonCik = tm.bar[5] + 0.12; tm.sonUst = T('n1:8') - 0.06;

  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, 1.26, 545, 1080], [1.0, ...M.kadraj(ODA, 'genis')], [3.6, 1.24, 552, 1080]] },
    { id: 'ust1', t0: tm.h2a - 0.08, cam: [[0, ...M.kadraj(UST, 'masa')], [tm.h2b, 1.14, BX + 540, 920], [tm.sol, 1.16, BX + 540, 915]] },
    { id: 'soru', t0: tm.h2c - 0.1, cam: [[0, 1.32, 540, 1060], [T('h2c:5'), 1.35, 525, 1060]] },
    { id: 'ust2', t0: tm.d2 - 0.12, cam: [[0, ...M.kadraj(UST, 'masa')], [tm.hd, 1.15, BX + 545, 915], [cd0 - 0.25, 1.2, BX + 480, 770]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 1.2, 545, 1085], [tm.bufe - 0.3, 1.22, 550, 1080]] },
    { id: 'bufe', t0: tm.bufe, cam: [[0, ...M.kadraj(BUF, 'necmi')], [T('n1:6'), 1.46, NX + 10, 1205]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...M.kadraj(UST, 'masa')], [T('d4:6'), 1.14, BX + 540, 920], [T('d5'), 1.16, BX + 540, 890], [T('d5:7'), 1.13, BX + 540, 905]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.26, 545, 1075], [tm.goster - 0.1, 1.38, 640, 1030]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.4, 362, 1012], [tm.cta + 1.5, 1.45, 362, 1006]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.85, 0.15] }, ...POZ.dur });
  const hik = [
    [tm.koy0 + 0.2, { head: { tilt: -6, look: [-0.6, 0.5] } }, 0.3],
    [tm.yedi, { expr: 'mutlu', head: { tilt: -3, look: [-0.85, 0.2] } }, 0.3],
    [tm.sucla, { expr: 'saskin', head: { tilt: 4, look: [-0.9, 0.05] } }, 0.25],
    [tm.h2c - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [-0.9, 0.05] } }, 0.01],
    [tm.yanlis, { head: { tilt: -7, look: [-0.6, 0.5] } }, 0.3],
    [tm.al, { head: { tilt: -3, look: [-0.7, 0.4] } }, 0.35],
    [tm.sayac, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.1] }, ...POZ.belde }, 0.01],
    [tm.bak, { expr: 'notr', head: { tilt: -4, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'saskin', armL: POZ.dur.armL, head: { tilt: -3, look: [-0.9, 0.05] } }, 0.01],
    [tm.espri, { expr: 'saskin', head: { tilt: -4, look: [-0.9, 0.1] } }, 0.01],
    [tm.kerem + 0.25, { expr: 'mutlu', head: { tilt: -6, look: [-0.95, 0] } }, 0.3],
    [tm.goster + 0.3, { expr: 'yorgun', head: { tilt: 5, look: [-0.8, 0.2] } }, 0.3],
    [tm.cta, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.1] } }, 0.3],
  ];
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 4, look: [0.8, 0.2] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: -5, look: [0.85, 0.1] } }, 0.4],
    [tm.sucla, { expr: 'saskin', head: { tilt: 6, look: [0.85, 0.15] } }, 0.25],
    [tm.h2c - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.85, 0.15] } }, 0.01],
    [tm.al - 0.3, { expr: 'mutlu', head: { tilt: 5, look: [0.5, 0.7] } }, 0.3],
    [tm.sayac, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.4, -0.5] } }, 0.01],
    [tm.sayac + 0.9, { head: { tilt: -6, look: [0.5, 0.5] } }, 0.35],
    [tm.bak, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -5, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.06, {}, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.espri, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.85, 0.1] } }, 0.01],
    [tm.goster, { expr: 'mutlu', head: { tilt: 6, look: [0.9, 0.05] } }, 0.3],
    [tm.cta - 0.05, { head: { tilt: -7, look: [0.1, 0.05] } }, 0.35],
  ];
  return { tm, film, hik, hikBase, def, defBase };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'ust1' || id === 'ust2' || id === 'cevap') ustSahne(K, t, S, B);
    else if (id === 'bufe') bufeSahne(K, t, tl, S, B);
    else odaSahne(K, t, tl, S, B);
  },
  ekran(K, t, { sc }) {
    // etiketler kamera kaymasıyla oynamasın: ekran yeri etiketin geldiği andaki kameradan hesaplanır
    const { tm } = S, id = sc.id, sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'ust1') {
      H.tag(K, t, tm.dogru, tm.etiketSon, sabit(tm.dogru)([UC[0] + 70, UC[1] - 70]), K.up('doğrucu'), YESIL, PAL.paper, 48);
      H.tag(K, t, tm.yalan, tm.etiketSon, sabit(tm.yalan)([UC[0] + 70, UC[1] + 30]), K.up('yalancı'), MERCAN, PAL.paper, 48);
    }
    const arada = (i, j, r = HALKA) => { const a = j === 0 && i === 6 ? (A7(6) + A7(0) + 360) / 2 : (A7(i) + A7(j)) / 2; return ustP(pol(a, r)); };
    if (id === 'ust2') {
      H.mark(K, t, tm.cat1 + 0.05, tm.sw.dik - 0.1, sabit(tm.cat1)(arada(6, 0, 0.98)), false);
      H.mark(K, t, tm.cat2 + 0.05, tm.sayac, sabit(tm.cat2)(arada(5, 6, 1.02)), false);
    }
    if (id === 'cevap') {
      H.mark(K, t, tm.cat3 + 0.05, tm.kabar - 0.1, sabit(tm.cat3)(arada(6, 0, 0.98)), false);
      const p = sabit(tm.tamam)([UC[0], UC[1] + URY * 0.02]), hw = H.tag(K, t, tm.tamam, tm.espri - 0.2, p, K.up('8 kişi'), YESIL, PAL.paper, 50);
      H.mark(K, t, tm.tamam + 0.08, tm.espri - 0.2, [p[0] + hw + 40, p[1]], true);
    }
    if (id === 'bufe') {
      const c = sabit(tm.yine)([TEP[0] + 175, TEP[1] - 40]);
      H.mark(K, t, tm.yine + 0.05, tm.buldum - 0.1, c, false);
    }
  },
});

// ——— oda: masa başı (yüzler) ———
function odaMasa(K, t, S, durum, sekiz) {
  // tabaklar ve bayraklar, arkadan öne
  const list = durum.yerler.map(y => ({ p: odaP(y.p), renk: y.renk }));
  if (sekiz && durum.kerem) list.push({ p: odaP(pol(GAP, HALKA)), renk: MERCAN });
  list.sort((a, b) => a.p[1] - b.p[1]);
  for (const o of list) { tabak(K, o.p, PR * TRX, PR * TRY, { yemek: true }); if (o.renk) bayrak(K, [o.p[0] + 6, o.p[1] - 2], o.renk, 0.72); }
}
function odaSahne(K, t, tl, S, { heads, sc }) {
  const { tm } = S, id = sc.id, hop = H.buldumHop(t, tm.buldum);
  M.mekanCiz(K, ODA, 'arka', t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= hop;
  const esp = id === 'espri' || id === 'cta';
  // Hikmet: kancada yedinci tabağı masaya koyar (sol el = ekranın solu, masaya dönük), sonra eliyle masayı gösterir
  let tabakEl = null, hikIs = null;
  if (id === 'oda') {
    const P = odaP(pol(A7(0), HALKA)), c = H.dus(t, 0, tm.koy0, [P[0] + 6, P[1] - 70], P);
    const wTut = 1 - W(t, 1.05, 0.3);
    if (wTut > 0.01) H.reach('hikmet', hp, 'L', [c[0] + 24, c[1] - 4], wTut, 'A');
    tabakEl = { c, w: wTut };
    // "yedi kişiydik": el masanın üstünde yay çizer (gösterir)
    const g = W(t, tm.yedi - 0.3, 0.3) * (1 - W(t, tm.sucla + 0.3, 0.35));
    if (g > 0.01) { const u = ease.state(seg(t, tm.yedi - 0.05, 1.1)); hikIs = odaP(pol(lerp(200, 340, u), 0.45)); H.reach('hikmet', hp, 'L', [hikIs[0] + 40, hikIs[1] - 150], g, 'A'); }
  }
  if (id === 'soru') {   // "yanlış"ta Hikmet parmağıyla masayı gösterir
    const g = W(t, tm.yanlis - 0.3, 0.3) * (1 - W(t, tm.al + 0.1, 0.35));
    if (g > 0.01) { hikIs = odaP([0.25, -0.15]); H.reach('hikmet', hp, 'L', [hikIs[0] + 60, hikIs[1] - 130], g, 'A'); }
  }
  // Defne: soruda kürdanlıktan bir tutam bayrak alır; sayaçta elinde yeşil bayrak; buldumda havada; çağrıda yanağının yanında
  let defBay = null;
  if (id === 'soru') {
    const K0 = odaP(KURDAN), w = W(t, tm.al - 0.3, 0.3), geri = W(t, tm.al + 0.2, 0.4);
    const g = H.elYeri('defne', dp, 'R', 'gogus'), hedef = [lerp(K0[0] - 4, g[0] - 10, geri), lerp(K0[1] - 52, g[1] - 10, geri)];
    if (w > 0.01) H.reach('defne', dp, 'R', hedef, w, 'A');
    defBay = t >= tm.al ? 'tutam' : null;
  }
  if (id === 'sayac') { H.reach('defne', dp, 'L', H.elYeri('defne', dp, 'L', 'gogus'), 1, 'A'); defBay = 'L'; }
  if (id === 'buldum') defBay = 'R';
  if (esp) {
    const g = H.elYeri('defne', dp, 'L', 'gogus'), y = H.elYeri('defne', dp, 'L', 'yukari'), wK = W(t, tm.cta + 0.05, 0.45);
    H.reach('defne', dp, 'L', [lerp(g[0], y[0] + 6, wK), lerp(g[1], y[1] + 90, wK)], 1, 'A');
    defBay = 'L';
  }
  // Kerem (espride masanın arkasında ayakta): sol elinde mercan bayrak, "hangisisin"de sağ eliyle (kendi solu) Hikmet'i gösterir
  let kp = null, ker = null;
  if (esp) {
    kp = kisi('genc', { x: KER_X, expr: 'mutlu', head: { tilt: 3, look: [-0.2, 0.15] }, ...POZ.dur });
    const g = W(t, tm.goster - 0.28, 0.28);
    if (t > tm.kerem + 0.1) kp.head.look = [0.6, 0.1];
    if (t > tm.goster) { kp.head.look = [0.95, 0.05]; kp.expr = 'notr'; }
    if (t > tm.goster + 0.9) { kp.head.look = [0.1, 0]; kp.expr = 'mutlu'; }
    H.reach('genc', kp, 'L', H.elYeri('genc', kp, 'L', 'gogus'), 1, 'A');
    if (g > 0.01) H.reach('genc', kp, 'R', [KER_X + 118, 1045], g, 'B');
  }
  const d = oyna(K, t, tl, 'defne', dp, { heads });
  const h = oyna(K, t, tl, 'hikmet', hp, { heads });
  if (kp) ker = oyna(K, t, tl, 'genc', kp, { heads, sessiz: true });
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  masaOda(K, t, S, { ayakkabi: !esp });
  // masa: kancada tabaklar (yedinci elde), soruda kürdanlık, sayaçta ve espride bayraklar
  const durum = masaDurumu(t, S);
  if (id === 'oda') {
    const list = durum.yerler.filter(y => y.i !== 0).map(y => odaP(y.p)).sort((a, b) => a[1] - b[1]);
    for (const p of list) tabak(K, p, PR * TRX, PR * TRY);
    tabak(K, tabakEl.c, PR * TRX, PR * TRY);
    if (tabakEl.w > 0.5) kolUst(K, 'hikmet', hp, 'L');
    if (hikIs) h.isaret('L', hikIs);
  } else if (id === 'soru') {
    for (const p of durum.yerler.map(y => odaP(y.p)).sort((a, b) => a[1] - b[1])) tabak(K, p, PR * TRX, PR * TRY);
    if (id === 'soru') { kurdanlik(K, odaP(KURDAN), 0.9, t >= tm.al ? 2 : 6); if (hikIs) h.isaret('L', hikIs); }
  } else {
    odaMasa(K, t, S, durum, esp);
  }
  if (id === 'soru' && t >= tm.al - 0.3 && t < tm.al) d.tut('R');
  // eldeki bayraklar
  if (defBay === 'tutam') { for (const [dx, r, m] of [[-8, -0.25, 0], [0, 0, 1], [8, 0.25, 0], [-3, 0.12, 1]]) bayrak(K, [d.handR[0] + dx, d.handR[1] + 14], m ? MERCAN : YESIL, 0.95, { rot: r }); d.tut('R'); }
  if (defBay === 'L') { bayrak(K, [d.handL[0] - 2, d.handL[1] + 12], YESIL, 1.05, { rot: -0.1 }); d.tut('L'); }
  if (defBay === 'R') { bayrak(K, [d.handR[0] - 2, d.handR[1] + 12], YESIL, 1.05, { rot: 0.08 }); d.tut('R'); }
  if (ker) { bayrak(K, [ker.handL[0] - 2, ker.handL[1] + 12], MERCAN, 1.05, { rot: -0.08 }); ker.tut('L'); if (t > tm.goster - 0.1) ker.isaret('R', [HIK_X - 30, 900]); }
}

// ——— üstten: masanın üstü (kollar kadrajın kenarından girer) ———
function ustSahne(K, t, S, { heads, sc, cam }) {
  const { tm } = S, { ctx } = K, id = sc.id, rx = PR * URX, ry = PR * URY;
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.defne = ekrandan(20, 560); heads.hikmet = ekrandan(1060, 560);   // konuşanlar kadraj dışında: balon kuyruğu onlara yatar
  M.mekanCiz(K, UST, 'arka', t);
  const durum = masaDurumu(t, S);
  // sandalyeler (örtünün altında kalan kenarlar), masa örtüsü
  for (const y of durum.yerler) { const q = ustP(pol(y.a, 1.3)); sandalyeUst(K, q[0], q[1], (y.a - 90) * D); }
  // örtü kabarması (Kerem altından iter)
  ortuUst(K);
  const kab = H.nabiz(t, tm.kabar, 0.3) * (t < tm.kBas + 0.1 ? 1 : 0);
  if (kab > 0.01) { const q = ustP(pol(GAP, ORTU)); K.ell(q[0], q[1] + 8, 90, 34 * kab, '#F6EEDF', LW); }
  M.mekanCiz(K, UST, 'isik', t);
  // kürdanlık: ust1'de Hikmet'in eli getirir (sağdan)
  const KP = ustP(KURDAN);
  let hEl = null, hHedef = null, dEl = null, dHedef = null, dBay = null;
  if (id === 'ust1') {
    const gel = ease.state(seg(t, tm.kurd - 0.5, 0.5)), git = ease.state(seg(t, tm.kurd + 0.12, 0.4)), u0 = H.unit(KP, H_ORG);
    const c = t < tm.kurd ? [lerp(KP[0] + u0[0] * 900, KP[0], gel), lerp(KP[1] + u0[1] * 900, KP[1], gel) - 30 * (1 - gel)] : KP;
    kurdanlik(K, c, 1.15, 6, { kabY: H.nabiz(t, tm.dogru, 0.4), kabM: H.nabiz(t, tm.yalan, 0.4) });
    if (git < 1) { const e = [c[0] + 30, c[1] - 30]; hEl = t < tm.kurd ? e : [lerp(e[0], e[0] + u0[0] * 900, git), lerp(e[1], e[1] + u0[1] * 900, git)]; }
  } else kurdanlik(K, KP, 1.15, 2);
  // tabaklar, çatallar, bayraklar
  const ciz = [];
  for (const y of durum.yerler) ciz.push({ ...y, P: ustP(y.p) });
  if (durum.kerem) ciz.push({ i: 7, a: GAP, P: ustP(pol(GAP, durum.kerem.r)), renk: durum.kerem.renk });
  ciz.sort((a, b) => a.P[1] - b.P[1]);
  for (const o of ciz) tabak(K, o.P, rx, ry);
  // çatallar: "Solumdaki"de herkes çatalıyla solundakini gösterir (ekran açısı artan yön)
  for (const o of ciz) {
    if (o.i === 7) continue;
    const komsu = ustP(pol(o.a + (durum.ac > 0 ? lerp(360 / 7, 45, durum.ac) : 360 / 7), HALKA)), hedefA = Math.atan2(komsu[1] - o.P[1], komsu[0] - o.P[0]);
    const ilkA = (o.a + 180) * D + 0.9 + 0.35 * Math.sin(o.i * 2.1), u = ease.state(seg(t, tm.sol + o.i * 0.07, 0.3));
    catal(K, [o.P[0] - rx * 0.05, o.P[1] + ry * 0.08], lerp(ilkA, hedefA, u), rx * 1.05);
  }
  // çelişki halkaları
  for (const [i, j, a] of catisma(t, S)) for (const k of [i, j]) { const P = ustP(durum.yerler[k].p); ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(P[0], P[1], rx + 16, ry + 13, 0, 0, TAU); ctx.lineWidth = 12; ctx.strokeStyle = MERCAN; ctx.stroke(); ctx.restore(); }
  // tur kapanınca yeşil halkalar
  if (t >= tm.halka0) for (const o of ciz) { const [tt] = tm.halkaSira[o.i] || [1e9]; const v = ease.enter(seg(t, tt, 0.25)); if (v > 0.01) { ctx.save(); ctx.globalAlpha = v; ctx.beginPath(); ctx.ellipse(o.P[0], o.P[1], rx + 14, ry + 11, 0, 0, TAU); ctx.lineWidth = 10; ctx.strokeStyle = YESIL; ctx.stroke(); ctx.restore(); } }
  for (const o of ciz) {
    const kab = o.i < 7 ? vurgu(t, S, o.i) : (tm.halkaSira[7] ? H.nabiz(t, tm.halkaSira[7][0], 0.34) : 0);
    if (o.renk) bayrak(K, [o.P[0] + 8, o.P[1] - 4], o.renk, 1, { kab });
    if (o.yesilEk) bayrak(K, [o.P[0] - 22, o.P[1] - 2], YESIL, 1, { rot: -0.12 });
    if (o.mercanEk) bayrak(K, [o.P[0] - 22, o.P[1] - 2], MERCAN, 1, { rot: -0.12 });
  }
  // ——— Defne'nin eli (soldan) ———
  const tepe = i => { const P = ustP(pol(A7(i), HALKA)); return [P[0] + 12, P[1] - 12]; };
  if (id === 'ust2') {
    // yedi dikiş: el bir sonraki bayrağı tutar, temas anında bırakır
    const giris = [tm.dik[0] - 0.45, ustP([-1.6, -0.1])];
    const durak = [giris, ...tm.dik.map((tt, i) => [tt, tepe(i)]), [tm.dik[6] + 0.55, ustP([-1.7, 0.3])]];
    if (t > giris[0] && t < tm.dik[6] + 0.55) {
      dEl = H.dokunYolu(t, durak, { yuksel: 34, sure: Math.min(0.3, (tm.dik[1] - tm.dik[0]) * 0.75) });
      const k = tm.dik.filter(tt => t >= tt).length; if (k < 7) dBay = RENK(k);
    }
    // ikinci deneme: mercan dikilir, yeşil çekilir
    if (t > tm.sw.gir && t < tm.sw.cik + 0.5) {
      const P6 = tepe(6), dis = ustP([-1.6, -0.6]);
      if (t < tm.sw.dik) { dEl = H.yay(dis, [P6[0] + 2, P6[1] + 4], ease.state(seg(t, tm.sw.gir, tm.sw.dik - tm.sw.gir)), 30); dBay = MERCAN; }
      else if (t < tm.sw.al) { dEl = H.yay([P6[0] + 2, P6[1] + 4], [P6[0] - 26, P6[1] + 6], ease.state(seg(t, tm.sw.dik + 0.05, 0.17)), 10); }
      else { dEl = H.yay([P6[0] - 26, P6[1] + 6], dis, ease.state(seg(t, tm.sw.al + 0.05, 0.45)), 20); dBay = YESIL; }
    }
    // Hikmet'in parmağı (sağdan) iki yeşile dokunur
    const gir = tm.hDok[0] - 0.4, cik = tm.hDok[1] + 0.55;
    if (t > gir && t < cik + 0.4) {
      const P6 = tepe(6), P0 = tepe(0), dis = ustP([1.7, -0.5]);
      const hd = H.dokunYolu(t, [[gir, dis], [tm.hDok[0], [P6[0] + 6, P6[1] - 20]], [tm.hDok[1], [P0[0] + 6, P0[1] - 20]], [cik + 0.4, dis]], { yuksel: 30, sure: 0.3 });
      hEl = [hd[0] + 52, hd[1] - 28]; hHedef = hd;
    }
  }
  if (id === 'cevap') {
    const ilk = tm.cv.gir, dis = ustP([-1.65, -0.2]);
    if (t > ilk && t < tm.cv.cik + 0.5) {
      const ds = [[ilk, dis], ...tm.cv.dokun.map(([tt, i]) => [tt, [tepe(i)[0] - 20, tepe(i)[1] - 18]]), [tm.cv.bir, [tepe(0)[0] - 20, tepe(0)[1] - 18]], [tm.cv.cik + 0.5, dis]];
      const p = H.dokunYolu(t, ds, { yuksel: 30, sure: 0.22 });
      dHedef = [p[0] + 18, p[1] + 16]; dEl = [p[0] - 46, p[1] - 20];
      // yedincide yeşili geri diker, mercanı çeker
      if (t >= tm.cv.dokun[7][0] - 0.05 && t < tm.cv.cekMercan + 0.15) { dEl = [tepe(6)[0] - 6, tepe(6)[1] + 6]; dHedef = null; }
      dBay = t < tm.cv.yesil ? YESIL : t >= tm.cv.cekMercan ? MERCAN : null;
    }
  }
  // ——— Kerem (üst kenardan, örtünün altından): başı çıkar, bayrağını kaldırır, tabağını iter, bayrağı diker ———
  if (id === 'cevap' && t >= tm.kBas - 0.05) {
    const u = ease.enter(seg(t, tm.kBas, 0.38)), bx = UC[0], by = lerp(UC[1] - URY * ORTU + 140, UC[1] - URY * ORTU - 66, u);
    const kp = kisi('genc', { x: bx, expr: t < tm.kBay ? 'saskin' : 'mutlu', head: { tilt: 0, look: t < tm.kBay + 0.4 ? [0, -0.2] : [0, 0.4] }, ...POZ.dur });
    const hd = H.eklem('genc', kp, 'head'); kp.y += by - hd[1]; kp.x += bx - hd[0];
    if (t > tm.halka0 + 0.5) { kp.head.look = [0, -0.15]; }
    // örtünün dışına kırp: gövde örtünün altında kalır
    ctx.save(); ctx.beginPath(); ctx.rect(BX - 2000, -2000, 5000, 6000); ctx.ellipse(UC[0], UC[1], URX * ORTU * 1.01, URY * ORTU * 1.01, 0, 0, TAU); ctx.clip('evenodd');
    H.drawChar(ctx, 'genc', kp, t);
    ctx.restore();
    const kenar = UC[1] - URY * ORTU, omuzR = [bx + 88, kenar + 14], omuzL = [bx - 88, kenar + 14], s = 232;
    // sağ el (ekranın sağı): mercan bayrak başın yanında → sekizinci tabağa diker
    const P8 = ustP(pol(GAP, HALKA)), yan = [bx + 112, by - 10];
    const kalk = ease.state(seg(t, tm.kBay - 0.3, 0.3)), dik = ease.state(seg(t, tm.kDik - 0.35, 0.35));
    if (kalk > 0.01) {
      const el = dik > 0 ? H.yay(yan, [P8[0] + 14, P8[1] - 12], dik, 20) : [lerp(omuzR[0] + 10, yan[0], kalk), lerp(omuzR[1] + 30, yan[1], kalk)];
      if (t < tm.kDik) bayrak(K, [el[0] - 6, el[1] + 8], MERCAN, 1, { rot: 0.1 });
      const geri = ease.state(seg(t, tm.kDik + 0.15, 0.35));
      uzunKol(K, 'genc', omuzR, [lerp(el[0], yan[0] - 10, geri), lerp(el[1], yan[1] + 10, geri)], null, s);
    }
    // sol el: tabağını örtünün kenarından iter
    const it = ease.state(seg(t, tm.kTab - 0.65, 0.25)), birak = ease.state(seg(t, tm.kTab + 0.1, 0.35));
    if (it > 0.01 && birak < 1) {
      const Pk = durum.kerem ? ustP(pol(GAP, durum.kerem.r)) : ustP(pol(GAP, 1.02));
      const el = [Pk[0] - rx * 0.9, Pk[1] - ry * 0.2];
      uzunKol(K, 'genc', omuzL, [lerp(lerp(omuzL[0] + 10, el[0], it), omuzL[0] - 10, birak), lerp(lerp(omuzL[1] + 40, el[1], it), omuzL[1] + 40, birak)], null, s);
    }
  }
  // eller (en üstte)
  if (dEl) { if (dBay) bayrak(K, [dEl[0] - 4, dEl[1] + 8], dBay, 1, { rot: -0.1 }); uzunKol(K, 'defne', D_ORG, dEl, dHedef); }
  if (hEl) uzunKol(K, 'hikmet', H_ORG, hEl, hHedef);
}

// ——— büfe: Necmi bardakları "bir çay, bir su" diye dizer ———
const SLOT = i => { const a = (GAP + (i + 0.5) * 360 / 7) * D; return [TEP[0] + Math.cos(a) * TEP_RX * 0.72, TEP[1] + Math.sin(a) * TEP_RY * 0.72]; };
const BSIRA = [3, 4, 5, 6, 0, 1], CIK = 0.6;   // CIK: tezgâhın altından çıkış + koyma süresi   // dizme sırası; çay: 3, 5, 0 (sağ el) · su: 4, 6, 1 (sol el) · son çay 2'ye
function bufeSahne(K, t, tl, S, { heads }) {
  const { tm } = S, k = 0.86;
  M.mekanCiz(K, BUF, 'arka', t);
  const np = kisi('necmi', { x: NX, expr: 'mutlu', head: { tilt: 3, look: [0.1, 0.75] }, ...POZ.rahat });
  if (t > tm.son) { np.head.look = [0.2, 0.8]; np.expr = 'saskin'; }
  if (t > tm.yine + 0.2) { np.head.look = [0, 0.1]; np.head.tilt = 7; np.expr = 'saskin'; }
  // her bardağın yolu: tezgâhın altından çıkar (gizli) → tepe → temas
  const cik = (tc, p, yan) => { const gz = [p[0] + yan * 60, 1460], tep = [p[0] + yan * 10, p[1] - 70]; if (t < tc - CIK) return { p: gz, gizli: true, faz: 0 }; if (t < tc - 0.25) { const u = ease.state(seg(t, tc - CIK, CIK - 0.25)); return { p: [lerp(gz[0], tep[0], u), lerp(gz[1], tep[1], u)], gizli: u < 0.55, faz: 1 }; } return { p: H.yay(tep, p, ease.state(seg(t, tc - 0.25, 0.25)), 0), gizli: false, faz: t < tc ? 1 : 2 }; };
  const bar = BSIRA.map((s, k2) => ({ slot: s, cay: k2 % 2 === 0, tc: tm.bar[k2], ...cik(tm.bar[k2], SLOT(s), k2 % 2 === 0 ? 1 : -1) }));
  // son çay: çıkar, 2'nin üstünde havada kalır
  const P2 = SLOT(2), sonGz = [P2[0] + 80, 1460], sonTep = [P2[0] + 30, P2[1] - 110], sonUst = [P2[0], P2[1] - 46];
  let son = null;
  if (t > tm.sonCik) {
    const u = ease.state(seg(t, tm.sonCik, 0.5)), v = ease.state(seg(t, tm.sonUst - 0.4, 0.4));
    son = v > 0 ? H.yay(sonTep, sonUst, v, 20) : [lerp(sonGz[0], sonTep[0], u), lerp(sonGz[1], sonTep[1], u)];
    son = { p: [son[0], son[1] + 2 * Math.sin(Math.PI * 2 * seg(t, tm.yine, 0.6))], gizli: u < 0.55 };
  }
  // el hedefleri: sağ el çayları, sol el suları taşır (bardağın beline). Bırakınca el 0,35 sn'de bir sonrakinin başladığı yere iner.
  const tutus = p => [p[0], p[1] - 34];
  const silYeri = tt => { const a = tt * 7.5; return [NX - 60 + 30 * Math.cos(a), TEP[1] - 8 + 10 * Math.sin(a)]; };
  const elYolu = (cay, dinlen) => {
    // olaylar: [başlangıç, temas, konum fonksiyonu]
    const ev = bar.filter(o => o.cay === cay).map(o => { const s = SLOT(o.slot), yan = cay ? 1 : -1; return { a: o.tc - CIK, b: o.tc, P: tt => tutus(cikAt(tt, o.tc, s, yan)) }; });
    if (cay) ev.push({ a: tm.sonCik, b: 1e9, P: tt => tutus(sonAt(tt)) });
    for (let i = 0; i < ev.length; i++) {
      const e = ev[i];
      if (t >= e.a && t < e.b) return e.P(t);
      const nx = ev[i + 1];
      if (t >= e.b && (!nx || t < nx.a)) { const hedef = nx ? nx.P(nx.a) : dinlen; return H.yay(e.P(e.b), hedef, ease.state(seg(t, e.b, nx ? Math.min(0.35, nx.a - e.b) : 0.35)), 0); }
    }
    return ev[0].P(Math.max(t, ev[0].a));
  };
  const cikAt = (tt, tc, p, yan) => { const gz = [p[0] + yan * 60, 1460], tep = [p[0] + yan * 10, p[1] - 70]; if (tt < tc - 0.25) { const u = ease.state(seg(tt, tc - CIK, CIK - 0.25)); return [lerp(gz[0], tep[0], u), lerp(gz[1], tep[1], u)]; } return H.yay(tep, p, ease.state(seg(tt, tc - 0.25, 0.25)), 0); };
  const sonAt = tt => { const u = ease.state(seg(tt, tm.sonCik, 0.5)), v = ease.state(seg(tt, tm.sonUst - 0.4, 0.4)); return v > 0 ? H.yay(sonTep, sonUst, v, 20) : [lerp(sonGz[0], sonTep[0], u), lerp(sonGz[1], sonTep[1], u)]; };
  let hR = elYolu(true, [NX + 120, 1400]), hL = elYolu(false, [NX - 120, 1400]);
  if (son && t > tm.yine) hR = tutus(son.p);
  // dizmeden önce: sol el bezle tepsiyi siler, sonra ilk suyun başladığı yere iner
  const silSon = tm.bar[1] - CIK - 0.2, sil = t < silSon;
  if (sil) hL = silYeri(t); else if (t < tm.bar[1] - CIK) hL = H.yay(silYeri(silSon), tutus(cikAt(tm.bar[1] - CIK, tm.bar[1], SLOT(4), -1)), ease.state(seg(t, silSon, 0.2)), 0);
  const R = bar.find(o => o.cay && !o.gizli && o.faz === 1), L = bar.find(o => !o.cay && !o.gizli && o.faz === 1);
  const a = oyna(K, t, tl, 'necmi', np, { heads, R: [hR, 1, 'B'], L: [hL, 1, 'B'] });
  heads.necmi = [a.head[0] + 190, a.head[1] + 20];   // altyazı kuyruğu tepsinin üstünden geçmesin
  for (const o of bar) if (o.gizli) (o.cay ? cayB : suB)(K, o.p[0], o.p[1], k);
  if (son && son.gizli) cayB(K, son.p[0], son.p[1], k);
  M.mekanCiz(K, BUF, 'on', t);
  // tepsi
  K.ell(TEP[0], TEP[1] + 8, TEP_RX, TEP_RY, '#9FAAA0', LW); K.ell(TEP[0], TEP[1], TEP_RX, TEP_RY, PAL.metal, LW); K.ell(TEP[0], TEP[1], TEP_RX - 16, TEP_RY - 12, '#A9B6AC', LW * 0.6);
  // bardaklar (arkadan öne)
  const vur = t > tm.yine - 0.05 ? 0.55 + 0.45 * Math.cos(TAU * (t - tm.yine) / 0.42) : 0;
  const gor = bar.filter(o => !o.gizli).sort((x, y) => x.p[1] - y.p[1]);
  for (const o of gor) (o.cay ? (x, y, kk) => cayB(K, x, y, kk, { halka: o.slot === 3 ? vur : 0 }) : (x, y, kk) => suB(K, x, y, kk))(o.p[0], o.p[1], k);
  if (son && !son.gizli) cayB(K, son.p[0], son.p[1], k, { halka: vur * 0.8 });
  // tutan eller
  if (R || (son && !son.gizli)) kolUst(K, 'necmi', np, 'R');
  if (L) kolUst(K, 'necmi', np, 'L');
  if (sil) { K.rect(a.handL[0] - 30, a.handL[1] - 8, 60, 24, PAL.cream, LW * 0.7, 8); kolUst(K, 'necmi', np, 'L'); }
}
