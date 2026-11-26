// Bölüm 77 · ASMA KÖPRÜ BEKÇİSİ (v4 "hikâye" dili, kısa set, cevapsız tasarım; storyboard: hikayeler/bolum_077_v5.md).
// Mekanizma: bekçi yalnızca yürüme yönüne bakar; Necmi köye doğru üç dakikadan biraz az yürür, döner, bekçi çıktığında
// mesireye yürüyor görünür ve "geldiği tarafa" (köye) yollanır.
// Logline: Necmi dün mesirede saati kaçırır; akşam yediden sonra asma köprüden geçmek yasak. Köy tarafındaki yeni bekçi
// kimseyi tanımaz, soru sormaz, üç dakikada bir çıkıp bakar, hemen girer; köprüde gördüğünü geldiği tarafa geri yollar.
// Köprü sallanır, koşulmaz, karşıya ancak beş dakikada yürünür. Hikmet sorar: Necmi o akşam köye nasıl geçti?
// Akılda kalacak tek şey: bekçi nereden geldiğini sormuyor, yalnızca bakıyor.
// Sızıntı yasağı: Necmi köprüde hiçbir karede dönmez, köprünün içine iki tahtadan fazla girmez; köprünün ortasında işaret,
// tabela, renk değişimi yok (tahtalar, halatlar ve askılar eşit aralıklı; kıyılar farklı yükseklikte, en alçak nokta ortada
// değil). Yanlış deneme: Necmi köprüye adım atar, karşıda bekçinin kapısı açılır, Necmi geri çekilir (iki kez).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180, TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const I = M.ISIK.aksam;

// ═══════════════════════════ Figüran: köprü bekçisi ═══════════════════════════
// Gencin iskeletinden (uzun, ince); 30'larında, köye yeni gelmiş. Arduvaz grisi üniforma ceketi, altında beyaz gömlek
// yakası, göğüste sarı düdük kordonu; koyu pantolon, kara bot; kalın kara bıyık; başında siperli kasket (pirinç rozetli).
// Elinde fener. Siluet: kasket + fener. Konuşmaz.
const BEK = 'b077_bekci';
if (!H.CARDS[BEK]) {
  const b = H.CARDS.genc;
  H.CARDS[BEK] = {
    ...b, key: BEK, name: 'Bekçi', role: 'köprü bekçisi', seed: 771,
    head: { w: 0.9, h: 1, ear: 0.12 }, neck: 0.08,
    torso: { ...b.torso, len: 0.9, shoulder: 0.7, hip: 0.6, depth: 0.44, belly: 0.03, color: '#56676A', shade: '#45555A' },
    arm: { ...b.arm, color: '#56676A', shade: '#45555A' },
    leg: { ...b.leg, color: '#2F3A3D', shade: '#252E30' },
    shoe: { ...b.shoe, color: '#1E1A17' },
    skin: '#D19C74', skinShade: '#B8835C', hair: '#2E2520',
    eyes: { gap: 0.33, w: 0.17, h: 0.2, y: 0.05, lid: 0.2 }, line: 0.05, idle: { blink: [2.7, 5.4] },
    features: ['vest', 'baldSides', 'mustacheThick'],
    kasket: '#3E4A4C', kasketKoyu: '#2A3335',
  };
}
const S_BEK = 205;

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz, açık durmaz)
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 0.85, pupil: 1, curve: 0.6, open: 0, w: 1.15 };
const NGULUS = { brow: 0.03, browTilt: -0.1, eye: 0.9, pupil: 1, curve: 0.38, open: 0, w: 1.1 };
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const TEDIRGIN = { brow: 0.08, browTilt: -0.3, eye: 1.12, pupil: 0.85, curve: -0.22, open: 0, w: 0.75 };
const BOS = { brow: 0.02, browTilt: 0.05, eye: 0.88, pupil: 1, curve: -0.04, open: 0, w: 0.8 };
const SERT = { brow: -0.01, browTilt: 0.3, eye: 0.95, pupil: 0.95, curve: -0.16, open: 0, w: 0.85 };

