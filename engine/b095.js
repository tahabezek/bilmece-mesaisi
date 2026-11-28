// Bölüm 95 · KARE TEPSİDE REVANİ (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_095_v5.md).
// Mekanizma: açık yöntem (kenarı eşit paylaştırınca alan da eşitlenir; cevap arşivde kalır, kesilir).
// Logline: Hikmet Bey ofise kare tepside revani getirdi; tepsi 50 cm'ye 50 cm, revani her yerde aynı kalınlıkta, beş tabak.
// Herkes kenarın çıtırını sever: herkese tek parça, revani de kenar da eşit olacak. Necmi: "Kolay, beş şerit, onar santim."
// Defne: "Olmaz, ortadaki şeritlere kenar düşmez." İpucu (Hikmet parmağını tepsinin kenarında gezdirir):
// "Kenarı paylaştır, gerisi kendiliğinden gelir."
// Akılda kalacak tek şey: kenarı paylaştırırsan revaniyi de paylaştırırsın.
// Sızıntı yasağı: tepside merkezden ışınsal kesim, yıldız deseni, merkez noktası ya da kenarda 40 cm işareti hiçbir karede yok.
// Görünen tek kesim çizgileri Necmi'nin beş şerit tuzağıdır (paralel, bıçak ucuyla) ve sayaç kesmesinde kalkar.
// Mezurada rakam yok (yalnız çentik); ekranda yalnız "50 cm". Kerem konuşmaz: tabakları getirir, bırakır, bir tabağa bakar.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const ODA = 'b095_oda';
const X = { hikmet: 240, necmi: 440, defne: 642, genc: 842 };
const SK = 0.88;                                     // kişiler masanın arkasında, tepsiden uzakta: ölçek 0,88 (oran aynı)
const BAS_Y = 764;                                   // baş merkezlerinin dünya yüksekliği (grup plânında ekran ≈ 705)
const MASA = { arka: 938, on: 1180 };                // masa üstünün arka ve ön kenarı (örtülü)
// Tepsi (üstten hafif açılı): uzak kenar dar, yakın kenar geniş; ön yüz yüksekliği ON
const TEP = { cx: 540, uzak: 950, yakin: 1160, wU: 420, wY: 484, ON: 16 };
const SERIT = [0.2, 0.4, 0.6, 0.8];                  // Necmi'nin beş şerit çizgileri (revani alanında u)
const TABAK_MASA = [858, 1074];                      // tabak yığını masada (Kerem'in önü)
const TABAK_EL = [812, 952];                        // Kerem'in elinde
// Kameralar [zoom, cx, cy]. Kart 300–509 px: saç tepeleri ≥ 540 px.
const KAM = {
  grup: [1.3, 540, 960],
  hikmet: [1.55, 330, 905],
  necmi: [1.55, 480, 905],
  defne: [1.55, 610, 905],
  ust: [1, 540, 960],
  buldum: [1.55, 610, 905],
};
// Yakın plânlarda kadraj kenarında yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  hikmet: { necmi: 420, defne: 420, genc: 420 },
  necmi: { hikmet: -420, defne: 420, genc: 420 },
  defne: { hikmet: -420, necmi: -420, genc: 420 },
  buldum: { hikmet: -420, necmi: -420, genc: 420 },
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.24, open: 0, w: 0.9 },
  sinsi: { brow: 0.1, browTilt: -0.2, eye: 0.9, pupil: 1, curve: 0.42, open: 0, w: 1.05 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  keyif: { brow: 0.1, browTilt: -0.12, eye: 0.45, pupil: 1, curve: 0.42, open: 0, w: 1.0 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Tepsi ve revani ═══════════════════════════
// (u, v) ∈ [0,1]²: u soldan sağa, v uzaktan yakına. ox: tepsinin yatay kayması (kare 0'da Hikmet iter).
function tp(u, v, ox = 0) {
  const w = lerp(TEP.wU, TEP.wY, v), y = lerp(TEP.uzak, TEP.yakin, v);
  return [TEP.cx + ox + (u - 0.5) * w, y];
}
const RIM = 0.045, KABUK = 0.055;                    // tepsi kenarı ve çıtır kabuk bandı (u/v cinsinden)
const ru = u => lerp(RIM, 1 - RIM, u);                // revani alanında u → tepsi u
const quad = (K, a, b, c, d, fill, lw) => K.poly([a, b, c, d], fill, lw);
const SUSLER = (() => { const r = H.mulberry32(95); return Array.from({ length: 34 }, () => [r(), r(), r()]); })();
const PARLAK = [[0.22, 0.3, 0.09], [0.62, 0.22, 0.07], [0.44, 0.62, 0.1], [0.78, 0.7, 0.06], [0.16, 0.78, 0.06]];
// o = { ox, serit: [0..1 ×4] (çizginin çizilen oranı), ortaKirmizi: 0..1 }
function tepsi(K, o = {}) {
  const { ctx } = K, ox = o.ox || 0, P = (u, v) => tp(u, v, ox);
  // gölge
  K.ell(TEP.cx + ox, TEP.yakin + TEP.ON + 6, TEP.wY / 2 + 6, 9, 'rgba(60,40,20,0.20)', 0);
  // ön yüz (tepsinin dış duvarı)
  const nl = P(0, 1), nr = P(1, 1);
  quad(K, nl, nr, [nr[0] - 4, nr[1] + TEP.ON], [nl[0] + 4, nl[1] + TEP.ON], '#9EA6AB', LW * 0.8);
  K.line(nl[0] + 10, nl[1] + 6, nr[0] - 10, nr[1] + 6, 3, '#C3C9CC');
  // üst çerçeve (kenar)
  quad(K, P(0, 0), P(1, 0), P(1, 1), P(0, 1), '#C9CED1', LW * 0.8);
  // iç uzak duvar (açık) ve iç yan duvarlar
  quad(K, P(RIM, RIM), P(1 - RIM, RIM), P(1 - RIM, RIM + 0.06), P(RIM, RIM + 0.06), '#E2E6E8', 0);
  // revani: kabuk bandı (koyu) ve iç (altın)
  const R = (u, v) => P(ru(u), lerp(RIM + 0.05, 1 - RIM, v));
  quad(K, R(0, 0), R(1, 0), R(1, 1), R(0, 1), '#C47E2C', LW * 0.6);
  quad(K, R(KABUK, KABUK * 1.4), R(1 - KABUK, KABUK * 1.4), R(1 - KABUK, 1 - KABUK * 1.4), R(KABUK, 1 - KABUK * 1.4), '#EDB653', 0);
  // şerbet parlaması ve hindistancevizi/fıstık
  ctx.save();
  for (const [u, v, r] of PARLAK) { const c = R(u, v); K.ell(c[0], c[1], r * 260, r * 120, 'rgba(255,236,170,0.55)', 0); }
  for (const [a, b, c] of SUSLER) {
    const p = R(0.08 + 0.84 * a, 0.1 + 0.8 * b);
    if (c < 0.45) K.ell(p[0], p[1], 4.5, 3, '#7FA650', 0); else K.ell(p[0], p[1], 3.5, 2.4, '#FFF4DA', 0);
  }
  ctx.restore();
  // yanlış deneme: ortadaki üç şerit mercan tonu
  if (o.ortaKirmizi > 0.01) {
    ctx.save(); ctx.globalAlpha = 0.5 * o.ortaKirmizi;
    quad(K, R(SERIT[0], 0), R(SERIT[3], 0), R(SERIT[3], 1), R(SERIT[0], 1), PAL.coral, 0);
    ctx.restore();
  }
  // şerit çizgileri (bıçak ucuyla çizilmiş; mercan kesik)
  if (o.serit) for (let i = 0; i < 4; i++) {
    const s = o.serit[i]; if (!(s > 0.01)) continue;
    const a = R(SERIT[i], 0), b = R(SERIT[i], s);
    ctx.save(); ctx.setLineDash([14, 9]); ctx.lineCap = 'butt';
    K.line(a[0], a[1], b[0], b[1], 11, INK); K.line(a[0], a[1], b[0], b[1], 6, PAL.coral);
    ctx.restore();
  }
  // tepsi iç kenar çizgisi
  K.poly([P(RIM, RIM), P(1 - RIM, RIM), P(1 - RIM, 1 - RIM), P(RIM, 1 - RIM)], null, 2.5);
}

// Üstten insert: aynı tepsi tam kare (ekran koordinatı, kamera 1x). x0, y0 sol üst; A kenar
const UST = { x0: 230, y0: 640, A: 620 };
function tepsiUst(K, o = {}) {
  const { ctx } = K, { x0, y0, A } = UST, r = 20, kb = 30;
  K.rect(x0 + 10, y0 + 14, A, A, 'rgba(60,40,20,0.22)', 0, 18);
  K.rect(x0, y0, A, A, '#C9CED1', LW, 18);
  K.rect(x0 + r, y0 + r, A - 2 * r, A - 2 * r, '#C47E2C', LW * 0.6, 8);
  K.rect(x0 + r + kb, y0 + r + kb, A - 2 * (r + kb), A - 2 * (r + kb), '#EDB653', 0, 6);
  const ix = x0 + r, iy = y0 + r, iw = A - 2 * r;
  for (const [u, v, rr] of PARLAK) K.ell(ix + u * iw, iy + v * iw, rr * 300, rr * 200, 'rgba(255,236,170,0.55)', 0);
  for (const [a, b, c] of SUSLER) {
    const px = ix + (0.08 + 0.84 * a) * iw, py = iy + (0.1 + 0.8 * b) * iw;
    if (c < 0.45) K.ell(px, py, 6, 4, '#7FA650', 0); else K.ell(px, py, 5, 3.4, '#FFF4DA', 0);
  }
  if (o.serit) for (let i = 0; i < 4; i++) {
    const s = o.serit[i]; if (!(s > 0.01)) continue;
    const x = ix + SERIT[i] * iw;
    ctx.save(); ctx.setLineDash([18, 12]); ctx.lineCap = 'butt';
    K.line(x, iy, x, iy + s * iw, 14, INK); K.line(x, iy, x, iy + s * iw, 8, PAL.coral);
    ctx.restore();
  }
  K.rect(x0 + r, y0 + r, A - 2 * r, A - 2 * r, null, 2.5, 8);
}
const ustNok = (u, v) => [UST.x0 + 20 + u * (UST.A - 40), UST.y0 + 20 + v * (UST.A - 40)];

// Mezura: kutu (yuvarlak köşeli, sarı) + çıkan şerit (rakamsız çentikler). Dünya ya da ekran: k ölçek
function mezuraKutu(K, [x, y], k = 1, rot = 0) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  K.rect(-30, -30, 60, 60, '#E8B92F', LW * 0.7, 16);
  K.circ(0, 0, 15, '#2F3A3A', LW * 0.5); K.circ(0, 0, 5, '#E8B92F', 0);
  K.rect(26, -8, 10, 16, '#2F3A3A', 0, 2);
  ctx.restore();
}
function mezuraSerit(K, a, b, gen = 22) {
  const { ctx } = K, d = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d < 2) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(ang);
  K.rect(0, -gen / 2, d, gen, '#F2D24A', LW * 0.5, 2);
  for (let x = 12; x < d - 4; x += 12) K.line(x, -gen / 2, x, -gen / 2 + (x % 60 === 0 ? gen * 0.6 : gen * 0.3), 2, INK);
  K.rect(d - 4, -gen / 2 - 4, 8, gen + 8, '#8C969A', LW * 0.4, 1);   // kanca
  ctx.restore();
}

