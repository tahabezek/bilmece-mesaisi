// Bölüm 30 · KİLİTLİ KUTU (v4 "hikâye" dili; storyboard: hikayeler/bolum_030_v5.md).
// Logline: Zam listesi depodaki Necmi'ye gidecek, ama postacı meraklı Kerem'dir. Defne kutuyu üç kez yollar ve Kerem
// listeyi bir kez bile okuyamaz.
// Akılda kalacak tek şey: iki kilit sırayla takılıp sırayla sökülünce, anahtar hiç yola çıkmadan kutu açılır.
// Tek dünya, kesit görünüşü: Hikmet'in odası · koridor · depo yan yana; aralarındaki duvarların yalnız kapı üstü önde çizilir.
// Kerem depoya sağa, odaya sola yürür (yön eşleme). Cevapta kamera Kerem'in x'ine kilitlidir (kesmesiz takip).
// Her şey t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur. Ortak motor: hikaye.js + mekan.js.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const KAT = 'b030_kat';
const DUV_A = 1000, DUV_B = 1424, DUV_W = 56, LENTO = 700;                 // iki duvar kesiti (x) · kapı boşluğunun üstü
const MASA = { x0: 250, x1: 850, y: 1190 }, TEZ = { x0: 1600, x1: 1880, y: 1180 }, DOLAPK = { x0: 1288, x1: 1412, y: 1246 };
const HIK_X = 400, DEF_X = 150, KX_O = 860, KX_D = 1565, KX_K = 1176, NX = 1960;
const BOX_O = [620, MASA.y], BOX_D = [1768, TEZ.y], BOX_K = [1338, DOLAPK.y];
const KIL_MASA = [470, MASA.y - 24], KIL_SAY = [808, MASA.y - 24], HIK_SAY = 720, DEF_SAY = 40, HIK_YAKIN = 480;   // sayaçta ikisi açılır (yüzler halkanın iki yanında)
const LID = 1.3;                                      // masada yatan hardal kilit
const ZARF_MASA = [362, MASA.y - 6];
const BW = 200, BH = 124, LIP = 16, BD = 150, KE = 0.26, DK = BD * KE;    // kutu: genişlik, gövde boyu, kapak kalınlığı, derinlik
const HALKA = [[-52, -BH + 24], [52, -BH + 24]];                          // halkalar (kutunun yerel koordinatı; 0 = hardal, 1 = mercan)
const HARDAL = '#E0A82E', MERCAN = PAL.coral, PETROL = '#2F8C86', KUTU = '#93A79A', KUTU2 = '#6F8578', KUTU_IC = '#2B4744';
const HAMUR = '#A8D8A0', HAMUR2 = '#6FA56C', DOLAP_R = '#7C9488';
const DOLAP = { x0: 2050, x1: 2300, y0: 760 }, MANDAL = [[2080, 1080], [2152, 1080]];   // depo dolabı ve mandaldaki iki halka (0 Necmi, 1 bekçi)

// ——— küçük yardımcılar ———
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const ekle = (p, d) => [p[0] + d[0], p[1] + d[1]];
function izF(keys, t) {   // değer izi; hedef işlev olabilir: [t, nokta | () => nokta, süre, eğri, lift]
  const val = k => typeof k === 'function' ? k() : k; let v = val(keys[0][1]);
  for (const [tk, tgt, d = 0.3, curve = ease.state, lift = 0] of keys) { if (tk > t) break; const u = d > 0 ? curve(seg(t, tk, d)) : 1, g = val(tgt); v = [lerp(v[0], g[0], u), lerp(v[1], g[1], u) - lift * 4 * u * (1 - u)]; }
  return v;
}
// Ön kol + el nesnenin ÜSTÜNE (masa karakterden sonra çizilir; uzanan kol altta kalmasın)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// Asma kilit: C gövdenin merkezi; acik 0..1 (kanca kalkar, sağ bacak dışarı çıkar); rot dönüş
function kilit(K, C, renk, { acik = 0, rot = 0, k = 1 } = {}) {
  const { ctx } = K; ctx.save(); ctx.translate(C[0], C[1]); ctx.rotate(rot); ctx.scale(k, k);
  const up = 16 * acik;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-15, -14); ctx.lineTo(-15, -40 - up); ctx.arc(0, -40 - up, 15, Math.PI, 0); ctx.lineTo(15, -24 - up + 10 * (1 - acik));
  ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#C9D0CB'; ctx.stroke(); ctx.restore();
  K.rect(-27, -22, 54, 46, renk, LW * 0.8, 9);
  K.rect(-27, 10, 54, 14, H.mixHex(renk, INK, 0.25), 0, 0); K.rect(-27, -22, 54, 46, null, LW * 0.8, 9);
  K.circ(0, -2, 6.5, INK, 0); K.rect(-2.5, -2, 5, 14, INK, 0);
  ctx.restore();
}
// Anahtar: C halka merkezi, a ağzın yönü (rad), renk halka rengi
function anahtar(K, C, a, renk, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(C[0], C[1]); ctx.rotate(a); ctx.scale(k, k);
  K.rect(10, -5, 46, 10, '#C9D0CB', LW * 0.6, 3); K.rect(38, 4, 8, 9, '#C9D0CB', LW * 0.5, 1); K.rect(48, 4, 7, 7, '#C9D0CB', LW * 0.5, 1);
  K.circ(0, 0, 15, renk, LW * 0.7); K.circ(0, 0, 5.5, INK, 0);
  ctx.restore();
}
function zarf(K, C, rot = 0, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(C[0], C[1]); ctx.rotate(rot); ctx.scale(k, k);
  K.rect(-60, -38, 120, 76, '#F6EEDC', LW * 0.75, 5);
  ctx.beginPath(); ctx.moveTo(-58, -36); ctx.lineTo(0, 8); ctx.lineTo(58, -36); ctx.lineWidth = 4.5; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}
// Zam listesi: C kâğıdın merkezi
function liste(K, C, rot = 0, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(C[0], C[1]); ctx.rotate(rot); ctx.scale(k, k);
  K.rect(-72, -92, 144, 184, PAL.cream, LW * 0.75, 6);
  K.text(K.up('zam'), 0, -42, 50, PAL.red, 900);
  for (let i = 0; i < 4; i++) { K.line(-48, -6 + i * 26, 30 - (i % 2) * 22, -6 + i * 26, 6, '#BDB3A0'); K.line(40, -6 + i * 26, 50, -6 + i * 26, 6, PAL.green); }
  ctx.restore();
}
// Hamur: C merkezi; iz 0..1 (anahtarın izi belirir)
function hamur(K, C, iz = 0, k = 1) {
  const { ctx } = K; ctx.save(); ctx.translate(C[0], C[1]); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(-44, 6); ctx.bezierCurveTo(-46, -22, -18, -30, 4, -28); ctx.bezierCurveTo(30, -30, 48, -16, 44, 6); ctx.bezierCurveTo(42, 26, -40, 28, -44, 6); K.fs(HAMUR, LW * 0.7);
  if (iz > 0.01) { ctx.save(); ctx.globalAlpha = Math.min(1, iz * 1.4); ctx.translate(-26, 0); K.circ(0, 0, 11, HAMUR2, 0); K.circ(0, 0, 4, HAMUR, 0); K.rect(8, -4, 34, 8, HAMUR2, 0, 2); K.rect(28, 3, 6, 7, HAMUR2, 0); K.rect(36, 3, 5, 5, HAMUR2, 0); ctx.restore(); }
  ctx.restore();
}
// Kutu: o = { x, y: ön alt kenarın ortası, th: kapak açısı (0 kapalı … 1,75), rot: eğim (alt orta çevresinde), dy: kapak titremesi (px),
//   kilit: [hardal, mercan] → null | { acik, rot }, zarf: kapağın üstünde zarf, ic(K): kutunun içi (yerel koordinatta; ağız y = −BH) }
// Yerel noktayı dünyaya çeviren: kutuNok(o, [lx, ly])
function kutuNok(o, [lx, ly]) { const c = Math.cos(o.rot || 0), s = Math.sin(o.rot || 0); return [o.x + lx * c - ly * s, o.y + lx * s + ly * c]; }
function kutu(K, o) {
  const { ctx } = K, th = o.th || 0, dy = o.dy || 0;
  ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot || 0);
  const Yh = -BH - LIP - DK, Yf = -BH - LIP - KE * BD * (1 - Math.cos(th)) - BD * Math.sin(th) - dy;
  const kapak = () => {
    if (Yf <= Yh - 2) {   // açık: kapağın içi görünür
      K.poly([[-BW / 2 - 4, Yh], [BW / 2 + 4, Yh], [BW / 2 + 4, Yf], [-BW / 2 - 4, Yf]], '#A9BBAF', LW * 0.8);
      K.rect(-BW / 2 + 14, Math.min(Yf, Yh) + 10, BW - 28, Math.abs(Yh - Yf) - 20 > 4 ? Math.abs(Yh - Yf) - 20 : 0, '#93A79A', 0, 4);
    } else {             // kapalıya yakın: üst yüz + ön dudak
      const lip = LIP * Math.cos(th);
      K.poly([[-BW / 2 - 5, Yh - dy], [BW / 2 + 5, Yh - dy], [BW / 2 + 5, Yf], [-BW / 2 - 5, Yf]], H.mixHex(KUTU, '#FFFFFF', 0.18), LW * 0.8);
      K.rect(-BW / 2 - 6, Yf, BW + 12, lip, KUTU2, LW * 0.8, 3);
      if (th < 0.25) {   // sap
        ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-30, Yf - DK * 0.45); ctx.lineTo(-30, Yf - DK * 0.45 - 20); ctx.lineTo(30, Yf - DK * 0.45 - 20); ctx.lineTo(30, Yf - DK * 0.45);
        ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7.5; ctx.strokeStyle = '#C9D0CB'; ctx.stroke(); ctx.restore();
        if (o.zarf) { ctx.save(); ctx.translate(-44, Yf - DK * 0.5); ctx.scale(0.62, 0.42); K.rect(-60, -38, 120, 76, '#F6EEDC', LW * 1.2, 5); ctx.restore(); }
      }
    }
  };
  const acikMi = th > 0.7;
  if (acikMi) kapak();
  // ağız (iç) ve içerik
  if (th > 0.03) { K.rect(-BW / 2 + 5, -BH - DK, BW - 10, DK + 2, KUTU_IC, LW * 0.7); if (o.ic) o.ic(K); }
  // ön yüz
  K.rect(-BW / 2, -BH, BW, BH, KUTU, LW, 8);
  K.rect(-BW / 2 + 10, -BH + 52, BW - 20, 8, KUTU2, 0, 3);
  for (const x of [-BW / 2 + 14, BW / 2 - 14]) for (const y of [-BH + 14, -16]) K.circ(x, y, 4, KUTU2, 0);
  K.rect(-34, -48, 68, 30, '#E9E2CF', LW * 0.55, 4);   // etiket kartı
  K.line(-22, -38, 22, -38, 4, '#B9AE96'); K.line(-22, -28, 10, -28, 4, '#B9AE96');
  if (!acikMi) kapak();
  // kapak dilleri (kapalıyken halkaların üstüne iner) ve halkalar
  for (const [hx, hy] of HALKA) {
    if (th < 0.14) K.rect(hx - 15, Yf + LIP * Math.cos(th) - 4, 30, hy - Yf - LIP + 18, '#B7C2BB', LW * 0.6, 4);
    ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, 11, 0, Math.PI * 2); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#C9D0CB'; ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  // takılı kilitler (dünyada; kutuyla döner)
  (o.kilit || []).forEach((kl, i) => { if (kl) kilit(K, kutuNok(o, ekle(HALKA[i], [0, 50])), i ? MERCAN : HARDAL, { acik: kl.acik || 0, rot: (o.rot || 0) + (kl.rot || 0) }); });
}
const halkaDunya = (o, i) => kutuNok(o, HALKA[i]);
const kilitYeri = (o, i) => kutuNok(o, ekle(HALKA[i], [0, 50]));
const kapakKenar = (o, dx = 40) => kutuNok(o, [dx, -BH - LIP + 4]);

