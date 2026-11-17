// Bölüm 56 · NECMİ'NİN İKİ ANNESİ (v4 "hikâye" dili; storyboard: hikayeler/bolum_056_v5.md). Mekanizma: zaman aralığı.
// Logline: Necmi pazar günleri durağa rastgele bir saatte gelip ilk gelen otobüse biner. Kadıköy otobüsü de Üsküdar otobüsü
// de tam 10 dakikada bir geçer, ama Necmi on pazarın dokuzunda annesine, Kadıköy'e gider; kaynanası ona küsmüştür.
// Akılda kalacak tek şey: Üsküdar otobüsü Kadıköy otobüsünden hep 1 dakika sonra geçer; Üsküdar'a 1 dakikalık şans kalır.
// Mekân: İstanbul sokağında otobüs durağı (önden): saatli direk, direkte durak tabelası, sağda durak sığınağı, önde yol.
//   Otobüsler öndeki şeritte soldan sağa geçer (vektör kuralı). Kısa plan: Kadıköy'deki anne ve Üsküdar'daki kaynana
//   kendi pencerelerinde (aynı dünyada x 2700–3800).
// Kahraman an: direkteki saat yükselip 10 dakikalık daireye dönüşür; ibre bir tur döner, 1 dilim mavi, 9 dilim turuncu
//   boyanır; Necmi'nin 10 pazarı sabit listeden daireye birer nokta olarak düşer (9 turuncu, 1 mavi).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const DURAK = 'b056_durak', EVLER = 'b056_evler';
const NEC_X = 200, DEF_X = 520, HIK_X = 800;
const SAAT0 = [962, 690], SAAT_R = 72;                             // saatli direk (sağda)
const DIAL = [540, 466], DIAL_R = 262;                             // kahraman anda 10 dakikalık daire
const TAB = { x: 100, y: 598, w: 700, h: 160 };                    // durak tabelası (sığınağın üstünde, iki satır)
const AD_X = TAB.x + 116;                                          // hat adı bandının ortası
const SUT = i => TAB.x + 304 + i * 112;                            // i. saatin ortası (i = 0..3; 4: "…")
const SATIR = r => TAB.y + 43 + r * 74;                            // r. satırın ortası (0 Kadıköy, 1 Üsküdar)
const SIG = { x0: 140, x1: 840, cat: 830 };                        // sığınak
const KALDIRIM = 1420, BORDUR = 1565, YB = 1795;                   // kaldırım arkası, bordür, otobüs tekerlek tabanı
const BUS_L = 1150, BUS_H = 450;
const TURUNCU = '#E9822B', TURUNCU_K = '#C66A1E', MAVI = '#3B7DBE', MAVI_K = '#2C6299';
const MERCAN = PAL.coral;
const GENIS = [1.0, 540, 1060];
const EV_K = 2965, EV_U = 3535, PEN = { y0: 860, y1: 1300, w: 330 };   // Kadıköy ve Üsküdar evlerinin pencere ortası
const FIG_S = 215, FIG_Y = 1470;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Necmi'nin 10 pazarı ve mantık denetimi ═══════════════════════════
// Varış saatleri [saat, dakika] sabit listedir (rastgele görünür, her render'da aynıdır).
const PAZAR = [[10, 23.5], [11, 47.2], [13, 5.8], [15, 32.4], [9, 58.1], [12, 16.7], [16, 40.6], [14, 9.3], [17, 21.9], [11, 34.0]];
// İlk gelen otobüs: Kadıköy :00 :10 :20 …, Üsküdar :01 :11 :21 … (ikisi de tam 10 dakikada bir).
function ilkOtobus(saat, dk) {
  const m = saat * 60 + dk;
  const k = Math.ceil(m / 10) * 10, u = Math.ceil((m - 1) / 10) * 10 + 1;
  return k <= u ? 'K' : 'U';
}
const SONUC = PAZAR.map(([s, d]) => ilkOtobus(s, d));
(function denetle() {
  const hata = [];
  const nK = SONUC.filter(x => x === 'K').length, nU = SONUC.filter(x => x === 'U').length;
  if (nK !== 9 || nU !== 1) hata.push(`pazar: ${nK} Kadıköy, ${nU} Üsküdar (9 / 1 olmalı)`);
  PAZAR.forEach(([s, d], i) => { const m = d % 10, dilim = m > 0 && m <= 1 ? 'U' : 'K'; if (dilim !== SONUC[i]) hata.push(`pazar ${i + 1}: dilim ${dilim}, otobüs ${SONUC[i]}`); });
  let u = 0; const n = 6000; for (let i = 0; i < n; i++) if (ilkOtobus(12, (i + 0.5) * 10 / n) === 'U') u++;
  if (Math.abs(u / n - 0.1) > 0.002) hata.push('Üsküdar payı ' + (u / n).toFixed(3));
  if (hata.length) console.warn('b056: denetim tutmadı', hata.join(', '));
})();

