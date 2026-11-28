// Bölüm 92 · DÜŞEŞ, HEPYEK, ŞEŞBEŞ (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_092_v5.md).
// Mekanizma: çekici eşitlik (S7). İki zar iki ayrı nesnedir: çift atış tek yoldan, karışık atış iki yoldan gelir.
// Logline: Öğle arası terasta tavla. Necmi iki zar atacak: düşeş ya da hepyek gelirse Necmi, şeşbeş gelirse Hikmet Bey
// kazanır; başka bir şey gelirse yeniden atılır; kaybeden çayları ısmarlar. Hikmet: "Senin iki şansın var, benim bir. Kabul
// etmem." Defne nedenini söylemeden karşı çıkar ve soruyu sorar. İpucu (söz yok): sayaçta Kerem iki zarı avucunda açar,
// biri kırmızı biri beyaz; önce kırmızıyı, sonra beyazı hafifçe kaldırır.
// Akılda kalacak tek şey: zarları iki ayrı zar diye say.
// Sızıntı yasağı: 5-6 yüzü hiçbir karede yok (şeşbeş yalnız kırmızı 6, beyaz 5 olarak bir kez); ekranda "eşit", "iki yol" yok.
// Kerem hiç konuşmaz (sessiz: true). Her kare t'nin saf fonksiyonudur; Math.random yok; anlar kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const TERAS = 'b092_teras';
const X = { genc: 258, necmi: 456, hikmet: 664, defne: 864 };
const Y = { genc: 1422, necmi: 1384, hikmet: 1462, defne: 1422 };   // başlar aynı hizada; masa göğüs altında
const MASA = { arka: 1088, on: 1262, x0: -700, x1: 1900 };          // masa üstü (perspektif): arka kenar → ön kenar
const ZY = 1150;                                                     // zarların oturduğu çizgi (tahtanın ön yarısı)
const ZS = 100;                                                      // zar kenarı (dünya)
const TV = { cx: 558, y0: 1096, y1: 1192, w0: 520, w1: 600 };        // açık tavla (masaya yatık)
const CAY = { necmi: [352, 1188], hikmet: [790, 1188] };             // ince belli çay bardakları (tabaklı)
// Zarların durakları (alt orta)
const Z0 = { r: [500, ZY], b: [618, ZY] };          // Necmi'nin koyduğu yer (gösterim)
const Z1 = { r: [548, ZY - 2], b: [672, ZY + 4] };  // atıştan sonra
const Z2 = { r: [404, ZY - 2], b: [528, ZY + 4] };  // Hikmet geri ittikten sonra
// Kameralar [zoom, cx, cy]. Kart 300–509 px: saç tepeleri ≥ 540 px.
const KAM = {
  grup: [1.3, 560, 1020],
  insert: [1.5, 560, 980],
  necmi: [1.45, 470, 985],
  hikmet: [1.45, 650, 985],
  defne: [1.45, 704, 985],
  buldum: [1.45, 722, 985],
};
// Yakın plânlarda kadraj kenarında yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  insert: { genc: -330, defne: 330 },
  necmi: { defne: 330 },
  hikmet: { genc: -330 },
  defne: { genc: -330, necmi: -330 },
  buldum: { genc: -330, necmi: -330 },
};

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.24, open: 0, w: 0.9 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  keyif: { brow: 0.1, browTilt: -0.12, eye: 0.6, pupil: 1, curve: 0.36, open: 0, w: 1.0 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  supheli: { brow: -0.04, browTilt: 0.32, eye: 0.62, pupil: 1, curve: -0.04, open: 0, w: 0.85 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
};

// ═══════════════════════════ Nesneler ═══════════════════════════
const ZR = {
  r: { renk: '#C8433A', acik: '#DE6B5F', koyu: '#9A2E27', pip: '#FBF6EC' },
  b: { renk: '#F6F1E6', acik: '#FFFFFF', koyu: '#CBC1AE', pip: '#22302E' },
};
const PIP = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
// Zar (önden): p alt orta; ön yüzde benekler (kameraya bakar), üstte ve sağda pah. rot ≠ 0 (havada) iken pah yok.
// sx: yüz çevirme (|cos|), 0'a inerken yüz değişir
function zar(K, [x, y], z, n, { s = ZS, rot = 0, sx = 1 } = {}) {
  const { ctx } = K, Z = ZR[z], h = s / 2, d = s * 0.16;
  ctx.save(); ctx.translate(x, y - h);
  if (Math.abs(rot) < 1e-3) K.ell(0, h + 2, h * 1.05, s * 0.07, 'rgba(40,25,10,0.25)', 0);
  ctx.rotate(rot); ctx.scale(Math.max(0.04, sx), 1);
  if (Math.abs(rot) < 1e-3) {
    K.poly([[-h + 4, -h], [-h + 4 + d, -h - d], [h + d, -h - d], [h, -h]], Z.acik, LW * 0.7);
    K.poly([[h, -h], [h + d, -h - d], [h + d, h - d], [h, h]], Z.koyu, LW * 0.7);
  }
  K.rect(-h, -h, s, s, Z.renk, LW * 0.85, s * 0.16);
  for (const [px, py] of PIP[n]) K.circ(px * s * 0.27, py * s * 0.27, s * 0.095, Z.pip, z === 'r' ? LW * 0.35 : 0);
  ctx.restore();
}
// Açık tavla (masaya yatık, perspektif): iki yarı yan yana, ortada menteşe; haneler ön ve arka kenardan içe
function tavla(K) {
  const { cx, y0, y1, w0, w1 } = TV;
  const P = (u, v) => [cx + (u - 0.5) * lerp(w0, w1, v), lerp(y0, y1, v)];   // u: en (0 sol), v: derinlik (0 arka)
  K.poly([P(-0.03, -0.1), P(1.03, -0.1), P(1.03, 1.08), P(-0.03, 1.08)], '#7A4A26', LW * 0.9);
  for (const [a, b] of [[0.015, 0.49], [0.51, 0.985]]) {
    K.poly([P(a, 0.02), P(b, 0.02), P(b, 0.98), P(a, 0.98)], '#E9D7AE', LW * 0.35);
    for (let i = 0; i < 6; i++) {
      const ua = lerp(a, b, i / 6) + 0.004, ub = lerp(a, b, (i + 1) / 6) - 0.004, um = (ua + ub) / 2;
      K.poly([P(ua, 0.03), P(ub, 0.03), P(um, 0.42)], i % 2 ? '#2E3B38' : '#B5532A', 1.5);
      K.poly([P(ua, 0.97), P(ub, 0.97), P(um, 0.58)], i % 2 ? '#B5532A' : '#2E3B38', 1.5);
    }
  }
  const m0 = P(0.5, -0.1), m1 = P(0.5, 1.08); K.line(m0[0], m0[1], m1[0], m1[1], 9, '#5E3A1E');
  // kenarda dizili pullar (sabit; oyun başlamadı)
  for (const [u, v, r] of [[0.06, 0.12, 0], [0.06, 0.2, 0], [0.06, 0.28, 0], [0.94, 0.12, 1], [0.94, 0.2, 1], [0.94, 0.28, 1], [0.44, 0.1, 1], [0.44, 0.18, 1], [0.56, 0.1, 0], [0.56, 0.18, 0]]) {
    const p = P(u, v); K.ell(p[0], p[1], 15, 6.5, r ? '#3A2A20' : PAL.paper, 2.5);
  }
}
// İnce belli çay bardağı, tabaklı: (x, yb) tabağın altı
function bardak(K, [x, yb], k = 1, tabak = true) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  if (tabak) K.ell(0, -3, 34, 8, PAL.cream, 2.5);
  const yol = [[-17, -64], [17, -64], [10, -36], [17, -14], [13, -6], [-13, -6], [-17, -14], [-10, -36]];
  K.poly(yol, '#F3EEE4', 2.5);
  K.poly([[-15, -54], [15, -54], [9, -36], [15, -14], [11.5, -8], [-11.5, -8], [-15, -14], [-9, -36]], '#A8401F', 0);
  K.line(-13, -54, 13, -54, 2.5, '#C9603A');
  K.poly(yol, null, 2.5);
  ctx.restore();
}

