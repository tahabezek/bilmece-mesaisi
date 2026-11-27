// Bölüm 78 · KARANLIKTA OKUYAN (v4 "hikâye" dili, kısa set, cevapsız tasarım; storyboard: hikayeler/bolum_078_v5.md).
// Mekanizma: ışığa ihtiyacı olmayan okuma (arşivdeki cevap: Saadet Hanım görme engelli, kitap kabartma yazıyla basılmış).
// Logline: Hikmet dün akşam annesinin evinde; annesi ilk kez okuduğu bir kitabı ona okuyor. Elektrik kesiliyor: bütün mahalle
// karanlık, ay yok, perdeler kapalı, mum yok, telefonların şarjı bitmiş; oda zifiri karanlık. Annesi sayfaları çevirerek,
// kitapta yazanı kelimesi kelimesine okumaya devam ediyor. Annesi okumaya nasıl devam etti?
// Akılda kalacak tek şey: oda zifiri karanlık ama okuma hiç durmuyor.
// Sızıntı yasağı: Saadet Hanım'ın gözleri açık, kitaba dönük; baston, koyu gözlük, boş bakış yok. Kitabın sayfaları
// görünmez (yalnız üst kenarı ve dönen sayfa); kabartma, nokta, satırda gezen parmak yok. Kimse imalı bakmaz, kimse gülmez.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Figüran: Saadet Hanım (Hikmet'in annesi) ═══════════════════════════
// Defne'nin iskeletinden türetildi; yetmişlerinde. Gümüş beyaz saç topuz (altın tarak), bordo hırka (Hikmet'in kravatıyla
// aynı aile rengi), fildişi ipek eşarp (bordo benekli), altın küpe, koyu kahve etek. Gözlük YOK. Siluet: topuz + eşarp + etek.
const SAA = 'b078_saadet';
if (!H.CARDS[SAA]) {
  const b = H.CARDS.defne;
  H.CARDS[SAA] = {
    ...b, key: SAA, name: 'Saadet Hanım', role: "Hikmet'in annesi", seed: 781,
    head: { w: 0.92, h: 1, ear: 0.11 }, neck: 0.06,
    torso: { ...b.torso, len: 0.76, shoulder: 0.6, hip: 0.66, depth: 0.44, belly: 0.08, color: '#7E2F3A', shade: '#62232C' },
    arm: { ...b.arm, color: '#7E2F3A', shade: '#62232C' },
    leg: { ...b.leg, upper: 0.37, lower: 0.36, color: '#3D3631', shade: '#2E2925' },
    shoe: { ...b.shoe, color: '#4A2E22' },
    skin: '#ECBF9C', skinShade: '#D2A37F', hair: '#E6E1D8', scarf: '#F1E6CF', scarfDot: '#7E2F3A', top: '#F3E9D6',
    eyes: { gap: 0.34, w: 0.19, h: 0.23, y: 0.04, lid: 0.12 }, line: 0.05, idle: { blink: [3.0, 6.0] },
    features: ['cardigan', 'bun', 'earrings', 'scarf', 'skirt'],
  };
}
const S_SAA = 210;

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz, açık durmaz)
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const DINLE = { brow: 0.03, browTilt: 0, eye: 1, pupil: 1, curve: 0.22, open: 0, w: 0.95 };
const OKUR = { brow: 0.02, browTilt: -0.04, eye: 0.92, pupil: 1, curve: 0.28, open: 0, w: 0.95 };   // Saadet: sakin, hafif tebessüm
const DALGIN = { brow: 0.04, browTilt: 0.05, eye: 0.95, pupil: 1, curve: 0.18, open: 0, w: 0.95 };

// ═══════════════════════════ Renkler ═══════════════════════════
const DUVAR = '#B9A47A', DUVAR_C = '#A8936A', LAMBRI = '#8C6E4C', ZEMIN = '#7A5636', ZEMIN_C = '#674829';
const HALI = '#B4553E', HALI_K = '#E9C08A', PERDE = '#4E6E5A', PERDE_G = '#3E5A48';
const KOLTUK = '#2F7F7A', KOLTUK_G = '#246764', KANEPE = '#9C7B54', KANEPE_G = '#80623F';
const KAPAK = '#A8401F', KAPAK_G = '#8A3318', SAYFA = '#F6EFDF';
const GECE = '#284546', SIL_A = '#142C2D', SIL_B = '#050C0D', SIL_S = '#284546';   // kâğıt: insandan açık, duvarla aynı ton (karanlıkta "parlıyor" gibi okunmasın)   // karanlık: zemin, eşya, insan, kâğıt
const LAMBA = '#F6E3BC';

