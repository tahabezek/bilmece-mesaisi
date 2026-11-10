// Hikâye motoru (v4): 019–027'nin ortak araçları. Bölüm dosyası (engine/b0NN.js) yalnız buradan ve mekan.js'ten alır.
// İçerik: b128.js'ten (028F) çıkarılan yardımcılar + sahne/kesme sistemi, zaman araçları, madde parçaları (sıvı, alev,
// duman, erime, büyüme, ışık) ve etkileşim parçaları (tutma, taşıma, bırakma, elden ele verme, pankart, sayma, yürüme,
// oturma). Sözleşme: her fonksiyon t'nin saf fonksiyonudur; Math.random yok (tohum: mulberry32), kareler arası durum yok.
// Kullanım kılavuzu: ANIMATION_GUIDE.md § 10 "Motor API". Her parçanın canlı örneği: engine/motor_test.html.
import { ease, seg, spring, clamp01, lerp, mulberry32 } from './core.js';
import { INK, CARDS, EXPR, skeleton } from './cast.js';
import { PAL, LW, kit, riddleCard, clock } from './office.js';
import { at } from './zaman.js';
import { UI, CAM, BIG, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, countdown, glance } from './sahne.js';
import { pill, THINK, THINK2, stamp, pop } from './kalip.js';

// Bölüm dosyası tek satırla alsın diye yeniden dışa verilenler
export { ease, seg, spring, clamp01, lerp, mulberry32, INK, CARDS, EXPR, PAL, LW, kit, riddleCard, clock, at };
export { UI, CAM, BIG, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard, countdown, glance };
export { pill, THINK, THINK2, stamp, pop };

export const D2R = Math.PI / 180;

