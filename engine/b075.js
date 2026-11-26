// Bölüm 75 · KÖPRÜDEKİ TREN (v4 "hikâye" dili, kısa set, cevapsız tasarım; storyboard: hikayeler/bolum_075_v5.md).
// Mekanizma: ileri koşan Necmi'yi düşün; tren köprüye girdiğinde o nerede olurdu?
// Logline: Necmi dün demiryolu köprüsünün 3/8'indeyken arkasından tren sesi duyar. Tren henüz köprüye girmemiştir ve sabit
// hızla gelir. Hemen geri koşsa girişe, hemen ileri koşsa çıkışa trenle aynı anda varacaktır. Necmi saatte 10 km koşar.
// Hikmet sorar: Tren saatte kaç km gidiyordu?
// Akılda kalacak tek şey: ileri koşan Necmi, tren köprüye girerken nerededir?
// Sızıntı yasağı: 40, "dört kat", 6/8 hiçbir yerde yazmaz. Köprünün sekiz bölmesi eşittir, hiçbir ayak, kemer ya da direk
// öne çıkmaz (6/8'de işaret yok). İki seçenek (geri / ileri) aynı ok ve aynı gölgeyle, eşit sürede gösterilir; gölgeler
// koşmaz (hız göstermez), yalnız uçlarda belirir. Tren görünmez: yakın plânda tepenin ardından, geniş plânda dağdaki
// tünelin üstünden yükselen dumanı görünür; hız göstergesi, tabela, sayı yok; trenin uzaklığı çizimden ölçülemez.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz, açık durmaz)
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 0.85, pupil: 1, curve: 0.6, open: 0, w: 1.15 };
const NGULUS = { brow: 0.03, browTilt: -0.1, eye: 0.9, pupil: 1, curve: 0.38, open: 0, w: 1.1 };
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const DALGIN = { brow: 0.04, browTilt: 0.05, eye: 0.95, pupil: 1, curve: 0.18, open: 0, w: 0.95 };
const KAYGI = { brow: 0.1, browTilt: 0.25, eye: 1.2, pupil: 0.8, curve: -0.12, open: 0, w: 0.7 };

// ═══════════════════════════ Renkler ═══════════════════════════
const TAS = '#C9AD84', TAS_G = '#A98D64', TAS_K = '#8E744F';          // viyadük taşı
const DEMIR = '#2F4F4A';                                              // korkuluk
const OT = '#7E8B5A', OT_K = '#66724A', OT_U = '#9A9A72', DAG = '#8C8A76', DAG_U = '#A8A08C';
const NEHIR = '#5E8F8C', NEHIR_A = '#9CC3BC';
const OK_RENK = PAL.mustard, HAYALET = '#FFF3DA';

