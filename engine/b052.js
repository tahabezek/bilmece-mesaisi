// Bölüm 52 · ŞERBETLİ YÜZLER 2 (044'ün devamı; v4 "hikâye" dili; storyboard: hikayeler/bolum_052_v5.md, yapı A: sondan başla).
// Logline: Ertesi yıl aynı doğum günü masasında bu kez Kerem de oyunda. Şerbet yine iki yüzde: Defne'nin ve Necmi'nin.
// İkinci sayışta iki el kalkar, üçüncü sayışta Kerem başını sallar.
// Akılda kalacak tek şey: başkalarının kalkan eli de bir bilgidir (Kerem, iki elin kalkmasından kendi yüzünün temiz olduğunu anlar).
// 044'ün dili ve parçaları (oda, şerbet damlası, geri sarma, yavaş çekim, omuz üstü, hayalet, bölünmüş ekran) buradan
// kopyalandı; adlar b052_. Fark: masada üç kişi (Defne, Kerem, Necmi; Kerem ortada, önden), kahraman an Kerem'in bakışından.
// Zaman: t video saati, tE etkin (hikâye) saat. Kanca = üçüncü sayışın kendisi (cevap bölümündeki an: tE = tR + t), donma,
// geri sarma (tR + 0,9 → ikinci sayıştan hemen önce, sıçrama, ikramın sonu → 2,6), sonra tE = t.
// Mantık uyarısı: oyun boyunca kimse kimin yüzünde şerbet olduğunu yüksek sesle söylemez. h1, d2, hd ve Defne'nin bütün
// cevap satırları iç sestir (dudak kıpırdamaz, balon "içinden"). Hikmet'in yüksek sesle söylediği tek bilgi "en az biriniz".
// Her kare t'nin saf fonksiyonudur; Math.random yok, kareler arası durum yok. Anlar ses çizelgesindeki kelime çapalarından.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const ODA = 'b052_oda';
const HX = 100, DX = 410, KX = 690, NX = 970;                 // Kerem masanın ortasında, önden; Defne ve Necmi iki yanında, birbirine dönük
const MASA = 1232, MASA_X0 = 30, MASA_X1 = 1560;
const PASTA = [262, MASA - 16], TEPSI = [690, MASA - 8], KTABAK = [808, MASA - 4], KCAY = [1170, MASA - 2], HCAY = [580, MASA - 2];
const AYNA = { x: -120, y: 905, w: 150, h: 196 }, SAAT = [1185, 860, 46];
// Kadrajlar: üçlü planlarda üç yüz de güvenli alanda (x 90–920); yüzler ekranda y 700–850
const DUO = [1.34, 690, 1100], DUO2 = [1.4, 690, 1090], DUO_G = [1.3, 690, 1108], HIK = [1.35, 200, 985];
const AMBER = '#C8651E', AMBER_K = '#73330B', PARLAK = '#FFFFFF', HARDAL = '#E0A82E';
const BAK_UST = '#E3A94C', BAK_ON = '#B8742C', FISTIK = '#7FA443';
const YANAK = { defne: [0.2, 0.31], necmi: [-0.22, 0.32], genc: [0.22, 0.3] };   // Kerem'in hayal damlası ekranın sağındaki yanağında

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
// Geri sarma: önce eller yavaşça iner ve Kerem'in başı geri döner, orta bölüm hızla akar (sıçrama burada), sonda damlalar
// baklavaya yavaşça döner. v = egri(GERI, u); v < 0,5 cevap bölümü (tR + 0,9 → ikinci sayıştan önce), v ≥ 0,5 ikramın sonu → 2,6.
const GERI = [[0, 0], [0.25, 0.08], [0.55, 0.8], [0.8, 0.93], [1, 1]];
function etkin(t, tm) {
  if (t < tm.don) return tm.tR + t;
  if (t < tm.sar0) return tm.tR + tm.don;
  if (t < tm.sar1) { const v = egri(GERI, (t - tm.sar0) / (tm.sar1 - tm.sar0)); return v < 0.5 ? lerp(tm.tR + tm.don, tm.sicra0, v / 0.5) : lerp(tm.sicra1, tm.sar1, (v - 0.5) / 0.5); }
  return t;
}
function dunyaSaati(tE, tm) {
  const a = tm.yavas0, b = tm.yavas1, r = 0.4;
  if (tE <= a) return tE;
  let m = Math.min(tE, b) - a;
  if (tE > b) { const x = Math.min(tE - b, r); m += x - x * x / (2 * r); }
  return tE - 0.75 * m;
}
const mumBoy = (tE, tm) => 1 - 0.012 * (Math.min(tE, tm.tR + tm.don) - 2.6);
function saatAt(tE, tm) {   // hikâyenin başı 14:59:00, kanca (üçüncü sayış) 15:00:00 ("1 DAKİKA ÖNCE" hapı saatle tutar)
  const a = tm.sar1, b = tm.tR + tm.don, sn = tE <= b ? 60 * (tE - a) / (b - a) : 60 + (tE - b);
  return { sn, saat: 14 + 59 / 60 + sn / 3600 };
}
const aynaAt = (tE, tm) => ease.state(seg(tE, tm.aynaCevir, tm.aynaTak - tm.aynaCevir));

// ═══════════════════════════ Çizim parçaları (044'ten) ═══════════════════════════
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
  const { ctx } = K, cx = 690, y0 = 560, y1 = 724;   // (052) 40 px yukarıda: cevaptaki sayış etiketi afişin altına sığsın
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
  } else if (key === 'genc') {   // (052) Kerem arkadan: kapüşonlu sweatshirt (kapüşon ensede kabarık), dağınık koyu saç başın arkasını kaplar
    ctx.beginPath(); ctx.moveTo(-0.34, 0.86); ctx.quadraticCurveTo(-0.38, 0.5, 0, 0.46); ctx.quadraticCurveTo(0.38, 0.5, 0.34, 0.86); ctx.quadraticCurveTo(0, 1.02, -0.34, 0.86); ctx.closePath(); fs(c.torso.shade);
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sg * w * 0.98, 0.06, c.head.ear, c.head.ear * 1.25, 0, 0, TAU); fs(c.skin); }
    ctx.beginPath(); ctx.ellipse(0, 0, w * 1.02, h, 0, 0, TAU); fs(c.skin);
    ctx.beginPath(); ctx.moveTo(-w * 1.04, h * 0.3);
    const tuy = [[-1.1, -0.55], [-0.85, -1.12], [-0.45, -0.98], [-0.2, -1.22], [0.18, -1.0], [0.45, -1.2], [0.8, -0.95], [1.12, -0.5]];
    for (const [a, b] of tuy) ctx.lineTo(w * a, h * b);
    ctx.lineTo(w * 1.04, h * 0.3); ctx.quadraticCurveTo(w * 0.7, h * 0.62, w * 0.3, h * 0.55); ctx.lineTo(w * 0.12, h * 0.72); ctx.lineTo(-w * 0.1, h * 0.56); ctx.quadraticCurveTo(-w * 0.7, h * 0.64, -w * 1.04, h * 0.3); ctx.closePath(); fs(c.hair);
    ctx.beginPath(); for (const [x0, y0, x1, y1] of [[-0.18, -0.3, -0.26, 0.2], [0.06, -0.38, 0.1, 0.18], [0.24, -0.25, 0.3, 0.22]]) { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); } ctx.lineWidth = lw * 0.6; ctx.strokeStyle = '#4A3A30'; ctx.stroke();
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

