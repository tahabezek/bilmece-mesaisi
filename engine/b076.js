// Bölüm 76 · NECMİ'NİN TORUNLARI (v4 "hikâye" dili, cevapsız tasarım, kısa format; storyboard: hikayeler/bolum_076_v5.md).
// Mekanizma: yalnızca biri doğru olan üç cümle (en az on / torun sayısı ondan az / en az bir). On ve üstünde 1. ve 3., birle dokuz arasında
// 2. ve 3. cümle birlikte doğru olur; yalnız sıfırda tek cümle doğrudur (cevap kesilir, arşivde kalır).
// Logline: Çay molasında Defne, Necmi'ye torunlarına götürsün diye bir kutu bayram şekeri uzatır ve kaç torunu olduğunu
// sorar. Necmi oyunbaz: "Üç cümle söyleyeceğim. Yalnızca biri doğru." Üç cümleyi parmaklarıyla sayar; her cümle masaya
// aynı kartlardan biri olarak dizilir. Hikmet şaşkın: "Necmi'nin kaç torunu var şimdi?"
// Akılda kalacak tek şey: cümlelerin hepsi aynı sayıyı anlatır; o sayıyı bulmak için hiçbir sayıyı aklından atma.
// Sızıntı yasağı: torun fotoğrafı, çocuk çizimi, oyuncak, boş çerçeve yok. Necmi'nin yüzü oyunbazdır (hüzünlü, imalı değil).
// Şeker kutusu kimseye gitmez: Defne uzatır, Necmi almaz, Defne kutuyu kendi önünde tutmaya devam eder. Üç kart aynı renk,
// aynı boy, aynı ışıkta; hiçbiri öne çıkmaz (Defne'nin bakışı üç kartta eşit süre gezer; parmak ve kamera kart göstermez).
// Kartlar ekran uzayında, masanın üstüne oturan sabit yerlerde çizilir (okunurken kaymaz, ölçeklenmez); masa plânındaki
// kamera itmesi kartların merkezine kilitlidir, kartlar masanın aynı yerinde kalır.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const MUTFAK = 'b076_mutfak';
const ON = 0.85;                                  // masadakilerin ölçek çarpanı (derinlik)
const SH_Y = 1132;                                // oturanların omuz yüksekliği (başlar kartın ≥ 30 px altında kalsın)
const YB = 1172, YF = 1350, TX = [150, 1110];     // masa üstü: arka ve ön kenar; sol ve sağ kenar (sağ ucu Hikmet'in yanında)
const DUVAR_DIP = 1290;                           // duvarın zemine değdiği çizgi (arka)
const DEF_X = 330, NEC_X = 690, HIK_X = 1215, KER_X = 1438;
const CAY_N = [822, 1236];                        // Necmi'nin çay bardağı (tabak ortası)
const KUTU_UZAT = [470, 1172], KUTU_GOGUS = [418, 1172];   // şeker kutusu (taban ortası): Necmi'ye uzatılmış (sonuna dek orada) / kare 0
const KW = 150, KH = 62;                          // kutu: en, boy
// Masa kamerası: kartların merkezi ekranda sabit (A dünyada, KS ekranda)
const KART_Y = 1120, KART_H = 176;
let KART_X = [258, 520, 782];   // ekran: kartların orta çizgisi, boyu, üç kartın ortası
const A = [525, 1245];                            // kartların oturduğu dünya noktası
const masaKam = z => ({ zoom: z, cx: A[0] - (540 - 540) / z, cy: A[1] - (KART_Y - 960) / z });
// İfadeler (konuşmayanın ağzı kapalı; konuşurken talkAt ağzı açar)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.14, open: 0, w: 1 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.98, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
  oyun: { brow: 0.11, browTilt: -0.2, eye: 1.04, pupil: 1, curve: 0.58, open: 0, w: 1.08 },     // Necmi: oyunbaz (kaşlar kalkık, tebessüm)
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.15, pupil: 0.85, curve: 0.1, open: 0, w: 0.8 },
  saskin: { brow: 0.1, browTilt: -0.04, eye: 1.3, pupil: 0.7, curve: -0.04, open: 0, w: 0.62 },
  saskinK: { brow: 0.1, browTilt: -0.04, eye: 1.25, pupil: 0.75, curve: 0.02, open: 0, w: 0.9 },  // konuşurken şaşkın (ağız açılabilsin)
  dusun: { ...H.IFADE.dusun2, open: 0 },
  keyif: { brow: 0.12, browTilt: 0, eye: 1.08, pupil: 1, curve: 0.9, open: 0, w: 1.25 },   // Necmi: açık gözlü, belirgin tebessüm (ima yok)
  supheK: { brow: -0.01, browTilt: 0.26, eye: 0.82, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
};
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const ifKar = (a, b, u) => { if (u <= 0.001) return a; if (u >= 0.999) return b; const o = {}; for (const k of Object.keys(IF.notr)) o[k] = lerp(a[k] ?? 0, b[k] ?? 0, u); return o; };

