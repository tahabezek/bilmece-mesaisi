// Bölüm 55 · SON VAPUR 3: İSKELE LAMBALARI (v4 "hikâye" dili; storyboard: hikayeler/bolum_055_v5.md). Mekanizma: çift-tek (değişmez).
// Biçim "önce cevap": kare 0'da "CEVAP: ASLA" kapağı, sonra hikâye, Kaptan Rıza'nın bahsi, 10 sn "NEDEN?" sayacı, Lâl'in açıklaması.
// Logline: Eski iskelede beş sönük lamba var; her gelen vapurun kaptanı tam iki düğmeye basar. Lâl yılbaşında beşinin de yanmasını
// ister. Kaptan Rıza bahse girer. Çaycı Bora bardakları tepsiye ikişer koyup alır; Lâl anlar: yanan sayısı hep çifttir, 5 asla olmaz.
// Akılda kalacak tek şey: ikişer ikişer değişen bir sayı, sıfırdan başladıysa hep çift kalır.
// Seri çekirdeği (kadro, vapur manzarası, kapak, sayaç) engine/b053.js'ten import edilir; o dosyaya yazılmaz.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import { SV, svKisi, svOyna, rizaUst, lalUst, lalTepsi, simit, bardak, boraTepsi, svManzara, svKart, svSayac } from './b053.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ ölçüler ═══════════════════════════
const RIZA_X = 170, LAL_X = 760, BORA_X = 940;
const KENAR = 1262;                                   // iskelenin uzak kenarı (lamba direklerinin dibi)
const LAMBA_X = [440, 555, 670, 785, 900], LAMBA_Y = 724, LK = 1.22;   // lamba camının merkezi
const PANO = { x: 340, y: 938 };                      // sayaç kutusunun merkezi (direk üstünde)
const HEDEF = [340, 842];                             // Lâl'in mercan "5"i (sayaç kutusunun üstü)
const DUGME = { x: 170, y: 1112, ara: 30 };           // Rıza'nın önündeki düğme kutusu
const HOV = 1094;                                     // elin düğme üstünde beklediği yükseklik
const KASA = [1052, 1290];                            // Bora'nın çay kasası (üst yüz merkezi)
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const bx = i => DUGME.x + (i - 2) * DUGME.ara;

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    bes: T('h1:3'), besi: T('h1:6'), h1s: T('h1>'),
    h2a: T('h2a'), dugmeye: T('h2a:6'), basar: T('h2a:7'),
    h2b: T('h2b'), yanan: T('h2b:0'), sonuk: T('h2b:3'), h2bs: T('h2b>'),
    h3: T('h3'), besinin: T('h3:2'), bahse: T('h3:6'), vapur: T('h3:9'),
    d2: T('d2'), uc: T('d2:0'), ikiser: T('d2:3'), d2s: T('d2>'),
    hd: T('hd'), yakar: T('hd:3'), birinci: T('hd:5'), sondur: T('hd:6'), hds: T('hd>'),
    besiD3: T('d3:1'), d4: T('d4'), artir: T('d4:5'), azalt: T('d4:7'), degis: T('d4:10'), d4s: T('d4>'),
    d5: T('d5'), daima: T('d5:3'), cift: T('d5:4'), bes5: T('d5:6'), tek: T('d5:8'), d5s: T('d5>'),
    h4: T('h4'), feneri: T('h4:1'), kural: T('h4:3'), uc3: T('h4:4'), h4s: T('h4>'), cta: T('d6') - 0.15,
  };
  tm.kesPano = T('h2a') - 0.1;           // sahne 2: düğme kutusu ve ilk üç lamba yakın
  tm.kesBahis = T('h3') - 0.1;           // sahne 3: geniş, bahis + yanlış deneme + itiraz
  tm.cevap = tm.besiD3 - 0.02;           // kahraman an: lambalar ve sayaç
  tm.espri = tm.d5s + 0.1;               // espri: Lâl el fenerini yakar
  tm.fener = tm.espri + 0.45;            // fener yanar (h4'ten önce)
  tm.boraKal = cd - 4.7;                 // sayaç: Bora tepsiyi göğsüne kaldırır, bardakları ikişer koyar/alır
  tm.tur = [cd - 4.3, cd - 2.9, cd - 1.5];   // üç tur: +2, −2, +2
  tm.lalBak = cd - 2.6;

  // ——— vapurlar: sabit liste. Her vapurun kaptanı (Rıza) iki düğmeye AYNI ANDA basar (iki el) ———
  // [basış anı, [lamba i, lamba j], hız px/sn]. Lamba dizini soldan sağa 0–4.
  const VAPUR = [
    [tm.basar, [0, 1], 300],             // h2a "basar": 0 → 2
    [tm.ikiser, [2, 3], 420],            // d2 "ikişerden": 2 → 4 (Lâl'in planı)
    [tm.yakar, [0, 4], 420],             // hd "yakar": beşinci yanar, birinci söner: 4 → 4 (itiraz)
    [cd0 + 1.6, [1, 2], 420],            // sayaç: 4 → 2
    [cd0 + 4.1, [0, 4], 420],            // sayaç: 2 → 2
    [tm.artir, [1, 2], 760],             // d4 "artırır": 2 → 4
    [tm.azalt, [0, 1], 760],             // d4 "azaltır": 4 → 2
    [tm.degis, [2, 4], 760],             // d4 "değiştirmez": 2 → 2
    [tm.daima, [0, 1], 640],             // d5 "daima": 2 → 4 (ortadaki lamba sönük kalır; espride fener onun yerine)
  ];
  // Denetim: lamba durumu sıfırdan kurulur, her vapurdan sonra yanan sayısı çift olmalı (5'e hiç ulaşılmaz)
  const durumlar = [[0, 0, 0, 0, 0]], sayilar = [0];
  for (const [p, [i, j]] of VAPUR) {
    if (i === j) throw new Error('b055: vapur iki ayrı lambaya basmalı');
    const s = durumlar[durumlar.length - 1].slice(); s[i] ^= 1; s[j] ^= 1;
    const n = s.reduce((a, b) => a + b, 0);
    if (n % 2) throw new Error(`b055: ${p.toFixed(2)} sn vapurundan sonra yanan sayısı tek (${n})`);
    durumlar.push(s); sayilar.push(n);
  }
  for (let k = 1; k < VAPUR.length; k++) if (VAPUR[k][0] - VAPUR[k - 1][0] < 0.55) throw new Error('b055: vapurlar çok sık');

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 0.97, 540, 980], [tm.h1s - 0.3, 1.0, 528, 982]] },
    { id: 'pano', t0: tm.kesPano, cam: [[0, 1.2, 500, 942], [tm.h2bs, 1.23, 510, 940]] },
    { id: 'bahis', t0: tm.kesBahis, cam: [[0, 1.0, 560, 990], [tm.d2 - 0.2, 1.03, 570, 990], [tm.hd - 0.1, 1.2, 470, 980]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 0.97, 540, 900], [cd0 + 3.8, 0.99, 528, 902], [tm.boraKal - 0.3, 1.3, 950, 1090]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, LAL_X, 1108]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.08, 520, 975], [tm.d5, 1.12, 510, 972]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.0, 560, 990], [tm.kural, 1.05, 540, 992]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.3, LAL_X + 40, 1060], [tm.cta + 1.6, 1.34, LAL_X + 36, 1058]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— Rıza (önden, düğme kutusunun arkasında) ———
  const rizBase = svKisi('b053_riza', { x: RIZA_X, expr: 'mutlu', head: { tilt: 4, look: [0.8, -0.4] }, ...POZ.dur });
  const riz = [
    [tm.h2a, { head: { tilt: 3, look: [0.4, 0.7] } }, 0.3],
    [tm.yanan - 0.2, { head: { tilt: -3, look: [0.8, -0.5] } }, 0.3],
    [tm.kesBahis, { expr: 'mutlu', head: { tilt: 5, look: [0.9, 0.1] } }, 0.01],
    [tm.d2, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.2] } }, 0.3],
    [tm.hd, { expr: 'mutlu', head: { tilt: -3, look: [0.5, 0.6] } }, 0.3],
    [tm.sondur, { head: { tilt: 4, look: [0.9, 0.2] } }, 0.3],
    [cd0, { expr: 'mutlu', head: { tilt: 3, look: [0.6, 0.5] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'saskin', head: { tilt: -4, look: [0.9, 0.1] } }, 0.25],
    [tm.cevap, { expr: 'saskin', head: { tilt: 3, look: [0.4, 0.7] } }, 0.01],
    [tm.espri, { expr: 'saskin', head: { tilt: 3, look: [0.9, 0.0] } }, 0.01],
    [tm.h4, { expr: 'korku', head: { tilt: -6, look: [0.9, 0.1] } }, 0.3],
    [tm.kural, { expr: 'yorgun', head: { tilt: 5, look: [0.7, 0.2] } }, 0.35],
  ];
  // ——— Lâl (önden, tabla önünde) ———
  const lalBase = svKisi('b053_lal', { x: LAL_X, expr: 'saskin', head: { tilt: -4, look: [-0.8, -0.3] }, ...POZ.dur });
  const lal = [
    [tm.h2a, { head: { tilt: -3, look: [-0.9, 0.1] } }, 0.3],
    [tm.kesBahis, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.0] } }, 0.01],
    [tm.besinin - 0.2, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, -0.2] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [-0.3, 0.1] } }, 0.25],
    [tm.hd, { expr: 'saskin', head: { tilt: -4, look: [-0.85, -0.3] } }, 0.3],
    [tm.sondur, { expr: 'yorgun', head: { tilt: 4, look: [-0.8, -0.2] } }, 0.3],
    [cd0 + 0.6, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [-0.3, -0.6] } }, 0.4],
    [cd0 + 3.6, { expr: IFADE.dusun2, armR: POZ.dur.armR, head: { tilt: -4, look: [-0.8, -0.2] } }, 0.35],
    [tm.lalBak, { expr: 'notr', head: { tilt: 5, look: [0.85, 0.45] } }, 0.3],
    [cd - 0.7, { expr: 'saskin', head: { tilt: -3, look: [0.6, 0.2] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.1, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', ...POZ.dur, head: { tilt: -4, look: [-0.9, -0.2] } }, 0.01],
    [tm.espri, { expr: 'mutlu', head: { tilt: -4, look: [-0.6, -0.4] } }, 0.01],
    [tm.h4, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -5, look: [0.05, 0.05] } }, 0.01],
  ];
  // ——— Bora (önden, konuşmaz) ———
  const borBase = svKisi('b053_bora', { x: BORA_X, expr: 'notr', head: { tilt: -4, look: [-0.8, -0.2] }, ...POZ.dur });
  const bor = [
    [tm.h2a, { head: { tilt: -3, look: [-0.9, 0.1] } }, 0.3],
    [tm.d2, { expr: 'mutlu', head: { tilt: 3, look: [-0.6, 0.2] } }, 0.3],
    [cd0 + 1.5, { expr: 'notr', head: { tilt: -5, look: [-0.8, -0.3] } }, 0.35],
    [tm.boraKal, { expr: 'mutlu', head: { tilt: 3, look: [-0.3, 0.7] } }, 0.3],
    [tm.tur[1], { head: { tilt: -3, look: [0.6, 0.6] } }, 0.25],
    [tm.tur[2] + 0.6, { head: { tilt: -4, look: [-0.9, 0.1] } }, 0.3],
    [tm.buldum, { expr: 'mutlu', head: { tilt: 5, look: [-0.9, 0.0] } }, 0.25],
    [tm.espri, { expr: 'mutlu', head: { tilt: -3, look: [-0.8, -0.3] } }, 0.01],
    [tm.h4, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.1] } }, 0.3],
  ];
  return { tm, film, VAPUR, durumlar, sayilar, rizBase, riz, lalBase, lal, borBase, bor };
}

