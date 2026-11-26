// Bölüm 71 · ERKEN GELEN YOLCU (v4 "hikâye" dili, kısa set, cevapsız tasarım; storyboard: hikayeler/bolum_071_v5.md).
// Mekanizma: hız ve mesafe gerekmez; arabanın kazandığı süreye bak.
// Logline: Necmi dün vapurdan bir saat erken iner, eşi Nermin Hanım'ı beklemeden eve doğru yürür. Nermin Hanım evden her
// zamanki saatte çıkar, her zamanki hızla sürer, yolda Necmi'yi görünce hemen alıp döner; eve 20 dakika erken varırlar.
// Hikmet sorar: Necmi kaç dakika yürüdü?
// Akılda kalacak tek şey: Necmi'ye değil, arabaya bak.
// Sızıntı yasağı: hiçbir saat, duvar saati ya da kol saati okunur dakika göstermez (zaman hapında saat simgesi yerine akşam
// güneşi var); yol tabelası ve mesafe yok; buluşma yeri işaretlenmez; iskele, yol ve ev ayrı plânlardadır, yolun tamamı hiçbir
// karede görünmez (izleyici çizimden oran ölçemez).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180, TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Figüran: Nermin Hanım (Necmi'nin eşi) ═══════════════════════════
// Defne'nin iskeletinden türetildi; Necmi'nin yaşıtı (60'larında). Kınalı saç topuz, kedi gözü gözlük, inci küpe, boynunda
// hardal ipek eşarp, gül kurusu hırka, koyu kahve etek. Siluet: topuz + eşarp + etek. Konuşmaz.
const NER = 'b071_nermin';
if (!H.CARDS[NER]) {
  const b = H.CARDS.defne;
  H.CARDS[NER] = {
    ...b, key: NER, name: 'Nermin Hanım', role: "Necmi'nin eşi", seed: 711,
    head: { w: 0.93, h: 1, ear: 0.11 }, neck: 0.06,
    torso: { ...b.torso, len: 0.78, shoulder: 0.63, hip: 0.68, depth: 0.46, belly: 0.09, color: '#A8505A', shade: '#8A3F48' },
    arm: { ...b.arm, color: '#A8505A', shade: '#8A3F48' },
    leg: { ...b.leg, upper: 0.38, lower: 0.37, color: '#4E4038', shade: '#3E322B' },
    shoe: { ...b.shoe, color: '#5A3A24' },
    skin: '#E8B894', skinShade: '#CC9C78', hair: '#A0472C', scarf: '#E2AE3C', scarfDot: '#2F7F7A', top: '#F3E9D6',
    eyes: { gap: 0.34, w: 0.19, h: 0.22, y: 0.04, lid: 0.18 }, line: 0.05, idle: { blink: [2.8, 5.6] },
    features: ['cardigan', 'bun', 'glassesCat', 'earrings', 'scarf', 'skirt'],
  };
}
const BOY = { ...H.BOY, [NER]: 220 };
const DIS = 0.9;                                   // dış mekân kadro ölçeği (iskele, ev, yol)
const sD = key => BOY[key] * DIS;

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz, açık durmaz)
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 0.85, pupil: 1, curve: 0.6, open: 0, w: 1.15 };
const NGULUS = { brow: 0.03, browTilt: -0.1, eye: 0.9, pupil: 1, curve: 0.38, open: 0, w: 1.1 };
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const DALGIN = { brow: 0.04, browTilt: 0.05, eye: 0.95, pupil: 1, curve: 0.18, open: 0, w: 0.95 };