const IF = {
  kararli: { brow: -0.02, browTilt: 0.32, eye: 0.95, pupil: 1, curve: 0.28, open: 0, w: 0.85 },
  sus: { brow: 0.05, browTilt: -0.12, eye: 1.08, pupil: 0.9, curve: -0.12, open: 0, w: 0.5 },
  gergin: { brow: 0.03, browTilt: 0.1, eye: 1.05, pupil: 0.85, curve: -0.05, open: 0, w: 0.7 },
  bastirik: { brow: 0.06, browTilt: -0.2, eye: 0.9, pupil: 1, curve: 0.42, open: 0, w: 0.8 },
  kas: { brow: 0.12, browTilt: -0.3, eye: 1.08, pupil: 1, curve: 0.4, open: 0.12, w: 1.0 },
  kikir: { brow: 0.04, browTilt: -0.1, eye: 0.55, pupil: 1, curve: 0.8, open: 0.25, w: 1.15, smileEyes: true },
  cigne: { brow: 0.02, browTilt: 0, eye: 0.6, pupil: 1, curve: 0.5, open: 0, w: 0.9, smileEyes: true },
};
// ——— Kerem'in yeni eşyaları (052): yakasına sıkıştırılmış peçete önlük, çatal, kendi tabağı ———
// Önlük: boynun altından göğse inen krem üçgen, kenarında hardal şerit; iki ucu yakaya sıkışık
function onluk(K, kp) {
  const n = H.eklem('genc', kp, 'neck'), s = kp.s, { ctx } = K;
  const a = [n[0] - 0.25 * s, n[1] + 0.06 * s], b = [n[0] + 0.25 * s, n[1] + 0.06 * s], c = [n[0], n[1] + 0.66 * s];
  ctx.save(); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(n[0], n[1] + 0.14 * s, b[0], b[1]); ctx.lineTo(c[0] + 0.05 * s, c[1] - 0.04 * s); ctx.quadraticCurveTo(c[0], c[1] + 0.02 * s, c[0] - 0.05 * s, c[1] - 0.04 * s); ctx.closePath();
  K.fs(PAL.cream, LW * 0.75);
  ctx.beginPath(); ctx.moveTo(a[0] + 0.07 * s, a[1] + 0.12 * s); ctx.lineTo(c[0], c[1] - 0.13 * s); ctx.lineTo(b[0] - 0.07 * s, b[1] + 0.12 * s); ctx.lineWidth = 0.035 * s; ctx.strokeStyle = PAL.mustard; ctx.stroke();
  for (const sg of [-1, 1]) K.poly([[n[0] + sg * 0.25 * s, n[1] + 0.06 * s], [n[0] + sg * 0.15 * s, n[1] - 0.02 * s], [n[0] + sg * 0.12 * s, n[1] + 0.1 * s]], PAL.cream, LW * 0.6);
  ctx.restore();
}
// Çatal: sap elden açıyla çıkar, uçta üç diş; lokma = dişlerde küçük baklava parçası
function catal(K, [x, y], ang, k = 1, lokma = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k); ctx.lineCap = 'round';
  K.line(0, 0, 62, 0, 9, INK); K.line(0, 0, 62, 0, 4.5, '#D9DDE0');
  K.rect(60, -9, 12, 18, '#D9DDE0', 3, 3);
  for (const dy of [-7, 0, 7]) { K.line(70, dy, 92, dy, 6, INK); K.line(70, dy, 92, dy, 2.4, '#D9DDE0'); }
  if (lokma > 0.02) { ctx.save(); ctx.translate(90, 0); ctx.scale(lokma, lokma); K.poly([[-12, -13], [14, -2], [-8, 14]], BAK_UST, LW * 0.45); K.circ(-2, 0, 4, FISTIK, 0); ctx.restore(); }
  ctx.restore();
}
function keremTabak(K, [x, y]) {
  K.ell(x + 4, y + 6, 66, 15, INK, 0); K.ell(x, y, 66, 15, PAL.paper, LW * 0.7); K.ell(x, y - 2, 46, 9, '#EFE9DC', 0);
  baklava(K, [x - 8, y - 12], 0.62); 
}

