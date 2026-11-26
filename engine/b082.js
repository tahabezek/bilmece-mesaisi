// Bölüm 82 · AK, KARA, SARI HOCA (v4 "hikâye" dili, kısa set, cevapsız tasarım; storyboard: hikayeler/bolum_082_v5.md).
// Kaynak: Gardner, Scientific American 1960. Arşivdeki cevap: kara. Kara saçlı olan Ak Hoca'ya hitap ediyor, demek ki Ak Hoca
// değil; saçı soyadına uymuyor, demek ki Kara Hoca da değil: Sarı Hoca'dır ve saçı kara.
// Logline: Hikmet dün öğlen üç eski hocasıyla lokantada yemek yedi. Soyadları Ak, Kara, Sarı; saçları ak, kara, sarı.
// Kara saçlı olan Ak Hoca'ya dönüp "hiçbirimizin saçı soyadına uymuyor" dedi, Ak Hoca "Doğru" dedi. Sarı Hoca'nın saçı ne renk?
// Akılda kalacak tek şey: kim kime döndü.
// KRİTİK SIZINTI YASAĞI: üç öğretmenin saçı hiçbir anda görünmez (kasket, örgü bere, keçe şapka; saç tutamı yok, saç özelliği
// hiç verilmez). Kaşlar kanalın ortak çizgi rengi (INK), bıyık yok. Şapka, atkı ve giysi renklerinde ak, kara, sarı yok
// (renk ipucu olmasın). Üstlerinde, tabakta, masada ad yok; mekânda hiç yazı yok. Soyadları ve saç renkleri sayılırken görüntü
// kimseyi tek tek göstermez (renk kelimeleri ofiste, Hikmet'in yakın planında söylenir). Görünen tek şart: ortadaki öğretmen
// "Ak Hoca'ya döndü"de sağdakine döner ve konuşur, sağdaki başını ona çevirip "Doğru" der.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const mix2 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Figüranlar: üç öğretmen ═══════════════════════════
// Saç özelliği YOK (kafa şapkanın altında kalır). hair alanı nötr koyu gri (hiçbir çizimde kullanılmıyor; güvence).
// A (solda): Necmi iskeletinden, kahve tüvit ceket, beyaz gömlek ve kırmızı kravat, köşeli gözlük, zeytin tüvit kasket, kiremit atkı.
// B (ortada): Kerem iskeletinden, uzun ince; petrol mavisi hırka, pas rengi örgü bere (kıvrık ağızlı), zeytin yeşili atkı.
// C (sağda): Defne iskeletinden; yeşil ceket, krem bluz, mürdüm keçe şapka (petrol kurdeleli), mercan atkı.
const HA = 'b082_hocaA', HB = 'b082_hocaB', HC = 'b082_hocaC';
const NOTR = '#4B4D50';
if (!H.CARDS[HA]) {
  const n = H.CARDS.necmi, g = H.CARDS.genc, d = H.CARDS.defne;
  H.CARDS[HA] = {
    ...n, key: HA, name: 'Öğretmen A', role: 'lokantadaki öğretmen', seed: 821,
    torso: { ...n.torso, color: '#7A5A3E', shade: '#634830' }, arm: { ...n.arm, color: '#7A5A3E', shade: '#634830' },
    leg: { ...n.leg, color: '#4A4440', shade: '#3A3532' },
    skin: '#D9A27A', skinShade: '#C08760', hair: NOTR, features: ['suit', 'tie', 'glassesRect'],
  };
  H.CARDS[HB] = {
    ...g, key: HB, name: 'Öğretmen B', role: 'lokantadaki öğretmen', seed: 822,
    torso: { ...g.torso, color: '#35596B', shade: '#2A4756' }, arm: { ...g.arm, color: '#35596B', shade: '#2A4756' },
    skin: '#E3AF86', skinShade: '#C9946C', hair: NOTR, features: ['cardigan'],
  };
  H.CARDS[HC] = {
    ...d, key: HC, name: 'Öğretmen C', role: 'lokantadaki öğretmen', seed: 823,
    torso: { ...d.torso, color: '#4F7A5A', shade: '#3F6449' }, arm: { ...d.arm, color: '#4F7A5A', shade: '#3F6449' },
    skin: '#E8B994', skinShade: '#CE9C78', hair: NOTR, top: '#EDE3D0', features: ['blazer', 'lashes'],
  };
}
const SA = 225, SB = 232, SC = 236;
const SAPKA = {
  [HA]: { tur: 'kasket', renk: '#5E6450', koyu: '#4A4F3F' },
  [HB]: { tur: 'bere', renk: '#B4583C', koyu: '#94452E' },
  [HC]: { tur: 'cloche', renk: '#7C4062', koyu: '#62304D', serit: '#2F7F7A' },
};
const ATKI = { [HA]: ['#A8453A', '#8A3830'], [HB]: ['#6E7F4A', '#5A693C'], [HC]: ['#D9764F', '#BA603E'] };

// Ağzı kapalı ifadeler (konuşmayanın ağzı oynamaz, açık durmaz)
const MERAK = { brow: 0.07, browTilt: 0.12, eye: 1.05, pupil: 1, curve: 0.05, open: 0, w: 0.8 };
const DINLE = { brow: 0.03, browTilt: 0, eye: 1, pupil: 1, curve: 0.22, open: 0, w: 0.95 };
const DALGIN = { brow: 0.04, browTilt: 0.05, eye: 0.95, pupil: 1, curve: 0.18, open: 0, w: 0.95 };
const SAKIN = { brow: 0.02, browTilt: 0, eye: 0.95, pupil: 1, curve: 0.22, open: 0, w: 0.95 };
const FOTO = { brow: 0.03, browTilt: -0.05, eye: 0.9, pupil: 1, curve: 0.5, open: 0, w: 1.05 };
const KONUS = { brow: 0.04, browTilt: -0.04, eye: 1, pupil: 1, curve: 0.18, open: 0, w: 0.95 };

