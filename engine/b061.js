// Bölüm 61 · RENK KÖRÜ (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_061_v5.md). Mekanizma: sıfır bilgili kanıt.
// Logline: Defne raporu kırmızı ve yeşil kalemle düzeltiyor. Renk körü Necmi "Bu iki kalem aynı" diyor. Defne iki kalemle
// rapora birer çizgi çeker; Necmi'nin gözünde (gri tonlu bakış açısı) iki çizgi de aynı gri. Hikmet "soldaki kırmızı" der;
// Necmi kimseye güvenmez. Defne kalemleri yan yana koyup Necmi'nin önüne iter. Soru: farklı olduklarını nasıl kanıtlar?
// Akılda kalacak tek şey: hangisinin hangisi olduğunu söylemeden de "farklı" olduğunu kanıtlayabilirsin.
// Sızıntı yasağı: kalemler hiçbir an arkaya saklanmaz; Necmi'nin elleri kalemlere uzanmaz, kalemleri karıştırmaz.
// Gri bakış: dünyanın üstüne 'saturation' karışımıyla gri boya (parlaklık korunur). Kırmızı ve yeşil aynı parlaklıkta
// seçildi (W3C lum: 0,3R + 0,59G + 0,11B ≈ 108): gri bakışta iki kalem ve iki çizgi gerçekten aynı gri çıkar.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE, EXPR } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const OFIS = 'b061_ofis', TZ = 1268, TOP1 = TZ + 540;   // masanın arka kenarı · üst yüzün ön kenarı (derin masa: alt kadraj masa üstüdür)
const DEF_X = 290, HIK_X = 545, NEC_X = 800;
const KIR = '#D9402F', YES = '#378F43';                 // eşit parlaklık (≈108): gri bakışta aynı gri
const RENK = [KIR, YES];
const KL = 250, KL_YAT = 140, KW = 40;                  // kalem boyu (elde) · masada yatarken (kısalmış) · eni
const KAGIT = [355, TZ + 8], CIZ_Y = TZ + 44;           // raporun üst kenar ortası · çizgilerin yüksekliği
const CIZ = [[262, 338], [372, 448]];                   // kırmızı çizgi (sol), yeşil çizgi (sağ): x0 → x1
const TUT = [[195, 1085, -0.16], [425, 1085, 0.16]];   // başın iki yanında: duvarın önünde (kırmızı kalem kırmızı kola karışmasın)    // elde tutuş: tutuş noktası ve açı (0 = uç yukarı)
const YAT0 = [[325, 1338], [445, 1338]], YAT1 = [[595, 1338], [715, 1338]], R_YAT = 0.9;   // masaya bırakış · itildikten sonra
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const yon = r => [Math.sin(r), -Math.cos(r)];           // kalemin uca doğru birim yönü

