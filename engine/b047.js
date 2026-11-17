// Bölüm 47 · KEREM'İN BARDAKLARI (v4 "hikâye" dili; storyboard: hikayeler/bolum_047_v5.md). Kaynak: research/ozgun_bilmeceler.md Ö1.
// Logline: Kerem anahtarı arşivdeki 2×2 dolabın bir çekmecesine koyar; hiç konuşmaz. Çay ocağındaki 2×2 tepsiyi Hikmet
// dizmiştir. Kerem tek bir bardak çevirip çıkacak, Necmi tepsiye bakıp doğru çekmeceyi bulacak. Defne "anahtarın yerine
// denk gelen bardağı çevirir" der; Hikmet "hangisinin çevrildiğini nereden bilecek?" diye itiraz eder. Necmi tepsiyi
// dolabın yanına koyar: "iki üstte, iki altta". Cevap: tepsi dolabın haritasıdır; sağ sütundaki ve alt sıradaki ters
// bardakların tek/çift oluşu çekmeceyi söyler. Kerem sağ-alt bardağı çevirir, iki sayaç birden döner.
// Akılda kalacak tek şey: tek bir bardak, iki sayının tek/çiftini istediğin gibi ayarlar.
// Mekânlar: çay ocağı (tezgâh önde, karakterler arkasında) · arşiv (2×2 çekmeceli dolap, sehpa). Her kare t'nin saf
// fonksiyonudur; Math.random yok.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Kod ve mantık denetimi ═══════════════════════════
// Bardak sırası: 0 sol-üst, 1 sağ-üst, 2 sol-alt, 3 sağ-alt. 1 = ters. Çekmece de aynı sırayla.
// Sütun: sağ sütundaki ters sayısı tekse sağ. Sıra: alt sıradaki ters sayısı tekse alt.
const cevir = (d, i) => d.map((v, j) => (j === i ? 1 - v : v));
const coz = d => ((d[1] + d[3]) % 2) + 2 * ((d[2] + d[3]) % 2);
// Kerem'in seçimi: hedef ile şu anki gösterilen arasındaki fark. Sütun farkı → sağ sütun, sıra farkı → alt sıra.
const kerem = (d, hedef) => { const g = coz(d), s = (g ^ hedef) & 1, r = ((g ^ hedef) >> 1) & 1; return s && r ? 3 : s ? 1 : r ? 2 : 0; };
// Sahnedeki örnek: Hikmet sağ-üstü ve sol-altı ters dizer (DIZ0). Defne yanlış denemede sol-üstü içip ters çevirir (DIZ):
// sayaç, ipucu ve cevap bu dizilişle oynanır; sağ-altı gösterir. Anahtar sol-üstte; Kerem sağ-altı çevirir → sol-üst.
const DIZ0 = [0, 1, 1, 0], DEFNE_I = 0, DIZ = cevir(DIZ0, DEFNE_I), ANAHTAR = 0, KEREM_I = 3;
{
  let ok = 0;
  for (let m = 0; m < 16; m++) for (let h = 0; h < 4; h++) { const d = [m & 1, (m >> 1) & 1, (m >> 2) & 1, (m >> 3) & 1]; if (coz(cevir(d, kerem(d, h))) === h) ok++; }
  const once = coz(DIZ), sonra = coz(cevir(DIZ, KEREM_I));
  if (ok !== 64 || kerem(DIZ, ANAHTAR) !== KEREM_I || sonra !== ANAHTAR || (once & 1) === (sonra & 1) || (once >> 1) === (sonra >> 1) || DIZ0[DEFNE_I] || DIZ[KEREM_I])
    console.warn('b047: kod denetimi tutmadı', ok, once, sonra);
}
const tersSay = (d, cizgi) => cizgi === 'sutun' ? d[1] + d[3] : d[2] + d[3];

// ═══════════════════════════ Ölçüler ═══════════════════════════
const OCAK = 'b047_ocak', ARSIV = 'b047_arsiv', ZEMIN = 1500;
const YESIL = PAL.green, MERCAN = PAL.coral, HARDAL = PAL.mustard;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// Çay ocağı: Defne, tepsi, Hikmet, Kerem (tezgâhın arkasında)
const O = { def: 250, hik: 720, ker: 985, tepsi: [450, 1326], tezUst: 1258, tezOn: 1332, demlik: [990, 1322] };
// Arşiv: sehpa + tepsi solda, dolap sağda. Espri ve çağrı odanın sağ yarısında.
const A = { tepsi: [330, 1292], sehpa: [100, 560, 1252], kerHero: 250, necHero: 1200, necGel: 1000, kerKanca: 520, hikKanca: 300, defKanca: 100, necSoru: 560, necIpucu: 620,
  kerEs: 1380, hikEs: 1660, defEs: 980 };
const DOLAP = { x: 710, y: 860, w: 240, h: 460 };
const GH = 100;   // bardak boyu (k = 1)
const OK = 1.5, AK = 1.2;   // tepsi ölçeği: çay ocağı, arşiv