// ═══════════════════════════ Ortak nesneler ═══════════════════════════
function bardak(K, x, yb, { k = 1.6, buhar = false, t = 0, dolu = true } = {}) {   // ince belli çay bardağı: (x, yb) taban
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], dolu ? '#A8401F' : '#E3EEEA', 2.4 / k * 1.45);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 36 * k, t, { k: 0.36, n: 2, ara: 9, boy: 50 });
}
// Telefon (önden): merkez (x, y), açı a. ekran: 'kapali' | 'sarj' (kırmızı ince pil, şarj işareti; dolum döngüsü)
function telefon(K, x, y, a, { ekran = 'kapali', t = 0, k = 1 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
  K.rect(-26, -48, 52, 96, '#2B3033', 4.5, 10);
  K.rect(-20, -40, 40, 78, '#16191B', 0, 5);
  if (ekran === 'sarj') {
    const u = ((t / 1.6) % 1 + 1) % 1, dol = 0.14 + 0.1 * ease.state(clamp01(u * 1.6));   // dolum döngüsü (şarj oluyor)
    K.rect(-12, -14, 24, 40, null, 3.2, 4); ctx.strokeStyle = '#E9E4D8'; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.roundRect(-12, -14, 24, 40, 4); ctx.stroke();
    K.rect(-5, -19, 10, 5, '#E9E4D8', 0, 2);
    K.rect(-8, 22 - 32 * dol, 16, 32 * dol, PAL.red, 0, 2);
    K.poly([[3, -8], [-5, 5], [0, 5], [-3, 16], [6, 1], [1, 1]], '#E9E4D8', 0);
  }
  ctx.restore();
}
function telefonAlt(x, y, a, k = 1) { return [x - Math.sin(a) * 48 * k, y + Math.cos(a) * 48 * k]; }   // fiş girişi

// ═══════════════════════════ Mekân 1: ofis (bugün, sabah) ═══════════════════════════
const OFIS = 'b078_ofis';
const NEC_X = 300, HIK_X = 610, DEF_X = 940;
const MASA = { x0: 400, x1: 830, y: 1250 };
const PRIZ = [780, 1236];                                    // masadaki çoklu priz (kablo oraya iner)
const SAAT = { x: 775, y: 690, r: 54 };
function ofisMasa(K) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 16, y + 34, x1 - x0 - 32, 1500 - y - 34, PAL.wood, LW);
  for (const dx of [36, 236]) { K.rect(x0 + dx, y + 66, 160, 110, PAL.woodTop, LW * 0.6, 6); K.line(x0 + dx + 56, y + 120, x0 + dx + 104, y + 120, 8); }
  K.rect(x0, y, x1 - x0, 36, PAL.woodTop, LW, 8);
  K.rect(PRIZ[0] - 40, PRIZ[1] - 12, 80, 26, '#E9E4D8', 4, 6);                    // çoklu priz
  for (const dx of [-20, 0, 20]) K.circ(PRIZ[0] + dx, PRIZ[1] + 1, 4.5, '#9A968A', 0);
}
function rafCiz(K, t) {   // klasör rafı (sağ duvar) ve saksı (döngü: yapraklar)
  K.rect(1130, 760, 330, 600, '#9C7A4C', LW, 6);
  for (const y of [900, 1060, 1220]) K.rect(1130, y, 330, 16, '#86592E', LW * 0.6);
  const renk = ['#2F7F7A', '#D19A2E', '#C2412F', '#E9DCC2', '#5E9A4E'];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = 1150 + i * 50, h = 110 - ((r * 7 + i * 3) % 4) * 6, yb = 900 + r * 160; K.rect(x, yb - h, 40, h, renk[(r * 2 + i) % 5], LW * 0.6, 4); K.circ(x + 20, yb - h * 0.28, 7, '#F4EDE0', 2.5); }
  K.poly([[1250, 760], [1350, 760], [1338, 680], [1262, 680]], PAL.coral, LW);
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.32 + 0.05 * Math.sin(t * 1.3 + i); H.yaprak(K, 1300, 684, 120 + 24 * (i % 2), a, PAL.green, 1); }
}
M.mekanEkle(OFIS, {
  gen: [-300, 1700], dongu: ['duvar saatinin saniye ibresi', 'pencerede kuş ve bulut', 'çay buharı', 'telefonun şarj işareti'],
  arka(K, t, { durum }) {
    const S = M.ISIK.sabah;
    M.oda(K, { x0: -400, x1: 1800, isik: S, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, -60, 600, 380, 460, { isik: S, t, gunes: 0.28, manzara: 'istanbul' });
    K.rect(-90, 1060, 440, 26, PAL.trim, LW * 0.8, 6);
    M.duvarSaati(K, SAAT.x, SAAT.y, SAAT.r, durum.saat ?? 9.4 + t / 3600, t);
    rafCiz(K, t);
  },
});

// ═══════════════════════════ Mekân 2: Saadet Hanım'ın salonu (dün akşam) ═══════════════════════════
const SALON = 'b078_salon';
const SAA_X = 430, OTUR_Y = 1400;                             // Saadet: önden, alçak sırtlı koltukta; oturağın üstü
const KOL = { x: SAA_X, w: 300, sirt: 1220 };                 // koltuk: genişlik, sırtın üst kenarı
const LAMBA_X = 300;
const PEN = { x: 700, y: 720, w: 260, h: 380 };                // pencere (perdeler kapalı)
const SEH = { x: 650, y: 1330 };                               // sehpa üstü (iki çay, Hikmet'in telefonu)
const HIK_SX = 860;                                           // Hikmet: kanepede, yandan, sola (annesine) dönük
const SARKAC = { x: 560, y: 790 };                            // sarkaçlı duvar saati
const KEDI = { x: 610, y: 1490 };
function salonArka(K, t, { isik = 1 }) {
  const { ctx } = K;
  ctx.fillStyle = DUVAR; ctx.fillRect(-400, -400, 2000, 1900);
  ctx.save(); ctx.globalAlpha = 0.45; for (let x = -380; x < 1600; x += 64) for (let y = 380; y < 1320; y += 64) K.circ(x + ((y / 64) % 2) * 32, y, 4, DUVAR_C, 0); ctx.restore();
  K.rect(-400, 1340, 2000, 160, LAMBRI, 0); K.rect(-410, 1328, 2020, 20, '#E9DCC2');
  ctx.fillStyle = ZEMIN; ctx.fillRect(-400, 1500, 2000, 900);
  for (let i = 0; i < 16; i++) K.line(-400 + i * 140, 1500, -660 + i * 140, 2400, 3, ZEMIN_C);
  K.line(-400, 1500, 1600, 1500, LW);
  // halı (önden yamuk)
  K.poly([[180, 1478], [1000, 1478], [1100, 1560], [80, 1560]], HALI, LW * 0.8);
  K.poly([[214, 1488], [966, 1488], [1040, 1546], [140, 1546]], null, 0); ctx.lineWidth = 5; ctx.strokeStyle = HALI_K; ctx.stroke();
  // pencere ve kapalı perdeler
  pencerePerde(K);
  // sarkaçlı duvar saati (döngü: sarkaç)
  sarkacliSaat(K, t);
  // lamba ışığı (düz renkli çokgen; yalnız lamba yanarken)
  if (isik > 0.01) H.isikSeridi(K, [[LAMBA_X - 40, 1092], [LAMBA_X + 40, 1092], [LAMBA_X + 330, 1500], [LAMBA_X - 220, 1500]], { renk: LAMBA, a: 0.26 * isik });
}
function pencerePerde(K) {
  const { x, y, w, h } = PEN;
  K.rect(x - 16, y - 16, w + 32, h + 32, '#E9DCC2', LW);
  K.rect(x, y, w, h, '#1E3537', LW * 0.8);
  K.rect(x - 50, y - 46, w + 100, 18, '#6B4A30', LW * 0.7, 8);                          // korniş
  for (const side of [0, 1]) {                                                          // iki kanat, ortada birleşir (kapalı)
    const x0 = side ? x + w / 2 : x - 40, x1 = side ? x + w + 40 : x + w / 2;
    K.poly([[x0, y - 30], [x1, y - 30], [x1 + (side ? 6 : 0), y + h + 64], [x0 - (side ? 0 : 6), y + h + 64]], PERDE, LW);
    for (let i = 1; i < 5; i++) { const xx = lerp(x0, x1, i / 5); K.line(xx, y - 22, xx + (side ? 3 : -3), y + h + 56, 4, PERDE_G); }
  }
}
function sarkacliSaat(K, t) {
  const { x, y } = SARKAC, a = 0.3 * Math.sin(t * TAU / 1.6);
  K.rect(x - 62, y - 70, 124, 330, '#86592E', LW, 10);
  K.circ(x, y, 46, '#F4EDE0', LW * 0.8);
  for (let i = 0; i < 12; i++) { const q = i / 12 * TAU; K.line(x + Math.sin(q) * 36, y - Math.cos(q) * 36, x + Math.sin(q) * 42, y - Math.cos(q) * 42, 3.5); }
  K.line(x, y, x + 4, y - 30, 5); K.line(x, y, x + 22, y + 12, 5);
  K.rect(x - 44, y + 64, 88, 180, '#6B4A30', LW * 0.6, 6);
  const L = 140, px = x + Math.sin(a) * L, py = y + 76 + Math.cos(a) * L;
  K.line(x, y + 76, px, py, 5, '#D19A2E'); K.circ(px, py, 18, '#D19A2E', 4);
}
function lambaCiz(K, isik) {
  const x = LAMBA_X;
  K.ell(x, 1496, 56, 12, '#3A3F3C', LW * 0.7);
  K.line(x, 1490, x, 1060, 12, INK); K.line(x, 1490, x, 1060, 6, '#8D949A');
  K.poly([[x - 52, 1000], [x + 52, 1000], [x + 82, 1096], [x - 82, 1096]], isik > 0.5 ? '#F2DFAE' : '#C9B78E', LW);
}
// Koltuk (önden, alçak sırtlı): x merkez. parca: 'sirt' (karakterden önce) | 'on' (kolçaklar ve oturak; karakterden önce)
function koltuk(K, parca) {
  const { x, w, sirt } = KOL, y = OTUR_Y;
  if (parca === 'sirt') {
    K.rect(x - w / 2 + 20, sirt, w - 40, y - sirt + 20, KOLTUK, LW, 50);
    K.line(x - w / 2 + 60, sirt + 40, x - w / 2 + 60, y - 20, 4, KOLTUK_G); K.line(x + w / 2 - 60, sirt + 40, x + w / 2 - 60, y - 20, 4, KOLTUK_G);
    return;
  }
  for (const s of [-1, 1]) {
    K.rect(x + s * (w / 2 - 26) - 36, y - 110, 72, 150, KOLTUK, LW, 28);                // kolçak
    K.rect(x + s * (w / 2 - 26) - 12, y + 36, 24, 1500 - y - 36, '#6B4A30', LW * 0.8, 6);   // ayak
  }
  K.rect(x - w / 2 + 40, y - 6, w - 80, 46, KOLTUK_G, LW, 14);                          // oturak ön yüzü
}
// Kanepe (yandan, Hikmet sola bakar): oturak ve sırt sağda
function kanepe(K, s) {
  const y = s.y, xb = s.x + 70;
  K.rect(xb - 20, y - 250, 120, 290, KANEPE, LW, 40);                                    // sırt
  K.rect(s.x - 150, y - 8, 290, 70, KANEPE, LW, 22);                                     // oturak
  K.rect(s.x - 170, y - 60, 60, 120, KANEPE_G, LW, 24);                                  // kolçak (ön)
  K.rect(s.x - 140, y + 60, 22, 1500 - y - 60, '#6B4A30', LW * 0.8, 6); K.rect(s.x + 110, y + 60, 22, 1500 - y - 60, '#6B4A30', LW * 0.8, 6);
}
function sehpa(K) {
  const { x, y } = SEH;
  K.rect(x - 16, y + 20, 32, 1500 - y - 20, '#6B4A30', LW * 0.8, 6);
  K.ell(x, 1496, 70, 10, '#6B4A30', LW * 0.7);
  K.ell(x, y + 6, 120, 24, '#86592E', LW);
}
function kedi(K, t) {   // halıda uyuyan kedi (döngü: kuyruk ucu)
  const { x, y } = KEDI, a = 0.35 * Math.sin(t * TAU / 2.4);
  K.ell(x, y - 30, 78, 36, '#D9A44E', LW * 0.8);
  K.circ(x + 64, y - 44, 28, '#D9A44E', LW * 0.8);
  K.poly([[x + 48, y - 64], [x + 56, y - 88], [x + 68, y - 68]], '#D9A44E', 4); K.poly([[x + 70, y - 68], [x + 84, y - 86], [x + 88, y - 62]], '#D9A44E', 4);
  K.line(x + 56, y - 44, x + 66, y - 42, 3.5); K.line(x + 74, y - 42, x + 84, y - 44, 3.5);   // kapalı gözler
  const { ctx } = K; ctx.save(); ctx.lineCap = 'round';
  const kx = x - 74, ky = y - 18, ux = kx - 60 * Math.cos(a), uy = ky - 30 - 40 * Math.sin(a);
  ctx.beginPath(); ctx.moveTo(kx, ky); ctx.quadraticCurveTo(kx - 50, ky + 6, ux, uy); ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = '#D9A44E'; ctx.stroke();
  ctx.restore();
}
M.mekanEkle(SALON, { gen: [-200, 1400], dongu: ['sarkaçlı saatin sarkacı', 'kedinin kuyruğu', 'çay buharı', 'dönen sayfa'] });

// ——— Kitap (önden, açık; dış kapaklar izleyiciye dönük, sayfalar görünmez; yalnız üst kenar ve dönen sayfa) ———
// B = { x, y } kitabın sırtının ortası; hw yarım genişlik, h boy, kal sayfa bloğu kalınlığı. don: dönen sayfa 0..1 (yoksa null)
const KITAP = { hw: 98, h: 150, kal: 20 };
function kitapCiz(K, B, don, { sayfaRenk = SAYFA, kapak = KAPAK, kapakG = KAPAK_G, lw = LW } = {}) {
  const { hw, h, kal } = KITAP, x = B.x, yT = B.y - h / 2, yB = B.y + h / 2;
  // dönen sayfa (kapakların arkasında; üst kısmı kapakların üstünden görünür)
  if (don !== null && don > 0 && don < 1) {
    const q = Math.PI * (1 - don), ex = x + Math.cos(q) * hw * 0.95, kalk = Math.sin(q);
    K.poly([[x, yT - kal + 2], [ex, yT - kal - 10 - 100 * kalk], [ex, yB - 30 - 10 * kalk], [x, yB - 20]], sayfaRenk, lw * 0.7);
  }
  // sayfa bloğunun üst kenarı (iki yarım)
  for (const s of [-1, 1]) K.poly([[x, yT - kal + 4], [x + s * hw * 0.96, yT - kal - 4], [x + s * hw * 0.96, yT + 6], [x, yT + 10]], sayfaRenk, lw * 0.7);
  // dış kapaklar: hafif V (sırt önde)
  K.poly([[x, yT + 4], [x - hw, yT - 6], [x - hw, yB - 6], [x, yB + 4]], kapak, lw);
  K.poly([[x, yT + 4], [x + hw, yT - 6], [x + hw, yB - 6], [x, yB + 4]], kapak, lw);
  K.rect(x - 9, yT + 2, 18, h + 4, kapakG, lw * 0.7, 6);                                   // sırt
}

// Saadet Hanım, önden oturur. Ayakta pozdan türetilir: pelvis oturağa iner, bacaklar kucak + baldır olarak çizilir.
function saadetPoz(t, o = {}) {
  const p = H.kisi(SAA, { x: SAA_X, y: 1500, s: S_SAA, expr: OKUR, head: { tilt: 0, look: [0.02, 0.75] }, ...POZ.dur, ...o });
  const pel = H.eklem(SAA, p, 'pelvis'); p.y += OTUR_Y - 8 - pel[1];
  return p;
}
function saadetCiz(K, t, p, o = {}) {
  const { ctx } = K, s = p.s, pel = H.eklem(SAA, p, 'pelvis'), c = H.CARDS[SAA];
  ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 10000, 5000 + pel[1] + 0.06 * s); ctx.clip();
  const r = oyna(K, t, null, SAA, p, { ...o, sessiz: true });
  ctx.restore();
  // kucak (etek) ve baldırlar
  const hx = 0.36 * s, ky = pel[1] + 0.3 * s;
  K.poly([[pel[0] - hx, pel[1] - 0.02 * s], [pel[0] + hx, pel[1] - 0.02 * s], [pel[0] + hx + 0.04 * s, ky], [pel[0] - hx - 0.04 * s, ky]], c.leg.color, LW);
  for (const sd of [-1, 1]) {
    const lx = pel[0] + sd * 0.17 * s;
    K.rect(lx - 0.075 * s, ky - 4, 0.15 * s, 1490 - ky - 0.08 * s, '#C99F82', LW * 0.8, 6);
    K.ell(lx + sd * 0.04 * s, 1490 - 0.05 * s, 0.14 * s, 0.07 * s, c.shoe.color, LW * 0.8);
  }
  return r;
}
// Kitabın durumu: Saadet'in iki eli kapakların alt köşelerinde; sayfa çevirirken sol el (ekran solu) sayfa köşesine gider,
// sayfayla birlikte sağa geçer, geri döner.
function kitapAt(t, S, p) {
  const sh = H.eklem(SAA, p, 'pelvis'), B = { x: SAA_X, y: sh[1] - 0.52 * S_SAA };
  let don = null, elL = [B.x - KITAP.hw + 16, B.y + KITAP.h / 2 - 22], w = 0;
  for (const tc of S.tm.cevir) {
    const a = tc - 0.35, u = seg(t, tc - 0.05, 0.55);
    if (t >= a && t < tc + 0.85) {
      w = pIn(t, a, tc + 0.55, 0.3, 0.3);
      const kose = [B.x - KITAP.hw + 10, B.y - KITAP.h / 2 - 8];
      if (t < tc - 0.05) elL = kar(elL, kose, ease.state(seg(t, a, 0.3)));
      else if (t < tc + 0.5) { const q = Math.PI * (1 - ease.state(u)); elL = [B.x + Math.cos(q) * KITAP.hw * 0.9, B.y - KITAP.h / 2 - 14 - 40 * Math.sin(q)]; }
      else elL = kar([B.x + KITAP.hw * 0.8, B.y - KITAP.h / 2 - 10], [B.x - KITAP.hw + 16, B.y + KITAP.h / 2 - 22], ease.state(seg(t, tc + 0.5, 0.35)));
      if (t >= tc - 0.05 && t < tc + 0.5) don = ease.state(u);
    }
  }
  return { B, don, elL, elR: [B.x + KITAP.hw - 16, B.y + KITAP.h / 2 - 22] };
}

