// Bölüm 53 · SON VAPUR 1: UYKUCU YOLCU (v4 "hikâye" dili; storyboard: hikayeler/bolum_053_v5.md). Mekanizma: ortalama ve süre.
// Biçim "önce cevap": kare 0'da "CEVAP: ÜÇ KEZ" kapağı, sonra hikâye, Kaptan Rıza'nın bahsi, 10 sn "NEDEN?" sayacı, Lâl'in açıklaması.
// Logline: Uykucu yolcu 07.20'de Karaköy'de vapura binip iki saatini ayarlar; Kadıköy'de inerken biri 08.21'i, öbürü 08.19'u
// gösterir. Kaptan Rıza bahse girer: vapur kaç kez karşıya geçti? Çaycı Bora iki bardağın ortasına bir bardak koyar; Simitçi Lâl
// ortalamayı (08.20) bulur: bir saat geçmiş, vapur üç kez karşıya geçmiştir.
// Akılda kalacak tek şey: biri ileri, biri geri giden iki saatin ortası gerçek saattir.
//
// ┌─ SON VAPUR SERİ ÇEKİRDEĞİ (054 ve 055 bunu yeniden kullanır; kimlik ve palet kilitli) ──────────────────────────────────┐
// │ · Kadro kartları: b053_riza (Kaptan Rıza), b053_lal (Simitçi Lâl), b053_bora (Çaycı Bora), b053_yolcu (uykucu yolcu)   │
// │ · Kadro çizimi: svKisi / svOyna (dudak ve balon kuyruğu hikmet/defne sesine eşlenir), rizaUst, lalUst, lalTepsi,        │
// │   boraTepsi, yolcuCiz, kolSaati                                                                                       │
// │ · Vapur mekânı: SV (palet), svManzara (gök, uzak siluet, iskeleler, deniz döngüsü, yalpa), svGuverte (korkuluk, bank,  │
// │   fener, güverte), mekân kaydı 'b053_guverte'                                                                         │
// │ · Kapak ve kart: svKart ("CEVAP: …" kapağı → bilmece kartı, rozet + "SON VAPUR" etiketi), svSayac ("NEDEN?")           │
// │ Bu bölümün sahne mantığı (build, draw, durum) çekirdeğin altındadır.                                                  │
// └───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════════════════════ SERİ ÇEKİRDEĞİ ═══════════════════════════════════════════
// ——— palet (dondurulmuş): gece koyu petrol, fener kehribar; lacivert ve mor yok ———
export const SV = {
  gok: '#14292B', gokSafak: '#2C4A47', ufukSafak: '#B98457', ufukSafak2: '#7E6A4C', yildiz: '#EDE6D0',
  deniz: '#1B3B3D', denizSafak: '#2D5250', dalga: '#2F5A5A', dalgaSafak: '#4A7470',
  uzak: '#0F2224', uzakSafak: '#2A3E3C', iskele: '#22393A', iskeleKoyu: '#152A2B', cati: '#3B2F28',
  pencere: '#E8A640', fener: '#E8A640', fenerAcik: '#F4CF7A', isik: '#E8A640',
  levha: '#F1E6CC', levhaYazi: '#1F2421',
  kupeste: '#A8743F', kupesteUst: '#C48C52', direk: '#C9C6B6', borda: '#8E9486', bordaKoyu: '#757B6E',
  guverte: '#6B573A', guverteCizgi: '#57472F', bank: '#A8743F', bankKoyu: '#86592E', demir: '#3A4442',
  can: '#D9603F', canBeyaz: '#F1EDE2', petrol: '#24504E',
};
const mix = H.mixHex;

// ——— kadro kartları (DONDURULMUŞ: oran, palet, çizgi, siluet; baş = 1 birim, çizgi 0,05) ———
// Kaptan Rıza: 60'larında, iddiacı. Koyu petrol kaptan ceketi (pirinç düğmeler, çift sıra), beyaz kaptan şapkası, kır sakal,
//   kır yan saç. Siluet: geniş omuz + şapka siperi + sakal. Ses: Ahmet (hikmet), yavaş ve pes (−6 %, −12 Hz).
// Simitçi Lâl: 19 yaşında, çözen o. Siyah iki örgü saç, kırmızı-hardal atkı, deve tüyü ceket, boynundan askılı simit tablası.
//   Siluet: iki örgü + önde tabla. Ses: Emel (defne), biraz hızlı (+16 %, +3 Hz).
// Çaycı Bora: 12 yaşında çırak, konuşmaz. Siyah yelek, beyaz gömlek, dağınık saç, askılı çay tepsisi. Siluet: kısa boy + tepsi.
// Uykucu yolcu: paltolu, fötr şapkalı, kalın bıyıklı; iki kolunda iri kol saati. Hep uyur. Siluet: fötr + iki saat.
const KARTLAR = {
  b053_riza: {
    key: 'b053_riza', name: 'Kaptan Rıza', role: 'bahse giren kaptan', seed: 531,
    head: { w: 0.88, h: 1.04, ear: 0.12 }, neck: 0.08,
    torso: { len: 0.96, shoulder: 0.8, hip: 0.7, depth: 0.54, belly: 0.13, color: '#24504E', shade: '#1B3E3C' },
    arm: { upper: 0.44, lower: 0.42, w: 0.2, color: '#24504E', shade: '#1B3E3C', hand: 0.13 },
    leg: { upper: 0.42, lower: 0.4, w: 0.21, color: '#2B3230', shade: '#222826' },
    shoe: { color: '#1C1A18', len: 0.33, h: 0.11 },
    skin: '#D9A27A', skinShade: '#BF875F', hair: '#C9C4BC',
    eyes: { gap: 0.32, w: 0.17, h: 0.2, y: 0.04, lid: 0.22 }, line: 0.05, idle: { blink: [3, 6] },
    features: ['suit', 'baldSides'],
    sakal: '#CFCAC1', sakalKoyu: '#AFA99F', sapka: '#F2EEE4', sapkaBant: '#1F2421', rozet: '#D19A2E', dugme: '#D9B04A',
  },
  b053_lal: {
    key: 'b053_lal', name: 'Simitçi Lâl', role: 'çözen simitçi', seed: 532,
    head: { w: 0.9, h: 1, ear: 0.11 }, neck: 0.07,
    torso: { len: 0.78, shoulder: 0.6, hip: 0.58, depth: 0.4, belly: 0, color: '#C9A977', shade: '#AD8F60' },
    arm: { upper: 0.38, lower: 0.36, w: 0.16, color: '#C9A977', shade: '#AD8F60', hand: 0.12 },
    leg: { upper: 0.4, lower: 0.38, w: 0.18, color: '#3B3129', shade: '#2E2620' },
    shoe: { color: '#5A3A24', len: 0.28, h: 0.11 },
    skin: '#E3B48C', skinShade: '#C99A72', hair: '#2A1D17', scarf: '#B8362A', scarfDot: '#E2AE3C', top: '#F3E9D6',
    eyes: { gap: 0.34, w: 0.21, h: 0.26, y: 0.03 }, line: 0.05, idle: { blink: [2.4, 5.2] },
    features: ['blazer', 'hairSlick', 'scarf', 'lashes'],
    orguBag: '#E2AE3C', tabla: '#B07A45', tablaKoyu: '#8A5C31', simit: '#C98A3A', simitKoyu: '#9E6427', susam: '#F1E2B8',
  },
  b053_bora: {
    key: 'b053_bora', name: 'Çaycı Bora', role: 'sessiz çırak', seed: 533,
    head: { w: 0.86, h: 1.0, ear: 0.13 }, neck: 0.06,
    torso: { len: 0.66, shoulder: 0.54, hip: 0.48, depth: 0.36, belly: 0, color: '#2F3532', shade: '#262B29' },
    arm: { upper: 0.32, lower: 0.3, w: 0.15, color: '#F1EDE2', shade: '#D6D0C2', hand: 0.11 },
    leg: { upper: 0.33, lower: 0.31, w: 0.16, color: '#3A3F3C', shade: '#2E3230' },
    shoe: { color: '#2A1E17', len: 0.26, h: 0.1 },
    skin: '#D9A27A', skinShade: '#BF875F', hair: '#1E1915',
    eyes: { gap: 0.34, w: 0.2, h: 0.25, y: 0.05 }, line: 0.05, idle: { blink: [2.2, 4.8] },
    features: ['vest', 'hairMessy'],
    tepsi: '#C9C3B6', tepsiKoyu: '#9FA096',
  },
  b053_yolcu: {
    key: 'b053_yolcu', name: 'Uykucu yolcu', role: 'hep uyuyan yolcu', seed: 534,
    head: { w: 0.94, h: 0.98, ear: 0.12 }, neck: 0.05,
    torso: { len: 0.9, shoulder: 0.74, hip: 0.7, depth: 0.5, belly: 0.12, color: '#6B5E4F', shade: '#574C40' },
    arm: { upper: 0.42, lower: 0.4, w: 0.21, color: '#6B5E4F', shade: '#574C40', hand: 0.13 },
    leg: { upper: 0.42, lower: 0.4, w: 0.21, color: '#3F4442', shade: '#323634' },
    shoe: { color: '#2A1E17', len: 0.32, h: 0.11 },
    skin: '#E0AE88', skinShade: '#C5926C', hair: '#5A4C40',
    eyes: { gap: 0.34, w: 0.17, h: 0.2, y: 0.04, lid: 0.35 }, line: 0.05, idle: { blink: [3, 6] },
    features: ['baldSides', 'mustacheThick'],
    fotr: '#3B3530', fotrBant: '#8E2A2E', yaka: '#574C40', gomlek: '#E9E2D2',
    saatL: '#D19A2E', saatR: '#9AA39C', kayis: '#5A3A24',
  },
};
for (const [k, v] of Object.entries(KARTLAR)) if (!H.CARDS[k]) H.CARDS[k] = v;
// Boy (1 birimin pikseli, tam boy plan): Rıza Hikmet'le, Lâl Defne'yle aynı ölçekte; Bora çocuk, yolcu oturur
export const BOYU = { b053_riza: 250, b053_lal: 240, b053_bora: 200, b053_yolcu: 235 };
// Ses eşlemesi: voice_tts.py yalnız engine/voices.json'daki adları tanır. Rıza = hikmet (Ahmet, satırda −6 % / −12 Hz),
// Lâl = defne (Emel, satırda +16 % / +3 Hz). Dudak ve balon kuyruğu bu adlardan okunur.
export const SES = { b053_riza: 'hikmet', b053_lal: 'defne' };
export const svKisi = (key, o = {}) => H.kisi(key, { s: BOYU[key], ...o });
// oyna() sarmalayıcı: dudak SES adından, balon kuyruğu için baş heads[SES adı]'na yazılır
export function svOyna(K, t, tl, key, p, o = {}) {
  if (tl && SES[key] && !o.sessiz) p.talk = H.talkAt(tl, SES[key], t);
  const r = H.oyna(K, t, null, key, p, { ...o, heads: null });
  if (o.heads) o.heads[SES[key] || key] = r.head;
  return r;
}
// Başın yerel çerçevesi (önden): merkez, ölçek, eğim; fn(ctx) baş birimiyle çizer
function basta(K, key, p, fn, { nod = false } = {}) {
  const c = H.eklem(key, p, 'head'), { ctx } = K, f = p.view === 'side' ? (p.facing || 1) : 1;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate((p.head.tilt || 0) * D2R); ctx.scale(p.s * f, p.s);
  if (nod) ctx.translate(0, (p.head.nod || 0) * 0.055);
  fn(ctx, H.CARDS[key]); ctx.restore();
}
const yol = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
const dolu = (ctx, renk, lw = 0.05) => { ctx.fillStyle = renk; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); } };