// Bıçak (pasta bıçağı): st = { p: orta, rot, k }. Yerel: sap [−100, −30], ağız [−30, 100] (uç sağda)
const bicNok = (st, [lx, ly]) => { const k = st.k || 1; lx *= k; ly *= k; const c = Math.cos(st.rot || 0), s = Math.sin(st.rot || 0); return [st.p[0] + lx * c - ly * s, st.p[1] + lx * s + ly * c]; };
const bicSap = st => bicNok(st, [-64, 0]);
const bicUc = st => bicNok(st, [100, 0]);
function bicak(K, st) {
  const { ctx } = K;
  ctx.save(); ctx.translate(st.p[0], st.p[1]); ctx.rotate(st.rot || 0); ctx.scale(st.k || 1, st.k || 1); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-30, -9); ctx.lineTo(70, -9); ctx.quadraticCurveTo(96, -8, 104, 0); ctx.quadraticCurveTo(70, 9, -30, 9); ctx.closePath();
  K.fs('#DCE2E4', LW * 0.6);
  K.line(-26, 4, 84, 3, 2.5, '#AEB8BC');
  K.rect(-102, -10, 74, 20, '#3E5B52', LW * 0.6, 7);
  for (const x of [-84, -62, -42]) K.circ(x, 0, 2.6, '#D9C9A8', 0);
  ctx.restore();
}
// ucu tp'de olan bıçak durumu (sap = uç − yön × boy)
const bicakUctan = (uc, rot, k) => { const c = Math.cos(rot), s = Math.sin(rot); return { p: [uc[0] - 100 * k * c, uc[1] - 100 * k * s], rot, k }; };

