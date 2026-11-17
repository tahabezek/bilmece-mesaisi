// Bölüm 54 · SON VAPUR 2: TANIDIK SAYISI (v4 "hikâye" dili; storyboard: hikayeler/bolum_054_v5.md). Mekanizma: güvercin yuvası.
// Biçim "önce cevap": kare 0'da "CEVAP: KESİN VAR" kapağı, sonra Kaptan Rıza'nın bahsi, 10 sn "NEDEN?" sayacı, Lâl'in açıklaması.
// Logline: Son vapurda 30 yolcu var. Kaptan Rıza bahse girer: vapurdaki tanıdığı sayısı aynı olan iki yolcu yoktur. Lâl tek tek
// sormaya kalkar, vapur yanaşmak üzeredir. Çaycı Bora dört bardağı üç gözlü tepsiye koyar, biri dolu göze düşer. Lâl "tanıdık
// sayısı rafı"nda gösterir: 0–29 arası 30 göz var, ama 0 ile 29 aynı anda dolamaz; 30 bilet 29 göze sığmaz.
// Akılda kalacak tek şey: 30 kişiye yalnız 29 olası sayı düşer; ikisi aynı olmak zorundadır.
// Seri çekirdeği (kadro, vapur, kapak, sayaç) engine/b053.js'ten gelir ve DEĞİŞTİRİLMEZ. Bu dosyanın kendi parçaları b054_ önekli.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import {
  SV, BOYU, svKisi, svOyna, rizaUst, lalUst, lalTepsi, yolcuCiz, bardak, boraTepsi,
  svManzara, svGuverte, svBankOn, svKart, svSayac,
} from './b053.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Mantık: tanıdık grafı (kodda denetlenir) ═══════════════════════════
// 30 yolcu için gerçek bir tanışıklık grafı kurulur (Havel–Hakimi). Derece dizisi 1…29 ve bir tane daha 15: 0 yok, 29 var.
// Denetim: (1) dizi gerçekten bir grafın derece dizisidir, (2) 29 tanıdığı olan varsa 0 tanıdığı olan yoktur,
// (3) farklı değer sayısı ≤ 29 < 30, yani iki yolcu aynı göze düşer, (4) aynı göze düşen değer 15'tir (raf bunu gösterir).
export const YOLCU = 30;
function havelHakimi(dizi) {
  const v = dizi.map((d, i) => ({ i, d })), E = [];
  for (;;) {
    v.sort((a, b) => b.d - a.d || a.i - b.i);
    if (!v.length || v[0].d === 0) break;
    const a = v.shift();
    if (a.d > v.length) return null;
    for (let j = 0; j < a.d; j++) { if (--v[j].d < 0) return null; E.push([a.i, v[j].i]); }
  }
  return E;
}
export function tanidikGrafi() {
  const dizi = [...Array.from({ length: 29 }, (_, i) => i + 1), 15];
  const E = havelHakimi(dizi), hata = [];
  if (!E) return { hata: ['derece dizisi graf değil'] };
  const der = new Array(YOLCU).fill(0), cift = new Set();
  for (const [a, b] of E) { if (a === b) hata.push('kendi kendini tanıyor'); const k = Math.min(a, b) + '-' + Math.max(a, b); if (cift.has(k)) hata.push('çift kenar'); cift.add(k); der[a]++; der[b]++; }
  if (der.some((d, i) => d !== dizi[i])) hata.push('dereceler diziyle uyuşmuyor');
  const has29 = der.includes(29), has0 = der.includes(0);
  if (has29 && has0) hata.push('0 ve 29 birlikte');
  const farkli = new Set(der).size;
  if (farkli > 29) hata.push('farklı değer 29dan fazla');
  const sayac = {}; der.forEach(d => sayac[d] = (sayac[d] || 0) + 1);
  const ayni = +Object.keys(sayac).find(k => sayac[k] >= 2);
  if (ayni !== 15) hata.push('aynı göz 15 değil: ' + ayni);
  // genel kural (her graf için): n kişide 0 ve n−1 birlikte olamaz → 2..8 kişilik bütün graflar taranır
  for (let n = 2; n <= 6; n++) {
    const kn = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) kn.push([a, b]);
    for (let m = 0; m < 1 << kn.length; m++) {
      const d = new Array(n).fill(0); kn.forEach(([a, b], j) => { if (m >> j & 1) { d[a]++; d[b]++; } });
      if (new Set(d).size === n) { hata.push(`n=${n}: hepsi farklı bir graf bulundu`); break; }
    }
  }
  return { E, der, ayni, uykucu: der.indexOf(29), hata };
}

// ═══════════════════════════ Figüranlar (b054_ kartları; oturan yolcular) ═══════════════════════════
// Basit figüran: yalnız oturur, başını çevirir, el sallar. Kimlik kartları dondurulmuş; palet b053 gecesine uyar (mor-mavi yok).
const FKART = (key, name, o) => ({
  key, name, role: 'figüran yolcu', seed: o.seed,
  head: { w: o.hw || 0.9, h: 1, ear: 0.12 }, neck: 0.06,
  torso: { len: 0.86, shoulder: 0.7, hip: 0.66, depth: 0.48, belly: o.belly || 0.05, color: o.renk, shade: o.golge },
  arm: { upper: 0.4, lower: 0.38, w: 0.19, color: o.renk, shade: o.golge, hand: 0.12 },
  leg: { upper: 0.42, lower: 0.4, w: 0.2, color: o.bacak || '#3A3631', shade: '#2E2B27' },
  shoe: { color: '#2A1E17', len: 0.3, h: 0.11 },
  skin: o.ten, skinShade: o.tenG, hair: o.sac,
  eyes: { gap: 0.33, w: 0.18, h: 0.22, y: 0.04 }, line: 0.05, idle: { blink: o.blink || [2.6, 5.4] },
  features: o.f,
});
const FIGURAN = {
  b054_fA: FKART('b054_fA', 'Kiremit paltolu kadın', { seed: 541, renk: '#9A4E3A', golge: '#7E3E2E', ten: '#E3B48C', tenG: '#C99A72', sac: '#3A2A20', f: ['hairLong', 'earrings', 'lashes'] }),
  b054_fB: FKART('b054_fB', 'Gözlüklü yaşlı adam', { seed: 542, renk: '#5C6B4A', golge: '#4A5739', ten: '#D9A27A', tenG: '#BF875F', sac: '#B9B4AE', belly: 0.12, f: ['baldSides', 'glassesReading', 'mustacheThin'], blink: [3, 6] }),
  b054_fC: FKART('b054_fC', 'Hardal montlu genç', { seed: 543, renk: '#B88A3A', golge: '#9A722E', ten: '#C98F68', tenG: '#AE7650', sac: '#1E1915', f: ['hairSpiky'] }),
  b054_fD: FKART('b054_fD', 'Topuzlu teyze', { seed: 544, renk: '#6F7A6A', golge: '#5C6658', ten: '#E0AE88', tenG: '#C5926C', sac: '#5A3A24', f: ['bun', 'glassesCat', 'lashes'] }),
};
for (const [k, v] of Object.entries(FIGURAN)) if (!H.CARDS[k]) H.CARDS[k] = v;
const FBOY = 222;

