// Mekân kalıbı (v4): ışık ön ayarları, ortak oda iskeleti (duvar, zemin, süpürgelik, pencere, kapı), açık hava iskeleti
// ve mekân kaydı. Bölüm ajanı kendi mekânını kendi dosyasında (engine/b0NN.js) `mekanEkle` ile tanımlar; buradaki
// 'cayOcagi' yalnız örnektir. Her çizim t'nin saf fonksiyonudur; rastgelelik tohumlu.
//
// MEKÂN KAYDI BİÇİMİ
//   mekanEkle('ad', {
//     gen: [x0, x1],            // mekânın dünya genişliği (yan yana dizmek ve kamera sınırı için)
//     zemin: 1500,              // zemin çizgisi (karakterlerin y'si)
//     capa: { ad: [x, y] | durum => [x, y] },   // el ve nesne hedefleri: tezgâh üstü, kapı kolu, raf… (sahnede sabit sayı yazılmaz)
//     kadraj: { ad: [zoom, cx, cy] },   // hazır kamera kadrajları → kamera anahtarı: [t, ...kadraj(M, 'genis')]
//     dongu: ['buhar', 'musluk'],       // sahnenin iki sürekli döngüsü (belge; arka() içinde çizilir)
//     arka(K, t, o),            // karakterlerin ARKASI: duvar, zemin, pencere, kapı, sabit mobilya, döngüler
//     isik(K, t, o),            // karartma + ışık şeritleri (karakterlerden SONRA; siluet bundan da sonra çizilir)
//     on(K, t, o),              // karakterlerin ÖNÜ: masa önü, pervaz, tezgâh kenarı (isteğe bağlı)
//   });
//   o = { isik: ISIK.gunduz | isikKaris(…) | isikYolu(…), durum: { mekâna özgü: dolap: 0..1, kapi: 0..1, saat: 10.25 }, ox: dünya kayması }
//   Çizim sırası: mekanCiz(K, M, 'arka', t, o) → karakterler ve nesneler → mekanCiz(K, M, 'isik', t, o) → mekanCiz(K, M, 'on', t, o)
import { ease, seg, clamp01, lerp, mulberry32 } from './core.js';
import { INK, teaGlass } from './cast.js';
import { PAL, LW, clock } from './office.js';
import { mixHex, buhar, damlaDongu, isikSeridi, zeminIsigi, karart } from './hikaye.js';

// ═══════════════════════════ Işık ═══════════════════════════
// Dört ön ayar. Gece: koyu petrol (#1C3638); lacivert ve mor yok. k = karakterlerin üstüne gelecek karartma (karart(K, isik.k)).
export const ISIK = {
  gunduz: { ad: 'gunduz', duvar: '#2E5B5E', bant: '#24494C', trim: '#E9DCC2', zemin: '#B8925E', zeminCizgi: '#9C7A4C', gok: '#E9C99C', gunes: '#F6E3BC', sehir: '#7E8E86', deniz: '#6E9A9A', k: 0, yildiz: 0 },
  sabah: { ad: 'sabah', duvar: '#30605F', bant: '#264D4D', trim: '#EDE1C8', zemin: '#BD9763', zeminCizgi: '#A07E50', gok: '#F1DDB6', gunes: '#FBF0CF', sehir: '#93A096', deniz: '#8DB0A8', k: 0, yildiz: 0 },
  aksam: { ad: 'aksam', duvar: '#2A5254', bant: '#214245', trim: '#DCCBA8', zemin: '#A9824F', zeminCizgi: '#8C6A40', gok: '#E39A5E', gunes: '#F8D07E', sehir: '#5F6259', deniz: '#B07C55', k: 0.08, yildiz: 0 },
  gece: { ad: 'gece', duvar: '#1C3638', bant: '#162C2E', trim: '#8D8B78', zemin: '#6B573A', zeminCizgi: '#57472F', gok: '#14292B', gunes: '#EDE6D0', sehir: '#0D1E20', deniz: '#1B3B3D', k: 0.4, yildiz: 1 },
};
const isikOf = I => typeof I === 'string' ? ISIK[I] : I;
// İki ışığın karışımı (zaman atlaması): renkler ve k ara değerlenir
export function isikKaris(a, b, u) {
  const A = isikOf(a), B = isikOf(b), o = { ad: u < 0.5 ? A.ad : B.ad };
  for (const k of Object.keys(A)) if (k !== 'ad') o[k] = typeof A[k] === 'number' ? lerp(A[k], B[k], u) : mixHex(A[k], B[k], u);
  return o;
}
// Işık yolu: [[u, 'aksam'], [0.3, 'gece'], [0.8, 'gece'], [1, 'sabah']] ve tek u → ışık (zaman atlamasının u'su)
export function isikYolu(keys, u) {
  if (u <= keys[0][0]) return isikOf(keys[0][1]);
  for (let i = 1; i < keys.length; i++) if (u <= keys[i][0]) return isikKaris(keys[i - 1][1], keys[i][1], (u - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0] || 1));
  return isikOf(keys[keys.length - 1][1]);
}
// Saate göre ışık ve gök cisimleri: ondalık saat (19.5 = 19:30; 24'ü aşabilir) → { isik, gunes: yay konumu 0..1 | null, ay }
const GUN = [[0, 'gece'], [5, 'gece'], [6.5, 'sabah'], [9, 'gunduz'], [17, 'gunduz'], [18.5, 'aksam'], [20, 'aksam'], [21.5, 'gece'], [24, 'gece']];
export function isikSaat(saat) {
  const h = ((saat % 24) + 24) % 24;
  return { isik: isikYolu(GUN, h), gunes: h >= 6 && h <= 19.5 ? (h - 6) / 13.5 : null, ay: h >= 19 ? (h - 19) / 11.5 : h <= 6.5 ? (h + 5) / 11.5 : null };
}