// ═══════════════════════════ Viyadük (tek çizim fonksiyonu, iki ölçek) ═══════════════════════════
// G = { E: giriş x, sec: bölme genişliği, deck: yürüme yolunun yüzeyi (ayakların bastığı y), dip: vadi tabanı }
// Sekiz eşit bölme: her bölmenin altında bir kemer, her bölme sınırında bir korkuluk direği ve bir ayak. Hiçbir ayak öne çıkmaz.
const sonX = G => G.E + 8 * G.sec;
const direkX = (G, i) => G.E + i * G.sec;
function viyadukArka(K, G, { ray = true } = {}) {   // ayaklar, kemerler, tabliye, ray (karakterin arkasında)
  const { ctx } = K, { E, sec, deck, dip } = G, X = sonX(G), k = sec / 230, lw = Math.max(3, LW * Math.min(1, k * 1.4));
  const kal = 0.2 * sec;                              // tabliye kalınlığı
  // gövde: tabliyeden vadi tabanına taş duvar, kemer boşlukları
  ctx.save();
  ctx.beginPath(); ctx.rect(E - 0.12 * sec, deck - 0.02 * sec, X - E + 0.24 * sec, dip - deck + 0.02 * sec);
  for (let i = 0; i < 8; i++) {                      // kemer boşlukları (evenodd)
    const a = direkX(G, i) + 0.11 * sec, b = direkX(G, i + 1) - 0.11 * sec, r = (b - a) / 2, yk = deck + kal + 0.18 * sec + r;
    ctx.moveTo(a, dip + 2); ctx.lineTo(a, yk); ctx.arc(a + r, yk, r, Math.PI, 0); ctx.lineTo(b, dip + 2); ctx.closePath();
  }
  ctx.fillStyle = TAS; ctx.fill('evenodd'); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
  // ayakların gölge yüzü ve taş derzleri (eşit, her ayakta aynı)
  for (let i = 0; i <= 8; i++) {
    const x = direkX(G, i);
    ctx.save(); ctx.globalAlpha = 0.55; K.rect(x + 0.02 * sec, deck + kal + 0.5 * sec, 0.08 * sec, dip - deck - kal - 0.5 * sec, TAS_G, 0); ctx.restore();
  }
  for (let j = 1; j < 4; j++) { const y = deck + kal + j * 0.45 * sec; if (y < dip - 10) for (let i = 0; i <= 8; i++) K.line(direkX(G, i) - 0.1 * sec, y, direkX(G, i) + 0.1 * sec, y, lw * 0.5, TAS_K); }
  // tabliye kuşağı
  K.rect(E - 0.16 * sec, deck, X - E + 0.32 * sec, kal, TAS_G, lw);
  for (let i = 0; i < 16; i++) K.line(E + (i + 0.5) * sec / 2, deck + 0.04 * sec, E + (i + 0.5) * sec / 2, deck + kal - 0.04 * sec, lw * 0.45, TAS_K);
  if (ray) {                                          // ray ve travers uçları (yürüme yolunun arkasında, biraz yukarıda)
    const yr = deck - 0.07 * sec;
    K.rect(E - 0.16 * sec, yr, X - E + 0.32 * sec, 0.07 * sec, '#6B6357', 0);
    for (let x = E; x < X; x += 0.22 * sec) K.rect(x, yr - 0.025 * sec, 0.13 * sec, 0.04 * sec, '#7A5A3C', 0);
    K.line(E - 0.16 * sec, yr - 0.035 * sec, X + 0.16 * sec, yr - 0.035 * sec, Math.max(2.5, 0.035 * sec), '#8D949A');
  }
}
function korkuluk(K, G) {   // ön korkuluk: dokuz direk, iki kuşak (karakterin önünde)
  const { E, sec, deck } = G, X = sonX(G), k = sec / 230, hr = 1.05 * sec, lw = Math.max(2.5, LW * Math.min(1, k * 1.4));
  const dw = Math.max(5, 0.075 * sec);
  for (const yy of [deck - hr, deck - hr * 0.5]) { K.line(E, yy, X, yy, Math.max(4, 0.045 * sec) + lw, INK); K.line(E, yy, X, yy, Math.max(2, 0.045 * sec), DEMIR); }
  for (let i = 0; i <= 8; i++) {
    const x = direkX(G, i);
    K.rect(x - dw / 2, deck - hr, dw, hr, DEMIR, lw);
    K.rect(x - dw * 0.8, deck - hr - dw * 0.5, dw * 1.6, dw * 0.7, DEMIR, lw, dw * 0.3);
  }
}

// Tepenin ardından yükselen tren dumanı (döngü): dört bulutçuk sırayla yükselir, büyür, solar. a: belirme (0..1)
function dumanSutun(K, x, y, t, a = 1, k = 1) {
  const { ctx } = K;
  for (let j = 0; j < 6; j++) {
    const u = ((t / 2.1 + j / 6) % 1 + 1) % 1, e = ease.enter(u);
    ctx.save(); ctx.globalAlpha = a * 0.92 * (1 - u * u);
    K.circ(x + (70 * e + 10 * Math.sin(u * 5 + j)) * k, y - (60 + 240 * e) * k, (30 + 40 * e) * k, '#EDE7DD', Math.max(2.5, 4 * k));
    ctx.restore();
  }
}
// ═══════════════════════════ Vadi zemini (iki ölçek ortak) ═══════════════════════════
function kuslar(K, t, x0, x1, y, k = 1) {   // döngü: iki kuş süzülür, kanat çırpar
  const w = x1 - x0 + 200;
  for (let i = 0; i < 2; i++) {
    const v = 40 + 10 * i, u = ((t * v + i * 520) % w + w) % w, x = x0 - 100 + u, yy = y + i * 60 * k + 10 * Math.sin(t * 1.1 + i * 2), kk = k * (1 - 0.2 * i), kan = Math.sin(t * 6 + i);
    const { ctx } = K, a = 12 * kk * (1 + 0.35 * kan);
    ctx.beginPath(); ctx.moveTo(x - 20 * kk, yy + 4 * kan * kk); ctx.quadraticCurveTo(x - 9 * kk, yy - a, x, yy); ctx.quadraticCurveTo(x + 9 * kk, yy - a, x + 20 * kk, yy + 4 * kan * kk);
    ctx.lineWidth = 4 * Math.max(0.7, kk); ctx.strokeStyle = INK; ctx.stroke();
  }
}
function tepe(K, pts, renk, lw = 4) { K.poly(pts, renk, lw); }
function agac(K, x, y, r, renk = OT_K) { K.rect(x - r * 0.12, y - r * 0.6, r * 0.24, r * 0.7, '#6B4E33', Math.max(2, r * 0.07)); K.circ(x, y - r * 0.95, r * 0.62, renk, Math.max(2, r * 0.08)); }
function nehir(K, x0, x1, y, h, t, k = 1) {   // döngü: akan su çizgileri
  const { ctx } = K; ctx.fillStyle = NEHIR; ctx.fillRect(x0, y, x1 - x0, h); K.line(x0, y, x1, y, 4);
  for (let r = 0; r < 3; r++) {
    const yy = y + (r + 0.6) * h / 3.4, sp = 160 * k, L = (30 + r * 14) * k, o = ((t * (40 + r * 14) * k + r * 53) % sp + sp) % sp;
    for (let x = x0 - sp + o; x < x1 + sp; x += sp) K.line(x, yy, x + L, yy, 3 + r, NEHIR_A);
  }
}