// Oturan figüran (önden). o = { bak: [x, y], tilt, expr, salla: 0..1 (sağ el başın yanında sallanır), sallaT, yon: ±1 (salladığı taraf) }
function oturan(K, key, x, t, o = {}) {
  const c = H.CARDS[key], s = FBOY;
  const p = H.charBase(key, {
    view: 'front', x, y: 0, s, legL: { hip: 14, knee: 176 }, legR: { hip: 14, knee: 176 },
    head: { tilt: o.tilt || 0, look: o.bak || [0, 0.4], nod: 0 }, expr: o.expr || 'notr',
  });
  p.y = OTURAK - 0.02 * s - H.eklem(key, p, 'pelvis')[1];
  const nk = H.eklem(key, p, 'neck'), pl = H.eklem(key, p, 'pelvis'), yK = lerp(nk[1], pl[1], 0.8);
  H.reach(key, p, 'L', [x - 0.12 * s, yK], 1, 'B');
  H.reach(key, p, 'R', [x + 0.12 * s, yK], 1, 'B');
  const w = o.salla || 0;
  if (w > 0.01) {   // el sallama: sağ (ya da sol) el başın yanına kalkar, iki kez sallanır
    const sd = (o.yon || 1) > 0 ? 'R' : 'L', sh = H.shoulder(key, p, sd), m = sd === 'R' ? 1 : -1;
    const sal = Math.sin(TAU * 2.2 * Math.max(0, t - (o.sallaT || 0))) * 0.09 * s;
    H.reach(key, p, sd, [sh[0] + m * 0.3 * s + sal, sh[1] - 0.5 * s], w, 'B');
  }
  const kneeY = OTURAK + 0.06 * s, { ctx } = K;
  for (const sx of [-1, 1]) {
    const kx = x + sx * 0.18 * s, fx = x + sx * 0.21 * s;
    K.line(kx, kneeY, fx, BANK_ZEMIN - 0.06 * s, c.leg.w * s + LW * 2, INK); K.line(kx, kneeY, fx, BANK_ZEMIN - 0.06 * s, c.leg.w * s, c.leg.color);
    K.ell(fx + sx * 0.03 * s, BANK_ZEMIN - 0.03 * s, c.shoe.len * 0.38 * s, c.shoe.h * 0.55 * s, c.shoe.color, LW * 0.8);
  }
  K.poly([[pl[0] - 0.35 * s, pl[1] - 0.08 * s], [pl[0] + 0.35 * s, pl[1] - 0.08 * s], [x + 0.37 * s, kneeY + 0.04 * s], [x + 0.04 * s, kneeY + 0.09 * s], [x - 0.04 * s, kneeY + 0.09 * s], [x - 0.37 * s, kneeY + 0.04 * s]], c.torso.shade, LW);
  K.line(x, pl[1] - 0.02 * s, x, kneeY + 0.07 * s, LW * 0.7);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 3 * s, -5000, 6 * s, pl[1] + 0.02 * s + 5000); ctx.clip();
  const r = H.drawChar(ctx, key, p, t);
  ctx.restore();
  return r;
}

// ═══════════════════════════ Bilet ve deste ═══════════════════════════
// Vapur bileti: krem, solda mercan şerit, ortada tırtıklı çizgi. (x, y) merkez, a açı, k ölçek (1 = 50 × 26 px)
function bilet(K, x, y, a = 0, k = 1) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
  K.rect(-25, -13, 50, 26, PAL.cream, LW * 0.5, 3);
  ctx.fillStyle = PAL.coral; ctx.fillRect(-23, -11, 10, 22);
  ctx.setLineDash([3, 3]); K.line(-8, -10, -8, 10, 2, '#9B8F78'); ctx.setLineDash([]);
  K.line(-2, -4, 17, -4, 3, '#9B8F78'); K.line(-2, 4, 11, 4, 3, '#9B8F78');
  ctx.restore();
}
// Bilet destesi (elde): n kalan bilet sayısı, acik 0..1 yelpaze açıklığı. Yelpaze yukarı doğru açılır.
function deste(K, [x, y], n, acik = 0, { k = 1.5, rot = 0 } = {}) {
  const kat = Math.max(1, Math.min(7, Math.ceil(n / 4.3)));
  for (let i = 0; i < kat; i++) {
    const u = kat === 1 ? 0 : i / (kat - 1) - 0.5, a = rot + u * 1.5 * acik;
    bilet(K, x + Math.sin(a) * 26 * k, y - Math.cos(a) * 26 * k + (1 - acik) * i * -2, a - Math.PI / 2, k);
  }
}

