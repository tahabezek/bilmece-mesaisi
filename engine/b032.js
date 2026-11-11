// Bölüm 32 · KEREM'İN İKİ GÜNÜ (v4 "hikâye" dili; storyboard: hikayeler/bolum_032_v5.md).
// Logline: Kerem dün yokuşu çıkıp depoya gitti, bugün aynı yoldan indi. Hikmet, yolda bir noktadan iki gün de aynı saatte
// geçtiğinden emindir. Defne iki günü üst üste koyar.
// Akılda kalacak tek şey: dünkü Kerem ile bugünkü Kerem aynı yolda karşılıklı yürüse mutlaka karşılaşırlar.
// İki set aynı dünyada: ofis kapısının önü (b032_kapi, x 0 civarı, tam boy) ve yandan görülen yokuş (b032_yokus, x 4000'den
// başlar, karakterler BOY × 0,45). Yokuşta yürüyen her ayak yola basar: yuru() pozu ayakla() ile eğime oturtulur (yokuş
// yukarı inen ayak ters kinematikle bükülür, gövde eğime göre öne/arkaya eğilir).
// Her şey t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur. Ortak motor: hikaye.js + mekan.js.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const KAPI = 'b032_kapi', YOKUS = 'b032_yokus';
const OX = 4000, FB = 0.5;                                  // yokuş setinin dünya kayması · karakter ölçeği
const HARDAL = '#E0A82E', PETROL = '#2F8C86';
const sB = key => H.BOY[key] * FB;
// Ofis kapısı (A): düz kaldırım 1500; x 780'den sonra yokuş başlar
const A_X0 = 780, A_K = 0.22;
const DEF_X = 210, HIK_X = 760, KER_X = 990, NEC_X = 980;
const PANO = { x: 455, y: 1020, w: 300, h: 190 }, P0 = [338, 1080], P1 = [570, 958];   // şövaledeki yol maketi · maketteki yolun iki ucu
const TEPSI = [[372, 1113], [572, 1113]], CUBUK = 200;                                 // şövale tablası üstünde yatan işaret çubuğu
const SAAT_A = [455, 640];
// Yokuş (B, yerel x): ofis sahanlığı 1170 → depo sahanlığı 850
const B_X0 = 170, B_X1 = 920, B_Y0 = 1170, B_K = 320 / 750;
const KO = 100, KD = 975, CAY_X = 192, BANK_X = 760, BULUS_U = 448, BULUS_D = 592, BULUS = 520;   // kapılar, duraklar, buluşma
const BARDAK = [OX + 231, 1004];

// ——— küçük yardımcılar ———
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const ekle = (p, d) => [p[0] + d[0], p[1] + d[1]];
const lin = u => u;
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
function izF(keys, t) {   // nokta izi; hedef işlev olabilir: [t, nokta | () => nokta, süre, eğri, lift]
  const val = k => typeof k === 'function' ? k() : k; let v = val(keys[0][1]);
  for (const [tk, tgt, d = 0.3, curve = ease.state, lift = 0] of keys) { if (tk > t) break; const u = d > 0 ? curve(seg(t, tk, d)) : 1, g = val(tgt); v = [lerp(v[0], g[0], u), lerp(v[1], g[1], u) - lift * 4 * u * (1 - u)]; }
  return v;
}
const soft = (u, r) => u <= -r ? 0 : u >= r ? u : (u + r) * (u + r) / (4 * r);
const yolA = x => 1500 - A_K * soft(x - A_X0, 90);
const yolBl = xl => B_Y0 - B_K * (soft(xl - B_X0, 60) - soft(xl - B_X1, 60));
const yolB = x => yolBl(x - OX);
const egim = (yol, x) => (yol(x + 2) - yol(x - 2)) / 4;

// ═══════════════════════════ Yokuşta yürüyüş ═══════════════════════════
// Yan görünüşte iki ayağı yola oturtur. Yokuş aşağıdaki ayak pozunu korur (salınım payıyla), yokuş yukarıdaki ayak
// iki kemikli ters kinematikle yola kadar bükülür; sonra gövde, referans ayak yolda kalacak biçimde kaydırılır.
function ayakla(key, p, yol) {
  p.y = yol(p.x);
  if (p.view !== 'side') return p;
  const c = H.CARDS[key], s = p.s, f = p.facing || 1, dx = 0.24 * c.shoe.len * s * f, fh = c.shoe.h * 0.75 * s;
  const SD = ['L', 'R'], ank = SD.map(sd => H.eklem(key, p, 'ankle' + sd));
  const d = ank.map(a => yol(a[0] + dx) - p.y);
  const ref = d[0] >= d[1] ? 0 : 1, j = 1 - ref, e = d[ref] - d[j];
  const pay = p.y - (ank[ref][1] + fh);                 // referans ayağın düz zemindeki salınım yüksekliği
  if (e > 0.3) {
    const hip = H.eklem(key, p, 'pelvis');
    const tx = (ank[j][0] - hip[0]) / (s * f), ty = (ank[j][1] - e - hip[1]) / s;
    const a = c.leg.upper, b = c.leg.lower, d0 = Math.hypot(tx, ty) || 1e-6;
    const dd = cl(d0, Math.abs(a - b) + 0.02, a + b - 0.003), ux = tx * dd / d0, uy = ty * dd / d0;
    const phi = Math.atan2(ux, uy), al = Math.acos(cl((a * a + dd * dd - b * b) / (2 * a * dd), -1, 1));
    const hp = phi + al, sg = Math.atan2(ux - Math.sin(hp) * a, uy - Math.cos(hp) * a);
    p['leg' + SD[j]] = { hip: hp / H.D2R, knee: (hp - sg) / H.D2R };
  }
  const yeni = H.eklem(key, p, 'ankle' + SD[ref]);
  p.y += (yol(yeni[0] + dx) - pay) - (yeni[1] + fh);
  return p;
}
// Yürüyüş (yokuş): H.yuru + eğime göre gövde eğimi (yukarı çıkarken öne, inerken hafif arkaya) + ayakla
function yuruY(key, t, o, yol) {
  const p = H.yuru(key, t, { ...o, y: 0 }), amp = clamp01((p.lean || 0) / 4);
  const dir = Math.sign(o.x1 - o.x0) || 1, rise = -egim(yol, p.x) * dir;
  p.lean = 4 * amp + (rise > 0 ? 15 : 8) * rise * (0.45 + 0.55 * amp);
  return ayakla(key, p, yol);
}
// İki poz arası karışım (oturmaya geçiş)
function karis(a, b, u) {
  if (u <= 0) return a; if (u >= 1) return b;
  const p = { ...a, head: { ...a.head } };
  for (const k of ['lean', 'bob', 'x']) p[k] = lerp(a[k] || 0, b[k] || 0, u);
  for (const k of ['legL', 'legR', 'armL', 'armR']) { p[k] = {}; for (const q of new Set([...Object.keys(a[k]), ...Object.keys(b[k])])) { const z = q === 'k' ? 1 : 0; p[k][q] = lerp(a[k][q] ?? z, b[k][q] ?? z, u); } }
  return p;
}
// Yolcu: plan = { x0, f0, s, olay: [['yuru', t0, t1, x1] | ['don', t, yon] …], otur: [[t0, t1]], poz }
function yolcu(key, t, P, yol) {
  let x = P.x0, f = P.f0;
  for (const ev of P.olay) {
    if (ev[0] === 'don') { if (t >= ev[1]) f = ev[2]; continue; }
    const [, a, b, x1] = ev;
    if (t < a) break;
    if (t < b) { const p = yuruY(key, t, { t0: a, t1: b, x0: x, x1, s: P.s }, yol); return { p, x: p.x, f: p.facing, yuruyor: true }; }
    f = Math.sign(x1 - x) || f; x = x1;
  }
  let p = kisi(key, { view: 'side', facing: f, x, s: P.s, ...(P.poz || {}) });
  for (const [a, b] of P.otur || []) if (t >= a && t < b) { const u = W(t, a, 0.26) * (1 - W(t, b - 0.26, 0.26)); p = karis(p, H.otur(key, { x, facing: f, s: P.s, ...(P.poz || {}) }), u); }
  return { p: ayakla(key, p, yol), x, f };
}