// Gökyüzü (pencerenin içi ya da açık hava): güneş ve ay soldan sağa bir yay çizer (u: 0 doğuş, 0.5 tepe, 1 batış)
export function gok(K, x, y, w, h, { isik = ISIK.gunduz, gunes = null, ay = null, r = Math.max(24, Math.min(w, h) * 0.11) } = {}) {
  const { ctx } = K, I = isikOf(isik), arc = u => [x + w * (0.08 + 0.84 * u), y + h * (0.8 - 0.64 * Math.sin(Math.PI * u))];
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = I.gok; ctx.fillRect(x, y, w, h);
  if (I.yildiz > 0.05) { const rnd = mulberry32(31); ctx.globalAlpha = 0.85 * I.yildiz; for (let i = 0; i < 16; i++) K.circ(x + rnd() * w, y + rnd() * h * 0.6, 2.5 + rnd() * 2.5, '#EDE6D0', 0); ctx.globalAlpha = 1; }
  if (gunes !== null && gunes > -0.08 && gunes < 1.08) { const p = arc(gunes); K.circ(p[0], p[1], r, I.gunes, 0); }
  if (ay !== null && ay > -0.08 && ay < 1.08) { const p = arc(ay); K.circ(p[0], p[1], r * 0.9, '#EDE6D0', 0); K.circ(p[0] + r * 0.38, p[1] - r * 0.2, r * 0.74, I.gok, 0); }
  ctx.restore();
}

