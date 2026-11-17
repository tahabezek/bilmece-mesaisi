// Bölüm 51 · KİMİN SAYISI BÜYÜK? (v4 "hikâye" dili; storyboard: hikayeler/bolum_051_v5.md). Mekanizma: ortak bilgi.
// Logline: Hikmet, Defne'ye ve Necmi'ye 1–5 arasından birer sayı yazılı kâğıt verir; sayılar ardışıktır. Defne "kimin büyük
// bilmiyorum", Necmi "ben de bilmiyorum", Defne "şimdi biliyorum" der. Masada iki sıra kutu durur (Defne'nin 1–5'i, Necmi'nin
// 1–5'i). Cevapta her cümle kendi kutularını kapatır: Defne'nin 1 ve 5'i, sonra Necmi'nin 1, 2, 4 ve 5'i. Necmi kâğıdını
// çevirir: 3.
// Akılda kalacak tek şey: "bilmiyorum" da bir bilgidir; her "bilmiyorum" birkaç kutuyu kapatır.
// Mekân: Hikmet'in odası (önden; uzun masa, iki sıra kutu, pencere, raf, duvar saati).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b051_oda', TZ = 1250, KB = TZ - 4;          // masa üstü, kutuların tabanı
const KW = 66, KH = 96, ADIM = 74;                       // kutu eni, boyu, aralığı
const DEF_X = 330, HIK_X = 540, NEC_X = 750;
const SIRA = { d: DEF_X, n: NEC_X };
const KX = (r, k) => SIRA[r] + (k - 3) * ADIM;           // r: 'd' | 'n', k = 1..5
const RENK = { d: PAL.coral, n: '#7E8460' };             // sıranın çerçevesi: sahibinin ceketi / hırkası
const YESIL = PAL.green;
const DP0 = [408, 1100], DPK = [446, 1076];              // Defne'nin kâğıdı (sağ el): dinlenme, bakma
const NP0 = [672, 1100], NPK = [636, 1078], NPR = [652, 1104];   // Necmi'nin kâğıdı (sol el): dinlenme, bakma, gösterme
const HCAY = [HIK_X + 4, KB];
const GENIS = [0.97, 540, 1000];
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Mantık (build anında) ═══════════════════════════
// Bütün ardışık çiftler (Defne, Necmi) denenir, konuşmalara göre elenir. Dönen: kapanacak kutular ve kalan çözüm.
function mantik() {
  const S = [1, 2, 3, 4, 5], hepsi = [];
  for (const d of S) for (const n of S) if (Math.abs(d - n) === 1) hepsi.push([d, n]);
  const bilmez = ciftler => new Set(ciftler.map(([d, n]) => d > n)).size > 1;   // aday çiftlerde "büyük" kişi belirsiz
  const P1 = hepsi.filter(([d]) => bilmez(hepsi.filter(q => q[0] === d)));           // Defne: "Kimin büyük bilmiyorum."
  const P2 = P1.filter(([, n]) => bilmez(P1.filter(q => q[1] === n)));              // Necmi: "Ben de bilmiyorum."
  const P3 = P2.filter(([d]) => !bilmez(P2.filter(q => q[0] === d)));               // Defne: "Şimdi biliyorum."
  const tek = a => [...new Set(a)].sort();
  const dElen = S.filter(k => !P1.some(q => q[0] === k)), nElen = S.filter(k => !P2.some(q => q[1] === k));
  const nSon = tek(P3.map(q => q[1])), dSon = tek(P3.map(q => q[0]));
  const hata = [];
  if (nSon.length !== 1 || nSon[0] !== 3) hata.push('Necmi ' + nSon.join('/'));
  if (dElen.join() !== '1,5') hata.push('Defne elenen ' + dElen.join());
  if (nElen.join() !== '1,2,4,5') hata.push('Necmi elenen ' + nElen.join());
  if (dSon.join() !== '2,4') hata.push('Defne kalan ' + dSon.join());
  if (hata.length) console.warn('b051: mantık tutmadı', hata.join(', '));
  return { dElen, nElen, nSon: nSon[0], dSon };
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Kutu (ayakta duran sayı bloğu): (x, b) tabanın ortası. th: öne kapanma açısı (0 ayakta, π/2 yüzüstü), rot: dokunma titremesi,
// lift: kabarma (px), ok: yeşil çerçeve 0..1
function kutu(K, x, b, k, renk, { th = 0, rot = 0, lift = 0, ok = 0 } = {}) {
  const { ctx } = K, c = Math.cos(th), s = Math.sin(th);
  ctx.save(); ctx.translate(x, b - lift); ctx.rotate(rot);
  if (th < 0.14) {
    const h = KH * c;
    K.rect(-KW / 2 + 5, -h + 6, KW, h, INK, 0, 9);                                   // gölge
    K.rect(-KW / 2, -h, KW, h, ok > 0 ? H.mixHex(renk, YESIL, ok) : renk, LW * 0.8, 9);
    K.rect(-KW / 2 + 8, -h + 8, KW - 16, h - 16, PAL.cream, 0, 5);
    ctx.save(); ctx.scale(1, c); K.text(String(k), 0, -KH * 0.5 + 21, 60, INK, 900); ctx.restore();
    if (ok > 0) { ctx.globalAlpha = ok; ctx.lineWidth = 8; ctx.strokeStyle = YESIL; ctx.beginPath(); ctx.roundRect(-KW / 2 - 7, -h - 7, KW + 14, h + 14, 13); ctx.stroke(); ctx.globalAlpha = 1; }
  } else {
    // öne kapanırken arkası görünür: üst kenar aşağı ve izleyiciye doğru gelir
    const top = -KH * c + 30 * s, w0 = KW, w1 = KW * (1 + 0.12 * s), koyu = H.mixHex(renk, '#3E3A35', 0.6);
    K.poly([[-w0 / 2, -12 * s], [w0 / 2, -12 * s], [w1 / 2, top], [-w1 / 2, top]], koyu, LW * 0.8);
    if (s > 0.9) K.line(-w1 / 2 + 12, top * 0.5 - 6 * s, w1 / 2 - 12, top * 0.5 - 6 * s, 4, H.mixHex(renk, '#1E1C1A', 0.5));
  }
  ctx.restore();
}
// Kâğıt parçası: (x, y) merkez. f: çevirme 0 (arkası, boş) … 1 (yüzü, rakam). tilt: derece
function kagit(K, x, y, { f = 0, rakam = '', tilt = 0, k = 1 } = {}) {
  const { ctx } = K, sx = Math.abs(Math.cos(Math.PI * f));
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt * D2R); ctx.scale(Math.max(0.02, sx) * k, k);
  K.rect(-30, -40, 60, 80, f > 0.5 ? '#FFFFFF' : '#EFE8DA', LW * 0.7, 4);
  if (f > 0.5) K.text(rakam, 0, 22, 64, INK, 900);
  else { K.line(-30, 0, 30, 0, 2.5, '#CFC6B4'); K.line(0, -40, 0, 40, 2.5, '#CFC6B4'); }   // katlama izleri (rakam yok)
  ctx.restore();
}
// Çay bardağı (Hikmet'in; döngü: buhar)
const BARDAK = [[-17, -38], [17, -38], [10, -22], [15, -6], [12, 0], [-12, 0], [-15, -6], [-10, -22]];
const BARDAK_IC = [[-15, -31], [15, -31], [8.6, -22], [13.2, -6], [10.4, -2], [-10.4, -2], [-13.2, -6], [-8.6, -22]];
function cay(K, x, yb, t, k = 1) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 1, 26, 6, PAL.cream, 2.5);
  K.poly(BARDAK, '#F3EEE4', 0); K.poly(BARDAK_IC, '#A8401F', 0); K.poly(BARDAK, null, 2.6);
  K.line(-9, -33, -6, -26, 2.4, '#FFFFFF');
  ctx.restore();
  H.buhar(K, x, yb - 44 * k, t, { k: 0.4 * k, n: 2, ara: 10, boy: 60 });
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-300, 1400], dongu: ['duvar saatinin saniye kolu', 'pencerede martı', 'çay buharı'],
  capa: { masa: [540, TZ] }, kadraj: { genis: GENIS },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 1500, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 40, 600, 230, 250, { isik, t });
    M.duvarSaati(K, 990, 660, 50, 10.2 + t / 60, t);
    // raf: klasörler
    K.rect(620, 768, 300, 16, PAL.woodTop, LW, 5);
    const KL = [PAL.teal, PAL.mustard, '#8E2A2E', PAL.teal, '#E9DCC2', PAL.mustard, '#7E8460'];
    KL.forEach((c, i) => { const h = 96 + (i % 3) * 10; K.rect(640 + i * 38, 768 - h, 32, h, c, LW * 0.6, 4); K.rect(648 + i * 38, 768 - h + 16, 16, 22, PAL.cream, 2, 2); });
    // çerçeveli belge
    K.rect(-200, 650, 170, 130, PAL.woodDark, LW, 6); K.rect(-186, 664, 142, 102, PAL.cream, 3, 3);
  },
});
// Masa (karakterlerden sonra: bacakları örter)
function masa(K, x0 = -300, x1 = 1400) {
  K.rect(x0 + 8, TZ + 14, x1 - x0 - 16, 420, PAL.wood, LW, 6);
  for (let x = x0 + 60; x < x1 - 80; x += 200) K.rect(x, TZ + 46, 160, 140, PAL.woodTop, LW * 0.6, 8);
  K.rect(x0, TZ - 4, x1 - x0, 24, PAL.woodTop, LW, 6);
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const L = mantik();
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    birden: T('h1:1'), fisil: T('h1:6'), ardisik: T('h1:8'), h1s: T('h1>'),
    d1: T('d1'), buyuk: T('d1:2'), bilmem: T('d1:3'), n0: T('n0'), nBilmem: T('n0:2'), mudur: T('n0:3'),
    d1b: T('d1b'), biliyorum: T('d1b:1'), h2b: T('h2b'), necmininH: T('h2b:2'), kac: T('h2b:4'),
    cevap: Math.max(T('d3:1') - 0.1, T('d3') + 0.82), d4: T('d4'), hemen: T('d4:7'), d5: T('d5'), bilmedi: T('d5:12'), uc: T('d5:15'), d5s: T('d5>'),
    espri: T('h4') - 0.2, kacti: T('h4:2'), peki: T('h4:3'), unuttum: T('h4:6'), cta: T('d6') - 0.15,
  };
  tm.kes1 = T('d1') - 0.12;
  // ——— kapanan kutular: [an, sıra, rakam, kim, el]; mantıktan gelir, kelimeye kilitli ———
  const dKel = { 1: 'd4:2', 5: 'd4:5' }, nKel = { 1: 'd5:2', 2: 'd5:3', 4: 'd5:4', 5: 'd5:7' };
  tm.kapa = [];
  for (const k of L.dElen) tm.kapa.push([T(dKel[k]) - 0.03, 'd', k, 'defne', k < 3 ? 'L' : 'R']);
  for (const k of L.nElen) tm.kapa.push([T(nKel[k]) - 0.03, 'n', k, 'necmi', k < 3 ? 'L' : 'R']);
  for (const k of [1, 2, 3, 4, 5]) if (!L.dElen.includes(k) && !L.dSon.includes(k)) tm.kapa.push([tm.uc + 0.62, 'd', k, 'defne', 'R']);   // Necmi 3 ise Defne 3 olamaz
  tm.cevapK = L.nSon;
  tm.cevir = tm.uc - 0.2;                       // Necmi kâğıdı çevirir: rakam "üç"ten 0,04 sn önce görünür
  tm.kaldir = tm.bilmedi - 0.05;
  // sayaç: Defne kâğıda bakar, kutularına dokunur, Necmi'ye bakar, düşünür; Necmi kâğıda bakar, düşünür; Hikmet çayını alır
  tm.dBak = [cd0 + 0.35, cd0 + 2.1];
  tm.dokun = [[cd0 + 2.6, 1], [cd0 + 3.0, 2], [cd0 + 3.4, 3]];
  tm.nBak = [cd0 + 4.6, cd0 + 6.4];
  tm.nDusun = [cd0 + 6.6, cd - 0.9];
  tm.dDusun = [cd0 + 6.9, cd - 0.55];
  tm.hCay = [cd0 + 5.4, cd0 + 8.2];

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.08, 584, 1008], [tm.birden - 0.2, ...GENIS], [tm.ardisik - 0.4, 1.02, 545, 998]] },
    { id: 'konusma', t0: tm.kes1, cam: [[0, 1.3, 386, 1086], [tm.n0 - 0.28, 1.3, 698, 1088], [tm.d1b - 0.28, 1.32, 392, 1084]] },
    { id: 'hikmet', t0: tm.h2b - 0.1, cam: [[0, 1.28, 640, 1040], [tm.kac, 1.31, 650, 1038]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 0.97, 540, 862], [cd0 + 4.2, 1.0, 525, 866], [cd - 0.8, 1.05, 475, 874]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 344, 990]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.22, 404, 1030], [tm.d5 - 0.3, 1.22, 676, 1030], [tm.uc + 0.3, 0.99, 548, 1004]] },   // d4 Defne'nin sırası, d5 Necmi'nin sırası (kesmesiz kayma), "üç"ten sonra iki sıra
    { id: 'espri', t0: tm.espri, cam: [[0, 1.3, 432, 1062], [tm.unuttum, 1.33, 436, 1058]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.36, 358, 1040], [tm.cta + 1.6, 1.4, 362, 1036]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: 5, look: [0.75, 0.25] }, ...POZ.dur });
  const hik = [
    [0.7, { head: { tilt: -3, look: [0.1, 0.05] } }, 0.35],
    [tm.ardisik - 0.2, { expr: 'mutlu', head: { tilt: 4, look: [0.05, 0] } }, 0.3],
    [tm.d1 - 0.12, { head: { tilt: -4, look: [-0.85, 0.15] } }, 0.01],
    [tm.n0 - 0.1, { head: { tilt: 4, look: [0.85, 0.15] } }, 0.3],
    [tm.d1b - 0.1, { expr: 'saskin', head: { tilt: -5, look: [-0.85, 0.1] } }, 0.25],
    [tm.h2b - 0.1, { expr: 'mutlu', head: { tilt: 4, look: [0.3, 0.05] } }, 0.01],
    [tm.necmininH, { head: { tilt: 5, look: [0.85, 0.2] } }, 0.3],
    [cd0, { expr: 'mutlu', head: { tilt: 2, look: [0.1, 0.1] } }, 0.3],
    [tm.cevap, { expr: 'notr', head: { tilt: -3, look: [-0.7, 0.4] } }, 0.01],
    [tm.d5, { expr: 'notr', head: { tilt: 3, look: [0.75, 0.4] } }, 0.3],
    [tm.uc, { expr: 'saskin', head: { tilt: 5, look: [0.6, 0.0] } }, 0.2],
    [tm.espri, { expr: 'notr', head: { tilt: -4, look: [-0.75, 0.45] } }, 0.01],
    [tm.kacti, { head: { tilt: -6, look: [-0.95, 0.5] } }, 0.25],
    [tm.peki, { head: { tilt: -2, look: [-0.55, 0.5] } }, 0.25],
    [tm.unuttum - 0.3, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 7, look: [-0.3, -0.4] } }, 0.35],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'notr', head: { tilt: 4, look: [0.55, 0.6] }, ...POZ.dur });
  const def = [
    [0.6, { head: { tilt: 2, look: [0.8, 0.1] } }, 0.35],
    [tm.birden, { head: { tilt: -2, look: [0.2, 0.6] } }, 0.35],
    [tm.ardisik - 0.1, { expr: 'saskin', head: { tilt: 4, look: [0.8, 0.0] } }, 0.3],
    [tm.d1 - 0.12, { expr: 'notr', head: { tilt: 5, look: [0.55, 0.7] } }, 0.01],
    [tm.buyuk, { expr: IFADE.dusun2, head: { tilt: -4, look: [0.3, 0.2] } }, 0.3],
    [tm.n0 - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.1] } }, 0.3],
    [tm.d1b - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [0.6, 0.0] } }, 0.25],
    [tm.h2b - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [0.85, 0.05] } }, 0.01],
    [cd0, { expr: 'notr', head: { tilt: 4, look: [0.5, 0.6] } }, 0.3],
    [tm.dBak[1], { expr: IFADE.dusun, head: { tilt: -3, look: [-0.2, 0.7] } }, 0.3],
    [tm.dokun[2][0] + 0.35, { head: { tilt: 3, look: [0.9, 0.35] } }, 0.3],
    [tm.dDusun[0], { expr: IFADE.dusun, armL: { sh: 18, el: -168 }, head: { tilt: 6, look: [0.4, -0.5] } }, 0.4],
    [tm.dDusun[1], { expr: 'saskin', armL: POZ.dur.armL, head: { tilt: -3, look: [0.0, -0.2] } }, 0.3],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.2, 0.7] } }, 0.01],
    [tm.d5 - 0.1, { head: { tilt: -3, look: [0.9, 0.5] } }, 0.3],
    [tm.uc - 0.2, { expr: 'mutlu', head: { tilt: -4, look: [0.9, 0.2] } }, 0.3],
    [tm.uc + 0.15, { head: { tilt: 3, look: [0.1, 0.7] } }, 0.25],
    [tm.espri, { expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.2] } }, 0.01],
    [tm.peki - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.6, 0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.5, 0.3] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'notr', head: { tilt: -4, look: [-0.75, 0.2] }, ...POZ.dur });
  const nec = [
    [0.75, { head: { tilt: 3, look: [-0.4, 0.6] } }, 0.35],
    [tm.birden, { head: { tilt: -2, look: [-0.1, 0.6] } }, 0.35],
    [tm.d1 - 0.12, { head: { tilt: -3, look: [-0.85, 0.2] } }, 0.01],
    [tm.n0 - 0.1, { expr: 'notr', head: { tilt: 5, look: [-0.5, 0.7] } }, 0.3],
    [tm.mudur - 0.1, { expr: 'yorgun', head: { tilt: -5, look: [-0.9, 0.1] } }, 0.3],
    [tm.d1b, { expr: 'saskin', head: { tilt: -3, look: [-0.95, 0.1] } }, 0.25],
    [tm.h2b - 0.1, { expr: 'saskin', head: { tilt: -3, look: [-0.8, 0.1] } }, 0.01],
    [cd0, { expr: 'notr', head: { tilt: -3, look: [-0.7, 0.3] } }, 0.3],
    [tm.nBak[0], { head: { tilt: 5, look: [-0.5, 0.7] } }, 0.3],
    [tm.nDusun[0], { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: -5, look: [-0.4, -0.4] } }, 0.4],
    [tm.nDusun[1], { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -3, look: [-0.8, 0.1] } }, 0.35],
    [tm.cevap, { expr: 'notr', head: { tilt: -3, look: [-0.85, 0.3] } }, 0.01],
    [tm.d5 - 0.1, { head: { tilt: 4, look: [-0.3, 0.7] } }, 0.3],
    [tm.kaldir, { expr: 'mutlu', head: { tilt: -4, look: [-0.2, 0.1] } }, 0.3],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec, L };
}

