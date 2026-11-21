// Bölüm 60 · TEK SORU, ÜÇ SAYI (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_060_v5.md). Mekanizma: "bilmiyorum" da bir cevaptır.
// Logline: Çay molasında, terasta. Hikmet 1, 2, 3 yazılı üç kartı karıştırır, birini göğüs cebine sokar. Defne tek bir soru
// soracak; Hikmet hep doğruyu söyler ve yalnız EVET, HAYIR ya da BİLMİYORUM diyebilir. Hikmet üç pulu masaya dizer. Necmi
// parmaklarıyla sayar: iki cevap üç sayıya yetmez. Hikmet "bilmiyorum demem" deyip BİLMİYORUM pulunu yere yatırır. Sayaçtan
// sonra Necmi o pulu yeniden ayağa kaldırır: "Bilmiyorum demek, bazen her şeyi söyler."
// Akılda kalacak tek şey: "bilmiyorum" da bir cevaptır; soruyu Hikmet'in bilemeyeceği bir şeye bağlarsan üçüncü kapı açılır.
// Sızıntı yasağı: pullar kartlarla eşleştirilmez (çizgi, renk, hiza yok); pullar aynı renktir, kartlar pulların yanında durmaz.
// Mekân: ofis terası (önden; tente, korkuluk, şehir silueti, kareli örtülü uzun masa, çaydanlık arabası).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const TER = 'b060_teras', TZ = 1250, PB = TZ - 6;        // masanın ön kenarı, pulların tabanı
const DEF_X = 300, HIK_X = 540, NEC_X = 795;
// Pullar (aynı renk, aynı boy; yalnız yazı genişliği kadar en). Kartlarla hizası yok.
const PUL = [
  { ad: 'EVET', x: 270, w: 160 },
  { ad: 'HAYIR', x: 468, w: 196 },
  { ad: 'BİLMİYORUM', x: 751, w: 330 },
];
const PH = 76, PUL_BOY = 46;
const CW = 86, CH = 122;                                 // oyun kartı
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Mantık (build anında; yalnız arşiv cevabı için denetim) ═══════════════════════════
// Defne aklından 0 ya da 1 tutar: "toplam 2'den büyük mü?" Hikmet 3 → hep evet, 1 → hep hayır, 2 → bilemez.
function mantik() {
  const cevap = h => { const s = new Set([0, 1].map(d => d + h > 2)); return s.size > 1 ? 'bilmiyorum' : s.has(true) ? 'evet' : 'hayır'; };
  const c = [1, 2, 3].map(cevap);
  if (new Set(c).size !== 3) throw new Error('b060: üç sayı üç ayrı cevap vermiyor: ' + c.join(','));
  return c;
}
mantik();

