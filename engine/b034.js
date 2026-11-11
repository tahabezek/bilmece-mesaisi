// Bölüm 34 · ÇAY İLE SÜT (v4 "hikâye" dili; storyboard: hikayeler/bolum_034_v5.md).
// Logline: Hikmet ile Necmi bir kaşık süt yüzünden üç gündür küstür. Defne iki tabak ve bir avuç şekerle ikisini de
// barıştırır: ikisi de yanılmıştır.
// Akılda kalacak tek şey: bardaklar ilk hâli kadar doluysa, süt bardağından eksilen süt kadar oraya çay gelmiştir.
// Üç set aynı dünyada yan yana durur: ocak (pencere önündeki bar tezgâhı, yüzler; Necmi'nin çay arabası) · yakın
// (iki bardağın yandan yakın planı; kollar kadrajın kenarından girer) · üstten (tezgâhın üstü: iki tabak şeker).
// Sıvı hacmi gerçektir: kaşık = 0,06 bardak seviyesi; çay bardağı önce bir kaşık yükselir, sonra bir kaşık iner, süt
// bardağı tersine. Şekerde 3 beyaz gider, 2 beyaz + 1 koyu döner; sonunda iki tabakta da 10 küp, birer yabancı küp.
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const OCK = 'b034_ocak', YAK = 'b034_yakin', UST = 'b034_ust', BX = 3000, CX = 6000;
// ocak: bar tezgâhı (üst yüz 1160–1192, ön yüz karakterlerin önünde), bardaklar ve şekerlik tezgâhın üstünde
const BAR = 1232, BAR_X0 = 110, BAR_X1 = 940, GK = 2.5, G_CAY = [465, 1230], G_SUT = [625, 1230], SEK = [790, 1230];
const HIK_X = 330, DEF_X = 800, NEC_X = 1010, SAY_H = 180, SAY_D = 885, IP_H = 40, IP_D = 1040, IP_N = 545, ES_H = 300, ES_N = 740, ES_D = 945;
const TAB_C = [815, 1230], TAB_S = [925, 1230];
// yakın: iki büyük bardak (taban YB), kaşık; kollar kadrajın dışından
const YB = 1180, YK = 6.6, Y_CAY = [BX + 330, YB], Y_SUT = [BX + 750, YB];
const H_ORG = [BX - 360, 230], D_ORG = [BX + 1460, 240];
// üstten: iki tabak (çay solda, süt sağda), küpler 2 × 5 ızgarada
const PC = [CX + 300, 1020], PS = [CX + 780, 1020], PRX = 245, PRY = 168, KS = 58, C_ORG = [CX + 1520, 1820], KOL_S = 300;
// renkler
const CAY = '#A5491A', SUT = '#F5EEDC', KUP_K = ['#7B4320', '#5C2F15', '#9A5A2E'], KUP_B = ['#FBF8F1', '#D8D0BF', '#FFFFFF'];
const L0 = 0.76, KASIK = 0.06;                                    // bardağın ilk seviyesi; bir kaşığın seviye karşılığı

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const tik = (t, a, d = 0.24) => Math.sin(Math.PI * seg(t, a - d, d));          // kalkıp tam a anında iner (dokunma)
const ekle = (p, d) => [p[0] + d[0], p[1] + d[1]];