// ═══════════════════════════ Bardak, tepsi ═══════════════════════════
// İnce belli çay bardağı; yerel (0, 0) merkez, ağız yukarıda (ang 0). dolu 0..1 çay seviyesi. Boş bardak ters döndükçe koyu siluet olur.
function bardakYolu(ctx, k) {
  const h = GH / 2 * k, w = k;
  ctx.beginPath();
  ctx.moveTo(-29 * w, -h);
  ctx.bezierCurveTo(-27 * w, -h * 0.45, -15 * w, -h * 0.25, -16 * w, h * 0.05);
  ctx.bezierCurveTo(-17 * w, h * 0.35, -26 * w, h * 0.55, -24 * w, h * 0.78);
  ctx.lineTo(-24 * w, h); ctx.lineTo(24 * w, h); ctx.lineTo(24 * w, h * 0.78);
  ctx.bezierCurveTo(26 * w, h * 0.55, 17 * w, h * 0.35, 16 * w, h * 0.05);
  ctx.bezierCurveTo(15 * w, -h * 0.25, 27 * w, -h * 0.45, 29 * w, -h);
  ctx.closePath();
}
function bardak(K, [x, y], ang, { dolu = 0, k = 1, vurgu = 0 } = {}) {
  const { ctx } = K, h = GH / 2 * k, s = 1 + 0.14 * vurgu;
  const tersU = clamp01((Math.abs(Math.cos(ang / 2)) < 0.5 ? 1 : 0) + 0);   // ağız aşağıdaysa ters
  const koyu = dolu > 0.02 ? 0 : ease.state(clamp01((1 - Math.cos(ang)) / 2 * 1.6 - 0.3));
  void tersU;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.lineJoin = 'round';
  // cam
  bardakYolu(ctx, k); ctx.fillStyle = H.mixHex('#E6F0EC', '#1E3436', koyu); ctx.fill();
  // çay (bardak ekseninde seviye; içilirken azalır)
  if (dolu > 0.02) {
    ctx.save(); bardakYolu(ctx, k); ctx.clip();
    const yS = h * 0.84 - (h * 0.84 + h * 0.62) * dolu;
    ctx.fillStyle = '#B4502A'; ctx.fillRect(-40 * k, yS, 80 * k, h * 2);
    ctx.fillStyle = '#D9783F'; ctx.fillRect(-40 * k, yS, 80 * k, 7 * k);
    ctx.restore();
  }
  // taban (kalın dip) ve parıltı
  K.rect(-24 * k, h * 0.72, 48 * k, h * 0.28, koyu > 0.5 ? '#2E4A4C' : '#C9DAD4', 0, 3 * k);
  ctx.save(); ctx.globalAlpha = 0.7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-19 * k, -h * 0.8); ctx.quadraticCurveTo(-17 * k, -h * 0.4, -10 * k, -h * 0.15);
  ctx.lineWidth = 5 * k; ctx.strokeStyle = koyu > 0.5 ? '#5E8486' : '#FFFFFF'; ctx.stroke(); ctx.restore();
  bardakYolu(ctx, k); ctx.lineWidth = LW * 0.85; ctx.strokeStyle = INK; ctx.stroke();
  K.line(-28 * k, -h + 1, 28 * k, -h + 1, 4, INK);
  ctx.restore();
}
// Tepsi: (cx, yb) ön kenar ortası; arkadan bakış açısıyla yamuk. Yuvalar: 0 sol-üst (arka), 1 sağ-üst, 2 sol-alt (ön), 3 sağ-alt
const yuva = ([cx, yb], i, k = 1) => { const arka = i < 2, sag = i % 2; return [cx + (sag ? 1 : -1) * (arka ? 60 : 70) * k, yb - (arka ? 108 : 24) * k]; };
const yuvaK = i => (i < 2 ? 0.93 : 1);
const merkez = (p, i, k = 1) => [p[0], p[1] - GH / 2 * yuvaK(i) * k - 4];   // bardak merkezi (yuva = taban)
function tepsi(K, [cx, yb], k = 1) {
  const { ctx } = K;
  ctx.save();
  K.poly([[cx - 148 * k, yb - 142 * k], [cx + 148 * k, yb - 142 * k], [cx + 172 * k, yb + 4], [cx - 172 * k, yb + 4]], '#C9C6B8', LW);
  K.poly([[cx - 132 * k, yb - 132 * k], [cx + 132 * k, yb - 132 * k], [cx + 152 * k, yb - 8], [cx - 152 * k, yb - 8]], '#DEDBCF', LW * 0.5);
  K.rect(cx - 172 * k, yb, 344 * k, 16 * k, PAL.metal, LW * 0.8, 4);
  ctx.restore();
  for (let i = 0; i < 4; i++) { const p = yuva([cx, yb], i, k), kk = yuvaK(i) * k; K.ell(p[0], p[1] - 2, 34 * kk, 9 * kk, '#F4EDE0', LW * 0.6); }
}
// Hücre çerçevesi (cevapta: tepsi ve dolap aynı 2×2)
function hucre(K, p, i, k, renk, a, lw = 7, dash = null) {
  if (a <= 0.01) return;
  const { ctx } = K, c = merkez(p, i, k), kk = yuvaK(i) * k;
  ctx.save(); ctx.globalAlpha = a; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.roundRect(c[0] - 50 * kk, c[1] - 62 * kk, 100 * kk, 124 * kk, 18); ctx.lineWidth = lw; ctx.strokeStyle = renk; ctx.stroke();
  ctx.restore();
}

