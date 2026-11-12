// Bölüm 40 · TAVLA TURNUVASI (v4 "hikâye" dili; storyboard: hikayeler/bolum_040_v5.md). Özgün kurgu, eleme sayısı fikri.
// Logline: Ofiste 37 kişilik eleme usulü tavla turnuvası başlar. Hikmet şampiyon çıkana kadar kaç maç oynanacağını sorar.
// Defne turları beyaz tahtada tek tek hesaplarken tur atlayanlarda takılır. Cevabı, elenenlere teselli çayı taşıyan
// Necmi'nin bardakları verir: her maçta bir kişi elenir, sehpada 36 bardak birikir, masada kupayla Kerem kalır.
// Akılda kalacak tek şey: şampiyon dışında herkes bir kez elenir; 37 kişide 36 maç oynanır.
// Tek mekân: toplantı odası (önden). Soldan sağa: beyaz tahta · A masası · B masası · kupa kürsüsü · ELENENLER sehpası · çay arabası.
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur; rastgelelik yok (sabit listeler).
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b040_salon', ZEMIN = 1500, MASA_Y = 1270;
// beyaz tahta (tekerlekli): yazı yüzü; KİŞİ sütunu (KX) ve MAÇ sütunu (MX)
const TH = { x0: 418, x1: 594, y0: 930, y1: 1290 };
const KX = 468, MX = 534, KY = i => 1012 + 35 * i, MY = j => 1029 + 35 * j;
const KISI = ['37', '19', '10', '5', '3', '2', '1'], MAC = ['18', '9', '5', '2'], TEK = [0, 1, 3, 4];
const DEF_X = 740, HIK_TX = 275;
// tavla masaları: A (kanca ve sayaç), B (tur atlayan, kahraman an); koltuk x: [sol (yüzü sağa), sağ (yüzü sola)]
const MA = [985, 1315], MB = [1822, 2026], OA = [900, 1400], OB = [1750, 2100];
const HIK_X = 1150, TAV_K = 1.2;
// ELENENLER sehpası: üstü (arka kenar yb, ön kenar yf); bardak ızgarası 12 × 3 (arka sıra önce dolar)
const SEH = { x0: 2250, x1: 2800, yb: 1248, yf: 1314 };
const GX0 = 2352, GDX = 36, GROW = [1262, 1278, 1294, 1310], GK = 0.84;
const slot = k => [GX0 + (k % 9) * GDX, GROW[Math.floor(k / 9)]];
const NEC_SX = 2368, NEC_Y = 1492, KURSU = 2196, KUPA0 = [KURSU, 1300 - 44];
const MERCAN = PAL.coral, YESIL = PAL.green, CAY = '#A8401F';

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));   // a'da gelir, b'de gider
// Sıralı yol: duraklar [[t, [x, y]], …]; iki durak arasında ease.state
function yol(t, d) {
  if (t <= d[0][0]) return d[0][1];
  for (let i = 1; i < d.length; i++) if (t < d[i][0]) { const u = ease.state((t - d[i - 1][0]) / (d[i][0] - d[i - 1][0])); return [lerp(d[i - 1][1][0], d[i][1][0], u), lerp(d[i - 1][1][1], d[i][1][1], u)]; }
  return d[d.length - 1][1];
}

// ═══════════════════════════ Figüran kartları (bölüme özgü, b040_ önekli) ═══════════════════════════
// Kadro kartlarına dokunulmaz; figüranlar kadro kartlarının iskeletinden türetilir, palet ve aksesuar değişir.
const FIG_TANIM = [
  // [anahtar, iskelet, gövde, gölge, bacak, ten, ten gölgesi, saç, özellikler, kol gövde renginde mi]
  ['b040_f1', 'genc', '#9A5B3C', '#7E4A31', '#3B3F45', '#E2AE88', '#C79470', '#2A211C', ['jacket', 'hairSlick', 'mustacheThick'], true],
  ['b040_f2', 'defne', '#7C8B5A', '#667348', '#3E3A33', '#E8BC98', '#CFA07C', '#2B1E18', ['blazer', 'bun', 'glassesRect', 'lashes'], true],
  ['b040_f3', 'necmi', '#5E6B73', '#4B565D', '#2F3338', '#C98E66', '#AE7650', '#3A2E26', ['suit', 'tie', 'hairMessy'], true],
  ['b040_f4', 'defne', '#4F7A73', '#3F625C', '#2F2A2A', '#D9A27A', '#BF875F', '#1F1714', ['jacket', 'hairLong', 'lashes'], true],
  ['b040_f5', 'genc', '#B07A3A', '#93652F', '#2E4057', '#EFC4A0', '#D7A882', '#6B4A2E', ['hoodie', 'hairSpiky'], true],
  ['b040_f6', 'hikmet', '#8C6A44', '#735637', '#4A4F57', '#D9A27A', '#C08760', '#4A3A30', ['vest', 'mustacheThick', 'baldSides', 'glassesRect'], false],
  ['b040_f7', 'defne', '#8E3B46', '#74303A', '#2F3E4C', '#C98E66', '#AE7650', '#1F1714', ['blazer', 'hairLong', 'glassesCat', 'lashes'], true],
  ['b040_f8', 'necmi', '#6F7F55', '#5B6845', '#4A3E33', '#E3AF86', '#C9946C', '#B0A89E', ['cardigan', 'baldSides', 'mustacheThin'], true],
  ['b040_f9', 'genc', '#C9A24A', '#AA873B', '#3B3F45', '#C08760', '#A46F4C', '#1E1915', ['jacket', 'hairMessy'], true],
  ['b040_f10', 'defne', '#5D6A61', '#4B564F', '#2F2A2A', '#EFC4A0', '#D7A882', '#2B1E18', ['blazer', 'bun', 'glassesRect', 'lashes'], true],
  ['b040_f11', 'hikmet', '#4E6B5C', '#3F584B', '#2F3B33', '#E8BC98', '#CFA07C', '#2A211C', ['vest', 'tie', 'hairMessy', 'glassesBold'], false],
  ['b040_f12', 'genc', '#7A5A8A', '#634872', '#2E3338', '#D9A27A', '#BF875F', '#2A211C', ['hoodie', 'hairSlick'], true],
];
const BOYU = { ...H.BOY };
for (const [key, base, gov, gol, bac, ten, tenG, sac, ozl, kol] of FIG_TANIM) {
  const b = H.CARDS[base];
  if (!H.CARDS[key]) H.CARDS[key] = {
    ...b, key, name: 'Figüran', seed: 400 + Number(key.slice(6)) * 7,
    torso: { ...b.torso, color: gov, shade: gol, belly: base === 'hikmet' ? 0.08 : b.torso.belly },
    arm: kol ? { ...b.arm, color: gov, shade: gol } : { ...b.arm },
    leg: { ...b.leg, color: bac, shade: bac }, skin: ten, skinShade: tenG, hair: sac, features: ozl,
  };
  BOYU[key] = H.BOY[base] - 6;
}
const FIG = FIG_TANIM.map(f => f[0]);
const F1 = 'b040_f1', F2 = 'b040_f2', F3 = 'b040_f3', F4 = 'b040_f4', KEREM = H.KEREM;
const kisi = (key, o = {}) => H.kisi(key, { s: BOYU[key], ...o });
const otur = (key, o = {}) => H.otur(key, { s: BOYU[key], ...o });
const yuru = (key, t, o) => H.yuru(key, t, { s: BOYU[key], ...o });