// Kaptan Rıza'nın üstü: pirinç düğmeler (gövde), kır sakal + bıyık (yüz), kaptan şapkası (baş). drawChar'dan SONRA çağrılır.
export function rizaUst(K, p) {
  const key = 'b053_riza', c = H.CARDS[key], { ctx } = K;
  if (p.view !== 'side') {
    const n = H.eklem(key, p, 'neck'), pl = H.eklem(key, p, 'pelvis');
    for (let i = 0; i < 3; i++) for (const sx of [-1, 1]) {
      const u = 0.36 + i * 0.2, x = lerp(n[0], pl[0], u) + sx * 0.13 * p.s, y = lerp(n[1], pl[1], u);
      K.circ(x, y, 0.035 * p.s, c.dugme, LW * 0.45);
    }
  }
  basta(K, key, p, (ctx, c) => {
    // sakal: kulaktan kulağa çene çevresi; ağzın çevresi açık (dudak okunur)
    ctx.save(); ctx.translate(0, (p.head.nod || 0) * 0.055);
    yol(ctx, [[-0.43, -0.02], [-0.46, 0.26], [-0.34, 0.52], [-0.14, 0.66], [0, 0.69], [0.14, 0.66], [0.34, 0.52], [0.46, 0.26], [0.43, -0.02],
      [0.36, 0.06], [0.31, 0.32], [0.2, 0.46], [0, 0.53], [-0.2, 0.46], [-0.31, 0.32], [-0.36, 0.06]]);
    dolu(ctx, c.sakal, 0.035);
    ctx.beginPath(); for (const [x0, y0, x1, y1] of [[-0.3, 0.42, -0.24, 0.55], [0.3, 0.42, 0.24, 0.55], [-0.08, 0.6, -0.06, 0.65], [0.08, 0.6, 0.06, 0.65]]) { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }
    ctx.lineWidth = 0.02; ctx.strokeStyle = c.sakalKoyu; ctx.stroke();
    // bıyık
    ctx.beginPath(); ctx.moveTo(0, 0.2); ctx.bezierCurveTo(0.1, 0.17, 0.2, 0.2, 0.21, 0.3); ctx.quadraticCurveTo(0.1, 0.26, 0, 0.29);
    ctx.quadraticCurveTo(-0.1, 0.26, -0.21, 0.3); ctx.bezierCurveTo(-0.2, 0.2, -0.1, 0.17, 0, 0.2); dolu(ctx, c.sakal, 0.03);
    ctx.restore();
    // kaptan şapkası: beyaz tepe, siyah bant, siper, hardal arma
    ctx.beginPath(); ctx.moveTo(-0.47, -0.41); ctx.lineTo(-0.56, -0.64); ctx.quadraticCurveTo(0, -0.86, 0.56, -0.64); ctx.lineTo(0.47, -0.41); ctx.closePath(); dolu(ctx, c.sapka);
    ctx.beginPath(); ctx.ellipse(0, -0.64, 0.56, 0.1, 0, Math.PI, TAU); ctx.lineWidth = 0.025; ctx.strokeStyle = '#CFC9BC'; ctx.stroke();
    yol(ctx, [[-0.48, -0.53], [0.48, -0.53], [0.47, -0.41], [-0.47, -0.41]]); dolu(ctx, c.sapkaBant, 0.035);
    ctx.beginPath(); ctx.moveTo(-0.44, -0.43); ctx.quadraticCurveTo(0, -0.24, 0.44, -0.43); ctx.quadraticCurveTo(0, -0.36, -0.44, -0.43); ctx.closePath(); dolu(ctx, '#121614', 0.035);
    ctx.beginPath(); ctx.ellipse(0, -0.6, 0.075, 0.06, 0, 0, TAU); dolu(ctx, c.rozet, 0.025);
    ctx.beginPath(); ctx.moveTo(-0.08, -0.6); ctx.quadraticCurveTo(-0.17, -0.64, -0.22, -0.58); ctx.moveTo(0.08, -0.6); ctx.quadraticCurveTo(0.17, -0.64, 0.22, -0.58);
    ctx.lineWidth = 0.035; ctx.strokeStyle = c.rozet; ctx.stroke();
  });
}

// Simitçi Lâl'in iki örgüsü: kulak arkasından omuzların önüne iner, uçta hardal bağ. drawChar'dan SONRA.
export function lalUst(K, p) {
  basta(K, 'b053_lal', p, (ctx, c) => {
    const tilt = (p.head.tilt || 0) * D2R;
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.translate(sx * 0.44, 0.1); ctx.rotate(-tilt * 0.8);   // örgü yerçekimine yakın sarkar
      const N = 8;
      for (let i = 0; i < N; i++) {
        const u = i / (N - 1), x = sx * (0.07 * Math.sin(u * Math.PI) + 0.04 * u), y = 0.06 + u * 1.05, a = (i % 2 ? 0.45 : -0.45) * sx;
        ctx.beginPath(); ctx.ellipse(x, y, 0.105 - 0.02 * u, 0.085, a, 0, TAU); dolu(ctx, c.hair, 0.032);
      }
      const ex = sx * 0.04, ey = 1.17;
      ctx.beginPath(); ctx.roundRect(ex - 0.07, ey - 0.03, 0.14, 0.07, 0.02); dolu(ctx, c.orguBag, 0.03);
      ctx.beginPath(); ctx.moveTo(ex - 0.06, ey + 0.04); ctx.quadraticCurveTo(ex, ey + 0.2, ex + 0.06, ey + 0.04); ctx.closePath(); dolu(ctx, c.hair, 0.03);
      ctx.restore();
    }
  });
}
// Simit tablası: boyundan askılı, belin önünde. Dönen: tablanın üst yüzü { merkez, rx, ry } (dünya), simit almak için.
// eksik: tabladan alınmış simitlerin dizinleri (0–4)
export function lalTepsi(K, p, { eksik = [] } = {}) {
  const key = 'b053_lal', c = H.CARDS[key], s = p.s, pl = H.eklem(key, p, 'pelvis');
  const cx = pl[0], cy = pl[1] - 0.24 * s, rx = 0.44 * s, ry = 0.12 * s, { ctx } = K;
  const shL = H.shoulder(key, p, 'L'), shR = H.shoulder(key, p, 'R');
  K.line(shL[0] + 0.03 * s, shL[1] - 0.02 * s, cx - rx * 0.86, cy, 0.045 * s + LW, INK); K.line(shL[0] + 0.03 * s, shL[1] - 0.02 * s, cx - rx * 0.86, cy, 0.045 * s, c.tablaKoyu);
  K.line(shR[0] - 0.03 * s, shR[1] - 0.02 * s, cx + rx * 0.86, cy, 0.045 * s + LW, INK); K.line(shR[0] - 0.03 * s, shR[1] - 0.02 * s, cx + rx * 0.86, cy, 0.045 * s, c.tablaKoyu);
  K.ell(cx, cy + 0.06 * s, rx, ry, c.tablaKoyu, LW * 0.8);
  K.ell(cx, cy, rx, ry, c.tabla, LW * 0.8);
  SIMIT_YER.forEach(([dx, dy], i) => { if (!eksik.includes(i)) simit(K, cx + dx * s, cy + dy * s, s); });
  ctx.beginPath(); ctx.ellipse(cx, cy + 0.06 * s, rx, ry, 0, 0.05, Math.PI - 0.05); ctx.lineWidth = LW * 0.8; ctx.strokeStyle = INK; ctx.stroke();
  return { merkez: [cx, cy], rx, ry, yer: i => [cx + SIMIT_YER[i][0] * s, cy + SIMIT_YER[i][1] * s] };
}
const SIMIT_YER = [[-0.2, -0.05], [0.02, -0.07], [0.22, -0.05], [-0.1, 0.02], [0.12, 0.02]];
// Simit: (x, y) merkez, s ölçek (1 birim); yatık halka, susamlı
export function simit(K, x, y, s, k = 1) {
  const c = H.CARDS.b053_lal, { ctx } = K, rx = 0.13 * s * k, ry = 0.065 * s * k;
  K.ell(x, y, rx, ry, c.simit, LW * 0.6);
  K.ell(x, y - ry * 0.12, rx * 0.4, ry * 0.36, c.simitKoyu, LW * 0.45);
  ctx.fillStyle = c.susam;
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + 0.3, r = 0.72; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r, 0.012 * s * k, 0.007 * s * k, a, 0, TAU); ctx.fill(); }
}

