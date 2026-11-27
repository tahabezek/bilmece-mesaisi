// Bölüm 84 · ÇAY OCAĞI NEREYE? (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_084_v5.md).
// Kaynak: hikayeler/bolum_084-086.md § 084 (ustalık defteri, S7 çekici eşitlik). Mekanizma: toplam yürüyüşü en aza indiren
// nokta dokuz kişinin ortancasıdır (cevap arşivde kalır, kesilir).
// Logline: Uzun bir koridorun sol ucunda muhasebe (4), bilgi işleme yakın insan kaynakları (2), sağ uçta bilgi işlem (3).
// Kerem tekerlekli çay ocağını koridorun tam ortasına iter; Hikmet Bey ocağı koridora kuracaktır, toplam yürüyüş en az
// olsun. Necmi "en kalabalık oda muhasebe, önüne koyalım" der; Defne "kalabalık tek başına yetmez" der.
// Akılda kalacak tek şey: ocak bir adım kayınca kimin yolu uzar, kimin yolu kısalır?
// Sızıntı yasağı: ok, ölçü, sayı hesabı yok. Araba sayaç boyunca koridorun tam ortasında durur. Üç kapı aynı renk, aynı
// çizgide; İK kapısı vurgulu değil. Defne'nin bakışı hiçbir kapıya yönelmez (arabaya, Necmi'ye ya da izleyiciye bakar).
// İpucunda Kerem arabayı bir adım sola, bir adım sağa iter ve ortaya geri koyar (iki yöne eşit). Kerem konuşmaz.
// Düzen: iki derinlik. Uzak katman = koridor duvarı (kapılar, siluetler, araba, Kerem), yerel birimde çizilir ve UF ile
// küçültülür; yakın katman = Hikmet, Necmi, Defne (önde, standart ölçek). Her kare t'nin saf fonksiyonudur; Math.random yok.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));

// ═══════════════════════════ Ölçüler ═══════════════════════════
const KOR = 'b084_koridor';
// Uzak katman: yerel (x, y) → dünya (UX + UF·x, UY + UF·y). Yerelde zemin 1500, insan boyu standart (~560).
const UF = 0.32, UX = 190, UY = 905 - 1500 * UF;
const uz = (x, y) => [UX + UF * x, UY + UF * y];
const ORTA = 1030;                                  // koridorun tam ortası (muhasebe 0 … bilgi işlem 2060)
const KAPI_UST = 800, TB = 70;                      // kapı üst kenarı (yerel), tabela yazı boyu (yerel; genişte ≈ 24 px, kapı plânında ≥ 49 px)
const KAPILAR = [
  { ad: 'mu', x: 0, w: 600, cift: true, satir: ['MUHASEBE'], sil: [-180, -60, 60, 180] },
  { ad: 'ik', x: 1640, w: 300, cift: false, satir: ['İNSAN', 'KAYNAKLARI'], sil: [-65, 65] },
  { ad: 'bi', x: 2060, w: 440, cift: true, satir: ['BİLGİ', 'İŞLEM'], sil: [-120, 0, 120] },
];
const UC = [-430, 2490];                            // koridorun iki ucu (yerel)
// Yakın katman (dünya, zemin 1500)
const NX = { necmi: 280, defne: 560, hikmet: 820 };
const NS = 0.8, NY = 1560, KS = 0.78;              // yakın üçlünün ölçeği ve zemini; Kerem'in (uzak katmanda) ölçeği
// yakın plânlarda (konuşanın tek plânı) öbür ikisi kadrajın dışına alınır: kenarda yarım yüz kalmasın
const TEK = { hikmet: 'hikmet', necmi: 'necmi', defne: 'defne', buldum: 'defne' };
const nx = (k, id) => { const o = TEK[id]; return !o || o === k ? NX[k] : NX[o] + Math.sign(NX[k] - NX[o]) * 600; };
// yakın plânda konuşan 120 px yukarıda durur (kamera hilesi): yüz altyazının üstünde kalır, Kerem'in başı kartın altında görünür
const yakin = (k, id, o) => H.kisi(k, { x: nx(k, id), y: NY - (TEK[id] === k ? 120 : 0), s: H.BOY[k] * NS, ...o });
// kolu hedefe doğru dümdüz uzatır (gösterme): omuzdan hedef yönünde kol boyu kadar
const uzan = (k, p, sd, q) => { const sh = H.shoulder(k, p, sd), u = H.unit(sh, q), c = H.CARDS[k], L = (c.arm.upper + c.arm.lower) * p.s * 1.02; return [sh[0] + u[0] * L, sh[1] + u[1] * L]; };
// Kameralar
const camGenis = z => ({ zoom: z, cx: 520 + 20 / z, cy: 850 + 110 / z });   // arabanın (520, 850) ekranda sabit kaldığı itme
const PAN = { z: 2.6, cy: 680, mu: uz(0, 0)[0], ikbi: uz(1840, 0)[0] };
const YAKIN = k => [1.5, NX[k] + (k === 'hikmet' ? 140 : k === 'necmi' ? 20 : 0), 1000];   // Hikmet ekranın solunda: başı arabayı ve Kerem'i örtmez   // cy: Kerem'in başı kartın altında kalır

