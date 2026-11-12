// Bölüm 38 · KÂĞIT TOP (v4 "hikâye" dili; storyboard: hikayeler/bolum_038_v5.md). Kanalın özgün sorusu (Simpson paradoksu).
// Logline: Defne ile Necmi iki gün çöp kutusuna kâğıt top atar. Pazartesi de Salı da Defne daha isabetlidir, ikisi de on
// atış yapmıştır, ama toplamda Necmi önde. Defne topları günlere ayırınca görür: kendi sekiz atışı kutunun uzak olduğu
// güne, Necmi'nin sekiz atışı yakın güne düşmüştür.
// Akılda kalacak tek şey: iki günde de daha iyi olup toplamda kaybedebilirsin; kimin hangi gün kaç atış yaptığı her şeyi değiştirir.
// Sayılar (değişmez): Pzt (kutu kapıda, uzak) Defne 2/8, Necmi 0/2 · Salı (kutu masaların dibinde) Defne 2/2, Necmi 6/8.
// İki set aynı dünyada: ofis (önden; Defne'nin masası solda, Hikmet ortada, Necmi'nin masası sağda, kapı en sağda) ·
// plan (x 3000; odanın kuşbakışı, kahraman an: toplar iki kutunun önüne günlere göre dizilir).
// Defne'nin kâğıtları sarı, Necmi'ninkiler mavi; isabet eden topun üstünde yeşil işaret var.
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur; rastgelelik yok (sabit listeler).
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b038_ofis', PLAN = 'b038_plan', BX = 3000;
const ZEMIN = 1500, MASA_Y = 1300, R = 22;
const DEF_X = 150, HIK_X = 410, NEC_X = 670;
const MASA_D = [40, 330], MASA_N = [490, 780];
const K_KAPI = 970, K_MASA = 410, K_NECMI = 850, K_H = 220;     // kutunun yerleri (alt orta x) ve boyu
const KAPI = [1040, 1260], KAPI_UST = 860, SAAT = [905, 800];
const YIG_D = 255, YIG_N = 565;                                  // masadaki yığınların ortası
const SARI = '#F3D46E', MAVI = '#BDD8E6', YESIL = PAL.green, MERCAN = PAL.coral;
const DEF_IS = [0, 3, 5, 8], NEC_IS = [1, 2, 4, 6, 7, 9];        // yığında isabetli (yeşil işaretli) toplar
const SAY_D = [0, 5, 8, 3], SAY_N = [4, 1, 7, 9, 2, 6];          // Hikmet'in sayma sırası (soldan sağa)
const YIGIN = (() => { const a = []; [4, 3, 2, 1].forEach((n, r) => { for (let i = 0; i < n; i++) a.push([(i - (n - 1) / 2) * 42, -R - r * 35]); }); return a; })();
const yigP = (cx, i) => [cx + YIGIN[i][0], MASA_Y + YIGIN[i][1]];
// plan (kuşbakışı; ekran = dünya − BX, zoom 1)
const PR = 30, A_UST = [BX + 215, 615], B_UST = [BX + 540, 1048];
const SIRA = { dUzak: 580, nUzak: 652, dYakin: 880, nYakin: 952 }, SX = i => BX + 318 + i * 66;
const PY_D = [BX + 330, 1172], PY_N = [BX + 750, 1172];         // plandaki yığınlar (masaların üstünde)
// kahraman anın dizilişi: Defne 0–7 uzak (2 ve 5 isabet), 8–9 yakın (ikisi de isabet) · Necmi 0–1 uzak (isabet yok), 2–9 yakın (4 ve 7 kaçtı)
const DIZ_D = Array.from({ length: 10 }, (_, i) => i < 8 ? { p: [SX(i), SIRA.dUzak], is: i === 2 || i === 5 } : { p: [SX(i - 8), SIRA.dYakin], is: true });
const DIZ_N = Array.from({ length: 10 }, (_, i) => i < 2 ? { p: [SX(i), SIRA.nUzak], is: false } : { p: [SX(i - 2), SIRA.nYakin], is: i !== 4 && i !== 7 });
// mantık denetimi (build anında): her gün Defne önde, toplamda Necmi
{ const o = (a, n) => a / n; if (!(o(2, 8) > o(0, 2) && o(2, 2) > o(6, 8) && 2 + 2 < 0 + 6 && DIZ_D.filter(d => d.is).length === 4 && DIZ_N.filter(d => d.is).length === 6)) console.warn('b038: sayılar tutmuyor'); }

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
// Sıralı yol: duraklar [[t, [x, y]], …]; iki durak arasında ease.state ile gider (ilk duraktan önce ilk, sondan sonra son)
function yol(t, d) {
  if (t <= d[0][0]) return d[0][1];
  for (let i = 1; i < d.length; i++) if (t < d[i][0]) { const u = ease.state((t - d[i - 1][0]) / (d[i][0] - d[i - 1][0])); return [lerp(d[i - 1][1][0], d[i][1][0], u), lerp(d[i - 1][1][1], d[i][1][1], u)]; }
  return d[d.length - 1][1];
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Buruşuk kâğıt top: renk sahibini, yeşil işaret isabeti gösterir. i: buruşukluk deseni (sabit)
function top(K, [x, y], r, renk, { isabet = false, kab = 0, i = 0 } = {}) {
  const { ctx } = K, s = r * (1 + 0.28 * kab);
  ctx.save(); ctx.translate(x, y); ctx.rotate(i * 1.7);
  ctx.beginPath();
  for (let k = 0; k <= 12; k++) { const a = k / 12 * TAU, rr = s * (1 + 0.075 * Math.sin(a * 3 + i * 1.3) + 0.04 * Math.cos(a * 5 + i)); k ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(rr, 0); }
  ctx.closePath(); K.fs(renk, Math.max(3, LW * s / 24));
  ctx.lineCap = 'round'; ctx.lineWidth = Math.max(2, s * 0.09); ctx.strokeStyle = 'rgba(31,36,33,0.42)';
  ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.15); ctx.lineTo(-s * 0.1, s * 0.05); ctx.lineTo(s * 0.2, -s * 0.4);
  ctx.moveTo(s * 0.05, s * 0.55); ctx.lineTo(s * 0.25, s * 0.15); ctx.lineTo(s * 0.6, s * 0.2); ctx.stroke();
  ctx.restore();
  if (isabet) {   // yeşil işaret: topun üstünde kalın ✓ (telefonda da seçilsin)
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    ctx.moveTo(x - s * 0.52, y - s * 0.02); ctx.lineTo(x - s * 0.12, y + s * 0.42); ctx.lineTo(x + s * 0.62, y - s * 0.5);
    ctx.lineWidth = s * 0.58; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = s * 0.32; ctx.strokeStyle = YESIL; ctx.stroke(); ctx.restore();
  }
}
// Masadaki yığın (önden): 10 top, piramit; gizli: çizilmeyen top dizinleri; kab(i): nabız
function yigin(K, cx, renk, isabetler, { gizli = [], kab = () => 0 } = {}) {
  for (let i = 0; i < 10; i++) if (!gizli.includes(i)) top(K, yigP(cx, i), R, renk, { isabet: isabetler.includes(i), kab: kab(i), i: i + (renk === SARI ? 0 : 10) });
}
// Çöp kutusu (önden): arka (ağız içi) ve ön (gövde) ayrı çizilir; arada düşen top gövdenin arkasında kalır
const KW1 = 64, KW0 = 52;
function kutuArka(K, x, yb) { K.ell(x, yb - K_H, KW1, 14, '#2E3B38', LW * 0.8); }
function kutuOn(K, x, yb) {
  const y0 = yb - K_H, { ctx } = K;
  ctx.save(); ctx.globalAlpha = 0.22; K.ell(x, yb + 4, KW0 + 14, 9, INK, 0); ctx.restore();
  K.poly([[x - KW1, y0], [x + KW1, y0], [x + KW0, yb], [x - KW0, yb]], '#4F7A73', LW);
  for (const f of [-0.5, 0, 0.5]) K.line(x + f * KW1, y0 + 24, x + f * KW0, yb - 14, 4, '#3D615B');
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y0, KW1, 14, 0, 0, Math.PI); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#7FA59D'; ctx.stroke(); ctx.restore();
}
// İsabet halkası: kutunun ağzında yeşil, genişleyen elips
function isabetHalka(K, x, yb, t, t0) {
  if (t < t0 || t > t0 + 0.45) return;
  const { ctx } = K, u = seg(t, t0, 0.45);
  ctx.save(); ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.ellipse(x, yb - K_H, KW1 + 10 + 50 * ease.enter(u), 16 + 14 * ease.enter(u), 0, 0, TAU); ctx.lineWidth = 9; ctx.strokeStyle = YESIL; ctx.stroke(); ctx.restore();
}
// Masa (önden): tabla MASA_Y'de, ön panel yere kadar (karakterin bacaklarını örter)
function masa(K, x0, x1) {
  K.rect(x0 + 14, MASA_Y + 26, x1 - x0 - 28, ZEMIN - MASA_Y - 26, PAL.wood, LW);
  K.rect(x0 + 36, MASA_Y + 56, (x1 - x0) * 0.42, 86, PAL.woodTop, LW * 0.8, 6);
  K.line(x0 + 36 + (x1 - x0) * 0.21 - 26, MASA_Y + 99, x0 + 36 + (x1 - x0) * 0.21 + 26, MASA_Y + 99, 8);
  K.rect(x0, MASA_Y, x1 - x0, 30, PAL.woodTop, LW, 8);
}
function kalemlik(K, x) { for (const [dx, c, h] of [[-8, PAL.red, 64], [4, PAL.teal, 72], [12, PAL.mustard, 58]]) K.line(x + dx, MASA_Y - 30, x + dx * 1.6, MASA_Y - 30 - h, 7, c); K.rect(x - 22, MASA_Y - 52, 44, 52, '#CFE3DD', LW * 0.7, 6); }
function cay(K, x, t) {
  K.ell(x, MASA_Y - 2, 26, 7, PAL.cream, LW * 0.5);
  K.poly([[x - 15, MASA_Y - 56], [x + 15, MASA_Y - 56], [x + 9, MASA_Y - 32], [x + 16, MASA_Y - 10], [x + 11, MASA_Y - 2], [x - 11, MASA_Y - 2], [x - 16, MASA_Y - 10], [x - 9, MASA_Y - 32]], '#B5532A', LW * 0.6);
  H.buhar(K, x, MASA_Y - 66, t, { k: 0.6, n: 2, ara: 20 });
}
// Kâğıt destesi (geri dönüşte masada; toplar buradan buruşturulur)
function deste(K, x, renk) { for (let i = 0; i < 4; i++) K.rect(x - 46 + i * 2, MASA_Y - 10 - i * 7, 92, 10, i === 3 ? renk : PAL.cream, LW * 0.5, 2); }
// Kapı (önden, sağ duvarda; menteşe sağda): kapali 0 açık (koridor görünür) → 1 kapalı. icinde: koridora konan kutu
function kapiCiz(K, kapali, icinde) {
  const [x0, x1] = KAPI, w = x1 - x0, h = ZEMIN - KAPI_UST;
  K.rect(x0 - 18, KAPI_UST - 18, w + 36, h + 18, PAL.trim, LW);
  K.rect(x0, KAPI_UST, w, h, '#24494C', LW);
  K.rect(x0, ZEMIN - 70, w, 70, '#1E3D40', 0);
  if (icinde) { kutuArka(K, icinde[0], icinde[1]); kutuOn(K, icinde[0], icinde[1]); }
  const lw = w * lerp(0.13, 1, ease.state(clamp01(kapali))), xf = x1 - lw;
  K.poly([[x1, KAPI_UST], [xf, KAPI_UST + 10 * (1 - kapali)], [xf, ZEMIN - 4], [x1, ZEMIN]], '#8C6A44', LW);
  if (lw > 60) K.rect(xf + lw * 0.18, KAPI_UST + 60, lw * 0.64, h * 0.34, '#A27E55', LW * 0.6, 6);
  const kol = [xf + Math.min(40, lw * 0.3), KAPI_UST + h * 0.55];
  K.circ(kol[0], kol[1], 15, PAL.mustard, LW * 0.8);
  return kol;
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-600, 1900], dongu: ['pencerede martı', 'duvar saatinin saniye kolu', 'Necmi\'nin çayında buhar'],
  capa: { yiginD: [YIG_D, MASA_Y], yiginN: [YIG_N, MASA_Y], kutuKapi: [K_KAPI, ZEMIN] },
  kadraj: { kanca: [1.08, 410, 1112], genis: [0.94, 625, 1032], necmi: [1.42, 795, 1190], defne: [1.35, 168, 1010] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -700, x1: 2000, isik });
    M.pencere(K, -30, 560, 330, 360, { isik, t: t + 3 });
    M.duvarSaati(K, SAAT[0], SAAT[1], 50, durum.saat, t);
    // pano (yazısız kâğıtlar) ve köşede saksı
    K.rect(500, 600, 260, 170, '#C9A46A', LW, 8);
    for (const [x, y, c, r] of [[530, 625, PAL.cream, -0.05], [615, 640, '#CFE3DD', 0.06], [680, 622, '#F3D46E', -0.08], [550, 700, '#F3D46E', 0.05], [640, 705, PAL.cream, -0.04]]) { const { ctx } = K; ctx.save(); ctx.translate(x + 30, y + 22); ctx.rotate(r); K.rect(-30, -22, 60, 46, c, LW * 0.5, 2); ctx.restore(); }
    for (let i = 0; i < 5; i++) H.yaprak(K, -110, 1350, 190 + (i % 2) * 50, -0.85 + i * 0.42 + 0.04 * Math.sin(t * 1.1 + i), i % 2 ? PAL.green : '#4C8240', 1);
    K.poly([[-158, 1350], [-62, 1350], [-74, 1460], [-146, 1460]], PAL.mustard, LW);
  },
});
// Plan: odanın kuşbakışı. Üst kenarda duvar ve kapı, altta iki masa (sandalyeler), kutular. Döngüler: masada vantilatör, çay buharı.
function masaUst(K, x0, x1, y0, y1) {
  const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.25; K.rect(x0 + 14, y0 + 18, x1 - x0, y1 - y0, INK, 0, 10); ctx.restore();
  K.rect(x0, y0, x1 - x0, y1 - y0, PAL.woodTop, LW, 10); K.rect(x0 + 16, y0 + 16, x1 - x0 - 32, y1 - y0 - 32, '#CF9A60', LW * 0.5, 6);
}
function sandalyeUst(K, x, y) { K.rect(x - 70, y - 50, 140, 100, '#3E6E6F', LW, 18); K.rect(x - 80, y + 40, 160, 30, '#2E5B5E', LW, 12); }
function kutuUst(K, [x, y], r = 52) {
  const { ctx } = K; ctx.save(); ctx.globalAlpha = 0.25; K.circ(x + 10, y + 14, r, INK, 0); ctx.restore();
  K.circ(x, y, r, '#4F7A73', LW); K.circ(x, y, r * 0.76, '#2E3B38', LW * 0.7);
}
M.mekanEkle(PLAN, {
  gen: [BX, BX + 1080], dongu: ['vantilatör pervanesi', 'çay buharı'],
  capa: { uzak: A_UST, yakin: B_UST }, kadraj: { plan: [1.0, BX + 540, 960] },
  arka(K, t) {
    const { ctx } = K;
    ctx.fillStyle = '#8E9C8E'; ctx.fillRect(BX - 900, -400, 2900, 2800);
    for (let i = -6; i < 30; i++) { K.line(BX - 900, i * 120, BX + 2000, i * 120, 3, '#829082'); K.line(BX - 900 + i * 120 + 600, -400, BX - 900 + i * 120 + 600, 2400, 3, '#829082'); }
    // duvar ve kapı (sol üst): kanat açık, menteşe solda
    K.rect(BX - 900, 300, 2900, 170, PAL.wallDark, LW); K.rect(BX - 900, 440, 2900, 30, PAL.trim, LW * 0.6);
    K.rect(BX + 110, 300, 220, 175, '#8E9C8E', 0);
    K.line(BX + 110, 300, BX + 110, 470, LW); K.line(BX + 330, 300, BX + 330, 470, LW);
    ctx.save(); ctx.beginPath(); ctx.arc(BX + 110, 470, 210, 0, Math.PI / 2); ctx.setLineDash([12, 12]); ctx.lineWidth = 4; ctx.strokeStyle = '#6E7C6E'; ctx.stroke(); ctx.restore();
    K.rect(BX + 96, 470, 26, 210, '#8C6A44', LW, 4);
    // masalar, sandalyeler
    sandalyeUst(K, BX + 280, 1380); sandalyeUst(K, BX + 800, 1380);
    masaUst(K, BX + 110, BX + 450, 1090, 1330); masaUst(K, BX + 630, BX + 970, 1090, 1330);
    // Defne'nin masasında çay (buhar), Necmi'ninkinde vantilatör
    K.circ(BX + 170, 1150, 30, PAL.cream, LW * 0.6); K.circ(BX + 170, 1150, 20, '#B5532A', LW * 0.5); K.circ(BX + 170, 1150, 11, '#7E3518', 0);
    H.buhar(K, BX + 170, 1124, t, { k: 0.6, n: 2, ara: 22 });
    const [fx, fy] = [BX + 905, 1160]; K.circ(fx, fy, 50, '#CFE3DD', LW * 0.7);
    for (let k = 0; k < 3; k++) { const a = t * 9 + k * TAU / 3; ctx.save(); ctx.translate(fx, fy); ctx.rotate(a); K.ell(0, -24, 13, 24, PAL.metal, LW * 0.5); ctx.restore(); }
    K.circ(fx, fy, 9, PAL.metalDark, LW * 0.5);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    dus: 0.3, iki: T('h1:1'), ama: T('h1:6'), toplam: T('h1:7'), kaybetti: T('h1:8'),
    pzt: T('h2a') - 0.05, salı: T('h2a:4'), simdi: T('h2b:5') - 0.1,
    alti: T('h2b:6'), dort: T('h2b:8'), nasil: T('h2b:10'),
    d2: T('d2'), hd: T('hd'), it: T('hd') - 0.14,
    sayac: cd0 + 0.87, ipucu: cd - 0.05,
    n1: T('n1'), topla: T('n1:1'), kutu: T('n1:3'), at: T('n1:6') - 0.03,
    plan: T('d3:1') + 0.1, ucD: T('d3:2') - 0.06, ucN: T('d3:3') - 0.04,
    espri: T('h4') - 0.16, cta: T('d6') - 0.14,
  };
  // ——— geri dönüş: Pazartesi (kutu kapıda) → zaman atlaması → Salı (kutu masaların dibinde) ———
  tm.hapP = tm.pzt + 0.2; tm.atla = tm.salı - 0.16; tm.hapS = tm.salı + 0.02;
  const shD = H.shoulder('defne', kisi('defne', { x: DEF_X }), 'R'), shNR = H.shoulder('necmi', kisi('necmi', { x: NEC_X }), 'R'), shNL = H.shoulder('necmi', kisi('necmi', { x: NEC_X }), 'L');
  const REL = { defne: [shD[0] + 150, shD[1] - 70], necmiR: [shNR[0] + 150, shNR[1] - 60], necmiL: [shNL[0] - 150, shNL[1] - 60] };
  const atislar = [];
  const ekle = (kim, kol, tr, hedefX, isabet, inisX, sure, lift) => atislar.push({ kim, kol, tr, from: REL[kim === 'defne' ? 'defne' : kol === 'R' ? 'necmiR' : 'necmiL'], kx: hedefX, isabet, inis: [inisX, ZEMIN - R], sure, lift });
  const dMis = [1055, 885, 1105, 1160, 835, 1210];
  for (let i = 0, m = 0; i < 8; i++) { const is = i === 2 || i === 6; ekle('defne', 'R', tm.pzt + 0.2 + i * 0.21, K_KAPI, is, is ? 0 : dMis[m++], 0.6, 390); }
  ekle('necmi', 'R', tm.pzt + 0.52, K_KAPI, false, 790, 0.45, 190); ekle('necmi', 'R', tm.pzt + 1.24, K_KAPI, false, 740, 0.45, 190);
  const t2 = tm.atla + 1.25, nMis = [505, 318];
  for (let i = 0, m = 0; i < 8; i++) { const is = i !== 2 && i !== 5; ekle('necmi', 'L', t2 + 0.05 + i * 0.21, K_MASA, is, is ? 0 : nMis[m++], 0.38, 150); }
  ekle('defne', 'R', t2 + 0.3, K_MASA, true, 0, 0.4, 150); ekle('defne', 'R', t2 + 1.0, K_MASA, true, 0, 0.4, 150);
  tm.atislar = atislar;
  // ——— şimdi: yığınlar; Hikmet sayar (sol el Defne'nin 4 yeşilini, sağ el Necmi'nin 6 yeşilini) ———
  tm.sayD = [T('hd') + 0.46, T('hd:1') + 0.28, T('hd:2') + 0.02, T('hd:3')];
  tm.sayN = [0, 1, 2, 3, 4, 5].map(k => T('hd:5') + 0.1 + k * (T('hd:7') - T('hd:5') - 0.1) / 5);
  tm.sayBit = cd0 + 0.6;
  // ——— sayaç: Defne kapıdaki kutuya atar (kaçar); Necmi kutuyu getirip masasının dibine koyar ———
  tm.dAt = tm.sayac + 0.62; tm.dIn = tm.dAt + 0.62;
  tm.nYur = tm.sayac + 1.05; tm.nVar = tm.nYur + 0.75; tm.nTut = tm.nVar - 0.12; tm.nKal = tm.nVar + 0.18; tm.nGeri = tm.nKal + 0.36;
  tm.nGelis = tm.nGeri + 0.62; tm.nKoy = tm.nGelis + 0.05; tm.nBirak = tm.nKoy + 0.32; tm.nDon = tm.nBirak + 0.22;
  tm.bak = cd - 0.8;
  // ——— cevap (plan): toplar uçar, Defne sayar, etiketler ———
  tm.cvD = DIZ_D.map((_, i) => tm.ucD + i * 0.05); tm.cvN = DIZ_N.map((_, i) => tm.ucN + i * 0.05);
  tm.cU = [0, 1, 2, 3, 4, 5, 6, 7].map(i => T('d4') + 0.08 + i * (T('d4:5') + 0.1 - T('d4') - 0.08) / 7);
  tm.cY = [0, 1, 2, 3, 4, 5, 6, 7].map(i => T('d4:6') + 0.06 + i * (T('d4:10') + 0.2 - T('d4:6') - 0.06) / 7);
  tm.sayiSon = T('d5') - 0.2;
  tm.etP = T('d5') - 0.04; tm.etS = T('d5:1') - 0.04; tm.iyi = T('d5:4'); tm.toplamda = T('d5:6') - 0.04; tm.zor = T('d5:7'); tm.agir = T('d5:9') - 0.02;
  // ——— espri: Hikmet kutuyu kapının dışına taşır ———
  tm.hUz = tm.espri + 0.05; tm.hKal = tm.hUz + 0.3; tm.hYur = tm.hKal + 0.38; tm.hVar = tm.hYur + 1.0;
  tm.hInd = tm.hVar + 0.02; tm.hBir = tm.hInd + 0.4; tm.kapa = tm.hBir + 0.12; tm.kapandi = tm.kapa + 0.5; tm.hDon = tm.kapandi + 0.1;

  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, ...M.kadraj(ODA, 'kanca')], [1.9, 1.1, 402, 1108], [3.4, 1.09, 398, 1108]] },
    { id: 'pzt', t0: tm.pzt, geri: true, kay: [-40, 0], cam: [[0, 0.94, 625, 1100], [tm.atla + 0.6, 0.95, 625, 1098]] },
    { id: 'simdi', t0: tm.simdi, cam: [[0, 1.13, 396, 1104], [tm.nasil, 1.15, 412, 1104], [tm.d2 + 0.3, 1.17, 428, 1104], [tm.it, 1.3, 410, 1150], [T('hd:5'), 1.32, 413, 1150]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 0.96, 560, 1032], [tm.nYur, 0.97, 572, 1032], [tm.nGelis, 0.98, 582, 1030]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, ...M.kadraj(ODA, 'necmi')], [tm.kutu, 1.45, 812, 1186]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...M.kadraj(ODA, 'defne')]] },
    { id: 'cevap', t0: tm.plan, cam: [[0, ...M.kadraj(PLAN, 'plan')], [T('d4'), 1.02, BX + 540, 945], [T('d4:6'), 1.03, BX + 540, 930]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.0, 870, 1255], [tm.hVar - 0.3, 1.03, 905, 1250]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.38, 196, 1004], [tm.cta + 1.4, 1.43, 194, 1000]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -3, look: [-0.6, 0.35] }, ...POZ.dur });
  const hik = [
    [0.5, { head: { tilt: -5, look: [-0.8, 0.1] } }, 0.35],
    [tm.ama, { head: { tilt: 4, look: [0.7, 0.25] } }, 0.3],
    [tm.kaybetti, { expr: 'mutlu', head: { tilt: -4, look: [-0.85, 0.1] } }, 0.3],
    [tm.simdi, { expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.3] } }, 0.01],
    [tm.dort - 0.2, { head: { tilt: 4, look: [-0.6, 0.35] } }, 0.3],
    [tm.nasil - 0.1, { ...POZ.belde, head: { tilt: 6, look: [0, 0.05] } }, 0.35],
    [tm.d2 - 0.1, { armL: POZ.dur.armL }, 0.35],
    [tm.d2 + 0.2, { expr: 'notr', head: { tilt: -4, look: [-0.85, 0.1] } }, 0.3],
    [tm.hd, { expr: 'mutlu', head: { tilt: -5, look: [-0.5, 0.6] } }, 0.3],
    [tm.sayN[0] - 0.25, { head: { tilt: 5, look: [0.5, 0.6] } }, 0.3],
    [tm.sayac, { expr: 'mutlu', head: { tilt: -3, look: [-0.8, 0.2] }, ...POZ.belde }, 0.01],
    [tm.dAt + 0.1, { head: { tilt: 3, look: [0.9, -0.1] } }, 0.3],
    [tm.nYur, { head: { tilt: 4, look: [0.95, 0.1] } }, 0.3],
    [tm.buldum - 0.05, { armL: POZ.dur.armL }, 0.01],
  ];
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 4, look: [0.8, 0.2] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: -4, look: [0.85, 0.15] } }, 0.35],
    [tm.kaybetti, { expr: 'yorgun', head: { tilt: 6, look: [0.7, 0.5] } }, 0.3],
    [tm.pzt, { expr: 'mutlu', head: { tilt: -3, look: [0.9, -0.1] } }, 0.01],
    [tm.simdi, { expr: 'notr', head: { tilt: 4, look: [0.7, 0.4] } }, 0.01],
    [tm.d2 - 0.15, { expr: 'kizgin', head: { tilt: -4, look: [0.9, 0.3] } }, 0.25],
    [tm.hd + 0.2, { expr: 'notr', head: { tilt: 3, look: [0.6, 0.5] } }, 0.3],
    [tm.sayN[3], { expr: 'saskin', head: { tilt: 5, look: [0.85, 0.4] } }, 0.3],
    [cd0 + 0.15, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.4, -0.4] } }, 0.35],
    [tm.sayac, { expr: 'kizgin', armR: POZ.dur.armR, head: { tilt: -4, look: [0.9, -0.05] } }, 0.01],
    [tm.dIn + 0.05, { expr: 'yorgun', head: { tilt: 6, look: [0.9, 0.2] } }, 0.25],
    [tm.nYur + 0.2, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 5, look: [0.95, 0.1] } }, 0.35],
    [tm.buldum - 0.06, {}, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cta, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.15, 0.05] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.4],
  ];
  const necBase = kisi('necmi', { x: NEC_X, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.2] }, ...POZ.dur });
  const nec = [
    [tm.kaybetti, { head: { tilt: -6, look: [-0.85, 0.05] } }, 0.3],
    [tm.pzt, { expr: 'notr', head: { tilt: 3, look: [0.9, -0.1] } }, 0.01],
    [tm.atla + 1.0, { expr: 'mutlu', head: { tilt: -3, look: [-0.9, 0.1] } }, 0.01],
    [tm.simdi, { expr: 'mutlu', head: { tilt: -5, look: [-0.5, 0.5] } }, 0.01],
    [tm.d2 + 0.4, { expr: 'saskin', head: { tilt: 5, look: [-0.9, 0.05] } }, 0.25],
    [tm.hd + 0.4, { expr: 'mutlu', head: { tilt: -3, look: [-0.5, 0.5] } }, 0.3],
    [tm.sayac, { expr: 'mutlu', head: { tilt: -3, look: [-0.9, 0.1] } }, 0.01],
    [tm.dIn, { head: { tilt: 4, look: [0.9, 0.1] } }, 0.3],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Durum fonksiyonları ═══════════════════════════
// Uçan / düşen top (geri dönüş atışları): elde, uçuşta, kutuda (gizli), yerde
function atisDurumu(a, t) {
  if (t < a.tr) return null;
  const u = (t - a.tr) / a.sure, hedef = a.isabet ? [a.kx, ZEMIN - K_H - 6] : a.inis;
  if (u < 1) return { p: H.yay(a.from, hedef, u, a.lift), ucus: true };
  if (a.isabet) { const v = (t - a.tr - a.sure) / 0.12; return v < 1 ? { p: [a.kx, hedef[1] + 70 * v], ucus: true, kutuda: true } : { gizli: true, inis: a.tr + a.sure }; }
  return { p: a.inis, yerde: true };
}
// Atan kolun hedefi: sıra sıra kaldır (COCK), bırak (REL), indir (LOW)
function atisKolu(t, trs, LOW, COCK, REL) {
  if (!trs.length) return null;
  const d = [[trs[0] - 0.45, LOW], [trs[0] - 0.2, LOW]];
  trs.forEach((tr, k) => { d.push([tr - 0.075, COCK], [tr, REL]); if (k < trs.length - 1) d.push([tr + 0.09, LOW]); });
  d.push([trs[trs.length - 1] + 0.38, LOW]);
  const w = ease.state(seg(t, trs[0] - 0.45, 0.25)) * (1 - ease.state(seg(t, trs[trs.length - 1] + 0.32, 0.3)));
  // elde top: bir önceki bırakıştan (ya da ilk kalkıştan) sonra, bu bırakışa kadar
  let elde = false; for (let k = 0; k < trs.length; k++) { const a = k ? trs[k - 1] + 0.09 : trs[0] - 0.2; if (t >= a && t < trs[k]) elde = true; }
  return { p: yol(t, d), w, elde };
}
// Kutunun yeri (önden): sahneye ve zamana göre; tutan el için ağız noktası
function kutuYeri(t, S, id) {
  const { tm } = S;
  if (id === 'pzt') { const u = H.atlama(t, tm.atla, 1.2); return { x: lerp(K_KAPI, K_MASA, u), yb: ZEMIN }; }
  if (id === 'sayac') {
    if (t < tm.nKal) return { x: K_KAPI, yb: ZEMIN };
    const kalk = ease.enter(seg(t, tm.nKal, 0.32)), koy = ease.state(seg(t, tm.nKoy, 0.3)), nx = t < tm.nGeri ? 880 : necmiYuru(t, S).x;
    return { x: nx + (K_KAPI - 880), yb: ZEMIN - 70 * kalk * (1 - koy) };
  }
  if (id === 'ipucu' || id === 'buldum') return { x: K_NECMI, yb: ZEMIN };
  if (id === 'cta') return { x: 1150, yb: ZEMIN, kapida: true };
  if (id === 'espri') {
    if (t < tm.hKal) return { x: K_NECMI, yb: ZEMIN };
    if (t < tm.hInd) return { x: hikX(t, S) + 70, yb: ZEMIN - 140 * ease.enter(seg(t, tm.hKal, 0.35)) };
    const u = ease.state(seg(t, tm.hInd, 0.4)), x0 = 1110;
    return { x: lerp(x0, 1150, u), yb: lerp(ZEMIN - 140, ZEMIN, u), kapida: t >= tm.hBir };
  }
  return { x: K_KAPI, yb: ZEMIN };
}
// Necmi'nin sayaçtaki yürüyüşü: 620 → 840 (yüzü sağa), kutuyu tutar, geri geri 840 → 700, kutuyu koyar, öne döner
function necmiYuru(t, S) {
  const { tm } = S;
  if (t < tm.nYur) return { x: NEC_X, on: true };
  if (t < tm.nGeri) { const p = H.yuru('necmi', t, { t0: tm.nYur, t1: tm.nVar, x0: NEC_X, x1: 880 }); return { x: p.x, p }; }
  if (t < tm.nDon) { const p = H.yuru('necmi', t, { t0: tm.nGeri, t1: tm.nGelis, x0: 880, x1: 760, geri: true }); return { x: p.x, p }; }
  return { x: 760, on: true };
}
// Hikmet'in espride yürüyüşü: 720 → 1000 (yüzü sağa)
const hikX = (t, S) => H.yuru('hikmet', t, { t0: S.tm.hYur, t1: S.tm.hVar, x0: 780, x1: 1040 }).x;

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2b: 5, d4: 6 },
  kuyruksuz: (t, B) => !!B.sc.geri,
  dunya(K, t, B) {
    if (B.sc.id === 'cevap') planSahne(K, t, S, B);
    else odaSahne(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'pzt') {
      H.zamanHapi(K, t, tm.hapP, tm.atla + 0.05, K.up('pazartesi'), { y: B.top + 80, saat: 16.0 });
      H.zamanHapi(K, t, tm.hapS, tm.simdi - 0.25, K.up('salı'), { y: B.top + 80, saat: 9.25 });
    }
    if (id === 'simdi') {   // Hikmet'in sayımı: rakam yeşil topların üstünde atlar; 4 ve 6 kalır
      const dur = (cx, sira, tt) => sira.map((ix, k) => { const q = yigP(cx, ix); return [tt[k], sabit(tt[k])([q[0], q[1] - 54]), String(k + 1)]; });
      H.sayiAtla(K, t, dur(YIG_D, SAY_D, tm.sayD), { son: tm.sayBit, size: 56, fill: YESIL });
      H.sayiAtla(K, t, dur(YIG_N, SAY_N, tm.sayN), { son: tm.sayBit, size: 56, fill: YESIL });
    }
    if (id === 'sayac') H.mark(K, t, tm.dIn + 0.04, tm.nKal, sabit(tm.dIn)([915, ZEMIN - 100]), false);
    if (id === 'cevap') {
      // sayım: Defne'nin uzak kutudaki 8 topu, Necmi'nin yakın kutudaki 8 topu
      const ust = (p, tt) => sabit(tt)([p[0], p[1] - 66]);
      H.sayiAtla(K, t, tm.cU.map((tt, i) => [tt, ust(DIZ_D[i].p, tt), String(i + 1)]), { son: tm.sayiSon, size: 52, fill: PAL.mustard, col: INK });
      H.sayiAtla(K, t, tm.cY.map((tt, i) => [tt, ust(DIZ_N[i + 2].p, tt), String(i + 1)]), { son: tm.sayiSon, size: 52, fill: PAL.teal });
      const a = sabit(tm.etP);
      H.tag(K, t, tm.etP, tm.espri - 0.2, a([BX + 702, SIRA.nUzak]), `${K.up('pzt')}  %25 > %0`, PAL.mustard, INK, 44, [tm.iyi]);
      H.tag(K, t, tm.etS, tm.espri - 0.2, a([BX + 682, SIRA.dYakin]), `${K.up('salı')}  %100 > %75`, PAL.mustard, INK, 44, [tm.iyi + 0.07]);
    }
  },
});

