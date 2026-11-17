// Bölüm 48 · BİLDİĞİNİ SANAN BALIKÇI (v4 "hikâye" dili; storyboard: hikayeler/bolum_048_v5.md). 017'ye gönderme.
// Logline: Hikmet yine balıktan döner, kovası kapalıdır. "İkisi hariç hepsi lüfer, ikisi hariç hepsi istavrit" der. Defne
// 017'nin ezber cevabını verir: "Üç!". Kovanın üstünde hayal ettiği üç balıktan biri ne lüfer ne istavrit olabilir.
// Necmi'nin çerçevesindeki iki kedi, iki köpek ona yolu gösterir: kova gazetenin üstüne dökülür, iki lüfer, iki istavrit.
// Akılda kalacak tek şey: aynı cümle üç türde 3, iki türde 4 balık demektir; ezber cevap tutmaz.
// Mekânlar: iskele (önden; korkuluk, deniz, siluet, vapur, mangal, olta) · Necmi'nin evi (çerçeve yakın planı) ·
// gazete yakın planı (kuşbakışı). Her kare t'nin saf fonksiyonudur; Math.random yok.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Mantık denetimi ═══════════════════════════
// Türler T, her türden x_i balık, toplam n. "İkisi hariç hepsi i" → x_i = n − 2. Toplam: T(n − 2) = n.
function cozum(T) { const out = []; for (let n = 1; n <= 40; n++) if (T * (n - 2) === n && n - 2 >= 1) out.push(n); return out; }
{ const c2 = cozum(2), c3 = cozum(3), c4 = cozum(4); if (c2.join() !== '4' || c3.join() !== '3' || c4.length) console.warn('b048: mantık denetimi tutmadı', c2, c3, c4); }

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ISKELE = 'b048_iskele', EV = 'b048_ev', ZEMIN = 1500, UFUK = 1095, KORKULUK = 1345;
const DEF_X = 270, HIK_X = 815, NEC_X = 560;
const KASA = { x0: 355, x1: 735, y: 1360 }, KOVA = [545, 1360], KK = 1.2, KOVA_H = 170 * KK, KOVA_WT = 156 * KK, KOVA_WB = 124 * KK;
const MANGAL = [1010, 1300];
const OLTA = { dip: [1105, 1352], uc: [1190, 835], mantar: [1236, 1215] };
const YESIL = PAL.green, MERCAN = PAL.coral;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
function yol(t, d) {
  if (t <= d[0][0]) return d[0][1];
  for (let i = 1; i < d.length; i++) if (t < d[i][0]) { const u = ease.state((t - d[i - 1][0]) / (d[i][0] - d[i - 1][0])); return kar(d[i - 1][1], d[i][1], u); }
  return d[d.length - 1][1];
}

// ═══════════════════════════ Balıklar ═══════════════════════════
// Lüfer büyük ve koyu yeşil-mavi; istavrit küçük, gümüşi, yan çizgili (pullu); hamsi ince (017'nin üçüncü türü).
const BALIK = {
  lufer: { L: 300, H: 96, sirt: '#2C5A60', karin: '#A9C4BD', yuz: '#3F7175', goz: 0.2 },
  istavrit: { L: 196, H: 64, sirt: '#8D9FA4', karin: '#DCE3E0', yuz: '#A7B5B3', goz: 0.33 },
  hamsi: { L: 150, H: 34, sirt: '#3F5A66', karin: '#C9D3D3', yuz: '#56707A', goz: 0.3 },
};
function govdeYolu(ctx, b, h) {
  ctx.beginPath(); ctx.moveTo(b, 0);
  ctx.bezierCurveTo(b * 0.8, -h * 0.95, b * 0.15, -h * 1.02, -b * 0.35, -h * 0.82);
  ctx.bezierCurveTo(-b * 0.72, -h * 0.58, -b * 0.95, -h * 0.26, -b, -h * 0.17);
  ctx.lineTo(-b, h * 0.17);
  ctx.bezierCurveTo(-b * 0.95, h * 0.26, -b * 0.72, h * 0.58, -b * 0.35, h * 0.82);
  ctx.bezierCurveTo(b * 0.15, h * 1.02, b * 0.8, h * 0.95, b, 0);
  ctx.closePath();
}
// (x, y) gövde merkezi; baş sağda (yon −1: solda). hayal 0..1: soluk hayalet balık (kesik çizgi); a: saydamlık
export function balik(K, x, y, tur, { k = 1, rot = 0, yon = 1, hayal = 0, a = 1, vurgu = 0, renk = null } = {}) {
  const { ctx } = K, B = BALIK[tur], b = B.L * 0.42, h = B.H / 2, s = k * (1 + 0.12 * vurgu), lw = LW * 0.8 / s;
  if (a <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * yon, s); ctx.globalAlpha *= a;
  const sirt = renk || (hayal > 0 ? H.mixHex(B.sirt, '#EEF3F1', 0.5 * hayal) : B.sirt);
  const karin = hayal > 0 ? H.mixHex(B.karin, '#F6F8F6', 0.4 * hayal) : B.karin;
  const yuz = hayal > 0 ? H.mixHex(B.yuz, '#EEF3F1', 0.5 * hayal) : B.yuz;
  const cizgi = hayal > 0.5 ? '#6E8E8A' : INK;
  if (hayal > 0.5) ctx.setLineDash([16 / s, 11 / s]);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const kontur = (fill) => { ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = cizgi; ctx.stroke(); };
  // kuyruk (çatal)
  ctx.beginPath(); ctx.moveTo(-b + 6, 0); ctx.lineTo(-b - B.L * 0.17, -h * 1.08); ctx.quadraticCurveTo(-b - B.L * 0.08, -h * 0.2, -b - B.L * 0.1, 0);
  ctx.quadraticCurveTo(-b - B.L * 0.08, h * 0.2, -b - B.L * 0.17, h * 1.08); ctx.closePath(); kontur(yuz);
  // sırt yüzgeci
  if (tur === 'lufer') { ctx.beginPath(); ctx.moveTo(b * 0.25, -h * 0.92); ctx.lineTo(b * 0.05, -h * 1.35); ctx.lineTo(-b * 0.12, -h * 0.98); ctx.closePath(); kontur(yuz); ctx.beginPath(); ctx.moveTo(-b * 0.18, -h * 0.94); ctx.lineTo(-b * 0.3, -h * 1.3); ctx.lineTo(-b * 0.75, -h * 0.6); ctx.closePath(); kontur(yuz); }
  else { ctx.beginPath(); ctx.moveTo(b * 0.2, -h * 0.95); ctx.lineTo(-b * 0.1, -h * 1.4); ctx.lineTo(-b * 0.55, -h * 0.75); ctx.closePath(); kontur(yuz); }
  // gövde: karın rengi, üst yarı sırt rengi
  govdeYolu(ctx, b, h); ctx.fillStyle = karin; ctx.fill();
  ctx.save(); govdeYolu(ctx, b, h); ctx.clip();
  ctx.beginPath(); ctx.moveTo(b + 10, -h * 0.1); ctx.bezierCurveTo(b * 0.4, h * 0.15, -b * 0.4, h * 0.1, -b - 10, -h * 0.05); ctx.lineTo(-b - 10, -h * 2); ctx.lineTo(b + 10, -h * 2); ctx.closePath();
  ctx.fillStyle = sirt; ctx.fill();
  ctx.restore();
  govdeYolu(ctx, b, h); ctx.lineWidth = lw; ctx.strokeStyle = cizgi; ctx.stroke();
  ctx.setLineDash([]);
  if (hayal > 0.5) { ctx.restore(); return; }
  // yan çizgi (istavrit: kavisli, arkası pullu)
  if (tur === 'istavrit') {
    ctx.beginPath(); ctx.moveTo(b * 0.62, -h * 0.42); ctx.quadraticCurveTo(b * 0.1, -h * 0.4, -b * 0.08, h * 0.08); ctx.lineTo(-b * 0.98, h * 0.08);
    ctx.lineWidth = 6 / s; ctx.strokeStyle = '#3C4A4E'; ctx.stroke();
    for (let i = 0; i < 9; i++) { const xx = -b * 0.12 - i * b * 0.095; K.line(xx, h * 0.08 - 7 / s, xx, h * 0.08 + 7 / s, 3.5 / s, '#3C4A4E'); }
  }
  if (tur === 'lufer') { ctx.beginPath(); ctx.moveTo(b * 0.98, h * 0.14); ctx.lineTo(b * 0.66, h * 0.3); ctx.lineWidth = 5 / s; ctx.strokeStyle = INK; ctx.stroke(); }
  // solungaç ve göz
  ctx.beginPath(); ctx.arc(b * 0.95, 0, b * 0.36, Math.PI * 0.78, Math.PI * 1.22); ctx.lineWidth = 4 / s; ctx.strokeStyle = INK; ctx.stroke();
  const gr = h * B.goz; K.circ(b * 0.74, -h * 0.22, gr + 3 / s, PAL.paper, 3 / s); K.circ(b * 0.75, -h * 0.22, gr * 0.6, INK, 0);
  ctx.restore();
}