// ═══════════════════════════ Bekçi (geri dönüşte tek sahnelik figüran) ═══════════════════════════
// Kadro kartlarına dokunulmaz; bekçi bu bölümün kendi kartıdır (ad b032_ önekiyle). Kasket çizimle eklenir.
if (!H.CARDS.b032_bekci) {
  const h = H.CARDS.hikmet;
  H.CARDS.b032_bekci = {
    ...h, key: 'b032_bekci', name: 'Bekçi', seed: 211,
    torso: { ...h.torso, belly: 0.1, color: '#4E6B5C', shade: '#3F584B' },
    arm: { ...h.arm, color: '#4E6B5C', shade: '#3F584B' },
    leg: { ...h.leg, color: '#2F3B33', shade: '#252F29' },
    skin: '#CF9B74', skinShade: '#B5825D', hair: '#3A2E26',
    features: ['vest', 'mustacheThick', 'hairSlick'],
  };
}
function kasket(K, p) {
  const s = p.s, f = p.facing || 1, c = H.eklem('b032_bekci', p, 'head'), { ctx } = K;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(f, 1);
  K.poly([[0.3 * s, -0.36 * s], [0.74 * s, -0.3 * s], [0.7 * s, -0.24 * s], [0.26 * s, -0.27 * s]], '#1F2B26', LW * 0.6);   // siper
  ctx.beginPath(); ctx.ellipse(-0.02 * s, -0.4 * s, 0.5 * s, 0.24 * s, 0, Math.PI, 0); ctx.closePath(); K.fs('#2E4038', LW * 0.7);
  K.rect(-0.5 * s, -0.42 * s, 0.98 * s, 0.13 * s, '#24332D', LW * 0.6, 4);
  K.circ(0.3 * s, -0.36 * s, 0.07 * s, HARDAL, LW * 0.4);
  ctx.restore();
}

// ═══════════════════════════ Nesneler ═══════════════════════════
function cay(K, [x, y], k = 1) {   // çay bardağı: (x, y) bardağın tutulduğu bel noktası
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.poly([[-15, -30], [15, -30], [10, -10], [16, 10], [11, 18], [-11, 18], [-16, 10], [-10, -10]], '#B5532A', LW * 0.6);
  K.rect(-15, -34, 30, 10, '#F1E6D2', LW * 0.5, 3);
  ctx.restore();
}
function tabak(K, [x, y], k = 1) { K.ell(x, y, 26 * k, 6 * k, PAL.cream, LW * 0.5); }
// Raptiye: taban maketteki yol noktası; baş 28 px yukarıda (lift: elde, yolun üstünde)
function raptiye(K, taban, renk, lift = 0) {
  const b = [taban[0], taban[1] - lift], hd = [b[0], b[1] - 28];
  K.line(b[0], b[1], hd[0], hd[1], 4, '#5D6A61'); K.circ(hd[0], hd[1], 15, renk, LW * 0.7); K.circ(hd[0] - 4, hd[1] - 4, 4, '#FFFFFF', 0);
}
const yolNok = u => kar(P0, P1, u), basNok = (u, lift = 0) => ekle(yolNok(u), [0, -28 - lift]);
// İşaret çubuğu: el noktası h, uç q (uç koyu lastik)
function cubuk(K, h, q) {
  const u = H.unit(h, q), b = ekle(h, [-u[0] * 16, -u[1] * 16]), tu = ekle(q, [-u[0] * 22, -u[1] * 22]), { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, b, q, 13, INK); H.strokeLine(ctx, b, q, 7, PAL.woodTop); H.strokeLine(ctx, tu, q, 7, '#3A2A20');
  ctx.restore();
}
// Çubuğu tutan el: omuz merkezli r_h çemberi ile uç merkezli CUBUK çemberinin alt kesişimi
function elUcu(sh, q, L = CUBUK) {
  const dx = q[0] - sh[0], dy = q[1] - sh[1], d = Math.hypot(dx, dy) || 1e-6;
  const r = cl(Math.max(75, L - d + 12, d - 0.75 * L), 40, 168);
  const a = cl((r * r - L * L + d * d) / (2 * d), -r, r), hh = Math.sqrt(Math.max(0, r * r - a * a)), ux = dx / d, uy = dy / d;
  const p1 = [sh[0] + ux * a - uy * hh, sh[1] + uy * a + ux * hh], p2 = [sh[0] + ux * a + uy * hh, sh[1] + uy * a - ux * hh];
  return p1[1] > p2[1] ? p1 : p2;
}