// ——— ofis (önden) ———
function odaSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  // ışık ve saat: geri dönüşte zaman atlaması (gündüz → akşam → gece → sabah); kancanın sonunda saat 0,4 sn geri sarar
  const ua = id === 'pzt' ? H.atlama(t, tm.atla, 1.2) : 0;
  const isik = id === 'pzt' ? M.isikYolu([[0, 'gunduz'], [0.3, 'aksam'], [0.5, 'gece'], [0.75, 'sabah'], [1, 'gunduz']], ua) : M.ISIK.gunduz;
  const saat = id === 'pzt' ? H.saatSar(16.0, 33.25, ua) : id === 'oda' ? 10.2 - 1.6 * ease.state(seg(t, tm.pzt - 0.4, 0.4)) : 10.25 + (t - tm.simdi) / 60;
  M.mekanCiz(K, ODA, 'arka', t, { isik, durum: { saat } });
  // kapı (espride kapanır, kutu koridorda)
  const kut = kutuYeri(t, S, id);
  const kapali = id === 'espri' ? ease.state(seg(t, tm.kapa, tm.kapandi - tm.kapa)) : id === 'cta' ? 1 : 0;
  const kol = kapiCiz(K, kapali, kut.kapida ? [kut.x, kut.yb] : null);

  // ——— karakterler ———
  const geri = id === 'pzt', esp = id === 'espri';
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const o = { defne: { heads }, necmi: { heads }, hikmet: { heads } };
  let eldeD = null, eldeN = null, eldeH = null;   // elde tutulan top: [kol, renk]
  let isaretD = null, isaretH = null, isaretN = null, tutHik = null, tutNec = null, patN = null;

  // geri dönüş: iki günün atışları (Defne sağ kol; Necmi Pazartesi sağ, Salı sol kol)
  let ucan = [];
  if (geri) {
    const atis = tm.atislar, kol = (kim, k) => atis.filter(a => a.kim === kim && a.kol === k).map(a => a.tr);
    const dk = atisKolu(t, kol('defne', 'R'), [DEF_X + 95, MASA_Y - 24], H.elYeri('defne', dp, 'R', 'yukari'), atis.find(a => a.kim === 'defne').from);
    if (dk && dk.w > 0.01) { o.defne.R = [dk.p, dk.w, 'B']; if (dk.elde) eldeD = ['R', SARI]; }
    const nR = atisKolu(t, kol('necmi', 'R'), [NEC_X + 85, MASA_Y - 24], H.elYeri('necmi', np, 'R', 'yukari'), atis.find(a => a.kol === 'R' && a.kim === 'necmi').from);
    const nL = atisKolu(t, kol('necmi', 'L'), [NEC_X - 85, MASA_Y - 24], H.elYeri('necmi', np, 'L', 'yukari'), atis.find(a => a.kol === 'L').from);
    if (nR && nR.w > 0.01) { o.necmi.R = [nR.p, nR.w, 'B']; if (nR.elde) eldeN = ['R', MAVI]; }
    if (nL && nL.w > 0.01) { o.necmi.L = [nL.p, nL.w, 'B']; if (nL.elde) eldeN = ['L', MAVI]; }
    ucan = atis.map(a => ({ a, d: atisDurumu(a, t) })).filter(x => x.d && !x.d.gizli);
  }
  // kanca: Hikmet son topu Necmi'nin yığınına bırakır; Defne'yi ve yığınları eliyle gösterir
  let dusen = null;
  if (id === 'oda') {
    const P = yigP(YIG_N, 9), c = H.dus(t, 0, tm.dus, [P[0] - 4, P[1] - 64], P);
    dusen = c;
    const wB = 1 - W(t, 0.62, 0.3);
    if (wB > 0.01) o.hikmet.R = [[P[0] - 2, P[1] - 70], wB, 'A'];
    const g = W(t, tm.iki - 0.25, 0.28) * (1 - W(t, tm.ama - 0.1, 0.3));
    if (g > 0.01) { o.hikmet.L = [[YIG_D + 60, MASA_Y - 150], g, 'A']; }
    const g2 = W(t, tm.toplam - 0.3, 0.28) * (1 - W(t, tm.pzt - 0.5, 0.3));
    if (g2 > 0.01) { o.hikmet.R = [[YIG_N - 20, MASA_Y - 130], g2, 'A']; isaretH = ['R', yigP(YIG_N, 9)]; }
  }
  // şimdi: "altı"da Necmi, "dört"te Defne yığınına dokunur; Hikmet omuz silker; Defne Necmi'nin yığınını gösterir; Hikmet sayar
  if (id === 'simdi') {
    const gN = W(t, tm.alti - 0.35, 0.28) * (1 - W(t, tm.alti + 0.6, 0.3));
    if (gN > 0.01) o.necmi.L = [[YIG_N + 40, MASA_Y - 120], gN, 'A'];
    const gD = W(t, tm.dort - 0.35, 0.28) * (1 - W(t, tm.dort + 0.6, 0.3));
    if (gD > 0.01) o.defne.R = [[YIG_D - 40, MASA_Y - 120], gD, 'A'];
    const gP = W(t, tm.d2 - 0.1, 0.28) * (1 - W(t, tm.hd + 0.1, 0.35));
    if (gP > 0.01) { const h = [YIG_N - 120, MASA_Y - 150]; o.defne.R = [h, gP]; if (gP > 0.6) isaretD = ['R', [YIG_N, MASA_Y - 70]]; }
    // sayım: sol el Defne'nin yığınında, sağ el Necmi'ninkinde (parmak topa dokunur)
    const dD = [[tm.sayD[0] - 0.4, [YIG_D + 40, MASA_Y - 190]], ...SAY_D.map((ix, k) => [tm.sayD[k], yigP(YIG_D, ix)]), [tm.sayD[3] + 0.4, [YIG_D + 60, MASA_Y - 190]]];
    const wL = W(t, tm.sayD[0] - 0.45, 0.28) * (1 - W(t, tm.sayD[3] + 0.3, 0.3));
    if (wL > 0.01) { const h = H.dokunYolu(t, dD, { yuksel: 30, sure: 0.2 }); o.hikmet.L = [[h[0] + 26, h[1] - 52], wL, 'A']; if (wL > 0.5) isaretH = ['L', h]; }
    const dN = [[tm.sayN[0] - 0.4, [YIG_N - 40, MASA_Y - 190]], ...SAY_N.map((ix, k) => [tm.sayN[k], yigP(YIG_N, ix)]), [tm.sayN[5] + 0.45, [YIG_N - 60, MASA_Y - 190]]];
    const wR = W(t, tm.sayN[0] - 0.45, 0.28) * (1 - W(t, tm.sayN[5] + 0.35, 0.3));
    if (wR > 0.01) { const h = H.dokunYolu(t, dN, { yuksel: 30, sure: 0.18 }); o.hikmet.R = [[h[0] - 26, h[1] - 52], wR, 'A']; if (wR > 0.5) isaretH = ['R', h]; }
  }
  // sayaç: Defne kapıdaki kutuya bir top atar, kaçar; Necmi kutuyu getirir
  let sayacTop = null, necYan = null;
  if (id === 'sayac') {
    const LOW = H.elYeri('defne', dp, 'R', 'gogus'), COCK = H.elYeri('defne', dp, 'R', 'yukari'), REL = [DEF_X + 210, 1030];
    const hk = yol(t, [[tm.sayac, LOW], [tm.dAt - 0.24, LOW], [tm.dAt - 0.08, COCK], [tm.dAt, REL], [tm.dAt + 0.4, REL], [tm.dAt + 0.75, LOW]]);
    const w = 1 - W(t, tm.dAt + 0.5, 0.3);
    if (w > 0.01) { o.defne.R = [hk, w, 'B']; if (t < tm.dAt) eldeD = ['R', SARI]; }
    if (t >= tm.dAt) { const u = Math.min(1, (t - tm.dAt) / (tm.dIn - tm.dAt)); sayacTop = H.yay(REL, [930, ZEMIN - R], u, 330); }
    const ny = necmiYuru(t, S);
    if (!ny.on) { necYan = ny.p; necYan.expr = 'mutlu'; necYan.head = { ...necYan.head, look: [0.6, 0.3], tilt: -3 }; }
    else if (t >= tm.nDon) { np.x = 760; np.head = { ...np.head, look: [-0.7, 0.2] }; }
  }
  // ipucu: Necmi yığınına dokunur ("bütün topları"), sonra mavi topu kutunun üstünde bırakır
  let ipTop = null;
  if (id === 'ipucu') {
    np.x = 760;
    const gL = W(t, tm.topla - 0.3, 0.28) * (1 - W(t, tm.topla + 0.75, 0.3));
    if (gL > 0.01) { o.necmi.L = [[YIG_N + 30, MASA_Y - 110], gL, 'A']; patN = 1; }
    const ust = [K_NECMI - 4, ZEMIN - K_H - 140], gogus = H.elYeri('necmi', np, 'R', 'gogus');
    const hk = yol(t, [[tm.kutu - 0.25, gogus], [tm.kutu + 0.3, ust]]);
    o.necmi.R = [[hk[0] - 6, hk[1] - 12], 1, 'B'];
    if (t < tm.at) eldeN = ['R', MAVI];
    else { const v = seg(t, tm.at, 0.2); ipTop = [K_NECMI - 4, ust[1] + (ZEMIN - K_H + 50 - ust[1]) * v * v]; if (v >= 1) ipTop = null; }
    np.head = { ...np.head, look: t < tm.kutu ? [-0.5, 0.5] : t < tm.at + 0.35 ? [0.55, 0.65] : [0.05, 0.05], tilt: -4 };
  }
  if (id === 'cta') {
    const g = H.elYeri('defne', dp, 'L', 'gogus'), y = H.elYeri('defne', dp, 'L', 'yukari'), wK = W(t, tm.cta + 0.05, 0.45);
    o.defne.L = [[lerp(g[0], y[0] + 6, wK), lerp(g[1], y[1] + 90, wK)], 1, 'A']; eldeD = ['L', SARI];
  }
  // espri: Hikmet (yandan) kutuyu kaldırır, kapıya taşır, koridora koyar, kapıyı kapatır
  let hikYan = null;
  if (esp) {
    np.x = 590; np.head = { ...np.head, look: [0.9, 0.1] }; if (t > tm.kapa) np.expr = 'saskin';
    if (t < tm.hDon) {
      hikYan = H.yuru('hikmet', t, { t0: tm.hYur, t1: tm.hVar, x0: 780, x1: 1040 });
      hikYan.expr = 'mutlu'; hikYan.head = { ...hikYan.head, tilt: 4 };
      const egil = W(t, tm.hUz, 0.25) * (1 - W(t, tm.hKal + 0.05, 0.3)) + W(t, tm.hInd, 0.3) * (1 - W(t, tm.hBir + 0.05, 0.3));
      hikYan.lean = (hikYan.lean || 0) + 12 * egil;
      const ki = kutuYeri(t, S, 'espri');
      if (t < tm.hBir) {
        const agiz = [ki.x - 46, ki.yb - K_H + 6], w = W(t, tm.hUz, 0.25);
        tutHik = { R: [agiz, w] };
      } else if (t < tm.kapandi + 0.05) {
        const w = W(t, tm.hBir + 0.02, 0.22);
        tutHik = { R: [kol, 1], kol: true, w };
      }
    } else { hp.x = 1040; hp.head = { ...hp.head, look: [-0.7, 0.1], tilt: -5 }; hp.expr = 'mutlu'; }
  }

  // ——— çizim sırası: arka karakterler → masalar → yığınlar, kutu, toplar → tutan eller ———
  const ciz = {};
  const hikGorunur = !geri && id !== 'ipucu', necGorunur = true, defGorunur = !esp;
  if (id === 'buldum' || id === 'cta') np.x = 760;
  if (necYan) ciz.n = oyna(K, t, tl, 'necmi', necYan, { heads, ...(t > tm.nTut - 0.25 && t < tm.nBirak + 0.25 ? { R: [[kut.x - 46, kut.yb - K_H + 6], W(t, tm.nTut - 0.25, 0.25) * (1 - W(t, tm.nBirak, 0.25))] } : {}) });
  else if (necGorunur) ciz.n = oyna(K, t, tl, 'necmi', np, o.necmi);
  if (defGorunur) ciz.d = oyna(K, t, tl, 'defne', dp, o.defne);
  if (hikGorunur) {
    if (hikYan) {
      const R = tutHik?.kol ? [tutHik.R[0], tutHik.w] : tutHik?.R;
      ciz.h = oyna(K, t, tl, 'hikmet', hikYan, { heads, ...(R ? { R } : {}) });
    } else ciz.h = oyna(K, t, tl, 'hikmet', hp, o.hikmet);
  }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });

  masa(K, ...MASA_D); masa(K, ...MASA_N);
  kalemlik(K, 80); cay(K, 750, t);
  if (geri) { deste(K, DEF_X + 30, SARI); deste(K, NEC_X + 40, MAVI); }
  else {
    const kabD = i => Math.max(...DEF_IS.map((ix, k) => ix === i ? H.nabiz(t, tm.dort + k * 0.06, 0.34) : 0), 0);
    const kabN = i => Math.max(...NEC_IS.map((ix, k) => ix === i ? H.nabiz(t, tm.alti + k * 0.06, 0.34) : 0), patN ? (NEC_IS.includes(i) ? H.nabiz(t, tm.topla + 0.15, 0.34) : 0) : 0);
    yigin(K, YIG_D, SARI, DEF_IS, { kab: id === 'simdi' ? kabD : () => 0 });
    yigin(K, YIG_N, MAVI, NEC_IS, { gizli: id === 'oda' && t < tm.dus ? [9] : [], kab: id === 'simdi' || id === 'ipucu' ? kabN : () => 0 });
    if (dusen && t < tm.dus) top(K, dusen, R, MAVI, { isabet: true, i: 19 });
  }
  // kutu (kapıda değilse odada)
  if (!kut.kapida) kutuArka(K, kut.x, kut.yb);
  // kutuya düşen toplar (gövdenin arkasında kalır)
  for (const { a, d } of ucan) if (d.kutuda) top(K, d.p, R, a.kim === 'defne' ? SARI : MAVI, { i: Math.round(a.tr * 10) });
  if (ipTop) top(K, ipTop, R, MAVI, { i: 7 });
  if (!kut.kapida) kutuOn(K, kut.x, kut.yb);
  if (geri) { for (const a of tm.atislar) if (a.isabet) isabetHalka(K, kut.x, kut.yb, t, a.tr + a.sure); }
  if (id === 'ipucu') isabetHalka(K, K_NECMI, ZEMIN, t, tm.at + 0.17);
  // yerdeki ve uçan toplar
  for (const { a, d } of ucan) if (!d.kutuda) top(K, d.p, d.yerde ? R : R * 1.25, a.kim === 'defne' ? SARI : MAVI, { i: Math.round(a.tr * 10) });
  if (sayacTop) top(K, sayacTop, R, SARI, { i: 3 });
  else if ((id === 'ipucu' || id === 'espri') ) top(K, [930, ZEMIN - R], R, SARI, { i: 3 });
  // ışık: zaman atlamasında gece
  if (geri && isik.k > 0.01) H.karart(K, isik.k * 0.75);
  // eldeki toplar ve tutan eller (nesnenin üstünde)
  const elTop = (c, [side, renk]) => { const h = side === 'L' ? c.handL : c.handR; top(K, [h[0], h[1] - 14], geri ? R * 1.25 : R, renk, { i: 5 }); c.tut(side); };
  if (eldeD && ciz.d) elTop(ciz.d, eldeD);
  if (eldeN && ciz.n) elTop(ciz.n, eldeN);
  if (id === 'oda' && ciz.h && t < 0.04) ciz.h.tut('R');
  if (isaretH && ciz.h) ciz.h.isaret(isaretH[0], isaretH[1]);
  if (isaretD && ciz.d) ciz.d.isaret(isaretD[0], isaretD[1]);
  if (patN && ciz.n && o.necmi.L) ciz.n.tut('L');
  if (necYan && ciz.n && t > tm.nTut && t < tm.nBirak) ciz.n.tut('R');
  if (hikYan && ciz.h && tutHik && (tutHik.kol ? tutHik.w > 0.6 : tutHik.R[1] > 0.6)) ciz.h.tut('R');
  if (id === 'buldum' && ciz.d) { top(K, [ciz.d.handR[0], ciz.d.handR[1] - 14], R * 1.15, SARI, { isabet: true, i: 4 }); ciz.d.tut('R'); }
  void isaretN; void eldeH;
}

