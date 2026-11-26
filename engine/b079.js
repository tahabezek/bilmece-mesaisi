// Bölüm 79 · KÜS YEMİNLER (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_079_v5.md).
// Kaynak: Ebû Hanîfe (el-Esyûtî, Cevâhirü'l-ukûd). Mekanizma: sözün kime ve ne zaman söylendiği.
// Logline: Koridorda, kahve makinesinin önünde Necmi yine Hikmet Bey'in kupasıyla çay içer. Hikmet Bey küser. Önce Necmi
// Hikmet Bey'e dönüp "Siz bana tek kelime etmedikçe, ben de size tek kelime etmem!" der; hemen ardından Hikmet Bey Necmi'ye
// dönüp "Ben de sen bana tek kelime etmedikçe sana tek kelime etmem!" der. İkisi sırt sırta döner. Defne ortada: ikisi de
// sözünün eri; yine de biri şu an konuşabilir. Hangisi?
// Akılda kalacak tek şey: bir söz, ancak söylendikten sonra kurulan cümleyi bekler.
// Sızıntı yasağı: sıra numarası, ok, "önce/sonra" etiketi yok. Necmi'nin yüzünde "ben kazandım" ifadesi yok: sayaçta ikisi
// aynı küs yüzle, aynı anda, aynı hareketleri yapar (ayna). Sayaç boyunca iki söz, konuşanın adıyla, aynı renk ve boyda iki
// kartta (ekran uzayında, sabit) okunur; kartların hiçbiri öne çıkmaz (nabız yok, bakış ve parmak kartlarda beklemez).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const KOR = 'b079_koridor';
const NX = 410, HX = 690;                         // Necmi (solda), Hikmet Bey (sağda): ayakta, zemin 1500
const DX = 550, DY = 1395, DS = 0.86;             // Defne ortada, bir adım geride (derinlik: küçük ve yukarıda)
const DX0 = 885;                                  // kanca ve yeminler boyunca Defne Hikmet Bey'in sağında, geride; sırt sırta dönünce ortaya yürür
const KW = 74, KH = 80;                           // Hikmet Bey'in kupası: en, boy
const MAK_X = 205;                                // kahve makinesi (tezgâhın üstünde, solda)
const TEZ_Y = 1190;                               // tezgâh üstü
const ANK = [550, 750];                           // grup plânında kameranın kilitlendiği nokta (Hikmet Bey'in saç tepesi)

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz; konuşurken talkAt ağzı açar)
const IF = {
  sakin: { brow: 0.02, browTilt: 0, eye: 0.95, pupil: 1, curve: 0.12, open: 0, w: 0.95 },
  yudum: { brow: 0.03, browTilt: 0, eye: 0.78, pupil: 1, curve: 0.22, open: 0, w: 0.9 },             // yudum alırken
  kus: { brow: -0.01, browTilt: 0.22, eye: 0.82, pupil: 1, curve: -0.16, open: 0, w: 0.72 },        // küs: dudak büzük, kaşlar çatık (hafif)
  kizgin: { brow: -0.02, browTilt: 0.32, eye: 1.02, pupil: 0.95, curve: -0.22, open: 0, w: 0.9 },   // Hikmet: kupasına alınmış
  alinmis: { brow: 0.08, browTilt: 0.05, eye: 1.18, pupil: 0.8, curve: -0.12, open: 0, w: 0.7 },    // söz duyunca kaşlar kalkık
  saskin: { brow: 0.09, browTilt: -0.04, eye: 1.25, pupil: 0.75, curve: 0, open: 0, w: 0.62 },
  nazik: { brow: 0.04, browTilt: -0.08, eye: 1, pupil: 1, curve: 0.42, open: 0, w: 1.05 },
  dusun: { ...H.IFADE.dusun2, open: 0 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Nesneler ═══════════════════════════
// Hikmet Bey'in kupası (önden): (x, yb) tabanın ortası. Hardal kupa; üstünde Hikmet Bey'in kalın gözlüğü ve burgulu bıyığı.
// kulp: −1 sol, +1 sağ. Çay koyu kırmızı, üstünde buhar (döngü).
function kupa(K, [x, yb], kulp = 1) {
  const { ctx } = K, w = KW, h = KH, ust = yb - h;
  ctx.save(); ctx.lineWidth = LW * 0.8; ctx.strokeStyle = INK;
  ctx.beginPath(); ctx.ellipse(x + kulp * (w / 2 + 6), ust + h * 0.46, 15, 20, 0, 0, TAU); ctx.lineWidth = 15; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#D19A2E'; ctx.stroke();
  ctx.restore();
  K.rect(x - w / 2, ust, w, h, '#D19A2E', LW * 0.8, 10);
  K.rect(x - w / 2 + 5, ust + h - 14, w - 10, 7, '#AE7D20', 0, 3);
  K.ell(x, ust + 3, w / 2 - 3, 6, '#7A2E1C', 3);
  // gözlük ve bıyık (Hikmet Bey'in imzası; yazı yok)
  const gy = ust + 24;
  K.circ(x - 12, gy, 9, '#F3E3B0', 4); K.circ(x + 12, gy, 9, '#F3E3B0', 4); K.line(x - 3, gy, x + 3, gy, 4, INK);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = INK;
  for (const m of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, gy + 17); ctx.quadraticCurveTo(x + m * 12, gy + 12, x + m * 19, gy + 18); ctx.quadraticCurveTo(x + m * 24, gy + 22, x + m * 21, gy + 13); ctx.stroke(); }
  ctx.restore();
}
// Kahve makinesi (tezgâhın üstünde): gövde, haznesi, ekran ışığı (döngü: yanıp söner), musluktan bardağa damla (döngü)
function makine(K, x, t) {
  const y = TEZ_Y, w = 170, h = 250;
  K.rect(x - w / 2 + 8, y - h + 10, w, h, INK, 0, 14);
  K.rect(x - w / 2, y - h, w, h, '#3B4A48', LW, 14);
  K.rect(x - w / 2 + 14, y - h + 16, w - 28, 74, '#55625E', LW * 0.7, 10);            // panel
  const yan = Math.sin(TAU * t / 1.6) > -0.2;
  K.circ(x - 42, y - h + 53, 11, yan ? '#8FBF6A' : '#4E6A44', 3);
  for (const [i, dx] of [[0, -4], [1, 30], [2, 58]]) K.rect(x + dx - 11, y - h + 42, 22, 22, i === 1 ? PAL.mustard : '#C9CED1', 3, 5);
  K.rect(x - 34, y - h + 112, 68, 34, '#2A3433', LW * 0.7, 6);                        // musluk başlığı
  K.rect(x - 9, y - h + 144, 18, 14, '#2A3433', 3, 3);
  K.rect(x - w / 2 + 10, y - 30, w - 20, 22, '#55625E', LW * 0.7, 5);                  // damlalık
  // kâğıt bardak ve damla
  const by = y - 30;
  K.poly([[x - 19, by - 52], [x + 19, by - 52], [x + 15, by], [x - 15, by]], PAL.paper, 3);
  K.line(x - 17, by - 40, x + 17, by - 40, 4, '#B9A27E');
  H.damlaDongu(K, x, y - h + 162, by - 54, t, { periyot: 0.9, r: 6, renk: '#6B3A22' });
  H.buhar(K, x, by - 60, t + 0.4, { k: 0.3, n: 2, ara: 9, boy: 40 });
}
// Duvardaki ilan panosu (yazısız kâğıtlar, raptiyeler)
function pano(K, x, y) {
  K.rect(x, y, 230, 170, '#B98A55', LW, 8); K.rect(x + 10, y + 10, 210, 150, '#C9A06A', 0, 4);
  for (const [dx, dy, w, h, r, c] of [[24, 22, 74, 92, -3, PAL.paper], [112, 18, 88, 60, 2, '#F3E3B0'], [118, 90, 76, 58, -2, PAL.cream]]) {
    const { ctx } = K; ctx.save(); ctx.translate(x + dx + w / 2, y + dy + h / 2); ctx.rotate(r * Math.PI / 180);
    K.rect(-w / 2, -h / 2, w, h, c, 3, 2); for (let k = 0; k < 3; k++) K.line(-w / 2 + 10, -h / 2 + 18 + k * 14, w / 2 - 12 - (k === 2 ? 18 : 0), -h / 2 + 18 + k * 14, 3, '#B9A27E');
    K.circ(0, -h / 2 + 6, 5, PAL.coral, 2); ctx.restore();
  }
}

// ═══════════════════════════ Mekân: koridor, kahve makinesinin önü ═══════════════════════════
M.mekanEkle(KOR, {
  gen: [-600, 1800], dongu: ['makinede yanıp sönen ışık', 'musluktan damla', 'kupadan buhar', 'penceredeki martı', 'duvar saati'],
  capa: { makine: [MAK_X, TEZ_Y] }, kadraj: { grup: [1.3, 550, 1050] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'cizgili', zemin: 'karo' });
    // koridor halısı (zeminde uzun yolluk; boş zemin kalmasın)
    K.rect(-700, 1514, 2700, 260, '#7F3B33', LW, 0); K.rect(-700, 1534, 2700, 12, PAL.mustard, 0); K.rect(-700, 1742, 2700, 12, PAL.mustard, 0);
    for (let x = -680; x < 2000; x += 150) K.poly([[x, 1644], [x + 40, 1600], [x + 80, 1644], [x + 40, 1688]], '#A3524A', 3);
    // tezgâh ve makine (solda)
    K.rect(40, TEZ_Y, 330, 1500 - TEZ_Y, PAL.wood, LW, 6); K.rect(28, TEZ_Y - 14, 354, 26, PAL.woodTop, LW, 6);
    K.rect(64, TEZ_Y + 36, 130, 240, PAL.woodTop, LW * 0.6, 6); K.rect(214, TEZ_Y + 36, 130, 240, PAL.woodTop, LW * 0.6, 6);
    K.circ(178, TEZ_Y + 150, 7, PAL.metal, 3); K.circ(230, TEZ_Y + 150, 7, PAL.metal, 3);
    makine(K, MAK_X, t);
    // tezgâhta kupa askısı (iki boş kupa; Hikmet Bey'inki Necmi'nin elinde)
    K.rect(296, TEZ_Y - 150, 10, 136, PAL.woodDark, 3, 3);
    for (const [dy, c] of [[-120, PAL.teal], [-70, PAL.coral]]) { K.line(300, TEZ_Y + dy, 324, TEZ_Y + dy - 8, 5, INK); K.rect(318, TEZ_Y + dy - 4, 38, 40, c, 3, 6); }
    pano(K, 20, 700);
    M.pencere(K, 860, 690, 230, 330, { isik, t: t + 2, kayit: false });
    M.duvarSaati(K, 560, 640, 46, 10.4 + t / 3600, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15, cta: T('d6') - 0.2,
    h1: T('h1'), kupami: T('h1:3'), h1s: T('h1>'),
    n0: T('n0'), n0b: T('n0:5'), etmemN: T('n0:10'), n0s: T('n0>'),
    h2: T('h2'), h2b: T('h2:7'), etmemH: T('h2:10'), h2s: T('h2>'),
    d1: T('d1'), d1s: T('d1>'), d2: T('d2'), biri: T('d2:3'), hangisi: T('d2:8'), d2s: T('d2>'),
    n1: T('n1'), sira: T('n1:4'), n1s: T('n1>'),
  };
  tm.necKes = tm.h1s + 0.07; tm.donN = tm.n0 - 0.2;                 // Necmi'ye kesme; Necmi Hikmet Bey'e döner
  tm.hikKes = tm.n0s + 0.1; tm.donH = tm.h2 - 0.18;                 // Hikmet Bey'e kesme; Hikmet Bey Necmi'ye döner
  tm.grupKes = tm.h2s + 0.12; tm.sirt = tm.grupKes + 0.3;           // grup: ikisi sırt sırta döner, kollar kavuşur
  tm.defKes = tm.d2 - 0.16; tm.sayac = cd0 - 0.05;
  tm.yuru = tm.grupKes + 0.02; tm.vardi = tm.yuru + Math.abs(DX0 - DX) / 460;   // Defne iki küsün arasına yürür
  tm.etiket = cd0 + 0.25;                                           // iki söz kartı (kesmeden 9 kare sonra)
  const grup = (z, ys) => [z, ANK[0], ANK[1] - (ys - 960) / z];
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.36, 650, 1053], [tm.necKes - 0.2, 1.38, 650, 1049]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, 1.55, 455, 1018], [tm.hikKes - 0.2, 1.57, 454, 1019]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, 1.55, 640, 1018], [tm.grupKes - 0.2, 1.57, 641, 1019]] },
    { id: 'grup', t0: tm.grupKes, cam: [[0, ...grup(1.3, 560)], [tm.defKes - 0.2, ...grup(1.32, 560)]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, 1.6, 550, 1005], [tm.sayac - 0.2, 1.62, 550, 1004]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...grup(1.12, 886)]] },             // doğrusal itme kamera() ile (Hikmet Bey'in tepesine kilitli)
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.6, 550, 1005]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...grup(1.3, 560)]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // n1 son repliktir (cevapsız kesim): balonu "Buldum!"a kadar kalır, kendi yerinde (y 1312) çizilir; diğerleri cerceve'de.
  const tlA = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').map(l => l.id === 'd2' ? { ...l, t1: Math.min(l.t1, tm.sayac - 0.31) } : l) };   // d2 balonu sayaç gelmeden söner
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  return { tm, film, tlA, tlN, grup };
}

