// Bölüm 31 · KİTAP KURDU (v4 "hikâye" dili; storyboard: hikayeler/bolum_031_v5.md).
// Logline: Arşivde bir güve, rafta yan yana duran iki kalın cildi yalnızca 1 santimde baştan sona geçmiştir. Hikmet
// "ölçme, bak" der ve birinci cildi açar; Defne cevabı rafa sırtı dönük duran kitabın kapağında bulur.
// Akılda kalacak tek şey: rafta duran bir kitabın ilk sayfası sağ uçtadır.
// Yön sözleşmesi: rafta sırt bize dönük, ön kapak SAĞ yüzdedir. Cilt (üstten bakışla) saat yönünde `th` kadar dönünce sağ
// yüz bize gelir, sırt solda kalır; kapak sırt kenarından sola açılır. Bütün yüzler tek eğik izdüşümden (geo) çıkar.
// Her şey t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur. Ortak motor: hikaye.js + mekan.js.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const ARS = 'b031_arsiv', RAF_Y = 1340;
const CM = 54, SW = 5 * CM, KP = CM / 2, BH = 350, DP = 230, KE = 0.125;   // cilt: sırt 5 cm (0,5 + 4 + 0,5), boy, derinlik, eğiklik
const DELIK_H = 238, PEN = [168, BH - 14], ACI = 140 * H.D2R;               // deliğin yüksekliği · kesit penceresi · kapağın açılma açısı
const X1 = 270, X2 = 540, ILK = X2 - KP, SON = X2 + KP, TUNEL_Y = RAF_Y - DELIK_H;   // ILK: 1. cildin ilk sayfası · SON: 2. cildin son sayfası
const HIK_X = 108, DEF_X = 945, NX = 1650;
const ELDE = { hx: 160, y: 1380, th: 64 * H.D2R };                           // Hikmet'in elindeki 1. cilt
const METRE_RAF = [858, RAF_Y - 36], OLC = [822, 940], METRE_BOY = 9 * CM;   // şerit metre: raftaki yeri · ölçerken kasanın yeri · 9 cm
const DEF = { sw: 120, bh: 300, dp: 210 }, D_ELDE = { hx: NX + 34, y: 1432, th: 68 * H.D2R }, D_RAF = { hx: NX + 270, y: RAF_Y, th: 0 };   // Necmi'nin defteri
const KAPAK = '#A8322B', KAPAK2 = '#8E2A2E', SAYFA = '#FBF6EC', KENAR2 = '#CDBF9F', YALDIZ = '#E3B94F', OYUK = '#2A1E17', ICKAPAK = '#E6D9BC';

// ——— küçük yardımcılar ———
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));                                          // 0 → 1 (a'da başlar)
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));               // a'da tam, b'den sonra bırakır
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// İz (hedefi işlev olabilen): anahtarlar [t, nokta | () => nokta, süre = 0.3, eğri, lift]
function izF(keys, t) {
  const val = k => typeof k === 'function' ? k() : k; let v = val(keys[0][1]);
  for (const [tk, tgt, d = 0.3, curve = ease.state, lift = 0] of keys) { if (tk > t) break; const u = d > 0 ? curve(seg(t, tk, d)) : 1, g = val(tgt); v = [lerp(v[0], g[0], u), lerp(v[1], g[1], u) - lift * 4 * u * (1 - u)]; }
  return v;
}
// Ön kol + el, nesnenin ÜSTÜNE (kitaplık ve ciltler karakterden sonra çizilir; uzanan kol altta kalmasın)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}
// Eğik yüz: yol yüzün kendi koordinatında kurulur, çizgi kalınlığı dünyada kalır (yüz daralınca çizgi incelmez)
const yuz = (K, o, u, v, yol, fill, lw = LW) => { const { ctx } = K; ctx.save(); ctx.transform(u[0], u[1], v[0], v[1], o[0], o[1]); ctx.beginPath(); yol(ctx); ctx.restore(); K.fs(fill, lw); };
const icinde = (K, o, u, v, fn) => { const { ctx } = K; ctx.save(); ctx.transform(u[0], u[1], v[0], v[1], o[0], o[1]); fn(); ctx.restore(); };
const ASAGI = [0, 1];