// ═══════════════════════════ Figüran kartları (bölüme özgü, b056_ önekli) ═══════════════════════════
const FIG = [
  // [anahtar, gövde, gölge, bacak, ten, ten gölgesi, saç, özellikler]
  ['b056_anne', '#B4553B', '#963F2A', '#4A3F3A', '#E8B892', '#CF9E78', '#C9C2B8', ['cardigan', 'bun', 'glassesCat', 'earrings', 'lashes']],
  ['b056_kaynana', '#55707A', '#435A62', '#33302E', '#DDA684', '#C28B68', '#8F8780', ['jacket', 'bun', 'glassesRect', 'lashes']],
];
for (const [key, gov, gol, bac, ten, tenG, sac, ozl] of FIG) {
  const b = H.CARDS.defne;
  if (!H.CARDS[key]) H.CARDS[key] = {
    ...b, key, name: 'Figüran', seed: key === 'b056_anne' ? 561 : 563,
    torso: { ...b.torso, color: gov, shade: gol, belly: 0.06 },
    arm: { ...b.arm, color: gov, shade: gol },
    leg: { ...b.leg, color: bac, shade: bac }, skin: ten, skinShade: tenG, hair: sac, features: ozl,
  };
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Baklava kutusu: (x, yu) üst kenarın ortası; ip ile elde taşınır (el = ipin tepesi)
function kutu(K, x, yu, k = 1, { ip = null } = {}) {
  const { ctx } = K, w = 92 * k, h = 50 * k;
  if (ip) { K.line(x - 20 * k, yu, ip[0], ip[1], 3.5); K.line(x + 20 * k, yu, ip[0], ip[1], 3.5); }
  K.rect(x - w / 2, yu, w, h, '#F3E3C2', LW * 0.7 * Math.min(1, k + 0.2), 6 * k);
  ctx.fillStyle = '#C8432F'; ctx.fillRect(x - 6 * k, yu + 2, 12 * k, h - 4); ctx.fillRect(x - w / 2 + 2, yu + h * 0.42, w - 4, 9 * k);
  K.rect(x - w / 2, yu, w, h, null, LW * 0.7 * Math.min(1, k + 0.2), 6 * k);
  K.ell(x - 11 * k, yu - 3 * k, 11 * k, 6 * k, '#C8432F', 2.5); K.ell(x + 11 * k, yu - 3 * k, 11 * k, 6 * k, '#C8432F', 2.5);
}
// Otobüs (yandan, sağa gider): xf ön tamponun x'i; ad hat adı (tr-TR büyük harf)
function otobus(K, xf, renk, koyu, ad, t, hareket = 1) {
  const { ctx } = K, x0 = xf - BUS_L, top = YB - BUS_H, alt = YB - 46;
  if (xf < -60 || x0 > 1700) return;
  if (hareket > 0.05) H.puf(K, x0 - 10, alt - 20, t, { k: 0.7, n: 3, periyot: 0.6, yon: Math.PI, yol: 90, kalk: 30 });
  K.rect(x0, top, BUS_L, alt - top, renk, LW, 34);
  ctx.save(); ctx.beginPath(); ctx.roundRect(x0, top, BUS_L, alt - top, 34); ctx.clip();
  ctx.fillStyle = koyu; ctx.fillRect(x0, alt - 70, BUS_L, 70);
  ctx.fillStyle = '#F4EDE0'; ctx.fillRect(x0, top + 196, BUS_L, 12);
  ctx.restore();
  K.rect(x0, top, BUS_L, alt - top, null, LW, 34);
  // pencereler (yolcular yok: düz cam)
  for (let i = 0; i < 5; i++) K.rect(x0 + 40 + i * 168, top + 40, 148, 132, '#BFD6D2', LW * 0.8, 12);
  // ön cam ve kapı
  K.poly([[xf - 205, top + 40], [xf - 28, top + 40], [xf - 10, top + 200], [xf - 205, top + 200]], '#BFD6D2', LW * 0.8);
  K.rect(xf - 330, top + 40, 110, alt - top - 52, '#BFD6D2', LW * 0.8, 10); K.line(xf - 275, top + 46, xf - 275, alt - 16, 4);
  // hat tabelası (ön üst) ve yan yazı
  K.rect(xf - 200, top + 8, 170, 28, '#1F2421', 3, 6);
  K.text(ad, xf - 115, top + 32, 24, '#F2B34A', 900);
  K.text(ad, x0 + 400, top + 286, 70, PAL.paper, 900);
  // far ve tampon
  K.rect(xf - 34, alt - 64, 28, 30, '#F7E7A8', 3, 6);
  K.rect(xf - 60, alt - 18, 62, 22, '#4A4F57', 3, 6);
  K.rect(x0 - 4, alt - 18, 62, 22, '#4A4F57', 3, 6);
  // tekerlekler (dönen göbek)
  for (const wx of [x0 + 210, xf - 230]) {
    K.circ(wx, YB - 58, 60, '#2B2F33', LW);
    K.circ(wx, YB - 58, 28, '#B9C0BA', 4);
    const a = xf / 60;
    for (let j = 0; j < 3; j++) { const b = a + j * TAU / 3; K.line(wx, YB - 58, wx + Math.cos(b) * 24, YB - 58 + Math.sin(b) * 24, 4); }
  }
}
// Durak tabelası (direkte): başlıklar ve saatler; vurgu: { K: 0..1, U: 0..1 } başlık nabzı (ölçek yok, renk kontur)
function tabela(K, vurgu = {}) {
  const { x, y, w, h } = TAB, { ctx } = K;
  // ayaklar (sığınak çatısına oturur)
  for (const px of [x + 120, x + w - 120]) K.rect(px - 9, y + h - 6, 18, SIG.cat - y - h + 10, '#4A4F57', LW * 0.7, 3);
  K.rect(x - 8, y - 8, w + 16, h + 16, '#4A4F57', LW, 14);
  K.rect(x, y, w, h, '#F4EDE0', LW * 0.6, 10);
  for (const [k, r, renk, ad, son] of [['K', 0, TURUNCU, 'kadıköy', 0], ['U', 1, MAVI, 'üsküdar', 1]]) {
    const cy = SATIR(r);
    K.rect(x + 8, cy - 32, 216, 64, renk, LW * 0.6, 8);
    const v = vurgu[k] || 0;
    if (v > 0.01) { ctx.save(); ctx.globalAlpha = v; ctx.lineWidth = 8; ctx.strokeStyle = PAL.mustard; ctx.beginPath(); ctx.roundRect(x + 2, cy - 38, 228, 76, 11); ctx.stroke(); ctx.restore(); }
    K.text(K.up(ad), AD_X, cy + 16, 44, PAL.paper, 900);
    for (let i = 0; i < 4; i++) K.text(`:${i}${son}`, SUT(i), cy + 16, 46, INK, 900);
    K.text('…', SUT(4) - 20, cy + 16, 46, INK, 900);
  }
  K.line(x + 238, y + h / 2, x + w - 12, y + h / 2, 3, '#C9BFAE');
}
// Mini otobüs (önden): dairenin kenar işareti
function miniOtobus(K, x, y, renk, k = 1) {
  K.rect(x - 26 * k, y - 22 * k, 52 * k, 44 * k, renk, 4, 10 * k);
  K.rect(x - 19 * k, y - 15 * k, 38 * k, 17 * k, '#BFD6D2', 3, 4 * k);
  K.circ(x - 13 * k, y + 12 * k, 4.5 * k, '#F7E7A8', 2.5); K.circ(x + 13 * k, y + 12 * k, 4.5 * k, '#F7E7A8', 2.5);
}
// Direkteki saat / kahraman anda 10 dakikalık daire.
//   dakika: saatin gösterdiği an (gün içi dakika). o.on: 0 normal kadran, 1 on dakikalık kadran.
//   o.ibre10: on dakikalık kadranda ibrenin açısı (derece), o.boya: boyanmış açı (derece; 0–36 mavi, 36–360 turuncu)
function saatCiz(K, [cx, cy], r, dakika, t, { on = 0, ibre10 = 0, boya = 0, ikon = 0 } = {}) {
  const { ctx } = K;
  K.circ(cx, cy, r + r * 0.14, '#4A4F57', LW);
  K.circ(cx, cy, r, PAL.cream, LW);
  const dilim = (a0, a1, renk) => {
    if (a1 <= a0 + 0.01) return;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r - 3, (a0 - 90) * D2R, (a1 - 90) * D2R); ctx.closePath(); ctx.fillStyle = renk; ctx.fill();
  };
  if (on > 0.01 && boya > 0) { dilim(0, Math.min(36, boya), MAVI); dilim(36, boya, TURUNCU); }
  // kadran çentikleri
  ctx.save(); ctx.globalAlpha = 1 - on;
  for (let i = 0; i < 12; i++) { const a = i * 30 * D2R; K.line(cx + Math.sin(a) * r * 0.78, cy - Math.cos(a) * r * 0.78, cx + Math.sin(a) * r * 0.9, cy - Math.cos(a) * r * 0.9, i % 3 ? 3 : 5); }
  ctx.globalAlpha = on;
  if (on > 0.01) {
    for (let i = 0; i < 10; i++) { const a = i * 36 * D2R; K.line(cx + Math.sin(a) * r * 0.86, cy - Math.cos(a) * r * 0.86, cx + Math.sin(a) * r, cy - Math.cos(a) * r, 6); }
    if (boya > 0) for (const a of [0, 36]) { const q = a * D2R; K.line(cx, cy, cx + Math.sin(q) * r, cy - Math.cos(q) * r, 5); }
  }
  ctx.restore();
  // hat işaretleri: Kadıköy :00'da (tepe), Üsküdar :01'de
  if (ikon > 0.01) {
    ctx.save(); ctx.globalAlpha = ikon;
    miniOtobus(K, cx, cy - r * 0.86, TURUNCU, r / 190);
    miniOtobus(K, cx + Math.sin(36 * D2R) * r * 0.86, cy - Math.cos(36 * D2R) * r * 0.86, MAVI, r / 190);
    ctx.restore();
  }
  // ibreler
  const h = dakika / 60, aH = (h % 12) / 12 * 360, aM = (dakika % 60) / 60 * 360;
  const aMin = lerp(aM, ibre10, on);
  const ibre = (a, L, w, renk = INK) => { const q = a * D2R; K.line(cx, cy, cx + Math.sin(q) * L, cy - Math.cos(q) * L, w, renk); };
  ctx.save(); ctx.globalAlpha = 1 - on; ibre(aH, r * 0.5, r * 0.09); ctx.restore();
  ibre(aMin, r * lerp(0.8, 0.6, on), r * 0.065);
  if (on < 0.99) { ctx.save(); ctx.globalAlpha = 1 - on; ibre((t % 60) * 6, r * 0.82, 3, MERCAN); ctx.restore(); }
  K.circ(cx, cy, Math.max(5, r * 0.07), INK, 0);
}
// Güvercin (sığınak çatısında yürür; döngü): (x, y) ayakların altı, yon ±1
function guvercin(K, x, y, yon, t) {
  const { ctx } = K, gag = Math.max(0, Math.sin(t * 9)) * 6;
  ctx.save(); ctx.translate(x, y); ctx.scale(yon, 1);
  K.line(-6, 0, -4, -14, 3, '#C9763A'); K.line(6, 0, 4, -14, 3, '#C9763A');
  K.ell(0, -28, 30, 18, '#9AA3A8', 4);
  K.poly([[-24, -34], [-46, -40], [-40, -24]], '#7E878C', 3);
  K.circ(24 + gag, -46 + gag * 0.6, 11, '#7E878C', 4);
  K.poly([[34 + gag, -48 + gag * 0.6], [44 + gag, -45 + gag * 0.6], [34 + gag, -42 + gag * 0.6]], '#E0A040', 2);
  K.circ(27 + gag, -49 + gag * 0.6, 2.4, INK, 0);
  ctx.restore();
}
// Kol saati (Hikmet'in bileğinde): el ile dirsek arasında
function kolSaati(K, el, dirsek) {
  const p = kar(el, dirsek, 0.28);
  K.rect(p[0] - 17, p[1] - 15, 34, 30, '#2B2F33', 3, 6);
  K.circ(p[0], p[1], 11, PAL.cream, 3);
  K.line(p[0], p[1], p[0], p[1] - 8, 2.5); K.line(p[0], p[1], p[0] + 6, p[1], 2.5);
}
// Ulaşım kartı (Defne, CTA)
function kart(K, x, y, k = 1) {
  K.rect(x - 46 * k, y - 30 * k, 92 * k, 60 * k, MAVI, 4, 9 * k);
  K.rect(x - 46 * k, y + 2 * k, 92 * k, 12 * k, TURUNCU, 0);
  K.rect(x - 46 * k, y - 30 * k, 92 * k, 60 * k, null, 4, 9 * k);
  K.rect(x - 34 * k, y - 20 * k, 22 * k, 16 * k, '#E0B84A', 2.5, 3);
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
const BINA = [[-600, 300, 560, '#D7B48E'], [-300, 260, 640, '#C98F6E'], [-40, 300, 520, '#E2CFA6'], [260, 240, 600, '#B79F7D'], [500, 330, 500, '#D9A889'],
  [830, 280, 590, '#CDBB98'], [1110, 300, 540, '#C4906F'], [1410, 300, 620, '#DCC6A0']];
M.mekanEkle(DURAK, {
  gen: [-600, 1700], dongu: ['direk saatinin saniye kolu', 'bulutlar', 'tabelanın üstünde güvercin'],
  capa: { tabela: [TAB.x + TAB.w / 2, TAB.y] }, kadraj: { genis: GENIS },
  arka(K, t, { isik }) {
    M.acikHava(K, { x0: -700, x1: 1800, floorY: KALDIRIM, isik, zemin: 'kaldirim', gunes: 0.32, siluet: true, t });
    for (const [x, w, top, renk] of BINA) {
      K.rect(x, top, w, KALDIRIM - top + 4, renk, LW, 4);
      K.rect(x - 8, top - 14, w + 16, 22, H.mixHex(renk, '#5A4A3A', 0.35), LW * 0.7, 4);
      for (let yy = top + 60; yy < KALDIRIM - 180; yy += 150) for (let xx = x + 34; xx < x + w - 70; xx += 92) K.rect(xx, yy, 54, 86, '#3D5F60', LW * 0.6, 5);
    }
    // yol: bordür, asfalt, şerit
    K.rect(-700, BORDUR, 2500, 900, '#5D6A61', 0);
    K.rect(-700, BORDUR - 14, 2500, 26, '#CFC7B5', LW * 0.7);
    for (let x = -650; x < 1800; x += 300) K.rect(x, 1890, 160, 16, '#E9E2D2', 0, 4);
    // sığınak: arka cam, oturak, çatı
    const { x0, x1, cat } = SIG;
    K.rect(x0 + 14, cat + 30, x1 - x0 - 28, 600, 'rgba(201,222,218,0.55)', LW * 0.7, 6);
    K.rect(x0, cat, 22, KALDIRIM + 80 - cat, '#4A4F57', LW * 0.8, 4);
    K.rect(x1 - 22, cat, 22, KALDIRIM + 80 - cat, '#4A4F57', LW * 0.8, 4);
    K.rect(x0 + 60, 1335, x1 - x0 - 120, 22, PAL.woodTop, LW * 0.8, 6);
    K.rect(x0 - 30, cat - 26, x1 - x0 + 60, 34, '#4A4F57', LW, 8);
  },
});
M.mekanEkle(EVLER, {
  gen: [2650, 3850], dongu: ['perdeler', 'martı'],
  arka(K, t, { isik }) {
    M.acikHava(K, { x0: 2500, x1: 4000, floorY: 1500, isik, zemin: 'kaldirim', gunes: 0.6, siluet: false, t });
    // martı (gökte süzülür)
    const u = ((t / 6) % 1 + 1) % 1, mx = lerp(2600, 3900, u), my = 560 + Math.sin(u * TAU) * 30, fl = Math.sin(t * 5) * 10;
    K.ctx.save(); K.ctx.lineJoin = 'round'; K.ctx.beginPath(); K.ctx.moveTo(mx - 34, my - fl); K.ctx.quadraticCurveTo(mx - 14, my - 18, mx, my); K.ctx.quadraticCurveTo(mx + 14, my - 18, mx + 34, my - fl); K.ctx.lineWidth = 5; K.ctx.strokeStyle = INK; K.ctx.stroke(); K.ctx.restore();
  },
});
// Ev cephesi ve penceresi; fig: pencerede duran figüranın çizimi
function ev(K, cx, renk, ad, adRenk, t, fig, kutular, vurgu = 0) {
  const { ctx } = K, x0 = cx - 265, top = 650;
  K.rect(x0, top, 530, 1500 - top + 4, renk, LW, 4);
  K.rect(x0 - 10, top - 16, 550, 26, H.mixHex(renk, '#5A4A3A', 0.35), LW * 0.7, 4);
  // levha
  ctx.font = '900 48px Rubik'; const lw = ctx.measureText(ad).width + 44, s = 1 + 0.12 * vurgu;
  ctx.save(); ctx.translate(cx, 770); ctx.scale(s, s); K.rect(-lw / 2, -38, lw, 70, adRenk, LW * 0.8, 10); K.text(ad, 0, 17, 48, PAL.paper, 900); ctx.restore();
  // pencere: iç, figüran, perdeler, çerçeve, pervaz
  const px = cx - PEN.w / 2;
  K.rect(px, PEN.y0, PEN.w, PEN.y1 - PEN.y0, '#3E5A58', 0);
  ctx.save(); ctx.beginPath(); ctx.rect(px, PEN.y0, PEN.w, PEN.y1 - PEN.y0); ctx.clip(); fig(); ctx.restore();
  const sal = Math.sin(t * 1.7 + cx) * 8;
  K.poly([[px, PEN.y0], [px + 62 + sal, PEN.y0], [px + 40 + sal * 1.6, PEN.y1 - 60], [px, PEN.y1 - 40]], '#EFE6D2', LW * 0.6);
  K.poly([[px + PEN.w, PEN.y0], [px + PEN.w - 62 - sal, PEN.y0], [px + PEN.w - 40 - sal * 1.6, PEN.y1 - 60], [px + PEN.w, PEN.y1 - 40]], '#EFE6D2', LW * 0.6);
  K.rect(px - 16, PEN.y0 - 16, PEN.w + 32, PEN.y1 - PEN.y0 + 16, null, 14);
  K.rect(px - 16, PEN.y0 - 16, PEN.w + 32, PEN.y1 - PEN.y0 + 16, null, LW);
  K.rect(px - 40, PEN.y1, PEN.w + 80, 30, '#E9DCC2', LW, 6);
  for (const [bx, by, k] of kutular) kutu(K, bx, by, k);
  // saksı
  K.poly([[px + PEN.w + 4, PEN.y1], [px + PEN.w + 60, PEN.y1], [px + PEN.w + 52, PEN.y1 - 56], [px + PEN.w + 12, PEN.y1 - 56]], '#B65E3C', 4);
  for (let i = 0; i < 3; i++) H.yaprak(K, px + PEN.w + 32, PEN.y1 - 56, 44, -Math.PI / 2 + (i - 1) * 0.55 + Math.sin(t * 1.3 + i) * 0.05, PAL.green, 1);
}

// ═══════════════════════════ Otobüs yolları ═══════════════════════════
// Gelip durağa duran otobüs: t0'da v hızla, tStop'ta xStop'ta durur (sabit yavaşlama); tGo'da kalkar (1 sn'de v'ye çıkar).
function busGelDur(t, { t0, tStop, xStop, tGo, v }) {
  const D = tStop - t0, d = v * D / 2;
  if (t < t0) return { x: xStop - d - v * (t0 - t), h: 1 };
  if (t < tStop) { const u = (t - t0) / D; return { x: xStop - d * (1 - u) * (1 - u), h: 1 - u }; }
  if (t < tGo) return { x: xStop, h: 0 };
  const A = 1, s = t - tGo;
  return s < A ? { x: xStop + v * s * s / (2 * A), h: s / A } : { x: xStop + v * A / 2 + v * (s - A), h: 1 };
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    kaynana: T('h1:1') - 0.05, kus: T('h1:3'), durak: T('h1:4') - 0.05, otobus: T('h1:6'),
    h2a: T('h2a'), rastgele: T('h2a:3'), gelir: T('h2a:4'), ilk: T('h2a:5'), biner: T('h2a:8'),
    h2b: T('h2b'), kad: T('h2b'), usk: T('h2b:2'), onDk: T('h2b:5'),
    h2c: T('h2c'), evler: T('h2c') - 0.1, onPazar: T('h2c:1'), annesine: T('h2c:4'), kadikoye: T('h2c:5'), neden: T('h2c:7'),
    d2: T('d2'), deneme: T('d2') - 0.1, dKad: T('d2:2'), hd: T('hd'), ilkGelene: T('hd:3'),
    bak: cd - 0.6, n1: T('n1'), nTabela: T('n1:1'), nHic: T('n1:5'),
    cevap: T('d3:2') - 0.1, d4: T('d4'), kGec: T('d4:2') + 0.45, uGec: T('d4:6'), d4s: T('d4>'),
    d5: T('d5'), buyu: T('d5') - 0.2, mavi: T('d5:1'), turuncu: T('d5:5'), dokuz: T('d5:6'), d5s: T('d5>'),
    espri: T('h4') - 0.2, saatine: T('h4:3'), cta: T('d6') - 0.15,
  };
  tm.ipucu = tm.bak + 5 / 30;
  tm.yuru = [0.1, NEC_X - 90, NEC_X];                         // kanca: Necmi soldan durağa yürür
  tm.bus1 = { t0: tm.otobus - 0.12, tStop: tm.otobus + 1.5, xStop: 1000, tGo: tm.biner + 0.1, v: 1400 };
  tm.sayac = [];                                                 // sayaç: Defne'nin parmağı satır satır
  for (let i = 0; i < 4; i++) tm.sayac.push([cd0 + 0.9 + i * 0.45, 0, i]);
  for (let i = 0; i < 4; i++) tm.sayac.push([cd0 + 3.3 + i * 0.45, 1, i]);
  tm.yukari = cd0 + 5.9; tm.dusun = cd0 + 7.0;
  tm.mDus = tm.d5s;                                       // 10 nokta düşmeye başlar
  tm.noktalar = PAZAR.map(([s, d], i) => {
    const m = d % 10, a = m / 10 * 360, rr = DIAL_R * [0.5, 0.72, 0.72, 0.5, 0.5, 0.45, 0.6, 0.72, 0.72, 0.72][i];
    return { a, renk: SONUC[i] === 'K' ? TURUNCU : MAVI, p: [DIAL[0] + Math.sin(a * D2R) * rr, DIAL[1] - Math.cos(a * D2R) * rr], t: tm.mDus + i * 0.055 };
  });
  tm.kutular = PAZAR.map((_, i) => ({ yer: SONUC[i], t: tm.onPazar + i * 0.055 }));

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.0, 540, 1060]] },
    { id: 'kaynana', t0: tm.kaynana, kisa: true, cam: [[0, 1.3, EV_U, 1085], [tm.durak - 0.1, 1.32, EV_U + 8, 1082]] },
    { id: 'durak', t0: tm.durak, cam: [[0, ...GENIS], [tm.h2a - 0.1, 1.1, 450, 1030], [tm.h2b - 0.1, 1.04, 560, 1040]] },
    { id: 'evler', t0: tm.evler, cam: [[0, 0.96, 3250, 1060], [tm.neden - 0.3, 0.98, 3255, 1058]] },
    { id: 'deneme', t0: tm.deneme, cam: [[0, 1.15, 470, 990], [tm.hd, 1.17, 465, 990]] },
    { id: 'sayac', t0: cd0 + 0.05, kesme: false, cam: [[cd0 + 0.05, 1.17, 465, 990], [cd0 + 0.7, 1.0, 540, 1080], [cd0 + 5, 1.0, 546, 1078], [cd - 0.7, 1.01, 540, 1080]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.45, 290, 920], [T('n1:5'), 1.46, 296, 918]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, DEF_X, 990]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...GENIS], [tm.buyu, 1.0, 540, 1060], [tm.buyu + 0.6, 1.0, 540, 850]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.32, 760, 1000], [tm.saatine, 1.34, 755, 998]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[tm.cta, 1.34, 755, 998], [tm.cta + 0.6, 1.36, DEF_X + 10, 1000], [tm.end - 0.1, 1.4, DEF_X + 12, 996]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.2] }, ...POZ.dur });
  const hik = [
    [0.5, { head: { tilt: 3, look: [-0.3, 0.05] } }, 0.35],
    [tm.durak, { head: { tilt: -3, look: [-0.8, 0.3] } }, 0.01],
    [tm.h2b, { head: { tilt: -4, look: [-0.7, -0.6] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [-0.9, 0.2] } }, 0.01],
    [tm.hd, { expr: 'notr', head: { tilt: 5, look: [-0.9, 0.15] } }, 0.3],
    [cd0, { expr: 'mutlu', head: { tilt: 3, look: [-0.8, 0.35] } }, 0.3],
    [tm.cevap, { expr: 'notr', head: { tilt: -3, look: [-0.7, 0.3] } }, 0.01],
    [tm.kGec - 0.4, { expr: 'saskin', head: { tilt: 4, look: [-0.6, 0.6] } }, 0.3],
    [tm.buyu + 0.3, { expr: 'saskin', head: { tilt: -4, look: [-0.6, -0.7] } }, 0.35],
    [tm.espri, { expr: 'mutlu', head: { tilt: -5, look: [-0.9, 0.15] } }, 0.01],
    [tm.saatine - 0.3, { expr: 'mutlu', head: { tilt: 5, look: [-0.5, 0.6] } }, 0.3],
    [tm.saatine + 0.5, { expr: 'mutlu', head: { tilt: -6, look: [-0.95, 0.1] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: 4, look: [0.7, 0.2] }, ...POZ.dur });
  const def = [
    [0.55, { head: { tilt: -4, look: [-0.8, 0.15] } }, 0.35],
    [tm.durak, { expr: 'notr', head: { tilt: 3, look: [0.75, 0.15] } }, 0.01],
    [tm.ilk, { head: { tilt: -3, look: [-0.3, 0.6] } }, 0.3],
    [tm.h2b, { head: { tilt: 4, look: [-0.7, 0.1] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'kizgin', head: { tilt: -6, look: [-0.8, 0.1] } }, 0.01],
    [tm.d2 + 0.6, { expr: 'mutlu', head: { tilt: -4, look: [-0.6, -0.7] } }, 0.3],
    [tm.hd + 0.1, { expr: 'saskin', head: { tilt: 5, look: [-0.9, 0.2] } }, 0.3],
    [cd0 + 0.5, { expr: 'notr', head: { tilt: 3, look: [-0.5, -0.8] } }, 0.3],
    [cd0 + 2.6, { head: { tilt: -3, look: [0.6, -0.8] } }, 0.3],
    [cd0 + 3.1, { head: { tilt: 3, look: [-0.5, -0.75] } }, 0.3],
    [cd0 + 5.1, { head: { tilt: -3, look: [0.6, -0.75] } }, 0.3],
    [tm.yukari, { expr: 'notr', head: { tilt: -6, look: [0.95, -0.5] } }, 0.35],
    [tm.dusun, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.2, -0.5] } }, 0.4],
    [tm.bak, { head: { tilt: -3, look: [-0.95, 0.05] } }, 0.25],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, 0.5] } }, 0.01],
    [tm.buyu + 0.2, { expr: 'mutlu', head: { tilt: -4, look: [-0.6, -0.6] } }, 0.35],
    [tm.espri, { expr: 'mutlu', head: { tilt: 3, look: [0.8, 0.2] } }, 0.01],
    [tm.cta + 0.4, { expr: 'mutlu', head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'mutlu', head: { tilt: -3, look: [0.6, 0.2] }, ...POZ.dur });
  const nec = [
    [tm.durak, { expr: 'mutlu', head: { tilt: 3, look: [0.5, 0.2] } }, 0.01],
    [tm.rastgele - 0.1, { expr: 'notr', head: { tilt: -4, look: [0.6, -0.8] } }, 0.3],
    [tm.ilk, { expr: 'mutlu', head: { tilt: 3, look: [0.6, 0.6] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'saskin', head: { tilt: 5, look: [0.85, 0.1] } }, 0.01],
    [tm.hd, { expr: 'mutlu', head: { tilt: -4, look: [0.1, 0.0] } }, 0.3],
    [cd0, { expr: 'notr', head: { tilt: 3, look: [0.7, 0.2] } }, 0.3],
    [tm.ipucu, { expr: 'mutlu', head: { tilt: -3, look: [0.2, 0.05] } }, 0.01],
    [tm.nTabela - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [0.7, -0.6] } }, 0.25],
    [tm.nHic - 0.05, { expr: 'mutlu', head: { tilt: 8, look: [-0.9, -0.1] } }, 0.25],
    [tm.cevap, { expr: 'notr', head: { tilt: 3, look: [0.4, 0.6] } }, 0.01],
    [tm.buyu + 0.25, { expr: 'saskin', head: { tilt: 4, look: [0.5, -0.7] } }, 0.35],
    [tm.mDus + 0.6, { expr: 'yorgun', head: { tilt: 7, look: [0.4, -0.5] } }, 0.3],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ Saat durumu (bütün sahneler aynı fonksiyonu okur) ═══════════════════════════
