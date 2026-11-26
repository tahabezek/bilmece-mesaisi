// Bölüm 69 · ADIM YARIŞMASI (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_069_v5.md).
// Mekanizma: Defne'nin sırası ile Necmi'nin sütununun kesiştiği koltuk (en azların en çoğu ≤ o kişi ≤ en çokların en azı).
// Logline: Eğitim salonunda on iki kişi üç sıra, dört sütun oturur; herkesin adım sayısı farklıdır ve kimse kimsenin sayısını
// görmez. Her sıranın en az adım atanı kalkar: en çoğu Defne'dir. Her sütunun en çok adım atanı kalkar: en azı Necmi'dir.
// Akılda kalacak tek şey: bir sıra ile bir sütun tek bir koltukta buluşur.
// Sızıntı yasağı: adım sayıları hiçbir yerde çizilmez (ADIM tablosu yalnız kimin kalkacağını hesaplar); sıra ve sütun bantları
// hep üçü ya da dördü birden, aynı renk ve aynı sürede gelir; kesişim koltuğundaki figüran öbür figüranlarla aynı işi yapar
// (ona yakın plan, bakış, bant yok; "Buldum!"dan önce). Figüranların boyu ve yapısı eşittir.
// Plânlar: (1) salon, önden: üç basamaklı sıra, solda merdivende Hikmet; (2) sıra arkadaşıyla ikili yakın plân (Defne + yanındaki,
// Kerem + Necmi): kamera sıranın hizasına iner, arkada yalnız duvar ve pencere kalır; (3) Hikmet'in tekli plânı.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180;

// ═══════════════════════════ Oturma düzeni (şartlar: değişmez) ═══════════════════════════
// ADIM[sıra][sütun]: bugünkü adım sıralaması (1 en az, 12 en çok). Ekranda HİÇ görünmez; yalnız kalkanları hesaplar.
// Sıra 1 öndedir (ekranda en altta), sütun 1 ekranın solundadır.
const ADIM = [[5, 9, 10, 7], [11, 1, 3, 8], [2, 12, 4, 6]];
const KIM = [['defne', 'b069_f1', 'b069_f2', 'b069_f3'], ['b069_f4', 'b069_f5', H.KEREM, 'necmi'], ['b069_f6', 'b069_f7', 'b069_f8', 'b069_f9']];
const NS = ADIM.length, NC = ADIM[0].length;
const TUR1 = ADIM.map((sira, r) => [r, sira.indexOf(Math.min(...sira))]);                                   // her sıranın en az adım atanı
const TUR2 = ADIM[0].map((_, c) => { const st = ADIM.map(s => s[c]); return [st.indexOf(Math.max(...st)), c]; });   // her sütunun en çok adım atanı
const yerOf = key => { for (let r = 0; r < NS; r++) { const c = KIM[r].indexOf(key); if (c >= 0) return [r, c]; } throw new Error('b069: koltuk yok: ' + key); };
const DEF = yerOf('defne'), NEC = yerOf('necmi'), KER = yerOf(H.KEREM), KESISIM = [DEF[0], NEC[1]];
(function denetle() {
  const es = (a, b) => a[0] === b[0] && a[1] === b[1], yaz = l => l.map(([r, c]) => `${r + 1},${c + 1}`).join(' '), ad = ([r, c]) => ADIM[r][c], hata = [];
  if ([...new Set(ADIM.flat())].sort((a, b) => a - b).join() !== '1,2,3,4,5,6,7,8,9,10,11,12') hata.push('sıralama 1–12 ve hepsi farklı olmalı');
  if (yaz(TUR1) !== '1,1 2,2 3,1') hata.push('birinci tur: ' + yaz(TUR1));
  if (yaz(TUR2) !== '2,1 3,2 1,3 2,4') hata.push('ikinci tur: ' + yaz(TUR2));
  if (!es(TUR1.reduce((a, b) => ad(a) > ad(b) ? a : b), DEF)) hata.push('en azların en çoğu Defne değil');
  if (!es(TUR2.reduce((a, b) => ad(a) < ad(b) ? a : b), NEC)) hata.push('en çokların en azı Necmi değil');
  if (!es(DEF, [0, 0]) || !es(NEC, [1, 3])) hata.push('Defne (1,1), Necmi (2,4) olmalı');
  if (!es(KESISIM, [0, 3]) || es(KER, KESISIM)) hata.push('kesişim (1,4) olmalı ve Kerem orada oturmamalı');
  if (!(ad(DEF) < ad(KESISIM) && ad(KESISIM) < ad(NEC))) hata.push('Defne < kesişim < Necmi tutmuyor');
  if (hata.length) throw new Error('b069 oturma düzeni: ' + hata.join('; '));
})();

// ═══════════════════════════ Figüran kartları (bölüme özgü, b069_ önekli) ═══════════════════════════
// Kadro kartlarına dokunulmaz; figüranlar kadro iskeletinden türetilir. Hepsi aynı ölçekte, göbeksiz: yapı adım sayısını ima etmez.
const FIG_TANIM = [
  // [anahtar, iskelet, gövde, gölge, bacak, ten, ten gölgesi, saç, özellikler, kol gövde renginde mi, tohum]
  ['b069_f1', 'defne', '#4F7A73', '#3F625C', '#3E3A33', '#D9A27A', '#BF875F', '#1F1714', ['blazer', 'bun', 'glassesCat', 'lashes'], true, 691],
  ['b069_f2', 'genc', '#C8B48A', '#A99770', '#2E4057', '#EFC4A0', '#D7A882', '#6B4A2E', ['hoodie', 'hairSpiky'], true, 692],
  ['b069_f3', 'genc', '#5E6B73', '#4B565D', '#2F3338', '#D9A27A', '#BF875F', '#2A211C', ['jacket', 'hairSlick', 'glassesRect'], true, 693],
  ['b069_f4', 'hikmet', '#8C6A44', '#735637', '#4A4F57', '#E8BC98', '#CFA07C', '#B0A89E', ['vest', 'mustacheThick', 'baldSides'], false, 694],
  ['b069_f5', 'defne', '#3F6A4E', '#32553E', '#2F2A2A', '#EFC4A0', '#D7A882', '#1F1714', ['jacket', 'bun', 'earrings', 'lashes'], true, 695],
  ['b069_f6', 'hikmet', '#4A4F57', '#3A3E45', '#2F3338', '#C98E66', '#AE7650', '#8A847D', ['suit', 'tie', 'hairSlick', 'mustacheThin'], true, 696],
  ['b069_f7', 'defne', '#8E3B46', '#74303A', '#3E3A33', '#E8BC98', '#CFA07C', '#B88A3A', ['blazer', 'hairSlick', 'glassesRect', 'lashes', 'earrings'], true, 697],
  ['b069_f8', 'necmi', '#E4D9C0', '#C9BEA5', '#3B3F45', '#C08760', '#A46F4C', '#3A2E26', ['jacket', 'hairMessy', 'glassesBold'], true, 698],
  ['b069_f9', 'defne', '#B07A3A', '#93652F', '#2F3338', '#D9A27A', '#BF875F', '#B9B2A8', ['blazer', 'bun', 'earrings', 'lashes'], true, 699],
];
const BOYU = { ...H.BOY };
for (const [key, base, gov, gol, bac, ten, tenG, sac, ozl, kol, tohum] of FIG_TANIM) {
  const b = H.CARDS[base];
  if (!H.CARDS[key]) H.CARDS[key] = {
    ...b, key, name: 'Figüran', seed: tohum,
    torso: { ...b.torso, color: gov, shade: gol, belly: 0 },
    arm: kol ? { ...b.arm, color: gov, shade: gol } : { ...b.arm },
    leg: { ...b.leg, color: bac, shade: bac }, shoe: { ...b.shoe, color: '#2A1E17' }, skin: ten, skinShade: tenG, hair: sac, features: ozl,
  };
  BOYU[key] = H.BOY[base] - 6;
}

