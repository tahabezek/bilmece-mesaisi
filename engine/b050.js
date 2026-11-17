// Bölüm 50 · BAYRAMLAŞMA (v4 "hikâye" dili; storyboard: hikayeler/bolum_050_v5.md). Mekanizma: el sıkışma (parite) önermesi.
// Logline: Bayram sabahı ofiste yedi kişi sıra olmuş bayramlaşıyor. Her bayramlaşma iki kişinin göğsündeki sayaç rozetlerini
// bağlayan bir kurdeledir. Hikmet defterine göre "tek sayıda kişiyle bayramlaşan tam beş kişi" vardır. Defne saymadan "Olamaz"
// der: her kurdele iki rozeti birden bir artırır, toplam hep çifttir; tek rozetlerin (mercan) adedi de hep çift kalır.
// Akılda kalacak tek şey: kurdelenin iki ucu vardır; tek sayılı rozetler hep çift sayıda olur.
// Mekân: bayram sabahı ofis (önden; sıra halinde yedi kişi, bayrak süsü, pencere, duvar saati, sehpada çay).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b050_ofis', AYAK = 1160, KS = 0.68;          // zemin; yedi kişi sığsın diye kadro ölçeği
const ARKA = [1, 3, 5], ARKA_Y = 34, ARKA_S = 0.95;       // aile fotoğrafı dizilişi: Defne, Kerem, F2 bir adım geride
const MERCAN = PAL.coral, ROZ_R = 31, ROZ_YAZI = 48;     // rozet yarıçapı ve rakam boyu (dünya px; kamera ≥ 1 → ekranda ≥ 48)
const KUR_RENK = [PAL.teal, PAL.mustard, '#7E8460', '#4F7A73', '#C9A24A'];
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Figüran kartları (bölüme özgü, b050_ önekli) ═══════════════════════════
// Kadro kartlarına dokunulmaz; figüranlar kadro iskeletinden türetilir, palet ve aksesuar değişir.
const FIG_TANIM = [
  // [anahtar, iskelet, gövde, gölge, bacak, ten, ten gölgesi, saç, özellikler, kol gövde renginde mi]
  ['b050_f1', 'defne', '#4F7A73', '#3F625C', '#3E3A33', '#D9A27A', '#BF875F', '#1F1714', ['blazer', 'bun', 'glassesCat', 'lashes'], true],
  ['b050_f2', 'hikmet', '#8C6A44', '#735637', '#4A4F57', '#E8BC98', '#CFA07C', '#B0A89E', ['vest', 'mustacheThick', 'baldSides', 'glassesRect'], false],
  ['b050_f3', 'genc', '#9A5B3C', '#7E4A31', '#2F3338', '#C08760', '#A46F4C', '#2A211C', ['jacket', 'hairSlick'], true],
];
const BOYU = { ...H.BOY };
for (const [key, base, gov, gol, bac, ten, tenG, sac, ozl, kol] of FIG_TANIM) {
  const b = H.CARDS[base];
  if (!H.CARDS[key]) H.CARDS[key] = {
    ...b, key, name: 'Figüran', seed: 500 + Number(key.slice(6)) * 7,
    torso: { ...b.torso, color: gov, shade: gol, belly: base === 'hikmet' ? 0.1 : b.torso.belly },
    arm: kol ? { ...b.arm, color: gov, shade: gol } : { ...b.arm },
    leg: { ...b.leg, color: bac, shade: bac }, skin: ten, skinShade: tenG, hair: sac, features: ozl,
  };
  BOYU[key] = H.BOY[base] - 6;
}
// Sıra (soldan sağa): 0 F1 (şeker tabağı) · 1 Defne · 2 Hikmet (defter, kalem) · 3 Kerem · 4 Necmi (kolonya) · 5 F2 · 6 F3
const KIM = ['b050_f1', 'defne', 'hikmet', H.KEREM, 'necmi', 'b050_f2', 'b050_f3'];
const XS = [156, 284, 412, 540, 668, 796, 924];
const F1 = 0, DEF = 1, HIK = 2, KER = 3, NEC = 4, F2 = 5, F3 = 6;
const arkada = i => ARKA.includes(i);
const sOf = i => BOYU[KIM[i]] * KS * (arkada(i) ? ARKA_S : 1);
const yOf = i => AYAK - (arkada(i) ? ARKA_Y : 0);
// kişiye göre nokta: a, b kişinin ölçeğinde (p.s) yatay ve ayak noktasından yukarı
const rel = (p, a, b) => [p.x + a * p.s, p.y - b * p.s];
const CIZ_SIRA = [1, 3, 5, 0, 2, 4, 6];                   // önce arka sıra