// Çay bardağı (ince belli): (x, y) tabanın ortası, h boy (px)
export function bardak(K, x, y, h = 52) {
  const { ctx } = K, k = h / 52;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  K.ell(0, 1, 22, 6, '#E8E2D4', LW * 0.5);
  K.poly([[-15, -52], [15, -52], [9, -32], [14, -10], [11, -1], [-11, -1], [-14, -10], [-9, -32]], '#F3EEE4', 0);
  K.poly([[-13, -44], [13, -44], [7.5, -32], [12, -10], [9.5, -3], [-9.5, -3], [-12, -10], [-7.5, -32]], '#A8401F', 0);
  K.poly([[-15, -52], [15, -52], [9, -32], [14, -10], [11, -1], [-11, -1], [-14, -10], [-9, -32]], null, LW * 0.5);
  K.line(-8, -46, -5, -38, 2.4, '#FFFFFF');
  ctx.restore();
}
// Askılı çay tepsisi: el = halkanın tutulduğu nokta. bardaklar = [[dx, varMı]] (dx tepsi merkezine göre px). Dönen: tepsi yüzü
export function boraTepsi(K, el, bardaklar, { k = 1 } = {}) {
  const c = H.CARDS.b053_bora, { ctx } = K, cx = el[0], cy = el[1] + 118 * k, rx = 98 * k, ry = 22 * k;
  ctx.lineCap = 'round';
  for (const dx of [-0.92, 0.92]) { K.line(el[0], el[1], cx + dx * rx, cy - 4, 5 * k + LW, INK); K.line(el[0], el[1], cx + dx * rx, cy - 4, 5 * k, c.tepsiKoyu); }
  K.ell(cx, cy + 7 * k, rx, ry, c.tepsiKoyu, LW * 0.8);
  K.ell(cx, cy, rx, ry, c.tepsi, LW * 0.8);
  for (const [dx, var_] of bardaklar) if (var_) bardak(K, cx + dx * k, cy + 4 * k, 70 * k);
  K.circ(el[0], el[1], 9 * k, c.tepsiKoyu, LW * 0.6);
  return { merkez: [cx, cy], yuz: dx => [cx + dx * k, cy + 4 * k] };
}

// Kol saati: (x, y) merkez, r yarıçap (px), saat ondalık (8.35 = 08.21), yon = kayışın açısı (rad), cerceve rengi, t (saniye kolu)
export function kolSaati(K, [x, y], r, saat, { yon = 0, cerceve = PAL.mustard, kayis = '#5A3A24', t = 0 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y);
  ctx.save(); ctx.rotate(yon); K.rect(-r * 1.55, -r * 0.5, r * 3.1, r, kayis, LW * 0.6, r * 0.3); ctx.restore();
  K.circ(0, 0, r * 1.12, cerceve, LW * 0.8);
  K.circ(0, 0, r * 0.92, PAL.cream, LW * 0.5);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, q = i % 3 ? 0.8 : 0.68; K.line(Math.sin(a) * r * q, -Math.cos(a) * r * q, Math.sin(a) * r * 0.86, -Math.cos(a) * r * 0.86, i % 3 ? 2.5 : 4.5); }
  const am = (saat % 1) * TAU, ah = (saat % 12) / 12 * TAU, as = ((t % 60) / 60) * TAU * 6;
  K.line(0, 0, Math.sin(ah) * r * 0.48, -Math.cos(ah) * r * 0.48, Math.max(4, r * 0.13));
  K.line(0, 0, Math.sin(am) * r * 0.76, -Math.cos(am) * r * 0.76, Math.max(3, r * 0.09));
  K.line(0, 0, Math.sin(as) * r * 0.8, -Math.cos(as) * r * 0.8, 2, PAL.coral);
  K.circ(0, 0, Math.max(3, r * 0.08), INK, 0);
  ctx.restore();
}

// Uykucu yolcu (önden, bankta oturur). st = { x, oturak, zemin, uyku 0..1, kol: { kucak, bak, ayar } ağırlıkları, saatL, saatR,
// bas: { tilt, look }, expr, t }. Dönen: { p, saatL: [x, y], saatR: [x, y], head }. Saatler: ekranın solundaki (L) ileri gider.
export function yolcuCiz(K, st) {
  const key = 'b053_yolcu', c = H.CARDS[key], s = BOYU[key], { ctx } = K, t = st.t || 0, u = st.uyku || 0;
  const bas = st.bas || { tilt: 0, look: [0, 0.5] };
  const p = H.charBase(key, {
    view: 'front', x: st.x, y: 0, s, legL: { hip: 14, knee: 176 }, legR: { hip: 14, knee: 176 },
    head: { tilt: lerp(bas.tilt || 0, 14, u), look: [lerp(bas.look[0], 0.1, u), lerp(bas.look[1], 0.8, u)], nod: u }, expr: u > 0.5 ? 'yorgun' : (st.expr || 'notr'),
  });
  if (u > 0.02) p.blink = u;
  p.y = st.oturak - 0.02 * s - H.eklem(key, p, 'pelvis')[1];
  const nk = H.eklem(key, p, 'neck'), pl = H.eklem(key, p, 'pelvis');
  const k = st.kol || { kucak: 1 }, kw = (k.kucak || 0) + (k.bak || 0) + (k.ayar || 0) || 1;
  const hedef = side => {
    const sx = side === 'L' ? -1 : 1, yG = lerp(nk[1], pl[1], 0.36), yK = lerp(nk[1], pl[1], 0.8);
    const kucak = [st.x + sx * 0.12 * s, yK], bak = [st.x + sx * 0.3 * s, yG];
    const ayar = side === 'L' ? [st.x - 0.24 * s, yG + 0.04 * s] : [st.x - 0.06 * s, yG + 0.02 * s];
    return [(kucak[0] * (k.kucak || 0) + bak[0] * (k.bak || 0) + ayar[0] * (k.ayar || 0)) / kw, (kucak[1] * (k.kucak || 0) + bak[1] * (k.bak || 0) + ayar[1] * (k.ayar || 0)) / kw];
  };
  H.reach(key, p, 'L', hedef('L'), 1, 'B'); H.reach(key, p, 'R', hedef('R'), 1, 'B');
  // bacaklar (oturuş): dizden zemine baldırlar, ayakkabılar; sonra palto eteği dizleri örter
  const kneeY = st.oturak + 0.06 * s;
  for (const sx of [-1, 1]) {
    const kx = st.x + sx * 0.19 * s, fx = st.x + sx * 0.22 * s;
    K.line(kx, kneeY, fx, st.zemin - 0.06 * s, c.leg.w * s + LW * 2, INK); K.line(kx, kneeY, fx, st.zemin - 0.06 * s, c.leg.w * s, c.leg.color);
    K.ell(fx + sx * 0.03 * s, st.zemin - 0.03 * s, c.shoe.len * 0.38 * s, c.shoe.h * 0.55 * s, c.shoe.color, LW * 0.8);
  }
  K.poly([[pl[0] - 0.37 * s, pl[1] - 0.08 * s], [pl[0] + 0.37 * s, pl[1] - 0.08 * s], [st.x + 0.4 * s, kneeY + 0.04 * s], [st.x + 0.05 * s, kneeY + 0.1 * s], [st.x - 0.05 * s, kneeY + 0.1 * s], [st.x - 0.4 * s, kneeY + 0.04 * s]], c.torso.shade, LW);
  K.line(st.x, pl[1] - 0.02 * s, st.x, kneeY + 0.08 * s, LW * 0.7);
  // gövde, kollar, baş: kalçanın altı kırpılır (küçülmüş bacak kökleri görünmez)
  ctx.save(); ctx.beginPath(); ctx.rect(st.x - 3 * s, -5000, 6 * s, pl[1] + 0.02 * s + 5000); ctx.clip();
  const r = H.drawChar(ctx, key, p, t);
  ctx.restore();
  // palto yakası, gömlek
  const tb = nk[1] + 0.02 * s;
  K.poly([[nk[0] - 0.12 * s, tb], [nk[0], tb + 0.26 * s], [nk[0] + 0.12 * s, tb]], c.gomlek, LW * 0.7);
  for (const sx of [-1, 1]) K.poly([[nk[0] + sx * 0.12 * s, tb - 0.01 * s], [nk[0] + sx * 0.3 * s, tb + 0.08 * s], [nk[0] + sx * 0.16 * s, tb + 0.24 * s], [nk[0] + sx * 0.03 * s, tb + 0.3 * s]], c.yaka, LW * 0.7);
  for (let i = 0; i < 2; i++) K.circ(nk[0] + 0.06 * s, lerp(nk[1], pl[1], 0.5 + i * 0.22), 0.03 * s, '#2B2420', LW * 0.4);
  // saatler (kayış önkolun yönünde)
  const sk = H.CARDS[key], el = side => H.eklem(key, p, side === 'L' ? 'elL' : 'elR');
  const bilek = side => { const h = side === 'L' ? r.handL : r.handR, e = el(side); return [lerp(h[0], e[0], 0.3), lerp(h[1], e[1], 0.3), Math.atan2(h[1] - e[1], h[0] - e[0])]; };
  const bL = bilek('L'), bR = bilek('R'), rs = 0.17 * s;
  kolSaati(K, [bR[0], bR[1]], rs, st.saatR, { yon: bR[2], cerceve: sk.saatR, kayis: '#2F2A26', t });
  kolSaati(K, [bL[0], bL[1]], rs, st.saatL, { yon: bL[2], cerceve: sk.saatL, kayis: sk.kayis, t: t + 17 });
  if ((k.ayar || 0) > 0.5) H.grip(K, key, r.handR, s);
  // fötr şapka: uyurken öne düşer, kaşları örter
  basta(K, key, p, (ctx, c) => {
    ctx.translate(0, 0.08 * u); ctx.rotate(0.06 * u);
    ctx.beginPath(); ctx.ellipse(0, -0.4, 0.74, 0.13, 0, 0, TAU); dolu(ctx, c.fotr);
    ctx.beginPath(); ctx.moveTo(-0.44, -0.42); ctx.lineTo(-0.4, -0.78); ctx.quadraticCurveTo(-0.2, -0.88, 0, -0.78); ctx.quadraticCurveTo(0.2, -0.88, 0.4, -0.78); ctx.lineTo(0.44, -0.42);
    ctx.quadraticCurveTo(0, -0.36, -0.44, -0.42); ctx.closePath(); dolu(ctx, c.fotr);
    ctx.beginPath(); ctx.moveTo(-0.44, -0.46); ctx.quadraticCurveTo(0, -0.4, 0.44, -0.46); ctx.lineTo(0.43, -0.56); ctx.quadraticCurveTo(0, -0.5, -0.43, -0.56); ctx.closePath(); dolu(ctx, c.fotrBant, 0.03);
    ctx.beginPath(); ctx.moveTo(-0.08, -0.82); ctx.quadraticCurveTo(0, -0.7, 0.08, -0.82); ctx.lineWidth = 0.03; ctx.strokeStyle = INK; ctx.stroke();
  });
  return { p, saatL: [bL[0], bL[1]], saatR: [bR[0], bR[1]], head: r.head, handL: r.handL, handR: r.handR };
}