// ═══════════════════════════ Ölçüler ═══════════════════════════
const SALON = 'b069_salon', YAKIN = 'b069_yakin';
const KS = 0.49;                                   // kadro ölçeği (salon plânı): baş ekranda ≈ 120 px
const SX = [322, 490, 658, 826];                   // sütun 1…4
const SY = [1134, 893, 665];                       // sıra 1 (ön) … 3 (arka): OTURAN başın merkezi
const KALK = 76;                                   // ayağa kalkış (baş bu kadar yükselir; ≈ 0,63 baş): kalkanın saçı arkadakinin yüzüne binmez
const MASA = 128, KAT = 214;                       // baş merkezinden sıra masasının üstüne ve o basamağın zeminine
const MX0 = 250, MX1 = 898;                        // sıra masalarının iki ucu
const ZEMIN = 1440, BASAMAK = (ZEMIN - (SY[2] + KAT)) / 7;   // salonun zemini; yan merdivenin basamak yüksekliği
const ON_ALT = 1410;                               // ön sıra masasının alt kenarı (altında bacaklar görünür)
const HX = 150, HY = SY[2] + KAT + 3 * BASAMAK;    // Hikmet: sol merdivende, orta sıranın hizasında
const TK = 1.7, TEK_Y = 1000;                      // yakın plân: ölçek çarpanı, oturan başın merkezi
const Y_ALT = TEK_Y + MASA * TK + 152, Y_ZEMIN = Y_ALT + 34;   // yakın plânda masanın alt kenarı ve zemin
const TEK = { defne: 3000, necmi: 4200, hikmet: 5400 };
// kadrajlar
const SALON_CX = 510;                              // salon plânı 30 px sağa oturur: Hikmet + on iki koltuk kadrajı ortalar
const K_SALON = [1, SALON_CX, 960];
const KD_AYAK = [1.35, TEK.defne + 100, 1033], KD_OTUR = [1.5, TEK.defne + 143, 1127];
const KN_AYAK = [1.35, TEK.necmi - 100, 1033], KN_OTUR = [1.5, TEK.necmi - 143, 1127];
const KH = [1.35, TEK.hikmet - 70, 1048];
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const sOf = (key, k = 1) => BOYU[key] * KS * k;
const basU = {};                                   // baş merkezinin ayak kökünden yüksekliği (U)
const basY = key => basU[key] ??= -H.eklem(key, H.kisi(key, { x: 0, y: 0, s: 1, ...POZ.dur }), 'head')[1];
const HBAS = [HX, HY - basY('hikmet') * sOf('hikmet')];   // Hikmet'in başı (salon)

// Kişiler: koltuk, tur, telefonu tuttuğu el. Kalkanlar ADIM tablosundan hesaplanır.
const KISI = [];
for (let r = 0; r < NS; r++) for (let c = 0; c < NC; c++) {
  const t1 = TUR1.findIndex(q => q[0] === r && q[1] === c), t2 = TUR2.findIndex(q => q[0] === r && q[1] === c);
  KISI.push({ i: r * NC + c, r, c, key: KIM[r][c], x: SX[c], y: SY[r], tur: t1 >= 0 ? 1 : t2 >= 0 ? 2 : 0, n: Math.max(t1, t2, 0), g: ((r * NC + c) * 7 % 12) * 0.028 });
}
const turOrta = n => { const L = KISI.filter(k => k.tur === n); return [L.reduce((s, k) => s + k.x, 0) / L.length, L.reduce((s, k) => s + k.y - KALK, 0) / L.length]; };
const ORTA = [null, turOrta(1), turOrta(2)];
for (const k of KISI) k.el = k.tur ? (ORTA[k.tur][0] >= k.x ? 'R' : 'L') : ((k.r + k.c) % 2 ? 'L' : 'R');
const KK = Object.fromEntries(KISI.map(k => [k.key, k]));
const KONUSAN = new Set(['defne', 'necmi']);
const IKILI = { defne: [KK.defne, KISI[DEF[0] * NC + DEF[1] + 1]], necmi: [KISI[NEC[0] * NC + NEC[1] - 1], KK.necmi] };   // sıra arkadaşıyla
if (IKILI.defne.concat(IKILI.necmi).some(k => k.r === KESISIM[0] && k.c === KESISIM[1])) throw new Error('b069: kesişim koltuğu yakın plâna giremez');

// ═══════════════════════════ İfadeler (konuşmayanın ağzı kapalıdır) ═══════════════════════════
const IF = {
  notr: { ...H.EXPR.notr },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.25, pupil: 0.75, curve: 0.02, open: 0, w: 0.7 },
  gulus: { brow: 0.03, browTilt: -0.1, eye: 0.82, pupil: 1, curve: 0.7, open: 0, w: 1.15 },
  suphe: { brow: -0.01, browTilt: 0.28, eye: 0.78, pupil: 1, curve: -0.25, open: 0, w: 0.9 },
  dusun: { ...IFADE.dusun },
  esne: { brow: 0.06, browTilt: -0.2, eye: 0.1, pupil: 1, curve: 0, open: 0.95, w: 0.75, round: true },
};
const ifKar = (a, b, u) => {
  if (u <= 0.001) return a; if (u >= 0.999) return b;
  const o = {}; for (const k of ['brow', 'browTilt', 'eye', 'pupil', 'curve', 'open', 'w']) o[k] = lerp(a[k], b[k], u);
  o.round = (u < 0.5 ? a : b).round; return o;
};

