// Bölüm 85 · EĞRİ TERAZİ (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_085_v5.md).
// Mekanizma: işlem kısıtı (S2). Kolları eşit olmayan ama tutarlı terazide, aynı kefede aynı karşı yükü dengeleyen iki şey
// eşit ağırlıktadır (cevap arşivde kalır, kesilir).
// Logline: Hikmet Bey annesinin helva tarifini getirir: tam bir kilo şeker. Çay ocağındaki eski pirinç terazinin kolları eşit
// değil ama sağlam. Defne'nin önünde yalnız bir kiloluk tek ağırlık ve bir çuval şeker var. Necmi ağırlığı bir sol kefeye,
// bir sağ kefeye koyup "ortasını al" der; Defne: "Olmaz, ortası da kayar. Tam bir kiloyu nasıl tartarım?"
// Akılda kalacak tek şey: şeker de bir ağırlıktır.
// Sızıntı yasağı: kefeye hiçbir karede şeker dökülmez; sayaç ve ipucu boyunca ağırlık sağ kefede durur (Necmi'nin bıraktığı
// yer), kaldırılmaz. "Aynı kefe", "yerine koy" yazısı yok. Kadrajda başka kap, ağırlık ya da tartı aleti yok (çay ocağında
// çaydanlık ve bardak bile çizilmez).
// Terazi: dayanak ortada değil; sol kol 215, sağ kol 95 (2,3 kat). Boşken düz durur; kefe tezgâha değince durur.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OCAK = 'b085_ocak';
const X = { hik: 135, nec: 545, necSol: 475, necSag: 560, def: 900 };
const HIK_Y = 1555;                                // Hikmet tezgâhın arkasında bir basamak alçakta: kartla başı arasında boşluk kalsın
const NEC_Y = 1465;                                // Necmi bir basamak yüksekte durur: çenesi kolun üstünde kalır
const SY = 1284;                                   // tezgâhta nesnelerin oturduğu çizgi
const TEZ = { ust: 1262, on: 1292 };               // tezgâhın üst bandı ve ön kenarı
// Terazi: dayanak (PX, PY); sol kol LA, sağ kol RA; zincir CH; kefe yarıçapı PR, derinliği PD
const TZ = { PX: 600, PY: 1105, LA: 215, RA: 95, CH: 108, PR: 68, PD: 24 };
const GAP = SY - (TZ.PY + TZ.CH + TZ.PD);          // düz dururken kefe dibi ile tezgâh arası (20)
const ACI_SOL = -12;                               // ağırlık uzun koldaki kefede: kol dayanakta durana kadar iner (sol kefe 45 px iner)
const ACI_SAG = 9;                                 // ağırlık kısa koldaki kefede (sağ kefe 15 px iner)
const AG = { w: 124, h: 62, x0: 830 };             // 1 kg pirinç ağırlık (gövde) ve tezgâhtaki yeri (Defne'nin önü, solu)
const CUVAL = { x: 990, w: 150, h: 150 };         // şeker çuvalı (Defne'nin önü, sağı)
const KAGIT = { w: 172, h: 206 };                  // Hikmet'in tarif kâğıdı
const PIRINC = '#D6A93F', PIRINC_K = '#A9822B', PIRINC_A = '#EBCB74';
// Kameralar [zoom, cx, cy]. Kart 300–509 px (gölgeyle): saç tepeleri ≥ 550 px; tezgâh hattı ≤ 1231 px (altyazı balonu 1255)'te başlar.
const KAM = {
  hikmet: [1.42, 395, 1080],
  terazi: [1.42, 668, 1108],
  defne: [1.5, 1023, 1095],
  necmi: [1.42, 670, 1107],
  grup: [1.42, 670, 1107],
  buldum: [1.45, 900, 1100],
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz; konuşurken talkAt ağzı açar)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  gurur: { brow: 0.04, browTilt: -0.06, eye: 0.95, pupil: 1, curve: 0.3, open: 0, w: 1.0 },      // Hikmet: annesinin tarifi
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  saskin: { brow: 0.11, browTilt: -0.12, eye: 1.2, pupil: 0.8, curve: 0, open: 0, w: 0.7 },
  emin: { brow: 0.02, browTilt: 0.06, eye: 0.98, pupil: 1, curve: 0.24, open: 0, w: 1.0 },       // Necmi: fikrinden emin
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Terazi ═══════════════════════════
// Kol açısı a (derece; + saat yönü = sağ kefe aşağı). Uçlar ve kefe ağzı (dünya).
const ucSol = a => [TZ.PX - TZ.LA * Math.cos(a * D2R), TZ.PY - TZ.LA * Math.sin(a * D2R)];
const ucSag = a => [TZ.PX + TZ.RA * Math.cos(a * D2R), TZ.PY + TZ.RA * Math.sin(a * D2R)];
const agiz = (a, sag) => { const u = sag ? ucSag(a) : ucSol(a); return [u[0], u[1] + TZ.CH]; };
// Kefe: ağız merkezi c; on: false → arka yarı (zincirler ve içi), true → ön gövde (ağırlığın dibini örter)
function kefe(K, c, uc, on) {
  const { ctx } = K, [x, y] = c, r = TZ.PR;
  if (!on) {
    ctx.save(); ctx.lineCap = 'round';
    for (const p of [[x - r + 6, y], [x + r - 6, y], [x, y - 7]]) H.strokeLine(ctx, [uc[0], uc[1] + 8], p, 3.5, '#7A5E22');
    ctx.restore();
    K.ell(x, y, r, 10, PIRINC_K, LW * 0.7);
    return;
  }
  ctx.beginPath(); ctx.moveTo(x - r, y); ctx.quadraticCurveTo(x, y + TZ.PD * 2, x + r, y); ctx.quadraticCurveTo(x, y + 9, x - r, y); ctx.closePath();
  K.fs(PIRINC, LW * 0.8);
  ctx.beginPath(); ctx.moveTo(x - r * 0.6, y + 10); ctx.quadraticCurveTo(x - r * 0.2, y + 19, x + r * 0.1, y + 17); ctx.lineWidth = 4; ctx.strokeStyle = PIRINC_A; ctx.lineCap = 'round'; ctx.stroke();
}
// Gövde: kaide, direk, gösterge plakası (kol ve ibre ayrı çizilir)
function teraziGovde(K) {
  const { PX, PY } = TZ;
  K.poly([[PX - 46, SY], [PX - 36, TEZ.ust + 4], [PX + 36, TEZ.ust + 4], [PX + 46, SY]], PIRINC_K, LW * 0.8);
  K.ell(PX, TEZ.ust + 4, 36, 6, PIRINC, LW * 0.6);
  K.rect(PX - 9, PY, 18, TEZ.ust - PY + 4, PIRINC, LW * 0.7, 4);
  K.rect(PX - 14, PY + 92, 28, 10, PIRINC_K, LW * 0.5, 4);
  // gösterge plakası: yarım ay, ortada çentik
  const { ctx } = K;
  ctx.beginPath(); ctx.moveTo(PX - 30, PY + 60); ctx.quadraticCurveTo(PX, PY + 86, PX + 30, PY + 60); ctx.lineTo(PX + 24, PY + 52); ctx.quadraticCurveTo(PX, PY + 74, PX - 24, PY + 52); ctx.closePath();
  K.fs('#F1E3B8', LW * 0.5);
  K.line(PX, PY + 63, PX, PY + 75, 4, INK);
}
// Kol: dayanak çevresinde a derece döner; ibre aşağı bakar (kola dik), uçlarda kanca
function teraziKol(K, a) {
  const { ctx } = K, { PX, PY, LA, RA } = TZ;
  ctx.save(); ctx.translate(PX, PY); ctx.rotate(a * D2R);
  ctx.save(); ctx.lineCap = 'round'; H.strokeLine(ctx, [0, 0], [0, 70], 10, INK); H.strokeLine(ctx, [0, 0], [0, 70], 4, PIRINC_K); ctx.restore();   // ibre
  K.rect(-LA - 4, -10, LA + RA + 8, 20, PIRINC, LW * 0.8, 10);
  K.line(-LA + 10, -2, RA - 10, -2, 3, PIRINC_A);
  for (const x of [-LA, RA]) { K.circ(x, 0, 11, PIRINC_K, LW * 0.6); K.circ(x, 0, 4, INK, 0); }
  K.circ(0, 0, 16, PIRINC_K, LW * 0.7); K.circ(0, 0, 6, INK, 0);
  ctx.restore();
}

