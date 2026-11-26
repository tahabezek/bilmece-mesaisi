// Bölüm 62 · MAAŞ ORTALAMASI (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_062_v5.md). Mekanizma: gizli sayıyla maskeleme.
// Logline: Ofis mutfağında, masada dört ters bordro zarfı. Dördü de maaş ortalamasını merak ediyor, kimse maaşını söylemiyor.
// Hikmet telefonu (hesap makinesi) yüzüstü çevirir, üstüne not kâğıdı ve kalem koyar. Necmi "kâğıda yazalım, karıştıralım" der,
// Defne "el yazısından bilinir" diye karşı çıkar. Hikmet kolunu zarfına siper eder. Sayaçtan sonra Necmi boş bir kâğıdı kaldırır:
// "Bir sayı söylemek, maaşını söylemek değildir."
// Akılda kalacak tek şey: bir sayıyı gizli bir sayıyla karıştırırsan, söylediğin şey artık maaşın değildir.
// Sızıntı yasağı: fısıldama, kulağa eğilme, sayı zinciri yok. Zarflar hiç açılmaz, hiçbir yerde rakam yok (kâğıtlar boş).
// Kerem (genc) konuşmaz, nötrdür. Her kare t'nin saf fonksiyonudur; Math.random yok; anlar kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const MUT = 'b062_mutfak';
const MB = 1236, MF = 1615;                 // masanın arka ve ön kenarı (koordinatör 22 Kas: ön kenar ekranda y ≈ 1475; kamera masaya göre kurulur)
const KIM = {                                // oturan dört kişi (masa belden aşağısını örter)
  defne: { x: 250, y: 1564 }, hikmet: { x: 445, y: 1625 }, necmi: { x: 645, y: 1516 }, genc: { x: 840, y: 1589 },   // baş üstleri ≈ 880–915
};
const SIRA = ['defne', 'hikmet', 'necmi', 'genc'];
const ZW = 172, ZH = 100, ZY = 1325;          // bordro zarfı (ters: kapak yüzü yukarıda)
const ZX = { defne: 250, hikmet: 445, necmi: 645, genc: 840 };
const PX = 545, PY = 1262;                    // telefon / not kâğıdı yeri (Hikmet'le Necmi'nin zarfları arası)
const BARD_N = [743, 1262];                   // Necmi'nin çay bardağı (zarfların arasında)
const SUPHE = { brow: -0.02, browTilt: 0.42, eye: 0.6, pupil: 1, curve: -0.1, open: 0, w: 0.85 };
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Mantık (build anında; yalnız arşiv cevabı için denetim) ═══════════════════════════
// Hikmet gizli r tutar; zincir r+a, r+a+b, … ; Hikmet sondan r'yi çıkarır → toplam. Hiçbir ara toplam tek bir maaşı vermez.
function mantik() {
  const m = [41000, 37500, 52000, 29000], r = 913577;
  let s = r; const duyulan = [];
  for (const x of m) { s += x; duyulan.push(s); }
  const ort = (s - r) / 4;
  if (ort !== m.reduce((a, b) => a + b) / 4) throw new Error('b062: zincir ortalamayı vermiyor');
  return { ort, duyulan };
}
mantik();

// ═══════════════════════════ Nesneler ═══════════════════════════
// Bordro zarfı (ters): kraft kâğıt, kapak üçgeni, kırmızı GİZLİ damgası. (x, y) merkez; rot derece; k ölçek
function zarf(K, x, y, { rot = 0, k = 1, bas = 0 } = {}) {
  const { ctx } = K, w = ZW, h = ZH;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(k * (1 + 0.03 * bas), k * (1 - 0.05 * bas));
  K.rect(-w / 2 + 5, -h / 2 + 7, w, h, INK, 0, 6);
  K.rect(-w / 2, -h / 2, w, h, '#D4AE72', LW * 0.7, 6);
  K.poly([[-w / 2 + 4, -h / 2 + 3], [w / 2 - 4, -h / 2 + 3], [0, h * 0.12]], '#C79C5E', 3);
  ctx.save(); ctx.rotate(-7 * D2R);
  ctx.font = '900 44px Rubik'; const tw = ctx.measureText('GİZLİ').width + 24;
  ctx.strokeStyle = PAL.coral; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-tw / 2, -10, tw, 56, 7); ctx.stroke();
  K.text('GİZLİ', 0, 34, 44, PAL.coral, 900);
  ctx.restore();
  ctx.restore();
}
// Telefon: f 0 yüzü yukarıda (hesap makinesi ekranı), 1 yüzüstü
function telefon(K, x, y, f) {
  const { ctx } = K, sy = Math.abs(Math.cos(Math.PI * f)), w = 52, h = 84;
  ctx.save(); ctx.translate(x, y); ctx.scale(1, Math.max(0.06, sy));
  K.rect(-w / 2 + 4, -h / 2 + 5, w, h, INK, 0, 9);
  if (f < 0.5) {
    K.rect(-w / 2, -h / 2, w, h, '#2E3338', LW * 0.6, 9);
    K.rect(-w / 2 + 5, -h / 2 + 6, w - 10, h - 12, '#CFE3DD', 0, 5);
    const renk = [PAL.coral, PAL.mustard, PAL.teal, PAL.green, '#7FA79B', PAL.coral];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) K.rect(-w / 2 + 11 + c * 17, -h / 2 + 14 + r * 20, 13, 13, renk[r * 2 + c], 2, 4);
  } else {
    K.rect(-w / 2, -h / 2, w, h, '#5D6A61', LW * 0.6, 9);
    K.circ(-w / 2 + 14, -h / 2 + 14, 6, '#2E3338', 2);
  }
  ctx.restore();
}
// Not kâğıdı destesi (boş): n üstte kalan yaprak sayısı görünümü
function notDeste(K, x, y, rot = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-38 + 4, -30 + 6, 76, 60, INK, 0, 4);
  K.rect(-38, -26, 76, 56, '#E9E4DA', 3, 4);
  K.rect(-38, -30, 76, 56, '#FFF8D8', LW * 0.6, 4);
  ctx.restore();
}
// Tek not kâğıdı (elde, boş): (x, y) merkez
function notYaprak(K, x, y, rot = 0, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(k, k);
  K.rect(-34 + 4, -28 + 5, 68, 56, INK, 0, 4);
  K.rect(-34, -28, 68, 56, '#FFF8D8', LW * 0.6, 4);
  ctx.restore();
}
function kalem(K, x, y, rot = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-46, -6, 80, 12, PAL.mustard, 3, 3);
  K.poly([[34, -6], [50, 0], [34, 6]], '#E9D2A8', 3);
  K.rect(-54, -6, 10, 12, PAL.coral, 3, 2);
  ctx.restore();
}
const BARDAK = [[-17, -38], [17, -38], [10, -22], [15, -6], [12, 0], [-12, 0], [-15, -6], [-10, -22]];
const BARDAK_IC = [[-15, -31], [15, -31], [8.6, -22], [13.2, -6], [10.4, -2], [-10.4, -2], [-13.2, -6], [-8.6, -22]];
function cay(K, x, yb, t, k = 1.15, buhar = true) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 1, 26, 6, PAL.cream, 2.5);
  K.poly(BARDAK, '#F3EEE4', 0); K.poly(BARDAK_IC, '#A8401F', 0); K.poly(BARDAK, null, 2.6);
  K.line(-9, -33, -6, -26, 2.4, '#FFFFFF');
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 46 * k, t, { k: 0.4 * k, n: 2, ara: 10, boy: 60 });
}