// ═══════════════════════════ Nesneler ═══════════════════════════
// Telefon: elde tutulur, ARKASI kameraya dönüktür (ekran hiç görünmez). [x, y] tutan el; rot derece.
function telefon(K, [x, y], k, rot = 0) {
  const { ctx } = K, w = 27 * k, h = 47 * k;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-w / 2 + 2.5 * k, -h * 0.74 + 3 * k, w, h, INK, 0, 5 * k);
  K.rect(-w / 2, -h * 0.74, w, h, '#2E383D', Math.max(2.5, 3.2 * k), 5 * k);
  K.circ(-w * 0.2, -h * 0.58, 3.4 * k, '#8FA093', 0);                                    // kamera merceği
  K.ell(-w * 0.1, -h * 0.3, 3 * k, 4.6 * k, PAL.mustard, 0, -0.25); K.ell(w * 0.16, -h * 0.4, 3 * k, 4.6 * k, PAL.mustard, 0, 0.25);   // adımsayar çıkartması: iki ayak izi
  ctx.restore();
}
// Su şişesi (sayaçta bir figüran su içer): [x, y] tutan el
function sise(K, [x, y], k, rot) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-9 * k, -44 * k, 18 * k, 52 * k, '#CFE3DD', Math.max(2.5, 3 * k), 5 * k); K.rect(-9 * k, -22 * k, 18 * k, 12 * k, PAL.teal, 0);
  K.rect(-5 * k, -53 * k, 10 * k, 10 * k, PAL.cream, Math.max(2, 2.6 * k), 2 * k);
  ctx.restore();
}
// Hikmet'in dosyası (altlıklı kâğıt; yazı yok): [x, y] alt kenarı tutan el
function dosya(K, [x, y], s, rot = -5) {
  const { ctx } = K, w = 0.5 * s, h = 0.66 * s;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-w * 0.3, -h * 0.9, w, h, '#8C6A44', 0.045 * s, 0.04 * s);
  K.rect(-w * 0.3 + 0.04 * s, -h * 0.9 + 0.07 * s, w - 0.08 * s, h - 0.11 * s, PAL.cream, 0.025 * s, 0.02 * s);
  for (let j = 0; j < 4; j++) { const yy = -h * 0.9 + (0.2 + j * 0.105) * s; K.line(-w * 0.3 + 0.1 * s, yy, -w * 0.3 + (0.3 + (j % 2) * 0.08) * s, yy, 0.022 * s, '#9FB3B0'); }
  K.rect(-w * 0.3 + w / 2 - 0.09 * s, -h * 0.9 - 0.03 * s, 0.18 * s, 0.07 * s, PAL.metal, 0.025 * s, 0.02 * s);
  ctx.restore();
}
// Düdük ve boyun ipi: p düdüğün yeri, n boyun noktası
function duduk(K, p, n, s, agiz = 0) {
  const { ctx } = K, b = 1 + 0.35 * agiz;                                                 // ağızdayken biraz büyük çizilir (salon plânında seçilsin)
  ctx.save(); ctx.lineCap = 'round';
  for (const m of [-1, 1]) H.strokeLine(ctx, [n[0] + m * 0.17 * s, n[1] + 0.05 * s], p, 0.03 * s, PAL.red);
  K.rect(p[0] - 0.13 * s * b, p[1] - 0.05 * s * b, 0.2 * s * b, 0.1 * s * b, PAL.metal, 0.03 * s, 0.02 * s);
  K.circ(p[0] + 0.08 * s * b, p[1] + 0.02 * s * b, 0.085 * s * b, PAL.metal, 0.03 * s);
  ctx.restore();
}

