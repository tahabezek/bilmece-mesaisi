// Bölüm 93 · HEM AMCA HEM DAYI (v4 "hikâye" dili, kısa format, cevapsız tasarım; storyboard: hikayeler/bolum_093_v5.md).
// Mekanizma: kardeşlik tek ebeveynle de kurulur (dünürler evlenmiş; cevap arşivde kalır, kesilir).
// Logline: Bayram sonrası ofis. Necmi bayram fotoğrafını gösterir: yanında kendi yaşında bir adam, Rıza. "Bu Rıza; benim hem
// amcam hem dayım. Benden bir yaş da küçük." Defne: "Olamaz, o zaman annenle baban kardeş olur." Necmi: "Değil, aralarında
// kan bağı yok." Hikmet: "O zaman biri eniştendir." Necmi: "Hayır, Rıza'nın annemle de babamla da kan bağı var."
// İpucu (Necmi fotoğraftaki duvar çerçevesine dokunur): "Arkadaki çerçeveye iyi bakın." Çerçevede orta yaşlı bir çiftin
// eski (sepya) düğün fotoğrafı var; kimin düğünü olduğu söylenmez, yazılmaz.
// Akılda kalacak tek şey: kardeş olmak için iki ebeveyn birden gerekmez.
// Rıza yalnız fotoğrafta görünür, konuşmaz. Necmi'nin kartının oranlarıyla (aynı drawCharacter, aynı iskelet) bu dosyada
// yaşıt ama farklı biri olarak kurulur: kır geriye taranmış saç, kalın bıyık, gözlüksüz, kahverengi bayramlık takım.
// Kerem bu bölümde yok. Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Fotoğraftaki kişiler (kadroya eklenmez) ═══════════════════════════
const RZ = 'b093_riza', DAMAT = 'b093_damat', GELIN = 'b093_gelin';
if (!H.CARDS[RZ]) {
  const n = H.CARDS.necmi, d = H.CARDS.defne;
  // Rıza: Necmi'nin oranları ve iskeleti; yaşıt (kır saç), ama saçı gür ve geriye taranmış, kalın bıyıklı, gözlüksüz, takım elbiseli
  H.CARDS[RZ] = {
    ...n, key: RZ, name: 'Rıza', role: 'Necmi\'nin hem amcası hem dayısı (yalnız fotoğrafta)', seed: 931,
    head: { w: 0.92, h: 1.0, ear: 0.12 },
    torso: { ...n.torso, color: '#7A5238', shade: '#61412C', belly: 0.13 },
    arm: { ...n.arm, color: '#7A5238', shade: '#61412C' },
    leg: { ...n.leg, color: '#4A3A2E', shade: '#3A2E24' },
    skin: '#C9916A', skinShade: '#AF7852', hair: '#8A847E',
    eyes: { ...n.eyes, lid: 0.18 },
    features: ['suit', 'tie', 'hairSlick', 'mustacheThick'],
  };
  // Eski düğün fotoğrafındaki çift (sepya, çok küçük): orta yaşlı damat ve gelin
  H.CARDS[DAMAT] = {
    ...n, key: DAMAT, name: 'damat', role: 'duvar çerçevesi', seed: 932,
    torso: { ...n.torso, color: '#3B3A38', shade: '#2C2B29', belly: 0.08 }, arm: { ...n.arm, color: '#3B3A38', shade: '#2C2B29' },
    hair: '#4A3E35', features: ['suit', 'tie', 'hairSlick', 'greyTemples', 'mustacheThick'],
  };
  H.CARDS[GELIN] = {
    ...d, key: GELIN, name: 'gelin', role: 'duvar çerçevesi', seed: 933,
    torso: { ...d.torso, color: '#F4F1EA', shade: '#DCD6CA' }, arm: { ...d.arm, color: '#F4F1EA', shade: '#DCD6CA' },
    hair: '#6E5D50', features: ['bun'],
  };
}

// ═══════════════════════════ Ölçüler (dünya) ═══════════════════════════
const OFIS = 'b093_ofis';
const X = { hikmet: 320, necmi: 540, defne: 760 };
const Y = { necmi: 1362, hikmet: 1460, defne: 1420 };   // 40 px yukarıda; Necmi 18 px daha (ağzı çerçevenin üst kenarının üstünde kalır)
const MASA = { ust: 1181, on: 1211 };
const FW = 300, FH = 228;                               // çerçeve (yerel birim; dünyada k = 1)
const FK = 0.85;                                        // odadaki çerçevenin ölçeği (üst kenarı Necmi'nin çenesinin altında)
const FOTO_MASA = [540, 1078];                          // masada, ayağının üstünde
const FOTO_EL = [540, 1068];                            // Necmi'nin elinde
const CAY_H = [212, 1170], CAY_D = [872, 1170];         // çay bardakları (taban)
const LOKUM = [760, 1178];                              // lokum kutusu (taban ortası)
// Kameralar [zoom, cx, cy]. Kart 300–509 px: saç tepeleri ≥ 540 px.
const KAM = {
  grup: [1.3, 540, 985],
  hikmet: [1.5, 404, 1006],
  defne: [1.5, 676, 1006],
  necmi: [1.6, 540, 1000],
  ikili: [1.42, 432, 1000],
  insert: [1.0, 3000, 960],
  buldum: [1.5, 700, 1006],
};
// Yakın plânlarda kadraj kenarında yarım yüz kalmasın: o plânda görünmeyecek kişiler dışarı kaydırılır
const KAY = {
  hikmet: { necmi: 430, defne: 330 },
  defne: { necmi: -430, hikmet: -330 },
  necmi: { hikmet: -330, defne: 330 },
  ikili: { defne: 330 },
  buldum: { necmi: -430, hikmet: -330 },
};
// Insert sahnesi: çerçeve kameraya doğru tutulur (ayrı dünya bölgesi)
const IC = [3000, 905], IK = 2.6;

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz)
const IF = {
  notr: { brow: 0, browTilt: 0, eye: 1, pupil: 1, curve: 0.1, open: 0, w: 0.95 },
  ciddi: { brow: 0.02, browTilt: 0.12, eye: 1.0, pupil: 1, curve: 0.04, open: 0, w: 0.9 },
  merak: { brow: 0.08, browTilt: -0.05, eye: 1.12, pupil: 0.85, curve: 0.06, open: 0, w: 0.8 },
  sasir: { brow: 0.11, browTilt: -0.07, eye: 1.24, pupil: 0.8, curve: 0.0, open: 0, w: 0.7 },
  supheli: { brow: -0.04, browTilt: 0.32, eye: 0.62, pupil: 1, curve: -0.04, open: 0, w: 0.85 },
  emin: { brow: -0.02, browTilt: 0.18, eye: 0.95, pupil: 1, curve: 0.24, open: 0, w: 0.9 },
  sakin: { brow: 0.03, browTilt: -0.04, eye: 1.0, pupil: 1, curve: 0.16, open: 0, w: 0.9 },
  keyif: { brow: 0.1, browTilt: -0.12, eye: 0.55, pupil: 1, curve: 0.4, open: 0, w: 1.0 },
  dusun: { brow: 0.07, browTilt: -0.04, eye: 1.0, pupil: 0.95, curve: 0.04, open: 0, w: 0.8 },
  gulus: { brow: 0.05, browTilt: -0.1, eye: 0.95, pupil: 1, curve: 0.66, open: 0, w: 1.12 },
  foto: { brow: 0.04, browTilt: -0.08, eye: 0.82, pupil: 1, curve: 0.55, open: 0, w: 1.05 },
};