// ═══════════════════════════ Nesneler (önden) ═══════════════════════════
// Kova: (x, yb) taban ortası. kapak: { dy, rot, var } · acik: ağız görünür
function kova(K, x, yb, { kapak = { dy: 0, rot: 0, var: true }, k = 1 } = {}) {
  const { ctx } = K, h = KOVA_H * k, wt = KOVA_WT * k, wb = KOVA_WB * k; k *= KK;
  ctx.save();
  ctx.beginPath(); ctx.arc(x, yb - h + 30 * k, wt / 2 - 2, 0.12 * Math.PI, 0.88 * Math.PI); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = PAL.metal; ctx.stroke();
  K.poly([[x - wb / 2, yb], [x + wb / 2, yb], [x + wt / 2, yb - h], [x - wt / 2, yb - h]], '#E8E2D4', LW);
  K.poly([[x - wt / 2 + 4, yb - h + 22 * k], [x + wt / 2 - 4, yb - h + 22 * k], [x + wt / 2 - 7, yb - h + 44 * k], [x - wt / 2 + 7, yb - h + 44 * k]], PAL.teal, LW * 0.6);
  K.line(x - wt * 0.28, yb - h + 60 * k, x - wb * 0.3, yb - 14, 5, '#CFC7B5');
  if (!kapak.var) K.ell(x, yb - h, wt / 2, 13 * k, '#3E5E5E', LW * 0.8);
  else {
    ctx.save(); ctx.translate(x + wt / 2 + 8, yb - h + 4 + (kapak.dy || 0)); ctx.rotate(kapak.rot || 0);
    K.rect(-wt - 16, -18 * k, wt + 16, 22 * k, '#2F7F7A', LW, 8); K.rect(-wt / 2 - 8 - 20 * k, -32 * k, 40 * k, 16 * k, '#23605C', LW * 0.7, 5);
    ctx.restore();
  }
  ctx.restore();
}
const kapakKulp = (dy = 0) => [KOVA[0], KOVA[1] - KOVA_H - 26 + dy];
// Kasa (ters çevrilmiş balık kasası)
function kasa(K) {
  const { x0, x1, y } = KASA;
  K.rect(x0, y, x1 - x0, ZEMIN - y, '#B9894F', LW, 4);
  for (const yy of [y + 46, y + 92]) K.line(x0 + 8, yy, x1 - 8, yy, 5, '#8A6236');
  K.rect(x0 + 30, y + 52, 70, 26, '#8A6236', 0, 10); K.rect(x1 - 100, y + 52, 70, 26, '#8A6236', 0, 10);
}
// Gazete (kasanın üstünde, önden ince şerit) ve üstünde yatan balıklar
function gazeteOn(K, balikVar = 4) {
  K.poly([[KASA.x0 + 20, KASA.y - 4], [KASA.x0 + 270, KASA.y - 4], [KASA.x0 + 262, KASA.y + 6], [KASA.x0 + 26, KASA.y + 6]], '#EFE9DA', LW * 0.6);
  const L = [['lufer', 470, 0.5], ['istavrit', 430, 0.55], ['lufer', 520, 0.5], ['istavrit', 560, 0.55]];
  L.slice(0, balikVar).forEach(([tur, x, k], i) => balik(K, x, KASA.y - 14 - (i % 2) * 6, tur, { k, rot: i % 2 ? 0.06 : -0.04, yon: i < 2 ? 1 : -1 }));
}
// Mangal: kömür, ızgara, duman (döngü)
function mangal(K, t, puf = 0) {
  const [x, y] = MANGAL;
  K.line(x - 60, y + 10, x - 76, ZEMIN, 8); K.line(x + 60, y + 10, x + 76, ZEMIN, 8); K.line(x, y + 10, x, ZEMIN - 10, 8);
  K.poly([[x - 92, y - 46], [x + 92, y - 46], [x + 70, y + 14], [x - 70, y + 14]], '#3A4442', LW);
  for (let i = 0; i < 6; i++) K.circ(x - 62 + i * 25, y - 48, 13, i % 2 ? '#C9542E' : '#8C3A22', 3);
  K.line(x - 96, y - 58, x + 96, y - 58, 6, PAL.metalDark);
  for (let i = 0; i < 8; i++) K.line(x - 84 + i * 24, y - 64, x - 84 + i * 24, y - 52, 4, PAL.metalDark);
  H.buhar(K, x - 20, y - 70, t, { k: 0.9 + 0.5 * puf, n: 3, renk: '#DCD5C8', periyot: 2.1, ara: 30, boy: 150 });
}
// Olta: dip → uç; misina uçtan sarkar, ucunda mantar (denizde) ya da kanca + kart
function olta(K, dip, uc, ucu, { kart = null } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, dip, uc, 16, INK); H.strokeLine(ctx, dip, uc, 9, '#4B3A2A');
  const m = kar(dip, uc, 0.18); K.circ(m[0], m[1], 16, PAL.metal, 4);
  ctx.beginPath(); ctx.moveTo(uc[0], uc[1]); ctx.quadraticCurveTo((uc[0] + ucu[0]) / 2 + 14, (uc[1] + ucu[1]) / 2, ucu[0], ucu[1]); ctx.lineWidth = 3; ctx.strokeStyle = '#2B3A3A'; ctx.stroke();
  ctx.restore();
  if (kart) {
    const { ctx: c } = K; c.save(); c.translate(ucu[0], ucu[1]); c.rotate(kart.rot || 0);
    c.beginPath(); c.arc(0, 18, 12, -Math.PI / 2, Math.PI * 0.9); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
    K.rect(-62, 30, 124, 140, PAL.paper, LW, 12); K.text('3', 0, 142, 112, MERCAN, 900);
    c.restore();
  } else {
    K.ell(ucu[0], ucu[1], 13, 18, PAL.red, 4); K.rect(ucu[0] - 13, ucu[1] - 2, 26, 8, PAL.paper, 0);
  }
}
// İstanbul silueti (ufukta): cami, Galata Kulesi, alçak yapılar
function siluet(K, I) {
  const { ctx } = K, y = UFUK, renk = H.mixHex(I.sehir, I.gok, 0.3);
  ctx.save(); ctx.fillStyle = renk; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  const blok = [[-500, 60], [-380, 40], [-260, 70], [-140, 45], [470, 55], [560, 38], [1010, 50], [1120, 70], [1260, 42], [1380, 60], [1500, 45]];
  for (const [x, h] of blok) { ctx.beginPath(); ctx.rect(x, y - h, 120, h); ctx.fill(); ctx.stroke(); }
  // cami (x 140)
  const cx = 140;
  ctx.beginPath(); ctx.rect(cx - 120, y - 70, 240, 70); ctx.fill(); ctx.stroke();
  for (const [dx, r] of [[-80, 34], [80, 34]]) { ctx.beginPath(); ctx.arc(cx + dx, y - 70, r, Math.PI, 0); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(cx, y - 70, 74, Math.PI, 0); ctx.fill(); ctx.stroke();
  K.line(cx, y - 144, cx, y - 166, 4);
  for (const dx of [-150, 150, -205, 205]) { const hh = Math.abs(dx) > 180 ? 170 : 200; ctx.beginPath(); ctx.rect(cx + dx - 8, y - hh, 16, hh); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + dx - 9, y - hh); ctx.lineTo(cx + dx, y - hh - 34); ctx.lineTo(cx + dx + 9, y - hh); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  // Galata Kulesi (x 860)
  const gx = 860;
  ctx.beginPath(); ctx.rect(gx - 34, y - 190, 68, 190); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(gx - 42, y - 206, 84, 18); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(gx - 40, y - 206); ctx.lineTo(gx, y - 276); ctx.lineTo(gx + 40, y - 206); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function vapur(K, x, y) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y);
  K.poly([[-90, -6], [96, -6], [80, 20], [-78, 20]], '#3A4442', 4);
  K.rect(-66, -40, 120, 34, PAL.paper, 4, 4); K.rect(-6, -66, 22, 28, PAL.coral, 4, 3);
  for (let i = 0; i < 5; i++) K.rect(-56 + i * 22, -32, 12, 12, '#6E9A9A', 0, 2);
  ctx.restore();
}
function marti(K, x, y, k = 1) {
  const { ctx } = K; ctx.beginPath(); ctx.moveTo(x - 18 * k, y); ctx.quadraticCurveTo(x - 9 * k, y - 11 * k, x, y); ctx.quadraticCurveTo(x + 9 * k, y - 11 * k, x + 18 * k, y);
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(ISKELE, {
  gen: [-500, 1600], dongu: ['denizde dalga çizgileri ve geçen vapur', 'martılar', 'mangal dumanı', 'oltanın mantarı'],
  capa: { kova: KOVA, mangal: MANGAL }, kadraj: { genis: [1.06, 545, 1110] },
  arka(K, t, { isik }) {
    const I = isik, { ctx } = K;
    M.gok(K, -700, -600, 2600, UFUK + 600, { isik: I, gunes: 0.3, r: 64 });
    for (let i = 0; i < 3; i++) { const xx = -500 + ((i * 760 + t * (9 + i * 3)) % 2300); M.bulut(K, xx, 560 + i * 120, 1 - i * 0.15, H.mixHex('#FBF6EC', I.gok, 0.25)); }
    siluet(K, I);
    // deniz
    ctx.fillStyle = I.deniz; ctx.fillRect(-700, UFUK, 2600, KORKULUK - UFUK + 10);
    K.line(-700, UFUK, 1900, UFUK, 4);
    vapur(K, -420 + ((t * 26 + 300) % 2200), UFUK + 36);
    for (const [y, v, w] of [[UFUK + 40, 18, 40], [UFUK + 85, 26, 56], [UFUK + 140, 34, 72], [UFUK + 200, 44, 90]]) {
      for (let x = -700; x < 1900; x += 230) { const xx = x + ((t * v) % 230) + (y % 97); K.line(xx, y, xx + w, y, 4, H.mixHex(I.deniz, '#F4EDE0', 0.45)); }
    }
    marti(K, -200 + ((t * 70) % 1700), 760 + 14 * Math.sin(t * 1.4), 1.1);
    marti(K, 300 + ((t * 55 + 500) % 1700) - 500, 860 + 10 * Math.sin(t * 1.1 + 2), 0.85);
    // korkuluk
    for (let x = -480; x < 1700; x += 170) K.rect(x - 9, KORKULUK - 112, 18, 112, '#8A6236', LW * 0.7, 3);
    K.rect(-520, KORKULUK - 124, 2260, 18, '#A8743F', LW * 0.8, 6);
    K.line(-520, KORKULUK - 62, 1740, KORKULUK - 62, 5, '#D7CBB2');
    // iskele tahtaları
    ctx.fillStyle = '#B8925E'; ctx.fillRect(-700, KORKULUK, 2600, 1300);
    for (const dy of [30, 75, 135, 215, 320]) K.line(-700, KORKULUK + dy, 1900, KORKULUK + dy, 3, '#9C7A4C');
    for (let x = -600; x < 1900; x += 210) K.line(x, KORKULUK, x - 120, KORKULUK + 400, 3, '#9C7A4C');
    K.line(-700, KORKULUK, 1900, KORKULUK, LW);
  },
});
M.mekanEkle(EV, {
  gen: [0, 1200], dongu: ['duvar saatinin saniye kolu', 'çay buharı'],
  arka(K, t, { isik }) {
    M.oda(K, { x0: -300, x1: 1500, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.duvarSaati(K, 1090, 820, 56, 19.4 + t / 60, t);
    M.pencere(K, 110, 560, 230, 300, { isik: M.ISIK.aksam, t });
    // konsol ve çay
    K.rect(700, 1230, 480, 24, PAL.woodTop, LW, 6); K.rect(720, 1254, 440, 246, PAL.wood, LW, 4); K.line(940, 1260, 940, 1490, 4, PAL.woodDark);
    K.ell(1110, 1228, 26, 7, PAL.cream, LW * 0.5); K.poly([[1096, 1176], [1124, 1176], [1118, 1226], [1102, 1226]], '#B5532A', LW * 0.6);
    H.buhar(K, 1110, 1166, t, { k: 0.7 });
  },
});

// Çerçeve (Necmi'nin evi): iki kedi solda, iki köpek sağda. Yerel: merkez (0, 0), 340 × 250
const CW = 340, CH = 250;
function kedi(K, x, y, renk, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(28, 30); ctx.quadraticCurveTo(70, 20, 52, -20); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = renk; ctx.stroke();
  K.ell(10, 26, 36, 30, renk, 4);
  K.poly([[-28, -32], [-22, -62], [-6, -40]], renk, 4); K.poly([[6, -40], [22, -62], [28, -32]], renk, 4);
  K.circ(0, -22, 30, renk, 4);
  K.circ(-11, -26, 4.5, INK, 0); K.circ(11, -26, 4.5, INK, 0); K.poly([[-4, -16], [4, -16], [0, -11]], PAL.coral, 0);
  for (const s of [-1, 1]) { K.line(s * 8, -12, s * 28, -15, 2.5); K.line(s * 8, -10, s * 28, -6, 2.5); }
  ctx.restore();
}
function kopek(K, x, y, renk, k = 1, leke = null) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.ell(8, 30, 40, 30, renk, 4);
  K.circ(0, -18, 32, renk, 4);
  if (leke) K.circ(12, -26, 13, leke, 0);
  K.ell(-30, -12, 11, 24, leke || '#6B4A2E', 4, 0.25); K.ell(30, -12, 11, 24, leke || '#6B4A2E', 4, -0.25);
  K.ell(0, -4, 17, 13, PAL.paper, 3); K.circ(0, -10, 6, INK, 0);
  K.circ(-12, -26, 4.5, INK, 0); K.circ(12, -26, 4.5, INK, 0);
  K.line(-4, 6, 4, 6, 3);
  ctx.restore();
}
function cerceve(K, cx, cy, t, tm, { ortu = 0, rot = 0 } = {}) {
  const { ctx } = K; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  K.rect(-CW / 2 - 22, -CH / 2 - 22, CW + 44, CH + 44, '#7A4E2C', LW, 10);
  K.rect(-CW / 2, -CH / 2, CW, CH, '#E9D9B8', LW * 0.7, 4);
  ctx.save(); ctx.beginPath(); ctx.rect(-CW / 2, -CH / 2, CW, CH); ctx.clip();
  ctx.fillStyle = '#B8D0C2'; ctx.fillRect(-CW / 2, 40, CW, CH);
  const kv = H.nabiz(t, tm.kedi, 0.4) + H.nabiz(t, tm.hepsiKedi, 0.4), kp = H.nabiz(t, tm.kopek, 0.4);
  kopek(K, -128, 34, '#B07A45', 0.9 * (1 + 0.12 * kp)); kopek(K, -50, 40, '#F1ECE0', 0.86 * (1 + 0.12 * kp), '#4A3A30');
  kedi(K, 42, 30, '#D9884A', 0.92 * (1 + 0.12 * kv)); kedi(K, 122, 44, '#8C8E8A', 0.82 * (1 + 0.12 * kv));
  ctx.restore();
  ctx.restore();
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    tok: 0.3, lufer: T('h1:6'), istavrit: T('h1:8'),
    h2a: T('h2a'), iki1: T('h2a:0'), luf2: T('h2a:3'), iki2: T('h2a:4'), ist2: T('h2a:7'),
    soru: T('h2b') - 0.08, kac: T('h2b:1'), tuttum: T('h2b:3'),
    h3: T('h3'), yemek: T('h3:2'),
    deneme: T('d2') - 0.1, uc: T('d2'), gecen: T('d2:2'),
    hd: T('hd'), say: T('hd:0'), ikisi: T('hd:4'), haric: T('hd:5'), kacL: T('hd:7'), kalir: T('hd:8'), hdSon: T('hd>'),
    n1: T('n1'), kedi: T('n1:2'), kopek: T('n1:4'), ortu: T('n1:8') - 0.3, hepsiKedi: T('n1:11'),
    dort: T('d3:1'), d4: T('d4'), d4luf: T('d4:1'), d4ist: T('d4:3'), L1: T('d4:4'), L1h: T('d4:5'), L1i: T('d4:7'), I1: T('d4:8'), I1h: T('d4:9'), I1l: T('d4:11'), d4son: T('d4>'),
    d5: T('d5'), uc3: T('d5:3'), iki4: T('d5:4'), dort4: T('d5:6'),
    espri: T('h4') - 0.25, h4: T('h4'), yakala: T('h4:2'),
    cta: T('d6') - 0.2,
  };
  tm.sayac2 = cd0 + 5.0; tm.bak = cd + 0.2; tm.ipucu = tm.bak + 5 / 30;
  tm.cevap = tm.buldum + 0.8;
  tm.hayalSon = cd0 + 0.6;
  tm.sSay = cd0 + 0.7; tm.sDusun = cd0 + 2.7; tm.sTok = cd0 + 1.9;
  tm.sUzan = tm.sayac2 + 0.5; tm.sBas = tm.sayac2 + 0.85; tm.sCek = tm.sayac2 + 1.7;
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...M.kadraj(ISKELE, 'genis')], [0.3, 1.1, 548, 1108], [tm.h2a - 0.1, 1.2, 565, 1100], [tm.ist2, 1.22, 570, 1098]] },
    { id: 'soru', t0: tm.soru, cam: [[0, 1.32, 640, 1062], [tm.h3 - 0.15, 1.28, 800, 1062]] },
    { id: 'deneme', t0: tm.deneme, cam: [[0, 1.16, 540, 1090], [tm.hd, 1.19, 548, 1085]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 1.0, 560, 1080], [cd0 + 4.5, 1.02, 565, 1075]] },
    { id: 'sayac2', t0: tm.sayac2, cam: [[0, 1.3, 545, 1045], [cd - 0.5, 1.33, 542, 1040]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.42, 830, 1075], [T('n1:7'), 1.45, 834, 1070]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 300, 1010]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1, 540, 960], [tm.d5, 1.03, 545, 950]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.3, 940, 1060], [tm.yakala, 1.34, 948, 1050]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.36, 330, 1030], [tm.cta + 1.6, 1.4, 330, 1024]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.5, 0.3] }, ...POZ.dur });
  const hik = [
    [0.55, { head: { tilt: 4, look: [-0.6, 0.45] } }, 0.3],
    [1.0, { head: { tilt: -3, look: [0.05, 0.05] } }, 0.35],
    [tm.lufer - 0.1, { head: { tilt: -5, look: [-0.8, 0.15] } }, 0.3],
    [tm.h2a, { head: { tilt: 4, look: [0.05, 0.05] } }, 0.3],
    [tm.iki2, { head: { tilt: -4, look: [-0.75, 0.1] } }, 0.3],
    [tm.soru, { head: { tilt: 3, look: [-0.4, 0.5] } }, 0.01],
    [tm.tuttum - 0.1, { expr: 'mutlu', head: { tilt: 7, look: [0.05, 0.0] } }, 0.3],
    [tm.h3, { head: { tilt: -4, look: [0.75, 0.3] } }, 0.3],
    [tm.deneme, { expr: 'mutlu', head: { tilt: -3, look: [-0.8, 0.1] } }, 0.01],
    [tm.say, { expr: 'mutlu', head: { tilt: 4, look: [-0.5, -0.35] } }, 0.3],
    [tm.hdSon, { expr: 'mutlu', head: { tilt: 6, look: [-0.8, 0.1] } }, 0.3],
    [cd0, { expr: 'mutlu', head: { tilt: 5, look: [-0.6, 0.3] } }, 0.01],
    [tm.sayac2, { expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.35] } }, 0.01],
    [tm.sBas, { expr: 'saskin', head: { tilt: 6, look: [-0.8, 0.4] } }, 0.2],
    [tm.sCek + 0.2, { expr: 'mutlu', head: { tilt: -6, look: [-0.7, 0.1] } }, 0.3],
    [tm.espri, { expr: 'mutlu', head: { tilt: -3, look: [0.3, -0.2] } }, 0.01],
    [tm.h4 + 0.25, { expr: 'mutlu', head: { tilt: 6, look: [0.05, 0.05] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: 3, look: [-0.8, 0.1] } }, 0.35],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 5, look: [0.75, 0.45] }, ...POZ.dur });
  const def = [
    [tm.lufer - 0.1, { expr: 'notr', head: { tilt: -3, look: [0.85, 0.05] } }, 0.35],
    [tm.soru, { expr: 'notr', head: { tilt: 4, look: [0.8, 0.25] } }, 0.01],
    [tm.deneme, { expr: 'mutlu', head: { tilt: -5, look: [0.5, -0.3] } }, 0.01],
    [tm.hd, { expr: 'notr', head: { tilt: 3, look: [0.6, -0.4] } }, 0.3],
    [tm.hdSon, { expr: 'saskin', head: { tilt: -6, look: [0.6, -0.35] } }, 0.25],
    [cd0, { expr: 'saskin', head: { tilt: 5, look: [0.5, 0.2] } }, 0.01],
    [tm.sDusun, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.3, -0.5] } }, 0.35],
    [tm.sayac2, { expr: IFADE.dusun, armR: POZ.dur.armR, head: { tilt: 4, look: [0.8, 0.45] } }, 0.01],
    [tm.sCek + 0.1, { expr: 'yorgun', head: { tilt: -6, look: [0.7, 0.3] } }, 0.3],
    [tm.sCek + 1.4, { expr: IFADE.dusun2, head: { tilt: 6, look: [0.2, -0.55] } }, 0.35],
    [tm.sCek + 2.6, { ...POZ.dusun, head: { tilt: -5, look: [0.5, -0.4] } }, 0.4],
    [tm.sCek + 3.6, { head: { tilt: 7, look: [0.1, -0.6] } }, 0.4],
    [tm.bak, { expr: 'notr', head: { tilt: -3, look: [0.95, 0.05] } }, 0.25],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.espri, { expr: 'yorgun', armR: POZ.dur.armR, head: { tilt: 6, look: [0.85, 0.2] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.3, 0.1] } }, 0.2],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.4],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'mutlu', head: { tilt: -3, look: [0.8, 0.3] }, ...POZ.dur });
  const nec = [
    [tm.kopek, { head: { tilt: 4, look: [0.7, 0.35] } }, 0.3],
    [tm.ortu + 0.5, { expr: 'mutlu', head: { tilt: -5, look: [0.05, 0.05] } }, 0.3],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Durum fonksiyonları ═══════════════════════════
// Kovanın kapağı: kare 0'dan sonra 0,3'te içeriden vurulur (kalkar, tok); sayaçta bir kez daha
function kapakAt(t, tm) {
  let dy = 0, rot = 0;
  for (const [a, g] of [[tm.tok, 1], [tm.sTok, 0.8]]) { const u = H.nabiz(t, a, 0.26); dy -= 16 * g * u; rot -= 0.07 * g * u; }
  return { dy, rot, var: true };
}
// Hayalet balıklar (d2 → sayaç başı): üç balık kovanın üstünde. Dönen: [{ p, tur, hayal, a, vurgu, sars }]
const HAYAL_X = [385, 510, 635], HAYAL_Y = 880;
function hayaller(t, tm) {
  const out = [], son = 1 - W(t, tm.hayalSon, 0.3);
  if (t < tm.uc - 0.05 || son <= 0) return out;
  for (let i = 0; i < 3; i++) {
    const a0 = tm.uc - 0.04 + i * 0.075, v = t < a0 ? 0 : H.spring(t - a0, H.UI[0], H.UI[1]);
    const dim = i > 0 ? pIn(t, tm.ikisi + (i - 1) * 0.22, tm.kacL + 0.2, 0.2) : 0;
    let tur = 'lufer', hayal = 1, renk = 0;
    if (i === 0) { renk = W(t, tm.kacL, 0.25); }
    if (i === 1) { renk = W(t, tm.kacL + 0.3, 0.25); tur = renk > 0.5 ? 'istavrit' : 'lufer'; }
    const ters = i === 2 ? W(t, tm.kalir + 0.1, 0.2) : 0;
    out.push({ p: [HAYAL_X[i] + (i === 2 ? 9 * H.sars(t, tm.kalir + 0.1, 0.55, 9) : 0), HAYAL_Y - 16 * (1 - v)], tur, hayal: 1 - renk, a: clamp01(v * 1.4) * son * (1 - 0.55 * dim), k: (tur === 'istavrit' && renk > 0.5 ? 0.52 : 0.42) * (0.6 + 0.4 * v), vurgu: i === 0 ? H.nabiz(t, tm.kacL) : i === 1 ? H.nabiz(t, tm.kacL + 0.3) : 0, ters });
  }
  return out;
}

// Defne'nin hayal bulutu (kovanın üstünde, krem; Defne'nin başına küçük kabarcıklarla bağlı)
function hayalBulut(K, t, tm, dp) {
  const v = t < tm.uc - 0.1 ? 0 : H.spring(t - (tm.uc - 0.1), H.UI[0], H.UI[1]), son = 1 - W(t, tm.hayalSon, 0.3), a = clamp01(v * 1.5) * son;
  if (a <= 0.01) return;
  const { ctx } = K, hd = H.eklem('defne', dp, 'head'), cx = 510, cy = HAYAL_Y + 4;
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(cx, cy); ctx.scale(1.08 * (0.7 + 0.3 * v), 1.0 * (0.7 + 0.3 * v)); ctx.translate(-cx, -cy);
  const top = [[-150, -10, 70], [-75, -45, 72], [10, -52, 78], [95, -40, 72], [160, -6, 64], [100, 34, 66], [0, 42, 72], [-100, 36, 66]];
  for (const [dx, dy, r] of top) K.circ(cx + dx, cy + dy, r + 4, INK, 0);
  for (const [dx, dy, r] of top) K.circ(cx + dx, cy + dy, r - 2, PAL.cream, 0);
  K.ell(cx, cy, 200, 70, PAL.cream, 0);
  const b1 = kar([cx - 190, cy + 70], [hd[0] + 110, hd[1] - 20], 0.4), b2 = kar([cx - 190, cy + 70], [hd[0] + 110, hd[1] - 20], 0.8);
  K.circ(b1[0], b1[1], 20, PAL.cream, 5); K.circ(b2[0], b2[1], 12, PAL.cream, 5);
  ctx.restore();
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { d4: 4 },
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'ipucu') return evCiz(K, t, tl, S, B);
    if (id === 'cevap') return gazete(K, t, tl, S, B);
    iskele(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'kanca') { balikEtiket(K, t, tm.lufer - 0.04, tm.soru - 0.25, [300, B.top + 92], 'lufer', [tm.luf2]); balikEtiket(K, t, tm.istavrit - 0.04, tm.soru - 0.25, [760, B.top + 92], 'istavrit', [tm.ist2]); }
    if (id === 'deneme' || id === 'sayac') {
      const c = S.film.cam(tm.kalir, 0.009), p = [HAYAL_X[2] + 52, HAYAL_Y - 70];
      H.mark(K, t, tm.kalir + 0.12, tm.cd0 - 0.1, [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom], false);
    }
    if (id === 'cevap') {
      // d5: 017'nin üç türü hayal panelde (3), gerçek dört balık yeşil etikette (4)
      if (t >= tm.d5 - 0.05) {
        const v = H.spring(t - (tm.d5 - 0.05), H.UI[0], H.UI[1]), son = 1 - ease.exit(seg(t, tm.espri - 0.25, 0.2)), dim = W(t, tm.iki4, 0.3);
        const { ctx } = K; ctx.save(); ctx.translate(540, 420); ctx.scale((0.6 + 0.4 * v) * son, (0.6 + 0.4 * v) * son); ctx.globalAlpha = clamp01(v * 1.6) * son * (1 - 0.45 * dim);
        K.rect(-330 + 8, -66 + 10, 660, 132, INK, 0, 40); K.rect(-330, -66, 660, 132, PAL.cream, LW, 40);
        balik(K, -225, 0, 'lufer', { k: 0.42 }); balik(K, -65, 0, 'istavrit', { k: 0.52 }); balik(K, 70, 0, 'hamsi', { k: 0.62 });
        K.text('= 3', 228, 26, 70, H.mixHex(INK, MERCAN, H.nabiz(t, tm.uc3, 0.4)), 900);
        if (dim > 0.01) { ctx.globalAlpha = son; K.line(-300, 40, -300 + 600 * dim, -40, 12, MERCAN); }
        ctx.restore();
      }
      H.tag(K, t, tm.dort4 - 0.04, tm.espri - 0.25, [585, 1088], '= 4', YESIL, PAL.paper, 84);
    }
  },
});