// ═══════════════════════════ Kurdeleler (sabit liste, build anında denetlenir) ═══════════════════════════
// [a, b, an adı (tm'de), açılış: 'orta' (el sıkışma: ortadan iki uca) | 'at' (uzaktan: a'dan b'ye), süre]
// Önceden bağlanmış dört kurdele t < 0'da yerindedir.
const KURDELE = [
  [F1, DEF, null], [NEC, F2, null], [HIK, F3, null], [F1, KER, null],
  [F2, F3, 'r5', 'orta', 0.4],          // kanca: F2 ile F3 el sıkışır
  [HIK, KER, 'r6', 'orta', 0.45],       // sayaç: Kerem, Hikmet'in elini öper
  [KER, NEC, 'r8', 'orta', 0.45],       // ipucu: Necmi ile Kerem el sıkışır ("o da benim elimi sıktı")
  [F1, F3, 'r9', 'at', null],           // cevap: çift + çift → iki tek doğar (TEK +2)
  [DEF, KER, 'r10', 'at', null],        // cevap: tek + tek → ikisi çift olur (TEK −2)
  [F3, NEC, 'r11', 'at', null],         // cevap: tek + çift → yer değiştirir (TEK aynı)
];
// Denetim: iki kişi en fazla bir kez; her adımda tek rozetlerin adedi çift; cevap anındaki beklenen sayılar.
function denetle(tk) {
  const deg = KIM.map(() => 0), gor = new Set(), hata = [], tekler = [];
  const sira = KURDELE.map((k, i) => [tk[i], k]).sort((x, y) => x[0] - y[0]);
  for (const [, [a, b]] of sira) {
    const ad = Math.min(a, b) + '-' + Math.max(a, b);
    if (a === b) hata.push('kendisiyle ' + a);
    if (gor.has(ad)) hata.push('ikinci kez ' + ad); gor.add(ad);
    deg[a]++; deg[b]++;
    const n = deg.filter(d => d % 2).length; tekler.push(n);
    if (n % 2) hata.push('tek rozet adedi tek: ' + n);
  }
  if (tekler.slice(-4).join() !== '2,4,2,2') hata.push('cevap dizisi ' + tekler.join());
  if (hata.length) { console.warn('b050: kurdele denetimi tutmadı', hata.join(', ')); throw new Error('b050 kurdele: ' + hata.join(', ')); }
  return tekler;
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-500, 1600], zemin: AYAK, dongu: ['duvar saatinin saniye kolu', 'pencerede martı', 'sehpada çay buharı'],
  capa: {}, kadraj: { genis: [1, 540, 960] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -500, x1: 1600, floorY: AYAK, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 730, 500, 250, 200, { isik, t });
    M.duvarSaati(K, 250, 600, 48, 10.4 + t / 60, t);
    // çerçeveli resim (sol)
    K.rect(-70, 560, 150, 118, PAL.woodDark, LW, 6); K.rect(-57, 573, 124, 92, PAL.cream, 3, 3);
    K.poly([[-50, 660], [-10, 612], [22, 640], [44, 622], [62, 660]], '#7E8460', 2.5);
    // bayrak süsü: duvar boyunca iki sarkık ip, üçgen bayraklar (sabit)
    for (const [x0, x1, y0, sag] of [[-500, 560, 470, 70], [560, 1600, 470, 70]]) {
      const n = 11, P = u => [lerp(x0, x1, u), y0 + sag * 4 * u * (1 - u)];
      K.ctx.beginPath(); for (let i = 0; i <= 24; i++) { const p = P(i / 24); i ? K.ctx.lineTo(...p) : K.ctx.moveTo(...p); } K.ctx.lineWidth = 3; K.ctx.strokeStyle = INK; K.ctx.stroke();
      for (let i = 0; i < n; i++) {
        const a = P((i + 0.15) / n), b = P((i + 0.85) / n), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 44];
        K.poly([a, b, m], [PAL.mustard, PAL.cream, PAL.teal, '#7E8460'][i % 4], 2.5);
      }
    }
    // sehpa ve çay (sol uç; yakın planlarda görünür)
    K.rect(-250, AYAK - 150, 150, 18, PAL.woodTop, LW, 5);
    K.rect(-238, AYAK - 132, 14, 132, PAL.wood, LW * 0.7, 3); K.rect(-126, AYAK - 132, 14, 132, PAL.wood, LW * 0.7, 3);
    cayBardak(K, -175, AYAK - 150, t);
  },
});
const BARDAK = [[-15, -34], [15, -34], [9, -20], [13, -5], [10, 0], [-10, 0], [-13, -5], [-9, -20]];
function cayBardak(K, x, yb, t) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb);
  K.ell(0, 1, 23, 5, PAL.cream, 2.5); K.poly(BARDAK, '#A8401F', 0); K.poly(BARDAK, null, 2.6);
  K.line(-8, -29, -5, -22, 2.4, '#FFFFFF');
  ctx.restore();
  H.buhar(K, x, yb - 40, t, { k: 0.38, n: 2, ara: 10, boy: 56 });
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Sayaç rozeti: göğüste yuvarlak; değer değişince kâğıt gibi döner. tek: mercan vurgusu 0..1 (yalnız "Buldum!"dan sonra)
function rozetYeri(i, p) { const key = KIM[i], n = H.eklem(key, p, 'neck'), pv = H.eklem(key, p, 'pelvis'); return [lerp(n[0], pv[0], 0.36), lerp(n[1], pv[1], 0.36)]; }
// arka: "Buldum!"dan önce rakam yok, yalnız bayram süsü (rakam görünürse izleyici sayıp bilmeceyi gözle çözer)
function rozet(K, [x, y], deger, { don = 1, tek = 0, kab = 0, arka = false } = {}) {
  const { ctx } = K, sx = Math.max(0.04, Math.abs(Math.cos(Math.PI * don))), k = 1 + 0.14 * kab;
  ctx.save(); ctx.translate(x, y); ctx.scale(sx * k, k);
  K.circ(3, 4, ROZ_R + 6, INK, 0);
  // fırfır kenar (bayram rozeti)
  ctx.beginPath(); for (let j = 0; j <= 24; j++) { const a = j / 24 * TAU, r = ROZ_R + 6 + (j % 2 ? 0 : 4); j ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.closePath(); ctx.fillStyle = tek > 0.5 ? H.mixHex(PAL.mustard, MERCAN, tek) : PAL.mustard; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
  K.circ(0, 0, ROZ_R, tek > 0 ? H.mixHex(PAL.paper, MERCAN, tek) : PAL.paper, 3.5);
  if (arka) {
    // süs: sekiz yapraklı çiçek (teal) ve hardal göbek
    for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; K.ell(Math.cos(a) * 13, Math.sin(a) * 13, 9, 5.5, PAL.teal, 2, a); }
    K.circ(0, 0, 7, PAL.mustard, 2);
  } else K.text(String(deger), 0, ROZ_YAZI * 0.36, ROZ_YAZI, tek > 0.5 ? PAL.paper : INK, 900);
  ctx.restore();
}
// "+1" pulu: kurdele bağlanınca rozetin üstünde kabarır, 0,7 sn'de yükselip söner (rakam göstermeden "iki uç birden artar")
function arti(K, [x, y], t, a, yan = 1) {   // yan: pul rozetin hangi yanında (eşin tersi; yüzlere binmez)
  const u = (t - a) / 0.75; if (u < 0 || u >= 1) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), al = 1 - ease.exit(seg(u, 0.7, 0.3));
  ctx.save(); ctx.translate(x + yan * 62, y - 6 - 24 * ease.enter(u)); ctx.scale(0.6 + 0.4 * v, 0.6 + 0.4 * v); ctx.globalAlpha = clamp01(v * 1.6) * al;
  K.rect(-38 + 4, -26 + 5, 76, 52, INK, 0, 26); K.rect(-38, -26, 76, 52, PAL.mustard, 3, 26); K.text('+1', 0, 15, 42, INK, 900);
  ctx.restore();
}
// Kurdele: iki rozetin altından sarkan şerit (yüzlerin altında kalır). u0..u1: görünen kısım; tut: [nokta, ağırlık] elle kaldırma
function kurdeleYolu(A, B, sag, tut) {
  const P0 = [A[0], A[1] + ROZ_R * 0.8], P1 = [B[0], B[1] + ROZ_R * 0.8];
  let C = [(P0[0] + P1[0]) / 2, Math.max(P0[1], P1[1]) + 2 * sag];
  if (tut && tut[1] > 0) C = kar(C, [2 * tut[0][0] - (P0[0] + P1[0]) / 2, 2 * tut[0][1] - (P0[1] + P1[1]) / 2], tut[1]);
  return u => [(1 - u) ** 2 * P0[0] + 2 * u * (1 - u) * C[0] + u * u * P1[0], (1 - u) ** 2 * P0[1] + 2 * u * (1 - u) * C[1] + u * u * P1[1]];
}
function kurdele(K, yol, u0, u1, renk) {
  if (u1 - u0 < 0.005) return;
  const { ctx } = K, n = Math.max(6, Math.ceil((u1 - u0) * 40));
  ctx.beginPath(); for (let j = 0; j <= n; j++) { const p = yol(lerp(u0, u1, j / n)); j ? ctx.lineTo(...p) : ctx.moveTo(...p); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke();
  ctx.lineWidth = 9; ctx.strokeStyle = renk; ctx.stroke();
  ctx.save(); ctx.setLineDash([4, 14]); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.stroke(); ctx.restore();
}
// Defter: açık, iki sayfa (sol: satırlar, sağ: halkalı "5"). (x, y) cilt altı (tutan el). k: ölçek, duz: "6" yazısı 0..1, cizik: 5'in üstü 0..1
function defter(K, x, y, { k = 1, cizik = 0, alti = 0 } = {}) {
  const { ctx } = K, pw = 58, ph = 76;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.rect(-pw - 6, -ph - 4, 2 * pw + 12, ph + 10, '#8E2A2E', LW * 0.8, 6);
  K.rect(-pw, -ph, pw, ph, PAL.paper, 2.5, 3); K.rect(0, -ph, pw, ph, PAL.paper, 2.5, 3);
  for (let j = 0; j < 6; j++) { const yy = -ph + 14 + j * 10.5; K.line(-pw + 8, yy, -8, yy, 2.2, '#9FB3B0'); K.line(-pw + 10, yy - 1, -pw + 10 + 14 + (j * 7) % 22, yy - 1, 2.6, '#3E3A35'); }
  K.line(0, -ph, 0, 4, 3, INK);
  const ax = alti > 0 ? lerp(pw / 2, pw / 2 - 12, alti) : pw / 2;
  K.circ(ax, -ph / 2 + 2, 24, null, 3); ctx.strokeStyle = MERCAN; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(ax, -ph / 2 + 2, 24, 0, TAU); ctx.stroke();
  K.text('5', ax, -ph / 2 + 18, 44, INK, 900);
  if (cizik > 0) K.line(ax - 20, -ph / 2 + 16, ax - 20 + 40 * cizik, -ph / 2 - 12, 5, MERCAN);
  if (alti > 0) { ctx.globalAlpha = clamp01(alti * 1.5); K.text('6', pw / 2 + 18, -ph / 2 + 10, 34, INK, 900); ctx.globalAlpha = 1; }
  ctx.restore();
}
// Akordeon şerit: defterin altından zemine sarkan katlı kâğıt ("yüzlerce satır"). L: sarkan boy 0..1
function serit(K, x, y0, L) {
  if (L <= 0.01) return;
  const { ctx } = K, boy = (AYAK - 8 - y0) * L, panel = 26, n = Math.ceil(boy / panel);
  for (let j = 0; j < n; j++) {
    const a = y0 + j * panel, b = Math.min(y0 + boy, a + panel), sol = j % 2 ? 6 : -6;
    K.poly([[x - 40 + sol, a], [x + 40 + sol, a], [x + 40 - sol, b], [x - 40 - sol, b]], j % 2 ? PAL.paper : '#E9E1D0', 2.4);
    if (b - a > 14) { K.line(x - 28, a + 9, x + 22, a + 9, 2, '#9FB3B0'); K.line(x - 28, a + 17, x + 8, a + 17, 2, '#9FB3B0'); }
  }
  if (L > 0.97) for (let j = 0; j < 4; j++) K.rect(x - 44 + j * 7, AYAK - 10 - j * 7, 88, 9, j % 2 ? PAL.paper : '#E9E1D0', 2, 2);   // zeminde yığın
}
// Kalem (Hikmet sağ elde)
function kalem(K, h, a = -0.5) {
  const { ctx } = K; ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(a);
  K.rect(-4, -40, 8, 46, '#2F3E4C', 2, 2); K.poly([[-4, 6], [4, 6], [0, 16]], PAL.cream, 2); ctx.restore();
}
// Kolonya şişesi: (x, y) tutuş noktası, a açı (0 dik, + saat yönü)
function kolonya(K, h, a = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(a);
  K.rect(-17, -52, 34, 66, '#F2E7B8', LW * 0.7, 6); K.rect(-14, -28, 28, 40, '#E5C65E', 0, 4);
  K.rect(-12, -40, 24, 14, PAL.paper, 2, 2); K.rect(-7, -66, 14, 15, '#C9A24A', 2.2, 3);
  ctx.restore();
}
// Şeker tabağı: (x, y) tabak üstünün ortası
function tabak(K, x, y, kalan = 6) {
  K.ell(x, y + 6, 56, 14, PAL.paper, LW * 0.7); K.ell(x, y + 3, 40, 8, '#E9E1D0', 0);
  const SK = [[-26, -4, PAL.coral], [-8, -8, PAL.mustard], [10, -5, PAL.teal], [26, -2, '#7E8460'], [-14, 2, PAL.mustard], [6, 1, PAL.teal]];
  SK.slice(0, kalan).forEach(([dx, dy, c]) => seker(K, x + dx, y + dy, c));
}
function seker(K, x, y, c) { K.poly([[x - 16, y - 6], [x - 10, y], [x - 16, y + 6]], c, 2); K.poly([[x + 16, y - 6], [x + 10, y], [x + 16, y + 6]], c, 2); K.ell(x, y, 11, 8, c, 2.2); }

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    h1: T('h1'), kim: T('h1:3'), h1s: T('h1>'),
    h2a: T('h2a'), fazla: T('h2a:3'), birKez: T('h2a:4'), bayramlasir: T('h2a:6'),
    h2b: T('h2b'), tek: T('h2b:1'), bes: T('h2b:6'), dogru: T('h2b:9'),
    d2: T('d2'), bastan: T('d2:1'), sayalim: T('d2:2'), kimD: T('d2:3'), hd: T('hd'), satir: T('hd:4'), yuzlerce: T('hd:3'),
    n1: T('n1'), elini: T('n1:2'), sik: T('n1:3'), o: T('n1:4'), sikti: T('n1:8'), n1s: T('n1>'),
    cevap: Math.max(T('d3:1') - 0.1, T('d3') + 0.85), olamaz: T('d3:2'), d4: T('d4'), bayramlasma: T('d4:1'), birer: T('d4:5'), toplarsan: T('d4:9'), cift: T('d4:11'),
    d5: T('d5'), toplam: T('d5:1'), tekS: T('d5:3'), sayilarin: T('d5:4'), ciftD: T('d5:7'), besD: T('d5:9'), tekD: T('d5:11'),
    espri: T('h4') - 0.2, eksik: T('h4:3'), yazmisim: T('h4:4'), cta: T('d6') - 0.15,
  };
  // ——— kurdele anları ———
  tm.r5 = 0.75;                                   // kanca: eller 0,3'te buluşur
  tm.el0 = cd0 + 1.7;                             // sayaç: el öpme başlar
  tm.r6 = tm.el0 + 1.55;
  tm.r8 = tm.sikti + 0.02;                        // "sıktı": iki rozet birden
  tm.r9 = tm.birer - 0.03; tm.r9a = tm.bayramlasma - 0.05;
  tm.r10 = tm.sayilarin + 0.05; tm.r10a = tm.tekS - 0.55;
  tm.r11 = tm.ciftD - 0.02; tm.r11a = tm.ciftD - 0.7;
  const ac = { r9: tm.r9 - tm.r9a, r10: tm.r10 - tm.r10a, r11: tm.r11 - tm.r11a };
  const kur = KURDELE.map(([a, b, ad, mod, d], i) => ({ i, a, b, tk: ad ? tm[ad] : -10, mod: mod || 'orta', d: ad ? (d ?? ac[ad]) : 0.01, sag: 22 + 0.15 * Math.abs(XS[a] - XS[b]) + (i % 3) * 7, renk: KUR_RENK[i % KUR_RENK.length] }));
  const tekler = denetle(kur.map(k => k.tk));
  // ——— diğer anlar ———
  tm.yaz = [1.05, 2.5];                           // Hikmet deftere yazar
  tm.f1Uz = [tm.h2a - 0.1, tm.birKez + 0.15];     // F1 Defne'ye yeniden el uzatır
  tm.kurTut = [tm.fazla - 0.35, tm.bayramlasir + 0.35];
  tm.goster = [tm.h2b - 0.05, tm.dogru + 0.3];    // Hikmet defteri gösterir
  tm.dok = [[tm.bastan, 0], [tm.sayalim, 1], [tm.kimD, 2], [tm.kimD + 0.38, 3]];
  tm.serit = tm.yuzlerce - 0.3; tm.toparla = cd0 + 0.35;
  tm.dSay = [cd0 + 2.3, cd0 + 5.3]; tm.dCene = [cd0 + 5.9, cd - 0.7];
  tm.kol = [cd0 + 5.0, cd0 + 7.3]; tm.ovus = [cd0 + 7.3, cd0 + 8.9];
  tm.ctaTabak = tm.cta + 0.15; tm.ctaAl = tm.cta + 0.65;

  // rozet değerleri: her kişinin değiştiği anlar [[an, değer]…]
  const iz = KIM.map(() => [[-99, 0]]);
  for (const k of [...kur].sort((x, y) => x.tk - y.tk)) for (const j of [k.a, k.b]) iz[j].push([k.tk, iz[j][iz[j].length - 1][1] + 1]);
  // TEK etiketinin adımları (cevap): kurdeleler sayılarak
  const tekAdim = [[tm.olamaz + 0.12, tekler[tekler.length - 4]]];
  for (const [ad, n] of [['r9', tekler.at(-3)], ['r10', tekler.at(-2)], ['r11', tekler.at(-1)]]) tekAdim.push([tm[ad] + 0.16, n]);
  const topAdim = [[tm.toplarsan - 0.04, 2 * kur.filter(k => k.tk <= tm.toplarsan).length], [tm.r10 + 0.16, 2 * kur.filter(k => k.tk <= tm.r10).length], [tm.r11 + 0.16, 2 * kur.filter(k => k.tk <= tm.r11).length]];

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.12, 548, 968], [tm.kim, 1.15, 566, 962]] },
    { id: 'ikili', t0: tm.h2a - 0.1, cam: [[0, 1.4, 238, 870], [tm.bayramlasir, 1.42, 242, 868]] },
    { id: 'defter', t0: tm.h2b - 0.1, kesme: false, cam: [[0, 1.42, 245, 868], [tm.h2b + 0.15, 1.45, 422, 862], [tm.dogru, 1.46, 418, 858]] },
    { id: 'deneme', t0: tm.d2 - 0.1, cam: [[0, 1.3, 348, 875], [tm.serit, 1.2, 362, 930]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 1.12, 540, 968], [cd0 + 4.5, 1.13, 526, 966], [cd - 0.6, 1.15, 556, 962]] },
    { id: 'ipucu', t0: cd - 0.05, cam: [[0, 1.4, 604, 872], [tm.sikti, 1.42, 604, 872]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.45, 282, 840]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.12, 540, 990], [tm.d5, 1.13, 540, 986]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.42, 452, 862], [tm.yazmisim, 1.44, 448, 860]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.4, 240, 860], [tm.cta + 1.6, 1.43, 245, 856]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— baz pozlar ve izler (önden) ———
  const base = KIM.map((key, i) => H.kisi(key, { x: XS[i], y: yOf(i), s: sOf(i), expr: i === DEF ? 'saskin' : 'mutlu', ...POZ.dur }));
  const def = [
    [0, { expr: 'saskin' }, 0.01],
    [tm.h1s, { expr: 'notr' }, 0.3],
    [tm.h2a - 0.1, { expr: 'mutlu' }, 0.01],
    [tm.h2b - 0.1, { expr: 'notr' }, 0.01],
    [tm.d2 - 0.1, { expr: 'mutlu' }, 0.01],
    [tm.serit + 0.2, { expr: 'saskin' }, 0.2],
    [cd0, { expr: 'notr' }, 0.3],
    [tm.dSay[0], { expr: IFADE.dusun2 }, 0.3],
    [tm.dCene[0], { expr: IFADE.dusun, ...POZ.dusun }, 0.4],
    [tm.dCene[1], { expr: 'saskin', armR: POZ.dur.armR }, 0.3],
    [tm.buldum - 0.06, { armR: POZ.dur.armR }, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR }, 0.01],
  ];
  const hik = [
    [tm.h2b - 0.1, { expr: 'mutlu' }, 0.01],
    [tm.d2 - 0.1, { expr: 'notr' }, 0.01],
    [tm.hd, { expr: 'mutlu' }, 0.25],
    [cd0, { expr: 'mutlu' }, 0.3],
    [tm.cevap, { expr: 'notr' }, 0.01],
    [tm.besD, { expr: 'saskin' }, 0.25],
    [tm.espri, { expr: 'yorgun' }, 0.01],
    [tm.yazmisim, { expr: IFADE.dusun2 }, 0.3],
  ];
  const ker = [[tm.el0 + 0.3, { expr: 'notr' }, 0.3], [tm.el0 + 2.6, { expr: 'mutlu' }, 0.3]];
  return { tm, film, base, def, hik, ker, kur, iz, tekAdim, topAdim, tekler };
}