// ═══════════════════════════ Nesneler ═══════════════════════════
// Kasket: başın yerel çerçevesinde (birim: baş yüksekliği), drawChar'dan SONRA (yalnız önden görünüş)
function kasket(K, p) {
  const c = H.CARDS[BEK], hd = H.eklem(BEK, p, 'head'), { ctx } = K;
  ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate((p.head.tilt || 0) * D2R); ctx.scale(p.s, p.s); ctx.translate(0, (p.head.nod || 0) * 0.055);
  const lw = 0.026;
  ctx.beginPath(); ctx.moveTo(-0.5, -0.24); ctx.bezierCurveTo(-0.58, -0.56, -0.36, -0.72, 0, -0.72); ctx.bezierCurveTo(0.36, -0.72, 0.58, -0.56, 0.5, -0.24); ctx.closePath();
  ctx.fillStyle = c.kasket; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.rect(-0.5, -0.33, 1.0, 0.09); ctx.fillStyle = c.kasketKoyu; ctx.fill(); ctx.stroke();                  // band
  ctx.beginPath(); ctx.ellipse(0, -0.47, 0.085, 0.085, 0, 0, TAU); ctx.fillStyle = '#D9A93A'; ctx.fill(); ctx.lineWidth = lw * 0.7; ctx.stroke();   // pirinç rozet
  ctx.beginPath(); ctx.moveTo(-0.46, -0.24); ctx.quadraticCurveTo(0, -0.1, 0.46, -0.24); ctx.lineTo(0.42, -0.2); ctx.quadraticCurveTo(0, -0.04, -0.42, -0.2); ctx.closePath();
  ctx.fillStyle = c.kasketKoyu; ctx.fill(); ctx.lineWidth = lw; ctx.stroke();                                                  // siper
  ctx.restore();
}
// Fener: (x, y) sapın tutulduğu nokta (el); k ölçek (1 ≈ yakın plan). Alev döngüsü; ışık düz renkli çokgen (parlama yok).
function fener(K, [x, y], k, t, { isik = 1 } = {}) {
  const { ctx } = K, lw = Math.max(1.2, LW * 0.7 * k);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (isik > 0.01) { ctx.save(); ctx.globalAlpha = 0.16 * isik; K.poly([[-26, 40], [26, 40], [120, 230], [-120, 230]], '#F8D07E', 0); ctx.restore(); }
  ctx.beginPath(); ctx.arc(0, 6, 15, Math.PI, 0); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();   // sap
  K.poly([[-20, 6], [20, 6], [26, 22], [-26, 22]], '#3A4442', lw / k);                     // üst kapak
  K.rect(-22, 22, 44, 62, '#F6E3A0', lw / k, 6);                                            // cam
  K.line(-22, 22, -22, 84, lw / k); K.line(22, 22, 22, 84, lw / k);
  ctx.restore();
  H.alev(K, x, y + 70 * k, 0.42 * k, t, { i: 3, guc: 1 });
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.rect(-28, 84, 56, 14, '#3A4442', lw / k, 4);                                            // taban
  ctx.restore();
}
// Kum saati: (x, y) orta; h boy; rot açı (rad); ust: üst haznedeki kum (0..1); akar: kum ipliği
function kumSaati(K, [x, y], h, rot, ust, t, { akar = true } = {}) {
  const { ctx } = K, w4 = h * 0.52 * 0.42, H0 = h * 0.42, g = h * 0.06;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const cam = [[-w4, -H0], [w4, -H0], [g, 0], [w4, H0], [-w4, H0], [-g, 0]];
  K.poly(cam, '#E8F0EC', LW * 0.6);
  const kum = '#D9A24A', u = clamp01(ust), alt = 1 - u;
  if (u > 0.02) { const q = Math.sqrt(u), hh = H0 * q, wl = g + (w4 - g) * q; K.poly([[-wl, -hh], [wl, -hh], [g * 0.7, -2], [-g * 0.7, -2]], kum, 0); }
  if (alt > 0.02) { const b = H0 * (1 - Math.sqrt(1 - alt * 0.92)), wb = w4 - (w4 - g) * (b / H0); K.poly([[-w4, H0], [w4, H0], [wb, H0 - b], [0, H0 - b - h * 0.05], [-wb, H0 - b]], kum, 0); }
  if (akar && u > 0.02 && alt < 0.98) K.line(0, 0, 0, H0 * (1 - 0.9 * (1 - Math.sqrt(1 - alt * 0.92))), Math.max(2, h * 0.025 * (1 + 0.25 * Math.sin(t * 31))), kum);
  K.poly(cam, null, LW * 0.6);
  K.rect(-w4 * 1.3, -h * 0.5, w4 * 2.6, h * 0.09, '#7A4A2A', LW * 0.6, 4); K.rect(-w4 * 1.3, h * 0.41, w4 * 2.6, h * 0.09, '#7A4A2A', LW * 0.6, 4);
  for (const sx of [-1, 1]) K.line(sx * w4 * 1.12, -H0, sx * w4 * 1.12, H0, Math.max(3, h * 0.04), '#7A4A2A');
  ctx.restore();
}
// Cep saati (Necmi'nin): (x, y) merkez, r yarıçap; acik: kapak (0 kapalı, 1 açık); ibreler 19.05'i gösterir, saniye ibresi döner
function cepSaati(K, [x, y], r, acik, t, { zincir = null } = {}) {
  const { ctx } = K, lw = Math.max(2, r * 0.09);
  if (zincir) { ctx.save(); ctx.beginPath(); ctx.moveTo(x, y - r * 1.1); ctx.quadraticCurveTo((x + zincir[0]) / 2, Math.max(y, zincir[1]) + r * 1.2, zincir[0], zincir[1]); ctx.lineWidth = Math.max(2, r * 0.12); ctx.strokeStyle = '#B8892A'; ctx.setLineDash([r * 0.18, r * 0.1]); ctx.stroke(); ctx.restore(); }
  K.circ(x, y - r * 1.08, r * 0.2, '#D9A93A', lw * 0.8);                                     // kurma düğmesi
  const a = clamp01(acik);
  if (a > 0.02) {   // kapak yukarı açılır (üstte ince elips)
    const kh = r * (1 - a * 0.82);
    K.ell(x, y - r - kh * 0.98 * a, r, Math.max(r * 0.18, kh), '#C99A32', lw);
  }
  K.circ(x, y, r, '#D9A93A', lw);
  if (a > 0.3) {
    K.circ(x, y, r * 0.8, '#FBF6EC', lw * 0.7);
    for (let i = 0; i < 12; i++) { const q = i * TAU / 12; K.line(x + Math.sin(q) * r * 0.62, y - Math.cos(q) * r * 0.62, x + Math.sin(q) * r * 0.72, y - Math.cos(q) * r * 0.72, Math.max(1.5, r * 0.05)); }
    const hq = (7 + 5 / 60) / 12 * TAU, mq = 5 / 60 * TAU, sq = (Math.floor(t) % 60) / 60 * TAU;
    K.line(x, y, x + Math.sin(hq) * r * 0.42, y - Math.cos(hq) * r * 0.42, Math.max(2.5, r * 0.1));
    K.line(x, y, x + Math.sin(mq) * r * 0.6, y - Math.cos(mq) * r * 0.6, Math.max(2, r * 0.07));
    K.line(x, y, x + Math.sin(sq) * r * 0.66, y - Math.cos(sq) * r * 0.66, Math.max(1.2, r * 0.03), PAL.coral);
    K.circ(x, y, r * 0.07, INK, 0);
  } else { K.circ(x, y, r * 0.62, null, lw * 0.5); }
}
// Çay bardağı: (x, yb) taban
function bardak(K, x, yb, { k = 2, buhar = false, t = 0 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], '#A8401F', 2.4 / k * 1.45);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 36 * k, t, { k: 0.38, n: 2, ara: 9, boy: 56 });
}
// Kuşlar (döngü): iki kuş gökte süzülür
function kuslar(K, t, x0, x1, y, yon = 1, k = 1) {
  const w = x1 - x0 + 300;
  for (let i = 0; i < 2; i++) {
    const v = 40 + 12 * i, u = ((t * v + i * 520) % w + w) % w, x = yon > 0 ? x0 - 150 + u : x1 + 150 - u, kk = (1 - 0.25 * i) * k, kn = Math.sin(t * 6 + i);
    const yy = y + i * 70 + 10 * Math.sin(t * 1.2 + i * 2), a = 12 * kk * (1 + 0.35 * kn);
    K.ctx.beginPath(); K.ctx.moveTo(x - 20 * kk, yy + 4 * kn * kk); K.ctx.quadraticCurveTo(x - 9 * kk, yy - a, x, yy); K.ctx.quadraticCurveTo(x + 9 * kk, yy - a, x + 20 * kk, yy + 4 * kn * kk);
    K.ctx.lineWidth = 4; K.ctx.strokeStyle = INK; K.ctx.stroke();
  }
}
// Kapı (kanat izleyiciye açılır, menteşe sağda): içi, içindeki (fn), kanat. acik 0..1
function kapiCiz(K, x, y, w, h, acik, { ic = '#F4CF7A', renk = '#7A4A2A', icinde = null, lw = LW, cerceve = '#5A3A22' } = {}) {
  const a = clamp01(acik) * 80 * D2R, kw = w * Math.cos(a), sk = Math.sin(a), xh = x + w, xf = xh - kw;
  K.rect(x - w * 0.09, y - w * 0.09, w * 1.18, h + w * 0.09, cerceve, lw);
  K.rect(x, y, w, h, ic, lw);
  if (acik > 0.01) { K.ctx.save(); K.ctx.beginPath(); K.ctx.rect(x, y, w, h); K.ctx.clip(); K.line(x, y + h * 0.62, x + w, y + h * 0.62, lw * 0.6, '#D9B260'); K.ctx.restore(); }
  if (icinde) icinde();
  K.poly([[xh, y], [xf, y - h * 0.035 * sk], [xf, y + h + h * 0.03 * sk], [xh, y + h]], H.mixHex(renk, INK, 0.15 * sk), lw);
  if (kw > w * 0.3) { K.line(xf + kw * 0.14, y + h * 0.12, xf + kw * 0.86, y + h * 0.12, lw * 0.5); K.line(xf + kw * 0.14, y + h * 0.5, xf + kw * 0.86, y + h * 0.5, lw * 0.5); K.circ(xf + kw * 0.16, y + h * 0.56, Math.max(2, w * 0.05), PAL.mustard, lw * 0.6); }
}

