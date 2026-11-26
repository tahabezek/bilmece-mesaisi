// Bölüm 72 · DAMA (v4 "hikâye" dili, cevapsız tasarım, kısa format; storyboard: hikayeler/bolum_072_v5.md).
// Mekanizma: seçim. Üç oyunda üst üste iki galibiyet için ortadaki oyun mutlaka kazanılmalı (cevap kesilen arşivde).
// Logline: Hikmet, Defne'ye üç oyunluk bir dama maçı önerir: üst üste iki oyun kazanırsa bir hafta çay Hikmet'ten. Rakip her
// oyunda değişir: Hikmet (usta) ve Necmi (acemi) sırayla. Sırayı Defne seçecek: Hikmet–Necmi–Hikmet mi, Necmi–Hikmet–Necmi mi?
// Akılda kalacak tek şey: hangi oyunu mutlaka kazanman gerektiğini önce bul.
// Sızıntı yasağı: iki dizilim aynı kartta, aynı renkte, aynı boyda, aynı sürede gösterilir; sayaçta yan yana sabit durur.
// Hiçbir kart ışık, büyütme, renk ya da bakış ısrarıyla öne çıkmaz; Defne seçimini yapmaz. "ORTADAKİ" ve "KOLAY RAKİP ORTADA"
// hiçbir yazıda geçmez. Defne'nin yanlış denemesi (acemiyle iki kez) oynanır ama doğru ya da yanlış diye işaretlenmez.
// Mekân: ofiste öğle arası. Defne masanın sol ucunda oturur (yandan, yüzü sağa); Hikmet masanın arkasında ayakta (önden),
// Necmi masanın sağ ucunun yanında ayakta (önden). Masada Türk daması (8 × 8, düz renkli), Defne'nin yanında ödül çay.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OFIS = 'b072_ofis';
const ZEMIN = 1500, YB = 1172, YF = 1326, PERVAZ = 20, TX = [290, 900];      // masa üstü arka ve ön kenar, masanın iki ucu
const DEF_X = 230, HIK_X = 640, NEC_X = 1125;
// tahta (yandan, masanın üst yüzünde yamuk): arka kenar ve ön kenar
const TB = { yb: 1186, yf: 1314, xb: [468, 772], xf: [448, 792] };
// kartlar: aynı kâğıt, aynı boy, aynı yazı; standın iki yuvası Hikmet'in iki yanında eşit uzaklıkta
const KW = 210, KH = 184, KFS = 45, KALT = 1168;                              // kart eni, boyu, yazı boyu, kartın alt kenarı (standda)
const YUVA = { A: [HIK_X - 110, KALT - KH / 2], B: [HIK_X + 110, KALT - KH / 2] };   // kart merkezleri
const DIZI = { A: ['HİKMET', 'NECMİ', 'HİKMET'], B: ['NECMİ', 'HİKMET', 'NECMİ'] };
const KAGIT = '#FBF6EC';
const CAY_P = [380, 1202];                                                     // ödül çayı (tabak ortası), Defne'nin tarafında
const CAY = '#A8401F';
// Konuşmayanın ağzı kapalı
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 1, pupil: 1, curve: 0.7, open: 0, w: 1.2 };
const DIKKAT = { brow: 0.06, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const MERAK = { brow: 0.07, browTilt: -0.04, eye: 1.12, pupil: 0.95, curve: 0.18, open: 0, w: 0.8 };
const KONUS = { brow: 0.03, browTilt: -0.05, eye: 1, pupil: 1, curve: 0.45, open: 0, w: 1.05 };
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));