// ═══════════════════════════ 1. Geometri ve nesne yolu ═══════════════════════════
// Doğru parçası s = [[x0, y0], [x1, y1]] (çıta, sap, kenar…)
export const along = (s, u) => [lerp(s[0][0], s[1][0], u), lerp(s[0][1], s[1][1], u)];
export const unit = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
// İki doğru parçası arasında ara değer: orta nokta + açı + boy ayrı ayrı (boy korunur), ortada `lift` kadar yükselir
export function mixStick(a, b, u, lift = 0) {
  const mid = s => [(s[0][0] + s[1][0]) / 2, (s[0][1] + s[1][1]) / 2], ang = s => Math.atan2(s[1][1] - s[0][1], s[1][0] - s[0][0]), len = s => Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]);
  const ma = mid(a), mb = mid(b), aa = ang(a); let ab = ang(b);
  while (ab - aa > Math.PI) ab -= 2 * Math.PI; while (ab - aa < -Math.PI) ab += 2 * Math.PI;
  const m = [lerp(ma[0], mb[0], u), lerp(ma[1], mb[1], u) - lift * 4 * u * (1 - u)], an = lerp(aa, ab, u), h = lerp(len(a), len(b), u) / 2;
  return [[m[0] - Math.cos(an) * h, m[1] - Math.sin(an) * h], [m[0] + Math.cos(an) * h, m[1] + Math.sin(an) * h]];
}
// Doğru parçası üstünde pt'ye en yakın nokta (parametre [a, b] aralığında): tutuş noktası
export function nearOn(s, pt, a, b) {
  const vx = s[1][0] - s[0][0], vy = s[1][1] - s[0][1], u = ((pt[0] - s[0][0]) * vx + (pt[1] - s[0][1]) * vy) / (vx * vx + vy * vy);
  return along(s, Math.min(b, Math.max(a, u)));
}
// Renk karışımı: '#RRGGBB' ya da 'rgb(r,g,b)' → 'rgb(r,g,b)'
const rgbOf = h => h[0] === '#' ? [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) : h.match(/[\d.]+/g).slice(0, 3).map(Number);
export const mixHex = (a, b, u) => { const A = rgbOf(a), Bc = rgbOf(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, Bc[i], u))).join(',')})`; };
// Yay üstünde nokta: a → b, yolun ortasında `lift` px yükselir (taşıma 40–150)
export const yay = (a, b, u, lift = 0) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - lift * 4 * u * (1 - u)];
// Taşıma: t0'da a'dan kalkar, d saniyede b'ye varır (0,6–0,9 sn, ease.state)
export const tasi = (t, t0, d, a, b, lift = 90, curve = ease.state) => yay(a, b, curve(seg(t, t0, d)), lift);
// Bırakma/düşme: t0'da a'dan bırakılır, t1 temas karesinde b'de DURUR (sekme yok; yatay doğrusal, dikey ivmeli)
export const dus = (t, t0, t1, a, b) => { const u = seg(t, t0, t1 - t0); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u * u)]; };
// Tek nabız (0→1→0): a anında başlar, d sürer. Vurgu, kabarma, esneme için (zıplama değil: tek yarım sinüs)
export const nabiz = (t, a, d = 0.34) => Math.sin(Math.PI * seg(t, a - 0.04, d));
// Sönen titreme (−1..1): çarpma tepkisi, guruldama. a anında başlar, d saniyede söner, f Hz
export const sars = (t, a, d = 0.45, f = 11) => t < a ? 0 : Math.sin(2 * Math.PI * f * (t - a)) * (1 - seg(t, a, d)) ** 2;
// Değer izi: anahtarlar [t, değer (sayı | [x, y…]), süre = 0.35, eğri = ease.state, lift = 0]. İlk anahtarın değeri başlangıçtır.
// Her anahtar o ana kadarki değerden kendi değerine gider (poseAt mantığı); dizi ise y bileşeni ortada lift kadar yükselir.
export function iz(keys, t) {
  let v = keys[0][1];
  for (const [tk, tgt, d = 0.35, curve = ease.state, lift = 0] of keys) {
    if (tk > t) break;
    const u = d > 0 ? curve(seg(t, tk, d)) : 1;
    v = Array.isArray(tgt) ? tgt.map((x, i) => lerp(v[i], x, u) - (i === 1 ? lift * 4 * u * (1 - u) : 0)) : lerp(v, tgt, u);
  }
  return v;
}
export function strokeLine(ctx, a, b, w, col) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); }

// ═══════════════════════════ 2. Karakter: yerleşim, el, poz ═══════════════════════════
// Kadro ölçekleri (1 U'nun pikseli). Kerem = cast.js 'genc' kartı: Defne'den uzun, Hikmet'ten kısa; konuşmaz.
export const BOY = { hikmet: 250, defne: 245, necmi: 225, genc: 232 };
export const KEREM = 'genc';
// Standart yerleşim: kisi('genc', { x: 420, expr: 'notr' }) → zemin 1500, ölçek BOY'dan, head.nod = 0 (baş sallama için)
export const kisi = (key, o = {}) => charBase(key, { y: 1500, s: BOY[key], ...o, head: { nod: 0, ...(o.head || {}) } });
// İskelet eklemi dünya koordinatında: 'head' 'neck' 'pelvis' 'shL' 'shR' 'elL' 'elR' 'handL' 'handR' 'kneeL' 'kneeR' 'ankleL' 'ankleR'
export function eklem(key, p, ad) { const q = skeleton(CARDS[key], p)[ad], f = p.view === 'side' ? (p.facing || 1) : 1; return [p.x + q[0] * p.s * f, p.y + q[1] * p.s]; }
export const shoulder = (key, p, side) => { const sk = skeleton(CARDS[key], p), q = side === 'L' ? sk.shL : sk.shR; return [p.x + q[0] * p.s * (p.view === 'side' ? (p.facing || 1) : 1), p.y + q[1] * p.s]; };

// İki kemikli ters kinematik: el (tx, ty) dünya noktasına uzanır; w (0..1) ile anahtar pozuna karışır.
// Hedef kol boyundan uzaksa kol o yöne dümdüz uzanır (gösterme). Önden görünüşte 'R' ekranın sağı; yandan 'R' yakın kol.
// dirsek:
//   'oto' (varsayılan) → dirsek aşağıda / gövdeye yakın; kol gövdenin önünde çaprazlanacaksa dışarıda. Hedef omza kol
//          boyunun %78'inden yakınsa kol KISALIR (izleyiciye doğru uzanan kol; en çok %62'ye): dirsek sivrilmez.
//   'A' / 'B' → aynı akıllı çözüm, dirsek yanı sabit (A: aşağıda/içte, B: dışarıda). 'oto' kare kare karar verdiği için
//          hedef omzun iç ve dış yanı arasında gezen bir harekette dirsek bir karede yer değiştirebilir; orada 'A' ya da 'B' ver.
//   1 / −1 → 028F'in ham çözümü (kısalma yok); yalnız b128.js'in görüntüsünü sabitlemek için.
// El yüz hizasına gidecekse (megafon ağızda, el çenede) reach değil hazır poz kullan (POZ.dusun) ve nesneyi dönen ele çiz.
export function reach(key, p, side, [tx, ty], w = 1, dirsek = 'oto') {
  if (w <= 0) return;
  const c = CARDS[key], sk = skeleton(c, p), sh = side === 'L' ? sk.shL : sk.shR, u = c.arm.upper, l = c.arm.lower;
  const k = side === 'L' ? 'armL' : 'armR', cur = p[k];
  if (dirsek !== 1 && dirsek !== -1) {   // akıllı kip
    const yan = p.view === 'side', ms = yan ? 1 : side === 'L' ? -1 : 1;
    let dx = (tx - p.x) / (p.s * (yan ? (p.facing || 1) : 1)) - sh[0], dy = (ty - p.y) / p.s - sh[1];
    const d0 = Math.hypot(dx, dy) || 1e-6, f = Math.min(1, Math.max(0.62, d0 / (0.78 * (u + l)))), uu = u * f, ll = l * f;
    const d = Math.min(Math.max(d0, Math.abs(uu - ll) + 0.02), uu + ll - 0.004);
    dx *= d / d0; dy *= d / d0;
    const phi = Math.atan2(dx, dy), al = Math.acos(Math.min(1, Math.max(-1, (uu * uu + d * d - ll * ll) / (2 * uu * d))));
    let dz = dirsek === 'B' ? -1 : 1;
    if (dirsek === 'oto' && !yan) { const aA = phi - ms * al; if (Math.cos(aA) > 0 && ms * Math.sin(aA) < -0.47) dz = -1; }   // dirsek omzun 28° içine düşüyorsa dışarı al
    const a1 = phi - ms * dz * al;
    let a2 = Math.atan2(dx - Math.sin(a1) * uu, dy - Math.cos(a1) * uu) - a1;
    while (a2 > Math.PI) a2 -= 2 * Math.PI; while (a2 < -Math.PI) a2 += 2 * Math.PI;
    p[k] = { sh: lerp(cur.sh, ms * a1 / D2R - (yan ? (p.lean || 0) : 0), w), el: lerp(cur.el, ms * a2 / D2R, w), k: lerp(cur.k ?? 1, f, w) };
    return;
  }
  if (p.view === 'side') {
    let dx = (tx - p.x) / (p.s * (p.facing || 1)) - sh[0], dy = (ty - p.y) / p.s - sh[1];
    const d0 = Math.hypot(dx, dy) || 1e-6, d = Math.min(Math.max(d0, Math.abs(u - l) + 0.02), u + l - 0.004);
    dx *= d / d0; dy *= d / d0;
    const phi = Math.atan2(dx, dy), al = Math.acos(Math.min(1, Math.max(-1, (u * u + d * d - l * l) / (2 * u * d))));
    const a1 = phi - dirsek * al;
    let a2 = Math.atan2(dx - Math.sin(a1) * u, dy - Math.cos(a1) * u) - a1;
    while (a2 > Math.PI) a2 -= 2 * Math.PI; while (a2 < -Math.PI) a2 += 2 * Math.PI;
    p[k] = { sh: lerp(cur.sh, a1 / D2R - (p.lean || 0), w), el: lerp(cur.el, a2 / D2R, w) };
    return;
  }
  const m = (side === 'L' ? -1 : 1) * dirsek;
  let dx = (tx - p.x) / p.s - sh[0], dy = (ty - p.y) / p.s - sh[1];
  const d0 = Math.hypot(dx, dy) || 1e-6, d = Math.min(Math.max(d0, Math.abs(u - l) + 0.02), u + l - 0.004);
  dx *= d / d0; dy *= d / d0;
  const phi = Math.atan2(dx, dy), al = Math.acos(Math.min(1, Math.max(-1, (u * u + d * d - l * l) / (2 * u * d))));
  const a1 = phi - m * al;   // dirsek dışa ve aşağı
  let a2 = Math.atan2(dx - Math.sin(a1) * u, dy - Math.cos(a1) * u) - a1;
  while (a2 > Math.PI) a2 -= 2 * Math.PI; while (a2 < -Math.PI) a2 += 2 * Math.PI;
  const ms = side === 'L' ? -1 : 1;
  p[k] = { sh: lerp(cur.sh, ms * a1 / D2R, w), el: lerp(cur.el, ms * a2 / D2R, w) };
}
// Hazır el yerleri (karakterin oranına göre; reach hedefi): 'asagi' kalça yanı · 'gogus' göğüs önü · 'yan' düz yana ·
// 'yukari' başın yanında havada (kol yüze binmez; pankart, bayrak, "herkes elindekini kaldırsın")
const EL_YERI = { asagi: [0.1, 0.97], gogus: [0.12, 0.56], yan: [0.97, 0.02], yukari: [0.5, -0.84] };
export function elYeri(key, p, side, ad) {
  const c = CARDS[key], L = (c.arm.upper + c.arm.lower) * p.s, sh = shoulder(key, p, side), m = p.view === 'side' ? (p.facing || 1) : side === 'L' ? -1 : 1, q = EL_YERI[ad];
  return [sh[0] + m * q[0] * L, sh[1] + q[1] * L];
}
// Tutan el: nesne çizildikten SONRA çağrılır, eli nesnenin üstüne çizer (pt = drawChar'ın döndürdüğü handL / handR)
export const grip = (K, key, pt, s) => K.circ(pt[0], pt[1], CARDS[key].arm.hand * s, CARDS[key].skin, CARDS[key].line * s);
// Parmaklar: el noktasından yon (radyan; −π/2 = yukarı) çevresinde yelpaze. n kesirli olabilir (son parmak uzarken).
// toplam: yelpazenin kaç parmağa göre ortalanacağı (sayarken sabit tut ki parmaklar kaymasın). Eli de üstüne çizer.
export function parmaklar(K, key, [x, y], s, n, { yon = -Math.PI / 2, ac = 0.5, boy = 1, toplam = Math.ceil(n - 1e-6) } = {}) {
  const { ctx } = K, c = CARDS[key], r = c.arm.hand * s, lw = c.line * s * 0.75, w = r * 0.46, N = Math.ceil(n - 1e-6);
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < N; i++) {
    const e = ease.enter(clamp01(n - i)), a = yon + (i - (toplam - 1) / 2) * ac, len = r * (0.7 + 1.25 * boy * e);
    const p0 = [x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3], p1 = [x + Math.cos(a) * len, y + Math.sin(a) * len];
    strokeLine(ctx, p0, p1, w + lw * 2, INK); strokeLine(ctx, p0, p1, w, c.skin);
  }
  ctx.restore();
  grip(K, key, [x, y], s);
}
// İşaret parmağı: el noktasından hedefe doğru tek parmak (gösterme, dokunarak sayma, basma)
export const isaret = (K, key, el, s, hedef, boy = 1.1) => parmaklar(K, key, el, s, 1, { yon: Math.atan2(hedef[1] - el[1], hedef[0] - el[0]), boy });

// Karakteri oynat: uzanışlar (o.L / o.R = [hedef, w = 1, dirsek = 'oto']) → dudak (tl varsa ve o.sessiz değilse) → çizim.
// o.heads verilirse baş konumu oraya yazılır (altyazı kuyruğu). Dönen: { handL, handR, head, p, tut(side), parmak(side, n, o), isaret(side, hedef) }.
// tut / parmak / isaret nesne çizildikten SONRA çağrılır: el nesnenin üstünde kalır.
export function oyna(K, t, tl, key, p, o = {}) {
  for (const sd of ['L', 'R']) if (o[sd]) reach(key, p, sd, o[sd][0], o[sd][1] ?? 1, o[sd][2] ?? 'oto');
  if (tl && !o.sessiz) p.talk = talkAt(tl, key, t);
  const r = drawChar(K.ctx, key, p, t), el = sd => sd === 'L' ? r.handL : r.handR;
  if (o.heads) o.heads[key] = r.head;
  return { ...r, p, tut: sd => grip(K, key, el(sd), p.s), parmak: (sd, n, q) => parmaklar(K, key, el(sd), p.s, n, q), isaret: (sd, hedef) => isaret(K, key, el(sd), p.s, hedef) };
}

// Hazır ifadeler ve kısmi pozlar (önden görünüş; poseAt anahtarına ya da kisi()'ye doğrudan verilir)
export const IFADE = { dusun: THINK, dusun2: THINK2, zorlanma: { brow: -0.03, browTilt: 0.5, eye: 0.5, pupil: 1, curve: -0.4, open: 0.3, w: 1.1 } };
export const POZ = {
  dur: { armL: { sh: 12, el: -10 }, armR: { sh: 16, el: -30 } },                    // kollar yanda
  rahat: { armL: { sh: 14, el: -40 }, armR: { sh: 20, el: -60 } },                  // eller önde, gevşek
  dusun: { armR: { sh: 18, el: -168 } },                                            // sağ el çenede
  yukari: { armR: { sh: 165, el: -10 } },                                           // sağ el havada
  ikiEl: { armL: { sh: 165, el: -10 }, armR: { sh: 165, el: -10 } },                // iki el havada (sevinç)
  teslim: { armL: { sh: 150, el: 10 }, armR: { sh: 150, el: 10 } },                 // eller yukarıda açık (yenilgi)
  belde: { armL: { sh: 38, el: -118 } },                                            // sol el belde
  yana: { armL: { sh: 95, el: 10 } },                                               // sol kol yana (gösterir)
  ikaz: { armR: { sh: 152, el: -8 } },                                              // parmak sallar
  omuz: { armL: { sh: 24, el: 92 }, armR: { sh: 24, el: 92 }, head: { tilt: 9 } },  // omuz silkme: dirsek gövdede, avuçlar yana açık
};
// Baş sallama (onay): t0'dan başlayarak n kez, her biri d sn. Önden: head.nod (yüz aşağı kayar); yandan: baş öne eğilir.
export function onayla(p, t, t0, n = 2, d = 0.32) {
  const u = (t - t0) / d; if (u <= 0 || u >= n) return p;
  const k = Math.sin(Math.PI * (u % 1)) ** 2;
  p.head = p.view === 'side' ? { ...p.head, tilt: (p.head.tilt || 0) + 13 * k } : { ...p.head, nod: (p.head.nod || 0) + k, look: [p.head.look?.[0] || 0, (p.head.look?.[1] || 0) + 0.35 * k] };
  return p;
}
// Omuz silkme: t0'da 0,25 sn'de açılır, tut sn durur, 0,3 sn'de iner (yalnız önden görünüş)
export function omuzSilk(p, t, t0, tut = 0.5) {
  const w = ease.enter(seg(t, t0, 0.25)) * (1 - ease.state(seg(t, t0 + 0.25 + tut, 0.3)));
  if (w <= 0) return p;
  for (const k of ['armL', 'armR']) p[k] = { sh: lerp(p[k].sh, POZ.omuz[k].sh, w), el: lerp(p[k].el, POZ.omuz[k].el, w) };
  p.head = { ...p.head, tilt: (p.head.tilt || 0) + 9 * w };
  return p;
}

// Yandan oturma: kisi() gibi kurulur; kalça/diz açılarıyla oturur, eller dizlerde (el: false ile kapatılır).
// Oturağın yeri oturak(key, p) ile sorulur; sandalye/şezlong ona göre çizilir (mekan.js sandalye()).
export function otur(key, o = {}) {
  const { kalca = 84, diz = 86, el = true, ...rest } = o;
  const p = kisi(key, { view: 'side', facing: 1, lean: 3, legL: { hip: kalca - 6, knee: diz - 8 }, legR: { hip: kalca, knee: diz }, ...rest });
  if (el) for (const sd of ['L', 'R']) { const h = eklem(key, p, 'pelvis'), k = eklem(key, p, sd === 'L' ? 'kneeL' : 'kneeR'); reach(key, p, sd, [lerp(h[0], k[0], sd === 'L' ? 0.8 : 0.62), k[1] - CARDS[key].leg.w * 0.42 * p.s], 1); }
  return p;
}
// Oturma yüzeyi: { y: oturağın üst kenarı, x: kalçanın x'i, diz: dizin x'i } (dünya)
export function oturak(key, p) { const c = CARDS[key], h = eklem(key, p, 'pelvis'), k = eklem(key, p, 'kneeR'); return { y: h[1] + (c.leg.w / 2 + c.line * 0.5) * p.s, x: h[0], diz: k[0] }; }

// Yürüyüş (yan görünüş): t0'da x0'dan çıkar, x1'e varır. Adım fazı yola kilitlidir (ayak kaymaz); ilk ve son 0,3 sn
// hızlanır/yavaşlar, uçlarda adım genliği sıfıra iner (ayakta durur). geri: true → geri geri yürür (yüzü x0'a dönük).
// Dönen poz: view 'side', x, facing ayarlı + { yuruyor, u }. Elinde nesne varsa sonra reach(…, 'R', …) ile kolu al.
export function yuru(key, t, { t0, x0, x1, t1, hiz = 330, y = 1500, s = BOY[key], geri = false, poz = {} }) {
  const c = CARDS[key], D = x1 - x0, dir = Math.sign(D) || 1, dur = Math.max(0.05, (t1 ?? t0 + Math.abs(D) / hiz) - t0);
  const r = Math.min(0.3, dur / 2) / dur, u = seg(t, t0, dur);
  const g = u < r ? u * u / (2 * r) : u > 1 - r ? 1 - r - (1 - u) ** 2 / (2 * r) : u - r / 2, q = g / (1 - r);   // yamuk hız profilinin integrali
  const d = Math.abs(D) * q, cyc = 4 * (c.leg.upper + c.leg.lower) * s * Math.sin(24 * D2R);                      // bir tam döngüde (iki adım) alınan yol
  const amp = ease.state(clamp01(Math.min(d, Math.abs(D) - d) / (cyc * 0.16)));
  const ph = d / cyc * 2 * Math.PI * (geri ? -1 : 1), k = c.stance?.knee || 0;
  const leg = f => ({ hip: Math.sin(f) * 24 * amp + k * 0.5, knee: k + (Math.max(0, Math.sin(f + Math.PI * 0.55)) * 38 + 4) * amp });
  const p = kisi(key, {
    view: 'side', facing: geri ? -dir : dir, x: x0 + D * q, y, s, lean: 4 * amp * (geri ? -0.5 : 1), bob: (0.035 - Math.abs(Math.cos(ph)) * 0.035) * amp,
    legL: leg(ph), legR: leg(ph + Math.PI),
    armL: { sh: lerp(-4, -Math.sin(ph) * 20, amp), el: lerp(8, 12 + Math.max(0, -Math.sin(ph)) * 14, amp) },
    armR: { sh: lerp(6, Math.sin(ph) * 20, amp), el: lerp(10, 12 + Math.max(0, Math.sin(ph)) * 14, amp) }, ...poz,
  });
  p.yuruyor = u > 0 && u < 1; p.u = q;
  return p;
}
// Yan yan kayma (önden görünüş): p'yi x0'dan x1'e `adim` adımda kaydırır; her adımda bacak açılır, gövde hafif çöker
export function yanAdim(p, t, { t0, x0, x1, adim = 3, sure = 0.34, ara = 0.1 }) {
  let q = 0, k = 0;
  for (let i = 0; i < adim; i++) { const u = seg(t, t0 + i * (sure + ara), sure); q += ease.state(u); k = Math.max(k, Math.sin(Math.PI * u)); }
  const dir = Math.sign(x1 - x0) || 1;
  p.x = lerp(x0, x1, q / adim);
  p.legL = { ...p.legL, hip: p.legL.hip + (dir < 0 ? 9 : 3) * k, knee: (p.legL.knee || 0) + 16 * k };
  p.legR = { ...p.legR, hip: p.legR.hip + (dir > 0 ? 9 : 3) * k, knee: (p.legR.knee || 0) + 16 * k };
  return p;
}

// ═══════════════════════════ 3. Etiketler ve işaretler ═══════════════════════════
// Ekran uzayında etiket (hap): a anında yayla (320/30) gelir, b anında 0,2 sn'de çıkar; pulse: vurgu anları (%16 / 0,34 sn).
// Konum sabit verilir (okunurken oynamaz). Dönen: yarı genişlik (yanına işaret koymak için).
export function tag(K, t, a, b, [x, y], label, fill, col = PAL.paper, size = 46, pulse = []) {
  const { ctx } = K; ctx.font = `900 ${size}px Rubik`; const hw = (ctx.measureText(label).width + size * 1.2) / 2;
  if (t < a - 0.001 || t > b + 0.2) return hw;
  const v = a <= 0 ? 1 : spring(t - a, UI[0], UI[1]), out = 1 - ease.exit(seg(t, b, 0.2));
  let pu = 1; for (const p of pulse) pu += 0.16 * Math.sin(Math.PI * seg(t, p - 0.04, 0.34));
  ctx.save(); ctx.translate(x, y); ctx.scale((0.6 + 0.4 * v) * out * pu, (0.6 + 0.4 * v) * out * pu); ctx.globalAlpha = clamp01(v * 1.6) * out;
  pill(K, 0, 0, label, fill, col, size); ctx.restore();
  return hw;
}
// Yuvarlak onay / çarpı rozeti (ekran uzayı): doğru cevap yeşil ✓, olmayan deneme mercan ✗
export function mark(K, t, a, b, [x, y], ok) {
  if (t < a || t > b + 0.2) return;
  const { ctx } = K, v = spring(t - a, UI[0], UI[1]) * (1 - ease.exit(seg(t, b, 0.2)));
  ctx.save(); ctx.translate(x, y); ctx.scale(v, v); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  K.circ(0, 0, 34, ok ? PAL.green : PAL.coral, LW);
  ctx.beginPath(); if (ok) { ctx.moveTo(-15, 1); ctx.lineTo(-4, 13); ctx.lineTo(16, -11); } else { ctx.moveTo(-12, -12); ctx.lineTo(12, 12); ctx.moveTo(12, -12); ctx.lineTo(-12, 12); }
  ctx.lineWidth = 9; ctx.strokeStyle = PAL.paper; ctx.stroke(); ctx.restore();
}
// Nokta işareti (dünya uzayı): a anında genişleyen halka + kalıcı nokta
export function ring(K, [x, y], t, a, col = PAL.mustard) {
  if (t < a) return; const { ctx } = K, u = seg(t, a, 0.55);
  if (u < 1) { ctx.save(); ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(x, y, 16 + 54 * ease.enter(u), 0, Math.PI * 2); ctx.lineWidth = 10; ctx.strokeStyle = col; ctx.stroke(); ctx.restore(); }
  K.circ(x, y, 15 * Math.min(1, spring(t - a, UI[0], UI[1])), col, LW * 0.7);
}
// Ölçü çizgisi (dünya uzayı): p → q, uçlarında çentik; v = çizilen oran (0..1)
export function dimLine(K, p, q, v, col, w = 8) {
  if (v <= 0) return; const { ctx } = K, e = along([p, q], v), n = unit(p, q), o = [-n[1] * 17, n[0] * 17];
  ctx.save(); ctx.lineCap = 'round';
  for (const [lw, c] of [[w + 8, INK], [w, col]]) { strokeLine(ctx, p, e, lw, c); for (const z of [p, e]) strokeLine(ctx, [z[0] - o[0], z[1] - o[1]], [z[0] + o[0], z[1] + o[1]], lw, c); }
  ctx.restore();
}
// Adım adım değişen tek etiket (025'in "90 → 180 → 270 → 290 ?" sayacı): adimlar = [[t, metin, dolgu?, yazı?]]; yeri sabit
export function adimEtiket(K, t, adimlar, b, pos, size = 60) {
  let cur = null; for (const s of adimlar) if (t >= s[0] - 0.04) cur = s;
  if (!cur) return 0;
  return tag(K, t, adimlar[0][0] - 0.04, b, pos, cur[1], cur[2] ?? INK, cur[3] ?? PAL.paper, size, adimlar.slice(1).map(s => s[0]));
}
// Zaman hapı (48 px; yalnız geri dönüş ve zaman atlamasında): solunda küçük saat, koyu zemin. a..b arası ≥ 1,25 sn.
export function zamanHapi(K, t, a, b, label, { x = 540, y = 600, size = 48, saat = 10.15 } = {}) {
  if (t < a - 0.001 || t > b + 0.2) return;
  const { ctx } = K, v = spring(t - a, UI[0], UI[1]), out = 1 - ease.exit(seg(t, b, 0.2)), k = (0.6 + 0.4 * v) * out;
  ctx.font = `900 ${size}px Rubik`; const tw = ctx.measureText(label).width, r = size * 0.56, w = tw + r * 2 + size * 1.5, h = size * 1.9;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = clamp01(v * 1.6) * out;
  K.rect(-w / 2 + 7, -h / 2 + 9, w, h, INK, 0, h / 2); K.rect(-w / 2, -h / 2, w, h, PAL.cream, LW, h / 2);
  const cx = -w / 2 + size * 0.5 + r, am = (saat % 1) * Math.PI * 2, ah = (saat % 12) / 12 * Math.PI * 2;
  K.circ(cx, 0, r, PAL.mustard, LW * 0.8); K.line(cx, 0, cx + Math.sin(ah) * r * 0.5, -Math.cos(ah) * r * 0.5, 6); K.line(cx, 0, cx + Math.sin(am) * r * 0.74, -Math.cos(am) * r * 0.74, 5);
  K.text(label, cx + r + size * 0.32 + tw / 2, size * 0.35, size, INK, 900);
  ctx.restore();
}
// Güvenli alan kılavuzu (yalnız stil karesi alırken): x 90–920, y 280–1420
export function guvenliAlan(K) { const { ctx } = K; ctx.save(); ctx.setLineDash([18, 12]); ctx.lineWidth = 4; ctx.strokeStyle = '#FF3B6B'; ctx.strokeRect(90, 280, 830, 1140); ctx.restore(); }

// ═══════════════════════════ 4. Altyazı, "Buldum!", bölüm çerçevesi ═══════════════════════════
// Altyazı balonu: sahne.js captionAt + elle bölme (split = { replikKimliği: ikinci parçanın ilk kelime dizini }) +
// kadraj dışındaki konuşana doğru yatan kuyruk + 56 harften uzunsa 44 px. kuyruksuz: geri dönüşte anlatıcı sesi.
export function altyazi(K, tl, t, cam, heads = {}, { split = {}, y = 1255, kuyruksuz = false } = {}) {
  let cap = captionAt(tl, t);
  const cut = cap && split[cap.line.id];   // ikinci parça kendi ilk kelimesinin ölçülmüş anında gelir
  if (cut) {
    const w = cap.line.words, tx = cap.line.text.split(' '), tc = w[cut].t0 - 0.04;
    cap = t < tc ? { ...cap, text: tx.slice(0, cut).join(' ') + '…', left: tc - t } : { ...cap, text: '…' + tx.slice(cut).join(' '), age: t - tc };
  }
  let hd = cap && heads[cap.line.who] && toScreen(cam, heads[cap.line.who]);
  if (hd) hd = hd[1] < -200 || hd[1] > 1250 ? null : [Math.min(1300, Math.max(-220, hd[0])), hd[1]];   // konuşan kadraj dışındaysa kuyruk ona doğru yatar
  if (kuyruksuz) hd = null;
  caption(K, cap, { y, head: hd, ...(cap && (cap.text ?? cap.line.text).length > 56 ? { size: 44, maxW: 860 } : {}) });
  return cap;
}
// "Buldum!": 64 px sıçrama (0,46 sn) ve baş çevresinde 9 hardal ışın (0,55 sn). t0 = d3'ün başı.
export const buldumHop = (t, t0, h = 64) => h * Math.sin(Math.PI * seg(t, t0 - 0.03, 0.46));
export function buldumIsin(K, t, t0, [cx0, cy0], { son = t0 + 0.7, k = 1 } = {}) {   // [cx0, cy0] = başın merkezi (dünya); k = ölçek (s / 245)
  if (t < t0 - 0.05 || t >= son) return;
  const { ctx } = K, u = seg(t, t0 - 0.03, 0.55), r0 = k * (175 + 40 * ease.enter(u)), r1 = r0 + k * 58 * Math.sin(Math.PI * Math.min(1, u * 1.15));
  ctx.save(); ctx.globalAlpha = 1 - ease.exit(seg(t, t0 + 0.3, 0.3)); ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.94 + i * Math.PI * 0.88 / 8; K.line(cx0 + Math.cos(a) * r0, cy0 + Math.sin(a) * r0, cx0 + Math.cos(a) * r1, cy0 + Math.sin(a) * r1, 11 * k, PAL.mustard); }
  ctx.restore();
}

// Bölüm çerçevesi: takip kartı → kamera → dünya → bilmece kartı → ekran etiketleri → sayaç → altyazı (sıra sabit).
//   S = build()'in döndürdüğü: { tm: { cd, end, proof? … }, film: sahneler(…) | cam: [kamera anahtarları] }
//   h = { dunya(K, t, B), ekran?(K, t, B), kartSon? = tm.proof (kartın kalktığı an), kartBoy? = 54, split?, drift? = 0.009,
//         kamera?(cam, t, B) (kapalı formüllü ek kamera düzeltmesi), kuyruksuz?(t, B) → bool, kilavuz? }
//   B = { cam, heads (dunya doldurur: heads.defne = baş noktası), sc (o anki sahne; film varsa), ekr(p) dünya → ekran, kart (bool), top }
export function cerceve(K, t, ep, tl, S, h) {
  const { ctx } = K, { tm } = S;
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  const cam = S.film ? S.film.cam(t, h.drift ?? 0.009) : camAt(S.cam, t, h.drift ?? 0.009), heads = {};
  const B = { cam, heads, sc: S.film ? S.film.at(t) : null, ekr: p => toScreen(cam, p), kart: t < (h.kartSon ?? tm.proof ?? 1e9), top: 300 };
  h.kamera?.(cam, t, B);
  ctx.save(); applyCam(ctx, cam);
  h.dunya(K, t, B);
  ctx.restore();
  if (B.kart) B.top = 300 + riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: h.kartBoy ?? 54 });
  h.ekran?.(K, t, B);
  if (B.kart) countdown(K, t, tm.cd, { top: B.top + 20, share: ep.cdShare });
  altyazi(K, tl, t, cam, heads, { split: h.split, kuyruksuz: h.kuyruksuz ? h.kuyruksuz(t, B) : false });
  if (h.kilavuz) guvenliAlan(K);
}

// ═══════════════════════════ 5. Sahne listesi, kesme, kamera ═══════════════════════════
// Sahne listesi: her sahne { id, t0, cam: [[t, zoom, cx, cy, _, [k, c]?], …], kesme?: false, kay?: [dx, dy], kisa?: true, … }.
//   · Sahnenin ilk kamera anahtarı t0'a çekilir ve SERT KESME olur. kesme: false → kesmesiz geçiş (yürüyüş, kamera kayması).
//   · kay: sahne boyunca doğrusal kamera kayması (px; geri dönüşe girerken [−60, 0], çıkarken [60, 0]).
//   · Diğer alanlar (mekan, isik, geri, hap…) bölümün kendi kullanımı içindir; at(t) aynen geri verir.
// Dönen: { list, keys, kesmeler, at(t) → { …sahne, lt (sahne içi süre), kalan, taze (kesmeden sonraki ilk 6 kare) }, cam(t, drift), kontrol(), uyar() }
export function sahneler(list) {
  const L = list.map((s, i) => ({ ...s, i, t1: s.t1 ?? list[i + 1]?.t0 ?? 1e9 })), keys = [];
  for (const s of L) (s.cam || []).forEach((k, j) => { const key = [...k]; if (j === 0) { key[0] = s.t0; key[4] = s.kesme === false && s.i > 0 ? undefined : 'cut'; } keys.push(key); });
  const sAt = t => { let c = L[0]; for (const s of L) if (t >= s.t0) c = s; return { ...c, lt: t - c.t0, kalan: c.t1 - t, taze: t - c.t0 < 0.2 }; };
  const cam = (t, drift = 0.009) => {
    const c = camAt(keys, t, drift), s = sAt(t);
    if (s.kay) { const u = seg(t, s.t0, Math.min(s.t1 - s.t0, 8)) - 0.5; c.cx += s.kay[0] * u; c.cy += (s.kay[1] || 0) * u; }
    return c;
  };
  const kesmeler = L.filter(s => s.i > 0 && s.kesme !== false).map(s => s.t0);
  // Rehber § 4 sayıları. Uyarı listesi döner (boşsa temiz). Son sahne takip kartıysa (id 'son') sayıma girmez.
  const kontrol = () => {
    const w = [], cuts = L.filter(s => s.i > 0 && s.kesme !== false && s.id !== 'son');
    if (cuts.length < 3 || cuts.length > 8) w.push(`sert kesme sayısı ${cuts.length} (3–8 olmalı)`);
    cuts.forEach((s, i) => { const d = s.t0 - (i ? cuts[i - 1].t0 : 0); if (d < (s.kisa || cuts[i - 1]?.kisa ? 0.8 : 1.2) - 1e-6) w.push(`${s.id}: önceki kesmeden ${d.toFixed(2)} sn sonra (≥ 1,2; kısa plan ≥ 0,8)`); });
    for (const k of keys) if (k[1] < 0.94 - 1e-9 || k[1] > 1.46 + 1e-9) w.push(`zoom ${k[1]} @${k[0].toFixed(2)} (0,94–1,46)`);
    for (let i = 1; i < keys.length; i++) if (keys[i][0] < keys[i - 1][0]) w.push(`kamera anahtarı sıra dışı @${keys[i][0].toFixed(2)} (sahnenin anahtarları sonraki sahnenin t0'ından önce bitmeli)`);
    const ilk = keys.find((k, i) => i > 0 && (k[1] !== keys[0][1] || k[2] !== keys[0][2] || k[3] !== keys[0][3]));
    if (!ilk || ilk[0] > 8) w.push(`ilk kadraj değişimi ${ilk ? ilk[0].toFixed(1) : '—'} sn (≤ 8)`);
    for (let i = 1; i < keys.length; i++) if (keys[i][0] - keys[i - 1][0] > 7.5) w.push(`@${keys[i - 1][0].toFixed(1)}–${keys[i][0].toFixed(1)}: ${(keys[i][0] - keys[i - 1][0]).toFixed(1)} sn aynı hedef (kayma tavanı 7 sn; ara hedef ekle)`);
    return w;
  };
  const uyar = () => { for (const s of kontrol()) console.error('sahne uyarısı: ' + s); };   // build() sonunda çağır: still.mjs "konsol:" diye basar
  return { list: L, keys, kesmeler, at: sAt, cam, kontrol, uyar };
}
// İki kamera arasında karışım (zoom logaritmik): kapalı formüllü takip için. kamKaris(cam, { zoom, cx, cy }, w)
export const kamKaris = (a, b, u) => ({ zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom ?? a.zoom), u)), cx: lerp(a.cx, b.cx ?? a.cx, u), cy: lerp(a.cy, b.cy ?? a.cy, u) });
// Nesne taşıma kesmesi: A kamerasında pA'da duran nesne, kesmeden sonra pB'de dururken ekranda AYNI yerde kalsın.
// Dönen [zoom, cx, cy] yeni sahnenin ilk kamera anahtarına yazılır. esFark: kesmenin iki yanındaki ekran farkı (px; ≤ 40 olmalı).
export function esle(camA, pA, pB, zoomB = camA.zoom) { const s = toScreen(camA, pA); return [zoomB, pB[0] - (s[0] - 540) / zoomB, pB[1] - (s[1] - 960) / zoomB]; }
export function esFark(camA, pA, camB, pB) { const a = toScreen(camA, pA), b = toScreen(camB, pB); return [b[0] - a[0], b[1] - a[1]]; }
// Yön eşleme (vektör kuralı; baskın yön soldan sağa): nesne tKes anında ekranın sağ kenarından v px/sn (ekran hızı) ile
// çıkar, yeni sahneye sol kenardan aynı hızla girer. Dönen: nesnenin dünya x'i. yari = nesnenin yarı genişliği (dünya px).
export const cikis = (cam, t, tKes, v, yari = 0) => cam.cx + (540 + v * (t - tKes)) / cam.zoom + yari;   // tKes'te arka ucu sağ kenarda
export const giris = (cam, t, tKes, v, yari = 0) => cam.cx + (-540 + v * (t - tKes)) / cam.zoom - yari;  // tKes'te ön ucu sol kenarda