// ═══════════════════════════ Nesne: bayram fotoğrafı ═══════════════════════════
// Fotoğraftaki kişi: başın merkezi (hy) yerel birimde verilir; ayakların yeri buradan bulunur
function fotoKisi(K, key, x, hy, s, o = {}) {
  const p = H.charBase(key, { x, y: 0, s, expr: o.expr || IF.foto, blink: 0, ...POZ.dur, head: { tilt: o.tilt || 0, look: [0, 0.02] } });
  const h = H.eklem(key, p, 'head'); p.y = hy - h[1];
  if (o.armL) p.armL = o.armL; if (o.armR) p.armR = o.armR;
  return [p, H.drawChar(K.ctx, key, p, 0)];
}
// Duvardaki eski düğün fotoğrafı (yerel, merkez [0, −66]): sepya, orta yaşlı çift; gelinin duvağı ve çiçeği
function dugunCercevesi(K) {
  const { ctx } = K, cx = 0, cy = -66, w = 62, h = 50;
  ctx.save(); ctx.translate(0, -64); ctx.scale(1.3, 1.3); ctx.translate(0, 66);   // telefonda okunsun: 1,3 kat (80 × 65)
  K.rect(cx - w / 2 + 3, cy - h / 2 + 4, w, h, 'rgba(40,25,10,0.25)', 0, 2);
  K.rect(cx - w / 2, cy - h / 2, w, h, '#B8893A', 2.2, 2);
  const iw = w - 12, ih = h - 12;
  ctx.save(); ctx.beginPath(); ctx.rect(cx - iw / 2, cy - ih / 2, iw, ih); ctx.clip();
  K.rect(cx - iw / 2, cy - ih / 2, iw, ih, '#E3CFA4', 0, 0);
  // duvak (gelinin arkasında)
  ctx.beginPath(); ctx.moveTo(cx + 9, cy - 16); ctx.quadraticCurveTo(cx + 25, cy - 8, cx + 24, cy + 20); ctx.lineTo(cx + 4, cy + 20); ctx.quadraticCurveTo(cx + 3, cy - 6, cx + 9, cy - 16); ctx.closePath();
  ctx.fillStyle = '#FBF7EE'; ctx.fill(); ctx.lineWidth = 0.9; ctx.strokeStyle = INK; ctx.stroke();
  fotoKisi(K, DAMAT, cx - 9, cy - 6, 9.5, { expr: IF.sakin });
  fotoKisi(K, GELIN, cx + 11, cy - 5, 9.5, { expr: IF.foto });
  // duvak bandı ve çiçek
  ctx.beginPath(); ctx.ellipse(cx + 11, cy - 10.5, 5.6, 1.6, 0, 0, TAU); ctx.fillStyle = '#FBF7EE'; ctx.fill(); ctx.lineWidth = 0.8; ctx.strokeStyle = INK; ctx.stroke();
  for (const [dx, dy, c] of [[-2, 0, '#F2EDE2'], [2, -1, '#E8C9A8'], [0, 2, '#F2EDE2']]) K.circ(cx + 10 + dx, cy + 14 + dy, 2.2, c, 0.7);
  ctx.fillStyle = 'rgba(150,105,50,0.32)'; ctx.fillRect(cx - iw / 2, cy - ih / 2, iw, ih);   // sepya
  ctx.restore();
  K.rect(cx - iw / 2, cy - ih / 2, iw, ih, null, 1.2, 0);
  ctx.restore();
}
// Fotoğrafın içi (yerel birim, çerçevenin merkezi 0,0; iç alan 268 × 196)
function fotoIcerik(K) {
  const { ctx } = K, iw = 268, ih = 196;
  ctx.save(); ctx.beginPath(); ctx.rect(-iw / 2, -ih / 2, iw, ih); ctx.clip();
  K.rect(-iw / 2, -ih / 2, iw, ih, '#EBD8B0', 0, 0);                                   // bayram evinin duvarı
  for (let x = -iw / 2 + 10; x < iw / 2; x += 22) K.rect(x, -ih / 2, 8, ih, '#E3CC9E', 0, 0);
  dugunCercevesi(K);
  // koltuğun sırtı (kişilerin arkasında)
  ctx.beginPath(); ctx.moveTo(-iw / 2 - 4, 98); ctx.lineTo(-iw / 2 - 4, 18); ctx.quadraticCurveTo(-60, 2, 0, 8); ctx.quadraticCurveTo(60, 2, iw / 2 + 4, 18); ctx.lineTo(iw / 2 + 4, 98); ctx.closePath();
  K.fs('#A9573E', 2);
  K.line(-iw / 2, 40, iw / 2, 40, 1.6, '#8E4632');
  // Necmi (solda) ve Rıza (sağda) yan yana; aynı ölçek, aynı boy hizası
  fotoKisi(K, 'necmi', -72, -30, 66, { armR: { sh: 26, el: -20 } });
  fotoKisi(K, RZ, 72, -31, 66, { armL: { sh: 22, el: -18 } });
  ctx.restore();
}
// Çerçeve: c merkez (dünya), k ölçek, o = { rot, sx, sy, ayak }
function foto(K, c, k, o = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(o.rot || 0); ctx.scale(k * (o.sx ?? 1), k * (o.sy ?? 1)); ctx.lineJoin = 'round';
  if (o.ayak) K.poly([[FW / 2 - 70, FH / 2 - 30], [FW / 2 - 40, FH / 2 + 8], [FW / 2 - 92, FH / 2 + 8]], '#5E3B22', LW * 0.5);   // arka ayak
  K.rect(-FW / 2 + 7, -FH / 2 + 9, FW, FH, 'rgba(20,30,28,0.22)', 0, 8);
  K.rect(-FW / 2, -FH / 2, FW, FH, '#8A5A35', LW * 0.75, 8);                            // ahşap çerçeve
  K.rect(-FW / 2 + 6, -FH / 2 + 6, FW - 12, FH - 12, null, 2, 5);
  ctx.strokeStyle = '#A8754A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-FW / 2 + 10, -FH / 2 + 4); ctx.lineTo(FW / 2 - 10, -FH / 2 + 4); ctx.stroke();
  fotoIcerik(K);
  K.rect(-134, -98, 268, 196, null, 2.4, 0);
  ctx.restore();
}
// Yerel çerçeve noktası → dünya
const fotoNok = (c, k, o, [lx, ly]) => { const r = o.rot || 0, cs = Math.cos(r), sn = Math.sin(r); lx *= k * (o.sx ?? 1); ly *= k * (o.sy ?? 1); return [c[0] + lx * cs - ly * sn, c[1] + lx * sn + ly * cs]; };