// ═══════════════════════════ Araba (019'dan; üstü açık, kiraz kırmızısı) ═══════════════════════════
// Yerel çerçevede araba sağa bakar; zemin ortası (0, 0). Sola giden araba grup dönüşümüyle (yansıma) çizilir: f = −1.
const CAR = { ak: 186, r: 56, kusak: -215, etek: -50, k0: -122, k1: 122, dir: [90, -240], kol: [94, -194], on: 272, arka: -268 };
const C = 1.0;                                     // dış mekân araba ölçeği
const KIRAZ = '#C0453A', KIRAZ_G = '#96342C';
// koltuk ve iniş yeri (yerel): Nermin önde (sürücü), Necmi onun yanında biraz geride; cik = arabanın önünde durulan yer (x)
const OTUR = { [NER]: { koltuk: [-2, -128], cik: 30 }, necmi: { koltuk: [-182, -124], cik: 255 } };   // Necmi arabanın burnu tarafında bekler: yürürken Nermin'in yüzünün önünden geçmez
function govdeYolu(ctx) {
  ctx.moveTo(-260, CAR.etek); ctx.lineTo(-268, -130); ctx.quadraticCurveTo(-270, -222, -232, -228);
  ctx.lineTo(-134, -236); ctx.lineTo(CAR.k0, CAR.kusak); ctx.lineTo(CAR.k1, CAR.kusak); ctx.lineTo(134, -234); ctx.lineTo(228, -214);
  ctx.quadraticCurveTo(273, -204, 273, -148); ctx.lineTo(268, CAR.etek); ctx.closePath();
}
const arabaDon = (K, c) => { const { ctx } = K, k = c.k || C; ctx.save(); ctx.translate(c.x, c.y + (c.tit || 0)); ctx.rotate((c.egim || 0) * D2R); ctx.scale(k, k); };
function arabaArka(K, c) {
  const k = c.k || C, lw = LW / k; arabaDon(K, c);
  K.rect(CAR.k0 - 40, CAR.kusak - 6, CAR.k1 - CAR.k0 + 40, CAR.etek - CAR.kusak + 6, '#4A3B30', 0);
  K.rect(CAR.k0 - 48, CAR.kusak - 18, CAR.k1 - CAR.k0 + 56, 20, c.golge, lw * 0.8, 7);                   // öteki yanın üst kenarı
  if (!c.bos) for (const sx of [OTUR[NER].koltuk[0], OTUR.necmi.koltuk[0]]) {                           // iki koltuk: sırtlık, başlık, minder
    K.poly([[sx - 84, -138], [sx - 34, -138], [sx - 42, -326], [sx - 78, -330]], '#7A5A3C', lw); K.rect(sx - 88, -380, 44, 60, '#7A5A3C', lw, 15);
    K.rect(sx - 74, -144, 150, 24, '#6B4E33', lw * 0.8, 9);
  }
  K.line(128, -222, CAR.dir[0] + 8, CAR.dir[1] + 6, 15, INK); K.line(128, -222, CAR.dir[0] + 8, CAR.dir[1] + 6, 7, PAL.metal);   // direksiyon mili
  K.ctx.save(); K.ctx.translate(CAR.dir[0], CAR.dir[1]); K.ctx.rotate(-0.38); K.ell(0, 0, 11, 40, '#3A3F3C', lw); K.ctx.restore();
  K.ctx.restore();
}
function teker(K, x, y, r, aci, lw) {
  K.circ(x, y, r, '#3A3F3C', lw); K.circ(x, y, r * 0.52, PAL.metal, lw * 0.8);
  for (let i = 0; i < 5; i++) { const a = aci + i * Math.PI * 0.4; K.line(x + Math.cos(a) * r * 0.16, y + Math.sin(a) * r * 0.16, x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, lw * 0.9, INK); }
  K.circ(x, y, r * 0.13, PAL.cream, lw * 0.6);
}
function arabaOn(K, c) {
  const { ctx } = K, k = c.k || C, lw = LW / k, a = clamp01(c.kapi || 0) * 72 * D2R, kw = CAR.k1 - CAR.k0, xa = CAR.k0 + kw * Math.cos(a), rk = CAR.r + 20;
  const yol = () => { ctx.beginPath(); govdeYolu(ctx); if (a > 0.02) { ctx.moveTo(xa, CAR.kusak); ctx.lineTo(xa, CAR.etek - 2); ctx.lineTo(CAR.k1, CAR.etek - 2); ctx.lineTo(CAR.k1, CAR.kusak); ctx.closePath(); } };
  arabaDon(K, c);
  const cam = [[136, -230], [180, -224], [150, -330], [134, -328]];   // alçak ön cam (yüzün önüne geçmez)
  ctx.save(); ctx.globalAlpha = 0.5; K.poly(cam, '#CFE3DD', 0); ctx.restore(); K.poly(cam, null, lw);
  K.line(150, -236, 140, -320, 5, '#F7FBFA');
  K.rect(-286, -72, 26, 14, PAL.metalDark, lw * 0.8, 5);                                                 // egzoz borusu
  K.rect(-246, -266, 114, 44, '#4A3B30', lw, 18);                                                        // katlanmış tente
  yol(); ctx.fillStyle = c.renk; ctx.fill('evenodd');
  ctx.save(); yol(); ctx.clip('evenodd');
  ctx.fillStyle = c.golge; ctx.fillRect(-300, -96, 600, 60);
  K.rect(-300, -160, 600, 12, PAL.cream, 0);                                                             // krem kuşak
  for (const wx of [-CAR.ak, CAR.ak]) { ctx.beginPath(); ctx.arc(wx, -CAR.r - 2, rk, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fillStyle = '#26302B'; ctx.fill(); }
  ctx.restore();
  yol(); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  for (const wx of [-CAR.ak, CAR.ak]) { ctx.beginPath(); ctx.arc(wx, -CAR.r - 2, rk, Math.PI, Math.PI * 2); ctx.lineWidth = lw; ctx.stroke(); teker(K, wx, -CAR.r, CAR.r, c.aci || 0, lw); }
  if (a <= 0.02) {   // kapalı kapı: dikişler, kol
    K.line(CAR.k0, CAR.kusak, CAR.k0, CAR.etek - 6, lw * 0.7); K.line(CAR.k1, CAR.kusak, CAR.k1, CAR.etek - 6, lw * 0.7);
    K.rect(CAR.kol[0] - 18, CAR.kol[1] - 8, 36, 16, PAL.metal, lw * 0.7, 8);
  }
  K.rect(256, -96, 28, 26, PAL.cream, lw * 0.8, 10); K.rect(-282, -100, 26, 26, PAL.cream, lw * 0.8, 10);   // tamponlar
  K.ell(265, -166, 9, 22, '#FBF6EC', lw * 0.8); K.rect(-273, -198, 12, 40, c.fren ? '#FF7A52' : PAL.red, lw * 0.7, 5);   // far, stop
  ctx.restore();
}
function arabaKapi(K, c) {
  const a = clamp01(c.kapi || 0) * 72 * D2R; if (a <= 0.02) return;
  const { ctx } = K, k = c.k || C, lw = LW / k, kw = CAR.k1 - CAR.k0, cs = Math.cos(a), sn = Math.sin(a), xa = CAR.k0 + kw * cs;
  arabaDon(K, c);
  K.poly([[CAR.k0, CAR.kusak], [xa, CAR.kusak - 16 * sn], [xa, CAR.etek + 22 * sn], [CAR.k0, CAR.etek - 2]], H.mixHex(c.renk, c.golge, 0.7 * sn), lw);
  ctx.save(); ctx.translate(CAR.k0, 6 * sn); ctx.scale(cs, 1 + 0.1 * sn); ctx.translate(-CAR.k0, 0);
  K.rect(CAR.kol[0] - 18, CAR.kol[1] - 8, 36, 16, PAL.metal, lw * 0.7, 8);
  ctx.restore(); ctx.restore();
}
const kolYeri = c => { const k = c.k || C, cs = Math.cos(clamp01(c.kapi || 0) * 72 * D2R); return [c.x + (CAR.k0 + (CAR.kol[0] - CAR.k0) * cs) * k, c.y + CAR.kol[1] * k]; };
const dirYeri = (c, alt) => { const k = c.k || C; return [c.x + (CAR.dir[0] + (alt ? 12 : -12)) * k, c.y + (CAR.dir[1] + (alt ? 30 : -34)) * k + (c.tit || 0)]; };
function icKirp(K, c, fn) { const { ctx } = K, k = c.k || C; ctx.save(); ctx.beginPath(); ctx.rect(c.x - 340 * k, c.y - 1600, 680 * k, 1600 + CAR.etek * k); ctx.clip(); fn(); ctx.restore(); }
function egzoz(K, c, t, hizli = false) {
  const { ctx } = K, k = c.k || C, x = c.x + (CAR.arka - 22) * k, y = c.y - 64 * k, q = hizli ? 0.85 : 0.6, faz = t / (hizli ? 0.45 : 0.95);
  ctx.save();
  for (let j = 0; j < 3; j++) { const u = ((faz + j / 3) % 1 + 1) % 1, e = ease.enter(u); ctx.globalAlpha = 0.85 * (1 - u); K.circ(x - 100 * q * e * k, y - 40 * q * u * u * k, (9 + 20 * e) * q * k, '#D8D2C6', LW * 0.55); }
  ctx.restore();
}
// Biniş: u = 0 koltukta (yandan, sağa dönük) … 1 arabanın önünde ayakta (yerel çerçeve). cikY: ayakta durulan yerin zemin farkı.
function binis(key, c, u, cikY, o = {}) {
  const s = sD(key), st = H.CARDS[key].stance?.knee || 0, e = ease.state(clamp01(u)), yer = OTUR[key], k = c.k || C;
  const p = H.kisi(key, {
    s, view: 'side', facing: 1, lean: lerp(o.lean ?? 5, 0, e), expr: o.expr || 'notr', head: { tilt: lerp(o.tilt ?? 0, 0, e), look: [0, 0] },
    legL: { hip: lerp(72, st * 0.5, e), knee: lerp(56, st, e) }, legR: { hip: lerp(80, st * 0.5, e), knee: lerp(62, st, e) },
    armL: { sh: lerp(40, -4, e), el: lerp(50, 8, e) }, armR: { sh: lerp(44, 6, e), el: lerp(52, 10, e) },
  });
  const pel = H.eklem(key, { ...p, x: 0, y: 0 }, 'pelvis'), ayak = H.eklem(key, H.kisi(key, { s, view: 'side', x: 0, y: 0 }), 'pelvis');
  p.x = lerp(c.x + yer.koltuk[0] * k, c.x + yer.cik, e) - pel[0];
  p.y = lerp(c.y + yer.koltuk[1] * k + (c.tit || 0), c.y + cikY + ayak[1], e) - pel[1];
  return p;
}
// Araba grubu: c yerel çerçevede (sağa bakar); f = +1 sağa, −1 sola (yansıma; dönüşte −1 → +1). ic: koltuktakiler, on: önündekiler.
function arabaGrup(K, c, f, { ic = [], on = [], hizli = false, t = 0, egz = true } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(c.x, 0); ctx.scale(f, 1); ctx.translate(-c.x, 0);
  arabaArka(K, c);
  icKirp(K, c, () => ic.forEach(fn => fn()));
  arabaOn(K, c);
  if (egz) egzoz(K, c, t, hizli);
  on.forEach(fn => fn());
  arabaKapi(K, c);
  ctx.restore();
}
// Hareket profili: t0'da V hızla kalkar (A sn'de hızlanır) → alınan yol
const kalkis = (t, t0, V, A = 0.4) => { const τ = t - t0; return τ <= 0 ? 0 : τ < A ? V * τ * τ / (2 * A) : V * (τ - A / 2); };
// V hızdan D sn'de durur → alınan yol
const durus = (t, t0, V, D) => { const τ = clamp01((t - t0) / D) * D; return V * τ - V * τ * τ / (2 * D); };
const V = 520;
const DENIZ = '#3F6F70', DALGA = '#86AAA4';            // akşam denizi (ışık ön ayarının kahve denizi çamur gibi okunuyordu)                                     // Nermin Hanım'ın her zamanki hızı (dünya px/sn); her plânda aynı

// ═══════════════════════════ Ortak dış mekân parçaları ═══════════════════════════
function marti(K, x, y, k = 1, kanat = 0) {
  const { ctx } = K, a = 13 * k * (1 + 0.35 * kanat);
  ctx.beginPath(); ctx.moveTo(x - 22 * k, y + 4 * kanat * k); ctx.quadraticCurveTo(x - 10 * k, y - a, x, y); ctx.quadraticCurveTo(x + 10 * k, y - a, x + 22 * k, y + 4 * kanat * k);
  ctx.lineWidth = 4.5; ctx.strokeStyle = INK; ctx.stroke();
}
function martilar(K, t, x0, x1, y, yon = 1) {   // döngü: iki martı süzülür, kanat çırpar
  const w = x1 - x0 + 300;
  for (let i = 0; i < 2; i++) {
    const v = 46 + 12 * i, u = ((t * v + i * 640) % w + w) % w, x = yon > 0 ? x0 - 150 + u : x1 + 150 - u;
    marti(K, x, y + i * 80 + 12 * Math.sin(t * 1.2 + i * 2), 1.1 - 0.25 * i, Math.sin(t * 6 + i));
  }
}
// Uzak kıyı (Anadolu yakası, adsız): tohumlu tepeler, birkaç minare ve ev; ışık renkleri
function uzakKiyi(K, x0, x1, y, renk) {
  const { ctx } = K, rnd = H.mulberry32(711);
  ctx.save(); ctx.lineJoin = 'round'; ctx.fillStyle = renk; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x0, y);
  let x = x0; while (x < x1) { const w = 160 + rnd() * 240, h = 40 + rnd() * 90; ctx.quadraticCurveTo(x + w / 2, y - h * 1.6, x + w, y - 10 - rnd() * 20); x += w; }
  ctx.lineTo(x1, y); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) { const mx = x0 + 300 + i * (x1 - x0 - 600) / 3 + rnd() * 80; ctx.beginPath(); ctx.rect(mx - 6, y - 130, 12, 120); ctx.fill(); ctx.stroke(); K.poly([[mx - 8, y - 130], [mx, y - 158], [mx + 8, y - 130]], renk, 4); }
  ctx.restore();
}
// Deniz: düz renk + kayan dalga çizgileri (döngü)
function deniz(K, x0, x1, y0, y1, t, renk, dalga) {
  const { ctx } = K; ctx.fillStyle = renk; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); K.line(x0, y0, x1, y0, 4);
  for (let r = 0; r < 5; r++) {
    const yy = y0 + 18 + r * (y1 - y0 - 30) / 5, sp = 150 + r * 40, L = 30 + r * 12, o = ((t * (14 + r * 7) + r * 61) % sp + sp) % sp;
    for (let x = x0 - sp + o; x < x1 + sp; x += sp) K.line(x, yy, x + L, yy, 3 + r * 0.7, dalga);
  }
}
// Vapur (yandan, burnu sağda). (x, y): su hattının ortası, k ölçek. Baca dumanı döngüsü.
function vapur(K, x, y, k, t, { duman = true, pencere = '#E8A640' } = {}) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const lw = LW / k;
  K.poly([[-330, -96], [300, -96], [352, -110], [318, 0], [-300, 0], [-338, -60]], '#F1EDE2', lw);           // gövde
  K.poly([[-318, -26], [326, -26], [318, 0], [-300, 0]], '#2E3532', 0);                                     // su hattı (koyu)
  K.rect(-320, -62, 640, 14, '#24504E', 0);                                                                 // petrol şerit
  K.poly([[-330, -96], [300, -96], [352, -110], [318, 0], [-300, 0], [-338, -60]], null, lw);
  K.rect(-250, -186, 470, 92, '#F1EDE2', lw, 8);                                                            // alt salon
  for (let i = 0; i < 9; i++) K.rect(-232 + i * 50, -166, 34, 32, pencere, lw * 0.5, 5);
  K.rect(-190, -256, 330, 72, '#F1EDE2', lw, 8);                                                            // üst salon
  for (let i = 0; i < 6; i++) K.rect(-172 + i * 50, -240, 32, 28, pencere, lw * 0.5, 5);
  K.line(-280, -96, 270, -96, 6 / k, INK);
  for (let i = 0; i < 12; i++) K.line(-270 + i * 48, -96, -270 + i * 48, -116, 4 / k, INK);                  // korkuluk dikmeleri
  K.line(-282, -116, 280, -116, 5 / k, INK);
  K.rect(-40, -352, 64, 100, '#F1EDE2', lw, 6); K.rect(-40, -330, 64, 18, '#24504E', 0); K.rect(-40, -352, 64, 14, '#2E3532', 0); K.rect(-40, -352, 64, 100, null, lw, 6);   // baca
  K.line(196, -256, 196, -330, 6 / k, INK); K.circ(196, -334, 7, PAL.mustard, lw * 0.5);                    // direk
  ctx.restore();
  if (duman) H.puf(K, x - 8 * k, y - 360 * k, t, { k: 0.95 * k + 0.25, n: 3, periyot: 1.6, yon: -Math.PI / 2 - 0.5, yol: 120, kalk: 30, renk: '#E9E4DA' });
}
// Sokak lambası (yandığında düz renkli ışık çokgeni)
function lamba(K, x, yb, h = 520, yanik = 1) {
  const { ctx } = K;
  if (yanik > 0.01) { ctx.save(); ctx.globalAlpha = 0.18 * yanik; K.poly([[x + 20, yb - h + 60], [x + 80, yb - h + 60], [x + 210, yb + 40], [x - 110, yb + 40]], '#F4CF7A', 0); ctx.restore(); }
  K.rect(x - 9, yb - h, 18, h, '#3A4442', LW * 0.7);
  K.line(x, yb - h + 6, x + 52, yb - h + 6, 12, INK); K.line(x, yb - h + 6, x + 52, yb - h + 6, 6, '#3A4442');
  K.poly([[x + 30, yb - h + 8], [x + 74, yb - h + 8], [x + 66, yb - h + 50], [x + 38, yb - h + 50]], yanik > 0.5 ? '#F4CF7A' : '#C9C3B6', LW * 0.7);
  K.rect(x - 22, yb - 30, 44, 30, '#3A4442', LW * 0.7, 4);
}
// Zaman hapı: geri dönüş. Saat simgesi yok (sızıntı yasağı); yerine ufukta akşam güneşi.
function hap(K, t, a, b, label, { x = 540, y = 600, size = 48 } = {}) {
  if (t < a - 0.001 || t > b + 0.2) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, b, 0.2)), k = (0.6 + 0.4 * v) * out;
  ctx.font = `900 ${size}px Rubik`; const tw = ctx.measureText(label).width, r = size * 0.56, w = tw + r * 2 + size * 1.5, h = size * 1.9;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = clamp01(v * 1.6) * out;
  K.rect(-w / 2 + 7, -h / 2 + 9, w, h, INK, 0, h / 2); K.rect(-w / 2, -h / 2, w, h, PAL.cream, LW, h / 2);
  const cx = -w / 2 + size * 0.5 + r;
  ctx.save(); ctx.beginPath(); ctx.rect(cx - r - 4, -r - 4, 2 * r + 8, r + 10); ctx.clip(); K.circ(cx, 6, r, PAL.coral, LW * 0.8); ctx.restore();
  K.line(cx - r - 4, 6, cx + r + 4, 6, 6);
  K.text(label, cx + r + size * 0.32 + tw / 2, size * 0.35, size, INK, 900);
  ctx.restore();
}