// ——— vapur mekânı ———
// Dünya (güverte seti): ufuk y 990, iskele binalarının tabanı 1010, küpeşte 1120, borda 1250–1420, güverte 1420↓, ayakta duranlar 1500.
// d = { yer: 0 Karaköy … 1 Kadıköy (vapurun konumu), safak: 0 (07.20, gece) … 1 (08.20, ufukta şafak bandı) }
export const UFUK = 990, KUPESTE = 1120, BORDA = 1252, GUVERTE = 1420;
const ISK_ARA = 1250;              // iskele katmanında Karaköy ile Kadıköy arası (px): yer 0 → Karaköy x 300'de, yer 1 → Kadıköy x 300'de
// Yalpa: kamera vapura bağlıdır; dışarısı (gök, deniz, kıyı) ufuk çevresinde ±0,9° döner ve 6 px iner-kalkar. Tek sürekli döngü.
export const yalpa = t => ({ a: 0.9 * D2R * Math.sin(TAU * t / 5.6), dy: 6 * Math.sin(TAU * t / 5.6 + 1.1) });
export function svManzara(K, t, d, { x0 = -700, x1 = 1800 } = {}) {
  const { ctx } = K, w = x1 - x0, sf = clamp01(d.safak || 0), yer = d.yer || 0, y = yalpa(t);
  ctx.save(); ctx.translate(540, UFUK); ctx.rotate(y.a); ctx.translate(-540, -UFUK + y.dy);
  // gök: düz renk + ufukta iki basamaklı şafak bandı (parlama yok)
  ctx.fillStyle = mix(SV.gok, SV.gokSafak, sf); ctx.fillRect(x0, -900, w, UFUK + 900);
  if (sf > 0.01) { ctx.fillStyle = mix(SV.gokSafak, SV.ufukSafak2, sf * 0.85); ctx.fillRect(x0, UFUK - 150, w, 150); ctx.fillStyle = mix(SV.gokSafak, SV.ufukSafak, sf * 0.9); ctx.fillRect(x0, UFUK - 62, w, 62); }
  const rnd = H.mulberry32(5301);
  ctx.globalAlpha = 0.8 * (1 - sf); for (let i = 0; i < 26; i++) K.circ(x0 + rnd() * w, -200 + rnd() * 1000, 2 + rnd() * 2.5, SV.yildiz, 0); ctx.globalAlpha = 1;
  // martılar (döngü): iki siluet sağdan sola süzülür
  for (let i = 0; i < 2; i++) { const gx = x1 - ((t * (38 + 9 * i) + i * 700) % (w + 300)), gy = 640 + i * 90 + 10 * Math.sin(t * 1.1 + i * 2), k = 1 - i * 0.25; ctx.beginPath(); ctx.moveTo(gx - 22 * k, gy); ctx.quadraticCurveTo(gx - 10 * k, gy - 13 * k, gx, gy); ctx.quadraticCurveTo(gx + 10 * k, gy - 13 * k, gx + 22 * k, gy); ctx.lineWidth = 4.5; ctx.strokeStyle = SV.yildiz; ctx.stroke(); }
  // uzak kıyı (parallaks −yer × 520): Galata, Kız Kulesi, Haydarpaşa
  const ux = -yer * 520, uz = mix(SV.uzak, SV.uzakSafak, sf);
  ctx.save(); ctx.translate(ux, 0); uzakKiyi(K, uz, x0 - ux, x1 - ux); ctx.restore();
  // deniz
  ctx.fillStyle = mix(SV.deniz, SV.denizSafak, sf); ctx.fillRect(x0, UFUK, w, 900);
  const dl = mix(SV.dalga, SV.dalgaSafak, sf), kay = yer * ISK_ARA * 0.85 + t * 26;
  for (let row = 0; row < 7; row++) {
    const yy = UFUK + 14 + row * row * 9 + row * 10, sp = 120 + row * 40, L = 26 + row * 9, o = ((kay * (0.35 + row * 0.12) + row * 53) % sp + sp) % sp;
    for (let x = x0 - sp + o * -1 + sp; x < x1 + sp; x += sp) K.line(x, yy, x + L, yy, 3 + row * 0.6, dl);
  }
  // iskeleler (parallaks −yer × ISK_ARA)
  const ix = 640 - yer * ISK_ARA;
  iskele(K, t, ix, 'Karaköy', sf);
  iskele(K, t, ix + ISK_ARA, 'Kadıköy', sf);
  ctx.restore();
}
function uzakKiyi(K, renk, a, b) {
  const { ctx } = K, Y = UFUK + 2;
  ctx.fillStyle = renk; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  // Karaköy sırtı ve Galata Kulesi (x −200…700)
  ctx.beginPath(); ctx.moveTo(-500, Y); ctx.lineTo(-500, Y - 70); ctx.quadraticCurveTo(-150, Y - 150, 140, Y - 120); ctx.lineTo(160, Y - 120); ctx.lineTo(160, Y - 250); ctx.lineTo(150, Y - 250); ctx.lineTo(178, Y - 312); ctx.lineTo(206, Y - 250); ctx.lineTo(196, Y - 250); ctx.lineTo(196, Y - 118);
  ctx.quadraticCurveTo(420, Y - 110, 640, Y - 40); ctx.lineTo(760, Y); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Kız Kulesi (x ≈ 1080): adacık + kule
  const kx = 1080; ctx.beginPath(); ctx.moveTo(kx - 70, Y); ctx.quadraticCurveTo(kx, Y - 26, kx + 70, Y); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(kx - 16, Y - 18); ctx.lineTo(kx - 16, Y - 96); ctx.lineTo(kx - 22, Y - 96); ctx.lineTo(kx, Y - 140); ctx.lineTo(kx + 22, Y - 96); ctx.lineTo(kx + 16, Y - 96); ctx.lineTo(kx + 16, Y - 18); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Haydarpaşa (x ≈ 1500): uzun bina, iki konik kule
  const hx = 1500; ctx.beginPath(); ctx.moveTo(hx - 220, Y); ctx.lineTo(hx - 220, Y - 80); ctx.lineTo(hx - 150, Y - 80); ctx.lineTo(hx - 150, Y - 150); ctx.lineTo(hx - 166, Y - 150); ctx.lineTo(hx - 128, Y - 215); ctx.lineTo(hx - 90, Y - 150); ctx.lineTo(hx - 106, Y - 150);
  ctx.lineTo(hx - 106, Y - 96); ctx.lineTo(hx + 106, Y - 96); ctx.lineTo(hx + 106, Y - 150); ctx.lineTo(hx + 90, Y - 150); ctx.lineTo(hx + 128, Y - 215); ctx.lineTo(hx + 166, Y - 150); ctx.lineTo(hx + 150, Y - 150); ctx.lineTo(hx + 150, Y - 80); ctx.lineTo(hx + 220, Y - 80); ctx.lineTo(hx + 220, Y);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx + 220, Y); ctx.quadraticCurveTo(hx + 500, Y - 90, 2400, Y - 60); ctx.lineTo(2400, Y); ctx.closePath(); ctx.fill(); ctx.stroke();
}
// İskele binası: (x) merkez; Karaköy alçak, kemerli; Kadıköy saat kuleli. Levha ≥ 44 px (yakın planda ~70 px)
function iskele(K, t, x, ad, sf) {
  if (x < -900 || x > 1980) return;
  const { ctx } = K, B = 1010, kad = ad === 'Kadıköy', duvar = mix(SV.iskele, '#3E5654', sf * 0.6), w = kad ? 520 : 560;
  // ayaklar ve suya düşen pencere ışıkları (döngü: titreşen yansıma)
  for (let i = 0; i < 9; i++) K.rect(x - w / 2 + 20 + i * (w - 40) / 8, B - 6, 14, 40, SV.iskeleKoyu, LW * 0.5);
  for (let i = 0; i < 4; i++) { const wx = x - w / 2 + 90 + i * (w - 180) / 3; for (let j = 0; j < 4; j++) { const yy = B + 40 + j * 22, o = 8 * Math.sin(t * 2.3 + i * 1.7 + j * 1.3); K.line(wx - 14 + o, yy, wx + 14 + o, yy, 5 - j * 0.8, mix(SV.pencere, SV.deniz, 0.35 + j * 0.15)); } }
  // gövde: iki katlı; levha çatının üstünde (y ≈ 670), geniş planda başların üstünde kalır
  K.rect(x - w / 2, B - 250, w, 250, duvar, LW);
  for (let i = 0; i < 4; i++) { const wx = x - w / 2 + 90 + i * (w - 180) / 3; ctx.beginPath(); ctx.moveTo(wx - 34, B - 8); ctx.lineTo(wx - 34, B - 80); ctx.arc(wx, B - 80, 34, Math.PI, 0); ctx.lineTo(wx + 34, B - 8); ctx.closePath(); K.fs(SV.pencere, LW * 0.6);
    K.rect(wx - 22, B - 210, 44, 60, mix(SV.pencere, duvar, 0.25), LW * 0.5, 4); }
  if (kad) {
    K.rect(x + w / 2 - 150, B - 470, 104, 230, duvar, LW); K.poly([[x + w / 2 - 164, B - 470], [x + w / 2 - 98, B - 530], [x + w / 2 - 32, B - 470]], SV.cati, LW);
    const kx = x + w / 2 - 98; K.circ(kx, B - 410, 34, PAL.cream, LW * 0.7); K.line(kx, B - 410, kx, B - 434, 5); K.line(kx, B - 410, kx + 16, B - 406, 5);
    K.poly([[x - w / 2 - 20, B - 250], [x - w / 2 + 50, B - 300], [x + w / 2 - 50, B - 300], [x + w / 2 + 20, B - 250]], SV.cati, LW);
  } else {
    K.rect(x - w / 2 - 24, B - 268, w + 48, 24, SV.cati, LW);
    for (const dx of [-120, 120]) K.rect(x + dx - 5, B - 300, 10, 40, SV.demir, LW * 0.5);
  }
  // levha
  const ly = kad ? B - 316 : B - 330, lx = kad ? x - 70 : x, yazi = K.up(ad);
  ctx.font = '900 56px Rubik'; const lw = ctx.measureText(yazi).width + 56;
  K.rect(lx - lw / 2, ly - 48, lw, 78, SV.levha, LW);
  K.text(yazi, lx, ly + 12, 56, SV.levhaYazi, 900);
}
// Güverte (vapura bağlı, yalpalamaz): fenerler, küpeşte, borda, can simidi, bank, güverte tahtası. katman 'arka'
export function svGuverte(K, t, { x0 = -500, x1 = 1600, bank = [300, 640], fenerler = [40, 1060] } = {}) {
  const { ctx } = K;
  // küpeşte ve direkler (arkasında deniz görünür)
  for (let x = Math.ceil(x0 / 150) * 150; x < x1; x += 150) K.rect(x - 7, KUPESTE, 14, BORDA - KUPESTE, SV.direk, LW * 0.6);
  K.line(x0, KUPESTE + 66, x1, KUPESTE + 66, 9 + LW, INK); K.line(x0, KUPESTE + 66, x1, KUPESTE + 66, 9, SV.direk);
  K.rect(x0, KUPESTE - 16, x1 - x0, 26, SV.kupesteUst, LW);
  // borda (düz boyalı sac, perçin sırası)
  K.rect(x0, BORDA, x1 - x0, GUVERTE - BORDA, SV.borda, LW);
  K.rect(x0, BORDA - 6, x1 - x0, 16, SV.kupeste, LW * 0.8);
  ctx.fillStyle = SV.bordaKoyu; for (let x = x0 + 20; x < x1; x += 46) { ctx.beginPath(); ctx.arc(x, BORDA + 30, 4, 0, TAU); ctx.fill(); }
  // can simidi (bordada)
  const cx = 880, cy = BORDA + 84;
  K.circ(cx, cy, 58, SV.can, LW); K.circ(cx, cy, 30, SV.borda, LW);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, 58, 0, TAU); ctx.arc(cx, cy, 30, 0, TAU, true); ctx.clip();
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 70, a - 0.28, a + 0.28); ctx.closePath(); ctx.fillStyle = SV.canBeyaz; ctx.fill(); }
  ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, 58, 0, TAU); ctx.moveTo(cx + 30, cy); ctx.arc(cx, cy, 30, 0, TAU); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  // güverte tahtası
  ctx.fillStyle = SV.guverte; ctx.fillRect(x0, GUVERTE, x1 - x0, 900);
  for (const dy of [40, 100, 180, 290, 430, 610]) K.line(x0, GUVERTE + dy, x1, GUVERTE + dy, 3, SV.guverteCizgi);
  K.line(x0, GUVERTE, x1, GUVERTE, LW);
  // fener direkleri ve fenerin düşürdüğü ışık (düz çokgen, kehribar)
  for (const fx of fenerler) {
    ctx.save(); ctx.globalAlpha = 0.16; K.poly([[fx - 40, 820], [fx + 40, 820], [fx + 230, GUVERTE + 200], [fx - 230, GUVERTE + 200]], SV.isik, 0); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.22; K.ell(fx, GUVERTE + 110, 250, 60, SV.isik, 0); ctx.restore();
    K.rect(fx - 8, 820, 16, GUVERTE - 820, SV.demir, LW * 0.6);
    K.poly([[fx - 34, 760], [fx + 34, 760], [fx + 26, 830], [fx - 26, 830]], SV.fener, LW * 0.8);
    K.rect(fx - 42, 744, 84, 20, SV.demir, LW * 0.7, 4); K.rect(fx - 30, 828, 60, 14, SV.demir, LW * 0.6, 3);
    K.line(fx, 770, fx, 822, 3, '#9C6A22');
  }
  // bank (sırt çıtaları, oturak, demir ayaklar)
  const [b0, b1] = bank;
  for (const yy of [1168, 1210]) K.rect(b0, yy, b1 - b0, 30, SV.bank, LW * 0.8, 6);
  for (const xx of [b0 + 20, b1 - 34]) { K.rect(xx, 1160, 14, GUVERTE + 30 - 1160, SV.demir, LW * 0.6); }
}
export function svBankOn(K, [b0, b1], oturak) {   // oturağın ön kenarı (yolcudan önce çizilir)
  K.rect(b0 - 10, oturak, b1 - b0 + 20, 26, SV.bank, LW * 0.8, 6);
  K.rect(b0 - 4, oturak + 26, b1 - b0 + 8, 12, SV.bankKoyu, LW * 0.6, 4);
}
M.mekanEkle('b053_guverte', {
  gen: [-500, 1600], dongu: ['deniz dalgaları', 'martılar', 'iskele ışıklarının yansıması', 'kol saatlerinin saniye kolu'],
  capa: { bank: [470, 1296] }, kadraj: { genis: [0.97, 540, 1006] },
  arka(K, t, { durum = { yer: 0, safak: 0 } } = {}) { svManzara(K, t, durum); svGuverte(K, t); },
});

