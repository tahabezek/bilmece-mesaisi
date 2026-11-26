// Bölüm 74 · BİLEK GÜREŞİ (v4 "hikâye" dili, cevapsız tasarım, kısa format; storyboard: hikayeler/bolum_074_v5.md).
// Mekanizma: turnuva (en çok galibiyet alan, kendisini yenen herkesi bir başkası üzerinden yenmiştir).
// Logline: Ofisteki bilek güreşi turnuvasında sekiz kişi herkesle bir kez güreşti, berabere yok; en çok maçı Hikmet kazandı.
// Necmi Hikmet'in bileğini masaya yatırıp kupayı ister. Hikmet cetvele bakmadan: "Benim yendiğim öyle biri var ki o da
// seni yenmiş." Kim olduğunu bilmiyor. Blöf mü, emin olabilir mi?
// Akılda kalacak tek şey: en çok kazanan, kendini yenen herkesi bir başkası üzerinden yenmiştir.
// Sızıntı yasağı: maç cetvelinin yalnız ARKASI görünür (tekerlekli yazı tahtası, sırtı kameraya dönük); kimin kimi yendiği,
// galibiyet sayıları hiçbir yerde yok. Arka sıradaki altı kişi aynı ölçekte, aynı çizgide, aynı işi yapar; figüranlardan
// hiçbiri öne çıkmaz (yakın plân, bakış, ışık yok).
// Yerleşim: Hikmet (solda) ve Necmi (sağda) güreş masasının arkasında oturur, önden görünür; iç kolları (Hikmet'in sağı,
// Necmi'nin solu) masanın ortasında kenetlenir, dirsekler minderde. Arka sırada (duvar dibinde, derinlikte küçük) altı kişi
// ayakta: f1, f2, Kerem, f3, f4, Defne; Defne'nin sağında yazı tahtası (cetvel), sırtı dönük.
// Plânlar: geniş plân (sekiz kişi) ve yakın plânlar (069'daki gibi: kenarda yarım yüz olmasın diye yakın plânda yalnız
// plânın kişileri çizilir).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Figüran kartları (bölüme özgü, b074_ önekli) ═══════════════════════════
// Kadro kartlarına dokunulmaz; figüranlar kadro iskeletinden türetilir. Dördü de aynı boyda, sönük renkli (eşit vurgu).
const FIG_TANIM = [
  // [anahtar, iskelet, gövde, gölge, bacak, ten, ten gölgesi, saç, özellikler, tohum]
  ['b074_f1', 'defne', '#4F7A73', '#3F625C', '#3E3A33', '#D9A27A', '#BF875F', '#2B1E18', ['blazer', 'bun', 'glassesRect', 'lashes'], 741],
  ['b074_f2', 'hikmet', '#5E6B73', '#4B565D', '#3B3F45', '#E8BC98', '#CFA07C', '#8A847D', ['suit', 'tie', 'hairSlick', 'mustacheThick'], 742],
  ['b074_f3', 'defne', '#8E5A46', '#74483A', '#4A3E33', '#C08760', '#A46F4C', '#1E1915', ['cardigan', 'hairLong', 'earrings', 'lashes'], 743],
  ['b074_f4', 'genc', '#6F7B58', '#5B6548', '#2F3B33', '#E3AF86', '#C9946C', '#3A2418', ['jacket', 'hairSpiky', 'glassesBold'], 744],
];
const BOYU = { ...H.BOY };
for (const [key, base, gov, gol, bac, ten, tenG, sac, ozl, tohum] of FIG_TANIM) {
  const b = H.CARDS[base];
  if (!H.CARDS[key]) H.CARDS[key] = {
    ...b, key, name: 'Figüran', seed: tohum,
    torso: { ...b.torso, color: gov, shade: gol, belly: 0 },
    arm: { ...b.arm, color: gov, shade: gol },
    leg: { ...b.leg, color: bac, shade: bac }, skin: ten, skinShade: tenG, hair: sac, features: ozl,
  };
  BOYU[key] = 232;
}

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const SALON = 'b074_salon';
const DUVAR_DIP = 1150, ARKA = 1160, AK = 0.6;            // duvar dibi; arka sıranın ayak çizgisi ve ölçek çarpanı (derinlik)
const ON = 0.85, SH_Y = 1165;                             // öndekilerin ölçek çarpanı ve omuz yüksekliği
const HIK_X = 398, NEC_X = 662;                           // Hikmet ve Necmi (önden, masanın arkasında oturur)
const YB = 1232, YF = 1292, TX = [236, 856];              // güreş masası: üst yüzün arka ve ön kenarı; sol ve sağ kenar
const ARKA_SIRA = [['b074_f1', 166], ['b074_f2', 310], [H.KEREM, 454], ['b074_f3', 598], ['b074_f4', 742], ['defne', 886]];
const TAHTA = { x: 1040, w: 142, y0: 818, y1: 1000 };     // yazı tahtası (cetvel), sırtı kameraya dönük
const KS = 0.8, KUPA_TUT = 82 * KS;                       // kupa ölçeği; tutuş noktası (bel) tabandan bu kadar yukarıda
const KUPA_MASA = [640, 1278], KUPA_HIK = [452, 1272], KUPA_ORTA = [545, 1284];
const C0 = [545, 1166];                                   // kenetlenmiş ellerin kare 0'daki yeri
const sOf = key => BOYU[key] * ON, sArka = key => BOYU[key] * AK;
const SHY = { hikmet: SH_Y, necmi: SH_Y + 13 };            // Necmi kısa: omzu biraz aşağıda (dirseği yine minderde)
const yOf = key => SHY[key] + { hikmet: 374, necmi: 295 }[key] * sOf(key) / ({ hikmet: 212.5, necmi: 191.25 }[key]);
// kadrajlar [zoom, cx, cy]
const GENIS = [1.05, 600, 1122];
const IKILI = [1.8, 545, 1124];
const HIKMET = [1.8, 522, 1124];
const DEFNE = [2.2, 966, 944];
const SAYAC = [1.6, 545, 1132];
// İfadeler (konuşmayanın ağzı kapalı)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.12, open: 0, w: 1 },
  gulus: { brow: 0.03, browTilt: -0.1, eye: 0.82, pupil: 1, curve: 0.7, open: 0, w: 1.15 },
  kurum: { brow: 0.05, browTilt: -0.14, eye: 0.72, pupil: 1, curve: 0.55, open: 0, w: 1.05 },
  zor: { brow: -0.03, browTilt: 0.5, eye: 0.55, pupil: 1, curve: -0.35, open: 0, w: 1.1 },
  suphe: { brow: -0.01, browTilt: 0.28, eye: 0.78, pupil: 1, curve: -0.25, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.2, pupil: 0.8, curve: 0.02, open: 0, w: 0.7 },
  dusun: { ...H.IFADE.dusun, open: 0 },
  supheK: { brow: -0.01, browTilt: 0.3, eye: 0.85, pupil: 1, curve: 0.06, open: 0, w: 1 },   // konuşurken şüphe (ağız açılabilsin)
  zorK: { brow: -0.03, browTilt: 0.5, eye: 0.6, pupil: 1, curve: 0.04, open: 0, w: 1.05 },
};
const ifKar = (a, b, u) => {
  if (u <= 0.001) return a; if (u >= 0.999) return b;
  const o = {}; for (const k of ['brow', 'browTilt', 'eye', 'pupil', 'curve', 'open', 'w']) o[k] = lerp(a[k] ?? 0, b[k] ?? 0, u);
  return o;
};
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Nesneler ═══════════════════════════
// Kupa: altın çay bardağı (ince belli), iki kulplu, tabaklı ayak. (x, y) tabanın ortası, k ölçek.
const ALTIN = '#E2B23A', ALTIN_K = '#B98A22', ALTIN_A = '#F4D77A';
function kupa(K, [x, y], k = KS) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.ell(0, -6, 46, 11, ALTIN_K, LW * 0.8);                                          // tabak
  K.rect(-9, -30, 18, 24, ALTIN_K, LW * 0.7, 3);                                     // ayak
  for (const m of [-1, 1]) {                                                         // kulplar
    ctx.beginPath(); ctx.moveTo(m * 26, -122); ctx.bezierCurveTo(m * 62, -126, m * 62, -82, m * 24, -80);
    ctx.lineCap = 'round'; ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = ALTIN; ctx.stroke();
  }
  const yol = [[-31, -136], [31, -136], [17, -94], [29, -58], [22, -34], [-22, -34], [-29, -58], [-17, -94]];
  K.poly(yol, ALTIN, LW * 0.8);
  ctx.save(); K.path(yol); ctx.clip();
  ctx.fillStyle = ALTIN_K; ctx.fillRect(12, -140, 30, 120);                         // gölge yanı
  ctx.fillStyle = ALTIN_A; ctx.fillRect(-21, -128, 7, 88);                          // düz açık şerit
  ctx.restore();
  K.poly(yol, null, LW * 0.8);
  K.rect(-32, -142, 64, 10, ALTIN_K, LW * 0.7, 4);                                   // ağız halkası
  const yz = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 13; yz.push([Math.cos(a) * r, -62 + Math.sin(a) * r]); }
  K.poly(yz, PAL.paper, 3);
  ctx.restore();
}
const kupaBel = (p, m = 0) => [p[0] + m * 21 * KS, p[1] - KUPA_TUT];   // tutuş noktası: belin solu (m = −1) / sağı (m = 1)
// Güreş masası (önden): üst yüz bandı ve ön pano (bacakları örter); iki dirsek minderi
function masa(K) {
  const [x0, x1] = TX;
  K.rect(x0 + 6, YF, x1 - x0 - 12, 1500 - YF + 4, '#9C3B33', LW);                  // ön pano
  K.rect(x0 + 30, YF + 34, x1 - x0 - 60, 1500 - YF - 70, '#B5483D', LW * 0.6, 8);
  K.poly([[x0 + 14, YB], [x1 - 14, YB], [x1, YF], [x0, YF]], PAL.woodTop, LW);
  for (const [y, a, b] of [[YB + 18, 0.08, 0.3], [YB + 38, 0.62, 0.9], [YB + 50, 0.16, 0.28]]) K.line(lerp(x0, x1, a), y, lerp(x0, x1, b), y, 3, '#B07A44');
  K.rect(x0 - 4, YF - 2, x1 - x0 + 8, 16, PAL.wood, LW, 5);
  amblem(K, (x0 + x1) / 2, 1398);
}
// Ön panodaki amblem (yazısız): hardal madalyon, iki ön kol ortada kenetlenmiş
function amblem(K, x, y) {
  const { ctx } = K;
  K.circ(x + 6, y + 8, 74, INK, 0); K.circ(x, y, 74, PAL.mustard, LW); K.circ(x, y, 58, '#E9C46A', LW * 0.6);
  ctx.save(); ctx.lineCap = 'round';
  for (const m of [-1, 1]) { H.strokeLine(ctx, [x + m * 40, y + 38], [x + m * 6, y - 16], 30, INK); H.strokeLine(ctx, [x + m * 40, y + 38], [x + m * 6, y - 16], 20, PAL.cream); }
  ctx.restore();
  K.circ(x - 6, y - 22, 17, '#E8BC98', 5); K.circ(x + 7, y - 26, 17, '#D9A27A', 5);
  for (const m of [-1, 1]) K.rect(x + m * 52 - 13, y + 26, 26, 14, '#C9524A', 4, 5);
}
const MANDAL = [292, 800];
function mandal(K, x) { K.rect(x - 9, YB - 34, 18, 52, '#8E9A93', LW * 0.6, 5); K.ell(x, YB + 18, 20, 6, '#6E7A73', LW * 0.6); K.circ(x, YB - 36, 11, '#B9C6BB', LW * 0.6); }
function minder(K, [x, y]) { K.ell(x, y + 4, 34, 11, '#8E2A2E', LW * 0.7); K.ell(x, y, 34, 11, '#C9524A', LW * 0.7); }
// Yazı tahtası, SIRTI dönük: kontrplak arka yüz, iki kuşak, tekerlekli ayak. Ön yüz (cetvel) hiç çizilmez.
function tahtaSirt(K, { x, w, y0, y1 }) {
  const ayak = (xa, xb) => { K.line(xa, y0 + 30, xb, ARKA - 8, 10, INK); K.line(xa, y0 + 30, xb, ARKA - 8, 5, PAL.woodDark); K.circ(xb, ARKA - 6, 7, '#3A3F3C', 3); };
  ayak(x - w / 2 + 14, x - w / 2 - 6); ayak(x + w / 2 - 14, x + w / 2 + 6);
  K.poly([[x - w / 2 - 12, y0 + 6], [x - w / 2 + 2, y0], [x - w / 2 + 2, y1], [x - w / 2 - 12, y1 + 6]], '#2F4A3A', LW * 0.6);   // ön yüzün kenarı (yazı görünmez)
  K.rect(x - w / 2 - 16, y1 - 2, w + 20, 12, '#7E5A36', LW * 0.6, 3);                      // tebeşir oluğu
  K.rect(x - w / 2 + 8, y1 - 8, 22, 7, PAL.paper, 2, 2);
  K.rect(x - w / 2, y0, w, y1 - y0, '#9C7448', LW * 0.7, 5);
  K.rect(x - w / 2 + 10, y0 + 10, w - 20, y1 - y0 - 20, '#A97F50', LW * 0.45, 3);
  K.line(x - w / 2 + 12, lerp(y0, y1, 0.36), x + w / 2 - 12, lerp(y0, y1, 0.36), 6, '#7E5A36');
  K.line(x - w / 2 + 12, lerp(y0, y1, 0.68), x + w / 2 - 12, lerp(y0, y1, 0.68), 6, '#7E5A36');
}
// Spor çantası ve su şişesi (zemin): (x, y) tabanın ortası, k ölçek
function canta(K, x, y, k = 1) {
  K.rect(x - 92 * k, y - 74 * k, 184 * k, 74 * k, '#3F6E8C', LW * Math.max(0.6, k), 26 * k);
  K.rect(x - 58 * k, y - 100 * k, 116 * k, 34 * k, null, 9 * k, 14 * k);
  K.line(x - 70 * k, y - 40 * k, x + 70 * k, y - 40 * k, 5 * k, '#325873');
}
function sise(K, x, y, k = 1) {
  K.rect(x - 14 * k, y - 78 * k, 28 * k, 78 * k, '#CFE3DD', 3.5 * Math.max(0.6, k), 7 * k); K.rect(x - 14 * k, y - 46 * k, 28 * k, 16 * k, PAL.teal, 0);
  K.rect(x - 8 * k, y - 92 * k, 16 * k, 15 * k, PAL.coral, 3 * Math.max(0.6, k), 3 * k);
}
// Halı ve zemindeki eşyalar (ön zemin)
function on(K) {
  const { ctx } = K;
  K.rect(-800, 1452, 2900, 520, '#7F3B33', 0); K.line(-800, 1452, 2100, 1452, LW, INK);
  K.rect(-800, 1470, 2900, 12, PAL.mustard, 0);
  ctx.save(); for (let x = -760; x < 2100; x += 150) K.poly([[x, 1570], [x + 36, 1530], [x + 72, 1570], [x + 36, 1610]], '#A3524A', 3); ctx.restore();
  canta(K, 1000, 1560); sise(K, 168, 1540); sise(K, 200, 1556);
}
// Arka sıranın önündeki eşyalar (derinlikte, küçük)
function arkaEsya(K) { canta(K, 1180, ARKA + 4, 0.6); sise(K, 70, ARKA + 2, 0.6); sise(K, 96, ARKA + 6, 0.6); }