// ═══════════════════════════ Dolap, anahtar, demlik ═══════════════════════════
const cekmece = i => { const cw = (DOLAP.w - 32 - 12) / 2, ch = (DOLAP.h - 32 - 12) / 2, c = i % 2, r = i >> 1; return { x: DOLAP.x + 16 + c * (cw + 12), y: DOLAP.y + 16 + r * (ch + 12), w: cw, h: ch }; };
const kulp = i => { const d = cekmece(i); return [d.x + d.w / 2, d.y + d.h * 0.42]; };
// acik[i] 0..1 (çekmece dışarı kayar: ön yüz büyür, üstte iç karanlık şerit). renk[i] = [renk, a]
function dolap(K, acik = [0, 0, 0, 0], renk = []) {
  const { x, y, w, h } = DOLAP;
  K.rect(x + 20, y + h - 4, 22, ZEMIN - y - h + 4, PAL.woodDark, LW * 0.7); K.rect(x + w - 42, y + h - 4, 22, ZEMIN - y - h + 4, PAL.woodDark, LW * 0.7);
  K.rect(x - 10, y - 26, w + 20, 30, PAL.woodTop, LW, 6);
  K.rect(x, y, w, h, PAL.wood, LW, 6);
  for (let i = 0; i < 4; i++) {
    const d = cekmece(i), u = acik[i] || 0, [rc, ra] = renk[i] || [null, 0];
    K.rect(d.x, d.y, d.w, d.h, '#5A3B1F', LW * 0.7, 4);
    const g = 10 * u;
    if (u > 0.02) K.rect(d.x - g, d.y - 22 * u, d.w + 2 * g, 26 * u, '#3A2614', LW * 0.6, 3);
    K.rect(d.x - g, d.y + 4 * u, d.w + 2 * g, d.h + 6 * u, ra > 0 ? H.mixHex(PAL.woodTop, rc, ra) : PAL.woodTop, LW * 0.8, 6);
    K.rect(d.x + d.w / 2 - 34, d.y + 30 + 4 * u, 68, 40, PAL.paper, LW * 0.5, 4);
    K.line(d.x + d.w / 2 - 22, d.y + 46 + 4 * u, d.x + d.w / 2 + 22, d.y + 46 + 4 * u, 4, '#B9B4A8');
    K.line(d.x + d.w / 2 - 22, d.y + 58 + 4 * u, d.x + d.w / 2 + 10, d.y + 58 + 4 * u, 4, '#B9B4A8');
    const kp = kulp(i); K.rect(kp[0] - 30, kp[1] + 30 + 4 * u, 60, 18, PAL.metalDark, LW * 0.7, 9);
  }
}
const kulpTut = (i, u = 0) => { const k = kulp(i); return [k[0], k[1] + 39 + 4 * u]; };
function anahtar(K, [x, y], rot = 0, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  K.rect(-5, 0, 10, 62, '#D9A43A', 4, 3);
  K.poly([[5, 40], [20, 40], [20, 48], [12, 48], [12, 56], [5, 56]], '#D9A43A', 4);
  K.circ(0, -16, 20, '#D9A43A', 5); K.circ(0, -16, 8, PAL.paper, 4);
  ctx.restore();
}
// Demlik (çaydanlık): (x, y) sap tutuş noktası; ağız sola bakar. egim: dökme açısı (rad, eksi = ağız aşağı)
function demlik(K, [x, y], egim = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(egim);
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(-56, 6, 52, Math.PI * 1.15, Math.PI * 1.95); ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  K.poly([[-100, 26], [-150, -6], [-158, 4], [-106, 46]], PAL.metal, LW);
  K.rect(-112, 10, 112, 80, PAL.metal, LW, 16);
  K.rect(-96, -36, 80, 48, '#B9C6BB', LW, 12); K.circ(-56, -42, 9, '#3A3F3C', LW * 0.6);
  ctx.restore();
}
const demlikAgiz = ([x, y], egim) => { const c = Math.cos(egim), s = Math.sin(egim), dx = -156, dy = -2; return [x + dx * c - dy * s, y + dx * s + dy * c]; };

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(OCAK, {
  gen: [-300, 1500], dongu: ['demlik buharı', 'duvar saatinin saniye kolu', 'pencerede martı'],
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 1700, isik, duvar: 'fayans', zemin: 'karo' });
    M.pencere(K, 80, 560, 300, 360, { isik, t, manzara: 'istanbul', marti: true });
    M.duvarSaati(K, 1180, 720, 60, 15.2 + t / 60, t);
    // raf: bardaklar ve şekerlik
    K.rect(520, 780, 520, 22, PAL.woodTop, LW, 6);
    for (let i = 0; i < 5; i++) bardak(K, [590 + i * 70, 780 - GH * 0.33 - 2], 0, { k: 0.62 });
    K.rect(960, 724, 60, 56, '#CFE3DD', LW, 10); K.rect(954, 712, 72, 16, PAL.metal, LW * 0.8, 6);
    // arka tezgâh (duvar boyu): lavabo
    K.rect(-300, 1060, 1900, 30, PAL.woodTop, LW, 6);
  },
  on(K) {
    // ön tezgâh: üst yüzey ve ön yüz (karakterlerin belinden aşağısını örter)
    K.poly([[-400, O.tezUst], [1700, O.tezUst], [1700, O.tezOn], [-400, O.tezOn]], '#C9B48E', LW);
    K.rect(-400, O.tezOn, 2100, 400, PAL.wood, LW);
    for (let i = 0; i < 7; i++) { const x = -260 + i * 300; K.rect(x, O.tezOn + 34, 260, 200, PAL.woodTop, LW * 0.8, 6); K.circ(x + 130, O.tezOn + 60, 9, '#5D6A61', LW * 0.6); }
  },
});
M.mekanEkle(ARSIV, {
  gen: [-300, 2300], dongu: ['tavan lambasının ışık çokgeni', 'pencerede bulut', 'duvar saati'],
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 2400, isik, duvar: 'duz', zemin: 'ahsap' });
    // raflar ve klasörler (solda ve sağda)
    const KL = ['#C2412F', '#2F7F7A', '#D19A2E', '#5E9A4E', '#8C6A9A', '#3F6E8C'];
    for (const [x0, n] of [[-260, 6], [1080, 10]]) for (const y of [640, 860]) {
      K.rect(x0, y, n * 64 + 30, 18, PAL.woodTop, LW, 4);
      for (let i = 0; i < n; i++) { const c = KL[(i * 5 + y) % 6]; K.rect(x0 + 16 + i * 64, y - 150 + (i % 3) * 8, 52, 150 - (i % 3) * 8, c, LW * 0.8, 4); K.circ(x0 + 42 + i * 64, y - 50, 9, PAL.paper, 3); }
    }
    M.pencere(K, 1820, 600, 280, 340, { isik, t, manzara: null });
    M.duvarSaati(K, 480, 560, 54, 16.1 + t / 60, t);
    // tavan lambası (döngü: ışık çokgeni hafifçe nefes alır)
    K.line(780, 0, 780, 300, 5); K.poly([[700, 300], [860, 300], [820, 250], [740, 250]], PAL.teal, LW);
  },
  isik(K, t) {
    const a = 0.12 + 0.04 * Math.sin(t * 1.7);
    H.isikSeridi(K, [[705, 302], [855, 302], [1080, 1500], [480, 1500]], { a, renk: '#F6E7B8' });
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    anahtarIn: 0.3, kapan: 0.62, konusmaz: T('h1:6'), anahtarK: T('h1:1'),
    h2a: T('h2a'), dizdim: T('h2a:4'), kerem: T('h2a:5'), tek: T('h2a:6'), cikacak: T('h2a:9'),
    h2b: T('h2b'), dogru: T('h2b:3'), nasil: T('h2b:6'),
    d2: T('d2'), anahtarD: T('d2:1'), cevirir: T('d2:6'),
    hd: T('hd'), hangi: T('hd:1'), cevril: T('hd:2'), bilecek: T('hd:4'), bardakH: T('hd:5'), karis: T('hd:7'), hdSon: T('hd>'),
    n1: T('n1'), dolapN: T('n1:3'), iki1: T('n1:5'), ust: T('n1:6'), iki2: T('n1:7'), alt: T('n1:8'),
    harita: T('d3:4'), bu: T('d3:1'),
    d4: T('d4'), sagS: T('d4:0'), tersW: T('d4:2'), sagda: T('d4:6'), altS: T('d4:7'), altta: T('d4:10'),
    d5: T('d5'), sayi: T('d5:4'), ayar: T('d5:7'),
    h4: T('h4'), konuskan: T('h4:4'), espri: T('h4') - 0.25,
    cta: T('d6') - 0.2,
  };
  tm.icD = tm.cevirir - 1.75; tm.icK = tm.ayar - 1.75;
  tm.hero = tm.bu - 0.05;
  tm.cdB = cd0 + 5.2; tm.bak = cd + 0.2; tm.ipucu = tm.bak + 5 / 30;
  // sayaç: Hikmet TR bardağı doğrultup doldurur
  tm.demAl = cd0 + 0.9; tm.dok0 = cd0 + 1.9; tm.dok1 = cd0 + 3.1; tm.demBirak = cd0 + 4.0;
  tm.gel = tm.ayar - 1.25; tm.yesil = tm.ayar + 0.22; tm.ac = tm.ayar + 0.36; tm.al = tm.ac + 0.32; tm.cik = tm.al + 0.12;

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.02, 480, 1010], [0.3, 1.06, 500, 1000], [tm.konusmaz - 0.3, 1.1, 520, 990]] },
    { id: 'dizi', t0: tm.h2a - 0.05, cam: [[0, 1.26, 620, 1130], [tm.kerem - 0.1, 1.18, 760, 1125]] },
    { id: 'soru', t0: tm.h2b - 0.05, cam: [[0, 1.22, 700, 1040], [tm.nasil, 1.25, 690, 1035]] },
    { id: 'deneme', t0: tm.d2 - 0.1, cam: [[0, 1.2, 480, 1125], [tm.hd, 1.22, 488, 1118]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 1.0, 500, 900], [cd0 + 4.4, 1.02, 495, 895], [tm.cdB, 1.3, 520, 960], [cd - 0.6, 1.33, 515, 955]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.16, 530, 1090], [tm.iki1, 1.2, 515, 1098]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 285, 1000]] },
    { id: 'cevap', t0: tm.hero, cam: [[0, 1.1, 540, 1100]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.3, 1520, 1040], [tm.konuskan, 1.34, 1530, 1030]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.36, 1210, 1030], [tm.cta + 1.6, 1.4, 1200, 1024]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar ———
  const hikBase = H.kisi('hikmet', { x: A.hikKanca, expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.2] }, ...POZ.dur });
  const hik = [
    [1.0, { head: { tilt: 3, look: [0.05, 0.05] } }, 0.35],
    [tm.anahtarK + 0.6, { head: { tilt: -4, look: [0.7, 0.1] } }, 0.3],
    [tm.h2a - 0.05, { x: O.hik, expr: 'mutlu', head: { tilt: 4, look: [-0.6, 0.6] } }, 0.01],
    [tm.kerem - 0.1, { head: { tilt: -4, look: [0.8, 0.1] } }, 0.3],
    [tm.cikacak, { head: { tilt: 4, look: [0.05, 0.05] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: -3, look: [-0.8, 0.2] } }, 0.01],
    [tm.hangi - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [-0.6, 0.6] } }, 0.3],
    [tm.bardakH, { expr: 'mutlu', head: { tilt: -5, look: [-0.8, 0.1] } }, 0.3],
    [cd0 - 0.05, { expr: 'mutlu', head: { tilt: 4, look: [-0.6, 0.6] } }, 0.01],
    [tm.dok1 + 0.6, { head: { tilt: -4, look: [-0.7, 0.2] } }, 0.35],
    [tm.espri, { x: A.hikEs, expr: 'mutlu', head: { tilt: 5, look: [-0.5, 0.5] } }, 0.01],
    [tm.konuskan - 0.15, { expr: 'yorgun', head: { tilt: -6, look: [-0.8, 0.15] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: A.defKanca, expr: 'saskin', head: { tilt: 5, look: [0.75, 0.3] }, ...POZ.dur });
  const def = [
    [tm.anahtarK + 0.6, { expr: 'notr', head: { tilt: -3, look: [0.8, 0.05] } }, 0.35],
    [tm.d2 - 0.1, { x: O.def, expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.5] } }, 0.01],
    [tm.cevirir + 0.3, { expr: 'mutlu', head: { tilt: 4, look: [0.8, 0.0] } }, 0.3],
    [tm.hangi, { expr: 'notr', head: { tilt: 3, look: [0.6, 0.55] } }, 0.3],
    [tm.hdSon - 0.3, { expr: 'saskin', head: { tilt: -6, look: [0.7, 0.2] } }, 0.25],
    [cd0 - 0.05, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 5, look: [0.6, 0.55] } }, 0.01],
    [cd0 + 2.6, { head: { tilt: -5, look: [0.75, 0.3] } }, 0.4],
    [tm.cdB + 0.3, { expr: IFADE.dusun2, armR: POZ.dur.armR, head: { tilt: 4, look: [0.6, 0.6] } }, 0.35],
    [tm.cdB + 3.0, { ...POZ.dusun, head: { tilt: -6, look: [0.3, -0.5] } }, 0.4],
    [tm.bak, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -3, look: [0.95, 0.05] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.espri, { x: A.defEs, expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 5, look: [0.8, 0.2] } }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: -4, look: [0.05, 0.05] } }, 0.3],
  ];
  const kerBase = H.kisi(H.KEREM, { x: A.kerKanca, expr: 'notr', head: { tilt: 3, look: [0.6, -0.2] }, ...POZ.dur });
  const ker = [
    [tm.kapan + 0.4, { head: { tilt: -4, look: [-0.3, 0.1] } }, 0.35],
    [tm.konusmaz, { expr: 'mutlu', head: { tilt: 5, look: [0.05, 0.05] } }, 0.3],
    [tm.h2a - 0.05, { x: O.ker, expr: 'notr', head: { tilt: -3, look: [-0.8, 0.5] } }, 0.01],
    [tm.kerem, { head: { tilt: 4, look: [-0.8, 0.1] } }, 0.3],
    [tm.cikacak - 0.1, { head: { tilt: -4, look: [0.85, 0.0] } }, 0.25],
    [tm.d2 - 0.1, { head: { tilt: 3, look: [-0.8, 0.5] } }, 0.01],
    [cd0 + 3.0, { head: { tilt: -3, look: [-0.7, 0.4] } }, 0.35],
    [tm.hero, { x: A.kerHero, expr: 'notr', head: { tilt: 3, look: [0.65, 0.6] } }, 0.01],
    [tm.ayar + 0.3, { expr: 'mutlu', head: { tilt: -4, look: [0.7, 0.1] } }, 0.3],
    [tm.espri, { x: A.kerEs, expr: 'notr', head: { tilt: 4, look: [0.8, 0.2] } }, 0.01],
  ];
  const necBase = H.kisi('necmi', { x: A.necSoru, expr: 'notr', head: { tilt: 3, look: [0.7, -0.2] }, ...POZ.dur });
  const nec = [
    [tm.nasil - 0.2, { expr: 'saskin', head: { tilt: -6, look: [0.05, 0.1] } }, 0.25],
    [tm.ipucu, { x: A.necIpucu, expr: 'mutlu', head: { tilt: -3, look: [-0.7, 0.6] } }, 0.01],
    [tm.dolapN - 0.1, { head: { tilt: 4, look: [0.9, 0.0] } }, 0.25],
    [tm.iki1 - 0.15, { head: { tilt: -3, look: [-0.7, 0.6] } }, 0.25],
    [tm.hero, { x: A.necHero, expr: 'notr', head: { tilt: 4, look: [-0.8, 0.4] } }, 0.01],
    [tm.ayar + 0.1, { expr: 'mutlu', head: { tilt: -4, look: [-0.5, -0.1] } }, 0.3],
  ];
  return { tm, film, hikBase, hik, defBase, def, kerBase, ker, necBase, nec };
}