// ═══════════════════════════ dünyanın durumu (tek kaynak: lambalar, sayaç) ═══════════════════════════
// Lamba ışığı basıştan 0,12 sn içinde değişir; sayaç basış anında yeni değere geçer.
function lambalar(S, t) {
  let k = 0; while (k < S.VAPUR.length && t >= S.VAPUR[k][0]) k++;
  const simdi = S.durumlar[k], once = S.durumlar[Math.max(0, k - 1)], u = k ? ease.state(seg(t, S.VAPUR[k - 1][0], 0.12)) : 1;
  return { isik: simdi.map((v, i) => lerp(once[i], v, u)), sayi: S.sayilar[k], k, son: k ? S.VAPUR[k - 1][0] : -9 };
}

// ═══════════════════════════ çizim parçaları ═══════════════════════════
// İskele: uzak kenar (KENAR), eski tahta, kenar kirişi; arkasında deniz (manzaradan)
function iskeleZemin(K, x0 = -600, x1 = 1700) {
  const { ctx } = K;
  ctx.fillStyle = '#6E5A3E'; ctx.fillRect(x0, KENAR, x1 - x0, 1000);
  const ys = [0, 30, 70, 124, 196, 290, 410, 560];
  for (let r = 0; r < ys.length - 1; r++) {
    const y0 = KENAR + ys[r], y1 = KENAR + ys[r + 1], sp = 140 + r * 40;
    K.line(x0, y1, x1, y1, 3, '#57472F');
    for (let x = x0 + (r % 2) * sp / 2; x < x1; x += sp) K.line(x, y0 + 2, x, y1 - 2, 2.5, '#5E4C33');
  }
  K.rect(x0, KENAR - 14, x1 - x0, 24, '#8A6A42', LW * 0.8);
}
// Halat korkuluk: direkten direğe sarkan halat (döngü değil, sabit)
function halat(K, xs, y) {
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < xs.length - 1; i++) {
    for (const [w, c] of [[9 + LW, INK], [9, '#C9AE7E']]) {
      ctx.beginPath(); ctx.moveTo(xs[i], y); ctx.quadraticCurveTo((xs[i] + xs[i + 1]) / 2, y + 34, xs[i + 1], y); ctx.lineWidth = w; ctx.strokeStyle = c; ctx.stroke();
    }
  }
  ctx.restore();
}
// Lamba direği: on 0..1 (yanma oranı). Işık: düz kehribar çokgen (parlama yok)
function lamba(K, x, on, { koni = true } = {}) {
  const { ctx } = K, y = LAMBA_Y, k = LK;
  if (koni && on > 0.02) {
    ctx.save(); ctx.globalAlpha = 0.17 * on; K.poly([[x - 26 * k, y + 34 * k], [x + 26 * k, y + 34 * k], [x + 150, KENAR + 70], [x - 150, KENAR + 70]], SV.isik, 0);
    ctx.globalAlpha = 0.24 * on; K.ell(x, KENAR + 40, 150, 34, SV.isik, 0); ctx.restore();
  }
  K.rect(x - 8, y + 40 * k, 16, KENAR - y - 40 * k, SV.demir, LW * 0.6);
  K.rect(x - 20, KENAR - 30, 40, 30, SV.demir, LW * 0.6, 4);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.rect(-20, 36, 40, 12, SV.demir, LW * 0.6, 3);
  K.poly([[-30, -38], [30, -38], [24, 38], [-24, 38]], H.mixHex('#2E3B39', SV.fener, on), LW * 0.8);
  if (on > 0.02) { ctx.save(); ctx.globalAlpha = on; K.poly([[-14, -26], [14, -26], [10, 26], [-10, 26]], SV.fenerAcik, 0); ctx.restore(); }
  K.line(0, -36, 0, 36, 3, INK);
  K.poly([[-40, -38], [40, -38], [18, -62], [-18, -62]], SV.demir, LW * 0.8);
  K.circ(0, -68, 8, SV.demir, LW * 0.6);
  ctx.restore();
}
// Sayaç kutusu (yanan lamba sayısı) ve Lâl'in mercan "5"i
function sayacKutu(K, t, S, L) {
  const { tm } = S, { ctx } = K;
  K.rect(PANO.x - 7, PANO.y + 48, 14, KENAR - PANO.y - 48, SV.demir, LW * 0.6);
  K.rect(PANO.x - 66 + 8, PANO.y - 52 + 10, 132, 104, INK, 0, 14);
  K.rect(PANO.x - 66, PANO.y - 52, 132, 104, PAL.paper, LW, 14);
  const pu = 1 + 0.18 * H.nabiz(t, L.son, 0.34);
  ctx.save(); ctx.translate(PANO.x, PANO.y); ctx.scale(pu, pu);
  K.text(String(L.sayi), 0, 28, 80, L.sayi % 2 ? PAL.coral : INK, 900); ctx.restore();
  // mercan hedef: h3 "beşinin"de asılır; hd'de ve cevapta sarsılır, hiç yeşermez
  if (t >= tm.besinin - 0.04) {
    const v = Math.min(1.12, H.spring(t - (tm.besinin - 0.04), H.UI[0], H.UI[1]));
    const sx = 10 * H.sars(t, tm.sondur, 0.45, 9) + 10 * H.sars(t, tm.tek, 0.45, 9);
    const pp = 1 + 0.18 * H.nabiz(t, tm.bes5, 0.34);
    ctx.save(); ctx.translate(HEDEF[0] + sx, HEDEF[1]); ctx.scale(v * pp, v * pp);
    K.line(0, 44, 0, 52, 5, SV.demir);
    K.circ(4, 6, 42, INK, 0); K.circ(0, 0, 42, PAL.coral, LW);
    K.text('5', 0, 20, 58, PAL.paper, 900); ctx.restore();
  }
}
// Düğme kutusu (Rıza'nın önünde, bel hizasında): 5 düğme lambaların durumunu gösterir
function dugmeKutu(K, L, t, S) {
  const { ctx } = K;
  K.rect(DUGME.x - 12, DUGME.y + 60, 24, 1500 - DUGME.y - 60, SV.demir, LW * 0.7);
  K.rect(DUGME.x - 92, DUGME.y - 8, 184, 78, '#3E4A47', LW, 10);
  K.rect(DUGME.x - 92, DUGME.y - 14, 184, 16, '#56625E', LW * 0.7, 6);
  for (let i = 0; i < 5; i++) {
    let dip = 0; for (const [p, ij] of S.VAPUR) if (ij.includes(i)) dip = Math.max(dip, H.nabiz(t, p - 0.08, 0.2));
    K.ell(bx(i), DUGME.y - 4 + 3 * dip, 12, 7, H.mixHex('#22302E', SV.fener, L.isik[i]), LW * 0.5);
  }
  ctx.fillStyle = '#2B3533'; ctx.fillRect(DUGME.x - 70, DUGME.y + 26, 140, 6);
}
// Vapur (uzakta, soldan sağa geçer). x merkez, su hattı y 1150
function vapurCiz(K, x, i) {
  const y = 1150, { ctx } = K;
  K.poly([[x - 170, y - 46], [x + 150, y - 46], [x + 182, y - 40], [x + 150, y], [x - 150, y]], '#E9E4D6', LW * 0.8);
  K.rect(x - 160, y - 22, 316, 12, SV.petrol, 0);
  K.rect(x - 120, y - 88, 230, 44, '#E9E4D6', LW * 0.7, 6);
  for (let k = 0; k < 6; k++) K.rect(x - 106 + k * 36, y - 78, 22, 20, SV.pencere, LW * 0.4, 3);
  K.rect(x - 14, y - 132, 34, 46, '#E9E4D6', LW * 0.7, 4);
  K.rect(x - 14, y - 118, 34, 12, SV.petrol, 0);
  ctx.save(); ctx.globalAlpha = 0.5; for (let k = 0; k < 4; k++) K.line(x - 120 + k * 60, y + 10, x - 84 + k * 60, y + 10, 4, H.mixHex(SV.pencere, SV.deniz, 0.4)); ctx.restore();
}
// Çay kasası (Bora'nın yanında; üstünde bardaklar). n: kasadaki bardak sayısı
function kasaCiz(K, n) {
  const [x, y] = KASA;
  for (const [yy, h] of [[y, 104], [y + 104, 106]]) { K.rect(x - 64, yy, 128, h, '#9A6E3E', LW * 0.8, 6); K.line(x - 50, yy + h / 2, x + 50, yy + h / 2, 4, '#7A5530'); }
  for (let k = 0; k < n; k++) bardak(K, x - 45 + k * 30, y + 2, 52);
}
// El feneri: el = tutuş noktası, a = yön (rad), on 0..1, hedef (ışığın vardığı nokta)
function fenerCiz(K, el, a, on, hedef) {
  const { ctx } = K, uc = [el[0] + Math.cos(a) * 54, el[1] + Math.sin(a) * 54];
  if (on > 0.02 && hedef) {
    const n = [-Math.sin(a), Math.cos(a)], d = Math.hypot(hedef[0] - uc[0], hedef[1] - uc[1]), w = 14 + d * 0.16;
    ctx.save(); ctx.globalAlpha = 0.46 * on;
    K.poly([[uc[0] + n[0] * 14, uc[1] + n[1] * 14], [uc[0] - n[0] * 14, uc[1] - n[1] * 14], [hedef[0] - n[0] * w, hedef[1] - n[1] * w], [hedef[0] + n[0] * w, hedef[1] + n[1] * w]], SV.fenerAcik, 0);
    ctx.restore();
  }
  ctx.save(); ctx.translate(el[0], el[1]); ctx.rotate(a);
  K.rect(-34, -13, 74, 26, '#B8362A', LW * 0.8, 6);
  K.rect(36, -18, 22, 36, SV.demir, LW * 0.8, 4);
  K.rect(54, -15, 6, 30, H.mixHex('#4A5452', SV.fenerAcik, on), LW * 0.5, 2);
  ctx.restore();
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  kartSon: -1,
  split: { h3: 6, d4: 6 },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    svKart(K, t, ep, { kapak: ep.kapak || 'ASLA', donus: tm.vapur - 0.05, son: tm.proof });
    svSayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    etiketler(K, t, S, B);
  },
});

