// Bölüm 45 · FARKLI SAYILAR (v4 "hikâye" dili; storyboard: hikayeler/bolum_045_v5.md).
// Logline: Toplantı odasında on kişi, ellerinde numaralı kürekler. Herkes ya hep doğru ya hep yalan söyler; "Kaç yalancı var?"
// sorusuna 1'den 10'a on farklı cevap gelmiştir. Defne "hepsi yalancı" der, kendi "10" küreği ona karşı çıkar. Necmi duvardaki
// saatleri elindeki çalar saatle karşılaştırır: doğru saatler hep aynı saati gösterir. Kürekler sırayla YALANCI yüzüne döner,
// "10" mercan çelişkiyle titrer, Hikmet'in "9"u yeşil DOĞRU yüzüne döner.
// Akılda kalacak tek şey: doğrucular aynı sayıyı söyler; herkes farklı dediyse en fazla bir doğrucu vardır, o da "9" diyendir.
// Oyun çerçevesi: doğrucu/yalancı rolü küreğin arka yüzündedir (Y mercan, D yeşil); konuşmalar oyunun dışındadır.
// Tek oda, önden: arkada basamak (arka sıra onun üstünde, kürekleri başlarının yanında), önde ikinci sıra (kürekler göğüste),
// sağ duvarda üç saat (ipucu). Kadro: Hikmet, Defne, Necmi, Kerem (genc, konuşmaz) ve altı figüran (b045_f1 … f6).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b045_oda', ZEMIN = 1500, ARKA_Y = 1235, ARKA_K = 0.70, ON_K = 0.74;
const SAAT = [[1262, 1045, 2 + 50 / 60], [1432, 1045, 4 + 20 / 60], [1602, 1045, 3.25]];   // [x, y, saat]; çalar saat 3.25
const CALAR = 3.25, YESIL = PAL.green, MERCAN = PAL.coral;
const NX = [SAAT[0][0] - 170, SAAT[1][0] - 170, SAAT[2][0] - 170];   // Necmi'nin saat önündeki duruşları
const GENIS = [1.06, 540, 1030];
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));

// Mantık denetimi (build anında): n kişi, cevaplar 1..n hepsi farklı. Doğrucu sayısı d ise yalancı n − d'dir ve her doğrucu
// n − d der; farklı cevaplarda d ≤ 1. Tek tutarlı durum: yalnız "n − 1" diyen doğrucu.
function cozum(n) {
  const out = [];
  for (let d = 0; d <= n; d++) { const dogru = []; for (let c = 1; c <= n; c++) if (c === n - d) dogru.push(c); if (dogru.length === d) out.push({ yalanci: n - d, dogru }); }
  return out;
}
{ const c = cozum(10); if (c.length !== 1 || c[0].yalanci !== 9 || c[0].dogru[0] !== 9) console.warn('b045: mantık denetimi tutmadı'); }