// ═══════════════════════════ Mekân 1: ofis (bugün, öğle) ═══════════════════════════
const OFIS = 'b075_ofis';
const PEN = { x: 400, y: 545, w: 540, h: 470 };                // vadi ve viyadük manzaralı pencere
const PG = { E: 550, sec: 44, deck: 812, dip: 960 };            // pencerede viyadük (bugün; tren yok)
const NEC_X = 330, DEF_X = 1010, HIK_X = 1380;
const MASA = { x0: 1230, x1: 1650, y: 1200 };
function manzara(t) {
  return (K, x, y, w, h, I) => {
    const { ctx } = K;
    tepe(K, [[x - 20, y + 260], [x + 80, y + 190], [x + 200, y + 230], [x + 330, y + 160], [x + 470, y + 215], [x + w + 20, y + 180], [x + w + 20, y + h], [x - 20, y + h]], DAG_U, 3);
    tepe(K, [[x - 20, y + 300], [x + 120, y + 250], [x + 260, y + 290], [x + w + 20, y + 245], [x + w + 20, y + h], [x - 20, y + h]], DAG, 3);
    M.bulut(K, x + ((t * 9) % (w + 300)) - 120, y + 90, 0.42);
    M.bulut(K, x + ((t * 6 + 260) % (w + 300)) - 120, y + 150, 0.3);
    // sol yaka (viyadüğün girişi), vadi, sağ yaka
    tepe(K, [[x - 20, PG.deck - 40], [x + 90, PG.deck - 60], [PG.E - 20, PG.deck - 4], [PG.E, PG.deck], [PG.E, y + h], [x - 20, y + h]], OT, 3);
    nehir(K, x, x + w, PG.dip, y + h - PG.dip, t, 0.35);
    viyadukArka(K, PG);
    korkuluk(K, PG);
    tepe(K, [[sonX(PG), PG.deck], [sonX(PG) + 30, PG.deck - 20], [x + w + 20, PG.deck - 40], [x + w + 20, y + h], [sonX(PG), y + h]], OT, 3);
    for (const [ax, ay, r] of [[x + 40, PG.deck + 70, 34], [x + 110, PG.deck + 110, 30], [x + w - 20, PG.deck + 90, 32]]) agac(K, ax, ay, r);
  };
}
function masaCiz(K) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 16, y + 34, x1 - x0 - 32, 1500 - y - 34, PAL.wood, LW);
  for (const dx of [40, 236]) { K.rect(x0 + dx, y + 66, 170, 118, PAL.woodTop, LW * 0.6, 6); K.line(x0 + dx + 62, y + 124, x0 + dx + 108, y + 124, 8); }
  K.rect(x0, y, x1 - x0, 36, PAL.woodTop, LW, 8);
}
function bardak(K, x, yb, { k = 2, buhar = false, t = 0, dolu = true } = {}) {   // ince belli çay bardağı: (x, yb) taban
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], dolu ? '#A8401F' : '#E3EEEA', 2.4 / k * 1.45);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 36 * k, t, { k: 0.38, n: 2, ara: 9, boy: 56 });
}
function saksi(K, x, yb, t) {   // ofis bitkisi (döngü: yapraklar hafif salınır)
  K.poly([[x - 60, yb - 120], [x + 60, yb - 120], [x + 46, yb], [x - 46, yb]], PAL.coral, LW);
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32 + 0.05 * Math.sin(t * 1.3 + i); H.yaprak(K, x, yb - 116, 150 + 30 * (i % 2), a, PAL.green, 1); }
}
M.mekanEkle(OFIS, {
  gen: [-300, 1900], dongu: ['pencerede bulutlar, kuş ve nehir', 'çay buharı', 'bitkinin yaprakları'],
  capa: { pencere: [PEN.x + PEN.w / 2, PEN.y + PEN.h / 2], giris: [PG.E, PG.deck] },
  kadraj: { genis: [1.0, 590, 985] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 2000, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, PEN.x, PEN.y, PEN.w, PEN.h, { isik, t, gunes: 0.3, manzara: manzara(t), kayit: false });
    K.rect(PEN.x - 30, PEN.y + PEN.h, PEN.w + 60, 26, PAL.trim, LW * 0.8, 6);
    saksi(K, 1760, 1500, t);
    K.rect(-170, 640, 300, 230, '#B8925E', LW, 8);                                        // pano: yazısız kâğıtlar
    for (const [px, py, c] of [[-140, 670, PAL.cream], [-40, 680, PAL.mustard], [-130, 770, '#6FB3AC'], [-10, 780, PAL.cream]]) { K.rect(px, py, 80, 70, c, LW * 0.6, 3); K.circ(px + 40, py + 6, 6, PAL.coral, 2); }
  },
});