// Oturan kişiyi omzu SH_Y'de olacak biçimde yerleştir (ayakta poz; bacaklar masanın arkasında kalır)
const sOf = key => H.BOY[key] * ON;
const omuzOf = {};
function oturan(key, x, o = {}) {
  if (omuzOf[key] === undefined) omuzOf[key] = H.shoulder(key, H.kisi(key, { x: 0, y: 0, s: sOf(key), ...POZ.dur }), 'R')[1];
  const dy = key === 'necmi' ? 10 : 0;                  // Necmi kısa: omzu biraz aşağıda
  return H.kisi(key, { x, y: SH_Y + dy - omuzOf[key], s: sOf(key), ...POZ.dur, ...o });
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Bayram şekeri kutusu (önden): (x, yb) tabanın ortası; kapak 0 kapalı → 1 açık (arkaya devrilmiş, iç yüzü görünür).
// Şekerler renkli ambalajlı (sabit liste); kutunun üstünde yazı yok.
const SEKER = [['#E26D5C', -54, 0], ['#E9C46A', -20, -4], ['#4E9A8F', 16, -1], ['#8FBF6A', 50, -3], ['#F3EEE4', -38, -16], ['#E26D5C', 0, -18], ['#E9C46A', 36, -15]];
function seker(K, x, y, renk) {
  K.poly([[x - 22, y - 9], [x - 13, y], [x - 22, y + 9]], renk, 3);
  K.poly([[x + 22, y - 9], [x + 13, y], [x + 22, y + 9]], renk, 3);
  K.ell(x, y, 15, 11, renk, 3.5);
  K.line(x - 6, y - 4, x + 2, y - 6, 3, 'rgba(255,255,255,0.75)');
}
// Kapağın görünen boyu: kalkar (58), sonra arkaya yatar (20); açık kapak Defne'nin yüzüne yükselmez
function kapakBoy(k) { const a = ease.state(k); return a < 0.6 ? 58 * a / 0.6 : lerp(58, 20, (a - 0.6) / 0.4); }
function kutu(K, [x, yb], kapak) {
  const { ctx } = K, w = KW, h = KH, d = 34;            // d: üst yüzün görünen derinliği
  const ust = yb - h;
  K.rect(x - w / 2 + 7, ust + 8, w, h, INK, 0, 8);     // gölge
  if (kapak > 0.02) {                                   // açık: kapak arkada dikilir (iç yüzü krem), iç kısım ve şekerler
    const lh = kapakBoy(kapak);
    K.rect(x - w / 2 - 2, ust - d - lh, w + 4, lh + 6, '#8E2620', LW * 0.7, 6);
    if (lh > 24) for (const dx of [-46, 0, 46]) K.circ(x + dx, ust - d - lh / 2, 7, PAL.mustard, 2.5);
    K.poly([[x - w / 2 + 6, ust - d], [x + w / 2 - 6, ust - d], [x + w / 2, ust], [x - w / 2, ust]], '#7A1F1B', LW * 0.7);
    ctx.save(); K.path([[x - w / 2 + 6, ust - d - 30], [x + w / 2 - 6, ust - d - 30], [x + w / 2, ust + 2], [x - w / 2, ust + 2]]); ctx.clip();
    for (const [c, dx, dy] of SEKER) seker(K, x + dx, ust - 12 + dy, c);
    ctx.restore();
  } else {                                              // kapalı: kapak üst yüzü örter
    K.poly([[x - w / 2 + 6, ust - d], [x + w / 2 - 6, ust - d], [x + w / 2, ust], [x - w / 2, ust]], '#C0392B', LW * 0.7);
    K.ell(x, ust - d / 2, 30, 9, PAL.mustard, 3);
  }
  K.rect(x - w / 2, ust, w, h, '#B8332A', LW * 0.8, 6);
  K.rect(x - w / 2 + 8, ust + 8, w - 16, h - 16, null, 3, 4);
  ctx.save(); ctx.strokeStyle = PAL.mustard; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 9, ust + 10); ctx.lineTo(x + w / 2 - 9, ust + 10); ctx.moveTo(x - w / 2 + 9, yb - 10); ctx.lineTo(x + w / 2 - 9, yb - 10); ctx.stroke(); ctx.restore();
  for (const dx of [-42, 0, 42]) { K.circ(x + dx, ust + h / 2, 11, PAL.mustard, 3); K.circ(x + dx, ust + h / 2, 4, '#B8332A', 0); }
}
// Kutunun tutuş noktaları: iki yan (orta yükseklik); sol elin kapak kenarı (kapak kalkarken)
const kutuYan = ([x, yb], m) => [x + m * (KW / 2 + 2), yb - KH * 0.55];
const kapakKenar = ([x, yb], a) => [x - KW / 2 + 22, yb - KH - 34 - kapakBoy(a) + 6];
// Çay bardağı ve tabağı (önden): (x, yb) tabağın ortası; kaşık bardağın içinde
function bardak(K, [x, yb], { kasik = [0, 0] } = {}) {
  const { ctx } = K, k = 1.15;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 0, 25, 6, PAL.cream, 2.5);
  const yol = [[-12, -42], [12, -42], [7, -23], [12, -8], [9, -2], [-9, -2], [-12, -8], [-7, -23]];
  K.poly(yol, '#F3EEE4', 2.5);
  ctx.save(); K.path([[-10.5, -35], [10.5, -35], [6.4, -23], [10.6, -8], [8, -3.5], [-8, -3.5], [-10.6, -8], [-6.4, -23]]); ctx.clip();
  ctx.fillStyle = '#A8401F'; ctx.fillRect(-14, -35, 28, 40); K.line(-12, -35, 12, -35, 2.5, '#C9603A'); ctx.restore();
  const [kx, ky] = kasik;                               // kaşık sapı (bardaktan dışarı, sağa yatık)
  K.line(2 + kx, -30 + ky, 20 + kx, -86 + ky, 6.5, INK); K.line(2 + kx, -30 + ky, 20 + kx, -86 + ky, 3, '#C9CED1');
  K.poly(yol, null, 2.5);
  ctx.restore();
}
const kasikUcu = ([x, yb], [kx, ky]) => [x + 1.15 * (20 + kx), yb + 1.15 * (-86 + ky)];   // el kaşığın sap ucunu tutar
// Şekerlik (masanın sağ ucunda, Necmi'nin ve Hikmet'in arasında): küp şekerli cam kâse
const SEKERLIK = [1010, 1236];
function sekerlik(K, [x, y]) {
  K.ell(x, y, 40, 8, '#C9CED1', 3);
  K.poly([[x - 36, y - 46], [x + 36, y - 46], [x + 28, y - 4], [x - 28, y - 4]], '#DCEBE6', 3.5);
  for (const [dx, dy] of [[-16, -54], [4, -58], [20, -52], [-4, -48]]) K.rect(x + dx - 9, y + dy - 9, 18, 18, PAL.paper, 2.5, 3);
  K.ell(x, y - 46, 36, 7, null, 3.5);
}
// Sandalye sırtı (önden): oturanın arkasında, omuzların iki yanından görünür
function sandalyeSirt(K, x) {
  K.rect(x - 98, SH_Y - 34, 22, YB - SH_Y + 40, PAL.woodDark, LW * 0.8, 6);
  K.rect(x + 76, SH_Y - 34, 22, YB - SH_Y + 40, PAL.woodDark, LW * 0.8, 6);
  K.rect(x - 104, SH_Y - 52, 208, 40, PAL.wood, LW * 0.8, 10);
}
// Masa (önden): derin üst yüz (YB..YF), önü örtülü (çizgili masa örtüsü saçağı); karakterlerden SONRA çizilir
function masa(K) {
  const [x0, x1] = TX;
  K.rect(x0 + 30, YF, 26, 1500 - YF, PAL.woodDark, LW, 4); K.rect(x1 - 56, YF, 26, 1500 - YF, PAL.woodDark, LW, 4);
  K.poly([[x0 + 16, YB], [x1 - 16, YB], [x1, YF], [x0, YF]], PAL.woodTop, LW);
  for (const [y, a, b] of [[YB + 30, 0.06, 0.2], [YB + 96, 0.82, 0.95], [YB + 150, 0.04, 0.12]]) K.line(lerp(x0, x1, a), y, lerp(x0, x1, b), y, 3, '#B07A44');
  K.rect(x0 - 6, YF - 2, x1 - x0 + 12, 22, PAL.wood, LW, 6);
  // önden sarkan örtü: krem, iki ince mercan şerit (yatay; ızgara değil)
  K.rect(x0 + 4, YF + 18, x1 - x0 - 8, 1488 - YF - 18, PAL.cream, LW * 0.8, 6);
  for (const y of [YF + 44, YF + 84, 1440]) K.line(x0 + 14, y, x1 - 14, y, 6, PAL.coral);
}
// Kart (ekran): kâğıt kart, üç satır; aynı renk, aynı boy. a: geliş anı (masaya konur: 22 px yukarıdan, ease.enter, sekme yok)
const KART = [['En az 10', 'torunum', 'var.'], ['Torun', 'sayım', "10'dan az."], ['En az 1', 'torunum', 'var.']];
const KART_ROT = [-1.6, 0.8, -0.9];
let KART_W = 0;
function kartGen(K) {
  if (KART_W) return KART_W;
  K.ctx.font = '800 44px Rubik';
  KART_W = Math.ceil(Math.max(...KART.flat().map(s => K.ctx.measureText(s).width)) + 30);
  KART_X = [512 - KART_W - 12, 512, 512 + KART_W + 12];   // aralarında 12 px; dış kenarlar güvenli alanda (x 90–920)
  return KART_W;
}
function kartCiz(K, t, i, a) {
  if (t < a - 0.001) return;
  const { ctx } = K, w = kartGen(K), h = KART_H, u = ease.enter(seg(t, a, 0.24));
  ctx.save(); ctx.translate(KART_X[i], KART_Y - 22 * (1 - u)); ctx.rotate(KART_ROT[i] * D2R); ctx.scale(1 + 0.1 * (1 - u), 1 + 0.1 * (1 - u));
  ctx.globalAlpha = clamp01(u * 2.2);
  K.rect(-w / 2 + 7, -h / 2 + 9, w, h, INK, 0, 14);
  K.rect(-w / 2, -h / 2, w, h, '#FBF6EC', LW * 0.8, 14);
  KART[i].forEach((s, j) => K.text(s, 0, -h / 2 + 58 + j * 51, 44, INK, 800));
  ctx.restore();
}
// Arka plân figürü Kerem'in tepsisi (iki çay)
function tepsi(K, [x, y], t) {
  K.ell(x, y, 66, 11, '#C9CED1', LW * 0.6);
  for (const [i, dx] of [[0, -26], [1, 26]]) {
    const yy = y - 4;
    K.poly([[dx + x - 9, yy - 30], [dx + x + 9, yy - 30], [dx + x + 6, yy - 16], [dx + x + 9, yy - 3], [dx + x - 9, yy - 3], [dx + x - 6, yy - 16]], '#C25A2E', 2.5);
    H.buhar(K, x + dx, yy - 38, t + i * 0.7, { k: 0.34, n: 2, ara: 9, boy: 44 });
  }
}
function caydanlik(K, x, y, t) {
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 66, 60, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  K.poly([[x - 52, y - 46], [x - 98, y - 76], [x - 106, y - 64], [x - 56, y - 24]], PAL.metal, LW);
  K.rect(x - 50, y - 72, 100, 72, PAL.metal, LW, 14);
  K.rect(x - 32, y - 122, 64, 54, '#B9C6BB', LW, 12); K.circ(x, y - 128, 9, '#3A3F3C', LW * 0.6);
  H.buhar(K, x - 108, y - 84, t, { k: 0.6, n: 2, ara: 16, boy: 90 });
}

