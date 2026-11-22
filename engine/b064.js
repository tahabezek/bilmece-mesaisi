// Bölüm 64 · ISLAK NOT (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_064_v5.md). Mekanizma: Türkçede
// rakamın aldığı ek, silinen rakamı ele verir.
// Logline: Hikmet dedesinden kalma kasanın şifresini bir kâğıda yazmıştır; kâğıda çay dökülür, üç rakam da lekenin altında
// kalır. Geriye üç cümle kalır. Hikmet bin ihtimali denemeye hazırlanır; Defne kasayı ilk denemede açacağını söyler.
// Akılda kalacak tek şey: leke rakamı siler, eki silemez.
// Sızıntı yasağı: ekler vurgulanmaz (renk, kalınlık, altı çizgi, büyütme yok); üç leke aynı çizimdir; lekenin altında rakam
// çizilmez; kadranda hiçbir rakam vurgulanmaz; ibre yalnız 1, 2, 4, 5 ve 7'de durur (9, 6, 0'a uğramaz; 3 ve 8'e de uğramaz,
// eleme yoluyla ipucu çıkmasın); kasa kesimden önce açılmaz.
// Not plânı: not EKRAN katmanında, kartın altında sabit durur; onu tutan el sağ kenardan girer. Altındaki şeritte sahne
// oynamaya devam eder (kamera yalnız arka plânı iter; yazı kıpırdamaz). Dünya ölçeğindeki küçük notta yazı yoktur.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180;

// ═══════════════════════════ Not (şartlar: değişmez) ═══════════════════════════
// Her satır: [lekeden önceki yazı, lekeden sonraki yazı]. Leke tek bir rakamın yerindedir.
const NOT = [['Önce ', '’u bul.'], ['Sonra ', '’ya çevir.'], ['En son ', '’ın üstünde bırak.']];
(function denetle() {
  const bek = ['Önce ●’u bul.', 'Sonra ●’ya çevir.', 'En son ●’ın üstünde bırak.'];
  NOT.forEach((s, i) => { if (s.join('●') !== bek[i]) throw new Error('b064 not metni: ' + s.join('●')); });
  if (!NOT[2][1].startsWith('’ın')) throw new Error('b064: "ın" noktasız olmalı');
})();
const KAGIT = '#FFF8E3', MUREKKEP = '#27447E', CAY = '#A8703A', CAY_KOYU = '#7C4E22', CAY_ACIK = '#D9B585';

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b064_oda';
const KASA = { x0: 234, x1: 1010, y0: 690, y1: 1452 };
const KAD = [385, 944], KAD_R = 102, KAD_P = 130, KAD_ALT = 1010;      // kadran: ibre mili, rakam yayı, plaka yarıçapı, plakanın alt kenarı
const KAD_A = v => (-96 + v * 192 / 9) * D2R;                           // v. rakamın açısı (0 = yukarı, saat yönü +); v kesirli olabilir (ibre)
const KOL_P = [940, 915], KOL_L = 84;                                   // kolun mili ve boyu (tutamak sola bakar)
const kolUcu = a => [KOL_P[0] - Math.cos(a * D2R) * KOL_L, KOL_P[1] + Math.sin(a * D2R) * KOL_L];
const topuzEl = ib => [KAD[0] + 15 + 6 * Math.sin(ib), KAD[1] + 15 - 6 * Math.cos(ib)];   // topuzu alttan tutan el (kol rakamları örtmez)
const MASA = { x0: 1525, x1: 1955, y: 1200 };
const BARDAK = [MASA.x0 + 310, MASA.y];
// duruş yerleri
const H_MASA = 1715, H_KASA = 660;
const N_KASA = 650, D_KASA = 884;        // kare 0: kasanın önünde, nota bakıyorlar
const N_GRUP = 1175, D_GRUP = 1430;      // grup plânı (masanın yanı; kasa kadraj dışında)
const D_SON = 1110, N_ARA = 1460, N_SON = 1740;   // Hikmet kasaya geçince: Necmi önce Defne'nin yanında, ipucunda masanın önünde (pencerenin yanı)
const NOT_MASA = [1555, 990], NOT_H = [1585, 1080], NOT_D = [1541, 1100], NOT_SON = [1000, 1092], NOT_GOGUS = [1108, 1150];   // küçük notun tutulduğu yerler
// Şaşkın ama ağzı kapalı: konuşmayan karakterin ağzı açık kalınca replik ona aitmiş gibi okunuyordu
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
// şerit kadrajları (notun altındaki bant: ekranda y ≈ 830–1220)
const SA = [1.25, 624, 915];             // kadran + Necmi + Defne
const SC = [1.3, 1840, 828];           // Hikmet masasında + pencere
const SD = [1.25, 600, 830];             // kadran + Hikmet + kol
const SE = [1.4, 1818.6, 954];           // Necmi + pencere
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// hangi sahnede kim çizilir (H Hikmet, D Defne, N Necmi). Notu tutan kişi not plânında çizilmez: eli kameranın önündedir.
const GOR = { kanca: 'ND', masa: 'H', grup: 'NDH', not2: 'H', kadran: 'H', not3: 'H', deneme: 'H', defne: 'DN', hikmet: 'HD', sayac: 'H', ipucu: 'N', buldum: 'D', cevap: 'H', cta: 'D' };