// Dönen: { c: merkez, r, dk: gösterilen an (gün içi dakika), on, ibre10, boya, ikon }
function saatAt(S, t) {
  const { tm } = S;
  if (t < tm.cevap) {
    const dk = 10 * 60 + 52 + t / 60 + 73 * ease.state(seg(t, tm.rastgele, 0.7)) + 10 * ease.state(seg(t, tm.onDk, 0.6));
    return { c: SAAT0, r: SAAT_R, dk, on: 0, ibre10: 0, boya: 0, ikon: 0 };
  }
  // cevap: 13.59,4 → Kadıköy geçerken 14.00 → Üsküdar geçerken 14.01
  const dk = 13 * 60 + H.iz([[tm.cevap, 59.4], [tm.kGec - 0.9, 60, 0.9, ease.state], [tm.uGec - 0.8, 61, 0.8, ease.state]], t);
  const g = ease.enter(seg(t, tm.buyu, 0.6));
  const ibre10 = H.iz([[tm.buyu, 36], [tm.buyu + 0.15, 0, 0.4], [tm.mavi, 36, 0.5], [tm.turuncu, 360, tm.d5s - tm.turuncu + 0.15]], t);
  const boya = t < tm.mavi ? 0 : ibre10;
  if (t >= tm.espri) return { c: SAAT0, r: SAAT_R + 14, dk, on: 1, ibre10: 360, boya: 360, ikon: 0 };
  return { c: kar(SAAT0, DIAL, g), r: lerp(SAAT_R, DIAL_R, g), dk, on: W(t, tm.buyu + 0.2, 0.4), ibre10, boya, ikon: W(t, tm.buyu + 0.45, 0.3) };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2c: 4, d4: 2, d5: 5 },
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'kaynana' || id === 'evler') return evler(K, t, tl, S, B);
    durak(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const sabit = (a, p) => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'deneme') H.mark(K, t, tm.hd, tm.cd0 - 0.15, sabit(tm.hd, [DEF_X - 150, 812]), false);
    if (id === 'cevap') {
      H.tag(K, t, tm.uGec - 0.04, tm.buyu, [812, 470], '+1 dk', MAVI, PAL.paper, 50);
      H.tag(K, t, tm.mavi + 0.5, tm.espri, [840, 330], '1 dk', MAVI, PAL.paper, 48);
      H.tag(K, t, tm.dokuz - 0.04, tm.espri, [175, 600], '9 dk', TURUNCU, PAL.paper, 48);
    }
  },
});