// ═══════════════════════════ Mekân ═══════════════════════════
function masa(K, t) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 16, y + 24, x1 - x0 - 32, 1500 - y - 24, PAL.wood, LW);
  for (let i = 0; i < 2; i++) { K.rect(x0 + 40 + i * 290, y + 52, 230, 92, PAL.woodTop, LW * 0.7, 6); K.circ(x0 + 155 + i * 290, y + 98, 8, '#5D6A61', LW * 0.5); }
  K.rect(x0, y, x1 - x0, 26, PAL.woodTop, LW, 6);
  // çay bardağı (döngü: buhar)
  const bx = 272; K.ell(bx, y - 2, 30, 8, PAL.cream, LW * 0.6);
  K.poly([[bx - 17, y - 58], [bx + 17, y - 58], [bx + 11, y - 34], [bx + 18, y - 10], [bx + 12, y - 2], [bx - 12, y - 2], [bx - 18, y - 10], [bx - 11, y - 34]], '#B5532A', LW * 0.6);
  K.rect(bx - 17, y - 62, 34, 12, '#F1E6D2', LW * 0.5, 3);
  H.buhar(K, bx, y - 76, t, { k: 0.7, n: 2, ara: 70 });
}
function tezgah(K) {
  const { x0, x1, y } = TEZ;
  K.rect(x0 + 14, y + 22, x1 - x0 - 28, 1500 - y - 22, PAL.woodDark, LW);
  for (let i = 0; i < 3; i++) K.line(x0 + 30, y + 90 + i * 80, x1 - 30, y + 90 + i * 80, 4, '#6E4A27');
  K.rect(x0, y, x1 - x0, 24, PAL.wood, LW, 5);
}
function koriDolap(K) { const { x0, x1, y } = DOLAPK; K.rect(x0, y, x1 - x0, 1500 - y, '#B9A27A', LW, 4); K.rect(x0 + 12, y + 30, x1 - x0 - 24, 90, '#C9B48A', LW * 0.6, 4); K.circ((x0 + x1) / 2, y + 75, 7, INK, 0); }
function copKutusu(K, x) { K.poly([[x - 46, 1330], [x + 46, 1330], [x + 36, 1500], [x - 36, 1500]], '#5D6A61', LW); K.rect(x - 52, 1318, 104, 18, '#4E5A52', LW * 0.7, 4); }
function depoDolabi(K, t) {
  const { x0, x1, y0 } = DOLAP;
  K.rect(x0, y0, x1 - x0, 1500 - y0, DOLAP_R, LW, 6);
  K.line((x0 + x1) / 2 + 10, y0 + 10, (x0 + x1) / 2 + 10, 1490, 5, INK);
  for (const xx of [x0 + 30, (x0 + x1) / 2 + 40]) for (let i = 0; i < 4; i++) K.line(xx, y0 + 50 + i * 22, xx + 70, y0 + 50 + i * 22, 6, '#5F7569');
  K.rect(x0 + 6, 1046, 128, 66, '#B7C2BB', LW * 0.7, 6);   // mandal plakası
  for (const [hx, hy] of MANDAL) { const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, 11, 0, Math.PI * 2); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#C9D0CB'; ctx.stroke(); ctx.restore(); }
  // bekçi kasketi askıda
  K.circ(x1 + 46, 838, 7, INK, 0);
  K.poly([[x1 + 2, 900], [x1 + 92, 900], [x1 + 84, 862], [x1 + 10, 862]], '#2E4A48', LW * 0.8);
  K.rect(x1 - 4, 896, 102, 16, '#1F3433', LW * 0.6, 5); K.circ(x1 + 47, 879, 9, HARDAL, LW * 0.5);
  void t;
}
function raf(K, x) {
  K.rect(x, 860, 330, 18, PAL.woodTop, LW, 4); K.rect(x, 1110, 330, 18, PAL.woodTop, LW, 4);
  [[x + 20, 760, 120, 100], [x + 160, 790, 90, 70], [x + 30, 1020, 130, 90], [x + 180, 1000, 120, 110]].forEach(([a, b, w, h]) => { K.rect(a, b, w, h, '#C99A5B', LW * 0.8, 3); K.line(a + w / 2, b, a + w / 2, b + h * 0.35, 6, '#E6CF9C'); });
}
function ampul(K, x, t) {   // sallanan ampul (döngü)
  const a = 0.09 * Math.sin(t * 1.9), L = 210, e = [x + Math.sin(a) * L, 360 + Math.cos(a) * L];
  K.line(x, 300, e[0], e[1], 4); K.circ(e[0], e[1] + 18, 22, '#F6E7B0', LW * 0.7); K.rect(e[0] - 11, e[1] - 6, 22, 14, '#5D6A61', LW * 0.5, 2);
}
function ilan(K, x, t) {    // koridor ilan panosu (döngü: kıpırdayan kâğıt)
  K.rect(x, 860, 230, 170, '#B9845A', LW, 6);
  K.rect(x + 18, 878, 80, 100, PAL.cream, LW * 0.6, 3); K.rect(x + 120, 884, 92, 66, '#F3D98B', LW * 0.6, 3);
  const { ctx } = K; ctx.save(); ctx.translate(x + 166, 950); ctx.rotate(0.05 * Math.sin(t * 3.1)); K.rect(-38, 0, 76, 62 + 4 * Math.sin(t * 3.1), PAL.cream, LW * 0.6, 3); ctx.restore();
  K.circ(x + 58, 884, 6, PAL.red, 0); K.circ(x + 166, 888, 6, PAL.red, 0);
}