// Masanın altından görünen bacaklar (oturan da kalkan da aynı görünür): [x] kişinin ekseni, yz zemin, y0 masanın alt kenarı
function bacak(K, key, x, y0, yz, s) {
  const c = H.CARDS[key], w = c.leg.w * s, dx = c.torso.hip * 0.3 * s, lw = c.line * s;
  for (const m of [-1, 1]) {
    K.rect(x + m * dx - w / 2, y0 - 10, w, yz - y0 + 6, c.leg.color, lw, w * 0.3);
    K.ell(x + m * (dx + 0.03 * s), yz + c.shoe.h * 0.35 * s, c.shoe.len * 0.4 * s, c.shoe.h * 0.6 * s, c.shoe.color, lw);
  }
}
// Kilim (ön plân zemini) ve ödül kupası
function kilim(K, x0, x1, y, k) {
  const { ctx } = K, h = 600 * k, a = 150 * k;
  K.rect(x0, y, x1 - x0, h, '#8E2A2E', 0); K.line(x0, y, x1, y, LW, INK);
  K.rect(x0, y + 16 * k, x1 - x0, 12 * k, PAL.mustard, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y, x1 - x0, h); ctx.clip();
  for (let x = Math.floor(x0 / a) * a; x < x1; x += a) K.poly([[x, y + 110 * k], [x + 38 * k, y + 68 * k], [x + 76 * k, y + 110 * k], [x + 38 * k, y + 152 * k]], PAL.mustard, 3 * k);
  ctx.restore();
}
function kupa(K, x, y, k) {
  K.rect(x - 60 * k, y, 120 * k, 14 * k, PAL.woodTop, LW * 0.7, 4); K.rect(x - 46 * k, y + 14 * k, 12 * k, 90 * k, PAL.wood, LW * 0.6, 3); K.rect(x + 34 * k, y + 14 * k, 12 * k, 90 * k, PAL.wood, LW * 0.6, 3);
  K.rect(x - 24 * k, y - 16 * k, 48 * k, 16 * k, '#4A3320', LW * 0.6, 3); K.rect(x - 7 * k, y - 34 * k, 14 * k, 20 * k, PAL.mustard, LW * 0.6);
  for (const m of [-1, 1]) { K.ctx.beginPath(); K.ctx.arc(x + m * 30 * k, y - 62 * k, 15 * k, 0, Math.PI * 2); K.ctx.lineWidth = 6 * k; K.ctx.strokeStyle = INK; K.ctx.stroke(); K.ctx.lineWidth = 2.5 * k; K.ctx.strokeStyle = PAL.mustard; K.ctx.stroke(); }
  K.poly([[x - 32 * k, y - 88 * k], [x + 32 * k, y - 88 * k], [x + 22 * k, y - 46 * k], [x + 8 * k, y - 32 * k], [x - 8 * k, y - 32 * k], [x - 22 * k, y - 46 * k]], PAL.mustard, LW * 0.7);
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
// Salon (önden): üç basamak. Her sıranın önünde boydan boya bir masa; iki yanda merdiven. Sıra bantları ve kişiler draw'da çizilir.
function merdiven(K, x0, x1) {
  for (let j = 0; j < 7; j++) { const y = SY[2] + KAT + j * BASAMAK; K.rect(x0, y, x1 - x0, BASAMAK + 1, j % 2 ? '#A9824F' : '#B8925E', 0); K.line(x0, y, x1, y, 4, INK); }
}
function siraMasasi(K, r) {
  const y = SY[r] + MASA, alt = r === 0 ? ON_ALT : SY[r] + KAT;
  if (r > 0) K.rect(MX0, alt, MX1 - MX0, SY[r - 1] + KAT - alt + 4, '#6F4A27', LW * 0.7);                 // basamağın alnı (öndeki sıranın arkası)
  K.rect(MX0, y + 12, MX1 - MX0, alt - y - 12, PAL.wood, LW * 0.7);
  for (let c = 1; c < NC; c++) K.line((SX[c - 1] + SX[c]) / 2, y + 20, (SX[c - 1] + SX[c]) / 2, alt - 6, 3, PAL.woodDark);
  K.rect(MX0 - 8, y, MX1 - MX0 + 16, 16, PAL.woodTop, LW * 0.7, 5);
}
M.mekanEkle(SALON, {
  gen: [-700, 1800], zemin: ZEMIN, dongu: ['duvar saatinin saniye kolu', 'pencerede martı'],
  capa: {}, kadraj: { genis: K_SALON },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 1800, floorY: ZEMIN, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 262, 64, 220, 160, { isik, t, manzara: null }); M.pencere(K, 612, 64, 220, 160, { isik, t: t + 7, manzara: null });
    M.duvarSaati(K, 960, 590, 42, 14.2 + t / 60, t);
    merdiven(K, -700, MX0); merdiven(K, MX1, 1800);
    K.rect(MX0, ON_ALT - 6, MX1 - MX0, ZEMIN - ON_ALT + 6, '#4A3320', 0);                                  // ön masanın altı
    kilim(K, -700, 1800, 1585, 1); kupa(K, 118, 1560, 1);
  },
});
// Yakın plân arka plânı: düz duvar, pencere; Hikmet'in plânında yarışma afişi. Kamera sıranın hizasındadır.
M.mekanEkle(YAKIN, {
  gen: [2000, 6600], zemin: 2400, dongu: ['pencerede martı'], capa: {}, kadraj: {},
  arka(K, t, { isik, durum }) {
    const yz = durum.kim === 'hikmet' ? 900 + basY('hikmet') * sOf('hikmet', TK) : Y_ZEMIN;
    M.oda(K, { x0: 2000, x1: 6600, floorY: yz, isik, duvar: 'cizgili', zemin: 'ahsap' });
    kilim(K, 2000, 6600, yz + (durum.kim === 'hikmet' ? 96 : 150), TK);
    if (durum.kim === 'defne') M.pencere(K, TEK.defne - 290, 610, 200, 300, { isik, t, manzara: null });
    if (durum.kim === 'necmi') M.pencere(K, TEK.necmi + 90, 610, 200, 300, { isik, t, manzara: null });
    if (durum.kim === 'hikmet') {
      const x = TEK.hikmet - 392, y = 742;                                                             // afiş: ekranda yazı ≥ 44 px (34 × 1,35)
      K.rect(x + 8, y + 10, 262, 196, INK, 0, 8); K.rect(x, y, 262, 196, PAL.cream, LW, 8);
      K.rect(x, y, 262, 26, PAL.mustard, LW * 0.7, 6);
      K.text(K.up('adım'), x + 131, y + 80, 36, INK, 900); K.text(K.up('yarışması'), x + 131, y + 122, 36, INK, 900);
      for (let j = 0; j < 4; j++) K.ell(x + 62 + j * 46, y + 160 + (j % 2 ? 9 : -5), 9, 14, PAL.coral, 0, j % 2 ? 0.3 : -0.3);   // ayak izleri
      M.pencere(K, TEK.hikmet + 190, 700, 230, 330, { isik, t, manzara: null });
    }
  },
});
// Yakın plândaki sıra masası (kadrajı boydan boya geçer)
function yakinMasa(K, x, kisiler, ref) {
  const y = TEK_Y + MASA * TK;
  K.rect(x - 900, Y_ALT - 8, 1800, Y_ZEMIN - Y_ALT + 8, '#4A3320', 0);
  for (const P of kisiler) bacak(K, P.key, x + (P.x - ref.x) * TK, Y_ALT, Y_ZEMIN + 52, sOf(P.key, TK));
  K.rect(x - 900, y + 20, 1800, Y_ALT - y - 20, PAL.wood, LW);
  for (let j = -3; j <= 3; j++) K.line(x + (j + 0.5) * 168 * TK, y + 34, x + (j + 0.5) * 168 * TK, Y_ALT - 8, 5, PAL.woodDark);
  K.rect(x - 910, y, 1820, 27, PAL.woodTop, LW, 8);
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    duduk: 0.1, indir: 0.4, sayisini: T('h1'), kimin: T('h1:2') - 0.1, bulacagiz: T('h1:5'),
    // (26 Kas, kısa kurgu) h1b artık yalnız "Herkesin sayısı farklı.": düzen plânı ve tanım bantları çıktı; Hikmet'ten doğrudan telefon insertine kesilir.
    herkesin: T('h1b') - 0.1,
    tur1: T('h2a') - 0.1, siranin: T('h2a:1') - 0.04, kalk1: T('h2a:5') + 0.15,
    d1: T('d1'), defne1: T('d1:2') - 0.1, benim1: T('d1:5') - 0.04,
    // "Oturun" sözü çıktı: üç tembel, salon plânı açılır açılmaz (Hikmet'in avuç aşağı işaretiyle) sütun bantlarından önce oturur
    tur2: T('h2b') - 0.4, otur1: T('h2b') - 0.32, sutunun: T('h2b:1') - 0.04, kalk2: T('h2b:5') + 0.15,
    n0: T('n0'), necmi1: T('n0:1') - 0.1, benim2: T('n0:5') - 0.04,
    soru: T('h3') - 0.1, otur2: T('h3') + 0.1, defneMi: T('h3'), necmiMi: T('h3:6') - 0.05,
    necmi2: T('n0b') - 0.1, bilinemez: T('n0b:3'),
    sayac: cd0 - 0.05, ipucu: T('n1') - 0.1, ikimizi: T('n1:1'), tek: T('n1:4') - 0.04,
    // (26 Kas, bağımsız göz) "İkimizi birden" Defne'nin yakın plânında, yanındaki figüranla söylenince "ikimiz" o ikisi sanılıyordu:
    // "birden"de salona kesilir, Defne ile Necmi birbirine bakar (koltuk vurgusu yok).
    final: T('n1:2') - 0.1,
    cevap: T('d3>') + 0.15, siramla: T('d4:1') - 0.04, sutununun: T('d4:3') - 0.04, kesisti: T('d4:4') - 0.04, cta: T('d6') - 0.15,
  };

  const film = H.sahneler([
    { id: 'kanca', plan: 'salon', t0: 0, cam: [[0, ...K_SALON]] },
    { id: 'hikmet1', plan: 'hikmet', t0: tm.kimin, cam: [[0, ...KH], [tm.bulacagiz, 1.38, KH[1] + 4, KH[2] - 3]] },
    { id: 'telefon', plan: 'necmi', t0: tm.herkesin, cam: [[0, ...KN_OTUR]] },
    { id: 'tur1', plan: 'salon', t0: tm.tur1, cam: [[0, ...K_SALON]] },
    { id: 'defne1', plan: 'defne', t0: tm.defne1, cam: [[0, ...KD_AYAK]] },
    { id: 'tur2', plan: 'salon', t0: tm.tur2, cam: [[0, ...K_SALON]] },
    { id: 'necmi1', plan: 'necmi', t0: tm.necmi1, cam: [[0, ...KN_AYAK]] },
    { id: 'soru', plan: 'hikmet', t0: tm.soru, cam: [[0, ...KH], [tm.necmiMi, 1.38, KH[1] + 4, KH[2] - 3]] },
    { id: 'necmi2', plan: 'necmi', t0: tm.necmi2, cam: [[0, ...KN_OTUR]] },
    { id: 'sayac', plan: 'salon', t0: tm.sayac, cam: [[0, ...K_SALON]] },                 // doğrusal itme draw'daki kamera() ile
    { id: 'ipucu', plan: 'defne', t0: tm.ipucu, cam: [[0, ...KD_OTUR], [tm.tek, 1.53, KD_OTUR[1] - 3, KD_OTUR[2] - 3]] },
    { id: 'final', plan: 'salon', t0: tm.final, cam: [[0, ...K_SALON]] },
    { id: 'buldum', plan: 'defne', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KD_AYAK]] },
    { id: 'cevap', plan: 'salon', t0: tm.cevap, cam: [[0, ...K_SALON]] },
    { id: 'cta', plan: 'defne', t0: tm.cta, cam: [[0, ...KD_AYAK]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // Sıra ve sütun bantları: [giriş, çıkış, hangileri]. "Buldum!"dan önce hep hepsi birden (eşit vurgu).
  const HEPS = [...Array(NS).keys()], HEPC = [...Array(NC).keys()];
  const bant = {
    sira: [[tm.siranin, tm.kalk1 - 0.2, HEPS], [tm.siramla, tm.cta - 0.3, [DEF[0]]]],
    sutun: [[tm.sutunun, tm.kalk2 - 0.2, HEPC], [tm.sutununun, tm.cta - 0.3, [NEC[1]]]],
  };
  for (const [ad, n] of [['sira', NS], ['sutun', NC]]) for (const [a, , kim] of bant[ad]) if (a < tm.buldum && kim.length !== n) throw new Error('b069: "Buldum!"dan önce bantlar eşit vurguda olmalı');

  // ——— bakış olayları: [an, tür, veri] (kişiye göre küçük gecikmeyle uygulanır) ———
  const olay = KISI.map(() => []), ifade = KISI.map(() => []);
  const ekle = (P, ...e) => olay[P.i].push(...e), yuz = (P, ...e) => ifade[P.i].push(...e);
  const dongu = (P, a, b, faz) => { const L = [['tel', 2.3], ['hik', 1.5], ['kam', 1.3]]; let tt = a + faz, j = (P.i + P.r) % 3; while (tt < b) { ekle(P, [tt, L[j % 3][0]]); tt += L[j % 3][1]; j++; } };
  for (const P of KISI) {
    ekle(P, [tm.duduk, 'hik'], [tm.sayisini + 0.1, 'tel'], [tm.sayisini + 0.85, 'hik'], [tm.herkesin, 'tel'],
      [tm.tur1, 'hik'], [tm.kalk1 + 0.35, 'tur', 1], [tm.d1 - 0.1, 'kisi', 'defne'],
      [tm.otur1 - 0.2, 'hik'], [tm.kalk2 + 0.35, 'tur', 2], [tm.n0 - 0.1, 'kisi', 'necmi'],
      [tm.soru, 'hik'], [tm.necmi2, 'kisi', 'necmi'], [tm.ipucu, 'kisi', 'defne'], [tm.buldum, 'kisi', 'defne'], [tm.kesisti + 0.2, 'yer', KESISIM]);
    if (!KONUSAN.has(P.key) && P.key !== H.KEREM) dongu(P, cd0 + 0.2, cd - 0.6, (P.i % 4) * 0.55);
    if (P.i % 3 === 0 && !KONUSAN.has(P.key)) ekle(P, [tm.final + 0.15, 'tel']);          // son plânda üç kişi telefonuna döner (kesişim koltuğu da bunlardan biri; ayrıcalığı yok)
  }
  const D = KK.defne, N = KK.necmi, KE = KK[H.KEREM];
  ekle(D, [tm.d1 + 0.02, 'hik'], [tm.benim1, 'kam'], [tm.n0, 'kisi', 'necmi'],
    [cd0 + 0.4, 'kisi', 'necmi'], [cd0 + 3.5, 'tel'], [cd0 + 5.4, 'kisi', 'necmi'], [cd0 + 7.2, 'ham', [-0.35, -0.7]], [cd0 + 9.2, 'kisi', 'necmi'],
    [tm.ipucu + 0.02, 'kisi', 'necmi'], [tm.final, 'kisi', 'necmi'], [tm.buldum + 0.02, 'kam'], [tm.cevap, 'kisi', 'necmi'], [tm.cta, 'kam']);
  ekle(N, [tm.herkesin + 0.75, 'kisi', H.KEREM], [tm.herkesin + 1.75, 'tel'], [tm.n0 + 0.02, 'hik'], [tm.benim2, 'kam'], [tm.necmi2 + 0.02, 'hik'], [tm.bilinemez, 'kam'],
    [cd0 + 0.7, 'kisi', 'defne'], [cd0 + 3.6, 'tel'], [cd0 + 5.6, 'kisi', 'defne'], [cd0 + 7.6, 'tel'], [cd0 + 9.3, 'kisi', 'defne'], [tm.final, 'kisi', 'defne']);
  ekle(KE, [tm.herkesin + 0.3, 'telKim', 'necmi'], [tm.herkesin + 1.45, 'ham', [-0.55, -0.5]],
    [cd0 + 0.5, 'tel'], [cd0 + 3.6, 'hik'], [cd0 + 5.5, 'tel'], [cd0 + 8.4, 'kisi', 'defne']);
  yuz(D, [tm.kimin, null, IF.notr], [tm.benim1 - 0.3, tm.otur1, IF.gulus], [cd0 + 3.6, cd0 + 9.0, IF.dusun], [tm.ipucu, null, IF.gulus]);
  yuz(N, [tm.herkesin + 0.75, tm.herkesin + 1.9, IF.suphe], [tm.benim2 - 0.3, tm.otur2, IF.gulus], [tm.necmi2, cd0 + 2.5, IF.suphe], [cd0 + 5.3, cd0 + 7.4, IF.suphe], [tm.buldum, null, IF.merak]);
  yuz(KE, [tm.herkesin + 0.2, tm.herkesin + 1.4, IF.merak], [tm.herkesin + 1.45, tm.tur1, IF.gulus], [tm.benim2 - 0.2, tm.soru, IF.gulus]);
  // sayaçtaki küçük işler (figüranlar): esneme, su içme, fısıldaşma, saate bakma
  const F = k => KK['b069_f' + k];
  ekle(F(6), [cd0 + 1.0, 'kisi', 'b069_f7'], [cd0 + 3.4, 'tel']); ekle(F(7), [cd0 + 1.1, 'kisi', 'b069_f6'], [cd0 + 3.5, 'tel']);
  ekle(F(8), [cd0 + 1.9, 'ham', [0, -0.55]], [cd0 + 3.9, 'tel']); yuz(F(8), [cd0 + 2.1, cd0 + 3.6, IF.esne]);
  ekle(F(1), [cd0 + 4.5, 'ham', [0.1, -0.45]], [cd0 + 6.7, 'tel']);
  ekle(F(4), [cd0 + 6.3, 'ham', [-0.3, 0.85]], [cd0 + 8.2, 'hik']);
  yuz(F(3), [tm.kesisti, null, IF.merak]);                                               // arşiv (kesimden sonra)
  for (const L of olay) L.sort((a, b) => a[0] - b[0]);

  // ——— Hikmet (salonda ve kendi plânında aynı poz izi) ———
  const hikBase = H.kisi('hikmet', { x: HX, y: HY, s: sOf('hikmet'), expr: IF.notr, head: { tilt: 3, look: [0.75, 0.15] }, ...POZ.dur, });
  const hik = [
    [tm.indir, { head: { tilt: -2, look: [0.1, 0.05] } }, 0.3],
    [tm.sayisini, { head: { tilt: 4, look: [0.75, 0.2] } }, 0.3],
    [tm.kimin, { expr: IF.gulus, head: { tilt: -3, look: [0.1, 0.05] } }, 0.01],
    [tm.bulacagiz, { head: { tilt: 4, look: [0.05, 0.0] } }, 0.3],
    [tm.herkesin - 0.01, { expr: IF.notr, head: { tilt: 3, look: [0.7, 0.15] } }, 0.01],
    [tm.herkesin, { head: { tilt: -3, look: [0.6, 0.3] } }, 0.3],
    [tm.tur1, { head: { tilt: 3, look: [0.75, 0.1] } }, 0.01],
    [tm.kalk1, { expr: IF.gulus, head: { tilt: -3, look: [0.7, -0.1] } }, 0.3],
    [tm.d1 - 0.1, { expr: IF.notr, head: { tilt: 4, look: [0.7, 0.75] } }, 0.3],
    [tm.tur2, { head: { tilt: 2, look: [0.75, 0.1] } }, 0.01],
    [tm.kalk2, { expr: IF.gulus, head: { tilt: -3, look: [0.75, -0.05] } }, 0.3],
    [tm.n0 - 0.1, { expr: IF.notr, head: { tilt: 4, look: [0.85, 0.2] } }, 0.3],
    [tm.soru, { expr: IF.notr, head: { tilt: -3, look: [0.35, 0.3] } }, 0.01],
    [tm.necmiMi, { head: { tilt: 5, look: [0.45, -0.2] } }, 0.3],
    [tm.necmiMi + 0.75, { head: { tilt: -2, look: [0.05, 0.0] } }, 0.3],
    [tm.sayac, { expr: IF.notr, head: { tilt: 3, look: [0.75, 0.2] } }, 0.01],
    [cd0 + 1.5, { head: { tilt: -6, look: [-0.35, 0.8] } }, 0.35],
    [cd0 + 4.2, { head: { tilt: 3, look: [0.8, 0.0] } }, 0.35],
    [cd0 + 6.4, { head: { tilt: -6, look: [-0.35, 0.8] } }, 0.35],
    [cd0 + 8.6, { head: { tilt: 4, look: [0.75, 0.4] } }, 0.35],
    [tm.final, { expr: IF.merak, head: { tilt: 5, look: [0.7, 0.7] } }, 0.01],
    [tm.cevap, { expr: IF.merak, head: { tilt: 3, look: [0.8, 0.5] } }, 0.01],
  ];
  // Altyazı çizelgesi (yalnız balon için): n1 son repliktir (cevapsız kesim), balonu kesime kadar TAM opak kalır.
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') } : l.id === 'd3' ? { ...l, t0: l.t0 + 0.12 } : l) };
  return { tm, film, tlA, bant, olay, ifade, hikBase, hik };
}

// ═══════════════════════════ Kişi durumu ═══════════════════════════
function kalkAt(S, t, P) {
  const { tm } = S; let k = 0;
  if (P.tur === 1) k = ease.enter(seg(t, tm.kalk1 + P.n * 0.07, 0.4)) * (1 - ease.state(seg(t, tm.otur1 + P.n * 0.05, 0.34)));
  if (P.tur === 2) k = ease.enter(seg(t, tm.kalk2 + P.n * 0.07, 0.4)) * (1 - ease.state(seg(t, tm.otur2 + P.n * 0.05, 0.34)));
  if (KONUSAN.has(P.key)) { const g = P.key === 'necmi' ? 0.12 : 0; k = Math.max(k, ease.enter(seg(t, tm.cd0 + 0.6 + g, 0.4)) * (1 - ease.state(seg(t, tm.cd0 + 3.3 + g, 0.34)))); }   // sayaç: ikisi yeniden kalkıp birbirine bakar (yerleri bir kez daha görünür)
  if (P.key === 'defne') k = Math.max(k, ease.enter(seg(t, tm.buldum - 0.05, 0.25)));   // arşiv
  return k;
}
const basNokta = (S, t, P) => [P.x, P.y - KALK * kalkAt(S, t, P)];
function bakVek(P, bas, hedef) {
  const dx = hedef[0] - bas[0], dy = hedef[1] - bas[1], d = Math.hypot(dx, dy);
  if (d < 30) return [0, 0.05];
  const k = Math.min(0.9, 0.35 + d / 400) / d; return [dx * k, dy * k];
}
function bakisAt(S, t, P) {
  const m = P.el === 'R' ? 1 : -1, bas = basNokta(S, t, P), tel = [m * 0.3, 0.85];
  const hedef = (tur, veri) => {
    if (tur === 'tel') return tel;
    if (tur === 'kam') return [0, 0.06];
    if (tur === 'ham') return veri;
    if (tur === 'hik') return bakVek(P, bas, HBAS);
    if (tur === 'kisi') return bakVek(P, bas, basNokta(S, t, KK[veri]));
    if (tur === 'yer') return bakVek(P, bas, [SX[veri[1]], SY[veri[0]]]);
    if (tur === 'telKim') { const Q = KK[veri], mq = Q.el === 'R' ? 1 : -1; return bakVek(P, bas, [Q.x + mq * 0.23 * sOf(Q.key), Q.y + 0.8 * sOf(Q.key)]); }
    if (tur === 'tur') {                                                                  // kalkanlar birbirine, oturanlar en yakın kalkana bakar
      if (P.tur === veri) return bakVek(P, bas, ORTA[veri]);
      let en = null, ed = 1e9; for (const Q of KISI) if (Q.tur === veri) { const d = Math.hypot(Q.x - P.x, Q.y - P.y); if (d < ed) { ed = d; en = Q; } }
      return bakVek(P, bas, [en.x, en.y - KALK]);
    }
    return [0, 0.06];
  };
  let look = P.key === 'defne' ? bakVek(P, bas, HBAS) : tel;                              // kare 0: herkes telefonunda, Defne Hikmet'e bakıyor
  for (const [a, tur, veri] of S.olay[P.i]) { const a2 = a + P.g; if (t < a2) break; look = kar(look, hedef(tur, veri), W(t, a2, 0.3)); }
  return look;
}
function ifadeAt(S, t, P) {
  let e = P.key === 'defne' ? IF.merak : IF.notr;
  for (const [a, b, f] of S.ifade[P.i]) e = ifKar(e, f, b == null ? W(t, a, 0.25) : pIn(t, a, b, 0.25));
  return e;
}

// Kişiyi verilen yere çizer. yer = { x, y (oturan başın merkezi), k (ölçek çarpanı) }. Salon ve yakın plân aynı fonksiyonu okur.
function kisiCiz(K, t, tl, S, B, P, yer) {
  const { tm } = S, { cd0 } = tm, k = yer.k, key = P.key, s = sOf(key, k), kalk = kalkAt(S, t, P), m = P.el === 'R' ? 1 : -1, diger = P.el === 'R' ? 'L' : 'R';
  let yBas = yer.y - KALK * k * kalk, x = yer.x;
  if (key === 'defne') yBas -= H.buldumHop(t, tm.buldum, 40 * k);
  yBas -= 15 * k * H.nabiz(t, tm.duduk + 0.03 + P.g * 0.6, 0.3);                           // düdükte irkilme (kare 0'dan sonraki ilk hareket)
  const look = bakisAt(S, t, P);
  let tilt = ((P.i * 5) % 7 - 3) * 1.1 + look[0] * 5;
  // Kerem, Necmi'nin telefonuna eğilir (h1b); Necmi telefonunu öbür yanına çeker
  const merakW = key === H.KEREM ? pIn(t, tm.herkesin + 0.3, tm.herkesin + 1.4, 0.3) : 0, sakla = key === 'necmi' ? pIn(t, tm.herkesin + 0.7, tm.tur1 + 0.4, 0.26) : 0;
  x += merakW * 0.2 * s; tilt += merakW * 9;
  if (key === 'b069_f6') tilt += 7 * pIn(t, cd0 + 1.0, cd0 + 3.4); if (key === 'b069_f7') tilt -= 7 * pIn(t, cd0 + 1.1, cd0 + 3.5);
  if (key === 'b069_f8') tilt -= 6 * pIn(t, cd0 + 2.1, cd0 + 3.6);
  const p = H.kisi(key, { x, y: yBas + basY(key) * s, s, expr: ifadeAt(S, t, P), ...POZ.dur, head: { tilt, look } });
  if (key === 'defne') H.onayla(p, t, tm.ipucu + 0.12, 1, 0.42);                          // "Bilinir."
  if (key === 'necmi') H.omuzSilk(p, t, tm.bilinemez - 0.1, 0.6);                         // "bilinemez"
  if (key === H.KEREM) H.onayla(p, t, tm.benim2 + 0.25, 2, 0.32);
  // telefon eli: otururken göğüs hizasında; kalkınca başın yanında havada; sonra kalkanların ortasına doğru uzanır
  const sarma = pIn(t, tm.sayisini + 0.1 + P.g, tm.sayisini + 0.95 + P.g, 0.22);
  let oturan = [x + m * (0.23 - 0.1 * sarma) * s, yBas + (0.8 + 0.05 * sarma) * s];
  if (sakla) oturan = kar(oturan, [x + 0.17 * s, yBas + 0.86 * s], sakla);
  let hedef = oturan, rot = -m * 6, goster = 0;
  if (kalk > 0.001) {
    const yuk = H.elYeri(key, p, P.el, 'yukari'), o = ORTA[P.tur || 1], tA = P.tur === 2 ? tm.kalk2 : tm.kalk1, tB = P.tur === 2 ? tm.benim2 : tm.benim1;
    const yon = H.unit([P.x, P.y - KALK], o), L = (H.CARDS[key].arm.upper + H.CARDS[key].arm.lower) * s;
    goster = P.tur ? pIn(t, tA + 0.5 + P.n * 0.07, tB - 0.2, 0.3) : 0;
    const uz = [yuk[0] + yon[0] * 0.3 * L, yuk[1] + yon[1] * 0.2 * L + 0.12 * L];
    hedef = kar(oturan, kar(yuk, uz, goster), kalk); rot = lerp(rot, m * (10 + 12 * goster), kalk);
  }
  const benim = key === 'defne' ? Math.max(pIn(t, tm.benim1 - 0.1, tm.otur1, 0.3), W(t, tm.buldum - 0.05, 0.22) * (1 - W(t, tm.cevap, 0.3))) : key === 'necmi' ? pIn(t, tm.benim2 - 0.1, tm.otur2, 0.3) : 0;
  if (benim > 0.001) { hedef = kar(hedef, [x + m * 0.2 * s, yBas + 0.84 * s], benim); rot = lerp(rot, -m * 6, benim); }   // "benim" diyen telefonu göğsüne indirir, öbür elini kaldırır
  const o = { [P.el]: [hedef, 1, 'B'] };
  if (KONUSAN.has(key)) o.heads = B.heads;
  let ek = null;
  if (benim > 0.001) { const sh = H.shoulder(key, p, diger), L = (H.CARDS[key].arm.upper + H.CARDS[key].arm.lower) * s; o[diger] = [[sh[0] - m * 0.72 * L, sh[1] - 0.8 * L], benim, 'B']; if (benim > 0.5) ek = { avuc: diger, n: 4 * seg(benim, 0.5, 0.5) }; }
  if (key === 'defne') { const w1 = pIn(t, tm.tek - 0.25, tm.buldum + 0.5, 0.28); if (w1 > 0.001 && benim <= 0.001) { o[diger] = [[x - m * 0.62 * s, yBas + 0.42 * s], w1, 'B']; ek = { parmak: [diger, seg(t, tm.tek - 0.05, 0.2), { toplam: 1 }], w: w1 }; } }
  if (key === 'b069_f1') { const w = pIn(t, cd0 + 4.6, cd0 + 6.5, 0.3); if (w > 0.001) { const A = diger === 'L' ? 'armL' : 'armR'; p[A] = { sh: lerp(p[A].sh, 18, w), el: lerp(p[A].el, -168, w) }; ek = { sise: diger, w }; } }
  if (key === 'b069_f4') { const w = pIn(t, cd0 + 6.3, cd0 + 8.1, 0.3); if (w > 0.001) o[diger] = [[x - m * 0.3 * s, yBas + 0.86 * s], w, 'B']; }
  const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 1e5 + yer.kes); ctx.clip();   // masanın altında kalan gövde çizilmez
  const a = oyna(K, t, KONUSAN.has(key) ? tl : null, key, p, o);
  const el = P.el === 'L' ? a.handL : a.handR;
  telefon(K, el, k, rot); a.tut(P.el);
  if (ek?.sise && ek.w > 0.5) { const h = ek.sise === 'L' ? a.handL : a.handR; sise(K, [h[0], h[1] + 4 * k], k, m * 24); a.tut(ek.sise); }
  if (ek?.parmak && ek.w > 0.5) a.parmak(...ek.parmak);
  if (ek?.avuc) a.parmak(ek.avuc, ek.n, { toplam: 4, ac: 0.3, boy: 0.75 });
  ctx.restore();
  return a;
}