// Sayaç: Defne'nin parmağı tabelada saat saat gezer. Aynı eldeki ardışık hücreler bir "koşu"dur (el inip kalkmaz).
function sayacKosulari(S) {
  const L = [];
  for (const [tt, r, i] of S.tm.sayac) {
    const yan = 'L', son = L[L.length - 1];   // sol el: sayaç çemberinin solunda görünür kalır
    if (son && son.yan === yan && son.r === r) son.h.push([tt, i]); else L.push({ yan, r, h: [[tt, i]] });
  }
  return L;
}

// ——— Durak: saatli direk, tabela, sığınak, üç kişi, otobüsler ———
function durak(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, DURAK, 'arka', t, { isik: M.ISIK.gunduz });
  const sa = saatAt(S, t);
  // saatli direk (saat yükselirse direk de uzar) ve tabela
  K.rect(SAAT0[0] - 11, sa.c[1] + sa.r, 22, 1500 - sa.c[1] - sa.r, '#4A4F57', LW * 0.8, 4);
  const vurgu = { K: id === 'durak' ? pIn(t, tm.kad - 0.05, tm.usk - 0.05, 0.15) : id === 'deneme' ? pIn(t, tm.dKad - 0.05, tm.hd + 0.8, 0.2) : 0, U: id === 'durak' ? pIn(t, tm.usk - 0.05, tm.onDk + 0.4, 0.15) : 0 };
  tabela(K, vurgu);
  // güvercin: tabelanın üstünde gidip gelir (döngü)
  { const P = 8, u = ((t % P) + P) % P / P, git = u < 0.5, v = git ? u * 2 : (1 - u) * 2; guvercin(K, lerp(TAB.x + 50, TAB.x + TAB.w - 60, ease.state(v)), TAB.y - 8, git ? 1 : -1, t); }

  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  let np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  if (id === 'sayac') H.glance(hp, t, tm.cd - 0.5, 9.0);

  // ——— Necmi: kutu sağ elinde (ip); kancada soldan yürür ———
  let necYan = false;
  const [y0, xa, xb] = tm.yuru;
  if (t < y0 + (xb - xa) / 300 + 0.02 && id === 'kanca') { np = H.yuru('necmi', t, { t0: y0, x0: xa, x1: xb, hiz: 300 }); necYan = true; }
  if (!necYan) { H.omuzSilk(np, t, tm.gelir, 0.4); H.onayla(np, t, tm.ilkGelene, 2); }
  const no = { heads };
  let nIs = null;
  if (!necYan) {
    no.R = [H.elYeri('necmi', np, 'R', 'asagi'), 1, 'A'];
    // h2a: "ilk gelen" otobüsü gösterir
    const wI = id === 'durak' ? pIn(t, tm.ilk - 0.25, tm.biner + 0.3, 0.28) : 0;
    if (wI > 0.01) { no.L = [[NEC_X - 40, 1290], wI, 'B']; if (wI > 0.5) nIs = [NEC_X - 10, 1360]; }
    // hd: "Yemin ediyor": sol el göğüste
    const wY = id === 'deneme' ? pIn(t, tm.hd - 0.1, tm.cd0 - 0.3, 0.28) : 0;
    if (wY > 0.01) no.L = [[NEC_X + 34, 1215], wY, 'A'];
    // ipucu: "tabela" → kutulu eliyle tabelayı gösterir; "hiç bakmam" → yüzünü çevirip sol eliyle savuşturur
    if (id === 'ipucu') {
      const wT = pIn(t, tm.nTabela - 0.25, tm.nHic - 0.1, 0.28);
      if (wT > 0.01) no.R = [kar(H.elYeri('necmi', np, 'R', 'asagi'), [NEC_X + 160, 990], wT), 1, 'A'];
      const wH = W(t, tm.nHic - 0.05, 0.28);
      if (wH > 0.01) { const s = Math.sin(TAU * 2.2 * (t - tm.nHic)) * 22 * wH; no.L = [[NEC_X - 178 + s, 1062], wH, 'B']; }
    }
  } else { np.armR = { sh: 12, el: -20 }; }
  // ——— Hikmet: h2b'de tabelayı gösterir; espride kol saatine vurur ———
  const ho = { heads }; let hIs = null, saatKol = false;
  const wH2b = id === 'durak' ? pIn(t, tm.h2b - 0.1, tm.onDk + 0.9, 0.3) : 0;
  if (wH2b > 0.01) { ho.L = [[HIK_X - 150, 950], wH2b, 'B']; if (wH2b > 0.5) hIs = [TAB.x + TAB.w - 70, SATIR(1) + 40]; }
  if (id === 'espri' || id === 'cta') {
    const w = W(t, tm.espri + 0.05, 0.3);
    ho.L = [[HIK_X + 20, 1170], w, 'A']; saatKol = w > 0.3;
    const wR = pIn(t, tm.saatine - 0.35, tm.saatine + 0.6, 0.25);
    if (wR > 0.01) ho.R = [[HIK_X + 62, 1160], wR, 'A'];
    if (wR > 0.5) hIs = 'saat';
  }
  // ——— Defne: d2'de KADIKÖY satırını gösterir; sayaçta parmağı saatleri gezer; cevapta otobüsleri ve daireyi gösterir ———
  const dO = { heads }, dIs = {}; let dKart = null;
  if (id === 'deneme') {
    const wK = pIn(t, tm.dKad - 0.28, tm.hd + 0.5, 0.28);
    if (wK > 0.01) { dO.L = [[DEF_X - 150, 905], wK, 'A']; if (wK > 0.5) dIs.L = [AD_X + 60, SATIR(0) + 40]; }
  }
  if (id === 'sayac') for (const k of sayacKosulari(S)) {
    const a = k.h[0][0], b = k.h[k.h.length - 1][0], w = pIn(t, a - 0.3, b + 0.38, 0.26);
    if (w <= 0.01) continue;
    let i0 = k.h[0][1]; for (const [tt, ii] of k.h) if (t >= tt - 0.12) i0 = ii;
    dO.L = [[DEF_X - 165 + i0 * 14, 900], w, 'A'];
    let i = k.h[0][1]; for (const [tt, ii] of k.h) if (t >= tt - 0.12) i = ii;
    if (w > 0.5) dIs[k.yan] = [SUT(i), SATIR(k.r) + 36];
  }
  if (id === 'cevap') {
    const w1 = pIn(t, tm.cevap + 0.3, tm.buyu, 0.3);
    if (w1 > 0.01) { dO.L = [[DEF_X - 150, 1210], w1, 'B']; if (w1 > 0.5) dIs.L = [DEF_X - 210, 1300]; }
    const w2 = W(t, tm.buyu + 0.3, 0.3);
    if (w2 > 0.01) { dO.L = [[DEF_X - 135, 890], w2, 'B']; if (w2 > 0.5) dIs.L = [DIAL[0] - 70, DIAL[1] + 245]; }
  }
  if (id === 'cta') {
    const w = W(t, tm.cta + 0.35, 0.35);
    if (w > 0.01) { const hd = H.eklem('defne', dp, 'head'); dO.R = [[hd[0] + 190, hd[1] + 110], w, 'B']; if (w > 0.6) dKart = true; }
  }

  // ——— çizim: kişiler → kutu → tutan eller → otobüsler → saat ———
  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  const nc = oyna(K, t, tl, 'necmi', np, necYan ? { heads } : no);
  const el = nc.handR;
  kutu(K, el[0] + (necYan ? 6 : 0), el[1] + 34, 1, { ip: [el[0], el[1] + 4] });
  nc.tut('R');
  if (nIs) nc.isaret('L', nIs);
  if (saatKol) { kolSaati(K, hc.handL, H.eklem('hikmet', hp, 'elL')); hc.tut('L'); }
  if (hIs === 'saat') { const p = kar(hc.handL, H.eklem('hikmet', hp, 'elL'), 0.28); hc.isaret('R', p); }
  else if (hIs) hc.isaret('L', hIs);
  if (dKart) { kart(K, dc.handR[0], dc.handR[1] - 26, 1); dc.tut('R'); }
  if (dIs.L) dc.isaret('L', dIs.L);
  if (dIs.R) dc.isaret('R', dIs.R);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  // otobüsler (öndeki şerit, soldan sağa)
  if (id === 'kanca' || id === 'durak') { const b = busGelDur(t, tm.bus1); otobus(K, b.x, TURUNCU, TURUNCU_K, K.up('kadıköy'), t, b.h); }
  if (id === 'cevap') {
    otobus(K, SAAT0[0] + 1600 * (t - tm.uGec), MAVI, MAVI_K, K.up('üsküdar'), t);
    otobus(K, SAAT0[0] + 1600 * (t - tm.kGec), TURUNCU, TURUNCU_K, K.up('kadıköy'), t);
  }
  // saat (en üstte: kahraman anda büyür) ve Necmi'nin 10 pazarı
  saatCiz(K, sa.c, sa.r, sa.dk, t, sa);
  if (id === 'cevap' || id === 'espri' || id === 'cta') for (const n of tm.noktalar) {
    if (t < n.t - 0.35) continue;
    const k = sa.r / DIAL_R, q = H.dus(t, n.t - 0.35, n.t, [n.p[0], DIAL[1] - DIAL_R - 300], n.p);
    const p = [sa.c[0] + (q[0] - DIAL[0]) * k, sa.c[1] + (q[1] - DIAL[1]) * k];
    K.circ(p[0], p[1], 27 * k, PAL.paper, Math.max(2, 5 * k)); K.circ(p[0], p[1], 17 * k, n.renk, 0);
  }
}