// ═══════════════════════════ Nesneler ═══════════════════════════
// İnce belli çay bardağı: (x, y) taban ortası, k ölçek (k = 1'de 62 px boy). İç hattı sivi() ile dolar.
const GOVDE = [[-18, -62], [18, -62], [11, -36], [19, -11], [13, -2], [-13, -2], [-19, -11], [-11, -36]];
function bardak(K, x, y, k, { sev = L0, renk = CAY, bulut = null, tabak = true, kasikIc = null, buhar = 0, t = 0, yesil = 0 } = {}) {
  const { ctx } = K, yol = c => { GOVDE.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.closePath(); };
  if (buhar > 0) H.buhar(K, x, y - 66 * k, t, { k: buhar, n: 2, ara: 9 * k });
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (tabak) K.ell(0, 0, 34, 9, PAL.cream, 6 / k * 0.7 + 0.4);
  ctx.beginPath(); yol(ctx); ctx.fillStyle = 'rgba(244,237,224,0.34)'; ctx.fill();
  ctx.restore();
  if (kasikIc) kasikIc();                                          // bardağın içindeki kaşık: sıvının arkasında kalır
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  H.sivi(K, yol, [-18, -62, 36, 60], { seviye: sev, renk, bulut });
  if (yesil > 0.02) { ctx.save(); ctx.globalAlpha = yesil; ctx.setLineDash([5, 3.4]); const ys = -2 - 60 * L0; ctx.beginPath(); ctx.moveTo(-26, ys); ctx.lineTo(26, ys); ctx.lineWidth = 3.2; ctx.strokeStyle = PAL.green; ctx.stroke(); ctx.restore(); }
  ctx.beginPath(); yol(ctx); K.fs(null, Math.max(0.8, 6.5 / k));
  K.line(-12, -54, -9, -20, Math.max(0.9, 4 / k), 'rgba(255,255,255,0.7)');
  ctx.restore();
}
// Seviye fraksiyonu → dünya y (bardağın sıvı yüzeyi)
const yuzeyY = (y, k, sev) => y + (-2 - 60 * sev) * k;
// Kaşık: kase (bx, by), sap kaseden `a` yönünde L boyunda; br kase yarıçapı; ic (0..1) içindeki sıvı, renk
function kasik(K, [bx, by], a, L, br, { ic = 0, renk = SUT, isik = 0 } = {}) {
  const { ctx } = K, ca = Math.cos(a), sa = Math.sin(a), lw = Math.max(3, br * 0.11);
  const uc = [bx + ca * L, by + sa * L], kok = [bx + ca * br * 0.95, by + sa * br * 0.95];
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, kok, uc, br * 0.34 + lw * 2, INK); H.strokeLine(ctx, kok, uc, br * 0.34, '#C9D3CC');
  ctx.translate(bx, by); ctx.rotate(a);
  K.ell(0, 0, br, br * 0.62, '#C9D3CC', lw);
  if (ic > 0.02) K.ell(-br * 0.06, 0, br * 0.78 * Math.sqrt(ic), br * 0.46 * Math.sqrt(ic), renk, lw * 0.6);
  if (isik > 0.02) { ctx.globalAlpha = isik; K.ell(-br * 0.25, -br * 0.18, br * 0.22, br * 0.1, '#FFFFFF', 0); }
  ctx.restore();
  return { uc, agiz: [bx - ca * br * 0.95, by - sa * br * 0.95] };
}
// Şeker küpü (üstten, hafif eğik): üst yüz + ön yüz. (x, y) üst yüzün ortası; s kenar
function kup(K, [x, y], s, beyaz, { yesil = 0, kalk = 0 } = {}) {
  const c = beyaz ? KUP_B : KUP_K, lw = Math.max(2.2, s * 0.08), yy = y - kalk;
  if (kalk > 0.5) { K.ctx.save(); K.ctx.globalAlpha = 0.18; K.rect(x - s / 2 + 6, y - s * 0.35 + 12, s, s * 0.95, INK, 0, s * 0.12); K.ctx.restore(); }
  K.rect(x - s / 2, yy - s * 0.35 + s * 0.62, s, s * 0.36, c[1], lw, s * 0.1);
  K.rect(x - s / 2, yy - s * 0.35, s, s * 0.7, c[0], lw, s * 0.12);
  if (beyaz) { K.circ(x - s * 0.18, yy - s * 0.08, s * 0.05, '#E7E0D0', 0); K.circ(x + s * 0.16, yy + s * 0.1, s * 0.05, '#E7E0D0', 0); }
  else K.line(x - s * 0.3, yy - s * 0.2, x - s * 0.05, yy - s * 0.2, lw * 0.8, c[2]);
  if (yesil > 0.02) { const { ctx } = K; ctx.save(); ctx.globalAlpha = yesil; ctx.beginPath(); ctx.roundRect(x - s / 2 - 13, yy - s * 0.35 - 13, s + 26, s * 1.06 + 26, s * 0.3); ctx.lineWidth = 10; ctx.strokeStyle = PAL.green; ctx.stroke(); ctx.restore(); }
}
// Önkol + el, nesnenin üstüne (tezgâh karakterden sonra çizildiği için)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Kadrajın dışındaki org noktasından ele uzanan yen + el (hedef varsa işaret parmağı)
function uzunKol(K, key, org, el, hedef) {
  const c = H.CARDS[key], { ctx } = K, w = c.arm.w * KOL_S, lw = c.line * KOL_S, u = H.unit(el, org), bilek = [el[0] + u[0] * 44, el[1] + u[1] * 44];
  ctx.save(); ctx.lineCap = 'butt';
  for (const [ww, col] of [[w + lw * 2, INK], [w, c.arm.color]]) H.strokeLine(ctx, org, bilek, ww, col);
  H.strokeLine(ctx, [bilek[0] + u[0] * 12, bilek[1] + u[1] * 12], bilek, w + lw * 2, INK); H.strokeLine(ctx, [bilek[0] + u[0] * 14, bilek[1] + u[1] * 14], [bilek[0] + u[0] * 4, bilek[1] + u[1] * 4], w, c.arm.shade);
  ctx.restore();
  if (hedef) H.isaret(K, key, el, KOL_S, hedef, 1.25); else H.grip(K, key, el, KOL_S);
}
// Küçük tabak ve üstünde 2 × 5 minik küp (ocak görünüşü); yabanci: kaçıncı küp öteki renkte
function minikTabak(K, [x, y], beyaz, yabanci = -1) {
  K.ell(x, y - 3, 58, 15, PAL.cream, LW * 0.7); K.ell(x, y - 6, 42, 10, '#EFE6D2', LW * 0.4);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const i = r * 5 + c, b = i === yabanci ? !beyaz : beyaz; kup(K, [x - 36 + c * 18, y - 14 - r * 9 + (r ? 0 : 0)], 15, b); }
}
// Şekerlik (ocak görünüşü)
function sekerlik(K, [x, y], eksik = 0) {
  K.poly([[x - 40, y - 46], [x + 40, y - 46], [x + 32, y - 4], [x - 32, y - 4]], '#CFE3DD', LW * 0.8);
  for (let i = 0; i < 4 - eksik; i++) kup(K, [x - 24 + i * 16, y - 50 - (i % 2) * 6], 16, true);
  K.ell(x, y - 2, 40, 8, PAL.cream, LW * 0.6);
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(OCK, {
  gen: [0, 1300], dongu: ['pencerede martı', 'çay arabasında çaydanlık buharı'],
  capa: { cay: G_CAY, sut: G_SUT, seker: SEK }, kadraj: { genis: [1.0, 620, 1100], defne: [1.35, 815, 1010] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1900, isik, duvar: 'fayans', zemin: 'karo' });
    M.pencere(K, 250, 520, 560, 400, { isik, t: t + 4 });
    M.duvarSaati(K, 1010, 560, 46, 15.2, t);
    // Necmi'nin çay arabası (sağda): iki raf, çift demlik, buhar döngüsü
    K.rect(1060, 1150, 300, 26, PAL.metalDark, LW, 6); K.rect(1060, 1360, 300, 22, PAL.metalDark, LW, 6);
    K.line(1074, 1176, 1074, 1460, 12); K.line(1074, 1176, 1074, 1460, 5, PAL.metal); K.line(1346, 1176, 1346, 1460, 12); K.line(1346, 1176, 1346, 1460, 5, PAL.metal);
    K.circ(1090, 1478, 18, INK, 0); K.circ(1330, 1478, 18, INK, 0);
    K.poly([[1150, 1148], [1250, 1148], [1240, 1074], [1160, 1074]], PAL.metal, LW); K.poly([[1168, 1072], [1232, 1072], [1240, 1046], [1226, 1018], [1174, 1018], [1160, 1046]], PAL.red, LW * 0.8);
    K.line(1150, 1110, 1120, 1086, 10); H.buhar(K, 1200, 1006, t, { k: 0.85 });
    for (let i = 0; i < 4; i++) bardak(K, 1100 + i * 66, 1358, 1.15, { sev: 0, tabak: true });
  },
  on(K) {   // bar tezgâhı: üst yüz, ön kenar, ön yüz (karakterlerin bacaklarını örter)
    K.rect(BAR_X0 - 20, BAR - 30, BAR_X1 - BAR_X0 + 40, 32, PAL.woodTop, LW, 6);
    K.rect(BAR_X0, BAR + 2, BAR_X1 - BAR_X0, 26, PAL.woodDark, LW, 0);
    K.rect(BAR_X0 + 10, BAR + 28, BAR_X1 - BAR_X0 - 20, 560, PAL.wood, LW, 0);
    for (let i = 0; i < 4; i++) K.rect(BAR_X0 + 40 + i * 205, BAR + 60, 170, 230, '#B07A44', LW * 0.8, 10);
  },
});
M.mekanEkle(YAK, {
  gen: [BX - 400, BX + 1500], dongu: ['çay buharı', 'pencerede martı'],
  capa: { cay: Y_CAY, sut: Y_SUT }, kadraj: { bardak: [1.0, BX + 540, 960] },
  arka(K, t, { isik }) {
    const { ctx } = K; ctx.fillStyle = '#CFE3DD'; ctx.fillRect(BX - 900, -400, 2900, 2800);
    for (let i = 0; i < 18; i++) K.line(BX - 900 + i * 170, -400, BX - 900 + i * 170, YB - 40, 4, '#B4CEC7');
    for (let j = 0; j < 14; j++) K.line(BX - 900, -400 + j * 170, BX + 2000, -400 + j * 170, 4, '#B4CEC7');
    M.pencere(K, BX - 330, 470, 470, 470, { isik, t: t + 2 });
    K.rect(BX - 900, YB - 40, 2900, 1300, PAL.woodTop, LW, 0);
    for (let i = 0; i < 6; i++) K.line(BX - 900, YB + 30 + i * 120, BX + 2000, YB + 30 + i * 120, 3, '#B57F47');
  },
  isik(K) {   // pencereden düşen ışık şeridi (düz renkli çokgen)
    H.isikSeridi(K, [[BX - 110, 470], [BX + 140, 470], [BX + 760, 760], [BX + 470, 760]], { renk: '#FFF4D6', a: 0.22 });
  },
});
M.mekanEkle(UST, {
  gen: [CX - 200, CX + 1300], dongu: ['çay buharı', 'pencere ışığının kayması'],
  capa: { cay: PC, sut: PS }, kadraj: { tabak: [1.0, CX + 540, 960] },
  arka(K, t) {
    const { ctx } = K; ctx.fillStyle = PAL.woodTop; ctx.fillRect(CX - 900, -400, 2900, 2800);
    for (let i = 0; i < 18; i++) K.line(CX - 900, -380 + i * 160, CX + 2000, -380 + i * 160, 3, '#B57F47');
    // bardaklar üstten: çay ve süt (hikâyenin bardakları), çayda buhar
    for (const [x, r] of [[PC[0] + 40, CAY], [PS[0] - 40, H.mixHex(SUT, CAY, 0.136)]]) {
      K.circ(x + 8, 608, 92, INK, 0); K.circ(x, 600, 92, PAL.cream, LW); K.circ(x, 600, 64, '#EFE6D2', LW * 0.7); K.circ(x, 600, 52, r, LW * 0.6);
    }
    H.buhar(K, PC[0] + 40, 584, t, { k: 0.8, n: 2, ara: 30 });
  },
  isik(K, t) { const kay = 60 * Math.sin(t * 0.5); H.isikSeridi(K, [[CX - 300 + kay, 300], [CX + 60 + kay, 300], [CX + 900 + kay, 1700], [CX + 540 + kay, 1700]], { renk: '#FFF4D6', a: 0.13 }); },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05, tap: 0.3,
    h1n: T('h1:3'), kus: T('h1:6'),
    h2a: T('h2a'), cizgi: T('h2a:5') - 0.04, dip1: T('h2a:6'), pour1: T('h2a:10'),
    h2b: T('h2b'), lift2: T('h2b:1') + 0.25, pour2: T('h2b:5'),
    h2c: T('h2c'), gCay: T('h2c:1'), gSut: T('h2c:4'),
    d2: T('d2'), dip3: T('d2') + 0.3, isik: T('d2:2'), az: T('d2:5'),
    hd: T('hd'), sutK: T('hd:1'), geri: T('hd>') - 0.15,
    sayac: T('hd>') + 0.18, seker: cd0 + 0.9, bak: cd - 1.9, ipucu: cd - 1.55,
    n1: T('n1'), al: cd - 1.1, ilk: T('n1:4'), dolu: T('n1:7'),
    cevap: T('d3:2') - 0.1,
    k1: T('d3:2') + 0.24, d1: T('d4:1') + 0.02, kar: T('d4:1') + 0.12, k2: T('d4:3') + 0.1, d2c: T('d4:6'), birak: T('d4:7'),
    on: T('d4:7'), cayG: T('d4:9'), sutI: T('d5:1'), ikisi: T('d5:5'), esit: T('d5:7'),
    espri: T('h4') - 0.35, sik: T('h4') + 0.25, yan: T('h4:2'),
    cta: T('d6') - 0.15,
  };
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, 1.18, 575, 1060], [1.5, 1.08, 600, 1080]] },
    { id: 'yakin1', t0: tm.h2a - 0.08, cam: [[0, ...M.kadraj(YAK, 'bardak')], [tm.pour1 - 0.3, 1.04, BX + 500, 966]] },
    { id: 'oda2', t0: tm.h2c - 0.08, cam: [[0, 1.12, 470, 1060], [tm.gSut - 0.2, 1.15, 500, 1056]] },
    { id: 'yakin2', t0: tm.d2 - 0.12, cam: [[0, 1.0, BX + 560, 950], [tm.hd - 0.1, 1.03, BX + 590, 950]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 1.06, 540, 1110], [tm.ipucu - 0.3, 1.09, 545, 1104]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.38, 548, 1012], [tm.ilk, 1.42, 548, 1004]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(OCK, 'defne')]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...M.kadraj(UST, 'tabak')], [tm.k2, 1.02, CX + 540, 966], [tm.sutI, 1.05, CX + 540, 972]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.22, 545, 1040], [tm.yan, 1.26, 555, 1030]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.4, 915, 1000], [tm.cta + 1.5, 1.45, 913, 994]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'kizgin', head: { tilt: 3, look: [0.7, 0.35] }, ...POZ.dur });
  const BELDE = { armL: { sh: 38, el: -118 }, armR: { sh: 38, el: -118 } };
  const hik = [
    [0.8, { head: { tilt: 5, look: [0.85, 0.15] } }, 0.35],
    [tm.h1n - 0.12, { head: { tilt: 6, look: [0.95, 0.05] } }, 0.25],
    [tm.kus + 0.35, { head: { tilt: -2, look: [0.7, 0.4] } }, 0.3],
    [tm.h2c - 0.08, { expr: 'notr', head: { tilt: 2, look: [0.7, 0.55] } }, 0.01],
    [tm.gSut - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [0.85, 0.15] } }, 0.3],
    [tm.sayac, { x: SAY_H, expr: 'kizgin', ...BELDE, head: { tilt: -6, look: [-0.7, 0.15] } }, 0.01],
    [tm.bak, { expr: 'notr', head: { tilt: 4, look: [0.95, 0.05] } }, 0.25],
    [tm.ipucu, { x: IP_H, expr: 'kizgin', head: { tilt: 3, look: [0.95, 0.1] } }, 0.01],
    [tm.ilk, { expr: 'saskin' }, 0.3],
    [tm.buldum - 0.05, { x: HIK_X, ...POZ.dur, expr: 'saskin', head: { tilt: 3, look: [0.9, 0.05] } }, 0.01],
    [tm.espri, { x: ES_H, expr: 'mutlu', head: { tilt: 4, look: [0.9, 0.1] } }, 0.01],
    [tm.yan, { expr: 'yorgun', head: { tilt: 7, look: [0.8, 0.3] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: 3, look: [0.95, 0.1] } }, 0.3],
  ];
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.25] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: 4, look: [-0.85, 0.1] } }, 0.4],
    [tm.h1n, { head: { tilt: 5, look: [0.9, 0.05] } }, 0.25],
    [tm.kus + 0.3, { head: { tilt: -4, look: [-0.85, 0.15] } }, 0.3],
    [tm.h2c - 0.08, { expr: 'notr', head: { tilt: -3, look: [-0.7, 0.6] } }, 0.01],
    [tm.gSut, { head: { tilt: 3, look: [-0.45, 0.65] } }, 0.3],
    [tm.sayac, { x: SAY_D, expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -6, look: [-0.6, 0.6] } }, 0.01],
    [tm.seker + 0.35, { head: { tilt: 5, look: [-0.55, 0.15] } }, 0.35],
    [tm.bak, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 5, look: [0.95, 0] } }, 0.25],
    [tm.ipucu, { x: IP_D, expr: 'notr', head: { tilt: -3, look: [-0.9, 0.1] } }, 0.01],
    [tm.buldum - 0.06, { x: DEF_X }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armL: { sh: 165, el: -10 } }, 0.25, ease.enter],
    [tm.espri, { x: ES_D, expr: 'mutlu', ...POZ.dur, head: { tilt: -4, look: [-0.85, 0.3] } }, 0.01],
    [tm.cta - 0.05, { head: { tilt: 6, look: [-0.1, 0.05] } }, 0.35],
  ];
  // şeker küpleri: 10 koyu (çay tabağı) + 10 beyaz (süt tabağı); kaşıkla iki taşıma, arada karıştırma
  const kupler = kupPlani(tm);
  return { tm, film, hik, hikBase, def, defBase, kupler };
}