// ═══════════════════════════ Figüran kartları (bölüme özgü, b045_ önekli) ═══════════════════════════
const FIG_TANIM = [
  // [anahtar, iskelet, gövde, gölge, bacak, ten, ten gölgesi, saç, özellikler, kol gövde renginde mi]
  ['b045_f1', 'genc', '#9A5B3C', '#7E4A31', '#3B3F45', '#E2AE88', '#C79470', '#2A211C', ['jacket', 'hairSlick', 'mustacheThick'], true],
  ['b045_f2', 'defne', '#7C8B5A', '#667348', '#3E3A33', '#E8BC98', '#CFA07C', '#2B1E18', ['blazer', 'bun', 'glassesRect', 'lashes'], true],
  ['b045_f3', 'necmi', '#5E6B73', '#4B565D', '#2F3338', '#C98E66', '#AE7650', '#3A2E26', ['suit', 'tie', 'hairMessy'], true],
  ['b045_f4', 'defne', '#4F7A73', '#3F625C', '#2F2A2A', '#D9A27A', '#BF875F', '#1F1714', ['jacket', 'hairLong', 'lashes'], true],
  ['b045_f5', 'genc', '#B07A3A', '#93652F', '#2E4057', '#EFC4A0', '#D7A882', '#6B4A2E', ['hoodie', 'hairSpiky'], true],
  ['b045_f6', 'hikmet', '#8C6A44', '#735637', '#4A4F57', '#D9A27A', '#C08760', '#4A3A30', ['vest', 'mustacheThick', 'baldSides', 'glassesRect'], false],
];
const BOYU = { ...H.BOY };
for (const [key, base, gov, gol, bac, ten, tenG, sac, ozl, kol] of FIG_TANIM) {
  const b = H.CARDS[base];
  if (!H.CARDS[key]) H.CARDS[key] = {
    ...b, key, name: 'Figüran', seed: 500 + Number(key.slice(6)) * 7,
    torso: { ...b.torso, color: gov, shade: gol, belly: base === 'hikmet' ? 0.08 : b.torso.belly },
    arm: kol ? { ...b.arm, color: gov, shade: gol } : { ...b.arm },
    leg: { ...b.leg, color: bac, shade: bac }, skin: ten, skinShade: tenG, hair: sac, features: ozl,
  };
  BOYU[key] = H.BOY[base] - 6;
}
// Oturuş düzeni: [anahtar, x, sıra (0 ön / 1 arka basamak), sayı, küreği tutan el]
const KISI = [
  { key: 'b045_f1', x: 200, sira: 0, num: 3, el: 'L' }, { key: 'genc', x: 350, sira: 0, num: 7, el: 'L' },
  { key: 'defne', x: 500, sira: 0, num: 10, el: 'R' }, { key: 'hikmet', x: 680, sira: 0, num: 9, el: 'R' },
  { key: 'necmi', x: 830, sira: 0, num: 2, el: 'L' },
  { key: 'b045_f3', x: 275, sira: 1, num: 5, el: 'L' }, { key: 'b045_f4', x: 425, sira: 1, num: 8, el: 'L' },
  { key: 'b045_f5', x: 575, sira: 1, num: 4, el: 'L' }, { key: 'b045_f6', x: 725, sira: 1, num: 6, el: 'L' },
  { key: 'b045_f2', x: 875, sira: 1, num: 1, el: 'L' },
];
const KIM = Object.fromEntries(KISI.map(k => [k.key, k]));
const SAYIDAN = Object.fromEntries(KISI.map(k => [k.num, k]));
const olcek = (key, sira) => BOYU[key] * (sira ? ARKA_K : ON_K);
const kisi = (key, x, sira, o = {}) => H.kisi(key, { x, y: sira ? ARKA_Y : ZEMIN, s: olcek(key, sira), ...o, head: { ...(o.head || {}) } });

