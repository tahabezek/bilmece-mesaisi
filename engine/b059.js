// Bölüm 59 · TANIK (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_059_v5.md). Mekanizma: Türkçede "-di" / "-miş".
// Logline: Hikmet çay ocağındaki kiler dolabını açar; annesinin baklavasının tepsisi bomboş. Necmi "Baklavayı Defne yemiş",
// Defne "Baklavayı Kerem yedi" der. Sözleri birer konuşma balonu olarak başlarının üstünde asılı kalır. Hikmet'e göre biri
// gözüyle görmüş, öbürü dedikodu taşıyor; iş çözülmez. Necmi'nin ipucu: "Ne dediğimize değil, nasıl dediğimize bakın."
// Akılda kalacak tek şey: gören "yedi" der, duyan "yemiş" der.
// Sızıntı yasağı: Kerem arka planda, cam bölmenin ardında nötr çalışır (kırıntı, şerbet, suçlu bakış yok); balonlarda ekler
// vurgulanmaz (iki balon aynı renk, aynı punto, aynı kalınlık).
// Mekân: çay ocağı köşesi (önden): solda kiler dolabı, sağda tezgâh ve çaydanlık, arkada cam bölme ve Kerem'in masası.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b059_ocak';
const HIK_X = 300, NEC_X = 530, DEF_X = 740, KER_X = 1050;
const DOLAP = { x: -10, y: 700, w: 240, h: 800 };          // kiler dolabı: menteşe sağda (x + w), kapak izleyiciye doğru açılır
const RAF_Y = 1062;                                         // tepsinin durduğu raf
const TEPSI_RAF = [104, RAF_Y - 4];                         // tepsinin raftaki yeri (tabanın ortası)
const TEPSI_EL = [222, 1168];                               // Hikmet'in sol elinde
const TEPSI_GOSTER = [262, 1112];                           // "bomboş": kameraya çevrilmiş
const BOLME = { x0: 880, x1: 1300, y0: 742, y1: 1180 };    // cam bölme
const TEZ = { x0: 850, x1: 1260, y: 1186 };                 // tezgâh üstü
const BAL_N = [365, 690], BAL_D = [660, 775];               // N Hikmet'in başının üstünde, D bir kat aşağıda (yan yana sığmıyor)               // balonların merkezi (dünya)
const GENIS = [1.32, 531, 991];                              // grup planı: zemin ≤ %15, karakterler genişliğin ≥ %85'i, balon yazısı 40 × 1,32 ≈ 53 px
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Nesneler ═══════════════════════════
// Bakır baklava tepsisi (önden, yuvarlak). (x, y) tabanın ortası; e: kameraya dönüş 0 (yatay, ince elips) … 1 (yüzü kamerada)
const LEKE = [[-0.42, -0.1, 0.16], [0.18, 0.22, 0.2], [0.36, -0.3, 0.12], [-0.08, 0.38, 0.1], [-0.2, -0.42, 0.09]];   // şerbet izleri (sabit liste)
const KIRINTI = [[-0.3, 0.12], [0.06, -0.2], [0.44, 0.08], [-0.12, 0.3], [0.24, -0.04], [-0.46, -0.28]];
function tepsi(K, x, y, { e = 0, k = 1 } = {}) {
  const { ctx } = K, R = 98 * k, ry = R * lerp(0.2, 0.86, e), kenar = 14 * k * (1 - 0.55 * e);
  ctx.save(); ctx.translate(x, y - ry - kenar * 0.5);
  K.ell(0, kenar, R, ry, '#7A4524', LW * 0.8);                       // yan kenar
  K.ell(0, 0, R, ry, '#C9773F', LW * 0.8);                           // kenar halkası
  K.ell(0, 0, R * 0.86, ry * 0.86, '#E2A066', LW * 0.5);             // iç taban (boş)
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, R * 0.86, ry * 0.86, 0, 0, Math.PI * 2); ctx.clip();
  for (const [u, v, r] of LEKE) K.ell(u * R, v * ry, r * R, r * ry * 0.7, '#D18A4E', 0);
  for (const [u, v] of KIRINTI) K.ell(u * R, v * ry, 5 * k, 4 * k * (0.4 + 0.6 * e), '#B8873E', 0);
  K.ell(-R * 0.3, -ry * 0.38, R * 0.32, ry * 0.1, '#F0C596', 0);    // parlaklık (düz renk)
  ctx.restore();
  ctx.restore();
}
// Konuşma balonu (dünya). c: merkez, uc: kuyruğun ucu, a: açılış (0..1, yay 320/30)
function balon(K, c, uc, metin, a) {
  if (a <= 0.001) return;
  const { ctx } = K, size = 40;
  ctx.font = `800 ${size}px Rubik`;
  const w = ctx.measureText(metin).width + 56, h = 80, x = c[0] - w / 2, y = c[1] - h / 2;
  const tx = Math.min(Math.max(uc[0], x + 60), x + w - 60);
  ctx.save(); ctx.translate(tx, y + h); ctx.scale(a, a); ctx.translate(-tx, -(y + h));
  ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.roundRect(x + 8, y + 10, w, h, 40); ctx.fillStyle = INK; ctx.fill();
  ctx.beginPath(); ctx.moveTo(tx - 24, y + h - 4); ctx.lineTo(uc[0], uc[1]); ctx.lineTo(tx + 24, y + h - 4); ctx.closePath();
  ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 40); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx - 21, y + h - 6); ctx.lineTo(tx + 21, y + h - 6); ctx.lineWidth = LW + 2; ctx.strokeStyle = '#FFFFFF'; ctx.stroke();
  K.text(metin, c[0], y + h / 2 + size * 0.36, size, INK, 800);
  ctx.restore();
}
// Kiler dolabı: u kapağın açıklığı (0..1 → 0..96°). Kapak menteşede (sağ kenar) döner, sol kenarı izleyiciye gelir.
function dolapGovde(K, u, tepsiIcinde) {
  const { x, y, w, h } = DOLAP;
  K.rect(x + 8, y + 12, w, h, INK, 0, 10);
  K.rect(x, y, w, h, '#B98A57', LW, 10);
  K.rect(x - 10, y - 26, w + 20, 30, '#9C7146', LW, 6);              // tepe pervazı
  // iç: üç raf; tepsi ortadaki rafta
  K.rect(x + 16, y + 16, w - 32, h - 200, '#5E4630', LW * 0.6, 4);
  for (const ry of [880, RAF_Y, 1240]) K.rect(x + 16, ry, w - 32, 14, '#D2B184', LW * 0.6, 3);
  // üst raf: kavanozlar, alt raf: çay paketleri (döngü değil, dekor)
  for (const [jx, c] of [[34, '#E6D7B0'], [92, '#C9D9C3'], [150, '#EAD0A8']]) { K.rect(x + jx, 800, 46, 80, c, LW * 0.6, 8); K.rect(x + jx - 2, 792, 50, 16, '#7E8460', LW * 0.5, 4); }
  for (const [jx, c] of [[30, PAL.red], [96, PAL.teal], [160, PAL.mustard]]) { K.rect(x + jx, 1156, 52, 84, c, LW * 0.6, 4); K.rect(x + jx + 8, 1180, 36, 24, PAL.cream, 0, 3); }
  K.rect(x + 14, y + h - 170, w - 28, 150, '#A97B4B', LW * 0.7, 6);   // alt çekmece
  K.rect(x + w / 2 - 30, y + h - 104, 60, 14, '#6D5236', LW * 0.5, 7);
  if (tepsiIcinde) tepsi(K, TEPSI_RAF[0], TEPSI_RAF[1], { e: 0, k: 0.92 });
}
function dolapKapak(K, u) {
  const { x, y, w, h } = DOLAP, a = clamp01(u) * 96 * D2R, hx = x + w, xf = hx - w * Math.cos(a), sk = Math.sin(a);
  const ust = y + 6, alt = y + h - 186;
  const leaf = [[hx, ust], [xf, ust - 34 * sk], [xf, alt + 26 * sk], [hx, alt]];
  K.poly(leaf, a > Math.PI / 2 ? '#8E6740' : H.mixHex('#C79A66', '#A67A4A', sk), LW);
  if (a < 70 * D2R) {
    const ix = lerp(hx, xf, 0.14), ox = lerp(hx, xf, 0.86);
    K.poly([[ox, ust + 40 - 26 * sk], [ix, ust + 40], [ix, alt - 40], [ox, alt - 40 + 20 * sk]], null, LW * 0.5);   // kapak çerçevesi
  }
  return kulp(u);
}
// kapağın kulpu (el hedefi): kapağın serbest kenarında
function kulp(u) {
  const { x, y, w } = DOLAP, a = clamp01(u) * 96 * D2R, xf = x + w - w * Math.cos(a);
  return [lerp(xf, x + w, 0.12), RAF_Y - 6 + 8 * Math.sin(a)];
}
function kulpCiz(K, u) {
  const a = clamp01(u) * 96 * D2R; if (a > 82 * D2R) return;
  const [kx, ky] = kulp(u);
  K.rect(kx - 8, ky - 56, 16, 112, '#E8DFC9', LW * 0.6, 8);
}