// ═══════════════════════════ Oda iskeleti ═══════════════════════════
// oda: duvar + alt bant + süpürgelik + zemin. Gündüz ışığında office.js room() ile aynı görünür.
//   duvar: 'cizgili' (duvar kâğıdı) | 'duz' | 'fayans' (yarım boy fayans: mutfak, çay ocağı)
//   zemin: 'ahsap' (çapraz tahta) | 'karo' | 'duz'
export function oda(K, { x0 = -200, x1 = 1280, floorY = 1500, isik = ISIK.gunduz, duvar = 'cizgili', zemin = 'ahsap' } = {}) {
  const { ctx } = K, I = isikOf(isik);
  ctx.fillStyle = I.duvar; ctx.fillRect(x0, -400, x1 - x0, floorY + 400);
  if (duvar === 'cizgili') { ctx.globalAlpha = 0.18; for (let x = x0; x < x1; x += 46) K.line(x, -400, x, floorY - 160, 3, I.bant); ctx.globalAlpha = 1; }
  if (duvar === 'fayans') {
    const y0 = floorY - 640, y1 = floorY - 160, c = mixHex(I.trim, I.duvar, 0.16), g = mixHex(I.trim, I.bant, 0.4);
    K.rect(x0, y0, x1 - x0, y1 - y0, c, 0);
    for (let x = x0; x < x1; x += 96) K.line(x, y0, x, y1, 3, g);
    for (let y = y0 + 96; y < y1; y += 96) K.line(x0, y, x1, y, 3, g);
    K.line(x0, y0, x1, y0, LW);
  }
  K.rect(x0, floorY - 160, x1 - x0, 160, I.bant, 0);
  K.rect(x0 - 10, floorY - 172, x1 - x0 + 20, 22, I.trim);
  ctx.fillStyle = I.zemin; ctx.fillRect(x0, floorY, x1 - x0, 900);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, floorY, x1 - x0, 900); ctx.clip();
  if (zemin === 'ahsap') for (let x = x0; x < x1 + 300; x += 140) K.line(x, floorY, x - 260, floorY + 900, 3, I.zeminCizgi);
  if (zemin === 'karo') {
    for (const dy of [64, 160, 300, 500, 780]) K.line(x0, floorY + dy, x1, floorY + dy, 3, I.zeminCizgi);
    for (let x = x0 - 300; x < x1 + 600; x += 170) K.line(x, floorY, x - 230, floorY + 900, 3, I.zeminCizgi);
  }
  ctx.restore();
  K.line(x0, floorY, x1, floorY, LW);
}
// Açık hava iskeleti: gökyüzü (güneş/ay yayı, bulut döngüsü), uzakta şehir silueti, zemin.
//   zemin: 'asfalt' (#5D6A61) | 'kaldirim' | 'cim' | 'teras'. ufuk: siluetin oturduğu yükseklik (zemin çizgisinin üstü).
const ZEMIN = { asfalt: ['#5D6A61', '#4E5A52'], kaldirim: ['#BDB4A2', '#A39A88'], cim: ['#86A862', '#6F9150'], teras: ['#CDBB9C', '#B3A184'] };
export function acikHava(K, { x0 = -400, x1 = 1600, floorY = 1500, isik = ISIK.gunduz, zemin = 'asfalt', gunes = 0.72, ay = null, siluet = true, bulutlar = true, t = 0 } = {}) {
  const { ctx } = K, I = isikOf(isik), w = x1 - x0, Z = ZEMIN[zemin], dk = I.k * 1.1;
  gok(K, x0, -500, w, floorY + 500, { isik: I, gunes, ay, r: 62 });
  if (bulutlar && I.yildiz < 0.5) for (let i = 0; i < 3; i++) { const xx = x0 + ((i * 0.37 * w + t * (7 + i * 3)) % (w + 400)) - 200; bulut(K, xx, 380 + i * 150, 1 - i * 0.18, mixHex('#FBF6EC', I.gok, 0.25 + 0.5 * I.k)); }
  if (siluet) {   // uzak bloklar (tohumlu, sabit)
    const rnd = mulberry32(53); let x = x0 - 40;
    ctx.save(); ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x, floorY);
    while (x < x1 + 40) { const bw = 90 + rnd() * 150, bh = 70 + rnd() * 190; ctx.lineTo(x, floorY - bh); ctx.lineTo(x + bw, floorY - bh); x += bw; }
    ctx.lineTo(x, floorY); ctx.closePath(); ctx.fillStyle = mixHex(I.sehir, I.gok, 0.35); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  }
  ctx.fillStyle = mixHex(Z[0], '#10292B', dk); ctx.fillRect(x0, floorY, w, 900);
  const lc = mixHex(Z[1], '#10292B', dk);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, floorY, w, 900); ctx.clip();
  if (zemin === 'kaldirim' || zemin === 'teras') { for (const dy of [70, 180, 340, 560, 850]) K.line(x0, floorY + dy, x1, floorY + dy, 3, lc); for (let x = x0 - 300; x < x1 + 600; x += 190) K.line(x, floorY, x - 230, floorY + 900, 3, lc); }
  if (zemin === 'cim') { const rnd = mulberry32(71); for (let i = 0; i < 60; i++) { const gx = x0 + rnd() * w, gy = floorY + 30 + rnd() * 700; K.line(gx, gy, gx - 7, gy - 20, 4, lc); K.line(gx, gy, gx + 8, gy - 17, 4, lc); } }
  if (zemin === 'asfalt') { const rnd = mulberry32(89); for (let i = 0; i < 26; i++) { const gx = x0 + rnd() * w, gy = floorY + 40 + rnd() * 700; K.line(gx, gy, gx + 26 + rnd() * 30, gy, 4, lc); } }
  ctx.restore();
  K.line(x0, floorY, x1, floorY, LW);
}
// Bulut: düz renkli üç top (parlama yok)
export function bulut(K, x, y, k = 1, renk = '#FBF6EC') {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(-100, 26); ctx.bezierCurveTo(-136, 26, -132, -22, -86, -18); ctx.bezierCurveTo(-76, -64, -6, -68, 6, -30); ctx.bezierCurveTo(40, -58, 100, -34, 88, -2); ctx.bezierCurveTo(124, 2, 120, 26, 92, 26); ctx.closePath();
  ctx.fillStyle = renk; ctx.fill(); ctx.restore();
}