// ═══════════════════════════ Mekân A: ofis kapısı ve yokuşun başı ═══════════════════════════
const KALDIRIM = '#CDBB97', KALDIRIM2 = '#B7A47F', CEPHE = '#E6D5B3', CEPHE2 = '#CDB892';
function marti(K, t, x0, y0, faz) {   // gökte süzülen martı (döngü)
  const u = ((t * 0.09 + faz) % 1), x = x0 + u * 1500, y = y0 + 18 * Math.sin(t * 1.4 + faz * 6), k = 1.1, { ctx } = K, fl = 7 * Math.sin(t * 5 + faz * 9);
  ctx.beginPath(); ctx.moveTo(x - 24 * k, y - fl); ctx.quadraticCurveTo(x - 11 * k, y - 13 * k, x, y); ctx.quadraticCurveTo(x + 11 * k, y - 13 * k, x + 24 * k, y - fl);
  ctx.lineWidth = 4.5; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
}
function sovale(K) {   // şövale + yol maketi (pano)
  const { x, y, w, h } = PANO, x0 = x - w / 2, y0 = y - h / 2;
  K.line(x0 + 50, y0 + h, x0 + 22, 1500, 12, INK); K.line(x0 + 50, y0 + h, x0 + 22, 1500, 6, PAL.woodDark);
  K.line(x0 + w - 50, y0 + h, x0 + w - 22, 1500, 12, INK); K.line(x0 + w - 50, y0 + h, x0 + w - 22, 1500, 6, PAL.woodDark);
  K.line(x, y0 - 20, x, 1490, 10, INK); K.line(x, y0 - 20, x, 1490, 5, PAL.wood);
  K.rect(x0 - 6, y0 - 6, w + 12, h + 12, PAL.woodTop, LW, 8);
  K.rect(x0 + 6, y0 + 6, w - 12, h - 12, '#F4EBD8', LW * 0.6, 4);
  // maket: gök şeridi, yamaç, yol
  const a = P0, b = P1, n = [0.47, 0.88];
  K.poly([[x0 + 8, a[1] + 14], [a[0] - 20, a[1] + 14], [b[0] + 20, b[1] + 8], [x0 + w - 8, b[1] + 8], [x0 + w - 8, y0 + h - 8], [x0 + 8, y0 + h - 8]], '#B9C79A', 0);
  K.line(a[0] - 14, a[1] + 4, b[0] + 14, b[1] - 2, 13, INK); K.line(a[0] - 14, a[1] + 4, b[0] + 14, b[1] - 2, 7, '#8E9A90');
  // ofis (sol alt) ve depo (sağ üst)
  K.rect(a[0] - 34, a[1] - 46, 26, 48, CEPHE, LW * 0.5, 2); for (const yy of [-36, -22]) K.rect(a[0] - 29, a[1] + yy, 16, 7, '#7FA9A6', 0);
  K.rect(b[0] + 2, b[1] - 32, 30, 34, '#9C8A6A', LW * 0.5, 2); K.poly([[b[0] - 1, b[1] - 32], [b[0] + 17, b[1] - 46], [b[0] + 35, b[1] - 32]], '#7A5A3A', LW * 0.5);
  // çaycı, çınar, bank (küçük)
  const c = yolNok(0.21), t2 = yolNok(0.5), bk = yolNok(0.77);
  K.rect(c[0] - 4, c[1] - 30, 3, 22, INK, 0); K.rect(c[0] + 18, c[1] - 33, 3, 22, INK, 0); K.poly([[c[0] - 8, c[1] - 32], [c[0] + 26, c[1] - 37], [c[0] + 26, c[1] - 30], [c[0] - 8, c[1] - 25]], PAL.red, LW * 0.4);
  K.rect(t2[0] - 3, t2[1] - 40, 6, 34, PAL.woodDark, 0); K.circ(t2[0], t2[1] - 52, 21, '#6E9A55', LW * 0.5);
  K.rect(bk[0] - 12, bk[1] - 18, 26, 5, PAL.woodDark, 0); K.rect(bk[0] - 12, bk[1] - 13, 3, 9, INK, 0); K.rect(bk[0] + 11, bk[1] - 13, 3, 9, INK, 0);
  void n;
  // tabla
  K.rect(x0 + 18, y0 + h + 4, w - 36, 14, PAL.woodDark, LW * 0.7, 3);
}
M.mekanEkle(KAPI, {
  gen: [-800, 2400], dongu: ['bulutlar ve martılar', 'kerem\'in elindeki çayın buharı / yokuştaki bayrak'],
  capa: { pano: [PANO.x, PANO.y], saat: SAAT_A, tepsi: TEPSI[0] },
  kadraj: { genis: [1.0, 560, 1000], hikmet: [1.2, 560, 1005], pano: [1.22, 455, 1010], sayac: [1.0, 610, 1000], buldum: [1.35, 290, 905], espri: [0.96, 660, 1000], cta: [1.4, 300, 925] },
  arka(K, t, { isik }) {
    const { ctx } = K;
    M.acikHava(K, { x0: -800, x1: 2400, floorY: 1500, isik, zemin: 'kaldirim', gunes: 0.3, siluet: true, t });
    for (let i = 0; i < 2; i++) marti(K, t, -200, 560 + i * 90, i * 0.47);
    // yokuşun arkasındaki yamaç (çimen) ve taş duvar
    const XS = []; for (let x = A_X0 - 60; x <= 2400; x += 20) XS.push(x);
    const arkaK = x => yolA(x) - 34 * clamp01((x - A_X0 + 20) / 140);
    K.poly([...XS.map(x => [x, arkaK(x) - 70 - 0.35 * soft(x - A_X0, 90)]), [2400, 1600], [A_X0 - 60, 1600]], '#9DAE76', LW);
    K.poly([...XS.map(x => [x, arkaK(x) - 46]), ...XS.slice().reverse().map(x => [x, arkaK(x)])], '#C9B48A', LW * 0.8);
    for (let x = A_X0; x < 2400; x += 70) K.line(x, arkaK(x) - 46, x, arkaK(x), 3, '#A8946C');
    // bayrak direği (döngü: dalgalanan bayrak)
    { const bx = 1230, by = arkaK(bx) - 46; K.line(bx, by, bx, by - 420, 8, INK); const q = []; for (let i = 0; i <= 8; i++) q.push([bx + i * 16, by - 410 + 6 * Math.sin(t * 5 - i * 0.7) * (i / 8)]); K.poly([...q, ...q.slice().reverse().map(([x, y]) => [x, y + 74 + 4 * Math.sin(t * 5)])], PAL.red, LW * 0.6); }
    // zemin: düz kaldırım + yokuş (ayaklar yolun ortasına basar)
    K.poly([[-800, 1500], [A_X0 - 60, 1500], ...XS.map(x => [x, arkaK(x)]), [2400, 2600], [-800, 2600]], KALDIRIM, 0);
    ctx.save(); K.path([[-800, 1500], [A_X0 - 60, 1500], ...XS.map(x => [x, arkaK(x)]), [2400, 2600], [-800, 2600]]); ctx.clip();
    for (const dy of [70, 190, 360]) K.line(-800, 1500 + dy, 2400, 1500 + dy - 0.0, 3, KALDIRIM2);
    for (let x = -700; x < 2600; x += 180) K.line(x, 1500, x - 200, 2400, 3, KALDIRIM2);
    ctx.restore();
    K.path([[-800, 1500], [A_X0 - 60, 1500], ...XS.map(x => [x, arkaK(x)])], false); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
    // ofis cephesi
    K.rect(-800, 300, 1330, 1200, CEPHE, LW);
    K.rect(-800, 1420, 1330, 80, CEPHE2, LW * 0.8);
    for (const wx of [-620, -400]) for (const wy of [560, 900]) { K.rect(wx, wy, 150, 190, '#7FA9A6', LW, 6); K.line(wx + 75, wy, wx + 75, wy + 190, 5); K.rect(wx - 10, wy + 190, 170, 16, PAL.trim, LW * 0.6, 3); }
    K.rect(-150, 560, 150, 190, '#7FA9A6', LW, 6); K.line(-75, 560, -75, 750, 5); K.rect(-160, 750, 170, 16, PAL.trim, LW * 0.6, 3);
    // kapı ve levha
    K.rect(30, 1120, 230, 380, '#2F6F6A', LW, 6); K.rect(48, 1140, 92, 340, '#9CC3BF', LW * 0.6, 3); K.rect(150, 1140, 92, 340, '#9CC3BF', LW * 0.6, 3);
    K.rect(124, 1290, 10, 60, INK, 0); K.rect(156, 1290, 10, 60, INK, 0);
    K.rect(40, 1040, 210, 64, PAL.cream, LW * 0.8, 8); K.text(K.up('ofis'), 145, 1090, 52, INK, 900);
    M.duvarSaati(K, SAAT_A[0], SAAT_A[1], 46, 9 + 40 / 60, t);
    // şövale ve maket
    sovale(K);
  },
});