// ═══════════════════════════ Tanıdık sayısı rafı (kahraman nesne) ═══════════════════════════
// 6 sütun × 5 sıra = 30 göz, 0'dan 29'a. Her gözün üstünde bilet yuvası (koyu), altında numara levhası (36 px).
// Yer: güvertenin sağ yanında (dünya x 1550–2078), küpeştenin önünde, iki ayak üstünde.
const RAF = { x0: 1550, y0: 840, cw: 82, ch: 92, pad: 18, cols: 6, rows: 5 };
RAF.w = RAF.cols * RAF.cw + RAF.pad * 2; RAF.h = RAF.rows * RAF.ch + RAF.pad * 2;
const goz = i => { const c = i % RAF.cols, r = Math.floor(i / RAF.cols); return [RAF.x0 + RAF.pad + c * RAF.cw, RAF.y0 + RAF.pad + r * RAF.ch]; };
const gozYuva = i => { const [gx, gy] = goz(i); return [gx + RAF.cw / 2, gy + 34]; };   // biletin oturduğu nokta
// d: { bilet(i) → 0|1|2, kilit(i) → 0..1, isik(i) → 0..1 (hardal levha), yesil(i) → 0..1 }
function rafCiz(K, d) {
  const { ctx } = K, { x0, y0, w, h } = RAF;
  for (const lx of [x0 + 34, x0 + w - 50]) K.rect(lx, y0 + h - 10, 16, GUVERTE + 22 - (y0 + h - 10), SV.demir, LW * 0.6);
  K.rect(x0 + 10, y0 + 12, w, h, INK, 0, 10);
  K.rect(x0, y0, w, h, '#8A5C31', LW, 10);
  K.rect(x0 + 10, y0 + 10, w - 20, h - 20, '#5A3A24', LW * 0.6, 4);
  // başlık levhası
  ctx.font = '900 40px Rubik'; const yazi = K.up('Tanıdık sayısı'), bw = ctx.measureText(yazi).width + 50;
  K.rect(x0 + w / 2 - bw / 2, y0 - 66, bw, 60, SV.levha, LW, 8); K.text(yazi, x0 + w / 2, y0 - 22, 40, SV.levhaYazi, 900);
  for (let i = 0; i < YOLCU; i++) {
    const [gx, gy] = goz(i), kl = d.kilit(i), yz = d.yesil(i), is = d.isik(i);
    K.rect(gx + 4, gy + 4, RAF.cw - 8, 44, H.mixHex('#2B2420', PAL.coral, kl), LW * 0.6, 4);
    if (kl > 0.02) {   // kilit: yuva mercan, üstüne krem çarpı
      ctx.save(); ctx.globalAlpha = kl; ctx.lineCap = 'round';
      const cx = gx + RAF.cw / 2, cy = gy + 27; K.line(cx - 13, cy - 13, cx + 13, cy + 13, 7, PAL.paper); K.line(cx + 13, cy - 13, cx - 13, cy + 13, 7, PAL.paper);
      ctx.restore();
    }
    const n = d.bilet(i), [bx, by] = gozYuva(i);
    if (n === 1) bilet(K, bx, by, (i % 3 - 1) * 0.05, 1);
    if (n >= 2) { bilet(K, bx - 13, by + 2, -0.2, 1); bilet(K, bx + 13, by - 4, 0.18, 1); }
    const lev = H.mixHex(H.mixHex(PAL.cream, PAL.mustard, is), PAL.green, yz);
    K.rect(gx + 4, gy + 51, RAF.cw - 8, 38, lev, LW * 0.6, 4);
    K.text(String(i), gx + RAF.cw / 2, gy + 84, 38, yz > 0.5 ? PAL.paper : INK, 900);
    if (yz > 0.02) { ctx.save(); ctx.globalAlpha = yz; ctx.lineWidth = 8; ctx.strokeStyle = PAL.green; ctx.strokeRect(gx + 1, gy + 1, RAF.cw - 2, RAF.ch - 2); ctx.restore(); }
  }
}

