// Bölüm 49 · YÜZ ÇAY (v4 "hikâye" dili; storyboard: hikayeler/bolum_049_v5.md). Mekanizma: en küçük toplam.
// Logline: Necmi bugün tam 100 bardak çay dağıttığını söyler; ofiste 14 kişi var, herkes en az bir çay içmiş, kimse aynı
// sayıda içmemiş. Defne tezgâhtaki 14 tabağa gelişigüzel kuleler diker, iki kez aynı sayıya düşer. Necmi kesme şekerden
// merdiven yapar. Cevapta 14 bardak kulesi merdiven gibi yükselir (1, 2, … 14); Necmi'nin tepsisi 100'de biter, son kule
// 9'da kalır, beş boş yer ve "−5" görünür.
// Akılda kalacak tek şey: herkes farklıysa en az 1 + 2 + … + 14 = 105 bardak gerekir; 100 yetmez.
// Mekân: çay ocağı (önden; tezgâh, 14 tabak, duvarda "100" yazılı kara tahta) ve aynı odanın yan tezgâhı (semaver, şeker).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const OCAK = 'b049_ocak', TZ = 1250, N = 14, TOPLAM = 100;
const X = k => 286 + 44 * (k - 1);                 // k. tabağın x'i (k = 1..14)
const GW = 34, GH = 40, TABAN = TZ - 8;            // bardak eni, kule adımı, ilk bardağın tabanı
const camTaban = j => TABAN - j * GH;              // j. bardağın (0'dan) tabanı
const DEF_X = 360, NEC_X = 110, HIK_X = 1000;
const TEPSI_N = [232, 1150], TEPSI_D = [DEF_X - 78, 1160], TEPSI_T = [DEF_X - 112, TZ - 4];   // Necmi'nin eli, Defne'nin eli, tezgâh
const YAN = { nec: -560, kup: [-500, -452, -404, -356], kase: [-292, TZ - 4] };            // yan tezgâh (ipucu)
const SEKER = 44;
const MERCAN = PAL.coral, YESIL = PAL.green, CAY = '#A8401F';
const GENIS = [1.0, 540, 1060];
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// sabit dağılım (tepsideki bardakların yeri): tohumlu üreteç, modül yüklenirken bir kez
const RND = (() => { const r = H.mulberry32(4901); return Array.from({ length: 240 }, () => r()); })();