// ═══════════════════════════ Mekân B: yokuş ═══════════════════════════
const YOL = '#76817A', YOL2 = '#5D6A61', YAMAC = '#A3B27C', YAMAC2 = '#8D9C67';
function cinar(K, t, x, y) {   // çınar: gövde + yaprak kümesi (döngü: yapraklar hafifçe sallanır)
  K.poly([[x - 26, y], [x - 16, y - 350], [x - 60, y - 450], [x - 44, y - 462], [x, y - 390], [x + 40, y - 470], [x + 56, y - 456], [x + 16, y - 350], [x + 26, y]], '#8A6A48', LW);
  const k = [[0, -560, 150], [-140, -510, 110], [140, -515, 115], [-80, -650, 115], [90, -645, 120], [0, -450, 100], [170, -435, 72]];
  k.forEach(([dx, dy, r], i) => { const o = 5 * Math.sin(t * 1.3 + i * 1.7); K.circ(x + dx + o, y + dy + 0.5 * o, r, i % 2 ? '#6E9A55' : '#628E4C', LW); });
  k.forEach(([dx, dy, r], i) => { if (i % 3) return; const o = 5 * Math.sin(t * 1.3 + i * 1.7); K.circ(x + dx + o - r * 0.25, y + dy - r * 0.25, r * 0.38, '#7FAA62', 0); });
}
function caySatici(K, t, x, y) {   // çaycı tezgâhı: (x, y) tezgâhın sol alt köşesi (yolun arka kenarı)
  K.rect(x - 6, 780, 9, y - 780, INK, 0); K.rect(x + 126, 780, 9, y - 780, INK, 0);
  K.rect(x, y - 96, 130, 96, '#B9845A', LW, 4); K.rect(x - 8, y - 104, 146, 14, PAL.woodTop, LW * 0.8, 3);
  for (let i = 0; i < 6; i++) K.poly([[x - 14 + i * 26, 772], [x + 12 + i * 26, 772], [x + 12 + i * 26, 816], [x - 14 + i * 26, 816]], i % 2 ? PAL.cream : PAL.red, 0);
  K.rect(x - 14, 772, 156, 44, null, LW, 3);
  K.rect(x + 2, 816, 126, 50, PAL.cream, LW * 0.8, 6); K.text(K.up('çay'), x + 65, 858, 48, PAL.red, 900);
  // semaver (döngü: buhar)
  const sx = x + 100, sy = y - 104;
  K.poly([[sx - 20, sy], [sx + 20, sy], [sx + 16, sy - 48], [sx + 22, sy - 58], [sx - 22, sy - 58], [sx - 16, sy - 48]], '#C9B178', LW * 0.7);
  K.rect(sx - 12, sy - 74, 24, 18, '#B5532A', LW * 0.6, 4);
  H.buhar(K, sx, sy - 82, t, { k: 0.55, n: 2, ara: 60 });
  tabak(K, [x + 32, sy + 1], 0.7);
}
function bank(K, x, oturY) {   // bank: oturağın üst kenarı oturY, yola göre bacaklar
  const L = x - 70, R = x + 70, yL = yolB(L) - 14, yR = yolB(R) - 14;
  K.line(L + 14, oturY, L + 14, yL, 10, INK); K.line(R - 14, oturY, R - 14, yR, 10, INK);
  K.rect(L, oturY - 64, 140, 14, PAL.wood, LW * 0.7, 4); K.rect(L, oturY - 40, 140, 14, PAL.wood, LW * 0.7, 4);
  K.line(L + 14, oturY - 64, L + 14, oturY, 8, INK); K.line(R - 14, oturY - 64, R - 14, oturY, 8, INK);
  K.rect(L - 6, oturY, 152, 16, PAL.woodTop, LW * 0.8, 4);
}
function ofisB(K) {
  const x0 = OX - 300, x1 = OX + 175, y = yolBl(0) - 26;
  K.rect(x0, y - 400, x1 - x0, 400, CEPHE, LW); K.rect(x0 - 10, y - 416, x1 - x0 + 20, 22, CEPHE2, LW * 0.8, 3);
  for (const wx of [x0 + 40, x0 + 160]) for (const wy of [y - 360, y - 210]) K.rect(wx, wy, 80, 100, '#7FA9A6', LW * 0.8, 4);
  K.rect(OX + 50, y - 238, 100, 238, '#2F6F6A', LW, 4); K.rect(OX + 62, y - 224, 76, 214, '#9CC3BF', LW * 0.5, 3);
}
function depoB(K) {
  const x0 = OX + 925, x1 = OX + 1320, y = yolBl(1000) - 26;
  K.rect(x0, y - 290, x1 - x0, 290, '#B49C76', LW); K.poly([[x0 - 16, y - 290], [x0 + (x1 - x0) / 2, y - 380], [x1 + 16, y - 290]], '#8C6A44', LW);
  K.rect(OX + 932, y - 236, 114, 236, '#5D6A61', LW, 3); for (let i = 1; i < 9; i++) K.line(OX + 936, y - 236 + i * 26, OX + 1042, y - 236 + i * 26, 4, '#4A5650');
  K.rect(OX + 1070, y - 92, 84, 92, '#C99A5B', LW * 0.8, 3); K.rect(OX + 1086, y - 160, 68, 68, '#B98A4E', LW * 0.8, 3);
}
M.mekanEkle(YOKUS, {
  gen: [OX - 800, OX + 2000], zemin: 'eğimli (yolBl)', dongu: ['bulutlar ve güneşin yayı', 'semaver buharı, çınar yaprakları'],
  capa: { ofisKapisi: [OX + KO, yolBl(KO)], depoKapisi: [OX + KD, yolBl(KD)], bardak: BARDAK, bank: [OX + BANK_X, yolBl(BANK_X)], bulusma: [OX + BULUS, yolBl(BULUS)] },
  kadraj: { genis: [0.96, OX + 560, 960], geri: [1.3, OX + 575, 905], bulus: [1.03, OX + 556, 930] },
  arka(K, t, { isik, durum }) {
    const { ctx } = K;
    M.acikHava(K, { x0: OX - 800, x1: OX + 2000, floorY: 1330, isik, zemin: 'cim', gunes: durum.gunes ?? 0.4, ay: durum.ay ?? null, siluet: true, t });
    const XS = []; for (let x = -800; x <= 2000; x += 20) XS.push(x);
    // yolun arkasındaki yamaç
    K.poly([...XS.map(x => [OX + x, yolBl(x) - 26 - 40 - 0.12 * soft(x - 300, 200)]), [OX + 2000, 1400], [OX - 800, 1400]], YAMAC2, LW);
    ofisB(K); depoB(K);
    caySatici(K, t, OX + 210, yolBl(265) - 26);
    cinar(K, t, OX + 640, yolBl(640) - 22);
    // yol bandı: arka kenar −26, ön kenar +26; ayaklar ortada
    K.poly([...XS.map(x => [OX + x, yolBl(x) - 26]), ...XS.slice().reverse().map(x => [OX + x, yolBl(x) + 26])], YOL, LW);
    ctx.save(); ctx.setLineDash([26, 30]); K.path(XS.map(x => [OX + x, yolBl(x) + 2]), false); ctx.lineWidth = 5; ctx.strokeStyle = '#E9E2CF'; ctx.stroke(); ctx.restore();
    // yolun altındaki istinat duvarı ve yamaç
    K.poly([...XS.map(x => [OX + x, yolBl(x) + 26]), ...XS.slice().reverse().map(x => [OX + x, yolBl(x) + 92])], '#C9B48A', LW * 0.8);
    for (let x = -780; x < 2000; x += 64) K.line(OX + x, yolBl(x) + 26, OX + x, yolBl(x) + 92, 3, '#A8946C');
    K.poly([...XS.map(x => [OX + x, yolBl(x) + 92]), [OX + 2000, 2400], [OX - 800, 2400]], YAMAC, LW);
    const rnd = H.mulberry32(32); for (let i = 0; i < 40; i++) { const gx = OX - 300 + rnd() * 1700, gy = yolBl(gx - OX) + 140 + rnd() * 700; K.line(gx, gy, gx - 7, gy - 18, 4, YAMAC2); K.line(gx, gy, gx + 8, gy - 15, 4, YAMAC2); }
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    tak: 0.32, kerem: T('h1:0'), nokta: T('h1:3'), ikiGun: T('h1:4'),
    kesB: T('h2a') - 0.08, h2a: T('h2a'), h2b: T('h2b'),
    neden: T('h2b:8') - 0.07, d2: T('d2'), bagli: T('d2:4'), hd: T('hd'), kesin: T('hd:6'),
    cd, cd0, sayac: cd0 - 0.15,
    clue: T('n1'), geri: T('n1:2') - 0.06, buruna: T('n1:8'),
    buldum: T('d3'), proof: T('d3>') + 0.05,
    basla: T('d4:1'), bulus: T('d4:9') + 0.1, d5: T('d5'), yerden: T('d5:1'), ayni: T('d5:5'), saatte: T('d5:6'),
    h4: T('h4'), espri: T('h4') - 0.25, dakik: T('h4:5'),
    cta: T('d6') - 0.15, end: T('d6>') + 0.1,
  };
  // yokuş, kurulum (h2a + h2b): dün çıkış → çaycı → depo → gece atlaması → bugün iniş → bank → ofis
  Object.assign(tm, { w1s: tm.h2a + 0.09, w1e: tm.h2a + 0.79, c0: tm.h2a + 0.79, w2s: tm.h2a + 2.09, w2e: T('h2a:8') + 0.25 });
  Object.assign(tm, { gece0: tm.w2e + 0.1, gece1: tm.h2b - 0.03, w3s: tm.h2b + 0.02, w3e: tm.h2b + 0.67, w4s: tm.h2b + 1.42, w4e: tm.neden - 0.07 });
  // d2 / hd / sayaç: maketteki raptiyeler (u: 0 ofis … 1 depo)
  Object.assign(tm, { cAl: tm.neden + 0.32, r1: tm.d2 - 0.2, r1k: tm.d2 + 0.08, t1: tm.d2 + 0.55, r2: tm.d2 + 0.6, r2k: tm.d2 + 0.84, t2: tm.d2 + 1.2 });
  // cevap: iki Kerem
  Object.assign(tm, { u1e: tm.basla + 0.8, u2s: tm.basla + 1.8, d1e: tm.basla + 0.72, d2s: tm.basla + 1.82 });
  // espri: Kerem yokuştan iner
  Object.assign(tm, { kw0: tm.espri + 0.02, kw1: tm.espri + 1.2, silk: tm.dakik + 0.35 });

  const kd = (m, ad) => M.kadraj(m, ad);
  const film = H.sahneler([
    { id: 'ac', set: 'A', t0: 0, cam: [[0, 1.0, 560, 1000], [1.6, 1.04, 575, 995]] },
    { id: 'yokus', set: 'B', t0: tm.kesB, cam: [[0, ...kd(YOKUS, 'genis')], [tm.w2e, 0.97, OX + 566, 955]] },
    { id: 'neden', set: 'A', t0: tm.neden, cam: [[0, ...kd(KAPI, 'hikmet')], [tm.d2 - 0.2, ...kd(KAPI, 'pano')], [tm.hd + 0.5, 1.24, 462, 1010]] },
    { id: 'sayac', set: 'A', t0: tm.sayac, cam: [[0, ...kd(KAPI, 'sayac')], [tm.cd0 + 2.6, 1.03, 640, 1000], [tm.clue - 0.3, 1.1, 720, 1005]] },
    { id: 'geri', set: 'B', geri: true, t0: tm.geri, kay: [-60, 0], cam: [[0, ...kd(YOKUS, 'geri')]] },
    { id: 'buldum', set: 'A', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...kd(KAPI, 'buldum')]] },
    { id: 'cevap', set: 'B', t0: tm.proof, cam: [[0, ...kd(YOKUS, 'genis')], [tm.bulus - 0.2, ...kd(YOKUS, 'bulus')]] },
    { id: 'espri', set: 'A', t0: tm.espri, cam: [[0, ...kd(KAPI, 'espri')], [tm.dakik, 0.99, 665, 1000]] },
    { id: 'cta', set: 'A', t0: tm.cta, kesme: false, cam: [[0, ...kd(KAPI, 'cta')], [tm.cta + 1.5, 1.44, 298, 922]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // saat (yokuş): ondalık saat; 24'ü aşınca "bugün"
  const saatKur = [[tm.kesB, 9], [tm.w1s, 10, tm.w1e - tm.w1s, lin], [tm.c0, 12.5, tm.w2s - tm.c0, lin], [tm.w2s, 17, tm.w2e - tm.w2s, lin],
    [tm.gece0, 33, tm.gece1 - tm.gece0, ease.state], [tm.w3s, 35, tm.w3e - tm.w3s, lin], [tm.w3e, 37, tm.w4s - tm.w3e, lin], [tm.w4s, 41, tm.w4e - tm.w4s, lin]];
  const saatCvp = [[tm.proof, 9], [tm.basla, 13 + 40 / 60, tm.bulus - tm.basla, lin]];

  // ——— Hikmet (A, önden) ———
  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.4] }, ...POZ.rahat });
  const hik = [
    [tm.kerem + 0.1, { head: { tilt: 5, look: [0.85, 0.1] } }, 0.3],
    [tm.nokta - 0.1, { head: { tilt: -5, look: [-0.75, 0.55] } }, 0.3],
    [tm.ikiGun + 0.3, { expr: 'mutlu', head: { tilt: -3, look: [-0.85, 0.1] } }, 0.3],
    [tm.neden, { expr: 'mutlu', ...POZ.rahat, head: { tilt: 6, look: [-0.6, 0.2] } }, 0.01],
    [tm.neden + 0.3, { head: { tilt: -4, look: [-0.7, 0.5] } }, 0.3],
    [tm.cAl, { head: { tilt: -3, look: [-0.85, 0.2] } }, 0.3],
    [tm.t1, { expr: 'notr', head: { tilt: -4, look: [-0.75, 0.45] } }, 0.3],
    [tm.hd - 0.1, { expr: 'kizgin', head: { tilt: -6, look: [-0.7, 0.55] } }, 0.25, ease.enter],
    [tm.kesin - 0.25, { expr: 'mutlu', head: { tilt: 4, look: [-0.85, 0.15] } }, 0.3],
    [tm.sayac, { expr: 'mutlu', ...POZ.belde, head: { tilt: 5, look: [-0.5, 0.3] } }, 0.01],
    [tm.cd0 + 1.6, { head: { tilt: 8, look: [-0.2, -0.3] } }, 0.4],
    [tm.cd0 + 3.2, { head: { tilt: 2, look: [0.9, 0.2] } }, 0.35],
    [tm.buldum - 0.05, { expr: 'saskin', head: { tilt: -3, look: [-0.85, 0.1] } }, 0.2],
    [tm.espri, { expr: 'kizgin', ...POZ.rahat, head: { tilt: 4, look: [0.85, 0.2] } }, 0.01],
    [tm.dakik - 0.3, { expr: 'kizgin', head: { tilt: -4, look: [-0.6, -0.7] } }, 0.25],
    [tm.silk, { expr: 'mutlu', head: { tilt: 5, look: [0.85, 0.2] } }, 0.3],
    [tm.cta, { head: { tilt: 5, look: [-0.8, 0.2] } }, 0.35],
  ];
  // ——— Defne (A, önden) ———
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 4, look: [0.85, 0.3] }, ...POZ.dur });
  const def = [
    [tm.kerem + 0.25, { head: { tilt: 3, look: [0.95, 0.05] } }, 0.3],
    [tm.nokta - 0.05, { head: { tilt: -3, look: [0.8, 0.45] } }, 0.3],
    [tm.ikiGun + 0.5, { expr: IFADE.dusun, head: { tilt: -6, look: [0.7, -0.2] } }, 0.3],
    [tm.neden, { expr: IFADE.dusun, ...POZ.belde, head: { tilt: -4, look: [0.8, 0.3] } }, 0.01],
    [tm.d2 - 0.3, { expr: 'mutlu', head: { tilt: 5, look: [0.8, 0.45] } }, 0.25, ease.enter],
    [tm.bagli - 0.1, { head: { tilt: 8, look: [0.9, 0.1] } }, 0.25],
    [tm.hd + 0.2, { expr: 'saskin', head: { tilt: -3, look: [0.8, 0.5] } }, 0.25],
    [tm.kesin, { expr: IFADE.dusun, head: { tilt: -6, look: [0.9, 0.05] } }, 0.3],
    [tm.sayac, { expr: IFADE.dusun, ...POZ.belde, head: { tilt: -5, look: [0.75, 0.45] } }, 0.01],
    [tm.cd0 + 3.1, { expr: IFADE.dusun2, head: { tilt: 6, look: [0.6, -0.3] } }, 0.35],
    [tm.cd - 1.0, { expr: 'notr', head: { tilt: 3, look: [0.95, 0.1] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0.2, -0.3] } }, 0.2, ease.enter],
    [tm.espri, { expr: 'mutlu', ...POZ.belde, head: { tilt: 5, look: [0.95, 0.15] } }, 0.01],
    [tm.cta - 0.05, { head: { tilt: 6, look: [0.05, 0.05] } }, 0.35],
  ];
  return { tm, film, hik, hikBase, def, defBase, saatKur, saatCvp };
}