// ═══════════════════════════ Mekân: ofisin mutfağı (çay molası) ═══════════════════════════
M.mekanEkle(MUTFAK, {
  gen: [-700, 2000], zemin: DUVAR_DIP, dongu: ['çay buharı', 'pencerede martı', 'duvar saati', 'çaydanlık buharı'],
  capa: { masa: A, kutu: KUTU_GOGUS }, kadraj: { masa: [1.4, A[0], A[1] - 160 / 1.4] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -800, x1: 2200, floorY: DUVAR_DIP, isik, duvar: 'duz', zemin: 'karo' });
    M.pencere(K, 452, 868, 146, 196, { isik, t: t + 3, kayit: false });
    M.duvarSaati(K, 990, 900, 46, 10.6 + t / 3600, t);
    // sağda tezgâh ve çaydanlık (Hikmet'in arkasında)
    K.rect(1300, 1080, 520, DUVAR_DIP + 6 - 1080, PAL.wood, LW, 6); K.rect(1288, 1062, 544, 26, PAL.woodTop, LW, 6);
    K.rect(1316, 1110, 150, 160, PAL.woodTop, LW * 0.6, 6); K.rect(1480, 1110, 150, 160, PAL.woodTop, LW * 0.6, 6);
    caydanlik(K, 1700, 1062, t);
    K.rect(-800, 1506, 2900, 700, '#7F3B33', 0); K.line(-800, 1506, 2100, 1506, LW, INK); K.rect(-800, 1524, 2900, 12, PAL.mustard, 0);
    for (let x = -760; x < 2100; x += 150) K.poly([[x, 1640], [x + 36, 1600], [x + 72, 1640], [x + 36, 1680]], '#A3524A', 3);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
    uzat: 0.3, sek: T('d1:3'), kac: T('d1:6'), d1s: T('d1>'),
    n0: T('n0'), yal: T('n0:3'), biri: T('n0:4'), n0s: T('n0>'),
    n0b: T('n0b'), c1: T('n0b'), c2: T('n0b:5'), c3: T('n0b:9'), n0bs: T('n0b>'),
    h1: T('h1'), bicim: T('h1:2'), cevapK: T('h1:3'), necmiK: T('h1:4'), simdi: T('h1:8'), h1s: T('h1>'),
    n1: T('n1'), akl: T('n1:2'), atma: T('n1:3'), n1s: T('n1>'),
  };
  tm.kutuKes = tm.sek - 0.08; tm.necKes = tm.n0 - 0.1; tm.masaKes = tm.n0b - 0.1; tm.hikKes = tm.h1 - 0.1; tm.sayac = cd0 - 0.05;
  tm.kapak = tm.sek + 0.12;                                   // kapak kalkar ("şekerleri")
  tm.geri = tm.necKes - 0.5;                                  // Defne kutuyu kendi önüne çeker (Necmi konuşmaya başlarken)
  const film = H.sahneler([
    { id: 'kanca', plan: 'masa', t0: 0, cam: [[0, 1.4, ...[masaKam(1.4).cx, masaKam(1.4).cy]]] },
    { id: 'kutu', plan: 'masa', t0: tm.kutuKes, cam: [[0, 1.68, 508, 1100], [tm.necKes - 0.1, 1.68, 508, 1101]] },
    { id: 'necmi', plan: 'masa', t0: tm.necKes, cam: [[0, 1.62, 760, 1110], [tm.masaKes - 0.1, 1.64, 760, 1108]] },
    { id: 'masa', plan: 'masa', t0: tm.masaKes, cam: [[0, 1.4, masaKam(1.4).cx, masaKam(1.4).cy]] },
    { id: 'hikmet', plan: 'hikmet', t0: tm.hikKes, cam: [[0, 1.95, HIK_X + 42, 1062], [tm.sayac - 0.1, 1.98, HIK_X + 42, 1060]] },
    { id: 'sayac', plan: 'masa', t0: tm.sayac, cam: [[0, 1.4, masaKam(1.4).cx, masaKam(1.4).cy]] },     // doğrusal itme kamera() ile
    { id: 'buldum', plan: 'masa', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.62, DEF_X + 60, 1070]] },
    { id: 'cevap', plan: 'masa', t0: tm.cevap, cam: [[0, 1.4, masaKam(1.4).cx, masaKam(1.4).cy]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // Altyazı çizelgesi: n0b'nin balonu yok (üç kart, cümle söylendiği anda masaya gelir: kartlar onun altyazısıdır);
  // n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar kalır; balon kesme karesinde sönmüş olur.
  const kes = { n0: tm.masaKes, h1: tm.sayac };
  const tlA = { ...tl, lines: tl.lines.filter(l => l.id !== 'n0b').map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.05 } : kes[l.id] ? { ...l, t1: Math.min(l.t1, kes[l.id] - 0.31) } : l) };
  return { tm, film, tlA };
}