// ═══════════════════════════ Durum fonksiyonları ═══════════════════════════
// İçip ters çevirme (Defne yanlış denemede, Kerem cevapta): uzan → kaldır → ağıza → iç → ters çevirip yuvaya bırak.
// Dönen: { c, ang, dolu, el, w, tut } (c: bardak merkezi; el: elin hedefi)
function icme(t, t0, key, p, G, { tilt = -0.9, yan = 0.5 } = {}) {
  const u = t - t0, s = p.s, hd = H.eklem(key, p, 'head'), Mt = [hd[0] + yan * s, hd[1] + 0.36 * s];
  const res = { c: G, ang: 0, dolu: 1, el: G, w: 0, tut: false };
  if (u < 0) return res;
  if (u < 0.28) return { ...res, w: ease.state(u / 0.28), tut: u > 0.2 };
  if (u < 0.62) { const c = H.yay(G, Mt, ease.state((u - 0.28) / 0.34), 24); return { ...res, c, el: c, w: 1, tut: true }; }
  if (u < 1.12) { const a = Math.sin(Math.PI * clamp01((u - 0.62) / 0.5)); const c = [Mt[0] - 10 * a, Mt[1] - 6 * a]; return { ...res, c, el: c, ang: tilt * Math.min(1, a * 1.6), dolu: 1 - ease.state(clamp01((u - 0.68) / 0.36)), w: 1, tut: true }; }
  if (u < 1.75) { const v = ease.state((u - 1.12) / 0.63), c = H.yay(Mt, G, v, 40); return { ...res, c, el: c, ang: Math.PI * v, dolu: 0, w: 1, tut: true }; }
  return { ...res, ang: Math.PI, dolu: 0, w: 1 - ease.state(seg(t, t0 + 1.85, 0.3)), tut: u < 1.9 };
}
// Çay ocağındaki tepsi: [{ c, ang, dolu, vurgu }] (+ hangi bardak kimin elinde)
function ocakTepsi(t, S, dp, hp) {
  const { tm } = S, P = O.tepsi, out = [];
  for (let i = 0; i < 4; i++) { const g = merkez(yuva(P, i, OK), i, OK); out.push({ c: g, ang: DIZ0[i] ? Math.PI : 0, dolu: DIZ0[i] ? 0 : 1, k: yuvaK(i) * OK }); }
  // h2a: Hikmet son bardağı (sol-alt, ters) yuvasına bırakır
  if (t < tm.dizdim + 0.1) { const g = out[2].c, u = ease.state(seg(t, tm.dizdim - 0.3, 0.36)); out[2].c = [g[0] + 30 * (1 - u), g[1] - 70 * (1 - u)]; out[2].el = out[2].c; out[2].tutan = 'hik'; }
  // d2: Defne sol-üstü (anahtarın çekmecesine denk gelen) içip ters çevirir; tepsi bundan sonra DIZ'de kalır
  const ic = icme(t, tm.icD, 'defne', dp, out[DEFNE_I].c, { yan: 0.42 });
  if (t >= tm.icD) out[DEFNE_I] = { ...out[DEFNE_I], c: ic.c, ang: ic.ang, dolu: ic.dolu, el: ic.el, w: ic.w, tutan: ic.tut ? 'def' : null, uz: 'def' };
  void hp;
  return out;
}
// Arşivdeki tepsi (Necmi'nin koyduğu, aynı diziliş). Cevapta Kerem sağ-altı içip ters çevirir.
function arsivTepsi(t, S, kp) {
  const { tm } = S, P = A.tepsi, out = [];
  for (let i = 0; i < 4; i++) { const g = merkez(yuva(P, i, AK), i, AK); out.push({ c: g, ang: DIZ[i] ? Math.PI : 0, dolu: DIZ[i] ? 0 : 1, k: yuvaK(i) * AK }); }
  if (kp && t >= tm.icK) { const ic = icme(t, tm.icK, H.KEREM, kp, out[3].c, { yan: 0.3 }); out[3] = { ...out[3], c: ic.c, ang: ic.ang, dolu: ic.dolu, el: ic.el, w: ic.w, tutan: ic.tut ? 'ker' : null, uz: 'ker' }; }
  if (t >= tm.icK + 1.75) out[3] = { ...out[3], ang: Math.PI, dolu: 0 };
  return out;
}
const KB = [O.tepsi[0] + 380, O.tepsi[1] - 30];   // Hikmet'in kendi bardağı (tezgâhta, tepsinin sağında)
function demlikAt(t, tm) {
  const ev = [O.demlik[0] + 40, O.demlik[1] - 128];          // sap, tezgâhta
  const dok = [KB[0] + 150, KB[1] - GH * 1.2 - 150]; // sap, dökme yerinde (ağız TR bardağın üstünde)
  if (t < tm.demAl + 0.3) return { p: ev, egim: 0, w: pIn(t, tm.demAl, 1e9, 0.28), tut: t > tm.demAl + 0.22 };
  if (t < tm.dok0) return { p: H.tasi(t, tm.demAl + 0.3, tm.dok0 - tm.demAl - 0.3, ev, dok, 60), egim: 0, w: 1, tut: true };
  if (t < tm.dok1 + 0.3) { const e = -0.55 * ease.state(seg(t, tm.dok0, 0.3)) * (1 - ease.state(seg(t, tm.dok1, 0.3))); return { p: dok, egim: e, w: 1, tut: true, akis: e < -0.4 }; }
  if (t < tm.demBirak) return { p: H.tasi(t, tm.dok1 + 0.3, tm.demBirak - tm.dok1 - 0.3, dok, ev, 50), egim: 0, w: 1, tut: true };
  return { p: ev, egim: 0, w: 1 - W(t, tm.demBirak + 0.05, 0.3), tut: t < tm.demBirak + 0.1 };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 5, hd: 5, d4: 7 }, kartSon: S.tm.hero,
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'dizi' || id === 'deneme' || id === 'sayac' || id === 'buldum') return ocak(K, t, tl, S, B);
    arsiv(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'deneme') {
      // "hangisinin çevrildiğini": iki ters bardağın üstünde soru işareti; "karıştırdım"da ✗
      const c = S.film.cam(tm.cevril, 0.009), ek = p => [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom];
      for (const [j, i] of [[0, 0], [1, 1], [2, 2]]) { const g = merkez(yuva(O.tepsi, i, OK), i, OK), s = ek(i < 2 ? [g[0], g[1] - 120] : [g[0] - 96, g[1] - 20]); H.tag(K, t, tm.cevril - 0.04 + j * 0.08, cd0end(tm), s, '?', MERCAN, PAL.paper, 50, [tm.bilecek]); }
      const g = merkez(yuva(O.tepsi, 3, OK), 3, OK); H.mark(K, t, tm.karis + 0.3, cd0end(tm), ek([g[0] + 140, g[1] - 60]), false);
    }
    if (id === 'cevap') sayaclar(K, t, S);
  },
});
const cd0end = tm => tm.cd0 - 0.1;