// ═══════════════════════════ Durumlar ═══════════════════════════
// Raptiyeler: { hardal, petrol, kirmizi: u, kLift: kırmızının yerden yüksekliği }
function raptiyeAt(t, tm) {
  const hardal = H.iz([[0, 0], [tm.r1k + 0.04, 0.5, tm.t1 - tm.r1k - 0.04], [tm.cd0 + 0.75, 0.77, 0.6]], t);
  const petrol = H.iz([[0, 1], [tm.r2k + 0.04, 0.56, tm.t2 - tm.r2k - 0.04], [tm.hd + 0.3, 0.95, 0.3], [tm.hd + 0.62, 0.74, 0.32], [tm.hd + 0.96, 0.97, 0.3], [tm.hd + 1.28, 0.86, 0.24],
    [tm.cd0 + 2.15, 0.33, 0.7]], t);
  const kLift = 46 * (1 - ease.enter(seg(t, tm.tak - 0.1, 0.1)));
  return { hardal, petrol, kirmizi: 0.72, kLift };
}
// İşaret çubuğu: { h: el, q: uç, elde }
function cubukAt(t, tm, dp, rp) {
  if (t < tm.cAl) return { h: TEPSI[0], q: TEPSI[1], elde: false };
  const sh = H.shoulder('defne', dp, 'R');
  const notr = ekle(sh, [96, -150]);
  if (t >= tm.buldum - 0.05 && t < tm.proof) { const h = [dp.x + 175, dp.y - 600]; return { h, q: ekle(h, [36, -196]), elde: true, havada: true }; }
  // uç izi: d2'de hardala, sonra petrole; sayaçta yine
  const uc = izF([[0, notr], [tm.r1, () => basNok(0) , 0.26], [tm.r1k + 0.04, () => basNok(rp.hardal), 0.01], [tm.t1, () => basNok(rp.hardal), 0.01],
    [tm.r2, () => basNok(1), 0.24], [tm.r2k + 0.04, () => basNok(rp.petrol), 0.01], [tm.t2 + 0.1, notr, 0.36],
    [tm.cd0 + 0.42, () => basNok(0.5), 0.3], [tm.cd0 + 0.75, () => basNok(rp.hardal), 0.01], [tm.cd0 + 1.4, notr, 0.32],
    [tm.cd0 + 1.82, () => basNok(0.82), 0.3], [tm.cd0 + 2.15, () => basNok(rp.petrol), 0.01], [tm.cd0 + 2.9, () => basNok(0.5), 0.3], [tm.cd0 + 3.5, notr, 0.36]], t);
  const q = ekle(uc, [-4, -6]), h = elUcu(sh, q);
  const u = W(t, tm.cAl, 0.42);
  if (u < 1) return { h: kar(TEPSI[0], h, u), q: kar(TEPSI[1], q, u), elde: true };
  return { h, q, elde: true };
}
// Kurulumda ve cevapta yokuştaki Kerem'in çay durağı: el hedefi, ağırlık, bardak elde mi
function cayDuragi(t, c0, c1, key, p) {
  const ust = ekle(BARDAK, [0, -6]), gog = ekle(H.elYeri(key, p, 'R', 'gogus'), [0, -10]);
  const w = pw(t, c0 + 0.28, c1 - 0.05, 0.28, 0.25), el = izF([[0, ust], [c0 + 0.3, gog, 0.34], [c1 - 0.62, ust, 0.3]], t);
  return { w, el, elde: t >= c0 + 0.3 && t < c1 - 0.3 };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 6, h2b: 8, n1: 6, d4: 8 },
  kuyruksuz: (t, B) => !!B.sc.geri,
  dunya(K, t, B) { if (B.sc.set === 'B') yokusSahne(K, t, tl, S, B); else kapiSahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, { sc, ekr } = B;
    if (sc.id === 'neden') {   // yanlış deneme: iki raptiyenin çınardaki saatleri tutmaz
      const b = tm.hd + 0.15;
      H.tag(K, t, tm.t1 - 0.04, b, [530, 590], K.up('dün') + ' 11:00', HARDAL, INK, 46);
      const hw = H.tag(K, t, tm.t2 - 0.04, b, [530, 680], K.up('bugün') + ' 15:00', PETROL, PAL.paper, 46);
      H.mark(K, t, tm.bagli - 0.02, b, [530 - hw - 36, 680], false);
    }
    if (sc.set === 'B' && !sc.geri) {
      const cvp = sc.id === 'cevap', h = H.iz(cvp ? S.saatCvp : S.saatKur, t);
      saatPano(K, t, h, cvp ? null : h < 24 ? 'dün' : 'bugün', cvp ? [tm.bulus] : []);
    }
    if (sc.id === 'cevap') {   // aynı nokta, iki gün: iki etiket tek noktaya bağlı
      const p = ekr([OX + BULUS, yolB(OX + BULUS)]), a = tm.yerden - 0.04, b = tm.espri - 0.2;
      if (t >= a) { const { ctx } = K, v = ease.enter(seg(t, a, 0.3)) * (1 - ease.exit(seg(t, b, 0.2))); ctx.save(); ctx.setLineDash([14, 12]); ctx.globalAlpha = v; K.line(p[0], p[1] - 10, p[0], lerp(p[1] - 10, 660, v), 6, INK); ctx.restore(); }
      H.tag(K, t, a, b, [p[0], 545], K.up('dün') + ' 13:40', HARDAL, INK, 48, [tm.ayni]);
      H.tag(K, t, a + 0.08, b, [p[0], 635], K.up('bugün') + ' 13:40', PETROL, PAL.paper, 48, [tm.saatte]);
    }
    if (sc.geri) H.zamanHapi(K, t, tm.geri + 0.2, tm.geri + 2.1, K.up('geçen hafta'), { y: B.top + 74, saat: 18.5 });
    if (sc.id === 'sayac') H.saatRozet(K, t, tm.geri, { x: 300, y: 660, r: 80, saat: 9 + 40 / 60, tur: 1.5, yon: -1 });
  },
});

