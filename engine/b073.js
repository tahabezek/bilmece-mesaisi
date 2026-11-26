// Bölüm 73 · AYSELLER (v4 "hikâye" dili, kısa set, cevapsız tasarım; storyboard: hikayeler/bolum_073_v5.md).
// Mekanizma: Türkçede kişi adına gelen "-ler" o kişiyi ve yanındakileri anlatır ("Ayseller" = Aysel ve en az bir kişi).
// Logline: Hikmet akşam yemeği veriyor; üç misafiri var: Aysel, Necmi, Kerem. Defne sofraya beş tabak koyar (Hikmet ve
// Defne de oturacak). Diyafon çalar; kapıcı Rıza Efendi: "Önce Ayseller geldi. Arkalarından Necmiler. En son Kerem Bey,
// tek başına." Masaya en az kaç tabak lazım?
// Akılda kalacak tek şey: kapıcı adları nasıl söyledi?
// Sızıntı yasağı: misafirler hiç görünmez; giriş kapısı ve merdiven boş; kapı önünde ayakkabı, palto, şemsiye yok.
// Kapıcının sözünde "-ler" ekleri vurgulanmaz (el hareketi "geldi"ye ve "Arkalarından"a bağlıdır, adlara değil).
// Defne tabakları saymaz, doğru sayıya götüren bir hareket yapmaz; sofrada beş tabak ve beş çatal okunur.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180, TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Figüran: kapıcı Rıza Efendi ═══════════════════════════
// Necmi'nin iskeletinden (hafif kambur); 50'lerinin sonunda. Kahve yelek, bej gömlek kolları, gri pantolon, kalın kır bıyık,
// yanları kır saç, başında koyu kasket (yelek ve kasket siluet). Gözlük yok. Sesi: Ahmet, satırda +2 % / −20 Hz (Hikmet −4 % / −6 Hz).
const KAP = 'b073_kapici';
if (!H.CARDS[KAP]) {
  const b = H.CARDS.necmi;
  H.CARDS[KAP] = {
    ...b, key: KAP, name: 'Rıza Efendi', role: 'kapıcı', seed: 731,
    head: { w: 0.98, h: 0.98, ear: 0.13 }, neck: 0.06,
    torso: { ...b.torso, len: 0.84, shoulder: 0.7, hip: 0.66, belly: 0.13, color: '#6B4A33', shade: '#573B28' },
    arm: { ...b.arm, color: '#D8C7A2', shade: '#BFAD88' },
    leg: { ...b.leg, color: '#4A4F57', shade: '#383C42' },
    shoe: { ...b.shoe, color: '#2A1E17' },
    skin: '#C98F68', skinShade: '#AE7652', hair: '#B7B0A6',
    eyes: { gap: 0.34, w: 0.17, h: 0.2, y: 0.05, lid: 0.22 }, line: 0.05, idle: { blink: [2.9, 5.8] },
    features: ['waistcoat', 'baldSides', 'mustacheThick'], stance: { knee: 4 },
    kasket: '#4B4640', kasketKoyu: '#38342F',
  };
}
const S_KAP = 232;

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz, açık durmaz)
const SASKIN = { brow: 0.09, browTilt: -0.05, eye: 1.3, pupil: 0.7, curve: -0.05, open: 0, w: 0.6 };
const GULUS = { brow: 0.03, browTilt: -0.1, eye: 0.85, pupil: 1, curve: 0.6, open: 0, w: 1.15 };
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const GURUR = { brow: 0.04, browTilt: -0.08, eye: 0.85, pupil: 1, curve: 0.45, open: 0, w: 1.1 };
const DALGIN = { brow: 0.04, browTilt: 0.05, eye: 0.95, pupil: 1, curve: 0.18, open: 0, w: 0.95 };
const KONUS = { brow: 0.05, browTilt: 0, eye: 1.05, pupil: 1, curve: 0.15, open: 0, w: 1 };

// ═══════════════════════════ Mekân 1: Hikmet'in evi, salon (akşam) ═══════════════════════════
const SALON = 'b073_salon';
const TB = 1180, TF = 1275, DRAPE = 1345;                 // masa üstü: arka kenar, ön kenar; örtünün sarktığı yer
const TX0 = 250, TX1 = 790;                               // ön kenar (arka kenar 30 px içeride)
const DEF_X = 360, HIK_X = 905;
const DIY = { x: 745, y: 1000 };                          // diyafon (duvarda, masanın sağ arka köşesinin üstünde)
const KAPI = { x: 810, y: 760, w: 200, h: 740 };          // mutfak kapısı (açık)
// Tabaklar: arka sıra 2, ön sıra 3 (iyi ayrık; kadrajda sayılabilir). [x, y, rx, ry]
const TABAK = [[400, 1205, 58, 16], [670, 1205, 58, 16], [325, 1252, 62, 18], [530, 1252, 62, 18], [735, 1252, 62, 18]];
const SON_TABAK = 0;
const GOVDE = [DEF_X + 66, 1150], DINLEN = [DEF_X + 66, 1300];   // Defne'nin eli: masanın arka kenarının üstü (gövde önü) ve masanın arkası (görünmez)                                      // Defne'nin kare 0'da koyduğu (kendi önündeki)
const TENCERE = [535, 1203];                              // çorba kâsesi (arka orta; buhar döngüsü)
const PEN = { x: 380, y: 560, w: 340, h: 300 };
const IC = M.ISIK.aksam, DIS = M.ISIK.gece;

