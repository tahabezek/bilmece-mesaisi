// Bölüm 29 · İKİ BİR LİRA (v4 "hikâye" dili; storyboard: hikayeler/bolum_029_v5.md).
// Logline: Hikmet Bey iki bir lirayı masaya koyar ve "sınavı hazırlayanları bile yanıltan" soruyu sorar. Defne cetvel
// üstünde bir tur sayar ama yol düz değil, yuvarlaktır.
// Akılda kalacak tek şey: bir para, aynı boydaki paranın çevresinde dolanırken kendi etrafında iki tur döner.
// Üç set aynı dünyada yan yana durur: oda (masa başı, yüzler) · üstten (masa üstü yakın planı; kollar kadrajın
// kenarından girer) · çay ocağı (yuvarlak masa). Kinematik gerçektir: cetvelde yol = R·açı; dolanmada merkezler arası
// 2R ve paranın açısı = 2·φ. Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const ODA = 'b029_oda', UST = 'b029_ust', OCK = 'b029_ocak', BX = 3000, OX = 6000;
// oda: masa izleyiciye doğru yatık çizilir (uzak kenar E); karakterler masanın arkasında
const E = 915, HIK_X = 340, HIK_Y = 1285, DEF_X = 760, DEF_Y = 1211;
const SAY_H = 215, SAY_D = 885;                                  // sayaçta ikisi birer adım açılır
const R = 110, A_S = [330, 1085], A_M = [550, 1085], A_D = [690, 1085], TUT = [578, 622], R_EL = 58;
// üstten: sabit para CS, dolanan paranın başlangıcı MR (sağında, değerek); cetvelin üst kenarı paraların altında
const CS = [BX + 430, 880], MR = [BX + 650, 880], CET_Y = CS[1] + R, YOL = TAU * R;
const H_ORG = [BX + 230, -420], D_ORG = [BX + 2000, 220], D_ORG2 = [BX + 1700, 60], KOL_S = 300;
// çay ocağı: yuvarlak masa; Necmi masanın çevresinde elips üstünde yürür (ψ: 90° = masanın önü)
const TC = [OX + 540, 1500], TY = 1262, RX = 230, RY = 56, NA = 282, NB = 44, PSI0 = 150 * H.D2R;
const SUMEN = '#2B6360', PIRINC = '#D9B24C', GUMUS = '#DEDDD4';

// ——— küçük yardımcılar ———
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const tik = (t, a, d = 0.26) => Math.sin(Math.PI * seg(t, a - d, d));          // kalkıp tam a anında iner (dokunma)
const ekle = (p, d) => [p[0] + d[0], p[1] + d[1]];

// ═══════════════════════════ Nesneler ═══════════════════════════
// 1 lira: pirinç halka, gümüş göbek, portre yok; büyük "1" ve altında taban çizgisi dönüşü okutur
function para(K, [x, y], r, rot = 0, k = 1) {
  const { ctx } = K;
  K.circ(x + 6, y + 9, r * k, INK, 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k * r / 110, k * r / 110);
  K.circ(0, 0, 110, PIRINC, LW);
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; K.line(Math.cos(a) * 93, Math.sin(a) * 93, Math.cos(a) * 104, Math.sin(a) * 104, 4, '#A8832F'); }
  K.circ(0, 0, 76, GUMUS, LW * 0.8);
  K.text('1', -2, 40, 122, INK, 900);
  K.line(-30, 52, 30, 52, 11);
  K.poly([[-11, 84], [11, 84], [0, 100]], INK, 0);
  ctx.restore();
}
// Önkol + el, nesnenin üstüne (masa karakterden sonra çizildiği için masaya uzanan kol altında kalmasın)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Üstten planda kol: kadrajın dışındaki org noktasından ele uzanan yen + el (+ hedefe işaret parmağı)
function uzunKol(K, key, org, el, hedef) {
  const c = H.CARDS[key], { ctx } = K, w = c.arm.w * KOL_S, lw = c.line * KOL_S, u = H.unit(el, org), bilek = [el[0] + u[0] * 44, el[1] + u[1] * 44];
  ctx.save(); ctx.lineCap = 'butt';
  for (const [ww, col] of [[w + lw * 2, INK], [w, c.arm.color]]) H.strokeLine(ctx, org, bilek, ww, col);
  H.strokeLine(ctx, [bilek[0] + u[0] * 12, bilek[1] + u[1] * 12], bilek, w + lw * 2, INK); H.strokeLine(ctx, [bilek[0] + u[0] * 14, bilek[1] + u[1] * 14], [bilek[0] + u[0] * 4, bilek[1] + u[1] * 4], w, c.arm.shade);
  ctx.restore();
  if (hedef) H.isaret(K, key, el, KOL_S, hedef, 1.25); else H.grip(K, key, el, KOL_S);
}
// para pos'undayken ona org yönünden dokunan el: [el, parmak ucu]
const elB = (pos, org) => { const u = H.unit(pos, org); return [[pos[0] + u[0] * R * 1.08, pos[1] + u[1] * R * 1.08], [pos[0] + u[0] * R * 0.74, pos[1] + u[1] * R * 0.74]]; };

