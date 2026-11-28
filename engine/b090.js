// Bölüm 90 · İKİYE BİR PİDE (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_090_v5.md).
// Mekanizma: kes-seç yönteminin eşit olmayan paya genişletilmesi (cevap arşivde kalır, kesilir).
// Logline: Pide salonunda kesilmemiş uzun kıymalı pide 300 lira; Defne 200, Necmi 100 verdi. Hikmet Bey: herkes kendi
// gözünde parası kadar alsın; terazi yok, kimse kimsenin bıçağına güvenmez. Necmi: "Biri keser, öbürü seçer: Defne ikiye
// kessin, ben seçeyim." Defne: "Olmaz, sen büyüğünü seçersin; bana yarısı kalır." İpucu (Hikmet bıçağı Necmi'ye iter):
// "Bence kesen, kendi payını bilmeli."
// Akılda kalacak tek şey: keseni ve seçeni payına göre kur.
// Sızıntı yasağı: pide hiçbir karede üçe bölünmez, üzerinde üç parça çizgisi ya da üç işaret yok; kimse parmakla üç saymaz.
// Görünen tek kesme çizgisi yanlış denemenin (ikiye) orta çizgisidir ve sayaç kesmesinde kalkar. Kerem bu bölümde yok.
// Zevk farkı yalnız bakışla: sayaçta Defne pidenin çıtır ucuna, Necmi kıymalı ortasına bakar.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const SALON = 'b090_salon';
const X = { necmi: 320, hikmet: 540, defne: 760 };
const Y = { necmi: 1420, hikmet: 1500, defne: 1460 };   // başlar aynı hizada; 40 px yukarıda (masa göğüs altına iner)
const MASA = { ust: 1181, on: 1211 };
const TAHTA = { x0: 168, x1: 912, ust: 1189, alt: 1203 };
const PIDE = { x0: 200, x1: 880, yb: 1190 };
const PK = 2.0;                                     // pidenin dikey kabarıklığı (üst kenar ≈ 1080)
const BIC_Y = 1032;                                  // bıçak pidenin üstünde yatar (kollar pidenin üstünden uzanır)
const BX = { ilk: 520, defne: 640, geri: 420, hikmet: 560, necmi: 360 };   // bıçağın durakları (orta x)
const NOT_N = [326, 1062], NOT_D = [756, 1062];      // elde tutulan paralar (Necmi 100, Defne 200)
const NOT_NY = [330, 1206], NOT_DY = [752, 1206];    // masaya bırakılmış (yatık)
// Kameralar [zoom, cx, cy]. Kart 300–509 px: saç tepeleri ≥ 540 px.
const KAM = {
  grup: [1.38, 540, 1005],
  hikmet: [1.43, 540, 994],
  insert: [1.43, 540, 994],
  necmi: [1.43, 420, 994],
  defne: [1.43, 662, 994],
  buldum: [1.43, 700, 994],
};
// Yakın plânlarda kadraj kenarında yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  hikmet: { necmi: -330, defne: 330 },
  insert: { necmi: 22, defne: -14 },
  necmi: { defne: 330 },
  defne: { necmi: -330 },
  buldum: { necmi: -330 },
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  supheli: { brow: -0.04, browTilt: 0.32, eye: 0.62, pupil: 1, curve: -0.04, open: 0, w: 0.85 },
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.24, open: 0, w: 0.9 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  keyif: { brow: 0.1, browTilt: -0.12, eye: 0.45, pupil: 1, curve: 0.42, open: 0, w: 1.0 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Nesneler ═══════════════════════════
// Kıyma taneleri ve biber parçaları (tohumlu, sabit)
const DOLGU = (() => { const r = H.mulberry32(90); return Array.from({ length: 46 }, () => [r(), r(), r()]); })();
// Pide: yandan, hafif yukarıdan; ön duvar, arka kenar, aradaki kıymalı yüzey; iki ucu bükülmüş.
// o.cizgi: 0..1 yanlış denemenin orta çizgisi (mercan, kesik); o.yari: 0..1 sağ yarının mercan tonu
function pideYol(ctx, x0, x1, yb) {
  ctx.beginPath();
  ctx.moveTo(x0, yb - 26);
  ctx.quadraticCurveTo(x0 + 26, yb + 2, x0 + 90, yb);
  ctx.lineTo(x1 - 90, yb);
  ctx.quadraticCurveTo(x1 - 26, yb + 2, x1, yb - 26);
  ctx.quadraticCurveTo(x1 - 34, yb - 60, x1 - 110, yb - 70);
  ctx.quadraticCurveTo((x0 + x1) / 2, yb - 80, x0 + 110, yb - 70);
  ctx.quadraticCurveTo(x0 + 34, yb - 60, x0, yb - 26);
  ctx.closePath();
}
function pide(K, o = {}) {
  const { ctx } = K, { x0, x1, yb } = PIDE, cx = (x0 + x1) / 2;
  ctx.save(); ctx.lineJoin = 'round';
  ctx.translate(0, yb); ctx.scale(1, PK); ctx.translate(0, -yb);   // pide dikeyde kabarık
  // gölge
  K.ell(cx, yb + 4, (x1 - x0) / 2 - 20, 7, 'rgba(60,30,10,0.18)', 0);
  // hamur gövdesi
  pideYol(ctx, x0, x1, yb); K.fs('#E2A95F', LW * 0.8);
  // kıymalı yüzey (ön kenar ile arka kenar arası)
  const fa = x0 + 96, fb = x1 - 96;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(fa, yb - 50);
  ctx.quadraticCurveTo(cx, yb - 82, fb, yb - 50);
  ctx.quadraticCurveTo(cx, yb - 40, fa, yb - 50); ctx.closePath();
  K.fs('#8C4630', LW * 0.5);
  ctx.clip();
  for (const [a, b, c] of DOLGU) {
    const x = lerp(fa + 10, fb - 10, a), y = yb - 46 - 24 * b;
    if (c < 0.22) K.rect(x - 6, y - 3, 12, 6, '#4F8F45', 0, 2);
    else if (c < 0.42) K.rect(x - 5, y - 3, 10, 6, '#D2483A', 0, 2);
    else K.circ(x, y, 3.2 + 2 * c, '#6B3322', 0);
  }
  ctx.restore();
  // ön kenar (kabarık dudak) ve uçların bükümü
  ctx.beginPath(); ctx.moveTo(fa - 30, yb - 42); ctx.quadraticCurveTo(cx, yb - 30, fb + 30, yb - 42);
  ctx.lineWidth = 14; ctx.strokeStyle = '#EDBE78'; ctx.lineCap = 'round'; ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(fa - 22, yb - 35); ctx.quadraticCurveTo(cx, yb - 23, fb + 22, yb - 35); ctx.stroke();
  for (const [x, s] of [[x0 + 30, 1], [x1 - 30, -1]]) {
    ctx.beginPath(); ctx.moveTo(x - 14 * s, yb - 40); ctx.quadraticCurveTo(x + 6 * s, yb - 26, x - 4 * s, yb - 8);
    ctx.lineWidth = 3; ctx.strokeStyle = '#B27338'; ctx.stroke();
  }
  // fırın izleri (düz renk, kızarmış benekler)
  for (const [u, v] of [[0.12, 0.3], [0.27, 0.15], [0.46, 0.22], [0.63, 0.12], [0.8, 0.26], [0.9, 0.18]]) K.ell(lerp(x0, x1, u), yb - 12 - 12 * v, 12, 4, '#C27F3E', 0);
  // yanlış deneme: sağ yarı mercan tonu ve orta çizgi
  if (o.yari > 0.01) {
    ctx.save(); pideYol(ctx, x0, x1, yb); ctx.clip();
    ctx.globalAlpha = 0.5 * o.yari; ctx.fillStyle = PAL.coral; ctx.fillRect(cx, yb - 100, x1 - cx + 10, 110);
    ctx.restore();
  }
  if (o.cizgi > 0.01) {
    const y0 = yb - 92, y1 = lerp(y0, yb + 8, o.cizgi);
    ctx.save(); ctx.setLineDash([16, 11]); ctx.lineCap = 'butt';
    ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(cx, y1); ctx.stroke();
    ctx.lineWidth = 9; ctx.strokeStyle = PAL.coral; ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(cx, y1); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
// Ahşap servis tahtası (sağda sapı)
function tahta(K) {
  const { x0, x1, ust, alt } = TAHTA;
  K.rect(x1 - 6, ust + 3, 66, alt - ust - 5, '#B98250', LW * 0.6, 5);
  K.circ(x1 + 46, ust + 7, 4, '#6E4524', 0);
  K.rect(x0, ust, x1 - x0, alt - ust, '#C8925A', LW * 0.7, 5);
  K.line(x0 + 8, ust + 4, x1 - 8, ust + 4, 2.5, '#DDB07A');
}
// Bıçak: st = { p: orta, rot }. Yerel: sap [−100, −30], ağız [−30, 100] (uç sağda)
const BK = 1.3;   // bıçağın ölçeği (telefonda seçilsin)
const bicNok = (st, [lx, ly]) => { lx *= BK; ly *= BK; const c = Math.cos(st.rot || 0), s = Math.sin(st.rot || 0); return [st.p[0] + lx * c - ly * s, st.p[1] + lx * s + ly * c]; };
const bicSap = st => bicNok(st, [-64, 0]);
const bicUc = st => bicNok(st, [82, -2]);
function bicak(K, st) {
  const { ctx } = K;
  ctx.save(); ctx.translate(st.p[0], st.p[1]); ctx.rotate(st.rot || 0); ctx.scale(BK, BK); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-30, -9); ctx.lineTo(70, -9); ctx.quadraticCurveTo(96, -8, 104, 0); ctx.quadraticCurveTo(70, 9, -30, 9); ctx.closePath();
  K.fs('#DCE2E4', LW * 0.6);
  K.line(-26, 4, 84, 3, 2.5, '#AEB8BC');
  K.rect(-102, -10, 74, 20, '#5B3A28', LW * 0.6, 7);
  for (const x of [-84, -62, -42]) K.circ(x, 0, 2.6, '#D9C9A8', 0);
  ctx.restore();
}
// Para: c merkez, elde dik; değer büyük rakamla (yakın plânda ≥ 56 px)
const PARA = { w: 176, h: 78 };
function para(K, c, deger, renk, rot = 0, m = 1) {   // m = −1: tutan el sağ uçta, rakam sola kayar
  const { ctx } = K;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(rot);
  K.rect(-PARA.w / 2 + 6, -PARA.h / 2 + 8, PARA.w, PARA.h, 'rgba(20,30,28,0.22)', 0, 6);
  K.rect(-PARA.w / 2, -PARA.h / 2, PARA.w, PARA.h, renk, LW * 0.6, 6);
  K.rect(-PARA.w / 2 + 9, -PARA.h / 2 + 9, PARA.w - 18, PARA.h - 18, null, 2.5, 4);
  K.ell(-50 * m, 0, 20, 24, H.mixHex(renk, '#FFFFFF', 0.35), 2.5);
  K.text(deger, 26 * m, 16, 44, INK, 900);
  ctx.restore();
}
// Masaya bırakılmış para (yatık; yalnız kenarı ve rengi görünür)
function paraYatik(K, [x, y], renk) { K.poly([[x - 96, y], [x + 96, y], [x + 84, y - 9], [x - 84, y - 9]], renk, LW * 0.5); }
const RENK = { n: '#86B8CF', d: '#C5A3CF' };
const paraTutusN = c => [c[0] - 92, c[1] + 10];   // Necmi sol ucundan tutar
const paraTutusD = c => [c[0] + 92, c[1] + 10];   // Defne sağ ucundan tutar

// ═══════════════════════════ Mekân: pide salonu ═══════════════════════════
function masa(K) {
  const x0 = -600, x1 = 1900, { ctx } = K;
  K.rect(x0, MASA.ust, x1 - x0, MASA.on - MASA.ust, '#E9E2D0', LW * 0.8, 0);   // mermer masa üstü
  K.line(x0, MASA.ust + 7, x1, MASA.ust + 7, 3, '#F6F1E4');
  K.rect(x0, MASA.on, x1 - x0, 1300, '#7A5236', LW, 0);                        // ön panel
  // çizgili pide salonu örtüsü: masanın önünden sarkar (altyazı ve sayaç üstünde durur; alt bant boş kalmaz)
  const y0 = MASA.on - 2, h = 420;
  K.rect(x0, y0, x1 - x0, h, '#F3EBDA', LW * 0.7, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, h); ctx.clip();
  for (let x = x0; x < x1; x += 120) { K.rect(x, y0, 44, h, '#7FAE8E', 0, 0); K.rect(x + 56, y0, 10, h, '#C9573F', 0, 0); }
  K.rect(x0, y0 + h - 46, x1 - x0, 22, '#C9573F', 0, 0);
  ctx.restore();
  K.line(x0, y0 + h, x1, y0 + h, LW * 0.7, INK);
  for (let x = x0 + 20; x < x1; x += 40) K.poly([[x - 11, y0 + h], [x + 11, y0 + h], [x, y0 + h + 20]], '#C9573F', LW * 0.4);   // saçak
}
// Taş fırın: kubbe, ağız, odun ateşi (döngü)
function firin(K, t) {
  const { ctx } = K, cx = 90, yb = 1181;
  ctx.beginPath(); ctx.moveTo(cx - 230, yb); ctx.lineTo(cx - 230, yb - 250); ctx.quadraticCurveTo(cx, yb - 470, cx + 230, yb - 250); ctx.lineTo(cx + 230, yb); ctx.closePath();
  K.fs('#C9B49A', LW * 0.8);
  const r = H.mulberry32(901);
  for (let i = 0; i < 16; i++) { const x = cx - 200 + r() * 400, y = yb - 40 - r() * 300; if (Math.abs(x - cx) < 210 - (yb - y) * 0.25) K.rect(x - 22, y - 9, 44, 18, '#B9A184', 2.5, 4); }
  // ağız
  const ax0 = cx - 95, ax1 = cx + 95, ay = yb - 40, ah = 140;
  ctx.beginPath(); ctx.moveTo(ax0, ay); ctx.lineTo(ax0, ay - ah + 60); ctx.quadraticCurveTo(cx, ay - ah - 30, ax1, ay - ah + 60); ctx.lineTo(ax1, ay); ctx.closePath();
  K.fs('#2B201B', LW * 0.7);
  ctx.save(); ctx.clip();
  K.rect(ax0, ay - 30, ax1 - ax0, 30, '#5A2E1C', 0, 0);
  for (let i = 0; i < 5; i++) H.alev(K, ax0 + 28 + i * 34, ay - 18, 1.9 + 0.35 * Math.sin(i * 2.1), t, { i, guc: 1 });
  ctx.restore();
  K.rect(ax0 - 18, ay, ax1 - ax0 + 36, 22, '#9C8468', LW * 0.6, 4);
}
// Sağda bakır tencereler rafı
function raf(K) {
  K.rect(880, 820, 300, 16, '#8A5C3A', LW * 0.6, 3);
  for (const [x, r, c] of [[930, 34, '#C47A45'], [1010, 44, '#B86E3C'], [1100, 30, '#C47A45']]) {
    K.rect(x - r, 820 - r * 1.4, r * 2, r * 1.4, c, LW * 0.6, 8);
    K.rect(x - r - 10, 820 - r * 1.4 - 6, r * 2 + 20, 10, '#9B5A30', LW * 0.5, 4);
  }
}
M.mekanEkle(SALON, {
  gen: [-600, 1900], dongu: ['fırında yanan ateş', 'pideden yükselen buhar'],
  kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'fayans', zemin: 'karo' });
    firin(K, t);
    raf(K);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), pide: T('h1:1'), defne: T('h1:5'), necmi: T('h1:8'), h1s: T('h1>'),
    h2: T('h2'), kendi: T('h2:1'), parasi: T('h2:3'), terazi: T('h2:6'), kimse: T('h2:8'), kimsenin: T('h2:9'), bicagina: T('h2:10'), guvenmez: T('h2:11'), h2s: T('h2>'),
    n0: T('n0'), keser: T('n0:1'), obur: T('n0:2'), defneN: T('n0:4'), ikiye: T('n0:5'), ben: T('n0:7'), n0s: T('n0>'),
    d2: T('d2'), buyugunu: T('d2:2'), bana: T('d2:4'), yarisi: T('d2:5'), nasil: T('d2:7'), d2s: T('d2>'),
    n1: T('n1'), kesen: T('n1:1'), kendiN: T('n1:2'), n1s: T('n1>'),
  };
  tm.hikKes = tm.h2 - 0.1; tm.insKes = tm.terazi - 0.12; tm.necKes = tm.n0 - 0.12; tm.defKes = tm.d2 - 0.12; tm.sayac = Math.min(cd0 - 0.05, tm.d2s);
  tm.paraIn = tm.h1s - 0.42;                                  // paralar masaya iner (0,4 sn)
  tm.bKal = tm.kimse + 0.05; tm.bBirak = tm.guvenmez + 0.3;   // Hikmet bıçağı kaldırır; masaya bırakır (0,35 sn)
  tm.nKay = tm.defneN + 0.02;                                 // Necmi bıçağı Defne'ye iter (0,45 sn)
  tm.dItt = tm.d2 + 0.06;                                     // Defne geri iter (0,4 sn)
  tm.cizgi = tm.buyugunu + 0.02; tm.yari = tm.yarisi - 0.04;  // yanlış deneme: orta çizgi, sağ yarı
  tm.hKal2 = cd0 + 0.9; tm.hBirak2 = cd0 + 3.8;                // sayaç: Hikmet bıçağı alıp bakar, bırakır
  tm.dPara = cd0 + 5.4; tm.dParaIn = cd0 + 7.6;               // sayaç: Defne parasını alıp bakar, bırakır
  tm.hItt = tm.kesen + 0.04;                                  // ipucu: Hikmet bıçağı Necmi'ye iter (0,5 sn)
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.hikKes - 0.1, 1.40, 540, 1001]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.insKes - 0.1, 1.45, 542, 991]] },
    { id: 'insert', t0: tm.insKes, cam: [[0, ...KAM.insert], [tm.necKes - 0.1, 1.45, 540, 991]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.defKes - 0.1, 1.45, 424, 991]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.sayac - 0.1, 1.45, 658, 991]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // sayaç ve ipucu: doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.33, 548, 1018]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // n1 balonu kesime kadar okunur; d2 balonu sayaç kesmesinden 0,3 sn önce söner
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').map(l => l.id === 'd2' ? { ...l, t1: Math.min(l.t1, tm.sayac - 0.3) } : l.id === 'h1' ? { ...l, t1: Math.min(l.t1, tm.hikKes - 0.3) } : l) };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// ═══════════════════════════ Zaman durumları ═══════════════════════════
// Bıçak: { p, rot, kim: 'masa' | 'hikmet' | 'necmi' | 'defne' }
function bicakAt(tm, t) {
  const kaldir = (a, b, x0, x1) => {   // a'da kalkar (0,4 sn), b'de iner (0,35 sn); elde hafif döner
    const UST = [lerp(x0, x1, 0.5) + 40, 1008];
    const u = ease.enter(seg(t, a, 0.4)), d = ease.state(seg(t, b, 0.35));
    const p = kar(kar([x0, BIC_Y], UST, u), [x1, BIC_Y], d);
    const r = 0.1 * u * (1 - d) + 0.06 * Math.sin(TAU * (t - a) / 1.6) * u * (1 - d);
    return { p, rot: r };
  };
  const kay = (a, d, x0, x1, kim) => ({ p: [lerp(x0, x1, ease.state(seg(t, a, d))), BIC_Y], rot: 0, kim });
  const dur = x => ({ p: [x, BIC_Y], rot: 0, kim: 'masa' });
  if (t < tm.bKal) return dur(BX.ilk);
  if (t < tm.bBirak + 0.35) return { ...kaldir(tm.bKal, tm.bBirak, BX.ilk, BX.ilk), kim: 'hikmet' };
  if (t < tm.nKay) return dur(BX.ilk);
  if (t < tm.nKay + 0.45) return kay(tm.nKay, 0.45, BX.ilk, BX.defne, 'necmi');
  if (t < tm.dItt) return dur(BX.defne);
  if (t < tm.dItt + 0.4) return kay(tm.dItt, 0.4, BX.defne, BX.geri, 'defne');
  if (t < tm.hKal2) return dur(BX.geri);
  if (t < tm.hBirak2 + 0.35) return { ...kaldir(tm.hKal2, tm.hBirak2, BX.geri, BX.hikmet), kim: 'hikmet' };
  if (t < tm.hItt) return dur(BX.hikmet);
  if (t < tm.hItt + 0.5) return kay(tm.hItt, 0.5, BX.hikmet, BX.necmi, 'hikmet');
  return dur(BX.necmi);
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç ve ipucu: doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.buldum - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.38), Math.log(1.42), u)), cx: lerp(540, 534, u), cy: lerp(1005, 997, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    // kısa kuyruk: baş noktası balonun 185 px üstüne indirilir (uç balonun 35 px üstünde kalır; pidenin üstüne binmez)
    const YA = YA0;
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (YA - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    // fiyat etiketi: kare 0'dan h1 sonuna (pidenin üstünde, sabit)
    if (t < tm.hikKes) H.tag(K, t, -1, tm.hikKes - 0.2, B.ekr([540, 1080]), '300 TL', PAL.mustard, INK, 50);
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: YA, split: { h1: 5, h2: 6, n0: 4, d2: 7, d4: 7 } });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, kb, { y: YA });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});
const YA0 = 1240;   // altyazı balonunun üstü: iki satırlık balon 1415 px'te biter (güvenli alan 1420)

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
  M.mekanCiz(K, SALON, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.sayac && t < tm.buldum;
  const ipucu = t >= tm.n1 - 0.3 && t < tm.buldum;
  const bc = bicakAt(tm, t);
  const HEAD = k => [yer(k), Y[k] - 600];
  const ORTA = [540, 1060], UC = [850, 1120];
  const cizgiU = t >= tm.cizgi && t < tm.sayac ? ease.enter(seg(t, tm.cizgi, 0.3)) : 0;
  const yariU = t >= tm.yari && t < tm.sayac ? ease.state(seg(t, tm.yari, 0.3)) : 0;

  // ——— paralar ———
  const paraIn = ease.state(seg(t, tm.paraIn, 0.4));
  const nNot = t < tm.paraIn + 0.4 ? [lerp(NOT_N[0], NOT_NY[0], paraIn), lerp(NOT_N[1] - 18 * H.nabiz(t, tm.necmi - 0.06, 0.34), NOT_NY[1] - 34, paraIn)] : null;
  let dNotC = t < tm.paraIn + 0.4 ? [lerp(NOT_D[0], NOT_DY[0], paraIn), lerp(NOT_D[1] - 18 * H.nabiz(t, tm.defne - 0.06, 0.34), NOT_DY[1] - 34, paraIn)] : null;
  // sayaç: Defne parasını yeniden alır, bakar, bırakır
  if (t >= tm.dPara && t < tm.dParaIn + 0.4) {
    const u = ease.enter(seg(t, tm.dPara + 0.3, 0.4)), d = ease.state(seg(t, tm.dParaIn, 0.4));
    dNotC = kar(kar([NOT_DY[0], NOT_DY[1] - 34], [744, 1062], u), [NOT_DY[0], NOT_DY[1] - 34], d);
  }
  const dNotYatik = !dNotC || (t >= tm.dPara && t < tm.dPara + 0.3);

  // ——— Hikmet (ortada) ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads };
  hp.head.look = t < tm.defne - 0.1 ? bak('hikmet', hp, ORTA) : t < tm.necmi - 0.1 ? bak('hikmet', hp, HEAD('defne')) : t < tm.h1s ? bak('hikmet', hp, HEAD('necmi')) : [0.05, 0.08];
  // h1 "pide": sağ el pideyi sunar
  const wSun = pIn(t, tm.pide - 0.3, tm.defne + 0.2, 0.28, 0.3);
  if (wSun > 0.01) hO.R = [[612, 1016], wSun, 'A'];
  // h2 "kendi gözünde": sol el başın yanında, parmak gözünü gösterir
  const wGoz = pIn(t, tm.kendi - 0.28, tm.parasi, 0.28, 0.3);
  if (wGoz > 0.01) hO.L = [H.elYeri('hikmet', hp, 'L', 'yukari').map((v, i) => v + [24, 40][i]), wGoz, 'B'];
  // "parası kadar alsın": sağ el pidenin üstünde payı ölçer gibi gezinir
  const wOlc = pIn(t, tm.parasi - 0.2, tm.terazi - 0.2, 0.28, 0.3);
  if (wOlc > 0.01) hO.R = [[600 + 50 * Math.sin(TAU * (t - tm.parasi) / 0.9), 1004], wOlc, 'A'];
  if (t >= tm.h2 && t < tm.n0) { hp.expr = IF.ciddi; hp.head.look = t < tm.parasi ? [0.05, 0.05] : bak('hikmet', hp, ORTA); }
  // insert "terazi yok": omuz silker; "kimse kimsenin bıçağına": bıçağı kaldırır, ikisine bakar
  if (t >= tm.terazi - 0.05 && t < tm.kimse) { H.omuzSilk(hp, t, tm.terazi, Math.max(0.2, tm.kimse - tm.terazi - 0.6)); hp.head.look = [0, 0.05]; }
  const bH = bc.kim === 'hikmet';
  const wBic = Math.max(pIn(t, tm.bKal - 0.28, tm.bBirak + 0.35, 0.28, 0.3), pIn(t, tm.hKal2 - 0.28, tm.hBirak2 + 0.35, 0.28, 0.3), pIn(t, tm.hItt - 0.28, tm.hItt + 0.5, 0.28, 0.3));
  const ittir = t >= tm.hItt - 0.3 && t < tm.hItt + 0.9;   // ipucu: Hikmet bıçağı ucundan iter
  if (wBic > 0.01) hO.R = [ittir ? bicUc(bc) : bicSap(bc), wBic, 'A'];
  if (t >= tm.kimse && t < tm.n0) hp.head.look = t < tm.bicagina ? bak('hikmet', hp, HEAD('necmi')) : t < tm.guvenmez ? bak('hikmet', hp, HEAD('defne')) : bak('hikmet', hp, bicUc(bc));
  if (t >= tm.n0 && t < tm.sayac) { hp.head.look = bak('hikmet', hp, t < tm.d2 ? HEAD('necmi') : HEAD('defne')); hp.expr = IF.notr; }
  // sayaç: bıçağı alıp bakar, bırakır; sonra eli çenesinde, bakışı ikisi arasında
  let hCene = 0;
  if (sayacta) {
    const c0 = tm.cd0; hp.expr = IF.dusun;
    hCene = 0;   // (eli çenede pozu Necmi/Defne'nin yüzüne biniyordu: yalnız bakış gezinir)
    if (hCene > 0.01) hO.R = [cene('hikmet', hp, 1), hCene, 'B'];   // sağ el (Necmi'nin yanına binmesin)
    if (t >= tm.hKal2 && t < tm.hBirak2 + 0.35) hp.head.look = bak('hikmet', hp, bicUc(bc));
    else { const j = Math.floor((t - c0) / 1.8) % 2; hp.head.look = bak('hikmet', hp, HEAD(j ? 'defne' : 'necmi')); }
    if (ipucu) { hp.expr = IF.sakin; hp.head.look = t < tm.kendiN ? bak('hikmet', hp, bc.p) : bak('hikmet', hp, HEAD('necmi')); }
  }
  if (id === 'cevap') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Necmi (solda) ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads };
  np.head.look = t < tm.necmi - 0.1 ? bak('necmi', np, ORTA) : t < tm.h1s ? [0.15, 0.1] : bak('necmi', np, HEAD('hikmet'));
  if (t >= tm.necmi - 0.1 && t < tm.h1s + 0.3) np.expr = IF.emin;
  if (nNot) nO.L = [paraTutusN(nNot), 1 - W(t, tm.paraIn + 0.4, 0.3), 'A'];
  else if (t < tm.paraIn + 0.75) nO.L = [paraTutusN([NOT_NY[0], NOT_NY[1] - 34]), 1 - W(t, tm.paraIn + 0.4, 0.3), 'A'];
  // insert: şüpheyle Defne'ye bakar, sonra bıçağa
  if (t >= tm.kimse - 0.1 && t < tm.n0) { np.expr = IF.supheli; np.head.look = t < tm.bicagina ? bak('necmi', np, HEAD('defne')) : bak('necmi', np, bicUc(bc)); }
  // n0: "keser" eliyle pidenin ortasını keser; "seçer" gösterir; "Defne ikiye kessin" bıçağı Defne'ye iter; "ben seçeyim" göğsü
  let nIsaret = null, nKes = 0, nBen = 0;
  if (t >= tm.necKes && t < tm.d2) {
    np.expr = IF.emin;
    nKes = pIn(t, tm.keser - 0.3, tm.obur + 0.05, 0.28, 0.25);
    const kesY = 955 + 40 * H.nabiz(t, tm.keser - 0.02, 0.3);
    if (nKes > 0.01) nO.R = [[520, kesY], nKes, 'A'];
    const wSec = pIn(t, tm.obur, tm.defneN - 0.3, 0.25, 0.25);
    if (wSec > 0.01) { nO.R = [[470, 1008], wSec, 'A']; if (wSec > 0.6) nIsaret = [520, 1040]; }
    const wKay = pIn(t, tm.nKay - 0.28, tm.nKay + 0.5, 0.28, 0.25);
    if (wKay > 0.01) nO.R = [bicSap(bc), wKay, 'A'];
    nBen = pIn(t, tm.ben - 0.28, tm.n0s + 0.1, 0.28, 0.3);
    const gogus = H.eklem('necmi', np, 'neck').map((v, i) => v + [12, 30][i]);
    if (nBen > 0.01) { nO.R = [[gogus[0] + 40, gogus[1] + 30], nBen, 'A']; if (nBen > 0.6) nIsaret = gogus; }
    np.head.look = t < tm.defneN - 0.1 ? bak('necmi', np, ORTA) : t < tm.ben ? bak('necmi', np, HEAD('defne')) : [0.1, 0.12];
  }
  if (t >= tm.d2 && t < tm.sayac) { np.expr = IF.merak; np.head.look = bak('necmi', np, HEAD('defne')); }
  // sayaç: pidenin ortasını koklar (zevki: orta), eli çenede düşünür, bakışı gezinir
  let nCene = 0, nSap = 0;
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.dusun;
    if (t >= c0 + 0.4 && t < c0 + 2.7) { np.expr = IF.keyif; np.head.look = [0.6, 0.5]; np.head.tilt = 9 * pIn(t, c0 + 0.4, c0 + 2.4, 0.35); }
    nCene = pIn(t, c0 + 3.2, c0 + 6.5, 0.35);
    if (nCene > 0.01) { nO.L = [cene('necmi', np, -1), nCene, 'B']; np.head.look = [-0.3, -0.25]; }
    if (t >= c0 + 6.8) np.head.look = Math.floor((t - c0 - 6.8) / 1.3) % 2 ? bak('necmi', np, HEAD('defne')) : bak('necmi', np, HEAD('hikmet'));
    if (ipucu) { np.expr = IF.merak; np.head.look = t < tm.hItt + 0.6 ? bak('necmi', np, bc.p) : t < tm.kendiN + 0.6 ? bak('necmi', np, ORTA) : bak('necmi', np, HEAD('hikmet')); }
    nSap = t >= tm.hItt + 0.45 ? W(t, tm.hItt + 0.45, 0.3) : 0;
    if (nSap > 0.01) nO.R = [bicSap(bc), nSap, 'A'];
  }
  if (id === 'cevap') np.head.look = bak('necmi', np, HEAD('defne'));

  // ——— Defne (sağda) ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  dp.head.look = t < tm.defne - 0.1 ? bak('defne', dp, ORTA) : t < tm.necmi ? [-0.12, 0.1] : bak('defne', dp, HEAD('hikmet'));
  if (t >= tm.defne - 0.1 && t < tm.h1s + 0.3) dp.expr = IF.emin;
  const dParaW = dNotC ? (t >= tm.dPara ? W(t, tm.dPara, 0.3) * (1 - W(t, tm.dParaIn + 0.4, 0.3)) : 1 - W(t, tm.paraIn + 0.4, 0.3)) : 0;
  if (dNotC) dO.R = [paraTutusD(dNotC), dParaW, 'A'];
  else if (t < tm.paraIn + 0.75) dO.R = [paraTutusD([NOT_DY[0], NOT_DY[1] - 34]), 1 - W(t, tm.paraIn + 0.4, 0.3), 'A'];
  if (t >= tm.kimse - 0.1 && t < tm.n0) { dp.expr = IF.supheli; dp.head.look = t < tm.bicagina ? bak('defne', dp, HEAD('necmi')) : bak('defne', dp, bicUc(bc)); }
  // d2: "Olmaz" bıçağı geri iter; "büyüğünü" pidenin ortasını keser (orta çizgi); "bana yarısı" eli sağ yarıda; soru: omuz silker
  let dYari = 0;
  if (t >= tm.defKes && t < tm.sayac + 0.3) {
    dp.expr = IF.ciddi;
    const wItt = pIn(t, tm.dItt - 0.28, tm.dItt + 0.45, 0.25, 0.25);
    if (wItt > 0.01) dO.R = [bicUc(bc), wItt, 'A'];
    const wKes = pIn(t, tm.buyugunu - 0.25, tm.bana - 0.1, 0.25, 0.25);
    if (wKes > 0.01) dO.R = [[560, 952 + 40 * H.nabiz(t, tm.cizgi - 0.04, 0.3)], wKes, 'A'];
    dYari = pIn(t, tm.yari - 0.28, tm.nasil - 0.05, 0.28, 0.25);
    if (dYari > 0.01) dO.R = [[710, 1046], dYari, 'A'];
    dp.head.look = t < tm.buyugunu - 0.1 ? bak('defne', dp, bc.p) : t < tm.bana ? bak('defne', dp, HEAD('necmi')) : bak('defne', dp, [700, 1060]);
    if (t >= tm.nasil - 0.05) { H.omuzSilk(dp, t, tm.nasil, Math.max(0.2, tm.d2s - tm.nasil - 0.25)); dp.head.look = [0, 0]; }
  }
  // sayaç: pidenin çıtır ucuna bakar (zevki: kenar), parmak yanakta, parasını alıp bakar
  let dParmak = false;
  if (sayacta) {
    const c0 = tm.cd0; dp.expr = IF.dusun;
    if (t < c0 + 2.0) { dp.head.look = [0.75, 0.42]; dp.head.tilt = -7 * pIn(t, c0 + 0.1, c0 + 1.8, 0.3); dp.expr = IF.sakin; }
    const dThink = pIn(t, c0 + 2.1, c0 + 5.0, 0.35);
    if (dThink > 0.01) { const h = H.eklem('defne', dp, 'head'); dO.L = [[h[0] - 0.43 * dp.s, h[1] + 0.4 * dp.s], dThink, 'B']; dParmak = dThink > 0.6; dp.head.look = [-0.25 + 0.12 * Math.sin(TAU * (t - c0) / 2.3), -0.25]; }
    dp.head.tilt = (dp.head.tilt || 0) + 4 * Math.sin(TAU * (t - c0) / 3.1);
    if (t >= tm.dPara && t < tm.dParaIn + 0.4) dp.head.look = bak('defne', dp, dNotC || NOT_DY);
    if (t >= tm.dParaIn + 0.5) dp.head.look = bak('defne', dp, HEAD('hikmet'));
    if (ipucu) { dp.expr = IF.merak; dp.head.look = t < tm.hItt + 0.6 ? bak('defne', dp, bc.p) : bak('defne', dp, HEAD('necmi')); }
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; dO.R = [[700, 1016], W(t, tm.cevap, 0.3), 'A']; }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Çizim: karakterler → masa → tahta → pide → buhar → paralar → bıçak → tutan eller ———
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  masa(K);
  tahta(K);
  pide(K, { cizgi: cizgiU, yari: yariU });
  H.buhar(K, 420, 1040, t, { k: 0.9, n: 2, periyot: 2.1 });
  H.buhar(K, 640, 1036, t + 0.8, { k: 0.9, n: 2, periyot: 2.3 });
  if (!nNot && id !== 'hikmet') paraYatik(K, NOT_NY, RENK.n);   // Hikmet yakın plânında yan karakterler kadraj dışında: paraları da
  if (dNotYatik && id !== 'hikmet') paraYatik(K, NOT_DY, RENK.d);
  bicak(K, bc);
  if (nNot) para(K, nNot, '100', RENK.n, -0.04 * paraIn);
  if (dNotC && !dNotYatik) para(K, dNotC, '200', RENK.d, 0.04 * paraIn, -1);
  // tutan eller (nesnenin üstünde)
  if (wSun > 0.6) hc.isaret('R', [640, 1040]);
  if (wGoz > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -0.35, boy: 0.9 });
  if (bH && wBic > 0.5) hc.tut('R');
  if (hCene > 0.6) hc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25, boy: 0.95 });
  if (nNot) nc.tut('L');
    if (nIsaret) nc.isaret('R', nIsaret);
  if (bc.kim === 'necmi' || nSap > 0.6) nc.tut('R');
  if (dNotC && !dNotYatik && dParaW > 0.5) dc.tut('R');
  if (bc.kim === 'defne') dc.tut('R');
  if (dYari > 0.6) dc.tut('R');
  if (dParmak) dc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 + 0.25, boy: 0.95 });
  if (id === 'cevap') dc.parmak('R', 1, { toplam: 1, yon: Math.PI / 2 + 0.6, boy: 1 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
