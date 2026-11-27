// Bölüm 86 · SERVİS DEFTERİ (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_086_v5.md).
// Mekanizma: sayma bakışı. Şoför seferleri sayar (4 sefer, ortalama 7 → 28 yolcu); her yolcu kendi seferini anlatır (14).
// Boş seferi anlatacak yolcu yoktur (cevap arşivde kalır, kesilir).
// Logline: Akşam, şirket otoparkı. Servis şoförü Rıza Usta defterine bakıp "dört seferde, sefer başına ortalama yedi yolcu"
// der; Defne binen herkese tek tek sormuştur, hepsi "benim seferimde on dört yolcu vardı" demiştir. Necmi iki defteri yan yana
// tutup "biri yalan söylüyor" der; Defne: "Kimse yalan söylemiyor. Dört seferde kaçar yolcu vardı?"
// Akılda kalacak tek şey: şoför her seferi sayar, yolcu yalnız kendi seferini anlatır.
// Sızıntı yasağı: minibüsün camları baştan sona koyu (içi, koltuk, yolcu hiçbir karede görünmez); kapılar kapalı. Şoförün
// defterinde yalnız dört eş satır (sefer simgesi, karalama, tik): yolcu sayısı yok. Defne'nin defterinde her satır "14".
// "0", "28", "boş" yazısı ya da görüntüsü yok. Kerem parmaklarıyla 1'den 4'e sayar (sefer sayısı; bilinen bilgi).
// Rıza Usta (yan karakter, tek replik): kadro kartlarına eklenmez; bu dosyada Hikmet'in iskeletinden türetilir, kasketi burada
// çizilir. Sesi Ahmet (−14 Hz) + elle formant 0,94; zaman çizelgesinde konuşanı 'hikmet' yazar, build() 'b086_riza' yapar.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Rıza Usta (yan karakter) ═══════════════════════════
const RZ = 'b086_riza';
if (!H.CARDS[RZ]) {
  const b = H.CARDS.hikmet;
  H.CARDS[RZ] = {
    ...b, key: RZ, name: 'Rıza Usta', role: 'servis şoförü (yan karakter)', seed: 861,
    torso: { ...b.torso, color: '#3E5566', shade: '#31444F', belly: 0.13 },
    arm: { ...b.arm, color: '#3E5566', shade: '#31444F' },
    leg: { ...b.leg, color: '#4E4337', shade: '#3C342A' },
    skin: '#C98E66', skinShade: '#AE7650', hair: '#2E2A27',
    features: ['jacket', 'baldSides', 'mustacheThick'],
  };
}
const RZ_S = 236;
// Kasket (önden): tepe, bant ve öne düşen siper. hc = başın merkezi (dünya), s = ölçek
function kasket(K, hc, s) {
  const { ctx } = K;
  ctx.save(); ctx.translate(hc[0], hc[1]);
  ctx.beginPath();
  ctx.moveTo(-0.49 * s, -0.25 * s);
  ctx.bezierCurveTo(-0.5 * s, -0.6 * s, -0.14 * s, -0.7 * s, 0.06 * s, -0.68 * s);
  ctx.bezierCurveTo(0.36 * s, -0.66 * s, 0.53 * s, -0.52 * s, 0.5 * s, -0.25 * s);
  ctx.closePath(); K.fs('#6E5E4C', LW);
  K.line(-0.47 * s, -0.31 * s, 0.48 * s, -0.31 * s, LW * 0.8, '#4E4236');
  for (const x of [-0.3, -0.1, 0.1, 0.3]) K.line(x * s, -0.6 * s + Math.abs(x) * 0.12 * s, (x + 0.05) * s, -0.36 * s, 3, '#5F5141');   // tüvit dikiş
  ctx.beginPath(); ctx.ellipse(0.03 * s, -0.24 * s, 0.47 * s, 0.075 * s, 0, 0, TAU); K.fs('#54473A', LW);
  K.circ(0.04 * s, -0.66 * s, 0.035 * s, '#54473A', 3);
  ctx.restore();
}

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const MEKAN = 'b086_otopark';
const X = { riza: 290, nec: 530, necB: 580, ker: 750, def: 960, hik: 1460 };   // necB: defterleri aldıktan sonra (bir adım sağda)
const KER = { y: 1462, k: 0.9 };
// Servis minibüsü (yandan; burnu solda). Camlar koyu: içi hiçbir karede görünmez.
const BUS = { x0: 40, x1: 1960, top: 560, alt: 1418, yb: 1462, camUst: 640, camAlt: 950, kapi: [652, 842] };
const LEVHA = { x: 1660, y: 760, w: 200, h: 150 };       // camın arkasındaki "SERVİS / DURAKSIZ" levhası
// Kameralar
const KAM = {
  grup: [1.15, 625, 1116],
  riza: [1.45, 275, 1038],
  defne: [1.4, 1040, 1110],
  hikmet: [1.45, 1620, 1036],
  necmi: [1.5, 780, 1090],
  buldum: [1.45, 960, 1100],
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz; konuşurken talkAt ağzı açar)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  saskin: { brow: 0.11, browTilt: -0.12, eye: 1.2, pupil: 0.8, curve: 0, open: 0, w: 0.7 },     // şaşkın ama ağız kapalı
  emin: { brow: 0.02, browTilt: 0.05, eye: 0.95, pupil: 1, curve: 0.22, open: 0, w: 1.0 },      // Rıza: işini bilen usta
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },     // Defne: kendinden emin
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Nesneler ═══════════════════════════
// Şoförün sefer defteri: sert kahverengi kapak, solda koyu sırt (açık da kapalı da aynı). Açık sayfada sık el yazısı satırları,
// en alttaki sayfanın kenarından kesik: satır sayısı sayılamaz (sefer sayısı ya da yolcu sayısı okunmaz).
// c merkez, k ölçek, rot derece, acik: true sayfa / false kapak
const DEF = { w: 210, h: 128 };
const satirY = i => -DEF.h / 2 + 14 + i * 17;
const SAT_UZ = [0.92, 0.78, 0.97, 0.7, 0.88, 0.95, 0.8, 0.9];       // karalama boyları (sabit liste)
function seferDefteri(K, c, { k = 1, rot = 0, acik = true } = {}) {
  const { ctx } = K, w = DEF.w, h = DEF.h;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(rot * D2R); ctx.scale(k, k);
  K.rect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16, '#7A4A2A', LW, 10);
  if (acik) {
    K.rect(-w / 2 + 16, -h / 2, w - 16, h, '#FBF6EC', LW * 0.6, 4);
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2 + 16, -h / 2, w - 16, h); ctx.clip();
    for (let i = 0; i < 8; i++) {
      const y = satirY(i), x0 = -w / 2 + 26, x1 = x0 + (w - 70) * SAT_UZ[i];
      ctx.beginPath(); ctx.moveTo(x0, y);
      for (let x = x0; x < x1; x += 12) ctx.quadraticCurveTo(x + 4, y - 5 + ((x / 12) % 2 > 0.5 ? 9 : 0), x + 9, y);
      ctx.lineWidth = 3; ctx.strokeStyle = '#3E4A47'; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w / 2 - 30, y - 1); ctx.lineTo(w / 2 - 25, y + 4); ctx.lineTo(w / 2 - 15, y - 7); ctx.lineWidth = 3.5; ctx.strokeStyle = PAL.green; ctx.stroke();
    }
    ctx.restore();
  } else {
    K.rect(-w / 2 + 22, -h / 2 + 8, w - 30, h - 16, null, 3, 6);
  }
  K.rect(-w / 2 - 8, -h / 2 - 8, 24, h + 16, '#5C3620', LW * 0.8, 6);   // sırt
  ctx.restore();
}
const defterNok = (c, k, rot, [x, y]) => { const a = rot * D2R; return [c[0] + (x * Math.cos(a) - y * Math.sin(a)) * k, c[1] + (x * Math.sin(a) + y * Math.cos(a)) * k]; };