// ═══════════════════════════ Büyük not (ekran katmanı) ═══════════════════════════
const NK = { x0: 62, x1: 990, y0: 508, y1: 820, rot: -1.1, tx: 106, tw: 808, base: [594, 686, 778] };
const LEKE_YUVA = 1.2;                   // lekenin satırda kapladığı yer (punto çarpanı): 0,06 boşluk + 1,0 leke + 0,14 boşluk (kesme işareti lekeye değmez, ek rakama yakın durur)
let ND = null;
function notDuzen(K) {                   // tek punto: en uzun satır güvenli alana (x 106–914) sığar
  if (ND) return ND;
  const { ctx } = K; let sz = 64, m;
  const olc = s => { ctx.font = `700 ${s}px Rubik`; return NOT.map(([a, b]) => [ctx.measureText(a).width, ctx.measureText(b).width]); };
  for (m = olc(sz); sz > 50 && Math.max(...m.map(([a, b]) => a + b + sz * LEKE_YUVA)) > NK.tw; m = olc(sz)) sz--;
  ND = { sz, m, r: sz * 0.5, leke: m.map(([a], i) => [NK.tx + a + sz * 0.56, NK.base[i] - sz * 0.34]) };
  return ND;
}
// notun kendi dönüşünden sonraki ekran noktası
function notNokta([x, y]) {
  const cx = (NK.x0 + NK.x1) / 2, cy = (NK.y0 + NK.y1) / 2, a = NK.rot * D2R, dx = x - cx, dy = y - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}