// Hikmet: yer = { x, y (ayak), k }. Sol elinde dosya, boynunda düdük; sağ eliyle anlatır.
function hikmetCiz(K, t, tl, S, B, yer) {
  const { tm } = S, { cd0 } = tm, p = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), s = sOf('hikmet', yer.k);
  p.x = yer.x; p.y = yer.y; p.s = s;
  const sh = H.shoulder('hikmet', p, 'R'), n = H.eklem('hikmet', p, 'neck'), g = (dx, dy) => [sh[0] + dx * s, sh[1] + dy * s];
  const o = { heads: B.heads, L: [[p.x - 0.4 * s, n[1] + 0.72 * s], 1, 'A'] };
  let hedef = null, w = 0, parmak = null, isaret = null;
  const kur = (ww, h) => { if (ww > w) { w = ww; hedef = h; } };
  const yatay = a => g(lerp(-0.1, 0.4, ease.state(seg(t, a, 0.6))), 0.1), dikey = a => g(0.34, lerp(-0.7, 0.5, ease.state(seg(t, a, 0.6))));   // el koridorda kalır (x ≤ sıra masasının ucu)
  kur(pIn(t, tm.siranin - 0.2, tm.kalk1 - 0.35, 0.25), yatay(tm.siranin));
  kur(pIn(t, tm.kalk1 - 0.3, tm.kalk1 + 0.9, 0.25), g(0.34, lerp(0.45, -0.55, ease.enter(seg(t, tm.kalk1 - 0.1, 0.4)))));   // "kalksın": avuç yukarı
  kur(pIn(t, tm.otur1 - 0.4, tm.sutunun - 0.1, 0.22), g(0.34, lerp(-0.35, 0.5, ease.state(seg(t, tm.otur1 - 0.2, 0.4)))));    // sözsüz "oturun": avuç aşağı
  kur(pIn(t, tm.sutunun - 0.2, tm.kalk2 - 0.35, 0.25), dikey(tm.sutunun));
  kur(pIn(t, tm.kalk2 - 0.3, tm.kalk2 + 0.9, 0.25), g(0.34, lerp(0.45, -0.55, ease.enter(seg(t, tm.kalk2 - 0.1, 0.4)))));
  const hd = H.eklem('hikmet', p, 'head'), agiz = 1 - ease.state(seg(t, tm.indir, 0.3));                       // düdük: kare 0'da ağzında, sonra boynunda asılı
  kur(agiz, [hd[0] + 0.36 * s, hd[1] + 0.52 * s]);
  const wP = pIn(t, tm.bulacagiz - 0.3, tm.herkesin, 0.28); if (wP > w) { kur(wP, g(0.55, -0.5)); if (wP > 0.5) parmak = seg(t, tm.bulacagiz - 0.05, 0.2); }
  const wD = pIn(t, tm.defneMi - 0.05, tm.necmiMi - 0.05, 0.25), wN = pIn(t, tm.necmiMi - 0.05, tm.necmi2, 0.25);          // "Defne mi … Necmi mi": iki ayrı yön
  if (wD > w) { kur(wD, g(0.7, 0.3)); if (wD > 0.5) isaret = g(1.6, 0.75); }
  if (wN > w) { kur(wN, g(0.72, -0.3)); if (wN > 0.5) isaret = g(1.7, -0.75); }
  const wY = pIn(t, cd0 + 1.6, cd0 + 3.9, 0.3) + pIn(t, cd0 + 6.5, cd0 + 8.3, 0.3);                                        // sayaç: dosyaya işaret koyar
  if (wY > w) kur(wY, [p.x - 0.16 * s + 0.07 * s * Math.sin(t * 9), n[1] + 0.46 * s]);
  if (w > 0.001) o.R = [hedef, w, 'B'];
  const a = oyna(K, t, tl, 'hikmet', p, o);
  dosya(K, a.handL, s); a.tut('L');
  duduk(K, kar([p.x + 0.04 * s, n[1] + 0.52 * s], [hd[0] + 0.2 * s, hd[1] + 0.37 * s], agiz), n, s, agiz);
  if (parmak != null) a.parmak('R', parmak, { toplam: 1 });
  if (isaret) a.isaret('R', isaret);
  return a;
}