// ═══════════════════════════ 6. Zaman: atlama ve geri dönüş ═══════════════════════════
// Zaman atlaması kesme değildir: kadraj sabit, tek u (0..1) saat ibresini, ışığı (mekan.js isikYolu), gökyüzü yayını ve
// nesnenin durumunu (erime, büyüme) birlikte sürer. atlama(t, t0, d) → u (1,2–2,2 sn)
export const atlama = (t, t0, d) => ease.state(seg(t, t0, d));
// Saat sarma: ondalık saat (19.5 = 19:30) h0 → h1; geri sarma için h1 < h0. Dönen ondalık saat (mekan.js duvarSaati'ne verilir).
export const saatSar = (h0, h1, u) => lerp(h0, h1, u);
// Geri dönüş: tGir'de sert kesmeyle geçmişe girilir, tCik'ta sert kesmeyle dönülür. sar (0..1) kesmeden önceki 0,4 sn'lik
// geri sarmadır: duvar saati saatSar(simdi, simdi − 2, sar) ile sarılır ya da saatRozet çizilir.
export function geriDonus(t, tGir, tCik = 1e9) { return { sar: ease.state(seg(t, tGir - 0.4, 0.4)), icinde: t >= tGir && t < tCik, lt: t - tGir, kalan: tCik - t }; }
// Saat rozeti (ekran uzayı): mekânda duvar saati yoksa. tKes'ten 0,4 sn önce belirir, ibreler `tur` tur sarar
// (yon = −1 geri, +1 ileri), kesme karesinde kaybolur.
export function saatRozet(K, t, tKes, { x = 540, y = 660, r = 88, saat = 10.15, tur = 1.5, yon = -1 } = {}) {
  if (t < tKes - 0.52 || t >= tKes) return;
  const { ctx } = K, v = spring(t - (tKes - 0.52), UI[0], UI[1]), h = saat + yon * tur * ease.state(seg(t, tKes - 0.4, 0.4));
  const am = (h % 1) * Math.PI * 2, ah = (((h % 12) + 12) % 12) / 12 * Math.PI * 2;
  ctx.save(); ctx.translate(x, y); ctx.scale(0.6 + 0.4 * v, 0.6 + 0.4 * v); ctx.globalAlpha = clamp01(v * 1.6);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.cream, LW);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; K.line(Math.sin(a) * r * 0.78, -Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.9, -Math.cos(a) * r * 0.9, 5); }
  K.line(0, 0, Math.sin(ah) * r * 0.5, -Math.cos(ah) * r * 0.5, 11); K.line(0, 0, Math.sin(am) * r * 0.74, -Math.cos(am) * r * 0.74, 8, PAL.coral);
  K.circ(0, 0, 9, INK, 0);
  ctx.beginPath(); ctx.arc(0, 0, r + 26, yon < 0 ? -2.2 : -0.9, yon < 0 ? -0.9 : -2.2, yon < 0); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();   // sarma oku
  const ea = yon < 0 ? -2.2 : -0.9, ex = Math.cos(ea) * (r + 26), ey = Math.sin(ea) * (r + 26), tx = -Math.sin(ea) * yon, ty = Math.cos(ea) * yon;
  K.poly([[ex + tx * 22, ey + ty * 22], [ex - ty * 15, ey + tx * 15], [ex + ty * 15, ey - tx * 15]], INK, 0);
  ctx.restore();
}
// Geçmiş tonu (ekran uzayı, düz renk): rehber § 4 "çerçeve ve filtre yok" der; varsayılan KAPALI. Aynı ışıkta geçen
// geri dönüşte (022, 025) geçmişi ayırmak gerekirse en çok 0.12 ile altyazıdan ÖNCE çağrılır.
export function gecmisTonu(K, a = 0.1, renk = '#E8C9A0') { if (a <= 0) return; const { ctx } = K; ctx.save(); ctx.globalAlpha = Math.min(a, 0.14); ctx.fillStyle = renk; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }

// ═══════════════════════════ 7. Madde: sıvı, alev, duman, erime, büyüme, ışık ═══════════════════════════
// Sıvı: kabın İÇ hattı yol(ctx) ile verilir (beginPath'i sivi açar), kutu = [x, y, w, h] iç sınır kutusu. Kabın kendi
// dönüşümü (translate/rotate) içinde çağrılır; kap çizgisi sividen SONRA çizilir.
//   o = { seviye: 0..1, renk, egim: kabın dönüş açısı (rad; yüzey dünyada yatay kalır), yuzey: yüzey çizgisi (true),
//         bulut: { renk, u: 0..1, p: [fx, fy] kaynağın kutu içindeki oranı, tohum, guc: 1 } → renk kaynaktan yayılıp sıvıya karışır }
export function sivi(K, yol, [x, y, w, h], { seviye = 0.5, renk = '#CFE3DD', egim = 0, yuzey = true, bulut = null } = {}) {
  if (seviye <= 0.005) return;
  const { ctx } = K, cx = x + w / 2, ys = y + h * (1 - seviye), hx = Math.cos(egim), hy = -Math.sin(egim), dxn = Math.sin(egim), dyn = Math.cos(egim), R = (w + h) * 2;
  const u = bulut ? clamp01(bulut.u) : 0, base = bulut ? mixHex(renk, bulut.renk, ease.state(u) * 0.62 * (bulut.guc ?? 1)) : renk;
  ctx.save(); ctx.beginPath(); yol(ctx); ctx.clip();
  ctx.beginPath(); ctx.moveTo(cx - hx * R, ys - hy * R); ctx.lineTo(cx + hx * R, ys + hy * R); ctx.lineTo(cx + hx * R + dxn * R, ys + hy * R + dyn * R); ctx.lineTo(cx - hx * R + dxn * R, ys - hy * R + dyn * R); ctx.closePath();
  ctx.fillStyle = base; ctx.fill();
  if (bulut && u > 0 && u < 1) {   // yayılan bulut: tohumlu lekeler kaynaktan dışarı açılır, sonra tek renge erir
    ctx.clip();
    const rnd = mulberry32(bulut.tohum ?? 7), sx = x + w * (bulut.p?.[0] ?? 0.5), sy = y + h * (bulut.p?.[1] ?? 0.5), e = ease.enter(u);
    ctx.globalAlpha = Math.min(1, 1.5 * (1 - u)); ctx.fillStyle = bulut.renk;
    for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, rr = rnd(), d = (0.15 + 0.85 * rr) * Math.max(w, h) * 0.55 * e; ctx.beginPath(); ctx.ellipse(sx + Math.cos(a) * d, sy + Math.sin(a) * d * 0.8 + h * 0.12 * e, w * (0.1 + 0.2 * e) * (0.6 + rnd()), w * (0.08 + 0.15 * e) * (0.6 + rnd()), 0, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
  if (yuzey) { ctx.save(); ctx.beginPath(); yol(ctx); ctx.clip(); strokeLine(ctx, [cx - hx * R, ys - hy * R], [cx + hx * R, ys + hy * R], 5, mixHex(base, '#FFFFFF', 0.45)); ctx.restore(); }
}
// Akan sıvı: a (ağız) → b (hedef) arasında yerçekimiyle bükülen şerit; u0..u1 çizilen aralık (başlarken 0→1, biterken uçtan çekilir)
export function akis(K, a, b, w, renk, u0 = 0, u1 = 1) {
  if (u1 - u0 <= 0.01) return; const { ctx } = K, pt = u => [lerp(a[0], b[0], Math.sqrt(u) * 0.9 + u * 0.1), lerp(a[1], b[1], u * u * 0.7 + u * 0.3)];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, c] of [[w + LW * 1.6, INK], [w, renk]]) { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const p = pt(lerp(u0, u1, i / 12)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.lineWidth = lw; ctx.strokeStyle = c; ctx.stroke(); }
  ctx.restore();
}
// Damla (şerbet, musluk, buğu): r yarıçaplı gözyaşı biçimi, ucu yukarı
export function damla(K, x, y, r, renk = '#BFE0E0') { const { ctx } = K; ctx.beginPath(); ctx.moveTo(x, y - r * 1.7); ctx.bezierCurveTo(x + r * 0.2, y - r * 0.9, x + r, y - r * 0.3, x + r, y + r * 0.15); ctx.arc(x, y + r * 0.15, r, 0, Math.PI); ctx.bezierCurveTo(x - r, y - r * 0.3, x - r * 0.2, y - r * 0.9, x, y - r * 1.7); K.fs(renk, Math.max(2.5, r * 0.32)); }
// Damlayan musluk döngüsü: (x, y0)'dan y1'e `periyot` sn'de bir damla düşer; dönen değer 0..1 (çarpma anı = 1'e yakın)
export function damlaDongu(K, x, y0, y1, t, { periyot = 1.3, r = 7, renk = '#BFE0E0', faz = 0 } = {}) {
  const u = ((t / periyot + faz) % 1 + 1) % 1, g = clamp01((u - 0.45) / 0.4);   // önce uçta büyür, sonra ivmeyle düşer
  if (u < 0.85) damla(K, x, lerp(y0, y1, g * g), r * Math.min(1, u / 0.4), renk);
  return u;
}
// Alev: (x, y) fitilin ucu. k ölçek, i tohum (her mum başka titrer), yat: −1..1 rüzgârda yatma, guc: 0..1 (0 = sönük)
export function alev(K, x, y, k, t, { i = 0, yat = 0, guc = 1 } = {}) {
  if (guc <= 0.03) return;
  const { ctx } = K, f = 1 + 0.08 * Math.sin(t * 13 + i * 1.7) + 0.05 * Math.sin(t * 7.3 + i), sw = 2.2 * Math.sin(t * 9.1 + i * 2.3) + yat * 20, s = k * (0.35 + 0.65 * guc);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-13, 4, -13, -12 * f, sw, -38 * f); ctx.bezierCurveTo(13, -12 * f, 13, 4, 0, 6); K.fs('#F6C445', LW * 0.6 / s);
  ctx.beginPath(); ctx.ellipse(sw * 0.25, -5, 4.5, 8 * f, 0, 0, Math.PI * 2); ctx.fillStyle = '#FFF4C8'; ctx.fill();
  ctx.restore();
}
// Duman teli: t0'da (x, y)'den çıkar, sure içinde yükselip incelerek kaybolur (sönen mum, çarpma tozu değil). yat: rüzgâr
export function duman(K, x, y, t, t0, { sure = 1.3, k = 1, renk = '#D8D2C6', yat = 0, i = 0 } = {}) {
  const u = (t - t0) / sure; if (u <= 0 || u >= 1) return;
  const { ctx } = K, H = 150 * k * ease.enter(u), n = 14;
  ctx.save(); ctx.globalAlpha = 0.85 * (1 - u) ** 1.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let j = 0; j <= n; j++) { const v = j / n, yy = y - H * v - 40 * k * u, xx = x + (Math.sin(v * 5.2 + u * 6 + i) * 11 * v + yat * 60 * v * v) * k; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
  ctx.lineWidth = (7 - 3 * u) * k; ctx.strokeStyle = renk; ctx.stroke(); ctx.restore();
}
// Buhar döngüsü (çay, yemek, poşet): n kıvrımlı tel sürekli yükselir. Sahnenin iki döngüsünden biri olabilir.
export function buhar(K, x, y, t, { k = 1, n = 2, renk = PAL.cream, periyot = 1.9, ara = 26, boy = 110 } = {}) {
  const { ctx } = K; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let j = 0; j < n; j++) {
    const u = ((t / periyot + j / n) % 1 + 1) % 1, x0 = x + (j - (n - 1) / 2) * ara * k, y0 = y - boy * k * u;
    ctx.globalAlpha = 0.8 * Math.sin(Math.PI * u) ** 0.8; ctx.beginPath();
    for (let q = 0; q <= 12; q++) { const v = q / 12, yy = y0 - 74 * k * v, xx = x0 + Math.sin(v * 5.6 + u * 4 + j * 2) * 11 * k; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.lineWidth = 7 * k; ctx.strokeStyle = renk; ctx.stroke();
  }
  ctx.restore();
}
// Puf döngüsü (egzoz, toz): yuvarlak pufçuklar yon açısıyla uzaklaşıp büyür ve kaybolur. hiz ile sıklaşır.
export function puf(K, x, y, t, { k = 1, n = 3, renk = '#D8D2C6', periyot = 0.9, yon = Math.PI, yol = 110, kalk = 46 } = {}) {
  const { ctx } = K; ctx.save();
  for (let j = 0; j < n; j++) {
    const u = ((t / periyot + j / n) % 1 + 1) % 1, e = ease.enter(u);
    ctx.globalAlpha = 0.9 * (1 - u); K.circ(x + Math.cos(yon) * yol * k * e, y + Math.sin(yon) * yol * k * e - kalk * k * u * u, (9 + 20 * e) * k, renk, LW * 0.55);
  }
  ctx.restore();
}
// Erime eğrileri: u 0..1 → { boy: kalan yükseklik oranı, en: kalan genişlik oranı, gol: gölün büyüklüğü 0..1 }
export const erime = u => ({ boy: 1 - ease.state(clamp01(u)), en: 1 - 0.35 * clamp01(u) ** 2, gol: clamp01(u * 1.35) ** 0.6 });
// Eriyen blok (buz, tereyağı…): tabanı (x, y)'de, w × h; u ile çöker ve yuvarlanır, dibinde göl büyür (gol: false → göl yok, sıvının içinde)
export function eriyen(K, x, y, w, h, u, { renk = '#DCEBEA', golRenk = renk, cizgi = '#F7FBFA', gol = true } = {}) {
  const e = erime(u), ww = w * e.en, hh = h * e.boy;
  if (gol && e.gol > 0.04) K.ell(x, y + 2, w * 0.75 * e.gol, w * 0.2 * e.gol, golRenk, LW * 0.5);
  if (hh < 12) return;
  K.rect(x - ww / 2, y - hh, ww, hh, renk, LW * 0.7, Math.min(ww, hh) * (0.18 + 0.3 * clamp01(u)));
  if (hh > 26) K.line(x - ww * 0.26, y - hh * 0.72, x - ww * 0.26, y - hh * 0.36, Math.max(3, ww * 0.07), cizgi);
}
// Mum (023 pasta, 027 tek mum): tabanı (x, y). o = { h: kalan boy 0..1, on: yanıyor mu, t, i: tohum/renk sırası,
// duman: sönme anı (yoksa duman yok), yat: rüzgâr, renk }. Eridikçe dibinde kendi renginde göl büyür.
const MUM_RENK = [PAL.coral, PAL.teal, PAL.mustard];
export function mum(K, x, y, k, { h = 1, on = true, t = 0, i = 0, duman: td = null, yat = 0, guc = 1, renk = MUM_RENK[i % 3], gol = true } = {}) {
  const { ctx } = K, H = 70 * k * h, w = 14 * k, pool = clamp01((1 - h) * 1.35) ** 0.6;
  if (gol && pool > 0.05) K.ell(x, y + 2 * k, 19 * k * pool, 6 * k * pool, renk, LW * 0.45);
  if (h > 0.03) {
    K.rect(x - w / 2, y - H, w, H, '#FBF6EC', LW * 0.6, 3);
    ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - H, w, H); ctx.clip();
    for (let s = 0; s < 6; s++) K.line(x - w / 2, y - H + s * 14 * k, x + w / 2, y - H + s * 14 * k - 8 * k, 4 * k, renk);
    ctx.restore();
    K.line(x, y - H, x, y - H - 9 * k, 3, INK);
  }
  const top = [x, y - H - 10 * k];
  if (on && h > 0.03) alev(K, top[0], top[1], k * 0.9, t, { i, yat, guc });
  if (td !== null) duman(K, top[0], top[1], t, td, { k: k * 0.8, yat: yat * 0.5, i });
  return top;
}
// Büyüme: tek u ile n parçanın sırayla açılması. i. parça kendi payında ease.enter ile 0 → 1 (yaprak, tomurcuk, meyve)
export const buyume = (u, i = 0, n = 1, pay = 0.45) => ease.enter(seg(u, n > 1 ? (i / (n - 1)) * (1 - pay) : 0, pay));
// Yaprak: (x, y) sapın dibi, L boy, a açı (rad; 0 = yukarı), k = büyüme 0..1
export function yaprak(K, x, y, L, a, renk = PAL.green, k = 1) {
  if (k <= 0.02) return; const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-L * 0.34, -L * 0.6, 0, -L); ctx.quadraticCurveTo(L * 0.34, -L * 0.6, 0, 0); K.fs(renk, LW * 0.8 / Math.max(0.3, k));
  K.line(0, -L * 0.12, 0, -L * 0.78, 3 / Math.max(0.3, k), '#3F6E35'); ctx.restore();
}
// Işık şeridi: düz renkli çokgen (parlama/gradyan yok). pts dünya noktaları. Karanlık sahnede karart()'tan SONRA çizilir.
export function isikSeridi(K, pts, { renk = '#F3E3B0', a = 0.5 } = {}) { const { ctx } = K; ctx.save(); ctx.globalAlpha = a; K.poly(pts, renk, 0); ctx.restore(); }
// Açıklıktan (kapı, buzdolabı) zemine düşen ışık: ağız [x0, x1] zemin çizgisinde; ışık izleyiciye doğru `uz` px uzar,
// `kay` px yana kayar, `ac` oranında genişler. Dönen çokgen isikSeridi'ne verilir.
export const zeminIsigi = (x0, x1, zemin, { uz = 420, kay = 0, ac = 0.5 } = {}) => [[x0, zemin], [x1, zemin], [x1 + kay + (x1 - x0) * ac, zemin + uz], [x0 + kay - (x1 - x0) * ac, zemin + uz]];
// Karartma (dünya uzayı, kamera içinde): gece/ışık kapalı sahnede dünyanın üstüne düz koyu petrol. a ≈ isik.k
export function karart(K, a, renk = '#10292B') { if (a <= 0) return; const { ctx } = K; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = renk; ctx.fillRect(-6000, -4000, 16000, 12000); ctx.restore(); }
// Lekeleme: fn(K2) ile çizilen şeyi `renk`e boyar (a = 1 düz siluet; a < 1 önce normal çizer, üstüne a kadar koyulaştırır).
// fn MUTLAKA kendisine verilen K2'yi (ve K2.ctx'i) kullanır. Siluet (020 dün gece) ve karanlıkta kalan karakter (023) için.
let _off = null;
export function lekele(K, fn, renk = '#12282A', a = 1) {
  const { ctx } = K, cv = ctx.canvas;
  if (a < 1) fn(K);
  if (a <= 0) return;
  if (!_off || _off.width !== cv.width || _off.height !== cv.height) { _off = document.createElement('canvas'); _off.width = cv.width; _off.height = cv.height; }
  const o = _off.getContext('2d');
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1; o.clearRect(0, 0, cv.width, cv.height);
  o.save(); o.setTransform(ctx.getTransform()); fn(kit(o)); o.restore();
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-in'; o.globalAlpha = 1; o.fillStyle = renk; o.fillRect(0, 0, cv.width, cv.height);
  o.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(_off, 0, 0); ctx.restore();
}