function masaA(K) {
  K.rect(-400, E, 1900, 1500, PAL.woodTop, LW);
  for (let i = 0; i < 6; i++) K.line(-400, E + 150 + i * 190, 1500, E + 150 + i * 190, 3, '#B57F47');
  K.rect(-400, E, 1900, 20, '#DDAE72', 0); K.line(-400, E, 1500, E, LW);
  K.rect(130, E + 40, 790, 330, SUMEN, LW, 20);
  K.rect(940, E + 70, 96, 150, PAL.cream, LW * 0.8, 6); for (let i = 0; i < 3; i++) K.line(956, E + 104 + i * 30, 1020, E + 104 + i * 30, 5, '#CFC4AA');   // not defteri
  masaSusu(K, 0, E + 470);
}
// Masanın izleyiciye yakın yarısı (altyazının altı): kâğıtlar, kalem, üstten görünen çay bardağı
function masaSusu(K, x, y) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x + 330, y + 40); ctx.rotate(-0.07); K.rect(0, 0, 330, 420, '#EFE6D2', LW, 6); K.rect(18, -14, 330, 420, PAL.cream, LW, 6); for (let i = 0; i < 7; i++) K.line(52, 50 + i * 48, 310 - (i % 3) * 40, 50 + i * 48, 6, '#CFC4AA'); ctx.restore();
  ctx.save(); ctx.translate(x + 800, y + 150); ctx.rotate(0.5); K.rect(-150, -13, 270, 26, PAL.mustard, LW, 6); K.poly([[120, -13], [166, 0], [120, 13]], '#EBD9B4', LW); K.rect(-150, -13, 40, 26, PAL.coral, LW, 6); ctx.restore();
  K.circ(x + 160, y + 210, 92, PAL.cream, LW); K.circ(x + 160, y + 210, 56, '#F1E6D2', LW * 0.8); K.circ(x + 160, y + 210, 44, '#B5532A', LW * 0.7);
}
function masaB(K) {
  const { ctx } = K; ctx.fillStyle = PAL.woodTop; ctx.fillRect(BX - 1500, -800, 5000, 4000);
  for (let i = 0; i < 16; i++) K.line(BX - 1500, -600 + i * 190, BX + 3500, -600 + i * 190, 3, '#B57F47');
  K.rect(BX + 40, 470, 2500, 830, SUMEN, LW, 26);
  masaSusu(K, BX, 1370); masaSusu(K, BX + 1150, 1390);
}
// Cetvel: (x, y) sol üst; üst kenarı paranın yuvarlandığı düz yol
function cetvel(K, x, y) {
  K.rect(x + 6, y + 9, 1420, 78, INK, 0, 8); K.rect(x, y, 1420, 78, '#F3E2A8', LW, 8);
  for (let i = 1; i < 82; i++) K.line(x + i * 17.28, y + 3, x + i * 17.28, y + (i % 10 === 0 ? 40 : i % 5 === 0 ? 30 : 18), i % 10 === 0 ? 5 : 3, '#6E6248');
}
function bardak(K, x, y) {
  K.ell(x, y, 30, 8, PAL.cream, LW * 0.6);
  K.poly([[x - 17, y - 58], [x + 17, y - 58], [x + 11, y - 34], [x + 18, y - 10], [x + 12, y - 2], [x - 12, y - 2], [x - 18, y - 10], [x - 11, y - 34]], '#B5532A', LW * 0.6);
  K.rect(x - 17, y - 62, 34, 12, '#F1E6D2', LW * 0.5, 3);
}
function yuvarlakMasa(K, t) {
  K.ell(TC[0], 1500, 128, 28, PAL.woodDark, LW); K.rect(TC[0] - 24, TY + 20, 48, 1500 - TY - 24, PAL.wood, LW, 4);
  K.ell(TC[0], TY + 26, RX, RY, PAL.woodDark, LW); K.rect(TC[0] - RX, TY, RX * 2, 26, PAL.woodDark, 0); K.line(TC[0] - RX, TY, TC[0] - RX, TY + 26); K.line(TC[0] + RX, TY, TC[0] + RX, TY + 26);
  K.ell(TC[0], TY, RX, RY, PAL.woodTop, LW);
  K.ell(TC[0], TY - 4, 118, 27, PAL.metal, LW * 0.8);
  bardak(K, TC[0] - 44, TY - 6); bardak(K, TC[0] + 44, TY - 2);
  H.buhar(K, TC[0], TY - 78, t, { k: 0.75, n: 2, ara: 88 });
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [0, 1080], dongu: ['pencerede martı', 'duvar saatinin saniye kolu'],
  capa: { sabit: A_S, donen: A_M, defneOnu: A_D }, kadraj: { masa: [1.0, 540, 960], bahis: [1.1, 560, 950], defne: [1.35, 745, 740] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1600, isik });
    M.pencere(K, 900, 560, 330, 300, { isik, t: t + 5 });
    M.duvarSaati(K, 550, 612, 44, 10.2, t);
    for (let i = 0; i < 5; i++) H.yaprak(K, 70, 880, 170 + (i % 2) * 40, -0.8 + i * 0.42 + 0.04 * Math.sin(t * 1.2 + i), i % 2 ? PAL.green : '#4C8240', 1);
  },
});
M.mekanEkle(UST, { gen: [BX, BX + 2400], dongu: ['kamera kayması', 'paranın dönüşü'], capa: { sabit: CS, donen: MR }, kadraj: { masa: [1.0, BX + 540, 960], cevap: [1.05, BX + 468, 1032] }, arka(K) { masaB(K); } });
M.mekanEkle(OCK, {
  gen: [OX, OX + 1080], dongu: ['çay buharı', 'duvar saatinin saniye kolu'],
  capa: { masa: [TC[0], TY] }, kadraj: { masa: [0.97, OX + 540, 1215] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: OX - 600, x1: OX + 1700, isik, duvar: 'fayans', zemin: 'karo' });
    M.duvarSaati(K, OX + 890, 850, 52, 10.3, t);
    // tezgâh, çaydanlık (döngü: buhar), raf
    K.rect(OX - 60, 1150, 330, 350, PAL.wood, LW); K.rect(OX - 80, 1130, 370, 34, PAL.woodTop, LW, 6);
    for (let i = 0; i < 2; i++) { K.rect(OX - 30 + i * 150, 1196, 130, 250, PAL.woodTop, LW, 6); K.circ(OX + 76 + i * 30, 1320, 8, '#5D6A61', LW * 0.6); }
    K.rect(OX + 60, 1052, 120, 80, PAL.metal, LW, 12); K.rect(OX + 78, 996, 84, 60, PAL.metalDark, LW, 10); K.line(OX + 180, 1080, OX + 222, 1052, 12); K.line(OX + 180, 1080, OX + 222, 1052, 5, PAL.metal);
    H.buhar(K, OX + 120, 986, t, { k: 0.9 });
    K.rect(OX - 80, 820, 330, 20, PAL.woodTop, LW, 5);
    K.rect(OX + 20, 738, 84, 82, PAL.red, LW, 8); K.rect(OX + 130, 764, 66, 56, '#CFE3DD', LW, 10);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05, in: 0.3,
    h1c: T('h1:3') - 0.05, h1y: T('h1:6'),
    h2a: T('h2a'), sabit: T('h2a:2'), oburu: T('h2a:3'), kaymadan: T('h2a:4') - 0.04, yol0: T('h2a:5') - 0.05, yol1: T('h2a:8') + 0.5,
    h2b: T('h2b'), kac: T('h2b:2') - 0.04, atar: T('h2b:4'),
    h3: T('h3'), tik1: T('h3:1') + 0.05, tik2: T('h3:2') + 0.05, senin: T('h3:3'),
    d2: T('d2'), roll0: T('d2:3') - 0.08, roll1: T('d2:7') + 0.14,
    hd: T('hd'), dogru: T('hd:2'), geri: T('hd:3') + 0.1, duzdegil: T('hd:7') - 0.05, yuvarlak: T('hd:8') - 0.04,
    spin: cd0 + 0.55, bak: cd - 1.9, ocak: cd - 1.55,
    clue: T('n1'), tur0: cd - 1.2,   // (11 Kas) tur sayaçta başlar: 23. sn durgundu
    turEt: T('n1:3'), tur1: T('n1:8') + 0.4,
    iki: T('d3:1'),
    y0: T('d4') - 0.02, yari: T('d4>') + 0.05, y1: T('d5') + 0.1, tam: T('d5:6') + 0.3,
    espri: T('h4') - 0.35, it: T('h4') + 0.02, yat: T('h4:7') - 0.05,
    cta: T('d6') - 0.15, kaldir: T('d6') - 0.12,
  };
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, 1.04, 540, 978], [tm.h1c, ...M.kadraj(ODA, 'masa')]] },
    { id: 'ust1', t0: tm.h2a - 0.08, cam: [[0, ...M.kadraj(UST, 'masa')], [tm.h2b - 0.05, 1.05, BX + 545, 955]] },          // bakış kesmesi: masa üstü
    { id: 'bahis', t0: tm.h3 - 0.1, cam: [[0, ...M.kadraj(ODA, 'bahis')]] },
    { id: 'ust2', t0: tm.d2 - 0.12, cam: [[0, ...M.kadraj(UST, 'masa')], [tm.roll0, 1.0, BX + 1040, 960], [tm.geri, 1.0, BX + 540, 960]] },
    { id: 'sayac', t0: tm.cd0 - 0.25, cam: [[0, 1.0, 550, 642], [tm.cd0 + 2.4, 1.03, 550, 646]] },                             // yüzler sayaç halkasının iki yanında
    { id: 'ocak', t0: tm.ocak, cam: [[0, ...M.kadraj(OCK, 'masa')], [tm.clue + 1.6, 1.02, OX + 540, 1210]] },                // bakış kesmesi: ikisi kapıya bakar
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'cevap', t0: tm.proof, cam: [[0, ...M.kadraj(UST, 'cevap')], [tm.y1, 1.07, BX + 464, 1030], [tm.tam + 0.1, 1.1, BX + 470, 1022]] },
    { id: 'espri', t0: tm.espri, cam: [[0, ...M.kadraj(ODA, 'masa')], [tm.yat - 0.15, 1.08, 590, 985]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.4, 690, 735], [tm.cta + 1.5, 1.45, 688, 730]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const hikBase = kisi('hikmet', { x: HIK_X, y: HIK_Y, expr: 'mutlu', head: { tilt: -3, look: [0.5, 0.75] }, ...POZ.rahat });
  const hik = [
    [0.9, { head: { tilt: 4, look: [0.85, 0.1] } }, 0.35],
    [tm.h1c, { expr: 'notr', head: { tilt: -4, look: [0.3, 0.8] } }, 0.3],
    [tm.h1y, { expr: 'mutlu', head: { tilt: 5, look: [0.85, 0.05] } }, 0.3],
    [tm.h3 - 0.1, { expr: 'mutlu', head: { tilt: 3, look: [0.5, 0.75] } }, 0.01],
    [tm.senin, { head: { tilt: 6, look: [0.9, 0.1] } }, 0.25],
    [tm.cd0 - 0.25, { x: SAY_H, expr: 'mutlu', head: { tilt: -2, look: [0.85, 0.1] } }, 0.01],
    [tm.spin + 1.95, { head: { tilt: 6, look: [0.85, 0.1] }, ...POZ.ikaz }, 0.3, ease.enter],                                 // "olmadı": parmak sallar
    [tm.bak, { expr: 'notr', armR: POZ.rahat.armR, head: { tilt: 4, look: [0.95, 0] } }, 0.25],                            // kapıya bakar
    [tm.buldum - 0.05, { x: HIK_X }, 0.01],
    [tm.espri, { expr: 'notr', lean: 6, head: { tilt: 2, look: [0.5, 0.75] } }, 0.01],
    [tm.yat - 0.1, { expr: 'yorgun', lean: 0, head: { tilt: 8, look: [0.7, 0.7] } }, 0.3],
    [tm.cta, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.1] } }, 0.3],
  ];
  const defBase = kisi('defne', { x: DEF_X, y: DEF_Y, expr: 'saskin', head: { tilt: -4, look: [-0.7, 0.65] }, ...POZ.dur });
  const def = [
    [0.8, { head: { tilt: 5, look: [-0.85, 0.1] } }, 0.4],
    [T('h1:4'), { head: { tilt: -5, look: [-0.6, 0.75] } }, 0.3],
    [tm.h3 - 0.1, { expr: 'notr', head: { tilt: 3, look: [-0.7, 0.65] } }, 0.01],
    [tm.senin - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [-0.85, 0.1] } }, 0.25],
    [tm.cd0 - 0.25, { x: SAY_D, expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -6, look: [-0.5, -0.5] } }, 0.01],
    [tm.spin + 0.5, { head: { tilt: 7, look: [0.4, -0.6] } }, 0.35],
    [tm.spin + 1.35, { armR: POZ.dur.armR, head: { tilt: -4, look: [-0.75, 0.2] } }, 0.3],                                      // parmağıyla sayar: bir…
    [tm.spin + 2.35, { expr: 'notr', head: { tilt: 5, look: [-0.3, 0.5] } }, 0.3],
    [tm.bak, { armR: POZ.dur.armR, head: { tilt: 5, look: [0.95, 0] } }, 0.25],                                              // kapıya bakar; 10 kare sonra kesme
    [tm.buldum - 0.06, { x: DEF_X }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.espri, { expr: 'mutlu', armR: POZ.dur.armR, lean: -6, head: { tilt: -4, look: [-0.7, 0.7] } }, 0.01],
    [tm.yat, { head: { tilt: 5, look: [-0.85, 0.2] } }, 0.3],
    [tm.cta - 0.05, { lean: 0, head: { tilt: 7, look: [-0.1, 0.05] } }, 0.35],
  ];
  return { tm, film, hik, hikBase, def, defBase };
}

