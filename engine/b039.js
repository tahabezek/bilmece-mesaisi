// Bölüm 39 · KOLONLU ODA (v4 "hikâye" dili; storyboard: hikayeler/bolum_039_v5.md). Az bilinen klasik (kesik satranç tahtası), yeni kurgu.
// Logline: Hikmet Bey, Necmi'den toplantı odasının 8 × 8 karo zeminini 31 tane iki karoluk halıyla kaplamasını ister.
// Karşılıklı iki köşede kolon vardır. Kalan karo sayısı (62) tutar, ama zemin dama gibi boyanınca bunun imkânsız olduğu görülür.
// Akılda kalacak tek şey: her halı bir koyu, bir açık karo kaplar; iki kolon aynı renkteyse halılar asla sığmaz.
// İki set aynı dünyada: oda (önden, yüksek açı; karakterler arka kenarda, zemin önlerinde perspektifte) ·
// plan (x 3000; zeminin kuşbakışı, kollar kadrajın kenarından girer). Zemin, halılar ve boya tek durum fonksiyonundan
// okunur; iki görünüş aynı karo koordinatlarını (sütun u, satır v) kendi izdüşümüyle çizer.
// Görüntü cevabı önceden söylemez: karolar ipucuna kadar tek renktir; boya Necmi'nin rulosuyla ipucunda başlar.
// Geometri build anında denetlenir: yanlış denemedeki 30 halı binmez, kolona ve deliğe değmez, iki boş karo açık renktir.
// Her kare t'nin saf fonksiyonudur; anlar ses çizelgesindeki kelime çapalarından okunur; rastgelelik yok.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b039_oda', PLAN = 'b039_plan', BX = 3000, N = 8;
const KOLON = [[0, 0], [7, 7]];                                   // [satır, sütun]: karşılıklı köşeler (1,1) ve (8,8)
const koyu = (r, c) => (r + c) % 2 === 0;                         // kolonların karosu koyu
// oda (önden): perspektif zemin. v = 8 yakın kenar (alt), v = 0 uzak kenar (karakterlerin ayağı)
const ZN = 1560, ZF = 1075, ZFAR = 1.5, TN = 112, ZD = (ZN - ZF) / (1 - 1 / ZFAR), ZH = ZN - ZD;
const zv = v => 1 + (ZFAR - 1) * (1 - v / N);
const odaP = (u, v) => { const z = zv(v); return [540 + (u - 4) * TN / z, ZH + ZD / z]; };
const KS = 0.64, AYAK = 1085, F = KS / 0.8;                                      // karakter ölçeği ve ayak çizgisi (oda)
const HIK_X = 400, NEC_X = 562, DEF_X = 722;
// plan (kuşbakışı): karo PT, ızgaranın sol üstü G
const PT = 80, GX = BX + 220, GY = 540;
const planP = (u, v) => [GX + u * PT, GY + v * PT];
// renkler
const KREM = '#E6DAC0', DERZ = '#C9BB9C', KOYU = '#4D524E', KOYU_DERZ = '#3C403D';
const HALI = [['#93303A', '#B9535B'], ['#2F7F7A', '#5AA59E'], ['#C98F2A', '#E2B860']];
const KOLON_R = '#D9D3C4', KOLON_G = '#B7B0A0';
const MERCAN = PAL.coral;

// ═══════════════════════════ Halı dizilimi (yanlış deneme) ═══════════════════════════
// Satır satır yatay halılar: 0. satır sütun 1, 3, 5 (sağ üst köşe boş) · 1–6. satırlar 0, 2, 4, 6 · 7. satır 1, 3, 5 (sol alt köşe boş).
// Sıra zikzak: çift satır soldan sağa, tek satır sağdan sola (el sırayla gider).
const DIZ = [];
for (let r = 0; r < N; r++) {
  const cs = r === 0 || r === 7 ? [1, 3, 5] : [0, 2, 4, 6];
  for (const c of r % 2 ? [...cs].reverse() : cs) DIZ.push({ r, c, renk: (r * 3 + c / 2 + (r % 2)) % 3 | 0 });
}
// Defne'nin sayaçtaki sessiz denemesi: 0. satırda iki halıyı birer karo sağa kaydırır; boşluk (0,7) → (0,5) → (0,3)
const KAY = [{ i: DIZ.findIndex(d => d.r === 0 && d.c === 5) }, { i: DIZ.findIndex(d => d.r === 0 && d.c === 3) }];
const BOS0 = [[0, 7], [7, 0]], BOS1 = [[0, 3], [7, 0]];
// Defne'nin cevaptaki tek halısı: önce yatay (3,2)-(3,3), sonra dikey (4,5)-(5,5)
const ORNEK = [{ r: 3, c: 2, yon: 'h' }, { r: 4, c: 5, yon: 'v' }];
// ——— geometri denetimi (build anında) ———
function denetle() {
  const hata = [];
  const kontrol = (kaydir, bos) => {
    const dolu = new Map();
    DIZ.forEach((d, i) => { const c = d.c + (kaydir.includes(i) ? 1 : 0); for (const cc of [c, c + 1]) { const k = d.r * 8 + cc; if (cc < 0 || cc > 7) hata.push('taşma'); if (dolu.has(k)) hata.push(`binme ${d.r},${cc}`); dolu.set(k, i); } if (koyu(d.r, c) === koyu(d.r, c + 1)) hata.push('halı tek renk'); });
    for (const [r, c] of KOLON) if (dolu.has(r * 8 + c)) hata.push('kolona halı');
    for (const [r, c] of bos) { if (dolu.has(r * 8 + c)) hata.push(`boşluk dolu ${r},${c}`); if (koyu(r, c)) hata.push(`boşluk koyu ${r},${c}`); }
    if (dolu.size !== 60 || DIZ.length !== 30) hata.push(`kaplanan ${dolu.size}`);
    if (Math.abs(bos[0][0] - bos[1][0]) + Math.abs(bos[0][1] - bos[1][1]) === 1) hata.push('boşluklar komşu');
  };
  kontrol([], BOS0); kontrol(KAY.map(k => k.i), BOS1);
  if (!koyu(0, 0) || !koyu(7, 7)) hata.push('kolonlar koyu değil');
  let k = 0, a = 0; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (!KOLON.some(([kr, kc]) => kr === r && kc === c)) koyu(r, c) ? k++ : a++;
  if (k !== 30 || a !== 32) hata.push(`koyu ${k} açık ${a}`);
  for (const o of ORNEK) { const b = o.yon === 'h' ? [o.r, o.c + 1] : [o.r + 1, o.c]; if (koyu(o.r, o.c) === koyu(...b)) hata.push('örnek halı tek renk'); }
  if (hata.length) console.error('b039 geometri: ' + hata.join(', '));
}
denetle();

const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));
// Sıralı yol: duraklar [[t, [x, y]], …]; ease.state ile
function yol(t, d) {
  if (t <= d[0][0]) return d[0][1];
  for (let i = 1; i < d.length; i++) if (t < d[i][0]) { const u = ease.state((t - d[i - 1][0]) / (d[i][0] - d[i - 1][0])); return [lerp(d[i - 1][1][0], d[i][1][0], u), lerp(d[i - 1][1][1], d[i][1][1], u)]; }
  return d[d.length - 1][1];
}