// ═══════════════════════════ Sıvılar (gerçek hacim) ═══════════════════════════
function siviAt(t, tm) {
  const cayUst = KASIK * ease.state(seg(t, tm.pour1 + 0.05, 0.4)) - KASIK * ease.state(seg(t, tm.lift2, 0.22))
    - KASIK * (ease.state(seg(t, tm.dip3 + 0.55, 0.22)) - ease.state(seg(t, tm.geri, 0.35)));          // Defne'nin bakmak için aldığı kaşık, geri döner
  const sutUst = -KASIK * ease.state(seg(t, tm.dip1 + 0.62, 0.22)) + KASIK * ease.state(seg(t, tm.pour2 + 0.05, 0.4));
  return {
    cay: { sev: L0 + cayUst, renk: CAY, bulut: t > tm.pour1 ? { renk: SUT, u: seg(t, tm.pour1 + 0.1, 1.5), p: [0.5, 0.28], tohum: 3, guc: 0.32 } : null },
    sut: { sev: L0 + sutUst, renk: SUT, bulut: t > tm.pour2 ? { renk: CAY, u: seg(t, tm.pour2 + 0.1, 1.3), p: [0.5, 0.28], tohum: 8, guc: 0.22 } : null },
  };
}
const KARISIK = H.mixHex(CAY, SUT, 0.2);
// Yakın plan kaşığı: kase yolu (iz) + içerik. kim: 'h' (Hikmet, sol üstten) | 'd' (Defne, sağ üstten)
function kasikB(t, tm, id) {
  const sY = (g, sev) => yuzeyY(YB, YK, sev);
  if (id === 'yakin1') {
    const R0 = [BX + 545, 640], uSut = [BX + 760, 650], iSut = [BX + 770, sY(0, L0) + 70], uCay = [BX + 340, 650], iCay = [BX + 330, sY(0, L0) + 64];
    const kar = t >= tm.pour1 + 0.5 && t < tm.lift2 - 0.1 ? [52 * Math.sin(TAU * seg(t, tm.pour1 + 0.55, tm.lift2 - tm.pour1 - 0.7) * 2), 0] : [0, 0];
    const p = H.iz([[0, R0], [tm.dip1 - 0.42, uSut, 0.35], [tm.dip1 - 0.05, iSut, 0.25], [tm.dip1 + 0.5, uSut, 0.3, ease.enter],
      [tm.pour1 - 0.62, ekle(uCay, [16, -10]), 0.55, ease.state, 60], [tm.pour1 + 0.45, iCay, 0.25],
      [tm.lift2, uCay, 0.3, ease.enter], [tm.pour2 - 0.62, ekle(uSut, [-16, -10]), 0.55, ease.state, 60], [tm.pour2 + 0.5, R0, 0.45]], t);
    const dolu1 = W(t, tm.dip1 + 0.45, 0.12) * (1 - W(t, tm.pour1, 0.4)), dolu2 = W(t, tm.lift2 - 0.05, 0.12) * (1 - W(t, tm.pour2, 0.4));
    const ic = Math.max(dolu1, dolu2), renk = dolu2 > 0.01 ? KARISIK : SUT;
    const ak = t >= tm.pour1 - 0.02 && t < tm.pour1 + 0.5 ? { u0: seg(t, tm.pour1 + 0.25, 0.2), u1: seg(t, tm.pour1 - 0.02, 0.16), hedef: [uCay[0] + 4, sY(0, L0 + KASIK)], renk: SUT }
      : t >= tm.pour2 - 0.02 && t < tm.pour2 + 0.5 ? { u0: seg(t, tm.pour2 + 0.25, 0.2), u1: seg(t, tm.pour2 - 0.02, 0.16), hedef: [uSut[0] - 4, sY(0, L0)], renk: KARISIK } : null;
    const egik = (ak ? 0.5 : 0);
    const icinde = (t > tm.dip1 - 0.12 && t < tm.dip1 + 0.55) ? 'sut' : (t > tm.pour1 + 0.4 && t < tm.lift2 + 0.12) ? 'cay' : null;
    return { p: [p[0] + kar[0], p[1] + kar[1]], kim: 'h', ic, renk, ak, egik, icinde };
  }
  // yakin2: Defne kaşıkla çaydan alır, ışığa tutar; "Bence"den sonra geri döker
  const gir = [BX + 1060, 560], uCay = [BX + 345, 650], iCay = [BX + 335, sY(0, L0) + 64], ISIK = [BX + 575, 590];
  const p = H.iz([[0, gir], [tm.d2 - 0.1, uCay, 0.4], [tm.dip3, iCay, 0.24], [tm.dip3 + 0.55, uCay, 0.3, ease.enter], [tm.isik - 0.3, ISIK, 0.4], [tm.geri - 0.6, ekle(uCay, [18, -8]), 0.45, ease.state, 50], [tm.geri + 0.35, gir, 0.5]], t);
  const ic = W(t, tm.dip3 + 0.5, 0.12) * (1 - W(t, tm.geri, 0.35));
  const ak = t >= tm.geri - 0.02 && t < tm.geri + 0.45 ? { u0: seg(t, tm.geri + 0.22, 0.2), u1: seg(t, tm.geri - 0.02, 0.16), hedef: [uCay[0] + 2, sY(0, L0 - KASIK)], renk: KARISIK } : null;
  return { p, kim: 'd', ic, renk: KARISIK, ak, egik: ak ? -0.5 : 0, icinde: t > tm.dip3 - 0.1 && t < tm.dip3 + 0.6 ? 'cay' : null, isik: pw(t, tm.isik, tm.geri - 0.6, 0.3, 0.3) };
}