// ═══════════════════════════ draw ═══════════════════════════
const zoomSayac = (tm, t) => t < tm.cd ? Math.exp(lerp(Math.log(1.12), Math.log(1.165), clamp01((t - tm.sayac) / (tm.cd - tm.sayac)))) : lerp(1.165, 1.17, clamp01((t - tm.cd) / (tm.buldum - tm.cd)));
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (bölüme özel sayaç; perde yok)
  drift: 0.008,
  kamera(cam, t, B) {
    if (B.sc.id === 'sayac') { const [z, cx, cy] = S.grup(zoomSayac(S.tm, t), 886); Object.assign(cam, { zoom: z, cx, cy }); }
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (id === 'sayac') { sozKart(K, t, 0, tm.etiket); sozKart(K, t, 1, tm.etiket + 0.07); }
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, B.heads, { y: 1312 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// İki söz kartı (ekran): aynı renk, aynı boy, aynı yazı (44 px, iki satır); konuşanın adı kartın üst kenarındaki sekmede.
// Necmi'nin kartı üstte (adı solda), Hikmet Bey'inki altta (adı sağda): ikisi de konuşanın yanında. Kartlar sabit durur.
const SOZ = [
  { ad: 'Necmi', yan: -1, satir: ['“Siz bana tek kelime etmedikçe', 'ben de size tek kelime etmem!”'] },
  { ad: 'Hikmet Bey', yan: 1, satir: ['“Ben de sen bana tek kelime', 'etmedikçe sana tek kelime etmem!”'] },
];
const SK = { x: 90, w: 830, y0: 546, h: 134, ara: 34, tab: 52 };   // kart 1 üstü y0; kart 2 üstü y0 + h + ara
function sozKart(K, t, i, a) {
  if (t < a - 0.001) return;
  const { ctx } = K, s = SOZ[i], u = H.spring(t - a, H.UI[0], H.UI[1]), y = SK.y0 + i * (SK.h + SK.ara);
  ctx.save(); ctx.translate(540, y + SK.h / 2); ctx.scale(0.85 + 0.15 * u, 0.85 + 0.15 * u); ctx.translate(-540, -(y + SK.h / 2)); ctx.globalAlpha = clamp01(u * 2);
  K.rect(SK.x + 8, y + 10, SK.w, SK.h, INK, 0, 22);
  K.rect(SK.x, y, SK.w, SK.h, '#FBF6EC', LW * 0.8, 22);
  s.satir.forEach((r, j) => K.text(r, SK.x + SK.w / 2, y + 72 + j * 48, 44, INK, 800));
  ctx.font = '900 44px Rubik'; const tw = ctx.measureText(s.ad).width + 40, tx = s.yan < 0 ? SK.x + 26 : SK.x + SK.w - 26 - tw;
  K.rect(tx + 5, y - SK.tab / 2 + 6, tw, SK.tab, INK, 0, SK.tab / 2);
  K.rect(tx, y - SK.tab / 2, tw, SK.tab, '#2F7F7A', LW * 0.7, SK.tab / 2);
  K.text(s.ad, tx + tw / 2, y + 15, 44, PAL.paper, 900);
  ctx.restore();
}

// "SEN DE DÜŞÜN!" sayacı (perde yok): daire solda altta, başlık ve paylaşım hapı sağda (yüzlerin altında kalır).
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 160, y = 1342, r = 66;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 11, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 21, 58, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(716, 1302); ctx.scale(inU * out, inU * out);
  ctx.font = '900 48px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 56;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 17, 48, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(612, 1386); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 52;
    K.rect(-sw / 2 + 8, -35 + 9, sw, 70, INK, 0, 35); K.rect(-sw / 2, -35, sw, 70, PAL.coral, LW, 35); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// ═══════════════════════════ Dünya ═══════════════════════════
// Kupanın yeri (Necmi'nin sağ elinde; yandan görünüşte yakın el de 'R'). Önden: göğsün sağında; yudum: çenenin altına kalkar.
function kupaAt(tm, t, nv) {
  if (nv.view === 'front') {
    const gogus = [NX + 48, 1236], yudum = [NX + 18, 1204];
    const u = pIn(t, 0.3, tm.kupami - 0.05, 0.42, 0.4);
    return { p: kar(gogus, yudum, u), kulp: 1 };
  }
  const f = nv.facing;   // yandan: göğsün önünde, iki eliyle sarılmış gibi (kollar kavuşuk)
  return { p: [NX + (f < 0 ? -22 : 0) + f * 80, 1222], kulp: -f };   // arkasını dönünce yarım adım dışarı
}
const kupaTutus = k => [k.p[0] + k.kulp * (KW / 2 + 8), k.p[1] - KH * 0.48];

function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  M.mekanCiz(K, KOR, 'arka', t);
  const sayacta = t >= tm.sayac;
  const ayna = (p, f) => {   // sayaçta ikisi aynı anda aynı hareketi yapar: "hıh" (çene kalkar) ve omzun üstünden kaçamak bakış
    if (!sayacta || t >= tm.buldum) return p;
    const hih = Math.max(pIn(t, tm.cd0 + 1.1, tm.cd0 + 2.0, 0.22, 0.35), pIn(t, tm.cd0 + 6.2, tm.cd0 + 7.0, 0.22, 0.35), pIn(t, tm.n1 + 0.15, tm.n1 + 1.1, 0.22, 0.35));
    const bak = Math.max(pIn(t, tm.cd0 + 3.4, tm.cd0 + 4.6, 0.25, 0.3), pIn(t, tm.cd0 + 7.6, tm.cd0 + 8.7, 0.25, 0.3));
    p.head = { ...p.head, tilt: (p.head.tilt || 0) - 9 * hih, look: [lerp(p.head.look[0], -0.9, bak), lerp(p.head.look[1], 0.05, bak)] };
    if (bak > 0.5) p.expr = { ...p.expr, eye: 0.7 };
    return p;
  };
  // ——— Defne (geride): yeminler boyunca Hikmet Bey'in sağında, sırt sırta dönünce ikisinin arasına yürür ———
  let dE = IF.saskin, dL = [-0.45, 0.15];                             // Hikmet Bey'e bakar
  if (t >= tm.kupami - 0.1) dL = [-0.6, 0.4];                         // kupaya bakar
  if (t >= tm.h1s + 0.05) dL = [-0.55, 0.2];                          // yemin edenlere
  if (t >= tm.d1 - 0.15) dE = IF.nazik;
  if (t >= tm.vardi) dL = [-0.45, 0.15];                              // "İkiniz de": önce sola, sonra sağa
  if (t >= tm.vardi + 0.45) dL = [0.45, 0.15];
  if (t >= tm.vardi + 0.95) dL = [0, 0];
  if (t >= tm.biri - 0.05) dL = [-0.4, 0.1];
  if (t >= tm.biri + 0.25) dL = [0.4, 0.1];
  if (t >= tm.hangisi - 0.1) dL = [0, 0];
  let dPoz = {};
  if (sayacta && t < tm.buldum) {
    // bakış iki kişide eşit süre (1,3 sn) gezer, sonra düşünür (el çenede); ipucunda izleyiciye döner
    const ts = t - tm.cd0, sira = [-1, 1, 0, -1, 1];
    const k = Math.max(0, Math.floor(ts / 1.3));   // sayaç perdesi açılmadan önceki 2 karede ts < 0
    dE = IF.dusun; dL = k < sira.length ? [0.45 * sira[k], sira[k] ? 0.15 : -0.5] : [0.1, -0.45];
    if (k >= sira.length) dPoz = POZ.dusun;
    if (t >= tm.n1 - 0.2) { dE = IF.nazik; dL = [0, 0]; dPoz = {}; }
    if (t >= tm.n1 - 0.25) {   // ipucu: "Kim, kime"de iki avucu açılır, cümle bitince iner
      const a = pIn(t, tm.n1 - 0.2, tm.n1s + 0.05, 0.3, 0.35);
      dPoz = { armL: { sh: lerp(POZ.rahat.armL.sh, 34, a), el: lerp(POZ.rahat.armL.el, -78, a) }, armR: { sh: lerp(POZ.rahat.armR.sh, 34, a), el: lerp(POZ.rahat.armR.el, -78, a) } };
    }
  }
  if (id === 'buldum') { dE = IF.gulus; dL = [0, -0.1]; }
  let dp;
  if (t >= tm.yuru && t < tm.vardi) {                                  // yandan yürür (sola), konuşurken de
    dp = H.yuru('defne', t, { t0: tm.yuru, x0: DX0, x1: DX, y: DY, s: H.BOY.defne * DS, hiz: 460 });
    dp.expr = { ...dE }; dp.head = { ...dp.head, tilt: 0, look: [0.3, 0.05] };
  } else dp = H.kisi('defne', { x: t < tm.yuru ? DX0 : DX, y: DY, s: H.BOY.defne * DS, expr: dE, ...POZ.rahat, ...dPoz, head: { tilt: dL[0] > 0.3 ? 3 : dL[0] < -0.3 ? -3 : 0, look: dL } });
  const wDus = sayacta && t < tm.n1 ? pIn(t, tm.cd0 + 6.3, tm.n1 - 0.45, 0.35) : 0;
  if (wDus < 1 && dPoz === POZ.dusun) { dp.armR = { sh: lerp(POZ.rahat.armR.sh, POZ.dusun.armR.sh, wDus), el: lerp(POZ.rahat.armR.el, POZ.dusun.armR.el, wDus) }; }
  if (t >= tm.hangisi - 0.25 && t < tm.d2s + 0.4) H.omuzSilk(dp, t, tm.hangisi - 0.2, 0.45);
  H.onayla(dp, t, tm.sira + 0.35, 1, 0.38);
  if (sayacta && t >= tm.cd0 + 0.4 && t < tm.n1) dp.head.tilt += 5 * Math.sin(TAU * (t - tm.cd0) / 7.5);
  dp.y -= H.buldumHop(t, tm.buldum, 50);
  if (id === 'buldum') Object.assign(dp, { armR: POZ.yukari.armR });

  // ——— Necmi (solda) ———
  let nv = { view: 'front', facing: 1 };
  if (t >= tm.donN) nv = { view: 'side', facing: 1 };
  if (t >= tm.sirt) nv = { view: 'side', facing: -1 };
  let nE = IF.sakin, nL = [0.1, 0.35], nTilt = 0;                     // kare 0: kupasına bakar (memnun değil, nötr)
  if (t >= 0.45 && t < tm.kupami - 0.05) nE = IF.yudum;
  if (t >= tm.kupami - 0.05) { nE = IF.alinmis; nL = [0.55, 0.1]; }   // "kupamı": Necmi Hikmet Bey'e bakar
  if (t >= tm.donN) { nE = IF.kus; nL = [0.3, 0]; nTilt = -5; }       // döner, çenesi kalkık
  if (t >= tm.n0s + 0.1) { nE = IF.kus; nL = [0.3, 0]; nTilt = -3; }
  if (t >= tm.h2 && t < tm.sirt) { nE = IF.alinmis; nTilt = 0; }       // Hikmet Bey'in sözünü dinler
  if (t >= tm.sirt) { nE = IF.kus; nL = [0.3, 0.05]; nTilt = -6; }
  const np = H.kisi('necmi', { x: NX + (t >= tm.sirt ? -22 : 0), ...nv, expr: nE, ...(nv.view === 'front' ? POZ.dur : {}), head: { tilt: nTilt, look: nL } });
  H.onayla(np, t, tm.etmemN - 0.05, 1, 0.36);
  ayna(np, -1);
  const kt = kupaAt(tm, t, nv);
  const nO = { heads, R: [kupaTutus(kt), 1, 'A'] };
  if (nv.view === 'side') nO.L = [[np.x + nv.facing * 58, 1196], 1, 'A'];   // uzak kol göğüste (kavuşuk)

  // ——— Hikmet Bey (sağda) ———
  let hv = { view: 'front', facing: 1 };
  if (t >= tm.donH) hv = { view: 'side', facing: -1 };
  if (t >= tm.sirt) hv = { view: 'side', facing: 1 };
  let hE = IF.kizgin, hL = [0.5, 0.15], hTilt = 0;                   // kanca: Defne'ye (sağa) yakınır
  if (t >= tm.h1s + 0.05) { hE = IF.alinmis; hL = [-0.6, 0.15]; }      // Necmi'nin sözünü dinler
  if (t >= tm.etmemN) { hE = IF.kizgin; }
  if (t >= tm.donH) { hE = IF.kus; hL = [0.3, 0.48]; hTilt = 3; }      // Necmi'ye (aşağıya) bakar
  if (t >= tm.h2s + 0.1) hTilt = 0;
  if (t >= tm.sirt) { hE = IF.kus; hL = [0.3, 0.05]; hTilt = -6; }
  const hp = H.kisi('hikmet', { x: HX + (t >= tm.sirt ? 18 : 0), ...hv, expr: hE, ...(hv.view === 'front' ? POZ.dur : {}), head: { tilt: hTilt, look: hL } });
  H.onayla(hp, t, tm.etmemH - 0.05, 1, 0.36);
  ayna(hp, 1);
  const hO = { heads };
  const wIsaret = hv.view === 'front' ? pIn(t, 0.32, tm.h1s - 0.25, 0.28, 0.28) : 0;   // kanca: sol el kupayı gösterir
  if (wIsaret > 0.01) hO.L = [[HX - 92, 1128], wIsaret, 'A'];
  const wKol = hv.view === 'side' ? W(t, tm.sirt, 0.3) : 0;                         // kollar kavuşur
  if (wKol > 0.01) { hO.R = [[hp.x + 70, 1150], wKol, 'A']; hO.L = [[hp.x + 62, 1140], wKol, 'A']; }

  // ——— çizim: Defne (geride) → Hikmet Bey → Necmi → kupa → tutan eller ———
  const dc = oyna(K, t, tl, 'defne', dp, { heads });
  const hc = oyna(K, t, tl, 'hikmet', hp, hO);
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  H.buhar(K, kt.p[0], kt.p[1] - KH - 4, t, { k: 0.34, n: 2, ara: 10, boy: 46 });
  kupa(K, kt.p, kt.kulp);
  nc.tut('R');
  if (wIsaret > 0.6) hc.isaret('L', [kt.p[0] + 10, kt.p[1] - KH / 2]);
  if (wKol > 0.6) hc.tut('R');
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
  void dc;
}
