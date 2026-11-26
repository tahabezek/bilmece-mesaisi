// Bölüm 81 · TAVLA KARNESİ (v4 "hikâye" dili, cevapsız tasarım, kısa format; storyboard: hikayeler/bolum_081_v5.md).
// Kaynak: Putnam 2004 A1. Mekanizma: oran %75'in altından üstüne çıkarken tam %75'e basar (cevap arşivde kalır, kesilir).
// Logline: Kahvede Kerem her tavla maçından sonra duvardaki kara tahtaya Hikmet Bey'in ilk maçından beri toplam galibiyet
// oranını yazıyor. Ocakta oran %75'in altında, aralıkta üstünde. Necmi: "Bir ara tam %75 olmuş." Defne: "Atlamış olabilir."
// Akılda kalacak tek şey: yüzde, tek maçta ne kadar sıçrayabilir?
// Sızıntı yasağı: tahtada "%75,0" hiçbir karede yazılmaz; zaman atlamasındaki ara değerler okunmayacak hızda (her karede)
// değişir ve %74,8–%75,2 aralığındaki hiçbir değer gösterilmez. Galibiyet ve yenilgi sayıları hiçbir yerde yok. Kimse
// "kaça kaç" sorusunu parmakla göstermez. Cevap olan kişi (Necmi) tek başına ısrarlı plan almaz: Necmi'nin ve Defne'nin
// birer yakın planı var, ipucu ikili planda söylenir.
// Yerleşim (dünya, soldan sağa): pencere · kara tahta (sağ üst köşesine koparmalı takvim asılı) · Kerem (ayakta, sol
// eliyle yazar) · tavla masası: Hikmet (solda) ve Necmi (sağda) oturur, önden; aralarında masaya yatık açık tavla; Hikmet'in
// başının üstünde demlikli raf · Defne (ayakta, masanın sağ ucunda).
// Yakın planlarda yalnız plânın kişisi çizilir (kenarda yarım yüz ya da kartın altında kalan yüz olmasın; 074/076 yöntemi).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const KAHVE = 'b081_kahve';
const DUVAR_DIP = 1440;                              // arka duvarın zemine değdiği çizgi
const ON = 0.9, SH_Y = 1262;                         // oturanların ölçeği ve omuz yüksekliği
const KER_X = 884, KER_Y = 1440, KER_S = 232 * 0.92; // Kerem: tahtanın sağında, duvar dibinde (sol eliyle yazar)
const DEF_X = 1745, DEF_Y = 1452, DEF_S = 245 * 0.88;
const HIK_X = 1060, NEC_X = 1460;
const YB = 1318, YF = 1412, TX = [930, 1610];        // masa üstü: arka ve ön kenar; sol ve sağ kenar
const TAHTA = { x0: 330, x1: 760, y0: 772, y1: 994 };
const TAKVIM = { x0: 616, x1: 750, y0: 784, y1: 892 };
const BASLIK = [468, 836], SAYI = [540, 938];        // tahtadaki başlık ve oranın orta noktaları
const PENCERE = { x: 150, y: 790, w: 140, h: 196 };
const TAVLA = [1260, 1366];                            // masaya yatık açık tavlanın ortası
const CAY_H = [990, 1392], CAY_N = [1535, 1392];
// Kadrajlar [zoom, cx, cy]
const GENIS = [1.12, 764, 1152];                      // tahta + Kerem + Hikmet (Necmi ve Defne kadraj dışında)
const TAHTA_K = [1.2, 566, 1110];                     // zaman atlaması: pencere + tahta (takvim) + Kerem
const IKILI = [1.55, 1602, 1110];                      // Necmi + Defne (tahta kadraj dışında)
const NECMI = [1.7, 1462, 1244];
const DEFNE = [1.6, 1752, 1112];
const HIKMET = [1.6, 1136, 1238];                     // takvim ve tahta kadraj dışında

const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.14, open: 0, w: 1 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.98, pupil: 1, curve: 0.62, open: 0, w: 1.1 },
  kurum: { brow: 0.06, browTilt: -0.12, eye: 0.85, pupil: 1, curve: 0.5, open: 0, w: 1.05 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.15, pupil: 0.85, curve: 0.08, open: 0, w: 0.8 },
  emin: { brow: 0.04, browTilt: 0.06, eye: 0.95, pupil: 1, curve: 0.28, open: 0, w: 1 },
  supheK: { brow: -0.01, browTilt: 0.24, eye: 0.85, pupil: 1, curve: 0.08, open: 0, w: 0.95 },
  dusun: { ...H.IFADE.dusun2, open: 0 },
  dusunA: { brow: 0.07, browTilt: -0.06, eye: 1, pupil: 1, curve: 0.04, open: 0, w: 0.85 },
  saskinK: { brow: 0.1, browTilt: -0.04, eye: 1.2, pupil: 0.78, curve: 0.04, open: 0, w: 0.9 },
};
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Oranın yılı (sabit, tohumlu) ═══════════════════════════
// Ocak: 47 galibiyet, 16 yenilgi (%74,6). Yıl boyunca 120 maç: önce 30 maçta 18–12 (oran düşer), sonra 78 maçta 62–16
// (oran kasıma kadar yavaşça %74'e çıkar, %75'in altında kalır), aralıkta son 12 maçta 11–1: %75'in üstü.
// Aralık: 138 galibiyet, 45 yenilgi (%75,4). Sayılar ekrana hiç yazılmaz; yalnız oran yazılır.
const fmt = (g, y) => (Math.round(1000 * g / (g + y)) / 10).toFixed(1).replace('.', ',');
const YIL = (() => {
  const r = H.mulberry32(81), karis = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sonuc = [...karis([...Array(18).fill(1), ...Array(12).fill(0)]), ...karis([...Array(62).fill(1), ...Array(16).fill(0)]), ...karis([...Array(11).fill(1), ...Array(1).fill(0)])];
  let g = 47, y = 16; const v = [fmt(g, y)];
  for (const s of sonuc) { if (s) g++; else y++; v.push(fmt(g, y)); }
  return v;
})();
const OCAK = YIL[0], ARALIK = YIL[YIL.length - 1], KASIM_SON = 108;   // ilk 108 maç ocak–kasım, son 12 maç aralık
const YASAK = new Set(['74,7', '74,8', '74,9', '75,0', '75,1', '75,2', '75,3']);   // %75'e yakın ara değer hiç gösterilmez
if (OCAK !== '74,6' || ARALIK !== '75,4') console.error('b081: yılın uçları tutmuyor', OCAK, ARALIK);
const AYLAR = ['ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'];