// ═══════════════════════════ Nesneler ═══════════════════════════
// Kürek (oy küreği): el sapı tutar; ön yüz sayı, arka yüz rol (Y mercan / D yeşil). flip 0 ön, 1 arka (dikey eksende döner).
const KW = 104, KH = 86, SAP = 62;
const kurekMerkez = (el, k = 1, rot = 0) => [el[0] + Math.sin(rot) * (SAP + KH / 2) * k, el[1] - Math.cos(rot) * (SAP + KH / 2) * k];
function kurek(K, el, { num, flip = 0, arka = 'Y', k = 1, rot = 0, halka = null, kab = 0, ters = 0 }) {
  const { ctx } = K, a = Math.PI * flip, sx = Math.cos(a), s = k * (1 + 0.2 * kab);
  ctx.save(); ctx.translate(el[0], el[1]); ctx.rotate(rot); ctx.scale(s, s);
  K.rect(-6, -SAP - 4, 12, SAP + 22, PAL.woodDark, LW * 0.6, 4);
  ctx.save(); ctx.translate(0, -SAP - KH / 2); ctx.rotate(ters);
  if (halka && halka.a > 0.01) { ctx.save(); ctx.globalAlpha = halka.a; K.rect(-KW / 2 - 13, -KH / 2 - 13, KW + 26, KH + 26, null, 0, 18); ctx.lineWidth = 10; ctx.strokeStyle = halka.renk; ctx.stroke(); ctx.restore(); }
  ctx.scale(Math.max(0.05, Math.abs(sx)), 1);
  if (sx >= 0) { K.rect(-KW / 2, -KH / 2, KW, KH, PAL.paper, LW, 10); K.text(String(num), 0, 22, 62, INK, 900); }
  else { const d = arka === 'D'; K.rect(-KW / 2, -KH / 2, KW, KH, d ? YESIL : MERCAN, LW, 10); K.text(d ? 'D' : 'Y', 0, 24, 66, PAL.paper, 900); }
  ctx.restore(); ctx.restore();
}
// Çalar saat (elde): (x, y) tabanın ortası
function calar(K, x, y, k = 1, t = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (const s of [-1, 1]) { K.line(s * 16, -62, s * 26, -78, 7); K.circ(s * 24, -80, 12, PAL.metal, LW * 0.6); }
  K.line(-18, -4, -24, 8, 7); K.line(18, -4, 24, 8, 7);
  K.circ(0, -40, 40, PAL.red, LW * 0.8);
  H.clock(K, 0, -40, 31, Math.floor(CALAR), (CALAR % 1) * 60, t);
  ctx.restore();
}
// Basamak (arka sıranın durduğu kürsü)
function basamak(K) {
  K.rect(60, ARKA_Y, 980, 30, PAL.woodTop, LW, 6);
  K.rect(60, ARKA_Y + 30, 980, ZEMIN - ARKA_Y - 30, PAL.wood, LW, 0);
  for (let i = 1; i < 5; i++) K.line(60 + i * 196, ARKA_Y + 34, 60 + i * 196, ZEMIN - 4, 3, PAL.woodDark);
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-300, 1800], dongu: ['pencerede martı', 'duvar saatlerinin saniye kolları', 'yan sehpada çay buharı'],
  capa: { saat1: SAAT[0], saat2: SAAT[1], saat3: SAAT[2] }, kadraj: { genis: GENIS, saatler: [1.4, 1330, 1010] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -600, x1: 2300, isik });
    M.pencere(K, -30, 520, 300, 340, { isik, t });
    // beyaz tahta: soru işaretleri (yazı yok), kalem rafı
    K.rect(330, 500, 400, 230, '#F7F4EC', LW, 8); K.rect(350, 730, 360, 14, PAL.metal, LW * 0.6, 4);
    for (const [x, y, r] of [[420, 610, 0.1], [530, 590, -0.15], [640, 625, 0.2]]) { K.ctx.save(); K.ctx.translate(x, y); K.ctx.rotate(r); K.text('?', 0, 30, 92, '#9FB7B3', 900); K.ctx.restore(); }
    K.rect(380, 722, 40, 10, PAL.red, 2, 3); K.rect(440, 722, 40, 10, PAL.green, 2, 3);
    // sağ duvar: üç saat (hepsi farklı), altında yan sehpa ve çay
    for (const [x, y, h] of SAAT) M.duvarSaati(K, x, y, 54, h, t + x * 0.013);
    K.rect(1600, 1240, 200, 26, PAL.woodTop, LW, 6); K.rect(1620, 1266, 18, 234, PAL.woodDark, LW, 4); K.rect(1762, 1266, 18, 234, PAL.woodDark, LW, 4);
    K.ell(1690, 1238, 26, 7, PAL.cream, LW * 0.5); K.poly([[1676, 1186], [1704, 1186], [1698, 1236], [1682, 1236]], '#B5532A', LW * 0.6);
    H.buhar(K, 1690, 1176, t, { k: 0.7 });
    for (let i = 0; i < 5; i++) H.yaprak(K, 1150, 1240, 170 + (i % 2) * 40, -0.9 + i * 0.45 + 0.04 * Math.sin(t * 1.1 + i), i % 2 ? PAL.green : '#4C8240', 1);
    K.poly([[1110, 1240], [1190, 1240], [1180, 1330], [1120, 1330]], PAL.mustard, LW);
    basamak(K);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    ters: 0.3, h2a: T('h2a'), sordum: T('h2a:1'), h2b: T('h2b'), sence: T('h2b:9'),
    say0: T('h2b:2') - 0.04, d2: T('d2'), hepsi: T('d2') - 0.12, onKisi: T('d2:2'),
    hd: T('hd'), tap: T('hd:2'), dogru: T('hd:4') - 0.04, olmaz: T('hd:6') - 0.04,
    walk0: cd0 + 1.8, s2: cd0 + 5.0, bak: cd - 0.32,
    n1: T('n1'), c1: cd + 0.12, adim1: T('n1:1') - 0.1, c2: T('n1:2') - 0.25, adim2: T('n1:3') - 0.4, c3: T('n1:4') + 0.02, mudur: T('n1:6') - 0.1,
    cevap: T('d3:2') - 0.1, d4: T('d4'), yanyana: T('d4:1') - 0.3, ayri: T('d4:3') + 0.02, geri: T('d4:4') + 0.15,
    flip0: T('d4:4') + 0.05, d5: T('d5'), olamaz: T('d5:2') - 0.04, donus: T('d5:3') - 0.05, dokuz: T('d5:5') - 0.04,
    son10: T('d5:6') + 0.05, dogru5: T('d5:7') - 0.04, tag: T('d5:8') + 0.1,
    espri: T('h4') - 0.25, yalanciyla: T('h4:1'), calis: T('h4:3') - 0.05, cta: T('d6') - 0.2,
  };
  tm.say = n => tm.say0 + (n - 1) * 0.12;                                   // h2b: kürekler 1'den 10'a sırayla kalkar
  tm.flip = n => n <= 8 ? tm.flip0 + (n - 1) * 0.3 : n === 9 ? tm.dokuz : tm.son10;
  tm.ipucu = tm.bak + 5 / 30;
  tm.donWalk = tm.cevap - 1.0;                                               // Necmi saatlerden yerine döner
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, 1.08, 540, 1030], [2.4, 1.1, 545, 1025], [tm.sordum - 0.3, 1.26, 620, 1000], [tm.h2b - 0.6, 1.27, 615, 1000]] },
    { id: 'sorgu', t0: tm.h2b - 0.08, cam: [[0, ...GENIS], [tm.sence, 1.1, 545, 1022]] },
    { id: 'deneme', t0: tm.d2 - 0.1, cam: [[0, 1.32, 575, 1000], [tm.hd, 1.35, 585, 995]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 1.0, 540, 1030], [cd0 + 4.5, 1.02, 545, 1025]] },
    { id: 'sayac2', t0: tm.s2, cam: [[0, 1.3, 760, 1000], [cd - 0.5, 1.33, 755, 998]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.44, 1250, 1050], [tm.adim1 + 0.2, 1.44, 1330, 1050], [tm.adim2 + 0.2, 1.45, 1440, 1048]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 520, 985]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...GENIS], [tm.flip0, 1.07, 540, 1025], [tm.d5 - 0.25, 1.26, 560, 1000], [tm.donus, 1.07, 540, 1025]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.36, 615, 1080], [tm.calis, 1.4, 630, 1078]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.42, 520, 1030], [tm.cta + 1.6, 1.45, 515, 1025]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // konuşmacıya bakış olayları: [an, hedef x | null (kameraya)]
  const konus = [];
  for (const l of tl.lines) konus.push([l.t0 - 0.15, l.who === 'necmi' ? null : KIM[l.who].x]);
  konus.push([cd0, null]); konus.push([tm.bak, 1400]); konus.push([tm.cevap, KIM.defne.x]); konus.push([tm.dokuz + 0.1, KIM.hikmet.x]);
  konus.sort((a, b) => a[0] - b[0]);

  const hikBase = kisi('hikmet', KIM.hikmet.x, 0, { expr: 'mutlu', head: { tilt: -3, look: [-0.5, 0.2] }, ...POZ.dur });
  const hik = [
    [1.0, { head: { tilt: -5, look: [-0.7, 0.15] } }, 0.35],
    [tm.sordum, { head: { tilt: 4, look: [0.6, 0.1] } }, 0.35],
    [T('h2a:3'), { head: { tilt: -4, look: [-0.7, 0.1] } }, 0.35],
    [tm.sence - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [0, 0.1] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: -5, look: [-0.85, 0.1] } }, 0.01],
    [tm.olmaz, { expr: 'mutlu', head: { tilt: 6, look: [-0.8, 0.0] } }, 0.25],
    [cd0, { expr: 'notr', ...POZ.belde, head: { tilt: 3, look: [-0.6, 0.2] } }, 0.35],
    [tm.bak, { head: { tilt: -3, look: [0.95, 0.05] } }, 0.25],
    [tm.cevap, { expr: 'notr', armL: POZ.dur.armL, head: { tilt: -3, look: [-0.8, 0.15] } }, 0.01],
    [tm.dokuz + 0.05, { expr: 'saskin', head: { tilt: 5, look: [-0.2, 0.75] } }, 0.25],
    [tm.tag, { expr: 'saskin', head: { tilt: -3, look: [-0.7, 0.1] } }, 0.3],
    [tm.espri, { expr: 'saskin', head: { tilt: -2, look: [0.1, 0.1] } }, 0.01],
    [tm.yalanciyla, { expr: 'saskin', head: { tilt: 5, look: [-0.85, 0.15] } }, 0.3],
    [tm.calis, { expr: 'yorgun', head: { tilt: -7, look: [0.05, 0.25] } }, 0.3],
    [tm.cta, { expr: 'yorgun', head: { tilt: -5, look: [-0.7, 0.2] } }, 0.35],
  ];
  const defBase = kisi('defne', KIM.defne.x, 0, { expr: 'saskin', head: { tilt: 4, look: [0.8, 0.15] }, ...POZ.dur });
  const def = [
    [tm.h2b, { expr: 'notr', head: { tilt: 3, look: [0.8, 0.15] } }, 0.3],
    [tm.hepsi, { expr: 'mutlu', head: { tilt: -6, look: [0.3, 0.05] } }, 0.25],
    [tm.onKisi, { ...POZ.yana, head: { tilt: -4, look: [-0.7, 0.05] } }, 0.3],
    [tm.hd, { expr: 'mutlu', armL: POZ.dur.armL, head: { tilt: 4, look: [0.85, 0.1] } }, 0.3],
    [tm.olmaz, { expr: 'saskin', head: { tilt: -6, look: [0.45, -0.45] } }, 0.25],
    [cd0 + 0.3, { expr: H.IFADE.dusun, armL: { sh: 18, el: -168 }, head: { tilt: 6, look: [0.4, -0.55] } }, 0.4],
    [cd0 + 2.6, { head: { tilt: -6, look: [0.7, 0.2] } }, 0.35],
    [tm.s2 - 0.3, { expr: H.IFADE.dusun, armL: { sh: 40, el: -95 }, head: { tilt: 5, look: [-0.5, -0.6] } }, 0.35],
    [tm.s2 + 3.2, { expr: 'notr', head: { tilt: -7, look: [0.2, -0.3] } }, 0.3],
    [tm.bak, { expr: 'notr', armL: POZ.dur.armL, head: { tilt: -4, look: [0.95, 0.05] } }, 0.25],
    [tm.buldum - 0.06, {}, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0, -0.3] } }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.15] } }, 0.01],
    [tm.flip0, { ...POZ.yana, head: { tilt: -4, look: [-0.6, -0.25] } }, 0.35],
    [tm.d5 - 0.1, { expr: 'saskin', armL: POZ.dur.armL, head: { tilt: 6, look: [0.45, 0.6] } }, 0.3],
    [tm.dokuz, { expr: 'mutlu', head: { tilt: -4, look: [0.85, 0.15] } }, 0.3],
    [tm.espri, { expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.1] } }, 0.01],
    [tm.cta - 0.05, { expr: 'mutlu', head: { tilt: -7, look: [0.05, 0.05] } }, 0.35],
  ];
  return { tm, film, konus, hikBase, hik, defBase, def };
}

