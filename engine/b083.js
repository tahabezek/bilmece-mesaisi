// Bölüm 83 · TAŞ-KÂĞIT-MAKAS ÇETELESİ (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_083_v5.md).
// Kaynak: Katagiri; Nob Yoshigahara, Puzzles 101. Mekanizma: berabere el yoksa Necmi'nin altı makası Defne'nin makas dışı
// altı hamlesine, Defne'nin dört makası Necmi'nin makas dışı dört hamlesine denk gelir (cevap arşivde kalır, kesilir).
// Logline: Çay ocağında bulaşığı kimin yıkayacağı taş-kâğıt-makasla belirlenir. Necmi ile Defne yüksek masanın iki yanında
// on el oynar; eller masadaki bulaşık kulesinin arkasında kalır. Kerem merakından kazananı değil, ikisinin attıklarını
// yazar; sonra çeteleyi çevirip gösterir. Hikmet: "Hiçbir elde ikiniz aynı şeyi atmadınız. Kim kaç el kazandı?"
// Akılda kalacak tek şey: berabere yoksa makaslar hep makas olmayan hamleye denk gelir.
// Sızıntı yasağı: hiçbir elde kimin neyle karşılaştığı görünmez (eller kulenin arkasında; kamera Kerem'in kalemine kesilir;
// Kerem oyun boyunca çetelenin arkasını gösterir). Kimse sevinmez, üzülmez; skor ve bulaşığın kimde kaldığı yok. Görünen
// hiçbir el çifti aynı şey değildir: oyun boyunca iki el de hiçbir karede görünmez. Çetelenin iki sütunu aynı renk, aynı
// boyda; bakışlar iki sütunda eşit süre gezer; sayaçta kalem ya da parmak hiçbir hücrede beklemez.
// Mekân 046'dan farklı: kendi çay ocağı (fayans duvar, yüksek masa, bulaşık kulesi); 046'daki yan yana oyun ve görünen el
// şekilleri yok. Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OCAK = 'b083_ocak';
// Oyun düzeni (A): Hikmet solda önden; Necmi ve Defne yüksek masanın iki yanında, yandan, karşı karşıya; Kerem masanın
// arkasında (derinlikte), kulenin hemen arkasında durur, elleri yukarıdan görür.
const YA = { hik: 200, nec: 390, def: 845, ker: 615, kerY: 1410, kerS: 0.88 };
const MASA = { x0: 470, x1: 760, y: 1250 };
const KULE = { x: 615, w: 204 };                     // bulaşık kulesi: tepsi, tabaklar, kâseler, çay bardakları (üst ≈ 1055)
// Çetele düzeni (B): Kerem önde ortada, çeteleyi iki yanından tutup gösterir; Necmi solunda, Defne sağında; Hikmet ocakta.
const YB = { nec: 200, ker: 540, def: 880, hik: 1185 };
const TB = { w: 520, h: 300 };                       // çetele tahtası (yerel: merkez 0,0)
const BC = [540, 1227];                              // çetelenin merkezi (dünya, B düzeni)
const ZB = 1.05;                                     // çetele plânının zoom'u (yazı 40 × KB = 42 → ekranda 44 px)
const KB = 1.05;                                     // çetelenin taban ölçeği (dünya)
const camB = z => ({ zoom: z, cx: 545, cy: 806 + (960 - 545) / z });
const BS = H.toScreen(camB(ZB), BC);                 // çetelenin ekrandaki merkezi (sayaçta sabit)
const camSayac = z => ({ zoom: z, cx: BC[0] - (BS[0] - 540) / z, cy: BC[1] - (BS[1] - 960) / z });

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz; konuşurken talkAt ağzı açar)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  kararli: { brow: -0.01, browTilt: 0.2, eye: 0.95, pupil: 1, curve: 0.06, open: 0, w: 0.85 },   // oyuna hazır: kaşlar hafif çatık
  dikkat: { brow: 0.03, browTilt: 0.06, eye: 1.08, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },   // Kerem: yazar, dikkatle bakar
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.08, open: 0, w: 0.8 },
  hakem: { brow: 0.06, browTilt: 0.1, eye: 1.05, pupil: 0.95, curve: 0.12, open: 0, w: 0.95 },   // Hikmet: işi ciddiye alan hakem
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },   // düşünür: kaşlar hafif kalkık, ağız düz (somurtma yok)
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Nesneler ═══════════════════════════
// Çay bardağı (ince belli), boş ve lekeli: (x, yb) tabanı
function bardak(K, x, yb, k = 1) {
  const p = [[-13, -50], [13, -50], [8, -27], [13, -8], [10, -1], [-10, -1], [-13, -8], [-8, -27]].map(([a, b]) => [x + a * k, yb + b * k]);
  K.poly(p, '#EEF3EF', 3);
  K.poly([[x - 10 * k, yb - 9 * k], [x + 10 * k, yb - 9 * k], [x + 8 * k, yb - 2 * k], [x - 8 * k, yb - 2 * k]], '#B4583A', 0);   // dipte kalan çay
  K.poly(p, null, 3);
}
// Bulaşık kulesi (önden): tepsi, sekiz tabak, iki kâse, üç çay bardağı. a: sarsıntı açısı (derece, tabandan)
function kule(K, a = 0) {
  const { ctx } = K, x = KULE.x, y = MASA.y, w = KULE.w;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a * D2R); ctx.translate(-x, -y);
  K.ell(x, y - 5, w / 2 + 22, 11, '#C9CED1', LW * 0.7);                           // tepsi
  for (let i = 0; i < 8; i++) {                                                       // tabaklar (krem, kenarı mavi şerit)
    const yy = y - 14 - i * 10.5, dx = [0, 3, -2, 4, -3, 1, -4, 2][i];
    K.rect(x - w / 2 + dx, yy - 9, w, 12, i % 3 === 1 ? '#F3EEE4' : PAL.cream, 3.5, 6);
    K.line(x - w / 2 + 10 + dx, yy - 3, x + w / 2 - 10 + dx, yy - 3, 3, '#7FA8B0');
  }
  const ky = y - 98;                                                                   // kâseler (iki, iç içe)
  for (const [i, kw, kh, c] of [[0, 190, 34, '#E7E0D2'], [1, 176, 30, '#D9E4E0']]) {
    const yb = ky - i * 26;
    K.poly([[x - kw / 2, yb - kh], [x + kw / 2, yb - kh], [x + kw / 2 - 22, yb], [x - kw / 2 + 22, yb]], c, 3.5);
    K.ell(x, yb - kh, kw / 2, 7, c, 3.5);
  }
  // kâse ağzında yemek lekesi
  K.ell(x - 30, ky - 60, 26, 5, '#C98B4E', 0); K.ell(x + 40, ky - 61, 18, 4, '#9C6B3A', 0);
  for (const [dx, yb, r] of [[-48, ky - 56, -6], [0, ky - 58, 3], [46, ky - 56, 8]]) {   // çay bardakları kâsenin içinde
    ctx.save(); ctx.translate(x + dx, yb); ctx.rotate(r * D2R); bardak(K, 0, 0, 0.95); ctx.restore();
  }
  // (kaşık yok: kulenin tepesinden çıkan çizgi Kerem'in çenesine değiyor gibi duruyordu)
  ctx.restore();
}
// Yüksek masa (önden): kalın üst tabla, tek ayak, ağır taban
function masa(K) {
  const { x0, x1, y } = MASA, xm = (x0 + x1) / 2;
  K.rect(xm - 18, y + 20, 36, 1500 - y - 40, PAL.woodDark, LW, 4);
  K.ell(xm, 1490, 110, 14, PAL.woodDark, LW);
  K.rect(x0, y, x1 - x0, 26, PAL.woodTop, LW, 8);
  K.rect(x0 + 10, y + 26, x1 - x0 - 20, 10, PAL.wood, LW * 0.6, 4);
}
// Çaydanlık (ocakta, Hikmet'in plânı): demlik üstte, buhar döngüsü
function caydanlik(K, x, y, t) {
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 66, 60, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  K.poly([[x - 52, y - 46], [x - 98, y - 76], [x - 106, y - 64], [x - 56, y - 24]], PAL.metal, LW);
  K.rect(x - 50, y - 72, 100, 72, PAL.metal, LW, 14);
  K.rect(x - 32, y - 122, 64, 54, PAL.coral, LW, 12); K.circ(x, y - 128, 9, '#3A3F3C', LW * 0.6);
  H.buhar(K, x - 108, y - 84, t, { k: 0.6, n: 2, ara: 16, boy: 90 });
}