M.mekanEkle(KAT, {
  gen: [-600, 2800], dongu: ['oda: penceredeki martı, çay buharı', 'koridor: ilan kâğıdı · depo: sallanan ampul, duvar saati'],
  capa: { kutuOda: BOX_O, kutuDepo: BOX_D, kutuKoridor: BOX_K, mandal: MANDAL[0] },
  kadraj: { genis: [1.0, 540, 990], kutu: [1.22, 640, 1040], depo1: [1.4, 2005, 960], oda2: [1.12, 470, 1030], koridor: [1.08, 1230, 1040], sayac: [1.0, 372, 836], ipucu: [1.42, 2080, 990], buldum: [1.35, 250, 900], cevap: [1.1, 600, 1050], espri: [1.12, 560, 1030], cta: [1.4, 236, 900] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -600, x1: DUV_A, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.oda(K, { x0: DUV_A, x1: DUV_B + DUV_W, isik, duvar: 'duz', zemin: 'karo' });
    M.oda(K, { x0: DUV_B + DUV_W, x1: 2800, isik, duvar: 'fayans', zemin: 'karo' });
    // oda: pencere, saat, askı
    M.pencere(K, 470, 520, 270, 240, { isik, t: t + 3 });
    M.duvarSaati(K, 880, 600, 44, 10.3, t);
    K.rect(-160, 640, 22, 860, PAL.woodDark, LW, 6); K.ell(-149, 640, 50, 14, PAL.woodDark, LW);
    // koridor: ilan panosu
    ilan(K, 1110, t);
    // depo: raflar, dolap, ampul, saat
    raf(K, 2380); M.duvarSaati(K, 1640, 640, 42, 10.3, t); depoDolabi(K, t); ampul(K, 1850, t);
  },
  on(K) {   // iki duvarın kapı üstü kesiti ve kasalar
    for (const x of [DUV_A, DUV_B]) {
      K.rect(x, -600, DUV_W, LENTO + 600, '#1B3A3C', LW);
      K.rect(x - 12, LENTO - 4, DUV_W + 24, 24, PAL.trim, LW * 0.8, 3);
      K.rect(x - 12, LENTO + 16, 12, 1500 - LENTO - 16, PAL.trim, LW * 0.6); K.rect(x + DUV_W, LENTO + 16, 12, 1500 - LENTO - 16, PAL.trim, LW * 0.6);
    }
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    in: 0.3, depoya: T('h1:2'), kerem1: T('h1:7'),
    h2a: T('h2a'), uzan: T('h2a:1') - 0.3, cek: T('h2a:2') - 0.32, oku: T('h2a:3'), birak: T('h2a:4') - 0.42,
    tak: T('h2a:5'), cekis: T('h2a:6') - 0.06, anahtar: T('h2a:7') - 0.18, hamur: T('h2a:9') - 0.32, goster: T('h2a:9'),
    h2b: T('h2b'), benim: T('h2b:0'), depo1: T('h2b:2') - 0.1, kilidi: T('h2b:5'), oda2: T('h2b:7') - 0.1, nasil: T('h2b:8'),
    d2: T('d2'), zarfla: T('d2:3'), gonder: T('d2:4'),
    hd: T('hd'), kor: T('hd') - 0.1, bakin: T('hd:4'), bas: T('hd:5') + 0.16, goster2: T('hd:6'),
    cd, cd0, sayac: cd0 - 0.15,
    clue: T('n1'), ipucu: T('n1') - 0.1, tak2: T('n1:3'), benim2: T('n1:5'), bekci: T('n1:7'),
    buldum: T('d3'), uc: T('d3:2'), proof: T('d3>') + 0.05,
    kilitle: T('d4:1') + 0.16, tak3: T('d4:6') + 0.05, sok: T('d5:2'), acar: T('d5:9'), kapak: T('d5:10'),
    h4: T('h4'), espri: T('h4') - 0.25, atar: T('h4:7'),
    cta: T('d6') - 0.15, end: T('d6>') + 0.1,
  };
  // zam listesi kutuya düşer → Kerem çeker, okur → bırakır; Hikmet kapağı kapatır ve kilidi masadan alıp takar
  tm.kapa = tm.birak + 0.06; tm.kilAl = tm.kapa + 0.28; tm.kilKalk = tm.kilAl + 0.22;
  // koridor: Kerem yürür, kutuyu dolaba koyar, anahtarı zarftan çıkarır, hamura basar
  Object.assign(tm, { kw0: tm.kor - 0.2, kw1: tm.kor + 0.78 });
  tm.koy = tm.kw1 + 0.05; tm.zarfEl = tm.bakin - 0.36; tm.cik = tm.bakin - 0.04;
  // cevap: üç yolculuk (kelime çapalarına oturur)
  tm.al1 = tm.kilitle + 0.12; tm.w1s = tm.al1 + 0.3; tm.w1e = T('d4:3') + 0.32;
  tm.koy1 = tm.w1e + 0.02; tm.tug1 = tm.koy1 + 0.22; tm.al2 = tm.tak3 + 0.22; tm.w2s = tm.al2 + 0.3; tm.w2e = T('d5') + 0.22;
  tm.koy2 = tm.w2e + 0.02; tm.tug2 = tm.koy2 + 0.22; tm.al3 = Math.max(tm.sok + 0.38, tm.tug2 + 0.4); tm.w3s = tm.al3 + 0.28; tm.w3e = T('d5:6') + 0.02;
  tm.koy3 = tm.w3e + 0.02; tm.tug3 = tm.koy3 + 0.22; tm.listeCik = tm.kapak + 0.3; tm.tamam = tm.listeCik + 0.28;
  tm.kgir0 = tm.espri + 0.05; tm.kgir1 = tm.espri + 0.95;

  const kd = ad => M.kadraj(KAT, ad);
  const film = H.sahneler([
    { id: 'ac', t0: 0, cam: [[0, 1.04, 540, 1000], [1.4, ...kd('genis')], [tm.h2a - 0.05, ...kd('kutu')], [tm.anahtar + 0.6, 1.25, 660, 1030]] },
    { id: 'depo1', t0: tm.depo1, kisa: true, cam: [[0, ...kd('depo1')], [tm.depo1 + 1.2, 1.42, 2007, 956]] },
    { id: 'oda2', t0: tm.oda2, cam: [[0, ...kd('oda2')], [tm.d2 - 0.1, 1.16, 390, 1030]] },
    { id: 'koridor', t0: tm.kor, cam: [[0, ...kd('koridor')], [tm.bakin, 1.2, 1236, 1030]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...kd('sayac')], [tm.cd0 + 2.6, 1.04, 376, 836]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, ...kd('ipucu')], [tm.benim2 - 0.1, 1.45, 2086, 992]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...kd('buldum')]] },
    { id: 'cevap', t0: tm.proof, cam: [[0, ...kd('cevap')], [tm.sok, ...kd('cevap')]] },
    { id: 'espri', t0: tm.espri, cam: [[0, ...kd('espri')], [T('h4:6'), 1.16, 600, 1030]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, ...kd('cta')], [tm.cta + 1.5, 1.44, 232, 896]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— Hikmet (masanın arkasında, önden) ———
  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: 3, look: [0.6, 0.6] }, ...POZ.rahat });
  const hik = [
    [0.6, { head: { tilt: 5, look: [0.85, 0.15] } }, 0.35],
    [tm.depoya - 0.1, { head: { tilt: 4, look: [0.95, 0.05] } }, 0.3],
    [tm.kerem1 - 0.1, { expr: 'notr', head: { tilt: 6, look: [0.9, 0.3] } }, 0.3],
    [tm.uzan, { expr: 'notr', head: { tilt: 4, look: [0.8, 0.5] } }, 0.3],
    [tm.birak - 0.15, { expr: 'kizgin', lean: 5, head: { tilt: 6, look: [0.7, 0.6] } }, 0.22, ease.enter],
    [tm.tak + 0.2, { expr: 'mutlu', lean: 0, head: { tilt: 4, look: [0.9, 0.2] } }, 0.3],
    [tm.anahtar, { head: { tilt: -4, look: [-0.5, -0.4] } }, 0.3],
    [tm.hamur + 0.2, { expr: 'saskin', head: { tilt: 3, look: [0.9, 0.2] } }, 0.25],
    [tm.benim - 0.1, { expr: 'mutlu', head: { tilt: 5, look: [0.65, 0.55] } }, 0.3],
    [tm.oda2, { expr: 'notr', head: { tilt: 3, look: [0.7, 0.2] } }, 0.01],
    [tm.d2 - 0.05, { head: { tilt: -4, look: [-0.8, 0.3] } }, 0.3],
    [tm.gonder + 0.1, { expr: 'mutlu', head: { tilt: -3, look: [-0.7, 0.1] } }, 0.3],
    [tm.sayac, { x: HIK_SAY, expr: IFADE.dusun, head: { tilt: 4, look: [0.6, 0.6] } }, 0.01],
    [tm.cd0 + 1.1, { head: { tilt: 8, look: [0.3, 0.2] } }, 0.35],
    [tm.cd0 + 3.3, { expr: 'notr', head: { tilt: 2, look: [0.5, 0.6] } }, 0.3],
    [tm.cd - 1.0, { head: { tilt: 3, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.05, { x: HIK_YAKIN }, 0.01],
    [tm.buldum, { expr: 'saskin', head: { tilt: -3, look: [-0.8, 0.1] } }, 0.25],
    [tm.proof, { x: HIK_X, expr: 'mutlu', head: { tilt: 4, look: [0.75, 0.5] } }, 0.01],
    [tm.w1s + 0.2, { head: { tilt: 3, look: [0.95, 0.1] } }, 0.35],
    [tm.koy2 - 0.3, { head: { tilt: 4, look: [0.8, 0.5] } }, 0.3],
    [tm.sok + 0.4, { head: { tilt: -3, look: [0.4, -0.3] } }, 0.3],
    [tm.w3s + 0.3, { head: { tilt: 3, look: [0.95, 0.1] } }, 0.35],
    [tm.espri, { expr: 'mutlu', head: { tilt: 6, look: [0.85, 0.2] } }, 0.01],
    [tm.atar - 0.1, { head: { tilt: 8, look: [0.6, 0.6] } }, 0.3],
    [tm.cta, { x: HIK_YAKIN, head: { tilt: 4, look: [-0.7, 0.1] } }, 0.4],
  ];
  // ——— Defne (masanın solunda, önden) ———
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: -4, look: [0.75, 0.4] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: 4, look: [0.9, 0.2] } }, 0.4],
    [tm.kerem1, { expr: 'notr', head: { tilt: 3, look: [0.95, 0.1] } }, 0.3],
    [tm.oku, { expr: 'saskin', head: { tilt: -3, look: [0.9, 0.3] } }, 0.3],
    [tm.anahtar + 0.3, { expr: 'notr', head: { tilt: 4, look: [0.6, -0.2] } }, 0.3],
    [tm.oda2, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -6, look: [0.6, -0.3] } }, 0.01],
    [tm.d2 - 0.25, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 5, look: [0.8, 0.4] } }, 0.25, ease.enter],
    [tm.zarfla, { head: { tilt: 3, look: [0.6, 0.5] } }, 0.25],
    [tm.gonder, { head: { tilt: 6, look: [0.9, 0.05] } }, 0.25],
    [tm.sayac, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -6, look: [0.5, -0.4] } }, 0.01],
    [tm.cd0 + 1.6, { head: { tilt: 5, look: [0.85, 0.3] } }, 0.35],
    [tm.cd0 + 3.0, { expr: 'notr', head: { tilt: -5, look: [0.4, -0.5] } }, 0.35],
    [tm.cd - 1.0, { armR: POZ.dur.armR, head: { tilt: 4, look: [0.95, 0] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', ...POZ.yukari, head: { tilt: 6, look: [0.1, -0.3] } }, 0.25, ease.enter],
    [tm.proof, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 5, look: [0.9, 0.2] } }, 0.01],
    [tm.espri, { expr: 'mutlu', head: { tilt: 5, look: [0.9, 0.15] } }, 0.01],
    [tm.cta - 0.05, { head: { tilt: 7, look: [0.1, 0.05] } }, 0.35],
  ];
  // ——— Necmi (depoda tezgâhın arkasında, önden) ———
  const necBase = kisi('necmi', { x: NX, expr: 'mutlu', head: { tilt: -3, look: [-0.6, 0.2] }, ...POZ.rahat });
  const nec = [
    [tm.kilidi, { head: { tilt: 5, look: [-0.3, 0.05] } }, 0.3],
    [tm.ipucu, { expr: 'mutlu', head: { tilt: 5, look: [0.75, 0.4] } }, 0.01],
    [tm.benim2 - 0.1, { head: { tilt: 4, look: [0.6, 0.45] } }, 0.25],
    [tm.bekci - 0.1, { head: { tilt: 6, look: [0.85, 0.4] } }, 0.25],
    [tm.bekci + 0.6, { head: { tilt: -4, look: [-0.5, 0.05] } }, 0.35],
    [tm.proof, { expr: 'mutlu', head: { tilt: -4, look: [-0.8, 0.3] } }, 0.01],
    [tm.tak3 - 0.3, { head: { tilt: -6, look: [-0.7, 0.6] } }, 0.25],
    [tm.al2 + 0.3, { head: { tilt: -3, look: [-0.9, 0.1] } }, 0.3],
    [tm.acar - 0.25, { head: { tilt: -6, look: [-0.7, 0.6] } }, 0.25],
    [tm.listeCik + 0.1, { expr: 'mutlu', head: { tilt: 6, look: [0.6, -0.3] } }, 0.3],
  ];
  return { tm, film, hik, hikBase, def, defBase, nec, necBase };
}