function tabak(K, [x, y, rx, ry]) {
  K.ell(x + 4, y + 5, rx, ry, 'rgba(31,36,33,0.35)', 0);
  K.ell(x, y, rx, ry, '#FBF8F1', 4);
  K.ell(x, y + 1, rx * 0.62, ry * 0.6, '#EDE5D4', 2.5);
  K.ell(x, y, rx - 7, ry - 3, null, 2, 0);
}
function catal(K, x, y) {   // tabağın solunda, masaya yatık (önden: kısa dik çizgi, uçta dişler)
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  K.line(x, y + 14, x + 2, y - 8, 8, INK); K.line(x, y + 14, x + 2, y - 8, 4, '#C9CFC6');
  for (const dx of [-5, 0, 5]) { K.line(x + 2 + dx, y - 8, x + 2 + dx * 1.1, y - 18, 5, INK); K.line(x + 2 + dx, y - 8, x + 2 + dx * 1.1, y - 18, 2, '#C9CFC6'); }
  ctx.restore();
}
function kase(K, t) {   // çorba kâsesi, kapaklı; döngü: buhar
  const [x, y] = TENCERE;
  H.buhar(K, x, y - 78, t, { k: 0.55, n: 2, ara: 18, boy: 90 });
  K.ell(x + 4, y + 4, 70, 14, 'rgba(31,36,33,0.35)', 0);
  K.poly([[x - 72, y - 52], [x + 72, y - 52], [x + 56, y - 4], [x - 56, y - 4]], PAL.teal, LW * 0.8);
  K.line(x - 66, y - 34, x + 66, y - 34, 5, '#E9DCC2');
  K.ell(x, y - 54, 74, 14, '#3E8F89', LW * 0.7);
  K.ell(x, y - 62, 40, 11, '#3E8F89', LW * 0.6);
  K.circ(x, y - 76, 9, '#E9DCC2', LW * 0.6);
}
function masa(K) {   // örtülü masa (önden): üst yüzey, örtünün sarkan ön yüzü, iki ayak. Karakterden SONRA çizilir.
  const { ctx } = K;
  for (const lx of [TX0 + 30, TX1 - 54]) K.rect(lx, DRAPE - 10, 24, 1500 - DRAPE + 10, PAL.woodDark, LW, 4);
  K.poly([[TX0 + 30, TB], [TX1 - 30, TB], [TX1, TF], [TX0, TF]], '#F6EFE2', LW);
  K.poly([[TX0, TF], [TX1, TF], [TX1 + 6, DRAPE], [TX0 - 6, DRAPE]], '#EFE6D3', LW);
  ctx.save(); K.path([[TX0, TF], [TX1, TF], [TX1 + 6, DRAPE], [TX0 - 6, DRAPE]]); ctx.clip();
  ctx.fillStyle = PAL.coral; ctx.fillRect(TX0 - 10, DRAPE - 26, TX1 - TX0 + 20, 12);
  ctx.restore();
  K.poly([[TX0, TF], [TX1, TF], [TX1 + 6, DRAPE], [TX0 - 6, DRAPE]], null, LW);
}
// Diyafon: duvar ünitesi + ahize. ahize: null (askıda) ya da { p: [x, y] el, a: açı }; zil: titreme
function diyafon(K, t, ahize, zil = 0) {
  const { x, y } = DIY, dx = 2.5 * zil;
  K.rect(x - 30 + dx + 6, y - 66 + 8, 60, 132, 'rgba(31,36,33,0.35)', 0, 10);
  K.rect(x - 30 + dx, y - 66, 60, 132, '#E9E4D6', LW * 0.8, 10);
  for (let i = 0; i < 3; i++) K.line(x + 8 + dx, y + 30 + i * 9, x + 22 + dx, y + 30 + i * 9, 3, '#9A968A');   // hoparlör ızgarası
  K.rect(x + 8 + dx, y - 50, 14, 14, zil > 0.05 ? PAL.coral : '#9A968A', 3, 4);   // düğme
  const askida = !ahize;
  if (askida) handset(K, [x - 14 + dx, y - 4], 0);
  const uc = askida ? [x - 14 + dx, y + 52] : ahizeAlt(ahize);
  kordon(K, [x - 18 + dx, y + 66], uc);
  return askida;
}
const AH_L = 118;
function ahizeAlt(a) { return [a.p[0] - Math.sin(a.a) * AH_L * 0.45, a.p[1] + Math.cos(a.a) * AH_L * 0.45]; }
function handset(K, [x, y], a) {   // ahize: dik, üstte kulaklık, altta ağızlık; (x, y) orta (tutuş yeri)
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  K.rect(-11, -AH_L / 2 + 14, 22, AH_L - 28, '#D8D2C2', LW * 0.7, 9);
  K.rect(-17, -AH_L / 2, 34, 26, '#D8D2C2', LW * 0.7, 10);
  K.rect(-17, AH_L / 2 - 26, 34, 26, '#D8D2C2', LW * 0.7, 10);
  ctx.restore();
}
function kordon(K, a, b) {   // kıvrık kordon: iki nokta arasında sarkan, sarmal çizgi
  const { ctx } = K, n = 40, sag = 46 + 0.15 * Math.hypot(b[0] - a[0], b[1] - a[1]);
  ctx.save(); ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) + sag * Math.sin(Math.PI * u), w = 6 * Math.sin(u * TAU * 7);
    i ? ctx.lineTo(x + w, y) : ctx.moveTo(x + w, y);
  }
  ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = '#D8D2C2'; ctx.stroke();
  ctx.restore();
}
// Hikmet'in önlüğü (elde tutulan nesne değil, sahneye özgü giysi; storyboard: "önlüklü"). Kolların arasında kalır.
function onluk(K, p) {
  const n = H.eklem('hikmet', p, 'neck'), pl = H.eklem('hikmet', p, 'pelvis'), s = p.s;
  const x = lerp(n[0], pl[0], 0.5), top = n[1] + 0.22 * s, bel = pl[1] - 0.32 * s, alt = pl[1] + 0.46 * s;
  const { ctx } = K;
  ctx.save(); ctx.lineCap = 'round';
  K.line(x - 0.17 * s, top + 4, n[0] - 0.1 * s, n[1] + 0.04 * s, 5, INK); K.line(x + 0.17 * s, top + 4, n[0] + 0.1 * s, n[1] + 0.04 * s, 5, INK);   // boyun askısı
  K.poly([[x - 0.19 * s, top], [x + 0.19 * s, top], [x + 0.21 * s, bel], [x + 0.29 * s, bel + 0.05 * s], [x + 0.3 * s, alt], [x - 0.3 * s, alt], [x - 0.29 * s, bel + 0.05 * s], [x - 0.21 * s, bel]], '#F3EEE4', LW * 0.8);
  ctx.save(); K.path([[x - 0.3 * s, alt - 0.1 * s], [x + 0.3 * s, alt - 0.1 * s], [x + 0.3 * s, alt - 0.06 * s], [x - 0.3 * s, alt - 0.06 * s]]); ctx.fillStyle = PAL.coral; ctx.fill(); ctx.restore();
  K.rect(x - 0.12 * s, bel + 0.12 * s, 0.24 * s, 0.16 * s, '#EAE2D2', LW * 0.6, 6);   // cep
  K.line(x - 0.29 * s, bel + 0.04 * s, x - 0.38 * s, bel + 0.14 * s, 5, '#F3EEE4');   // bağcık
  ctx.restore();
}
function kilim(K) {   // masanın altında kilim (zemin boş kalmasın): kenar şeritleri ve yazısız motif bandı
  const y0 = 1520, y1 = 1900;
  K.poly([[40, y0], [1040, y0], [1180, y1], [-100, y1]], '#B5573F', LW * 0.8);
  K.poly([[90, y0 + 28], [990, y0 + 28], [1100, y1 - 30], [-20, y1 - 30]], '#C98A3A', LW * 0.6);
  K.poly([[140, y0 + 60], [940, y0 + 60], [1020, y1 - 70], [60, y1 - 70]], '#8E3B32', LW * 0.6);
  for (let i = 0; i < 7; i++) { const x = 230 + i * 105, y = (y0 + y1) / 2 + 10; K.poly([[x, y - 46], [x + 34, y], [x, y + 46], [x - 34, y]], i % 2 ? '#E9DCC2' : PAL.mustard, LW * 0.5); }
}
function bufe(K) {   // Defne'nin arkasında, solda: büfe ve üstünde vazo
  K.rect(-160, 1180, 330, 320, PAL.wood, LW, 6); K.rect(-176, 1162, 362, 24, PAL.woodTop, LW, 6);
  for (const dx of [-140, 15]) K.rect(dx, 1214, 140, 250, PAL.woodTop, LW * 0.6, 6);
  K.poly([[40, 1162], [80, 1162], [92, 1110], [74, 1060], [46, 1060], [28, 1110]], PAL.mustard, LW * 0.8);
  for (const [a, c] of [[-0.35, PAL.coral], [0, PAL.red], [0.35, PAL.coral]]) { const ex = 60 + 70 * Math.sin(a), ey = 1060 - 70 * Math.cos(a); K.line(60, 1060, ex, ey, 5, PAL.green); K.circ(ex, ey, 14, c, LW * 0.6); }
}
// Penceredeki vapur (döngü): sağdan sola kayar, ışıkları yanar
function pencereVapur(K, t) {
  const { ctx } = K, { x, y, w, h } = PEN, base = y + h * 0.78, vx = x + w + 60 - ((t * 16) % (w + 160));
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const vy = base + 26;
  K.poly([[vx - 46, vy - 12], [vx + 50, vy - 12], [vx + 40, vy], [vx - 40, vy]], '#E9E4D6', 3);
  K.rect(vx - 30, vy - 26, 56, 14, '#E9E4D6', 3, 3);
  for (let i = 0; i < 4; i++) K.rect(vx - 25 + i * 13, vy - 22, 7, 6, PAL.mustard, 0);
  ctx.restore();
}
function mutfak(K, t) {   // kapının açıklığından görünen mutfak: ocak, tencere (döngü: buhar)
  const { x, y, w } = KAPI;
  K.rect(x + 18, 1240, 150, 260, '#E9E4D6', LW * 0.7, 4);
  K.rect(x + 12, 1226, 162, 20, '#C9C3B6', LW * 0.7, 4);
  K.rect(x + 50, 1170, 80, 56, PAL.metal, LW * 0.7, 8);
  H.buhar(K, x + 90, 1160, t + 0.4, { k: 0.45, n: 2, ara: 14, boy: 70 });
  K.rect(x + 20, 860, w - 40, 160, '#EADBB5', LW * 0.6, 6);   // raf ve kavanozlar
  for (let i = 0; i < 3; i++) K.rect(x + 36 + i * 46, 930, 32, 46, [PAL.coral, PAL.mustard, PAL.green][i], LW * 0.5, 5);
  K.line(x + 20, 980, x + w - 20, 980, LW * 0.7);
}
M.mekanEkle(SALON, {
  gen: [-400, 1900], dongu: ['çorba kâsesinin buharı', 'mutfakta tencerenin buharı', 'penceredeki vapur'],
  capa: { diyafon: [DIY.x, DIY.y], masa: [(TX0 + TX1) / 2, TB] },
  kadraj: { grup: [1.22, 635, 1082] },
  arka(K, t) {
    M.oda(K, { x0: -500, x1: 2000, isik: IC, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, PEN.x, PEN.y, PEN.w, PEN.h, { isik: DIS, t, manzara: 'istanbul', kayit: true });
    pencereVapur(K, t);
    for (const sx of [-1, 1]) {   // perdeler
      const x0 = sx < 0 ? PEN.x - 44 : PEN.x + PEN.w - 6;
      K.poly([[x0, PEN.y - 30], [x0 + 50, PEN.y - 30], [x0 + 50 + sx * 6, PEN.y + PEN.h + 40], [x0 - sx * 6, PEN.y + PEN.h + 40]], '#C26A4E', LW * 0.7);
      for (const f of [0.33, 0.66]) K.line(x0 + 50 * f, PEN.y - 20, x0 + 50 * f, PEN.y + PEN.h + 30, 3, '#A35640');
    }
    K.rect(PEN.x - 60, PEN.y - 44, PEN.w + 120, 14, '#8C6A44', LW * 0.6, 5);
    bufe(K);
    kilim(K);
    M.kapi(K, KAPI.x, KAPI.y, KAPI.w, KAPI.h, { acik: 0.86, yon: -1, ic: '#F3E3B0', isik: IC, renk: '#8C6A44' });
    mutfak(K, t);
    // kapının sağında duvar tablosu (yazısız)
    K.rect(1100, 820, 180, 140, '#E9DCC2', LW * 0.8, 4); K.poly([[1112, 948], [1170, 870], [1210, 920], [1240, 890], [1268, 948]], PAL.green, LW * 0.5);
  },
});

// ═══════════════════════════ Mekân 2: apartman girişi (akşam) ═══════════════════════════
const GIRIS = 'b073_giris';
const KAP_X = 590;
const TEL = { x: 395, y: 1000 };                          // kapıcının duvar telefonu
const SEHPA = { x: 800, y: 1180 };                        // yüksek çay sehpası (üst yüzey; bardak sayaç bandının üstünde kalır)
const MERDIVEN = { x0: 880, adim: 62, yuk: 38, n: 12 };   // sağa doğru yükselen basamaklar (boş)
function kedi(K, x, yb, t) {   // kalorifer üstünde uyuyan tekir; döngü: kuyruk ucu kıvrılır
  const { ctx } = K, c = '#C98A3A', cd = '#9E6427', sal = Math.sin(t * 2.1);
  ctx.save(); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 46, yb - 14); ctx.quadraticCurveTo(x + 86, yb - 8, x + 92 + 8 * sal, yb - 36 - 10 * sal);
  ctx.lineWidth = 14 + LW; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 14; ctx.strokeStyle = c; ctx.stroke();
  ctx.restore();
  K.ell(x, yb - 30, 58, 32, c, LW * 0.8);
  for (const dx of [-18, 4, 26]) K.line(x + dx, yb - 58, x + dx + 6, yb - 36, 4, cd);
  K.circ(x - 50, yb - 38, 27, c, LW * 0.8);
  K.poly([[x - 72, yb - 52], [x - 70, yb - 80], [x - 54, yb - 62]], c, LW * 0.6); K.poly([[x - 46, yb - 64], [x - 32, yb - 84], [x - 28, yb - 54]], c, LW * 0.6);
  K.line(x - 64, yb - 38, x - 56, yb - 36, 3.5); K.line(x - 44, yb - 38, x - 36, yb - 36, 3.5);   // kapalı gözler
}
function telefon(K, ahize) {   // kapıcının duvar telefonu
  const { x, y } = TEL;
  K.rect(x - 36 + 6, y - 70 + 8, 72, 140, 'rgba(31,36,33,0.35)', 0, 10);
  K.rect(x - 36, y - 70, 72, 140, '#3F6E72', LW * 0.8, 10);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) K.rect(x + 2 + i * 14, y + 14 + j * 14, 9, 9, '#E9E4D6', 2, 2);
  if (!ahize) handset(K, [x - 16, y - 4], 0);
  kordon(K, [x - 20, y + 70], ahize ? ahizeAlt(ahize) : [x - 16, y + 52]);
}
function merdiven(K) {
  const { x0, adim, yuk, n } = MERDIVEN, { ctx } = K, pts = [[x0, 1500]];
  for (let i = 0; i < n; i++) { pts.push([x0 + i * adim, 1500 - (i + 1) * yuk], [x0 + (i + 1) * adim, 1500 - (i + 1) * yuk]); }
  pts.push([x0 + n * adim + 400, 1500 - n * yuk], [x0 + n * adim + 400, 1500]);
  K.poly(pts, '#CFC3A8', LW);
  for (let i = 0; i < n; i++) K.line(x0 + i * adim, 1500 - (i + 1) * yuk + 8, x0 + (i + 1) * adim, 1500 - (i + 1) * yuk + 8, 4, '#B3A68A');
  // korkuluk
  for (let i = 0; i < n; i += 2) K.line(x0 + 30 + i * adim, 1500 - (i + 1) * yuk, x0 + 30 + i * adim, 1500 - (i + 1) * yuk - 210, 6, INK);
  ctx.save(); ctx.lineCap = 'round';
  K.line(x0 + 10, 1500 - yuk - 220, x0 + n * adim + 40, 1500 - (n + 1) * yuk - 220, 22, INK);
  K.line(x0 + 10, 1500 - yuk - 220, x0 + n * adim + 40, 1500 - (n + 1) * yuk - 220, 12, '#8C6A44');
  ctx.restore();
}
function cayBardak(K, x, yb, k = 1.6) {   // ince belli çay bardağı ve tabağı (taban ortası)
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.ell(0, 0, 22, 5, PAL.cream, 3 / k);
  K.poly([[-14, -34], [14, -34], [9, -19], [12, -6], [10, -2], [-10, -2], [-12, -6], [-9, -19]], '#A8401F', 3.6 / k);
  ctx.restore();
}
M.mekanEkle(GIRIS, {
  gen: [-400, 1900], dongu: ['çayın buharı', 'kalorifer üstünde uyuyan kedinin kuyruğu', 'giriş kapısının camında sokak lambası'],
  kadraj: { kapici: [1.45, 640, 1010] },
  arka(K, t) {
    const { ctx } = K, I = IC;
    ctx.fillStyle = '#D9CBA8'; ctx.fillRect(-500, -400, 2500, 1900);                       // açık hardal sıva
    ctx.fillStyle = '#4F7F78'; ctx.fillRect(-500, 1140, 2500, 360);                         // alt yarı: fayans
    for (let x = -500; x < 2000; x += 60) K.line(x, 1140, x, 1500, 3, '#41706A');
    for (let y = 1200; y < 1500; y += 60) K.line(-500, y, 2000, y, 3, '#41706A');
    K.rect(-500, 1128, 2500, 18, '#E9DCC2', LW * 0.7);
    ctx.fillStyle = '#B9AE96'; ctx.fillRect(-500, 1500, 2500, 600); K.line(-500, 1500, 2000, 1500, LW);   // mozaik zemin
    for (let x = -480; x < 2000; x += 90) K.line(x, 1500, x - 160, 2100, 3, '#A59A82');
    // giriş kapısı (solda, kapalı; camında karanlık sokak ve lamba)
    K.rect(-140, 760, 250, 740, '#E9DCC2', LW);
    K.rect(-120, 780, 210, 720, '#6B4A33', LW);
    K.rect(-96, 810, 162, 420, '#1C3638', LW * 0.8);
    ctx.save(); ctx.beginPath(); ctx.rect(-96, 810, 162, 420); ctx.clip();
    K.rect(-10, 900, 12, 400, '#3A4442', 3); K.poly([[-24, 880], [16, 880], [10, 906], [-18, 906]], '#F4CF7A', 3);
    ctx.globalAlpha = 0.18; K.poly([[-20, 906], [12, 906], [80, 1240], [-90, 1240]], '#F4CF7A', 0); ctx.globalAlpha = 1;
    ctx.restore();
    K.line(-15, 810, -15, 1230, LW * 0.8);
    K.rect(50, 1180, 26, 60, PAL.mustard, LW * 0.6, 6);
    // duyuru panosu (yazısız renkli kâğıtlar)
    K.rect(740, 760, 190, 150, '#B8925E', LW * 0.8, 6);
    for (const [px, py, c] of [[756, 776, PAL.cream], [836, 784, PAL.coral], [762, 846, '#6FB3AC'], [842, 850, PAL.cream]]) { K.rect(px, py, 66, 48, c, LW * 0.5, 3); K.circ(px + 33, py + 5, 5, PAL.red, 2); }
    // kalorifer ve kedi
    K.rect(290, 1300, 210, 140, '#E9E4D6', LW * 0.8, 8);
    for (let i = 0; i < 7; i++) K.line(312 + i * 28, 1312, 312 + i * 28, 1428, 4, '#C9C3B6');
    kedi(K, 400, 1300, t);
    merdiven(K);
    // çay sehpası
    K.rect(SEHPA.x - 8, SEHPA.y + 14, 16, 1500 - SEHPA.y - 14, PAL.woodDark, LW * 0.8);
    K.rect(SEHPA.x - 70, 1484, 140, 16, PAL.woodDark, LW * 0.8, 6);
    K.ell(SEHPA.x, SEHPA.y + 6, 80, 16, PAL.woodTop, LW * 0.8);
    // kapının önünde paspas (boş)
    K.poly([[-150, 1512], [140, 1512], [170, 1560], [-180, 1560]], '#8C6A44', LW * 0.7);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    yer: 0.55, var: T('h1:4'), aysel: T('h1:5'), necmi: T('h1:6'), kerem: T('h1:8'), h1s: T('h1>'),
    grup: T('d1') - 0.1, sizinle: T('d1'), benimle: T('d1:2'), besK: T('d1:3'), bes: T('d1:5'), koydum: T('d1:7'), d1s: T('d1>'),
    zil: T('d1>') + 0.03, kap: T('k1') - 0.08,
    once: T('k1:2'), geldi: T('k1:5'), arka: T('k1:6'), keremK: T('k1:10'), tek: T('k1:12'), k1s: T('k1>'),
    h3c: T('h3') - 0.05, tamam: T('h3:1'), bes3: T('h3:2'), yeter: T('h3:4'), h3s: T('h3>'),
    n1: T('n1'), soyledi: T('n1:3'), bir: T('n1:4'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  tm.hik1 = tm.var - 0.1;
  tm.s1 = cd0 - 0.05; tm.s2 = cd0 + 4.1; tm.s3 = cd0 + 6.7;
  // diyafon: zil → Hikmet bakar, uzanır, ahizeyi alır, kulağa götürür (kapıcıya kesilir); h3'te askıya koyar
  tm.uzan = tm.zil + 0.08; tm.al = tm.uzan + 0.27; tm.kulak = tm.al + 0.36;
  tm.as0 = tm.h3c + 0.25; tm.as1 = tm.as0 + 0.38; tm.as2 = tm.as1 + 0.06;
  const film = H.sahneler([
    { id: 'kanca', mekan: SALON, t0: 0, cam: [[0, 1.22, 640, 1082]] },
    { id: 'hik1', mekan: SALON, t0: tm.hik1, cam: [[0, 1.5, 880, 992]] },
    { id: 'grup', mekan: SALON, t0: tm.grup, cam: [[0, 1.24, 632, 1080]] },
    { id: 'kapici', mekan: GIRIS, t0: tm.kap, cam: [[0, 1.45, 640, 1010]] },        // doğrusal itme kamera() ile
    { id: 'hik3', mekan: SALON, t0: tm.h3c, cam: [[0, 1.5, 880, 992]] },
    { id: 's1', mekan: SALON, t0: tm.s1, cam: [[0, 1.24, 632, 1084]] },
    { id: 's2', mekan: GIRIS, t0: tm.s2, cam: [[0, 1.45, 640, 1040]] },
    { id: 's3', mekan: SALON, t0: tm.s3, cam: [[0, 1.42, 560, 1082]] },
    { id: 'buldum', mekan: SALON, t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, DEF_X + 60, 1040]] },
    { id: 'cevap', mekan: SALON, t0: tm.cevap, cam: [[0, 1.3, 560, 1090]] },
    { id: 'cta', mekan: SALON, t0: tm.cta, kesme: false, cam: [[0, 1.34, 520, 1080]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/zoom|sert kesme sayısı|aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);

  // ——— pozlar (önden) ———
  const defBase = H.kisi('defne', { x: DEF_X, expr: SASKIN, head: { tilt: 4, look: [0.7, -0.1] }, ...POZ.dur });
  const def = [
    [0.7, { expr: MERAK, head: { tilt: -2, look: [0.75, -0.05] } }, 0.35],
    [tm.kerem, { expr: GULUS, head: { tilt: 3, look: [0.7, 0] } }, 0.3],
    [tm.grup, { expr: KONUS, head: { tilt: -2, look: [0.6, -0.05] } }, 0.01],
    [tm.benimle - 0.1, { head: { tilt: 2, look: [0.1, 0] } }, 0.3],
    [tm.bes - 0.1, { head: { tilt: 5, look: [0.35, 0.45] } }, 0.3],
    [tm.koydum + 0.2, { expr: GULUS, head: { tilt: 0, look: [0.2, 0.05] } }, 0.3],
    [tm.zil + 0.05, { expr: MERAK, head: { tilt: -3, look: [0.8, -0.2] } }, 0.25],
    [tm.s1, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 6, look: [-0.25, 0.5] } }, 0.01],
    [tm.s1 + 1.3, { head: { tilt: 4, look: [0.45, 0.5] } }, 0.6],
    [tm.s1 + 2.4, { head: { tilt: -3, look: [0.1, -0.3] } }, 0.4],
    [tm.s3, { expr: IFADE.dusun2, ...POZ.dusun, head: { tilt: 4, look: [0.3, 0.45] } }, 0.01],
    [tm.s3 + 1.4, { expr: MERAK, head: { tilt: -4, look: [0.85, -0.25] } }, 0.4],            // diyafona bakar
    [tm.s3 + 2.6, { expr: IFADE.dusun, head: { tilt: 5, look: [0.6, -0.1] } }, 0.4],
    [tm.n1 - 0.35, { expr: KONUS, armR: POZ.dur.armR, head: { tilt: -2, look: [0.05, 0] } }, 0.3],
    [tm.n1 + 0.05, { head: { tilt: -3, look: [0.75, -0.2] } }, 0.25],                         // "Kapıcı": diyafona bakar
    [tm.bir - 0.1, { head: { tilt: 3, look: [0.0, 0.02] } }, 0.3],                            // izleyiciye döner
    [tm.n1s + 0.25, { expr: GULUS, head: { tilt: -3, look: [0.05, 0.05] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.5, 0.4] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -4, look: [0.05, 0.05] } }, 0.3],
  ];
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: GURUR, head: { tilt: -3, look: [-0.7, 0.05] }, ...POZ.dur });
  const hik = [
    [0.9, { head: { tilt: -2, look: [-0.25, -0.05] } }, 0.35],
    [tm.grup, { expr: GURUR, head: { tilt: -2, look: [-0.75, 0.05] } }, 0.01],
    [tm.bes, { head: { tilt: 4, look: [-0.7, 0.4] } }, 0.35],
    [tm.zil + 0.04, { expr: MERAK, head: { tilt: 3, look: [-0.85, 0.05] } }, 0.22],
    [tm.h3c, { expr: KONUS, head: { tilt: 3, look: [-0.75, 0.05] } }, 0.01],
    [tm.bes3 - 0.15, { head: { tilt: 5, look: [-0.75, 0.45] } }, 0.3],
    [tm.yeter, { expr: KONUS, head: { tilt: -4, look: [-0.2, -0.05] } }, 0.3],
    [tm.s1, { expr: GURUR, head: { tilt: 5, look: [-0.7, 0.45] } }, 0.01],
    [tm.s1 + 1.6, { expr: GULUS, head: { tilt: -2, look: [-0.75, 0.1] } }, 0.4],
  ];
  const kapBase = H.charBase(KAP, { x: KAP_X, y: 1500, s: S_KAP, expr: KONUS, head: { nod: 0, tilt: -2, look: [0.1, 0] }, ...POZ.dur });
  const kap = [
    [tm.geldi - 0.3, { head: { tilt: 4, look: [0.75, -0.35] } }, 0.3],
    [tm.arka + 0.5, { head: { tilt: -2, look: [0.1, -0.05] } }, 0.35],
    [tm.k1s + 0.2, { expr: DALGIN, head: { tilt: 2, look: [0.1, 0] } }, 0.3],
    [tm.s2, { expr: GURUR, head: { tilt: 3, look: [0.6, 0.4] } }, 0.01],
    [tm.s2 + 1.3, { expr: GULUS, head: { tilt: -2, look: [0.2, 0.2] } }, 0.35],
    [tm.s2 + 2.2, { expr: GURUR, head: { tilt: 4, look: [0.8, -0.35] } }, 0.4],
  ];
  // Altyazı çizelgesi: k1'i kapıcı söyler (dudak ve balon kuyruğu figürana); TTS'teki "Ay seller" tek kelimeye birleşir
  // (balon cümle cümle bölünebilsin). n1 son repliktir (cevapsız kesim); balonu "Buldum!"a kadar ekranda kalır.
  const tlA = { ...tl, lines: tl.lines.map(l => {
    if (l.id === 'k1') {
      const w = l.words, i = w.findIndex(x => x.w === 'Ay');
      const words = i >= 0 ? [...w.slice(0, i), { w: 'Ayseller', t0: w[i].t0, t1: w[i + 1].t1 }, ...w.slice(i + 2)] : w;
      return { ...l, who: KAP, words };
    }
    return l.id === 'n1' ? { ...l, t1: T('d3') - 0.25 } : l;
  }) };
  return { tm, film, tlA, defBase, def, hikBase, hik, kapBase, kap };
}