// ——— kart: "CEVAP: …" kapağı → bilmece kartı; rozet (BİLMECE #sira) + "SON VAPUR" etiketi ———
// kapak = "ÜÇ KEZ" gibi; donus: kapaktan bilmece kartına geçiş anı (0,36 sn, ease.state); son: kartın kalktığı an
export function svKart(K, t, ep, { kapak, donus, son, seri = 'SON VAPUR' }) {
  if (t >= son + 0.2) return 0;
  const { ctx } = K, x = 70, y = 300, w = 940, out = 1 - ease.exit(seg(t, son, 0.2));
  const f = seg(t, donus - 0.18, 0.36), bilmece = f >= 0.5, sy = bilmece ? ease.state((f - 0.5) * 2) : 1 - ease.state(f * 2);
  let size = 54; ctx.font = `800 ${size}px Rubik`;
  const widest = Math.max(...ep.card.map(s => ctx.measureText(s).width)); if (widest > 780) size = Math.floor(size * 780 / widest);
  const lh = size * 1.18, hB = ep.card.length * lh + 70, hA = 272, h = bilmece ? hB : hA;
  ctx.save(); ctx.globalAlpha = out; ctx.translate(540, y); ctx.scale(out, out); ctx.translate(-540, -y);
  ctx.save(); ctx.translate(0, y + h / 2); ctx.scale(1, Math.max(0.02, sy)); ctx.translate(0, -(y + h / 2));
  K.rect(x + 10, y + 12, w, h, INK, 0, 26); K.rect(x, y, w, h, PAL.paper, LW, 26);
  if (!bilmece) {
    K.text('CEVAP:', 540, y + 104, 62, INK, 900);
    K.text(K.up(kapak), 540, y + 236, 148, PAL.coral, 900);
  } else ep.card.forEach((s, i) => K.text(s, x + w / 2, y + 52 + size * 0.78 + i * lh, size, INK, 800));
  ctx.restore();
  // rozet + seri etiketi (dönerken de yerinde durur)
  const bw = 290; K.rect(x + 36, y - 32, bw, 62, PAL.mustard, LW, 31); K.text(K.up(`Bilmece #${ep.num}`), x + 36 + bw / 2, y + 12, 36, INK, 900);
  ctx.font = '900 36px Rubik'; const sw = ctx.measureText(seri).width + 56;
  K.rect(x + 36 + bw + 16, y - 32, sw, 62, SV.petrol, LW, 31); K.text(seri, x + 36 + bw + 16 + sw / 2, y + 12, 36, PAL.cream, 900);
  ctx.restore();
  return h;
}
// "NEDEN?" sayacı (b051 sayacının uyarlaması): kartın altında; paylaşım hapı altta. Sahne arkada oynamaya devam eder.
export function svSayac(K, t, t1, { share = null, dur = 10, yazi = 'NEDEN?', y = 640 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.3 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.25), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, r = 88;
  ctx.font = '900 64px Rubik'; const bw = ctx.measureText(yazi).width + 76, gap = 26, tot = bw + gap + 2 * r, x0 = 540 - tot / 2;
  ctx.save(); ctx.translate(540, y); ctx.scale(inU * out, inU * out); ctx.translate(-540, -y);
  K.rect(x0 + 8, y - 45 + 10, bw, 90, INK, 0, 45); K.rect(x0, y - 45, bw, 90, PAL.mustard, LW, 45);
  K.text(yazi, x0 + bw / 2, y + 22, 64, INK, 900);
  const cx = x0 + bw + gap + r;
  K.circ(cx + 10, y + 12, r, INK, 0); K.circ(cx, y, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(cx, y); ctx.arc(cx, y, r - 14, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(cx, y, r * 0.64, PAL.paper, LW * 0.8);
  ctx.save(); ctx.translate(cx, y); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 28, 78, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(540, 1382); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 64;
    K.rect(-sw / 2 + 8, -44 + 10, sw, 88, INK, 0, 44); K.rect(-sw / 2, -44, sw, 88, PAL.coral, LW, 44); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}
// Saat yazısı: ondalık saat → "08.21"
export const saatYaz = h => { const m = Math.round(h * 60), hh = Math.floor(m / 60) % 24, mm = ((m % 60) + 60) % 60; return `${String(hh).padStart(2, '0')}.${String(mm).padStart(2, '0')}`; };
// ═══════════════════════════════════════════ SERİ ÇEKİRDEĞİ SONU ═══════════════════════════════════════════

// ═══════════════════════════ Bu bölüm: ölçüler ═══════════════════════════
const RIZA_X = 170, YOLCU_X = 470, LAL_X = 720, BORA_X = 920;
const OTURAK = 1296, BANK_ZEMIN = 1440, BANK = [300, 640];
const BINIS = 7 + 20 / 60;                              // 07.20
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28, d2 = d) => W(t, a, d) * (1 - W(t, b, d2));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const GENIS = [0.97, 540, 1006];

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    yedi: T('h1:2'), ayarladi: T('h1:8'), h1s: T('h1>'),
    h2a: T('h2a'), ileri: T('h2a:4'), geri: T('h2a:9'),
    h2b: T('h2b'), yirmiBir: T('h2b:3'), onDokuz: T('h2b:7'),
    h3: T('h3'), yirmi: T('h3:1'), bahse: T('h3:4'), vapur: T('h3:6'),
    d2: T('d2'), karakoy: T('d2:2'), kadikoy: T('d2:3'), hd: T('hd'), saatler: T('hd:3'), yediKirk: T('hd:4'), hds: T('hd>'),
    yolcuD3: T('d3:1'), d4: T('d4'), ortasi: T('d4:2'), sekiz: T('d4:3'), tam: T('d4:6'),
    d5: T('d5'), gitti1: T('d5:1'), dondu: T('d5:2'), gitti2: T('d5:5'), uc: T('d5:6'), d5s: T('d5>'),
    h4: T('h4'), uyudu: T('h4:2'), dord: T('h4:3'), cta: T('d6') - 0.15,
  };
  tm.kesYakin = T('h2a') - 0.1;            // sahne 2: uyuyan yolcunun yakın planı (Karaköy, 07.20)
  tm.kesKad = T('h2b') - 0.1;              // sahne 3: aynı kadraj, Kadıköy (zaman sıçraması; kaç geçiş olduğu gösterilmez)
  tm.kesBahis = T('h3') - 0.1;             // sahne 4: geniş, bahis + yanlış deneme + itiraz
  tm.cevap = tm.yolcuD3 - 0.08;            // "Yolcu uyuyakalmış!": yolcuya kesme
  tm.sar0 = tm.tam - 0.05;                 // kahraman an: 0,4 sn geri sarma (08.20 → 07.20), sonra üç geçiş
  tm.var = [tm.gitti1 - 0.02, tm.dondu - 0.02, tm.gitti2 - 0.02];   // varışlar: Kadıköy, Karaköy, Kadıköy (kelimeye kilitli)
  tm.uyan = tm.var[2] + 0.12;
  tm.espri = tm.h4 - 0.12;
  // sayaç: yolcu saatine bakar, sallar; Lâl düşünür, parmakla sayar; Bora tepsiyi kaldırır, ortaya üçüncü bardağı koyar
  tm.lalDusun = [cd0 + 0.6, cd0 + 3.6];
  tm.lalSay = cd0 + 3.9;
  tm.boraKal = cd - 4.6; tm.koy = cd - 3.3; tm.koyBit = tm.koy + 0.75; tm.lalBak = cd - 2.6;
  tm.ver = tm.uyudu + 0.25;                // espri: Bora çayı Lâl'e verir (bahsin ödülü)

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 1.1, 500, 920], [tm.ayarladi - 0.2, 1.13, 494, 926]] },
    { id: 'yakin', t0: tm.kesYakin, cam: [[0, 1.42, 478, 1064], [tm.geri, 1.44, 474, 1062]] },
    { id: 'kadikoy', t0: tm.kesKad, cam: [[0, 1.36, 486, 1060], [tm.onDokuz, 1.4, 480, 1058]] },
    { id: 'bahis', t0: tm.kesBahis, cam: [[0, 1.0, 560, 1004], [tm.d2 - 0.2, 1.06, 620, 1000], [tm.saatler - 0.25, 1.3, 486, 1090]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 0.97, 540, 900], [cd0 + 3.2, 0.99, 548, 904], [tm.boraKal - 0.3, 1.3, 860, 1090]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, LAL_X, 1108]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.36, 520, 1062], [tm.tam - 0.15, 1.08, 470, 982], [tm.uc + 0.2, 1.12, 474, 980]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.02, 560, 1006], [tm.dord, 1.06, 600, 1004]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.34, LAL_X + 20, 1100], [tm.cta + 1.6, 1.38, LAL_X + 16, 1098]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— Rıza (önden) ———
  const rizBase = svKisi('b053_riza', { x: RIZA_X, expr: 'mutlu', head: { tilt: 4, look: [0.8, 0.3] }, ...POZ.dur });
  const riz = [
    [tm.h2a, { head: { tilt: 5, look: [0.85, 0.45] } }, 0.3],
    [tm.kesBahis, { expr: 'mutlu', head: { tilt: -3, look: [0.6, 0.1] } }, 0.01],
    [tm.bahse, { head: { tilt: 5, look: [0.95, 0.15] } }, 0.3],
    [tm.d2, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.2] } }, 0.3],
    [tm.hd, { expr: 'mutlu', head: { tilt: -2, look: [0.85, 0.5] } }, 0.3],
    [cd0, { expr: 'mutlu', ...POZ.belde, head: { tilt: 3, look: [0.6, 0.2] } }, 0.4],
    [tm.buldum - 0.05, { expr: 'saskin', armL: POZ.dur.armL, head: { tilt: -4, look: [0.9, 0.1] } }, 0.25],
    [tm.espri, { expr: 'saskin', head: { tilt: 3, look: [0.85, 0.4] } }, 0.01],
    [tm.uyudu, { expr: 'korku', ...POZ.teslim, head: { tilt: -6, look: [0.7, 0.3] } }, 0.35],
    [tm.dord + 0.2, { expr: 'yorgun', ...POZ.dur, head: { tilt: 6, look: [0.3, 0.1] } }, 0.4],
  ];
  // ——— Lâl (önden) ———
  const lalBase = svKisi('b053_lal', { x: LAL_X, expr: 'saskin', head: { tilt: -4, look: [-0.8, 0.4] }, ...POZ.dur });
  const lal = [
    [tm.yedi, { head: { tilt: -3, look: [-0.7, 0.55] } }, 0.3],
    [tm.kesBahis, { expr: 'notr', head: { tilt: -3, look: [-0.9, 0.15] } }, 0.01],
    [tm.d2 - 0.1, { expr: 'mutlu', head: { tilt: 4, look: [-0.4, 0.2] } }, 0.25],
    [tm.kadikoy, { head: { tilt: -3, look: [0.6, 0.1] } }, 0.3],
    [tm.hd, { expr: 'saskin', head: { tilt: -4, look: [-0.85, 0.35] } }, 0.3],
    [tm.yediKirk, { expr: 'yorgun', head: { tilt: 4, look: [-0.8, 0.5] } }, 0.3],
    [tm.lalDusun[0], { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: 6, look: [0.3, -0.5] } }, 0.4],
    [tm.lalDusun[1], { expr: IFADE.dusun2, armR: POZ.dur.armR, head: { tilt: -4, look: [-0.6, 0.5] } }, 0.35],
    [tm.lalBak, { expr: 'notr', head: { tilt: 5, look: [0.85, 0.45] } }, 0.3],
    [cd - 0.7, { expr: 'saskin', head: { tilt: -3, look: [0.6, 0.2] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.1, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: -4, look: [-0.8, 0.5] } }, 0.01],
    [tm.uc, { head: { tilt: 4, look: [-0.3, 0.1] } }, 0.3],
    [tm.espri, { expr: 'mutlu', head: { tilt: -3, look: [-0.8, 0.35] } }, 0.01],
    [tm.ver, { head: { tilt: 4, look: [0.8, 0.3] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: -5, look: [0.05, 0.05] } }, 0.01],
  ];
  // ——— Bora (önden, konuşmaz) ———
  const borBase = svKisi('b053_bora', { x: BORA_X, expr: 'notr', head: { tilt: -4, look: [-0.7, 0.3] }, ...POZ.dur });
  const bor = [
    [tm.bahse, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.1] } }, 0.3],
    [tm.d2, { expr: 'notr', head: { tilt: -3, look: [-0.6, 0.2] } }, 0.3],
    [cd0 + 1.5, { head: { tilt: -5, look: [-0.8, 0.4] } }, 0.35],
    [tm.boraKal, { expr: 'mutlu', head: { tilt: 3, look: [-0.3, 0.7] } }, 0.3],
    [tm.koyBit + 0.2, { head: { tilt: -4, look: [-0.9, 0.1] } }, 0.3],
    [tm.buldum, { expr: 'mutlu', head: { tilt: 5, look: [-0.9, 0.0] } }, 0.25],
    [tm.espri, { expr: 'notr', head: { tilt: -3, look: [-0.8, 0.3] } }, 0.01],
    [tm.ver - 0.2, { expr: 'mutlu', head: { tilt: 3, look: [-0.9, 0.3] } }, 0.3],
  ];
  return { tm, film, rizBase, riz, lalBase, lal, borBase, bor };
}