// ═══════════════════════════ Mekân 1: vadi (perspektif; mesire kıyısından köye bakış) ═══════════════════════════
// 3B: kamera başlangıçta, +Z ileri, +Y aşağı; ekran = 540 + F·X/Z, 960 + F·Y/Z (kamera 1x, merkez 540/960).
const VADI = 'b077_vadi';
const F = 900;
const A0 = [-0.45, 1.10, 1.9], A1 = [2.35, 0.86, 6.6];          // köprünün mesire ucu (alçak) ve köy ucu (yüksek)
const SAG = 0.34, YW = 0.2, RH = 0.56, NP = 46;                   // sehim, yarı genişlik, korkuluk halatı yüksekliği, tahta sayısı
const DXZ = [A1[0] - A0[0], A1[2] - A0[2]], DL = Math.hypot(...DXZ), NX = DXZ[1] / DL, NZ = -DXZ[0] / DL;   // +yan: sağ (kameraya yakın)
const P3 = ([X, Y, Z]) => [540 + F * X / Z, 960 + F * Y / Z];
const ZK = 1.9 / 191;                                             // kişi ölçeği: s = 1 / (ZK · Z) → Z = 1,9'da Necmi 191
const sZ = (key, Z) => H.BOY[key] / 225 * 191 * 1.9 / Z;
// Köprü salınımı: sürekli küçük salınım + adım atıldığında sönen büyük salınım (birim: 3B)
function salinim(t, S) {
  let a = 0.016 * Math.sin(TAU * t / 2.3);
  for (const e of S.tm.adimlar) a += 0.05 * H.sars(t, e, 1.9, 0.9);
  if (S.tm.sallan) a += 0.04 * H.sars(t, S.tm.sallan, 2.4, 0.8);
  return a;
}
function kNokta(u, yan, t, S, h = 0) {
  const a = salinim(t, S) * Math.sin(Math.PI * u);
  return [lerp(A0[0], A1[0], u) + yan * YW * NX + a, lerp(A0[1], A1[1], u) + 4 * SAG * u * (1 - u) - h, lerp(A0[2], A1[2], u) + yan * YW * NZ];
}
const kZ = (u, yan = 0) => lerp(A0[2], A1[2], u) + yan * YW * NZ;
const derin = Z => Math.max(1.1, 1.9 / Z);                        // çizgi kalınlığı çarpanı
function halat(K, t, S, yan, u0, u1, h, renk = '#5A4026', w0 = 7) {
  const n = Math.max(2, Math.ceil((u1 - u0) * 60));
  for (let i = 0; i < n; i++) {
    const ua = lerp(u0, u1, i / n), ub = lerp(u0, u1, (i + 1) / n);
    const hh = u => h * (1 - 0.18 * 4 * u * (1 - u));
    const a = P3(kNokta(ua, yan, t, S, hh(ua))), b = P3(kNokta(ub, yan, t, S, hh(ub))), d = derin(kZ((ua + ub) / 2, yan));
    K.line(a[0], a[1], b[0], b[1], Math.max(1.6, w0 * d), renk);
  }
}
function askilar(K, t, S, yan, u0, u1) {
  for (let i = 0; i <= NP; i += 2) {
    const u = i / NP; if (u < u0 - 1e-6 || u > u1 + 1e-6) continue;
    const hh = RH * (1 - 0.18 * 4 * u * (1 - u)), a = P3(kNokta(u, yan, t, S, hh)), b = P3(kNokta(u, yan, t, S, 0));
    K.line(a[0], a[1], b[0], b[1], Math.max(1.1, 3.2 * derin(kZ(u, yan))), '#6B4E30');
  }
}
const ACIL = 2.0;   // köprü başındaki direkler dışa açılır (yürüyenin önünü kesmez)
function direk(K, t, S, u, yan) {
  const y2 = u === 0 ? yan * ACIL : yan, Z = kZ(u, y2), a = P3(kNokta(u, y2, t, S, -0.22)), b = P3(kNokta(u, y2, t, S, RH + 0.12)), w = 0.05 * F / Z;
  if (u === 0) { const c = P3(kNokta(0.1, yan, t, S, RH * (1 - 0.18 * 4 * 0.09))); K.line(b[0], b[1] + w * 0.3, c[0], c[1], Math.max(1.6, 7 * derin(Z)), '#5A4026'); }
  K.poly([[a[0] - w, a[1]], [a[0] + w, a[1]], [b[0] + w, b[1]], [b[0] - w, b[1]]], '#7A5634', Math.max(1.6, 4 * derin(Z)));
  K.ell(b[0], b[1], w * 1.1, w * 0.5, '#8C6A44', Math.max(1.6, 3.5 * derin(Z)));
}
function tahtalar(K, t, S, uKes = 0) {   // arkadan öne
  for (let i = NP - 1; i >= 0; i--) {
    const ua = i / NP + 0.18 / NP, ub = (i + 1) / NP; if (ub < uKes) continue;
    const q = [kNokta(ua, -1, t, S), kNokta(ua, 1, t, S), kNokta(ub, 1, t, S), kNokta(ub, -1, t, S)].map(P3);
    K.poly(q, i % 3 === 1 ? '#9A7246' : '#A57B4C', Math.max(1.3, 3.6 * derin(kZ(ua))));
  }
}
// Uzak kulübe (köy ucu): cephe Z = 7,0; kapı açılır, bekçi kapının önünde (önden), elinde fener
const KUL = { X: 2.98, Z: 7.0, w: 1.15, h: 1.62, kx: 2.8, kw: 0.5, kh: 1.45 };
function uzakKulube(K, t, S, st) {
  const O = P3(A1), { ctx } = K; ctx.save(); ctx.translate(O[0], O[1]); ctx.scale(1.3, 1.3); ctx.translate(-O[0], -O[1]); uzakKulube0(K, t, S, st); ctx.restore();
}
function uzakKulube0(K, t, S, st) {
  const sc = F / KUL.Z, x0 = 540 + (KUL.X - KUL.w / 2) * sc, x1 = 540 + (KUL.X + KUL.w / 2) * sc, yb = 960 + A1[1] * sc, yt = yb - KUL.h * sc, lw = LW * 0.5;
  K.rect(x0, yt, x1 - x0, yb - yt, '#8C6A44', lw);
  for (let x = x0 + 14; x < x1; x += 16) K.line(x, yt + 3, x, yb - 3, 2, '#765635');
  K.poly([[x0 - 14, yt + 4], [x1 + 14, yt + 4], [(x0 + x1) / 2 + 6, yt - 64]], '#B5573F', lw);
  K.rect(x1 - 30, yt - 66, 16, 40, '#8E4632', lw);
  H.puf(K, x1 - 22, yt - 72, t, { k: 0.38, n: 3, periyot: 2.2, yon: -Math.PI / 2 + 0.4, yol: 70, kalk: 12, renk: '#E9E4DA' });
  K.rect(x1 - 52, yt + 46, 38, 40, '#F4CF7A', lw * 0.8, 3); K.line(x1 - 33, yt + 46, x1 - 33, yt + 86, 2);   // ışıklı pencere
  const kx = 540 + (KUL.kx - KUL.kw / 2) * sc, kw = KUL.kw * sc, kh = KUL.kh * sc;
  kapiCiz(K, kx, yb - kh, kw, kh, st.kapi, { lw: lw * 0.8, icinde: () => { if (st.bek) bekCiz(K, t, st.bek, st.fener, 0.24); } });
}
function bekCiz(K, t, b, fenerU, k) {   // bekçi (önden) + kasket + fener (sağ elde)
  const r = oyna(K, t, null, BEK, b.p, { sessiz: true, R: b.R, L: b.L });
  kasket(K, b.p);
  const fk = b.p.s / S_BEK; fener(K, [r.handR[0], r.handR[1] + 8 * fk], fk, t, { isik: fenerU });
  r.tut('R');
  if (b.isaret) r.isaret('L', b.isaret);
  return r;
}
function vadiArka(K, t, S) {
  const { ctx } = K;
  M.gok(K, -600, -600, 2300, 1700, { isik: I, gunes: 0.86, r: 70 });
  kuslar(K, t, -200, 1300, 620, 1, 0.9);
  // uzak tepeler ve köy
  const rnd = H.mulberry32(771);
  ctx.save(); ctx.fillStyle = H.mixHex(I.sehir, I.gok, 0.45); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-600, 1000); let x = -600; while (x < 1700) { const w = 220 + rnd() * 260, h = 60 + rnd() * 90; ctx.quadraticCurveTo(x + w / 2, 900 - h, x + w, 930 - rnd() * 30); x += w; }
  ctx.lineTo(1700, 1100); ctx.lineTo(-600, 1100); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  // köy: evler (ışıklı pencereler), minare
  const ev = [[640, 1040, 70, 56], [720, 1030, 60, 48], [1040, 1044, 80, 62], [1120, 1030, 70, 54], [1210, 1046, 90, 66], [990, 1010, 50, 40]];
  for (const [ex, ey, w, h] of ev) {
    K.rect(ex, ey - h, w, h, '#D8C29A', 3); K.poly([[ex - 6, ey - h + 2], [ex + w + 6, ey - h + 2], [ex + w / 2, ey - h - h * 0.5]], '#A9533C', 3);
    K.rect(ex + w * 0.3, ey - h * 0.62, w * 0.24, h * 0.3, '#F4CF7A', 2);
  }
  ctx.save(); ctx.fillStyle = '#D8C29A'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.rect(1170, 900, 14, 130); ctx.fill(); ctx.stroke(); ctx.restore();
  K.poly([[1166, 900], [1177, 872], [1188, 900]], '#A9533C', 3);
  // karşı kıyı (köy): ince zemin şeridi ve kayalık yar
  ctx.save(); ctx.fillStyle = H.mixHex('#86A862', '#6B5A3A', 0.35); ctx.beginPath(); ctx.moveTo(470, 1112); ctx.lineTo(860, 1082); ctx.lineTo(1700, 1050); ctx.lineTo(1700, 1110); ctx.lineTo(470, 1140); ctx.closePath(); ctx.fill(); ctx.restore();
  K.poly([[470, 1112], [860, 1082], [1700, 1050], [1700, 2400], [430, 2400]], '#8A6448', 4);
  K.poly([[430, 1420], [1700, 1380], [1700, 2400], [430, 2400]], '#6E5038', 0); K.poly([[430, 1760], [1700, 1730], [1700, 2400], [430, 2400]], '#5A4030', 0);
  for (const [y0, y1] of [[1180, 1150], [1290, 1250], [1520, 1480], [1640, 1600]]) K.line(470, y0 + 20, 1700, y1, 3, '#5A4030');
  for (const cx of [560, 700, 930, 1120, 1300]) K.line(cx, 1110 - (cx - 470) * 0.05, cx - 40, 1960, 3, '#4A3426');
  for (const [bx, by, r] of [[600, 1100, 26], [700, 1094, 20], [1010, 1072, 24], [1290, 1062, 28]]) K.circ(bx, by - r * 0.6, r, '#5E7A44', 3);
  K.line(470, 1112, 1700, 1050, LW * 0.7);
  // dere (döngü: akan çizgiler)
  // dere: vadinin dibinde dar, hızlı ve köpüklü (yürüyerek geçilecek bir su değil)
  K.poly([[430, 2000], [1700, 1975], [1700, 2400], [430, 2400]], '#4A3426', 0);
  K.poly([[430, 1992], [1700, 1968], [1700, 2040], [430, 2064]], '#3F6B69', 4);
  for (let r = 0; r < 3; r++) { const yy = 1990 + r * 22, sp = 120, o = ((t * (300 + r * 70)) % sp + sp) % sp; for (let xx = 430 - sp + o; xx < 1700; xx += sp) { const y2 = yy - (xx - 430) * 0.019; K.line(xx, y2, xx + 38, y2 - 3, 5, '#E9F1EE'); } }
  for (const [kx, ky] of [[560, 2010], [820, 2004], [1090, 1998], [1360, 1992]]) K.ell(kx, ky + 20, 34, 12, '#7A6A5A', 3);   // sudaki kayalar
}
function yakinKiyi(K, t) {   // mesire kıyısı: çimen, büyük ağaç (döngü: yapraklar), sepet
  const { ctx } = K, cim = H.mixHex('#86A862', '#6B5A3A', 0.25);
  K.poly([[430, 1528], [475, 1650], [520, 2400], [600, 2400], [540, 1700], [470, 1545]], '#6E5038', LW * 0.8);
  K.poly([[-600, 1320], [150, 1398], [330, 1468], [430, 1528], [475, 1650], [520, 2400], [-600, 2400]], cim, LW);
  const rnd = H.mulberry32(77); for (let i = 0; i < 40; i++) { const gx = -500 + rnd() * 900, gy = 1420 + rnd() * 460; if (gx > 300 + (gy - 1400) * 0.3) continue; K.line(gx, gy, gx - 7, gy - 20, 4, '#5E7A44'); K.line(gx, gy, gx + 8, gy - 17, 4, '#5E7A44'); }
  // ağaç (sol kenar)
  K.poly([[-110, 1360], [-30, 1360], [-40, 700], [-90, 700]], '#6B4A30', LW);
  for (let i = 0; i < 6; i++) { const a = 0.05 * Math.sin(t * 1.1 + i), cx = -60 + Math.cos(i * 1.1) * 150 + 18 * a * 10, cy = 600 + Math.sin(i * 1.7) * 90; K.circ(cx, cy, 120 - i * 6, i % 2 ? '#5E7A44' : '#6F8E50', LW); }
}
M.mekanEkle(VADI, { gen: [-600, 1700], dongu: ['köprünün salınması', 'akan dere', 'ağacın yaprakları', 'kuşlar', 'kulübe bacası', 'fener alevi'], kadraj: { genis: [1.0, 540, 975] } });