// Balıklı etiket: hap + balık silueti + ad (ekran uzayı; tag gibi yayla gelir, okunurken oynamaz)
function balikEtiket(K, t, a, b, [x, y], tur, nabizlar = []) {
  if (t < a - 0.001 || t > b + 0.2) return;
  const { ctx } = K, ad = tur === 'lufer' ? 'lüfer' : 'istavrit', size = 46;
  ctx.font = `900 ${size}px Rubik`; const tw = ctx.measureText(ad).width, fw = tur === 'lufer' ? 150 : 110, w = tw + fw + 70;
  const v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, b, 0.2));
  let pu = 1; for (const p of nabizlar) pu += 0.16 * Math.sin(Math.PI * seg(t, p - 0.04, 0.34));
  ctx.save(); ctx.translate(x, y); ctx.scale((0.6 + 0.4 * v) * out * pu, (0.6 + 0.4 * v) * out * pu); ctx.globalAlpha = clamp01(v * 1.6) * out;
  K.rect(-w / 2 + 7, -46 + 9, w, 92, INK, 0, 46); K.rect(-w / 2, -46, w, 92, PAL.paper, LW, 46);
  balik(K, -w / 2 + 28 + fw / 2, 2, tur, { k: tur === 'lufer' ? 0.48 : 0.4 });
  K.text(ad, -w / 2 + fw + 48 + tw / 2, 16, size, INK, 900);
  ctx.restore();
}