// ═══════════════════════════ Zemin durumu (tek kaynak) ═══════════════════════════
// Karo boyası: koyu karo, rulonun geçtiği anda boyanır (boya sahnesi; zikzak)
function boyaAni(S, r, c) {
  const { tm } = S, pos = r % 2 ? 7 - c : c;
  return tm.boya0 + r * tm.boyaDr + (pos + 0.5) / 8 * tm.boyaDr;
}
function karoRengi(S, t, r, c) {
  if (!koyu(r, c)) return [KREM, DERZ];
  const u = seg(t, boyaAni(S, r, c), 0.05);
  return u <= 0 ? [KREM, DERZ] : u >= 1 ? [KOYU, KOYU_DERZ] : [H.mixHex(KREM, KOYU, u), H.mixHex(DERZ, KOYU_DERZ, u)];
}
// Boşlukların mercan parlaması (0..1)
function bosParla(S, t, r, c) {
  const { tm } = S;
  const at = (a, b) => (t >= a && t < b ? 0.55 + 0.45 * Math.cos((t - a) * 5.2) : 0) * clamp01((t - a) / 0.12);
  if (r === 0 && c === 7) return at(tm.bos1, tm.kay1Bit);
  if (r === 7 && c === 0) return at(tm.bos2, tm.sayacBit) + at(tm.bosSon, 1e9);
  if (r === 0 && c === 5) return at(tm.kay1Bit, tm.kay2Bit);
  if (r === 0 && c === 3) return at(tm.kay2Bit, tm.sayacBit) + at(tm.bosSon, 1e9);
  return 0;
}
// Halının o anki durumu: { r, c (kesirli), yon, acil (0..1 açılma), acYon, sar (0..1 dürülme), kalk (0..1), gor }
function haliDurum(S, i, t) {
  const { tm } = S, d = DIZ[i], tp = tm.serme[i];
  if (t < tp) return null;
  let c = d.c;
  KAY.forEach((k, j) => { if (k.i === i) c += ease.state(seg(t, tm.kay[j], 0.36)); });
  const acil = i === 0 ? ease.enter(seg(t, tp, 0.34)) : ease.state(seg(t, tp, tm.seritDur));
  // boya: satır rulodan hemen önce dürülür, rulo geçince açılır
  const sar = t < tm.don ? W(t, tm.boyaKes + 0.04 + d.r * 0.03, 0.22) : 0;
  // cevap: halılar kalkar (satır satır), sonda geri iner
  const kalk = W(t, tm.kalk + d.r * 0.035, 0.36) * (1 - W(t, tm.don + d.r * 0.05, 0.3));
  return { r: d.r, c, yon: 'h', acil, acYon: d.r % 2 ? -1 : 1, sar, kalk, renk: d.renk };
}

