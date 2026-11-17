// Bölüm 43 · LOKUM KUTUSU (v4 "hikâye" dili; storyboard: hikayeler/bolum_043_v5.md).
// Logline: Çay ocağında Hikmet'in kutusunda 9 çikolata ve 10 lokum var. Necmi gözü kapalı ikişer parça çeker; aynıysa ikisi
// yenir ve Hikmet'in tabağından kutuya bir lokum konur, farklıysa lokum yenir ve çikolata geri konur. Necmi daha başta son
// parçanın çikolata olacağını söyler ve her turda haklı çıkar. Kahraman an: kutunun önündeki çikolata sayacı 9, 7, 5, 3, 1.
// Akılda kalacak tek şey: çikolata sayısı ya hiç değişmez ya ikişer azalır; tek sayı ikişer azalarak sıfır olmaz.
// Tek mekân (b043_ocak), önden: karakterler tezgâhın arkasında; kutu tezgâhın üstünde Necmi'nin önünde; kutunun kapağı
// arka duvardaki rafa dayalı, kural kapakta yazılı (yazı 46 px, kadrajlarda zoom ≥ 0,96 → ekranda ≥ 44 px).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ } = H;
const TAU = Math.PI * 2;

// ═══════════════════════════ Ölçüler ═══════════════════════════
const OCAK = 'b043_ocak', TEZ_Y = 1232, NECMI_Y = 1450;                // Necmi tezgâhın arkasında basamakta (başı kutunun üstünde kalsın)                            // tezgâh üstü
const X = { hikmet: 290, necmi: 690, defne: 950 };
const KUTU = { x0: 480, x1: 900, arka: 1135, on: 1232, duvar: 26 };   // tepsi (eğik üst yüz) ve ön duvar
const KAPAK = { x: 445, y: 588, w: 490, h: 262 };                   // rafa dayalı kapak (kural)
const TABAK = [405, TEZ_Y + 4];                                      // Hikmet'in lokum tabağı
const CIK = { on: '#5A3422', ust: '#7E4D30', cizgi: '#A0704B' }, LOK = { on: '#E28E9E', ust: '#F5C6CF', toz: '#FFF6F2' };
const YESIL = PAL.green, MERCAN = PAL.coral;
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Kutu yuvaları ve kural ═══════════════════════════
// 20 yuva: 5 sütun × 4 sıra (0 arka, 3 ön). Yuva noktası parçanın ön yüzünün alt ortasıdır.
const yuva = i => { const c = i % 5, r = Math.floor(i / 5), k = 0.88 + 0.04 * r; return [690 + (c - 2) * 80 * (0.94 + 0.02 * r), 1160 + r * 24, k]; };
// başlangıç dizilişi: 9 çikolata, 10 lokum, 1 boş
const DIZ = ['L', 'C', 'L', 'C', 'L', 'C', 'L', 'C', 'L', 'C', 'L', 'C', 'L', 'C', 'L', 'C', 'L', 'C', 'L', null];
// Kural: aynı tür → ikisi yenir, dışarıdan bir lokum eklenir; farklı → lokum yenir, çikolata geri konur.
// Çekiliş dizileri sabittir (kahraman anda "CC" adımları 6, 11, 12, 15: sayaç d4 "ikişer azalıyor"da ve d5 "İkişer ikişer"de iner).
const SIRA1 = ['CC', 'CL', 'LL', 'CL', 'CC', 'LL', 'CL', 'LL', 'CL', 'CC', 'LL', 'CL', 'LL', 'CC', 'CL', 'LL', 'CL', 'CL'];
export const SIRA2 = ['CL', 'LL', 'CL', 'LL', 'CL', 'LL', 'CC', 'CL', 'LL', 'CL', 'LL', 'CC', 'CC', 'CL', 'LL', 'CC', 'LL', 'CL'];
// Yuvaları sabit bir sırayla seçer (tohumlu karıştırma); her adımı kurala göre uygular ve denetler.
function karistir(seed) { const r = H.mulberry32(seed), a = [...Array(20).keys()]; for (let i = 19; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function oyun(baslangic, sira, seed) {
  const sec = karistir(seed), durum = [baslangic.slice()], adim = [];
  for (const tip of sira) {
    const s = durum[durum.length - 1].slice(), say = k => s.filter(v => v === k).length;
    const iste = tip === 'CC' ? ['C', 'C'] : tip === 'LL' ? ['L', 'L'] : ['C', 'L'];
    if (iste.filter(k => k === 'C').length > say('C') || iste.filter(k => k === 'L').length > say('L')) throw new Error('b043: imkânsız çekiliş ' + tip);
    const al = []; for (const k of iste) al.push(sec.find(i => s[i] === k && !al.includes(i)));
    const a = { tip, al, yenen: [], geri: null, ekle: null };
    if (tip === 'CL') { a.yenen = [al[1]]; a.geri = al[0]; s[al[1]] = null; }           // lokum yenir, çikolata yerine
    else { a.yenen = al.slice(); s[al[0]] = s[al[1]] = null; a.ekle = sec.find(i => s[i] === null); s[a.ekle] = 'L'; }   // ikisi yenir, +1 lokum
    durum.push(s); adim.push(a);
  }
  const son = durum[durum.length - 1], nC = son.filter(v => v === 'C').length, nL = son.filter(v => v === 'L').length;
  // denetim: çikolata yalnız ikişer azalır, her adımda parça sayısı 1 azalır, sonunda tek çikolata kalır
  durum.forEach((d, i) => { if (i) { const dc = durum[i - 1].filter(v => v === 'C').length - d.filter(v => v === 'C').length, n0 = durum[i - 1].filter(Boolean).length, n1 = d.filter(Boolean).length; if (![0, 2].includes(dc) || n0 - n1 !== 1) throw new Error('b043: kural bozuldu, adım ' + i); } });
  if (nC !== 1 || nL !== 0) throw new Error(`b043: son durum ${nC} çikolata ${nL} lokum`);
  return { durum, adim, cik: durum.map(d => d.filter(v => v === 'C').length) };
}
const R1 = oyun(DIZ, SIRA1, 431);
const SONYUVA1 = R1.durum[18].indexOf('C');
// İkinci tur (sayaç süresinde Necmi kutuyu yeniden doldurur): kalan çikolata yerinde, öbür yuvalar 8 çikolata + 10 lokum
const DIZ2 = (() => {
  const d = Array(20).fill(null); d[SONYUVA1] = 'C'; let c = 8, l = 10;
  for (let i = 0; i < 20; i++) if (i !== SONYUVA1 && (c || l)) { const ist = DIZ[i] || 'C'; if (ist === 'C' && c) { d[i] = 'C'; c--; } else if (l) { d[i] = 'L'; l--; } else { d[i] = 'C'; c--; } }
  return d;
})();
const R2 = oyun(DIZ2, SIRA2, 977);
if (R2.cik.join(',') !== [9, 9, 9, 9, 9, 9, 9, 7, 7, 7, 7, 7, 5, 3, 3, 3, 1, 1, 1].join(',')) throw new Error('b043: sayaç dizisi ' + R2.cik.join(','));
const DOLUM = [...Array(20).keys()].filter(i => DIZ2[i] && i !== SONYUVA1).sort((a, b) => (a % 5) - (b % 5) || b - a);   // soldan sağa, önden arkaya

// ═══════════════════════════ Nesneler ═══════════════════════════
// Parça: (x, y) ön yüzün alt ortası; k ölçek; tur 'C' | 'L'
function parca(K, x, y, k, tur, a = 1) {
  if (k < 0.02 || a < 0.02) return;
  const { ctx } = K, w = 60 * k, hf = 24 * k, ht = 15 * k, c = tur === 'C' ? CIK : LOK;
  ctx.save(); if (a < 1) ctx.globalAlpha = a;
  K.poly([[x - w / 2, y - hf], [x - w / 2 + 6 * k, y - hf - ht], [x + w / 2 - 6 * k, y - hf - ht], [x + w / 2, y - hf]], c.ust, LW * 0.55 * k);
  K.rect(x - w / 2, y - hf, w, hf, c.on, LW * 0.55 * k, 4 * k);
  if (tur === 'C') { K.line(x - w * 0.22, y - hf - ht * 0.5, x + w * 0.22, y - hf - ht * 0.5, 3 * k, c.cizgi); K.line(x - w * 0.3, y - hf * 0.5, x + w * 0.3, y - hf * 0.5, 2.5 * k, '#7A4A2E'); }
  else for (const [dx, dy] of [[-0.28, 0.45], [0.05, 0.6], [0.3, 0.35], [-0.08, 0.25]]) K.circ(x + dx * w, y - hf - ht * dy, 2.6 * k, c.toz, 0);
  ctx.restore();
}
// Kutu: eğik tepsi, yuvalardaki parçalar (çizilecek liste), ön duvar
function kutu(K, liste) {
  const { x0, x1, arka, on, duvar } = KUTU;
  K.poly([[x0 + 16, arka - 14], [x1 - 16, arka - 14], [x1 - 14, arka], [x0 + 14, arka]], '#8E2830', LW * 0.7);   // arka iç duvar
  K.poly([[x0 + 14, arka], [x1 - 14, arka], [x1, on], [x0, on]], '#6B1D24', LW);                                  // tepsinin içi
  for (let r = 0; r < 4; r++) K.line(x0 + 30 - r * 4, 1162 + r * 24 - 6, x1 - 30 + r * 4, 1162 + r * 24 - 6, 2, '#57171D');
  liste.sort((a, b) => a.y - b.y).forEach(p => parca(K, p.x, p.y, p.k, p.tur, p.a ?? 1));
  K.rect(x0, on, x1 - x0, duvar, PAL.red, LW, 5);
  K.line(x0 + 10, on + 9, x1 - 10, on + 9, 3, PAL.mustard);
}
// Kapak: rafa dayalı, iki sütun (AYNI | FARKLI); vurgu: sütunun arkasında hardal zemin
function kapak(K, t, { ayni = 0, farkli = 0 }) {
  const { x, y, w, h } = KAPAK, { ctx } = K, s = 46;
  K.rect(x, y, w, h, PAL.red, LW, 14);
  K.rect(x + 14, y + 14, w - 28, h - 28, PAL.cream, LW * 0.6, 8);
  const cx = [x + w * 0.27, x + w * 0.73];
  for (const [i, u] of [[0, ayni], [1, farkli]]) if (u > 0.01) { ctx.save(); ctx.globalAlpha = 0.55 * u; K.rect(cx[i] - w * 0.24 + (i ? 4 : 0), y + 22, w * 0.46, h - 44, PAL.mustard, 0, 8); ctx.restore(); }
  K.line(x + w * 0.5, y + 30, x + w * 0.5, y + h - 30, 4, '#C9B994');
  const ic = (px, py, tur) => parca(K, px, py, 0.68, tur);
  // AYNI: [C C] / [L L] → YENİR, + [L]
  K.text(K.up('aynı'), cx[0], y + 70, s, INK, 900);
  ic(cx[0] - 82, y + 122, 'C'); ic(cx[0] - 38, y + 122, 'C'); K.text('/', cx[0], y + 120, 40, '#9C8E70', 900); ic(cx[0] + 38, y + 122, 'L'); ic(cx[0] + 82, y + 122, 'L');
  K.text(K.up('yenir'), cx[0], y + 180, s, INK, 900);
  K.text('+', cx[0] - 34, y + 236, s, PAL.green, 900); ic(cx[0] + 22, y + 232, 'L');
  // FARKLI: [C L] → [L] YENİR, [C] GERİ
  K.text(K.up('farklı'), cx[1], y + 70, s, INK, 900);
  ic(cx[1] - 24, y + 122, 'C'); ic(cx[1] + 24, y + 122, 'L');
  ic(cx[1] - 78, y + 176, 'L'); K.text(K.up('yenir'), cx[1] + 26, y + 180, s, INK, 900);
  ic(cx[1] - 78, y + 232, 'C'); K.text(K.up('geri'), cx[1] + 26, y + 236, s, INK, 900);
}
// Hikmet'in tabağı: n lokum (alttan üste dizilir, üstten eksilir)
const TABAK_YER = [6, 5, 4, 3, 2, 1].flatMap((n, r) => [...Array(n).keys()].map(i => [(i - (n - 1) / 2) * 30, -r * 17]));   // 21 lokum: iki turda eklenecek lokumların hepsi (10 + 11)
function tabak(K, [x, y], n, yuz = 0) {   // yuz 0..1: tabak kameraya doğru dikilir (boş yüzü görünür)
  const { ctx } = K; ctx.save(); ctx.translate(x, y);
  K.ell(0, -4 - 70 * yuz, 112, 18 + 76 * yuz, '#F2EEE4', LW * 0.8); K.ell(0, -6 - 70 * yuz, 80, 10 + 56 * yuz, '#E3DDCF', 0);
  for (let i = 0; i < n; i++) parca(K, TABAK_YER[i][0], TABAK_YER[i][1] - 6, 0.55, 'L');
  ctx.restore();
}
// Çikolata tableti (ipucu): 2 sütun × satır; (x, y) tabletin alt ortası
const TW = 66, TH = 42;   // tablet karesi
function tablet(K, x, y, sutun) {   // yatay tablet: 4 sütun × 2 satır; (x, y) alt orta; sağdan sütun sütun eksilir
  if (sutun <= 0) return;
  K.rect(x - 2 * TW - 10, y - 2 * TH - 16, 4 * TW + 20, 2 * TH + 16, '#C9B48A', LW * 0.7, 6);      // ambalaj kâğıdı
  for (let c = 0; c < sutun; c++) for (let r = 0; r < 2; r++) K.rect(x - 2 * TW + c * TW, y - 2 * TH - 8 + r * TH, TW - 3, TH - 3, CIK.on, LW * 0.5, 4);
}
const ciftKare = (K, x, y, k = 1) => { for (let r = 0; r < 2; r++) K.rect(x - (TW / 2 - 1) * k, y - TH * k + r * TH * k, (TW - 3) * k, (TH - 3) * k, CIK.on, LW * 0.5, 4); };   // dikey çift (bir sütun)

// ═══════════════════════════ Mekân ═══════════════════════════
M.mekanEkle(OCAK, {
  gen: [-300, 1500], dongu: ['çaydanlık buharı', 'damlayan musluk'],
  capa: { kutu: [690, 1180], kapak: [KAPAK.x + KAPAK.w / 2, KAPAK.y + KAPAK.h / 2], tabak: TABAK },
  kadraj: { genis: [0.97, 610, 1012] },
  arka(K, t, { isik }) {
    const { ctx } = K;
    M.oda(K, { x0: -600, x1: 2100, isik, duvar: 'fayans', zemin: 'karo' });
    // raf (kapak buna dayalı) ve raftaki çay bardakları
    K.rect(300, KAPAK.y + KAPAK.h - 2, 680, 20, PAL.woodTop, LW, 5);
    for (const x of [320, 950]) K.poly([[x, KAPAK.y + KAPAK.h + 18], [x + 12, KAPAK.y + KAPAK.h + 18], [x + 12, KAPAK.y + KAPAK.h + 58]], PAL.woodDark, LW * 0.7);
    // duvar saati (sol üst) ve sağda lavabo + musluk (döngü: damla)
    M.duvarSaati(K, 165, 640, 58, 15.5 + t / 3600, t);
    K.rect(1040, TEZ_Y - 150, 230, 26, '#C9C3B6', LW * 0.8, 6);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [lw, c] of [[24, INK], [12, '#C9C3B6']]) { ctx.beginPath(); ctx.moveTo(1230, TEZ_Y - 150); ctx.lineTo(1230, 1004); ctx.quadraticCurveTo(1230, 966, 1196, 966); ctx.quadraticCurveTo(1162, 966, 1162, 1000); ctx.lineWidth = lw; ctx.strokeStyle = c; ctx.stroke(); }
    ctx.restore();
    H.damlaDongu(K, 1162, 1024, TEZ_Y - 156, t, { periyot: 1.35 });
    // asma dolap (sağ üst)
    K.rect(1000, 470, 330, 250, PAL.woodTop, LW, 8); K.line(1165, 480, 1165, 710, 4, PAL.woodDark); K.circ(1148, 640, 8, '#5D6A61', LW * 0.6); K.circ(1182, 640, 8, '#5D6A61', LW * 0.6);
  },
  // tezgâh: karakterlerin önünde (bel hizasının altını örter); sol uçta ocak ve çaydanlık (döngü: buhar)
  on(K, t) {
    const { ctx } = K;
    K.rect(-300, TEZ_Y + 26, 1800, 1500 - TEZ_Y - 26, PAL.wood, LW);
    for (let i = 0; i < 8; i++) { const x = -260 + i * 220; K.rect(x, TEZ_Y + 50, 200, 1500 - TEZ_Y - 66, PAL.woodTop, LW * 0.8, 6); K.circ(x + (i % 2 ? 26 : 174), TEZ_Y + 120, 8, '#5D6A61', LW * 0.6); }
    K.rect(-300, TEZ_Y, 1800, 30, PAL.woodTop, LW, 6);
    // ocak + çaydanlık
    K.rect(70, TEZ_Y - 20, 130, 22, '#5D6A61', LW * 0.8, 6);
    ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(135, TEZ_Y - 124, 58, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#3A3F3C'; ctx.stroke(); ctx.restore();
    K.poly([[188, TEZ_Y - 104], [234, TEZ_Y - 132], [242, TEZ_Y - 120], [192, TEZ_Y - 82]], PAL.metal, LW);
    K.rect(85, TEZ_Y - 128, 100, 108, PAL.metal, LW, 14);
    K.rect(103, TEZ_Y - 176, 64, 50, '#B9C6BB', LW, 12); K.circ(135, TEZ_Y - 182, 9, '#3A3F3C', LW * 0.6);
    H.buhar(K, 240, TEZ_Y - 140, t, { k: 0.85, n: 2 });
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    tap: 0.3, h2a: T('h2a'), dokuz: T('h2a:3') - 0.04, onLokum: T('h2a:5') - 0.04, goz: T('h2a:8'),
    h2b: T('h2b'), farkli: T('h2b:6'), hd: T('hd'), h2c: T('h2c'),
    d2: T('d2'), h3: T('h3'), sans: T('h3:2') - 0.04,
    n1: T('n1'), ikiser1: T('n1:2'), ikiser2: T('n1:3'), yerim: T('n1:4'), mudur: T('n1:5'),
    cevap: T('d3:2') - 0.1, d4: T('d4'), d5: T('d5'), espri: T('h4') - 0.25, lokumlarim: T('h4:2'), cta: T('d6') - 0.2,
  };
  tm.s2 = cd0 + 5.6; tm.bak = cd - 0.32; tm.ipucu = tm.bak + 5 / 30;
  // ——— tur 1: ilk iki adım repliğe kilitli, kalan 16 adım hd'de hızlı (zaman atlaması) ———
  const sabit = (t0, d) => ({ t0, tL: t0 + 0.25 * d, tH: t0 + 0.5 * d, tR: t0 + 0.65 * d, tA: t0 + 0.7 * d, t1: t0 + d });
  const z1 = [
    { t0: T('h2a:9') - 0.15, tL: T('h2a:10') - 0.05, tH: T('h2a:10') + 0.3, tR: T('h2b:1') - 0.04, tA: T('h2b:4') - 0.1, t1: T('h2b:5') + 0.35 },
    { t0: T('h2b:6') - 0.15, tL: T('h2b:6') + 0.15, tH: T('h2b:6') + 0.5, tR: T('h2b:7') - 0.04, tA: T('h2b:9') - 0.04, t1: T('h2b:11') + 0.15 },
  ];
  const h0 = T('hd') + 0.05, h1 = T('hd>') - 0.05, hd = (h1 - h0) / 16;
  for (let i = 0; i < 16; i++) z1.push(sabit(h0 + i * hd, hd * 0.98));
  tm.son1 = h1;
  // ——— tur 2 (kahraman an): 18 adım eşit aralıkla ———
  // adım başları kelime çapalarına bağlı parçalı doğrusal: CC adımları (6, 11, 12, 15) sayacı "ikişer azalıyor", "İkişer",
  // "ikişer", "asla" kelimelerinde indirir; son adım "sıfır"dan hemen sonra biter, son çikolata 1,3 sn ekranda kalır
  const capa = [[0, tm.cevap + 0.15], [6, T('d4:6') - 0.3], [11, T('d5:0') - 0.27], [12, T('d5:1') - 0.27], [15, T('d5:5') - 0.22], [18, T('d5:6') + 0.25]];
  const basla = i => { for (let j = 1; j < capa.length; j++) if (i <= capa[j][0]) { const [a, ta] = capa[j - 1], [b, tb] = capa[j]; return ta + (tb - ta) * (i - a) / (b - a); } };
  const z2 = []; for (let i = 0; i < 18; i++) z2.push(sabit(basla(i), (basla(i + 1) - basla(i)) * 0.98));
  const k1 = basla(18);
  tm.son2 = k1;
  // dolum (sayaç): 18 parça
  const dolum = DOLUM.map((s, i) => ({ s, t: cd0 + 0.8 + i * 0.27 }));
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, 0.97, 610, 1012], [2.6, 1.0, 640, 1010], [tm.h2a + 0.3, 1.07, 690, 1026], [tm.h2b - 0.3, 1.08, 690, 1024]] },
    { id: 'kural', t0: tm.h2b - 0.08, cam: [[0, 1.07, 640, 1024], [tm.farkli - 0.4, 1.07, 720, 1024], [tm.hd - 0.1, 1.1, 700, 1030], [tm.h2c - 0.05, 0.98, 620, 1012]] },
    { id: 'deneme', t0: tm.d2 - 0.1, cam: [[0, 1.12, 760, 1015], [tm.h3 + 0.2, 1.1, 700, 1020]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 0.97, 615, 965], [cd0 + 5, 0.99, 620, 960]] },
    { id: 'sayac2', t0: tm.s2, cam: [[0, 1.3, 725, 948], [cd - 0.4, 1.33, 720, 944]] },
    { id: 'ipucu', t0: tm.ipucu, cam: [[0, 1.15, 690, 1000], [tm.mudur, 1.18, 684, 998]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.4, 935, 920]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.42, 690, 1180], [tm.d5 - 0.2, 1.44, 684, 1178], [tm.son2, 1.45, 692, 1176]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.36, 360, 1010], [T('h4>'), 1.4, 365, 1006]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.3, 860, 990], [tm.cta + 1.6, 1.36, 880, 985]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  const hikBase = H.kisi('hikmet', { x: X.hikmet, expr: 'mutlu', head: { tilt: -3, look: [0.7, 0.1] }, ...POZ.dur });
  const hik = [
    [tm.h2a, { head: { tilt: -4, look: [0.75, 0.2] } }, 0.3],
    [tm.hd, { expr: 'mutlu', head: { tilt: -4, look: [0.6, 0.3] } }, 0.3],
    [tm.son1, { expr: 'mutlu', head: { tilt: 4, look: [0.9, 0.05] } }, 0.3],
    [tm.h2c - 0.1, { expr: 'mutlu', head: { tilt: 3, look: [0, 0.1] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: 5, look: [0.9, 0.1] } }, 0.3],
    [tm.h3 - 0.1, { expr: 'mutlu', head: { tilt: -4, look: [0.55, 0.35] } }, 0.3],
    [cd0 + 0.4, { expr: 'notr', head: { tilt: -2, look: [0.55, 0.6] } }, 0.35],     // tabağındaki lokumları sayar
    [cd0 + 3.4, { head: { tilt: 4, look: [0.8, 0.25] } }, 0.35],
    [tm.bak, { head: { tilt: -3, look: [0.6, 0.2] } }, 0.3],
    [tm.cevap, { expr: 'saskin', head: { tilt: -3, look: [0.6, 0.45] } }, 0.01],
    [tm.espri, { expr: 'saskin', head: { tilt: 3, look: [0.5, 0.6] } }, 0.01],
    [tm.lokumlarim, { expr: 'yorgun', head: { tilt: -7, look: [0.1, 0.2] } }, 0.3],
    [tm.cta, { expr: 'yorgun', head: { tilt: -5, look: [0.85, 0.2] } }, 0.35],
  ];
  const defBase = H.kisi('defne', { x: X.defne, expr: 'saskin', head: { tilt: 4, look: [-0.7, 0.15] }, ...POZ.dur });
  const def = [
    [0.9, { head: { tilt: -4, look: [-0.5, -0.65] } }, 0.3],
    [tm.h2a, { expr: 'notr', head: { tilt: -3, look: [-0.6, 0.3] } }, 0.3],
    [tm.hd, { head: { tilt: -3, look: [-0.6, 0.45] } }, 0.3],
    [tm.son1 - 0.2, { expr: 'saskin', head: { tilt: -6, look: [-0.6, 0.45] } }, 0.25],
    [tm.h2c, { expr: 'notr', head: { tilt: 4, look: [-0.9, 0.05] } }, 0.3],
    [tm.d2 - 0.05, { expr: 'mutlu', head: { tilt: -5, look: [-0.6, 0.05] } }, 0.25],
    [tm.h3, { expr: 'saskin', head: { tilt: 4, look: [-0.9, 0.1] } }, 0.3],
    [cd0 + 0.6, { expr: H.IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [-0.4, -0.5] } }, 0.4],
    [cd0 + 3.0, { head: { tilt: -5, look: [-0.6, 0.4] } }, 0.35],
    [tm.s2 - 0.2, { expr: H.IFADE.dusun, armR: POZ.dur.armR, head: { tilt: 5, look: [0.4, -0.6] } }, 0.35],
    [tm.s2 + 2.4, { expr: 'notr', head: { tilt: -6, look: [-0.3, -0.4] } }, 0.35],
    [tm.bak, { expr: 'notr', head: { tilt: -4, look: [-0.95, 0.1] } }, 0.25],
    [tm.buldum - 0.06, {}, 0.01],
    [tm.buldum - 0.05, { expr: 'mutlu', ...POZ.yukari, head: { tilt: -6, look: [0, -0.3] } }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.7, 0.45] } }, 0.01],
    [tm.espri, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.1] } }, 0.01],
    [tm.cta - 0.05, { expr: 'mutlu', head: { tilt: -7, look: [0.05, 0.05] } }, 0.35],
  ];
  return { tm, film, hikBase, hik, defBase, def, z1, z2, dolum };
}

