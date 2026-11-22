// Bölüm 67 · BEŞİ BİRDEN (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_067_v5.md). Mekanizma: ilk gidene bak.
// Logline: Hikmet'in doğum gününde odasına beş eski arkadaşı uğrar; beşini bir arada göremez. Defne beşini de arar: hangi
// ikisi seçilirse seçilsin, o ikisi bu odada karşılaşmıştır. Hikmet'e göre ikişer ikişer karşılaşma beşinin birden burada
// olduğunu göstermez; Defne beşinin aynı anda burada olduğunu, o anı da söyleyebileceğini söyler.
// Akılda kalacak tek şey: odadan ilk çıkana bak.
// Görsel metafor: tahta. Beş ad çember biçiminde yazılı; her iki adın arasında bir çizgi. On çizgi tamamlanınca yıldızlı beşgen çıkar.
// Sızıntı yasağı: zaman çizelgesi, saat sırası, geliş ya da gidiş sırası gösterilmez. Beş ad aynı punto ve aynı kalınlıkta,
// on çizgi aynı renk ve aynı kalınlıkta. Hediyeler sıraya dizilmez. Geri dönüşteki tek misafir adsızdır; kadrajda başka
// misafir yoktur; tahta o sırada boştur.
// Tahta plânı: kamera tahtadadır; Defne kadrajın solundadır, kalemi tutan kolu sol alttan girer (kameraya yakın kol).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180;

// ═══════════════════════════ Tahta (şartlar: değişmez) ═══════════════════════════
// Beşgenin köşeleri tepeden başlayıp saat yönünde. Adların yeri yalnız genişliğe göre seçildi (en uzun ad tepede).
const ADLAR = ['HALİL', 'SUNA', 'OYA', 'ALİ', 'CEM'];
// On çift: önce beş kenar (çevre boyunca), sonra beş köşegen (yıldız). Her çift [başlangıç, bitiş] köşesidir.
const CIFT = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 4], [0, 2], [0, 3], [1, 3], [2, 4]];
// Sayaçta parmağın izlediği sıra ve yön (aynı on çift). Kesmelerde parmak bir çizginin ortasındadır; son çizgi tepede biter ve el hemen çekilir.
const IZ_SIRA = [[1, 2], [2, 3], [3, 4], [4, 0], [0, 1], [1, 4], [0, 2], [2, 4], [1, 3], [3, 0]];
(function denetle() {
  const bek = ['ALİ', 'SUNA', 'CEM', 'OYA', 'HALİL'];
  if (ADLAR.length !== 5 || bek.some(a => !ADLAR.includes(a))) throw new Error('b067: beş ad eksik ya da yanlış');
  const gor = new Set(CIFT.map(([i, j]) => i < j ? i * 5 + j : j * 5 + i));
  if (CIFT.length !== 10 || gor.size !== 10 || CIFT.some(([i, j]) => i === j)) throw new Error('b067: on çiftin her biri tam bir kez çizilmeli');
  const izl = new Set(IZ_SIRA.map(([i, j]) => i < j ? i * 5 + j : j * 5 + i));
  if (IZ_SIRA.length !== 10 || izl.size !== 10 || [...izl].some(k => !gor.has(k))) throw new Error('b067: parmak on çizginin her birini tam bir kez izlemeli');
})();
const TAHTA = { x: 56, y: 630, w: 520, h: 400 };
const TC = [314, 835], TR = 160, AD_BOY = 47, OVAL_RY = 36;
const KOSE = ADLAR.map((_, i) => { const a = (-90 + 72 * i) * D2R; return [TC[0] + TR * Math.cos(a), TC[1] + TR * Math.sin(a)]; });
const MAVI = '#27447E', BEYAZ = '#FBF8EF';

// ═══════════════════════════ Ölçüler ═══════════════════════════
const ODA = 'b067_oda', MIS = 'b067_misafir', MIS_S = 244;
const D_X = -62, H_X = 790, N_X = 1195;
const MASA = { x0: 586, x1: 1215, y: 1200 };
const KAPI = { x: -485, y: 710, w: 250, h: 790 };
const KOLTUK_X = 100, M_DUR = 200;                     // misafir koltuğu (kalçanın x'i) ve önünde durulan yer (ayaklar yerinde kalır)
const PASTA = [636, 1200];
// hediyeler: [taban ortası]. Yığın (kare 0) ve h3 düzeni (üçü Hikmet'in önünde, ikisi onların arkasında üst üste; sıra hâlinde değil)
const YIGIN = [[720, 1200], [805, 1200], [890, 1200], [762, 1138], [848, 1138]];
const EV = [[720, 1200], [900, 1200], [1005, 1200], [952, 1176], [955, 1114]];
const BULUS_L = [747, 1122], BULUS_R = [833, 1122];    // iki paketin göğüs önünde yan yana geldiği yer
const PARK = [22, 1012];                               // tahta plânında elin beklediği yer (tahtanın solu)
const PIVOT = [-520, 1160], KOL_S = 300;               // kameraya yakın kol: dirsek kadraj dışında, soldan girer
const GECIT_X = 150, GECIT_UST = 875, GECIT_ALT = 1052; // kolun adların üstüne binmeden geçtiği iki boşluk: CEM ile ALİ'nin arası, ALİ'nin altı
const CIZ_D = 0.44, IZ_D = 0.6;                        // bir çizginin çizilme ve parmakla izlenme süresi
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// Ağzı kapalı ifadeler: konuşmayan karakterin ağzı açık kalınca replik ona aitmiş gibi okunuyor (064'ün dersi)
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 0.85, pupil: 1, curve: 0.6, open: 0, w: 1.15 };
const BURUK = { brow: -0.01, browTilt: -0.35, eye: 0.85, pupil: 1, curve: -0.3, open: 0, w: 0.95 };
const NGULUS = { brow: 0.03, browTilt: -0.1, eye: 0.9, pupil: 1, curve: 0.38, open: 0, w: 1.1 };          // Necmi'nin gülüşü (yanak kızarmadan)
const CANLI = { brow: 0.06, browTilt: -0.05, eye: 1.3, pupil: 1, curve: 0.2, open: 0, w: 1 };            // Necmi'nin yakın plânı: göz kapakları ağır, gözü açık görünsün
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };          // düşünür ama gözü açık (yarı kapalı göz sıkılmış gibi okunuyordu)
// hangi sahnede kim çizilir (H Hikmet, D Defne, N Necmi). Tahta plânlarında Defne'nin yalnız kolu görünür.
const GOR = { kanca: 'DH', hikmet: 'HN', defne: 'D', hikmet2: 'HN', defne2: 'D', say2: 'HN', necmi: 'N', ipucu: 'D', buldum: 'D', cevap: 'D', cta: 'D' };
const TAHTA_PLANI = ['tahta', 'sayac', 'say3'];
// kadrajlar
const tahtaKam = z => ({ zoom: z, cx: 675 - 540 / z, cy: 820 + 110 / z });          // tahta plânı: sağ kenar x = 675 (Hikmet kadraj dışında)
const ikiliKam = z => ({ zoom: z, cx: 670 - 540 / z, cy: 630 + 430 / z });          // Defne + tahta: tahtanın üstü kartın altında
const ikili = z => [z, 670 - 540 / z, 630 + 430 / z];
const masaKam = (z, cy) => [z, 584 + 540 / z, cy];                                   // Hikmet + Necmi: sol kenar x = 584 (tahta kadraj dışında)

