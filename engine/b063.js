// Bölüm 63 · SON VAPUR: SİMİT VERGİSİ (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_063_v5.md).
// Mekanizma: 2'nin fazlası her iskelede yarıya iner (130 → 66 → 34 → 18 → 10 → 6 → 4 → 3).
// Logline: Gece vapurunda Kaptan Rıza her iskelede Simitçi Lâl'in tablasındaki simitlerin yarısını "vergi" diye sepetine alır,
// vicdanı sızlar, birini geri koyar. Yedi iskele sonra tablada üç simit kalır. Lâl yola kaç simitle çıkmıştı?
// Akılda kalacak tek şey: iki simit hiç değişmez; fazlası her iskelede yarıya iner.
// Sızıntı yasağı: başlangıç yığını sayılamaz (üst üste yığın), ara sayılar gösterilmez, yalnız son durum (3 simit) nettir.
// Seri çekirdeği (kadro, vapur manzarası, kart, sayaç) engine/b053.js'ten import edilir; o dosyaya yazılmaz.
// Her kare t'nin saf fonksiyonudur; Math.random yok (yığın yerleşimi tohumlu üreteçle); anlar kelime çapalarından okunur.
import * as H from './hikaye.js';
import { SV, svKisi, svOyna, rizaUst, lalUst, lalTepsi, simit, bardak, boraTepsi, svManzara, svGuverte, svKart, svSayac, yalpa, UFUK } from './b053.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Mantık (build anında denetlenir) ═══════════════════════════
export const ISKELE = ['Beşiktaş', 'Ortaköy', 'Arnavutköy', 'Bebek', 'Kandilli', 'Emirgan', 'Sarıyer'];
export function zincir(n0 = 130, k = 7) {
  const z = [n0];
  for (let i = 0; i < k; i++) { const n = z[z.length - 1]; if (n % 2) throw new Error(`b063: ${i + 1}. iskelede ${n} tek, simit bölünemez`); z.push(n / 2 + 1); }
  return z;
}
const ZINCIR = zincir();
if (ZINCIR.join() !== '130,66,34,18,10,6,4,3') throw new Error('b063: zincir yanlış ' + ZINCIR.join());
// Tek çözüm denetimi: 7 iskele sonra 3 kalan başka başlangıç yok (geri sarım: n = 2(m − 1))
{ let m = 3; for (let i = 0; i < 7; i++) m = 2 * (m - 1); if (m !== 130) throw new Error('b063: geri sarım 130 vermiyor'); }