function etiketler(K, t, S, B) {
  const { tm } = S, id = B.sc.id, ekr = B.ekr;
  if (id === 'kanca') {
    // "beş lamba": tek rakam lambadan lambaya atlar (1…5)
    H.sayiAtla(K, t, LAMBA_X.map((x, i) => [tm.bes + i * 0.08, ekr([x, LAMBA_Y + 104]), String(i + 1)]), { son: tm.h1s, size: 54, fill: PAL.mustard, col: INK });
  }
  if (id === 'bahis') H.mark(K, t, tm.sondur, tm.hds + 0.5, (p => [p[0] + 76, p[1]])(ekr(HEDEF)), false);
  if (id === 'cevap') {
    const yer = [ekr([620, 0])[0], ekr([0, LAMBA_Y - 130])[1]];
    H.adimEtiket(K, t, [[tm.artir, '+2', PAL.green, PAL.paper], [tm.azalt, '−2', PAL.coral, PAL.paper], [tm.degis, '±0', PAL.mustard, INK]], tm.d5 - 0.1, yer, 60);
    H.tag(K, t, tm.cift - 0.04, tm.d5s + 0.2, yer, 'HEP ÇİFT', PAL.green, PAL.paper, 56);
    H.mark(K, t, tm.tek - 0.02, tm.d5s + 0.25, (p => [p[0] + 82, p[1]])(ekr(HEDEF)), false);
  }
}