// ═══════════════════════════ Figüran (bölüme özgü, b067_ önekli) ═══════════════════════════
// Kadro kartlarına dokunulmaz; misafir Hikmet'in iskeletinden türetilir. Adı yoktur, kaçıncı geldiği belli değildir.
if (!H.CARDS[MIS]) {
  const b = H.CARDS.hikmet;
  H.CARDS[MIS] = {
    ...b, key: MIS, name: 'Misafir', seed: 671,
    torso: { ...b.torso, belly: 0.1, color: '#5E6B73', shade: '#4B565D' },
    arm: { ...b.arm, color: '#5E6B73', shade: '#4B565D' },
    leg: { ...b.leg, color: '#3B3F45', shade: '#2E3237' },
    skin: '#E8BC98', skinShade: '#CFA07C', hair: '#B9B2A8', tie: '#2F7F7A',
    features: ['suit', 'tie', 'hairSlick', 'mustacheThick', 'glassesRect'],
  };
}
const KOLTUK = H.oturak(MIS, H.otur(MIS, { x: KOLTUK_X, facing: 1, s: MIS_S }));   // { y: oturağın üstü, x, diz }

// ═══════════════════════════ Tahta ═══════════════════════════
let TD = null;
function tahtaDuzen(K) {                 // oval genişlikleri yazıdan ölçülür; çizgiler ovalin kenarında başlar ve biter
  if (TD) return TD;
  const { ctx } = K; ctx.font = `800 ${AD_BOY}px Rubik`;
  const rx = ADLAR.map(s => ctx.measureText(s).width / 2 + 24);
  const kenar = (p, q, r) => { const d = H.unit(p, q), s = 1 / Math.hypot(d[0] / r, d[1] / OVAL_RY) + 7; return [p[0] + d[0] * s, p[1] + d[1] * s]; };
  const yol = L => L.map(([i, j]) => [kenar(KOSE[i], KOSE[j], rx[i]), kenar(KOSE[j], KOSE[i], rx[j])]);
  TD = { rx, cizgi: yol(CIFT), iz: yol(IZ_SIRA) };
  return TD;
}
// çizgi i'nin çizilmiş oranı (0..1): kenarlar Defne telefondayken (geri dönüş sırasında) çizildi; köşegenler d1'de çizilir
const cizU = (S, i, t) => i < 5 ? (t >= S.tm.defne ? 1 : 0) : ease.state(seg(t, S.tm.ciz[i - 5], CIZ_D));
function tahtaCiz(K, t, S, bos) {
  const { ctx } = K, { x, y, w, h } = TAHTA;
  K.rect(x + 9, y + 11, w, h, INK, 0, 12);
  K.rect(x, y, w, h, PAL.metal, LW, 12);
  K.rect(x + 11, y + 11, w - 22, h - 22, BEYAZ, LW * 0.5, 6);
  K.rect(x + w * 0.28, y + h - 2, w * 0.44, 18, PAL.metal, LW * 0.7, 5);            // kalem rafı
  K.rect(x + w * 0.33, y + h - 16, 58, 16, '#E9E4D8', LW * 0.5, 4);                 // silgi
  K.rect(x + w * 0.52, y + h - 12, 64, 11, MAVI, LW * 0.5, 5);                      // yedek kalem (aynı renk)
  if (bos) return;
  const d = tahtaDuzen(K);
  ctx.save(); ctx.lineCap = 'round';
  d.cizgi.forEach(([a, b], i) => { const u = cizU(S, i, t); if (u > 0.001) H.strokeLine(ctx, a, kar(a, b, u), 7, MAVI); });
  ADLAR.forEach((ad, i) => {
    ctx.beginPath(); ctx.ellipse(KOSE[i][0], KOSE[i][1], d.rx[i], OVAL_RY, 0, 0, Math.PI * 2); ctx.lineWidth = 5; ctx.strokeStyle = MAVI; ctx.stroke();
    K.text(ad, KOSE[i][0], KOSE[i][1] + AD_BOY * 0.355, AD_BOY, INK, 800);
  });
  ctx.restore();
}
// Kalemin ucu (d1): bekleme yerinden çıkar, beş köşegeni sırayla çizer, bekleme yerine döner
function kalemAt(S, t, d) {
  let p = PARK; const c = S.tm.ciz;
  for (let k = 0; k < 5; k++) {
    const [a, b] = d.cizgi[5 + k], u1 = ease.state(seg(t, c[k] - 0.23, 0.21)); if (u1 <= 0) break;
    p = kar(kar(p, a, u1), b, ease.state(seg(t, c[k], CIZ_D)));
  }
  return kar(p, PARK, W(t, c[4] + CIZ_D + 0.1, 0.3));
}
// Parmağın ucu (sayaç): on çizgiyi sırayla, eşit sürede izler (hiçbirinde ötekinden uzun durmaz)
function parmakAt(S, t, d) {
  let p = PARK; const z = S.tm.iz;
  for (let k = 0; k < 10; k++) {
    const [a, b] = d.iz[k], u1 = ease.state(seg(t, z[k] - 0.2, 0.18)); if (u1 <= 0) break;
    p = kar(kar(p, a, u1), b, ease.state(seg(t, z[k], IZ_D)));
  }
  return kar(p, PARK, W(t, z[9] + IZ_D + 0.06, 0.28));   // son çizgiden sonra el tahtadan çekilir: kesmede hiçbir adın yanında beklemez
}
// Kameraya yakın kol (Defne): mercan ceket kolu sol alttan girer; el uca değer. mod: 'kalem' | 'parmak'
function kolCiz(K, uc, mod) {
  const { ctx } = K, C = H.CARDS.defne, el = mod === 'kalem' ? [uc[0] - 44, uc[1] + 51] : [uc[0] - 50, uc[1] + 55];
  // kolun yönü: el tahtanın içindeyken kol, adların arasındaki boşluktan geçecek biçimde döner (dirsek yer değiştirir)
  const G = [GECIT_X, lerp(GECIT_UST, GECIT_ALT, ease.state(clamp01((el[1] - 905) / 90)))], w = clamp01((el[0] - 175) / 110);
  const d1 = H.unit(el, PIVOT), d2 = H.unit(el, G), dn = Math.hypot(lerp(d1[0], d2[0], w), lerp(d1[1], d2[1], w)) || 1;
  const d = [lerp(d1[0], d2[0], w) / dn, lerp(d1[1], d2[1], w) / dn], n = [-d[1], d[0]];
  const q = (s, w) => [[el[0] + d[0] * s + n[0] * w, el[1] + d[1] * s + n[1] * w], [el[0] + d[0] * s - n[0] * w, el[1] + d[1] * s - n[1] * w]];
  const a = q(12, 26), b = q(1100, 58), m0 = q(12, 29), m1 = q(48, 31);
  K.poly([a[0], b[0], b[1], a[1]], C.arm.color, LW);
  K.poly([m0[0], m1[0], m1[1], m0[1]], C.top, LW * 0.8);                             // gömlek manşeti
  if (mod === 'kalem') {
    const k = H.unit(uc, el), g0 = [uc[0] + k[0] * 18, uc[1] + k[1] * 18], g1 = [el[0] + k[0] * 44, el[1] + k[1] * 44];
    ctx.save(); ctx.lineCap = 'round';
    H.strokeLine(ctx, uc, g0, 13, INK); H.strokeLine(ctx, uc, g0, 6, MAVI);         // uç
    H.strokeLine(ctx, g0, g1, 25, INK); H.strokeLine(ctx, g0, g1, 15, '#E9E4D8');   // gövde
    H.strokeLine(ctx, kar(g0, g1, 0.72), g1, 15, MAVI);                             // arka kapak (kalemin rengi)
    ctx.restore();
    H.grip(K, 'defne', el, KOL_S);
  } else H.isaret(K, 'defne', el, KOL_S, uc, 1.1);
}