// ═══════════════════════════ Durum yardımcıları ═══════════════════════════
const degerAt = (S, j, t) => { let v = 0, a = -99; for (const [tt, d] of S.iz[j]) if (t >= tt) { v = d; a = tt; } return { v, a }; };
// kim konuşuyor? (dinleyenler konuşana bakar)
function konusan(tl, t) { for (const l of tl.lines) if (t >= l.t0 - 0.1 && t < l.t1 + 0.2) return KIM.indexOf(l.who); return -1; }
function bak(p, tx, ty = null, w = 1) {
  const lx = clamp01((tx - p.x) / 420 * 0.5 + 0.5) * 2 - 1, ly = ty === null ? 0.15 : Math.max(-0.6, Math.min(0.8, (ty - (p.y - 2.3 * p.s)) / 300));
  p.head = { ...p.head, look: [lerp(p.head.look?.[0] || 0, lx, w), lerp(p.head.look?.[1] || 0, ly, w)] };
}
// el sıkışma: A sağ el (ekranın sağı), B sol el; buluşma noktası iki omzun ortası. Dönen { w, p (hedef), sars }
function elSik(t, a, b, pa, pb, t0, tM, t1, sars = [tM, tM + 0.7]) {
  const w = pIn(t, t0, t1, 0.3);
  if (w <= 0.005) return null;
  const sa = H.shoulder(KIM[a], pa, 'R'), sb = H.shoulder(KIM[b], pb, 'L');
  const m = [(sa[0] + sb[0]) / 2, Math.max(sa[1], sb[1]) + 52];
  const dy = t >= sars[0] && t < sars[1] ? 9 * Math.sin(TAU * 3.2 * (t - sars[0])) * (1 - seg(t, sars[1] - 0.2, 0.2)) : 0;
  const yak = W(t, t0, tM - t0);    // buluşmaya yaklaşma
  return { w, a: [m[0] - 7 * yak, m[1] + dy], b: [m[0] + 7 * yak, m[1] + dy + 3], tut: t >= tM - 0.02 && t < t1 - 0.05 };
}
// uzaktan selam: yakın kol yana-yukarı kalkar
function selam(i, p, side, t, a, b) {
  const w = pIn(t, a, b, 0.3); if (w <= 0.005) return null;
  const sh = H.shoulder(KIM[i], p, side), m = side === 'L' ? -1 : 1;
  const sall = 6 * Math.sin(TAU * 2.2 * (t - a));
  if (i === NEC) return [[sh[0] + m * (0.3 * p.s + sall), sh[1] - 0.25 * p.s], w, 'A'];   // Necmi: kolonyalı eli hafifçe kaldırır (arkadaki F2'nin yüzüne çıkmaz)
  const y = H.elYeri(KIM[i], p, side, 'yukari');               // ön sıra dış koluyla selam verir: kol arka sıranın yüzüne binmez
  return [[y[0] + m * sall, y[1] + 0.25 * p.s], w, 'B'];
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { d4: 7, d5: 9 },
  kartSon: -1,
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (id === 'cevap') {
      const son = tm.espri - 0.2;
      H.adimEtiket(K, t, S.tekAdim.map(([a, n]) => [a, 'TEK: ' + n, MERCAN, PAL.paper]), son, [300, 530], 54);
      H.adimEtiket(K, t, S.topAdim.map(([a, n]) => [a, 'TOPLAM: ' + n, PAL.mustard, INK]), son, [770, 530], 54);
      const dp = S._defter; if (dp) H.mark(K, t, tm.tekD - 0.03, son, B.ekr([dp[0] + 29 * dp[2] + 24, dp[1] - 36 * dp[2] - 24]), false);
    }
  },
});