// ═══════════════════════════ Kutu durumu (bütün sahneler aynı fonksiyonu okur) ═══════════════════════════
// Dönen: { th, rot, lift, ok }
function kutuAt(S, r, k, t) {
  const { tm } = S;
  let th = 0, rot = 0, lift = 0, ok = 0;
  for (const [a, rr, kk] of tm.kapa) if (rr === r && kk === k && t >= a) th = Math.PI / 2 * seg(t, a, 0.2) ** 2;   // düşer, tabana değince durur
  // h1: "birden beşe": iki sırada kutular sırayla kabarır
  lift += 12 * H.nabiz(t, tm.birden + (k - 1) * 0.075, 0.3);
  // sayaç: Defne'nin dokunduğu kutular titrer
  if (r === 'd') for (const [a, kk] of tm.dokun) if (kk === k) rot += 3.5 * D2R * H.sars(t, a, 0.4, 6);
  // cevap: d4 "hemen": Defne'nin kalan kutuları kabarır; espri: Hikmet'in baktığı 2 ve 4
  if (r === 'd' && k >= 2 && k <= 4) lift += 10 * H.nabiz(t, tm.hemen + (k - 2) * 0.07, 0.3);
  if (r === 'd' && k === 2) lift += 10 * H.nabiz(t, tm.kacti, 0.32);
  if (r === 'd' && k === 4) lift += 10 * H.nabiz(t, tm.peki, 0.32);
  if (r === 'n' && k === tm.cevapK) ok = W(t, tm.uc - 0.04, 0.25);
  return { th, rot, lift, ok };
}
// El yolu: kutuların üst kenarına uzanır, iter, geri çekilir. duraklar = [[an, [x, y]]…] (aynı el). Dönen: { p, w } | null
function itYolu(t, dur) {
  if (!dur.length) return null;
  let w = 0; for (const [a] of dur) w = Math.max(w, pIn(t, a - 0.36, a + 0.24, 0.26));
  if (w < 0.01) return null;
  const p = H.dokunYolu(t, dur.map(([a, q]) => [a - 0.05, q]), { yuksel: 22, sure: 0.22 });
  let dy = 0; for (let i = 0; i < dur.length; i++) { const a = dur[i][0], b = dur[i + 1]?.[0] ?? 1e9; if (t >= a && t < b - 0.27) dy = 30 * ease.state(seg(t, a, 0.14)); }
  return { p: [p[0], p[1] + dy], w };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h1: 7, d5: 12 },
  kartSon: -1,
  kuyruksuz: (t, B) => t < S.tm.cd || B.sc.id === 'cevap',   // balon kuyruğu konuşanın ortadaki kutusunun (3) üstünden geçip onu işaret etmesin   // kart ve sayaç ekran katmanında çizilir (sayaç bu bölüme özel: "Cevap geliyor", yüzleri örtmez)
  dunya(K, t, B) { oda(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'sayac') { const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.3 * clamp01((t - tm.cd0 + 0.3) / 0.3) * (1 - ease.exit(seg(t, tm.cd, 0.3))); ctx.fillStyle = INK; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (id === 'cevap') H.mark(K, t, tm.uc - 0.02, tm.espri - 0.2, B.ekr([KX('n', tm.cevapK) + 52, KB - KH - 4]), true);
  },
});

