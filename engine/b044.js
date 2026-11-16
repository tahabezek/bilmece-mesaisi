// Bölüm 44 · ŞERBETLİ YÜZLER (amiral gemisi; v4 "hikâye" dili; storyboard: hikayeler/bolum_044_serbet.md, yapı A: sondan başla).
// Logline: Hikmet Bey'in doğum gününde Defne'nin de Necmi'nin de yanağına baklava şerbeti bulaşır. Ayna yok, konuşmak yasak.
// İlk sayışta kimse kıpırdamaz, ikinci sayışta ikisi birden elini kaldırır.
// Akılda kalacak tek şey: kimsenin kıpırdamaması da bir bilgidir.
// Yeni dil: sondan başlama (kanca = ikinci sayış), geri sarma (her nesne durumunu etkin zamandan okur: nesneAt(tE); tE
// geri akınca her şey kendi yolunu tersinden izler), yavaş çekim (dünya saati 0,25x), iki ters açılı omuz üstü plan (ayrı
// setler; ön plandaki karakter kart paletinden arkadan çizilir), hayal/gerçek bölünmüş ekran (üst yarı hardal tonlu
// hayalet dünya, alt yarı gerçek; ikisi de ilk sayışı d4'ün kelimelerine kilitli oynatır), döngü dikişi (geri çağırmada
// kanca karesinin aynı pozu ve kadrajı).
// Zaman: t video saati, tE etkin (hikâye) saat. Kanca tE = tR + t (tekrarın aynı anı), donma tE sabit, geri sarma tE
// tR + 0,9'dan 2,6'ya iner, sonra tE = t. Kerem (genc kartı, 0,82 ölçek, masanın arkasında) her planda biraz daha şerbetli.
// Her kare t'nin saf fonksiyonudur; Math.random yok, kareler arası durum yok. Anlar ses çizelgesindeki kelime çapalarından.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const ODA = 'b044_oda';   // tek oda; omuz üstü planlar aynı odayı yakın kamerayla gösterir, ön plandaki kişi arkadan çizilir
const HX = 100, DX = 480, NX = 900, KX = 1110, K_S = 190, K_Y = 1440;   // Kerem arkada: 0,82 ölçek, zemini masanın arkasında
const MASA = 1232, MASA_X0 = 30, MASA_X1 = 1560;              // örtülü uzun masa: üst yüzün ön kenarı
const PASTA = [690, MASA - 16], TEPSI = [690, MASA - 8], KCAY = [1196, MASA - 2], HCAY = [236, MASA - 2];   // pasta ikilinin arasında, tepsinin arkasında
const AYNA = { x: -120, y: 905, w: 150, h: 196 }, SAAT = [985, 845, 46];
// Kadrajlar: bütün masa planları ≥ 1,3x; yüzler ekranda y 650–950, masanın kenarı y ≤ 1150 (boş zemin yok)
const DUO = [1.4, 690, 1107], DUO2 = [1.46, 690, 1100], DUO_G = [1.32, 668, 1110], HIK = [1.35, 200, 985];
// Şerbet: bal kehribarı (Defne'nin altın küpesinden ayrışsın), koyu kenar, beyaz parlama
const AMBER = '#C8651E', AMBER_K = '#73330B', PARLAK = '#FFFFFF', HARDAL = '#E0A82E';
const BAK_UST = '#E3A94C', BAK_ON = '#B8742C', FISTIK = '#7FA443';
// Yüz üstündeki şerbet: başın yerel biriminde (U), önden görünüş. İç yanaklar: Defne'nin sol yanağı ekranın sağında, Necmi'nin
// sağ yanağı ekranın solunda; ikisi de karşıdakine bakar, ikisi de kameradan görünür.
const YANAK = { defne: [0.2, 0.31], necmi: [-0.22, 0.32] };   // yanağın ağız kenarına yakın yeri: gözyaşı gibi okunmaz; küpeden ve gözlükten uzak