// Tabak yığını (beş tabak; her biri ayrı görünür)
function tabaklar(K, [x, y], n = 5, ust = null) {
  for (let i = 0; i < n; i++) {
    const yy = y - i * 13;
    K.ell(x, yy + 4, 66, 20, '#C9C3B4', LW * 0.6);
    K.ell(x, yy, 66, 20, '#FBF7EE', LW * 0.6);
    if (i === n - 1) { K.ell(x, yy, 44, 12, '#F1EADA', 2.5); K.ell(x, yy, 58, 17, null, 2); }
  }
  if (ust) { K.ell(ust[0], ust[1] + 4, 66, 20, '#C9C3B4', LW * 0.6); K.ell(ust[0], ust[1], 66, 20, '#FBF7EE', LW * 0.6); K.ell(ust[0], ust[1], 44, 12, '#F1EADA', 2.5); }
}

// Üstten insertte koldan uzanan el (gövde kadraj dışında, yukarıda): A omuz (kadraj dışı), h el; kolun rengi karttan
function ustKol(K, key, A, h, { L1 = 560, L2 = 520, bukum = 1, k = 1 } = {}) {
  const c = H.CARDS[key], dx = h[0] - A[0], dy = h[1] - A[1], d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1);
  const a = Math.atan2(dy, dx), cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), b = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const E = [A[0] + L1 * Math.cos(a + bukum * b), A[1] + L1 * Math.sin(a + bukum * b)];
  const w = 96 * k;
  for (const [p, q] of [[A, E], [E, h]]) { K.line(p[0], p[1], q[0], q[1], w + 7, INK); }
  for (const [p, q] of [[A, E], [E, h]]) { K.line(p[0], p[1], q[0], q[1], w - 2, c.arm.color); }
  K.circ(E[0], E[1], (w - 2) / 2, c.arm.color, 0);
  return { E, el: (K2, rot = 0) => {   // el (ten): kolun ucunda, nesnenin üstüne
    const { ctx } = K2; ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(rot);
    K2.rect(-46 * k, -34 * k, 92 * k, 68 * k, c.skin, LW * 0.8, 30 * k);
    for (const yy of [-12, 6]) K2.line(-20 * k, yy * k, 30 * k, yy * k, 3, c.skinShade);
    ctx.restore();
  } };
}

