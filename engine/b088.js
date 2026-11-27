// Bölüm 88 · YILBAŞI ÇEKİLİŞİ (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_088_v5.md).
// Mekanizma: işlem kısıtı (S2). İsim yerine yer (numara) çekilir, ad bir sonraki yerin zarfına yazılır: dörtlü tek döngüde
// kimse kendine düşmez (cevap arşivde kalır, kesilir).
// Logline: Ofiste yılbaşı hediyeleşmesi. Hikmet Bey: geçen yıl biri kendini çekti, dört kez yeniden çektik; bu yıl tek
// çekiliş, kimse kendini çekmeyecek, kimse kimin kimi çektiğini bilmeyecek, ben dahil. Necmi torbayla gösterir: "Kendini
// çeken geri atar, yeniden çeker." Defne son kâğıdı çeker (kendi adı), Necmi torbayı ters çevirir: boş. "Nasıl yapacağız?"
// Akılda kalacak tek şey: isim değil, başka bir şey çekilebilir.
// Sızıntı yasağı: kimse sayaç ve ipucu boyunca zarflara uzanmaz, bakmaz, onları göstermez; ekranda "numara" yazısı yok.
// Kerem konuşmaz: geçen yılki "KEREM" kâğıdını gösterir, baş sallar, parmaklarıyla sayar, omuz silker.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const ODA = 'b088_oda';
const X = { hikmet: 240, genc: 445, necmi: 650, defne: 855 };
const Y = { hikmet: 1540, genc: 1500, necmi: 1460, defne: 1500 };   // Hikmet bir basamak alçakta, Necmi bir basamak yüksekte: başlar aynı hizada
const SY = 1203;                                     // masada nesnelerin oturduğu çizgi
const MASA = { ust: 1181, on: 1211 };
const ZARF = { x0: 150, w: 56, h: 86, ara: 6 };      // dört zarf, Hikmet'in önündeki rafta (1, 2, 3, 4)
const TORBA_YER = [445, SY], TORBA_NEC = [580, SY];  // Hikmet torbayı Kerem'in önüne koyar; Necmi kendine çeker
const KAGIT_DESTE = [800, SY];                       // boş kâğıt destesi ve kalem (Defne'nin önü)
// Kameralar [zoom, cx, cy]. Kart 300–509 px: saç tepeleri ≥ 540 px; masa hattı ≤ 1231 px.
const KAM = {
  grup: [1.25, 548, 1040],
  hikmet: [1.44, 330, 1040],
  necmi: [1.44, 520, 1040],
  defne: [1.44, 772, 1040],
  buldum: [1.44, 830, 1040],
};
// Yakın plânlarda kadraj kenarında yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  hikmet: { necmi: 320, defne: 320 },
  necmi: { hikmet: -330, defne: 330 },
  defne: { hikmet: -520, genc: -330 },
  buldum: { hikmet: -520, genc: -330 },
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  mahcup: { brow: 0.12, browTilt: -0.16, eye: 0.92, pupil: 1, curve: 0.28, open: 0, w: 1.0 },     // Kerem: geçen yıl kendini çeken
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.24, open: 0, w: 0.9 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Nesneler ═══════════════════════════
// Kadife torba: st = { p: taban ortası, rot: radyan }. Yerel (0,0) taban; boyun (0,−128); ağız (0,−158). Dönme merkezi (0,−65).
const TORBA_M = 65;
const TK = 0.85;   // torbanın ölçeği
const torbaNok = (st, [lx, ly]) => { lx *= TK; ly *= TK; const c = Math.cos(st.rot || 0), s = Math.sin(st.rot || 0), dx = lx, dy = ly + TORBA_M * TK; return [st.p[0] + dx * c - dy * s, st.p[1] - TORBA_M * TK + dx * s + dy * c]; };
function torba(K, st) {
  const { ctx } = K;
  ctx.save(); ctx.translate(st.p[0], st.p[1] - TORBA_M * TK); ctx.rotate(st.rot || 0); ctx.scale(TK, TK); ctx.translate(0, TORBA_M);
  ctx.lineJoin = 'round';
  // fırfırlı ağız
  ctx.beginPath(); ctx.moveTo(-26, -126); ctx.lineTo(-40, -156);
  for (let i = 0; i < 4; i++) ctx.quadraticCurveTo(-30 + i * 20, -166, -20 + i * 20, -156);
  ctx.lineTo(26, -126); ctx.closePath(); K.fs('#C24B45', LW * 0.7);
  K.ell(0, -157, 31, 7, '#5A1E1E', LW * 0.5);
  // gövde
  ctx.beginPath(); ctx.moveTo(-26, -128); ctx.quadraticCurveTo(-72, -104, -62, -34); ctx.quadraticCurveTo(-56, 0, 0, 0);
  ctx.quadraticCurveTo(56, 0, 62, -34); ctx.quadraticCurveTo(72, -104, 26, -128); ctx.closePath(); K.fs('#A8322F', LW * 0.8);
  ctx.beginPath(); ctx.moveTo(-40, -96); ctx.quadraticCurveTo(-50, -60, -38, -24); ctx.lineWidth = 6; ctx.strokeStyle = '#C9574E'; ctx.lineCap = 'round'; ctx.stroke();
  // büzgü ipi ve iki ucu
  K.rect(-30, -134, 60, 12, PAL.mustard, LW * 0.6, 6);
  ctx.beginPath(); ctx.moveTo(18, -126); ctx.quadraticCurveTo(30, -100, 24, -76); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = PAL.mustard; ctx.stroke();
  K.circ(24, -72, 7, PAL.mustard, LW * 0.5);
  ctx.restore();
}
// İsim kâğıdı (dikey, elde): c merkez; ad tr-TR büyük harf, 36 px (yakın plânda ≥ 50 px). Tutuş noktası sol uç: c + [−88, 12]
const FIS = { w: 224, h: 62 };
const fisTutus = c => [c[0] - 108, c[1] + 12];
function fis(K, c, ad, rot = 0) {
  const { ctx } = K;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(rot);
  K.rect(-FIS.w / 2 + 6, -FIS.h / 2 + 8, FIS.w, FIS.h, 'rgba(20,30,28,0.22)', 0, 6);
  K.rect(-FIS.w / 2, -FIS.h / 2, FIS.w, FIS.h, '#FBF6E6', LW * 0.6, 6);
  K.line(-FIS.w / 2 + 6, -FIS.h / 2 + 12, FIS.w / 2 - 6, -FIS.h / 2 + 12, 2.5, '#E3D7B6');   // katlama izi
  K.text(ad, 28, 14, 36, INK, 900);
  ctx.restore();
}
// Masaya bırakılmış kâğıt (yatık; yalnız kenarı görünür)
function fisYatik(K, [x, y]) { K.poly([[x - 104, y], [x + 104, y], [x + 92, y - 10], [x - 92, y - 10]], '#FBF6E6', LW * 0.5); }
// Zarf: (x, yb) taban ortası; kapak çizgisi, büyük rakam (yakın plânda ≥ 56 px)
function zarf(K, x, yb, n) {
  const { ctx } = K, w = ZARF.w, h = ZARF.h, y0 = yb - h;
  K.rect(x - w / 2, y0, w, h, '#F1E7CF', LW * 0.6, 4);
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 3, y0 + 3); ctx.lineTo(x, y0 + 30); ctx.lineTo(x + w / 2 - 3, y0 + 3); ctx.lineWidth = 3; ctx.strokeStyle = '#B9AA86'; ctx.lineJoin = 'round'; ctx.stroke();
  K.text(String(n), x, yb - 18, 42, INK, 900);
}
const zarfX = i => ZARF.x0 + ZARF.w / 2 + i * (ZARF.w + ZARF.ara);
function zarfRafi(K) {
  for (let i = 0; i < 4; i++) zarf(K, zarfX(i), SY - 2, i + 1);
  const x0 = ZARF.x0 - 12, x1 = zarfX(3) + ZARF.w / 2 + 12;
  K.rect(x0, SY - 16, x1 - x0, 16, PAL.woodTop, LW * 0.6, 4);   // rafın alçak ön dudağı (rakamları örtmez)
}
// Boş kâğıt destesi ve kalem
function deste(K, [x, y]) {
  for (let i = 0; i < 4; i++) K.rect(x - 70 + i * 2, y - 8 - i * 7, 140, 7, i % 2 ? '#F4EEDC' : '#FBF6E6', 2.5, 2);
  const { ctx } = K; ctx.save(); ctx.translate(x + 40, y - 40); ctx.rotate(-0.18);
  K.rect(-62, -7, 112, 14, '#2F6E8E', LW * 0.5, 6); K.poly([[50, -6], [70, 0], [50, 6]], '#E9DCC2', LW * 0.4); K.rect(-62, -7, 22, 14, '#1F4A60', 0, 4);
  ctx.restore();
}