// ═══════════════════════════ Nesne durumları (tek kaynak) ═══════════════════════════
// Defne'nin koyduğu tabak: kare 0'da elde (yerinin 48 px üstünde), 0,2 sn'de iner, tm.yer'de masaya değer (sekme yok)
function sonTabakAt(t, tm) {
  const [x, y] = TABAK[SON_TABAK];
  const p = H.dus(t, 0.2, tm.yer, [x + 4, y - 48], [x, y]);
  return { p, elde: t < tm.yer + 0.1 };
}
// Hikmet'in ahizesi: askıda | elde (kulakta). Dönen null (askıda) ya da { p (el), a }
function hikAhize(t, tm, hp) {
  const hd = H.eklem('hikmet', hp, 'head'), kulak = [hd[0] - 0.4 * hp.s, hd[1] + 0.12 * hp.s];
  const ask = [DIY.x - 14, DIY.y - 4];
  if (t < tm.al || t >= tm.as1) return null;
  if (t < tm.kulak) { const u = ease.state(seg(t, tm.al, tm.kulak - tm.al)); return { p: H.yay(ask, kulak, u, 40), a: lerp(0, 0.32, u) }; }
  if (t < tm.as0) return { p: kulak, a: 0.32 };
  const u = ease.state(seg(t, tm.as0, tm.as1 - tm.as0)); return { p: H.yay(kulak, ask, u, 30), a: lerp(0.32, 0, u) };
}
// Kapıcının ahizesi: k1 boyunca kulakta; sayaçta askıda
function kapAhize(t, tm, kp, id) {
  if (id !== 'kapici') return null;
  const hd = H.eklem(KAP, kp, 'head');
  return { p: [hd[0] - 0.42 * kp.s, hd[1] + 0.12 * kp.s], a: -0.3 };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç perdesi sahneyi örtmesin)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id, lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
    if (id === 'kapici') Object.assign(cam, { zoom: lg(1.45, 1.52, clamp01((t - tm.kap) / (tm.h3c - tm.kap))), cx: 640, cy: 1010 });
    else if (id === 's1') Object.assign(cam, { zoom: lg(1.24, 1.3, clamp01((t - tm.s1) / 4.15)), cx: 632, cy: 1084 });
    else if (id === 's2') Object.assign(cam, { zoom: lg(1.45, 1.5, clamp01((t - tm.s2) / 2.6)), cx: 640, cy: 1040 });
    else if (id === 's3') Object.assign(cam, { zoom: lg(1.42, 1.5, clamp01((t - tm.s3) / (tm.buldum - tm.s3))), cx: 560, cy: lerp(1082, 1088, clamp01((t - tm.s3) / (tm.buldum - tm.s3))) });
  },
  dunya(K, t, B) { if (B.sc.mekan === GIRIS) girisSahne(K, t, S, B); else salonSahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (071'den): perde yok, alt bantta. Daire solda, başlık ve paylaşım hapı sağında.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 172, y = 1320, r = 80;
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

// Masanın üstüne uzanan kol: masanın arka kenarının altında kalan kısmını masadan sonra yeniden çizer (070'den)
function kolUst(K, key, p, side, a = 1) {
  if (a <= 0.01) return;
  const { ctx } = K, c = H.CARDS[key], s = p.s, j = n => H.eklem(key, p, n + side), sh = j('sh'), el = j('el'), ha = j('hand');
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(-5000, TB - 2, 10000, 3000); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = (c.arm.w + c.line * 2) * s; ctx.stroke();
  ctx.strokeStyle = c.arm.color; ctx.lineWidth = c.arm.w * s; ctx.stroke();
  ctx.restore();
}
// Kasket: başın yerel çerçevesinde (birim: baş yüksekliği), drawChar'dan SONRA
function kasket(K, p) {
  const c = H.CARDS[KAP], hd = H.eklem(KAP, p, 'head'), { ctx } = K;
  ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate((p.head.tilt || 0) * D2R); ctx.scale(p.s, p.s); ctx.translate(0, (p.head.nod || 0) * 0.055);
  const lw = 0.026;
  ctx.beginPath(); ctx.moveTo(-0.5, -0.2); ctx.bezierCurveTo(-0.56, -0.5, -0.32, -0.66, 0, -0.66); ctx.bezierCurveTo(0.34, -0.66, 0.6, -0.52, 0.54, -0.2); ctx.closePath();
  ctx.fillStyle = c.kasket; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-0.08, -0.64); ctx.quadraticCurveTo(0.06, -0.42, 0.02, -0.22); ctx.lineWidth = lw * 0.7; ctx.stroke();   // dikiş
  ctx.beginPath(); ctx.ellipse(0.04, -0.2, 0.42, 0.075, 0, 0, TAU); ctx.fillStyle = c.kasketKoyu; ctx.fill(); ctx.lineWidth = lw; ctx.stroke();   // siper
  ctx.restore();
}

// ——— Salon ———
function salonSahne(K, t, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, tl = S.tlA;
  M.mekanCiz(K, SALON, 'arka', t);
  const zil = t >= tm.zil && t < tm.zil + 0.45 ? Math.abs(H.sars(t, tm.zil, 0.45, 18)) : 0;

  // ——— Hikmet (mutfak kapısında, önlüklü; sayaçtan sonra mutfakta, kadraj dışı) ———
  const hikVar = ['kanca', 'hik1', 'grup', 'hik3', 's1'].includes(id);   // s1: kapıda sofraya bakar; s3'ten sonra mutfakta (kadraj dışı)
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
  let ah = null, hc = null, hPar = null, hAc = null;
  if (hikVar) {
    const hO = { heads };
    // h1: sağ el başın yanında, adlarla parmak sayar (bir, iki, üç)
    const wS = pIn(t, tm.aysel - 0.35, tm.h1s + 0.05, 0.28, 0.3);
    if (wS > 0.01) {
      hO.R = [kar(H.elYeri('hikmet', hp, 'R', 'asagi'), H.elYeri('hikmet', hp, 'R', 'yukari'), wS), 1, 'B'];   // diyafondan uzak elle; el yol boyunca kalkar
      if (wS > 0.6) hPar = ['R', [tm.aysel, tm.necmi, tm.kerem].reduce((n, a) => n + seg(t, a - 0.04, 0.16), 0), { toplam: 3, ac: 0.3 }];
    }
    if (id === 'grup') H.onayla(hp, t, tm.besK + 0.05, 1, 0.38);
    if (id === 's1') H.onayla(hp, t, tm.s1 + 1.9, 2, 0.36);   // beş tabağa bakıp kendinden emin başını sallar
    // diyafon: uzanır, alır, kulağa götürür · h3: askıya koyar, sonra açık eliyle sofrayı gösterir
    ah = hikAhize(t, tm, hp);
    const wU = W(t, tm.uzan, tm.al - tm.uzan);
    if (t >= tm.uzan && t < tm.al) hO.L = [kar(H.elYeri('hikmet', hp, 'L', 'asagi'), [DIY.x - 14, DIY.y - 4], wU), 1, 'B'];   // el düz yoldan diyafona
    else if (ah) hO.L = [ah.p, 1, 'B'];
    else if (t >= tm.as1 && t < tm.as2 + 0.3) hO.L = [[DIY.x - 14, DIY.y - 4], 1 - W(t, tm.as2, 0.3), 'B'];
    const wG = id === 'hik3' ? pIn(t, tm.bes3 - 0.2, tm.h3s + 0.6, 0.3) : 0;   // "Beş tabak": açık avuçla sofrayı gösterir
    if (wG > 0.01 && !ah) { hO.L = [[hp.x - 175, 1150], wG, 'A']; if (wG > 0.6) hAc = true; }
    hc = oyna(K, t, tl, 'hikmet', hp, hO);
    onluk(K, hp);
  }
  // ——— Defne (masanın arkasında) ———
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t);
  dp.y -= H.buldumHop(t, tm.buldum);
  const dO = { heads };
  const st = sonTabakAt(t, tm), tabakEl = [st.p[0] + 46, st.p[1] - 6];
  let wM = 0, dGos = null, dAc = null;                                         // wM: kol masanın üstünde (kolUst)
  if (id === 'kanca' && t < tm.yer + 0.5) {                                    // kare 0: tabak elde; koyar, eli çeker
    // el önce masanın arka kenarının üstüne (gövdeye) döner, sonra masanın arkasına iner: kol saydamlaşmaz
    const t0 = tm.yer + 0.1, el = H.iz([[0, tabakEl], [t0, GOVDE, 0.28], [t0 + 0.3, DINLEN, 0.22]], t);
    dO.R = [el, 1, 'A']; wM = t < t0 + 0.29 ? 1 : 0;
  } else if (id === 'grup') {
    const wSz = pIn(t, tm.sizinle - 0.2, tm.benimle - 0.12, 0.25);           // "Sizinle": açık avuç Hikmet'e
    const wBn = pIn(t, tm.benimle - 0.12, tm.bes - 0.2, 0.25);               // "benimle": el göğsünde
    const wBs = pIn(t, tm.bes - 0.2, tm.koydum + 0.45, 0.3), tR = tm.koydum + 0.45;   // "Beş tabak koydum": avuç sofranın üstünde gezer
    if (t >= tm.bes - 0.2 && t < tR + 0.6) {   // göğüsten sofraya gelir; dönüşte gövdeden geçip masanın arkasına iner (kol saydamlaşmaz)
      const u = ease.state(seg(t, tm.bes, 0.75)), gez = [lerp(470, 585, u), 1168];
      const el = t < tR ? kar([DEF_X + 34, 1118], gez, W(t, tm.bes - 0.2, 0.3)) : H.iz([[0, gez], [tR, GOVDE, 0.28], [tR + 0.3, DINLEN, 0.22]], t);
      dO.R = [el, 1, 'A']; wM = t < tR + 0.29 ? 1 : 0; if (t > tm.bes && t < tR) dAc = { yon: 0.9 };
    }
    else if (wSz > 0.01) { dO.R = [[DEF_X + 205, 1075], wSz, 'B']; if (wSz > 0.6) dAc = { yon: -0.15 }; }
    else if (wBn > 0.01) dO.R = [[DEF_X + 34, 1118], wBn, 'A'];
  } else if (id === 's3') {
    const wP = pIn(t, tm.n1 - 0.1, tm.bir - 0.05, 0.28);                     // "Kapıcı adları…": diyafonu gösterir
    if (wP > 0.01) { dO.R = [[DIY.x - 40, DIY.y + 30], wP, 'B']; if (wP > 0.6) dGos = [DIY.x - 6, DIY.y]; }
    if (t > tm.n1 - 0.4) dp.blink = 0;
  } else if (id === 'cevap') {
    const wP = W(t, tm.cevap + 0.2, 0.3); dO.R = [[560, 1160], wP, 'A']; wM = wP;
  }
  const dc = oyna(K, t, tl, 'defne', dp, dO);

  masa(K);
  for (let i = 0; i < TABAK.length; i++) if (i !== SON_TABAK) { tabak(K, TABAK[i]); catal(K, TABAK[i][0] - TABAK[i][2] - 16, TABAK[i][1]); }
  catal(K, TABAK[SON_TABAK][0] - TABAK[SON_TABAK][2] - 16, TABAK[SON_TABAK][1]);
  kase(K, t);
  if (!st.elde) tabak(K, [...st.p, TABAK[SON_TABAK][2], TABAK[SON_TABAK][3]]);
  kolUst(K, 'defne', dp, 'R', wM);
  if (st.elde) tabak(K, [...st.p, TABAK[SON_TABAK][2], TABAK[SON_TABAK][3]]);
  if (st.elde && id === 'kanca') dc.tut('R');
  else if (wM > 0.5) { dc.tut('R'); if (dAc) dc.parmak('R', 4, { toplam: 4, ac: 0.26, yon: dAc.yon }); }
  else if (dAc) dc.parmak('R', 4, { toplam: 4, ac: 0.26, yon: dAc.yon });
  if (dGos) dc.isaret('R', dGos);

  // diyafon (masanın arkasındaki duvarda; ahize elde ise kordon ele uzanır)
  diyafon(K, t, ah, zil);
  if (hc) {
    if (ah) { handset(K, ah.p, ah.a); hc.tut('L'); }
    else if (t >= tm.uzan && t < tm.al) hc.tut('L');
    if (hPar) hc.parmak(...hPar);
    if (hAc) hc.parmak('L', 4, { toplam: 4, ac: 0.24, yon: Math.PI - 0.25 });
  }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}

