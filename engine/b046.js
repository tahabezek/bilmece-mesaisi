// Bölüm 46 · TAŞ, KÂĞIT, ZAR (v4 "hikâye" dili; storyboard: hikayeler/bolum_046_v5.md). Mekanizma: geçişsizlik.
// Logline: Hikmet'in masasında üç zar var. "Önce sen seç, ben sonra seçerim" der; Defne en büyük sayılı dokuzlu zarı alır,
// dokuz atışta 6–3 yenilir. Çay ocağında Necmi'yle Kerem'in taş-kâğıt-makas oyunu ona daireyi hatırlatır: üç zar bir
// tepsinin üç köşesine dizilir, "yener" okları daire çizer; Defne hangi zarı alsa Hikmet okun öbür ucundakini alır.
// Akılda kalacak tek şey: en iyi zar yoktur; her zarı yenen başka bir zar vardır, sonra seçen hep kazanır.
// Mekânlar: Hikmet'in odası (önden; masa, üç zar, yüz kartları, tavla takımı dolabın üstünde) · çay ocağı (M.cayOcagi) ·
// tepsi yakın planı (kuşbakışı). Her kare t'nin saf fonksiyonudur; Math.random yok; atışlar sabit listeden gelir.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Zarlar ve mantık denetimi ═══════════════════════════
// A: 2-2-4-4-9-9 (dokuzlu) · B: 1-1-6-6-8-8 (sekizli) · C: 3-3-5-5-7-7 (yedili). Karşılıklı yüzler aynıdır.
const ZAR = {
  A: { yuz: [2, 2, 4, 4, 9, 9], renk: '#E2B544', koyu: '#B98F2A', acik: '#F2D27E' },
  B: { yuz: [1, 1, 6, 6, 8, 8], renk: '#6FA36B', koyu: '#4F7F4C', acik: '#9CC797' },
  C: { yuz: [3, 3, 5, 5, 7, 7], renk: '#D9734E', koyu: '#B0553A', acik: '#EDA182' },
};
const kazanma = (x, y) => { let n = 0; for (const a of ZAR[x].yuz) for (const b of ZAR[y].yuz) if (a > b) n++; return n; };   // 36 üzerinden
// Yanlış deneme: Defne A, Hikmet C; dokuz atış [A, C]. Sonuç 3–6 (Hikmet).
const ATIS = [[9, 5], [2, 3], [4, 5], [9, 7], [2, 7], [4, 3], [2, 5], [4, 7], [2, 3]];
{
  const hata = [];
  for (const [x, y] of [['A', 'B'], ['B', 'C'], ['C', 'A']]) if (kazanma(x, y) !== 20 || kazanma(y, x) !== 16) hata.push(`${x}>${y} ${kazanma(x, y)}/36`);   // 20/36 = 5/9
  let d = 0, h = 0;
  for (const [a, c] of ATIS) {
    if (!ZAR.A.yuz.includes(a) || !ZAR.C.yuz.includes(c) || a === c) hata.push(`atış ${a}-${c}`);
    if (a > c) d++; else h++;
  }
  if (d !== 3 || h !== 6) hata.push(`skor ${d}-${h}`);
  if (hata.length) console.warn('b046: zar denetimi tutmadı', hata.join(', '));
}
const SKOR = (() => { let d = 0, h = 0; return ATIS.map(([a, c]) => (a > c ? d++ : h++, [d, h])); })();

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b046_oda', ZEMIN = 1500, MASA = { x0: 200, x1: 920, y: 1250 };
const ZX = { A: 330, B: 510, C: 690 }, ZS = 118;       // zar evleri (alt orta) ve kenar
const KART_Y = 1052;                                     // yüz kartının merkezi (zarın arkasında, sehpa ayağında)
const HIK_X = 735, DEF_X = 108;
const DOLAP = { x0: 955, x1: 1135, y: 1150 }, KUTU = [1045, 1150];   // tavla takımı dolabın üstünde
const STACK = { D: 252, H: 812 };                        // pul yığınları (masa önü)
const BARDAK = [600, 1250];
const MERCAN = PAL.coral, YESIL = PAL.green;
// Tepsi (kuşbakışı): merkez, yarıçap, köşeler (A üstte, saat yönünde B sağ altta, C sol altta)
const TP = { c: [540, 830], R: 395, r: 292 };
const KOSE = { A: -90, B: 30, C: 150 };
const kose = (z, r = TP.r) => [TP.c[0] + r * Math.cos(KOSE[z] * Math.PI / 180), TP.c[1] + r * Math.sin(KOSE[z] * Math.PI / 180)];

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
function yol(t, d) {
  if (t <= d[0][0]) return d[0][1];
  for (let i = 1; i < d.length; i++) if (t < d[i][0]) { const u = ease.state((t - d[i - 1][0]) / (d[i][0] - d[i - 1][0])); return [lerp(d[i - 1][1][0], d[i][1][0], u), lerp(d[i - 1][1][1], d[i][1][1], u)]; }
  return d[d.length - 1][1];
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Zar (önden): (x, y) alt orta; ön yüzde rakam, üstte ve sağda pah. rot ≠ 0 iken (havada) merkez çevresinde döner, pah yok.
function zar(K, x, y, z, n, { rot = 0, k = 1, vurgu = 0 } = {}) {
  const { ctx } = K, Z = ZAR[z], s = ZS * k * (1 + 0.14 * vurgu), h = s / 2;
  ctx.save(); ctx.translate(x, y - h);
  if (Math.abs(rot) > 1e-3) {
    ctx.rotate(rot);
    K.rect(-h, -h, s, s, Z.renk, LW, 16 * k);
  } else {
    K.poly([[-h + 6, -h], [-h + 22, -h - 18], [h + 16, -h - 18], [h, -h]], Z.acik, LW * 0.8);
    K.poly([[h, -h], [h + 16, -h - 18], [h + 16, h - 18], [h, h]], Z.koyu, LW * 0.8);
    K.rect(-h, -h, s, s, Z.renk, LW, 14 * k);
  }
  K.rect(-h + 12 * k, -h + 12 * k, s - 24 * k, s - 24 * k, PAL.paper, LW * 0.5, 10 * k);
  K.text(String(n), 0, 27 * k, 78 * k, INK, 900);
  ctx.restore();
}
// Yüz kartı: 3 sütun × 2 satır (karşılıklı yüzler alt alta), rakamlar 48 px (dünya)
function yuzKarti(K, cx, cy, z, k = 1) {
  const { ctx } = K, Z = ZAR[z], w = 168 * k, h = 128 * k;
  ctx.save(); ctx.translate(cx, cy);
  K.line(-w * 0.3, h / 2, -w * 0.38, h / 2 + 34 * k, 7 * k, '#5E3A1E'); K.line(w * 0.3, h / 2, w * 0.38, h / 2 + 34 * k, 7 * k, '#5E3A1E');
  K.rect(-w / 2 + 7, -h / 2 + 8, w, h, INK, 0, 14 * k);
  K.rect(-w / 2, -h / 2, w, h, PAL.paper, LW, 14 * k);
  K.rect(-w / 2, -h / 2, w, 14 * k, Z.renk, 0, 6 * k);
  const v = [...new Set(Z.yuz)];
  v.forEach((n, i) => { for (const j of [0, 1]) K.text(String(n), (i - 1) * 50 * k, (-8 + j * 54) * k + 12 * k, 48 * k, INK, 900); });
  ctx.restore();
}
// Masa (önden): üst tabla ve ön panel
function masa(K) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 10, y + 14, x1 - x0 - 20, ZEMIN - y - 14, PAL.wood, LW, 6);
  for (const [a, b] of [[x0 + 34, x0 + 250], [x1 - 250, x1 - 34]]) { K.rect(a, y + 52, b - a, 150, PAL.woodTop, LW * 0.7, 8); K.circ((a + b) / 2, y + 74, 8, '#5E3A1E', LW * 0.5); }
  K.rect(x0, y - 4, x1 - x0, 26, PAL.woodTop, LW, 6);
}
// Tavla takımı (kapalı çanta, yan duruşta): (x, y) alt orta; tutamak üstte. kapak 0..1 hafif aralanır
function tavlaKutu(K, x, y, { k = 1, kab = 0 } = {}) {
  const { ctx } = K, s = k * (1 + 0.1 * kab);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-26, -96); ctx.quadraticCurveTo(-26, -122, 0, -122); ctx.quadraticCurveTo(26, -122, 26, -96);
  ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#5E3A1E'; ctx.stroke();
  K.rect(-82, -100, 164, 100, '#8A5530', LW, 8);
  K.rect(-70, -88, 140, 76, '#A8693C', LW * 0.5, 4);
  for (let i = 0; i < 6; i++) K.poly([[-64 + i * 22, -84], [-46 + i * 22, -84], [-55 + i * 22, -52]], i % 2 ? '#2E3B38' : PAL.paper, 2);
  K.line(-80, -50, 80, -50, 4, '#5E3A1E');
  K.rect(-12, -56, 24, 12, PAL.mustard, LW * 0.4, 3);
  ctx.restore();
}
// Pul (yığın için): elips
const pul = (K, x, y, r = 0, k = 1) => K.ell(x, y, 22 * k, 8 * k, r ? '#3A2A20' : PAL.paper, 3);
function yigin(K, x, n, r, t0s = [], t) {
  for (let i = 0; i < n; i++) {
    const a = t0s[i] ?? -1, u = t < a ? 0 : 1;
    if (!u) continue;
    pul(K, x, MASA.y + 4 - i * 11, r);
  }
}
// Çay bardağı (döngü: buhar)
function bardak(K, x, yb, t) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb);
  K.ell(0, 0, 26, 7, PAL.cream, 2.5);
  const yolB = [[-14, -50], [14, -50], [8, -27], [14, -10], [11, -3], [-11, -3], [-14, -10], [-8, -27]];
  K.poly(yolB, '#F3EEE4', 2.5);
  K.poly([[-12.5, -42], [12.5, -42], [7.4, -27], [12.6, -10], [9.6, -4.5], [-9.6, -4.5], [-12.6, -10], [-7.4, -27]], '#A8401F', 0);
  K.poly(yolB, null, 2.5);
  ctx.restore();
  H.buhar(K, x, yb - 58, t, { k: 0.5, n: 2, ara: 14, boy: 80 });
}
// El şekilleri (taş-kâğıt-makas): el noktası p, yön dir (+1 sağa, −1 sola), s ölçek
function elSekli(K, key, p, s, tur, dir, { kapa = 0 } = {}) {
  const c = H.CARDS[key], r = c.arm.hand * s * 1.9, lw = c.line * s, { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  if (tur === 'makas') {
    for (const a of [-0.32 * (1 - kapa * 0.8), 0.32 * (1 - kapa * 0.8)]) {
      const q = [p[0] + dir * Math.cos(a) * r * 2.5, p[1] + Math.sin(a) * r * 2.5];
      H.strokeLine(ctx, p, q, r * 0.62 + lw * 2, INK); H.strokeLine(ctx, p, q, r * 0.62, c.skin);
    }
  }
  if (tur === 'kagit') {   // açık avuç: dört parmak yelpaze, başparmak yukarıda
    for (const [a, L] of [[-0.42, 2.0], [-0.14, 2.3], [0.14, 2.3], [0.42, 2.0], [-1.25, 1.5]]) {
      const q = [p[0] + dir * Math.cos(a) * r * L, p[1] + Math.sin(a) * r * L];
      H.strokeLine(ctx, p, q, r * 0.5 + lw * 2, INK); H.strokeLine(ctx, p, q, r * 0.5, c.skin);
    }
    K.circ(p[0] + dir * r * 0.5, p[1], r * 1.05, c.skin, lw);
  }
  K.circ(p[0], p[1], r, c.skin, lw);
  if (tur === 'tas') for (const dy of [-0.4, 0.1]) K.line(p[0] + dir * r * 0.2, p[1] + dy * r, p[0] + dir * r * 0.8, p[1] + dy * r, lw * 0.5, c.skinShade);
  ctx.restore();
}
// Kuşbakışı kol: ekranın kenarından gelen kol (kol rengi) ve el; isaret: işaret parmağı uzatılmış
function ustKol(K, key, kok, el, { isaret = true, s = 1.6 } = {}) {
  const c = H.CARDS[key], { ctx } = K, wArm = 70 * s / 1.6, r = 44 * s / 1.6;
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, kok, el, wArm + 10, INK); H.strokeLine(ctx, kok, el, wArm, c.arm.color);
  const u = H.unit(kok, el), m = [el[0] - u[0] * 30, el[1] - u[1] * 30];
  H.strokeLine(ctx, m, [m[0] - u[0] * 26, m[1] - u[1] * 26], wArm + 14, INK);
  H.strokeLine(ctx, m, [m[0] - u[0] * 26, m[1] - u[1] * 26], wArm + 4, key === 'hikmet' ? '#F1EDE2' : (c.top || c.arm.color));
  if (isaret) { const q = [el[0] + u[0] * 56, el[1] + u[1] * 56]; H.strokeLine(ctx, el, q, 26, INK); H.strokeLine(ctx, el, q, 16, c.skin); }
  K.circ(el[0], el[1], r, c.skin, LW);
  ctx.restore();
}
// Kuşbakışı zar: kare üst yüz (en büyük sayısı yukarıda)
function zarUst(K, [x, y], z, { vurgu = 0, a = 0 } = {}) {
  const { ctx } = K, Z = ZAR[z], s = 150 * (1 + 0.12 * vurgu), h = s / 2;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-h + 9, -h + 12, s, s, 'rgba(20,30,28,0.35)', 0, 18);
  K.rect(-h, -h, s, s, Z.renk, LW, 18);
  K.rect(-h + 14, -h + 14, s - 28, s - 28, PAL.paper, LW * 0.5, 12);
  ctx.restore();
  K.text(String(Math.max(...Z.yuz)), x, y + 32, 92, INK, 900);
}
// Tepsi üstünde ok yayı: a → b köşeleri arasında, u ilerleme (0..1), renk
function okYay(K, za, zb, u, renk, kalin = 18) {
  if (u <= 0) return;
  const pad = 30, a0 = KOSE[za] + pad, a1 = (KOSE[zb] < KOSE[za] ? KOSE[zb] + 360 : KOSE[zb]) - pad, a = lerp(a0, a0 + (a1 - a0) * clamp01(u), 1) * Math.PI / 180;
  const { ctx } = K, R = TP.r, c = TP.c, s = a0 * Math.PI / 180;
  ctx.save(); ctx.lineCap = 'round';
  for (const [w, col] of [[kalin + 10, INK], [kalin, renk]]) { ctx.beginPath(); ctx.arc(c[0], c[1], R, s, a); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); }
  if (u > 0.15) {
    const tip = [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)], tg = [-Math.sin(a), Math.cos(a)], n = [Math.cos(a), Math.sin(a)], L = 46, B = 30;
    const p = [[tip[0] + tg[0] * 18, tip[1] + tg[1] * 18], [tip[0] - tg[0] * L + n[0] * B, tip[1] - tg[1] * L + n[1] * B], [tip[0] - tg[0] * L - n[0] * B, tip[1] - tg[1] * L - n[1] * B]];
    K.poly(p, renk, LW * 0.8);
  }
  ctx.restore();
}