// ——— küçük yardımcılar ———
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const ekle = (p, d) => [p[0] + d[0], p[1] + d[1]];
// Yüzde nokta (dünya): başın merkezine göre U biriminde; başın eğimi ve baş sallama (nod) ile birlikte döner
function yuzNokta(key, p, lx, ly) {
  const hd = H.eklem(key, p, 'head'), s = p.s, r = (p.head.tilt || 0) * D2R, c = Math.cos(r), sn = Math.sin(r);
  ly += (p.head.nod || 0) * 0.055;
  return [hd[0] + (lx * c - ly * sn) * s, hd[1] + (lx * sn + ly * c) * s];
}
// Monoton kübik eğri (uçlarda hız sıfır): pts = [[u, e], …]. Geri sarmanın hız profili.
function egri(pts, u) {
  const n = pts.length;
  if (u <= pts[0][0]) return pts[0][1];
  if (u >= pts[n - 1][0]) return pts[n - 1][1];
  const d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  m.push(0); for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2); m.push(0);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  let i = 0; while (u > pts[i + 1][0]) i++;
  const h = pts[i + 1][0] - pts[i][0], s = (u - pts[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * pts[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * pts[i + 1][1] + (s3 - s2) * h * m[i + 1];
}
// Geri sarma: önce eller yavaşça iner, orta bölüm hızla akar, sonda damlaların baklavaya dönüşü yeniden yavaşlar
const GERI = [[0, 0], [0.25, 0.06], [0.55, 0.8], [0.8, 0.93], [1, 1]];
// Etkin zaman: kanca tekrarın aynı anı, donma sabit, geri sarma iner, sonra video saati
const etkin = (t, tm) => t < tm.don ? tm.tR + t : t < tm.sar0 ? tm.tR + tm.don : t < tm.sar1 ? lerp(tm.tR + tm.don, tm.sar1, egri(GERI, (t - tm.sar0) / (tm.sar1 - tm.sar0))) : t;
// Dünya saati (alevler, buhar, balonlar, saniye kolu): yavaş çekimde 0,25x, çıkışta 0,4 sn'de hızlanır (kapalı form)
function dunyaSaati(tE, tm) {
  const a = tm.yavas0, b = tm.yavas1, r = 0.4;
  if (tE <= a) return tE;
  let m = Math.min(tE, b) - a;
  if (tE > b) { const x = Math.min(tE - b, r); m += x - x * x / (2 * r); }
  return tE - 0.75 * m;
}

// ═══════════════════════════ Nesne durumları (tE'nin saf fonksiyonları; geri sarma bunları ters okur) ═══════════════════════════
const mumBoy = (tE, tm) => 1 - 0.022 * (Math.min(tE, tm.tR + tm.don) - 2.6);   // mumlar erir; kanca anında (0,62) durur
// Duvar saati: hikâyenin başı 14:59:00, kanca (ikinci sayış) tam 15:00:00 ("1 DAKİKA ÖNCE" hapı saatle tutar); sonra gerçek hız
function saatAt(tE, tm) {
  const a = tm.sar1, b = tm.tR + tm.don, sn = tE <= b ? 60 * (tE - a) / (b - a) : 60 + (tE - b);
  return { sn, saat: 14 + 59 / 60 + sn / 3600 };
}
// Ayna: Hikmet "yok" derken ters çevirir (0 cam önde → 1 arkası dönük)
const aynaAt = (tE, tm) => ease.state(seg(tE, tm.aynaCevir, tm.aynaTak - tm.aynaCevir));
// Kerem'in lokmaları (hikâye saati): her lokmada yüzüne bir şerbet lekesi daha; kaplama sayaçtan sonra artar
// Kerem oyuna katılmaz: iki sayış boyunca yüzü temizdir (Necmi'nin akıl yürütmesini bozmasın); şerbet sayaçta son baklavayı
// yerken bulaşmaya başlar, sonra her planda artar. Lokma ve dilim anları build()'de ses çizelgesine göre kurulur (S.kLokma, S.kAl).
const keremLeke = (tE, S) => S.kLokma.filter(b => b >= S.tm.cd0 + 1 && tE >= b + 0.05).length;
const keremKaplama = (tE, S) => clamp01((tE - S.tm.cd0 - 5.5) / 16);
const keremTabak = (tE, S) => Math.max(0, 3 - S.kAl.filter(a => tE >= a + 0.18).length);

// ═══════════════════════════ Çizim parçaları ═══════════════════════════
// Baklava dilimi: (x, y) üst yüzün ortası; k = 1'de 64 px en. isir: ısırılmış (ön uç eksik, kesitte açık katlar görünür)
function baklava(K, [x, y], k = 1, { rot = 0, isir = 0 } = {}) {
  const { ctx } = K, w = 32 * (1 - 0.38 * isir), h = 13 * (1 - 0.2 * isir), d = 15;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  K.poly([[-w, 0], [0, h], [w, 0], [w, d], [0, h + d], [-w, d]], BAK_ON, LW * 0.6);
  for (const f of [0.35, 0.65]) { K.line(-w + 3, d * f + 1, 0, h + d * f, 2.4, '#94561F'); K.line(0, h + d * f, w - 3, d * f + 1, 2.4, '#94561F'); }
  K.poly([[-w, 0], [0, -h], [w, 0], [0, h]], BAK_UST, LW * 0.6);
  K.ell(0, 0, 9 * (1 - 0.3 * isir), 4, FISTIK, 0); K.circ(-4, -1, 2.4, '#A9C866', 0);
  if (isir > 0.02) { K.ell(w - 2, d * 0.5, 7, d * 0.62, '#F1D18E', LW * 0.45); for (const f of [0.3, 0.62]) K.line(w - 7, d * f, w + 3, d * f, 2, '#C98B3A'); }
  ctx.restore();
}
// Baklava tepsisi (masada): n kalan dilim; Defne ön soldan, Necmi ön sağdan alır
const TEPSI_YER = [[-56, -6], [0, -10], [56, -6], [-30, 9], [30, 9], [86, 4]];
function tepsi(K, [x, y], { alD = false, alN = false } = {}) {
  K.ell(x + 5, y + 8, 112, 26, INK, 0); K.ell(x, y, 112, 26, '#C9B37A', LW * 0.8); K.ell(x, y - 3, 96, 20, '#E2D3A0', LW * 0.5);
  TEPSI_YER.forEach(([dx, dy], i) => {
    if ((i === 3 && alD) || (i === 4 && alN)) { K.circ(x + dx - 6, y + dy - 2, 3, BAK_UST, 0); K.circ(x + dx + 5, y + dy + 1, 2.4, FISTIK, 0); return; }
    baklava(K, [x + dx, y + dy - 12], 0.74);
  });
}
const TEPSI_D = [TEPSI[0] - 30, TEPSI[1] - 3], TEPSI_N = [TEPSI[0] + 30, TEPSI[1] - 3];
// Doğum günü pastası (Hikmet'in önünde): krema gövde, mercan akıntı, dört mum (tE ile kısalır, alev dünya saatiyle titrer)
function pasta(K, [x, y], boy, Wt) {
  const { ctx } = K, w = 136, h = 70, top = y - h;
  K.ell(x + 6, y + 6, 88, 16, INK, 0); K.ell(x, y, 88, 16, PAL.cream, LW * 0.8);
  K.rect(x - w / 2, top, w, h, '#F6E2CF', LW, 16);
  K.line(x - w / 2 + 6, top + h * 0.56, x + w / 2 - 6, top + h * 0.56, 4, '#E7C2A6');
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, top, w, h, 16); ctx.clip();
  ctx.beginPath(); ctx.moveTo(x - w / 2 - 4, top - 4); ctx.lineTo(x + w / 2 + 4, top - 4);
  const sir = [[0.92, 20], [0.78, 11], [0.63, 26], [0.48, 14], [0.33, 24], [0.18, 10]];
  ctx.lineTo(x + w / 2 + 4, top + 16);
  for (const [f, dy] of sir) { const xx = x - w / 2 + w * f; ctx.quadraticCurveTo(xx + 10, top + 14, xx + 6, top + 14 + dy); ctx.quadraticCurveTo(xx, top + 20 + dy, xx - 6, top + 14 + dy); ctx.quadraticCurveTo(xx - 10, top + 14, xx - 16, top + 16); }
  ctx.lineTo(x - w / 2 - 4, top + 16); ctx.closePath(); K.fs(PAL.coral, LW * 0.7);
  ctx.restore();
  K.rect(x - w / 2, top, w, h, null, LW, 16);
  for (const [dx, dy, c] of [[-44, 44, PAL.teal], [-12, 54, PAL.mustard], [24, 42, PAL.teal], [48, 56, PAL.mustard]]) K.rect(x + dx - 6, top + dy - 2, 12, 5, c, 0, 2);
  for (let i = 0; i < 4; i++) H.mum(K, x - 45 + i * 30, top + 4, 0.74, { h: boy, on: true, t: Wt, i });
}
// İnce belli çay bardağı (034 gövdesi): (x, y) taban ortası; buhar dünya saatiyle
const GOVDE = [[-18, -62], [18, -62], [11, -36], [19, -11], [13, -2], [-13, -2], [-19, -11], [-11, -36]];
function cayBardagi(K, x, y, k, Wt) {
  const { ctx } = K, yol = c => { GOVDE.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.closePath(); };
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.ell(0, 0, 34, 9, PAL.cream, 6 / k * 0.7 + 0.4);
  ctx.beginPath(); yol(ctx); ctx.fillStyle = 'rgba(244,237,224,0.34)'; ctx.fill();
  H.sivi(K, yol, [-18, -62, 36, 60], { seviye: 0.74, renk: '#A5491A' });
  ctx.beginPath(); yol(ctx); K.fs(null, Math.max(0.8, 6.5 / k));
  K.line(-12, -54, -9, -20, Math.max(0.9, 4 / k), 'rgba(255,255,255,0.7)');
  ctx.restore();
  H.buhar(K, x, y - 70 * k, Wt, { k: 0.55, n: 2, ara: 22, boy: 80 });
}
// Duvar aynası: u = 0 cam önde, 1 arkası dönük (dikey eksende döner; Hikmet sağ kenarından tutar)
function aynaCiz(K, u) {
  const { x, y, w, h } = AYNA, { ctx } = K, c = Math.cos(Math.PI * clamp01(u)), a = Math.max(0.035, Math.abs(c));
  K.line(x - w * 0.3 * a, y - h / 2 + 4, x, y - h / 2 - 58, 4); K.line(x + w * 0.3 * a, y - h / 2 + 4, x, y - h / 2 - 58, 4); K.circ(x, y - h / 2 - 58, 7, '#5A615E', 3);
  ctx.save(); ctx.translate(x, y); ctx.scale(a, 1);
  if (c >= 0) {
    K.rect(-w / 2 + 7, -h / 2 + 9, w, h, INK, 0, 14);
    K.rect(-w / 2, -h / 2, w, h, PAL.woodDark, LW, 14);
    K.rect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, '#CFE3E1', LW * 0.7, 8);
    K.line(-w / 2 + 34, -h / 2 + 74, -w / 2 + 78, -h / 2 + 30, 8, '#F4FAF8'); K.line(-w / 2 + 34, -h / 2 + 116, -w / 2 + 106, -h / 2 + 44, 5, '#F4FAF8');
  } else {
    K.rect(-w / 2, -h / 2, w, h, '#B8946A', LW, 14);
    K.line(-w / 2 + 22, -h / 2 + 22, w / 2 - 22, h / 2 - 22, 9, '#DCC8A0'); K.line(w / 2 - 22, -h / 2 + 22, -w / 2 + 22, h / 2 - 22, 9, '#DCC8A0');
  }
  ctx.restore();
}
// Arka duvardaki afiş: "İYİ Kİ DOĞDUN / MÜDÜR BEY" (K.up ile tr-TR; noktalı İ). İki iple asılı.
function afis(K) {
  const { ctx } = K, cx = 690, y0 = 600, y1 = 764;
  ctx.font = '900 58px Rubik'; const tw = ctx.measureText(K.up('iyi ki doğdun')).width, w = tw + 110, x0 = cx - w / 2, x1 = cx + w / 2;
  K.line(x0 + 40, y0 + 6, x0 + 10, 380, 4); K.line(x1 - 40, y0 + 6, x1 - 10, 380, 4);
  K.rect(x0 + 9, y0 + 11, w, y1 - y0, INK, 0, 16);
  K.rect(x0, y0, w, y1 - y0, PAL.cream, LW, 16);
  ctx.save(); ctx.beginPath(); ctx.roundRect(x0 + 13, y0 + 13, w - 26, y1 - y0 - 26, 9); ctx.setLineDash([16, 11]); ctx.lineWidth = 5; ctx.strokeStyle = PAL.mustard; ctx.stroke(); ctx.restore();
  K.text(K.up('iyi ki doğdun'), cx, y0 + 84, 58, PAL.coral, 900);
  K.text(K.up('müdür bey'), cx, y0 + 141, 48, INK, 900);   // 0,95x geniş planda da ≥ 44 px
}
// Bayrak dizisi: duvarın üstünde sarkan ip, renkli üçgenler
function bayraklar(K) {
  const R = [PAL.coral, PAL.mustard, PAL.teal, PAL.cream];
  for (const [a, b, yy, sag] of [[-420, 470, 470, 52], [470, 1500, 455, 58]]) {
    const n = Math.round((b - a) / 74), yAt = u => yy + sag * 4 * u * (1 - u);
    K.ctx.beginPath(); for (let i = 0; i <= 24; i++) { const u = i / 24; i ? K.ctx.lineTo(lerp(a, b, u), yAt(u)) : K.ctx.moveTo(a, yAt(0)); } K.ctx.lineWidth = 4; K.ctx.strokeStyle = INK; K.ctx.stroke();
    for (let i = 0; i < n; i++) { const u0 = (i + 0.12) / n, u1 = (i + 0.88) / n, um = (i + 0.5) / n; K.poly([[lerp(a, b, u0), yAt(u0)], [lerp(a, b, u1), yAt(u1)], [lerp(a, b, um), yAt(um) + 62]], R[i % 4], 4); }
  }
}
// Balonlar (tavanda, iplerinin ucu sarkık): yalnız balonlar hafifçe salınır (karakterler boşta sallanmaz)
const BALON = [[292, 520, PAL.coral, 0], [356, 498, PAL.mustard, 1.7], [1002, 505, PAL.teal, 3.1], [1062, 484, PAL.coral, 4.4]];
function balonlar(K, Wt) {
  const { ctx } = K;
  for (const [x0, y0, c, f] of BALON) {
    const dx = 7 * Math.sin(Wt * 0.8 + f), dy = 4 * Math.sin(Wt * 1.1 + f * 1.3), x = x0 + dx, y = y0 + dy, r = (f * 7) % 4;
    ctx.save(); ctx.beginPath(); ctx.moveTo(x, y + 60); for (let i = 1; i <= 10; i++) { const v = i / 10; ctx.lineTo(x - dx * v * 0.6 + 9 * Math.sin(v * 7 + f + Wt * 0.6), y + 60 + 190 * v); } ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    K.poly([[x - 8, y + 62], [x + 8, y + 62], [x, y + 50]], c, 3.5);
    ctx.save(); ctx.translate(x, y); ctx.rotate((dx * 0.012) + (r - 1.5) * 0.04);
    K.ell(0, 0, 44, 54, c, LW * 0.8);
    ctx.beginPath(); ctx.arc(-6, -6, 30, Math.PI * 1.05, Math.PI * 1.4); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.stroke();
    ctx.restore();
  }
}
// Örtülü masa: üst şerit + önden sarkan örtü (fistolu etek, puantiye) + örtünün altından ayaklar
function masaCiz(K) {
  const { ctx } = K, x0 = MASA_X0, x1 = MASA_X1, yb = 1404;
  for (const lx of [x0 + 70, x1 - 70]) K.rect(lx - 13, yb - 10, 26, 1500 - yb + 10, PAL.woodDark, LW, 4);
  ctx.beginPath(); ctx.moveTo(x0, MASA); ctx.lineTo(x1, MASA); ctx.lineTo(x1, yb);
  const n = Math.round((x1 - x0) / 78);
  for (let i = n; i > 0; i--) { const xa = x0 + i * (x1 - x0) / n, xb = x0 + (i - 1) * (x1 - x0) / n; ctx.quadraticCurveTo((xa + xb) / 2, yb + 34, xb, yb); }
  ctx.closePath(); K.fs('#EFE5D2', LW);
  ctx.save(); ctx.clip();
  K.rect(x0, MASA + 38, x1 - x0, 16, PAL.coral, 0); K.rect(x0, MASA + 60, x1 - x0, 6, PAL.teal, 0);
  for (let r = 0; r < 3; r++) for (let x = x0 + 40 + (r % 2) * 48; x < x1; x += 96) K.circ(x, MASA + 100 + r * 44, 6, '#E2CDB0', 0);
  ctx.restore();
  K.rect(x0 - 12, MASA - 30, x1 - x0 + 24, 34, '#F7F0E2', LW, 8);
}
// Şerbet damlası (yanakta ya da havada): bal kehribarı gözyaşı, koyu kenar, beyaz parlama beneği, altında kısa akıntı izi.
// iz = süzülme izi (px, yukarı doğru; sayaçta), akinti: alttaki kısa akıntı (yanakta 1, havada 0)
function serbet(K, [x, y], r, { iz = 0, rot = 0, uzun = 1, a = 1, akinti = 1 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
  if (iz > 1.5) { ctx.globalAlpha = a * 0.8; K.line(x, y - iz, x, y, r * 0.75, AMBER); ctx.globalAlpha = a; }
  if (akinti > 0.02) {   // altta yanağa yapışık, incelerek biten kısa akıntı (ucunda boncuk yok)
    const L = r * 1.05 * akinti;
    ctx.beginPath(); ctx.moveTo(x - r * 0.32, y + r * 0.62); ctx.quadraticCurveTo(x - r * 0.1, y + r * 0.95 + L * 0.5, x + r * 0.08, y + r * 0.7 + L);
    ctx.quadraticCurveTo(x + r * 0.3, y + r * 0.9 + L * 0.3, x + r * 0.42, y + r * 0.58); ctx.closePath();
    ctx.fillStyle = AMBER; ctx.fill(); ctx.lineWidth = Math.max(2.5, r * 0.2); ctx.strokeStyle = AMBER_K; ctx.lineJoin = 'round'; ctx.stroke();
  }
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1 / Math.sqrt(uzun), uzun);
  ctx.beginPath(); ctx.moveTo(0, -r * 1.45); ctx.bezierCurveTo(r * 0.55, -r * 0.75, r * 1.05, -r * 0.05, r * 0.88, r * 0.55); ctx.quadraticCurveTo(0, r * 1.25, -r * 0.88, r * 0.55); ctx.bezierCurveTo(-r * 1.05, -r * 0.05, -r * 0.55, -r * 0.75, 0, -r * 1.45);
  ctx.fillStyle = AMBER; ctx.fill(); ctx.lineWidth = Math.max(3, r * 0.26); ctx.strokeStyle = AMBER_K; ctx.lineJoin = 'round'; ctx.stroke();
  K.ell(-r * 0.28, -r * 0.12, r * 0.24, r * 0.32, PARLAK, 0, -0.35);
  K.circ(r * 0.3, r * 0.42, r * 0.09, PARLAK, 0);
  ctx.restore();
}
// Damla ezilmesi (yanağa konduğu an): kısa süre yassılaşır, sonra yuvarlanır (sekme yok)
const ezil = (tE, tKon) => tE < tKon ? 1 : 1 - 0.32 * (1 - ease.enter(seg(tE, tKon, 0.22)));
// Mürekkep halka (omuz üstü planda damlanın çevresinde nabız atar)
function halka(K, [x, y], r, nab) {
  const { ctx } = K; ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = HARDAL;
  ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(x, y, r * (1 + 0.22 * nab), 0, TAU); ctx.stroke();
  if (nab > 0.02) { ctx.globalAlpha = 0.55 * nab; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r * (1.35 + 0.4 * nab), 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// Kerem'in yüzündeki şerbet: n leke (tohumlu yerler) + kaplama (sona doğru bütün yüz)
const K_LEKE_YER = [[-0.2, 0.26, 0.09], [0.12, 0.36, 0.08], [0.24, 0.14, 0.07], [-0.08, 0.42, 0.1], [-0.3, 0.06, 0.06], [0.3, 0.3, 0.07], [0.02, 0.2, 0.06], [-0.24, 0.4, 0.07], [0.18, -0.05, 0.06], [-0.12, -0.12, 0.06], [0.06, 0.5, 0.08], [0.32, -0.12, 0.05]];
function keremSerbet(K, kp, tE, S) {
  const n = keremLeke(tE, S), kap = keremKaplama(tE, S), { ctx } = K;
  if (n === 0 && kap <= 0) return;
  const hd = H.eklem('genc', kp, 'head'), s = kp.s, r = (kp.head.tilt || 0) * D2R;
  ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate(r); ctx.scale(s, s);
  if (kap > 0) {   // bütün yüz: başın biçimine kırpılmış yarı saydam kehribar
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0.06, 0.4, 0.5, 0, 0, TAU); ctx.clip();
    ctx.globalAlpha = 0.62 * kap; ctx.fillStyle = AMBER;
    ctx.beginPath(); ctx.moveTo(-0.5, -0.05 + 0.2 * (1 - kap)); for (let i = 0; i <= 10; i++) { const u = i / 10; ctx.lineTo(-0.5 + u, -0.05 + 0.2 * (1 - kap) + 0.05 * Math.sin(u * 9)); } ctx.lineTo(0.5, 0.7); ctx.lineTo(-0.5, 0.7); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 0.75 * kap; ctx.lineCap = 'round'; ctx.strokeStyle = PARLAK; ctx.lineWidth = 0.035;   // parlak yansıma
    ctx.beginPath(); ctx.arc(-0.08, 0.1, 0.24, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.85 * kap; ctx.lineCap = 'round';   // çeneden sarkan iki damla
    for (const [dx, L] of [[-0.12, 0.13], [0.1, 0.09]]) { ctx.beginPath(); ctx.moveTo(dx, 0.5); ctx.lineTo(dx, 0.5 + L * kap); ctx.lineWidth = 0.05; ctx.strokeStyle = AMBER; ctx.stroke(); ctx.beginPath(); ctx.arc(dx, 0.5 + L * kap, 0.035, 0, TAU); ctx.fillStyle = AMBER; ctx.fill(); }
    ctx.restore();
  }
  const nGor = Math.round(Math.min(n, K_LEKE_YER.length) * (1 - 0.55 * kap));
  for (let i = 0; i < nGor; i++) {
    const [lx, ly, rr] = K_LEKE_YER[i];
    ctx.save(); ctx.globalAlpha = 0.88; ctx.beginPath(); ctx.ellipse(lx, ly, rr, rr * 0.78, i * 0.7, 0, TAU); ctx.fillStyle = AMBER; ctx.fill(); ctx.lineWidth = 0.014; ctx.strokeStyle = AMBER_K; ctx.stroke();
    ctx.globalAlpha = 1; ctx.beginPath(); ctx.ellipse(lx - rr * 0.3, ly - rr * 0.25, rr * 0.25, rr * 0.18, -0.4, 0, TAU); ctx.fillStyle = PARLAK; ctx.fill(); ctx.restore();
  }
  ctx.restore();
}
// Önkol + el, masanın üstüne (masa karakterlerden sonra çizilir; masaya dayanan el örtünün üstünde görünür)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Peçete (Defne'nin çağrısında yanağını siler)
function pecete(K, [x, y], k = 1, rot = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  K.poly([[-34, -26], [30, -32], [36, 24], [-28, 30]], PAL.cream, LW * 0.6); K.line(-18, -18, 22, 18, 3, '#E2D6C0');
  ctx.restore();
}
// Arkadan görünüş (omuz üstü planın ön planı): kart paletinden baş arkası, boyun, omuzlar. Yüz yok; kimlik izleri:
// Defne'de uzun dalgalı saç, fular ve altın halka küpe; Necmi'de açık tepe, kır saç kuşağı, kulak arkasındaki kalem.
function sirt(K, key, [hx, hy], s, { tilt = 0 } = {}) {
  const c = H.CARDS[key], { ctx } = K, lw = c.line, w = c.head.w / 2, h = c.head.h / 2, sw = c.torso.shoulder / 2 + (key === 'defne' ? 0.34 : 0.12);
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt * D2R); ctx.scale(s, s);
  const fs = (fill, l = lw) => { ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = l; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); };
  // omuzlar ve sırt
  ctx.beginPath(); ctx.moveTo(-sw - 0.2, 2.2); ctx.lineTo(-sw - 0.08, 1.0); ctx.quadraticCurveTo(-sw, 0.66, -0.2, 0.6); ctx.lineTo(0.2, 0.6); ctx.quadraticCurveTo(sw, 0.66, sw + 0.08, 1.0); ctx.lineTo(sw + 0.2, 2.2); ctx.closePath(); fs(c.torso.color);
  ctx.beginPath(); ctx.moveTo(0, 0.72); ctx.lineTo(0, 2.2); ctx.lineWidth = lw * 0.6; ctx.strokeStyle = c.torso.shade; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-0.11, 0.3, 0.22, 0.38, 0.06); fs(c.skin);
  if (key === 'defne') {
    ctx.beginPath(); ctx.ellipse(0, 0.62, 0.26, 0.08, 0, 0, TAU); fs(c.scarf);
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.arc(sg * w * 1.0, h * 0.5, 0.06, 0, TAU); ctx.lineWidth = lw * 1.1; ctx.strokeStyle = '#D8A93A'; ctx.stroke(); }
    // saç kütlesi: başın arkası + omuzlara dökülen dalgalı uçlar
    ctx.beginPath(); ctx.moveTo(-w * 1.02, -h * 0.2);
    ctx.bezierCurveTo(-w * 1.15, -h * 1.25, w * 1.15, -h * 1.25, w * 1.02, -h * 0.2);
    ctx.bezierCurveTo(w * 1.3, h * 0.6, w * 1.32, h * 1.5, w * 1.18, h * 2.05);
    const n = 6; for (let i = 0; i < n; i++) { const x0 = w * 1.18 - (i + 1) * (w * 2.36 / n); ctx.quadraticCurveTo(x0 + w * 2.36 / n / 2, h * (2.26 + (i % 2) * 0.1), x0, h * 2.05); }
    ctx.bezierCurveTo(-w * 1.32, h * 1.5, -w * 1.3, h * 0.6, -w * 1.02, -h * 0.2); ctx.closePath(); fs(c.hair);
    ctx.beginPath(); for (const dx of [-0.24, -0.02, 0.2]) { ctx.moveTo(dx, -h * 0.85); ctx.quadraticCurveTo(dx + 0.09, h * 0.6, dx - 0.03, h * 1.85); } ctx.lineWidth = lw * 0.7; ctx.strokeStyle = '#86453A'; ctx.stroke();
  } else {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sg * w * 0.98, 0.04, c.head.ear, c.head.ear * 1.2, 0, 0, TAU); fs(c.skin); }
    ctx.beginPath(); ctx.ellipse(0, 0, w * 1.02, h, 0, 0, TAU); fs(c.skin);
    ctx.beginPath(); ctx.moveTo(-w * 1.0, -h * 0.25); ctx.quadraticCurveTo(-w * 1.12, h * 0.6, -w * 0.4, h * 0.95); ctx.quadraticCurveTo(0, h * 1.05, w * 0.4, h * 0.95); ctx.quadraticCurveTo(w * 1.12, h * 0.6, w * 1.0, h * -0.25); ctx.quadraticCurveTo(w * 0.4, h * 0.1, 0, h * 0.12); ctx.quadraticCurveTo(-w * 0.4, h * 0.1, -w * 1.0, -h * 0.25); ctx.closePath(); fs(c.hair);
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * w * 0.9, -0.02); ctx.lineTo(sg * w * 0.62, -0.06); ctx.lineWidth = lw * 0.9; ctx.strokeStyle = INK; ctx.stroke(); }
    ctx.save(); ctx.translate(-w * 1.02, -h * 0.16); ctx.rotate(0.45);   // kulak arkasındaki kalem (sol kulak: arkadan bakınca ekranın solu)
    ctx.beginPath(); ctx.roundRect(-0.03, -0.24, 0.06, 0.4, 0.01); ctx.fillStyle = '#E8B83A'; ctx.fill(); ctx.lineWidth = lw * 0.6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-0.03, -0.3, 0.06, 0.07, 0.015); ctx.fillStyle = '#E58A8A'; ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