// ═══════════════════════════ Diğer nesneler ═══════════════════════════
// 1 kg pirinç ağırlık: (x, yb) tabanın ortası. Gövdede "1 kg". Tutuş noktası topuz: (x, yb − 92)
const TOPUZ = 92;
function agirlik(K, [x, yb]) {
  const { ctx } = K, w = AG.w, h = AG.h;
  K.rect(x - w / 2, yb - h, w, h, PIRINC, LW * 0.8, 12);
  K.ell(x, yb - h, w / 2 - 2, 9, PIRINC_A, LW * 0.6);
  K.rect(x - 17, yb - h - 20, 34, 16, PIRINC_K, LW * 0.6, 5);
  K.circ(x, yb - TOPUZ + 4, 17, PIRINC, LW * 0.7);
  ctx.save(); ctx.lineCap = 'round'; H.strokeLine(ctx, [x - w / 2 + 12, yb - h + 18], [x - w / 2 + 12, yb - 10], 5, PIRINC_A); ctx.restore();
  K.text('1 kg', x + 2, yb - 13, 44, INK, 900);
}
// Şeker çuvalı: (x, yb) tabanın ortası. Ağzı kıvrık; içinde beyaz şeker tümseği (tohumlu tanecikler)
function cuval(K, [x, yb], t) {
  const { ctx } = K, w = CUVAL.w, h = CUVAL.h;
  ctx.beginPath(); ctx.moveTo(x - w / 2, yb); ctx.quadraticCurveTo(x - w / 2 - 12, yb - h * 0.55, x - w / 2 + 8, yb - h);
  ctx.lineTo(x + w / 2 - 8, yb - h); ctx.quadraticCurveTo(x + w / 2 + 12, yb - h * 0.55, x + w / 2, yb); ctx.closePath();
  K.fs('#C8A46A', LW * 0.8);
  // çuval dokusu
  ctx.save(); ctx.globalAlpha = 0.35; for (let i = 1; i < 6; i++) K.line(x - w / 2 + 6, yb - i * 24, x + w / 2 - 6, yb - i * 24, 2.5, '#8E6E3E'); ctx.restore();
  // şeker tümseği
  const ty = yb - h;
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 12, ty + 2); ctx.quadraticCurveTo(x, ty - 46, x + w / 2 - 12, ty + 2); ctx.closePath(); K.fs('#FBF8F0', LW * 0.6);
  const rnd = H.mulberry32(85);
  for (let i = 0; i < 16; i++) { const u = rnd(), v = rnd(); K.circ(x - 46 + u * 92, ty - 4 - v * 26 * (1 - Math.abs(u - 0.5) * 1.6), 2.2, '#D8D2C4', 0); }
  // kıvrık ağız (bant)
  K.rect(x - w / 2 + 2, ty - 2, w - 4, 22, '#B48F55', LW * 0.7, 8);
  void t;
}
// Tarif kâğıdı: c merkez, rot derece. "HELVA" başlığı + el yazısı çizgileri
function tarif(K, c, rot = 0) {
  const { ctx } = K, w = KAGIT.w, h = KAGIT.h;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(rot * D2R);
  K.rect(-w / 2 + 7, -h / 2 + 9, w, h, 'rgba(20,30,28,0.25)', 0, 6);
  K.rect(-w / 2, -h / 2, w, h, '#EEDDAE', LW * 0.7, 6);
  K.text('HELVA', 0, -h / 2 + 56, 46, '#7A3B22', 900);
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const y = -h / 2 + 86 + i * 24, L = [118, 96, 124, 80, 104][i];
    ctx.beginPath(); ctx.moveTo(-w / 2 + 18, y);
    for (let j = 0; j < 6; j++) ctx.quadraticCurveTo(-w / 2 + 22 + j * L / 6, y - 7 + (j % 2) * 12, -w / 2 + 18 + (j + 1) * L / 6, y);
    ctx.lineWidth = 3.5; ctx.strokeStyle = '#6B5A3E'; ctx.stroke();
  }
  ctx.restore();
}
const kagitNok = (c, rot, [x, y]) => { const a = rot * D2R; return [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)]; };