// Pencere: çerçeve + gökyüzü (ışığa göre) + manzara + martı döngüsü + kayıtlar. gunes / ay verilmezse ışığa göre konur.
//   manzara: 'istanbul' (siluet) | null (yalnız gök) | fn(K, x, y, w, h, I) (kendi manzaran: 027'nin mevsimleri, havai fişek)
// Dönen: iç dikdörtgen { x, y, w, h } (perde ya da pervaz nesnesi için)
export function pencere(K, x, y, w, h, { isik = ISIK.gunduz, t = 0, gunes, ay, manzara = 'istanbul', marti = true, kayit = true } = {}) {
  const { ctx } = K, I = isikOf(isik), gece = I.yildiz > 0.5;
  K.rect(x - 14, y - 14, w + 28, h + 28, I.trim);
  gok(K, x, y, w, h, { isik: I, gunes: gunes === undefined ? (gece ? null : 0.82) : gunes, ay: ay === undefined ? (gece ? 0.3 : null) : ay });
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (marti && I.k < 0.2) { const gx = x + ((t * 22) % (w + 80)) - 40, gy = y + h * 0.22 + 6 * Math.sin(t * 1.3); ctx.beginPath(); ctx.moveTo(gx - 16, gy); ctx.quadraticCurveTo(gx - 8, gy - 9, gx, gy); ctx.quadraticCurveTo(gx + 8, gy - 9, gx + 16, gy); ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.stroke(); }
  if (typeof manzara === 'function') manzara(K, x, y, w, h, I);
  else if (manzara === 'istanbul') {
    const base = y + h * 0.78;
    ctx.fillStyle = I.sehir; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x, base);
    ctx.lineTo(x + w * 0.08, base); ctx.lineTo(x + w * 0.08, base - 40); ctx.lineTo(x + w * 0.16, base - 40); ctx.lineTo(x + w * 0.16, base);
    ctx.lineTo(x + w * 0.2, base); ctx.lineTo(x + w * 0.2, base - 60); ctx.arc(x + w * 0.32, base - 60, w * 0.12, Math.PI, 0); ctx.lineTo(x + w * 0.44, base);   // cami
    ctx.lineTo(x + w * 0.58, base); ctx.lineTo(x + w * 0.58, base - 120); ctx.lineTo(x + w * 0.565, base - 120); ctx.lineTo(x + w * 0.62, base - 175); ctx.lineTo(x + w * 0.675, base - 120); ctx.lineTo(x + w * 0.66, base - 120); ctx.lineTo(x + w * 0.66, base);   // Galata
    ctx.lineTo(x + w * 0.8, base); ctx.lineTo(x + w * 0.8, base - 50); ctx.lineTo(x + w * 0.9, base - 50); ctx.lineTo(x + w * 0.9, base); ctx.lineTo(x + w, base);
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (const mx of [0.205, 0.435]) { ctx.beginPath(); ctx.rect(x + w * mx - 5, base - 150, 10, 150); ctx.fill(); ctx.stroke(); K.poly([[x + w * mx - 7, base - 150], [x + w * mx, base - 172], [x + w * mx + 7, base - 150]], I.sehir, 4); }
    if (gece) for (const [fx, dy] of [[0.1, 26], [0.135, 14], [0.27, 40], [0.36, 30], [0.61, 96], [0.63, 60], [0.83, 34], [0.87, 18]]) K.rect(x + w * fx - 5, base - dy, 10, 10, PAL.mustard, 0);   // yanan pencereler
    ctx.fillStyle = I.deniz; ctx.fillRect(x, base + 4, w, h); K.line(x, base + 4, x + w, base + 4, 4);
  }
  ctx.restore();
  K.rect(x, y, w, h, null);
  if (kayit) { K.line(x + w / 2, y, x + w / 2, y + h, LW); K.line(x, y + h * 0.5, x + w, y + h * 0.5, LW); }
  return { x, y, w, h };
}
// Kapı: (x, y) sol üst, w × h. acik 0..1 (0 kapalı; kanat izleyiciye doğru açılır), yon: 1 → menteşe solda, −1 → sağda.
//   ic: açıklıktan görünen renk (gündüz koridor '#3E6E6F', gece ışıklı koridor '#F3E3B0', karanlık '#1C3638')
// Dönen: { kol: [x, y] (kapı kolu; el hedefi), agiz: [x0, x1] (açıklığın görünen kısmı; zeminIsigi için) }
export function kapi(K, x, y, w, h, { acik = 0, yon = 1, ic = '#3E6E6F', renk = '#8C6A44', isik = ISIK.gunduz, levha = null, cam = false } = {}) {
  const I = isikOf(isik), a = clamp01(acik) * 82 * Math.PI / 180, lw = w * Math.cos(a), sk = Math.sin(a), xh = yon > 0 ? x : x + w, xf = xh + yon * lw;
  const col = mixHex(renk, '#10292B', I.k * 0.7);
  K.rect(x - 16, y - 16, w + 32, h + 16, I.trim);
  K.rect(x, y, w, h, ic);
  K.poly([[xh, y], [xf, y - 26 * sk], [xf, y + h + 20 * sk], [xh, y + h]], mixHex(col, INK, 0.12 * sk), LW);
  if (lw > 60) {
    const q = u => xh + yon * lw * u;
    if (cam) K.poly([[q(0.14), y + h * 0.08], [q(0.86), y + h * 0.08 - 20 * sk], [q(0.86), y + h * 0.42 - 8 * sk], [q(0.14), y + h * 0.42]], mixHex('#CFDCD4', '#10292B', I.k * 0.6), LW);
    if (levha && sk < 0.2) { K.rect(q(0.2), y + h * 0.18, lw * 0.6, h * 0.08, PAL.cream, LW * 0.6, 4); K.text(levha, q(0.5), y + h * 0.245, h * 0.05, INK, 800); }
  }
  const kol = [xh + yon * lw * 0.84, y + h * 0.56 + 6 * sk];
  K.circ(kol[0], kol[1], 16, PAL.mustard);
  return { kol, agiz: yon > 0 ? [Math.max(x, xf), x + w] : [x, Math.min(x + w, xf)] };
}
// Bölme: yan yana iki mekânın arasındaki duvar kesiti. 'on' katmanında çizilir; yürüyen karakter arkasından geçer.
export function bolme(K, x, { floorY = 1500, w = 56, renk = '#1B3A3C' } = {}) { K.rect(x, -500, w, floorY + 500, renk, LW); K.rect(x - 8, floorY - 172, w + 16, 22, '#D7CBB2', LW); }
// Duvar saati: ondalık saatle (19.5 = 19:30; zaman atlamasında saatSar ile sürülür). Saniye kolu t ile döner.
export function duvarSaati(K, x, y, r, saat, t = 0) { const h = ((saat % 24) + 24) % 24; clock(K, x, y, r, Math.floor(h), (h - Math.floor(h)) * 60, t); }
// Sandalye (yandan): (x, y) oturağın üst ortası (hikaye.js oturak() verir), yon: oturanın baktığı yön. Karakterden ÖNCE çizilir.
export function sandalye(K, x, y, { w = 150, sirt = 190, yon = 1, renk = PAL.wood, zemin = 1500 } = {}) {
  const xb = x - yon * (w / 2 - 4), xf = x + yon * (w / 2 - 14);
  K.rect(xb - 9, y - sirt, 18, zemin - y + sirt, renk, LW, 6);          // arka ayak + sırtlık direği
  K.rect(xf - 8, y + 10, 16, zemin - y - 10, renk, LW, 6);              // ön ayak
  K.rect(Math.min(xb - yon * 2, xb + yon * 26) , y - sirt, 28, 84, PAL.woodTop, LW, 8);   // sırt tahtası
  K.rect(x - w / 2, y, w, 24, PAL.woodTop, LW, 8);                      // oturak
}