// ═══════════════════════════ Mekân 1: ofis (sabah) ═══════════════════════════
const OFIS = 'b071_ofis';
const PEN = { x: 360, y: 520, w: 480, h: 480 };            // deniz ve sahil yolu manzaralı pencere
const PEN_UFUK = PEN.y + 210, PEN_YOL = PEN.y + 400;        // pencerede ufuk ve yolun zemini
const NEC_X = 205, DEF_X = 1000, HIK_X = 1290;
const MASA = { x0: 1140, x1: 1560, y: 1200 };
// Pencereden geçen arabalar: [giriş anı, yön, renk, gölge]. Kırmızı araba ipucunda ("arabaya") pencerenin ortasından geçer.
const TRAFIK = [
  [-1.2, 1, '#3F6E72', '#2F5558'], [1.4, -1, '#E2AE3C', '#B8892A'], [4.6, 1, '#5E6B73', '#4B565D'], [7.9, -1, '#E9E4D6', '#C9C3B6'],
  [11.2, 1, '#E2AE3C', '#B8892A'], [14.6, -1, '#3F6E72', '#2F5558'], [17.8, 1, '#E9E4D6', '#C9C3B6'], [20.4, -1, '#5E6B73', '#4B565D'],
  [22.6, 1, '#3F6E72', '#2F5558'], [25.3, -1, '#E2AE3C', '#B8892A'], [27.6, 1, '#E9E4D6', '#C9C3B6'],
  [30.32, 1, KIRAZ, KIRAZ_G], [33.4, -1, '#5E6B73', '#4B565D'], [36.6, 1, '#3F6E72', '#2F5558'], [40.2, -1, '#E2AE3C', '#B8892A'], [43.5, 1, '#E9E4D6', '#C9C3B6'],
];
const TRAFIK_V = 250, TRAFIK_K = 0.24;
const trafikX = ([t0, yon], t) => yon > 0 ? PEN.x - 90 + (t - t0) * TRAFIK_V : PEN.x + PEN.w + 90 - (t - t0) * TRAFIK_V;
const VAPUR_PEN = t => 700 - 12 * t;                       // pencerede vapur yavaşça sağdan sola geçer
function manzara(t) {
  return (K, x, y, w, h, I) => {
    const { ctx } = K;
    uzakKiyi(K, x - 100, x + w + 100, PEN_UFUK, H.mixHex(I.sehir, I.gok, 0.3));
    deniz(K, x, x + w, PEN_UFUK, PEN_YOL - 60, t, I.deniz, H.mixHex(I.deniz, '#F4EDE0', 0.45));
    vapur(K, VAPUR_PEN(t), PEN_UFUK + 64, 0.19, t, { pencere: '#E9E4D6' });
    // sahil yolu: korkuluk, asfalt
    K.rect(x, PEN_YOL - 60, w, 14, '#C9C3B6', 3);
    for (let px = x + 10; px < x + w; px += 46) K.rect(px, PEN_YOL - 48, 6, 22, '#8D8B78', 0);
    ctx.fillStyle = '#5D6A61'; ctx.fillRect(x, PEN_YOL - 26, w, h);
    for (let px = x + 20; px < x + w; px += 90) K.line(px, PEN_YOL + 30, px + 44, PEN_YOL + 30, 5, PAL.cream);
    for (const a of TRAFIK) {
      const cx = trafikX(a, t); if (cx < x - 100 || cx > x + w + 100) continue;
      const c = { x: cx, y: PEN_YOL + 14, k: TRAFIK_K, renk: a[2], golge: a[3], aci: (t - a[0]) * TRAFIK_V / (CAR.r * TRAFIK_K), bos: true };
      ctx.save(); ctx.translate(c.x, 0); ctx.scale(a[1], 1); ctx.translate(-c.x, 0); arabaArka(K, c); arabaOn(K, c); ctx.restore();
    }
  };
}
function masaCiz(K) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 16, y + 34, x1 - x0 - 32, 1500 - y - 34, PAL.wood, LW);
  for (const dx of [40, 236]) { K.rect(x0 + dx, y + 66, 170, 118, PAL.woodTop, LW * 0.6, 6); K.line(x0 + dx + 62, y + 124, x0 + dx + 108, y + 124, 8); }
  K.rect(x0, y, x1 - x0, 36, PAL.woodTop, LW, 8);
}
// İnce belli çay bardağı: (x, yb) taban
function bardak(K, x, yb, { k = 2, buhar = false, t = 0, dolu = true } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], dolu ? '#A8401F' : '#E3EEEA', 2.4 / k * 1.45);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 36 * k, t, { k: 0.38, n: 2, ara: 9, boy: 56 });
}
function saksi(K, x, yb, t) {   // ofis bitkisi (döngü: yapraklar hafif salınır; klima)
  K.poly([[x - 60, yb - 120], [x + 60, yb - 120], [x + 46, yb], [x - 46, yb]], PAL.coral, LW);
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32 + 0.05 * Math.sin(t * 1.3 + i); H.yaprak(K, x, yb - 116, 150 + 30 * (i % 2), a, PAL.green, 1); }
}
M.mekanEkle(OFIS, {
  gen: [-300, 1900], dongu: ['pencerede geçen vapur ve arabalar', 'martı', 'çay buharı', 'bitkinin yaprakları'],
  capa: { pencere: [PEN.x + PEN.w / 2, PEN.y + PEN.h / 2], masa: [HIK_X, MASA.y] },
  kadraj: { genis: [0.98, 600, 990] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 2000, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, PEN.x, PEN.y, PEN.w, PEN.h, { isik, t, gunes: 0.3, manzara: manzara(t), kayit: false });
    K.rect(PEN.x - 30, PEN.y + PEN.h, PEN.w + 60, 26, PAL.trim, LW * 0.8, 6);                             // pencere önü
    saksi(K, 1650, 1500, t);
    // pano: renkli kâğıtlar (yazısız)
    K.rect(-250, 620, 300, 230, '#B8925E', LW, 8);
    for (const [px, py, c] of [[-220, 650, PAL.cream], [-120, 660, PAL.mustard], [-210, 750, '#6FB3AC'], [-90, 760, PAL.cream]]) { K.rect(px, py, 80, 70, c, LW * 0.6, 3); K.circ(px + 40, py + 6, 6, PAL.coral, 2); }
  },
});