// ═══════════════════════════ Dama (Türk daması, başlangıç dizilişi) ═══════════════════════════
// Sütun (c) masanın soldan sağa ekseni, sıra (r) derinlik (0 arka, 7 ön). Defne solda: açık taşları 1. ve 2. sütunda;
// karşı tarafın koyu taşları 5. ve 6. sütunda (her biri 16 taş). Insert'te Defne 3. sıradaki bir taşını bir kare ileri iter.
const HAMLE = { r: 3, c0: 2, c1: 3 };
function taslar(t, tm) {
  const out = [];
  for (let r = 0; r < 8; r++) for (const c of [1, 2, 5, 6]) out.push({ r, c, acik: c < 4 });
  const u = ease.state(seg(t, tm.itme, 0.32));
  for (const s of out) if (s.r === HAMLE.r && s.c === HAMLE.c0) s.c = lerp(HAMLE.c0, HAMLE.c1, u);
  return out;
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Tahta (yandan): kare (c, r) köşesi
function tahtaNokta(c, r) {
  const v = r / 8, xl = lerp(TB.xb[0], TB.xf[0], v), xr = lerp(TB.xb[1], TB.xf[1], v);
  return [lerp(xl, xr, c / 8), lerp(TB.yb, TB.yf, v)];
}
function tahtaYan(K, t, tm) {
  const { ctx } = K, P = tahtaNokta;
  const c0 = P(0, 0), c1 = P(8, 0), c2 = P(8, 8), c3 = P(0, 8);
  K.poly([[c0[0] - 12, c0[1] - 6], [c1[0] + 12, c1[1] - 6], [c2[0] + 14, c2[1] + 8], [c3[0] - 14, c3[1] + 8]], PAL.woodDark, LW * 0.7);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    ctx.beginPath(); const q = [P(c, r), P(c + 1, r), P(c + 1, r + 1), P(c, r + 1)];
    q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    ctx.fillStyle = (r + c) % 2 ? '#B9824A' : '#EBCB94'; ctx.fill();
  }
  K.poly([c0, c1, c2, c3], null, LW * 0.5);
  // taşlar: arkadan öne
  const ts = taslar(t, tm).sort((a, b) => a.r - b.r);
  for (const s of ts) {
    const a = P(s.c + 0.5, s.r + 0.5), b = P(s.c + 1.5, s.r + 0.5), rx = (b[0] - a[0]) * 0.36, ry = rx * 0.42, h = 6;
    const renk = s.acik ? '#F4EDE0' : '#3A3F3C', yan = s.acik ? '#CDBFA6' : '#23272A';
    K.ell(a[0], a[1], rx, ry, yan, LW * 0.45);
    ctx.fillStyle = yan; ctx.fillRect(a[0] - rx, a[1] - h, rx * 2, h);
    K.line(a[0] - rx, a[1] - h, a[0] - rx, a[1], LW * 0.45); K.line(a[0] + rx, a[1] - h, a[0] + rx, a[1], LW * 0.45);
    K.ell(a[0], a[1] - h, rx, ry, renk, LW * 0.45);
  }
}
// Çay bardağı ve tabağı (yandan): (x, yb) tabağın ortası
function bardak(K, [x, yb], k = 1.25) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 0, 23, 6, PAL.cream, 2.5);
  const yol = [[-12, -40], [12, -40], [7, -22], [12, -8], [9, -2], [-9, -2], [-12, -8], [-7, -22]];
  K.poly(yol, '#F3EEE4', 2.5);
  ctx.save(); K.path([[-10.5, -34], [10.5, -34], [6.4, -22], [10.6, -8], [8, -3.5], [-8, -3.5], [-10.6, -8], [-6.4, -22]]); ctx.clip();
  ctx.fillStyle = CAY; ctx.fillRect(-14, -31, 28, 40); K.line(-12, -31, 12, -31, 2.5, '#C9603A'); ctx.restore();
  K.poly(yol, null, 2.5);
  ctx.restore();
}
// Dizilim kartı: (x, y) merkez; yuz: 1 ön yüz, −1 arka yüz (çevrilirken ölçek); iki kart her şeyiyle eşit
function kart(K, [x, y], hangi, sx = 1) {
  const { ctx } = K, on = sx >= 0, k = Math.max(0.04, Math.abs(sx));
  ctx.save(); ctx.translate(x, y); ctx.scale(k, 1);
  K.rect(-KW / 2 + 6, -KH / 2 + 8, KW, KH, INK, 0, 12);
  K.rect(-KW / 2, -KH / 2, KW, KH, KAGIT, LW * 0.8, 12);
  if (on) {
    DIZI[hangi].forEach((ad, i) => K.text(ad, 0, -KH / 2 + 54 + i * 54, KFS, INK, 900));
  } else {
    K.rect(-KW / 2 + 12, -KH / 2 + 12, KW - 24, KH - 24, PAL.teal, LW * 0.5, 8);   // arka yüz: iki kartta aynı desen (yazısız)
    for (let i = -3; i <= 3; i++) K.line(i * 28 - 20, -KH / 2 + 22, i * 28 + 20, KH / 2 - 22, 4, '#3E918B');
  }
  ctx.restore();
}
// Kart standı: masanın arka kenarında, iki yuvalı ahşap çıta
function stand(K) {
  K.rect(HIK_X - 236, KALT - 6, 472, 16, PAL.wood, LW * 0.7, 5);
  K.rect(HIK_X - 226, KALT + 8, 20, 8, PAL.woodDark, LW * 0.5, 3); K.rect(HIK_X + 206, KALT + 8, 20, 8, PAL.woodDark, LW * 0.5, 3);
}
// Masa (önden): üst yüzey, pervaz, ayaklar; karakterlerden sonra çizilir
function masa(K) {
  const [x0, x1] = TX;
  K.rect(x0 + 22, YF + PERVAZ - 4, 24, ZEMIN - YF - PERVAZ + 4, PAL.woodDark, LW, 4);
  K.rect(x1 - 46, YF + PERVAZ - 4, 24, ZEMIN - YF - PERVAZ + 4, PAL.woodDark, LW, 4);
  K.poly([[x0 + 14, YB], [x1 - 14, YB], [x1, YF], [x0, YF]], PAL.woodTop, LW);
  for (const [y, a, b] of [[YB + 24, 0.04, 0.22], [YB + 60, 0.84, 0.97], [YB + 120, 0.03, 0.2], [YB + 96, 0.86, 0.98]]) K.line(lerp(x0, x1, a), y, lerp(x0, x1, b), y, 3, '#B07A44');
  K.rect(x0 - 4, YF, x1 - x0 + 8, PERVAZ, PAL.wood, LW, 5);
}
// Masanın üstüne uzanan kol (yandan): masa yüzeyinin altında kalan kısmını masadan sonra yeniden çizer (070'teki yöntem)
function kolUst(K, key, p, side, a = 1) {
  if (a <= 0.01) return;
  const { ctx } = K, c = H.CARDS[key], s = p.s, j = n => H.eklem(key, p, n + side), sh = j('sh'), el = j('el'), ha = j('hand');
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(-5000, YB - 2, 10000, 3000); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = (c.arm.w + c.line * 2) * s; ctx.stroke();
  ctx.strokeStyle = c.arm.color; ctx.lineWidth = c.arm.w * s; ctx.stroke();
  ctx.restore();
}
// Saksı (Necmi'nin sağında; döngü: yapraklar klimada hafifçe salınır)
function saksi(K, x, yb, t) {
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.34 + 0.05 * Math.sin(t * 1.7 + i * 0.9);
    H.yaprak(K, x + (i - 3) * 6, yb - 118, 120 - Math.abs(i - 3) * 10, a, i % 2 ? PAL.green : '#4E8441', 1);
  }
  K.poly([[x - 58, yb - 128], [x + 58, yb - 128], [x + 44, yb], [x - 44, yb]], PAL.coral, LW);
  K.rect(x - 64, yb - 140, 128, 22, '#C2512F', LW, 5);
}
// Kilim (zemin; ön plan)
function kilim(K) {
  const x0 = 60, x1 = 1220, y0 = 1540, y1 = 1760;
  K.rect(x0, y0, x1 - x0, y1 - y0, PAL.coral, LW, 8);
  K.rect(x0 + 26, y0 + 22, x1 - x0 - 52, y1 - y0 - 44, PAL.mustard, LW * 0.6, 6);
  K.rect(x0 + 56, y0 + 50, x1 - x0 - 112, y1 - y0 - 100, '#B8482C', LW * 0.6, 4);
  for (let i = 0; i < 9; i++) { const x = lerp(x0 + 120, x1 - 120, i / 8); K.poly([[x, y0 + 72], [x + 28, y0 + 110], [x, y0 + 148], [x - 28, y0 + 110]], PAL.cream, LW * 0.5); }
}