// ═══════════════════════════ Nesneler ═══════════════════════════
// Keçeli kalem: c merkez, r açı (0 = uç yukarı), L boy. Gövde renkli, ortada beyaz etiket bandı, uç koyu renkli.
function kalem(K, c, r, renk, L = KL) {
  const { ctx } = K, h = L / 2, w = KW / 2;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(r);
  K.rect(-w + 5, -h + 6, KW, L, INK, 0, 9);                                 // gölge
  K.poly([[-w * 0.55, -h + 30], [w * 0.55, -h + 30], [w * 0.22, -h + 2], [-w * 0.22, -h + 2]], H.mixHex(renk, '#1E2422', 0.35), LW * 0.6);   // uç
  K.rect(-w, -h + 28, KW, 18, '#F3EEE4', LW * 0.7, 4);                      // yaka
  K.rect(-w, -h + 44, KW, L - 44, renk, LW * 0.8, 8);                       // gövde
  K.rect(-w + 3, -h + 44 + (L - 44) * 0.38, KW - 6, (L - 44) * 0.22, '#F3EEE4', 0, 3);   // etiket bandı
  K.line(-w + 9, -h + 54, -w + 9, h - 14, 3.5, H.mixHex(renk, '#FFFFFF', 0.35));          // parlak kenar (düz çizgi)
  K.rect(-w - 2, h - 18, KW + 4, 18, H.mixHex(renk, '#1E2422', 0.3), LW * 0.7, 5);        // arka kapak
  ctx.restore();
}
// Rapor kâğıdı (masada yatar; hafif perspektifli dörtgen) ve üstündeki yazı satırları, eski işaretler
function rapor(K, S, t) {
  const [x, y] = KAGIT, { ctx } = K;
  K.poly([[x - 118 + 6, y + 6], [x + 118 + 6, y + 6], [x + 128 + 6, y + 92], [x - 128 + 6, y + 92]], INK, 0);
  K.poly([[x - 118, y], [x + 118, y], [x + 128, y + 86], [x - 128, y + 86]], '#FFFFFF', LW * 0.7);
  for (const [yy, a, b] of [[y + 16, -100, 84], [y + 64, -110, 40], [y + 76, -112, 96]]) K.line(x + a, yy, x + b, yy, 5, '#C9CFC9');
  // eski düzeltmeler: kırmızı çarpı, yeşil tik (rapor gerçekten iki renkle işaretleniyor)
  ctx.save(); ctx.lineCap = 'round';
  K.line(x + 58, y + 58, x + 72, y + 70, 4.5, KIR); K.line(x + 72, y + 58, x + 58, y + 70, 4.5, KIR);
  K.line(x + 104, y + 66, x + 110, y + 72, 4.5, YES); K.line(x + 110, y + 72, x + 122, y + 56, 4.5, YES);
  // Defne'nin çektiği iki çizgi (uç kaleminin ucunu izler)
  for (let i = 0; i < 2; i++) { const u = cizgiU(S, i, t); if (u > 0) K.line(CIZ[i][0], CIZ_Y, lerp(CIZ[i][0], CIZ[i][1], u), CIZ_Y, 7, RENK[i]); }
  ctx.restore();
}
// Çay bardağı (döngü: buhar), kalemlik, zımba
const BARDAK = [[-17, -38], [17, -38], [10, -22], [15, -6], [12, 0], [-12, 0], [-15, -6], [-10, -22]];
const BARDAK_IC = [[-15, -31], [15, -31], [8.6, -22], [13.2, -6], [10.4, -2], [-10.4, -2], [-13.2, -6], [-8.6, -22]];
function cay(K, x, yb, t, k = 1.2) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 1, 26, 6, PAL.cream, 2.5);
  K.poly(BARDAK, '#F3EEE4', 0); K.poly(BARDAK_IC, '#A8401F', 0); K.poly(BARDAK, null, 2.6);
  K.line(-9, -33, -6, -26, 2.4, '#FFFFFF');
  ctx.restore();
  H.buhar(K, x, yb - 46 * k, t, { k: 0.4 * k, n: 2, ara: 10, boy: 60 });
}
function masa(K, S, t) {
  const { ctx } = K, x0 = -300, x1 = 1400;
  K.poly([[x0, TZ - 20], [x1, TZ - 20], [x1 + 160, TOP1], [x0 - 160, TOP1]], PAL.woodTop, LW);   // derin üst yüz
  K.line(x0, TZ + 2, x1, TZ + 2, 2.5, H.mixHex(PAL.woodTop, INK, 0.12));
  for (const y of [TZ + 150, TZ + 330]) K.line(x0 - 60, y, x1 + 60, y, 2.5, H.mixHex(PAL.woodTop, INK, 0.08));   // ahşap damarı
  K.rect(x0 - 160, TOP1, x1 - x0 + 320, 600, PAL.wood, LW, 0);
  // arka sıra: kalemlik (boş: kalemler Defne'de), rapor, çay (döngü: buhar), zımba
  K.rect(110, TZ + 10, 64, 76, '#5C8C84', LW * 0.8, 8); K.rect(110, TZ + 10, 64, 14, '#4A7770', LW * 0.6, 6);
  rapor(K, S, t);
  cay(K, 880, TZ + 84, t);
  K.rect(940, TZ + 44, 110, 36, '#3B3F45', 3, 8); K.rect(946, TZ + 32, 98, 18, '#8B969C', 3, 6);
  // ön sıra (Instagram arayüzünün altında kalan bölge; masa dolu görünsün): klavye, kupa, telefon, saksı, dosya yığını
  K.rect(406, TZ + 176, 330, 92, '#E9E4DA', LW * 0.8, 12);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) K.rect(420 + c * 31, TZ + 188 + r * 25, 24, 18, '#FFFFFF', 2, 4);
  K.rect(140, TZ + 214, 92, 104, PAL.teal, LW * 0.8, 12); K.ell(186, TZ + 214, 46, 12, '#1E2422', LW * 0.6);
  K.circ(240, TZ + 262, 24, null, LW * 0.8);
  H.buhar(K, 186, TZ + 196, t, { k: 0.5, n: 2, ara: 12, boy: 70 });
  K.rect(780, TZ + 240, 96, 150, '#3B3F45', LW * 0.8, 14); K.rect(790, TZ + 254, 76, 116, '#7FB3AA', 0, 6);
  K.poly([[930, TZ + 420], [1070, TZ + 420], [1086, TZ + 300], [914, TZ + 300]], '#C4693F', LW);
  for (let i = 0; i < 6; i++) H.yaprak(K, 1000 + (i - 2.5) * 16, TZ + 300, 150, -90 + (i - 2.5) * 20, PAL.green, 1);
  for (let i = 0; i < 4; i++) K.rect(-40 + i * 6, TZ + 300 - i * 34, 300, 34, [PAL.mustard, PAL.coral, PAL.cream, PAL.teal][i], LW * 0.7, 6);
  K.rect(470, TZ + 330, 180, 130, PAL.mustard, 3, 4); K.line(492, TZ + 370, 620, TZ + 370, 5, '#B98A2C'); K.line(492, TZ + 400, 600, TZ + 400, 5, '#B98A2C');
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(OFIS, {
  gen: [-300, 1400], dongu: ['duvar saatinin saniye ibresi', 'pencerede bulut ve martı', 'çayın buharı'],
  capa: { masa: [540, TZ] }, kadraj: { grup: [1.5, 545, 1083] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 1500, isik, duvar: 'duz', zemin: 'ahsap' });
    M.pencere(K, -40, 520, 400, 470, { isik, t, manzara: 'istanbul', marti: true });
    // pano: sarı notlar, takvim
    K.rect(1010, 560, 300, 260, '#C79A63', LW, 10);
    for (const [x, y, c] of [[1040, 590, PAL.mustard], [1120, 600, PAL.paper], [1200, 586, PAL.mustard], [1060, 690, PAL.paper], [1160, 700, PAL.mustard]]) K.rect(x, y, 70, 70, c, 3, 4);
    // raf ve klasörler (sağda)
    K.rect(880, 980, 460, 18, PAL.woodTop, LW * 0.8, 4);
    for (let i = 0; i < 6; i++) K.rect(905 + i * 46, 870, 40, 110, [PAL.teal, PAL.coral, PAL.mustard, '#5C8C84', PAL.teal, PAL.cream][i], 3, 5);
    M.duvarSaati(K, 790, 770, 54, 10.25 + t / 3600, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    n0: T('n0'), kalem: T('n0:2'), neden: T('n0:4'), birden: T('n0:6'), n0s: T('n0>'),
    d1: T('d1'), biri1: T('d1:0'), biri2: T('d1:2'), d1s: T('d1>'),
    n2: T('n2'), bende: T('n2:0'), bana: T('n2:4'), tipatip: T('n2:8'), n2s: T('n2>'),
    d1b: T('d1b'), bakin: T('d1b:0'), rapora: T('d1b:4'), birer: T('d1b:5'), cizgi: T('d1b:6'), cekeyim: T('d1b:7'), d1bs: T('d1b>'),
    n3: T('n3'), gri: T('n3:5'), gorunuyor: T('n3:6'), n3s: T('n3>'),
    d2: T('d2'), soylesem: T('d2:3'), inanmaz: T('d2:4'), d2s: T('d2>'),
    hd: T('hd'), soldaki: T('hd:2'), hds: T('hd>'),
    n4: T('n4'), size: T('n4:2'), makine: T('n4:4'), guvenmem: T('n4:6'), n4s: T('n4>'),
    h1: T('h1'), gozu: T('h1:0'), kimseye: T('h1:3'), h1s: T('h1>'),
    h2: T('h2'), defne: T('h2:0'), kalemler: T('h2:1'), nasil: T('h2:5'), h2s: T('h2>'),
    n1: T('n1'), sefer: T('n1:1'), oyunu: T('n1:2'), kuracak: T('n1:4'), n1s: T('n1>'),
    cevap: Math.max(T('d3:1') - 0.1, T('d3') + 0.82), cta: T('d6') - 0.15,
  };
  // kalem yolu: d1b'de iki çizgi (kırmızı "birer"de, yeşil "çekeyim"de), d2'de masaya bırakılır ve Necmi'ye doğru itilir
  tm.ciz = [[tm.birer - 0.02, 0.42], [tm.cekeyim - 0.02, 0.42]];      // [çizgi başı, süre]
  tm.ins = tm.d2 + 1.22;                                                // masaya araya kesme (Defne'nin yakın planından sonra)
  tm.bir = Math.max(tm.soylesem + 0.05, tm.ins + 0.12);                                           // iki kalem masaya iner (0,45 sn)
  tm.it = tm.inanmaz - 0.05;                                            // sağ el ikisini iter (0,36 sn), kalemler kayar (0,6 sn)
  // sayaç: her 2–3 sn'de yeni bir şey (kimse kalemlere dokunmaz)
  tm.s = { dBak: cd0 + 0.5, dDusun: cd0 + 2.4, nEgil: cd0 + 3.6, hBak: cd0 + 5.2, dKalk: cd0 + 6.6, nOvus: cd0 + 7.6, dNec: cd - 1.2 };

  // Kadraj (22 Kas set dersi): karakterler kadrajın ≥ %80'i; kamera 1,35x ve aşağıda; her konuşmacıya yakın plan.
  // Yakın planlar ve araya kesmeler rehberin 0,94–1,46 aralığını aşar (1,5–2,4x); kontrol() uyarısı bilinçlidir.
  const G = [1.5, 545, 1083], NY = [1.85, 780, 1110];
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.42, 515, 1095], [tm.neden - 0.1, 1.46, 512, 1095]] },
    { id: 'necmi1', t0: tm.neden - 0.1, cam: [[0, ...NY], [tm.d1 - 0.15, 1.89, 782, 1110]] },
    { id: 'defne1', t0: tm.d1 - 0.1, cam: [[0, 1.8, 310, 1095], [tm.n2 - 0.15, 1.84, 308, 1095]] },
    { id: 'necmi2', t0: tm.n2 - 0.1, cam: [[0, ...NY], [tm.bana - 0.2, 1.89, 784, 1110]] },
    { id: 'pov1', t0: tm.bana - 0.06, pov: true, cam: [[0, 2.0, 290, 1105], [tm.d1b - 0.15, 2.12, 290, 1105]] },        // Necmi'nin gözü: renk söner
    { id: 'defne2', t0: tm.d1b - 0.1, cam: [[0, 1.75, 350, 1110], [tm.rapora - 0.2, 1.78, 352, 1112]] },
    { id: 'kagit', t0: tm.rapora - 0.1, cam: [[0, 2.4, 355, 1340], [tm.n3 - 0.05, 2.44, 355, 1341]] },               // insert: çizgiler
    { id: 'pov2', t0: tm.n3 - 0.02, pov: true, kesme: false, cam: [[0, 2.44, 355, 1341], [tm.gorunuyor - 0.15, 2.5, 355, 1342]] },   // aynı kadraj, renk söner
    { id: 'necmi3', t0: tm.gorunuyor - 0.1, cam: [[0, ...NY], [tm.d2 - 0.15, 1.88, 782, 1110]] },
    { id: 'defne3', t0: tm.d2 - 0.1, cam: [[0, 1.75, 330, 1095], [tm.ins - 0.05, 1.78, 332, 1095]] },
    { id: 'it', t0: tm.ins, cam: [[0, 2.0, 420, 1390], [tm.it, 2.0, 430, 1390], [tm.hd - 0.15, 2.0, 560, 1390]] },          // insert: kalemler masaya, Necmi'ye doğru itilir
    { id: 'hikmet1', t0: tm.hd - 0.1, cam: [[0, 1.75, 590, 1045], [tm.n4 - 0.15, 1.78, 590, 1046]] },
    { id: 'necmi4', t0: tm.n4 - 0.1, cam: [[0, ...NY], [tm.h1 - 0.15, 1.89, 784, 1110]] },
    { id: 'hikmet2', t0: tm.h1 - 0.1, cam: [[0, 1.65, 650, 1055], [tm.h2 - 0.15, 1.68, 645, 1055]] },
    { id: 'grup', t0: tm.h2 - 0.1, cam: [[0, ...G], [cd0 - 0.1, 1.53, 545, 1083]] },
    { id: 'sayac', t0: cd0 - 0.05, dogrusal: [1.36, 1.42], cam: [[0, 1.36, 545, 1100], [cd0 + 5, 1.39, 545, 1105]] },   // doğrusal itme: h.kamera
    { id: 'ipucu', t0: tm.n1 - 0.25, cam: [[0, 1.45, 800, 1190], [tm.n1s, 1.47, 801, 1190], [tm.buldum - 0.1, 1.48, 802, 1190]] },   // iki kalem de balonun üstünde görünür; Defne kadraj dışında (kenarda yarım yüz yok), Hikmet'in gözleri kartın altında
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.8, 310, 1080]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...G], [tm.cta, 1.6, 380, 1083]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'mutlu', head: { tilt: 4, look: [0.75, 0.15] }, ...POZ.dur });
  const def = [
    [tm.neden, { expr: 'notr', head: { tilt: 3, look: [0.85, 0.1] } }, 0.3],
    [tm.d1 - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.05] } }, 0.25],
    [tm.biri1, { head: { tilt: -6, look: [-0.4, -0.2] } }, 0.25],
    [tm.biri2, { head: { tilt: 6, look: [0.45, -0.2] } }, 0.25],
    [tm.n2 - 0.1, { expr: 'saskin', head: { tilt: 3, look: [0.9, 0.1] } }, 0.25],
    [tm.bana, { expr: 'notr', head: { tilt: -3, look: [0.4, 0.15] } }, 0.3],            // bakış açısında: Necmi'ye (kameraya yakın) bakar
    [tm.tipatip, { expr: 'mutlu', head: { tilt: 4, look: [0.3, 0.1] } }, 0.3],
    [tm.d1b - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [0.4, 0.75] } }, 0.3],
    [tm.n3 + 0.4, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.15] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'yorgun', head: { tilt: -5, look: [0.8, 0.1] } }, 0.25],
    [tm.bir - 0.1, { expr: 'notr', head: { tilt: 4, look: [0.5, 0.8] } }, 0.3],
    [tm.it + 0.3, { expr: 'mutlu', head: { tilt: -4, look: [0.9, 0.2] } }, 0.3],
    [tm.soldaki - 0.2, { expr: 'saskin', head: { tilt: 4, look: [0.8, 0.0] } }, 0.25],
    [tm.n4 + 0.2, { expr: 'notr', head: { tilt: -3, look: [0.9, 0.1] } }, 0.3],
    [tm.h1 + 0.1, { head: { tilt: 3, look: [0.75, 0.0] } }, 0.3],
    [tm.defne - 0.05, { expr: 'saskin', head: { tilt: -4, look: [0.7, -0.05] } }, 0.25],
    [cd0, { expr: 'notr', head: { tilt: 4, look: [0.6, 0.6] } }, 0.3],
    [tm.s.dBak, { head: { tilt: 6, look: [0.85, 0.8] } }, 0.35],
    [tm.s.dDusun, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -5, look: [0.3, -0.5] } }, 0.4],
    [tm.s.dKalk, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 4, look: [0.85, 0.7] } }, 0.35],
    [tm.s.dNec, { expr: 'saskin', head: { tilt: -3, look: [0.95, 0.05] } }, 0.3],
    [tm.n1 + 0.4, { expr: 'saskin', head: { tilt: 4, look: [0.95, 0.15] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.7, 0.3] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.5, 0.3] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'notr', head: { tilt: -3, look: [-0.6, 0.45] }, ...POZ.dur });
  const hik = [
    [tm.neden, { head: { tilt: 4, look: [0.7, 0.2] } }, 0.3],
    [tm.d1, { expr: 'mutlu', head: { tilt: -4, look: [-0.6, 0.4] } }, 0.3],
    [tm.n2, { expr: 'notr', head: { tilt: 3, look: [0.7, 0.15] } }, 0.3],
    [tm.d1b, { head: { tilt: -4, look: [-0.5, 0.8] } }, 0.3],
    [tm.n3 + 0.3, { head: { tilt: 4, look: [0.7, 0.2] } }, 0.3],
    [tm.d2, { head: { tilt: -3, look: [-0.7, 0.3] } }, 0.3],
    [tm.it + 0.2, { head: { tilt: 3, look: [0.2, 0.85] } }, 0.3],
    [tm.hd - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [0.3, 0.8] } }, 0.3],
    [tm.soldaki + 0.6, { expr: 'mutlu', head: { tilt: 5, look: [0.75, 0.1] } }, 0.3],
    [tm.size - 0.1, { expr: 'saskin', head: { tilt: -4, look: [0.8, 0.1] } }, 0.25],
    [tm.h1 - 0.1, { expr: 'notr', head: { tilt: 4, look: [0.6, 0.15] } }, 0.3],
    [tm.kimseye, { expr: 'yorgun', head: { tilt: -4, look: [0.2, 0.4] } }, 0.3],
    [tm.h2 - 0.1, { expr: 'notr', head: { tilt: -4, look: [-0.8, 0.1] } }, 0.3],
    [tm.nasil, { expr: 'mutlu', head: { tilt: 5, look: [-0.75, 0.05] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: 3, look: [0.2, 0.75] } }, 0.3],
    [tm.s.hBak, { expr: IFADE.dusun2, head: { tilt: -6, look: [-0.7, 0.2] } }, 0.35],
    [tm.s.nOvus + 0.3, { expr: 'saskin', head: { tilt: 5, look: [0.85, 0.3] } }, 0.3],
    [tm.n1 + 0.5, { expr: 'saskin', head: { tilt: -4, look: [0.85, 0.3] } }, 0.3],
    [tm.n1s + 0.3, { expr: IFADE.dusun2, head: { tilt: 6, look: [0.2, -0.5] } }, 0.4],
    [tm.cevap, { expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.2] } }, 0.01],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'kizgin', head: { tilt: -4, look: [-0.8, 0.45] }, ...POZ.dur });
  const nec = [
    [tm.neden - 0.1, { expr: 'kizgin', head: { tilt: 4, look: [-0.85, 0.2] } }, 0.3],
    [tm.n0s, { expr: 'notr', head: { tilt: -3, look: [-0.85, 0.35] } }, 0.3],
    [tm.n2 - 0.05, { expr: 'yorgun', head: { tilt: -4, look: [-0.5, 0.1] } }, 0.3],
    [tm.bana - 0.1, { expr: 'notr', head: { tilt: 3, look: [-0.85, 0.3] } }, 0.3],
    [tm.d1b, { head: { tilt: 4, look: [-0.8, 0.75] } }, 0.3],
    [tm.n3 - 0.05, { expr: 'kizgin', head: { tilt: -3, look: [-0.8, 0.6] } }, 0.3],
    [tm.gorunuyor, { expr: 'yorgun', head: { tilt: 3, look: [-0.7, 0.2] } }, 0.25],
    [tm.d2 + 0.2, { expr: 'notr', head: { tilt: -3, look: [-0.85, 0.3] } }, 0.3],
    [tm.it + 0.3, { head: { tilt: 4, look: [-0.5, 0.85] } }, 0.3],
    [tm.hd, { expr: 'notr', head: { tilt: -3, look: [-0.75, 0.2] } }, 0.3],
    [tm.n4 - 0.1, { expr: 'kizgin', head: { tilt: 4, look: [-0.8, 0.1] } }, 0.25],
    [tm.guvenmem - 0.3, { ...POZ.ikaz, head: { tilt: -5, look: [-0.6, 0.0] } }, 0.3],
    [tm.n4s + 0.2, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 3, look: [-0.7, 0.2] } }, 0.35],
    [tm.h2, { head: { tilt: -3, look: [-0.85, 0.3] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: -3, look: [-0.6, 0.75] } }, 0.3],
    [tm.s.nEgil, { expr: IFADE.dusun2, head: { tilt: 7, look: [-0.5, 0.9] } }, 0.35],
    [tm.s.nOvus, { expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.2] } }, 0.35],
    [tm.n1 - 0.25, { expr: 'mutlu', head: { tilt: 4, look: [-0.75, 0.15] } }, 0.3],
    [tm.oyunu, { expr: 'mutlu', head: { tilt: -5, look: [-0.2, 0.05] } }, 0.3],
    [tm.n1s + 0.4, { head: { tilt: 5, look: [-0.75, 0.2] } }, 0.4],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, 0.3] } }, 0.01],
  ];
  return { tm, film, defBase, def, hikBase, hik, necBase, nec };
}