// ═══════════════════════════ Ölçüler ═══════════════════════════
const RIZA_X = 300, LAL_X = 690, BORA_X = 1030, BABA_X = 478;
const BABA_UST = 1250;                 // babanın (bağlama demiri) üstü; sepet bunun üstünde
const SEPET = { x: BABA_X, y: 1176, rx: 78, ry: 20, h: 72 };   // sepetin ağzı (elips merkezi) ve gövde boyu
const PIER = 950;                      // iskeleler arası (montajda)
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const ln = Math.log;

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    h1: T('h1'), yarisi: T('h1:3'), vergi: T('h1:5'), h1s: T('h1>'),
    d1: T('d1'), kaptan: T('d1:2'), bicim: T('d1:5'), d1s: T('d1>'),
    h2a: T('h2a'), etme: T('h2a:1'), birini: T('h2a:2'), geri: T('h2a:3'), veririm: T('h2a:4'), ben: T('h2a:5'), h2as: T('h2a>'),
    h2b: T('h2b'), bana: T('h2b:6'), sana: T('h2b:8'), h2bs: T('h2b>'),
    d2: T('d2'), uc: T('d2:4'), d2s: T('d2>'),
    h3: T('h3'), kac: T('h3:4'), h3s: T('h3>'),
    dd: T('dd'), kaptan2: T('dd:3'), tabla: T('dd:5'), doluydu: T('dd:6'), dds: T('dd>'),
    n1: T('n1'), iki: T('n1:1'), olsa: T('n1:3'), hic: T('n1:5'), kar: T('n1:6'), etmez: T('n1:7'), n1s: T('n1>'),
    d4: T('d4'), d6: T('d6'),
  };
  tm.kesVergi = tm.h2a - 0.1;
  tm.kesMontaj = tm.h2b - 0.1;
  tm.kesYorgun = tm.d2 - 0.1;
  tm.kesSoru = tm.h3 - 0.1;
  tm.kesSayac = cd0 - 0.05;
  tm.kesBora = cd0 + 4.4; tm.kesSayac2 = tm.kesBora + 1.45;
  tm.kesIpucu = tm.n1 - 0.12;
  tm.cta = tm.d6 - 0.15;
  // ——— vergi döngüsü (1. iskele, elle) ———
  tm.al1 = tm.etme + 0.06;               // avuç yığından kalkar (yarısı)
  tm.sepete1 = tm.al1 + 0.62;            // sepete bırakır
  tm.tek = tm.geri - 0.18;               // sepetten bir simit alır
  tm.koy = tm.veririm + 0.25;            // tablaya geri koyar
  // ——— montaj: iskeleler 2…7; her iskele 0,38 sn'de gelir, 0,3 sn durur; duruşta Rıza avuçlar ———
  tm.mont = [];
  for (let k = 2; k <= 7; k++) tm.mont.push(tm.kesMontaj + 0.12 + (k - 2) * 0.68);
  tm.dur = tm.mont.map(m => m + 0.38);   // duruş anı = avuçlama anı
  // ——— sayaç ———
  tm.say = [cd0 + 1.2, cd0 + 2.0, cd0 + 2.8];   // Lâl simitlere tek tek dokunur
  tm.sepeteBak = tm.kesSayac2 + 0.6;            // Lâl Rıza'nın sepetine bakar, sepeti gösterir
  tm.geriTabla = tm.kesSayac2 + 2.3;
  // ——— ipucu: Rıza bir simidin üstünü avucuyla kapatır (iki kalır), ikinciyi kaldırıp geri koyar ———
  tm.kapa = tm.n1 - 0.2; tm.ac = tm.hic - 0.2; tm.kaldir = tm.kar - 0.05; tm.indir = tm.etmez + 0.15;

  const z = ZINCIR;
  // Tablanın yığın sayısı (tek kaynak): 130 → (avuç) 65 → (geri) 66 → montaj 34 … 4 → 3
  tm.nKeys = [[0, z[0]], [tm.al1, 65], [tm.koy, z[1]], ...tm.dur.map((d, i) => [d, z[i + 2]])];

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.36, 520, 1015], [tm.h1s - 0.2, 1.38, 528, 1018], [tm.d1, 1.4, 575, 1025]] },
    { id: 'vergi', t0: tm.kesVergi, cam: [[0, 1.44, 590, 1100], [tm.h2as, 1.46, 594, 1102]] },
    { id: 'montaj', t0: tm.kesMontaj, cam: [[0, 1.3, 560, 1020], [tm.h2bs, 1.32, 565, 1018]] },
    { id: 'yorgun', t0: tm.kesYorgun, cam: [[0, 1.44, LAL_X, 1100], [tm.d2s, 1.46, LAL_X, 1102]] },
    { id: 'soru', t0: tm.kesSoru, cam: [[0, 1.38, 410, 1015], [tm.h3s - 0.1, 1.4, 405, 1015], [tm.dd - 0.15, 1.34, 560, 1020]] },
    { id: 'sayac', t0: tm.kesSayac, cam: [[0, 1.3, 600, 1030]] },
    { id: 'bora', t0: tm.kesBora, kisa: true, cam: [[0, 1.42, BORA_X - 40, 1070]] },
    { id: 'sayac2', t0: tm.kesSayac2, cam: [[0, 1.36, 630, 1050]] },
    { id: 'ipucu', t0: tm.kesIpucu, cam: [[0, 1.4, 545, 1030], [tm.n1s, 1.43, 550, 1032]] },
    { id: 'buldum', t0: tm.buldum - 0.05, cam: [[0, 1.35, LAL_X, 1040]] },
    { id: 'cevap', t0: tm.d4 - 0.1, cam: [[0, 1.3, 560, 1020], [tm.cta, 1.34, 600, 1030]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— Rıza (önden) ———
  const rizBase = svKisi('b053_riza', { x: RIZA_X, expr: 'mutlu', head: { tilt: 4, look: [0.85, 0.5] }, ...POZ.dur });
  const riz = [
    [tm.d1, { expr: 'notr', head: { tilt: -3, look: [0.9, 0.2] } }, 0.3],
    [tm.kesVergi, { expr: 'mutlu', head: { tilt: 5, look: [0.85, 0.55] } }, 0.01],
    [tm.ben, { expr: 'mutlu', head: { tilt: -5, look: [0.4, -0.1] } }, 0.3],
    [tm.kesMontaj, { expr: 'mutlu', head: { tilt: 3, look: [0.8, 0.5] } }, 0.01],
    [tm.kesSoru, { expr: 'mutlu', head: { tilt: 4, look: [0.9, 0.1] } }, 0.01],
    [tm.kac, { expr: 'mutlu', head: { tilt: -4, look: [0.9, 0.2] } }, 0.3],
    [tm.dd, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.25] } }, 0.3],
    [tm.kesSayac, { expr: 'mutlu', ...POZ.belde, head: { tilt: 3, look: [0.7, 0.5] } }, 0.01],
    [tm.kesIpucu, { expr: 'mutlu', armL: POZ.dur.armL, head: { tilt: 4, look: [0.8, 0.6] } }, 0.01],
    [tm.n1s + 0.1, { expr: 'mutlu', head: { tilt: -4, look: [0.9, 0.1] } }, 0.35],
    [tm.buldum - 0.05, { expr: 'saskin', head: { tilt: -4, look: [0.9, 0.1] } }, 0.25],
    [tm.d4 - 0.1, { expr: 'saskin', head: { tilt: 3, look: [0.9, 0.2] } }, 0.01],
  ];
  // ——— Lâl (önden, tabla boynunda) ———
  const lalBase = svKisi('b053_lal', { x: LAL_X, expr: 'saskin', head: { tilt: -3, look: [-0.5, 0.75] }, ...POZ.dur });
  const lal = [
    [tm.d1 - 0.2, { expr: 'saskin', head: { tilt: -5, look: [-0.9, 0.0] } }, 0.25],
    [tm.bicim, { expr: 'korku', head: { tilt: 4, look: [-0.9, 0.1] } }, 0.3],
    [tm.kesVergi, { expr: 'saskin', head: { tilt: -3, look: [-0.4, 0.8] } }, 0.01],
    [tm.birini, { expr: 'yorgun', head: { tilt: 4, look: [-0.6, 0.7] } }, 0.3],
    [tm.ben, { expr: 'yorgun', head: { tilt: -2, look: [-0.9, 0.0] } }, 0.3],
    [tm.kesMontaj, { expr: 'saskin', head: { tilt: -4, look: [-0.3, 0.8] } }, 0.01],
    [tm.dur[2], { expr: 'korku', head: { tilt: 3, look: [-0.5, 0.75] } }, 0.25],
    [tm.dur[4], { expr: 'yorgun', head: { tilt: 5, look: [-0.2, 0.85] } }, 0.25],
    [tm.kesYorgun, { expr: 'yorgun', head: { tilt: 6, look: [-0.1, 0.9] } }, 0.01],
    [tm.uc - 0.1, { expr: 'yorgun', head: { tilt: 3, look: [0.1, 0.25] } }, 0.4],
    [tm.kesSoru, { expr: 'yorgun', head: { tilt: -3, look: [-0.9, 0.1] } }, 0.01],
    [tm.dd, { expr: 'notr', head: { tilt: 4, look: [-0.8, 0.0] } }, 0.3],
    [tm.tabla, { expr: 'yorgun', head: { tilt: -3, look: [-0.2, 0.7] } }, 0.3],
    [tm.kesSayac, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 5, look: [-0.2, 0.85] } }, 0.01],
    [tm.say[2] + 0.6, { expr: IFADE.dusun2, head: { tilt: -4, look: [0.3, -0.5] } }, 0.35],
    [tm.kesSayac2, { expr: IFADE.dusun, armR: POZ.dur.armR, head: { tilt: 4, look: [-0.85, 0.5] } }, 0.01],
    [tm.geriTabla, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 6, look: [-0.1, 0.85] } }, 0.4],
    [tm.kesIpucu, { expr: IFADE.dusun, armR: POZ.dur.armR, head: { tilt: 4, look: [-0.5, 0.8] } }, 0.01],
    [tm.n1s + 0.2, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 6, look: [-0.2, 0.7] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.1, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.d4 - 0.1, { expr: 'mutlu', ...POZ.dur, head: { tilt: -4, look: [-0.8, 0.1] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: -5, look: [0.05, 0.05] } }, 0.3],
  ];
  // ——— Bora (önden, konuşmaz; askılı çay tepsisi) ———
  const borBase = svKisi('b053_bora', { x: BORA_X, expr: 'notr', head: { tilt: -4, look: [-0.8, 0.3] }, ...POZ.dur });
  const bor = [
    [tm.kesBora, { expr: 'notr', head: { tilt: 5, look: [-0.2, 0.8] } }, 0.01],
    [tm.kesBora + 0.75, { expr: 'notr', head: { tilt: -4, look: [-0.9, 0.3] } }, 0.3],
  ];
  return { tm, film, rizBase, riz, lalBase, lal, borBase, bor };
}