// ═══════════════════════════ Mekân 3: mahalle (dün akşam, dışarıdan) ═══════════════════════════
const DISARI = 'b078_mahalle';
const BINA = [
  { x0: -260, x1: 300, ust: 660, kat: 4, sut: 4, renk: '#6F7A6C' },
  { x0: 330, x1: 770, ust: 560, kat: 5, sut: 3, renk: '#8A7A62' },                     // Saadet Hanım'ın binası
  { x0: 800, x1: 1340, ust: 700, kat: 4, sut: 4, renk: '#6E6A5C' },
];
const SAA_PEN = { b: 1, kat: 3, sut: 1 };                                                // 3. kat, ortadaki pencere (alttan sayım 0)
const pencereYeri = (bn, kat, sut) => { const B = BINA[bn], w = (B.x1 - B.x0) / B.sut; return [B.x0 + w * (sut + 0.5), 1400 - kat * 170]; };
function mahalle(K, t, { sonuk, tm }) {
  const { ctx } = K;
  ctx.fillStyle = GECE; ctx.fillRect(-600, -600, 2600, 2200);                            // gök: ay yok, yıldız yok (bulutlu)
  for (let i = 0; i < 3; i++) { const xx = -500 + ((i * 640 + t * (9 + 4 * i)) % 2200); M.bulut(K, xx, 220 + i * 120, 1.2 - 0.2 * i, '#2A4A48'); }
  const rnd = H.mulberry32(781);
  BINA.forEach((B, bi) => {
    const dk = H.mixHex(H.mixHex(B.renk, SIL_A, 0.55), '#081415', sonuk(0));
    K.rect(B.x0, B.ust, B.x1 - B.x0, 1500 - B.ust, dk, LW);
    K.rect(B.x0 - 12, B.ust - 18, B.x1 - B.x0 + 24, 22, H.mixHex('#4A4A40', SIL_A, 0.4 + 0.6 * sonuk(0)), LW * 0.8);
    const w = (B.x1 - B.x0) / B.sut;
    for (let k = 0; k < B.kat; k++) for (let s = 0; s < B.sut; s++) {
      const [cx, cy] = pencereYeri(bi, k, s), r = rnd(), yanik = r < 0.72, gec = rnd() * 0.09;
      const saa = bi === SAA_PEN.b && k === SAA_PEN.kat && s === SAA_PEN.sut;
      const sn = saa ? 1 : sonuk(gec);
      const renk = yanik || saa ? H.mixHex(saa ? '#E7B65E' : '#F2D27A', '#0E1F20', sn) : '#24302D';
      K.rect(cx - w * 0.28, cy - 62, w * 0.56, 124, renk, LW * 0.8, 4);
      if (saa) { for (const d of [-1, 1]) K.poly([[cx, cy - 58], [cx + d * w * 0.26, cy - 58], [cx + d * w * 0.26, cy + 58], [cx + d * 6, cy + 58]], H.mixHex('#C9A25A', '#132A2B', sn), 3); }   // kapalı perdeler
      K.line(cx, cy - 62, cx, cy + 62, 4, INK);
    }
  });
  // sokak lambaları (sönerler) ve ağaç (döngü: yapraklar)
  for (const lx of [316, 785]) {
    const sn = sonuk(lx > 500 ? 0.05 : 0.02);
    K.rect(lx - 7, 1060, 14, 440, '#2B3033', LW * 0.6);
    K.poly([[lx - 30, 1040], [lx + 30, 1040], [lx + 20, 1070], [lx - 20, 1070]], '#2B3033', LW * 0.6);
    K.ell(lx, 1074, 18, 10, H.mixHex('#F6E3BC', '#0E1F20', sn), 3);
    if (sn < 0.99) H.isikSeridi(K, [[lx - 18, 1078], [lx + 18, 1078], [lx + 120, 1500], [lx - 120, 1500]], { renk: '#F6E3BC', a: 0.22 * (1 - sn) });
  }
  K.rect(1060, 1260, 30, 240, '#4A3B2E', LW * 0.8);
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, sw = 6 * Math.sin(t * 1.4 + i); K.circ(1075 + Math.cos(a) * 70 + sw, 1200 + Math.sin(a) * 50, 62, H.mixHex('#4F6A44', SIL_A, 0.5 + 0.5 * sonuk(0)), 4); }
  ctx.fillStyle = H.mixHex('#3E4A44', '#0A1718', sonuk(0)); ctx.fillRect(-600, 1500, 2600, 600); K.line(-600, 1500, 2000, 1500, LW);
}
M.mekanEkle(DISARI, { gen: [-300, 1400], dongu: ['bulutlar', 'ağacın yaprakları'] });

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    salon: T('h1:3') - 0.05, kitabi: T('h1:5'), kesildi: T('h1b:1'),
    disari: T('h1b:2') - 0.1, mahalle: T('h1b:3'), karardi: T('h1b:4'), ay: T('h1b:5'), perde: T('h1b:7'),
    defne: T('d1') - 0.1,
    hikmet: T('h2') - 0.1, tel: T('h2:2'), bitti: T('h2:4'),
    karanlik: T('h2:5') - 0.1, h3: T('h3'), cevirerek: T('h3:3'), kelime: T('h3:6'),
    s1: T('s1'), s1s: T('s1>'),
    sayac: cd0 - 0.05, say2: cd0 + 3.35, say3: cd0 + 6.7,
    n1: T('n1'), kitabiN: T('n1:3'), elinize: T('n1:6'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  tm.cevir = [tm.cevirerek - 0.05, T('h3:9') - 0.07, tm.s1s + 0.42];                 // sayfa çevirme anları (swish ile)
  tm.yak = tm.h3 - 0.3;                                             // karanlıkta kitaba yaklaşma
  tm.geri = tm.s1 - 0.2;                                            // s1'de ikili plana dönüş

  const film = H.sahneler([
    { id: 'kanca', mekan: OFIS, t0: 0, kay: [-26, 0], cam: [[0, 1.12, 615, 1010]] },
    { id: 'salon', mekan: SALON, geri: true, t0: tm.salon, kay: [-20, 0], cam: [[0, 1.3, 640, 1120]] },
    { id: 'disari', mekan: DISARI, geri: true, t0: tm.disari, cam: [[0, 1.26, 555, 960], [tm.mahalle + 0.05, 1.0, 540, 960], [tm.ay - 0.1, 1.0, 540, 820], [tm.perde - 0.1, 1.22, 555, 930]] },
    { id: 'defne', mekan: OFIS, t0: tm.defne, kay: [26, 0], cam: [[0, 1.45, 930, 935]] },
    { id: 'hikmet', mekan: OFIS, t0: tm.hikmet, kay: [20, 0], cam: [[0, 1.42, 620, 960]] },
    { id: 'karanlik', mekan: SALON, geri: true, t0: tm.karanlik, cam: [[0, 1.27, 640, 1135], [tm.yak, 1.38, 545, 1160], [tm.geri, 1.24, 640, 1100]] },
    { id: 'say2', mekan: OFIS, t0: tm.say2, cam: [[0, 1.3, 430, 1000]] },
    { id: 'say3', mekan: OFIS, t0: tm.say3, kesme: false, cam: [[0, 1.3, 430, 1000]] },
    { id: 'buldum', mekan: OFIS, t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.36, 930, 960]] },
    { id: 'cevap', mekan: OFIS, t0: tm.cevap, kesme: false, cam: [[0, 1.3, 860, 975]] },
    { id: 'cta', mekan: OFIS, t0: tm.cta, kesme: false, cam: [[0, 1.34, 930, 975]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— ofis pozları (önden) ———
  const necBase = H.kisi('necmi', { x: NEC_X, expr: DINLE, head: { tilt: -3, look: [0.75, -0.1] }, ...POZ.dur });
  const nec = [
    [tm.say2, { expr: DALGIN, ...POZ.dusun, head: { tilt: 4, look: [0.3, -0.45] } }, 0.01],
    [tm.say2 + 1.7, { head: { tilt: -3, look: [0.8, -0.1] } }, 0.4],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: MERAK, head: { tilt: 4, look: [-0.85, -0.15] }, ...POZ.dur });
  const def = [
    [0.3, { head: { tilt: -3, look: [-0.8, -0.05] } }, 0.3],
    [tm.defne, { expr: MERAK, head: { tilt: 5, look: [-0.85, -0.05] } }, 0.01],
    [tm.say3, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -5, look: [-0.2, -0.55] } }, 0.01],
    [tm.say3 + 1.6, { head: { tilt: 4, look: [-0.5, -0.45] } }, 0.4],
    [tm.n1 - 0.3, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -2, look: [-0.85, 0.0] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, -0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -4, look: [0.05, 0.05] } }, 0.3],
  ];
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'notr', head: { tilt: 3, look: [0.1, 0.45] }, ...POZ.dur });
  const hik = [
    [1.05, { head: { tilt: -3, look: [0.6, -0.05] } }, 0.35],
    [tm.hikmet, { head: { tilt: -2, look: [0.2, 0.05] } }, 0.01],
    [tm.tel - 0.1, { head: { tilt: 3, look: [0.4, 0.35] } }, 0.3],
    [tm.bitti + 0.3, { head: { tilt: -2, look: [0.1, 0.0] } }, 0.35],
    [tm.say2, { expr: DALGIN, head: { tilt: 4, look: [0.25, 0.5] } }, 0.01],
    [tm.say3 + 1.0, { expr: 'notr', head: { tilt: -3, look: [0.7, -0.1] } }, 0.4],
  ];
  // Altyazı çizelgesi: s1 Saadet Hanım'ın sesi (kitaptan okunan satır); n1 son replik, balonu "Buldum!"a kadar kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 's1' ? { ...l, who: SAA, t1: Math.min(l.t1 + 0.6, cd0 - 0.4) } : l.id === 'n1' ? { ...l, t0: l.t0 + 0.06, t1: T('d3') - 0.02 } : l) };
  return { tm, film, tlA, necBase, nec, defBase, def, hikBase, hik };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında
  split: { h3: 6 },   // uzun satır iki parça: üç satırlık balon güvenli alanın altına taşıyordu
  kuyruksuz: (t, B) => !!B.sc.geri && !(t >= S.tm.s1 - 0.1 && t < S.tm.s1s + 0.7),
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id, lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
    if (id === 'karanlik') {   // karanlıkta durgun kare olmasın: her bölümde doğrusal yan kayma ve itme (siluet kenarları akar)
      const P = [tm.karanlik, tm.yak, tm.geri, tm.say2], i = Math.max(0, P.findIndex((a, j) => t >= a && t < P[j + 1])), a = P[i], d = P[i + 1] - a, u = (t - a) / d;
      cam.cx += (i === 1 ? -1 : 1) * 16 * d * (u - 0.5); cam.cy += 16 * (t - a); cam.zoom *= 1 + 0.022 * (t - a);
    }
    else if (id === 'say2') Object.assign(cam, { zoom: lg(1.3, 1.36, clamp01((t - tm.say2) / 3.35)), cx: 430, cy: 1000 });
    else if (id === 'say3') {   // 0,8 sn'de Hikmet ve Defne'ye kayar, sonra kesime kadar doğrusal itme
      const u = ease.state(seg(t, tm.say3, 0.8)), z = lg(1.3, 1.38, clamp01((t - tm.say3 - 0.8) / (tm.buldum - tm.say3 - 0.8)));
      Object.assign(cam, { zoom: z, cx: lerp(430, 780, u), cy: lerp(1000, 990, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    H.zamanHapi(K, t, tm.salon + 0.2, tm.salon + 1.6, K.up('dün akşam'), { x: 540, y: 575, saat: 21.5 });
    H.zamanHapi(K, t, tm.karanlik + 0.2, tm.karanlik + 1.5, K.up('dün akşam'), { x: 540, y: 575, saat: 21.5 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (075'ten): perde yok, alt bantta. Daire solda, başlık ve paylaşım hapı sağında.
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
  const m = B.sc.mekan;
  if (m === SALON) return salonSahne(K, t, S, B);
  if (m === DISARI) return mahalle(K, t, { tm: S.tm, sonuk: gec => ease.state(seg(t, S.tm.disari + 0.08 + gec * 3.5, 0.1)) });
  return ofisSahne(K, t, S, B);
}

// ——— Ofis ———
const KADRO = { kanca: 'NHD', defne: 'D', hikmet: 'H', say2: 'NH', say3: 'HD', buldum: 'D', cevap: 'D', cta: 'D' };
function ofisSahne(K, t, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, kadro = KADRO[id] || 'NHD', tl = S.tlA;
  const g = H.geriDonus(t, tm.salon);
  const g2 = H.geriDonus(t, tm.karanlik), saat = t < tm.salon ? H.saatSar(9.4, 7.9, g.sar) : t < tm.karanlik ? H.saatSar(9.4, 7.9, g2.sar) : 9.4 + t / 3600;
  M.mekanCiz(K, OFIS, 'arka', t, { durum: { saat } });

  // Hikmet: masanın arkasında; sağ elinde (ekran sağı) telefon, kablo masadaki prize iner
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), hO = { heads };
  let telP = [hp.x + 86, 1118], telA = -0.12;
  if (id === 'hikmet') {                                                             // "telefonların şarjı bitmişti": telefonu kaldırıp gösterir
    const u = pIn(t, tm.tel - 0.15, tm.bitti + 0.55, 0.32, 0.35);
    telP = kar(telP, [hp.x + 150, 1020], u); telA = lerp(-0.12, 0.18, u);
  } else if (id === 'say2' || id === 'say3') telP = [hp.x + 80, 1132];
  hO.R = [[telP[0] + 4, telP[1] + 22], 1, 'A'];
  let fis = null;
  if (id === 'kanca') {                                                              // kare 0: sol el fişi telefona takar
    const alt = telefonAlt(telP[0], telP[1], telA), bas = [alt[0] - 70, alt[1] + 70];
    const u = ease.state(seg(t, 0.3, 0.3)), birak = W(t, 0.95, 0.35);
    fis = kar(bas, alt, u);
    hO.L = [[fis[0] - 6, fis[1] + 14], 1 - birak, 'A'];
  } else fis = telefonAlt(telP[0], telP[1], telA);
  const hc = kadro.includes('H') ? oyna(K, t, tl, 'hikmet', hp, hO) : null;
  ofisMasa(K);
  bardak(K, MASA.x0 + 60, MASA.y + 2, { buhar: true, t, k: 1.6 });
  if (hc) {
    // kablo: prizden telefonun altına (sarkık eğri)
    const { ctx } = K, a = PRIZ, b = fis;
    ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0] + 10, a[1]); ctx.bezierCurveTo(a[0] + 40, a[1] + 60, b[0] + 10, b[1] + 160, b[0], b[1] + 6);
    ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#E9E4D8'; ctx.stroke(); ctx.restore();
    K.rect(b[0] - 9, b[1] - 2, 18, 24, '#E9E4D8', 3.5, 4);
    const takili = id !== 'kanca' || t > 0.6;
    telefon(K, telP[0], telP[1], telA, { ekran: takili ? 'sarj' : 'kapali', t });
    hc.tut('R'); if (id === 'kanca' && t < 1.3) hc.tut('L');
  }

  // Necmi (solda; sol elinde çay)
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t), nO = { heads };
  nO.L = [[np.x - 60, 1190], 1, 'A'];
  if (kadro.includes('N')) {
    const nc = oyna(K, t, tl, 'necmi', np, nO);
    bardak(K, nc.handL[0] + 8, nc.handL[1] + 26, { buhar: true, t, k: 1.7 }); nc.tut('L');
  }

  // Defne (sağda)
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t), dO = { heads };
  dp.y -= H.buldumHop(t, tm.buldum);
  if (id === 'defne') {                                                              // "Mum yok muydu?": avuç yukarı, soru
    const w = pIn(t, tm.defne + 0.12, tm.defne + 1.05, 0.28);
    if (w > 0.01) dO.R = [[dp.x + 110, 1150 - 40 * w], w, 'B'];
  } else if (id === 'say3') {                                                        // ipucu: iki eliyle kalın bir kitabı tutar gibi (Hikmet'e)
    const w = pIn(t, tm.n1 + 0.1, tm.n1s + 0.3, 0.32), k = H.nabiz(t, tm.elinize - 0.05, 0.4);
    if (w > 0.01) { dO.L = [[dp.x - 150, 1135 - 30 * k], w, 'A']; dO.R = [[dp.x - 10, 1135 - 30 * k], w, 'A']; }
  }
  if (!kadro.includes('D')) return;
  oyna(K, t, tl, 'defne', dp, dO);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// ——— Salon (dün akşam): aydınlık ya da karanlık ———
function salonSahne(K, t, S, B) {
  const { tm } = S, { heads, sc } = B;
  const sonuk = sc.id === 'karanlik' ? 1 : ease.state(seg(t, tm.kesildi + 0.02, 0.08));   // lamba "kesildi"de söner
  const isik = 1 - sonuk;
  // Saadet ve kitap
  const sp = saadetPoz(t), kt = kitapAt(t, S, sp);
  const so = { L: [kt.elL, 1, 'A'], R: [kt.elR, 1, 'A'] };
  // Hikmet: kanepede, yandan, annesine dönük; karanlıkta telefonunu elinde tutar (sönük ekran)
  const hp = H.otur('hikmet', { x: HIK_SX, facing: -1, expr: DINLE, head: { tilt: 4, look: [0.8, 0.12] } });
  const hs = H.oturak('hikmet', hp);
  if (sc.id === 'karanlik') H.onayla(hp, t, tm.kelime + 0.05, 2, 0.4);           // "kelimesi kelimesine": Hikmet başıyla onaylar (siluette okunur)
  const telK = false;
  const hTel = [hs.diz + 40, hs.y - 120];
  const ho = { sessiz: true };
  if (telK) ho.R = [hTel, 1, 'A'];

  const arka = K2 => {   // aydınlıkta normal çizim; karanlıkta lekelenir
    lambaCiz(K2, isik); kedi(K2, t);
    koltuk(K2, 'sirt'); koltuk(K2, 'on');
  };
  const insan = K2 => {
    saadetCiz(K2, t, sp, so);
    kitapCiz(K2, kt.B, kt.don);
    H.grip(K2, SAA, kt.elL, S_SAA); H.grip(K2, SAA, kt.elR, S_SAA);
    kanepe(K2, hs);
    const hc = oyna(K2, t, null, 'hikmet', hp, ho);
    if (telK) { telefon(K2, hc.handR[0] - 4, hc.handR[1] - 26, 0.1, { k: 0.8 }); hc.tut('R'); }
    sehpa(K2);
    bardak(K2, SEH.x - 50, SEH.y + 4, { k: 1.25, t, buhar: isik > 0.5 }); bardak(K2, SEH.x + 30, SEH.y + 4, { k: 1.25, t, buhar: isik > 0.5 });
    if (!telK) telefon(K2, SEH.x + 82, SEH.y - 6, 1.45, { k: 0.6 });
  };
  salonArka(K, t, { isik });
  if (sonuk < 0.5) {
    arka(K); insan(K);
    heads[SAA] = H.eklem(SAA, sp, 'head');
    return;
  }
  // karanlık: düz koyu petrol; yalnız siluetler. Eşya (A) ve insanlar (B) iki tonda; kâğıt bir ton açık (dönen sayfa okunur)
  H.karart(K, 1, GECE);
  H.lekele(K, K2 => { pencerePerde(K2); sarkacliSaat(K2, t); arka(K2); }, SIL_A, 1);
  H.lekele(K, K2 => insan(K2), SIL_B, 1);
  H.lekele(K, K2 => kitapSayfa(K2, kt), SIL_S, 1);
  H.lekele(K, K2 => { H.grip(K2, SAA, kt.elL, S_SAA); H.grip(K2, SAA, kt.elR, S_SAA); }, SIL_B, 1);   // eller kâğıdın önünde
  heads[SAA] = H.eklem(SAA, sp, 'head');
}
// Karanlıkta yalnız kâğıt: sayfa bloğunun üst kenarı ve dönen sayfa (kapaklar ve eller üstte kalır)
function kitapSayfa(K, kt) {
  const { hw, h, kal } = KITAP, x = kt.B.x, yT = kt.B.y - h / 2, yB = kt.B.y + h / 2, { ctx } = K;
  ctx.save(); ctx.beginPath(); ctx.rect(x - hw - 40, yT - 140, 2 * hw + 80, 140 + 2); ctx.clip();   // kapakların üst kenarının üstü
  if (kt.don !== null && kt.don > 0 && kt.don < 1) {
    const q = Math.PI * (1 - kt.don), ex = x + Math.cos(q) * hw * 0.95, kalk = Math.sin(q);
    K.poly([[x, yT - kal + 2], [ex, yT - kal - 10 - 100 * kalk], [ex, yB - 30 - 10 * kalk], [x, yB - 20]], '#fff', 0);
  }
  for (const s of [-1, 1]) K.poly([[x, yT - kal + 8], [x + s * hw * 0.9, yT - kal], [x + s * hw * 0.9, yT - 4], [x, yT]], '#fff', 0);
  ctx.restore();
}