// "SEN DE DÜŞÜN!" sayacı (sahne.js countdown'un uyarlaması): yüzleri örtmesin diye zeminde, ayakların altında durur.
// Sol: daire (r 98), sağ: başlık ve paylaşım hapı. Sahne arkada oynamaya devam eder.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 + 0.2 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 + 0.2), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 218, y = 1300, r = 98;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 14, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 30, 86, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(620, 1250); ctx.scale(inU * out, inU * out);
  ctx.font = '900 60px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 70;
  K.rect(-bw / 2 + 8, -46 + 10, bw, 92, INK, 0, 46); K.rect(-bw / 2, -46, bw, 92, PAL.mustard, LW, 46);
  K.text('SEN DE DÜŞÜN!', 0, 21, 60, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(620, 1366); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 60;
    K.rect(-sw / 2 + 8, -44 + 10, sw, 88, INK, 0, 44); K.rect(-sw / 2, -44, sw, 88, PAL.coral, LW, 44); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz });
  // ——— pozlar ———
  const P = S.base.map((b, i) => {
    const tr = i === DEF ? S.def : i === HIK ? S.hik : i === KER ? S.ker : [];
    return H.poseAt(H.CARDS[KIM[i]], b, tr, t);
  });
  P[DEF].y -= H.buldumHop(t, tm.buldum) * KS * 1.3;
  // bakışlar: dinleyen konuşana; olaylar bakışı çeker
  const kon = konusan(tl, t);
  const odak = (() => {
    if (t < 1.3) return [XS[F2] + 70, 960];
    if (t >= tm.f1Uz[0] && t < tm.h2b - 0.1) return [190, 950];
    if (id === 'deneme') return [330, 940];
    if (id === 'sayac') { if (t < tm.el0 + 2.5) return [470, 880]; if (t < tm.kol[1]) return [750, 960]; return [XS[F2], 900]; }
    if (id === 'ipucu') return [610, 960];
    if (id === 'cevap') {
      if (t >= tm.r9a - 0.2 && t < tm.r9 + 0.3) return [540, 1080];
      if (t >= tm.r10a - 0.2 && t < tm.r10 + 0.3) return [400, 1020];
      if (t >= tm.r11a - 0.2 && t < tm.r11 + 0.3) return [820, 1020];
      if (t >= tm.besD - 0.1) return [360, 1050];
    }
    return kon >= 0 ? [XS[kon], 850] : null;
  })();
  P.forEach((p, i) => {
    if (i === kon && id !== 'sayac') { bak(p, i === DEF && id === 'cta' ? p.x : XS[i] + (i < 3 ? 120 : -120), 860, 0.8); if (id === 'cta' || id === 'buldum' || (id === 'defter' && t > tm.dogru - 0.1)) p.head.look = [0, 0.05]; return; }
    if (odak) bak(p, odak[0], odak[1], 0.85);
  });
  if (id === 'sayac') { H.glance(P[HIK], t, tm.cd - 0.3, 9.5); H.glance(P[F1], t, tm.cd - 0.9, 9.5); }
  // Defne sayaçta rozetleri tek tek sayar: bakışı sağa doğru adım adım
  if (id === 'sayac' && t >= tm.dSay[0] && t < tm.dSay[1]) { const k = Math.min(5, Math.floor((t - tm.dSay[0]) / 0.6)); bak(P[DEF], [400, 540, 680, 820, 960, 960][k], 980, 1); }
  if (id === 'sayac' && t >= tm.dCene[1] - 0.2) bak(P[DEF], 680, 900, 1);
  H.onayla(P[DEF], t, tm.bayramlasir - 0.05, 2, 0.3);
  H.onayla(P[F1], t, tm.birKez + 0.1, 1, 0.34);
  H.onayla(P[KER], t, tm.yazmisim + 0.15, 2, 0.3);
  // Kerem el öperken eğilir; Hikmet ona bakar
  const eg = id === 'sayac' ? W(t, tm.el0 + 0.4, 0.4) * (1 - W(t, tm.el0 + 1.9, 0.35)) : 0, alin = id === 'sayac' ? pIn(t, tm.el0 + 1.15, tm.el0 + 1.75, 0.2) : 0;
  if (eg > 0) { P[KER].lean = -15 * eg + 6 * alin; P[KER].head = { ...P[KER].head, tilt: -12 * eg, look: [-0.7, 0.7 - 0.5 * alin] }; bak(P[HIK], XS[KER], 900, 1); P[HIK].expr = 'mutlu'; }

  const O = KIM.map(() => ({ heads }));
  const roz = P.map((p, i) => rozetYeri(i, p));
  const tutan = [];                               // [kişi, el] grip listesi (nesnelerden sonra)
  // ——— kanca: F2–F3 el sıkışır ———
  const s5 = elSik(t, F2, F3, P[F2], P[F3], -0.3, 0.3, 1.35);
  if (s5) { O[F2].R = [s5.a, s5.w, 'A']; O[F3].L = [s5.b, s5.w, 'A']; if (s5.tut) tutan.push([F3, 'L'], [F2, 'R']); }
  // ——— h2a: F1 yeniden el uzatır, Defne aralarındaki kurdeleyi kaldırır ———
  if (id === 'ikili' || id === 'kanca') {
    const w = pIn(t, tm.f1Uz[0], tm.f1Uz[1], 0.3);
    if (w > 0.005) O[F1].R = [[lerp(H.shoulder(KIM[F1], P[F1], 'R')[0], roz[DEF][0], 0.42), H.shoulder(KIM[F1], P[F1], 'R')[1] + 0.72 * P[F1].s], w, 'A'];
  }
  let tutKur = null;
  const wK = id === 'ikili' ? pIn(t, tm.kurTut[0], tm.kurTut[1], 0.28) : 0;
  if (wK > 0.005) {
    const up = W(t, tm.kurTut[0] + 0.28, 0.35);
    const mid = kurdeleYolu(roz[F1], roz[DEF], S.kur[0].sag, null)(0.5), hp = kar(mid, [mid[0] + 10, mid[1] - 0.88 * P[DEF].s], up);
    O[DEF].L = [[hp[0] - 4, hp[1] - 4], wK, 'A'];
    tutKur = [hp, wK > 0.98 ? 1 : wK * (t > tm.kurTut[0] + 0.25 ? 1 : 0)];
  }
  // ——— Hikmet: defter sol elde, kalem sağ elde ———
  let dfH = rel(P[HIK], -0.36, 0.83), dfK = 1, dfAlti = 0, dfCizik = 0, seritL = 0;
  if (id === 'defter') { const u = W(t, tm.goster[0], 0.35); dfH = kar(dfH, rel(P[HIK], -0.19, 1.32), u); dfK = 1 + 0.25 * u; }
  if (id === 'deneme') { const u = W(t, tm.d2 - 0.1, 0.35) * (1 - W(t, tm.serit + 0.05, 0.3)); dfH = kar(dfH, rel(P[HIK], -0.48, 1.17), u); }
  if (id === 'deneme' || id === 'sayac') seritL = ease.state(seg(t, tm.serit, 0.65)) * (1 - ease.state(seg(t, tm.toparla, 0.9)));
  if (id === 'cevap') { const u = pIn(t, tm.besD - 0.15, tm.espri, 0.3); dfH = kar(dfH, rel(P[HIK], -0.42, 0.9), u); dfK = 1 + 0.2 * u; }
  if (id === 'espri') { dfH = rel(P[HIK], -0.19, 1.32); dfK = 1.25; dfCizik = ease.state(seg(t, tm.eksik, 0.3)); dfAlti = ease.state(seg(t, tm.yazmisim + 0.15, 0.4)); }
  if (id === 'deneme' && seritL > 0) dfH = kar(dfH, rel(P[HIK], -0.41, 1.1), 1);
  O[HIK].L = [dfH, 1, 'A'];
  // kalem: yazma (kanca), gösterme (h2b), yazma (espri)
  let kalemH = null;
  {
    let hed = rel(P[HIK], 0.26, 0.76), w = 1;
    const sayfa = [dfH[0] + 30 * dfK, dfH[1] - 40 * dfK];
    if (id === 'kanca') { const u = pIn(t, tm.yaz[0] - 0.3, tm.yaz[1], 0.3); hed = kar(hed, [sayfa[0] - 40 + 10 * Math.sin(TAU * 2.6 * t), sayfa[1] + 4 * Math.sin(TAU * 5.1 * t)], u); }
    if (id === 'defter') { const u = pIn(t, tm.bes - 0.35, tm.dogru - 0.1, 0.28); hed = kar(hed, [sayfa[0] + 6, sayfa[1] + 30], u); }
    if (id === 'espri') { const u = pIn(t, tm.eksik - 0.35, tm.espri + 3, 0.28); hed = kar(hed, [sayfa[0] + 6 + 24 * dfAlti + 8 * Math.sin(TAU * 3 * t) * seg(t, tm.yazmisim, 0.5) * (1 - seg(t, tm.yazmisim + 0.6, 0.2)), sayfa[1] + 20], u); }
    if (id === 'sayac') {
      const w6 = pIn(t, tm.el0, tm.el0 + 2.15, 0.35);
      if (w6 > 0.005) { const kh = H.eklem(KIM[KER], P[KER], 'head'); hed = kar(hed, [kh[0] - 2, kh[1] + 0.55 * P[KER].s * (1 - 0.35 * alin)], w6); }
    }
    O[HIK].R = [hed, w, 'A'];
  }
  // ——— Defne: deftere dokunarak sayar (d2); sayaçta parmakla sayar ———
  let dIs = null, dParmak = 0;
  if (id === 'deneme') {
    const w = pIn(t, tm.d2 + 0.05, tm.serit + 0.15, 0.28);
    if (w > 0.005) {
      const sx = dfH[0] - 30, sy = dfH[1] - 62;
      const p = H.dokunYolu(t, tm.dok.map(([a, k]) => [a, [sx, sy + k * 12]]), { yuksel: 12, sure: 0.16 });
      O[DEF].R = [[p[0] - 16, p[1] + 14], w, 'A']; if (w > 0.5) dIs = p;
    }
  }
  if (id === 'sayac') {
    const w = pIn(t, tm.dSay[0] - 0.3, tm.dSay[1], 0.3);
    if (w > 0.005) { O[DEF].R = [H.elYeri('defne', P[DEF], 'R', 'gogus'), w, 'A']; dParmak = clamp01((t - tm.dSay[0]) / 0.6 + 1) ; dParmak = Math.min(4, Math.floor((t - tm.dSay[0]) / 0.6) + 1 + clamp01(((t - tm.dSay[0]) % 0.6) / 0.15) - 1); }
  }
  // ——— F1: tabak sol elde ———
  let tbP = null;
  {
    const sh = H.shoulder(KIM[F1], P[F1], 'L');
    let hed = [sh[0] - 0.1 * P[F1].s, sh[1] + 0.66 * P[F1].s];
    if (id === 'cta') { const u = W(t, tm.ctaTabak, 0.5); hed = kar(hed, rel(P[F1], 0.42, 1.15), u); if (u > 0.3) O[F1].R = [rel(P[F1], 0.55, 1.07), u, 'A']; }
    O[F1].L = [hed, 1, 'A'];
  }
  // ——— Defne CTA: tabaktan şeker alıp yanağının yanına kaldırır ———
  let dSeker = null;
  if (id === 'cta') {
    const al = W(t, tm.ctaAl, 0.28), kal = W(t, tm.ctaAl + 0.45, 0.45);
    const y1 = H.elYeri('defne', P[DEF], 'L', 'yukari');
    const hed = kar(rel(P[F1], 0.48, 1.2), rel(P[DEF], -0.42, 1.62), kal);   // şeker çenenin altında, kameraya doğru
    O[DEF].L = [hed, al, 'A']; if (t > tm.ctaAl + 0.3) dSeker = true;
    bak(P[DEF], P[DEF].x, null, 1); P[DEF].head.look = [0.05, 0.05];
  }
  // ——— Necmi: kolonya sağ elde; sayaçta F2'nin avucuna döker ———
  let kolA = 0, damlaU = 0;
  {
    const sh = H.shoulder('necmi', P[NEC], 'R');
    let hed = [sh[0] + 0.17 * P[NEC].s, sh[1] + 0.66 * P[NEC].s];
    if (id === 'sayac') {
      const w = pIn(t, tm.kol[0], tm.kol[1], 0.35); hed = kar(hed, rel(P[NEC], 0.49, 1.95), w);
      kolA = 2.1 * W(t, tm.kol[0] + 0.35, 0.35) * (1 - W(t, tm.kol[1] - 0.45, 0.3)); damlaU = t > tm.kol[0] + 0.6 && t < tm.kol[1] - 0.5 ? 1 : 0;
      const wf = pIn(t, tm.kol[0] - 0.1, tm.kol[1] - 0.1, 0.3);
      if (wf > 0.005) O[F2].L = [rel(P[F2], -0.49, 1.19), wf, 'A'];
      const wo = pIn(t, tm.ovus[0], tm.ovus[1], 0.3);
      if (wo > 0.005) { const ov = 10 * Math.sin(TAU * 3.4 * (t - tm.ovus[0])); O[F2].L = [[P[F2].x - 0.06 * P[F2].s + ov, P[F2].y - 0.92 * P[F2].s], wo, 'A']; O[F2].R = [[P[F2].x + 0.07 * P[F2].s - ov, P[F2].y - 0.88 * P[F2].s], wo, 'A']; }
    }
    O[NEC].R = [hed, 1, 'A'];
  }
  // ——— el öpme: Kerem sol eliyle Hikmet'in elini tutar ———
  if (id === 'sayac') { const w = pIn(t, tm.el0 + 0.15, tm.el0 + 2.15, 0.3); if (w > 0.005) { const kh = H.eklem(KIM[KER], P[KER], 'head'); O[KER].L = [[kh[0] - 14, kh[1] + 0.62 * P[KER].s * (1 - 0.35 * alin)], w, 'A']; if (w > 0.9) tutan.push([KER, 'L']); } }
  // ——— ipucu: Necmi (sol) – Kerem (sağ) el sıkışır ———
  const s8 = elSik(t, KER, NEC, P[KER], P[NEC], tm.elini - 0.4, tm.elini - 0.05, tm.n1s + 0.35, [tm.elini - 0.05, tm.sik + 0.5]);
  if (s8 && (id === 'ipucu' || id === 'sayac')) { O[KER].R = [s8.a, s8.w, 'A']; O[NEC].L = [s8.b, s8.w, 'A']; if (s8.tut) tutan.push([NEC, 'L'], [KER, 'R']); }
  // ——— cevap: uzaktan selamlar (kurdele a'dan b'ye uçar) ———
  if (id === 'cevap') {
    for (const [ad, a, sa, b, sb] of [['r9', F1, 'L', F3, 'R'], ['r10', DEF, 'R', KER, 'L'], ['r11', F3, 'R', NEC, 'R']]) {
      const k = S.kur.find(q => q.tk === tm[ad]);
      for (const [i, sd] of [[a, sa], [b, sb]]) { const s = selam(i, P[i], sd, t, k.tk - k.d - 0.3, k.tk + 0.45); if (s) O[i][sd] = s; }
    }
  }

  // ——— çizim: kişiler → kurdeleler → rozetler → nesneler → tutan eller ———
  const R = []; for (const i of CIZ_SIRA) R[i] = oyna(K, t, tl, KIM[i], P[i], O[i]);
  for (const k of S.kur) {
    if (t < k.tk - k.d) continue;
    const u = clamp01((t - (k.tk - k.d)) / k.d), ue = ease.state(u);
    const yol = kurdeleYolu(roz[k.a], roz[k.b], k.sag, k.i === 0 ? tutKur : null);
    if (k.mod === 'orta') kurdele(K, yol, 0.5 - 0.5 * ue, 0.5 + 0.5 * ue, k.renk);
    else kurdele(K, yol, 0, ue, k.renk);
  }
  const mercanAc = id === 'cevap' || id === 'espri' || id === 'cta' || t >= tm.end;
  const acSira = [1, 2, 0, 3, 4, 5, 6];   // "Buldum!"da rozetler Defne'den başlayarak sırayla döner
  const artilar = [];
  P.forEach((p, i) => {
    const ac = tm.buldum + 0.12 + acSira[i] * 0.06;
    if (t < ac + 0.13) {           // arka yüz: rakam yok
      let kab = 0; for (const [tt] of S.iz[i]) if (tt > -50 && tt < ac) { kab += H.nabiz(t, tt, 0.34); const k = S.kur.find(q => q.tk === tt && (q.a === i || q.b === i)); const es = k ? (k.a === i ? k.b : k.a) : i; artilar.push([roz[i], tt, XS[es] > XS[i] ? -1 : 1]); }
      rozet(K, roz[i], 0, { don: t >= ac ? seg(t, ac, 0.26) : 0, kab, arka: true });
      return;
    }
    const { v, a: a0 } = degerAt(S, i, t), a = a0 < ac ? ac : a0;
    const don = seg(t, a, 0.26), gos = a0 < ac || don >= 0.5 ? v : Math.max(0, v - 1);
    let tek = 0;
    if (mercanAc && gos % 2) {
      const sira = KIM.map((_, j) => j).filter(j => degerAt(S, j, tm.cevap).v % 2).indexOf(i);
      tek = sira >= 0 && a < tm.cevap ? ease.state(seg(t, tm.olamaz + 0.04 + sira * 0.07, 0.25)) : (t >= a + 0.13 ? 1 : 0);
    }
    const kab = H.nabiz(t, a, 0.34) + (mercanAc && gos % 2 ? H.nabiz(t, tm.tekS + 0.25, 0.34) : 0);
    rozet(K, roz[i], gos, { don: don < 1 ? don : 0, tek, kab });
  });
  for (const [q, tt, yan] of artilar) arti(K, q, t, tt, yan);
  // defter + şerit
  const dh = R[HIK].handL;
  serit(K, dh[0], dh[1] + 6, seritL);
  defter(K, dh[0], dh[1] + 4, { k: dfK, cizik: dfCizik, alti: dfAlti });
  S._defter = id === 'cevap' ? [dh[0], dh[1] + 4, dfK] : null;
  tutan.push([HIK, 'L']);
  // kalem
  kalem(K, R[HIK].handR, id === 'sayac' ? -1.1 : -0.45);
  tutan.push([HIK, 'R']);
  // tabak
  const th = R[F1].handL;
  tabak(K, th[0] + (id === 'cta' ? 14 : 4), th[1] - 10, dSeker ? 5 : 6);
  tutan.push([F1, 'L']); if (id === 'cta' && O[F1].R) tutan.push([F1, 'R']);
  if (dSeker) { const h = R[DEF].handL; K.ctx.save(); K.ctx.translate(h[0] - 4, h[1] - 34); K.ctx.rotate(-0.25); K.ctx.scale(1.5, 1.5); seker(K, 0, 0, PAL.mustard); K.ctx.restore(); tutan.push([DEF, 'L']); }
  // kolonya ve damlalar
  const nh = R[NEC].handR;
  kolonya(K, [nh[0] + 2, nh[1] - 4], kolA);
  tutan.push([NEC, 'R']);
  if (damlaU) {
    const agiz = [nh[0] + 2 + Math.sin(kolA) * 60, nh[1] - 4 - Math.cos(kolA) * 60];
    for (let j = 0; j < 3; j++) { const u = ((t - tm.kol[0]) * 2.2 + j / 3) % 1; H.damla(K, agiz[0] + 4, lerp(agiz[1] + 6, 990, u * u), 5, '#F2E7B8'); }
  }
  // kurdele tutan Defne
  if (tutKur && tutKur[1] > 0.5) tutan.push([DEF, 'L']);
  for (const [i, sd] of tutan) R[i].tut(sd);
  if (dIs) R[DEF].isaret('R', dIs);
  if (dParmak > 0) R[DEF].parmak('R', dParmak, { toplam: 4, ac: 0.4 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', P[DEF], 'head'), { son: tm.proof, k: P[DEF].s / 245 * 1.25 });
}