// ═══════════════════════════ 8. Etkileşim: verme, kaldırma, pankart, sayma ═══════════════════════════
// Elden ele verme. A: verenin nesneyi tuttuğu yer, B: alanın tutacağı yer (dünya). t0'da veren uzatır; alan eli
// buluşma noktasına nesneyle aynı anda varır; iki el `ortak` sn (≥ 4 kare) birlikte durur; sonra veren bırakır, alan çeker.
// Dönen: { p: nesnenin yeri, verW / alW: reach ağırlıkları, ortak: iki el nesnede mi, tK (kavrama), tB (bırakma), tS (bitiş) }
export function elVer(t, t0, A, B, { bulus = null, uzat = 0.32, ortak = 0.17, cek = 0.4, kaldir = 24 } = {}) {
  const M = bulus || [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - kaldir], tK = t0 + uzat, tB = tK + ortak, tS = tB + cek;
  const p = t < tB ? yay(A, M, ease.state(seg(t, t0, uzat))) : yay(M, B, ease.enter(seg(t, tB, cek)));
  return { p, M, verW: 1 - ease.state(seg(t, tB, 0.25)), alW: ease.state(seg(t, tK - 0.28, 0.28)), ortak: t >= tK && t < tB, tK, tB, tS };
}
// Kaldırma–indirme (pankart, eldeki para, bayrak): araliklar = [[kalkış, iniş], …] (iniş yoksa havada kalır) → 0..1
export function kaldir(t, araliklar, { cik = 0.36, inis = 0.26 } = {}) {
  let v = 0; for (const [a, b = 1e9] of araliklar) v = Math.max(v, ease.enter(seg(t, a, cik)) * (1 - ease.exit(seg(t, b, inis))));
  return v;
}
// Saplı pankart: (x, y) = sapın tutulduğu nokta (el). Levha sapın tepesinde; rot (rad) el çevresinde döner.
// o = { satir: ['Ben', 'yemedim'], w, h, sap: elden levhanın altına, boy: yazı (≥ 50), durum: 1 doğru (yeşil kenar + ✓) · 0 nötr · −1 yanlış (gri) }
// Dönen: { merkez, ust } (dünya; etiket ya da kamera hedefi için)
export function pankart(K, [x, y], { satir = [], w = 320, h = 160, sap = 150, boy = 50, durum = 0, rot = 0 } = {}) {
  const { ctx } = K, ok = clamp01(durum), no = clamp01(-durum), cy = -sap - h / 2;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  K.rect(-9, -sap - 6, 18, sap + 70, PAL.woodDark, LW * 0.8, 6);
  K.rect(-w / 2 + 7, cy - h / 2 + 9, w, h, INK, 0, 16);
  K.rect(-w / 2, cy - h / 2, w, h, mixHex(PAL.cream, '#B9B4A8', no), LW, 16);
  if (ok > 0.02) { ctx.save(); ctx.globalAlpha = ok; ctx.beginPath(); ctx.roundRect(-w / 2 + 9, cy - h / 2 + 9, w - 18, h - 18, 9); ctx.lineWidth = 11; ctx.strokeStyle = PAL.green; ctx.stroke(); ctx.restore(); }
  const lh = boy * 1.12, y0 = cy - (satir.length - 1) * lh / 2 + boy * 0.36;
  satir.forEach((s, i) => K.text(s, 0, y0 + i * lh, boy, mixHex(INK, '#6B6355', no), 900));
  if (ok > 0.02) { ctx.save(); ctx.translate(w / 2 - 6, cy - h / 2 + 6); ctx.scale(ok, ok); K.circ(0, 0, 30, PAL.green, LW); ctx.beginPath(); ctx.moveTo(-13, 1); ctx.lineTo(-4, 11); ctx.lineTo(14, -10); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = PAL.paper; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  const c = Math.cos(rot), s = Math.sin(rot);
  return { merkez: [x - s * cy, y + c * cy], ust: [x - s * (cy - h / 2), y + c * (cy - h / 2)] };
}
// Dokunarak sayma: duraklar = [[t, [x, y]], …] (dünya). El her durağa kendi anında varır (yay çizerek), orada bekler.
// Dönen nokta reach'e hedef olarak verilir; parmak ucu için isaret() kullanılır.
export function dokunYolu(t, duraklar, { yuksel = 46, sure = 0.2 } = {}) {
  let p = duraklar[0][1];
  for (let i = 1; i < duraklar.length; i++) { const u = ease.state(seg(t, duraklar[i][0] - sure, sure)); if (u <= 0) break; p = yay(p, duraklar[i][1], u, yuksel); }
  return p;
}
// Atlayan sayı: tek bir rakam duraktan durağa atlar ("1 … 6"): duraklar = [[t, [x, y], metin], …] (EKRAN uzayı).
// Her atlayış 0,16 sn; rakam atlayışın ortasında değişir ve indiği yerde bir kez kabarır. son: çıkış anı.
export function sayiAtla(K, t, duraklar, { son = 1e9, size = 60, fill = PAL.coral, col = PAL.paper, yuksel = 40, sure = 0.16 } = {}) {
  const a = duraklar[0][0] - 0.04; if (t < a || t > son + 0.2) return;
  let p = duraklar[0][1], lab = duraklar[0][2], pu = 1 + 0.16 * nabiz(t, duraklar[0][0], 0.3);
  for (let i = 1; i < duraklar.length; i++) {
    const u = seg(t, duraklar[i][0] - sure, sure); if (u <= 0) break;
    p = yay(p, duraklar[i][1], ease.state(u), yuksel); if (u >= 0.5) lab = duraklar[i][2];
    pu = 1 + 0.16 * nabiz(t, duraklar[i][0], 0.3);
  }
  const { ctx } = K, v = spring(t - a, UI[0], UI[1]), out = 1 - ease.exit(seg(t, son, 0.2));
  ctx.save(); ctx.translate(p[0], p[1]); ctx.scale((0.6 + 0.4 * v) * out * pu, (0.6 + 0.4 * v) * out * pu); ctx.globalAlpha = clamp01(v * 1.6) * out;
  pill(K, 0, 0, lab, fill, col, size); ctx.restore();
}