// ═══════════════════════════ Mekân (044'ün odası, ertesi yıl) ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-700, 2000], zemin: 1500, dongu: ['mum alevleri', 'balonların salınımı', 'duvar saati', 'çay buharı'],
  capa: { ayna: [AYNA.x + AYNA.w / 2 - 8, AYNA.y + 6], tepsi: TEPSI, pasta: PASTA },
  kadraj: { uclu: DUO, uclu2: DUO2, ikram: DUO_G, hikmet: HIK },
  arka(K, t, { durum }) {
    M.oda(K, { x0: -900, x1: 2300, isik: M.ISIK.gunduz, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 1290, 640, 330, 330, { isik: M.ISIK.gunduz, t });
    bayraklar(K); afis(K); aynaCiz(K, durum.ayna || 0);
    M.duvarSaati(K, SAAT[0], SAAT[1], SAAT[2], durum.saat ?? 15, durum.sn ?? t);
    balonlar(K, t);
  },
  on(K) { masaCiz(K); },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e);
  const tK2 = T('d4:8') + 0.03;                                  // ikinci sayışın "üç"ü: iki el kalkar ("anlarız")
  const d4 = T('d4');
  const tm = {
    don: 0.9, sar0: 1.6, sar1: 2.6, tK2,
    tR: T('d6:6') - 0.15,                                        // üçüncü sayış: Kerem "anlar"da başını sallar (tR + 0,15); kanca bu an
    cd: T(ep.countdown), buldum: T('d3'), kipir: T('d3:3') - 0.05, end: T('d7>') + 0.1,
    // ikram ve yavaş çekim: damlalar "kişide"de yanaklara konar
    sun: 2.62, alT: 2.96, agiz: 3.48, isir: T('h1:4') - 0.2, kon: T('h1:8'),
    // ayna, omuz üstü, kural, soru
    aynaBak: T('h2a') - 0.32, aynaKes: T('h2a') - 0.1, aynaCevir: T('h2a:1') - 0.02, sus: T('h2a:2') - 0.12,
    ots1: T('h2b') - 0.06, hik: T('h2c') - 0.06, elKal: T('h2c:3') - 0.12, basSal: T('h2c:7') - 0.05,
    uc: T('hq:1') - 0.1, soru: T('hq:4') - 0.08, kartGir: T('hq:4') - 0.02,
    // yanlış deneme: Defne'nin hayali (üç el birden), Hikmet'in iç sesi, Kerem'in temiz yüzü
    dHayal: T('d2') - 0.05, hayal0: T('d2') + 0.2, hepimiz: T('d2:5'), hayalX: T('hd:1'), kYakin: T('hd:2') - 0.1,
    // cevap: sayışlar (Hikmet sessiz sayar; tıkırtılar), Kerem'in omzu, bölünmüş ekran, üçüncü sayış
    say1: d4 - 0.05, say2: Math.max(d4 + 1.5, T('d4:6') - 0.58), say3: T('d4:8') - 0.4, kOts: T('d5') - 0.03,
    bolunme: T('d5>') + 0.1, carpi: T('d6:3'),
    d5a: T('d5:1') - 0.02, d5b: T('d5:2') - 0.02,
    kerem: T('h4') - 0.15, pat: T('h4:4') - 0.12, cta: T('d7') - 0.2,
  };
  Object.assign(tm, {
    k1: [d4 + 0.2, d4 + 0.74, d4 + 1.28],
    cd0: tm.cd - (ep.cdSure || 10), indir: T('h4') + 0.05,
    yavas0: tm.isir + 0.03, yavas1: tm.kon + 0.06, ucus: tm.isir + 0.11,
    aynaTak: tm.aynaCevir + 0.23, genis: T('h2a:2') + 0.35, kikir: tm.aynaKes - 0.1,
    kaymaP: T('d6:1') - tK2,                                     // bölünmüş ekran: geçmişin ikinci "üç"ü d6'nın "kalkınca"sına oturur
    birles0: tm.carpi + 0.42, birles1: tm.carpi + 0.82,
    sicra0: tK2 - 0.2, sicra1: tm.aynaCevir - 0.08,
    kartSon: tm.say1, proof: tm.say1,
  });
  tm.k2 = [tm.say2 + 0.22, tm.say2 + 0.76, tK2 - 0.03];
  tm.k3 = [tm.carpi + 0.3, tm.carpi + 0.66, tm.tR + 0.15];
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...DUO], [0.12, ...DUO2], [tm.sar0, ...DUO_G]] },
    { id: 'yavas', t0: tm.yavas0, cam: [[0, 1.4, 690, 1040], [tm.yavas0 + 0.05, 1.44, 690, 1030, 0, [36, 12]], [tm.yavas1, ...DUO_G]] },
    { id: 'ayna', t0: tm.aynaKes, cam: [[0, 1.3, 120, 990], [tm.genis, ...DUO_G]] },
    { id: 'otsK', t0: tm.ots1, cam: [[0, 1.26, 690, 1072], [tm.ots1 + 1.4, 1.3, 690, 1066]] },          // Kerem'in omzunun üstünden: iki şerbetli yüz
    { id: 'kural', t0: tm.hik, cam: [[0, ...HIK], [tm.hik + 1.6, 1.37, 205, 982], [tm.soru, 1.3, 240, 1040]] },
    { id: 'dYakin', t0: tm.dHayal, cam: [[0, 1.38, 600, 905], [tm.dHayal + 2.5, 1.4, 598, 902]] },  // Defne yakın, sağda hayal kutusu
    { id: 'kYakin', t0: tm.kYakin, cam: [[0, 1.42, 690, 1060]] },                                      // Kerem'in temiz yüzü
    { id: 'sayac', t0: tm.cd0 - 0.3, cam: [[0, ...DUO_G], [tm.cd0 + 5, 1.36, 690, 1100], [tm.cd - 0.4, 1.42, 690, 1094]] },
    { id: 'buldum', t0: tm.buldum - 0.05, cam: [[0, 1.35, 560, 1060]] },
    { id: 'say1', t0: tm.say1, cam: [[0, ...DUO], [tm.say1 + 1.2, 1.37, 690, 1096]] },
    { id: 'say2', t0: tm.say2, kisa: true, cam: [[0, 1.45, 200, 960]] },                               // Hikmet'in sayan parmakları
    { id: 'say3', t0: tm.say3, kisa: true, cam: [[0, ...DUO]] },
    { id: 'otsK2', t0: tm.kOts, cam: [[0, 1.26, 690, 1130], [tm.kOts + 1.2, 1.29, 690, 1126]] },      // Kerem iki şerbetli yüz ve iki kalkık el görür
    { id: 'bolunme', t0: tm.bolunme, cam: [[0, ...DUO], [tm.tR, ...DUO], [tm.tR + 0.12, ...DUO2]] },
    { id: 'kerem', t0: tm.kerem, cam: [[0, 1.45, 690, 1040], [tm.kerem + 1.6, 1.46, 690, 1034], [tm.cta, 1.35, 480, 1070]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (hikâye saati). Kanca ve üçüncü sayış aynı anahtarları okur; geri sarma bunları tersinden gezer. ———
  const defBase = kisi('defne', { x: DX, expr: 'notr', head: { tilt: 3, look: [0.7, 0.2] }, ...POZ.dur });
  const def = [
    [tm.sun, { expr: 'mutlu', head: { tilt: 4, look: [0.55, 0.6] } }, 0.01],
    [tm.agiz - 0.2, { head: { tilt: 2, look: [0.25, 0.35] } }, 0.3],
    [tm.isir - 0.18, { expr: 'mutlu', blink: 1, head: { tilt: -7, look: [0.2, 0.3] } }, 0.14],
    [tm.kon + 0.16, { blink: null, expr: IF.cigne, head: { tilt: 3, look: [0.85, 0.15] } }, 0.22],
    [tm.kon + 0.6, { expr: IF.bastirik, head: { tilt: 5, look: [0.9, 0.3] } }, 0.3],
    [tm.aynaBak, { expr: 'notr', head: { tilt: -4, look: [-0.95, -0.15] } }, 0.18],
    [tm.aynaTak + 0.05, { expr: IF.sus, head: { tilt: 0, look: [-0.75, 0.05] } }, 0.22],
    [tm.ots1 - 0.05, { expr: 'notr', head: { tilt: 4, look: [0.88, 0.25] } }, 0.25],
    [tm.hik, { head: { tilt: -3, look: [-0.82, 0.02] } }, 0.25],
    [tm.soru, { expr: IF.gergin, head: { tilt: 2, look: [0.6, 0.2] } }, 0.25],
    [tm.dHayal, { expr: H.IFADE.dusun, head: { tilt: -5, look: [0.35, -0.5] } }, 0.25],
    [tm.hepimiz, { expr: 'mutlu', head: { tilt: 4, look: [0.4, -0.45] } }, 0.25],
    [tm.hayalX, { expr: 'saskin', head: { tilt: 2, look: [0.55, 0.2] } }, 0.22],
    [tm.cd0, { expr: H.IFADE.dusun, head: { tilt: -3, look: [0.6, -0.2] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0.25, -0.35] } }, 0.25, ease.enter],
    [tm.kipir, { head: { tilt: 4, look: [0.75, 0.05] } }, 0.25],
    [tm.say1, { expr: IF.gergin, head: { tilt: 2, look: [0.9, 0.25] } }, 0.2],
    [tm.k1[1], { head: { look: [0.55, 0.18] } }, 0.16],
    [tm.k1[2] + 0.3, { expr: H.IFADE.dusun, head: { tilt: -3, look: [0.88, 0.2] } }, 0.25],
    [tK2 - 0.15, { expr: IF.kararli, head: { tilt: 3, look: [0.9, 0.25] } }, 0.15],
    [tK2 + 0.5, { head: { tilt: 3, look: [0.55, 0.2] } }, 0.3],
    [tm.tR - 0.1, { expr: IF.kararli, head: { tilt: 3, look: [0.6, 0.18] } }, 0.2],    // kanca pozu
    [tm.indir, { expr: 'mutlu', head: { tilt: 4, look: [0.6, 0.12] } }, 0.3],
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
    [tm.soru, { expr: IF.gergin, head: { tilt: -2, look: [-0.55, 0.2] } }, 0.25],
    [tm.hayalX, { expr: 'notr', head: { tilt: -3, look: [-0.55, 0.2] } }, 0.25],
    [tm.cd0, { expr: H.IFADE.dusun2, head: { tilt: 3, look: [-0.6, -0.2] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'saskin', head: { tilt: -4, look: [-0.9, 0.1] } }, 0.25],
    [tm.say1, { expr: IF.gergin, head: { tilt: -2, look: [-0.9, 0.25] } }, 0.2],
    [tm.k1[1] + 0.1, { head: { look: [-0.55, 0.18] } }, 0.16],
    [tm.k1[2] + 0.35, { expr: H.IFADE.dusun2, head: { tilt: 4, look: [-0.88, 0.2] } }, 0.25],
    [tK2 - 0.15, { expr: IF.kararli, head: { tilt: -3, look: [-0.9, 0.25] } }, 0.15],
    [tK2 + 0.6, { head: { tilt: -3, look: [-0.55, 0.2] } }, 0.3],
    [tm.tR - 0.1, { expr: IF.kararli, head: { tilt: -3, look: [-0.6, 0.18] } }, 0.2],  // kanca pozu
    [tm.indir, { expr: 'mutlu', head: { tilt: -4, look: [-0.6, 0.12] } }, 0.3],
    [tm.cta + 0.3, { expr: 'mutlu', head: { tilt: -3, look: [-0.85, 0.15] } }, 0.3],
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
    [tm.elKal, { expr: IF.kas, head: { tilt: 4, look: [0.7, 0.1] } }, 0.25],
    [tm.uc, { expr: IF.kas, head: { tilt: -3, look: [0.5, 0.1] } }, 0.25],
    [tm.soru, { expr: 'mutlu', head: { tilt: 4, look: [0.04, 0.04] } }, 0.3],
    [tm.cd0 + 0.1, { expr: 'mutlu', head: { tilt: 3, look: [0.8, 0.2] } }, 0.4],
    [tm.buldum, { expr: 'notr', head: { tilt: -2, look: [0.8, 0.15] } }, 0.3],
    [tm.say1, { expr: 'notr', head: { tilt: 0, look: [0.7, 0.2] } }, 0.25],
    [tm.k2[0], { head: { look: [0.6, 0.35] } }, 0.15], [tm.k2[1], { head: { look: [0.95, 0.2] } }, 0.15],
    [tK2 + 0.2, { expr: 'saskin', head: { tilt: 5, look: [0.9, 0.15] } }, 0.25],
    [tm.kerem - 0.1, { expr: 'kizgin', head: { tilt: 3, look: [0.95, 0.0] } }, 0.25],
  ].sort((a, b) => a[0] - b[0]);
  const kerBase = kisi('genc', { x: KX, expr: 'notr', head: { tilt: 0, look: [0.0, 0.5] }, ...POZ.dur });
  const mutluKapali = { ...H.EXPR.mutlu, open: 0, curve: 0.55, eye: 0.85, smileEyes: false };
  const ker = [
    [tm.sun, { expr: 'notr', head: { tilt: 2, look: [-0.1, 0.75] } }, 0.3],
    [tm.ucus, { expr: 'saskin', head: { tilt: -3, look: [-0.55, -0.7] } }, 0.25],           // damlalar başının üstünden çaprazlanır
    [tm.ucus + 0.9, { head: { tilt: 3, look: [0.55, -0.7] } }, 0.6],
    [tm.kon + 0.3, { expr: IF.bastirik, head: { tilt: -2, look: [-0.8, 0.12] } }, 0.25],
    [tm.kon + 1.0, { head: { tilt: 2, look: [0.8, 0.12] } }, 0.3],
    [tm.aynaBak + 0.05, { expr: 'notr', head: { tilt: -2, look: [-0.95, 0.0] } }, 0.25],
    [tm.ots1 - 0.05, { expr: 'notr', head: { tilt: 0, look: [-0.75, 0.12] } }, 0.25],
    [tm.hik, { head: { tilt: -2, look: [-0.95, 0.02] } }, 0.25],
    [tm.soru + 0.3, { expr: IF.gergin, head: { tilt: 2, look: [-0.75, 0.15] } }, 0.25],
    [tm.soru + 1.4, { head: { tilt: -2, look: [0.75, 0.15] } }, 0.3],
    [tm.kYakin, { expr: mutluKapali, head: { tilt: 4, look: [0.05, 0.08] } }, 0.01],
    [tm.cd0, { expr: H.IFADE.dusun, head: { tilt: 0, look: [-0.6, 0.1] } }, 0.4],
    [tm.buldum, { expr: 'notr', head: { tilt: -2, look: [-0.8, 0.1] } }, 0.25],
    [tm.say1, { expr: IF.gergin, head: { tilt: 0, look: [-0.8, 0.15] } }, 0.2],
    [tm.k1[1], { head: { look: [0.8, 0.15] } }, 0.16],
    [tm.k1[2] + 0.25, { head: { look: [-0.8, 0.15] } }, 0.2],
    [tK2 + 0.06, { expr: 'saskin', head: { tilt: -3, look: [-0.82, 0.0] } }, 0.15],        // iki el kalkar: önce Defne'ye
    [tK2 + 0.55, { head: { tilt: 3, look: [0.82, 0.0] } }, 0.25],                           // sonra Necmi'ye
    [tm.carpi + 0.45, { expr: H.IFADE.dusun, head: { tilt: -2, look: [0.1, -0.2] } }, 0.25],
    [tm.tR - 0.08, { expr: IF.kararli, head: { tilt: 0, look: [0.0, 0.08] } }, 0.15],       // kanca pozu: başını sallar
    [tm.kerem + 0.1, { expr: mutluKapali, head: { tilt: 5, look: [0.04, 0.06] } }, 0.25],
    [tm.cta, { head: { tilt: 2, look: [-0.8, 0.12] } }, 0.3],
  ].sort((a, b) => a[0] - b[0]);
  const kLokma = [tm.sun + 0.45, T('h2a:3') + 0.05, T('h2c:4'), T('hq:2'), tm.kYakin + 0.35, tm.cd0 + 1.3, tm.cd0 + 4.4, tm.cd0 + 7.5];
  return { tm, film, def, defBase, nec, necBase, hik, hikBase, ker, kerBase, kLokma };
}

// ═══════════════════════════ Karakter durumları ═══════════════════════════
// Sayaçta kaçamak bakışlar: biri bakarken öteki düşünür (durağanlık olmasın)
function sayacBakis(p, tE, tm, yon, f = yon > 0 ? 0 : 0.9, L = [[0.92 * yon, 0.38], [-0.35 * yon, -0.55], [0.55 * yon, 0.3], [0.15 * yon, 0.7]]) {
  const k = tE - tm.cd0, i = Math.floor((k + f) / 1.8), u = ease.state(clamp01(((k + f) % 1.8) / 0.3));
  const a = L[(i + 3) % 4], b = L[i % 4];
  p.head = { ...p.head, look: [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], tilt: (p.head.tilt || 0) + 3 * Math.sin(k * 0.9 + f) };
}
// Defne / Necmi: iç el (Kerem'e dönük) tepsi → ağız → masa → ikinci sayışta kalk; dış el masada.
const IC = { defne: 'R', necmi: 'L' }, DIS = { defne: 'L', necmi: 'R' }, YON = { defne: 1, necmi: -1 };
function ikiliDurum(key, tE, S, o) {
  const { tm } = S, sg = YON[key], ic = IC[key];
  const p = H.poseAt(H.CARDS[key], key === 'defne' ? S.defBase : S.necBase, key === 'defne' ? S.def : S.nec, tE);
  if (tE >= tm.cd0 && tE < tm.cd) sayacBakis(p, tE, tm, sg);
  if (key === 'defne') p.y -= H.buldumHop(tE, tm.buldum);
  if (tE > tm.genis + 0.3 && tE < tm.ots1) H.onayla(p, tE, tm.genis + 0.32 + (key === 'necmi' ? 0.12 : 0), 1, 0.4);
  const X = p.x, sh = H.shoulder(key, p, ic), arm = (H.CARDS[key].arm.upper + H.CARDS[key].arm.lower) * p.s;
  const masaI = [X + sg * 84, MASA - 12], masaD = [X - sg * 80, MASA - 12];
  const kalkY = [sh[0] + sg * 0.3 * arm, sh[1] - 0.85 * arm];    // başın yanına kalkar: ne kendi yüzüne ne Kerem'in yüzüne biner
  const agiz = yuzNokta(key, p, 0.12 * sg, 0.45);
  const tepsiY = key === 'defne' ? TEPSI_D : TEPSI_N;
  let hedef = masaI, w = 1, elde = null, isir = 0, parmak = 0, isaretH = null, pec = null;
  // 1) ikram: tepsiye uzan, al, ağza götür, ısır, yavaş çekim, masaya
  const alW = W(tE, tm.alT - 0.27, 0.27), agW = W(tE, tm.alT + 0.16, tm.agiz - tm.alT - 0.16), inW = W(tE, tm.kon + 0.95, 0.32);
  if (tE >= tm.sun && tE < tm.kon + 1.4) {
    hedef = kar(kar(masaI, ekle(tepsiY, [0, -18]), alW), agiz, agW);
    if (inW > 0) hedef = kar(hedef, masaI, inW);
    if (tE >= tm.alT - 0.02 && tE < tm.kon + 0.95) { elde = 'baklava'; isir = tE >= tm.isir ? (tE >= tm.kon + 0.6 ? 2 : 1) : 0; }
  }
  // 2) ikinci sayış: iç el "anlarız"da kalkar, h4'te iner (Kerem'in hayalinde kalkmaz)
  let kalk = o.hayal === 'K' ? 0 : ease.enter(seg(tE, tm.tK2, 0.22)) * (1 - W(tE, tm.indir, 0.36));
  if (kalk > 0) { hedef = kar(hedef, kalkY, kalk); if (kalk > 0.6) parmak = 4; }
  // 3) Buldum (Defne): yumruk havaya, "Kerem" deyince Kerem'i gösterir
  if (key === 'defne' && tE >= tm.buldum - 0.06 && tE < tm.say1) {
    const u1 = ease.enter(seg(tE, tm.buldum - 0.05, 0.25)), u2 = W(tE, tm.kipir - 0.05, 0.3);
    const kYuz = [KX - 30, 1000], yon = H.unit(sh, kYuz), gos = [sh[0] + yon[0] * 0.55 * arm, sh[1] + yon[1] * 0.55 * arm];   // el Defne'nin önünde kalır, parmak Kerem'i gösterir
    hedef = kar(kar(masaI, [kalkY[0] + 6, kalkY[1] - 10], u1), gos, u2);
    if (u2 > 0.55) isaretH = kYuz;
  }
  // 4) çağrı (Defne): peçeteyle yanağını siler, sonra peçeteyi indirir
  if (key === 'defne' && tE >= tm.cta) {
    const al = W(tE, tm.cta + 0.12, 0.32), bit = W(tE, tm.cta + 1.05, 0.34), sil = tE > tm.cta + 0.44 && tE < tm.cta + 1.05 ? Math.sin(TAU * 2.4 * (tE - tm.cta - 0.44)) : 0;
    const yanak = yuzNokta(key, p, 0.36, 0.2);
    hedef = kar(kar(masaI, [yanak[0] + 4, yanak[1] + 22 + 10 * sil], al), masaI, bit);
    if (al > 0.3 && bit < 0.7) pec = true;
  }
  return { p, key, ic, dis: DIS[key], L: ic === 'L' ? [hedef, w, 'A'] : [masaD, 1, 'A'], R: ic === 'R' ? [hedef, w, 'A'] : [masaD, 1, 'A'], elde, isir, parmak, isaretH, pec, kalk };
}
// Şerbet damlası (dünya): yanak noktası pozdan hesaplanır, baş dönse de damla yanakta kalır. Uçuşta Kerem'in başının üstünden geçer.
function damlaDurum(d, tE, S, o) {
  const { tm } = S, { key, p } = d, [lx, ly] = YANAK[key], r = 0.074 * p.s;
  if (key === 'defne' && tE >= tm.cta + 0.62) return tE < tm.cta + 0.8 ? { p: yuzNokta(key, p, lx, ly), r, a: 1 - seg(tE, tm.cta + 0.62, 0.18) } : null;
  if (tE < tm.ucus) return null;
  const kon = yuzNokta(key, p, lx, ly);
  if (tE < tm.kon) {
    const u = seg(tE, tm.ucus, tm.kon - tm.ucus), e = ease.state(u), bas = o.kaynak || yuzNokta(key, p, 0.2 * YON[key], 0.5), L = 210;
    const q = H.yay(bas, kon, e, L), v = H.unit(H.yay(bas, kon, Math.max(0, e - 0.04), L), q);
    const iz = []; for (let j = 0; j <= 10; j++) iz.push(H.yay(bas, kon, Math.max(0, e - 0.3 * (1 - j / 10)), L));
    return { p: q, r: r * lerp(0.75, 1.12, Math.min(1, u * 3)), rot: Math.atan2(v[1], v[0]) - Math.PI / 2, uzun: 1 + 0.35 * Math.sin(Math.PI * u), ucus: true, iz2: iz };
  }
  return { p: kon, r, uzun: ezil(tE, tm.kon) };
}
// Hikmet: dış el (aynayı çevirir), iç el (ikram, kıkırdama, "şş", kuralı gösterme, üç parmak, "kim?" avuçları, sessiz sayış)
const HSAY = [236, 972];
function hikmetDurum(tE, S) {
  const { tm } = S, p = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, tE);
  const shR = H.shoulder('hikmet', p, 'R'), shL = H.shoulder('hikmet', p, 'L');
  let R = null, L = null, parmak = null;
  const ik = pw(tE, tm.sun + 0.05, tm.alT + 0.3, 0.3, 0.32);
  if (ik > 0.01) { R = [[shR[0] + 82, shR[1] + 66], ik, 'A']; if (ik > 0.6) parmak = { n: 4, yon: -0.55, ac: 0.3 }; }
  const kk = pw(tE, tm.kikir, tm.aynaCevir - 0.14, 0.2, 0.2);
  if (kk > 0.01) { R = [yuzNokta('hikmet', p, 0.1, 0.46), kk, 'A']; p.y += 5 * Math.abs(Math.sin(TAU * 3 * (tE - tm.kikir))) * kk; }
  const ay = pw(tE, tm.aynaCevir - 0.04, tm.aynaTak + 0.12, 0.27, 0.3);
  if (ay > 0.01) { const u = aynaAt(tE, tm), kx = AYNA.x + (AYNA.w / 2 - 8) * Math.cos(Math.PI * u); L = [[kx, AYNA.y + 8], ay, 'A']; }
  const ss = pw(tE, tm.sus, tm.ots1 - 0.25, 0.26, 0.3);
  if (ss > 0.01) { R = [yuzNokta('hikmet', p, 0.04, 0.5), ss, 'A']; if (ss > 0.6) parmak = { n: 1, yon: -Math.PI / 2, boy: 1.05 }; }
  // kural: "elini kaldırsın"da elini kaldırıp gösterir, "sallasın"da başını sallar
  const kr = pw(tE, tm.elKal, tm.elKal + 1.05, 0.3, 0.3);
  if (kr > 0.01) { R = [H.elYeri('hikmet', p, 'R', 'yukari'), kr, 'B']; if (kr > 0.6) parmak = { n: 4, yon: -Math.PI / 2 + 0.15, ac: 0.3 }; }
  if (tE > tm.basSal - 0.05 && tE < tm.basSal + 1) H.onayla(p, tE, tm.basSal, 2, 0.3);
  // "üçe kadar": üç parmak
  const uc = pw(tE, tm.uc, tm.soru - 0.04, 0.28, 0.25);
  if (uc > 0.01) { R = [HSAY, uc, 'A']; if (uc > 0.6) parmak = { n: 3, yon: -Math.PI / 2, ac: 0.42, toplam: 3 }; }
  // "Kim?": iki avuç yukarı açılır
  const ns = pw(tE, tm.soru - 0.04, tm.cd0 + 0.2, 0.28, 0.35);
  if (ns > 0.01) { R = [[shR[0] + 92, shR[1] - 4], ns, 'B']; L = [[shL[0] - 120, shL[1] - 20], ns, 'B']; if (ns > 0.6) parmak = { n: 4, yon: -1.15, ac: 0.3, iki: true }; }
  // cevaptaki sessiz sayışlar: her sayışta üç parmaktan başlar, her tıkırtıda biri kapanır
  const G = [tm.k1, tm.k2, tm.k3], say = pw(tE, tm.k1[0] - 0.45, tm.k3[2] + 0.45, 0.28, 0.3);
  if (say > 0.01) {
    R = [HSAY, say, 'A'];
    let n = 3;
    G.forEach((g, gi) => { if (tE >= g[0] - 0.42) { n = gi ? 3 * ease.enter(seg(tE, g[0] - 0.42, 0.3)) : 3; for (const s of g) n -= ease.state(seg(tE, s - 0.02, 0.12)); } });
    if (say > 0.6) parmak = { n: Math.max(0, n), yon: -Math.PI / 2, ac: 0.42, toplam: 3 };
  }
  return { p, R, L, parmak };
}
// Kerem (052): masanın ortasında, önden. Yakasında peçete önlük, sağ elinde çatal; şerbeti bulaştırmadan yer.
// Sağ el tabakla ağız arasında gidip gelir (çatal ucu ağızda durur), sol el masada. h4'te sol eliyle önlüğüne vurur.
// Hayalde ('hepsi') çatallı elini kaldırır. Üçüncü sayışta (tR + 0,15) başını sallar.
const CATAL_DIN = Math.PI - 0.35, CATAL_AGIZ = Math.PI + 0.65, CATAL_BOY = 90;
function keremDurum(tE, S, o = {}) {
  const { tm } = S, p = H.poseAt(H.CARDS.genc, S.kerBase, S.ker, tE);
  if (tE >= tm.cd0 && tE < tm.cd) sayacBakis(p, tE, tm, 1, 0.45, [[-0.85, 0.15], [0.0, -0.45], [0.85, 0.15], [0.0, 0.6]]);
  if (!o.hayal && !o.hepsi && tE > tm.tR) H.onayla(p, tE, tm.tR + 0.15, 2, 0.32);
  const sh = H.shoulder('genc', p, 'R'), arm = (H.CARDS.genc.arm.upper + H.CARDS.genc.arm.lower) * p.s;
  const dinR = [KTABAK[0] + 44, MASA - 26], dinL = [KX - 74, MASA - 12];
  const agiz = yuzNokta('genc', p, 0.02, 0.44);
  let lok = 0, cigne = 0, parca = 0;
  for (const b of S.kLokma) {
    const u = pw(tE, b, b + 0.25, 0.3, 0.32);
    lok = Math.max(lok, u);
    if (tE > b - 0.4 && tE < b + 0.12) parca = 1;
    if (tE > b + 0.2 && tE < b + 1.6) cigne = Math.max(cigne, Math.abs(Math.sin(TAU * 1.7 * (tE - b - 0.2))) * (1 - seg(tE, b + 1.3, 0.3)));
  }
  let ang = lerp(CATAL_DIN, CATAL_AGIZ, lok);
  const dAgiz = [Math.cos(CATAL_AGIZ), Math.sin(CATAL_AGIZ)];
  let elR = kar(dinR, [agiz[0] - dAgiz[0] * CATAL_BOY, agiz[1] - dAgiz[1] * CATAL_BOY], lok), elL = dinL;
  if (o.hepsi) {
    const ka = ease.enter(seg(tE, tm.tK2, 0.22));
    elR = kar(elR, [sh[0] + 0.3 * arm, sh[1] - 0.85 * arm], ka); ang = lerp(ang, Math.PI * 1.5, ka);
  }
  if (!o.hayal && !o.hepsi) {
    const pt = pw(tE, tm.pat, tm.pat + 0.8, 0.28, 0.3), n = H.eklem('genc', p, 'neck');
    if (pt > 0.01) { elL = kar(elL, [n[0] - 0.02 * p.s, n[1] + 0.3 * p.s + 9 * Math.abs(Math.sin(TAU * 2.5 * (tE - tm.pat - 0.28)))], pt); }
  }
  p.talk = 0.6 * cigne;
  return { p, L: [elL, 1, 'A'], R: [elR, 1, 'A'], ang, parca };
}