// ═══════════════════════════ Mekân: ofisin toplantı salonu ═══════════════════════════
M.mekanEkle(SALON, {
  gen: [-700, 1900], zemin: DUVAR_DIP, dongu: ['duvar saatinin saniye kolu', 'pencerede martı', 'çay buharı'],
  capa: { masa: [545, YB] }, kadraj: { genis: GENIS, ikili: IKILI },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -800, x1: 2100, floorY: DUVAR_DIP, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, 430, 560, 230, 190, { isik, t, kayit: false });
    M.duvarSaati(K, 250, 640, 44, 16.2 + t / 3600, t);
    // yan dolap ve çay (sağ arkada; döngü: buhar)
    K.rect(1190, 980, 220, DUVAR_DIP + 8 - 980, PAL.wood, LW, 6); K.rect(1178, 964, 244, 22, PAL.woodTop, LW, 6);
    for (const [i, x] of [[0, 1238], [1, 1290]]) {
      K.ell(x, 962, 17, 4, PAL.cream, 2.5); K.poly([[x - 9, 930], [x + 9, 930], [x + 6, 944], [x + 9, 955], [x - 9, 955], [x - 6, 944]], '#C25A2E', 2.5);
      H.buhar(K, x, 922, t + i * 0.8, { k: 0.38, n: 2, ara: 10, boy: 50 });
    }
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.09, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
    // n0 (kanca): itişme → Necmi bileği masaya yatırır → kupa
    vur0: 0.3, vur: T('n0:1') - 0.08, birak: T('n0:2') - 0.14, kupa: T('n0:3') + 0.02,
    // h1 (geniş plân, sonra Hikmet)
    genis: T('h1') - 0.05, sekiz: T('h1'), herkes: T('h1:2'), gures: T('h1:6'), bere: T('h1:7'),
    hikKes: T('h1:9') - 0.06, kazandim: T('h1:13'),
    // h2 (ikili)
    h2: T('h2') - 0.08, biri: T('h2:4'), seni: T('h2:7'), yenmis: T('h2:10'),
    // d1 (Defne ve tahta)
    d1: T('d1') - 0.08, cetvel: T('d1'), bu: T('d1:3'), blof: T('d1:5'),
    // h3 (Hikmet)
    h3: T('h3') - 0.08, bilmiyorum: T('h3:2'), var: T('h3:4'),
    sayac: cd0 - 0.05, n1: T('n1') - 0.1, maclari: T('n1:2'), sayalim: T('n1:4'), n1s: T('n1>'),
  };
  const film = H.sahneler([
    { id: 'kanca', plan: 'ikili', t0: 0, cam: [[0, ...IKILI], [tm.genis - 0.3, 1.82, 545, 1122]] },
    { id: 'genis', plan: 'salon', t0: tm.genis, cam: [[0, ...GENIS], [tm.hikKes - 0.1, 1.06, 600, 1121]] },
    { id: 'kupa', plan: 'ikili', t0: tm.hikKes, cam: [[0, 1.6, 562, 1108], [tm.h2 - 0.1, 1.62, 562, 1106]] },
    { id: 'ikili', plan: 'ikili', t0: tm.h2, cam: [[0, ...IKILI], [tm.d1 - 0.1, 1.82, 547, 1122]] },
    { id: 'defne', plan: 'defne', t0: tm.d1, cam: [[0, ...DEFNE], [tm.h3 - 0.1, 2.22, 964, 942]] },
    { id: 'hikmet', plan: 'ikili', t0: tm.h3, cam: [[0, ...HIKMET], [tm.sayac - 0.1, 1.82, 522, 1122]] },
    { id: 'sayac', plan: 'ikili', t0: tm.sayac, cam: [[0, ...SAYAC]] },          // doğrusal itme draw'daki kamera() ile
    { id: 'ipucu', plan: 'defne', t0: tm.n1, cam: [[0, 2.1, 956, 946], [tm.buldum - 0.1, 2.12, 956, 944]] },
    { id: 'buldum', plan: 'defne', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 2.0, 920, 930]] },
    { id: 'cevap', plan: 'salon', t0: tm.cevap, cam: [[0, ...GENIS]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // Altyazı çizelgesi: n1 son repliktir (cevapsız kesim); balonu "Buldum!"a kadar kalır
  const kes = { n0: tm.genis, h2: tm.d1, d1: tm.h3, h3: tm.sayac };                      // balon kesme karesinde sönmüş olsun (öbür plâna taşmasın)
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.05 } : kes[l.id] ? { ...l, t1: Math.min(l.t1, kes[l.id] - 0.31) } : l) };
  return { tm, film, tlA };
}