// ═══════════════════════════ Mekân kaydı ═══════════════════════════
export const MEKAN = {};
export function mekanEkle(ad, def) { MEKAN[ad] = { ad, gen: [0, 1800], zemin: 1500, capa: {}, kadraj: {}, dongu: [], ...def }; return MEKAN[ad]; }
const mekanOf = m => typeof m === 'string' ? MEKAN[m] : m;
// Bir katmanı çizer: katman 'arka' | 'isik' | 'on'. o.ox ile mekân dünyada kaydırılır.
export function mekanCiz(K, m, katman, t, o = {}) {
  const M = mekanOf(m); if (!M[katman]) return;
  const { ctx } = K; ctx.save(); ctx.translate(o.ox || 0, 0);
  M[katman](K, t, { ...o, isik: isikOf(o.isik || ISIK.gunduz), durum: o.durum || {} });
  ctx.restore();
}
// Çapa: adlandırılmış dünya noktası. Kayıtta sabit [x, y] ya da durum'a bağlı fonksiyon (açılan kapının kolu) olabilir.
export const capa = (m, ad, ox = 0, durum = {}) => { const c = mekanOf(m).capa[ad], p = typeof c === 'function' ? c(durum) : c; return [p[0] + ox, p[1]]; };
export const kadraj = (m, ad, ox = 0) => { const k = mekanOf(m).kadraj[ad]; return [k[0], k[1] + ox, k[2]]; };
// Yan yana mekânlar (kesmesiz yürüyüş geçişi; 021 oda → arşiv): yanYana([['odaA', o], ['odaB', o]]) her mekâna dünya
// kayması verir, aralarına bölme koyar. Dönen: { D: [{ M, ox, x0, x1 }], ciz(K, katman, t, ek), capa(i, ad), kadraj(i, ad), gecit(i) }
export function yanYana(liste, { duvar = 56 } = {}) {
  let x = 0;
  const D = liste.map(([m, o = {}]) => { const M = mekanOf(m), ox = x - M.gen[0]; x += M.gen[1] - M.gen[0] + duvar; return { M, o, ox, x0: ox + M.gen[0], x1: ox + M.gen[1] }; });
  return {
    D,
    ciz(K, katman, t, ek = {}) {
      D.forEach((d, i) => {   // her mekân kendi genişliğine kırpılır: komşusunun üstüne taşmaz
        const a = i === 0 ? -1e5 : d.x0, b = i === D.length - 1 ? 1e5 : d.x1 + duvar;
        K.ctx.save(); K.ctx.beginPath(); K.ctx.rect(a, -1e4, b - a, 2e4); K.ctx.clip();
        mekanCiz(K, d.M, katman, t, { ...d.o, ...(ek[d.M.ad] || {}), ox: d.ox });
        K.ctx.restore();
      });
      if (katman === 'on') for (let i = 0; i + 1 < D.length; i++) bolme(K, D[i].x1, { w: duvar, floorY: D[i].M.zemin });
    },
    capa: (i, ad, durum) => capa(D[i].M, ad, D[i].ox, durum), kadraj: (i, ad) => kadraj(D[i].M, ad, D[i].ox),
    gecit: i => D[i].x1 + duvar / 2,   // i. ile (i+1). mekân arasındaki bölmenin ortası (yürüyüş bu x'ten geçer)
  };
}