// ═══════════════════════════ Oda sahnesi (her görünüş bunu çağırır) ═══════════════════════════
// o = { tl, t (dudak), heads, hayal: 'K' (Kerem'in hayali: onun yüzünde de şerbet, ikinci sayışta el kalkmaz),
//       hepsi (Defne'nin hayali: üçü birden el kaldırır), gizle: kimi çizme (omuz üstü), gecmis }
function odaCiz(K, tE, S, o = {}) {
  const { tm } = S, { ctx } = K, Wt = dunyaSaati(tE, tm), sa = saatAt(tE, tm);
  M.mekanCiz(K, ODA, 'arka', Wt, { durum: { ayna: aynaAt(tE, tm), saat: sa.saat, sn: sa.sn } });
  const konus = key => (o.tl && !o.tl.lines.some(l => l.ic && l.who === key && o.t >= l.t0 - 0.02 && o.t <= l.t1) ? H.talkAt(o.tl, key, o.t) : 0);   // iç ses: dudak kıpırdamaz
  // ——— Hikmet ———
  const hd = hikmetDurum(tE, S);
  if (hd.R) H.reach('hikmet', hd.p, 'R', hd.R[0], hd.R[1], hd.R[2]);
  if (hd.L) H.reach('hikmet', hd.p, 'L', hd.L[0], hd.L[1], hd.L[2]);
  hd.p.talk = konus('hikmet');
  const hr = H.drawChar(ctx, 'hikmet', hd.p, tE);
  if (o.heads) o.heads.hikmet = hr.head;
  // ——— Kerem (ortada; ikilinin uzanan kolları onun önünden geçer) ———
  const kd = keremDurum(tE, S, o);
  let kr = null;
  if (o.gizle !== 'genc') {
    for (const sd of ['L', 'R']) H.reach('genc', kd.p, sd, kd[sd][0], kd[sd][1], kd[sd][2]);
    kr = H.drawChar(ctx, 'genc', kd.p, tE);
    onluk(K, kd.p);
    if (o.heads) o.heads.genc = kr.head;
  }
  // ——— Necmi, Defne ———
  const dd = { necmi: ikiliDurum('necmi', tE, S, o), defne: ikiliDurum('defne', tE, S, o) }, rr = {};
  for (const key of ['necmi', 'defne']) {
    const d = dd[key];
    if (o.gizle === key) continue;
    H.reach(key, d.p, 'L', d.L[0], d.L[1], d.L[2]); H.reach(key, d.p, 'R', d.R[0], d.R[1], d.R[2]);
    d.p.talk = konus(key);
    if (key === 'defne') H.buldumIsin(K, tE, tm.buldum, H.eklem('defne', d.p, 'head'), { son: tm.say1 - 0.4 });
    rr[key] = H.drawChar(ctx, key, d.p, tE);
    if (o.heads) o.heads[key] = rr[key].head;
  }
  // ——— masa ve üstündekiler ———
  M.mekanCiz(K, ODA, 'on', Wt);
  pasta(K, PASTA, mumBoy(tE, tm), Wt);
  tepsi(K, TEPSI, { alD: tE >= tm.alT - 0.02, alN: tE >= tm.alT - 0.02 });
  keremTabak(K, KTABAK);
  cayBardagi(K, KCAY[0], KCAY[1], 1.25, Wt); cayBardagi(K, HCAY[0], HCAY[1], 1.1, Wt + 0.7);
  for (const key of ['necmi', 'defne']) {
    const d = dd[key];
    if (o.gizle === key) continue;
    kolUst(K, key, d.p, d.dis);
    if ((!d.elde && !d.pec && d.kalk < 0.12 && tE >= tm.sun) || d.isaretH) kolUst(K, key, d.p, d.ic);
  }
  if (kr) {   // Kerem'in önkolları masanın ve önlüğün üstünde; çatal sağ elde
    kolUst(K, 'genc', kd.p, 'L'); kolUst(K, 'genc', kd.p, 'R');
    catal(K, kr.handR, kd.ang, 1, kd.parca);
    H.grip(K, 'genc', kr.handR, kd.p.s);
  }
  // Necmi'nin dış elinde sayaçta tıkırdayan parmak
  if (tE >= tm.cd0 + 1.2 && tE < tm.cd - 0.6 && o.gizle !== 'necmi') {
    const e = rr.necmi.handR, a = Math.PI * 0.5 - 0.5 + 0.42 * Math.abs(Math.sin(Math.PI * 1.0 * (tE - tm.cd0)));
    H.parmaklar(K, 'necmi', e, dd.necmi.p.s, 1, { yon: a, boy: 0.9 });
  }
  for (const key of ['necmi', 'defne']) {
    if (o.gizle === key) continue;
    const d = dd[key], e = d.ic === 'R' ? rr[key].handR : rr[key].handL, s = d.p.s;
    if (d.elde === 'baklava') { baklava(K, [e[0] + YON[key] * 14, e[1] - 38], 1.0, { rot: YON[key] * -0.42, isir: d.isir ? 1 : 0 }); H.grip(K, key, e, s); }
    if (d.pec) { pecete(K, [e[0] + 4, e[1] - 18], 0.95, -0.3); H.grip(K, key, e, s); }
    if (d.parmak && !d.elde) H.parmaklar(K, key, e, s, d.parmak * clamp01((d.kalk - 0.6) / 0.3), { yon: -Math.PI / 2 + YON[key] * 0.12, ac: 0.3 });
    if (d.isaretH) H.isaret(K, key, e, s, d.isaretH);
  }
  if (hd.parmak && hd.R) {
    const P = hd.parmak;
    H.parmaklar(K, 'hikmet', hr.handR, hd.p.s, P.n, { yon: P.yon, ac: P.ac ?? 0.4, boy: P.boy ?? 1, toplam: P.toplam ?? Math.max(1, Math.ceil(P.n - 1e-6)) });
    if (P.iki) H.parmaklar(K, 'hikmet', hr.handL, hd.p.s, P.n, { yon: -Math.PI - P.yon, ac: P.ac });
  } else if (hd.R && hd.R[1] > 0.6) H.grip(K, 'hikmet', hr.handR, hd.p.s);
  if (hd.L && hd.L[1] > 0.6 && !(hd.parmak && hd.parmak.iki)) H.grip(K, 'hikmet', hr.handL, hd.p.s);
  // ——— şerbet damlaları (yüzlerin üstünde); Kerem'in hayalinde onun yanağında da ———
  const dam = {};
  for (const key of ['necmi', 'defne']) {
    if (o.gizle === key) continue;
    const ot = key === 'defne' ? 'necmi' : 'defne', eO = rr[ot] ? (IC[ot] === 'R' ? rr[ot].handR : rr[ot].handL) : null;
    const s = damlaDurum(dd[key], tE, S, { kaynak: eO ? [eO[0] + YON[ot] * 46, eO[1] - 44] : null });
    dam[key] = s;
    if (s && s.iz2) {
      for (let j = 1; j < s.iz2.length; j++) { ctx.save(); ctx.globalAlpha = 0.55 * j / s.iz2.length; ctx.lineCap = 'round'; K.line(s.iz2[j - 1][0], s.iz2[j - 1][1], s.iz2[j][0], s.iz2[j][1], 3 + 9 * j / s.iz2.length, AMBER); ctx.restore(); }
    }
    if (s) serbet(K, s.p, s.r, { iz: 0, rot: s.rot || 0, uzun: s.uzun || 1, a: s.a ?? 1 });
  }
  if (o.hayal === 'K' && kr) { const q = yuzNokta('genc', kd.p, ...YANAK.genc); dam.genc = { p: q, r: 0.074 * kd.p.s }; serbet(K, q, dam.genc.r); }
  return { dd, rr, dam, hr, kr, kd };
}