// ═══════════════════════════ Dünyanın durumu ═══════════════════════════
// Tablada kaç simit var (yığın boyu bundan); geçiş 0,16 sn
function yiginN(S, t) {
  const K = S.tm.nKeys; let n = K[0][1], once = n, a = -9;
  for (const [tk, v] of K) if (t >= tk) { once = n; n = v; a = tk; }
  const u = ease.state(seg(t, a, 0.16));
  return { n, gor: lerp(once, n, u) };
}
// Sepetteki pay (0..1 → yığın boyu)
function sepetDolu(S, t) { const { gor } = yiginN(S, t); return clamp01((130 - gor) / 127); }
// İskele şeridinin kayması: kancada 1. iskele sağdan yanaşır; montajda her iskele 0,38 sn'de gelir
function serit(S, t) {
  const { tm } = S;
  let off = -420 * (1 - ease.state(seg(t, 0, 1.7)));
  tm.mont.forEach(m => { off += PIER * ease.state(seg(t, m, 0.38)); });
  off += 1150 * ease.state(seg(t, tm.kesYorgun + 0.2, 2.6));   // "Yedi iskele geçti": vapur Sarıyer'den ayrılır, levha kadrajdan çıkar
  return off;
}

// ═══════════════════════════ Çizim parçaları ═══════════════════════════
// Yığın: (cx, cy) tablanın üst yüzü, n simit. Sayılamaz: simitler üst üste, görünen adet n'e eşit değildir.
const YIGIN = (() => {
  const r = H.mulberry32(6301), L = [];
  for (let i = 0; i < 70; i++) { const uy = Math.pow(r(), 1.25), lim = Math.sqrt(Math.max(0.02, 1 - uy * uy)); L.push([(r() * 2 - 1) * lim, uy, r()]); }
  return L.sort((a, b) => a[1] - b[1] || a[2] - b[2]);
})();
function yigin(K, cx, cy, s, n, { k = 1 } = {}) {
  if (n <= 0.5) return;
  const m = Math.sqrt(clamp01(n / 130)), bw = 0.5 * s * lerp(0.5, 1.2, m) * k, hh = 0.5 * s * m * k;
  const nd = Math.round(24 + 46 * m);
  for (let i = 0; i < nd && i < YIGIN.length; i++) {
    const [ux, uy, w] = YIGIN[i];
    simit(K, cx + ux * bw, cy + 0.02 * s - uy * hh + (w - 0.5) * 0.05 * s, s, 0.95 * k);
  }
}
// Son durum: üç simit, tablanın arka sırasında yan yana (net). kalk: [i, dy] bir simidi kaldırır
// Lâl tablayı göğsünde tutar (seri lalTepsi'nin göğüs hizası kopyası; askı boynunda). Altyazı bandının üstünde kalsın diye.
const TABLA_YUK = 0.24;
function lalTabla(K, p) {
  const key = 'b053_lal', c = H.CARDS[key], s = p.s, pl = H.eklem(key, p, 'pelvis');
  const cx = pl[0], cy = pl[1] - (0.24 + TABLA_YUK) * s, rx = 0.46 * s, ry = 0.12 * s, { ctx } = K;
  const shL = H.shoulder(key, p, 'L'), shR = H.shoulder(key, p, 'R');
  for (const [a, b] of [[[shL[0] + 0.03 * s, shL[1] - 0.02 * s], [cx - rx * 0.86, cy]], [[shR[0] - 0.03 * s, shR[1] - 0.02 * s], [cx + rx * 0.86, cy]]]) {
    K.line(a[0], a[1], b[0], b[1], 0.045 * s + LW, INK); K.line(a[0], a[1], b[0], b[1], 0.045 * s, c.tablaKoyu);
  }
  K.ell(cx, cy + 0.06 * s, rx, ry, c.tablaKoyu, LW * 0.8);
  K.ell(cx, cy, rx, ry, c.tabla, LW * 0.8);
  ctx.beginPath(); ctx.ellipse(cx, cy + 0.06 * s, rx, ry, 0, 0.05, Math.PI - 0.05); ctx.lineWidth = LW * 0.8; ctx.strokeStyle = INK; ctx.stroke();
  return { merkez: [cx, cy], rx, ry };
}
const UC_YER = [[-0.28, -0.02], [0.0, -0.05], [0.28, -0.02]];
function ucSimit(K, tab, s, { kalk = null } = {}) {
  UC_YER.forEach(([dx, dy], i) => {
    const up = kalk && kalk[0] === i ? kalk[1] : 0;
    simit(K, tab.merkez[0] + dx * s, tab.merkez[1] + dy * s - up, s, 1.42);
  });
}
// Bağlama demiri (baba) + hasır sepet; dolu 0..1
function babaSepet(K, s, dolu, onlyFront = false) {
  const { ctx } = K, { x, y, rx, ry, h } = SEPET;
  if (!onlyFront) {
    K.rect(x - 34, BABA_UST, 68, 1500 - BABA_UST, SV.demir, LW * 0.8, 8);
    K.ell(x, BABA_UST + 2, 48, 13, '#4A5654', LW * 0.7);
    K.ell(x, 1500, 56, 12, '#2E3634', LW * 0.6);
    // sepetin arka ağzı ve içi
    K.ell(x, y, rx, ry, '#7A5530', LW * 0.7);
    // sepetin içindeki yığın (dolu oldukça ağzından taşar)
    if (dolu > 0.01) yigin(K, x, y - 6, s, 130 * dolu + 8, { k: 1.05 });
  }
  // gövde (ön yüz): hasır örgü
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x - rx, y); ctx.lineTo(x - rx * 0.82, y + h); ctx.quadraticCurveTo(x, y + h + ry * 1.3, x + rx * 0.82, y + h); ctx.lineTo(x + rx, y);
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI, false); ctx.closePath();
  ctx.fillStyle = '#C08A4A'; ctx.fill(); ctx.clip();
  for (let i = 0; i < 4; i++) K.line(x - rx, y + 14 + i * 16, x + rx, y + 14 + i * 16 + 6, 3, '#9A6A34');
  for (let i = -5; i <= 5; i++) K.line(x + i * 15, y, x + i * 13, y + h + 20, 2.5, '#A87640');
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(x - rx, y); ctx.lineTo(x - rx * 0.82, y + h); ctx.quadraticCurveTo(x, y + h + ry * 1.3, x + rx * 0.82, y + h); ctx.lineTo(x + rx, y);
  ctx.lineWidth = LW * 0.8; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI); ctx.lineWidth = 9; ctx.strokeStyle = '#9A6A34'; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI); ctx.lineWidth = LW * 0.6; ctx.strokeStyle = INK; ctx.stroke();
}
// İskele binası ve levhası (yalpalayan dış dünyada): x merkez, i iskele dizini (0–6)
function iskeleCiz(K, t, x, i) {
  if (x < -500 || x > 1600) return;
  const { ctx } = K, B = UFUK + 20, w = 500, duvar = '#2A4443';
  for (let j = 0; j < 8; j++) K.rect(x - w / 2 + 20 + j * (w - 40) / 7, B - 6, 14, 40, SV.iskeleKoyu, LW * 0.5);
  for (let a = 0; a < 3; a++) { const wx = x - 140 + a * 140; for (let j = 0; j < 4; j++) { const yy = B + 40 + j * 22, o = 8 * Math.sin(t * 2.3 + a * 1.7 + j * 1.3 + i); K.line(wx - 14 + o, yy, wx + 14 + o, yy, 5 - j * 0.8, H.mixHex(SV.pencere, SV.deniz, 0.35 + j * 0.15)); } }
  K.rect(x - w / 2, B - 200, w, 200, duvar, LW);
  for (let a = 0; a < 3; a++) {
    const wx = x - 140 + a * 140;
    ctx.beginPath(); ctx.moveTo(wx - 36, B - 8); ctx.lineTo(wx - 36, B - 84); ctx.arc(wx, B - 84, 36, Math.PI, 0); ctx.lineTo(wx + 36, B - 8); ctx.closePath(); K.fs(SV.pencere, LW * 0.6);
    K.rect(wx - 24, B - 182, 48, 56, H.mixHex(SV.pencere, duvar, 0.25), LW * 0.5, 4);
  }
  K.poly([[x - w / 2 - 24, B - 200], [x - w / 2 + 40, B - 236], [x + w / 2 - 40, B - 236], [x + w / 2 + 24, B - 200]], SV.cati, LW);
  // levha: numara rozeti + ad (tr-TR büyük harf)
  const ly = B - 278, yazi = K.up(ISKELE[i]); x += 70;
  ctx.font = '900 56px Rubik'; const tw = ctx.measureText(yazi).width, lw = tw + 56 + 96;
    K.rect(x - lw / 2, ly - 48, lw, 80, SV.levha, LW, 10);
  K.circ(x - lw / 2 + 52, ly - 8, 30, PAL.mustard, LW * 0.7);
  K.text(String(i + 1), x - lw / 2 + 52, ly + 12, 46, INK, 900);
  K.text(yazi, x + 44, ly + 12, 56, SV.levhaYazi, 900);
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => { cizCerceve(K, t, ep, tl, S); ipucuKalir(K, t, tl, S); };
// Cevapsız sürüm "Buldum!"dan 0,12 sn önce kesilir; ipucu cümlesi son karede de okunur kalsın diye n1 balonu kesime kadar tam opak çizilir.
function ipucuKalir(K, t, tl, S) {
  const l = tl.lines.find(x => x.id === 'n1'), d3 = tl.lines.find(x => x.id === 'd3');
  if (t < l.t1 + 0.1 || t >= d3.t0 - 0.04 || t >= S.tm.end) return;
  // altyazı ile aynı kuyruk ve yer (H.altyazi'nin kuralı): balon kaymasın, iki kopya üst üste aynı yerde dursun
  let hd = S._son && S._son.heads.hikmet ? S._son.ekr(S._son.heads.hikmet) : null;
  if (hd) hd = hd[1] < -200 || hd[1] > 1250 ? null : [Math.min(1300, Math.max(-220, hd[0])), hd[1]];
  H.caption(K, { line: l, text: l.text, age: 5, left: 5 }, { y: 1255, head: hd });
}
const cizCerceve = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  kartSon: -1,
  split: { d4: 7 },
  kamera(cam, t, B) {
    // sayaç boyunca yavaş, doğrusal itme: odak üç simitlik tabla (kesmenin iki yanında da aynı çizgide sürer)
    const id = B.sc.id, { tm } = S;
    if (id === 'sayac' || id === 'sayac2') {
      const u = clamp01((t - tm.kesSayac) / (tm.cd + 0.3 - tm.kesSayac));
      cam.zoom = Math.exp(lerp(ln(1.3), ln(1.46), u)); cam.cx = lerp(600, 660, u); cam.cy = lerp(1030, 1085, u);
    }
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); S._son = { ekr: B.ekr, heads: B.heads }; },
  ekran(K, t, B) {
    const { tm } = S;
    svKart(K, t, ep, { kapak: '', donus: -1, son: tm.proof });
    svSayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10, yazi: 'KAÇ SİMİT?', y: 1250 });
  },
});