// ═══════════════════════════ draw ═══════════════════════════
const masaPlani = id => ['kanca', 'masa', 'sayac', 'cevap'].includes(id);
const zoomAt = (tm, t) => {                     // masa plânı: kartların merkezine kilitli itme
  if (t >= tm.cevap) return lerp(1.36, 1.53, clamp01((t - tm.cevap) / 9.4));
  if (t < tm.sayac) return lerp(1.38, 1.44, clamp01((t - tm.masaKes) / 4.9));
  if (t < tm.cd) return Math.exp(lerp(Math.log(1.44), Math.log(1.50), clamp01((t - tm.sayac) / (tm.cd - tm.sayac))));
  return lerp(1.50, 1.51, clamp01((t - tm.cd) / (tm.buldum - tm.cd)));
};
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında
  drift: 0.008,
  kamera(cam, t, B) {
    const id = B.sc.id;
    if (id === 'masa' || id === 'sayac' || id === 'cevap') Object.assign(cam, masaKam(zoomAt(S.tm, t)));
    if (id === 'kanca') Object.assign(cam, masaKam(lerp(1.4, 1.41, clamp01(t / 1.2))));
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (masaPlani(id) && id !== 'cevap') { kartCiz(K, t, 0, tm.c1 - 0.04); kartCiz(K, t, 1, tm.c2 - 0.04); kartCiz(K, t, 2, tm.c3 - 0.04); }
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (070'teki düzen): perde yok; daire solda, başlık ve paylaşım hapı sağında, alt bantta.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1330, r = 78;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 25, 70, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(596, 1284); ctx.scale(inU * out, inU * out);
  ctx.font = '900 52px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 64;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 19, 52, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(596, 1376); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56;
    K.rect(-sw / 2 + 8, -40 + 10, sw, 80, INK, 0, 40); K.rect(-sw / 2, -40, sw, 80, PAL.coral, LW, 40); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// ——— Dünya ———
function sahne(K, t, tl, S, B) {
  M.mekanCiz(K, MUTFAK, 'arka', t);
  if (B.sc.plan === 'hikmet') { masa(K); sekerlik(K, SEKERLIK); hikmetPlani(K, t, tl, S, B); return; }
  masaSahnesi(K, t, tl, S, B);
}

// Şeker kutusunun yeri ve kapağı
function kutuAt(tm, t) {
  let p = KUTU_GOGUS;
  p = kar(p, KUTU_UZAT, W(t, tm.uzat, 0.5));                                 // uzatır (kanca)
  return { p, kapak: W(t, tm.kapak, 0.4) };
}

// Masa: Defne (solda) ve Necmi (sağda) oturur, önden. Kutu, çay, kartlar (ekranda).
function masaSahnesi(K, t, tl, S, B) {
  const { tm } = S, { heads, cam } = B, id = B.sc.id;
  const kt = kutuAt(tm, t);
  // ——— Defne ———
  let dE = IF.gulus, dL = [0.6, 0.15], dT = 3;
  if (t >= tm.kac - 0.1) { dE = IF.merak; dL = [0.65, 0.05]; }
  if (t >= tm.n0) { dE = IF.merak; dL = [0.62, 0.1]; }
  if (t >= tm.n0b) { dE = IF.merak; dL = [0.62, 0.08]; }
  // kartlar gelirken Defne her birine bakar
  const KB = [[0.02, 0.62], [0.42, 0.55], [0.72, 0.5]];
  if (t >= tm.c1 && t < tm.n0bs + 0.3) { const i = t < tm.c2 ? 0 : t < tm.c3 ? 1 : 2; dL = KB[i]; dE = IF.merak; }
  if (t >= tm.n0bs + 0.3 && t < tm.sayac) { dL = [0.6, 0.08]; dE = IF.saskin; }
  if (t >= tm.sayac) {
    // sayaç: bakış üç kartta eşit süre gezer (1 → 2 → 3, iki tur), arada Necmi'ye şüpheyle bakar
    const ts = t - tm.cd0, dur = 1.3, sira = [0, 1, 2, -1, 0, 1, 2];
    const k = Math.floor(clamp01(ts / (dur * sira.length)) * sira.length - 1e-9), i = sira[Math.max(0, Math.min(sira.length - 1, k))];
    dL = i < 0 ? [0.6, 0.05] : KB[i]; dE = i < 0 ? IF.supheK : IF.dusun;
    if (ts > dur * sira.length) { dL = [0.4, 0.5]; dE = IF.dusun; }
    if (t >= tm.n1 - 0.15) { dL = [0.62, 0.06]; dE = IF.merak; }
    if (t >= tm.n1s + 0.15) { dL = [0.3, 0.55]; dE = IF.dusun; }
  }
  if (id === 'buldum') { dE = IF.gulus; dL = [0.2, -0.1]; }
  dT = dL[0] > 0.3 ? 3 : 0;
  const dp = oturan('defne', DEF_X, { expr: dE, head: { tilt: dT, look: dL } });
  if (t >= tm.sayac && t < tm.n1) dp.head.tilt += 4 * Math.sin(TAU * (t - tm.cd0) / 7.8);   // düşünürken başı ağır ağır yana
  dp.y -= H.buldumHop(t, tm.buldum, 50);
  const dO = { heads, L: [kutuYan(kt.p, -1), 1, 'A'], R: [kutuYan(kt.p, 1), 1, 'A'] };
  const wK = pIn(t, tm.kapak - 0.22, tm.kapak + 0.5, 0.22);                  // sol el kapağı kaldırır
  if (wK > 0.01) dO.L = [kar(kutuYan(kt.p, -1), kapakKenar(kt.p, kt.kapak), wK), 1, 'A'];
  if (id === 'buldum') dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];
  // ——— Necmi ———
  let nE = IF.oyun, nL = [-0.6, 0.2], nT = -3;
  if (t < 1.0) { nE = IF.merak; nL = [-0.4, 0.45]; }                         // kutuya bakar
  if (t >= tm.kac - 0.2) { nE = IF.oyun; nL = [-0.62, 0.05]; }
  if (t >= tm.n0) { nE = IF.oyun; nL = [-0.15, 0]; }                         // n0: izleyiciye (kameraya yakın)
  if (t >= tm.n0b) { nE = IF.oyun; nL = [-0.55, 0.05]; }
  if (t >= tm.n0bs) { nE = IF.gulus; nL = [-0.6, 0.05]; }
  if (t >= tm.sayac) { nE = IF.keyif; nL = [0.2, 0.3]; }                     // çayını karıştırır, keyifle gülümser
  if (t >= tm.n1 - 0.3) { nE = IF.keyif; nL = [-0.32, 0.04]; }              // ipucu: Defne'ye ve izleyiciye dönük, iki kaş birden kalkık
  nT = nL[0] < -0.3 ? -3 : 0;
  const np = oturan('necmi', NEC_X, { expr: nE, head: { tilt: nT, look: nL } });
  H.onayla(np, t, tm.n0bs + 0.1, 1, 0.4);
  for (const c of [tm.c1, tm.c2, tm.c3]) H.onayla(np, t, c + 0.5, 1, 0.42);   // her cümleden sonra küçük baş sallama
  H.onayla(np, t, tm.atma - 0.05, 1, 0.38);
  const egil = pIn(t, tm.n1 - 0.2, tm.buldum + 0.6, 0.45); np.lean = -5 * egil;   // ipucunda Defne'ye doğru eğilir
  const nO = { heads };
  let nPar = null, nTut = false, kas = [0, 0];
  // n0 "Yalnızca biri": işaret parmağı başının yanında (bir). n0b: üç cümle, üç parmak (sağ el başının yanında)
  const wP = pIn(t, tm.c1 - 0.32, tm.n0bs + 0.35, 0.3);   // (n0'daki tek parmak kaldırıldı: yakın plânda yanlış okunabiliyordu)
  if (wP > 0.01) {
    nO.R = [H.elYeri('necmi', np, 'R', 'yukari'), wP, 'B'];
    if (wP > 0.6) {
      const n = t < tm.n0b ? clamp01((t - tm.biri + 0.15) / 0.22) : 1 + clamp01((t - tm.c2 + 0.1) / 0.22) + clamp01((t - tm.c3 + 0.1) / 0.22);
      nPar = ['R', Math.max(0.01, t < tm.n0b ? n : n), { toplam: t < tm.n0b ? 1 : 3, ac: 0.42, boy: 1.3 }];
    }
  }
  // sayaç: çayını karıştırır (kaşık bardakta daire çizer); ipucundan önce bırakır
  const wC = pIn(t, tm.sayac - 0.6, tm.n1 - 0.35, 0.3);
  const karis = (a, b) => pIn(t, a, b, 0.2);
  const dongu = Math.max(karis(tm.cd0 + 0.4, tm.cd0 + 3.6), karis(tm.cd0 + 5.4, tm.cd0 + 8.9));
  if (wC > 0.01) {
    const ph = TAU * (t - tm.cd0) / 0.62;
    kas = [5 * Math.cos(ph) * dongu, 2.2 * Math.sin(ph) * dongu];
    nO.R = [kar(H.elYeri('necmi', np, 'R', 'asagi'), kasikUcu(CAY_N, kas), wC), 1, 'A']; nTut = wC > 0.6;
  }
  // ——— çizim: sandalye sırtları → kişiler → masa → çay → kutu → tutan eller ———
  if (id !== 'necmi') sandalyeSirt(K, DEF_X); sandalyeSirt(K, NEC_X);
  const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 10000, 5000 + YB + 30); ctx.clip();
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  const defVar = id !== 'necmi';   // Necmi'nin yakın plânında Defne ve kutu kadraj dışında (kenarda kırpık el kalmasın)
  const dc = defVar ? oyna(K, t, tl, 'defne', dp, dO) : null;
  ctx.restore();
  masa(K);
  H.buhar(K, CAY_N[0], CAY_N[1] - 58, t, { k: 0.42, n: 2, ara: 13, boy: 70 });
  bardak(K, CAY_N, { kasik: kas });
  sekerlik(K, SEKERLIK);
  if (defVar) kutu(K, kt.p, kt.kapak);
  if (defVar && id !== 'buldum') { dc.tut('L'); dc.tut('R'); }
  if (nPar) nc.parmak(...nPar); else if (nTut) nc.tut('R');
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
  // altyazı kuyruğu kısa (masa plânında kartların üstünden geçmesin): baş noktası balonun hemen üstüne indirilir
  if (masaPlani(id)) for (const k of Object.keys(heads)) heads[k] = [heads[k][0], cam.cy + (1228 - 960) / cam.zoom];
}