// ═══════════════════════════ sahne (dünya) ═══════════════════════════
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, L = lambalar(S, t);
  svManzara(K, t, { yer: 2, safak: 0 });
  // vapurlar (uzakta, soldan sağa; basış anında lambaların ortasının arkasında)
  S.VAPUR.forEach(([p, , v], i) => { const x = 670 + (t - p) * v; if (x > -500 && x < 1700) vapurCiz(K, x, i); });
  iskeleZemin(K);
  halat(K, [-200, PANO.x, ...LAMBA_X, 1400], 1176);
  LAMBA_X.forEach((x, i) => lamba(K, x, L.isik[i]));
  sayacKutu(K, t, S, L);
  if (id === 'bahis' && t >= tm.birinci - 0.1) H.ring(K, [LAMBA_X[0], LAMBA_Y], t, tm.birinci, PAL.coral);
  kasaCiz(K, 4 - boraFazla(S, t));

  // ——— Rıza: iki eli düğme kutusunda; her vapurda iki düğmeye aynı anda basar ———
  const rp = H.poseAt(H.CARDS.b053_riza, S.rizBase, S.riz, t);
  const elKey = side => {
    const keys = [[0, [bx(side === 'L' ? 0 : 2), HOV]]];
    for (const [p, ij] of S.VAPUR) keys.push([p - 0.34, [bx(side === 'L' ? Math.min(...ij) : Math.max(...ij)), HOV], 0.24]);
    const h = H.iz(keys, t); let dip = 0;
    for (const [p] of S.VAPUR) dip = Math.max(dip, H.nabiz(t, p - 0.1, 0.2));
    return [h[0], h[1] + 16 * dip];
  };
  let hL = elKey('L'), hR = elKey('R'), gR = 0, gHedef = null, isaretR = null, parmakR = 0;
  if (id === 'kanca') { gR = pIn(t, 0.3, tm.h1s - 0.1, 0.3); gHedef = [RIZA_X + 150, 1010]; isaretR = [LAMBA_X[2], LAMBA_Y]; }
  if (id === 'pano') {
    gR = pIn(t, tm.yanan - 0.3, tm.h2bs - 0.05, 0.28); gHedef = [RIZA_X + 150, 1030];
    isaretR = t < tm.sonuk - 0.1 ? [LAMBA_X[0], LAMBA_Y] : [LAMBA_X[2], LAMBA_Y];
  }
  if (id === 'bahis') { gR = pIn(t, tm.bahse - 0.25, tm.d2 + 0.3, 0.3); gHedef = [RIZA_X + 175, 1130]; }
  if (id === 'espri') {
    const w1 = pIn(t, tm.h4 - 0.1, tm.kural - 0.2, 0.3), w2 = pIn(t, tm.kural - 0.15, tm.h4s + 2, 0.3);
    if (w1 > 0.01) { gR = w1; gHedef = H.elYeri('b053_riza', rp, 'R', 'yukari'); hL = kar(hL, H.elYeri('b053_riza', rp, 'L', 'yukari'), w1); }
    if (w2 > 0.01) { gR = w2; gHedef = H.elYeri('b053_riza', rp, 'R', 'yukari'); parmakR = clamp01((t - tm.uc3 + 0.2) / 0.25) * 3; }
  }
  if (gR > 0.01) hR = kar(hR, gHedef, gR);
  const rc = svOyna(K, t, tl, 'b053_riza', rp, { heads, L: [hL, 1, 'B'], R: [hR, 1, 'B'] });
  rizaUst(K, rp);
  dugmeKutu(K, L, t, S);
  rc.tut('L');
  if (isaretR && gR > 0.5) rc.isaret('R', isaretR);
  else if (parmakR > 0.01) rc.parmak('R', Math.max(0.01, parmakR), { toplam: 3, ac: 0.32 });
  else rc.tut('R');

  // ——— Bora: pozu önce (tepsi önde çizilir) ———
  const bp = H.poseAt(H.CARDS.b053_bora, S.borBase, S.bor, t), bo = { sessiz: true };
  const bL = H.shoulder('b053_bora', bp, 'L'), bR = H.shoulder('b053_bora', bp, 'R');
  const GOGUS = [bL[0] - 70, bL[1] - 30];
  let tepsiEl = [bL[0] - 22, bL[1] + 104];
  if (id === 'sayac') tepsiEl = kar(tepsiEl, GOGUS, W(t, tm.boraKal, 0.4));
  if (id === 'buldum') tepsiEl = GOGUS;
  bo.L = [tepsiEl, 1, 'B'];
  const tepM = [tepsiEl[0], tepsiEl[1] + 118 + 4];
  // bardaklar ikişer: tepside 2 → 4 → 2 → 4. Tur: kasadan (ya da tepsiden) iki bardak alınır, taşınır, bırakılır
  let elde = null, tepside = 2;
  if (id === 'sayac' && t >= tm.tur[0] - 0.4) {
    const turlar = [[tm.tur[0], KASA, 'tepsi'], [tm.tur[1], 'tepsi', KASA], [tm.tur[2], KASA, 'tepsi']];
    tepside = 2;
    for (const [a, from, to] of turlar) {
      const A = from === 'tepsi' ? [tepM[0], tepM[1] - 2] : [KASA[0], KASA[1] + 2], Bp = to === 'tepsi' ? [tepM[0], tepM[1] - 2] : [KASA[0], KASA[1] + 2];
      if (t >= a + 0.9) { tepside += to === 'tepsi' ? 2 : -2; continue; }
      if (t >= a) { elde = H.tasi(t, a, 0.85, A, Bp, 70); if (from === 'tepsi') tepside -= 2; }
      else if (t >= a - 0.32) bo.R = [[A[0] + 4, A[1] - 52], W(t, a - 0.32, 0.28), 'A'];
      break;
    }
    if (elde) bo.R = [[elde[0] + 4, elde[1] - 52], 1, 'A'];
    else if (!bo.R && t < tm.tur[2] + 1.4) bo.R = [[KASA[0] - 30, KASA[1] - 60], pIn(t, tm.tur[0] - 0.4, tm.tur[2] + 1.0, 0.3), 'A'];
  }
  if (id === 'buldum' || id === 'cevap' || id === 'espri' || id === 'cta') tepside = 4;
  S._tepside = tepside;

  // ——— Lâl ———
  const lp = H.poseAt(H.CARDS.b053_lal, S.lalBase, S.lal, t); lp.y -= H.buldumHop(t, tm.buldum);
  const lo = { heads };
  let simitP = null, eksik = [], isaretL = null, parmakL = 0, fener = null;
  if (id === 'bahis') {
    const w = pIn(t, tm.besinin - 0.3, tm.bahse - 0.2, 0.28);
    if (w > 0.01) { lo.L = [[LAL_X - 170, 1010], w, 'B']; if (w > 0.5) isaretL = HEDEF; }
    const wp = pIn(t, tm.uc - 0.25, tm.ikiser + 0.5, 0.28);
    if (wp > 0.01) { lo.L = [H.elYeri('b053_lal', lp, 'L', 'yukari'), wp, 'B']; if (wp > 0.5) parmakL = clamp01((t - tm.uc + 0.05) / 0.3) * 3; }
    // bahis: tabladan bir simit kaldırır (ortaya konan pay), itirazda geri koyar
    const al = tm.bahse - 0.1, birak = tm.sondur + 0.2;
    if (t >= al - 0.3 && t < birak + 0.7) {
      const A = [LAL_X + 26, 1236], P = [LAL_X + 128, 1086];
      simitP = t < birak ? kar(A, P, W(t, al, 0.4)) : kar(P, A, W(t, birak, 0.45));
      lo.R = [[simitP[0] + 4, simitP[1] + 8], t < al ? W(t, al - 0.3, 0.28) : 1, 'B'];
      if (t < al) simitP = null;
      eksik = t >= al && t < birak + 0.45 ? [2] : [];
    }
  }
  if (id === 'sayac') {
    const w = pIn(t, cd0Say(S) - 0.2, tm.lalBak - 0.3, 0.3);
    if (w > 0.01) { lo.L = [H.elYeri('b053_lal', lp, 'L', 'gogus'), w, 'B']; parmakL = clamp01((t - cd0Say(S)) / 0.35) + clamp01((t - cd0Say(S) - 0.55) / 0.35); }
  }
  if (id === 'cevap') {
    const w = pIn(t, tm.cevap + 0.1, tm.d5s + 0.2, 0.28);
    if (w > 0.01) { lo.L = [[LAL_X - 175, 1030], w, 'B']; if (w > 0.5) isaretL = t < tm.bes5 - 0.1 ? [PANO.x, PANO.y] : HEDEF; }
  }
  if (id === 'espri' || id === 'cta') {
    // el feneri (sol el): tabladan çıkar, ortadaki sönük lambanın altına tutulur, yanar (beşinci ışık). Işık yüzün solundan geçer.
    const A = [LAL_X - 30, 1232], P = [LAL_X - 196, 1046];
    const u = id === 'cta' ? 1 : W(t, tm.espri + 0.05, 0.4);
    const el = kar(A, P, u);
    lo.L = [el, id === 'cta' ? 1 : W(t, tm.espri - 0.25, 0.25), 'B'];
    const hedef = [LAMBA_X[2] - 14, LAMBA_Y + 40];
    fener = { el, a: lerp(-Math.PI / 2, Math.atan2(hedef[1] - el[1], hedef[0] - el[0]), u), on: W(t, tm.fener, 0.1), hedef };
    eksik = [0];
  }
  const lc = svOyna(K, t, tl, 'b053_lal', lp, lo);
  lalTepsi(K, lp, { eksik });
  lalUst(K, lp);
  if (isaretL && lo.L && lo.L[1] > 0.5) lc.isaret('L', isaretL);
  else if (parmakL > 0.01) lc.parmak('L', Math.max(0.01, parmakL), { toplam: 3, ac: 0.32 });
  if (simitP) { simit(K, lc.handR[0] - 2, lc.handR[1] - 14, lp.s, 1.25); lc.tut('R'); }
  if (fener) { fenerCiz(K, lc.handL, fener.a, fener.on, fener.hedef); lc.tut('L'); }

  // ——— Bora (Lâl'in önünde): tepsi, eldeki iki bardak ———
  const bc = svOyna(K, t, null, 'b053_bora', bp, bo);
  const DX = [-66, -22, 22, 66], dolu = tepside >= 4 ? [0, 1, 2, 3] : [1, 2];
  boraTepsi(K, bc.handL, DX.map((dx, i) => [dx, dolu.includes(i)]).map(([dx, v]) => [dx * 1, v]), { k: 1 });
  bc.tut('L');
  if (elde) { bardak(K, bc.handR[0] - 18, bc.handR[1] + 52, 60); bardak(K, bc.handR[0] + 18, bc.handR[1] + 52, 60); bc.tut('R'); }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('b053_lal', lp, 'head'), { son: tm.proof, k: lp.s / 245 });
}
const cd0Say = S => S.tm.cd0 + 3.9;
// Kasadaki bardaklar: tepsiye konan fazlalık kadar azalır (kasada başta 4)
function boraFazla(S, t) {
  const { tm } = S;
  if (t < tm.tur[0]) return 0;
  if (t >= tm.buldum - 0.05) return 2;
  if (t < tm.tur[1]) return 2;
  if (t < tm.tur[2]) return t < tm.tur[1] + 0.9 ? 2 : 0;
  return 2;
}