// ═══════════════════════════ Mekân: ofis mutfağı ═══════════════════════════
function masa(K) {
  const x0 = -700, x1 = 1900, { ctx } = K;
  // masa üstü örtüsü (krem, ince hardal çizgi)
  K.rect(x0, MASA.arka, x1 - x0, MASA.on - MASA.arka, '#F2E8D2', LW * 0.8, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, MASA.arka, x1 - x0, MASA.on - MASA.arka); ctx.clip();
  for (let x = x0; x < x1; x += 90) K.line(x, MASA.arka, x - 40, MASA.on, 3, 'rgba(201,150,60,0.35)');
  ctx.restore();
  // önden sarkan örtü: hardal ve tuğla bantlı, dantel saçak (altyazı ve sayaç bunun üstünde)
  const y0 = MASA.on - 2, h = 430;
  K.rect(x0, y0, x1 - x0, h, '#F6EEDC', LW * 0.7, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, h); ctx.clip();
  K.rect(x0, y0 + 26, x1 - x0, 30, '#C98B2E', 0, 0);
  K.rect(x0, y0 + 66, x1 - x0, 10, '#B4553A', 0, 0);
  for (let x = x0; x < x1; x += 70) for (let y = y0 + 110; y < y0 + h - 70; y += 70) K.circ(x + ((y / 70) % 2) * 35, y, 7, '#E3C98F', 0);
  K.rect(x0, y0 + h - 70, x1 - x0, 10, '#B4553A', 0, 0);
  K.rect(x0, y0 + h - 50, x1 - x0, 30, '#C98B2E', 0, 0);
  ctx.restore();
  K.line(x0, y0 + h, x1, y0 + h, LW * 0.7, INK);
  for (let x = x0 + 18; x < x1; x += 36) K.circ(x, y0 + h + 6, 9, '#F6EEDC', LW * 0.4);
}
// Üstten insertin örtüsü (aynı renkler, kuşbakışı)
function ortuUst(K) {
  K.rect(-50, -50, 1180, 2020, '#F2E8D2', 0, 0);
  for (let x = -400; x < 1500; x += 90) K.line(x, -50, x - 300, 1970, 3, 'rgba(201,150,60,0.35)');
  K.rect(-50, 1300, 1180, 30, '#C98B2E', 0, 0); K.rect(-50, 1340, 1180, 10, '#B4553A', 0, 0);
}
function raf(K, t) {
  // sağda açık raf: kavanozlar ve kettle (buhar döngüsü)
  K.rect(1000, 640, 380, 14, '#8A5C3A', LW * 0.6, 3);
  for (const [x, h, c] of [[1040, 70, '#D9C27A'], [1100, 90, '#B9D0C2'], [1160, 60, '#E3A86B']]) { K.rect(x - 24, 640 - h, 48, h, c, LW * 0.6, 8); K.rect(x - 26, 640 - h - 10, 52, 12, '#8A5C3A', LW * 0.5, 3); }
  K.rect(1000, 900, 380, 14, '#8A5C3A', LW * 0.6, 3);
  K.rect(1230, 820, 100, 80, '#D24E3A', LW * 0.7, 20); K.rect(1250, 805, 60, 18, '#2F3A3A', LW * 0.5, 6);
  H.buhar(K, 1280, 800, t, { k: 1, n: 2, periyot: 2.2 });
}
M.mekanEkle(ODA, {
  gen: [-700, 1900], dongu: ['pencerede martılar', 'duvar saatinin saniye ibresi', 'kettle buharı'],
  kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -800, x1: 2100, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 300, 360, 480, 360, { isik, t: t + 5, gunes: 0.4, manzara: 'istanbul', marti: true, kayit: false });
    M.duvarSaati(K, -20, 560, 64, 15.2 + t / 3600, t);
    raf(K, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), kare: T('h1:1'), revani: T('h1:3'), bes: T('h1:5'), tabak: T('h1:6'), herkese: T('h1:8'), tek: T('h1:9'), h1s: T('h1>'),
    d1: T('d1'), kenarlar: T('d1:0'), elli: T('d1:1'), revaniD: T('d1:3'), ayni: T('d1:6'), d1s: T('d1>'),
    h2: T('h2'), kenarin: T('h2:1'), citir: T('h2:2'), revaniH: T('h2:4'), kenarH: T('h2:6'), esit: T('h2:8'), h2s: T('h2>'),
    n0: T('n0'), kolay: T('n0:0'), besN: T('n0:1'), serit: T('n0:2'), onar: T('n0:3'), santim: T('n0:4'), n0s: T('n0>'),
    d2: T('d2'), ortadaki: T('d2:1'), kenarD: T('d2:3'), dusmez: T('d2:4'), nasil: T('d2:5'), d2s: T('d2>'),
    n1: T('n1'), paylas: T('n1:1'), gerisi: T('n1:2'), kendi: T('n1:3'), n1s: T('n1>'),
  };
  tm.ustKes = tm.d1 - 0.1; tm.hikKes = tm.h2 - 0.1; tm.necKes = tm.n0 - 0.12;
  tm.ust2Kes = Math.max(tm.necKes + 1.22, tm.onar - 0.16); tm.defKes = tm.d2 - 0.1; tm.sayac = Math.min(cd0 - 0.05, tm.d2s + 0.04);
  tm.itme = 0.3;                                              // kare 0: Hikmet tepsiyi iter (0,32 sn)
  tm.tabakIn = tm.bes - 0.2;                                  // Kerem tabakları masaya bırakır (0,4 sn)
  // şerit çizgileri (üstten insert): dört çizgi art arda
  const s0 = tm.ust2Kes + 0.12, sd = Math.min(0.24, (tm.d2 - 0.2 - s0) / 4.4);
  tm.serit0 = s0; tm.seritD = sd;
  // mezura (üstten insert): üst kenar, sonra sağ kenar
  tm.mez1 = tm.kenarlar + 0.05; tm.mez2 = tm.revaniD - 0.1;
  tm.mezG = cd0 + 3.2; tm.mezB = cd0 + 6.4;                   // sayaç: Defne mezurayı çekip bakar
  tm.kTabak = cd0 + 1.0; tm.kTabakB = cd0 + 4.2;              // sayaç: Kerem üstteki tabağı alıp bakar
  tm.parmak = tm.paylas - 0.35;                               // ipucu: Hikmet parmağını uzak kenarda gezdirir
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.ustKes - 0.1, 1.32, 540, 958]] },
    { id: 'ust', t0: tm.ustKes, cam: [[0, ...KAM.ust], [tm.hikKes - 0.1, 1.02, 540, 960]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.necKes - 0.1, 1.58, 334, 902]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.ust2Kes - 0.05, 1.57, 482, 903]] },
    { id: 'ust2', t0: tm.ust2Kes, cam: [[0, ...KAM.ust], [tm.defKes - 0.05, 1.015, 540, 960]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.sayac - 0.1, 1.58, 606, 902]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // sayaç ve ipucu: doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.33, 540, 962]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef|zoom/.test(w)) console.error('sahne uyarısı: ' + w);
  // balonlar kesmeden 0,3 sn önce söner (kesmede metin üst üste binmesin); n1 kesime kadar okunur
  const kes = { h1: tm.ustKes, d1: tm.hikKes, h2: tm.necKes, d2: tm.sayac };
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').map(l => kes[l.id] ? { ...l, t1: Math.min(l.t1, kes[l.id] - 0.3) } : l) };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  // başlar aynı hizada: her kişinin zemin yüksekliği baş merkezinden geri hesaplanır
  const Y = {}; for (const k of Object.keys(X)) { const p = H.kisi(k, { x: 0, s: H.BOY[k] * SK, ...POZ.dur }); Y[k] = 1500 + (BAS_Y - H.eklem(k, p, 'head')[1]); }
  return { tm, film, tlS, tlN, tlA, Y };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç ve ipucu: doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.buldum - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.3), Math.log(1.35), u)), cx: lerp(540, 536, u), cy: lerp(960, 956, u) });
    }
  },
  dunya(K, t, B) { if (B.sc.id === 'ust' || B.sc.id === 'ust2') ustSahne(K, t, S, B); else sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const YA = id === 'ust' || id === 'ust2' ? 1262 : YA0;
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (YA - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    // üstten insert: "50 cm" etiketleri (üst kenar, sonra sağ kenar); tepsinin içinde, kenara bağlı ve sabit
    if (id === 'ust') {
      H.tag(K, t, tm.mez1 + 0.42, tm.hikKes - 0.2, [UST.x0 + UST.A / 2, UST.y0 + 92], '50 cm', PAL.mustard, INK, 50);
      H.tag(K, t, tm.mez2 + 0.5, tm.hikKes - 0.2, [UST.x0 + UST.A - 130, UST.y0 + UST.A / 2 + 40], '50 cm', PAL.mustard, INK, 50);
    }
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: YA, split: { h1: 5, d1: 3, h2: 4, d2: 5, d4: 8 }, kuyruksuz: id === 'ust' || id === 'ust2' });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, kb, { y: YA });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});
const YA0 = 1250;   // altyazı balonunun üstü (örtünün üstünde): iki satırlık balon ≈ 1415 px'te biter