// ═══════════════════════════ Mekân 2: viyadük, yakın (dün akşam) ═══════════════════════════
// Dünya: giriş x = 0, bölme 230 px. Necmi yürüme yolunda (korkuluğun arkasında) sağa yürür, 3. direkte durur.
const KOPRU = 'b075_kopru';
const GM = { E: 0, sec: 170, deck: 1130, dip: 2300 };
const SM = 150;                                                 // Necmi ölçeği (yakın)
M.mekanEkle(KOPRU, {
  gen: [-700, 2200], dongu: ['tepenin ardından yükselen duman', 'akan nehir', 'kuşlar', 'bulutlar'],
  arka(K, t, { isik, duman }) {
    const I = isik, { ctx } = K;
    M.gok(K, -900, -600, 3200, 2000, { isik: I, gunes: 0.84, r: 70 });
    M.bulut(K, -500 + ((t * 14) % 2600), 520, 1.1); M.bulut(K, 300 + ((t * 10) % 2600) - 1300, 640, 0.8);
    kuslar(K, t, -600, 1800, 560, 1.1);
    tepe(K, [[-900, 980], [-500, 820], [-100, 900], [400, 800], [900, 880], [1400, 790], [2100, 900], [2100, 2400], [-900, 2400]], DAG_U, 4);
    tepe(K, [[-900, 1080], [-300, 1000], [500, 1060], [1200, 990], [2100, 1060], [2100, 2400], [-900, 2400]], DAG, 4);
    // trenin geldiği tepe (solda); duman tepenin ardından yükselir
    if (duman) dumanSutun(K, -130, 930, t, duman.a);
    tepe(K, [[-900, 760], [-520, 700], [-250, 770], [-110, 920], [-20, GM.deck - 30], [GM.E, GM.deck], [GM.E, 2400], [-900, 2400]], OT, LW);
    for (const [ax, ay, r] of [[-560, 760, 56], [-400, 760, 50], [-170, 900, 46]]) agac(K, ax, ay, r);
    nehir(K, -900, 2200, 1880, 400, t, 1);
    viyadukArka(K, GM);
  },
  on(K) { korkuluk(K, GM); },
});

// ═══════════════════════════ Mekân 3: viyadük, geniş (dün akşam) ═══════════════════════════
// Dünya = ekran (kamera 1,0, 540, 960). Köprünün tamamı: giriş 280, çıkış 990, sekiz bölme. Tren uzakta, dağın içinden gelir.
const GENIS = 'b075_genis';
const GW = { E: 280, sec: 88.75, deck: 1010, dip: 1560 };
const SW = SM * GW.sec / GM.sec;                                // Necmi ölçeği (geniş): bölme / boy oranı yakın plânla aynı
const TREN_YOL = [[214, 832], [176, 846], [146, 870], [150, 902], [196, 930], [236, 960], [264, 994], [GW.E, GW.deck - 6]];
M.mekanEkle(GENIS, {
  gen: [0, 1080], dongu: ['tünelin üstünden yükselen tren dumanı', 'akan nehir', 'kuşlar', 'bulutlar'],
  arka(K, t, { isik, trenS }) {
    const I = isik;
    M.gok(K, -100, -300, 1300, 1400, { isik: I, gunes: 0.84, r: 44 });
    M.bulut(K, -200 + ((t * 9) % 1500), 640, 0.6); M.bulut(K, 500 + ((t * 7) % 1500) - 750, 720, 0.45);
    kuslar(K, t, -100, 1200, 640, 0.7);
    tepe(K, [[-100, 840], [120, 760], [330, 820], [560, 740], [800, 810], [1000, 750], [1200, 820], [1200, 1700], [-100, 1700]], DAG_U, 3);
    tepe(K, [[-100, 900], [200, 860], [520, 905], [820, 860], [1200, 900], [1200, 1700], [-100, 1700]], DAG, 3);
    // sol yaka: dağdan inen hat (tünel ağzından giriş)
    tepe(K, [[-100, 800], [60, 790], [190, 800], [230, 860], [262, 960], [GW.E, GW.deck], [GW.E, 1700], [-100, 1700]], OT, 3);
    K.ctx.save(); K.ctx.lineCap = 'round'; K.ctx.lineJoin = 'round';
    K.ctx.beginPath(); TREN_YOL.forEach(([x, y], i) => i ? K.ctx.lineTo(x, y) : K.ctx.moveTo(x, y)); K.ctx.lineWidth = 9; K.ctx.strokeStyle = '#6B6357'; K.ctx.stroke();
    K.ctx.lineWidth = 3; K.ctx.strokeStyle = '#8D949A'; K.ctx.stroke(); K.ctx.restore();
    dumanSutun(K, 232 + 4 * (trenS ?? 0), 818, t, 1, 0.38);                             // tren tünelde: yalnız dumanı görünür (uzaklığı ölçülemez)
    tepe(K, [[214, 808], [250, 806], [262, 850], [214, 852]], '#2A2A26', 3);                // tünel ağzı (trenin arkası içinde)
    tepe(K, [[-100, 790], [120, 772], [220, 790], [262, 806], [262, 822], [214, 824], [208, 812], [-100, 850]], OT_U, 3);   // tünelin üstü
    for (const [ax, ay, r] of [[40, 900, 26], [80, 950, 30], [190, 1010, 28]]) agac(K, ax, ay, r);
    nehir(K, -100, 1200, 1430, 700, t, 0.6);
    // sağ yaka
    tepe(K, [[sonX(GW), GW.deck], [1030, 980], [1200, 960], [1200, 1700], [sonX(GW), 1700]], OT, 3);
    viyadukArka(K, GW);
  },
  on(K) { korkuluk(K, GW); },
});