// ——— Apartman girişi: kapıcı Rıza Efendi ———
function girisSahne(K, t, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, tl = S.tlA;
  M.mekanCiz(K, GIRIS, 'arka', t);
  const kp = H.poseAt(H.CARDS[KAP], S.kapBase, S.kap, t);
  const ah = kapAhize(t, tm, kp, id), kO = { heads };
  let kGos = null, bardakEl = false;
  if (ah) kO.L = [ah.p, 1, 'B'];
  if (id === 'kapici') {
    const wP = pIn(t, tm.geldi - 0.3, tm.arka + 0.85, 0.3, 0.35);             // "geldi": boştaki eliyle merdiveni gösterir
    const kalk = 30 * H.nabiz(t, tm.arka, 0.4);                                // "Arkalarından": el bir kez yukarı işaret eder
    if (wP > 0.01) { kO.R = [[KAP_X + 205, 1040 - kalk], wP, 'B']; if (wP > 0.6) kGos = [MERDIVEN.x0 + 150, 1500 - 3 * MERDIVEN.yuk - 215]; }
    H.onayla(kp, t, tm.tek - 0.05, 1, 0.4);
  } else if (id === 's2') {                                                    // çay bardağını sehpadan alır, göğsünde tutar
    const al = tm.s2 + 0.35, u = ease.enter(seg(t, al + 0.3, 0.4));
    const yer = [SEHPA.x, SEHPA.y + 2], el = kar([yer[0] - 2, yer[1] - 68], [KAP_X + 96, 1112], u);
    kO.R = [el, W(t, al, 0.3), 'A']; bardakEl = t >= al + 0.3;
  }
  const kc = oyna(K, t, tl, KAP, kp, kO);
  kasket(K, kp);
  // çay (sehpada ya da elde) · döngü: buhar
  const bp = bardakEl ? [kc.handR[0] + 2, kc.handR[1] + 72] : [SEHPA.x, SEHPA.y + 4], bk = 2;
  H.buhar(K, bp[0], bp[1] - 38 * bk - 8, t, { k: 0.4, n: 2, ara: 12, boy: 64 });
  cayBardak(K, bp[0], bp[1], bk);
  if (bardakEl) kc.tut('R');
  else if (id === 's2' && t >= tm.s2 + 0.35) kc.tut('R');
  telefon(K, ah);
  if (ah) { handset(K, ah.p, ah.a); kc.tut('L'); }
  if (kGos) kc.isaret('R', kGos);
}