// Lokum kutusu (açık, pembe ve beyaz küpler)
function lokumKutusu(K) {
  const [x, y] = LOKUM;
  K.poly([[x - 64, y], [x + 64, y], [x + 56, y - 34], [x - 56, y - 34]], '#C9573F', LW * 0.6);
  K.poly([[x - 56, y - 34], [x + 56, y - 34], [x + 50, y - 42], [x - 50, y - 42]], '#E9C9A0', LW * 0.5);
  const r = H.mulberry32(93);
  for (let i = 0; i < 7; i++) { const lx = x - 44 + i * 14.5, ly = y - 48 - 4 * r(); K.rect(lx - 7, ly - 7, 14, 14, i % 2 ? '#F6F0E6' : '#EBA3B0', 2, 3); }
  K.line(x - 48, y - 17, x + 48, y - 17, 3, '#F0D27A');
}
// Çay bardağı (ince belli) ve tabağı; kaşık (Hikmet'in bardağında)
function cay(K, [x, y], kasik = null) {
  const { ctx } = K;
  K.ell(x, y, 34, 7, '#E9E2D0', LW * 0.5);
  ctx.beginPath(); ctx.moveTo(x - 17, y - 66); ctx.quadraticCurveTo(x - 6, y - 40, x - 15, y - 6); ctx.lineTo(x + 15, y - 6); ctx.quadraticCurveTo(x + 6, y - 40, x + 17, y - 66); ctx.closePath();
  K.fs('rgba(240,246,244,0.9)', LW * 0.5);
  ctx.beginPath(); ctx.moveTo(x - 14, y - 52); ctx.quadraticCurveTo(x - 6, y - 38, x - 14, y - 8); ctx.lineTo(x + 14, y - 8); ctx.quadraticCurveTo(x + 6, y - 38, x + 14, y - 52); ctx.closePath();
  ctx.fillStyle = '#B5482A'; ctx.fill();
  if (kasik) K.line(kasik[0], kasik[1], x + 4, y - 30, 4, '#9AA3A6');
}

