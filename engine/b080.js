// Bölüm 80 · SARKAN İP (v4 "hikâye" dili, kısa set, cevapsız tasarım; storyboard: hikayeler/bolum_080_v5.md).
// Mekanizma: ipin iki yanı ayrı ayrı tepeden en alçak noktaya iner; iki yanın toplamı ipin tamamına eşit çıkarsa ip dümdüz
// sarkıyordur (arşivdeki cevap: 0, direkler bitişik).
// Logline: Ofiste Hikmet Bey, Kerem'in arsadan getirdiği tutanağı okur: eski elektrik direğinin yerine yenisi dikilmiş, eskisi
// yarın sökülecek. İkisi de dümdüz arsada, ikisi de 10 metre. Necmi tepelerine 15 metrelik, esnemeyen bir ip bağlamış; Defne
// ipin en alçak yerinin yerden 2,5 metre yukarıda olduğunu söyler. Kerem her ölçüyü yazmış, yalnız direklerin arasını yazmamış.
// Akılda kalacak tek şey: hesaba girişmeden önce ipin iki yanını topla.
// Sızıntı yasağı: direklerin gerçek görüntüsü hiçbir anda yok (yalnız tutanaktaki küçük, ölçüsüz, sıradan şema: iki dikey çizgi
// arasında sarkan bir ip). Dikey inen ip yok (Necmi'nin elindeki ip hep geniş bir yay çizer), "7,5", "sıfır", "yan yana" yok.
// Pencere yok (dışarıda direk görünmesin); duvar düz (dikey çizgi deseni yok).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// Bakış izi: [lookX, lookY, tilt] anahtarları; her geçiş 0,3 sn ease.state (bakış sıçramaz)
const bakIz = (t, keys) => H.iz(keys.map(([tt, v, d = 0.3]) => [tt, v, d]), t);
const ifKar = (a, b, u) => { if (u <= 0.001) return a; if (u >= 0.999) return b; const o = {}; for (const k of Object.keys(a)) o[k] = lerp(a[k] ?? 0, b[k] ?? 0, u); return o; };

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz, açık durmaz; konuşurken talkAt ağzı açar)
const NOTR = { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.14, open: 0, w: 1 };
const OKU = { brow: 0.02, browTilt: 0.12, eye: 0.86, pupil: 1, curve: 0.04, open: 0, w: 0.9 };
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.25, pupil: 0.72, curve: -0.04, open: 0, w: 0.62 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 0.9, pupil: 1, curve: 0.45, open: 0, w: 1.1 };
const MAHCUP = { brow: 0.1, browTilt: 0.3, eye: 1.0, pupil: 1, curve: 0.18, open: 0, w: 0.85 };
const DUSUN = { ...H.IFADE.dusun2, open: 0 };

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OFIS = 'b080_ofis';
const NEC_X = 395, DEF_X = 650, HIK_X = 905, KER_X = 1190;
const MASA = { x0: 150, x1: 1420, y: 1250 };                 // uzun çalışma masası (önden): üst kenar bel hizasında
const KANGAL = [NEC_X - 15, MASA.y];                         // ip kangalı: masadaki yeri (taban ortası)
const METRE = [DEF_X - 150, MASA.y];                         // şerit metre: masadaki yeri (taban ortası)
const CAY = [HIK_X + 178, MASA.y];                           // Hikmet'in çayı
const IP = '#C9A86A', IP_K = '#9C7E45', IP_A = '#E2C892';     // kenevir ip
const SARI = '#E9B824', SARI_K = '#B98E14';                  // şerit metre
// Tutanak (panolu kâğıt): önden boyut. Yan tutuşta (insert) Hikmet sol eliyle sağ kenarından tutar.
const TW = 300, TH = 372;
const TUT_YAN = [HIK_X - 302, 990];                          // yan tutuşta panonun ortası
const insertKam = { zoom: 1.6, cx: HIK_X - 162, cy: 1010 };

