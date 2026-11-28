// Bölüm 89 · YÜZÜK KİMDE? (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_089_v5.md).
// Mekanizma: açık yöntem. Yüzük kimdeyse her soruya yalan söyler, öbür ikisi doğruyu; Defne tek evet-hayır sorusu sorar,
// üçü aynı anda başlarıyla cevap verir. Cevap (arşivde, kesilir): doğru cevabı herkes için aynı olan bir soru; ayrılan baş yüzüğü tutar.
// Logline: Mesai sonu çay molasında yüzük oyunu. Hikmet Bey kuralı koyar; Necmi takılır: "Sor bakalım: yüzük sende mi?"
// Defne çürütür: öyle sorarsa üçü de hayır der (üç baş birlikte iki yana sallanır). Hangi soruyu sormalı?
// Akılda kalacak tek şey: soru, dürüst ikisinin aynı cevabı vermesini sağlamalı.
// Sızıntı yasağı: üç yumruk her karede aynı biçimde, aynı boyda, aynı yükseklikte; hiçbir yumruk tek başına oynamaz, kimse bir
// yumruğa bakıp kalmaz. Sayaçta ve ipucunda baş sallama yok (cevap gibi okunmasın).
// Kerem konuşmaz: bakar, gülümser, çayını alır, başıyla cevap verir.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const ODA = 'b089_mola';
const X = { defne: 240, hikmet: 445, genc: 645, necmi: 845 };
const Y = { defne: 1500, hikmet: 1540, genc: 1500, necmi: 1460 };   // Hikmet bir basamak alçakta, Necmi bir basamak yüksekte: başlar aynı hizada
const SY = 1322;                                     // masada nesnelerin oturduğu çizgi
const MASA = { ust: 1300, on: 1330, x0: 300, x1: 1600 };
const YUM = { dx: 64, y: SY - 26 };                  // yumruk: kişinin sağında (ekranın sağı), masaya dayalı; üçünde aynı
const BAR = { dx: -66 };                             // çay bardağı: kişinin solunda
const KUTU = [318, SY];                              // boş yüzük kutusu (Defne ile Hikmet arasında)
const CAY = '#B5532A';
// Kameralar [zoom, cx, cy]. Kart 300–509 px: saç tepeleri ≥ 540 px; masa hattı ≤ 1231 px.
const KAM = {
  grup: [1.3, 542, 1100],
  hikmet: [1.44, 550, 1069],
  uclu: [1.36, 645, 1086],
  necmi: [1.44, 772, 1069],
  defne: [1.44, 352, 1069],
  buldum: [1.44, 352, 1069],
};
// Yakın plânlarda kadraj kenarında yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  hikmet: { defne: -330, necmi: 260 },
  uclu: { defne: -330 },
  uclu2: { defne: -330 },
  necmi: { defne: -330, hikmet: -330 },
  defne: { genc: 420, necmi: 420 },
  buldum: { genc: 420, necmi: 420 },
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  sinsi: { brow: 0.1, browTilt: -0.2, eye: 0.9, pupil: 1, curve: 0.42, open: 0, w: 1.05 },        // takılan, bilen gülümseme
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.24, open: 0, w: 0.9 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// Baş cevapları: evet = baş aşağı yukarı (belirgin), hayır = iki yana (iki tam salınım). Üçü aynı anda.
function evet(p, t, t0, n = 2, d = 0.3) {
  const u = (t - t0) / d; if (u <= 0 || u >= n) return p;
  const k = Math.sin(Math.PI * (u % 1)) ** 2;
  p.head = { ...p.head, nod: (p.head.nod || 0) + 2.5 * k, look: [p.head.look?.[0] || 0, 0.6 * k], tilt: (p.head.tilt || 0) };
  return p;
}
function hayir(p, t, t0, d = 0.72) {
  const u = (t - t0) / d; if (u <= 0 || u >= 1) return p;
  const env = Math.min(1, u / 0.12, (1 - u) / 0.12), s = Math.sin(TAU * 2 * u);
  p.head = { ...p.head, look: [0.85 * s * env, 0.05], tilt: (p.head.tilt || 0) + 12 * s * env };
  return p;
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Yumruk: üç oyuncuda aynı ölçü, aynı biçim (yalnız ten rengi kişinin). pt merkez; dört boğum çizgisi, başparmak önde.
function yumruk(K, key, [x, y]) {
  const { ctx } = K, c = H.CARDS[key];
  ctx.save(); ctx.translate(x, y);
  K.rect(-33, -30, 66, 56, c.skin, LW * 0.8, 20);
  ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-33 + i * 16.5, -30); ctx.lineTo(-33 + i * 16.5, -15); ctx.stroke(); }
  K.rect(-27, 2, 50, 16, c.skinShade, LW * 0.6, 8);   // önde kıvrılmış başparmak
  ctx.restore();
}
// İnce belli çay bardağı ve tabağı: (x, yb) tabağın ortası; tabak yoksa bardak tabanı
function bardak(K, x, yb, { k = 1, tabak = true, sev = 1 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  if (tabak) K.ell(0, 0, 34, 8, PAL.cream, LW * 0.55);
  const yol = [[-17, -60], [17, -60], [10, -33], [17, -12], [13, -3], [-13, -3], [-17, -12], [-10, -33]];
  K.poly(yol, '#F3EEE4', LW * 0.5);
  const ust = -53 * sev;
  K.poly([[-15 * (0.6 + 0.4 * sev), ust], [15 * (0.6 + 0.4 * sev), ust], [9, -33], [15, -12], [11, -5], [-11, -5], [-15, -12], [-9, -33]].map(([a, b]) => [a, Math.max(b, ust)]), CAY, 0);
  K.line(-13, ust, 13, ust, 3, '#C9603A');
  K.poly(yol, null, LW * 0.5);
  ctx.restore();
}
// Kaşık: elden bardağın içine
function kasik(K, el, uc) {
  H.strokeLine(K.ctx, el, uc, 9, INK); H.strokeLine(K.ctx, el, uc, 4.5, '#C9CED0');
}
// Boş yüzük kutusu: kırmızı kadife, kapağı açık, yuvası boş
function kutu(K, [x, y]) {
  const { ctx } = K;
  K.poly([[x - 46, y], [x + 46, y], [x + 42, y - 34], [x - 42, y - 34]], '#9E2B33', LW * 0.7);   // gövde
  K.ell(x, y - 34, 42, 9, '#6E1C24', LW * 0.6);                                                  // iç (boş)
  K.ell(x, y - 33, 13, 5, '#3E0F14', 0);                                                         // boş yuva
  ctx.beginPath(); ctx.moveTo(x - 42, y - 38); ctx.lineTo(x - 36, y - 92); ctx.lineTo(x + 36, y - 92); ctx.lineTo(x + 42, y - 38); ctx.closePath();
  K.fs('#B63A42', LW * 0.7);                                                                     // açık kapak
  K.poly([[x - 30, y - 46], [x + 30, y - 46], [x + 26, y - 84], [x - 26, y - 84]], '#7E222A', 0); // kapak içi
  K.line(x - 44, y - 36, x + 44, y - 36, 4, PAL.mustard);                                        // menteşe şeridi
}

// ═══════════════════════════ Mekân: çay köşesi, mesai sonu ═══════════════════════════
function masa(K) {
  K.rect(MASA.x0, MASA.ust, MASA.x1 - MASA.x0, MASA.on - MASA.ust, '#B5865A', LW * 0.8, 6);   // masa üstü
  K.line(MASA.x0 + 6, MASA.ust + 8, MASA.x1, MASA.ust + 8, 3, '#C99A6C');
  K.rect(MASA.x0 + 10, MASA.on, MASA.x1 - MASA.x0, 1300, PAL.wood, LW, 0);                   // ön panel
  K.rect(MASA.x0 + 10, MASA.on + 40, MASA.x1 - MASA.x0, 10, PAL.woodDark, 0, 0);
  // kareli çay ocağı örtüsü: masanın önünden sarkar (alt bandın boş kalmaması için)
  const y0 = MASA.on - 2, h = 320, ad = 38;
  K.rect(MASA.x0 + 10, y0, MASA.x1 - MASA.x0, h, '#F1E6D2', LW * 0.7, 0);
  const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.rect(MASA.x0 + 10, y0, MASA.x1 - MASA.x0, h); ctx.clip();
  ctx.fillStyle = 'rgba(178,58,52,0.55)';
  for (let x = MASA.x0 + 10; x < MASA.x1; x += ad * 2) ctx.fillRect(x, y0, ad, h);
  for (let y = y0; y < y0 + h; y += ad * 2) ctx.fillRect(MASA.x0 + 10, y, MASA.x1 - MASA.x0, ad);
  ctx.restore();
  for (let x = MASA.x0 + 30; x < MASA.x1; x += 44) K.poly([[x - 12, y0 + h], [x + 12, y0 + h], [x, y0 + h + 22]], '#B23A34', LW * 0.4);   // saçak
}
// Arkada tezgâh ve çift demlik (buhar döngüsü)
function demlik(K, x, y, t) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y);
  K.line(46, -78, 78, -40, 13); K.line(46, -78, 78, -40, 6, PAL.metalDark);
  K.poly([[-56, -6], [56, -6], [50, -78], [-50, -78]], PAL.metal, LW); K.ell(0, -4, 56, 9, PAL.metalDark, LW * 0.7);
  K.poly([[-50, -46], [-86, -74], [-80, -82], [-48, -62]], PAL.metal, LW * 0.8);
  K.ell(0, -80, 44, 10, PAL.metalDark, LW * 0.7);
  K.poly([[-28, -82], [28, -82], [36, -100], [30, -122], [-30, -122], [-36, -100]], PAL.red, LW * 0.8); K.line(-34, -100, 34, -100, 7, PAL.cream);
  K.ell(0, -123, 30, 7, '#A8382A', LW * 0.6); K.circ(0, -133, 8, PAL.cream, LW * 0.6);
  ctx.restore();
  H.buhar(K, x - 84, y - 84, t, { k: 0.8, n: 2 });
}
M.mekanEkle(ODA, {
  gen: [-700, 1900], dongu: ['demlikten yükselen buhar', 'pencerede akşam ve martılar', 'duvar saatinin saniye ibresi'],
  capa: { kutu: KUTU }, kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -800, x1: 2100, isik, duvar: 'duz', zemin: 'ahsap' });
    M.pencere(K, 560, 420, 340, 300, { isik, t: t + 3, gunes: 0.86, manzara: 'istanbul', marti: true, kayit: false });
    M.duvarSaati(K, 250, 600, 62, 17.95 + t / 3600, t);
    // tezgâh (arkada, masa hattının üstünde görünen kısmı)
    K.rect(980, 1000, 900, 26, PAL.woodTop, LW, 4); K.rect(990, 1026, 880, 400, '#7F9E92', LW, 0);
    demlik(K, 1120, 1000, t);
    for (let i = 0; i < 4; i++) bardak(K, 1260 + i * 50, 1000, { k: 0.8, tabak: false, sev: 0 });
    // sol duvarda pano
    K.rect(-330, 520, 300, 220, '#C9A877', LW, 6); K.rect(-300, 550, 110, 80, '#F6EFD9', LW * 0.5, 2); K.rect(-170, 570, 110, 120, '#E8D6A4', LW * 0.5, 2);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), birimizde: T('h1:1'), yalan: T('h1:4'), ikisi: T('h1:7'), h1s: T('h1>'),
    h2: T('h2'), uclumuz: T('h2:2'), biliyoruz: T('h2:4'), bir: T('h2:5'), evet: T('h2:7'), hayirH: T('h2:8'), sor: T('h2:10'), basimizla: T('h2:13'), h2s: T('h2>'),
    n0: T('n0'), sorN: T('n0:0'), sende: T('n0:3'), n0s: T('n0>'),
    d2: T('d2'), olmaz: T('d2:0'), ucunuz: T('d2:3'), hayirD: T('d2:5'), hangi: T('d2:7'), d2s: T('d2>'),
    n1: T('n1'), ikisiN: T('n1:1'), ayni: T('n1:3'), n1s: T('n1>'),
    sallar: T('d4:8'), d6: T('d6'),
  };
  tm.hikKes = tm.h2 - 0.1; tm.ucluKes = tm.bir - 0.1; tm.necKes = tm.n0 - 0.12; tm.defKes = tm.d2 - 0.12;
  tm.uclu2Kes = tm.ucunuz - 0.15; tm.sayac = tm.hangi - 0.08;
  tm.vur = [0.32, 0.66];   // kanca: üç yumruk masaya birlikte iki kez vurur (knock)
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.hikKes - 0.1, 1.32, 542, 1098]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.ucluKes - 0.1, 1.45, 552, 1068]] },
    { id: 'uclu', t0: tm.ucluKes, cam: [[0, ...KAM.uclu], [tm.necKes - 0.1, 1.38, 649, 1085]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.defKes - 0.1, 1.45, 776, 1068]] },
    { id: 'defne', t0: tm.defKes, kisa: true, cam: [[0, ...KAM.defne], [tm.uclu2Kes - 0.05, 1.45, 355, 1068]] },
    { id: 'uclu2', t0: tm.uclu2Kes, kisa: true, cam: [[0, ...KAM.uclu], [tm.sayac - 0.05, 1.37, 647, 1085]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // sayaç ve ipucu: doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.33, 542, 1097]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // n1 balonu kesime kadar okunur
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1') };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç ve ipucu: doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.buldum - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.3), Math.log(1.34), u)), cx: lerp(542, 548, u), cy: lerp(1100, 1096, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    // kısa kuyruk: baş noktası balonun 185 px üstüne indirilir (uç, masadaki yumrukların üstüne binmez)
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (1355 - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: 1355, split: { h2: 5, d2: 7, d4: 5 } });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, kb, { y: 1355 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (perde yok; paylaşım hapı yok): daire solda altta, başlık sağda
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
const bak = (k, p, q) => { const h = H.eklem(k, p, 'head'); return [Math.max(-0.75, Math.min(0.75, (q[0] - h[0]) / 380)), Math.max(-0.5, Math.min(0.55, (q[1] - h[1]) / 420))]; };
const cene = (key, p, m) => { const h = H.eklem(key, p, 'head'); return [h[0] + m * 0.43 * p.s, h[1] + 0.4 * p.s]; };

function sahne(K, t, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  const tlTum = { ...S.tlS, lines: [...S.tlS.lines, ...S.tlN.lines] };   // dudak: n1 dahil
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.cd0 && t < tm.buldum;
  const ipucu = t >= tm.n1 - 0.3 && t < tm.buldum;
  const c0 = tm.cd0;
  const HEAD = k => [yer(k), Y[k] - 600];   // yaklaşık baş (bakış hedefi)
  // kanca: üç yumruk birlikte kalkar ve masaya iki kez vurur (temas tm.vur anlarında)
  const vur = Math.max(0, Math.sin(Math.PI * clamp01(t / tm.vur[0]))) + Math.max(0, Math.sin(Math.PI * clamp01((t - (tm.vur[1] - 0.24)) / 0.24)));   // ilk kalkış kare 0'dan başlar
  const yumYer = k => [yer(k) + YUM.dx, YUM.y - 30 * vur];
  const barYer = k => [yer(k) + BAR.dx, SY];
  const uclu = ['hikmet', 'genc', 'necmi'];
  // ortak baş cevapları (üçü birlikte): h2 "evet" / "hayır" gösterimi ve d2 "hayır dersiniz"
  const cevapla = p => { evet(p, t, tm.evet - 0.3, 2, 0.25); hayir(p, t, tm.hayirH + 0.06, 0.66); hayir(p, t, tm.hayirD - 0.04, 0.72); return p; };
  const gosteri = (t >= tm.evet - 0.3 && t < tm.hayirH + 0.72) || (t >= tm.hayirD - 0.04 && t < tm.hayirD + 0.68);

  // ——— Defne (solda; elinde tabaklı çay bardağı) ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  const kadeh = id === 'cevap' ? pIn(t, tm.d6 - 0.2, tm.end + 1, 0.4) : 0;   // arşiv: çağrıda Defne bardağını kaldırır
  const dBarEl = [yer('defne') - 58 + 30 * kadeh, 1150 - 45 * kadeh];
  dO.L = [dBarEl, 1, 'A'];
  dp.head.look = t < tm.birimizde + 0.2 ? bak('defne', dp, KUTU) : bak('defne', dp, HEAD('hikmet'));
  // h1 "Yüzük": boş kutunun kapağına dokunur; sonra yumruklara bakar
  const wKutu = pIn(t, 0.25, tm.birimizde + 0.3, 0.3, 0.3);
  if (wKutu > 0.01) dO.R = [[KUTU[0] - 16, KUTU[1] - 96], wKutu, 'A'];
  if (t >= tm.birimizde + 0.2 && t < tm.yalan) dp.head.look = bak('defne', dp, [yumYer('genc')[0], 1150]);
  if (t >= tm.h2 && t < tm.n0) { dp.head.look = bak('defne', dp, HEAD(t < tm.bir ? 'hikmet' : 'genc')); dp.expr = IF.merak; }
  if (t >= tm.n0 && t < tm.d2) { dp.head.look = bak('defne', dp, HEAD('necmi')); dp.expr = IF.ciddi; }
  // d2 "Olmaz": sağ el işaret parmağı sallanır; "Hangi soruyu": parmak çenede
  let dTek = 0, dCene = 0;
  if (t >= tm.defKes && t < tm.cd0 + 0.6) {
    dp.expr = IF.ciddi;
    dTek = pIn(t, tm.d2 - 0.1, tm.ucunuz + 0.2, 0.28, 0.3);
    if (dTek > 0.01) dO.R = [H.elYeri('defne', dp, 'R', 'gogus').map((v, i) => v + [55, -120][i]), dTek, 'B'];
    dp.head.look = t < tm.ucunuz ? [0.3 * Math.sin(TAU * (t - tm.d2) / 0.55) * (t < tm.olmaz + 0.5 ? 1 : 0) + 0.3, 0.05] : bak('defne', dp, HEAD('genc'));
    dCene = pIn(t, tm.hangi - 0.15, tm.cd0 + 0.4, 0.3, 0.35);
    if (dCene > 0.01) dO.R = [cene('defne', dp, 1), dCene, 'B'];
  }
  // sayaç: parmak yanakta; bakışı üç kişinin yüzleri arasında eşit gezer (yumruklara değil); kutuya dokunur
  let dParmak = false, dDokun = 0;
  if (sayacta) {
    dp.expr = IF.dusun;
    const dThink = Math.max(pIn(t, c0 + 0.5, c0 + 4.6, 0.35), pIn(t, c0 + 7.2, tm.n1 - 0.4, 0.35));
    const j = Math.floor((t - c0) / 1.3) % 3;
    dp.head.look = bak('defne', dp, HEAD(uclu[j]));
    dp.head.tilt = 4 * Math.sin(TAU * (t - c0) / 3.1);
    if (dThink > 0.01) { dO.R = [cene('defne', dp, 1), dThink, 'B']; dParmak = dThink > 0.6; }
    dDokun = pIn(t, c0 + 5.1, c0 + 6.7, 0.3);
    if (dDokun > 0.01) { dO.R = [[KUTU[0] - 16, KUTU[1] - 96 + 8 * Math.max(0, Math.sin(TAU * (t - c0 - 5.5) / 0.5))], dDokun, 'A']; dp.head.look = bak('defne', dp, KUTU); }
    if (ipucu) { dp.expr = IF.merak; dp.head.look = bak('defne', dp, HEAD('necmi')); }
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; dO.R = [H.elYeri('defne', dp, 'R', 'gogus').map((v, i) => v + [60, -40][i]), W(t, tm.cevap, 0.3), 'A']; }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Hikmet ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, expr: IF.emin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads, R: [yumYer('hikmet'), 1, 'A'] };
  hp.head.look = bak('hikmet', hp, HEAD('defne'));
  // h1: "birimizde" tek parmak, "yalan" parmak sallanır, "ikisi" iki parmak (sol el başın yanında)
  const wParmak = pIn(t, tm.birimizde - 0.3, tm.h1s + 0.1, 0.28, 0.3);
  const nParmak = t < tm.ikisi - 0.05 ? 1 : 1 + ease.enter(seg(t, tm.ikisi - 0.05, 0.2));
  if (wParmak > 0.01) hO.L = [[hp.x - 30, 1078], wParmak, 'A'];   // göğüs önünde (Defne'nin yüzüne gitmez)
  // h2: "üçümüz de" sol el açık avuç üç kişiyi gösterir; sonra iner
  const wUc = pIn(t, tm.uclumuz - 0.25, tm.biliyoruz + 0.4, 0.28, 0.3);
  if (wUc > 0.01) hO.L = [[hp.x - 66, 1105], wUc, 'A'];
  if (t >= tm.h2 && t < tm.n0) { hp.head.look = t < tm.bir ? bak('hikmet', hp, HEAD('defne')) : [-0.3, 0.05]; hp.expr = IF.ciddi; }
  if (t >= tm.n0 && t < tm.d2) { hp.head.look = bak('hikmet', hp, HEAD('necmi')); hp.expr = IF.sakin; }
  if (t >= tm.d2 && t < tm.cd0) { hp.head.look = bak('hikmet', hp, HEAD('defne')); hp.expr = IF.notr; }
  // sayaç: sol el çenede, bakışı Defne ve öbür ikisi arasında
  let hCene = 0;
  if (sayacta) {
    hp.expr = IF.emin;
    hCene = pIn(t, c0 + 1.2, c0 + 5.6, 0.35);
    if (hCene > 0.01) hO.L = [cene('hikmet', hp, -1), hCene, 'B'];
    const j = Math.floor((t - c0 + 0.6) / 1.6) % 3;
    hp.head.look = bak('hikmet', hp, HEAD(['defne', 'genc', 'necmi'][j]));
    if (ipucu) { hp.expr = IF.merak; hp.head.look = bak('hikmet', hp, HEAD('necmi')); }
  }
  if (id === 'cevap') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Kerem (genc; konuşmaz) ———
  const kp = H.kisi(H.KEREM, { x: yer('genc'), y: Y.genc, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const kO = { heads, sessiz: true, R: [yumYer('genc'), 1, 'A'] };
  kp.head.look = bak('genc', kp, HEAD('hikmet'));
  if (t < tm.birimizde) kp.head.look = bak('genc', kp, HEAD('defne'));
  if (t >= tm.h2 && t < tm.n0) { kp.expr = IF.sakin; if (t < tm.bir) H.onayla(kp, t, tm.biliyoruz - 0.05, 1, 0.36); else kp.head.look = bak('genc', kp, HEAD('defne')); }
  if (t >= tm.n0 && t < tm.d2) { kp.head.look = bak('genc', kp, HEAD('necmi')); kp.expr = IF.merak; /* Kerem tek başına tepki vermez */ }
  if (t >= tm.d2 && t < tm.cd0) { kp.head.look = bak('genc', kp, HEAD('defne')); kp.expr = IF.notr; }
  // sayaç: çay bardağını alır, göğsünün önünde tutar, geri koyar; bakışı gezer
  let kBar = 0;
  if (sayacta) {
    kp.expr = IF.dusun;
    kBar = pIn(t, c0 + 0.7, c0 + 5.0, 0.4, 0.4);
    const j = Math.floor((t - c0 + 1.1) / 1.5) % 3;
    kp.head.look = bak('genc', kp, HEAD(['defne', 'hikmet', 'necmi'][j]));
    if (t >= c0 + 6.0 && t < c0 + 7.4) { kp.head.look = [0.0, -0.35]; kp.expr = IF.merak; }
    if (ipucu) { kp.expr = IF.merak; kp.head.look = bak('genc', kp, HEAD('necmi')); }
  }
  const kBarYer = kar(barYer('genc'), [yer('genc') - 34, 1150], kBar);
  if (kBar > 0.001 || (sayacta && t >= c0 + 0.45 && t < c0 + 5.5)) kO.L = [[kBarYer[0], kBarYer[1] - 14], Math.max(kBar > 0 ? 1 : 0, pIn(t, c0 + 0.45, c0 + 5.4, 0.25, 0.25)), 'A'];
  if (id === 'cevap') kp.head.look = bak('genc', kp, HEAD('defne'));

  // ——— Necmi ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, expr: IF.sinsi, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads, R: [yumYer('necmi'), 1, 'A'] };
  np.head.look = bak('necmi', np, HEAD(t < tm.birimizde ? 'defne' : 'hikmet'));
  if (t >= tm.h2 && t < tm.n0) { np.head.look = bak('necmi', np, HEAD(t < tm.bir ? 'hikmet' : 'defne')); np.expr = IF.merak; }
  // n0: takılır; "Sor bakalım"da sol avuç açık Defne'ye doğru, kaşlar kalkık
  let wAvuc = 0;
  if (t >= tm.necKes && t < tm.d2) {
    np.expr = IF.sinsi; np.head.look = bak('necmi', np, HEAD('defne')); np.head.tilt = 9 * W(t, tm.n0, 0.3); np.lean = -6 * pIn(t, tm.n0 - 0.1, tm.d2 + 0.2, 0.35);
    wAvuc = 0;   // el hareketi yok: yalnız kaşlar ve baş eğilir (el Kerem'in yumruğuna yaklaşmasın)
  }
  if (t >= tm.d2 && t < tm.cd0) { np.head.look = bak('necmi', np, HEAD('defne')); np.expr = IF.notr; }
  // sayaç: kaşıkla çayını karıştırır, sonra eli çenede; ipucu: sol el iki parmak
  let nKas = 0, nCene = 0, nIki = 0;
  if (sayacta) {
    np.expr = IF.dusun;
    nKas = pIn(t, c0 + 0.4, c0 + 8.8, 0.3);   // sayaç boyunca çay karıştırır (el Kerem'in yüzüne gitmez)
    nCene = 0;
    const j = Math.floor((t - c0 + 0.3) / 1.4) % 3;
    np.head.look = bak('necmi', np, HEAD(['genc', 'defne', 'hikmet'][j]));
    if (nKas > 0.01) np.head.look = bak('necmi', np, [barYer('necmi')[0], 1120]);
    if (nCene > 0.01) nO.L = [cene('necmi', np, -1), nCene, 'B'];
    if (ipucu) {
      np.expr = IF.merak;
      nIki = pIn(t, tm.n1 - 0.25, tm.buldum + 0.3, 0.28, 0.3);
      nO.L = [H.elYeri('necmi', np, 'L', 'yukari').map((v, i) => v + [34, 95][i]), nIki, 'B'];
      np.head.look = bak('necmi', np, HEAD('defne'));
    }
  }
  const nBarYer = kar(barYer('necmi'), [yer('necmi') - 72, 1132], wAvuc);
  if (wAvuc > 0.001) nO.L = [[nBarYer[0], nBarYer[1] - 30], 1, 'A'];
  const kasEl = (() => { const g = barYer('necmi'), a = TAU * (t - c0) / 0.7; return [g[0] + 7 * Math.cos(a), g[1] - 78 + 3 * Math.sin(a)]; })();
  if (nKas > 0.01) nO.L = [[kasEl[0], kasEl[1] - 8], nKas, 'A'];
  if (id === 'cevap') np.head.look = bak('necmi', np, HEAD('defne'));

  // ortak baş cevapları (sayaç dışında)
  if (!sayacta) for (const p of [hp, kp, np]) cevapla(p);
  if (id === 'cevap') { hayir(hp, t, tm.sallar, 0.72); evet(kp, t, tm.sallar, 2, 0.32); evet(np, t, tm.sallar, 2, 0.32); for (const p of [hp, kp, np]) evet(p, t, tm.d6 + 0.4, 2, 0.34); }
  if (gosteri) { hp.expr = IF.ciddi; kp.expr = IF.ciddi; np.expr = IF.ciddi; }

  // ——— Çizim: karakterler → masa → nesneler → tutan eller ———
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);
  const kc = oyna(K, t, null, H.KEREM, kp, kO);
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);
  masa(K);
  kutu(K, KUTU);
  bardak(K, ...barYer('hikmet'));
  if (kBar < 0.001) bardak(K, ...barYer('genc'));
  else { K.ell(barYer('genc')[0], SY, 34, 8, PAL.cream, LW * 0.55); bardak(K, kBarYer[0], kBarYer[1] + 6, { tabak: false }); }
  if (wAvuc < 0.001) bardak(K, ...barYer('necmi'));
  else { K.ell(barYer('necmi')[0], SY, 34, 8, PAL.cream, LW * 0.55); bardak(K, nBarYer[0], nBarYer[1] + 6, { tabak: false }); }
  for (const k of uclu) if (!(k === 'genc' && kBar > 0.001) && !(k === 'necmi' && wAvuc > 0.001)) H.buhar(K, barYer(k)[0], SY - 70, t + (k === 'genc' ? 0.7 : k === 'necmi' ? 1.4 : 0), { k: 0.45, n: 2 });
  // Defne'nin elindeki bardak (tabaklı)
  if (!(id === 'buldum' && false)) bardak(K, dBarEl[0] + 4, dBarEl[1] + 14, { k: 0.95 });
  if (nKas > 0.01) kasik(K, kasEl, [barYer('necmi')[0] + 2, SY - 22]);
  // yumruklar: üçü aynı çizim, eli örter
  for (const k of uclu) yumruk(K, k, yumYer(k));
  // tutan eller
  dc.tut('L');
  if (wKutu > 0.6 || dDokun > 0.6) dc.isaret('R', [KUTU[0] - 4, KUTU[1] - 96]);
  if (dTek > 0.6) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 + 0.32 * Math.sin(TAU * (t - tm.d2) / 0.45), boy: 1.15 });
  if (dCene > 0.6 || dParmak) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (id === 'cevap') dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.4, boy: 1 });
  if (wParmak > 0.6) hc.parmak('L', nParmak, { toplam: 2, yon: -Math.PI / 2 + (t >= tm.yalan - 0.05 && t < tm.ikisi - 0.1 ? 0.3 * Math.sin(TAU * (t - tm.yalan) / 0.45) : 0), ac: 0.32, boy: 0.9 });
  if (wUc > 0.6) hc.parmak('L', 4, { toplam: 4, yon: -0.25, ac: 0.28, boy: 0.8 });
  if (hCene > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (kBar > 0.001) kc.tut('L');
  if (wAvuc > 0.001) nc.tut('L');
  if (nKas > 0.6) nc.tut('L');
  if (nCene > 0.6 && !ipucu) nc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25, boy: 0.95 });
  if (nIki > 0.6) nc.parmak('L', 2, { toplam: 2, yon: -Math.PI / 2, ac: 0.34, boy: 0.95 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