// İki sayaç: sağ sütunun üstünde ve alt sıranın yanında. Değişince kâğıt gibi döner (dikey ölçek 1 → 0 → 1).
function sayaclar(K, t, S) {
  const { tm } = S, c = S.film.cam(tm.hero + 0.5, 0.009), ek = p => [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom];
  const ys = yuva(A.tepsi, 1, AK), ya = yuva(A.tepsi, 3, AK);
  const L = [['sutun', ek([ys[0] + 36, ys[1] - GH * AK - 92]), tm.sagS - 0.04, tm.tersW], ['sira', ek([A.tepsi[0] + 172 * AK + 72, ya[1] - 58]), tm.altS - 0.04, tm.altS + 0.5]];
  for (const [ad, [x, y], a, nb] of L) {
    if (t < a) continue;
    const v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, tm.espri - 0.22, 0.2));
    const fu = seg(t, tm.ayar - 0.02, 0.3), flip = Math.abs(Math.cos(Math.PI * fu)), d = fu < 0.5 ? DIZ : cevir(DIZ, KEREM_I);
    const n = tersSay(d, ad), tek = n % 2 === 1;
    const pu = 1 + 0.16 * (H.nabiz(t, nb) + H.nabiz(t, tm.sayi));
    const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.scale((0.6 + 0.4 * v) * out * pu, (0.6 + 0.4 * v) * out * pu * (fu > 0 && fu < 1 ? flip : 1)); ctx.globalAlpha = clamp01(v * 1.6) * out;
    K.rect(-68 + 7, -70 + 9, 136, 140, INK, 0, 24);
    K.rect(-68, -70, 136, 140, PAL.paper, LW, 24);
    K.text(String(n), 0, -10, 62, INK, 900);
    K.rect(-58, 10, 116, 50, tek ? HARDAL : PAL.teal, LW * 0.6, 25);
    K.text(K.up(tek ? 'tek' : 'çift'), 0, 50, 44, tek ? INK : PAL.paper, 900);
    ctx.restore();
  }
}

