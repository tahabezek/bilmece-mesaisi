// Bölüm 94 · ÇAY DOLABININ KİLİDİ (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_094_v5.md).
// Mekanizma: açık yöntem + sayı. Kilidin yalnız üç tuşu var (1, 2, 3), şifre iki haneli (dokuz şifre), onay tuşu yok;
// kilit başta boş, her basışta son iki tuşa bakar, yanlışta kilitlenmez. Cevap (arşivde, kesilir) söylenmez, gösterilmez.
// Logline: Misafir geliyor, çay dolabı kilitli, Hikmet şifreyi unuttu. Necmi: "Dokuz şifre, her biri iki tuş: on sekiz basış."
// Defne: "Olmaz, daha azıyla açarız." (nedenini söylemez.) İpucu yalnız eylem: sayaçta Hikmet "1"e basar (ekran "–1"),
// Kerem "2" ve "3"e basar; kilidin küçük ekranında son iki rakam bir sola kayar: "12", sonra "23".
// Akılda kalacak tek şey: kilit her basışta yeniden bakar.
// Sızıntı yasağı: ekranda 10 haneli dizi yok, "10" yok (sayaç 9'dan sayar), "on tuş" yok; tuş dizisi gösterilmez.
// Kerem konuşmaz: bakar, tuşlara basar.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OCAK = 'b094_ocak';
// Kerem önde solda (tuşlara yandan uzanır), Hikmet ve Defne dolabın arkasında (kolları dolabın üstünden uzanır), Necmi önde sağda
const X = { genc: 255, hikmet: 455, defne: 650, necmi: 830 };
const Y = { genc: 1500, hikmet: 1480, defne: 1420, necmi: 1500 };   // Defne'nin ayağı dolabın arkasında (başlar hizalı)
const DOLAP = { x0: 370, x1: 710, ust: 1040, alt: 1500 };
const PANEL = { x0: 386, x1: 700, y0: 1066, y1: 1156 };
const LCD = { x0: 570, x1: 688, y0: 1078, y1: 1144 };
const SLOT = [601, 657];                                // ekrandaki iki hane (orta x)
const TUS = { 1: [424, 1112], 2: [476, 1112], 3: [528, 1112] };
const TW = 46, TH = 58;
const KULP = [401, 1222];
// Kameralar [zoom, cx, cy]. Kart 300–509 px; tuş ve ekranın alt kenarı ≤ 1216 px (altyazı 1240'ta başlar); zemin ≤ %15
const KAM = {
  grup: [1.3, 540, 990],
  insert: [1.5, 530, 1002],
  hikmet: [1.5, 500, 1000],
  necmi: [1.5, 720, 1015],
  defne: [1.5, 680, 992],
};
// Yakın plânlarda kenarda yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  insert: { genc: -330, necmi: 330 },
  hikmet: { necmi: 330, genc: -330, defne: 480 },
  necmi: { genc: -330, hikmet: -330 },
  defne: { genc: -330, hikmet: -330 },
  buldum: { genc: -330 },
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  telas: { brow: 0.12, browTilt: -0.3, eye: 1.08, pupil: 0.9, curve: -0.12, open: 0, w: 0.85 },
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.24, open: 0, w: 0.9 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};
function hayir(p, t, t0, d = 0.6) {
  const u = (t - t0) / d; if (u <= 0 || u >= 1) return p;
  const env = Math.min(1, u / 0.15, (1 - u) / 0.15), s = Math.sin(TAU * 1.5 * u);
  p.head = { ...p.head, look: [0.5 * s * env, p.head.look?.[1] || 0], tilt: (p.head.tilt || 0) + 7 * s * env };
  return p;
}