// ═══════════════════════════ Mekân: ofis mutfağı ═══════════════════════════
M.mekanEkle(MUT, {
  gen: [-300, 1400], dongu: ['duvar saatinin saniye ibresi', 'çay bardaklarında buhar', 'pencerede martı'],
  capa: { masa: [540, MB] }, kadraj: { genis: [1.3, 548, 1235] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 1500, isik, duvar: 'cizgili', zemin: 'ahsap' });
    // fayans bandı (tezgâh hizası)
    const { ctx } = K;
    for (let x = -400; x < 1500; x += 64) for (let y = 1040; y < 1300; y += 64) K.rect(x, y, 64, 64, (Math.floor(x / 64) + Math.floor(y / 64)) % 2 ? '#E7EFEA' : '#DCE7E1', 2, 0);
    M.pencere(K, -40, 560, 300, 360, { isik, t, manzara: 'istanbul', marti: true });
    M.duvarSaati(K, 1000, 700, 62, 15.6 + t / 3600, t);
    // raf ve semaver (sağ arkada)
    K.rect(900, 930, 300, 18, PAL.woodTop, LW, 4);
    K.poly([[960, 930], [1040, 930], [1030, 850], [970, 850]], '#C9CFC9', LW * 0.8);
    K.circ(1000, 840, 10, INK, 0);
    for (let i = 0; i < 3; i++) cay(K, 1080 + i * 36, 930, t, 0.8, false);
    ctx.save(); ctx.globalAlpha = 1; ctx.restore();
  },
});
// sandalye sırtları (karakterlerden önce)
function sandalyeSirt(K, key) {
  const p = KIM[key], sh = H.eklem(key, H.kisi(key, { x: p.x, y: p.y }), 'shL')[1];
  K.rect(p.x - 104, sh - 70, 18, 360, PAL.wood, LW, 6); K.rect(p.x + 86, sh - 70, 18, 360, PAL.wood, LW, 6);
  K.rect(p.x - 112, sh - 92, 224, 46, PAL.woodTop, LW, 14);
}
// Masa: derin üst yüz (zarflar arka sırada, çay ve tabaklar ön sırada), önde tahta ön panel
function masa(K, t) {
  const x0 = -320, x1 = 1420;
  K.poly([[x0, MB], [x1, MB], [x1 + 50, MF], [x0 - 50, MF]], '#E8C99A', LW);
  K.line(x0 - 20, MB + 190, x1 + 20, MB + 190, 2.5, '#D9B582');
  // ön yüz: tek tahta şerit (altında başka zemin yok)
  K.rect(x0 - 50, MF, x1 - x0 + 100, 600, PAL.wood, LW, 0);
  K.line(x0 - 50, MF + 34, x1 + 50, MF + 34, 3, '#7E5A3A');
  // ön sıra: herkesin çay bardağı (döngü: buhar), ortada simit tabağı
  for (const k of ['defne', 'hikmet', 'genc']) cay(K, ZX[k] + (k === 'genc' ? 30 : -30), 1560, t, 1.6);
  K.ell(640, 1560, 112, 30, PAL.paper, 3); K.ell(640, 1550, 76, 19, '#C4874A', 6); K.ell(640, 1550, 30, 7, '#E8C99A', 0);
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    maas: T('h1:2'), merak: T('h1:5'), h1s: T('h1>'),
    d1: T('d1'), dAma: T('d1:4'), dSoyle: T('d1:7'), d1s: T('d1>'),
    n0: T('n0'), olsem: T('n0:1'), nSoyle: T('n0:3'),
    h2: T('h2'), kimse: T('h2:3'), tahmin: T('h2:6'), h2s: T('h2>'),
    h2b: T('h2b'), hesap: T('h2b:0'), yok1: T('h2b:2'), yok2: T('h2b:4'), kagit: T('h2b:5'), kalemK: T('h2b:6'), serbest: T('h2b:9'),
    n2: T('n2'), kagida: T('n2:1'), karis: T('n2:4'), n2s: T('n2>'),
    d2: T('d2'), olmaz: T('d2:0'), elYazi: T('d2:1'), d2s: T('d2>'),
    h3: T('h3'), h3s: T('h3>'),
    n1: T('n1'), nBir: T('n1:0'), nMaas: T('n1:3'), n1s: T('n1>'),
    cevap: Math.max(T('d3:1') - 0.1, T('d3') + 0.82), cta: T('d6') - 0.15,
  };
  tm.bas = SIRA.map((k, i) => tm.h2 + 0.02 + i * 0.08);          // "Dördümüz": dört el sırayla kendi zarfına basar
  tm.kalkan = tm.d2s + 0.2;                                        // Hikmet kolunu zarfına siper eder
  tm.kalkanBit = cd0 + 5.0;
  tm.notAl = tm.kagida - 0.05;                                     // Necmi not kâğıdını desteden alır
  tm.notBirak = tm.d2s - 0.05;                                        // sayaçta kâğıdı desteye geri koyar
  tm.n1Al = tm.nBir - 0.05;
  // sayaç olayları (her 2–4 sn yeni bir şey)
  tm.s = { kBak: cd0 + 1.6, nTik: cd0 + 2.6, kOrt: cd0 + 3.6, hBak: cd0 + 5.4, dTik: cd0 + 6.4, nDus: cd0 + 7.6, dDus: cd0 + 8.4 };

  // Kadraj (koordinatör: boş zemin ≤ %15, geniş plan 1,25–1,4x, konuşana yakın plan). Yakın planlar 1,5–1,8x:
  // rehberin 0,94–1,46 aralığı bilerek aşılır (060'taki gibi); kontrol() uyarısı bilinçlidir.
  const G = [1.3, 545, 1203];
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...G], [tm.merak, 1.32, 548, 1199]] },
    // Kenarda yarım yüz yok (denetim 26 Kas): her yakın planın kenarı iki baş arasından geçer (dünya x ≈ 550 ya da 330).
    { id: 'defne', t0: tm.d1 - 0.1, cam: [[0, 1.5, 190, 1178], [tm.dAma, 1.52, 195, 1175], [tm.d1s, 1.53, 197, 1173]] },
    { id: 'necmi', t0: tm.n0 - 0.1, cam: [[0, 1.52, 700, 1188], [tm.nSoyle, 1.55, 702, 1184]] },
    { id: 'zarflar', t0: tm.h2 - 0.08, cam: [[0, 1.15, 540, 960], [tm.kimse - 0.15, 1.19, 546, 962]] },     // insert: masa üstten, dört el ve zarflar (yüz yok)
    { id: 'genis', t0: tm.kimse - 0.1, cam: [[0, 1.3, 548, 1203], [tm.h2s, 1.33, 550, 1196]] },
    { id: 'hikmet', t0: tm.h2b - 0.1, cam: [[0, 1.55, 382, 1149], [tm.kagit, 1.57, 385, 1146], [tm.serbest, 1.58, 388, 1144]] },   // sağ kenar x ≈ 730: Kerem dışarıda
    { id: 'necmi2', t0: tm.n2 - 0.1, cam: [[0, 1.5, 690, 1158], [tm.n2s, 1.52, 693, 1155]] },   // sol kenar x ≈ 330: Defne dışarıda
    { id: 'uclu', t0: tm.d2 - 0.1, cam: [[0, 1.4, 340, 1179], [tm.d2s, 1.42, 345, 1175]] },     // sağ kenar x ≈ 725: Kerem dışarıda
    { id: 'kalkan', t0: tm.kalkan - 0.05, cam: [[0, 1.72, 440, 1155], [tm.h3s, 1.76, 440, 1149]] },         // komik yakın: kolunu siper eder
    { id: 'sayac', t0: cd0 - 0.05, dogrusal: [1.26, 1.32], cam: [[0, 1.26, 548, 1214]] },
    { id: 'ipucu', t0: tm.n1 - 0.25, cam: [[0, 1.5, 690, 1158], [tm.n1s, 1.53, 688, 1153], [tm.buldum - 0.1, 1.54, 686, 1151]] },   // sol kenar x ≈ 330
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.5, 290, 1178]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.3, 548, 1203], [tm.cta, 1.45, 300, 1188]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden; eller masada, poz izi baş ve ifade içindir) ———
  const base = (key, expr, look, tilt = 0) => H.kisi(key, { x: KIM[key].x, y: KIM[key].y, expr, head: { tilt, look }, ...POZ.rahat });
  const hikBase = base('hikmet', SUPHE, [-0.8, 0.6], 4);
  const hik = [
    [0.55, { head: { tilt: -3, look: [0.75, 0.6] } }, 0.2],
    [tm.maas - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.1, 0.1] } }, 0.3],
    [tm.d1 - 0.1, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.2] } }, 0.01],
    [tm.dSoyle, { expr: SUPHE, head: { tilt: -6, look: [-0.85, 0.3] } }, 0.3],
    [tm.n0 - 0.1, { expr: 'notr', head: { tilt: 4, look: [0.85, 0.3] } }, 0.01],
    [tm.h2 - 0.08, { expr: 'kizgin', head: { tilt: 3, look: [0.1, 0.8] } }, 0.01],
    [tm.kimse - 0.1, { expr: 'kizgin', head: { tilt: -3, look: [-0.2, 0.05] } }, 0.01],
    [tm.tahmin, { expr: SUPHE, armR: POZ.rahat.armR, head: { tilt: 5, look: [0.85, 0.4] } }, 0.35],
    [tm.h2b - 0.1, { expr: 'notr', head: { tilt: -3, look: [0.4, 0.75] } }, 0.01],
    [tm.kagit, { expr: 'mutlu', head: { tilt: 4, look: [0.1, 0.1] } }, 0.3],
    [tm.n2 - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.85, 0.3] } }, 0.01],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.85, 0.3] } }, 0.01],
    [tm.elYazi + 0.2, { expr: 'saskin', head: { tilt: -4, look: [-0.85, 0.2] } }, 0.25],
    [tm.kalkan - 0.05, { expr: SUPHE, head: { tilt: 8, look: [-0.95, 0.35] } }, 0.01],
    [tm.h3 + 0.9, { expr: SUPHE, head: { tilt: -6, look: [0.95, 0.35] } }, 0.3],
    [cd0, { expr: SUPHE, head: { tilt: 6, look: [-0.9, 0.4] } }, 0.35],
    [tm.kalkanBit, { expr: 'notr', head: { tilt: -3, look: [0.6, 0.4] } }, 0.35],
    [tm.s.hBak, { expr: IFADE.dusun2, head: { tilt: 5, look: [0.2, -0.4] } }, 0.4],
    [tm.n1 - 0.25, { expr: 'notr', head: { tilt: 4, look: [0.85, 0.35] } }, 0.01],
    [tm.nMaas, { expr: 'saskin', head: { tilt: -4, look: [0.85, 0.5] } }, 0.25],
    [tm.cevap, { expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.2] } }, 0.01],
  ];
  const defBase = base('defne', SUPHE, [0.85, 0.6], -3);
  const def = [
    [0.5, { head: { tilt: 3, look: [0.6, 0.5] } }, 0.2],
    [tm.maas, { expr: 'notr', head: { tilt: 4, look: [0.85, 0.15] } }, 0.3],
    [tm.d1 - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [0.5, 0.1] } }, 0.01],
    [tm.dAma - 0.1, { expr: SUPHE, head: { tilt: 5, look: [0.6, 0.6] } }, 0.3],
    [tm.n0 - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.2] } }, 0.01],
    [tm.kimse - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.85, 0.15] } }, 0.01],
    [tm.tahmin, { expr: SUPHE, head: { tilt: -5, look: [0.85, 0.55] } }, 0.3],
    [tm.h2b - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.85, 0.3] } }, 0.01],
    [tm.d2 - 0.1, { expr: 'kizgin', head: { tilt: -4, look: [0.8, 0.1] } }, 0.01],
    [tm.elYazi - 0.1, { expr: 'notr', armR: POZ.rahat.armR, head: { tilt: 3, look: [0.9, 0.35] } }, 0.25],
    [tm.kalkan - 0.05, { expr: 'notr', head: { tilt: -4, look: [0.85, 0.5] } }, 0.01],
    [cd0, { expr: 'notr', head: { tilt: 4, look: [0.3, 0.6] } }, 0.3],
    [tm.s.dTik, { expr: IFADE.dusun, head: { tilt: -4, look: [0.3, 0.7] } }, 0.35],
    [tm.s.dDus, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.3, -0.5] } }, 0.4],
    [tm.buldum - 0.06, { armR: POZ.rahat.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.rahat.armR, head: { tilt: 4, look: [0.7, 0.3] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = base('necmi', SUPHE, [0.85, 0.6], 3);
  const nec = [
    [0.6, { head: { tilt: -3, look: [-0.7, 0.55] } }, 0.2],
    [tm.maas, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.15] } }, 0.3],
    [tm.d1 - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.15] } }, 0.01],
    [tm.n0 - 0.1, { expr: 'kizgin', head: { tilt: 3, look: [0.3, 0.6] } }, 0.01],
    [tm.nSoyle + 0.2, { expr: 'mutlu', head: { tilt: -4, look: [-0.3, 0.05] } }, 0.3],
    [tm.kimse - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.85, 0.2] } }, 0.01],
    [tm.tahmin, { expr: SUPHE, head: { tilt: 5, look: [0.85, 0.5] } }, 0.3],
    [tm.h2b - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.8, 0.5] } }, 0.01],
    [tm.n2 - 0.1, { expr: 'mutlu', head: { tilt: 4, look: [-0.4, 0.4] } }, 0.01],
    [tm.karis - 0.2, { expr: 'mutlu', head: { tilt: -4, look: [-0.2, 0.05] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.15] } }, 0.01],
    [tm.elYazi + 0.3, { expr: 'yorgun', head: { tilt: 5, look: [-0.3, 0.6] } }, 0.3],
    [tm.kalkan - 0.05, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.5] } }, 0.01],
    [cd0, { expr: 'notr', head: { tilt: -3, look: [-0.5, 0.5] } }, 0.3],
    [tm.s.nTik, { head: { tilt: 4, look: [0.0, 0.8] } }, 0.35],
    [tm.s.nDus, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: -5, look: [-0.4, -0.4] } }, 0.4],
    [tm.n1 - 0.6, { expr: 'mutlu', armR: POZ.rahat.armR, head: { tilt: 4, look: [-0.3, 0.6] } }, 0.35],
    [tm.nBir + 0.4, { head: { tilt: -4, look: [-0.05, 0.05] } }, 0.3],
    [tm.cevap, { expr: 'mutlu', head: { tilt: 4, look: [-0.8, 0.3] } }, 0.01],
  ];
  const kerBase = base('genc', SUPHE, [-0.85, 0.6], -3);
  const ker = [
    [1.6, { head: { tilt: 3, look: [-0.9, 0.3] } }, 0.2],
    [tm.d1 - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.15] } }, 0.01],
    [tm.n0 - 0.1, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.2] } }, 0.01],
    [tm.tahmin, { expr: SUPHE, head: { tilt: 4, look: [-0.85, 0.55] } }, 0.3],
    [tm.h2b - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.3] } }, 0.01],
    [tm.n2 - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.85, 0.2] } }, 0.01],
    [cd0, { expr: 'notr', head: { tilt: 3, look: [-0.7, 0.5] } }, 0.3],
    [tm.s.kBak, { expr: SUPHE, head: { tilt: -4, look: [-0.95, 0.5] } }, 0.3],
    [tm.s.kOrt + 0.8, { expr: 'notr', head: { tilt: 4, look: [-0.2, 0.7] } }, 0.35],
    [tm.s.nDus, { head: { tilt: -3, look: [-0.8, 0.2] } }, 0.35],
    [tm.cevap, { expr: 'notr', head: { tilt: -3, look: [-0.8, 0.3] } }, 0.01],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec, kerBase, ker };
}