// ═══════════════════════════ Çetele ═══════════════════════════
// Yerel ölçüler (merkez 0,0): tahta ±260 × ±150; kâğıt −245..245 × −134..138; sütunlar: etiket, NECMİ, DEFNE, sağda 30 px boş pay (Kerem'in eli); satırlar: başlık + 3.
const SUT = [-245, -82, 68, 213], SAT = [-134, -70, -5, 59, 124];
const CETELE = { NECMİ: [3, 6, 1], DEFNE: [2, 4, 4] };
const ETIKET = ['TAŞ', 'MAKAS', 'KÂĞIT'];
const hucre = (i, r) => [(SUT[i + 1] + SUT[i + 2]) / 2, (SAT[r + 1] + SAT[r + 2]) / 2];   // i: 0 Necmi, 1 Defne; r: 0 taş, 1 makas, 2 kâğıt
// Çentikler: dörtlü dik çizgi + çapraz (beşli öbek), sonra yeni öbek
function centik(K, x0, ym, n, renk = '#3E4A47') {
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5), j = i % 5, gx = x0 + g * 56;
    if (j < 4) K.line(gx + j * 10, ym - 21, gx + j * 10 + 2, ym + 21, 5, renk);
    else K.line(gx - 7, ym + 15, gx + 3 * 10 + 8, ym - 15, 5, renk);
  }
}
// Tahta: (c) merkez (dünya), k ölçek, sx yatay çevirme (−1..1; işaret: + arka, − ön yüz görünür)
function cetele(K, c, k, sx = -1, { klips = true } = {}) {
  const { ctx } = K, w = TB.w, h = TB.h;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(k * Math.max(0.03, Math.abs(sx)), k);
  K.rect(-w / 2 + 9, -h / 2 + 11, w, h, 'rgba(20,30,28,0.3)', 0, 16);
  K.rect(-w / 2, -h / 2, w, h, '#A0703F', LW, 16);
  if (sx < 0) {   // ön yüz: kâğıt ve çetele
    K.rect(SUT[0], SAT[0], TB.w - 30, 272, '#FBF6EC', LW * 0.6, 6);
    K.line(SUT[0] + 6, SAT[1], TB.w / 2 - 21, SAT[1], 4, '#3E4A47');
    for (const x of [SUT[1], SUT[2], SUT[3]]) K.line(x, SAT[0] + 8, x, 132, 4, '#3E4A47');
    for (const y of [SAT[2], SAT[3]]) K.line(SUT[0] + 8, y, TB.w / 2 - 23, y, 2.5, '#B9B4A8');
    for (const [i, ad] of ['NECMİ', 'DEFNE'].entries()) K.text(ad, (SUT[i + 1] + SUT[i + 2]) / 2, SAT[1] - 14, 40, INK, 900);
    ETIKET.forEach((s, r) => {
      const ym = (SAT[r + 1] + SAT[r + 2]) / 2;
      K.text(s, (SUT[0] + SUT[1]) / 2, ym + 14, 40, INK, 900);
      for (const [i, ad] of ['NECMİ', 'DEFNE'].entries()) {
        const x0 = SUT[i + 1] + 14, n = CETELE[ad][r];
        centik(K, x0, ym, n);
        K.text(String(n), SUT[i + 2] - 30, ym + 18, 52, INK, 900);
      }
    });
  } else {        // arka yüz: düz tahta, köşelerde vida
    K.rect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, null, 3, 10);
    for (const [x, y] of [[-220, -112], [220, -112], [-220, 112], [220, 112]]) K.circ(x, y, 6, '#7A5530', 2.5);
  }
  // kıskaç (üst ortada, metal)
  if (klips) { K.rect(-62, -h / 2 - 20, 124, 40, PAL.metal, LW * 0.8, 8); K.rect(-30, -h / 2 - 30, 60, 18, '#728276', LW * 0.6, 6); }
  ctx.restore();
}
// Yerel noktayı dünyaya çevir (ölçek k, çevirme sx)
const tahtaNok = (c, k, sx, [x, y]) => [c[0] + x * k * Math.abs(sx), c[1] + y * k];
// Kalem: el noktasından uca (sarı gövde, koyu uç)
function kalem(K, el, uc) {
  const { ctx } = K, u = H.unit(el, uc), b = [el[0] - u[0] * 26, el[1] - u[1] * 26], m = [uc[0] - u[0] * 16, uc[1] - u[1] * 16];
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, b, m, 17, INK); H.strokeLine(ctx, b, m, 9, PAL.mustard);
  H.strokeLine(ctx, m, uc, 9, INK);
  ctx.restore();
}