// ═══════════════════════════ Nesneler ═══════════════════════════
// Yaka kartı: göğüste yuvarlak kart (katılımcılar)
function rozet(K, key, p) {
  const n = H.eklem(key, p, 'neck'), pv = H.eklem(key, p, 'pelvis'), s = p.s, yan = p.view === 'side', f = yan ? (p.facing || 1) : 1;
  const x = lerp(n[0], pv[0], 0.34) + (yan ? f * 0.15 * s : 0.13 * s), y = lerp(n[1], pv[1], 0.34);
  K.line(x, y - 0.12 * s, x, y - 0.05 * s, Math.max(2, s * 0.012), '#3A4A48');
  K.circ(x, y, 0.085 * s, PAL.paper, Math.max(2.5, s * 0.016));
  K.circ(x, y, 0.05 * s, MERCAN, 0);
}
// Tavla (önden, masanın üstünde): açık kapak dik durur (üçgen haneler), taban üstten eğik görünür (pullar, zarlar)
const TAV_W = 232;
const PULLAR = [   // taban üstünde [dx, katman (0 arka … 2 ön), renk 0 açık / 1 koyu, yığın]
  [-92, 0, 1, 2], [-60, 2, 0, 3], [-34, 0, 0, 1], [-10, 2, 1, 2], [30, 0, 1, 3], [58, 2, 0, 2], [86, 0, 0, 2], [88, 2, 1, 1],
];
function tavla(K, cx, { zarlar = [], pullar = [], azalt = [], eksik = 0, k = 1 } = {}) {
  K.ctx.save(); K.ctx.translate(cx, MASA_Y); K.ctx.scale(k, k); K.ctx.translate(-cx, -MASA_Y);
  const { ctx } = K, yb = MASA_Y - 30, yf = MASA_Y - 3, hw = TAV_W / 2, hb = hw - 12;
  // kapak (dik): çerçeve, keçe, 12 üçgen hane (üstte 6 aşağı, altta 6 yukarı), orta çubuk
  const ly0 = yb - 122, lx0 = cx - hb, lx1 = cx + hb;
  K.rect(lx0 - 6, ly0 - 6, lx1 - lx0 + 12, yb - ly0 + 8, '#7A4A26', LW, 6);
  K.rect(lx0 + 8, ly0 + 8, lx1 - lx0 - 16, yb - ly0 - 16, '#EBDDBE', LW * 0.5, 2);
  const hx = (lx1 - lx0 - 16 - 14) / 2, n = 6, tw = hx / n;
  for (const side of [0, 1]) {
    const x0 = lx0 + 8 + side * (hx + 14);
    for (let i = 0; i < n; i++) {
      const a = x0 + i * tw, c = (i + side) % 2 ? '#2E3B38' : '#B5532A', top = ly0 + 8, bot = yb - 8, mid = (top + bot) / 2;
      K.poly([[a + 1, top], [a + tw - 1, top], [a + tw / 2, mid - 6]], c, 2);
      K.poly([[a + 1, bot], [a + tw - 1, bot], [a + tw / 2, mid + 6]], (i + side + 1) % 2 ? '#2E3B38' : '#B5532A', 2);
    }
  }
  K.rect(cx - 7, ly0 + 2, 14, yb - ly0 - 4, '#7A4A26', LW * 0.5, 3);
  // taban: eğik yüzey (yamuk), keçe, orta çubuk
  K.poly([[cx - hb - 6, yb], [cx + hb + 6, yb], [cx + hw + 4, yf], [cx - hw - 4, yf]], '#7A4A26', LW);
  K.poly([[cx - hb + 6, yb + 4], [cx + hb - 6, yb + 4], [cx + hw - 8, yf - 4], [cx - hw + 8, yf - 4]], '#D9C9A4', LW * 0.4);
  K.line(cx, yb + 3, cx, yf - 3, 9, '#7A4A26');
  K.rect(cx - hw - 4, yf - 2, TAV_W + 8, 9, '#5E3A1E', LW * 0.6, 3);
  // pullar (eksik: oyun sonunda toplanan pul sayısı)
  const ly = [yb + 7, yb + 13, yb + 19];
  PULLAR.forEach(([dx, k, r, yig], i) => {
    if (i < eksik) return;
    const m = yig - azalt.filter(a => a === i).length;
    for (let j = 0; j < m; j++) K.ell(cx + dx, ly[k] - j * 4.5, 11, 4.8, r ? '#3A2A20' : PAL.paper, 2.5);
  });
  ctx.restore();
  for (const pul of pullar) K.ell(pul.p[0], pul.p[1], 11 * k, 4.8 * k, pul.r ? '#3A2A20' : PAL.paper, 2.5);
  for (const z of zarlar) zar(K, z.p[0], z.p[1], z.n, z.a || 0, (z.k || 1) * k);
}
const pulYeri = (cx, i, s = TAV_K) => { const [dx, k, , yig] = PULLAR[i]; return [cx + dx * s, MASA_Y + ([-23, -17, -11][k] - (yig - 1) * 4.5) * s]; };
function zar(K, x, y, n, a = 0, k = 1) {
  const { ctx } = K, s = 19 * k;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-s / 2, -s / 2, s, s, PAL.paper, 2.5 * k, 4 * k);
  const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[n];
  for (const [px, py] of P) K.circ(px * s * 0.26, py * s * 0.26, 2.2 * k, INK, 0);
  ctx.restore();
}
// Masa (önden): tabla ve iki ayak
function masa(K, [x0, x1]) {
  K.rect(x0 + 18, MASA_Y + 18, 20, ZEMIN - MASA_Y - 18, PAL.woodDark, LW, 4);
  K.rect(x1 - 38, MASA_Y + 18, 20, ZEMIN - MASA_Y - 18, PAL.woodDark, LW, 4);
  K.rect(x0, MASA_Y, x1 - x0, 26, PAL.woodTop, LW, 6);
}
// Çay bardağı (ince belli) ve tabağı: (x, yb) tabağın ortası
function bardak(K, x, yb, { k = 1, buhar = false, t = 0, kab = 0, bos = false } = {}) {
  const { ctx } = K, s = k * (1 + 0.22 * kab);
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  K.ell(0, 0, 21, 5.5, PAL.cream, 2.5);
  const yol = [[-12, -40], [12, -40], [7, -22], [12, -8], [9, -2], [-9, -2], [-12, -8], [-7, -22]];
  K.poly(yol, '#F3EEE4', 2.5);
  if (!bos) { K.poly([[-10.5, -34], [10.5, -34], [6.4, -22], [10.6, -8], [8, -3.5], [-8, -3.5], [-10.6, -8], [-6.4, -22]], CAY, 0); K.line(-9, -34, 9, -34, 2.5, '#C9603A'); }
  K.poly(yol, null, 2.5);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 46 * s, t, { k: 0.42 * k, n: 2, ara: 12, boy: 70 });
}
// Kupa: (x, y) sapın tutulduğu nokta
function kupa(K, x, y, k = 1, kab = 0) {
  const { ctx } = K, s = k * (1 + 0.14 * kab);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  K.rect(-30, 22, 60, 22, '#5E3A1E', LW * 0.8, 4);
  K.rect(-9, -4, 18, 28, '#C08A28', LW * 0.7, 3);
  ctx.beginPath(); ctx.arc(-36, -48, 16, Math.PI * 0.45, Math.PI * 1.55); ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#E2B544'; ctx.stroke();
  ctx.beginPath(); ctx.arc(36, -48, 16, -Math.PI * 0.55, Math.PI * 0.55); ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#E2B544'; ctx.stroke();
  K.poly([[-38, -78], [38, -78], [30, -36], [12, -6], [-12, -6], [-30, -36]], '#E2B544', LW);
  K.poly([[-26, -70], [-16, -70], [-10, -34], [-18, -36]], '#F6D77A', 0);
  K.ell(0, -78, 38, 8, '#C08A28', LW * 0.7);
  ctx.restore();
}
// Askılı çay tepsisi: (x, y) tepsinin ortası (sehpada); kulpun tepesi y − 108
function tepsi(K, x, y, n, t) {
  const top = [x, y - 108];
  for (const dx of [-34, 34]) K.line(x + dx, y - 6, top[0], top[1], 6, '#9AA49C');
  K.ell(x, y, 46, 10, '#B8C1B9', LW * 0.8);
  for (let i = 0; i < n; i++) bardak(K, x - 18 + i * 18, y - 1, { k: 0.72 });
  K.circ(top[0], top[1], 9, '#9AA49C', LW * 0.6);
  void t;
  return top;
}
// Kalem (marker): ucu tahtada, gövdesi tutan ele doğru
function kalem(K, uc, el, renk = '#1F4E79') {
  const u = H.unit(uc, el), son = [uc[0] + u[0] * 62, uc[1] + u[1] * 62], { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, uc, son, 17, INK); H.strokeLine(ctx, [uc[0] + u[0] * 7, uc[1] + u[1] * 7], son, 10, PAL.paper);
  H.strokeLine(ctx, [son[0] - u[0] * 14, son[1] - u[1] * 14], son, 10, renk); H.strokeLine(ctx, uc, [uc[0] + u[0] * 6, uc[1] + u[1] * 6], 7, renk);
  ctx.restore();
}
function silgi(K, x, y, a = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-30, -14, 60, 28, '#2E3B38', LW * 0.7, 5); K.rect(-30, 4, 60, 10, '#B8C1B9', LW * 0.5, 3);
  ctx.restore();
}
// Beyaz tahta (tekerlekli): yazılar durum fonksiyonundan gelir
function tahta(K, d) {
  const { x0, x1, y0, y1 } = TH, { ctx } = K;
  for (const x of [x0 + 20, x1 - 20]) { K.rect(x - 7, y1, 14, ZEMIN - y1 - 26, '#8FA093', LW * 0.7, 3); K.circ(x, ZEMIN - 14, 13, '#2E3B38', LW * 0.6); }
  K.rect(x0 - 40, ZEMIN - 40, 80, 12, '#8FA093', LW * 0.6, 4); K.rect(x1 - 40, ZEMIN - 40, 80, 12, '#8FA093', LW * 0.6, 4);
  K.rect(x0 - 14, y0 - 14, x1 - x0 + 28, y1 - y0 + 28, '#B8C1B9', LW, 8);
  K.rect(x0, y0, x1 - x0, y1 - y0, '#FBFBF7', LW * 0.5, 3);
  K.rect(x0 - 10, y1 + 12, x1 - x0 + 20, 14, '#B8C1B9', LW * 0.7, 4);   // kalem rafı
  if (d.silgiRafta) silgi(K, x0 + 46, y1 + 2);
  K.rect(x1 - 70, y1 + 2, 40, 10, '#1F4E79', LW * 0.4, 4);
  // yazılar: KİŞİ sütunu (lacivert), MAÇ sütunu (lacivert), soru işareti ve halkalar (mercan), sonuç (yeşil)
  const yaz = (s, x, y, size, c, v) => {
    if (v <= 0) return;
    ctx.save(); ctx.font = `800 ${size}px Rubik`; const w = ctx.measureText(s).width;
    ctx.beginPath(); ctx.rect(x - w / 2 - 4, y - size, (w + 8) * clamp01(v), size * 2); ctx.clip();
    K.text(s, x, y + size * 0.36, size, c, 800); ctx.restore();
  };
  KISI.forEach((s, i) => yaz(s, KX, KY(i), 34, '#1F4E79', d.kisi[i]));
  MAC.forEach((s, j) => { if (d.macA[j] > 0) { ctx.save(); ctx.globalAlpha = d.macA[j]; yaz(s, MX, MY(j), 32, '#1F4E79', d.mac[j]); ctx.restore(); } });
  if (d.soru > 0) { ctx.save(); ctx.globalAlpha = d.macA[3]; yaz('?', MX + 26, MY(3), 34, MERCAN, d.soru); ctx.restore(); }
  TEK.forEach((i, k) => {
    const v = d.halka[k]; if (v <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.arc(KX, KY(i), 25, -Math.PI / 2, -Math.PI / 2 + TAU * clamp01(v)); ctx.lineWidth = 6; ctx.strokeStyle = MERCAN; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  });
  if (d.sonuc > 0) {
    K.line(MX - 26, 1236, MX + 26, 1236, 5, YESIL);   // toplam çizgisi: MAÇ sütununun sonucu
    yaz('36', MX, 1264, 36, YESIL, d.sonuc);
    if (d.sonuc >= 1) { ctx.save(); ctx.beginPath(); ctx.ellipse(MX, 1264, 34, 24, 0, 0, TAU); ctx.lineWidth = 6; ctx.strokeStyle = YESIL; ctx.stroke(); ctx.restore(); }
  }
}
// Duvar levhası (ELENENLER) ve pankart (TAVLA TURNUVASI)
function levha(K, x, y, yazi, size, renk = PAL.cream) {
  const { ctx } = K; ctx.font = `900 ${size}px Rubik`; const w = ctx.measureText(yazi).width + size * 1.1, h = size * 1.55;
  K.rect(x - w / 2 + 8, y - h / 2 + 9, w, h, INK, 0, 12); K.rect(x - w / 2, y - h / 2, w, h, renk, LW, 12);
  K.text(yazi, x, y + size * 0.36, size, INK, 900);
}
function pankartAsili(K, x0, x1, y, yazi, size) {
  const { ctx } = K;
  K.line(x0 - 60, y - 70, x0 + 10, y - 26, 4, '#5E3A1E'); K.line(x1 + 60, y - 70, x1 - 10, y - 26, 4, '#5E3A1E');
  const h = size * 1.6;
  ctx.beginPath(); ctx.moveTo(x0, y - h / 2); ctx.quadraticCurveTo((x0 + x1) / 2, y - h / 2 + 14, x1, y - h / 2);
  ctx.lineTo(x1, y + h / 2); ctx.quadraticCurveTo((x0 + x1) / 2, y + h / 2 + 14, x0, y + h / 2); ctx.closePath(); K.fs(MERCAN, LW);
  for (const x of [x0 + 24, x1 - 24]) K.circ(x, y - h / 2 + 12, 6, PAL.mustard, 2);
  K.text(yazi, (x0 + x1) / 2, y + size * 0.36 + 7, size, PAL.paper, 900);
}
// Çay arabası ve çaydanlık (döngü: buhar)
function cayArabasi(K, x, t) {
  K.rect(x - 70, 1330, 140, 16, '#8FA093', LW * 0.7, 4); K.rect(x - 70, 1420, 140, 14, '#8FA093', LW * 0.7, 4);
  for (const dx of [-62, 62]) { K.line(x + dx, 1330, x + dx, 1478, 8); K.circ(x + dx, 1484, 12, '#2E3B38', LW * 0.5); }
  K.poly([[x - 40, 1330], [x + 40, 1330], [x + 32, 1268], [x - 32, 1268]], '#B8C1B9', LW * 0.8);
  K.line(x + 36, 1300, x + 70, 1278, 9, INK); K.line(x + 36, 1300, x + 70, 1278, 4, '#B8C1B9');
  K.poly([[x - 26, 1268], [x + 26, 1268], [x + 20, 1224], [x - 20, 1224]], '#C9CFC6', LW * 0.7);
  K.circ(x, 1218, 7, INK, 0);
  H.buhar(K, x - 6, 1206, t, { k: 0.7, n: 2, ara: 16, boy: 90 });
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-500, 3300], dongu: ['pencerede martı', 'duvar saatinin saniye kolu', 'çay buharı'],
  capa: { tahta: [KX, KY(0)], masaA: [(MA[0] + MA[1]) / 2, MASA_Y], masaB: [(MB[0] + MB[1]) / 2, MASA_Y], sehpa: [GX0, SEH.yb] },
  kadraj: { kanca: [1.0, 1170, 1100], tahta: [1.45, 520, 1092], defne: [1.35, 740, 1012], genis: [0.96, 1010, 1060], ipucu: [1.4, 2480, 1088], cevap: [0.94, 2255, 1090] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -600, x1: 3400, isik, duvar: 'cizgili' });
    M.pencere(K, 1590, 600, 230, 300, { isik, t: t + 5 });
    M.pencere(K, 640, 600, 230, 300, { isik, t });
    pankartAsili(K, 882, 1137, 700, K.up('turnuva'), 50);
    M.duvarSaati(K, 2085, 790, 50, durum.saat, t);
    levha(K, 2520, 665, K.up('elenenler'), 46, PAL.mustard);
    // saksı (tahtanın solunda)
    for (let i = 0; i < 5; i++) H.yaprak(K, 120, 1350, 180 + (i % 2) * 50, -0.85 + i * 0.42 + 0.04 * Math.sin(t * 1.1 + i), i % 2 ? PAL.green : '#4C8240', 1);
    K.poly([[72, 1350], [168, 1350], [156, 1460], [84, 1460]], PAL.mustard, LW);
  },
});