// ═══════════════════════════ Mekân: ofis, yılbaşı ═══════════════════════════
function masa(K) {
  const x0 = -600, x1 = 1900;
  K.rect(x0, MASA.ust, x1 - x0, MASA.on - MASA.ust, '#B5865A', LW * 0.8, 0);   // masa üstü
  K.line(x0, MASA.ust + 8, x1, MASA.ust + 8, 3, '#C99A6C');
  K.rect(x0, MASA.on, x1 - x0, 1300, PAL.wood, LW, 0);                         // ön panel
  K.rect(-40, MASA.on - 2, 1160, 54, '#2F7A5A', LW * 0.6, 0);                  // yeşil masa örtüsü şeridi
  for (let x = -20; x < 1120; x += 46) K.poly([[x, MASA.on + 52], [x + 23, MASA.on + 74], [x + 46, MASA.on + 52]], x % 92 ? '#C24B45' : PAL.mustard, LW * 0.4);   // bayrak süsü
}
// Yılbaşı ışıkları: duvarda sarkan tel, ampuller sırayla yanar söner (düz renk, parlama yok)
function isiklar(K, t) {
  const { ctx } = K, x0 = -300, x1 = 1400, n = 30;
  const yAt = x => 770 + 34 * Math.sin(Math.PI * (((x - x0) / 340) % 1));
  ctx.beginPath(); for (let i = 0; i <= 170; i++) { const x = x0 + i * 10; i ? ctx.lineTo(x, yAt(x)) : ctx.moveTo(x, yAt(x)); }
  ctx.lineWidth = 4; ctx.strokeStyle = '#2C4A3E'; ctx.stroke();
  const renk = ['#E5533D', PAL.mustard, '#4FA36B', '#F2EAD3'];
  for (let i = 0; i < n; i++) {
    const x = x0 + 28 + i * ((x1 - x0) / n), y = yAt(x), faz = Math.floor(t / 0.6 + i) % 3 === 0;
    K.rect(x - 5, y, 10, 9, '#2C4A3E', 0, 2);
    K.ell(x, y + 20, 8, 12, faz ? renk[i % 4] : H.mixHex(renk[i % 4], '#5E6F68', 0.55), 3);
  }
}
// Pencere: kar yağar (tohumlu taneler, kapalı formülle düşer)
const KAR = (() => { const r = H.mulberry32(88); return Array.from({ length: 34 }, () => [r(), r(), 0.6 + r() * 0.8, r()]); })();
function karYagar(K, [x, y, w, h], t) {
  const { ctx } = K;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  for (const [a, b, v, f] of KAR) {
    const yy = y + (((b * h + t * 46 * v) % (h + 20)) + h + 20) % (h + 20) - 10, xx = x + a * w + 9 * Math.sin(t * 1.3 * v + f * TAU);
    K.circ(xx, yy, 3 + 2.5 * v, '#FFFFFF', 0);
  }
  ctx.restore();
}
M.mekanEkle(ODA, {
  gen: [-600, 1900], dongu: ['pencerede yağan kar', 'yılbaşı ışıklarının sırayla yanması'],
  capa: { torba: TORBA_YER }, kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'cizgili', zemin: 'ahsap' });
    const P = [300, 430, 300, 300];
    M.pencere(K, P[0], P[1], P[2], P[3], { isik, t: t + 2, manzara: 'istanbul', marti: false, kayit: false });
    karYagar(K, P, t);
    // pencere pervazında kar birikintisi
    K.ell(P[0] + P[2] / 2, P[1] + P[3] + 14, P[2] / 2 + 8, 9, '#FBFBF7', 3);
    isiklar(K, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), biri: T('h1:2'), kendini: T('h1:3'), dort: T('h1:5'), h1s: T('h1>'),
    h2: T('h2'), tek: T('h2:2'), kimse: T('h2:4'), kimse2: T('h2:7'), bilmeyecek: T('h2:11'), ben: T('h2:12'), h2s: T('h2>'),
    n0: T('n0'), ceken: T('n0:1'), atar: T('n0:3'), yeniden: T('n0:4'), ceker: T('n0:5'), n0s: T('n0>'),
    d2: T('d2'), tekD: T('d2:1'), son: T('d2:4'), cekenD: T('d2:5'), torbada: T('d2:8'), nasil: T('d2:12'), d2s: T('d2>'),
    n1: T('n1'), baska: T('n1:3'), n1s: T('n1>'),
  };
  tm.hikKes = tm.h2 - 0.1; tm.necKes = tm.n0 - 0.12; tm.defKes = tm.d2 - 0.12; tm.sayac = cd0 - 0.05;
  tm.koy = tm.tek + 0.1;                                   // torba masaya değer (knock)
  tm.cek = tm.n0 + 0.12;                                   // Necmi torbayı kendine çeker (0,4 sn)
  tm.fisN = tm.ceken - 0.1; tm.fisNIn = tm.atar - 0.2;     // "NECMİ" çıkar, geri atılır
  tm.fisH = tm.yeniden - 0.05; tm.fisHIn = tm.defKes + 1;   // "HİKMET" çıkar; d2'de masanın arkasına (cebine) iner
  tm.fisD = tm.cekenD - 0.12; tm.fisDBirak = cd0 + 0.25;   // Defne son kâğıdı çeker ("DEFNE"); sayaçta masaya bırakır
  tm.ters = tm.torbada - 0.2; tm.tersBit = tm.nasil + 0.05;   // Necmi torbayı ters çevirir: boş
  tm.salla = tm.n1 - 0.25;                                  // ipucu: Necmi torbayı kaldırıp sallar
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.hikKes - 0.1, 1.27, 548, 1038]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.necKes - 0.1, 1.44, 336, 1039]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.defKes - 0.1, 1.44, 524, 1039]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.sayac - 0.1, 1.44, 776, 1039]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // sayaç ve ipucu: doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.3, 560, 1036]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // n1 balonu kesime kadar okunur; d2 balonu sayaç kesmesinde söner
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').map(l => l.id === 'd2' ? { ...l, t1: Math.min(l.t1, tm.sayac - 0.3) } : l) };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// ═══════════════════════════ Zaman durumları ═══════════════════════════
// Torba: { p, rot, kim: 'hikmet' | 'necmi' | 'masa', tut: el hedefi }
function torbaAt(tm, t) {
  const elde = [372, 1150];                                    // Hikmet'in elinde (taban); boynundan tutar
  if (t < tm.koy - 0.45) {
    const s = H.nabiz(t, 0.3, 0.3) + H.nabiz(t, 0.62, 0.3) + H.nabiz(t, 0.94, 0.3);   // 0,3 sn: Hikmet torbayı üç kez sallar
    return { p: [elde[0], elde[1] - 16 * s], rot: 0.06 * s, kim: 'hikmet' };
  }
  if (t < tm.koy) return { p: H.tasi(t, tm.koy - 0.45, 0.45, elde, TORBA_YER, 30), rot: 0, kim: 'hikmet' };
  if (t < tm.cek) return { p: TORBA_YER, rot: 0, kim: t < tm.koy + 0.3 ? 'hikmet' : 'masa' };
  if (t < tm.cek + 0.4) return { p: kar(TORBA_YER, TORBA_NEC, ease.state(seg(t, tm.cek, 0.4))), rot: 0, kim: 'necmi' };
  // ters çevirme (d2): kaldırılır, 180° döner, sallanır, geri konur
  const yukari = [585, 1175];
  if (t >= tm.ters && t < tm.tersBit + 0.45) {
    const u = ease.state(seg(t, tm.ters, 0.45)), d = ease.state(seg(t, tm.tersBit, 0.45));
    const sal = 7 * Math.sin(TAU * (t - tm.ters - 0.45) / 0.3) * clamp01((t - tm.ters - 0.45) / 0.1) * (1 - d) * (t < tm.tersBit ? 1 : 0);
    const p = kar(kar(TORBA_NEC, yukari, u), TORBA_NEC, d);
    return { p: [p[0], p[1] + sal], rot: Math.PI * u * (1 - d), kim: 'necmi' };
  }
  // ipucu: Necmi kaldırır, sallar
  if (t >= tm.salla && t < tm.buldum + 0.4) {
    const u = ease.state(seg(t, tm.salla, 0.4)), d = ease.state(seg(t, tm.buldum, 0.4));
    const sal = 9 * Math.sin(TAU * (t - tm.salla - 0.4) / 0.32) * pIn(t, tm.salla + 0.4, tm.baska + 0.2, 0.1, 0.2);
    const p = kar(kar(TORBA_NEC, [545, 1172], u), TORBA_NEC, d);
    return { p: [p[0] + sal, p[1]], rot: 0, kim: 'necmi' };
  }
  return { p: TORBA_NEC, rot: 0, kim: 'masa' };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç ve ipucu: doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.buldum - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.25), Math.log(1.31), u)), cx: lerp(548, 556, u), cy: lerp(1040, 1036, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    // kısa kuyruk: baş noktası balonun 185 px üstüne indirilir (uç balonun 35 px üstünde kalır; masadaki zarfların üstüne binmez)
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (1255 - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: 1255, split: { h2: 4, d2: 4, d4: 12 } });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, kb, { y: 1255 });
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
// Bakış: baştan hedef noktaya (dünya)
const bak = (k, p, q) => { const h = H.eklem(k, p, 'head'); return [Math.max(-0.75, Math.min(0.75, (q[0] - h[0]) / 380)), Math.max(-0.5, Math.min(0.55, (q[1] - h[1]) / 420))]; };
const cene = (key, p, m) => { const h = H.eklem(key, p, 'head'); return [h[0] + m * 0.43 * p.s, h[1] + 0.4 * p.s]; };