// ——— İskele (kanca, soru, deneme, sayaç, buldum, espri, çağrı) ———
function iskele(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, ISKELE, 'arka', t, { isik: M.ISIK.gunduz });
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  if (id === 'sayac') { H.glance(hp, t, tm.cd, 10); H.onayla(hp, t, tm.cd0 + 1.45, 2, 0.34); }
  const sonra = id === 'espri' || id === 'cta';
  const kp = sonra ? { var: false } : kapakAt(t, tm);
  const ho = { heads }, dO = { heads };
  let hTut = null, hParmak = 0, hIsaret = null, dParmak = 0, dTut = null, mPuf = 0;

  // Hikmet'in sol eli kapağın üstünde (kanca, soru, sayaç); kapak vurulunca el de kalkar
  const kulp = kapakKulp(kp.dy || 0);
  const elKapak = [kulp[0] + 30, kulp[1] + 4];
  if (id === 'kanca' || id === 'soru' || id === 'sayac' || id === 'sayac2') {
    let w = 1;
    if (id === 'soru') w = 1 - W(t, tm.h3 - 0.2, 0.3);
    if (w > 0.01) { ho.L = [elKapak, w, 'A']; if (w > 0.6) hTut = 'L'; }
  }
  // h2a: sağ eli iki parmak ("İkisi" iki kez)
  if (id === 'kanca') {
    const w = pIn(t, tm.iki1 - 0.25, tm.soru - 0.3, 0.28);
    if (w > 0.01) { const sh = H.shoulder('hikmet', hp, 'R'); ho.R = [[sh[0] + 92, sh[1] - 40 - 30 * (H.nabiz(t, tm.iki1 + 0.05, 0.3) + H.nabiz(t, tm.iki2 + 0.05, 0.3))], w, 'B']; if (w > 0.6) hParmak = 2; }
  }
  // soru: "kaç"ta kapağa iki kez vurur (sağ el), h3'te mangalı gösterir
  if (id === 'soru') {
    const w = pIn(t, tm.kac - 0.3, tm.tuttum + 0.2, 0.25);
    if (w > 0.01) { const vur = Math.abs(Math.sin(Math.PI * clamp01((t - tm.kac) / 0.5) * 2)); ho.R = [[elKapak[0] + 60, elKapak[1] - 6 - 26 * vur], w, 'A']; }
    const wM = pIn(t, tm.h3 - 0.15, tm.deneme + 1, 0.3);
    if (wM > 0.01) { ho.R = [[MANGAL[0] - 120, MANGAL[1] - 150], wM, 'A']; if (wM > 0.6) hIsaret = ['R', [MANGAL[0] - 40, MANGAL[1] - 90]]; }
    mPuf = H.nabiz(t, tm.yemek, 0.6);
  }
  // deneme: Defne üç parmak + hayaller; Hikmet hayalet balıklara dokunur ("ikisi hariç")
  const hy = (id === 'deneme' || id === 'sayac') ? hayaller(t, tm) : [];
  if (id === 'deneme') {
    const w = pIn(t, tm.uc - 0.25, tm.hd + 0.2, 0.25);
    if (w > 0.01) { const hd = H.eklem('defne', dp, 'head'); dO.R = [[hd[0] + 135, hd[1] + 95], w, 'B']; if (w > 0.6) dParmak = 3; }
    const dur = [[tm.ikisi - 0.05, [HAYAL_X[1], HAYAL_Y + 24]], [tm.ikisi + 0.2, [HAYAL_X[2], HAYAL_Y + 24]], [tm.kacL - 0.05, [HAYAL_X[0] + 20, HAYAL_Y + 34]]];
    const wH = pIn(t, tm.ikisi - 0.35, tm.hdSon + 0.3, 0.28);
    if (wH > 0.01) { const h = H.dokunYolu(t, dur, { yuksel: 30, sure: 0.2 }); ho.L = [[h[0] + 26, h[1] + 110], wH, 'A']; if (wH > 0.6) hIsaret = ['L', h]; }
  }
  // sayaç: Defne parmakla üçe kadar sayar (dördüncüyü açamaz), sonra eli çenede
  if (id === 'sayac') {
    dParmak = t >= tm.sSay && t < tm.sDusun - 0.1 ? Math.min(3, 1 + 2.2 * clamp01((t - tm.sSay) / 1.5)) : 0;
    if (dParmak) { const sh = H.shoulder('defne', dp, 'R'); dO.R = [[sh[0] + 70, sh[1] + 10], pIn(t, tm.sSay - 0.25, tm.sDusun - 0.15, 0.25), 'B']; }
  }
  // sayaç 2: Defne kapağa uzanır, Hikmet'in eli önce davranır, Defne elini çeker
  if (id === 'sayac2') {
    const a = tm.sayac2 + 0.35;
    dParmak = t >= a && t < tm.sCek + 0.9 ? Math.min(3, 1 + 2.2 * clamp01((t - a) / 1.4)) : 0;
    if (dParmak) { const sh = H.shoulder('defne', dp, 'L'); dO.L = [[sh[0] + 10, sh[1] + 60], pIn(t, a - 0.25, tm.sCek + 0.8, 0.25), 'B']; }
  }
  // espri: Hikmet oltayı tutar; misinada "3" kartı
  let oltaDurum = { dip: OLTA.dip, uc: OLTA.uc, ucu: [OLTA.mantar[0], OLTA.mantar[1] + 6 * Math.sin(t * 2.3)], kart: null };
  if (id === 'espri' || id === 'cta') {
    const kalk = W(t, tm.h4 - 0.1, 0.4), el = [HIK_X + 120, 1250 - 40 * kalk];
    const ac = -1.05 - 0.12 * kalk, L = 520, uc = [el[0] + Math.cos(ac) * L, el[1] + Math.sin(ac) * L], dip = [el[0] - Math.cos(ac) * 60, el[1] - Math.sin(ac) * 60];
    const boy = lerp(330, 150, W(t, tm.h4 - 0.1, 0.55)), sal = 0.22 * H.sars(t, tm.h4 + 0.3, 1.4, 1.1);
    oltaDurum = { dip, uc, ucu: [uc[0] + Math.sin(sal) * boy, uc[1] + Math.cos(sal) * boy], kart: { rot: -sal * 0.6 } };
    ho.R = [el, 1, 'A']; hTut = 'R';
  }
  // çağrı: Defne bir lüferi kuyruğundan tutar, kameraya gösterir
  let ctaBalik = null;
  if (id === 'cta') { const sh = H.shoulder('defne', dp, 'R'), u = W(t, tm.cta + 0.05, 0.45); dO.R = [[sh[0] + 165, sh[1] - 70 - 40 * u], 1, 'B']; dTut = 'R'; ctaBalik = u; }
  if (id === 'espri') { const sh = H.shoulder('defne', dp, 'L'); dO.L = [[sh[0] - 40, sh[1] + 120], 1, 'A']; }

  // ——— çizim: olta (korkulukta) → mangal → Hikmet → kasa, kova → hayaller → Defne → tutan eller ———
  if (!sonra) olta(K, oltaDurum.dip, oltaDurum.uc, oltaDurum.ucu);
  if (hy.length) hayalBulut(K, t, tm, dp);
  for (const f of hy) {
    if (f.ters > 0.01) { const { ctx } = K; ctx.save(); ctx.globalAlpha = f.ters * f.a; ctx.beginPath(); ctx.arc(f.p[0], f.p[1], 78, 0, TAU); ctx.lineWidth = 9; ctx.strokeStyle = MERCAN; ctx.stroke(); ctx.restore(); }
    balik(K, f.p[0], f.p[1], f.tur, { k: f.k, hayal: f.hayal, a: f.a, vurgu: f.vurgu });
  }
  mangal(K, t, mPuf);
  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  kasa(K);
  if (sonra) { gazeteOn(K, id === 'cta' ? 3 : 4); kova(K, 690, KASA.y, { kapak: { var: false }, k: 0.8 }); }
  else kova(K, KOVA[0], KOVA[1], { kapak: kp });
  if (hTut === 'L') hc.tut('L');
  if (hParmak) hc.parmak('R', hParmak, { toplam: 2 });
  if (hIsaret) hc.isaret(hIsaret[0], hIsaret[1]);
  if (sonra) { olta(K, oltaDurum.dip, oltaDurum.uc, oltaDurum.ucu, { kart: oltaDurum.kart }); hc.tut('R'); }
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (dParmak) dc.parmak(id === 'sayac2' ? 'L' : 'R', dParmak, { toplam: 3 });
  if (ctaBalik !== null) { balik(K, dc.handR[0] + 2, dc.handR[1] + 120, 'lufer', { k: 0.72, rot: Math.PI / 2 + 0.06 * Math.sin(t * 2.4), yon: -1 }); dc.tut('R'); }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// ——— Necmi'nin evi: çerçevedeki iki kedi, iki köpek; gazete köpekleri örter ———