// ═══════════════════════════ Kerem'in omzunun üstünden ═══════════════════════════
// Ön planda Kerem arkadan (kart paletinden), karşıda Defne ve Necmi; ikisinin damlasının çevresinde hardal halka nabız atar.
function otsCiz(K, t, S, B, nabizlar) {
  const { ctx } = K, cam = B.cam, heads = {};
  const nab = a0s => { let v = 0; for (const a of a0s) v = Math.max(v, H.nabiz(t, a, 0.3)); return v; };
  const r = odaCiz(K, t, S, { tl: S.tl, t, heads, gizle: 'genc' });
  for (const key of ['defne', 'necmi']) {
    const dm = r.dam[key];
    if (dm) { halka(K, dm.p, dm.r * 1.85, nab(nabizlar[key])); serbet(K, dm.p, dm.r, { uzun: dm.uzun || 1 }); }
  }
  Object.assign(B.heads, heads);
  const ekr = [540, 1336], yer = [cam.cx + (ekr[0] - 540) / cam.zoom, cam.cy + (ekr[1] - 960) / cam.zoom];
  sirt(K, 'genc', yer, 440 / cam.zoom, { tilt: 0 });
}

// ═══════════════════════════ Ekran öğeleri (044'ten) ═══════════════════════════
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
function panoHalka(K, t, a, [x, y], r) {   // dikkat halkası: a anında yayla gelir, bir kez nabız atar, 1,5 sn sonra söner
  if (t < a || t > a + 1.5) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, a + 1.2, 0.3));
  ctx.save(); ctx.globalAlpha *= out; ctx.lineWidth = 7; ctx.strokeStyle = HARDAL;
  ctx.beginPath(); ctx.arc(x, y, r * (0.6 + 0.4 * v) * (1 + 0.14 * H.nabiz(t, a + 0.6, 0.4)), 0, TAU); ctx.stroke(); ctx.restore();
}