// ═══════════════════════════ Çizim parçaları ═══════════════════════════
// Dörtgen (izdüşümlü karo) — P: (u, v) → nokta
const quad = (P, u0, v0, u1, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)];
function zeminCiz(K, P, t, S, { lw = 3 } = {}) {
  const { ctx } = K;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const [f, d] = karoRengi(S, t, r, c), q = quad(P, c, r, c + 1, r + 1);
    K.poly(q, f, 0);
    ctx.save(); ctx.lineWidth = lw; ctx.strokeStyle = d; K.path(q); ctx.stroke(); ctx.restore();
    const g = bosParla(S, t, r, c);
    if (g > 0.01) { ctx.save(); ctx.globalAlpha = 0.85 * Math.min(1, g); K.poly(quad(P, c + 0.06, r + 0.06, c + 0.94, r + 0.94), MERCAN, 0); ctx.restore(); }
  }
  K.poly(quad(P, 0, 0, 8, 8), null, LW);
}
// Halı (yukarıdan izdüşüm): hücre dikdörtgeni [u0, v0, u1, v1]; açılma (acil, acYon), dürülme (sar: üst kenara doğru)
function haliCiz(K, P, [u0, v0, u1, v1], renk, { acil = 1, acYon = 1, sar = 0, a = 1, mercan = 0, kalk = 0 } = {}) {
  const { ctx } = K, m = 0.07, [c1, c2] = HALI[renk];
  let x0 = u0 + m, x1 = u1 - m, y0 = v0 + m, y1 = v1 - m;
  const yatay = x1 - x0 > y1 - y0;
  // açılma: ön kenar acYon yönünde ilerler; ön kenarda rulo silindiri
  let rulo = null;
  if (acil < 1) {
    if (yatay) { if (acYon > 0) { x1 = lerp(x0, x1, acil); rulo = [[x1, y0], [x1, y1]]; } else { x0 = lerp(x1, x0, acil); rulo = [[x0, y0], [x0, y1]]; } }
    else { y1 = lerp(y0, y1, acil); rulo = [[x0, y1], [x1, y1]]; }
  }
  if (sar > 0) { y1 = lerp(y1, y0, sar * 0.92); rulo = [[x0, y1], [x1, y1]]; }
  // kalkış: halı merkezden büyür (kameraya yaklaşır), gölgesi uzaklaşır, solar
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, k = 1 + 0.35 * kalk;
  const T = (u, v) => P(cx + (u - cx) * k, cy + (v - cy) * k - 0.5 * kalk);
  const alfa = a * (1 - kalk);
  if (alfa <= 0.01) return;
  ctx.save(); ctx.globalAlpha = alfa;
  if (x1 - x0 > 0.02 && y1 - y0 > 0.02) {
    ctx.save(); ctx.globalAlpha = alfa * 0.22; K.poly([T(x0, y0), T(x1, y0), T(x1, y1), T(x0, y1)].map(([x, y]) => [x + 6 + 30 * kalk, y + 8 + 40 * kalk]), INK, 0); ctx.restore();
    const fill = mercan > 0 ? H.mixHex(c1, MERCAN, mercan) : c1;
    K.poly([T(x0, y0), T(x1, y0), T(x1, y1), T(x0, y1)], fill, LW * 0.75);
    // iç çerçeve ve göbek deseni
    const i = 0.16, ix0 = x0 + i, ix1 = x1 - i, iy0 = y0 + i, iy1 = y1 - i;
    if (ix1 > ix0 && iy1 > iy0) {
      ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = mercan > 0 ? H.mixHex(c2, '#F2B8A4', mercan) : c2; K.path([T(ix0, iy0), T(ix1, iy0), T(ix1, iy1), T(ix0, iy1)]); ctx.stroke();
      const mx = (ix0 + ix1) / 2, my = (iy0 + iy1) / 2, rx = (ix1 - ix0) * 0.22, ry = (iy1 - iy0) * 0.3;
      K.path([T(mx - rx, my), T(mx, my - ry), T(mx + rx, my), T(mx, my + ry)]); ctx.fillStyle = ctx.strokeStyle; ctx.fill(); ctx.restore();
    }
    // saçaklar: kısa kenarlarda
    ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = PAL.cream;
    const sacak = (a0, a1, dir) => { for (let s = 0; s <= 5; s++) { const q = lerp(0.12, 0.88, s / 5); const p = yatay ? T(a0, lerp(y0, y1, q)) : T(lerp(x0, x1, q), a0); const p2 = yatay ? T(a0 + dir * 0.07, lerp(y0, y1, q)) : T(lerp(x0, x1, q), a0 + dir * 0.07); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...p2); ctx.stroke(); } };
    if (yatay) { if (!(rulo && acYon < 0 && acil < 1)) sacak(x0, x0, -1); if (!(rulo && acYon > 0 && acil < 1)) sacak(x1, x1, 1); }
    else { sacak(y0, y0, -1); if (!rulo) sacak(y1, y1, 1); }
    ctx.restore();
  }
  if (rulo) {   // dürülmüş kısım: kalın silindir
    const A = T(...rulo[0]), B = T(...rulo[1]), s = Math.hypot(P(1, 0)[0] - P(0, 0)[0], P(0, 1)[1] - P(0, 0)[1]) / 1.414;
    const w = s * (0.16 + 0.14 * (yatay && sar === 0 ? 1 - acil : Math.max(sar, 1 - acil)));
    ctx.lineCap = 'round';
    H.strokeLine(ctx, A, B, w + LW * 1.4, INK); H.strokeLine(ctx, A, B, w, H.mixHex(c1, MERCAN, mercan));
    H.strokeLine(ctx, A, B, w * 0.3, c2);
  }
  ctx.restore();
}
// Bir halının hücre dikdörtgeni
const hucre = (r, c, yon = 'h') => yon === 'h' ? [c, r, c + 2, r + 1] : [c, r, c + 1, r + 2];
// Kolon: plan → daire (karonun rengi çevresinde görünür) · oda → silindir (tavana kadar)
function kolonPlan(K, P, r, c, vurgu = 0) {
  const [x, y] = P(c + 0.5, r + 0.5), rr = PT * 0.34 * (P(1, 0)[0] - P(0, 0)[0]) / PT, { ctx } = K;
  ctx.save(); ctx.globalAlpha = 0.3; K.circ(x + 9, y + 12, rr, INK, 0); ctx.restore();
  K.circ(x, y, rr, KOLON_R, LW); K.circ(x, y, rr * 0.62, KOLON_G, LW * 0.5);
  if (vurgu > 0.01) { ctx.save(); ctx.globalAlpha = vurgu; ctx.lineWidth = 9; ctx.strokeStyle = PAL.mustard; K.path(quad(P, c - 0.02, r - 0.02, c + 1.02, r + 1.02)); ctx.stroke(); ctx.restore(); }
}
function kolonOda(K, r, c) {
  const [xl, yb] = odaP(c + 0.12, r + 0.5), [xr] = odaP(c + 0.88, r + 0.5), [xm] = odaP(c + 0.5, r + 0.5), ry = (odaP(c + 0.5, r + 0.88)[1] - odaP(c + 0.5, r + 0.12)[1]) / 2, { ctx } = K;
  ctx.save(); ctx.globalAlpha = 0.25; K.ell(xm + 8, yb + 4, (xr - xl) / 2 + 6, ry + 4, INK, 0); ctx.restore();
  K.rect(xl, -500, xr - xl, yb + 500, KOLON_R, 0);
  K.rect(xl + (xr - xl) * 0.62, -500, (xr - xl) * 0.38, yb + 500, KOLON_G, 0);
  ctx.save(); ctx.beginPath(); ctx.ellipse(xm, yb, (xr - xl) / 2, ry, 0, 0, Math.PI); ctx.fillStyle = KOLON_R; ctx.fill(); ctx.restore();
  K.line(xl, -500, xl, yb, LW); K.line(xr, -500, xr, yb, LW);
  ctx.save(); ctx.beginPath(); ctx.ellipse(xm, yb, (xr - xl) / 2, ry, 0, 0, Math.PI); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  K.rect(xl - 4, yb - 34, xr - xl + 8, 16, KOLON_G, LW * 0.6, 4);
  return { xl, xr, xm, yb };
}
// Elde rulo (önden): yatay silindir; merkez, boy
function ruloOn(K, [x, y], boy, renk, s = 1) {
  const r = 15 * s, [c1, c2] = HALI[renk];
  K.rect(x - boy / 2, y - r, boy, 2 * r, c1, LW * 0.8, r);
  K.line(x - boy / 2 + 14 * s, y - r * 0.2, x + boy / 2 - 14 * s, y - r * 0.2, 4, c2);
  K.ell(x + boy / 2 - r * 0.45, y, r * 0.45, r, H.mixHex(c1, '#000000', 0.25), LW * 0.6);
  K.circ(x + boy / 2 - r * 0.45, y, r * 0.22, c2, 0);
}
// Boya kovası (önden): sap noktası (elin tuttuğu yer), boy ölçeği
function kova(K, [x, y], s = 1) {
  const w0 = 56 * s, w1 = 44 * s, h = 70 * s, y0 = y + 30 * s, { ctx } = K;
  ctx.save(); ctx.beginPath(); ctx.arc(x, y0, w0 / 2 + 2, Math.PI, 0); ctx.lineWidth = 5; ctx.strokeStyle = PAL.metalDark; ctx.stroke(); ctx.restore();
  K.poly([[x - w0 / 2, y0], [x + w0 / 2, y0], [x + w1 / 2, y0 + h], [x - w1 / 2, y0 + h]], '#CFD8D2', LW * 0.8);
  K.ell(x, y0, w0 / 2, 9 * s, KOYU, LW * 0.6);
  K.poly([[x - w0 / 2 + 3, y0 + 22 * s], [x + w0 / 2 - 3, y0 + 22 * s], [x + w0 / 2 - 6, y0 + 40 * s], [x - w0 / 2 + 6, y0 + 40 * s]], KOYU, 0);
}
// Boya rulosu (önden): sap elde, yön a (radyan; sapın el → rulo yönü), boyalı (0..1)
function ruloBoya(K, el, a, s = 1, boyali = 0) {
  const L = 118 * s, u = [Math.cos(a), Math.sin(a)], n = [-u[1], u[0]], ucu = [el[0] + u[0] * L, el[1] + u[1] * L], { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  H.strokeLine(ctx, [el[0] - u[0] * 26 * s, el[1] - u[1] * 26 * s], el, 15 * s + 6, INK); H.strokeLine(ctx, [el[0] - u[0] * 26 * s, el[1] - u[1] * 26 * s], el, 15 * s, PAL.red);
  H.strokeLine(ctx, el, ucu, 6 * s + 5, INK); H.strokeLine(ctx, el, ucu, 6 * s, PAL.metal);
  const a0 = [ucu[0] - n[0] * 40 * s, ucu[1] - n[1] * 40 * s], a1 = [ucu[0] + n[0] * 40 * s, ucu[1] + n[1] * 40 * s];
  H.strokeLine(ctx, a0, a1, 30 * s + 8, INK); H.strokeLine(ctx, a0, a1, 30 * s, H.mixHex('#EFE6D2', KOYU, boyali));
  ctx.restore();
  return ucu;
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
// Oda: arka duvar, iki yan duvar (perspektif), sol duvarda pencere (martı), sağ duvarda saat. Zemin ve kolonlar dunya() içinde.
function yanDuvarP(sol, v, h) { const [x, y] = odaP(sol ? 0 : 8, v); return [x, y - h / zv(v)]; }
M.mekanEkle(ODA, {
  gen: [-400, 1500], dongu: ['pencerede martı', 'duvar saatinin saniye kolu'],
  kadraj: { kanca: [1.18, 560, 1010] },
  arka(K, t) {
    const { ctx } = K;
    ctx.fillStyle = PAL.wall; ctx.fillRect(-500, -500, 2100, 3000);
    ctx.save(); ctx.globalAlpha = 0.16; for (let x = odaP(0, 0)[0]; x < odaP(8, 0)[0]; x += 40) K.line(x, -500, x, ZF - 70, 3, PAL.wallDark); ctx.restore();
    K.rect(odaP(0, 0)[0], ZF - 70, odaP(8, 0)[0] - odaP(0, 0)[0], 70, PAL.wallDark, 0);
    // yan duvarlar (koyu)
    const sl = [odaP(0, 0), odaP(0, 8)], sr = [odaP(8, 0), odaP(8, 8)];
    const uz = (a, b, y) => a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]);
    K.poly([[sl[0][0], -500], sl[0], [uz(sl[0], sl[1], 2000), 2000], [-600, 2000], [-600, -500]], PAL.wallDark, 0);
    K.poly([[sr[0][0], -500], sr[0], [uz(sr[0], sr[1], 2000), 2000], [1700, 2000], [1700, -500]], PAL.wallDark, 0);
    K.line(sl[0][0], -500, sl[0][0], sl[0][1], LW); K.line(sr[0][0], -500, sr[0][0], sr[0][1], LW);
    // süpürgelik (yan duvarların dibi)
    for (const sol of [true, false]) { const a = yanDuvarP(sol, 0, 0), b = yanDuvarP(sol, 8, 0), a2 = yanDuvarP(sol, 0, 60), b2 = yanDuvarP(sol, 8, 60); K.poly([a, b, b2, a2], PAL.trim, LW * 0.5); }
    // sol duvarda pencere (martı geçer)
    const q = [yanDuvarP(true, 1.2, 640), yanDuvarP(true, 5.2, 640), yanDuvarP(true, 5.2, 300), yanDuvarP(true, 1.2, 300)];
    K.poly(q.map(([x, y], i) => [x + (i === 0 || i === 3 ? 10 : -10), y]), PAL.trim, LW * 0.7);
    ctx.save(); K.path(q); ctx.clip(); ctx.fillStyle = PAL.sky; ctx.fillRect(-100, 300, 600, 900);
    const g = (t * 0.11) % 1, gp = [lerp(q[3][0], q[2][0], g), lerp(q[0][1], q[1][1], g) + 40 + 6 * Math.sin(t * 1.3)];
    ctx.beginPath(); ctx.moveTo(gp[0] - 12, gp[1]); ctx.quadraticCurveTo(gp[0] - 6, gp[1] - 8, gp[0], gp[1]); ctx.quadraticCurveTo(gp[0] + 6, gp[1] - 8, gp[0] + 12, gp[1]); ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.stroke();
    ctx.fillStyle = '#7E8E86'; ctx.fillRect(-100, lerp(q[3][1], q[2][1], 0.5) - 30, 600, 300);
    ctx.restore(); K.poly(q, null, LW * 0.8);
    K.line((q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2, (q[3][0] + q[2][0]) / 2, (q[3][1] + q[2][1]) / 2, LW * 0.7);
    // sağ duvarda saat (basık elips)
    const [sx, sy] = yanDuvarP(false, 2.6, 560), z = zv(2.6), rr = 46 / z;
    K.ell(sx, sy, rr * 0.55, rr, PAL.paper, LW * 0.8);
    const el = (a, l, w) => K.line(sx, sy, sx + Math.sin(a) * l * rr * 0.55, sy - Math.cos(a) * l * rr, w);
    el(TAU * (10.2 / 12), 0.5, 5); el(TAU * 0.2, 0.75, 4); el(TAU * (t / 60) * 6, 0.85, 2.5);
  },
});
// Plan: zemin ızgarası ve çevresinde duvar; dışarıda koridor. Döngüler: köşede vantilatör, yan sehpada çay buharı.
M.mekanEkle(PLAN, {
  gen: [BX - 200, BX + 1280], dongu: ['vantilatör pervanesi', 'çay buharı'],
  kadraj: { plan: [1.0, BX + 540, 960] },
  arka(K, t) {
    const { ctx } = K;
    ctx.fillStyle = '#8E9C8E'; ctx.fillRect(BX - 900, -400, 2900, 2800);
    for (let i = -8; i < 30; i++) { K.line(BX - 900, i * 110 + 20, BX + 2000, i * 110 + 20, 3, '#829082'); }
    // duvar kalınlığı
    const d = 26; K.rect(GX - d, GY - d, 8 * PT + 2 * d, 8 * PT + 2 * d, PAL.wallDark, LW, 6);
    // kapı aralığı (alt duvarda, ortada)
    K.rect(GX + 3 * PT, GY + 8 * PT - 2, 2 * PT, d + 6, '#8E9C8E', 0);
    K.line(GX + 3 * PT, GY + 8 * PT, GX + 3 * PT, GY + 8 * PT + d, LW * 0.7); K.line(GX + 5 * PT, GY + 8 * PT, GX + 5 * PT, GY + 8 * PT + d, LW * 0.7);
    // sağ üst köşede vantilatör (dışarıda, ayaklı)
    const [fx, fy] = [GX + 8 * PT + 70, GY - 10]; K.circ(fx, fy, 46, '#CFE3DD', LW * 0.7);
    for (let k = 0; k < 3; k++) { const a = t * 9 + k * TAU / 3; ctx.save(); ctx.translate(fx, fy); ctx.rotate(a); K.ell(0, -22, 12, 22, PAL.metal, LW * 0.5); ctx.restore(); }
    K.circ(fx, fy, 8, PAL.metalDark, LW * 0.5);
    // sol altta yan sehpa ve çay
    const [cx, cy] = [GX - 120, GY + 8 * PT + 40]; K.rect(cx - 50, cy - 50, 100, 100, PAL.woodTop, LW, 10);
    K.circ(cx, cy, 24, PAL.cream, LW * 0.6); K.circ(cx, cy, 16, '#B5532A', LW * 0.5); K.circ(cx, cy, 8, '#7E3518', 0);
    H.buhar(K, cx, cy - 22, t, { k: 0.55, n: 2, ara: 20 });
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    hitch: 0.3, zemini: T('h1:2'), otuzbir: T('h1:3'), kapla: T('h1:6'),
    plan: T('h2a') - 0.05, sekize: T('h2a:1'), sekiz: T('h2a:2'), karo: T('h2a:3'), karsi: T('h2a:4'), koseler: T('h2a:5'), kolon: T('h2a:6'),
    hali: T('h2b:1'), yanyana: T('h2b:2'), iki: T('h2b:4'), kesmek: T('h2b:7'), sigar: T('h2b:9'),
    d2: T('d2'), otuz: T('d2:3'), hepsi: T('d2:6'),
    hd: T('hd'), bos1: T('hd:3') - 0.04, bos2: T('hd:4') - 0.04,
    n1: T('n1'), lekeler: T('n1'), zemin2: T('n1:4'), dama: T('n1:5'),
    asla: T('d3:1'), sigmaz: T('d3:2'),
    d4: T('d4'), d4hali: T('d4:2'), d4koyu: T('d4:4') - 0.04, d4acik: T('d4:6') - 0.04, kaplar: T('d4:8'), kIki: T('d4:9'), kKolon: T('d4:10'), kKoyu: T('d4:12'),
    d5: T('d5'), koyu30: T('d5') - 0.04, acik32: T('d5:4') - 0.04, ikiAcik: T('d5:6'), bosta: T('d5:10'),
    espri: T('h4') - 0.16, kolonlar: T('h4:1'), tasi: T('h4:3'), cta: T('d6') - 0.14,
  };
  // ——— yanlış deneme: Necmi'nin eli satır satır serer (ilk halı h2b'de, kalan 29'u hd'de) ———
  tm.ilk = tm.hali - 0.04;
  tm.ser0 = T('hd') + 0.06; tm.serDr = (tm.bos1 - 0.12 - tm.ser0) / 8; tm.seritDur = tm.serDr * 2 / 8 + 0.03;
  tm.serme = DIZ.map((d, i) => { if (i === 0) return tm.ilk; const pos = d.r % 2 ? 8 - (d.c + 2) : d.c; return tm.ser0 + d.r * tm.serDr + pos / 8 * tm.serDr; });
  tm.otuzbirinci = tm.bos2 + 0.25; tm.geriCek = tm.otuzbirinci + 0.5; tm.necCik = tm.geriCek + 0.3;
  // ——— sayaç: Defne 0. satırda iki halıyı kaydırır, boşluk gezer ama ikisi hep kalır ———
  tm.kay = [cd0 + 1.1, cd0 + 2.3]; tm.kay1Bit = tm.kay[0] + 0.3; tm.kay2Bit = tm.kay[1] + 0.3;
  tm.dokun = [tm.kay[1] + 0.75, tm.kay[1] + 1.2]; tm.defCik = tm.dokun[1] + 0.3;
  tm.oda3 = cd - 0.05; tm.sayacBit = tm.oda3;          // oda kesmesi; plan boşluk parlaması burada biter
  tm.kova = tm.oda3 + 0.5;                                     // Necmi rulosunu gösterir
  // ——— ipucu: Necmi rulosunu kovaya batırır; boya sahnesinde rulo zikzakla koyu karoları boyar ———
  tm.batir = tm.lekeler + 0.05; tm.goster = tm.zemin2 - 0.35;
  tm.boyaKes = tm.zemin2 - 0.05; tm.boya0 = tm.boyaKes + 0.36; tm.boyaDr = (tm.buldum - 0.6 - tm.boya0) / 8;
  // ——— cevap: halılar kalkar, Defne tek halıyla gösterir, sayaçlar, halılar iner, boşluklar mercan ———
  tm.cevap = tm.sigmaz - 0.05; tm.kalk = tm.sigmaz + 0.02;
  tm.orn = [tm.d4hali - 0.05, tm.kaplar + 0.12]; tm.ornCik = tm.koyu30 + 0.25; tm.don = tm.ikiAcik - 0.08; tm.bosSon = tm.bosta - 0.04;

  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, ...M.kadraj(ODA, 'kanca')], [tm.kapla, 1.22, 566, 1008], [tm.plan - 0.1, 1.23, 568, 1007]] },
    { id: 'plan', t0: tm.plan, cam: [[0, 1.0, BX + 540, 960], [tm.karo, 1.01, BX + 540, 956], [tm.hali, 1.03, BX + 520, 945], [tm.sigar, 1.04, BX + 525, 950]] },
    { id: 'oda2', t0: tm.d2 - 0.1, cam: [[0, 1.2, 630, 930], [tm.hepsi, 1.23, 640, 928]] },
    { id: 'deneme', t0: tm.hd - 0.1, cam: [[0, 1.0, BX + 540, 960], [tm.bos2, 1.02, BX + 530, 955], [tm.kay[0] - 0.4, 1.0, BX + 545, 930], [tm.dokun[0], 1.01, BX + 550, 925], [tm.oda3 - 0.1, 1.02, BX + 548, 930]] },
    { id: 'oda3', t0: tm.oda3, cam: [[0, 1.26, 560, 968], [tm.boyaKes - 0.1, 1.31, 564, 962]] },
    { id: 'boya', t0: tm.boyaKes, cam: [[0, 1.0, BX + 540, 960], [tm.buldum - 0.1, 1.02, BX + 540, 955]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, DEF_X - 20, 890]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.08, BX + 540, 950], [tm.d4, 1.1, BX + 540, 945], [tm.d5, 1.1, BX + 540, 940], [tm.bosta, 1.12, BX + 540, 945]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.26, 470, 975], [tm.tasi, 1.3, 455, 970]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.3, 455, 970], [tm.cta + 0.6, 1.38, DEF_X - 10, 965], [tm.end - 0.1, 1.42, DEF_X - 10, 960]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const k = key => ({ s: H.BOY[key] * KS, y: AYAK });
  const hikBase = kisi('hikmet', { x: HIK_X, ...k('hikmet'), expr: 'mutlu', head: { tilt: -3, look: [0.5, 0.4] }, ...POZ.dur });
  const hik = [
    [tm.kapla, { head: { tilt: 4, look: [0.6, 0.2] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.2] } }, 0.01],
    [tm.hepsi, { expr: 'mutlu', head: { tilt: -4, look: [0.9, 0.1] } }, 0.3],
    [tm.oda3, { expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.3] }, ...POZ.belde }, 0.01],
    [tm.kova + 0.3, { head: { tilt: 3, look: [0.9, 0.1] } }, 0.3],
    [tm.buldum - 0.05, { armL: POZ.dur.armL }, 0.01],
    [tm.espri, { expr: 'mutlu', head: { tilt: -4, look: [-0.8, 0.0] }, ...POZ.dur }, 0.01],
    [tm.tasi + 0.2, { expr: 'saskin', head: { tilt: 5, look: [-0.9, 0.1] } }, 0.25],
  ];
  const defBase = kisi('defne', { x: DEF_X, ...k('defne'), expr: 'saskin', head: { tilt: 4, look: [-0.6, 0.4] }, ...POZ.dur });
  const def = [
    [0.8, { head: { tilt: -4, look: [-0.8, 0.2] } }, 0.35],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [-0.8, 0.1] } }, 0.01],
    [tm.hepsi - 0.1, { expr: 'mutlu', head: { tilt: -6, look: [0, 0] } }, 0.3],
    [tm.oda3, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [-0.4, 0.5] } }, 0.01],
    [tm.kova + 0.2, { head: { tilt: 5, look: [-0.9, 0.1] } }, 0.3],
    [tm.buldum - 0.06, {}, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0, -0.3] }, armR: POZ.dur.armR }, 0.25, ease.enter],
    [tm.espri, { expr: 'mutlu', head: { tilt: -4, look: [-0.9, 0.1] }, armR: POZ.dur.armR }, 0.01],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.15, 0.05] } }, 0.01],
    [tm.cta + 0.6, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.4],
  ];
  const necBase = kisi('necmi', { x: NEC_X, ...k('necmi'), expr: 'notr', head: { tilt: 3, look: [-0.5, 0.3] }, ...POZ.dur });
  const nec = [
    [tm.kapla, { expr: 'saskin', head: { tilt: 5, look: [-0.8, 0.2] } }, 0.25],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: -3, look: [0.8, 0.2] } }, 0.01],
    [tm.oda3, { expr: 'mutlu', head: { tilt: -3, look: [0.5, 0.5] } }, 0.01],
    [tm.kova, { head: { tilt: -4, look: [0.6, -0.3] } }, 0.3],
    [cd - 0.1, { head: { tilt: -3, look: [0.05, 0.1] } }, 0.3],
    [tm.batir + 0.1, { head: { tilt: 4, look: [-0.3, 0.7] } }, 0.3],
    [tm.goster, { expr: 'mutlu', head: { tilt: -5, look: [0.3, -0.2] } }, 0.3],
    [tm.espri, { expr: 'notr', head: { tilt: 3, look: [0.8, 0.1] } }, 0.01],
    [tm.tasi - 0.05, { expr: 'kizgin', head: { tilt: -9, look: [-0.7, 0.2] } }, 0.22],
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { d4: 8, d5: 6 }, kartBoy: 52,
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'plan' || id === 'deneme' || id === 'boya' || id === 'cevap') planSahne(K, t, tl, S, B);
    else odaSahne(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const sabit = a => p => { const c = S.film.cam(a, 0.009); return [540 + (p[0] - c.cx) * c.zoom, 960 + (p[1] - c.cy) * c.zoom]; };
    if (id === 'plan') {
      H.adimEtiket(K, t, [[tm.karo - 0.04, '64 KARO', PAL.mustard, INK], [tm.kolon - 0.04, '62 KARO', PAL.mustard, INK]], tm.d2 - 0.3, sabit(tm.karo)([GX + 4 * PT, GY + 4 * PT]), 60);
      H.tag(K, t, tm.iki - 0.04, tm.kesmek + 0.3, sabit(tm.iki)([GX + 2 * PT, GY + 1.85 * PT]), K.up('1 halı = 2 karo'), PAL.paper, INK, 46);
    }
    if (id === 'plan') H.mark(K, t, tm.kesmek + 0.32, tm.d2 - 0.25, sabit(tm.kesmek)([GX + 2 * PT + 46, GY + 0.5 * PT + 52]), false);
    if (id === 'oda2') H.tag(K, t, tm.otuz - 0.04, tm.hd - 0.3, sabit(tm.otuz)([NEC_X + 70, 598]), '62 ÷ 2 = 31', PAL.mustard, INK, 56, [tm.hepsi]);
    if (id === 'deneme') H.mark(K, t, tm.otuzbirinci + 0.3, tm.necCik, sabit(tm.otuzbirinci)([GX + 1.0 * PT, GY + 6.55 * PT]), false);
    if (id === 'cevap') {
      const a = sabit(tm.d4);
      const yer = x => a([GX + x * PT, GY - 0.85 * PT]);
      H.tag(K, t, tm.d4koyu, tm.kKolon - 0.06, yer(2), K.up('koyu'), KOYU, PAL.paper, 54);
      H.tag(K, t, tm.d4acik, tm.kKolon - 0.06, yer(6), K.up('açık'), PAL.paper, INK, 54);
      H.tag(K, t, tm.kKolon - 0.04, tm.koyu30 - 0.06, yer(4), K.up('aynı renk'), PAL.mustard, INK, 54, [tm.kKoyu]);
      H.tag(K, t, tm.koyu30, tm.espri - 0.2, yer(2), `${K.up('koyu')} 30`, KOYU, PAL.paper, 54, [tm.bosta]);
      H.tag(K, t, tm.acik32, tm.espri - 0.2, yer(6), `${K.up('açık')} 32`, PAL.paper, INK, 54, [tm.bosta + 0.07]);
    }
  },
});