// ═══════════════════════════ Ölçüler ═══════════════════════════
const LAL_X = 580, RIZA_X = 850, BORA_X = 1030, UYKUCU_X = 345, LAL_RAF = 1400;
const OTURAK = 1296, BANK_ZEMIN = 1440, BANK = [-320, 1330], GUVERTE = 1420;
// Bankta oturanlar (soldan sağa). Lâl 520'yi, Rıza 860'ı, Bora 1030'u kısmen örter; kalabalık kadraj dışına da taşar.
const SIRA = [[-150, 'b054_fB'], [15, 'b054_fA'], [180, 'b054_fC'], [520, 'b054_fD'], [690, 'b054_fB'], [870, 'b054_fC'], [1240, 'b054_fD']];
const ESLER = [[0, 1], [2, -1], [3, 4], [5, 6]];   // sohbet eden komşular (−1 = uykucu)
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// Bora'nın ipucu: üç gözlü tepsi (halkalar dx −40, 0, 40) ve yandaki sehpada dört bardak
const HALKA = [-58, 0, 58], SEHPA = [1104, 1300];
const SEHPA_B = [[1112, 1300], [1142, 1300], [1172, 1300], [1202, 1300]];   // sehpadaki bardakların tabanı (tek sıra, dördü de seçilir)
const BH = 70;   // bardak boyu
const UYANIK = { ...H.EXPR.mutlu, smileEyes: false, eye: 1.15 };   // uyanan uykucu: gözler açık gülüş (kapalı göz uyku sanılmasın)

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const G = tanidikGrafi();
  if (G.hata.length) console.error('mantık hatası: ' + G.hata.join('; '));
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    otuz: T('h1:2'), taniyor: T('h1:8'), h1s: T('h1>'),
    h2a: T('h2a'), tanidigi: T('h2a:3'), iki: T('h2a:7'), h2as: T('h2a>'),
    h3: T('h3'), simit: T('h3:2'), h3s: T('h3>'),
    d2: T('d2'), sor: [T('d2:0'), T('d2:1'), T('d2:2')], d2s: T('d2>'),
    hd: T('hd'), yanas: T('hd:1'), bitmez: T('hd:2'), saymadan: T('hd:3'), hds: T('hd>'),
    d4: T('d4'), sifirdan: T('d4:2'), dokuza: T('d4:4'), otuzGoz: T('d4:7'), d4s: T('d4>'),
    d5: T('d5'), yirmi29: T('d5:1'), herkesi: T('d5:4'), sifir: T('d5:6'), d5s: T('d5>'),
    d5b: T('d5b'), d5bYirmi: T('d5b:2'), gozKalir: T('d5b:4'), ayniT: T('d5b:8'), goze: T('d5b:9'), duser: T('d5b:10'), d5bs: T('d5b>'),
    h4: T('h4'), uykucu: T('h4:1'), kimseyi: T('h4:2'), sifirH: T('h4:5'), h4s: T('h4>'),
    d6: T('d6'), cta: T('d6') - 0.15,
  };
  tm.kesBahis = tm.h2a - 0.1; tm.kesDeneme = tm.d2 - 0.1; tm.kesRaf = tm.d4 - 0.15; tm.espri = tm.h4 - 0.12;
  tm.ver = tm.saymadan - 0.1;                                       // Rıza desteyi Lâl'e verir
  tm.uyan = tm.h4s + 0.08;                                          // espri: uykucu uyanır, herkes ona el sallar
  tm.selam = tm.uyan + 0.2;
  // raf: d4'te 0 → 29 tarama; d5'te 29'a bilet, "sıfır"da 0 kilitlenir; d5b'de 1–28 dağıtılır, 30. bilet dolu göze düşer
  tm.tara = [tm.sifirdan, tm.dokuza + 0.1];
  tm.kilit = tm.sifir - 0.04;
  const ucus = [{ g: 29, t0: tm.yirmi29 - 0.05, d: 0.5 }];
  const dag0 = tm.d5b + 0.2, adim = 0.052;
  for (let g = 1; g <= 28; g++) ucus.push({ g, t0: dag0 + (g - 1) * adim, d: 0.42 });
  ucus.push({ g: G.ayni ?? 15, t0: tm.goze - 0.62, d: 0.62, son: true });
  tm.ucus = ucus; tm.ayni = G.ayni ?? 15; tm.yesil = tm.goze + 0.02;
  // sayaç: Lâl desteye bakar, parmakla sayar; Rıza belinde eli; son 5,4 sn Bora dört bardağı üç halkaya koyar
  tm.lalDusun = [cd0 + 0.4, cd0 + 2.0]; tm.lalSay = cd0 + 2.2;
  tm.boraKam = cd - 7.2;
  tm.koy = [0, 1, 2, 3].map(i => cd - 6.6 + i * 1.2);              // her bardak: 0,26 sn uzanma, 0,56 sn taşıma, 0,38 sn ara
  tm.koyBit = tm.koy[3] + 0.82; tm.lalBak = tm.koyBit - 0.3;

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 0.98, 560, 1000], [tm.h1s - 0.3, 1.02, 566, 1004]] },
    { id: 'bahis', t0: tm.kesBahis, cam: [[0, 1.3, 722, 1080], [tm.iki, 1.32, 716, 1078], [tm.simit - 0.2, 1.27, 700, 1084]] },
    { id: 'deneme', t0: tm.kesDeneme, cam: [[0, 1.02, 470, 1010], [tm.yanas - 0.1, 1.0, 560, 996], [tm.saymadan, 1.04, 600, 1006]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 0.97, 540, 994], [cd0 + 1.4, 0.99, 548, 998], [tm.boraKam, 1.46, 1050, 1222]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, LAL_X, 1108]] },
    { id: 'raf', t0: tm.kesRaf, cam: [[0, 1.18, 1745, 1150], [tm.d5, 1.2, 1748, 1148], [tm.d5b, 1.18, 1746, 1150], [tm.goze - 0.35, 1.46, gozYuva(G.ayni ?? 15)[0] - 30, gozYuva(G.ayni ?? 15)[1] + 70]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.12, 570, 1040], [tm.uyan, 1.15, 556, 1046]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.34, LAL_X + 20, 1100], [tm.cta + 1.6, 1.38, LAL_X + 16, 1098]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— Rıza (önden) ———
  const rizBase = svKisi('b053_riza', { x: RIZA_X, expr: 'mutlu', head: { tilt: -4, look: [-0.7, 0.35] }, ...POZ.dur });
  const riz = [
    [tm.taniyor - 0.2, { head: { tilt: 3, look: [-0.8, 0.5] } }, 0.3],
    [tm.kesBahis, { expr: 'mutlu', head: { tilt: -3, look: [-0.4, 0.1] } }, 0.01],
    [tm.simit - 0.1, { head: { tilt: 4, look: [-0.9, 0.55] } }, 0.3],
    [tm.kesDeneme, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.3] } }, 0.01],
    [tm.hd - 0.1, { expr: 'mutlu', head: { tilt: 4, look: [0.6, -0.2] } }, 0.3],
    [tm.saymadan - 0.1, { head: { tilt: -4, look: [-0.9, 0.3] } }, 0.3],
    [cd0, { expr: 'mutlu', ...POZ.belde, head: { tilt: 3, look: [-0.6, 0.2] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'saskin', armL: POZ.dur.armL, head: { tilt: -4, look: [-0.9, 0.1] } }, 0.25],
    [tm.espri, { expr: 'mutlu', armL: POZ.dur.armL, head: { tilt: -3, look: [-0.85, 0.5] } }, 0.01],
    [tm.selam + 0.15, { expr: 'saskin', head: { tilt: -6, look: [-0.8, 0.4] } }, 0.3],
    [tm.selam + 0.6, { expr: 'korku', ...POZ.teslim, head: { tilt: 6, look: [-0.2, 0.1] } }, 0.35],
  ];
  // ——— Lâl (önden) ———
  const lalBase = svKisi('b053_lal', { x: LAL_X, expr: 'saskin', head: { tilt: 4, look: [0.8, 0.25] }, ...POZ.dur });
  const lal = [
    [tm.otuz, { head: { tilt: -3, look: [-0.7, 0.4] } }, 0.3],
    [tm.kesBahis, { expr: 'notr', head: { tilt: 4, look: [0.85, 0.15] } }, 0.01],
    [tm.simit, { expr: 'mutlu', head: { tilt: -4, look: [0.2, 0.7] } }, 0.3],
    [tm.kesDeneme, { expr: 'mutlu', head: { tilt: -4, look: [-0.85, 0.35] } }, 0.01],
    [tm.yanas, { expr: 'saskin', head: { tilt: 4, look: [0.8, -0.1] } }, 0.3],
    [tm.saymadan - 0.2, { expr: 'saskin', head: { tilt: 3, look: [0.8, 0.3] } }, 0.3],
    [tm.lalDusun[0], { expr: IFADE.dusun, head: { tilt: 6, look: [0.4, 0.6] } }, 0.4],
    [tm.lalDusun[1], { expr: IFADE.dusun2, head: { tilt: -4, look: [0.2, 0.7] } }, 0.35],
    [tm.lalBak, { expr: 'notr', head: { tilt: 5, look: [0.85, 0.45] } }, 0.3],
    [tm.koyBit + 0.4, { expr: 'saskin', head: { tilt: -3, look: [0.8, 0.3] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.1, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.kesRaf, { x: LAL_RAF, expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.9, -0.1] } }, 0.01],
    [tm.dokuza, { head: { tilt: 2, look: [0.95, 0.4] } }, 0.35],
    [tm.d5b, { head: { tilt: 4, look: [0.9, 0.1] } }, 0.3],
    [tm.goze, { expr: 'mutlu', head: { tilt: -3, look: [0.9, 0.0] } }, 0.3],
    [tm.espri, { x: LAL_X, expr: 'mutlu', head: { tilt: -3, look: [0.8, 0.2] } }, 0.01],
    [tm.uykucu, { head: { tilt: 4, look: [-0.8, 0.4] } }, 0.3],
    [tm.selam + 0.6, { head: { tilt: -4, look: [0.8, 0.2] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -5, look: [0.05, 0.05] } }, 0.01],
  ];
  // ——— Bora (önden, konuşmaz) ———
  const borBase = svKisi('b053_bora', { x: BORA_X, expr: 'notr', head: { tilt: -4, look: [-0.7, 0.3] }, ...POZ.dur });
  const bor = [
    [tm.simit, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.2] } }, 0.3],
    [tm.kesDeneme, { expr: 'notr', head: { tilt: -3, look: [-0.8, 0.2] } }, 0.01],
    [cd0 + 1.5, { head: { tilt: -5, look: [-0.8, 0.4] } }, 0.35],
    [tm.koy[0] - 0.3, { expr: 'mutlu', head: { tilt: 4, look: [0.3, 0.8] } }, 0.3],
    [tm.koyBit + 0.1, { head: { tilt: -4, look: [-0.9, 0.2] } }, 0.3],
    [tm.buldum, { expr: 'mutlu', head: { tilt: 5, look: [-0.9, 0.0] } }, 0.25],
    [tm.espri, { expr: 'notr', head: { tilt: -3, look: [-0.8, 0.4] } }, 0.01],
    [tm.selam, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.4] } }, 0.3],
  ];
  return { tm, film, G, rizBase, riz, lalBase, lal, borBase, bor };
}