// ═══════════════════════════ Örnek mekân: çay ocağı ═══════════════════════════
// Soldan sağa: buzdolabı, tezgâh (ocakta çaydanlık, lavabo ve musluk), duvar saati, kapı. Işık: gündüz ve gece.
// durum = { dolap: 0..1 (buzdolabı kapağı), kapi: 0..1, saat: ondalık saat }. Döngüler: çaydanlık buharı, damlayan musluk.
const DOLAP = { x: 120, y: 800, w: 320, h: 700 }, TEZ = { x: 500, y: 1196, w: 860 }, KAPI = { x: 1500, y: 770, w: 300, h: 730 };
function buzdolabi(K, u, I) {
  const { x, y, w, h } = DOLAP, a = clamp01(u) * 112 * Math.PI / 180, xf = x + w * Math.cos(a), sk = Math.sin(a), gece = I.yildiz > 0.5;
  const govde = mixHex('#E4E1D6', '#10292B', I.k * 0.75);
  K.rect(x + 22, y + h - 4, 30, 16, '#5D6A61', LW * 0.7); K.rect(x + w - 52, y + h - 4, 30, 16, '#5D6A61', LW * 0.7);
  K.rect(x, y, w, h, govde, LW, 14);
  if (u > 0.02) {   // iç: üç boş raf (son baklava gitmiş)
    K.rect(x + 18, y + 18, w - 36, h - 220, gece ? '#F7EBC2' : '#F4EDE0', LW * 0.7, 6);
    for (const fy of [0.3, 0.62]) K.line(x + 18, y + 18 + (h - 220) * fy, x + w - 18, y + 18 + (h - 220) * fy, 5, '#B9B4A8');
  }
  K.rect(x + 14, y + h - 180, w - 28, 160, mixHex('#D8D4C6', '#10292B', I.k * 0.75), LW * 0.7, 8);   // alt çekmece
  const leaf = [[x, y + 6], [xf, y + 6 - 30 * sk], [xf, y + h - 196 + 24 * sk], [x, y + h - 196]];
  K.poly(leaf, mixHex(a > Math.PI / 2 ? '#CFCBBE' : '#ECE9DE', '#10292B', I.k * 0.75), LW);
  if (a < Math.PI / 2 - 0.2) K.rect(xf - 40, y + 190, 16, 130, '#8FA093', LW * 0.7, 8);   // kulp
  else if (a > Math.PI / 2) for (const fy of [0.25, 0.55, 0.8]) K.line(lerp(x, xf, 0.15), y + (h - 196) * fy, lerp(x, xf, 0.85), y + (h - 196) * fy - 12 * sk, 6, '#A9A498');   // kapak rafları
}
mekanEkle('cayOcagi', {
  gen: [0, 1900], zemin: 1500, isiklar: ['gunduz', 'gece'],
  dongu: ['çaydanlık buharı', 'damlayan musluk'],
  capa: {
    tezgah: [930, TEZ.y], tezgahSol: [560, TEZ.y], caydanlik: [650, 1036], musluk: [1128, 1122], lavabo: [1128, TEZ.y],
    dolapRaf: [280, 1090], dolapKulp: [408, 1055], dolapOnu: [470, 1500], kapiOnu: [1640, 1500],
    kapiKolu: d => { const a = clamp01(d.kapi || 0) * 82 * Math.PI / 180; return [KAPI.x + KAPI.w * Math.cos(a) * 0.84, KAPI.y + KAPI.h * 0.56 + 6 * Math.sin(a)]; },   // kapı açıldıkça kol da gider
    sira: [760, 1500], saat: [1420, 850],
  },
  kadraj: { genis: [0.96, 950, 1222], tezgah: [1.25, 900, 1150], dolap: [1.2, 420, 1150], kapi: [1.3, 1620, 1150] },
  arka(K, t, { isik: I, durum }) {
    const { ctx } = K, gece = I.yildiz > 0.5, dk = c => mixHex(c, '#10292B', I.k * 0.75);
    oda(K, { x0: -500, x1: 2400, isik: I, duvar: 'fayans', zemin: 'karo' });
    // raf: çay bardakları, çay kutusu, şekerlik
    K.rect(560, 900, 700, 22, dk(PAL.woodTop), LW, 6);
    for (const x of [580, 1230]) K.poly([[x, 922], [x + 10, 922], [x + 10, 962]], dk(PAL.woodDark), LW * 0.7);
    for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(640 + i * 62, 900); ctx.scale(250, 250); teaGlass(ctx, 0, 0, 1, 0.024); ctx.restore(); }
    K.rect(1010, 812, 86, 88, dk(PAL.red), LW, 8); K.rect(1022, 838, 62, 34, dk(PAL.cream), LW * 0.5, 4); K.text(K.up('çay'), 1053, 864, 26, INK, 900);
    K.rect(1130, 836, 70, 64, dk('#CFE3DD'), LW, 10); K.rect(1124, 822, 82, 18, dk(PAL.metal), LW * 0.8, 6);
    duvarSaati(K, 1420, 850, 56, durum.saat ?? 10.25, t);
    buzdolabi(K, durum.dolap || 0, I);
    // tezgâh: üst tabla, dört kapak
    K.rect(TEZ.x + 14, TEZ.y + 40, TEZ.w - 28, 1500 - TEZ.y - 40, dk(PAL.wood), LW);
    for (let i = 0; i < 4; i++) { const x = TEZ.x + 34 + i * 202; K.rect(x, TEZ.y + 64, 186, 216, dk(PAL.woodTop), LW, 6); K.circ(x + (i % 2 ? 26 : 160), TEZ.y + 170, 9, dk('#5D6A61'), LW * 0.6); }
    K.rect(TEZ.x, TEZ.y, TEZ.w, 42, dk(PAL.woodTop), LW, 8);
    // lavabo ve musluk (döngü: damla)
    K.rect(1040, TEZ.y - 6, 190, 20, dk('#C9C3B6'), LW * 0.8, 6);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [lw, c] of [[24, INK], [12, dk('#C9C3B6')]]) { ctx.beginPath(); ctx.moveTo(1196, TEZ.y - 4); ctx.lineTo(1196, 1104); ctx.quadraticCurveTo(1196, 1066, 1162, 1066); ctx.quadraticCurveTo(1128, 1066, 1128, 1100); ctx.lineWidth = lw; ctx.strokeStyle = c; ctx.stroke(); }
    ctx.restore();
    K.rect(1206, 1118, 30, 14, dk(PAL.coral), LW * 0.7, 6);
    damlaDongu(K, 1128, 1126, TEZ.y - 12, t, { periyot: 1.35 });
    // ocak ve çaydanlık (döngü: buhar)
    K.rect(586, TEZ.y - 20, 128, 22, dk('#5D6A61'), LW * 0.8, 6);
    ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(650, 1108, 62, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = dk('#3A3F3C'); ctx.stroke(); ctx.restore();   // sap
    K.poly([[704, 1128], [752, 1098], [760, 1110], [708, 1150]], dk(PAL.metal), LW);                  // emzik
    K.rect(600, 1104, 100, 74, dk(PAL.metal), LW, 14);                                                  // alt demlik
    K.rect(618, 1054, 64, 54, dk('#B9C6BB'), LW, 12); K.circ(650, 1048, 9, dk('#3A3F3C'), LW * 0.6);    // üst demlik
    if (!gece) buhar(K, 756, 1092, t, { k: 0.9, n: 2 });
    // kapı (koridora açılır)
    kapi(K, KAPI.x, KAPI.y, KAPI.w, KAPI.h, { acik: durum.kapi || 0, isik: I, ic: gece ? '#F3E3B0' : '#3E6E6F', cam: true });
  },
  // Gece: karartma; buzdolabı açıksa içi ve önündeki zemin, kapı açıksa koridor ışığı düz renkli şerit olarak düşer.
  isik(K, t, { isik: I, durum }) {
    karart(K, I.k);
    if (I.k < 0.2) return;
    const u = clamp01(durum.dolap || 0), d = clamp01(durum.kapi || 0);
    if (u > 0.05) {
      isikSeridi(K, [[DOLAP.x + 18, DOLAP.y + 18], [DOLAP.x + DOLAP.w - 18, DOLAP.y + 18], [DOLAP.x + DOLAP.w - 18, DOLAP.y + DOLAP.h - 202], [DOLAP.x + 18, DOLAP.y + DOLAP.h - 202]], { a: 0.8 * u });
      isikSeridi(K, [[DOLAP.x + DOLAP.w - 18, DOLAP.y + 18], [DOLAP.x + DOLAP.w + 420, DOLAP.y + 300], [DOLAP.x + DOLAP.w + 560, 1500 + 420], [DOLAP.x + 40, 1500 + 420], [DOLAP.x + 18, DOLAP.y + DOLAP.h - 202]], { a: 0.3 * u });
    }
    if (d > 0.05) isikSeridi(K, zeminIsigi(KAPI.x + KAPI.w * (1 - 0.9 * d), KAPI.x + KAPI.w, 1500, { uz: 420, kay: -220, ac: 0.3 }), { a: 0.42 });
  },
});
