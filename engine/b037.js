// Bölüm 37 · KAÇ? (v4 "hikâye" dili; storyboard: hikayeler/bolum_037_v5.md).
// Logline: Hikmet Bey, dün Necmi'nin ona tek kelimelik, gerçek bir soru sorduğunu, kendisinin de cevap vermek yerine
// söyleneni yapıp kaçtığını anlatır. Defne cevabı çaycının her sabahki sorusundan bulur; geri dönüşte gerçek çıkar:
// Hikmet, Necmi'nin baklavasını gizlice yerken yakalanmıştır.
// Akılda kalacak tek şey: "Kaç?" Türkçede hem soru hem emir olabilen tek soru kelimesidir.
// İki set aynı dünyada yan yana durur: oda (Hikmet'in odası; solda kapı, sağda masa) · ocak (çay ocağı, bar tezgâhı).
// Geri dönüş ("DÜN") ocakta oynanır; Hikmet sağdan çıkar, kısa planda odaya soldan aynı hızla girer ve kapıyı kapatır
// (kare 0'daki duruş). Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const ODA = 'b037_oda', OCK = 'b037_ocak', OX = 4000;
// oda: kapı solda (menteşe solda, kanat izleyiciye açılır); Hikmet kapının sağında; Defne masanın arkasında
const KAPI = { x: 40, y: 770, w: 300, h: 730 }, HX = 470, DX = 880, MASA = 1232, MASA_X0 = 600, MASA_X1 = 1280;
const PAD = [800, 1226], PEN = [948, 1228], BAKM = [668, 1226], NUP = [712, 985], NOT_YER = [712, 1228], NOT_YER2 = [775, 1229], CAYB = [1150, 1230];
// ocak: bar tezgâhı (üst yüz BAR); Necmi bugün tezgâhın ortasında, dün soldan girer; Hikmet dün tepsinin başında
const BAR = 1232, BAR_X0 = OX + 90, BAR_X1 = OX + 1300, NEC_X = OX + 560, NEC_G = OX + 380, HIK_G = OX + 840;
const TEPSI = [OX + 840, 1228], CAYT = [OX + 330, 1228], SEKER = [OX + 712, 1228], CAYDAN = [OX + 175, 1228];
// renkler
const NOT_SARI = '#F2CF4E', NOT_KOYU = '#D9B23A', NOT_ARKA = '#EFA48B', BAK_UST = '#E3A94C', BAK_ON = '#B8742C', FISTIK = '#7FA443', CAY = '#A5491A';
const CAM0 = [1.1, 600, 1060];
const NAP_EL = hp => [hp.x + 150, 1150];                          // Hikmet baklavalı peçeteyi gövdesinin yanında, duvarın önünde tutar                                    // kare 0 ve kısa plan (dün, oda) aynı kadraj

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const tik = (t, a, d = 0.24) => Math.sin(Math.PI * seg(t, a - d, d));
const ekle = (p, d) => [p[0] + d[0], p[1] + d[1]];
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const salla = (t, a, b, amp = 7, f = 3.2) => (t > a && t < b ? amp * Math.sin(TAU * f * (t - a)) * Math.sin(Math.PI * seg(t, a, b - a)) : 0);