function sahne(K, t, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  const tlTum = { ...S.tlS, lines: [...S.tlS.lines, ...S.tlN.lines] };   // dudak: n1 dahil
  M.mekanCiz(K, ODA, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.sayac && t < tm.buldum;
  const ipucu = t >= tm.n1 - 0.3 && t < tm.buldum;
  const tb = torbaAt(tm, t);
  const agiz = torbaNok(tb, [0, -150]), boyun = torbaNok(tb, [0, -126]), govde = torbaNok(tb, [0, -60]);
  const HEAD = k => [yer(k), Y[k] - 600];   // yaklaşık baş (bakış hedefi)

  // ——— Hikmet (solda; önünde zarf rafı) ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads };
  hp.head.look = t < tm.biri - 0.1 ? bak('hikmet', hp, govde) : t < tm.dort - 0.1 ? bak('hikmet', hp, HEAD('genc')) : [0.05, 0.05];
  const hTorba = tb.kim === 'hikmet';
  if (hTorba) hO.R = [boyun, 1, 'A'];
  else if (t < tm.koy + 0.6) hO.R = [kar(boyun, H.elYeri('hikmet', hp, 'R', 'asagi'), W(t, tm.koy + 0.3, 0.3)), 1 - W(t, tm.koy + 0.3, 0.3), 'A'];
  // "dört kez": sol el dört parmak (başın yanında değil, omuz önünde)
  const wDort = pIn(t, tm.dort - 0.3, tm.h1s + 0.25, 0.28, 0.3);
  const dortEl = [hp.x - 80, 1062];
  if (wDort > 0.01) hO.L = [dortEl, wDort, 'A'];
  // h2 "Kimse kendini çekmeyecek": sağ el yukarıda, işaret parmağı sallanır; "bilmeyecek": baş iki yana; "ben dahil": sol el göğsüne
  const wIkaz = pIn(t, tm.kimse - 0.25, tm.kimse2 - 0.05, 0.28, 0.3);
  if (wIkaz > 0.01) hO.L = [H.elYeri('hikmet', hp, 'L', 'yukari').map((v, i) => v + [10, 70][i]), wIkaz, 'B'];
  const wBen = pIn(t, tm.ben - 0.3, tm.h2s + 0.35, 0.28, 0.3);
  const gogus = H.eklem('hikmet', hp, 'neck').map((v, i) => v + [-10, 22][i]);
  if (wBen > 0.01) hO.L = [gogus, wBen, 'A'];
  if (t >= tm.h2 && t < tm.n0) {
    hp.expr = IF.ciddi;
    hp.head.look = t < tm.tek + 0.3 ? bak('hikmet', hp, TORBA_YER) : [0.15 * Math.sin(TAU * (t - tm.kimse) / 1.6), 0.05];
    if (t >= tm.kimse2 && t < tm.ben - 0.1) hp.head.look = [0.4 * Math.sin(TAU * (t - tm.kimse2) / 0.6), 0.05];
    if (t >= tm.ben - 0.1) hp.head.look = [0.1, 0.15];
  }
  if (t >= tm.n0 && t < tm.sayac) { hp.head.look = bak('hikmet', hp, HEAD(t < tm.d2 ? 'necmi' : 'defne')); hp.expr = IF.notr; }
  // sayaç: kollar kavuşuk, sonra eli çenesinde; bakışı torba ve insanlar arasında gezer (zarflara değil)
  let hKavus = 0, hCene = 0;
  if (sayacta) {
    const c0 = tm.cd0; hp.expr = IF.dusun;
    hKavus = 0;
    hCene = pIn(t, c0 + 5.2, tm.n1 - 0.2, 0.35);
    if (hKavus > 0.01) {
      const g = H.eklem('hikmet', hp, 'neck'), pv = H.eklem('hikmet', hp, 'pelvis'), yc = lerp(g[1], pv[1], 0.52);
      hO.L = [[g[0] + 0.42 * hp.s, yc + 0.06 * hp.s], hKavus, 'A']; hO.R = [[g[0] - 0.42 * hp.s, yc - 0.02 * hp.s], hKavus, 'A'];
    }
    if (hCene > 0.01) hO.R = [cene('hikmet', hp, 1), hCene, 'B'];
    const j = Math.floor((t - c0) / 1.7) % 3;
    hp.head.look = bak('hikmet', hp, [[TORBA_NEC[0], 1100], HEAD('genc'), HEAD('defne')][(j + 3) % 3]);
    if (ipucu) hp.head.look = bak('hikmet', hp, govde);
  }
  if (id === 'cevap') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Kerem (genc; konuşmaz) ———
  const kp = H.kisi(H.KEREM, { x: yer('genc'), y: Y.genc, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const kO = { heads, sessiz: true };
  kp.head.look = bak('genc', kp, govde);
  // kanca: geçen yılın "KEREM" kâğıdı sağ elinde; "biri kendini çekti"de kâğıdı kaldırır, mahcup gülümser; h2'de cebine indirir
  const fisK0 = [478, 1118], fisK1 = [478, 1094];
  const fisKc = kar(kar(fisK0, fisK1, W(t, tm.biri - 0.1, 0.3)), [520, 1400], W(t, tm.h2 + 0.25, 0.5));
  const kFis = t < tm.hikKes;   // kesmeden sonra kâğıt cebinde (yakın plânda kenarda yarım etiket kalmasın)
  if (kFis) kO.R = [fisTutus(fisKc), 1, 'A'];
  if (t >= tm.biri - 0.1 && t < tm.h2) { kp.expr = IF.mahcup; kp.head.look = t < tm.dort ? [-0.35, 0.1] : [0.2, 0.25]; kp.head.tilt = 6 * W(t, tm.biri, 0.3); }
  if (t >= tm.h2 && t < tm.n0) { kp.head.look = bak('genc', kp, t < tm.tek + 0.4 ? TORBA_YER : HEAD('hikmet')); if (t >= tm.kimse2 && t < tm.ben - 0.1) kp.head.look = [0.15 + 0.12 * Math.sin(TAU * (t - tm.kimse2) / 1.1), 0.2]; H.onayla(kp, t, tm.kimse + 0.1, 1, 0.38); }
  if (t >= tm.h2 + 0.6 && t < tm.n0) kp.expr = IF.notr;
  if (t >= tm.ben - 0.1 && t < tm.n0) H.onayla(kp, t, tm.ben, 1, 0.4);
  // n0: Necmi'nin kâğıdına bakar, "geri atar"da onaylar
  if (t >= tm.n0 && t < tm.d2) { kp.expr = IF.emin; kp.head.look = bak('genc', kp, [560, 1095]); H.onayla(kp, t, tm.atar, 2, 0.3); }
  // sayaç: parmaklarıyla dört kişiyi sayar (her sayıda başka birine bakar), omuz silker, yeniden sayar
  let kSay = 0, kN = 0;
  if (sayacta) {
    const c0 = tm.cd0; kp.expr = IF.dusun;
    const say = (a) => { const u = (t - a) / 0.62; return u < 0 ? 0 : Math.min(4, Math.floor(u) + 1); };
    kSay = Math.max(pIn(t, c0 + 0.5, c0 + 3.6, 0.3), pIn(t, c0 + 6.4, c0 + 9.0, 0.3));
    kN = t < c0 + 5 ? say(c0 + 0.8) : say(c0 + 6.6);
    if (kSay > 0.01) {
      kO.R = [H.elYeri('genc', kp, 'R', 'gogus').map((v, i) => v + [40, -55][i]), kSay, 'B'];
      const kim = ['hikmet', 'necmi', 'defne', 'genc'][Math.max(0, kN - 1)];
      kp.head.look = kim === 'genc' ? [0.1, 0.45] : bak('genc', kp, HEAD(kim));
    }
    if (t >= c0 + 4.1 && t < c0 + 5.6) { H.omuzSilk(kp, t, c0 + 4.1, 0.7); kp.head.look = [0, 0]; }
    if (ipucu) { kp.expr = IF.merak; kp.head.look = bak('genc', kp, govde); }
  }
  if (id === 'cevap') kp.head.look = bak('genc', kp, HEAD('defne'));

  // ——— Necmi ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads };
  np.head.look = t < tm.biri - 0.1 ? bak('necmi', np, govde) : bak('necmi', np, fisKc);
  if (t >= tm.biri && t < tm.h2) np.expr = IF.gulus;
  if (t >= tm.h2 && t < tm.n0) { np.head.look = bak('necmi', np, HEAD('hikmet')); np.expr = IF.merak; }
  // n0: torbayı çeker; "NECMİ" çıkar (kendi adı), "geri atar"; "yeniden çeker": "HİKMET"
  const fisNYer = [648, 1112];   // Necmi'nin kendi göğsünün önünde (Kerem'in önünde değil: ad etiketi gibi okunmasın)
  let fisN = null, fisH = null, nTorba = false, nFis = false;
  if (t >= tm.necKes && t < tm.d2 + 0.9) {
    np.expr = IF.emin;
    nTorba = t < tm.cek + 0.4;
    const wEl = W(t, tm.necKes, 0.3);
    let el = boyun;
    if (t >= tm.cek + 0.3) {
      // kâğıt çıkışı: ağızdan gösterme yerine; geri atış: gösterme yerinden ağıza
      const cN = kar(agiz, fisNYer, ease.enter(seg(t, tm.fisN, 0.35))), cNin = kar(fisNYer, [agiz[0] + 10, agiz[1] + 40], ease.state(seg(t, tm.fisNIn, 0.32)));
      const cH = kar(agiz, fisNYer, ease.enter(seg(t, tm.fisH, 0.35))), cHin = kar(fisNYer, [530, 1420], ease.state(seg(t, tm.fisHIn, 0.5)));
      if (t < tm.fisN) el = kar(boyun, [agiz[0] - 70, agiz[1] + 12], W(t, tm.cek + 0.3, 0.25));
      else if (t < tm.fisNIn + 0.32) { fisN = t < tm.fisNIn ? cN : cNin; el = fisTutus(fisN); }
      else if (t < tm.fisH) el = kar(fisTutus([agiz[0] + 10, agiz[1] + 40]), [agiz[0] - 70, agiz[1] + 12], W(t, tm.fisNIn + 0.32, 0.25));
      else if (t < tm.defKes) { fisH = t < tm.fisHIn ? cH : cHin; el = fisTutus(fisH); }
      else { el = H.elYeri('necmi', np, 'L', 'asagi'); }
      nFis = !!(fisN || fisH);
    }
    nO.L = [el, wEl, 'A'];
    np.head.look = fisN || fisH ? bak('necmi', np, fisN || fisH) : bak('necmi', np, agiz);
    if (fisH && t >= tm.ceker + 0.2) np.head.look = [0.3, 0.1];
    if (t >= tm.d2) { np.head.look = bak('necmi', np, HEAD('defne')); np.expr = IF.merak; }
  }
  // d2: Necmi torbayı ters çevirir (sağ el gövdede); boş
  const nTers = t >= tm.ters - 0.3 && t < tm.tersBit + 0.75;
  if (nTers) {
    const w = pIn(t, tm.ters - 0.3, tm.tersBit + 0.45, 0.28, 0.3);
    nO.R = [[govde[0] + 34, govde[1]], w, 'A'];
    np.head.look = bak('necmi', np, govde); np.expr = IF.merak;
  }
  // sayaç: torbanın içine bakar, eli çenesinde düşünür; ipucu: torbayı kaldırıp sallar
  let nBak = 0, nCene = 0, nSalla = 0;
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.dusun;
    nBak = pIn(t, c0 + 0.6, c0 + 2.9, 0.3);
    nCene = pIn(t, c0 + 3.5, c0 + 6.8, 0.35);
    if (nBak > 0.01) { nO.R = [[agiz[0] + 30, agiz[1] + 6], nBak, 'A']; np.head.look = bak('necmi', np, agiz); }
    if (nCene > 0.01) { nO.L = [cene('necmi', np, -1), nCene, 'B']; np.head.look = [-0.3, -0.25]; }
    if (t >= c0 + 6.8) np.head.look = Math.floor((t - c0 - 6.8) / 1.2) % 2 ? bak('necmi', np, HEAD('defne')) : bak('necmi', np, HEAD('genc'));
    if (ipucu) {
      np.expr = IF.merak;
      nSalla = pIn(t, tm.salla - 0.28, tm.buldum + 0.3, 0.28, 0.3);
      nO.R = [[govde[0] + 36, govde[1] - 6], nSalla, 'A'];
      np.head.look = t < tm.baska ? bak('necmi', np, agiz) : bak('necmi', np, HEAD('defne'));
    }
  }
  if (id === 'cevap') np.head.look = bak('necmi', np, HEAD('defne'));

  // ——— Defne (sağda) ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  dp.head.look = t < tm.biri - 0.1 ? bak('defne', dp, HEAD('hikmet')) : t < tm.h2 ? bak('defne', dp, fisKc) : bak('defne', dp, HEAD('hikmet'));
  if (t >= tm.biri && t < tm.h2) dp.expr = IF.gulus;
  if (t >= tm.n0 && t < tm.d2) { dp.expr = IF.ciddi; dp.head.look = bak('defne', dp, fisN || fisH || agiz); }
  // d2: "Olmaz, tek çekiliş": sağ el tek parmak; "Son çeken": sol el torbadan son kâğıdı çeker ("DEFNE"), gösterir; soru: omuz silker
  const fisDYer = [745, 1100];
  let fisD = null, dTek = 0;
  if (t >= tm.defKes && t < tm.sayac + 1.2) {
    dp.expr = IF.ciddi;
    dTek = pIn(t, tm.d2 - 0.1, tm.son - 0.1, 0.28, 0.3);
    if (dTek > 0.01) dO.R = [H.elYeri('defne', dp, 'R', 'gogus').map((v, i) => v + [50, -120][i]), dTek, 'B'];
    dp.head.look = t < tm.son - 0.1 ? [0.35 * Math.sin(TAU * (t - tm.d2) / 0.55) * (t < tm.tekD ? 1 : 0), 0.05] : bak('defne', dp, agiz);
    const wUz = W(t, tm.fisD - 0.3, 0.28);
    if (t >= tm.fisD - 0.3) {
      const c = kar(agiz, fisDYer, ease.enter(seg(t, tm.fisD, 0.4)));
      const cB = kar(fisDYer, [770, SY - 8], ease.state(seg(t, tm.fisDBirak, 0.4)));
      const birakti = t >= tm.fisDBirak + 0.4;
      if (!birakti) { fisD = t < tm.fisD ? null : (t < tm.fisDBirak ? c : cB); }
      const el = t < tm.fisD ? kar(H.elYeri('defne', dp, 'L', 'asagi'), [agiz[0] - 70, agiz[1] + 12], wUz) : fisTutus(fisD || cB);
      dO.L = [el, birakti ? 1 - W(t, tm.fisDBirak + 0.4, 0.3) : 1, 'A'];
      if (fisD && t >= tm.fisD + 0.3) dp.head.look = t < tm.torbada ? bak('defne', dp, fisD) : bak('defne', dp, govde);
    }
    if (t >= tm.nasil - 0.1 && t < tm.sayac) { H.omuzSilk(dp, t, tm.nasil, Math.max(0.2, tm.d2s - tm.nasil - 0.2)); dp.head.look = [0, 0]; }
  }
  // sayaç: parmak yanakta düşünür; torbaya ve insanlara bakar (zarflara değil)
  let dParmak = false;
  if (sayacta) {
    const c0 = tm.cd0; dp.expr = IF.dusun;
    const dThink = Math.max(pIn(t, c0 + 1.0, c0 + 4.2, 0.35), pIn(t, c0 + 6.2, c0 + 9.3, 0.35));
    dp.head.look = dThink > 0.4 ? [0.25 + 0.15 * Math.sin(TAU * (t - c0) / 2.3), -0.25] : bak('defne', dp, govde);
    dp.head.tilt = 4 * Math.sin(TAU * (t - c0) / 3.1);
    if (dThink > 0.01) { const h = H.eklem('defne', dp, 'head'); dO.R = [[h[0] + 0.43 * dp.s, h[1] + 0.4 * dp.s], dThink, 'B']; dParmak = dThink > 0.6; }
    if (ipucu) { dp.expr = IF.merak; dp.head.look = bak('defne', dp, govde); }
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; dO.R = [H.elYeri('defne', dp, 'R', 'gogus').map((v, i) => v + [60, -40][i]), W(t, tm.cevap, 0.3), 'A']; }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Çizim: karakterler → (inen kâğıtlar) → masa → nesneler → tutan eller ———
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);
  const kc = oyna(K, t, null, H.KEREM, kp, kO);
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  // masanın arkasına inen kâğıtlar (cebe): masadan önce çizilir
  if (kFis && t >= tm.h2 + 0.25) { fis(K, fisKc, 'KEREM'); kc.tut('R'); }
  if (fisH && t >= tm.fisHIn) { fis(K, fisH, 'HİKMET'); nc.tut('L'); }
  // torbadan çıkan kâğıt torbanın arkasında (ağzından yükselir)
  // torbanın ağzından yükselirken torbanın arkasında; ağzın üstüne çıkınca önünde (yazı tam okunur)
  const onde = c => c && Math.hypot(c[0] - agiz[0], c[1] - agiz[1]) > 60;
  // Necmi'nin kâğıtları: çıkışın ilk %35'inde torbanın arkasında, sonra önünde; geri atılırken son %40'ta yine arkasında
  const ondeN = fisN && seg(t, tm.fisN, 0.35) > 0.35 && seg(t, tm.fisNIn, 0.32) < 0.6, ondeH = fisH && seg(t, tm.fisH, 0.35) > 0.35;
  if (fisN && !ondeN) fis(K, fisN, 'NECMİ');
  if (fisH && t < tm.fisHIn && !ondeH) fis(K, fisH, 'HİKMET');
  if (fisD && t < tm.fisDBirak && !onde(fisD)) fis(K, fisD, 'DEFNE');
  masa(K);
  zarfRafi(K);
  deste(K, KAGIT_DESTE);
  if (t >= tm.fisDBirak + 0.4 && t < tm.buldum) fisYatik(K, [770, SY - 1]);
  if (fisD && t >= tm.fisDBirak) fis(K, fisD, 'DEFNE', 0);
  torba(K, tb);
  if (ondeN) fis(K, fisN, 'NECMİ');
  if (fisH && t < tm.fisHIn && ondeH) fis(K, fisH, 'HİKMET');
  if (fisD && t < tm.fisDBirak && onde(fisD)) fis(K, fisD, 'DEFNE');
  if (kFis && t < tm.h2 + 0.25) fis(K, fisKc, 'KEREM');
  // tutan eller (nesnenin üstünde)
  if (hTorba || (t < tm.koy + 0.3 && t >= tm.koy - 0.45)) hc.tut('R');
  if (wDort > 0.6) hc.parmak('L', 4, { toplam: 4, yon: -Math.PI / 2 - 0.1, ac: 0.3, boy: 0.85 });
  if (wIkaz > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 + 0.3 * Math.sin(TAU * (t - tm.kimse) / 0.5), boy: 1 });
  if (wBen > 0.6) hc.isaret('L', [gogus[0] + 30, gogus[1] - 10]);
  if (hKavus > 0.5) { hc.tut('L'); hc.tut('R'); }
  if (hCene > 0.6) hc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25, boy: 0.95 });
  if (kFis && t < tm.h2 + 0.25) kc.tut('R');
  if (kSay > 0.6 && kN > 0) kc.parmak('R', kN, { toplam: 4, yon: -Math.PI / 2, ac: 0.32, boy: 0.85 });
  if (nTorba || (nFis && !(fisH && t >= tm.fisHIn))) nc.tut('L');
  if (t >= tm.necKes && t < tm.fisN && t >= tm.cek + 0.3) nc.tut('L');
  if (nTers && t >= tm.ters - 0.05 && t < tm.tersBit + 0.45) nc.tut('R');
  if (nBak > 0.6) nc.tut('R');
  if (nCene > 0.6) nc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (nSalla > 0.6) nc.tut('R');
  if (dTek > 0.6) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 + 0.32 * Math.sin(TAU * (t - tm.d2) / 0.45), boy: 1.15 });   // "olmaz": parmak sallanır
  if (t >= tm.fisD - 0.05 && t < tm.fisDBirak + 0.4) dc.tut('L');
  if (dParmak) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (id === 'cevap') dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.4, boy: 1 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
