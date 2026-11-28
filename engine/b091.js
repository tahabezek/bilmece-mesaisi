// Bölüm 91 · ORTAK MAKİNE (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_091_v5.md).
// Mekanizma: "biri keser, öbürü seçer"in bölünmeyen eşyaya ve paraya taşınması (cevap arşivde kalır, kesilir).
// Logline: Defne ile Necmi'nin yarı yarıya aldığı Türk kahvesi makinesini ikisi de istiyor. Hikmet Bey: biri alır, öbürüne
// para öder; kimse kendi gözünde kazıklanmaz, internet fiyatı geçmez. Necmi: "Yazı tura atalım." Defne: "Olmaz, şansa
// bırakmam. Ben beş bin derim, sen bin dersin." İpucu (Necmi parayı çevirir): "Bence fiyatın iki yüzü olmalı."
// Akılda kalacak tek şey: fiyatı söyleyen, alacak mı satacak mı bilmezse dürüst olmak zorunda kalır.
// Sızıntı yasağı: kimse fiyat söyleyip öbürüne seçtirmez; para iki el arasında gidip gelmez; etiketler sayaçtan önce kalkar.
// Kahraman nesne: masanın ortasındaki kahve makinesi ve köpüğü kabaran cezve. Kerem bu bölümde yok.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OCAK = 'b091_ocak';
const X = { necmi: 335, hikmet: 540, defne: 742 };
const Y = { necmi: 1420, hikmet: 1480, defne: 1460 };   // Hikmet makinenin arkasında (makine çenesinin altında kalır)
const MASA = { ust: 1181, on: 1211 };
const MK = { cx: 540, yb: 1181, s: 1.32 };              // makine: taban ortası ve ölçeği
const FIN = { n: 232, d: 848 };                          // fincanlar
const PARA_MASA = [300, 1176];                           // Necmi'nin masaya bıraktığı bozuk para
// Kameralar [zoom, cx, cy]. Kart 300–509 px: saç tepeleri ≥ 540 px.
const KAM = {
  grup: [1.38, 540, 1005],
  hikmet: [1.45, 540, 990],
  insert: [1.55, 540, 990],
  necmi: [1.45, 420, 990],
  defne: [1.45, 662, 990],
  deger: [1.42, 540, 1030],
  buldum: [1.43, 700, 994],
};
// Yakın plânlarda kadraj kenarında yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  hikmet: { necmi: -330, defne: 330 },
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
  hirs: { brow: -0.02, browTilt: 0.26, eye: 0.85, pupil: 1, curve: 0.12, open: 0, w: 0.9 },
};