// ═══════════════════════════ Kutu durumu (bütün sahneler aynı fonksiyonu okur) ═══════════════════════════
// Dönen: { parcalar: [{x,y,k,tur,a}], elde: [{x,y,tur,k}] | null, el: [x,y] | null, yan: 'L'|'R', tabakN, cik, sonHalka }
const EL_Y = 1100;
function turDurum(R, zaman, t) {
  let i = 0; while (i < 18 && t >= zaman[i].t1) i++;
  return i;
}
function kutuDurum(S, t) {
  const { tm, z1, z2, dolum } = S;
  const out = { parcalar: [], elde: [], el: null, yan: 'R', tabakN: TABAK_YER.length, ucan: [], cik: 9 };
  const ekle = (d, haric = []) => d.forEach((v, s) => { if (v && !haric.includes(s)) { const [x, y, k] = yuva(s); out.parcalar.push({ x, y, k, tur: v }); } });
  // hangi tur?
  let R, Z, tabak0;
  if (t < z1[0].t0 || t < tm.son1 + 0.3 || t < tm.cd0 + 0.7) { R = R1; Z = z1; tabak0 = TABAK_YER.length; }
  else if (t < z2[0].t0) {
    // dolum: son çikolata yerinde, parçalar sırayla Necmi'nin elinden yuvaya iner
    out.tabakN = TABAK_YER.length - R1.adim.filter(a => a.ekle !== null).length; const d = Array(20).fill(null); d[SONYUVA1] = 'C';
    for (const { s, t: ts } of dolum) {
      if (t >= ts + 0.1) d[s] = DIZ2[s];
      else if (t >= ts - 0.22) { const [x, y, k] = yuva(s), u = seg(t, ts - 0.22, 0.32); out.elde.push({ x, y: y - 40 * (1 - ease.state(u)), tur: DIZ2[s], k: k * ease.enter(clamp01(u * 2.2)) }); out.el = [x, y - 40 * (1 - ease.state(u)) - 18]; out.yan = x < 690 ? 'L' : 'R'; }
    }
    ekle(d); out.cik = d.filter(v => v === 'C').length;
    return out;
  } else { R = R2; Z = z2; tabak0 = TABAK_YER.length - R1.adim.filter(a => a.ekle !== null).length; }
  const i = turDurum(R, Z, t), d = R.durum[i];
  out.cik = R.cik[i] - (i < 18 && t >= Z[i].tR && R.adim[i].tip === 'CC' ? 2 : 0);   // çikolatalar yendiği an
  out.tabakN = tabak0 - R.adim.slice(0, i).filter(a => a.ekle !== null).length;
  if (i >= 18 || t < Z[0].t0) { ekle(d); out.bitti = i >= 18; out.sonYuva = d.indexOf('C'); return out; }
  const a = R.adim[i], z = Z[i], P = a.al.map(s => yuva(s));
  const orta = [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2];
  out.yan = orta[0] < 690 ? 'L' : 'R';
  const D = [690 + (out.yan === 'L' ? -118 : 118), EL_Y];   // elde tutma yeri: Necmi'nin göğsünün iki yanı (Defne'nin önüne taşmaz)
  const tutY = (p, j) => [D[0] + (j ? 38 : -38), D[1] + 16];
  // eldeki iki parça, kurala göre çözülür
  let haric = [...a.al];
  if (a.ekle !== null) haric.push(a.ekle);
  ekle(d, haric);
  // önceki durumdaki yerinde duranlar için: alınan iki parça (t < tL) yuvada; eklenen lokum (t < tA) tabakta
  const lift = W(t, z.tL, z.tH - z.tL);
  a.al.forEach((s, j) => {
    const tur = R.durum[i][s] ?? (j === 0 && a.tip !== 'LL' ? 'C' : 'L');
    const yenen = a.yenen.includes(s), geri = a.geri === s;
    const p0 = [P[j][0], P[j][1]], p1 = tutY(null, j);
    let p = kar(p0, p1, lift), k = lerp(P[j][2], 1.25, lift), al = 1;   // elde büyür: kameraya yakın
    if (yenen && t >= z.tR) { const u = seg(t, z.tR, 0.16); k *= 1 - ease.exit(u); }
    if (geri && t >= z.tA) { const u = ease.state(seg(t, z.tA, Math.max(0.12, z.t1 - z.tA - 0.05))); p = kar(p1, p0, u); p[1] -= 30 * 4 * u * (1 - u); k = lerp(1.25, P[j][2], u); }
    out.elde.push({ x: p[0], y: p[1], tur, k, a: al });
  });
  // önceki durumda alınan parçaların türü (R.durum[i] çekilişten öncedir)
  // el: yuvaya uzanır (t0→tL), kaldırır (tL→tH), tutar; çikolata geri konurken onunla gider
  const elYuva = [orta[0], orta[1] - 30];
  let el = t < z.tL ? kar(D, elYuva, W(t, z.t0, z.tL - z.t0)) : kar(elYuva, [D[0], D[1] + 4], lift);
  if (a.geri !== null && t >= z.tA) { const g = out.elde.find((e, j) => a.al[j] === a.geri); el = [g.x, g.y - 22]; }
  out.el = el;
  // eklenen lokum: tabaktan yuvaya
  if (a.ekle !== null) {
    const n = out.tabakN, [x, y, k] = yuva(a.ekle), src = [TABAK[0] + TABAK_YER[n - 1][0] * 1, TABAK[1] + TABAK_YER[n - 1][1] - 6];
    if (t < z.tA) out.ucan.push({ x: src[0], y: src[1], k: 0.55, tur: 'L', tabakta: true });
    else { const u = seg(t, z.tA, Math.max(0.12, z.t1 - z.tA - 0.02)), p = H.yay(src, [x, y], ease.state(u), 70); out.ucan.push({ x: p[0], y: p[1], k: lerp(0.55, k, u), tur: 'L' }); }
    if (t >= z.tA) out.tabakN = n - 1; else out.tabakN = n - 1;   // tabaktaki üst lokum "ucan" olarak çizilir
  }
  return out;
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  kartSon: S.tm.cevap,
  dunya(K, t, B) {
    const { tm } = S, id = B.sc.id, kd = kutuDurum(S, t);
    M.mekanCiz(K, OCAK, 'arka', t);
    kapak(K, t, { ayni: pIn(t, tm.h2b - 0.1, tm.farkli - 0.2, 0.25), farkli: pIn(t, tm.farkli - 0.15, tm.hd - 0.1, 0.25) });
    // ——— Hikmet ———
    const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
    if (t >= tm.cd0 && t < tm.s2) H.glance(hp, t, tm.s2, 5.5);
    let tabakYer = TABAK, tabakRot = 0;
    const hk = {};
    if (id === 'espri' || id === 'cta') {   // boş tabağı kaldırır
      const u = W(t, tm.lokumlarim - 0.3, 0.4) * (1 - W(t, tm.cta - 0.4, 0.3));
      tabakYer = kar(TABAK, [X.hikmet + 100, 1150], u); tabakRot = u;
      hk.R = [[tabakYer[0] + 96, tabakYer[1] - 4 - 70 * u], u, 'A'];
    }
    if (t < 2.7) { const u = pIn(t, 0.55, 2.45, 0.3); if (u) hk.R = [[X.hikmet + 175, 1110], u, 'B']; }   // kanca: Necmi'yi gösterir
    const sonC = yuva(SONYUVA1), h3U = id === 'deneme' ? pIn(t, tm.h3 - 0.1, tm.cd0 - 0.1, 0.28) : 0;   // h3: kutudaki son çikolatayı gösterir
    if (h3U) hk.R = [[X.hikmet + 175, 1150], h3U, 'A'];
    if (id === 'sayac') { const u = pIn(t, tm.cd0 + 0.6, tm.cd0 + 3.2, 0.3); if (u) { hk.R = [[TABAK[0] - 20, TABAK[1] - 30], u, 'A']; } }
    const ha = oyna(K, t, tl, 'hikmet', hp, { heads: B.heads, ...hk });
    if (h3U > 0.5) ha.isaret('R', [sonC[0], sonC[1] - 20]);
    // ——— Defne ———
    const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
    H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.cevap });
    const dk = {};
    const isaretU = pIn(t, tm.d2 - 0.05, tm.h3 + 0.1, 0.25);   // d2: "Şans!" Necmi'yi gösterir
    if (isaretU) dk.L = [H.elYeri('defne', dp, 'L', 'gogus').map((v, i) => v + (i ? -40 : -70)), isaretU, 'A'];
    if (id === 'sayac2') { const w = pIn(t, tm.s2 + 0.1, tm.bak - 0.1, 0.3); if (w) { const hd = H.eklem('defne', dp, 'head'); dk.L = [[hd[0] - 104, hd[1] + 50], w, 'B']; } }
    if (id === 'cta') { const w = W(t, tm.cta + 0.1, 0.35); if (w) { const hd = H.eklem('defne', dp, 'head'); dk.R = [[hd[0] + 112, hd[1] + 6], w, 'B']; } }
    const da = oyna(K, t, tl, 'defne', dp, { heads: B.heads, ...dk });
    if (isaretU > 0.5) da.isaret('L', [770, 985]);
    if (id === 'sayac2' && t > tm.s2 + 0.3 && t < tm.bak - 0.1) da.parmak('L', clamp01((t - tm.s2 - 0.3) / 0.5) + Math.min(4, Math.max(0, (t - tm.s2 - 0.9) / 0.6)), { toplam: 5 });
    if (id === 'cta' && t > tm.cta + 0.3) da.parmak('R', 1, { toplam: 1 });
    // ——— Necmi ———
    const np = necmiPoz(S, t, id);
    const nk = {}; let elde = null;
    if (id === 'ipucu') {
      const tb = [675, 1182], dinlen = [800, 1200], yuk = [815, 1080], A = [tm.ikiser1, tm.ikiser2 + 0.12];
      nk.L = [[tb[0] - 2 * TW - 4, tb[1] - 46], 1, 'A'];
      let e = dinlen, cift = null;
      A.forEach((a, j) => {
        if (t < a - 0.25) return;
        const ust = [tb[0] - 2 * TW + (3 - j) * TW + TW / 2, tb[1] - TH - 8];
        if (t < a) { e = kar(dinlen, ust, W(t, a - 0.25, 0.25)); cift = null; }
        else if (t < a + 0.3) { e = kar(ust, yuk, ease.state(seg(t, a, 0.3))); cift = { p: e, k: 1 }; }
        else { e = kar(yuk, dinlen, W(t, a + 0.5, 0.3)); const k = 1 - ease.exit(seg(t, a + 0.28, 0.14)); cift = k > 0.02 ? { p: yuk, k } : null; }
      });
      nk.R = [e, 1, 'A'];
      const satir = 4 - (t >= A[0] ? 1 : 0) - (t >= A[1] ? 1 : 0);
      elde = { tb, satir, cift };
    } else if (kd.el) {
      nk[kd.yan] = [kd.el, 1, 'A'];
      const diger = kd.yan === 'L' ? 'R' : 'L'; nk[diger] = [[690 + (diger === 'L' ? -70 : 70), 1215], 1, 'A'];   // öbür el kutunun kenarında
    } else if (t < 2.6) {   // kare 0: kapağı gösterir
      const u = 1 - W(t, 2.1, 0.35), tap = 22 * H.nabiz(t, tm.tap, 0.28);
      nk.L = [[548, 948 - tap], u, 'B'];
    } else if (id === 'cevap' || id === 'espri' || id === 'cta') {
      nk.L = [[620, 1212], 1, 'A']; nk.R = [[760, 1212], 1, 'A'];
    }
    const na = oyna(K, t, tl, 'necmi', np, { heads: B.heads, ...nk });
    if (t < 2.6 && !kd.el) na.isaret('L', [575, KAPAK.y + KAPAK.h - 30]);
    // ——— tezgâh (karakterlerin önü), tabak, kutu, eldekiler ———
    M.mekanCiz(K, OCAK, 'on', t);
    tabak(K, tabakYer, kd.tabakN, tabakRot);
    if (tabakRot > 0.05) ha.tut('R');
    const liste = kd.parcalar.slice();
    for (const u of kd.ucan) if (u.tabakta) parca(K, u.x, u.y, u.k, 'L');
    kutu(K, liste);
    for (const u of kd.ucan) if (!u.tabakta) parca(K, u.x, u.y, u.k, u.tur);
    // son parça halkası
    if (kd.bitti) {
      const [x, y] = yuva(kd.sonYuva), a0 = t < tm.cd0 ? tm.son1 : tm.son2;
      if (t < tm.cd0 + 0.6 || t > tm.son2) { const { ctx } = K, u = W(t, a0 - 0.05, 0.25); ctx.save(); ctx.globalAlpha = u; ctx.beginPath(); ctx.ellipse(x, y - 20, 50, 34, 0, 0, TAU); ctx.lineWidth = 9; ctx.strokeStyle = YESIL; ctx.stroke(); ctx.restore(); }
    }
    for (const e of kd.elde) parca(K, e.x, e.y, e.k, e.tur, e.a ?? 1);
    if (kd.el) na.tut(kd.yan);
    if (elde) {
      tablet(K, elde.tb[0], elde.tb[1], elde.satir); na.tut('L');
      if (elde.cift && elde.cift.k > 0.02) ciftKare(K, elde.cift.p[0], elde.cift.p[1] + 4, elde.cift.k);
      na.tut('R');
    }
    B.kd = kd;
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id, kd = B.kd;
    if (id === 'cevap') sayac(K, t, B, kd, S);
    if (id === 'deneme') H.mark(K, t, tm.sans, tm.cd0 - 0.1, B.ekr([X.defne - 125, 905]), false);   // "şans" değil
  },
});

