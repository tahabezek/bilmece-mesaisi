// Bölüm 42 · HİLELİ PARA (v4 "hikâye" dili; storyboard: hikayeler/bolum_042_v5.md). Özgün kurgu (von Neumann yöntemi).
// Logline: Çayı kimin demleyeceği Hikmet Bey'in "uğurlu" parasıyla seçilecek. Para hilelidir ve hangi yüzünün çok geldiğini
// yalnızca Hikmet bilir. Defne başka para olmadan aynı hileli parayla tam adil bir kura çeker: para iki kez atılır,
// yazı→tura Defne'nin, tura→yazı Hikmet'in; ikisi aynı gelirse yeniden atılır.
// Akılda kalacak tek şey: önce yazı sonra tura ile önce tura sonra yazı, para ne kadar hileli olursa olsun aynı ihtimaldir.
// İki mekân, tek dünya: Hikmet'in odası (x −300…1500, önden) ve çay ocağı köşesi (x OX−500…OX+1300).
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur; atış sonuçları sabit listelerden gelir.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b042_oda', OCAK = 'b042_ocak', OX = 2600, ZEMIN = 1500;
// masa (önden): üst bant yb…y, ön panel y…zemin
const MASA = { x0: 380, x1: 1040, yb: 1240, y: 1262 };
const DEF_X = 290, HIK_X = 905, NEC_X = 716, NEC_ESP = 1175;
const C_MASA = [690, 1252];              // Hikmet'in parayı masaya koyduğu yer
const LS = [458, 1253], RP = [448, 1192]; // kahraman an: paranın düştüğü yer, Defne'nin elinin beklediği nokta
const TP = [772, 1150];                  // Hikmet'in atış eli
const KUTU = { D: { cx: 570, w: 170 }, H: { cx: 865, w: 170 }, yb: 1250, h: 96 };
const SLOT = [684, 750], TAS_Y = 1258, TEPSI = { cx: 716, y: 1238 };
const DEMLIK = [1000, 1244], LEVHA = [640, 1244];
const R_BUYUK = 56, R_KUCUK = 30;        // elde gösterilen uğurlu para · kahraman anda atılan para
const MERCAN = PAL.coral, YESIL = PAL.green;
const ALTIN = '#E2B544', ALTIN_K = '#B8892E', ALTIN_A = '#F3DC93', LALE = '#C0462F';
// ipucu: çay ocağı köşesi, tavla masası
const TAVLA_Y = 1270, TCX = OX + 540, TAV_K = 1.35, MASA_T = [OX + 400, OX + 680], NEC_T = OX + 315, KER_T = OX + 765;
// özel ifade: şüpheli bakış (kısık göz, tek kaş)
const SUPHE = { brow: 0.02, browTilt: 0.38, eye: 0.6, pupil: 0.95, curve: -0.1, open: 0.04, w: 0.75 };

// ═══════════════════════════ Sabit sonuçlar ═══════════════════════════
// Yanlış deneme: Hikmet'in 10 atışı (ilki gerçek hızda). 7 yazı, 3 tura olmak zorunda.
const SERI = ['Y', 'Y', 'T', 'Y', 'Y', 'Y', 'T', 'Y', 'Y', 'T'];
// Kahraman an: üç ikili. YY ve TT yeniden; ilk karışık ikili TY → Hikmet kazanır.
const CIFT = [['Y', 'Y'], ['T', 'T'], ['T', 'Y']];
{
  const y = SERI.filter(s => s === 'Y').length;
  if (y !== 7 || SERI.length !== 10) console.warn('b042: seri 7 yazı – 3 tura değil', y);
  const k = CIFT.findIndex(c => c[0] !== c[1]);
  if (k !== 2 || CIFT[k].join('') !== 'TY') console.warn('b042: ilk karışık ikili TY değil');
}
const sayac = n => { const s = SERI.slice(0, n), y = s.filter(c => c === 'Y').length; return `YAZI ${y} – TURA ${s.length - y}`; };

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
// Sıralı yol: duraklar [[t, [x, y]], …]; iki durak arasında ease.state
function yol(t, d) {
  if (t <= d[0][0]) return d[0][1];
  for (let i = 1; i < d.length; i++) if (t < d[i][0]) { const u = ease.state((t - d[i - 1][0]) / (d[i][0] - d[i - 1][0])); return [lerp(d[i - 1][1][0], d[i][1][0], u), lerp(d[i - 1][1][1], d[i][1][1], u)]; }
  return d[d.length - 1][1];
}
// Atış: a'dan kalkar, h kadar yükselir, b'ye düşer (u 0..1)
const ucus = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 4 * h * u * (1 - u)];