// ═══════════════════════════ Durumlar ═══════════════════════════
// Bilek güreşi (önden): Hikmet'in dirseği minderde sabit, ön kolu açıyla döner (α: dikeyden, + masanın ortasına doğru);
// Necmi'nin eli Hikmet'in elini kavrar, Necmi'nin kolu iki kemikli çözümle o ele uzanır (dirsek aşağıda).
const ALFA0 = 12, ALFA1 = -93;
function ik2(S, Hd, u, l) {
  const dx = Hd[0] - S[0], dy = Hd[1] - S[1], d0 = Math.hypot(dx, dy) || 1, d = Math.min(Math.max(d0, Math.abs(u - l) + 1), u + l - 0.5);
  const a = (d * d + u * u - l * l) / (2 * d), h = Math.sqrt(Math.max(0, u * u - a * a)), ux = dx / d0, uy = dy / d0;
  const A = [S[0] + ux * a - uy * h, S[1] + uy * a + ux * h], B = [S[0] + ux * a + uy * h, S[1] + uy * a - ux * h];
  return A[1] > B[1] ? A : B;                                                               // dirsek aşağıdaki çözüm
}
function kolAci(key, p, side, E, Hd) {
  const S = H.shoulder(key, p, side), a1 = Math.atan2(E[0] - S[0], E[1] - S[1]) / D2R, a2 = Math.atan2(Hd[0] - E[0], Hd[1] - E[1]) / D2R;
  p[side === 'L' ? 'armL' : 'armR'] = side === 'R' ? { sh: a1, el: a2 - a1 } : { sh: -a1, el: a1 - a2 };
}
function gurAt(tm, t, hp, np) {
  const cH = H.CARDS.hikmet.arm, cN = H.CARDS.necmi.arm, uH = cH.upper * hp.s, lH = cH.lower * hp.s, uN = cN.upper * np.s, lN = cN.lower * np.s;
  const SH = H.shoulder('hikmet', hp, 'R'), SN = H.shoulder('necmi', np, 'L');
  const EH = [SH[0] + uH * Math.sin(24 * D2R), SH[1] + uH * Math.cos(24 * D2R)];   // üst kol dik, dirsek minderde
  let a;
  if (t < tm.vur0) a = ALFA0 + 5 * ease.state(seg(t, 0, tm.vur0)) + 1.5 * Math.sin(TAU * 2.6 * t);
  else { const u = seg(t, tm.vur0, tm.vur - tm.vur0); a = lerp(ALFA0 + 5, ALFA1, u * u); }        // hızlanarak iner, temasta durur
  const HH = [EH[0] + lH * Math.sin(a * D2R), EH[1] - lH * Math.cos(a * D2R)];
  const HN = [HH[0] + 9, HH[1] - 7];
  return { EH, HH, HN, EN: ik2(SN, HN, uN, lN) };
}
// Kupanın tabanı (dünya) ve kimin tuttuğu
function kupaAt(tm, t) {
  const tN = tm.kupa, tH = tm.kupa + 0.32, tC = tm.kupa + 0.7;                                // Necmi alır, Hikmet yakalar, Hikmet çeker
  if (t < tN) return { p: KUPA_MASA, N: t > tN - 0.06 };
  if (t < tC) { const k = ease.enter(seg(t, tN, 0.34)); return { p: [KUPA_MASA[0] - 6 * k, KUPA_MASA[1]], N: true, H: t >= tH }; }
  const pA = [KUPA_MASA[0] - 6, KUPA_MASA[1]];
  if (t < tm.hikKes) { const u = ease.state(seg(t, tC, 0.6)); return { p: H.yay(pA, KUPA_HIK, u, 26), H: true }; }
  // "kazandım": kaldırır (başının yanında); kesmeden hemen önce sol aşağıya, kendi önüne indirir (Necmi'nin yüzünden uzağa)
  const YUK = [584, 1078];
  if (t < tm.h2 - 0.3) { const u = ease.enter(seg(t, tm.kazandim - 0.12, 0.42)); return { p: kar(KUPA_HIK, YUK, u), H: true }; }
  if (t < tm.sayac) { const u = ease.state(seg(t, tm.h2 - 0.3, 0.6)); return { p: kar(YUK, KUPA_HIK, u), H: true }; }
  // sayaç: Hikmet kupayı ortaya iter; Necmi tutar; çekişme (kupa masada sağa sola kayar, kazanan yok)
  const { cd0 } = tm, xs = [[cd0 + 1.4, 512], [cd0 + 2.6, 584], [cd0 + 4.2, 506], [cd0 + 5.8, 590], [cd0 + 7.4, 514], [cd0 + 8.9, 576]];
  const u0 = ease.state(seg(t, cd0 - 0.05, 0.6));
  let x = lerp(KUPA_HIK[0], KUPA_ORTA[0], u0); for (const [a, v] of xs) x = lerp(x, v, ease.state(seg(t, a, 0.85)));
  return { p: [x, lerp(KUPA_HIK[1], KUPA_ORTA[1], u0)], H: true, N: t >= cd0 + 0.9 };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında
  drift: 0.008,
  split: { h1: 7, h2: 7 },
  kamera(cam, t, B) {
    if (B.sc.id !== 'sayac') return;   // sayaç: masaya doğrusal itme
    const { cd0, cd } = S.tm, u = clamp01((t - cd0) / (cd - cd0 + 0.3));
    Object.assign(cam, { zoom: Math.exp(lerp(Math.log(SAYAC[0]), Math.log(1.84), u)), cx: SAYAC[1], cy: SAYAC[2] - 8 * u });
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (globalThis.__dbg) H.guvenliAlan(K);
  },
});