// ═══════════════════════════ Nesneler ═══════════════════════════
// Oyun kartı: (x, y) merkez. f: çevirme 0 (yüzü) … 1 (arkası). rot derece, k ölçek, rakam
function kart(K, x, y, { f = 0, rot = 0, k = 1, rakam = '' } = {}) {
  const { ctx } = K, sx = Math.abs(Math.cos(Math.PI * f));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(Math.max(0.03, sx) * k, k);
  K.rect(-CW / 2 + 5, -CH / 2 + 6, CW, CH, INK, 0, 9);
  if (f < 0.5) {
    K.rect(-CW / 2, -CH / 2, CW, CH, '#FFFFFF', LW * 0.7, 9);
    K.text(rakam, 0, 24, 68, INK, 900);
    K.text(rakam, -CW / 2 + 15, -CH / 2 + 24, 22, PAL.coral, 900);
  } else kartSirt(K);
  ctx.restore();
}
function kartSirt(K) {
  const { ctx } = K;
  K.rect(-CW / 2, -CH / 2, CW, CH, PAL.teal, LW * 0.7, 9);
  ctx.save(); ctx.beginPath(); ctx.roundRect(-CW / 2 + 9, -CH / 2 + 9, CW - 18, CH - 18, 5); ctx.clip();
  ctx.strokeStyle = '#8FB8B0'; ctx.lineWidth = 3;
  for (let d = -CH; d < CH; d += 18) { ctx.beginPath(); ctx.moveTo(-CW / 2, d); ctx.lineTo(CW / 2, d + CW); ctx.stroke(); ctx.beginPath(); ctx.moveTo(CW / 2, d); ctx.lineTo(-CW / 2, d + CW); ctx.stroke(); }
  ctx.restore();
  K.rect(-CW / 2 + 9, -CH / 2 + 9, CW - 18, CH - 18, null, 2.5, 5);
}
// Cevap pulu: (x, b) tabanın ortası. th 0 ayakta, π/2 sırtüstü yatık (yazı yukarı bakar, görünmez). rot: titreme, lift: kabarma
function pul(K, P, b, { th = 0, rot = 0, lift = 0 } = {}) {
  const { ctx } = K, c = Math.cos(th), h = PH * c, w = P.w;
  ctx.save(); ctx.translate(P.x, b - lift); ctx.rotate(rot);
  if (c > 0.12) {
    K.rect(-w / 2 + 6, -h + 7, w, h, INK, 0, 12);
    K.rect(-w / 2, -h, w, h, PAL.cream, LW * 0.8, 12);
    K.rect(-w / 2 + 7, -h + 7, w - 14, h - 14, null, 2.5, 8);
    ctx.save(); ctx.scale(1, c); K.text(P.ad, 0, -PH / 2 + PUL_BOY * 0.36, PUL_BOY, INK, 900); ctx.restore();
  } else {   // yatık: ince dilim (alt yüzü)
    K.rect(-w / 2 + 4, -14, w, 14, INK, 0, 5);
    K.rect(-w / 2, -16, w, 14, '#D8CDB6', LW * 0.7, 5);
  }
  ctx.restore();
}
// Çaydanlık (arabanın üstünde; döngü: buhar)
function caydanlik(K, x, y, t) {
  K.rect(x - 70, y + 70, 140, 14, PAL.woodTop, LW, 4);
  K.rect(x - 60, y + 84, 120, 236, PAL.wood, LW, 6);
  K.circ(x - 40, 1488, 14, '#3B3F45', 3); K.circ(x + 40, 1488, 14, '#3B3F45', 3);
  K.poly([[x - 46, y + 70], [x + 46, y + 70], [x + 38, y], [x - 38, y]], '#C9CFC9', LW * 0.8);
  K.poly([[x + 40, y + 30], [x + 78, y - 6], [x + 84, y + 2], [x + 46, y + 50]], '#C9CFC9', LW * 0.7);
  K.poly([[x - 28, y], [x + 28, y], [x + 22, y - 54], [x - 22, y - 54]], '#E3E6E1', LW * 0.8);
  K.circ(x, y - 58, 8, INK, 0);
  H.buhar(K, x + 84, y - 10, t, { k: 0.5, n: 2, ara: 12, boy: 70 });
}
// Martı (gökte süzülür: döngü)
function marti(K, t) {
  const u = (t * 0.07) % 1, x = -200 + u * 1500, y = 690 + 30 * Math.sin(u * TAU * 1.5), k = 1 + 0.12 * Math.sin(t * 5.5);
  const { ctx } = K; ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 26, y - 6 * k); ctx.quadraticCurveTo(x - 12, y - 16 * k, x, y); ctx.quadraticCurveTo(x + 12, y - 16 * k, x + 26, y - 6 * k); ctx.stroke(); ctx.restore();
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(TER, {
  gen: [-300, 1400], dongu: ['bulutlar ve martı', 'çaydanlıkta buhar'],
  capa: { masa: [540, TZ] }, kadraj: { genis: [0.97, 540, 950] },
  arka(K, t, { isik }) {
    M.acikHava(K, { x0: -400, x1: 1500, floorY: 1500, isik, zemin: 'teras', t, gunes: 0.78 });
    marti(K, t);
    // korkuluk
    for (let x = -380; x < 1500; x += 96) K.rect(x, 1180, 16, 320, '#E9E4DA', 3, 3);
    K.rect(-400, 1168, 1900, 24, '#E9E4DA', LW, 6);
    K.rect(-400, 1330, 1900, 14, '#E9E4DA', 3, 4);
    // tente: çizgili saçak
    const { ctx } = K;
    for (let i = -6; i < 22; i++) { ctx.fillStyle = i % 2 ? PAL.cream : PAL.teal; ctx.fillRect(i * 80, 0, 80, 560); }
    ctx.beginPath(); ctx.moveTo(-480, 560);
    for (let i = -6; i < 22; i++) ctx.arc(i * 80 + 40, 560, 40, Math.PI, 0, true);
    ctx.lineTo(1760, 0); ctx.lineTo(-480, 0); ctx.closePath();
    ctx.save(); ctx.clip(); for (let i = -6; i < 22; i++) { ctx.fillStyle = i % 2 ? PAL.cream : PAL.teal; ctx.fillRect(i * 80, 540, 80, 70); } ctx.restore();
    ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
    K.line(-480, 560, 1760, 560, 3, INK);
    // saksı (solda) ve çaydanlık arabası (sağda)
    K.poly([[-10, 1500], [110, 1500], [126, 1380], [-26, 1380]], '#C4693F', LW);
    for (let i = 0; i < 5; i++) H.yaprak(K, 50 + (i - 2) * 14, 1380, 120, -90 + (i - 2) * 22, PAL.green, 1);
    for (let i = 0; i < 3; i++) K.circ(18 + i * 34, 1262 - (i % 2) * 26, 13, PAL.coral, 3);
    caydanlik(K, 1010, 1110, t);
  },
});
// Masa (karakterlerden sonra: bacakları örter). Üst yüz derin bir şerit (önünde çay bardakları), önde yere kadar kareli örtü:
// kadrajın altı ölü zemin olmasın (koordinatör revizyonu: zemin ≤ %10).
const TOP1 = TZ + 252;                                    // derin üst yüz: pullar altyazının üstünde kalır, örtü yalnız en altta                                    // masanın ön kenarı (üst yüzün bittiği yer)
const BARDAK = [[-17, -38], [17, -38], [10, -22], [15, -6], [12, 0], [-12, 0], [-15, -6], [-10, -22]];
const BARDAK_IC = [[-15, -31], [15, -31], [8.6, -22], [13.2, -6], [10.4, -2], [-10.4, -2], [-13.2, -6], [-8.6, -22]];
function cay(K, x, yb, t, k = 1.15) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 1, 26, 6, PAL.cream, 2.5);
  K.poly(BARDAK, '#F3EEE4', 0); K.poly(BARDAK_IC, '#A8401F', 0); K.poly(BARDAK, null, 2.6);
  K.line(-9, -33, -6, -26, 2.4, '#FFFFFF');
  ctx.restore();
  H.buhar(K, x, yb - 46 * k, t, { k: 0.4 * k, n: 2, ara: 10, boy: 60 });
}
function masa(K, t) {
  const { ctx } = K, x0 = -300, x1 = 1400;
  K.poly([[x0, TZ - 26], [x1, TZ - 26], [x1 + 120, TOP1], [x0 - 120, TOP1]], '#F6EFE2', LW);
  for (const y of [TZ + 60, TZ + 150]) K.line(x0, y, x1, y, 2.5, '#EAE0CD');
  // örtünün sarkan kısmı: büyük, düşük kontrastlı kareler (krem üstüne soluk kırmızı)
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 120, TOP1, x1 - x0 + 240, 1000); ctx.clip();
  ctx.fillStyle = PAL.paper; ctx.fillRect(x0 - 120, TOP1, x1 - x0 + 240, 1000);
  for (let r = 0; r < 12; r++) for (let c = 0; c < 26; c++) if ((r + c) % 2 === 0) { ctx.fillStyle = '#EDCDBE'; ctx.fillRect(x0 - 120 + c * 80, TOP1 + r * 80, 80, 80); }
  ctx.restore();
  K.line(x0 - 120, TOP1, x1 + 120, TOP1, LW, INK);
  // çay bardakları (döngü: buhar) ve şekerlik — pulların önünde, aşağıda: yazıları örtmez
  cay(K, 170, TZ + 214, t, 1.3); cay(K, 640, TZ + 220, t, 1.3); cay(K, 915, TZ + 214, t, 1.3);
  K.rect(368, TZ + 150, 72, 50, '#E9E4DA', 3, 8); K.ell(404, TZ + 150, 38, 10, '#F3EEE4', 3);
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    bir: T('h1:0'), iki: T('h1:1'), uc: T('h1:4'), birini: T('h1:5'), tuttum: T('h1:6'),
    tek: T('h2a:1'), ben: T('h2a:5'), dogru: T('h2a:7'), h2b: T('h2b'), evet: T('h2b:2'), hayir: T('h2b:4'), bilmem: T('h2b:7'),
    d1: T('d1'), sayiniz: T('d1:0'), n0a: T('n0a'), nIki: T('n0a:2'), nUc: T('n0a:4'), bilemez: T('n0a:6'),
    n0: T('n0'), evetle: T('n0:0'), nHayir: T('n0:1'), ucuncu: T('n0:5'), yetmez: T('n0:6'),
    hd: T('hd'), sayimi: T('hd:2'), hBilmem: T('hd:4'), demem: T('hd:5'),
    d2: T('d2'), dTek: T('d2:1'), kesin: T('d2:4'), h3: T('h3'), h3s: T('h3>'),
    n1: T('n1'), nBil: T('n1:0'), herSey: T('n1:3'), n1s: T('n1>'),
    cevap: Math.max(T('d3:1') - 0.1, T('d3') + 0.82), cta: T('d6') - 0.15,
  };
  // kart oyunu (h1): yelpaze açılır, rakamlar kelimesinde kabarır, "Birini"de kartlar arkasını döner, karışır, biri cebe girer
  tm.cevir = tm.birini - 0.06;
  tm.kar0 = tm.cevir + 0.36; tm.kar1 = tm.kar0 + 0.5;
  tm.cek = tm.kar1 + 0.04; tm.cep = tm.cek + 0.55;           // sağ el bir kartı çeker, göğüs cebine sokar
  tm.indir = tm.cek + 0.12;                                   // sol el kalan iki kartı masanın altına (cebine) indirir
  // pullar: [an, pul, kim, el] kalkış; hd'de BİLMİYORUM yatar; ipucunda Necmi kaldırır
  tm.pulKalk = [tm.evet - 0.03, tm.hayir - 0.03, tm.bilmem - 0.03];
  tm.yatir = T('hd:6') + 0.08;
  tm.kaldir = tm.nBil - 0.02;
  // sayaç: Defne EVET'e ve HAYIR'a dokunur, yatık pula bakar, Hikmet'in cebine bakar (Hikmet cebini kapatır), düşünür;
  //        Necmi yatık pula bakar, düşünür, ipucuna doğru uzanır
  tm.dDokun = [[cd0 + 1.0, 0], [cd0 + 1.75, 1]];
  tm.dYatik = cd0 + 2.6; tm.dCep = cd0 + 3.8;
  tm.bak = [cd0 + 4.3, cd0 + 4.6, cd0 + 5.1, cd0 + 6.3, cd0 + 6.8];   // Hikmet kartı cebinden çıkarır, gizlice bakar, geri sokar
  tm.dDusun = [cd0 + 5.2, cd - 0.9];
  tm.nBak = cd0 + 6.2; tm.nDusun = [cd0 + 6.8, cd - 0.7];

  // Kadraj (koordinatör revizyonu, 22 Kas): karakterler ve masa kadrajı doldurur; masanın ön kenarı ekranda y ≈ 1400.
  // Grup 1,25–1,3x, yakınlar 1,5–1,7x. Kural: başlar kartın en az 30 px altında; görünen pul ya tam kadrajda ya hiç yok;
  // ayaktaki pullar altyazının (y 1255) üstünde.
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.28, 540, 1025], [tm.uc, 1.3, 542, 1028]] },
    { id: 'kart', t0: tm.birini - 0.12, cam: [[0, 1.7, 552, 1010], [tm.cek, 1.7, 560, 1008], [tm.cep, 1.7, 570, 1006]] },          // yakın: kartlar döner, karışır, biri cebe
    { id: 'iki', t0: tm.tek - 0.08, cam: [[0, 1.5, 420, 1044], [tm.ben, 1.5, 460, 1046]] },
    { id: 'pullar', t0: tm.h2b - 0.1, cam: [[0, 1.4, 553, 1058], [tm.d1 - 0.15, 1.28, 540, 1025]] },   // masa inserti; d1'de Defne'ye kayar
    { id: 'necmi', t0: tm.n0a - 0.12, cam: [[0, 1.5, 934, 1046], [tm.n0, 1.5, 934, 1046], [tm.ucuncu, 1.5, 934, 1046]] },   // HAYIR kadraj dışında, BİLMİYORUM tam içeride
    { id: 'hd', t0: tm.hd - 0.1, cam: [[0, 1.5, 722, 1044], [tm.hBilmem, 1.5, 722, 1046]] },                                    // EVET dışarıda, HAYIR ve BİLMİYORUM tam
    { id: 'defne', t0: tm.d2 - 0.1, cam: [[0, 1.5, 335, 1046], [tm.h3 - 0.1, 1.45, 440, 1052], [tm.h3s, 1.45, 442, 1052]] },
    { id: 'sayac', t0: cd0 - 0.05, dogrusal: [1.2, 1.344], cam: [[0, 1.2, 540, 975]] },   // doğrusal itme (1,0 → 1,12 oranında): h.kamera
    { id: 'ipucu', t0: tm.n1 - 0.25, cam: [[0, 1.36, 553, 1058], [tm.n1s, 1.39, 553, 1058], [tm.buldum - 0.1, 1.41, 553, 1058]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.6, 300, 1060]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.28, 540, 1025], [tm.cta, 1.5, 380, 1075]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: 4, look: [0.05, 0.7] }, ...POZ.dur });
  const hik = [
    [tm.tuttum - 0.1, { head: { tilt: -3, look: [-0.2, 0.15] } }, 0.3],
    [tm.cep + 0.1, { head: { tilt: -4, look: [-0.8, 0.15] } }, 0.3],
    [tm.ben - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [-0.5, 0.05] } }, 0.3],
    [tm.h2b - 0.1, { head: { tilt: 3, look: [-0.3, 0.75] } }, 0.3],
    [tm.bilmem + 0.1, { head: { tilt: 4, look: [0.4, 0.75] } }, 0.3],
    [tm.d1 - 0.1, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.2] } }, 0.3],
    [tm.d1 + 0.6, { expr: 'saskin', head: { tilt: -6, look: [-0.8, 0.35] } }, 0.25],
    [tm.n0a - 0.12, { expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.15] } }, 0.01],
    [tm.hd - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [-0.3, 0.1] } }, 0.01],
    [tm.hBilmem - 0.1, { head: { tilt: 5, look: [0.6, 0.75] } }, 0.3],
    [tm.demem + 0.25, { expr: 'mutlu', head: { tilt: -6, look: [-0.5, 0.05] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.85, 0.15] } }, 0.01],
    [tm.h3 - 0.15, { expr: 'mutlu', ...POZ.belde, head: { tilt: 6, look: [-0.85, 0.1] } }, 0.35],
    [cd0 + 1.2, { head: { tilt: 3, look: [-0.5, 0.6] } }, 0.35],
    [tm.dCep + 0.1, { expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.2] } }, 0.25],
    [tm.bak[1] + 0.2, { expr: 'notr', head: { tilt: 7, look: [0.35, 0.7] } }, 0.35],
    [tm.bak[3], { expr: 'mutlu', head: { tilt: -4, look: [-0.6, 0.2] } }, 0.3],
    [tm.bak[4] + 0.4, { armL: POZ.dur.armL, head: { tilt: 3, look: [0.6, 0.4] } }, 0.35],
    [tm.n1 - 0.25, { expr: 'notr', armL: POZ.dur.armL, head: { tilt: 4, look: [0.85, 0.35] } }, 0.01],
    [tm.nBil + 0.3, { expr: 'saskin', head: { tilt: -4, look: [0.85, 0.5] } }, 0.25],
    [tm.n1s + 0.3, { expr: IFADE.dusun2, head: { tilt: 6, look: [0.2, -0.5] } }, 0.4],
    [tm.cevap, { expr: 'saskin', armL: POZ.dur.armL, head: { tilt: -4, look: [-0.8, 0.2] } }, 0.01],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 3, look: [0.6, 0.55] }, ...POZ.dur });
  const def = [
    [0.7, { head: { tilt: -2, look: [0.75, 0.45] } }, 0.35],
    [tm.tuttum, { expr: 'notr', head: { tilt: 4, look: [0.8, 0.05] } }, 0.3],
    [tm.tek - 0.25, { expr: 'notr', head: { tilt: 4, look: [0.8, 0.05] } }, 0.01],
    [tm.ben, { expr: 'mutlu', head: { tilt: -3, look: [0.85, 0.1] } }, 0.3],
    [tm.h2b - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.5, 0.75] } }, 0.3],
    [tm.d1 - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [0.85, 0.25] } }, 0.3],
    [tm.n0a - 0.12, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.1] } }, 0.01],
    [tm.hd - 0.1, { expr: 'notr', head: { tilt: 4, look: [0.85, 0.1] } }, 0.01],
    [tm.demem + 0.2, { expr: 'kizgin', head: { tilt: -4, look: [0.8, 0.0] } }, 0.25],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [0.75, 0.05] } }, 0.01],
    [tm.h3 - 0.1, { expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.1] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: 4, look: [0.3, 0.75] } }, 0.3],
    [tm.dDokun[1][0] + 0.2, { head: { tilt: 2, look: [0.55, 0.75] } }, 0.3],
    [tm.dYatik, { expr: IFADE.dusun, head: { tilt: -4, look: [0.95, 0.7] } }, 0.35],
    [tm.dCep - 0.1, { expr: 'notr', head: { tilt: 5, look: [0.85, 0.3] } }, 0.3],
    [tm.dDusun[0], { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.3, -0.5] } }, 0.4],
    [tm.dDusun[1], { expr: 'saskin', armR: POZ.dur.armR, head: { tilt: -3, look: [0.9, 0.1] } }, 0.3],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.7, 0.3] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.5, 0.3] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'notr', head: { tilt: -3, look: [-0.75, 0.55] }, ...POZ.dur });
  const nec = [
    [0.8, { head: { tilt: 3, look: [-0.6, 0.45] } }, 0.35],
    [tm.tuttum, { head: { tilt: -4, look: [-0.8, 0.1] } }, 0.3],
    [tm.h2b - 0.1, { head: { tilt: 3, look: [-0.5, 0.75] } }, 0.3],
    [tm.d1 - 0.1, { head: { tilt: -3, look: [-0.9, 0.15] } }, 0.3],
    [tm.n0a - 0.12, { expr: 'notr', head: { tilt: -4, look: [-0.5, 0.05] } }, 0.01],
    [tm.nIki - 0.1, { expr: IFADE.dusun2, head: { tilt: 5, look: [0.3, -0.4] } }, 0.3],
    [tm.bilemez - 0.1, { expr: 'yorgun', head: { tilt: -5, look: [-0.6, 0.1] } }, 0.3],
    [tm.n0 - 0.05, { expr: 'notr', head: { tilt: 4, look: [-0.4, 0.0] } }, 0.3],
    [tm.ucuncu - 0.1, { expr: IFADE.dusun2, head: { tilt: 6, look: [0.35, -0.45] } }, 0.3],
    [tm.yetmez, { expr: 'yorgun', head: { tilt: -3, look: [-0.7, 0.1] } }, 0.25],
    [tm.hd - 0.1, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.2] } }, 0.01],
    [tm.demem + 0.2, { head: { tilt: 4, look: [-0.4, 0.75] } }, 0.3],
    [tm.d2 - 0.1, { head: { tilt: -3, look: [-0.9, 0.15] } }, 0.01],
    [cd0, { expr: 'notr', head: { tilt: -3, look: [-0.7, 0.3] } }, 0.3],
    [tm.nBak, { head: { tilt: 5, look: [-0.25, 0.8] } }, 0.35],
    [tm.nDusun[0], { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: -5, look: [-0.4, -0.4] } }, 0.4],
    [tm.nDusun[1], { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.3, 0.75] } }, 0.35],
    [tm.nBil + 0.4, { head: { tilt: -3, look: [-0.2, 0.6] } }, 0.3],
    [tm.herSey + 0.3, { expr: 'mutlu', head: { tilt: -5, look: [-0.05, 0.05] } }, 0.35],
    [tm.n1s + 0.5, { head: { tilt: 5, look: [-0.75, 0.2] } }, 0.4],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, 0.3] } }, 0.01],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Pul ve kart durumları (bütün sahneler aynı fonksiyonları okur) ═══════════════════════════