// ═══════════════════════════ Mekân: ofis, bayram sonrası ═══════════════════════════
function masa(K) {
  const x0 = -600, x1 = 1900, { ctx } = K;
  K.rect(x0, MASA.ust, x1 - x0, MASA.on - MASA.ust, '#C79A68', LW * 0.8, 0);      // ahşap masa üstü
  K.line(x0, MASA.ust + 7, x1, MASA.ust + 7, 3, '#D9B285');
  // örtü: masanın önünden sarkar (altyazı ve sayaç bunun üstünde durur; alt bant boş kalmaz)
  const y0 = MASA.on - 2, h = 640;
  K.rect(x0, y0, x1 - x0, h, '#2F6F6A', LW * 0.7, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, h); ctx.clip();
  K.rect(x0, y0 + 14, x1 - x0, 30, '#E7C46A', 0, 0);
  for (let x = x0; x < x1; x += 64) K.poly([[x, y0 + 29], [x + 16, y0 + 17], [x + 32, y0 + 29], [x + 16, y0 + 41]], '#C9573F', 0);
  K.rect(x0, y0 + 50, x1 - x0, 6, '#E7C46A', 0, 0);
  for (let x = x0 + 30; x < x1; x += 120) for (let y = y0 + 120; y < y0 + h; y += 120) K.poly([[x, y - 10], [x + 10, y], [x, y + 10], [x - 10, y]], '#3E8079', 0);
  ctx.restore();
}
M.mekanEkle(OFIS, {
  gen: [-600, 1900], dongu: ['pencerede martı', 'çay bardaklarından buhar'],
  kadraj: { grup: KAM.grup },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -700, x1: 2000, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, -150, 600, 330, 400, { isik, t, manzara: 'istanbul', marti: true });
    M.duvarSaati(K, 930, 690, 62, 10.2 + t / 3600, t);
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.095, buldum: T('d3'), proof: T('d3>') + 0.05, cevap: T('d3>') + 0.15,
    n0: T('n0'), riza: T('n0:1'), amcam: T('n0:4'), dayim: T('n0:6'), benden: T('n0:7'), kucuk: T('n0:11'), n0s: T('n0>'),
    h2: T('h2'), amca: T('h2:0'), dayi: T('h2:3'), h2s: T('h2>'),
    d2: T('d2'), annenle: T('d2:3'), kardes: T('d2:5'), d2s: T('d2>'),
    n2: T('n2'), kan2: T('n2:2'), yok: T('n2:4'), n2s: T('n2>'),
    h3: T('h3'), biri: T('h3:2'), h3s: T('h3>'),
    n3: T('n3'), annemle: T('n3:2'), babamla: T('n3:4'), kan3: T('n3:6'), n3s: T('n3>'),
    n1: T('n1'), cerceve: T('n1:1'), iyi: T('n1:2'), n1s: T('n1>'),
  };
  tm.insKes = tm.benden - 0.04;                 // insert: balon değişimiyle aynı karede
  tm.hikKes = tm.h2 - 0.1; tm.defKes = tm.d2 - 0.12; tm.necKes = tm.n2 - 0.12; tm.ikiKes = tm.h3 - 0.12;
  tm.sayac = Math.min(cd0 - 0.05, tm.n3s); tm.ipKes = tm.n1 - 0.12;
  tm.dEgi = cd0 + 0.6; tm.dDon = cd0 + 3.9;     // sayaç: Defne çerçeveyi kendine çevirir, geri koyar
  tm.nAl = cd - 1.7;                            // sayaç sonu: Necmi çerçeveyi eline alır (ipucu insertine taşınır)
  const film = H.sahneler([
    { id: 'grup', t0: 0, cam: [[0, ...KAM.grup], [tm.insKes - 0.1, 1.32, 540, 986]] },
    { id: 'insert', t0: tm.insKes, cam: [[0, ...KAM.insert], [tm.hikKes - 0.1, 1.04, 3000, 950]] },
    { id: 'hikmet', t0: tm.hikKes, cam: [[0, ...KAM.hikmet], [tm.defKes - 0.1, 1.52, 406, 1004]] },
    { id: 'defne', t0: tm.defKes, cam: [[0, ...KAM.defne], [tm.necKes - 0.1, 1.52, 674, 1004]] },
    { id: 'necmi', t0: tm.necKes, cam: [[0, ...KAM.necmi], [tm.ikiKes - 0.1, 1.62, 540, 999]] },
    { id: 'ikili', t0: tm.ikiKes, cam: [[0, ...KAM.ikili], [tm.sayac - 0.1, 1.44, 436, 998]] },
    { id: 'sayac', t0: tm.sayac, cam: [[0, ...KAM.grup]] },                     // sayaç: doğrusal itme kamera() ile
    { id: 'ipucu', t0: tm.ipKes, cam: [[0, ...KAM.insert]] },                    // ipucu: duvar çerçevesine doğrusal itme
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...KAM.buldum]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...KAM.grup], [tm.end - 0.2, 1.33, 548, 989]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]);
  for (const w of film.kontrol()) if (!/aynı hedef/.test(w)) console.error('sahne uyarısı: ' + w);
  // balonlar kesmeden 0,3 sn önce söner; n1 kesime kadar okunur
  const kis = { n0: tm.hikKes, h2: tm.defKes, d2: tm.necKes, n2: tm.ikiKes, n3: tm.sayac };
  const tlS = { ...tl, lines: tl.lines.filter(l => l.id !== 'n1').map(l => kis[l.id] ? { ...l, t1: Math.min(l.t1, kis[l.id] - 0.3) } : l) };
  const tlN = { ...tl, lines: tl.lines.filter(l => l.id === 'n1').map(l => ({ ...l, t1: T('d3') - 0.05 })) };
  const tlA = { ...tl, lines: [] };
  return { tm, film, tlS, tlN, tlA };
}