// ═══════════════════════════ t anındaki durumlar ═══════════════════════════
// Kerem: { p (poz), kutuEl: kutunun ağırlık merkezi (taşınıyorsa), elL / elR: [hedef, w], hamur: [nokta] | null, iz, anahtarEl }
function keremAt(t, tm) {
  const kiFront = (x, o = {}) => kisi('genc', { x, expr: 'mutlu', head: { tilt: -3, look: [-0.7, 0.4] }, ...POZ.dur, ...o });
  // ——— odada (soru ve yanlış denemenin başı) ———
  if (t < tm.kor) {
    const keys = [
      [0, { expr: 'mutlu', lean: -10, head: { tilt: -6, look: [-0.75, 0.55] } }, 0.01],
      [tm.in + 0.05, { head: { tilt: -8, look: [-0.75, 0.75] } }, 0.25],
      [tm.kerem1 - 0.1, { lean: -4, head: { tilt: 4, look: [0.05, 0.1] } }, 0.3],
      [tm.uzan, { lean: -14, head: { tilt: -7, look: [-0.7, 0.75] } }, 0.3],
      [tm.oku - 0.2, { expr: 'mutlu', head: { tilt: -9, look: [-0.75, 0.85] } }, 0.25],
      [tm.birak - 0.04, { expr: 'saskin', lean: -4, head: { tilt: 3, look: [-0.95, 0.15] } }, 0.2, ease.enter],
      [tm.cekis - 0.05, { expr: IFADE.zorlanma, lean: -13, head: { tilt: -4, look: [-0.7, 0.7] } }, 0.2],
      [tm.cekis + 0.36, { expr: 'yorgun', lean: -6, head: { tilt: 9, look: [-0.5, 0.8] } }, 0.25],
      [tm.anahtar + 0.05, { expr: 'saskin', lean: -3, head: { tilt: -2, look: [-0.95, -0.45] } }, 0.25],
      [tm.hamur, { expr: 'mutlu', lean: 0, head: { tilt: 5, look: [0.1, 0.05] } }, 0.3],
      [tm.oda2, { expr: 'mutlu', lean: -7, head: { tilt: -4, look: [-0.75, 0.55] } }, 0.01],
      [tm.d2 - 0.1, { head: { tilt: -2, look: [-0.95, 0.15] } }, 0.3],
    ];
    const p = H.poseAt(H.CARDS.genc, kiFront(KX_O), keys, t);
    H.onayla(p, t, tm.kerem1 + 0.05, 2);
    return { p, oda: true };
  }
  // ——— koridor: kutuyu taşır, dolaba koyar, kopyayı çıkarır ———
  if (t < tm.sayac) {
    if (t < tm.kw1) { const p = H.yuru('genc', t, { t0: tm.kw0, x0: 1010, x1: KX_K, t1: tm.kw1 }); p.expr = 'mutlu'; p.head = { ...p.head, tilt: 4, look: [0.6, 0.2] }; return { p, yan: true }; }
    const keys = [
      [0, { expr: 'mutlu', lean: 4, head: { tilt: 3, look: [0.8, 0.5] } }, 0.01],
      [tm.cik + 0.1, { lean: 0, head: { tilt: 6, look: [0.05, 0.05] } }, 0.25],
      [tm.bas - 0.25, { head: { tilt: -6, look: [0, 0.8] } }, 0.25],
      [tm.goster2 - 0.05, { expr: 'mutlu', head: { tilt: 8, look: [0.15, 0.05] } }, 0.25],
    ];
    return { p: H.poseAt(H.CARDS.genc, kiFront(KX_K), keys, t) };
  }
  // ——— sayaç, ipucu, Buldum: koridorda bekler (kadraj dışında) ———
  if (t < tm.proof) return { p: kiFront(KX_K), gizli: true };
  // ——— cevap: üç yolculuk ———
  if (t < tm.espri) {
    const walks = [[tm.w1s, tm.w1e, KX_O, KX_D], [tm.w2s, tm.w2e, KX_D, KX_O], [tm.w3s, tm.w3e, KX_O, KX_D]];
    for (const [a, b, x0, x1] of walks) if (t >= a && t < b) { const p = H.yuru('genc', t, { t0: a, x0, x1, t1: b }); p.expr = 'mutlu'; p.head = { ...p.head, tilt: 3, look: [0.7, 0.3] }; return { p, yan: true }; }
    const x = t < tm.w1s ? KX_O : t < tm.w2s ? KX_D : t < tm.w3s ? KX_O : KX_D, depo = x === KX_D, sx = depo ? 1 : -1;
    const keys = [[0, { expr: 'mutlu', lean: 0, head: { tilt: -3, look: [-0.7, 0.4] } }, 0.01]];
    for (const tg of [tm.tug1, tm.tug2, tm.tug3]) keys.push([tg - 0.05, { expr: IFADE.zorlanma, lean: 6 * sx, head: { tilt: 2 * sx, look: [0.7 * sx, 0.6] } }, 0.15], [tg + 0.24, { expr: 'yorgun', lean: 2 * sx, head: { tilt: 9 * sx, look: [0.4 * sx, 0.8] } }, 0.22]);
    for (const [a, sxx] of [[tm.w1s - 0.32, -1], [tm.w2e, -1], [tm.w2s - 0.3, 1], [tm.w3s - 0.3, -1]]) keys.push([a, { expr: 'mutlu', lean: 0, head: { tilt: 0, look: [0.8 * -sxx, 0.4] } }, 0.2]);
    keys.push([tm.tamam - 0.2, { expr: 'saskin', lean: 8, head: { tilt: -4, look: [0.9, -0.2] } }, 0.25], [tm.tamam + 0.4, { expr: 'yorgun', lean: 3, head: { tilt: 10, look: [0.6, 0.7] } }, 0.3]);
    keys.sort((a, b) => a[0] - b[0]);
    return { p: H.poseAt(H.CARDS.genc, kiFront(x), keys, t) };
  }
  // ——— espri: odaya döner, kopyayı çöpe atar ———
  if (t < tm.kgir1) { const p = H.yuru('genc', t, { t0: tm.kgir0, x0: 1090, x1: 900, t1: tm.kgir1 }); p.expr = 'yorgun'; p.head = { ...p.head, tilt: 8, look: [0.5, 0.7] }; return { p, yan: true }; }
  const p = H.poseAt(H.CARDS.genc, kiFront(900, { expr: 'yorgun', head: { tilt: 8, look: [-0.4, 0.75] } }), [[tm.atar + 0.3, { head: { tilt: 10, look: [-0.6, 0.85] } }, 0.3]], t);
  return { p };
}