function evCiz(K, t, tl, S, B) {
  const { tm } = S, { heads } = B;
  M.mekanCiz(K, EV, 'arka', t, { isik: M.ISIK.aksam });
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  const C = [905, 1082];                                   // çerçeve konsolun üstünde duruyor
  // gazete: Necmi'nin sağ elinde, çerçevenin solundan köpeklerin üstüne kayar
  const ortu = ease.state(seg(t, tm.ortu, 0.45));
  const gz = [lerp(C[0] - CW / 2 - 30, C[0] - 86, ortu), lerp(C[1] + 250, C[1] + 6, ortu)];
  const L = [np.x - 70, 1250 - 40 * H.nabiz(t, tm.kedi, 0.5) - 40 * H.nabiz(t, tm.hepsiKedi, 0.5)];
  const nc = oyna(K, t, tl, 'necmi', np, { heads, R: [[gz[0] - 30, gz[1] + 70], 1, 'A'], L: [L, 1, 'A'] });
  cerceve(K, C[0], C[1], t, tm);
  const { ctx } = K; ctx.save(); ctx.translate(gz[0], gz[1]); ctx.rotate(-0.04 * (1 - ortu));
  K.rect(-92, -136, 184, 272, '#EFE9DA', LW, 4);
  K.rect(-74, -116, 148, 26, '#9C978A', 0, 3);
  for (let i = 0; i < 7; i++) K.rect(-74, -74 + i * 26, i % 3 === 2 ? 90 : 148, 9, '#C8C2B4', 0, 3);
  ctx.restore();
  nc.tut('R');
}