// ═══════════════════════════ sahne (dünya) ═══════════════════════════
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, { ctx } = K;
  // ——— dış dünya: gök, uzak kıyı, deniz (seri manzarası), iskele şeridi ———
  svManzara(K, t, { yer: 1.9 + 0.004 * t, safak: 0 });
  const y = yalpa(t), off = serit(S, t);
  ctx.save(); ctx.translate(540, UFUK); ctx.rotate(y.a); ctx.translate(-540, -UFUK + y.dy);
  for (let i = 0; i < 7; i++) iskeleCiz(K, t, 600 + i * PIER - off, i);
  ctx.restore();
  svGuverte(K, t, { bank: [-900, -760], fenerler: [40, 1180] });

  // ——— pozlar önce (Rıza'nın eli tablaya gider; tabla Lâl'in pozundan) ———
  const lp = H.poseAt(H.CARDS.b053_lal, S.lalBase, S.lal, t); lp.y -= H.buldumHop(t, tm.buldum);
  if (id === 'kanca') lp.x += 26 * pIn(t, tm.d1 + 0.1, tm.d1s + 0.3, 0.35);   // "Yarısı mı?": tablayı geri çeker
  if (id === 'soru' && t >= tm.dd) H.omuzSilk(lp, t, tm.dd + 0.05, 0.5);
  const ls = lp.s, lpl = H.eklem('b053_lal', lp, 'pelvis'), tab = { merkez: [lpl[0], lpl[1] - (0.24 + TABLA_YUK) * ls] };
  const [tx, ty] = tab.merkez;
  const rp = H.poseAt(H.CARDS.b053_riza, S.rizBase, S.riz, t);
  const N = yiginN(S, t);
  const sepAgiz = [SEPET.x + 6, SEPET.y - 18];
  const yiginUst = [tx - 34, ty - 0.5 * ls * Math.sqrt(N.gor / 130) * 0.7];   // avucun yığına daldığı yer
  const ro = { heads }, rest = [RIZA_X + 108, 1300];
  let avuc = null, tekSimit = null, rTut = false, rIsaret = null, rKapa = null, kalk = null;

  if (id === 'kanca') {
    // kare 0: el yığına uzanmış (w 0,72); 0,3 sn'de yığının üstüne varır; "Vergi"de iki kez dokunur; "Yarısı mı?"da çekilir
    const w = lerp(0.72, 1, W(t, 0.3, 0.4)) * (1 - W(t, tm.d1 + 0.05, 0.35));
    const tap = 14 * (H.nabiz(t, tm.vergi - 0.05, 0.2) + H.nabiz(t, tm.vergi + 0.2, 0.2));
    ro.R = [[tx - 70, ty - 96 + tap], w, 'A'];
    if (w > 0.5) rIsaret = [tx - 40, ty - 70 + tap];
  }
  if (id === 'vergi') {
    const hover = [tx - 92, ty - 120];
    const p = H.iz([[0, rest], [tm.kesVergi + 0.05, hover, 0.3], [tm.al1 - 0.28, yiginUst, 0.26],
      [tm.al1 + 0.02, sepAgiz, tm.sepete1 - tm.al1 - 0.02, ease.state, 60],
      [tm.tek - 0.22, [SEPET.x - 10, SEPET.y - 34], 0.2],
      [tm.tek + 0.02, [tx + 34, ty - 30], tm.koy - tm.tek - 0.02, ease.state, 70],
      [tm.koy + 0.12, [RIZA_X + 30, 1110], 0.4]], t);
    ro.R = [p, 1, 'A'];
    if (t >= tm.al1 && t < tm.sepete1) { avuc = p; rTut = true; }
    if (t >= tm.tek && t < tm.koy) { tekSimit = p; rTut = true; }
    if (t >= tm.al1 - 0.04 && t < tm.al1) rTut = true;
  }
  if (id === 'montaj') {
    // her duruşta: avuç yığına, avuçla sepete, geri
    const hover = [tx - 80, ty - 120];
    let p = hover;
    for (const d of tm.dur) {
      const a = d - 0.15, ph = t - a;
      if (ph >= 0 && ph < 0.68) {
        if (ph < 0.15) p = kar(hover, yiginUst, ease.state(ph / 0.15));
        else if (ph < 0.4) { p = H.yay(yiginUst, sepAgiz, ease.state((ph - 0.15) / 0.25), 40); avuc = p; rTut = true; }
        else p = kar(sepAgiz, hover, ease.state((ph - 0.4) / 0.28));
      }
    }
    if (t < tm.dur[0] - 0.15) p = kar(rest, hover, W(t, tm.kesMontaj, 0.15));
    if (t >= tm.dur[5] + 0.53) p = kar(hover, rest, W(t, tm.dur[5] + 0.53, 0.35));
    ro.R = [p, 1, 'A'];
  }
  if (id === 'soru') {
    // "Söyle bakalım": eli dolu sepette; "kaç"ta Lâl'in tablasını gösterir
    const w1 = pIn(t, tm.kesSoru + 0.1, tm.kac - 0.25, 0.3), w2 = pIn(t, tm.kac - 0.2, tm.h3s + 0.3, 0.28);
    if (w1 > 0.01) { ro.R = [[SEPET.x - 20, SEPET.y - 26 - 6 * H.nabiz(t, tm.h3 + 0.5, 0.25)], w1, 'A']; if (w1 > 0.5) rTut = true; }
    if (w2 > 0.01) { ro.R = [[RIZA_X + 175, 1150], w2, 'A']; if (w2 > 0.5) rIsaret = [tx - 60, ty - 40]; }
  }
  if (id === 'sayac' || id === 'sayac2') {
    ro.R = [[SEPET.x - 30, SEPET.y - 22], 1, 'A']; rTut = true;   // eli sepetin kenarında
    H.glance(rp, t, tm.cd - 0.3, 9);
  }
  if (id === 'ipucu') {
    const s0 = [tx + UC_YER[0][0] * ls, ty + UC_YER[0][1] * ls], s1 = [tx + UC_YER[1][0] * ls, ty + UC_YER[1][1] * ls];
    const up = 54 * (W(t, tm.kaldir, 0.3) - W(t, tm.indir, 0.3));
    const p = H.iz([[0, rest], [tm.kapa - 0.25, [s0[0], s0[1] - 6], 0.28], [tm.ac, [s1[0], s1[1] - 8], 0.25],
      [tm.indir + 0.35, [RIZA_X + 30, 1110], 0.4]], t);
    const pp = t >= tm.ac + 0.2 && t < tm.indir + 0.35 ? [p[0], p[1] - up] : p;
    ro.R = [pp, 1, 'A'];
    if (t >= tm.kapa && t < tm.ac) rKapa = true;
    if (t >= tm.kaldir - 0.05 && t < tm.indir + 0.3) { kalk = [1, Math.max(0, up)]; rTut = true; }
  }
  if (id === 'cevap' || id === 'buldum') ro.R = [rest, 0, 'A'];

  // ——— Lâl ———
  const lo = { heads };
  let lIsaret = null;
  const TL = [tx - 0.44 * ls, ty + 6], TR = [tx + 0.44 * ls, ty + 6];
  if (id === 'kanca') {
    const w = pIn(t, tm.d1 + 0.05, tm.d1s + 0.3, 0.3);   // iki eliyle tablayı kavrar
    void w;
  }
  if (id === 'yorgun') {
    const w = pIn(t, tm.uc - 0.3, tm.d2s + 0.6, 0.3);
    if (w > 0.01) { lo.L = [kar(TL, [tx - 0.36 * ls, ty - 0.2 * ls], w), 1, 'B']; if (w > 0.5) lIsaret = [tx - 0.22 * ls, ty - 0.06 * ls]; }
  }
  if (id === 'soru' && t >= tm.tabla - 0.3) {
    // "Bir tabla doluydu": iki eli yana açılır, yığının boyunu çizer
    const w = W(t, tm.tabla - 0.25, 0.35);
    lo.L = [kar(TL, [tx - 0.62 * ls, ty - 0.55 * ls], w), 1, 'B']; lo.R = [kar(TR, [tx + 0.62 * ls, ty - 0.55 * ls], w), 1, 'B'];
  }
  if (id === 'sayac') {
    // simitlere tek tek dokunur (1, 2, 3)
    const dur = [[tm.say[0] - 0.6, [tx - 0.5 * ls, ty - 0.1 * ls]], ...UC_YER.map(([dx, dy], i) => [tm.say[i], [tx + dx * ls, ty + dy * ls - 22]])];
    const w = pIn(t, tm.say[0] - 0.7, tm.say[2] + 0.7, 0.3);
    if (w > 0.01) { const h = H.dokunYolu(t, dur, { yuksel: 30 }); lo.L = [kar(TL, [h[0] - 40, h[1] - 64], w), 1, 'B']; if (w > 0.5) lIsaret = h; }
  }
  if (id === 'sayac2') {
    // Rıza'nın dolu sepetine bakar, gösterir; sonra yine tablaya döner
    const w = pIn(t, tm.sepeteBak - 0.25, tm.geriTabla - 0.3, 0.3);
    if (w > 0.01) { lo.L = [kar(TL, [tx - 0.62 * ls, ty - 0.5 * ls], w), 1, 'B']; if (w > 0.5) lIsaret = [SEPET.x + 40, SEPET.y - 40]; }
  }

  // tablayı iki yanından tutar (boşta kalan el); düşünme pozunda sağ el çenede kalır
  const tutL = [TL, 1, 'B'], tutR = [TR, 1, 'B'];
  const dusunuyor = id === 'sayac' || (id === 'sayac2' && t >= tm.geriTabla - 0.2) || (id === 'ipucu' && t >= tm.n1s + 0.2);
  let lTut = false, rTutL = false;
  if (!lo.L && id !== 'buldum' && id !== 'cevap') { lo.L = tutL; lTut = true; }
  if (!lo.R && !dusunuyor && id !== 'buldum' && id !== 'cevap') { lo.R = tutR; rTutL = true; }
  // ——— çizim sırası: baba + sepet → Lâl + tabla + yığın → Rıza (kolu tablanın üstünden) → elde taşınan → tutan el → Bora ———
  babaSepet(K, ls, sepetDolu(S, t));
  const lc = svOyna(K, t, tl, 'b053_lal', lp, lo);
  lalTabla(K, lp);
  lalUst(K, lp);
  if (N.gor > 3.5) {
    yigin(K, tx, ty, ls, N.gor);
    if (t >= tm.koy && t < tm.dur[0]) simit(K, tx + 34, ty - 6, ls, 1.1);   // geri konan simit önde durur
  } else ucSimit(K, tab, ls, { kalk });
  if (lIsaret && (lo.L?.[1] ?? 0) > 0.5) lc.isaret('L', lIsaret);
  const yakin = (h, q) => Math.hypot(h[0] - q[0], h[1] - q[1]) < 30;
  if (lTut || (!lIsaret && yakin(lc.handL, TL))) lc.tut('L');
  if (rTutL || yakin(lc.handR, TR)) lc.tut('R');
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('b053_lal', lp, 'head'), { son: tm.proof, k: ls / 245 });

  const rc = svOyna(K, t, tl, 'b053_riza', rp, ro);
  rizaUst(K, rp);
  if (avuc) yigin(K, rc.handR[0] + 6, rc.handR[1] + 30, ls, 36, { k: 0.8 });
  if (tekSimit) simit(K, rc.handR[0], rc.handR[1] + 12, ls, 1.1);
  if (rIsaret && !rTut) rc.isaret('R', rIsaret);
  if (rTut || rKapa) rc.tut('R');

  // ——— Bora: sağda; insert'te kaşıkla çay karıştırır, buhar döngüsü ———
  const bp = H.poseAt(H.CARDS.b053_bora, S.borBase, S.bor, t), bo = { sessiz: true };
  const bL = H.shoulder('b053_bora', bp, 'L');
  const tepsiEl = [bL[0] - 70, bL[1] - 30];
  bo.L = [tepsiEl, 1, 'B'];
  const bard = [tepsiEl[0] + 30, tepsiEl[1] + 118 + 4];
  let kasik = null;
  if (id === 'bora' || id === 'sayac' || id === 'sayac2') {
    const a = TAU * (t - tm.kesBora) / 0.7, kc = [bard[0] + 7 * Math.cos(a), bard[1] - 62 + 3 * Math.sin(a)];
    const w = id === 'bora' ? 1 : pIn(t, tm.kesBora - 0.5, tm.kesSayac2 + 0.6, 0.3);
    if (w > 0.01) { bo.R = [[kc[0] + 8, kc[1] - 26], w, 'A']; if (w > 0.6) kasik = kc; }
  }
  const bc = svOyna(K, t, null, 'b053_bora', bp, bo);
  boraTepsi(K, bc.handL, [[-30, true], [30, true]]);
  H.buhar(K, bc.handL[0] - 30, bc.handL[1] + 70, t, { k: 0.55, n: 2 });
  H.buhar(K, bc.handL[0] + 30, bc.handL[1] + 70, t + 0.8, { k: 0.55, n: 2 });
  bc.tut('L');
  if (kasik) { K.line(bc.handR[0], bc.handR[1] + 6, kasik[0], kasik[1] + 30, 4.5, '#B9BDB3'); bc.tut('R'); }
}