// Hayalet çizim (032'deki yöntem): ayrı tuvalde çizilir, hardal tonla boyanır, tek parça saydamlaşır. Filtre yok: alfa ve ton.
let _hay = null;
function hayalet(K, fn, renk = HARDAL, a = 0.8, ton = 0.45) {
  const { ctx } = K, cv = ctx.canvas;
  if (!_hay || _hay.width !== cv.width || _hay.height !== cv.height) { _hay = document.createElement('canvas'); _hay.width = cv.width; _hay.height = cv.height; }
  const o = _hay.getContext('2d');
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1; o.clearRect(0, 0, cv.width, cv.height);
  o.save(); o.setTransform(ctx.getTransform()); fn(H.kit(o)); o.restore();
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-atop'; o.globalAlpha = ton; o.fillStyle = renk; o.fillRect(0, 0, cv.width, cv.height);
  o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(_hay, 0, 0); ctx.restore();
}
// Ekranın bir bölümüne kamera (bölünmüş ekran, hayal kutusu): ekran merkezi (xc, yc)
const kamBolum = (ctx, c, yc, xc = 540) => { ctx.translate(xc, yc); ctx.scale(c.zoom, c.zoom); ctx.translate(-c.cx, -c.cy); };
const kamAra = (a, b, u) => ({ zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), u)), cx: lerp(a.cx, b.cx, u), cy: lerp(a.cy, b.cy, u) });

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-700, 2000], zemin: 1500, dongu: ['mum alevleri', 'balonların salınımı', 'duvar saati', 'çay buharı'],
  capa: { ayna: [AYNA.x + AYNA.w / 2 - 8, AYNA.y + 6], tepsi: TEPSI, pasta: PASTA },
  kadraj: { ikili: DUO, ikili2: DUO2, ikram: DUO_G, hikmet: HIK },
  arka(K, t, { durum }) {   // t = dünya saati
    M.oda(K, { x0: -900, x1: 2300, isik: M.ISIK.gunduz, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 1290, 640, 330, 330, { isik: M.ISIK.gunduz, t });
    bayraklar(K); afis(K); aynaCiz(K, durum.ayna || 0);
    M.duvarSaati(K, SAAT[0], SAAT[1], SAAT[2], durum.saat ?? 15, durum.sn ?? t);
    balonlar(K, t);
  },
  on(K) { masaCiz(K); },
});