// Çikolata sayacı (kahraman an; ekran uzayı, kutunun ön yüzüne bağlı ve sabit): ikon + sayı; değişince kabarır, sonda yeşil
function sayac(K, t, B, kd, S) {
  const { tm } = S;
  const p = B.ekr([690, 1292]), n = kd.cik, { ctx } = K;
  const v = H.spring(Math.max(0, t - tm.cevap - 0.1), H.UI[0], H.UI[1]);
  // son değişim anı: kd.cik'in değiştiği adımın tR'si
  let pu = 0; const Z = S.z2;
  R2.adim.forEach((a, i) => { if (a.tip === 'CC') pu = Math.max(pu, H.nabiz(t, Z[i].tR, 0.34)); });
  const yesil = W(t, tm.son2 - 0.05, 0.25);
  ctx.save(); ctx.translate(p[0], p[1]); const s = (0.6 + 0.4 * v) * (1 + 0.16 * pu); ctx.scale(s, s); ctx.globalAlpha = clamp01(v * 1.6);
  K.rect(-120, -50, 240, 100, H.mixHex(PAL.paper, YESIL, yesil), LW, 22);
  parca(K, -58, 22, 1.05, 'C');
  K.text(String(n), 42, 26, 76, yesil > 0.5 ? PAL.paper : INK, 900);
  ctx.restore();
}

function necmiPoz(S, t, id) {
  const { tm } = S;
  const gozKapali = (t >= tm.goz && t < tm.son1 + 0.15) || (t >= S.z2[0].t0 - 0.2 && t < tm.son2 + 0.1);
  let expr = 'mutlu', look = [0, 0.55], tilt = 0;
  if (t < 2.6) { look = [-0.3, -0.7]; tilt = -4; }
  else if (t < tm.goz) { look = [0, 0.5]; }
  if (t >= tm.son1 && t < tm.cd0 + 0.6) { look = [0.4, 0.2]; tilt = 5; }
  if (id === 'sayac') look = [0, 0.6];
  if (id === 'ipucu') { expr = 'mutlu'; look = t > tm.mudur ? [-0.85, 0.1] : [-0.2, 0.35]; tilt = t > tm.mudur ? -5 : 3; }
  if (id === 'cevap' || id === 'espri' || id === 'cta') { look = [0, 0.55]; if (t > tm.son2) { look = [-0.6, 0.2]; tilt = -4; } }
  const p = H.kisi('necmi', { x: X.necmi, y: NECMI_Y, expr, ...POZ.dur, head: { tilt, look } });
  if (gozKapali) p.blink = 1;
  return p;
}