// Simit tabağı (masanın ön sağında; ön bant boş kalmasın)
function simit(K, [x, y]) {
  K.ell(x, y, 96, 26, '#F3EEE4', LW * 0.7); K.ell(x, y - 4, 74, 18, '#E6DFD0', 2);
  for (const [dx, dy] of [[-30, -14], [26, -10]]) {
    K.ell(x + dx, y + dy - 6, 46, 20, '#B9773C', LW * 0.6); K.ell(x + dx, y + dy - 9, 16, 6, '#E6DFD0', 2.5);
    for (let i = 0; i < 7; i++) K.circ(x + dx - 32 + i * 10, y + dy - 14 + 6 * Math.sin(i * 1.7), 2.2, '#F6E9C8', 0);
  }
}
// ═══════════════════════════ Mekân: ofis terası ═══════════════════════════
const SKY = '#BFDCE3', DENIZ = '#5F9FB2', DENIZ2 = '#7DB4C3';
function arkaPlan(K, t) {
  const { ctx } = K, x0 = -700, x1 = 1900;
  K.rect(x0, 200, x1 - x0, 900, SKY, 0, 0);
  // bulutlar (döngü: yavaş kayar)
  for (const [i, y, k] of [[0, 760, 1.0], [1, 640, 0.8], [2, 830, 0.7]]) {
    const xx = x0 + ((i * 910 + t * (9 + i * 4)) % 2600);
    M.bulut(K, xx, y, k, '#F7F3EA');
  }
  // martılar (döngü)
  for (const [i, y] of [[0, 700], [1, 735]]) {
    const xx = -200 + ((t * (70 + i * 18) + i * 640) % 1500), f = Math.sin(TAU * (t * 2.2 + i * 0.4));
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = '#3B4A48';
    ctx.beginPath(); ctx.moveTo(xx - 22, y - 8 * f); ctx.quadraticCurveTo(xx - 10, y - 12, xx, y); ctx.quadraticCurveTo(xx + 10, y - 12, xx + 22, y - 8 * f); ctx.stroke();
    ctx.restore();
  }
  // karşı kıyı: tepeler ve uzak bloklar (tohumlu, sabit)
  const yk = 965;
  ctx.beginPath(); ctx.moveTo(x0, yk);
  for (let x = x0; x <= x1; x += 40) ctx.lineTo(x, yk - 36 - 26 * Math.sin(x / 210) - 14 * Math.sin(x / 77));
  ctx.lineTo(x1, yk); ctx.closePath(); ctx.fillStyle = '#9DBFA9'; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.stroke();
  const r = H.mulberry32(92);
  for (let x = x0 + 20; x < x1; x += 70 + r() * 60) {
    const bh = 18 + r() * 34, bw = 26 + r() * 30, by = yk - 30 - 26 * Math.sin(x / 210) - 14 * Math.sin(x / 77);
    K.rect(x, by - bh, bw, bh + 8, ['#E8DCC6', '#D9CDB4', '#EFE6D2'][Math.floor(r() * 3)], 2.5, 2);
  }
  // deniz (döngü: kıpırdayan dalga çizgileri)
  K.rect(x0, yk, x1 - x0, 140, DENIZ, 0, 0);
  K.line(x0, yk, x1, yk, 3.5, INK);
  for (let j = 0; j < 4; j++) for (let x = x0 + (j * 97) % 200; x < x1; x += 260) {
    const xx = x + 30 * Math.sin(TAU * (t / 4.5 + j * 0.3 + x * 0.01)), yy = yk + 22 + j * 28;
    K.line(xx, yy, xx + 60, yy, 4, DENIZ2);
  }
  // teras korkuluğu (beyaz metal)
  const ry = 1000;
  K.rect(x0, ry, x1 - x0, 14, '#F2EEE6', LW * 0.6, 4);
  for (let x = x0 + 30; x < x1; x += 64) K.rect(x, ry + 12, 9, 110, '#F2EEE6', LW * 0.45, 3);
  // saksılar (kenarlarda): sardunya
  for (const [x, s] of [[30, 1], [1090, -1]]) {
    K.poly([[x - 60, 1030], [x + 60, 1030], [x + 46, 1110], [x - 46, 1110]], '#B8643C', LW * 0.7);
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.42; H.yaprak(K, x, 1032, 74, a, '#5E8C4E', 1); }
    for (const [dx, dy] of [[-30, 958], [10, 940], [38, 966]]) K.circ(x + dx * s, dy, 15, '#D9483A', 2.5);
  }
}
function masa(K) {
  const { ctx } = K, { arka, on, x0, x1 } = MASA;
  // masa üstü: açık ahşap, perspektifte
  K.poly([[x0, arka], [x1, arka], [x1, on], [x0, on]], '#D8B98A', LW * 0.8);
  for (const [y, a, b] of [[arka + 26, 0.1, 0.3], [arka + 62, 0.62, 0.8], [arka + 44, 0.38, 0.46]]) K.line(lerp(-100, 1300, a), y, lerp(-100, 1300, b), y, 3, '#C29E6C');
  // örtü: masanın önünden sarkan kırmızı-krem kareli kumaş (altyazı ve sayaç bunun üstünde)
  const y0 = on - 2, h = 900;
  K.rect(x0, y0, x1 - x0, h, '#F3EBDA', LW * 0.7, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, h); ctx.clip();
  const q = 58;
  ctx.globalAlpha = 0.55; for (let x = x0; x < x1; x += q * 2) K.rect(x, y0, q, h, '#C9573F', 0, 0);
  for (let y = y0; y < y0 + h; y += q * 2) K.rect(x0, y, x1 - x0, q, '#C9573F', 0, 0);
  ctx.globalAlpha = 1;
  ctx.restore();
  K.line(x0, y0, x1, y0, LW * 0.8, INK);
  K.rect(x0, on - 6, x1 - x0, 12, '#B08455', LW * 0.6, 0);   // masa kenarı
}
M.mekanEkle(TERAS, {
  gen: [-700, 1900], dongu: ['kayan bulutlar ve martılar', 'çay buharı', 'denizde dalga çizgileri'],
  kadraj: { grup: KAM.grup },
  arka(K, t) { arkaPlan(K, t); },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    n0: T('n0'), simdi: T('n0:0'), atacagim: T('n0:3'), duses: T('n0:4'), n0s: T('n0>'),
    n0b: T('n0b'), hepyek: T('n0b:2'), n0bs: T('n0b>'),
    n2: T('n2'), seses: T('n2:0'), siz: T('n2:2'), baska: T('n2:4'), gelirse2: T('n2:7'), yeniden: T('n2:8'), n2s: T('n2>'),
    n3: T('n3'), caylari: T('n3:0'), kaybeden: T('n3:2'), n3s: T('n3>'),
    h2: T('h2'), iki: T('h2:1'), benim: T('h2:4'), kabul: T('h2:6'), h2s: T('h2>'),
    d2: T('d2'), hikmetBey: T('d2:3'), kimin: T('d2:5'), yuksek: T('d2:8'), d2s: T('d2>'),
  };
  tm.koy = tm.atacagim + 0.1; tm.kondu = tm.koy + 0.4;          // Necmi zarları tahtaya koyar (düşeş yüzü)
  tm.insKes = tm.duses - 0.17;
  tm.cev1 = tm.hepyek - 0.24; tm.cev2 = tm.seses - 0.24;         // yüz çevirmeler (kırmızı, 0,1 sn sonra beyaz)
  tm.necKes = tm.baska - 0.15;
  tm.al = tm.baska + 0.02; tm.atis = tm.gelirse2; tm.indi = tm.atis + 0.45;   // atış: al, salla, at; 0,45 sn'de tahtaya iner
  tm.bKal = tm.caylari - 0.05; tm.bIn = tm.n3s - 0.3;           // Necmi çay bardağını kaldırır, koyar
  tm.hikKes = tm.h2 - 0.12;
  tm.itt = tm.kabul + 0.05;                                     // Hikmet zarları Necmi'ye geri iter (0,45 sn)
  tm.defKes = tm.d2 - 0.12;
  tm.sayac = Math.min(cd0 - 0.05, tm.d2s);
  tm.kAl = cd0 + 4.4; tm.kAvuc = tm.kAl + 0.75;                 // ipucu: Kerem zarları alır, avucunda açar
  tm.kKir = cd0 + 6.3; tm.kBey = cd0 + 6.95;                    // önce kırmızıyı, sonra beyazı hafifçe kaldırır
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.insKes - 0.1, 1.31, 560, 1018]] },
    { id: 'insert', t0: tm.insKes, cam: [[0, ...KAM.insert], [tm.necKes - 0.1, 1.53, 560, 978]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.hikKes - 0.1, 1.47, 474, 983]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.defKes - 0.1, 1.47, 654, 983]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.sayac - 0.1, 1.47, 700, 983]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // sayaç: doğrusal itme kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.33, 560, 1018]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // balonlar kesmeden 0,3 sn önce söner
  const kes = [tm.insKes, tm.necKes, tm.hikKes, tm.defKes, tm.sayac];
  const sonra = t => kes.find(k => k > t + 0.05) ?? 1e9;
  const tlS = { ...tl, lines: tl.lines.filter(l => !['d3', 'd4', 'd6'].includes(l.id) || true).map(l => {
    const k = sonra(l.t0); return l.t1 > k - 0.3 && ['n0b', 'n3', 'h2', 'd2'].includes(l.id) ? { ...l, t1: Math.min(l.t1, k - 0.3) } : l;
  }) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlA };
}