// ═══════════════════════════ t anındaki durumlar ═══════════════════════════
// Oda: dolanan para (kare 0'da yerine kayar · sayaçta Defne fiskeyle döndürür · espride Defne'ye kayar, "1" yatar · çağrıda elde)
function paraOda(t, tm) {
  if (t < tm.cd0 - 0.3) return { p: H.dus(t, 0, tm.in, [A_M[0] + 78, A_M[1] - 30], A_M), r: R, rot: 0, k: 1 + 0.07 * (H.nabiz(t, tm.in) + H.nabiz(t, tm.tik1) + H.nabiz(t, tm.tik2)) };
  if (t < tm.espri) return { p: A_M, r: R, rot: TAU * 2 * ease.state(seg(t, tm.spin, 1.7)), k: 1 };
  const u = ease.state(seg(t, tm.kaldir, 0.7)), kay = ease.enter(seg(t, tm.it + 0.12, 0.6));
  const yer = [lerp(A_M[0], A_D[0], kay), A_M[1]];
  return { p: H.yay(yer, TUT, u, 40), r: lerp(R, R_EL, u), rot: Math.PI / 2 * ease.state(seg(t, tm.yat, 0.5)) * (1 - u), k: 1, u };
}
// Üstten: dolanan para. Cetvelde yol = R·açı (kaymadan); dolanmada merkez CS çevresinde φ, para kendi etrafında 2φ.
function paraUst(t, tm, id) {
  if (id === 'ust1') return { p: MR, rot: 0.3 * Math.sin(TAU * seg(t, tm.kac + 0.05, 0.8)), k: 1 + 0.07 * (H.nabiz(t, tm.oburu) + H.nabiz(t, tm.kac)) };
  if (id === 'ust2') {
    const yol = YOL * ease.state(seg(t, tm.roll0, tm.roll1 - tm.roll0)), son = [MR[0] + YOL, MR[1]];
    if (t < tm.geri) return { p: [MR[0] + yol, MR[1]], rot: yol / R, yol, k: 1 };
    return { p: H.yay(son, MR, ease.state(seg(t, tm.geri, 0.8)), 70), rot: 0, yol: YOL, k: 1 };
  }
  const fi = -Math.PI * (ease.state(seg(t, tm.y0, tm.yari - tm.y0)) + ease.state(seg(t, tm.y1, tm.tam - tm.y1)));
  return { p: [CS[0] + 2 * R * Math.cos(fi), CS[1] + 2 * R * Math.sin(fi)], rot: 2 * fi, fi, k: 1 + 0.06 * (H.nabiz(t, tm.yari) + H.nabiz(t, tm.tam)) };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'ust1' || id === 'ust2' || id === 'cevap') ustSahne(K, t, S, B);
    else if (id === 'ocak') ocakSahne(K, t, tl, S, B);
    else odaSahne(K, t, tl, S, B);
  },
  ekran(K, t, { ekr, sc }) {
    const { tm } = S, id = sc.id;
    if (id === 'ust1') {
      H.tag(K, t, tm.sabit, tm.h2b - 0.1, ekr([CS[0], CS[1] + 166]), K.up('sabit'), INK, PAL.paper, 46, [tm.sabit]);
      H.tag(K, t, tm.kaymadan, tm.kac - 0.2, ekr([BX + 772, 642]), K.up('kaymadan'), PAL.mustard, INK, 46);
      H.tag(K, t, tm.kac, tm.h3 - 0.32, ekr([BX + 772, 642]), K.up('kaç tur?'), PAL.coral, PAL.paper, 50, [tm.atar]);
    }
    if (id === 'ust2') {
      const p = ekr([MR[0] + YOL - 150, CS[1] - 178]), hw = H.tag(K, t, tm.roll1, tm.geri - 0.12, p, K.up('1 tur'), PAL.mustard, INK, 50);
      H.mark(K, t, tm.dogru, tm.geri - 0.12, [p[0] + hw + 38, p[1]], true);
    }
    if (id === 'cevap') {
      const hw = H.adimEtiket(K, t, [[tm.yari, K.up('1 tur'), PAL.mustard, INK], [tm.tam, K.up('2 tur'), PAL.green, PAL.paper]], tm.espri - 0.22, [268, 372], 64);
      H.mark(K, t, tm.tam + 0.22, tm.espri - 0.22, [268 + hw + 44, 372], true);
    }
  },
});