// ═══════════════════════════ Nesne durumları (bütün sahneler aynı fonksiyonları okur) ═══════════════════════════
function zarfAt(S, key, t) {
  const { tm } = S;
  let x = ZX[key], y = ZY, rot = { defne: -4, hikmet: 3, necmi: -2, genc: 4 }[key], bas = 0;
  if (key === 'hikmet') { y -= 14 * W(t, 0.15, 0.4); rot -= 3 * W(t, 0.15, 0.4); y -= 10 * W(t, tm.kalkan, 0.3); }
  if (key === 'defne') { y -= 16 * W(t, tm.dAma, 0.35); x += 6 * W(t, tm.dAma, 0.35); }
  if (key === 'genc') { y -= 14 * W(t, tm.s.kOrt, 0.4); x -= 8 * W(t, tm.s.kOrt, 0.4); }
  const i = SIRA.indexOf(key);
  bas += H.nabiz(t, tm.bas[i] + 0.06, 0.24);
  if (key === 'hikmet') bas += H.nabiz(t, tm.maas + 0.04, 0.22);
  if (key === 'necmi') bas += 0.6 * H.nabiz(t, tm.nSoyle + 0.02, 0.22) + 0.6 * H.nabiz(t, tm.nMaas + 0.02, 0.22);
  return { x, y, rot, bas };
}
// Necmi'nin çay bardağı: zarfının üstüne ağırlık olarak konur ("ölsem de söylemem")
function bardakAt(S, t) {
  const { tm } = S, a = tm.olsem - 0.05, b = tm.nSoyle - 0.04;
  const hedef = [ZX.necmi + 62, ZY + 30];
  if (t < a) return { p: BARD_N, tutulu: false };
  if (t < b) return { p: H.yay(BARD_N, hedef, ease.state(seg(t, a, b - a)), 46), tutulu: true };
  return { p: hedef, tutulu: false };
}
// Hikmet'in göğüs cebi (not kâğıdı ve kalem buradan çıkar)
function cepYeri(hp) {
  const n = H.eklem('hikmet', hp, 'neck'), sh = H.eklem('hikmet', hp, 'shR'), pv = H.eklem('hikmet', hp, 'pelvis');
  return [lerp(n[0], sh[0], 0.55), lerp(n[1], pv[1], 0.36)];
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => { H.cerceve(K, t, ep, tl, S, {
  split: { d4: 6 },
  kartSon: -1,   // kart ve sayaç ekran katmanında (bu bölüme özel sayaç: perde yok)
  dunya(K, t, B) { mutfak(K, t, tl, S, B); },
  kamera(cam, t, B) {   // sayaç: yavaş, doğrusal itme (zoom logaritmik uzayda)
    const d = B.sc.dogrusal; if (!d) return;
    const u = clamp01((t - B.sc.t0) / (B.sc.t1 - B.sc.t0));
    cam.zoom = Math.exp(lerp(Math.log(d[0]), Math.log(d[1]), u)); cam.cx = lerp(548, 552, u); cam.cy = 880 + 420 / cam.zoom;
  },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.cevap) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    S._B = B;
  },
});
  if (t < S.tm.end && S._B) ipucuKalir(K, t, tl, S, S._B);
};