// ═══════════════════════════ Cilt ═══════════════════════════
// o = { hx, y: ön-sağ alt köşe (sırtın sağ kenarı = kapağın menteşesi), th: dönüş (0 = rafta, sırt bize dönük),
//       yat: sola yatma (rad; sol alt köşe çevresinde), ac: kapak 0..1, cevir: [sayfa 0..1 …], kesit: sırtın açılması 0..1,
//       sayfa: [s, renk, nabız] (kesitte işaretli sayfa), tunel: [s0, s1], pen: [s0, s1] (kesit penceresi), kart: [s, nabız],
//       no: sırttaki rakam, nab: rakamın nabzı, delik: ön kapakta delik, sw / bh / dp / renk / renk2 (defter için) }
// Noktalar: S(s, h) sırt yüzü (s soldan, h yukarı) · F(d, h) ön kapak yüzü (d menteşeden) · U(s, d) üst yüz · B(fi, d, h) açılan yaprak
function geo(o) {
  const th = o.th || 0, c = Math.cos(th), s = Math.sin(th), sw = o.sw ?? SW, bh = o.bh ?? BH, dp = o.dp ?? DP, { hx, y } = o;
  const yat = o.yat || 0, piv = [hx - sw, y], cc = Math.cos(-yat), ss = Math.sin(-yat);
  const R = p => { if (!yat) return p; const dx = p[0] - piv[0], dy = p[1] - piv[1]; return [piv[0] + dx * cc - dy * ss, piv[1] + dx * ss + dy * cc]; };
  return {
    sw, bh, dp, th, us: [c, s * KE], ud: [s, -c * KE], piv,
    S: (q, h) => R([hx - (sw - q) * c, y - (sw - q) * s * KE - h]),
    F: (d, h) => R([hx + d * s, y - d * c * KE - h]),
    U: (q, d) => R([hx - (sw - q) * c + d * s, y - (sw - q) * s * KE - bh - d * c * KE]),
    B: (fi, d, h) => { const be = th + fi * ACI; return [hx + d * Math.sin(be), y - d * Math.cos(be) * KE - h]; },
  };
}
function cilt(K, o) {
  const { ctx } = K, g = geo({ ...o, yat: 0 }), { sw, bh, dp, th, us, ud } = g, renk = o.renk || KAPAK, renk2 = o.renk2 || KAPAK2;
  const ac = o.ac || 0, cev = o.cevir || [], cevrilen = cev.filter(v => v > 0.5).length;
  ctx.save();
  if (o.yat) { ctx.translate(g.piv[0], g.piv[1]); ctx.rotate(-o.yat); ctx.translate(-g.piv[0], -g.piv[1]); }
  // ——— üst yüz: kapak kartonu · sayfa bloğu · kapak kartonu ———
  const U0 = g.U(0, 0), kp = sw * KP / SW, onKart = ac < 0.02;
  yuz(K, U0, us, ud, x => x.rect(0, 0, onKart ? sw : sw - kp, dp), renk2);
  yuz(K, U0, us, ud, x => x.rect(kp, 0, sw - 2 * kp, dp - 6), SAYFA, LW * 0.6);
  icinde(K, U0, us, ud, () => { for (let q = kp + 7; q < sw - kp - 3; q += 7) K.line(q, 3, q, dp - 9, 1.6, KENAR2); });
  // ——— sırt yüzü ———
  const S0 = g.S(0, 0);
  yuz(K, S0, us, ASAGI, x => x.roundRect(0, -bh, sw, bh, 6), renk);
  icinde(K, S0, us, ASAGI, () => {
    for (const hh of [bh - 30, bh - 48]) K.rect(10, -hh, sw - 20, 7, YALDIZ, 0);
    if (o.no) { const nb = 1 + 0.16 * (o.nab || 0); ctx.save(); ctx.translate(sw / 2, -92); ctx.scale(nb, nb); K.rect(-80, -60, 160, 120, PAL.cream, LW * 0.7, 12); K.text(o.no, 0, 38, 104, INK, 900); ctx.restore(); }
    else { K.rect(18, -bh + 84, sw - 36, 96, PAL.cream, LW * 0.6, 8); for (let i = 0; i < 2; i++) K.line(34, -bh + 116 + i * 30, sw - 34 - i * 18, -bh + 116 + i * 30, 7, '#CFC4AA'); }
  });
  // ——— kesit: sırt bezi yukarıdan aşağı açılır; içeride kapak kartonu, sayfa bloğu, güvenin tüneli ———
  if (o.kesit > 0.01) {
    const [p0, p1] = o.pen || [8, sw - 8], y1 = -PEN[1], hT = PEN[1] - PEN[0], hgt = hT * o.kesit;
    icinde(K, S0, us, ASAGI, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(p0, y1, p1 - p0, hgt); ctx.clip();
      K.rect(0, y1, sw, hT, SAYFA, 0);
      for (let q = KP + 6; q < sw - KP - 2; q += 7) K.line(q, y1, q, y1 + hT, 2, KENAR2);
      for (const [q, i] of [[0, 0], [sw - KP, 1]]) K.rect(q, y1 - 4, KP, hT + 8, o.kart && o.kart[0] === i ? H.mixHex(renk2, PAL.mustard, clamp01(o.kart[1])) : renk2, LW * 0.6);
      if (o.sayfa) { const [q, col, nb] = o.sayfa; K.line(q, y1 + 6, q, y1 + hT - 6, 15 + 6 * nb, INK); K.line(q, y1 + 6, q, y1 + hT - 6, 9 + 6 * nb, col); }
      if (o.tunel) K.rect(o.tunel[0], -DELIK_H - 17, o.tunel[1] - o.tunel[0], 34, OYUK, 0);
      ctx.restore();
      ctx.beginPath(); ctx.rect(p0, y1, p1 - p0, hgt); ctx.lineWidth = LW * 0.8; ctx.strokeStyle = INK; ctx.stroke();
      if (o.kesit < 0.995) K.rect(p0 - 4, y1 + hgt - 8, p1 - p0 + 8, 16, renk2, LW * 0.7, 8);   // kıvrılan bez
    });
  }
  // ——— ön kapak yüzü (cilt döndüyse), açılan kapak ve çevrilen sayfalar ———
  if (th > 0.01) {
    const F0 = g.F(0, 0);
    if (ac > 0.01) {   // kapağın altı: en üstteki sayfa (ilk sayfada delik; sonrakiler deliksiz)
      yuz(K, F0, ud, ASAGI, x => x.rect(0, -bh + 5, dp - 6, bh - 10), SAYFA, LW * 0.8);
      icinde(K, F0, ud, ASAGI, () => {
        for (let i = 0; i < 7; i++) { const yy = -bh + 52 + i * 38; if (cevrilen === 0 && Math.abs(yy + DELIK_H) < 30) continue; K.line(24, yy, dp - 34 - (i % 2) * 34, yy, 7, '#DDD2B8'); }
        if (cevrilen === 0) K.ell(dp / 2, -DELIK_H, 15, 15, OYUK, LW * 0.6);
      });
    }
    const yaprak = (fi, tur) => {   // tur: 0 kapak · 1 ilk sayfa (delikli) · 2 deliksiz sayfa
      const be = th + fi * ACI, sb = Math.sin(be), u = [sb, -Math.cos(be) * KE], dis = sb >= 0;
      const fill = tur === 0 ? (dis ? renk : ICKAPAK) : dis ? SAYFA : '#F1E8D2';
      yuz(K, F0, u, ASAGI, x => tur === 0 ? x.roundRect(0, -bh, dp, bh, 6) : x.rect(0, -bh + 5, dp - 6, bh - 10), fill, tur === 0 ? LW : LW * 0.7);
      icinde(K, F0, u, ASAGI, () => {
        if (tur === 0 && dis) { ctx.beginPath(); ctx.roundRect(16, -bh + 16, dp - 32, bh - 32, 6); ctx.lineWidth = 6; ctx.strokeStyle = YALDIZ; ctx.stroke(); if (o.amblem) K.poly([[dp / 2, -bh / 2 - 46], [dp / 2 + 36, -bh / 2], [dp / 2, -bh / 2 + 46], [dp / 2 - 36, -bh / 2]], YALDIZ, LW * 0.6); }
        if (tur > 0) for (let i = 0; i < 7; i++) { const yy = -bh + 52 + i * 38; if (tur === 1 && Math.abs(yy + DELIK_H) < 30) continue; K.line(24, yy, dp - 34 - (i % 2) * 34, yy, 7, '#DDD2B8'); }
        if (tur < 2 && o.delik) K.ell(dp / 2, -DELIK_H, 15, 15, OYUK, LW * 0.6);
      });
    };
    yaprak(ac, 0);
    cev.forEach((v, i) => { if (v > 0.001) yaprak(v, i === 0 ? 1 : 2); });
  }
  ctx.restore();
}
// Yalnız sırtı görünen komşu kitap (Necmi'nin rafı): (x, y) sol alt
function sirt(K, x, y, w, h, renk, renk2, kabar = 0) {
  const { ctx } = K; ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(1 + 0.07 * kabar, 1 + 0.05 * kabar); ctx.translate(-w / 2, 0);
  K.rect(0, -h - DEF.dp * KE, w, DEF.dp * KE + 4, renk2); K.rect(8, -h - DEF.dp * KE + 5, w - 16, DEF.dp * KE - 8, SAYFA, LW * 0.5);
  K.rect(0, -h, w, h, renk, LW, 5); K.rect(8, -h + 26, w - 16, 7, YALDIZ, 0); K.rect(14, -h + 70, w - 28, 80, PAL.cream, LW * 0.6, 6);
  for (let i = 0; i < 2; i++) K.line(26, -h + 96 + i * 26, w - 26 - i * 14, -h + 96 + i * 26, 6, '#CFC4AA');
  ctx.restore();
}

