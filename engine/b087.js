// Bölüm 87 · YARIM BARDAK (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_087_v5.md).
// Kaynak: research/aday_havuzu_acik_2026-11-28.md § A2 ve avukat düzeltmeleri. Kısıt sınıfı S3 (işlevsel sabitlik).
// Logline: Doktor Hikmet Bey'e günde yalnız yarım bardak çay izin verdi: ağzına kadar dolu bardağın tam yarısı. Çay ocağında
// demlik ve tepside altı ince belli bardaklık takım var; ölçü kabı yok. Necmi bardağı yarı boyuna kadar doldurur; Defne:
// "bardağın beli ince". Hikmet "eğip bakalım" der; Defne: "eğmek düz bardakta tutar".
// Akılda kalacak tek şey: yarımı ölçemezsin ama eşitliği görebilirsin.
// Sızıntı yasağı: sahnede hiçbir karede iki bardak yan yana tek başına gösterilmez, iki bardakta çay yok, iki seviye
// karşılaştırılmaz. Tepsideki takım (altı bardak) hep birlikte görünür. İpucu: Necmi tepsideki bardakları sayar.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OCAK = 'b087_ocak';
const X = { hik: 200, nec: 500, necSag: 610, necDok: 548, def: 780 };
const HIK_Y = 1590;                                // Hikmet bir basamak alçakta: başı kartın altında kalsın
const NEC_Y = 1465;                                // Necmi bir basamak yüksekte (tezgâhın arkasında)
// (28 Kas düzeltme) Tezgâh derin: ön kenar grup plânında altyazı bandının altına (ekran ≈ 1440) iner; dolap önü yalnız
// Instagram arayüzünün kapladığı bantta kalır. Nesneler tezgâhın arka yarısında (karakterlerin kolu yetişir).
const TEZ = { ust: 1205, on: 1539 };               // tezgâhın üst yüzü (arka kenar) ve ön kenarı
const SY = 1284;                                   // tezgâhta nesnelerin oturduğu çizgi (demlik)
const BK = 3.2;                                    // bardak ölçeği (yerel 34 × 38 → 109 × 122)
const DS = 1.0;                                    // demlik ölçeği (dökerken çene hizasının altında kalsın)
const TEPSI = { x: 460, y: 1282, rx: 228, ry: 48 };
// takım: altı bardak; önce arka sıra (soldan sağa), sonra ön sıra. Arka sağdaki (f2) doldurulan bardak
const BARDAKLAR = [[372, 1250], [488, 1250], [604, 1250], [316, 1305], [432, 1305], [548, 1305]];
const F2 = 2, F0 = 3;
const IPUCU = [0, 1];                              // ipucu: Necmi arka sıradaki iki boş bardağı kaldırıp yan yana tutar
const DEM = { x: 735, y: SY };                     // demlik (pirinç altlıkta)
const REC = { w: 164, h: 190 };                    // reçete
const CAY = '#B4532F', CAY_A = '#D88A5A';
const KAM = {
  hikmet: [1.48, 300, 1100],
  hikmet2: [1.6, 290, 1100],
  necmi: [1.7, 650, 1128],
  defne: [1.72, 712, 1040],
  grup: [1.3, 492, 1168],
  sayacSon: [1.42, 490, 1176],
  buldum: [1.5, 780, 1090],
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.1, eye: 1.0, pupil: 1, curve: 0.05, open: 0, w: 0.9 },     // Hikmet: doktorun sözü
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  saskin: { brow: 0.11, browTilt: -0.12, eye: 1.2, pupil: 0.8, curve: 0, open: 0, w: 0.7 },
  emin: { brow: 0.02, browTilt: 0.06, eye: 0.98, pupil: 1, curve: 0.24, open: 0, w: 1.0 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Bardak (ince belli) ═══════════════════════════
// Yerel birim: taban ortası (0, 0), yukarı eksi. Tutuş noktası belin hizası (GY).
const DIS = [[-17, -38], [17, -38], [10, -22], [15, -6], [12, 0], [-12, 0], [-15, -6], [-10, -22]];
const IC = [[-15.2, -36.4], [15.2, -36.4], [8.4, -22], [13, -6.2], [10.2, -3.2], [-10.2, -3.2], [-13, -6.2], [-8.4, -22]];
const GY = -1;
const BOY = 38;
// poz: { p: tutuş noktası (dünya), a: açı (derece; eksi = ağzı sola yatar) }
const yerden = ([x, yb]) => ({ p: [x, yb + GY * BK], a: 0 });
const dunyaya = (poz, [lx, ly]) => { const a = poz.a * D2R, x = lx * BK, y = (ly - GY) * BK; return [poz.p[0] + x * Math.cos(a) - y * Math.sin(a), poz.p[1] + x * Math.sin(a) + y * Math.cos(a)]; };
// Dik bardakta "boyun f'si" seviyesinin dünya y'si
const dikSeviye = (poz, f) => dunyaya({ ...poz, a: 0 }, [0, -BOY * f])[1];
// Eğme: ağzın alçalan dudağı ile karşı dip köşesi aynı hizaya gelince (klasik "eğ" yöntemi)
const EGIK = -Math.atan2(IC[4][1] - IC[0][1], IC[4][0] - IC[0][0]) / D2R;   // ≈ −52°
function bardak(K, poz, { yuzey = null, mercan = 0, kontur = null } = {}) {
  const { ctx } = K, dis = DIS.map(q => dunyaya(poz, q)), ic = IC.map(q => dunyaya(poz, q));
  K.poly(dis, '#F3EEE4', 0);
  if (yuzey !== null || mercan > 0.01) {
    ctx.save(); K.path(ic); ctx.clip();
    if (yuzey !== null) {
      ctx.fillStyle = CAY; ctx.fillRect(poz.p[0] - 200, yuzey, 400, 300);
      H.strokeLine(ctx, [poz.p[0] - 200, yuzey], [poz.p[0] + 200, yuzey], 4, CAY_A);
    }
    if (mercan > 0.01) {   // olmayan kısım: çaysız boşluk mercan
      ctx.globalAlpha = 0.42 * mercan; ctx.fillStyle = PAL.coral;
      ctx.fillRect(poz.p[0] - 200, (yuzey ?? poz.p[1] + 400) - 600, 400, 600);
    }
    ctx.restore();
  }
  K.poly(dis, null, 2.6 * BK * 0.55);
  const [a, b] = [dunyaya(poz, [-10, -33]), dunyaya(poz, [-7, -26])];
  ctx.save(); ctx.lineCap = 'round'; H.strokeLine(ctx, a, b, 2.4 * BK * 0.6, '#FFFFFF'); ctx.restore();
  if (kontur) { ctx.lineWidth = 5; ctx.strokeStyle = kontur; K.path(dis); ctx.stroke(); }
}

// ═══════════════════════════ Diğer nesneler ═══════════════════════════
function tepsi(K) {
  const { x, y, rx, ry } = TEPSI;
  K.ell(x, y + 6, rx + 2, ry + 3, PAL.metalDark, LW * 0.8);
  K.ell(x, y, rx, ry, '#C9C2AE', LW * 0.8);
  K.ell(x, y, rx - 20, ry - 7, '#D9D3C1', 2.5);
}
// Demlik: poz = { p: gövde tabanının ortası, a: açı (derece, eksi = ağız sola eğilir) }. Ağız solda, kulp sağda.
const DEM_ICI = { agiz: [-62, -66], kulp: [52, -50] };
const demNok = (poz, [lx, ly]) => { const a = poz.a * D2R; lx *= DS; ly *= DS; return [poz.p[0] + lx * Math.cos(a) - ly * Math.sin(a), poz.p[1] + lx * Math.sin(a) + ly * Math.cos(a)]; };
function demlik(K, poz) {
  const { ctx } = K;
  ctx.save(); ctx.translate(poz.p[0], poz.p[1]); ctx.rotate(poz.a * D2R); ctx.scale(DS, DS);
  // ağız (emzik)
  ctx.beginPath(); ctx.moveTo(-30, -34); ctx.quadraticCurveTo(-52, -40, -64, -70); ctx.lineTo(-56, -72); ctx.quadraticCurveTo(-46, -50, -28, -50); ctx.closePath(); K.fs('#F1ECE0', LW * 0.7);
  // kulp
  ctx.beginPath(); ctx.moveTo(32, -62); ctx.quadraticCurveTo(66, -60, 60, -30); ctx.quadraticCurveTo(56, -16, 34, -18); ctx.lineWidth = LW * 2.6; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = LW * 1.2; ctx.strokeStyle = '#F1ECE0'; ctx.stroke();
  // gövde
  ctx.beginPath(); ctx.moveTo(-30, 0); ctx.quadraticCurveTo(-46, -36, -28, -66); ctx.lineTo(28, -66); ctx.quadraticCurveTo(46, -36, 30, 0); ctx.closePath(); K.fs('#F1ECE0', LW * 0.8);
  K.rect(-34, -44, 68, 14, PAL.coral, LW * 0.5, 4);
  // kapak
  K.ell(0, -68, 30, 8, '#E4DCCB', LW * 0.6); K.circ(0, -80, 8, PAL.coral, LW * 0.6);
  ctx.restore();
}
function altlik(K) { K.ell(DEM.x, SY + 2, 46 * DS, 9, PAL.mustard, LW * 0.6); }
// Katlanmış çizgili kurulama bezi (sağ önde)
function bez(K) {
  const { ctx } = K;
  ctx.save(); ctx.translate(800, 1478);
  K.poly([[-96, -26], [84, -34], [100, 22], [-84, 30]], '#F2E6CF', LW * 0.8);
  for (const u of [0.22, 0.5, 0.78]) {
    const x0 = lerp(-96, 84, u), x1 = lerp(-84, 100, u);
    H.strokeLine(ctx, [x0, lerp(-26, -34, u) + 2], [x1, lerp(30, 22, u) - 2], 9, PAL.coral);
  }
  H.strokeLine(ctx, [-90, 4], [92, -4], 3, 'rgba(20,30,28,0.35)');
  ctx.restore();
}
// Reçete: c merkez, rot derece. Üstte doktor yazısı çizgisi, ortada büyük "½", altta "BARDAK"
function recete(K, c, rot = 0) {
  const { ctx } = K, w = REC.w, h = REC.h;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(rot * D2R);
  K.rect(-w / 2 + 7, -h / 2 + 9, w, h, 'rgba(20,30,28,0.25)', 0, 6);
  K.rect(-w / 2, -h / 2, w, h, '#F7F4EC', LW * 0.7, 6);
  K.rect(-w / 2, -h / 2, w, 26, PAL.teal, LW * 0.5, 6);
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w / 2 + 18, -h / 2 + 46);
  for (let j = 0; j < 6; j++) ctx.quadraticCurveTo(-w / 2 + 24 + j * 22, -h / 2 + 38 + (j % 2) * 14, -w / 2 + 18 + (j + 1) * 22, -h / 2 + 46);
  ctx.lineWidth = 3.5; ctx.strokeStyle = '#3E5A6B'; ctx.stroke();
  K.text('½', 0, 32, 84, '#7A3B22', 900);
  K.text('BARDAK', 0, h / 2 - 18, 34, '#7A3B22', 900);
  ctx.restore();
}