// Gölge Necmi (seçenek): yarı saydam açık siluet. lekele'nin kopyası, siluet yarı saydam çizilir (bölüme özgü).
let _off = null;
function hayalet(K, fn, renk, a) {
  if (a <= 0.01) return;
  const { ctx } = K, cv = ctx.canvas;
  if (!_off || _off.width !== cv.width || _off.height !== cv.height) { _off = document.createElement('canvas'); _off.width = cv.width; _off.height = cv.height; }
  const o = _off.getContext('2d');
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1; o.clearRect(0, 0, cv.width, cv.height);
  o.save(); o.setTransform(ctx.getTransform()); fn(H.kit(o)); o.restore();
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-in'; o.fillStyle = renk; o.fillRect(0, 0, cv.width, cv.height);
  o.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(_off, 0, 0); ctx.restore();
}
// Varmış (koşudan yeni durmuş) gölge pozu: yandan, yöne dönük, hafif öne eğik, bir ayak önde
function golgePoz(x, y, yon) {
  return H.kisi('necmi', { x, y, s: SW, view: 'side', facing: yon, lean: 8, expr: 'notr', head: { tilt: 0, look: [0.6, 0] },
    legL: { hip: 26, knee: 30 }, legR: { hip: -16, knee: 12 }, armL: { sh: -30, el: 50 }, armR: { sh: 34, el: 60 } });
}
// Kesikli ok (dünya): a'dan b'ye, u oranında uzamış
function ok(K, a, b, u, renk, w = 9) {
  if (u <= 0.01) return;
  const { ctx } = K, e = [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], d = Math.sign(b[0] - a[0]) || 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.setLineDash([22, 14]);
  H.strokeLine(ctx, a, [e[0] - d * 12, e[1]], w + 7, INK); H.strokeLine(ctx, a, [e[0] - d * 12, e[1]], w, renk);
  ctx.restore();
  K.poly([[e[0] + d * 8, e[1]], [e[0] - d * 24, e[1] - 20], [e[0] - d * 24, e[1] + 20]], renk, 4);
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    kopru: T('n0:5') - 0.1, ucunde: T('n0:6'), ses: T('n0:9') - 0.05, gecis: T('h1'), girmis: T('h1:4'),
    genis: T('n0b') - 0.08, geri: T('n0b:6'), ileri: T('n0b:10'), ayni: T('n0b:14'), n0bS: T('n0b>'),
    nyakin: T('n0c') - 0.08, on: T('n0c:2'),
    hikmet: T('h3') - 0.1, kac: T('h3:4'),
    sayac: cd0 - 0.05, say2: cd0 + 3.35, say3: cd0 + 6.7,
    n1: T('n1'), ileriN: T('n1:1'), kopruN: T('n1:4') - 0.1, nerede: T('n1:6'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  tm.dur = tm.ucunde + 0.45;                                    // Necmi 3. direkte durur ("üçündeyken")

  const film = H.sahneler([
    { id: 'kanca', mekan: OFIS, t0: 0, kay: [-16, 0], cam: [[0, 1.08, 660, 950]] },
    { id: 'kopru', mekan: KOPRU, geri: true, t0: tm.kopru, cam: [[0, 1.15, 470, 960], [tm.ses + 0.15, 1.0, 180, 935]] },
    { id: 'genis', mekan: GENIS, geri: true, t0: tm.genis, cam: [[0, 1.0, 560, 975], [tm.n0bS, 1.03, 560, 970]] },
    { id: 'necmi', mekan: OFIS, t0: tm.nyakin, kay: [30, 0], cam: [[0, 1.42, 470, 975]] },
    { id: 'hikmet', mekan: OFIS, t0: tm.hikmet, kay: [30, 0], cam: [[0, 1.42, 1210, 960]] },
    { id: 'sayac', mekan: OFIS, t0: tm.sayac, cam: [[0, 1.3, 440, 1010]] },
    { id: 'say2', mekan: OFIS, t0: tm.say2, cam: [[0, 1.3, 1185, 990]] },
    { id: 'say3', mekan: OFIS, t0: tm.say3, kesme: false, cam: [[0, 1.3, 1185, 990]] },
    { id: 'buldum', mekan: OFIS, t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.36, 980, 975]] },
    { id: 'cevap', mekan: OFIS, t0: tm.cevap, kesme: false, cam: [[0, 1.3, 860, 975]] },
    { id: 'cta', mekan: OFIS, t0: tm.cta, kesme: false, cam: [[0, 1.34, 980, 975]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— ofis pozları (önden) ———
  const necBase = H.kisi('necmi', { x: NEC_X, expr: 'notr', head: { tilt: -3, look: [0.75, -0.25] }, ...POZ.dur });
  const nec = [
    [tm.kopru - 0.3, { head: { tilt: 4, look: [0.55, 0.15] } }, 0.35],
    [tm.nyakin, { expr: 'notr', head: { tilt: -3, look: [0.8, -0.05] } }, 0.01],
    [tm.sayac, { expr: DALGIN, head: { tilt: 3, look: [0.85, -0.2] } }, 0.01],
    [tm.sayac + 1.6, { expr: NGULUS, head: { tilt: -3, look: [0.75, -0.05] } }, 0.35],
    [tm.sayac + 2.6, { head: { tilt: 4, look: [0.9, -0.3] } }, 0.35],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: SASKIN, head: { tilt: 4, look: [-0.85, -0.2] }, ...POZ.dur });
  const def = [
    [0.3, { head: { tilt: -3, look: [-0.8, -0.3] } }, 0.3],
    [1.4, { expr: MERAK, head: { tilt: 3, look: [-0.85, -0.05] } }, 0.35],
    [tm.hikmet, { expr: MERAK, head: { tilt: 4, look: [0.8, -0.1] } }, 0.01],
    [tm.say2, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -5, look: [-0.3, -0.55] } }, 0.01],
    [tm.say2 + 1.5, { head: { tilt: 4, look: [-0.5, -0.5] } }, 0.4],
    [tm.say3 - 0.2, { expr: MERAK, armR: POZ.dur.armR, head: { tilt: -3, look: [-0.85, -0.1] } }, 0.4],
    [tm.say3 + 1.6, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 4, look: [-0.8, -0.25] } }, 0.4],
    [tm.n1 - 0.25, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -2, look: [-0.3, 0.05] } }, 0.3],
    [tm.kopruN - 0.1, { head: { tilt: 3, look: [-0.85, -0.1] } }, 0.3],
    [tm.nerede - 0.1, { head: { tilt: -3, look: [-0.2, 0.05] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, -0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -4, look: [0.05, 0.05] } }, 0.3],
  ];
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'notr', head: { tilt: -3, look: [-0.7, -0.05] }, ...POZ.dur });
  const hik = [
    [tm.kac - 0.3, { head: { tilt: 4, look: [-0.8, 0.05] } }, 0.3],
    [tm.say2, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 4, look: [-0.3, -0.55] } }, 0.01],
    [tm.say2 + 2.0, { expr: MERAK, armR: POZ.dur.armR, head: { tilt: -4, look: [-0.6, -0.3] } }, 0.35],
  ];
  // Altyazı çizelgesi (yalnız balon): n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar ekranda kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t0: l.t0 + 0.08, t1: T('d3') - 0.3 } : l.id === 'h3' ? { ...l, t1: Math.min(l.t1, tm.sayac - 0.42) } : l.id === 'n0c' ? { ...l, t1: Math.min(l.t1, tm.hikmet - 0.36) } : l) };   // balonlar kesmeden ve sayaç şeridinden önce kapanır
  return { tm, film, tlA, necBase, nec, defBase, def, hikBase, hik };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç perdesi sahneyi örtmesin)
  kuyruksuz: (t, B) => !!B.sc.geri,
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id, lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
    if (id === 'sayac') Object.assign(cam, { zoom: lg(1.3, 1.37, clamp01((t - tm.sayac) / 3.4)), cx: 440, cy: 1010 });
    else if (id === 'say2') Object.assign(cam, { zoom: lg(1.3, 1.36, clamp01((t - tm.say2) / 3.35)), cx: 1185, cy: 990 });
    else if (id === 'say3') {   // 0,8 sn'de Defne ve pencereye kayar, sonra kesime kadar doğrusal itme
      const u = ease.state(seg(t, tm.say3, 0.8)), z = lg(1.3, 1.38, clamp01((t - tm.say3 - 0.8) / (tm.buldum - tm.say3 - 0.8)));
      Object.assign(cam, { zoom: z, cx: lerp(1185, 865, u), cy: lerp(990, 975, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    H.zamanHapi(K, t, tm.kopru + 0.2, tm.kopru + 1.75, K.up('dün'), { x: 540, y: 575, saat: 17.5 });
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
  const m = B.sc.mekan;
  if (m === KOPRU) return kopruSahne(K, t, S, B);
  if (m === GENIS) return genisSahne(K, t, S, B);
  return ofisSahne(K, t, tl, S, B);
}

// ——— Ofis ———
// Plânda kimler çizilir (kadraj kenarında yarım yüz ya da kulak kalmasın diye plân dışındakiler çizilmez)
const KADRO = { kanca: 'NDH', necmi: 'N', hikmet: 'DH', sayac: 'N', say2: 'DH', say3: 'DH', buldum: 'D', cevap: 'D', cta: 'D' };
function ofisSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, kadro = KADRO[id] || 'NDH';
  const varH = kadro.includes('H') && !(id === 'say3' && t > tm.say3 + 0.9);
  M.mekanCiz(K, OFIS, 'arka', t, { isik: M.ISIK.gunduz });
  // Hikmet (masanın arkasında; elinde çay)
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), hO = { heads };
  const hCay = [hp.x + 100, 1150];
  let hBardakElde = false;
  if (id === 'hikmet') {
    const k = H.nabiz(t, tm.kac - 0.1, 0.6);                                      // "kaç kilometre": çay bardağıyla Defne'yi gösterir
    hO.R = [[hCay[0] + 8, hCay[1] - 26 - 40 * k], 1, 'A']; hBardakElde = true;
  } else if (id === 'say2' || id === 'say3') H.omuzSilk(hp, t, tm.say2 + 2.2, 0.45);
  const hc = varH ? oyna(K, t, tl, 'hikmet', hp, hO) : null;
  masaCiz(K);
  if (!hBardakElde || !hc) bardak(K, hCay[0], MASA.y, { buhar: true, t });
  else { bardak(K, hc.handR[0] - 8, hc.handR[1] + 26, { buhar: true, t }); hc.tut('R'); }

  // Necmi (pencerenin solunda; sol elinde çay, sağ eliyle penceredeki viyadüğü gösterir)
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t), nO = { heads };
  const nCay = [np.x - 60, 1215];
  nO.L = [[nCay[0] - 8, nCay[1] - 26], 1, 'A'];
  let nGos = null;
  if (id === 'kanca') {
    const hedef = [direkX(PG, 3), PG.deck - 30];
    const pomp = 18 * H.nabiz(t, 0.3, 0.36) + 14 * H.nabiz(t, S.tm.kopru - 0.75, 0.34);
    nO.R = [[NEC_X + 250 - pomp * 0.5, 1000 - pomp], 1, 'B']; nGos = hedef;
  } else if (id === 'sayac') H.onayla(np, t, tm.sayac + 1.8, 2, 0.38);
  else if (id === 'necmi') {                                                       // "Ben saatte on kilometre": eli göğsünde, başını sallar
    const w = pIn(t, tm.nyakin + 0.1, tm.nyakin + 2.0, 0.3);
    if (w > 0.01) nO.R = [H.elYeri('necmi', np, 'R', 'gogus'), w, 'A'];
    H.onayla(np, t, tm.on, 1, 0.42);
  }
  if (kadro.includes('N')) {
    const nc = oyna(K, t, tl, 'necmi', np, nO);
    bardak(K, nc.handL[0] + 8, nc.handL[1] + 26, { buhar: true, t }); nc.tut('L');
    if (nGos) nc.isaret('R', nGos);
  }

  // Defne
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t), dO = { heads };
  dp.y -= H.buldumHop(t, tm.buldum);
  let dGos = null;
  if (id === 'say3') {
    if (t > tm.kopruN - 0.4) dp.blink = 0;
    const wG = pIn(t, tm.kopruN - 0.2, tm.nerede - 0.05, 0.28);                      // "köprüye": penceredeki köprünün girişini gösterir
    if (wG > 0.01) { dO.L = [[dp.x - 215, 1070], wG, 'B']; if (wG > 0.6) dGos = [PG.E + 6, PG.deck - 24]; }   // el pencerenin altında, parmak girişe dönük; ucu köprüye değmez
    if (wG < 0.01) H.omuzSilk(dp, t, tm.nerede + 0.05, 0.5);                       // "nerede olurdu?": omuz silker, soru
  } else if (id === 'cevap') {
    const wG = W(t, tm.cevap + 0.2, 0.28); dO.L = [[dp.x - 230, 1000], wG, 'B']; if (wG > 0.6) dGos = [PG.E + 6, PG.deck - 24];
  }
  if (!kadro.includes('D')) return;
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (dGos) dc.isaret('L', dGos);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// ——— Viyadük, yakın (dün akşam): Necmi yürür, 3. direkte durur, tren sesiyle arkasına döner ———
function kopruSahne(K, t, S, B) {
  const { tm } = S, key = 'necmi', s = SM, I = M.ISIK.aksam;
  const duman = t >= tm.ses - 0.3 ? { a: seg(t, tm.ses - 0.3, 0.6) } : null;
  M.mekanCiz(K, KOPRU, 'arka', t, { isik: I, duman });
  const X3 = direkX(GM, 3) - 30;                    // 3. direğin hemen önünde durur (direk ayağının önünde değil)
  let p;
  if (t < tm.dur) p = H.yuru(key, t, { t0: tm.kopru - 1.6, t1: tm.dur, x0: X3 - 560, x1: X3, y: GM.deck, s, poz: { expr: DALGIN, head: { tilt: 0, look: [0.6, 0] } } });
  else {                                            // önden: "tren sesi"nde başını arkaya (sola) çevirir
    const don = W(t, tm.ses, 0.3);
    p = H.kisi(key, { x: X3, y: GM.deck, s, expr: t < tm.ses ? DALGIN : KAYGI, head: { tilt: lerp(2, -4, don), look: [lerp(0.5, -0.9, don), -0.05] }, ...POZ.dur });
    p.blink = t > tm.ses && t < tm.ses + 1.2 ? 0 : p.blink;
  }
  oyna(K, t, null, key, p, { sessiz: true });
  M.mekanCiz(K, KOPRU, 'on', t, { isik: I });
}