// ——— uzun kol (kuşbakışı; kadrajın kenarından girer) — b038'den ———
function uzunKol(K, key, org, el, hedef, S = 300) {
  const c = H.CARDS[key], { ctx } = K, w = c.arm.w * S, lw = c.line * S, u = H.unit(el, org), bilek = [el[0] + u[0] * 44 * S / 300, el[1] + u[1] * 44 * S / 300];
  ctx.save(); ctx.lineCap = 'butt';
  for (const [ww, col] of [[w + lw * 2, INK], [w, c.arm.color]]) H.strokeLine(ctx, org, bilek, ww, col);
  H.strokeLine(ctx, [bilek[0] + u[0] * 12, bilek[1] + u[1] * 12], bilek, w + lw * 2, INK); H.strokeLine(ctx, [bilek[0] + u[0] * 14, bilek[1] + u[1] * 14], [bilek[0] + u[0] * 4, bilek[1] + u[1] * 4], w, c.arm.shade);
  ctx.restore();
  if (hedef) H.isaret(K, key, el, S, hedef, 1.25); else H.grip(K, key, el, S);
}

// ═══════════════════════════ Plan sahnesi ═══════════════════════════
function planSahne(K, t, tl, S, B) {
  const { tm } = S, { heads, cam } = B, id = B.sc.id, { ctx } = K;
  const ekrandan = (sx, sy) => [cam.cx + (sx - 540) / cam.zoom, cam.cy + (sy - 960) / cam.zoom];
  M.mekanCiz(K, PLAN, 'arka', t);
  // satır / sütun dalgası (h2a: "sekize" üst satır, "sekiz" sol sütun) — karolar kabarır
  zeminCiz(K, planP, t, S);
  if (id === 'plan') {
    for (let i = 0; i < 8; i++) {
      for (const [r, c, a] of [[0, i, tm.sekize + i * 0.055], [i, 0, tm.sekiz + i * 0.055]]) {
        const k = H.nabiz(t, a, 0.3); if (k < 0.01) continue;
        ctx.save(); ctx.globalAlpha = 0.6 * k; ctx.lineWidth = 8; ctx.strokeStyle = PAL.mustard; K.path(quad(planP, c + 0.08, r + 0.08, c + 0.92, r + 0.92)); ctx.stroke(); ctx.restore();
      }
    }
  }
  // kolon vurgusu
  const vk = [Math.max(H.nabiz(t, tm.karsi, 0.4), id === 'cevap' ? pw(t, tm.kIki, tm.koyu30 - 0.1, 0.2, 0.3) : 0),
    Math.max(H.nabiz(t, tm.koseler, 0.4), id === 'cevap' ? pw(t, tm.kKolon - 0.1, tm.koyu30 - 0.1, 0.2, 0.3) : 0)];
  // koyu / açık karo dalgası (d5): "otuz koyu" koyular, "otuz iki açık" açıklar kabarır
  if (id === 'cevap') {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      if (KOLON.some(([kr, kc]) => kr === r && kc === c)) continue;
      const a = (koyu(r, c) ? tm.koyu30 : tm.acik32) + (r + c) * 0.03, k = H.nabiz(t, a, 0.34);
      if (k > 0.01) { ctx.save(); ctx.globalAlpha = 0.85 * k; ctx.lineWidth = 7; ctx.strokeStyle = koyu(r, c) ? PAL.mustard : PAL.teal; K.path(quad(planP, c + 0.1, r + 0.1, c + 0.9, r + 0.9)); ctx.stroke(); ctx.restore(); }
    }
  }
  // halılar
  for (let i = 0; i < DIZ.length; i++) {
    const h = haliDurum(S, i, t); if (!h) continue;
    haliCiz(K, planP, hucre(h.r, h.c), h.renk, { acil: h.acil, acYon: h.acYon, sar: h.sar, kalk: h.kalk });
  }
  KOLON.forEach(([r, c], j) => kolonPlan(K, planP, r, c, vk[j]));
  // h2b "kesmek yok": halının ortasından kesik mercan çizgi
  if (id === 'plan' && t > tm.kesmek - 0.04) { const v = ease.enter(seg(t, tm.kesmek - 0.04, 0.3)) * (1 - ease.exit(seg(t, tm.d2 - 0.45, 0.2))); if (v > 0.01) { ctx.save(); ctx.setLineDash([14, 10]); ctx.lineCap = 'butt'; const a = planP(2, 0.02), b = planP(2, 0.02 + 0.96 * v); H.strokeLine(ctx, a, b, 9, MERCAN); ctx.restore(); } }

  // ——— eller ———
  // h2a: Hikmet'in sol eli (alttan) iki kolona dokunur
  if (id === 'plan') {
    heads.hikmet = ekrandan(150, 1500);
    const c1 = planP(0.5, 0.5), c2 = planP(7.5, 7.5);
    const g0 = tm.karsi - 0.45, g1 = tm.koseler + 0.75;
    if (t > g0 - 0.3 && t < g1 + 0.35) {
      const dz = [[g0 - 0.3, [GX - 120, 1300]], [tm.karsi, [c1[0] + 18, c1[1] + 30]], [tm.koseler, [c2[0] - 22, c2[1] + 24]], [g1 + 0.35, [GX + 200, 1420]]];
      const p = H.dokunYolu(t, dz, { yuksel: 40, sure: 0.22 });
      uzunKol(K, 'hikmet', [GX - 300, 1560], [p[0] - 30, p[1] + 50], p);
    }
    // h2b: Necmi'nin sağ eli (soldan) ilk halıyı serer
    heads.necmi = ekrandan(-60, 900);
    const tp = tm.ilk, dz = [[tp - 0.55, [GX - 260, GY + 0.5 * PT]], [tp - 0.05, planP(1.05, 0.5)]], acil = ease.enter(seg(t, tp, 0.34));
    if (t > tp - 0.6 && t < tm.yanyana + 0.75) {
      let el = t < tp ? yol(t, dz) : planP(lerp(1.05, 2.95, acil), 0.5);
      const cik = W(t, tm.yanyana + 0.2, 0.45); el = [lerp(el[0], GX - 260, cik), el[1]];
      if (t < tp) haliCiz(K, planP, [0.45 + (el[0] - planP(1.05, 0)[0]) / PT, 0, 2.45 + (el[0] - planP(1.05, 0)[0]) / PT, 1], DIZ[0].renk, { acil: 0.02 });
      uzunKol(K, 'necmi', [GX - 520, GY + 0.8 * PT], [el[0] - 10, el[1] + 4], null);
    }
  }
  // hd: Necmi'nin eli zikzakla serer; sonra 31. halıyla sol alt boşluğa uzanır, sığmaz, geri çeker
  if (id === 'deneme') {
    heads.necmi = ekrandan(-60, 1000); heads.hikmet = ekrandan(150, 1500);
    const t0 = tm.ser0, dr = tm.serDr;
    let el = null, rulo = null;
    if (t >= t0 - 0.35 && t < t0 + 8 * dr) {
      if (t < t0) el = yol(t, [[t0 - 0.35, [GX - 240, GY + 1.5 * PT]], [t0, planP(1.0, 0.5)]]);
      else { const f = (t - t0) / dr, r = Math.min(7, Math.floor(f)), q = f - r, u = r % 2 ? 8 - q * 8 : q * 8; el = planP(Math.max(0.3, Math.min(7.7, u)), r + 0.5 + 0.0 * q); }
      rulo = 'h';
    } else if (t >= t0 + 8 * dr && t < tm.necCik + 0.4) {
      // 31. halı: rulo elde, sol alt boşluğa (7,0) gider, (7,1)'in üstüne açılır (biner), geri çeker, çıkar
      const P0 = planP(1.5, 7.5), P1 = planP(0.2, 7.5);
      el = yol(t, [[t0 + 8 * dr, planP(1.0, 7.5)], [tm.otuzbirinci - 0.05, P1], [tm.otuzbirinci + 0.3, P0], [tm.geriCek, P0], [tm.geriCek + 0.25, P1], [tm.necCik, P1], [tm.necCik + 0.4, [GX - 300, GY + 7.5 * PT]]]);
      const ac = clamp01((el[0] - P1[0]) / (P0[0] - P1[0]));
      const mer = W(t, tm.otuzbirinci + 0.2, 0.12);
      haliCiz(K, planP, [0, 7, 2, 8], 1, { acil: Math.max(0.02, ac), acYon: 1, mercan: mer * (ac > 0.4 ? 1 : 0) });
      rulo = null;
    }
    if (el) {
      if (rulo) { const [x, y] = el; ctx.save(); ctx.lineCap = 'round'; H.strokeLine(ctx, [x, y - PT * 0.4], [x, y + PT * 0.4], 22 + LW * 1.4, INK); H.strokeLine(ctx, [x, y - PT * 0.4], [x, y + PT * 0.4], 22, HALI[DIZ[Math.min(29, Math.floor((t - t0) / dr * 3.75))]?.renk ?? 0][0]); ctx.restore(); }
      uzunKol(K, 'necmi', [GX - 520, el[1] + 30], [el[0] - 8, el[1] + 2], null);
    }
    // sayaç: Defne'nin sol eli (sağdan) 0. satırda iki halıyı kaydırır, sonra iki boşluğa dokunur
    heads.defne = ekrandan(1140, 700);
    const g0 = tm.kay[0] - 0.45, g1 = tm.defCik;
    if (t > g0 && t < g1 + 0.3) {
      const hc = j => { const d = DIZ[KAY[j].i]; return planP(d.c + 1 + ease.state(seg(t, tm.kay[j], 0.36)), d.r + 0.55); };
      let el2;
      if (t < tm.kay[0] + 0.36) el2 = t < tm.kay[0] ? yol(t, [[g0, [GX + 8 * PT + 260, GY + 1.2 * PT]], [tm.kay[0] - 0.05, hc(0)]]) : hc(0);
      else if (t < tm.kay[1]) el2 = yol(t, [[tm.kay[0] + 0.4, hc(0)], [tm.kay[1] - 0.05, hc(1)]]);
      else if (t < tm.kay[1] + 0.36) el2 = hc(1);
      else el2 = null;
      if (el2) uzunKol(K, 'defne', [GX + 8 * PT + 560, el2[1] + 60], [el2[0] + 14, el2[1] + 4], null);
      else {
        const b1 = planP(3.5, 0.5), b2 = planP(0.5, 7.5);
        const dz = [[tm.kay[1] + 0.36, planP(4.6, 0.62)], [tm.dokun[0], b1], [tm.dokun[1], b2], [g1 + 0.3, [GX + 8 * PT + 300, GY + 6 * PT]]];
        const p = H.dokunYolu(t, dz, { yuksel: 36, sure: 0.2 });
        uzunKol(K, 'defne', [GX + 8 * PT + 560, p[1] + 40], [p[0] + 34, p[1] + 34], p);
      }
    }
  }
  // boya: Necmi'nin rulosu (alttan) zikzakla gider; koyu karolar boyanır, halılar rulonun önünde dürülür
  if (id === 'boya') {
    heads.necmi = ekrandan(540, 1700);
    const t0 = tm.boya0, dr = tm.boyaDr, f = clamp01((t - t0) / (8 * dr)) * 8, r = Math.min(7, Math.floor(f)), q = Math.min(1, f - r);
    const u = r % 2 ? 8 - q * 8 : q * 8, v = r + 0.5, giris = W(t, tm.boyaKes, 0.12);
    const p = planP(Math.max(0.5, Math.min(7.5, u)), v), ruloP = [p[0], lerp(1500, p[1], giris)];
    // rulo silindiri (dikey eksen) + sap
    const sap = [ruloP[0] + 30, ruloP[1] + 170];
    ctx.save(); ctx.lineCap = 'round';
    H.strokeLine(ctx, ruloP, sap, 12 + 5, INK); H.strokeLine(ctx, ruloP, sap, 12, PAL.metal);
    H.strokeLine(ctx, [ruloP[0], ruloP[1] - PT * 0.42], [ruloP[0], ruloP[1] + PT * 0.42], 30 + 8, INK); H.strokeLine(ctx, [ruloP[0], ruloP[1] - PT * 0.42], [ruloP[0], ruloP[1] + PT * 0.42], 30, KOYU);
    ctx.restore();
    uzunKol(K, 'necmi', [ruloP[0] + 160, 1700], [sap[0], sap[1] + 6], null);
  }
  // cevap: Defne'nin eli (sağdan) tek halıyla iki yere koyar; sonra halıyı boşlukların üstünde tutar
  if (id === 'cevap') {
    heads.defne = ekrandan(1140, 760);
    const [o1, o2] = ORNEK, giris = tm.orn[0] - 0.4;
    const m1 = planP(o1.c + 1, o1.r + 0.5), m2 = planP(o2.c + 0.5, o2.r + 1);
    if (t > giris) {
      // halının merkezi ve yönü (0 yatay → 1 dikey)
      const yuk = 0.25;   // havada iken hafif büyük
      const dz = [[giris, [GX + 8 * PT + 200, GY + 3.5 * PT]], [tm.orn[0], m1], [tm.orn[1], m1], [tm.orn[1] + 0.4, m2], [tm.ornCik, m2], [tm.ornCik + 0.45, [GX + 8 * PT + 300, GY + 5 * PT]]];
      const m = yol(t, dz), donus = W(t, tm.orn[1], 0.4), hava = Math.max(1 - W(t, tm.orn[0] - 0.15, 0.15), W(t, tm.orn[1], 0.1) * (1 - W(t, tm.orn[1] + 0.3, 0.1)), W(t, tm.don - 0.1, 0.2));
      const a = donus * Math.PI / 2, k = 1 + 0.08 * hava, L = PT * (2 - 0.14) / 2 * k, Wd = PT * (1 - 0.14) / 2 * k;
      const c = Math.cos(a), s = Math.sin(a), pts = [[-L, -Wd], [L, -Wd], [L, Wd], [-L, Wd]].map(([x, y]) => [m[0] + x * c - y * s, m[1] + x * s + y * c]);
      const kalkti = false;
      ctx.save(); ctx.globalAlpha = 0.2; K.poly(pts.map(([x, y]) => [x + 8 + 22 * hava, y + 10 + 26 * hava]), INK, 0); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.72; K.poly(pts, kalkti ? H.mixHex(HALI[2][0], MERCAN, pw(t, tm.bosSon, 1e9, 0.1)) : HALI[2][0], 0); ctx.restore();
      K.poly(pts, null, LW * 0.75);
      // halının iki yarısını ayıran çizgi (iki karo)
      ctx.save(); ctx.setLineDash([10, 8]); ctx.lineWidth = 4; ctx.strokeStyle = PAL.cream; ctx.beginPath(); ctx.moveTo(m[0] - Wd * s * -1 * 0 + (-Wd) * -s, m[1] + (-Wd) * c); ctx.lineTo(m[0] + Wd * -s, m[1] + Wd * c); ctx.stroke(); ctx.restore();
      // tutuş: halının sağ ucu (yatayda) / alt ucu (dikeyde)
      const tut = [m[0] + L * 0.75 * c, m[1] + L * 0.75 * s];
      const cik = W(t, tm.ornCik + 0.3, 0.15); if (cik > 0.99) return;
      if (cik < 0.99) uzunKol(K, 'defne', [GX + 8 * PT + 560, tut[1] + 80], [tut[0] + 10, tut[1] + 6], null);
      // halkalar: koyu ve açık karo
      if (t < tm.orn[1] + 0.05) { H.ring(K, planP(o1.c + 1.5, o1.r + 0.5), t, tm.d4koyu, PAL.mustard); H.ring(K, planP(o1.c + 0.5, o1.r + 0.5), t, tm.d4acik, PAL.teal); }
      else if (t < tm.koyu30) { H.ring(K, planP(o2.c + 0.5, o2.r + 1.5), t, tm.orn[1] + 0.42, PAL.mustard); H.ring(K, planP(o2.c + 0.5, o2.r + 0.5), t, tm.orn[1] + 0.5, PAL.teal); }
    }
  }
}