// ═══════════════════════════ Şapka ve atkı (baş ve boyun eklemine kilitli) ═══════════════════════════
// Baş yerel uzayında çizilir (drawCharacter ile aynı dönüşüm: öteleme → ölçek (yan görünüşte facing) → baş eğimi).
// Alt kenar her zaman kaşların üstünde (alın ortası ≈ −0,3 U) ve kulakların üst yarısını örter; tepede kafa derisi görünmez.
function sapka(K, key, p) {
  const { ctx } = K, c = H.CARDS[key], S = SAPKA[key], hd = H.eklem(key, p, 'head'), yan = p.view === 'side', f = yan ? (p.facing || 1) : 1;
  const lw = c.line, w = c.head.w / 2 * (yan ? 1.05 : 1), h = c.head.h / 2;
  ctx.save(); ctx.translate(hd[0], hd[1]); ctx.scale(p.s * f, p.s); ctx.rotate((p.head.tilt || 0) * D2R);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = INK;
  const dolu = (renk, k = 1) => { ctx.fillStyle = renk; ctx.fill(); ctx.lineWidth = lw * k; ctx.stroke(); };
  const cizgi = (renk, k) => { ctx.lineWidth = lw * k; ctx.strokeStyle = renk; ctx.stroke(); ctx.strokeStyle = INK; };
  if (!yan) {
    if (S.tur === 'kasket') {
      // tepe: yayvan, alnın üstüne iner; siper: önde yarım ay
      ctx.beginPath(); ctx.moveTo(-w * 1.12, -0.02);
      ctx.bezierCurveTo(-w * 1.2, -h * 1.05, -w * 0.45, -h * 1.26, 0.02, -h * 1.22);
      ctx.bezierCurveTo(w * 0.5, -h * 1.26, w * 1.22, -h * 1.0, w * 1.12, -0.02);
      ctx.quadraticCurveTo(0, -0.68, -w * 1.12, -0.02); ctx.closePath(); dolu(S.renk);
      ctx.beginPath(); ctx.moveTo(-w * 0.6, -h * 1.02); ctx.quadraticCurveTo(0, -h * 1.12, w * 0.62, -h * 1.0); cizgi(S.koyu, 0.6);   // dikiş
      ctx.beginPath(); ctx.moveTo(-w * 0.92, -0.17); ctx.quadraticCurveTo(0, -0.47, w * 0.92, -0.17);
      ctx.quadraticCurveTo(0, -0.33, -w * 0.92, -0.17); ctx.closePath(); dolu(S.koyu);
      ctx.beginPath(); ctx.arc(0, -h * 1.2, 0.035, 0, TAU); dolu(S.koyu, 0.6);                                                     // tepe düğmesi
    } else if (S.tur === 'bere') {
      // örgü bere: kubbe + kıvrık ağız (kulakların üst yarısını örter)
      ctx.beginPath(); ctx.moveTo(-w * 1.13, 0.13);
      ctx.bezierCurveTo(-w * 1.24, -h * 0.95, -w * 0.62, -h * 1.34, 0, -h * 1.3);
      ctx.bezierCurveTo(w * 0.62, -h * 1.34, w * 1.24, -h * 0.95, w * 1.13, 0.13);
      ctx.quadraticCurveTo(0, -0.7, -w * 1.13, 0.13); ctx.closePath(); dolu(S.renk);
      for (const k of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.moveTo(k * w * 1.2, -0.42); ctx.quadraticCurveTo(k * w * 1.05, -h * 0.95, k * w * 0.5, -h * 1.24); cizgi(S.koyu, 0.55); }
      ctx.beginPath(); ctx.moveTo(-w * 1.15, 0.13); ctx.quadraticCurveTo(0, -0.7, w * 1.15, 0.13);
      ctx.lineTo(w * 1.17, -0.02); ctx.quadraticCurveTo(0, -0.86, -w * 1.17, -0.02); ctx.closePath(); dolu(S.koyu);
      for (let i = 1; i < 12; i++) { const u = i / 12, x = (2 * u - 1) * w * 1.15, y = (1 - u) ** 2 * 0.13 + 2 * u * (1 - u) * -0.7 + u * u * 0.13; ctx.beginPath(); ctx.moveTo(x, y - 0.025); ctx.lineTo(x, y - 0.11); cizgi(S.renk, 0.5); }
    } else {
      // keçe şapka (cloche): çan biçimi tepe, dar kenar, kurdele
      ctx.beginPath(); ctx.moveTo(-w * 1.14, 0.12);
      ctx.bezierCurveTo(-w * 1.22, -h * 1.0, -w * 0.55, -h * 1.32, 0, -h * 1.3);
      ctx.bezierCurveTo(w * 0.55, -h * 1.32, w * 1.22, -h * 1.0, w * 1.14, 0.12);
      ctx.quadraticCurveTo(0, -0.8, -w * 1.14, 0.12); ctx.closePath(); dolu(S.renk);
      ctx.beginPath(); ctx.moveTo(-w * 1.16, 0.02); ctx.quadraticCurveTo(0, -0.96, w * 1.16, 0.02);
      ctx.lineTo(w * 1.15, 0.1); ctx.quadraticCurveTo(0, -0.84, -w * 1.15, 0.1); ctx.closePath(); dolu(S.serit, 0.7);
      ctx.beginPath(); ctx.ellipse(-w * 0.82, -0.09, 0.07, 0.045, -0.5, 0, TAU); dolu(S.serit, 0.7);
      ctx.beginPath(); ctx.moveTo(-w * 1.3, 0.2); ctx.quadraticCurveTo(0, -0.74, w * 1.3, 0.2);
      ctx.lineTo(w * 1.13, 0.13); ctx.quadraticCurveTo(0, -0.8, -w * 1.13, 0.13); ctx.closePath(); dolu(S.koyu);
    }
  } else {
    // yan görünüş: yüz +x yönünde. Alt kenar alından (−0,28) arkaya iner, kulağı örter.
    if (S.tur === 'bere') {
      ctx.beginPath(); ctx.moveTo(w * 1.06, -0.27);
      ctx.bezierCurveTo(w * 1.12, -h * 1.0, w * 0.45, -h * 1.36, -w * 0.3, -h * 1.28);
      ctx.bezierCurveTo(-w * 1.15, -h * 1.18, -w * 1.42, -h * 0.4, -w * 1.26, 0.3);
      ctx.quadraticCurveTo(-w * 0.1, 0.28, w * 0.3, -0.13); ctx.lineTo(w * 1.06, -0.27); ctx.closePath(); dolu(S.renk);
      for (const k of [0.6, 0, -0.6]) { ctx.beginPath(); ctx.moveTo(w * k * 1.1, k > 0 ? -0.25 : 0.02 - k * 0.2); ctx.quadraticCurveTo(w * k * 0.9 - 0.04, -h * 0.95, w * k * 0.4 - 0.1, -h * 1.26); cizgi(S.koyu, 0.55); }
      ctx.beginPath(); ctx.moveTo(-w * 1.28, 0.3); ctx.quadraticCurveTo(-w * 0.1, 0.28, w * 0.3, -0.13); ctx.lineTo(w * 1.07, -0.27);
      ctx.lineTo(w * 1.1, -0.42); ctx.lineTo(w * 0.28, -0.29); ctx.quadraticCurveTo(-w * 0.2, 0.12, -w * 1.34, 0.14); ctx.closePath(); dolu(S.koyu);
    } else {
      ctx.beginPath(); ctx.moveTo(w * 1.05, -0.3);
      ctx.bezierCurveTo(w * 1.12, -h * 1.02, w * 0.45, -h * 1.36, -w * 0.3, -h * 1.3);
      ctx.bezierCurveTo(-w * 1.15, -h * 1.2, -w * 1.4, -h * 0.4, -w * 1.25, 0.26);
      ctx.quadraticCurveTo(-w * 0.1, 0.27, w * 0.32, -0.15); ctx.lineTo(w * 1.05, -0.3); ctx.closePath(); dolu(S.renk);
      ctx.beginPath(); ctx.moveTo(-w * 1.3, 0.14); ctx.quadraticCurveTo(-w * 0.2, 0.12, w * 0.3, -0.29); ctx.lineTo(w * 1.08, -0.44);
      ctx.lineTo(w * 1.06, -0.35); ctx.lineTo(w * 0.31, -0.2); ctx.quadraticCurveTo(-w * 0.12, 0.2, -w * 1.27, 0.22); ctx.closePath(); dolu(S.serit, 0.7);
      ctx.beginPath(); ctx.moveTo(-w * 1.42, 0.34); ctx.quadraticCurveTo(-w * 0.1, 0.36, w * 0.32, -0.12); ctx.lineTo(w * 1.24, -0.26);
      ctx.lineTo(w * 1.05, -0.3); ctx.lineTo(w * 0.32, -0.15); ctx.quadraticCurveTo(-w * 0.1, 0.27, -w * 1.25, 0.26); ctx.closePath(); dolu(S.koyu);
    }
  }
  ctx.restore();
}
// Kalın örgü atkı: boyunda bir sargı ve göğse sarkan bir uç (yan görünüşte uç öne düşer)
function atki(K, key, p) {
  const { ctx } = K, c = H.CARDS[key], [r1, r2] = ATKI[key], s = p.s, n = H.eklem(key, p, 'neck'), hd = H.eklem(key, p, 'head');
  const yan = p.view === 'side', f = yan ? (p.facing || 1) : 1, lw = c.line * s;
  const cy = Math.max(n[1] - 0.03 * s, hd[1] + 0.47 * s);
  ctx.save(); ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = lw;
  if (!yan) {
    const ux = n[0] + 0.1 * s;   // sarkan uç
    ctx.beginPath(); ctx.moveTo(ux - 0.08 * s, cy + 0.04 * s); ctx.lineTo(ux + 0.09 * s, cy + 0.04 * s); ctx.lineTo(ux + 0.13 * s, cy + 0.52 * s); ctx.lineTo(ux - 0.04 * s, cy + 0.55 * s); ctx.closePath();
    ctx.fillStyle = r1; ctx.fill(); ctx.stroke();
    for (const k of [0.36, 0.44]) { ctx.beginPath(); ctx.moveTo(ux - 0.07 * s + k * 0.06 * s, cy + k * s); ctx.lineTo(ux + 0.115 * s, cy + (k - 0.005) * s); ctx.lineWidth = lw * 0.6; ctx.strokeStyle = r2; ctx.stroke(); }
    ctx.strokeStyle = INK; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.ellipse(n[0], cy, 0.29 * s, 0.12 * s, 0, 0, TAU); ctx.fillStyle = r1; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(n[0] - 0.24 * s, cy + 0.02 * s); ctx.quadraticCurveTo(n[0], cy + 0.09 * s, n[0] + 0.24 * s, cy + 0.02 * s); ctx.lineWidth = lw * 0.6; ctx.strokeStyle = r2; ctx.stroke();
  } else {
    ctx.beginPath(); ctx.ellipse(n[0] + f * 0.02 * s, cy, 0.2 * s, 0.12 * s, f * 0.12, 0, TAU); ctx.fillStyle = r1; ctx.fill(); ctx.stroke();
    const ux = n[0] + f * 0.12 * s;
    ctx.beginPath(); ctx.moveTo(ux, cy + 0.04 * s); ctx.lineTo(ux + f * 0.12 * s, cy + 0.06 * s); ctx.lineTo(ux + f * 0.14 * s, cy + 0.5 * s); ctx.lineTo(ux + f * 0.0 * s, cy + 0.48 * s); ctx.closePath();
    ctx.fillStyle = r1; ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// ═══════════════════════════ Ortak nesneler ═══════════════════════════
function bardak(K, x, yb, { k = 1.6, buhar = false, t = 0, dolu = true } = {}) {   // ince belli çay bardağı: (x, yb) taban
  const { ctx } = K;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  K.poly([[-14, -32], [14, -32], [9, -18], [12, -5], [10, 0], [-10, 0], [-12, -5], [-9, -18]], dolu ? '#A8401F' : '#E3EEEA', 2.4 / k * 1.45);
  ctx.restore();
  if (buhar) H.buhar(K, x, yb - 36 * k, t, { k: 0.36, n: 2, ara: 9, boy: 50 });
}
// Kar yağışı (deterministik): dikdörtgene kırpılmış, aşağı süzülen taneler
function karYag(K, x, y, w, h, t, { n = 40, r = 5, renk = '#F4F6F2', tohum = 82, hiz = 1 } = {}) {
  const { ctx } = K, rnd = H.mulberry32(tohum);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = renk;
  for (let i = 0; i < n; i++) {
    const fx = rnd() * w, fy = rnd() * (h + 40), v = (38 + rnd() * 34) * hiz, rr = r * (0.6 + 0.7 * rnd()), ph = rnd() * TAU;
    const yy = y - 20 + (((fy + v * t) % (h + 40)) + h + 40) % (h + 40), xx = x + fx + 9 * Math.sin(t * 0.9 + ph);
    ctx.beginPath(); ctx.arc(xx, yy, rr, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ═══════════════════════════ Mekân 1: ofis (bugün, kış sabahı) ═══════════════════════════
const OFIS = 'b082_ofis';
const NEC_X = 300, HIK_X = 610, DEF_X = 940;
const MASA = { x0: 400, x1: 830, y: 1250 };
const SAAT = { x: 800, y: 720, r: 54 };
function ofisMasa(K) {
  const { x0, x1, y } = MASA;
  K.rect(x0 + 16, y + 34, x1 - x0 - 32, 1500 - y - 34, PAL.wood, LW);
  for (const dx of [36, 236]) { K.rect(x0 + dx, y + 66, 160, 110, PAL.woodTop, LW * 0.6, 6); K.line(x0 + dx + 56, y + 120, x0 + dx + 104, y + 120, 8); }
  K.rect(x0, y, x1 - x0, 36, PAL.woodTop, LW, 8);
  // masada: kalem kutusu ve dosya (ad yok)
  K.rect(x1 - 120, y - 64, 54, 66, '#2F7F7A', LW * 0.7, 6);
  for (const [dx, a, c] of [[-14, -0.25, PAL.coral], [2, 0.05, '#E9DCC2'], [14, 0.3, '#5E9A4E']]) { const bx = x1 - 93 + dx; K.line(bx, y - 64, bx + Math.sin(a) * 50, y - 64 - Math.cos(a) * 50, 9, c); }
}
function rafCiz(K, t) {   // klasör rafı (sağ duvar) ve saksı (döngü: yapraklar)
  K.rect(1130, 760, 330, 600, '#9C7A4C', LW, 6);
  for (const y of [900, 1060, 1220]) K.rect(1130, y, 330, 16, '#86592E', LW * 0.6);
  const renk = ['#2F7F7A', '#B4583C', '#C2412F', '#E9DCC2', '#5E9A4E'];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = 1150 + i * 50, h = 110 - ((r * 7 + i * 3) % 4) * 6, yb = 900 + r * 160; K.rect(x, yb - h, 40, h, renk[(r * 2 + i) % 5], LW * 0.6, 4); K.circ(x + 20, yb - h * 0.28, 7, '#F4EDE0', 2.5); }
  K.poly([[1250, 760], [1350, 760], [1338, 680], [1262, 680]], PAL.coral, LW);
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.32 + 0.05 * Math.sin(t * 1.3 + i); H.yaprak(K, 1300, 684, 120 + 24 * (i % 2), a, PAL.green, 1); }
}
function kalorifer(K) {   // pencerenin altında petek (kış)
  K.rect(-40, 1150, 360, 200, '#E4DED0', LW * 0.8, 10);
  for (let i = 0; i < 8; i++) K.line(-10 + i * 42, 1170, -10 + i * 42, 1330, 5, '#B8B1A2');
  K.rect(-50, 1135, 380, 22, '#D6CFBF', LW * 0.6, 6);
}
M.mekanEkle(OFIS, {
  gen: [-300, 1700], dongu: ['pencerede yağan kar', 'duvar saatinin saniye ibresi', 'çay buharı'],
  arka(K, t, { durum }) {
    const S = M.ISIK.sabah;
    M.oda(K, { x0: -400, x1: 1800, isik: S, duvar: 'cizgili', zemin: 'ahsap' });
    const p = M.pencere(K, -60, 600, 380, 460, { isik: S, t, gunes: 0.28, manzara: 'istanbul', marti: false });
    karYag(K, p.x, p.y, p.w, p.h, t, { n: 26, r: 6, tohum: 821 });
    K.rect(-90, 1060, 440, 26, PAL.trim, LW * 0.8, 6);
    kalorifer(K);
    M.duvarSaati(K, SAAT.x, SAAT.y, SAAT.r, durum.saat ?? 10.2 + t / 3600, t);
    rafCiz(K, t);
  },
});

// ═══════════════════════════ Mekân 2: lokanta (dün öğlen) ═══════════════════════════
// Önden: üç öğretmen uzun masanın arkasında yan yana oturur; kamera Hikmet'in yerinden bakar (onun çorbası masanın önünde).
// Arkada buğulu büyük pencere, dışarıda kar. Mekânda yazı yok.
const LOK = 'b082_lokanta';
const XA = 240, XB = 520, XC = 840, PEL_Y = 1195, TB = 1110;   // öğretmenlerin x'i, kalça yüksekliği, masanın arka kenarı
const PEN = { x: 110, y: 500, w: 860, h: 470 };
const CORBA = '#C65A3A';
function lokantaArka(K, t) {
  const { ctx } = K;
  ctx.fillStyle = '#D9C49A'; ctx.fillRect(-400, -400, 1900, 1500);
  // alt duvar: fayans
  K.rect(-400, 990, 1900, 140, '#E8E1D0', 0);
  for (let x = -400; x < 1500; x += 70) K.line(x, 990, x, 1130, 3, '#CFC6B2');
  K.line(-400, 1060, 1500, 1060, 3, '#CFC6B2'); K.rect(-410, 980, 1920, 18, '#2F7F7A', LW * 0.6);
  // pencere: dışarıda karlı çatılar, kar; camın alt yarısı buğulu
  const { x, y, w, h } = PEN;
  K.rect(x - 22, y - 22, w + 44, h + 44, '#7A5236', LW);
  ctx.fillStyle = '#B9CBC8'; ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  for (const [x0, x1, top, renk] of [[x - 20, x + 260, y + 250, '#8E9C97'], [x + 230, x + 520, y + 200, '#97A49E'], [x + 500, x + w + 20, y + 270, '#8A9893']]) {
    K.rect(x0, top, x1 - x0, h, renk, 4); K.poly([[x0 - 10, top + 4], [x1 + 10, top + 4], [x1 - 10, top - 26], [x0 + 10, top - 26]], '#F1F3EE', 4);   // karlı saçak
    for (let wx = x0 + 40; wx < x1 - 40; wx += 90) K.rect(wx, top + 50, 44, 60, '#6F7E7A', 3, 3);
  }
  karYag(K, x, y, w, h, t, { n: 70, r: 6, tohum: 822 });
  ctx.globalAlpha = 0.62; ctx.fillStyle = '#E6EDEA';
  ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + h * 0.5);
  for (let i = 0; i <= 12; i++) ctx.lineTo(x + w * i / 12, y + h * (0.5 - 0.05 * Math.sin(i * 1.7) - 0.03 * Math.cos(i * 2.9)));
  ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  for (const [dx, d0, d1] of [[0.18, 0.56, 0.78], [0.47, 0.52, 0.66], [0.79, 0.57, 0.86]]) K.line(x + w * dx, y + h * d0, x + w * dx, y + h * d1, 5, '#CBD8D4');   // buğuda akan damla izi
  ctx.restore();
  K.rect(x, y, w, h, null, LW);
  for (const mx of [x + w / 3, x + 2 * w / 3]) K.rect(mx - 9, y, 18, h, '#7A5236', LW * 0.7);
  K.rect(x - 40, y + h + 14, w + 80, 22, '#8C6040', LW * 0.8, 6);   // pervaz
  // sandalye arkalıkları (öğretmenlerin arkasında)
  for (const sx of [XA, XB, XC]) { K.rect(sx - 112, 1010, 22, 200, '#86592E', LW * 0.8, 6); K.rect(sx + 90, 1010, 22, 200, '#86592E', LW * 0.8, 6); K.rect(sx - 118, 1000, 236, 30, '#9C6B3C', LW * 0.8, 10); }
}
// Masa: perspektifli üst yüz (arka kenar TB), örtü, kenar şeridi
function masaUst(K) {
  const { ctx } = K;
  K.poly([[20, TB], [1060, TB], [1300, 1700], [-220, 1700]], '#EDE3CF', LW);
  ctx.save(); ctx.beginPath(); ctx.moveTo(20, TB); ctx.lineTo(1060, TB); ctx.lineTo(1300, 1700); ctx.lineTo(-220, 1700); ctx.closePath(); ctx.clip();
  for (let i = 0; i <= 10; i++) { const u = i / 10; K.line(lerp(20, 1060, u), TB, lerp(-220, 1300, u), 1700, 4, '#E0D3B8'); }
  for (const yy of [1180, 1290, 1440]) K.line(-300, yy, 1400, yy, 4, '#E0D3B8');
  ctx.restore();
  K.line(20, TB + 6, 1060, TB + 6, 8, '#C65A3A');
}
function corbaKase(K, x, y, t, { buhar = true, k = 1 } = {}) {   // (x, y) ağız merkezi
  K.ell(x, y + 40 * k, 74 * k, 14 * k, 'rgba(31,36,33,0.14)', 0);
  const { ctx } = K;
  ctx.beginPath(); ctx.moveTo(x - 70 * k, y); ctx.quadraticCurveTo(x - 64 * k, y + 52 * k, x, y + 52 * k); ctx.quadraticCurveTo(x + 64 * k, y + 52 * k, x + 70 * k, y);
  ctx.fillStyle = '#F2ECE0'; ctx.fill(); ctx.lineWidth = LW * k; ctx.strokeStyle = INK; ctx.stroke();
  K.ell(x, y, 70 * k, 17 * k, '#F2ECE0', LW * k);
  K.ell(x, y + 2 * k, 58 * k, 12 * k, CORBA, 0);
  K.line(x - 60 * k, y + 22 * k, x + 60 * k, y + 22 * k, 5 * k, '#2F7F7A');
  if (buhar) H.buhar(K, x, y - 6 * k, t, { k: 0.5 * k, n: 2, ara: 30, boy: 70, periyot: 2.1 });
}
function suBardagi(K, x, yb, k = 1) { K.poly([[x - 20 * k, yb - 64 * k], [x + 20 * k, yb - 64 * k], [x + 16 * k, yb], [x - 16 * k, yb]], '#DCEBE8', LW * 0.7 * k); K.rect(x - 15 * k, yb - 36 * k, 30 * k, 32 * k, '#BFD9D4', 0); }
function ekmekSepeti(K, x, y) {
  K.poly([[x - 110, y - 20], [x + 110, y - 20], [x + 90, y + 40], [x - 90, y + 40]], '#A8743E', LW);
  for (let i = 0; i < 5; i++) K.line(x - 96 + i * 48, y - 14, x - 78 + i * 42, y + 34, 4, '#8A5C2E');
  for (const [dx, a] of [[-55, -0.35], [0, 0.05], [55, 0.4]]) { const { ctx } = K; ctx.save(); ctx.translate(x + dx, y - 34); ctx.rotate(a); K.rect(-34, -30, 68, 56, '#E7C58C', LW * 0.7, 18); K.rect(-24, -20, 48, 34, '#F3E2BC', 0, 12); ctx.restore(); }
}
function surahi(K, x, yb) {
  K.poly([[x - 34, yb - 110], [x + 30, yb - 110], [x + 44, yb - 40], [x + 36, yb], [x - 36, yb], [x - 44, yb - 40]], '#DCEBE8', LW * 0.8);
  K.rect(x - 38, yb - 66, 78, 58, '#BFD9D4', 0, 10);
  K.line(x + 40, yb - 96, x + 62, yb - 62, 8);
}
function salata(K, x, y) {   // çoban salatası tabağı
  K.ell(x, y, 120, 34, '#F2ECE0', LW); K.ell(x, y, 92, 24, '#E4DCCB', 0);
  for (const [dx, dy, r, c] of [[-46, -4, 18, '#C2412F'], [-10, 6, 16, '#5E9A4E'], [26, -6, 18, '#C2412F'], [54, 6, 14, '#5E9A4E'], [6, -10, 12, '#E9DCC2']]) K.circ(x + dx, y + dy, r, c, 3);
}
function pecetelik(K, x, yb) { K.poly([[x - 50, yb], [x + 50, yb], [x + 40, yb - 70], [x - 40, yb - 70]], '#B4583C', LW * 0.8); for (const dx of [-24, 0, 24]) K.poly([[x + dx - 14, yb - 66], [x + dx + 14, yb - 66], [x + dx + 10, yb - 104], [x + dx - 10, yb - 100]], '#F4EDE0', 3.5); }
function tuzluk(K, x, yb, renk) { K.rect(x - 13, yb - 46, 26, 46, '#EFEAE0', LW * 0.6, 6); K.rect(x - 13, yb - 58, 26, 16, renk, LW * 0.6, 5); }
M.mekanEkle(LOK, { gen: [-200, 1300], dongu: ['pencerede yağan kar', 'çorba buharı'] });

// Öğretmen pozu: ayakta kurulur, kalça masanın altına (PEL_Y) indirilir; alt gövdeyi masa örter.
function hocaPoz(key, x, s, o = {}) {
  const p = H.kisi(key, { x, s, expr: SAKIN, ...POZ.dur, ...o, head: { tilt: 0, look: [0, 0.2], ...(o.head || {}) } });
  const pel = H.eklem(key, p, 'pelvis'); p.y += PEL_Y - pel[1];
  return p;
}
// Masanın üstünde kalan önkol ve el: masa çizildikten sonra yeniden çizilir (arka kenarın altı)
function onKol(K, key, p, sides) {
  const { ctx } = K, c = H.CARDS[key], s = p.s, lw = c.line * s;
  ctx.save(); ctx.beginPath(); ctx.rect(-2000, TB - 2, 5000, 3000); ctx.clip(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const sd of sides) {
    const e = H.eklem(key, p, 'el' + sd), h = H.eklem(key, p, 'hand' + sd), renk = p.view === 'side' && sd === 'L' ? c.arm.shade : c.arm.color;
    for (const [w, col] of [[c.arm.w * s + lw * 2, INK], [c.arm.w * s, renk]]) { ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); }
    K.circ(h[0], h[1], c.arm.hand * s, c.skin, lw);
  }
  ctx.restore();
}

// Lokanta sahnesi. mod: 'canli' (geri dönüş) | 'foto' (telefondaki fotoğraf: hepsi önden, kameraya gülümser, durağan)
function lokanta(K, t, S, { mod = 'canli', heads = null, tl = null } = {}) {
  const foto = mod === 'foto', tm = S.tm, tt = foto ? 0 : t;
  lokantaArka(K, tt);
  // ——— A (solda, önden): çorbasını karıştırır; B konuşunca ona bakar ———
  const izle = foto ? 0 : W(t, tm.don + 0.25, 0.35);
  const pa = hocaPoz(HA, XA, SA, { expr: foto ? FOTO : SAKIN, head: { tilt: foto ? 0 : lerp(-3, 4, izle), look: foto ? [0, 0] : [lerp(0.15, 0.8, izle), lerp(0.55, -0.05, izle)] } });
  const ka = foto ? 0 : tt * TAU / 1.7, kasikA = [XA + 34 + 16 * Math.cos(ka), 1152 + 6 * Math.sin(ka)];
  const aO = { L: [[XA - 78, 1188], 1, 'A'], R: [foto ? [XA + 70, 1188] : kasikA, 1, 'A'] };
  // ——— B (ortada): önce önden, ekmeğini böler; "Ak Hoca'ya"da sağa (C'ye) döner ve konuşur ———
  const donB = !foto && t >= tm.don;
  let pb, bO;
  if (!donB) {
    const bol = foto ? 0 : pIn(t, tm.ekmek, tm.ekmek + 0.55, 0.3, 0.35);
    pb = hocaPoz(HB, XB, SB, { expr: foto ? FOTO : SAKIN, head: { tilt: foto ? 0 : 2, look: foto ? [0, 0] : [0.05, 0.5] } });
    bO = { L: [mix2([XB - 66, 1182], [XB - 22, 1146], bol), 1, 'A'], R: [mix2([XB + 66, 1182], [XB + 22, 1146], bol), 1, 'A'] };
  } else {
    const u = ease.state(seg(t, tm.don, 0.3));
    pb = hocaPoz(HB, XB, SB, { view: 'side', facing: 1, lean: 3 * u, expr: KONUS, head: { tilt: lerp(-6, 2, u), look: [1, 0] } });
    bO = { R: [[XB + 100, 1184], 1, 'A'], L: [[XB + 60, 1186], 1, 'A'] };
  }
  // ——— C (sağda): çay bardağını tutar; B konuşurken gözü ona kayar; "Doğru"dan önce başını ona çevirir ———
  const donC = !foto && t >= tm.cdon;
  let pc, cO;
  if (!donC) {
    const bak = foto ? 0 : W(t, tm.k1 + 0.1, 0.3);
    pc = hocaPoz(HC, XC, SC, { expr: foto ? FOTO : SAKIN, head: { tilt: foto ? 0 : lerp(2, -3, bak), look: foto ? [0, 0] : [lerp(-0.1, -0.85, bak), lerp(0.45, 0.05, bak)] } });
    cO = { L: [[XC - 70, 1188], 1, 'A'], R: [[XC + 74, 1164], 1, 'A'] };
  } else {
    const u = ease.state(seg(t, tm.cdon, 0.3));
    pc = hocaPoz(HC, XC, SC, { view: 'side', facing: -1, lean: 2 * u, expr: SAKIN, head: { tilt: lerp(-4, 1, u), look: [1, 0] } });
    H.onayla(pc, t, tm.a1 + 0.05, 1, 0.42);
    cO = { R: [[XC - 96, 1186], 1, 'A'], L: [[XC - 60, 1188], 1, 'A'] };
  }
  const hO = o => ({ ...o, heads: heads || undefined, sessiz: foto || !tl });
  const ra = oyna(K, tt, foto ? null : tl, HA, pa, hO(aO)); atki(K, HA, pa); sapka(K, HA, pa);
  const rb = oyna(K, tt, foto ? null : tl, HB, pb, hO(bO)); atki(K, HB, pb); sapka(K, HB, pb);
  const rc = oyna(K, tt, foto ? null : tl, HC, pc, hO(cO)); atki(K, HC, pc); sapka(K, HC, pc);
  // ——— masa ve üstündekiler ———
  masaUst(K);
  corbaKase(K, XA + 30, 1180, tt, { buhar: !foto }); corbaKase(K, XB + 6, 1186, tt, { buhar: !foto }); corbaKase(K, XC - 30, 1182, tt, { buhar: !foto });
  suBardagi(K, XA - 120, 1238); suBardagi(K, XB + 120, 1240);
  ekmekSepeti(K, 410, 1316); surahi(K, 700, 1330); tuzluk(K, 590, 1300, PAL.coral); tuzluk(K, 630, 1306, '#2F7F7A');
  salata(K, 230, 1372); pecetelik(K, 860, 1352); suBardagi(K, 800, 1452, 1.3);
  corbaKase(K, 560, 1470, tt, { buhar: !foto, k: 1.35 });                                               // Hikmet'in çorbası (kameranın yeri)
  // önkollar masanın üstünde, sonra tutulan nesneler ve tutan eller
  onKol(K, HA, pa, ['L', 'R']); onKol(K, HB, pb, pb.view === 'side' ? ['R'] : ['L', 'R']); onKol(K, HC, pc, pc.view === 'side' ? ['R'] : ['L', 'R']);
  // A'nın kaşığı
  const ha = H.eklem(HA, pa, 'handR');
  if (!foto) { K.line(ha[0] - 4, ha[1] + 6, XA + 26 + 10 * Math.cos(ka), 1188, 9, INK); K.line(ha[0] - 4, ha[1] + 6, XA + 26 + 10 * Math.cos(ka), 1188, 4, '#C9CED0'); ra.tut('R'); }
  // B'nin ekmeği: bölmeden önce tek dilim, sonra iki parça (dönünce masada)
  const bolundu = foto || t >= tm.ekmek + 0.3;
  if (pb.view !== 'side') {
    const hl = H.eklem(HB, pb, 'handL'), hr = H.eklem(HB, pb, 'handR');
    if (!bolundu) { const m = mix2(hl, hr, 0.5); K.rect(m[0] - 46, m[1] - 34, 92, 54, '#E7C58C', LW * 0.7, 16); }
    else { K.rect(hl[0] - 34, hl[1] - 32, 52, 48, '#E7C58C', LW * 0.7, 14); K.rect(hr[0] - 18, hr[1] - 32, 52, 48, '#E7C58C', LW * 0.7, 14); }
    rb.tut('L'); rb.tut('R');
  } else { K.rect(XB - 90, 1232, 52, 40, '#E7C58C', LW * 0.7, 12); K.rect(XB - 30, 1236, 52, 40, '#E7C58C', LW * 0.7, 12); rb.tut('R'); }
  // C'nin çay bardağı (masada; önden tutar)
  bardak(K, XC + 74, 1200, { k: 1.35, buhar: !foto, t: tt });
  if (pc.view !== 'side') rc.tut('R'); else rc.tut('R');
  return { pa, pb, pc };
}

// Telefon (yatay, ekranı izleyiciye dönük): merkez P, açı a, ölçek k. Ekranda dünkü öğle yemeğinin fotoğrafı.
const TEL = { w: 290, h: 166 };
function telefonYatay(K, t, S, P, a, k = 1) {
  const { ctx } = K, w = TEL.w * k, h = TEL.h * k;
  ctx.save(); ctx.translate(P[0], P[1]); ctx.rotate(a);
  K.rect(-w / 2, -h / 2, w, h, '#2B3033', LW * 0.9, 18 * k);
  const iw = w - 34 * k, ih = h - 22 * k;
  ctx.save(); ctx.beginPath(); ctx.roundRect(-iw / 2, -ih / 2, iw, ih, 6 * k); ctx.clip();
  // fotoğraf: lokanta görüntüsünün x 70–1010, y 640–1180 aralığı ekrana sığar
  const sx = iw / 940; ctx.translate(-iw / 2, -ih / 2); ctx.scale(sx, sx); ctx.translate(-70, -640);
  lokanta(K, t, S, { mod: 'foto' });
  ctx.restore();
  ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.beginPath(); ctx.roundRect(-iw / 2, -ih / 2, iw, ih, 6 * k); ctx.stroke();
  ctx.restore();
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    kaldir: 0.3, lok1: T('h1:5') - 0.05, ekmek: T('h1:6') + 0.05,
    ofis2: T('h1b') - 0.1, lok3: T('h2') - 0.1, don: T('h2:3') - 0.12, k1: T('k1'), cdon: T('a1') - 0.45, a1: T('a1'),
    necmi: T('n0') - 0.1, n0s: T('n0>'),
    say1: cd0 - 0.05, say2: cd0 + 3.35, say3: cd0 + 6.7,
    n1: T('n1'), kiminle: T('n1:3'), once: T('n1:5'), n1s: T('n1>'),
    cevap: T('d3>') + 0.15, cta: T('d6') - 0.15,
  };
  const film = H.sahneler([
    { id: 'kanca', mekan: OFIS, t0: 0, kay: [-26, 0], cam: [[0, 1.12, 640, 1010]] },
    { id: 'lok1', mekan: LOK, geri: true, t0: tm.lok1, kay: [-22, 0], cam: [[0, 1.2, 545, 922]] },
    { id: 'ofis2', mekan: OFIS, t0: tm.ofis2, kay: [22, 0], cam: [[0, 1.42, 660, 965]] },
    { id: 'lok3', mekan: LOK, geri: true, t0: tm.lok3, kay: [-16, 0], cam: [[0, 1.2, 552, 922], [tm.k1, 1.18, 562, 925]] },
    { id: 'necmi', mekan: OFIS, t0: tm.necmi, kay: [20, 0], cam: [[0, 1.46, 345, 985]] },
    { id: 'say1', mekan: OFIS, t0: tm.say1, cam: [[0, 1.4, 690, 1010]] },
    { id: 'say2', mekan: OFIS, t0: tm.say2, cam: [[0, 1.3, 430, 1000]] },
    { id: 'say3', mekan: OFIS, t0: tm.say3, kesme: false, cam: [[0, 1.3, 430, 1000], [tm.n1, 1.36, 780, 990]] },
    { id: 'buldum', mekan: OFIS, t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.36, 930, 960]] },
    { id: 'cevap', mekan: OFIS, t0: tm.cevap, kesme: false, cam: [[0, 1.3, 860, 975]] },
    { id: 'cta', mekan: OFIS, t0: tm.cta, kesme: false, cam: [[0, 1.34, 930, 975]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— ofis pozları (önden) ———
  const necBase = H.kisi('necmi', { x: NEC_X, expr: DINLE, head: { tilt: -3, look: [0.75, -0.1] }, ...POZ.dur });
  const nec = [
    [tm.necmi, { expr: 'notr', head: { tilt: -4, look: [0.7, -0.05] } }, 0.01],
    [tm.say2, { expr: DALGIN, ...POZ.dusun, head: { tilt: 4, look: [0.3, -0.45] } }, 0.01],
    [tm.say2 + 1.7, { head: { tilt: -3, look: [0.8, -0.1] } }, 0.4],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: MERAK, head: { tilt: -4, look: [-0.85, 0.2] }, ...POZ.dur });
  const def = [
    [tm.say3, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -5, look: [-0.2, -0.55] } }, 0.01],
    [tm.say3 + 1.6, { head: { tilt: 4, look: [-0.5, -0.45] } }, 0.4],
    [tm.n1 - 0.3, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: -2, look: [-0.85, 0.0] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.0, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, -0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -4, look: [0.05, 0.05] } }, 0.3],
  ];
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: 'notr', head: { tilt: 3, look: [0.4, 0.4] }, ...POZ.dur });
  const hik = [
    [0.75, { head: { tilt: -3, look: [0.7, -0.05] } }, 0.35],
    [tm.ofis2, { head: { tilt: -2, look: [0.15, 0.05] } }, 0.01],
    [tm.say1, { expr: DALGIN, head: { tilt: 4, look: [0.45, 0.45] } }, 0.01],
    [tm.say2, { expr: DALGIN, head: { tilt: 4, look: [0.3, 0.45] } }, 0.01],
    [tm.say3 + 1.0, { expr: 'notr', head: { tilt: -3, look: [0.7, -0.1] } }, 0.4],
  ];
  // Altyazı: k1 ve a1 lokantadaki öğretmenlerin kendi sesi (dudak ve balon kuyruğu onlara); n1 balonu "Buldum!"a kadar kalır
  const tlA = { ...tl, lines: tl.lines.map(l => l.id === 'k1' ? { ...l, who: HB } : l.id === 'a1' ? { ...l, who: HC } : l.id === 'n1' ? { ...l, t0: l.t0 + 0.06, t1: T('d3') - 0.02 } : l) };
  return { tm, film, tlA, necBase, nec, defBase, def, hikBase, hik };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında
  kuyruksuz: (t, B) => !!B.sc.geri && t < S.tm.k1 - 0.05,   // geri dönüşte Hikmet'in anlatısı kuyruksuz; öğretmenlerin sözü kuyruklu
  kamera(cam, t, B) {
    const { tm } = S, id = B.sc.id, lg = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
    if (id === 'say1') Object.assign(cam, { zoom: lg(1.4, 1.46, clamp01((t - tm.say1) / 3.4)), cx: 690, cy: 1010 });
    else if (id === 'say2') Object.assign(cam, { zoom: lg(1.3, 1.36, clamp01((t - tm.say2) / 3.35)), cx: 430, cy: 1000 });
    else if (id === 'say3') {   // 0,8 sn'de Hikmet ve Defne'ye kayar, sonra kesime kadar doğrusal itme
      const u = ease.state(seg(t, tm.say3, 0.8)), z = lg(1.3, 1.38, clamp01((t - tm.say3 - 0.8) / (tm.buldum - tm.say3 - 0.8)));
      Object.assign(cam, { zoom: z, cx: lerp(430, 780, u), cy: lerp(1000, 990, u) });
    }
  },
  dunya(K, t, B) { sahne(K, t, S, B); },
  ekran(K, t, B) {
    const { tm } = S;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    H.zamanHapi(K, t, tm.lok1 + 0.2, tm.lok1 + 1.6, K.up('dün öğlen'), { x: 540, y: 578, saat: 12.5 });
    H.zamanHapi(K, t, tm.lok3 + 0.2, tm.lok3 + 1.5, K.up('dün öğlen'), { x: 540, y: 578, saat: 12.5 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (075/078'den): perde yok, alt bantta. Daire solda, başlık ve paylaşım hapı sağında.
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
function sahne(K, t, S, B) {
  if (B.sc.mekan === LOK) { lokanta(K, t, S, { heads: B.heads, tl: S.tlA }); return; }
  ofisSahne(K, t, S, B);
}

// ——— Ofis ———
const KADRO = { kanca: 'NHD', ofis2: 'H', necmi: 'N', say1: 'H', say2: 'NH', say3: 'NHD', buldum: 'D', cevap: 'D', cta: 'D' };
function ofisSahne(K, t, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, tl = S.tlA;
  const kadro = id === 'say3' && t > tm.say3 + 0.8 ? 'HD' : KADRO[id] || 'NHD';   // kayma bitince kenarda yarım Necmi kalmasın
  // geri dönüşten önce duvar saati 0,4 sn geri sarar (bugün 10.12 → dün 12.30'a doğru)
  const g1 = H.geriDonus(t, tm.lok1), g3 = H.geriDonus(t, tm.lok3);
  const saat = t < tm.lok1 ? H.saatSar(10.2, 8.2, g1.sar) : t < tm.lok3 ? H.saatSar(10.2, 8.2, g3.sar) : 10.2 + t / 3600;
  M.mekanCiz(K, OFIS, 'arka', t, { durum: { saat } });

  // Hikmet: masanın arkasında; telefonunu yatay tutar, ekranında dünkü fotoğraf
  const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t), hO = { heads };
  let P = [hp.x + 96, 1110], a = -0.04, iki = false;
  if (id === 'kanca') { const u = ease.state(seg(t, tm.kaldir, 0.4)); P = mix2([hp.x + 70, 1120], [hp.x + 120, 1060], u); a = lerp(-0.1, 0.06, u); iki = true; }
  else if (id === 'ofis2') { P = [hp.x + 110, 1120]; a = 0.04; }
  else if (id === 'say1') { P = [hp.x + 96, 1088]; a = -0.05; iki = true; }
  else { P = [hp.x + 70, 1205]; a = -0.02; }
  const k = id === 'kanca' ? 1.15 : 1, eR = [P[0] + 0.42 * TEL.w * k, P[1] + 0.4 * TEL.h * k], eL = [P[0] - 0.42 * TEL.w * k, P[1] + 0.4 * TEL.h * k];
  const telVar = ['kanca', 'ofis2', 'necmi', 'say1'].includes(id);   // sayaçın 2. bölümünden sonra telefon yok (fotoğraftaki bir kişiyi el ya da hap örtmesin, gösterir gibi durmasın)
  if (telVar) { hO.R = [eR, 1, 'A']; if (iki) hO.L = [eL, 1, 'A']; }
  const hc = kadro.includes('H') ? oyna(K, t, tl, 'hikmet', hp, hO) : null;
  ofisMasa(K);
  bardak(K, MASA.x0 + 60, MASA.y + 2, { buhar: true, t, k: 1.6 });
  if (hc && telVar) { telefonYatay(K, t, S, P, a, k); hc.tut('R'); if (iki) hc.tut('L'); }

  // Necmi (solda; sol elinde çay). n0'da sağ avucunu açıp sorar.
  const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t), nO = { heads };
  nO.L = [[np.x - 60, 1190], 1, 'A'];
  if (id === 'necmi') { const w = pIn(t, tm.necmi + 0.25, tm.n0s + 0.2, 0.3); if (w > 0.01) nO.R = [[np.x + 120, 1150 - 30 * w], w, 'B']; }
  if (kadro.includes('N')) {
    const nc = oyna(K, t, tl, 'necmi', np, nO);
    bardak(K, nc.handL[0] + 8, nc.handL[1] + 26, { buhar: true, t, k: 1.7 }); nc.tut('L');
  }

  // Defne (sağda)
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t), dO = { heads };
  dp.y -= H.buldumHop(t, tm.buldum);
  let parmak = 0;
  if (id === 'say3') {   // ipucu: "kiminle"de avucu Hikmet'e açık; "Önce onu düşünün"de işaret parmağı başının yanında
    const w1 = pIn(t, tm.kiminle - 0.25, tm.once - 0.15, 0.3), w2 = W(t, tm.once - 0.1, 0.3);
    if (w1 > 0.01) dO.L = [[dp.x - 170, 1140 - 30 * w1], w1, 'A'];
    if (w2 > 0.01) { dO.R = [H.elYeri('defne', dp, 'R', 'yukari'), w2, 'B']; parmak = w2; }
  }
  if (!kadro.includes('D')) return;
  const dc = oyna(K, t, tl, 'defne', dp, dO);
  if (parmak > 0.3) dc.parmak('R', 1, { yon: -Math.PI / 2 });
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
}