// ═══════════════════════════ Nesneler ═══════════════════════════
const TEBESIR = '#F2EFE4';
// Kara tahta: ahşap çerçeve, yeşil yüz, tebeşir oluğu; başlık ve oran. d = { deger, yaz (0..1 soldan sağa görünen kısım), cizgi }
function tahta(K, d) {
  const { x0, x1, y0, y1 } = TAHTA, { ctx } = K;
  K.rect(x0 - 16 + 8, y0 - 16 + 10, x1 - x0 + 32, y1 - y0 + 32, INK, 0, 10);
  K.rect(x0 - 16, y0 - 16, x1 - x0 + 32, y1 - y0 + 32, '#8A5A33', LW, 10);
  K.rect(x0, y0, x1 - x0, y1 - y0, '#2F4A3A', LW * 0.6, 4);
  ctx.save(); ctx.globalAlpha = 0.12; for (const [a, b, c] of [[0.1, 0.32, 0.2], [0.5, 0.86, 0.12], [0.2, 0.6, 0.82]]) K.line(lerp(x0, x1, a), lerp(y0, y1, c), lerp(x0, x1, b), lerp(y0, y1, c) + 6, 14, TEBESIR); ctx.restore();   // eski silinti izleri
  K.rect(x0 - 10, y1 + 14, x1 - x0 + 20, 14, '#6E4527', LW * 0.7, 4);   // tebeşir oluğu
  K.rect(x0 + 40, y1 + 6, 34, 9, TEBESIR, 2, 3); K.rect(x1 - 96, y1 + 2, 54, 14, '#3A2A20', LW * 0.5, 4);
  ctx.font = '800 44px Rubik';
  K.text(K.up('Hikmet Bey'), BASLIK[0], BASLIK[1] + 16, 44, TEBESIR, 800);
  K.line(BASLIK[0] - 128, BASLIK[1] + 32, BASLIK[0] + 128, BASLIK[1] + 32, 4, 'rgba(242,239,228,0.7)');
  if (d.deger && d.yaz > 0) {
    const s = d.metin ?? '%' + d.deger;
    ctx.font = '800 100px Rubik'; const w = ctx.measureText(s).width;
    ctx.save(); ctx.beginPath(); ctx.rect(SAYI[0] - w / 2 - 8, SAYI[1] - 80, (w + 16) * clamp01(d.yaz), 160); ctx.clip();
    K.text(s, SAYI[0], SAYI[1] + 36, 100, TEBESIR, 800);
    ctx.restore();
  }
  if (d.cizgi > 0) K.line(SAYI[0] - 150, SAYI[1] + 50, SAYI[0] - 150 + 300 * d.cizgi, SAYI[1] + 50 - 4 * d.cizgi, 5, TEBESIR);
}
// Koparmalı takvim (tahtanın sağ üst köşesine çivili): kırmızı başlık, yaprakta ayın adı. a: ay (0..11), kop: kopan yaprak (0..1)
function takvim(K, ay, kop) {
  const { x0, x1, y0, y1 } = TAKVIM, { ctx } = K;
  K.circ((x0 + x1) / 2, y0 - 6, 6, '#8E9A93', 2.5);
  K.rect(x0 + 6, y0 + 8, x1 - x0, y1 - y0, INK, 0, 6);
  K.rect(x0, y0, x1 - x0, y1 - y0, PAL.paper, LW * 0.7, 6);
  K.rect(x0, y0, x1 - x0, 28, PAL.coral, LW * 0.7, 6);
  for (const dx of [0.3, 0.7]) K.circ(lerp(x0, x1, dx), y0 + 4, 5, '#C9CED1', 2);
  const ad = (s, x, y) => {
    const S = K.up(s); ctx.font = '800 38px Rubik'; const k = Math.min(1, (x1 - x0 - 14) / ctx.measureText(S).width);
    K.text(S, x, y, Math.floor(38 * k), INK, 800);
  };
  ad(AYLAR[ay], (x0 + x1) / 2, y0 + 82);
  if (kop > 0 && kop < 1 && ay > 0) {                 // önceki ayın yaprağı (adıyla) kopup sağa aşağı uçar
    const u = ease.exit(kop), cx = (x0 + x1) / 2 + 90 * u, cy = (y0 + 28 + y1) / 2 + 130 * u * u;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(0.9 * u); ctx.globalAlpha = 1 - u;
    K.rect(-(x1 - x0) / 2, -(y1 - y0 - 28) / 2, x1 - x0, y1 - y0 - 28, PAL.paper, LW * 0.6, 4);
    ad(AYLAR[ay - 1], 0, 82 - ((y0 + 28 + y1) / 2 - y0));
    ctx.restore();
  }
}
// Pencere: mevsim (0 kış, 1 yaz); kar döngüsü; dışarıda bir dal (kışın çıplak, yazın yapraklı)
function pencere(K, t, mev) {
  const { x, y, w, h } = PENCERE, { ctx } = K;
  K.rect(x - 14, y - 14, w + 28, h + 28, '#E9DCC2', LW);
  K.rect(x, y, w, h, H.mixHex('#C9D3D2', '#9FD0E6', mev), LW * 0.5);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (mev > 0.3) K.circ(x + w * 0.72, y + h * 0.26, 26, '#F6E3BC', 0);
  K.poly([[x - 10, y + h], [x + w * 0.4, y + h * 0.78], [x + w + 10, y + h * 0.86], [x + w + 10, y + h]], H.mixHex('#E7EDEE', '#7FA65A', mev), 0);   // uzak tepe (kar / çimen)
  const dal = [[x + w + 8, y + h * 0.36], [x + w * 0.52, y + h * 0.46]];
  K.line(dal[0][0], dal[0][1], dal[1][0], dal[1][1], 9, '#4E3A2A'); K.line(x + w * 0.7, y + h * 0.42, x + w * 0.56, y + h * 0.3, 6, '#4E3A2A');
  for (let i = 0; i < 6; i++) { const p = H.along(dal, 0.15 + i * 0.15); H.yaprak(K, p[0], p[1], 26, -1.2 + (i % 3) * 0.9, PAL.green, mev); }
  const kar = 1 - mev;
  if (kar > 0.05) {
    ctx.globalAlpha = kar;
    for (let i = 0; i < 14; i++) {
      const fx = x + ((i * 53.7) % w), sp = 46 + (i % 4) * 9, fy = y + ((i * 37.1 + t * sp) % (h + 20)) - 10;
      K.circ(fx + 6 * Math.sin(t * 1.4 + i), fy, 3.6 + (i % 3), '#FFFFFF', 0);
    }
    K.rect(x + w * 0.5, y + h * 0.36 - 7, w * 0.5, 7, '#FFFFFF', 0, 3);   // dalın üstünde kar
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  K.line(x + w / 2, y, x + w / 2, y + h, 8, '#E9DCC2'); K.line(x, y + h * 0.45, x + w, y + h * 0.45, 8, '#E9DCC2');
  K.rect(x - 22, y + h + 8, w + 44, 14, '#E9DCC2', LW * 0.7, 4);
}
// Tebeşir (elde): elin üstünde kısa beyaz çubuk
function tebesir(K, el, a = -0.6) {
  const { ctx } = K; ctx.save(); ctx.translate(el[0], el[1]); ctx.rotate(a);
  K.rect(-6, -30, 12, 34, TEBESIR, 3, 3); ctx.restore();
}
// Çay bardağı (önden): (x, yb) tabağın ortası
function bardak(K, [x, yb], k = 1) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 0, 25, 6, PAL.cream, 2.5);
  const yol = [[-12, -42], [12, -42], [7, -23], [12, -8], [9, -2], [-9, -2], [-12, -8], [-7, -23]];
  K.poly(yol, '#F3EEE4', 2.5);
  ctx.save(); K.path([[-10.5, -35], [10.5, -35], [6.4, -23], [10.6, -8], [8, -3.5], [-8, -3.5], [-10.6, -8], [-6.4, -23]]); ctx.clip();
  ctx.fillStyle = '#A8401F'; ctx.fillRect(-14, -35, 28, 40); K.line(-12, -35, 12, -35, 2.5, '#C9603A'); ctx.restore();
  K.poly(yol, null, 2.5);
  ctx.restore();
}
// Açık tavla, masaya yatık (perspektif): iki yarı, haneler sağ ve sol kenardan içe; menteşe ortada (yatay).
// pul: [[x, y, renk]] dünya noktaları (taban üstünde); zar: [{ p, n, a }]
const TW0 = 300, TW1 = 344, TD = 78;                 // arka kenar eni, ön kenar eni, derinlik
const tavlaY0 = TAVLA[1] - TD / 2, tavlaY1 = TAVLA[1] + TD / 2;
const tavlaX = (v, u) => lerp(TAVLA[0] - lerp(TW0, TW1, v) / 2, TAVLA[0] + lerp(TW0, TW1, v) / 2, u);   // v: derinlik (0 arka), u: en (0 sol)
function tavla(K, pullar, zarlar) {
  const P = (u, v) => [tavlaX(v, u), lerp(tavlaY0, tavlaY1, v)];
  K.poly([P(-0.03, -0.12), P(1.03, -0.12), P(1.03, 1.1), P(-0.03, 1.1)], '#7A4A26', LW);
  K.poly([P(0.01, 0), P(0.99, 0), P(0.99, 1), P(0.01, 1)], '#E6D3AA', LW * 0.4);
  for (const v0 of [0, 0.52]) for (let i = 0; i < 6; i++) {   // her yarıda soldan ve sağdan altışar hane
    const va = v0 + 0.02 + i * 0.077, vb = va + 0.077, vm = (va + vb) / 2;
    K.poly([P(0.02, va), P(0.02, vb), P(0.4, vm)], i % 2 ? '#2E3B38' : '#B5532A', 1.5);
    K.poly([P(0.98, va), P(0.98, vb), P(0.6, vm)], i % 2 ? '#B5532A' : '#2E3B38', 1.5);
  }
  const m0 = P(0, 0.5), m1 = P(1, 0.5); K.line(m0[0], m0[1], m1[0], m1[1], 7, '#7A4A26');
  for (const [x, y, r] of pullar) K.ell(x, y, 12, 5.2, r ? '#3A2A20' : PAL.paper, 2.5);
  for (const z of zarlar) zar(K, z.p[0], z.p[1], z.n, z.a || 0, z.k || 1);
}
function zar(K, x, y, n, a = 0, k = 1) {
  const { ctx } = K, s = 18 * k;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-s / 2, -s / 2, s, s, PAL.paper, 2.5 * k, 4 * k);
  const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[n];
  for (const [px, py] of P) K.circ(px * s * 0.26, py * s * 0.26, 2.1 * k, INK, 0);
  ctx.restore();
}
// Pulların dizilişi: tohumlu (aynı tohum → aynı diziliş). Her pul [u, v, renk]; u 0..1 en, v 0..1 derinlik
function pulDizisi(tohum) {
  const r = H.mulberry32(tohum), o = [];
  for (let i = 0; i < 14; i++) {
    const sag = r() < 0.5, hane = Math.floor(r() * 12), v = (hane < 6 ? 0.02 : 0.54) + (hane % 6) * 0.077 + 0.038;
    const yig = 1 + Math.floor(r() * 3);
    for (let j = 0; j < yig; j++) o.push([sag ? 0.93 - j * 0.07 : 0.07 + j * 0.07, v, i % 2]);
  }
  return o;
}
const pulYer = ([u, v, r]) => [tavlaX(v, u), lerp(tavlaY0, tavlaY1, v), r];
// Masa (önden): üst yüz (YB..YF), önü kilim desenli örtü
function masa(K) {
  const [x0, x1] = TX;
  K.poly([[x0 + 16, YB], [x1 - 16, YB], [x1, YF], [x0, YF]], PAL.woodTop, LW);
  for (const [y, a, b] of [[YB + 22, 0.06, 0.2], [YB + 70, 0.8, 0.95]]) K.line(lerp(x0, x1, a), y, lerp(x0, x1, b), y, 3, '#B07A44');
  K.rect(x0 - 6, YF - 2, x1 - x0 + 12, 20, PAL.wood, LW, 6);
  K.rect(x0 + 4, YF + 16, x1 - x0 - 8, 1490 - YF - 16, '#9C3B33', LW * 0.8, 6);
  K.line(x0 + 14, YF + 34, x1 - 14, YF + 34, 6, PAL.mustard);
  for (let x = x0 + 40; x < x1 - 30; x += 64) K.poly([[x, YF + 58], [x + 20, YF + 44], [x + 40, YF + 58], [x + 20, YF + 72]], '#E9C46A', 2.5);
}
// Ön zemin: karo ve halı
function on(K) {
  K.rect(-600, 1490, 2800, 520, '#7F3B33', 0); K.line(-600, 1490, 2200, 1490, LW, INK); K.rect(-600, 1508, 2800, 12, PAL.mustard, 0);
  for (let x = -560; x < 2200; x += 150) K.poly([[x, 1620], [x + 36, 1580], [x + 72, 1620], [x + 36, 1660]], '#A3524A', 3);
}