// ═══════════════════════════ Mekân: ofis, öğle arası ═══════════════════════════
M.mekanEkle(OFIS, {
  gen: [-400, 1600], dongu: ['duvar saati', 'pencerede martı', 'çay buharı', 'saksı'],
  capa: { masa: [590, YF], stand: [HIK_X, KALT] }, kadraj: {},
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1800, isik, duvar: 'duz', zemin: 'ahsap' });
    M.pencere(K, 790, 660, 150, 200, { isik, t, kayit: false });
    M.duvarSaati(K, 330, 760, 52, 12.5 + t / 60, t);
    kilim(K);
    saksi(K, 1330, ZEMIN, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    uc: T('h1:1'), ust: T('h1:7'), iki: T('h1:9'), cay: T('h1:14'),
    n0: T('n0'), nHik: T('n0:2'), nBen: T('n0:5'),
    h2: T('h2'), usta: T('h2:1'), hNec: T('h2:2'), acemi: T('h2:3'), sira: T('h2:4'), benA: T('h2:7'), yoksa: T('h2:11'), h2s: T('h2>'),
    d2: T('d2'), dIki: T('d2:1'), d2s: T('d2>'),
    sayac: cd0 - 0.05, n1: T('n1'), hangisi: T('n1:4'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  tm.ins = tm.ust - 0.1;                    // insert: tahta ve ödül (üstten)
  tm.itme = tm.iki - 0.05;                  // Defne bir taşını bir kare iter
  tm.koy = tm.cay + 0.08;                   // Hikmet'in eli çayı tahtanın yanına koyar (temas)
  tm.iki2 = tm.n0 - 0.1;
  tm.kartK = tm.benA - 0.1;                 // kart plânı
  tm.defK = tm.d2 - 0.1;
  // kartlar: eşit süre; her biri dizilimin ilk kelimesinde kalkar, 1,3 sn sonra standa iner
  tm.kA = tm.benA - 0.06; tm.kB = tm.yoksa - 0.05; tm.kSure = 1.45; tm.kIn = 0.3;
  tm.say2 = tm.sayac + 5.05; tm.cep = tm.sira;                         // "Sırayı": kartları göğüs cebinden alır
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 0.98, 702, 1128], [tm.ins - 0.4, 0.99, 702, 1127]] },
    { id: 'insert', t0: tm.ins, cam: [[0, 1, 540, 960]] },
    { id: 'iki', t0: tm.iki2, cam: [[0, 1.2, 850, 1100], [tm.kartK - 0.3, 1.21, 850, 1099]] },
    { id: 'kart', t0: tm.kartK, cam: [[0, 1.0, 702, 1118]] },
    { id: 'defne', t0: tm.defK, cam: [[0, 1.3, 570, 1095]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 0.98, 702, 1128]] },                 // doğrusal itme kamera() ile
    { id: 'say2', t0: tm.say2, cam: [[0, 1.3, 568, 1095]] },                    // Defne düşünür; iki kart tam kadrajda
    { id: 'ipucu', t0: tm.cd, cam: [[0, 0.995, 702, 1125]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 330, 1060]] },
    { id: 'cevap', t0: tm.cevap, kesme: false, cam: [[0, 0.98, 702, 1128]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);

  // ——— pozlar ———
  const def = [   // Defne yandan oturur, yüzü sağa
    [0, { expr: DIKKAT, head: { tilt: 5, look: [0.6, 0.45] } }],
    [0.3, { expr: MERAK, head: { tilt: -4, look: [0.75, -0.25] } }, 0.3],
    [tm.cay - 0.2, { expr: GULUS, head: { tilt: 2, look: [0.6, 0.2] } }, 0.3],
    [tm.iki2, { expr: DIKKAT, head: { tilt: -2, look: [0.8, -0.1] } }, 0.01],
    [tm.kartK, { expr: MERAK, head: { tilt: -3, look: [0.75, -0.2] } }, 0.01],
    [tm.defK, { expr: KONUS, head: { tilt: -2, look: [0.8, -0.15] } }, 0.01],
    [tm.d2s + 0.1, { expr: H.IFADE.dusun2, head: { tilt: 3, look: [0.6, 0.15] } }, 0.35],
    // sayaç: iki karta sırayla eşit süre bakar (A 1,6 sn, B 1,6 sn, iki kez), sonra tahtaya
    [tm.sayac, { expr: H.IFADE.dusun2, head: { tilt: 2, look: [0.6, 0.1] } }, 0.01],
    [tm.sayac + 1.0, { head: { tilt: -1, look: [0.55, -0.05] } }, 0.35],
    [tm.sayac + 2.6, { head: { tilt: -4, look: [0.85, -0.15] } }, 0.35],
    [tm.sayac + 4.2, { head: { tilt: -1, look: [0.55, -0.05] } }, 0.35],
    [tm.sayac + 5.8, { head: { tilt: -4, look: [0.85, -0.15] } }, 0.35],
    [tm.sayac + 7.4, { expr: H.IFADE.dusun, head: { tilt: 6, look: [0.6, 0.5] } }, 0.4],
    [tm.n1 - 0.2, { expr: MERAK, head: { tilt: -6, look: [0.85, -0.3] } }, 0.35],
    [tm.n1s + 0.3, { expr: H.IFADE.dusun2, head: { tilt: 6, look: [0.6, 0.5] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.6, -0.3] } }, 0.2],
  ];
  const hik = [   // Hikmet önden, masanın arkasında
    [0, { expr: KONUS, head: { tilt: -4, look: [-0.75, 0.25] } }],
    [tm.cay - 0.6, { head: { tilt: 4, look: [-0.5, 0.5] } }, 0.3],
    [tm.iki2, { expr: GULUS, head: { tilt: -3, look: [0.75, 0.0] } }, 0.01],
    [tm.nHik + 0.1, { head: { tilt: 3, look: [0.6, 0.05] } }, 0.3],
    [tm.h2 - 0.2, { expr: KONUS, head: { tilt: -2, look: [0.1, 0.05] } }, 0.3],
    [tm.hNec - 0.1, { head: { tilt: 3, look: [0.75, 0.05] } }, 0.25],
    [tm.sira - 0.1, { head: { tilt: -3, look: [-0.6, 0.25] } }, 0.3],
    [tm.kartK, { expr: KONUS, head: { tilt: -2, look: [-0.65, 0.2] } }, 0.01],
    [tm.kA + 0.05, { head: { tilt: 4, look: [-0.5, 0.4] } }, 0.3],             // kaldırdığı karta bakar (A ve B için aynı)
    [tm.kA + 1.6, { head: { tilt: 0, look: [0, -0.05] } }, 0.3],
    [tm.kB + 0.05, { head: { tilt: -4, look: [0.5, 0.4] } }, 0.3],
    [tm.kB + 1.6, { head: { tilt: 0, look: [0, -0.05] } }, 0.3],
    [tm.defK, { expr: DIKKAT, head: { tilt: 2, look: [0, -0.1] } }, 0.01],
    // sayaç: kameraya ve iki yana eşit; aşağı (kartlara) bakmaz
    [tm.sayac, { expr: GULUS, head: { tilt: 3, look: [0, -0.1] } }, 0.01],
    [tm.sayac + 2.5, { head: { tilt: -3, look: [-0.3, -0.15] } }, 0.4],
    [tm.sayac + 5.0, { head: { tilt: 3, look: [0.3, -0.15] } }, 0.4],
    [tm.sayac + 7.5, { head: { tilt: 0, look: [0, -0.1] } }, 0.4],
    [tm.n1 + 0.1, { expr: MERAK, head: { tilt: -3, look: [0.75, 0.05] } }, 0.35],
  ];
  const nec = [   // Necmi önden, masanın sağ ucunun yanında
    [0, { expr: GULUS, head: { tilt: 3, look: [-0.8, 0.3] } }],
    [tm.iki2, { expr: KONUS, head: { tilt: -2, look: [-0.6, 0.05] } }, 0.01],
    [tm.nHik - 0.1, { head: { tilt: 3, look: [-0.8, 0.1] } }, 0.25],
    [tm.nBen - 0.1, { head: { tilt: -2, look: [-0.3, 0.05] } }, 0.25],
    [tm.h2, { expr: GULUS, head: { tilt: 3, look: [-0.8, 0.1] } }, 0.3],
    [tm.sayac, { expr: GULUS, head: { tilt: 4, look: [-0.8, 0.35] } }, 0.01],
    [tm.sayac + 4.5, { head: { tilt: -3, look: [-0.75, 0.25] } }, 0.4],
    [tm.n1 - 0.25, { expr: KONUS, head: { tilt: -2, look: [-0.85, 0.3] } }, 0.3],
    [tm.n1s + 0.2, { expr: GULUS, head: { tilt: 3, look: [-0.8, 0.35] } }, 0.3],
  ];
  // Altyazı çizelgesi: n1 son repliktir (cevapsız kesim); balonu "Buldum!"a kadar kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.05 } : l) };
  return { tm, film, tlA, def, hik, nec };
}