// ——— Viyadük, geniş (dün akşam): köprünün tamamı, uzakta tren; iki seçenek (geri / ileri) ok ve gölgeyle ———
function genisSahne(K, t, S, B) {
  const { tm } = S, key = 'necmi', I = M.ISIK.aksam;
  const trenS = t - tm.genis;
  M.mekanCiz(K, GENIS, 'arka', t, { isik: I, trenS });
  const nx = direkX(GW, 3) - 8, ny = GW.deck, ayak = [nx, ny - 10];
  const A0 = [nx - 30, ny - 14], A1 = [GW.E + 30, ny - 14], B0 = [nx + 30, ny - 14], B1 = [sonX(GW) - 30, ny - 14];
  const uG = ease.enter(seg(t, tm.geri + 0.04, 0.5)), uI = ease.enter(seg(t, tm.ileri + 0.04, 0.5));
  const gA = ease.state(seg(t, tm.geri + 0.5, 0.25)), gB = ease.state(seg(t, tm.ileri + 0.5, 0.25));
  // gölgeler (koşmaz; uçta belirir) ve oklar: aynı renk, aynı süre
  hayalet(K, K2 => H.drawChar(K2.ctx, key, golgePoz(GW.E + 34, ny, -1), t), HAYALET, 0.78 * gA);
  hayalet(K, K2 => H.drawChar(K2.ctx, key, golgePoz(sonX(GW) - 34, ny, 1), t), HAYALET, 0.78 * gB);
  // Necmi: önden, arkasına (trene) bakar; "geri"de sol eliyle girişi, "ileri"de sağ eliyle çıkışı gösterir
  const p = H.kisi(key, { x: nx, y: ny, s: SW, expr: KAYGI, head: { tilt: -3, look: [-0.8, -0.05] }, ...POZ.dur });
  const sec = tm.ileri - tm.geri - 0.1;                                            // iki seçenek eşit süre
  const wL = pIn(t, tm.geri - 0.05, tm.geri - 0.05 + sec, 0.25), wR = pIn(t, tm.ileri - 0.05, tm.ileri - 0.05 + sec, 0.25);
  const look = H.iz([[0, -0.8], [tm.geri - 0.1, -0.85, 0.3], [tm.ileri - 0.1, 0.85, 0.3], [tm.ileri - 0.1 + sec, -0.7, 0.35]], t);
  p.head = { ...p.head, look: [look, -0.05], tilt: look * 3 };
  if (t > tm.ileri + sec) H.onayla(p, t, tm.ileri + sec, 1, 0.42);
  const o = { sessiz: true };
  if (wL > 0.01) o.L = [[nx - 60, ny - 120], wL, 'B'];
  if (wR > 0.01) o.R = [[nx + 60, ny - 120], wR, 'B'];
  oyna(K, t, null, key, p, o);
  M.mekanCiz(K, GENIS, 'on', t, { isik: I });
  ok(K, A0, A1, uG, OK_RENK); ok(K, B0, B1, uI, OK_RENK);
}