// ═══════════════════════════ Bantlar (sıra yatay, sütun dikey; düz renk) ═══════════════════════════
const BANT = '#FBF6EC';
const bantU = (t, a, b) => (t < a || t > b + 0.2) ? null : [ease.exit(seg(t, b, 0.2)), ease.enter(seg(t, a, 0.28))];
function siraBandi(K, t, S, r) {
  for (const [a, b, kim] of S.bant.sira) {
    const u = kim.includes(r) && bantU(t, a, b); if (!u) continue;
    const x0 = lerp(MX0, MX1, u[0]), x1 = lerp(MX0, MX1, u[1]), y0 = SY[r] - 78, y1 = SY[r] + MASA; if (x1 - x0 < 2) continue;
    K.rect(x0, y0, x1 - x0, y1 - y0, BANT, 0); K.line(x0, y0, x1, y0, 5, PAL.mustard);
  }
}
function sutunBandi(K, t, S, r) {
  const Y0 = SY[NS - 1] - 84, Y1 = SY[0] + MASA, s0 = r === NS - 1 ? Y0 : SY[r + 1] + MASA, s1 = SY[r] + MASA;
  for (const [a, b, kim] of S.bant.sutun) {
    const u = bantU(t, a, b); if (!u) continue;
    const ya = Math.max(s0, lerp(Y0, Y1, u[0])), yb = Math.min(s1, lerp(Y0, Y1, u[1])); if (yb - ya < 2) continue;
    for (const c of kim) { K.rect(SX[c] - 78, ya, 156, yb - ya, BANT, 0); K.line(SX[c] - 78, ya, SX[c] - 78, yb, 5, PAL.mustard); K.line(SX[c] + 78, ya, SX[c] + 78, yb, 5, PAL.mustard); }
  }
}