// ═══════════════════════════ Şeker planı (üstten) ═══════════════════════════
const slot = (pl, k) => { const c = pl === 'c' ? PC : PS, r = Math.floor(k / 5), col = k % 5; return [c[0] + (col - 2) * 70, c[1] - 58 + r * 74]; };
const ekstra = j => [PC[0] + (j - 1) * 70, PC[1] + 94];
const KASE = [[-42, 4], [0, -6], [42, 4]];
function kasikC(t, tm) {
  // kase yolu: süt tabağındaki üç küpün üstü → çay tabağının ön sırası → karıştırma → geri → bırakma
  const G1 = [(slot('s', 0)[0] + slot('s', 1)[0]) / 2 - 18, (slot('s', 0)[1] + slot('s', 5)[1]) / 2], E = [ekstra(1)[0], ekstra(1)[1] - 4], ORTA = [PC[0], PC[1] + 10];
  const up = p => [p[0], p[1] - 120], DUR = [CX + 1000, 1330];
  const tur = t >= tm.kar && t < tm.k2 - 0.2 ? seg(t, tm.kar, tm.k2 - 0.2 - tm.kar) : -1;
  if (tur >= 0) { const a = TAU * ease.state(tur) - Math.PI / 2; return { p: [ORTA[0] + 80 * Math.cos(a), ORTA[1] + 46 * Math.sin(a) + 20], kalk: 1, birakti: false }; }
  const p = H.iz([[0, up(G1)], [tm.k1 - 0.22, G1, 0.22], [tm.k1 + 0.04, up(G1), 0.24, ease.enter], [tm.k1 + 0.3, up(E), 0.62, ease.state, 60], [tm.d1 - 0.2, E, 0.2],
    [tm.d1 + 0.05, up(ORTA), 0.06], [tm.k2 - 0.2, E, 0.2], [tm.k2 + 0.04, up(E), 0.24, ease.enter], [tm.k2 + 0.3, up(G1), 0.7, ease.state, 60], [tm.d2c - 0.22, G1, 0.2],
    [tm.d2c + 0.06, DUR, 0.5]], t);
  const kalk = 1 - Math.max(W(t, tm.k1 - 0.22, 0.22) * (1 - W(t, tm.k1 + 0.04, 0.24)), W(t, tm.d1 - 0.2, 0.2) * (1 - W(t, tm.d1 + 0.05, 0.2)), W(t, tm.k2 - 0.2, 0.2) * (1 - W(t, tm.k2 + 0.04, 0.24)), W(t, tm.d2c - 0.22, 0.2) * (1 - W(t, tm.d2c + 0.06, 0.2)), W(t, tm.d2c + 0.06, 0.5));
  return { p, kalk, birakti: t >= tm.d2c + 0.56 };
}
function kupPlani(tm) {
  const K = [];
  for (let i = 0; i < 10; i++) K.push({ ad: 'D' + i, beyaz: false, keys: [{ t: -1, at: slot('c', i) }] });
  for (let i = 0; i < 10; i++) K.push({ ad: 'W' + i, beyaz: true, keys: [{ t: -1, at: slot('s', i) }] });
  const bul = a => K.find(k => k.ad === a);
  // 1. kaşık: W0, W5, W1 → çay tabağının ön sırası
  [['W0', 0], ['W5', 1], ['W1', 2]].forEach(([a, j]) => { bul(a).keys.push({ t: tm.k1, kase: j }, { t: tm.d1, at: ekstra(j) }); });
  // karıştırma: W5 (ön sıra ortası) ile D6 yer değiştirir
  bul('W5').keys.push({ t: tm.kar + 0.15, at: slot('c', 6), d: 0.45, lift: 50 });
  bul('D6').keys.push({ t: tm.kar + 0.15, at: ekstra(1), d: 0.45, lift: 50 });
  // 2. kaşık: W0, D6, W1 → süt tabağının boşlukları (D6 5. yuvaya)
  [['W0', 0, 0], ['D6', 1, 5], ['W1', 2, 1]].forEach(([a, j, k]) => { bul(a).keys.push({ t: tm.k2, kase: j }, { t: tm.d2c, at: slot('s', k) }); });
  return K;
}
function kupAt(c, t, kasikP, tm) {
  const yer = (k) => k.kase != null ? ekle(kasikP, KASE[k.kase]) : k.at;
  let p = c.keys[0].at, kalk = 0;
  for (let i = 1; i < c.keys.length; i++) {
    const k = c.keys[i]; if (k.t > t) break;
    const d = k.d ?? 0.12, u = ease.state(seg(t, k.t, d)), prev = c.keys[i - 1], from = prev.kase != null ? ekle(kasikC(k.t, tm).p, KASE[prev.kase]) : p;
    const to = yer(k); p = [lerp(from[0], to[0], u), lerp(from[1], to[1], u) - (k.lift || 0) * 4 * u * (1 - u)];
    kalk = k.kase != null ? 1 : (k.lift ? 4 * u * (1 - u) : 0);
  }
  return { p, kalk };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 6, d4: 6, d5: 5 },
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'yakin1' || id === 'yakin2') yakinSahne(K, t, S, B);
    else if (id === 'cevap') ustSahne(K, t, S, B);
    else ocakSahne(K, t, tl, S, B);
  },
  ekran(K, t, { sc }) {
    const { tm } = S, id = sc.id, sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'ipucu') {
      for (const g of S.ipG || []) H.mark(K, t, tm.dolu, tm.buldum - 0.1, sabit(tm.dolu)(g), true);
    }
    if (id === 'cevap') {
      const f = sabit(tm.on);
      H.tag(K, t, tm.on, tm.sutI - 0.2, f([PC[0], PC[1] - PRY - 66]), '10', INK, PAL.paper, 56);
      H.tag(K, t, tm.on + 0.07, tm.sutI - 0.2, f([PS[0], PS[1] - PRY - 66]), '10', INK, PAL.paper, 56);
      const g = sabit(tm.sutI), wL = slot('c', 6), dR = slot('s', 5);
      H.sayiAtla(K, t, [[tm.sutI, g([wL[0], wL[1] - 104]), '1'], [tm.ikisi, g([dR[0], dR[1] - 104]), '1'], [tm.esit, g([(PC[0] + PS[0]) / 2, PC[1] - PRY - 66]), '1 = 1']], { son: tm.espri - 0.25, size: 64, fill: PAL.green, col: PAL.paper });
      const m = g([(PC[0] + PS[0]) / 2, PC[1] - PRY - 66]);
      H.mark(K, t, tm.esit + 0.14, tm.espri - 0.25, [m[0] + 150, m[1]], true);
    }
  },
});