// ═══════════════════════════ Kartların durumu (tek kaynak) ═══════════════════════════
// Dönen: { p (merkez), sx (1 ön yüz, −1 arka yüz), el ('L' | 'R' | null), yer ('cep' | 'el' | 'stand') }
function kartAt(S, hangi, t) {
  const { tm } = S, t0 = hangi === 'A' ? tm.kA : tm.kB, el = hangi === 'A' ? 'L' : 'R';
  if (t < tm.cep + 0.3) return { yer: 'cep' };
  // cepten alınınca iki kart göğüs önüne gelir, sonra eller iner: sırası gelmeyen kart masanın arkasında bekler (görünmez)
  const goguste = t < tm.cep + 0.9 ? H.yay([HIK_X + (hangi === 'A' ? -40 : 40), 1095], [HIK_X + (hangi === 'A' ? -120 : 120), 1290], ease.state(seg(t, tm.cep + 0.6, 0.3)), 0) : [HIK_X + (hangi === 'A' ? -120 : 120), 1290];
  if (t < t0) return { p: goguste, sx: -1, el, yer: 'el' };
  const kalk = ease.enter(seg(t, t0, 0.38)), in0 = t0 + tm.kSure, tut = [YUVA[hangi][0], YUVA[hangi][1] - 16];
  if (t < in0) return { p: H.yay(goguste, tut, kalk, 20), sx: -Math.cos(Math.PI * kalk), el, yer: 'el' };
  const u = ease.state(seg(t, in0, tm.kIn));
  if (u < 1) return { p: lerp2(tut, YUVA[hangi], u), sx: 1, el, yer: 'el' };
  return { p: YUVA[hangi], sx: 1, el: t < in0 + tm.kIn + 0.12 ? el : null, yer: 'stand' };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında
  drift: 0.007,
  kamera(cam, t, B) {
    const { tm } = S;
    // sayaç: iki kartın ortasına doğrusal itme (grup) → Defne ve iki kart (itme) → ipucu (grup, yavaş itme)
    if (B.sc.id === 'sayac') Object.assign(cam, { zoom: lg(0.98, 0.995, clamp01((t - tm.sayac) / (tm.say2 - tm.sayac))), cx: 702, cy: lerp(1128, 1125, clamp01((t - tm.sayac) / (tm.say2 - tm.sayac))) });
    if (B.sc.id === 'say2') Object.assign(cam, { zoom: lg(1.3, 1.32, clamp01((t - tm.say2) / (tm.cd - tm.say2))), cx: 568, cy: 1095 });
    if (B.sc.id === 'ipucu') Object.assign(cam, { zoom: lerp(0.995, 1.005, clamp01((t - tm.cd) / (tm.buldum - tm.cd))), cx: 702, cy: 1125 });
    if (B.sc.id === 'insert') Object.assign(cam, { zoom: 1, cx: 540, cy: 960 });
  },
  dunya(K, t, B) { if (B.sc.id === 'insert') insert(K, t, S); else sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (B.sc.id === 'iki') {
      const e = B.ekr;
      H.tag(K, t, tm.usta - 0.04, tm.kartK - 0.22, e([HIK_X - 88, 1015]), 'USTA', PAL.mustard, INK, 48);
      H.tag(K, t, tm.acemi - 0.04, tm.kartK - 0.22, e([NEC_X - 150, 1250]), 'ACEMİ', PAL.mustard, INK, 48);
    }
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (070'teki düzen): perde yok; daire solda, başlık ve paylaşım hapı sağında, alt bantta.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1320, r = 78;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
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

// ═══════════════════════════ Insert: tahta üstten (dünya = ekran) ═══════════════════════════
// Defne solda (eli soldan gelir), Hikmet masanın arkasında (eli yukarıdan gelir), kamera önde.
const IB = { x: 250, y: 600, s: 76 };   // tahtanın sol üst köşesi, kare boyu (608 px)
function insert(K, t, S) {
  const { ctx } = K, { tm } = S;
  ctx.fillStyle = PAL.woodTop; ctx.fillRect(-200, -200, 1480, 2400);
  for (const [y, a, b] of [[560, 40, 420], [1260, 600, 1040], [1330, 60, 380], [480, 640, 1000]]) K.line(a, y, b, y, 4, '#B07A44');
  // tahta
  K.rect(IB.x - 22, IB.y - 22, IB.s * 8 + 44, IB.s * 8 + 44, PAL.woodDark, LW, 10);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { ctx.fillStyle = (r + c) % 2 ? '#B9824A' : '#EBCB94'; ctx.fillRect(IB.x + c * IB.s, IB.y + r * IB.s, IB.s, IB.s); }
  K.rect(IB.x, IB.y, IB.s * 8, IB.s * 8, null, LW * 0.6);
  const tasXY = (c, r) => [IB.x + (c + 0.5) * IB.s, IB.y + (r + 0.5) * IB.s];
  const tasCiz = (x, y, acik) => {
    K.circ(x + 4, y + 6, 29, INK, 0);
    K.circ(x, y, 29, acik ? '#F4EDE0' : '#3A3F3C', LW * 0.6);
    K.circ(x, y, 17, null, 3.5);
  };
  // Defne'nin eli (soldan): taşa uzanır, iter, çekilir
  const hamle = taslar(t, tm).find(s => s.r === HAMLE.r && s.c >= HAMLE.c0 && s.c <= HAMLE.c1 && s.acik);
  for (const s of taslar(t, tm)) if (s !== hamle) tasCiz(...tasXY(s.c, s.r), s.acik);
  const hp = tasXY(hamle.c, hamle.r);
  tasCiz(...hp, true);
  const gel = W(t, tm.itme - 0.3, 0.3), git = W(t, tm.itme + 0.45, 0.35), dw = gel * (1 - git);
  if (dw > 0.01) {
    const el = [lerp(-120, hp[0] - 40, dw), hp[1] + 6];
    kolUstten(K, [-260, hp[1] + 60], el, H.CARDS.defne.arm.color, H.CARDS.defne.skin, 70);
  }
  // ödül çayı: Hikmet'in eli yukarıdan getirir, tahtanın yanına (Defne'nin tarafı) koyar
  const CP = [140, 690];
  const in0 = tm.koy - 0.62, cp = t < tm.koy ? H.yay([CP[0] + 40, 160], CP, ease.state(seg(t, in0, 0.62)), 0) : CP;
  const cik = W(t, tm.koy + 0.3, 0.4);
  if (t >= in0) {
    K.ell(cp[0] + 6, cp[1] + 8, 66, 66, INK, 0);
    K.circ(cp[0], cp[1], 62, PAL.cream, LW * 0.7);
    K.circ(cp[0], cp[1], 38, '#F3EEE4', LW * 0.6);
    K.circ(cp[0], cp[1], 30, CAY, 3);
    if (t > tm.koy) H.buhar(K, cp[0], cp[1] - 30, t, { k: 0.5, n: 2, ara: 16, boy: 80 });
    const tutuyor = t < tm.koy + 0.12;
    const el = tutuyor ? [cp[0] + 4, cp[1] - 44] : [lerp(cp[0] + 4, cp[0] + 60, cik), lerp(cp[1] - 44, 60, cik)];
    if (cik < 0.99) kolUstten(K, [el[0] + 160, -200], el, H.CARDS.hikmet.arm.color, H.CARDS.hikmet.skin, 74);
  }
}
// Üstten görünen kol ve el (insert): omuzdan gelen kol, ucunda yumruk
function kolUstten(K, a, b, renk, ten, w) {
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = INK; ctx.lineWidth = w + LW * 2; ctx.stroke();
  ctx.strokeStyle = renk; ctx.lineWidth = w; ctx.stroke();
  ctx.restore();
  K.circ(b[0], b[1], w * 0.55, ten, LW);
}

// ═══════════════════════════ Dünya (yan görünüş) ═══════════════════════════
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc, cam } = B, id = sc.id;
  M.mekanCiz(K, OFIS, 'arka', t, { isik: M.ISIK.gunduz });

  // ——— Defne (solda oturur, yüzü sağa) ———
  const dp = H.poseAt(H.CARDS.defne, H.otur('defne', { x: DEF_X, facing: 1, el: false }), S.def, t);
  dp.lean = 6; dp.y -= H.buldumHop(t, tm.buldum);
  const dMasa = [DEF_X + 115, YB + 40];                       // dinlenen el: masanın üstünde, kenarda
  const dO = { heads, R: [dMasa, 1, 'A'] };
  let dPar = null, dMasaA = 1;
  // d2: "iki kez" iki parmak, göğüs önünde (yüzün altında; Necmi'ye doğru)
  const wIki = pIn(t, tm.dIki - 0.25, tm.d2s + 0.15, 0.28);
  if (wIki > 0.01) {
    const sh = H.shoulder('defne', dp, 'R'), hdf = [sh[0] + 112, sh[1] - 8];
    dO.R = [[lerp(dMasa[0], hdf[0], wIki), lerp(dMasa[1], hdf[1], wIki)], 1, 'A'];
    if (wIki > 0.5) dPar = ['R', 2 * seg(t, tm.dIki - 0.05, 0.3), { toplam: 2, yon: -Math.PI / 2 + 0.25 }];
    dMasaA = 1 - wIki;
  }
  // sayaç: eli çenesinde düşünür (070'teki yer); ipucunda iner, sonra yine çenesinde
  const wC = ['sayac', 'say2', 'ipucu'].includes(id) ? Math.max(pIn(t, tm.sayac + 0.4, tm.n1 - 0.1, 0.35), W(t, tm.n1s + 0.25, 0.4)) : 0;
  if (wC > 0.01) { const bas = H.eklem('defne', dp, 'head'); dO.R = [[lerp(dMasa[0], bas[0] + 62, wC), lerp(dMasa[1], bas[1] + 126, wC)], 1, 'B']; dMasaA = 1 - wC; }
  if (id === 'buldum') { dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; dMasaA = 0; }

  // ——— Hikmet (masanın arkasında, önden) ———
  const hp = H.poseAt(H.CARDS.hikmet, H.kisi('hikmet', { x: HIK_X, expr: 'notr', ...H.POZ.dur }), S.hik, t);
  const hO = { heads };
  let hPar = null, hIsaret = null, hTut = { L: null, R: null };
  const cayElde = t < tm.koy;                                  // ödül çayı Hikmet'in sağ elinde (insert'te masaya iner)
  const cayEl = [HIK_X + 112, 1112];
  if (cayElde) { hO.R = [cayEl, 1, 'A']; hTut.R = 'cay'; }
  // "üç oyunluk": sol elle üç parmak, başın yanında
  const wUc = pIn(t, tm.uc - 0.3, tm.ust - 0.15, 0.3);
  if (wUc > 0.01) { hO.L = [H.elYeri('hikmet', hp, 'L', 'yukari'), wUc, 'B']; if (wUc > 0.5) hPar = ['L', 3 * seg(t, tm.uc - 0.05, 0.5), { toplam: 3 }]; }
  // "Ben ustayım": sağ el göğsüne; "Necmi acemi": sağ el Necmi'yi gösterir
  const wBen = pIn(t, tm.h2 - 0.25, tm.hNec - 0.3, 0.25);
  const wNec = pIn(t, tm.hNec - 0.25, tm.sira - 0.15, 0.25);
  if (wBen > 0.01 && !cayElde) hO.R = [lerp2(H.elYeri('hikmet', hp, 'R', 'asagi'), [HIK_X + 26, 1046], wBen), 1, 'A'];
  if (wNec > 0.01) { hO.R = [lerp2(H.elYeri('hikmet', hp, 'R', 'asagi'), [HIK_X + 190, 1115], wNec), 1, 'A']; if (wNec > 0.6) hIsaret = ['R', [NEC_X - 40, 1170]]; }
  // kartlar: "Sırayı" ile göğüs cebinden alınır; sonra A sol elde, B sağ elde
  const kA = kartAt(S, 'A', t), kB = kartAt(S, 'B', t);
  const wCep = pIn(t, tm.cep - 0.05, tm.cep + 0.3, 0.25);
  if (wCep > 0.01) { hO.L = [[HIK_X - 20, 1050], wCep, 'A']; hO.R = [[HIK_X + 20, 1050], wCep, 'A']; }
  for (const [k, kk] of [['A', kA], ['B', kB]]) if (kk.el) {
    const tut = kutut(kk);
    const w0 = t < tm.cep + 0.55 ? W(t, tm.cep + 0.25, 0.3) : 1;
    hO[kk.el] = [tut, w0, 'A']; hTut[kk.el] = kk.p[1] <= YB + 20 ? k : null;
  }
  // kart standa indikten sonra el aşağı iner (masanın arkasında kalır)
  for (const [k, side] of [['A', 'L'], ['B', 'R']]) {
    const in1 = (k === 'A' ? tm.kA : tm.kB) + tm.kSure + tm.kIn, d = W(t, in1 + 0.1, 0.3);
    if (t >= in1 + 0.1 && t < in1 + 0.45) hO[side] = [lerp2(kutut({ p: YUVA[k], el: side }), H.elYeri('hikmet', hp, side, 'asagi'), d), 1, 'A'];
  }

  // ——— Necmi (sağda ayakta, önden) ———
  const np = H.poseAt(H.CARDS.necmi, H.kisi('necmi', { x: NEC_X, expr: 'notr', ...H.POZ.dur }), S.nec, t);
  const nO = { heads };
  let nIsaret = null;
  const wNH = pIn(t, tm.nHik - 0.25, tm.nBen - 0.2, 0.25), wNB = pIn(t, tm.nBen - 0.2, tm.n0 + 3.0, 0.25);
  if (wNH > 0.01) { nO.L = [lerp2(H.elYeri('necmi', np, 'L', 'asagi'), [NEC_X - 170, 1070], wNH), 1, 'A']; if (wNH > 0.6) nIsaret = ['L', [HIK_X + 70, 1050]]; }
  if (wNB > 0.01) nO.L = [lerp2(H.elYeri('necmi', np, 'L', 'asagi'), H.elYeri('necmi', np, 'L', 'gogus'), wNB), 1, 'A'];
  H.onayla(np, t, tm.hangisi - 0.05, 2, 0.32);

  // ——— çizim: sandalye → Defne → Hikmet → masa → tahta → stand ve kartlar → çay → kollar ve tutan eller → Necmi ———
  const o = H.oturak('defne', dp); M.sandalye(K, o.x, o.y, { yon: 1, w: 118, sirt: 160 });
  const defVar = true;
  const necVar = ['kanca', 'iki', 'sayac', 'cevap'].includes(id) || true;
  const dc = defVar ? oyna(K, t, tl, 'defne', dp, dO) : null;
  const hc = oyna(K, t, tl, 'hikmet', hp, hO);
  for (const k of Object.keys(heads)) heads[k] = [heads[k][0], Math.min(heads[k][1] + 40, cam.cy + (1120 - 960) / cam.zoom)];
  masa(K);
  tahtaYan(K, t, tm);
  stand(K);
  for (const [k, kk] of [['A', kA], ['B', kB]]) if (kk.yer === 'stand') kart(K, kk.p, k, kk.sx);
  if (!cayElde) { bardak(K, CAY_P); H.buhar(K, CAY_P[0], CAY_P[1] - 60, t, { k: 0.4, n: 2, ara: 14, boy: 70 }); }
  if (dc) { kolUst(K, 'defne', dp, 'R', dMasaA); if (dMasaA > 0.5) dc.tut('R'); }
  // Hikmet'in elindeki nesneler (elin altında), sonra tutan el
  if (cayElde) { bardak(K, [hc.handR[0], hc.handR[1] + 30]); H.buhar(K, hc.handR[0], hc.handR[1] - 30, t, { k: 0.4, n: 2, ara: 14, boy: 70 }); hc.tut('R'); }
  for (const [k, kk] of [['A', kA], ['B', kB]]) if (kk.yer === 'el' && kk.p[1] <= YB + 20) kart(K, kk.p, k, kk.sx);
  if (hTut.L === 'A') hc.tut('L');
  if (hTut.R === 'B') hc.tut('R');
  if (hPar) hc.parmak(...hPar);
  if (hIsaret) hc.isaret(...hIsaret);
  if (dc && dPar) dc.parmak(...dPar);
  if (dc && wC >= 0.5) dc.tut('R');
  const nc = necVar ? oyna(K, t, tl, 'necmi', np, nO) : null;
  if (nc && nIsaret) nc.isaret(...nIsaret);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}
const kutut = kk => [kk.p[0] + (kk.el === 'L' ? -1 : 1) * (KW / 2 + 24), kk.p[1] + 30];   // kartı dış kenarından tutan el
const lerp2 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