// Çaydanlık (tezgâhta; döngü: buhar)
function caydanlik(K, x, yb, t) {
  K.rect(x - 70, yb - 18, 140, 20, '#5D6A61', LW * 0.8, 6);
  K.rect(x - 50, yb - 92, 100, 76, PAL.metal, LW, 14);
  K.rect(x - 32, yb - 144, 64, 54, '#B9C6BB', LW, 12);
  K.circ(x, yb - 150, 9, '#3A3F3C', LW * 0.6);
  K.poly([[x + 48, yb - 70], [x + 92, yb - 100], [x + 100, yb - 88], [x + 52, yb - 46]], PAL.metal, LW);
  H.buhar(K, x + 98, yb - 108, t, { k: 0.7, n: 2 });
}
// Cam bölme ve arkasında Kerem'in masası (Kerem nötr çalışır: ekrana bakar, klavyede yazar)
function bolme(K, t, tl) {
  const { ctx } = K, { x0, x1, y0, y1 } = BOLME;
  ctx.save();
  ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  K.rect(x0, y0, x1 - x0, y1 - y0, '#DCE6DE', 0);                    // iç duvar
  K.rect(x0, 1010, x1 - x0, 200, '#B9C7BD', 0);
  // pencere ışığı (düz çokgen)
  K.poly([[x0 + 240, y0], [x0 + 330, y0], [x0 + 230, y1], [x0 + 140, y1]], '#E8EFE8', 0);
  // Kerem: ölçek 0,6, masanın arkasında
  const s = H.BOY.genc * 0.6, yz = 1250;
  const kp = H.kisi('genc', { x: KER_X, y: yz, s, expr: 'notr', head: { tilt: -4, look: [-0.55, 0.55] }, ...POZ.rahat });
  const yaz = i => [Math.sin(t * 9.1 + i * 2.1) * 3, -Math.max(0, Math.sin(t * 11.3 + i * 1.7)) * 5];
  const klavye = [KER_X - 4, 1042];
  const a = yaz(0), b = yaz(1);
  oyna(K, t, null, 'genc', kp, { L: [[klavye[0] - 34 + a[0], klavye[1] + a[1]], 1, 'A'], R: [[klavye[0] + 30 + b[0], klavye[1] + b[1]], 1, 'A'], sessiz: true });
  // masa, klavye, ekran (ekranı yan döner; satırlar kayar: döngü)
  K.rect(KER_X - 150, 1050, 330, 22, '#C8A774', LW * 0.8, 4);
  K.rect(KER_X - 140, 1072, 310, 140, '#A98A5C', LW * 0.6, 4);
  K.rect(klavye[0] - 62, 1036, 124, 14, '#E8E4DA', LW * 0.5, 4);
  K.rect(KER_X - 138, 1024, 12, 28, '#3A3F3C', 0); K.rect(KER_X - 160, 1046, 56, 8, '#3A3F3C', 0);
  const ekr = [[KER_X - 196, 930], [KER_X - 96, 950], [KER_X - 96, 1026], [KER_X - 196, 1030]];
  K.poly(ekr, '#2E4A4C', LW * 0.7);
  ctx.save(); ctx.beginPath(); ctx.moveTo(...ekr[0]); for (const p of ekr.slice(1)) ctx.lineTo(...p); ctx.closePath(); ctx.clip();
  const kay = (t * 22) % 16;
  for (let i = -1; i < 8; i++) { const yy = 940 + i * 16 - kay, ww = 22 + ((i * 37 + Math.floor(t * 22 / 16) * 13) % 5) * 12; K.line(KER_X - 186, yy + 2, KER_X - 186 + ww, yy + 4, 4, i % 3 ? '#9BD3C1' : PAL.mustard); }
  ctx.restore();
  // cam: hafif ton ve iki düz yansıma şeridi
  ctx.globalAlpha = 0.16; K.rect(x0, y0, x1 - x0, y1 - y0, '#9CC4C0', 0); ctx.globalAlpha = 0.35;
  K.poly([[x0 + 30, y1], [x0 + 110, y1], [x0 + 230, y0], [x0 + 150, y0]], '#FFFFFF', 0);
  K.poly([[x0 + 140, y1], [x0 + 168, y1], [x0 + 288, y0], [x0 + 260, y0]], '#FFFFFF', 0);
  ctx.globalAlpha = 1;
  ctx.restore();
  K.rect(x0 - 12, y0 - 14, x1 - x0 + 24, 18, '#6E7F75', LW * 0.8, 4);   // kasa
  K.rect(x0 - 12, y0, 18, y1 - y0, '#6E7F75', LW * 0.8, 4);
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-400, 1500], dongu: ['çaydanlık buharı', 'Kerem\'in ekranında kayan satırlar', 'duvar saati'],
  capa: { dolap: TEPSI_RAF, tezgah: [1060, TEZ.y] }, kadraj: { genis: GENIS },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -500, x1: 1600, isik, duvar: 'fayans', zemin: 'karo' });
    M.duvarSaati(K, 560, 610, 50, 15.2 + t / 60, t);
    bolme(K, t, null);
    dolapGovde(K, durum.dolap || 0, durum.tepsiIcinde);
  },
});
function tezgahCiz(K, t) {
  K.rect(TEZ.x0 + 10, TEZ.y + 30, TEZ.x1 - TEZ.x0 - 20, 1500 - TEZ.y - 30, PAL.wood, LW);
  for (let i = 0; i < 2; i++) K.rect(TEZ.x0 + 30 + i * 196, TEZ.y + 54, 180, 240, PAL.woodTop, LW * 0.6, 6);
  K.rect(TEZ.x0, TEZ.y, TEZ.x1 - TEZ.x0, 34, PAL.woodTop, LW, 8);
  caydanlik(K, 1130, TEZ.y, t);
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    yedi: T('h1:3'), h1b: T('h1b'), sabah: T('h1b:2'), bombos: T('h1b:6'),
    h2a: T('h2a'), gordun: T('h2a:3'), n0: T('n0'), nDefne: T('n0:1'), nYemis: T('n0:2'),
    h2b: T('h2b'), d1: T('d1'), dKerem: T('d1:1'), dYedi: T('d1:2'),
    h3: T('h3'), gozuyle: T('h3:3'), obur: T('h3:5'), dedikodu: T('h3:7'), h3b: T('h3b'), yanlis: T('h3b:2'),
    h4: T('h4'), suclu: T('h4:1'), cozulmez: T('h4:4'), h4s: T('h4>'),
    n1: T('n1'), ned1: T('n1:1'), nasil: T('n1:3'), ned2: T('n1:4'), bakin: T('n1:5'),
    cevap: T('d3>') + 0.25, d4: T('d4'), goren: T('d4:0'), duyan: T('d4:3'), necmiD: T('d4:6'), ben: T('d4:8'), cta: T('d6') - 0.15,
  };
  tm.kapak = 0.3;                                  // kapak 0,3 sn'de açılmaya başlar (ilk hareket)
  tm.al = tm.h1b + 0.12;                           // el tepsiye uzanır
  tm.cik = tm.al + 0.32;                           // tepsi raftan çıkar
  tm.koy = 1e9;                                    // (22 Kas) tepsi Hikmet'in elinde kalır: grup planında dolap kadraj dışında
  tm.balN = tm.nDefne - 0.04; tm.balD = tm.dKerem - 0.04;
  // sayaç: Hikmet balonlara bakar, düşünür; Necmi ve Defne birbirine bakar
  tm.s = i => cd0 + i;

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.2, 470, 945], [tm.yedi - 0.5, 1.22, 462, 948]] },
    { id: 'tepsi', t0: tm.yedi - 0.2, kisa: true, cam: [[0, 2.0, 150, 1010]] },                       // araya kesme: açık dolapta boş tepsi
    { id: 'kanca2', t0: tm.h1b + 0.1, cam: [[0, 1.22, 450, 948]] },
    { id: 'yakin', t0: tm.sabah - 0.1, cam: [[0, 1.4, 300, 1030], [tm.bombos + 0.4, 1.44, 296, 1036]] },
    { id: 'iki', t0: tm.h2a - 0.1, cam: [[0, 1.38, 415, 960]] },
    { id: 'necmi', t0: tm.n0 - 0.1, cam: [[0, 1.5, 495, 950], [tm.h2b - 0.3, 1.53, 495, 948]] },   // cx ≤ 496: balonun sol kenarı x ≥ 90
    // (26 Kas, bağımsız göz) Necmi'nin balonu açıldıktan sonra yakın plan yok: iki balon (dünya x 202–818) tam ve güvenli
    // alanda (ekran x 90–920) kalsın diye her kadraj zoom ≤ 1,34'tür ve cx dar bir aralıktadır. Defne'nin
    // yakın planı ("emiş." diye kesiyordu) ve cam arkasındaki Kerem planı (cevabı öne çıkarıyordu) kaldırıldı. 12 sn'den
    // kesime kadar tek grup planı: kesme yok, anahtarlar arası yay (170/26) ve 0,9 %/sn kayma; Kerem hiç kadraja girmez.
    { id: 'grup1', t0: tm.h2b - 0.1, cam: [[0, 1.26, 528, 990]] },
    { id: 'defne', t0: tm.d1 - 0.1, kesme: false, cam: [[0, 1.29, 536, 986]] },                         // Defne konuşur: hafif sağa
    { id: 'grup2', t0: tm.h3 - 0.1, kesme: false, cam: [[0, 1.24, 530, 995], [tm.h3b - 0.2, 1.30, 536, 984]] },   // h3 geri çekil, h3b it
    { id: 'grup3', t0: tm.h4 - 0.1, kesme: false, cam: [[0, 1.20, 516, 1005]] },                        // h4: geri çekil (sayaç buradan iter)
    { id: 'sayac', t0: cd0 - 0.05, kesme: false, cam: [[0, 1.26, 522, 1000], [cd0 + 5, 1.29, 530, 995]] },   // kamera draw'daki kamera() ile
    { id: 'ipucu', t0: tm.n1 - 0.1, kesme: false, cam: [[0, 1.31, 534, 990]] },                         // kamera draw'daki kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, DEF_X, 950]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.0, 560, 960]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.34, DEF_X - 20, 1000], [tm.cta + 1.6, 1.38, DEF_X - 20, 996]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();
  // sayaç + ipucu: grup3'ün bittiği kadrajdan (kesmesiz) "Buldum!"a kadar tek doğrusal itme; Necmi'nin balonu tarafından
  // Defne'nin balonu tarafına kayar, iki balon da baştan sona tam ve güvenli alanda kalır.
  const itA = cd0 - 0.05, itB = tm.buldum - 0.05, c0 = film.cam(itA - 1e-4);
  const itme = { a: itA, b: itB, p: [c0.zoom, c0.cx, c0.cy], q: [1.33, 537, 986] };

  // n1 son repliktir (cevapsız kesim): altyazısı "Buldum!"a kadar ekranda kalsın
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.3 } : l) };

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'notr', head: { tilt: -6, look: [-0.8, 0.3] }, ...POZ.dur });
  const hik = [
    [tm.yedi - 0.15, { expr: 'saskin', head: { tilt: -3, look: [-0.7, 0.4] } }, 0.25],
    [tm.cik + 0.2, { expr: 'kizgin', head: { tilt: 4, look: [0.1, 0.1] } }, 0.35],
    [tm.bombos - 0.1, { expr: 'saskin', head: { tilt: -5, look: [0.0, 0.0] } }, 0.3],
    [tm.h2a - 0.1, { expr: 'notr', head: { tilt: 5, look: [0.85, 0.25] } }, 0.01],
    [tm.h2b - 0.1, { expr: 'notr', head: { tilt: 6, look: [0.95, 0.15] } }, 0.3],
    [tm.dYedi + 0.2, { expr: 'notr', head: { tilt: 7, look: [0.9, 0.1] } }, 0.25],
    [tm.h3 - 0.1, { expr: 'notr', head: { tilt: 2, look: [0.3, 0.1] } }, 0.01],
    [tm.gozuyle - 0.1, { head: { tilt: 5, look: [0.75, 0.2] } }, 0.3],
    [tm.obur - 0.1, { head: { tilt: 6, look: [0.95, 0.05] } }, 0.3],
    [tm.h3b - 0.05, { expr: 'notr', head: { tilt: -2, look: [0.1, 0.05] } }, 0.3],
    [tm.h4 - 0.1, { expr: 'notr', head: { tilt: 4, look: [0.8, 0.2] } }, 0.01],
    [tm.suclu - 0.1, { head: { tilt: 6, look: [0.95, 0.05] } }, 0.25],
    [tm.koy, { expr: 'yorgun', head: { tilt: -5, look: [-0.75, 0.5] } }, 0.3],
    [tm.cozulmez - 0.2, { expr: 'yorgun', head: { tilt: 2, look: [0.2, 0.1] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: 3, look: [0.4, -0.3] } }, 0.35],
    [tm.s(1.6), { head: { tilt: 5, look: [0.55, -0.6] } }, 0.4],
    [tm.s(3.4), { head: { tilt: 7, look: [0.95, -0.5] } }, 0.4],
    [tm.s(5.4), { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: -6, look: [0.2, -0.4] } }, 0.4],
    [tm.s(8.2), { expr: 'saskin', armR: POZ.dur.armR, head: { tilt: 4, look: [0.85, 0.1] } }, 0.35],
    [tm.n1 - 0.1, { expr: 'notr', head: { tilt: 5, look: [0.8, 0.15] } }, 0.01],
    [tm.cevap, { expr: 'saskin', head: { tilt: 5, look: [0.9, 0.1] } }, 0.01],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'notr', head: { tilt: -5, look: [-0.8, 0.2] }, ...POZ.dur });
  const nec = [
    [tm.h2a - 0.1, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.15] } }, 0.01],
    [tm.n0 - 0.05, { expr: 'notr', head: { tilt: 3, look: [-0.5, 0.1] } }, 0.3],
    [tm.nDefne - 0.15, { head: { tilt: 5, look: [0.8, 0.1] } }, 0.3],
    [tm.h2b, { head: { tilt: -3, look: [-0.7, 0.2] } }, 0.35],
    [tm.dKerem - 0.1, { expr: 'notr', head: { tilt: 5, look: [0.85, 0.05] } }, 0.25],
    [tm.h3 - 0.1, { expr: 'notr', head: { tilt: -4, look: [-0.8, 0.2] } }, 0.01],
    [tm.suclu, { expr: 'kizgin', head: { tilt: 4, look: [0.85, 0.1] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: 4, look: [0.8, 0.1] } }, 0.35],
    [tm.s(2.4), { expr: IFADE.dusun, ...POZ.belde, head: { tilt: -5, look: [-0.3, -0.5] } }, 0.4],
    [tm.s(6.0), { head: { tilt: 5, look: [0.4, -0.7] } }, 0.4],
    [tm.s(8.6), { expr: 'notr', armL: POZ.dur.armL, head: { tilt: -3, look: [0.1, 0.0] } }, 0.35],
    [tm.n1 - 0.1, { expr: 'notr', armL: POZ.dur.armL, head: { tilt: -3, look: [0.05, 0.05] } }, 0.01],
    [tm.ned1, { head: { tilt: -6, look: [-0.4, -0.6] } }, 0.3],
    [tm.nasil, { head: { tilt: 6, look: [0.6, -0.6] } }, 0.3],
    [tm.bakin - 0.05, { expr: 'mutlu', head: { tilt: 2, look: [0.0, 0.0] } }, 0.3],
    [tm.cevap, { expr: 'saskin', head: { tilt: 4, look: [0.8, 0.1] } }, 0.01],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'notr', head: { tilt: 4, look: [-0.8, 0.25] }, ...POZ.dur });
  const def = [
    [tm.yedi, { expr: 'saskin', head: { tilt: 5, look: [-0.85, 0.3] } }, 0.3],
    [tm.h2a - 0.1, { expr: 'notr', head: { tilt: 4, look: [-0.8, 0.2] } }, 0.01],
    [tm.nDefne + 0.1, { expr: 'kizgin', head: { tilt: -4, look: [-0.85, 0.1] } }, 0.25],
    [tm.h2b + 0.4, { expr: 'notr', head: { tilt: 4, look: [-0.9, 0.2] } }, 0.3],
    [tm.d1 - 0.05, { expr: 'notr', head: { tilt: -3, look: [-0.3, 0.1] } }, 0.3],
    [tm.h3 - 0.1, { expr: 'notr', head: { tilt: 4, look: [-0.85, 0.2] } }, 0.01],
    [tm.suclu, { expr: 'kizgin', head: { tilt: -4, look: [-0.85, 0.1] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: -4, look: [-0.8, 0.1] } }, 0.35],
    [tm.s(1.2), { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 5, look: [-0.3, -0.6] } }, 0.4],
    [tm.s(4.6), { head: { tilt: -5, look: [-0.75, -0.5] } }, 0.4],
    [tm.s(7.2), { expr: 'saskin', armR: POZ.dur.armR, head: { tilt: 3, look: [-0.5, 0.1] } }, 0.35],
    [tm.n1 - 0.1, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.85, 0.15] } }, 0.01],
    [tm.nasil, { head: { tilt: -4, look: [-0.2, -0.6] } }, 0.35],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.7, 0.1] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.3, 0.3] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  return { tm, film, itme, tlA, hikBase, hik, necBase, nec, defBase, def };
}