// ═══════════════════════════ Mekân: Hikmet'in odası ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-400, 1500], dongu: ['duvar saatinin saniye kolu', 'pencerede martı', 'çay buharı'],
  capa: { masa: [540, MASA.y], kutu: KUTU },
  kadraj: { kanca: [1.05, 470, 1086], yakin: [1.34, 520, 1100], oyun: [1.12, 470, 1086], genis: [1.0, 505, 1078], defne: [1.35, 285, 1000] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1600, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 140, 560, 250, 330, { isik, t });
    M.duvarSaati(K, 900, 720, 58, 15.2 + t / 60, t);
    // raf: klasörler
    K.rect(470, 690, 300, 18, PAL.woodTop, LW, 5);
    ['#C9A24A', '#5E6B73', '#A8401F', '#7C8B5A', '#C9A24A'].forEach((c, i) => K.rect(486 + i * 40, 590 + (i % 2) * 10, 32, 100 - (i % 2) * 10, c, LW * 0.6, 4));
    // dolap (tavla takımı üstünde)
    K.rect(DOLAP.x0, DOLAP.y, DOLAP.x1 - DOLAP.x0, ZEMIN - DOLAP.y, PAL.wood, LW, 6);
    K.rect(DOLAP.x0 + 18, DOLAP.y + 30, DOLAP.x1 - DOLAP.x0 - 36, 130, PAL.woodTop, LW * 0.6, 6);
    K.rect(DOLAP.x0 + 18, DOLAP.y + 180, DOLAP.x1 - DOLAP.x0 - 36, 130, PAL.woodTop, LW * 0.6, 6);
    K.rect(DOLAP.x0 - 8, DOLAP.y - 10, DOLAP.x1 - DOLAP.x0 + 16, 22, PAL.woodTop, LW, 5);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    zarIn: 0.3, kimse: T('h1:4'),
    once: T('h2a'), ben: T('h2a:3'), kim: T('h2a:6'), kazanir: T('h2a:9'),
    yakin: T('h2b') - 0.1, hileli: T('h2b:2'), neden: T('h2b:4'),
    h3: T('h3'), tavla: T('h3:1'),
    oyun: T('d2') - 0.12, dokuzlu: T('d2'), enB: T('d2:3'), onda: T('d2:6'),
    hd: T('hd'), ikiler: T('hd:3'), kazandim: T('hd:8'),
    sayac: cd0 + 0.25, ipucu: cd - 0.05,
    n1: T('n1'),
    cember: T('d4') - 0.1, d4: T('d4'), var: T('d4:5'), yener: T('d4:13'),
    o: [[T('d4:6'), T('d4:7') + 0.3], [T('d4:8'), T('d4:9') + 0.3], [T('d4:10'), T('d4:12') + 0.3]],
    d5: T('d5'), secen: T('d5:1'), yenenZ: T('d5:2'), alir: T('d5:4'),
    espri: T('h4') - 0.15, cozuldu: T('h4:1'), tavlaH: T('h4:2'),
    cta: T('d6') - 0.14,
  };
  // atışlar: ilki "onda!"da Defne'nin elinden; dokuzuncusu "kazandım"da biter
  tm.r = ATIS.map((_, i) => tm.onda + 0.05 + i * (tm.kazandim + 0.05 - tm.onda - 0.05) / 8);
  // taş-kâğıt-makas turları: [ortaya çıkış, Necmi, Kerem]
  tm.tur = [[T('n1') + 0.02, 'makas', 'kagit'], [T('n1:2') + 0.02, 'kagit', 'tas'], [T('n1:4') + 0.02, 'tas', 'makas']];
  // sayaç: Defne A'yı alır, çevirir, bırakır, parmakla sayar, düşünür, sağa bakar
  tm.sAl = tm.sayac + 0.35; tm.sCevir = [tm.sAl + 0.9, tm.sAl + 1.6, tm.sAl + 2.3, tm.sAl + 3.0]; tm.sBirak = tm.sAl + 3.6;
  tm.sSay = tm.sBirak + 0.6; tm.sDusun = tm.sSay + 1.9; tm.bak = cd - 0.75;
  tm.hNod = tm.sayac + 2.2; tm.hTik = tm.sayac + 5.4;

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...M.kadraj(ODA, 'kanca')], [0.3, 1.11, 478, 1092], [tm.kim - 0.1, 1.2, 500, 1112]] },
    { id: 'yakin', t0: tm.yakin, cam: [[0, ...M.kadraj(ODA, 'yakin')], [tm.neden, 1.36, 528, 1094], [tm.h3 - 0.1, 1.3, 800, 1070]] },
    { id: 'oyun', t0: tm.oyun, cam: [[0, ...M.kadraj(ODA, 'oyun')], [tm.ikiler, 1.15, 480, 1086]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...M.kadraj(ODA, 'genis')], [tm.sayac + 5, 1.02, 498, 1074]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.55, 912, 1060], [T('n1:4'), 1.58, 914, 1056]] },
    { id: 'buldum', t0: tm.buldum - 0.05, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'cember', t0: tm.cember, cam: [[0, 1, 540, 960], [tm.d5, 1.03, 540, 940]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.3, 600, 1080], [tm.tavlaH, 1.33, 588, 1078]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.36, 255, 1010], [tm.cta + 1.4, 1.4, 255, 1004]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.5, 0.3] }, ...POZ.dur });
  const hik = [
    [0.5, { head: { tilt: 4, look: [0.05, 0.05] } }, 0.35],
    [tm.once - 0.1, { head: { tilt: -3, look: [-0.85, 0.2] } }, 0.3],
    [tm.ben, { head: { tilt: 5, look: [0.05, 0.05] } }, 0.3],
    [tm.kim, { head: { tilt: 2, look: [-0.4, 0.6] } }, 0.3],
    [tm.yakin, { head: { tilt: -3, look: [-0.5, 0.45] } }, 0.01],
    [tm.neden, { expr: 'mutlu', head: { tilt: 7, look: [0.05, 0.0] } }, 0.3],
    [tm.h3, { head: { tilt: -4, look: [0.7, 0.4] } }, 0.3],
    [tm.oyun, { expr: 'mutlu', head: { tilt: 3, look: [-0.6, 0.4] } }, 0.01],
    [tm.r[0] + 0.1, { expr: 'saskin', head: { tilt: -5, look: [-0.6, 0.5] } }, 0.2],
    [tm.r[1] + 0.05, { expr: 'mutlu', head: { tilt: 4, look: [-0.4, 0.5] } }, 0.2],
    [tm.kazandim, { expr: 'mutlu', head: { tilt: 7, look: [-0.7, 0.1] } }, 0.3],
    [tm.sayac, { expr: 'mutlu', head: { tilt: 5, look: [-0.7, 0.2] } }, 0.01],
    [tm.cember, { expr: 'saskin', head: { tilt: -4, look: [-0.7, 0.3] } }, 0.01],
    [tm.espri, { expr: 'yorgun', head: { tilt: 8, look: [-0.5, 0.5] } }, 0.01],
    [tm.tavlaH, { expr: 'yorgun', head: { tilt: 9, look: [-0.7, 0.55] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 4, look: [0.85, 0.2] }, ...POZ.dur });
  const def = [
    [tm.once, { expr: 'notr', head: { tilt: -3, look: [0.8, -0.1] } }, 0.35],
    [tm.kim, { head: { tilt: 4, look: [0.7, 0.5] } }, 0.3],
    [tm.yakin, { expr: 'notr', head: { tilt: 4, look: [0.8, 0.3] } }, 0.01],
    [tm.oyun, { expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.45] } }, 0.01],
    [tm.enB, { head: { tilt: 3, look: [0.05, 0.05] } }, 0.3],
    [tm.r[1] + 0.05, { expr: 'saskin', head: { tilt: 5, look: [0.6, 0.5] } }, 0.2],
    [tm.kazandim - 0.2, { expr: 'yorgun', head: { tilt: 7, look: [0.6, 0.55] } }, 0.3],
    [tm.sayac, { expr: 'notr', head: { tilt: 5, look: [0.5, 0.2] } }, 0.01],
    [tm.sDusun, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.3, -0.5] } }, 0.35],
    [tm.bak, { head: { tilt: 3, look: [0.95, 0.05] } }, 0.25],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.espri, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 3, look: [0.8, 0.3] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.15, 0.05] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.4],
  ];
  const necBase = H.kisi('necmi', { x: 760, expr: 'mutlu', head: { tilt: -3, look: [0.8, 0.35] }, ...POZ.dur });
  const kerBase = H.kisi(H.KEREM, { x: 1055, expr: 'notr', head: { tilt: 3, look: [-0.8, 0.35] }, ...POZ.dur });
  return { tm, film, hikBase, hik, defBase, def, necBase, kerBase };
}