// ═══════════════════════════ Turnuva verisi (sabit) ═══════════════════════════
// Gerçek turnuva: 37 → 19 → 10 → 5 → 3 → 2 → 1 kişi; maçlar 18 + 9 + 5 + 2 + 1 + 1 = 36 (build anında denetlenir).
{ let n = 37, m = 0; const k = [n]; while (n > 1) { m += Math.floor(n / 2); n = Math.ceil(n / 2); k.push(n); } if (m !== 36 || k.join() !== KISI.join()) console.warn('b040: turnuva sayıları tutmuyor', m, k); }
// Kerem'in maçları (bardak sırasıyla, 0'dan): sayaçta A masasında (1), kahraman anda B masasında 2, sonra hızlandırılmış bölümde
const KEREM_MAC = [1, 2, 14, 25, 31, 33, 35];
// Sehpadaki kalabalık: her yer belli bir bardaktan sonra dolar. sira 0 ön (tam boy), 1 orta, 2 arka (küçük, koyu)
const KALABALIK = [
  { x: 2385, sira: 0, key: F4, esik: 2 }, { x: 2505, sira: 0, key: F1, esik: 0 }, { x: 2768, sira: 0, key: F3, esik: 1 }, { x: 2625, sira: 0, key: 'hikmet', esik: 4 },
  { x: 2338, sira: 1, key: 'b040_f5', esik: 6 }, { x: 2463, sira: 1, key: 'b040_f6', esik: 9 }, { x: 2588, sira: 1, key: 'b040_f7', esik: 12 }, { x: 2713, sira: 1, key: 'b040_f8', esik: 16 }, { x: 2838, sira: 1, key: F2, esik: 20 },
  { x: 2400, sira: 2, key: 'b040_f9', esik: 23 }, { x: 2525, sira: 2, key: 'b040_f10', esik: 26 }, { x: 2650, sira: 2, key: 'b040_f11', esik: 29 }, { x: 2775, sira: 2, key: 'b040_f12', esik: 32 }, { x: 2290, sira: 2, key: 'b040_f9', esik: 34 },
];
const SIRA_K = [{ s: 1, y: 1468, a: 0 }, { s: 0.86, y: 1398, a: 0.16 }, { s: 0.74, y: 1336, a: 0.3 }];

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    zarIn: 0.3, otuz: T('h1:1'), turnuva: T('h1:5'),
    yenilen: T('h2a'), elenir: T('h2a:1'), bir: T('h2a:4'), tek: T('h2a:8'), tur: T('h2a:13'),
    sampiyon: T('h2b'), kac: T('h2b:2'),
    tahta: T('h3') - 0.18, zarlar: T('h3:2'),
    sekiz: T('d2:1'), dokuz: T('d2:2'), bes: T('d2:3'), durun: T('d2:4'), atlayan: T('d2:6'),
    hd: T('hd'), durdu: T('hd:3'),
    sayac: cd0 + 0.6, ipucu: cd - 0.05,
    n1: T('n1'), elenen: T('n1:3'), teselli: T('n1:5'), goturuyorum: T('n1:7'),
    cevap: T('d3:3') - 0.1, d4: T('d4'), elenirC: T('d4:5'), sampC: T('d4:6'),
    d5: T('d5'), elenecekse: T('d5:3'), otuzC: T('d5:4'), macC: T('d5:6'),
    espri: T('h4') - 0.16, cayim: T('h4:4'), sogudu: T('h4:5'),
    cta: T('d6') - 0.14,
  };
  // ——— kanca: zar düşer; Kerem iki pul oynar; son pulu toplar ("yenilen") ———
  tm.pulA = [[1.15, 2, [1100, MASA_Y - 13]], [2.55, 5, [1196, MASA_Y - 23]]];   // [an, pul, hedef]
  tm.topla = tm.yenilen - 0.35; tm.f1Kalk = tm.elenir + 0.3; tm.f1Yur = tm.f1Kalk + 0.25;
  // ——— tahta: KİŞİ sütunu h3 boyunca, MAÇ sütunu kelimelerde ———
  const kStep = (T('h3>') + 0.1 - (tm.tahta + 0.22)) / 7;
  tm.yazK = KISI.map((_, i) => tm.tahta + 0.22 + i * kStep);
  tm.yazM = [tm.sekiz - 0.08, tm.dokuz - 0.06, tm.bes - 0.06, tm.durun + 0.04];
  tm.soru = tm.atlayan - 0.12; tm.kalemBirak = tm.durdu + 0.5;
  tm.halka = [T('hd') + 0.06, T('hd:1') - 0.02, T('hd:2') + 0.12, T('hd:2') + 0.5];
  // ——— sayaç: Defne siler, düşünür; A masasında Kerem F3'ü yener; Necmi tepsiyle geçer ———
  tm.sil0 = tm.sayac + 0.25; tm.sil1 = tm.sil0 + 1.3; tm.silKoy = tm.sil1 + 0.15;
  tm.f3Zar = tm.sayac + 0.4; tm.kPul = tm.sayac + 1.05; tm.kTopla = tm.sayac + 1.75; tm.f3Kalk = tm.kTopla + 0.5; tm.f3Yur = tm.f3Kalk + 0.25;
  tm.nYur0 = tm.sayac + 1.85; tm.nYur1 = cd - 0.15; tm.bak = cd - 0.75;
  // ——— cevap: bardaklar. 0 ve 1 sehpada; 2 gerçek zamanda; 3–35 hızlandırılmış (ease.state) ———
  tm.g = [];
  tm.g[0] = tm.cevap - 1; tm.g[1] = tm.cevap - 0.5; tm.g[2] = tm.elenirC + 0.45;
  tm.tl0 = tm.sampC + 0.1; tm.tl1 = tm.d5 - 0.03;
  for (let k = 3; k < 36; k++) tm.g[k] = tm.tl0 + (tm.tl1 - tm.tl0) * ease.state((k - 2) / 33);
  tm.say = [tm.cevap + 0.35, tm.cevap + 0.62, ...tm.g.slice(2).map(g => g + 0.02)];
  tm.f4Kalk = tm.elenirC + 0.12; tm.kKalk = tm.otuzC - 0.05; tm.kAl = tm.kKalk + 0.4; tm.kKaldir = tm.macC - 0.15;
  tm.dalga = tm.elenecekse;

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...M.kadraj(ODA, 'kanca')], [1.9, 1.02, 1172, 1098], [tm.bir - 0.1, 1.03, 1175, 1096], [tm.bir + 0.25, 1.12, 1888, 1110], [tm.tur - 0.2, 1.14, 1892, 1108], [tm.sampiyon - 0.2, 1.3, 1150, 1000], [tm.kac, 1.32, 1152, 996]] },
    { id: 'tahta', t0: tm.tahta, cam: [[0, ...M.kadraj(ODA, 'tahta')], [tm.durun, 1.46, 518, 1090], [tm.hd + 0.2, 1.43, 500, 1094]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...M.kadraj(ODA, 'genis')], [tm.nYur0, 0.97, 1010, 1058]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, ...M.kadraj(ODA, 'ipucu')], [tm.teselli - 0.3, 1.42, 2462, 1088]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...M.kadraj(ODA, 'cevap')], [tm.sampC, 0.95, 2257, 1088], [tm.d5 + 0.3, 0.95, 2252, 1088]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.42, 2585, 1094], [tm.cayim, 1.45, 2592, 1088]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.38, 762, 1092], [tm.cta + 1.4, 1.42, 762, 1088]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.3] }, ...POZ.dur });
  const hik = [
    [0.6, { head: { tilt: 4, look: [0.05, 0.05] } }, 0.35],
    [tm.yenilen - 0.2, { expr: 'mutlu', head: { tilt: -5, look: [-0.8, 0.35] } }, 0.3],
    [tm.bir + 0.2, { head: { tilt: 3, look: [0.85, 0.2] } }, 0.35],
    [tm.sampiyon - 0.15, { expr: 'mutlu', head: { tilt: 6, look: [0.05, 0.0] } }, 0.3],
    [tm.tahta, { x: HIK_TX, expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.25] } }, 0.01],
    [tm.sekiz, { head: { tilt: 3, look: [0.6, 0.55] } }, 0.3],
    [tm.hd - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [0.75, 0.45] } }, 0.25],
    [tm.durdu, { head: { tilt: -4, look: [0.85, 0.2] } }, 0.3],
  ];
  const defBase = kisi('defne', { x: 722, expr: 'saskin', head: { tilt: 4, look: [0.85, 0.15] }, ...POZ.dur });
  const def = [
    [tm.turnuva, { head: { tilt: -3, look: [0.8, -0.2] } }, 0.35],
    [tm.elenir, { expr: 'notr', head: { tilt: 4, look: [0.9, 0.3] } }, 0.3],
    [tm.tahta, { x: DEF_X, expr: 'notr', head: { tilt: 5, look: [-0.85, 0.25] } }, 0.01],
    [tm.durun - 0.1, { expr: 'saskin', head: { tilt: -4, look: [-0.9, 0.1] } }, 0.25],
    [tm.hd + 0.3, { expr: 'yorgun', head: { tilt: 6, look: [-0.85, 0.3] } }, 0.3],
    [tm.sayac, { expr: 'notr', head: { tilt: 5, look: [-0.85, 0.25] } }, 0.01],
    [tm.silKoy + 0.25, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [-0.4, -0.4] } }, 0.35],
    [tm.bak, { head: { tilt: 3, look: [0.9, 0.1] } }, 0.3],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cta, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.15, 0.05] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.4],
  ];
  const necBase = kisi('necmi', { x: NEC_SX, y: NEC_Y, expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.4] }, ...POZ.dur });
  const nec = [
    [tm.elenen, { head: { tilt: 4, look: [0.7, 0.2] } }, 0.3],
    [tm.goturuyorum, { head: { tilt: -4, look: [0.1, 0.1] } }, 0.35],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Durum fonksiyonları ═══════════════════════════
// Tahtanın yazı durumu (her sahnede aynı fonksiyon)
function tahtaDurum(t, tm) {
  const d = { kisi: KISI.map((_, i) => seg(t, tm.yazK[i], 0.2)), mac: MAC.map((_, j) => seg(t, tm.yazM[j], 0.17)), macA: [1, 1, 1, 1], soru: seg(t, tm.soru, 0.14), halka: TEK.map((_, k) => seg(t, tm.halka[k], 0.22)), sonuc: 0, silgiRafta: true };
  // sayaçta silgi MAÇ sütununu yukarıdan aşağı siler
  if (t >= tm.sil0) {
    const ey = silgiYeri(t, tm)[1];
    d.macA = MAC.map((_, j) => t > tm.sil1 ? 0 : 1 - clamp01((ey - MY(j) + 10) / 24));
    if (t > tm.sil1) d.soru = 0;
    d.silgiRafta = t < tm.sil0 - 0.3 || t > tm.silKoy + 0.1;
  }
  if (t >= tm.espri) d.sonuc = 1;
  return d;
}
function silgiYeri(t, tm) {
  const u = seg(t, tm.sil0, tm.sil1 - tm.sil0), y = lerp(MY(0) - 10, MY(3) + 8, ease.state(u));
  return [MX + 4 + 16 * Math.sin(u * TAU * 3.5), y];
}
// Defne'nin kalem ucu: yazma vuruşları (sayılar soldan sağa), aralarda bir sonrakine gider
function kalemUcu(t, tm) {
  const vur = [];
  KISI.forEach((s, i) => { const w = s.length > 1 ? 36 : 18; vur.push([tm.yazK[i], 0.2, [KX - w / 2, KY(i) + 4], [KX + w / 2, KY(i) - 2]]); });
  MAC.forEach((s, j) => { const w = s.length > 1 ? 34 : 17; vur.push([tm.yazM[j], 0.17, [MX - w / 2, MY(j) + 4], [MX + w / 2, MY(j) - 2]]); });
  vur.push([tm.soru, 0.14, [MX + 20, MY(3) - 10], [MX + 30, MY(3) + 6]]);
  vur.sort((a, b) => a[0] - b[0]);
  if (t < vur[0][0]) return vur[0][2];
  for (let i = 0; i < vur.length; i++) {
    const [a, d, p0, p1] = vur[i];
    if (t < a + d) return [lerp(p0[0], p1[0], (t - a) / d), lerp(p0[1], p1[1], (t - a) / d)];
    const n = vur[i + 1]; if (n && t < n[0]) return H.yay(p1, n[2], ease.state((t - a - d) / (n[0] - a - d)), 10);
  }
  return vur[vur.length - 1][3];
}
// Kahraman an: kaç bardak sehpada
const bardakSay = (t, tm) => { let n = 0; for (let k = 0; k < 36; k++) if (t >= tm.g[k]) n = k + 1; return n; };
// B masasında o an oynanan maç (bardak sırası k: k'inci bardak bu maçın kaybedenine)
function bMaci(t, tm) {
  for (let k = 2; k < 36; k++) if (t < tm.g[k]) return k;
  return 36;   // final bitti
}
const macCifti = k => KEREM_MAC.includes(k) ? [FIG[(k * 5 + 1) % 12], KEREM] : [FIG[(k * 5 + 1) % 12], FIG[(k * 7 + 4) % 12]];

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 4, n1: 5, d4: 6 },
  dunya(K, t, B) { odaSahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'cevap') {
      const dur = tm.say.map((tt, k) => { const s = slot(k); return [tt, sabit(tm.cevap + 0.4)([s[0], s[1] - 82]), String(k + 1)]; });
      H.sayiAtla(K, t, dur, { son: tm.espri - 0.25, size: 50, fill: PAL.mustard, col: INK, sure: 0.07, yuksel: 22 });
      H.tag(K, t, tm.macC - 0.04, tm.espri - 0.25, sabit(tm.macC)([1960, 985]), `36 ${K.up('maç')}`, YESIL, PAL.paper, 50, [tm.macC + 0.45]);
    }
  },
});