// ═══════════════════════════ Oda sahnesi ═══════════════════════════
function odaSahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, { ctx } = K;
  M.mekanCiz(K, ODA, 'arka', t);
  // zemin (perspektif) ve halılar; uzak kolon karakterlerin arkasında, yakın kolon önde
  ctx.save(); ctx.fillStyle = '#3B4E4B'; K.poly([odaP(0, 8), odaP(8, 8), [odaP(8, 8)[0] + 160, 2000], [odaP(0, 8)[0] - 160, 2000]], '#3B4E4B', 0); ctx.restore();
  zeminCiz(K, odaP, t, S, { lw: 2.5 });
  for (let i = 0; i < DIZ.length; i++) { const h = haliDurum(S, i, t); if (h) haliCiz(K, odaP, hucre(h.r, h.c), h.renk, { acil: 1, sar: h.sar, kalk: h.kalk }); }
  kolonOda(K, ...KOLON[0]);

  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum) * KS;
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  const o = { defne: { heads }, necmi: { heads }, hikmet: { heads } };
  const sN = np.s / 300, sD = dp.s / 300;
  // ——— Necmi: rulo destesi (kanca, d2) ———
  let deste = null, kovaEl = null, ruloA = null, ruloBoyali = 0;
  const desteSay = id === 'oda' ? 3 : 3;
  const yigin = id === 'oda' || id === 'oda2';
  if (yigin) {
    const hitch = 30 * H.nabiz(t, tm.hitch, 0.36) + 22 * H.nabiz(t, tm.kapla + 0.1, 0.36);
    const g = H.eklem('necmi', np, 'pelvis');
    deste = [g[0], g[1] - 30 * F - hitch];
    o.necmi.L = [[deste[0] - 92 * F, deste[1] + 2], 1, 'A']; o.necmi.R = [[deste[0] + 92 * F, deste[1] + 2], 1, 'A'];
  }
  // ——— Necmi: kova ve rulo (oda3) ———
  if (id === 'oda3') {
    const g = H.elYeri('necmi', np, 'L', 'asagi'), gg = H.elYeri('necmi', np, 'L', 'gogus');
    const kal = W(t, tm.batir - 0.3, 0.35) * (1 - W(t, tm.goster, 0.35));
    kovaEl = [lerp(g[0] - 4, gg[0] + 30, kal), lerp(g[1] + 6, gg[1] + 20, kal)];
    o.necmi.L = [kovaEl, 1, 'A'];
    // sağ el: sap; rulo önce aşağıda (yan), gösterirken başın yanında, batırırken kovanın üstünde
    const asagi = H.elYeri('necmi', np, 'R', 'asagi'), yuk = H.elYeri('necmi', np, 'R', 'yukari');
    const bat = W(t, tm.batir - 0.25, 0.3) * (1 - W(t, tm.goster - 0.05, 0.3));
    const gos = Math.max(W(t, tm.kova, 0.4) * (1 - W(t, cd0Of(S) + 4.3, 0.35)), W(t, tm.goster, 0.4));
    const kovaUst = [kovaEl[0] + 4, kovaEl[1] - 118 * sN * 3.3 * 0.36];
    const gR = H.elYeri('necmi', np, 'R', 'gogus'); let el = [lerp(asagi[0] + 8, gR[0] + 14, gos), lerp(asagi[1], gR[1] + 16, gos)];
    el = [lerp(el[0], kovaUst[0] + 70, bat), lerp(el[1], kovaUst[1] - 30, bat)];
    o.necmi.R = [el, 1, 'B'];
    ruloA = lerp(lerp(-Math.PI / 2 + 0.25, Math.PI + 0.35, gos), Math.PI * 0.62, bat);
    ruloBoyali = W(t, tm.batir + 0.25, 0.2);
  }
  // ——— Hikmet: kancada zemini gösterir; espride kolonu gösterir ———
  if (id === 'oda') {
    const g = pw(t, tm.zemini - 0.1, tm.plan + 0.2);
    if (g > 0.01) o.hikmet.R = [[HIK_X + 150 * F, AYAK - 210 * F], g, 'B'];
  }
  // ——— Defne: d2'de Necmi'nin destesinden bir rulo alır ———
  let defRulo = null;   // Defne'nin elindeki rulo (sol el)
  if (id === 'oda2') {
    const ust = [deste[0] + 6 * F, deste[1] - 34 * 2 * F];
    const v = H.elVer(t, tm.otuz - 0.35, ust, H.elYeri('defne', dp, 'L', 'gogus'), { uzat: 0.32, ortak: 0.17, cek: 0.4 });
    const kald = W(t, tm.hepsi - 0.1, 0.35);
    const yuk = H.elYeri('defne', dp, 'L', 'yukari');
    const alP = v.alW > 0 || t > tm.otuz ? v.p : null;
    if (t >= tm.otuz - 0.35) {
      const p = [lerp(v.p[0], yuk[0] + 10, kald), lerp(v.p[1], yuk[1] + 150 * F, kald)];
      o.defne.L = [p, Math.max(W(t, tm.otuz - 0.35, 0.3), 0), 'A'];
      defRulo = { p, alindi: t >= tm.otuz };
    }
    void alP;
  }
  if (['oda3', 'buldum', 'espri', 'cta'].includes(id)) {
    const g = H.elYeri('defne', dp, 'L', id === 'buldum' ? 'yukari' : 'asagi');
    let p = [g[0] + (id === 'buldum' ? -14 : 4), g[1] + (id === 'buldum' ? -20 : 4)];
    if (id === 'cta') { const y = H.elYeri('defne', dp, 'L', 'yukari'), w = W(t, tm.cta + 0.05, 0.45); p = [lerp(p[0], y[0] + 30, w), lerp(p[1], y[1] + 120, w)]; }
    if (id === 'buldum') { const a = H.elYeri('defne', dp, 'L', 'gogus'), w = ease.enter(seg(t, tm.buldum - 0.05, 0.25)); p = [lerp(a[0], p[0], w), lerp(a[1], p[1], w)]; }
    o.defne.L = [p, 1, 'A']; defRulo = { p, alindi: true };
  }
  // ——— espri: Necmi kolona sarılır, Hikmet kolonu gösterir ———
  if (id === 'espri' || id === 'cta') {
    np.x = 368; hp.x = 545;
    const kol = odaP(0.5, 0.5), sar = W(t, tm.tasi - 0.15, 0.3);
    const gH = pw(t, tm.kolonlar - 0.2, tm.tasi + 0.6);
    if (gH > 0.01) o.hikmet.L = [[kol[0] + 70, AYAK - 760 * F], gH, 'B'];
    const nL = H.elYeri('necmi', np, 'L', 'asagi'), nR = H.elYeri('necmi', np, 'R', 'asagi');
    o.necmi.L = [[lerp(nL[0], kol[0] - 12, sar), lerp(nL[1], AYAK - 260 * F, sar)], 1, 'A'];
    o.necmi.R = [[lerp(nR[0], kol[0] + 12, sar), lerp(nR[1], AYAK - 200 * F, sar)], 1, 'A'];
    if (sar > 0.5) np.x = lerp(368, 330, ease.state((sar - 0.5) * 2));
  }

  // ——— karakterler ———
  const ciz = {};
  ciz.h = oyna(K, t, tl, 'hikmet', hp, o.hikmet);
  ciz.n = oyna(K, t, tl, 'necmi', np, o.necmi);
  ciz.d = oyna(K, t, tl, 'defne', dp, o.defne);
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
  // ——— nesneler ve tutan eller ———
  if (deste) {
    const n = desteSay - (id === 'oda2' && t >= tm.otuz ? 1 : 0);
    for (let i = 0; i < n; i++) ruloOn(K, [deste[0] + (i % 2 ? 6 : -4) * F, deste[1] + (14 - i * 34) * F], 190 * F, i % 3, 1.2 * F);
    ciz.n.tut('L'); ciz.n.tut('R');
  }
  if (defRulo) {
    if (id === 'oda2' && !defRulo.alindi) { /* rulo hâlâ destede */ }
    else ruloOn(K, id === 'oda2' ? [defRulo.p[0] + 40 * F * W(t, tm.otuz, 0.3), defRulo.p[1] - 4 * F] : id === 'buldum' ? [defRulo.p[0] + 10 * F, defRulo.p[1] - 26 * F] : [defRulo.p[0] - 2 - (id === 'cta' ? 50 * F : 0), defRulo.p[1] - 4 * F], 140 * F, 2, F);
    if (o.defne.L && (o.defne.L[1] ?? 1) > 0.5) ciz.d.tut('L');
  }
  if (id === 'oda3') {
    kova(K, ciz.n.handL, sN * 3.3 * 0.62); ciz.n.tut('L');
    ruloBoya(K, ciz.n.handR, ruloA, sN * 3.3 * 0.62, ruloBoyali); ciz.n.tut('R');
  }
  if (id === 'espri' || id === 'cta') { const sr = W(t, tm.tasi - 0.15, 0.3); if (sr > 0.4) { kolonOda(K, ...KOLON[0]); ciz.n.tut('L'); ciz.n.tut('R'); } }
  if (id === 'oda' && o.hikmet.R && o.hikmet.R[1] > 0.6) ciz.h.isaret('R', odaP(3, 2.5));
  if ((id === 'espri' || id === 'cta') && o.hikmet.L && o.hikmet.L[1] > 0.6) ciz.h.isaret('L', [odaP(0.5, 0.5)[0] + 6, AYAK - 860 * F]);
  // yakın kolon en önde
  kolonOda(K, ...KOLON[1]);
}
const cd0Of = S => S.tm.cd0;