// Köşedeki saat (ekran): analog + dijital hap; gün: 'dün' | 'bugün' | null
function saatPano(K, t, saat, gun, vurgu = []) {
  const x = 196, y = 586, r = 64, h = ((saat % 24) + 24) % 24, hh = Math.floor(h + 1e-6), mm = Math.min(59, Math.floor((h - hh) * 60 + 1e-6));
  const { ctx } = K;
  K.circ(x + 7, y + 9, r + 8, INK, 0); K.circ(x, y, r + 8, PAL.woodDark, LW);
  M.duvarSaati(K, x, y, r, h, 0);
  const txt = (gun ? K.up(gun) + ' ' : '') + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  const fill = gun === 'dün' ? HARDAL : gun === 'bugün' ? PETROL : PAL.cream, col = gun === 'bugün' ? PAL.paper : INK;
  let k = 1; for (const a of vurgu) k += 0.16 * H.nabiz(t, a, 0.34);
  ctx.font = '900 50px Rubik'; const tw = ctx.measureText(txt).width, w = tw + 52, hy = y + r + 58, px = Math.max(x, 96 + w / 2);
  ctx.save(); ctx.translate(px, hy); ctx.scale(k, k);
  K.rect(-w / 2 + 6, -34 + 8, w, 68, INK, 0, 34); K.rect(-w / 2, -34, w, 68, fill, LW, 34); K.text(txt, 0, 18, 50, col, 900);
  ctx.restore();
}