// ——— oyuncu (yandan, oturur): sandalye → karakter → yaka kartı ———
function oyuncu(K, t, tl, key, x, f, { el = null, w = 0, expr = 'notr', look = [0.6, 0.35], tilt = 0, sessiz = true } = {}) {
  const p = otur(key, { x, facing: f, expr, head: { look, tilt } });
  const o = H.oturak(key, p);
  M.sandalye(K, o.x, o.y, { yon: f, w: 118, sirt: 160 });
  const c = oyna(K, t, tl, key, p, { ...(el && w > 0.01 ? { R: [el, w, 'A'] } : {}), sessiz });
  rozet(K, key, p);
  return c;
}
function bosSandalye(K, key, x, f) { const p = otur(key, { x, facing: f }); const o = H.oturak(key, p); M.sandalye(K, o.x, o.y, { yon: f, w: 118, sirt: 160 }); }

function odaSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  // ışık ve saat: kahraman anda hızlandırılmış zaman (gündüz → akşam); sonrası akşam
  const ut = id === 'cevap' ? seg(t, tm.tl0, tm.tl1 - tm.tl0) : t > tm.cevap ? 1 : 0;
  const isik = M.isikKaris('gunduz', 'aksam', ease.state(ut));
  const saat = 14.2 + t / 60 + 4.2 * ease.state(ut);
  M.mekanCiz(K, ODA, 'arka', t, { isik, durum: { saat } });
  const d = tahtaDurum(t, tm);
  tahta(K, d);
  // kupa kürsüsü (kancada Hikmet'in elinde; sonra kürsüde, d5'te Kerem kaldırır)

  cayArabasi(K, 3010, t);

  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const tahtaSah = id === 'tahta' || id === 'sayac' || id === 'buldum' || id === 'cta';

  // ═══ Hikmet (kancada A masasının arkasında, hakem gibi; kupayı sağ elinde omuz hizasında tutar, iki kez kaldırır) ═══
  if (id === 'kanca') {
    const sh = H.shoulder('hikmet', hp, 'R');
    const u = H.kaldir(t, [[tm.turnuva - 0.2, tm.yenilen - 0.1], [tm.sampiyon - 0.2]], { cik: 0.4, inis: 0.3 });
    const el = [sh[0] + 45, sh[1] - 195 - 25 * u];
    const h = oyna(K, t, tl, 'hikmet', hp, { heads, R: [el, 1, 'B'] });
    rozet(K, 'hikmet', hp);
    kupa(K, h.handR[0], h.handR[1], 1.3, H.nabiz(t, tm.turnuva + 0.25, 0.4) + H.nabiz(t, tm.sampiyon + 0.2, 0.4));
    h.tut('R');
  }
  // ═══ A masası ═══
  const sonraCiz = masaA(K, t, tl, S, id);
  // ═══ B masası ═══
  const bilgi = masaB(K, t, tl, S, id);
  if (typeof sonraCiz === 'function') sonraCiz();
  // kupa kürsüsü (B masası ile sehpa arasında)
  if (id === 'ipucu' || id === 'cevap' || id === 'buldum' || id === 'espri') { K.rect(KURSU - 34, 1314, 68, ZEMIN - 1314, '#7A4A26', LW, 4); K.rect(KURSU - 44, 1300, 88, 18, '#5E3A1E', LW, 4); }

  // ═══ ELENENLER sehpası, kalabalık, Necmi ═══
  sehpa(K, t, tl, S, id, heads, bilgi);
  if (id === 'cevap') keremKupa(K, t, tl, S, bilgi.kOn);
  if (id === 'ipucu' || id === 'buldum') kupa(K, KUPA0[0], KUPA0[1], 1);

  // ═══ Tahta başında Defne ve Hikmet ═══
  if (id === 'kanca') {
    oyna(K, t, tl, 'defne', dp, { heads });
  }
  if (tahtaSah) {
    const o = { heads };
    let kalemEl = null, silgiEl = null;
    if (id === 'tahta') {
      const uc = kalemUcu(t, tm), sh = H.shoulder('defne', dp, 'L'), u = H.unit(uc, sh), el = [uc[0] + u[0] * 55, uc[1] + u[1] * 55];
      const w = pIn(t, tm.yazK[0] - 0.3, tm.kalemBirak, 0.28);
      if (w > 0.01) { o.L = [el, w, 'A']; kalemEl = { uc, w }; }
    }
    if (id === 'sayac') {
      const sy = silgiYeri(t, tm), raf = [TH.x0 + 46, TH.y1 + 2];
      const p = t < tm.sil0 ? yol(t, [[tm.sayac, raf], [tm.sil0, [MX + 4, MY(0) - 10]]]) : t < tm.sil1 ? sy : yol(t, [[tm.sil1, sy], [tm.silKoy, raf]]);
      const w = pIn(t, tm.sayac - 0.1, tm.silKoy + 0.05, 0.25);
      if (w > 0.01) { const sh = H.shoulder('defne', dp, 'L'), u = H.unit(p, sh); o.L = [[p[0] + u[0] * 22, p[1] + u[1] * 22], w, 'A']; silgiEl = { p, w }; }
    }
    if (id === 'cta') {
      const g = H.elYeri('defne', dp, 'R', 'gogus'), y = H.elYeri('defne', dp, 'R', 'yukari'), wK = W(t, tm.cta + 0.05, 0.45);
      o.R = [[lerp(g[0], y[0] - 10, wK), lerp(g[1], y[1] + 95, wK)], 1, 'A'];
    }
    const dc = oyna(K, t, tl, 'defne', dp, o);
    if (kalemEl && kalemEl.w > 0.6) { kalem(K, kalemEl.uc, dc.handL); dc.tut('L'); }
    if (silgiEl && silgiEl.w > 0.6) { silgi(K, silgiEl.p[0], silgiEl.p[1], 0.1 * Math.sin(t * 9)); dc.tut('L'); }
    if (id === 'buldum') { kalem(K, [dc.handR[0] + 6, dc.handR[1] - 52], dc.handR); dc.tut('R'); H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof }); }
    if (id === 'cta') { const h = dc.handR; dc.tut('R'); zar(K, h[0] - 16, h[1] - 34, 6, -0.2, 1.8); zar(K, h[0] + 20, h[1] - 38, 5, 0.25, 1.8); }
    // Hikmet (yalnız tahta sahnesinde): h3'te avucunda zarlar; hd'de mercan halkaları dokunarak çizer, "durdu"da kalemi gösterir
    if (id === 'tahta') {
      const ho = { heads }; let zarEl = false, dok = null;
      const wZ = pIn(t, tm.tahta - 0.1, tm.sekiz - 0.2, 0.3);
      if (wZ > 0.01) { ho.R = [[HIK_TX + 128, 1128 - 10 * H.nabiz(t, tm.zarlar, 0.4)], wZ, 'A']; zarEl = wZ > 0.05; }
      const dz = [[tm.halka[0] - 0.4, [KX - 40, KY(0) + 60]], ...TEK.map((i, k) => [tm.halka[k], [KX - 20, KY(i) + 6]]), [tm.durdu, kalemUcu(t, tm)]];
      const wD = pIn(t, tm.halka[0] - 0.45, tm.kalemBirak + 0.2, 0.28);
      if (wD > 0.01) { const h = H.dokunYolu(t, dz, { yuksel: 24, sure: 0.18 }), sh = H.shoulder('hikmet', hp, 'R'), u = H.unit(h, sh); ho.R = [[h[0] + u[0] * 62, h[1] + u[1] * 62], wD, 'A']; if (wD > 0.5) dok = h; }
      const hc = oyna(K, t, tl, 'hikmet', hp, ho);
      rozet(K, 'hikmet', hp);
      if (zarEl) { hc.tut('R'); zar(K, hc.handR[0] - 14, hc.handR[1] - 30, 6, 0.2, 1.7); zar(K, hc.handR[0] + 18, hc.handR[1] - 26, 3, -0.3, 1.7); }
      if (dok) hc.isaret('R', dok);
    }
  }
}