// ═══════════════════════════ Zaman durumları ═══════════════════════════
// Çerçeve (oda): { c, rot, sx, sy, yer: 'el' | 'masa' }
function fotoAt(tm, t) {
  if (t < tm.hikKes) {
    const u = ease.enter(seg(t, 0.3, 0.42));      // ilk hareket: 0,3 sn'de çerçeve kameraya döner ve kalkar
    return { c: [FOTO_EL[0], FOTO_EL[1] + 14 * (1 - u)], rot: -0.08 * (1 - u), sx: 0.9 + 0.1 * u, sy: 1, yer: 'el' };
  }
  if (t >= tm.nAl) {
    const u = ease.enter(seg(t, tm.nAl + 0.28, 0.42));
    return { c: kar(FOTO_MASA, FOTO_EL, u), rot: 0, sx: 1, sy: lerp(0.96, 1, u), yer: u > 0 ? 'el' : 'masa', ayak: u < 0.5 };
  }
  // sayaç: Defne çerçeveyi kendine doğru çevirir (yatayda daralır, hafif döner), sonra yerine koyar
  const e = ease.state(seg(t, tm.dEgi + 0.3, 0.45)) * (1 - ease.state(seg(t, tm.dDon, 0.45)));
  return { c: [FOTO_MASA[0] + 10 * e, FOTO_MASA[1] - 6 * e], rot: 0.05 * e, sx: 1 - 0.14 * e, sy: 0.96, yer: 'masa', ayak: true };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart, sayaç ve altyazı ekran katmanında (bölüme özel)
  drift: 0.008,
  kamera(cam, t, B) {
    const { tm } = S;
    if (B.sc.id === 'sayac') {   // sayaç: doğrusal itme
      const u = clamp01((t - tm.sayac) / (tm.ipKes - tm.sayac));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.3), Math.log(1.36), u)), cx: lerp(540, 540, u), cy: lerp(985, 989, u) });
    }
    if (B.sc.id === 'ipucu') {   // ipucu: fotoğraftaki duvar çerçevesine doğrusal itme
      const u = clamp01((t - tm.ipKes) / (tm.buldum - tm.ipKes));
      // "çerçeveye" kelimesinde 0,6 sn'de 1,75x'e yaklaşır (fotoğraftaki iki yüz kadrajda tam kalır) (kamera yayı yerine durum eğrisi), sonra okunurken neredeyse durur
      const v = ease.state(seg(t, tm.cerceve - 0.3, 0.6)), w = clamp01((t - tm.cerceve - 0.3) / (tm.buldum - tm.cerceve));
      Object.assign(cam, { zoom: Math.exp(lerp(Math.log(1.0), Math.log(1.75), v) + Math.log(1.03) * w), cx: 3000, cy: lerp(960, 800, v) });
    }
  },
  dunya(K, t, B) {
    if (B.sc.id === 'insert' || B.sc.id === 'ipucu') insertSahne(K, t, S, B);
    else sahne(K, t, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    const YA = YA0, ins = id === 'insert' || id === 'ipucu';
    // kısa kuyruk: baş noktası balonun 185 px üstüne indirilir (uç balonun 35 px üstünde kalır; çerçevenin üstüne binmez)
    const kb = {}; for (const [k, h] of Object.entries(B.heads)) { const e = B.ekr(h); kb[k] = [B.cam.cx + (e[0] - 540) / B.cam.zoom, B.cam.cy + (YA - 185 - 960) / B.cam.zoom]; }
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { dur: ep.cdSure || 10 });
    if (t < tm.end) H.altyazi(K, S.tlS, t, B.cam, kb, { y: YA, split: { n0: 7, d4: 4 }, kuyruksuz: ins });
    if (t >= tm.n1 - 0.1 && t < tm.buldum) H.altyazi(K, S.tlN, t, B.cam, kb, { y: YA, kuyruksuz: ins });
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

// ═══════════════════════════ Insert: çerçeve kameraya tutulur ═══════════════════════════
const NSKIN = H.CARDS.necmi.skin, NKOL = H.CARDS.necmi.arm.color, NKOL2 = H.CARDS.necmi.arm.shade;
// Kenarı kavrayan el: dört parmak ucu çerçevenin ön yüzüne kıvrılır, kolun yeni kenarın dışında kalır. s = −1 sol, +1 sağ
function kavrayanEl(K, c, k, s, a = 1) {
  if (a <= 0.01) return;
  const { ctx } = K, ex = c[0] + s * FW / 2 * k, cy = c[1] + 30;
  ctx.save(); ctx.globalAlpha = 1;
  // kol (çerçevenin dışında, ekranın kenarına uzanır)
  const d = 40 * (1 - a);
  K.rect(s < 0 ? ex - 360 - d : ex + 8 + d, cy - 40, 352, 150, NKOL, LW * 0.8, 30);
  K.rect(s < 0 ? ex - 46 - d : ex + 8 + d, cy - 44, 38, 158, NKOL2, LW * 0.6, 12);   // manşet
  // parmaklar
  for (let i = 0; i < 4; i++) {
    const y = cy - 30 + i * 34 + d * 0.2, x0 = ex + s * (8 + d), x1 = ex - s * (34 - d * 0.5);
    ctx.lineCap = 'round';
    K.line(x0, y, x1, y, 32, INK); K.line(x0, y, x1, y, 24, NSKIN);
  }
  ctx.restore();
}
// İşaret eden el: kol 'den' noktasından gelir, işaret parmağının ucu 'uc'a değer
function isaretEl(K, uc, den, a = 1) {
  if (a <= 0.01) return;
  const { ctx } = K;
  const yon = H.unit(den, uc), tip = kar(den, uc, a);
  const avuc = [tip[0] - yon[0] * 92, tip[1] - yon[1] * 92], bilek = [avuc[0] - yon[0] * 46, avuc[1] - yon[1] * 46];
  const geri = [bilek[0] - yon[0] * 1600, bilek[1] - yon[1] * 1600];
  ctx.save(); ctx.lineCap = 'round';
  K.line(geri[0], geri[1], bilek[0], bilek[1], 112, INK); K.line(geri[0], geri[1], bilek[0], bilek[1], 100, NKOL);
  const m0 = [bilek[0] - yon[0] * 26, bilek[1] - yon[1] * 26];
  K.line(m0[0], m0[1], bilek[0], bilek[1], 116, INK); K.line(m0[0], m0[1], bilek[0], bilek[1], 104, NKOL2);   // manşet
  const dik = [-yon[1], yon[0]];
  K.circ(avuc[0], avuc[1], 46, NSKIN, LW * 0.8);
  // kıvrık parmaklar (avucun önünde) ve başparmak
  for (let i = 0; i < 3; i++) { const q = [avuc[0] + dik[0] * (18 - i * 16) + yon[0] * 26, avuc[1] + dik[1] * (18 - i * 16) + yon[1] * 26]; K.circ(q[0], q[1], 14, NSKIN, LW * 0.6); }
  const kok = [avuc[0] + yon[0] * 30 - dik[0] * 24, avuc[1] + yon[1] * 30 - dik[1] * 24];
  K.line(kok[0], kok[1], tip[0], tip[1], 34, INK); K.line(kok[0], kok[1], tip[0], tip[1], 24, NSKIN);
  ctx.restore();
}
function insertSahne(K, t, S, B) {
  const { tm } = S, { ctx } = K, id = B.sc.id;
  // arka: ofis duvarı ve pencere (çerçevenin arkasında)
  K.rect(2300, -200, 1400, 2400, '#DCD3BE', 0, 0);
  for (let x = 2300; x < 3700; x += 70) K.rect(x, -200, 26, 2400, '#D3C9B1', 0, 0);
  M.pencere(K, 2330, 380, 300, 470, { isik: M.ISIK.gunduz, t, manzara: 'istanbul', marti: true });
  // masa ve örtü (çerçevenin altında)
  ctx.save(); ctx.translate(3000 - 540, 1222 - MASA.ust); masa(K); ctx.restore();
  cay(K, [2470, 1236]);
  H.buhar(K, 2470, 1166, t, { k: 0.9, n: 2, periyot: 2.1, renk: '#FFFFFF' });
  const c = [IC[0], IC[1] + 3 * Math.sin(TAU * t / 3.7)];   // elde tutulan çerçeve hafif soluk alır (elle tutmanın nefesi)
  foto(K, c, IK);
  if (id === 'insert') {
    // "Benden bir yaş da küçük": sağ el bırakır ve Rıza'yı gösterir; "küçük"te parmak bir kez dokunur
    const birak = W(t, tm.benden + 0.02, 0.22);
    kavrayanEl(K, c, IK, -1, 1);
    kavrayanEl(K, c, IK, 1, 1 - birak);
    const hedef = fotoNok(c, IK, {}, [72, 40]);
    const dokun = 18 * H.nabiz(t, tm.kucuk - 0.05, 0.3);
    const u = ease.state(seg(t, tm.benden + 0.1, 0.32));
    isaretEl(K, [hedef[0] + 14, hedef[1] + 10 + dokun], [3720, 1700], u);
  } else {
    // ipucu: sol el tutar, sağ işaret parmağı duvardaki düğün çerçevesinin alt kenarına değer
    kavrayanEl(K, c, IK, -1, 1);
    kavrayanEl(K, c, IK, 1, 1 - W(t, tm.ipKes + 0.05, 0.2));
    const hedef = fotoNok(c, IK, {}, [0, -31]);
    const u = ease.state(seg(t, tm.cerceve - 0.25, 0.34));
    const dokun = 12 * H.nabiz(t, tm.iyi - 0.05, 0.3);
    isaretEl(K, [hedef[0], hedef[1] + 6 + dokun], [3330, 1900], u);
  }
}

// ═══════════════════════════ Dünya (oda) ═══════════════════════════
const bak = (k, p, q) => { const h = H.eklem(k, p, 'head'); return [Math.max(-0.75, Math.min(0.75, (q[0] - h[0]) / 380)), Math.max(-0.5, Math.min(0.55, (q[1] - h[1]) / 420))]; };
const cene = (key, p, m) => { const h = H.eklem(key, p, 'head'); return [h[0] + m * 0.43 * p.s, h[1] + 0.4 * p.s]; };
const sallaBas = (p, t, t0, d = 0.7) => { if (t >= t0 && t < t0 + d) p.head.look = [0.32 * Math.sin(TAU * (t - t0) / 0.35) * (1 - seg(t, t0, d)), p.head.look[1]]; };

function sahne(K, t, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id;
  const tlTum = { ...S.tlS, lines: [...S.tlS.lines, ...S.tlN.lines] };   // dudak: n1 dahil
  M.mekanCiz(K, OFIS, 'arka', t, { isik: M.ISIK.gunduz });
  const kay = KAY[id] || {};
  const yer = k => X[k] + (kay[k] || 0);
  const sayacta = t >= tm.sayac && t < tm.ipKes;
  const f = fotoAt(tm, t);
  const fc = [f.c[0], f.c[1]];
  const HEAD = k => [yer(k), Y[k] - 600];
  const FOTO = [fc[0], fc[1] - 10], RIZA = fotoNok(fc, FK, f, [72, -30]);

  // ——— Hikmet (solda) ———
  const hp = H.kisi('hikmet', { x: yer('hikmet'), y: Y.hikmet, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const hO = { heads };
  hp.head.look = bak('hikmet', hp, t < tm.amcam ? FOTO : t < tm.n0s ? HEAD('necmi') : FOTO);
  if (t < tm.amcam) hp.head.tilt = -7 * W(t, 0.4, 0.35);   // kanca: fotoğrafa eğilir
  if (t >= tm.amcam && t < tm.h2) { hp.expr = IF.sasir; hp.head.tilt = -5 * pIn(t, tm.amcam, tm.h2, 0.3); }
  // h2: "Amca" sol el başın yanında tek parmak; "dayı" sağ el de kalkar
  let hP1 = 0, hP2 = 0, hBiri = 0, hGL = null, hTip = null;
  if (t >= tm.hikKes && t < tm.d2 + 0.3) {
    hp.expr = IF.ciddi; hp.head.look = bak('hikmet', hp, t < tm.dayi ? [hp.x - 120, 880] : [hp.x + 140, 880]);
    // parmak hesabı: sol el göğüs önünde iki parmak açar; sağ işaret parmağı "Amca"da birinciye, "dayı"da ikinciye dokunur
    hP1 = pIn(t, tm.amca - 0.28, tm.h2s, 0.28, 0.3);
    hP2 = hP1;
    const gL = H.elYeri('hikmet', hp, 'L', 'gogus');
    hGL = [gL[0] - 6, gL[1] - 60];
    hTip = t < tm.dayi - 0.05 ? [hGL[0] - 16, hGL[1] - 52] : [hGL[0] + 14, hGL[1] - 54];
    if (hP1 > 0.01) { hO.L = [hGL, hP1, 'A']; hO.R = [[hTip[0] + 62, hTip[1] + 34 + 10 * H.nabiz(t, tm.dayi - 0.05, 0.3)], hP2, 'A']; }
  }
  if (t >= tm.d2 && t < tm.h3) { hp.expr = IF.notr; hp.head.look = bak('hikmet', hp, t < tm.n2 ? HEAD('defne') : HEAD('necmi')); }
  // h3: "biri" tek parmak; n3'te Necmi'yi dinler
  if (t >= tm.ikiKes && t < tm.sayac) {
    hp.expr = t < tm.h3s ? IF.emin : IF.merak; hp.head.look = bak('hikmet', hp, t < tm.h3s ? RIZA : HEAD('necmi'));
    hBiri = pIn(t, tm.biri - 0.28, tm.h3s + 0.15, 0.28, 0.3);
    if (hBiri > 0.01) hO.L = [H.elYeri('hikmet', hp, 'L', 'yukari'), hBiri, 'B'];   // dış el: Necmi'nin yüzüne binmez
  }
  // sayaç: eli çenede (dış yanda), sonra çayını karıştırır; bakışı çerçeveyle Necmi arasında
  let hCene = 0, hKar = 0;
  if (sayacta) {
    const c0 = tm.cd0; hp.expr = IF.dusun;
    hCene = pIn(t, c0 + 0.3, c0 + 3.4, 0.35);
    if (hCene > 0.01) { hO.L = [cene('hikmet', hp, -1), hCene, 'B']; hp.head.look = bak('hikmet', hp, FOTO); }
    hKar = pIn(t, c0 + 4.2, c0 + 7.6, 0.3);
    if (hKar > 0.01) { const a = TAU * (t - c0) / 0.6; hO.L = [[CAY_H[0] + 4 + 9 * Math.cos(a), CAY_H[1] - 80 + 4 * Math.sin(a)], hKar, 'A']; hp.head.look = t < c0 + 5.6 ? bak('hikmet', hp, CAY_H) : bak('hikmet', hp, FOTO); }
    if (t >= c0 + 7.8) hp.head.look = bak('hikmet', hp, t < tm.nAl ? HEAD('defne') : HEAD('necmi'));
  }
  if (id === 'cevap') hp.head.look = bak('hikmet', hp, HEAD('defne'));

  // ——— Necmi (ortada, çerçeve onun) ———
  const np = H.kisi('necmi', { x: yer('necmi'), y: Y.necmi, expr: IF.emin, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const nO = { heads };
  np.head.look = t < tm.riza ? [0, 0.12] : t < tm.n0s ? [0.02, 0.06] : bak('necmi', np, HEAD('hikmet'));
  const nTut = f.yer === 'el' ? 1 : 0;
  const nAlW = t >= tm.nAl ? W(t, tm.nAl, 0.28) : 0;
  const tutW = t < tm.hikKes ? 1 : nAlW;
  if (tutW > 0.01) {
    nO.L = [fotoNok(fc, FK, f, [-FW / 2 - 4, 22]), tutW, 'A'];
    nO.R = [fotoNok(fc, FK, f, [FW / 2 + 4, 22]), tutW, 'A'];
  }
  if (t >= tm.h2 && t < tm.n2) { np.expr = IF.sakin; np.head.look = bak('necmi', np, t < tm.d2 ? HEAD('hikmet') : HEAD('defne')); }
  // n2: "Değil" başını sallar, sağ el başın yanında; n3: "annemle" sol el, "babamla" sağ el kalkar
  let nP1 = 0, nP2 = 0;
  if (t >= tm.necKes && t < tm.h3) {
    np.expr = IF.emin; np.head.look = bak('necmi', np, HEAD('defne'));
    sallaBas(np, t, tm.n2 + 0.02, 0.7);
    nP2 = pIn(t, tm.kan2 - 0.28, tm.n2s + 0.1, 0.28, 0.3);
    if (nP2 > 0.01) nO.R = [H.elYeri('necmi', np, 'R', 'yukari'), nP2, 'B'];
  }
  if (t >= tm.ikiKes && t < tm.sayac) {
    np.expr = t < tm.n3 ? IF.keyif : IF.emin; np.head.look = bak('necmi', np, HEAD('hikmet'));
    if (t >= tm.n3) sallaBas(np, t, tm.n3 + 0.02, 0.6);
    // sağ el başın yanında: "annemle" bir parmak, "babamla" iki parmak (sol el Hikmet'in yüzüne binmesin diye inik)
    nP2 = pIn(t, tm.annemle - 0.28, tm.n3s, 0.28, 0.3);
    nP1 = t >= tm.babamla - 0.04 ? 2 : 1;
    if (nP2 > 0.01) nO.R = [H.elYeri('necmi', np, 'R', 'yukari'), nP2, 'B'];
  }
  // sayaç: bilen adamın keyfi; bakışı ikisi arasında gezinir; sonunda çerçeveyi eline alır
  if (sayacta) {
    const c0 = tm.cd0; np.expr = IF.keyif;
    if (t < tm.dDon + 0.4) np.head.look = bak('necmi', np, t < tm.dEgi + 0.3 ? HEAD('hikmet') : HEAD('defne'));
    else { const j = Math.floor((t - tm.dDon - 0.4) / 1.6) % 2; np.head.look = bak('necmi', np, HEAD(j ? 'hikmet' : 'defne')); }
    if (t >= tm.nAl - 0.2) { np.expr = IF.emin; np.head.look = bak('necmi', np, FOTO); }
    if (t >= c0 + 4.4 && t < c0 + 5.6) H.onayla(np, t, c0 + 4.4, 2, 0.5);
    if (t >= c0 + 6.6 && t < c0 + 7.8) H.onayla(np, t, c0 + 6.6, 2, 0.5);   // bilen adamın keyfi: bir kez daha başını sallar
  }
  if (id === 'cevap') np.head.look = bak('necmi', np, HEAD('defne'));

  // ——— Defne (sağda) ———
  const dp = H.kisi('defne', { x: yer('defne'), y: Y.defne, expr: IF.merak, ...POZ.dur, head: { tilt: 0, look: [0, 0] } });
  const dO = { heads };
  dp.head.look = bak('defne', dp, t < tm.amcam ? FOTO : t < tm.n0s ? HEAD('necmi') : HEAD('hikmet'));
  if (t < tm.dayim) dp.head.tilt = 7 * W(t, 0.55, 0.35);
  if (t >= tm.dayim && t < tm.h2 + 0.5) { dp.expr = IF.sasir; dp.head.tilt = 6 * pIn(t, tm.dayim, tm.h2 + 0.4, 0.3); }
  // d2: "Olamaz" başını sallar; "annenle baban" sol el çerçeveyi gösterir
  let dIs = 0;
  if (t >= tm.defKes && t < tm.n2 + 0.3) {
    dp.expr = IF.ciddi; dp.head.look = bak('defne', dp, HEAD('necmi'));
    sallaBas(dp, t, tm.d2 + 0.02, 0.7);
    dIs = pIn(t, tm.annenle - 0.3, tm.d2s + 0.05, 0.28, 0.3);
    if (dIs > 0.01) { dO.L = [[684, 1100], dIs, 'A']; dp.head.look = bak('defne', dp, FOTO); }
  }
  if (t >= tm.n2 + 0.3 && t < tm.sayac) { dp.expr = IF.merak; dp.head.look = bak('defne', dp, t < tm.h3 ? HEAD('necmi') : t < tm.n3 ? HEAD('hikmet') : HEAD('necmi')); }
  // sayaç: çerçeveyi kendine çevirip bakar, yerine koyar; parmağı yanağında düşünür
  let dTut = 0, dParmak = false;
  if (sayacta) {
    const c0 = tm.cd0; dp.expr = IF.dusun;
    dTut = pIn(t, tm.dEgi, tm.dDon + 0.45, 0.3, 0.3);
    if (dTut > 0.01) { dO.L = [fotoNok(fc, FK, f, [FW / 2 + 2, 10]), dTut, 'A']; dp.head.look = bak('defne', dp, FOTO); dp.head.tilt = -6 * dTut; }
    const dThink = pIn(t, c0 + 4.8, c0 + 7.8, 0.35);
    if (dThink > 0.01) { const h = H.eklem('defne', dp, 'head'); dO.R = [[h[0] + 0.43 * dp.s, h[1] + 0.4 * dp.s], dThink, 'B']; dParmak = dThink > 0.6; dp.head.look = [-0.2 + 0.12 * Math.sin(TAU * (t - c0) / 2.3), -0.22]; }
    if (t >= c0 + 8.0) dp.head.look = bak('defne', dp, t < tm.nAl ? HEAD('necmi') : FOTO);
  }
  if (id === 'buldum') { dp.expr = IF.gulus; dp.head.look = [0, -0.1]; dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), W(t, tm.buldum - 0.05, 0.25), 'B']; }
  if (id === 'cevap') { dp.expr = IF.sakin; }
  dp.y -= H.buldumHop(t, tm.buldum, 50);

  // ——— Çizim: karakterler → masa → çay, lokum → çerçeve → buhar → tutan eller ———
  const hc = oyna(K, t, tlTum, 'hikmet', hp, hO);
  const nc = oyna(K, t, tlTum, 'necmi', np, nO);
  const dc = oyna(K, t, tlTum, 'defne', dp, dO);
  masa(K);
  cay(K, CAY_H, [CAY_H[0] + 4 + 9 * Math.cos(TAU * (t - tm.cd0) / 0.6) * (hKar > 0.5 ? 1 : 0), CAY_H[1] - 74]);
  cay(K, CAY_D);
  lokumKutusu(K);
  foto(K, fc, FK, f);
  H.buhar(K, CAY_H[0], CAY_H[1] - 72, t, { k: 0.75, n: 2, periyot: 2.1, renk: '#FFFFFF' });
  H.buhar(K, CAY_D[0], CAY_D[1] - 72, t + 0.9, { k: 0.75, n: 2, periyot: 2.3, renk: '#FFFFFF' });
  // tutan eller (nesnenin üstünde)
  if (tutW > 0.5) { nc.tut('L'); nc.tut('R'); }
  if (hP1 > 0.6) { hc.parmak('L', 2, { toplam: 2, yon: -Math.PI / 2, boy: 0.9 }); hc.isaret('R', hTip); }
  if (hBiri > 0.6) hc.parmak('L', 1, { toplam: 1, yon: -Math.PI / 2 - 0.2, boy: 0.95 });
  if (hKar > 0.5) hc.tut('L');
  if (nP2 > 0.6) { const ikiye = t >= tm.ikiKes && t < tm.sayac ? nP1 : 1; nc.parmak('R', ikiye, { toplam: ikiye, yon: -Math.PI / 2 + 0.2, boy: 0.95 }); }
  if (dIs > 0.6) dc.isaret('L', [606, 1100]);
  if (dTut > 0.5) dc.tut('L');
  if (dParmak) dc.parmak('R', 1, { toplam: 1, yon: -Math.PI / 2 - 0.25, boy: 0.95 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