// ═══════════════════════════ Mekân 2: iskele (dün akşam) ═══════════════════════════
const ISKELE = 'b071_iskele';
const IS_UFUK = 1020, IS_RIHTIM = 1330;
M.mekanEkle(ISKELE, {
  gen: [-700, 1900], dongu: ['deniz dalgaları', 'vapurun baca dumanı', 'martılar', 'vapurun salınması'],
  kadraj: { genis: [1.05, 650, 960] },
  arka(K, t, { isik }) {
    const I = isik, { ctx } = K;
    M.gok(K, -700, -600, 2700, IS_UFUK + 600, { isik: I, gunes: 0.9, r: 70 });
    martilar(K, t, -300, 1600, 560, 1);
    uzakKiyi(K, -700, 2000, IS_UFUK, H.mixHex(I.sehir, I.gok, 0.25));
    deniz(K, -700, 2000, IS_UFUK, IS_RIHTIM, t, DENIZ, DALGA);
    vapur(K, 250, 1290 + 4 * Math.sin(t * 1.1), 1.05, t, { pencere: '#F4CF7A' });
    // iskele köprüsü: vapurdan rıhtıma
    K.poly([[400, 1196], [520, 1326], [560, 1326], [440, 1196]], '#8C6A44', LW * 0.8);
    K.line(400, 1150, 520, 1290, 6); K.line(440, 1150, 560, 1290, 6);
    // rıhtım ve kaldırım
    K.rect(-700, IS_RIHTIM, 2700, 34, '#B9B1A2', LW);
    for (let x = -680; x < 2000; x += 120) K.line(x, IS_RIHTIM, x, IS_RIHTIM + 34, 3);
    ctx.fillStyle = '#C9B99A'; ctx.fillRect(-700, IS_RIHTIM + 34, 2700, 900);
    for (const dy of [70, 170, 330]) K.line(-700, IS_RIHTIM + 34 + dy, 2000, IS_RIHTIM + 34 + dy, 3, '#B3A383');
    // babalar (halat bağları)
    for (const bx of [520, 1240]) { K.rect(bx - 20, IS_RIHTIM - 30, 40, 44, '#3A4442', LW * 0.7, 8); K.rect(bx - 30, IS_RIHTIM - 40, 60, 16, '#3A4442', LW * 0.7, 6); }
    // her akşam beklenen yer: kaldırım kenarı, lamba (yolun başı; tabela yok)
    lamba(K, 1080, 1500, 600, 1);
  },
});