// ═══════════════════════════ Kilit durumu ═══════════════════════════
// Basışlar [an, rakam]. Ekran son iki rakamı gösterir; her basışta haneler bir sola kayar (0,18 sn).
function ekranAt(basis, t) {
  let hane = ['–', '–'], kay = 1, son = -1;
  for (let i = 0; i < basis.length; i++) if (t >= basis[i][0]) { son = i; }
  if (son < 0) return { onceki: hane, simdi: hane, u: 1 };
  const dizi = ['–', '–', ...basis.slice(0, son + 1).map(b => b[1])];
  const simdi = dizi.slice(-2), onceki = dizi.slice(-3, -1);
  kay = ease.state(seg(t, basis[son][0], 0.18));
  return { onceki, simdi, u: kay, yeni: dizi[dizi.length - 1], eski: dizi[dizi.length - 3] };
}
// Tuş: d = basılma (0..1), vurgu = gösterme halkası (0..1)
function tus(K, n, d = 0, vurgu = 0) {
  const [x, y] = TUS[n], dy = 4 * d;
  K.rect(x - TW / 2 + 3, y - TH / 2 + 6, TW, TH, '#3E2A1C', 0, 9);
  K.rect(x - TW / 2, y - TH / 2 + dy, TW, TH, H.mixHex('#F1E7D2', '#C9BBA0', d), LW * 0.6, 9);
  K.text(String(n), x, y + 15 + dy, 42, INK, 900);
  if (vurgu > 0.01) {
    const { ctx } = K; ctx.save(); ctx.globalAlpha = vurgu; ctx.lineWidth = 6; ctx.strokeStyle = PAL.mustard;
    ctx.beginPath(); ctx.roundRect(x - TW / 2 - 7, y - TH / 2 - 7, TW + 14, TH + 14, 13); ctx.stroke(); ctx.restore();
  }
}
function kilit(K, t, o) {
  const { ctx } = K;
  // pirinç levha
  K.rect(PANEL.x0 + 5, PANEL.y0 + 7, PANEL.x1 - PANEL.x0, PANEL.y1 - PANEL.y0, 'rgba(40,25,10,0.3)', 0, 12);
  K.rect(PANEL.x0, PANEL.y0, PANEL.x1 - PANEL.x0, PANEL.y1 - PANEL.y0, '#C9A04F', LW * 0.7, 12);
  K.line(PANEL.x0 + 12, PANEL.y0 + 7, PANEL.x1 - 12, PANEL.y0 + 7, 2.5, '#E3C27A');
  for (const [x, y] of [[PANEL.x0 + 9, PANEL.y0 + 45], [PANEL.x1 - 9, PANEL.y0 + 45]]) K.circ(x, y, 3, '#7A5A22', 0);
  // küçük ekran
  K.rect(LCD.x0, LCD.y0, LCD.x1 - LCD.x0, LCD.y1 - LCD.y0, '#AFC39A', LW * 0.6, 7);
  ctx.save(); ctx.beginPath(); ctx.rect(LCD.x0 + 3, LCD.y0 + 3, LCD.x1 - LCD.x0 - 6, LCD.y1 - LCD.y0 - 6); ctx.clip();
  const e = o.ekran, by = LCD.y1 - 13, sz = 56, step = SLOT[1] - SLOT[0];
  const col = s => s === '–' ? '#6F8462' : '#1F2A1C';
  if (e.u >= 1 || !e.yeni) {
    e.simdi.forEach((s, i) => K.text(s, SLOT[i], by, sz, col(s), 900));
  } else {
    const dx = -step * e.u;
    K.text(e.eski, SLOT[0] + dx, by, sz, col(e.eski), 900);              // soldaki hane dışarı kayar
    K.text(e.onceki[1], SLOT[1] + dx, by, sz, col(e.onceki[1]), 900);   // sağdaki sola geçer
    K.text(e.yeni, SLOT[1] + step + dx, by, sz, col(e.yeni), 900);      // yeni hane sağdan girer
  }
  ctx.restore();
  // iki hane vurgusu ("iki haneli", "son iki tuş")
  if (o.hane > 0.01) {
    ctx.save(); ctx.globalAlpha = o.hane; ctx.lineWidth = 6; ctx.strokeStyle = PAL.mustard;
    ctx.beginPath(); ctx.roundRect(LCD.x0 - 8, LCD.y0 - 8, LCD.x1 - LCD.x0 + 16, LCD.y1 - LCD.y0 + 16, 12); ctx.stroke(); ctx.restore();
  }
  for (const n of [1, 2, 3]) tus(K, n, o.bas[n] || 0, o.vurgu[n] || 0);
}