// ═══════════════════════════ Kişi durumu (poz + kürek) ═══════════════════════════
const sars = (t, a, b, amp) => (t >= a && t < b) ? amp * Math.sin(TAU * 7 * (t - a)) * (1 - 0.5 * seg(t, a, b - a)) : 0;
function bakis(S, t, k, i) {   // konuşmacıya dönen baş (her kişi 60 ms gecikmeli)
  let look = [0, 0.1];
  for (const [a, x] of S.konus) { if (t < a + i * 0.06) break; const hedef = x === null ? [0, 0.12] : [Math.max(-0.9, Math.min(0.9, (x - k.x) / 160)) || 0, 0.12]; const u = W(t, a + i * 0.06, 0.3); look = [lerp(look[0], hedef[0], u), lerp(look[1], hedef[1], u)]; }
  return look;
}
// Kürek durumu (sayı, dönüş, renk halkası, titreme) — bütün sahneler aynı fonksiyonu okur
function kurekDurum(S, t, k) {
  const { tm } = S, n = k.num;
  let flip = ease.state(seg(t, tm.flip(n), 0.32)), rot = 0, halka = null, kab = H.nabiz(t, tm.say(n), 0.4);
  let ters = 0;
  if (n === 7) ters = Math.PI * (1 - ease.state(seg(t, tm.ters, 0.32)));                                  // Kerem küreği ters tutuyordu
  if (n === 7) ters += Math.PI * pIn(t, tm.cd0 + 2.2, tm.cd0 + 3.9, 0.3);                                 // sayaçta yine ters çevirir
  if (n === 10) {
    flip = H.iz([[0, 0], [tm.d5 + 0.05, 0.42, 0.25], [tm.donus, 0, 0.3], [tm.son10, 1, 0.32]], t);
    rot += sars(t, tm.olmaz, tm.olmaz + 0.5, 0.12) + sars(t, tm.olamaz, tm.donus, 0.1);
    const g = pIn(t, tm.dogru, tm.olmaz, 0.2);
    if (g > 0.01) halka = { renk: YESIL, a: g };
    const m = pIn(t, tm.olmaz, tm.cd0 - 0.1, 0.15) + pIn(t, tm.olamaz, tm.donus, 0.15);
    if (m > 0.01) halka = { renk: MERCAN, a: Math.min(1, m) };
  }
  if (n === 9) { const g = W(t, tm.dogru5, 0.25); if (g > 0.01) halka = { renk: YESIL, a: g }; }
  return { num: n, flip, rot, halka, kab, ters, arka: n === 9 ? 'D' : 'Y', k: k.sira ? 0.92 : 1 };
}
// Küreği tutan elin hedefi (dünya)
function elHedef(key, p, side, sira, kaldir = 0) {
  const c = H.CARDS[key], L = (c.arm.upper + c.arm.lower) * p.s, sh = H.shoulder(key, p, side), m = side === 'L' ? -1 : 1;
  if (sira) { const hd = H.eklem(key, p, 'head'); return [hd[0] + m * 0.34 * p.s, hd[1] + 0.04 * p.s - kaldir]; }
  const ne = H.eklem(key, p, 'neck'), pv = H.eklem(key, p, 'pelvis');
  return [lerp(ne[0], pv[0], 0.5) + m * 6, lerp(ne[1], pv[1], 0.5) + 50 - kaldir];
}
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// Hikmet'in küreğinin merkezi (Defne d4'te kendi küreğini yanına getirir)
function hikPoz(S, t) { return H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t); }

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  dunya(K, t, B) {
    const { tm } = S, id = B.sc.id;
    M.mekanCiz(K, ODA, 'arka', t);
    const yer = {};   // kürek merkezleri (ekran işaretleri için)
    for (const sira of [1, 0]) { const sonra = []; KISI.forEach((k, i) => { if (k.sira === sira && (id !== 'ipucu' || k.key === 'necmi')) sonra.push(kisiCiz(K, t, tl, S, B, k, i, yer)); }); for (const f of sonra) f(); }
    B.yer = yer;
    // ipucu: saat halkaları
    if (id === 'ipucu') {
      const { ctx } = K, blink = (a, b) => (t >= a && t < b) ? 0.55 + 0.45 * Math.cos(TAU * (t - a) / 0.42) : 0;
      const halka = (x, y, r, renk, a) => { if (a < 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.lineWidth = 11; ctx.strokeStyle = renk; ctx.stroke(); ctx.restore(); };
      halka(SAAT[0][0], SAAT[0][1], 66, MERCAN, blink(tm.c1 + 0.25, tm.adim1));
      halka(SAAT[1][0], SAAT[1][1], 66, MERCAN, blink(tm.c2 + 0.25, tm.adim2));
      halka(SAAT[2][0], SAAT[2][1], 66, YESIL, W(t, tm.c3 + 0.25, 0.2));
    }
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id, yer = B.yer || {};
    const sabit = (a, p) => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'deneme' && yer[10]) H.mark(K, t, tm.olmaz, tm.cd0 - 0.15, sabit(tm.olmaz, [yer[10][0] + 92, yer[10][1] - 30]), false);
    if (id === 'cevap' && yer[10]) {
      if (t < tm.geri + 0.3) H.mark(K, t, tm.ayri, tm.geri, sabit(tm.ayri, [yer[9][0] - 60, yer[9][1] - 2]), false);
      H.mark(K, t, tm.olamaz, tm.donus, sabit(tm.olamaz, [yer[10][0] + 72, yer[10][1] + 6]), false);
      H.mark(K, t, tm.dogru5, tm.espri - 0.2, sabit(tm.dogru5, [yer[9][0] + 30, yer[9][1] - 88]), true);
      H.tag(K, t, tm.tag, tm.espri - 0.2, [540, 400], K.up('9 yalancı'), MERCAN, PAL.paper, 56);
    }
  },
});