// ═══════════════════════════ Bölünmüş ekran (Kerem'in bakışı) ═══════════════════════════
// Üst "YA BENDE DE OLSAYDI?": hardal tonlu hayalet dünya; Kerem'in yanağında da şerbet var, ikinci sayışta Defne ile Necmi
// el kaldırmaz (ikisi de iki şerbetli yüz görür, emin olamaz). Alt "GERÇEK": aynı an, iki el "kalkınca"da kalkar.
// "yüzünün"de üste ✗, hayalet söner, alt pano bütün kareye açılır, kamerası ana kameraya kavuşur; "anlar"da Kerem başını sallar.
const PZ = 1.07, PTOP = 815, PH = 470, P_UST = 300, P_ALT = 776, PX = 24, PW = 1032;
const panelKam = (y0, t, tm) => ({ zoom: PZ * (1 + 0.04 * ease.state(seg(t, tm.bolunme, tm.birles0 - tm.bolunme))), cx: 690, cy: PTOP + PH / 2 / PZ, yc: y0 + PH / 2 });
function bolunmus(K, t, S, B, base) {
  const { tm } = S, { ctx } = K, tP = t - tm.kaymaP, tKalk = tm.tK2 + tm.kaymaP;
  const sonme = 1 - ease.state(seg(t, tm.carpi + 0.22, 0.38)), birles = ease.state(seg(t, tm.birles0, tm.birles1 - tm.birles0));
  const ac = ease.enter(seg(t, tm.bolunme, 0.32)), hTemiz = tm.bolunme + 0.3;
  ctx.save(); ctx.setTransform(base); ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
  if (sonme > 0.005) {
    const c = panelKam(P_UST, t, tm); let r = null;
    ctx.save(); ctx.setTransform(base); ctx.beginPath(); ctx.roundRect(PX, P_UST, PW, PH, 20); ctx.clip();
    kamBolum(ctx, c, c.yc + 30 * (1 - ac));
    hayalet(K, K2 => { r = odaCiz(K2, tP, S, { hayal: 'K', gecmis: true }); }, HARDAL, 0.8 * sonme, 0.45);
    ctx.globalAlpha = sonme;
    if (r) {
      if (r.dam.genc) panoHalka(K, t, hTemiz, r.dam.genc.p, 30);
      panoHalka(K, t, tKalk + 0.1, r.rr.defne.handR, 40); panoHalka(K, t, tKalk + 0.1, r.rr.necmi.handL, 40);
    }
    ctx.restore();
    ctx.save(); ctx.setTransform(base); ctx.globalAlpha = sonme;
    ctx.beginPath(); ctx.roundRect(PX, P_UST, PW, PH, 20); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(PX + 14, P_UST + 14, PW - 28, PH - 28, 12); ctx.setLineDash([20, 13]); ctx.lineWidth = 5; ctx.strokeStyle = HARDAL; ctx.stroke();
    ctx.restore();
  }
  const cA = panelKam(P_ALT, t, tm), cam = kamAra(cA, B.cam, birles), yc = lerp(cA.yc + 30 * (1 - ac), 960, birles);
  const rx = lerp(PX, 0, birles), ry = lerp(P_ALT, 0, birles), rw = lerp(PW, 1080, birles), rh = lerp(PH, 1920, birles);
  ctx.save(); ctx.setTransform(base); ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 20 * (1 - birles)); ctx.clip();
  kamBolum(ctx, cam, yc);
  const r2 = t < tm.carpi ? odaCiz(K, tP, S, { gecmis: true }) : odaCiz(K, t, S, { tl: S.tl, t, heads: birles > 0.99 ? B.heads : null });
  if (t < tm.carpi) {
    panoHalka(K, t, tKalk + 0.1, r2.rr.defne.handR, 40); panoHalka(K, t, tKalk + 0.1, r2.rr.necmi.handL, 40);
  }
  ctx.restore();
  if (birles < 0.999) { ctx.save(); ctx.setTransform(base); ctx.globalAlpha = 1 - birles; ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 20); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
}
// Defne'nin hayal kutusu (d2): "ikinci sayışta hepimiz!" Hayalet üçlü, üç el birden "hepimiz"de kalkar; "mi?"de Kerem'in eline ✗
const HK = { x: 300, y: 650, w: 400, h: 260, sc: 0.52, cx: 690, cy: 1010 };   // Defne'nin başının üstünde (Kerem'in değil)
function hayalKutusu(K, t, S) {
  const { tm } = S, a = tm.hayal0, b = tm.kYakin;
  if (t < a || t >= b) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), k = 0.7 + 0.3 * v;
  const tI = tm.tK2 + (t - tm.hepimiz);
  let r = null;
  ctx.save(); ctx.translate(HK.x, HK.y); ctx.scale(k, k); ctx.globalAlpha = clamp01(v * 1.6);
  K.rect(-HK.w / 2 + 8, -HK.h / 2 + 10, HK.w, HK.h, INK, 0, 22); K.rect(-HK.w / 2, -HK.h / 2, HK.w, HK.h, PAL.paper, LW, 22);
  ctx.save(); ctx.beginPath(); ctx.roundRect(-HK.w / 2 + 6, -HK.h / 2 + 6, HK.w - 12, HK.h - 12, 18); ctx.clip();
  ctx.scale(HK.sc, HK.sc); ctx.translate(-HK.cx, -HK.cy);
  hayalet(K, K2 => { r = odaCiz(K2, tI, S, { hepsi: true, gecmis: true }); }, HARDAL, 0.85, 0.45);
  ctx.restore();
  ctx.beginPath(); ctx.roundRect(-HK.w / 2 + 12, -HK.h / 2 + 12, HK.w - 24, HK.h - 24, 16); ctx.setLineDash([16, 10]); ctx.lineWidth = 5; ctx.strokeStyle = HARDAL; ctx.stroke();
  ctx.restore();
  // düşünce kabarcıkları: kutudan Defne'nin başına doğru
  for (const [x, y, rr] of [[318, 806, 14], [338, 836, 9]]) { ctx.save(); ctx.globalAlpha = clamp01(v * 1.6); K.circ(x, y, rr, PAL.paper, LW * 0.8); ctx.restore(); }
  if (r && r.kr) {
    const e = r.kr.handR, sx = HK.x + (e[0] - HK.cx) * HK.sc * k, sy = HK.y + (e[1] - 40 - HK.cy) * HK.sc * k;
    carpiDamga(K, t, tm.hayalX, b - 0.05, [sx, sy], 50);
  }
}
// ═══════════════════════════ draw ═══════════════════════════
const SAYIS = n => n + '. ' + 'SAYIŞ';
export function draw(K, t, ep, tl, S) {
  const { tm } = S; S.tl = tl;
  const base = K.ctx.getTransform();
  let kartAlt = 300;
  H.cerceve(K, t, ep, tl, S, {
    kartSon: -1,   // kart ve sayaç ekran katmanında çizilir (kart kare 0'da yok, hq'nun "Kim"inde iner)
    kuyruksuz: (t, B) => (B.sc.id === 'bolunme' && t < tm.birles1),
    kamera(cam, t) {   // sayaç: her saniye hafif kalp atışı itmesi
      if (t >= tm.cd0 - 0.05 && t < tm.cd) { const f = ((t - tm.cd0) % 1 + 1) % 1; cam.zoom *= 1 + 0.02 * Math.exp(-f * 7) * (1 - Math.exp(-f * 45)); }
    },
    dunya(K, t, B) {
      const id = B.sc.id;
      if (id === 'otsK') return otsCiz(K, t, S, B, { defne: [tm.ots1 + 0.25, tm.ots1 + 0.95], necmi: [tm.ots1 + 0.6, tm.ots1 + 1.3] });
      if (id === 'otsK2') return otsCiz(K, t, S, B, { defne: [tm.d5a], necmi: [tm.d5b] });
      if (id === 'bolunme' && t < tm.birles1) return bolunmus(K, t, S, B, base);
      const tE = etkin(t, tm), geri = t >= tm.sar0 && t < tm.sar1;
      odaCiz(K, tE, S, { tl: geri ? null : tl, t, heads: B.heads });
    },
    ekran(K, t, B) {
      donma(K, t, tm);
      H.zamanHapi(K, t, tm.sar0 + 0.12, tm.sar1 + 0.78, K.up('1 dakika önce'), { y: 1292, saat: 14.98 });
      if (B.sc.id === 'dYakin') hayalKutusu(K, t, S);
      if (B.sc.id === 'bolunme' && t < tm.birles1) {
        const s1 = 1 - ease.state(seg(t, tm.carpi + 0.22, 0.38)), { ctx } = K, L1 = K.up('ya bende de olsaydı?'), L2 = K.up('gerçek');
        ctx.font = '900 48px Rubik'; const w1 = ctx.measureText(L1).width + 58, w2 = ctx.measureText(L2).width + 58;
        if (s1 > 0.01) { ctx.save(); ctx.globalAlpha = s1; H.tag(K, t, tm.bolunme + 0.22, tm.birles0, [100 + w1 / 2, P_UST], L1, HARDAL, INK, 48); ctx.restore(); }
        H.tag(K, t, tm.bolunme + 0.3, tm.birles0 - 0.1, [100 + w2 / 2, P_ALT], L2, INK, PAL.paper, 48);
        carpiDamga(K, t, tm.carpi, tm.carpi + 0.4, [540, P_UST + 300], 82);
      }
      // sayış etiketi (cevapta): kartın yerinde, sabit
      if (t >= tm.say1 && t < tm.bolunme) H.adimEtiket(K, t, [[tm.say1 + 0.22, SAYIS(1), PAL.mustard, INK], [tm.say2 + 0.21, SAYIS(2), PAL.mustard, INK]], tm.bolunme - 0.25, [540, 500], 60);
      if (t >= tm.birles1 - 0.1 && t < tm.kerem) H.adimEtiket(K, t, [[tm.birles1 - 0.05, SAYIS(3), PAL.mustard, INK]], tm.kerem - 0.25, [540, 500], 60);
      const c0 = tm.cd - (ep.cdSure || 10);
      if (t >= c0 - 0.3 && t < tm.cd + 0.35) { const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.5 * clamp01((t - c0 + 0.3) / 0.3) * (1 - ease.exit(seg(t, tm.cd, 0.3))); ctx.fillStyle = INK; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      kartAlt = kartCiz(K, t, ep, tm);
      if (t >= tm.kartGir && t < tm.kartSon) sayac(K, t, tm.cd, { top: kartAlt + 20, share: ep.cdShare, dur: ep.cdSure || 10, perde: false });
    },
  });
}