// ═══════════════════════════ Nesneler ═══════════════════════════
const PAKET_RENK = [[PAL.coral, PAL.cream], [PAL.teal, PAL.mustard], [PAL.mustard, PAL.red], [PAL.green, PAL.cream], ['#8E3B46', PAL.mustard]];
// Hediye paketi: (x, y) tabanın ortası. Beşi aynı boyda; yalnız renkleri farklı.
function paket(K, [x, y], i, rot = 0) {
  const { ctx } = K, [c, r] = PAKET_RENK[i];
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-42, -62, 84, 62, c, 0, 5); K.rect(-9, -62, 18, 62, r, 0); K.rect(-42, -40, 84, 15, r, 0);
  K.rect(-42, -62, 84, 62, null, LW * 0.8, 5);
  K.ell(-14, -69, 14, 8, r, LW * 0.6, -0.45); K.ell(14, -69, 14, 8, r, LW * 0.6, 0.45); K.circ(0, -65, 6.5, r, LW * 0.5);
  ctx.restore();
}
// Doğum günü pastası dilimi ve tek mum (döngü: alev)
function pasta(K, [x, y], t) {
  K.ell(x, y - 5, 46, 9, PAL.cream, LW * 0.7);
  K.poly([[x - 30, y - 9], [x + 30, y - 9], [x + 30, y - 56], [x - 30, y - 47]], '#E9C592', LW * 0.8);
  K.poly([[x - 30, y - 30], [x + 30, y - 35], [x + 30, y - 27], [x - 30, y - 22]], '#8E3B46', 0);
  K.poly([[x - 32, y - 47], [x + 32, y - 56], [x + 32, y - 66], [x - 32, y - 57]], BEYAZ, LW * 0.7);
  K.rect(x - 4, y - 100, 8, 40, PAL.coral, LW * 0.5, 2); K.line(x, y - 100, x, y - 106, 3, INK);
  H.alev(K, x, y - 108, 0.85, t, { i: 3 });
}
// İnce belli çay bardağı: (x, yb) taban
function bardak(K, x, yb, { k = 2, buhar = false, t = 0 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], '#A8401F', 2.4 / k * 1.45);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 36 * k, t, { k: 0.38, n: 2, ara: 9, boy: 56 });
}
function telefon(K, [x, y], rot) {
  const { ctx } = K; ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-19, -44, 38, 82, '#E9E4D8', LW * 0.7, 9); K.rect(-13, -35, 26, 56, '#3F6E72', 0, 4);
  ctx.restore();
}
// Hikmet'in masası
function masaCiz(K) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 16, y + 34, x1 - x0 - 32, 1500 - y - 34, PAL.wood, LW);
  for (const dx of [40, 236, 432]) { K.rect(x0 + dx, y + 66, 170, 118, PAL.woodTop, LW * 0.6, 6); K.line(x0 + dx + 62, y + 124, x0 + dx + 108, y + 124, 8); }
  K.rect(x0, y, x1 - x0, 36, PAL.woodTop, LW, 8);
}
// Misafir koltuğu (yandan, sağa bakar). arka: karakterden önce; ön (kolçak): karakterden sonra.
const BORDO = '#8E3B46', BORDO_K = '#74303A';
function koltukArka(K) {
  const { x, y } = KOLTUK;
  K.rect(x - 96, 1474, 28, 26, PAL.woodDark, LW * 0.7, 4); K.rect(x + 70, 1474, 28, 26, PAL.woodDark, LW * 0.7, 4);
  K.rect(x - 122, y - 218, 66, 218 + 72, BORDO, LW, 24);
  K.rect(x - 104, y + 56, 212, 1478 - y - 56, BORDO_K, LW, 8);
  K.rect(x - 100, y, 212, 66, BORDO, LW, 16);
}
function koltukOn(K) {
  const { x, y } = KOLTUK;
  K.rect(x + 66, y - 58, 34, 118, BORDO_K, LW, 10);
  K.rect(x - 92, y - 84, 198, 42, BORDO, LW, 20);
}
// Süs bayrakları: duvarda boydan boya; tahtanın üstünde yukarıdan geçer (yazının üstüne sarkmaz). Döngü: hafif salınım.
function susCiz(K, t) {
  const { ctx } = K, R = [PAL.coral, PAL.mustard, PAL.cream, '#6FB3AC', PAL.red];
  for (let k = -3; k < 6; k++) {
    const x = k * 330, ust = x >= 0 && x < 600 ? 500 : 586, sark = 40;
    ctx.beginPath(); ctx.moveTo(x, ust); ctx.quadraticCurveTo(x + 165, ust + sark * 2, x + 330, ust); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
    for (let j = 0; j < 6; j++) {
      const u = (j + 0.5) / 6, i = (k + 3) * 6 + j, px = x + 330 * u, py = ust + sark * 4 * u * (1 - u);
      ctx.save(); ctx.translate(px, py); ctx.rotate(Math.atan2(sark * 4 * (1 - 2 * u), 330) + 0.07 * Math.sin(t * 1.7 + i * 1.3));
      K.poly([[-23, 0], [23, 0], [0, 56]], R[i % 5], LW * 0.7); ctx.restore();
    }
    K.circ(x, ust, 7, PAL.trim, 3);
  }
}
// Balon demeti (döngü: ipin ucunda salınır)
function balonlar(K, t, x, y) {
  const B = [[-48, 6, PAL.coral], [2, -58, PAL.mustard], [52, -4, '#6FB3AC']];
  B.forEach(([dx, dy, c], i) => { const bx = x + dx + 6 * Math.sin(t * 0.9 + i * 2.1), by = y + dy + 7 * Math.sin(t * 1.25 + i * 1.3); K.line(bx, by + 56, x, 1474, 3, INK); });
  B.forEach(([dx, dy, c], i) => {
    const bx = x + dx + 6 * Math.sin(t * 0.9 + i * 2.1), by = y + dy + 7 * Math.sin(t * 1.25 + i * 1.3);
    K.poly([[bx - 8, by + 60], [bx + 8, by + 60], [bx, by + 46]], c, LW * 0.6); K.ell(bx, by, 42, 52, c, LW * 0.8);
  });
  K.rect(x - 24, 1470, 48, 30, PAL.mustard, LW * 0.7, 6);
}

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [-700, 1800], dongu: ['mum alevi', 'süs bayrakları', 'balonlar', 'Necmi\'nin çay buharı', 'pencerede martı'],
  capa: { tahta: TC, masa: [H_X, MASA.y], koltuk: [KOLTUK.x, KOLTUK.y], kapi: [KAPI.x + KAPI.w / 2, 1500] },
  kadraj: { genis: [0.955, 366, 893] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -1000, x1: 2100, isik, duvar: 'cizgili', zemin: 'ahsap' });
    K.ell(330, 1612, 600, 64, BORDO, LW); K.ell(330, 1612, 540, 46, null, 4);       // halı
    susCiz(K, t);
    M.pencere(K, 1365, 690, 200, 300, { isik, t });
    M.kapi(K, KAPI.x, KAPI.y, KAPI.w, KAPI.h, { acik: durum.kapi || 0, yon: 1, isik, ic: '#1C3638' });
    balonlar(K, t, 1665, 800);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    koy: 0.3, arkadas: T('h1:3'),
    hikmet: T('h1:6') - 0.05, goremedim: T('h1:9'),
    geri: T('h2a') - 0.4,
    mGir: T('h2a') - 0.95, mVar: T('h2a:4'), mOtur: T('h2a:4') + 0.15, mKalk: T('h2a:7') - 0.07, mYuru: T('h2a:7') + 0.28, mCik: T('h2c:3') + 0.33,
    hAc: T('h2b') - 0.6, hGir: T('h2b') - 0.35, hCik: T('d1') - 0.1,
    defne: T('d1') - 0.05, tahta: T('d1:3') - 0.05,
    hikmet2: T('h3') - 0.1, m1: T('h3:1') - 0.08, m2: T('h3:3') - 0.1, m3: T('h3:6'), silk: T('h3:9') - 0.05,
    defne2: T('d2') - 0.1, besi: T('d2:1'), oAni: T('d2:5'),
    sayac: cd0 - 0.05, say2: cd0 + 4.25, say3: cd0 + 6.65,
    necmi: T('n1') - 0.1, tekTek: T('n1:2'), ipucu: T('n1:5') - 0.08, kisiye: T('n1:7'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  tm.kapan1 = tm.mCik - 0.1; tm.kapan2 = tm.hGir + 1.45;
  tm.ciz = [0, 1, 2, 3, 4].map(k => tm.tahta + 0.36 + k * 0.68);                    // beş köşegenin çizilmeye başladığı anlar
  // on çizginin parmakla izlenmeye başladığı anlar: ilk dördü ve son dördü kadrajda, ortadaki ikisi Hikmet'in plânı sırasında
  tm.iz = [0.45, 1.4, 2.35, 3.3, 4.02, 5.6, 6.6, 7.45, 8.3, 9.15].map(v => cd0 + v);   // kesmelerde parmak hareket hâlindedir
  tm.birak = tm.m3 + 0.78;
  tm.say = [0, 1, 2, 3, 4].map(k => tm.say2 + 0.2 + k * 0.42);                     // Hikmet'in parmak hesabı

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 0.955, 366, 893]] },
    { id: 'hikmet', t0: tm.hikmet, cam: [[0, ...masaKam(1.34, 1042)]] },
    { id: 'geri', geri: true, t0: tm.geri, kay: [-40, 0], cam: [[0, 1.3, -60, 1000], [tm.hAc, 1.3, -40, 1000]] },
    { id: 'defne', t0: tm.defne, kisa: true, cam: [[0, ...ikili(1.21)]] },
    { id: 'tahta', t0: tm.tahta, cam: [[0, 1.46, 305, 895]] },                                // draw'daki kamera() ile
    { id: 'hikmet2', t0: tm.hikmet2, cam: [[0, ...masaKam(1.3, 1012)], [tm.m2 - 0.3, ...masaKam(1.38, 1016)]] },
    { id: 'defne2', t0: tm.defne2, cam: [[0, ...ikili(1.2)], [tm.oAni, ...ikili(1.23)]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, 1.42, 295, 897]] },                                // doğrusal itme draw'daki kamera() ile
    { id: 'say2', t0: tm.say2, cam: [[0, ...masaKam(1.3, 1060)]] },
    { id: 'say3', t0: tm.say3, cam: [[0, 1.5, 315, 893]] },
    { id: 'necmi', t0: tm.necmi, cam: [[0, 1.55, 1300, 1095]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, ...ikili(1.2)]] },                                // doğrusal itme draw'daki kamera() ile
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...ikili(1.23)]] },
    { id: 'cevap', t0: tm.cevap, kesme: false, cam: [[0, ...ikili(1.2)]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, ...ikili(1.23)]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: H_X, expr: BURUK, head: { tilt: 5, look: [0.25, 0.75] }, ...POZ.dur });
  const hik = [
    [0.6, { head: { tilt: -3, look: [-0.8, 0.1] } }, 0.35],
    [tm.arkadas, { head: { tilt: 3, look: [0.0, 0.7] } }, 0.35],
    [tm.hikmet, { expr: BURUK, head: { tilt: -4, look: [0.05, 0.7] } }, 0.01],
    [tm.goremedim - 0.15, { expr: BURUK, head: { tilt: 5, look: [0.7, 0.1] } }, 0.3],
    [tm.hikmet2, { expr: 'notr', head: { tilt: 3, look: [0.0, 0.65] } }, 0.01],
    [tm.m1 + 0.45, { head: { tilt: -3, look: [0.35, 0.6] } }, 0.3],
    [tm.m2 + 0.45, { head: { tilt: 4, look: [0.3, 0.6] } }, 0.3],
    [tm.birak, { expr: 'notr', head: { tilt: -4, look: [-0.7, 0.05] } }, 0.3],
    [tm.silk + 0.9, { expr: BURUK, head: { tilt: 3, look: [-0.6, 0.1] } }, 0.3],
    [tm.say2, { expr: IFADE.dusun2, head: { tilt: 4, look: [0.55, -0.55] } }, 0.01],
    [tm.say[4] + 0.3, { expr: SASKIN, head: { tilt: -4, look: [0.6, -0.5] } }, 0.3],
  ];
  const necBase = H.kisi('necmi', { x: N_X, expr: 'notr', head: { tilt: -4, look: [-0.8, 0.05] }, ...POZ.dur });
  const nec = [
    [tm.goremedim, { head: { tilt: 3, look: [-0.7, 0.3] } }, 0.3],
    [tm.hikmet2, { expr: 'notr', head: { tilt: 4, look: [-0.75, 0.45] } }, 0.01],
    [tm.m2, { head: { tilt: -3, look: [-0.8, 0.4] } }, 0.3],
    [tm.silk, { expr: NGULUS, head: { tilt: 4, look: [-0.8, 0.1] } }, 0.3],
    [tm.say2, { expr: NGULUS, head: { tilt: -3, look: [-0.85, -0.1] } }, 0.01],
    [tm.necmi, { expr: CANLI, head: { tilt: 3, look: [-0.6, 0.0] } }, 0.01],
    [tm.tekTek - 0.1, { head: { tilt: -5, look: [-0.6, 0.05] } }, 0.25],
    [tm.tekTek + 0.35, { head: { tilt: 5, look: [-0.8, 0.05] } }, 0.25],
  ];
  const defBase = H.kisi('defne', { x: D_X, expr: 'notr', head: { tilt: 4, look: [0.55, -0.2] }, ...POZ.dur });
  const def = [
    [1.6, { head: { tilt: -3, look: [0.8, 0.1] } }, 0.35],
    [tm.defne, { expr: 'notr', head: { tilt: -3, look: [0.85, 0.05] } }, 0.01],
    [tm.defne2, { expr: 'notr', head: { tilt: 3, look: [0.85, 0.05] } }, 0.01],
    [tm.besi - 0.15, { head: { tilt: -4, look: [0.6, -0.3] } }, 0.3],
    [tm.oAni - 0.1, { head: { tilt: 4, look: [0.8, 0.0] } }, 0.3],
    [tm.ipucu, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.05] } }, 0.01],
    [tm.kisiye, { expr: MERAK, ...POZ.dusun, head: { tilt: -5, look: [0.6, -0.35] } }, 0.35],
    [tm.kisiye + 0.6, { head: { tilt: 3, look: [0.85, -0.55] } }, 0.35],   // bakışı tahtada gezer (hiçbir adda durmaz)
    [tm.kisiye + 1.2, { head: { tilt: -3, look: [0.45, -0.1] } }, 0.35],
    [tm.n1s + 0.45, { expr: SASKIN, head: { tilt: 2, look: [0.55, -0.3] } }, 0.3],
    [tm.n1s + 1.25, { expr: GULUS, armR: POZ.dur.armR, head: { tilt: -3, look: [0.5, -0.25] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.7, -0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.3, 0.2] } }, 0.3],
    [tm.cta + 0.6, { head: { tilt: -5, look: [0.05, 0.05] } }, 0.35],
  ];
  // Altyazı çizelgesi (yalnız balon için): n1 son repliktir (cevapsız kesim), balonu "Buldum!"a kadar ekranda kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'n1' ? { ...l, t1: T('d3') - 0.3 } : l) };
  return { tm, film, tlA, hikBase, hik, necBase, nec, defBase, def };
}