// ═══════════════════════════ Mekân: çay ocağı (kap yok) ═══════════════════════════
function tezgah(K) {
  const { ctx } = K, x0 = -600, x1 = 1900;
  K.rect(x0, TEZ.ust, x1 - x0, TEZ.on - TEZ.ust, '#D9C6A2', LW * 0.8, 0);       // mermer üst
  ctx.save(); ctx.globalAlpha = 0.4; for (let x = x0 + 40; x < x1; x += 230) K.line(x, TEZ.ust + 8, x + 70, TEZ.on - 8, 2.5, '#B7A27C'); ctx.restore();
  K.rect(x0, TEZ.on, x1 - x0, 1300, PAL.wood, LW, 0);                           // dolap önü
  for (let x = -560; x < x1; x += 310) {
    K.rect(x, TEZ.on + 40, 280, 120, PAL.woodTop, LW * 0.6, 8);                   // çekmece
    K.rect(x + 110, TEZ.on + 92, 60, 14, '#E9DCC2', 3, 7);
    K.rect(x, TEZ.on + 190, 280, 560, PAL.woodTop, LW * 0.6, 8);                  // kapak
    K.rect(x + 22, TEZ.on + 212, 236, 516, null, 3, 6);
    K.circ(x + 240, TEZ.on + 290, 10, '#E9DCC2', 3);
  }
}
M.mekanEkle(OCAK, {
  gen: [-600, 1900], dongu: ['penceredeki bulut ve martı', 'duvar saatinin saniye kolu'],
  capa: { terazi: [TZ.PX, TZ.PY] }, kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'fayans', zemin: 'karo' });
    M.pencere(K, 250, 400, 290, 330, { isik, t: t + 4, manzara: 'istanbul', kayit: false });
    M.duvarSaati(K, 940, 540, 62, 10.25 + t / 3600, t);
    // havlu askısı ve el havlusu (pencerenin sağında; kap değil)
    K.line(640, 690, 760, 690, 8, INK); K.line(640, 690, 760, 690, 4, PAL.metal);
    K.poly([[652, 690], [748, 690], [744, 820], [656, 820]], PAL.coral, LW * 0.7);
    K.line(656, 800, 744, 800, 4, PAL.cream);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), tam: T('h1:2'), bir: T('h1:3'), kilo: T('h1:4'), ne: T('h1:6'), fazla: T('h1:9'), ne2: T('h1:10'), eksik: T('h1:11'), h1s: T('h1>'),
    h2: T('h2'), kollari: T('h2'), esit: T('h2:1'), degil: T('h2:2'), saglam: T('h2:4'), her: T('h2:5'), dengede: T('h2:6'), ayni: T('h2:7'), h2s: T('h2>'),
    d1: T('d1'), kiloluk: T('d1:2'), agirlik: T('d1:4'), seker: T('d1:5'), baska: T('d1:7'), yok: T('d1:10'), d1s: T('d1>'),
    n0: T('n0'), sol: T('n0:1'), tart: T('n0:3'), bir2: T('n0:4'), sag: T('n0:5'), kefede2: T('n0:6'), orta: T('n0:7'), n0s: T('n0>'),
    d2: T('d2'), ortasi: T('d2:1'), kayar: T('d2:3'), tamD: T('d2:4'), d2s: T('d2>'),
    n1: T('n1'), de: T('n1:1'), agirliktir: T('n1:3'), n1s: T('n1>'),
  };
  tm.hikKes = tm.tam - 0.1; tm.terKes = tm.h2 - 0.1; tm.defKes = tm.d1 - 0.12; tm.necKes = tm.n0 - 0.1; tm.grupKes = tm.d2 - 0.1;
  // Ağırlık: Defne kaldırır, Necmi'ye verir, Necmi sol kefeye, sonra sağ kefeye koyar
  tm.kaldir = tm.kiloluk - 0.12;                     // Defne'nin sol eli topuzda (uzanma 0,28 sn önce)
  tm.uzat = tm.yok - 0.05;                           // Defne ağırlığı Necmi'ye doğru uzatır (0,4 sn)
  tm.al = tm.n0 + 0.12;                              // iki el ağırlıkta (≥ 5 kare)
  tm.birak = tm.n0 + 0.32;                           // Defne bırakır; Necmi taşır
  tm.solIn = tm.tart - 0.02;                         // sol kefeye iner
  tm.solKalk = tm.bir2 - 0.08;                       // sol kefeden kalkar
  tm.sagIn = tm.kefede2 + 0.08;                      // sağ kefeye iner
  // Kefeye bastırma (h2 "her dengede"): Necmi sol kefeyi bastırır, bırakır; kol yine aynı yerde durur
  tm.bas = tm.her - 0.05; tm.basBirak = tm.dengede + 0.12;
  const film = H.sahneler([
    { id: 'hikmet', t0: 0, cam: [[0, 1.4, 378, 1082], [tm.terKes - 0.1, 1.44, 380, 1079]] },
    { id: 'terazi', t0: tm.terKes, cam: [[0, ...KAM.terazi], [tm.defKes - 0.1, 1.44, 669, 1106]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.necKes - 0.1, 1.52, 1024, 1094]] },
    { id: 'grup', t0: tm.necKes, cam: [[0, ...KAM.grup], [tm.d2, 1.43, 671, 1106], [cd0 - 0.05, 1.42, 670, 1107]] },   // tuzak, çürütme, sayaç tek plân; sayaçta doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.cevap + 4, 1.32, 700, 1166], [tm.end - 0.2, 1.4, 760, 1150]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1') };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// ═══════════════════════════ Zaman durumları ═══════════════════════════
// Kolun açısı (derece): bastırma (h2), ağırlık sol kefede, ağırlık sağ kefede
function aciAt(tm, t) {
  let a = ACI_SOL * pIn(t, tm.bas, tm.basBirak, 0.3, 0.5);
  a += ACI_SOL * W(t, tm.solIn, 0.3) * (1 - W(t, tm.solKalk, 0.3));
  a += ACI_SAG * W(t, tm.sagIn, 0.3);
  return a;
}
// Ağırlığın yeri: { p: taban (dünya), kim: 'yer' | 'defne' | 'necmi', kefe: null | 'sol' | 'sag' }
function agAt(tm, t) {
  const yer = [AG.x0, SY];
  const sunum = [828, 1218];                          // Defne gösterir (etiket okunur)
  const verYer = [765, 1218];                         // Necmi'ye uzatır
  if (t < tm.kaldir) return { p: yer, kim: 'yer' };
  if (t < tm.birak) {
    let p = H.tasi(t, tm.kaldir, 0.4, yer, sunum, 0, ease.enter);
    if (t >= tm.uzat) p = H.tasi(t, tm.uzat, 0.4, sunum, verYer, 0);
    return { p, kim: t >= tm.al ? 'iki' : 'defne' };
  }
  const solTaban = a => { const g = agiz(a, false); return [g[0], g[1] + 6]; };
  const sagTaban = a => { const g = agiz(a, true); return [g[0], g[1] + 6]; };
  if (t < tm.solIn) return { p: H.tasi(t, tm.birak, tm.solIn - tm.birak, verYer, solTaban(0), 70), kim: 'necmi' };
  if (t < tm.solKalk) return { p: solTaban(aciAt(tm, t)), kim: 'necmi', kefe: 'sol' };
  const a = aciAt(tm, t);
  if (t < tm.sagIn) return { p: H.tasi(t, tm.solKalk, tm.sagIn - tm.solKalk, solTaban(ACI_SOL), sagTaban(0), 80), kim: 'necmi' };
  return { p: sagTaban(a), kim: t < tm.sagIn + 0.25 ? 'necmi' : 'kefe', kefe: 'sag' };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'grup' && t >= tm.cd0 - 0.05) {   // sayaç ve ipucu: doğrusal itme
      const u = clamp01((t - (tm.cd0 - 0.05)) / (tm.buldum - tm.cd0));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.42), Math.log(1.46), u)), cx: lerp(670, 672, u), cy: lerp(1107, 1100, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, B.heads, { y: 1255, split: { h2: 5, d1: 7 } });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, B.heads, { y: 1255 });
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
  const { tm } = S, { heads } = B, id = B.sc.id, tl = S.tlS;
  const tlTum = { ...S.tlS, lines: [...S.tlS.lines, ...S.tlN.lines] };   // dudak: n1 dahil
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  const sayacta = t >= tm.cd0 - 0.05 && t < tm.buldum;
  const ipucu = t >= tm.n1 - 0.3 && t < tm.buldum;
  const konusan = ['h1', 'h2', 'd1', 'n0', 'd2', 'n1'].find(k => { const l = tlTum.lines.find(x => x.id === k); return l && t >= l.t0 - 0.1 && t < l.t1 + 0.25; });
  const a = aciAt(tm, t), ag = agAt(tm, t);
  const gSol = agiz(a, false), gSag = agiz(a, true);
  const ibreUc = [TZ.PX - 70 * Math.sin(a * D2R), TZ.PY + 70 * Math.cos(a * D2R)];

  // ——— Hikmet (solda; tarif kâğıdı) ———
  const kKalk = W(t, 0.3, 0.42) * (1 - W(t, tm.terKes + 0.3, 0.4));          // 0,3 sn: kâğıdı göğsünden yüz hizasının yanına kaldırır
  const KC = t >= tm.terKes ? [150, 1185] : kar([318, 1175], [330, 1080], kKalk), KR = t >= tm.terKes ? -4 : lerp(-4, 3, kKalk);
  const hikB = t < tm.terKes ? (t < tm.tam - 0.2 ? [0, 0.05] : t < tm.ne - 0.1 ? [0.55, 0.15] : [0.05, 0.02]) : [0.6, 0.35];
  const hp = H.kisi('hikmet', { x: X.hik, y: HIK_Y, expr: IF.gurur, ...POZ.dur, head: { tilt: 0, look: hikB } });
  const hO = { heads };
  const kSol = kagitNok(KC, KR, [-KAGIT.w / 2 + 14, KAGIT.h / 2 - 22]);          // kâğıdın sol alt köşesi (sağ el)
  // terazi plânı: kâğıt kadraj dışında kalır; Hikmet'in sağ eli soldan girer, uzun kolun ucunu gösterir, sonra ucu bastırıp bırakır
  const kagitVar = t < tm.terKes;
  const uS0 = ucSol(a);
  const wHik = pIn(t, tm.kollari - 0.3, tm.basBirak + 0.25, 0.28, 0.3);
  if (kagitVar) hO.R = [kSol, 1, 'A'];
  else if (wHik > 0.01) { hO.R = [t < tm.bas - 0.05 ? [uS0[0] - 44, uS0[1] + 14] : [uS0[0] + 4, uS0[1] + 6], wHik, 'A']; hp.head.look = [0.7, 0.3]; }
  // "tam bir kilo": sol el ikinci satıra dokunur; "Ne … ne": sol el parmak sallar (yüzün yanında, kâğıdın dışında)
  const wDok = pIn(t, tm.bir - 0.3, tm.h1s + 0.3, 0.28, 0.3);
  const wSal = 0;
  const dokunNok = kagitNok(KC, KR, [-10, -KAGIT.h / 2 + 108]);
  const tik = [tm.bir, tm.kilo, tm.fazla, tm.eksik].reduce((m, tt) => m + H.nabiz(t, tt - 0.06, 0.26), 0);   // her vurguda parmak kâğıda dokunur
  if (wDok > 0.01) hO.L = [[dokunNok[0] - 30, dokunNok[1] + 34 - 16 * (1 - tik)], wDok, 'A'];
  else if (wSal > 0.01) hO.L = [[X.hik - 120 + 14 * Math.sin(TAU * (t - tm.ne) / 0.5), 1000], wSal, 'B'];
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);

  // ——— Necmi (dayanağın arkasında) ———
  let nx = X.nec;
  const np0 = H.kisi('necmi', { x: X.nec, y: NEC_Y, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [-0.5, 0.15] } });
  if (t >= tm.birak) { H.yanAdim(np0, t, { t0: tm.birak, x0: X.nec, x1: X.necSol, adim: 1 }); if (t >= tm.solKalk) H.yanAdim(np0, t, { t0: tm.solKalk, x0: X.necSol, x1: X.necSag, adim: 1 }); }
  const np = np0; nx = np.x;
  let nL = konusan === 'h1' || konusan === 'h2' && t < tm.kollari - 0.2 ? bak([nx], [KC[0]], 0.2) : [0, 0.25];
  const nO = { heads };
  // h2 "kolları eşit değil": iki işaret parmağı kolun iki ucunda; "her dengede": sol el sol kefeyi bastırır
  const wUc = pIn(t, tm.esit - 0.3, tm.saglam + 0.1, 0.28, 0.3);
  const wBas = 0;
  const uS = ucSol(a), uG = ucSag(a);
  if (wUc > 0.01) {
    nO.R = [[uG[0] - 22, uG[1] + 28], wUc, 'A'];
    nL = [0.55, 0.4]; np.expr = IF.dusun;
  }
  if (t >= tm.kollari - 0.3 && t < tm.terKes + 10 && t < tm.defKes && wUc < 0.5) nL = [-0.6, 0.4];   // Hikmet'in eline bakar
  // tuzak: Necmi ağırlığı alır, sol kefeye koyar, sağ kefeye taşır; "ortasını al": iki avuç yukarı, terazi gibi iner kalkar
  const nTut = ag.kim === 'iki' || ag.kim === 'necmi';
  const topuz = [ag.p[0], ag.p[1] - TOPUZ + 4];
  if (t >= tm.defKes && t < tm.d2) {
    np.expr = IF.emin;
    const wAl = W(t, tm.al - 0.28, 0.28);
    const wSalla = pIn(t, tm.orta - 0.15, tm.n0s + 0.25, 0.3, 0.3);
    if (nTut || t < tm.al) { const hazir = [nx + 70, 1140];   // el ağırlığa yukarıdan, yazının üstünden geçmeden gelir
      nO.R = [kar(hazir, [topuz[0] + 10, topuz[1] + 6], nTut ? 1 : wAl), W(t, tm.defKes, 0.3), 'A']; }
    else if (t < tm.sagIn + 0.6) nO.R = [[topuz[0] + 10, topuz[1] + 6], 1 - W(t, tm.sagIn + 0.25, 0.3), 'A'];
    nL = t < tm.birak ? [0.6, 0.4] : t < tm.solKalk ? [-0.6, 0.5] : [0.4, 0.5];
    if (wSalla > 0.01) {
      const s = Math.sin(TAU * (t - tm.orta) / 0.7);
      nO.L = [[nx - 70, 1150 + 14 * s], wSalla, 'A']; nO.R = [[nx + 52, 1150 - 14 * s], wSalla, 'A'];
      nL = [0.05, -0.05];
    }
  }
  // d2: Defne'ye bakar; sayaç: avuçlarla tartar, çenesini tutar, iki kefeye sırayla bakar
  let nAvuc = 0, nCene = 0;
  if (t >= tm.d2 && t < tm.buldum) {
    np.expr = IF.saskin; nL = bak([nx], [X.def], 0.15);
    if (t >= tm.ortasi && t < tm.kayar + 0.4) nL = [0.1, 0.5];
    if (sayacta) {
      const c0 = tm.cd0; np.expr = IF.dusun;
      nAvuc = pIn(t, c0 + 0.4, c0 + 3.6, 0.3, 0.3);
      nCene = pIn(t, c0 + 4.1, c0 + 6.3, 0.3, 0.3);
      if (nAvuc > 0.01) { const s = Math.sin(TAU * (t - c0 - 0.4) / 1.1); nO.L = [[nx - 70, 1150 + 14 * s], nAvuc, 'A']; nO.R = [[nx + 52, 1150 - 14 * s], nAvuc, 'A']; nL = s > 0 ? [-0.35, 0.3] : [0.35, 0.3]; }
      if (nCene > 0.01) { const h = H.eklem('necmi', np, 'head'); nO.L = [[h[0] - 0.42 * np.s, h[1] + 0.5 * np.s], nCene, 'B']; nL = [-0.3, -0.2]; }
      if (t >= c0 + 6.3) nL = Math.floor((t - c0 - 6.3) / 1.3) % 2 ? [-0.6, 0.5] : [0.5, 0.5];
      if (ipucu) { np.expr = IF.merak; nL = bak([nx], [985], 0.25); }
    }
  }
  if (id === 'cevap') { nL = Math.floor((t - tm.cevap) / 0.9) % 2 ? [-0.6, 0.5] : [0.5, 0.5]; np.expr = IF.merak; }
  np.head.look = nL;
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);

  // ——— Defne (sağda; önünde ağırlık ve çuval) ———
  let dL = [-0.45, 0.1], dE = IF.sakin;
  if (t < tm.terKes) dL = bak([X.def], [X.hik], 0.05);
  else if (t < tm.defKes) dL = [-0.6, 0.45];
  const dp = H.kisi('defne', { x: X.def, expr: dE, ...POZ.dur, head: { tilt: 0, look: dL } });
  const dO = { heads };
  let dParmak = null, dAvuc = 0, dSeker = 0, dIsaret = 0, dDok = 0;
  // d1: sol el ağırlığı kaldırır (topuzdan), gösterir, Necmi'ye uzatır; sağ el çuvala dokunur; "başka hiçbir şey yok": avuç açılır
  const dTut = ag.kim === 'yer' || ag.kim === 'defne' || ag.kim === 'iki';   // eli baştan ağırlığın topuzunda
  if (t >= tm.defKes - 0.05 && t < tm.d2) {
    dE = IF.sakin;
    dL = t < tm.seker - 0.1 ? [0, 0.05] : t < tm.baska - 0.05 ? [0.3, 0.45] : [0, 0];
    if (t >= tm.yok - 0.05) dL = bak([X.def], [X.nec], 0.3);
    if (t >= tm.n0) dL = t < tm.solKalk ? [-0.7, 0.45] : [-0.45, 0.5];
    dDok = pIn(t, tm.seker - 0.3, tm.baska - 0.05, 0.28, 0.3);
    dAvuc = pIn(t, tm.baska - 0.05, tm.d1s + 0.35, 0.3, 0.3);
    if (t >= tm.baska + 0.1 && t < tm.d1s) dL = [0.4 * Math.sin(TAU * (t - tm.baska - 0.1) / 0.6), 0.05];
  }
  if (dTut) dO.L = [[topuz[0] + 4, topuz[1] + 8], 1, 'A'];
  else if (t >= tm.birak && t < tm.birak + 0.45) dO.L = [[769, 1218 - TOPUZ + 12], 1 - W(t, tm.birak, 0.35), 'A'];
  if (dDok > 0.01) { const tk = 0.5 + 0.5 * Math.cos(TAU * clamp01((t - tm.seker) / 0.5) * 2); dO.R = [[CUVAL.x - 10, SY - CUVAL.h - 30 - 18 * (1 - tk)], dDok, 'A']; }
  if (dAvuc > 0.01) dO.R = [[X.def + 150, 1150], dAvuc, 'B'];
  // d2: "Olmaz": başını sallar; "ortası da kayar": sol el dayanağı (ibreyi) gösterir; soru: avuçlar açık, bize bakar
  if (t >= tm.d2 - 0.1 && t < tm.cd0) {
    dL = t < tm.ortasi ? [0.45 * Math.sin(TAU * (t - tm.d2) / 0.5), 0.05] : t < tm.tamD - 0.1 ? [-0.7, 0.45] : [0, 0];
    dIsaret = pIn(t, tm.ortasi - 0.25, tm.tamD - 0.05, 0.28, 0.3);
    if (dIsaret > 0.01) dO.L = [[TZ.PX + 150, TZ.PY + 40], dIsaret, 'A'];
    if (t >= tm.tamD - 0.1) H.omuzSilk(dp, t, tm.tamD, Math.max(0.2, tm.d2s - tm.tamD - 0.2));
    dE = IF.sakin;
  }
  // sayaç: parmak yanakta düşünür, kefelere bakar; ipucu: çuvaldan bir avuç şeker alır, avucunda tartar
  if (sayacta) {
    const c0 = tm.cd0;
    dE = IF.dusun;
    const dThink = Math.max(pIn(t, c0 + 0.6, c0 + 3.8, 0.35), pIn(t, c0 + 6.4, c0 + 9.2, 0.35));
    dL = dThink > 0.4 ? [0.25, -0.25] : [-0.55, 0.45];
    if (dThink > 0.01) { const h = H.eklem('defne', dp, 'head'); dO.R = [[h[0] + 0.43 * dp.s, h[1] + 0.4 * dp.s], dThink, 'B']; if (dThink > 0.6) dParmak = 'yanak'; }
    if (ipucu) {
      dE = IF.sakin;
      const ag0 = [CUVAL.x - 6, SY - CUVAL.h - 4], avuc = [978, 1088];
      const wUz = W(t, tm.n1 - 0.32, 0.28);
      dSeker = W(t, tm.n1 + 0.05, 0.4, ease.enter);
      const bob = 9 * H.nabiz(t, tm.agirliktir, 0.3) + 9 * H.nabiz(t, tm.agirliktir + 0.34, 0.3);
      const el = kar(ag0, [avuc[0], avuc[1] + bob], ease.enter(seg(t, tm.n1 + 0.05, 0.4)));
      dO.R = [[el[0], el[1] + 10], wUz, 'A'];
      dL = t < tm.n1 + 0.3 ? [0.3, 0.55] : [0.25, 0.5];
      dAvuc = 0;
    }
  }
  if (B.sc.id === 'buldum') { dE = IF.gulus; dL = [0, -0.1]; }
  dp.expr = dE; dp.head.look = dL;
  dp.y -= H.buldumHop(t, tm.buldum, 50);
  if (B.sc.id === 'buldum') dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);

  // ——— Tezgâh, terazi, nesneler (karakterlerin önünde) ———
  tezgah(K);
  teraziGovde(K);
  kefe(K, gSol, ucSol(a), false); kefe(K, gSag, ucSag(a), false);
  teraziKol(K, a);
  if (ag.kefe === 'sol') agirlik(K, ag.p);
  kefe(K, gSol, null, true);
  if (ag.kefe === 'sag') agirlik(K, ag.p);
  kefe(K, gSag, null, true);
  cuval(K, [CUVAL.x, SY], t);
  if (!ag.kefe) agirlik(K, ag.p);
  void ibreUc;
  if (kagitVar) tarif(K, KC, KR);
  // tutan eller (nesnenin üstünde)
  if (kagitVar) hc.tut('R'); else if (wHik > 0.6) { if (t < tm.bas - 0.05) hc.isaret('R', uS0); else hc.tut('R'); }
  if (wDok > 0.6) hc.isaret('L', dokunNok);
  if (wSal > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25 * Math.sin(TAU * (t - tm.ne) / 0.5), boy: 1 });
  if (wUc > 0.6) nc.isaret('R', uG);
  if (wBas > 0.6) nc.tut('L');
  if (nTut) nc.tut('R');
  if ((nAvuc > 0.5 || (t >= tm.orta && t < tm.n0s + 0.3)) && nO.L) { nc.tut('L'); nc.tut('R'); }
  if (nCene > 0.6) nc.tut('L');
  if (dTut) dc.tut('L');
  if (dDok > 0.6) dc.tut('R');
  if (dAvuc > 0.6) dc.parmak('R', 4, { toplam: 4, yon: 0.1, ac: 0.32, boy: 0.8 });
  if (dIsaret > 0.6) dc.isaret('L', [TZ.PX, TZ.PY + 20]);
  if (dParmak === 'yanak') dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (dSeker > 0.01) {
    const h = dc.handR; dc.tut('R');
    K.ell(h[0], h[1] - 18, 40 * dSeker, 20 * dSeker, '#FBF8F0', LW * 0.6);
    for (let i = 0; i < 5; i++) K.circ(h[0] - 16 + i * 8, h[1] - 18 - (i % 2) * 6, 2, '#D8D2C4', 0);
  }
  if (B.sc.id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