// ——— oda: masa başı (yüzler) ———
function odaSahne(K, t, tl, S, { heads, sc }) {
  const { tm } = S, T = e => H.at(tl, e), hop = H.buldumHop(t, tm.buldum), mv = paraOda(t, tm), ust = [];
  M.mekanCiz(K, ODA, 'arka', t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= hop;
  // Hikmet'in sağ eli: kare 0'da parayı yerine iter · bahiste paraya iki kez dokunur · espride fiskeyle Defne'ye yollar
  const w0 = 1 - W(t, 0.85, 0.3), wT = pw(t, tm.h3 - 0.4, tm.senin + 0.3), wI = pw(t, tm.espri - 0.4, tm.it + 0.6);
  const wH = Math.max(w0, wT, wI), kalk = 26 * (tik(t, tm.tik1) + tik(t, tm.tik2)) + 30 * tik(t, tm.it + 0.12, 0.2);
  H.reach('hikmet', hp, 'R', [Math.min(mv.p[0] - 14, 566), mv.p[1] - R * 0.8 - kalk], wH);
  if (wH > 0.5) ust.push(a => { kolUst(K, 'hikmet', hp, 'R'); a.h.isaret('R', [mv.p[0] - 10, mv.p[1] - R * 0.45]); });
  // Defne'nin sol eli: sayaçta parayı fiskeyle döndürür · espride gelen parayı karşılar · çağrıda kaldırır
  const wS = 0, wA = t >= tm.espri ? W(t, tm.it + 0.4, 0.3) : 0, u = mv.u || 0;
  if (wS > 0) H.reach('defne', dp, 'L', [mv.p[0] + 64, mv.p[1] - R * 0.8], wS);
  if (wA > 0) H.reach('defne', dp, 'L', [mv.p[0] + 14 * (1 - u), mv.p[1] + lerp(-0.8, 0.85, u) * mv.r], wA, 'A');
  if (wS > 0.5) ust.push(a => { kolUst(K, 'defne', dp, 'L'); a.d.isaret('L', [mv.p[0] + 30, mv.p[1] - R * 0.4]); });
  if (wA > 0.5) ust.push(() => kolUst(K, 'defne', dp, 'L'));

  const h = oyna(K, t, tl, 'hikmet', hp, { heads });
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const d = oyna(K, t, tl, 'defne', dp, { heads });
  if (sc.id === 'buldum') d.parmak('R', 2 * ease.enter(seg(t, tm.iki - 0.06, 0.25)), { toplam: 2, ac: 0.55 });   // "İki tur!": iki parmak

  masaA(K);
  para(K, A_S, R, 0, 1 + 0.07 * H.nabiz(t, tm.in + 0.02));
  para(K, mv.p, mv.r, mv.rot, mv.k);
  for (const f of ust) f({ h, d });
  void T;
}

// ——— üstten: masa üstü yakın planı (paralar, cetvel, kadrajın kenarından giren kollar) ———
function ustSahne(K, t, S, { heads, sc, cam }) {
  const { tm } = S, { ctx } = K, id = sc.id, mv = paraUst(t, tm, id);
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.hikmet = ekrandan(30, 430); heads.defne = ekrandan(1050, 430);   // konuşanlar kadraj dışında: balon kuyruğu onlara yatar
  M.mekanCiz(K, UST, 'arka', t);

  if (id === 'ust1') {   // paranın gideceği yol: sabit paranın çevresinde kesik çizgili tam tur (saat yönünün tersine)
    const v = ease.state(seg(t, tm.yol0, tm.yol1 - tm.yol0)), a0 = -0.62, a1 = a0 - (TAU - 1.24) * v;
    if (v > 0.01) {
      ctx.save(); ctx.lineCap = 'butt'; ctx.setLineDash([30, 20]); ctx.beginPath(); ctx.arc(CS[0], CS[1], 2 * R, a0, a1, true); ctx.lineWidth = 11; ctx.strokeStyle = PAL.cream; ctx.stroke(); ctx.restore();
      const p = [CS[0] + 2 * R * Math.cos(a1), CS[1] + 2 * R * Math.sin(a1)], tg = [Math.sin(a1), -Math.cos(a1)], n = [-tg[1], tg[0]];
      K.poly([[p[0] + tg[0] * 40, p[1] + tg[1] * 40], [p[0] + n[0] * 26, p[1] + n[1] * 26], [p[0] - n[0] * 26, p[1] - n[1] * 26]], PAL.cream, LW * 0.8);
    }
  }
  if (id === 'ust2') {   // cetvel sağdan girer; "düz değil"de aşağı çekilir. Üst kenarında paranın aldığı yol mercanla işaretlenir.
    const gir = 1 - ease.enter(seg(t, tm.d2 - 0.1, 0.4)), cik = ease.state(seg(t, tm.duzdegil, 0.45)), cx = BX + 150 + 1100 * gir, cy = CET_Y + 520 * cik;
    cetvel(K, cx, cy);
    if (mv.yol > 2) { ctx.save(); ctx.lineCap = 'round'; H.strokeLine(ctx, [MR[0], cy + 4], [MR[0] + mv.yol, cy + 4], 18, INK); H.strokeLine(ctx, [MR[0], cy + 4], [MR[0] + mv.yol, cy + 4], 10, PAL.coral); ctx.restore(); }
  }
  if (id === 'cevap' && mv.fi < -0.01) {   // dolanmanın izi: merkezin çizdiği yay
    ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(CS[0], CS[1], 2 * R, 0, mv.fi, true); ctx.lineWidth = 10; ctx.strokeStyle = PAL.cream; ctx.globalAlpha = 0.85; ctx.setLineDash([4, 22]); ctx.stroke(); ctx.restore();
  }
  para(K, CS, R, 0, 1 + 0.06 * H.nabiz(t, tm.sabit));
  if (id === 'ust2' && t >= tm.yuvarlak) {   // "yuvarlak": yol sabit paranın kenarıdır
    const v = ease.state(seg(t, tm.yuvarlak, 0.5));
    ctx.save(); ctx.lineCap = 'round'; for (const [w, col] of [[20, INK], [12, PAL.coral]]) { ctx.beginPath(); ctx.arc(CS[0], CS[1], R + 15, 0, -TAU * v, true); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); } ctx.restore();
  }
  para(K, mv.p, R, mv.rot, mv.k);
  if (id === 'cevap') {   // "1" yeniden dimdik: yeşil halka (yarı yolda ve başa dönünce)
    const a = Math.min(1, H.nabiz(t, tm.yari, 0.7) + (t >= tm.tam ? Math.max(0.75, H.nabiz(t, tm.tam, 0.5)) : 0));
    if (a > 0.02) { ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(mv.p[0], mv.p[1], R + 17, 0, TAU); ctx.lineWidth = 13; ctx.strokeStyle = PAL.green; ctx.stroke(); ctx.restore(); }
  }

  // ——— eller ———
  const uzak = (el, org, w) => { const u = H.unit(el, org); return [el[0] + u[0] * 700 * (1 - w), el[1] + u[1] * 700 * (1 - w)]; };
  if (id === 'ust1') {   // Hikmet: sabit paraya, sonra öbürüne dokunur
    const hedef = H.iz([[0, CS], [tm.oburu - 0.34, MR, 0.3, ease.state, 34]], t), [el, uc] = elB(hedef, H_ORG);
    const kalk = 26 * (tik(t, tm.sabit) + tik(t, tm.oburu) + tik(t, tm.kac) + tik(t, tm.atar + 0.1));
    uzunKol(K, 'hikmet', H_ORG, [el[0] - kalk * 0.5, el[1] - kalk], [uc[0] - kalk * 0.3, uc[1] - kalk * 0.6]);
  }
  if (id === 'ust2') {
    const wD = W(t, tm.d2 - 0.1, 0.32) * (1 - W(t, tm.geri - 0.25, 0.3)), wHk = W(t, tm.geri - 0.42, 0.34);
    if (wD > 0.01) { const [el, uc] = elB(mv.p, D_ORG), e2 = uzak(el, D_ORG, wD); uzunKol(K, 'defne', D_ORG, e2, wD > 0.9 ? uc : null); }
    if (wHk > 0.01) {   // Hikmet parayı alıp sabit paranın yanına geri koyar, sonra parmağı sabit paranın kenarında
      const v = W(t, tm.duzdegil - 0.1, 0.32), hedef = [lerp(mv.p[0], CS[0], v), lerp(mv.p[1], CS[1], v)], [el, uc] = elB(hedef, H_ORG), e2 = uzak(el, H_ORG, wHk);
      uzunKol(K, 'hikmet', H_ORG, e2, wHk > 0.9 ? uc : null);
    }
  }
  if (id === 'cevap') {   // Defne parmağıyla parayı sabit paranın çevresinde yuvarlar
    const w = W(t, tm.proof + 0.02, 0.3) * (1 - W(t, tm.tam + 0.3, 0.35));
    const ac = mv.fi + 0.5, org = [CS[0] + 1700 * Math.cos(ac), CS[1] + 1700 * Math.sin(ac)];   // kol dışarıdan, paranın bir adım gerisinden gelir: sabit paranın üstünden geçmez
    if (w > 0.01) { const [el, uc] = elB(mv.p, org), e2 = uzak(el, org, w); uzunKol(K, 'defne', org, e2, w > 0.9 ? uc : null); }
  }
}