// ——— Hayalet çizim: dünkü Kerem yarı saydam ve hardal tonlu (ayrı tuvalde çizilir, tek parça saydamlaşır) ———
let _hay = null;
function hayalet(K, fn, renk = HARDAL, a = 0.8, ton = 0.5) {
  const { ctx } = K, cv = ctx.canvas;
  if (!_hay || _hay.width !== cv.width || _hay.height !== cv.height) { _hay = document.createElement('canvas'); _hay.width = cv.width; _hay.height = cv.height; }
  const o = _hay.getContext('2d');
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1; o.clearRect(0, 0, cv.width, cv.height);
  o.save(); o.setTransform(ctx.getTransform()); fn(H.kit(o)); o.restore();
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-atop'; o.globalAlpha = ton; o.fillStyle = renk; o.fillRect(0, 0, cv.width, cv.height);
  o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(_hay, 0, 0); ctx.restore();
}

// ═══════════════════════════ Yokuş sahnesi ═══════════════════════════
const PLAN_KUR = tm => ({ x0: OX + KO, f0: 1, s: sB('genc'), poz: { expr: 'mutlu', head: { tilt: 3, look: [0.7, 0.2] } },
  olay: [['yuru', tm.w1s, tm.w1e, OX + CAY_X], ['yuru', tm.w2s, tm.w2e, OX + KD], ['don', tm.gece0 + 0.3, -1], ['yuru', tm.w3s, tm.w3e, OX + BANK_X], ['yuru', tm.w4s, tm.w4e, OX + KO]],
  otur: [[tm.w3e, tm.w4s]] });
const PLAN_DUN = tm => ({ x0: OX + KO, f0: 1, s: sB('genc'), poz: { expr: 'mutlu', head: { tilt: 3, look: [0.7, 0.2] } },
  olay: [['yuru', tm.basla, tm.u1e, OX + CAY_X], ['yuru', tm.u2s, tm.bulus, OX + BULUS_U]] });
const PLAN_BUGUN = tm => ({ x0: OX + KD, f0: -1, s: sB('genc'), poz: { expr: 'mutlu', head: { tilt: 3, look: [0.7, 0.2] } },
  olay: [['yuru', tm.basla, tm.d1e, OX + BANK_X], ['yuru', tm.d2s, tm.bulus, OX + BULUS_D]], otur: [[tm.d1e, tm.d2s]] });
let _oturY = null;
function bankYuksek() {   // oturan Kerem'in kalçasına göre bankın oturak yüksekliği (sabit)
  if (_oturY === null) { const p = ayakla('genc', H.otur('genc', { x: OX + BANK_X, facing: -1, s: sB('genc') }), yolB); _oturY = H.oturak('genc', p).y; }
  return _oturY;
}

function yokusSahne(K, t, tl, S, B) {
  const { tm } = S, sc = B.sc, geri = !!sc.geri, cvp = sc.id === 'cevap';
  const saat = geri ? 18.5 : H.iz(cvp ? S.saatCvp : S.saatKur, t), g = M.isikSaat(saat);
  const isik = geri ? M.ISIK.aksam : g.isik;
  M.mekanCiz(K, YOKUS, 'arka', t, { isik, durum: { gunes: geri ? 0.93 : g.gunes, ay: geri ? null : g.ay } });
  bank(K, OX + BANK_X, bankYuksek());
  let bardakElde = false;

  if (sc.id === 'yokus') {
    const r = yolcu('genc', t, PLAN_KUR(tm), yolB), p = r.p;
    if (r.yuruyor) p.head = { ...p.head, tilt: 3, look: [0.7, 0.2] };
    let cd = null;
    if (!r.yuruyor && Math.abs(r.x - (OX + CAY_X)) < 1 && t < tm.w2s) { cd = cayDuragi(t, tm.c0, tm.w2s, 'genc', p); H.reach('genc', p, 'R', cd.el, cd.w, 'A'); p.expr = cd.elde ? 'mutlu' : p.expr; }
    if (t >= tm.w3e && t < tm.w4s) p.expr = 'mutlu';
    if (!cd || !cd.elde) cay(K, BARDAK, 0.75);
    const o = oyna(K, t, null, 'genc', p, {});
    if (cd && cd.elde) { cay(K, ekle(o.handR, [0, -4]), 0.75); o.tut('R'); bardakElde = true; }
  } else if (cvp) {
    const ru = yolcu('genc', t, PLAN_DUN(tm), yolB), rd = yolcu('genc', t, PLAN_BUGUN(tm), yolB), pu = ru.p, pd = rd.p;
    const cd = !ru.yuruyor && t >= tm.u1e && t < tm.u2s ? cayDuragi(t, tm.u1e, tm.u2s, 'genc', pu) : null;
    if (cd) H.reach('genc', pu, 'R', cd.el, cd.w, 'A');
    if (t >= tm.bulus) {   // burun buruna: ikisi de irkilir, sonra birbirine güler
      const k = H.nabiz(t, tm.bulus + 0.02, 0.4);
      for (const p of [pu, pd]) { p.lean = (p.lean || 0) - 7 * k; p.expr = t < tm.bulus + 0.45 ? 'saskin' : 'mutlu'; p.head = { ...p.head, tilt: 2, look: [0.9, 0.1] }; }
    }
    if (!cd || !cd.elde) cay(K, BARDAK, 0.75);
    const od = oyna(K, t, null, 'genc', pd, {});
    hayalet(K, K2 => { const o = oyna(K2, t, null, 'genc', pu, {}); if (cd && cd.elde) { cay(K2, ekle(o.handR, [0, -4]), 0.75); o.tut('R'); } });
    void od;
    if (t >= tm.d5 - 0.04) H.ring(K, [OX + BULUS, yolB(OX + BULUS)], t, tm.d5 - 0.04, INK);
  } else if (geri) {
    const np = t < tm.buruna ? yuruY('necmi', t, { t0: tm.geri, t1: tm.buruna, x0: OX + 880, x1: OX + 655, s: sB('necmi') }, yolB) : ayakla('necmi', kisi('necmi', { view: 'side', facing: -1, x: OX + 655, s: sB('necmi') }), yolB);
    const bp = t < tm.buruna ? yuruY('b032_bekci', t, { t0: tm.geri, t1: tm.buruna, x0: OX + 250, x1: OX + 532, s: sB('hikmet') }, yolB) : ayakla('b032_bekci', kisi('b032_bekci', { view: 'side', facing: 1, x: OX + 532, s: sB('hikmet') }), yolB);
    const k = H.nabiz(t, tm.buruna + 0.02, 0.42);
    np.expr = t < tm.buruna ? 'mutlu' : t < tm.buruna + 0.55 ? 'saskin' : 'mutlu'; np.head = { ...np.head, tilt: t < tm.buruna ? 6 : 0, look: [0.9, t < tm.buruna ? 0.5 : 0] }; np.lean = (np.lean || 0) - 9 * k;
    bp.expr = t < tm.buruna ? 'notr' : t < tm.buruna + 0.55 ? 'saskin' : 'mutlu'; bp.head = { ...bp.head, tilt: 0, look: [0.9, 0] }; bp.lean = (bp.lean || 0) - 9 * k;
    cay(K, BARDAK, 0.75);
    oyna(K, t, null, 'b032_bekci', bp, {}); kasket(K, bp);
    oyna(K, t, null, 'necmi', np, { sessiz: true });
  }
  if (!geri && isik.k > 0.01) H.karart(K, isik.k);
  void bardakElde; void tl;
}

