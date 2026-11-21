// Bölüm 58 · SORU EKİ (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_058_v5.md). Mekanizma: Türkçe soru ekinin yeri.
// Logline: Sabah Hikmet masasının yanındaki panoda üç sarı not bulur. Necmi, Defne ve Kerem aynı altı kelimeyle baklavayı
// sormuştur; tek fark "mi"nin yeridir. Defne, içlerinden birinin olanı neredeyse bildiğini söyler. Hangisi?
// Akılda kalacak tek şey: aynı kelimeler, başka sorular. Soru eki, sorulan şeyin yanına gelir.
// Sızıntı yasağı: "mi / mü / mı" hiçbir yerde vurgulanmaz (renk, kalın, altı çizgi yok); üç not aynı biçimde yazılır,
// ek her notta ikinci satırın sonundadır. Kerem nötrdür: öbür yazarlar gibi yalnız başını kaldırıp bir kez sallar.
// Mekân: ofiste Hikmet'in masası ve yanındaki mantar pano. Not plânlarında kamera panodaki nota itilir (1,46x) ve okunurken durur.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180;

// ═══════════════════════════ Notlar (şartlar: değişmez) ═══════════════════════════
// Ek her notta ikinci satırın sonunda; üç not aynı yazı tipi, aynı boy, aynı kâğıt. Mürekkep renkleri eşit koyulukta.
const NOTLAR = [
  { imza: 'N.', satir: ['Dün baklavayı', 'Hikmet Bey mi', 'yedi?'], ink: '#2F3338', rot: -1.6 },
  { imza: 'D.', satir: ['Hikmet Bey', 'baklavayı dün mü', 'yedi?'], ink: '#6E2A2E', rot: 1.2 },
  { imza: 'K.', satir: ['Hikmet Bey', 'dün baklavayı mı', 'yedi?'], ink: '#1F4A4C', rot: -0.9 },
];
(function denetle() {   // replik metniyle not metni aynı mı (şartlar değişmesin)
  const bek = ['Dün baklavayı Hikmet Bey mi yedi?', 'Hikmet Bey baklavayı dün mü yedi?', 'Hikmet Bey dün baklavayı mı yedi?'];
  NOTLAR.forEach((n, i) => { if (n.satir.join(' ') !== bek[i]) throw new Error('b058 not metni: ' + n.satir.join(' ')); });
})();

// ═══════════════════════════ Ölçüler ═══════════════════════════
const KS = 0.82, sOf = key => H.BOY[key] * KS;
const OFIS = 'b058_ofis';
const TZ = 1290;                                              // masa üstü
const HIK_M = 450;                                            // Hikmet'in masası
const HIK_X = 455, DEF_X = 1125, NEC_X = 440;               // pano sahnesinde duruş yerleri (ipucunda Necmi Hikmet'in yerinde)
const PANO = { x0: 580, x1: 1020, y0: 618, y1: 1218 };
const NOT_W = 410, NOT_H = 176, NOT_X = 800, NOT_Y = [724, 918, 1112];
const TEPSI = [548, TZ - 6];                                  // masada boş baklava tepsisi
const CAY_H = [372, TZ - 4];                                  // Hikmet'in çay bardağı (masada)
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// Düşünme ve şüphe ifadeleri (kart ifadelerinden türetilir)
const SUPHE = { brow: 0.12, browTilt: -0.3, eye: 0.82, pupil: 1, curve: 0.32, open: 0, w: 0.85 };