// ═══════════════════════════ Mekân 2: kulübe (köy ucu, yandan; yakın plan) ═══════════════════════════
const KULUBE = 'b077_kulube';
const KD = { x: 640, y: 740, w: 180, h: 760 };                     // kapı
const RAF = { x: 452, y: 1205, w: 80 };                             // kum saatinin rafı (kapının solunda)
const KUM = [RAF.x + RAF.w / 2, RAF.y - 52];                       // kum saatinin merkezi
const BEK_X = KD.x + KD.w / 2;
function kulubeArka(K, t) {
  const { ctx } = K;
  M.gok(K, -600, -600, 2400, 2000, { isik: I, gunes: 0.9, r: 66 });
  kuslar(K, t, -300, 1500, 480, -1, 1.1);
  ctx.save(); ctx.fillStyle = H.mixHex(I.sehir, I.gok, 0.45); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-600, 1100); ctx.quadraticCurveTo(-200, 880, 200, 960); ctx.quadraticCurveTo(600, 860, 1000, 940); ctx.quadraticCurveTo(1400, 860, 1800, 960); ctx.lineTo(1800, 1200); ctx.lineTo(-600, 1200); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  // yar ve vadi (sol): karşı kıyı uzakta, aşağıda dere
  K.poly([[-600, 1230], [-120, 1240], [-120, 1960], [-600, 1960]], '#8A6448', 4);
  K.poly([[-120, 1240], [300, 1500], [330, 1960], [-120, 1960]], '#6E5038', 4);
  K.poly([[-600, 1820], [330, 1820], [330, 1960], [-600, 1960]], '#4F7A78', 4);
  for (let r = 0; r < 2; r++) { const yy = 1850 + r * 50, sp = 170, o = ((t * (60 + r * 25)) % sp + sp) % sp; for (let xx = -600 - sp + o; xx < 330; xx += sp) K.line(xx, yy, xx + 50, yy, 4, '#9DBFB7'); }
  // köy kıyısı zemini
  K.poly([[300, 1500], [1900, 1500], [1900, 1960], [330, 1960]], H.mixHex('#BDB4A2', '#6B5A3A', 0.15), LW);
  for (const dy of [70, 190, 360]) K.line(330, 1500 + dy, 1900, 1500 + dy, 3, '#A39A88');
  // kulübe
  K.rect(420, 640, 660, 860, '#8C6A44', LW);
  for (let x = 460; x < 1080; x += 46) K.line(x, 650, x, 1490, 3, '#765635');
  K.rect(960, 470, 64, 150, '#8E4632', LW * 0.8);
  H.puf(K, 992, 462, t, { k: 1, n: 3, periyot: 2.2, yon: -Math.PI / 2 + 0.4, yol: 120, kalk: 20, renk: '#E9E4DA' });
  K.poly([[370, 660], [1130, 660], [750, 430]], '#B5573F', LW);
  for (let y = 500; y < 660; y += 34) K.line(750 - (y - 430) * 1.65, y, 750 + (y - 430) * 1.65, y, 3, '#96442F');
  // ışıklı pencere: içeride çaydanlık (döngü: buhar)
  K.rect(870, 930, 150, 190, '#F4CF7A', LW, 4);
  K.poly([[915, 1110], [975, 1110], [985, 1060], [905, 1060]], '#3A4442', 3);
  K.ell(945, 1050, 30, 18, '#B5573F', 3); K.line(972, 1044, 998, 1030, 5);
  H.buhar(K, 945, 1020, t, { k: 0.3, n: 2, ara: 10, boy: 50 });
  K.line(945, 930, 945, 1120, LW * 0.8); K.rect(860, 1120, 170, 18, '#765635', LW * 0.8, 3);
  // raf
  K.rect(RAF.x, RAF.y, RAF.w, 14, '#765635', LW * 0.7, 3); K.poly([[RAF.x + 10, RAF.y + 14], [RAF.x + 24, RAF.y + 14], [RAF.x + 14, RAF.y + 50]], '#765635', LW * 0.5);
}
function kopruUcuYan(K, t, S, on) {   // köprünün köy ucu (yandan): korkuluk halatı, askılar, tahta kenarı, direkler
  const sw = salinim(t, S) * 120, deck = x => 1492 + (x < 300 ? (300 - x) * 0.09 : 0) + sw * clamp01((300 - x) / 600) * 0.3;
  const rail = x => deck(x) - 250;
  if (!on) {
    for (let x = -600; x < 300; x += 36) K.line(x, rail(x), x, deck(x), 3, '#6B4E30');
    K.line(-600, rail(-600), 300, rail(300), 9, '#5A4026');
    K.rect(260, 1150, 28, 360, '#7A5634', LW * 0.8, 4);
    return;
  }
  K.poly([[-600, deck(-600) - 14], [320, deck(320) - 14], [320, deck(320) + 10], [-600, deck(-600) + 10]], '#A57B4C', LW * 0.8);
  for (let x = -580; x < 320; x += 40) K.line(x, deck(x) - 14, x, deck(x) + 10, 3, '#7A5634');
  K.line(-600, rail(-600) + 22, 310, rail(310) + 22, 10, '#5A4026');
  K.rect(296, 1130, 34, 380, '#7A5634', LW * 0.8, 4); K.ell(313, 1130, 20, 9, '#8C6A44', LW * 0.6);
}
M.mekanEkle(KULUBE, { gen: [-600, 1900], dongu: ['kum saatinin kumu', 'baca dumanı', 'çaydanlık buharı', 'fener alevi', 'kuşlar', 'dere'], kadraj: { yakin: [1.3, 650, 1060] } });