// ═══════════════════════════ Durum fonksiyonları ═══════════════════════════
// Yanlış denemede zarların konumu, yüzü, açısı: i'inci atışta zar r[i] − 0,26'da kalkar, r[i]'de iner (temas karesinde durur)
const HAVA = 0.26;
function atisZar(t, tm, z, ev) {
  const sut = z === 'A' ? 0 : 1, r = tm.r;
  let n = ZAR[z].yuz[5], p = [ev, MASA.y], rot = 0;
  for (let i = 0; i < r.length; i++) {
    if (t >= r[i]) { n = ATIS[i][sut]; continue; }
    if (t >= r[i] - HAVA) {
      const u = (t - (r[i] - HAVA)) / HAVA, y = MASA.y - 96 * 4 * u * (1 - u);
      const sira = [...new Set(ZAR[z].yuz)];
      return { p: [ev + (z === 'A' ? -1 : 1) * 14 * Math.sin(u * Math.PI), y], n: sira[(i + Math.floor(u * 5)) % 3], rot: (1 - u) * (z === 'A' ? 1 : -1) * TAU * 0.75, havada: true, i };
    }
    break;
  }
  return { p, n, rot, havada: false };
}
// Hangi atış kimin: pul yığınlarına düşüş anları
function pulAnlari(tm) {
  const D = [], Hh = [];
  ATIS.forEach(([a, c], i) => (a > c ? D : Hh).push(tm.r[i] + 0.1));
  return { D, H: Hh };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 4, d4: 6 },
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'ipucu') return cayOcagi(K, t, tl, S, B);
    if (id === 'cember') return tepsi(K, t, tl, S, B);
    oda(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'oyun' && t >= tm.r[0] - 0.04) {
      const ad = tm.r.map((r, i) => [r + 0.02, `Defne ${SKOR[i][0]} – ${SKOR[i][1]} Hikmet`, i === 8 ? MERCAN : INK, PAL.paper]);
      H.adimEtiket(K, t, ad, tm.sayac - 0.3, [540, B.top + 78], 52);
    }
  },
});

