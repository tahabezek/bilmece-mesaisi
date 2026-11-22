// Bölüm 65 · NECMİ'NİN ZARFLARI (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_065_v5.md).
// Mekanizma: bir zarf geriden gelmek (one-ahead). Logline: Ofis eğlencesinde Necmi akıl okuma numarası yapar. Üç kişi birer
// soru yazıp zarfı kendi eliyle kapatmıştır; arka arkaya üç koltukta otururlar (Kerem en arkada, Defne ortada, Hikmet en önde).
// Necmi zarfları arkadan öne toplar, her zarfı öncekinin üstüne koyar, desteyi masaya bırakır. En üstteki zarfı alnına dayar,
// "yüzük" sorusunu söyler; en arkadaki Kerem elini kaldırır. Necmi zarfı açar, kâğıda bakar, "aynen böyle yazıyor" der, kâğıdı
// cebine koyar. Sıradaki zarfta Hikmet'in sorusunu bilir. Akılda kalacak tek şey: zarfların toplanma sırası.
// Sızıntı yasağı: zarflar tıpatıp aynıdır (yazı, işaret, renk farkı yok); deste sırası ok, renk ya da etiketle vurgulanmaz;
// kâğıdın yazılı yüzü hiç görünmez (kâğıt boş arka yüzüyle çizilir); Necmi kâğıda bakarken ifadesi değişmez, bakışı Hikmet'e
// kaymaz (kameraya döner); Kerem yalnız el kaldırır ve başını sallar.
// Mekân: toplantı odası, akşam (yandan): solda art arda üç sandalye, sağda kırmızı örtülü gösteri masası ve sarkıt lamba.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180, TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b065_salon';
const KX = 98, DX = 350, HX = 592, NX = 964;                // koltuklar (kalça x'i) ve Necmi'nin gösteri yeri
const SEAT = { genc: KX, defne: DX, hikmet: HX }, SIRA = ['genc', 'defne', 'hikmet'];   // arkadan öne
const MASA = { x0: 700, x1: 948, yb: 1274, yf: 1326 };       // gösteri masası: üst yüzün arka ve ön kenarı
const DESTE = [850, 1303];                                    // destenin en alttaki zarfının masadaki yeri (merkez)
const KAT = [14, -23];                                        // destede her kat bir öncekinin üstünde, hafif kaymış
const COP = [[752, 1308, 80], [762, 1298, 97], [748, 1290, 86]];   // açılmış boş zarfların masadaki yeri [x, y, açı]
const AY = 1715, AS = 232;                                    // Necmi'nin yürüdüğü ön koridor (zemin y'si, ölçek)
const DUR = { genc: KX - 135, defne: DX - 135, hikmet: HX - 100 };   // Necmi'nin üç durağı (ön koridorda, verenin bir adım gerisinde)
const ZW = 150, ZH = 92, KREM = '#F4E9CF';                    // zarf (üçü de aynı)
const ALIN = [NX - 48, 934], GOGUS = [NX - 58, 1205], KAGIT = [NX + 52, 1150], CEP = [NX + 38, 1304];
const SAKAK = [NX + 106, 994], GOSTER = [NX + 138, 1090];
const G0 = [1.0, 544, 1118], IKILI = [1.45, 852, 1146];
const UCLU = [1.25, 664, 1130];                               // sayaç: Defne–Hikmet–Necmi
const LAMBA = [806, 878];                                     // sarkıt lambanın alt kenarı
const BULUS = { genc: 72, defne: 72, hikmet: 96 };               // verenle Necmi'nin elinin buluştuğu yer (koltuktan ileri)
const SUPHE = { brow: -0.02, browTilt: 0.42, eye: 0.6, pupil: 1, curve: -0.1, open: 0, w: 0.85 };
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const art = (p, dx, dy) => [p[0] + dx, p[1] + dy];