// ═══════════════════════════ Dünyanın durumu (tek kaynak) ═══════════════════════════
// yer: vapurun konumu (0 Karaköy … 1 Kadıköy). Yavaş ilerler; "yanaşmadan"da Kadıköy yaklaşır; espride iskeleye yanaşmıştır.
function yerAt(S, t) {
  const { tm } = S;
  const u = W(t, tm.yanas - 0.35, 3.2);
  return Math.min(1, 0.42 + 0.006 * t + 0.24 * u + 0.008 * Math.max(0, t - tm.hds) + 0.12 * W(t, tm.espri - 2, 3));
}
// Raftaki biletler: bir göze inmiş (t ≥ t0 + d) bilet sayısı
function rafDurum(S, t) {
  const { tm } = S, sayi = new Array(YOLCU).fill(0), ucan = [];
  for (const u of tm.ucus) { if (t >= u.t0 + u.d) sayi[u.g]++; else if (t >= u.t0) ucan.push(u); }
  const tara = i => H.nabiz(t, lerp(tm.tara[0], tm.tara[1], i / 29), 0.3);
  const uc = i => (i === 0 || i === 29) ? W(t, i === 0 ? tm.tara[0] - 0.04 : tm.tara[1] - 0.04, 0.2) * (1 - W(t, tm.d5b, 0.3)) : 0;
  return {
    sayi, ucan,
    bilet: i => sayi[i], kilit: i => i === 0 ? W(t, tm.kilit, 0.3) : 0,
    isik: i => Math.max(tara(i) * 0.9, uc(i)), yesil: i => i === tm.ayni ? W(t, tm.yesil, 0.25) : 0,
    kalan: YOLCU - tm.ucus.filter(u => t >= u.t0).length,
  };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  kartSon: -1,
  split: { h2a: 4, d4: 6, d5b: 6 },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    svKart(K, t, ep, { kapak: ep.kapak || 'KESİN VAR', donus: tm.tanidigi - 0.05, son: tm.proof });
    svSayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    etiketler(K, t, S, B);
  },
});

function etiketler(K, t, S, B) {
  const { tm } = S, id = B.sc.id;
  if (id === 'kanca') H.tag(K, t, tm.otuz - 0.04, tm.h1s + 0.2, [540, 660], '30 YOLCU', PAL.mustard, INK, 56, [tm.taniyor]);
  if (id === 'deneme') {
    // tek tek sorma sayacı: 1, 2, 3 … ve "bitmez"de mercan + ✗ (otuz kişiye yetişmez)
    const a = [[tm.sor[0], '1 / 30', PAL.paper, INK], [tm.sor[1], '2 / 30', PAL.paper, INK], [tm.sor[2], '3 / 30', PAL.paper, INK], [tm.bitmez - 0.04, '3 / 30', PAL.coral, PAL.paper]];
    const hw = H.adimEtiket(K, t, a, tm.hds + 0.3, [330, 660], 56);
    H.mark(K, t, tm.bitmez + 0.12, tm.hds + 0.3, [330 + hw + 40, 660], false);
  }
  if (id === 'raf') {
    H.tag(K, t, tm.otuzGoz - 0.04, tm.d5 + 0.6, [540, 400], '30 GÖZ', PAL.mustard, INK, 56, [tm.otuzGoz + 0.2]);
    H.tag(K, t, tm.d5b - 0.04, tm.goze - 0.4, [340, 400], '30 YOLCU', PAL.mustard, INK, 52);
    H.tag(K, t, tm.gozKalir - 0.34, tm.goze - 0.4, [740, 400], '29 GÖZ', PAL.coral, PAL.paper, 52);
    const g = B.ekr([gozYuva(tm.ayni)[0], gozYuva(tm.ayni)[1] - 6]);
    void g;
  }
  if (id === 'espri' && B.uykucuBas) {
    const p = B.ekr([UYKUCU_X, B.uykucuBas[1] - 210]);
    H.adimEtiket(K, t, [[tm.kimseyi, '0 TANIDIK', PAL.coral, PAL.paper], [tm.selam + 0.25, '29 TANIDIK', PAL.green, PAL.paper]], tm.cta - 0.2, [Math.max(330, p[0]), p[1]], 52);
  }
}