// ═══════════════════════════ Mekân: kahvehane ═══════════════════════════
M.mekanEkle(KAHVE, {
  gen: [-600, 2200], zemin: DUVAR_DIP, dongu: ['pencerede kar', 'çay buharı'],
  capa: { tahta: SAYI, tavla: TAVLA }, kadraj: { genis: GENIS, ikili: IKILI },
  arka(K, t, { durum }) {
    // duvar: sıcak krem; altta ahşap lambri; tavana yakın raf (kart altında kalır)
    K.rect(-700, -400, 3000, DUVAR_DIP + 400, '#D9BE8C', 0);
    K.rect(-700, 1176, 3000, DUVAR_DIP - 1176, '#8A5A35', 0); K.line(-700, 1176, 2300, 1176, LW, INK);
    K.rect(-700, 1162, 3000, 16, '#A9733F', LW * 0.6);
    for (let x = -640; x < 2300; x += 120) K.line(x, 1196, x, DUVAR_DIP - 12, 4, '#6E4527');
    K.rect(-700, DUVAR_DIP, 3000, 120, '#B8925E', 0); K.line(-700, DUVAR_DIP, 2300, DUVAR_DIP, LW, INK);
    // Hikmet'in başının üstünde duvar rafı: demlik (buhar döngüsü) ve iki boş bardak
    if (durum.buhar !== false) {                       // Hikmet'in yakın planında raf kartın kenarında kalır: hiç çizilmez
    K.rect(950, 902, 190, 16, '#A9733F', LW * 0.7, 4); K.line(970, 918, 990, 948, 6, '#6E4527'); K.line(1120, 918, 1100, 948, 6, '#6E4527');
    K.rect(985, 848, 64, 54, PAL.metal, LW * 0.8, 12); K.rect(1001, 834, 32, 18, '#B9C6BB', LW * 0.6, 6);
    K.poly([[985, 866], [958, 852], [954, 860], [985, 884]], PAL.metal, LW * 0.6);
    if (durum.buhar !== false) H.buhar(K, 956, 846, t, { k: 0.4, n: 2, ara: 12, boy: 62 });   // Hikmet'in yakın planında demlik kartın altında: buhar yok
    for (const x of [1078, 1110]) K.poly([[x - 9, 872], [x + 9, 872], [x + 6, 886], [x + 9, 900], [x - 9, 900], [x - 6, 886]], '#F3EEE4', 2.5);
    }
    // Defne'nin sağında çerçeveli manzara (yazısız)
    K.rect(1870, 840, 180, 140, '#8A5A33', LW, 6); K.rect(1884, 854, 152, 112, '#9FC3C9', 2, 2);
    K.poly([[1884, 966], [1930, 900], [1980, 940], [2036, 890], [2036, 966]], '#5E8C6A', 2);
    pencere(K, t, durum.mev);
    tahta(K, durum.tahta);
    takvim(K, durum.ay, durum.kop);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
    h1: T('h1'), kerem: T('h1:3'), toplam: T('h1:7'), tahtaya: T('h1:10'), h1s: T('h1>'),
    d1: T('d1'), yok: T('d1:1'), ocak: T('d1:2'), d1s: T('d1>'),
    h2: T('h2'), h2yuz: T('h2:1'), ustune: T('h2:4'), h2s: T('h2>'),
    n0: T('n0'), tam: T('n0:5'), n0s: T('n0>'),
    d2: T('d2'), sicra: T('d2:6'), d2s: T('d2>'),
    h3: T('h3'), hangi: T('h3:1'), h3s: T('h3>'),
    n1: T('n1'), kaca: T('n1:3'), once: T('n1:6'), n1s: T('n1>'),
  };
  tm.ikiliKes = tm.d1 - 0.1; tm.atlaKes = tm.d1s + 0.1; tm.necKes = tm.n0 - 0.1; tm.defKes = tm.d2 - 0.1; tm.hikKes = tm.h3 - 0.1;
  tm.sayac = cd0 - 0.05; tm.ipKes = tm.n1 - 0.12;
  tm.h2Kes = tm.h2 - 0.05; tm.atla0 = tm.atlaKes + 0.2; tm.atla1 = tm.h2Kes - 0.08;   // h2 Hikmet'in planında başlar                 // zaman atlaması (kadraj sabit, 1,2–2,2 sn)
  tm.sonYaz = tm.atla1 - 0.42;                                          // aralık değeri: silinir, sonra yazılır (kesmeden önce biter)
  const film = H.sahneler([
    { id: 'kanca', plan: 'genis', t0: 0, cam: [[0, ...GENIS], [tm.ikiliKes - 0.1, GENIS[0] + 0.01, GENIS[1], GENIS[2]]] },
    { id: 'ikili', plan: 'ikili', t0: tm.ikiliKes, cam: [[0, ...IKILI], [tm.atlaKes - 0.1, IKILI[0] + 0.02, IKILI[1], IKILI[2]]] },
    { id: 'atla', plan: 'tahta', t0: tm.atlaKes, cam: [[0, ...TAHTA_K]] },                // zaman atlaması: kadraj sabit (kamera() kilitler)
    { id: 'h2', plan: 'genis', t0: tm.h2Kes, cam: [[0, ...GENIS], [tm.necKes - 0.1, GENIS[0] + 0.01, GENIS[1], GENIS[2]]] },
    { id: 'necmi', plan: 'necmi', t0: tm.necKes, cam: [[0, ...NECMI], [tm.defKes - 0.1, NECMI[0] + 0.03, NECMI[1], NECMI[2] - 2]] },
    { id: 'defne', plan: 'defne', t0: tm.defKes, cam: [[0, ...DEFNE], [tm.hikKes - 0.1, DEFNE[0] + 0.03, DEFNE[1], DEFNE[2] - 2]] },
    { id: 'hikmet', plan: 'hikmet', t0: tm.hikKes, cam: [[0, ...HIKMET], [tm.sayac - 0.1, HIKMET[0] + 0.02, HIKMET[1], HIKMET[2]]] },
    { id: 'sayac', plan: 'genis', t0: tm.sayac, cam: [[0, ...GENIS]] },                   // doğrusal itme kamera() ile
    { id: 'ipucu', plan: 'ikili', t0: tm.ipKes, cam: [[0, ...IKILI], [tm.buldum - 0.1, IKILI[0] + 0.02, IKILI[1], IKILI[2]]] },
    { id: 'buldum', plan: 'defne', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...DEFNE]] },
    { id: 'cevap', plan: 'genis', t0: tm.cevap, cam: [[0, ...GENIS]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef|mekânda kalış/.test(w)) console.error('sahne uyarısı: ' + w);
  // Altyazı: balon kesme karesinde sönmüş olur; n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar kalır
  const kes = { h1: tm.ikiliKes, d1: tm.atlaKes, h2: tm.necKes, n0: tm.defKes, d2: tm.hikKes, h3: tm.sayac };
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: tm.buldum - 0.05 } : kes[l.id] ? { ...l, t1: Math.min(l.t1, kes[l.id] - 0.31) } : l) };
  return { tm, film, tlA };
}