// ═══════════════════════════ Nesneler ═══════════════════════════
// Tutanak: (x, y) panonun ortası; f dikey kısalma (1 = tam karşıdan); yuz: 'on' (kâğıt, yazılı), 'arka' (panonun arkası).
// Yazılar ancak tam karşıdan (f = 1) ve yakın plânda çizilir; okunur değilse kâğıtta yalnız satır çizgileri görünür.
function tutanak(K, [x, y], { f = 1, yuz = 'on', yazi = true, rot = 0 } = {}) {
  const { ctx } = K, w = TW, h = TH;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, f);
  K.rect(-w / 2 + 8, -h / 2 + 10, w, h, INK, 0, 14);                                   // gölge
  K.rect(-w / 2, -h / 2, w, h, '#9A6A3C', LW / Math.max(0.5, f), 14);                    // pano
  if (yuz === 'arka') {
    K.rect(-w / 2 + 22, -h / 2 + 30, w - 44, h - 52, '#8A5D33', 0, 8);
    K.rect(-58, -h / 2 - 10, 116, 34, '#B9C2BC', LW * 0.7 / Math.max(0.5, f), 8);
    ctx.restore(); return;
  }
  const top = -h / 2 + 30;
  K.rect(-w / 2 + 14, top, w - 28, h - 42, PAL.cream, 3.5 / Math.max(0.5, f), 4);       // kâğıt
  K.rect(-58, -h / 2 - 10, 116, 40, '#B9C2BC', LW * 0.7, 8);                            // klips
  K.circ(0, -h / 2 + 4, 6, '#7D8782', 2.5);
  // Düzen her iki hâlde aynı (aynı belge): başlık, üç ölçü satırı, boş kalan "Direkler arası" satırı. Kroki yok
  // (direkleri ayrık gösteren bir çizim cevapla çelişirdi). Okunur değilse yazıların yerinde gri çizgiler durur.
  const L = -w / 2 + 28, R = w / 2 - 28, y0 = top + 150, dy = 46;
  const satir = [['Direk boyu', '10 m'], ['İp', '15 m'], ['En alçak', '2,5 m']];
  const cizgi = (a, b, y, k = 9) => K.line(a, y - 10, b, y - 10, k, '#B9B2A2');
  if (yazi) {
    K.text(K.up('Tutanak'), 0, top + 40, 30, INK, 900);
    satir.forEach(([a, b], i) => { K.text(a, L, y0 + i * dy, 28, '#3A3F3C', 700, 'left'); K.text(b, R, y0 + i * dy, 31, INK, 900, 'right'); });
    K.text('Direkler arası:', L, y0 + 3 * dy, 28, '#3A3F3C', 700, 'left');
  } else {
    cizgi(-70, 70, top + 40, 12);
    satir.forEach(([a], i) => { cizgi(L, L + (a.length > 4 ? 130 : 40), y0 + i * dy); cizgi(R - 70, R, y0 + i * dy); });
    cizgi(L, L + 190, y0 + 3 * dy);
  }
  ctx.save(); ctx.setLineDash([3, 9]); ctx.lineCap = 'round'; K.line(L + 4, y0 + 3 * dy + 32, R, y0 + 3 * dy + 32, 5, '#7A746A'); ctx.restore();   // boş satır
  ctx.restore();
}

