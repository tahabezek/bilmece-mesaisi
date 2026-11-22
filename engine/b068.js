// Bölüm 68 · HİKMET BEY'İN BARDAĞI (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_068_v5.md).
// Mekanizma: iki ihtimal, tek sonuç.
// Logline: Hikmet bir kâğıda gizlice bir dem ve bir şeker durumu yazar; yazdığı iki özellikten yalnızca birine uyan çayı
// içecektir. Tezgâhta dört bardak durur. Necmi demli şekerli bardağı önüne iter, Hikmet "Bunu içerim" der. Kâğıt şekerliğin
// altında kapalı durur; geriye üç bardak kalır.
// Akılda kalacak tek şey: kâğıtta ne yazdığını bilmeden de hangi bardağı içeceği bilinir.
// Sızıntı yasağı: kâğıdın içi hiç görünmez (katlı, üstünde yazı yok); hiçbir bardak renk, ışık ya da işaretle vurgulanmaz;
// dört etiket aynı biçimdedir; Defne'nin parmağı kalan üç bardakta eşit süre durur (kod bunu denetler); Hikmet öbür
// bardaklara uzanmaz, bakmaz.
// Bardaklar: dem çayın renginden (demli koyu kızıl, açık soluk kehribar), şeker tabaktaki iki kesme şekerden okunur.
// Mekân: çay ocağı, öndeki taş tezgâh (üst yüzeyi görünür); üç kişi tezgâhın arkasında durur. Tezgâhın üstüne uzanan kol
// tezgâhtan sonra yeniden çizilir (kolUst); aşağı sarkan kol tezgâhın arkasında kalır.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Şartlar (değişmez; yükleme anında denetlenir) ═══════════════════════════
// Soldan sağa dört bardak. Necmi'nin ittiği: demli şekerli (3). Cevap (arşiv): açık şekersiz (0).
const BARDAKLAR = [{ dem: 'açık', seker: false }, { dem: 'açık', seker: true }, { dem: 'demli', seker: false }, { dem: 'demli', seker: true }];
const ICILEN = 3, CEVAP = 0;
(function denetle() {
  const uyan = (b, k) => (b.dem === k.dem) + (b.seker === k.seker);   // kâğıttaki iki özellikten kaçına uyuyor
  const olasi = [];
  for (const dem of ['açık', 'demli']) for (const seker of [false, true]) if (uyan(BARDAKLAR[ICILEN], { dem, seker }) === 1) olasi.push({ dem, seker });
  const kesin = BARDAKLAR.map((b, i) => i).filter(i => i !== ICILEN && olasi.every(k => uyan(BARDAKLAR[i], k) === 1));
  if (olasi.length !== 2 || kesin.length !== 1 || kesin[0] !== CEVAP) throw new Error('b068: mantık denetimi tutmadı');
})();

// ═══════════════════════════ Ölçüler ═══════════════════════════
const OCAK = 'b068_ocak';
const YB = 1195, YF = 1356, PERVAZ = 22;   // tezgâhın üst yüzeyi: arka kenar, ön kenar; ön pervazın kalınlığı
const Y0 = 1320, YA = 1252;                // ön sıra (bardakların tabanı), arka sıra (şekerlik, çaydanlık)
const DIP = 1800;                          // tezgâh dolabının dibi (zemin çizgisi)
const XS = [200, 380, 560, 740], X5 = 950; // dört bardağın yeri; itilen bardağın Hikmet'in önündeki yeri
const BEL = 85;                            // bardağın belinin tabandan yüksekliği (tutuş ve dönme noktası)
const DOLU = 0.86;
const DEF_X = 290, NEC_X = 505, NEC_X2 = 606, NEC_IT = 675, NEC_SON = 590, HIK_X = 995;   // Necmi: baştaki yeri, ikili plândaki yeri, iterken, sonra
const SEK = [810, YA];                     // şekerlik (arka sıra; itilen tabak önünden geçer)
const SIK = [SEK[0] - 2, YA + 10];         // kâğıdın şekerliğin altına sıkıştığı yer (kâğıdın ortası)
const KAGIT_G = [HIK_X - 6, 1126];         // kâğıt göğüste
const KAGIT_Y = [HIK_X - 190, 890];        // kâğıt havada (Hikmet gösterir)
const TUT = [HIK_X - 30, 1185], YUDUM = [HIK_X - 97, 1011];   // bardak Hikmet'in elinde: bekleme, yudum (bel noktası)
const CAY = { 'açık': '#E8A548', demli: '#7E1B10' };
const TAS = '#DDD8CB', TAS_KOYU = '#C4BEAE', TABAK = '#2F7F7A';
// kadrajlar [zoom, cx, cy]
const GENIS = [1.0, 620, 1120];          // kanca: dört bardak, üç kişi
const CAYLAR = [1.2, 412, 1172];          // d1a: açık çift (Hikmet kadraj dışı)
const GENIS2 = [1.0, 620, 1158];         // d1b: demli çift (kamera sağa kayar)
const YAKIN = [1.44, 1021, 1036];          // Hikmet yakın (itmeden önce)
const IKILI = [1.15, 937.6, 1113];           // Necmi + Hikmet
const YAKIN2 = [1.48, 1095, 1030];         // Hikmet yakın (itmeden sonra)
const UCLU = [1.28, 439, 1146];             // Defne + Necmi + kalan üç bardak + şekerlik (Hikmet kadraj dışı)
// Konuşmayan karakterin ağzı kapalı kalır: açık ağız, repliği ona aitmiş gibi okutuyor
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 1, pupil: 1, curve: 0.7, open: 0, w: 1.2 };
const KEYIF = { brow: 0.04, browTilt: -0.15, eye: 0.3, pupil: 1, curve: 0.3, open: 0, w: 0.9 };
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const agiz = i => [XS[i], Y0 - 170];       // i. bardağın ağzının ortası