// ═══════════════════════════ Nesneler ═══════════════════════════
// Baklava dilimi: (x, y) üst yüzün ortası; k ölçek (k = 1'de 64 px en). Üst yüz eşkenar dörtgen, ön yüzde kat çizgileri.
function baklava(K, [x, y], k = 1, rot = 0) {
  const { ctx } = K, w = 32, h = 13, d = 15;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  K.poly([[-w, 0], [0, h], [w, 0], [w, d], [0, h + d], [-w, d]], BAK_ON, LW * 0.6);
  for (const f of [0.35, 0.65]) { K.line(-w + 3, d * f + 1, 0, h + d * f, 2.4, '#94561F'); K.line(0, h + d * f, w - 3, d * f + 1, 2.4, '#94561F'); }
  K.poly([[-w, 0], [0, -h], [w, 0], [0, h]], BAK_UST, LW * 0.6);
  K.ell(0, 0, 9, 4, FISTIK, 0); K.circ(-4, -1, 2.4, '#A9C866', 0);
  ctx.restore();
}
// Peçete (üstten hafif eğik kare), üstünde baklava. (x, y) peçetenin ortası
function pecete(K, [x, y], { k = 1, bak = true, rot = 0 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  K.poly([[-58, 0], [0, -22], [58, 0], [0, 22]], PAL.cream, LW * 0.6);
  K.poly([[20, -14], [0, -22], [-6, -12]], '#E9E1D0', LW * 0.4);
  ctx.restore();
  if (bak) baklava(K, [x, y - 10 * k], 0.95 * k, rot);
}
// Yapışkan not (elde, önden): (x, y) merkez; sx −1..1 çevirme (kos), yazı ön yüzde; arka yüz mercana döner
function notKagidi(K, [x, y], { yazi = '', sx = 1, boy = 170, rot = 0 } = {}) {
  const { ctx } = K, s = boy / 2, on = sx >= 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(Math.max(0.04, Math.abs(sx)), 1);
  K.rect(-s + 7, -s + 9, boy, boy, INK, 0, 6);
  K.rect(-s, -s, boy, boy, on ? NOT_SARI : NOT_ARKA, LW * 0.8, 6);
  if (on) { K.rect(-s, -s, boy, boy * 0.16, NOT_KOYU, 0, 6); K.line(-s, -s + boy * 0.16, s, -s + boy * 0.16, 2.5, '#B8952A'); }
  if (on && yazi) K.text(yazi, 0, boy * 0.2, boy * 0.3, INK, 900);
  ctx.restore();
}
// Masada yatan not (yassı paralelkenar)
function notYatan(K, [x, y], { arka = false, yazi = '' } = {}) {
  K.poly([[x - 74, y], [x - 52, y - 30], [x + 78, y - 30], [x + 56, y]], arka ? NOT_ARKA : NOT_SARI, LW * 0.7);
  if (!arka && yazi) for (let i = 0; i < 2; i++) K.line(x - 40 + i * 8, y - 19 + i * 10, x + 40 - i * 14, y - 19 + i * 10, 4, '#8A6F1E');   // yatan notun yazısı okunmaz: karalama
}
// Not bloğu (masada) ve kalem
function notBlok(K, [x, y]) { K.poly([[x - 70, y], [x - 50, y - 26], [x + 74, y - 26], [x + 54, y]], NOT_SARI, LW * 0.7); K.rect(x - 70, y, 124, 10, NOT_KOYU, LW * 0.6, 2); }
function kalem(K, a, b) {   // a: arka uç, b: uç
  const { ctx } = K; ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, a, b, 17, INK); H.strokeLine(ctx, a, b, 9, PAL.teal);
  const u = H.unit(a, b); H.strokeLine(ctx, [b[0] - u[0] * 16, b[1] - u[1] * 16], b, 9, PAL.cream); ctx.restore();
}
// Şeker küpü (yan görünüş)
function kup(K, [x, y], s = 30) { K.rect(x - s / 2, y - s / 2, s, s, '#FBF8F1', LW * 0.6, s * 0.14); K.line(x - s * 0.28, y - s * 0.18, x - s * 0.02, y - s * 0.18, 2.4, '#E1D9C6'); }
// Şeker maşası: el (pivot) → uç; küp ucun arasında
function masa(K, el, uc, { kupVar = true, ac = 0, k = 1 } = {}) {
  const { ctx } = K, u = H.unit(el, uc), n = [-u[1], u[0]], L = Math.hypot(uc[0] - el[0], uc[1] - el[1]), g = (15 + 6 * ac) * k;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const m of [-1, 1]) {
    const p1 = [el[0] + u[0] * L * 0.55 + n[0] * m * g * 0.7, el[1] + u[1] * L * 0.55 + n[1] * m * g * 0.7], p2 = [uc[0] + n[0] * m * g, uc[1] + n[1] * m * g];
    for (const [w, c] of [[12 * k, INK], [5.5 * k, '#C9D3CC']]) { ctx.beginPath(); ctx.moveTo(el[0], el[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineWidth = w; ctx.strokeStyle = c; ctx.stroke(); }
  }
  ctx.restore();
  if (kupVar) kup(K, uc, 34 * k);
}
// İnce belli çay bardağı (034 bardak gövdesi): (x, y) taban ortası, k ölçek
const GOVDE = [[-18, -62], [18, -62], [11, -36], [19, -11], [13, -2], [-13, -2], [-19, -11], [-11, -36]];
function bardak(K, x, y, k, { sev = 0.76, renk = CAY, tabak = true } = {}) {
  const { ctx } = K, yol = c => { GOVDE.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.closePath(); };
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (tabak) K.ell(0, 0, 34, 9, PAL.cream, 6 / k * 0.7 + 0.4);
  ctx.beginPath(); yol(ctx); ctx.fillStyle = 'rgba(244,237,224,0.34)'; ctx.fill();
  if (sev > 0) H.sivi(K, yol, [-18, -62, 36, 60], { seviye: sev, renk });
  ctx.beginPath(); yol(ctx); K.fs(null, Math.max(0.8, 6.5 / k));
  K.line(-12, -54, -9, -20, Math.max(0.9, 4 / k), 'rgba(255,255,255,0.7)');
  ctx.restore();
}
// Çay tepsisi (elde ya da tezgâhta): (x, y) tepsinin ortası; n bardak
function cayTepsisi(K, [x, y], { n = 2, t = 0, buhar = true } = {}) {
  K.ell(x + 4, y + 8, 112, 24, INK, 0); K.ell(x, y, 112, 24, PAL.metal, LW * 0.8); K.ell(x, y - 3, 92, 17, '#A9B8AC', LW * 0.5);
  for (let i = 0; i < n; i++) { const bx = x + (i - (n - 1) / 2) * 62; bardak(K, bx, y - 2, 1.25); }
  if (buhar) H.buhar(K, x, y - 92, t, { k: 0.55, n: 2, ara: 40, boy: 80 });
}
// Baklava tepsisi (tezgâhta): kalan dilim sayısı n (dün 7; bugün 1 + kırıntı)
function baklavaTepsisi(K, [x, y], n = 7) {
  K.ell(x + 5, y + 8, 132, 32, INK, 0); K.ell(x, y, 132, 32, '#C9B37A', LW * 0.8); K.ell(x, y - 3, 114, 25, '#E2D3A0', LW * 0.5);
  const yer = [[-62, -8], [0, -10], [62, -8], [-92, 8], [-31, 8], [31, 8], [92, 8]];
  for (let i = 0; i < 7; i++) {
    const [dx, dy] = yer[i];
    if (i < n) baklava(K, [x + dx, y + dy - 10], 0.82);
    else { K.circ(x + dx - 8, y + dy - 2, 3, BAK_UST, 0); K.circ(x + dx + 6, y + dy + 1, 2.5, FISTIK, 0); }
  }
}
// Çaydanlık (tezgâhta, döngü: buhar)
function caydanlik(K, [x, y], t) {
  K.rect(x - 64, y - 22, 128, 22, '#5D6A61', LW * 0.8, 6);
  const { ctx } = K; ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 120, 62, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  K.poly([[x + 54, y - 100], [x + 102, y - 130], [x + 110, y - 118], [x + 58, y - 78]], PAL.metal, LW);
  K.rect(x - 50, y - 124, 100, 104, PAL.metal, LW, 14);
  K.rect(x - 32, y - 176, 64, 54, '#B9C6BB', LW, 12); K.circ(x, y - 182, 9, '#3A3F3C', LW * 0.6);
  H.buhar(K, x + 108, y - 140, t, { k: 0.9, n: 2 });
}
// Şekerlik
function sekerlik(K, [x, y]) {
  K.poly([[x - 52, y - 58], [x + 52, y - 58], [x + 42, y - 4], [x - 42, y - 4]], '#CFE3DD', LW * 0.8);
  for (let i = 0; i < 3; i++) kup(K, [x - 30 + i * 30, y - 70 - (i % 2) * 8], 34);
  K.ell(x, y - 2, 50, 9, PAL.cream, LW * 0.6);
}
// Önkol + el, nesnenin üstüne (masa ve tezgâh karakterden sonra çizilir)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Hikmet'in ağız kenarındaki baklava kırıntısı (önden; başın eğimiyle döner)
function kirinti(K, hp, a = 1) {
  if (a <= 0.02 || hp.view === 'side') return;
  const hd = H.eklem('hikmet', hp, 'head'), s = hp.s, r = (hp.head.tilt || 0) * H.D2R, c = Math.cos(r), sn = Math.sin(r);
  const at = (lx, ly) => [hd[0] + (lx * c - ly * sn) * s, hd[1] + (lx * sn + ly * c) * s];
  const { ctx } = K; ctx.save(); ctx.globalAlpha = a;
  for (const [lx, ly, rr, col] of [[0.17, 0.34, 0.034, PAL.cream], [0.215, 0.375, 0.026, BAK_UST], [0.15, 0.39, 0.022, FISTIK], [0.22, 0.305, 0.02, PAL.cream]]) { const p = at(lx, ly); K.circ(p[0], p[1], rr * s, col, 3); }
  ctx.restore();
}
// Konuşma balonu nesnesi (ekran): Necmi'nin "KAÇ?"ı. Gövde sabit (okunurken kaymaz), kuyruk Necmi'nin ağzına uzanır.
// "?" emir anında düşer, yerine "!" oturur.
function kacBalonu(K, t, a, tDus, [x, y], agiz) {
  if (t < a - 0.001) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), k = (0.6 + 0.4 * v) * (1 + 0.08 * H.nabiz(t, tDus + 0.3, 0.36));
  const bw = 400, bh = 220;
  ctx.save(); ctx.globalAlpha = clamp01(v * 1.6);
  // kuyruk (gövdeden önce, gövde örter)
  const tb = [x - 40, y + bh * 0.38], tu = kar([x, y], agiz, 0.9), tc = [x + 40, y + bh * 0.38];
  K.poly([[tb[0] + 6, tb[1] + 9], [tu[0] + 6, tu[1] + 9], [tc[0] + 6, tc[1] + 9]], INK, 0);
  K.poly([tb, tu, tc], PAL.cream, LW);
  ctx.translate(x, y); ctx.scale(k, k);
  K.ell(8, 10, bw / 2, bh / 2, INK, 0); K.ell(0, 0, bw / 2, bh / 2, PAL.cream, LW);
  ctx.restore();
  ctx.save(); ctx.globalAlpha = clamp01(v * 1.6); ctx.beginPath(); ctx.moveTo(tb[0] + 10, tb[1] - 6); ctx.lineTo(tc[0] - 10, tc[1] - 6); ctx.lineWidth = LW + 4; ctx.strokeStyle = PAL.cream; ctx.stroke(); ctx.restore();
  // yazı: KAÇ + işaret
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = clamp01(v * 1.6);
  const fs = 124; ctx.font = `900 ${fs}px Rubik`; const kw = ctx.measureText(K.up('kaç')).width, qw = ctx.measureText('?').width, x0 = -(kw + qw) / 2;
  K.text(K.up('kaç'), x0, fs * 0.36, fs, INK, 900, 'left');
  const us = seg(t, tDus, 0.42);
  if (us < 1) {   // soru işareti düşer, döner, solar
    ctx.save(); ctx.translate(x0 + kw + qw / 2, fs * 0.36 + 560 * us * us); ctx.rotate(1.4 * us); ctx.globalAlpha *= 1 - us;
    K.text('?', 0, 0, fs, PAL.coral, 900); ctx.restore();
  }
  const ui = seg(t, tDus + 0.1, 0.2);
  if (ui > 0) K.text('!', x0 + kw + qw / 2, lerp(fs * 0.36 - 260, fs * 0.36, ui * ui), fs, PAL.coral, 900);   // ünlem yukarıdan iner, temas karesinde durur (sekme yok)
  ctx.restore();
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-500, 1800], dongu: ['pencerede martı', 'masadaki çayın buharı', 'duvar saatinin saniye kolu'],
  capa: { kapiKolu: d => kapiKolu(d.kapi || 0), baklava: BAKM, not: PAD }, kadraj: { genis: CAM0, defne: [1.35, 880, 1000] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -500, x1: 1800, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 520, 560, 330, 320, { isik, t: t + 3 });
    M.duvarSaati(K, 1090, 760, 50, durum.saat ?? 10.25, t);
    // duvarda çerçeveli belge (Hikmet'in odası)
    K.rect(1230, 620, 150, 190, PAL.woodDark, LW, 4); K.rect(1246, 636, 118, 158, PAL.cream, LW * 0.6, 2);
    for (let i = 0; i < 4; i++) K.line(1262, 670 + i * 28, 1348 - (i % 2) * 24, 670 + i * 28, 5, '#CFC4AA');
    M.kapi(K, KAPI.x, KAPI.y, KAPI.w, KAPI.h, { acik: durum.kapi || 0, isik, ic: '#3E6E6F' });
  },
  on(K, t) {   // masa: üst tabla, ön kenar, ön yüz (Defne'nin bacaklarını örter)
    K.rect(MASA_X0 - 20, MASA - 30, MASA_X1 - MASA_X0 + 40, 32, PAL.woodTop, LW, 6);
    K.rect(MASA_X0, MASA + 2, MASA_X1 - MASA_X0, 26, PAL.woodDark, LW, 0);
    K.rect(MASA_X0 + 10, MASA + 28, MASA_X1 - MASA_X0 - 20, 560, PAL.wood, LW, 0);
    for (let i = 0; i < 3; i++) K.rect(MASA_X0 + 40 + i * 205, MASA + 60, 170, 230, '#B07A44', LW * 0.8, 10);
    bardak(K, CAYB[0], CAYB[1], 2.2); H.buhar(K, CAYB[0], CAYB[1] - 150, t, { k: 0.6, n: 2, ara: 22 });
  },
});
M.mekanEkle(OCK, {
  gen: [OX - 600, OX + 1900], dongu: ['çaydanlık buharı', 'pencerede martı'],
  capa: { tepsi: TEPSI, seker: SEKER }, kadraj: { necmi: [1.4, OX + 585, 1010], dun: [1.08, OX + 600, 1060] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: OX - 600, x1: OX + 1900, isik, duvar: 'fayans', zemin: 'karo' });
    M.pencere(K, OX + 560, 500, 380, 330, { isik, t: t + 6 });
    M.duvarSaati(K, OX + 1080, 600, 46, durum.saat ?? 10.4, t);
    // raf: ters çay bardakları ve çay kutusu
    K.rect(OX + 60, 880, 420, 20, PAL.woodTop, LW, 5);
    for (let i = 0; i < 5; i++) bardak(K, OX + 110 + i * 62, 880, 1.05, { sev: 0, tabak: false });
    K.rect(OX + 410, 800, 64, 80, PAL.red, LW, 8); K.rect(OX + 420, 822, 44, 28, PAL.cream, LW * 0.5, 4);
  },
});
// tezgâhın ön yüzü (ocak 'on' katmanı yerine bölümde çizilir: üstündeki nesnelerden önce)
function tezgah(K) {
  K.rect(BAR_X0 - 20, BAR - 30, BAR_X1 - BAR_X0 + 40, 32, PAL.woodTop, LW, 6);
  K.rect(BAR_X0, BAR + 2, BAR_X1 - BAR_X0, 26, PAL.woodDark, LW, 0);
  K.rect(BAR_X0 + 10, BAR + 28, BAR_X1 - BAR_X0 - 20, 560, PAL.wood, LW, 0);
  for (let i = 0; i < 5; i++) K.rect(BAR_X0 + 40 + i * 232, BAR + 60, 196, 230, '#B07A44', LW * 0.8, 10);
}
// Kapı kolu (kapi() ile aynı formül): el hedefi
function kapiKolu(acik) { const a = clamp01(acik) * 82 * Math.PI / 180; return [KAPI.x + KAPI.w * Math.cos(a) * 0.84, KAPI.y + KAPI.h * 0.56 + 6 * Math.sin(a)]; }

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    kapat: 0.32, tek: T('h1:3'), kactim: T('h1:8'),
    h2a: T('h2a'), aralik: T('h2a') + 0.35, cevap: T('h2a:5'), kapat2: T('h2a:8') - 0.02, h2b: T('h2b'), ne: T('h2b:2'),
    h3: T('h3'), bu: T('h3:1'), senin: T('h3:3'),
    d2: T('d2'), zam: T('d2'), hd: T('hd'), al: T('hd') - 0.08, verilir: T('hd:2'), yaptim: T('hd:5'),
    sayac: T('hd>') + 0.18, n1: T('n1'), tekN: T('n1:5'), sorarim: T('n1:7'),
    kac: T('d3:1'), geri: T('d4') - 0.05,
    sekeri: T('d4:1'), balon: T('d4:3') - 0.04, emir: T('d4:9') - 0.04, siz: T('d5'), kactiniz: T('d5:4'),
    h4: T('h4'), espri: T('h4') - 0.35, yemistim: T('h4:3'),
    cta: T('d6') - 0.15,
  };
  Object.assign(tm, { bak: cd - 0.05, ipucu: cd + 0.28, birak: tm.emir + 0.28, nGir: tm.geri, nVar: tm.geri + 0.85 });
  // dün: Hikmet tepsiyi bırakıp sağdan koşar; kesme, sırtı kadrajın sağ kenarını geçtiği an (kamera 1.08x, kayma −30 px)
  const kosG = { t0: tm.siz + 0.3, x0: HIK_G, x1: OX + 1700, hiz: 650, poz: { expr: 'korku', lean: 12, head: { tilt: 4, look: [0.9, 0.1] } } };
  let tK = kosG.t0; while (tK < kosG.t0 + 3 && H.yuru('hikmet', tK, kosG).x < OX + 600 - 30 + 540 / 1.08 + 70) tK += 1 / 240;
  tm.kosu = Math.round(tK * 1000) / 1000;
  // kısa plan (dün, oda): aynı ekran hızıyla soldan girer (dünya hızı 650 · 1.08 / 1.1), kapının önünde durur
  const vO = 650 * 1.08 / CAM0[0], solKenar = CAM0[1] - 540 / CAM0[0] - 70;
  const kosO = { x0: -1400, x1: HX, hiz: vO, poz: { expr: 'korku', lean: 12, head: { tilt: 4, look: [0.9, 0.1] } } };
  let lo = tm.kosu - 4, hi = tm.kosu;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (H.yuru('hikmet', tm.kosu, { ...kosO, t0: m }).x > solKenar) lo = m; else hi = m; }
  kosO.t0 = (lo + hi) / 2;
  tm.dur = kosO.t0 + (HX - kosO.x0) / vO + 0.15;                    // ayakta durduğu an (yamuk hız profili)
  tm.it = Math.min(tm.dur + 0.12, tm.espri - 0.4);                   // kapıyı iter (temas: it + 0.28)

  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, ...CAM0], [1.6, 1.07, 610, 1062], [tm.h2a - 0.1, 1.26, 430, 1020], [tm.h2b - 0.12, 1.12, 640, 1060]] },
    { id: 'bahis', t0: tm.h3 - 0.1, cam: [[0, 1.3, 660, 1070], [tm.senin, 1.32, 664, 1072]] },
    { id: 'not', t0: tm.d2 - 0.12, cam: [[0, 1.42, 790, 1010], [tm.hd - 0.15, 1.28, 690, 1022]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 1.0, 590, 905], [tm.cd0 + 2.6, 1.02, 592, 902]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, ...M.kadraj(OCK, 'necmi')], [tm.tekN - 0.2, 1.45, OX + 595, 1000]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'geri', geri: true, t0: tm.geri, kay: [-60, 0], cam: [[0, ...M.kadraj(OCK, 'dun')]] },
    { id: 'kosu', dun: true, kisa: true, t0: tm.kosu, cam: [[0, ...CAM0]] },
    { id: 'espri', t0: tm.espri, kay: [60, 0], cam: [[0, 1.22, 640, 1050], [tm.yemistim, 1.25, 650, 1045]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.4, 840, 990], [tm.cta + 1.5, 1.45, 842, 985]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— Hikmet (oda, önden) ———
  const hikBase = kisi('hikmet', { x: HX, expr: 'korku', head: { tilt: -6, look: [-0.85, 0.2] }, ...POZ.dur });
  const hik = [
    [0.55, { expr: 'korku', head: { tilt: 3, look: [0.85, 0.15] } }, 0.35],
    [tm.tek - 0.1, { expr: 'saskin', head: { tilt: 6, look: [0.9, 0.05] } }, 0.25],
    [tm.kactim - 0.15, { expr: 'korku', head: { tilt: -5, look: [-0.85, 0.2] } }, 0.25],
    [tm.aralik, { expr: 'korku', head: { tilt: -8, look: [-0.95, 0.1] } }, 0.3],
    [tm.cevap - 0.1, { expr: 'kizgin', head: { tilt: 2, look: [0.6, 0.3] } }, 0.3],
    [tm.kapat2 - 0.4, { expr: 'korku', head: { tilt: -6, look: [-0.9, 0.2] } }, 0.25],
    [tm.h2b, { expr: 'notr', head: { tilt: 5, look: [0.9, 0.1] } }, 0.3],
    [tm.h3 - 0.1, { expr: 'mutlu', head: { tilt: 4, look: [0.9, 0.2] } }, 0.01],
    [tm.senin - 0.3, { head: { tilt: 0, look: [0.7, 0.6] } }, 0.3],
    [tm.d2 - 0.12, { expr: 'notr', head: { tilt: 4, look: [0.9, 0.05] } }, 0.01],
    [tm.hd - 0.15, { expr: 'kizgin', head: { tilt: -3, look: [0.8, 0.2] } }, 0.25],
    [tm.verilir + 0.35, { expr: 'mutlu', head: { tilt: 5, look: [0.9, 0.1] } }, 0.3],
    [tm.sayac, { x: 250, expr: 'mutlu', ...POZ.belde, head: { tilt: 4, look: [0.9, 0.15] } }, 0.01],
    [tm.cd0 + 0.6, { expr: 'korku', head: { tilt: -6, look: [-0.9, 0.15] } }, 0.3],
    [tm.cd0 + 1.4, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.2] } }, 0.3],
    [tm.bak, { expr: 'notr', head: { tilt: 4, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.05, { x: HX, ...POZ.dur, expr: 'saskin', head: { tilt: 3, look: [0.9, 0.05] } }, 0.01],
    [tm.espri, { expr: 'yorgun', ...POZ.dur, head: { tilt: 6, look: [0.85, 0.25] } }, 0.01],
    [tm.yemistim - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [0.9, 0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.95, 0.1] } }, 0.3],
  ].sort((a, b) => a[0] - b[0]);
  // ——— Defne (oda, önden, masanın arkasında) ———
  const defBase = kisi('defne', { x: DX, expr: 'saskin', head: { tilt: 4, look: [-0.85, 0.2] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: 6, look: [-0.9, 0.05] } }, 0.4],
    [tm.kactim, { expr: 'saskin', head: { tilt: -3, look: [-0.95, 0.15] } }, 0.3],
    [tm.aralik + 0.3, { expr: 'notr', head: { tilt: -6, look: [-0.95, 0.3] } }, 0.35],
    [tm.h2b, { expr: IFADE.dusun, head: { tilt: 4, look: [-0.85, 0.15] } }, 0.3],
    [tm.h2b + 0.55, { head: { tilt: -4, look: [-0.2, 0.75] } }, 0.3],
    [tm.h3 - 0.1, { expr: 'notr', head: { tilt: -6, look: [-0.25, 0.8] } }, 0.01],
    [tm.bu, { expr: 'mutlu', head: { tilt: 5, look: [-0.8, 0.4] } }, 0.25],
    [tm.senin + 0.2, { expr: IFADE.dusun, head: { tilt: -5, look: [-0.2, 0.8] } }, 0.3],
    [tm.d2 - 0.12, { expr: 'mutlu', head: { tilt: 5, look: [-0.7, 0.05] } }, 0.01],
    [tm.hd, { expr: 'saskin', head: { tilt: -3, look: [-0.85, 0.1] } }, 0.25],
    [tm.verilir + 0.3, { expr: IFADE.dusun, head: { tilt: -5, look: [-0.85, 0.25] } }, 0.3],
    [tm.sayac, { expr: IFADE.dusun, head: { tilt: -5, look: [-0.2, 0.8] } }, 0.01],
    [tm.cd0 + 1.0, { expr: 'mutlu', head: { tilt: 5, look: [-0.85, 0.1] } }, 0.25],
    [tm.cd0 + 2.1, { expr: IFADE.dusun2, head: { tilt: -6, look: [-0.5, -0.4] } }, 0.3],
    [tm.bak, { expr: 'notr', head: { tilt: 5, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] } }, 0.25, ease.enter],
    [tm.espri, { expr: 'mutlu', ...POZ.dur, head: { tilt: -4, look: [-0.85, 0.2] } }, 0.01],
    [tm.yemistim + 0.1, { expr: 'mutlu', head: { tilt: 7, look: [-0.8, 0.05] } }, 0.3],
    [tm.cta - 0.05, { head: { tilt: 6, look: [-0.1, 0.05] } }, 0.35],
  ].sort((a, b) => a[0] - b[0]);
  return { tm, film, hik, hikBase, def, defBase, kosG, kosO };
}