// İp kangalı (önden, hafif yukarıdan): (x, yb) taban ortası. faz: kangal elde döndükçe sarım çizgileri kayar.
// etiket: kangala bağlı karton etiket ("15 m"); kangalla birlikte durur, sallanmaz.
const KR = 78, KY = 28, KHt = 46;
function kangal(K, [x, yb], { faz = 0, etiket = true, aci = 0 } = {}) {
  const { ctx } = K, yt = yb - KHt;
  K.ell(x + 6, yb + 4, KR, KY, 'rgba(0,0,0,0.18)', 0);
  // gövde: alt elips + yan + üst elips (halka; ortası koyu)
  ctx.beginPath(); ctx.ellipse(x, yb, KR, KY, 0, 0, Math.PI); ctx.lineTo(x - KR, yt); ctx.ellipse(x, yt, KR, KY, 0, Math.PI, 0, true); ctx.closePath(); K.fs(IP_K, LW * 0.8);
  // yan yüzde sarım çizgileri (eğik, kayar)
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, yb, KR, KY, 0, 0, Math.PI); ctx.lineTo(x - KR, yt); ctx.ellipse(x, yt, KR, KY, 0, Math.PI, 0, true); ctx.closePath(); ctx.clip();
  for (let i = -8; i <= 8; i++) { const u = ((i / 8 + faz) % 2 + 3) % 2 - 1, xx = x + KR * Math.sin(u * Math.PI / 2); K.line(xx - 8, yt + 4, xx + 8, yb + 22, 4, IP); }
  ctx.restore();
  K.ell(x, yt, KR, KY, IP, LW * 0.8);
  K.ell(x, yt, KR * 0.5, KY * 0.48, '#5E4A2A', LW * 0.6);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + faz * 1.4; K.line(x + Math.cos(a) * KR * 0.58, yt + Math.sin(a) * KY * 0.6, x + Math.cos(a + 0.35) * KR * 0.92, yt + Math.sin(a + 0.35) * KY * 0.94, 3.5, IP_K); }
  // sarımın arasına sıkıştırılmış karton etiket: kangalın üstünde dik durur (altyazı balonundan uzak).
  // aci: kangal elde çevrilince etiket de döner (yandan daralır, arkaya geçince görünmez)
  const th = aci - 0.45, c = Math.cos(th);
  if (etiket && c > 0.2) {
    const k = Math.min(1, c / Math.cos(0.45)), ex = x + KR * 0.78 * Math.sin(th) - 10, ey = yt - 74;
    K.line(ex - 30 * k, ey + 58, x + KR * 0.6 * Math.sin(th), yt + 6, 3, INK);
    ctx.save(); ctx.translate(ex, 0); ctx.scale(k, 1);
    K.rect(-60, ey, 120, 62, '#E9D3A8', LW * 0.6, 8);
    K.circ(-44, ey + 14, 5, PAL.cream, 2);
    K.text('15 m', 8, ey + 47, 38, INK, 900);
    ctx.restore();
  }
}
// İp (kalın, iki renkli, burgu çizgili): noktalardan geçen yumuşak yol
function ipCiz(K, pts) {
  const { ctx } = K;
  const yol = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  yol(); ctx.lineWidth = 19; ctx.strokeStyle = INK; ctx.stroke();
  yol(); ctx.lineWidth = 12; ctx.strokeStyle = IP; ctx.stroke();
  ctx.setLineDash([5, 9]); yol(); ctx.lineWidth = 6; ctx.strokeStyle = IP_K; ctx.stroke();
  ctx.restore();
}
// İki el arasında sarkan ip (parabol): a, b uçlar; d sarkma derinliği. Hep geniş bir yay (dikey inen ip yok).
const sarkik = (a, b, d, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 4 * d * u * (1 - u)]; });

// Şerit metre (önden): (x, yb) kasanın taban ortası; boy: çekilen şeridin uzunluğu (yukarı doğru); uc: şerit ucunun yeri
const MK = 84;
function metre(K, [x, yb], boy = 0) {
  const { ctx } = K, yt = yb - MK, sx = x + MK / 2 - 16;
  if (boy > 2) {                                                   // şerit: kasanın üstünden dikey yukarı
    const y1 = yt - boy;
    K.rect(sx - 13, y1, 26, boy + 6, SARI, 3.5, 2);
    ctx.save(); ctx.beginPath(); ctx.rect(sx - 13, y1, 26, boy); ctx.clip();
    for (let yy = yt; yy > y1; yy -= 12) K.line(sx - 13, yy, sx - 13 + ((Math.round((yt - yy) / 12) % 5) ? 8 : 16), yy, 2.5, INK);
    ctx.restore();
    K.rect(sx - 17, y1 - 10, 34, 12, '#9AA39E', 3, 2);            // uç kancası
  }
  K.rect(x - MK / 2 + 6, yt + 8, MK, MK, INK, 0, 16);
  K.rect(x - MK / 2, yt, MK, MK, SARI, LW * 0.8, 16);
  K.rect(x - MK / 2 + 10, yt + 10, MK - 20, MK - 20, null, 3, 10);
  K.circ(x, yt + MK / 2, 15, '#3A3F3C', LW * 0.6); K.circ(x, yt + MK / 2, 5, '#9AA39E', 2);
  K.rect(x - MK / 2 - 4, yb - 14, 22, 14, '#3A3F3C', 3, 4); K.rect(x + MK / 2 - 18, yb - 14, 22, 14, '#3A3F3C', 3, 4);
  K.rect(sx - 15, yt - 8, 30, 12, '#3A3F3C', 3, 3);                // şerit ağzı
}
const metreUc = ([x, yb], boy) => [x + MK / 2 - 16, yb - MK - boy - 4];

