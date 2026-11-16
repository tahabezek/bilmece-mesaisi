// Bölüm 41 · SAHTE ŞEKER ÇUVALI (v4 "hikâye" dili; storyboard: hikayeler/bolum_041_v5.md). Az bilinen klasik, yeni kurgu.
// Logline: Çay ocağının deposuna numaralı on çuval küp şeker gelir; birinin bütün küpleri bir gram hafiftir. Dijital
// terazinin pili tek tartılıktır. Defne her çuvaldan numarası kadar küp alır, sahte çuvalı tek tartıda okur.
// Akılda kalacak tek şey: eksik gram, sahte çuvalın numarasıdır.
// Tek set: depo (önden). Çuvallar ön sırada (karakterlerin bacaklarını örter), arkada duvar rafı (yığınlar rafta kurulur),
// sağ uçta yan masa ve dijital terazi. Görüntü cevabı önceden söylemez: "Buldum!"dan önce hiçbir yerde farklı sayıda küp
// görünmez (yanlış deneme: her çuvaldan birer küp; ipucu: Necmi'nin bardakları).
// Sayılar gerçektir: 1 + 2 + … + 10 = 55 küp; 7. çuvalın küpleri 9 gram; terazi her düşen küpün gramını ekler, 543'te durur.
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur; rastgelelik yalnız tohumlu.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const DEPO = 'b041_depo';
const ZEMIN = 1500, KY = 1525, KS = 0.85;                       // çuvalların tabanı · karakterlerin ayağı (çuvalların arkasında, görünmez) · ölçek
const SX = k => 70 + (k - 1) * 86;                              // k. çuvalın ortası (k = 1..10)
const CUV_H = 170, AGIZ = ZEMIN - CUV_H, ETK_Y = ZEMIN - 82;    // çuval boyu · ağız (rulo kenarın üstü) · numara etiketi
const SAHTE = 7;
const RAF_Y = 1200, RAF_X0 = 0, RAF_X1 = 872;                   // duvar rafı (yığınlar burada kurulur)
const MASA_X0 = 880, MASA_X1 = 1110, MASA_Y = 1320;             // yan masa (terazi üstünde)
const TER_X = 985;                                              // terazinin ortası
const KUP = 18;                                                 // yığın küpü
const BURLAP = '#D7C08E', BURLAP_K = '#BFA470', BURLAP_R = '#C9AD74', SEKER = '#FBF8F1', SEKER_T = '#FFFFFF', SEKER_Y = '#D9D1C0';
const LCD = '#A9C49B', LCD_SON = '#3B463A', LCD_YAZI = '#1E2B1D';
const CAY = '#A5491A';
const sx = k => KS * H.BOY[k];

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
// Sıralı yol: duraklar [[t, [x, y]], …]; ease.state ile
function yol(t, d) {
  if (t <= d[0][0]) return d[0][1];
  for (let i = 1; i < d.length; i++) if (t < d[i][0]) { const u = ease.state((t - d[i - 1][0]) / (d[i][0] - d[i - 1][0])); return [lerp(d[i - 1][1][0], d[i][1][0], u), lerp(d[i - 1][1][1], d[i][1][1], u)]; }
  return d[d.length - 1][1];
}
const kisiK = (key, o = {}) => H.kisi(key, { y: KY, s: sx(key), ...o });

// ═══════════════════════════ Nesneler ═══════════════════════════
// Şeker küpü: (x, y) alt orta, s kenar. Ön yüz + üst yüz + sağ yan yüz.
function kup(K, x, y, s, { a = 1 } = {}) {
  const { ctx } = K, lw = Math.max(1.8, s * 0.1), f = s * 0.82, d = s * 0.18;
  if (a < 1) { ctx.save(); ctx.globalAlpha = a; }
  K.poly([[x + s / 2, y], [x + s / 2 + d, y - d * 1.2], [x + s / 2 + d, y - f - d * 1.2], [x + s / 2, y - f]], SEKER_Y, lw);
  K.poly([[x - s / 2, y - f], [x + s / 2, y - f], [x + s / 2 + d, y - f - d * 1.2], [x - s / 2 + d, y - f - d * 1.2]], SEKER_T, lw);
  K.rect(x - s / 2, y - f, s, f, SEKER, lw, s * 0.08);
  if (a < 1) ctx.restore();
}
// Yığın: alttan üste 4-3-2-1 piramit; n küp (0..10). (x, y) tabanın ortası
const SATIR = [4, 3, 2, 1];
function yiginYer(n, x, y, s = KUP) {
  const out = []; let kalan = n, r = 0;
  while (kalan > 0 && r < 4) { const c = Math.min(SATIR[r], kalan); for (let i = 0; i < c; i++) out.push([x + (i - (c - 1) / 2) * (s + 1.5), y - r * s * 0.84]); kalan -= c; r++; }
  return out;
}
function yigin(K, n, x, y, s = KUP) { for (const [px, py] of yiginYer(n, x, y, s)) kup(K, px, py, s); }
// Avuçtaki küpler (elin üstünde küçük küme): el noktasının hemen üstü
function avuc(K, n, [x, y], s = 15) { if (n <= 0) return; yigin(K, Math.min(10, n), x, y - s * 0.35, s); }