// ——— Hikmet'in odası (kanca, yakın, oyun, sayaç, buldum, espri, çağrı) ———
function oda(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz });
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  if (id === 'sayac') { H.glance(hp, t, tm.cd, 10); H.onayla(hp, t, tm.hNod); }

  // ——— zar durumları ———
  const Z = { A: { p: [ZX.A, MASA.y], n: 9, rot: 0, el: null }, B: { p: [ZX.B, MASA.y], n: 8, rot: 0 }, C: { p: [ZX.C, MASA.y], n: 7, rot: 0 } };
  const ho = { heads }, dO = { heads };
  let hTut = null, dTut = null, hIsaret = null, kutuKab = 0, kutuP = [...KUTU];

  // kanca: C havadan düşer (0,3 sn), Hikmet'in sol eli üstünde; "Önce sen seç" Defne'yi gösterir; "ben" göğüs; "Kim büyük" zarlara dokunur
  if (id === 'kanca') {
    if (t < tm.zarIn) { const u = clamp01((t + 0.12) / (tm.zarIn + 0.12)); Z.C.p = [ZX.C, lerp(MASA.y - 130, MASA.y, u * u)]; Z.C.rot = (1 - u) * 0.9; }
    const wL0 = 1 - W(t, 0.55, 0.35);
    if (wL0 > 0.01) ho.L = [[ZX.C - 10, MASA.y - 150 - 30 * clamp01(t / 0.3)], wL0, 'A'];
    const wG = pIn(t, tm.once - 0.15, tm.ben - 0.1, 0.28);
    if (wG > 0.01) { ho.L = [[HIK_X - 290, 1090], wG, 'A']; if (wG > 0.5) hIsaret = ['L', [DEF_X + 40, 1000]]; }
    const wC = pIn(t, tm.ben - 0.1, tm.kim - 0.15, 0.28);
    if (wC > 0.01) ho.R = [H.elYeri('hikmet', hp, 'R', 'gogus'), wC, 'A'];
    const dz = [[tm.kim, [ZX.B + 20, MASA.y - 150]], [tm.kim + 0.3, [ZX.B, MASA.y - ZS - 12]], [tm.kazanir - 0.25, [ZX.C, MASA.y - ZS - 12]], [tm.kazanir + 0.35, [ZX.C + 20, MASA.y - 150]]];
    const wD = pIn(t, tm.kim - 0.2, tm.kazanir + 0.4, 0.28);
    if (wD > 0.01) { const h = H.dokunYolu(t, dz, { yuksel: 30, sure: 0.22 }); ho.L = [[h[0] - 6, h[1] - 40], wD, 'A']; if (wD > 0.5) hIsaret = ['L', h]; Z.B.vurgu = H.nabiz(t, tm.kim + 0.3); Z.C.vurgu = H.nabiz(t, tm.kazanir - 0.25); }
  }
  // yakın: B'yi kaldırır, üç kez çevirir (8 → 6 → 1 → 8), geri koyar; h3'te tavla takımına dokunur
  if (id === 'yakin') {
    const kal = [ZX.B + 40, MASA.y - 150], al0 = tm.yakin + 0.15, kalk = al0 + 0.35, in0 = tm.neden - 0.05, in1 = in0 + 0.4;
    const cev = [kalk + 0.25, kalk + 0.6, kalk + 0.95];
    const wB = pIn(t, al0 - 0.28, in1 + 0.05, 0.28);
    if (t >= al0 && t < in1) {
      const p = t < kalk ? H.tasi(t, al0, kalk - al0, [ZX.B, MASA.y], kal, 20) : t < in0 ? kal : H.tasi(t, in0, in1 - in0, kal, [ZX.B, MASA.y], 20);
      const sira = [8, 6, 1, 8]; let k = 0, rot = 0;
      cev.forEach((c, i) => { if (t >= c) k = i + 1; const u = seg(t, c - 0.12, 0.24); if (u > 0 && u < 1) rot = Math.sin(u * Math.PI) * 0.5; });
      Z.B.p = p; Z.B.n = sira[k]; Z.B.rot = rot;
    }
    if (wB > 0.01) { ho.L = [[Z.B.p[0] + 48, Z.B.p[1] - ZS / 2], wB, 'A']; if (t >= al0 && t < in1) hTut = 'L'; }
    const wK = pIn(t, tm.tavla - 0.35, tm.tavla + 0.9, 0.28);
    if (wK > 0.01) ho.R = [[KUTU[0] - 70, KUTU[1] - 80 - 8 * H.nabiz(t, tm.tavla + 0.05, 0.3)], wK, 'A'];
    kutuKab = H.nabiz(t, tm.tavla + 0.05, 0.36);
  }
  // oyun: Defne A'yı alır, gösterir, atar; Hikmet C'yi alır; dokuz atış, pullar yığınlara düşer
  if (id === 'oyun' || id === 'sayac' || id === 'buldum' || id === 'espri' || id === 'cta') {
    const atis = t >= tm.oyun;
    if (atis && id === 'oyun') {
      const al0 = tm.dokuzlu + 0.15, kalk = al0 + 0.35, goster = [ZX.A - 70, 1080];
      if (t < tm.r[0] - HAVA) {
        if (t >= al0) Z.A.p = t < kalk ? H.tasi(t, al0, kalk - al0, [ZX.A, MASA.y], [goster[0], goster[1] + ZS / 2], 30) : [goster[0], goster[1] + ZS / 2];
        dO.R = [[Z.A.p[0] - 44, Z.A.p[1] - ZS / 2], W(t, al0 - 0.28, 0.28), 'A']; if (t >= al0) dTut = 'R';
      } else {
        const a = atisZar(t, tm, 'A', ZX.A);
        if (t < tm.r[0]) { const u = clamp01((t - (tm.r[0] - HAVA)) / HAVA); a.p = H.yay([goster[0], goster[1] + ZS / 2], [ZX.A, MASA.y], u, 60); }
        Z.A = { ...Z.A, ...a };
        const w = 1 - W(t, tm.r[8] + 0.2, 0.35), hov = a.havada ? a.p : [ZX.A, MASA.y - 40];
        dO.R = [[hov[0] - 70, hov[1] - 96], w, 'A'];
      }
      // Hikmet C'yi alır ("en"), sonra atar
      const cAl = tm.enB;
      if (t >= cAl && t < tm.r[0] - HAVA) { const k = H.tasi(t, cAl, 0.35, [ZX.C, MASA.y], [ZX.C + 10, MASA.y - 60], 20); Z.C.p = k; hTut = 'L'; }
      if (t >= tm.r[0] - HAVA) { const c = atisZar(t, tm, 'C', ZX.C); if (t < tm.r[0]) { const u = clamp01((t - (tm.r[0] - HAVA)) / HAVA); c.p = H.yay([ZX.C + 10, MASA.y - 60], [ZX.C, MASA.y], u, 50); } Z.C = { ...Z.C, ...c }; }
      const wH = pIn(t, cAl - 0.28, tm.r[8] + 0.3, 0.28), hov = Z.C.p;
      if (wH > 0.01) ho.L = [[hov[0] + 30, hov[1] - (hTut ? ZS / 2 : 120)], wH, 'A'];
    } else if (atis && id !== 'buldum') { Z.A.n = ATIS[8][0]; Z.C.n = ATIS[8][1]; }
    if (id === 'espri' || id === 'cta') { Z.A.n = 9; Z.C.n = 7; }
  }
  // sayaç: Defne A'yı alır, çevirir (2 → 4 → 9 → 2), bırakır; parmakla sayar; Hikmet C'ye dokunur
  let dParmak = 0;
  if (id === 'sayac') {
    const kal = [ZX.A - 92, 1080 + ZS / 2], wA = pIn(t, tm.sAl - 0.28, tm.sBirak + 0.4, 0.28);
    if (t >= tm.sAl && t < tm.sBirak + 0.4) {
      const p = t < tm.sAl + 0.4 ? H.tasi(t, tm.sAl, 0.4, [ZX.A, MASA.y], kal, 20) : t < tm.sBirak ? kal : H.tasi(t, tm.sBirak, 0.4, kal, [ZX.A, MASA.y], 20);
      const sira = [2, 4, 9, 2]; let k = -1, rot = 0;
      tm.sCevir.forEach((c, i) => { if (t >= c) k = i; const u = seg(t, c - 0.12, 0.24); if (u > 0 && u < 1) rot = -Math.sin(u * Math.PI) * 0.5; });
      Z.A.p = p; Z.A.n = k < 0 ? ATIS[8][0] : sira[k]; Z.A.rot = rot; dTut = 'R';
    }
    if (wA > 0.01) dO.R = [[Z.A.p[0] - 44, Z.A.p[1] - ZS / 2], wA, 'A'];
    dParmak = t >= tm.sSay && t < tm.sDusun - 0.1 ? 1 + 2 * clamp01((t - tm.sSay) / 1.4) : 0;
    if (dParmak) dO.R = [[DEF_X + 150, 1060], pIn(t, tm.sSay - 0.25, tm.sDusun - 0.15, 0.25), 'A'];
    const wT = pIn(t, tm.hTik - 0.3, tm.hTik + 0.7, 0.28);
    if (wT > 0.01) { ho.L = [[ZX.C + 20, MASA.y - ZS - 50], wT, 'A']; if (wT > 0.5) hIsaret = ['L', [ZX.C + 4, MASA.y - ZS - 6 + 6 * H.nabiz(t, tm.hTik, 0.3)]]; Z.C.vurgu = H.nabiz(t, tm.hTik, 0.34); }
  }
  // espri: Hikmet tavla takımını masada Defne'ye doğru iter
  if (id === 'espri') {
    kutuP = yol(t, [[tm.tavlaH - 0.05, [800, MASA.y + 18]], [tm.tavlaH + 0.75, [530, MASA.y + 18]]]);
    ho.R = [[kutuP[0] + 70, kutuP[1] - 70], 1, 'A'];
  }
  // çağrı: Defne tavla takımını tutamağından kaldırır
  if (id === 'cta') {
    const g = H.elYeri('defne', dp, 'R', 'gogus');
    dO.R = [[g[0] + 40, g[1] - 90 - 40 * W(t, tm.cta + 0.05, 0.4)], 1, 'A']; dTut = 'R';
  }

  // ——— çizim: Hikmet → masa → yüz kartları → zarlar → pul yığınları → bardak → dolap üstü → Defne → tutan eller ———
  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  masa(K);
  for (const z of ['A', 'B', 'C']) yuzKarti(K, ZX[z], KART_Y, z);
  bardak(K, BARDAK[0], BARDAK[1], t);
  if (id === 'oyun' || id === 'sayac') {
    const pa = pulAnlari(tm), yd = id === 'sayac' ? t >= tm.sayac : true;
    if (yd) { yigin(K, STACK.D, 3, 0, pa.D, t); yigin(K, STACK.H, 6, 1, pa.H, t); }
    // düşmekte olan pul
    ATIS.forEach(([a, c], i) => {
      const t0 = tm.r[i] - 0.05, t1 = tm.r[i] + 0.1; if (t < t0 || t >= t1) return;
      const dWin = a > c, sx = dWin ? STACK.D : STACK.H, n = (dWin ? pa.D : pa.H).indexOf(t1);
      pul(K, sx, lerp(MASA.y - 160, MASA.y + 4 - n * 11, ((t - t0) / (t1 - t0)) ** 2), dWin ? 0 : 1);
    });
  }
  const ciz = z => { const d = Z[z]; zar(K, d.p[0], d.p[1], z, d.n, { rot: d.rot || 0, vurgu: d.vurgu || 0 }); };
  ciz('B'); ciz('C'); if (!dTut && id !== 'buldum') ciz('A');
  if (id !== 'espri') tavlaKutu(K, KUTU[0], KUTU[1], { kab: kutuKab });
  if (hTut) hc.tut(hTut);
  if (hIsaret) hc.isaret(hIsaret[0], hIsaret[1]);
  if (id === 'espri') { tavlaKutu(K, kutuP[0], kutuP[1]); hc.tut('R'); }
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (dTut === 'R' && id !== 'cta') { ciz('A'); dc.tut('R'); }
  if (id === 'cta') { tavlaKutu(K, dc.handR[0], dc.handR[1] + 122, { k: 0.9 }); dc.tut('R'); }
  if (dParmak) dc.parmak('R', dParmak, { toplam: 3 });
  if (id === 'buldum') { zar(K, dc.handR[0] + 4, dc.handR[1] - 20, 'A', 9, { k: 0.8 }); dc.tut('R'); H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof }); }
}