function pulAt(S, i, t) {
  const { tm } = S;
  let th = Math.PI / 2, rot = 0, lift = 0;
  const a = tm.pulKalk[i];
  if (t >= a - 0.02) th = Math.PI / 2 * (1 - ease.state(seg(t, a - 0.02, 0.24)));      // dokununca ayağa kalkar
  if (i === 2) {
    if (t >= tm.yatir) th = Math.PI / 2 * seg(t, tm.yatir, 0.22) ** 2;                   // fiske: sırtüstü düşer, masada durur
    if (t >= tm.kaldir) th = Math.PI / 2 * (1 - ease.state(seg(t, tm.kaldir, 0.4)));    // Necmi kaldırır
    lift += 10 * H.nabiz(t, tm.herSey, 0.34);
  }
  for (const [b, k] of tm.dDokun) if (k === i) rot += 3.5 * D2R * H.sars(t, b, 0.42, 6);
  return { th, rot, lift };
}
const pulUst = (S, i, t) => { const P = PUL[i], s = pulAt(S, i, t); return [P.x, PB - s.lift - Math.max(16, PH * Math.cos(s.th))]; };
// Yelpaze: üç kartın merkezleri ve açıları. Dönen: [{ x, y, rot, rakam }] (pivot iki elin arası)
const PIV = [HIK_X, 1166];
function yelpaze(S, t) {
  const { tm } = S;
  const ac = lerp(0.62, 1, ease.enter(seg(t, 0.15, 0.45))) * (1 - ease.state(seg(t, tm.kar0, 0.16))) + 0.75 * ease.state(seg(t, tm.kar1 - 0.18, 0.18));
  const ks = [tm.bir, tm.iki, tm.uc];
  return [0, 1, 2].map(i => {
    const a = (i - 1) * 9 * ac, r = CH / 2 + 4;
    let dx = 0; if (t > tm.kar0 && t < tm.kar1) { const u = seg(t, tm.kar0 + 0.12, tm.kar1 - tm.kar0 - 0.2); dx = 46 * Math.sin(TAU * (u + i / 3)) * Math.sin(Math.PI * u); }
    const lift = 16 * H.nabiz(t, ks[i] - 0.04, 0.34);
    return { x: PIV[0] + dx + (i - 1) * 96 * ac, y: PIV[1] - r - lift + Math.abs(i - 1) * 10 * ac, rot: a, rakam: String(i + 1), ac };
  });
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => { H.cerceve(K, t, ep, tl, S, {
  split: { d4: 8 },
  kuyruksuz: t => t >= S.tm.h2b,   // pullar masadayken balon kuyruğu pul yazılarının üstünden geçmesin (konuşanı renk şeridi gösterir)
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç bu bölüme özel: perde yok, yüzleri örtmez)
  dunya(K, t, B) { teras(K, t, tl, S, B); },
  kamera(cam, t, B) {   // sayaç: yavaş, doğrusal itme 1,0x → 1,12x (zoom logaritmik uzayda)
    const d = B.sc.dogrusal; if (!d) return;
    const u = clamp01((t - B.sc.t0) / (B.sc.t1 - B.sc.t0));
    cam.zoom = Math.exp(lerp(Math.log(d[0]), Math.log(d[1]), u)); cam.cx = lerp(540, 548, u); cam.cy = 975;
  },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.cevap) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    S._B = B;
  },
});
  if (t < S.tm.end && S._B) ipucuKalir(K, t, tl, S, S._B);   // altyazının ÜSTÜNE: sönen kopyanın gölgesi balonu grileştirmesin
};