// Çuval: (x) ortası, k numarası. lift: kaldırma (px), nab: etiket nabzı, yesil: yeşil çerçeve
function cuval(K, x, k, { lift = 0, nab = 0, yesil = 0 } = {}) {
  const { ctx } = K, y = ZEMIN - lift;
  if (lift > 2) { ctx.save(); ctx.globalAlpha = 0.18; K.ell(x + 6, ZEMIN - 2, 40, 9, INK, 0); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(x - 37, y); ctx.lineTo(x + 37, y); ctx.quadraticCurveTo(x + 45, y - 82, x + 36, y - 150); ctx.lineTo(x - 36, y - 150); ctx.quadraticCurveTo(x - 45, y - 82, x - 37, y); ctx.closePath();
  K.fs(BURLAP, LW * 0.85);
  ctx.save(); ctx.clip(); ctx.globalAlpha = 0.35;
  for (const dy of [34, 120]) K.line(x - 50, y - dy, x + 50, y - dy, 3, BURLAP_K);
  K.line(x + 22, y - 150, x + 24, y, 3, BURLAP_K);
  ctx.restore();
  K.rect(x - 40, y - 170, 80, 26, BURLAP_R, LW * 0.8, 9);
  K.ell(x, y - 166, 33, 9, '#F1EADB', LW * 0.6);
  for (const [dx, dy] of [[-16, -167], [-2, -169], [13, -166]]) K.rect(x + dx - 5, y + dy - 3, 10, 6, SEKER_T, 1.6, 1.5);
  // numara etiketi (≥ 44 px ekranda)
  const ky = y - 82, sc = 1 + 0.2 * nab;
  ctx.save(); ctx.translate(x, ky); ctx.scale(sc, sc);
  K.circ(0, 0, 31, PAL.paper, LW * 0.7);
  K.text(String(k), 0, 18, 50, INK, 900);
  ctx.restore();
  if (yesil > 0.02) { ctx.save(); ctx.globalAlpha = yesil; ctx.beginPath(); ctx.roundRect(x - 52, y - 182, 104, 190, 18); ctx.lineWidth = 10; ctx.strokeStyle = PAL.green; ctx.stroke(); ctx.restore(); }
  return [x, y - 166];
}
// Yedi parçalı rakam: (x, y) merkez, h yükseklik
const SEG7 = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g' };
function seg7(K, x, y, h, ch, col) {
  const s = SEG7[ch]; if (!s) return;
  const w = h * 0.55, th = h * 0.15, { ctx } = K, hh = h / 2;
  const bar = (x0, y0, x1, y1) => { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * th / 2, ny = ux * th / 2, e = th / 2;
    ctx.beginPath(); ctx.moveTo(x0 + ux * 1, y0 + uy * 1); ctx.lineTo(x0 + ux * e + nx, y0 + uy * e + ny); ctx.lineTo(x1 - ux * e + nx, y1 - uy * e + ny); ctx.lineTo(x1 - ux, y1 - uy); ctx.lineTo(x1 - ux * e - nx, y1 - uy * e - ny); ctx.lineTo(x0 + ux * e - nx, y0 + uy * e - ny); ctx.closePath(); ctx.fill(); };
  ctx.fillStyle = col; const sl = h * 0.06;
  const P = { a: [x - w / 2 + sl, y - hh, x + w / 2 + sl, y - hh], b: [x + w / 2 + sl, y - hh, x + w / 2, y], c: [x + w / 2, y, x + w / 2 - sl, y + hh], d: [x - w / 2 - sl, y + hh, x + w / 2 - sl, y + hh],
    e: [x - w / 2, y, x - w / 2 - sl, y + hh], f: [x - w / 2 + sl, y - hh, x - w / 2, y], g: [x - w / 2, y, x + w / 2, y] };
  for (const k of s) bar(...P[k]);
}
// Dijital terazi: (cx, by) alt orta. o = { deger: '543' | '' , pil (0..1 simge görünürlüğü), sonuk (0..1), kupN (kefedeki küp) }
// Dönen: { kenar: [rimY], dugme, ekran, kase }
const KASE_RX = 90;
function terazi(K, cx, by, { deger = '0', pil = 1, sonuk = 0, kupN = 0, nab = 0 } = {}) {
  const { ctx } = K, top = by - 72, rim = top - 40;
  // kefe (paslanmaz kâse): arka kenar → içindekiler → ön duvar
  K.ell(cx, rim, KASE_RX, 17, '#AEB9B2', LW * 0.7);
  if (kupN > 0) kaseIci(K, cx, rim, kupN);
  ctx.beginPath(); ctx.moveTo(cx - KASE_RX, rim); ctx.bezierCurveTo(cx - KASE_RX + 6, rim + 30, cx - 62, top, cx - 50, top); ctx.lineTo(cx + 50, top); ctx.bezierCurveTo(cx + 62, top, cx + KASE_RX - 6, rim + 30, cx + KASE_RX, rim);
  ctx.ellipse(cx, rim, KASE_RX, 17, 0, 0, Math.PI, false); ctx.closePath(); K.fs('#C9D3CC', LW * 0.8);
  K.line(cx - 64, rim + 22, cx - 40, top - 4, 4, 'rgba(255,255,255,0.7)');
  // gövde
  K.rect(cx - 104, top, 208, 72, '#E7E1D3', LW, 13);
  K.rect(cx - 96, by - 6, 192, 8, '#BDB6A6', LW * 0.6, 3);
  // düğme (üst yüzün sağ köşesi)
  K.ell(cx + 82, top + 2, 12, 5, PAL.red, LW * 0.6);
  // LCD
  const lx = cx - 92, ly = top + 8, lw = 146, lh = 56;
  K.rect(lx, ly, lw, lh, H.mixHex(LCD, LCD_SON, sonuk), LW * 0.7, 6);
  const yazi = H.mixHex(LCD_YAZI, LCD_SON, sonuk), ch = String(deger).padStart(3, ' ').slice(-3);
  if (sonuk < 0.98) for (let i = 0; i < 3; i++) seg7(K, lx + lw - 22 - (2 - i) * 31, ly + lh / 2, 40, ch[i], yazi);
  // pil simgesi (sol üst; tek çubuk)
  if (pil > 0.02 && sonuk < 0.98) {
    ctx.save(); ctx.globalAlpha = pil * (1 - sonuk); const px = lx + 7, py = ly + 6;
    ctx.lineWidth = 2.6; ctx.strokeStyle = yazi; ctx.strokeRect(px, py, 22, 11); ctx.fillStyle = yazi; ctx.fillRect(px + 22, py + 3, 3, 5); ctx.fillRect(px + 3, py + 3, 5, 5);
    ctx.restore();
  }
  if (nab > 0.01) { ctx.save(); ctx.globalAlpha = nab; ctx.lineWidth = 9; ctx.strokeStyle = PAL.mustard; ctx.beginPath(); ctx.roundRect(lx - 9, ly - 9, lw + 18, lh + 18, 10); ctx.stroke(); ctx.restore(); }
  return { rim, top, dugme: [cx + 82, top + 2], ekran: [lx + lw / 2, ly + lh / 2], ekranSag: lx + lw, kase: [cx, rim] };
}
// Kefedeki küpler: kenarın üstüne yükselen tümsek (ön duvar sonra çizilir ve alt kısmı örter)
const KASE_SATIR = [10, 9, 9, 8, 7, 6, 5, 4, 2];
const KR = H.mulberry32(41041), KASE_OFS = Array.from({ length: 64 }, () => [KR() * 6 - 3, KR() * 4 - 2]);
function kaseIci(K, cx, rim, n) {
  let i = 0;
  for (let r = 0; r < KASE_SATIR.length && i < n; r++) {
    const c = KASE_SATIR[r];
    for (let j = 0; j < c && i < n; j++, i++) { const o = KASE_OFS[i]; kup(K, cx + (j - (c - 1) / 2) * 15 + o[0], rim + 26 - r * 7.5 + o[1], 16); }
  }
}
// Çay tabağı (önden, hafif üstten) ve üstünde n küp (2 sıra × 5); jig: sırayla kıpırdama anı
function tabak(K, [x, y], n, t = 0, jig = -1) {
  K.ell(x, y, 62, 15, PAL.cream, LW * 0.7); K.ell(x, y - 2, 44, 9, '#EFE6D2', LW * 0.4);
  const yer = i => { const r = i < 5 ? 0 : 1, c = i % 5; return [x - 34 + c * 17 + (r ? 8 : 0), y - 4 - r * 9]; };
  const sira = []; for (let i = 0; i < Math.min(10, n); i++) sira.push(i >= 5 ? i - 5 : i + 5);   // arka sıra önce dolar, önce çizilir
  for (let q = 0; q < Math.min(10, n); q++) {
    const i = q < 5 ? q + 5 : q - 5;   // çizim sırası: arka sıra (5..9), sonra ön (0..4)
    if (i >= n) continue;
    const [px, py] = yer(i), z = jig >= 0 ? 7 * H.nabiz(t, jig + i * 0.055, 0.22) : 0;
    kup(K, px, py - z, 15);
  }
}
// İnce belli çay bardağı (b034'ten): (x, y) taban ortası, k ölçek. sev: sıvı seviyesi
const GOVDE = [[-18, -62], [18, -62], [11, -36], [19, -11], [13, -2], [-13, -2], [-19, -11], [-11, -36]];
function bardak(K, x, y, k, { sev = 0.72, t = 0, buhar = 0.6, dalga = 0 } = {}) {
  const { ctx } = K, yolu = c => { GOVDE.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.closePath(); };
  if (buhar > 0) H.buhar(K, x, y - 66 * k, t, { k: buhar, n: 2, ara: 9 * k, boy: 70 });
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.ell(0, 0, 30, 8, PAL.cream, 6 / k * 0.7 + 0.4);
  ctx.beginPath(); yolu(ctx); ctx.fillStyle = 'rgba(244,237,224,0.34)'; ctx.fill();
  H.sivi(K, yolu, [-18, -62, 36, 60], { seviye: sev, renk: CAY });
  if (dalga > 0.01) { const yy = -2 - 60 * sev; ctx.save(); ctx.globalAlpha = dalga; ctx.lineWidth = 3 / k * 1.5; ctx.strokeStyle = PAL.paper; ctx.beginPath(); ctx.ellipse(0, yy, 6 + 10 * (1 - dalga), 2.5, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.beginPath(); yolu(ctx); K.fs(null, Math.max(0.8, 6.5 / k));
  K.line(-12, -54, -9, -20, Math.max(0.9, 4 / k), 'rgba(255,255,255,0.7)');
  ctx.restore();
}
// Necmi'nin çay tepsisi (önden): (x, y) tepsi ortası. 3 bardak + şekerlik + oda numarası kartları
const TP = { rx: 175, ry: 44, g: [-112, -22, 68], sek: 132 };
function tepsi(K, [x, y], t, { dalga = [0, 0, 0], kart = 1, sekerlik = true } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.globalAlpha = 0.22; K.ell(x + 8, y + 12, TP.rx, TP.ry, INK, 0); ctx.restore();
  K.ell(x, y, TP.rx, TP.ry, '#C9B07A', LW * 0.9); K.ell(x, y - 3, TP.rx - 16, TP.ry - 9, '#D8C08A', LW * 0.4);
  if (sekerlik) { const bx = x + TP.sek, by = y - 4; K.poly([[bx - 30, by - 40], [bx + 30, by - 40], [bx + 24, by], [bx - 24, by]], '#CFE3DD', LW * 0.7); for (let i = 0; i < 3; i++) kup(K, bx - 14 + i * 14, by - 40 + (i % 2) * -4, 14); }
  TP.g.forEach((gx, i) => bardak(K, x + gx, y + 2, 1.3, { t: t + i * 0.37, dalga: dalga[i], buhar: 0.55 }));
  // oda numarası kartları (bardağın önünde)
  if (kart > 0.01) TP.g.forEach((gx, i) => { const kx = x + gx, ky = y + 24; ctx.save(); ctx.globalAlpha = kart; K.rect(kx - 22, ky - 30, 44, 46, PAL.paper, LW * 0.6, 6); K.text(String(i + 1), kx, ky + 8, 40, INK, 900); ctx.restore(); });
}
// Yandan tepsi (yürürken): ince elips + bardak tepeleri
function tepsiYan(K, [x, y], t) {
  K.ell(x, y, 110, 12, '#C9B07A', LW * 0.8);
  for (const dx of [-60, -10, 40]) bardak(K, x + dx, y - 4, 0.9, { t, buhar: 0.35 });
  K.poly([[x + 64, y - 30], [x + 98, y - 30], [x + 94, y - 6], [x + 68, y - 6]], '#CFE3DD', LW * 0.6);
}
// Kol (dirsek → el ya da omuz → el) ve el; clip: yalnız bu dikdörtgende çiz ([x0, y0, x1, y1])
function kolCiz(K, key, p, side, { omuz = false, clip = null } = {}) {
  const c = H.CARDS[key], { ctx } = K, s = p.s, w = c.arm.w * s, lw = c.line * s;
  const sh = H.eklem(key, p, 'sh' + side), el = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side);
  ctx.save();
  if (clip) { ctx.beginPath(); ctx.rect(clip[0], clip[1], clip[2] - clip[0], clip[3] - clip[1]); ctx.clip(); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); if (omuz) { ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); } else ctx.moveTo(el[0], el[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke();
  H.grip(K, key, h, s);
  ctx.restore();
  return h;
}
// Sarkan ampul (sahne döngüsü)
function ampul(K, x, y, t) {
  const a = 0.05 * Math.sin(t * 1.6), { ctx } = K, L = 260;
  ctx.save(); ctx.translate(x, y - L); ctx.rotate(a);
  K.line(0, -400, 0, L - 30, 4); K.poly([[-34, L - 6], [34, L - 6], [16, L - 40], [-16, L - 40]], PAL.teal, LW * 0.7); K.circ(0, L + 8, 15, '#FFF4D6', LW * 0.6);
  ctx.restore();
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(DEPO, {
  gen: [-300, 1500], zemin: ZEMIN, dongu: ['pencerede martı', 'duvar saatinin saniye kolu', 'sarkan ampul', 'terazide yanıp sönen pil simgesi'],
  kadraj: { genis: [0.94, 520, 1200] },
  arka(K, t, { durum = {} } = {}) {
    M.oda(K, { x0: -1300, x1: 2000, floorY: ZEMIN, duvar: 'fayans', zemin: 'karo' });
    M.pencere(K, 70, 650, 360, 200, { t: t + 3 });
    M.duvarSaati(K, 1012, 742, 54, 10.25 + t / 3600, t);
    // üst rafta şeker kolileri (süs)
    K.rect(560, 760, 330, 14, PAL.woodDark, LW * 0.7, 3);
    for (const [bx, bw, bh] of [[574, 92, 70], [676, 72, 56], [758, 118, 64]]) K.rect(bx, 760 - bh, bw, bh, '#C9A46A', LW * 0.7, 4);
    // duvar rafı (yığınların rafı): tahta + konsollar
    K.rect(RAF_X0, RAF_Y, RAF_X1 - RAF_X0, 18, PAL.woodTop, LW, 4);
    for (const bx of [60, 440, 820]) K.poly([[bx - 8, RAF_Y + 18], [bx + 8, RAF_Y + 18], [bx + 8, RAF_Y + 70], [bx - 8, RAF_Y + 30]], PAL.woodDark, LW * 0.6);
    // raftaki yığınlar ve süpürülen tümsek (durum'dan)
    for (const [n, x] of durum.yiginlar || []) yigin(K, n, x, RAF_Y);
    if (durum.tumsek) tumsekCiz(K, durum.tumsek);
    ampul(K, 560, 640, t);
  },
});
// Yan masa (karakterlerin önünde)
function masa(K) {
  K.rect(MASA_X0 + 18, MASA_Y + 16, 16, ZEMIN - MASA_Y - 16, PAL.woodDark, LW * 0.8, 3);
  K.rect(MASA_X1 - 34, MASA_Y + 16, 16, ZEMIN - MASA_Y - 16, PAL.woodDark, LW * 0.8, 3);
  K.rect(MASA_X0 + 18, MASA_Y + 16, MASA_X1 - MASA_X0 - 36, 40, PAL.wood, LW * 0.8, 3);
  K.rect(MASA_X0 - 6, MASA_Y, MASA_X1 - MASA_X0 + 12, 20, PAL.woodTop, LW, 5);
}
// Süpürülen tümsek: { on (ön kenar x), n } — rafta, ön kenarın solunda; satırlar üst üste biner
const TR = H.mulberry32(4141), TUM_OFS = Array.from({ length: 60 }, () => [TR() * 6 - 3, TR() * 4 - 2]);
function tumsekTaban(n) { let b = 1; for (;;) { let s = 0; for (let c = b; c > 0; c -= 2) s += c; if (s >= n) return b; b++; } }
function tumsekYer(n) {
  const base = tumsekTaban(n), out = []; let i = 0, r = 0;
  while (i < n) { const c = Math.max(1, base - r * 2); for (let j = 0; j < c && i < n; j++, i++) out.push([-(base - r - j - 0.5) * 15, -r * 12]); r++; }
  return out;
}
function tumsekCiz(K, { on, n }) {
  tumsekYer(n).forEach(([dx, dy], i) => { const o = TUM_OFS[i % 60]; kup(K, on + dx + o[0] - 6, RAF_Y + dy + o[1] * 0.5, 16); });
}
const tumsekGen = n => n <= 0 ? 0 : (tumsekTaban(n) + 0.5) * 15;

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    tap: 0.3, cuvaldan: T('h1:2'), sahte1: T('h1:4'), hafif: T('h1:7'),
    kup: T('h2a') - 0.05, kupA: T('h2a:1'), on2: T('h2a:2'), sahtesi: T('h2a:4'), dokuz: T('h2a:5'), bu: T('h2a:6'), pili: T('h2a:8'), tek: T('h2a:9'),
    oda2: T('h2b') - 0.05, dip: [T('h2b:1'), T('h2b:2') + 0.06, T('h2b:3') + 0.3], sahte2: T('h2b:4'), nasil: T('h2b:8'),
    d2: T('d2'), birer: T('d2:2'), tartarim: T('d2:4'),
    hd: T('hd'), cikar: T('hd:3'), biri: T('hd:4'), hangisi: T('hd:7'),
    n1: T('n1'), bir: T('n1:2'), ikinci: T('n1:4'), iki: T('n1:5'), ucuncu: T('n1:6'), uc: T('n1:7'),
    d1: T('d4'), p1: T('d4:1'), d2s: T('d4:2'), p2: T('d4:3'), d10: T('d4b'), p10: T('d4b:1'),
    hepsi: T('d4b:2'), bes: T('d4b:4'), elli: T('d4b:6'),
    eksik: T('d5'), gram2: T('d5:1'), sahte3: T('d5:2'), numara: T('d5:4'), verir: T('d5:5'),
    h4: T('h4'), tartalim: T('h4:6'), cta: T('d6') - 0.14,
  };
  tm.blok = tm.hd - 0.25; tm.ver = tm.biri - 0.5;                          // Hikmet'in eli kefeyi kapatır · tabağı alır
  tm.al2 = cd0 + 0.25; tm.bol = cd0 + 0.85; tm.tart0 = cd0 + 1.15; tm.tart1 = cd0 + 3.05; tm.silk = cd0 + 3.15;
  tm.necGir = cd0 + 2.7; tm.necVar = cd - 0.3; tm.geriKoy = cd0 + 4.15;
  tm.cevap = T('d3:3') - 0.04; tm.terazi = tm.hepsi - 0.04; tm.yedi = tm.sahte3 - 0.05; tm.espri = tm.h4 - 0.8;
  // ——— kahraman yürüyüş: çuval k'nın daldırma (d) ve yığına koyma (p) anları ———
  const xs = k => SX(k) - 54;
  tm.yA = [tm.cevap + 0.05, tm.d1 - 0.2]; tm.yB = [tm.p1 + 0.04, tm.d2s - 0.12]; tm.yC = [tm.p2 + 0.08, tm.d10 - 0.1];
  const xC = t => H.yuru('defne', t, { t0: tm.yC[0], t1: tm.yC[1], x0: xs(2), x1: xs(10), y: KY, s: sx('defne') }).x;
  tm.dk = [null, tm.d1, tm.d2s]; tm.pk = [null, tm.p1, tm.p2];
  for (let k = 3; k <= 9; k++) { let lo = tm.yC[0], hi = tm.yC[1]; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (xC(m) < xs(k)) lo = m; else hi = m; } tm.dk[k] = lo + 0.02; tm.pk[k] = lo + 0.17; }
  tm.dk[10] = tm.d10; tm.pk[10] = tm.p10 - 0.05;
  // ——— süpürme ve kefe: tümsek raf boyunca sağa gider, raf ucundan kefeye dökülür ———
  tm.sup0 = tm.terazi - 0.25; tm.sup1 = tm.bes - 0.02;                      // tümseğin ön kenarı 470 → raf ucu
  tm.dus0 = tm.sup1 - 0.12; tm.dusAra = 0.0105; tm.ucus = 0.2;             // ilk küpün düşüşü, aralık, uçuş süresi
  tm.dusSon = tm.dus0 + 54 * tm.dusAra + tm.ucus;
  // sağlamlık: 55 küp, 543 gram
  const gram = Array.from({ length: 55 }, (_, i) => 10); { let i = 0; for (let k = 1; k <= 10; k++) for (let j = 0; j < k; j++, i++) if (k === SAHTE) gram[i] = 9; }
  tm.gram = gram;
  if (gram.reduce((a, b) => a + b, 0) !== 543) console.error('b041: toplam 543 değil');

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 0.94, 520, 1200], [tm.hafif, 0.96, 525, 1196], [tm.kup - 0.1, 0.97, 528, 1194]] },
    { id: 'kup', t0: tm.kup, cam: [[0, 1.3, 1100, 1135], [tm.bu, 1.32, 1090, 1138], [tm.oda2 - 0.1, 1.33, 1085, 1140]] },
    { id: 'oda2', t0: tm.oda2, cam: [[0, 1.2, 860, 1150], [tm.sahte2, 1.21, 875, 1150], [tm.d2, 1.23, 895, 1146], [tm.hd, 1.24, 905, 1142], [cd0, 1.15, 1185, 1150], [cd0 + 3, 1.16, 1180, 1148], [cd - 0.1, 1.16, 1178, 1148]] },
    { id: 'ipucu', t0: cd, cam: [[0, 1.42, -250, 1240], [tm.iki, 1.44, -248, 1236]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 850, 1110]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.12, 430, 1235], [tm.d1, 1.12, 440, 1235], [tm.d2s + 0.3, 1.12, 480, 1233], [tm.d10, 1.12, 590, 1235], [tm.terazi - 0.1, 1.13, 595, 1235]] },
    { id: 'terazi', t0: tm.terazi, cam: [[0, 1.45, 880, 1180], [tm.elli, 1.46, 885, 1180]] },
    { id: 'yedi', t0: tm.yedi, cam: [[0, 1.3, 640, 1260], [tm.verir, 1.32, 645, 1256]] },
    { id: 'espri', t0: tm.espri, kesme: false, cam: [[0, 1.32, 645, 1256], [tm.espri + 0.1, 1.46, 1050, 1150], [tm.tartalim + 0.3, 1.46, 1052, 1150]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.46, 1052, 1150], [tm.cta + 0.5, 1.25, 870, 1130], [tm.end - 0.1, 1.27, 868, 1126]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();
  return { tm, film };
}