// ——— Evler: Kadıköy'de anne, Üsküdar'da kaynana (kısa planlar) ———
function evler(K, t, tl, S, B) {
  const { tm } = S, id = B.sc.id;
  M.mekanCiz(K, EVLER, 'arka', t, { isik: M.ISIK.gunduz });
  // anne: mutlu, "annesine"de el sallar
  const annePoz = () => {
    const p = H.kisi('b056_anne', { x: EV_K, y: FIG_Y, s: FIG_S, expr: 'mutlu', head: { tilt: -4, look: [0.5, 0.2] }, ...POZ.dur });
    const w = pIn(t, tm.annesine - 0.3, tm.neden + 0.4, 0.3), s = Math.sin(TAU * 2.4 * (t - tm.annesine)) * 26 * w;
    const o = { sessiz: true };
    if (w > 0.01) o.R = [[EV_K + 120 + s, 1010], w, 'B'];
    oyna(K, t, null, 'b056_anne', p, o);
  };
  // kaynana: kızgın, eller belde; "küsmüş"te yüzünü çevirir
  const kaynanaPoz = () => {
    const don = W(t, tm.kus - 0.05, 0.3);
    const p = H.kisi('b056_kaynana', { x: EV_U, y: FIG_Y, s: FIG_S, expr: 'kizgin', head: { tilt: lerp(-2, 9, don), look: [lerp(-0.4, 0.95, don), lerp(0.1, -0.2, don)] },
      armL: { sh: 38, el: -118 }, armR: { sh: 38, el: -118 } });
    if (id === 'evler') { p.head = { ...p.head, tilt: 8, look: [-0.85, -0.15] }; const n = H.nabiz(t, tm.neden, 0.4); p.head.tilt += 6 * n; }
    oyna(K, t, null, 'b056_kaynana', p, { sessiz: true });
  };
  // pervazdaki kutular (her pazarın kutusu kendi anında kendi evine)
  const yer = { K: [], U: [] };
  for (const k of tm.kutular) if (id === 'evler' && t >= k.t) yer[k.yer].push(k);
  const dizi = (cx, list) => list.map((k, i) => {
    const sira = i < 4 ? 0 : i < 7 ? 1 : 2, j = i < 4 ? i : i < 7 ? i - 4 : i - 7, n = [4, 3, 2][sira];
    const s = Math.min(1, 0.55 + 0.45 * H.spring(t - k.t, 320, 30));
    return [cx + (j - (n - 1) / 2) * 96, PEN.y1 - 50 * (sira + 1) - 2, s];
  });
  ev(K, EV_K, '#E7C9A0', K.up('kadıköy'), TURUNCU, t, annePoz, dizi(EV_K, yer.K), H.nabiz(t, tm.kadikoye, 0.4));
  ev(K, EV_U, '#A9BDB8', K.up('üsküdar'), MAVI, t, kaynanaPoz, dizi(EV_U, yer.U), 0);
}