// ═══════════════════════════ Zar durumu ═══════════════════════════
// { r: { p, n, rot, sx, s }, b: {…}, kim: 'necmi' | 'hikmet' | 'kerem' | null, el?: tutuş noktası }
function zarAt(tm, t, elN, avuc) {
  const cevir = (t0, a, b) => { const u = seg(t, t0, 0.22); return { n: u < 0.5 ? a : b, sx: Math.abs(Math.cos(Math.PI * u)) }; };
  const dur = (Zp, nr, nb, o = {}) => ({ r: { p: Zp.r, n: nr, rot: 0, sx: 1 }, b: { p: Zp.b, n: nb, rot: 0, sx: 1 }, kim: null, ...o });
  const elde = (el, nr, nb, k = 0.9) => ({ r: { p: [el[0] - 36, el[1] - 10], n: nr, rot: -0.12, sx: 1, s: ZS * k }, b: { p: [el[0] + 38, el[1] - 12], n: nb, rot: 0.1, sx: 1, s: ZS * k } });
  // kanca: Necmi'nin elinde sallanır, tahtaya koyar (6-6)
  if (t < tm.koy) return { ...elde(elN, 3, 4), kim: 'necmi' };
  if (t < tm.kondu) {
    const u = ease.state(seg(t, tm.koy, 0.4)), e = elde(elN, 3, 4);
    return { r: { p: kar(e.r.p, Z0.r, u), n: u < 0.5 ? 3 : 6, rot: -0.12 * (1 - u), sx: 1, s: ZS * lerp(0.9, 1, u) }, b: { p: kar(e.b.p, Z0.b, u), n: u < 0.5 ? 4 : 6, rot: 0.1 * (1 - u), sx: 1, s: ZS * lerp(0.9, 1, u) }, kim: 'necmi' };
  }
  // gösterim: 6-6 → 1-1 → kırmızı 6, beyaz 5
  if (t < tm.cev1) return dur(Z0, 6, 6);
  if (t < tm.cev2) { const a = cevir(tm.cev1, 6, 1), b = cevir(tm.cev1 + 0.1, 6, 1); return { r: { p: Z0.r, rot: 0, ...a }, b: { p: Z0.b, rot: 0, ...b }, kim: null }; }
  if (t < tm.al + 0.28) { const a = cevir(tm.cev2, 1, 6), b = cevir(tm.cev2 + 0.1, 1, 5); return { r: { p: Z0.r, rot: 0, ...a }, b: { p: Z0.b, rot: 0, ...b }, kim: null }; }
  // "Başka bir şey gelirse yeniden atarım": alır, sallar, atar (4-2 gelir)
  if (t < tm.atis) {
    const u = ease.enter(seg(t, tm.al + 0.28, 0.3)), e = elde(elN, 6, 5);
    return { r: { p: kar(Z0.r, e.r.p, u), n: 6, rot: -0.12 * u, sx: 1, s: ZS * lerp(1, 0.78, u) }, b: { p: kar(Z0.b, e.b.p, u), n: 5, rot: 0.1 * u, sx: 1, s: ZS * lerp(1, 0.78, u) }, kim: 'necmi' };
  }
  if (t < tm.indi) {
    const u = seg(t, tm.atis, 0.45), e = elde(elN, 6, 5), k = Math.floor(u * 7);
    const f = (s, A, B, n0, i) => ({ p: H.yay(A, B, ease.state(u), 70), n: 1 + ((n0 + k + i) % 6), rot: s * (1 - u) * 5.5, sx: 1, s: ZS * lerp(0.78, 1, u) });
    return { r: f(1, [e.r.p[0], e.r.p[1]], Z1.r, 2, 0), b: f(-1, [e.b.p[0], e.b.p[1]], Z1.b, 4, 3), kim: null };
  }
  if (t < tm.itt) return dur(Z1, 4, 2);
  // Hikmet geri iter
  if (t < tm.kAl + 0.28) { const u = ease.state(seg(t, tm.itt, 0.45)); return dur({ r: kar(Z1.r, Z2.r, u), b: kar(Z1.b, Z2.b, u) }, 4, 2); }
  // ipucu: Kerem alır, avucunda açar; kırmızı, sonra beyaz hafifçe kalkar
  const u = ease.enter(seg(t, tm.kAl + 0.28, 0.45));
  const hop = (a) => 16 * H.nabiz(t, a, 0.4);
  const A = { r: [avuc[0] - 46, avuc[1] - 6 - hop(tm.kKir)], b: [avuc[0] + 46, avuc[1] - 6 - hop(tm.kBey)] };
  return { r: { p: kar(Z2.r, A.r, u), n: 4, rot: 0, sx: 1, s: ZS * lerp(1, 0.9, u) }, b: { p: kar(Z2.b, A.b, u), n: 2, rot: 0, sx: 1, s: ZS * lerp(1, 0.9, u) }, kim: 'kerem' };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, etiket, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç: doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.buldum - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.3), Math.log(1.335), u)), cx: 560, cy: lerp(1020, 1014, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const YA = YA0;
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (YA - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    // zar adları: insert boyunca, zarların üstünde sabit
    if (id === 'insert') {
      const p = B.ekr([559, 1004]);
      H.tag(K, t, tm.insKes + 0.2, tm.cev1 + 0.02, p, 'DÜŞEŞ', PAL.mustard, INK, 50);
      H.tag(K, t, tm.cev1 + 0.2, tm.cev2 + 0.02, p, 'HEPYEK', PAL.mustard, INK, 50);
      H.tag(K, t, tm.cev2 + 0.2, tm.necKes - 0.05, p, 'ŞEŞBEŞ', PAL.mustard, INK, 50);
    }
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: YA, split: { n0: 4, n2: 4, h2: 6, d2: 5, d4: 7 } });
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
// Masanın önüne uzanan kol: karakterler masanın ve yan yana duran komşularının arkasında kalır; uzanan kol (omuz → dirsek → el)
// masadan sonra, bütün karakterlerin önünde yeniden çizilir. El de çizilir (tutan el ayrıca nesnenin üstüne gelir).
function kolOn(K, key, p, r, sd) {
  const c = H.CARDS[key], { ctx } = K, sh = H.eklem(key, p, 'sh' + sd), el = H.eklem(key, p, 'el' + sd), h = sd === 'L' ? r.handL : r.handR;
  if (!h || h[1] < H.eklem(key, p, 'head')[1] + 0.55 * p.s) return;   // el çenede, başın yanında: karakterin kendi çizimi kalır
  const w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [a, b] of [[sh, el], [el, h]]) { H.strokeLine(ctx, a, b, w + lw * 2, INK); }
  for (const [a, b] of [[sh, el], [el, h]]) { H.strokeLine(ctx, a, b, w, c.arm.color); }
  K.circ(h[0], h[1], c.arm.hand * p.s, c.skin, lw);
  ctx.restore();
}
const bak = (k, p, q) => { const h = H.eklem(k, p, 'head'); return [Math.max(-0.75, Math.min(0.75, (q[0] - h[0]) / 380)), Math.max(-0.5, Math.min(0.55, (q[1] - h[1]) / 420))]; };
const cene = (key, p, m) => { const h = H.eklem(key, p, 'head'); return [h[0] + m * 0.43 * p.s, h[1] + 0.4 * p.s]; };
const ZARLAR = [560, 1100];