// ═══════════════════════════ Durum fonksiyonları ═══════════════════════════
// Terazinin göstergesi: { deger, sonuk, kupN }
function teraziDurum(S, t) {
  const { tm } = S;
  let n = 0, g = 0;
  for (let i = 0; i < 55; i++) { const tl = tm.dus0 + i * tm.dusAra + tm.ucus; if (t >= tl) { n++; g += tm.gram[i]; } }
  const sonuk = W(t, tm.tartalim + 0.18, 0.3);
  const titre = t > tm.tartalim && t < tm.tartalim + 0.3 ? (Math.floor((t - tm.tartalim) * 20) % 2) : 0;
  return { kupN: n, deger: titre ? '' : String(g), sonuk };
}
// Raftaki yığınlar (kahraman an) ve süpürme tümseği (terazi sahnesi)
function rafDurum(S, t) {
  const { tm } = S, yig = [];
  if (t < tm.cevap) return {};
  const on = suOn(S, t);
  let n = 0;
  for (let k = 1; k <= 10; k++) {
    if (t < tm.pk[k]) continue;
    if (t >= tm.terazi && on >= SX(k) - 28) { n += k; continue; }   // tümsek bu yığını aldı
    yig.push([k, SX(k)]);
  }
  if (t >= tm.terazi) {
    n = Math.max(0, n - Math.max(0, Math.min(55, Math.floor((t - tm.dus0) / tm.dusAra) + 1)));
    return { yiginlar: yig, tumsek: n > 0 ? { on, n } : null };
  }
  return { yiginlar: yig };
}
// Kahraman an: Defne'nin yürüyüşü (yandan; üç parça: girer → 1 → 2 → kesintisiz 10'a)
function kahramanP(tm, t) {
  const xs = k => SX(k) - 54;
  const yu = (a, b, x0, x1) => H.yuru('defne', t, { t0: a, t1: b, x0, x1, y: KY, s: sx('defne'), poz: { expr: 'mutlu', head: { tilt: 4, look: [0.5, 0.4] } } });
  return t < tm.yB[0] ? yu(tm.yA[0], tm.yA[1], -110, xs(1)) : t < tm.yC[0] ? yu(tm.yB[0], tm.yB[1], xs(1), xs(2)) : yu(tm.yC[0], tm.yC[1], xs(2), xs(10));
}
// Dünya uzayında yeşil onay rozeti (çuvalın üstünde, onunla kalkar)
function tik(K, [x, y], t, a, r = 27) {
  if (t < a) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]);
  ctx.save(); ctx.translate(x, y); ctx.scale(v, v); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  K.circ(0, 0, r, PAL.green, LW * 0.8);
  ctx.beginPath(); ctx.moveTo(-r * 0.44, 0); ctx.lineTo(-r * 0.12, r * 0.36); ctx.lineTo(r * 0.47, -r * 0.32); ctx.lineWidth = r * 0.26; ctx.strokeStyle = PAL.paper; ctx.stroke();
  ctx.restore();
}
// Süpürmede tümseğin ön kenarı (raf ucuna kadar)
const suOn = (S, t) => t < S.tm.terazi ? -999 : lerp(470, RAF_X1, ease.state(seg(t, S.tm.sup0, S.tm.sup1 - S.tm.sup0)));

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: {},
  kamera(cam, t, B) {   // kahraman an: kamera Defne'yi izler (kapalı formül: yürüyüşün x'i)
    if (B.sc.id !== 'cevap') return;
    cam.zoom = 1.34; cam.cy = 1262; cam.cx = Math.max(250, Math.min(700, kahramanP(S.tm, t).x + 150));
  },
  dunya(K, t, B) { depoSahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'kup') {
      const f = sabit(tm.on2);
      H.tag(K, t, tm.on2 - 0.04, tm.pili - 0.3, f([930, 1080 - 92]), K.up('10 gr'), PAL.mustard, INK, 50);
      H.tag(K, t, tm.dokuz - 0.04, tm.pili - 0.3, f([1290, 1080 - 92]), K.up('9 gr'), PAL.coral, PAL.paper, 50);
      H.tag(K, t, tm.pili - 0.04, tm.oda2 - 0.22, sabit(tm.pili)([TER_X - 30, MASA_Y - 160]), K.up('tek tartı'), PAL.paper, INK, 50, [tm.tek]);
    }
    if (id === 'oda2') {
      const f = sabit(tm.hd);
      H.tag(K, t, tm.hd - 0.04, tm.biri - 0.3, f([905, 844]), '10 ' + K.up('küp') + ' = 99 ' + K.up('gr'), PAL.mustard, INK, 50);
      H.tag(K, t, tm.biri - 0.04, tm.cd0 - 0.15, sabit(tm.biri)([970, 844]), '?', PAL.coral, PAL.paper, 60, [tm.hangisi]);
    }
    if (id === 'terazi') {
      const f = sabit(tm.bes);
      H.tag(K, t, tm.bes - 0.04, tm.yedi - 0.22, f([1004, 960]), K.up('550 olmalı'), PAL.mustard, INK, 52);
      const sonG = tm.dusSon + 0.02;
      H.tag(K, t, sonG, tm.yedi - 0.22, f([1087, MASA_Y - 36]), '−7', PAL.coral, PAL.paper, 56, [tm.eksik, tm.gram2 + 0.02, tm.sahte3 - 0.3]);
    }
  },
});