// ═══════════════════════════ Mantık denetimi (build anında) ═══════════════════════════
// 14 kişinin hepsi farklı ve en az 1 bardak içtiyse en küçük toplam 1 + 2 + … + 14 = 105'tir; 100 bardak yetmez.
function denetle(plan) {
  const hata = [], enAz = N * (N + 1) / 2;
  if (enAz !== 105) hata.push('en küçük toplam ' + enAz);
  const say = Array(N + 1).fill(0); for (const g of plan) say[g.k]++;
  for (let k = 1; k < N; k++) if (say[k] !== k) hata.push(`kule ${k}: ${say[k]} bardak`);
  if (say[N] !== N - (enAz - TOPLAM)) hata.push(`kule 14: ${say[N]} bardak`);
  if (plan.length !== TOPLAM) hata.push('dağıtılan ' + plan.length);
  if (say.reduce((a, b) => a + b, 0) + (enAz - TOPLAM) !== 105) hata.push('eksik ≠ 5');
  if (hata.length) console.warn('b049: denetim tutmadı', hata.join(', '));
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Çay bardağı (ince belli): (x, yb) tabanın ortası; k ölçek; dolu 0..1; halka: renkli kontur
const BARDAK = [[-17, -38], [17, -38], [10, -22], [15, -6], [12, 0], [-12, 0], [-15, -6], [-10, -22]];
const BARDAK_IC = [[-15, -31], [15, -31], [8.6, -22], [13.2, -6], [10.4, -2], [-10.4, -2], [-13.2, -6], [-8.6, -22]];
function cay(K, x, yb, k = 1, { dolu = 1, kontur = null, a = 1 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k); if (a < 1) ctx.globalAlpha = a;
  K.poly(BARDAK, '#F3EEE4', 0);
  if (dolu > 0) K.poly(BARDAK_IC.map(([px, py]) => [px, py < -10 ? lerp(-2, py, dolu) : py]), CAY, 0);
  K.poly(BARDAK, null, 2.6);
  K.line(-9, -33, -6, -26, 2.4, '#FFFFFF');
  if (kontur) { ctx.lineWidth = 5; ctx.strokeStyle = kontur; K.path(BARDAK); ctx.stroke(); }
  ctx.restore();
}
// Boş yer (eksik bardak): kesik çizgili mercan kontur
function bosYer(K, x, yb, a = 1, k = 1) {
  const { ctx } = K; if (a < 0.01) return;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k); ctx.globalAlpha = a;
  K.path(BARDAK); ctx.fillStyle = 'rgba(244,237,224,0.28)'; ctx.fill(); ctx.setLineDash([8, 5]); ctx.lineWidth = 7; ctx.strokeStyle = MERCAN; ctx.stroke();
  ctx.restore();
}
// Tabak (tezgâhın üstünde)
const tabak = (K, x) => { K.ell(x, TZ - 4, 22, 6, PAL.cream, 2.5); };
// Tepsi: (x, y) yüzeyin ortası; n bardak (görünür yığın n/7); ac: yüzünü kameraya çevirme (boş tepsiyi gösterir)
function tepsi(K, x, y, n, { ac = 0 } = {}) {
  const ry = 12 + 34 * ac;
  K.ell(x, y + 4, 80, ry + 2, PAL.metalDark, LW * 0.8);
  K.ell(x, y, 80, ry, PAL.metal, LW * 0.8);
  K.ell(x, y, 62, ry * 0.7, '#A9B7AC', 2);
  const v = n <= 0 ? 0 : Math.min(15, Math.max(1, Math.round(n / 7)));
  const SIRA = [5, 4, 3, 2, 1]; let i = 0;
  for (let r = 0; r < SIRA.length && i < v; r++) for (let c = 0; c < SIRA[r] && i < v; c++, i++) {
    const px = x + (c - (SIRA[r] - 1) / 2) * 24 + (RND[i] - 0.5) * 3, py = y - 2 - r * 21 + (RND[i + 20] - 0.5) * 2;
    cay(K, px, py, 0.62, { dolu: 0 });
  }
}
// Kara tahta (duvarda): "100 ÇAY" ve çetele çizgileri
function karaTahta(K, x, y) {
  K.rect(x - 138, y - 92, 276, 184, PAL.woodDark, LW, 10);
  K.rect(x - 122, y - 78, 244, 156, '#2D3B36', LW * 0.6, 6);
  K.text('100', x, y + 14, 84, '#EDEBE4', 900);
  K.text(K.up('çay'), x, y + 64, 46, '#EDEBE4', 900);
}
// Çaydanlık (döngü: buhar)
function caydanlik(K, x, y, t) {
  K.poly([[x - 34, y], [x + 34, y], [x + 28, y - 52], [x - 28, y - 52]], PAL.metal, LW * 0.8);
  K.line(x + 30, y - 40, x + 58, y - 62, 9); K.line(x + 30, y - 40, x + 58, y - 62, 4, PAL.metal);
  K.ell(x, y - 54, 26, 8, PAL.metalDark, LW * 0.6); K.circ(x, y - 64, 7, INK, 0);
  H.buhar(K, x + 60, y - 70, t, { k: 0.5, n: 2, ara: 12, boy: 70 });
}
// Semaver (yan tezgâh; döngü: buhar)
function semaver(K, x, y, t) {
  K.rect(x - 40, y - 26, 80, 26, PAL.metalDark, LW * 0.8, 6);
  K.poly([[x - 52, y - 26], [x + 52, y - 26], [x + 44, y - 170], [x - 44, y - 170]], '#C9A24A', LW);
  K.rect(x - 30, y - 200, 60, 32, '#C9A24A', LW * 0.8, 8);
  cay(K, x, y - 200, 1.1, { dolu: 0 });
  K.line(x + 52, y - 70, x + 76, y - 70, 8); K.circ(x + 80, y - 70, 7, PAL.metalDark, LW * 0.5);
  H.buhar(K, x, y - 250, t, { k: 0.6, n: 2, ara: 14, boy: 80 });
}
// Kesme şeker (yan tezgâh): (x, yb) tabanın ortası
const seker = (K, x, yb) => { K.rect(x - SEKER / 2, yb - SEKER, SEKER, SEKER, '#FBF8F1', LW * 0.6, 5); K.line(x - 12, yb - 30, x + 6, yb - 30, 3, '#E2DDD2'); };
// Kontur yazı (koyu duvarın önünde okunur)
function sayiYaz(K, s, x, y, size = 46, fill = PAL.paper, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.font = `900 ${size}px Rubik`; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.strokeText(s, 0, 0); ctx.fillStyle = fill; ctx.fillText(s, 0, 0);
  ctx.restore();
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(OCAK, {
  gen: [-1000, 1300], dongu: ['duvar saatinin saniye kolu', 'çaydanlık ve semaver buharı', 'pencerede martı'],
  capa: { tezgah: [540, TZ] }, kadraj: { genis: GENIS },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -1100, x1: 1400, isik, duvar: 'fayans', zemin: 'karo' });
    M.pencere(K, 30, 470, 230, 250, { isik, t });
    M.duvarSaati(K, 1000, 560, 54, 16.1 + t / 60, t);
    karaTahta(K, 600, 720);
    // raf: ters çevrilmiş bardaklar
    K.rect(-860, 700, 420, 16, PAL.woodTop, LW, 5);
    for (let i = 0; i < 7; i++) { K.ctx.save(); K.ctx.translate(-830 + i * 58, 662); K.ctx.scale(1, -1); cay(K, 0, -38, 0.9, { dolu: 0 }); K.ctx.restore(); }
  },
});
// Tezgâh (karakterlerden sonra çizilir: bacakları örter)
function tezgah(K, x0 = 30, x1 = 1060) {
  K.rect(x0 + 8, TZ + 14, x1 - x0 - 16, 400, PAL.wood, LW, 6);
  for (let x = x0 + 40; x < x1 - 40; x += 170) K.rect(x, TZ + 44, 140, 150, PAL.woodTop, LW * 0.6, 8);
  K.rect(x0, TZ - 4, x1 - x0, 24, PAL.woodTop, LW, 6);
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    son100: 0.3, yuz: T('h1:3'), h2a: T('h2a'), kisi: T('h2a:2'), taban: T('h2a:6'), kimse: T('h2a:9'),
    h2b: T('h2b'), saymis: T('h2b:3'), h3: T('h3'), cayH: T('h3:2') - 0.12,
    d2: T('d2'), ver: T('d2') - 0.05, hd: T('hd'), dagit: T('hd:2'),
    bak: cd - 0.6, n1: T('n1'),
    cevap: T('d3:1') - 0.1, d4: T('d4'), bir: T('d4:3'), iki: T('d4:5'), on: T('d4:8'), dort: T('d4:9'), icmis: T('d4:11'), d4s: T('d4>'),
    d5: T('d5'), yuzbes: T('d5:5'), yetmez: T('d5:8'),
    espri: T('h4') - 0.2, eksik: T('h4:1'), nerede: T('h4:4'), cta: T('d6') - 0.15,
  };
  tm.ipucu = tm.bak + 5 / 30;
  tm.reset = tm.cevap + 0.15;
  // ——— Defne'nin deneme yolculukları: [varış, tabak, adet] (sfx ile aynı çapalar) ———
  tm.trip = [[T('d2:2') + 0.45, 2, 1], [T('d2:4') + 0.35, 6, 3], [T('hd') + 0.35, 6, 2], [T('hd:2') + 0.55, 5, 2],
    [cd0 + 0.7, 7, 3], [cd0 + 1.6, 3, 1], [cd0 + 2.8, 5, 2], [cd0 + 3.8, 5, 1], [cd0 + 5.0, 5, 1], [cd0 + 5.75, 2, 1]];
  // Defne'nin yüzünün önündeki tabaklar (1–4) alçak kalır; uzun kuleler 5–7'de. Son durum: 1, 3, 2, 1, 7, 6, 4 (merdiven değil)
  tm.cift = [[cd0 + 1.7, cd0 + 2.55, 2, 3], [cd0 + 3.9, cd0 + 4.75, 5, 6]];   // aynı sayıya düşen kuleler (mercan)
  tm.say0 = cd0 + 6.2; tm.birak = cd0 + 7.7; tm.dusun = cd0 + 8.2;
  tm.s2 = cd0 + 5.0;
  // ——— cevap: 100 bardak sırayla kulelere uçar ———
  const plan = [];
  plan.push({ k: 1, j: 0, t: tm.bir });
  plan.push({ k: 2, j: 0, t: tm.iki - 0.07 }, { k: 2, j: 1, t: tm.iki });
  for (let k = 3; k <= 13; k++) { const c = lerp(tm.iki + 0.32, tm.dort, (k - 3) / 10); for (let j = 0; j < k; j++) plan.push({ k, j, t: c - 0.22 + 0.22 * j / (k - 1) }); }
  for (let j = 0; j < 9; j++) plan.push({ k: 14, j, t: lerp(tm.on + 0.12, tm.icmis, j / 8) });
  denetle(plan);
  tm.plan = plan;
  tm.bitti = tm.icmis;                         // tepsi 100'de biter
  tm.bos = tm.icmis + 0.4;                     // beş boş yer
  tm.eksi = tm.d4s + 0.05;                     // "−5"
  // sayaç etiketi: her kule tamamlandığında toplam, 14. kulede bardak bardak
  const adim = []; let top = 0;
  for (let k = 1; k <= 13; k++) { top += k; const tk = Math.max(...plan.filter(g => g.k === k).map(g => g.t)); adim.push([tk, `${top} bardak`]); }
  plan.filter(g => g.k === 14).forEach((g, i) => adim.push([g.t, `${92 + i} bardak`, i === 8 ? MERCAN : INK, PAL.paper]));
  tm.adim = adim;

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.0, 540, 1060], [tm.yuz - 0.3, 1.05, 575, 1050]] },
    { id: 'duzenek', t0: tm.h2a - 0.05, cam: [[0, ...GENIS], [tm.h2b - 0.2, 1.04, 560, 1052], [tm.h3 - 0.1, 1.15, 700, 1040]] },
    { id: 'deneme', t0: tm.d2 - 0.1, cam: [[0, 1.3, 290, 1110], [tm.hd, 1.32, 305, 1108]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, ...GENIS], [cd0 + 4.5, 1.02, 545, 1056]] },
    { id: 'sayac2', t0: tm.s2, kesme: false, cam: [[tm.s2, 1.28, 440, 1100], [cd - 0.6, 1.31, 430, 1098]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.45, -470, 1120], [T('n1:5'), 1.46, -455, 1118]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 360, 990]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...GENIS], [tm.d5 - 0.2, 1.04, 560, 1040]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.32, 880, 1000], [tm.nerede, 1.35, 870, 998]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.36, 380, 1060], [tm.cta + 1.6, 1.4, 385, 1055]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.2] }, ...POZ.dur });
  const hik = [
    [0.6, { head: { tilt: 3, look: [0.05, 0.05] } }, 0.35],
    [tm.yuz - 0.2, { head: { tilt: -4, look: [-0.85, -0.2] } }, 0.3],
    [tm.h2a, { head: { tilt: -3, look: [-0.8, 0.35] } }, 0.01],
    [tm.kimse, { head: { tilt: 5, look: [0, 0.05] } }, 0.3],
    [tm.h2b, { head: { tilt: -4, look: [-0.9, 0.15] } }, 0.3],
    [tm.h3, { expr: 'mutlu', head: { tilt: -5, look: [-0.85, 0.1] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [-0.9, 0.2] } }, 0.01],
    [cd0, { expr: 'mutlu', head: { tilt: 3, look: [-0.8, 0.35] } }, 0.3],
    [tm.cift[0][0] - 0.05, { expr: 'saskin', head: { tilt: -5, look: [-0.8, 0.4] } }, 0.2],
    [tm.cift[0][1], { expr: 'mutlu', head: { tilt: 3, look: [-0.8, 0.35] } }, 0.3],
    [tm.cift[1][0] - 0.05, { expr: 'saskin', head: { tilt: -5, look: [-0.8, 0.4] } }, 0.2],
    [tm.cift[1][1], { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.35] } }, 0.3],
    [tm.cevap, { expr: 'notr', head: { tilt: -3, look: [-0.8, 0.3] } }, 0.01],
    [tm.bitti, { expr: 'saskin', head: { tilt: 5, look: [-0.5, -0.1] } }, 0.25],
    [tm.espri, { expr: 'saskin', head: { tilt: -4, look: [-0.5, 0.2] } }, 0.01],
    [tm.nerede - 0.15, { expr: 'yorgun', head: { tilt: 6, look: [-0.95, 0.15] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 4, look: [0.85, 0.2] }, ...POZ.dur });
  const def = [
    [tm.h2a, { expr: 'notr', head: { tilt: 3, look: [0.6, 0.55] } }, 0.01],
    [tm.taban + 0.4, { head: { tilt: -3, look: [0.85, 0.15] } }, 0.35],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [-0.5, 0.4] } }, 0.01],
    [tm.d2 + 0.9, { head: { tilt: 4, look: [0.3, 0.6] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: 3, look: [0.3, 0.6] } }, 0.3],
    [tm.cift[0][0], { expr: 'saskin', head: { tilt: -6, look: [0.25, 0.6] } }, 0.2],
    [tm.cift[0][1], { expr: 'notr', head: { tilt: 3, look: [0.3, 0.6] } }, 0.3],
    [tm.cift[1][0], { expr: 'yorgun', head: { tilt: 6, look: [0.25, 0.6] } }, 0.2],
    [tm.cift[1][1], { expr: 'notr', head: { tilt: 3, look: [0.4, 0.6] } }, 0.3],
    [tm.say0 + 1.5, { expr: 'notr', head: { tilt: -4, look: [0.9, 0.2] } }, 0.35],
    [tm.dusun, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.3, -0.5] } }, 0.4],
    [tm.bak, { head: { tilt: -3, look: [-0.95, 0.05] } }, 0.25],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.8, 0.3] } }, 0.01],
    [tm.bos, { expr: 'mutlu', head: { tilt: -4, look: [0.85, -0.2] } }, 0.3],
    [tm.d5, { expr: 'mutlu', head: { tilt: 4, look: [0.1, 0.1] } }, 0.3],
    [tm.espri, { expr: 'mutlu', head: { tilt: 3, look: [0.8, 0.2] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.5, 0.4] } }, 0.01],
    [tm.cta + 0.7, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'mutlu', head: { tilt: -3, look: [0.6, 0.3] }, ...POZ.dur });
  const nec = [
    [0.55, { head: { tilt: 3, look: [0.1, 0.05] } }, 0.3],
    [tm.h2a, { head: { tilt: -3, look: [0.8, 0.4] } }, 0.01],
    [tm.h2b, { head: { tilt: 4, look: [0.9, 0.1] } }, 0.3],
    [tm.d2 - 0.1, { head: { tilt: 3, look: [0.85, 0.15] } }, 0.01],
    [tm.cevap, { expr: 'saskin', head: { tilt: 5, look: [0.7, 0.3] } }, 0.01],
    [tm.d4, { expr: 'notr', head: { tilt: -3, look: [0.85, 0.2] } }, 0.3],
    [tm.bitti, { expr: 'yorgun', head: { tilt: 6, look: [0.3, 0.6] } }, 0.3],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Kule durumu (bütün sahneler aynı fonksiyonu okur) ═══════════════════════════
// Dönen: { h: [14 kule yüksekliği], ucan: [{ p, k }], tepsi: tepsideki bardak, elde: Defne'nin taşıdığı yığın | null }
function kuleler(S, t) {
  const { tm } = S, h = Array(N + 1).fill(0), ucan = [];
  let tepsi = TOPLAM, elde = null;
  const kaynak = [TEPSI_N[0], TEPSI_N[1] - 30];
  // h2a: herkese birer bardak (Necmi'nin tepsisinden)
  for (let k = 1; k <= N; k++) {
    const a = tm.taban + (k - 1) * 0.04, d = a - 0.32;
    if (t >= a) { h[k]++; tepsi--; } else if (t >= d) { ucan.push({ p: H.yay(kaynak, [X(k), TABAN], ease.state((t - d) / 0.32), 110) }); tepsi--; }
  }
  if (t < tm.cevap) {
    // Defne'nin yolculukları
    for (const [ta, k, n] of tm.trip) {
      const tp = ta - 0.4;
      if (t >= ta) { h[k] += n; tepsi -= n; }
      else if (t >= tp) { const ust = [X(k), camTaban(h[k])]; elde = { p: H.tasi(t, tp, 0.4, [TEPSI_D[0] + 10, TEPSI_D[1] - 6], ust, 25), n, k }; tepsi -= n; }
    }
    return { h, ucan, tepsi, elde };
  }
  // cevap: denemenin kuleleri tepsiye döner, sonra plan
  const d = h.slice(); let sira = 0;
  for (let k = 1; k <= N; k++) for (let j = d[k] - 1; j >= 0; j--, sira++) {
    const a = tm.reset + sira * 0.014, b = a + 0.3;
    if (t >= b) { h[k]--; tepsi++; }
    else if (t >= a) { h[k]--; ucan.push({ p: H.yay([X(k), camTaban(j)], kaynak, ease.state((t - a) / 0.3), 90) }); }
  }
  for (const g of tm.plan) {
    const a = g.t, dd = a - 0.3;
    if (t >= a) { h[g.k]++; tepsi--; } else if (t >= dd) { ucan.push({ p: H.yay(kaynak, [X(g.k), camTaban(g.j)], ease.state((t - dd) / 0.3), 130) }); tepsi--; }
  }
  return { h, ucan, tepsi, elde };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 3, d4: 2, d5: 8 },
  dunya(K, t, B) {
    if (B.sc.id === 'ipucu') return yanTezgah(K, t, tl, S, B);
    ocak(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const sabit = (a, p) => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    // h2a: "On dört kişiyiz": sayı tabaktan tabağa atlar
    if (id === 'duzenek') {
      const dur = []; for (let k = 1; k <= N; k++) dur.push([tm.h2a + 0.05 + (k - 1) * 0.085, sabit(tm.h2a, [X(k), TZ - 70]), String(k)]);
      H.sayiAtla(K, t, dur, { son: tm.taban - 0.25, size: 52, sure: 0.08, yuksel: 26 });
    }
    // sayaç: aynı sayıya düşen iki kule ✗
    if (id === 'sayac') for (const [a, b, k1, k2] of tm.cift) { const h = kuleler(S, a + 0.01).h; H.mark(K, t, a, b, sabit(a, [(X(k1) + X(k2)) / 2, camTaban(Math.max(h[k1], h[k2])) - 46]), false); }
    if (id === 'cevap') {
      H.adimEtiket(K, t, tm.adim, tm.yuzbes - 0.2, [280, 462], 50);
      H.tag(K, t, tm.eksi, tm.espri - 0.2, sabit(tm.eksi, [785, 615]), '−5', MERCAN, PAL.paper, 60, [tm.yetmez]);
      H.tag(K, t, tm.yuzbes - 0.02, tm.espri - 0.2, [540, 385], '1 + 2 + … + 14 = 105', INK, PAL.paper, 50);
    }
  },
});