// Cevapsız sürümde film n1'den sonra "Buldum!"dan 0,12 sn önce kesilir. Altyazı kuralı (t1 + 0,3'te 0,12 sn'de söner) ipucunu
// son karelerde soldurur; ipucu cümlesi son karede de tam okunur kalsın diye aynı balon tam opak olarak alttan çizilir.
function ipucuKalir(K, t, tl, S, B) {
  const l = tl.lines.find(x => x.id === 'n1'), d3 = tl.lines.find(x => x.id === 'd3');
  if (t < l.t1 + 0.1 || t >= d3.t0 - 0.04) return;
  H.caption(K, { line: l, text: l.text, age: 5, left: 5 }, { y: 1255, head: null });
}

// "SEN DE DÜŞÜN!" sayacı (b057 uyarlaması): başlık kartın altında, daire başların üstünde, paylaşım hapı örtünün üstünde.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 850, y = 568, r = 64;
  ctx.save(); ctx.translate(410, 568); ctx.scale(inU * out, inU * out);
  ctx.font = '900 56px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 64;
  K.rect(-bw / 2 + 8, -40 + 9, bw, 80, INK, 0, 40); K.rect(-bw / 2, -40, bw, 80, PAL.mustard, LW, 40);
  K.text('SEN DE DÜŞÜN!', 0, 20, 56, INK, 900);
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 22, 60, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(540, 1380); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 46px Rubik'; const sw = ctx.measureText(share).width + 64;
    K.rect(-sw / 2 + 8, -46 + 10, sw, 92, INK, 0, 46); K.rect(-sw / 2, -46, sw, 92, PAL.mustard, LW, 46); K.text(share, 0, 16, 46, INK, 900);
    ctx.restore();
  }
}