// "SEN DE DÜŞÜN!" sayacı (sahne.js countdown'un uyarlaması): ipucu repliği yok, sayaç "Buldum!"dan hemen önce biter.
// Kartın hemen altında, yüzlerin üstünde durur (r 138); paylaşım hapı masanın altında. Sahne arkada oynamaya devam eder.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.3 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.25), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 540, y = 722, r = 122;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  ctx.font = '900 64px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 76;
  K.rect(-bw / 2 + 8, -r - 116 + 10, bw, 92, INK, 0, 46); K.rect(-bw / 2, -r - 116, bw, 92, PAL.mustard, LW, 46);
  K.text('SEN DE DÜŞÜN!', 0, -r - 48, 64, INK, 900);
  K.circ(10, 12, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 38, 106, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(540, 1382); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 64;
    K.rect(-sw / 2 + 8, -44 + 10, sw, 88, INK, 0, 44); K.rect(-sw / 2, -44, sw, 88, PAL.coral, LW, 44); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

function oda(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz });
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  if (id === 'sayac') H.glance(hp, t, tm.cd - 0.5, 9.5);
  H.omuzSilk(dp, t, tm.bilmem - 0.05, 0.45);
  H.omuzSilk(np, t, tm.nBilmem - 0.05, 0.5);
  H.onayla(dp, t, tm.biliyorum, 2, 0.3);

  // ——— Hikmet: kancada Necmi'ye kâğıdı verir, "ardışık"ta iki parmak; h2b'de Necmi'yi gösterir; sayaçta çayını alır; espride
  //     Defne'nin kâğıdına uzanır ———
  const ho = { heads };
  let hParmak = 0, hIs = null, hCayP = HCAY, hCayTut = false;
  const ver = H.elVer(t, -0.06, [600, 1084], NP0, { kaldir: 20 });
  if (t < ver.tS + 0.3) ho.R = [[ver.p[0] - 8, ver.p[1] + 26], ver.verW, 'A'];
  const w2 = pIn(t, tm.ardisik - 0.3, tm.h1s + 0.35, 0.28);
  if (w2 > 0.01) { ho.L = [[HIK_X - 34, 1050], w2, 'A']; if (w2 > 0.4) hParmak = clamp01((t - tm.ardisik + 0.05) / 0.2) * 2; }
  const wN = pIn(t, tm.necmininH - 0.3, tm.h2b + 2.9, 0.28);
  if (id === 'hikmet' && wN > 0.01) { ho.R = [[NEC_X - 150, 1030], wN, 'A']; if (wN > 0.5) hIs = [NEC_X - 60, 1050]; }
  const wC = pIn(t, tm.hCay[0], tm.hCay[1], 0.3);
  if (id === 'sayac' && wC > 0.01) {
    const up = W(t, tm.hCay[0] + 0.3, 0.4) * (1 - W(t, tm.hCay[1] - 0.7, 0.4));
    hCayP = kar(HCAY, [HIK_X + 64, 1102], up); hCayTut = t > tm.hCay[0] + 0.25 && t < tm.hCay[1] - 0.25;
    ho.R = [[hCayP[0] + 12, hCayP[1] - 22], wC, 'A'];
  }
  if (id === 'espri') { const w = pIn(t, tm.peki - 0.3, tm.unuttum - 0.35, 0.3); if (w > 0.01) ho.L = [[DP0[0] + 34, DP0[1] - 10], w, 'A']; }

  // ——— Defne: kâğıt sağ elinde; d1'de bakar; sayaçta bakar, kutularına dokunur; d4'te 1'i ve 5'i, sonra 3'ü kapatır ———
  const dO = { heads };
  let dKag = DP0, dIs = null;
  const dBak1 = pIn(t, tm.d1 - 0.05, tm.bilmem - 0.1, 0.3), dBak2 = id === 'sayac' ? pIn(t, tm.dBak[0], tm.dBak[1], 0.35) : 0;
  dKag = kar(DP0, DPK, Math.max(dBak1, dBak2));
  if (id === 'espri') dKag = kar(DP0, [DEF_X + 6, 1150], W(t, tm.peki - 0.12, 0.3));          // Hikmet uzanınca kâğıdı göğsüne çeker
  if (id === 'cta') dKag = kar(DP0, [462, 1010], W(t, tm.cta + 0.25, 0.4));                    // kâğıt yanağının yanında (arkası kamerada)
  const dDur = { L: [], R: [] }, nDur = { L: [], R: [] };
  for (const [a, r, k, kim, el] of S.tm.kapa) (kim === 'defne' ? dDur : nDur)[el].push([a, [KX(r, k) + (el === 'L' ? 6 : -6), KB - KH - 8]]);
  const dItL = itYolu(t, dDur.L), dItR = id === 'cevap' ? itYolu(t, dDur.R) : null;
  let dHedef = [dKag[0] + 4, dKag[1] + 34];
  if (dItR) dHedef = kar(dHedef, dItR.p, dItR.w);                                              // kâğıtlı elle iter
  if (id !== 'buldum') dO.R = [dHedef, 1, 'A'];
  if (dItL && id === 'cevap') { dO.L = [dItL.p, dItL.w, 'B']; if (dItL.w > 0.5) dIs = [dItL.p[0], dItL.p[1] + 24]; }
  if (id === 'sayac') {
    const w = pIn(t, tm.dokun[0][0] - 0.3, tm.dokun[2][0] + 0.3, 0.28);
    if (w > 0.01) { const p = H.dokunYolu(t, tm.dokun.map(([a, k]) => [a, [KX('d', k), KB - KH - 6]]), { yuksel: 26, sure: 0.18 }); dO.L = [[p[0] - 4, p[1] - 30], w, 'B']; if (w > 0.5) dIs = p; }
  }

  // ——— Necmi: kâğıdı Hikmet'ten alır (sol el); n0'da bakar; sayaçta bakar, düşünür; d5'te 1, 2, 4, 5'i kapatır, kâğıdı çevirir ———
  const no = { heads };
  let nKag = null, nIs = null, nF = 0;
  if (t >= -1) {
    nKag = t < ver.tS ? ver.p : NP0;
    const b1 = pIn(t, tm.n0 - 0.05, tm.nBilmem + 0.5, 0.3), b2 = id === 'sayac' ? pIn(t, tm.nBak[0], tm.nBak[1], 0.35) : 0;
    if (t >= ver.tS) nKag = kar(NP0, NPK, Math.max(b1, b2));
    if (id === 'hikmet') nKag = kar(NP0, [NEC_X - 44, 1070], W(t, tm.necmininH, 0.3));      // gösterilince kâğıdı göğsüne çeker
    let nHedef = [nKag[0] - 4, nKag[1] + 34];
    if (t >= tm.cevap) {
      const up = W(t, tm.kaldir, 0.4);
      nHedef = kar([NP0[0] - 4, NP0[1] + 34], [NPR[0] - 4, NPR[1] + 34], up);
      const it = itYolu(t, nDur.L);
      if (it) nHedef = kar(nHedef, it.p, it.w);                                                  // kâğıtlı elle iter
      nF = ease.state(seg(t, tm.cevir, 0.3));
    }
    no.L = [nHedef, t < ver.tS ? ver.alW : 1, 'A'];
  }
  const nItR = t >= tm.cevap ? itYolu(t, nDur.R) : null;
  if (nItR) { no.R = [nItR.p, nItR.w, 'B']; if (nItR.w > 0.5) nIs = [nItR.p[0], nItR.p[1] + 24]; }

  // ——— çizim: kişiler → masa → kutular → çay → kâğıtlar → tutan eller ———
  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  const nc = oyna(K, t, tl, 'necmi', np, no);
  masa(K);
  for (const r of ['d', 'n']) for (let k = 1; k <= 5; k++) kutu(K, KX(r, k), KB, k, RENK[r], kutuAt(S, r, k, t));
  cay(K, hCayP[0], hCayP[1], t);
  if (hCayTut) hc.tut('R');
  if (hParmak > 0) hc.parmak('L', hParmak, { toplam: 2, ac: 0.32 });
  if (hIs) hc.isaret('R', hIs);
  if (id === 'espri' && ho.L) hc.tut('L');
  // Defne'nin kâğıdı (arkası; rakam hiç görünmez)
  const dHand = dc.handR;
  kagit(K, dHand[0] - 4, dHand[1] - 46, { tilt: id === 'cta' ? -8 : 4 });
  dc.tut('R');
  if (dIs) dc.isaret('L', dIs);
  // Necmi'nin kâğıdı: cevapta çevrilir, 3 görünür
  if (nKag) {
    const nh = t < ver.tS ? [ver.p[0] - 4, ver.p[1] + 34] : nc.handL;
    kagit(K, nh[0] + 4, nh[1] - 50, { f: nF, rakam: String(tm.cevapK), tilt: -4 + 4 * nF, k: 1 + 0.45 * W(t, tm.cevir - 0.1, 0.35) });
    nc.tut('L');
    if (t < ver.tB) hc.tut('R');
  }
  if (nIs) nc.isaret('R', nIs);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}
