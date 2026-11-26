// Bölüm 70 · NECMİ'NİN OYUNU (v4 "hikâye" dili, cevapsız tasarım, kısa format; storyboard: hikayeler/bolum_070_v5.md).
// Mekanizma: kılık değiştirmiş oyun (1–9 sihirli karesinde "üç taşı 15 eden" = üç taşı bir sırada olan).
// Logline: Çay molasında Necmi'nin getirdiği oyunu Defne ile Necmi karşılıklı oynar: masadaki dokuz taştan sırayla birer
// taş alınır, elindeki üç taşın toplamı 15 olan kazanır. Yüz oyunun hepsi berabere biter. Necmi: "Bunu çocukken hep
// oynardınız, yalnız adı başkaydı."
// Akılda kalacak tek şey: bildiğin bir oyun, sayıların arkasına saklanmış olabilir.
// Sızıntı yasağı: dokuz taş hiçbir anda 3 × 3 dizilmez (havuz tek düz sıra, ıstakalar tek sıra; kod yükleme anında denetler).
// Kareli örtü, ızgara, X ya da O işareti, çizgili tahta yok. Hikmet'in çetelesi beşli demetlerdir, satırları kaydırmalı
// el yazısı gibi akar (ızgara değil). Taşların renkleri, ışığı ve büyüklüğü eşittir; hiçbir taş tek başına öne çıkmaz.
// Oyun elde oynanır: el taşa gider, taşı üstünden tutar, ıstakaya taşır, bırakır (ıstakaya vuruş: knock).
// Mekân: ofisin mola köşesi. Defne (solda, yüzü sağa) ve Necmi (sağda, yüzü sola) küçük bir masada karşılıklı oturur;
// Hikmet Necmi'nin sağında ayakta, elinde çetele defteri. Masa önden görünür; üst yüzeyi görünür (havuz arkada, ıstakalar önde).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Oyun (şartlar: değişmez; yükleme anında denetlenir) ═══════════════════════════
// Havuz: tek düz sıra, soldan sağa bu değerler (dağınık sıra; sıralı değil). Defne solda, Necmi sağda oturur:
// Defne havuzun sol yarısından, Necmi sağ yarısından alır (kol boyu).
const HAVUZ = [7, 9, 1, 8, 4, 5, 2, 6, 3];
// Açılış oyunu (Necmi başlar): kare 0'dan önce N1 D6 N5; kare 0'da Defne 9'u alır (Necmi'nin 1-5-9 tehdidini keser),
// n0'da Necmi 8'i alır: elindeki üç taş 1 + 5 + 8 = 14 (Hikmet parmakla sayar, "14", olmadı).
const ACILIS_ONCE = [['N', 3], ['D', 1], ['N', 5]], ACILIS = [['D', 7], ['N', 6], ['D', 4]];
// Sayaçtaki yeni oyun (Necmi başlar): altı hamle, herkes rakibinin tehdidini keser, kimse kazanamaz.
const SAYAC_OYUN = [['N', 2], ['D', 1], ['N', 3], ['D', 4], ['N', 6], ['D', 7]];
(function denetle() {
  const uc15 = h => h.some((a, i) => h.some((b, j) => j > i && h.some((c, k) => k > j && a + b + c === 15)));
  const tehdit = (h, bos) => [...new Set(h.flatMap((a, i) => h.slice(i + 1).map(b => 15 - a - b)).filter(x => bos.has(x)))];
  if ([...HAVUZ].sort((a, b) => a - b).join() !== '1,2,3,4,5,6,7,8,9') throw new Error('b070: havuz 1–9 olmalı');
  for (const oyun of [[...ACILIS_ONCE, ...ACILIS], SAYAC_OYUN]) {
    const el = { N: [], D: [] }, bos = new Set(HAVUZ);
    for (const [kim, v] of oyun) {
      const rakip = kim === 'N' ? 'D' : 'N', th = tehdit(el[rakip], bos);
      if (!bos.has(v) || tehdit(el[kim], bos).length || th.length > 1 || (th.length === 1 && th[0] !== v)) throw new Error('b070: hamle mantığı tutmadı ' + kim + v);
      el[kim].push(v); bos.delete(v);
      if (uc15(el[kim])) throw new Error('b070: oyun berabere sürmeli');
      const i = HAVUZ.indexOf(v); if (kim === 'D' ? i > 4 : i < 4) throw new Error('b070: taş oyuncunun yarısında olmalı ' + kim + v);
    }
    if (el.N.length >= 3 && oyun === SAYAC_OYUN && tehdit(el.N, bos).length) throw new Error('b070: sayaç sonunda Necmi kazanmamalı');
  }
  if ([...ACILIS_ONCE, ...ACILIS].filter(h => h[0] === 'N').reduce((a, h) => a + h[1], 0) !== 14) throw new Error('b070: Necmi\'nin üç taşı 14 etmeli');
  // Havuzun iki yarısı iki oyuncunun eli gibi okunabilir: ikisinde de 15 eden üçlü yok (berabere biten bir dağılım); yan yana üç taş da 15 etmez
  if (uc15(HAVUZ.slice(0, 5)) || uc15(HAVUZ.slice(5)) || HAVUZ.some((v, i) => i < 7 && v + HAVUZ[i + 1] + HAVUZ[i + 2] === 15)) throw new Error('b070: havuz dizilimi 15 eden üçlü gösteriyor');
})();

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const MOLA = 'b070_mola';
const YB = 1212, YF = 1322, PERVAZ = 20, ZEMIN = 1500;   // masa üstü: arka kenar, ön kenar; ön pervaz
const TX = [335, 785];                                    // masanın sol ve sağ kenarı
const TW = 38, TH = 54;                                   // taş: en, boy
const PX = i => i < 5 ? 352 + 42 * i : 592 + 42 * (i - 5), PY = 1238, PK = 0.88;   // havuz arkada: taşlar biraz küçük (derinlik), ıstakadan açıkça ayrı; havuzdaki i. yer: tek düz sıra, ortada küçük aralık (Defne'nin ve Necmi'nin yarısı)
const JIT = [2, -1, 1, -2, 2, 0, -2, 1, -1], ROT = [-3, 2, -1, 3, -2, 1, 2, -3, 1];   // dağınık dursun (sabit liste)
const RY = 1304;                                          // ıstakadaki taşların tabanı
const SLOT = { D: [373, 415, 457], N: [739, 697, 655] };  // havuzla yarım taş kaydırmalı (sütun oluşmasın)  // ıstaka yerleri: ilk taş oyuncuya en yakın yerde
const DEF_X = 312, NEC_X = 778, HIK_X = 985;
const CAY_D = [520, 1318], CAY_N = [590, 1318];           // iki çay (tabak ortası)
const DEFTER = [953, 1166], DW = 124, DH = 156;           // Hikmet'in çetele defteri (orta), en, boy
const KREM = '#F6EFD9', KREM_KOYU = '#DCCFB2', RAKAM = '#B8332A', CAY = '#A8401F';
// kadrajlar [zoom, cx, cy]
const GENIS = [1.15, 640, 1110];     // üç kişi, masa, dokuz taş
const MASA = [1.5, 557, 1170];       // Defne + Necmi + masa (Hikmet kadraj dışı)
const INSERT = [1.6, 557, 1170];     // dokuz taş yakın (iki yüz kartın altında tam görünür)
const NH = [1.5, 913, 1088];
const GENIS2 = [1.12, 655, 1112];   // n0 + Hikmet'in sayması + zaman atlaması (üç kişi)         // Necmi + Hikmet + Necmi'nin ıstakası (Defne kadraj dışı)
const DEF = [1.6, 490, 1150];        // Defne yakın (Necmi'nin başı kadrajda tam)
// Konuşmayan karakterin ağzı kapalı kalır
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 1, pupil: 1, curve: 0.7, open: 0, w: 1.2 };
const KAPALI = { brow: 0.04, browTilt: -0.12, eye: 0.85, pupil: 1, curve: 0.3, open: 0, w: 0.9 };   // ağzı kapalı tebessüm
const DIKKAT = { brow: 0.06, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));