// Göğüs cebi (Hikmet'in sol göğsü = ekranın sağı): cebin ağzı
function cepYeri(hp) {
  const n = H.eklem('hikmet', hp, 'neck'), sh = H.eklem('hikmet', hp, 'shR'), pv = H.eklem('hikmet', hp, 'pelvis');
  return [lerp(n[0], sh[0], 0.55), lerp(n[1], pv[1], 0.36)];
}
function cepCiz(K, hp, kartVar, kartU) {
  const c = cepYeri(hp), s = hp.s / 250, w = 64 * s, h = 52 * s;
  if (kartVar) {   // kart cebe girer: kartU 0 (cebin üstünde) … 1 (yarısı içeride)
    const { ctx } = K; ctx.save(); ctx.translate(c[0], c[1] - (CH / 2) * 0.62 * s - (1 - kartU) * 40 * s + 22 * s); ctx.rotate(-4 * D2R); ctx.scale(0.62 * s, 0.62 * s); kartSirt(K); ctx.restore();
  }
  K.rect(c[0] - w / 2, c[1], w, h, H.CARDS.hikmet.torso.shade, LW * 0.6 * s, 4);
}

// ═══════════════════════════ Teras: bütün sahneler ═══════════════════════════
function teras(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, TER, 'arka', t, { isik: M.ISIK.gunduz });
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  if (id === 'sayac') { H.glance(hp, t, tm.cd - 0.5, 9.5); }
  H.omuzSilk(np, t, tm.bilemez + 0.22, 0.25);
  if (t > tm.yetmez - 0.05 && t < tm.yetmez + 0.75) { const u = seg(t, tm.yetmez - 0.05, 0.75); np.head = { ...np.head, look: [(np.head.look?.[0] || 0) + 0.45 * Math.sin(TAU * 2 * u) * Math.sin(Math.PI * u), np.head.look?.[1] || 0] }; }   // baş sallar: "yetmez"
  if (t > tm.demem + 0.25 && t < tm.demem + 1.0) H.onayla(hp, t, tm.demem + 0.25, 2, 0.34);

  // ——— Hikmet ———
  const ho = { heads };
  let yel = null, cekP = null, yigin = null, hIs = null, yiginAlti = false, kartCepte = t >= tm.cep, cepU = 1;
  if (t < tm.cep) {
    yel = yelpaze(S, t);
    const ac = yel[0].ac; ho.L = [[PIV[0] - 96 * ac - 6, PIV[1] + 12], 1, 'A']; ho.R = [[PIV[0] + 96 * ac + 6, PIV[1] + 14], 1, 'A'];
    if (t >= tm.cek - 0.3) {
      // sağ el ortadaki kartı çeker ve cebe taşır; sol el kalan ikisini masanın altına indirir
      const c0 = [yel[1].x, yel[1].y], cep = cepYeri(hp);
      const cp = [cep[0], cep[1] - 28];
      const u = ease.state(seg(t, tm.cek, tm.cep - tm.cek));
      cekP = t < tm.cek ? c0 : H.yay(c0, cp, u, 40);
      ho.R = [[cekP[0] + 8, cekP[1] + 40], W(t, tm.cek - 0.3, 0.28), 'A'];
      if (t >= tm.indir) {
        const v = ease.state(seg(t, tm.indir, 0.55));
        yigin = kar([PIV[0] - 20, PIV[1] - 40], [PIV[0] - 90, TZ + 80], v);
        ho.L = [[yigin[0] - 6, yigin[1] + 40], 1, 'A'];
        yiginAlti = v > 0.55;
      }
    }
  } else if (t < tm.cep + 0.55) {
    // el cebe bastırır, iner
    const c = cepYeri(hp); cepU = ease.state(seg(t, tm.cep - 0.1, 0.3));
    ho.R = [[c[0] + 4, c[1] + 6], 1 - W(t, tm.cep + 0.25, 0.3), 'A'];
    ho.L = [[PIV[0] - 90, TZ + 120], 1 - W(t, tm.cep + 0.05, 0.4), 'A'];
  }
  // "doğruyu söylerim": sağ el cebin üstünde (söz verir)
  const wDog = pIn(t, tm.dogru - 0.35, tm.h2b - 0.15, 0.3);
  if (wDog > 0.01) { const c = cepYeri(hp); ho.R = [[c[0] - 4, c[1] + 10], wDog, 'A']; }
  // h2b: sol el EVET'i ve HAYIR'ı, sağ el BİLMİYORUM'u kaldırır
  const hDurL = [[tm.pulKalk[0], [PUL[0].x + 84, PB - 28]], [tm.pulKalk[1], [PUL[1].x - 102, PB - 28]]];
  const wL = pIn(t, tm.pulKalk[0] - 0.4, tm.pulKalk[1] + 0.35, 0.28);
  if (wL > 0.01) { const p = H.dokunYolu(t, hDurL, { yuksel: 40, sure: 0.24 }); const q = pulTakip(S, t, hDurL, p); ho.L = [[q[0] + 10, q[1] - 34], wL, 'B']; if (wL > 0.55) hIs = ['L', q]; }
  const wR = pIn(t, tm.pulKalk[2] - 0.38, tm.pulKalk[2] + 0.4, 0.28);
  const bilTut = [PUL[2].x - 166, 0];
  if (wR > 0.01) { const q = [bilTut[0], pulUst(S, 2, t)[1] - 6]; ho.R = [[q[0] - 10, q[1] - 34], wR, 'B']; if (wR > 0.55) hIs = ['R', q]; }
  // d1: Defne cebi gösterince sağ elle cebini kapatır
  const wK1 = pIn(t, tm.sayiniz + 0.35, tm.n0a - 0.3, 0.3);
  if (wK1 > 0.01) { const c = cepYeri(hp); ho.R = [[c[0], c[1] + 8], wK1, 'A']; }
  // hd: "sayımı"da cebe vurur, "Bilmiyorum"da BİLMİYORUM'a uzanır, "demem"de fiskeyle yatırır
  const wS = pIn(t, tm.sayimi - 0.3, tm.sayimi + 0.45, 0.26);
  if (wS > 0.01) { const c = cepYeri(hp); ho.R = [[c[0] - 6, c[1] + 4 + 6 * H.nabiz(t, tm.sayimi, 0.22)], wS, 'A']; }
  const wF = pIn(t, tm.hBilmem - 0.1, tm.yatir + 0.45, 0.3);
  if (wF > 0.01) {
    const ust = [bilTut[0], PB - PH - 4], fis = H.nabiz(t, tm.yatir - 0.06, 0.2);
    const q = [ust[0] + 6 * fis, ust[1] - 14 + 26 * fis + (t > tm.yatir ? 30 * W(t, tm.yatir, 0.2) : 0)];
    ho.R = [[q[0] - 10, q[1] - 30], wF, 'B']; if (wF > 0.55) hIs = ['R', q];
  }
  // sayaç: Defne cebe bakınca sağ elle cebini kapatır
  // sayaç: kartı cebinden çıkarır, sırtı kameraya dönük gizlice bakar, geri sokar
  let bakP = null;
  const wK2 = id === 'sayac' ? pIn(t, tm.bak[0], tm.bak[4] + 0.3, 0.3) : 0;
  if (wK2 > 0.01) {
    const c = cepYeri(hp), c0 = [c[0], c[1] - 28], up = [c[0] + 14, c[1] - 130];
    const u = ease.state(seg(t, tm.bak[1], tm.bak[2] - tm.bak[1])) * (1 - ease.state(seg(t, tm.bak[3], tm.bak[4] - tm.bak[3])));
    if (t > tm.bak[1] && t < tm.bak[4]) { bakP = kar(c0, up, u); kartCepte = false; }
    const h = bakP || c0; ho.R = [[h[0] + 6, h[1] + 44], wK2, 'A'];
  }

  // ——— Defne ———
  const dO = { heads };
  let dParmak = 0, dIs = null, dTap = null;
  const wT = pIn(t, tm.tek - 0.3, tm.tek + 1.3, 0.3);
  if (wT > 0.01) { dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), wT, 'B']; if (wT > 0.5) dParmak = clamp01((t - tm.tek + 0.05) / 0.2); }
  const wG = pIn(t, tm.sayiniz - 0.3, tm.n0a - 0.25, 0.3);
  if (wG > 0.01) { const c = cepYeri(hp); dO.R = [[c[0] - 150, c[1] - 40], wG, 'A']; if (wG > 0.55) dIs = ['R', [c[0] - 40, c[1] - 10]]; }
  const wT2 = pIn(t, tm.dTek - 0.3, tm.kesin - 0.3, 0.28);
  if (wT2 > 0.01) { dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), wT2, 'B']; if (wT2 > 0.5) dParmak = clamp01((t - tm.dTek + 0.05) / 0.2); }
  const wV = pIn(t, tm.kesin - 0.28, tm.kesin + 0.4, 0.24);
  if (wV > 0.01) { const q = [DEF_X + 90, TZ - 30 + 10 * H.nabiz(t, tm.kesin, 0.2)]; dO.R = [q, wV, 'A']; dTap = q; }
  if (id === 'sayac') {
    const w = pIn(t, tm.dDokun[0][0] - 0.32, tm.dDokun[1][0] + 0.35, 0.28);
    if (w > 0.01) { const dur = tm.dDokun.map(([a, k]) => [a, [PUL[k].x + (k ? -102 : 84), PB - PH - 6]]); const p = H.dokunYolu(t, dur, { yuksel: 30, sure: 0.22 }); dO.R = [[p[0] - 4, p[1] - 44], w, 'B']; if (w > 0.5) dIs = ['R', p]; }
  }

  // ——— Necmi ———
  const nO = { heads };
  let nParmak = 0, nIs = null, nToplam = 3;
  const wP1 = pIn(t, tm.nIki - 0.3, tm.bilemez - 0.22, 0.3);
  if (wP1 > 0.01) { nO.R = [H.elYeri('necmi', np, 'R', 'yukari'), wP1, 'B']; if (wP1 > 0.5) nParmak = clamp01((t - tm.nIki + 0.05) / 0.2) * 2 + clamp01((t - tm.nUc + 0.05) / 0.2); }
  const wP2 = pIn(t, tm.evetle - 0.3, tm.yetmez + 0.5, 0.3);
  if (wP2 > 0.01) {
    nO.R = [H.elYeri('necmi', np, 'R', 'yukari'), wP2, 'B'];
    if (wP2 > 0.5) nParmak = clamp01((t - tm.evetle + 0.05) / 0.2) + clamp01((t - tm.nHayir + 0.05) / 0.2) + 0.55 * clamp01((t - tm.ucuncu + 0.05) / 0.3) * (1 - ease.state(seg(t, tm.yetmez - 0.05, 0.25)));
  }
  // ipucu: sol el BİLMİYORUM'un üst kenarını tutar, kaldırır; "her şeyi"de üstüne dokunur
  const wN = pIn(t, tm.kaldir - 0.32, tm.herSey + 0.55, 0.28);
  const nTut = [PUL[2].x + 160, 0];
  let nTutar = false;
  if (wN > 0.01) {
    const yu = pulUst(S, 2, t)[1];
    const q = [nTut[0], yu - 24 + 8 * H.nabiz(t, tm.herSey - 0.05, 0.24)];
    nO.R = [q, wN, 'A']; nTutar = t >= tm.kaldir - 0.05 && wN > 0.5;
  }

  // ——— çizim: kişiler → (masa altına inen kartlar) → masa → pullar → kartlar → tutan eller ———
  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  cepCiz(K, hp, kartCepte, cepU);
  if (bakP) { const { ctx } = K, s = hp.s / 250; ctx.save(); ctx.translate(bakP[0], bakP[1]); ctx.rotate(-12 * D2R); ctx.scale(0.7 * s, 0.7 * s); kartSirt(K); ctx.restore(); hc.tut('R'); }
  if (yigin && yiginAlti) { kart(K, yigin[0], yigin[1], { f: 1, rot: -8 }); kart(K, yigin[0] + 8, yigin[1] + 4, { f: 1, rot: 4 }); hc.tut('L'); }
  masa(K, t);
  for (let i = 0; i < 3; i++) pul(K, PUL[i], PB, pulAt(S, i, t));
  if (yel) {
    const f = ease.state(seg(t, tm.cevir, 0.3));
    yel.forEach((c, i) => {
      if (t >= tm.cek && i === 1) return;                       // çekilen kart elde
      if (yigin && i !== 1) return;                              // kalan ikisi sol elde (yığın)
      kart(K, c.x, c.y, { f, rot: c.rot, rakam: c.rakam });
    });
    if (yigin && !yiginAlti) { kart(K, yigin[0], yigin[1], { f: 1, rot: -8 }); kart(K, yigin[0] + 8, yigin[1] + 4, { f: 1, rot: 4 }); }
    if (cekP && t >= tm.cek) kart(K, cekP[0], cekP[1], { f: 1, rot: -4 * ease.state(seg(t, tm.cek, 0.5)) });
    if (!yiginAlti) hc.tut('L');
    hc.tut('R');
  }
  if (hIs) hc.isaret(hIs[0], hIs[1]);
  if (dParmak > 0) dc.parmak('R', dParmak, { toplam: 1 });
  if (dIs) dc.isaret(dIs[0], dIs[1]);
  if (dTap) dc.tut('R');
  if (nParmak > 0) nc.parmak('R', nParmak, { toplam: 3, ac: 0.32 });
  if (nTutar) nc.tut('R');
  if (nIs) nc.isaret(nIs[0], nIs[1]);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}
// Hikmet'in sol eli pula dokunurken pulun kalkan üst kenarını izler
function pulTakip(S, t, dur, p) {
  for (let k = 0; k < dur.length; k++) { const a = dur[k][0]; if (t >= a - 0.02 && t < a + 0.3) return [p[0], Math.min(p[1], pulUst(S, k, t)[1] + 4)]; }
  return p;
}