// Ayağa kalkanın arkasında açılan ışık (düz renk; kalkan herkese aynı): telefonda kimin kalktığı seçilsin diye.
function kalkanIsigi(K, kalk, P) {
  if (kalk < 0.02) return;
  const y1 = P.y + MASA, y0 = P.r === NS - 1 ? P.y - KALK - 74 : SY[P.r + 1] + MASA + 16, h = (y1 - y0) * Math.min(1, kalk * 1.15);
  K.rect(P.x - 74, y1 - h, 148, h, BANT, 0); K.line(P.x - 74, y1 - h, P.x + 74, y1 - h, 5, PAL.mustard);
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,                 // kart ve sayaç ekran katmanında (perdesiz sayaç)
  drift: 0.012,
  split: { h1: 2, h3: 6 },     // h3: "… çok yürüdü," | "en tembel şampiyon mu?" (tek balonda üç satıra taşıyordu)            // ikinci yarı Hikmet'in kendi plânıyla gelir
  // salon plânında Necmi'nin balon kuyruğu önündeki koltuğun (kesişim) yüzünden geçerdi: kuyruk çizilmez; son plânda da yok
  kuyruksuz: (t, B) => B.sc.id === 'final' || (B.sc.plan === 'salon' && H.captionAt(S.tlA, t)?.line.who === 'necmi'),
  // Salon plânı: kapalı formüllü doğrusal itme. Çapa noktası ekranda sabit kalır (üstte kart, altta altyazı payı korunur).
  kamera(cam, t, B) {
    const sc = B.sc; if (sc.plan !== 'salon') return;
    const say = sc.id === 'sayac', kanca = sc.id === 'kanca';   // kanca: düdükte 0,6 sn'lik itme (herkes oturuyor: üstte pay var), sonra yavaş doğrusal
    const z = say ? 1 + 0.07 * clamp01((t - S.tm.cd0) / 10) : kanca ? 1 + 0.035 * ease.enter(seg(t, S.tm.duduk, 0.6)) + 0.003 * t : 1 + Math.min(0.03, 0.006 * sc.lt), A = say ? 1150 : kanca ? 1250 : 700;
    Object.assign(cam, { zoom: z, cx: SALON_CX, cy: A + (960 - A) / z });
  },
  dunya(K, t, B) {
    const plan = B.sc.plan, { tm } = S;
    if (plan === 'salon') {
      M.mekanCiz(K, SALON, 'arka', t);
      hikmetCiz(K, t, tl, S, B, { x: HX, y: HY, k: 1 });
      for (let r = NS - 1; r >= 0; r--) {
        siraBandi(K, t, S, r); sutunBandi(K, t, S, r);
        for (const P of KISI) if (P.r === r) kalkanIsigi(K, kalkAt(S, t, P), P);
        for (const P of KISI) if (P.r === r) kisiCiz(K, t, tl, S, B, P, { x: P.x, y: P.y, k: 1, kes: SY[r] + MASA + 20 });
        if (r === 0) for (const P of KISI) if (P.r === 0) bacak(K, P.key, P.x, ON_ALT, ZEMIN + 26, sOf(P.key));
        siraMasasi(K, r);
      }
      if (B.sc.id === 'cevap') H.ring(K, [SX[KESISIM[1]], SY[KESISIM[0]] - 92], t, tm.kesisti, PAL.green);   // arşiv
    } else if (plan === 'hikmet') {
      M.mekanCiz(K, YAKIN, 'arka', t, { durum: { kim: 'hikmet' } });
      const s = sOf('hikmet', TK);
      hikmetCiz(K, t, tl, S, B, { x: TEK.hikmet, y: 900 + basY('hikmet') * s, k: TK });
    } else {
      M.mekanCiz(K, YAKIN, 'arka', t, { durum: { kim: plan } });
      const ref = KK[plan];
      for (const P of IKILI[plan]) {
        const a = kisiCiz(K, t, tl, S, B, P, { x: TEK[plan] + (P.x - ref.x) * TK, y: TEK_Y, k: TK, kes: TEK_Y + MASA * TK + 30 });
        if (P.key === 'defne' && B.sc.id === 'buldum') H.buldumIsin(K, t, tm.buldum, a.head, { son: tm.proof, k: 0.85 });
      }
      yakinMasa(K, TEK[plan], IKILI[plan], ref);
    }
  },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (bu bölüme özel): perde yok; alt bantta durur, on iki yüz açık kalır.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1346, r = 74;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 24, 68, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(596, 1306); ctx.scale(inU * out, inU * out);
  ctx.font = '900 50px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 60;
  K.rect(-bw / 2 + 8, -35 + 10, bw, 70, INK, 0, 35); K.rect(-bw / 2, -35, bw, 70, PAL.mustard, LW, 35);
  K.text('SEN DE DÜŞÜN!', 0, 18, 50, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(596, 1384); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56;
    K.rect(-sw / 2 + 8, -36 + 9, sw, 72, INK, 0, 36); K.rect(-sw / 2, -36, sw, 72, PAL.coral, LW, 36); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}