// Kutunun durumu: { o (kutu() seçenekleri), tasiyan: 'kerem' | null }
function kutuAt(t, tm, kr) {
  const kilitler = [null, null], o = { x: BOX_O[0], y: BOX_O[1], th: 0, rot: 0, kilit: kilitler };
  // tutuş: Kerem'in iki elinin arasında (önden) / yüz yönünde önde (yandan)
  const taşı = p => { const f = p.view === 'side' ? (p.facing || 1) : 0; return { x: p.x + f * 95 - (f ? 0 : 6), y: 1216 }; };
  if (t < tm.kor) {   // oda: kapak açık → kapanır; hardal kilit masadan takılır
    o.th = LID * (1 - W(t, tm.kapa, 0.24));
    if (t >= tm.tak) kilitler[0] = { rot: 0.18 * H.sars(t, tm.cekis + 0.08, 0.5, 8) };
    o.dy = 6 * Math.max(0, H.sars(t, tm.cekis + 0.08, 0.4, 9));
    return { o };
  }
  if (t < tm.sayac) {   // koridor: Kerem taşır, dolaba koyar; zarf kapağın üstünde
    kilitler[0] = { rot: 0.12 * Math.sin(t * 9) * (t < tm.koy ? 1 : 0) };
    o.zarf = t < tm.cik;
    if (t < tm.koy) { const q = taşı(kr.p); Object.assign(o, q); o.rot = kr.p.view === 'side' ? 0.03 * Math.sin(t * 15) : 0; return { o, tasiyan: true }; }
    const u = W(t, tm.koy, 0.32), a = { x: KX_K + 95, y: 1216 }, b = { x: BOX_K[0], y: BOX_K[1] };
    o.x = lerp(a.x, b.x, u); o.y = lerp(a.y, b.y, u) - 30 * 4 * u * (1 - u);
    return { o, tasiyan: u < 1 };
  }
  if (t < tm.proof) { o.th = 0; return { o }; }   // sayaç: başlangıç durumu (kapak kapalı, kilitsiz; liste içinde)   // sayaç: başlangıç durumu (açık, liste içinde)
  // ——— cevap ———
  // hardal: kilitle'de takılır, sok'ta açılıp söker · mercan: tak3'te takılır, acar'da açılıp söker
  if (t >= tm.kilitle && t < tm.sok + 0.14) kilitler[0] = { acik: t >= tm.sok ? W(t, tm.sok + 0.02, 0.12) : 0 };
  if (t >= tm.tak3 && t < tm.acar + 0.16) kilitler[1] = { acik: t >= tm.acar ? W(t, tm.acar + 0.04, 0.12) : 0 };
  const sar = Math.max(0, H.sars(t, tm.tug1 + 0.08, 0.4, 9)) + Math.max(0, H.sars(t, tm.tug2 + 0.08, 0.4, 9)) + Math.max(0, H.sars(t, tm.tug3 + 0.08, 0.4, 9));
  o.dy = 6 * sar;
  for (const kl of kilitler) if (kl) kl.rot = 0.16 * (H.sars(t, tm.tug1 + 0.08, 0.5, 8) + H.sars(t, tm.tug2 + 0.08, 0.5, 8) + H.sars(t, tm.tug3 + 0.08, 0.5, 8));
  o.th = 0.9 * W(t, tm.kapak, 0.3);
  // konum: masada → Kerem kaldırır → taşır → tezgâha koyar …
  const legs = [
    [tm.al1, tm.koy1, BOX_O, BOX_D], [tm.al2, tm.koy2, BOX_D, BOX_O], [tm.al3, tm.koy3, BOX_O, BOX_D],
  ];
  let yer = { x: BOX_O[0], y: BOX_O[1] }, tasiyan = false;
  for (const [a, b, A, B] of legs) {
    if (t < a) break;
    if (t >= b + 0.24) { yer = { x: B[0], y: B[1] }; continue; }
    tasiyan = true;
    const q = taşı(kr.p), ka = W(t, a, 0.26), kb = W(t, b, 0.22);
    if (t < b) yer = { x: lerp(A[0], q.x, ka), y: lerp(A[1], q.y, ka) - 14 * Math.sin(Math.PI * ka) };
    else yer = { x: lerp(q.x, B[0], kb), y: lerp(q.y, B[1], kb) - 12 * Math.sin(Math.PI * kb) };
    if (kr.p.view === 'side') o.rot = 0.025 * Math.sin(t * 15);
  }
  Object.assign(o, yer);
  return { o, tasiyan };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  kamera(cam, t, B) {   // cevapta kamera Kerem'in yürüyüşüne kilitli (oda durağı ↔ depo durağı doğrusal)
    if (B.sc.id !== 'cevap') return;
    const kx = keremAt(t, S.tm).p.x;
    cam.cx = 600 + (kx - KX_O) * (1800 - 600) / (KX_D - KX_O);
  },
  ekran(K, t, { ekr, sc }) {
    const { tm } = S;
    if (sc.id === 'koridor') {   // yanlış deneme: hamurdaki iz kopyadır
      const hw = H.tag(K, t, tm.bas + 0.04, tm.sayac - 0.22, ekr([1405, 1052]), K.up('kopya'), PAL.coral, PAL.paper, 50, [tm.goster2]);
      H.mark(K, t, tm.bas + 0.2, tm.sayac - 0.22, [ekr([1405, 1052])[0] + hw + 34, ekr([1405, 1052])[1]], false);
    }
    if (sc.id === 'cevap') kilitSayaci(K, t, tm);
    if (sc.id === 'cevap' && t >= tm.tamam) H.mark(K, t, tm.tamam, tm.espri - 0.2, ekle(ekr([NX + 125, 940]), [0, -150]), true);
  },
});