// ——— Çay ocağı (dizi, deneme, sayaç, buldum) ———
function ocak(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  const kp = H.poseAt(H.CARDS[H.KEREM], S.kerBase, S.ker, t);
  if (id === 'sayac') { H.glance(hp, t, tm.cd0 + 1.2, 1.0); H.onayla(kp, t, tm.cd0 + 3.2, 2, 0.34); }
  if (id === 'dizi') H.onayla(kp, t, tm.kerem + 0.15, 2, 0.32);
  const G = ocakTepsi(t, S, dp, hp), dem = demlikAt(t, tm);
  const ho = { heads }, dO = { heads }, kO = { heads, sessiz: true };
  let hParmak = 0, hIsaret = null, hTutL = false, hTutR = false, dTut = false, dIsaret = null;
  // h2a: Hikmet sol eliyle son bardağı bırakır, sağ eliyle "tek" parmağı
  if (id === 'dizi') {
    const w = 1 - W(t, tm.dizdim + 0.15, 0.3);
    if (w > 0.01) { ho.L = [G[2].c, w, 'A']; hTutL = t < tm.dizdim + 0.1; }
    const wT = pIn(t, tm.tek - 0.3, tm.cikacak + 0.3, 0.28);
    if (wT > 0.01) { ho.L = [H.elYeri('hikmet', hp, 'L', 'yukari'), wT, 'B']; hTutL = false; if (wT > 0.6) hParmak = 1; }
  }
  // d2: Defne sağ-üstü içer, ters çevirir
  if (id === 'deneme' || id === 'buldum') {
    if (G[DEFNE_I].uz === 'def' && G[DEFNE_I].w > 0.01) { dO.R = [G[DEFNE_I].el, G[DEFNE_I].w, 'A']; dTut = G[DEFNE_I].tutan === 'def'; }
    // hd: Hikmet iki ters bardağa dokunur ("hangisinin"), "karıştırdım"da elini tepsinin üstünde gezdirir
    const dur = [[tm.hangi, merkez(yuva(O.tepsi, 0, OK), 0, OK)], [tm.hangi + 0.32, merkez(yuva(O.tepsi, 1, OK), 1, OK)], [tm.hangi + 0.64, merkez(yuva(O.tepsi, 2, OK), 2, OK)], [tm.karis - 0.05, [O.tepsi[0] - 60, O.tepsi[1] - 200]], [tm.karis + 0.35, [O.tepsi[0] + 80, O.tepsi[1] - 210]], [tm.karis + 0.7, [O.tepsi[0] - 40, O.tepsi[1] - 200]]];
    const wH = pIn(t, tm.hangi - 0.35, tm.hdSon - 0.1, 0.28);
    if (id === 'deneme' && wH > 0.01) { const h = H.dokunYolu(t, dur.map(([a, p]) => [a, [p[0], p[1] - 50]]), { yuksel: 30, sure: 0.2 }); ho.L = [[h[0] + 36, h[1] - 40], wH, 'A']; if (wH > 0.6) hIsaret = ['L', h]; }
  }
  // sayaç: Hikmet sol eliyle sağ-üstü doğrultur, sağ eliyle demlikten çay doldurur
  if (id === 'sayac') {
    if (dem.w > 0.01) { ho.R = [dem.p, dem.w, 'B']; hTutR = dem.tut; }
    // Defne sessizce bardaklara tek tek dokunur (ikinci deneme), sonra eli çenesine gider
    const dur = [0, 1, 2, 3].map((i, j) => { const c = merkez(yuva(O.tepsi, i, OK), i, OK); return [tm.cdB + 0.7 + j * 0.45, [c[0] - 34, c[1] + 6]]; });
    const wD = pIn(t, tm.cdB + 0.35, tm.cdB + 2.75, 0.3);
    if (wD > 0.01) { const h = H.dokunYolu(t, dur, { yuksel: 30, sure: 0.2 }); dO.R = [[h[0] - 46, h[1] + 24], wD, 'A']; if (wD > 0.6) dIsaret = [h[0] + 30, h[1] - 4]; }
  }
  // ——— çizim: karakterler → ön tezgâh → tepsi, bardaklar, demlik → tutan eller ———
  const kc = oyna(K, t, tl, H.KEREM, kp, kO);
  const hc = oyna(K, t, tl, 'hikmet', hp, ho);
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  M.mekanCiz(K, OCAK, 'on', t, { isik: M.ISIK.gunduz });
  tepsi(K, O.tepsi, OK);
  for (let i = 0; i < 4; i++) if (!G[i].tutan) bardak(K, G[i].c, G[i].ang, { dolu: G[i].dolu, k: G[i].k });
  const kbDolu = ease.state(seg(t, tm.dok0 + 0.15, tm.dok1 - tm.dok0)), kbC = [KB[0], KB[1] - GH * 0.6 - 4];
  if (id === 'sayac' || id === 'buldum') bardak(K, kbC, 0, { dolu: kbDolu, k: 1.2 });
  if (dem.akis) { const ag = demlikAgiz(dem.p, dem.egim); H.akis(K, ag, [KB[0], kbC[1] - 20], 14, '#B4502A', 0, 1); }
  demlik(K, dem.p, dem.egim);
  H.buhar(K, dem.p[0] - 56, dem.p[1] - 60, t, { k: 0.8 });
  for (let i = 0; i < 4; i++) if (G[i].tutan) bardak(K, G[i].c, G[i].ang, { dolu: G[i].dolu, k: G[i].k });
  if (hTutL) hc.tut('L'); if (hTutR) hc.tut('R'); if (dTut) dc.tut('R');
  if (hParmak) hc.parmak('L', hParmak, { toplam: 1 });
  if (hIsaret) hc.isaret(hIsaret[0], hIsaret[1]);
  if (dIsaret) dc.isaret('R', dIsaret);
  void kc;
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// ——— Arşiv (kanca, soru, ipucu, cevap, espri, çağrı) ———
function arsiv(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;
  M.mekanCiz(K, ARSIV, 'arka', t, { isik: M.ISIK.gunduz });
  const kp = H.poseAt(H.CARDS[H.KEREM], S.kerBase, S.ker, t), np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t);
  // çekmeceler ve renkleri
  const acik = [0, 0, 0, 0], renk = [];
  if (id === 'kanca') acik[ANAHTAR] = 1 - ease.state(seg(t, tm.kapan, 0.26));
  let anahtarP = null;
  if (id === 'kanca' && t < tm.kapan + 0.05) { const k = kulp(ANAHTAR), u = ease.state(seg(t, tm.anahtarIn, 0.26)); anahtarP = [k[0] + 4, lerp(k[1] - 92, k[1] - 36, u)]; }
  if (id === 'cevap') {
    const ilk = pIn(t, tm.altta - 0.04, tm.ayar + 0.05, 0.25), son = W(t, tm.ayar + 0.05, 0.25), yes = W(t, tm.yesil, 0.2);
    renk[coz(DIZ)] = [HARDAL, 0.55 * ilk]; renk[ANAHTAR] = [yes > 0 ? H.mixHex(HARDAL, YESIL, yes) : HARDAL, 0.55 * son + 0.35 * yes];
    acik[ANAHTAR] = ease.state(seg(t, tm.ac, 0.3));
  }
  dolap(K, acik, renk);
  if (id === 'cevap') {
    // dolabın 2×2 çekmece çerçeveleri: "haritası"nda tepsideki hücrelerle birlikte nabız
    const a = W(t, tm.harita - 0.04, 0.25) * (1 - W(t, tm.sagS, 0.3)), nb = H.nabiz(t, tm.harita, 0.4);
    for (let i = 0; i < 4; i++) { const d = cekmece(i); const { ctx } = K; ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.roundRect(d.x - 6 - 6 * nb, d.y - 6 - 6 * nb, d.w + 12 + 12 * nb, d.h + 12 + 12 * nb, 10); ctx.lineWidth = 7; ctx.strokeStyle = HARDAL; ctx.stroke(); ctx.restore(); }
    if (t >= tm.yesil) { const d = cekmece(ANAHTAR); H.ring(K, [d.x + d.w - 16, d.y + 16], t, tm.yesil, YESIL); }
  }
  // sehpa (ipucu ve cevapta tepside bardaklar)
  const tepsiVar = id === 'ipucu' || id === 'cevap';
  const G = tepsiVar ? arsivTepsi(t, S, id === 'cevap' ? kp : null) : null;
  const ho = { heads }, dO = { heads }, kO = { heads, sessiz: true }, nO = { heads };
  let hIsK = null, anahtarAl = false, kTut = false, nTut = false, nIsaret = null, kTutAnahtar = false, hTut = false, dTut = false;
  if (id === 'kanca') {
    // Kerem anahtarı sağ-üst çekmeceye bırakır, çekmeceyi kapatır
    const kap = ease.state(seg(t, tm.kapan, 0.26));
    const el = t < tm.kapan ? (anahtarP ? [anahtarP[0], anahtarP[1] + 2] : kulpTut(ANAHTAR, 1)) : kulpTut(ANAHTAR, 1 - kap);
    const elK = t < tm.anahtarIn + 0.26 ? el : t < tm.kapan ? kar(el, kulpTut(ANAHTAR, 1), ease.state(seg(t, tm.anahtarIn + 0.26, tm.kapan - tm.anahtarIn - 0.26))) : el;
    const w = 1 - W(t, tm.kapan + 0.4, 0.3);
    if (w > 0.01) { kO.R = [elK, w, 'A']; kTutAnahtar = t < tm.anahtarIn + 0.26; kTut = t >= tm.anahtarIn + 0.26 && t < tm.kapan + 0.35; }
    const wh = pIn(t, 0.9, tm.konusmaz + 0.4, 0.3);
    if (wh > 0.01) { const sh = H.shoulder('hikmet', hp, 'R'); ho.R = [[sh[0] + 20, sh[1] + 135], wh, 'B']; if (wh > 0.6) hIsK = [sh[0] + 260, sh[1] - 40]; }
  }
  if (id === 'soru') {
    // Necmi dört çekmeceyi parmağıyla tek tek gösterir, "Nasıl?"ta omuz silker
    const dur = [0, 1, 2, 3].map((i, j) => [tm.dogru - 0.1 + j * 0.22, [kulp(i)[0] - 20, kulp(i)[1] + 10]]);
    const w = pIn(t, tm.dogru - 0.4, tm.nasil - 0.25, 0.28);
    if (w > 0.01) { const h = H.dokunYolu(t, dur, { yuksel: 26, sure: 0.16 }); nO.R = [[h[0] - 90, h[1] + 70], w, 'B']; if (w > 0.6) nIsaret = ['R', h]; }
    H.omuzSilk(np, t, tm.nasil, 0.5);
  }
  if (id === 'ipucu') {
    // Necmi tepsiyi sehpaya bırakır (sağ kulp); "üstte" arka sıraya, "altta" ön sıraya yandan dokunur
    const P = A.tepsi, sag = [P[0] + 172 * AK - 12, P[1] - 6], ind = 1 - ease.state(seg(t, tm.ipucu, 0.35));
    const wb = 1 - W(t, tm.dolapN - 0.2, 0.3);
    if (wb > 0.01) { nO.L = [[sag[0], sag[1] - 30 * ind], wb, 'A']; nTut = wb > 0.6; }
    const dur = [[tm.ust - 0.12, 1], [tm.ust + 0.16, 0], [tm.alt - 0.12, 3], [tm.alt + 0.16, 2]].map(([a, i]) => { const c = merkez(yuva(P, i, AK), i, AK); return [a, [c[0] + 40, c[1] - 10]]; });
    const wp = pIn(t, tm.iki1 - 0.3, tm.alt + 0.8, 0.28);
    if (wp > 0.01) { const h = H.dokunYolu(t, dur, { yuksel: 30, sure: 0.18 }); nO.L = [[h[0] + 60, h[1] + 20], wp, 'A']; nTut = false; if (wp > 0.6) nIsaret = ['L', h]; }
  }
  if (id === 'cevap') {
    if (G[3].uz === 'ker' && G[3].w > 0.01) { kO.R = [G[3].el, G[3].w, 'A']; kTut = G[3].tutan === 'ker'; }
    // Necmi sağdan kadraja girer, sol-üst çekmeceyi çeker, anahtarı alıp kaldırır
    H.yanAdim(np, t, { t0: tm.gel, x0: A.necHero, x1: A.necGel });
    const w = pIn(t, tm.ac - 0.3, 1e9, 0.28), u = ease.state(seg(t, tm.ac, 0.28)), k = kulp(ANAHTAR);
    const ici = [k[0], k[1] - 30], yuk = [k[0] + 30, k[1] - 105];
    const el = t < tm.ac + 0.3 ? kulpTut(ANAHTAR, u) : t < tm.al ? kar(kulpTut(ANAHTAR, 1), ici, ease.state(seg(t, tm.ac + 0.3, tm.al - tm.ac - 0.3))) : kar(ici, yuk, ease.state(seg(t, tm.al, 0.4)));
    if (w > 0.01) { nO.L = [el, w, 'A']; nTut = w > 0.6; }
    if (t >= tm.al) anahtarAl = true;
  }
  // espri: Hikmet, Kerem'in içtiği bardağı doğrultup içine bakar (boş); Kerem omuz silker
  let esBardak = null, ctaAnahtar = null;
  if (id === 'espri' || id === 'cta') {
    const sh = H.shoulder('hikmet', hp, 'L'), u = W(t, tm.h4 + 0.2, 0.5), kalk = W(t, tm.h4 - 0.1, 0.35);
    const el = [sh[0] - 110, sh[1] + 120 - 70 * kalk]; ho.L = [el, 1, 'A']; hTut = true;
    esBardak = { c: [el[0], el[1] - 6], ang: Math.PI * (1 - u) };
    H.omuzSilk(kp, t, tm.konuskan + 0.2, 0.6);
  }
  if (id === 'cta') { const sh = H.shoulder('defne', dp, 'R'), u = W(t, tm.cta + 0.05, 0.4); const el = [sh[0] + 120, sh[1] - 40 - 60 * u]; dO.R = [el, 1, 'B']; dTut = true; ctaAnahtar = el; }

  // ——— çizim ———
  const kc = (id === 'kanca' || id === 'cevap' || id === 'espri' || id === 'cta') ? oyna(K, t, tl, H.KEREM, kp, kO) : null;
  const nc = (id === 'soru' || id === 'ipucu' || id === 'cevap') ? oyna(K, t, tl, 'necmi', np, nO) : null;
  const hc = (id === 'kanca' || id === 'espri' || id === 'cta') ? oyna(K, t, tl, 'hikmet', hp, ho) : null;
  const dc = (id === 'kanca' || id === 'espri' || id === 'cta') ? oyna(K, t, tl, 'defne', dp, dO) : null;
  // sehpa önde
  const [sx0, sx1, sy] = A.sehpa;
  K.rect(sx0 + 18, sy + 30, 20, ZEMIN - sy - 30, PAL.woodDark, LW * 0.7); K.rect(sx1 - 38, sy + 30, 20, ZEMIN - sy - 30, PAL.woodDark, LW * 0.7);
  K.poly([[sx0 + 10, sy], [sx1 - 10, sy], [sx1 + 8, sy + 40], [sx0 - 8, sy + 40]], PAL.woodTop, LW);
  if (tepsiVar) {
    const indir = id === 'ipucu' ? 30 * (1 - ease.state(seg(t, tm.ipucu, 0.35))) : 0, P = [A.tepsi[0], A.tepsi[1] - indir];
    tepsi(K, P, AK);
    if (id === 'cevap') {
      const ha = W(t, tm.harita - 0.04, 0.25) * (1 - W(t, tm.sagS, 0.3)), nb = H.nabiz(t, tm.harita, 0.4);
      for (let i = 0; i < 4; i++) hucre(K, A.tepsi, i, AK, HARDAL, ha, 7 + 5 * nb);
    }
    for (let i = 0; i < 4; i++) {
      if (G[i].tutan) continue;
      let vurgu = 0;
      if (id === 'ipucu') vurgu = H.nabiz(t, i < 2 ? tm.ust : tm.alt, 0.4);
      const c = [G[i].c[0], G[i].c[1] - indir];
      bardak(K, c, G[i].ang, { dolu: G[i].dolu, k: G[i].k, vurgu });
    }
    if (id === 'cevap') {
      // "Sağ sütunda" → sağ sütun çerçevesi; "Alt sırada" → alt sıra çerçevesi
      const sA = pIn(t, tm.sagS - 0.04, tm.espri - 0.2, 0.25), rA = pIn(t, tm.altS - 0.04, tm.espri - 0.2, 0.25);
      kutu(K, [yuva(A.tepsi, 1, AK), yuva(A.tepsi, 3, AK)], sA, AK);
      kutu(K, [yuva(A.tepsi, 2, AK), yuva(A.tepsi, 3, AK)], rA, AK);
    }
  }
  if (anahtarP) anahtar(K, anahtarP, 0, 1.15);
  for (let i = 0; tepsiVar && i < 4; i++) if (G[i].tutan) bardak(K, G[i].c, G[i].ang, { dolu: G[i].dolu, k: G[i].k });
  if (esBardak) bardak(K, esBardak.c, esBardak.ang, { dolu: 0, k: AK });
  if (ctaAnahtar) anahtar(K, [ctaAnahtar[0] + 2, ctaAnahtar[1] - 44], 0.15, 1.3);
  if (kc && (kTut || kTutAnahtar)) kc.tut('R');
  if (nc && anahtarAl) anahtar(K, [nc.handL[0] + 6, nc.handL[1] - 46], 0.2, 1.15);
  if (nc && nTut) nc.tut('L');
  if (nc && nIsaret) nc.isaret(nIsaret[0], nIsaret[1]);
  if (hc && hTut) hc.tut('L');
  if (hc && hIsK) hc.isaret('R', hIsK);
  if (dc && dTut) dc.tut('R');
}
// Sütun ya da sıra çerçevesi (tepside iki yuvayı saran yuvarlak dikdörtgen)
function kutu(K, [p, q], a, k = 1) {
  if (a <= 0.01) return;
  const { ctx } = K, x0 = Math.min(p[0], q[0]) - 50 * k, x1 = Math.max(p[0], q[0]) + 50 * k, y0 = Math.min(p[1], q[1]) - GH * k - 14, y1 = Math.max(p[1], q[1]) + 16;
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 22); ctx.lineWidth = 9; ctx.strokeStyle = HARDAL; ctx.stroke(); ctx.restore();
}