function kisiCiz(K, t, tl, S, B, k, i, yer) {
  const { tm } = S, id = B.sc.id, { key, sira } = k;
  let side = k.el, p, ekstra = null, kaldir = 40 * H.nabiz(t, tm.say(k.num), 0.4), elKey = null;
  // ——— poz ———
  if (key === 'hikmet') p = hikPoz(S, t);
  else if (key === 'defne') { p = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); p.y -= H.buldumHop(t, tm.buldum); }
  else p = kisi(key, k.x, sira, { expr: key === 'genc' ? 'mutlu' : 'notr', ...POZ.dur, head: { tilt: (i % 3 - 1) * 3, look: bakis(S, t, k, i) } });
  if (key !== 'hikmet' && key !== 'defne') {
    // kürek dönerken kendi küreğine bakar
    const f0 = tm.flip(k.num), bk = pIn(t, f0 - 0.15, f0 + 0.55, 0.2);
    if (bk > 0) p.head.look = kar(p.head.look, [p.head.look[0] * 0.3 + (side === 'L' ? -0.3 : 0.3), 0.75], bk);
  }
  if (key === 'hikmet' || key === 'defne') {
    if (t >= tm.cd0 && t < tm.cd - 0.4) H.glance(p, t, tm.cd - 0.4, 9.6);
  }
  // figüranların sayaçtaki işleri
  if (key === 'b045_f3' || key === 'b045_f4') { const u = pIn(t, tm.cd0 + 1.2, tm.cd0 + 3.0, 0.3); if (u) p.head.look = kar(p.head.look, [key === 'b045_f3' ? 0.9 : -0.9, 0.2], u), p.head.tilt += (key === 'b045_f3' ? 6 : -6) * u; }
  if (key === 'b045_f2') { const u = pIn(t, tm.walk0 + 0.2, tm.walk0 + 2.0, 0.3); if (u) p.head.look = kar(p.head.look, [0.9, 0.1], u); }
  if (key === 'b045_f5') { const u = pIn(t, tm.cd0 + 3.6, tm.cd0 + 5.6, 0.3); if (u) { p.head.look = kar(p.head.look, [0, -0.8], u); p.expr = 'yorgun'; } }
  if (key === 'genc') { const u = pIn(t, tm.cd0 + 2.0, tm.cd0 + 4.1, 0.3); if (u) { p.head.look = kar(p.head.look, [-0.3, 0.8], u); p.head.tilt -= 10 * u; p.expr = 'saskin'; } H.onayla(p, t, tm.dogru5 + 0.1); }
  // Necmi: sayaçta saatlere yürür, ipucunda saatleri karşılaştırır, cevapta yerine döner
  let necmiYan = false;
  if (key === 'necmi') {
    if (t >= tm.walk0 && t < tm.donWalk) {
      const w = { t0: tm.walk0, x0: k.x, x1: NX[0], s: olcek('necmi', 0), y: ZEMIN };
      if (t < tm.walk0 + 1.25) { p = H.yuru('necmi', t, w); necmiYan = true; }
      else p = kisi('necmi', NX[0], 0, { expr: 'notr', ...POZ.dur, head: { tilt: 2, look: [0.6, -0.3] } });
      if (id === 'ipucu') {
        H.yanAdim(p, t, { t0: tm.adim1, x0: NX[0], x1: NX[1], adim: 1 }); if (t >= tm.adim2) H.yanAdim(p, t, { t0: tm.adim2, x0: NX[1], x1: NX[2], adim: 1 });
        const j = t < tm.adim1 + 0.2 ? 0 : t < tm.adim2 + 0.2 ? 1 : 2;
        p.head = { tilt: t > tm.c3 + 0.2 ? 5 : -3, look: t > tm.mudur ? [-0.9, 0.1] : [0.6, -0.5] };
        p.expr = t > tm.c3 + 0.25 ? 'mutlu' : j < 2 && t > tm.c1 + 0.25 ? 'saskin' : 'notr';
        ekstra = { hedef: [p.x + 100, SAAT[0][1] + 40] };
      }
    } else if (t >= tm.donWalk && t < tm.donWalk + 1.25) {
      p = H.yuru('necmi', t, { t0: tm.donWalk, x0: NX[2], x1: k.x, s: olcek('necmi', 0), y: ZEMIN, hiz: 520 }); necmiYan = true;
    }
    if (necmiYan) side = 'R';
  }
  // ——— eller ———
  let hedef = elHedef(key, p, side, sira, kaldir), dirsek = sira ? 'B' : 'A';
  if (necmiYan) hedef = [p.x + p.facing * 0.32 * p.s, p.y - 1.05 * p.s];
  const o = { heads: B.heads };
  if (ekstra?.hedef) o.R = [ekstra.hedef, 1, 'B'];
  if (key === 'defne') {
    const hd = H.eklem('defne', p, 'head'), yuksek = [hd[0] + 56, hd[1] - 40];
    const u1 = pIn(t, tm.hepsi, tm.cd0 + 0.2, 0.3), u2 = W(t, tm.buldum - 0.05, 0.22) * (1 - W(t, tm.cevap, 0.01)), u3 = W(t, tm.cta + 0.05, 0.4);
    if (u1) hedef = kar(hedef, yuksek, u1);
    if (u2) hedef = kar(hedef, yuksek, u2);
    if (u3) hedef = kar(hedef, yuksek, u3);
    if (id === 'cevap') {   // d4: küreğini Hikmet'inkinin yanına getirir
      const hp = hikPoz(S, t), hEl = elHedef('hikmet', hp, 'R', 0), hc = kurekMerkez(hEl);
      const u = W(t, tm.yanyana, 0.3) * (1 - W(t, tm.geri, 0.35));
      if (u) hedef = kar(hedef, [hc[0] - 120, hc[1] + SAP + KH / 2 - 70], u);
    }
    if (u1 || u2 || u3) dirsek = 'B';
    if (id === 'espri') H.omuzSilk(p, t, tm.yalanciyla + 0.3, 0.6);
    // sayaç (yakın plan): sol elinde parmakla sayar
    if (id === 'sayac2') {
      ekstra = { parmak: clamp01((t - tm.s2 - 0.2) / 0.55) * 1 + Math.min(4, Math.max(0, (t - tm.s2 - 0.8) / 0.5)) };
      const w = pIn(t, tm.s2 - 0.05, tm.bak - 0.1, 0.3); if (w) o.L = [[hd[0] - 100, hd[1] + 46], w, 'B'];
    }
  }
  if (key === 'hikmet' && (id === 'espri' || id === 'cta')) hedef = kar(hedef, [hedef[0] + 8, hedef[1] - 14], W(t, tm.espri + 0.1, 0.35));
  if (key === 'hikmet' && id === 'cevap') hedef[1] -= 70 * W(t, tm.yanyana, 0.3) * (1 - W(t, tm.geri, 0.35));   // d4: küreğini kaldırır, Defne yanına getirir
  if (key === 'hikmet') {
    // hd: sol eliyle Defne'nin küreğine dokunur
    const u = pIn(t, tm.tap - 0.28, tm.cd0 - 0.2, 0.28);
    if (u) {
      const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t), dhd = H.eklem('defne', dp, 'head');
      const dEl = kar(elHedef('defne', dp, 'R', 0), [dhd[0] + 56, dhd[1] - 40], pIn(t, tm.hepsi, tm.cd0 + 0.2, 0.3)), dc = kurekMerkez(dEl);
      o.L = [[dc[0] + 34, dc[1] + 56], u, 'A']; elKey = { side: 'L', dc };
    }
  }
  if (key === 'b045_f1') { const u = pIn(t, tm.cd0 + 1.0, tm.cd0 + 2.6, 0.3); if (u) { const hd = H.eklem(key, p, 'head'); o.R = [[hd[0] + 46, hd[1] - 40], u, 'B']; } }
  o[side] = [hedef, 1, dirsek];
  const a = oyna(K, t, key === 'genc' || key.startsWith('b045') ? null : tl, key, p, o);
  if (key === 'genc' || key.startsWith('b045')) B.heads[key] = a.head;
  if (key === 'necmi' && id === 'ipucu') B.heads.necmi = [a.head[0] - 40, a.head[1]];
  if (key === 'hikmet') B.heads.hikmet = [a.head[0] + 95, a.head[1] + 20];   // altyazı kuyruğu "9" küreğinin yanından geçsin
  // Defne'nin parmakları (sayaçta sayar)
  if (ekstra?.parmak) a.parmak('L', ekstra.parmak, { toplam: 5 });
  // ——— kürek (sıranın bütün gövdelerinden sonra çizilir: kürek komşunun önünde kalır) ———
  const elP = side === 'L' ? a.handL : a.handR, kd = kurekDurum(S, t, k);
  if (necmiYan) kd.rot = 0.12 * p.facing;
  yer[k.num] = kurekMerkez(elP, kd.k, kd.rot);
  return () => {
    kurek(K, elP, kd); a.tut(side);
    if (ekstra?.hedef) { calar(K, a.handR[0], a.handR[1] + 6, 1, t); a.tut('R'); }   // Necmi'nin çalar saati
    if (elKey) a.isaret('L', elKey.dc);
  };
}