// ═══════════════════════════ Nesneler ═══════════════════════════
// Uğurlu para. phi: dikey eksende dönüş (parmakta çevirme), flip: yatay eksende dönüş (havada takla),
// yatik: masada yatıyor (0..1), parlak: parlaklık çokgeni (uğur), yuz: zorla gösterilecek yüz ('Y' | 'T').
// Yazı yüzünde büyük "1", tura yüzünde lale. İki yüzün göbek tonu da biraz farklı.
function para(K, x, y, r, { phi = 0, flip = 0, yatik = 0, parlak = 1, yuz = null, k = 1, sonuk = 0 } = {}) {
  const { ctx } = K, cx = Math.cos(phi), cf = Math.cos(flip);
  const sx = Math.max(0.08, Math.abs(cx)), sy = Math.max(0.08, Math.abs(cf)) * (1 - 0.62 * yatik);
  const face = yuz || (cx * cf >= 0 ? 'Y' : 'T'), R = r * k;
  const altin = H.mixHex(ALTIN, '#A99C7E', sonuk), altinK = H.mixHex(ALTIN_K, '#7E7560', sonuk), altinA = H.mixHex(ALTIN_A, '#C9C0A8', sonuk);
  // kenar kalınlığı: arkada koyu bir elips (dönüş yönünde kayık)
  const ex = (1 - sx) * R * 0.16 * Math.sign(Math.sin(phi) || 1), ey = (1 - sy) * R * 0.16 + yatik * R * 0.1;
  K.ell(x + ex, y + ey, R * sx, R * sy, altinK, LW * 0.9);
  ctx.save(); ctx.translate(x, y); ctx.scale(sx * R / 110, sy * R / 110);
  const lw = LW * 110 / R;
  K.circ(0, 0, 110, altin, lw);
  for (let i = 0; i < 30; i++) { const a = i / 30 * TAU; K.line(Math.cos(a) * 94, Math.sin(a) * 94, Math.cos(a) * 104, Math.sin(a) * 104, 5, altinK); }
  K.circ(0, 0, 80, face === 'Y' ? altinA : altin, lw * 0.8);
  if (face === 'Y') {
    K.text('1', -3, 44, 128, INK, 900);
    K.line(-32, 58, 32, 58, 12, INK);
  } else {
    // lale: sap, iki yaprak, üç taç yaprağı
    K.line(0, 62, 0, -6, 10, INK);
    K.poly([[0, 52], [-34, 18], [-40, 30], [-6, 60]], '#4C8240', lw * 0.5);
    K.poly([[0, 44], [32, 8], [38, 20], [6, 54]], '#4C8240', lw * 0.5);
    K.poly([[-30, -56], [-14, -34], [0, -62], [14, -34], [30, -56], [28, -18], [14, 0], [-14, 0], [-28, -18]], H.mixHex(LALE, '#8E7A6A', sonuk), lw * 0.7);
  }
  // parlaklık: düz renkli çokgen, paranın içine kırpılır
  if (parlak > 0.02) {
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 104, 0, TAU); ctx.clip();
    ctx.globalAlpha = 0.5 * parlak; ctx.fillStyle = '#FFF6D4';
    ctx.beginPath(); ctx.moveTo(-96, -40); ctx.lineTo(-40, -98); ctx.lineTo(-8, -88); ctx.lineTo(-88, -6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-70, 30); ctx.lineTo(30, -70); ctx.lineTo(42, -58); ctx.lineTo(-58, 42); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  K.circ(0, 0, 110, null, lw);
  ctx.restore();
}
// Sonuç taşı (ayakta duran pul): Y krem, T hardal
function tas(K, x, yb, harf, { k = 1.2 } = {}) {
  const w = 50 * k, h = 60 * k;
  K.rect(x - w / 2 + 5, yb - h + 5, w, h, INK, 0, 9 * k);
  K.rect(x - w / 2, yb - h, w, h, harf === 'Y' ? '#F7F1E3' : PAL.mustard, LW * 0.8, 9 * k);
  K.text(harf, x, yb - h / 2 + 15 * k, 42 * k, INK, 900);
}
// Kura kutusu: ön yüzünde "Y→T / DEFNE" (ok elle çizilir; yazı tipinde ok glifi yok). icindekiler önce çizilir.
function kutu(K, b, ust, alt, ad, { kab = 0, yesil = 0, ic = [] } = {}) {
  const { ctx } = K, w = b.w, h = KUTU.h, x0 = b.cx - w / 2, y0 = KUTU.yb - h, s = 1 + 0.08 * kab;
  ctx.save(); ctx.translate(b.cx, KUTU.yb); ctx.scale(s, s); ctx.translate(-b.cx, -KUTU.yb);
  K.rect(x0 + 10, y0 - 12, w - 20, 16, '#5E3A1E', LW * 0.6, 4);     // ağız (iç karanlık)
  for (const f of ic) f();
  K.rect(x0 + 7, y0 + 7, w, h, INK, 0, 10);
  K.rect(x0, y0, w, h, H.mixHex('#E9DCC2', '#BFE0B0', yesil), LW, 10);
  // üst satır: harf → harf
  const yy = y0 + 38;
  K.text(ust, b.cx - 44, yy + 14, 40, INK, 900);
  K.text(alt, b.cx + 44, yy + 14, 40, INK, 900);
  K.line(b.cx - 20, yy, b.cx + 16, yy, 7, INK);
  K.poly([[b.cx + 24, yy], [b.cx + 10, yy - 10], [b.cx + 10, yy + 10]], INK, 0);
  K.text(ad, b.cx, y0 + 84, 40, MERCAN, 900);
  ctx.restore();
}
// Çay ocağının çift demliği (masada, tepside): (x, y) tepsinin ortası; tutamak noktası döner
function demlik(K, x, y, t, { buhar = true } = {}) {
  const { ctx } = K;
  K.ell(x, y, 62, 11, '#B8C1B9', LW * 0.8);
  K.rect(x - 46, y - 74, 92, 70, '#C9CFC6', LW, 14);                                   // alt demlik
  K.poly([[x + 44, y - 50], [x + 82, y - 78], [x + 88, y - 68], [x + 48, y - 30]], '#C9CFC6', LW * 0.8);   // emzik
  K.rect(x - 30, y - 122, 60, 50, '#E9DCC2', LW, 12);                                  // üst demlik
  K.circ(x, y - 128, 8, '#3A3F3C', LW * 0.6);
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 66, 54, Math.PI * 1.15, Math.PI * 1.85);
  ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  if (buhar) H.buhar(K, x + 88, y - 86, t, { k: 0.55, n: 2, ara: 14, boy: 90 });
  return [x, y - 118];   // sapın tepesi
}
// Masa levhası (A çerçeve): "BUGÜN ÇAYI / KİM DEMLER?"
function levha(K, x, y) {
  const w = 300, h = 112, y0 = y - h;
  K.line(x - w / 2 + 24, y, x - w / 2 + 44, y0 + 6, 7, '#5E3A1E'); K.line(x + w / 2 - 24, y, x + w / 2 - 44, y0 + 6, 7, '#5E3A1E');
  K.rect(x - w / 2 + 6, y0 + 6, w, h - 8, INK, 0, 10);
  K.rect(x - w / 2, y0, w, h - 8, PAL.mustard, LW, 10);
  K.text(K.up('bugün çayı'), x, y0 + 46, 40, INK, 900);
  K.text(K.up('kim demler?'), x, y0 + 92, 40, INK, 900);
}
// Masa (önden): üst bant, ön panel, iki çekmece ayağı
function masa(K) {
  const { x0, x1, yb, y } = MASA;
  K.rect(x0 + 20, y + 20, 180, ZEMIN - y - 26, PAL.wood, LW, 4);
  K.rect(x1 - 200, y + 20, 180, ZEMIN - y - 26, PAL.wood, LW, 4);
  for (const xx of [x0 + 110, x1 - 110]) for (const yy of [y + 70, y + 150]) K.rect(xx - 40, yy - 8, 80, 14, PAL.woodDark, LW * 0.5, 6);
  K.rect(x0 + 200, y + 20, x1 - x0 - 400, 120, '#86592E', LW, 2);
  K.poly([[x0 + 16, yb], [x1 - 16, yb], [x1, y], [x0, y]], PAL.woodTop, LW);
  K.rect(x0, y, x1 - x0, 22, PAL.wood, LW, 4);
}
// Tavla (önden; b040'tan): açık kapak dik durur, taban eğik; zarlar tabanda
function tavla(K, cx, zarlar, k) {
  const { ctx } = K;
  ctx.save(); ctx.translate(cx, TAVLA_Y); ctx.scale(k, k); ctx.translate(-cx, -TAVLA_Y);
  const yb = TAVLA_Y - 30, yf = TAVLA_Y - 3, hw = 116, hb = hw - 12, ly0 = yb - 122, lx0 = cx - hb, lx1 = cx + hb;
  K.rect(lx0 - 6, ly0 - 6, lx1 - lx0 + 12, yb - ly0 + 8, '#7A4A26', LW / k, 6);
  K.rect(lx0 + 8, ly0 + 8, lx1 - lx0 - 16, yb - ly0 - 16, '#EBDDBE', LW * 0.5 / k, 2);
  const hx = (lx1 - lx0 - 16 - 14) / 2, tw = hx / 6;
  for (const side of [0, 1]) {
    const x0 = lx0 + 8 + side * (hx + 14);
    for (let i = 0; i < 6; i++) {
      const a = x0 + i * tw, top = ly0 + 8, bot = yb - 8, mid = (top + bot) / 2;
      K.poly([[a + 1, top], [a + tw - 1, top], [a + tw / 2, mid - 6]], (i + side) % 2 ? '#2E3B38' : '#B5532A', 2);
      K.poly([[a + 1, bot], [a + tw - 1, bot], [a + tw / 2, mid + 6]], (i + side + 1) % 2 ? '#2E3B38' : '#B5532A', 2);
    }
  }
  K.rect(cx - 7, ly0 + 2, 14, yb - ly0 - 4, '#7A4A26', LW * 0.5 / k, 3);
  K.poly([[cx - hb - 6, yb], [cx + hb + 6, yb], [cx + hw + 4, yf], [cx - hw - 4, yf]], '#7A4A26', LW / k);
  K.poly([[cx - hb + 6, yb + 4], [cx + hb - 6, yb + 4], [cx + hw - 8, yf - 4], [cx - hw + 8, yf - 4]], '#D9C9A4', LW * 0.4 / k);
  K.line(cx, yb + 3, cx, yf - 3, 9, '#7A4A26');
  K.rect(cx - hw - 4, yf - 2, 240, 9, '#5E3A1E', LW * 0.6 / k, 3);
  for (const [dx, r] of [[-92, 1], [-64, 0], [-40, 1], [44, 0], [70, 1], [92, 0]]) for (let j = 0; j < 2; j++) K.ell(cx + dx, yb + 9 - j * 4.5, 11, 4.8, r ? '#3A2A20' : PAL.paper, 2.5);
  ctx.restore();
  for (const z of zarlar) zar(K, z.p[0], z.p[1], z.n, z.a || 0, z.k || 1);
}
function zar(K, x, y, n, a = 0, k = 1) {
  const { ctx } = K, s = 19 * k;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-s / 2, -s / 2, s, s, PAL.paper, 2.5 * k, 4 * k);
  const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[n];
  for (const [px, py] of P) K.circ(px * s * 0.26, py * s * 0.26, 2.3 * k, INK, 0);
  ctx.restore();
}
function tavlaMasasi(K) {
  const [x0, x1] = MASA_T;
  K.rect(x0 + 18, TAVLA_Y + 18, 20, ZEMIN - TAVLA_Y - 18, PAL.woodDark, LW, 4);
  K.rect(x1 - 38, TAVLA_Y + 18, 20, ZEMIN - TAVLA_Y - 18, PAL.woodDark, LW, 4);
  K.rect(x0, TAVLA_Y, x1 - x0, 26, PAL.woodTop, LW, 6);
}
// Çay bardağı (raf için)
function bardak(K, x, yb, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  const yol2 = [[-12, -40], [12, -40], [7, -22], [12, -8], [9, -2], [-9, -2], [-12, -8], [-7, -22]];
  K.poly(yol2, '#F3EEE4', 2.5); K.poly([[-10.5, -34], [10.5, -34], [6.4, -22], [10.6, -8], [8, -3.5], [-8, -3.5], [-10.6, -8], [-6.4, -22]], '#A8401F', 0); K.poly(yol2, null, 2.5);
  ctx.restore();
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-300, 1500], dongu: ['pencerede martı', 'duvar saati', 'demlik buharı'],
  capa: { para: C_MASA, demlik: DEMLIK, atis: LS },
  kadraj: { kanca: [1.12, 625, 1110], yakin: [1.42, 800, 992], masa: [1.12, 640, 1090], genis: [0.98, 640, 1080], defne: [1.35, DEF_X + 10, 1008], cevap: [1.18, 645, 1122] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 1600, isik, duvar: 'cizgili' });
    M.pencere(K, 70, 560, 300, 360, { isik, t });
    M.duvarSaati(K, 640, 720, 52, 13.5 + t / 60, t);
    // kitaplık (sağda): raflar ve klasörler
    K.rect(1080, 640, 300, 860, '#7A4A26', LW, 6);
    for (let i = 0; i < 4; i++) {
      const y = 700 + i * 190;
      K.rect(1094, y + 150, 272, 16, '#5E3A1E', LW * 0.6, 3);
      for (let j = 0; j < 7; j++) { const h = 120 + ((i * 7 + j) * 37 % 30); K.rect(1104 + j * 36, y + 150 - h, 30, h, ['#2F7F7A', '#C9A24A', '#8E3B46', '#5D6A61', '#E9DCC2'][(i + j) % 5], LW * 0.5, 3); }
    }
    // saksı (pencerenin altında)
    for (let i = 0; i < 5; i++) H.yaprak(K, 120, 1350, 170 + (i % 2) * 50, -0.85 + i * 0.42 + 0.04 * Math.sin(t * 1.1 + i), i % 2 ? PAL.green : '#4C8240', 1);
    K.poly([[72, 1350], [168, 1350], [156, 1460], [84, 1460]], PAL.mustard, LW);
  },
});
M.mekanEkle(OCAK, {
  gen: [OX - 500, OX + 1300], dongu: ['ocakta alev', 'çaydanlık buharı'],
  capa: { tavla: [TCX, TAVLA_Y] },
  kadraj: { ipucu: [1.45, TCX, 1140] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: OX - 600, x1: OX + 1400, isik, duvar: 'fayans', zemin: 'karo' });
    // raf ve bardaklar
    K.rect(OX + 260, 860, 560, 20, PAL.woodTop, LW, 6);
    for (let i = 0; i < 8; i++) bardak(K, OX + 300 + i * 66, 860, 1.2);
    M.duvarSaati(K, OX + 980, 800, 54, 13.9 + t / 60, t);
    // ocak dolabı (solda): tezgâh, ocak alevi, çaydanlık
    K.rect(OX - 120, 1190, 330, ZEMIN - 1190, PAL.wood, LW, 4);
    K.rect(OX - 100, 1230, 140, 230, PAL.woodTop, LW, 6); K.rect(OX + 50, 1230, 140, 230, PAL.woodTop, LW, 6);
    K.rect(OX - 130, 1176, 350, 24, PAL.woodTop, LW, 6);
    K.rect(OX - 10, 1154, 150, 24, '#5D6A61', LW * 0.8, 6);
    H.alev(K, OX + 65, 1154, 0.9, t, { i: 1 });
    demlik(K, OX + 65, 1150, t + 0.7);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    cevir0: 0.3, ugurlu: T('h1:3'),
    yakin: T('h2a') - 0.2, bu: T('h2a'), yuzu: T('h2a:3'), sik: T('h2a:6'), hangisi: T('h2a:8'), ben: T('h2a:10'),
    masa: T('h2b') - 0.25, yok: T('h2b:2'), koy: T('h2b:3'), adil: T('h2b:5'),
    d2: T('d2'), tura: T('d2:1'), bir: T('d2:3'),
    olur: T('hd'), iste: T('hd:1'), yazi: T('hd:2'), sever: T('hd:4'),
    ipucu: cd - 0.05, n1: T('n1'), dort: T('n1:0'), iki: T('n1:1'), iki2: T('n1:3'), dort2: T('n1:4'), ayni: T('n1:7'),
    cevap: T('d3:3') - 0.1, benC: T('d4:5'), sizC: T('d4:11'), d5: T('d5'), yeniden: T('d5:3'), hile: T('d5:5'), etkiler: T('d5:9'),
    espri: T('h4') - 0.16, ugur: T('h4:3'), kacti: T('h4:4'),
    cta: T('d6') - 0.14,
  };
  // ——— yanlış deneme: Hikmet parayı alır, atar, yakalar, gösterir; ardından 9 hızlı atış ———
  tm.al = tm.olur - 0.28; tm.at1 = tm.olur + 0.22; tm.tut1 = tm.at1 + 0.48; tm.goster = tm.yazi - 0.06;
  tm.seri0 = tm.sever + 0.12;
  tm.atis = [];   // [kalkış, yakalama] — ilki gerçek hızda
  tm.atis.push([tm.at1, tm.tut1]);
  for (let k = 0; k < 9; k++) { const a = tm.seri0 + 0.24 + k * 0.245; tm.atis.push([a, a + 0.22]); }
  tm.sayStep = [tm.goster + 0.04, ...tm.atis.slice(1).map(a => a[1])];   // sayaç adımları (yakalama anları)
  tm.seriBit = tm.atis[9][1];
  // ——— sayaç: Hikmet parayı parmaklarında çevirir; Defne düşünür, en sonda kapıya (sağa) bakar ———
  tm.kaldir = tm.seriBit + 0.08; tm.bak = cd - 0.75;
  // ——— ipucu: Necmi iki zarı atar (4 sonra 2), Kerem iki zarı atar (2 sonra 4) ———
  tm.zN = [tm.dort - 0.03, tm.iki - 0.02]; tm.zK = [tm.iki2 - 0.03, tm.dort2 - 0.02];
  tm.nAt = Math.max(tm.ipucu + 0.04, tm.zN[0] - 0.34); tm.kAt = tm.zK[0] - 0.34;
  // ——— cevap: altı atış, üç ikili ———
  // Necmi'nin eli aynı anda tek iş yapar: taş koyma (P = L + 0,3; alma 0,32 sn önce) ile ikiliyi kaydırma (0,3 / 0,48 sn) çakışmaz
  const L = [T('d4>') - 0.05, T('d5:1')], kay = [];
  kay[0] = Math.max(L[1] + 0.6, tm.yeniden); L[2] = kay[0] + 0.43; L[3] = Math.max(tm.hile + 0.15, L[2] + 0.7);
  kay[1] = L[3] + 0.48; L[4] = kay[1] + 0.42; L[5] = L[4] + 0.7; kay[2] = L[5] + 0.46;
  tm.L = L; tm.P = L.map(l => l + 0.3); tm.kay = kay;
  tm.kazandi = kay[2] + 0.53;
  tm.yenTag = [tm.yeniden - 0.04, tm.etkiler - 0.3];
  tm.pq = tm.etkiler - 0.04;

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...M.kadraj(ODA, 'kanca')], [tm.yakin - 0.3, 1.15, 632, 1104]] },
    { id: 'yakin', t0: tm.yakin, cam: [[0, ...M.kadraj(ODA, 'yakin')], [tm.hangisi, 1.45, 806, 990]] },
    { id: 'masa', t0: tm.masa, cam: [[0, ...M.kadraj(ODA, 'masa')], [tm.d2 - 0.1, 1.14, 640, 1088], [tm.olur, 1.22, 650, 1080], [T('hd>') - 0.1, 1.24, 652, 1076],
      [T('hd>') + 0.5, ...M.kadraj(ODA, 'genis')], [cd - 0.8, 1.0, 650, 1078]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, ...M.kadraj(OCAK, 'ipucu')], [tm.ayni, 1.46, TCX + 6, 1136]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...M.kadraj(ODA, 'cevap')], [tm.d5 - 0.2, 1.3, 692, 1140], [tm.kazandi, 1.32, 696, 1138]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.3, 975, 1050], [tm.kacti, 1.33, 985, 1048]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.38, DEF_X + 30, 1010], [tm.cta + 1.4, 1.42, DEF_X + 30, 1006]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.75, 0.2] }, ...POZ.dur });
  const hik = [
    [tm.ugurlu - 0.2, { head: { tilt: 5, look: [-0.2, 0.05] } }, 0.3],
    [tm.bu - 0.1, { expr: 'mutlu', head: { tilt: -6, look: [-0.7, -0.2] } }, 0.3],
    [tm.hangisi, { expr: 'mutlu', head: { tilt: 8, look: [-0.05, 0.1] } }, 0.3],
    [tm.masa, { head: { tilt: -3, look: [-0.8, 0.25] } }, 0.01],
    [tm.koy, { head: { tilt: 4, look: [-0.6, 0.65] } }, 0.3],
    [tm.adil + 0.2, { head: { tilt: -5, look: [-0.8, 0.2] } }, 0.3],
    [tm.al - 0.1, { head: { tilt: 3, look: [-0.5, 0.6] } }, 0.25],
    [tm.at1 + 0.05, { head: { tilt: -4, look: [-0.3, -0.6] } }, 0.2],
    [tm.goster - 0.1, { expr: 'mutlu', head: { tilt: 7, look: [-0.8, 0.1] } }, 0.25],
    [tm.seri0, { head: { tilt: -2, look: [-0.35, -0.3] } }, 0.25],
    [tm.kaldir + 0.3, { expr: 'mutlu', head: { tilt: -6, look: [-0.8, 0.15] } }, 0.35],
    [cd0 + 2.2, { head: { tilt: 5, look: [-0.5, -0.35] } }, 0.35],
    [cd0 + 3.6, { head: { tilt: -4, look: [-0.85, 0.2] } }, 0.35],
    [tm.cevap, { expr: 'notr', head: { tilt: 0, look: [-0.7, 0.45] } }, 0.01],
    [tm.sizC - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [-0.4, 0.75] } }, 0.25],
    [tm.L[0] - 0.4, { expr: 'notr', head: { tilt: -2, look: [-0.75, 0.45] } }, 0.3],
    [tm.kay[0], { expr: 'saskin', head: { tilt: 3, look: [-0.5, 0.6] } }, 0.25],
    [tm.L[2] - 0.2, { expr: 'notr', head: { tilt: -3, look: [-0.75, 0.45] } }, 0.25],
    [tm.kay[2] + 0.25, { expr: 'mutlu', head: { tilt: 6, look: [-0.3, 0.65] } }, 0.25],
    [tm.espri, { expr: 'mutlu', head: { tilt: 6, look: [-0.75, -0.55] } }, 0.01],
    [tm.ugur - 0.1, { expr: 'yorgun', head: { tilt: -7, look: [-0.75, -0.6] } }, 0.35],
    [tm.kacti + 0.3, { expr: 'saskin', head: { tilt: 4, look: [0.85, 0.15] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: SUPHE, head: { tilt: 5, look: [0.85, 0.05] }, ...POZ.dur, ...POZ.belde });
  const def = [
    [0.55, { head: { tilt: 3, look: [0.85, -0.25] } }, 0.35],
    [tm.ugurlu + 0.3, { expr: SUPHE, head: { tilt: 7, look: [0.9, -0.2] } }, 0.3],
    [tm.masa, { expr: SUPHE, head: { tilt: 4, look: [0.85, 0.05] } }, 0.01],
    [tm.koy + 0.2, { head: { tilt: 6, look: [0.75, 0.55] } }, 0.3],
    [tm.d2 - 0.15, { expr: 'mutlu', head: { tilt: -4, look: [0.85, 0.2] }, armL: POZ.dur.armL }, 0.3],
    [tm.olur + 0.3, { expr: 'notr', head: { tilt: 2, look: [0.6, -0.55] } }, 0.25],
    [tm.goster, { expr: 'saskin', head: { tilt: -4, look: [0.85, -0.05] } }, 0.2],
    [tm.seri0 + 0.4, { expr: 'yorgun', head: { tilt: 6, look: [0.7, -0.3] } }, 0.3],
    [tm.seriBit + 0.1, { expr: IFADE.dusun, ...POZ.dusun, armL: POZ.dur.armL, head: { tilt: 6, look: [0.6, 0.2] } }, 0.4],
    [tm.bak, { expr: 'notr', head: { tilt: -3, look: [0.95, 0.0] } }, 0.25],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', ...POZ.dur, head: { tilt: 3, look: [0.5, 0.55] } }, 0.01],
    [tm.benC - 0.1, { head: { tilt: -4, look: [0.75, 0.5] } }, 0.25],
    [tm.sizC - 0.1, { head: { tilt: 4, look: [0.9, 0.2] } }, 0.25],
    [tm.L[0] - 0.5, { head: { tilt: 2, look: [0.55, 0.6] } }, 0.25],
    [tm.kay[2] + 0.3, { expr: 'notr', head: { tilt: 6, look: [0.9, 0.3] } }, 0.25],
    [tm.cta, { expr: 'mutlu', ...POZ.dur, head: { tilt: 4, look: [0.15, 0.05] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.4],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'mutlu', head: { tilt: -3, look: [-0.5, 0.55] }, ...POZ.dur });
  const nec = [
    [tm.benC, { head: { tilt: 3, look: [-0.7, 0.5] } }, 0.3],
    [tm.sizC, { head: { tilt: -3, look: [0.65, 0.5] } }, 0.3],
    [tm.L[0], { head: { tilt: -2, look: [-0.3, 0.75] } }, 0.3],
    [tm.kazandi, { head: { tilt: 5, look: [0.6, 0.3] } }, 0.3],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Durum fonksiyonları ═══════════════════════════
// Hikmet'in sol eli (parayı tutan) ve para: kanca → sayaç. Dönen: { el (hedef), para: { p, r, phi, flip, yatik, yuz, gizli } }
function hikmetPara(t, tm, hp) {
  const ust = H.elYeri('hikmet', hp, 'L', 'yukari'), gogus = H.elYeri('hikmet', hp, 'L', 'gogus');
  const yukari = [ust[0] - 38, ust[1] + 54], fist = [gogus[0] - 14, gogus[1] - 22];
  const C = [C_MASA[0] + 8, C_MASA[1] - 26];
  let el, p = null, phi = 0, flip = 0, yatik = 0, yuz = null, r = R_BUYUK, gizli = 0, elde1 = true;
  const elde = q => [q[0], q[1] - r * 0.78];
  if (t < tm.koy) {
    // parmakların arasında: 0,3'te bir tur çevirir; h2a'da yüzleri gösterir; "Hangisini"de avuçta saklar
    const kapa = W(t, tm.hangisi + 0.05, 0.3);
    el = yol(t, [[0, yukari], [tm.hangisi + 0.05, yukari], [tm.hangisi + 0.55, fist]]);
    phi = TAU * ease.state(seg(t, tm.cevir0, 0.6));
    phi += Math.PI * ease.state(seg(t, tm.yuzu - 0.12, 0.32));                           // "bir yüzü": lale
    phi += Math.PI * ease.state(seg(t, tm.sik - 0.05, 0.22)) + Math.PI * ease.state(seg(t, tm.sik + 0.25, 0.22));   // "daha sık": iki çabuk dönüş
    gizli = kapa;
    if (t >= tm.masa) { el = fist; gizli = 1; }
    p = elde(el);
  } else if (t < tm.al) {
    // "Bu parayla": masaya koyar (taşıma), eli çekilir
    const u = seg(t, tm.koy, 0.6);
    el = u < 1 ? H.tasi(t, tm.koy, 0.6, fist, C, 50) : yol(t, [[tm.koy + 0.75, C], [tm.koy + 1.2, fist]]);
    if (u < 1) { p = elde(el); gizli = 1 - W(t, tm.koy, 0.2); yatik = ease.state(clamp01((u - 0.6) / 0.4)); p = [lerp(p[0], C_MASA[0], yatik), lerp(p[1], C_MASA[1], yatik)]; }
    else { p = C_MASA; yatik = 1; }
  } else if (t < tm.seriBit + 0.02) {
    // yanlış deneme: alır, kaldırır, atar, yakalar, gösterir; sonra seri
    if (t < tm.at1) {
      el = yol(t, [[tm.al, fist], [tm.olur - 0.02, C], [tm.olur + 0.06, C], [tm.at1, TP]]);
      p = t < tm.olur ? C_MASA : elde(el); yatik = t < tm.olur ? 1 : 0;
      if (t >= tm.olur) { r = R_BUYUK; flip = 0; }
    } else if (t < tm.tut1) {
      el = TP; const u = seg(t, tm.at1, tm.tut1 - tm.at1);
      p = ucus(elde(TP), elde(TP), u, 290); flip = u * TAU * 4; elde1 = false;
    } else if (t < tm.seri0) {
      el = yol(t, [[tm.tut1, TP], [tm.goster, yukari], [tm.seri0 - 0.1, yukari], [tm.seri0 + 0.2, TP]]);
      p = elde(el); yuz = 'Y';
    } else {
      // seri: her atış kendi [kalkış, yakalama] aralığında; aralarda elde (yakalanan yüz)
      el = TP; p = elde(TP);
      let k = 0; for (let i = 1; i < 10; i++) if (t >= tm.atis[i][0]) k = i;
      const [a, b] = tm.atis[k] || [0, 0];
      if (k >= 1 && t < b) { const u = seg(t, a, b - a); p = ucus(elde(TP), elde(TP), u, 150); flip = u * TAU * 2.5; el = [TP[0], TP[1] - 10 * Math.sin(Math.PI * u)]; elde1 = u < 0.08 || u > 0.92; }
      else yuz = SERI[Math.max(0, k)];
      if (t < tm.atis[1][0]) yuz = 'Y';
    }
  } else {
    // sayaç: başının yanına kaldırır, parmaklarında yavaşça çevirir
    el = yol(t, [[tm.seriBit, TP], [tm.kaldir + 0.4, yukari]]);
    p = elde(el); yuz = null; phi = (t - tm.kaldir) * 2.8 * ease.state(seg(t, tm.kaldir, 0.5));
  }
  if (yatik > 0.01) elde1 = false;
  return { el, para: p && { p, r, phi, flip, yatik, yuz, gizli, elde: elde1 } };
}
// Kahraman an: paranın yeri (Defne atar). Dönen: { el (Defne'nin sağ el hedefi), p, flip, yatik, yuz }
function defnePara(t, tm) {
  const L = tm.L, elde = q => [q[0] + 6, q[1] - R_KUCUK * 0.7], yerde = [LS[0], LS[1]];
  const sonuc = k => CIFT[Math.floor(k / 2)][k % 2];
  // hangi atıştayız: k = son kalkışı geçilmiş atış
  let k = -1; for (let i = 0; i < 6; i++) if (t >= L[i] - 0.45) k = i;
  if (k < 0) return { el: RP, p: elde(RP), flip: 0, yatik: 0, yuz: 'Y' };
  const kalk = L[k] - 0.45;
  if (t < L[k]) { const u = seg(t, kalk, 0.45); return { el: yol(t, [[kalk - 0.12, RP], [kalk + 0.04, [RP[0] + 8, RP[1] - 16]], [kalk + 0.25, RP]]), p: ucus(elde(RP), yerde, u, 300), flip: u * TAU * 3 + (sonuc(k) === 'T' ? Math.PI : 0), yatik: ease.state(clamp01((u - 0.8) / 0.2)) * 0.9, yuz: null }; }
  // yerde; sonraki atıştan 0,62 sn önce Defne alır
  const sonraki = k < 5 ? L[k + 1] - 0.45 : 1e9, al = sonraki - 0.17;
  if (t < al - 0.25) return { el: RP, p: yerde, flip: 0, yatik: 1, yuz: sonuc(k) };
  if (t < al) return { el: yol(t, [[al - 0.25, RP], [al, [LS[0] + 4, LS[1] - 30]]]), p: yerde, flip: 0, yatik: 1, yuz: sonuc(k) };
  const el = yol(t, [[al, [LS[0] + 4, LS[1] - 30]], [sonraki, RP]]);
  return { el, p: elde(el), flip: 0, yatik: 0, yuz: sonuc(k) };
}
// Kahraman an: taşların durumu ve Necmi'nin sağ eli
function taslar(t, tm) {
  const out = [];   // { x, yb, harf, yer: 'masa' | 'tepsi' | 'kutu' }
  const S = [NEC_X - 44, 1176];   // elindeki taş destesi (sol el, göğüs önünde)
  let el = [S[0] + 44, S[1] + 6], tutulan = null;
  for (let k = 0; k < 6; k++) {
    const P = tm.P[k], c = Math.floor(k / 2), harf = CIFT[c][k % 2], slot = [SLOT[k % 2], TAS_Y];
    const kay = tm.kay[c];
    if (t < P - 0.32) continue;
    if (t < P) {   // desteden alır, yuvaya taşır
      const u = seg(t, P - 0.32, 0.32), q = H.yay([S[0] + 16, S[1] + 30], slot, ease.state(u), 46);
      out.push({ x: q[0], yb: q[1], harf, yer: 'el' }); tutulan = [q[0], q[1] - 58]; continue;
    }
    if (t < kay) { out.push({ x: slot[0], yb: slot[1], harf, yer: 'masa' }); continue; }
    // ikili kayar: c < 2 → arkadaki tepsiye (yeniden), c = 2 → Hikmet'in kutusuna
    const d = c < 2 ? 0.3 : 0.48, u = ease.state(seg(t, kay, d));
    const hedef = c < 2 ? [TEPSI.cx - 31 + (k % 2) * 62 + c * 10, TEPSI.y - c * 4] : [KUTU.H.cx - 31 + (k % 2) * 62, KUTU.yb - KUTU.h + 30];
    const q = H.yay(slot, hedef, u, c < 2 ? 30 : 90);
    out.push({ x: q[0], yb: q[1], harf, yer: u < 1 ? 'kayan' : c < 2 ? 'tepsi' : 'kutu', c });
  }
  // el: son eylemin yolu (alma → koyma → kaydırma) üstünden
  const olay = [];
  for (let k = 0; k < 6; k++) olay.push([tm.P[k] - 0.32, 'al', k], [tm.P[k], 'koy', k]);
  for (let c = 0; c < 3; c++) olay.push([tm.kay[c], 'kay', c]);
  olay.sort((a, b) => a[0] - b[0]);
  const ilk = olay[0][0];
  if (t < ilk - 0.3) return { out, el: null, S };
  const ikiliOrta = c => { const items = out.filter(o => o.c === c); if (!items.length) return null; return [(items[0].x + (items[1] || items[0]).x) / 2, items[0].yb - 60]; };
  if (tutulan) el = tutulan;
  else {
    // kayan ikilinin üstünde mi?
    const kayan = out.find(o => o.yer === 'kayan');
    if (kayan) el = ikiliOrta(kayan.c);
    else {
      // son olaydan sonra desteye geri dön (0,25 sn), bekle
      let son = null; for (const o of olay) if (t >= o[0]) son = o;
      if (son && son[1] === 'koy') { const s = [SLOT[son[2] % 2], TAS_Y - 58]; el = yol(t, [[son[0], s], [son[0] + 0.26, [S[0] + 30, S[1] + 18]]]); }
      else if (son && son[1] === 'kay') { const c = son[2], d = c < 2 ? 0.3 : 0.48, h = c < 2 ? [TEPSI.cx + c * 10, TEPSI.y - 50] : [KUTU.H.cx, KUTU.yb - KUTU.h - 18]; el = yol(t, [[son[0] + d, h], [son[0] + d + 0.3, [S[0] + 30, S[1] + 18]]]); }
      else el = [S[0] + 30, S[1] + 18];
      // bir sonraki kaydırmadan önce ikilinin üstüne gider
      for (let c = 0; c < 3; c++) { const a = tm.kay[c]; if (t >= a - 0.25 && t < a) { const o = ikiliOrta(c); if (o) el = yol(t, [[a - 0.25, el], [a, o]]); } }
    }
  }
  return { out, el, S, w: W(t, ilk - 0.3, 0.3) };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => {
  H.cerceve(K, t, ep, tl, S, {
    split: { h2a: 8, d4: 6, d5: 5 },
    dunya(K, t, B) { if (B.sc.id === 'ipucu') ocakSahne(K, t, tl, S, B); else odaSahne(K, t, tl, S, B); },
    ekran(K, t, B) { etiketler(K, t, S, B); },
  });
  // yanlış denemenin sayacı: sayaç perdesinin de üstünde kalır (izleyici düşünürken "7 – 3" okunur)
  const { tm } = S;
  if (t >= tm.sayStep[0] - 0.05 && t < tm.ipucu) {
    H.adimEtiket(K, t, tm.sayStep.map((s, i) => [s, sayac(i + 1), i === 9 ? MERCAN : INK, PAL.paper]), tm.ipucu - 0.25, [540, 590], 50);
  }
};

function etiketler(K, t, S, B) {
  const { tm } = S, id = B.sc.id, sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
  if (id === 'yakin') {
    // yüzleri tanıt: önce YAZI ("1"), "bir yüzü"nde TURA (lale)
    const pt = sabit(tm.bu + 0.1)([700, 900]);
    H.adimEtiket(K, t, [[tm.bu + 0.04, K.up('yazı'), PAL.mustard, INK], [tm.yuzu + 0.15, K.up('tura'), PAL.mustard, INK]], tm.hangisi - 0.1, pt, 50);
  }
  if (id === 'cevap') {
    const s = sabit(tm.yeniden);
    H.tag(K, t, tm.yenTag[0], tm.yenTag[1], s([TEPSI.cx, 1140]), K.up('yeniden'), MERCAN, PAL.paper, 44);
    const s2 = sabit(tm.pq);
    H.tag(K, t, tm.pq, tm.espri - 0.25, s2([KUTU.D.cx, 1100]), 'p × q', PAL.mustard, INK, 48, [tm.pq + 0.4]);
    H.tag(K, t, tm.pq + 0.07, tm.espri - 0.25, s2([KUTU.H.cx, 1100]), 'p × q', PAL.mustard, INK, 48, [tm.pq + 0.47]);
  }
}

// ——— Hikmet'in odası ———
function odaSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz });
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  if (id === 'masa' || id === 'kanca') H.glance(dp, t, tm.cd);
  const cevap = id === 'cevap', espri = id === 'espri';
  const sonra = [];   // masadan sonra çizilecekler (tutan el, eldeki nesne)

  // ═══ Hikmet (masanın arkasında) ═══
  {
    const o = { heads };
    let hk = null;
    if (id === 'kanca' || id === 'yakin' || id === 'masa') {
      hk = hikmetPara(t, tm, hp);
      o.L = [hk.el, 1, 'A'];
      // "Başka para yok": boş sağ elini açar
      const bos = pIn(t, tm.yok - 0.35, tm.koy + 0.1, 0.25);
      if (bos > 0.01) { const sh = H.shoulder('hikmet', hp, 'R'); o.R = [[sh[0] + 120, sh[1] + 70 - 30 * bos], bos, 'B']; }
    }
    if (cevap && t > tm.kazandi) { const u = W(t, tm.kazandi, 0.3); const y = H.elYeri('hikmet', hp, 'R', 'yukari'); o.R = [[y[0] - 10, y[1] + 70], u, 'B']; }
    if (espri) {
      const y = H.elYeri('hikmet', hp, 'L', 'yukari');
      o.L = [[y[0] - 40, y[1] + 54], 1, 'A'];
    }
    const hc = oyna(K, t, tl, 'hikmet', hp, o);
    if (hk && hk.para) sonra.push(() => {
      const q = hk.para;
      if (q.yatik > 0.5) return;   // masadaki para masa ile birlikte çizilir
      if (q.gizli < 0.98) {
        const p = q.elde ? [hc.handL[0], hc.handL[1] - q.r * 0.78] : q.p;
        const k = 1 - 0.75 * q.gizli;
        para(K, p[0], p[1], q.r, { phi: q.phi, flip: q.flip, yuz: q.yuz, k, parlak: 1 - q.gizli, yatik: q.yatik });
        if (q.elde) hc.tut('L');   // havadayken el tutmaz
      } else hc.tut('L');
    });
    if (espri) sonra.push(() => {
      const sn = W(t, tm.kacti - 0.15, 0.5);
      para(K, hc.handL[0], hc.handL[1] - R_BUYUK * 0.78, R_BUYUK, { phi: 0.25, parlak: 1 - sn, sonuk: sn });
      hc.tut('L');
    });
    if (cevap && t > tm.kazandi) sonra.push(() => { if (W(t, tm.kazandi, 0.3) > 0.6) hc.parmak('R', 1, { yon: -Math.PI / 2 }); });
  }

  // ═══ Necmi (kahraman anda masanın arkasında, taş verir; espride demliği alıp gider) ═══
  let tsl = null;
  if (cevap) {
    const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    tsl = taslar(t, tm);
    const o = { heads, L: [[tsl.S[0] - 6, tsl.S[1] + 10], 1, 'A'] };
    if (tsl.el) o.R = [tsl.el, tsl.w ?? 1, 'A'];
    const nc = oyna(K, t, tl, 'necmi', np, o);
    sonra.push(() => {
      // destedeki taşlar (sol el)
      for (let j = 0; j < 3; j++) tas(K, nc.handL[0] + 18 + j * 5, nc.handL[1] + 28 - j * 3, 'Y', { k: 0.62 });
      nc.tut('L');
      if (tsl.out.some(o => o.yer === 'el' || o.yer === 'kayan')) nc.tut('R');
    });
  }
  let necEspri = null;
  if (espri) {
    // Necmi masanın sağ ucunda; "kaçtı"da demliği alır, dönüp sağa yürür
    const al = tm.kacti - 0.25, don = al + 0.65;
    let np;
    if (t < don) np = H.kisi('necmi', { x: NEC_ESP, expr: 'mutlu', head: { tilt: -4, look: [-0.75, 0.45] }, ...POZ.dur });
    else np = H.yuru('necmi', t, { t0: don, x0: NEC_ESP, x1: 1750, t1: don + 2.4 });
    if (t >= don) { np.expr = 'mutlu'; np.head = { ...np.head, tilt: -4, look: [0.5, 0.2] }; }
    const sap = [DEMLIK[0], DEMLIK[1] - 118];
    const w = W(t, al - 0.3, 0.28), kalk = W(t, al, 0.4);
    const hedef = t < don ? [sap[0] + 6, sap[1] - 40 * kalk] : null;
    const o = { heads };
    if (hedef) o.L = [hedef, w, 'A'];
    else o.R = [[np.x + 70, 1230], 1, 'A'];
    const nc = oyna(K, t, tl, 'necmi', np, o);
    necEspri = { nc, tasiyor: t >= al, don };
  }

  // ═══ Defne (masanın solunda) ═══
  const dO = { heads }; let dPara = null;
  if (id === 'masa') {
    // "tura": parayı gösterir; "bir atış": tek parmak
    const g = pIn(t, tm.tura - 0.3, tm.olur - 0.1, 0.28);
    if (g > 0.01) dO.R = [[C_MASA[0] - 40, C_MASA[1] - 60], g, 'A'];
  }
  if (cevap) { dPara = defnePara(t, tm); dO.R = [dPara.el, 1, 'A']; }
  if (id === 'cta') { const g = H.elYeri('defne', dp, 'R', 'gogus'), y = H.elYeri('defne', dp, 'R', 'yukari'), wK = W(t, tm.cta + 0.05, 0.45); dO.R = [[lerp(g[0], y[0] - 10, wK), lerp(g[1], y[1] + 95, wK)], 1, 'A']; }
  if (cevap && t > tm.kazandi + 0.1) H.omuzSilk(dp, t, tm.kazandi + 0.15, 0.55);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });

  // ═══ masa ve üstündekiler ═══
  masa(K);
  if (!cevap && !espri && id !== 'buldum' && id !== 'cta') levha(K, LEVHA[0], LEVHA[1]);
  if (!espri || !necEspri || !necEspri.tasiyor) demlik(K, DEMLIK[0], DEMLIK[1], t);
  // masadaki para (yanlış deneme öncesi ve sırasında)
  if (id === 'masa') {
    const hk = hikmetPara(t, tm, hp);
    if (hk.para && hk.para.yatik > 0.5) para(K, hk.para.p[0], hk.para.p[1], hk.para.r, { yatik: hk.para.yatik, yuz: 'Y' });
  }
  if (cevap) {
    const ic = tsl.out;
    const tepsiTas = ic.filter(o => o.yer === 'tepsi');
    // tepsi (yeniden): arka sırada, taşlar içinde
    for (const o of tepsiTas) tas(K, o.x, o.yb, o.harf, { k: 1.05 });
    K.rect(TEPSI.cx - 70, TEPSI.y - 22, 140, 26, '#8FA093', LW * 0.8, 6);
    const kab = c => H.nabiz(t, c === 'D' ? tm.benC : tm.sizC, 0.4);
    kutu(K, KUTU.D, 'Y', 'T', K.up('defne'), { kab: kab('D') });
    const kutuTas = ic.filter(o => o.yer === 'kutu');
    kutu(K, KUTU.H, 'T', 'Y', K.up('hikmet'), { kab: kab('H') + H.nabiz(t, tm.kazandi, 0.4), yesil: W(t, tm.kazandi, 0.3), ic: kutuTas.map(o => () => tas(K, o.x, o.yb, o.harf)) });
    // masadaki ve kayan taşlar
    for (const o of ic) if (o.yer === 'masa' || o.yer === 'kayan' || o.yer === 'el') tas(K, o.x, o.yb, o.harf);
    // para
    if (dPara.yatik > 0.01 || dPara.p[1] > LS[1] - 10) para(K, dPara.p[0], dPara.p[1], R_KUCUK, { yatik: dPara.yatik, flip: dPara.flip, yuz: dPara.yuz });
    else para(K, dPara.p[0], dPara.p[1], R_KUCUK, { flip: dPara.flip, yuz: dPara.yuz });
    const elde = Math.hypot(dPara.p[0] - dc.handR[0] - 6, dPara.p[1] - dc.handR[1] + R_KUCUK * 0.7) < 22;
    if (elde) dc.tut('R');
  }
  if (id === 'masa') {
    const g = pIn(t, tm.tura - 0.3, tm.olur - 0.1, 0.28);
    if (g > 0.6) { if (t < tm.bir - 0.1) dc.isaret('R', C_MASA); else dc.parmak('R', 1, { yon: -Math.PI / 2 }); }
  }
  if (id === 'cta') { para(K, dc.handR[0] + 2, dc.handR[1] - R_BUYUK * 0.78, R_BUYUK, { phi: 0.3 * Math.sin((t - tm.cta) * 2.2), yuz: 'Y' }); dc.tut('R'); }
  for (const f of sonra) f();
  if (necEspri) {
    const { nc, tasiyor } = necEspri;
    if (tasiyor) { const h = t < necEspri.don ? nc.handL : nc.handR; demlik(K, h[0] - 4, h[1] + 118, t); t < necEspri.don ? nc.tut('L') : nc.tut('R'); }
  }
}