// ═══════════════════════════ build ═══════════════════════════
const IF = {
  kararli: { brow: -0.02, browTilt: 0.32, eye: 0.95, pupil: 1, curve: 0.28, open: 0, w: 0.85 },
  sus: { brow: 0.05, browTilt: -0.12, eye: 1.08, pupil: 0.9, curve: -0.12, open: 0, w: 0.5 },
  gergin: { brow: 0.03, browTilt: 0.1, eye: 1.05, pupil: 0.85, curve: -0.05, open: 0, w: 0.7 },
  bastirik: { brow: 0.06, browTilt: -0.2, eye: 0.9, pupil: 1, curve: 0.42, open: 0, w: 0.8 },
  kas: { brow: 0.12, browTilt: -0.3, eye: 1.08, pupil: 1, curve: 0.4, open: 0.12, w: 1.0 },
  kikir: { brow: 0.04, browTilt: -0.1, eye: 0.55, pupil: 1, curve: 0.8, open: 0.25, w: 1.15, smileEyes: true },
  cigne: { brow: 0.02, browTilt: 0, eye: 0.6, pupil: 1, curve: 0.5, open: 0, w: 0.9, smileEyes: true },
};
export function build(ep, tl) {
  const T = e => H.at(tl, e);
  const tR = T('h3b>') + 0.12;                                  // tekrar: kanca anının hikâyedeki yeri (ikinci sayış)
  const tm = {
    don: 0.9, sar0: 1.6, sar1: 2.6, tR, kalk: tR + 0.15,           // kanca: eller tR + 0,15'te aynı karede kalkar
    cd: T(ep.countdown), buldum: T('d3'), kipir: T('d3:1'), end: T('d7>') + 0.1,
    // ikram ve yavaş çekim
    sun: 2.62, alT: 2.96, agiz: 3.48, isir: T('h1') + 0.14, kon: T('h1:4') - 0.02,   // damlalar "bulaştı"da yanaklara konar
    // ayna ve kural
    aynaBak: T('h2a') - 0.32, aynaKes: T('h2a') - 0.1, aynaCevir: T('h2a:1') - 0.02, sus: T('h2a:2') - 0.12,
    ots1: T('h2b') - 0.06, ots2: T('h2b:3'), hik: T('h2c') - 0.06, uc: T('h2c:3') - 0.1, kaldir: T('h2c:6'),
    say: [T('h3:0'), T('h3:1'), T('h3:2')], tekrarYakin: T('h3b') - 0.12,
    hqDon: T('hq') - 0.08, nasil: T('hq:4'), kartGir: T('hq') - 0.02,
    bolunme: T('d4') - 0.05, kaldirirdi: T('d4:7'), carpi: T('d6') + 0.04, dKalk: T('d6:6') - 0.06,   // hayalet el "ilk sayışta"da kalkar, ✗'e kadar ~2 sn görünür
    nYakin: T('n1') - 0.2, nKalk: T('n1:3') - 0.06, kerem: T('h5') - 0.2, silk: T('h5:3') + 0.05, cta: T('d7') - 0.2,
  };
  Object.assign(tm, {
    tDon: tR + tm.don, indir: tR + 1.55, cd0: tm.cd - (ep.cdSure || 10),
    yavas0: tm.isir + 0.03, yavas1: tm.kon + 0.06, ucus: tm.isir + 0.11,
    aynaTak: tm.aynaCevir + 0.23, genis: T('h2a:2') + 0.35, kikir: tm.aynaKes - 0.1,
    // ilk sayış: her sayıya bir plan (A Hikmet'in sayan parmakları · B Defne'nin gözleri · C Necmi'nin gözleri · D "üç"te ikili)
    sayA: T('h3') - 0.44, sayB: T('h3:0') + 0.19, sayC: T('h3:1') + 0.16, sayD: T('h3:2') - 0.04,
    sayGenis: T('h3') - 0.44, kaymaP: tm.kaldirirdi - T('h3:2') + 0.02,   // bölünmüş ekran: geçmişin "üç"ü d4'ün "kaldırırdı"sına oturur
    temiz: T('d4:1') - 0.04,
    birles0: tm.carpi + 0.62, birles1: tm.carpi + 1.15, inset0: T('n1') + 0.02, kancaK: tm.nKalk + 0.12,
    kartSon: tm.bolunme, proof: tm.bolunme,
  });
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...DUO], [tm.kalk - tm.tR - 0.03, ...DUO2], [tm.sar0, ...DUO_G]] },   // donma, geri sarma (sağdan sola), ikram
    { id: 'yavas', t0: tm.yavas0, cam: [[0, 1.42, 690, 1050], [tm.yavas0 + 0.05, 1.46, 690, 1042, 0, [36, 12]], [tm.yavas1, ...DUO_G]] },
    { id: 'ayna', t0: tm.aynaKes, cam: [[0, 1.3, 120, 990], [tm.genis, ...DUO_G]] },   // bakış kesmesi: Defne aynaya bakar; "şş"ten sonra ikiliye kayar
    { id: 'ots1', t0: tm.ots1, cam: [[0, 1.35, 838, 1132], [tm.ots1 + 0.5, 1.37, 842, 1128]] },
    { id: 'ots2', t0: tm.ots2, kisa: true, cam: [[0, 1.35, 542, 1094], [tm.ots2 + 0.5, 1.37, 538, 1090]] },
    { id: 'kural', t0: tm.hik, cam: [[0, ...HIK], [tm.hik + 1.6, 1.37, 205, 982]] },
    { id: 'sayA', t0: tm.sayA, yakin: 1.85, cam: [[0, 1.42, 190, 930]] },             // Hikmet'in sayan parmakları, yakın (yüzü üstte)
    { id: 'sayB', t0: tm.sayB, kisa: true, yakin: 2.15, cam: [[0, 1.4, 500, 995]] },  // Defne'nin gözleri, aşırı yakın
    { id: 'sayC', t0: tm.sayC, kisa: true, yakin: 2.15, cam: [[0, 1.4, 880, 1045]] }, // Necmi'nin gözleri, aşırı yakın
    { id: 'sayD', t0: tm.sayD, kisa: true, cam: [[0, ...DUO], [tm.tekrarYakin, 1.42, 180, 1000]] },   // "üç": ikili, eller masada; sonra Hikmet'e kayar (daha yakın)
    { id: 'tekrar', t0: tm.tR, cam: [[0, ...DUO], [tm.kalk - 0.03, ...DUO2], [tm.hqDon, 1.3, 230, 1122],
      [tm.cd0 - 0.32, 1.4, 480, 1208], [tm.cd0 + 4.6, 1.46, 482, 1204], [tm.cd0 + 5.0, 1.4, 900, 1259], [tm.cd - 0.4, 1.46, 902, 1255]] },   // sayaç: Defne, sonra Necmi (5'er sn)
    { id: 'buldum', t0: tm.buldum - 0.05, cam: [[0, 1.35, 610, 1090]] },
    { id: 'bolunme', t0: tm.bolunme, cam: [[0, ...DUO_G], [tm.birles1, ...DUO_G], [tm.nYakin, 1.4, 880, 1070], [tm.kancaK, ...DUO], [tm.kancaK + 0.15, ...DUO2], [tm.kerem, 1.4, 1205, 1040], [tm.kerem + 1.6, 1.43, 1205, 1034], [tm.cta, 1.35, 500, 1090]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (hikâye saati). Kanca ve tekrar aynı anahtarları okur; geri sarma bunları tersinden gezer. ———
  const defBase = kisi('defne', { x: DX, expr: 'notr', head: { tilt: 3, look: [0.7, 0.2] }, ...POZ.dur });
  const def = [
    [tm.sun, { expr: 'mutlu', head: { tilt: 4, look: [0.55, 0.6] } }, 0.01],
    [tm.agiz - 0.2, { head: { tilt: 2, look: [0.25, 0.35] } }, 0.3],
    [tm.isir - 0.18, { expr: 'mutlu', blink: 1, head: { tilt: -7, look: [0.2, 0.3] } }, 0.14],
    [tm.kon + 0.16, { blink: null, expr: IF.cigne, head: { tilt: 3, look: [0.85, 0.15] } }, 0.22],
    [tm.kon + 0.6, { expr: IF.bastirik, head: { tilt: 5, look: [0.9, 0.3] } }, 0.3],
    [tm.aynaBak, { expr: 'notr', head: { tilt: -4, look: [-0.95, -0.15] } }, 0.18],
    [tm.aynaTak + 0.05, { expr: IF.sus, head: { tilt: 0, look: [-0.75, 0.05] } }, 0.22],
    [tm.sus + 0.5, { head: { tilt: 3, look: [-0.8, 0.1] } }, 0.3],
    [tm.ots1 - 0.05, { expr: 'notr', head: { tilt: 4, look: [0.88, 0.25] } }, 0.25],
    [tm.hik, { head: { tilt: -3, look: [-0.82, 0.02] } }, 0.25],
    [tm.sayA, { expr: IF.gergin, head: { tilt: 2, look: [0.32, 0.16] } }, 0.25],
    [tm.sayB + 0.28, { head: { look: [0.95, 0.42] } }, 0.16],
    [tm.say[2] + 0.7, { expr: H.IFADE.dusun, head: { tilt: -4, look: [0.7, -0.25] } }, 0.35],
    [tm.tekrarYakin, { expr: 'notr', head: { tilt: 0, look: [-0.8, 0.05] } }, 0.25],
    [tm.tR - 0.1, { expr: IF.kararli, head: { tilt: 3, look: [0.9, 0.25] } }, 0.15],   // ikinci sayış: kanca pozu
    [tm.indir - 0.2, { expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.2] } }, 0.3],
    [tm.hqDon + 0.9, { expr: 'notr', head: { tilt: -2, look: [-0.75, 0.1] } }, 0.3],
    [tm.cd0, { expr: H.IFADE.dusun, head: { tilt: -3, look: [0.6, -0.2] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0.25, -0.35] } }, 0.25, ease.enter],
    [tm.kipir - 0.05, { head: { tilt: 4, look: [0.9, 0.75] } }, 0.25],
    [tm.carpi, { expr: H.IFADE.dusun, head: { tilt: -3, look: [0.85, 0.2] } }, 0.01],
    [tm.dKalk - 0.1, { expr: IF.kararli, head: { tilt: 3, look: [0.9, 0.25] } }, 0.2],   // geri çağırma: kanca pozu
    [tm.kerem - 0.05, { expr: 'saskin', head: { tilt: 5, look: [0.95, 0.0] } }, 0.22],
    [tm.cta + 0.1, { expr: 'mutlu', head: { tilt: 4, look: [0.55, 0.15] } }, 0.3],
    [tm.cta + 1.25, { expr: 'mutlu', head: { tilt: 5, look: [0.02, 0.05] } }, 0.3],
  ].sort((a, b) => a[0] - b[0]);
  const necBase = kisi('necmi', { x: NX, expr: 'notr', head: { tilt: -3, look: [-0.7, 0.2] }, ...POZ.dur });
  const nec = [
    [tm.sun, { expr: 'mutlu', head: { tilt: -4, look: [-0.55, 0.6] } }, 0.01],
    [tm.agiz - 0.2, { head: { tilt: -2, look: [-0.25, 0.35] } }, 0.3],
    [tm.isir - 0.18, { expr: 'mutlu', blink: 1, head: { tilt: 7, look: [-0.2, 0.3] } }, 0.14],
    [tm.kon + 0.2, { blink: null, expr: IF.cigne, head: { tilt: -3, look: [-0.85, 0.15] } }, 0.22],
    [tm.kon + 0.66, { expr: IF.bastirik, head: { tilt: -5, look: [-0.9, 0.3] } }, 0.3],
    [tm.aynaBak + 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.05] } }, 0.25],
    [tm.aynaTak + 0.1, { expr: IF.sus, head: { tilt: -2, look: [-0.85, 0.08] } }, 0.22],
    [tm.ots1 - 0.05, { expr: 'notr', head: { tilt: -4, look: [-0.88, 0.25] } }, 0.25],
    [tm.hik, { head: { tilt: 2, look: [-0.9, 0.02] } }, 0.25],
    [tm.sayA, { expr: IF.gergin, head: { tilt: -2, look: [-0.32, 0.16] } }, 0.25],
    [tm.sayC + 0.1, { head: { look: [-0.95, 0.42] } }, 0.16],
    [tm.say[2] + 0.8, { expr: H.IFADE.dusun2, head: { tilt: 4, look: [-0.7, -0.3] } }, 0.35],
    [tm.tekrarYakin, { expr: 'notr', head: { tilt: 2, look: [-0.9, 0.05] } }, 0.25],
    [tm.tR - 0.1, { expr: IF.kararli, head: { tilt: -3, look: [-0.9, 0.25] } }, 0.15],
    [tm.indir - 0.2, { expr: 'mutlu', head: { tilt: -4, look: [-0.85, 0.2] } }, 0.3],
    [tm.hqDon + 0.9, { expr: 'notr', head: { tilt: 2, look: [-0.9, 0.08] } }, 0.3],
    [tm.cd0, { expr: H.IFADE.dusun2, head: { tilt: 3, look: [-0.6, -0.2] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'saskin', head: { tilt: -4, look: [-0.9, 0.1] } }, 0.25],
    [tm.carpi, { expr: 'notr', head: { tilt: -2, look: [-0.88, 0.2] } }, 0.01],
    [tm.nYakin, { expr: H.IFADE.dusun2, head: { tilt: 4, look: [-0.5, -0.3] } }, 0.3],
    [tm.nKalk - 0.1, { expr: IF.kararli, head: { tilt: -3, look: [-0.9, 0.25] } }, 0.2],
    [tm.kerem - 0.02, { expr: 'saskin', head: { tilt: 4, look: [0.95, 0.0] } }, 0.22],
  ].sort((a, b) => a[0] - b[0]);
  const hikBase = kisi('hikmet', { x: HX, expr: 'mutlu', head: { tilt: -3, look: [0.8, 0.25] }, ...POZ.dur });
  const hik = [
    [tm.sun, { expr: 'mutlu', head: { tilt: 5, look: [0.8, 0.35] } }, 0.01],
    [tm.isir, { head: { tilt: 2, look: [0.85, 0.1] } }, 0.3],
    [tm.kikir, { expr: IF.kikir, head: { tilt: 8, look: [0.6, 0.1] } }, 0.2],
    [tm.aynaCevir - 0.16, { expr: 'notr', head: { tilt: -6, look: [-0.9, 0.0] } }, 0.2],
    [tm.aynaTak + 0.12, { expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.15] } }, 0.25],
    [tm.sus, { expr: { ...IF.sus, eye: 0.9 }, head: { tilt: 5, look: [0.8, 0.1] } }, 0.2],
    [tm.ots1 - 0.1, { expr: 'mutlu', head: { tilt: 3, look: [0.8, 0.15] } }, 0.3],
    [tm.hik, { expr: 'mutlu', head: { tilt: -3, look: [0.55, 0.12] } }, 0.01],
    [tm.uc, { expr: IF.kas, head: { tilt: 4, look: [0.7, 0.1] } }, 0.25],
    [tm.sayGenis, { expr: 'notr', head: { tilt: 0, look: [0.7, 0.2] } }, 0.25],
    [tm.say[0], { head: { look: [0.6, 0.35] } }, 0.15], [tm.say[1], { head: { look: [0.95, 0.2] } }, 0.15], [tm.say[2], { head: { look: [0.7, 0.2] } }, 0.15],
    [tm.say[2] + 0.35, { expr: 'saskin', head: { tilt: 6, look: [0.95, 0.15] } }, 0.25],
    [tm.say[2] + 0.75, { head: { tilt: -5, look: [0.45, 0.15] } }, 0.3],
    [tm.tekrarYakin, { expr: IF.kas, head: { tilt: 3, look: [0.6, 0.12] } }, 0.25],
    [tm.kalk, { expr: 'saskin', head: { tilt: -4, look: [0.9, 0.12] } }, 0.2],
    [tm.hqDon, { expr: 'mutlu', head: { tilt: 4, look: [0.04, 0.04] } }, 0.3],
    [tm.nasil - 0.08, { expr: IF.kas, head: { tilt: 8, look: [0, 0] } }, 0.25],
    [tm.cd0 + 0.1, { expr: 'mutlu', head: { tilt: 3, look: [0.8, 0.2] } }, 0.4],
    [tm.buldum, { expr: 'saskin', head: { tilt: -4, look: [0.9, 0.1] } }, 0.25],
    [tm.kerem - 0.1, { expr: 'kizgin', head: { tilt: 3, look: [0.95, 0.0] } }, 0.25],
  ].sort((a, b) => a[0] - b[0]);
  const kerBase = kisi('genc', { x: KX, y: K_Y, s: K_S, expr: IF.cigne, head: { tilt: 5, look: [0.15, 0.7] }, ...POZ.dur });
  const ker = [
    [tm.kerem + 0.25, { expr: 'saskin', head: { tilt: -3, look: [-0.9, 0.0] } }, 0.25],
    [tm.kerem + 0.95, { expr: 'notr', head: { tilt: 4, look: [0.05, 0.1] } }, 0.25],
    [tm.silk - 0.35, { head: { tilt: -2, look: [-0.85, 0.05] } }, 0.22],
    [tm.silk - 0.1, { expr: { ...H.EXPR.mutlu, open: 0, curve: 0.55, eye: 0.85, smileEyes: false } }, 0.25],
  ];
  const kLokma = [3.05, 6.9, 10.35, 13.85, 17.25, tm.tR + 2.3, tm.cd0 + 2.1, tm.cd0 + 5.75, tm.cd0 + 7.6, tm.buldum + 3.3, tm.dKalk + 0.25, tm.nKalk + 0.95];
  const kAl = [10.0, 17.0, tm.cd0 + 5.15];   // tabaktan yeni dilim alır (sonuncusu sayaçta: son baklava)
  return { tm, film, def, defBase, nec, necBase, hik, hikBase, ker, kerBase, kLokma, kAl };
}