// ═══════════════════════════ Durumlar ═══════════════════════════
// Tahta, takvim ve pencere: tek durum fonksiyonu
function kahveDurum(tm, t) {
  const d = { tahta: { deger: OCAK, yaz: 1, cizgi: 0 }, ay: 0, kop: 0, mev: 0 };
  if (t >= tm.atla0) {
    const u = clamp01((t - tm.atla0) / (tm.sonYaz + 0.1 - tm.atla0));   // takvim aralığa, Kerem aralık değerini yazmaya başlarken varır
    // ara değerler: her karede başka bir maçtan sonraki oran (okunmaz); %75'e yakın olanlar atlanır
    const kare = Math.floor((t - tm.atla0) * 30 + 1e-6), N = Math.max(1, Math.floor((tm.sonYaz - tm.atla0) * 30));
    let k = Math.min(KASIM_SON, 1 + Math.round(clamp01(kare / N) * (KASIM_SON - 1)));   // ara değerler ocak–kasım maçlarından
    while (k > 1 && YASAK.has(YIL[k])) k--;
    d.tahta.deger = YIL[k]; d.tahta.yaz = 1;
    // aralık: Kerem tahtayı siler (3 kare boş), sonra "%75,4"ü yazar; ara adımlar "%" ve "%7" (yarım "%75" hiç görünmez)
    if (t >= tm.sonYaz) {
      const n = Math.floor(ease.state(seg(t, tm.sonYaz + 0.1, 0.3)) * 5.999);
      d.tahta.deger = ARALIK; d.tahta.yaz = n > 0 ? 1 : 0; d.tahta.metin = n >= 5 ? '%' + ARALIK : n >= 2 ? '%7' : '%';
    }
    const am = Math.min(11, Math.floor(u * 12 + 1e-6)), ayU = u * 12 - am;
    d.ay = am; d.kop = am > 0 && am < 11 ? clamp01(ayU / 0.6) : (am === 11 ? clamp01((u * 12 - 11) / 0.6) : 0);
    const ay = u * 11;                                // mevsim: kış (ocak–şubat) → yaz (mayıs–eylül) → kış (aralık)
    d.mev = ay < 2 ? 0 : ay < 4 ? ease.state((ay - 2) / 2) : ay < 8.5 ? 1 : ay < 10.5 ? 1 - ease.state((ay - 8.5) / 2) : 0;
  }
  return d;
}
// Zarlar: kimin elinde, nerede. Sayaçta Hikmet atar (cd0+1.2), Necmi alır ve atar (cd0+5.0), Hikmet yine alır (cd0+8.4).
const ZAR_YER = [[[TAVLA[0] - 118, TAVLA[1] + 8], 4, 0.3], [[TAVLA[0] - 86, TAVLA[1] + 2], 2, -0.4]];   // Hikmet'in yarısında (sayaç kadrajında görünür)
const ZAR_YER2 = [[[TAVLA[0] - 140, TAVLA[1] - 6], 6, -0.2], [[TAVLA[0] - 102, TAVLA[1] + 12], 3, 0.5]];
function zarAt(tm, t, elH, elN) {
  const { cd0 } = tm;
  const atis = (a, el, yer) => yer.map(([p, n, ang], i) => {
    if (t < a) return { p: [el[0] - 8 + 16 * i, el[1] - 6], n, a: ang };
    const u = clamp01((t - a) / 0.34);
    return { p: H.yay([el[0] - 8 + 16 * i, el[1] - 6], p, ease.state(u), 46), n: u < 1 ? 1 + ((i + Math.floor(u * 7)) % 6) : n, a: ang + (1 - u) * 6 };
  });
  if (t < cd0 + 0.6) return { z: ZAR_YER.map(([p, n, a]) => ({ p, n, a })) };
  if (t < cd0 + 1.2) return { z: atis(1e9, elH, ZAR_YER), H: true };                    // Hikmet avucunda sallar
  if (t < cd0 + 3.8) return { z: atis(cd0 + 1.2, elH, ZAR_YER2) };
  if (t < cd0 + 5.0) return { z: atis(1e9, elN, ZAR_YER2), N: true };                   // Necmi alır, sallar
  if (t < cd0 + 8.0) return { z: atis(cd0 + 5.0, elN, ZAR_YER) };
  if (t < cd0 + 9.6) return { z: atis(1e9, elH, ZAR_YER), H: true };
  return { z: atis(cd0 + 9.6, elH, ZAR_YER2) };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında
  drift: 0.008,
  split: { h1: 4 },
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'atla') Object.assign(cam, { zoom: TAHTA_K[0], cx: TAHTA_K[1], cy: TAHTA_K[2] });
    if (id === 'sayac') {                             // sayaç: tahtaya ve masaya doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.ipKes - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(GENIS[0]), Math.log(1.17), u)), cx: GENIS[1], cy: GENIS[2] + 4 * u });
    }
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (070/074 düzeni): perde yok; daire solda, başlık ve paylaşım hapı sağında, alt bantta.
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