// Defne'nin anket defteri: üstten spiralli, petrol yeşili kapak (açıkken arka kapak sayfanın çevresinde görünür, kapalıyken
// ön kapak: iki hâlde aynı renk ve boy). Her sayfada beş tam satır ve sayfa kenarında kesilen altıncı: yolcu simgesi,
// karalama, "14". Görünen satır sayısı bir sefer sayısı gibi okunmasın diye 2 ya da 4 değil.
// cevir: 0..1 üstteki sayfanın spirale doğru kalkışı (sayfa çevirme); acik: false kapak
const PAD = { w: 230, h: 186 };
const padSatir = i => -PAD.h / 2 + 31 + i * 31;
const ON4_X = 30;                                                   // "14" sütunu (eller sayfanın iki yan kenarında, yazıdan uzak)
function anketDefteri(K, c, { k = 1, rot = 0, acik = true, cevir = 0 } = {}) {
  const { ctx } = K, w = PAD.w, h = PAD.h;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(rot * D2R); ctx.scale(k, k);
  K.rect(-w / 2 - 4, -h / 2 + 2, w + 20, h + 16, 'rgba(20,30,28,0.25)', 0, 10);
  K.rect(-w / 2 - 10, -h / 2 - 8, w + 20, h + 18, PAL.teal, LW, 10);     // kapak (açıkken arka kapak)
  const sayfa = () => {
    K.rect(-w / 2, -h / 2, w, h, '#FBF6EC', LW * 0.6, 6);
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
    for (let i = 0; i < 6; i++) {
      const y = padSatir(i);
      K.line(-w / 2 + 8, y + 15, w / 2 - 8, y + 15, 2, '#C9C2B4');
      K.circ(-w / 2 + 20, y - 6, 6.5, '#E9B48C', 2.5);                                   // yolcu simgesi: baş
      ctx.beginPath(); ctx.arc(-w / 2 + 20, y + 11, 10, Math.PI, TAU); ctx.closePath(); K.fs('#5D7E8C', 2.5);   // omuzlar
      ctx.beginPath(); ctx.moveTo(-w / 2 + 38, y + 1);
      for (let j = 0; j < 5; j++) ctx.quadraticCurveTo(-w / 2 + 43 + j * 12, y - 6 + (j % 2) * 11, -w / 2 + 49 + j * 12, y);
      ctx.lineWidth = 3; ctx.strokeStyle = '#3E4A47'; ctx.lineCap = 'round'; ctx.stroke();
      K.text('14', ON4_X, y + 11, 31, INK, 900);
    }
    ctx.restore();
  };
  if (acik) {
    sayfa();                                                     // alttaki sayfa (aynısı)
    if (cevir > 0 && cevir < 1) {                                // üst sayfa spirale doğru kalkar
      // üst sayfa (aynı içerik) üst kenarından yukarı doğru basılır: sayfanın altı kalkar, alttaki eş sayfa görünür
      const u = ease.state(cevir), sy = Math.max(0.02, 1 - u);
      ctx.save(); ctx.translate(0, -h / 2); ctx.scale(1, sy); ctx.translate(0, h / 2);
      sayfa();
      ctx.restore();
      K.rect(-w / 2 + 4, -h / 2 + h * sy - 5, w - 8, 9, '#D8CDB8', 2.5, 4);   // kalkan sayfanın alt kenarı (gölgeli)
    }
  } else {
    K.rect(-w / 2 + 22, -h / 2 + 44, 84, 46, '#E9D9B8', 3, 4);      // etiket yeri (boş)
  }
  for (let i = 0; i < 10; i++) { const x = -w / 2 + 14 + i * 22.5; K.ell(x, -h / 2 - 4, 6, 12, null, 3.5); }   // spiral
  ctx.restore();
}