// ——— ocak: bar tezgâhı (yüzler) ———
function necmiAt(t, tm, id) {
  if (id === 'oda' || id === 'oda2' || id === 'sayac') {
    const x = id === 'sayac' ? 1180 : NEC_X, don = id === 'oda' && t > tm.h1n + 0.2 && t < tm.kus + 0.45;
    if (don) return kisi('necmi', { x, expr: 'kizgin', armL: { sh: 38, el: -118 }, armR: { sh: 38, el: -118 }, head: { tilt: 6, look: [-0.95, 0.1] } });
    const p = kisi('necmi', { view: 'side', facing: 1, x, expr: 'kizgin', armL: { sh: -8, el: 30 }, armR: { sh: -8, el: 30 }, head: { tilt: -4, look: [0.6, 0.1] } });
    if (id === 'sayac' && t > tm.bak) { const q = kisi('necmi', { x, expr: 'notr', head: { tilt: 0, look: [-0.9, 0.1] }, ...POZ.dur }); return q; }
    return p;
  }
  if (id === 'ipucu' || id === 'buldum') return kisi('necmi', { x: id === 'buldum' ? 400 : IP_N, expr: id === 'buldum' ? 'saskin' : t > tm.n1 - 0.1 ? 'mutlu' : 'notr', head: { tilt: id === 'buldum' ? 4 : 2, look: id === 'buldum' ? [0.9, 0.1] : [0, 0.7 - 0.6 * W(t, tm.n1 - 0.2, 0.3)] }, ...POZ.dur });
  return kisi('necmi', { x: ES_N, expr: 'mutlu', head: { tilt: -3, look: [-0.9, 0.15] }, ...POZ.dur });
}
function ocakSahne(K, t, tl, S, { heads, sc }) {
  const { tm } = S, id = sc.id, hop = H.buldumHop(t, tm.buldum), sv = siviAt(t, tm), ust = [];
  M.mekanCiz(K, OCK, 'arka', t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= hop;
  const np = necmiAt(t, tm, id);
  const nGor = !(id === 'sayac' && false);

  // ——— Hikmet: sağ elinde kaşık (kanca, soru) · espride Necmi'yle tokalaşır ———
  let hKasik = null, tokaP = null;
  if (id === 'oda') {
    const H0 = [G_CAY[0] + 46, 1022], gos = [610, 965], u = W(t, tm.h1n - 0.25, 0.3) * (1 - W(t, tm.kus + 0.3, 0.35));
    const el = [lerp(H0[0], gos[0], u), lerp(H0[1], gos[1], u) + 20 * tik(t, tm.tap) * (1 - u)];
    H.reach('hikmet', hp, 'R', el, 1); hKasik = { a: lerp(1.95, 0.05, u) };
  }
  if (id === 'oda2') {
    const A = [G_CAY[0] + 52, 1030], B = [G_SUT[0] + 48, 1030], dur = [430, 1060];
    const el = H.iz([[0, dur], [tm.gCay - 0.3, A, 0.3], [tm.gSut - 0.3, B, 0.3]], t);
    H.reach('hikmet', hp, 'R', [el[0], el[1] - 14 * (tik(t, tm.gCay) + tik(t, tm.gSut))], 1); hKasik = { a: 1.85 };
  }
  if (id === 'espri' || id === 'cta') {
    const mid = [(ES_H + ES_N) / 2 + 8, 962], w = W(t, tm.sik - 0.3, 0.3), sal = t > tm.sik ? 16 * Math.sin(TAU * 2.6 * (t - tm.sik)) * (1 - W(t, tm.sik + 1.2, 0.3)) : 0;
    tokaP = w > 0.5 ? [mid[0], mid[1] + sal] : null;
    const q = [mid[0], mid[1] + sal]; H.reach('hikmet', hp, 'R', q, w, 'A'); H.reach('necmi', np, 'L', q, w, 'A');
  }
  // ——— Defne: sayaçta şekerlikten küp alır (sol el), Buldum'da küp havada, çağrıda iki küp yanaklarının yanında ———
  let dKup = null, dKup2 = null;
  if (id === 'sayac' || id === 'ipucu') {
    const al = [SEK[0] + 4, 1172], bak = [SAY_D - 120, 985], u = id === 'ipucu' ? 1 : W(t, tm.seker + 0.2, 0.4), w = id === 'ipucu' ? 1 : W(t, tm.seker - 0.3, 0.28);
    const e = id === 'ipucu' ? [IP_D - 110, 1060] : [lerp(al[0], bak[0], u), lerp(al[1], bak[1], u)];
    H.reach('defne', dp, 'L', e, w, 'A'); if (t > tm.seker || id === 'ipucu') dKup = 'L';
  }
  if (id === 'buldum') dKup = 'L';
  if (id === 'espri') { H.reach('defne', dp, 'L', H.elYeri('defne', dp, 'L', 'gogus'), 1, 'A'); dKup = 'L'; }
  if (id === 'cta') {
    const w = W(t, tm.cta + 0.05, 0.45), yL = H.elYeri('defne', dp, 'L', 'yukari'), yR = H.elYeri('defne', dp, 'R', 'yukari'), gL = H.elYeri('defne', dp, 'L', 'gogus'), gR = H.elYeri('defne', dp, 'R', 'gogus');
    const hb = H.eklem('defne', dp, 'head'); void yL; void yR;
    H.reach('defne', dp, 'L', [lerp(gL[0], hb[0] - 112, w), lerp(gL[1], hb[1] + 78, w)], 1, 'A');
    H.reach('defne', dp, 'R', [lerp(gR[0], hb[0] + 112, w), lerp(gR[1], hb[1] + 78, w)], w, 'A');
    dKup = 'L'; dKup2 = w > 0.3 ? 'R' : null;
  }
  // ——— Necmi: ipucunda iki bardağı göz hizasına kaldırır ———
  let nBar = null;
  if (id === 'ipucu' || id === 'buldum') {
    const hd = H.eklem('necmi', np, 'head'), u = id === 'buldum' ? 1 : ease.enter(seg(t, tm.al + 0.32, 0.42)), w = id === 'buldum' ? 1 : W(t, tm.al, 0.3);
    const tutL0 = [G_CAY[0], G_CAY[1] - 74], tutR0 = [G_SUT[0], G_SUT[1] - 74], tutL1 = [hd[0] - 175, hd[1] + 10], tutR1 = [hd[0] + 175, hd[1] + 10];
    const eL = [lerp(tutL0[0], tutL1[0], u) - 28, lerp(tutL0[1], tutL1[1], u)], eR = [lerp(tutR0[0], tutR1[0], u) + 28, lerp(tutR0[1], tutR1[1], u)];
    H.reach('necmi', np, 'L', eL, w, 'B'); H.reach('necmi', np, 'R', eR, w, 'B');
    nBar = { cay: [eL[0] + 28, eL[1] + 74], sut: [eR[0] - 28, eR[1] + 74], u };
    S.ipG = [[nBar.cay[0] - 80, nBar.cay[1] - 150], [nBar.sut[0] + 80, nBar.sut[1] - 150]];
  }

  // ——— çizim sırası: karakterler → tezgâh → tezgâhtakiler → tutan eller ———
  const nec = nGor && !(id === 'buldum' && false) ? oyna(K, t, tl, 'necmi', np, { heads }) : null;
  const h = oyna(K, t, tl, 'hikmet', hp, { heads });
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const d = oyna(K, t, tl, 'defne', dp, { heads });
  M.mekanCiz(K, OCK, 'on', t);
  // tezgâhtakiler
  const buharK = 0.55;
  if (!nBar) {
    bardak(K, G_CAY[0], G_CAY[1], GK, { ...sv.cay, buhar: buharK, t });
    bardak(K, G_SUT[0], G_SUT[1], GK, { ...sv.sut, t });
  }
  sekerlik(K, SEK, t > tm.seker && id !== 'oda' && id !== 'oda2' ? 1 : 0);
  if (id === 'espri' || id === 'cta') { minikTabak(K, TAB_C, false, 6); minikTabak(K, TAB_S, true, 5); }
  if (id !== 'oda' && id !== 'oda2') kasik(K, [380, 1222], 0.12, 76, 14);   // kaşık tezgâhta yatar
  // eldekiler
  if (hKasik) { const e = h.handR, a = hKasik.a; kasik(K, [e[0] + Math.cos(a) * 66, e[1] + Math.sin(a) * 66], a + Math.PI, 72, 14); kolUst(K, 'hikmet', hp, 'R'); }
  if (tokaP) { kolUst(K, 'necmi', np, 'L'); kolUst(K, 'hikmet', hp, 'R'); }
  if (nBar) {
    bardak(K, nBar.cay[0], nBar.cay[1], GK, { ...sv.cay, tabak: nBar.u < 0.2, buhar: buharK, t, yesil: id === 'ipucu' ? W(t, tm.ilk - 0.04, 0.25) : 0 });
    bardak(K, nBar.sut[0], nBar.sut[1], GK, { ...sv.sut, tabak: nBar.u < 0.2, t, yesil: id === 'ipucu' ? W(t, tm.ilk + 0.04, 0.25) : 0 });
    nec.tut('L'); nec.tut('R');
  }
  if (dKup) { const e = dKup === 'L' ? d.handL : d.handR; kup(K, [e[0] + (dKup === 'L' ? -4 : 4), e[1] - 38], 44, true); d.tut(dKup); }
  if (dKup2) { const e = d.handR; kup(K, [e[0] + 4, e[1] - 38], 44, false); d.tut('R'); }
  for (const f of ust) f();
}

// ——— yakın: iki bardak, kaşık (kollar kadrajın kenarından) ———
function yakinSahne(K, t, S, { heads, cam, sc }) {
  const { tm } = S, id = sc.id, sv = siviAt(t, tm), ks = kasikB(t, tm, id);
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.hikmet = ekrandan(20, 520); heads.defne = ekrandan(1060, 520);
  M.mekanCiz(K, YAK, 'arka', t);
  const org = ks.kim === 'h' ? H_ORG : D_ORG, a = Math.atan2(org[1] - ks.p[1], org[0] - ks.p[0]) + ks.egik * (ks.kim === 'h' ? -1 : 1);
  const L = 360, br = 62, el = [ks.p[0] + Math.cos(a) * L * 0.86, ks.p[1] + Math.sin(a) * L * 0.86];
  const kasikCiz = () => kasik(K, ks.p, a, L, br, { ic: ks.ic, renk: ks.renk, isik: ks.isik || 0 });
  // Hikmet yakin2'de süt bardağını kaldırır
  const kal = id === 'yakin2' ? H.kaldir(t, [[tm.hd - 0.02, tm.geri - 0.3]], { cik: 0.4, inis: 0.3 }) : 0;
  const sutP = [Y_SUT[0], Y_SUT[1] - 120 * kal], nab = 1 + 0.05 * H.nabiz(t, tm.sutK, 0.4);
  // seviye çizgisi: "süt"te iki bardağın ilk seviyesinden geçen kesik çizgi (h2b sonuna kadar)
  bardak(K, Y_CAY[0], Y_CAY[1], YK, { ...sv.cay, buhar: 1.25, t, kasikIc: ks.icinde === 'cay' ? kasikCiz : null });
  bardak(K, sutP[0], sutP[1], YK * nab, { ...sv.sut, tabak: kal < 0.05, t, kasikIc: ks.icinde === 'sut' ? kasikCiz : null });
  if (id === 'yakin1') {
    const v = ease.state(seg(t, tm.cizgi, 0.45)), sol = 1 - W(t, tm.h2c - 0.4, 0.3), y = yuzeyY(YB, YK, L0), x0 = Y_CAY[0] - 170, x1 = x0 + (Y_SUT[0] + 170 - x0) * v;
    if (v > 0.01 && sol > 0.01) { const { ctx } = K; ctx.save(); ctx.globalAlpha = sol; ctx.setLineDash([30, 20]); ctx.lineCap = 'butt'; H.strokeLine(ctx, [x0, y], [x1, y], 16, INK); H.strokeLine(ctx, [x0, y], [x1, y], 8, PAL.mustard); ctx.restore(); }
  }
  if (!ks.icinde) kasikCiz();
  if (ks.ak) { const ag = [ks.p[0] + (ks.kim === 'h' ? -1 : 1) * 0 , ks.p[1] + 18]; H.akis(K, ag, ks.ak.hedef, 15, ks.ak.renk, ks.ak.u0, ks.ak.u1); }
  M.mekanCiz(K, YAK, 'isik', t);
  uzunKol(K, ks.kim === 'h' ? 'hikmet' : 'defne', org, el);
  if (id === 'yakin2' && t > tm.hd - 0.4 && t < tm.geri + 0.3) {   // Hikmet'in eli süt bardağını sol yanından tutar
    const HO = [BX + 1480, 1090], w = W(t, tm.hd - 0.4, 0.3) * (1 - W(t, tm.geri, 0.3)), tut = [sutP[0] + 96, sutP[1] - 215], u = H.unit(tut, HO);   // sağ alttan: Defne'nin kolunu ve çay bardağını kesmez
    uzunKol(K, 'hikmet', HO, [tut[0] - u[0] * 900 * (1 - w), tut[1] - u[1] * 900 * (1 - w)]);
  }
}

// ——— üstten: iki tabak şeker ———
function tabakUst(K, [x, y]) {
  K.ell(x + 10, y + 14, PRX, PRY, INK, 0); K.ell(x, y, PRX, PRY, PAL.cream, LW); K.ell(x, y + 4, PRX * 0.78, PRY * 0.76, '#EFE6D2', LW * 0.6);
}
function ustSahne(K, t, S, { heads, cam }) {
  const { tm } = S;
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.defne = ekrandan(1060, 1500);
  M.mekanCiz(K, UST, 'arka', t);
  tabakUst(K, PC); tabakUst(K, PS);
  const ks = kasikC(t, tm);
  const kup0 = S.kupler.map(c => ({ c, ...kupAt(c, t, ks.p, tm) }));
  const yes = c => c.ad === 'D6' ? W(t, tm.cayG, 0.25) : c.ad === 'W5' ? W(t, tm.sutI, 0.25) : 0;
  // yerdekiler (arkadan öne), kaşık, kaşıktakiler
  for (const o of kup0.filter(o => o.kalk < 0.5).sort((a, b) => a.p[1] - b.p[1])) kup(K, o.p, KS, o.c.beyaz, { yesil: yes(o.c), kalk: 0 });
  const a = Math.atan2(C_ORG[1] - ks.p[1], C_ORG[0] - ks.p[0]), L = 400, el = [ks.p[0] + Math.cos(a) * L * 0.86, ks.p[1] + Math.sin(a) * L * 0.86];
  const yuk = (1 - ks.kalk) * 0 + ks.kalk * 0;
  void yuk;
  if (ks.kalk > 0.02) { const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.16 * ks.kalk; K.ell(ks.p[0] + 18, ks.p[1] + 30, 110, 62, INK, 0); ctx.restore(); }
  kasik(K, ks.p, a, L, 112, {});
  for (const o of kup0.filter(o => o.kalk >= 0.5)) kup(K, o.p, KS, o.c.beyaz, { kalk: 6 });
  // el: kaşığı tutar; bıraktıktan sonra parmakla dokunarak sayar
  if (!ks.birakti) uzunKol(K, 'defne', C_ORG, el);
  else {
    const wL = slot('c', 6), dR = slot('s', 5), dur = [[tm.d2c + 0.56, el], [tm.sutI, [wL[0] + 8, wL[1] - 6]], [tm.ikisi, [dR[0] + 8, dR[1] - 6]], [tm.esit, [(PC[0] + PS[0]) / 2 + 40, PC[1] + 150]]];
    const hd = H.dokunYolu(t, dur, { yuksel: 40, sure: 0.3 }), u = H.unit(hd, C_ORG), dok = t > tm.sutI - 0.31 && t < tm.esit - 0.3;
    uzunKol(K, 'defne', C_ORG, [hd[0] + u[0] * 86, hd[1] + u[1] * 86], dok ? hd : null);
  }
  M.mekanCiz(K, UST, 'isik', t);
}