// ═══════════════════════════ Durumlar ═══════════════════════════
// Kapı açıklığı (oda): kare 0'da aralık kapanır · h2a'da aralanır ve kapanır · sayaçta bir kez yoklar · kısa planda (dün) kapanır
function kapiAt(t, tm, id) {
  if (id === 'kosu') return 0.45 * (1 - ease.state(seg(t, tm.it, 0.28)));
  if (id === 'oda') return 0.24 * (1 - ease.enter(seg(t, 0.1, tm.kapat - 0.1))) + 0.2 * W(t, tm.aralik + 0.12, 0.35) * (1 - ease.enter(seg(t, tm.kapat2 - 0.32, 0.32)));
  return 0;
}
// Defne'nin notu: { yer, sx, yazi, elde: 'd' | 'h' | null, arka, yatan }
function notAt(t, tm, id) {
  if (id === 'not') {
    const kalk = ease.enter(seg(t, tm.zam - 0.02, 0.38)), al = W(t, tm.al + 0.22, 0.35), birak = W(t, tm.yaptim - 0.3, 0.3);
    const elH = [640, 1040];
    let yer = kar(kar(PAD, NUP, kalk), elH, al); yer = kar(yer, ekle(NOT_YER, [0, -40]), birak);
    const sx = Math.cos(Math.PI * ease.state(seg(t, tm.verilir, 0.3)));
    const yatan = t >= tm.yaptim;
    return { yer: yatan ? NOT_YER : yer, sx, yazi: K_UP_ZAM, elde: yatan ? null : t >= tm.al + 0.17 ? 'h' : 'd', arka: sx < 0, yatan };
  }
  return null;
}
const K_UP_ZAM = 'ZAM?', K_UP_KIM = 'KİM?';
// Sayaçtaki ikinci not ("KİM?")
// Defne'nin sağ eli sayaçta: kalem → yazar → kalemi bırakır → notu alır, sağ yanında kaldırır (sayaç halkasının dışında) → masaya bırakır
const KIM_EL = [DX + 140, 1076], NOT_EL = [40, 86];
function elSayac(t, tm) {
  const c = tm.cd0, PENU = ekle(PEN, [-6, -18]), YAZ = ekle(PAD, [46, -26]);
  const p = H.iz([[0, PENU], [c + 0.3, YAZ, 0.25], [c + 0.85, PENU, 0.25], [c + 1.15, ekle(PAD, [40, 60]), 0.25], [c + 1.55, KIM_EL, 0.38, ease.enter], [c + 2.75, ekle(NOT_YER2, NOT_EL), 0.32]], t);
  const j = t > c + 0.55 && t < c + 0.85 ? [14 * Math.sin(TAU * 3.4 * (t - c)), -5 * Math.abs(Math.sin(TAU * 6.8 * (t - c)))] : [0, 0];
  return [p[0] + j[0], p[1] + j[1]];
}
function not2At(t, tm) {
  if (t < tm.cd0 + 1.4) return null;
  const e = elSayac(t, tm);
  return { yer: [e[0] - NOT_EL[0], e[1] - NOT_EL[1]], yatan: t >= tm.cd0 + 3.07 };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 3 },
  kuyruksuz: (t, B) => !!(B.sc.geri || B.sc.dun),
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'ipucu' || id === 'geri') ocakSahne(K, t, tl, S, B);
    else odaSahne(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, { sc } = B;
    const sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (sc.id === 'not') {   // çevrilen notun arka yüzü: olmaz
      const p = sabit(tm.verilir + 0.35)([640 + 120, 1040 - 90]);
      H.mark(K, t, tm.verilir + 0.32, tm.yaptim - 0.32, p, false);
    }
    if (sc.geri || sc.dun) H.zamanHapi(K, t, tm.geri + 0.2, tm.espri - 0.2, K.up('dün'), { y: B.top + 74, saat: 16.5 });   // geri dönüş boyunca (kısa plan dahil) ekranda
    if (sc.geri) {
      kacBalonu(K, t, tm.balon, tm.emir, [350, 600], B.ekr(necmiAgiz(t, tm)));
    }
  },
});