// ——— Çay ocağı: Necmi ile Kerem taş-kâğıt-makas oynar ———
function cayOcagi(K, t, tl, S, B) {
  const { tm } = S, { heads } = B;
  M.mekanCiz(K, 'cayOcagi', 'arka', t, { isik: M.ISIK.gunduz, durum: { saat: 15.4 + t / 60 } });
  const np = H.poseAt(H.CARDS.necmi, S.necBase, [], t), kp = H.poseAt(H.CARDS[H.KEREM], S.kerBase, [], t);
  // tur durumu: sallama (iki iniş-kalkış, 0,5 sn) → ortaya çıkış
  let cur = null, sal = 0;
  for (const tr of tm.tur) { if (t >= tr[0] - 0.5) cur = tr; }
  if (cur) { const u = seg(t, cur[0] - 0.5, 0.5); if (u < 1) sal = Math.abs(Math.sin(u * Math.PI * 2)); }
  const acik = cur && t >= cur[0];
  const ng = acik ? cur[1] : 'tas', kg = acik ? cur[2] : 'tas';
  const vur = acik ? ease.state(seg(t, cur[0] + 0.06, 0.18)) * (1 - ease.state(seg(t, cur[0] + 0.5, 0.3))) : 0;
  const kayb = acik ? H.sars(t, cur[0] + 0.2, 0.4, 9) : 0;
  const nEl = [800 + 24 * vur, 1160 - 40 * sal], kEl = [1032 - 14 * kayb, 1160 - 40 * sal];
  if (acik) { np.expr = 'mutlu'; kp.expr = t < cur[0] + 0.22 ? 'notr' : 'yorgun'; kp.head = { ...kp.head, tilt: 6, look: [-0.7, 0.55] }; }
  const nc = oyna(K, t, tl, 'necmi', np, { heads, R: [[nEl[0] - 40, nEl[1] + 10], 1, 'A'] });
  const kc = oyna(K, t, tl, H.KEREM, kp, { heads, L: [[kEl[0] + 40, kEl[1] + 10], 1, 'A'], sessiz: true });
  elSekli(K, H.KEREM, kc.handL, kp.s, kg, -1);
  elSekli(K, 'necmi', nc.handR, np.s, ng, 1, { kapa: ng === 'makas' ? vur : 0 });
}