// ═══════════════════════════ Nesneler ═══════════════════════════
// Zarf: (x, y) merkez. e: 1 yüzü kamerada, 0 yatık (masada ya da avuçta). yirtik: 0 kapalı … 1 üst kenarı boydan boya yırtılmış.
function zarf(K, [x, y], { e = 1, rot = 0, yirtik = 0, bas = 0 } = {}) {
  const { ctx } = K, w = ZW, h = ZH;
  ctx.save(); ctx.translate(x, y);
  ctx.transform(1, 0, lerp(-0.22, 0, e), lerp(0.5, 1, e), 0, 0);   // yatık zarf masa düzleminde döner
  ctx.rotate(rot * D2R);
  ctx.scale(1 + 0.03 * bas, 1 - 0.05 * bas);
  K.rect(-w / 2 + 5, -h / 2 + lerp(21, 8, e), w, h, INK, 0, 6);   // yatık zarfın kalınlığı: destede katlar seçilsin
  if (yirtik <= 0.001) {
    K.rect(-w / 2, -h / 2, w, h, KREM, LW * 0.7, 6);
    ctx.beginPath(); ctx.moveTo(-w / 2 + 6, -h / 2 + 5); ctx.lineTo(0, h * 0.12); ctx.lineTo(w / 2 - 6, -h / 2 + 5);
    ctx.lineWidth = 3.5; ctx.strokeStyle = '#BCA877'; ctx.lineJoin = 'round'; ctx.stroke();
  } else {
    // üst kenar soldan sağa yırtılır: yırtılan kısım tırtıklı ve açık (içi koyu krem)
    const xk = lerp(-w / 2, w / 2, clamp01(yirtik)), pts = [[-w / 2, h / 2], [w / 2, h / 2]];
    if (yirtik < 0.999) pts.push([w / 2, -h / 2], [xk, -h / 2]); else pts.push([w / 2, -h / 2 + 11]);
    for (let i = 0, n = Math.max(1, Math.round((xk + w / 2) / 12)); i <= n; i++) { const xx = xk - (xk + w / 2) * i / n; pts.push([xx, -h / 2 + (i % 2 ? 4 : 12)]); }
    K.poly(pts, KREM, LW * 0.7);
    ctx.beginPath(); ctx.moveTo(-w / 2 + 8, -h / 2 + 22); ctx.lineTo(xk - 6, -h / 2 + 22); ctx.lineWidth = 4; ctx.strokeStyle = '#D9C9A0'; ctx.stroke();
  }
  ctx.restore();
}
// Soru kâğıdı: yalnız BOŞ arka yüzü çizilir (yazılı yüz Necmi'ye dönüktür, hiç görünmez)
function kagit(K, [x, y], rot = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-37 + 4, -48 + 6, 74, 96, INK, 0, 4);
  K.rect(-37, -48, 74, 96, '#FBF8EF', LW * 0.6, 4);
  K.line(-30, 0, 30, 0, 2.5, '#DAD3C2');
  ctx.restore();
}
// Gösteri masası: kırmızı örtü (krem zarflar telefonda seçilsin diye), üst yüz yamuk
function masa(K) {
  const { x0, x1, yb, yf } = MASA;
  for (const x of [x0 + 22, x1 - 40]) K.rect(x, yf + 150, 18, 1500 - yf - 150, PAL.woodDark, LW, 4);
  K.poly([[x0, yf], [x1, yf], [x1, yf + 150], [x1 - 42, yf + 168], [x1 - 84, yf + 150], [x1 - 125, yf + 168], [x1 - 167, yf + 150], [x1 - 208, yf + 168], [x0, yf + 150]], '#A8362B', LW);
  K.line(x0 + 4, yf + 128, x1 - 4, yf + 128, 5, '#E9D9B8');
  K.poly([[x0 + 14, yb], [x1 - 14, yb], [x1, yf], [x0, yf]], '#C2412F', LW);
}
function lamba(K) {
  const [x, y] = LAMBA;
  K.line(x, -400, x, y - 76, 5, INK);
  H.isikSeridi(K, [[x - 46, y], [x + 46, y], [x + 140, MASA.yb + 6], [x - 110, MASA.yb + 6]], { renk: '#F3E3B0', a: 0.13 });
  K.poly([[x - 26, y - 78], [x + 26, y - 78], [x + 56, y], [x - 56, y]], PAL.mustard, LW);
  K.ell(x, y + 2, 22, 12, '#FBF0CF', LW * 0.6);
}
const BAYRAK = [PAL.coral, PAL.mustard, '#F4EDE0', '#7FB8AE', PAL.red];
function bayraklar(K) {
  const { ctx } = K, yip = x => 652 + 44 * Math.sin(Math.PI * (((x + 60) % 330 + 330) % 330) / 330);
  ctx.beginPath(); for (let x = -400; x <= 1500; x += 15) { const y = yip(x); x === -400 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  for (let i = 0, x = -385; x < 1500; x += 66, i++) { const y = yip(x); K.poly([[x - 22, y + 2], [x + 22, y + 2], [x, y + 54]], BAYRAK[i % 5], LW * 0.6); }
}
function balon(K, x, y, r, renk, bag, t, i) {
  const s = 7 * Math.sin(t * 0.9 + i * 1.7), { ctx } = K, bx = x + s, by = y + 3 * Math.sin(t * 1.3 + i);
  ctx.beginPath(); ctx.moveTo(bx, by + r * 1.18); ctx.quadraticCurveTo(lerp(bx, bag[0], 0.5) - s * 1.4, lerp(by, bag[1], 0.5), bag[0], bag[1]);
  ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  K.ell(bx, by, r, r * 1.16, renk, LW * 0.8);
  K.poly([[bx - 7, by + r * 1.14], [bx + 7, by + r * 1.14], [bx, by + r * 1.14 + 12]], renk, LW * 0.5);
  K.ell(bx - r * 0.34, by - r * 0.42, r * 0.16, r * 0.26, '#FFFFFF', 0, -0.5);
}
function hali(K) {
  K.rect(-520, 1632, 2200, 186, '#8E3B32', LW, 0);
  K.line(-520, 1652, 1680, 1652, 5, '#E9D9B8'); K.line(-520, 1798, 1680, 1798, 5, '#E9D9B8');
  for (let x = -480; x < 1680; x += 132) K.poly([[x, 1725], [x + 36, 1692], [x + 72, 1725], [x + 36, 1758]], PAL.mustard, LW * 0.5);
}

// İkram masası (ön planda, kadrajın altında): çay bardakları (döngü: buhar), pasta, çerez kâsesi, kâğıt bardaklar
const BRD = [[-17, -38], [17, -38], [10, -22], [15, -6], [12, 0], [-12, 0], [-15, -6], [-10, -22]];
const BRD_IC = [[-15, -31], [15, -31], [8.6, -22], [13.2, -6], [10.4, -2], [-10.4, -2], [-13.2, -6], [-8.6, -22]];
function cay(K, x, yb, t, k, i) {
  const { ctx } = K; ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 1, 27, 7, '#FBF6EC', 2.5); K.poly(BRD, '#F3EEE4', 0); K.poly(BRD_IC, '#A8401F', 0); K.poly(BRD, null, 2.6); K.line(-9, -33, -6, -26, 2.4, '#FFFFFF');
  ctx.restore();
  H.buhar(K, x, yb - 44 * k, t + i * 0.6, { k: 0.42 * k, n: 2, ara: 10, boy: 60 });
}
function ikram(K, t) {
  const { ctx } = K, y0 = 1872, k = 1.3, y = 0;
  K.rect(-560, y0, 2300, 500, '#214245', LW, 0);
  K.line(-560, y0 + 26, 1740, y0 + 26, 5, '#DCCBA8');
  ctx.save(); ctx.translate(540, y0 + 2); ctx.scale(k, k); ctx.translate(-540, 0);
  // pasta
  K.rect(338, y - 22, 190, 24, '#E9DCC2', LW * 0.8, 8); K.rect(356, y - 96, 154, 76, '#F1D9C7', LW, 12);
  K.rect(356, y - 64, 154, 14, PAL.coral, 0); for (const dx of [0, 44, 88]) K.circ(390 + dx, y - 104, 12, PAL.red, LW * 0.6);
  // çerez kâsesi
  K.poly([[606, y - 52], [760, y - 52], [736, y], [630, y]], '#7FB8AE', LW); K.ell(683, y - 52, 77, 13, '#C99A52', LW * 0.7);
  for (const [dx, dy] of [[-40, -3], [-12, -7], [18, -4], [44, -8]]) K.circ(683 + dx, y - 54 + dy, 8, '#B57B36', 2.5);
  // kâğıt bardaklar
  for (const [x, c] of [[848, PAL.mustard], [902, PAL.coral]]) { K.poly([[x - 22, y - 62], [x + 22, y - 62], [x + 15, y], [x - 15, y]], '#FBF6EC', LW * 0.8); K.rect(x - 20, y - 46, 40, 14, c, 0); }
  for (const [i, x] of [226, 280, 950, 1004].entries()) cay(K, x, y - 4, t, 1.3, i);
  ctx.restore();
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-400, 1500], dongu: ['balonların salınması', 'duvar saatinin saniye ibresi', 'ikram masasındaki çayların buharı'],
  capa: { masa: DESTE }, kadraj: { genis: G0 },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -520, x1: 1680, isik, duvar: 'cizgili', zemin: 'ahsap' });
    hali(K);
    bayraklar(K);
    M.duvarSaati(K, 468, 772, 44, 19.4 + t / 3600, t);
    balon(K, 28, 800, 46, PAL.coral, [64, 1480], t, 0); balon(K, 96, 742, 42, PAL.mustard, [64, 1480], t, 1); balon(K, -40, 730, 40, '#7FB8AE', [64, 1480], t, 2);
    balon(K, 1108, 900, 44, PAL.mustard, [1138, 1480], t, 3); balon(K, 1168, 968, 40, PAL.coral, [1138, 1480], t, 4); balon(K, 1190, 846, 38, '#7FB8AE', [1138, 1480], t, 5);
    K.rect(48, 1470, 32, 30, '#5D6A61', LW * 0.7, 6); K.rect(1122, 1470, 32, 30, '#5D6A61', LW * 0.7, 6);
    lamba(K);
  },
  on(K, t) { ikram(K, t); },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    zarfi: T('n0a:3'), okurum: T('n0a:5'), n0aS: T('n0a>'),
    n0b: T('n0b'), n0bS: T('n0b>'), h1: T('h1'), hZarfi: T('h1:3'), h1S: T('h1>'),
    n0c: T('n0c'), kayip: T('n0c:2'), n0cS: T('n0c>'),
    d1: T('d1'), dKerem: T('d1:2'), d1S: T('d1>'),
    n0d: T('n0d'), bakalim: T('n0d:1'), evet: T('n0d:2'), boyle: T('n0d:4'), n0dS: T('n0d>'),
    n0e: T('n0e'), zam: T('n0e:2'), gelecek: T('n0e:5'), n0eS: T('n0e>'),
    h2: T('h2'), h2S: T('h2>'),
    d2: T('d2'), tek: T('d2:4'), keremdi: T('d2:6'), elini: T('d2:10'), d2S: T('d2>'),
    h3: T('h3'), nasil: T('h3:2'), h3S: T('h3>'),
    n1: T('n1'), sirayla: T('n1:3'), n1S: T('n1>'),
    cevap: T('d3>') + 0.25, d4: T('d4'), hep: T('d4:8'), cta: T('d6') - 0.15,
  };
  tm.kapat = tm.n0aS + 0.3;                       // araya kesme: Hikmet zarfının kapağına bastırır
  tm.C = tm.n0b - 0.05;                           // toplama planı (kesintisiz): Necmi arkadan gelir
  // ——— toplama: üç durak, her birinde elden ele verme (uzat 0,32 + ortak 0,17 + çek 0,40) ———
  const P = {}, Wk = [], bitis = p => p + 0.89;
  Wk[0] = { t0: tm.C - 0.6, t1: tm.C + 0.25, x0: -340, x1: DUR.genc };
  P.genc = tm.C + 0.33;
  Wk[1] = { t0: bitis(P.genc) + 0.04, t1: bitis(P.genc) + 0.82, x0: DUR.genc, x1: DUR.defne };
  P.defne = Wk[1].t1 - 0.12;
  Wk[2] = { t0: bitis(P.defne) + 0.04, t1: bitis(P.defne) + 0.84, x0: DUR.defne, x1: DUR.hikmet };
  P.hikmet = Math.max(tm.hZarfi - 0.1, Wk[2].t1 + 0.15);   // Hikmet zarfını "zarfı da kendim kapattım" derken verir
  Wk[3] = { t0: bitis(P.hikmet) + 0.04, t1: bitis(P.hikmet) + 1.04, x0: DUR.hikmet, x1: NX };
  tm.P = P; tm.Wk = Wk; tm.on = Wk[3].t1; tm.kondu = tm.on + 0.4;
  // ——— gösteri turları: al (desteden en üsttekini alır) → alın → indir → yırt → kâğıdı çek → bak → cebe ———
  tm.tur = [
    { al: tm.n0c - 0.52, indir: tm.n0d - 0.12, yirt: tm.n0d + 0.2, cek: tm.bakalim + 0.2, bakBit: tm.boyle - 0.12, cep: tm.n0dS + 0.02 },
    { al: tm.n0e - 0.3, indir: tm.n0eS + 0.1, yirt: tm.h2 + 0.02, cek: tm.h2 + 0.34, bakBit: tm.d2 - 0.62, cep: tm.d2 - 0.56 },
    { al: tm.d2 + 0.25, indir: tm.h3 - 0.4, yirt: tm.h3 + 0.08, cek: tm.h3 + 0.42, bakBit: tm.h3S - 0.6, cep: tm.h3S - 0.52 },
  ];
  tm.tur[0].vurgu = tm.kayip; tm.tur[1].vurgu = tm.zam; tm.tur[2].vurgu = tm.tur[2].al + 0.7;
  if (tm.kondu > tm.tur[0].al - 0.05) console.error('b065: deste masaya geç konuyor', tm.kondu, tm.tur[0].al);
  if (tm.tur[0].cep + 0.38 > tm.tur[1].al + 0.02) console.error('b065: ikinci zarf erken alınıyor');
  tm.tG = tm.tur[0].al - 0.12;                    // toplama planı kesmeden ikili plana yaklaşır
  // sayaç: Hikmet açılmış boş zarfı lambaya tutar
  tm.g = { uzan: cd0 + 1.5, kaldir: cd0 + 1.95, indir: cd0 + 5.3, birak: cd0 + 5.85 };
  tm.kEl = [[tm.n0cS + 0.08, tm.d1S + 0.3], [tm.elini - 0.2, tm.d2S + 0.35]];   // Kerem elini kaldırır

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...G0]] },
    { id: 'vaat', t0: tm.zarfi - 0.1, cam: [[0, 1.6, 828, 1112], [tm.n0aS, 1.63, 831, 1110]] },
    { id: 'kapat', t0: tm.kapat, kisa: true, cam: [[0, 1.7, 540, 1098]] },
    { id: 'topla', t0: tm.C, cam: [[0, 1.2, 312, 1195]] },                                    // kamera draw'daki kamera() ile
    { id: 'necmi', t0: tm.kayip - 0.1, cam: [[0, 1.9, 1030, 1075], [tm.n0cS, 1.94, 1032, 1072]] },
    { id: 'sira', t0: tm.d1 - 0.1, cam: [[0, 1.43, 368, 1134], [tm.d1S, 1.45, 368, 1133]] },
    { id: 'ac', t0: tm.n0d - 0.1, cam: [[0, ...IKILI], [tm.n0e - 0.3, 1.46, 856, 1145], [tm.h2 - 0.1, 1.47, 850, 1145]] },
    { id: 'defne', t0: tm.d2 - 0.1, cam: [[0, 1.75, 372, 1085], [tm.tek - 0.12, 1.43, 368, 1134], [tm.elini, 1.46, 366, 1132]] },
    { id: 'soru', t0: tm.h3 - 0.1, cam: [[0, ...IKILI], [tm.h3S, 1.47, 855, 1145]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, ...UCLU]] },                                     // doğrusal itme ve kayış draw'da
    { id: 'ipucu', t0: tm.n1 - 0.2, cam: [[0, 1.2, 640, 1128], [tm.n1S, 1.23, 644, 1127], [tm.buldum - 0.1, 1.24, 644, 1126]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.6, 372, 1085]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...G0], [tm.hep, 1.06, 556, 1120]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.6, 372, 1085], [tm.cta + 1.2, 1.64, 372, 1082]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı/.test(w)) console.error('sahne uyarısı: ' + w);   // yakın planlar (1,5–1,9x) ve kesme sayısı bilinçli

  // n1 son repliktir (cevapsız kesim): altyazısı "Buldum!"a kadar ekranda kalsın
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.3 } : l) };

  // ——— oturanlar (yandan): poz izi yalnız ifade, baş ve gövde eğimi içindir; kollar draw'da nesneye uzanır ———
  const tb = (key, expr, tilt = 0) => H.otur(key, { x: SEAT[key], expr, head: { tilt, look: [0.6, 0.2] } });
  const s = i => cd0 + i;
  const base = { genc: tb('genc', 'notr', 2), defne: tb('defne', 'notr', 3), hikmet: tb('hikmet', SUPHE, 4) };
  const iz = {
    genc: [
      [P.genc - 0.2, { head: { tilt: 6 } }, 0.3],
      [bitis(P.genc), { head: { tilt: 1 } }, 0.3],
      [tm.n0cS + 0.05, { expr: 'notr', head: { tilt: -4 }, lean: -1 }, 0.3],
      [tm.d1S + 0.35, { expr: 'notr', head: { tilt: 2 }, lean: 3 }, 0.3],
      [tm.keremdi, { expr: 'saskin', head: { tilt: -6 }, lean: -2 }, 0.3],
      [tm.elini - 0.2, { expr: 'notr', head: { tilt: -4 }, lean: -1 }, 0.3],
      [tm.d2S + 0.4, { expr: 'notr', head: { tilt: 2 } }, 0.3],
      [s(1.0), { head: { tilt: -6 } }, 0.4],
      [s(3.4), { head: { tilt: 5 }, lean: 7 }, 0.4],
      [s(6.2), { expr: IFADE.dusun2, head: { tilt: -8 }, lean: 1 }, 0.4],
      [s(8.6), { expr: 'notr', head: { tilt: 3 }, lean: 4 }, 0.4],
      [tm.cevap, { expr: 'mutlu', head: { tilt: 4 }, lean: 3 }, 0.01],
    ],
    defne: [
      [0.5, { expr: 'mutlu', head: { tilt: -3 } }, 0.3],
      [tm.kapat, { expr: 'notr', head: { tilt: 4 } }, 0.01],
      [P.defne - 0.2, { head: { tilt: 7 }, lean: 6 }, 0.3],
      [bitis(P.defne), { head: { tilt: 2 }, lean: 3 }, 0.3],
      [tm.n0cS, { expr: 'saskin', head: { tilt: -5 } }, 0.3],
      [tm.d1 - 0.1, { expr: 'mutlu', head: { tilt: -5 }, lean: 4 }, 0.01],
      [tm.n0d - 0.1, { expr: 'notr', head: { tilt: 3 }, lean: 4 }, 0.01],
      [tm.gelecek + 0.3, { expr: 'saskin', head: { tilt: -3 } }, 0.3],
      [tm.d2 - 0.1, { expr: 'saskin', head: { tilt: -4 }, lean: 2 }, 0.01],
      [tm.tek - 0.1, { expr: SUPHE, head: { tilt: -8 }, lean: -1 }, 0.35],
      [tm.h3 - 0.1, { expr: SUPHE, head: { tilt: 3 }, lean: 5 }, 0.01],
      [s(0.4), { expr: SUPHE, head: { tilt: 5 }, lean: 10 }, 0.4],
      [s(3.8), { expr: IFADE.dusun2, head: { tilt: -9 }, lean: -3 }, 0.45],
      [s(7.0), { expr: SUPHE, head: { tilt: 6 }, lean: 8 }, 0.45],
      [tm.n1 + 0.2, { expr: 'saskin', head: { tilt: 0 }, lean: 4 }, 0.35],
      [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -8 }, lean: 0 }, 0.2, ease.enter],
      [tm.cevap, { expr: 'mutlu', head: { tilt: -2 }, lean: 5 }, 0.01],
      [tm.cta, { expr: 'mutlu', head: { tilt: -4 }, lean: 2 }, 0.01],
    ],
    hikmet: [
      [tm.zarfi - 0.1, { expr: SUPHE, head: { tilt: 6 }, lean: 1 }, 0.01],
      [tm.kapat, { expr: SUPHE, head: { tilt: 8 }, lean: 5 }, 0.01],
      [tm.C, { expr: 'notr', head: { tilt: 3 }, lean: 3 }, 0.01],
      [Wk[2].t1 - 0.4, { expr: SUPHE, head: { tilt: 9 }, lean: -3 }, 0.35],
      [P.hikmet - 0.05, { expr: 'kizgin', head: { tilt: 6 }, lean: 7 }, 0.3],
      [bitis(P.hikmet) + 0.2, { expr: 'notr', head: { tilt: 2 }, lean: 3 }, 0.35],
      [tm.kayip - 0.1, { expr: 'notr', head: { tilt: -2 }, lean: 4 }, 0.01],
      [tm.d1 - 0.1, { expr: 'saskin', head: { tilt: -6 }, lean: 0 }, 0.01],
      [tm.n0d - 0.1, { expr: SUPHE, head: { tilt: 3 }, lean: 6 }, 0.01],
      [tm.gelecek + 0.25, { expr: 'saskin', head: { tilt: -5 }, lean: 9 }, 0.25],
      [tm.h2S + 0.3, { expr: 'saskin', head: { tilt: -2 }, lean: 6 }, 0.3],
      [tm.h3 - 0.1, { expr: 'kizgin', head: { tilt: 2 }, lean: 7 }, 0.01],
      [tm.nasil, { expr: 'saskin', head: { tilt: -4 }, lean: 9 }, 0.3],
      [s(0.3), { expr: SUPHE, head: { tilt: 4 }, lean: 5 }, 0.35],
      [tm.g.uzan, { head: { tilt: 8 }, lean: 16 }, 0.4],
      [tm.g.kaldir, { expr: SUPHE, head: { tilt: -13 }, lean: 8 }, 0.5],
      [tm.g.indir, { expr: 'yorgun', head: { tilt: 6 }, lean: 14 }, 0.45],
      [tm.g.birak + 0.2, { expr: IFADE.dusun, head: { tilt: -3 }, lean: 3 }, 0.45],
      [tm.n1 + 0.3, { expr: 'saskin', head: { tilt: 2 }, lean: 6 }, 0.35],
      [tm.cevap, { expr: 'saskin', head: { tilt: -4 }, lean: 5 }, 0.01],
    ],
  };
  // ——— Necmi (önden; masanın yanında) ———
  const necBase = H.kisi('necmi', { x: NX, expr: 'mutlu', head: { tilt: -7, look: [-0.2, -0.4] }, ...POZ.dur });
  const nec = [
    [tm.zarfi - 0.1, { head: { tilt: 3, look: [-0.7, 0.2] } }, 0.01],
    [tm.okurum - 0.1, { head: { tilt: -3, look: [-0.1, 0.0] } }, 0.3],
    [tm.on, { expr: 'notr', head: { tilt: 4, look: [-0.6, 0.6] } }, 0.01],
    [tm.tur[0].al + 0.3, { head: { tilt: -6, look: [0, -0.3] } }, 0.35],
    [tm.kayip - 0.05, { head: { tilt: 6, look: [0, -0.3] } }, 0.4],
    [tm.tur[0].indir, { head: { tilt: 4, look: [-0.3, 0.7] } }, 0.3],
    [tm.tur[0].cek + 0.2, { head: { tilt: 7, look: [0.6, 0.85] } }, 0.3],        // kâğıda bakar (ifade değişmez)
    [tm.tur[0].bakBit, { head: { tilt: 0, look: [0, 0.05] } }, 0.3],             // kameraya döner
    [tm.tur[0].cep, { head: { tilt: 5, look: [0.5, 0.8] } }, 0.25],
    [tm.tur[1].al, { head: { tilt: 4, look: [-0.6, 0.7] } }, 0.25],
    [tm.tur[1].al + 0.3, { head: { tilt: -6, look: [0, -0.3] } }, 0.35],
    [tm.zam - 0.05, { head: { tilt: 6, look: [0, -0.3] } }, 0.4],
    [tm.tur[1].indir, { head: { tilt: 4, look: [-0.3, 0.7] } }, 0.3],
    [tm.tur[1].cek + 0.2, { head: { tilt: 7, look: [0.6, 0.85] } }, 0.3],
    [tm.tur[1].cep, { head: { tilt: 5, look: [0.5, 0.8] } }, 0.25],
    [tm.tur[2].al + 0.3, { head: { tilt: -6, look: [0, -0.3] } }, 0.35],
    [tm.tur[2].indir, { head: { tilt: 4, look: [-0.3, 0.7] } }, 0.3],
    [tm.tur[2].cek + 0.2, { head: { tilt: 7, look: [0.6, 0.85] } }, 0.3],
    [tm.tur[2].cep, { head: { tilt: 5, look: [0.5, 0.8] } }, 0.25],
    [s(0.3), { expr: 'mutlu', head: { tilt: -3, look: [-0.6, 0.15] } }, 0.35],
    [s(3.0), { head: { tilt: 4, look: [0, 0.05] } }, 0.4],
    [s(6.3), { head: { tilt: -6, look: [-0.5, -0.2] } }, 0.4],
    [s(8.8), { head: { tilt: 2, look: [-0.3, 0.1] } }, 0.4],
    [tm.n1 - 0.15, { expr: 'mutlu', head: { tilt: -4, look: [-0.5, 0.1] } }, 0.3],
    [tm.sirayla, { head: { tilt: 3, look: [0, 0.05] } }, 0.35],
    [tm.cevap, { expr: 'saskin', head: { tilt: 4, look: [-0.7, 0.1] } }, 0.01],
    [tm.hep, { expr: 'mutlu', head: { tilt: -3, look: [-0.3, 0.1] } }, 0.35],
  ];
  return { tm, film, tlA, base, iz, necBase, nec };
}