// Hikmet'in plânı: tezgâhın önünde ayakta, elinde çay bardağı; arkada Kerem tepsiyle.
function hikmetPlani(K, t, tl, S, B) {
  const { tm } = S, { heads } = B;
  // Kerem (derinlikte, küçük): tepsiyi tutar, Hikmet'e bakar; konuşmaz
  const ks = H.BOY.genc * 0.56, kp = H.kisi(H.KEREM, { x: KER_X, y: DUVAR_DIP + 10, s: ks, expr: IF.notr, ...POZ.dur, head: { tilt: -3, look: [-0.55, 0.1] } });
  H.onayla(kp, t, tm.simdi - 0.1, 1, 0.4);
  const tp = [KER_X, DUVAR_DIP + 10 - 1.62 * ks];
  oyna(K, t, null, H.KEREM, kp, { L: [[tp[0] - 58, tp[1] + 6], 1, 'A'], R: [[tp[0] + 58, tp[1] + 6], 1, 'A'] });
  tepsi(K, tp, t);
  // Hikmet: "Bu ne biçim cevap?" şaşkın; "Necmi'nin kaç torunu var şimdi?" sol avucunu açar (omuz silker)
  let hE = IF.saskinK, hL = [-0.55, 0.05];
  if (t >= tm.necmiK - 0.1) hL = [-0.2, 0];
  const hp = H.kisi('hikmet', { x: HIK_X, s: sOf('hikmet'), expr: hE, ...POZ.dur, head: { tilt: -3, look: hL } });
  H.omuzSilk(hp, t, tm.simdi - 0.35, 0.45);
  const bar = [HIK_X + 64, 1214 + 10 * W(t, tm.bicim - 0.2, 0.3)];   // bardak göğüs altında (yüze değmez); "biçim"de biraz iner
  const hc = oyna(K, t, tl, 'hikmet', hp, { heads, R: [[bar[0] - 4, bar[1] - 20], 1, 'A'] });   // sağ el bardakta kalır; omuz silkmede yalnız sol avuç açılır
  bardak(K, [hc.handR[0] + 4, hc.handR[1] - 16]); hc.tut('R');   // tabağı alttan tutar (bardak elin üstünde görünür)
}