// ═══════════════════════════ Depo sahnesi ═══════════════════════════
function depoSahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, { ctx } = K;
  const ekrandan = (sx_, sy_) => [B.cam.cx + (sx_ - 540) / B.cam.zoom, B.cam.cy + (sy_ - 960) / B.cam.zoom];
  const raf = rafDurum(S, t);
  M.mekanCiz(K, DEPO, 'arka', t, { durum: raf });

  const ter = teraziDurum(S, t), pil = 0.25 + 0.75 * (Math.floor(t * 2.4) % 2);
  const P = {}, O = { hikmet: { heads }, defne: { heads }, necmi: { heads } }, sonra = [], dalis = [];
  let teraziYer = [TER_X, MASA_Y], teraziNab = 0;
  let cuvalLift = {}, cuvalNab = {}, cuvalYesil = {};

  // ——— kanca: Hikmet teraziyi kucağında tutar, Necmi 1. çuvalı yere bırakır ———
  if (id === 'kanca') {
    P.hikmet = kisiK('hikmet', { x: 700, expr: t < tm.sahte1 ? 'mutlu' : 'notr', head: { tilt: 3, look: t < tm.cuvaldan - 0.1 ? [-0.6, 0.3] : [-0.5, 0.75] }, ...POZ.dur });
    P.defne = kisiK('defne', { x: 405, expr: 'saskin', head: { tilt: t < tm.sahte1 ? -5 : 4, look: t < tm.sahte1 ? [0.85, 0.15] : [-0.2, 0.8] }, ...POZ.dur });
    P.necmi = kisiK('necmi', { x: 150, expr: t < 0.8 ? IFADE.zorlanma : 'notr', head: { tilt: 4, look: t < 0.8 ? [-0.3, 0.8] : [0.8, 0.1] }, ...POZ.dur });
    const by = 1290 - 10 * H.nabiz(t, tm.hafif - 0.05, 0.4);
    teraziYer = [700, by];
    O.hikmet.L = [[700 - 96, by - 2], 1, 'A']; O.hikmet.R = [[700 + 96, by - 2], 1, 'A'];
    sonra.push(() => { C.hikmet.tut('L'); C.hikmet.tut('R'); });   // terazi kolların üstünde; eller alttan tutar
    const lift = 30 * (1 - clamp01(t / tm.tap) ** 2);
    cuvalLift[1] = lift;
    const birak = W(t, 0.75, 0.3);
    O.necmi.L = [[SX(1) - 30, AGIZ - lift + 8], 1 - birak, 'A']; O.necmi.R = [[SX(1) + 30, AGIZ - lift + 8], 1 - birak, 'A'];
    if (birak < 0.5) sonra.push(() => { kolCiz(K, 'necmi', P.necmi, 'L'); kolCiz(K, 'necmi', P.necmi, 'R'); });
    if (birak > 0) { const z = W(t, 1.05, 0.35); for (const k of ['armL', 'armR']) P.necmi[k] = { sh: lerp(P.necmi[k].sh, 38, z), el: lerp(P.necmi[k].el, -118, z) }; }
    for (let k = 1; k <= 10; k++) cuvalNab[k] = H.nabiz(t, tm.cuvaldan + (k - 1) * 0.05, 0.3);
  }

  // ——— kup: Hikmet iki küpü kaldırır (10 gr · 9 gr), sonra küple teraziye vurur ———
  if (id === 'kup') {
    P.hikmet = kisiK('hikmet', { x: 1110, expr: t < tm.bu ? 'mutlu' : 'notr', head: { tilt: t < tm.sahtesi ? -4 : 4, look: t < tm.sahtesi ? [-0.7, 0.1] : t < tm.bu ? [0.7, 0.1] : [-0.6, 0.6] }, ...POZ.dur });
    P.defne = kisiK('defne', { x: 640, expr: 'saskin', head: { tilt: 4, look: [0.85, 0.1] }, ...POZ.dur });
    const A0 = H.elYeri('hikmet', P.hikmet, 'L', 'asagi'), B0 = H.elYeri('hikmet', P.hikmet, 'R', 'asagi');
    const uA = W(t, tm.kupA - 0.3, 0.35), uB = W(t, tm.sahtesi - 0.3, 0.35), inA = W(t, tm.bu, 0.35), inB = W(t, tm.bu + 0.05, 0.35);
    let eA = [lerp(A0[0], 930, uA), lerp(A0[1], 1080, uA)];
    const dok = [TER_X - 30, MASA_Y - 20];
    eA = yol(t, [[tm.bu, eA], [tm.pili - 0.08, [dok[0] + 8, dok[1] - 30]], [tm.pili, dok], [tm.pili + 0.16, [dok[0] + 6, dok[1] - 22]], [tm.tek, dok], [tm.tek + 0.25, [dok[0] + 10, dok[1] - 34]]]);
    if (t < tm.bu) eA = [lerp(A0[0], 930, uA), lerp(A0[1], 1080, uA)];
    const eB = [lerp(lerp(B0[0], 1290, uB), B0[0] + 6, inB), lerp(lerp(B0[1], 1080, uB), B0[1] - 4, inB)];
    void inA;
    O.hikmet.L = [eA, 1, 'A']; O.hikmet.R = [eB, 1, 'A'];
    sonra.push(() => { const h = kolCiz(K, 'hikmet', P.hikmet, 'L'); kup(K, h[0] - 2, h[1] - 8, 30); H.grip(K, 'hikmet', h, P.hikmet.s); });
    teraziNab = Math.max(H.nabiz(t, tm.pili, 0.3), H.nabiz(t, tm.tek, 0.3)) * 0.8;
    O.hikmet.kupR = true;
  }

  // ——— oda2 + sayaç: Defne her çuvaldan birer küp toplar, teraziye uzanır; Hikmet kefeyi kapatır, tabağı alır ———
  let tabakP = null, tabakN = 0, tabakJig = -1, defKup = [0, 0];
  if (id === 'oda2') {
    // Defne (önden): sol elinde tabak, sağ eli çuvala dalar (8, 9, 10)
    const xk = k => SX(k) - 34;
    let dx = yol(t, [[tm.oda2, [xk(7) + 18, 0]], [tm.dip[0] - 0.3, [xk(8), 0]], [tm.dip[1] - 0.28, [xk(9), 0]], [tm.dip[2] - 0.28, [xk(10), 0]], [tm.sahte2 + 0.1, [xk(10), 0]], [tm.sahte2 + 0.6, [862, 0]]])[0];
    const sayac = t >= tm.cd0;
    P.defne = kisiK('defne', { x: dx, expr: sayac ? (t < tm.silk ? IFADE.dusun : 'saskin') : t < tm.hd ? 'mutlu' : t < tm.biri ? 'saskin' : 'notr',
      head: { tilt: sayac ? 6 : -3, look: t < tm.sahte2 + 0.3 ? [0.3, 0.8] : t < tm.cd0 ? [0.85, 0.2] : t < tm.tart1 ? [0.05, 0.7] : t < tm.necGir + 0.5 ? [0.3, 0.3] : [-0.9, 0.1] }, ...POZ.dur });
    P.hikmet = kisiK('hikmet', { x: 1110, expr: t < tm.blok ? 'notr' : 'mutlu', head: { tilt: t < tm.blok ? 3 : -3, look: t < tm.hangisi - 0.2 ? [-0.8, 0.25] : t < tm.cd0 + 0.6 ? [-0.6, 0.6] : [-0.85, 0.15] }, ...POZ.dur, armR: { sh: 38, el: -118 } });
    const dp = P.defne, sh = H.shoulder('defne', dp, 'L');
    // tabak: önce sol el (göğüs önü), "Sahte"de sağ ele geçer; d2'de kalkar, "tartarım"da kefeye uzanır; Hikmet kapatır; Hikmet alır
    const tabL = [dp.x - 28, 1236], tabR = [dp.x + 58, 1228];
    const gec = W(t, tm.sahte2 - 0.2, 0.35);
    let tp = [lerp(tabL[0], tabR[0], gec), lerp(tabL[1], tabR[1], gec)];
    const kalk = W(t, tm.birer - 0.2, 0.3), uz = W(t, tm.tartarim, 0.5), geri = W(t, tm.cikar - 0.1, 0.4);
    tp = [tp[0] + 6 * kalk + (920 - 6 - tp[0]) * uz * (1 - 0.55 * geri), tp[1] - 26 * kalk + (MASA_Y - 120 - tp[1] + 26 * kalk) * uz * (1 - geri)];
    const v = H.elVer(t, tm.ver, tp, [1022, 1176], { uzat: 0.32, ortak: 0.17, cek: 0.4 });
    if (t >= tm.ver) tp = v.p;
    tabakP = tp; tabakN = t < tm.dip[0] + 0.32 ? 7 : t < tm.dip[1] + 0.32 ? 8 : t < tm.dip[2] + 0.32 ? 9 : 10;
    if (t >= tm.al2 + 0.3 && t < tm.geriKoy) tabakN = 8;
    tabakJig = tm.hangisi;
    // Defne'nin elleri
    const elTab = [tp[0] + (gec < 0.5 ? 0 : 0), tp[1] - 6];
    if (t < tm.ver + 0.3) {
      if (gec < 0.5) O.defne.L = [elTab, 1, 'A']; else O.defne.R = [[elTab[0] + 4, elTab[1]], v.verW ?? 1, 'A'];
    }
    // sağ el çuvala dalar (gec öncesi): ağız → tabak
    if (gec < 0.5) {
      const dur = [[tm.oda2, [dp.x + 40, 1260]]];
      tm.dip.forEach((d, i) => { const m = [SX(8 + i), AGIZ + 22]; dur.push([d - 0.18, [m[0], AGIZ - 30]], [d, m], [d + 0.3, [tabL[0] + 30, tabL[1] - 20]]); });
      const h = yol(t, dur.sort((a, b) => a[0] - b[0]));
      O.defne.R = [[h[0], h[1]], 1, 'A'];
      const i = tm.dip.findIndex(d => t >= d - 0.02 && t < d + 0.3);
      if (i >= 0) dalis.push({ key: 'defne', side: 'R', k: 8 + i, n: 1 });
    }
    // sayaç: tabaktan iki küp alır, ellerinde tartar, omuz silker
    if (t >= tm.al2) {
      const al = W(t, tm.al2, 0.3), don = W(t, tm.al2 + 0.35, 0.35);
      const gL = H.elYeri('defne', dp, 'L', 'gogus'), gR = H.elYeri('defne', dp, 'R', 'gogus');
      const sal = t > tm.tart0 && t < tm.tart1 ? Math.sin(TAU * (t - tm.tart0) / 0.62) * 24 * W(t, tm.tart0, 0.2) * (1 - W(t, tm.tart1 - 0.25, 0.25)) : 0;
      const hR = [lerp(lerp(gR[0], tp[0] - 8, al), dp.x + 44, don), lerp(lerp(gR[1], tp[1] - 8, al), gR[1] - 34 + sal, don)];
      const hL = [dp.x - 44, gL[1] - 34 - sal];
      // sonunda iki küpü Hikmet'in tabağına geri koyar
      const koy = pw(t, tm.geriKoy, tm.geriKoy + 0.25, 0.3, 0.35), kt = [tp[0] - 4, tp[1] - 12];
      O.defne.R = [[lerp(hR[0], kt[0] + 10, koy), lerp(hR[1], kt[1], koy)], 1, 'A']; O.defne.L = [[lerp(hL[0], kt[0] - 14, koy), lerp(hL[1], kt[1], koy)], W(t, tm.bol - 0.2, 0.3), 'A'];
      defKup = t >= tm.geriKoy ? [0, 0] : [t >= tm.bol ? 1 : 0, t >= tm.al2 + 0.3 ? (t >= tm.bol ? 1 : 2) : 0];
      if (t >= tm.silk) {   // omuz silkme: uzanışlar zarfla geri çekilir (yoksa reach pozu ezer)
        H.omuzSilk(dp, t, tm.silk, 0.45);
        const z = ease.enter(seg(t, tm.silk, 0.25)) * (1 - ease.state(seg(t, tm.silk + 0.7, 0.3)));
        O.defne.R[1] *= 1 - z; O.defne.L[1] *= 1 - z;
      }
    }
    // Hikmet: "Sahte"de sol eli çuvalları gösterir; hd'de kefeyi kapatır; tabağı alır
    const hp = P.hikmet;
    const gos = pw(t, tm.sahte2 - 0.05, tm.nasil + 0.5);
    const blok = pw(t, tm.blok, tm.ver - 0.05, 0.25, 0.3);
    const kef = [TER_X - 6, MASA_Y - 118];
    if (t < tm.ver) {
      if (blok > 0.01) O.hikmet.L = [kef, blok, 'A'];
      else if (gos > 0.01) O.hikmet.L = [[hp.x - 230, 1190], gos, 'B'];
    } else O.hikmet.L = [[tp[0] + 30, tp[1] - 6], v.alW, 'A'];
    if (blok > 0.5) sonra.push(() => kolCiz(K, 'hikmet', hp, 'L'));
    // Necmi sayaçta tepsiyle soldan girer (yandan yürür)
    if (t >= tm.necGir) {
      const np = H.yuru('necmi', t, { t0: tm.necGir, t1: tm.necVar, x0: 230, x1: 560, y: KY, s: sx('necmi'), poz: { expr: 'mutlu', head: { tilt: -3, look: [0.6, 0.1] } } });
      P.necmi = np;
      const g = H.eklem('necmi', np, 'shR');
      O.necmi.R = [[g[0] + 70, g[1] + 60], 1, 'A'];
      heads.necmi = H.eklem('necmi', np, 'head');
    }
  }

  // ——— ipucu: Necmi tepsideki bardaklara oda numarası kadar şeker atar ———
  let tepsiP = null, dusen = [], dalga = [0, 0, 0], necAvuc = 0;
  if (id === 'ipucu') {
    P.necmi = kisiK('necmi', { x: -250, expr: 'mutlu', head: { tilt: -3, look: t < tm.n1 ? [0.2, 0.5] : [0.15, 0.9] }, ...POZ.dur });
    P.defne = kisiK('defne', { x: 700, expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [-0.85, 0.3] } });
    P.hikmet = kisiK('hikmet', { x: 420, expr: 'mutlu', head: { tilt: 3, look: [0.8, 0.3] }, ...POZ.dur, armL: { sh: 38, el: -118 } });
    tepsiP = [-250, 1338];
    O.necmi.L = [[tepsiP[0] - TP.rx + 12, tepsiP[1] + 4], 1, 'A'];
    const bowl = [tepsiP[0] + TP.sek, tepsiP[1] - 40], gx = i => [tepsiP[0] + TP.g[i], tepsiP[1] - 104];
    // plan: [bırakma anı, bardak, küp sayısı]; el şekerlikten alır (tAl), bardağın üstüne gider, küpleri tek tek bırakır
    const plan = [[tm.bir, 0, 1], [tm.iki, 1, 2], [tm.uc, 2, 3]];
    const tAl = j => j === 0 ? plan[0][0] - 0.62 : plan[j - 1][0] + 0.11 * plan[j - 1][2] + 0.16;
    const dur = [[tm.cd, [bowl[0] + 10, bowl[1] - 10]]];
    plan.forEach(([a, gi, n], j) => { dur.push([tAl(j), [bowl[0], bowl[1] + 4]], [tAl(j) + 0.14, [bowl[0], bowl[1] - 10]], [a - 0.06, gx(gi)], [a + 0.11 * n + 0.04, gx(gi)]); });
    dur.push([tm.uc + 0.7, [bowl[0] + 30, bowl[1] - 30]]);
    O.necmi.R = [yol(t, dur), 1, 'A'];
    // avuçtaki küpler ve düşenler
    plan.forEach(([a, gi, n], j) => {
      for (let q = 0; q < n; q++) {
        const tq = a + q * 0.11, g = gx(gi);
        if (t >= tq && t < tq + 0.2) dusen.push([g[0] + 4, lerp(g[1] + 10, tepsiP[1] - 46, (seg(t, tq, 0.2)) ** 2)]);
        if (t >= tq + 0.18) dalga[gi] = Math.max(dalga[gi], 1 - seg(t, tq + 0.18, 0.5));
      }
      if (t >= tAl(j) && t < a) necAvuc = n; else if (t >= a && t < a + n * 0.11) necAvuc = n - Math.floor((t - a) / 0.11) - 1;
    });
  }

  // ——— buldum: Defne sıçrar, küpü havaya kaldırır ———
  if (id === 'buldum') {
    const dp = kisiK('defne', { x: 860, expr: 'mutlu', head: { tilt: -6, look: [0, -0.3] }, ...POZ.dur }); dp.y -= H.buldumHop(t, tm.buldum) * KS;
    P.defne = dp;
    const u = ease.enter(seg(t, tm.buldum - 0.05, 0.25)), y = H.elYeri('defne', dp, 'R', 'yukari'), g = H.elYeri('defne', dp, 'R', 'gogus');
    O.defne.R = [[lerp(g[0], y[0] - 10, u), lerp(g[1], y[1] + 30, u)], 1, 'A'];
    O.defne.L = [H.elYeri('defne', dp, 'L', 'gogus'), 1, 'A'];
    defKup = [1, 1];
    P.hikmet = kisiK('hikmet', { x: 1150, expr: 'saskin', head: { tilt: 4, look: [-0.9, 0.1] }, ...POZ.dur });
    sonra.push(() => H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 }));
  }

  // ——— cevap (kahraman an): Defne çuvalların arkasında soldan sağa yürür, numarası kadar küpü rafa yığar ———
  let defAvuc = 0, defAvucSide = 'R';
  if (id === 'cevap') {
    const p = kahramanP(tm, t);
    P.defne = p;
    // el yolu: her çuval için ağız (dk) → yığın (pk)
    const dur = [[tm.cevap, [p.x + 40, 1300]]];
    for (let k = 1; k <= 10; k++) {
      const a = tm.dk[k], b = tm.pk[k], hiz = k > 2 && k < 10;
      dur.push([a - (hiz ? 0.07 : 0.2), [SX(k) - 6, AGIZ - 24]], [a, [SX(k) - 4, AGIZ + 24]], [b, [SX(k) + 2, RAF_Y - 8 - 6 * Math.min(4, Math.ceil(k / 3))]]);
      if (!hiz) dur.push([b + 0.12, [SX(k) + 6, RAF_Y - 26]]);
    }
    dur.push([tm.pk[10] + 0.4, [p.x + 46, 1290]]);
    const el = yol(t, dur), w = W(t, tm.dk[1] - 0.5, 0.3);
    O.defne.R = [el, w, 'A'];
    for (let k = 1; k <= 10; k++) if (t >= tm.dk[k] - 0.02 && t < tm.pk[k]) { defAvuc = k; if (t < tm.dk[k] + 0.12) dalis.push({ key: 'defne', side: 'R', k, n: k }); }
    const dalma = Math.max(...Array.from({ length: 10 }, (_, i) => H.nabiz(t, tm.dk[i + 1], 0.3)));
    p.lean = (p.lean || 0) + 12 * dalma;
    heads.hikmet = ekrandan(1200, 800);
  }

  // ——— terazi: Defne tümseği rafta sağa iter, küpler kefeye dökülür ———
  let ucanlar = [];
  if (id === 'terazi') {
    const on = suOn(S, t), n0 = raf.tumsek ? raf.tumsek.n : 0;
    const bx = on - tumsekGen(Math.max(n0, 8)) - 14;
    const p = H.yuru('defne', t, { t0: tm.terazi - 0.4, t1: tm.sup1 + 0.05, x0: 340, x1: RAF_X1 - 120, y: KY, s: sx('defne'), poz: { expr: 'mutlu', head: { tilt: 4, look: [0.7, 0.35] } } });
    P.defne = p;
    const elS = [Math.min(bx, RAF_X1 - 30), RAF_Y - 22];
    const sonEl = W(t, tm.sup1 + 0.1, 0.35);
    O.defne.R = [[lerp(elS[0], p.x + 50, sonEl), lerp(elS[1], 1290, sonEl)], 1, 'A'];
    for (let i = 0; i < 55; i++) {
      const t0 = tm.dus0 + i * tm.dusAra, u = seg(t, t0, tm.ucus); if (u <= 0 || u >= 1) continue;
      const L = KASE_OFS[i], hedef = [TER_X - 50 + ((i * 37) % 100) + L[0], MASA_Y - 112 + 8];
      ucanlar.push(H.yay([RAF_X1 - 4, RAF_Y - 12], hedef, ease.state(u) * 0 + u, -26).map((v, j) => j ? lerp(RAF_Y - 12, hedef[1], u * u) : v));
    }
    heads.hikmet = ekrandan(1300, 800);
  }

  // ——— yedi: 7. çuval yeşil işaret alır, Necmi kaldırır · espri: Hikmet bir daha tartar, pil biter · çağrı ———
  if (id === 'yedi' || id === 'espri' || id === 'cta') {
    const nl = W(t, tm.verir - 0.08, 0.4);
    P.necmi = kisiK('necmi', { x: 555, expr: nl > 0.3 && nl < 1 ? IFADE.zorlanma : 'mutlu', head: { tilt: 4, look: [0.05, 0.85] }, ...POZ.dur });
    cuvalLift[SAHTE] = 64 * nl; cuvalYesil[SAHTE] = W(t, tm.numara - 0.04, 0.25); cuvalNab[SAHTE] = H.nabiz(t, tm.numara, 0.34);
    const lift = 64 * nl;
    const tut = W(t, tm.verir - 0.35, 0.28);
    O.necmi.L = [[SX(SAHTE) - 40, AGIZ - lift + 14], tut, 'B']; O.necmi.R = [[SX(SAHTE) + 40, AGIZ - lift + 14], tut, 'B'];
    if (tut > 0.5) sonra.push(() => { kolCiz(K, 'necmi', P.necmi, 'L'); kolCiz(K, 'necmi', P.necmi, 'R'); });
    const ctaU = id === 'cta' ? W(t, tm.cta + 0.05, 0.4) : 0;
    P.defne = kisiK('defne', { x: 850, expr: 'mutlu', head: { tilt: ctaU > 0.5 ? -6 : 4, look: ctaU > 0.5 ? [0.05, 0.05] : t < tm.espri + 0.3 ? [-0.7, 0.5] : [0.85, 0.15] }, ...POZ.dur });
    P.hikmet = kisiK('hikmet', { x: 1175, expr: t < tm.tartalim + 0.15 ? 'mutlu' : t < tm.tartalim + 0.6 ? 'saskin' : 'yorgun', head: { tilt: t < tm.tartalim + 0.6 ? -3 : 7, look: t < tm.tartalim - 0.5 ? [-0.8, 0.2] : [-0.5, 0.75] }, ...POZ.dur, armR: { sh: 38, el: -118 } });
    // Hikmet düğmeye basar
    const bas = pw(t, tm.tartalim - 0.3, tm.tartalim + 0.9, 0.3, 0.35);
    const dug = [TER_X + 82, MASA_Y - 72];
    if (bas > 0.01) { O.hikmet.L = [[dug[0], dug[1] - 6 + 6 * H.nabiz(t, tm.tartalim, 0.2)], bas, 'A']; if (bas > 0.5) sonra.push(() => kolCiz(K, 'hikmet', P.hikmet, 'L')); }
    // Defne çağrıda kefeden bir küp alıp yanağının yanına kaldırır
    if (id === 'cta') {
      const dp = P.defne, al = W(t, tm.cta + 0.05, 0.3), kalk = W(t, tm.cta + 0.45, 0.4);
      const kef = [TER_X - 40, MASA_Y - 118], hb = H.eklem('defne', dp, 'head');
      O.defne.R = [[lerp(lerp(H.elYeri('defne', dp, 'R', 'asagi')[0], kef[0], al), hb[0] + 118, kalk), lerp(lerp(H.elYeri('defne', dp, 'R', 'asagi')[1], kef[1], al), hb[1] + 60, kalk)], 1, 'A'];
      if (t > tm.cta + 0.35) defKup = [0, 1];
    }
  }

  // ——— karakterler ———
  const sira = ['hikmet', 'necmi', 'defne'].filter(k => P[k]);
  const C = {};
  for (const key of sira) {
    const o = { ...O[key] };
    C[key] = oyna(K, t, tl, key, P[key], o);
  }
  if (id === 'oda2' && P.necmi) { const h = C.necmi.handR; tepsiYan(K, [h[0] + 20, h[1] - 6], t); C.necmi.tut('R'); }
  // ——— masa, terazi ———
  masa(K);
  const tz = terazi(K, teraziYer[0], teraziYer[1], { deger: ter.deger, pil, sonuk: ter.sonuk, kupN: ter.kupN, nab: teraziNab });
  for (const u of ucanlar) kup(K, u[0], u[1], 16);
  // ——— eldeki nesneler (çuvallardan önce: ele dalışta çuval örter) ———
  if (tabakP) { tabak(K, tabakP, tabakN, t, tabakJig); if (t >= S.tm.ver + 0.3) C.hikmet.tut('L'); else C.defne.tut(id === 'oda2' && W(t, S.tm.sahte2 - 0.2, 0.35) >= 0.5 ? 'R' : 'L'); }
  if (C.defne && defKup[0]) { const h = C.defne.handL; kup(K, h[0] - 2, h[1] - 8, 24); C.defne.tut('L'); }
  if (C.defne && defKup[1]) { const h = C.defne.handR; if (defKup[1] === 2) { kup(K, h[0] - 9, h[1] - 8, 22); kup(K, h[0] + 9, h[1] - 8, 22); } else kup(K, h[0] + 2, h[1] - 8, 24); C.defne.tut('R'); }
  if (C.defne && defAvuc) { avuc(K, defAvuc, C.defne.handR, 15); C.defne.tut('R'); }
  if (tepsiP) {
    tepsi(K, tepsiP, t, { dalga });
    for (const d of dusen) kup(K, d[0], d[1], 16);
    if (necAvuc > 0) avuc(K, necAvuc, C.necmi.handR, 15);
    C.necmi.tut('L'); C.necmi.tut('R');
  }
  // ——— çuvallar (ön sıra) ———
  for (let k = 1; k <= 10; k++) cuval(K, SX(k), k, { lift: cuvalLift[k] || 0, nab: cuvalNab[k] || 0, yesil: cuvalYesil[k] || 0 });
  if (id === 'yedi' || id === 'espri' || id === 'cta') tik(K, [SX(SAHTE) + 34, ZEMIN - (cuvalLift[SAHTE] || 0) - 128], t, tm.numara - 0.04);
  // ——— çuvala dalan kol: ağzın arka yarısının üstünde yeniden çizilir (el çuvalın içinde görünür) ———
  for (const d of dalis) {
    const x = SX(d.k), clip = [x - 40, AGIZ - 80, x + 40, AGIZ + 4];
    kolCiz(K, d.key, P[d.key], d.side, { omuz: true, clip });
    if (d.n) { const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.rect(clip[0], clip[1], clip[2] - clip[0], clip[3] - clip[1]); ctx.clip(); avuc(K, d.n, C[d.key]['hand' + d.side], 15); H.grip(K, d.key, C[d.key]['hand' + d.side], P[d.key].s); ctx.restore(); }
  }
  for (const f of sonra) f();
  if (C.hikmet && O.hikmet.kupR) { const h = C.hikmet.handR; kup(K, h[0] + 2, h[1] - 8, 30); C.hikmet.tut('R'); }
  void tz; void ctx;
}