// ——— Gazete (kuşbakışı): kova dökülür, iki lüfer iki istavrit; kapak türleri sırayla örter ———
const KV = { c: [250, 645], r: 165 }, DOK = H.unit([0, 0], [1, 0.85]);
const YER = [['lufer', [380, 850], 0.95], ['istavrit', [790, 860], 0.95], ['lufer', [380, 980], 0.95], ['istavrit', [790, 970], 0.95]];
const SUTUN = { lufer: [380, 915], istavrit: [790, 915] };
const KAPAK_DUR = [900, 1200], KAPAK_R = 185;
function gazete(K, t, tl, S, B) {
  const { tm } = S, { ctx } = K, c0 = tm.cevap;
  // iskele tahtaları (kuşbakışı)
  ctx.fillStyle = '#B8925E'; ctx.fillRect(-200, -200, 1480, 2320);
  for (let i = 0; i < 12; i++) K.line(-200, 100 + i * 175, 1280, 100 + i * 175, 4, '#9C7A4C');
  for (let i = 0; i < 12; i++) K.line(((i * 397) % 1300) - 100, 100 + i * 175, ((i * 397) % 1300) - 100, 275 + i * 175, 3, '#9C7A4C');
  // gazete
  ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.03);
  K.rect(-420 + 10, -360 + 14, 840, 720, 'rgba(20,30,28,0.25)', 0, 6);
  K.rect(-420, -360, 840, 720, '#EFE9DA', LW, 6);
  K.line(0, -350, 0, 350, 3, '#D6CFBF');
  K.rect(-390, -330, 360, 44, '#9C978A', 0, 4); K.rect(30, -330, 300, 44, '#9C978A', 0, 4);
  for (let i = 0; i < 18; i++) { const y = -262 + i * 34; K.rect(-390, y, i % 4 === 3 ? 220 : 360, 12, '#D9D2C2', 0, 4); K.rect(30, y, i % 5 === 4 ? 200 : 360, 12, '#D9D2C2', 0, 4); }
  ctx.restore();
  // zamanlar
  const kal0 = c0 + 0.0, kal1 = c0 + 0.4, egil0 = c0 + 0.55, egil1 = c0 + 0.78, dok0 = c0 + 0.6;
  const egim = ease.state(seg(t, egil0, egil1 - egil0));
  // kapak durumu
  const kapakYol = [[kal0, KV.c], [kal1, KAPAK_DUR], [tm.L1 - 0.15, KAPAK_DUR], [tm.L1h + 0.05, SUTUN.lufer], [tm.I1 - 0.15, SUTUN.lufer], [tm.I1h + 0.05, SUTUN.istavrit], [tm.d4son - 0.05, SUTUN.istavrit], [tm.d4son + 0.4, KAPAK_DUR]];
  const kP = yol(t, kapakYol);
  // kova (kuşbakışı; eğilince ağzı dökme yönünde basıklaşır, gövdesi arkada görünür)
  const rim = [KV.c[0] + DOK[0] * 50 * egim, KV.c[1] + DOK[1] * 50 * egim], taban = [KV.c[0] - DOK[0] * 150 * egim, KV.c[1] - DOK[1] * 150 * egim];
  const per = [-DOK[1], DOK[0]], a = Math.atan2(DOK[1], DOK[0]);
  if (egim > 0.01) K.poly([[taban[0] + per[0] * 104, taban[1] + per[1] * 104], [rim[0] + per[0] * KV.r, rim[1] + per[1] * KV.r], [rim[0] - per[0] * KV.r, rim[1] - per[1] * KV.r], [taban[0] - per[0] * 104, taban[1] - per[1] * 104]], '#E8E2D4', LW);
  if (egim > 0.01) K.ell(taban[0], taban[1], 104 * 0.5 * egim + 2, 104, '#D9D2C2', LW * 0.7, a);
  K.ell(rim[0], rim[1], KV.r * (1 - 0.5 * egim), KV.r, PAL.teal, LW, a);
  K.ell(rim[0], rim[1], (KV.r - 18) * (1 - 0.5 * egim), KV.r - 18, '#3E5E5E', LW * 0.6, a);
  // balıklar: kovada (yalnız ağız açıkken görünür) → kayarak gazeteye
  YER.forEach(([tur, hedef, k], i) => {
    const s0 = dok0 + i * 0.07, u = ease.state(seg(t, s0, 0.32));
    let p, rot;
    if (t < s0) { if (t < kal1 - 0.2) return; p = [rim[0] + (i % 2 ? 40 : -40) * (1 - 0.5 * egim), rim[1] + (i < 2 ? -45 : 45)]; rot = 0.3 + (i % 2) * 0.4; }
    else { p = H.yay([rim[0] + DOK[0] * 40, rim[1] + DOK[1] * 40], hedef, u, 30); rot = lerp(a, 0, u); }
    let vurgu = 0;
    if (tur === 'lufer') vurgu = H.nabiz(t, tm.d4luf) + H.nabiz(t, tm.I1l, 0.4);
    else vurgu = H.nabiz(t, tm.d4ist) + H.nabiz(t, tm.L1i, 0.4);
    if (t < s0) { ctx.save(); ctx.beginPath(); ctx.ellipse(rim[0], rim[1], (KV.r - 18) * (1 - 0.5 * egim), KV.r - 18, a, 0, TAU); ctx.clip(); balik(K, p[0], p[1], tur, { k: k * 0.55, rot }); ctx.restore(); }
    else balik(K, p[0], p[1], tur, { k, rot, vurgu });
  });
  // kapak (kuşbakışı): yuvarlak, ortada kulp; gölgesi
  const kapakUstte = t >= kal0;
  if (kapakUstte) {
    const kalkik = t < kal1 + 0.05 || (t > tm.L1 - 0.15 && t < tm.L1h + 0.05) || (t > tm.I1 - 0.15 && t < tm.I1h + 0.05) || (t > tm.d4son - 0.05 && t < tm.d4son + 0.4);
    const sh = kalkik ? 22 : 8;
    K.circ(kP[0] + sh, kP[1] + sh + 4, KAPAK_R, 'rgba(20,30,28,0.3)', 0);
    K.circ(kP[0], kP[1], KAPAK_R, PAL.teal, LW); K.circ(kP[0], kP[1], KAPAK_R - 22, '#2A716C', LW * 0.5);
    K.rect(kP[0] - 50, kP[1] - 16, 100, 32, '#23605C', LW * 0.7, 10);
  }
  // Defne'nin kolu (alttan): kapağı kulpundan taşır, kovayı devirir, sonra yine kapakta
  const kovaKenar = [rim[0] - DOK[0] * KV.r * 0.85, rim[1] - DOK[1] * KV.r * 0.85];
  const kapakAl2 = tm.L1 - 0.5;
  let el;
  if (t < kal1) el = kP;
  else if (t < egil0) el = yol(t, [[kal1, KAPAK_DUR], [egil0 - 0.02, kovaKenar]]);
  else if (t < egil1 + 0.2) el = kovaKenar;
  else if (t < kapakAl2) el = yol(t, [[egil1 + 0.2, kovaKenar], [kapakAl2, KAPAK_DUR]]);
  else el = kP;
  const tutar = t < kal1 || t >= kapakAl2 || (t >= egil0 - 0.02 && t < egil1 + 0.2);
  const kok = [el[0] + (el[0] - 540) * 3 - 60, 2140];
  ustKol(K, 'defne', kok, el, { s: 1.5 });
  void tutar;
}
// Kuşbakışı kol: ekran kenarından gelen kol (kol rengi), manşet ve el
function ustKol(K, key, kok, el, { s = 1.6 } = {}) {
  const c = H.CARDS[key], { ctx } = K, wArm = 70 * s / 1.6, r = 44 * s / 1.6;
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, kok, el, wArm + 10, INK); H.strokeLine(ctx, kok, el, wArm, c.arm.color);
  const u = H.unit(kok, el), m = [el[0] - u[0] * 30, el[1] - u[1] * 30];
  H.strokeLine(ctx, m, [m[0] - u[0] * 26, m[1] - u[1] * 26], wArm + 14, INK);
  H.strokeLine(ctx, m, [m[0] - u[0] * 26, m[1] - u[1] * 26], wArm + 4, c.top || c.arm.shade);
  for (const [da, L] of [[-0.5, 40], [-0.17, 48], [0.17, 48], [0.5, 40]]) { const an = Math.atan2(u[1], u[0]) + da, q = [el[0] + Math.cos(an) * L, el[1] + Math.sin(an) * L]; H.strokeLine(ctx, el, q, 24, INK); H.strokeLine(ctx, el, q, 14, c.skin); }
  K.circ(el[0], el[1], r, c.skin, LW);
  ctx.restore();
}