// ═══════════════════════════ Nesneler ═══════════════════════════
// Makinenin yerel noktası → dünya (taban ortası, ölçek MK.s, yatay kayma dx)
const mkN = (dx, [lx, ly]) => [MK.cx + dx + lx * MK.s, MK.yb + ly * MK.s];
const CEZVE = [-62, 0];   // cezvenin yerel x'i (ısıtıcı tabla üstünde, solda önde)
const DUGME = [52, -78];  // yeşil düğme (kule panelinde)
const yanSol = dx => mkN(dx, [-128, -64]), yanSag = dx => mkN(dx, [124, -70]);   // iki yanın tutuş noktaları
const ustSag = dx => mkN(dx, [78, -150]);   // kulenin üstü (Defne okşar)
// o = { dx, kopuk: 0..1 kabarma, led: 0..1 }
function makine(K, t, o = {}) {
  const { ctx } = K, dx = o.dx || 0;
  ctx.save(); ctx.translate(MK.cx + dx, MK.yb); ctx.scale(MK.s, MK.s); ctx.lineJoin = 'round';
  // gölge ve taban
  K.ell(0, 2, 150, 8, 'rgba(60,30,10,0.2)', 0);
  K.rect(-142, -30, 284, 30, '#5B3A28', LW * 0.7, 10);
  K.line(-132, -24, 132, -24, 2.5, '#7A5236');
  // kule (bakır gövde, sağda)
  K.rect(-6, -158, 132, 132, '#C8743F', LW * 0.8, 20);
  K.rect(4, -150, 16, 112, '#DE955F', 0, 8);                       // ışık şeridi (düz renk)
  K.rect(-6, -166, 132, 20, '#A85F31', LW * 0.7, 10);               // üst kapak
  // krem kontrol paneli, düğme, su göstergesi
  K.rect(20, -134, 88, 96, '#F1E6CF', LW * 0.6, 12);
  const led = o.led ?? 1;
  K.circ(DUGME[0], DUGME[1], 15, '#3E4A45', LW * 0.6);
  K.circ(DUGME[0], DUGME[1], 9, H.mixHex('#2F6B45', '#7EE08F', led), 0);
  K.rect(86, -124, 12, 70, '#FFFFFF', LW * 0.45, 5);
  K.rect(88, -96, 8, 40, '#7FB6D6', 0, 3);
  K.rect(30, -58, 46, 8, '#D8C7A6', 0, 4);
  K.poly([[36, -124], [64, -124], [60, -104], [40, -104]], '#5A3420', 0); K.rect(32, -103, 36, 4, '#5A3420', 0, 2);
  { const c2 = K.ctx; c2.beginPath(); c2.arc(66, -116, 6, -Math.PI / 2, Math.PI / 2); c2.lineWidth = 3; c2.strokeStyle = '#5A3420'; c2.stroke(); }
  // ısıtıcı tabla ve cezve (solda, önde)
  const cx = CEZVE[0];
  K.ell(cx, -32, 58, 9, '#3E4A45', LW * 0.6);
  // sap (sola uzanır)
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = 17; ctx.beginPath(); ctx.moveTo(cx - 34, -86); ctx.lineTo(cx - 98, -104); ctx.stroke();
  ctx.strokeStyle = '#5B3A28'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(cx - 36, -86); ctx.lineTo(cx - 98, -104); ctx.stroke();
  ctx.restore();
  // gövde: geniş dip, dar boyun, açılan ağız
  ctx.beginPath();
  ctx.moveTo(cx - 50, -36); ctx.quadraticCurveTo(cx - 54, -70, cx - 34, -92);
  ctx.quadraticCurveTo(cx - 38, -102, cx - 44, -108); ctx.lineTo(cx + 44, -108);
  ctx.quadraticCurveTo(cx + 38, -102, cx + 34, -92); ctx.quadraticCurveTo(cx + 54, -70, cx + 50, -36);
  ctx.closePath(); K.fs('#D07A3E', LW * 0.8);
  K.rect(cx - 38, -78, 14, 34, '#E7A06A', 0, 6);
  K.line(cx - 44, -60, cx + 44, -60, 3, '#A85F31');
  // köpük (kabarır): ağızdan taşmaya yaklaşan kubbe, kabarcıklar
  const kp = o.kopuk || 0, kh = 8 + 16 * kp;
  ctx.beginPath(); ctx.moveTo(cx - 42, -107); ctx.quadraticCurveTo(cx, -107 - 2 * kh, cx + 42, -107); ctx.closePath();
  K.fs('#C99A68', LW * 0.6);
  for (let i = 0; i < 5; i++) {
    const ph = (t * (1.1 + 0.6 * kp) + i * 0.37) % 1, bx = cx - 26 + i * 13, by = -108 - kh * (0.35 + 0.4 * Math.sin(i * 1.7) ** 2);
    K.circ(bx, by, 2.5 + 2.5 * Math.sin(Math.PI * ph), '#E9CFA6', 0);
  }
  ctx.restore();
}
// Fincan (tabaklı, beyaz, mercan bant)
function fincan(K, x) {
  const y = MASA.ust;
  K.ell(x, y - 3, 42, 8, '#FFFFFF', LW * 0.6);
  K.poly([[x - 26, y - 44], [x + 26, y - 44], [x + 20, y - 8], [x - 20, y - 8]], '#FFFFFF', LW * 0.7);
  K.rect(x - 24, y - 34, 48, 7, PAL.coral, 0, 0);
  const { ctx } = K; ctx.beginPath(); ctx.arc(x + 30, y - 28, 10, -Math.PI / 2, Math.PI / 2); ctx.lineWidth = LW * 0.7; ctx.strokeStyle = INK; ctx.stroke();
  K.ell(x, y - 44, 26, 5, '#5A3420', LW * 0.5);
}
// Telefon (yalnız insert): dik, ekranında ilan kartı (yazısız)
function telefon(K, c) {
  const [x, y] = c;
  K.rect(x - 32, y - 58, 64, 116, '#26302D', LW * 0.7, 10);
  K.rect(x - 25, y - 48, 50, 92, '#DDEBF0', 0, 4);
  K.rect(x - 19, y - 42, 38, 30, '#C8743F', 0, 4);
  for (const [yy, w] of [[-4, 36], [8, 24], [22, 30]]) K.rect(x - 19, y + yy, w, 6, '#9FB3BA', 0, 3);
}
// Bozuk para: c merkez, r yarıçap, don: dönüş açısı (yüz A "1", yüz B ay-yıldız), yatik: masada yatık
function para(K, c, { r = 34, don = 0, yatik = false } = {}) {
  const { ctx } = K, [x, y] = c;
  if (yatik) { K.ell(x, y, r, r * 0.3, '#D9B44A', LW * 0.6); K.ell(x, y - 1, r * 0.6, r * 0.17, '#C9CED0', 0); return; }
  const sx = Math.cos(don), yuzB = sx < 0, k = Math.max(0.08, Math.abs(sx));
  ctx.save(); ctx.translate(x, y); ctx.scale(k, 1);
  K.circ(0, 0, r, '#D9B44A', LW * 0.7);
  K.circ(0, 0, r * 0.66, '#C9CED0', LW * 0.5);
  if (k > 0.35) {
    if (!yuzB) K.text('1', 0, r * 0.3, r * 0.9, INK, 900);
    else {
      ctx.beginPath(); ctx.arc(-3, 0, r * 0.42, 0, TAU); ctx.arc(4, -1, r * 0.34, 0, TAU, true); ctx.fillStyle = INK; ctx.fill('evenodd');
      K.circ(r * 0.3, 0, r * 0.1, INK, 0);
    }
  }
  ctx.restore();
}