// ═══════════════════════════ Dünyanın durumu (tek kaynak: saat, vapurun yeri, şafak, yolcunun uykusu) ═══════════════════════════
function durum(S, t) {
  const { tm } = S;
  let yer = 0, gecen = 0;
  if (t >= tm.kesKad) { yer = 1; gecen = 1; }
  if (t >= tm.sar0 && t < tm.var[2] + 1e-3) {
    const r = ease.state(seg(t, tm.sar0, 0.4)), L = [[tm.sar0 + 0.4, tm.var[0]], [tm.var[0], tm.var[1]], [tm.var[1], tm.var[2]]];
    yer = 1 - r; gecen = 1 - r;
    L.forEach(([a, b], i) => { if (t >= a) { const u = ease.state(seg(t, a, b - a)); gecen = (i + u) / 3; yer = i % 2 ? 1 - u : u; } });
  }
  if (t >= tm.dord) yer = 1 - 0.32 * ease.state(seg(t, tm.dord, 4.5));      // dördüncü sefer: vapur Kadıköy'den ayrılır
  let saat = BINIS + gecen;
  if (t < 0.9) saat = BINIS - 0.4 * (1 - ease.state(seg(t, 0.3, 0.6)));      // kare 0: yolcu saatleri 07.20'ye ayarlar (ilk hareket 0,3 sn)
  return { yer, gecen, saat, safak: gecen, saatL: saat + gecen / 60, saatR: saat - gecen / 60 };
}
// Yolcunun uykusu ve kolları
function yolcuDurum(S, t, D) {
  const { tm } = S;
  let uyku = 0, kol = { ayar: 1 }, bas = { tilt: 3, look: [0, 0.75] }, expr = 'notr';
  if (t < tm.kesKad) {
    const ind = W(t, tm.ayarladi + 0.1, 0.45);
    kol = { ayar: 1 - ind, kucak: ind };
    uyku = W(t, tm.h1s - 0.1, 0.4);
  } else {
    // uyanık, saatlerine bakar (bak); kahraman anda geçmişte uyur; espride yeniden uyur
    const uyan = W(t, tm.kesKad + 0.15, 0.35), b = W(t, tm.kesKad + 0.35, 0.4);
    uyku = 1 - uyan; kol = { kucak: 1 - b, bak: b }; expr = 'saskin'; bas = { tilt: -3, look: [0, 0.8] };
    if (t >= tm.kesBahis) { kol = { bak: 1 }; uyku = 0; expr = 'notr'; bas = { tilt: -4, look: [0.2, 0.75] }; }
    if (t >= tm.cevap) {
      const g = W(t, tm.sar0, 0.3) * (1 - W(t, tm.uyan, 0.35));
      uyku = g; kol = { kucak: g, bak: 1 - g }; expr = 'notr';
    }
    if (t >= tm.espri) { const g = W(t, tm.uyudu - 0.25, 0.45); uyku = g; kol = { kucak: g, bak: 1 - g }; expr = 'saskin'; bas = { tilt: 5, look: [0.8, 0.2] }; }
  }
  return { x: YOLCU_X, oturak: OTURAK, zemin: BANK_ZEMIN, uyku, kol, bas, expr, saatL: D.saatL, saatR: D.saatR, t };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  kartSon: -1,
  split: { h3: 4, d4: 5 },
  kuyruksuz: (t, B) => B.sc.id === 'yakin' || B.sc.id === 'kadikoy' || B.sc.id === 'cevap',
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    svKart(K, t, ep, { kapak: ep.kapak || 'ÜÇ KEZ', donus: tm.vapur - 0.05, son: tm.proof });
    svSayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    etiketler(K, t, S, B);
  },
});