// ——— çay ocağı: Necmi ile Kerem tavla oynar ———
function ocakSahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B;
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  // zarlar: Necmi'nin ikilisi solda (4, 2), Kerem'inki sağda (2, 4); düşüş anları kelimelere bağlı
  const zk = 2.5, hedefN = [[TCX - 96, TAVLA_Y - 26], [TCX - 42, TAVLA_Y - 21]], hedefK = [[TCX + 42, TAVLA_Y - 21], [TCX + 96, TAVLA_Y - 26]];
  const nEl = [NEC_T + 120, 1182], kEl = [KER_T - 120, 1182];
  const zarlar = [];
  const ucan = (t0, t1, a, b, n, i) => {
    if (t < t0) return null;
    if (t >= t1) return { p: b, n, a: [0.15, -0.2, 0.1, -0.12][i], k: zk * (1 + 0.18 * H.nabiz(t, tm.ayni + i * 0.07, 0.34)) };
    const u = seg(t, t0, t1 - t0); return { p: ucus(a, b, u, 70), n: [3, 5, 1, 6, 2, 4][(i + Math.floor(u * 5)) % 6], a: u * 7 + i, k: zk };
  };
  [[tm.nAt, tm.zN[0], 4], [tm.nAt + 0.05, tm.zN[1], 2]].forEach(([a, b, n], i) => { const z = ucan(a, b, nEl, hedefN[i], n, i); if (z) zarlar.push(z); });
  [[tm.kAt, tm.zK[0], 2], [tm.kAt + 0.05, tm.zK[1], 4]].forEach(([a, b, n], i) => { const z = ucan(a, b, kEl, hedefK[i], n, i + 2); if (z) zarlar.push(z); });
  // oyuncular: Necmi solda (yüzü sağa), Kerem sağda (yüzü sola)
  const nAt = pIn(t, tm.ipucu - 0.2, tm.nAt + 0.12, 0.2), kAt = pIn(t, tm.kAt - 0.45, tm.kAt + 0.12, 0.22);
  const np = H.otur('necmi', { x: NEC_T, facing: 1, expr: 'mutlu', head: { look: [0.6, 0.35], tilt: 2 } });
  if (t > tm.ayni - 0.1) np.head = { ...np.head, look: [-0.2, 0.0], tilt: -4 };
  const kp = H.otur(H.KEREM, { x: KER_T, facing: -1, expr: 'notr', head: { look: [0.6, 0.4], tilt: 3 } });
  H.onayla(kp, t, tm.ayni + 0.1, 2, 0.32);
  for (const [p, key] of [[np, 'necmi'], [kp, H.KEREM]]) { const o = H.oturak(key, p); M.sandalye(K, o.x, o.y, { yon: p.facing, w: 118, sirt: 160 }); }
  const nc = oyna(K, t, tl, 'necmi', np, { heads, ...(nAt > 0.01 ? { R: [nEl, nAt, 'A'] } : {}) });
  const kc = oyna(K, t, tl, H.KEREM, kp, { sessiz: true, ...(kAt > 0.01 ? { R: [kEl, kAt, 'A'] } : {}) });
  tavlaMasasi(K);
  tavla(K, TCX, zarlar, TAV_K);
  // elde sallanan zarlar (atmadan önce)
  if (nAt > 0.6 && t < tm.nAt) { zar(K, nc.handR[0] + 4, nc.handR[1] - 20, 6, 0.3 * Math.sin(t * 20), zk * 0.8); zar(K, nc.handR[0] + 20, nc.handR[1] - 10, 3, -0.2, zk * 0.8); nc.tut('R'); }
  if (kAt > 0.6 && t < tm.kAt) { zar(K, kc.handR[0] - 4, kc.handR[1] - 20, 5, 0.3 * Math.sin(t * 20), zk * 0.8); zar(K, kc.handR[0] - 20, kc.handR[1] - 10, 1, 0.2, zk * 0.8); kc.tut('R'); }
}