// ——— plan (kuşbakışı): kahraman an ———
function uzunKol(K, key, org, el, hedef, S = 300) {
  const c = H.CARDS[key], { ctx } = K, w = c.arm.w * S, lw = c.line * S, u = H.unit(el, org), bilek = [el[0] + u[0] * 44 * S / 300, el[1] + u[1] * 44 * S / 300];
  ctx.save(); ctx.lineCap = 'butt';
  for (const [ww, col] of [[w + lw * 2, INK], [w, c.arm.color]]) H.strokeLine(ctx, org, bilek, ww, col);
  H.strokeLine(ctx, [bilek[0] + u[0] * 12, bilek[1] + u[1] * 12], bilek, w + lw * 2, INK); H.strokeLine(ctx, [bilek[0] + u[0] * 14, bilek[1] + u[1] * 14], [bilek[0] + u[0] * 4, bilek[1] + u[1] * 4], w, c.arm.shade);
  ctx.restore();
  if (hedef) H.isaret(K, key, el, S, hedef, 1.25); else H.grip(K, key, el, S);
}
// Plandaki yığın: 10 topun küme yerleri (masanın üstünde)
const KUME = [[-44, -20], [0, -26], [44, -18], [-60, 18], [-18, 14], [24, 18], [64, 14], [-36, 50], [8, 50], [50, 46]];
function ucusPlan(t, t0, a, b, sure) {
  if (t < t0) return { p: a, k: 1, golge: a, yerde: false, bekle: true };
  const u = clamp01((t - t0) / sure), e = ease.state(u), p = [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];
  return { p: [p[0], p[1] - 70 * Math.sin(Math.PI * u)], k: 1 + 0.45 * Math.sin(Math.PI * u), golge: p, yerde: u >= 1 };
}
function planSahne(K, t, S, { heads, cam }) {
  const { tm } = S, { ctx } = K;
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  heads.defne = ekrandan(10, t > S.tm.cY[0] - 0.4 && t < S.tm.cY[7] + 0.5 ? 1000 : 640);
  M.mekanCiz(K, PLAN, 'arka', t);
  // kutular: uzak (kapının yanında), yakın (masaların arasında); "zor gün"de uzak kutu nabız atar
  const kz = H.nabiz(t, tm.zor, 0.4);
  kutuUst(K, A_UST, 52 * (1 + 0.16 * kz)); kutuUst(K, B_UST);
  if (kz > 0.01) { ctx.save(); ctx.globalAlpha = kz; ctx.beginPath(); ctx.arc(A_UST[0], A_UST[1], 74, 0, TAU); ctx.lineWidth = 10; ctx.strokeStyle = PAL.mustard; ctx.stroke(); ctx.restore(); }
  // toplar: yığından sıralarına uçar
  const durum = (dz, t0s, py, i) => ucusPlan(t, t0s[i], [py[0] + KUME[i][0], py[1] + KUME[i][1]], dz[i].p, dz[i].p[1] < 800 ? 0.62 : 0.42);
  const hepsi = [];
  DIZ_D.forEach((d, i) => hepsi.push({ ...durum(DIZ_D, tm.cvD, PY_D, i), renk: SARI, is: d.is, i, kim: 'd' }));
  DIZ_N.forEach((d, i) => hepsi.push({ ...durum(DIZ_N, tm.cvN, PY_N, i), renk: MAVI, is: d.is, i, kim: 'n' }));
  // vurgu: sayılan top kabarır; "toplamda" Defne'nin uzak sekizi sırayla kabarır; "ağır"da Defne'nin eli bastırır
  const kab = o => {
    let k = 0;
    if (o.kim === 'd' && o.i < 8) k = Math.max(k, H.nabiz(t, tm.cU[o.i], 0.3), H.nabiz(t, tm.toplamda + o.i * 0.055, 0.34));
    if (o.kim === 'n' && o.i >= 2) k = Math.max(k, H.nabiz(t, tm.cY[o.i - 2], 0.3));
    return k;
  };
  for (const o of hepsi) if (o.bekle || o.yerde) top(K, o.p, PR, o.renk, { isabet: o.is, kab: kab(o), i: o.i + (o.kim === 'n' ? 10 : 0) });
  for (const o of hepsi) if (!o.bekle && !o.yerde) { ctx.save(); ctx.globalAlpha = 0.25; K.ell(o.golge[0] + 6, o.golge[1] + 8, PR, PR * 0.6, INK, 0); ctx.restore(); top(K, o.p, PR * o.k, o.renk, { isabet: o.is, i: o.i }); }
  // ——— eller ———
  // Defne (soldan): yığınını iter, sonra sayar; Necmi (sağdan): yığınını iter
  const dIt = W(t, tm.ucD - 0.35, 0.28) * (1 - W(t, tm.ucD + 0.25, 0.35));
  if (dIt > 0.01) { const el = [lerp(BX - 200, PY_D[0] - 70, dIt), lerp(1260, PY_D[1] + 10, dIt) + 20 * H.nabiz(t, tm.ucD, 0.3)]; uzunKol(K, 'defne', [BX - 430, 1330], el, null); }
  const nIt = W(t, tm.ucN - 0.35, 0.28) * (1 - W(t, tm.ucN + 0.25, 0.35));
  if (nIt > 0.01) { const el = [lerp(BX + 1280, PY_N[0] + 70, nIt), lerp(1260, PY_N[1] + 10, nIt) + 20 * H.nabiz(t, tm.ucN, 0.3)]; uzunKol(K, 'necmi', [BX + 1510, 1330], el, null); }
  // sayım (d4): parmak uzak sıradaki 8 sarı topa, sonra yakın sıradaki 8 mavi topa dokunur
  const g0 = tm.cU[0] - 0.4, g1 = tm.cY[7] + 0.45;
  const bas = tm.agir - 0.3, kalk = tm.agir + 0.4;
  if (t > g0 && t < g1 + 0.3) {
    const dz = [[g0, [BX - 120, 470]], ...tm.cU.map((tt, i) => [tt, [DIZ_D[i].p[0], DIZ_D[i].p[1] - 6]]), ...tm.cY.map((tt, i) => [tt, [DIZ_N[i + 2].p[0], DIZ_N[i + 2].p[1] - 6]]), [g1 + 0.3, [BX - 140, 1250]]];
    const p = H.dokunYolu(t, dz, { yuksel: 26, sure: 0.17 });
    const s = clamp01((p[1] - 640) / 320), org = [BX - 440, p[1] + lerp(-170, 170, ease.state(s))];
    uzunKol(K, 'defne', org, [p[0] - 40, p[1] + lerp(-34, 30, s)], p);
  } else if (t > bas - 0.35 && t < kalk + 0.4) {
    // "ağır bastı": avucu uzak sıranın ortasına bastırır
    const w = W(t, bas - 0.35, 0.3) * (1 - W(t, kalk, 0.35)), hedef = [BX + 520, SIRA.dUzak + 30 + 10 * H.nabiz(t, tm.agir, 0.3)];
    if (w > 0.01) uzunKol(K, 'defne', [BX - 440, 760], [lerp(BX - 160, hedef[0], w), lerp(700, hedef[1], w)], null);
  }
}