// Çay lekesi: üç leke aynı çizim, aynı yarıçap (yalnız açı farklı). Altında rakam yoktur.
const LEKE_K = [1, 0.96, 1.04, 0.97, 1.03, 0.95, 1.02, 0.98, 1.04, 0.96, 1.01, 0.97];
function leke(K, x, y, r, rot) {
  const { ctx } = K, n = LEKE_K.length;
  const pt = (i, k) => { const a = rot + (i % n) / n * Math.PI * 2, rr = r * LEKE_K[i % n] * k; return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; };
  const yol = k => {
    ctx.beginPath(); const p0 = pt(0, k), p1 = pt(1, k); ctx.moveTo((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
    for (let i = 1; i <= n; i++) { const p = pt(i, k), q = pt(i + 1, k); ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
    ctx.closePath();
  };
  ctx.save();
  ctx.globalAlpha = 0.5; yol(1.1); ctx.fillStyle = CAY_ACIK; ctx.fill(); ctx.globalAlpha = 1;      // ıslak hale
  yol(1); ctx.fillStyle = CAY; ctx.fill(); ctx.lineWidth = r * 0.13; ctx.strokeStyle = CAY_KOYU; ctx.lineJoin = 'round'; ctx.stroke();
  yol(0.56); ctx.fillStyle = '#B98148'; ctx.fill();
  ctx.restore();
}
// Büyük not: kim = notu tutan ('hikmet' beyaz gömlek kolu, 'defne' mercan ceket kolu)
function notBuyuk(K, t, kim) {
  const { ctx } = K, d = notDuzen(K), C = H.CARDS[kim], w = NK.x1 - NK.x0, h = NK.y1 - NK.y0, cx = (NK.x0 + NK.x1) / 2, cy = (NK.y0 + NK.y1) / 2, lw = LW + 1;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(NK.rot * D2R); ctx.translate(-cx, -cy);
  // kol ve avuç (kâğıdın arkasında; yalnız kenardan taşan kısmı görünür)
  K.rect(1044, 606, 120, 124, C.arm.color, lw, 18);
  K.rect(1034, 612, 26, 112, kim === 'hikmet' ? '#D6D0C2' : C.arm.shade, lw * 0.7, 8);
  K.circ(1020, 668, 58, C.skin, lw);
  // kâğıt: defter yaprağı
  K.rect(NK.x0 + 9, NK.y0 + 11, w, h, INK, 0, 8);
  K.rect(NK.x0, NK.y0, w, h, KAGIT, lw, 8);
  ctx.save(); ctx.beginPath(); ctx.roundRect(NK.x0 + 4, NK.y0 + 4, w - 8, h - 8, 5); ctx.clip();
  ctx.globalAlpha = 0.55; K.ell(NK.x0, NK.y1, 84, 46, CAY_ACIK, 0); ctx.globalAlpha = 1;        // ıslak köşe (çay buradan damlar; yazının altına girmez)
  K.ell(NK.x0, NK.y1, 52, 28, '#C99A5E', 0);
  for (const by of NK.base) K.line(NK.x0, by + 17, NK.x1, by + 17, 3, '#C3D5E6');                 // satır çizgileri
  K.line(NK.x0 + 28, NK.y0, NK.x0 + 28, NK.y1, 3, '#E6ADA0');                                     // kenar boşluğu çizgisi
  ctx.restore();
  // yazı ve lekeler: ekler öbür harflerle aynı renk, aynı kalınlık, aynı boy
  NOT.forEach(([a, b], i) => {
    K.text(a, NK.tx, NK.base[i], d.sz, MUREKKEP, 700, 'left');
    K.text(b, NK.tx + d.m[i][0] + d.sz * LEKE_YUVA, NK.base[i], d.sz, MUREKKEP, 700, 'left');
    leke(K, d.leke[i][0], d.leke[i][1], d.r, i * 2.1);
  });
  // başparmak (kâğıdın önünde)
  ctx.lineCap = 'round';
  H.strokeLine(ctx, [1002, 664], [950, 652], 46 + lw * 2, INK); H.strokeLine(ctx, [1002, 664], [950, 652], 46, C.skin);
  ctx.restore();
}
// Notun sarkan sol alt köşesinden damlayan çay (ekran katmanı; ilk damla 0,3 sn'de düşmeye başlar)
function notDamla(K, t) {
  const [x, y] = notNokta([NK.x0 + 16, NK.y1 + 2]), u = (((t + 0.26) / 1.4) % 1 + 1) % 1;
  if (u < 0.4) H.damla(K, x, y + 12 + 6 * (u / 0.4), 10 * Math.min(1, 0.35 + u / 0.3), CAY);
  else { const g = (u - 0.4) / 0.5; if (g < 1) H.damla(K, x, lerp(y + 18, 1990, g * g), 10, CAY); }
}

// ═══════════════════════════ Nesneler (dünya) ═══════════════════════════
// Küçük not (dünya ölçeği): [x, y] parmakların tuttuğu üst kenar. Yazı yok: üç mürekkep çizgisi, üç çay noktası.
function notKucuk(K, [x, y], t, { rot = 0, yer = 1500 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-80 + 5, -8 + 6, 106, 82, INK, 0, 4);
  K.rect(-80, -8, 106, 82, KAGIT, LW * 0.6, 4);
  [14, 24, 44].forEach((len, i) => { const yy = 14 + i * 20; K.line(-68, yy, -50, yy, 4.5, MUREKKEP); K.circ(-38, yy, 6.5, CAY, 0); K.line(-26, yy, -26 + len, yy, 4.5, MUREKKEP); });
  ctx.restore();
  H.damlaDongu(K, x - 30, y + 80, yer, t, { periyot: 1.5, r: 6, renk: CAY, faz: 0.2 });
}
// İnce belli çay bardağı: (x, yb) taban; rot (derece) sağa devrilme. dolu: içinde çay var mı.
function bardak(K, x, yb, { rot = 0, dolu = false, k = 2.1, buhar = false, t = 0 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x + 14 * k, yb - 4 * Math.sin(rot * D2R)); ctx.rotate(rot * D2R); ctx.translate(-14 * k, 0); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], dolu ? '#A8401F' : '#EFE8D6', 2.4 / k * 1.45);
  if (!dolu) K.poly([[-11, -4], [11, -4], [10, 0], [-10, 0]], '#A8401F', 0);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 36 * k, t, { k: 0.38, n: 2, ara: 9, boy: 56 });
}
// Hikmet'in masası: devrilmiş bardak, çay gölü, masanın kenarından damlayan çay
function masaCiz(K, t) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 16, y + 34, x1 - x0 - 32, 1500 - y - 34, PAL.wood, LW);
  K.rect(x0 + 44, y + 72, 180, 124, PAL.woodTop, LW * 0.6, 6); K.line(x0 + 108, y + 134, x0 + 160, y + 134, 8);
  K.rect(x0, y, x1 - x0, 36, PAL.woodTop, LW, 8);
  K.rect(x0 + 198, y - 16, 124, 16, PAL.teal, LW * 0.6, 3); K.rect(x0 + 204, y - 27, 112, 12, KAGIT, LW * 0.5, 2);   // notun koparıldığı defter
  K.ell(BARDAK[0] - 64, y - 3, 40, 8, PAL.cream, 3);                                                                  // tabak
  K.ell(x0 + 356, y, 72, 10, CAY, 3);                                                                                 // çay gölü
  K.rect(x0 + 336, y + 2, 16, 30, CAY, 2.5, 7); K.rect(x0 + 386, y + 2, 16, 44, CAY, 2.5, 7);                         // kenardan süzülen çay
  H.damlaDongu(K, x0 + 394, y + 54, 1494, t, { periyot: 1.15, r: 8, renk: CAY });
  K.ell(x0 + 396, 1502, 28, 5, CAY, 2);
}
// Dededen kalma çelik kasa. ibre: açı (rad), kol: kolun aşağı dönüşü (derece)
function kasaCiz(K, t, { ibre = KAD_A(2), kol = 0 } = {}) {
  const { ctx } = K, { x0, x1, y0, y1 } = KASA, w = x1 - x0, h = y1 - y0, mx = (x0 + x1) / 2, KOYU = '#33423A';
  // üstünde eski kitaplar ve saksı
  K.rect(612, y0 - 28, 210, 28, '#8E2A2E', LW * 0.7, 4); K.rect(630, y0 - 54, 176, 26, PAL.mustard, LW * 0.7, 4); K.line(650, y0 - 41, 700, y0 - 41, 4, INK);
  K.poly([[452, y0 - 44], [520, y0 - 44], [510, y0], [462, y0]], '#B8623C', LW * 0.7);
  H.yaprak(K, 478, y0 - 44, 34, -0.5, PAL.green, 1); H.yaprak(K, 494, y0 - 44, 34, 0.45, PAL.green, 1);
  // ayaklar ve gövde
  K.rect(x0 + 46, y1 - 6, 84, 54, KOYU, LW, 8); K.rect(x1 - 130, y1 - 6, 84, 54, KOYU, LW, 8);
  K.rect(x0 + 10, y0 + 12, w, h, INK, 0, 24);
  K.rect(x0, y0, w, h, '#47705A', LW, 24);
  K.rect(x0 + 26, y0 + 26, w - 52, h - 52, '#588A6C', LW * 0.8, 16);
  ctx.save(); ctx.beginPath(); ctx.roundRect(x0 + 48, y0 + 48, w - 96, h - 96, 10); ctx.lineWidth = 5; ctx.strokeStyle = '#D9B254'; ctx.stroke(); ctx.restore();
  K.rect(x0 + 96, 1130, w - 192, 236, '#4D7B60', LW * 0.6, 12);
  K.poly([[mx, 1172], [mx + 78, 1248], [mx, 1324], [mx - 78, 1248]], '#588A6C', LW * 0.5);
  for (const px of [x0 + 68, mx, x1 - 68]) for (const py of [y0 + 68, y1 - 68]) K.circ(px, py, 8, KOYU, 2.5);
  for (const my of [800, 1290]) K.rect(x1 - 16, my, 30, 86, KOYU, LW * 0.8, 6);
  // kadran plakası: 0–9 sabit plakada, ibre döner
  const plaka = (dx, dy) => { ctx.beginPath(); ctx.moveTo(KAD[0] - KAD_P + dx, KAD_ALT + dy); ctx.lineTo(KAD[0] - KAD_P + dx, KAD[1] + dy); ctx.arc(KAD[0] + dx, KAD[1] + dy, KAD_P, Math.PI, 0); ctx.lineTo(KAD[0] + KAD_P + dx, KAD_ALT + dy); ctx.closePath(); };
  plaka(6, 8); ctx.fillStyle = INK; ctx.fill();
  plaka(0, 0); K.fs(PAL.cream, LW);
  for (let i = 0; i < 10; i++) {
    const a = KAD_A(i), s = Math.sin(a), c = -Math.cos(a);
    K.line(KAD[0] + s * 68, KAD[1] + c * 68, KAD[0] + s * 77, KAD[1] + c * 77, 4, INK);
    K.text(String(i), KAD[0] + s * KAD_R, KAD[1] + c * KAD_R + 13, 36, INK, 800);
  }
  ctx.save(); ctx.lineCap = 'round';
  const uc = [KAD[0] + Math.sin(ibre) * 64, KAD[1] - Math.cos(ibre) * 64];
  H.strokeLine(ctx, KAD, uc, 17, INK); H.strokeLine(ctx, KAD, uc, 8, PAL.red);
  K.circ(KAD[0], KAD[1], 30, KOYU, LW * 0.8); K.circ(KAD[0], KAD[1], 11, PAL.metal, 3);
  // kol
  const u = kolUcu(kol);
  H.strokeLine(ctx, KOL_P, u, 30, INK); H.strokeLine(ctx, KOL_P, u, 18, PAL.metal);
  K.circ(KOL_P[0], KOL_P[1], 30, KOYU, LW * 0.8); K.circ(KOL_P[0], KOL_P[1], 10, PAL.metal, 3);
  K.circ(u[0], u[1], 21, '#2A1E17', LW * 0.7);
  ctx.restore();
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-300, 2300], dongu: ['nottan damlayan çay', 'masadan damlayan çay', 'duvar saati', 'pencerede martı', 'Necmi\'nin çay buharı'],
  capa: { kadran: KAD, kol: KOL_P, masa: [MASA.x0 + 215, MASA.y] }, kadraj: { grup: [1.27, 1458, 975] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -400, x1: 2400, isik, duvar: 'cizgili', zemin: 'ahsap' });
    if (durum.saat !== false) M.duvarSaati(K, 1440, 690, 50, 10.4 + t / 60, t);
    M.pencere(K, 1900, 700, 300, 360, { isik, t });
    kasaCiz(K, t, durum);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    masa: T('h1:5') - 0.15, bardak: T('h1:7') + 0.05,
    grup: T('h2a') - 0.1, uc: T('h2a:1') - 0.04, rakamlarin: T('h2a:4'), ucu: T('h2a:5'), lekenin: T('h2a:7'),
    ver: T('d1') - 0.2, not2: T('d1:1') - 0.1, ucCumle: T('d1:4'),
    kadran: T('h2b') - 0.1, on: T('h2b:1'), not3: T('h2b:4') - 0.1, bir: T('h2b:7') - 0.04,
    deneme: T('h3') - 0.1, h3: T('h3'), aksama: T('h3:3'), deneriz: T('h3:5'),
    defne: T('d2') - 0.1, ben: T('d2:2'), ilk: T('d2:5') - 0.04, acarim: T('d2:7'),
    hikmet: T('h4') - 0.1, gorem: T('h4:1'), sifreyi: T('h4:3'), nereden: T('h4:4'),
    sayac: cd0 - 0.05, ipucu: T('n1') - 0.1, su: T('n1:2'), yuksek: T('n1:6') - 0.04, n1s: T('n1>'),
    cevap: T('d3>') + 0.15, dokuzu: T('d4:4'), altiya: T('d4:5'), sifirin: T('d4:6'), cta: T('d6') - 0.15,
  };
  tm.cek = [tm.deneriz + 0.05, cd0 + 3.3, cd0 + 7.0];                 // kolun çekildiği anlar (açılmaz)

  const film = H.sahneler([
    { id: 'kanca', t0: 0, not: 'hikmet', cam: [[0, ...SA]] },
    { id: 'masa', t0: tm.masa, cam: [[0, 1.5, 1795, 1048], [tm.bardak + 0.6, 1.53, 1791, 1050]] },
    { id: 'grup', t0: tm.grup, cam: [[0, 1.27, 1452, 975], [tm.rakamlarin, 1.28, 1454, 977]] },
    { id: 'not2', t0: tm.not2, not: 'defne', cam: [[0, ...SC]] },
    { id: 'kadran', t0: tm.kadran, kisa: true, cam: [[0, 1.6, 495, 930]] },
    { id: 'not3', t0: tm.not3, not: 'defne', cam: [[0, ...SD]] },
    { id: 'deneme', t0: tm.deneme, cam: [[0, 1.4, 598, 955], [tm.aksama, 1.42, 602, 955]] },
    { id: 'defne', t0: tm.defne, cam: [[0, 1.5, 1335, 915], [tm.ilk, 1.53, 1338, 917]] },
    { id: 'hikmet', t0: tm.hikmet, cam: [[0, 1.36, 913, 945], [tm.sifreyi, 1.38, 915, 946]] },
    { id: 'sayac', t0: tm.sayac, not: 'defne', cam: [[0, 1.24, 600, 862]] },                 // doğrusal itme draw'daki kamera() ile
    { id: 'ipucu', t0: tm.ipucu, not: 'defne', cam: [[0, ...SE]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, D_SON, 1000]] },
    { id: 'cevap', t0: tm.cevap, not: 'defne', cam: [[0, ...SD]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.4, D_SON + 30, 990]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ibre: rakam dizini (kesirli). Yalnız 1, 2, 4, 5, 7'de durur.
  const ibreIz = [[0, 2],
    [tm.h3 + 0.12, 4, 0.3], [tm.h3 + 0.55, 7, 0.3], [tm.h3 + 1.0, 2, 0.32],
    [cd0 + 0.7, 5, 0.3], [cd0 + 1.35, 1, 0.33], [cd0 + 2.05, 7, 0.33],
    [cd0 + 5.0, 2, 0.34], [cd0 + 5.65, 4, 0.3], [cd0 + 6.3, 1, 0.32],
    [cd0 + 8.0, 5, 0.3], [cd0 + 8.65, 2, 0.32], [cd0 + 9.3, 4, 0.3],
    [tm.dokuzu, 9, 0.3], [tm.altiya, 6, 0.3], [tm.sifirin, 0, 0.3],                          // arşiv (kesimden sonra)
  ];
  for (const k of ibreIz) if (k[0] < tm.buldum && ![1, 2, 4, 5, 7].includes(k[1])) throw new Error('b064: ibre yasak rakamda duruyor: ' + k[1]);

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: H_MASA, expr: 'yorgun', head: { tilt: 5, look: [0.5, 0.75] }, ...POZ.dur });
  const hik = [
    [tm.bardak + 0.55, { expr: 'yorgun', head: { tilt: -3, look: [0.0, 0.1] } }, 0.3],
    [tm.grup, { expr: 'notr', head: { tilt: -4, look: [-0.75, 0.15] } }, 0.01],
    [tm.uc - 0.1, { expr: 'notr', head: { tilt: 3, look: [-0.6, 0.5] } }, 0.3],
    [tm.rakamlarin, { expr: 'yorgun', head: { tilt: -5, look: [-0.65, 0.7] } }, 0.3],
    [tm.ver, { expr: SASKIN, head: { tilt: -3, look: [-0.8, 0.4] } }, 0.25],
    [tm.not2, { expr: 'notr', head: { tilt: 4, look: [-0.25, -0.75] } }, 0.01],
    [tm.ucCumle, { expr: 'yorgun', head: { tilt: -4, look: [-0.15, -0.55] } }, 0.3],
    [tm.kadran, { x: H_KASA, expr: 'notr', head: { tilt: -5, look: [-0.85, 0.1] } }, 0.01],
    [tm.on + 0.35, { head: { tilt: 2, look: [0.0, 0.05] } }, 0.3],
    [tm.not3, { expr: 'notr', head: { tilt: 3, look: [0.1, -0.7] } }, 0.01],
    [tm.bir + 0.5, { head: { tilt: -3, look: [0.0, 0.0] } }, 0.3],
    [tm.deneme, { expr: 'notr', head: { tilt: -6, look: [-0.9, 0.15] } }, 0.01],
    [tm.aksama - 0.1, { head: { tilt: 5, look: [0.85, 0.1] } }, 0.25],
    [tm.deneriz, { expr: IFADE.zorlanma, head: { tilt: 7, look: [0.8, 0.2] } }, 0.15],
    [tm.deneriz + 0.75, { expr: 'yorgun', head: { tilt: -2, look: [0.15, 0.3] } }, 0.3],
    [tm.hikmet, { x: H_KASA + 30, expr: 'notr', head: { tilt: 5, look: [0.85, 0.2] } }, 0.01],
    [tm.gorem, { expr: 'saskin', head: { tilt: 3, look: [0.8, 0.4] } }, 0.25],
    [tm.sifreyi, { expr: 'notr', head: { tilt: 6, look: [0.85, 0.1] } }, 0.3],
    [tm.sayac, { x: H_KASA, expr: 'notr', head: { tilt: -6, look: [-0.9, 0.15] } }, 0.01],
    [cd0 + 2.6, { head: { tilt: 5, look: [0.85, 0.1] } }, 0.25],
    [cd0 + 3.3, { expr: IFADE.zorlanma, head: { tilt: 7, look: [0.8, 0.2] } }, 0.15],
    [cd0 + 3.95, { expr: 'yorgun', head: { tilt: 0, look: [0.1, -0.6] } }, 0.3],
    [cd0 + 4.65, { expr: 'notr', head: { tilt: -6, look: [-0.9, 0.15] } }, 0.3],
    [cd0 + 6.5, { head: { tilt: 5, look: [0.85, 0.1] } }, 0.25],
    [cd0 + 7.0, { expr: IFADE.zorlanma, head: { tilt: 7, look: [0.8, 0.2] } }, 0.15],
    [cd0 + 7.65, { expr: 'yorgun', head: { tilt: -6, look: [-0.9, 0.15] } }, 0.3],
    [cd0 + 9.55, { expr: 'saskin', head: { tilt: 5, look: [0.85, 0.0] } }, 0.3],
    [tm.cevap, { expr: 'saskin', head: { tilt: 3, look: [0.1, -0.6] } }, 0.01],
  ];
  const defBase = H.kisi('defne', { x: D_KASA, expr: SASKIN, head: { tilt: 4, look: [-0.25, -0.8] }, ...POZ.dur });
  const def = [
    [0.3, { head: { tilt: -3, look: [-0.3, -0.9] } }, 0.4],
    [1.9, { expr: 'notr', head: { tilt: 3, look: [-0.2, -0.85] } }, 0.35],
    [tm.masa, { x: D_GRUP, expr: 'notr', head: { tilt: 3, look: [0.8, 0.1] } }, 0.01],
    [tm.uc, { head: { tilt: -3, look: [0.8, 0.45] } }, 0.3],
    [tm.rakamlarin, { expr: SASKIN, head: { tilt: 4, look: [0.75, 0.5] } }, 0.3],
    [tm.ver, { expr: 'notr', head: { tilt: 5, look: [0.7, 0.55] } }, 0.2],
    [tm.kadran, { x: D_SON }, 0.01],
    [tm.defne, { expr: 'mutlu', head: { tilt: -4, look: [-0.5, 0.0] } }, 0.01],
    [tm.ben, { head: { tilt: 3, look: [0.0, 0.0] } }, 0.3],
    [tm.ilk, { head: { tilt: -5, look: [-0.4, -0.1] } }, 0.3],
    [tm.hikmet, { expr: 'mutlu', head: { tilt: 4, look: [-0.85, 0.0] } }, 0.01],
    [tm.sifreyi, { head: { tilt: -4, look: [-0.8, 0.25] } }, 0.3],
    [tm.nereden + 0.3, { head: { tilt: 5, look: [-0.85, 0.0] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cta, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.3, 0.3] } }, 0.01],
    [tm.cta + 0.5, { head: { tilt: -5, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: N_KASA, expr: 'notr', head: { tilt: -4, look: [0.3, -0.85] }, ...POZ.dur });
  const nec = [
    [0.35, { expr: SASKIN, head: { tilt: 3, look: [0.25, -0.9] } }, 0.4],
    [1.5, { expr: 'notr', head: { tilt: -5, look: [0.75, -0.2] } }, 0.3],
    [2.1, { head: { tilt: 2, look: [0.3, -0.9] } }, 0.3],
    [tm.masa, { x: N_GRUP, expr: 'notr', head: { tilt: 4, look: [0.8, 0.0] } }, 0.01],
    [tm.rakamlarin, { head: { tilt: -3, look: [0.85, 0.3] } }, 0.3],
    [tm.ver + 0.2, { head: { tilt: 3, look: [0.8, 0.35] } }, 0.3],
    [tm.kadran, { x: N_ARA }, 0.01],
    [tm.defne, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.0] } }, 0.01],
    [tm.ilk + 0.2, { expr: 'mutlu', head: { tilt: 3, look: [-0.8, -0.1] } }, 0.3],
    [tm.ipucu, { x: N_SON, expr: 'mutlu', head: { tilt: -3, look: [-0.6, -0.1] } }, 0.01],
    [tm.su, { head: { tilt: 4, look: [-0.3, -0.8] } }, 0.3],
    [tm.yuksek, { head: { tilt: -2, look: [-0.6, 0.0] } }, 0.3],
    [tm.n1s + 0.1, { expr: 'mutlu', head: { tilt: 5, look: [0.0, 0.0] } }, 0.35],
    [tm.cevap, { expr: 'mutlu', head: { tilt: -3, look: [-0.8, 0.0] } }, 0.01],
  ];
  // Altyazı çizelgesi (yalnız balon için; dudak ve kelime çapaları asıl çizelgeden okunur):
  // n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar ekranda kalır; "bir de" iki satıra bölünmez.
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, text: l.text.replace('bir de', 'bir\u00A0de'), t1: T('d3') - 0.3 } : l) };
  return { tm, film, tlA, ibreIz, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Durumlar ═══════════════════════════
// Kol: çekilir, 6° döner, sarsılır, yerine döner (kilitli). Arşivde (kesimden sonra) açılır.
function kolAci(S, t) {
  const { tm } = S; let a = 0;
  for (const c of tm.cek) a += 9 * ease.enter(seg(t, c, 0.12)) * (1 - ease.state(seg(t, c + 0.42, 0.2))) + 2.4 * H.sars(t, c + 0.1, 0.45, 13);
  if (t >= tm.cevap) a += 38 * ease.state(seg(t, tm.sifirin + 0.5, 0.4));
  return a;
}
// Masadaki bardak: devrik durur; Hikmet "çay"da kaldırıp dikine koyar
function bardakAt(S, t) {
  const u = ease.enter(seg(t, S.tm.bardak, 0.35)), rot = 90 * (1 - u), c = Math.cos(rot * D2R), s = Math.sin(rot * D2R);
  // tutuş noktası bardağın üstünde sabittir (sağ yanı): el bardakla birlikte döner, bardak elin solunda görünür kalır
  return { rot, tut: [BARDAK[0] + 29.4 + 6 * c + 44 * s, BARDAK[1] + 6 * s - 44 * c - 8 * s] };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç notu örtmesin)
  split: { h1: 5, h2b: 4 },   // ikinci cümle kendi plânıyla birlikte gelir (masa kesmesi, not plânı)
  // sayaç: not sabit kalır, kamera şeritteki olaya doğrusal itilir (1,24x → 1,34x)
  kamera(cam, t, B) {
    if (B.sc.id !== 'sayac') return;
    const u = clamp01((t - S.tm.cd0) / 10), z = Math.exp(lerp(Math.log(1.24), Math.log(1.34), u));
    Object.assign(cam, { zoom: z, cx: 600, cy: 716 + 145 / z });
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, sc = B.sc;
    if (sc.not) { notBuyuk(K, t, sc.not); notDamla(K, t); }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (sc.id === 'cevap') {   // arşiv: lekelerin yerine rakamlar
      const d = notDuzen(K);
      [['9', tm.dokuzu], ['6', tm.altiya], ['0', tm.sifirin]].forEach(([s, a], i) => H.tag(K, t, a - 0.04, 1e9, notNokta(d.leke[i]), s, PAL.green, PAL.paper, 56));
    }
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (bu bölüme özel): perde yok; not ve şeritteki olay açık kalır. Daire solda, başlık ve paylaşım hapı sağında.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1316, r = 80;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 25, 70, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(596, 1266); ctx.scale(inU * out, inU * out);
  ctx.font = '900 52px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 64;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 19, 52, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(596, 1362); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56;
    K.rect(-sw / 2 + 8, -40 + 10, sw, 80, INK, 0, 40); K.rect(-sw / 2, -40, sw, 80, PAL.coral, LW, 40); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// ——— Dünya: oda, kasa, masa, üç kişi ———
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc, cam } = B, id = sc.id, gor = GOR[id] || '', cd0 = tm.cd0;
  const ibre = KAD_A(H.iz(S.ibreIz, t)), kol = kolAci(S, t), brd = bardakAt(S, t);
  // duvar saati not plânlarında kart ile notun arasındaki dar boşluktan yarım görünürdü: yalnız tam göründüğü plânlarda çizilir
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz, durum: { ibre, kol, saat: ['grup', 'defne', 'hikmet', 'kadran', 'deneme', 'cta'].includes(id) } });
  // notu tutan kadraj dışındadır (eli kameranın önünde, sağ üstte): altyazı kuyruğu o ele doğru yatar
  if (sc.not) heads[sc.not] = [cam.cx + 460 / cam.zoom, cam.cy - 260 / cam.zoom];

  let kn = null;                 // küçük not: { p, rot, yer, kim, el }
  // ——— Hikmet ———
  let hp = null; const hO = { heads }; let hParmak = null, hIs = null, hBardak = false;
  if (gor.includes('H')) {
    hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
    if (id === 'masa') {
      hO.L = [NOT_MASA, 1, 'A']; kn = { p: NOT_MASA, rot: 6 * H.sars(t, tm.masa + 0.05, 0.7, 2.6), yer: 1500, kim: 'H', el: 'L' };
      const wB = pIn(t, tm.bardak - 0.3, tm.bardak + 0.7, 0.28);
      if (wB > 0.01) { hO.R = [brd.tut, wB, 'A']; hBardak = wB > 0.5; }
    } else if (id === 'grup') {
      // "üç rakam"da notu kaldırıp gösterir; "lekenin"de sallar; d1'de Defne'ye verir (iki el notta birlikte durur)
      const kal = pIn(t, tm.uc - 0.2, tm.rakamlarin + 0.1, 0.3), tut = [NOT_H[0] - 6 * kal, NOT_H[1] - 44 * kal];
      const v = H.elVer(t, tm.ver, NOT_H, NOT_D, { uzat: 0.32, ortak: 0.17, cek: 0.4 }), p = t < tm.ver ? tut : v.p;
      hO.L = [p, t < tm.ver ? 1 : v.verW, 'A'];
      kn = { p, rot: 0, yer: MASA.y, kim: t < v.tB ? 'H' : 'D', el: t < v.tB ? 'L' : 'R', v };
      const wP = pIn(t, tm.uc - 0.25, tm.rakamlarin - 0.15, 0.28);   // "üç rakam"da öbür eliyle notu gösterir
      if (wP > 0.01) { hO.R = [[H_MASA - 20, 1100], wP, 'A']; if (wP > 0.5) hIs = ['R', [p[0] + 10, p[1] + 34]]; }
    } else if (id === 'kadran') {
      hO.L = [[396, 1084], 1, 'A']; hIs = ['L', [KAD[0], KAD[1] + 20]];   // plakanın altından topuzu gösterir: parmak hiçbir rakama yakın durmaz
    } else if (id === 'not3') {
      hO.L = [topuzEl(ibre), 1, 'A'];
      const w1 = W(t, tm.bir - 0.28, 0.28);
      if (w1 > 0.01) { hO.R = [[812, 990], w1, 'A']; if (w1 > 0.5) hParmak = ['R', seg(t, tm.bir - 0.05, 0.2), { toplam: 1 }]; }
    } else if (id === 'deneme') {
      hO.L = [topuzEl(ibre), 1, 'A'];
      const wR = pIn(t, tm.aksama - 0.1, tm.deneriz + 0.8, 0.28);
      if (wR > 0.01) hO.R = [kolUcu(kol), wR, 'A'];
    } else if (id === 'hikmet') {
      const wP = pIn(t, tm.gorem - 0.25, tm.sifreyi - 0.1, 0.28);
      if (wP > 0.01) { hO.R = [[846, 1050], wP, 'A']; if (wP > 0.5) hIs = ['R', [NOT_SON[0] - 30, NOT_SON[1] + 30]]; }
      H.omuzSilk(hp, t, tm.nereden - 0.05, 0.7);
    } else if (id === 'sayac') {
      hO.L = [topuzEl(ibre), W(t, cd0 + 0.25, 0.28), 'A'];
      const wR = pIn(t, cd0 + 2.6, cd0 + 3.9, 0.28) + pIn(t, cd0 + 6.5, cd0 + 7.6, 0.28);
      if (wR > 0.01) hO.R = [kolUcu(kol), wR, 'A'];
    } else if (id === 'cevap') {
      hO.L = [topuzEl(ibre), 1, 'A']; hO.R = [kolUcu(kol), W(t, tm.sifirin + 0.2, 0.28), 'A'];
    }
  }
  // ——— Defne ———
  let dp = null; const dO = { heads }; let dParmak = null;
  if (gor.includes('D')) {
    dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
    if (id === 'kanca') dp.y += 22 * (1 - ease.enter(seg(t, 0.25, 0.5)));
    else if (id === 'grup') {
      // "üçü de"de Defne üç lekeye sırayla, eşit aralıkla dokunur (üçüne aynı muamele: sızıntı yok); "Bakayım"da notu alır
      const p = kn.p, nk = i => [p[0] - 38, p[1] + 14 + 20 * i], el = i => [p[0] - 88, p[1] + 50 + 20 * i];
      const yol = H.dokunYolu(t, [[tm.ucu - 0.3, el(0)], [tm.ucu, el(0)], [tm.ucu + 0.3, el(1)], [tm.ucu + 0.6, el(2)]], { yuksel: 12, sure: 0.2 });
      const wT = W(t, tm.ucu - 0.32, 0.28), a = t >= tm.ver ? kn.v.alW : 0;
      if (wT > 0.01) dO.R = [kar(yol, p, a), Math.max(wT, a), 'A'];
      if (wT > 0.5 && t < tm.ver) dParmak = ['is', nk(t < tm.ucu + 0.15 ? 0 : t < tm.ucu + 0.45 ? 1 : 2)];
    }
    else {
      if (id === 'defne') dp.x += 40;                         // ikili plânda yüzü kadraj kenarından uzak dursun
      const tutus = id === 'hikmet' ? NOT_SON : [dp.x - 2, NOT_GOGUS[1]];   // Hikmet'le konuşurken ona doğru uzatır; öbür plânlarda göğsünde tutar
      dO.L = [tutus, 1, 'A']; kn = { p: tutus, rot: 0, yer: 1500, kim: 'D', el: 'L' };
      const wF = pIn(t, tm.ilk - 0.28, tm.hikmet - 0.1, 0.28);
      if (id === 'defne') H.onayla(dp, t, tm.acarim, 1, 0.4);
      if (wF > 0.01 && id === 'defne') { dO.R = [[dp.x + 134, 1008], wF, 'A']; if (wF > 0.5) dParmak = ['R', seg(t, tm.ilk - 0.05, 0.2), { toplam: 1 }]; }
    }
  }
  // ——— Necmi ———
  let np = null; const nO = { heads }; let nParmak = null, nCay = null;
  if (gor.includes('N')) {
    np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    if (id === 'kanca') np.y += 22 * (1 - ease.enter(seg(t, 0.3, 0.5)));
    if (np.x > 1300) {
      nCay = [np.x + 160, 1122]; nO.R = [[nCay[0] + 8, nCay[1] - 26], 1, 'A'];
      if (id === 'defne') H.onayla(np, t, tm.ilk + 0.5, 2, 0.34);
      if (id === 'ipucu') H.onayla(np, t, tm.n1s + 0.75, 2, 0.36);
      const wF = id === 'ipucu' ? W(t, tm.yuksek - 0.28, 0.28) : 0;
      if (wF > 0.01) { nO.L = [[np.x - 160, 1020], wF, 'A']; if (wF > 0.5) nParmak = ['L', seg(t, tm.yuksek - 0.05, 0.2), { toplam: 1 }]; }
    }
  }

  // ——— çizim: masadaki Hikmet → masa → kasadaki Hikmet → Necmi → Defne → eldeki nesneler → tutan eller ———
  let hc = null;
  if (hp && hp.x > 1000) hc = oyna(K, t, tl, 'hikmet', hp, hO);
  masaCiz(K, t);
  if (!hBardak) bardak(K, BARDAK[0], BARDAK[1], { rot: brd.rot });
  if (hp && hp.x <= 1000) hc = oyna(K, t, tl, 'hikmet', hp, hO);
  const nc = np ? oyna(K, t, tl, 'necmi', np, nO) : null;
  const dc = dp ? oyna(K, t, tl, 'defne', dp, dO) : null;
  if (hBardak) { bardak(K, BARDAK[0], BARDAK[1], { rot: brd.rot }); hc.tut('R'); }
  if (kn) {
    notKucuk(K, kn.p, t, kn);
    if (kn.v && kn.v.ortak) { hc.tut('L'); dc.tut('R'); }
    else (kn.kim === 'H' ? hc : dc).tut(kn.el);
  }
  if (nCay) { bardak(K, nCay[0], nCay[1], { dolu: true, k: 2.0, buhar: true, t }); nc.tut('R'); }
  if (hIs) hc.isaret(hIs[0], hIs[1]);
  if (hParmak) hc.parmak(...hParmak);
  if (dParmak) dParmak[0] === 'is' ? dc.isaret('R', dParmak[1]) : dc.parmak(...dParmak);
  if (nParmak) nc.parmak(...nParmak);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}