// ═══════════════════════════ Karakter durumları ═══════════════════════════
// Sayaçta birbirine kaçamak bakışlar: biri bakarken öteki düşünür (durağanlık olmasın)
function sayacBakis(p, tE, tm, yon) {
  const k = tE - tm.cd0, f = yon > 0 ? 0 : 0.9, i = Math.floor((k + f) / 1.8), u = ease.state(clamp01(((k + f) % 1.8) / 0.3));
  const L = [[0.92 * yon, 0.38], [-0.35 * yon, -0.55], [0.92 * yon, 0.38], [0.15 * yon, 0.7]];
  const a = L[(i + 3) % 4], b = L[i % 4];
  p.head = { ...p.head, look: [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], tilt: (p.head.tilt || 0) + 3 * Math.sin(k * 0.9 + f) };
}
// Defne / Necmi: iç el (karşısındakine dönük) tepsi → ağız → masa → kalk; dış el masada. Damla ve elde tutulan nesne.
const IC = { defne: 'R', necmi: 'L' }, DIS = { defne: 'L', necmi: 'R' }, YON = { defne: 1, necmi: -1 };
function ikiliDurum(key, tE, t, S, o) {
  const { tm } = S, sg = YON[key], ic = IC[key];
  const p = H.poseAt(H.CARDS[key], key === 'defne' ? S.defBase : S.necBase, key === 'defne' ? S.def : S.nec, tE);
  if (tE >= tm.cd0 && tE < tm.cd) sayacBakis(p, tE, tm, sg);
  if (key === 'defne') p.y -= H.buldumHop(tE, tm.buldum);
  if (tE > tm.genis + 0.3 && tE < tm.ots1) H.onayla(p, tE, tm.genis + 0.32 + (key === 'necmi' ? 0.12 : 0), 1, 0.4);
  const X = p.x, sh = H.shoulder(key, p, ic), arm = (H.CARDS[key].arm.upper + H.CARDS[key].arm.lower) * p.s;
  const masaI = [X + sg * 84, MASA - 12], masaD = [X - sg * 80, MASA - 12];
  const kalkY = [sh[0] + sg * 0.5 * arm, sh[1] - 0.84 * arm];
  const agiz = yuzNokta(key, p, 0.12 * sg, 0.45);
  const tepsiY = key === 'defne' ? TEPSI_D : TEPSI_N;
  let hedef = masaI, w = 1, elde = null, isir = 0, parmak = 0, isaretH = null, pec = null;
  // 1) ikram: tepsiye uzan, al, ağza götür, ısır, yavaş çekim, ikinci lokma, masaya
  const alW = W(tE, tm.alT - 0.27, 0.27), agW = W(tE, tm.alT + 0.16, tm.agiz - tm.alT - 0.16), inW = W(tE, tm.kon + 0.95, 0.32);
  if (tE >= tm.sun && tE < tm.kon + 1.4) {
    hedef = kar(kar(masaI, ekle(tepsiY, [0, -18]), alW), agiz, agW);
    if (inW > 0) hedef = kar(hedef, masaI, inW);
    if (tE >= tm.alT - 0.02 && tE < tm.kon + 0.95) { elde = 'baklava'; isir = tE >= tm.isir ? (tE >= tm.kon + 0.6 ? 2 : 1) : 0; }
  }
  // 2) ikinci sayış (kanca ve tekrar): iç el aynı karede kalkar, hq sırasında iner
  const k1 = Math.max(0.1 * ease.state(seg(tE, tm.tR - 0.02, 0.15)), ease.enter(seg(tE, tm.kalk - 0.02, 0.2))) * (1 - W(tE, tm.indir, 0.36));
  // 3) geri çağırma (şimdiki zaman): Defne d6'da, Necmi n1'de; Kerem'e dönünce iner
  const k2 = key === 'defne' ? ease.enter(seg(tE, tm.dKalk, 0.22)) * (1 - W(tE, tm.kerem, 0.34)) : ease.enter(seg(tE, tm.nKalk, 0.22)) * (1 - W(tE, tm.kerem + 0.06, 0.34));
  let kalk = Math.max(k1, k2);
  // hayal dünyası: karşısındakinin yüzü temiz olsaydı ilk sayışın "üç"ünde kalkardı
  if (o.hayal && ((o.hayal === 'N' && key === 'necmi') || (o.hayal === 'D' && key === 'defne'))) kalk = Math.max(kalk, ease.enter(seg(tE, tm.say[2] + 0.04, 0.22)));
  if (kalk > 0) { hedef = kar(hedef, kalkY, kalk); if (kalk > 0.6) parmak = 4; }
  // 4) Buldum (Defne): yumruk havaya, "Necmi" deyince Necmi'nin masadaki elini gösterir
  if (key === 'defne' && tE >= tm.buldum - 0.06 && tE < tm.bolunme) {
    const u1 = ease.enter(seg(tE, tm.buldum - 0.05, 0.25)), u2 = W(tE, tm.kipir - 0.05, 0.3);
    const nEl = [NX - 84, MASA - 18], yon = H.unit(sh, nEl), gos = [sh[0] + yon[0] * 0.92 * arm, sh[1] + yon[1] * 0.92 * arm];
    hedef = kar(kar(masaI, [kalkY[0] + 6, kalkY[1] - 10], u1), gos, u2);
    if (u2 > 0.55) isaretH = nEl;
  }
  // 5) çağrı (Defne): peçeteyle yanağını siler, sonra peçeteyi indirir
  if (key === 'defne' && tE >= tm.cta) {
    const al = W(tE, tm.cta + 0.12, 0.32), bit = W(tE, tm.cta + 1.05, 0.34), sil = tE > tm.cta + 0.44 && tE < tm.cta + 1.05 ? Math.sin(TAU * 2.4 * (tE - tm.cta - 0.44)) : 0;
    const yanak = yuzNokta(key, p, 0.36, 0.2);
    hedef = kar(kar(masaI, [yanak[0] + 4, yanak[1] + 22 + 10 * sil], al), masaI, bit);
    if (al > 0.3 && bit < 0.7) pec = true;
  }
  // damla: tepsideki baklavada → uçuş (yavaş çekim) → yanakta; sayaçta süzülür; çağrıda silinir; hayalde temiz yüz
  return { p, key, ic, dis: DIS[key], L: ic === 'L' ? [hedef, w, 'A'] : [masaD, 1, 'A'], R: ic === 'R' ? [hedef, w, 'A'] : [masaD, 1, 'A'], elde, isir, parmak, isaretH, pec, kalk };
}
// Şerbet damlasının durumu (dünya): yanak noktası pozdan hesaplanır, baş dönse de damla yanakta kalır
function damlaDurum(d, tE, S, o) {
  const { tm } = S, { key, p } = d, [lx, ly] = YANAK[key], r = 0.074 * p.s;
  if (o.temiz && o.temiz === key) return null;
  if (key === 'defne' && tE >= tm.cta + 0.62) {   // peçete geçti: silindi
    return tE < tm.cta + 0.8 ? { p: yuzNokta(key, p, lx, ly), r, a: 1 - seg(tE, tm.cta + 0.62, 0.18) } : null;
  }
  if (tE < tm.ucus) return null;
  const kon = yuzNokta(key, p, lx, ly);
  if (tE < tm.kon) {   // uçuş: karşıdakinin ısırdığı baklavanın ucundan yay çizerek bu yanağa (yavaş çekimde 1,3 sn; ikisi havada çaprazlanır)
    const u = seg(tE, tm.ucus, tm.kon - tm.ucus), e = ease.state(u), bas = o.kaynak || yuzNokta(key, p, 0.2 * YON[key], 0.5);
    const q = H.yay(bas, kon, e, 130), v = H.unit(H.yay(bas, kon, Math.max(0, e - 0.04), 130), q);
    const iz = []; for (let j = 0; j <= 10; j++) iz.push(H.yay(bas, kon, Math.max(0, e - 0.3 * (1 - j / 10)), 130));
    return { p: q, r: r * lerp(0.75, 1.12, Math.min(1, u * 3)), rot: Math.atan2(v[1], v[0]) - Math.PI / 2, uzun: 1 + 0.35 * Math.sin(Math.PI * u), ucus: true, iz2: iz };
  }
  const kay = 18 * ease.state(seg(tE, tm.cd0, tm.cd - tm.cd0)) * (o.gecmis ? 0 : 1);   // sayaç boyunca 18 px süzülür
  return { p: [kon[0], kon[1] + kay], r, iz: kay, uzun: ezil(tE, tm.kon) };
}
// Hikmet: dış el (aynayı çevirir), iç el (ikram jesti, kıkırdama, "şş", üç parmak, sayış, "nasıl" avuçları)
const HSAY = [236, 972];
function hikmetDurum(tE, S, o = {}) {
  const { tm } = S, p = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, tE);
  const shR = H.shoulder('hikmet', p, 'R'), shL = H.shoulder('hikmet', p, 'L');
  let R = null, L = null, parmak = null, isaretH = null;
  // ikram jesti: avuç açık, tepsiyi gösterir
  const ik = pw(tE, tm.sun + 0.05, tm.alT + 0.3, 0.3, 0.32);
  if (ik > 0.01) { R = [[shR[0] + 82, shR[1] + 66], ik, 'A']; if (ik > 0.6) parmak = { n: 4, yon: -0.55, ac: 0.3 }; }
  // kıs kıs gülme: el ağzında, omuzlar sarsılır
  const kk = pw(tE, tm.kikir, tm.aynaCevir - 0.14, 0.2, 0.2);
  if (kk > 0.01) { R = [yuzNokta('hikmet', p, 0.1, 0.46), kk, 'A']; p.y += 5 * Math.abs(Math.sin(TAU * 3 * (tE - tm.kikir))) * kk; }
  // ayna: dış el aynanın sağ kenarını tutar ve çevirir
  const ay = pw(tE, tm.aynaCevir - 0.04, tm.aynaTak + 0.12, 0.27, 0.3);
  if (ay > 0.01) { const u = aynaAt(tE, tm), kx = AYNA.x + (AYNA.w / 2 - 8) * Math.cos(Math.PI * u); L = [[kx, AYNA.y + 8], ay, 'A']; }
  // "şş": işaret parmağı dudakta
  const ss = pw(tE, tm.sus, tm.ots1 - 0.25, 0.26, 0.3);
  if (ss > 0.01) { R = [yuzNokta('hikmet', p, 0.04, 0.5), ss, 'A']; if (ss > 0.6) parmak = { n: 1, yon: -Math.PI / 2, boy: 1.05 }; }
  // üç parmak (kural), sayış (her sayıda bir parmak kapanır), "bir daha" (yine üç), kanca (yumruk)
  const say = Math.max(pw(tE, tm.uc, tm.sayGenis + 0.05, 0.28, 0.3), pw(tE, tm.say[0] - 0.42, tm.tR - 0.42, 0.28, 0.3));   // ikinci sayışın sonunda el iner: kanca karesi temiz
  if (say > 0.01 && o.sayEl !== false) {
    R = [HSAY, say, 'A'];
    let n = 3;
    if (tE >= tm.say[0] - 0.42) { n = 3; for (const s of tm.say) n -= ease.state(seg(tE, s - 0.02, 0.12)); }
    if (tE >= tm.tekrarYakin + 0.2) n = 3 * ease.enter(seg(tE, tm.tekrarYakin + 0.2, 0.3));
    if (tE >= tm.tR - 0.05) n = 0;
    if (say > 0.6) parmak = { n, yon: -Math.PI / 2, ac: 0.42, toplam: 3 };
  }
  // "Nasıl?": iki avuç yukarı açılır
  const ns = pw(tE, tm.nasil - 0.12, tm.cd0 + 0.2, 0.28, 0.35);
  if (ns > 0.01) { R = [[shR[0] + 92, shR[1] - 4], ns, 'B']; L = [[shL[0] - 120, shL[1] - 20], ns, 'B']; if (ns > 0.6) parmak = { n: 4, yon: -1.15, ac: 0.3, iki: true }; }
  return { p, R, L, parmak };
}
// Kerem: tabağı dış elinde göğüs hizasında tutar, iç eliyle lokma lokma yer. h5'te adı geçince masaya bir adım yaklaşır
// (0,82 → 1 ölçek; uzaklıktan yakına), son baklava ağzının önündeyken yakalanır, sonra iki kolunu açıp omuz silker.
function keremDurum(tE, S) {
  const { tm } = S, p = H.poseAt(H.CARDS.genc, S.kerBase, S.ker, tE);
  const ileri = ease.state(seg(tE, tm.kerem + 0.3, 0.42));
  p.s = lerp(K_S, H.BOY.genc, ileri); p.y = lerp(K_Y, 1500, ileri); p.x = lerp(KX, KX + 120, ileri);   // öne ve sağa: Necmi'nin arkasından çıkar, açılan kolları Necmi'nin yüzüne binmez
  const gL = H.elYeri('genc', p, 'L', 'gogus'), gR = H.elYeri('genc', p, 'R', 'gogus'), k = p.s / K_S;
  const tabak = [gR[0] + 14 * k, gR[1] - 6 * k];
  let elL = [gL[0] + 14 * k, gL[1] - 14 * k], cigne = 0;
  for (const b of S.kLokma) {   // lokma: el ağza (0,3 sn), 0,25 sn bekler, iner; 1,4 sn çiğner
    const u = pw(tE, b, b + 0.25, 0.3, 0.32);
    if (u > 0) elL = kar(elL, yuzNokta('genc', p, -0.06, 0.48), u);
    if (tE > b + 0.2 && tE < b + 1.6) cigne = Math.max(cigne, Math.abs(Math.sin(TAU * 1.7 * (tE - b - 0.2))) * (1 - seg(tE, b + 1.3, 0.3)));
  }
  for (const a of S.kAl) { const u = pw(tE, a, a + 0.22, 0.28, 0.3); if (u > 0) elL = kar(elL, ekle(tabak, [-14 * k, -16 * k]), u); }
  const yak = pw(tE, tm.kerem + 0.12, tm.silk - 0.12, 0.3, 0.3);   // yakalandı: son lokma ağzının önünde donar
  if (yak > 0) elL = kar(elL, yuzNokta('genc', p, -0.1, 0.5), yak);
  p.talk = tE < tm.kerem + 0.3 ? 0.6 * cigne : 0;
  return { p, L: [elL, 1, 'A'], R: [tabak, 1, 'A'], tabak };
}
// Büyük omuz silkme: iki kol yanlara ve yukarı açılır (avuçlar omuz hizasında), omuzlar kalkar, baş yana düşer
function buyukSilk(p, t, t0, tut = 0.6) {
  const w = ease.enter(seg(t, t0, 0.25)) * (1 - ease.state(seg(t, t0 + 0.25 + tut, 0.32)));
  if (w <= 0) return;
  p.armL = { sh: lerp(p.armL.sh, 66, w), el: lerp(p.armL.el, 58, w), k: 1 }; p.armR = { sh: lerp(p.armR.sh, 66, w), el: lerp(p.armR.el, 58, w), k: 1 };
  p.head = { ...p.head, tilt: (p.head.tilt || 0) + 11 * w }; p.bob = (p.bob || 0) + 0.05 * w;
}
// Kerem'i çizer (dx: yatay kayma): uzanışlar → omuz silkme → çizim → yüzündeki şerbet → tabak ve elindeki dilim
function keremCiz(K, tE, S, dx = 0) {
  const { tm } = S, kd = keremDurum(tE, S);
  kd.p.x += dx;
  for (const sd of ['L', 'R']) H.reach('genc', kd.p, sd, ekle(kd[sd][0], [dx, 0]), kd[sd][1], kd[sd][2]);
  if (tE >= tm.silk - 0.2) buyukSilk(kd.p, tE, tm.silk, 0.9);
  const kr = H.drawChar(K.ctx, 'genc', kd.p, tE), k = kd.p.s / K_S;
  keremSerbet(K, kd.p, tE, S);
  const n = keremTabak(tE, S), e = kr.handR;
  K.ell(e[0] + 8 * k, e[1] - 10 * k, 62 * k, 15 * k, PAL.cream, LW * 0.7);
  for (let i = 0; i < n; i++) baklava(K, [e[0] - 22 * k + i * 26 * k, e[1] - (22 + (i % 2) * 6) * k], 0.55 * k);
  H.grip(K, 'genc', e, kd.p.s);
  baklava(K, [kr.handL[0] + 4 * k, kr.handL[1] - 20 * k], 0.62 * k, { rot: -0.3, isir: 1 }); H.grip(K, 'genc', kr.handL, kd.p.s);
  return kr;
}