// ═══════════════════════════ Mekân: çay ocağı ═══════════════════════════
function tezgah(K) {
  const x0 = -600, x1 = 1900;
  K.rect(x0, TEZ.ust, x1 - x0, TEZ.on - TEZ.ust, '#E6DCC6', LW * 0.8, 0);       // açık renk tezgâh üstü (derin)
  K.rect(x0, TEZ.ust + 6, x1 - x0, 10, '#D6CAB0', 0, 0);                         // arka kenarın gölgesi
  K.rect(x0, TEZ.on, x1 - x0, 24, '#CDBF9F', LW * 0.8, 0);                       // ön kenar dudağı
  K.rect(x0, TEZ.on + 24, x1 - x0, 1300, '#3F7F79', LW, 0);                      // yeşil dolap önü
  for (let x = -560; x < x1; x += 300) {
    K.rect(x, TEZ.on + 60, 270, 600, '#4C8F88', LW * 0.6, 8);
    K.rect(x + 115, TEZ.on + 94, 40, 12, '#E9DCC2', 3, 6);
  }
}
M.mekanEkle(OCAK, {
  gen: [-600, 1900], dongu: ['demliğin buharı', 'penceredeki martı'],
  kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'cizgili', zemin: 'karo' });
    M.pencere(K, 262, 770, 170, 220, { isik, t: t + 6, manzara: 'istanbul', kayit: false });
    // sağda çay ocağı panosu (yazısız) ve askı
    K.rect(880, 760, 150, 200, '#E9DCC2', LW * 0.7, 8); K.rect(896, 776, 118, 168, '#C7A36A', LW * 0.5, 4);
    for (let i = 0; i < 3; i++) K.rect(910, 800 + i * 48, 90, 10, '#F7F4EC', 2.5, 5);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), yarim: T('h1:3'), h1s: T('h1>'),
    h2: T('h2'), agzina: T('h2'), dolu: T('h2:2'), tam: T('h2:4'), yarisi: T('h2:5'), bir: T('h2:6'), damla: T('h2:7'), eksik: T('h2:8'), olmasin: T('h2:9'), h2s: T('h2>'),
    n0: T('n0'), bardagin: T('n0:1'), yari: T('n0:2'), boyuna: T('n0:3'), doldur: T('n0:5'), n0s: T('n0>'),
    d1: T('d1'), beli: T('d1:2'), ince: T('d1:3'), ustu: T('d1:4'), genis: T('d1:6'), d1s: T('d1>'),
    h3: T('h3'), egip: T('h3:1'), dibi: T('h3:3'), yarimdir: T('h3:5'), h3s: T('h3>'),
    d2: T('d2'), duz: T('d2:1'), tutar: T('d2:3'), peki: T('d2:4'), nasil: T('d2:7'), d2s: T('d2>'),
  };
  // Necmi: sağa bir adım, demliği alır, f2'ye yarı boyuna kadar döker, geri koyar
  tm.adim = tm.n0 - 0.2;
  tm.demAl = tm.n0 + 0.2; tm.demKalk = tm.n0 + 0.42; tm.dokBas = tm.yari - 0.25; tm.dokBit = tm.doldur + 0.35; tm.demDon = tm.dokBit + 0.15; tm.demBirak = tm.demDon + 0.55;
  // Defne: f2'yi alır (d1 "Olmaz"), gösterir; h3'te eğer; d2 sonunda dikleştirir; sayaçta tepsiye geri koyar
  tm.bAl = tm.d1 - 0.05; tm.bKalk = tm.d1 + 0.25; tm.egKes = tm.h3s + 0.05; tm.egBas = tm.egKes + 0.1; tm.egDon = tm.peki - 0.1; tm.bKoy = tm.cd0 + 0.25; tm.bBirak = tm.bKoy + 0.7;
  // İpucu (sözsüz, sayacın son yarısı): Necmi arka sıradaki iki boş bardağı iki eliyle alır, göğüs hizasında yan yana tutar,
  // birine, öbürüne, sonra bize bakar. Çay yok, seviye yok; bardaklar kesime kadar elinde kalır.
  tm.ipUzan = tm.cd0 + 5.0; tm.ipKalk = tm.ipUzan + 0.32; tm.ipBak1 = tm.ipKalk + 0.7; tm.ipBak2 = tm.ipBak1 + 0.8; tm.ipBize = tm.ipBak2 + 0.85;
  tm.ustKes = tm.cd0 + 1.25; tm.ustBit = tm.cd0 + 4.45;
  tm.hikKes = 0; tm.necKes = tm.n0 - 0.12; tm.defKes = tm.d1 - 0.12; tm.grupKes = tm.h3 - 0.12; tm.def2Kes = tm.d2 - 0.12; tm.cdKes = tm.cd0 - 0.05;
  const film = H.sahneler([
    { id: 'hikmet', t0: 0, cam: [[0, ...KAM.hikmet], [tm.h2 - 0.15, ...KAM.hikmet2], [tm.necKes - 0.1, 1.66, 294, 1100]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.defKes - 0.1, 1.74, 652, 1128]] },     // Necmi, demlik ve bardak
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.grupKes - 0.1, 1.75, 712, 1036]] },
    { id: 'grup', t0: tm.grupKes, kisa: true, cam: [[0, ...KAM.grup], [tm.egKes - 0.1, 1.31, 492, 1168]] },
    { id: 'defne2', t0: tm.egKes, cam: [[0, 1.76, 680, 1032], [tm.cdKes - 0.1, 1.8, 680, 1030]] },   // eğme yakın plânı: bardak ekranın büyük parçası
    { id: 'sayac', t0: tm.cdKes, cam: [[0, ...KAM.grup]] },   // sayaç ve ipucu: doğrusal itme kamera() ile
    { id: 'ust', t0: tm.ustKes, kisa: true, cam: [[0, 2.0, 515, 1232]] },   // insert: tepsi yakın (altı bardak, çaylı bardak, demlik); karakterler kadraj dışında
    { id: 'sayac2', t0: tm.ustBit, cam: [[0, ...KAM.grup]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.5, 520, 1100]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  const tlS = tl;
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlA };
}