// ═══════════════════════════ Nesneler (dünya) ═══════════════════════════
// İnce belli çay bardağı. Yerel (0, 0) tabanın ortası, ağız yukarıda; boy 170.
function bardakYolu(c) {
  c.moveTo(-42, -170);
  c.bezierCurveTo(-39, -123, -22, -106, -23, -81);
  c.bezierCurveTo(-25, -55, -38, -38, -35, -19);
  c.lineTo(-35, 0); c.lineTo(35, 0); c.lineTo(35, -19);
  c.bezierCurveTo(38, -38, 25, -55, 23, -81);
  c.bezierCurveTo(22, -106, 39, -123, 42, -170);
  c.closePath();
}
// bel: bardağın bel noktası (dünya); rot: bel çevresinde dönüş (rad). Çayın yüzeyi yatay kalır.
function bardak(K, bel, dem, { rot = 0, dolu = DOLU } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(bel[0], bel[1]); ctx.rotate(rot); ctx.translate(0, BEL); ctx.lineJoin = 'round';
  ctx.beginPath(); bardakYolu(ctx); ctx.fillStyle = '#EEF3EE'; ctx.fill();
  H.sivi(K, bardakYolu, [-42, -170, 84, 170], { seviye: dolu, renk: CAY[dem], egim: rot });
  ctx.save(); ctx.beginPath(); bardakYolu(ctx); ctx.clip(); ctx.fillStyle = '#D3DFD9'; ctx.fillRect(-45, -13, 90, 16); ctx.restore();   // kalın cam dip
  ctx.save(); ctx.globalAlpha = 0.62; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-30, -150); ctx.quadraticCurveTo(-28, -124, -17, -106);
  ctx.lineWidth = 6; ctx.strokeStyle = '#FFFFFF'; ctx.stroke(); ctx.restore();                                                          // parıltı (düz çizgi)
  ctx.beginPath(); bardakYolu(ctx); ctx.lineWidth = LW * 0.9; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}