// Ağzı kapalı ifadeler
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.08, open: 0, w: 0.8 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.22, open: 0, w: 0.9 },     // Necmi: kendinden emin
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.05, open: 0, w: 0.9 },     // Defne: kollar kavuşuk, ikna olmamış
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Uzak katman parçaları (yerel birim) ═══════════════════════════
const SIL = '#203B3D';
// Siluet: sade insan biçimi (kadrodan biri sanılmasın), elinde çay bardağı. v: biçim çeşidi, yud: yudum (0..1)
function siluet(K, x, h, v, yud) {
  const { ctx } = K, y = 1500, r = h * 0.12, sw = h * (v % 2 ? 0.34 : 0.3), hy = y - h + r;
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // bacaklar
  K.rect(x - sw * 0.42, y - h * 0.42, sw * 0.36, h * 0.42, SIL, 4, 10); K.rect(x + sw * 0.06, y - h * 0.42, sw * 0.36, h * 0.42, SIL, 4, 10);
  // gövde (omuzlar yuvarlak)
  K.rect(x - sw / 2, y - h * 0.74, sw, h * 0.4, SIL, 4, sw * 0.28);
  if (v === 1 || v === 4) K.poly([[x - sw * 0.5, y - h * 0.5], [x + sw * 0.5, y - h * 0.5], [x + sw * 0.62, y - h * 0.3], [x - sw * 0.62, y - h * 0.3]], SIL, 4);   // etek / ceket eteği
  // baş ve saç
  K.circ(x, hy, r, SIL, 4);
  if (v === 1) K.circ(x + r * 0.7, hy - r * 0.6, r * 0.45, SIL, 4);          // topuz
  if (v === 2) K.rect(x - r * 1.05, hy - r * 1.1, r * 2.1, r * 0.7, SIL, 4, r * 0.3);   // kısa kâkül
  if (v === 4) K.rect(x - r * 1.1, hy - r * 0.6, r * 2.2, r * 1.5, SIL, 4, r * 0.8);    // omuza inen saç
  // kol ve bardak: göğüs → ağız (yudum)
  const omuz = [x + sw * 0.4, y - h * 0.7], el = [lerp(x + sw * 0.55, x + r * 0.9, yud), lerp(y - h * 0.5, hy + r * 0.45, yud)];
  H.strokeLine(ctx, omuz, el, h * 0.07 + 8, INK); H.strokeLine(ctx, omuz, el, h * 0.07, SIL);
  const bx = el[0] + 4, by = el[1] - 2, k = h / 340;
  const p = [[-11, -40], [11, -40], [7, -22], [11, -6], [8, 0], [-8, 0], [-11, -6], [-7, -22]].map(([a, b]) => [bx + a * k, by + b * k]);
  ctx.save(); ctx.translate(bx, by); ctx.rotate(-0.5 * yud); ctx.translate(-bx, -by);
  K.poly(p, '#EEF3EF', 3); K.poly([[bx - 9 * k, by - 18 * k], [bx + 9 * k, by - 18 * k], [bx + 8 * k, by - 2 * k], [bx - 8 * k, by - 2 * k]], '#B4583A', 0); K.poly(p, null, 3);
  ctx.restore();
  K.circ(el[0], el[1], h * 0.045, SIL, 3);
  ctx.restore();
}
// Kapı: çerçeve, açık kapı ağzı (aydınlık oda), açılmış kanat(lar). Üç kapı aynı renk, aynı yükseklik.
function kapiAgzi(K, k) {
  const x0 = k.x - k.w / 2, y0 = KAPI_UST;
  K.rect(x0 - 26, y0 - 26, k.w + 52, 1500 - y0 + 26, PAL.trim, LW);
  K.rect(x0, y0, k.w, 1500 - y0, '#E6D9BC', LW);
  K.rect(x0, 1430, k.w, 70, '#CDBB98', 0);                                        // odanın zemini
  K.rect(x0 + k.w * 0.18, y0 + 110, k.w * 0.64, 190, '#F4EBD6', 4, 6);             // odanın penceresi (ışık)
  K.line(x0 + k.w / 2, y0 + 110, x0 + k.w / 2, y0 + 300, 4, '#B9AB8C');
}
function kanat(K, k) {   // açılmış kanat: ağzın kenarında içeri doğru, ince
  const x0 = k.x - k.w / 2, x1 = k.x + k.w / 2, y0 = KAPI_UST, d = k.cift ? 0.11 : 0.2;
  K.poly([[x0, y0], [x0 + k.w * d, y0 + 30], [x0 + k.w * d, 1480], [x0, 1500]], '#8C6A44', LW * 0.8);
  if (k.cift) K.poly([[x1, y0], [x1 - k.w * d, y0 + 30], [x1 - k.w * d, 1480], [x1, 1500]], '#8C6A44', LW * 0.8);
}
function tabela(K, k) {
  const { ctx } = K; ctx.font = `900 ${TB}px Rubik`;
  const w = Math.max(...k.satir.map(s => ctx.measureText(s).width)) + 46, lh = TB * 1.08, h = k.satir.length * lh + 30;
  const yb = KAPI_UST - 34;
  K.rect(k.x - w / 2 + 8, yb - h + 9, w, h, 'rgba(20,30,28,0.35)', 0, 12);
  K.rect(k.x - w / 2, yb - h, w, h, PAL.cream, LW * 0.8, 12);
  k.satir.forEach((s, i) => K.text(s, k.x, yb - h + 15 + lh * (i + 1) - TB * 0.2, TB, INK, 900));
}
// Tekerlekli çay ocağı (önden): x = orta, tabanı 1500. ust: üst tepsinin y'si (1170).
const ARABA = { yari: 160, ust: 1170 };
function araba(K, x, t, yan = 0) {
  const { ctx } = K, a = ARABA.yari, u = ARABA.ust;
  for (const dx of [-a + 30, a - 30]) { K.circ(x + dx, 1478, 22, '#3A3F3C', LW * 0.8); K.circ(x + dx, 1478, 7, PAL.metal, 0); }
  for (const dx of [-a + 22, a - 22]) K.rect(x + dx - 9, u + 10, 18, 1462 - u - 10, PAL.metal, LW * 0.7, 4);
  K.rect(x - a + 6, 1388, 2 * a - 12, 24, PAL.woodTop, LW * 0.8, 5);               // alt raf
  K.rect(x - a + 40, 1330, 70, 58, '#E9E2D2', LW * 0.6, 6);   // şeker kutusu
  K.rect(x + 20, 1316, 110, 72, '#5E9A4E', LW * 0.6, 8);                           // yedek demlik kutusu
  K.rect(x - a, u, 2 * a, 28, PAL.mustard, LW, 7);                                  // üst tepsi
  if (yan < 0) { K.line(x - a, u + 6, x - a - 46, u - 70, 12, INK); K.line(x - a, u + 6, x - a - 46, u - 70, 6, PAL.metal); K.line(x - a - 56, u - 74, x - a - 36, u - 66, 14, INK); }   // itme sapı (yan görünüş, sol uçta)
  // ocak halkası, çaydanlık ve demlik
  const cx = x + 72;   // çaydanlık sağ uçta (Kerem arabanın sol yarısının arkasında durur, yüzü açık kalır)
  K.rect(cx - 52, u - 18, 104, 18, '#3A3F3C', LW * 0.7, 4);
  K.rect(cx - 56, u - 104, 112, 86, PAL.metal, LW, 14);
  K.poly([[cx + 52, u - 80], [cx + 92, u - 112], [cx + 100, u - 102], [cx + 56, u - 58]], PAL.metal, LW * 0.8);
  K.rect(cx - 34, u - 164, 68, 60, PAL.coral, LW, 12); K.circ(cx, u - 170, 9, '#3A3F3C', LW * 0.6);
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, u - 112, 62, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  H.buhar(K, cx + 96, u - 118, t, { k: 0.75, n: 2, ara: 18, boy: 120 });
  // bardak tepsisi: üç boş çay bardağı
  for (let i = 0; i < 3; i++) {
    const bx = x - 132 + i * 34, by = u;
    const p = [[-12, -48], [12, -48], [7, -26], [12, -8], [9, 0], [-9, 0], [-12, -8], [-7, -26]].map(([p, q]) => [bx + p, by + q]);
    K.poly(p, '#EEF3EF', 3);
  }
}