// ═══════════════════════════ Mekân: çay ocağı ═══════════════════════════
M.mekanEkle(OCAK, {
  gen: [-700, 2000], dongu: ['penceredeki martı', 'duvar saati', 'çaydanlık buharı', 'kulenin sarsıntısı'],
  capa: { kule: [KULE.x, MASA.y], cetele: BC }, kadraj: { grup: [1.2, 500, 1106] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -800, x1: 2100, isik, duvar: 'fayans', zemin: 'karo' });
    // zeminde uzun kilim (boş zemin kalmasın)
    K.rect(-800, 1512, 2900, 420, '#7F3B33', LW, 0); K.rect(-800, 1532, 2900, 12, PAL.mustard, 0); K.rect(-800, 1600, 2900, 6, '#A3524A', 0);
    for (let x = -760; x < 2100; x += 140) { K.poly([[x, 1700], [x + 46, 1650], [x + 92, 1700], [x + 46, 1750]], '#A3524A', 3); K.circ(x + 46, 1700, 9, PAL.mustard, 2); }
    M.pencere(K, 300, 790, 170, 230, { isik, t: t + 1.5, kayit: false });
    M.duvarSaati(K, 728, 858, 44, 15.2 + t / 3600, t);
    // solda lavabo tezgâhı ve musluk
    K.rect(-420, 1180, 540, 320, PAL.wood, LW, 6); K.rect(-432, 1164, 564, 26, '#C9CED1', LW, 6);
    K.rect(-300, 1160, 220, 14, '#9FB0AE', 3, 4);
    K.line(-190, 1160, -190, 1080, 14, INK); K.line(-190, 1080, -150, 1080, 14, INK); K.line(-190, 1160, -190, 1080, 7, PAL.metal); K.line(-190, 1080, -150, 1080, 7, PAL.metal);
    H.damlaDongu(K, -150, 1092, 1158, t, { periyot: 1.1, r: 6 });
    // sağda ocak tezgâhı, çaydanlık, raf ve çay bardakları
    K.rect(1300, 1180, 600, 320, PAL.wood, LW, 6); K.rect(1288, 1162, 624, 26, PAL.woodTop, LW, 6);
    K.rect(1330, 1214, 160, 230, PAL.woodTop, LW * 0.6, 6); K.rect(1510, 1214, 160, 230, PAL.woodTop, LW * 0.6, 6);
    K.rect(1352, 1140, 150, 24, '#3A3F3C', LW * 0.7, 4);
    caydanlik(K, 1428, 1140, t);
    K.rect(1290, 860, 420, 20, PAL.woodDark, LW * 0.8, 4);
    for (let i = 0; i < 6; i++) bardak(K, 1330 + i * 62, 858, 1.05);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), yika: T('h1:2'), on: T('h1:3'), oyna: T('h1:8'), h1s: T('h1>'),
    d1: T('d1'), ikisi: T('d1:4'), d1s: T('d1>'),
    n0: T('n0'), n0s: T('n0>'), d2: T('d2'), d2s: T('d2>'),
    h2: T('h2'), hicbir: T('h2'), atmadiniz: T('h2:5'), kim: T('h2:6'), h2s: T('h2>'),
    n1: T('n1'), alti: T('n1:1'), defnenin: T('n1:3'), hamle: T('n1:5'), n1s: T('n1>'),
  };
  // Oyun: on el, h1'in sonundan d1'in sonuna eşit aralıkla (eller kulenin arkasında)
  const g0 = tm.h1s - 0.12, g9 = tm.d1s - 0.08;
  tm.eller = Array.from({ length: 10 }, (_, k) => g0 + (g9 - g0) * k / 9);
  tm.oyunKes = tm.h1s - 0.25; tm.kalemKes = tm.ikisi - 0.05; tm.ceteleKes = tm.d1s + 0.12;
  tm.cevir = tm.ceteleKes + 0.08;                    // Kerem çeteleyi çevirir (0,36 sn)
  tm.hikKes = tm.h2 - 0.1; tm.sayac = cd0 - 0.05;
  const cA = { kanca: [1.12, 525, 760 + 415 / 1.12], oyun: [1.42, 615, 799 + 415 / 1.42], kalem: [1.9, 615, 799 + 400 / 1.9] };
  const cB = camB(ZB);
  const film = H.sahneler([
    { id: 'kanca', plan: 'A', t0: 0, cam: [[0, ...cA.kanca], [tm.oyunKes - 0.2, 1.13, 527, cA.kanca[2] - 2]] },
    { id: 'oyun', plan: 'A', t0: tm.oyunKes, cam: [[0, ...cA.oyun], [tm.kalemKes - 0.15, 1.44, 616, cA.oyun[2] - 1]] },
    { id: 'kalem', plan: 'A', kisa: true, t0: tm.kalemKes, cam: [[0, ...cA.kalem], [tm.ceteleKes - 0.1, 1.93, 615, cA.kalem[2] - 1]] },
    { id: 'cetele', plan: 'B', t0: tm.ceteleKes, cam: [[0, cB.zoom, cB.cx, cB.cy], [tm.d2 - 0.2, 1.058, 546, cB.cy - 1], [tm.hikKes - 0.1, 1.062, 547, cB.cy - 2]] },
    { id: 'hikmet', plan: 'B', t0: tm.hikKes, cam: [[0, 1.45, 1190, 760 + 415 / 1.45], [tm.sayac - 0.1, 1.47, 1190, 760 + 415 / 1.47]] },
    { id: 'sayac', plan: 'B', t0: tm.sayac, cam: [[0, cB.zoom, cB.cx, cB.cy]] },     // doğrusal itme kamera() ile (çetelenin merkezine kilitli)
    { id: 'buldum', plan: 'B', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.5, 880, 836 + 415 / 1.5]] },
    { id: 'cevap', plan: 'B', t0: tm.cevap, cam: [[0, cB.zoom, cB.cx, cB.cy]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // Altyazı bölüme özel yerde (y 1312: çetelenin altından 24 px'ten fazla boşluk); n1 son repliktir, balonu kesime kadar kalır.
  const kes = { d1: tm.ceteleKes, d2: tm.hikKes, h2: tm.sayac };
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').map(l => kes[l.id] ? { ...l, t1: Math.min(l.t1, kes[l.id] - 0.31) } : l) };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };   // ipucu kesime kadar tam okunur (sönmez)
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// ═══════════════════════════ draw ═══════════════════════════
const zoomSayac = (tm, t) => t < tm.cd ? Math.exp(lerp(Math.log(ZB), Math.log(1.08), clamp01((t - tm.sayac) / (tm.cd - tm.sayac)))) : lerp(1.08, 1.083, clamp01((t - tm.cd) / (tm.buldum - tm.cd)));
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    if (B.sc.id === 'sayac') Object.assign(cam, camSayac(zoomSayac(S.tm, t)));
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, B.heads, { y: 1312 });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, B.heads, { y: 1312 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (perde yok): daire solda altta, başlık ve paylaşım hapı sağda; çetelenin altında kalır.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 170, y = 1344, r = 68;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 11, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 21, 58, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(612, 1304); ctx.scale(inU * out, inU * out);
  ctx.font = '900 50px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 60;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 18, 50, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(612, 1390); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 52;
    K.rect(-sw / 2 + 8, -35 + 9, sw, 70, INK, 0, 35); K.rect(-sw / 2, -35, sw, 70, PAL.coral, LW, 35); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// ═══════════════════════════ Dünya ═══════════════════════════
function sahne(K, t, tl, S, B) {
  M.mekanCiz(K, OCAK, 'arka', t);
  if (B.sc.plan === 'A') oyunPlani(K, t, tl, S, B); else ceteleDuzeni(K, t, tl, S, B);
}

// Kulenin sarsıntısı: her elde tabaklar 1° kadar titrer (eller kuleye yakın iner)
const kuleAci = (tm, t) => tm.eller.reduce((s, g) => s + 1.1 * H.sars(t, g + 0.02, 0.32, 8), 0);
// Oyun kolu: hazır (kulenin arkasında, yukarıda) ↔ atış (aşağıda, öne); her elde bir iniş. Eller hiçbir karede kulenin dışına çıkmaz.
function kolHedef(tm, t, hazir, atis, kalk) {
  const g = tm.eller; let w = 0;
  // her el: önce yarım bir sallama (iniş-çıkış), sonra atış (tam iniş); kol, eller görünmeden belirgin biçimde iner kalkar
  for (const a of g) w = Math.max(w, pIn(t, a - 0.1, a + 0.12, 0.09, 0.12), 0.55 * pIn(t, a - 0.27, a - 0.15, 0.06, 0.06));
  const p = kar(hazir, atis, w);
  const k = pIn(t, g[0] - 0.42, g[9] + 0.3, 0.25, 0.3);   // oyuna giriş ve çıkış (kol önce kalkar)
  return [kar(kalk, p, k), k];
}

// Oyun düzeni (A): kanca, oyun, kalem
function oyunPlani(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, yakin = id === 'kalem';
  // ——— Kerem (derinlikte, kulenin arkasında): elleri yukarıdan görür, çetelenin arkası bize dönük ———
  const ks = H.BOY.genc * YA.kerS;
  let kL = [0, 0.15];
  if (t >= tm.eller[0] - 0.4 && t < tm.eller[9] + 0.3) {   // her elde önce ellere (aşağı), sonra kâğıda bakar
    const ph = tm.eller.reduce((s, g) => Math.max(s, pIn(t, g - 0.14, g + 0.12, 0.06, 0.08)), 0);
    kL = [0, lerp(0.75, 0.4, ph)];
  }
  if (t < 1.0) kL = [-0.35, 0.05];                                // kare 0: Hikmet'e bakar
  const kp = H.kisi(H.KEREM, { x: YA.ker, y: YA.kerY, s: ks, expr: IF.dikkat, ...POZ.dur, head: { tilt: 0, look: kL } });
  const kA = YA.kerS * 0.62, tahtaA = [YA.ker - 6, 1034 + TB.h / 2 * kA];      // tahtanın üst kenarı çenenin altında (kıskaçsız)
  const yaz = tm.eller.reduce((s, g) => s + 10 * pIn(t, g + 0.06, g + 0.2, 0.06, 0.06) - 8 * pIn(t, g + 0.2, g + 0.3, 0.04, 0.05), 0);
  const kalemEl = [YA.ker + 124 + yaz, 990 + Math.abs(yaz) * 0.4];          // kalem eli tahtanın üstünde, bardakların sağında görünür
  const kc = oyna(K, t, null, H.KEREM, kp, { heads, L: [[YA.ker - 112, 1042], 1, 'A'], R: [kalemEl, 1, 'A'], sessiz: true });
  cetele(K, tahtaA, kA, 1, { klips: false });
  kalem(K, kc.handR, [kc.handR[0] - 28, kc.handR[1] + 54]);   // uç tahtanın üst kenarında
  kc.tut('L'); kc.tut('R');

  // ——— Necmi ve Defne (yandan, karşı karşıya): ellerini kulenin arkasında atarlar ———
  if (!yakin) {
    const nE = t < 0.6 ? IF.merak : IF.kararli, dE = t < 0.6 ? IF.merak : IF.kararli;
    const nL = t < 1.1 ? [0.4, 0.05] : [0.5, 0.3], dL = t < 1.1 ? [0.4, 0.05] : [0.5, 0.3];
    const np = H.kisi('necmi', { x: YA.nec, view: 'side', facing: 1, expr: nE, head: { tilt: 0, look: nL } });
    const dp = H.kisi('defne', { x: YA.def, view: 'side', facing: -1, expr: dE, head: { tilt: 0, look: dL } });
    const [nH, nk] = kolHedef(tm, t, [552, 1115], [596, 1225], [YA.nec + 40, 1250]);
    const [dH, dk] = kolHedef(tm, t, [680, 1112], [638, 1222], [YA.def - 40, 1240]);
    oyna(K, t, tl, 'necmi', np, { heads, R: [nH, nk, 'A'] });
    oyna(K, t, tl, 'defne', dp, { heads, R: [dH, dk, 'A'] });
  }

  // ——— Hikmet (solda, önden; Necmi'nin önünde): kancada kuleyi gösterir (oyun plânında kadraj dışında) ———
  if (id === 'kanca') {
    let hE = IF.hakem, hL = [0.55, 0.12];
    if (t >= tm.h1s) hL = [0.6, 0.2];
    const hp = H.kisi('hikmet', { x: YA.hik, expr: hE, ...POZ.dur, head: { tilt: 2, look: hL } });
    const wG = pIn(t, 0.3, tm.h1s + 0.25, 0.3, 0.35);
    const hO = { heads };
    if (wG > 0.01) hO.R = [[YA.hik + 160, 1150], wG, 'A'];
    const hc = oyna(K, t, tl, 'hikmet', hp, hO);
    if (wG > 0.6) hc.isaret('R', [KULE.x - 60, 1150]);
  }
  masa(K);
  kule(K, kuleAci(tm, t));
}

// Çetele düzeni (B): Kerem önde, çeteleyi gösterir; Necmi solda, Defne sağda; Hikmet ocakta (kendi plânında)
function ceteleDuzeni(K, t, tl, S, B) {
  const { tm } = S, { heads, cam } = B, id = B.sc.id;
  masa(K); kule(K, 0);
  if (id === 'hikmet') return hikmetPlani(K, t, tl, S, B);
  const sayacta = t >= tm.sayac && t < tm.buldum;
  // Çetele ölçeği: sayaçta ekranda sabit (itme çetelenin merkezine kilitli; yazı ölçeklenmez)
  const k = KB * (id === 'sayac' ? ZB / cam.zoom : 1);
  const sx = t < tm.cevir ? 1 : Math.cos(Math.PI * W(t, tm.cevir, 0.36));
  // ——— Necmi (solda) ve Defne (sağda): okunan sütuna bakarlar; sayaçta bakış iki sütunda eşit süre gezer ———
  const sutunBak = (i, kisiX) => { const h = tahtaNok(BC, k, -1, hucre(i, 1)); return [clamp01((h[0] - kisiX) / 420) * 0.8 - clamp01((kisiX - h[0]) / 420) * 0.8, 0.5]; };
  let nL = [0.35, 0.2], dL = [-0.35, 0.2], nE = IF.merak, dE = IF.merak, nPoz = {}, dPoz = {};
  if (t >= tm.cevir + 0.2) { nL = sutunBak(0, B_NX()); dL = sutunBak(1, YB.def); }
  if (t >= tm.d2 - 0.1 && t < tm.sayac) { nL = sutunBak(1, B_NX()); dL = sutunBak(1, YB.def); }
  if (sayacta) {
    const ts = t - tm.cd0, sira = [0, 1, 0, 1, 0, 1, 0];                          // her sütunda 1,3 sn
    const kN = Math.max(0, Math.min(sira.length - 1, Math.floor(ts / 1.3))), kD = Math.max(0, Math.min(sira.length - 1, Math.floor((ts + 0.65) / 1.3)));
    nL = sutunBak(sira[kN], B_NX()); dL = sutunBak(1 - sira[kD], YB.def);
    nE = IF.dusun; dE = IF.dusun;
    if (t >= tm.n1 - 0.2) { nE = IF.merak; nL = [0.45, 0.05]; dL = [-0.6, 0.05]; }
    if (t >= tm.defnenin - 0.1) { nL = [0.6, 0.03]; }
    if (t >= tm.hamle - 0.1) { dL = sutunBak(1, YB.def); }
  }
  if (id === 'buldum') { dE = IF.gulus; dL = [0, -0.1]; }
  const np = H.kisi('necmi', { x: YB.nec, expr: nE, ...POZ.dur, ...nPoz, head: { tilt: nL[0] > 0.3 ? 3 : 0, look: nL } });
  const dp = H.kisi('defne', { x: YB.def, expr: dE, ...POZ.dur, ...dPoz, head: { tilt: dL[0] < -0.3 ? -3 : 0, look: dL } });
  // Sayaç: ikisi sırayla çeteleye eğilir, sırayla işaret parmağını yanağına koyar. Kimse sevinmez, üzülmez.
  let wN = 0, wD = 0;
  if (sayacta) {
    const c0 = tm.cd0;
    np.head.tilt += 5 * Math.sin(TAU * (t - c0) / 5.2); dp.head.tilt -= 5 * Math.sin(TAU * (t - c0 + 1.3) / 5.2);
    np.lean = 7 * pIn(t, c0 + 0.5, c0 + 3.0, 0.4) + 6 * pIn(t, c0 + 6.4, c0 + 9.2, 0.4) + 5 * pIn(t, tm.defnenin - 0.2, tm.buldum + 1, 0.4);
    dp.lean = -7 * pIn(t, c0 + 4.4, c0 + 7.4, 0.4) - 6 * pIn(t, tm.hamle - 0.2, tm.buldum + 1, 0.4);
    // eller sırayla kalkar: aynı karede iki el yüze yakın durmaz (iki yumruk "ikisi de taş" gibi okunur)
    wN = pIn(t, c0 + 3.5, c0 + 5.9, 0.35);
    wD = Math.max(pIn(t, c0 + 0.8, c0 + 3.0, 0.35), pIn(t, c0 + 6.4, c0 + 8.4, 0.35));
  }
  H.onayla(np, t, tm.n0s - 0.1, 1, 0.36); H.onayla(dp, t, tm.d2s - 0.1, 1, 0.36);
  dp.y -= H.buldumHop(t, tm.buldum, 50);
  const nO = { heads };
  // düşünme: dış eldeki işaret parmağı yanağında (yumruk yok: bu bölümde yumruk "taş" gibi okunur)
  const cene = (key, p, m) => { const h = H.eklem(key, p, 'head'); return [h[0] + m * 0.43 * p.s, h[1] + 0.4 * p.s]; };
  if (wN > 0.01) nO.L = [cene('necmi', np, -1), wN, 'B'];
  const wGo = sayacta ? pIn(t, tm.n1 - 0.15, tm.defnenin - 0.05, 0.3, 0.3) : 0;   // ipucu "Benim": el göğsüne
  if (wGo > 0.01) nO.R = [H.elYeri('necmi', np, 'R', 'gogus'), wGo, 'A'];
  const dO = { heads };
  if (wD > 0.01) dO.R = [cene('defne', dp, 1), wD, 'B'];
  if (id === 'buldum') dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];

  // ——— Kerem (önde): çeteleyi iki yanından tutar ———
  let kL = [0, 0.3];
  if (t >= tm.cevir + 0.4) kL = [0, 0.55];
  if (sayacta) { const ts = t - tm.cd0, j = Math.floor(ts / 1.6) % 3; kL = j === 0 ? [-0.5, 0.1] : j === 1 ? [0.5, 0.1] : [0, 0.55]; }
  if (t >= tm.n1 - 0.2 && t < tm.buldum) kL = [-0.4, 0.1];
  const kp = H.kisi(H.KEREM, { x: YB.ker, expr: IF.notr, ...POZ.dur, head: { tilt: 0, look: kL } });
  // Eller tahtanın iki yan kenarında (yazının dışında, kâğıdın boş sağ payında); kalem sağ elde, yukarı bakar.
  // Hiçbir an el, kalem ya da parmak bir hücreye gitmez (sızıntı yasağı: hiçbir hücre öne çıkmaz).
  const yan = m => tahtaNok(BC, k, sx, [m * 250, -88]);
  const kO = { heads, L: [yan(-1), 1, 'A'], R: [yan(1), 1, 'A'], sessiz: true };

  // ——— çizim: Necmi, Defne → Kerem → çetele → tutan eller, kalem ———
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (wN > 0.6) nc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25, boy: 0.95 });
  if (wD > 0.6) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  const kc = oyna(K, t, null, H.KEREM, kp, kO);
  cetele(K, BC, k, sx);
  kc.tut('L');
  kalem(K, kc.handR, [kc.handR[0] + 22, kc.handR[1] - 54]);
  kc.tut('R');
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
  void nc; void dc;
}
const B_NX = () => YB.nec;

// Hikmet'in plânı: ocağın önünde, önden. "atmadınız"da başını sallar (el işareti yok: her el biçimi bir hamle gibi okunur); "Kim kaç el kazandı?": omuz silker.
function hikmetPlani(K, t, tl, S, B) {
  const { tm } = S, { heads } = B;
  const hL = t < tm.kim - 0.1 ? [-0.45, 0.08] : [-0.2, 0.02];
  const hp = H.kisi('hikmet', { x: B_HX(), expr: IF.hakem, ...POZ.dur, head: { tilt: -2, look: hL } });
  H.onayla(hp, t, tm.atmadiniz - 0.05, 1, 0.36);
  if (t >= tm.kim - 0.4) H.omuzSilk(hp, t, tm.kim - 0.3, 0.6);
  oyna(K, t, tl, 'hikmet', hp, { heads });
}
const B_HX = () => YB.hik;