// ═══════════════════════════ Mekân: çay ocağı ═══════════════════════════
function dolap(K, t, o) {
  const { x0, x1, ust, alt } = DOLAP, { ctx } = K;
  const sx = o.sars || 0;
  K.rect(x0, ust + 18, x1 - x0, alt - ust - 18, '#9A6A43', LW * 0.8, 4);           // gövde
  K.rect(x0 - 14, ust, x1 - x0 + 28, 22, '#7B5133', LW * 0.8, 5);                   // tezgah tablası
  K.line(x0 - 8, ust + 5, x1 + 8, ust + 5, 2.5, '#9E7150');
  K.rect(x0 + 4, alt - 34, x1 - x0 - 8, 30, '#6E4A2E', LW * 0.6, 3);                // süpürgelik
  ctx.save(); ctx.translate(sx, 0);
  K.rect(x0 + 14, ust + 28, x1 - x0 - 28, alt - ust - 72, '#B07B4E', LW * 0.7, 6);  // kapak
  // camlı bölme: içinde çay paketleri, şeker kavanozu, bardaklar
  const gx0 = x0 + 34, gx1 = x1 - 34, gy0 = 1180, gy1 = 1420;
  K.rect(gx0, gy0, gx1 - gx0, gy1 - gy0, '#4D3A2C', LW * 0.6, 5);
  K.line(gx0 + 4, 1300, gx1 - 4, 1300, 6, '#8C6440');
  for (const [x, w, h, c] of [[gx0 + 16, 58, 92, '#D2483A'], [gx0 + 80, 58, 92, '#D2483A'], [gx0 + 150, 50, 78, '#E2A13A']]) {
    K.rect(x, 1297 - h, w, h, c, LW * 0.5, 4); K.rect(x + 8, 1297 - h + 18, w - 16, 22, '#F3E6C8', 0, 3);
  }
  K.rect(gx1 - 66, 1222, 50, 75, '#DCE7E4', LW * 0.5, 10); K.rect(gx1 - 62, 1262, 42, 32, '#F7F4EC', 0, 6);   // şeker kavanozu
  for (let i = 0; i < 5; i++) { const x = gx0 + 26 + i * 48; K.poly([[x - 14, 1338], [x + 14, 1338], [x + 10, 1396], [x - 10, 1396]], '#E7EEEC', LW * 0.45); }
  ctx.globalAlpha = 0.18; K.poly([[gx0 + 20, gy0 + 6], [gx0 + 70, gy0 + 6], [gx0 + 10, gy1 - 6], [gx0 - 40 + 30, gy1 - 6]], '#FFFFFF', 0); ctx.globalAlpha = 1;
  // kulp
  K.rect(KULP[0] - 8, KULP[1] - 38, 16, 76, '#3B3B38', LW * 0.5, 7);
  ctx.restore();
}
// Dolabın üstünde boş bardaklı tepsi (çay bitti)
function tepsi(K) {
  K.ell(543, 1036, 64, 9, '#B9BEC0', LW * 0.5);
  for (const x of [512, 543, 574]) { K.poly([[x - 10, 1034], [x + 10, 1034], [x + 8, 994], [x - 8, 994]], '#EEF3F2', LW * 0.45); K.ell(x, 1035, 13, 4, '#D5DBDA', 2); }
}
// Necmi'nin elindeki son çay (buharlı)
function bardak(K, [x, y]) {
  K.poly([[x - 16, y - 34], [x + 16, y - 34], [x + 12, y + 30], [x - 12, y + 30]], '#F1F6F5', LW * 0.5);
  K.poly([[x - 14, y - 22], [x + 14, y - 22], [x + 11, y + 28], [x - 11, y + 28]], '#B5532A', 0);
  K.ell(x, y + 34, 26, 7, '#F4F1EA', LW * 0.45);
}
function raf(K) {
  K.rect(60, 742, 1000, 16, '#8A5C3A', LW * 0.6, 3);
  for (const [x, c] of [[110, '#E7EEEC'], [160, '#E7EEEC'], [210, '#E7EEEC'], [880, '#E7EEEC'], [930, '#E7EEEC'], [980, '#E7EEEC']])
    K.poly([[x - 13, 742], [x + 13, 742], [x + 10, 690], [x - 10, 690]], c, LW * 0.45);
  K.rect(560, 672, 60, 70, '#D2483A', LW * 0.5, 6); K.rect(626, 690, 52, 52, '#E2A13A', LW * 0.5, 6);
  K.rect(410, 682, 70, 60, '#7FAE8E', LW * 0.5, 8);
}
M.mekanEkle(OCAK, {
  gen: [-600, 1900], dongu: ['duvar saatinin saniye ibresi', 'Necmi\'nin çayından yükselen buhar'],
  kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'fayans', zemin: 'karo' });
    raf(K);
    M.duvarSaati(K, 200, 822, 46, 16.75 + t / 60, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    h1: T('h1'), dolap: T('h1:2'), kilitli: T('h1:3'), sifreyi: T('h1:5'), h1s: T('h1>'),
    h2: T('h2'), uc: T('h2:1'), bir: T('h2:4'), iki: T('h2:5'), ucT: T('h2:6'), sifre: T('h2:7'), haneli: T('h2:9'), ayni: T('h2:10'), kez: T('h2:13'), h2s: T('h2>'),
    h3: T('h3'), onay: T('h3:0'), yok: T('h3:2'), kilit: T('h3:3'), son: T('h3:4'), bakar: T('h3:7'), yanlista: T('h3:8'), h3s: T('h3>'),
    n0: T('n0'), dokuz: T('n0:0'), ikiN: T('n0:4'), on: T('n0:6'), basis: T('n0:8'), n0s: T('n0>'),
    d2: T('d2'), olmaz: T('d2:0'), daha: T('d2:1'), en: T('d2:4'), kac: T('d2:6'), d2s: T('d2>'),
  };
  tm.insKes = tm.h2 - 0.1; tm.hikKes = tm.h3 - 0.1; tm.necKes = tm.n0 - 0.1; tm.defKes = tm.d2 - 0.1; tm.sayac = Math.min(cd0 - 0.05, tm.d2s);
  // sayaç: Hikmet "1"e basar; Kerem "2" ve "3"e basar (ipucu, söz yok)
  tm.b1 = cd0 + 1.5; tm.b2 = cd0 + 4.2; tm.b3 = cd0 + 6.6;   // üçüne de Kerem basar
  const basis = [[tm.b1, '1'], [tm.b2, '2'], [tm.b3, '3']];
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.insKes - 0.1, 1.32, 540, 994]] },
    { id: 'insert', t0: tm.insKes, cam: [[0, ...KAM.insert], [tm.hikKes - 0.1, 1.52, 530, 1000]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.necKes - 0.1, 1.52, 502, 999]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.defKes - 0.1, 1.52, 718, 1013]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.sayac - 0.1, 1.52, 678, 990]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.defne]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.33, 540, 994]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // balonlar kesmeden 0,3 sn önce söner (kesmede üst üste binen metin yok)
  const kes = { h1: tm.insKes, h2: tm.hikKes, h3: tm.necKes, n0: tm.defKes, d2: tm.sayac };
  const tlS = { ...tl, lines: tl.lines.map(l => kes[l.id] ? { ...l, t1: Math.min(l.t1, kes[l.id] - 0.3) } : l) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlA, basis };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç: kilide doğru doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.buldum - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.3), Math.log(1.36), u)), cx: lerp(540, 534, u), cy: lerp(990, 1000, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    const YA = YA0;
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (YA - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    // Necmi'nin hesabı (yalnız Necmi yakın plânında; yüzlerden ≥ 24 px uzakta, okunurken sabit)
    if (B.sc.id === 'necmi') H.adimEtiket(K, t, [[tm.dokuz - 0.04, '9 ŞİFRE'], [tm.ikiN - 0.04, '9 × 2'], [tm.on - 0.04, '9 × 2 = 18']], tm.defKes - 0.25, [800, 680], 56);
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: YA, split: { h2: 7, h3: 3, d2: 4, d4: 5 } });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});
const YA0 = 1240;   // altyazı balonunun üstü: iki satırlık balon 1415 px'te biter (güvenli alan 1420)