// ═══════════════════════════ Mekân: çay ocağı ═══════════════════════════
function masa(K) {
  const x0 = -600, x1 = 1900, { ctx } = K;
  K.rect(x0, MASA.ust, x1 - x0, MASA.on - MASA.ust, '#D9CDB4', LW * 0.8, 0);   // masa üstü
  K.line(x0, MASA.ust + 7, x1, MASA.ust + 7, 3, '#EEE5D2');
  K.rect(x0, MASA.on, x1 - x0, 1300, '#7A5236', LW, 0);
  // kırmızı-beyaz kareli muşamba örtü: masanın önünden sarkar (altyazı ve sayaç üstünde durur)
  const y0 = MASA.on - 2, h = 420, s = 70;
  K.rect(x0, y0, x1 - x0, h, '#F6EFE2', LW * 0.7, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, h); ctx.clip();
  ctx.fillStyle = 'rgba(200,70,55,0.55)';
  for (let x = x0; x < x1; x += 2 * s) ctx.fillRect(x, y0, s, h);
  for (let y = y0; y < y0 + h; y += 2 * s) ctx.fillRect(x0, y, x1 - x0, s);
  ctx.restore();
  K.line(x0, y0 + h, x1, y0 + h, LW * 0.7, INK);
}
// Solda raf: kahve kavanozları ve ters fincanlar
function raf(K) {
  K.rect(-160, 760, 470, 16, '#8A5C3A', LW * 0.6, 3);
  for (const [x, w, h, c] of [[-120, 56, 80, '#C8743F'], [-50, 50, 64, '#7FAE8E'], [12, 56, 86, '#C8743F']]) {
    K.rect(x, 760 - h, w, h, c, LW * 0.6, 8); K.rect(x - 4, 760 - h - 12, w + 8, 14, '#5B3A28', LW * 0.5, 4);
  }
  for (const x of [110, 170, 230]) { K.poly([[x - 22, 760], [x + 22, 760], [x + 16, 726], [x - 16, 726]], '#FFFFFF', LW * 0.6); K.rect(x - 20, 744, 40, 6, PAL.coral, 0, 0); }
}
M.mekanEkle(OCAK, {
  gen: [-600, 1900], dongu: ['cezvede kabaran köpük ve buhar', 'yanıp sönen düğme', 'duvar saati'],
  kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'cizgili', zemin: 'karo' });
    raf(K);
    M.duvarSaati(K, 850, 770, 50, 15.2 + t / 60, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), defne: T('h1:0'), gidiyor: T('h1:3'), makineyi: T('h1:4'), ikiniz: T('h1:5'), h1s: T('h1>'),
    h2: T('h2'), biri: T('h2:0'), oburune: T('h2:2'), para: T('h2:3'), kimse: T('h2:5'), kendi: T('h2:6'), kazik: T('h2:8'), internet: T('h2:9'), gecmez: T('h2:11'), h2s: T('h2>'),
    n0: T('n0'), yazi: T('n0:0'), atalim: T('n0:2'), kazanan: T('n0:3'), degerinin: T('n0:5'), n0s: T('n0>'),
    d2: T('d2'), sansa: T('d2:1'), ben: T('d2:3'), bes: T('d2:4'), sen: T('d2:7'), bin2: T('d2:8'), nasil: T('d2:10'), d2s: T('d2>'),
    n1: T('n1'), n1s: T('n1>'),
  };
  tm.hikKes = tm.h2 - 0.1; tm.insKes = tm.kimse - 0.12; tm.necKes = tm.n0 - 0.12; tm.defKes = tm.d2 - 0.12; tm.degKes = tm.ben - 0.1;
  tm.sayac = Math.min(cd0 - 0.05, tm.d2s);
  tm.tel = tm.internet - 0.1; tm.telIn = tm.gecmez + 0.02;        // telefon kalkar; Hikmet'in avucu indirir
  tm.paraAl = tm.yazi - 0.3; tm.at = tm.atalim - 0.05;             // Necmi parayı çıkarır, havaya atar (0,62 sn uçuş)
  tm.paraBirak = tm.kazanan + 0.6;                                  // parayı fincanının yanına bırakır
  tm.dug = cd0 + 4.4;                                               // sayaç: Hikmet düğmeye basar, köpük kabarır
  tm.nAl = cd0 + 0.5; tm.nBirak = cd0 + 3.0;                       // sayaç: Necmi parayı alıp bakar, bırakır
  tm.keser = T('n1:3'); tm.secer = T('n1:5');                        // ipucu: Necmi makineye bakar, "keser"de eliyle havada keser
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.hikKes - 0.1, 1.40, 540, 1001]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.insKes - 0.1, 1.47, 541, 987]] },
    { id: 'insert', t0: tm.insKes, cam: [[0, ...KAM.insert], [tm.necKes - 0.1, 1.58, 540, 988]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.defKes - 0.1, 1.47, 424, 987]] },
    { id: 'defne', t0: tm.defKes, kisa: true, cam: [[0, ...KAM.defne], [tm.degKes - 0.05, 1.46, 660, 989]] },
    { id: 'deger', t0: tm.degKes, cam: [[0, ...KAM.deger], [tm.sayac - 0.1, 1.44, 540, 1027]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // sayaç ve ipucu: doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.33, 548, 1018]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // n1 balonu kesime kadar okunur; d2 balonu sayaç kesmesinden 0,3 sn önce söner; h1 balonu kesmeden önce söner
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').flatMap(l => l.id === 'd2' ? [{ ...l, t1: Math.min(l.t1, tm.sayac - 0.3) }] : l.id === 'h1' ? [{ ...l, t1: Math.min(l.t1, tm.hikKes - 0.3) }] : l.id === 'h2' ? h2Bol(l) : [l]) };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// h2 üç balona bölünür (her balon büyük harfle başlayan tam cümle, en çok iki satır)
function h2Bol(l) {
  const tx = l.text.split(' '), parca = (a, b, id) => ({ ...l, id, text: tx.slice(a, b).join(' '), words: l.words.slice(a, b), t0: l.words[a].t0, t1: b < tx.length ? l.words[b].t0 - 0.06 : l.t1 });
  return [parca(0, 5, 'h2a'), parca(5, 9, 'h2b'), parca(9, 12, 'h2c')];
}

// ═══════════════════════════ Zaman durumları ═══════════════════════════
// Makinenin çekiştirme kayması (kanca): Necmi sola, Defne sağa çeker; h1 sonunda ortada durur
function mkDx(tm, t) {
  if (t > tm.h1s + 0.6) return 0;
  return 11 * H.sars(t, 0.02, 0.75, 7) + 8 * H.sars(t, 1.55, 0.6, 7) + H.iz([[0, 0], [tm.makineyi, -14, 0.28], [tm.ikiniz, 14, 0.28], [tm.h1s - 0.1, 0, 0.4]], t);
}
// Köpük kabarması: sürekli hafif nefes + sayaçta düğmeyle kabarma
function kopukAt(tm, t) {
  const nefes = 0.25 + 0.15 * Math.sin(TAU * t / 2.4);
  return clamp01(nefes + 0.7 * pIn(t, tm.dug + 0.3, tm.dug + 3.4, 0.9, 0.8));
}
// Necmi'nin parası: { p, don, yatik, kim }
function paraAt(tm, t) {
  const EL = [425, 1012];
  if (t < tm.paraAl) return null;
  if (t < tm.at) { const u = ease.enter(seg(t, tm.paraAl, 0.35)); return { p: kar([430, 1200], EL, u), don: 0, kim: 'necmi' }; }
  if (t < tm.at + 0.62) {   // yazı tura: yükselir, döner, ele düşer (sekme yok)
    const u = (t - tm.at) / 0.62, h = 4 * u * (1 - u);
    return { p: [EL[0], EL[1] - 120 * h], don: TAU * 3 * u, kim: 'hava', r: 28 };
  }
  if (t < tm.paraBirak) return { p: EL, don: 0, kim: 'necmi' };
  if (t < tm.paraBirak + 0.5) { const u = ease.state(seg(t, tm.paraBirak, 0.5)); return { p: H.yay(EL, [PARA_MASA[0], PARA_MASA[1] - 12], u, 50), don: 0, kim: 'necmi' }; }
  // sayaç: alır, bakar (çevirir), bırakır
  const EL2 = [430, 1050];
  if (t >= tm.nAl && t < tm.nBirak + 0.5) {
    const u = ease.enter(seg(t, tm.nAl, 0.4)), d = ease.state(seg(t, tm.nBirak, 0.5));
    return { p: kar(kar([PARA_MASA[0], PARA_MASA[1] - 12], EL2, u), [PARA_MASA[0], PARA_MASA[1] - 12], d), don: Math.PI * ease.state(seg(t, tm.nAl + 1.1, 0.5)) + Math.PI * ease.state(seg(t, tm.nAl + 1.9, 0.5)), kim: 'necmi' };
  }
  return { p: PARA_MASA, yatik: true, kim: 'masa' };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç ve ipucu: doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.buldum - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.38), Math.log(1.45), u)), cx: lerp(540, 538, u), cy: lerp(1005, 1000, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    const YA = YA0;
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (YA - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    // iki gözdeki değer: Defne "beş bin", Necmi "bin" (sayaç kesmesinden önce kalkar)
    if (B.sc.id === 'deger') {
      H.tag(K, t, tm.bes - 0.04, tm.sayac - 0.25, B.ekr([735, 1112]), '5.000 TL', PAL.mustard, INK, 50);
      H.tag(K, t, tm.bin2 - 0.04, tm.sayac - 0.25, B.ekr([345, 1112]), '1.000 TL', PAL.mustard, INK, 50);
    }
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: YA, split: { h1: 4, n0: 3, d2: 3, d4: 7 } });
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
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.sayac && t < tm.buldum;
  const ipucu = t >= tm.n1 - 0.8 && t < tm.buldum;
  const dx = mkDx(tm, t);
  const CZ = mkN(dx, [CEZVE[0], -112]);           // cezvenin ağzı
  const HEAD = k => [yer(k), Y[k] - 600];
  const pr = paraAt(tm, t);
  const led = 0.55 + 0.45 * Math.cos(TAU * t / 1.6);

  // ——— Hikmet (ortada, makinenin arkasında) ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads };
  hp.head.look = t < tm.gidiyor ? bak('hikmet', hp, HEAD('defne')) : t < tm.makineyi ? bak('hikmet', hp, CZ) : bak('hikmet', hp, t < tm.ikiniz + 0.3 ? HEAD('necmi') : HEAD('defne'));
  // h1 "ikiniz de istiyorsunuz": iki avuç iki yana açılır (ikisini gösterir)
  const wIki = pIn(t, tm.ikiniz - 0.3, tm.hikKes - 0.4, 0.28, 0.3);
  // (iki yana açılan eller kolsuz yüzüyor ve Necmi'nin, Defne'nin yüzüne biniyordu: yalnız bakış)
  // hikmet plânı: "Biri" tek parmak başın yanında; "öbürüne para öder" avuç soldan sağa geçer
  const wBir = pIn(t, tm.biri - 0.28, tm.oburune - 0.05, 0.28, 0.25);
  if (wBir > 0.01) hO.R = [H.elYeri('hikmet', hp, 'R', 'yukari').map((v, i) => v + [-14, 34][i]), wBir, 'B'];
  const wPara = pIn(t, tm.oburune - 0.1, tm.kimse - 0.2, 0.28, 0.3);
  if (wPara > 0.01) hO.R = [[lerp(470, 640, ease.state(seg(t, tm.oburune + 0.1, 0.8))), 1006], wPara, 'A'];
  if (t >= tm.h2 && t < tm.n0) { hp.expr = IF.ciddi; hp.head.look = t < tm.kimse ? [0.04, 0.05] : t < tm.kazik ? bak('hikmet', hp, HEAD('defne')) : t < tm.internet - 0.1 ? bak('hikmet', hp, HEAD('necmi')) : bak('hikmet', hp, CZ); }
  // insert "kendi gözünde": sol el başın yanında, parmak gözünü gösterir; "geçmez": sağ avuç telefonu indirir
  const wGoz = pIn(t, tm.kendi - 0.28, tm.internet - 0.2, 0.28, 0.3);
  // "kendi": sağ el Defne'yi, "kazıklanmaz": sol el Necmi'yi gösterir (her biri kendi gözünde); eller göğüs hizasında, yüzlere binmez
  if (wGoz > 0.01) hO.R = [mkN(dx, [70, -162]), wGoz, 'A'];
  
  
  const telU = ease.enter(seg(t, tm.tel, 0.35)) * (1 - ease.state(seg(t, tm.telIn + 0.1, 0.45)));
  const TEL = [lerp(380, 410, telU), lerp(1160, 1012, telU)];
  const wBas = pIn(t, tm.gecmez - 0.3, tm.n0 - 0.15, 0.28, 0.25);
  if (wBas > 0.01) hO.R = [[TEL[0] + 30, TEL[1] - 62], wBas, 'A'];
  if (t >= tm.internet - 0.1 && t < tm.n0) hp.head.look = bak('hikmet', hp, TEL);
  if (t >= tm.n0 && t < tm.sayac) { hp.head.look = bak('hikmet', hp, t < tm.d2 ? HEAD('necmi') : HEAD('defne')); hp.expr = IF.notr; }
  if (t >= tm.at && t < tm.at + 0.7) hp.head.look = bak('hikmet', hp, pr ? pr.p : CZ);
  // sayaç: düğmeye basar, köpüğe bakar; bakışı ikisi arasında gezinir
  let hDug = 0;
  if (sayacta) {
    const c0 = tm.cd0; hp.expr = IF.dusun;
    const j = Math.floor((t - c0) / 1.8) % 2; hp.head.look = bak('hikmet', hp, HEAD(j ? 'defne' : 'necmi'));
    hDug = pIn(t, tm.dug - 0.3, tm.dug + 0.5, 0.28, 0.3);
    if (hDug > 0.01) hO.R = [mkN(dx, DUGME), hDug, 'A'];
    if (t >= tm.dug - 0.4 && t < tm.dug + 2.6) { hp.head.look = bak('hikmet', hp, CZ); hp.expr = IF.merak; }
    if (ipucu) { hp.expr = IF.merak; hp.head.look = bak('hikmet', hp, HEAD('necmi')); }
  }
  if (id === 'cevap') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Necmi (solda) ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, expr: IF.hirs, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads };
  const cek = pIn(t, 0.02, 0.85, 0.18, 0.35) + pIn(t, 1.55, 2.25, 0.18, 0.35);   // kanca: ikisi aynı anda kendine çeker (gövde 12 px geriye)
  np.x -= 12 * cek;
  np.head.look = t < tm.h1s ? bak('necmi', np, CZ) : bak('necmi', np, HEAD('hikmet'));
  // kanca: sağ el makinenin sol yanında (çekiştirir), h1 sonunda bırakır
  const wTut = 1 - W(t, tm.hikKes - 0.45, 0.3);
  if (wTut > 0.01 && t < tm.hikKes) nO.R = [yanSol(dx), wTut, 'A'];
  // insert "internet": telefonu kaldırır, avuç inince indirir
  const wTel = pIn(t, tm.tel - 0.28, tm.telIn + 0.55, 0.28, 0.25);
  if (wTel > 0.01) { nO.R = [[TEL[0] - 6, TEL[1] + 40], wTel, 'A']; np.head.look = bak('necmi', np, TEL); np.expr = IF.emin; }
  if (t >= tm.telIn && t < tm.n0) np.expr = IF.supheli;
  // n0: parayı çıkarır, havaya atar, tutar; "kazanan alır" makineyi gösterir; parayı fincanının yanına bırakır
  let nIsaret = null;
  if (t >= tm.necKes && t < tm.d2) {
    np.expr = IF.emin;
    const wPr = pIn(t, tm.paraAl - 0.2, tm.paraBirak + 0.5, 0.25, 0.25);
    if (pr && wPr > 0.01) nO.R = [pr.kim === 'hava' ? [425, 1012] : [pr.p[0] + 4, pr.p[1] + (pr.p[1] > 1120 ? -18 : 24)], wPr, 'A'];
    np.head.look = pr && t < tm.kazanan ? bak('necmi', np, pr.p) : bak('necmi', np, CZ);
    const wGos = pIn(t, tm.paraBirak + 0.45, tm.n0s + 0.1, 0.25, 0.25);
    if (wGos > 0.01) { nO.R = [[410, 1060], wGos, 'A']; if (wGos > 0.6) nIsaret = mkN(dx, [-40, -80]); }
  }
  if (t >= tm.d2 && t < tm.sayac) { np.expr = IF.merak; np.head.look = bak('necmi', np, HEAD('defne')); }
  // sayaç: parayı alır, çevirip bakar, bırakır; sonra eli çenede; köpüğe bakar
  let nPr = 0, nYan = 0, nKes = 0;
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.dusun;
    nPr = pIn(t, tm.nAl - 0.25, tm.nBirak + 0.55, 0.25, 0.25);
    if (pr && nPr > 0.01 && t < tm.nBirak + 0.6) { nO.R = [[pr.p[0] + 4, pr.p[1] + (pr.p[1] > 1120 ? -18 : 24)], nPr, 'A']; np.head.look = bak('necmi', np, pr.p); }
    nYan = pIn(t, c0 + 3.75, tm.dug + 2.4, 0.3, 0.35);   // iki el yeniden makinede: ikisi de istiyor
    if (nYan > 0.01) { nO.R = [yanSol(dx), nYan, 'A']; if (t < tm.dug - 0.2) { np.head.look = bak('necmi', np, HEAD('defne')); np.expr = IF.supheli; } }
    if (t >= tm.dug - 0.2 && t < tm.dug + 2.6) { np.head.look = bak('necmi', np, CZ); np.expr = IF.merak; }
    if (t >= tm.dug + 2.6) np.head.look = Math.floor((t - tm.dug - 2.6) / 1.3) % 2 ? bak('necmi', np, HEAD('defne')) : bak('necmi', np, HEAD('hikmet'));
    if (ipucu) {
      np.expr = IF.emin; np.head.look = bak('necmi', np, CZ);
      nKes = pIn(t, tm.n1 - 0.25, tm.n1s + 0.25, 0.28, 0.3);
      if (nKes > 0.01) nO.R = [[405, 1025 + 36 * H.nabiz(t, tm.keser - 0.04, 0.32)], nKes, 'A'];   // eli bıçak gibi bir kez iner
    }
  }
  if (id === 'cevap') np.head.look = bak('necmi', np, HEAD('defne'));

  // ——— Defne (sağda) ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, expr: IF.hirs, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  dp.x += 12 * cek;
  dp.head.look = t < tm.gidiyor ? bak('defne', dp, HEAD('hikmet')) : t < tm.h1s ? bak('defne', dp, CZ) : bak('defne', dp, HEAD('hikmet'));
  const wDT = 1 - W(t, tm.hikKes - 0.45, 0.3);
  if (wDT > 0.01 && t < tm.hikKes) dO.L = [yanSag(dx), wDT, 'A'];
  if (t >= tm.tel && t < tm.n0) { dp.expr = IF.supheli; dp.head.look = bak('defne', dp, TEL); }
  if (t >= tm.n0 && t < tm.d2) { dp.expr = IF.supheli; dp.head.look = bak('defne', dp, pr ? pr.p : HEAD('necmi')); }
  // d2: "Olmaz, şansa bırakmam" parmak sallar; "Ben beş bin" eli makinenin üstünde; "sen bin" Necmi'yi gösterir; soru: omuz silker
  let dParmakSal = 0, dUst = 0, dGos = 0;
  if (t >= tm.defKes && t < tm.sayac + 0.3) {
    dp.expr = IF.ciddi;
    dParmakSal = pIn(t, tm.d2 - 0.2, tm.ben - 0.15, 0.25, 0.25);
    if (dParmakSal > 0.01) dO.R = [H.elYeri('defne', dp, 'R', 'yukari').map((v, i) => v + [20, 40][i]), dParmakSal, 'B'];
    dUst = pIn(t, tm.ben - 0.2, tm.sen - 0.1, 0.25, 0.25);
    if (dUst > 0.01) dO.L = [ustSag(dx), dUst, 'A'];
    dGos = pIn(t, tm.sen - 0.15, tm.nasil - 0.05, 0.25, 0.25);
    if (dGos > 0.01) dO.L = [[600, 1030], dGos, 'A'];
    dp.head.look = t < tm.ben ? bak('defne', dp, HEAD('necmi')) : t < tm.sen ? bak('defne', dp, ustSag(dx)) : bak('defne', dp, HEAD('necmi'));
    if (t >= tm.nasil - 0.05) { H.omuzSilk(dp, t, tm.nasil, Math.max(0.2, tm.d2s - tm.nasil - 0.25)); dp.head.look = [0, 0]; }
  }
  // sayaç: makinenin üstünü okşar, sonra parmak yanakta; köpüğe bakar
  let dParmak = false, dOks = 0, dYan = 0;
  if (sayacta) {
    const c0 = tm.cd0; dp.expr = IF.dusun;
    dOks = pIn(t, c0 + 0.4, c0 + 2.9, 0.3);
    if (dOks > 0.01) { const u = ustSag(dx); dO.L = [[u[0] - 16 + 26 * Math.sin(TAU * (t - c0) / 1.1), u[1] + 4], dOks, 'A']; dp.head.look = bak('defne', dp, u); dp.expr = IF.keyif; }
    dYan = pIn(t, c0 + 3.2, tm.dug + 2.6, 0.3, 0.35);
    if (dYan > 0.01) { dO.L = [yanSag(dx), dYan, 'A']; if (t < tm.dug - 0.2) { dp.head.look = bak('defne', dp, HEAD('necmi')); dp.expr = IF.supheli; } }
    if (t >= tm.dug - 0.2 && t < tm.dug + 2.6) { dp.head.look = bak('defne', dp, CZ); dp.expr = IF.merak; }
    if (t >= tm.dug + 2.6) dp.head.look = bak('defne', dp, HEAD('hikmet'));
    if (ipucu) { dp.expr = IF.merak; dp.head.look = bak('defne', dp, HEAD('necmi')); }
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; dO.L = [ustSag(0), W(t, tm.cevap, 0.3), 'A']; }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Çizim: karakterler → telefon (masanın arkasından çıkar) → masa → fincanlar → makine → buhar → para → tutan eller ———
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  if (telU > 0.01) telefon(K, TEL);
  masa(K);
  fincan(K, FIN.n); fincan(K, FIN.d);
  H.buhar(K, FIN.n, 1128, t, { k: 0.6, n: 1, periyot: 2.6 });
  H.buhar(K, FIN.d, 1128, t + 1.1, { k: 0.6, n: 1, periyot: 2.8 });
  makine(K, t, { dx, kopuk: kopukAt(tm, t), led: hDug > 0.5 ? 1 : led });
  H.buhar(K, CZ[0], CZ[1] - 30, t, { k: 1.1 + 0.4 * kopukAt(tm, t), n: 2, periyot: 2.0 });
  if (pr) para(K, pr.p, { yatik: !!pr.yatik, don: pr.don || 0, r: pr.r || 34 });
  // tutan eller (nesnenin üstünde)
  if (wTut > 0.4 && t < tm.hikKes) nc.tut('R');
  if (wDT > 0.4 && t < tm.hikKes) dc.tut('L');
  
  if (wBir > 0.6) hc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2, boy: 1 });
  if (wPara > 0.5) hc.tut('R');
  if (wGoz > 0.5) hc.tut('R');
  if (wTel > 0.5 && telU > 0.05) nc.tut('R');
  if (wBas > 0.5) hc.tut('R');
  if (hDug > 0.5) hc.isaret('R', mkN(dx, DUGME));
  if (pr && pr.kim === 'necmi' && t >= tm.paraAl && t < tm.paraBirak + 0.5) nc.tut('R');
  if (nIsaret) nc.isaret('R', nIsaret);
  if (pr && pr.kim === 'necmi' && sayacta && nPr > 0.5) nc.tut('R');
  if (nKes > 0.6) nc.parmak('R', 4, { toplam: 4, yon: -0.25, ac: 0.12, boy: 0.8 });   // yan duran el: bıçak gibi
  if (dParmakSal > 0.6) dc.parmak('R', 4, { toplam: 4, yon: -Math.PI / 2 + 0.18 * Math.sin(TAU * (t - tm.d2) / 0.42), ac: 0.55, boy: 0.85 });
  if (dUst > 0.5 || dOks > 0.5 || dYan > 0.4) dc.tut('L');
  if (nYan > 0.4) nc.tut('R');
  if (dGos > 0.6) dc.isaret('L', [470, 1040]);
  if (dParmak) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (id === 'cevap') dc.tut('L');
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