// ——— çay ocağı: Necmi, eli masanın kenarında, masanın çevresinde bir tur atar ———
function necmiAt(t, tm) {
  const u0 = seg(t, tm.tur0, tm.tur1 - tm.tur0), u = lerp(u0, ease.state(u0), 0.35), psi = PSI0 - TAU * u, c = Math.cos(psi), s = Math.sin(psi);
  const x = TC[0] + NA * c, y = TC[1] + NB * s, sc = 225 * (1 + 0.05 * s), yuruyor = u0 > 0 && u0 < 1, onden = !yuruyor || (c < -0.9 && u > 0.5);
  let p, el;
  if (onden) {   // masanın sol ucunda bize doğru gelir (ve turdan önce / sonra durur)
    p = kisi('necmi', { x, y, s: sc, expr: 'mutlu', head: { tilt: -4, look: [0.55, yuruyor ? 0.1 : 0.35] }, ...POZ.rahat });
    const sil = u0 <= 0 ? [26 + 30 * Math.cos(t * 7.5), 10 * Math.sin(t * 7.5)] : [0, 0];   // turdan önce masayı siler
    el = [TC[0] + (RX - 22) * Math.cos(psi + 0.05) + sil[0], TY + (RY - 8) * Math.sin(psi + 0.05) + sil[1]];
  } else {
    const C = H.CARDS.necmi, cyc = 4 * (C.leg.upper + C.leg.lower) * sc * Math.sin(24 * H.D2R), d = NA * TAU * u, k = C.stance?.knee || 0;
    const amp = ease.state(clamp01(Math.min(d, NA * TAU - d) / (cyc * 0.16))), ph = d / cyc * TAU;
    const leg = f => ({ hip: Math.sin(f) * 24 * amp + k * 0.5, knee: k + (Math.max(0, Math.sin(f + Math.PI * 0.55)) * 38 + 4) * amp });
    p = kisi('necmi', {
      view: 'side', facing: s >= 0 ? 1 : -1, x, y, s: sc, lean: 4 * amp, bob: (0.035 - Math.abs(Math.cos(ph)) * 0.035) * amp, expr: 'mutlu',
      legL: leg(ph), legR: leg(ph + Math.PI), armL: { sh: -Math.sin(ph) * 20 * amp, el: 12 }, armR: { sh: 6, el: 10 }, head: { tilt: 2, look: [0.6, 0.1] },
    });
    el = [TC[0] + (RX - 16) * Math.cos(psi + 0.5), TY + (RY - 6) * Math.sin(psi + 0.5)];   // el masanın kenarında, bir adım geride
  }
  return { p, el, u, psi, arkada: s < -0.02 };
}
function ocakSahne(K, t, tl, S, { heads }) {
  const { tm } = S, { ctx } = K, n = necmiAt(t, tm);
  M.mekanCiz(K, OCK, 'arka', t);
  // yerdeki iz: yürüdükçe yön okları (bir turda dört yöne de döner)
  const N = 32; ctx.save(); ctx.globalAlpha = 0.9;
  for (let i = 1; i <= N; i++) {
    const ui = i / N; if (lerp(ui, ease.state(ui), 0.35) > n.u - 0.035) break;
    const a = PSI0 - TAU * lerp(ui, ease.state(ui), 0.35), p = [TC[0] + (NA + 4) * Math.cos(a), TC[1] + NB * Math.sin(a) + 10], tg = H.unit([0, 0], [NA * Math.sin(a), -NB * Math.cos(a)]), nr = [-tg[1] * 0.6, tg[0]];
    for (const m of [1, -1]) K.line(p[0] + tg[0] * 15, p[1] + tg[1] * 8, p[0] - tg[0] * 9 + m * nr[0] * 16, p[1] - tg[1] * 5 + m * nr[1] * 16, 7, PAL.cream);
  }
  ctx.restore();
  const ciz = () => oyna(K, t, tl, 'necmi', n.p, { heads, R: [n.el, 1] });
  let a;
  if (n.arkada) { a = ciz(); yuvarlakMasa(K, t); } else { yuvarlakMasa(K, t); a = ciz(); }
  K.rect(a.handR[0] - 30, a.handR[1] - 6, 60, 26, PAL.cream, LW * 0.7, 8);   // bez
  a.tut('R');
}