// ═══════════════════════════ Oda sahnesi (her görünüş bunu çağırır) ═══════════════════════════
// o = { tl (dudak için; yoksa sessiz), heads, hayal: 'N' | 'D' (hayal dünyası: karşısındakinin yüzü temiz), gecmis (bölünmüş
//       ekranda geçmiş: damlalar henüz süzülmemiş), t: video saati (dudak) }
function odaCiz(K, tE, S, o = {}) {
  const { tm } = S, { ctx } = K, Wt = dunyaSaati(tE, tm), sa = saatAt(tE, tm);
  M.mekanCiz(K, ODA, 'arka', Wt, { durum: { ayna: aynaAt(tE, tm), saat: sa.saat, sn: sa.sn } });
  const konus = key => (o.tl && !o.tl.lines.some(l => l.ic && l.who === key && o.t >= l.t0 - 0.02 && o.t <= l.t1) ? H.talkAt(o.tl, key, o.t) : 0);   // iç ses: dudak kıpırdamaz
  const temiz = o.hayal === 'N' ? 'defne' : o.hayal === 'D' ? 'necmi' : null;
  // ——— Kerem (arkada; h5'te öne çıkınca ikilinin önünde çizilir) ———
  const keremOnde = tE > tm.kerem + 0.5;
  let kr = keremOnde ? null : keremCiz(K, tE, S);
  // ——— Hikmet ———
  const hd = hikmetDurum(tE, S, o);
  if (hd.R) H.reach('hikmet', hd.p, 'R', hd.R[0], hd.R[1], hd.R[2]);
  if (hd.L) H.reach('hikmet', hd.p, 'L', hd.L[0], hd.L[1], hd.L[2]);
  hd.p.talk = konus('hikmet');
  const hr = H.drawChar(ctx, 'hikmet', hd.p, tE);
  if (o.heads) o.heads.hikmet = hr.head;
  // ——— Necmi, Defne ———
  const dd = { necmi: ikiliDurum('necmi', tE, o.t, S, o), defne: ikiliDurum('defne', tE, o.t, S, o) }, rr = {};
  for (const key of ['necmi', 'defne']) {
    const d = dd[key];
    if (o.bakis?.[key]) d.p.head = { ...d.p.head, look: o.bakis[key] };
    if (o.gizle === key) continue;
    H.reach(key, d.p, 'L', d.L[0], d.L[1], d.L[2]); H.reach(key, d.p, 'R', d.R[0], d.R[1], d.R[2]);
    d.p.talk = konus(key);
    if (key === 'defne') H.buldumIsin(K, tE, tm.buldum, H.eklem('defne', d.p, 'head'), { son: tm.bolunme - 0.4 });
    rr[key] = H.drawChar(ctx, key, d.p, tE);
    if (o.heads) o.heads[key] = rr[key].head;
  }
  if (keremOnde) kr = keremCiz(K, tE, S);
  if (o.heads) o.heads.genc = kr.head;
  // ——— masa ve üstündekiler ———
  M.mekanCiz(K, ODA, 'on', Wt);
  pasta(K, PASTA, mumBoy(tE, tm), Wt);
  tepsi(K, TEPSI, { alD: tE >= tm.alT - 0.02, alN: tE >= tm.alT - 0.02 });
  cayBardagi(K, KCAY[0], KCAY[1], 1.25, Wt); cayBardagi(K, HCAY[0], HCAY[1], 1.25, Wt);
  // masaya dayanan önkollar (örtünün üstünde)
  for (const key of ['necmi', 'defne']) {
    const d = dd[key];
    if (o.gizle === key) continue;
    kolUst(K, key, d.p, d.dis);
    if ((!d.elde && !d.pec && d.kalk < 0.12 && tE >= tm.sun) || d.isaretH) kolUst(K, key, d.p, d.ic);
  }
  // Necmi'nin dış elinde sayaçta tıkırdayan parmak
  if (tE >= tm.cd0 + 1.2 && tE < tm.cd - 0.6 && o.gizle !== 'necmi') {
    const e = rr.necmi.handR, a = Math.PI * 0.5 - 0.5 + 0.42 * Math.abs(Math.sin(Math.PI * 1.0 * (tE - tm.cd0)));
    H.parmaklar(K, 'necmi', e, dd.necmi.p.s, 1, { yon: a, boy: 0.9 });
  }
  // eldekiler: baklava, peçete, kaldırılan avuçlar, işaret
  for (const key of ['necmi', 'defne']) {
    if (o.gizle === key) continue;
    const d = dd[key], e = d.ic === 'R' ? rr[key].handR : rr[key].handL, s = d.p.s;
    if (d.elde === 'baklava') { baklava(K, [e[0] + YON[key] * 14, e[1] - 38], 1.0, { rot: YON[key] * -0.42, isir: d.isir ? 1 : 0 }); H.grip(K, key, e, s); }
    if (d.pec) { pecete(K, [e[0] + 4, e[1] - 18], 0.95, -0.3); H.grip(K, key, e, s); }
    if (d.parmak && !d.elde) H.parmaklar(K, key, e, s, d.parmak * clamp01((d.kalk - 0.6) / 0.3), { yon: -Math.PI / 2 + YON[key] * 0.18, ac: 0.3 });
    if (d.isaretH) H.isaret(K, key, e, s, d.isaretH);
  }
  if (hd.parmak && hd.R) {
    const P = hd.parmak;
    H.parmaklar(K, 'hikmet', hr.handR, hd.p.s, P.n, { yon: P.yon, ac: P.ac ?? 0.4, boy: P.boy ?? 1, toplam: P.toplam ?? Math.max(1, Math.ceil(P.n - 1e-6)) });
    if (P.iki) H.parmaklar(K, 'hikmet', hr.handL, hd.p.s, P.n, { yon: -Math.PI - P.yon, ac: P.ac });
  } else if (hd.R && hd.R[1] > 0.6) H.grip(K, 'hikmet', hr.handR, hd.p.s);
  if (hd.L && hd.L[1] > 0.6 && !(hd.parmak && hd.parmak.iki)) H.grip(K, 'hikmet', hr.handL, hd.p.s);
  // ——— şerbet damlaları (yüzlerin üstünde) ———
  const dam = {};
  for (const key of ['necmi', 'defne']) {
    if (o.gizle === key) continue;
    const ot = key === 'defne' ? 'necmi' : 'defne', eO = rr[ot] ? (IC[ot] === 'R' ? rr[ot].handR : rr[ot].handL) : null;
    const s = damlaDurum(dd[key], tE, S, { temiz, gecmis: o.gecmis, kaynak: eO ? [eO[0] + YON[ot] * 46, eO[1] - 44] : null });
    dam[key] = s;
    if (s && s.iz2) {   // uçuş izi: kuyruğa doğru incelir ve solar
      for (let j = 1; j < s.iz2.length; j++) { ctx.save(); ctx.globalAlpha = 0.55 * j / s.iz2.length; ctx.lineCap = 'round'; K.line(s.iz2[j - 1][0], s.iz2[j - 1][1], s.iz2[j][0], s.iz2[j][1], 3 + 9 * j / s.iz2.length, AMBER); ctx.restore(); }
    }
    if (s) serbet(K, s.p, s.r, { iz: s.iz || 0, rot: s.rot || 0, uzun: s.uzun || 1, a: s.a ?? 1 });
  }
  return { dd, rr, dam, hr, kr };
}