// ——— Çay ocağı: tezgâh, kuleler, üç kişi ———
function ocak(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  const ku = kuleler(S, t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  let np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  if (id === 'sayac' || id === 'sayac2') H.glance(hp, t, tm.cd - 0.5, 9.5);
  H.onayla(np, t, tm.saymis);

  // ——— Hikmet: sağ elinde çay bardağı; h1'de tahtayı, h2a'da parmak, h3'te bardağı kaldırır, espride boş yerleri gösterir ———
  const ho = { heads }, hEl0 = [HIK_X + 92, 1135];
  let hCay = kar(hEl0, [HIK_X + 84, 1010], pIn(t, tm.cayH, tm.d2 - 0.3, 0.32));
  ho.R = [hCay, 1, 'A'];
  let hIs = null;
  const wT = pIn(t, tm.yuz - 0.3, tm.h2a - 0.2, 0.28);
  if (wT > 0.01) { ho.L = [[HIK_X - 150, 960], wT, 'B']; if (wT > 0.5) hIs = [700, 720]; }
  const wK = pIn(t, tm.kimse - 0.25, tm.h2b + 0.1, 0.28);
  if (wK > 0.01) { const s = Math.sin(TAU * 2.6 * (t - tm.kimse)) * 14; ho.L = [[HIK_X - 70 + s, 935], wK, 'B']; if (wK > 0.5) hIs = [HIK_X - 78 + s, 860]; }
  for (const [a] of tm.cift) { const w = pIn(t, a - 0.2, a + 0.75, 0.25); if (w > 0.01 && id.startsWith('sayac')) { const s = Math.sin(TAU * 2.6 * (t - a)) * 14; ho.L = [[HIK_X - 70 + s, 935], w, 'B']; if (w > 0.5) hIs = [HIK_X - 78 + s, 860]; } }
  if (id === 'espri') { const w = W(t, tm.eksik - 0.3, 0.3); ho.L = [[900, 1090], w, 'A']; if (w > 0.5) hIs = [X(14) + 4, camTaban(9) - 16]; }

  // ——— Necmi: tepsi sağ elinde; kancada son bardağı yığına koyar; d2'de tepsiyi Defne'ye verir, sola yürüyüp çıkar ———
  const no = { heads };
  let necTepsi = TEPSI_N, necVar = true, necYan = false, kancaBardak = null;
  const ver = H.elVer(t, tm.ver, TEPSI_N, TEPSI_D, { kaldir: 16 });
  const nYur0 = ver.tS + 0.05;
  if (t < tm.cevap) {
    if (t >= tm.ver && t < ver.tS + 0.3) { necTepsi = ver.p; no.R = [[ver.p[0], ver.p[1] + 12], ver.verW, 'A']; }
    else if (t >= ver.tS) necTepsi = null;
    else no.R = [[TEPSI_N[0], TEPSI_N[1] + 12], 1, 'A'];
    if (t >= nYur0) {
      if (t < nYur0 + 1.4) { np = H.yuru('necmi', t, { t0: nYur0, x0: NEC_X, x1: -330, hiz: 360 }); necYan = true; }
      else necVar = false;
    }
    if (id === 'kanca') {   // 100. bardak: sol elden yığına (0,3 sn'de iner)
      const a = [NEC_X + 40, 1040], b = [TEPSI_N[0] - 4, TEPSI_N[1] - 60];
      const p = t < tm.son100 ? kar(a, b, ease.state(clamp01((t + 0.15) / (tm.son100 + 0.15)))) : b;
      no.L = [[p[0] - 16, p[1] - 22], 1 - W(t, tm.son100 + 0.15, 0.35), 'B'];
      if (t < tm.son100) kancaBardak = p;
    }
  } else {
    no.R = [[TEPSI_N[0], TEPSI_N[1] + 12], 1, 'A'];
  }
  const tepsiAc = id === 'cevap' ? pIn(t, tm.yetmez - 0.1, tm.espri - 0.3, 0.3) : 0;
  if (tepsiAc > 0.01) no.R = [[TEPSI_N[0], TEPSI_N[1] + 12 - 30 * tepsiAc], 1, 'A'];

  // ——— Defne: deneme (tepsi sol elinde, sağ elle taşır), sayma, düşünme, cevapta gösterme, çağrı ———
  const dO = { heads };
  let dTepsi = null, dTut = null, dIs = null, ctaCay = null;
  if (t >= tm.ver && t < tm.cevap) {
    if (t < ver.tS + 0.3) { dTepsi = ver.p; dO.L = [[ver.p[0] - 6, ver.p[1] + 12], ver.alW, 'A']; }
    else if (t < tm.birak) { dTepsi = TEPSI_D; dO.L = [[TEPSI_D[0] - 6, TEPSI_D[1] + 12], 1, 'A']; }
    else { const u = ease.state(seg(t, tm.birak, 0.35)); dTepsi = kar(TEPSI_D, TEPSI_T, u); dO.L = [[dTepsi[0] - 6, dTepsi[1] + 12], 1 - W(t, tm.birak + 0.4, 0.3), 'A']; }
    // yolculuklar: tepsiye uzan, yığını kaldır, tabağa taşı, bırak
    let wR = 0, hedef = null;
    for (const [ta, k, n] of tm.trip) {
      const w = pIn(t, ta - 0.68, ta + 0.08, 0.28); if (w <= wR) continue;
      wR = w; hedef = t < ta - 0.4 ? [TEPSI_D[0] + 28, TEPSI_D[1] - 40] : ku.elde ? [ku.elde.p[0] + 18, ku.elde.p[1] - 18] : [X(k) + 18, camTaban(ku.h[k]) + 22];
    }
    if (ku.elde) dTut = 'R';
    // sayaç: kulelerin tepesine dokunarak sayar
    const sw = pIn(t, tm.say0 - 0.25, tm.say0 + 1.5, 0.28);
    if (sw > wR) { const dur = [[tm.say0, [X(1), camTaban(ku.h[1])]]]; for (let k = 2; k <= 7; k++) dur.push([tm.say0 + (k - 1) * 0.2, [X(k), camTaban(ku.h[k])]]); const p = H.dokunYolu(t, dur, { yuksel: 30, sure: 0.18 }); wR = sw; hedef = [p[0] + 14, p[1] - 40]; if (sw > 0.5) dIs = p; }
    if (wR > 0.01) dO.R = [hedef, wR, 'A'];
  }
  if (id === 'buldum') dTepsi = null;
  if (id === 'cevap') {
    // kulelerin yükselişini parmakla izler
    const w = pIn(t, tm.bir - 0.35, tm.d5 + 0.2, 0.3);
    if (w > 0.01) { dO.R = [[DEF_X + 135, 1030], w, 'A']; let k = 1; for (const g of tm.plan) if (t >= g.t - 0.3) k = g.k; if (w > 0.5) dIs = [X(k), camTaban(Math.max(0, ku.h[k] - 1)) - 20]; }
  }
  if (id === 'cta') {   // 1. kulenin bardağını alıp kaldırır
    const al = tm.cta + 0.35, a = [X(1), TABAN], b = [DEF_X + 88, 1118];
    const p = t < al ? a : H.tasi(t, al, 0.45, a, b, 30);
    dO.R = [[p[0] + 16, p[1] - 20], W(t, tm.cta + 0.05, 0.28), 'A'];
    if (t >= al) { ctaCay = p; dTut = 'R'; }
  }

  // ——— çizim: kişiler → tezgâh → tabaklar → kuleler → tepsiler → tutan eller ———
  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  let nc = null;
  if (necVar) { if (necYan) np.armR = { sh: 10, el: 10 }; nc = oyna(K, t, tl, 'necmi', np, necYan ? { heads } : no); }
  tezgah(K);
  caydanlik(K, 70, TZ - 4, t);
  for (let k = 1; k <= N; k++) tabak(K, X(k));
  const hepsi = id === 'cevap' || id === 'espri' || id === 'cta';
  for (let k = 1; k <= N; k++) {
    let kontur = null;
    for (const [a, b, k1, k2] of tm.cift) if ((k === k1 || k === k2) && t >= a && t < b) kontur = MERCAN;
    const n = ku.h[k] - (id === 'cta' && k === 1 && ctaCay ? 1 : 0);
    for (let j = 0; j < n; j++) cay(K, X(k), camTaban(j), 1, { kontur });
    if (hepsi) {
      if (k === N) for (let j = 9; j < N; j++) bosYer(K, X(k), camTaban(j), W(t, tm.bos + (j - 9) * 0.06, 0.2) * (1 + 0.25 * H.nabiz(t, tm.yetmez, 0.4) + 0.25 * H.nabiz(t, tm.eksik, 0.4)));
      const tamam = k < N ? ku.h[k] >= k || t > tm.bitti : t >= tm.bos;
      const tk = k < N ? Math.max(...tm.plan.filter(g => g.k === k).map(g => g.t)) : tm.bos;
      if (tamam) sayiYaz(K, String(k), X(k), camTaban(k) - 12, 46, k === N ? MERCAN : PAL.paper, Math.min(1, H.spring(t - tk, 320, 30) * 0.4 + 0.6) * (1 + 0.18 * H.nabiz(t, tm.d5 + (k - 1) * 0.035, 0.34)));
    }
  }
  for (const u of ku.ucan) cay(K, u.p[0], u.p[1], 1);
  if (hCay) { cay(K, hc.handR[0] - 6, hc.handR[1] + 24, 1); H.buhar(K, hc.handR[0] - 6, hc.handR[1] - 22, t, { k: 0.4, n: 2, ara: 10, boy: 60 }); hc.tut('R'); }
  if (hIs) hc.isaret('L', hIs);
  // Necmi'nin tepsisi
  if (necVar && !necYan && necTepsi) {
    const tp = id === 'cevap' || id === 'espri' || id === 'cta' ? [TEPSI_N[0], TEPSI_N[1] - 30 * tepsiAc] : necTepsi;
    tepsi(K, tp[0], tp[1], ku.tepsi, { ac: tepsiAc });
    if (kancaBardak) cay(K, kancaBardak[0], kancaBardak[1], 0.62, { dolu: 0 });
    nc.tut('R');
    if (kancaBardak) nc.tut('L');
  }
  if (dTepsi) { tepsi(K, dTepsi[0], dTepsi[1], ku.tepsi); if (t < tm.birak + 0.4 && t >= tm.ver) dc.tut('L'); }
  if (ku.elde) { for (let j = 0; j < ku.elde.n; j++) cay(K, ku.elde.p[0], ku.elde.p[1] - j * GH, 1); }
  if (ctaCay) { const k = 1 + 0.35 * W(t, tm.cta + 0.35, 0.45); cay(K, ctaCay[0], ctaCay[1], k); H.buhar(K, ctaCay[0], ctaCay[1] - 46 * k, t, { k: 0.4, n: 2, ara: 10, boy: 50 }); }
  if (dTut) dc.tut(dTut);
  if (dIs) dc.isaret('R', dIs);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// ——— Yan tezgâh: Necmi kesme şekerden merdiven yapar ———
function yanTezgah(K, t, tl, S, B) {
  const { tm } = S, { heads } = B;
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  const np = H.kisi('necmi', { x: YAN.nec, expr: 'notr', head: { tilt: 4, look: [0.6, 0.6] }, ...POZ.dur });
  // yerleştirme anları: 3. sütunun tepesi, sonra 4. sütun bardak bardak
  const T0 = tm.n1, w = i => tl.L.n1.words[i].t0;
  const kup = [[T0 - 0.05, 2, 2], [w(1) + 0.1, 3, 0], [w(3) + 0.1, 3, 1], [w(5) + 0.05, 3, 2], [w(7), 3, 3]];   // [an, sütun, kat]
  const hazir = [[0, 0], [1, 0], [1, 1], [2, 0], [2, 1]];                                                        // baştan duranlar
  const bitti = t >= kup[kup.length - 1][0] + 0.1;
  if (bitti) { np.expr = 'mutlu'; np.head = { tilt: -4, look: [0.9, 0.1] }; }
  // el: kâseden al (0,3 sn), sütuna taşı (0,35 sn)
  let el = null, elde = null, wR = 0;
  for (const [a, c, j] of kup) {
    const w0 = pIn(t, a - 0.9, a + 0.1, 0.25); if (w0 <= wR) continue; wR = w0;
    const kase = [YAN.kase[0], YAN.kase[1] - 30], hedef = [YAN.kup[c], TZ - 4 - j * SEKER];
    if (t < a - 0.35) el = kase; else { const p = H.tasi(t, a - 0.35, 0.35, kase, hedef, 40); el = p; elde = p; }
  }
  const o = { heads, sessiz: false };
  if (el) o.R = [[el[0] + 14, el[1] - 36], wR, 'A'];
  const nc = oyna(K, t, tl, 'necmi', np, o);
  // tezgâh, semaver, kâse, şeker sütunları
  tezgah(K, -900, -230);
  semaver(K, -800, TZ - 4, t);
  K.ell(YAN.kase[0], YAN.kase[1] - 14, 46, 22, '#E8E2D4', LW * 0.7); for (let i = 0; i < 4; i++) K.rect(YAN.kase[0] - 30 + i * 16, YAN.kase[1] - 44 - (i % 2) * 6, 22, 22, '#FBF8F1', 2.5, 3);
  cay(K, -690, TZ - 4, 1); H.buhar(K, -690, TZ - 50, t, { k: 0.4, n: 2, ara: 10, boy: 60 });
  for (const [c, j] of hazir) seker(K, YAN.kup[c], TZ - 4 - j * SEKER);
  for (const [a, c, j] of kup) if (t >= a) seker(K, YAN.kup[c], TZ - 4 - j * SEKER);
  if (elde && t < kup.find(k => t < k[0])?.[0]) seker(K, elde[0], elde[1]);
  if (el) nc.tut('R');
}