// ——— oda: Hikmet'in odası ———
function odaSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, hop = H.buldumHop(t, tm.buldum), dun = !!sc.dun;
  const g = H.geriDonus(t, tm.geri);
  const saat = id === 'buldum' ? H.saatSar(10.25, 7.25, g.sar) : dun ? 16.6 : 10.25;
  const kapiA = kapiAt(t, tm, id);
  M.mekanCiz(K, ODA, 'arka', t, { durum: { kapi: kapiA, saat } });
  const kol = kapiKolu(kapiA), ust = [];

  // ——— Hikmet ———
  let hp;
  if (dun) {   // kısa plan (dün): soldan koşarak girer, durur, döner, kapıyı iter
    if (t < tm.dur) hp = H.yuru('hikmet', t, S.kosO);
    else {   // durur, kapıyı iter, soluk soluğa sırtını kapıya verir (nefesle omuzlar iner kalkar), sonra bize bakar
      const bak = W(t, tm.it + 0.55, 0.3);
      hp = kisi('hikmet', { x: HX, expr: bak > 0.5 ? 'yorgun' : 'korku', head: { tilt: lerp(-6, 5, bak), look: [lerp(-0.9, 0.85, bak), lerp(0.15, 0.1, bak)] }, ...POZ.dur });
      hp.y += 7 * Math.abs(Math.sin(Math.PI * 2.4 * (t - tm.dur)));
    }
  } else { hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t); if (id === 'oda') hp.y += 7 * Math.abs(Math.sin(Math.PI * 2.4 * t)) * (1 - W(t, tm.h2a, 0.5)); }
  let hNap = null, hNot = null, hParmak = null, hIsaret = null;
  const gog = H.elYeri('hikmet', hp, 'R', 'gogus');
  if (dun && t >= tm.dur) {
    const w = W(t, tm.it - 0.28, 0.28) * (1 - W(t, tm.it + 0.6, 0.3));
    H.reach('hikmet', hp, 'L', ekle(kapiKolu(kapiA), [18, 0]), w, 'A');
  }
  if (id === 'oda') {
    // sağ el: peçetedeki baklava göğüste
    H.reach('hikmet', hp, 'R', NAP_EL(hp), 1, 'A'); hNap = 'R';
    // sol el: kapı (kare 0) → "tek" parmağı → "kaçtım"da kapıyı gösterir → h2a kapıyı aralar, kapatır → h2b avuç açık
    const kapiW = Math.max(1 - W(t, 0.5, 0.28), pw(t, tm.aralik, tm.kapat2 + 0.25, 0.28, 0.3));
    const tekW = pw(t, tm.tek - 0.05, tm.kactim - 0.3, 0.28, 0.25), gosW = pw(t, tm.kactim - 0.05, tm.h2a - 0.25, 0.25, 0.3);
    const yuk = H.elYeri('hikmet', hp, 'L', 'yukari'), gos = [HX - 150, 1110];
    if (kapiW > 0.01) H.reach('hikmet', hp, 'L', ekle(kol, [18, 0]), kapiW, 'A');
    else if (tekW > 0.01) { H.reach('hikmet', hp, 'L', [yuk[0] + 10, yuk[1] + 70], tekW, 'B'); if (tekW > 0.6) hParmak = 'L'; }
    else if (gosW > 0.01) { H.reach('hikmet', hp, 'L', gos, gosW, 'A'); if (gosW > 0.6) hIsaret = ['L', [KAPI.x + 150, 1080]]; }
    const omuz = pw(t, tm.ne - 0.2, tm.h3 - 0.15, 0.25, 0.2);
    if (omuz > 0.01) hp.armL = { sh: lerp(hp.armL.sh, 24, omuz), el: lerp(hp.armL.el, 92, omuz) };
  }
  if (id === 'bahis') {   // baklavayı Defne'ye uzatır, "senin"de masaya koyar
    const uz = W(t, tm.bu - 0.32, 0.32), koy = W(t, tm.senin - 0.3, 0.3), birak = W(t, tm.senin + 0.25, 0.35);
    const el = kar(kar(NAP_EL(hp), [660, 1130], uz), ekle(BAKM, [-6, 16]), koy);
    H.reach('hikmet', hp, 'R', el, 1 - birak, 'A');
    if (t < tm.senin + 0.25) hNap = 'R';
    if (birak < 0.5) ust.push(a => { if (t >= tm.senin - 0.3) kolUst(K, 'hikmet', hp, 'R'); });
  }
  if (id === 'not') {   // notu Defne'nin elinden alır, çevirir, masaya bırakır
    const n = notAt(t, tm, id), w = W(t, tm.al - 0.1, 0.3) * (1 - W(t, tm.yaptim + 0.15, 0.3));
    H.reach('hikmet', hp, 'R', n.yatan ? ekle(NOT_YER, [-40, -20]) : ekle(n.yer, [-74, 80]), w, 'A');
    if (n.elde === 'h' || (t >= tm.al - 0.05 && !n.yatan)) hNot = w > 0.9;
  }
  if (id === 'espri' || id === 'cta') {   // "Ne yapayım": omuz silker · "ben yemiştim": ağzının kenarını eliyle siler
    const om = pw(t, tm.h4 + 0.05, tm.yemistim - 0.25, 0.28, 0.3);
    if (om > 0.01) { hp.armL = { sh: lerp(hp.armL.sh, 24, om), el: lerp(hp.armL.el, 92, om) }; hp.armR = { sh: lerp(hp.armR.sh, 24, om), el: lerp(hp.armR.el, 92, om) }; }
    const sil = pw(t, tm.yemistim - 0.05, tm.yemistim + 0.85, 0.28, 0.3);
    if (sil > 0.01) {
      const hd = H.eklem('hikmet', hp, 'head'), ag = [hd[0] + 0.24 * hp.s, hd[1] + 0.37 * hp.s], dx = 20 * Math.sin(TAU * 2 * seg(t, tm.yemistim + 0.2, 0.5)) * (t > tm.yemistim + 0.2 && t < tm.yemistim + 0.7 ? 1 : 0);
      H.reach('hikmet', hp, 'R', [ag[0] + dx, ag[1]], sil, 'A');
    }
  }
  if (id === 'sayac') hp.head.tilt += salla(t, S.tm.cd0 + 1.75, S.tm.cd0 + 2.5, 8, 2.6);   // "olmaz" diye başını sallar
  if (id === 'oda') hp.head.tilt += salla(t, tm.cevap - 0.05, tm.cevap + 0.75, 7, 2.8);

  // ——— Defne ———
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= hop;
  let dPen = null, dNot = null, dNot2 = null, dNap = null;
  const yazar = (t0, t1) => { const u = t > t0 && t < t1 ? 1 : 0; return [PAD[0] + 46 + u * 14 * Math.sin(TAU * 3.4 * (t - t0)), PAD[1] - 26 - u * 5 * Math.abs(Math.sin(TAU * 6.8 * (t - t0)))]; };
  const penAl = (t0, t1, t2, t3) => {   // kalemi al (t0), yaz (t1..t2), bırak (t3)
    const w = W(t, t0 - 0.28, 0.28) * (1 - W(t, t3 + 0.2, 0.3)), git = W(t, t0 + 0.1, 0.35) * (1 - W(t, t3 - 0.35, 0.35));
    const el = kar(ekle(PEN, [-6, -18]), yazar(t1, t2), git);
    H.reach('defne', dp, 'R', el, w, 'A'); if (t >= t0 && t < t3) dPen = 'R';
    if (w > 0.05) ust.push(() => kolUst(K, 'defne', dp, 'R'));
  };
  if (id === 'oda') penAl(tm.h2b + 0.5, 1e9, 1e9, 1e9);
  if (id === 'bahis') penAl(tm.h3 - 1, tm.h3 + 0.15, tm.senin + 0.3, tm.d2 - 0.2);
  if (id === 'not') {
    const n = notAt(t, tm, id), w = W(t, tm.zam - 0.28, 0.25) * (1 - W(t, tm.al + 0.25, 0.3));
    H.reach('defne', dp, 'L', ekle(n.yer, [40, 86]), w, 'A');
    if (n.elde === 'd') dNot = true;
    if (w > 0.05 && t < tm.zam + 0.2) ust.push(() => kolUst(K, 'defne', dp, 'L'));
  }
  if (id === 'sayac') {
    const e = elSayac(t, tm), w = W(t, tm.sayac, 0.2) * (1 - W(t, tm.cd0 + 3.1, 0.3));
    H.reach('defne', dp, 'R', e, w, 'A');
    if (t < tm.cd0 + 0.97) dPen = 'R';
    const n2 = not2At(t, tm); if (n2 && !n2.yatan) dNot2 = true;
    if (w > 0.05 && e[1] > 1150) ust.push(() => kolUst(K, 'defne', dp, 'R'));
  }
  if (id === 'buldum') {   // Buldum: kalemli el başın yanında havaya (saçın dışında)
    const hd = H.eklem('defne', dp, 'head'), w = ease.enter(seg(t, tm.buldum - 0.05, 0.25));
    H.reach('defne', dp, 'L', [hd[0] - 205, hd[1] - 150], w, 'B'); if (w > 0.5) dPen = 'L';
  }
  if (id === 'espri' || id === 'cta') {   // ödül: baklavayı masadan alır, çağrıda yanağının yanına kaldırır
    const al = W(t, tm.h4 + 0.15, 0.28), kaldir = W(t, tm.h4 + 0.5, 0.4), cta = W(t, tm.cta + 0.05, 0.45);
    const hd = H.eklem('defne', dp, 'head'), gL = ekle(H.elYeri('defne', dp, 'L', 'gogus'), [10, 0]), yan = [hd[0] - 118, hd[1] + 70];
    const el = kar(kar(ekle(BAKM, [4, 16]), gL, kaldir), yan, cta);
    H.reach('defne', dp, 'L', el, al, 'A');
    if (t >= tm.h4 + 0.43) dNap = 'L';
    if (t < tm.h4 + 0.8 && al > 0.05) ust.push(() => kolUst(K, 'defne', dp, 'L'));
  }

  // ——— çizim ———
  const h = oyna(K, t, dun ? null : tl, 'hikmet', hp, { heads });
  kirinti(K, hp, id === 'espri' || id === 'cta' ? 1 - W(t, tm.yemistim + 0.5, 0.2) : 1);
  if ((id === 'espri' || id === 'cta') && pw(t, tm.yemistim - 0.05, tm.yemistim + 0.85, 0.28, 0.3) > 0.5) kolUst(K, 'hikmet', hp, 'R');   // silen el yüzün önünde
  let d = null;
  if (!dun) { H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof }); d = oyna(K, t, tl, 'defne', dp, { heads }); }
  M.mekanCiz(K, ODA, 'on', t);
  // masadakiler
  notBlok(K, PAD);
  if (!dPen) kalem(K, ekle(PEN, [-38, -10]), ekle(PEN, [44, 4]));
  const bahisMasada = !dun && ((id === 'bahis' && t >= tm.senin + 0.25) || ['not', 'sayac', 'buldum'].includes(id) || ((id === 'espri' || id === 'cta') && !dNap));
  if (bahisMasada) pecete(K, BAKM);
  if (id === 'sayac' || id === 'buldum' || id === 'espri' || id === 'cta') notYatan(K, NOT_YER, { arka: true });
  if (id === 'buldum' || id === 'espri' || id === 'cta' || (id === 'sayac' && not2At(t, tm)?.yatan)) notYatan(K, NOT_YER2, { yazi: K_UP_KIM });
  if (id === 'not') { const n = notAt(t, tm, id); if (n.yatan) notYatan(K, NOT_YER, { arka: true }); }
  // eldekiler
  for (const f of ust) f({ h, d });
  if (hNap) { const e = h.handR, k = id === 'bahis' ? lerp(1.7, 1, W(t, tm.senin - 0.3, 0.3)) : 1.7; pecete(K, [e[0] + 4, e[1] - 26 * k], { k }); H.grip(K, 'hikmet', [e[0] - 30 * k, e[1] - 22 * k], hp.s); }
  if (hParmak) h.parmak('L', 1, { toplam: 1, ac: 0.3 });
  if (hIsaret) h.isaret(hIsaret[0], hIsaret[1]);
  if (dPen && d) { const e = dPen === 'L' ? d.handL : d.handR; if (dPen === 'L') kalem(K, ekle(e, [18, 30]), ekle(e, [-22, -46])); else kalem(K, ekle(e, [26, -40]), ekle(e, [-16, 22])); d.tut(dPen); }
  if (id === 'not') {
    const n = notAt(t, tm, id);
    if (!n.yatan) { notKagidi(K, n.yer, { yazi: n.yazi, sx: n.sx, rot: n.elde === 'd' ? -0.06 : 0.04 }); if (dNot && d) d.tut('L'); if (hNot) h.tut('R'); }
  }
  if (dNot2 && d) { const n2 = not2At(t, tm); notKagidi(K, n2.yer, { yazi: K_UP_KIM, rot: 0.06, boy: 150 }); d.tut('R'); }
  if (dNap && d) { const e = d.handL, u = W(S.tm.h4 + 0.5, 0, 1) * 0 + W(t, tm.h4 + 0.5, 0.4), k = lerp(1, 1.5, u); pecete(K, [e[0] - 4 + 10 * u, e[1] - 16 - 18 * u], { k }); H.grip(K, 'defne', [e[0] - 4 - 26 * u, e[1] - 12 - 18 * u], dp.s); }
  if (dun && t >= tm.dur && W(t, tm.it - 0.28, 0.28) > 0.9 && t < tm.it + 0.6) h.tut('L');
  if (id === 'oda' && Math.max(1 - W(t, 0.5, 0.28), pw(t, tm.aralik, tm.kapat2 + 0.25, 0.28, 0.3)) > 0.9) h.tut('L');
}