// ═══════════════════════════ Ofis kapısı sahnesi ═══════════════════════════
function kapiSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, KAPI, 'arka', t);
  const rp = raptiyeAt(t, tm);
  // raptiyeler maketin üstünde (karakterlerden önce: tutan el üstte kalır)
  raptiye(K, yolNok(rp.kirmizi), PAL.red, rp.kLift);
  raptiye(K, yolNok(rp.hardal), HARDAL);
  raptiye(K, yolNok(rp.petrol), PETROL);

  // ——— Defne ———
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t);
  H.glance(dp, t, tm.cd);
  dp.y -= H.buldumHop(t, tm.buldum);
  const cb = cubukAt(t, tm, dp, rp);
  if (cb.elde) H.reach('defne', dp, 'R', cb.h, t < tm.cAl + 0.01 ? 1 : 1, cb.havada ? 'B' : 'A');
  else { const wA = W(t, tm.cAl - 0.3, 0.28); if (wA > 0) H.reach('defne', dp, 'R', TEPSI[0], wA, 'A'); }
  if (id === 'cta') H.reach('defne', dp, 'L', [dp.x - 150, dp.y - 640], W(t, tm.cta, 0.3), 'B');

  // ——— Hikmet ———
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), hik = {};
  {
    // kare 0: kırmızı raptiyeyi maketin üstünde tutar, 0,32'de bastırır · "noktasından"da yine dokunur
    const kb = basNok(rp.kirmizi, rp.kLift);
    const w0 = t < tm.kesB ? 1 - W(t, tm.nokta + 0.55, 0.3) : 0;
    const el0 = izF([[0, ekle(kb, [0, -4])], [tm.tak + 0.2, ekle(basNok(rp.kirmizi), [26, -40]), 0.3], [tm.nokta - 0.22, ekle(basNok(rp.kirmizi), [4, -6]), 0.22]], t);
    H.reach('hikmet', hp, 'L', el0, w0, 'A');
    // "Kerem": sağ el Kerem'e doğru kalkar, parmak gösterir
    const wK = t < tm.kesB ? pw(t, tm.kerem + 0.12, tm.nokta + 0.2, 0.28, 0.3) : 0;
    H.reach('hikmet', hp, 'R', [hp.x + 118, 1085], wK, 'A');
    // "Neden eminim?": kırmızıya dokunur
    const wN = id === 'neden' ? pw(t, tm.neden + 0.12, tm.cAl + 0.3, 0.26, 0.3) : 0;
    H.reach('hikmet', hp, 'L', ekle(basNok(rp.kirmizi), [4, -6]), wN, 'A');
    // hd: petrol raptiyeyi aşağı yukarı sürer · "kesin"de kırmızıya dokunur
    const wP = id === 'neden' ? pw(t, tm.hd + 0.02, tm.kesin - 0.22, 0.26, 0.2) : 0;
    H.reach('hikmet', hp, 'L', ekle(basNok(rp.petrol), [4, -6]), wP, 'A');
    const wT = id === 'neden' ? pw(t, tm.kesin - 0.2, tm.kesin + 0.6, 0.22, 0.3) : 0;
    H.reach('hikmet', hp, 'L', ekle(basNok(rp.kirmizi), [14, -16]), wT, 'A');
    // espri: duvar saatini gösterir
    const wS = id === 'espri' || id === 'cta' ? pw(t, tm.dakik - 0.3, tm.cta + 0.2, 0.3, 0.35) : 0;
    H.reach('hikmet', hp, 'L', [SAAT_A[0] + 70, SAAT_A[1] + 150], wS, 'B');
    Object.assign(hik, { w0, wK, wN, wP, wT, wS });
  }

  // ——— Kerem (kare 0 ve espri) ———
  let kp = null, kerCay = false;
  if (id === 'ac') {
    kp = kisi('genc', { x: KER_X, expr: 'mutlu', head: { tilt: -3, look: [-0.75, 0.35] }, ...POZ.dur }); kp.y = yolA(KER_X) + 6;
    if (t > tm.kerem + 0.2) kp.head = { ...kp.head, tilt: 4, look: [-0.8, 0.1] };
    H.onayla(kp, t, tm.ikiGun + 0.05, 2);
    H.reach('genc', kp, 'R', ekle(H.elYeri('genc', kp, 'R', 'gogus'), [-6, 0]), 1, 'A');
    kerCay = true;
  }
  if (id === 'espri' || id === 'cta') {
    if (t < tm.kw1) { kp = yuruY('genc', t, { t0: tm.kw0, t1: tm.kw1, x0: 1280, x1: KER_X - 10, s: H.BOY.genc }, yolA); kp.expr = 'mutlu'; kp.head = { ...kp.head, tilt: 3, look: [0.6, 0.3] }; H.reach('genc', kp, 'R', ekle(H.elYeri('genc', kp, 'R', 'gogus'), [0, -10]), 1, 'A'); }
    else {
      kp = kisi('genc', { x: KER_X - 10, expr: 'mutlu', head: { tilt: 3, look: [-0.8, 0.2] }, ...POZ.dur }); kp.y = yolA(KER_X - 10) + 6;
      if (t >= tm.dakik) kp.head = { ...kp.head, tilt: -4, look: [-0.9, -0.4] };
      H.omuzSilk(kp, t, tm.silk, 0.55); if (t >= tm.silk) kp.expr = 'saskin';
      H.reach('genc', kp, 'R', ekle(H.elYeri('genc', kp, 'R', 'gogus'), [-6, 0]), 1, 'A');
    }
    kerCay = true;
  }
  // ——— Necmi (sayaçta yokuştan iner, n1'de anlatmaya başlar) ———
  let np = null;
  if (id === 'sayac') {
    const n0 = tm.cd - 1.75, n1 = tm.cd - 0.3;
    if (t < n1) { np = yuruY('necmi', t, { t0: n0, t1: n1, x0: 1300, x1: NEC_X, s: H.BOY.necmi }, yolA); np.expr = 'mutlu'; np.head = { ...np.head, tilt: 4, look: [0.8, 0.2] }; }
    else {
      np = kisi('necmi', { x: NEC_X, expr: 'mutlu', head: { tilt: -4, look: [-0.8, 0.25] }, ...POZ.rahat }); np.y = yolA(NEC_X) + 6;
      const wY = W(t, tm.clue - 0.05, 0.3);
      if (wY > 0) H.reach('necmi', np, 'R', [np.x + 200, np.y - 760], wY, 'B');
    }
  }

  // ——— çizim: karakterler ———
  const nO = np ? oyna(K, t, tl, 'necmi', np, { heads }) : null;
  let kO = null; if (kp) kO = oyna(K, t, null, 'genc', kp, {});
  const hO = oyna(K, t, tl, 'hikmet', hp, { heads });
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const dO = oyna(K, t, tl, 'defne', dp, { heads });

  // ——— nesneler ve tutan eller ———
  cubuk(K, cb.elde ? dO.handR : cb.h, cb.q);
  if (cb.elde) dO.tut('R');
  if (kO && kerCay) { cay(K, ekle(kO.handR, [0, -6]), 1); tabak(K, ekle(kO.handR, [0, 22])); kO.tut('R'); H.buhar(K, kO.handR[0], kO.handR[1] - 48, t, { k: 0.6, n: 2, ara: 26 }); }
  if (hik.wK > 0.6) hO.isaret('R', [KER_X - 30, 900]);
  if (hik.wT > 0.6) hO.isaret('L', basNok(rp.kirmizi));
  if (hik.wS > 0.6) hO.isaret('L', SAAT_A);
  if (id === 'cta') dO.parmak('L', 1, { boy: 1.15 });
  if (nO && t >= tm.clue + 0.15) nO.isaret('R', [np.x + 330, np.y - 1100]);
}