// ═══════════════════════════ Mekân 3: ofis (sabah) ═══════════════════════════
const OFIS = 'b077_ofis';
const DEF_X = 330, HIK_X = 720, NEC_X = 1160;
function dolapCiz(K, t) {   // dosya dolabı ve saksı (döngü: yapraklar)
  K.rect(-120, 1060, 250, 440, '#9AA39C', LW, 6);
  for (const y of [1100, 1240, 1380]) { K.rect(-100, y, 210, 120, '#AEB6AF', LW * 0.6, 4); K.rect(-30, y + 46, 70, 16, '#6E7570', LW * 0.5, 6); }
  K.poly([[-60, 1060], [60, 1060], [46, 960], [-46, 960]], PAL.coral, LW);
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.3 + 0.05 * Math.sin(t * 1.3 + i); H.yaprak(K, 0, 964, 140 + 26 * (i % 2), a, PAL.green, 1); }
}
M.mekanEkle(OFIS, {
  gen: [-300, 1700], dongu: ['duvar saatinin saniye ibresi', 'pencerede kuş ve bulut', 'çay buharı', 'bitkinin yaprakları'],
  kadraj: { ikili: [1.28, 930, 1010], defne: [1.3, 520, 1010] },
  arka(K, t) {
    const S = M.ISIK.sabah;
    M.oda(K, { x0: -400, x1: 1800, isik: S, duvar: 'duz', zemin: 'ahsap' });
    M.pencere(K, 960, 640, 400, 440, { isik: S, t, gunes: 0.3, manzara: 'istanbul' });
    K.rect(930, 1080, 460, 26, PAL.trim, LW * 0.8, 6);
    M.duvarSaati(K, 480, 720, 62, 9.25 + t / 3600, t);
    dolapCiz(K, t);
    // askılık (Necmi'nin şapkası ve paltosu)
    K.rect(1520, 700, 22, 800, '#6B4A30', LW * 0.8); K.rect(1480, 1480, 100, 22, '#6B4A30', LW * 0.8, 6);
    K.poly([[1470, 760], [1590, 760], [1610, 1200], [1450, 1200]], '#7E8460', LW);
    K.ell(1530, 720, 70, 22, '#5A4A3A', LW * 0.8); K.rect(1495, 680, 70, 42, '#5A4A3A', LW * 0.8, 10);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    kacirdim: T('n0:3'), aksam: T('n0:4'), kopru0: T('n0:8'), yasak: T('n0:10'),
    ofis: T('h1') - 0.02, bekci: T('h1:2'), yeni: T('h1:3'), kimse: T('h1:4'), soru: T('h1:6'),
    uc: T('d1') - 0.08, kulube: T('d1:3') - 0.04, bakiyor: T('d1:4'), hemen: T('d1:5'), giriyor: T('d1:6'),
    kopru: T('d1:7') - 0.04, birini: T('d1:8'), geldigi: T('d1:10'), geri: T('d1:12'),
    n0b: T('n0b'), salla: T('n0b:1'), kosul: T('n0b:2'), karsiya: T('n0b:3'), bes: T('n0b:5'), yurun: T('n0b:7'),
    hikmet: T('h3') - 0.04, nasil: T('h3:4'),
    sayac: cd0 - 0.05, say2: cd0 + 3.35, say3: cd0 + 6.75,
    n1: T('n1'), sormuyor: T('n1:3'), yalniz: T('n1:4'), bakiyor2: T('n1:5'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  // ——— denemeler (vadi): Necmi köprüye adım atar → karşıda kapı açılır → bekçi çıkar, fenerini kaldırır, geri gösterir → Necmi geri çekilir ———
  const deneme = t0 => ({ adim: t0, kapi: t0 + 0.5, cik: t0 + 0.62, fener: t0 + 0.8, gos: t0 + 1.1, geri: t0 + 1.45, gosB: t0 + 2.0, gir: t0 + 2.2, kapan: t0 + 2.45 });
  tm.d1 = deneme(tm.kopru + 0.06);
  tm.d1.gos = Math.max(tm.d1.gos, tm.geldigi - 0.1); tm.d1.geri = tm.geri - 0.25; tm.d1.gosB = tm.geri + 0.35; tm.d1.gir = tm.d1.gosB + 0.15; tm.d1.kapan = tm.d1.gir + 0.25;
  tm.d2 = deneme(tm.sayac + 0.35);
  tm.ust = tm.d1.kapan + 0.12;                                       // n0b: Necmi yeniden köprüye çıkar
  tm.adimlar = [tm.d1.adim + 0.35, tm.ust + 0.35, tm.d2.adim + 0.35];
  tm.sallan = tm.salla + 0.02;
  // kanca: bekçi kapıda, fener yukarıda; "Akşam"dan sonra içeri girer
  tm.k0gir = tm.aksam + 0.45; tm.k0kapan = tm.k0gir + 0.25;

  const film = H.sahneler([
    { id: 'kanca', mekan: VADI, dis: true, t0: 0, cam: [[0, 1.0, 545, 1110], [tm.ofis - 0.1, 1.05, 525, 1105]] },
    { id: 'ofis', mekan: OFIS, t0: tm.ofis, cam: [[0, 1.26, 540, 1010], [tm.uc, 1.28, 470, 1010]] },
    { id: 'kulube', mekan: KULUBE, dis: true, kisa: true, t0: tm.kulube, cam: [[0, 1.3, 610, 1060]] },
    { id: 'kopru', mekan: VADI, dis: true, t0: tm.kopru, cam: [[0, 1.0, 545, 1110]] },
    { id: 'yakin', mekan: VADI, dis: true, kesme: false, t0: tm.ust - 0.1, cam: [[0, 1.0, 545, 1110], [tm.ust + 0.5, 1.4, 370, 1150], [tm.hikmet - 0.1, 1.44, 362, 1150]] },
    { id: 'hikmet', mekan: OFIS, t0: tm.hikmet, cam: [[0, 1.32, 930, 1000]] },
    { id: 'sayac', mekan: VADI, dis: true, t0: tm.sayac, cam: [[0, 1.0, 520, 1240]] },        // doğrusal itme kamera() ile
    { id: 'say2', mekan: OFIS, t0: tm.say2, cam: [[0, 1.28, 930, 1010]] },
    { id: 'say3', mekan: OFIS, t0: tm.say3, kesme: false, cam: [[0, 1.28, 930, 1010]] },      // Defne'ye kayar (kesmesiz)
    { id: 'buldum', mekan: OFIS, t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.36, 420, 990]] },
    { id: 'cevap', mekan: OFIS, t0: tm.cevap, kesme: false, cam: [[0, 1.3, 520, 1000]] },
    { id: 'cta', mekan: OFIS, t0: tm.cta, kesme: false, cam: [[0, 1.34, 440, 990]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— ofis pozları (önden) ———
  const defBase = H.kisi('defne', { x: DEF_X, expr: MERAK, head: { tilt: 3, look: [0.75, -0.1] }, ...POZ.dur });
  const def = [
    [tm.uc - 0.2, { expr: 'notr', head: { tilt: -3, look: [0.55, -0.05] } }, 0.3],
    [tm.say3, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -5, look: [0.3, -0.5] } }, 0.01],
    [tm.say3 + 1.6, { head: { tilt: 4, look: [0.6, -0.4] } }, 0.4],
    [tm.n1 - 0.3, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -2, look: [0.55, 0] } }, 0.3],
    [tm.yalniz - 0.1, { head: { tilt: 3, look: [0.1, 0.05] } }, 0.3],
    [tm.n1s + 0.35, { expr: GULUS, head: { tilt: -3, look: [0.3, 0.05] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.7, -0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -4, look: [0.05, 0.05] } }, 0.3],
  ];
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'notr', head: { tilt: -3, look: [-0.6, -0.05] }, ...POZ.dur });
  const hik = [
    [tm.uc - 0.2, { expr: MERAK, head: { tilt: 4, look: [-0.8, 0.0] } }, 0.3],
    [tm.hikmet, { expr: 'notr', head: { tilt: 3, look: [0.75, -0.1] } }, 0.01],
    [tm.say2, { expr: IFADE.dusun2, head: { tilt: 4, look: [-0.2, -0.55] } }, 0.01],
    [tm.say2 + 2.2, { expr: SASKIN, head: { tilt: -4, look: [-0.4, -0.4] } }, 0.3],
    [tm.say3 + 1.0, { expr: IFADE.dusun2, head: { tilt: 3, look: [-0.8, -0.1] } }, 0.4],
    [tm.yalniz, { expr: MERAK, head: { tilt: -3, look: [-0.85, 0] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: NGULUS, head: { tilt: -3, look: [-0.75, -0.05] }, ...POZ.dur });
  const nec = [
    [tm.say2, { expr: GULUS, head: { tilt: 3, look: [-0.3, 0.2] } }, 0.01],
    [tm.say2 + 1.5, { expr: NGULUS, head: { tilt: -3, look: [-0.75, -0.1] } }, 0.35],
  ];
  // Altyazı çizelgesi (yalnız balon): n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar ekranda kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.3 } : l) };
  return { tm, film, tlA, defBase, def, hikBase, hik, necBase, nec };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç perdesi sahneyi örtmesin)
  split: { n0: 4, d1: 7, n0b: 3 },
  kuyruksuz: (t, B) => !!B.sc.dis,
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id, lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
    if (id === 'sayac') Object.assign(cam, { zoom: lg(1.0, 1.05, clamp01((t - tm.sayac) / 3.4)), cx: 520, cy: 1240 });
    else if (id === 'say2') Object.assign(cam, { zoom: lg(1.28, 1.34, clamp01((t - tm.say2) / 3.4)), cx: 930, cy: 1010 });
    else if (id === 'say3') {   // 0,8 sn'de Defne'ye kayar, sonra kesime kadar doğrusal itme
      const u = ease.state(seg(t, tm.say3, 0.8)), z = lg(1.28, 1.4, clamp01((t - tm.say3 - 0.8) / (tm.buldum - tm.say3 - 0.8)));
      Object.assign(cam, { zoom: z, cx: lerp(930, 520, u), cy: 1010 });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    // "5 dk": Necmi'nin cep saatinin yanında (n0b, yakın plan); yeri sabit
    H.tag(K, t, tm.bes - 0.04, tm.hikmet - 0.25, [846, 1004], '5 dk', PAL.mustard, INK, 48);
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (067/071'den): perde yok, alt bantta. Daire solda, başlık ve paylaşım hapı sağında.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1320, r = 80;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 25, 70, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(596, 1272); ctx.scale(inU * out, inU * out);
  ctx.font = '900 52px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 64;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 19, 52, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(596, 1366); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56;
    K.rect(-sw / 2 + 8, -40 + 10, sw, 80, INK, 0, 40); K.rect(-sw / 2, -40, sw, 80, PAL.coral, LW, 40); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// ——— Dünya ———
function sahne(K, t, S, B) {
  if (B.sc.mekan === VADI) return vadiSahne(K, t, S, B);
  if (B.sc.mekan === KULUBE) return kulubeSahne(K, t, S, B);
  return ofisSahne(K, t, S, B);
}

// ——— Vadi: Necmi'nin durumu (tek kaynak) ———
// Kıyıda bekleyiş noktası (3B) ve köprünün ilk tahtaları; yürüyüş yan görünüşte, derinliğe göre ölçeklenir.
const KIYI = [-0.42, 1.10, 1.45], TAHTA = 0.045;
function necVadi(t, S, id) {
  const { tm } = S, key = 'necmi';
  const ilk = kNokta(TAHTA, 0, t, S);
  const yer = (q, Q0, Q1) => { const X = lerp(Q0[0], Q1[0], q), Y = lerp(Q0[1], Q1[1], q), Z = lerp(Q0[2], Q1[2], q); const [x, y] = P3([X, Y, Z]); return { x, y, s: sZ(key, Z), Z }; };
  // yürüyüş penceresi: [t0, t1, ileri(true)/geri]
  let yuru = null, kopruda = false;
  const D = id === 'sayac' ? tm.d2 : tm.d1;
  if (id === 'kopru' || id === 'sayac') {
    if (t >= D.adim && t < D.adim + 0.7) yuru = [D.adim, D.adim + 0.7, true];
    else if (t >= D.geri && t < D.geri + 0.6) yuru = [D.geri, D.geri + 0.6, false];
    else kopruda = t >= D.adim + 0.7 && t < D.geri;
  } else if (id === 'yakin') {
    if (t >= tm.ust && t < tm.ust + 0.7) yuru = [tm.ust, tm.ust + 0.7, true];
    else kopruda = t >= tm.ust + 0.7;
  }
  if (yuru) {
    const [a, b, ileri] = yuru, Lp = 170;
    const p = H.yuru(key, t, { t0: a, t1: b, x0: ileri ? 0 : Lp, x1: ileri ? Lp : 0, s: 191, geri: !ileri, poz: { expr: ileri ? TEDIRGIN : SASKIN, head: { tilt: 0, look: [0.6, -0.05] } } });
    const q = p.x / Lp, y = yer(q, KIYI, ilk);
    Object.assign(p, { x: y.x, y: y.y, s: y.s });
    if (!ileri) p.facing = 1;
    return { p, Z: y.Z, yan: true, kopruda: q > 0.5 };
  }
  if (kopruda) {
    const y = yer(1, KIYI, ilk);
    const korku = id !== 'yakin' && t >= D.kapi && t < D.geri + 0.1;
    const p = H.kisi(key, { view: 'side', facing: 1, x: y.x, y: y.y, s: y.s, expr: korku ? SASKIN : TEDIRGIN, head: { tilt: korku ? -4 : 2, look: [0.6, korku ? -0.15 : 0] }, armL: { sh: 8, el: 14 }, armR: { sh: 14, el: 18 } });
    return { p, Z: y.Z, yan: true, kopruda: true };
  }
  // kıyıda (önden)
  const y = yer(0, KIYI, ilk);
  const p = H.kisi(key, { x: y.x, y: y.y, s: y.s, expr: TEDIRGIN, head: { tilt: 3, look: [0.55, 0.25] }, ...POZ.dur });
  return { p, Z: y.Z, yan: false, kopruda: false };
}
// Bekçinin durumu (uzak kulübe): kapı, bekçi pozu, fener ışığı
function bekVadi(t, S, id) {
  const { tm } = S, sc = F / (KUL.Z - 0.05), x = 540 + KUL.kx * sc, y = 960 + A1[1] * sc, s = sZ('genc', KUL.Z - 0.05) * S_BEK / 232 * 1.04;
  const p = H.charBase(BEK, { x, y, s, expr: SERT, head: { nod: 0, tilt: 3, look: [-0.8, 0.15] }, ...POZ.dur });
  let kapi = 0, R = [H.elYeri(BEK, p, 'R', 'yukari'), 1, 'B'], L, isaret = null, var_ = false;
  if (id === 'kanca') { kapi = 1 - W(t, tm.k0gir + 0.05, 0.3); var_ = t < tm.k0kapan + 0.1; }
  else if (id === 'kopru' || id === 'sayac') {
    const D = id === 'sayac' ? tm.d2 : tm.d1;
    kapi = pIn(t, D.kapi, D.kapan, 0.25, 0.28); var_ = kapi > 0.02;
    const wF = W(t, D.fener, 0.25) * (1 - W(t, D.gir, 0.25));
    R = [kar(H.elYeri(BEK, p, 'R', 'asagi'), H.elYeri(BEK, p, 'R', 'yukari'), wF), 1, 'B'];
    const wG = pIn(t, D.gos, D.gosB, 0.25);                                         // "geldiği tarafa": sol kolu mesireyi gösterir
    if (wG > 0.01) { const sh = H.shoulder(BEK, p, 'L'); L = [[sh[0] - 0.95 * s, sh[1] + 0.2 * s], wG, 'B']; if (wG > 0.6) isaret = [sh[0] - 3 * s, sh[1] + 0.8 * s]; }
  }
  return { kapi, bek: var_ ? { p, R, L, isaret } : null, fener: 1 };
}
function vadiSahne(K, t, S, B) {
  const { tm } = S, id = B.sc.id;
  vadiArka(K, t, S);
  uzakKulube(K, t, S, bekVadi(t, S, id));
  // uzak (köy) direkleri ve sol halat
  direk(K, t, S, 1, -1); direk(K, t, S, 1, 1);
  askilar(K, t, S, -1, 0, 1); halat(K, t, S, -1, 0, 1, RH);
  yakinKiyi(K, t);
  tahtalar(K, t, S);
  askilar(K, t, S, 1, 0.1, 1); halat(K, t, S, 1, 0.1, 1, RH);
  direk(K, t, S, 0, -1);
  const n = necVadi(t, S, id), np = n.p;
  if (n.Z < 1.75 || id === 'yakin') { askilar(K, t, S, 1, 0, 0.1); halat(K, t, S, 1, 0, 0.11, RH); direk(K, t, S, 0, 1); }
  // Necmi: kanca ve n0b'de elinde cep saati; köprüdeyken elleri halatlarda
  const nO = {};
  let saat = null;
  if (id === 'kanca') {
    const el = [np.x + 0.55 * np.s, np.y - 1.28 * np.s];
    nO.R = [el, 1, 'A']; saat = { p: [el[0] + 0.04 * np.s, el[1] - 0.14 * np.s], r: 0.2 * np.s, acik: W(t, 0.28, 0.22) };
    // saate bakar (0–1,9), sonra köprüye ve karşıya bakar
    const bak = H.iz([[0, 0.45], [tm.aksam - 0.15, 0.85, 0.3]], t), asagi = H.iz([[0, 0.35], [tm.aksam - 0.15, -0.12, 0.3]], t);
    np.head = { ...np.head, look: [bak, asagi], tilt: lerp(6, -2, W(t, tm.aksam - 0.15, 0.3)) };
    if (t > tm.yasak) H.onayla(np, t, tm.yasak + 0.05, 1, 0.4);
  } else if (n.kopruda && n.yan) {
    const hR = P3(kNokta(TAHTA + 0.01, 1, t, S, RH * 0.95)), hL = P3(kNokta(TAHTA + 0.03, -1, t, S, RH * 0.95));
    const wS = id === 'yakin' ? 1 - W(t, tm.karsiya - 0.2, 0.28) : 1;
    nO.L = [hL, 1, 'A'];
    if (wS > 0.01) nO.R = [kar(H.elYeri('necmi', np, 'R', 'gogus'), hR, wS), 1, 'A'];
    if (id === 'yakin') {
      if (wS < 0.99) { const el = [np.x + 0.45 * np.s, np.y - 1.3 * np.s]; nO.R = [kar(hR, el, 1 - wS), 1, 'A']; if (wS < 0.4) saat = { p: [el[0] + 0.06 * np.s, el[1] - 0.14 * np.s], r: 0.2 * np.s, acik: W(t, tm.karsiya + 0.15, 0.2) }; }
      for (const a of [tm.kosul - 0.02, tm.kosul + 0.32]) np.head = { ...np.head, tilt: (np.head.tilt || 0) + 6 * Math.sin(TAU * seg(t, a, 0.34)) };   // "koşulmuyor": başını iki yana sallar
      if (t > tm.yurun) H.onayla(np, t, tm.yurun + 0.05, 1, 0.42);
      if (t > tm.bes - 0.2) np.head = { ...np.head, look: [0.5, 0.35] };
    }
  }
  const nc = oyna(K, t, null, 'necmi', np, { sessiz: true, ...nO });
  if (saat) { cepSaati(K, saat.p, saat.r, saat.acik, t); nc.tut('R'); }
  if (n.kopruda && n.yan) nc.tut('L');
  // öndeki (sağ) halat ve direk Necmi'nin önünden geçer
  if (n.Z >= 1.75 && id !== 'yakin') { askilar(K, t, S, 1, 0, 0.1); halat(K, t, S, 1, 0, 0.11, RH); direk(K, t, S, 0, 1); }
}

// ——— Kulübe (yakın plan): bekçi kapıda; çıkar, fenerini kaldırıp köprüye bakar, kum saatini çevirir, girer ———
function kulubeSahne(K, t, S, B) {
  const { tm } = S;
  kulubeArka(K, t);
  kopruUcuYan(K, t, S, false);
  const kapi = W(t, tm.kulube - 0.25, 0.28) * (1 - W(t, tm.giriyor + 0.38, 0.28));
  // bekçi: kapının eşiğinde (önden). Çıkış: bir adım öne (ölçek ve y), giriş: geri
  const ileri = W(t, tm.kulube - 0.05, 0.3) * (1 - W(t, tm.giriyor + 0.1, 0.3));
  const p = H.charBase(BEK, { x: BEK_X - 40 * ileri, y: 1500 - 6 * (1 - ileri), s: S_BEK * (0.96 + 0.04 * ileri), expr: BOS, head: { nod: 0, tilt: 0, look: [-0.2, 0.05] }, ...POZ.dur });
  const bak = W(t, tm.bakiyor - 0.1, 0.25) * (1 - W(t, tm.hemen - 0.05, 0.25));
  p.head = { ...p.head, look: [lerp(-0.2, -0.9, bak), lerp(0.05, -0.1, bak)], tilt: lerp(0, -4, bak) };
  if (bak > 0.5) p.expr = SERT;
  // fener (sağ elde): "bakıyor"da yukarı kalkar
  const R = [kar(H.elYeri(BEK, p, 'R', 'asagi'), H.elYeri(BEK, p, 'R', 'yukari'), bak), 1, 'B'];
  // kum saati: sol el rafa uzanır, çevirir (0,3 sn), bırakır
  const tCev = tm.hemen + 0.12, uz = W(t, tCev - 0.28, 0.26) * (1 - W(t, tCev + 0.42, 0.24));
  const rot = Math.PI * ease.state(seg(t, tCev, 0.3)), kald = 18 * Math.sin(Math.PI * seg(t, tCev, 0.3));
  const kumP = [KUM[0], KUM[1] - kald];
  const L = uz > 0.01 ? [[kumP[0] + 4, kumP[1] + 10], uz, 'A'] : undefined;
  const cevrildi = t >= tCev + 0.3, ust = cevrildi ? 0.985 - (t - tCev - 0.3) / 180 : 0.015;
  let r = null;
  kapiCiz(K, KD.x, KD.y, KD.w, KD.h, kapi, { icinde: () => {
    r = oyna(K, t, null, BEK, p, { sessiz: true, R, L });
    kasket(K, p);
  } });
  kumSaati(K, kumP, 100, cevrildi ? 0 : rot, ust, t);
  if (r) {
    fener(K, [r.handR[0], r.handR[1] + 8], 1.0, t, { isik: 1 });
    r.tut('R');
    if (uz > 0.5) r.tut('L');
  }
  kopruUcuYan(K, t, S, true);
}

// ——— Ofis ———
function ofisSahne(K, t, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, tl = S.tlA;
  M.mekanCiz(K, OFIS, 'arka', t);
  // Hikmet (elinde çay)
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), hO = { heads };
  let hSay = 0, hAc = false;
  if (id === 'ofis') {
    for (const a of [tm.kimse - 0.02, tm.kimse + 0.34]) hp.head = { ...hp.head, tilt: (hp.head.tilt || 0) + 5 * Math.sin(TAU * seg(t, a, 0.36)) };   // "kimseyi tanımıyor": baş iki yana
    H.onayla(hp, t, tm.bekci - 0.05, 1, 0.36);
    const wA = pIn(t, tm.soru - 0.2, tm.uc + 0.2, 0.28);                       // "soru sormuyor": açık avuç (sol el, Defne'ye doğru)
    if (wA > 0.01) { hO.L = [[hp.x - 175, 1265], wA, 'B']; hAc = wA > 0.6; }
  } else if (id === 'hikmet') {
    const k = H.nabiz(t, tm.nasil - 0.1, 0.6);
    hO.R = [[hp.x + 150, 1150 - 40 * k], 1, 'A'];
  } else if (id === 'say2' || id === 'say3') {                                // parmak hesabı: bir, iki, üç… beş (sesi yok)
    const el = H.elYeri('hikmet', hp, 'L', 'yukari'), w = W(t, tm.say2 + 0.1, 0.28) * (1 - W(t, tm.say2 + 3.1, 0.3));
    if (w > 0.01) hO.L = [el, w, 'B'];
    hSay = [0, 1, 2, 3].reduce((n, k) => n + seg(t, tm.say2 + 0.45 + k * (k === 3 ? 0.9 : 0.45) + (k >= 3 ? 0.5 : 0), 0.18), 0) + 1;
    if (w < 0.5) hSay = 0;
  }
  if (!hO.R) hO.R = [[hp.x + 135, 1170], 1, 'A'];
  const hc = oyna(K, t, tl, 'hikmet', hp, hO);
  bardak(K, hc.handR[0] - 6, hc.handR[1] + 26, { buhar: true, t }); hc.tut('R');
  if (hAc) hc.parmak('L', 4, { toplam: 4, ac: 0.26, yon: Math.PI - 0.35 });
  if (hSay > 0.01) hc.parmak('L', hSay, { toplam: 5, ac: 0.3 });

  // Necmi (pencerenin önünde; sol elinde cep saati, zinciri hırkasında)
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t), nO = { heads };
  const saatEl = [np.x - 0.4 * np.s, np.y - 1.28 * np.s];
  nO.L = [saatEl, 1, 'A'];
  let kur = 0;
  if (id === 'say2' || id === 'say3') {   // saatini kurar (sağ el düğmede), başını sallar
    kur = pIn(t, tm.say2 + 0.4, tm.say2 + 2.6, 0.3);
    if (kur > 0.01) nO.R = [[saatEl[0] + 0.24 * np.s, saatEl[1] - 0.12 * np.s], kur, 'A'];
    H.onayla(np, t, tm.say2 + 2.75, 1, 0.42);
  }
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  const sp = [nc.handL[0] + 0.02 * np.s, nc.handL[1] - 0.14 * np.s];
  cepSaati(K, sp, 0.19 * np.s, 1, t, { zincir: [np.x - 0.12 * np.s, np.y - 1.75 * np.s] });
  nc.tut('L');
  if (kur > 0.6) nc.tut('R');

  // Defne
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t), dO = { heads };
  dp.y -= H.buldumHop(t, tm.buldum);
  let dPar = null, dIs = null;
  if (id === 'ofis') {   // "Üç dakikada bir": sağ el başın yanında, üç parmak
    const w = W(t, tm.uc - 0.25, 0.26);
    if (w > 0.01) { dO.R = [kar(H.elYeri('defne', dp, 'R', 'asagi'), H.elYeri('defne', dp, 'R', 'yukari'), w), 1, 'B']; if (w > 0.6) dPar = ['R', 3, { toplam: 3, ac: 0.3 }]; }
  } else if (id === 'say3') {
    if (t > tm.n1 - 0.4) dp.blink = 0;
    const wI = pIn(t, tm.sormuyor - 0.2, tm.yalniz - 0.05, 0.25);                // "sormuyor": parmağını sallar
    const wY = 0;
    if (wI > 0.01) { const el = H.elYeri('defne', dp, 'R', 'yukari'); dO.R = [[el[0] + 14 * Math.sin(TAU * 2.2 * (t - tm.sormuyor)), el[1]], wI, 'B']; if (wI > 0.6) dPar = ['R', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25, boy: 1.35 }]; }
    else if (wY > 0.01) { dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), wY, 'B']; if (wY > 0.6) dPar = ['R', 1, { toplam: 1 }]; }
    if (t > tm.n1s + 0.5) H.onayla(dp, t, tm.n1s + 0.55, 1, 0.42);
  }
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (dPar) dc.parmak(...dPar);
  if (dIs) dc.isaret('R', dIs);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}