// ——— Dünya ———
const sOf = key => H.BOY[key] * ON;
const omuzOf = {};
function oturan(key, x, o = {}) {
  if (omuzOf[key] === undefined) omuzOf[key] = H.shoulder(key, H.kisi(key, { x: 0, y: 0, s: sOf(key), ...POZ.dur }), 'R')[1];
  const dy = key === 'necmi' ? 10 : 0;
  return H.kisi(key, { x, y: SH_Y + dy - omuzOf[key], s: sOf(key), ...POZ.dur, ...o });
}
function sandalyeSirt(K, x) {
  K.rect(x - 98, SH_Y - 40, 22, YB - SH_Y + 46, PAL.woodDark, LW * 0.8, 6);
  K.rect(x + 76, SH_Y - 40, 22, YB - SH_Y + 46, PAL.woodDark, LW * 0.8, 6);
  K.rect(x - 104, SH_Y - 58, 208, 40, PAL.wood, LW * 0.8, 10);
}

function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, cam } = B, id = B.sc.id, plan = B.sc.plan;
  const durum = kahveDurum(tm, t); durum.buhar = plan !== 'hikmet';
  M.mekanCiz(K, KAHVE, 'arka', t, { durum });
  const atla = t >= tm.atla0 && t < tm.atla1 + 0.05;
  const hizli = atla ? (t - tm.atla0) : 0;           // zaman atlamasında hızlanan oyun (kareler arası durum yok: t'den)
  const ciz = { kerem: plan === 'genis' || plan === 'tahta', hikmet: plan === 'genis' || plan === 'hikmet', necmi: plan === 'genis' || plan === 'ikili' || plan === 'necmi', defne: plan === 'ikili' || plan === 'defne' };

  // ——— Kerem (ayakta, tahtanın sağında): kancada oranı yazmayı bitirir; atlamada hızla siler ve yazar; sayaçta tebeşirle bekler ———
  if (ciz.kerem) {
    let look = [-0.7, -0.3], expr = IF.notr;
    if (t >= 0.55) look = [0.6, 0.3];                                   // Hikmet'e bakar
    if (t >= tm.kerem - 0.1 && t < tm.kerem + 0.7) look = [0.1, 0.05];
    if (t >= tm.tahtaya) look = [-0.7, -0.3];
    if (id === 'h2') look = [0.55, 0.3];
    if (id === 'sayac') { const k = Math.floor(Math.max(0, t - tm.cd0) / 2.6) % 2; look = k ? [0.55, 0.35] : [-0.7, -0.3]; }
    if (atla || id === 'atla') look = [-0.75, -0.3];
    const kp = H.kisi(H.KEREM, { x: KER_X, y: KER_Y, s: KER_S, expr, ...POZ.dur, head: { tilt: -3, look } });
    H.onayla(kp, t, tm.kerem, 1, 0.36);
    const o = {};
    const son = [SAYI[0] + 126, SAYI[1] + 62];                         // oranın sağ ucunun altı (son rakam yeni bitti)
    let wY = id === 'kanca' ? 1 - W(t, 0.3, 0.4) : 0, hedef = son;
    if (id === 'atla') {
      wY = pIn(t, tm.atla0 - 0.2, tm.sonYaz + 0.5, 0.2);
      kp.lean = -7 * wY;
      const f = 0.5 + 0.5 * Math.sin(TAU * hizli / 0.26);
      hedef = t < tm.sonYaz + 0.1 ? [SAYI[0] + 20 + 110 * f, SAYI[1] - 10 + 20 * Math.sin(TAU * hizli / 0.13)]
        : [SAYI[0] + 10 + 115 * seg(t, tm.sonYaz + 0.1, 0.3), SAYI[1] + 8];
    }
    const elB = [KER_X - 64, 1226];                                     // bekleyiş: tebeşir bel hizasında
    const atilim = id === 'sayac' ? H.nabiz(t, tm.cd0 + 3.2, 0.5) + H.nabiz(t, tm.cd0 + 5.9, 0.5) + H.nabiz(t, tm.cd0 + 8.3, 0.5) : 0;   // tebeşiri havaya atıp tutar
    o.L = [kar(elB, hedef, wY), 1, 'A'];
    if (atilim > 0) o.L = [[elB[0], elB[1] - 20 * atilim], 1, 'A'];
    const a = oyna(K, t, null, H.KEREM, kp, o);
    tebesir(K, [a.handL[0] + 4, a.handL[1] - 30 * atilim], 0.5 - 2.2 * atilim);
    a.tut('L');
  }

  // ——— oturanlar: Hikmet (solda), Necmi (sağda) ———
  // ifadeler ve bakış
  let hE = IF.kurum, hL = [-0.45, -0.3], nE = IF.emin, nL = [-0.5, 0.15];
  if (t >= 0.6) hL = [0.2, 0.05];
  if (t >= tm.tahtaya - 0.15) hL = [0.25, -0.5];
  if (t >= tm.h1s) { hL = [0.55, 0.1]; hE = IF.notr; }                  // Defne'ye bakar
  if (t >= tm.d1) { nL = [0.6, 0]; nE = IF.notr; }
  if (atla) { hL = [0.3, 0.45]; nL = [-0.3, 0.45]; hE = IF.dusun; nE = IF.dusun; }
  if (t >= tm.atla1) { hL = [0.25, -0.5]; hE = IF.kurum; nL = [-0.35, 0.05]; nE = IF.merak; }
  if (t >= tm.ustune) hL = [0.1, -0.05];
  if (t >= tm.n0) { nE = IF.emin; nL = [-0.15, 0.02]; }
  if (t >= tm.n0s) { nE = IF.notr; nL = [0.55, 0.05]; }
  if (t >= tm.h3) { hE = IF.saskinK; hL = [0.6, 0.05]; }
  if (t >= tm.sayac) {
    hE = IF.dusun; nE = IF.dusun;
    const k = Math.floor(Math.max(0, t - tm.cd0) / 1.9) % 3;
    hL = [[0.3, 0.5], [0.15, -0.55], [0.35, 0.45]][k];                // tavla ↔ tahta
    nL = [[-0.3, 0.5], [-0.35, 0.45], [-0.5, -0.3]][(k + 1) % 3];
  }
  if (t >= tm.n1 - 0.2) { nE = IF.emin; nL = [0.45, 0.02]; }            // ipucu: Defne'ye ve izleyiciye
  if (t >= tm.n1s + 0.1) { nL = [0.3, 0.3]; nE = IF.notr; }
  const hp = oturan('hikmet', HIK_X, { expr: hE, head: { tilt: hL[0] > 0 ? 3 : -3, look: hL } });
  const np = oturan('necmi', NEC_X, { expr: nE, head: { tilt: nL[0] < 0 ? -3 : 3, look: nL } });
  H.onayla(np, t, tm.n0s + 0.05, 1, 0.38); H.onayla(np, t, tm.kaca - 0.05, 1, 0.36);
  { const k = H.talkAt(tl, 'necmi', t); if (k > 0) np.expr = { ...np.expr, open: 0.62 * k, w: Math.max(np.expr.w ?? 1, 1.3) }; }   // bıyığın altında ağız seçilsin
  H.onayla(hp, t, tm.tahtaya + 0.05, 1, 0.38); H.onayla(hp, t, tm.ustune + 0.05, 1, 0.38);
  if (id === 'hikmet') H.omuzSilk(hp, t, tm.hangi - 0.1, 0.5);
  // eller
  const hDin = [HIK_X + 70, YB + 20], hDinL = [HIK_X - 80, YB + 22], nDin = [NEC_X - 70, YB + 20], nDinR = [NEC_X + 80, YB + 22];
  const hO = { heads }, nO = { heads };
  let hR = hDin, nL2 = nDin, hTut = true, nTut = true, hIsa = null, nIsa = null;
  // kanca: "tahtaya"da sağ eliyle tahtayı gösterir (el başın yanında, parmak oranın altına)
  const wG = 0;   // (gösterme kaldırıldı: kol Kerem'in önünden geçiyordu; Hikmet tahtaya bakar ve başını sallar)
  let hLel = hDinL, hIsaL = null;
  if (wG > 0.01) { const ust = H.elYeri('hikmet', hp, 'L', 'yukari'); hLel = kar(hDinL, [ust[0] - 30, ust[1] + 40], wG); if (wG > 0.6) hIsaL = [SAYI[0] + 60, SAYI[1]]; }
  // h2 "üstüne": yine tahtayı gösterir
  const wG2 = 0;
  if (wG2 > 0.01) { const ust = H.elYeri('hikmet', hp, 'L', 'yukari'); hLel = kar(hDinL, [ust[0] - 30, ust[1] + 40], wG2); if (wG2 > 0.6) hIsaL = [SAYI[0] + 60, SAYI[1]]; }
  // n0 "tam": Necmi işaret parmağıyla masaya dokunur
  const wT = id === 'necmi' ? pIn(t, tm.tam - 0.3, tm.n0s + 0.1, 0.25) : 0;
  if (wT > 0.01) { nL2 = kar(nDin, [NEC_X - 40, YB + 6 - 10 * H.nabiz(t, tm.tam, 0.25)], wT); if (wT > 0.6) { nIsa = [NEC_X - 52, YB + 30]; nTut = false; } }
  // zaman atlaması: eller tavla üstünde hızla gidip gelir
  if (atla) {
    const f = 0.5 + 0.5 * Math.sin(TAU * hizli / 0.36), g = 0.5 + 0.5 * Math.sin(TAU * hizli / 0.36 + Math.PI);
    hR = kar(hDin, [TAVLA[0] - 60, TAVLA[1] - 14], f); nL2 = kar(nDin, [TAVLA[0] + 60, TAVLA[1] - 14], g);
  }
  // sayaç: zarlar
  let zarlar = ZAR_YER.map(([p, n, a]) => ({ p, n, a }));
  if (id === 'sayac' || (t >= tm.sayac && plan === 'genis')) {
    const elH0 = [HIK_X + 92, YB + 4 - 26 * Math.abs(Math.sin(TAU * (t - tm.cd0) * 2.2))], elN0 = [NEC_X - 92, YB + 4 - 26 * Math.abs(Math.sin(TAU * (t - tm.cd0) * 2.2))];
    const z = zarAt(tm, t, elH0, elN0); zarlar = z.z;
    const { cd0 } = tm;
    const wH = Math.max(pIn(t, cd0 + 0.25, cd0 + 1.35, 0.3), pIn(t, cd0 + 8.9, cd0 + 9.75, 0.3));   // Hikmet zarları alır, sallar, atar
    const wN = pIn(t, cd0 + 4.05, cd0 + 5.15, 0.3);
    const wP = Math.max(pIn(t, cd0 + 2.1, cd0 + 3.0, 0.25), pIn(t, cd0 + 5.7, cd0 + 6.6, 0.25)), wPN = pIn(t, cd0 + 6.3, cd0 + 7.2, 0.25);         // pul oynar
    hR = kar(kar(hDin, elH0, wH), [TAVLA[0] - 70, TAVLA[1] - 8], wP);
    nL2 = kar(kar(nDin, elN0, wN), [TAVLA[0] + 74, TAVLA[1] - 2], wPN);
    if (wH > 0.5 && !z.H) zarlar = zarlar.map(q => ({ ...q }));
  }
  hO.R = [hR, 1, 'A']; hO.L = [hLel, 1, 'A']; nO.L = [nL2, 1, 'A']; nO.R = [nDinR, 1, 'A'];
  if (id === 'hikmet') { const w = H.omuzSilk({ armL: { sh: 0, el: 0 }, armR: { sh: 0, el: 0 }, head: {} }, t, tm.hangi - 0.1, 0.5).armR.sh / 24; if (w > 0.01) { hO.R = [hR, 1 - w, 'A']; hO.L = [hDinL, 1 - w, 'A']; } }
  if (ciz.hikmet) sandalyeSirt(K, HIK_X);
  if (ciz.necmi) sandalyeSirt(K, NEC_X);
  const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 10000, 5000 + YB + 40); ctx.clip();
  const hc = ciz.hikmet ? oyna(K, t, tl, 'hikmet', hp, hO) : null;
  const nc = ciz.necmi ? oyna(K, t, tl, 'necmi', np, nO) : null;
  ctx.restore();
  masa(K);
  // tavla: pullar kancada sabit; atlamada her karede başka diziliş (hızlı oyun); sonra yeni diziliş
  const tohum = atla ? 100 + Math.floor(hizli * 30 / 3) : t >= tm.atla1 ? 140 + (t >= tm.cd0 + 3.0 ? 1 : 0) + (t >= tm.cd0 + 6.5 ? 1 : 0) + (t >= tm.cd0 + 7.2 ? 1 : 0) : 81;
  tavla(K, pulDizisi(tohum).map(pulYer), zarlar);
  H.buhar(K, CAY_H[0], CAY_H[1] - 58, t, { k: 0.42, n: 2, ara: 13, boy: 70 }); bardak(K, CAY_H);
  H.buhar(K, CAY_N[0], CAY_N[1] - 58, t + 0.7, { k: 0.42, n: 2, ara: 13, boy: 70 }); bardak(K, CAY_N);
  if (hc) { if (hIsa) hc.isaret('R', hIsa); else if (hTut) hc.tut('R'); if (hIsaL) hc.isaret('L', hIsaL); else hc.tut('L'); }
  if (nc) { if (nIsa) nc.isaret('L', nIsa); else if (nTut) nc.tut('L'); nc.tut('R'); }

  // ——— Defne (ayakta, masanın sağ ucunda) ———
  if (ciz.defne) {
    let dE = IF.notr, dL = [-0.6, 0.1];
    if (t >= tm.yok - 0.1 && t < tm.ocak - 0.05) dL = [-0.55 + 0.35 * Math.sin(TAU * (t - tm.yok) * 2.4), 0.25];   // "yok": başını iki yana
    if (t >= tm.ocak - 0.05 && t < tm.d1s + 0.2) { dL = [-0.85, -0.35]; dE = IF.emin; }   // "Ocakta": tahtaya doğru bakar
    if (t >= tm.d2) { dE = IF.supheK; dL = [-0.2, 0.02]; }
    if (t >= tm.n1 - 0.2) { dE = IF.merak; dL = [-0.6, 0.12]; }
    if (t >= tm.n1s + 0.15) { dE = IF.dusunA; dL = [-0.15, -0.45]; }   // gözleri açık, yukarı bakarak düşünür (şüphe değil)
    if (id === 'buldum') { dE = IF.gulus; dL = [0, -0.1]; }
    const dp = H.kisi('defne', { x: DEF_X, y: DEF_Y, s: DEF_S, expr: dE, ...POZ.dur, head: { tilt: dL[0] < 0 ? -3 : 3, look: dL } });
    dp.y -= H.buldumHop(t, tm.buldum, 50);
    const o = { heads };
        if (id === 'defne') H.omuzSilk(dp, t, tm.d2 + 0.05, 0.45);         // "Atlamış olabilir": omuz silker (el bir yeri göstermez)
    if (id === 'buldum') o.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];
    const dc = oyna(K, t, tl, 'defne', dp, o);
    if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
    void dc;
  }
  on(K);
  // altyazı kuyruğu kısa (masadaki tavlanın ve tahtanın üstünden geçmesin)
  for (const k of Object.keys(heads)) heads[k] = [heads[k][0], Math.max(heads[k][1], cam.cy + (1150 - 960) / cam.zoom)];
}