// ═══════════════════════════ Durumlar ═══════════════════════════
// Kapı (geri dönüş): misafir için açık, çıkınca kapanır; Hikmet için açılır, çıkınca kapanır
const kapiAt = (S, t) => t < S.tm.hAc ? 1 - W(t, S.tm.kapan1, 0.3) : W(t, S.tm.hAc, 0.25) * (1 - W(t, S.tm.kapan2, 0.28));
// İki poz arası karışım (yandan görünüş; oturmaya geçiş)
function karis(a, b, u) {
  if (u <= 0) return a; if (u >= 1) return b;
  const p = { ...a, head: { ...a.head } };
  for (const k of ['lean', 'bob', 'x']) p[k] = lerp(a[k] || 0, b[k] || 0, u);
  for (const k of ['legL', 'legR', 'armL', 'armR']) { p[k] = {}; for (const q of new Set([...Object.keys(a[k]), ...Object.keys(b[k])])) { const z = q === 'k' ? 1 : 0; p[k][q] = lerp(a[k][q] ?? z, b[k][q] ?? z, u); } }
  return p;
}
// Misafir: kapıdan girer, koltuğa oturur, kalkar, kapıdan çıkar
function misafirAt(S, t) {
  const { tm } = S, poz = { expr: GULUS, head: { tilt: 3, look: [0.7, 0.1] } };
  if (t < tm.mVar) return H.yuru(MIS, t, { t0: tm.mGir, t1: tm.mVar, x0: -600, x1: M_DUR, s: MIS_S, poz });
  if (t < tm.mYuru) {
    const ayakta = H.kisi(MIS, { view: 'side', facing: 1, x: M_DUR, s: MIS_S, ...poz });
    const oturur = H.otur(MIS, { x: KOLTUK_X, facing: 1, s: MIS_S, expr: GULUS, head: { tilt: 2, look: [0.7, 0.05] } });
    return karis(ayakta, oturur, W(t, tm.mOtur, 0.35) * (1 - W(t, tm.mKalk, 0.33)));
  }
  return H.yuru(MIS, t, { t0: tm.mYuru, t1: tm.mCik, x0: M_DUR, x1: -610, s: MIS_S, poz: { expr: GULUS, head: { tilt: 3, look: [0.7, 0.1] } } });
}
// Hikmet (geri dönüş): elinde çay tepsisiyle kapıdan girer, odanın içine (kadrajın sağına) doğru yürür
const hikGeriAt = (S, t) => H.yuru('hikmet', t, { t0: S.tm.hGir, t1: S.tm.hCik, x0: -600, x1: 560, poz: { expr: GULUS, head: { tilt: 3, look: [0.7, 0.1] } } });
// Hediyeler: sahneye göre yer. Dönen: beş paketin taban ortası.
function paketlerAt(S, t) {
  const { tm } = S;
  if (t < tm.defne) {   // yığın; beşinci paket kare 0'da Hikmet'in elindedir, 0,3 sn'de yığına konur
    const e = H.iz([[0, [YIGIN[4][0], 1108]], [tm.koy, YIGIN[4], 0.2, ease.exit]], t);
    return [YIGIN[0], YIGIN[1], YIGIN[2], YIGIN[3], e];
  }
  const { m1, m2, m3 } = tm, g = 0.36, d = 0.34;
  const A = H.iz([[0, EV[0]], [m1 - g, BULUS_L, g, ease.enter], [m1 + 0.38, EV[0], d], [m2 - g, BULUS_L, g, ease.enter], [m2 + 0.4, EV[0], d]], t);
  const Bp = H.iz([[0, EV[1]], [m1 - g, BULUS_R, g, ease.enter], [m1 + 0.38, EV[1], d], [m3 - g, BULUS_L, g, ease.enter], [m3 + 0.4, EV[1], d]], t);
  const C = H.iz([[0, EV[2]], [m2 - g, BULUS_R, g, ease.enter], [m2 + 0.4, EV[2], d], [m3 - g, BULUS_R, g, ease.enter], [m3 + 0.4, EV[2], d]], t);
  return [A, Bp, C, EV[3], EV[4]];
}
const tutL = p => [p[0] - 38, p[1] - 30], tutR = p => [p[0] + 38, p[1] - 30];

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç perdesi tahtayı örtmesin)
  kuyruksuz: (t, B) => !!B.sc.geri || B.sc.id === 'ipucu',   // son plânda Necmi kadraj dışında: kuyruk pastayı gösteriyordu
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id, lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
    if (id === 'tahta') Object.assign(cam, tahtaKam(lg(1.46, 1.52, clamp01((t - tm.tahta) / 4))));
    else if (id === 'sayac' || id === 'say3') Object.assign(cam, tahtaKam(lg(1.42, 1.55, clamp01((t - tm.cd0) / 10))));     // sayaç: doğrusal itme
    else if (id === 'say2') { const [z, cx, cy] = masaKam(lg(1.3, 1.34, clamp01((t - tm.say2) / 2.4)), 1060); Object.assign(cam, { zoom: z, cx, cy }); }
    else if (id === 'ipucu') Object.assign(cam, ikiliKam(lg(1.2, 1.25, clamp01((t - tm.ipucu) / (tm.buldum - tm.ipucu)))));   // son plân: doğrusal itme
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, sc = B.sc;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (sc.id === 'hikmet') H.saatRozet(K, t, tm.geri, { x: 610, y: 640, r: 78, saat: 18.5, tur: 1.5, yon: -1 });
    if (sc.geri) H.zamanHapi(K, t, tm.geri + 0.2, tm.defne - 0.25, K.up('gün içinde'), { x: 640, y: 560, saat: 13.2 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (bu bölüme özel): perde yok; tahta açık kalır. Daire solda, başlık ve paylaşım hapı sağında.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1320, r = 80;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
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
  const { tm } = S, { heads, sc, cam } = B, id = sc.id, geri = !!sc.geri, gor = GOR[id] || '';
  M.mekanCiz(K, ODA, 'arka', t, { isik: geri ? M.ISIK.gunduz : M.ISIK.aksam, durum: { kapi: geri ? kapiAt(S, t) : 0 } });
  tahtaCiz(K, t, S, geri);
  koltukArka(K);
  if (geri) return geriSahne(K, t, S);
  koltukOn(K);
  const pk = paketlerAt(S, t);

  // ——— Hikmet ———
  let hp = null, hc = null; const hO = { heads }; let hTut = [], hSay = 0, hBes = 0;
  if (gor.includes('H')) {
    hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
    if (id === 'kanca' || id === 'hikmet') {
      const wR = 1 - W(t, tm.koy + 0.5, 0.3);                          // beşinci paketi yığına koyar, elini çeker
      if (wR > 0.01) { hO.R = [tutR(pk[4]), wR, 'A']; if (wR > 0.5) hTut.push('R'); }
      const u5 = id === 'kanca' ? pIn(t, 0.48, tm.hikmet - 0.32, 0.3) : 0;   // "beş": öbür elinin beş parmağını açar; sonra yığının yanına iner
      hO.L = [kar(tutL(YIGIN[0]), [hp.x - 182, 1012], u5), 1, 'B'];   // el tahtanın altında, yüzün yanında (yazıya ve yüze binmez)
      if (u5 > 0.5) hBes = 5 * seg(t, 0.66, 0.45); else hTut.push('L');
      H.omuzSilk(hp, t, tm.goremedim - 0.05, 0.45);
      if (t > tm.goremedim - 0.1 && t < tm.goremedim + 1.1) { delete hO.L; hTut = hTut.filter(s => s !== 'L'); }
    } else if (id === 'hikmet2') {
      const w = 1 - W(t, tm.birak, 0.28);
      if (w > 0.01) {
        const L = kar(tutL(pk[0]), tutL(pk[1]), W(t, tm.m2 + 0.76, 0.27)), R = kar(tutR(pk[1]), tutR(pk[2]), W(t, tm.m1 + 0.74, 0.27));
        hO.L = [L, w, 'A']; hO.R = [R, w, 'A']; if (w > 0.5) hTut.push('L', 'R');
      }
      H.omuzSilk(hp, t, tm.silk, 0.7);
    } else if (id === 'say2') {
      const el = H.elYeri('hikmet', hp, 'R', 'yukari'), w = W(t, tm.say2 - 0.3, 0.28);
      hO.R = [el, w, 'B'];
      hSay = tm.say.reduce((n, a) => n + seg(t, a - 0.04, 0.2), 0);
    }
  }
  // ——— Necmi ———
  let np = null, nc = null; const nO = { heads }; let nCay = null, nBir = false;
  if (gor.includes('N')) {
    np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    nCay = [np.x + 140, 1124]; nO.R = [[nCay[0] + 8, nCay[1] - 26], 1, 'A'];
    if (id === 'hikmet2') H.onayla(np, t, tm.silk + 0.5, 1, 0.4);
    if (id === 'necmi') {   // "tek tek düşünmeyin": elini iki yana sallar
      const w = pIn(t, tm.tekTek - 0.3, tm.ipucu + 0.1, 0.25);
      if (w > 0.01) { nO.L = [[np.x - 172 + 24 * Math.sin((t - tm.tekTek) * Math.PI * 2 / 0.56) * clamp01((t - tm.tekTek + 0.1) / 0.15), 1085], w, 'B']; nBir = w > 0.5; }
    }
  }
  // ——— Defne ———
  let dp = null, dc = null; const dO = { heads }; let dTel = null, dIs = null, dBir = 0, dKalem = false;
  if (gor.includes('D')) {
    dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
    const kulak = [dp.x + 114, 986];
    dKalem = id !== 'buldum';                                           // kalem sol elinde, aşağıda
    if (id === 'kanca') {                                               // telefon kulağında (tahta yanındaki elinde)
      H.onayla(dp, t, 0.3, 1, 0.42); H.onayla(dp, t, 2.0, 1, 0.42);
      dO.R = [kulak, 1, 'B']; dTel = 10;
    } else if (id === 'defne') {                                        // "Beşini de aradım": telefonu indirip gösterir
      const u = W(t, tm.defne + 0.08, 0.32);
      dO.R = [kar(kulak, [dp.x + 108, 1066], u), 1, 'B']; dTel = lerp(10, -6, u);
    } else if (id === 'defne2') {                                       // tahtayı gösterir, sonra parmağını kaldırır
      H.onayla(dp, t, tm.defne2 + 0.15, 1, 0.42);
      const wG = pIn(t, tm.besi - 0.3, tm.oAni - 0.15, 0.28), wB = W(t, tm.oAni - 0.25, 0.28);
      const g = [dp.x + 96, 1010], b = H.elYeri('defne', dp, 'R', 'yukari');
      if (wG > 0.01 || wB > 0.01) dO.R = [kar(g, b, wB), Math.max(wG, wB), 'A'];
      if (wB > 0.5) dBir = seg(t, tm.oAni - 0.05, 0.2); else if (wG > 0.5) dIs = [TC[0] - 90, TC[1] + 10];
    } else if (id === 'ipucu') {                                        // dinler, tahtaya döner; replikten sonra parmağı kalkar
      const wB = W(t, tm.n1s + 1.25, 0.3);
      if (t > tm.buldum - 0.9) dp.blink = 0;                            // kesimden hemen önce göz kırpmasın
      if (wB > 0.01) { dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), wB, 'A']; if (wB > 0.5) dBir = seg(t, tm.n1s + 1.45, 0.2); }
    } else if (id === 'cevap') {
      const wG = W(t, tm.cevap + 0.2, 0.28);
      dO.R = [[dp.x + 96, 1010], wG, 'A']; if (wG > 0.5) dIs = [TC[0] - 90, TC[1] + 10];
    }
  }

  // ——— çizim: Hikmet ve Necmi → masa → pasta ve paketler → tutan eller → Defne ve elindekiler ———
  if (hp) hc = oyna(K, t, tl, 'hikmet', hp, hO);
  if (np) nc = oyna(K, t, tl, 'necmi', np, nO);
  masaCiz(K);
  pasta(K, PASTA, t);
  for (const i of t < tm.defne ? [0, 1, 2, 3, 4] : [3, 4, 0, 1, 2]) paket(K, pk[i], i, t < tm.defne ? [0, 0, 0, -7, 6][i] : [0, 0, 0, 0, -6][i]);
  if (hc) { for (const sd of hTut) hc.tut(sd); if (id === 'say2') hc.parmak('R', hSay, { toplam: 5, ac: 0.3 }); if (hBes > 0) hc.parmak('L', hBes, { toplam: 5, ac: 0.3 }); }
  if (nc) { bardak(K, nCay[0], nCay[1], { buhar: true, t }); nc.tut('R'); if (nBir) nc.parmak('L', 1, { toplam: 1 }); }
  if (dp) {
    dc = oyna(K, t, tl, 'defne', dp, dO);
    if (dTel !== null) { telefon(K, [dc.handR[0] + 2, dc.handR[1] - 24], dTel); dc.tut('R'); }
    if (dKalem) {
      const e = dc.handL, a = [e[0] + 6, e[1] - 20], u = [e[0] - 12, e[1] + 44];
      K.ctx.save(); K.ctx.lineCap = 'round'; H.strokeLine(K.ctx, a, u, 17, INK); H.strokeLine(K.ctx, a, u, 9, '#E9E4D8'); H.strokeLine(K.ctx, kar(a, u, 0.72), u, 9, MAVI); K.ctx.restore();
      dc.tut('L');
    }
    if (dIs) dc.isaret('R', dIs);
    if (dBir > 0) dc.parmak('R', dBir, { toplam: 1 });
    if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  }
  // ——— tahta plânı: Defne'nin kolu sol alttan girer; kuyruk ona doğru yatar ———
  if (TAHTA_PLANI.includes(id)) {
    const d = tahtaDuzen(K);
    if (id === 'tahta') kolCiz(K, kalemAt(S, t, d), 'kalem'); else kolCiz(K, parmakAt(S, t, d), 'parmak');
    heads.defne = [cam.cx - 470 / cam.zoom, cam.cy + 150 / cam.zoom];
  }
  if (id === 'ipucu' || id === 'necmi') { if (!np) heads.necmi = [cam.cx + 470 / cam.zoom, cam.cy + 40 / cam.zoom]; }   // Necmi kadrajın sağında
}