// ═══════════════════════════ Zaman durumları ═══════════════════════════
// Demlik pozu ve dökme
function demAt(tm, t) {
  const yer = { p: [DEM.x, DEM.y], a: 0 };
  const dok = { p: [702, 1130], a: -38 };           // ağız f2'nin ağzının hemen üstünde; demlik iki yüzün de çenesinin altında
  if (t < tm.demKalk) return { poz: yer, tut: t >= tm.demAl - 0.05 };
  const u1 = ease.enter(seg(t, tm.demKalk, 0.45)), u2 = ease.state(seg(t, tm.demDon, 0.5));
  const yol = (a, b, u, lift) => H.yay(a, b, u, lift);
  let p = yol(yer.p, dok.p, u1, 40), a = lerp(0, -12, u1);
  a += lerp(0, dok.a + 12, ease.state(seg(t, tm.dokBas - 0.25, 0.25)));
  if (t >= tm.demDon) { p = yol(dok.p, yer.p, u2, 30); a = lerp(dok.a, 0, ease.state(seg(t, tm.demDon, 0.35))); }
  return { poz: { p, a }, tut: t < tm.demBirak + 0.05 };
}
const akisU = (tm, t) => [ease.state(seg(t, tm.dokBit - 0.12, 0.2)), ease.state(seg(t, tm.dokBas, 0.12))];   // [u0, u1]
// f2'deki çayın dik bardaktaki boyu (bardak boyunun kesri)
function dolu(tm, t) { return 0.5 * clamp01((t - tm.dokBas - 0.08) / (tm.dokBit - tm.dokBas - 0.2)); }
// f2'nin pozu: tepside → Defne'nin elinde (göster) → eğik → dik → tepsiye
function f2At(tm, t) {
  const yer = yerden(BARDAKLAR[F2]);
  const goster = { p: [632, 1196], a: 0 };
  if (t < tm.bKalk) return { poz: yer, kim: t >= tm.bAl ? 'defne' : 'yer' };
  if (t < tm.bKoy) {
    const p = H.yay(yer.p, goster.p, ease.enter(seg(t, tm.bKalk, 0.42)), 30);
    const eg = ease.state(seg(t, tm.egBas, 0.6)) * (1 - ease.state(seg(t, tm.egDon, 0.45)));
    const kalk = t >= tm.egKes && t < tm.cdKes ? 1 : 0;   // eğme yakın plânında bardak göğüs hizasında (altyazıdan uzak)
    void kalk; return { poz: { p, a: EGIK * eg }, eg, kim: 'defne' };
  }
  const p = H.yay(goster.p, yer.p, ease.state(seg(t, tm.bKoy, tm.bBirak - tm.bKoy)), 40);
  return { poz: { p, a: 0 }, kim: t < tm.bBirak + 0.3 ? 'defne' : 'yer' };
}
// İpucu bardakları (IPUCU[0] sol el, IPUCU[1] sağ el): tepside → göğüs hizasında yan yana
const IP_HEDEF = [[452, 1202], [574, 1202]];
function ipAt(tm, t, j) {
  const yer = yerden(BARDAKLAR[IPUCU[j]]);
  if (t < tm.ipKalk) return { poz: yer, kim: t >= tm.ipUzan ? 'necmi' : 'yer' };
  const p = H.yay(yer.p, IP_HEDEF[j], ease.enter(seg(t, tm.ipKalk + 0.06 * j, 0.45)), 24);
  const yak = 6 * ease.state(seg(t, tm.ipBak1, 1.4));   // iki bardak yavaşça birbirine yaklaşır (ağızlar yan yana)
  return { poz: { p: [p[0] + (j ? -yak : yak), p[1]], a: 0 }, kim: 'necmi' };
}
function f2Yuzey(tm, t, b) {
  const f = dolu(tm, t); if (f <= 0.01) return null;
  const dik = dikSeviye(b.poz, f);
  if (!b.eg) return dik;
  const dudak = dunyaya(b.poz, IC[0])[1];
  return lerp(dik, dudak, b.eg);
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'ust') {   // insert: yavaş doğrusal itme (tepsinin ortasına)
      const u = clamp01((t - tm.ustKes) / (tm.ustBit - tm.ustKes));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(2.0), Math.log(2.12), u)), cx: lerp(515, 512, u), cy: lerp(1232, 1236, u) });
    }
    if (B.sc.id === 'sayac' || B.sc.id === 'sayac2') {   // sayaç ve ipucu: doğrusal itme
      const u = clamp01((t - tm.cdKes) / (tm.buldum - tm.cdKes));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(KAM.grup[0]), Math.log(KAM.sayacSon[0]), u)), cx: lerp(KAM.grup[1], KAM.sayacSon[1], u), cy: lerp(KAM.grup[2], KAM.sayacSon[2], u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (t >= tm.tutar - 0.3 && t < tm.peki + 0.6) H.mark(K, t, tm.tutar - 0.04, tm.peki + 0.4, B.ekr(dunyaya(f2At(tm, t).poz, [0, -19])), false);   // eğme bu bardakta tutmaz
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    // eğme yakın plânında balon tezgâha iner ve d2 iki tek satıra bölünür: eğik bardağın dibi (çay üçgeni) açık kalsın
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, B.heads, { y: B.sc.id === 'defne2' ? 1312 : 1255, split: { h2: 6, d2: 4 } });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (perde yok; paylaşım hapı yok): daire solda altta, başlık sağda
function sayac(K, t, t1, { dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 190, y = 1330, r = 68;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 11, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 21, 58, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(600, 1330); ctx.scale(inU * out, inU * out);
  ctx.font = '900 50px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 60;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 18, 50, INK, 900);
  ctx.restore();
}

// ═══════════════════════════ Dünya ═══════════════════════════
const bak = (from, to, dy = 0.1) => [clamp01(Math.abs(to[0] - from[0]) / 420) * 0.8 * Math.sign(to[0] - from[0]), dy];

function sahne(K, t, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  const tlTum = S.tlS;
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  if (id === 'ust') {   // insert: yalnız tezgâh ve takım (kamera tepsiye yakın; karakterler kadrajın dışında)
    tezgah(K); bez(K); tepsi(K);
    for (let i = 0; i < BARDAKLAR.length; i++) bardak(K, yerden(BARDAKLAR[i]), i === F2 ? { yuzey: dikSeviye(yerden(BARDAKLAR[i]), 0.5) } : {});
    altlik(K); demlik(K, { p: [DEM.x, DEM.y], a: 0 });
    H.buhar(K, DEM.x - 66 * DS, SY - 82 * DS, t, { k: 0.55, n: 2 });
    H.buhar(K, BARDAKLAR[F2][0], BARDAKLAR[F2][1] - BOY * BK - 6, t + 0.6, { k: 0.4, n: 2 });
    return;
  }
  const sayacta = t >= tm.cd0 - 0.05 && t < tm.buldum;
  const ipucu = t >= tm.ipUzan - 0.3 && t < tm.buldum;
  const dm = demAt(tm, t), b2 = f2At(tm, t), yz = f2Yuzey(tm, t, b2);
  const ip = [ipAt(tm, t, 0), ipAt(tm, t, 1)];
  const ipOrta = [(ip[0].poz.p[0] + ip[1].poz.p[0]) / 2, ip[0].poz.p[1] - 60];
  const camGrip = dunyaya(b2.poz, [0, GY]);   // tutuş (bel)
  const bF0 = BARDAKLAR[F0];

  // ——— Hikmet (solda; reçete) ———
  const kalk = W(t, 0.3, 0.42) * (1 - W(t, tm.h1s + 0.1, 0.4));              // 0,3 sn: reçeteyi yüzünün yanına kaldırır
  const sayacRec = sayacta ? pIn(t, tm.cd0 + 1.4, tm.cd0 + 4.6, 0.4, 0.4) : 0;  // sayaçta reçeteye yeniden bakar
  const rk = kalk; void sayacRec;
  const RC = kar([90, 1150], [52, 1092], rk), RR = lerp(-6, -3, rk);
  let hL = t < tm.h2 - 0.2 ? [0.0, 0.05] : [0.5, 0.35];
  if (kalk > 0.5) hL = [-0.45, 0.15];
  const hp = H.kisi('hikmet', { x: X.hik, y: HIK_Y, expr: IF.ciddi, ...POZ.dur, head: { tilt: 0, look: hL } });
  const hO = { heads };
  const recEl = [RC[0] - REC.w / 2 + 6, RC[1] + 26];
  if (id === 'hikmet') hO.L = [recEl, 1, 'A'];
  // h2: sağ işaret parmağı f0'ın ağzına ("Ağzına kadar dolu"), sonra boyunun ortasına ("tam yarısı"); "Bir damla …": parmak yukarı
  const agiz0 = [bF0[0] + 6, bF0[1] - BOY * BK + 4], orta0 = [bF0[0] + 14, bF0[1] - BOY * BK * 0.5];
  const wGos = pIn(t, tm.agzina - 0.3, tm.bir - 0.05, 0.28, 0.3);
  const wYuk = pIn(t, tm.bir - 0.05, tm.h2s + 0.2, 0.3, 0.3);
  const gosHedef = kar(agiz0, orta0, ease.state(seg(t, tm.tam - 0.1, 0.35)));
  if (wGos > 0.01) { hO.R = [[gosHedef[0] - 26, gosHedef[1] + 30], wGos, 'A']; hp.head.look = [0.6, 0.55]; }
  else if (wYuk > 0.01) hO.R = [[X.hik + 120 + 10 * Math.sin(TAU * (t - tm.bir) / 0.55) * clamp01((t - tm.damla + 0.1) / 0.2), 1060], wYuk, 'B'];
  // h3 (grup): "eğip bakalım": avucu yan yatar (eğme hareketi); bakış Defne'nin bardağında
  const wEg = pIn(t, tm.h3 - 0.2, tm.h3s + 0.1, 0.3, 0.3);
  if (wEg > 0.01) { const a = -0.9 * ease.state(seg(t, tm.egip - 0.1, 0.5)); hO.R = [[X.hik + 150 + 30 * Math.sin(a), 1110 + 20 * (1 - Math.cos(a))], wEg, 'B']; }
  if (t >= tm.n0 - 0.2 && t < tm.h3) hL = bak([X.hik], [X.def], 0.3);
  if (t >= tm.h3 - 0.2 && t < tm.cd0) { hL = bak([X.hik], [680], 0.35); hp.expr = IF.notr; }
  if (sayacta) { hp.expr = IF.dusun; hL = sayacRec > 0.3 ? [-0.5, 0.35] : bak([X.hik], [560], 0.4); }
  // sayaç: sağ eli çenesinde düşünür (iki kez; ikincisinde Necmi'nin bardaklarına bakar)
  const hCene = sayacta ? pIn(t, tm.cd0 + 1.2, tm.cd0 + 4.4, 0.3, 0.3) + pIn(t, tm.ipKalk + 0.9, tm.cd0 + 9.6, 0.3, 0.3) : 0;
  if (hCene > 0.01) { const h = H.eklem('hikmet', hp, 'head'); hO.R = [[h[0] + 0.3 * hp.s, h[1] + 0.52 * hp.s], hCene, 'B']; hL = [0.4, -0.15]; }
  if (ipucu && t >= tm.ipKalk) { hL = bak([X.hik], ipOrta, 0.3); hp.expr = IF.merak; }
  if (wGos > 0.01) hL = [0.6, 0.55];
  hp.head.look = hL;
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);

  // ——— Necmi (tepsinin arkasında) ———
  const np = H.kisi('necmi', { x: X.nec, y: NEC_Y, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [-0.5, 0.15] } });
  if (t >= tm.adim) H.yanAdim(np, t, { t0: tm.adim, x0: X.nec, x1: X.necSag, adim: 1 });
  // demliği kaldırınca bir adım sola: döktüğü demlik yüzünün önüne gelmesin; geri koyarken yine sağa
  if (t >= tm.demKalk) H.yanAdim(np, t, { t0: tm.demKalk, x0: X.necSag, x1: X.necDok, adim: 1 });
  if (t >= tm.demDon - 0.1) H.yanAdim(np, t, { t0: tm.demDon - 0.1, x0: X.necDok, x1: X.necSag, adim: 1 });
  if (t >= tm.cd0 + 0.3) H.yanAdim(np, t, { t0: tm.cd0 + 0.3, x0: X.necSag, x1: 520, adim: 1 });   // sayaçta tepsinin ortasına döner
  const nx = np.x;
  let nL = t < tm.tam - 0.1 ? bak([nx], [X.hik], 0.15) : t < tm.h2s ? [-0.5, 0.5] : [0.3, 0.5];
  const nO = { heads };
  // n0: demliği alır, f2'ye döker
  const wDem = pIn(t, tm.demAl - 0.28, tm.demBirak, 0.28, 0.3);
  const kulp = demNok(dm.poz, DEM_ICI.kulp);
  if (wDem > 0.01) { nO.R = [[kulp[0] - 6, kulp[1] + 22], wDem, 'B']; nL = [0.35, 0.55]; np.expr = IF.emin; }
  if (t >= tm.n0 && t < tm.d1) np.expr = IF.emin;
  if (t >= tm.d1 - 0.1 && t < tm.cd0) { np.expr = IF.merak; nL = t < tm.h3 ? bak([nx], [X.def], 0.25) : [0.5, 0.45]; }
  // sayaç: çenesini tutar, başını kaşır, tepsiye bakar; ipucu (sözsüz): iki boş bardağı kaldırıp yan yana tutar
  let nCene = 0, nKas = 0, nIp = 0;
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.dusun;
    nCene = pIn(t, c0 + 1.0, c0 + 3.4, 0.3, 0.3);
    if (nCene > 0.01) { const h = H.eklem('necmi', np, 'head'); nO.L = [[h[0] - 0.42 * np.s, h[1] + 0.5 * np.s], nCene, 'B']; nL = [-0.3, -0.2]; }
    if (t >= c0 + 3.4) nL = Math.floor((t - c0 - 3.4) / 0.8) % 2 ? [-0.4, 0.55] : [0.2, 0.55];
    nKas = pIn(t, c0 + 3.5, c0 + 4.7, 0.3, 0.25);   // başını kaşır
    if (nKas > 0.01) { const h = H.eklem('necmi', np, 'head'); nO.R = [[h[0] + 0.3 * np.s + 6 * Math.sin(TAU * (t - c0) / 0.4), h[1] - 0.55 * np.s], nKas, 'B']; nL = [0.3, 0.4]; }
    if (ipucu) {
      nIp = W(t, tm.ipUzan, 0.28);
      const g0 = dunyaya(ip[0].poz, [0, -16]), g1 = dunyaya(ip[1].poz, [0, -16]);   // tutuş: gövdenin alt yarısı
      nO.L = [[g0[0] - 10, g0[1] + 14], nIp, 'A']; nO.R = [[g1[0] + 10, g1[1] + 14], nIp, 'A'];
      nL = t < tm.ipKalk ? [-0.1, 0.6] : t < tm.ipBak1 ? [0, 0.45] : t < tm.ipBak2 ? [-0.35, 0.35] : t < tm.ipBize ? [0.35, 0.35] : [0, 0.02];
      np.expr = t >= tm.ipBize ? IF.emin : IF.merak;
      if (t >= tm.ipBize) H.onayla(np, t, tm.ipBize + 0.15, 1, 0.42);   // bize bakıp bir kez başını sallar
    }
  }
  if (id === 'cevap') { nL = bak([nx], [X.def], 0.3); np.expr = IF.merak; }
  np.head.look = nL;
  const necOnde = t >= tm.n0 - 0.3 && t < tm.d1 - 0.1;   // dökerken Necmi Defne'nin önünde çizilir (kolu görünsün)
  let nc = necOnde ? null : oyna(K, t, tlTum, 'necmi', np, nO);

  // ——— Defne (sağda) ———
  let dL = [-0.45, 0.2], dE = IF.sakin;
  if (t < tm.n0 - 0.2) dL = bak([X.def], [X.hik], 0.1);
  else if (t < tm.d1) { dL = [-0.5, 0.55]; dE = IF.merak; }
  const dp = H.kisi('defne', { x: X.def, expr: dE, ...POZ.dur, head: { tilt: 0, look: dL } });
  const dO = { heads };
  const dTut = b2.kim === 'defne';
  if (dTut) dO.L = [[camGrip[0] + 4, camGrip[1] + 12], W(t, tm.bAl - 0.28, 0.28), 'A'];
  let dIs = 0, dIsHedef = null, dParmak = null;
  if (t >= tm.d1 - 0.1 && t < tm.cd0) {
    dE = IF.sakin;
    dL = t < tm.beli - 0.1 ? [0.45 * Math.sin(TAU * (t - tm.d1) / 0.5), 0.3] : [-0.35, 0.45];
    // "beli ince": sağ işaret parmağı bele; "üstü daha geniş": ağza çıkar
    const w1 = pIn(t, tm.beli - 0.3, tm.d1s + 0.25, 0.28, 0.3);
    const w2 = pIn(t, tm.duz - 0.3, tm.peki - 0.05, 0.28, 0.3);    // d2: "düz bardakta": yine bel
    dIs = Math.max(w1, w2);
    const bel = dunyaya(b2.poz, [10.5, -22]), ust = dunyaya(b2.poz, [17, -34]);
    dIsHedef = w1 > 0.01 ? kar(bel, ust, ease.state(seg(t, tm.ustu - 0.1, 0.35))) : bel;
    if (dIs > 0.01) dO.R = [[dIsHedef[0] + 48, dIsHedef[1] + 12], dIs, 'A'];
    if (t >= tm.h3 - 0.1) dL = [-0.3, 0.5];
    if (t >= tm.peki - 0.05) { dL = [0, 0.05]; dE = IF.merak; }
  }
  if (sayacta) {
    const c0 = tm.cd0;
    dE = IF.dusun;
    const dThink = pIn(t, c0 + 1.9, c0 + 4.9, 0.35, 0.35) + (t >= tm.ipBize + 0.3 ? W(t, tm.ipBize + 0.3, 0.35) : 0);   // ipucundan sonra yeniden yumruk çenede
    dL = t < tm.bBirak ? [-0.4, 0.55] : dThink > 0.4 ? [0.25, -0.25] : [-0.5, 0.5];
    if (dThink > 0.01) { const h = H.eklem('defne', dp, 'head'); dO.R = [[h[0] + 0.1 * dp.s, h[1] + 0.62 * dp.s], dThink, 'B']; }   // yumruk çenede
    if (ipucu && t >= tm.ipKalk) { dE = IF.merak; dL = bak([X.def], ipOrta, 0.35); }
  }
  if (id === 'buldum') { dE = IF.gulus; dL = [0, -0.1]; }
  if (id === 'cevap') { dE = IF.sakin; dL = [-0.2, 0.2]; }
  dp.expr = dE; dp.head.look = dL;
  dp.y -= H.buldumHop(t, tm.buldum, 50);
  if (id === 'buldum') dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  if (necOnde) nc = oyna(K, t, tlTum, 'necmi', np, nO);

  // ——— Tezgâh ve nesneler (karakterlerin önünde) ———
  tezgah(K);
  bez(K);
  tepsi(K);
  for (let i = 0; i < BARDAKLAR.length; i++) {
    if (i === F2 && b2.kim !== 'yer') continue;
    const j = IPUCU.indexOf(i);
    if (j >= 0 && ip[j].kim !== 'yer') continue;
    if (i === F2) bardak(K, b2.poz, { yuzey: yz });
    else bardak(K, yerden(BARDAKLAR[i]));
  }
  altlik(K);
  // dökülen çay (demliğin ağzından bardağa)
  if (t >= tm.dokBas && t < tm.dokBit + 0.1) {
    const [u0, u1] = akisU(tm, t), ag = demNok(dm.poz, DEM_ICI.agiz);
    H.akis(K, ag, [BARDAKLAR[F2][0] - 4, yz ?? (BARDAKLAR[F2][1] - 8)], 8, CAY, u0, u1);
  }
  demlik(K, dm.poz);
  if (t < tm.demKalk || t >= tm.demBirak) H.buhar(K, DEM.x - 66 * DS, SY - 82 * DS, t, { k: 0.55, n: 2 });
  else { const ag = demNok(dm.poz, DEM_ICI.agiz); H.buhar(K, ag[0], ag[1] - 6, t, { k: 0.45, n: 2 }); }
  if (b2.kim !== 'yer') {   // elde tutulan f2 (karakterlerin elinin altında)
    const merc = Math.max(pIn(t, tm.ustu - 0.05, tm.h3 - 0.2, 0.3, 0.3), 0);   // eğik bardakta mercan yok: çay çizgisi görünsün
    bardak(K, b2.poz, { yuzey: yz, mercan: merc });
  }
  for (const b of ip) if (b.kim !== 'yer') bardak(K, b.poz);   // ipucu: Necmi'nin elindeki iki boş bardak
  const recVar = id === 'hikmet';
  if (recVar) recete(K, RC, RR);
  // tutan eller (nesnenin üstünde)
  if (recVar) hc.tut('L');
  if (wGos > 0.6) hc.isaret('R', gosHedef);
  if (wYuk > 0.6) hc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 + 0.2, boy: 1 });
  if (hCene > 0.6) hc.tut('R');
  if (wDem > 0.6) nc.tut('R');
  if (nCene > 0.6) nc.tut('L');
  if (nIp > 0.6) { nc.tut('L'); nc.tut('R'); }
  if (nKas > 0.6) nc.tut('R');
  if (dTut && W(t, tm.bAl - 0.28, 0.28) > 0.6) dc.tut('L');
  if (dIs > 0.6 && dIsHedef) dc.isaret('R', dIsHedef);
  if (dParmak === 'yanak') dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
  void ipucu;
}