// ——— ocak: bugün (ipucu) · dün (geri dönüş) ———
function ocakSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, geri = !!sc.geri;
  M.mekanCiz(K, OCK, 'arka', t, { durum: { saat: geri ? 16.5 : 10.4 } });
  if (!geri) {
    // bugün: Necmi tezgâhın arkasında; maşayla şekerlikten bir küp alır, "tek kelimeyle"de yüzünün yanına kaldırır, kaşları kalkar
    const kas = { ...H.EXPR.mutlu, brow: 0.17, browTilt: -0.35, eye: 1.05, smileEyes: false, curve: 0.45, open: 0.1 };
    const np = kisi('necmi', { x: NEC_X, expr: t > tm.tekN - 0.1 ? kas : 'mutlu', head: { tilt: t > tm.tekN - 0.1 ? 7 : 3, look: t > tm.n1 - 0.4 ? [0, 0.05] : [0.35, 0.65] }, ...POZ.dur });
    const dal = W(t, tm.ipucu + 0.05, 0.3), cik = W(t, tm.ipucu + 0.45, 0.38), kalk = W(t, tm.tekN - 0.3, 0.38);
    const gog = ekle(H.elYeri('necmi', np, 'R', 'gogus'), [30, -40]), hd = H.eklem('necmi', np, 'head');
    const elR = kar(kar(kar([NEC_X + 110, 1150], [SEKER[0] + 8, 1050], dal), [NEC_X + 120, 1010], cik), [hd[0] + 175, hd[1] - 10], kalk);
    const sal = salla(t, tm.sorarim - 0.05, tm.sorarim + 0.6, 10, 2.6);
    H.reach('necmi', np, 'R', [elR[0], elR[1] + sal], 1, 'B');
    H.reach('necmi', np, 'L', [CAYT[0] + 96, 1200], 1, 'A');
    const a = oyna(K, t, tl, 'necmi', np, { heads });
    tezgah(K);
    caydanlik(K, CAYDAN, t); cayTepsisi(K, CAYT, { n: 3, t }); sekerlik(K, SEKER); baklavaTepsisi(K, TEPSI, 1);
    kolUst(K, 'necmi', np, 'L');
    const kupVar = t > tm.ipucu + 0.36, e = a.handR;
    const mk = lerp(1.15, 1.3, kalk); masa(K, e, [e[0] - 10 + 70 * kalk, e[1] + 150 * lerp(1, 0.72, kalk)], { kupVar, ac: kupVar ? 0 : 0.6, k: mk }); a.tut('R');
    return;
  }
  // ——— dün: Hikmet tepsinin başında gizlice yer; Necmi elinde çay tepsisi ve maşayla soldan girer ———
  const np = necmiDun(t, tm);
  const yan = np.view === 'side';
  let hp;
  const kos = t >= S.kosG.t0;
  if (kos) hp = H.yuru('hikmet', t, S.kosG);
  else {
    const don = W(t, tm.sekeri + 0.25, 0.25), kork = t > tm.balon - 0.05;
    hp = kisi('hikmet', { x: HIK_G, expr: kork ? 'korku' : 'mutlu', head: { tilt: lerp(-3, -5, don), look: [lerp(0.25, -0.9, don), lerp(0.7, 0.15, don)] }, ...POZ.dur });
    hp.talk = kork ? 0 : 0.35 * Math.abs(Math.sin(TAU * 1.6 * t)) * (1 - don);   // çiğner
  }
  // Hikmet'in eli: baklava ağzında (çenede) → emirde tepsiye bırakır
  let hBak = null;
  if (!kos) {
    const hd = H.eklem('hikmet', hp, 'head'), cene = [hd[0] + 72, hd[1] + 128], dus = W(t, tm.emir + 0.02, 0.24);
    const el = kar(ekle(cene, [0, 8 * Math.abs(Math.sin(TAU * 1.6 * t)) * (1 - W(t, tm.sekeri, 0.3))]), [TEPSI[0] + 20, TEPSI[1] - 26], dus);
    H.reach('hikmet', hp, 'R', el, 1 - W(t, tm.birak + 0.05, 0.3), 'A');
    if (t < tm.birak) hBak = 'R';
  }
  // Necmi: yürürken tepsi yakın elde; durunca tepsi sağ elde, maşa sol elde başının yanında
  if (yan) H.reach('necmi', np, 'R', [np.x + 96, 1236], 1, 'A');
  else {
    const hd = H.eklem('necmi', np, 'head'), kalk = ease.enter(seg(t, tm.nVar + 0.05, 0.38));
    H.reach('necmi', np, 'R', [np.x + 128, 1246], 1, 'A');
    H.reach('necmi', np, 'L', kar([np.x - 110, 1170], [hd[0] - 150, hd[1] - 20], kalk), 1, 'B');
  }
  const a = oyna(K, t, null, 'necmi', np, { heads, sessiz: true });
  const hk = oyna(K, t, null, 'hikmet', hp, { heads, sessiz: true });
  kirinti(K, hp, 1);
  tezgah(K);
  caydanlik(K, CAYDAN, t); baklavaTepsisi(K, TEPSI, t < tm.birak ? 6 : 7);
  if (hBak) { const e = hk.handR; baklava(K, [e[0] - 18, e[1] - 26], 1.05, 0.3); hk.tut('R'); }
  if (yan) { const e = a.handR; cayTepsisi(K, [e[0] + 20, e[1] - 6], { n: 2, t, buhar: true }); a.tut('R'); }
  else {
    const eR = a.handR, eL = a.handL;
    cayTepsisi(K, [eR[0] - 10, eR[1] - 6], { n: 2, t }); a.tut('R');
    masa(K, eL, [eL[0] + 8, eL[1] + 130], { kupVar: true, k: 1.4 }); a.tut('L');
  }
}
// Dünkü Necmi (kol uzanışlarından önce): soldan yürüyerek girer, tepsinin önünde önden durur
function necmiDun(t, tm) {
  if (t < tm.nVar) return H.yuru('necmi', t, { t0: tm.nGir, t1: tm.nVar, x0: OX + 40, x1: NEC_G, poz: { expr: 'mutlu', head: { tilt: 3, look: [0.7, 0.2] } } });
  const sas = t > tm.siz;
  return kisi('necmi', { x: NEC_G, expr: sas ? 'saskin' : { ...H.EXPR.notr, brow: 0.12, browTilt: -0.3, curve: 0.3 }, head: { tilt: sas ? 6 : 8, look: [0.95, 0.1] }, ...POZ.dur });
}
function necmiAgiz(t, tm) { const np = necmiDun(t, tm), hd = H.eklem('necmi', np, 'head'); return [hd[0] + (np.view === 'side' ? 30 : 0), hd[1] - 150]; }