// ═══════════════════════════ Nesneler ═══════════════════════════
// Okey taşı (önden, dik): (x, yb) tabanın ortası. Krem zemin, kırmızı rakam, rakamın altında küçük nokta.
function tas(K, x, yb, v, rot = 0, k = 1) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.rotate(rot * D2R); ctx.scale(k, k);
  K.rect(-TW / 2 + 4, -TH + 5, TW, TH, INK, 0, 7);                 // gölge
  K.rect(-TW / 2, -TH, TW, TH, KREM, LW * 0.6, 7);
  ctx.save(); ctx.beginPath(); ctx.roundRect(-TW / 2, -TH, TW, TH, 7); ctx.clip(); ctx.fillStyle = KREM_KOYU; ctx.fillRect(-TW / 2, -9, TW, 9); ctx.restore();   // alt kalınlık
  K.rect(-TW / 2, -TH, TW, TH, null, LW * 0.6, 7);
  K.text(String(v), 0, -17, 42, RAKAM, 900);
  ctx.restore();
}
// Istaka (önden): taşların oturduğu ince tahta. x0..x1, üst kenarı y.
function istaka(K, x0, x1) {
  K.rect(x0, RY - 4, x1 - x0, 14, PAL.woodDark, LW * 0.7, 4);
  K.rect(x0 - 4, RY + 8, x1 - x0 + 8, 10, PAL.wood, LW * 0.7, 4);
}
// Çay bardağı ve tabağı: (x, yb) tabağın ortası; dolu 0..1
function bardak(K, [x, yb], dolu, t, i) {
  const { ctx } = K, k = 1.2;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 0, 23, 6, PAL.cream, 2.5);
  const yol = [[-12, -40], [12, -40], [7, -22], [12, -8], [9, -2], [-9, -2], [-12, -8], [-7, -22]];
  K.poly(yol, '#F3EEE4', 2.5);
  if (dolu > 0.02) {
    const yy = lerp(-3.5, -34, dolu);
    ctx.save(); K.path([[-10.5, -34], [10.5, -34], [6.4, -22], [10.6, -8], [8, -3.5], [-8, -3.5], [-10.6, -8], [-6.4, -22]]); ctx.clip();
    ctx.fillStyle = CAY; ctx.fillRect(-14, yy, 28, 40); K.line(-12, yy, 12, yy, 2.5, '#C9603A'); ctx.restore();
  }
  K.poly(yol, null, 2.5);
  ctx.restore();
}
// Çaydanlık (yan dolabın üstünde; döngü: buhar). (x, y) tabanın ortası, emzik solda
function caydanlik(K, x, y, t) {
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 66, 60, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
  K.poly([[x + 52, y - 46], [x + 98, y - 76], [x + 106, y - 64], [x + 56, y - 24]], PAL.metal, LW);
  K.rect(x - 50, y - 72, 100, 72, PAL.metal, LW, 14);
  K.rect(x - 32, y - 122, 64, 54, '#B9C6BB', LW, 12); K.circ(x, y - 128, 9, '#3A3F3C', LW * 0.6);
  H.buhar(K, x + 108, y - 84, t, { k: 0.6, n: 2, ara: 16, boy: 90 });
}
// Masa (önden): üst yüzey (YB..YF), ön pervaz, iki ayak. Karakterlerden SONRA çizilir (dizler masanın altında kalır).
function masa(K) {
  const [x0, x1] = TX;
  K.rect(x0 + 22, YF + PERVAZ - 4, 24, ZEMIN - YF - PERVAZ + 4, PAL.woodDark, LW, 4);
  K.rect(x1 - 46, YF + PERVAZ - 4, 24, ZEMIN - YF - PERVAZ + 4, PAL.woodDark, LW, 4);
  K.poly([[x0 + 10, YB], [x1 - 10, YB], [x1, YF], [x0, YF]], PAL.woodTop, LW);
  for (const [y, a, b] of [[YB + 26, 0.12, 0.46], [YB + 52, 0.55, 0.9], [YB + 70, 0.2, 0.38]]) K.line(lerp(x0, x1, a), y, lerp(x0, x1, b), y, 3, '#B07A44');   // ahşap damarı
  K.rect(x0 - 4, YF, x1 - x0 + 8, PERVAZ, PAL.wood, LW, 5);
}
// Tezgâhın üstüne uzanan kol (yandan): masanın üst yüzeyinin altında kalan kısmını masadan sonra yeniden çizer
function kolUst(K, key, p, side, a = 1) {
  if (a <= 0.01) return;
  const { ctx } = K, c = H.CARDS[key], s = p.s, j = n => H.eklem(key, p, n + side), sh = j('sh'), el = j('el'), ha = j('hand');
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(-5000, YB - 2, 10000, 3000); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = (c.arm.w + c.line * 2) * s; ctx.stroke();
  ctx.strokeStyle = c.arm.color; ctx.lineWidth = c.arm.w * s; ctx.stroke();
  ctx.restore();
}
// Çetele defteri (Hikmet'in elinde): n çizgi; beşli demetler, satırlar el yazısı gibi kaymalı (ızgara değil)
const DEMET_X = [0, 29, 57, 86], SATIR_KAY = [0, 7, -4, 9, 2];
function demetYeri(g) { const r = Math.floor(g / 4), c = g % 4; return [DEFTER[0] - 50 + DEMET_X[c] + SATIR_KAY[r] + (c % 2 ? 2 : 0), DEFTER[1] - 46 + r * 27 + (c === 2 ? 2 : 0)]; }
function cizgiYeri(n) { const g = Math.floor(n / 5), i = n % 5, [x, y] = demetYeri(g); return i < 4 ? [x + 3 + i * 5, y] : [x + 10, y]; }
function defter(K, n) {
  const [cx, cy] = DEFTER, { ctx } = K;
  K.rect(cx - DW / 2 + 6, cy - DH / 2 + 8, DW, DH, INK, 0, 8);
  K.rect(cx - DW / 2, cy - DH / 2, DW, DH, '#FBF6EC', LW * 0.7, 8);
  K.rect(cx - DW / 2, cy - DH / 2, DW, 18, PAL.teal, LW * 0.7, 8);
  for (let i = 0; i < 6; i++) K.circ(cx - DW / 2 + 16 + i * 19, cy - DH / 2 + 2, 4.5, null, 3);
  ctx.save(); ctx.lineCap = 'round';
  for (let k = 0; k < n; k++) {
    const g = Math.floor(k / 5), i = k % 5, [x, y] = demetYeri(g);
    if (i < 4) K.line(x + 3 + i * 5, y - 8, x + 3 + i * 5 + 1, y + 9, 2.8, '#3A3F3C');
    else K.line(x - 1, y + 7, x + 22, y - 6, 2.8, '#3A3F3C');
  }
  ctx.restore();
}
function kalem(K, [x, y], a = -50) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(a * D2R);
  K.rect(-6, -66, 12, 60, PAL.mustard, 3.5, 3); K.poly([[-6, -6], [6, -6], [0, 8]], '#F1D9B0', 3.5); K.rect(-6, -74, 12, 10, PAL.coral, 3.5, 3);
  ctx.restore();
}