// ═══════════════════════════ Kalem durumları (bütün sahneler aynı fonksiyonu okur) ═══════════════════════════
// i: 0 kırmızı (Defne'nin sol eli = ekranın solu), 1 yeşil (sağ el). Dönen: { c, r, L, el (tutan el: 'L'|'R'|null), w (tutuş ağırlığı) }
function cizgiU(S, i, t) { const [a, d] = S.tm.ciz[i]; return clamp01((t - a) / d); }
function kalemAt(S, i, t) {
  const { tm } = S, [gx, gy, r0] = TUT[i], sd = i ? 'R' : 'L';
  // elde: tutuş noktası gövdenin ortasının biraz altında
  let g = [gx, gy + 46 * (1 - ease.enter(seg(t, 0.06, 0.5)))], r = r0, L = KL;   // kare 0'dan sonra kalemler yerine kalkar (ilk hareket 0,1 sn)
  g[1] -= 26 * H.nabiz(t, tm.kalem - 0.04, 0.36) + 34 * H.nabiz(t, i ? tm.biri2 - 0.04 : tm.biri1 - 0.04, 0.42) + 18 * H.nabiz(t, tm.tipatip - 0.04, 0.4);
  // çizgi: uç kâğıda iner, çizgi boyunca gider, kalkar (dönüş dışa doğru)
  const [a, d] = tm.ciz[i], inis = W(t, a - 0.36, 0.34) * (1 - W(t, a + d + 0.04, 0.34));
  if (inis > 0) {
    const rc = i ? Math.PI - 0.55 : -(Math.PI - 0.55), uc = [lerp(CIZ[i][0], CIZ[i][1], cizgiU(S, i, t)), CIZ_Y];
    const u = yon(rc), cc = [uc[0] - u[0] * KL / 2, uc[1] - u[1] * KL / 2], gc = [cc[0] - u[0] * KL * 0.1, cc[1] - u[1] * KL * 0.1];
    g = kar(g, gc, inis); r = lerp(r, rc, inis);
  }
  let el = sd, w = 1;
  // masaya bırakış ve itme
  if (t >= tm.bir) {
    const b = ease.state(seg(t, tm.bir, 0.45)), p = ease.state(seg(t, tm.it, 0.36)), k = ease.enter(seg(t, tm.it + 0.36, 0.6));
    const yat = [lerp(YAT0[i][0], YAT1[i][0], 0.4 * p + 0.6 * k), YAT0[i][1]];
    L = lerp(KL, KL_YAT, b); r = lerp(r, R_YAT, b);
    const u = yon(r), gYat = [yat[0] - u[0] * L * 0.1, yat[1] - u[1] * L * 0.1];
    g = kar(g, gYat, b);
    w = 1 - W(t, tm.bir + 0.45, 0.3); if (w <= 0.01) el = null;
  }
  const u = yon(r), c = [g[0] + u[0] * L * 0.1, g[1] + u[1] * L * 0.1];
  return { c, r, L, g, el, w };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => { H.cerceve(K, t, ep, tl, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç bu bölüme özel: perde yok, yüzleri ve kalemleri örtmez)
  dunya(K, t, B) { ofis(K, t, tl, S, B); },
  kamera(cam, t, B) {   // sayaç: yavaş, doğrusal itme 1,22x → 1,28x; ekranda y ≈ 850'deki nokta sabit kalır (zoom logaritmik)
    const d = B.sc.dogrusal; if (!d) return;
    const u = clamp01((t - B.sc.t0) / (B.sc.t1 - B.sc.t0)), z = Math.exp(lerp(Math.log(d[0]), Math.log(d[1]), u));
    cam.zoom = z; cam.cx = lerp(545, 560, u); cam.cy = 1338 - 323 / z;   // kalemlerin ortası ekranda y 1283'te sabit
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

// Cevapsız sürümde film n1'den sonra "Buldum!"dan 0,12 sn önce kesilir: ipucu cümlesi son karede de tam okunur kalsın.
function ipucuKalir(K, t, tl, S, B) {
  const l = tl.lines.find(x => x.id === 'n1'), d3 = tl.lines.find(x => x.id === 'd3');
  if (t < l.t1 + 0.1 || t >= d3.t0 - 0.04) return;
  H.caption(K, { line: l, text: l.text, age: 5, left: 5 }, { y: 1255, head: null });
}

// "SEN DE DÜŞÜN!" sayacı (b060 uyarlaması): başlık ve daire kalemlerin altında tek satır (y 1390); başlık ilk yarıda, paylaşım hapı ikinci yarıda aynı yerde.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, Y = 1390, x = 880, r = 50, tS = t0 + dur / 2;
  // başlık (ilk yarı) → paylaşım hapı (ikinci yarı): aynı yerde; çıkış 0,2 sn, giriş yay 320/30; okunurken kımıldamaz
  const pill = (metin, size, fill, a, b) => {
    if (t < a || t >= b) return;
    const v = H.spring(t - a, H.UI[0], H.UI[1]) * (1 - ease.exit(seg(t, b - 0.2, 0.2))) * out;
    ctx.save(); ctx.translate(430, Y); ctx.scale(v, v);
    ctx.font = `900 ${size}px Rubik`; const bw = ctx.measureText(metin).width + 56;
    K.rect(-bw / 2 + 7, -34 + 8, bw, 68, INK, 0, 34); K.rect(-bw / 2, -34, bw, 68, fill, LW, 34); K.text(metin, 0, size * 0.36, size, INK, 900);
    ctx.restore();
  };
  pill('SEN DE DÜŞÜN!', 52, PAL.mustard, t0 - 0.05, share ? tS : t1 + 0.35);
  if (share) pill(share, 44, PAL.paper, tS, t1 + 0.35);
  ctx.save(); ctx.translate(x, Y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 17, 48, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
}

// ═══════════════════════════ Ağız: konuşan kim ═══════════════════════════
// key'in replik ağırlığı (0..1): satır başlamadan 0,12 sn önce açılır, bittikten 0,02 sn sonra 0,12 sn'de kapanır.
function konusma(tl, key, t) {
  let k = 0;
  for (const l of tl.lines) if (l.who === key) k = Math.max(k, W(t, l.t0 - 0.12, 0.12) * (1 - W(t, l.t1 + 0.02, 0.12)));
  return k;
}
// Dinleyen (k = 0): ağız kapalı çizgi. Konuşan: düz ya da asık ağızlı ifadede (kızgın, yorgun, nötr) çizgi ağız konuşmayı
// göstermez (açıklık çizgi kalınlığının altında kalır); konuşurken ağız oval açılır ve hecelerle açılıp kapanır.
function agiz(p, k) {
  const ex = typeof p.expr === 'string' ? EXPR[p.expr] : p.expr;
  const duz = ex.curve < 0.3 && k > 0.5;
  p.expr = { ...ex, open: Math.min(ex.open, 0.12) * k, curve: lerp(ex.curve, Math.max(ex.curve, -0.15), k),
    round: duz || (k > 0.5 && ex.round), w: duz ? Math.min(ex.w, 0.8) : ex.w };
}

// ═══════════════════════════ Ofis: bütün sahneler ═══════════════════════════
function ofis(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, { ctx } = K;
  M.mekanCiz(K, OFIS, 'arka', t, { isik: M.ISIK.gunduz });
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  if (id === 'sayac') H.glance(hp, t, tm.cd - 0.5, 9.5);
  H.omuzSilk(np, t, tm.tipatip - 0.1, 0.3);
  if (t > tm.gorunuyor && t < tm.gorunuyor + 0.8) { const u = seg(t, tm.gorunuyor, 0.8); np.head = { ...np.head, look: [(np.head.look?.[0] || 0) + 0.45 * Math.sin(TAU * 2 * u) * Math.sin(Math.PI * u), np.head.look?.[1] || 0] }; }   // baş sallar: "hayır"
  if (t > tm.kimseye && t < tm.kimseye + 0.9) { const u = seg(t, tm.kimseye, 0.9); hp.head = { ...hp.head, look: [(hp.head.look?.[0] || 0) + 0.35 * Math.sin(TAU * 2 * u) * Math.sin(Math.PI * u), hp.head.look?.[1] || 0] }; }

  // Konuşan belli: yalnız replik süren karakterin ağzı oynar; dinleyenin ağzı kapalı (şaşkınlıkta, gülüşte bile).
  // Konuşanda kaş çatık kalır ama ağız eğrisi -0,15'e yumuşar: kızgın ağız (-0,5) dudak hareketini yutuyordu.
  for (const [key, p] of [['defne', dp], ['hikmet', hp], ['necmi', np]]) agiz(p, konusma(tl, key, t));

  const K0 = kalemAt(S, 0, t), K1 = kalemAt(S, 1, t);
  // ——— Defne: iki eli kalemlerde; masaya bırakınca sağ el ikisini iter ———
  const dO = { heads };
  if (K0.el) dO.L = [K0.g, K0.w, 'B'];
  if (K1.el) dO.R = [K1.g, K1.w, 'B'];
  const wIt = pIn(t, tm.it - 0.3, tm.it + 0.5, 0.26);
  let dItiyor = false;
  if (wIt > 0.01) { const m = [(K0.c[0] + K1.c[0]) / 2, 1318]; dO.R = [m, wIt, 'A']; dItiyor = wIt > 0.5 && t < tm.it + 0.38; dp.lean = -7 * wIt; }
  // ——— Hikmet: "soldaki"de kırmızıyı gösterir (dokunmaz); h1'de Necmi'yi, h2'de kalemleri gösterir ———
  const hO = { heads };
  let hIs = null;
  const wS = pIn(t, tm.soldaki - 0.32, tm.hds + 0.35, 0.28);
  if (wS > 0.01) { hO.L = [[K0.c[0] - 30, 1226], wS, 'A']; if (wS > 0.55) hIs = ['L', [K0.c[0], 1322]]; }
  const wN = pIn(t, tm.gozu - 0.3, tm.h1s, 0.3);
  if (wN > 0.01) hO.R = [[HIK_X + 62, 1190 - 14 * H.nabiz(t, tm.kimseye - 0.05, 0.4)], wN * 0.8, 'A'];   // avuç kendi göğsünün önünde, Necmi'ye doğru açık (kol Necmi'nin gövdesine binmez)
  const wK = pIn(t, tm.kalemler - 0.3, tm.h2s + 0.2, 0.3);
  if (wK > 0.01) { hO.R = [[YAT1[0][0] + 10, 1210], wK, 'A']; if (wK > 0.55) hIs = ['R', [lerp(YAT1[0][0], YAT1[1][0], 0.5), 1322]]; }
  // ——— Necmi: n0'da avuç açar (kalemlere uzanmaz); n4'te parmak sallar; sayaçta ve ipucunda ellerini ovuşturur ———
  const nO = { heads };
  const wA = pIn(t, tm.neden - 0.25, tm.n0s + 0.1, 0.3);
  let nIs = null;   // n0: sol el göğsünün önünden kalemlere (ekranın solu, Defne'nin elleri) doğru işaret eder; kalemlere uzanmaz
  if (wA > 0.01) { nO.L = [[NEC_X - 66, 1135 - 22 * H.nabiz(t, tm.birden - 0.05, 0.4) - 18 * H.nabiz(t, tm.n0s - 0.75, 0.4)], wA, 'oto']; if (wA > 0.55) nIs = ['L', [(TUT[0][0] + TUT[1][0]) / 2, 1060]]; }
  const wO = Math.max(pIn(t, tm.s.nOvus, tm.cd - 0.2, 0.32), pIn(t, tm.n1 - 0.1, tm.buldum - 0.06, 0.3));
  if (wO > 0.01) {
    const o = 9 * Math.sin(TAU * 3.2 * t);
    nO.L = [[NEC_X - 16 + o, 1214], wO, 'A']; nO.R = [[NEC_X + 16 + o, 1212], wO, 'A'];
  }
  let nParmak = 0;
  const wIk = pIn(t, tm.guvenmem - 0.3, tm.n4s + 0.2, 0.3);
  if (wIk > 0.5) nParmak = 1;

  // ——— çizim: kişiler → masa (rapor, çay) → kalemler → tutan eller ———
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  const hc = oyna(K, t, tl, 'hikmet', hp, hO);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  masa(K, S, t);
  kalem(K, K0.c, K0.r, KIR, K0.L);
  kalem(K, K1.c, K1.r, YES, K1.L);
  if (K0.el && K0.w > 0.5) dc.tut('L');
  if ((K1.el && K1.w > 0.5) || dItiyor) dc.tut('R');
  if (wO > 0.5) { nc.tut('L'); nc.tut('R'); }
  if (hIs) hc.isaret(hIs[0], hIs[1]);
  if (nIs) nc.isaret(nIs[0], nIs[1]);
  if (nParmak) nc.parmak('R', nParmak, { toplam: 1 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });

  // ——— Necmi'nin gözü: dünya gri tonlu (parlaklık korunur; kırmızı ve yeşil aynı gri) ———
  if (sc.pov) {
    const g = ease.state(seg(sc.lt, id === 'pov1' ? 0.1 : 0.04, 0.5));
    if (g > 0) { ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = g; ctx.fillStyle = '#808080'; ctx.fillRect(-4000, -4000, 9000, 9000); ctx.restore(); }
  }
}