// ═══════════════════════════ sahne (dünya) ═══════════════════════════
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, yer = yerAt(S, t);
  svManzara(K, t, { yer, safak: 0 }, { x0: -700, x1: 2700 });
  svGuverte(K, t, { x0: -600, x1: 2700, bank: BANK, fenerler: [40, 1060, 2330] });
  if (id === 'raf') return rafSahne(K, t, tl, S, B);

  // ——— bankta oturanlar: figüranlar + uykucu ———
  svBankOn(K, BANK, OTURAK);
  const espri = id === 'espri' || id === 'cta';
  const figuranlar = () => SIRA.forEach(([x, key], i) => {
    // sohbet döngüsü: eşler birbirine döner (tohumsuz sabit faz), konuşmayan ileri bakar
    const es = ESLER.findIndex(e => e.includes(i)), ben = es >= 0 ? ESLER[es].indexOf(i) : -1;
    const faz = (t * 0.32 + es * 0.37) % 1, don = es >= 0 ? clamp01(Math.min((faz - 0.1) / 0.08, (0.55 - faz) / 0.08)) : 0;
    const yon = ben === 0 ? 1 : -1;
    let bak = [yon * 0.85 * don, 0.45 - 0.1 * don], tilt = yon * 5 * don, expr = don > 0.5 ? 'mutlu' : 'notr', salla = 0, sallaT = 0, yonEl = yon;
    if (id === 'kanca' && i === 1) { salla = pIn(t, tm.taniyor - 0.2, tm.taniyor + 0.9, 0.28); sallaT = tm.taniyor; bak = [0.85, 0.45]; tilt = 5; expr = 'mutlu'; yonEl = 1; }
    if (id === 'kanca' && i === 0) { bak = [-0.85 * -1, 0.45]; }
    if (espri && t >= tm.selam - 0.3) {   // herkes uyanan uykucuya döner ve el sallar
      const k = tm.selam + i * 0.06, sol = x > UYKUCU_X ? -1 : 1;
      bak = [sol * 0.9, 0.45]; tilt = sol * 5; expr = 'mutlu';
      salla = pIn(t, k, tm.cta + 0.6, 0.28); sallaT = k; yonEl = x < UYKUCU_X && x > UYKUCU_X - 200 ? -sol : sol;   // uykucuya dönük eliyle sallar; hemen solundaki dış eliyle (kol uykucunun arkasında kalmasın)
    }
    oturan(K, key, x, t, { bak, tilt, expr, salla, sallaT, yon: yonEl });
  });
  figuranlar();
  // uykucu (b053 kimliği): hep uyur; espride uyanır, gülümser
  const uyan = espri ? W(t, tm.uyan, 0.35) : 0;
  const Y = yolcuCiz(K, {
    x: UYKUCU_X, oturak: OTURAK, zemin: BANK_ZEMIN, uyku: 1 - uyan, kol: { kucak: 1 - 0.6 * uyan, ayar: 0.6 * uyan },
    bas: { tilt: -3, look: [0.3, 0.3] }, expr: uyan > 0.5 ? UYANIK : 'notr', saatL: 23.75, saatR: 23.75, t,
  });
  B.uykucuBas = Y.head;

  // ——— Rıza: destesi sol elinde (kanca: kalabalığa uzatır; bahis: göğsünde, tablayı gösterir; deneme: iskeleyi gösterir, desteyi verir) ———
  const rp = H.poseAt(H.CARDS.b053_riza, S.rizBase, S.riz, t), ro = { heads };
  let desteR = null, desteAcik = 0;
  const V = H.elVer(t, tm.ver, [RIZA_X - 190, 1150], [LAL_X + 112, 1168], { kaldir: 30 });
  if (id === 'kanca') {
    const w = W(t, 0.25, 0.32), A = kar([RIZA_X - 110, 1200], [RIZA_X - 170, 1080], w);
    ro.L = [[A[0] + 4, A[1] + 22], 1, 'B']; desteR = A; desteAcik = W(t, 0.3, 0.4);
    if (id === 'kanca') ro.R = null;
  }
  if (id === 'bahis') {
    const g = pIn(t, tm.simit - 0.3, tm.h3s + 0.1, 0.3), A = kar([RIZA_X - 120, 1170], [LAL_X + 200, 1215], g);
    ro.L = [[A[0] + 4, A[1] + 22], 1, 'B']; desteR = A; desteAcik = 1 - 0.6 * g;
    const w = pIn(t, tm.iki - 0.3, tm.h3 - 0.1, 0.28);
    if (w > 0.01) ro.R = [H.elYeri('b053_riza', rp, 'R', 'yukari'), w, 'B'];
  }
  if (id === 'deneme') {
    const A0 = [RIZA_X - 120, 1170], toV = W(t, tm.ver - 0.35, 0.3), A = t < V.tB ? (t < tm.ver ? kar(A0, [RIZA_X - 190, 1150], toV) : V.p) : null;
    if (A) { ro.L = [[A[0] + 4, A[1] + 22], t < tm.ver ? 1 : V.verW, 'B']; desteR = A; desteAcik = 0.4; }
    else if (t < V.tS + 0.3) ro.L = [[RIZA_X - 190, 1172], V.verW, 'B'];
    const w = pIn(t, tm.yanas - 0.3, tm.saymadan - 0.25, 0.28);
    if (w > 0.01) ro.R = [[RIZA_X + 170, 1010], w, 'B'];
  }
  if (id === 'espri') {
    const w = pIn(t, tm.uykucu - 0.3, tm.selam + 0.4, 0.28);
    if (w > 0.01) ro.L = [[RIZA_X - 190, 1090], w, 'B'];
  }
  if (id === 'sayac') H.glance(rp, t, tm.cd - 0.3, 9);
  const rc = svOyna(K, t, tl, 'b053_riza', rp, ro);
  rizaUst(K, rp);
  if (desteR) { deste(K, [rc.handL[0], rc.handL[1] - 20], YOLCU, desteAcik); rc.tut('L'); }
  if (id === 'bahis' && ro.R && ro.R[1] > 0.5) rc.parmak('R', 2 * clamp01((t - tm.iki + 0.05) / 0.2), { toplam: 2, ac: 0.3 });
  if (id === 'deneme' && ro.R && ro.R[1] > 0.5) rc.isaret('R', [RIZA_X + 260, 900]);
  if (id === 'espri' && ro.L && ro.L[1] > 0.5) rc.isaret('L', [UYKUCU_X + 60, Y.head[1]]);

  // ——— Bora: üç halkalı tepsi sol elinde (önünde); sayacın sonunda dört bardağı sehpadan üç halkaya taşır ———
  const bp = H.poseAt(H.CARDS.b053_bora, S.borBase, S.bor, t), bo = { sessiz: true };
  const bR = H.shoulder('b053_bora', bp, 'R');
  const tepsiEl = [BORA_X - 4, 1212];
  bo.L = [tepsiEl, 1, 'B'];
  const tepsiYuz = dx => [tepsiEl[0] + dx, tepsiEl[1] + 118 + 4];
  // bardakların yeri: tm.koy[i]'den önce sehpada, sonra taşınır; dördüncü üçüncü halkaya düşer, ikisi yan yana sıkışır
  const ipucu = t >= tm.koy[0] - 0.4 && id !== 'kanca' && id !== 'bahis' && id !== 'deneme';
  const hedefDx = [HALKA[0], HALKA[1], HALKA[2] - 9, HALKA[2] + 17];   // dördüncü, dolu üçüncü yuvaya sıkışır ve yana yatar
  const bardakYer = i => {
    if (!ipucu || t < tm.koy[i] + 0.26) return { p: SEHPA_B[i], tepside: false };
    const A = SEHPA_B[i], Bt = tepsiYuz(hedefDx[i]);
    if (i === 2 && t >= tm.koy[3] + 0.55) return { p: tepsiYuz(lerp(HALKA[2], hedefDx[2], W(t, tm.koy[3] + 0.55, 0.2))), tepside: true };
    if (i === 2) return { p: t < tm.koy[2] + 0.82 ? H.tasi(t, tm.koy[2] + 0.26, 0.56, A, tepsiYuz(HALKA[2]), 50) : tepsiYuz(HALKA[2]), tepside: t >= tm.koy[2] + 0.82 };
    return { p: t < tm.koy[i] + 0.82 ? H.tasi(t, tm.koy[i] + 0.26, 0.56, A, Bt, 50) : Bt, tepside: t >= tm.koy[i] + 0.82 };
  };
  let elde = -1;
  if (id === 'sayac') for (let i = 0; i < 4; i++) if (t >= tm.koy[i] && t < tm.koy[i] + 0.9) elde = i;
  if (elde >= 0) {
    const i = elde, b = bardakYer(i).p, w = pIn(t, tm.koy[i], tm.koy[i] + 0.82, 0.26, 0.12);
    bo.R = [[b[0] + 2, b[1] - BH + 8], Math.max(w, i > 0 && t < tm.koy[i] + 0.1 ? 1 : 0), 'A'];
  } else if (id === 'sayac' && t >= tm.koy[0] - 0.3 && t < tm.koyBit + 1.2) {
    const w = pIn(t, tm.koyBit - 0.05, tm.koyBit + 1.0, 0.25);
    if (w > 0.01) bo.R = [[tepsiYuz(HALKA[2])[0] + 30, tepsiYuz(0)[1] - 70], w, 'A'];
  }

  // ——— Lâl (tabla önünde): deneme'de sol eliyle oturanları tek tek gösterir; desteyi alır; sayaçta destede sayar ———
  const lp = H.poseAt(H.CARDS.b053_lal, S.lalBase, S.lal, t); lp.y -= H.buldumHop(t, tm.buldum);
  const lo = { heads };
  let desteL = null, gosterL = null;
  if (id === 'deneme') {
    const hedef = [[UYKUCU_X + 20, 1010], [180, 1020], [15, 1030]];
    let k = 0; for (let i = 0; i < 3; i++) if (t >= tm.sor[i] - 0.15) k = i;
    const w = pIn(t, tm.sor[0] - 0.4, tm.yanas - 0.2, 0.28);
    if (w > 0.01) { lo.L = [kar([LAL_X - 170, 1100], [LAL_X - 200, 1090], k / 2), w, 'B']; gosterL = hedef[k]; }
    if (t >= V.tK - 0.3) { lo.R = [[V.p[0] - 4, V.p[1] + 22], t < V.tK ? V.alW : 1, 'B']; if (t >= V.tB) desteL = V.p; }
  }
  const tutar = id === 'sayac' || id === 'buldum' || id === 'espri' || id === 'cta';
  if (tutar) {
    let A = [LAL_X + 110, 1166];
    if (id === 'buldum') A = null;
    if (id === 'cta') A = kar([LAL_X + 110, 1166], [LAL_X + 120, 1040], W(t, tm.cta + 0.25, 0.45));
    if (A) { lo.R = [[A[0] - 4, A[1] + 22], 1, 'B']; desteL = A; }
  }
  if (id === 'sayac') {
    const w = pIn(t, tm.lalSay - 0.2, tm.lalBak - 0.3, 0.3);
    if (w > 0.01) lo.L = [[LAL_X + 40, 1160], w, 'B'];
  }
  if (id === 'espri' && t >= tm.selam - 0.1) {   // uyanan uykucuya el sallar
    const w = pIn(t, tm.selam + 0.12, tm.cta + 0.6, 0.28), sh = H.shoulder('b053_lal', lp, 'L'), s = lp.s, sal = Math.sin(TAU * 2.2 * Math.max(0, t - tm.selam + 0.12)) * 0.1 * s;
    if (w > 0.01) lo.L = [[sh[0] - 0.3 * s + sal, sh[1] - 0.46 * s], w, 'B'];
  }
  const lc = svOyna(K, t, tl, 'b053_lal', lp, lo);
  lalTepsi(K, lp);
  lalUst(K, lp);
  if (id === 'buldum') { deste(K, [lc.handR[0], lc.handR[1] - 22], YOLCU, 0.9); lc.tut('R'); }
  if (desteL) { deste(K, [lc.handR[0], lc.handR[1] - 20], YOLCU, id === 'cta' ? W(t, tm.cta + 0.3, 0.4) : 0.35); lc.tut('R'); }
  if (gosterL && lo.L[1] > 0.5) lc.isaret('L', gosterL);
  if (id === 'sayac' && lo.L && lo.L[1] > 0.5) { const n = clamp01((t - tm.lalSay) / 0.35) + clamp01((t - tm.lalSay - 0.55) / 0.35) + clamp01((t - tm.lalSay - 1.1) / 0.35); lc.isaret('L', [lc.handR[0], lc.handR[1] - 40 - 6 * n]); }

  // ——— Bora (önde): tepsi + halkalar + bardaklar; sehpa ———
  sehpa(K);
  const sehpada = [0, 1, 2, 3].filter(i => !bardakYer(i).tepside && i !== elde);
  for (const i of sehpada) bardak(K, SEHPA_B[i][0], SEHPA_B[i][1], BH);
  if (id === 'espri' && t >= tm.selam - 0.1) {   // uyanan uykucuya el sallar
    const w = pIn(t, tm.selam + 0.2, tm.cta + 0.6, 0.28), sh = H.shoulder('b053_bora', bp, 'R'), s = bp.s, sal = Math.sin(TAU * 2.2 * Math.max(0, t - tm.selam + 0.2)) * 0.1 * s;
    if (w > 0.01) bo.R = [[sh[0] + 0.3 * s + sal, sh[1] - 0.46 * s], w, 'B'];
  }
  const bc = svOyna(K, t, null, 'b053_bora', bp, bo);
  const tp = boraTepsi(K, bc.handL, []);
  for (const dx of HALKA) { const k = 1 + (dx === HALKA[2] ? 0.18 * H.nabiz(t, tm.koy[3] + 0.82, 0.4) : 0), [hx, hy] = tepsiYuz(dx); K.ell(hx, hy - 2, 29 * k, 9 * k, '#4A4D47', LW * 0.6); K.ell(hx, hy - 2, 19 * k, 5 * k, H.CARDS.b053_bora.tepsiKoyu, 0); }   // üç boş yuva (koyu halka)
  const tepside = [0, 1, 2, 3].filter(i => bardakYer(i).tepside);
  for (const i of tepside.sort((a, b) => bardakYer(a).p[0] - bardakYer(b).p[0])) { const p = bardakYer(i).p, yat = i === 3 ? -0.24 * W(t, tm.koy[3] + 0.78, 0.12) : 0; K.ctx.save(); K.ctx.translate(p[0], p[1]); K.ctx.rotate(-yat); bardak(K, 0, 0, BH); K.ctx.restore(); }
  bc.tut('L');
  if (elde >= 0) { const p = bardakYer(elde).p; bardak(K, p[0], p[1], BH); if (bo.R && bo.R[1] > 0.5) bc.tut('R'); }
  if (bo.R && elde < 0 && bo.R[1] > 0.5) bc.isaret('R', [tepsiYuz(HALKA[2])[0], tepsiYuz(0)[1] - 30]);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('b053_lal', lp, 'head'), { son: tm.proof, k: lp.s / 245 });
  void tp; void bR;
}
// Sehpa (Bora'nın sağında, bardakların durduğu yer)
function sehpa(K) {
  const [x, y] = SEHPA;
  K.rect(x + 46, y + 8, 14, 1490 - y, SV.demir, LW * 0.6);
  K.ell(x + 53, 1492, 40, 9, SV.demir, LW * 0.6);
  K.ell(x + 53, y + 6, 66, 15, SV.bankKoyu, LW * 0.7);
  K.ell(x + 53, y, 66, 15, SV.bank, LW * 0.7);
}