// "SEN DE DÜŞÜN!" sayacı (perde yok; paylaşım hapı yok). Ekranda "10" yazmasın diye sayı 9'dan başlar.
function sayac(K, t, t1, { dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(9, Math.max(0, Math.ceil(left - 1 - 1e-6))), since = 1 - (left % 1 || 1);   // 9 → 0, her saniye bir
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
const LCDM = [(LCD.x0 + LCD.x1) / 2, (LCD.y0 + LCD.y1) / 2];
// Üstten basan el (arkadakiler): el dolabın üst kenarında, parmak aşağı tuşun üst yarısına
const UST_Y = DOLAP.ust + 12;   // el dolabın üst kenarının hemen altında (çeneye binmez), kısa parmak tuşun üst kenarına
const ustEl = n => [TUS[n][0] + 4, UST_Y];
const ustUc = n => [TUS[n][0], TUS[n][1] - 24];
// Yandan basan el (Kerem): el tuşun sol altında, parmak tuşun sol alt köşesine
const yanEl = n => [TUS[n][0] - 44, TUS[n][1] + 58];
const yanUc = n => [TUS[n][0] - 10, TUS[n][1] + 18];
const basma = (t, tb) => t >= tb - 0.05 && t < tb + 0.25 ? Math.sin(Math.PI * clamp01((t - tb + 0.05) / 0.3)) : 0;

// Dolabın arkasındaki kişinin dolabın önüne sarkan kolu: kişi, kolunun çevresine (ve dolap üst kenarının altına) kırpılarak
// yeniden çizilir. Poz ilk çizimde kurulduğu için ikinci çizimde uzanış yeniden verilmez.
// Kısa işaret parmağı: el dolabın üst kenarında, parmak hedefe kadar (rakamın üstüne binmez)
function kisaParmak(a, key, sd, hedef) {
  const el = sd === 'L' ? a.handL : a.handR, r = H.CARDS[key].arm.hand * a.p.s;
  const d = Math.hypot(hedef[0] - el[0], hedef[1] - el[1]);
  a.parmak(sd, 1, { toplam: 1, yon: Math.atan2(hedef[1] - el[1], hedef[0] - el[0]), boy: clamp01((d / r - 0.7) / 1.25) });
}
function kolOnde(K, t, tl, key, p, o) {
  const { ctx } = K, c = H.CARDS[key], r = (c.arm.w * 0.5 + c.line * 0.6) * p.s;
  for (const sd of ['L', 'R']) {
    if (!o[sd] || (o[sd][1] ?? 1) < 0.02) continue;
    const sh = H.eklem(key, p, 'sh' + sd), el = H.eklem(key, p, 'el' + sd), el2 = H.eklem(key, p, 'hand' + sd);
    if (Math.max(el[1], el2[1]) < DOLAP.ust - 20) continue;
    const parca = [];
    for (const [a, b] of [[sh, el], [el, el2]]) { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, n = [-(b[1] - a[1]) / d * r, (b[0] - a[0]) / d * r]; parca.push(cx => { cx.moveTo(a[0] + n[0], a[1] + n[1]); cx.lineTo(b[0] + n[0], b[1] + n[1]); cx.lineTo(b[0] - n[0], b[1] - n[1]); cx.lineTo(a[0] - n[0], a[1] - n[1]); cx.closePath(); }); }
    parca.push(cx => cx.arc(el[0], el[1], r, 0, TAU));
    parca.push(cx => cx.arc(el2[0], el2[1], r * 1.25, 0, TAU));
    for (const yol of parca) {
      ctx.save(); ctx.beginPath(); ctx.rect(-2000, DOLAP.ust - 2, 6000, 3000); ctx.clip(); ctx.beginPath(); yol(ctx); ctx.clip();
      oyna(K, t, tl, key, p, { sessiz: o.sessiz });
      ctx.restore();
    }
  }
}

function sahne(K, t, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  M.mekanCiz(K, OCAK, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.sayac && t < tm.buldum;
  const HEAD = k => H.eklem(k, H.kisi(k, { x: yer(k), y: Y[k] }), 'head');
  const ekran = ekranAt(S.basis, t);
  const bas = { 1: basma(t, tm.b1), 2: basma(t, tm.b2), 3: basma(t, tm.b3) };
  const vurgu = {
    1: H.nabiz(t, tm.bir - 0.04, 0.5) + H.nabiz(t, tm.ayni + 0.05, 0.4) + H.nabiz(t, tm.ayni + 0.45, 0.4),
    2: H.nabiz(t, tm.iki - 0.04, 0.5), 3: H.nabiz(t, tm.ucT - 0.04, 0.5),
  };
  const hane = Math.max(pIn(t, tm.sifre, tm.ayni - 0.05, 0.2, 0.2), id === 'hikmet' ? pIn(t, tm.son - 0.04, tm.yanlista, 0.2, 0.2) : 0);
  const sarsU = H.sars(t, tm.h1 + 0.02, 0.4, 13) + H.sars(t, tm.kilitli - 0.04, 0.4, 13);

  // ——— Hikmet (dolabın arkasında, solda) ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, expr: IF.telas, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads };
  let hIsaret = null;
  // h1: Kerem kulpu çekerken Hikmet dolaba bakar; "şifreyi unuttum"da omuz silker
  hp.head.look = t < tm.sifreyi ? bak('hikmet', hp, KULP) : [0.02, 0.06];
  if (t >= tm.sifreyi && t < tm.insKes) H.omuzSilk(hp, t, tm.sifreyi + 0.1, 0.5);
  // h2 (insert): tuşları üstten tek tek gösterir (basmaz), sonra ekranı; "aynı rakam iki kez": "1"in üstünde iki kez
  if (t >= tm.insKes && t < tm.hikKes) {
    hp.expr = IF.ciddi;
    const wT = pIn(t, tm.uc - 0.2, tm.sifre - 0.15, 0.28, 0.25);
    const wE = pIn(t, tm.sifre - 0.2, tm.ayni - 0.15, 0.28, 0.25);
    const wA = pIn(t, tm.ayni - 0.2, tm.h2s + 0.1, 0.28, 0.3);
    if (wT > 0.01) { const tx = H.iz([[0, TUS[1][0]], [tm.iki - 0.12, TUS[2][0], 0.2], [tm.ucT - 0.12, TUS[3][0], 0.2]], t); hO.R = [[tx + 4, UST_Y - 10], wT, 'B']; if (wT > 0.6) hIsaret = [tx, TUS[1][1] - 46]; }
    if (wE > 0.01) { hO.R = [[LCD.x0 + 4, UST_Y], wE, 'B']; if (wE > 0.6) hIsaret = [LCD.x0 + 10, LCD.y0 + 4]; }
    if (wA > 0.01) { const dy = 12 * (H.nabiz(t, tm.ayni + 0.05, 0.4) + H.nabiz(t, tm.ayni + 0.45, 0.4)); hO.R = [[TUS[1][0] + 4, UST_Y - 14 + dy], wA, 'B']; if (wA > 0.6) hIsaret = [TUS[1][0], TUS[1][1] - 48 + dy]; }
    hp.head.look = bak('hikmet', hp, t < tm.sifre ? TUS[2] : t < tm.ayni ? LCDM : TUS[1]);
  }
  // h3 (Hikmet yakın): "Onay tuşu yok" başını iki yana sallar; "son iki tuşa bakar" ekranı üstten gösterir; sonra omuz silker
  if (t >= tm.hikKes && t < tm.necKes) {
    hp.expr = IF.ciddi; hp.head.look = [0.08, 0.1];
    hayir(hp, t, tm.yok - 0.1, 0.6);
    const wS = pIn(t, tm.son - 0.25, tm.yanlista + 0.1, 0.28, 0.25);
    if (wS > 0.01) { hO.R = [[LCD.x0 + 4, UST_Y], wS, 'B']; if (wS > 0.6) hIsaret = [LCD.x0 + 10, LCD.y0 + 4]; hp.head.look = bak('hikmet', hp, LCDM); }
    if (t >= tm.yanlista) { H.omuzSilk(hp, t, tm.yanlista + 0.1, Math.max(0.2, tm.h3s - tm.yanlista - 0.5)); hp.head.look = [0.05, 0.05]; }
  }
  if (t >= tm.necKes && t < tm.sayac) { hp.expr = IF.notr; hp.head.look = bak('hikmet', hp, t < tm.defKes ? HEAD('necmi') : HEAD('defne')); }
  // sayaç: Kerem'in eline ve ekrana bakar, ilk basıştan sonra omuz silker
  if (sayacta) {
    hp.expr = IF.dusun;
    hp.head.look = t < tm.b1 + 0.9 ? bak('hikmet', hp, t < tm.b1 ? TUS[1] : LCDM) : t < tm.b2 - 0.5 ? [0.1, 0.12] : bak('hikmet', hp, t < tm.b3 + 0.4 ? TUS[2] : LCDM);
    if (t >= tm.b1 + 0.9 && t < tm.b2 - 0.6) H.omuzSilk(hp, t, tm.b1 + 0.95, 0.6);
    if (t >= tm.b2 - 0.4) hp.expr = IF.merak;
  }
  if (id === 'cevap' || id === 'buldum') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Defne (dolabın arkasında, sağda) ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  let dParmak = 0;
  dp.head.look = t < tm.sifreyi ? bak('defne', dp, KULP) : bak('defne', dp, HEAD('hikmet'));
  if (t >= tm.insKes && t < tm.hikKes) dp.head.look = bak('defne', dp, t < tm.sifre ? TUS[2] : LCDM);
  if (t >= tm.necKes && t < tm.defKes) dp.head.look = bak('defne', dp, HEAD('necmi'));
  if (t >= tm.defKes && t < tm.sayac + 0.3) {
    // d2: "Olmaz" başını sallar (Necmi'ye); "daha azıyla" işaret parmağı havada; "En az kaç" omuz silker
    dp.expr = IF.ciddi; dp.head.look = bak('defne', dp, HEAD('necmi'));
    hayir(dp, t, tm.olmaz + 0.02, 0.55);
    const wG = pIn(t, tm.daha - 0.25, tm.en, 0.28, 0.25);
    if (wG > 0.01) { dO.L = [[LCD.x1 + 4, UST_Y - 6], wG, 'B']; if (wG > 0.6) dParmak = [LCD.x1 - 12, LCD.y0 - 2]; dp.head.look = bak('defne', dp, LCDM); }
    if (t >= tm.kac - 0.05) { H.omuzSilk(dp, t, tm.kac, Math.max(0.2, tm.d2s - tm.kac - 0.3)); dp.head.look = [-0.1, 0.05]; }
  }
  let dDus = false;
  if (sayacta) {
    const c0 = tm.cd0; dp.expr = IF.dusun;
    const dThink = pIn(t, c0 + 1.9, c0 + 4.6, 0.35);   // el yüzlere binmesin: yalnız baş ve bakış
    if (dThink > 0.01) dp.head.tilt = (dp.head.tilt || 0) - 7 * dThink;
    dp.head.look = t < tm.b1 + 0.9 ? bak('defne', dp, LCDM) : dThink > 0.3 ? [0.2 + 0.1 * Math.sin(TAU * (t - c0) / 2.3), -0.25] : bak('defne', dp, t < tm.b3 + 0.4 ? TUS[2] : LCDM);
    if (t >= tm.b2 - 0.2) dp.expr = IF.merak;
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.L = [H.elYeri('defne', dp, 'L', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; dp.head.look = bak('defne', dp, LCDM); }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Kerem (önde solda; konuşmaz) ———
  const kp = H.kisi('genc', { x: yer('genc'), y: Y.genc, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const kO = { heads, sessiz: true };
  let kIsaret = null;
  // h1: kare 0'da eli kulpta; iki kez çeker, sonra bırakır
  const wKulp = 1 - W(t, tm.sifreyi - 0.1, 0.3);
  if (wKulp > 0.01) kO.R = [[KULP[0] - 6 + 6 * sarsU, KULP[1] + 6], wKulp, 'A'];
  kp.head.look = t < tm.sifreyi ? bak('genc', kp, KULP) : bak('genc', kp, HEAD('hikmet'));
  if (t >= tm.insKes && t < tm.hikKes) kp.head.look = bak('genc', kp, TUS[2]);
  if (t >= tm.necKes && t < tm.sayac) kp.head.look = bak('genc', kp, t < tm.defKes ? HEAD('necmi') : HEAD('defne'));
  if (sayacta) {
    kp.expr = IF.dusun;
    kp.head.look = bak('genc', kp, t < tm.b1 + 0.15 ? TUS[1] : t < tm.b1 + 1.0 ? LCDM : t < tm.b2 + 0.15 ? TUS[2] : t < tm.b2 + 1.0 ? LCDM : t < tm.b3 + 0.15 ? TUS[3] : LCDM);
    // üç basış (1, 2, 3); arada el tuşlardan iner, ekran açık kalır
    for (const [n, tb] of [[1, tm.b1], [2, tm.b2], [3, tm.b3]]) {
      const w = pIn(t, tb - 0.4, tb + 0.6, 0.28, 0.3);
      if (w > 0.01) { kO.R = [yanEl(n), w, 'A']; if (w > 0.6) kIsaret = yanUc(n); }
    }
    if (t >= tm.b3 + 0.9) kp.expr = IF.sakin;
  }
  if (id === 'cevap' || id === 'buldum') kp.head.look = bak('genc', kp, HEAD('defne'));

  // ——— Necmi (önde sağda; elinde son çay) ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads };
  const CAY = [np.x - 58, 1215];
  nO.L = [[CAY[0] - 4, CAY[1] + 26], 1, 'A'];
  np.head.look = t < tm.sifreyi ? bak('necmi', np, KULP) : bak('necmi', np, HEAD('hikmet'));
  if (t >= tm.insKes && t < tm.hikKes) np.head.look = bak('necmi', np, LCDM);
  let nParmak = 0;
  if (t >= tm.necKes && t < tm.defKes) {
    np.expr = IF.emin; np.head.look = [-0.12, 0.05];
    const w2 = pIn(t, tm.ikiN - 0.3, tm.on - 0.05, 0.28, 0.25);
    if (w2 > 0.01) { nO.R = [[np.x + 128, 1080], w2, 'B']; if (w2 > 0.6) nParmak = 2; }
    const wA = pIn(t, tm.on - 0.1, tm.n0s + 0.3, 0.28, 0.3);
    if (wA > 0.01) nO.R = [[np.x + 145, 1110], wA, 'B'];
  }
  if (t >= tm.defKes && t < tm.sayac) { np.expr = IF.merak; np.head.look = bak('necmi', np, HEAD('defne')); }
  let nCene = 0;
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.dusun;
    nCene = pIn(t, c0 + 1.9, c0 + 4.4, 0.35);
    if (nCene > 0.01) nO.R = [cene('necmi', np, 1), nCene, 'B'];
    np.head.look = t < tm.b1 + 0.6 ? bak('necmi', np, LCDM) : nCene > 0.3 ? [-0.3, -0.3] : bak('necmi', np, LCDM);
    if (t >= tm.b2 - 0.2) np.expr = IF.merak;
  }
  if (id === 'cevap' || id === 'buldum') np.head.look = bak('necmi', np, HEAD('defne'));

  // ——— Çizim: arkadakiler → dolap → tepsi → kilit → arkadakilerin önden sarkan kolları → öndekiler → eller ———
  const hc = oyna(K, t, S.tlS, 'hikmet', hp, hO);
  const dc = oyna(K, t, S.tlS, 'defne', dp, dO);
  dolap(K, t, { sars: 2.5 * sarsU });
  tepsi(K);
  K.ctx.save(); K.ctx.translate(2.5 * sarsU, 0);
  kilit(K, t, { ekran, bas, vurgu, hane });
  K.ctx.restore();
  const kc = oyna(K, t, null, 'genc', kp, kO);
  const nc = oyna(K, t, S.tlS, 'necmi', np, nO);
  bardak(K, CAY);
  H.buhar(K, CAY[0], CAY[1] - 40, t, { k: 0.55, n: 2, periyot: 2.1, boy: 80 });
  nc.tut('L');
  // tutan / gösteren eller (nesnenin üstünde)
  if (wKulp > 0.5) kc.tut('R');
  if (hIsaret) kisaParmak(hc, 'hikmet', 'R', hIsaret);
  if (kIsaret) kc.isaret('R', kIsaret);
  if (nParmak) nc.parmak('R', 2, { toplam: 2, yon: -Math.PI / 2, ac: 0.42, boy: 0.9 });
  if (nCene > 0.6) nc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (dParmak) kisaParmak(dc, 'defne', 'L', dParmak);
  if (dDus) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