// ═══════════════════════════ Mekân: uzun koridor ═══════════════════════════
M.mekanEkle(KOR, {
  gen: [-200, 1300], dongu: ['çaydanlık buharı', 'siluetlerin çay yudumu', 'kameranın itmesi'],
  capa: { araba: uz(ORTA, ARABA.ust) }, kadraj: { genis: [1, 540, 960] },
  arka(K, t, { durum }) {
    const { ctx } = K;
    ctx.fillStyle = '#DCCFB4'; ctx.fillRect(-2000, -2000, 6000, 6000);              // tavan (en üst)
    // zemin bandı (koridor tabanı, yakın katmana kadar)
    ctx.fillStyle = '#B9A27C'; ctx.fillRect(-2000, 905, 6000, 2000);
    for (const dy of [26, 70, 140, 240, 380, 560, 800]) K.line(-2000, 905 + dy, 4000, 905 + dy, 3, '#A48D68');
    ctx.save(); ctx.beginPath(); ctx.rect(-2000, 905, 6000, 2000); ctx.clip();
    for (let x = -1400; x < 3000; x += 150) K.line(x, 905, x - 520, 1925, 3, '#A48D68');
    ctx.restore();
    // uzak katman
    ctx.save(); ctx.translate(UX, UY); ctx.scale(UF, UF);
    const [a, b] = UC;
    K.rect(a, 330, b - a, 1170, '#5E8C83', 0);                                     // koridor duvarı
    K.rect(a, 330, b - a, 40, '#EDE3CC', LW);                                       // tavan kornişi
    K.rect(a, 1080, b - a, 420, '#4C766E', 0);                                      // lambri
    K.rect(a, 1068, b - a, 24, PAL.trim, LW * 0.8);
    K.rect(a, 1450, b - a, 50, '#3E625B', LW * 0.6);                                // süpürgelik
    for (const xe of UC) { const s = Math.sign(xe - ORTA); K.rect(s < 0 ? xe - 1600 : xe, 330, 1600, 1170, '#476F68', LW); K.rect(s < 0 ? xe - 1600 : xe, 1450, 1600, 50, '#36574F', LW * 0.6); }   // iki uçtaki duvarlar (koridor biter)
    K.line(a, 1500, b, 1500, LW);
    for (const k of KAPILAR) { kapiAgzi(K, k); if (durum.tabela) tabela(K, k); }   // yakın plânlarda tabelalar kartın arkasında kalır: çizilmez (kenarda kırpık parça kalmasın)
    ctx.restore();
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), kur: T('h1:3'), toplam: T('h1:4'), h1s: T('h1>'),
    h2: T('h2'), dort: T('h2:1'), insan: T('h2:2'), iki: T('h2:4'), bilgi: T('h2:5'), uc: T('h2:7'), h2s: T('h2>'),
    h3: T('h3'), herkes: T('h3'), cay: T('h3:3'), kendisi: T('h3:6'), ocagi: T('h3:8'), dokuz: T('h3:11'), h3s: T('h3>'),
    n0: T('n0'), muhasebe: T('n0:3'), n0b: T('n0:4'), onune: T('n0:6'), n0s: T('n0>'),
    d1: T('d1'), ocak: T('d1:4'), d1s: T('d1>'),
    n1: T('n1'), bir: T('n1:1'), kayarsa: T('n1:3'), ne: T('n1:4'), n1s: T('n1>'),
  };
  tm.varis = tm.kur + 0.05;                               // araba ortaya varır (Kerem iter)
  tm.kapiKes = tm.h2 - 0.12; tm.panGit = tm.insan + 0.15;   // muhasebenin dört siluetini görmeye vakit kalsın
  tm.hikKes = tm.h3 - 0.1; tm.genisKes = tm.ocagi - 0.1; tm.necKes = tm.n0b - 0.1; tm.defKes = tm.d1 - 0.1; tm.sayac = cd0 - 0.05;
  // siluetlerin geliş anları (sayı kelimesinde): muhasebe "dört", İK "iki", bilgi işlem "üç"
  tm.gel = { mu: tm.dort - 0.3, ik: tm.iki - 0.1, bi: tm.bilgi - 0.05 };   // altyazıda sayı oda adıyla birlikte okunur
  // ipucu: Kerem arabayı bir adım sola, bir adım sağa iter, ortaya geri koyar
  tm.it = [[tm.n1 - 0.05, 0.55, -1], [tm.n1 + 0.6, 0.8, 2], [tm.n1 + 1.5, 0.55, -1]];
  const cG = camGenis(1);
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, cG.zoom, cG.cx, cG.cy], [tm.kapiKes - 0.15, 1.03, camGenis(1.03).cx, camGenis(1.03).cy]] },
    { id: 'kapilar', t0: tm.kapiKes, cam: [[0, PAN.z, PAN.mu, PAN.cy], [tm.panGit, PAN.z, PAN.mu + 4, PAN.cy]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...YAKIN('hikmet')], [tm.genisKes - 0.1, 1.52, YAKIN('hikmet')[1], 1000]] },
    { id: 'genis', t0: tm.genisKes, cam: [[0, cG.zoom, cG.cx, cG.cy], [tm.necKes - 0.1, 1.012, 540, 958]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...YAKIN('necmi')], [tm.defKes - 0.1, 1.52, YAKIN('necmi')[1] + 3, 1000]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...YAKIN('defne')], [tm.sayac - 0.1, 1.53, YAKIN('defne')[1], 999]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, cG.zoom, cG.cx, cG.cy]] },              // doğrusal itme kamera() ile (arabaya kilitli)
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...YAKIN('defne')]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, cG.zoom, cG.cx, cG.cy], [tm.end - 0.2, 1.06, camGenis(1.06).cx, camGenis(1.06).cy]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı/.test(w)) console.error('sahne uyarısı: ' + w);
  // n1 balonu kesime kadar okunur (sönmez)
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').map(l => l.id === 'd1' ? { ...l, t1: Math.min(l.t1, tm.sayac - 0.31) } : l) };   // d1 balonu sayaç kesmesinde söner (sayaçla üst üste binmez)
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// ═══════════════════════════ draw ═══════════════════════════
const zoomSayac = (tm, t) => t < tm.cd ? Math.exp(lerp(0, Math.log(1.05), clamp01((t - tm.sayac) / (tm.cd - tm.sayac)))) : lerp(1.05, 1.085, ease.state(clamp01((t - tm.cd) / (tm.buldum - tm.cd))));
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') Object.assign(cam, camGenis(zoomSayac(tm, t)));
    if (B.sc.id === 'kapilar') { const u = W(t, tm.panGit, 0.6); cam.cx = lerp(PAN.mu, PAN.ikbi, u) + 4 * clamp01((t - tm.panGit - 0.6) / 2); }
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    const y = id === 'kapilar' ? 505 : TEK[id] ? 1255 : 1276;   // geniş plânda balon üçlünün çenesinin altında
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, B.heads, { y });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, B.heads, { y: 1276 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (perde yok, paylaşım hapı yok): daire solda altta, başlık sağda.
function sayac(K, t, t1, { dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 170, y = 1344, r = 68;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 11, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 21, 58, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(612, 1344); ctx.scale(inU * out, inU * out);
  ctx.font = '900 50px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 60;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 18, 50, INK, 900);
  ctx.restore();
}

// ═══════════════════════════ Dünya ═══════════════════════════
// Arabanın yerel x'i: kancada Kerem iter (soldan ortaya), sayaçta ortada; ipucunda bir adım sola, iki adım sağa, bir adım sola.
const ADIM = 220, A0 = 420;   // A0: kare 0'da arabanın yeri (Kerem soldan iter)
function arabaX(tm, t) {
  if (t < tm.varis + 0.01) return lerp(A0, ORTA, kaydir(t, 0.25, tm.varis));
  let x = ORTA;
  for (const [a, d, k] of tm.it) x += k * ADIM * ease.state(seg(t, a, d));
  return x;
}
// yürüyüşle uyumlu yamuk hız profili (0..1)
function kaydir(t, a, b) { const d = b - a, r = Math.min(0.3, d / 2) / d, u = seg(t, a, d); return u < r ? u * u / (2 * r) / (1 - r) : u > 1 - r ? (1 - r - (1 - u) ** 2 / (2 * r)) / (1 - r) : (u - r / 2) / (1 - r); }

const fonKay = (t, B) => { const lt = t - B.sc.t0; return { dx: -20 * lt, k: 1 + 0.014 * lt }; };   // yakın plân fonunun doğrusal kayması (sağa: Hikmet'in başından uzaklaşır)
function sahne(K, t, tl, S, B) {
  const { tm } = S, id = B.sc.id;
  // yakın plânlarda arka fon (koridor, araba, kapılar) geniş plânın ölçeğinde kalır: coğrafya her plânda aynı, araba tam ortada
  const fon = !!TEK[id], { ctx } = K;
  // fon yavaşça sağa kayar ve hafifçe yaklaşır (öndeki karakterden yavaş: derinlik)
  if (fon) { const f = fonKay(t, B); ctx.save(); ctx.translate(B.cam.cx, B.cam.cy); ctx.scale(1 / B.cam.zoom, 1 / B.cam.zoom); ctx.translate(-540, -960); ctx.translate(540 - f.dx, 900); ctx.scale(f.k, f.k); ctx.translate(-540, -900); }
  M.mekanCiz(K, KOR, 'arka', t, { durum: { tabela: true } });
  uzakKatman(K, t, S, B);
  if (fon) ctx.restore();
  if (id !== 'kapilar') yakinKatman(K, t, tl, S, B);
}

// Uzak katman: siluetler (kapı ağızlarında), kanatlar, araba ve Kerem
function uzakKatman(K, t, S, B) {
  const { tm } = S, { ctx } = K;
  ctx.save(); ctx.translate(UX, UY); ctx.scale(UF, UF);
  // siluetler: sayısı söylenince kapı ağzına yandan girerler (ağza kırpılı); sonra sırayla çay yudumlarlar
  let iz = 0;
  KAPILAR.forEach((k, ki) => {
    const tg = tm.gel[k.ad], x0 = k.x - k.w / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, KAPI_UST, k.w, 700); ctx.clip();
    k.sil.forEach((dx, i) => {
      const g = ease.enter(seg(t, tg + i * 0.07, 0.4));
      if (g <= 0) { iz++; return; }
      const gir = (1 - g) * (k.w * 0.55 + 140) * (dx < 0 ? -1 : 1) * (k.sil.length === 1 ? 1 : 1);
      // yudum döngüsü: her siluet 4,2 sn'de bir, farklı fazla (h3 "çay içiyor"da hepsi birden)
      const ph = (((t - tm.cd0 + iz * 0.47) % 4.2) + 4.2) % 4.2, yud = Math.max(pIn(t, tm.cay - 0.05 + i * 0.06, tm.cay + 0.75 + i * 0.06, 0.3), t > tm.cay + 1.2 ? Math.sin(Math.PI * clamp01((ph - 0.2) / 0.9)) ** 2 : 0);
      siluet(K, k.x + dx + gir, 400, [3, 1, 2, 4, 0][(iz + ki) % 5], yud);
      iz++;
    });
    ctx.restore();
    kanat(K, k);
  });
  // ——— Kerem ve araba ———
  const ax = arabaX(tm, t), kanca = B.sc.id === 'kanca';
  if (kanca) {   // yandan: arabayı soldan iter, ortada durur
    const p = H.yuru(H.KEREM, t, { t0: 0.25, t1: tm.varis, x0: A0 - ARABA.yari - 110, x1: ORTA - ARABA.yari - 110, s: H.BOY.genc * KS });
    p.expr = IF.merak; p.lean = (p.lean || 0) + 6; p.head = { ...p.head, look: t < tm.varis ? [0.4, 0.1] : [0.3, 0.25] };
    const sap = [ax - ARABA.yari - 46, ARABA.ust - 70];
    const kc = oyna(K, t, null, H.KEREM, p, { R: [sap, 1, 'A'], L: [[sap[0] - 6, sap[1] + 6], 1, 'A'], sessiz: true });
    araba(K, ax, t, -1);
    kc.tut('R');
  } else {       // önden, arabanın arkasında: iki eli üst tepsinin kenarında
    const ip = tm.it.reduce((s, [a, d]) => Math.max(s, Math.sin(Math.PI * seg(t, a, d))), 0);
    let kL = [0, 0.4];
    const sayacta = t >= tm.sayac && t < tm.buldum;
    if (sayacta) { const j = Math.floor((t - tm.cd0) / 1.6) % 4; kL = [[-0.5, 0.15], [0, 0.45], [0.5, 0.15], [0, 0.45]][(j + 4) % 4]; }
    if (t >= tm.n1 - 0.25 && t < tm.buldum) kL = [0, 0.5];
    const p = H.kisi(H.KEREM, { x: ax - 95, s: H.BOY.genc * KS, expr: IF.notr, ...POZ.dur, head: { tilt: 0, look: kL } });
    p.legL = { ...p.legL, hip: (p.legL?.hip || 0) + 10 * ip, knee: (p.legL?.knee || 0) + 18 * ip };
    p.legR = { ...p.legR, hip: (p.legR?.hip || 0) + 10 * ip, knee: (p.legR?.knee || 0) + 18 * ip };
    p.y -= 8 * ip;
    const kc = oyna(K, t, null, H.KEREM, p, { L: [[ax - ARABA.yari + 34, ARABA.ust + 8], 1, 'A'], R: [[ax + 5, ARABA.ust + 8], 1, 'A'], sessiz: true });
    araba(K, ax, t, 0);
    kc.tut('L'); kc.tut('R');
  }
  ctx.restore();
}

// Yakın katman: Necmi (solda), Defne (ortada), Hikmet (sağda); önden
function yakinKatman(K, t, tl, S, B) {
  const { tm } = S, id = B.sc.id, { heads } = B;
  const sayacta = t >= tm.sayac && t < tm.buldum;
  // fon noktası → bu plânın dünyası (yakın plânda fon geniş plân ölçeğinde çizilir)
  const fonP = p => { if (!TEK[id]) return p; const f = fonKay(t, B), sx = (p[0] - 540) * f.k + 540 - f.dx, sy = (p[1] - 900) * f.k + 900; return [B.cam.cx + (sx - 540) / B.cam.zoom, B.cam.cy + (sy - 960) / B.cam.zoom]; };
  const arabaW = fonP(uz(arabaX(tm, t), ARABA.ust - 60)), muKapi = fonP(uz(0, 1080));
  // bakış: hedef noktaya (dünya) göre look
  const bak = (k, p, q) => { const h = H.eklem(k, p, 'head'); return [Math.max(-0.75, Math.min(0.75, (q[0] - h[0]) / 380)), Math.max(-0.5, Math.min(0.5, (q[1] - h[1]) / 420))]; };

  // ——— Necmi ———
  const np = yakin('necmi', id, { expr: id === 'kanca' ? IF.merak : IF.emin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  np.head.look = bak('necmi', np, arabaW);
  const nO = { heads };
  const wIs = pIn(t, tm.n0 + 0.1, tm.n0s + 0.2, 0.3, 0.35);          // n0: muhasebeyi gösterir
  if (t >= tm.n0 - 0.1 && t < tm.n0s + 0.5) np.head.look = bak('necmi', np, muKapi);
  // kol sola, omuzdan biraz yukarı uzanır (koridorun sol ucu); el yüzün önüne gelmez
  const nHedef = t < tm.onune - 0.1 ? muKapi : fonP(uz(0, 1490));   // önce muhasebe kapısı, "önüne"de kapının önündeki zemin
  if (wIs > 0.01) nO.L = [uzan('necmi', np, 'L', nHedef), wIs, 'B'];
  if (sayacta) {   // düşünür: önce muhasebeye, sonra arabaya bakar; işaret parmağı yanakta
    const ts = t - tm.cd0;
    np.expr = IF.dusun; np.head.look = bak('necmi', np, ts % 5 < 2.5 ? muKapi : arabaW);
    if (t >= tm.n1 - 0.2) np.head.look = bak('necmi', np, arabaW);
  }
  const wNc = sayacta ? pIn(t, tm.cd0 + 3.6, tm.cd0 + 7.4, 0.35) : 0;
  const cene = (key, p, m) => { const h = H.eklem(key, p, 'head'); return [h[0] + m * 0.43 * p.s, h[1] + 0.4 * p.s]; };
  if (wNc > 0.01) nO.R = [cene('necmi', np, 1), wNc, 'B'];

  // ——— Defne ———
  const dp = yakin('defne', id, { expr: id === 'kanca' ? IF.merak : IF.ciddi, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  dp.head.look = bak('defne', dp, arabaW);
  if (t >= tm.n0 - 0.1 && t < tm.d1) dp.head.look = bak('defne', dp, H.eklem('necmi', np, 'head'));
  if (t >= tm.d1 && t < tm.ocak - 0.05) dp.head.look = [-0.45, 0.05];                  // Necmi'ye
  if (t >= tm.ocak - 0.05 && t < tm.sayac) dp.head.look = [0, 0];                       // izleyiciye sorar
  const kavus = t >= tm.n0s - 0.4 && t < tm.n1 - 0.05 ? W(t, tm.n0s - 0.4, 0.4) : t >= tm.n1 - 0.05 && t < tm.buldum ? 1 - W(t, tm.n1 - 0.05, 0.35) : 0;
  const dO = { heads };
  if (kavus > 0.01) {   // kollar kavuşuk: eller karşı dirseklerin önünde
    const g = H.eklem('defne', dp, 'neck'), pv = H.eklem('defne', dp, 'pelvis'), yc = lerp(g[1], pv[1], 0.52);
    dO.L = [[g[0] + 0.42 * dp.s, yc + 0.06 * dp.s], kavus, 'A'];
    dO.R = [[g[0] - 0.42 * dp.s, yc - 0.02 * dp.s], kavus, 'A'];
  }
  if (sayacta && t < tm.n1 - 0.1) { dp.expr = IF.dusun; dp.head.look = bak('defne', dp, arabaW); dp.head.tilt = 3 * Math.sin(TAU * (t - tm.cd0) / 5.6); }
  const wSor = t >= tm.n1 - 0.2 && t < tm.buldum ? pIn(t, tm.n1 - 0.05, tm.buldum + 1, 0.3) : 0;   // ipucu: avucu yukarı, soran el
  if (wSor > 0.01) { dO.R = [H.elYeri('defne', dp, 'R', 'gogus').map((v, i) => v + [70, -20][i]), wSor, 'A']; dp.head.look = bak('defne', dp, arabaW); }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; dO.L = undefined; }
  dp.y -= H.buldumHop(t, tm.buldum, 40);

  // ——— Hikmet ———
  const hp = yakin('hikmet', id, { expr: IF.notr, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  hp.head.look = bak('hikmet', hp, arabaW);
  if (t >= tm.n0 - 0.1 && t < tm.d1) hp.head.look = bak('hikmet', hp, H.eklem('necmi', np, 'head'));
  if (t >= tm.d1 && t < tm.sayac) hp.head.look = bak('hikmet', hp, H.eklem('defne', dp, 'head'));
  const hO = { heads };
  // kanca: sol eliyle arabayı gösterir; h3: "Herkes" avucu açık; "dokuz kişi": iki eli açık, koridoru kucaklar
  const wK = id === 'kanca' ? pIn(t, 0.3, tm.h1s + 0.2, 0.3, 0.35) : 0;
  if (wK > 0.01) hO.L = [H.elYeri('hikmet', hp, 'L', 'gogus').map((v, i) => v + [-60, -10][i]), wK, 'A'];   // avucu açık, koridorun ortasına doğru anlatır
  const wAc = pIn(t, tm.herkes + 0.05, tm.kendisi + 0.2, 0.3, 0.3), wDok = pIn(t, tm.dokuz - 0.25, tm.h3s + 0.35, 0.3, 0.35);
  if (wAc > 0.01) hO.R = [H.elYeri('hikmet', hp, 'R', 'gogus').map((v, i) => v + [80, -10][i]), wAc, 'A'];
  if (wDok > 0.01) { hO.L = [H.elYeri('hikmet', hp, 'L', 'asagi').map((v, i) => v + [-70, -70][i]), wDok, 'A']; hO.R = [H.elYeri('hikmet', hp, 'R', 'asagi').map((v, i) => v + [70, -70][i]), wDok, 'A']; }
  if (t >= tm.kendisi - 0.1 && t < tm.ocagi) H.onayla(hp, t, tm.kendisi, 1, 0.36);
  if (sayacta) { hp.expr = IF.dusun; hp.head.look = bak('hikmet', hp, arabaW); }
  const wHc = sayacta ? Math.max(pIn(t, tm.cd0 + 0.6, tm.cd0 + 3.2, 0.35), pIn(t, tm.cd0 + 7.6, tm.n1 - 0.1, 0.35)) : 0;
  if (wHc > 0.01) hO.L = [cene('hikmet', hp, -1), wHc, 'B'];
  if (id === 'kanca' && t < 0.6) { dp.head.look = [-0.3, -0.25]; np.head.look = [0.4, -0.25]; }

  // çizim
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  if (wIs > 0.6) nc.isaret('L', nHedef);
  if (wNc > 0.6) nc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  const hc = oyna(K, t, tl, 'hikmet', hp, hO);
    if (wHc > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25, boy: 0.95 });
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (kavus > 0.5) { dc.tut('L'); dc.tut('R'); }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