// ═══════════════════════════ Mekân 3: ev (dün akşam) ═══════════════════════════
const EV = 'b071_ev';
const EV_TABAN = 1470, KAPI = { x: 820, y: 1150, w: 150, h: 320 };
function kedi(K, x, yb, t, kalk = 0) {   // duvarın üstünde oturan tekir; döngü: kuyruk sallanır. kalk: ayağa kalkar (şaşırır)
  const { ctx } = K, c = '#C98A3A', cd = '#9E6427', y = yb - 18 * kalk;
  const sal = Math.sin(t * 2.2) * 0.5;
  ctx.save(); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 30, yb - 10); ctx.quadraticCurveTo(x + 80 + 30 * sal, yb - 30, x + 70 + 40 * sal, yb - 90); ctx.lineWidth = 16 + LW; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = c; ctx.stroke();
  ctx.restore();
  K.ell(x, y - 40, 44, 40, c, LW * 0.8);
  if (kalk > 0.01) { K.rect(x - 30, y - 10, 12, 10 + 18 * kalk, c, LW * 0.6, 4); K.rect(x + 18, y - 10, 12, 10 + 18 * kalk, c, LW * 0.6, 4); }
  K.circ(x - 26, y - 92, 30, c, LW * 0.8);
  K.poly([[x - 50, y - 108], [x - 46, y - 138], [x - 28, y - 118]], c, LW * 0.6); K.poly([[x - 22, y - 120], [x - 6, y - 140], [x - 2, y - 108]], c, LW * 0.6);
  for (const dy of [-8, 6]) K.line(x - 12, y - 52 + dy, x + 30, y - 50 + dy, 4, cd);
  const ac = 1 + 0.5 * kalk; K.ell(x - 36, y - 96, 4, 6 * ac, INK, 0); K.ell(x - 16, y - 96, 4, 6 * ac, INK, 0);
}
M.mekanEkle(EV, {
  gen: [-700, 1900], dongu: ['baca dumanı', 'kedinin kuyruğu', 'martı'],
  kadraj: { genis: [1.0, 600, 1000] },
  arka(K, t, { isik, durum }) {
    const I = isik, { ctx } = K;
    M.gok(K, -700, -600, 2700, 1600, { isik: I, gunes: 0.86, r: 64 });
    martilar(K, t, -300, 1700, 520, -1);
    // arka sokak: uzak çatılar
    const rnd = H.mulberry32(713); ctx.save(); ctx.fillStyle = H.mixHex(I.sehir, I.gok, 0.3); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-700, 1100);
    for (let x = -700; x < 2000;) { const w = 150 + rnd() * 140, h = 180 + rnd() * 140; ctx.lineTo(x, 1100 - h); ctx.lineTo(x + w / 2, 1100 - h - 60); ctx.lineTo(x + w, 1100 - h); x += w; }
    ctx.lineTo(2000, 1100); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    // ev: krem duvar, kiremit çatı, baca (döngü: duman), pencere (sardunyalar), kapı
    K.rect(240, 860, 880, EV_TABAN - 860, '#E7D3AE', LW);
    for (let y = 900; y < EV_TABAN; y += 70) K.line(244, y, 1116, y, 3, '#D8C29A');
    K.rect(960, 680, 70, 140, '#B5573F', LW * 0.8);
    H.puf(K, 995, 670, t, { k: 1, n: 3, periyot: 2.2, yon: -Math.PI / 2 + 0.35, yol: 120, kalk: 20, renk: '#E9E4DA' });
    K.poly([[200, 870], [1160, 870], [1060, 720], [300, 720]], '#B5573F', LW);
    for (let y = 750; y < 870; y += 30) K.line(260 - (y - 720) * 0.5, y, 1100 + (y - 720) * 0.5, y, 3, '#96442F');
    K.rect(330, 980, 260, 230, '#F4CF7A', LW, 6);                                                              // ışıklı pencere
    K.poly([[330, 980], [420, 980], [380, 1210], [330, 1210]], '#E9E4D6', LW * 0.6); K.poly([[590, 980], [500, 980], [540, 1210], [590, 1210]], '#E9E4D6', LW * 0.6);
    K.line(460, 980, 460, 1210, LW * 0.8);
    K.rect(310, 1210, 300, 24, PAL.trim, LW * 0.8, 4);
    kedi(K, 566, 1212, t, durum.kedi || 0);                                                              // pencerenin önünde tekir
    for (const sx of [370, 470]) { K.poly([[sx - 34, 1186], [sx + 34, 1186], [sx + 26, 1212], [sx - 26, 1212]], PAL.coral, LW * 0.6); for (let j = 0; j < 3; j++) K.circ(sx - 18 + j * 18, 1170 - 6 * (j % 2), 13, PAL.red, LW * 0.5); }
    M.kapi(K, KAPI.x, KAPI.y, KAPI.w, KAPI.h, { acik: durum.kapi || 0, yon: -1, isik: I, ic: '#5A4636', renk: '#7A4A2A' });
    K.rect(KAPI.x - 20, EV_TABAN - 4, KAPI.w + 40, 18, '#B9B1A2', LW * 0.7, 3);                              // eşik
    // bahçe duvarı ve kedi
    K.rect(1120, 1300, 600, 170, '#D9C7A2', LW); K.rect(1110, 1286, 620, 22, '#C9B78F', LW * 0.8, 4);
    lamba(K, -80, EV_TABAN + 30, 640, 1);
    // kaldırım ve yol
    ctx.fillStyle = '#C9B99A'; ctx.fillRect(-700, EV_TABAN, 2700, 60); K.line(-700, EV_TABAN, 2000, EV_TABAN, LW);
    ctx.fillStyle = '#5D6A61'; ctx.fillRect(-700, EV_TABAN + 60, 2700, 900); K.line(-700, EV_TABAN + 60, 2000, EV_TABAN + 60, LW);
    for (let x = -680; x < 2000; x += 260) K.line(x, 1760, x + 120, 1760, 8, PAL.cream);
  },
});