// ——— Tepsi (kuşbakışı): üç zar dairenin köşelerinde, "yener" okları daire çizer ———
function tepsi(K, t, tl, S, B) {
  const { tm } = S, { ctx } = K;
  // masa (ahşap, kuşbakışı)
  ctx.fillStyle = PAL.woodTop; ctx.fillRect(-200, -200, 1480, 2320);
  for (let i = 0; i < 9; i++) K.line(-200, 120 + i * 230, 1280, 120 + i * 230 + 30, 4, PAL.wood);
  // tepsi
  K.circ(TP.c[0] + 12, TP.c[1] + 16, TP.R + 18, 'rgba(20,30,28,0.3)', 0);
  K.circ(TP.c[0], TP.c[1], TP.R + 18, '#B8913E', LW);
  K.circ(TP.c[0], TP.c[1], TP.R - 8, '#D9B65E', LW * 0.6);
  // çay bardağı (döngü: buhar) tepsinin ortasında
  K.circ(TP.c[0], TP.c[1], 46, PAL.cream, LW * 0.6); K.circ(TP.c[0], TP.c[1], 30, '#A8401F', LW * 0.6);
  H.buhar(K, TP.c[0], TP.c[1] - 24, t, { k: 0.55, n: 2, ara: 16, boy: 80 });
  // oklar: A→B ("Dokuzlu sekizliyi"), B→C ("sekizli yediliyi"), C→A ("yedili de dokuzluyu"); el ok ucunu izler
  const OK = [[tm.o[0], 'A', 'B'], [tm.o[1], 'B', 'C'], [tm.o[2], 'C', 'A']];
  const okU = i => ease.state(seg(t, OK[i][0][0], OK[i][0][1] - OK[i][0][0]));
  const flash = H.nabiz(t, tm.alir, 0.5);
  okYay(K, 'A', 'B', okU(0), PAL.mustard); okYay(K, 'B', 'C', okU(1), PAL.mustard);
  okYay(K, 'C', 'A', okU(2), flash > 0.05 ? H.mixHex(PAL.mustard, YESIL, flash) : PAL.mustard, 18 + 6 * flash);
  // dönen işaret (döngü): oklar tamamlandıktan sonra daire boyunca dolaşır
  if (t > tm.yener + 0.2) { const a = (-90 + 30 + ((t - tm.yener - 0.2) * 140) % 360) * Math.PI / 180; K.circ(TP.c[0] + TP.r * Math.cos(a), TP.c[1] + TP.r * Math.sin(a), 14, PAL.paper, LW * 0.6); }
  // zarlar: A önce Defne'nin elinde gelir; d5'te A Defne'ye, C Hikmet'e çekilir
  const aP = t < tm.var ? H.tasi(t, tm.cember + 0.1, 0.7, [540, 1500], kose('A'), 40) : kose('A');
  const aCek = ease.state(seg(t, tm.secen - 0.25, 0.4)), cCek = ease.state(seg(t, tm.yenenZ + 0.15, 0.4));
  const cDis = kose('C', TP.r + 80), P = { A: aP, B: kose('B'), C: [lerp(kose('C')[0], cDis[0], cCek), lerp(kose('C')[1], cDis[1] - 40, cCek)] };
  const vur = { A: H.nabiz(t, tm.o[0][0]) + H.nabiz(t, tm.o[2][1] - 0.1), B: H.nabiz(t, tm.o[0][1] - 0.1) + H.nabiz(t, tm.o[1][0]), C: H.nabiz(t, tm.o[1][1] - 0.1) + H.nabiz(t, tm.o[2][0]) };
  if (aCek > 0.01) { ctx.save(); ctx.globalAlpha = aCek; ctx.beginPath(); ctx.arc(P.A[0], P.A[1], 112, 0, TAU); ctx.lineWidth = 12; ctx.strokeStyle = ZAR.A.koyu; ctx.stroke(); ctx.restore(); }
  for (const z of ['B', 'C', 'A']) { zarUst(K, P[z], z, { vurgu: vur[z] }); }
  // yüz kartları (zarların dış yanında, sabit)
  const kart = { A: [kose('A')[0] + 205, kose('A')[1]], B: [kose('B')[0] - 8, kose('B')[1] + 175], C: [P.C[0] + 8, P.C[1] + 175] };
  for (const z of ['A', 'B', 'C']) yuzKarti(K, kart[z][0], kart[z][1], z, 0.92);
  // Defne'nin kolu (alttan): A'yı getirir, okları parmağıyla izler, A'yı kendine çeker
  const ok = (za, zb, u) => { const a0 = KOSE[za] + 30, a1 = (KOSE[zb] < KOSE[za] ? KOSE[zb] + 360 : KOSE[zb]) - 30, a = (a0 + (a1 - a0) * u) * Math.PI / 180; return [TP.c[0] + TP.r * Math.cos(a), TP.c[1] + TP.r * Math.sin(a)]; };
  const cekYer = [P.A[0] + 70, P.A[1] + 110];
  let dEl = null, onceki = [tm.var, [kose('A')[0] + 10, kose('A')[1] + 70]];
  if (t < tm.var) dEl = [aP[0] + 10, aP[1] + 70];
  else for (let i = 0; i < 3 && !dEl; i++) {
    const [[a, b], za, zb] = OK[i];
    if (t < a) dEl = yol(t, [onceki, [a, ok(za, zb, 0)]]);
    else if (t <= b) dEl = ok(za, zb, okU(i));
    onceki = [b, ok(za, zb, 1)];
  }
  if (!dEl) dEl = t < tm.secen - 0.25 ? yol(t, [onceki, [tm.secen - 0.25, cekYer]]) : cekYer;
  const dKok = [dEl[0] + (dEl[0] - 540) * 2.2 + 60, 2120];   // kol ok ucundan dışa doğru iner, zarları örtmez
  ustKol(K, 'defne', dKok, dEl, { isaret: t >= tm.var && t < tm.o[2][1] + 0.2 });
  // Hikmet'in kolu (üstten sol): C'yi alır
  const hW = pIn(t, tm.yenenZ - 0.25, tm.espri + 1, 0.3);
  if (hW > 0.01) {
    const hedef = [P.C[0] - 6, P.C[1] - 66], kok = [-140, -160], el = [lerp(kok[0] + 120, hedef[0], hW), lerp(kok[1] + 120, hedef[1], hW)];
    ustKol(K, 'hikmet', kok, el, { isaret: false });
  }
}