// ——— A masası: kanca (Kerem – F1) ve sayaç (Kerem – F3) ———
function masaA(K, t, tl, S, id) {
  const { tm } = S, cx = (MA[0] + MA[1]) / 2;
  if (id !== 'kanca' && id !== 'sayac') return;
  const kanca = id === 'kanca';
  const rakip = kanca ? F1 : F3, kalk = kanca ? tm.f1Kalk : tm.f3Kalk, yur0 = kanca ? tm.f1Yur : tm.f3Yur;
  // zarlar: kancada 0,3'te düşer (F1 atar); sayaçta F3 atar
  const zt = kanca ? tm.zarIn : tm.f3Zar + 0.3, zIn = [[cx - 16, MASA_Y - 15], [cx + 14, MASA_Y - 19]];
  const elF = [OA[1] - 140, 1180];
  const zarlar = zIn.map((p, i) => {
    if (t >= zt) return { p, n: [5, 3][i], a: [0.2, -0.35][i] };
    if (kanca && t < 0) return null;
    const u = clamp01((t - (zt - 0.3)) / 0.3);
    if (!kanca && t < zt - 0.3) return null;
    return { p: H.yay([elF[0] - 10 + i * 18, elF[1] - 14], p, u, 50), n: [2, 4, 5, 3][(i + Math.floor(u * 3)) % 4], a: u * 5 + i };
  }).filter(Boolean);
  // Kerem'in pul hamleleri
  const hamle = kanca ? tm.pulA : [[tm.kPul, 3, [cx + 44, MASA_Y - 19]]];
  let eksik = 0, kEl = null, kW = 0;
  const pullar = [], azalt = [];
  for (const [a, i, hedef] of hamle) {
    const A = pulYeri(cx, i), r = PULLAR[i][2];
    if (t >= a - 0.35 && t < a + 0.75) { kW = Math.max(kW, pIn(t, a - 0.35, a + 0.5, 0.25)); kEl = t < a ? A : H.tasi(t, a, 0.45, A, hedef, 34); }
    if (t >= a) { pullar.push({ p: t < a + 0.45 ? H.tasi(t, a, 0.45, A, hedef, 34) : hedef, r }); azalt.push(i); }
  }
  // son hamle: Kerem pulları toplar (oyun biter), tabandan pullar azalır
  const top0 = kanca ? tm.topla : tm.kTopla;
  if (t >= top0 - 0.3) { const w = pIn(t, top0 - 0.3, top0 + 0.55, 0.25); if (w > kW) { kW = w; kEl = yol(t, [[top0 - 0.3, [cx - 80, MASA_Y - 18]], [top0, [cx - 80, MASA_Y - 18]], [top0 + 0.4, [cx - 130, MASA_Y - 30]]]); } eksik = Math.floor(clamp01((t - top0) / 0.4) * 3); }
  // F1 / F3 elinde zar (atmadan önce) ve atış kolu
  const fAt = kanca ? pIn(t, -1, zt + 0.15, 0.25) : pIn(t, zt - 0.6, zt + 0.15, 0.25);
  const kaybetti = t >= (kanca ? tm.elenir : tm.kTopla + 0.15);
  // çizim: sandalyeler ve oyuncular, masa, tavla, eller
  const kc = oyuncu(K, t, tl, KEREM, OA[0], 1, { el: kEl ? [kEl[0] - 18, kEl[1] - 18] : null, w: kW, expr: kaybetti ? 'mutlu' : 'notr', look: [0.5, 0.45], tilt: 3 });
  let fc = null, fYan = null;
  if (t < kalk) fc = oyuncu(K, t, tl, rakip, OA[1], -1, { el: fAt > 0.01 ? [elF[0] + 20, elF[1] + 6] : null, w: fAt, expr: kaybetti ? 'yorgun' : 'notr', look: [0.5, kaybetti ? 0.7 : 0.4], tilt: kaybetti ? 9 : 2 });
  else {
    bosSandalye(K, rakip, OA[1], -1);
    if (t < yur0) { fYan = kisi(rakip, { x: OA[1], view: 'side', facing: 1, expr: 'yorgun', head: { tilt: 8, look: [0.4, 0.5] } }); }
    else fYan = yuru(rakip, t, { t0: yur0, x0: OA[1], x1: kanca ? 2650 : 1760, t1: yur0 + (kanca ? 3.9 : 1.2) });
    fYan.expr = 'yorgun'; fYan.head = { ...fYan.head, tilt: 8, look: [0.4, 0.5] };
  }
  masa(K, MA);
  tavla(K, cx, { zarlar, pullar: t >= top0 ? [] : pullar, azalt, eksik, k: TAV_K });
  if (kc && kW > 0.6) kc.tut('R');
  if (fc && fAt > 0.6 && t < zt - 0.3) { zar(K, fc.handR[0] - 8, fc.handR[1] - 16, 2, 0, 1); zar(K, fc.handR[0] + 10, fc.handR[1] - 20, 4, 0.4, 1); fc.tut('R'); }
  // kalkan rakip: masanın önünden sağa yürür
  // kalkan rakip masanın önünden sağa yürür; kancada B masasındaki F2'nin ÖNÜNDEN geçsin diye sonra çizilir
  const yurCiz = fYan ? () => { oyna(K, t, tl, rakip, fYan, { sessiz: true }); rozet(K, rakip, fYan); } : null;
  if (yurCiz && !kanca) yurCiz();
  if (yurCiz && kanca) return yurCiz;
  // Necmi sayaçta askılı tepsiyle soldan sağa geçer (ön planda)
  if (id === 'sayac' && t > tm.nYur0) {
    const np = yuru('necmi', t, { t0: tm.nYur0, x0: 380, x1: 1640, t1: tm.nYur1 + 0.5 });
    np.expr = 'mutlu'; np.head = { ...np.head, tilt: -3, look: [0.5, 0.2] };
    const el = [np.x + 60, 1190];
    const c = oyna(K, t, tl, 'necmi', np, { R: [el, 1, 'A'], sessiz: true });
    const tp = [c.handR[0], c.handR[1] + 108];
    tepsi(K, tp[0], tp[1], 3, t); c.tut('R');
  }
}