function sahne(K, t, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  M.mekanCiz(K, TERAS, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.sayac && t < tm.buldum;
  const HEAD = k => [yer(k), Y[k] - 600];

  // ——— Necmi'nin el yolu (zarlar elindeyken) ———
  const NEL0 = [596, 1072];
  let elN = [NEL0[0], NEL0[1] - 16 * Math.abs(Math.sin(TAU * 2.6 * Math.max(0, t - 0.3))) * (1 - seg(t, tm.koy - 0.15, 0.15))];
  if (t >= tm.koy && t < tm.kondu + 0.1) elN = kar(NEL0, [Z0.r[0] + 58, ZY - 70], ease.state(seg(t, tm.koy, 0.4)));
  if (t >= tm.al && t < tm.indi) {   // atış: zarlara uzanır, kaldırır, sallar, atar
    const al = [Z0.r[0] + 58, ZY - 70], UST = [590, 1070];
    const u1 = ease.enter(seg(t, tm.al + 0.28, 0.3));
    elN = kar(al, UST, u1);
    if (t >= tm.al + 0.58) elN = [UST[0], UST[1] - 16 * Math.abs(Math.sin(TAU * 3 * (t - tm.al - 0.58)))];
    if (t >= tm.atis) elN = kar(UST, [620, 1090], ease.enter(seg(t, tm.atis, 0.2)));
  }
  const avuc = [344, 1066];
  const zr = zarAt(tm, t, elN, avuc);

  // ——— Necmi ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads };
  np.expr = IF.emin; np.head.look = bak('necmi', np, ZARLAR);
  // kanca: zarlar sağ elinde, sallar; tahtaya koyar
  let nTut = false, nIsaret = null, nAvuc = 0;
  const wHand = t < tm.kondu + 0.35 ? 1 - W(t, tm.kondu + 0.05, 0.3) : 0;
  if (wHand > 0.01) { nO.R = [elN, wHand, 'A']; nTut = t < tm.kondu; }
  if (t < tm.koy) np.head.look = t < tm.duses - 0.4 ? bak('necmi', np, HEAD('hikmet')) : bak('necmi', np, ZARLAR);
  // yüz çevirmeler: işaret parmağı zarın üstüne değer
  const dok = (t0, Zp) => pIn(t, t0 - 0.3, t0 + 0.42, 0.25, 0.25);
  const ust = Zp => [Zp[0] + 6, Zp[1] - ZS - 18];
  const w1 = Math.max(dok(tm.cev1, Z0.r), dok(tm.cev1 + 0.1, Z0.b)), w2 = Math.max(dok(tm.cev2, Z0.r), dok(tm.cev2 + 0.1, Z0.b));
  const wD = Math.max(w1, w2);
  if (wD > 0.01) {
    const t0 = w1 > w2 ? tm.cev1 : tm.cev2, u = ease.state(seg(t, t0 + 0.02, 0.12));
    const hed = kar(ust(Z0.r), ust(Z0.b), u);
    nO.R = [[hed[0] - 30, hed[1] - 40], wD, 'A']; if (wD > 0.6) nIsaret = hed;
  }
  // "siz kazanırsınız": avucu Hikmet'e doğru açık
  const wSiz = pIn(t, tm.siz - 0.25, tm.baska - 0.2, 0.28, 0.25);
  if (wSiz > 0.01) { nO.R = [[630, 1020], wSiz, 'A']; nAvuc = wSiz; np.head.look = bak('necmi', np, HEAD('hikmet')); }
  // atış
  if (t >= tm.al - 0.05 && t < tm.indi + 0.3) {
    const w = W(t, tm.al - 0.05, 0.3) * (1 - W(t, tm.indi, 0.3));
    nO.R = [elN, w, 'A']; nTut = t < tm.atis + 0.05; np.head.look = bak('necmi', np, ZARLAR);
  }
  // "yeniden atarım": zarları gösterir
  const wYen = pIn(t, tm.yeniden - 0.25, tm.n2s + 0.2, 0.28, 0.3);
  if (wYen > 0.01) { nO.R = [[Z1.r[0] + 10, ZY - 150], wYen, 'A']; if (wYen > 0.6) nIsaret = [Z1.r[0] + 40, ZY - ZS - 10]; }
  // n3 "Çayları": çay bardağını kaldırır (sol el)
  const bU = t >= tm.bKal && t < tm.bIn + 0.4 ? ease.enter(seg(t, tm.bKal + 0.25, 0.35)) * (1 - ease.state(seg(t, tm.bIn, 0.35))) : 0;
  const cayN = kar(CAY.necmi, [CAY.necmi[0] + 8, CAY.necmi[1] - 92], bU);
  const wCay = pIn(t, tm.bKal, tm.bIn + 0.35, 0.25, 0.25);
  if (wCay > 0.01) { nO.L = [[cayN[0] - 4, cayN[1] - 38], wCay, 'A']; }
  if (t >= tm.n3 - 0.2 && t < tm.hikKes) np.head.look = t < tm.kaybeden ? bak('necmi', np, HEAD('hikmet')) : [0.12, 0.08];
  if (t >= tm.hikKes && t < tm.sayac) { np.expr = t < tm.d2 ? IF.keyif : IF.merak; np.head.look = bak('necmi', np, t < tm.d2 ? HEAD('hikmet') : HEAD('defne')); }
  // sayaç: zarlara bakar, eli çenede; Kerem'in avucuna bakar
  let nCene = 0;
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.dusun; np.head.look = bak('necmi', np, [Z2.r[0] + 60, 1130]);
    nCene = pIn(t, c0 + 0.6, c0 + 3.8, 0.35);
    if (nCene > 0.01) nO.R = [cene('necmi', np, 1), nCene, 'B'];
    if (t >= c0 + 4.0 && t < tm.kAl) np.head.look = Math.floor((t - c0 - 4.0) / 1.2) % 2 ? bak('necmi', np, HEAD('hikmet')) : bak('necmi', np, ZARLAR);
    if (t >= tm.kAl + 0.2) { np.head.look = bak('necmi', np, avuc); np.expr = IF.merak; }
  }
  if (id === 'cevap') np.head.look = bak('necmi', np, HEAD('defne'));

  // ——— Hikmet ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, expr: IF.emin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads };
  hp.head.look = t < tm.duses - 0.3 ? bak('hikmet', hp, HEAD('necmi')) : bak('hikmet', hp, ZARLAR);
  if (t >= tm.siz - 0.1 && t < tm.necKes) { hp.head.look = bak('hikmet', hp, HEAD('necmi')); }
  if (t >= tm.necKes && t < tm.hikKes) hp.head.look = t < tm.atis ? bak('hikmet', hp, HEAD('necmi')) : t < tm.n3 ? bak('hikmet', hp, ZARLAR) : bak('hikmet', hp, HEAD('necmi'));
  // h2: "iki" sol elde iki parmak (başın yanında), "benim bir" tek parmak; "Kabul etmem" sağ elle zarları geri iter
  let hParmak = 0, hN = 2;
  if (t >= tm.hikKes && t < tm.defKes) {
    hp.expr = IF.ciddi; hp.head.look = bak('hikmet', hp, HEAD('necmi'));
    hParmak = pIn(t, tm.iki - 0.3, tm.kabul - 0.15, 0.28, 0.3);
    hN = t < tm.benim - 0.05 ? 2 : 2 - ease.state(seg(t, tm.benim - 0.05, 0.2));
    if (hParmak > 0.01) hO.R = [[yer('hikmet') + 78, 1032], hParmak, 'A'];
    if (t >= tm.benim - 0.1 && t < tm.kabul) hp.head.look = [0.02, 0.05];
  }
  const wItt = pIn(t, tm.itt - 0.3, tm.itt + 0.6, 0.28, 0.3);
  if (wItt > 0.01) {
    const u = ease.state(seg(t, tm.itt, 0.45));
    hO.R = [[lerp(Z1.b[0], Z2.b[0], u) + 62, ZY - 60], wItt, 'A'];
    hp.head.look = bak('hikmet', hp, ZARLAR); hp.expr = IF.emin;
  }
  if (t >= tm.defKes && t < tm.sayac) { hp.expr = IF.notr; hp.head.look = bak('hikmet', hp, HEAD('defne')); }
  if (sayacta) {
    const c0 = tm.cd0; hp.expr = IF.emin; hp.head.look = bak('hikmet', hp, ZARLAR);
    if (t >= c0 + 3.8 && t < tm.kAl) hp.head.look = Math.floor((t - c0 - 3.8) / 1.3) % 2 ? bak('hikmet', hp, HEAD('defne')) : bak('hikmet', hp, ZARLAR);
    if (t >= tm.kAl + 0.35) { hp.head.look = bak('hikmet', hp, avuc); hp.expr = IF.merak; }
  }
  if (id === 'cevap') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Defne ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, expr: IF.sakin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  dp.head.look = t < tm.duses - 0.3 ? bak('defne', dp, HEAD('necmi')) : bak('defne', dp, ZARLAR);
  if (t >= tm.hikKes && t < tm.defKes) { dp.head.look = bak('defne', dp, HEAD('hikmet')); dp.expr = IF.supheli; }
  // d2: "Bence acele etmeyin" sol el avuç dışa (Hikmet'e doğru); "Kimin şansı" zarlara bakar, omuz silker
  let dAvuc = 0;
  if (t >= tm.defKes && t < tm.sayac + 0.3) {
    dp.expr = IF.ciddi; dp.head.look = bak('defne', dp, HEAD('hikmet'));
    dAvuc = pIn(t, tm.d2 - 0.1, tm.kimin - 0.1, 0.28, 0.3);
    if (dAvuc > 0.01) dO.L = [[yer('defne') - 118, 1018], dAvuc, 'A'];
    if (t >= tm.kimin - 0.1) { dp.head.look = bak('defne', dp, ZARLAR); }
    if (t >= tm.yuksek - 0.1) { H.omuzSilk(dp, t, tm.yuksek, Math.max(0.2, tm.d2s - tm.yuksek - 0.2)); dp.head.look = bak('defne', dp, HEAD('hikmet')); }
  }
  let dParmak = false;
  if (sayacta) {
    const c0 = tm.cd0; dp.expr = IF.dusun; dp.head.look = bak('defne', dp, ZARLAR);
    const dThink = pIn(t, c0 + 0.5, c0 + 4.2, 0.35);
    if (dThink > 0.01) { const h = H.eklem('defne', dp, 'head'); dO.R = [[h[0] + 0.43 * dp.s, h[1] + 0.4 * dp.s], dThink, 'B']; dParmak = dThink > 0.6; dp.head.look = [-0.3 + 0.1 * Math.sin(TAU * (t - c0) / 2.3), 0.3]; }
    dp.head.tilt = 4 * Math.sin(TAU * (t - c0) / 3.1);
    if (t >= tm.kAl + 0.1) { dp.head.look = bak('defne', dp, avuc); dp.expr = IF.merak; }
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Kerem (genc; konuşmaz) ———
  const kp = H.kisi(H.KEREM, { x: yer('genc'), y: Y.genc, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const kO = { heads, sessiz: true };
  kp.head.look = t < tm.duses - 0.3 ? bak('genc', kp, HEAD('necmi')) : bak('genc', kp, ZARLAR);
  if (t >= tm.n3 && t < tm.sayac) kp.head.look = bak('genc', kp, HEAD(t < tm.h2 ? 'necmi' : t < tm.d2 ? 'hikmet' : 'defne'));
  let kTut = false, kAcik = 0;
  if (sayacta) {
    const c0 = tm.cd0; kp.expr = IF.dusun;
    kp.head.look = t < c0 + 2 ? bak('genc', kp, ZARLAR) : Math.floor((t - c0 - 2) / 1.2) % 2 ? bak('genc', kp, HEAD('hikmet')) : bak('genc', kp, ZARLAR);
    const wAl = W(t, tm.kAl - 0.3, 0.3);
    if (wAl > 0.01) {
      const u = ease.enter(seg(t, tm.kAl + 0.28, 0.45));
      const el = kar([Z2.r[0] + 60, ZY - 46], [avuc[0] - 70, avuc[1] + 12], u);
      kO.R = [el, wAl, 'A']; kTut = t >= tm.kAl && t < tm.kAl + 0.73; kAcik = ease.state(seg(t, tm.kAl + 0.62, 0.25));
      kp.head.look = bak('genc', kp, t < tm.kKir + 0.8 ? zr.r.p : t < tm.kBey + 0.6 ? zr.b.p : HEAD('defne'));
      kp.expr = t >= tm.kBey + 0.6 ? IF.sakin : IF.merak;
    }
  }
  if (id === 'cevap') kp.head.look = bak('genc', kp, HEAD('defne'));

  // ——— Çizim: karakterler → masa → tavla → bardaklar → zarlar → tutan eller ———
  const tlTum = S.tlS;
  const kc = oyna(K, t, tlTum, H.KEREM, kp, kO);
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  masa(K);
  tavla(K);
  for (const [key, pp, r, o] of [[H.KEREM, kp, kc, kO], ['necmi', np, nc, nO], ['hikmet', hp, hc, hO], ['defne', dp, dc, dO]]) for (const sd of ['L', 'R']) if (o[sd] && (o[sd][1] ?? 1) > 0.05) kolOn(K, key, pp, r, sd);
  // çay bardakları ve buhar
  if (bU > 0.01) K.ell(CAY.necmi[0], CAY.necmi[1] - 3, 34, 8, PAL.cream, 2.5);
  bardak(K, cayN, 1, bU < 0.01);
  bardak(K, CAY.hikmet, 1);
  simit(K, [850, 1236]);
  H.buhar(K, cayN[0], cayN[1] - 76, t, { k: 0.5, n: 2 });
  H.buhar(K, CAY.hikmet[0], CAY.hikmet[1] - 76, t + 0.9, { k: 0.5, n: 2 });
  // Kerem'in avucu (zarların altında açık avuç)
  if (kAcik > 0.01) {
    const c = H.CARDS.genc, hr = c.arm.hand * kp.s, ctx0 = K.ctx;
    const lw = c.line * kp.s, rx = lerp(hr, hr * 2.8, kAcik), ry = lerp(hr, hr * 0.85, kAcik);
    K.ell(avuc[0] - 4, avuc[1] + 10, rx, ry, c.skin, lw);
    // dört parmak ucu avucun sağ ucunda yukarı kıvrılır; başparmak solda, kırmızı zarın yanında
    for (let i = 0; i < 4; i++) { const a = -0.25 + i * 0.32; K.circ(avuc[0] - 4 + rx * (0.78 + 0.1 * Math.cos(a)), avuc[1] + 4 - ry * 0.4 + i * 7 * kAcik, hr * 0.42, c.skin, lw * 0.8); }
    ctx0.save(); ctx0.lineCap = 'round'; H.strokeLine(ctx0, [avuc[0] - rx * 0.7, avuc[1] + 8], [avuc[0] - rx * 0.92, avuc[1] - 30 * kAcik], hr * 0.55 + lw * 1.6, INK); H.strokeLine(ctx0, [avuc[0] - rx * 0.7, avuc[1] + 8], [avuc[0] - rx * 0.92, avuc[1] - 30 * kAcik], hr * 0.55, c.skin); ctx0.restore();
  }
  zar(K, zr.r.p, 'r', zr.r.n, { s: zr.r.s || ZS, rot: zr.r.rot, sx: zr.r.sx });
  zar(K, zr.b.p, 'b', zr.b.n, { s: zr.b.s || ZS, rot: zr.b.rot, sx: zr.b.sx });
  // tutan eller (nesnenin üstünde)
  if (nTut) nc.tut('R');
  if (nIsaret) nc.isaret('R', nIsaret);
  if (nAvuc > 0.6) nc.parmak('R', 4, { toplam: 4, yon: -0.5, ac: 0.32, boy: 0.7 });
  if (nCene > 0.6) nc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (wCay > 0.5) nc.tut('L');
  if (hParmak > 0.6) hc.parmak('R', hN, { toplam: 2, yon: -Math.PI / 2 + 0.15, ac: 0.42, boy: 0.9 });
  if (wItt > 0.5) hc.tut('R');
  if (dAvuc > 0.6) dc.parmak('L', 4, { toplam: 4, yon: -Math.PI / 2 - 0.35, ac: 0.3, boy: 0.8 });
  if (dParmak) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (kTut) kc.tut('R');
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