// Ekran etiketleri: saatlerin yanında (yolcunun saatleri, kesmeden sonraki 6 karede yeni etiket açılmaz)
function etiketler(K, t, S, B) {
  const { tm } = S, id = B.sc.id, Y = B.yolcu;
  if (!Y) return;
  const eL = B.ekr(Y.saatL), eR = B.ekr(Y.saatR), sol = [eL[0] - 150, eL[1] - 4], sag = [eR[0] + 150, eR[1] - 4];
  const tagS = (a, b, pos, s, f, c = PAL.paper, puls = []) => H.tag(K, t, a, b, pos, s, f, c, 50, puls);
  if (id === 'kanca') { tagS(tm.yedi - 0.04, tm.ayarladi + 0.4, sol, '07.20', PAL.mustard, INK); tagS(tm.yedi + 0.03, tm.ayarladi + 0.4, sag, '07.20', PAL.coral); }
  if (id === 'yakin') { tagS(tm.ileri - 0.04, tm.kesKad - 0.25, sol, '+1 DK', PAL.mustard, INK); tagS(tm.geri - 0.04, tm.kesKad - 0.25, sag, '−1 DK', PAL.coral); }
  if (id === 'kadikoy') { tagS(tm.yirmiBir - 0.04, tm.kesBahis + 1, sol, '08.21', PAL.mustard, INK); tagS(tm.onDokuz - 0.04, tm.kesBahis + 1, sag, '08.19', PAL.coral); }
  if (id === 'bahis') {
    // itiraz: "saatler" → 08.21 / 08.19, "yedi kırkı" → ikisi de 07.40 (mercan, olmaz), sonra sarsılıp geri döner
    const a = tm.saatler - 0.04, k0 = tm.yediKirk - 0.04, k1 = tm.hds + 0.25, b = tm.hds + 0.9;
    const kirk = t >= k0 && t < k1, sx = 14 * H.sars(t, k1, 0.4, 9);
    tagS(a, b, [sol[0] + sx, sol[1]], kirk ? '07.40' : '08.21', kirk ? PAL.coral : PAL.mustard, kirk ? PAL.paper : INK, [k0, k1]);
    tagS(a + 0.06, b, [sag[0] - sx, sag[1]], kirk ? '07.40' : '08.19', PAL.coral, PAL.paper, [k0, k1]);
    if (kirk) H.mark(K, t, k0 + 0.25, k1 - 0.1, [Math.min(900, sag[0] + 118), sag[1]], false);
  }
  if (id === 'cevap') {
    // d4: iki etiket ortaya kayıp tek "08.20"ye birleşir (Lâl'in parmağı ortayı gösterir); kahraman an: gerçek saat ve geçiş sayısı
    const m = W(t, tm.ortasi + 0.1, 0.5), birles = t >= tm.sekiz - 0.04, orta = [(sol[0] + sag[0]) / 2, Math.min(sol[1], sag[1]) - 70];
    if (!birles) {
      tagS(-1, tm.sekiz - 0.06, kar(sol, orta, m), '08.21', PAL.mustard, INK);
      tagS(-1, tm.sekiz - 0.06, kar(sag, orta, m), '08.19', PAL.coral);
    } else tagS(tm.sekiz - 0.04, tm.tam - 0.1, orta, '08.20', PAL.green, PAL.paper, [tm.sekiz + 0.3]);
    const D = B.durum;
    if (t >= tm.tam) {
      H.zamanHapi(K, t, tm.tam + 0.05, tm.d5s + 0.4, saatYaz(D.saat), { x: 270, y: 380, size: 56, saat: D.saat });
      const g = [[tm.var[0], '1. GEÇİŞ', PAL.mustard, INK], [tm.var[1], '2. GEÇİŞ', PAL.mustard, INK], [tm.var[2], '3. GEÇİŞ', PAL.green, PAL.paper]];
      H.adimEtiket(K, t, g, tm.d5s + 0.4, [270, 480], 56);
      H.mark(K, t, tm.uc - 0.02, tm.d5s + 0.4, [440, 480], true);
    }
  }
  if (id === 'espri') H.tag(K, t, tm.dord - 0.04, tm.cta - 0.2, [540, 470], '4. GEÇİŞ?', PAL.coral, PAL.paper, 56);
}