// Çay tabağı (petrol yeşili; beyaz kesme şeker üstünde seçilsin) ve iki kesme şeker (bardağın iki yanında)
function tabak(K, x) {
  K.ell(x, Y0 + 2, 86, 20, TABAK, LW * 0.8);
  K.ell(x, Y0, 58, 10, '#27706B', 0);
}
function kup(K, x, yb) { K.rect(x - 21, yb - 42, 42, 42, '#FFFDF8', 4.5, 7); K.line(x - 11, yb - 31, x + 7, yb - 31, 3.5, '#D5D0C3'); }
function sekerler(K, x) { kup(K, x - 60, Y0 + 10); kup(K, x + 60, Y0 + 10); }
// Şekerlik: cam kavanoz, metal kapak. (x, y) tabanın ortası; rot (rad) sağ alt köşe çevresinde hafif kalkar
function sekerlik(K, [x, y], rot = 0) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x - 36, y); ctx.rotate(rot); ctx.translate(36, 0);
  K.rect(-38, -76, 76, 76, '#E6EFEA', LW * 0.8, 12);
  for (const [dx, dy] of [[-22, -8], [4, -8], [-10, -34], [14, -34], [-22, -58]]) K.rect(dx - 2, dy - 22, 24, 22, '#FFFDF8', 2.5, 4);   // içindeki kesme şekerler
  K.rect(-43, -92, 86, 20, PAL.metal, LW * 0.8, 8); K.circ(0, -98, 8, PAL.metalDark, LW * 0.6);
  K.line(-26, -64, -26, -22, 5, '#FFFFFF');
  ctx.restore();
}
// Katlı kâğıt (elde): ortası (x, y). Üstünde yazı yoktur; içi hiç görünmez.
function kagit(K, [x, y], rot = 0) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180);
  K.rect(-48 + 6, -32 + 8, 96, 64, INK, 0, 5);
  K.rect(-48, -32, 96, 64, '#FFF8E3', LW * 0.75, 5);
  K.poly([[-48, 20], [48, 14], [48, 32], [-48, 32]], '#EFE4C4', 0);          // alttaki kat
  K.line(-46, 20, 46, 14, 3.5, INK);                                         // kat çizgisi
  K.rect(-48, -32, 96, 64, null, LW * 0.75, 5);
  ctx.restore();
}
// Şekerliğin altına sıkıştırılmış kâğıt: bir köşesi dışarıda kalır (şekerlikten ÖNCE çizilir)
function kagitSikisik(K) {
  const [x, y] = SEK;
  K.poly([[x - 46, y - 16], [x + 40, y - 18], [x + 45, y + 30], [x - 43, y + 36]], '#FFF8E3', LW * 0.75);
  K.line(x - 43, y + 22, x + 44, y + 17, 3.5, INK);
}
// Çaydanlık (arka sıra; döngü: buhar). (x, y) tabanın ortası, emzik solda
function caydanlik(K, x, y, t) {
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 66, 60, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  K.poly([[x - 52, y - 46], [x - 98, y - 76], [x - 106, y - 64], [x - 56, y - 24]], PAL.metal, LW);
  K.rect(x - 50, y - 72, 100, 72, PAL.metal, LW, 14);
  K.rect(x - 32, y - 122, 64, 54, '#B9C6BB', LW, 12); K.circ(x, y - 128, 9, '#3A3F3C', LW * 0.6);
  H.buhar(K, x - 108, y - 84, t, { k: 0.6, n: 2, ara: 16, boy: 90 });
}
// Öndeki tezgâh: taş üst yüzey (bardaklar bunun üstünde durur), ön pervaz, dolap yüzü, zemin. Karakterlerden SONRA çizilir.
const DAMAR = [[-120, 0.3, 60], [90, 0.7, 44], [310, 0.25, 70], [505, 0.62, 52], [690, 0.36, 64], [905, 0.72, 48], [1085, 0.3, 66], [1330, 0.6, 56], [1490, 0.4, 60]];
function tezgah(K) {
  const { ctx } = K, x0 = -900, x1 = 2400, yd = YF + PERVAZ;
  ctx.fillStyle = PAL.floor; ctx.fillRect(x0, DIP, x1 - x0, 700);
  for (let x = x0; x < x1 + 300; x += 170) K.line(x, DIP, x - 150, DIP + 600, 3, PAL.floorDark);
  K.rect(x0, yd, x1 - x0, DIP - yd, PAL.wood, LW);
  for (let i = 0, x = x0 + 26; x < x1; x += 262, i++) {
    K.rect(x, yd + 26, 236, 84, PAL.woodTop, LW * 0.6, 8); K.rect(x + 84, yd + 58, 68, 14, '#5D6A61', LW * 0.5, 7);                          // çekmece
    K.rect(x, yd + 130, 236, DIP - yd - 176, PAL.woodTop, LW * 0.6, 8); K.circ(x + (i % 2 ? 34 : 202), yd + 230, 10, '#5D6A61', LW * 0.6);   // kapak
  }
                                                                                   // pervaza asılı çay havlusu
  K.rect(x0, DIP - 30, x1 - x0, 30, PAL.woodDark, LW);
  K.rect(x0, YB, x1 - x0, YF - YB, TAS, LW);
  for (const [x, v, len] of DAMAR) K.line(x, YB + (YF - YB) * v, x + len, YB + (YF - YB) * v - 9, 3, TAS_KOYU);   // taşın damarları (sabit liste)
  K.rect(x0, YF, x1 - x0, PERVAZ, TAS_KOYU, LW, 4);
}
// Tezgâhın üstüne uzanan kol: arka kenarın altında kalan kısmı tezgâhın üstüne yeniden çizer (cast.js limb ile aynı çizim)
function kolUst(K, key, p, side, a = 1) {
  if (a <= 0.01) return;
  const { ctx } = K, c = H.CARDS[key], s = p.s, j = n => H.eklem(key, p, n + side), sh = j('sh'), el = j('el'), ha = j('hand');
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(-5000, YB, 10000, 3000); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = (c.arm.w + c.line * 2) * s; ctx.stroke();
  ctx.strokeStyle = c.arm.color; ctx.lineWidth = c.arm.w * s; ctx.stroke();
  ctx.restore();
}
function elUst(K, key, p, side, a = 1) {
  if (a <= 0.01) return;
  const { ctx } = K; ctx.save(); ctx.globalAlpha = a; H.grip(K, key, H.eklem(key, p, 'hand' + side), p.s); ctx.restore();
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(OCAK, {
  gen: [-700, 2200], dongu: ['bardaklardan yükselen buhar', 'çaydanlık buharı', 'pencerede martı'],
  capa: { tezgah: [XS[1], Y0], sekerlik: SEK, hikmetinOnu: [X5, Y0] }, kadraj: { genis: GENIS, uclu: UCLU },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -1000, x1: 2500, isik, duvar: 'fayans', zemin: 'karo' });
    M.pencere(K, 1182, 772, 170, 262, { isik, t });
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    kaldir: 0.15, gizlice: T('h1:2'), c1: T('h1:6') - 0.08, demini: T('h1:7'), sekerini: T('h1:9'),
    tea: T('d1a') - 0.3, e1: T('d1a') - 0.04, e2: T('d1a:2') - 0.04, pan: T('d1b') - 0.63, e3: T('d1b') - 0.04, e4: T('d1b:2') - 0.04, eSon: T('h2a') - 0.32,
    kural: T('h2a') - 0.1, birine: T('h2a:3'), h2b: T('h2b'), icmem1: T('h2b:3'), iki: T('h2b:4') - 0.08, icmem2: T('h2b:7'),
    sik0: T('h2b:6') - 0.12, n0: T('n0'), it: T('n0:2'),
    evet: T('h3'), al: T('h3:1') + 0.4, yudumKes: T('h3:3') - 0.06, yudum: T('h3:3'),
    d2: T('d2') - 0.1, hala: T('d2:3'), bilm: T('d2:4'),
    h4: T('h4') - 0.1, uc: T('h4:1'), hangisi: T('h4:4'), icerim: T('h4:6'),
    sayac: cd0 - 0.05, n1: T('n1'), ikiIht: T('n1:4'), ikisini: T('n1:7'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, acik: T('d4:11'), cta: T('d6') - 0.15,
  };
  tm.sik1 = tm.sik0 + 0.85;                 // kâğıt şekerliğin altına girer
  tm.itSon = tm.it + 1.0;                   // itilen tabak durur
  tm.birak = tm.it + 0.47;                  // Necmi'nin eli tabağı bırakır (tabak kayarak durur)
  tm.geri = tm.it + 1.25;                   // Necmi bir adım geri çekilir
  // Sayaç: Defne'nin parmağı kalan üç bardakta EŞİT süre durur (sızıntı yasağı; aşağıda denetlenir)
  // dur[i] = [parmağın bardağa vardığı an, ayrıldığı an]: her bardakta 2,5 sn; bardaklar arası geçiş 0,3 sn
  tm.dur = [0, 1, 2].map(i => [cd0 + 0.6 + i * 2.8, cd0 + 0.6 + i * 2.8 + 2.5]);
  for (const d of tm.dur) if (Math.abs((d[1] - d[0]) - (tm.dur[0][1] - tm.dur[0][0])) > 1e-9) throw new Error('b068: parmak üç bardakta eşit süre durmalı');

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...GENIS]] },
    { id: 'c1', t0: tm.c1, cam: [[0, ...YAKIN]] },
    { id: 'caylar', t0: tm.tea, cam: [[0, ...CAYLAR], [tm.pan, ...GENIS2]] },
    { id: 'kural', t0: tm.kural, cam: [[0, ...YAKIN], [tm.h2b - 0.1, 1.42, 1026, 1038]] },
    { id: 'ikili', t0: tm.iki, cam: [[0, ...IKILI]] },
    { id: 'yudum', t0: tm.yudumKes, kisa: true, cam: [[0, ...YAKIN2]] },
    { id: 'defne', t0: tm.d2, cam: [[0, ...UCLU]] },
    { id: 'soru', t0: tm.h4, cam: [[0, 1.45, 1102.5, 1034]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 1.2, 412, 1116.7]] },                 // doğrusal itme draw'daki kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, DEF_X, 1080]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...UCLU], [tm.cta, 1.31, 440, 1144]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı/.test(w)) console.error('sahne uyarısı: ' + w);   // yakın planlar ve kesme sayısı bilinçli

  // ——— pozlar (önden; üçü de tezgâhın arkasında) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: GULUS, head: { tilt: -4, look: [-0.7, 0.15] }, ...POZ.dur });
  const hik = [
    [0.45, { head: { tilt: 3, look: [-0.55, -0.45] } }, 0.3],
    [tm.gizlice, { head: { tilt: -4, look: [-0.85, 0.1] } }, 0.25],
    [tm.c1, { expr: 'mutlu', head: { tilt: 4, look: [-0.5, -0.3] } }, 0.01],
    [tm.sekerini + 0.25, { head: { tilt: -3, look: [0, 0] } }, 0.3],
    [tm.tea, { expr: GULUS, head: { tilt: -3, look: [-0.8, 0.2] } }, 0.01],
    [tm.kural, { expr: 'notr', head: { tilt: 3, look: [-0.45, -0.3] } }, 0.01],
    [tm.birine - 0.15, { head: { tilt: -2, look: [0, 0] } }, 0.3],
    [tm.h2b - 0.1, { head: { tilt: 3, look: [-0.25, 0.05] } }, 0.3],
    [tm.iki, { head: { tilt: -3, look: [-0.7, 0.1] } }, 0.01],
    [tm.sik0, { head: { tilt: -7, look: [-0.6, 0.8] } }, 0.3],
    [tm.sik1 + 0.2, { expr: GULUS, head: { tilt: 3, look: [-0.8, 0.1] } }, 0.3],
    [tm.it + 0.15, { expr: SASKIN, head: { tilt: -5, look: [-0.5, 0.8] } }, 0.25],
    [tm.evet - 0.12, { expr: 'mutlu', head: { tilt: 3, look: [-0.75, 0.15] } }, 0.25],
    [tm.al - 0.3, { head: { tilt: -5, look: [-0.35, 0.8] } }, 0.25],
    [tm.yudumKes, { expr: 'mutlu', head: { tilt: -6, look: [-0.3, 0.3] } }, 0.01],
    [tm.yudum + 0.3, { expr: KEYIF, head: { tilt: -9, look: [-0.2, 0.2] } }, 0.2],
    [tm.h4, { expr: 'mutlu', head: { tilt: 3, look: [-0.6, 0.05] } }, 0.01],
    [tm.hangisi - 0.15, { head: { tilt: -3, look: [0, 0] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: SASKIN, head: { tilt: 4, look: [0.85, -0.1] }, ...POZ.dur });
  const def = [
    [0.5, { head: { tilt: -3, look: [0.8, -0.4] } }, 0.35],
    [tm.gizlice + 0.2, { expr: 'notr', head: { tilt: 3, look: [0.85, -0.1] } }, 0.3],
    [tm.tea, { expr: 'notr', head: { tilt: 4, look: [-0.5, 0.8] } }, 0.01],
    [tm.e2 - 0.12, { head: { tilt: -4, look: [0.45, 0.8] } }, 0.25],
    [tm.pan, { head: { tilt: 3, look: [0.5, 0.75] } }, 0.3],
    [tm.e3 - 0.2, { head: { tilt: -4, look: [0.85, 0.6] } }, 0.25],
    [tm.e4, { head: { tilt: 3, look: [0.9, 0.3] } }, 0.3],
    [tm.eSon, { head: { tilt: -3, look: [0.9, -0.05] } }, 0.3],
    [tm.d2, { expr: 'notr', head: { tilt: 4, look: [0.85, 0.05] } }, 0.01],
    [tm.hala, { head: { tilt: -4, look: [0.3, 0] } }, 0.3],
    [tm.sayac, { expr: IFADE.dusun2, head: { tilt: 4, look: [0.5, 0.1] } }, 0.01],
    [tm.dur[0][0] - 0.3, { head: { tilt: 4, look: [-0.45, 0.8] } }, 0.3],
    [tm.dur[1][0] - 0.3, { head: { tilt: -3, look: [0.4, 0.8] } }, 0.3],
    [tm.dur[2][0] - 0.3, { head: { tilt: -5, look: [0.85, 0.6] } }, 0.3],
    [tm.dur[2][1], { expr: IFADE.dusun2, head: { tilt: 5, look: [0.2, -0.6] } }, 0.4],
    [tm.n1 + 0.1, { expr: IFADE.dusun2, head: { tilt: -3, look: [0.85, 0] } }, 0.3],
    [tm.ikiIht, { expr: SASKIN, head: { tilt: 5, look: [0.85, -0.1] } }, 0.25],
    [tm.ikisini + 0.3, { expr: IFADE.dusun2, head: { tilt: -3, look: [0.85, 0.05] } }, 0.35],
    [tm.n1s + 0.5, { expr: IFADE.dusun2, head: { tilt: -5, look: [0.45, -0.6] } }, 0.45],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.4, 0.7] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: -3, look: [0.4, 0.3] } }, 0.3],
    [tm.cta + 0.6, { head: { tilt: 4, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'notr', head: { tilt: -3, look: [0.85, -0.2] }, ...POZ.dur });
  const nec = [
    [0.55, { head: { tilt: 3, look: [0.8, -0.55] } }, 0.35],
    [tm.gizlice + 0.3, { head: { tilt: -2, look: [0.85, -0.2] } }, 0.3],
    [tm.tea, { expr: 'notr', head: { tilt: 3, look: [-0.8, 0.45] } }, 0.01],
    [tm.pan, { expr: GULUS, head: { tilt: -3, look: [0.2, 0.85] } }, 0.3],
    [tm.e4 - 0.3, { head: { tilt: 4, look: [0.8, 0.75] } }, 0.25],
    [tm.eSon, { expr: 'notr', head: { tilt: -3, look: [0.85, -0.2] } }, 0.3],
    [tm.iki, { expr: 'notr', head: { tilt: 3, look: [0.85, -0.2] } }, 0.01],
    [tm.sik0 + 0.1, { head: { tilt: -3, look: [0.9, 0.5] } }, 0.3],
    [tm.n0 - 0.15, { expr: 'mutlu', head: { tilt: 3, look: [0.6, -0.2] } }, 0.3],
    [tm.it - 0.45, { head: { tilt: 5, look: [0.6, 0.85] } }, 0.25],
    [tm.itSon, { expr: GULUS, head: { tilt: -3, look: [0.85, -0.2] } }, 0.3],
    [tm.d2, { expr: 'notr', head: { tilt: 3, look: [-0.85, -0.1] } }, 0.01],
    [tm.sayac, { expr: GULUS, head: { tilt: -4, look: [-0.8, 0] } }, 0.01],
    [tm.dur[0][0] - 0.2, { head: { tilt: -4, look: [-0.85, 0.5] } }, 0.35],
    [tm.dur[1][0] - 0.2, { head: { tilt: 3, look: [-0.6, 0.65] } }, 0.35],
    [tm.dur[2][0] - 0.2, { head: { tilt: -3, look: [-0.1, 0.8] } }, 0.35],
    [tm.dur[2][1], { head: { tilt: 3, look: [-0.8, 0] } }, 0.35],
    [tm.n1 - 0.3, { expr: 'mutlu', head: { tilt: 5, look: [0.8, 0.6] } }, 0.3],
    [tm.ikiIht - 0.2, { head: { tilt: -3, look: [-0.3, 0] } }, 0.3],
    [tm.ikisini, { head: { tilt: 4, look: [-0.8, -0.05] } }, 0.3],
    [tm.n1s + 0.15, { expr: GULUS, head: { tilt: -2, look: [0, 0] } }, 0.35],
    [tm.cevap, { expr: GULUS, head: { tilt: 3, look: [-0.8, 0.5] } }, 0.01],
  ];
  // Altyazı çizelgesi (yalnız balon için; dudak ve kelime çapaları asıl çizelgeden okunur):
  // · d1a ve d1b'nin balonu yoktur: Defne'nin saydığı adlar bardakların altında etiket olarak çıkar (aynı sözler, kelimesine kilitli).
  // · n1 son repliktir (cevapsız kesim): balonu "Buldum!"a kadar kalır, iki cümlesi birlikte okunur ("iki ihtimal" bölünmez).
  const tlA = { ...tl, lines: tl.lines.filter(l => l.id !== 'd1a' && l.id !== 'd1b').map(l => l.id === 'n1' ? { ...l, text: l.text.replace('iki ihtimal', 'iki ihtimal'), t1: T('d3') - 0.3 } : l) };
  return { tm, film, tlA, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Durumlar (bütün sahneler aynı fonksiyonları okur) ═══════════════════════════
// Demli şekerli bardak: Necmi tabağıyla iter (tabak kayarak durur), Hikmet alır, bir yudum içer, elinde tutar
function dsAt(S, t) {
  const { tm } = S, xg = lerp(XS[3], X5, ease.state(seg(t, tm.it, tm.itSon - tm.it)));
  if (t < tm.al) return { tabak: xg, bel: [xg, Y0 - BEL], rot: 0, dolu: DOLU, elde: false };
  const k1 = ease.enter(seg(t, tm.al, 0.35)), k2 = ease.state(seg(t, tm.yudum, 0.32)) * (1 - ease.state(seg(t, tm.yudum + 0.85, 0.4)));
  let bel = kar(H.yay([X5, Y0 - BEL], TUT, k1, 14), YUDUM, k2);
  bel = [bel[0], bel[1] - 30 * pIn(t, tm.icerim - 0.25, tm.icerim + 1.5, 0.35)];   // "içerim?": bardağı hafifçe kaldırır
  return { tabak: X5, bel, rot: 0.9 * k2, dolu: DOLU - 0.1 * ease.state(seg(t, tm.yudum + 0.3, 0.45)), elde: true };
}
// Kâğıt: göğüste → havada (gösterir) → göğüste → havada → şekerliğin altında
function kagitAt(S, t) {
  const { tm } = S;
  if (t >= tm.sik1) return { sikisik: true };
  const p = H.iz([[0, KAGIT_G], [tm.kaldir, KAGIT_Y, 0.45, ease.enter], [tm.tea, KAGIT_G, 0.01], [tm.kural - 0.22, KAGIT_Y, 0.4], [tm.sik0, SIK, tm.sik1 - tm.sik0]], t);
  const havada = clamp01((KAGIT_G[1] - p[1]) / (KAGIT_G[1] - KAGIT_Y[1]));
  const rot = -7 * havada + 9 * (H.nabiz(t, tm.demini, 0.3) - H.nabiz(t, tm.sekerini, 0.3)) + 6 * seg(t, tm.sik0, tm.sik1 - tm.sik0);
  return { sikisik: false, p, rot };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç bardakları örtmesin)
  drift: 0.006,
  split: { h1: 6, h2a: 3, h2b: 4, h4: 4 },
  // Sayaç: kalan üç bardak kadrajda sabit; kamera doğrusal iter (1,2x → 1,3x), ipucu boyunca 1,35x'e sürer.
  // Sağ kenar dünyada x = 862'de (şekerlik içeride, Hikmet dışarıda), tabakların altı ekranda y = 1228'de sabit kalır.
  // Sayaç ve ipucu plânında altyazının kuyruğu yoktur: Necmi üçüncü bardağın arkasında durur, kuyruk o bardağı gösterirdi.
  kuyruksuz: (t, B) => B.sc.id === 'sayac',
  kamera(cam, t, B) {
    if (B.sc.id !== 'sayac') return;
    const { cd0, cd, buldum } = S.tm;
    const z = t < cd ? Math.exp(lerp(Math.log(1.2), Math.log(1.3), clamp01((t - cd0) / 10))) : lerp(1.3, 1.35, clamp01((t - cd) / (buldum - cd)));
    Object.assign(cam, { zoom: z, cx: 862 - 540 / z, cy: Y0 + 20 - 268 / z });
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    etiketler(K, t, S);
    if (B.sc.id === 'cevap') H.mark(K, t, tm.acik, tm.end, B.ekr([XS[CEVAP] + 4, Y0 - 215]), true);   // arşiv
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// Bardak etiketi (ekran): iki satır, kuyruğu bardağını gösterir. Dördü de aynı biçimdedir (vurgu yok).
// uc: kuyruğun ucu, cx: kutunun ortası, ust: kutunun üst kenarı. a anında yayla (320/30) gelir, b anında 0,2 sn'de çıkar.
const ET_BOY = 46, ET_SATIR = 52;
function etiketEn(K, satirlar) { K.ctx.font = `900 ${ET_BOY}px Rubik`; return Math.max(...satirlar.map(s => K.ctx.measureText(s).width)) + 44; }
function etiket(K, t, a, b, uc, cx, ust, satirlar) {
  if (t < a - 0.001 || t > b + 0.2) return;
  const { ctx } = K, w = etiketEn(K, satirlar), h = ET_SATIR * 2 + 30, x = cx - w / 2;
  const v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, b, 0.2)), k = (0.6 + 0.4 * v) * out;
  const tx = Math.min(Math.max(uc[0], x + 44), x + w - 44);
  ctx.save(); ctx.translate(uc[0], uc[1]); ctx.scale(k, k); ctx.translate(-uc[0], -uc[1]); ctx.globalAlpha = clamp01(v * 1.6) * out; ctx.lineJoin = 'round';
  K.rect(x + 7, ust + 9, w, h, INK, 0, 22);
  K.poly([[tx - 24, ust + 6], [uc[0], uc[1]], [tx + 24, ust + 6]], PAL.mustard, LW);
  K.rect(x, ust, w, h, PAL.mustard, LW, 22);
  ctx.fillStyle = PAL.mustard; ctx.fillRect(tx - 20, ust - 1, 40, LW + 3);   // kuyruğun dibi kutuyla birleşir
  satirlar.forEach((s, i) => K.text(s, cx, ust + 15 + ET_BOY * 0.8 + i * ET_SATIR, ET_BOY, INK, 900));
  ctx.restore();
}
function etiketler(K, t, S) {
  const { tm } = S;
  if (t < tm.e1 - 0.1 || t > tm.eSon + 0.3) return;
  const ad = i => [K.up(BARDAKLAR[i].dem), K.up(BARDAKLAR[i].seker ? 'şekerli' : 'şekersiz')];
  // konum, kameranın oturduğu andan okunur ve sabit kalır (okunan yazı kaymaz)
  const ek = (tr, p) => { const c = S.film.cam(tr, 0.006); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
  for (const [i, j, tr, a1, a2, b] of [[0, 1, tm.e1 + 0.6, tm.e1, tm.e2, tm.pan - 0.05], [2, 3, tm.e3 + 0.6, tm.e3, tm.e4, tm.eSon]]) {
    const u1 = ek(tr, [XS[i], Y0 + 28]), u2 = ek(tr, [XS[j], Y0 + 28]), w1 = etiketEn(K, ad(i)), w2 = etiketEn(K, ad(j));
    const ac = Math.max(0, (w1 + w2) / 2 + 26 - (u2[0] - u1[0])) / 2, ust = Math.max(u1[1], u2[1]) + 42;   // iki kutu yan yana, aralarında 26 px
    etiket(K, t, a1, b, u1, u1[0] - ac, ust, ad(i)); etiket(K, t, a2, b, u2, u2[0] + ac, ust, ad(j));
  }
}

// "SEN DE DÜŞÜN!" sayacı (bu bölüme özel): perde yok; bardaklar ve sahnedeki olay açık kalır. Daire solda, başlık ve
// paylaşım hapı sağında, alt bantta. İpucu balonu aynı banda geleceği için sayaç son 0,3 sn'de çekilir.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1320, r = 78;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 25, 70, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(596, 1272); ctx.scale(inU * out, inU * out);
  ctx.font = '900 52px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 64;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 19, 52, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(596, 1366); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56;
    K.rect(-sw / 2 + 8, -40 + 10, sw, 80, INK, 0, 40); K.rect(-sw / 2, -40, sw, 80, PAL.coral, LW, 40); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// ——— Dünya: çay ocağı, tezgâh, dört bardak, üç kişi ———
// Kalan üç bardağın plânlarında (d2, sayaç, ipucu) Hikmet kadraj dışındadır; çizilmez.
const HIKMETSIZ = ['defne', 'sayac', 'buldum', 'cevap'];   // + açık çift plânı (kamera sağa kayana kadar)
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc, cam } = B, id = sc.id, D = tm.dur, hikVar = !HIKMETSIZ.includes(id) && !(id === 'caylar' && t < tm.pan);
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  const ds = dsAt(S, t), kg = kagitAt(S, t);

  // ——— Hikmet: sol elinde kâğıt (sonra bardak), sağ eli parmakla sayar ———
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), hO = { heads };
  let hUst = 0, hPar = null;
  for (const a of [tm.icmem1, tm.icmem2]) {   // "içmem": baş iki yana
    const e = pIn(t, a - 0.12, a + 0.42, 0.14), s = Math.sin(TAU * 2.6 * (t - a + 0.12));
    if (e > 0) hp.head = { ...hp.head, look: [hp.head.look[0] + 0.5 * e * s, hp.head.look[1]], tilt: hp.head.tilt + 4 * e * s };
  }
  H.onayla(hp, t, tm.evet, 1, 0.38);
  const tutus = kar([36, 26], [36, -14], ease.state(seg(t, tm.sik0, tm.sik1 - tm.sik0)));   // el kâğıdın sağ alt köşesinde; sıkıştırırken sağ kenarında
  if (!kg.sikisik) {
    const el = [kg.p[0] + tutus[0], kg.p[1] + tutus[1]];
    hO.L = [el, 1, 'A'];
    if (t >= tm.sik0) hUst = clamp01((el[1] - (YB - 4)) / 26);
  } else if (t < tm.al - 0.34) {
    const w = 1 - W(t, tm.sik1 + 0.1, 0.24);
    if (w > 0.01) { hO.L = [[SIK[0] + 36, SIK[1] - 14], w, 'A']; hUst = clamp01(w * 4 - 1.6); }
  } else {
    const w = W(t, tm.al - 0.34, 0.28);
    hO.L = [[ds.bel[0] - 4, ds.bel[1] + 2], w, 'A']; hUst = clamp01(w * 4 - 1.6);
  }
  const wG = 1 - W(t, tm.kaldir, 0.3);   // kare 0: iki eli de kâğıtta
  if (wG > 0.01) hO.R = [[KAGIT_G[0] + 40, KAGIT_G[1] + 2], wG, 'A'];
  const w1 = pIn(t, tm.birine - 0.3, tm.h2b - 0.15), w3 = pIn(t, tm.uc - 0.3, tm.hangisi - 0.1);
  if (w1 > 0.01 || w3 > 0.01) {
    hO.R = [H.elYeri('hikmet', hp, 'R', 'yukari'), Math.max(w1, w3)];
    if (w1 > 0.5) hPar = ['R', seg(t, tm.birine - 0.05, 0.2), { toplam: 1 }];
    if (w3 > 0.5) hPar = ['R', 3 * seg(t, tm.uc - 0.08, 0.3), { toplam: 3 }];
  }

  // ——— Necmi: d1b'de demli şekerliyi gösterir; n0'da tabağı iter; sayaçta bıyığını sıvazlar; n1'de iki parmak ———
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t), nO = { heads };
  let nUst = 0, nIs = null, nPar = null;
  if (t >= tm.iki) np.x = NEC_X2;   // Hikmet'in yakın plânından sonra bir adım sağda durur (ikili plânda Defne'nin saçı kadraja girmesin)
  if (t >= tm.it - 0.45) {
    if (t < tm.geri) H.yanAdim(np, t, { t0: tm.it - 0.36, x0: NEC_X2, x1: NEC_IT, adim: 1 });
    else H.yanAdim(np, t, { t0: tm.geri, x0: NEC_IT, x1: NEC_SON, adim: 1 });
  }
  const wN = pIn(t, tm.e4 - 0.3, tm.eSon - 0.05);
  if (wN > 0.01) { nO.R = [[XS[3] - 60, Y0 - 148], wN, 'A']; nUst = clamp01(wN * 4 - 1.6); if (wN > 0.5) nIs = ['R', [XS[3] - 8, Y0 - 118]]; }   // kolun tezgâhın arkasında kalan kısmı da çizilir (el kopuk durmasın)
  const wI = W(t, tm.it - 0.38, 0.28) * (1 - W(t, tm.birak + 0.12, 0.24));   // el tabağın sol kenarında; 95 px itip bırakır
  if (wI > 0.01) { nO.R = [[Math.min(ds.tabak, XS[3] + 95) - 76, Y0 - 8], wI, 'A']; nUst = clamp01(wI * 4 - 1.6); }
  let nBiyik = null;
  const wB = id === 'sayac' ? pIn(t, tm.cd0 + 0.4, tm.n1 - 0.45, 0.3) : 0;   // sayaç: bıyığını sıvazlar (el yüzün önünde: en son çizilir)
  if (wB > 0.01) {
    const s = Math.sin(TAU * 0.8 * (t - tm.cd0)), bas = H.eklem('necmi', np, 'head');
    nO.R = [[bas[0] + 56 + 9 * s, bas[1] + 86 - 3 * s], wB, 'B']; if (wB > 0.6) nBiyik = [bas[0] + 14 + 9 * s, bas[1] + 60];
  }
  const w2 = W(t, tm.ikiIht - 0.3, 0.28) * (1 - W(t, tm.cevap, 0.2));
  if (w2 > 0.01) { nO.R = [wB > 0.01 ? kar(nO.R[0], H.elYeri('necmi', np, 'R', 'yukari'), w2) : H.elYeri('necmi', np, 'R', 'yukari'), Math.max(w2, wB)]; if (w2 > 0.5) nPar = ['R', 2 * seg(t, tm.ikiIht - 0.06, 0.25), { toplam: 2, yon: -Math.PI / 2 + 0.3 * pIn(t, tm.ikisini - 0.05, tm.ikisini + 1.0, 0.15) * Math.sin(TAU * 2 * (t - tm.ikisini)) }]; }   // "İkisini de": iki parmağını sallar
  H.onayla(np, t, tm.n1s + 0.35, 2, 0.36);

  // ——— Defne: d1'de üç bardağı gösterir; sayaçta parmağı kalan üç bardakta eşit süre durur ———
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t), dO = { heads }, dIs = [];
  dp.y -= H.buldumHop(t, tm.buldum);
  H.omuzSilk(dp, t, tm.bilm - 0.08, 0.6);
  const vur = a => 9 * (H.nabiz(t, a + 0.9, 0.3) + H.nabiz(t, a + 1.7, 0.3));   // dokunuş: her bardakta iki kez, aynı anlarda
  const elL = (i, dy = 0) => [XS[i] + 22, Y0 - 205 + dy], elR = (i, dy = 0) => i === 2 ? [XS[i] - 62, Y0 - 160 + dy] : [XS[i] - 22, Y0 - 205 + dy];   // üçüncü bardağa kol alçaktan uzanır (Necmi'nin çenesini kapatmasın)
  const ucR = el => { const u = clamp01((el[0] - elR(1)[0]) / (elR(2)[0] - elR(1)[0])); return [el[0] + lerp(22, 46, u), el[1] + lerp(50, 8, u)]; };   // parmağın gösterdiği yer (bardağın ağzı)
  let wL = pIn(t, tm.e1 - 0.3, tm.e2 + 0.15), hL = elL(0), wR = pIn(t, tm.e2 - 0.3, tm.e4 + 0.1);
  let hR = H.dokunYolu(t, [[tm.e2 - 0.3, elR(1)], [tm.e2, elR(1)], [tm.e3, elR(2)]], { yuksel: 26, sure: 0.3 });
  if (id === 'sayac') {
    wL = pIn(t, D[0][0] - 0.28, D[0][1]); hL = elL(0, vur(D[0][0]));
    wR = pIn(t, D[1][0] - 0.28, D[2][1]);
    const p = H.dokunYolu(t, [[D[1][0] - 0.3, elR(1)], [D[1][0], elR(1)], [D[2][0], elR(2)]], { yuksel: 26, sure: 0.3 });
    hR = [p[0], p[1] + vur(D[1][0]) + vur(D[2][0])];
  }
  if (id === 'cevap' || id === 'buldum') { wL = id === 'cevap' ? W(t, tm.acik - 0.45, 0.3) * (1 - W(t, tm.cta, 0.3)) : 0; hL = elL(0); wR = 0; }
  if (wL > 0.01) { dO.L = [hL, wL, 'A']; if (wL > 0.5) dIs.push(['L', [hL[0] - 22, hL[1] + 50]]); }
  if (wR > 0.01) { dO.R = [hR, wR, 'A']; if (wR > 0.5) dIs.push(['R', ucR(hR)]); }
  const wC = id === 'sayac' ? W(t, D[2][1] + 0.1, 0.35) : 0;   // sayacın sonu ve ipucu: eli çenesinde düşünür (el yüzün önünde: en son çizilir)
  if (wC > 0.01) { const bas = H.eklem('defne', dp, 'head'), cene = [bas[0] + 52, bas[1] + 128 - 7 * (H.nabiz(t, tm.n1s + 0.9, 0.3) + H.nabiz(t, tm.n1s + 1.5, 0.3))]; dO.R = [wR > 0.01 ? kar(hR, cene, wC) : cene, Math.max(wC, wR), 'B']; }

  // ——— çizim: kişiler → tezgâh → arka sıra → tezgâha uzanan kollar → tabaklar, bardaklar → eldeki nesne → eller ———
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const hc = hikVar ? oyna(K, t, tl, 'hikmet', hp, hO) : null;
  const nc = id === 'buldum' ? null : oyna(K, t, tl, 'necmi', np, nO);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  // altyazı kuyruğu kısa kalır (bardakların üstünden geçmesin): baş noktası balonun hemen üstüne indirilir
  for (const k of Object.keys(heads)) heads[k] = [heads[k][0], cam.cy + (1085 - 960) / cam.zoom];

  tezgah(K);
  caydanlik(K, 1290, YA + 8, t);
  if (kg.sikisik) kagitSikisik(K);
  sekerlik(K, SEK, 0.08 * H.nabiz(t, tm.sik1 - 0.16, 0.36));
  if (hc) kolUst(K, 'hikmet', hp, 'L', hUst);
  if (nc) kolUst(K, 'necmi', np, 'R', nUst);
  for (let i = 0; i < 4; i++) tabak(K, i === ICILEN ? ds.tabak : XS[i]);
  for (let i = 0; i < 4; i++) {
    const x = i === ICILEN ? ds.tabak : XS[i], b = BARDAKLAR[i];
    if (i === ICILEN && ds.elde) { sekerler(K, x); continue; }
    bardak(K, [x, Y0 - BEL], b.dem);
    if (b.seker) sekerler(K, x);
    H.buhar(K, x, Y0 - 178, t + i * 0.47, { k: 0.45, n: 2, ara: 22, boy: 62 });
  }
  if (hc && ds.elde) {
    bardak(K, ds.bel, BARDAKLAR[ICILEN].dem, { rot: ds.rot, dolu: ds.dolu });
    if (ds.rot < 0.15) H.buhar(K, ds.bel[0], ds.bel[1] - 93, t + 1.4, { k: 0.45, n: 2, ara: 22, boy: 62 });
  }
  if (hc && (hUst > 0.01 || ds.elde)) elUst(K, 'hikmet', hp, 'L', ds.elde ? 1 : hUst);
  if (nc && nUst > 0.01) elUst(K, 'necmi', np, 'R', nUst);
  if (hc && !kg.sikisik) { kagit(K, kg.p, kg.rot); hc.tut('L'); if (wG > 0.5) hc.tut('R'); }
  if (hc && hPar) hc.parmak(...hPar);
  if (nc && nIs) nc.isaret(nIs[0], nIs[1]);
  if (nc && nPar) nc.parmak(...nPar);
  for (const [sd, hedef] of dIs) dc.isaret(sd, hedef);
  if (nc && nBiyik) nc.isaret('R', nBiyik);
  if (wC > 0.6) dc.tut('R');
}