// Çay bardağı (ince belli): (x, yb) taban
function bardak(K, x, yb, t) {
  const { ctx } = K, k = 1.9;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], '#A8401F', 2.6 / k * 1.45);
  ctx.restore();
  K.ell(x, yb + 2, 34, 7, PAL.cream, 3);
  H.buhar(K, x, yb - 66, t, { k: 0.4, n: 2, ara: 10, boy: 62 });
}
// Baret (Kerem'in elinde; arsadan dönmüş)
function baret(K, [x, y]) {
  const { ctx } = K;
  ctx.beginPath(); ctx.ellipse(x, y, 74, 62, 0, Math.PI, 0); ctx.closePath(); K.fs('#F2C230', LW * 0.8);
  K.rect(x - 92, y - 6, 184, 18, '#E0AE1C', LW * 0.7, 9);
  K.line(x, y - 58, x, y - 6, 5, '#C99A16');
}

// ═══════════════════════════ Mekân: ofis (öğle) ═══════════════════════════
function saksi(K, x, yb, t) {   // ofis bitkisi (döngü: yapraklar ağır ağır salınır)
  K.poly([[x - 56, yb - 112], [x + 56, yb - 112], [x + 42, yb], [x - 42, yb]], PAL.coral, LW);
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.33 + 0.05 * Math.sin(t * 1.3 + i); H.yaprak(K, x, yb - 108, 140 + 30 * (i % 2), a, PAL.green, 1); }
}
function masaCiz(K) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 12, y + 30, x1 - x0 - 24, 1500 - y - 30, PAL.wood, LW);
  for (const dx of [60, 360, 760, 1060]) { K.rect(x0 + dx, y + 70, 170, 110, PAL.woodTop, LW * 0.6, 6); K.line(x0 + dx + 62, y + 125, x0 + dx + 108, y + 125, 8); }
  K.rect(x0, y, x1 - x0, 34, PAL.woodTop, LW, 8);
}
M.mekanEkle(OFIS, {
  gen: [-300, 1900], dongu: ['duvar saati', 'çay buharı', 'bitkinin yaprakları'],
  capa: { kangal: KANGAL, metre: METRE }, kadraj: { grup: [1.3, 650, 1100] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 2000, isik, duvar: 'duz', zemin: 'ahsap' });
    // pano (yazısız kâğıtlar), klasör rafı, duvar saati, bitki
    K.rect(160, 600, 330, 230, '#B8925E', LW, 8);
    for (const [px, py, c] of [[190, 630, PAL.cream], [290, 640, PAL.mustard], [200, 730, '#6FB3AC'], [380, 720, PAL.cream], [390, 625, '#E9D3A8']]) { K.rect(px, py, 82, 70, c, LW * 0.6, 3); K.circ(px + 41, py + 6, 6, PAL.coral, 2); }
    K.rect(1300, 760, 420, 22, PAL.woodTop, LW * 0.8, 4);
    for (let i = 0; i < 6; i++) K.rect(1320 + i * 52, 650, 44, 110, [PAL.teal, PAL.coral, PAL.mustard, '#6FB3AC', PAL.teal, PAL.cream][i], LW * 0.6, 4);
    M.duvarSaati(K, 1100, 660, 62, 12.25 + t / 3600, t);
    saksi(K, 1640, 1500, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    eski: T('h1:6'), h1s: T('h1>'),
    tut: T('h1b') - 0.1, duz: T('h1b:2'), ikisi: T('h1b:4'), on: T('h1b:6'),
    nec: T('n0') - 0.1, onbes: T('n0:2'), esn: T('n0:5'), n0s: T('n0>'),
    def: T('d1') - 0.1, iki: T('d1:5'), d1s: T('d1>'),
    hik: T('h3') - 0.1, kerem: T('h3'), yazmamis: T('h3:7'), arasi: T('h3:8'),
    sayac: cd0 - 0.05, say2: cd0 + 3.3, say3: cd0 + 6.65,
    n1: T('n1'), ikiN: T('n1:4'), yan: T('n1:5'), topla: T('n1:6'), n1s: T('n1>'),
  };
  const film = H.sahneler([
    { id: 'kanca', t0: 0, kay: [-14, 0], cam: [[0, 1.4, 652, 1045]] },
    { id: 'tutanak', t0: tm.tut, cam: [[0, insertKam.zoom, insertKam.cx, insertKam.cy]] },
    { id: 'necmi', t0: tm.nec, kay: [16, 0], cam: [[0, 1.55, NEC_X + 40, 1160]] },
    { id: 'defne', t0: tm.def, kay: [16, 0], cam: [[0, 1.55, DEF_X - 30, 1095]] },
    { id: 'hikmet', t0: tm.hik, kay: [14, 0], cam: [[0, 1.45, 1050, 1030]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, insertKam.zoom, insertKam.cx, insertKam.cy]] },
    { id: 'say2', t0: tm.say2, cam: [[0, 1.34, 525, 1105]] },
    { id: 'say3', t0: tm.say3, cam: [[0, 1.45, NEC_X + 30, 1150]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.45, DEF_X, 1120]] },
    { id: 'cevap', t0: tm.cevap, kesme: false, cam: [[0, 1.4, 652, 1045]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı/.test(w)) console.error('sahne uyarısı: ' + w);
  // Altyazı: balonlar kesmeden ve sayaç şeridinden önce kapanır; n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.3 } : l.id === 'h3' ? { ...l, t1: Math.min(l.t1 + 0.05, tm.sayac - 0.28) } : l) };
  return { tm, film, tlA };
}

// ═══════════════════════════ draw ═══════════════════════════
const lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç perdesi sahneyi örtmesin)
  drift: 0.006,
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id;
    if (id === 'sayac') Object.assign(cam, insertKam);                                            // tutanak okunurken kamera sabit
    else if (id === 'say2') Object.assign(cam, { zoom: lg(1.34, 1.41, clamp01((t - tm.say2) / 3.35)), cx: 525, cy: 1105 });
    else if (id === 'say3') Object.assign(cam, { zoom: lg(1.45, 1.53, clamp01((t - tm.say3) / (tm.buldum - tm.say3))), cx: NEC_X + 30, cy: 1150 });
    else if (id === 'tutanak') Object.assign(cam, insertKam);
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (id === 'defne') { const u = B.ekr(metreUc(METRE, 190)); H.tag(K, t, tm.iki - 0.04, tm.d1s + 0.25, [u[0] - 150, u[1] + 70], '2,5 m', PAL.mustard, INK, 50); }
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (075'ten): perde yok, alt bantta. Daire solda, başlık ve paylaşım hapı sağında.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1320, r = 80;
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

// ——— Dünya ———
// Plânda kimler çizilir (kadraj kenarında yarım yüz ya da kulak kalmasın diye plân dışındakiler çizilmez)
const KADRO = { kanca: 'NDH', tutanak: 'H', necmi: 'N', defne: 'D', hikmet: 'HK', sayac: 'H', say2: 'ND', say3: 'N', buldum: 'D', cevap: 'NDH' };
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, kadro = KADRO[id] || 'NDH';
  M.mekanCiz(K, OFIS, 'arka', t, { isik: M.ISIK.gunduz });

  // ——— Kerem (Hikmet'in sağında; elinde baret; konuşmaz) ———
  if (kadro.includes('K')) {
    const kb = bakIz(t, [[tm.hik, [-0.7, 0.05, 3]], [tm.arasi, [-0.85, 0.1, 3]]]);
    const kp = H.kisi(H.KEREM, { x: KER_X, expr: ifKar(NOTR, MAHCUP, W(t, tm.yazmamis - 0.15, 0.3)), ...POZ.dur, head: { tilt: kb[2], look: [kb[0], kb[1]] } });
    H.onayla(kp, t, tm.kerem + 0.1, 1, 0.4);
    H.onayla(kp, t, tm.yazmamis + 0.05, 1, 0.42);
    const bp = [KER_X, 1205];
    const kc = oyna(K, t, null, H.KEREM, kp, { L: [[bp[0] - 86, bp[1] + 2], 1, 'A'], R: [[bp[0] + 86, bp[1] + 2], 1, 'A'] });
    baret(K, bp); kc.tut('L'); kc.tut('R');
  }

  // ——— Hikmet (masanın arkasında; Kerem'in tutanağı elinde) ———
  let hc = null, tutYer = null, tutF = 0.7, tutYuz = 'arka', tutYazi = false;
  if (kadro.includes('H')) {
    let hE = OKU, hb = [-0.05, 0.5, 0], armR = null;
    const hO = { heads };
    if (id === 'kanca' || id === 'cevap') {
      // okur: tutanak göğsünün önünde, eğik (yalnız satır çizgileri); 0,3 sn'de masadan göğsüne kaldırır
      const u = W(t, 0.3, 0.42);
      tutYer = [HIK_X, lerp(1238, 1182, u)]; tutF = lerp(0.42, 0.56, u); tutYuz = 'on';
      hO.L = [[HIK_X - 148, tutYer[1] + 10], 1, 'A']; hO.R = [[HIK_X + 148, tutYer[1] + 10], 1, 'A'];
      hb = bakIz(t, [[0, [-0.05, 0.5, 0]], [tm.h1s + 0.05, [-0.6, 0.05, 3]]]);
      hE = ifKar(OKU, NOTR, W(t, tm.h1s + 0.05, 0.3));
      if (id === 'cevap') { hE = SASKIN; hb = [-0.7, 0, 3]; }
    } else if (id === 'tutanak' || id === 'sayac') {
      // yan tutuş: sol eliyle tutanağı sağ kenarından tutar, kameraya gösterir
      tutYer = TUT_YAN; tutF = 1; tutYuz = 'on'; tutYazi = true;
      hO.L = [[TUT_YAN[0] + TW / 2 - 2, TUT_YAN[1] - 81], 1, 'A'];   // el başlıkla ilk satır arasında: ölçü yazılarının üstüne binmez
      if (id === 'tutanak') {
        hE = NOTR;
        hb = bakIz(t, [[tm.tut, [-0.75, 0.25, -3]], [tm.on - 0.35, [-0.15, 0.05, 0]]]);
        // "dümdüz": sağ avuç göğüs hizasında yatay süpürür; "on metre": el omuz hizasına kalkar (boy)
        hO.R = [H.iz([[tm.tut, [HIK_X + 85, 1267]], [tm.duz - 0.3, [HIK_X + 20, 1140], 0.3], [tm.duz, [HIK_X + 125, 1140], 0.9], [tm.ikisi - 0.1, [HIK_X + 135, 1062], 0.5], [tm.nec - 0.55, [HIK_X + 85, 1267], 0.4]], t), 1, 'B'];
      } else {
        hE = ifKar(NOTR, DUSUN, W(t, tm.sayac + 0.2, 0.3));
        hb = bakIz(t, [[tm.sayac, [-0.75, 0.3, -4]], [tm.sayac + 1.25, [-0.15, -0.2, 3], 0.4], [tm.sayac + 2.35, [-0.7, 0.4, -2], 0.4]]);
        const w = pIn(t, tm.sayac + 0.25, tm.say2 - 0.45, 0.4);                 // sağ el çenesine gider (hazır poz)
        const tap = 14 * (H.nabiz(t, tm.sayac + 1.0, 0.3) + H.nabiz(t, tm.sayac + 1.6, 0.3));
        armR = { sh: lerp(POZ.dur.armR.sh, POZ.dusun.armR.sh, w), el: lerp(POZ.dur.armR.el, POZ.dusun.armR.el + tap, w) };
      }
    } else if (id === 'hikmet') {
      // h3: tutanak göğsünde; "yazmamış"ta tutanağı bir kez sallar, "Arası kaç metre?"de sola, Defne'yle Necmi'ye döner
      const k = H.nabiz(t, tm.yazmamis, 0.4);
      tutYer = [HIK_X, 1182 - 22 * k]; tutF = 0.56; tutYuz = 'on';
      hO.L = [[HIK_X - 148, tutYer[1] + 10], 1, 'A']; hO.R = [[HIK_X + 148, tutYer[1] + 10], 1, 'A'];
      hE = NOTR;
      hb = bakIz(t, [[tm.hik, [0.62, 0.05, -3]], [tm.yazmamis - 0.2, [0.1, 0.25, 0]], [tm.arasi - 0.15, [-0.85, 0, 4]]]);
    }
    const hp = H.kisi('hikmet', { x: HIK_X, expr: hE, ...POZ.dur, head: { tilt: hb[2], look: [hb[0], hb[1]] } });
    if (armR) hp.armR = armR;
    if (id === 'tutanak') H.onayla(hp, t, tm.on + 0.05, 1, 0.42);
    if (id === 'kanca') H.onayla(hp, t, tm.eski + 0.1, 1, 0.4);
    hc = oyna(K, t, tl, 'hikmet', hp, hO);
  }

  // ——— Necmi (solda; ip kangalı) ———
  let nc = null, kangalYer = KANGAL, kangalFaz = 0, kangalAci = 0, ipYol = null;
  if (kadro.includes('N')) {
    let nE = NOTR, nb = [0.55, 0.05, -3];
    const nO = { heads };
    if (id === 'kanca' || id === 'cevap') {
      // sağ eli kangalın üstünde; 0,35 sn'de iki kez hafifçe vurur
      const k = H.nabiz(t, 0.35, 0.3) + H.nabiz(t, 0.75, 0.3);
      nO.R = [[KANGAL[0] + KR + 4, KANGAL[1] - KHt - 4 - 16 * k], 1, 'A'];   // etiketin sağında
      nb = [0.8, -0.1, -3]; nE = MERAK;
    } else if (id === 'necmi') {
      // sağ eli kangalı masaya bastırır; sol eliyle ipin ucunu sola çekip gerer, "esnemeyen"de iki kez asılır
      nO.R = [[KANGAL[0] + KR + 2, KANGAL[1] - KHt + 2], W(t, tm.nec + 0.1, 0.3), 'A'];
      const wC = W(t, tm.nec + 0.5, 0.35);
      const cek = 18 * (H.nabiz(t, tm.esn + 0.05, 0.3) + H.nabiz(t, tm.esn + 0.5, 0.3));
      const kenar = [KANGAL[0] - KR + 6, KANGAL[1] - KHt / 2];
      const el = kar(kenar, [NEC_X - 205 - cek, 1118 - cek * 0.3], wC);
      nO.L = [el, 1, 'B'];
      if (wC > 0.02) ipYol = [kenar, [el[0] - 6, el[1]]];
      nb = bakIz(t, [[tm.nec, [-0.05, 0.05, 0]], [tm.esn - 0.4, [-0.55, 0.15, -3]]]);
    } else if (id === 'say2') {
      // kangalı masada iki eliyle ağır ağır çevirir (sarım çizgileri kayar), düşünür
      nO.L = [[KANGAL[0] - KR + 6, KANGAL[1] - KHt + 4], 1, 'A']; nO.R = [[KANGAL[0] + KR - 6, KANGAL[1] - KHt + 4], 1, 'A'];
      kangalFaz = (t - tm.say2) * 0.35; kangalAci = Math.PI;   // etiket arkada (kangal sayaçtan önce çevrilmiş): ellerin altında kalmasın
      nE = ifKar(DUSUN, NOTR, W(t, tm.say2 + 2.0, 0.3));
      nb = bakIz(t, [[tm.say2, [0.1, 0.55, 3]], [tm.say2 + 2.0, [0.7, 0.05, -2]]]);
    } else if (id === 'say3') {
      // ipi kangaldan çekip iki elinin arasında açar (kangal sola kayar); iki yanına sırayla bakar;
      // ipucunda kameraya döner, "iki"de sol, "yanını"da sağ eli kalkar
      const ac = W(t, tm.say3 + 0.15, 0.6);
      kangalFaz = (tm.say3 - tm.say2) * 0.35; kangalAci = Math.PI;   // etiket arkada
      const kL = 14 * (H.nabiz(t, tm.say3 + 1.45, 0.45) + H.nabiz(t, tm.ikiN, 0.42)), kR = 14 * (H.nabiz(t, tm.say3 + 2.55, 0.45) + H.nabiz(t, tm.yan + 0.05, 0.42));
      const eL = kar([NEC_X - 60, 1165], [NEC_X - 150, 1125 - kL], ac), eR = kar([NEC_X + 40, 1165], [NEC_X + 150, 1125 - kR], ac);
      nO.L = [eL, 1, 'A']; nO.R = [eR, 1, 'A'];
      const kenar = [KANGAL[0] - 34, KANGAL[1] - KHt - 4];
      ipYol = [...sarkik(kenar, [eL[0] - 2, eL[1] + 4], 10, 8), ...sarkik([eL[0] + 4, eL[1] + 4], [eR[0] - 4, eR[1] + 4], lerp(30, 62, ac))];
      nE = ifKar(DUSUN, NOTR, W(t, tm.n1 - 0.3, 0.3));
      nb = bakIz(t, [[tm.say3, [0.05, 0.6, 2]], [tm.say3 + 1.3, [-0.45, 0.45, -3], 0.45], [tm.say3 + 2.4, [0.45, 0.45, 3], 0.45],
        [tm.n1 - 0.3, [0, 0.05, 0]], [tm.ikiN - 0.12, [-0.45, 0.4, -3]], [tm.yan + 0.3, [0.45, 0.4, 3]], [tm.topla + 0.25, [0, 0.05, 0]]]);
    }
    const np = H.kisi('necmi', { x: NEC_X, expr: nE, ...POZ.dur, head: { tilt: nb[2], look: [nb[0], nb[1]] } });
    if (id === 'say3' && t > tm.n1s + 0.1) H.onayla(np, t, tm.n1s + 0.1, 1, 0.42);
    nc = oyna(K, t, tl, 'necmi', np, nO);
  }

  // ——— Defne (ortada; şerit metre) ———
  let dc = null, metreBoy = 0;
  if (kadro.includes('D')) {
    const dO = { heads };
    const dp = H.kisi('defne', { x: DEF_X, expr: MERAK, ...POZ.dur, head: { tilt: 3, look: [0.75, 0.05] } });
    if (id === 'defne') {
      // "İpin": sol eliyle şerit metrenin ucunu tutar, yukarı çeker (kasa masada); "iki buçuk"ta durur
      const w = W(t, tm.def + 0.12, 0.28), cek = ease.enter(seg(t, tm.def + 0.42, 0.9));
      metreBoy = 190 * cek;
      const uc = metreUc(METRE, metreBoy);
      dO.L = [[uc[0], uc[1] + 6], w, 'A'];
      const db = bakIz(t, [[tm.def, [-0.55, -0.1, -3]], [tm.iki - 0.3, [-0.05, 0.05, -3]]]);
      dp.expr = NOTR; dp.head = { ...dp.head, tilt: db[2], look: [db[0], db[1]] };
    } else if (id === 'say2') {
      // sayaç: şeridi geri sarar (ilk 0,5 sn), sonra eli çenesinde düşünür
      metreBoy = 190 * (1 - ease.state(seg(t, tm.say2 + 0.1, 0.45)));
      const uc = metreUc(METRE, metreBoy);
      const w1 = 1 - W(t, tm.say2 + 0.55, 0.3);
      if (w1 > 0.01) dO.L = [[uc[0], uc[1] + 6], w1, 'A'];
      const w2 = W(t, tm.say2 + 0.9, 0.35);
      dp.armR = { sh: lerp(POZ.dur.armR.sh, POZ.dusun.armR.sh, w2), el: lerp(POZ.dur.armR.el, POZ.dusun.armR.el, w2) };
      dp.expr = ifKar(MERAK, DUSUN, w2);
      const db = bakIz(t, [[tm.say2, [-0.6, 0.3, -4]], [tm.say2 + 1.8, [-0.2, -0.45, -4], 0.45]]);
      dp.head = { ...dp.head, tilt: db[2], look: [db[0], db[1]] };
    } else if (id === 'buldum' || id === 'cevap') {
      dp.expr = 'mutlu'; dp.head = { ...dp.head, tilt: -5, look: [0, -0.2] };
      if (id === 'buldum') Object.assign(dp, POZ.yukari);
    }
    dp.y -= H.buldumHop(t, tm.buldum);
    dc = oyna(K, t, tl, 'defne', dp, dO);
    if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  }

  // ——— masa ve üstündekiler (karakterlerden sonra; tutan eller en son) ———
  if (tutYer && hc) {   // pano masanın arkasında tutulur: masadan önce çizilir
    tutanak(K, tutYer, { f: tutF, yuz: tutYuz, yazi: tutYazi });
    hc.tut('L'); if (!tutYazi) hc.tut('R');
  }
  masaCiz(K);
  bardak(K, CAY[0], CAY[1], t);
  const insert = id === 'tutanak' || id === 'sayac';   // yakın plânda kenarda yarım etiket kalmasın
  if (!insert) kangal(K, kangalYer, { faz: kangalFaz, aci: kangalAci });
  if (!insert) metre(K, METRE, metreBoy);
  if (ipYol) ipCiz(K, ipYol);
  if (nc) {
    if (id === 'kanca' || id === 'cevap') nc.tut('R');
    if (id === 'necmi') { if (t > tm.nec + 0.3) nc.tut('R'); if (ipYol) nc.tut('L'); }
    if (id === 'say2') { nc.tut('L'); nc.tut('R'); }
    if (id === 'say3') { nc.tut('L'); nc.tut('R'); }
  }
  if (dc && (id === 'defne' || (id === 'say2' && metreBoy > 4))) dc.tut('L');
}