// ——— kahraman an: raf sahnesi (Lâl rafın solunda; destesi sol elinde, sağ eliyle gösterir ve bilet atar) ———
function rafSahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, R = rafDurum(S, t);
  const lp = H.poseAt(H.CARDS.b053_lal, S.lalBase, S.lal, t), lo = { heads };
  const desteYer = H.elYeri('b053_lal', lp, 'L', 'gogus');
  lo.L = [[desteYer[0] + 30, desteYer[1] + 10], 1, 'B'];
  // sağ el: d4 "sıfırdan"da 0'ı, "yirmi dokuza"da 29'u gösterir; d5'te 29'a bilet atar; d5b'de dağıtırken rafa uzanır
  let hedef = null, w = 0;
  const g0 = gozYuva(0), g29 = gozYuva(29);
  if (t < tm.d5 - 0.1) { w = pIn(t, tm.sifirdan - 0.3, tm.d5 - 0.2, 0.28); const u = W(t, tm.dokuza - 0.15, 0.3); hedef = kar([LAL_RAF + 138, 990], [LAL_RAF + 142, 1110], u); }
  else if (t < tm.d5b - 0.1) { w = pIn(t, tm.yirmi29 - 0.35, tm.yirmi29 + 0.3, 0.25, 0.3); hedef = [LAL_RAF + 140, 1060]; }
  else { w = pIn(t, tm.d5b + 0.05, tm.duser + 0.2, 0.28); const u = W(t, tm.goze - 0.6, 0.4); hedef = kar([LAL_RAF + 128, 1190], [LAL_RAF + 140, 1080], u); }
  if (w > 0.01) lo.R = [hedef, w, 'B'];
  rafCiz(K, R);                                            // raf Lâl'in arkasında (küpeştenin önünde)
  const lc = svOyna(K, t, tl, 'b053_lal', lp, lo);
  lalTepsi(K, lp);
  lalUst(K, lp);
  // uçan biletler: desteden göze yay üstünde (yolun ortasında 70 px yükselir), inerken hafif döner
  const kaynak = [lc.handL[0], lc.handL[1] - 20];
  for (const u of R.ucan) {
    const p = H.tasi(t, u.t0, u.d, kaynak, gozYuva(u.g), u.son ? 110 : 70), q = seg(t, u.t0, u.d);
    bilet(K, p[0], p[1], (1 - q) * (u.g % 2 ? 0.8 : -0.8), 1 + 0.15 * (1 - q));
  }
  deste(K, kaynak, Math.max(1, R.kalan), 0.3, { rot: 0.25 }); lc.tut('L');
  if (lo.R && lo.R[1] > 0.5 && t < tm.d5 - 0.1) lc.isaret('R', t < tm.dokuza - 0.05 ? g0 : g29);
}