// ═══════════════════════════ Nesneler ═══════════════════════════
// Yapışkan not: (x, y) merkez, i not sırası, k ölçek, rot derece, nab kabarma (yalnız kancada)
let NOT_BOY = null;
function notBoy(K) {   // en geniş satır iç genişliğe sığsın: üç not için TEK boy (biri ötekinden büyük görünmesin)
  if (NOT_BOY) return NOT_BOY;
  const { ctx } = K; ctx.font = '700 44px Rubik';
  const w = Math.max(...NOTLAR.flatMap(n => n.satir.map(s => ctx.measureText(s).width)));
  NOT_BOY = Math.min(44, Math.floor(44 * (NOT_W - 44) / w));
  return NOT_BOY;
}
function yapiskan(K, x, y, i, { k = 1, rot = NOTLAR[i].rot, nab = 0, soluk = 0 } = {}) {
  const { ctx } = K, n = NOTLAR[i], w = NOT_W, h = NOT_H, sz = notBoy(K), kk = k * (1 + 0.06 * nab);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(kk, kk);
  K.rect(-w / 2 + 7, -h / 2 + 9, w, h, INK, 0, 4);
  K.poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2 - 26], [w / 2 - 26, h / 2], [-w / 2, h / 2]], '#F6D65A', LW * 0.7);
  K.rect(-w / 2 + 2, -h / 2 + 2, w - 4, 20, '#EBC64A', 0, 2);                       // yapışkan şerit
  K.poly([[w / 2, h / 2 - 26], [w / 2 - 26, h / 2 - 26], [w / 2 - 26, h / 2]], '#E2BC3C', LW * 0.6);   // kıvrık köşe
  const lh = sz * 1.08, y0 = -h / 2 + 30 + sz * 0.8;
  n.satir.forEach((s, j) => K.text(s, -w / 2 + 22 + (j === 1 ? 4 : 0), y0 + j * lh, sz, n.ink, 700, 'left'));
  K.text('— ' + n.imza, w / 2 - 40, y0 + 2 * lh, sz * 0.86, n.ink, 700, 'right');
  if (soluk > 0.01) { ctx.globalAlpha = 0.82 * soluk; K.rect(-w / 2 - 6, -h / 2 - 6, w + 20, h + 22, '#C99C68', 0, 6); ctx.globalAlpha = 1; }   // yakın plânda komşu not: odak dışı
  ctx.restore();
}
// Boş baklava tepsisi: (x, y) taban ortası; yuz 0 masada yatık (elips), 1 kameraya dönük (daire); kırıntı ve şerbet izi
function tepsi(K, x, y, yuz = 0, nab = 0) {
  const { ctx } = K, r = 92 * (1 + 0.06 * nab), ry = lerp(20, 88, yuz) * (1 + 0.06 * nab), cy = y - ry;
  ctx.save();
  K.ell(x + 5, cy + 7, r, ry, INK, 0);
  K.ell(x, cy, r, ry, '#C9CDC6', LW * 0.8);
  K.ell(x, cy, r * 0.8, ry * 0.8, '#DDE0D8', LW * 0.5);
  K.ell(x - r * 0.2, cy - ry * 0.12, r * 0.34, ry * 0.22, '#E6C06A', 0);            // şerbet izi
  for (const [a, b, s] of [[-0.3, 0.1, 6], [0.25, -0.2, 5], [0.4, 0.3, 4], [-0.05, 0.4, 5], [0.1, -0.45, 4]]) K.circ(x + a * r, cy + b * ry, s * lerp(0.7, 1, yuz), '#B98A3E', 0);
  ctx.restore();
}
// Çay bardağı (ince belli): (x, yb) taban; buhar döngüsü
function cay(K, x, yb, t, buhar = true) {
  K.ell(x, yb + 1, 22, 5, PAL.cream, 2.5);
  K.poly([[x - 14, yb - 32], [x + 14, yb - 32], [x + 9, yb - 18], [x + 12, yb - 5], [x + 10, yb], [x - 10, yb], [x - 12, yb - 5], [x - 9, yb - 18]], '#A8401F', 2.4);
  if (buhar) H.buhar(K, x, yb - 38, t, { k: 0.34, n: 2, ara: 9, boy: 50 });
}
function masa(K, x, w = 260) {
  K.rect(x - w / 2 + 8, TZ + 12, w - 16, 1500 - TZ, PAL.wood, LW, 6);
  K.rect(x - w / 2 + 24, TZ + 40, w - 48, 90, PAL.woodTop, LW * 0.6, 6);
  K.rect(x - w / 2, TZ - 6, w, 22, PAL.woodTop, LW, 6);
}
function kalemlik(K, x) {
  K.rect(x - 20, TZ - 54, 40, 50, PAL.teal, 3, 4);
  K.line(x - 8, TZ - 54, x - 14, TZ - 92, 6, PAL.coral); K.line(x + 6, TZ - 54, x + 12, TZ - 88, 6, PAL.mustard);
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(OFIS, {
  gen: [-900, 3100], dongu: ['duvar saati', 'pencerede martı', 'çay buharı', 'monitörde kod'],
  capa: {}, kadraj: { genis: [1.0, 760, 1040] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -1000, x1: 3200, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, -40, 640, 260, 320, { isik, t });                              // Hikmet'in arkası (sol)
    M.pencere(K, -760, 640, 240, 300, { isik, t: t + 3 });                     // Necmi'nin arkası
    M.duvarSaati(K, 1110, 640, 46, 9.1 + t / 60, t);
    // pano (mantar)
    K.rect(PANO.x0 + 8, PANO.y0 + 10, PANO.x1 - PANO.x0, PANO.y1 - PANO.y0, INK, 0, 10);
    K.rect(PANO.x0, PANO.y0, PANO.x1 - PANO.x0, PANO.y1 - PANO.y0, '#B98A57', LW, 10);
    K.rect(PANO.x0 + 14, PANO.y0 + 14, PANO.x1 - PANO.x0 - 28, PANO.y1 - PANO.y0 - 28, '#C99C68', 0, 6);
    // dosya dolabı (panonun altı)
    K.rect(620, 1236, 360, 264, '#9FAAA3', LW, 6);
    K.line(620, 1368, 980, 1368, LW * 0.7, INK); K.rect(770, 1290, 60, 14, '#5D6A61', 2, 4); K.rect(770, 1420, 60, 14, '#5D6A61', 2, 4);
    // Defne'nin köşesi: raf ve klasörler; Kerem'in köşesi: sunucu dolabı ışıkları
    K.rect(1580, 760, 360, 18, PAL.woodTop, LW * 0.7, 4);
    for (let i = 0; i < 5; i++) K.rect(1600 + i * 56, 650, 46, 110, [PAL.teal, PAL.mustard, '#8E2A2E', '#E9DCC2', PAL.coral][i], LW * 0.6, 4);
    K.rect(2700, 760, 150, 560, '#2F3338', LW, 8);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++) { const on = Math.floor(t * 3 + r * 1.7 + c * 2.3) % 3 !== 0; K.circ(2727 + c * 22, 800 + r * 54, 6, on ? [PAL.green, PAL.mustard, PAL.coral][(r + c) % 3] : '#4B565D', 0); }
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    koy: 0.3, uc: T('h1:1') - 0.04, bakl: T('h1:6') - 0.04, isaret0: T('h1:1') - 0.3, isaret1: T('h1:4'),
    nA: T('h2a') - 0.12, nAy: T('h2a:1'), nB: T('h2b') - 0.12, nBy: T('h2b:1'), nC: T('h2c') - 0.12, nCy: T('h2c:1'),
    pano: T('d2') - 0.15, bu: T('d2:1') - 0.1, biri: T('d2:3'), bilm: T('d2:7') - 0.25, neYen: T('d2:10') - 0.05,
    h3: T('h3'), hangi: T('h3'), ayni: T('h3:4'), h3son: T('h3>'),
    kas: T('h3>') + 0.15,
    nKes: T('n1') - 0.25, ayniN: T('n1'), herN: T('n1:3') - 0.05, soruN: T('n1:8'),
    cevap: T('d3>') + 0.1, kerem: T('d4:6'), cta: T('d6') - 0.15,
  };
  // sayaç: ikisi düşünür; önce Hikmet, sonra Defne üç notu sırayla gösterir (eşit: üstten alta); Hikmet çayını alır
  tm.hDus = cd0 + 0.5;
  tm.hGos = [cd0 + 2.6, cd0 + 3.1, cd0 + 3.6];
  tm.dGos = [cd0 + 5.4, cd0 + 5.9, cd0 + 6.4];
  tm.cayAl = cd0 + 7.6;
  // ipucu: Necmi üç notu üstten alta gösterir (iki kez, eşit)
  tm.nGos1 = [tm.ayniN + 0.05, tm.ayniN + 0.3, tm.ayniN + 0.55];
  tm.nGos2 = [tm.herN, tm.herN + 0.28, tm.herN + 0.56];

  // (revizyon) geniş plânlar 1,3x: zemin ≤ %15, pano ve karakterler kadrajı doldurur. Not plânları panodaki nota itilir (1,46x), okunurken durur.
  // (altyazı revizyonu) altyazılı plânlarda notların alt kenarı ekranda ≤ 1231 (altyazı 1255'te, ≥ 24 px boşluk) ve üst kenarı kartın altında.
  // 1,27x / cy 990: notlar 512–1228. Yakın plânda okunan not kartın hemen altına (üst kenar ≈ 520) oturur; komşular soluklaşır.
  const NZ = 1.46, NC = (i, d = 0) => [NZ, NOT_X - d, NOT_Y[i] - NOT_H / 2 + (520 - 960) / -NZ + d * 0.5];
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.25, 762, 994], [T('h1>'), 1.25, 766, 995]] },
    { id: 'notlar', t0: tm.nA, kesme: false, cam: [[0, ...NC(0)], [T('h2a:2') - 0.1, ...NC(0, 4)], [tm.nB, ...NC(1)], [T('h2b:2') - 0.1, ...NC(1, 4)], [tm.nC, ...NC(2)], [T('h2c:2') - 0.1, ...NC(2, 4)]] },
    { id: 'pano', t0: tm.pano, cam: [[0, 1.25, 790, 994], [tm.bilm, 1.25, 764, 996], [tm.h3, 1.25, 790, 994], [T('h3>') + 0.32, 1.36, 890, 968]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 1.3, 792, 924], [cd0 + 4.5, 1.305, 790, 928], [cd - 0.6, 1.305, 794, 922]] },
    { id: 'necmi', t0: tm.nKes, cam: [[0, 1.25, 770, 994], [T('n1>'), 1.25, 772, 995]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.42, DEF_X, 1040]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.3, 790, 930]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.3, 790, 930], [tm.cta + 0.6, 1.4, DEF_X - 60, 1000]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, s: sOf('hikmet'), expr: 'saskin', head: { tilt: 4, look: [0.6, -0.3] }, ...POZ.dur });
  const hik = [
    [tm.koy, { expr: 'saskin', head: { tilt: -3, look: [0.3, 0.6] } }, 0.3],
    [tm.uc - 0.1, { expr: 'saskin', head: { tilt: 4, look: [0.8, -0.5] } }, 0.3],
    [tm.bakl - 0.1, { expr: 'notr', head: { tilt: -4, look: [0.4, 0.8] } }, 0.3],
    [T('h1>') + 0.1, { expr: 'saskin', head: { tilt: 2, look: [0.0, 0.0] } }, 0.3],
    [tm.nA, { expr: 'notr', head: { tilt: 4, look: [0.8, -0.85] } }, 0.3],
    [tm.nB, { head: { tilt: -3, look: [0.85, -0.5] } }, 0.3],
    [tm.nC, { expr: 'saskin', head: { tilt: 4, look: [0.85, -0.2] } }, 0.3],
    [tm.pano, { expr: 'notr', head: { tilt: 3, look: [0.8, 0.2] } }, 0.01],
    [tm.pano + 0.7, { head: { tilt: -3, look: [0.8, -0.1] } }, 0.3],
    [tm.bilm - 0.1, { expr: 'saskin', head: { tilt: -4, look: [0.2, 0.7] } }, 0.3],
    [tm.neYen + 0.2, { expr: 'saskin', head: { tilt: 3, look: [0.0, 0.1] } }, 0.3],
    [tm.hangi, { expr: 'notr', head: { tilt: 5, look: [0.8, -0.6] } }, 0.3],
    [tm.hangi + 0.5, { head: { tilt: -2, look: [0.8, 0.2] } }, 0.3],
    [tm.ayni - 0.1, { expr: 'mutlu', head: { tilt: 6, look: [0.6, 0.1] } }, 0.3],
    [tm.kas, { expr: 'saskin', head: { tilt: -3, look: [0.9, 0.1] } }, 0.3],
    [tm.hDus, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 5, look: [0.8, -0.5] } }, 0.4],
    [tm.hGos[0] - 0.4, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 3, look: [0.8, -0.6] } }, 0.3],
    [tm.hGos[2] + 0.6, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -4, look: [0.7, -0.2] } }, 0.4],
    [tm.cayAl - 0.4, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 2, look: [-0.3, 0.6] } }, 0.35],
    [cd - 0.4, { expr: 'saskin', head: { tilt: 3, look: [0.8, -0.3] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, s: sOf('defne'), expr: 'notr', head: { tilt: -3, look: [-0.7, 0.1] }, ...POZ.dur });
  const def = [
    [0.5, { head: { tilt: -4, look: [-0.8, 0.0] } }, 0.4],
    [T('h1:4'), { expr: 'notr', head: { tilt: 3, look: [-0.7, -0.5] } }, 0.35],
    [tm.nA + 0.3, { head: { tilt: -4, look: [-0.8, -0.85] } }, 0.3],
    [tm.nB + 0.3, { head: { tilt: 4, look: [-0.85, -0.5] } }, 0.3],
    [tm.nC + 0.3, { head: { tilt: -3, look: [-0.85, -0.2] } }, 0.3],
    [tm.pano, { expr: 'notr', head: { tilt: -2, look: [-0.7, -0.4] } }, 0.01],
    [tm.bu - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [-0.8, -0.6] } }, 0.3],
    [tm.bilm, { expr: 'mutlu', head: { tilt: 3, look: [-0.8, 0.2] } }, 0.3],
    [tm.hangi + 0.1, { expr: 'notr', head: { tilt: -2, look: [-0.8, 0.1] } }, 0.3],
    [tm.kas, { expr: SUPHE, ...POZ.belde, armR: { sh: 38, el: -118 }, head: { tilt: -8, look: [-0.6, 0.0] } }, 0.35],
    [cd0 + 1.2, { expr: IFADE.dusun, armL: { sh: 18, el: -168 }, armR: POZ.dur.armR, head: { tilt: 5, look: [-0.7, -0.5] } }, 0.4],
    [tm.dGos[0] - 0.4, { expr: 'notr', armL: POZ.dur.armL, head: { tilt: -3, look: [-0.8, -0.6] } }, 0.3],
    [tm.dGos[2] + 0.6, { expr: IFADE.dusun, armL: { sh: 18, el: -168 }, head: { tilt: 4, look: [-0.6, -0.3] } }, 0.4],
    [cd - 0.4, { expr: 'notr', armL: POZ.dur.armL, head: { tilt: -3, look: [-0.8, -0.2] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', ...POZ.dur, head: { tilt: 4, look: [-0.8, -0.4] } }, 0.01],
    [tm.cta, { head: { tilt: -5, look: [0.05, 0.05] } }, 0.4],
  ];
  return { tm, film, hikBase, hik, defBase, def };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç notları örtmesin)
  dunya(K, t, B) {
    const id = B.sc.id;
    M.mekanCiz(K, OFIS, 'arka', t, { isik: M.ISIK.sabah || M.ISIK.gunduz });
    panoSahne(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.cevap) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    // ipucu cümlesi son karede okunur kalsın: n1 balonu "Buldum!"a (kesim) kadar tam opak kalır
    const n1 = tl.lines.find(l => l.id === 'n1'), d3 = tl.lines.find(l => l.id === 'd3');
    if (t >= n1.t1 + 0.25 && t < d3.t0) H.caption(K, { line: n1, text: n1.text, age: 1, left: 1 }, { y: 1255, head: null });
  },
});