// ═══════════════════════════ Mekân: şirket otoparkı, akşam ═══════════════════════════
function minibus(K, t) {
  const { ctx } = K, { x0, x1, top, alt, yb, camUst, camAlt } = BUS;
  K.ell((x0 + x1) / 2, yb - 4, (x1 - x0) / 2 + 30, 16, 'rgba(20,30,28,0.35)', 0);
  // tekerlekler (arkada kalanlar önce)
  for (const wx of [330, 1600]) { K.circ(wx, yb - 74, 74, '#2B2F33', LW); K.circ(wx, yb - 74, 34, '#B9C0BA', 4); K.circ(wx, yb - 74, 9, '#4A4F57', 3); }
  // gövde: burun (solda, hafif eğik), tavan
  const govde = [[x0 + 60, top + 40], [x0 + 140, top], [x1 - 30, top], [x1, top + 30], [x1, alt], [x0, alt], [x0, top + 330]];
  ctx.save(); K.path(govde); ctx.clip();
  ctx.fillStyle = '#EDE6D6'; ctx.fillRect(x0 - 10, top - 10, x1 - x0 + 20, alt - top + 20);
  ctx.fillStyle = PAL.mustard; ctx.fillRect(x0 - 10, 1180, x1 - x0 + 20, 40);
  ctx.fillStyle = PAL.coral; ctx.fillRect(x0 - 10, 1220, x1 - x0 + 20, 12);
  ctx.fillStyle = '#3E4A47'; ctx.fillRect(x0 - 10, alt - 54, x1 - x0 + 20, 60);
  // tekerlek yuvaları
  for (const wx of [330, 1600]) { ctx.beginPath(); ctx.arc(wx, yb - 74, 92, Math.PI, TAU); ctx.lineTo(wx + 92, alt + 10); ctx.lineTo(wx - 92, alt + 10); ctx.closePath(); ctx.fillStyle = '#23282B'; ctx.fill(); }
  ctx.restore();
  K.poly(govde, null, LW);
  for (const wx of [330, 1600]) { ctx.save(); ctx.beginPath(); ctx.arc(wx, yb - 74, 92, Math.PI, TAU); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
  for (const wx of [330, 1600]) { K.circ(wx, yb - 74, 74, '#2B2F33', LW); K.circ(wx, yb - 74, 34, '#B9C0BA', 4); K.circ(wx, yb - 74, 9, '#4A4F57', 3); }
  // ön cam (burun) ve camlar: koyu, yansımalı
  cam(K, [[x0 + 66, camUst], [x0 + 150, camUst - 30], [x0 + 260, camUst - 30], [x0 + 260, camAlt], [x0 + 22, camAlt]], t, 0);
  const panes = [[320, 620], [BUS.kapi[0] + 14, BUS.kapi[1] - 14], [870, 1150], [1176, 1456], [1482, 1890]];
  panes.forEach(([a, b], i) => cam(K, [[a, camUst], [b, camUst], [b, camAlt], [a, camAlt]], t, i + 1));
  // yolcu kapısı (kapalı, çift kanat)
  const [ka, kb] = BUS.kapi;
  K.rect(ka, camUst - 14, kb - ka, alt - 30 - camUst + 14, null, LW, 8);
  K.line((ka + kb) / 2, camUst - 10, (ka + kb) / 2, alt - 34, LW * 0.8);
  K.rect((ka + kb) / 2 - 34, 1060, 12, 70, '#9FB0AE', 3, 4); K.rect((ka + kb) / 2 + 22, 1060, 12, 70, '#9FB0AE', 3, 4);
  // şoför kapısı (burunda)
  K.rect(x0 + 270, camUst - 14, 0.1, 10, null, 0);
  K.line(x0 + 275, camUst - 20, x0 + 275, alt - 40, LW * 0.8);
  K.rect(x0 + 230, 1050, 30, 12, '#9FB0AE', 3, 4);
  // far, tampon, yan sinyaller (yanıp söner: dörtlü flaşör)
  const yan = Math.floor(t / 0.5) % 2 === 0;
  K.rect(x0 + 6, 1230, 40, 54, '#F7E7A8', 3.5, 8);
  K.rect(x0 - 10, alt - 30, 120, 34, '#4A4F57', 3.5, 8); K.rect(x1 - 90, alt - 30, 100, 34, '#4A4F57', 3.5, 8);
  for (const sx of [x0 + 80, 980, 1440, x1 - 40]) K.rect(sx - 16, 1290, 32, 18, yan ? '#F2A33A' : '#9C6A2E', 3, 6);
  // tavanda bagaj rayı
  K.line(x0 + 200, top - 18, x1 - 80, top - 18, 8, '#728276');
  for (let x = x0 + 220; x < x1 - 80; x += 260) K.line(x, top - 18, x, top, 6, '#728276');
  // levha camın arkasında (camın üstünde düz beyaz karton): "SERVİS / DURAKSIZ"
  const L = LEVHA;
  K.rect(L.x, L.y, L.w, L.h, '#FBF6EC', LW * 0.8, 6);
  K.text('SERVİS', L.x + L.w / 2, L.y + 62, 46, PAL.red, 900);
  K.text('DURAKSIZ', L.x + L.w / 2, L.y + 120, 31, INK, 900);
  // egzoz (arka altta): rölantide pufçuklar
  K.rect(x1 - 26, alt - 8, 40, 14, '#4A4F57', 3, 4);
  H.puf(K, x1 + 16, alt - 2, t, { k: 0.55, n: 3, periyot: 0.9, yon: 0, yol: 90, kalk: 26 });
}
// Koyu cam: yansıma şeritleri sürekli ve doğrusal kayar (döngü); içi görünmez
function cam(K, pts, t, i) {
  const { ctx } = K;
  ctx.save(); K.path(pts); ctx.fillStyle = '#2C4544'; ctx.fill(); ctx.clip();
  const xs = pts.map(p => p[0]), a = Math.min(...xs), b = Math.max(...xs), w = b - a + 360;
  for (const [ph, gen, renk] of [[0, 70, 'rgba(160,190,182,0.22)'], [0.45, 30, 'rgba(160,190,182,0.3)']]) {
    const x = a - 180 + (((t * 34 + i * 97) / w + ph) % 1) * w;
    K.path([[x, 560], [x + gen, 560], [x + gen - 160, 1000], [x - 160, 1000]]); ctx.fillStyle = renk; ctx.fill();
  }
  // gök yansıması (üst kenarda ılık bant)
  ctx.fillStyle = 'rgba(227,154,94,0.18)'; ctx.fillRect(a, BUS.camUst - 40, b - a, 60);
  ctx.restore();
  K.poly(pts, null, LW * 0.9);
}
// Sokak lambası (minibüsün burnunun solunda): akşam yanık
function lamba(K, x, t) {
  K.rect(x - 10, 620, 20, 842, '#4A4F57', LW * 0.7, 4);
  K.line(x, 640, x + 90, 610, 12, INK); K.line(x, 640, x + 90, 610, 6, '#4A4F57');
  K.poly([[x + 60, 600], [x + 130, 600], [x + 118, 628], [x + 72, 628]], '#4A4F57', LW * 0.7);
  K.ell(x + 95, 632, 24, 8, '#F8D07E', 3);
  void t;
}
M.mekanEkle(MEKAN, {
  gen: [-600, 2400], dongu: ['camlardaki yansıma', 'dörtlü flaşör', 'egzoz', 'bulutlar'],
  capa: { kapi: [(BUS.kapi[0] + BUS.kapi[1]) / 2, 1100], levha: [LEVHA.x + LEVHA.w / 2, LEVHA.y + LEVHA.h / 2] },
  kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.acikHava(K, { x0: -700, x1: 2500, floorY: BUS.yb, isik, zemin: 'asfalt', gunes: 0.88, t: t + 30 });
    lamba(K, -60, t);
    // otopark çizgileri (öne doğru eğik) ve bordür
    for (const x of [-380, 160, 700, 1240, 1780, 2320]) K.poly([[x, 1500], [x + 22, 1500], [x - 118, 1960], [x - 150, 1960]], '#E3D6A0', 0);
    K.rect(-700, 1462, 3200, 10, '#7C857F', 0);
    minibus(K, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    r1: T('r1'), dort: T('r1:0'), sefer: T('r1:2'), basina: T('r1:3'), ortalama: T('r1:4'), yedi: T('r1:5'), tasidim: T('r1:7'), r1s: T('r1>'),
    d1: T('d1'), herkese: T('d1:0'), tek: T('d1:1'), sordum: T('d1:3'), hepsi: T('d1:4'), ayni: T('d1:5'), sayiyi: T('d1:6'),
    benim: T('d1:8'), ondort: T('d1:12'), d1s: T('d1>'),
    h1: T('h1'), duraksiz: T('h1:1'), herkesH: T('h1:2'), bir: T('h1:3'), h1s: T('h1>'),
    n0: T('n0'), yalan: T('n0:1'), ortN: T('n0:2'), herkesN: T('n0:4'), diyemez: T('n0:7'), n0s: T('n0>'),
    d2: T('d2'), kimse: T('d2'), dortD: T('d2:3'), kacar: T('d2:5'), d2s: T('d2>'),
    n1: T('n1'), sofor: T('n1'), sayar: T('n1:3'), yolcu: T('n1:4'), n1s: T('n1>'),
  };
  tm.rizaKes = tm.basina - 0.1; tm.defKes = tm.d1 - 0.12; tm.hikKes = tm.h1 - 0.1; tm.necKes = tm.n0 - 0.1; tm.grupKes = tm.d2 - 0.1;
  tm.sayac = cd0 - 0.05;
  // sayfa çevirme: "Binen herkese tek tek sordum" boyunca üç sayfa
  tm.tek2 = H.at(tl, 'd1:2');
  // Rıza'nın parmağı satırların üstünden aşağı kayar ("sefer başına ortalama"); satır sayılmaz
  tm.dokun = [tm.basina + 0.05, tm.basina + 0.35, tm.ortalama + 0.1];
  const G = KAM.grup;
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...G], [tm.rizaKes - 0.1, 1.155, 621, 1115]] },
    { id: 'riza', t0: tm.rizaKes, cam: [[0, ...KAM.riza], [tm.defKes - 0.1, 1.465, 277, 1037]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.benim, 1.41, 1040, 1110], [tm.hikKes - 0.1, 1.415, 1041, 1110]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.necKes - 0.1, 1.47, 1618, 1034]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.grupKes - 0.1, 1.52, 779, 1088]] },
    { id: 'grup', t0: tm.grupKes, cam: [[0, ...G], [tm.sayac - 0.1, 1.155, 625, 1115]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...G]] },                   // doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...G]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // Zaman çizelgesi kopyası: r1'i Rıza söyler (dudak ve balon kuyruğu ona gider)
  const tlR = { ...tl, lines: tl.lines.map(l => l.id === 'r1' ? { ...l, who: RZ } : l) };
  // Altyazı: d1 üç balona bölünür (en uzun parça iki satır); kesmeden önce söner; n1 kesime kadar kalır
  const kes = { r1: tm.defKes, d1c: tm.hikKes, h1: tm.necKes, n0: tm.grupKes, d2: tm.sayac };
  const parca = (l, id, a, b) => ({ ...l, id, text: l.text.split(' ').slice(a, b).join(' '), words: l.words.slice(a, b), t0: a ? l.words[a].t0 : l.t0, t1: b < l.words.length ? l.words[b - 1].t1 : l.t1 });
  const satirlar = [];
  for (const l of tlR.lines) {
    if (l.id === 'n1') continue;
    if (l.id === 'd1') { const c = parca(l, 'd1c', 8, l.words.length), w = c.text.split(' '); c.text = w.slice(0, 2).join(' ') + ' ' + w.slice(2).join(' '); satirlar.push(parca(l, 'd1a', 0, 4), parca(l, 'd1b', 4, 8), c); }
    else if (l.id === 'd2') { const [a, b] = l.text.split('. '); satirlar.push({ ...l, text: a.replace(/ /g, ' ') + '. ' + b.replace(/ /g, ' ') }); }
    else satirlar.push(l);
  }
  const tlS = { ...tlR, lines: satirlar.map(l => kes[l.id] ? { ...l, t1: Math.min(l.t1, kes[l.id] - 0.31) } : l) };
  const tlN = { ...tlR, lines: tlR.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlR, tlS, tlN, tlA };
}