// ═══════════════════════════ Omuz üstü planlar ═══════════════════════════
// 'N': Defne'nin omzunun üstünden Necmi'nin yanağı · 'D': Necmi'nin omzunun üstünden Defne'nin yanağı. Arkadaki kişi önden,
// karşısına (kameranın yanına) bakar; damlanın çevresinde hardal halka kalp atışıyla nabız atar.
function otsCiz(K, t, S, B, hangi) {
  const { tm } = S, { ctx } = K, cam = B.cam, piv = [cam.cx, cam.cy], k = 1.2;
  const nab = (a0, n) => { let v = 0; for (let i = 0; i < n; i++) v = Math.max(v, H.nabiz(t, a0 + 0.2 + i * 0.42, 0.3)); return v; };
  const kim = hangi === 'N' ? 'necmi' : 'defne', on = hangi === 'N' ? 'defne' : 'necmi', heads = {};
  ctx.save(); ctx.translate(piv[0], piv[1]); ctx.scale(k, k); ctx.translate(-piv[0], -piv[1]);   // kamera yaklaşır (1,35 × 1,2)
  const r = odaCiz(K, t, S, { tl: S.tl, t, heads, gizle: on, bakis: { [kim]: hangi === 'N' ? [-0.58, 0.06] : [0.58, 0.06] } });
  const dm = r.dam[kim];
  if (dm) { halka(K, dm.p, dm.r * 1.85, nab(hangi === 'N' ? tm.ots1 : tm.ots2, hangi === 'N' ? 2 : 3)); serbet(K, dm.p, dm.r, { iz: dm.iz || 0, uzun: dm.uzun || 1 }); }
  ctx.restore();
  for (const key of Object.keys(heads)) B.heads[key] = [piv[0] + (heads[key][0] - piv[0]) * k, piv[1] + (heads[key][1] - piv[1]) * k];
  // ön plan: omzunun üstünden baktığımız kişi, arkadan (yakın olduğu için büyük)
  const ekr = hangi === 'N' ? [150, 1318] : [918, 1318], yer = [cam.cx + (ekr[0] - 540) / cam.zoom, cam.cy + (ekr[1] - 960) / cam.zoom];
  sirt(K, on, yer, (hangi === 'N' ? 212 / (0.45 * cam.zoom) : 212 / (0.48 * cam.zoom)), { tilt: hangi === 'N' ? 5 : -5 });
}

// ═══════════════════════════ Ekran öğeleri ═══════════════════════════
// Bilmece kartı: hq'da yayla iner (320/30), bölünmüş ekran kesmesinde aynı karede kalkar. Dönen: kartın alt kenarı.
function kartCiz(K, t, ep, tm) {
  if (t < tm.kartGir || t >= tm.kartSon) return 300;
  const { ctx } = K, v = H.spring(t - tm.kartGir, H.UI[0], H.UI[1]);
  ctx.save(); ctx.translate(540, 300); ctx.scale(0.86 + 0.14 * v, 0.86 + 0.14 * v); ctx.translate(-540, -300 - 40 * (1 - v)); ctx.globalAlpha = clamp01(v * 1.6);
  const h = H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
  ctx.restore();
  return 300 + h;
}
// "SEN DE DÜŞÜN!" sayacı (sahne.js countdown'un kopyası): bu bölümde ipucu repliği yok, sayaç "Buldum!"dan hemen önce
// biter; alttaki yazı "İpucu geliyor…" yerine "Cevap geliyor…" (söylenenle görünen çelişmesin).
function sayac(K, t, t1, { top = 540, share = null, dur = 10, perde = true } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.3 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.25), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 540, y = 1046, r = 172;   // (044) kartın altında yüzlere yer kalsın diye standart sayaçtan 56 px aşağıda
  if (perde) { ctx.save(); ctx.globalAlpha = 0.5 * clamp01((t - t0 + 0.3) / 0.3) * out; ctx.fillStyle = INK; ctx.fillRect(0, top, 1080, 1920 - top); ctx.restore(); }
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  ctx.font = '900 70px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 80;
  K.rect(-bw / 2 + 8, -r - 128 + 10, bw, 100, INK, 0, 50); K.rect(-bw / 2, -r - 128, bw, 100, PAL.mustard, LW, 50);
  K.text('SEN DE DÜŞÜN!', 0, -r - 54, 70, INK, 900);
  K.circ(10, 12, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 52, 150, hot ? PAL.red : INK, 900); ctx.restore();
  K.text('Cevap geliyor…', 0, r + 72, 52, PAL.paper, 800);
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]); ctx.save(); ctx.translate(0, r + 152); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 46px Rubik'; const sw = ctx.measureText(share).width + 70;
    K.rect(-sw / 2 + 8, -48 + 10, sw, 96, INK, 0, 48); K.rect(-sw / 2, -48, sw, 96, PAL.coral, LW, 48); K.text(share, 0, 16, 46, PAL.paper, 900);
    ctx.restore();
  }
  ctx.restore();
}
// Donmuş kare: mürekkep çerçeve (çizgi roman paneli) ve "NASIL?" damgası (320/30)
function donma(K, t, tm) {
  if (t < tm.don - 0.001 || t >= tm.sar0 + 0.2) return;
  const { ctx } = K, v = H.spring(t - tm.don, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, tm.sar0, 0.2));
  ctx.save(); ctx.globalAlpha = out;
  const ins = lerp(-30, 26, v), lw = 22;
  ctx.beginPath(); ctx.rect(-50, -50, 1180, 2020); ctx.roundRect(ins, ins, 1080 - 2 * ins, 1920 - 2 * ins, 34); ctx.fillStyle = PAL.paper; ctx.fill('evenodd');
  ctx.beginPath(); ctx.roundRect(ins, ins, 1080 - 2 * ins, 1920 - 2 * ins, 34); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
  const s = H.spring(t - tm.don - 0.06, H.UI[0], H.UI[1]);
  if (t < tm.don + 0.06) return;
  ctx.save(); ctx.translate(540, 1222); ctx.rotate(-0.06);   // iki yüzün altında, masa örtüsünün üstünde ctx.scale(1.5 - 0.5 * s, 1.5 - 0.5 * s); ctx.globalAlpha = clamp01(s * 2) * out;
  ctx.font = '900 136px Rubik'; const tw = ctx.measureText('NASIL?').width, w = tw + 84, h = 180;
  K.rect(-w / 2 + 10, -h / 2 + 12, w, h, INK, 0, 26);
  K.rect(-w / 2, -h / 2, w, h, PAL.cream, LW * 1.4, 26);
  ctx.beginPath(); ctx.roundRect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 16); ctx.lineWidth = 7; ctx.strokeStyle = PAL.coral; ctx.stroke();
  K.text('NASIL?', 0, 49, 136, PAL.coral, 900);
  ctx.restore();
}
// Büyük mercan ✗ damgası (hayal yarısının üstüne basılır)
function carpiDamga(K, t, a, b, [x, y], r = 120) {
  if (t < a || t > b + 0.25) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, b, 0.25));
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.08); ctx.scale((1.45 - 0.45 * v), (1.45 - 0.45 * v)); ctx.globalAlpha = clamp01(v * 2) * out;
  K.circ(10, 12, r, INK, 0); K.circ(0, 0, r, PAL.coral, LW * 1.3);
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r * 0.42, -r * 0.42); ctx.lineTo(r * 0.42, r * 0.42); ctx.moveTo(r * 0.42, -r * 0.42); ctx.lineTo(-r * 0.42, r * 0.42);
  ctx.lineWidth = r * 0.22; ctx.strokeStyle = PAL.paper; ctx.stroke();
  ctx.restore();
}