// ——— B masası: h2a'da tur atlayan (F2 yalnız), kahraman anda maçlar ve Kerem'in finali ———
function masaB(K, t, tl, S, id) {
  const { tm } = S, cx = (MB[0] + MB[1]) / 2;
  if (id === 'kanca') {
    bosSandalye(K, F2, OB[0], 1); bosSandalye(K, F2, OB[1], -1);
    masa(K, MB); tavla(K, cx, { k: 1.05 });
    // F2: rakibi yok; "tek"te omuz silker, "tur atlar"da sevinçle sıçrar
    const p = kisi(F2, { x: 1792, expr: 'notr', head: { tilt: 0, look: [0.8, 0.2] }, ...POZ.dur });
    p.head.look = [Math.sin(t * 1.4) > 0 ? 0.8 : -0.4, 0.2];
    if (t > tm.tek - 0.6) { p.head.look = [0.05, 0.05]; p.expr = 'saskin'; }
    H.omuzSilk(p, t, tm.tek, 0.6);
    const u = seg(t, tm.tur - 0.05, 0.5);
    if (u > 0 && u < 1) { const a = Math.sin(Math.PI * u); p.y -= 70 * a; for (const k of ['armL', 'armR']) p[k] = { sh: lerp(p[k].sh, 160, a), el: lerp(p[k].el, -10, a) }; }
    if (t > tm.tur) p.expr = 'mutlu';
    oyna(K, t, tl, F2, p, { sessiz: true }); rozet(K, F2, p);
    return null;
  }
  if (id !== 'cevap') return null;
  // kahraman an: o an oynanan maç; son maç bitince Kerem yalnız kalır, d5'te kalkıp kupayı alır
  const k = bMaci(t, tm), [sol, sag] = k < 36 ? macCifti(k) : [null, KEREM];
  const kBitti = k >= 36;
  // gerçek zamanlı maç (k = 2): Kerem son pulları toplar; F4 kalkıp sehpaya yürür
  const gercek = t < tm.tl0;
  let eksik = 0, kEl = null, kW = 0;
  if (gercek) {
    const a = tm.elenirC - 0.75; kW = pIn(t, a - 0.3, a + 0.55, 0.25); kEl = yol(t, [[a - 0.3, [cx + 80, MASA_Y - 18]], [a, [cx + 80, MASA_Y - 18]], [a + 0.4, [cx + 120, MASA_Y - 30]]]); eksik = Math.floor(clamp01((t - a) / 0.4) * 3);
  } else if (!kBitti) {
    // hızlandırılmış: her maçta oyuncular değişir, el tavlada
    kW = 1; kEl = [cx + 60 + 14 * Math.sin(t * 23), MASA_Y - 20]; eksik = k % 4;
  }
  const solp = !kBitti && !(gercek && t >= tm.f4Kalk);
  if (solp) oyuncu(K, t, tl, gercek ? F4 : sol, OB[0], 1, { el: gercek ? null : [cx - 70, MASA_Y - 20], w: gercek ? 0 : 1, expr: gercek && t > tm.elenirC ? 'yorgun' : 'notr', look: [0.5, 0.45] });
  else bosSandalye(K, F4, OB[0], 1);
  // Kerem (sağ koltuk) — final bitince ve d5'te kalkar
  let kc = null, kOn = null;
  const kSag = gercek || sag === KEREM;
  if (t < tm.kKalk) {
    if (kSag) kc = oyuncu(K, t, tl, KEREM, OB[1], -1, { el: kEl ? [kEl[0] + 18, kEl[1] - 18] : null, w: kW, expr: kBitti || (gercek && t > tm.elenirC) ? 'mutlu' : 'notr', look: [0.5, 0.45], tilt: 3 });
    else oyuncu(K, t, tl, sag, OB[1], -1, { el: kEl ? [kEl[0] + 18, kEl[1] - 18] : null, w: kW, look: [0.5, 0.45] });
  } else {
    bosSandalye(K, KEREM, OB[1], -1);
    kOn = kisi(KEREM, { x: 2120, expr: 'mutlu', head: { tilt: -4, look: [0.3, -0.1] }, ...POZ.dur });
  }
  masa(K, MB);
  tavla(K, cx, { zarlar: [{ p: [cx - 14, MASA_Y - 16], n: 6 }, { p: [cx + 14, MASA_Y - 18], n: (k % 6) + 1, a: 0.3 }], eksik, k: 1.05 });
  if (kc && kW > 0.6) kc.tut('R');
  // F4 kalkar, sağa yürür (zaman atlaması başlayınca kalabalığa karışır)
  if (gercek && t >= tm.f4Kalk) {
    const p = t < tm.f4Kalk + 0.25 ? kisi(F4, { x: OB[0], view: 'side', facing: 1, expr: 'yorgun' }) : yuru(F4, t, { t0: tm.f4Kalk + 0.25, x0: OB[0], x1: 2240, t1: tm.f4Kalk + 2.2 });
    p.expr = 'yorgun'; p.head = { ...p.head, tilt: 8, look: [0.4, 0.5] };
    oyna(K, t, tl, F4, p, { sessiz: true }); rozet(K, F4, p);
  }
  // kupa: kürsüde; d5'te Kerem alır ve kaldırır

  return { k, kOn };
}
// Kerem kalkar, sehpanın ucundaki kupayı alır ve kaldırır (sehpa ve kalabalıktan SONRA çizilir: kupa önde kalsın)
function keremKupa(K, t, tl, S, kOn) {
  const { tm } = S;
  if (kOn) {
    const sh = H.shoulder(KEREM, kOn, 'R'), y = H.elYeri(KEREM, kOn, 'R', 'yukari');
    const al = W(t, tm.kKalk + 0.05, 0.3), kal = W(t, tm.kKaldir, 0.42);
    const el = kal > 0 ? [lerp(KUPA0[0], y[0] - 20, kal), lerp(KUPA0[1], y[1] + 60, kal)] : [lerp(sh[0] + 20, KUPA0[0], al), lerp(sh[1] + 150, KUPA0[1], al)];
    const c = oyna(K, t, tl, KEREM, kOn, { R: [el, 1, 'A'], sessiz: true }); rozet(K, KEREM, kOn);
    const tut = t >= tm.kAl - 0.05;
    kupa(K, tut ? c.handR[0] : KUPA0[0], tut ? c.handR[1] : KUPA0[1], 1, H.nabiz(t, tm.macC + 0.45, 0.4));
    if (al > 0.6) c.tut('R');
  } else kupa(K, KUPA0[0], KUPA0[1], 1);
}