// Cevapsız sürümde film "Buldum!"dan önce kesilir; ipucu cümlesi son karede de tam okunur kalsın (060'taki çözüm).
function ipucuKalir(K, t, tl, S, B) {
  const l = tl.lines.find(x => x.id === 'n1'), d3 = tl.lines.find(x => x.id === 'd3');
  if (t < l.t1 + 0.1 || t >= d3.t0 - 0.04) return;
  H.caption(K, { line: l, text: l.text, age: 5, left: 5 }, { y: 1255, head: null });
}

// "SEN DE DÜŞÜN!" sayacı (b060 uyarlaması): başlık kartın altında, daire sağda, paylaşım hapı masanın ön sırasında.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 850, y = 1262, r = 64;
  ctx.save(); ctx.translate(410, 1262); ctx.scale(inU * out, inU * out);
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
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(540, 1384); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 46px Rubik'; const sw = ctx.measureText(share).width + 64;
    K.rect(-sw / 2 + 8, -46 + 10, sw, 92, INK, 0, 46); K.rect(-sw / 2, -46, sw, 92, PAL.mustard, LW, 46); K.text(share, 0, 16, 46, INK, 900);
    ctx.restore();
  }
}

// Önkol masanın üstüne yeniden çizilir (masa karakterlerden sonra çizildiği için): dirsek → el, sonra el
function kolUst(K, key, p, side, zorla = false) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  if (h[1] < MB - 4 && !zorla) return;                         // el masanın üstünde değilse gerek yok
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}