// ═══════════════════════════ Durumlar (bütün sahneler aynı fonksiyonları okur) ═══════════════════════════
const kapakAt = (S, t) => ease.state(seg(t, S.tm.kapak, 1.0));
// Tepsi: { p, e, tutulu, icinde }
function tepsiAt(S, t) {
  const { tm } = S;
  if (t < tm.cik) return { p: TEPSI_RAF, e: 0, k: 0.92, tutulu: false, icinde: true };
  if (t < tm.koy) {
    const cik = H.tasi(t, tm.cik, 0.45, TEPSI_RAF, TEPSI_EL, 40, ease.enter);
    const g = pIn(t, tm.bombos - 0.35, tm.h2a - 0.35, 0.4);
    return { p: kar(cik, TEPSI_GOSTER, g), e: 0.25 + 0.75 * g, k: 0.92, tutulu: true, icinde: false };
  }
  const u = seg(t, tm.koy, 0.7);
  if (u < 1) return { p: H.tasi(t, tm.koy, 0.7, TEPSI_EL, TEPSI_RAF, 50), e: 0.25 * (1 - u), k: 0.92, tutulu: true, icinde: false, ic: u > 0.55 };
  return { p: TEPSI_RAF, e: 0, k: 0.92, tutulu: false, icinde: true };
}
// Balon açılışı (yay 320/30)
const balA = (t, a) => t < a ? 0 : Math.min(1, H.spring(t - a, H.UI[0], H.UI[1]));

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA || tl, S, {
  split: { h3: 5 },
  kartSon: -1,
  kuyruksuz: (t, B) => B.sc.id === 'sayac',
  // sayaç ve ipucu: doğrusal itme (zoom log uzayında), iki balon arasında soldan sağa kayar; Kerem'in camına gitmez
  kamera(cam, t, B) {
    if (B.sc.id !== 'sayac' && B.sc.id !== 'ipucu') return;
    const { a, b, p, q } = S.itme, v = clamp01((t - a) / (b - a));
    Object.assign(cam, { zoom: Math.exp(lerp(Math.log(p[0]), Math.log(q[0]), v)), cx: lerp(p[1], q[1], v), cy: lerp(p[2], q[2], v) });
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (bu bölüme özel): balonlar yüzlerin üstünde okunur kalsın diye alt bantta durur ve perde yoktur.
// Daire solda (dolabın önü), başlık ve paylaşım hapı sağında. Sahne arkada oynamaya devam eder.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.3 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.25), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 196, y = 1300, r = 100;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(10, 12, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 30, 84, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(608, 1246); ctx.scale(inU * out, inU * out);
  ctx.font = '900 60px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 70;
  K.rect(-bw / 2 + 8, -44 + 10, bw, 88, INK, 0, 44); K.rect(-bw / 2, -44, bw, 88, PAL.mustard, LW, 44);
  K.text('SEN DE DÜŞÜN!', 0, 21, 60, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(608, 1358); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 60;
    K.rect(-sw / 2 + 8, -40 + 10, sw, 80, INK, 0, 40); K.rect(-sw / 2, -40, sw, 80, PAL.coral, LW, 40); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  const kap = kapakAt(S, t), tp = tepsiAt(S, t);
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz, durum: { dolap: kap, tepsiIcinde: tp.icinde } });
  if (!tp.icinde && tp.ic) tepsi(K, tp.p[0], tp.p[1], { e: tp.e, k: tp.k });   // rafa girerken kapağın içinde
  dolapKapak(K, kap);
  kulpCiz(K, kap);

  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  if (id === 'sayac') { H.glance(np, t, tm.cd - 0.2, 9.6); }
  H.omuzSilk(hp, t, tm.cozulmez - 0.1, 0.5);

  // ——— Hikmet: kapağı açar (sol el kulpta), tepsiyi alır, gösterir; h2a'da Necmi'yi, h2b'de Defne'yi gösterir;
  //     h3'te bir parmak, h3b'de parmak sallar; h4'te tepsiyi rafa koyar, omuz silker ———
  const ho = { heads };
  let hParmak = 0, hIs = null;
  const elKulp = 1 - W(t, tm.al, 0.28);
  if (t < tm.cik) {
    const hedef = kar(kulp(kap), [TEPSI_RAF[0] + 70, TEPSI_RAF[1] - 26], W(t, tm.al, 0.28));
    ho.L = [hedef, 1, 'A'];
  } else if (tp.tutulu) ho.L = [[tp.p[0] + 64, tp.p[1] - 22], 1, 'A'];
  else if (t < tm.koy + 1.0) ho.L = [[TEPSI_RAF[0] + 70, TEPSI_RAF[1] - 26], 1 - W(t, tm.koy + 0.72, 0.3), 'A'];
  const wN = pIn(t, tm.gordun - 0.3, tm.n0 + 0.2, 0.28);
  if (wN > 0.01) { ho.R = [[HIK_X + 150, 1150], wN, 'A']; if (wN > 0.5) hIs = [NEC_X - 70, 1120]; }
  const wD = pIn(t, tm.h2b + 0.1, tm.d1 + 0.2, 0.28);
  if (wD > 0.01) { ho.R = [[HIK_X + 160, 1140], wD, 'A']; if (wD > 0.5) hIs = [DEF_X - 120, 1080]; }
  const w1 = pIn(t, tm.h3 - 0.05, tm.obur + 0.6, 0.28);
  if (w1 > 0.01) { ho.R = [[HIK_X + 92, 1030], w1, 'A']; if (w1 > 0.5) hParmak = clamp01((t - tm.h3 - 0.1) / 0.2); }
  const wI = pIn(t, tm.h3b - 0.1, tm.h3b + 1.5, 0.28);
  if (wI > 0.01) { const s = Math.sin((t - tm.yanlis) * 2 * Math.PI * 2.4) * 18 * clamp01((t - tm.yanlis + 0.2) / 0.2) * (t < tm.h3b + 1.2 ? 1 : 0); ho.R = [[HIK_X + 100 + s, 990], wI, 'A']; if (wI > 0.5) hParmak = 1; }

  // ——— Necmi: n0'da Defne'yi gösterir; n1'de iki balonu sırayla gösterir ———
  const no = { heads };
  let nIs = null;
  const wn0 = pIn(t, tm.nDefne - 0.28, tm.h2b - 0.1, 0.28);
  if (wn0 > 0.01) { no.R = [[NEC_X + 150, 1140], wn0, 'A']; if (wn0 > 0.5) nIs = ['R', [DEF_X - 80, 1110]]; }
  // n1: Necmi elle göstermez (kollar Defne'nin yüzüne biniyordu); bakışı sırayla iki balona gider (pozlarda)

  // ——— Defne: d1'de sağı (Kerem'in masasını) gösterir ———
  const dO = { heads };
  let dIs = null;
  const wd = pIn(t, tm.dKerem - 0.28, tm.h3 - 0.15, 0.28);
  if (wd > 0.01 && id !== 'buldum') { dO.R = [[DEF_X + 150, 1120], wd, 'A']; if (wd > 0.5) dIs = [KER_X - 30, 1070]; }
  if (id === 'cevap') {
    const a = pIn(t, tm.goren - 0.25, tm.duyan - 0.1, 0.25), b = pIn(t, tm.duyan - 0.1, tm.ben + 0.5, 0.25);
    if (a > 0.01) { dO.L = [[DEF_X - 110, 960], a, 'B']; if (a > 0.5) dIs = [BAL_D[0] - 60, BAL_D[1] + 48]; }
    if (b > 0.01) { dO.L = [[DEF_X - 170, 980], b, 'B']; if (b > 0.5) dIs = [BAL_N[0] + 110, BAL_N[1] + 50]; }
  }

  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  const nc = oyna(K, t, tl, 'necmi', np, no);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  tezgahCiz(K, t);
  if (!tp.icinde && !tp.ic) tepsi(K, tp.p[0], tp.p[1], { e: tp.e, k: tp.k });
  if (ho.L && (t < tm.al + 0.2 || tp.tutulu || t < tm.koy + 0.8)) hc.tut('L');
  if (hIs) hc.isaret('R', hIs);
  if (hParmak > 0) hc.parmak('R', hParmak, { toplam: 1, ac: 0.2 });
  if (nIs) nc.isaret(nIs[0], nIs[1]);
  if (dIs) dc.isaret(dO.L && id === 'cevap' ? 'L' : 'R', dIs);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });

  // ——— balonlar: sözler ekranda asılı kalır (iki balon aynı biçimde; ek vurgusu yok) ———
  const nH = H.eklem('necmi', np, 'head'), dH = H.eklem('defne', dp, 'head');
  balon(K, BAL_N, [nH[0] - 10, nH[1] - 128], 'Defne yemiş.', balA(t, tm.balN));
  if (id !== 'buldum') balon(K, BAL_D, [dH[0] + 6, dH[1] - 126], 'Kerem yedi.', balA(t, tm.balD));
}