// ——— ELENENLER sehpası: kalabalık (arka sıradan öne), Necmi, sehpa, bardaklar ———
function sehpa(K, t, tl, S, id, heads, bilgi) {
  const { tm } = S;
  const n = id === 'kanca' ? 0 : id === 'tahta' || id === 'sayac' ? 0 : id === 'ipucu' ? (t >= tm.teselli ? 2 : 1) : id === 'buldum' ? 2 : bardakSay(t, tm);
  // kalabalık: yer, bardak eşiğini geçince dolar
  const vis = id === 'ipucu' || id === 'cevap' || id === 'espri';
  const say = id === 'ipucu' ? 2 : id === 'espri' ? 36 : n;
  if (vis) {
    for (const sira of [2, 1, 0]) {
      for (const c of KALABALIK) {
        if (c.sira !== sira || say <= c.esik) continue;
        if (id === 'cevap' && c.key === F4 && t < tm.tl0) continue;   // F4 o an yürüyor
        const R = SIRA_K[sira], hik = c.key === 'hikmet';
        const p = hik ? H.kisi('hikmet', { x: c.x, y: R.y, s: H.BOY.hikmet * R.s }) : kisi(c.key, { x: c.x, y: R.y, s: BOYU[c.key] * R.s });
        p.expr = hik ? (id === 'espri' && t > tm.sogudu - 0.1 ? 'yorgun' : 'notr') : 'yorgun';
        p.head = { ...p.head, nod: 0, tilt: hik ? 3 : ((c.x * 7) % 9) - 4, look: [((c.x * 13) % 7) / 7 - 0.5, 0.35] };
        Object.assign(p, POZ.dur);
        const o = { sessiz: !hik, heads: hik ? heads : undefined };
        let bardakEl = null;
        if (hik && id === 'espri') {
          const g = H.elYeri('hikmet', p, 'R', 'gogus'), u = W(t, tm.cayim - 0.2, 0.4) * (1 - W(t, tm.sogudu + 0.55, 0.35));
          bardakEl = [lerp(g[0] - 10, g[0] - 40, u), lerp(g[1] - 10, g[1] - 60, u)];
          o.R = [bardakEl, 1, 'A'];
          if (u > 0.3) p.head = { ...p.head, tilt: 10, look: [-0.5, 0.75] };
        }
        const ciz = K2 => { const r = oyna(K2, t, hik ? tl : null, c.key, p, o); rozet(K2, c.key, p); return r; };
        let r;
        if (R.a > 0) H.lekele(K, K2 => { ciz(K2); }, '#24494C', R.a); else r = ciz(K);
        if (r && bardakEl) { r.tut('R'); bardak(K, r.handR[0] + 2, r.handR[1] - 24, { k: 1.4 }); }
      }
    }
  }
  // Necmi: ipucunda ve kahraman anda sehpanın arkasında
  let nc = null, nEl = null, nBardak = false;
  if (id === 'ipucu' || id === 'cevap') {
    const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    const o = { heads };
    o.L = [[np.x - 84, 1078], 1, 'A'];   // çaycı: askılı tepsi sol elde, omuz hizasında
    if (id === 'ipucu') {
      // sağ el bardağı "teselli"de 1 numaralı yere bırakır
      const hedef = slot(1), g = H.elYeri('necmi', np, 'R', 'gogus');
      nEl = t < tm.teselli - 0.5 ? [g[0] + 20, g[1] - 10] : t < tm.teselli ? H.tasi(t, tm.teselli - 0.5, 0.5, [g[0] + 20, g[1] - 10], [hedef[0], hedef[1] - 58], 30) : yol(t, [[tm.teselli + 0.25, [hedef[0], hedef[1] - 58]], [tm.teselli + 0.6, [g[0] + 10, g[1] + 40]]]);
      o.R = [nEl, 1, 'A']; nBardak = t < tm.teselli;
    } else {
      // kahraman an: bir sonraki bardağın sütununa gider, bardağı bırakır
      const kk = Math.min(35, bardakSay(t, tm)), sx = slot(kk)[0], ox = slot(Math.max(0, kk - 1))[0];
      const a = kk > 0 ? tm.g[kk - 1] : tm.cevap, b = kk < 36 ? tm.g[kk] : a + 1;
      const u = kk >= 36 ? 1 : ease.state(clamp01((t - a) / Math.max(0.05, b - a)));
      np.x = lerp(ox, sx, u) - 38;
      if (t > tm.g[35] + 0.4) np.x = slot(35)[0] - 38;
      const bas = kk < 36 ? b : tm.g[35];
      const dip = clamp01(1 - Math.abs(t - bas) / Math.max(0.04, Math.min(0.25, (b - a) * 0.6)));
      nEl = [np.x + 70, lerp(1190, slot(Math.min(35, kk))[1] - 26, dip)];
      o.R = [nEl, 1, 'A'];
      np.head = { ...np.head, look: [0.5, 0.6], tilt: 4 };
      if (t > tm.g[35] + 0.3) { np.head = { ...np.head, look: [-0.6, 0.2], tilt: -4 }; o.R = [H.elYeri('necmi', np, 'R', 'gogus'), 1, 'A']; }
    }
    nc = oyna(K, t, tl, 'necmi', np, o);
  }
  // sehpa (önden): üst yüzey yamuk, ön panel
  const { x0, x1, yb, yf } = SEH;
  K.poly([[x0 + 14, yb], [x1 - 14, yb], [x1, yf], [x0, yf]], PAL.woodTop, LW);
  K.rect(x0, yf, x1 - x0, 22, PAL.wood, LW, 4);
  K.rect(x0 + 16, yf + 22, x1 - x0 - 32, ZEMIN - yf - 40, '#86592E', LW, 4);
  for (const x of [x0 + 26, x1 - 46]) K.rect(x, ZEMIN - 22, 20, 22, PAL.woodDark, LW * 0.6, 3);

  // bardaklar (arka sıradan öne); "elenecekse"de dalga
  const bos = id === 'espri' ? 4 : -1;   // espride Hikmet kendi bardağını elinde tutuyor
  for (let k = 0; k < (id === 'espri' ? 36 : n); k++) {
    if (k === bos) continue;
    const [x, y] = slot(k), kab = id === 'cevap' ? H.nabiz(t, tm.dalga + k * 0.012, 0.32) + H.nabiz(t, tm.g[k] + 0.02, 0.22) : 0;
    bardak(K, x, y, { k: GK, buhar: k === n - 1 || (id === 'ipucu' && k < 2) || (id === 'espri' && k % 5 === 1), t: t + k * 0.37, kab });
  }
  if (nc) {
    tepsi(K, nc.handL[0], nc.handL[1] + 108, id === 'ipucu' ? 2 : 3, t); nc.tut('L');
    if (nBardak) { bardak(K, nc.handR[0], nc.handR[1] + 58, { k: GK, buhar: true, t }); nc.tut('R'); }
    else if (id === 'cevap' && t < tm.g[35] + 0.3) nc.tut('R');
  }
  void bilgi;
}