// ═══════════════════════════ Mutfak: bütün sahneler ═══════════════════════════
function mutfak(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  if (id === 'zarflar') return ustten(K, t, S);
  M.mekanCiz(K, MUT, 'arka', t, { isik: M.ISIK.gunduz });
  for (const k of SIRA) sandalyeSirt(K, k);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  const kp = H.poseAt(H.CARDS.genc, S.kerBase, S.ker, t);
  if (id === 'sayac') { H.glance(kp, t, tm.cd - 0.5, 9.5); }
  // Ağız (denetim 26 Kas): yalnız konuşanın dudağı oynar. İfadenin kendi ağız açıklığı sıfırlanır (şaşkınlıkta bile
  // ağız kapalı); konuşanın dudağı hece fazından 1,5 kat belirgin açılır, kelime aralarında kapanır. Kerem konuşmaz.
  for (const [k, p] of [['defne', dp], ['hikmet', hp], ['necmi', np], ['genc', kp]]) {
    const ex = typeof p.expr === 'string' ? H.EXPR[p.expr] : p.expr;
    p.expr = { ...ex, open: 0 };
    p.talk = k === 'genc' ? 0 : Math.min(1, 1.5 * H.talkAt(tl, k, t));
  }
  // Defne "söylemem"de başını iki yana sallar
  if (t > tm.dSoyle - 0.05 && t < tm.dSoyle + 0.7) { const u = seg(t, tm.dSoyle - 0.05, 0.7); dp.head = { ...dp.head, look: [(dp.head.look?.[0] || 0) + 0.4 * Math.sin(TAU * 2 * u) * Math.sin(Math.PI * u), dp.head.look?.[1] || 0] }; }
  // Kerem "tahmin bile"de onaylar (nötr)
  H.onayla(kp, t, tm.tahmin + 0.35, 2, 0.32);
  // Hikmet siper: öne kamburlaşır
  const wK = pIn(t, tm.kalkan, tm.kalkanBit, 0.3);
  hp.y += 34 * wK;

  const Z = Object.fromEntries(SIRA.map(k => [k, zarfAt(S, k, t)]));
  // siper: Hikmet zarfını (ters) göğsüne bastırır, iki kolunu üstüne kavuşturur
  if (wK > 0.001) {
    const n = H.eklem('hikmet', hp, 'neck'), pv = H.eklem('hikmet', hp, 'pelvis'), g = [lerp(n[0], pv[0], 0.5) + 4, lerp(n[1], pv[1], 0.3)];
    const z = Z.hikmet, u = wK; Z.hikmet = { ...z, x: lerp(z.x, g[0], u), y: lerp(z.y, g[1], u), rot: lerp(z.rot, -7, u) };
  }
  const zt = (k, dx = 0, dy = -18) => [Z[k].x + dx, Z[k].y + dy];
  const dinlen = (k, side) => [Z[k].x + (side === 'L' ? -52 : 52), Z[k].y - 26];   // eller masada, zarfın iki yanında
  const kol = { hikmet: {}, defne: {}, necmi: {}, genc: {} }, isr = [];
  for (const k of SIRA) { kol[k].L = [dinlen(k, 'L'), 1, 'B']; kol[k].R = [dinlen(k, 'R'), 1, 'B']; }

  // ——— Hikmet ———
  // kare 0'dan itibaren sağ el zarfında: zarfı kendine çeker; "maaş"ta zarfa vurur
  kol.hikmet.R = [zt('hikmet', 30, -16 - 10 * H.nabiz(t, tm.maas - 0.08, 0.24)), 1, 'B'];
  // "Dördümüz": iki el zarfa basar
  for (const [k, a] of SIRA.map((k, i) => [k, tm.bas[i]])) {
    const w = pIn(t, a - 0.28, tm.kimse + 0.45, 0.24);
    if (w > 0.01) { kol[k].L = [zt(k, -26, -14), 1, 'B']; kol[k].R = [zt(k, 26, -14), 1, 'B']; if (k === 'necmi') kol[k].R = [zt(k, 58, -12), 1, 'B']; }
  }
  // h2b: "Hesap"ta telefona dokunur, "uygulama yok"ta yüzüstü çevirir; "Kâğıt"ta cebinden not destesi, "kalem"de kalem
  const telF = ease.state(seg(t, tm.yok2 - 0.05, 0.3));
  const cep = cepYeri(hp);
  const wTel = pIn(t, tm.hesap - 0.3, tm.yok2 + 0.35, 0.26);
  if (wTel > 0.01) { kol.hikmet.R = [[PX + 6, PY - 30 + 10 * H.nabiz(t, tm.hesap + 0.1, 0.22)], wTel, 'B']; if (t < tm.yok2 - 0.1 && wTel > 0.6) isr.push(['hikmet', 'R', [PX, PY - 10]]); }
  const desteU = ease.state(seg(t, tm.kagit, 0.5)), desteVar = t >= tm.kagit - 0.25;
  const destePos = kar([cep[0] + 6, cep[1] - 10], [PX, PY - 4], desteU);
  const wDes = pIn(t, tm.kagit - 0.3, tm.kagit + 0.75, 0.25);
  if (wDes > 0.01) kol.hikmet.R = [[destePos[0] + 4, destePos[1] + 18], wDes, 'B'];
  const kalemU = ease.state(seg(t, tm.kalemK - 0.05, 0.45)), kalemVar = t >= tm.kalemK - 0.3;
  const kalemPos = kar([cep[0] + 10, cep[1] - 20], [PX + 6, PY - 14], kalemU);
  const wKal = pIn(t, tm.kalemK - 0.3, tm.kalemK + 0.6, 0.25);
  if (wKal > 0.01) kol.hikmet.R = [[kalemPos[0], kalemPos[1] + 12], wKal, 'B'];
  // "serbest": iki avuç açılır (omuz)
  if (t > tm.serbest - 0.2 && t < tm.n2 - 0.2) { const w = pIn(t, tm.serbest - 0.2, tm.n2 - 0.4, 0.25); kol.hikmet.L[1] = 1 - w; kol.hikmet.R[1] = 1 - w; H.omuzSilk(hp, t, tm.serbest - 0.2, 0.4); }
  // siper: iki kol zarfın çevresinde, dirsekler dışarıda
  if (wK > 0.01) { kol.hikmet.L = [zt('hikmet', 52, 30), wK, 'B']; kol.hikmet.R = [zt('hikmet', 70, -10), wK, 'B']; }
  // ikaz ("Kimse kimsenin"): sağ el göğüs hizasında, çenenin altında parmak sallar. El hiçbir yüzün üstüne çıkmaz
  // (denetim 26 Kas: kaldırılan el Necmi'nin alnına düşüyordu). Sallama 3 Hz, ±0,22 rad.
  const sal = (a) => Math.sin(TAU * 3 * Math.max(0, t - a));
  const wIkH = pIn(t, tm.kimse - 0.1, tm.tahmin, 0.25), ikazH = wIkH > 0.05;
  if (wIkH > 0.001) { const b = kol.hikmet.R[0]; kol.hikmet.R = [kar(b, [KIM.hikmet.x + 62 + 5 * sal(tm.kimse), 1206], wIkH), 1, 'B']; }

  // ——— Defne ———
  kol.defne.R = [zt('defne', 34, -16), 1, 'B'];
  if (t >= tm.dAma - 0.3 && t < tm.n0) { kol.defne.L = [zt('defne', -40, -10), 1, 'B']; kol.defne.R = [zt('defne', 40, -10), 1, 'B']; }
  const wIkD = pIn(t, tm.d2 - 0.1, tm.elYazi - 0.15, 0.2), ikazD = wIkD > 0.05;   // "Olmaz": aynı ikaz, göğüs hizasında
  if (wIkD > 0.001) { const b = kol.defne.R[0]; kol.defne.R = [kar(b, [KIM.defne.x + 58 + 5 * sal(tm.d2), 1208], wIkD), 1, 'B']; }
  // "el yazısından": Necmi'nin elindeki kâğıdı gösterir
  const wGos = pIn(t, tm.elYazi - 0.3, tm.d2s + 0.1, 0.28);
  // Defne sayaçta zarfına parmakla tıklar; düşünürken sağ el çenede (poz izi)
  if (id === 'sayac' && t > tm.s.dDus - 0.1) kol.defne.R = null;
  if (t >= tm.buldum - 0.06 && t < tm.cevap) kol.defne.R = null;

  // ——— Necmi ———
  const bar = bardakAt(S, t);
  kol.necmi.R = [[BARD_N[0] - 4, BARD_N[1] - 26], 1, 'B'];
  if (t >= tm.olsem - 0.35 && t < tm.nSoyle + 0.4) { const w = pIn(t, tm.olsem - 0.35, tm.nSoyle + 0.1, 0.28); kol.necmi.R = [[bar.p[0] - 2, bar.p[1] - 26], 1, 'B']; if (w < 0.99 && t < tm.olsem) kol.necmi.R[1] = 1; }
  if (t >= tm.nSoyle + 0.1) kol.necmi.R = [zt('necmi', 56, -14), 1, 'B'];
  // n2: sol el desteden bir yaprak koparır, kaldırır; "karıştıralım"da iki el daire çizer
  const notTut = (t >= tm.notAl && t < tm.notBirak + 0.3) || (t >= tm.n1Al && t < tm.cevap);
  let notP = null;
  const elde = (a) => {   // yaprak desteden çıkar, göğüs hizasına kalkar
    const u = ease.enter(seg(t, a, 0.45));
    return kar([PX, PY - 6], [KIM.necmi.x - 92, KIM.necmi.y - 330], u);
  };
  if (t >= tm.notAl - 0.3 && t < tm.notBirak + 0.6) {
    let p = elde(tm.notAl);
    if (t >= tm.karis - 0.05 && t < tm.karis + 0.9) { const u = seg(t, tm.karis - 0.05, 0.9); p = [p[0] + 26 * Math.sin(TAU * 1.5 * u) * Math.sin(Math.PI * u), p[1] - 18 * (1 - Math.cos(TAU * 1.5 * u)) * Math.sin(Math.PI * u)]; }
    if (t >= tm.notBirak) p = kar(p, [PX, PY - 6], ease.state(seg(t, tm.notBirak, 0.45)));
    if (notTut) notP = p;
    kol.necmi.L = [[p[0] + 8, p[1] + 24], t < tm.notAl ? W(t, tm.notAl - 0.3, 0.28) : (t > tm.notBirak + 0.3 ? 1 - W(t, tm.notBirak + 0.3, 0.28) : 1), 'B'];
    if (t > tm.notBirak + 0.3) kol.necmi.L = [kar([PX + 8, PY + 18], dinlen('necmi', 'L'), W(t, tm.notBirak + 0.3, 0.3)), 1, 'B'];
  }
  if (t >= tm.n1Al - 0.3 && t < tm.cevap) {
    const p = elde(tm.n1Al); if (notTut) notP = p;
    kol.necmi.L = [[p[0] + 8, p[1] + 24], t < tm.n1Al ? W(t, tm.n1Al - 0.3, 0.28) : 1, 'B'];
  }
  if (id === 'sayac' && t > tm.s.nDus - 0.1) kol.necmi.R = null;
  if (t >= tm.n1 - 0.6 && t < tm.cevap) kol.necmi.R = [zt('necmi', 56, -14 - 8 * H.nabiz(t, tm.nMaas - 0.06, 0.24)), 1, 'B'];
  // sayaç: Necmi zarfının üstünde parmaklarını tıkırdatır
  if (id === 'sayac') kol.necmi.L = [[ZX.necmi - 50, ZY - 26 - 7 * Math.max(0, Math.sin(TAU * 3 * clamp01((t - tm.s.nTik) / 1.6))) * (t > tm.s.nTik && t < tm.s.nTik + 1.6 ? 1 : 0)], 1, 'B'];

  if (wGos > 0.01 && notP) kol.defne.R = [[lerp(KIM.defne.x + 60, notP[0], 0.55), lerp(1230, notP[1], 0.55)], wGos, 'B'];
  // ——— Kerem ———
  if (id === 'sayac' && t >= tm.s.kOrt - 0.3) { kol.genc.L = [zt('genc', -30, -10), 1, 'B']; kol.genc.R = [zt('genc', 30, -10), 1, 'B']; }

  // ——— çizim: kişiler → masa → zarflar ve nesneler → masa üstündeki önkollar → işaretler ———
  const opt = (k, heads) => { const o = { heads, sessiz: true }; if (kol[k].L) o.L = kol[k].L; if (kol[k].R) o.R = kol[k].R; return o; };
  const dc = oyna(K, t, tl, 'defne', dp, opt('defne', heads));
  const hc = oyna(K, t, tl, 'hikmet', hp, opt('hikmet', heads));
  const nc = oyna(K, t, tl, 'necmi', np, opt('necmi', heads));
  const kc = oyna(K, t, tl, 'genc', kp, { ...opt('genc', heads), sessiz: true });
  masa(K, t);
  // telefon, deste, kalem (Hikmet'le Necmi arası)
  telefon(K, PX, PY, telF);
  if (desteVar && desteU >= 1) notDeste(K, PX, PY - 4, -4);
  if (kalemVar && kalemU >= 1) kalem(K, PX + 6, PY - 14, -18);
  for (const k of SIRA) { const z = Z[k]; zarf(K, z.x, z.y, { rot: z.rot, bas: z.bas }); }
  cay(K, bar.p[0], bar.p[1] + 26, t, 1.1, true);
  for (const [k, c] of [['defne', dc], ['hikmet', hc], ['necmi', nc], ['genc', kc]]) { const z = k === 'hikmet' && wK > 0.5; kolUst(K, k, c.p, 'L', z); if (z) H.grip(K, k, H.eklem(k, c.p, 'handR'), c.p.s); else kolUst(K, k, c.p, 'R'); }
  // elden taşınan nesneler (elin altında, sonra el)
  if (desteVar && desteU < 1) { notDeste(K, destePos[0], destePos[1], -4 * desteU); hc.tut('R'); }
  if (kalemVar && kalemU < 1) { kalem(K, kalemPos[0], kalemPos[1], -18 * kalemU - 60 * (1 - kalemU)); hc.tut('R'); }
  if (notP) { notYaprak(K, notP[0], notP[1], -6, 1.25); nc.tut('L'); }
  if (bar.tutulu) nc.tut('R');
  for (const [k, sd, hd] of isr) ({ hikmet: hc, defne: dc, necmi: nc, genc: kc })[k].isaret(sd, hd);
  if (ikazH) hc.parmak('R', wIkH, { toplam: 1, yon: -Math.PI / 2 + 0.22 * sal(tm.kimse) });
  if (ikazD && !(wGos > 0.5 && notP)) dc.parmak('R', wIkD, { toplam: 1, yon: -Math.PI / 2 + 0.22 * sal(tm.d2) });
  if (wGos > 0.5 && notP) dc.isaret('R', notP);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// Insert (h2 "Dördümüz"): masa üstten. Karakterler kartın arkasında, masanın uzak kenarında oturur; yalnız önkollar,
// eller, dört ters zarf görünür. Eller yukarıda bekler, "Dördümüz"de soldan sağa sırayla kendi zarfına basar. Yüz yok.
function ustten(K, t, S) {
  const { tm } = S, { ctx } = K, k = 1.1, zy = 790;
  ctx.fillStyle = '#E8C99A'; ctx.fillRect(-200, -200, 1480, 2400);
  for (let y = 140; y < 2000; y += 230) K.line(-200, y, 1280, y, 3, '#D9B582');
  // telefon (yüzü yukarıda) ve çay bardakları üstten
  const tx = 300, ty = 1030;
  K.rect(tx - 38 + 5, ty - 62 + 6, 76, 124, INK, 0, 14); K.rect(tx - 38, ty - 62, 76, 124, '#2E3338', LW * 0.7, 14); K.rect(tx - 30, ty - 52, 60, 104, '#CFE3DD', 0, 7);
  [PAL.coral, PAL.mustard, PAL.teal, PAL.green, '#7FA79B', PAL.coral].forEach((c, i) => K.rect(tx - 22 + (i % 2) * 26, ty - 42 + Math.floor(i / 2) * 30, 18, 18, c, 2, 5));
  const ustCay = (x, y) => { K.circ(x, y, 46, PAL.cream, 3); K.circ(x, y, 30, '#F3EEE4', 3); K.circ(x, y, 23, '#A8401F', 0); };
  ustCay(160, 1010); ustCay(440, 1010); ustCay(860, 1010);
  K.circ(620, 1030, 84, PAL.paper, 3); K.circ(620, 1030, 60, '#C4874A', 8); K.circ(620, 1030, 22, '#E8C99A', 0);
  // altyazının altında: not destesi ve kalem, şekerlik, demlik (üstten)
  K.rect(160, 1380, 150, 120, '#E9E4DA', 3, 6); K.rect(150, 1370, 150, 120, '#FFF8D8', LW * 0.6, 6); kalem(K, 300, 1440, -30);
  K.circ(560, 1420, 58, '#E9E4DA', 3); K.circ(560, 1420, 44, '#F3EEE4', 3);
  K.circ(860, 1420, 80, '#C9CFC9', LW * 0.8); K.circ(860, 1420, 40, '#E3E6E1', 3); K.circ(860, 1420, 12, INK, 0); H.buhar(K, 940, 1360, t, { k: 0.5, n: 2, ara: 12, boy: 70 });
  const xs = [225, 435, 645, 855];   // dünya; 1,15x kamerayla ekranda 178–902
  SIRA.forEach((key, i) => {
    const c = H.CARDS[key], a = tm.bas[i], d = 0.14;
    const inU = ease.state(seg(t, a - d, d));                    // el iner, temas karesinde durur
    const bas = H.nabiz(t, a + 0.02, 0.24);
    const hx = xs[i] + 26, hy = lerp(zy - 150, zy - 14, inU);
    zarf(K, xs[i], zy, { rot: [-4, 3, -2, 4][i], k, bas });
    if (key === 'necmi') ustCay(xs[i] + 70, zy + 30);
    const ox = hx + (i - 1.5) * 40, w = c.arm.w * 260, lw = c.line * 260;
    ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ox, -80); ctx.lineTo(hx, hy);
    ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke();
    const u = H.unit([ox, -80], [hx, hy]), m = [hx - u[0] * 46, hy - u[1] * 46];   // manşet
    ctx.beginPath(); ctx.moveTo(m[0] - u[1] * w * 0.55, m[1] + u[0] * w * 0.55); ctx.lineTo(m[0] + u[1] * w * 0.55, m[1] - u[0] * w * 0.55); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    K.circ(hx, hy, c.arm.hand * 300 * (1 + 0.04 * bas), c.skin, c.line * 260);
  });
}