// ═══════════════════════════ Mekân 4: sahil yolu (dün akşam) ═══════════════════════════
const YOL = 'b071_yol';
const Y_UFUK = 1010, Y_KORK = 1240, Y_YOL0 = 1330, Y_YOL1 = 1650;
M.mekanEkle(YOL, {
  gen: [-700, 1900], dongu: ['deniz dalgaları', 'uzakta geçen vapur', 'martılar'],
  kadraj: { genis: [1.0, 560, 1020] },
  arka(K, t, { isik }) {
    const I = isik, { ctx } = K;
    M.gok(K, -700, -600, 2700, Y_UFUK + 600, { isik: I, gunes: 0.88, r: 66 });
    martilar(K, t, -300, 1500, 600, -1);
    uzakKiyi(K, -700, 2000, Y_UFUK, H.mixHex(I.sehir, I.gok, 0.25));
    deniz(K, -700, 2000, Y_UFUK, Y_KORK, t, DENIZ, DALGA);
    vapur(K, -500 + ((t * 30) % 2600), Y_UFUK + 90, 0.32, t, { pencere: '#F4CF7A' });
    // korkuluk ve kaldırım (deniz tarafı)
    for (let x = -680; x < 2000; x += 110) K.rect(x - 7, Y_KORK - 70, 14, 80, '#C9C6B6', LW * 0.6);
    K.rect(-700, Y_KORK - 82, 2700, 18, '#E9E4D6', LW * 0.8, 6);
    ctx.fillStyle = '#C9B99A'; ctx.fillRect(-700, Y_KORK, 2700, Y_YOL0 - Y_KORK); K.line(-700, Y_KORK, 2000, Y_KORK, LW);
    for (const lx of [-260, 900]) lamba(K, lx, Y_YOL0 - 10, 560, 1);
    // asfalt, orta şerit, yakın kaldırım
    ctx.fillStyle = '#5D6A61'; ctx.fillRect(-700, Y_YOL0, 2700, Y_YOL1 - Y_YOL0); K.line(-700, Y_YOL0, 2000, Y_YOL0, LW);
    for (let x = -680; x < 2000; x += 240) K.line(x, 1470, x + 120, 1470, 8, PAL.cream);
    ctx.fillStyle = '#C9B99A'; ctx.fillRect(-700, Y_YOL1, 2700, 1200); K.rect(-700, Y_YOL1, 2700, 22, '#B9B1A2', LW * 0.8);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    vapurGos: T('n0:1'), indim: T('n0:5'),
    geri: T('n0b') - 0.05, alir: T('n0b:3'), bekle: T('n0b:7'), yuru: T('n0b:8') - 0.25,
    ev: T('n0c') - 0.05, cikti: T('n0c:5'),
    yol: T('n0c:8') - 0.3, gor: T('n0c:10') - 0.06, hemen: T('n0c:12'),
    vardik: T('n0d:6'), ofis: T('h3') - 0.15, kac: T('h3:2'),
    sayac: cd0 - 0.05, say2: cd0 + 3.3, say3: cd0 + 6.7,
    n1: T('n1'), degil: T('n1:1'), araba: T('n1:2') - 0.1, n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  // ——— iskele: Necmi vapurdan iner, yürür, her akşam beklediği yere bakar, beklemez, sağdan çıkar ———
  tm.nVar = tm.alir + 0.2; tm.nDon = tm.nVar + 0.05; tm.nGit = tm.yuru;
  // ——— ev: Nermin Hanım kapıdan çıkar, arabaya yürür, biner, kalkar ———
  tm.kapiAc = tm.ev - 0.4; tm.nerVar = tm.ev + 0.85; tm.kapiK = tm.ev + 0.5;
  tm.aKapi = tm.nerVar + 0.02; tm.binN = tm.aKapi + 0.2; tm.aKapan = tm.binN + 0.5; tm.kalk = tm.aKapan + 0.25;
  // ——— yol: araba sağdan girer (her zamanki hız), Necmi'yi görünce durur; Necmi biner; araba döner, sağdan çıkar ———
  tm.fren = tm.gor - 0.02; tm.dur = tm.fren + 0.55; tm.yKapi = tm.dur + 0.06; tm.binC = tm.yKapi + 0.2; tm.yKapan = tm.binC + 0.5;
  tm.don = Math.max(tm.yKapan + 0.2, tm.hemen + 0.25); tm.git = tm.don + 0.5;
  tm.varis = tm.git + 0.8;
  tm.dur2 = tm.vardik + 0.02; tm.gulus = tm.dur2 + 0.15;

  const film = H.sahneler([
    { id: 'kanca', mekan: OFIS, t0: 0, kay: [-40, 0], cam: [[0, 0.98, 600, 990]] },
    { id: 'iskele', mekan: ISKELE, geri: true, t0: tm.geri, kay: [-50, 0], cam: [[0, 1.25, 720, 1150]] },
    { id: 'ev', mekan: EV, geri: true, t0: tm.ev, cam: [[0, 1.25, 640, 1420]] },   // araba ve Nermin altyazının üstünde
    { id: 'yol', mekan: YOL, geri: true, t0: tm.yol, cam: [[0, 1.25, 560, 1410]] },
    { id: 'varis', mekan: EV, geri: true, t0: tm.varis, cam: [[0, 1.25, 400, 1405]] },               // kamera arabayı izler (kamera())
    { id: 'hikmet', mekan: OFIS, t0: tm.ofis, kay: [50, 0], cam: [[0, 1.4, 1205, 975]] },
    { id: 'sayac', mekan: OFIS, t0: tm.sayac, cam: [[0, 1.3, 430, 1010]] },                            // doğrusal itme kamera() ile
    { id: 'say2', mekan: OFIS, t0: tm.say2, cam: [[0, 1.3, 1150, 990]] },
    { id: 'say3', mekan: OFIS, t0: tm.say3, kesme: false, cam: [[0, 1.3, 1150, 990]] },                // Defne'ye ve pencereye kayar (kesmesiz)
    { id: 'buldum', mekan: OFIS, t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.36, 820, 975]] },
    { id: 'cevap', mekan: OFIS, t0: tm.cevap, kesme: false, cam: [[0, 1.3, 780, 975]] },
    { id: 'cta', mekan: OFIS, t0: tm.cta, kesme: false, cam: [[0, 1.34, 860, 975]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— ofis pozları (önden) ———
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'notr', head: { tilt: -3, look: [0.75, -0.25] }, ...POZ.dur });
  const nec = [
    [tm.indim - 0.2, { head: { tilt: 4, look: [0.55, 0.15] } }, 0.35],
    [tm.sayac, { expr: DALGIN, head: { tilt: 3, look: [0.85, -0.2] } }, 0.01],
    [tm.sayac + 1.6, { expr: NGULUS, head: { tilt: -3, look: [0.75, -0.05] } }, 0.35],
    [tm.sayac + 2.6, { head: { tilt: 4, look: [0.9, -0.3] } }, 0.35],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: SASKIN, head: { tilt: 4, look: [-0.85, -0.2] }, ...POZ.dur });
  const def = [
    [0.3, { head: { tilt: -3, look: [-0.8, -0.3] } }, 0.3],
    [1.6, { expr: MERAK, head: { tilt: 3, look: [-0.85, 0.0] } }, 0.35],
    [tm.ofis, { expr: 'notr', head: { tilt: -3, look: [0.75, -0.05] } }, 0.01],
    [tm.kac, { expr: MERAK, head: { tilt: 4, look: [0.8, -0.1] } }, 0.3],
    [tm.say2, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -5, look: [0.2, -0.55] } }, 0.01],
    [tm.say2 + 1.4, { head: { tilt: 4, look: [-0.3, -0.6] } }, 0.4],
    [tm.say3 - 0.2, { expr: MERAK, armR: POZ.dur.armR, head: { tilt: -3, look: [-0.85, -0.1] } }, 0.4],
    [tm.say3 + 1.6, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 4, look: [-0.8, -0.25] } }, 0.4],
    [tm.n1 - 0.25, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -2, look: [-0.2, 0.05] } }, 0.3],
    [tm.araba - 0.1, { head: { tilt: 3, look: [-0.85, -0.05] } }, 0.3],
    [tm.n1s + 0.45, { expr: GULUS, head: { tilt: -3, look: [-0.25, 0.05] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, -0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -4, look: [0.05, 0.05] } }, 0.3],
  ];
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'notr', head: { tilt: -3, look: [-0.7, -0.05] }, ...POZ.dur });
  const hik = [
    [tm.kac - 0.3, { head: { tilt: 4, look: [-0.8, 0.05] } }, 0.3],
    [tm.say2, { expr: IFADE.dusun2, head: { tilt: 4, look: [-0.3, -0.55] } }, 0.01],
    [tm.say2 + 1.8, { expr: SASKIN, head: { tilt: -4, look: [-0.5, -0.4] } }, 0.3],
  ];
  // Altyazı çizelgesi (yalnız balon): n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar ekranda kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.3 } : l) };
  return { tm, film, tlA, necBase, nec, defBase, def, hikBase, hik };
}