// ——— Pano çevresi: kanca, soru, sayaç, ipucu, (arşiv) Buldum, cevap, çağrı ———
function panoSahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  const kanca = id === 'kanca', ipucu = id === 'necmi';
  // notlar: kancada panoda (kabarır), pano sahnesinin başında Hikmet son notu (K) panoya bastırır
  const nab = i => kanca ? H.nabiz(t, tm.uc + i * 0.07, 0.34) : 0;
  const kBas = 1;   // (kritik) notlar pano sahnesinde zaten yerinde: el, "biri" derken hiçbir notun üstünde durmasın
  const notK = kar([NOT_X - 150, NOT_Y[2] + 120], [NOT_X, NOT_Y[2]], kBas);

  // ——— Hikmet ———
  let hp = null; const hO = { heads };
  let cayP = CAY_H, cayElde = false, tepsiP = TEPSI, tepsiYuz = 0, tepsiKal = 0, hIs = null;
  if (!ipucu) {
    hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
    if (kanca) {
      // kare 0: boş tepsi iki elinde, kameraya dönük; 0,3'te tepsiyi kameraya doğru eğer, "baklavayı"da tepsi kabarır
      tepsiYuz = lerp(0.55, 0.85, ease.state(seg(t, tm.koy, 0.4))); tepsiP = [HIK_X + 20, 1262]; tepsiKal = 1;
      const cy = tepsiP[1] - lerp(20, 88, tepsiYuz); hO.L = [[tepsiP[0] - 88, cy + 6], 1, 'A']; hO.R = [[tepsiP[0] + 88, cy + 6], 1, 'A'];
    } else if (id === 'pano') {
      // "Bilmediği tek şey" tepsiyi iki eliyle kaldırır, "ne yendiği"nde boş yüzü kameraya döner; h3'te geri koyar
      const kal = W(t, tm.bilm + 0.1, 0.4) * (1 - W(t, tm.hangi - 0.1, 0.4));
      tepsiYuz = 0.78 * ease.state(seg(t, tm.neYen - 0.2, 0.35)) * (1 - W(t, tm.hangi - 0.1, 0.4));
      const wE = pIn(t, tm.bilm - 0.2, tm.hangi + 0.25, 0.28);
      tepsiP = kar(TEPSI, [HIK_X + 10, 1262], kal); tepsiKal = kal;
      if (wE > 0.01) { const cy = tepsiP[1] - lerp(20, 88, tepsiYuz); hO.L = [[tepsiP[0] - 88, cy + 6], wE, 'A']; hO.R = [[tepsiP[0] + 88, cy + 6], wE, 'A']; }
      if (t >= tm.ayni - 0.1) { const sag = hp.armR; H.omuzSilk(hp, t, tm.ayni - 0.1, 0.7); hp.armR = sag; }   // tek omuz: sağ kol panoya (notlara) uzanmasın
    } else if (id === 'sayac') {
      H.glance(hp, t, tm.cd - 0.3, 9.4);
      const wG = pIn(t, tm.hGos[0] - 0.3, tm.hGos[2] + 0.4, 0.28);
      if (wG > 0.01) { const e = H.elYeri('hikmet', hp, 'L', 'yukari'); hO.L = [[e[0] + 6 * Math.sin((t - tm.hGos[0]) * 14), e[1] - 30 + 8 * Math.abs(Math.sin((t - tm.hGos[0]) * 14))], wG, 'B']; }   // başını kaşır (el notlardan uzakta)
      const wC = pIn(t, tm.cayAl - 0.3, tm.cd + 0.2, 0.3) * (1 - wG);
      if (t >= tm.cayAl) { cayElde = true; cayP = kar(CAY_H, [HIK_X - 40, 1196], ease.state(seg(t, tm.cayAl, 0.4))); }
      if (wC > 0.01) hO.L = [[cayP[0] + 4, cayP[1] - 14], wC, 'A'];
    } else {   // arşiv: cevap / çağrı
      hp.expr = 'saskin'; hp.head = { tilt: 4, look: [0.8, -0.3] };
    }
  }
  // ——— Defne ———
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const dO = { heads }; let dIs = null;
  if (id === 'pano') {
    const wP = pIn(t, tm.bu - 0.3, tm.bilm, 0.28);
    if (wP > 0.01) dO.L = [[dp.x - 62, 1236], wP, 'B'];   // açık elle bütün panoyu gösterir; tek nota parmak yok
  } else if (id === 'sayac') {
    H.glance(dp, t, tm.cd - 0.3, 9.4);
    const wG = pIn(t, tm.dGos[0] - 0.3, tm.dGos[2] + 0.4, 0.28);
    if (wG > 0.01) { const e = H.elYeri('defne', dp, 'R', 'yukari'); dO.R = [[e[0] - 6 * Math.sin((t - tm.dGos[0]) * 6), e[1] + 40], wG, 'A']; }   // çenesine dokunur, saçını düzeltir
  } else if (id === 'cevap' || id === 'cta') {
    const wK = pIn(t, tm.kerem - 0.3, tm.cta, 0.28);
    if (wK > 0.01) { dO.L = [H.elYeri('defne', dp, 'L', 'yukari'), wK, 'B']; if (wK > 0.6) dIs = [PANO.x1 + 4, NOT_Y[2]]; }
  }
  // ——— Necmi (ipucu: Hikmet'in yerinde, çayı elinde; üç notu üstten alta iki kez gösterir, sonunda parmağını kaldırır) ———
  let np = null; const nO = { heads }; let nIs = null, nCay = null;
  if (ipucu) {
    np = H.kisi('necmi', { x: NEC_X, s: sOf('necmi'), expr: 'mutlu', ...POZ.dur, head: { tilt: -3, look: [0.6, -0.6] } });
    nCay = [NEC_X - 70, 1300];
    nO.L = [[nCay[0] + 4, nCay[1] - 14], 1, 'A'];
    const wG = pIn(t, tm.ayniN - 0.3, tm.soruN - 0.2, 0.28);
    const dur = [...tm.nGos1.map((a, i) => [a, [PANO.x0 - 6, NOT_Y[i] + 40]]), ...tm.nGos2.map((a, i) => [a, [PANO.x0 - 6, NOT_Y[2 - i] + 40]])];
    if (wG > 0.01) { const p = H.dokunYolu(t, dur, { yuksel: 10, sure: 0.18 }); nO.R = [H.elYeri('necmi', np, 'R', 'yukari'), wG, 'B']; if (wG > 0.6) nIs = p; }
    const wU = W(t, tm.soruN - 0.2, 0.3);
    if (wU > 0.01) { nO.R = [H.elYeri('necmi', np, 'R', 'yukari'), wU, 'B']; if (wU > 0.6) nIs = [np.x + 70, 760]; }
    np.head = { tilt: lerp(-3, 4, wU), look: [lerp(0.6, 0.1, wU), lerp(-0.6, 0.0, wU)], nod: 0 };
    hp = H.kisi('hikmet', { x: 150, s: sOf('hikmet'), expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 5, look: [0.8, -0.4] } });
  }

  // ——— çizim ———
  const odak = [[tm.nA - 0.2, tm.nB - 0.15], [tm.nB - 0.15, tm.nC - 0.15], [tm.nC - 0.15, tm.pano]];
  const soluk = i => id === 'notlar' ? W(t, tm.nA - 0.05, 0.35) * (1 - (i === 0 ? 1 : W(t, odak[i][0], 0.3)) * (i === 2 ? 1 : 1 - W(t, odak[i][1], 0.3))) : 0;
  NOTLAR.forEach((_, i) => yapiskan(K, i === 2 ? notK[0] : NOT_X, i === 2 ? notK[1] : NOT_Y[i], i, { nab: nab(i), soluk: soluk(i) }));
  const hc = hp ? oyna(K, t, ipucu ? null : tl, 'hikmet', hp, hO) : null;
  masa(K, HIK_M);
  const nc = np ? oyna(K, t, tl, 'necmi', np, nO) : null;   // ipucunda Necmi masanın önünde
  kalemlik(K, HIK_M - 110 + (ipucu ? -30 : 0));
  const tepsiElde = (id === 'pano' || kanca) && tepsiKal > 0.001;
  if (!tepsiElde) tepsi(K, ...TEPSI, 0);
  if (!cayElde && !ipucu) cay(K, ...cayP, t);
  if (ipucu) cay(K, ...CAY_H, t, true);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (tepsiElde) { tepsi(K, tepsiP[0], tepsiP[1], tepsiYuz, kanca ? H.nabiz(t, tm.bakl, 0.36) : 0); hc.tut('L'); hc.tut('R'); }
  if (cayElde) { cay(K, cayP[0], cayP[1], t, false); hc.tut('L'); }
  if (id === 'pano' && kBas < 1) hc.tut('R');
  if (nCay) { cay(K, nCay[0], nCay[1], t, false); nc.tut('L'); }
  if (hIs) hc.isaret('R', hIs);
  if (dIs) dc.isaret('L', dIs);
  if (nIs) nc.isaret('R', nIs);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}

// "SEN DE DÜŞÜN!" sayacı (bölüme özel yerleşim): başlık kartın altında, daire ve paylaşım hapı notların altında.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 200, y = 1372, r = 70;
  ctx.save(); ctx.translate(540, 540); ctx.scale(inU * out, inU * out);
  ctx.font = '900 50px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 60;
  K.rect(-bw / 2 + 8, -36 + 9, bw, 72, INK, 0, 36); K.rect(-bw / 2, -36, bw, 72, PAL.mustard, LW, 36);
  K.text('SEN DE DÜŞÜN!', 0, 18, 50, INK, 900);
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 24, 64, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(600, y); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56;
    K.rect(-sw / 2 + 8, -44 + 10, sw, 88, INK, 0, 44); K.rect(-sw / 2, -44, sw, 88, PAL.coral, LW, 44); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}