// ═══════════════════════════ Güve, şerit metre, kitaplık ═══════════════════════════
// Güve: (x, y) gövdenin ortası. uc: 0 konmuş (kanat yavaş açılıp kapanır) · 1 uçuyor (hızlı çırpar). rot: baş yönü (0 = yukarı).
function guve(K, [x, y], t, { k = 0.8, uc = 0, rot = 0, kapali = 0 } = {}) {
  const { ctx } = K, hizli = 0.3 + 0.7 * Math.abs(Math.sin(t * 43)), yavas = 0.8 + 0.2 * Math.sin(t * 5.2), w = lerp(lerp(yavas, hizli, clamp01(uc * 2)), 0.2, kapali), lw = LW * 0.62 / k;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  for (const m of [-1, 1]) {
    ctx.save(); ctx.scale(m * w, 1);
    ctx.beginPath(); ctx.moveTo(4, -12); ctx.quadraticCurveTo(34, -50, 56, -28); ctx.quadraticCurveTo(58, 4, 32, 18); ctx.quadraticCurveTo(12, 22, 4, 8); ctx.closePath();
    ctx.restore(); K.fs('#EADDBE', lw);
    ctx.save(); ctx.scale(m * w, 1); K.circ(36, -18, 8, '#B9945A', 0); K.circ(27, 4, 5, '#C9A871', 0); ctx.restore();
  }
  K.ell(0, 2, 10, 22, '#8A6A45', lw);
  for (const m of [-1, 1]) { ctx.beginPath(); ctx.moveTo(m * 5, -28); ctx.quadraticCurveTo(m * 12, -46, m * 20, -48); ctx.lineWidth = 3.5 / k; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); }
  K.circ(0, -22, 12.5, '#8A6A45', lw);
  for (const m of [-1, 1]) { K.circ(m * 6.5, -24, 6.2, '#FFFFFF', lw * 0.55); K.circ(m * 6.5 + 1, -23, 2.8, INK, 0); }
  ctx.restore();
}
// Şerit metre: c kasanın merkezi, fi dilin yönü (0 = sola, + yukarı), L dilin boyu; vurgu = [[u0, u1, renk, a] …] (dilin oranı)
function metre(K, c, fi, L, vurgu = []) {
  const { ctx } = K; ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(fi);
  if (L > 2) {
    K.rect(-39 - L, -13, L + 6, 26, '#F6D86B', LW * 0.7, 2);
    for (const [u0, u1, renk, a] of vurgu) if (a > 0.01) { ctx.save(); ctx.globalAlpha = a; K.rect(-39 - L * u1, -11, L * (u1 - u0), 22, renk, 0); ctx.restore(); }
    for (let q = 0; q <= L - 4; q += CM / 2) K.line(-39 - q, -12, -39 - q, (q / (CM / 2)) % 2 ? -4 : 3, 3);
    K.rect(-39 - L - 5, -15, 8, 40, '#9AA6A0', LW * 0.6, 2);   // uçtaki tırnak
  }
  K.rect(-39, -35, 78, 70, '#E8B23A', LW, 14); K.circ(4, 0, 17, '#4A4F57', LW * 0.6); K.circ(4, 0, 5, '#E8B23A', 0); K.rect(-44, -16, 10, 32, '#4A4F57', LW * 0.5, 3);
  ctx.restore();
}
function kitaplik(K, x, w) {
  K.rect(x + 12, RAF_Y + 30, w - 24, 250, PAL.woodDark, LW, 4); K.rect(x + 34, RAF_Y + 62, w - 68, 190, '#5E3F22', LW * 0.7, 4);
  [['#8FA093', 150], ['#B9A27A', 170], ['#6E8B8A', 140], ['#7E6B55', 164], ['#B9A27A', 150], ['#8FA093', 172], ['#6E8B8A', 156]].forEach(([c, h], i) => { if (x + 52 + i * 78 + 70 < x + w - 40) K.rect(x + 52 + i * 78, RAF_Y + 252 - h, 66, h, c, LW * 0.7, 4); });
  K.rect(x + 8, RAF_Y - DP * KE - 6, w - 16, DP * KE + 8, '#D8A66A', LW * 0.7); K.rect(x, RAF_Y, w, 36, PAL.woodTop, LW, 6);
}
function saksi(K, x, y, t) {
  for (let i = 0; i < 5; i++) H.yaprak(K, x, y - 70, 104 + (i % 2) * 32, -0.9 + i * 0.45 + 0.05 * Math.sin(t * 1.3 + i), i % 2 ? PAL.green : '#4C8240', 1);
  K.poly([[x - 44, y - 80], [x + 44, y - 80], [x + 32, y], [x - 32, y]], '#B5673F', LW);
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ARS, {
  gen: [-700, 3000], dongu: ['duvar saatinin saniye kolu', 'saksının yaprakları (Necmi tarafı); güvenin kanatları nesne döngüsüdür'],
  capa: { dikis: [X2, RAF_Y - BH], ilk: [ILK, TUNEL_Y], son: [SON, TUNEL_Y], metre: METRE_RAF, defterYeri: [D_RAF.hx - DEF.sw / 2, RAF_Y] },
  kadraj: { genis: [1.0, 540, 1075], ciltler: [1.15, 520, 1095], ust: [1.3, 470, 1085], olcu: [1.18, 620, 1085], hikmet: [1.28, 255, 1150], sayac: [0.96, 540, 1060], ipucu: [1.25, NX + 250, 1160], buldum: [1.35, 905, 1020], kesit: [1.45, 540, 1150], espri: [1.18, 330, 1040], cta: [1.38, 940, 1020] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 3000, isik, duvar: 'duz', zemin: 'karo' });
    M.duvarSaati(K, 318, 800, 44, 10.4, t); M.duvarSaati(K, NX + 470, 842, 46, 10.4, t);
    K.rect(NX + 150, 800, 200, 76, PAL.cream, LW * 0.7, 6); K.text(K.up('arşiv'), NX + 250, 856, 46, INK, 900);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    in: 0.3, h1Iki: T('h1:2'), h1Bir: T('h1:4'),
    h2a: T('h2a'), bir: T('h2a:0'), iki: T('h2a:5'), h2aSon: T('h2a>'),
    h2b: T('h2b'), dort: T('h2b:1'), kapak: T('h2b:4'), yarim: T('h2b:5'), nasil: T('h2b:7'),
    d2: T('d2'), al: T('d2') - 0.62, ger: T('d2') - 0.02, s4: T('d2:4'), s1: T('d2:6'), s44: T('d2:9'),
    hd: T('hd'), sar: T('hd') + 0.02, cek: T('hd') + 0.3, elde: T('hd') + 0.9, ac: T('hd:1') + 0.16, ilkS: T('hd:2'), delik: T('hd:5'),
    cev1: T('hd:6') - 0.12, cev2: T('hd:6') + 0.26, cev3: T('hd:6') + 0.62, yanlis: T('hd:7') + 0.12,
    cd, cd0, kapat: cd0 + 0.1, geri: cd0 + 0.5, yerinde: cd0 + 1.15, birak: cd - 0.42,
    clue: T('n1'), rafa: T('n1:1'), koy: T('n1:4'), kapagi: T('n1:5'), bakar: T('n1:7'),
    buldum: T('d3'), ilkSag: T('d3:1'), proof: T('d3>') + 0.05,
    d4: T('d4'), kesit: T('d4') - 0.22, c1: T('d4:1'), ilk: T('d4:3'), sag: T('d4:5'), c2: T('d4:6'), son: T('d4:8'), sol: T('d4:10'),
    d5: T('d5'), dal: T('d5') - 0.25, gir: T('d5:2') - 0.1, cik: T('d5:4') + 0.25, y1: T('d5:5'), y2: T('d5:7'), birCm: T('d5:8'), santim: T('d5:9'), d5Son: T('d5>'),
    h4: T('h4'), kon: T('h4:1'), benden: T('h4:3'),
    cta: T('d6') - 0.15, kurdu: T('d6:2'), end: T('d6>') + 0.1,
  };
  tm.hikKes = tm.hd + 0.56;   // nesne taşıma kesmesi: 1. cilt yoldayken
  const kd = ad => M.kadraj(ARS, ad);
  const film = H.sahneler([
    { id: 'ac', t0: 0, cam: [[0, ...kd('genis')], [0.9, 1.07, 528, 1078], [tm.h2a - 0.05, ...kd('ciltler')], [tm.h2b - 0.05, ...kd('ust')]] },
    { id: 'olcu', t0: tm.d2 - 0.1, cam: [[0, ...kd('olcu')], [tm.s4 - 0.2, 1.22, 612, 1080]] },
    { id: 'hik', t0: tm.hikKes, cam: [[0, ...kd('hikmet')], [tm.delik - 0.2, 1.32, 262, 1152]] },
    { id: 'sayac', t0: tm.cd0 - 0.15, cam: [[0, ...kd('sayac')], [tm.cd0 + 2.6, 0.98, 545, 1062]] },
    { id: 'ipucu', t0: tm.clue - 0.1, cam: [[0, ...kd('ipucu')], [tm.kapagi - 0.1, 1.3, NX + 290, 1165]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...kd('buldum')]] },
    { id: 'kesit', t0: tm.proof, cam: [[0, ...kd('kesit')], [tm.d5 - 0.1, 1.45, 546, 1144], [tm.d5Son + 0.12, 1.24, 540, 1110]] },
    { id: 'espri', t0: tm.h4 - 0.3, cam: [[0, ...kd('espri')], [tm.benden, 1.22, 322, 1036]] },
    { id: 'cta', t0: tm.cta, cam: [[0, ...kd('cta')], [tm.cta + 1.2, 1.42, 944, 1016]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— Hikmet ———
  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: 5, look: [0.75, 0.5] }, ...POZ.rahat });
  const hik = [
    [0.55, { head: { tilt: 4, look: [0.9, 0.1] } }, 0.35],
    [tm.h1Bir, { head: { tilt: 6, look: [0.8, 0.4] } }, 0.3],
    [tm.h2a - 0.2, { expr: 'notr', head: { tilt: 5, look: [0.7, 0.55] } }, 0.3],
    [tm.iki - 0.1, { head: { tilt: 2, look: [0.95, 0.3] } }, 0.3],
    [tm.h2b - 0.1, { lean: 4, head: { tilt: 6, look: [0.75, 0.35] } }, 0.3],
    [tm.nasil - 0.1, { expr: 'mutlu', lean: 0, head: { tilt: 5, look: [0.95, 0.05] } }, 0.3],
    [tm.d2 - 0.2, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.2] } }, 0.3],
    [tm.hd - 0.1, { expr: 'kizgin', lean: 5, head: { tilt: 6, look: [0.9, 0.25] } }, 0.22, ease.enter],
    [tm.cek + 0.1, { expr: 'notr', lean: 0, head: { tilt: 8, look: [0.55, 0.7] } }, 0.3],
    [tm.elde, { head: { tilt: 9, look: [0.3, 0.9] } }, 0.3],
    [tm.yanlis - 0.1, { expr: 'mutlu', head: { tilt: 4, look: [0.9, 0.1] } }, 0.3],
    [tm.kapat, { expr: 'notr', head: { tilt: 7, look: [0.5, 0.8] } }, 0.3],
    [tm.yerinde + 0.2, { armL: POZ.belde.armL, head: { tilt: 3, look: [0.6, -0.5] } }, 0.35],
    [tm.cd0 + 3.2, { head: { tilt: -3, look: [0.9, -0.2] } }, 0.5],
    [tm.buldum, { expr: 'saskin', head: { tilt: 2, look: [0.95, 0] } }, 0.25],
    [tm.proof, { expr: 'saskin', armL: POZ.rahat.armL, lean: 5, head: { tilt: 6, look: [0.9, 0.45] } }, 0.01],
    [tm.h4 - 0.3, { expr: 'yorgun', lean: 0, head: { tilt: 0, look: [0.15, -1] } }, 0.01],
    [tm.benden - 0.1, { head: { tilt: 5, look: [0.9, -0.1] } }, 0.3],
  ];
  // ——— Defne ———
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: -5, look: [-0.85, 0.3] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: -3, look: [-0.7, 0.05] } }, 0.4],
    [tm.h1Bir + 0.3, { expr: 'notr', head: { tilt: -6, look: [-0.95, -0.05] } }, 0.35],
    [tm.h2a + 0.1, { head: { tilt: -4, look: [-0.85, 0.35] } }, 0.3],
    [tm.nasil, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -8, look: [-0.5, -0.3] } }, 0.4],
    [tm.al - 0.1, { expr: 'mutlu', armR: POZ.dur.armR, lean: 2, head: { tilt: -5, look: [-0.6, 0.6] } }, 0.3],
    [tm.ger, { lean: 4, head: { tilt: -7, look: [-0.85, 0.25] } }, 0.3],
    [tm.hd + 0.05, { expr: 'saskin', lean: 0, head: { tilt: -2, look: [-0.95, 0.2] } }, 0.25, ease.enter],
    [tm.yanlis, { expr: IFADE.dusun, head: { tilt: -7, look: [-0.8, 0.3] } }, 0.35],
    [tm.cd0 + 0.25, { ...POZ.dusun, head: { tilt: -6, look: [-0.5, -0.3] } }, 0.35],
    [tm.cd - 0.55, { armR: POZ.dur.armR, expr: 'notr', head: { tilt: 4, look: [0.9, 0.05] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', ...POZ.yukari, head: { tilt: 6, look: [0, -0.3] } }, 0.25, ease.enter],
    [tm.ilkSag - 0.1, { head: { tilt: -6, look: [-0.85, 0.3] } }, 0.25],
    [tm.proof, { armR: POZ.dur.armR, lean: -9, head: { tilt: -6, look: [-0.9, 0.35] } }, 0.01],
    [tm.h4 - 0.3, { lean: 0, armR: { sh: 38, el: -118 }, head: { tilt: -7, look: [-0.95, -0.1] } }, 0.01],
  ];
  // ——— Necmi ———
  const necBase = kisi('necmi', { x: NX, expr: 'mutlu', head: { tilt: 3, look: [0.25, 0.75] }, ...POZ.rahat });
  const nec = [
    [tm.clue - 0.05, { head: { tilt: -5, look: [-0.8, 0] } }, 0.3],
    [tm.rafa - 0.1, { expr: 'notr', lean: 6, head: { tilt: 7, look: [0.75, 0.45] } }, 0.35],
    [tm.kapagi - 0.15, { expr: 'mutlu', head: { tilt: 8, look: [0.85, 0.35] } }, 0.3],
    [tm.bakar + 0.3, { lean: 0, head: { tilt: -5, look: [-0.8, 0] } }, 0.35],
  ];
  return { tm, film, hik, hikBase, def, defBase, nec, necBase };
}

// ═══════════════════════════ t anındaki durumlar ═══════════════════════════
// 1. cilt: rafta (yatık → dik) · Hikmet'in elinde (döner, kapak açılır, sayfalar çevrilir) · yine rafta (kesit)
function cilt1At(t, tm) {
  const u = W(t, tm.cek, tm.elde - tm.cek) * (1 - W(t, tm.geri, tm.yerinde - tm.geri)), kapa = 1 - W(t, tm.kapat, 0.3);
  const p = H.yay([X2, RAF_Y], [ELDE.hx, ELDE.y], u, 46);
  return {
    hx: p[0], y: p[1], th: ELDE.th * u, yat: 8 * H.D2R * (1 - seg(t, 0.12, tm.in - 0.12) ** 2), no: '1', delik: true,
    nab: H.nabiz(t, tm.bir) + H.nabiz(t, tm.c1), ac: W(t, tm.ac, 0.44) * kapa,
    cevir: [tm.cev1, tm.cev2, tm.cev3].map(a => W(t, a, 0.3) * kapa),
    kesit: W(t, tm.kesit, 0.55), pen: [8, SW], tunel: [SW - KP - 12, SW + 2], kart: [1, H.nabiz(t, tm.y1, 0.5)],
    sayfa: [SW - KP - 6, t >= tm.ilk - 0.05 ? PAL.mustard : '#BDB08F', H.nabiz(t, tm.ilk) + H.nabiz(t, tm.sag)],
  };
}
const cilt2At = (t, tm) => ({
  hx: X2 + SW, y: RAF_Y, th: 0, no: '2', nab: H.nabiz(t, tm.iki) + H.nabiz(t, tm.c2), kesit: W(t, tm.kesit, 0.55), pen: [0, SW - 8],
  tunel: [-2, KP + 12], kart: [0, H.nabiz(t, tm.y2, 0.5)], sayfa: [KP + 6, t >= tm.son - 0.05 ? PAL.coral : '#BDB08F', H.nabiz(t, tm.son) + H.nabiz(t, tm.sol)],
});
// Necmi'nin defteri: elde (ön kapak bize dönük) → çeyrek tur → raftaki boşluk (sırt dışarıda); "Kapağı…"da sola yatırıp bırakır
function defterAt(t, tm) {
  const u = W(t, tm.rafa - 0.05, tm.koy - tm.rafa + 0.05), p = H.yay([D_ELDE.hx, D_ELDE.y], [D_RAF.hx, D_RAF.y], u, 18);
  const yat = 9 * H.D2R * W(t, tm.kapagi - 0.1, 0.3) * (1 - seg(t, tm.bakar - 0.16, 0.16) ** 2);
  return { ...DEF, hx: p[0], y: p[1] - 14 * H.nabiz(t, tm.clue + 0.1, 0.5), th: D_ELDE.th * (1 - u), yat, renk: '#4C7A5A', renk2: '#3B6247', amblem: true };
}
// Şerit metre: { c, fi, L, elde }
// Defne şeridi çekince kasayı 2. cildin üstüne bırakır (yüzünden uzak), parmağıyla 4 → 1 → 4 sayar; "Ölçme!"de kasayı yeniden alır
const serbest = (t, tm) => t >= tm.ger + 0.42 && t < tm.sar + 0.14;
function metreAt(t, tm, el) {
  const elde = t >= tm.al && t < tm.birak && !serbest(t, tm);
  const L = METRE_BOY * (W(t, tm.ger, 0.3) - W(t, tm.sar, 0.25)) + 150 * (H.nabiz(t, tm.cd0 + 1.5, 0.8) + H.nabiz(t, tm.cd0 + 2.9, 0.8));
  return { c: elde ? el : serbest(t, tm) ? OLC : METRE_RAF, fi: 0.95 * pw(t, tm.cd0 + 1.2, tm.cd - 1.1), L: Math.max(0, L), elde };
}
// Güve: { p, uc, k, rot, kapali, gizli }
function guveAt(t, S, cam, konum) {
  const { tm } = S, k2 = [680, 944], k1 = [400, 944], dalga = [10 * Math.sin(t * 3.1), 8 * Math.sin(t * 4.3 + 1)];
  if (t >= tm.cta) return { p: konum.parmak, uc: seg(t, tm.cta, 0.01) * (1 - seg(t, tm.cta + 0.05, 0.3)), k: 0.8 };
  if (t >= tm.gir && t < tm.cik) {   // tünelde: ilk sayfadan girer, iki kapak kartonunu geçer, son sayfadan çıkar
    const u = seg(t, tm.gir, tm.cik - tm.gir - 0.2);
    return { p: [lerp(ILK - 20, SON + 20, u * u * (3 - 2 * u)), TUNEL_Y + 2 * Math.sin(t * 22)], uc: 0, k: 0.75, rot: Math.PI / 2, kapali: 1 };
  }
  const yorunge = () => { const a = Math.PI + 2 * Math.PI * (t - tm.cd0) / 2.6; return [cam.cx + 335 * Math.cos(a) / cam.zoom, cam.cy + (40 + 135 * Math.sin(a)) / cam.zoom]; };
  const keys = [
    [0, [520, 1004]], [0.02, [528, 912], 0.36, ease.enter], [0.5, k2, 0.5, ease.state, 30],
    [tm.bir - 0.3, k1, 0.34, ease.state, 50], [tm.iki - 0.3, k2, 0.34, ease.state, 50],
    [tm.al, [352, 852], 0.5, ease.state, 30], [tm.cek + 0.15, [486, 1128], 0.6],
    [tm.cd0 - 0.15, yorunge, 0.5], [tm.cd - 0.55, k2, 0.5, ease.state, 30],
    [tm.proof - 0.02, [742, 944], 0.01], [tm.dal, [ILK + 4, 900], 0.3, ease.state, 20], [tm.dal + 0.3, [ILK + 2, 968], 0.2],
    [tm.cik, [SON + 6, 968], 0.01], [tm.cik + 0.02, [SON + 30, 890], 0.25, ease.enter], [tm.birCm + 0.3, [700, 944], 0.4, ease.state, 20],
    [tm.h4 - 0.32, konum.bas, 0.01],
  ];
  const p = izF(keys, t); let uc = 0;
  for (const [tk, , d = 0.3] of keys) if (d > 0.02 && t >= tk && t < tk + d + 0.08) uc = 1;
  const havada = (t >= tm.al + 0.4 && t < tm.cd - 0.05) || t < 0.5;
  if (havada) { uc = 1; if (t >= tm.al + 0.5 && t < tm.cd0 - 0.15) { p[0] += dalga[0]; p[1] += dalga[1]; } }
  const dalis = t >= tm.dal + 0.3 && t < tm.cik ? 1 - seg(t, tm.dal + 0.3, 0.2) : t >= tm.cik && t < tm.cik + 0.2 ? seg(t, tm.cik, 0.2) : 1;   // ciltlerin arkasına dalar / çıkar
  return { p, uc, k: 0.8 * dalis, gizli: dalis < 0.05, konKabar: H.nabiz(t, tm.kon, 0.3) };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, { ekr, sc }) {
    const { tm } = S;
    // h2b: sayfa bloğu ve kapak kartonu (1. cildin üst yüzünde)
    H.tag(K, t, tm.dort - 0.04, tm.d2 - 0.3, ekr([400, 866]), '4 cm', PAL.mustard, INK, 50, [tm.dort]);
    if (t >= tm.yarim - 0.04 && t < tm.d2 - 0.3) { const a = ekr([ILK + KP / 2, 934]), b = ekr([640, 880]); K.line(a[0], a[1], b[0], b[1], 5); }
    H.tag(K, t, tm.yarim - 0.04, tm.d2 - 0.3, ekr([650, 866]), '0,5 cm', PAL.cream, INK, 50, [tm.yarim]);
    // d2 / hd: metrenin okuduğu 9 cm; Hikmet'in itirazından sonra mercan + çarpı
    const yan = t >= tm.yanlis, x9 = t >= tm.hikKes ? 770 : 600, hw = H.tag(K, t, tm.d2 + 0.14, tm.cd0 - 0.3, [x9, 596], '9 cm', yan ? PAL.coral : PAL.mustard, yan ? PAL.paper : INK, 56, [tm.d2 + 0.2, tm.yanlis]);
    H.mark(K, t, tm.yanlis + 0.04, tm.cd0 - 0.3, [x9 + hw + 30, 596], false);
    if (sc.id === 'olcu') H.sayiAtla(K, t, [[tm.s4, ekr([X1 + SW / 2, 866]), '4'], [tm.s1, ekr([X2, 866]), '1'], [tm.s44, ekr([X2 + SW / 2, 866]), '4']], { son: tm.hd - 0.12, size: 56, fill: INK });
    if (sc.id === 'hik') H.tag(K, t, tm.ilkS - 0.04, tm.cd0 - 0.3, [722, 742], K.up('ilk sayfa'), PAL.cream, INK, 46, [tm.ilkS]);
    // kahraman an: ilk sayfa sağda, son sayfa solda; iki kapak kartonu = 1 cm
    if (sc.id === 'kesit') {
      for (const [a, x0, wx, renk, yazi, ad, nb] of [[tm.ilk, 322, ILK - 6, PAL.mustard, INK, 'ilk sayfa', tm.sag], [tm.son, 758, SON + 6, PAL.coral, PAL.paper, 'son sayfa', tm.sol]]) {
        if (t >= a - 0.04 && t < tm.y1 - 0.3) { const q = ekr([wx, RAF_Y - PEN[1] + 4]); K.line(x0 + (x0 < 540 ? 96 : -96), 592, q[0], q[1], 13, INK); K.line(x0 + (x0 < 540 ? 96 : -96), 592, q[0], q[1], 7, renk); }
        H.tag(K, t, a - 0.04, tm.y1 - 0.3, [x0, 556], K.up(ad), renk, yazi, 46, [a, nb]);
      }
    }
    const hw2 = H.adimEtiket(K, t, [[tm.y1, '0,5', PAL.mustard, INK], [tm.y2, '0,5 + 0,5', PAL.mustard, INK], [tm.birCm + 0.04, '1 cm', PAL.green, PAL.paper]], tm.h4 - 0.4, [540, 566], 60);
    H.mark(K, t, tm.santim + 0.12, tm.h4 - 0.4, [540 + hw2 + 34, 566], true);
  },
});