// ═══════════════════════════ Arabanın durumu (tek kaynak) ═══════════════════════════
// Dönen: { c (yerel çerçeve), f (yön), hizli }
function arabaAt(S, t, sahneId) {
  const { tm } = S, base = { y: 0, renk: KIRAZ, golge: KIRAZ_G, kapi: 0, tit: 0, egim: 0 };
  if (sahneId === 'ev') {   // evin önünde park hâlinde, sola bakar; Nermin binince kalkar
    const x0 = 520, d = kalkis(t, tm.kalk, V);
    const kapi = pIn(t, tm.aKapi, tm.aKapan, 0.2, 0.2);
    const calis = t >= tm.aKapan;
    return { c: { ...base, x: x0 - d, y: EV_TABAN + 110, kapi, aci: d / CAR.r, tit: calis ? 1.2 * Math.sin(t * 90) : 0, egim: -2 * H.nabiz(t, tm.kalk, 0.4), fren: false }, f: -1, hizli: calis && d > 0 };
  }
  if (sahneId === 'yol') {
    const y = 1590;
    if (t < tm.git) {   // sağdan girer (sola), görünce frenler, durur
      const xs0 = 560 + 540 + 273 + 10 - 0;                                              // girişte burun sağ kenarda
      const xFren = xs0 - V * (tm.fren - tm.yol), xDur = xFren - durus(1e9, 0, V, 0.55);
      const x = t < tm.fren ? xs0 - V * (t - tm.yol) : xFren - durus(t, tm.fren, V, 0.55);
      const dYol = xs0 - x, kapi = pIn(t, tm.yKapi, tm.yKapan, 0.2, 0.2);
      const f = t < tm.don ? -1 : lerp(-1, 1, ease.state(seg(t, tm.don, 0.5)));
      return { c: { ...base, x, y, kapi, aci: dYol / CAR.r, egim: 2.5 * H.nabiz(t, tm.dur - 0.1, 0.4), fren: t >= tm.fren && t < tm.don, tit: 1.2 * Math.sin(t * 90) }, f, hizli: t < tm.fren, xDur };
    }
    const xs0 = 560 + 540 + 273 + 10, xFren = xs0 - V * (tm.fren - tm.yol), xDur = xFren - durus(1e9, 0, V, 0.55);
    const d = kalkis(t, tm.git, V);
    return { c: { ...base, x: xDur + d, y, aci: (xs0 - xDur + d) / CAR.r, egim: -2 * H.nabiz(t, tm.git, 0.4), tit: 1.2 * Math.sin(t * 90) }, f: 1, hizli: true, xDur };
  }
  if (sahneId === 'varis') {   // soldan girer (sağa), evin önünde durur
    const D = tm.dur2 - tm.varis, x0 = 150, d = durus(t, tm.varis, V, D);
    return { c: { ...base, x: x0 + d, y: EV_TABAN + 110, aci: d / CAR.r, egim: 2.5 * H.nabiz(t, tm.dur2 - 0.1, 0.4), fren: t >= tm.dur2 - 0.6 && t < tm.dur2 + 0.6, tit: 1.2 * Math.sin(t * 90) }, f: 1, hizli: false };
  }
  return null;
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç perdesi sahneyi örtmesin)
  kuyruksuz: (t, B) => !!B.sc.geri,
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id, lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
    if (id === 'varis') { const a = arabaAt(S, t, 'varis'); cam.cx = a.c.x + 40; cam.cy = 1405; cam.zoom = 1.25; }
    else if (id === 'sayac') Object.assign(cam, { zoom: lg(1.3, 1.37, clamp01((t - tm.sayac) / 3.35)), cx: 430, cy: 1010 });
    else if (id === 'say2') Object.assign(cam, { zoom: lg(1.3, 1.36, clamp01((t - tm.say2) / 3.4)), cx: 1150, cy: 990 });
    else if (id === 'say3') {   // 0,8 sn'de Defne ve pencereye kayar, sonra kesime kadar doğrusal itme
      const u = ease.state(seg(t, tm.say3, 0.8)), z = lg(1.3, 1.42, clamp01((t - tm.say3 - 0.8) / (tm.buldum - tm.say3 - 0.8)));
      Object.assign(cam, { zoom: z, cx: lerp(1150, 735, u), cy: lerp(990, 975, u) });   // Hikmet'in yüzü kadrajın tamamen dışında
    }
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    hap(K, t, tm.geri + 0.2, tm.geri + 1.75, K.up('dün akşam'), { x: 540, y: 575 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (067'den): perde yok, alt bantta. Daire solda, başlık ve paylaşım hapı sağında.
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
function sahne(K, t, tl, S, B) {
  const id = B.sc.id;
  if (B.sc.mekan === ISKELE) return iskeleSahne(K, t, S, B);
  if (id === 'ev' || id === 'varis') return evSahne(K, t, S, B);
  if (B.sc.mekan === YOL) return yolSahne(K, t, S, B);
  return ofisSahne(K, t, tl, S, B);
}

// ——— Ofis ———
function ofisSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, OFIS, 'arka', t, { isik: M.ISIK.sabah });
  // Hikmet (masanın arkasında; elinde çay)
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), hO = { heads };
  const hCay = [hp.x + 125, 1150];                     // çay sağ yanında (kol Defne'nin önüne geçmesin)
  let hBardakElde = false, hSay = 0, hEl = false;
  if (id === 'hikmet') {
    const k = H.nabiz(t, tm.kac - 0.1, 0.6);                                      // "kaç dakika": çay bardağıyla Defne'yi gösterir
    hO.R = [[hCay[0] + 8, hCay[1] - 26 - 40 * k], 1, 'A']; hBardakElde = true;
  } else if (id === 'say2' || id === 'say3') {                                   // parmak hesabı: bir, iki, üç… (sesi yok)
    const el = H.elYeri('hikmet', hp, 'R', 'yukari'), w = W(t, tm.say2 + 0.1, 0.28) * (1 - W(t, tm.say2 + 3.3, 0.3));
    hO.R = [el, w, 'B'];
    hSay = [0, 1, 2, 3].reduce((n, k) => n + seg(t, tm.say2 + 0.45 + k * 0.55, 0.2), 0) + 1;
    if (w < 0.5) hSay = 0;
  }
  const hc = oyna(K, t, tl, 'hikmet', hp, hO);
  masaCiz(K);
  if (!hBardakElde) bardak(K, hCay[0], MASA.y, { buhar: true, t });
  else { bardak(K, hc.handR[0] - 8, hc.handR[1] + 26, { buhar: true, t }); hc.tut('R'); }
  if (hEl) hc.parmak('L', 4, { toplam: 4, yon: Math.PI + 0.25, ac: 0.24 });
  if (hSay > 0.01) hc.parmak('R', hSay, { toplam: 5, ac: 0.3 });

  // Necmi (pencerenin solunda; sol elinde çay, sağ eliyle pencereyi gösterir)
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t), nO = { heads };
  const nCay = [np.x - 60, 1215];
  nO.L = [[nCay[0] - 8, nCay[1] - 26], 1, 'A'];
  let nGos = null;
  if (id === 'kanca') {
    const w = 1 - W(t, tm.indim - 0.1, 0.3), vp = [VAPUR_PEN(t), PEN_UFUK + 30];
    const pomp = 18 * H.nabiz(t, 0.3, 0.36) + 14 * H.nabiz(t, tm.vapurGos, 0.34);
    if (w > 0.01) { nO.R = [[NEC_X + 250 - pomp * 0.5, 1010 - pomp], w, 'B']; if (w > 0.6) nGos = vp; }
    H.onayla(np, t, tm.indim, 1, 0.42);
  } else if (id === 'sayac') H.onayla(np, t, tm.sayac + 1.8, 2, 0.38);
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  bardak(K, nc.handL[0] + 8, nc.handL[1] + 26, { buhar: true, t }); nc.tut('L');
  if (nGos) nc.isaret('R', nGos);

  // Defne
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t), dO = { heads };
  dp.y -= H.buldumHop(t, tm.buldum);
  let dGos = null, dBir = 0;
  if (id === 'say3') {
    if (t > tm.araba - 0.4) dp.blink = 0;                                         // işaret ederken ve kesimden önce göz kırpmaz
    for (const a of [tm.degil - 0.05, tm.degil + 0.3]) dp.head = { ...dp.head, tilt: (dp.head.tilt || 0) + 5 * Math.sin(TAU * seg(t, a, 0.35)) };   // "değil": başını iki yana sallar
    const kirmizi = TRAFIK.find(a => a[2] === KIRAZ), car = [trafikX(kirmizi, t), PEN_YOL - 10];
    const wG = pIn(t, tm.araba - 0.2, tm.n1s + 0.5, 0.28), wB = W(t, tm.n1s + 0.75, 0.28);
    if (wG > 0.01) { dO.L = [[dp.x - 230, 1000], wG, 'B']; if (wG > 0.6) dGos = car; }
    H.onayla(dp, t, tm.n1s + 0.7, 1, 0.42);                                          // ipucundan sonra başını sallar, gülümser
  } else if (id === 'cevap') {
    const wG = W(t, tm.cevap + 0.2, 0.28); dO.L = [[dp.x - 230, 1000], wG, 'B']; if (wG > 0.6) dGos = [PEN.x + PEN.w / 2, PEN_YOL - 10];
  }
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (dGos) dc.isaret('L', dGos);
  if (dBir > 0) dc.parmak('R', dBir, { toplam: 1 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// ——— İskele (dün akşam): Necmi vapurdan iner, her akşamki yere bakar, beklemez, yürür ———
function iskeleSahne(K, t, S, B) {
  const { tm } = S, key = 'necmi', s = sD(key);
  M.mekanCiz(K, ISKELE, 'arka', t, { isik: M.ISIK.aksam });
  const X0 = 560, X1 = 800, X2 = 1360, poz = { expr: DALGIN, head: { tilt: 2, look: [0.6, 0] } };
  let p;
  if (t < tm.nVar) p = H.yuru(key, t, { t0: tm.geri - 0.4, t1: tm.nVar, x0: X0 - 90, x1: X1, s, poz });
  else if (t < tm.nGit) {   // önden: her akşam beklediği yere (lambanın dibine) bakar; bakınır; omuz silker
    const look = H.iz([[0, 0.8], [tm.nDon + 0.5, -0.6, 0.35], [tm.nDon + 0.95, 0.85, 0.35], [tm.bekle + 0.4, 0.3, 0.3]], t);
    p = H.kisi(key, { x: X1, s, expr: t < tm.bekle ? MERAK : NGULUS, head: { tilt: look * 4, look: [look, -0.05] }, ...POZ.dur });
    H.omuzSilk(p, t, tm.bekle - 0.05, 0.4);
  } else p = H.yuru(key, t, { t0: tm.nGit, t1: tm.ev + 0.15, x0: X1, x1: X2, s, poz: { expr: NGULUS, head: { tilt: 0, look: [0.6, 0] } } });
  oyna(K, t, null, key, p, { sessiz: true });
}

// ——— Ev (dün akşam): Nermin Hanım çıkar, biner, sola gider · varış: araba soldan gelir, evin önünde durur ———
function evSahne(K, t, S, B) {
  const { tm } = S, id = B.sc.id, I = M.ISIK.aksam;
  const kapi = id === 'ev' ? W(t, tm.kapiAc, 0.25) * (1 - W(t, tm.kapiK, 0.3)) : 0;
  const kedi = id === 'varis' ? pIn(t, tm.dur2 + 0.1, 1e9, 0.3) : 0;
  M.mekanCiz(K, EV, 'arka', t, { isik: I, durum: { kapi, kedi } });
  const a = arabaAt(S, t, id), c = a.c;
  const ner = NER, sN = sD(ner);
  if (id === 'ev') {
    const ayakX = c.x - OTUR[ner].cik, ayakY = c.y + 10;
    if (t < tm.binN) {   // kapıdan çıkar, arabanın önüne yürür (sola); kapı koluna uzanır
      const p = H.yuru(ner, t, { t0: tm.ev - 0.25, t1: tm.nerVar, x0: KAPI.x + KAPI.w / 2, x1: ayakX, s: sN, poz: { expr: GULUS, head: { tilt: 0, look: [0.6, 0] } } });
      p.y = lerp(EV_TABAN + 4, ayakY, ease.state(clamp01(p.u * 5)));
      const wk = W(t, tm.aKapi - 0.25, 0.22);
      arabaGrup(K, c, a.f, { t, egz: false, on: [() => {
        // yerel çerçevede: dünyadaki duruşu yansıt (yüz sola → yerelde sağa)
        const q = { ...p, x: 2 * c.x - p.x, facing: -(p.facing || 1) };
        oyna(K, t, null, ner, q, { sessiz: true, R: wk > 0.01 ? [kolYeri(c), wk, 'A'] : undefined });
      }] });
      return;
    }
    const u = 1 - seg(t, tm.binN, 0.5), p = binis(ner, c, u, 10, { expr: GULUS });
    const icte = u < 0.38, wd = 1 - ease.state(seg(u, 0, 0.3));
    const ciz = () => oyna(K, t, null, ner, p, { sessiz: true, R: [dirYeri(c), wd, 'A'], L: [dirYeri(c, true), wd, 'A'] });
    arabaGrup(K, c, a.f, { t, hizli: a.hizli, egz: t >= tm.aKapan, ic: icte ? [ciz] : [], on: icte ? [] : [ciz] });
    return;
  }
  // varış: ikisi de koltukta; durunca birbirine bakıp gülümser, Necmi başını sallar
  const gul = W(t, tm.gulus, 0.3);
  const pN = binis(ner, c, 0, 10, { expr: gul > 0.5 ? GULUS : NGULUS, lean: 4 });
  pN.head = { ...pN.head, tilt: -4 * gul, look: [lerp(0.6, -0.7, gul), 0] };
  const pM = binis('necmi', c, 0, 10, { expr: gul > 0.5 ? NGULUS : DALGIN, lean: 3 });
  pM.head = { ...pM.head, look: [0.6, 0] }; H.onayla(pM, t, tm.gulus + 0.2, 1, 0.42);
  arabaGrup(K, c, a.f, { t, ic: [
    () => oyna(K, t, null, ner, pN, { sessiz: true, R: [dirYeri(c), 1, 'A'], L: [dirYeri(c, true), 1, 'A'] }),
    () => oyna(K, t, null, 'necmi', pM, { sessiz: true }),
  ] });
}

// ——— Sahil yolu (dün akşam): Necmi yürür (sağa); araba sağdan gelir, durur; Necmi biner; araba döner, sağdan çıkar ———
function yolSahne(K, t, S, B) {
  const { tm } = S, ner = NER, key = 'necmi', s = sD(key);
  M.mekanCiz(K, YOL, 'arka', t, { isik: M.ISIK.aksam });
  const a = arabaAt(S, t, 'yol'), c = a.c, cikY = 100;
  const durX = a.xDur - OTUR.necmi.cik;            // yansımada yerel cik → dünya: c.x − cik (f = −1)
  // Nermin: koltukta, direksiyonda; görünce el sallar (direksiyondan bir el)
  const sal = 0;   // el sallamak yüzü örtüyordu (baş büyük, kol kısa): görünce öne eğilip gülümser
  const pN = binis(ner, c, 0, cikY, { expr: t >= tm.gor ? GULUS : DALGIN, lean: 5 + 6 * H.nabiz(t, tm.dur - 0.1, 0.45) + 8 * pIn(t, tm.gor, tm.binC, 0.3) });
  pN.head = { ...pN.head, look: [t >= tm.yKapan ? -0.6 : 0.4, 0] };
  const nerCiz = () => {
    const R = sal > 0.01 ? [[c.x + 110, c.y - 530 + 10 * Math.sin((t - tm.gor) * 14)], sal, 'B'] : [dirYeri(c), 1, 'A'];   // el başın üstünde, yüzün önüne geçmez
    const r = oyna(K, t, null, ner, pN, { sessiz: true, R, L: [dirYeri(c, true), 1, 'A'] });
    if (sal > 0.5) r.parmak('R', 4, { toplam: 4, ac: 0.26 });
  };
  // Necmi: yürür → durur (önden), el sallar → biner → koltukta
  let necIc = null, necOn = null, necDis = null;
  if (t < tm.dur - 0.05) {
    const p = H.yuru(key, t, { t0: tm.yol - 0.3, t1: tm.dur - 0.05, x0: -140, x1: durX, y: c.y + cikY, s, poz: { expr: DALGIN, head: { tilt: 0, look: [0.6, 0] } } });
    if (t >= tm.gor + 0.1) p.expr = NGULUS;
    necDis = () => oyna(K, t, null, key, p, { sessiz: true });
  } else if (t < tm.binC) {   // önden: el sallar, kapı koluna uzanır
    const p = H.kisi(key, { x: durX, y: c.y + cikY, s, expr: NGULUS, head: { tilt: 3, look: [0.6, -0.1] }, ...POZ.dur });
    const wk = W(t, tm.yKapi - 0.2, 0.22);
    const kl = kolYeri(c), kol = [2 * c.x - kl[0], kl[1]];   // kapı kolu (dünya; yansıma)
    necDis = () => oyna(K, t, null, key, p, { sessiz: true, R: wk > 0.01 ? [kol, wk, 'A'] : undefined });
  } else {
    const u = 1 - seg(t, tm.binC, 0.5), p = binis(key, c, u, cikY, { expr: NGULUS });
    const ciz = () => oyna(K, t, null, key, p, { sessiz: true });
    if (u < 0.38) necIc = ciz; else necOn = ciz;
  }
  arabaGrup(K, c, a.f, { t, hizli: a.hizli, ic: necIc ? [nerCiz, necIc] : [nerCiz], on: necOn ? [necOn] : [] });
  if (necDis) necDis();
}