// ═══════════════════════════ Durumlar (bütün sahneler aynı fonksiyonları okur) ═══════════════════════════
// Necmi yandan (toplama): hangi yürüyüş parçasındaysa onun pozu; duraklarda ayakta bekler
function necYan(S, t) {
  const { Wk } = S.tm; let k = 0;
  for (let i = 0; i < Wk.length; i++) if (t >= Wk[i].t0) k = i;
  const w = Wk[k], p = H.yuru('necmi', t, { t0: w.t0, t1: w.t1, x0: w.x0, x1: w.x1, y: AY, s: AS, poz: { expr: 'mutlu', head: { tilt: 2, look: [0.6, 0.1] } } });
  if (k === 3) { const u = ease.state(p.u); p.y = lerp(AY, 1500, u); p.s = lerp(AS, H.BOY.necmi, u); }
  return p;
}
// Destenin en alttaki zarfının yeri: önce Necmi'nin avucunda, sonra masada
function desteYeri(S, t) {
  const { tm } = S;
  if (t >= tm.kondu) return DESTE;
  const elde = tt => { const p = necYan(S, tt), cek = seg(tt, tm.on - 0.25, 0.25); return [p.x + lerp(0.46, 0.1, cek) * p.s + 4, p.y - 1.32 * p.s - 24]; };
  if (t < tm.on) return elde(t);
  return H.tasi(t, tm.on, 0.4, elde(tm.on), DESTE, 22);
}
// Sahibinin elindeki zarf (toplamadan önce): göğüs önünde tutulur
function sahipte(S, key, t) {
  const { tm } = S, x = SEAT[key], i = SIRA.indexOf(key);
  const k = ease.enter(seg(t, 0.3 + i * 0.08, 0.4));
  let p = [x + 62 + 4 * k, lerp(1292, 1238, k)], rot = [-5, 4, -3][i], bas = 0;
  if (key === 'genc' && t >= tm.kapat && t < tm.C) p = [x + 14, 1262];   // araya kesmede Kerem kadraj dışında
  if (key !== 'genc' && t >= tm.kapat && t < tm.C) {   // araya kesme: zarfı kaldırır, kapağına iki kez bastırır
    const u = ease.enter(seg(t, tm.kapat - 0.2, 0.3)), d = key === 'defne' ? -0.08 : 0;
    p = [x + 62, lerp(1238, key === 'hikmet' ? 1200 : 1218, u)];
    bas = H.nabiz(t, tm.kapat + 0.3 + d, 0.22) + H.nabiz(t, tm.kapat + 0.6 + d, 0.22);
  }
  if (key === 'hikmet' && t >= tm.C) {                  // Necmi yaklaşınca zarfı göğsüne çeker
    const u = W(t, tm.Wk[2].t1 - 0.35, 0.35);
    p = [x + 66 - 20 * u, 1238 - 18 * u]; rot = lerp(-3, -12, u);
  }
  return { p, rot, bas };
}
// j. zarf (0 Kerem'in, 1 Defne'nin, 2 Hikmet'in). Üçü de aynı çizilir; ayrım yalnız konumdan gelir.
function zarfAt(S, j, t) {
  const { tm } = S, key = SIRA[j], x = SEAT[key], p0 = tm.P[key], n = 2 - j, tr = tm.tur[n];
  if (t < p0) return { ...sahipte(S, key, t), e: 1, yer: 'sahip', key };
  const tB = p0 + 0.49, tS = tB + 0.4;
  if (t < tS) {
    const A = sahipte(S, key, p0), Bn = art(desteYeri(S, tS), j * KAT[0], j * KAT[1]);
    const v = H.elVer(t, p0, A.p, Bn, { bulus: [x + BULUS[key], 1322], uzat: 0.32, ortak: 0.17, cek: 0.4 });
    const u1 = ease.state(seg(t, p0, 0.32)), u2 = ease.state(seg(t, tB, 0.4));
    return { p: v.p, e: lerp(lerp(1, 0.72, u1), 0, u2), rot: A.rot * (1 - u1), yer: 'verme', key, v };
  }
  const slot = art(desteYeri(S, t), j * KAT[0], j * KAT[1]);
  if (t < tr.al + 0.25) return { p: slot, e: 0, rot: 0, yer: 'deste', key };
  // Hikmet sayaçta açılmış boş bir zarfı lambaya tutar (en son bırakılan, kendisine en yakın duran)
  const cop = COP[n];
  if (n === 2 && t >= tm.g.kaldir - 0.05 && t < tm.g.birak) {
    const u = ease.enter(seg(t, tm.g.kaldir, 0.6)) * (1 - ease.state(seg(t, tm.g.indir, 0.5)));
    return { p: H.yay([cop[0], cop[1]], [LAMBA[0] + 14, 1018], u, 0), e: u, rot: lerp(cop[2], 86 + 5 * Math.sin((t - tm.g.kaldir) * 2.1), u), yirtik: 1, yer: 'hikmet', key };   // ışığın altında, iki yüzün arasında dik tutar
  }
  if (t >= tr.cep + 0.38) return { p: [cop[0], cop[1]], e: 0, rot: cop[2], yirtik: 1, yer: 'cop', key };
  let p, e = 1, rot = -14;
  const uA = ease.enter(seg(t, tr.al + 0.25, 0.4));
  p = H.yay(slot, ALIN, uA, 30); e = uA; rot = -14 * uA;
  if (t >= tr.indir) { const u = ease.state(seg(t, tr.indir, 0.3)); p = kar(ALIN, GOGUS, u); rot = lerp(-14, -4, u); }
  if (t >= tr.cep) { const u = ease.state(seg(t, tr.cep, 0.38)); p = H.yay(GOGUS, [cop[0], cop[1]], u, 16); e = 1 - u; rot = lerp(-4, cop[2], u); }
  return { p, e, rot, yirtik: seg(t, tr.yirt, 0.28), yer: 'el', key, n };
}
// n. turun kâğıdı: zarftan çıkar, Necmi'nin önünde durur, cebe girer
function kagitAt(S, n, t) {
  const tr = S.tm.tur[n];
  if (t < tr.cek || t >= tr.cep + 0.38) return null;
  if (t < tr.cep) { const u = ease.enter(seg(t, tr.cek, 0.32)); return { p: kar([GOGUS[0] + 8, GOGUS[1] - 6], KAGIT, u), cik: u, rot: lerp(-4, 5, u) }; }
  const u = ease.state(seg(t, tr.cep, 0.38));
  return { p: kar(KAGIT, CEP, u), cik: 1, rot: lerp(5, 0, u), cepte: u };
}
const dizEl = (key, p, sd) => { const h = H.eklem(key, p, 'pelvis'), k = H.eklem(key, p, sd === 'L' ? 'kneeL' : 'kneeR'); return [lerp(h[0], k[0], sd === 'L' ? 0.8 : 0.62), k[1] - H.CARDS[key].leg.w * 0.42 * p.s]; };

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA || tl, S, {
  kartSon: -1,
  split: { d2: 7 },
  kuyruksuz: (t, B) => B.sc.id === 'topla' || B.sc.id === 'ac' && t < S.tm.h2 - 0.1 || B.sc.id === 'ipucu',   // kuyruk desteye binmesin
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'topla') {   // Necmi'yi izleyen kesintisiz plan; deste masaya konunca ikili plana yaklaşır (yay 170/26)
      const xN = necYan(S, Math.min(t, tm.on)).x, u = clamp01((xN - DUR.genc) / (NX - DUR.genc));
      const A = { zoom: 1.2 * Math.exp(0.004 * (t - tm.C)), cx: lerp(312, IKILI[1], u), cy: 1195 };
      const w = t < tm.tG ? 0 : Math.min(1, H.spring(t - tm.tG, H.CAM[0], H.CAM[1]));
      Object.assign(cam, H.kamKaris(A, { zoom: IKILI[0] * Math.exp(0.004 * Math.max(0, t - tm.tG)), cx: IKILI[1], cy: IKILI[2] }, w));
    }
    if (id === 'sayac') {   // sayaç: Defne–Hikmet–Necmi planında yavaş, doğrusal itme
      const u = clamp01((t - tm.cd0) / 10);
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(UCLU[0]), Math.log(1.34), u)), cx: lerp(UCLU[1], 676, u), cy: lerp(UCLU[2], 1126, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.cevap) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (bu bölüme özel): perde yok; alt bantta durur, yüzler, masa ve lamba açık kalır.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.3 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.25), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 196, y = 1318, r = 96;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(10, 12, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 14, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 29, 82, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(608, 1268); ctx.scale(inU * out, inU * out);
  ctx.font = '900 60px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 70;
  K.rect(-bw / 2 + 8, -44 + 10, bw, 88, INK, 0, 44); K.rect(-bw / 2, -44, bw, 88, PAL.mustard, LW, 44);
  K.text('SEN DE DÜŞÜN!', 0, 21, 60, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(608, 1374); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 60;
    K.rect(-sw / 2 + 8, -40 + 10, sw, 80, INK, 0, 40); K.rect(-sw / 2, -40, sw, 80, PAL.coral, LW, 40); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// Önkol masanın üstüne yeniden çizilir (masa karakterden sonra çizildiği için): dirsek → el, sonra el
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
const masaUstu = p => p[0] > MASA.x0 - 10 && p[0] < MASA.x1 + 10 && p[1] > MASA.yb - 30;

// ═══════════════════════════ Sahne ═══════════════════════════
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.aksam });
  const Z = [0, 1, 2].map(j => zarfAt(S, j, t));
  const yan = t >= tm.C && t < tm.on, yok = t >= tm.kapat && t < tm.C;

  // ——— oturanlar: Kerem, Defne, Hikmet (arkadan öne; sandalye → karakter) ———
  const C = {}, Pz = {};
  for (const j of [2, 1, 0]) {   // öndeki önce çizilir: arkadakinin yüzü öndekinin saçına gömülmez
    const key = SIRA[j], p = H.poseAt(H.CARDS[key], S.base[key], S.iz[key], t), z = Z[j], o = { heads };
    if (key === 'defne') p.y -= H.buldumHop(t, tm.buldum, 36);
    o.L = [dizEl(key, p, 'L'), 1, 'A']; o.R = [dizEl(key, p, 'R'), 1, 'A'];
    if (z.yer === 'sahip') {
      o.R = [art(z.p, 48, 16), 1, 'A']; o.L = [art(z.p, -42, 22), 1, 'A'];
      if (key !== 'genc' && t >= tm.kapat && t < tm.C) o.R = [art(z.p, 14 + 30 * (1 - Math.min(1, z.bas * 1.4)), 2 + 12 * (1 - z.bas)), 1, 'A'];
    } else if (z.yer === 'verme') {
      o.R = [kar(dizEl(key, p, 'R'), art(z.p, 50, 12), z.v.verW), 1, 'A'];
    }
    // Kerem elini kaldırır (başının arkasından; kol yüze binmez) ve başını sallar
    if (key === 'genc') {
      const u = H.kaldir(t, tm.kEl, { cik: 0.34, inis: 0.3 });
      if (u > 0.001) o.R = [art(kar(dizEl(key, p, 'R'), [SEAT.genc - 44 + 5 * Math.sin((t - tm.kEl[0][0]) * 9) * u, 956], u), -90 * Math.sin(Math.PI * u), 0), 1, 'B'];
      H.onayla(p, t, tm.dKerem + 0.05, 2, 0.34); H.onayla(p, t, tm.elini + 0.25, 2, 0.34);
      p.kalkik = u;
    }
    if (key === 'defne') {
      // d1: arkayı (Kerem'i) gösterir
      const ut = pIn(t, tm.tek - 0.12, tm.elini - 0.1, 0.26);
      if (ut > 0.001) o.R = [kar(dizEl(key, p, 'R'), [DX + 96, 1196], ut), 1, 'A'];
      p.tek = ut;
      const uc = pIn(t, tm.cevap + 0.3, tm.cta - 0.2, 0.3);
      if (uc > 0.001) o.R = [kar(dizEl(key, p, 'R'), [DX + 150, 1215], uc), 1, 'A'];
      p.ileri = uc;
      if (id === 'buldum') o.R = [kar(dizEl(key, p, 'R'), [DX - 46, 952], ease.enter(seg(t, tm.buldum - 0.05, 0.25))), 1, 'B'];
    }
    if (key === 'hikmet') {
      // h2: "Bu benim sorum!" eli havada; h3: avucu açık, sorar; sayaç: açılmış boş zarfı lambaya tutar
      const u2 = pIn(t, tm.h2 - 0.12, tm.h2S + 0.45, 0.25);
      if (u2 > 0.001) o.R = [art(kar(dizEl(key, p, 'R'), [HX - 30, 940], u2), -90 * Math.sin(Math.PI * u2), 0), 1, 'B'];
      p.kalkik = u2;
      const u3 = pIn(t, tm.h3 + 0.1, tm.h3S + 0.25, 0.28);
      if (u3 > 0.001) o.R = [kar(dizEl(key, p, 'R'), [HX + 92, 1190], u3), 1, 'A'];
      const uk = pIn(t, tm.cd0 + 6.7, tm.cd0 + 8.9, 0.3);
      if (uk > 0.001) { o.R = [art(kar(dizEl(key, p, 'R'), [HX - 30, 940], uk), -90 * Math.sin(Math.PI * uk), 0), 1, 'B']; p.kalkik = uk; }   // "bir dakika…": parmağını kaldırır, vazgeçer
      const g = tm.g, zk = Z[0];
      if (t >= g.uzan && t < g.birak + 0.35) {
        const w = pIn(t, g.uzan, g.birak, 0.3);
        const hedef = zk.yer === 'hikmet' ? art(zk.p, lerp(-8, -4, zk.e), lerp(-4, 70, zk.e)) : [COP[2][0] - 8, COP[2][1] - 4];
        o.R = [kar(dizEl(key, p, 'R'), hedef, w), 1, 'A'];
        p.zarfta = w;
      }
    }
    const s = H.oturak(key, p);
    M.sandalye(K, SEAT[key] + 2, H.oturak(key, S.base[key]).y, { yon: 1, w: 118, sirt: 160 });
    C[key] = oyna(K, t, tl, key, p, { ...o, sessiz: key === 'genc' });
    Pz[key] = p; void s;
  }

  // ——— Necmi önden (masanın yanında): kare 0, gösteri, sayaç, ipucu ———
  let nc = null, np = null, solEl = null;
  const turN = tm.tur.findIndex(tr => t >= tr.al && t < tr.cep + 0.38);
  if (!yan && !yok) {
    np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    const o = { heads };
    // gözler: kare 0'da ve zarf alnındayken kapalı
    let kapali = t < tm.C ? 1 - W(t, tm.zarfi - 0.2, 0.2) : 0;
    for (const tr of tm.tur) kapali = Math.max(kapali, pIn(t, tr.al + 0.5, tr.indir - 0.12, 0.2));
    if (kapali > 0.02) np.blink = kapali;
    if (t < tm.kapat) {
      // kanca: sağ eli şakağında, sol eli parmakları açık, seyirciye uzanmış
      o.R = [SAKAK, 1 - W(t, tm.okurum - 0.15, 0.3), 'B'];
      o.L = [[NX - 124 - 14 * W(t, 0.3, 0.4), 1160 - 22 * H.nabiz(t, 0.34, 0.5) - 14 * W(t, tm.zarfi - 0.1, 0.3)], 1, 'B'];
    } else if (t >= tm.on) {
      // sol el: desteyi masaya koyar; her turda en üstteki zarfı alır, alnına dayar, indirir, boş zarfı masaya bırakır
      if (t < tm.kondu + 0.3) o.L = [art(desteYeri(S, t), -34, 20), 1 - W(t, tm.kondu + 0.05, 0.25), 'A'];
      if (turN >= 0) {
        const tr = tm.tur[turN], z = Z[2 - turN];
        const birak = seg(t, tr.cep, 0.38);
        const hedef = z.yer === 'deste' ? art(z.p, -46, -6) : art(z.p, lerp(lerp(-46, -58, z.e), 30, birak), lerp(-6, 40, z.e));
        o.L = [hedef, W(t, tr.al, 0.25), 'A']; solEl = z;
      } else {
        const onceki = tm.tur.filter(tr => t >= tr.cep + 0.38).pop();
        if (onceki && t < onceki.cep + 0.7) { const c = COP[tm.tur.indexOf(onceki)]; o.L = [[c[0] + 30, c[1] - 6], 1 - W(t, onceki.cep + 0.4, 0.28), 'A']; }
      }
      // sağ el: zarf alındayken açık (gösteri), sonra zarfı yırtar, kâğıdı çeker, cebe koyar
      for (const [n, tr] of tm.tur.entries()) {
        if (t < tr.al + 0.4 || t > tr.cep + 0.7) continue;
        const kg = kagitAt(S, n, t);
        let hedef;
        if (kg) hedef = art(kg.p, 4, 36);
        else if (t >= tr.cep) hedef = art(CEP, 4, 30);
        else hedef = H.iz([[0, GOSTER], [tr.yirt - 0.26, art(GOGUS, -54, -50), 0.24], [tr.yirt, art(GOGUS, 60, -52), 0.28], [tr.cek - 0.05, art(GOGUS, 12, 30), 0.05]], t);
        o.R = [hedef, pIn(t, tr.al + 0.4, tr.cep + 0.42, 0.26), 'A'];
      }
      // sayaç: sol el belde, bir ara parmağıyla şakağına dokunur; ipucu: bir parmak havada
      if (id === 'sayac' || id === 'ipucu') {
        const us = pIn(t, tm.cd0 + 6.4, tm.cd0 + 8.5, 0.3);
        if (us > 0.001) o.R = [SAKAK, us, 'B'];
        const ui = pIn(t, tm.n1 - 0.25, tm.buldum + 1, 0.28);
        if (ui > 0.001) o.R = [[NX + 88 + 8 * Math.sin((t - tm.n1) * 5.2) * clamp01((tm.n1S - t) / 0.4), 1016], ui, 'B'];
        np.parmak = ui; np.sakak = us;
        H.onayla(np, t, tm.cd0 + 8.7, 2, 0.4);
      }
      if (id === 'cevap') { const u = W(t, tm.cevap + 0.2, 0.35); o.L = [[NX - 120, 1040], u, 'B']; o.R = [[NX + 120, 1040], u, 'B']; }
    }
    nc = oyna(K, t, tl, 'necmi', np, o);
    // hırkanın yan cebi: kâğıtlar buraya girer (uçları görünür kalır)
    const cepte = tm.tur.filter(tr => t >= tr.cep + 0.3).length;
    for (let i = 0; i < cepte; i++) K.rect(CEP[0] - 22 + i * 9, CEP[1] - 31 - i * 3, 30, 20, '#FBF8EF', LW * 0.5, 3);
    const kc = turN >= 0 ? kagitAt(S, turN, t) : null;
    if (kc && kc.cepte) { K.ctx.save(); K.ctx.beginPath(); K.ctx.rect(NX - 200, 900, 500, CEP[1] - 12 - 900); K.ctx.clip(); kagit(K, kc.p, kc.rot); K.ctx.restore(); }
    K.line(CEP[0] - 28, CEP[1] - 13, CEP[0] + 28, CEP[1] - 13, 4.5, INK);
    if (kc && kc.cepte && nc) nc.tut('R');
  }

  // ——— masa ve üstündekiler ———
  masa(K);
  for (const n of [0, 1, 2]) { const z = Z[2 - n]; if (z.yer === 'cop') zarf(K, z.p, z); }
  for (const z of Z) if (z.yer === 'deste' && t >= tm.kondu) zarf(K, z.p, z);
  if (nc && np && !yan) for (const sd of ['L', 'R']) { const h = H.eklem('necmi', np, 'hand' + sd); if (masaUstu(h)) kolUst(K, 'necmi', np, sd); }
  if (Pz.hikmet.zarfta > 0.3 && masaUstu(H.eklem('hikmet', Pz.hikmet, 'handR'))) kolUst(K, 'hikmet', Pz.hikmet, 'R');
  // Necmi desteyi avucundan masaya indirirken (önden)
  if (!yan && t >= tm.on && t < tm.kondu) { for (const z of Z) if (z.yer === 'deste') zarf(K, z.p, z); nc.tut('L'); }

  // ——— sahiplerinin elindeki zarflar ———
  for (const [j, key] of SIRA.entries()) {
    const z = Z[j];
    if (z.yer === 'sahip') { zarf(K, z.p, z); C[key].tut('R'); H.grip(K, key, C[key].handL, Pz[key].s); }
  }
  // Hikmet lambaya tuttuğu boş zarf
  if (Z[0].yer === 'hikmet') { zarf(K, Z[0].p, Z[0]); C.hikmet.tut('R'); }
  if (Pz.genc.kalkik > 0.5) C.genc.parmak('R', 4 * clamp01((Pz.genc.kalkik - 0.5) * 2.2), { yon: -Math.PI / 2 - 0.1, ac: 0.34, toplam: 4 });
  if (Pz.hikmet.kalkik > 0.5) C.hikmet.parmak('R', 1, { yon: -Math.PI / 2 + 0.15, toplam: 1 });
  if (Pz.defne.tek > 0.5) C.defne.parmak('R', 1, { yon: -Math.PI / 2 + 0.2, toplam: 1 });
  if (Pz.defne.ileri > 0.5) C.defne.isaret('R', [COP[1][0], COP[1][1] - 10]);

  // ——— Necmi yandan (ön koridorda yürür, toplar) ———
  if (yan) {
    np = necYan(S, t);
    const o = { heads }, sb = desteYeri(S, t);
    const ilk = tm.P.genc;
    // uzak el: desteyi avucunda taşır (ilk zarf gelmeden hemen önce kalkar)
    o.L = [art(sb, -4, 24), W(t, ilk + 0.15, 0.3), 'A'];
    // yakın el: her durakta verenin uzattığı zarfı ucundan tutar, destenin üstüne koyar
    let ver = null;
    for (const [j, key] of SIRA.entries()) {
      const p0 = tm.P[key], z = Z[j], bulus = [SEAT[key] + BULUS[key] - 54, 1322 + 4];
      const bekle = key === 'hikmet' ? W(t, tm.Wk[2].t1 - 0.1, 0.3) * (t < p0 + 0.32 ? 1 : 0) : 0;
      if (z.yer === 'verme') {
        const tut = t < p0 + 0.32 ? bulus : art(z.p, -54, 4);
        o.R = [tut, Math.max(z.v.alW, bekle) * (1 - W(t, p0 + 0.84, 0.2)), 'A']; ver = z;
        np.lean = (np.lean || 0) + 6 * Math.sin(Math.PI * seg(t, p0, 0.89));
      } else if (bekle > 0.001 && z.yer === 'sahip') o.R = [bulus, bekle, 'A'];
    }
    nc = oyna(K, t, tl, 'necmi', np, o);
    for (const z of Z) if (z.yer === 'deste') zarf(K, z.p, z);
    if (Z.some(z => z.yer === 'deste')) H.grip(K, 'necmi', art(sb, -52, 14), np.s);   // desteyi alttan tutan el (başparmak önde)
    if (ver) { zarf(K, ver.p, ver); if (ver.v.verW > 0.5) C[ver.key].tut('R'); if (ver.v.alW > 0.5) nc.tut('R'); }
  }

  // ——— Necmi'nin elindeki zarf ve kâğıt (önden) ———
  if (solEl && solEl.yer === 'el') {
    const kg = kagitAt(S, turN, t);
    if (kg && kg.cik < 1) kagit(K, kg.p, kg.rot);
    zarf(K, solEl.p, solEl);
    nc.tut('L');
    if (kg && kg.cik >= 1 && !kg.cepte) { kagit(K, kg.p, kg.rot); nc.tut('R'); }
    if (kg && kg.cik < 1) nc.tut('R');
    if (!kg && t >= tm.tur[turN].yirt - 0.05 && t < tm.tur[turN].cek) nc.tut('R');
  }
  if (nc && !yan && !yok) {
    if (t < tm.kapat) { nc.parmak('L', 5 * W(t, 0.3, 0.35), { yon: Math.PI * 1.08, ac: 0.3, toplam: 5 }); if (t < tm.okurum - 0.1) nc.isaret('R', [NX + 50, 975]); }
    for (const tr of tm.tur) { const u = pIn(t, tr.al + 0.55, tr.yirt - 0.3, 0.2); if (u > 0.5) nc.parmak('R', 5 * ease.enter(seg(t, tr.vurgu - 0.04, 0.3)), { yon: -Math.PI / 2 + 0.25, ac: 0.3, toplam: 5 }); }
    if (np.sakak > 0.5) nc.isaret('R', [NX + 52, 978]);
    if (np.parmak > 0.5) nc.parmak('R', 1, { yon: -Math.PI / 2, toplam: 1 });
  }
  M.mekanCiz(K, ODA, 'on', t);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', Pz.defne, 'head'), { son: tm.proof });
}