// ═══════════════════════════ Mekân: ofisin mola köşesi ═══════════════════════════
M.mekanEkle(MOLA, {
  gen: [-700, 2000], dongu: ['çay buharı', 'çaydanlık buharı', 'pencerede martı'],
  capa: { masa: [540, YF], havuz: [540, PY], defter: DEFTER }, kadraj: { genis: GENIS, masa: MASA },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -800, x1: 2100, isik, duvar: 'duz', zemin: 'ahsap' });
    M.pencere(K, 470, 640, 200, 300, { isik, t, kayit: false });
    // yan dolap ve çaydanlık (Defne'nin arkasında)
    K.rect(-20, 1196, 236, 304, PAL.wood, LW, 6); K.rect(-6, 1176, 264, 26, PAL.woodTop, LW, 6);
    K.rect(10, 1236, 96, 230, PAL.woodTop, LW * 0.6, 6); K.rect(116, 1236, 86, 230, PAL.woodTop, LW * 0.6, 6);
    caydanlik(K, 118, 1178, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095,   // (26 Kas) cevapsiz.mjs kartı d6>+0,1'e yuvarlar; son sahne ondan önce başlasın (aradaki 5 ms'de kare yok)
    buldum: T('d3'), proof: T('d3>') + 0.05,
    ins: T('h1:6') - 0.08, dokuz: T('h1:8'), nKes: T('n0') - 0.1, birer: T('n0:2'), uc: T('n0:6'), on: T('n0:9'),
    skip: T('d1') - 0.1, ber: T('d1:4') - 0.09, n0b: T('n0b') - 0.1, cocuk: T('n0b:2'), yalniz: T('n0b:5'),
    h3: T('h3') - 0.1, hangi: T('h3:3'), sayac: cd0 - 0.05, n1: T('n1'), sekiz: T('n1:5'), sayin: T('n1:4'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  tm.atla0 = tm.skip + 0.08; tm.atla1 = tm.ber - 0.08;           // zaman atlaması (kadraj sabit, 1,2–2,2 sn)
  tm.say0 = T('n0:4') + 0.05; tm.yok = tm.say0 + 0.75; tm.blok = T('n0:11') + 0.02;           // Hikmet "Elindeki"de parmakla sayar (üç); "14", olmadı; "olan"da Defne 4'ü alır
  // ——— hamleler: [tutuş anı, kim, değer, hedef ('D0'.. ıstaka yeri | 'P' havuz), taşıma süresi] ———
  const H6 = [];
  H6.push([0.3, 'D', 7, 'D1', 0.62]);                            // kare 0: Defne'nin eli 7'ye uzanmış (Necmi'nin 3-5-7 tehdidini keser)
  H6.push([tm.birer + 0.25, 'N', 6, 'N2', 0.62]);                // n0 "birer taş": Necmi 6'yı alır (3 + 5 + 6 = 14)
  H6.push([tm.blok, 'D', 4, 'D2', 0.62]);                        // Defne 4'ü alır (Necmi'nin 4-5-6 tehdidini keser)
  // zaman atlaması: taşlar havuza döner (hızlı); Necmi üç, Defne iki taş
  const a0 = tm.atla0 + 0.12, ad = (tm.atla1 - 0.15 - a0) / 3;
  H6.push([a0, 'N', 6, 'P', ad * 0.62], [a0 + ad, 'N', 5, 'P', ad * 0.62], [a0 + 2 * ad, 'N', 3, 'P', ad * 0.62]);
  H6.push([a0 + 0.2 * ad, 'D', 4, 'P', ad * 0.62], [a0 + 1.2 * ad, 'D', 7, 'P', ad * 0.62], [a0 + 2.2 * ad, 'D', 1, 'P', ad * 0.62]);
  // sayaç: yeni oyun, altı hamle (her biri 1,3 sn arayla)
  SAYAC_OYUN.forEach(([kim, v], i) => H6.push([cd0 + 0.75 + i * 1.32, kim, v, kim + (i >> 1), 0.62]));
  H6.sort((a, b) => a[0] - b[0]);
  // taşların başlangıç yerleri (kare 0)
  const bas = {}; HAVUZ.forEach(v => { bas[v] = 'P'; });
  bas[3] = 'N0'; bas[5] = 'N1'; bas[1] = 'D0';
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...GENIS], [tm.ins - 0.5, 1.16, 638, 1109]] },
    { id: 'insert', t0: tm.ins, cam: [[0, ...INSERT]] },
    { id: 'atla', t0: tm.nKes, cam: [[0, ...GENIS2]] },   // n0, sayma ve zaman atlaması tek plânda (atlama kesme değildir)
    { id: 'defne', t0: tm.ber, cam: [[0, ...DEF]] },
    { id: 'masa', t0: tm.n0b, cam: [[0, ...MASA], [tm.h3 - 0.4, 1.52, 557, 1168]] },
    { id: 'hikmet', t0: tm.h3, cam: [[0, ...NH]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...MASA]] },                      // doğrusal itme draw'daki kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, DEF_X + 90, 1080]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...MASA]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);

  // ——— pozlar (yandan oturur: Defne yüzü sağa, Necmi yüzü sola) ———
  const def = [
    [0, { expr: DIKKAT, head: { tilt: 6, look: [0.6, 0.5] } }],
    [1.3, { expr: DIKKAT, head: { tilt: 2, look: [0.6, 0.2] } }, 0.3],
    [tm.nKes, { expr: 'notr', head: { tilt: -2, look: [0.7, 0] } }, 0.01],
    [tm.birer, { head: { tilt: 5, look: [0.6, 0.5] } }, 0.3],
    [tm.blok - 0.4, { expr: DIKKAT, head: { tilt: 6, look: [0.6, 0.5] } }, 0.3],
    [tm.blok + 0.75, { expr: GULUS, head: { tilt: 0, look: [0.7, 0] } }, 0.3],
    [tm.skip, { expr: DIKKAT, head: { tilt: 6, look: [0.6, 0.5] } }, 0.01],
    [tm.ber, { expr: 'mutlu', head: { tilt: -3, look: [0.6, -0.1] } }, 0.01],
    [tm.n0b, { expr: 'notr', head: { tilt: -2, look: [0.7, 0] } }, 0.01],
    [tm.yalniz, { expr: SASKIN, head: { tilt: 3, look: [0.7, 0] } }, 0.25],
    [tm.sayac, { expr: H.IFADE.dusun2, head: { tilt: 6, look: [0.6, 0.5] } }, 0.01],
    [tm.cd - 2.2, { expr: H.IFADE.dusun2, head: { tilt: -4, look: [0.4, -0.5] } }, 0.4],
    [tm.n1, { expr: 'notr', head: { tilt: -2, look: [0.7, -0.1] } }, 0.35],
    [tm.sayin, { expr: DIKKAT, head: { tilt: 6, look: [0.6, 0.45] } }, 0.3],                 // "sayın": taşlara bakar
    [tm.sekiz, { expr: DIKKAT, head: { tilt: 2, look: [0.7, -0.1] } }, 0.25],
    [tm.n1s - 0.35, { expr: H.IFADE.dusun2, head: { tilt: 6, look: [0.6, 0.5] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.6, -0.3] } }, 0.2],
  ];
  const nec = [
    [0, { expr: GULUS, head: { tilt: 4, look: [0.6, 0.45] } }],
    [1.4, { expr: GULUS, head: { tilt: 0, look: [0.7, 0] } }, 0.3],
    [tm.nKes, { expr: 'mutlu', head: { tilt: -2, look: [0.6, 0] } }, 0.01],
    [tm.birer, { head: { tilt: 6, look: [0.6, 0.5] } }, 0.25],
    [tm.uc, { expr: 'mutlu', head: { tilt: -2, look: [0.6, 0] } }, 0.3],
    [tm.yok, { expr: SASKIN, head: { tilt: -2, look: [-0.6, -0.2] } }, 0.3],
    [tm.skip, { expr: GULUS, head: { tilt: 6, look: [0.6, 0.5] } }, 0.01],
    [tm.ber, { expr: GULUS, head: { tilt: 0, look: [0.7, 0] } }, 0.01],
    [tm.n0b, { expr: 'mutlu', head: { tilt: -3, look: [0.7, 0] } }, 0.01],
    [tm.yalniz, { expr: 'mutlu', head: { tilt: 3, look: [0.7, -0.15] } }, 0.3],
    [tm.h3, { expr: GULUS, head: { tilt: -2, look: [-0.5, -0.2] } }, 0.01],
    [tm.sayac, { expr: GULUS, head: { tilt: 4, look: [0.6, 0.45] } }, 0.01],
    [tm.n1 - 0.25, { expr: 'mutlu', head: { tilt: -2, look: [0.7, -0.05] } }, 0.3],
    [tm.n1s + 0.2, { expr: GULUS, head: { tilt: 2, look: [0.7, 0] } }, 0.3],
  ];
  const hik = [
    [0, { expr: 'mutlu', head: { tilt: -4, look: [-0.75, 0.2] } }],
    [tm.dokuz - 0.3, { head: { tilt: 3, look: [-0.8, 0.45] } }, 0.3],
    [tm.nKes, { expr: DIKKAT, head: { tilt: 4, look: [-0.8, 0.4] } }, 0.01],
    [tm.yok, { expr: 'notr', head: { tilt: -3, look: [-0.6, 0.3] } }, 0.25],
    [tm.skip, { expr: KAPALI, head: { tilt: 6, look: [-0.2, 0.8] } }, 0.01],
    [tm.atla1, { expr: KAPALI, head: { tilt: -3, look: [-0.7, 0.2] } }, 0.3],
    [tm.h3, { expr: 'mutlu', head: { tilt: 4, look: [-0.25, 0.05] } }, 0.01],
    [tm.hangi - 0.15, { head: { tilt: -3, look: [0, 0] } }, 0.3],
    [tm.sayac, { expr: H.IFADE.dusun, head: { tilt: 3, look: [-0.7, 0.4] } }, 0.01],
  ];
  // Altyazı çizelgesi: n1 son repliktir (cevapsız kesim); balonu "Buldum!"a kadar kalır
  // "on beş" iki satıra bölünmesin (bölünmez boşluk)
  const nb = l => ({ ...l, text: l.text.replace('on beş', 'on\u00a0beş').replace('On beş', 'On\u00a0beş') });
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? nb({ ...l, t1: T('d3') - 0.05 }) : l.id === 'n0' ? nb(l) : l) };
  return { tm, film, tlA, H6, bas, def, nec, hik };
}