function sahne(K, t, tl, S, { heads, sc, cam }) {
  const { tm } = S, hop = H.buldumHop(t, tm.buldum), ust = [];   // ust: nesnelerden sonra çizilecek kollar ve eller
  M.mekanCiz(K, ARS, 'arka', t);
  const c1 = cilt1At(t, tm), g1 = geo(c1), c2 = cilt2At(t, tm), df = defterAt(t, tm), gd = geo(df);

  // ——— Necmi: defteri iki eliyle gösterir, sağ eliyle çevirip raftaki boşluğa iter ———
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  {
    const wL = 1 - W(t, tm.rafa + 0.05, 0.3), wR = 1 - W(t, tm.bakar + 0.25, 0.35);
    H.reach('necmi', np, 'L', gd.S(8, DEF.bh * 0.42), wL); H.reach('necmi', np, 'R', t < tm.rafa ? gd.F(DEF.dp - 12, DEF.bh * 0.5) : kar(gd.F(DEF.dp - 12, DEF.bh * 0.5), gd.S(14, DEF.bh * 0.5), W(t, tm.rafa - 0.05, 0.3)), wR, 'A');
    ust.push(a => { if (wL > 0.5) a.n.tut('L'); if (wR > 0.5) kolUst(K, 'necmi', np, 'R'); });
  }
  // ——— Hikmet ———
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  if (sc.id === 'espri') H.omuzSilk(hp, t, tm.benden - 0.1, 0.7);
  {
    // sağ el: kare 0'da 1. cildi yatırır · h2a'da "1"e dokunur, "2"yi gösterir · h2b'de üst yüzde sayfaları ve kapağı gösterir
    const w0 = 1 - W(t, 0.8, 0.3), wT = pw(t, tm.bir - 0.03, tm.iki - 0.4, 0.26, 0.25), wP = pw(t, tm.iki - 0.05, tm.h2aSon + 0.2, 0.3), wD = pw(t, tm.dort - 0.1, tm.nasil - 0.1, 0.3);
    H.reach('hikmet', hp, 'R', g1.S(52, BH + 4), w0);
    H.reach('hikmet', hp, 'R', [306, RAF_Y - BH - DP * KE - 2 - 26 * (1 - seg(t, tm.bir - 0.13, 0.11))], wT);
    H.reach('hikmet', hp, 'R', [440, 1010], wP);
    H.reach('hikmet', hp, 'R', [lerp(372, ILK + 6, W(t, tm.kapak - 0.2, 0.3)), RAF_Y - BH - DP * KE - 22], wD, 'A');
    // hd: sağ el 1. cildi sırtından çeker; sol el sırtı tutar; sağ el kapağı açar, deliği gösterir, sayfaları çevirir, yerine iter
    const wCek = pw(t, tm.sar + 0.05, tm.elde + 0.1, 0.26, 0.2), wSol = pw(t, tm.elde - 0.12, tm.geri + 0.05, 0.3, 0.3), wIs = pw(t, tm.elde + 0.12, tm.kapat + 0.3, 0.2, 0.2), wDon = pw(t, tm.geri - 0.05, tm.yerinde + 0.12, 0.25, 0.3);
    const kenar = (fi, h) => g1.B(Math.min(fi, 0.42), DP - 14, h), sayfaUcu = () => g1.F(DP - 16, 160);
    const P = izF([[0, () => g1.F(DP - 14, 176)], [tm.ac, () => kenar(c1.ac, 176), 0.1], [tm.ac + 0.34, () => g1.F(DP + 2, DELIK_H - 30), 0.3],
      [tm.cev1 - 0.24, sayfaUcu, 0.2], [tm.cev1, () => kenar(c1.cevir[0], 160), 0.08], [tm.cev1 + 0.2, sayfaUcu, 0.14],
      [tm.cev2, () => kenar(c1.cevir[1], 160), 0.08], [tm.cev2 + 0.2, sayfaUcu, 0.14], [tm.cev3, () => kenar(c1.cevir[2], 160), 0.08], [tm.cev3 + 0.2, () => g1.F(DP + 10, 120), 0.2]], t);
    H.reach('hikmet', hp, 'R', g1.S(18, BH * 0.78), wCek);
    H.reach('hikmet', hp, 'R', P, wIs, 'A');
    H.reach('hikmet', hp, 'R', g1.S(18, BH * 0.78), wDon);
    H.reach('hikmet', hp, 'L', g1.S(10, 118), wSol);
    ust.push(a => {
      if (wSol > 0.5) a.h.tut('L');
      // deliği gösterirken el sayfanın sağ kenarını arkadan tutar: kol kitabın arkasında kalır, delik açık görünür
      const kenarda = wIs > 0.5 && t >= tm.ac + 0.52 && t < tm.cev1 - 0.16;
      if (kenarda) a.h.tut('R');
      else if (w0 > 0.5 || wT > 0.5 || wP > 0.5 || wD > 0.5 || wCek > 0.5 || wIs > 0.5 || wDon > 0.5) kolUst(K, 'hikmet', hp, 'R');
      if (wT > 0.6) a.h.isaret('R', [306, RAF_Y - BH - 6]);
      if (wP > 0.6) a.h.isaret('R', [X2 + 60, 1110]);
      if (wD > 0.6) a.h.isaret('R', [lerp(372, ILK + 6, W(t, tm.kapak - 0.2, 0.3)), RAF_Y - BH - DP * KE + 12]);
      if (wIs > 0.6 && t >= tm.delik - 0.3 && t < tm.cev1 - 0.24) a.h.isaret('R', g1.F(DP / 2 + 8, DELIK_H - 8));
    });
  }
  // ——— Defne ———
  const cta = sc.id === 'cta';
  const dp = cta ? kisi('defne', { x: DEF_X, expr: 'mutlu', head: { tilt: 7, look: [0.1, 0.05] }, armL: POZ.belde.armL, armR: POZ.dur.armR })
    : H.poseAt(H.CARDS.defne, S.defBase, S.def, t);
  if (!cta) H.glance(dp, t, tm.cd);
  dp.y -= hop;
  const parmakEl = H.elYeri('defne', dp, 'R', 'yukari');
  {
    // sol el: metreyi raftan alır, iki cildin üstüne gerer, sayaçta çekip bırakır, yerine koyar · "Buldum!"da ve kesitte gösterir
    const wM = pw(t, tm.al, tm.birak, 0.3, 0.3);
    const PM = izF([[0, METRE_RAF], [tm.al + 0.12, OLC, 0.42, ease.state, 30], [tm.sar + 0.3, [866, 1190], 0.4], [tm.cd0 + 1.0, [846, 1150], 0.35], [tm.birak - 0.36, METRE_RAF, 0.34, ease.state, 30]], t);
    H.reach('defne', dp, 'L', PM, wM);
    const SAY = [[0, [405, 922]], [tm.s1 - 0.12, [X2, 922], 0.2], [tm.s44 - 0.12, [675, 922], 0.2]], hT = izF(SAY, t);
    const wPt = pw(t, tm.ger + 0.7, tm.sar - 0.12, 0.28, 0.26);
    const PT = [700 + 0.18 * (hT[0] - X2), 1004 - 16 * (H.nabiz(t, tm.s4, 0.3) + H.nabiz(t, tm.s1, 0.3) + H.nabiz(t, tm.s44, 0.3))];
    H.reach('defne', dp, 'L', PT, wPt, 'A');
    const wG = pw(t, tm.ilkSag - 0.12, tm.proof + 9, 0.25, 0.3) * (t < tm.h4 - 0.3 ? 1 : 0);
    const hedef = t < tm.proof ? [X2 + 30, RAF_Y - BH + 30] : kar([ILK, TUNEL_Y - 30], [SON, TUNEL_Y - 30], W(t, tm.c2 - 0.1, 0.4));
    const elG = t < tm.proof ? [690, 1016 - hop] : [lerp(830, 834, W(t, tm.c2 - 0.1, 0.4)), 1188 - 22 * (H.nabiz(t, tm.ilk - 0.1, 0.4) + H.nabiz(t, tm.son - 0.1, 0.4))];
    H.reach('defne', dp, 'L', elG, wG, 'A');
    if (cta) H.reach('defne', dp, 'R', parmakEl, 1, 'B');
    ust.push(a => {
      if (wM > 0.5 || wPt > 0.5) kolUst(K, 'defne', dp, 'L');
      if (wPt > 0.6) a.d.isaret('L', hT);
      if (wG > 0.5) { kolUst(K, 'defne', dp, 'L'); a.d.isaret('L', hedef); }
      if (cta) a.d.parmak('R', 1, { boy: 1.15 });
    });
  }

  // ——— karakterler ———
  const n = oyna(K, t, tl, 'necmi', np, { heads });
  const h = oyna(K, t, tl, 'hikmet', hp, { heads });
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const d = oyna(K, t, tl, 'defne', dp, { heads });

  // ——— kitaplıklar, Necmi'nin rafı ———
  kitaplik(K, 236, 668); kitaplik(K, NX + 120, 620);
  const kabar = H.nabiz(t, tm.koy + 0.02, 0.4) + H.nabiz(t, tm.bakar, 0.4);
  sirt(K, NX + 270, RAF_Y, 112, 312, '#B9833A', '#94682C', kabar); sirt(K, NX + 382, RAF_Y, 124, 286, '#3F7F7A', '#2F625E'); sirt(K, NX + 506, RAF_Y, 98, 322, '#7E6B55', '#655543');
  saksi(K, NX + 672, RAF_Y, t);
  cilt(K, df);
  // ——— iki cilt ———
  cilt(K, c2);
  cilt(K, c1);
  // h2b: üst yüzde ölçü çizgileri (sayfa bloğu 4 cm, kapak kartonu 0,5 cm)
  if (t < tm.d2 - 0.3) {
    const yy = RAF_Y - BH - DP * KE - 16, out = 1 - seg(t, tm.d2 - 0.5, 0.2);
    H.dimLine(K, [X1 + KP, yy], [ILK, yy], ease.enter(seg(t, tm.dort - 0.08, 0.35)) * out, PAL.mustard, 7);
    H.dimLine(K, [ILK, yy], [X2, yy], ease.enter(seg(t, tm.yarim - 0.08, 0.25)) * out, PAL.cream, 7);
  }
  if (sc.id === 'hik') H.ring(K, g1.F(DP / 2, DELIK_H), t, tm.delik, PAL.coral);
  // kesit: iki kapak kartonunun üstünde 1 cm
  if (t >= tm.birCm - 0.1 && sc.id !== 'cta') H.dimLine(K, [ILK, TUNEL_Y - 52], [SON, TUNEL_Y - 52], ease.enter(seg(t, tm.birCm - 0.06, 0.3)), PAL.green, 8);

  // ——— şerit metre ———
  const mt = metreAt(t, tm, d.handL);
  metre(K, mt.c, mt.fi, mt.L, [[0, 4 / 9, PAL.mustard, 0.8 * H.nabiz(t, tm.s4, 0.5)], [4 / 9, 5 / 9, PAL.coral, 0.9 * H.nabiz(t, tm.s1, 0.5)], [5 / 9, 1, PAL.mustard, 0.8 * H.nabiz(t, tm.s44, 0.5)]]);

  // ——— eller ———
  for (const f of ust) f({ n, h, d });

  // ——— güve ———
  const hb = H.eklem('hikmet', hp, 'head');
  const gv = guveAt(t, S, cam, { bas: [hb[0] + 8, hb[1] - 0.56 * hp.s], parmak: [d.handR[0], d.handR[1] - 92] });
  if (t >= tm.h4 - 0.32 && t < tm.cta) { const u = W(t, tm.h4 - 0.3, tm.kon - tm.h4 + 0.3); gv.p = H.yay([250, 900], gv.p, u, 40); gv.uc = u < 1 ? 1 : 0; }
  if (cta) { const u = W(t, tm.cta, 0.01); gv.uc = t < tm.kurdu - 0.25 ? 1 : 0; if (t < tm.kurdu - 0.25) gv.p = [gv.p[0] + 60 * (1 - W(t, tm.cta, tm.kurdu - 0.25 - tm.cta)), gv.p[1] - 70 * (1 - W(t, tm.cta, tm.kurdu - 0.25 - tm.cta))]; void u; }
  if (!gv.gizli) guve(K, gv.p, t, gv);
}