// Kilit sayacı (ekran uzayı, cevapta): rakam + kutudaki kilitlerin renkli simgeleri. 1 → 2 → 1 → açık
function kilitSayaci(K, t, tm) {
  if (t < tm.kilitle - 0.04 || t > tm.espri) return;
  const { ctx } = K, out = 1 - ease.exit(seg(t, tm.espri - 0.25, 0.2));
  const hVar = t >= tm.kilitle && t < tm.sok + 0.16, mVar = t >= tm.tak3 && t < tm.acar + 0.18;
  const n = (hVar ? 1 : 0) + (mVar ? 1 : 0), x0 = 540, y0 = 410;
  const v = H.spring(t - (tm.kilitle - 0.04), H.UI[0], H.UI[1]);
  ctx.save(); ctx.globalAlpha = clamp01(v * 1.6) * out; ctx.translate(x0, y0); ctx.scale((0.6 + 0.4 * v) * out, (0.6 + 0.4 * v) * out);
  const wPill = 400;
  K.rect(-wPill / 2 + 7, -74 + 9, wPill, 148, INK, 0, 34); K.rect(-wPill / 2, -74, wPill, 148, PAL.cream, LW, 34);
  // rakam (değişince kısa nabız)
  let pu = 1; for (const a of [tm.kilitle, tm.tak3, tm.sok + 0.16, tm.acar + 0.18]) pu += 0.18 * H.nabiz(t, a, 0.34);
  ctx.save(); ctx.translate(-130, 0); ctx.scale(pu, pu); K.text(String(n), 0, 36, 104, n === 0 ? PAL.green : INK, 900); ctx.restore();
  K.line(-76, -50, -76, 50, 5, '#CFC4AA');
  // simgeler: hardal solda, mercan sağda; biri çıkınca öteki ortaya kayar
  const sH = hVar ? H.spring(t - tm.kilitle, H.UI[0], H.UI[1]) : t >= tm.sok + 0.16 ? 1 - ease.exit(seg(t, tm.sok + 0.16, 0.2)) : 0;
  const sM = mVar ? H.spring(t - tm.tak3, H.UI[0], H.UI[1]) : t >= tm.acar + 0.18 ? 1 - ease.exit(seg(t, tm.acar + 0.18, 0.2)) : 0;
  const yalnizH = !mVar && t < tm.tak3, yalnizM = !hVar && t >= tm.sok;
  const xH = yalnizH ? 60 : 4, xM = yalnizM ? lerp(116, 60, W(t, tm.sok + 0.16, 0.3)) : lerp(60, 116, W(t, tm.tak3 - 0.05, 0.25));
  if (sH > 0.01) kilit(K, [xH, 22], HARDAL, { k: 1.4 * sH });
  if (sM > 0.01) kilit(K, [xM, 22], MERCAN, { k: 1.4 * sM });
  if (n === 0 && t >= tm.acar + 0.42) { const a = H.spring(t - tm.acar - 0.42, H.UI[0], H.UI[1]); ctx.save(); ctx.globalAlpha = clamp01(a); K.text(K.up('açık'), 60, 20, 52, PAL.green, 900); ctx.restore(); }
  ctx.restore();
}