// "SEN DE DÜŞÜN!" sayacı (070'deki düzen): perde yok; daire solda, başlık ve paylaşım hapı sağında, alt bantta.
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
  const plan = B.sc.plan;
  M.mekanCiz(K, SALON, 'arka', t);
  if (plan === 'defne') { tahtaSirt(K, TAHTA); arkaEsya(K); arkaSira(K, t, tl, S, B, new Set(['defne'])); on(K); return; }
  if (plan === 'salon') { tahtaSirt(K, TAHTA); arkaEsya(K); arkaSira(K, t, tl, S, B, null); }
  on(K);
  oturanlar(K, t, tl, S, B);
}

// Arka sıra: ayakta, önden, duvar dibinde. yalniz: yalnız bu kişiler çizilir (yakın plân)
function arkaSira(K, t, tl, S, B, yalniz) {
  const { tm } = S, id = B.sc.id;
  ARKA_SIRA.forEach(([key, x], i) => {
    if (yalniz && !yalniz.has(key)) return;
    const s = sArka(key), def = key === 'defne';
    // bakış: Hikmet'e (masaya); "herkes birbiriyle"de yanındakine; "Sekiz"de sırayla baş sallama
    let look = [lerp(0.5, -0.5, i / 5), 0.45];
    const kom = i % 2 ? -1 : 1, w = pIn(t, tm.herkes + i * 0.06, tm.gures + 0.35, 0.3);
    look = kar(look, [0.75 * kom, 0.1], w);
    let expr = def ? (B.sc.plan === 'defne' ? IF.supheK : IF.suphe) : IF.notr;
    const konus = def ? H.talkAt(tl, 'defne', t) : 0;                                       // küçük ölçekte ağız seçilsin: konuşurken ağız biraz daha açılır
    if (def && B.sc.plan === 'defne') {
      look = [0.55, 0.5];                                                                   // tahtadan sonra masaya (Hikmet'e) bakar
      look = kar(look, [0.7, 0.05], pIn(t, tm.cetvel - 0.1, tm.bu, 0.25));
      if (id === 'ipucu') { look = [-0.55, 0.45]; expr = IF.notr; }
      if (id === 'buldum') { look = [0, 0]; expr = IF.gulus; }
    }
    if (konus > 0) expr = { ...expr, open: 0.4 * konus, curve: Math.max(expr.curve, 0.15), w: Math.max(expr.w, 1.1) };
    const p = H.kisi(key, { x, y: ARKA, s, expr, ...POZ.dur, head: { tilt: (i % 3 - 1) * 2, look } });
    H.onayla(p, t, tm.sekiz + 0.07 * i, 1, 0.34);
    if (def) p.y -= H.buldumHop(t, tm.buldum, 40);
    const o = {};
    // alkış ("güreşti"): iki el göğüs önünde (eşit, hepsi birden)
    const wA = pIn(t, tm.gures + 0.05 * i, tm.bere + 0.35, 0.22);
    if (wA > 0.01 && !def) {
      const n = H.eklem(key, p, 'neck'), ac = 0.09 * s * (0.5 + 0.5 * Math.cos(TAU * 3.2 * (t - tm.gures)));
      o.L = [[x - ac - 0.02 * s, n[1] + 0.42 * s], wA, 'A']; o.R = [[x + ac + 0.02 * s, n[1] + 0.42 * s], wA, 'A'];
    }
    // Defne tahtaya dokunur ("Cetvele"), ipucunda iki kez vurur ("sayalım")
    let dok = 0;
    if (def && B.sc.plan === 'defne') {
      dok = id === 'defne' ? pIn(t, tm.cetvel - 0.25, tm.blof, 0.28) : id === 'ipucu' ? pIn(t, tm.maclari - 0.2, tm.n1s + 0.2, 0.28) : 0;
      const vur = id === 'ipucu' ? H.nabiz(t, tm.sayalim, 0.2) + H.nabiz(t, tm.sayalim + 0.24, 0.2) : 0;
      const wD = id === 'ipucu' ? W(t, tm.n1s + 0.3, 0.4) : 0;                         // ipucundan sonra eli çenesinde düşünür
      if (wD > 0.001) { p.armR = { sh: lerp(p.armR.sh, 18, wD), el: lerp(p.armR.el, -168, wD) }; p.expr = ifKar(p.expr, IF.dusun, wD); p.head = { ...p.head, look: kar(p.head.look, [0.45, -0.35], wD) }; }
      if (dok > 0.01) o.R = [[TAHTA.x - TAHTA.w / 2 - 4 + 10 * vur, lerp(930, 940, vur)], dok, 'A'];
      if (id === 'buldum') o.R = [H.elYeri(key, p, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B'];
    }
    if (def) o.heads = B.heads;
    const a = oyna(K, t, def ? tl : null, key, p, o);
    if (def && dok > 0.5) a.tut('R');
    if (def && id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem(key, p, 'head'), { son: tm.proof, k: s / 245 });
  });
}

// Hikmet ve Necmi: masanın arkasında, önden. Bilek güreşi, kupa, işaret.
function oturanlar(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  const kp = kupaAt(tm, t);
  const gures = t < tm.birak + 0.3;
  // ——— ifadeler ve bakış ———
  let hE = IF.zor, nE = IF.zorK, hL = [0.6, 0.15], nL = [-0.6, 0.15], hT = 0, nT = 0;
  if (t >= tm.vur) { hE = ifKar(IF.zor, IF.suphe, W(t, tm.vur, 0.2)); nE = IF.kurum; hL = [0.5, 0.35]; nL = [-0.5, 0.1]; }
  if (t >= tm.kupa - 0.3) { hL = [0.6, 0.4]; nL = [-0.3, 0.45]; }
  if (t >= tm.genis) { hE = IF.kurum; nE = IF.suphe; hL = [0.15, 0.05]; nL = [-0.6, 0.15]; }
  if (t >= tm.herkes && t < tm.gures + 0.35) { hL = [0.6, 0.15]; nL = [-0.6, 0.15]; }
  if (t >= tm.hikKes) { hE = IF.kurum; hL = [0.25, -0.1]; nE = IF.suphe; nL = [-0.6, 0.1]; }
  if (t >= tm.h2) { hE = IF.notr; hL = [0.65, 0.1]; nE = IF.notr; nL = [-0.6, 0.1]; }
  if (t >= tm.seni) nE = IF.merak;
  if (t >= tm.h3) { hE = IF.notr; hL = [0.1, -0.2]; nE = IF.suphe; nL = [-0.6, 0.1]; }
  if (t >= tm.var - 0.1) hL = [0.2, 0.05];
  if (t >= tm.sayac) { hE = IF.zor; nE = IF.zor; hL = [0.55, 0.3]; nL = [-0.55, 0.3]; }
  hT = (hL[0] > 0 ? 3 : 0); nT = (nL[0] < 0 ? -3 : 0);
  const hp = H.kisi('hikmet', { x: HIK_X, y: yOf('hikmet'), s: sOf('hikmet'), expr: hE, ...POZ.dur, head: { tilt: hT, look: hL } });
  const np = H.kisi('necmi', { x: NEC_X, y: yOf('necmi'), s: sOf('necmi'), expr: nE, ...POZ.dur, head: { tilt: nT, look: nL } });
  // güreşte gövdeler ortaya eğilir; Necmi bastırırken Hikmet'e doğru kayar
  const bas = gures ? 1 : 1 - W(t, tm.birak + 0.3, 0.4);
  const kay = ease.state(seg(t, tm.vur0, tm.vur - tm.vur0)) * bas;
  np.x -= 30 * kay; np.lean = (-3 - 6 * kay) * bas; hp.lean = (3 - 4 * kay) * bas;
  if (id === 'sayac') { const d = (kp.p[0] - KUPA_ORTA[0]) / 45; hp.lean = -4 * d; np.lean = -4 * d; hp.x += 6 * d; np.x += 6 * d; }
  if (id === 'kupa') { const w = W(t, tm.hikKes + 0.3, 0.4); np.lean = 16 * w; np.x += 36 * w; }                        // Necmi küskün, geri yaslanır                                         // Necmi küskün, geri çekilir
  if (id === 'genis' || id === 'cevap') H.onayla(hp, t, tm.sekiz + 0.07 * 6, 1, 0.34), H.onayla(np, t, tm.sekiz + 0.07 * 7, 1, 0.34);
  // "Berabere yok": Hikmet başını iki yana sallar
  { const e = pIn(t, tm.bere - 0.05, tm.bere + 0.65, 0.12), s = Math.sin(TAU * 2.2 * (t - tm.bere)); if (e > 0) hp.head = { ...hp.head, look: [hp.head.look[0] + 0.4 * e * s, hp.head.look[1]] }; }
  if (id === 'hikmet') { H.omuzSilk(hp, t, tm.bilmiyorum - 0.05, 0.35); H.onayla(hp, t, tm.var - 0.05, 1, 0.36); }
  // ——— eller ———
  const hO = { heads }, nO = { heads };
  const hRest = [HIK_X + 92, YB + 14], hRestL = [HIK_X - 96, YB + 18], nRest = [NEC_X - 84, YB + 14], nRestR = [NEC_X + 88, YB + 18];
  const tutak = t < tm.birak + 0.2;                                                     // güreşte boştaki eller masanın mandallarını tutar
  hO.L = [tutak ? [MANDAL[0], YB - 24] : hRestL, 1, 'A']; nO.R = [tutak ? [MANDAL[1], YB - 24] : nRestR, 1, 'A'];
  let hR = hRest, nL2 = nRest, hW = 1, nW = 1, hD = 'A', nD = 'A';
  let hTut = false, nTutL = false, nTutR = false, hPar = null, hIsa = null;
  if (t < tm.kupa + 0.05) {                                                               // bilek güreşi: kollar açıyla kurulur
    const g = gurAt(tm, t, hp, np), birak = W(t, tm.birak, 0.3);
    kolAci('hikmet', hp, 'R', g.EH, g.HH); kolAci('necmi', np, 'L', g.EN, g.HN);
    hW = 0; nL2 = nRest; nW = birak; nD = 'A';
    hTut = true; nTutL = birak < 0.5;
  }
  // kupa: Necmi sağ eliyle alır, Hikmet sağ eliyle yakalar ve çeker
  if (t >= tm.kupa - 0.3 && t < tm.genis) {
    const wN = pIn(t, tm.kupa - 0.3, tm.kupa + 0.72, 0.28);
    if (wN > 0.01) { nO.R = [kar(nRestR, kupaBel(kp.p, 1), wN), 1, 'A']; nTutR = wN > 0.6; }
    const wH = W(t, tm.kupa + 0.02, 0.3);
    const hedef = kar(gurAt(tm, tm.vur + 0.01, hp, np).HH, kupaBel(kp.p, -1), wH), cH = H.CARDS.hikmet.arm;   // el masadan kupaya (iki kemik, dirsek aşağıda)
    kolAci('hikmet', hp, 'R', ik2(H.shoulder('hikmet', hp, 'R'), hedef, cH.upper * hp.s, cH.lower * hp.s), hedef); hW = 0; hTut = true;
  }
  if (t >= tm.genis && t < tm.h2 + 0.6) { hR = kupaBel(kp.p, -1); hD = 'B'; hTut = true; }
  if (t >= tm.h2 + 0.6 && t < tm.h3) {                                                   // "biri" parmak, "seni" Necmi'yi gösterir
    const wB = 0, wS = pIn(t, tm.seni - 0.22, tm.h3 - 0.1, 0.26);
    const sh = H.shoulder('hikmet', hp, 'R');
    hR = kar(kar(hRest, [sh[0] + 22, sh[1] + 8], wB), [sh[0] + 96, sh[1] + 4], wS); hD = 'A';
    if (wS > 0.5) hIsa = H.eklem('necmi', np, 'neck').map((v, k) => v + (k ? 0.35 * np.s : 0));
  }
  if (t >= tm.h3 && t < tm.sayac) { hR = kupaBel(kp.p, -1); hD = 'A'; hTut = true; }
  if (t >= tm.sayac) {
    hR = kupaBel(kp.p, -1); hD = 'A'; hTut = true;
    const wN = W(t, tm.cd0 + 0.6, 0.3); nL2 = kar(nRest, kupaBel(kp.p, 1), wN); nD = 'A'; nTutL = wN > 0.6;
  }
  hO.R = [hR, hW, hD]; nO.L = [nL2, nW, nD];
  if (id === 'hikmet') { const w = H.omuzSilk({ armL: { sh: 0, el: 0 }, armR: { sh: 0, el: 0 }, head: {} }, t, tm.bilmiyorum - 0.05, 0.35).armR.sh / 24; if (w > 0.01) { hO.R = [hR, 1 - w, hD]; hO.L = [hRestL, 1 - w, 'A']; hTut = hTut && w < 0.3; } }
  const { ctx } = K; ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 10000, 5000 + 1480); ctx.clip();   // masanın altındaki ayaklar çizilmez
  const hc = oyna(K, t, tl, 'hikmet', hp, hO);
  const nc = oyna(K, t, tl, 'necmi', np, nO);
  ctx.restore();
  masa(K);
  for (const x of MANDAL) mandal(K, x);
  if (gures || t < tm.genis) { minder(K, [505, YB + 20]); minder(K, [585, YB + 20]); }
  kupa(K, kp.p);
  // masanın üstüne düşen kollar masadan sonra yeniden çizilir
  kolUst(K, 'hikmet', hp, 'R'); kolUst(K, 'necmi', np, 'L'); kolUst(K, 'hikmet', hp, 'L'); kolUst(K, 'necmi', np, 'R');
  if (hTut) hc.tut('R'); else if (hPar) hc.parmak(...hPar); else if (hIsa) hc.isaret('R', hIsa); else hc.tut('R');
  hc.tut('L'); nc.tut('R');
  if (t < tm.kupa + 0.05 && nTutL) kenetCiz(K, hc.handR, nc.handL, hp.s, np.s); else nc.tut('L');
  if (globalThis.__dbg) for (const q of [H.eklem('hikmet', hp, 'elR'), H.eklem('necmi', np, 'elL')]) K.circ(q[0], q[1], 6, '#f0f', 0);
}
// Kenetlenmiş eller: Hikmet'in yumruğu, Necmi'nin eli üstünde; Necmi'nin parmakları Hikmet'in elini sarar, Hikmet'in başparmağı üstte
function kenetCiz(K, hH, hN, sH, sN) {
  const { ctx } = K, cH = H.CARDS.hikmet, cN = H.CARDS.necmi, rH = cH.arm.hand * sH * 1.22, rN = cN.arm.hand * sN * 1.22;
  K.circ(hH[0], hH[1], rH, cH.skin, cH.line * sH);
  K.circ(hN[0], hN[1], rN, cN.skin, cN.line * sN);
  const yon = H.unit(hN, hH), dik = [-yon[1], yon[0]], lw = cN.line * sN * 0.75, w = rN * 0.42;
  ctx.save(); ctx.lineCap = 'round';
  for (const k of [-1, 0, 1]) {                                                             // Necmi'nin üç parmağı Hikmet'in yumruğunun üstünden
    const a = [hN[0] + yon[0] * rN * 0.3 + dik[0] * k * w * 1.05, hN[1] + yon[1] * rN * 0.3 + dik[1] * k * w * 1.05];
    const b = [hH[0] + yon[0] * rH * 0.35 + dik[0] * k * w * 1.05, hH[1] + yon[1] * rH * 0.35 + dik[1] * k * w * 1.05];
    H.strokeLine(ctx, a, b, w + lw * 2, INK); H.strokeLine(ctx, a, b, w, cN.skin);
  }
  const ba = [hH[0] - yon[0] * rH * 0.2 - dik[0] * rH * 0.55, hH[1] - yon[1] * rH * 0.2 - dik[1] * rH * 0.55], bb = [hN[0] - dik[0] * rN * 0.75, hN[1] - dik[1] * rN * 0.75];
  H.strokeLine(ctx, ba, bb, w + lw * 2, INK); H.strokeLine(ctx, ba, bb, w, cH.skin);   // Hikmet'in başparmağı
  ctx.restore();
}
// Masanın üstüne uzanan kol (önden): masanın üst yüzünün altında kalan kısmını masadan sonra yeniden çizer
function kolUst(K, key, p, side) {
  const { ctx } = K, c = H.CARDS[key], s = p.s, j = n => H.eklem(key, p, n + side), sh = j('sh'), el = j('el'), ha = j('hand');
  ctx.save(); ctx.beginPath(); ctx.rect(-5000, YB - 2, 10000, 3000); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = (c.arm.w + c.line * 2) * s; ctx.stroke();
  ctx.strokeStyle = c.arm.color; ctx.lineWidth = c.arm.w * s; ctx.stroke();
  ctx.restore();
}