// ═══════════════════════════ draw ═══════════════════════════
const zoomSayac = (tm, t) => t < tm.cd ? Math.exp(lerp(Math.log(1.15), Math.log(1.17), clamp01((t - tm.sayac) / (tm.cd - tm.sayac)))) : lerp(1.17, 1.185, clamp01((t - tm.cd) / (tm.buldum - tm.cd)));
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    if (B.sc.id === 'sayac') { const z = zoomSayac(S.tm, t); Object.assign(cam, { zoom: z, cx: 625.5, cy: 1116 - 5 * Math.min(z - 1.15, 0.02) / 0.02 - 14 * clamp01((t - S.tm.cd) / (S.tm.buldum - S.tm.cd)) }); }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    const ksz = B.sc.id === 'riza' || B.sc.id === 'defne';   // yakın planda konuşan belli; kuyruk defterin üstüne binmesin
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, B.heads, { y: 1255, kuyruksuz: ksz });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, B.heads, { y: 1255 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (perde yok; bu bölümde paylaşım hapı yok): daire solda altta, başlık sağda
function sayac(K, t, t1, { dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 190, y = 1330, r = 68;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 11, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 21, 58, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(600, 1330); ctx.scale(inU * out, inU * out);
  ctx.font = '900 50px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 60;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 18, 50, INK, 900);
  ctx.restore();
}

// ═══════════════════════════ Dünya ═══════════════════════════
// Kim neyi ne zaman tutar: defterler Necmi'ye Hikmet'in plânı sırasında (kadraj dışında) geçer.
const necmide = (tm, t) => t >= tm.hikKes;
const yuzeBak = (from, to) => [clamp01(Math.abs(to - from) / 420) * 0.8 * Math.sign(to - from), 0.05];

function sahne(K, t, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, tl = S.tlR;
  M.mekanCiz(K, MEKAN, 'arka', t, { isik: M.ISIK.aksam });
  const sayacta = t >= tm.sayac && t < tm.buldum;
  const konusan = ['r1', 'd1', 'h1', 'n0', 'd2', 'n1'].find(k => { const l = tl.lines.find(x => x.id === k); return l && t >= l.t0 - 0.1 && t < l.t1 + 0.25; });
  const kimX = { r1: X.riza, d1: X.def, h1: X.hik, n0: X.nec, d2: X.def, n1: X.def };

  // ——— Kerem (arkada, yolcu kapısının önünde; kapı kapalı). Sayaçta parmaklarıyla 1'den 4'e sayar, başını kaşır ———
  const ks = H.BOY.genc * KER.k;
  let kL = konusan ? yuzeBak(X.ker, kimX[konusan]) : [-0.2, 0.05];
  let kSay = 0, kKas = 0;
  if (sayacta) {
    const c0 = tm.cd0;
    kSay = Math.max(pIn(t, c0 + 0.5, c0 + 3.4, 0.3), pIn(t, c0 + 5.6, c0 + 8.6, 0.3));
    kKas = pIn(t, c0 + 3.8, c0 + 5.2, 0.3);
    kL = kSay > 0.3 ? [-0.45, -0.35] : kKas > 0.3 ? [-0.2, -0.1] : [0.2, 0.1];
    if (t >= tm.n1 - 0.2) kL = yuzeBak(X.ker, X.def);
  }
  const kp = H.kisi(H.KEREM, { x: X.ker, y: KER.y, s: ks, expr: kKas > 0.3 ? IF.dusun : IF.merak, ...POZ.dur, head: { tilt: 0, look: kL } });
  const kO = { heads, sessiz: true };
  // sayan el ekranın solunda, omuz hizasında (Necmi'nin başı ile Kerem'in yüzü arasında görünür; Defne'nin arkasında kalmaz)
  const kh = H.eklem(H.KEREM, kp, 'head');
  if (kSay > 0.01) kO.L = [[kh[0] - 0.62 * ks, kh[1] - 0.55 * ks], kSay, 'B'];   // el Necmi'nin başının üstünde, yüzün dışında
  if (sayacta) H.omuzSilk(kp, t, tm.cd0 + 3.9, 0.6);
  const kc = oyna(K, t, null, H.KEREM, kp, kO);
  if (kSay > 0.6) {
    const c0 = tm.cd0, u = t < c0 + 4 ? t - (c0 + 0.8) : t - (c0 + 5.9);
    const n = Math.max(0.01, Math.min(4, Math.floor(u / 0.55) + 1 + ease.state(clamp01((u % 0.55) / 0.2)) - 1));
    kc.parmak('L', n, { toplam: 4, yon: -Math.PI / 2, ac: 0.55 });
  }

  // ——— Rıza Usta (solda, önden; kasketli) ———
  let rL = [0.25, 0.35], rE = IF.emin;
  const defterRiza = !necmide(tm, t);
  const LC = [X.riza + 22, 1150 + 40 * (1 - W(t, 0.3, 0.42))];          // açık defter: 0,3 sn'de göğse kalkar (ilk hareket)
  if (t < tm.rizaKes - 0.4) rL = [0.2, 0.45];                            // deftere bakar
  if (t >= tm.ortalama - 0.15 && t < tm.defKes) rL = [0.1, 0.0];         // "ortalama yedi": başını kaldırır
  if (!defterRiza) rL = konusan ? yuzeBak(X.riza, kimX[konusan]) : [0.35, 0.1];
  let rWatch = 0, rKas = 0;
  if (sayacta) { const c0 = tm.cd0; rWatch = pIn(t, c0 + 4.2, c0 + 6.6, 0.32); rKas = pIn(t, c0 + 1.0, c0 + 2.7, 0.3); rL = rWatch > 0.4 ? [0.15, 0.6] : [0.45, 0.2]; if (t >= tm.n1 - 0.2) rL = yuzeBak(X.riza, X.def); }
  const rp = H.kisi(RZ, { x: X.riza, s: RZ_S, expr: rE, ...(defterRiza ? POZ.dur : POZ.belde), head: { tilt: 0, look: rL } });
  if (t >= tm.yedi - 0.05 && t < tm.defKes) H.onayla(rp, t, tm.tasidim - 0.1, 1, 0.36);
  if (rKas > 0.01) { rp.lean = 9 * rKas; rp.head.look = [0.6, 0.45]; }   // sayaç başı: Necmi'nin defterlerine eğilip bakar
  if (sayacta && t >= tm.sayar - 0.2) H.onayla(rp, t, tm.sayar - 0.1, 2, 0.32);   // "Şoför her seferi sayar": Rıza onaylar
  const rO = { heads };
  let dokunEl = null;
  if (defterRiza) {
    const kose = s => defterNok(LC, 1, 0, [s * (DEF.w / 2 + 2), DEF.h / 2 - 6]);
    rO.L = [kose(-1), 1, 'A'];
    const durak = tm.dokun.map((td, i) => [td, defterNok(LC, 1, 0, [DEF.w / 2 - 70, satirY([0, 3, 6][i])])]);
    const wD = pIn(t, tm.dokun[0] - 0.3, tm.dokun[2] + 0.3, 0.26, 0.3);
    if (wD > 0.01) { dokunEl = H.dokunYolu(t, durak, { yuksel: 22, sure: 0.16 }); rO.R = [kar(kose(1), [dokunEl[0] + 30, dokunEl[1] + 26], wD), 1, 'A']; }
    else rO.R = [kose(1), 1, 'A'];
  } else if (rWatch > 0.01) {
    rO.L = [[X.riza + 10, 1185], rWatch, 'A'];
  }
  const rc = oyna(K, t, tl, RZ, rp, rO);
  kasket(K, rc.head, RZ_S);

  // ——— Necmi (Rıza'nın sağında) ———
  let nL = defterRiza ? [-0.45, 0.4] : [0, 0.3], nE = defterRiza ? IF.saskin : IF.merak;
  const NX = defterRiza ? X.nec : X.necB;
  const np = H.kisi('necmi', { x: NX, expr: nE, ...POZ.dur, head: { tilt: 0, look: nL } });
  // iki defter Necmi'de, kapalı, kapaklar bize dönük: sağ elde (Defne'ye yakın) şoförün defteri, sol elde Defne'nin defteri.
  // uR: şoförün defteri kalkar, uL: Defne'nin defteri kalkar
  let uL = 0, uR = 0;
  if (!defterRiza) {
    uR = 0.5 * H.kaldir(t, [[tm.n0 + 0.05, tm.ortN - 0.1]]) + H.kaldir(t, [[tm.ortN - 0.05, tm.herkesN - 0.05]]);
    uL = 0.5 * H.kaldir(t, [[tm.n0 + 0.05, tm.ortN - 0.1]]) + H.kaldir(t, [[tm.herkesN - 0.05, tm.n0s + 0.1]]);
    nL = t >= tm.ortN - 0.1 && t < tm.herkesN - 0.1 ? [0.55, 0.45] : t >= tm.herkesN - 0.1 && t < tm.n0s ? [-0.55, 0.45] : nL;
    if (t >= tm.diyemez && t < tm.n0s + 0.2) nL = [0.6 * Math.sin(TAU * (t - tm.diyemez) / 0.5), 0.3];   // "diyemez": başını sallar
    if (konusan && konusan !== 'n0') nL = yuzeBak(NX, kimX[konusan]);
    if (sayacta) {
      const ts = t - tm.cd0, j = Math.floor(ts / 1.3) % 2;
      nL = j === 0 ? [-0.55, 0.45] : [0.55, 0.45]; nE = IF.dusun;
      uL = 0.45 * pIn(t, tm.cd0 + 0.1, tm.cd0 + 1.3, 0.3) + 0.45 * pIn(t, tm.cd0 + 2.7, tm.cd0 + 3.9, 0.3) + 0.45 * pIn(t, tm.cd0 + 5.3, tm.cd0 + 6.5, 0.3) + 0.45 * pIn(t, tm.cd0 + 7.9, tm.cd0 + 9.1, 0.3);
      uR = 0.45 * pIn(t, tm.cd0 + 1.4, tm.cd0 + 2.6, 0.3) + 0.45 * pIn(t, tm.cd0 + 4.0, tm.cd0 + 5.2, 0.3) + 0.45 * pIn(t, tm.cd0 + 6.6, tm.cd0 + 7.8, 0.3);
      // ipucu: "Şoför her seferi sayar" → şoförün defteri kalkar; "Yolcu hangisini anlatır?" → Defne'nin defteri kalkar
      if (t >= tm.n1 - 0.15) { nE = IF.merak; uR = pIn(t, tm.sofor - 0.05, tm.yolcu - 0.1, 0.3); uL = W(t, tm.yolcu - 0.05, 0.3); nL = t < tm.yolcu - 0.1 ? [0.55, 0.45] : [-0.55, 0.45]; }
    }
    np.expr = nE; np.head.look = nL;
  }
  const nY = sayacta && t >= tm.n1 - 0.15 ? 58 : 40;   // ipucunda defter daha belirgin kalkar
  const NLc = [NX - 50, 1232 - nY * uL], NRc = [NX + 84, 1230 - nY * uR];   // NLc: Defne'nin defteri (0,74), NRc: şoförün defteri (0,8)
  const nO = { heads };
  if (!defterRiza) {
    nO.L = [defterNok(NLc, 0.74, -7, [-PAD.w / 2 - 8, PAD.h / 2 - 20]), 1, 'A'];
    nO.R = [defterNok(NRc, 0.8, 7, [DEF.w / 2 + 4, DEF.h / 2 - 8]), 1, 'A'];
  }
  const nc = oyna(K, t, tl, 'necmi', np, nO);

  // ——— Defne (sağda) ———
  const PC = [X.def - 4, 1223 - 10 * H.kaldir(t, [[tm.benim - 0.1, tm.d1s + 0.1]])];
  let dL = defterRiza ? (konusan === 'r1' || t < tm.defKes ? yuzeBak(X.def, X.riza) : [0, 0.35]) : [0, 0.1], dE = IF.sakin;
  if (t >= tm.defKes && t < tm.hikKes) dL = t < tm.hepsi ? [0, 0.5] : t < tm.benim ? [0.05, 0.45] : [0, 0.05];
  if (!defterRiza && konusan && konusan !== 'd2' && konusan !== 'n1') dL = yuzeBak(X.def, kimX[konusan]);
  if (t >= tm.kimse - 0.05 && t < tm.kimse + 0.55) dL = [0.45 * Math.sin(TAU * (t - tm.kimse) / 0.5), 0.05];   // "Kimse": başını iki yana sallar
  if (t >= tm.dortD - 0.1 && t < tm.d2s + 0.3) dL = [-0.15, 0.0];
  let dThink = 0, dPoint = 0, dHedef = null;
  if (sayacta) {
    const c0 = tm.cd0;
    dE = IF.dusun;
    dThink = Math.max(pIn(t, c0 + 0.6, c0 + 3.8, 0.35), pIn(t, c0 + 6.4, c0 + 9.4, 0.35));
    dL = dThink > 0.4 ? [0.25, -0.25] : yuzeBak(X.def, X.nec - 60);
    if (t >= tm.n1 - 0.15) {
      // "Şoför her seferi sayar": şoförün defterini gösterir; "Yolcu hangisini anlatır?": eli açık, soruyu bize sorar
      dE = IF.sakin;
      dPoint = pIn(t, tm.sofor - 0.2, tm.yolcu - 0.15, 0.28, 0.3);
      dHedef = defterNok(NRc, 0.8, 7, [10, 0]);
      dL = t < tm.yolcu - 0.1 ? [-0.6, 0.35] : [0, 0];
    }
  }
  if (id === 'buldum') { dE = IF.gulus; dL = [0, -0.1]; }
  const dp = H.kisi('defne', { x: X.def, expr: dE, ...POZ.dur, head: { tilt: 0, look: dL } });
  dp.y -= H.buldumHop(t, tm.buldum, 50);
  const dO = { heads };
  let padUc = null;
  if (defterRiza) {
    const kose = s => defterNok(PC, 1, 0, [s * (PAD.w / 2 + 6), 40]);   // iki yan kenar (yazıdan ≥ 50 px uzak)
    const el = kose(1);
    // Sayfa çevrilmez (yazı ölçeklenmesin). "tek tek sordum" / "Hepsi aynı sayıyı": sol elin işaret parmağı satırların
    // solundaki yolcu simgelerine tek tek dokunur; "on dört"te yine ilkine. Parmak ve el hiçbir an "14" sütununa gitmez.
    const simge = i => defterNok(PC, 1, 0, [-PAD.w / 2 + 22, padSatir(i) + 2]);
    const durak = [[tm.tek, simge(0)], [tm.tek2, simge(1)], [tm.sordum, simge(2)], [tm.ayni, simge(3)], [tm.sayiyi + 0.05, simge(4)], [tm.ondort, simge(0)]];
    const wP = Math.max(pIn(t, tm.tek - 0.3, tm.sayiyi + 0.45, 0.26, 0.3), pIn(t, tm.ondort - 0.3, tm.ondort + 0.55, 0.26, 0.3));
    if (wP > 0.01) { padUc = H.dokunYolu(t, durak, { yuksel: 20, sure: 0.16 }); dO.L = [kar(kose(-1), [padUc[0] - 30, padUc[1] + 22], wP), 1, 'A']; }
    else dO.L = [kose(-1), 1, 'A'];
    dO.R = [el, 1, 'A'];
  } else if (dThink > 0.01) {
    const h = H.eklem('defne', dp, 'head');
    dO.R = [[h[0] + 0.43 * dp.s, h[1] + 0.4 * dp.s], dThink, 'B'];
  } else if (dPoint > 0.01) {
    dO.L = [[dHedef[0] + 70, dHedef[1] - 10], dPoint, 'A'];
  }
  if (id === 'buldum') dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];
  const dc = oyna(K, t, tl, 'defne', dp, dO);

  // ——— Nesneler ve tutan eller ———
  if (defterRiza) {
    seferDefteri(K, LC, { acik: true });
    rc.tut('L');
    if (dokunEl && pIn(t, tm.dokun[0] - 0.3, tm.dokun[2] + 0.3, 0.26, 0.3) > 0.6) rc.isaret('R', dokunEl); else rc.tut('R');
    anketDefteri(K, PC, { acik: true });
    dc.tut('R');
    if (padUc && Math.max(pIn(t, tm.tek - 0.3, tm.sayiyi + 0.45, 0.26, 0.3), pIn(t, tm.ondort - 0.3, tm.ondort + 0.55, 0.26, 0.3)) > 0.6) dc.isaret('L', padUc); else dc.tut('L');
  } else {
    anketDefteri(K, NLc, { k: 0.74, rot: -7, acik: false });
    seferDefteri(K, NRc, { k: 0.8, rot: 7, acik: false });
    nc.tut('L'); nc.tut('R');
    if (dThink > 0.6) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
    if (dPoint > 0.6) dc.isaret('L', dHedef);
  }
  if (rWatch > 0.5) { const w = rc.handL; K.rect(w[0] - 16, w[1] - 30, 32, 24, '#E9E4D8', 3, 6); }

  // ——— Hikmet (sağda, levhanın önünde; yalnız kendi plânında) ———
  if (id === 'hikmet') {
    let hL = [0.35, 0.05];
    const wPt = pIn(t, tm.duraksiz - 0.25, tm.herkesH + 0.05, 0.28, 0.3);
    const wBir = pIn(t, tm.bir - 0.3, tm.h1s + 0.35, 0.28, 0.3);
    if (wPt > 0.4) hL = [0.75, -0.25];
    if (wBir > 0.4) hL = [-0.05, 0.0];
    const hp = H.kisi('hikmet', { x: X.hik, expr: IF.notr, ...POZ.dur, head: { tilt: 0, look: hL } });
    const hO = { heads };
    const hedef = [LEVHA.x + 34, LEVHA.y + LEVHA.h + 6];   // levhanın alt kenarı (parmak yazıya binmez)
    if (wPt > 0.01) hO.R = [[hedef[0] - 40, hedef[1] + 80], wPt, 'B'];
    if (wBir > 0.01) hO.L = [H.elYeri('hikmet', hp, 'L', 'yukari'), wBir, 'B'];
    const hc = oyna(K, t, tl, 'hikmet', hp, hO);
    if (wPt > 0.6) hc.isaret('R', hedef);
    if (wBir > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2, boy: 1 });
  }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