// "SEN DE DÜŞÜN!" sayacı (perde yok; paylaşım hapı yok): daire solda altta, başlık sağda (örtünün üstünde)
function sayac(K, t, t1, { dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 190, y = 1335, r = 68;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 11, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 21, 58, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(600, 1335); ctx.scale(inU * out, inU * out);
  ctx.font = '900 50px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 60;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 18, 50, INK, 900);
  ctx.restore();
}

// ═══════════════════════════ Üstten insertler ═══════════════════════════
function seritAt(tm, t) {   // her çizginin çizilen oranı (yalnız ust2 → sayaç arası görünür)
  if (t < tm.serit0) return [0, 0, 0, 0];
  return SERIT.map((_, i) => ease.state(seg(t, tm.serit0 + i * tm.seritD * 1.1, tm.seritD)));
}
function ustSahne(K, t, S, B) {
  const { tm } = S, id = B.sc.id;
  ortuUst(K);
  if (id === 'ust') {
    tepsiUst(K);
    // Defne: mezura kutusu sağ üst köşede elinde; şerit önce üst kenar boyunca sola, sonra sağ kenar boyunca aşağı
    const sagUst = ustNok(1, 0), solUst = ustNok(0, 0), sagAlt = ustNok(1, 1);
    const u1 = ease.state(seg(t, tm.mez1, 0.45));
    const geri = ease.state(seg(t, tm.mez2 - 0.3, 0.25)), u2 = ease.state(seg(t, tm.mez2, 0.45));
    const kutu1 = [sagUst[0] + 44, sagUst[1] - 30], kutu2 = [sagUst[0] + 30, sagUst[1] - 44];
    const kutu = t < tm.mez2 - 0.3 ? kutu1 : kar(kutu1, kutu2, geri);
    const elY = [kutu[0] + 30, kutu[1] - 20 + 8 * Math.sin(TAU * t / 2.6)];
    let a, b;
    if (t < tm.mez2 - 0.05) { a = [kutu1[0] - 32, sagUst[1] - 6]; b = kar(a, [solUst[0] - 6, solUst[1] - 6], u1 * (1 - geri)); }
    else { a = [sagUst[0] - 6, kutu2[1] + 32]; b = kar(a, [sagAlt[0] - 6, sagAlt[1] + 6], u2); }
    if (t >= tm.mez2 - 0.05) b = [b[0], b[1]];
    mezuraSerit(K, a, b, 26);
    const kol = ustKol(K, 'defne', [1010, -260], elY, { bukum: -1 });
    mezuraKutu(K, kutu, 1.3, t < tm.mez2 - 0.3 ? 0 : -Math.PI / 2 * geri);
    kol.el(K, -0.5);
  } else {
    const sr = seritAt(tm, t);
    tepsiUst(K, { serit: sr });
    // Necmi: bıçak ucu çizgiyi çizer; aralarda bıçak bir sonraki çizginin başına havadan geçer
    const iw = UST.A - 40, ix = UST.x0 + 20, iy = UST.y0 + 20;
    let uc = [ix + SERIT[0] * iw, iy - 30];
    for (let i = 0; i < 4; i++) {
      const a0 = tm.serit0 + i * tm.seritD * 1.1;
      if (t >= a0 - tm.seritD * 0.1) uc = [ix + SERIT[i] * iw, iy + sr[i] * iw];
      if (i < 3 && t >= a0 + tm.seritD && t < a0 + tm.seritD * 1.1) {
        const u = ease.state(seg(t, a0 + tm.seritD, tm.seritD * 0.1));
        uc = kar([ix + SERIT[i] * iw, iy + iw], [ix + SERIT[i + 1] * iw, iy], u);
      }
    }
    if (t < tm.serit0) uc = kar([ix + SERIT[0] * iw - 40, iy - 120], [ix + SERIT[0] * iw, iy], ease.enter(seg(t, tm.ust2Kes, tm.serit0 - tm.ust2Kes)));
    const st = bicakUctan(uc, Math.PI / 2 - 0.25, 1.9), el = bicSap(st);
    const kol = ustKol(K, 'necmi', [120, -300], el, { bukum: 1 });
    bicak(K, st);
    kol.el(K, Math.PI / 2 - 0.25);
  }
}

// ═══════════════════════════ Açılı sahne ═══════════════════════════
// Masanın üstüne uzanan kol: karakter masanın arkasında çizildiği için masa örtüsünün altında kalan kol parçası
// (omuz → dirsek → el) masa üstünde yeniden çizilir; el de üstüne. Yalnız masa hattının altındaki kısım.
function onKol(K, key, p, O) {
  const c = H.CARDS[key], { ctx } = K;
  for (const sd of ['L', 'R']) {
    if (!O[sd] || !(O[sd][1] > 0.4)) continue;   // yalnız uzanan kol (sarkan kol masanın arkasında kalır)
    const S = H.eklem(key, p, 'sh' + sd), E = H.eklem(key, p, 'el' + sd), Hn = H.eklem(key, p, 'hand' + sd);
    if (Math.max(E[1], Hn[1]) < MASA.arka + 2) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(-2000, MASA.arka, 6000, 2000); ctx.clip();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(...S); ctx.lineTo(...E); ctx.lineTo(...Hn);
    ctx.strokeStyle = INK; ctx.lineWidth = c.arm.w * p.s + c.line * p.s * 2; ctx.stroke();
    ctx.strokeStyle = c.arm.color; ctx.lineWidth = c.arm.w * p.s; ctx.stroke();
    ctx.restore();
    if (Hn[1] >= MASA.arka - 4) H.grip(K, key, Hn, p.s);
  }
}
const bak = (k, p, q) => { const h = H.eklem(k, p, 'head'); return [Math.max(-0.75, Math.min(0.75, (q[0] - h[0]) / 380)), Math.max(-0.5, Math.min(0.55, (q[1] - h[1]) / 420))]; };

function sahne(K, t, S, B) {
  const { tm, Y } = S, { heads } = B, id = B.sc.id;
  const tlTum = { ...S.tlS, lines: [...S.tlS.lines, ...S.tlN.lines] };   // dudak: n1 dahil
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.sayac && t < tm.buldum;
  const ipucu = t >= tm.n1 - 0.3 && t < tm.buldum;
  const HEAD = k => [yer(k), BAS_Y];
  const ORTA = tp(0.5, 0.45);
  const ox = -22 * (1 - ease.state(seg(t, tm.itme, 0.32)));          // kare 0: tepsi 22 px solda, Hikmet iter
  const serit = t >= tm.ust2Kes && t < tm.sayac ? seritAt(tm, t) : [0, 0, 0, 0];
  const ortaK = t >= tm.ortadaki && t < tm.sayac ? ease.state(seg(t, tm.ortadaki + 0.1, 0.3)) : 0;

  // ——— Hikmet (solda) ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, s: H.BOY.hikmet * SK, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads };
  hp.head.look = bak('hikmet', hp, ORTA);
  // kare 0 → h1: sağ el tepsinin sol kenarında (iter), "Size kare tepside" boyunca orada; "herkese tek parça" işaret parmağı
  const tutus = tp(0.04, 0.3, ox);
  const wTep = 1 - W(t, tm.bes - 0.1, 0.3);
  if (wTep > 0.01) hO.R = [[tutus[0] - 6, tutus[1]], wTep, 'A'];
  const wTek = pIn(t, tm.herkese - 0.2, tm.h1s + 0.2, 0.28, 0.3);
  if (wTek > 0.01) hO.L = [H.elYeri('hikmet', hp, 'L', 'yukari').map((v, i) => v + [10, 40][i]), wTek, 'B'];
  if (t >= tm.bes - 0.1 && t < tm.herkese) hp.head.look = bak('hikmet', hp, TABAK_MASA);
  if (t >= tm.herkese && t < tm.ustKes) { hp.head.look = bak('hikmet', hp, HEAD('necmi')); hp.expr = IF.emin; }
  // h2 (yakın plân): "kenarın çıtırını" parmak tepsinin uzak kenarında; "eşit" sol el işaret parmağı yukarıda
  let hKenar = 0, hEsit = 0;
  if (t >= tm.hikKes && t < tm.necKes) {
    hp.expr = IF.ciddi;
    hKenar = pIn(t, tm.kenarin - 0.3, tm.revaniH, 0.28, 0.3);
    const kx = lerp(0.08, 0.36, ease.state(seg(t, tm.kenarin, Math.max(0.3, tm.revaniH - tm.kenarin - 0.2))));
    if (hKenar > 0.01) hO.R = [tp(kx, 0.03), hKenar, 'A'];
    hEsit = pIn(t, tm.kenarH - 0.25, tm.h2s + 0.2, 0.28, 0.3);
    if (hEsit > 0.01) hO.L = [H.elYeri('hikmet', hp, 'L', 'yukari').map((v, i) => v + [10, 40][i]), hEsit, 'B'];
    hp.head.look = t < tm.revaniH ? bak('hikmet', hp, tp(kx, 0.03)) : [0.15, 0.05];
  }
  // sayaç: düşünür, bakışı tepsi ile ötekiler arasında gezinir; ipucu: parmak uzak kenarda soldan sağa gezinir
  let hParmak = 0;
  if (sayacta) {
    const c0 = tm.cd0; hp.expr = IF.dusun;
    const j = Math.floor((t - c0) / 2.1) % 3; hp.head.look = j === 0 ? bak('hikmet', hp, ORTA) : j === 1 ? bak('hikmet', hp, HEAD('necmi')) : bak('hikmet', hp, tp(0.2, 0.1));
    if (ipucu) {
      hp.expr = IF.sakin;
      hParmak = pIn(t, tm.parmak - 0.1, tm.kendi + 0.25, 0.28, 0.35);
      const u = lerp(0.06, 0.34, ease.state(seg(t, tm.parmak + 0.15, Math.max(0.6, tm.gerisi - tm.parmak - 0.1))));
      if (hParmak > 0.01) hO.R = [tp(u, 0.02), hParmak, 'A'];
      hp.head.look = t < tm.gerisi + 0.2 ? bak('hikmet', hp, tp(u, 0.02)) : bak('hikmet', hp, HEAD('defne'));
    }
  }
  if (id === 'cevap') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Necmi (ortada solda): bıçak elinde ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, s: H.BOY.necmi * SK, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads };
  np.head.look = t < tm.bes - 0.1 ? bak('necmi', np, ORTA) : t < tm.herkese ? bak('necmi', np, TABAK_MASA) : bak('necmi', np, HEAD('hikmet'));
  // bıçak: sol elde, göğüs hizasında, ucu yukarı-dışarı (yüzlerden uzak); n0 "beş"te biraz kalkar
  const sh = H.eklem('necmi', np, 'shL');
  const kalk = t >= tm.necKes && t < tm.ust2Kes ? ease.enter(seg(t, tm.besN - 0.15, 0.35)) : 0;
  const elN = [sh[0] + 4 - 46 * kalk, sh[1] + 52 - 40 * kalk];
  const rotB = Math.PI * 0.88 - (Math.PI * 0.88 + Math.PI / 2 + 0.75) * kalk;   // dinlenirken uç sola (tepsinin dışına; tepside çapraz çizgi gibi okunmasın) 
  // bıçak yalnız Necmi'nin yakın plânında elde; öteki plânlarda masada, tepsinin solunda yatar (el karışıklığı olmasın)
  const bElde = id === 'necmi';
  const bc = bElde ? { p: bicNok({ p: elN, rot: rotB, k: 0.95 }, [64, 0]), rot: rotB, k: 0.95 } : { p: [226, 1080], rot: -1.25, k: 0.95 };
  const bSap = elN;
  if (bElde) nO.L = [bSap, 1, 'A'];
  if (t >= tm.necKes && t < tm.defKes) { np.expr = IF.sinsi; np.head.look = t < tm.besN ? bak('necmi', np, ORTA) : [0.05, 0.06]; }
  if (t >= tm.defKes && t < tm.sayac) { np.expr = IF.merak; np.head.look = bak('necmi', np, HEAD('defne')); }
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.dusun;
    np.head.look = t < c0 + 2.5 ? bak('necmi', np, bicUc(bc)) : t < c0 + 5.5 ? bak('necmi', np, ORTA) : bak('necmi', np, HEAD('hikmet'));
    np.head.tilt = 6 * pIn(t, c0 + 2.6, c0 + 5.3, 0.35);
    if (ipucu) { np.expr = IF.merak; np.head.look = t < tm.gerisi ? bak('necmi', np, tp(0.3, 0.05)) : bak('necmi', np, HEAD('hikmet')); }
  }
  if (id === 'cevap') np.head.look = bak('necmi', np, HEAD('defne'));

  // ——— Defne (ortada sağda): mezura elinde ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, s: H.BOY.defne * SK, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  dp.head.look = t < tm.bes - 0.1 ? bak('defne', dp, ORTA) : t < tm.herkese ? bak('defne', dp, TABAK_MASA) : bak('defne', dp, HEAD('hikmet'));
  const shL = H.eklem('defne', dp, 'shL');
  let mezKutu = [shL[0] + 6, shL[1] + 20], mezSerit = null;
  dO.L = [[mezKutu[0] + 4, mezKutu[1] + 22], 1, 'A'];
  // d2 (yakın plân): "Olmaz" sağ el avuç; "ortadaki" sağ el ortadaki şeritlerin üstünde gezinir; "Nasıl" omuz silker
  let dGoster = 0;
  if (t >= tm.defKes && t < tm.sayac + 0.3) {
    dp.expr = IF.ciddi;
    dGoster = pIn(t, tm.ortadaki - 0.25, tm.nasil - 0.05, 0.28, 0.25);
    const gu = lerp(0.3, 0.7, 0.5 + 0.5 * Math.sin(TAU * (t - tm.ortadaki) / 1.4 - Math.PI / 2));
    if (dGoster > 0.01) dO.R = [tp(gu, 0.12), dGoster, 'A'];
    dp.head.look = t < tm.ortadaki ? [-0.05, 0.05] : t < tm.nasil ? bak('defne', dp, tp(0.5, 0.15)) : [0, 0];
    if (t >= tm.nasil - 0.05) H.omuzSilk(dp, t, tm.nasil, Math.max(0.2, tm.d2s - tm.nasil - 0.25));   // sol el mezurada kalır
  }
  // sayaç: mezurayı çekip şeride bakar, geri sarar; sonra tepsiye ve Hikmet'e bakar
  if (sayacta) {
    const c0 = tm.cd0; dp.expr = IF.dusun;
    dp.head.look = t < c0 + 3 ? bak('defne', dp, tp(0.75, 0.2)) : [0, 0];
    const u = pIn(t, tm.mezG, tm.mezB, 0.45, 0.35);
    if (u > 0.01) {
      const a = [mezKutu[0] + 30, mezKutu[1]];
      mezSerit = [a, [a[0] + 190 * u, a[1] + 6 * u]];
      dO.R = [[mezSerit[1][0] - 4, mezSerit[1][1] + 6], W(t, tm.mezG - 0.25, 0.25) * (1 - W(t, tm.mezB + 0.2, 0.3)), 'A'];
      dp.head.look = bak('defne', dp, mezSerit[1]);
    }
    if (t >= tm.mezB + 0.5) dp.head.look = Math.floor((t - tm.mezB) / 1.6) % 2 ? bak('defne', dp, HEAD('hikmet')) : bak('defne', dp, ORTA);
    dp.head.tilt = 4 * Math.sin(TAU * (t - c0) / 3.1);
    if (ipucu) { dp.expr = IF.merak; dp.head.look = t < tm.gerisi ? bak('defne', dp, tp(0.35, 0.05)) : bak('defne', dp, HEAD('hikmet')); }
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; dO.R = [tp(0.6, 0.1), W(t, tm.cevap, 0.3), 'A']; }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Kerem (sağda): beş tabak ———
  const kp = H.kisi('genc', { x: yer('genc'), y: Y.genc, s: H.BOY.genc * SK, expr: IF.notr, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const kO = { heads, sessiz: true };
  const tIn = ease.state(seg(t, tm.tabakIn, 0.4));
  const yigin = t < tm.tabakIn + 0.4 ? kar(TABAK_EL, TABAK_MASA, tIn) : TABAK_MASA;
  const tabakEl = t < tm.tabakIn + 0.4;
  const wTb = tabakEl ? 1 : 1 - W(t, tm.tabakIn + 0.4, 0.3);
  if (wTb > 0.01) { kO.L = [[yigin[0] - 58, yigin[1] - 18], wTb, 'A']; kO.R = [[yigin[0] + 58, yigin[1] - 18], wTb, 'A']; }
  kp.head.look = t < tm.tabakIn + 0.4 ? bak('genc', kp, yigin) : bak('genc', kp, HEAD('hikmet'));
  if (t >= tm.ustKes) kp.head.look = bak('genc', kp, ORTA);
  // sayaç: üstteki tabağı alıp bakar, geri koyar
  let ustTabak = null;
  if (sayacta) {
    kp.expr = IF.dusun;
    const u = ease.enter(seg(t, tm.kTabak, 0.4)), d = ease.state(seg(t, tm.kTabakB, 0.35));
    if (t >= tm.kTabak && t < tm.kTabakB + 0.35) ustTabak = kar(kar([TABAK_MASA[0], TABAK_MASA[1] - 52], [812, 984], u), [TABAK_MASA[0], TABAK_MASA[1] - 52], d);
    const wK = pIn(t, tm.kTabak - 0.28, tm.kTabakB + 0.35, 0.28, 0.3);
    if (wK > 0.01 && ustTabak) kO.R = [[ustTabak[0] + 56, ustTabak[1] - 4], wK, 'A'];
    else if (wK > 0.01) kO.R = [[TABAK_MASA[0] + 56, TABAK_MASA[1] - 56], wK, 'A'];
    kp.head.look = ustTabak ? bak('genc', kp, ustTabak) : Math.floor((t - tm.cd0) / 1.9) % 2 ? bak('genc', kp, ORTA) : bak('genc', kp, HEAD('defne'));
    if (ipucu) kp.head.look = bak('genc', kp, tp(0.4, 0.05));
  }

  // ——— Çizim: karakterler → masa → tepsi → tabaklar → nesneler → tutan eller ———
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  const kc = oyna(K, t, tlTum, 'genc', kp, kO);
  masa(K);
  tepsi(K, { ox, serit, ortaKirmizi: ortaK });
  for (const [k, p, O] of [['hikmet', hp, hO], ['necmi', np, nO], ['defne', dp, dO], ['genc', kp, kO]]) onKol(K, k, p, O);
  tabaklar(K, yigin, ustTabak ? 4 : 5, ustTabak);
  if (mezSerit) mezuraSerit(K, mezSerit[0], mezSerit[1], 16);
  mezuraKutu(K, mezKutu, 0.9);
  bicak(K, bc);
  // tutan eller (nesnenin üstünde)
  if (wTep > 0.5) hc.tut('R');
  if (wTek > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -0.35, boy: 0.9 });
  if (hKenar > 0.6) hc.isaret('R', tp(lerp(0.08, 0.36, ease.state(seg(t, tm.kenarin, Math.max(0.3, tm.revaniH - tm.kenarin - 0.2)))), 0.03));
  if (hEsit > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -0.35, boy: 0.9 });
  if (hParmak > 0.6) hc.isaret('R', hO.R[0]);
  if (bElde) nc.tut('L');
  dc.tut('L');
  if (mezSerit && dO.R) dc.tut('R');
  if (dGoster > 0.6) dc.isaret('R', dO.R[0]);
  if (wTb > 0.5) { kc.tut('L'); kc.tut('R'); }
  if (ustTabak) kc.tut('R');
  if (id === 'cevap') dc.parmak('R', 1, { toplam: 1, yon: Math.PI / 2 + 0.6, boy: 1 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