// ═══════════════════════════ sahne (dünya) ═══════════════════════════
function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads } = B, id = B.sc.id, D = durum(S, t);
  B.durum = D;
  svManzara(K, t, D);
  svGuverte(K, t, { bank: BANK });

  // ——— yolcu (bankta) ———
  svBankOn(K, BANK, OTURAK);
  const yd = yolcuDurum(S, t, D);
  if (id === 'sayac') {   // sayaçta saatini sallar: sol bileği kulağa yakın kaldırır, bırakır
    const w = pIn(t, cd0Of(S) + 1.0, cd0Of(S) + 2.6, 0.3);
    yd.kol = { bak: 1 - w * 0.5, ayar: w * 0.5 }; yd.bas = { tilt: -6 + 10 * w, look: [-0.4 * w, 0.7] }; yd.expr = w > 0.3 ? 'saskin' : 'notr';
  }
  B.yolcu = yolcuCiz(K, yd);
  if (id === 'cevap' && yd.uyku < 0.5) heads.b053_yolcu = B.yolcu.head;

  // ——— Rıza ———
  const rp = H.poseAt(H.CARDS.b053_riza, S.rizBase, S.riz, t), ro = { heads };
  if (id === 'kanca') { const w = pIn(t, 0.35, tm.h1s + 0.2, 0.3); if (w > 0.01) ro.R = [[RIZA_X + 150, 1150], w, 'A']; }
  if (id === 'bahis') {
    const w1 = pIn(t, tm.yirmi - 0.3, tm.bahse - 0.2, 0.28), w2 = pIn(t, tm.bahse - 0.15, tm.d2 - 0.2, 0.28), w3 = pIn(t, tm.saatler - 0.35, tm.hds + 0.6, 0.3);
    if (w1 > 0.01) ro.R = [H.elYeri('b053_riza', rp, 'R', 'yukari'), w1, 'B'];
    if (w2 > 0.01) ro.R = [[RIZA_X + 170, 1060], w2, 'B'];
    if (w3 > 0.01) ro.R = [[RIZA_X + 168, 1120], w3, 'A'];
  }
  if (id === 'sayac') H.glance(rp, t, tm.cd - 0.3, 9);
  const rc = svOyna(K, t, tl, 'b053_riza', rp, ro);
  rizaUst(K, rp);
  if (id === 'bahis') {
    if (pIn(t, tm.yirmi - 0.1, tm.bahse - 0.25, 0.2) > 0.5) rc.parmak('R', 2 * clamp01((t - tm.yirmi + 0.05) / 0.2), { toplam: 2, ac: 0.3 });
    if (pIn(t, tm.bahse, tm.d2 - 0.3, 0.2) > 0.5) rc.isaret('R', [BORA_X - 40, 1060]);
    if (pIn(t, tm.saatler - 0.1, tm.hds + 0.45, 0.2) > 0.5) rc.isaret('R', [B.yolcu.saatL[0] - 30, B.yolcu.saatL[1]]);
  }

  // ——— Bora (askılı tepsi sol elinde, göğüs hizasında; sağ eliyle ortaya üçüncü bardağı koyar; espride tepsiyi Lâl'e uzatır).
  //     Pozu burada hesaplanır, Lâl'den SONRA çizilir (tepsisi önde kalır). El yüzün dışında kalır.
  const bp = H.poseAt(H.CARDS.b053_bora, S.borBase, S.bor, t), bo = { sessiz: true };
  const bL = H.shoulder('b053_bora', bp, 'L'), bR = H.shoulder('b053_bora', bp, 'R');
  const GOGUS = [bL[0] - 70, bL[1] - 30];
  let tepsiEl = [bL[0] - 22, bL[1] + 104];                                    // kol aşağıda
  if (id === 'bahis') tepsiEl = kar(tepsiEl, [bL[0] - 72, bL[1] - 30], pIn(t, tm.bahse - 0.1, tm.d2 - 0.1, 0.35));
  if (id === 'sayac') tepsiEl = kar(tepsiEl, GOGUS, W(t, tm.boraKal, 0.4));
  if (id === 'cevap' || id === 'buldum') tepsiEl = GOGUS;
  if (id === 'espri' || id === 'cta') tepsiEl = kar(GOGUS, [bL[0] - 92, bL[1] - 36], W(t, tm.ver - 0.7, 0.4));
  bo.L = [tepsiEl, 1, 'B'];
  const tep = { merkez: [tepsiEl[0], tepsiEl[1] + 118] };
  let ucuncu = null, ortaVar = t >= tm.koyBit && id !== 'kanca' && id !== 'yakin' && id !== 'kadikoy' && id !== 'bahis', isaretW = 0;
  if (id === 'sayac' && t >= tm.boraKal - 0.2 && t < tm.koyBit) {
    const A = [bR[0] + 30, bR[1] + 112], Bm = [tep.merkez[0], tep.merkez[1] + 4];
    ucuncu = t < tm.koy ? A : H.tasi(t, tm.koy, 0.75, A, Bm, 60);
    bo.R = [[ucuncu[0] + 2, ucuncu[1] - 56], 1, 'A'];
  }
  if (id === 'sayac' && t >= tm.koyBit && t < tm.koyBit + 1.6) {
    isaretW = pIn(t, tm.koyBit, tm.koyBit + 1.3, 0.25);
    bo.R = [kar([bR[0] + 30, bR[1] + 110], [tep.merkez[0] + 34, tep.merkez[1] - 44], isaretW), isaretW, 'A'];
  }
  // ——— Lâl (tabla önünde; d2'de simidi "vapur" gibi Karaköy'den Kadıköy'e yüzdürür; sayaçta düşünür, sayar; cevapta ortayı gösterir) ———
  const lp = H.poseAt(H.CARDS.b053_lal, S.lalBase, S.lal, t); lp.y -= H.buldumHop(t, tm.buldum);
  const lo = { heads };
  let simitP = null, eksik = [];
  if (id === 'bahis') {
    const al = tm.d2 - 0.45, A = [LAL_X + 26, 1236], P0 = [LAL_X - 150, 1100], P1 = [LAL_X + 140, 1070];
    if (t >= al && t < tm.hds + 0.5) {
      const u1 = W(t, al, 0.35), sail = ease.state(seg(t, tm.karakoy - 0.05, tm.kadikoy + 0.3 - tm.karakoy));
      simitP = t < tm.karakoy - 0.05 ? kar(A, P0, u1) : kar(P0, P1, sail);
      simitP = [simitP[0], simitP[1] - 50 * Math.sin(Math.PI * sail) * (t >= tm.karakoy - 0.05 ? 1 : 0)];
      if (t >= tm.yediKirk) simitP = kar(P1, A, W(t, tm.yediKirk + 0.1, 0.5));
      eksik = [2];
      const wr = pIn(t, al - 0.28, tm.hds + 0.25, 0.28);
      lo.R = [[simitP[0] + 4, simitP[1] + 8], wr, 'B'];
      if (t > tm.yediKirk + 0.6) { simitP = null; eksik = []; }
    }
  }
  if (id === 'sayac') {
    const w = pIn(t, tm.lalSay - 0.2, tm.lalBak - 0.3, 0.3);
    if (w > 0.01) lo.L = [H.elYeri('b053_lal', lp, 'L', 'gogus'), w, 'B'];
  }
  if (id === 'cevap') {
    const w = pIn(t, tm.ortasi - 0.25, tm.tam - 0.05, 0.28);
    if (w > 0.01) lo.L = [[YOLCU_X + 90, 1110], w, 'B'];
    // kahraman an: Lâl'in sağ eli vapurun gidişini izler (gitti → sağa, döndü → sola)
    const wv = pIn(t, tm.d5 - 0.2, tm.uc + 0.1, 0.3);
    if (wv > 0.01) lo.R = [[lerp(LAL_X + 40, LAL_X + 150, B.durum.yer), 1060], wv, 'B'];
  }
  // espri: Lâl uzatılan tepsiden ortadaki çayı alır (bahsin ödülü); çağrıda çayı kaldırır
  let lalCay = null, uzan = 0;
  if ((id === 'espri' || id === 'cta') && t >= tm.ver - 0.4) {
    const G = [tep.merkez[0], tep.merkez[1] + 4], aldi = t >= tm.ver + 0.05;
    let base = aldi ? kar(G, [LAL_X + 92, 1176], W(t, tm.ver + 0.22, 0.5)) : G;
    if (id === 'cta') base = kar([LAL_X + 92, 1176], [LAL_X + 96, 1050], W(t, tm.cta + 0.3, 0.45));
    uzan = aldi ? 1 : W(t, tm.ver - 0.33, 0.3);
    lo.R = [[base[0] - 4, base[1] - 56], uzan, 'B'];
    if (aldi) lalCay = base;
  }
  const lc = svOyna(K, t, tl, 'b053_lal', lp, lo);
  const tabla = lalTepsi(K, lp, { eksik });
  lalUst(K, lp);
  if (lo.L && id === 'sayac') { const n = clamp01((t - tm.lalSay) / 0.35) + clamp01((t - tm.lalSay - 0.55) / 0.35) + clamp01((t - tm.lalSay - 1.1) / 0.35); lc.parmak('L', Math.max(0.01, n), { toplam: 3, ac: 0.32 }); }
  if (simitP) { simit(K, lc.handR[0] - 2, lc.handR[1] - 14, lp.s, 1.25); lc.tut('R'); }
  if (id === 'bahis' && simitP && t > tm.d2 && t < tm.kadikoy + 0.6) lc.parmak('R', 0.01);
  if (id === 'cevap' && lo.L && lo.L[1] > 0.5) lc.isaret('L', [YOLCU_X, B.yolcu.saatL[1] - 10]);
  // Bora (Lâl'in önünde): tepsi, üçüncü bardak, gösterme
  const bc = svOyna(K, t, null, 'b053_bora', bp, bo);
  boraTepsi(K, bc.handL, [[-56, true], [56, true], [0, ortaVar && !lalCay]]);
  bc.tut('L');
  if (ucuncu) { bardak(K, ucuncu[0], ucuncu[1], 70); bc.tut('R'); }
  if (isaretW > 0.5) bc.isaret('R', [tep.merkez[0] + 4, tep.merkez[1] - 30]);
  if (uzan > 0.5 && !lalCay) lc.tut('R');
  if (lalCay) { bardak(K, lc.handR[0], lc.handR[1] + 60, 70); lc.tut('R'); }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('b053_lal', lp, 'head'), { son: tm.proof, k: lp.s / 245 });
}
const cd0Of = S => S.tm.cd0;