function sahne(K, t, tl, S, { heads, sc }) {
  const { tm } = S, id = sc.id, hop = H.buldumHop(t, tm.buldum), ust = [];
  M.mekanCiz(K, KAT, 'arka', t);
  const kr = keremAt(t, tm), bx = kutuAt(t, tm, kr), o = bx.o;

  // ——— zam listesi: elde (kare 0) → kutuya düşer → Kerem yarıya çeker → geri düşer; cevapta Necmi çıkarır ———
  // içerik kutunun yerel koordinatında çizilir (ağız y = −BH); elde ya da havadaysa dünyada
  let listeIc = null, listeDunya = null;
  if (t < tm.kor) {
    const elde = [BOX_O[0] - 6, BOX_O[1] - BH - 150];
    if (t < tm.in + 0.28) { const u = seg(t, tm.in, 0.28); listeDunya = [elde[0], elde[1] + 150 * u * u]; if (u > 0.55) { listeIc = [-6, -BH - 150 + 150 * u * u - 0]; listeDunya = null; } }
    else {
      const cekU = W(t, tm.cek, 0.4) * (1 - seg(t, tm.birak, 0.2) ** 2);
      listeIc = [lerp(-6, 16, cekU), -BH + 30 - 112 * cekU];
    }
  } else if (t >= tm.sayac && t < tm.proof) listeIc = [-6, -BH + 30];
  else if (t >= tm.proof) {
    if (t < tm.listeCik) listeIc = [-6, -BH + 30];
    else { const u = W(t, tm.listeCik, 0.36); listeDunya = H.yay(kutuNok(o, [-6, -BH - 40]), [NX + 125, 940], u, 30); }
  }
  if (listeIc) o.ic = K2 => liste(K2, listeIc, 0.04, 0.9);

  // ——— Necmi ———
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  const necmi = {};
  {
    const elYuk = H.elYeri('necmi', np, 'R', 'yukari');
    // ara plan: mercan kilidi başının yanında gösterir
    const wG = pw(t, tm.depo1 + 0.05, tm.oda2 - 0.1, 0.28, 0.2);
    H.reach('necmi', np, 'R', elYuk, wG);
    // ipucu: mercan kilidi mandala takar, sonra mercana ve petrole dokunur
    const wT = pw(t, tm.ipucu + 0.1, tm.tak2 + 0.22, 0.3, 0.25), mandalKilit = ekle(MANDAL[0], [0, 50]);
    const elT = izF([[0, [NX + 60, 1180]], [tm.ipucu + 0.1, [mandalKilit[0] - 6, mandalKilit[1] + 30], 0.35], [tm.tak2 - 0.3, [mandalKilit[0], mandalKilit[1] + 2], 0.3]], t);
    H.reach('necmi', np, 'R', elT, wT, 'A');
    const dok = H.dokunYolu(t, [[0, [2070, 1200]], [tm.benim2, ekle(mandalKilit, [0, 6])], [tm.bekci, ekle(MANDAL[1], [0, 56])]]);
    const wD = pw(t, tm.benim2 - 0.1, tm.bekci + 0.55, 0.26, 0.3);
    H.reach('necmi', np, 'R', [dok[0] - 34, dok[1] + 26], wD, 'A');
    // cevap: mercanı sol elde tutar · takar · açar ve söker; sağ el kapağı açar, listeyi çıkarır
    const lc = kilitYeri({ ...BOX_D, rot: 0, x: BOX_D[0], y: BOX_D[1] }, 1);
    const tutL = H.elYeri('necmi', np, 'L', 'gogus');
    const elL = izF([[0, tutL], [tm.tak3 - 0.32, lc, 0.3], [tm.tak3 + 0.16, tutL, 0.3], [tm.acar - 0.3, lc, 0.28], [tm.acar + 0.18, ekle(tutL, [-30, 40]), 0.32]], t);
    const wL = t >= tm.proof && t < tm.espri ? 1 : 0;
    H.reach('necmi', np, 'L', elL, wL, 'A');
    const kk = kapakKenar(o, 30);
    const elR = izF([[0, H.elYeri('necmi', np, 'R', 'asagi')], [tm.kapak - 0.28, kk, 0.26], [tm.kapak, () => kapakKenar(o, 30), 0.01], [tm.listeCik, () => kutuNok(o, [10, -BH - 50]), 0.2], [tm.listeCik + 0.05, [NX + 125, 940], 0.36, ease.state, 30]], t);
    const wR = t >= tm.proof && t < tm.espri ? W(t, tm.kapak - 0.3, 0.26) : 0;
    H.reach('necmi', np, 'R', elR, wR, 'A');
    Object.assign(necmi, { wG, wT, wD, dok, wL, wR, elL });
  }

  // ——— Hikmet ———
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  if (id === 'oda2') H.omuzSilk(hp, t, tm.nasil - 0.05, 0.6);
  const hik = {};
  {
    // kare 0: listeyi kutunun üstünde tutar, 0,3'te bırakır · h1 "depoya": kapıyı gösterir · "Kerem": Kerem'i gösterir
    const w0 = 1 - W(t, tm.in + 0.1, 0.3);
    H.reach('hikmet', hp, 'R', [BOX_O[0] - 6 - 70, BOX_O[1] - BH - 150 + 30], w0);
    const wP = pw(t, tm.depoya - 0.05, tm.kerem1 + 0.45, 0.28, 0.3);
    H.reach('hikmet', hp, 'R', t < tm.kerem1 - 0.25 ? H.elYeri('hikmet', hp, 'R', 'yukari') : [650, 1010], wP, 'A');   // el başının yanında / masada kalır: yalnız parmak gösterir (Kerem'in yüzüne değmez)
    // h2a: kapağı kapatır, kilidi masadan alıp sol halkaya takar · h2b "Benim": kilidini gösterir
    const oKap = { ...o };
    const hedefKapa = kapakKenar({ x: BOX_O[0], y: BOX_O[1], rot: 0, th: 0 }, -40);
    const ustK = kutuNok({ x: BOX_O[0], y: BOX_O[1], rot: 0 }, [-40, -BH - LIP - KE * BD * (1 - Math.cos(oKap.th)) - BD * Math.sin(oKap.th)]);
    const kilYer = kilitYeri({ x: BOX_O[0], y: BOX_O[1], rot: 0 }, 0);
    const elK = izF([[0, ustK], [tm.kapa, () => ustK, 0.01], [tm.kilAl - 0.02, KIL_MASA, 0.22], [tm.kilKalk, kilYer, 0.3, ease.state, 30], [tm.tak + 0.1, kilYer, 0.1]], t);
    const wK = pw(t, tm.kapa - 0.04, tm.tak + 0.18, 0.24, 0.26);
    H.reach('hikmet', hp, 'R', t < tm.kilAl - 0.02 ? kar(ustK, hedefKapa, W(t, tm.kapa, 0.24)) : elK, wK, 'A');
    const wY = pw(t, tm.anahtar, tm.depo1, 0.32, 0.2), wB = pw(t, tm.benim - 0.02, tm.depo1, 0.26, 0.2);
    H.reach('hikmet', hp, 'R', H.elYeri('hikmet', hp, 'R', 'yukari'), wY, 'A');
    H.reach('hikmet', hp, 'R', ekle(kilYer, [-46, -10]), wB, 'A');
    // anahtar: sol el masanın arkasından başının yanına kalkar · d2'de zarfın üstüne gelir, anahtarı bırakır
    const yuk = H.elYeri('hikmet', hp, 'L', 'yukari'), asg = [HIK_X - 70, 1290];
    const zarfAcik = [262, 1018];
    const elA = izF([[0, asg], [tm.oda2, H.elYeri('hikmet', hp, 'L', 'gogus'), 0.01], [tm.zarfla - 0.3, [zarfAcik[0] + 40, zarfAcik[1] - 44], 0.3], [tm.zarfla + 0.32, asg, 0.36]], t);
    const wA = t >= tm.oda2 && t < tm.kor ? 1 : 0;
    if (wA) H.reach('hikmet', hp, 'L', elA, wA);
    const anahtarH = t >= tm.oda2 && t < tm.zarfla + 0.05 && t < tm.kor, anahtarR = t >= tm.anahtar + 0.05 && t < tm.depo1;
    // sayaç: kilidi masadan alıp evirip çevirir, geri koyar
    const wS = pw(t, tm.cd0 + 0.6, tm.cd0 + 3.4, 0.3, 0.3);
    const elS = izF([[0, KIL_SAY], [tm.cd0 + 0.9, [HIK_SAY + 90, 1050], 0.4, ease.state, 20], [tm.cd0 + 3.1, KIL_SAY, 0.32]], t);
    if (id === 'sayac') H.reach('hikmet', hp, 'R', elS, wS, 'A');
    // cevap: kilidi takar · anahtarla açıp söker, başının yanında tutar
    const kilYerC = kilitYeri(o.x === BOX_O[0] ? o : { x: BOX_O[0], y: BOX_O[1], rot: 0 }, 0);
    const tutC = [HIK_X + 110, 1110];
    const elC = izF([[0, tutC], [tm.kilitle - 0.3, kilYerC, 0.28], [tm.kilitle + 0.14, tutC, 0.3], [tm.sok - 0.3, kilYerC, 0.28], [tm.sok + 0.16, H.elYeri('hikmet', hp, 'R', 'yukari'), 0.36, ease.enter]], t);
    const wC = t >= tm.proof && t < tm.espri ? 1 : 0;
    if (wC) H.reach('hikmet', hp, 'R', elC, wC, 'A');
    // espri ve çağrı: söktüğü hardal kilidi göğsünde tutar, "bir kez bile"de kaldırır
    const wE = t >= tm.espri ? 1 : 0, elE = izF([[0, [HIK_X + 90, 1080]], [H.at(tl, 'h4:4'), H.elYeri('hikmet', hp, 'R', 'yukari'), 0.36, ease.enter], [tm.cta + 0.3, [hp.x + 90, 1080], 0.4]], t);
    if (wE) H.reach('hikmet', hp, 'R', elE, wE, 'A');
    Object.assign(hik, { w0, wP, wK, wB, wY, anahtarR, wA, wS, wC, wE, anahtarH, elK, elS, elC });
  }

  // ——— Defne ———
  const cta = id === 'cta';
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t);
  if (id === 'sayac') H.yanAdim(dp, t, { t0: tm.cd0 + 1.4, x0: DEF_SAY, x1: DEF_SAY + 60, adim: 2 });
  if (id === 'sayac' && t >= tm.cd0 + 3.0) H.yanAdim(dp, t, { t0: tm.cd0 + 3.0, x0: DEF_SAY + 60, x1: DEF_SAY, adim: 2 });
  H.glance(dp, t, tm.cd);
  dp.y -= hop;
  const def = {};
  {
    // d2: masadaki zarfı alır, açık tutar · "gönderin"de başının yanına kaldırır
    const zarfAcik = [262, 1018], yuk = H.elYeri('defne', dp, 'R', 'yukari');
    const elZ = izF([[0, ZARF_MASA], [tm.d2 + 0.25, zarfAcik, 0.34, ease.enter, 20], [tm.gonder - 0.02, ekle(yuk, [-6, 30]), 0.32, ease.enter]], t);
    const wZ = t >= tm.d2 - 0.3 && t < tm.kor ? W(t, tm.d2 - 0.28, 0.26) : 0;
    H.reach('defne', dp, 'R', elZ, wZ, 'A');
    // parmaklar başın sağ üstünde: Hikmet'in yüzüne binmez
    if (cta) H.reach('defne', dp, 'R', [dp.x + 172, dp.y - 640], W(t, tm.cta, 0.3), 'B');
    if (id === 'buldum') H.reach('defne', dp, 'R', [dp.x + 175, dp.y - 640], 1, 'B');
    Object.assign(def, { wZ, elZ });
  }

  // ——— Kerem: eller ———
  const kp = kr.p, ker = {};
  if (!kr.gizli) {
    // odada: sol el listeyi çeker · kapağı çeker · cebinden hamuru çıkarıp göğsünde tutar
    if (kr.oda) {
      const lt = kutuNok({ x: BOX_O[0], y: BOX_O[1], rot: 0 }, [lerp(-6, 16, W(t, tm.cek, 0.4)), -BH + 30 - 112 * W(t, tm.cek, 0.4) - 80]);
      const wL1 = pw(t, tm.uzan, tm.birak, 0.3, 0.25);
      H.reach('genc', kp, 'L', lt, wL1, 'A');
      const wL2 = pw(t, tm.cekis - 0.02, tm.cekis + 0.36, 0.22, 0.25);
      H.reach('genc', kp, 'L', ekle(kapakKenar({ ...o }, 46), [0, -o.dy || 0]), wL2, 'A');
      const gog = ekle(H.shoulder('genc', kp, 'L'), [-34, 70]);
      const wH = t >= tm.hamur ? W(t, tm.hamur, 0.34) : 0;
      if (wH > 0) H.reach('genc', kp, 'L', kar([KX_O - 70, 1300], gog, wH), 1, 'A');
      Object.assign(ker, { wL1, wL2, wH, hamurEl: wH > 0.2 });
    }
    // koridor: kutuyu iki koluyla taşır; sağ el kutuyu dolaba koyar, anahtarı zarftan çıkarıp hamura basar
    if (id === 'koridor' && !kr.yan) {
      const gog = ekle(H.shoulder('genc', kp, 'L'), [10, 92]);
      H.reach('genc', kp, 'L', gog, 1, 'A');
      const kutuSag = kutuNok(o, [BW / 2 - 4, -BH * 0.55]);
      const zarfY = kutuNok({ x: BOX_K[0], y: BOX_K[1], rot: 0 }, [-44, -BH - LIP - DK * 0.5]);
      const bas = ekle(gog, [34, -10]);
      const elR = izF([[0, kutuSag], [tm.koy + 0.34, () => kutuNok(o, [BW / 2 - 4, -BH * 0.55]), 0.01], [tm.zarfEl, zarfY, 0.3], [tm.cik + 0.04, ekle(gog, [60, -40]), 0.3], [tm.bas - 0.24, bas, 0.22], [tm.goster2 - 0.08, H.elYeri('genc', kp, 'R', 'yukari'), 0.36, ease.enter]], t);
      H.reach('genc', kp, 'R', elR, 1, 'A');
      Object.assign(ker, { hamurEl: true, anahtarK: t >= tm.cik });
    }
    if (kr.yan && bx.tasiyan) H.reach('genc', kp, 'R', kutuNok(o, [(kp.facing || 1) * (BW / 2 - 10), -BH * 0.5]), 1, 'A');
    // cevap (önden): kutuyu iki yanından tutar · kapağı çeker
    if (id === 'cevap' && !kr.yan) {
      const sol = kutuNok(o, [-BW / 2 + 4, -BH * 0.5]), sag = kutuNok(o, [BW / 2 - 4, -BH * 0.5]);
      const tut = bx.tasiyan ? 1 : 0;
      let wTug = 0; for (const tg of [tm.tug1, tm.tug2, tm.tug3]) wTug = Math.max(wTug, pw(t, tg, tg + 0.26, 0.16, 0.2));
      const yakin = kp.x < (BOX_O[0] + BOX_D[0]) / 2 ? 'L' : 'R', uzak = yakin === 'L' ? 'R' : 'L';
      // kaldırmadan 0,26 sn önce eller kutuya gider; bıraktıktan sonra çekilir
      let wEl = tut;
      for (const a of [tm.al1, tm.al2, tm.al3]) wEl = Math.max(wEl, W(t, a - 0.28, 0.26) * (t < a + 0.2 ? 1 : 0));
      for (const b of [tm.koy1, tm.koy2, tm.koy3]) if (t >= b && t < b + 0.5) wEl = Math.max(wEl, 1 - W(t, b + 0.22, 0.24));
      H.reach('genc', kp, 'L', sol, Math.max(wEl, 0), 'A'); H.reach('genc', kp, 'R', sag, Math.max(wEl, 0), 'A');
      if (wTug > 0) H.reach('genc', kp, yakin, ekle(kapakKenar(o, yakin === 'L' ? -40 : 40), [0, -(o.dy || 0)]), wTug, 'A');
      void uzak;
      Object.assign(ker, { wEl, wTug, yakin });
    }
    // espri: sol el hamuru göğsünde tutar, "okuyamadı"da çöpe bırakır
    if (id === 'espri' || cta) {
      if (!kr.yan) { const gog = ekle(H.elYeri('genc', kp, 'L', 'gogus'), [-4, 0]), cop = [770, 1290]; H.reach('genc', kp, 'L', izF([[0, gog], [tm.atar - 0.35, cop, 0.32]], t), 1, 'A'); ker.hamurEsp = t < tm.atar + 0.02; }
    }
  }

  // ——— karakterler ———
  const nOy = oyna(K, t, tl, 'necmi', np, { heads });
  const hOy = oyna(K, t, tl, 'hikmet', hp, { heads });
  let kOy = null; if (!kr.gizli) kOy = oyna(K, t, null, 'genc', kp, {});
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const dOy = oyna(K, t, tl, 'defne', dp, { heads });

  // ——— mobilya (karakterlerin önünde) ———
  masa(K, t); tezgah(K); koriDolap(K);
  if (t >= tm.espri) copKutusu(K, 770);

  // ——— nesneler ———
  // masadaki zarf (Defne alana kadar) ve masadaki hardal kilit
  if (t < tm.d2 + 0.05 || t >= tm.sayac) { if (!(t >= tm.d2 && t < tm.kor)) zarfCiz(K, ZARF_MASA, 0); }
  const kilitMasada = (t < tm.kilAl + 0.02) || (t >= tm.sayac && t < tm.proof && !(hik.wS > 0.5));
  if (kilitMasada) kilit(K, t >= tm.sayac ? KIL_SAY : KIL_MASA, HARDAL);
  // sayaçta Hikmet'in elindeki kilit
  if (id === 'sayac' && hik.wS > 0.5) kilit(K, hOy.handR, HARDAL, { rot: 0.5 * Math.sin((t - tm.cd0) * 2.4) });
  // h2a: kilit elde (masadan halkaya)
  if (t >= tm.kilAl + 0.02 && t < tm.tak && t < tm.kor) kilit(K, ekle(hOy.handR, [0, 40 * (1 - W(t, tm.kilKalk, 0.3))]), HARDAL);
  // cevap: Hikmet'in elindeki kilit (takmadan önce / söktükten sonra); espride göğsünde
  if (id === 'cevap' && t < tm.kilitle) kilit(K, ekle(hOy.handR, [0, 40 * (1 - W(t, tm.kilitle - 0.3, 0.28))]), HARDAL);
  if ((id === 'cevap' && t >= tm.sok + 0.14) || t >= tm.espri) kilit(K, ekle(hOy.handR, [0, -40]), HARDAL, { acik: 1 });   // söktüğü kilidi yumruğunun üstünde gösterir (ön kol altta kalır)
  // kutu
  if (!(id === 'koridor' && false)) kutu(K, o);
  if (listeDunya) liste(K, listeDunya, 0.04, 0.9);
  // Necmi'nin mercan kilidi (elde / mandalda)
  {
    const mandalKilit = ekle(MANDAL[0], [0, 50]);
    if (id === 'depo1') kilit(K, ekle(nOy.handR, [0, 44]), MERCAN);
    if (id === 'depo1') anahtar(K, ekle(nOy.handR, [40, 74]), 1.2, MERCAN, 0.95);
    if (t >= tm.ipucu - 0.2 && t < tm.proof) { if (t < tm.tak2) kilit(K, ekle(nOy.handR, [0, 0]), MERCAN); else kilit(K, mandalKilit, MERCAN, { k: 1.2, rot: 0.12 * H.sars(t, tm.tak2, 0.5, 7) + 0.1 * H.sars(t, tm.benim2, 0.4, 8) }); }
    kilit(K, ekle(MANDAL[1], [0, 54]), PETROL, { k: 1.2, rot: 0.1 * H.sars(t, tm.bekci, 0.4, 8) });
    if (id === 'cevap' && (t < tm.tak3 || t >= tm.acar + 0.16)) kilit(K, ekle(nOy.handL, [0, t < tm.tak3 ? 40 * (1 - W(t, tm.tak3 - 0.32, 0.3)) : 40]), MERCAN, { acik: t >= tm.acar ? 1 : 0 });
    if (id === 'cevap' && t >= tm.acar - 0.3 && t < tm.acar + 0.16) anahtar(K, ekle(nOy.handL, [26, 30]), -1.2, MERCAN, 0.9);
  }
  // Hikmet'in anahtarı: h2a'da başının yanında · d2'de zarfa düşer · cevapta kilidi açarken
  if (hik.anahtarH) {
    if (t < tm.zarfla - 0.02) anahtar(K, ekle(hOy.handL, [0, -26]), -1.3, HARDAL);
    else { const u = seg(t, tm.zarfla - 0.02, 0.18); anahtar(K, kar(ekle(hOy.handL, [0, -26]), [262, 1010], u), -1.3 - u * 0.3, HARDAL); }
  }
  if (hik.anahtarR) anahtar(K, ekle(hOy.handR, [6, -24]), hik.wB > 0.5 ? 0.15 : -1.3, HARDAL);
  if (id === 'cevap' && t >= tm.sok - 0.3 && t < tm.sok + 0.14) anahtar(K, ekle(hOy.handR, [-20, 30]), -1.9, HARDAL, 0.9);
  // Defne'nin elindeki zarf (d2)
  if (def.wZ > 0.5 && t < tm.kor) zarfCiz(K, ekle(dOy.handR, [0, 30]), -0.08);
  // Kerem: hamur (h2a'dan sonra sol elde), koridorda anahtar ve kopya
  if (kOy) {
    if (ker.hamurEl && kr.oda) hamur(K, ekle(kOy.handL, [6, -10]), 0);
    if (id === 'koridor' && !kr.yan) {
      const iz = W(t, tm.bas + 0.02, 0.16);
      hamur(K, ekle(kOy.handL, [10, -14]), iz, 1.45);
      if (ker.anahtarK) anahtar(K, ekle(kOy.handR, [0, t < tm.goster2 - 0.08 ? 14 : -30]), t < tm.goster2 - 0.08 ? 2.6 : -1.4, HARDAL);
      if (t < tm.cik) {/* anahtar zarfta */}
    }
    if (ker.hamurEsp && !kr.yan) {
      if (t < tm.atar - 0.02) hamur(K, ekle(kOy.handL, [6, -10]), 1, 1.0);
      else { const q = H.dus(t, tm.atar - 0.02, tm.atar + 0.2, ekle(kOy.handL, [6, -10]), [770, 1352]); if (t < tm.atar + 0.2) hamur(K, q, 1, 1.0); }
    }
  }

  // ——— tutan eller (nesnelerin üstünde) ———
  if (hik.w0 > 0.5 && t < S.tm.in + 0.02) hOy.tut('R');
  if (hik.wP > 0.6) hOy.isaret('R', t < tm.kerem1 - 0.25 ? [1200, 760] : [KX_O, 1060]);
  if (hik.wK > 0.5) kolUst(K, 'hikmet', hp, 'R');
  if (hik.wB > 0.5) kolUst(K, 'hikmet', hp, 'R');
  if (hik.wY > 0.5 || hik.wB > 0.5) hOy.tut('R');
  if (hik.wA > 0.5) hOy.tut('L');
  if (id === 'sayac' && hik.wS > 0.5) kolUst(K, 'hikmet', hp, 'R');
  if (id === 'cevap') kolUst(K, 'hikmet', hp, 'R');
  if (t >= tm.espri && hik.wE > 0.5) hOy.tut('R');
  if (necmi.wG > 0.5 || necmi.wT > 0.5) nOy.tut('R');
  if (necmi.wD > 0.6) nOy.isaret('R', necmi.dok);
  if (necmi.wL > 0.5) kolUst(K, 'necmi', np, 'L');
  if (necmi.wR > 0.5) kolUst(K, 'necmi', np, 'R');
  if (def.wZ > 0.5) dOy.tut('R');
  if (cta) dOy.parmak('R', 1, { boy: 1.15 });
  if (id === 'buldum') dOy.parmak('R', 3 * ease.enter(seg(t, tm.uc - 0.06, 0.3)), { toplam: 3, ac: 0.45 });
  if (kOy) {
    if (ker.wL1 > 0.5 || ker.wL2 > 0.5) kolUst(K, 'genc', kp, 'L');
    if (ker.hamurEl || ker.hamurEsp) kOy.tut('L');
    if (id === 'koridor' && !kr.yan) kOy.tut('R');
    if (kr.yan && bx.tasiyan) kOy.tut('R');
    if (id === 'cevap' && !kr.yan && (ker.wEl > 0.5 || ker.wTug > 0.5)) { kolUst(K, 'genc', kp, 'L'); kolUst(K, 'genc', kp, 'R'); }
  }
  // listeyi tutan Necmi'nin eli
  if (listeDunya && t >= tm.proof) nOy.tut('R');

  // ——— duvar kesitleri (önde) ———
  M.mekanCiz(K, KAT, 'on', t);
}
function zarfCiz(K, C, rot) { zarf(K, C, rot, 0.85); }