// ——— Geri dönüş (gün içinde): kapı, boş tahta, misafir koltuğu; önce misafir, sonra Hikmet ———
function geriSahne(K, t, S) {
  const { tm } = S, { ctx } = K;
  const kirp = fn => { ctx.save(); ctx.beginPath(); ctx.rect(KAPI.x, -2000, 6000, 6000); ctx.clip(); fn(); ctx.restore(); };   // koridordan gelen, kapının sol pervazının arkasından çıkar
  // misafir: girerken içeridekilere el kaldırır; otururken başını sallar. Oturuyorsa kolçak önünde, ayaktaysa koltuğun tamamı arkasında kalır.
  const otr = t >= tm.mVar && t < tm.mYuru ? W(t, tm.mOtur, 0.35) * (1 - W(t, tm.mKalk, 0.33)) : 0;
  const misafir = () => { if (t >= tm.mCik + 0.1) return; kirp(() => {
    const p = misafirAt(S, t), sel = pIn(t, tm.geri + 0.12, tm.mVar - 0.28, 0.25), o = { sessiz: true };
    H.onayla(p, t, tm.mOtur + 0.5, 2, 0.34);
    if (sel > 0.01) o.R = [[p.x + 172, 1040 + 12 * Math.sin((t - tm.geri) * 11)], sel, 'A'];   // el göğüs hizasında, yüzün önüne çıkmaz
    const c = oyna(K, t, null, MIS, p, o); if (sel > 0.5) c.parmak('R', 4, { toplam: 4, ac: 0.26 });
  }); };
  if (otr >= 0.5) { misafir(); koltukOn(K); } else { koltukOn(K); misafir(); }
  if (t >= tm.hGir - 0.05) kirp(() => {
    const p = hikGeriAt(S, t), f = p.facing || 1, tepsi = [p.x + f * 108, 1168];
    const c = oyna(K, t, null, 'hikmet', p, { sessiz: true, R: [[tepsi[0] - f * 26, tepsi[1] + 6], 1, 'A'] });
    K.ell(tepsi[0], tepsi[1], 66, 10, PAL.metal, LW * 0.8);
    bardak(K, tepsi[0] - 26, tepsi[1] - 6, { k: 1.5, buhar: true, t }); bardak(K, tepsi[0] + 26, tepsi[1] - 6, { k: 1.5 });
    c.tut('R');
  });
}