// ═══════════════════════════ Bölünmüş ekran ═══════════════════════════
// İki pano, aynı kadraj: üst "YA TEMİZ OLSAYDIM?" (hardal tonlu hayalet dünya: Defne'nin yanağı temiz, Necmi ilk "üç"te elini
// kaldırır), alt "GERÇEK" (aynı an: Necmi'nin eli masada kalır). Panolar güvenli alanda, altyazı balonu altlarında kalır.
// "temiz"de iki panoda aynı yanağa halka (üstte temiz, altta şerbetli); "kaldırırdı"da hayalet elin ve masadaki gerçek elin
// çevresine halka. d6'da üste ✗, hayalet söner, alt pano büyüyüp bütün kareyi kaplar ve kamerası ana kameraya kavuşur
// (✗ anından sonra alt pano şimdiki zamanı gösterir).
const PZ = 1.07, PTOP = 815, PH = 470, P_UST = 300, P_ALT = 776, PX = 24, PW = 1032;
const panelKam = (y0, t, tm) => ({ zoom: PZ * (1 + 0.04 * ease.state(seg(t, tm.bolunme, tm.birles0 - tm.bolunme))), cx: 690, cy: PTOP + PH / 2 / PZ, yc: y0 + PH / 2 });
function panoHalka(K, t, a, [x, y], r) {   // dikkat halkası: a anında yayla gelir, bir kez nabız atar, 1,5 sn sonra söner
  if (t < a || t > a + 1.5) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, a + 1.2, 0.3));
  ctx.save(); ctx.globalAlpha *= out; ctx.lineWidth = 7; ctx.strokeStyle = HARDAL;
  ctx.beginPath(); ctx.arc(x, y, r * (0.6 + 0.4 * v) * (1 + 0.14 * H.nabiz(t, a + 0.6, 0.4)), 0, TAU); ctx.stroke(); ctx.restore();
}
function bolunmus(K, t, S, B, base) {
  const { tm } = S, { ctx } = K, tP = t - tm.kaymaP;
  const sonme = 1 - ease.state(seg(t, tm.carpi + 0.22, 0.4)), birles = ease.state(seg(t, tm.birles0, tm.birles1 - tm.birles0));
  const ac = ease.enter(seg(t, tm.bolunme, 0.32));
  ctx.save(); ctx.setTransform(base); ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
  if (sonme > 0.005) {   // üst pano: hayal
    const c = panelKam(P_UST, t, tm); let r = null;
    ctx.save(); ctx.setTransform(base); ctx.beginPath(); ctx.roundRect(PX, P_UST, PW, PH, 20); ctx.clip();
    kamBolum(ctx, c, c.yc + 30 * (1 - ac));
    hayalet(K, K2 => { r = odaCiz(K2, tP, S, { hayal: 'N', gecmis: true }); }, HARDAL, 0.8 * sonme, 0.45);
    ctx.globalAlpha = sonme;
    if (r) { panoHalka(K, t, tm.temiz, yuzNokta('defne', r.dd.defne.p, ...YANAK.defne), 30); panoHalka(K, t, tm.kaldirirdi + 0.12, r.rr.necmi.handL, 44); }
    ctx.restore();
    ctx.save(); ctx.setTransform(base); ctx.globalAlpha = sonme;
    ctx.beginPath(); ctx.roundRect(PX, P_UST, PW, PH, 20); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(PX + 14, P_UST + 14, PW - 28, PH - 28, 12); ctx.setLineDash([20, 13]); ctx.lineWidth = 5; ctx.strokeStyle = HARDAL; ctx.stroke();
    ctx.restore();
  }
  // alt pano: gerçek (✗'e kadar geçmiş, sonra şimdi); birleşmede bütün kareye açılır
  const cA = panelKam(P_ALT, t, tm), cam = kamAra(cA, B.cam, birles), yc = lerp(cA.yc + 30 * (1 - ac), 960, birles);
  const rx = lerp(PX, 0, birles), ry = lerp(P_ALT, 0, birles), rw = lerp(PW, 1080, birles), rh = lerp(PH, 1920, birles);
  ctx.save(); ctx.setTransform(base); ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 20 * (1 - birles)); ctx.clip();
  kamBolum(ctx, cam, yc);
  const r2 = t < tm.carpi ? odaCiz(K, tP, S, { gecmis: true }) : odaCiz(K, t, S, { tl: S.tl, t, heads: birles > 0.99 ? B.heads : null });
  if (t < tm.carpi) { if (r2.dam.defne) panoHalka(K, t, tm.temiz, r2.dam.defne.p, 30); panoHalka(K, t, tm.kaldirirdi + 0.12, r2.rr.necmi.handL, 44); }
  ctx.restore();
  if (birles < 0.999) { ctx.save(); ctx.setTransform(base); ctx.globalAlpha = 1 - birles; ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 20); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
}
// ═══════════════════════════ draw ═══════════════════════════
export function draw(K, t, ep, tl, S) {
  const { tm } = S; S.tl = tl;
  const base = K.ctx.getTransform();
  let kartAlt = 300;
  H.cerceve(K, t, ep, tl, S, {
    kartSon: -1,   // kart ve sayaç bu bölümde ekran katmanında çizilir (kart kare 0'da yok, hq'da iner)
    kuyruksuz: (t, B) => B.sc.id === 'bolunme' && t < tm.birles1,
    kamera(cam, t) {   // sayaç: her saniye (tıkırtıyla) kalp atışı gibi hafif itme
      if (t >= tm.cd0 - 0.05 && t < tm.cd) { const f = ((t - tm.cd0) % 1 + 1) % 1; cam.zoom *= 1 + 0.02 * Math.exp(-f * 7) * (1 - Math.exp(-f * 45)); }
    },
    dunya(K, t, B) {
      const id = B.sc.id;
      if (id === 'ots1') return otsCiz(K, t, S, B, 'N');
      if (id === 'ots2') return otsCiz(K, t, S, B, 'D');
      if (id === 'bolunme' && t < tm.birles1) return bolunmus(K, t, S, B, base);
      if (B.sc.yakin) {   // aşırı yakın (sayıştaki gözler): ana kamera + kamera merkezinde ek büyütme
        const k = B.sc.yakin, c = B.cam, { ctx } = K, hs = {};
        ctx.save(); ctx.translate(c.cx, c.cy); ctx.scale(k, k); ctx.translate(-c.cx, -c.cy);
        odaCiz(K, t, S, { tl, t, heads: hs }); ctx.restore();
        for (const key of Object.keys(hs)) B.heads[key] = [c.cx + (hs[key][0] - c.cx) * k, c.cy + (hs[key][1] - c.cy) * k];
        return;
      }
      const tE = etkin(t, tm), geri = t >= tm.sar0 && t < tm.sar1;
      odaCiz(K, tE, S, { tl: geri ? null : tl, t, heads: B.heads });
    },
    ekran(K, t, B) {
      donma(K, t, tm);
      H.zamanHapi(K, t, tm.sar0 + 0.12, tm.sar1 + 0.78, K.up('1 dakika önce'), { y: 1292, saat: 14.98 });
      if (B.sc.id === 'bolunme' && t < tm.birles1) {   // pano etiketleri: aynı boy (48 px), aynı ağırlık; panonun üst kenarına oturur
        const s1 = 1 - ease.state(seg(t, tm.carpi + 0.22, 0.4)), { ctx } = K;
        ctx.font = '900 48px Rubik'; const w1 = ctx.measureText(K.up('ya temiz olsaydım?')).width + 58, w2 = ctx.measureText(K.up('gerçek')).width + 58;
        if (s1 > 0.01) { ctx.save(); ctx.globalAlpha = s1; H.tag(K, t, tm.bolunme + 0.22, tm.birles0, [PX + 30 + w1 / 2, P_UST], K.up('ya temiz olsaydım?'), HARDAL, INK, 48); ctx.restore(); }
        H.tag(K, t, tm.bolunme + 0.3, tm.birles0 - 0.1, [PX + 30 + w2 / 2, P_ALT], K.up('gerçek'), INK, PAL.paper, 48);
        carpiDamga(K, t, tm.carpi, tm.carpi + 0.42, [540, P_UST + 392], 82);   // hayalet elin üstüne değil, pastanın üstüne; hayaletle söner
      }
      // Necmi'nin aynalanan hayali (küçük, sağ üst köşe): yüzü temiz olsaydı Defne ilk "üç"te elini kaldırırdı
      const i0 = tm.inset0, i1 = i0 + 1.6;
      if (t >= i0 && t < i1 + 0.2) {
        const { ctx } = K, v = H.spring(t - i0, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, i1, 0.2)), k = (0.7 + 0.3 * v) * out;
        const bx = 300, by = 500, bw = 420, bh = 420;   // sol üst: Necmi'nin yüzüne binmez, telefonda okunur
        ctx.save(); ctx.translate(bx, by); ctx.scale(k, k); ctx.globalAlpha = clamp01(v * 1.6) * out;
        K.rect(-bw / 2 + 8, -bh / 2 + 10, bw, bh, INK, 0, 22); K.rect(-bw / 2, -bh / 2, bw, bh, PAL.paper, LW, 22);
        ctx.save(); ctx.beginPath(); ctx.roundRect(-bw / 2 + 6, -bh / 2 + 6, bw - 12, bh - 12, 18); ctx.clip();
        ctx.scale(0.86, 0.86); ctx.translate(-560, -1010);
        const tI = S.tm.say[2] - 0.7 + (t - i0) * 0.9;
        hayalet(K, K2 => odaCiz(K2, tI, S, { hayal: 'D', gecmis: true }), HARDAL, 0.85, 0.45);
        ctx.restore();
        ctx.beginPath(); ctx.roundRect(-bw / 2 + 12, -bh / 2 + 12, bw - 24, bh - 24, 16); ctx.setLineDash([16, 10]); ctx.lineWidth = 5; ctx.strokeStyle = HARDAL; ctx.stroke();
        ctx.restore();
        carpiDamga(K, t, i0 + 1.15, i1 - 0.05, [bx + 150, by - 150], 58);
      }
      const c0 = tm.cd - (ep.cdSure || 10);
      if (t >= c0 - 0.3 && t < tm.cd + 0.35) { const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.5 * clamp01((t - c0 + 0.3) / 0.3) * (1 - ease.exit(seg(t, tm.cd, 0.3))); ctx.fillStyle = INK; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      kartAlt = kartCiz(K, t, ep, tm);
      if (t >= tm.kartGir && t < tm.kartSon) sayac(K, t, tm.cd, { top: kartAlt + 20, share: ep.cdShare, dur: ep.cdSure || 10, perde: false });
    },
  });
}