// ═══════════════════════════ Durumlar ═══════════════════════════
// Bir taşın yeri: 'P' havuz (değerin sabit yeri), 'D0'.. ıstaka. Dönen taban noktası ve açı.
const yerOf = (v, y) => y === 'P' ? { p: [PX(HAVUZ.indexOf(v)), PY + JIT[HAVUZ.indexOf(v)]], r: ROT[HAVUZ.indexOf(v)], k: PK } : { p: [SLOT[y[0]][+y[1]], RY], r: 0, k: 1 };
const ust = (p, k = 1) => [p[0], p[1] - TH * k + 8];        // tutuş noktası (taşın üst ortası; el taşın üstünü örter)
// Taşın t anındaki hâli: { p (taban), r, kim (elinde tutan) }
function tasAt(S, v, t) {
  let yer = S.bas[v];
  for (const [tg, kim, val, hedef, d] of S.H6) {
    if (val !== v || t < tg) continue;
    const a = yerOf(v, yer), b = yerOf(v, hedef);
    if (t < tg + d) { const u = ease.state(seg(t, tg, d)); return { p: H.yay(a.p, b.p, u, 44), r: lerp(a.r, b.r, u), k: lerp(a.k, b.k, u), kim }; }
    yer = hedef;
  }
  const y = yerOf(v, yer); return { ...y, kim: null };
}
// Oyuncunun eli: dinlenirken masanın ön kenarında; hamlede taşa uzanır (0,28 sn), taşır, bırakır, döner (0,32 sn)
// Dinlenen el kucakta, masanın altında (kol ıstakanın üstünden geçip taşları örtmesin)
const DINLEN = { D: [DEF_X + 62, 1376], N: [NEC_X - 62, 1376] };
const masada = (el, kim) => clamp01((Math.hypot(el[0] - DINLEN[kim][0], el[1] - DINLEN[kim][1]) - 40) / 45);
function elAt(S, kim, t) {
  const keys = [[0, DINLEN[kim]]];
  if (kim === 'D') keys[0] = [0, ust(yerOf(7, 'P').p, PK)];   // kare 0: Defne'nin eli 7'ye uzanmış
  for (const [tg, k, v, hedef, d] of S.H6) {
    if (k !== kim) continue;
    const ya = yerOf(v, S.H6.filter(h => h[2] === v && h[0] < tg).map(h => h[3]).pop() ?? S.bas[v]), yb = yerOf(v, hedef), a = ust(ya.p, ya.k), b = ust(yb.p, yb.k);
    const r = Math.min(0.28, d * 0.6);
    if (tg > 0.31) keys.push([tg - r, a, r]);
    keys.push([tg, b, d, ease.state, 44], [tg + d + 0.08, DINLEN[kim], Math.min(0.32, d * 0.7)]);
  }
  return H.iz(keys, t);
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç taşları örtmesin)
  drift: 0.007,
  split: { n0: 4, n0b: 4 },
  kamera(cam, t, B) {
    if (B.sc.id !== 'sayac') return;   // sayaç: masa plânından dokuz taşa doğrusal itme (1,5x → 1,7x), ipucunda 1,74x'e sürer
    const { cd0, cd, buldum } = S.tm;
    const z = t < cd ? Math.exp(lerp(Math.log(1.42), Math.log(1.56), clamp01((t - cd0) / 10))) : lerp(1.56, 1.58, clamp01((t - cd) / (buldum - cd)));
    Object.assign(cam, { zoom: z, cx: 557, cy: 1170 });
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (B.sc.id === 'atla' && t < tm.skip) {   // Necmi'nin üç taşı: 14 (Hikmet saydı, olmadı)
      H.tag(K, t, tm.yok, tm.skip - 0.22, [330, 640], '3 + 5 + 6 = 14', PAL.coral, PAL.paper, 50);
    }
    if (B.sc.id === 'atla') H.zamanHapi(K, t, tm.atla0 + 0.12, tm.ber - 0.22, '100 OYUN SONRA', { x: 400, y: 620, saat: 15.2 + 2 * ease.state(seg(t, tm.atla0, tm.atla1 - tm.atla0)) });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (068'deki düzen): perde yok; daire solda, başlık ve paylaşım hapı sağında, alt bantta.
// İpucu balonu aynı banda geleceği için sayaç son 0,3 sn'de çekilir.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1 - 0.3, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1320, r = 78;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 25, 70, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(596, 1272); ctx.scale(inU * out, inU * out);
  ctx.font = '900 52px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 64;
  K.rect(-bw / 2 + 8, -38 + 10, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 19, 52, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(596, 1366); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56;
    K.rect(-sw / 2 + 8, -40 + 10, sw, 80, INK, 0, 40); K.rect(-sw / 2, -40, sw, 80, PAL.coral, LW, 40); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// ——— Dünya ———
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc, cam } = B, id = sc.id;
  const u = H.atlama(t, tm.atla0, tm.atla1 - tm.atla0);                      // zaman atlaması: tek u
  const isik = M.isikKaris('gunduz', 'aksam', 0.5 * u);
  M.mekanCiz(K, MOLA, 'arka', t, { isik });

  // ——— taşlar ve eller ———
  const taslar = HAVUZ.map(v => ({ v, ...tasAt(S, v, t) }));
  const elD = elAt(S, 'D', t), elN = elAt(S, 'N', t);
  const lean = (key, p, el) => { const sh = H.shoulder(key, p, 'R'), d = Math.abs(el[0] - sh[0]); return lerp(5, 24, clamp01((d - 90) / 110)); };

  // Defne (solda, yüzü sağa)
  const dp0 = H.poseAt(H.CARDS.defne, H.otur('defne', { x: DEF_X, facing: 1, el: false }), S.def, t);
  dp0.lean = lean('defne', dp0, elD); dp0.y -= H.buldumHop(t, tm.buldum);
  const dO = { heads, R: [elD, 1, 'A'] };
  // sayacın sonu: eli çenesinde düşünür (hamle yokken)
  const sonD = S.H6.filter(h => h[1] === 'D').pop();
  const wC = id === 'sayac' ? Math.max(pIn(t, sonD[0] + sonD[4] + 0.45, tm.n1 + 0.2, 0.35), W(t, tm.n1s - 0.45, 0.4)) : 0;   // ipucunda eli çenesinden iner, "çıkacak"ta yine çenesinde (kesimden önce oturur)
  if (wC > 0.01) { const bas = H.eklem('defne', dp0, 'head'); dO.R = [[lerp(elD[0], bas[0] + 62, wC), lerp(elD[1], bas[1] + 126, wC)], 1, 'B']; }
  if (id === 'buldum') dO.R = [H.elYeri('defne', dp0, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];
  // Necmi (sağda, yüzü sola)
  const np0 = H.poseAt(H.CARDS.necmi, H.otur('necmi', { x: NEC_X, facing: -1, el: false }), S.nec, t);
  np0.lean = lean('necmi', np0, elN);
  const nO = { heads, R: [elN, 1, 'A'] };
  let nPar = null, nParL = null;
  // n0b ve n1: işaret parmağı havada, iki yüzün arasında (kol yüze binmez; havuzun üstünde kalır)
  const PARMAK = [560, 1186];
  const wW = 0;   // (kol yüze binmesin diye Necmi el hareketi yapmaz: n0b'de arkasına yaslanır, n1'de öne eğilip başını sallar)

  const w8 = 0;
  dp0.lean = lean('defne', dp0, dO.R[0]); np0.lean = lean('necmi', np0, nO.R[0]);   // gövde uzanılan yere göre eğilir
  const yaslan = pIn(t, tm.cocuk - 0.35, tm.yalniz + 1.0, 0.4), egil = pIn(t, tm.n1, tm.buldum + 1, 0.6);
  np0.lean = lerp(lerp(np0.lean, -7, yaslan), 12, egil);
  H.onayla(np0, t, tm.sayin - 0.3, 1, 0.36); H.onayla(np0, t, tm.sekiz - 0.05, 2, 0.34); H.onayla(np0, t, tm.yalniz + 1.0, 1, 0.38);
  // Hikmet (ayakta, önden): sol eli defterin sol alt köşesinde, sağ elinde kalem
  const hp = H.poseAt(H.CARDS.hikmet, H.kisi('hikmet', { x: HIK_X, expr: 'mutlu', ...H.POZ.dur }), S.hik, t);
  const yazi = pIn(t, tm.atla0, tm.atla1, 0.2);                               // zaman atlaması: çetele yazar
  const nCiz = 2 + Math.floor(98 * u);
  const hO = { heads, L: [[DEFTER[0] - DW / 2 + 12, DEFTER[1] + DH / 2 - 26], 1, 'A'] };
  let hR = [DEFTER[0] + DW / 2 + 4, DEFTER[1] + 34];
  if (yazi > 0.01) { const c = cizgiYeri(Math.max(0, nCiz - 1)); hR = [lerp(hR[0], c[0] + 26, yazi), lerp(hR[1], c[1] + 30, yazi)]; }
  const hTap = H.nabiz(t, tm.hangi, 0.3); hR = [hR[0], hR[1] - 16 * hTap];
  hO.R = [hR, 1, 'A'];
  let hPar = null;
  const wS = pIn(t, tm.say0 - 0.3, tm.yok + 0.25);                           // parmakla sayar: üç
  if (wS > 0.01) { hO.R = [[lerp(hR[0], HIK_X + 46, wS), lerp(hR[1], 1050, wS)], 1, 'B']; if (wS > 0.5) hPar = ['R', 3 * seg(t, tm.say0, 0.6), { toplam: 3 }]; }
  for (let i = 0; i < 2; i++) {                                               // "olmadı": baş iki yana
    const a = tm.yok + 0.05, e = pIn(t, a - 0.1, a + 0.6, 0.12), s = Math.sin(TAU * 2.2 * (t - a));
    if (e > 0 && i === 0) hp.head = { ...hp.head, look: [hp.head.look[0] + 0.45 * e * s, hp.head.look[1]], tilt: hp.head.tilt + 4 * e * s };
  }

  // ——— çizim sırası: sandalyeler → kişiler → masa → havuz → ıstakalar → çaylar → masaya uzanan kollar → taşınan taşlar → eller ———
  const kisiCiz = !['buldum'].includes(id);
  for (const [k, p] of [['defne', dp0], ['necmi', np0]]) { const o = H.oturak(k, p); M.sandalye(K, o.x, o.y, { yon: p.facing, w: 118, sirt: 160 }); }
  const hikVar = !['masa', 'sayac', 'insert', 'defne', 'buldum', 'cevap'].includes(id);
  const hc = hikVar ? oyna(K, t, tl, 'hikmet', hp, hO) : null;
  const nc = kisiCiz ? oyna(K, t, tl, 'necmi', np0, nO) : null;
  const dc = oyna(K, t, tl, 'defne', dp0, dO);
  for (const k of Object.keys(heads)) heads[k] = [heads[k][0], cam.cy + (1085 - 960) / cam.zoom];   // kuyruk kısa (taşların üstünden geçmesin)
  masa(K);
  // çaylar (buhar taşların arkasında kalır: önce buhar, sonra havuz)
  const dolu = 0.9 - 0.82 * u;
  if (dolu > 0.3) { H.buhar(K, CAY_D[0], CAY_D[1] - 50, t, { k: 0.4, n: 2, ara: 14, boy: 70 }); H.buhar(K, CAY_N[0], CAY_N[1] - 50, t + 0.7, { k: 0.4, n: 2, ara: 14, boy: 70 }); }
  const halka = (v, x) => 1 + 0.16 * H.nabiz(t, tm.dokuz + 0.06 * Math.round((x - 350) / 46), 0.34);   // "dokuz taş": soldan sağa nabız (eşit)
  for (const s of taslar) if (!s.kim && s.p[1] < RY - 20) tas(K, s.p[0], s.p[1], s.v, s.r, s.k * halka(s.v, s.p[0]));
  istaka(K, 352, 478); istaka(K, 634, 760);
  for (const s of taslar) if (!s.kim && s.p[1] >= RY - 20) tas(K, s.p[0], s.p[1], s.v, s.r, s.k * halka(s.v, s.p[0]));
  bardak(K, CAY_D, dolu, t, 0); bardak(K, CAY_N, dolu, t, 1);
  const aD = wC > 0.5 || id === 'buldum' ? 0 : masada(elD, 'D'), aN = masada(elN, 'N');
  if (dc) kolUst(K, 'defne', dp0, 'R', aD);
  if (nc) kolUst(K, 'necmi', np0, 'R', aN);
  for (const s of taslar) if (s.kim) tas(K, s.p[0], s.p[1], s.v, s.r, s.k);
  if (dc && aD > 0.5) dc.tut('R');
  if (nc && !nPar && aN > 0.5) nc.tut('R');
  if (nc && nPar) nc.parmak(...nPar);
  if (nc && nParL) nc.parmak(...nParL);
  if (dc && wC >= 0.5) dc.tut('R');
  if (hc) {
    defter(K, nCiz); hc.tut('L');
    if (hPar) hc.parmak(...hPar);
    else { kalem(K, [hc.handR[0] - 4, hc.handR[1] - 4], yazi > 0.5 ? -35 : -55); hc.tut('R'); }
  }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp0, 'head'), { son: tm.proof });
}
