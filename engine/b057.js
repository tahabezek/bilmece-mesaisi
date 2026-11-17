// Bölüm 57 · HİKMET BİRİM DEĞİŞTİRDİ (v4 "hikâye" dili; storyboard: hikayeler/bolum_057_v5.md). Mekanizma: ortalama.
// Logline: Hikmet kolisini alıp muhasebeden bilgi işleme geçer; iki kapının üstündeki yaş ortalaması tabelaları da yükselir
// (49 → 50, 22 → 28). Kimse yaş almamış, kimse girip çıkmamıştır. Defne "Buldum!"dan sonra kolideki katlanır metreyi açar:
// ölçekte üç ok vardır, Hikmet'in oku ortadadır. Hikmet muhasebenin ortalamasından genç, bilgi işleminkinden yaşlıdır.
// Akılda kalacak tek şey: iki ortalamanın arasındaki biri, ayrıldığı yeri de vardığı yeri de yükseltir.
// Mekânlar: koridor (iki kapı, tabelalar), muhasebe odası, bilgi işlem odası (önden).
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki kelime çapalarından okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const TAU = Math.PI * 2, D2R = Math.PI / 180;

// ═══════════════════════════ Sayılar (build anında denetlenir) ═══════════════════════════
const MUH = [40, 50, 60], BIL = [20, 22, 24], HIK_YAS = 46;
const ort = a => a.reduce((s, v) => s + v, 0) / a.length;
const top = a => a.reduce((s, v) => s + v, 0);
function denetle() {
  const o = { muhOnce: ort([...MUH, HIK_YAS]), muhSonra: ort(MUH), bilOnce: ort(BIL), bilSonra: ort([...BIL, HIK_YAS]) };
  const hata = [];
  if (o.muhOnce !== 49) hata.push('muhasebe önce ' + o.muhOnce);
  if (o.muhSonra !== 50) hata.push('muhasebe sonra ' + o.muhSonra);
  if (o.bilOnce !== 22) hata.push('bilgi işlem önce ' + o.bilOnce);
  if (o.bilSonra !== 28) hata.push('bilgi işlem sonra ' + o.bilSonra);
  if (!(o.muhSonra > o.muhOnce && o.bilSonra > o.bilOnce)) hata.push('iki ortalama birden artmıyor');
  if (!(HIK_YAS < o.muhOnce && HIK_YAS > o.bilOnce)) hata.push('Hikmet iki ortalamanın arasında değil');
  if (hata.length) throw new Error('b057 ortalama: ' + hata.join(', '));
  return o;
}
const ORT = denetle();

// ═══════════════════════════ Figüran kartları (bölüme özgü, b057_ önekli) ═══════════════════════════
// Kadro kartlarına dokunulmaz; figüranlar kadro iskeletinden türetilir. Yaş görünür: 60 kır saçlı, 50 kırlaşmış, 20–24 genç.
const FIG_TANIM = [
  // [anahtar, iskelet, gövde, gölge, bacak, ten, ten gölgesi, saç, özellikler, kol gövde renginde mi, tohum]
  ['b057_y40', 'defne', '#4F7A73', '#3F625C', '#3E3A33', '#D9A27A', '#BF875F', '#2B1E18', ['blazer', 'bun', 'glassesRect', 'lashes'], true, 571],
  ['b057_y50', 'hikmet', '#5E6B73', '#4B565D', '#3B3F45', '#E8BC98', '#CFA07C', '#8A847D', ['suit', 'tie', 'hairSlick', 'mustacheThick'], true, 572],
  ['b057_y60', 'defne', '#8E3B46', '#74303A', '#4A3E33', '#E3AF86', '#C9946C', '#E4E0D8', ['cardigan', 'bun', 'glassesReading', 'earrings'], true, 573],
  ['b057_y20', 'genc', '#C9A24A', '#AA873B', '#2E4057', '#C08760', '#A46F4C', '#1E1915', ['hoodie', 'hairSpiky'], true, 574],
  ['b057_y22', 'defne', '#7C8B5A', '#667348', '#2F3338', '#EFC4A0', '#D7A882', '#3A2418', ['jacket', 'hairLong', 'earrings', 'lashes'], true, 575],
  ['b057_y24', 'genc', '#5D6A61', '#4B564F', '#2F3B33', '#D9A27A', '#BF875F', '#2A211C', ['jacket', 'hairSlick', 'glassesBold'], true, 576],
];
const BOYU = { ...H.BOY };
for (const [key, base, gov, gol, bac, ten, tenG, sac, ozl, kol, tohum] of FIG_TANIM) {
  const b = H.CARDS[base];
  if (!H.CARDS[key]) H.CARDS[key] = {
    ...b, key, name: 'Figüran', seed: tohum,
    torso: { ...b.torso, color: gov, shade: gol, belly: base === 'hikmet' ? 0.12 : b.torso.belly },
    arm: kol ? { ...b.arm, color: gov, shade: gol } : { ...b.arm },
    leg: { ...b.leg, color: bac, shade: bac }, skin: ten, skinShade: tenG, hair: sac, features: ozl,
  };
  BOYU[key] = H.BOY[base] - 6;
}

// ═══════════════════════════ Ölçüler ═══════════════════════════
const KS = 0.82, KS_I = 0.8;                                  // koridor ve oda içi kadro ölçeği
const sOf = (key, k = KS) => BOYU[key] * k;
const KOR = 'b057_koridor', ODA_M = 'b057_muh', ODA_B = 'b057_bil';
const MUH_X = 300, BIL_X = 780, KAPI_W = 210, KAPI_H = 640, KAPI_Y = 1500 - KAPI_H;
const TAB_W = 300, TAB_Y = 598, TAB_H = 236;
const RENK = { muh: PAL.coral, bil: PAL.teal };
const DEF_K = 150, DEF_X = 540, HIK_KAPI = 780, NEC_X = 330, HIK_M = 255, HIK_SON = 860;
const KOLI_Y = 1244;                                          // elde koli ön yüzünün ortası
const KOLI_YER = [912, 1446];                                 // yerdeki koli (koridor)
// Katlanır metre (yaş cetveli): 9 parça, boy 740; soldan sağa 60 → 20 (muhasebe solda, bilgi işlem sağda)
const R_L = 740, R_N = 9, R_SEG = R_L / R_N, R_H = 54, R_Y = 1290;
const sV = v => 30 + (60 - v) * 17;                           // yaşın metre üstündeki yeri (yay uzunluğu)
// Oda içi masalar
const TZ = 1290;
const MUH_MASA = [190, 400, 610, 820], BIL_MASA = [300, 490, 680, 870];
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// ═══════════════════════════ Nesneler ═══════════════════════════
// Tabela (kapının üstünde): ad, "YAŞ ORT.", büyük sayı. st = { val, eski, u (dönüş 0..1), ok (yeşil üçgen 0..1) }, nab: kabarma
function tabela(K, cx, ad, renk, st, nab = 0) {
  const { ctx } = K, x = cx - TAB_W / 2, y = TAB_Y;
  K.rect(x + 8, y + 10, TAB_W, TAB_H, INK, 0, 14);
  K.rect(x, y, TAB_W, TAB_H, PAL.cream, LW, 14);
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, TAB_W, 70, [14, 14, 0, 0]); ctx.fillStyle = renk; ctx.fill(); ctx.restore();
  K.line(x, y + 70, x + TAB_W, y + 70, LW, INK);
  K.rect(x, y, TAB_W, TAB_H, null, LW, 14);
  K.text(K.up(ad), cx, y + 52, 46, PAL.paper, 900);
  K.text('YAŞ ORT.', cx, y + 118, 46, INK, 900);
  const f = Math.abs(Math.cos(Math.PI * st.u)), v = st.u < 0.5 ? st.eski : st.val, k = 1 + 0.14 * nab;
  ctx.save(); ctx.translate(cx - 8, y + 186); ctx.scale(k, Math.max(0.04, f) * k);
  K.text(String(v), 0, 34, 100, renk, 900);
  ctx.restore();
  if (st.ok > 0.01) {   // yeşil yukarı üçgen: ortalama yükseldi
    ctx.save(); ctx.translate(cx + 92, y + 186); ctx.scale(st.ok, st.ok);
    K.poly([[0, -26], [22, 12], [-22, 12]], PAL.green, LW * 0.7); ctx.restore();
  }
}
function tabelaAt(ilk, olaylar, t) {
  let val = ilk, eski = ilk, ta = -1e9, anim = false;
  for (const [a, v, an] of olaylar) if (t >= a) { eski = val; val = v; ta = a; anim = an; }
  return { val, eski, u: anim ? clamp01((t - ta) / 0.32) : 1, ok: anim ? ease.enter(clamp01((t - ta - 0.22) / 0.25)) : 0, ta, anim };
}
// Masa plakası (yaş): (x, yb) tabanın ortası; k: 1 ayakta, 0 yatık (yüzü aşağı)
function plaka(K, x, yb, yas, k = 1) {
  const { ctx } = K, h = 62 * Math.max(0.06, Math.sin(Math.PI / 2 * k));
  ctx.save(); ctx.translate(x, yb);
  K.poly([[-54, 0], [54, 0], [48, -h], [-48, -h]], k > 0.12 ? '#FFFFFF' : '#D8D0C0', LW * 0.8);
  if (k > 0.12) { ctx.scale(1, h / 62); K.text(String(yas), 0, -14, 48, INK, 900); }
  ctx.restore();
}
// Hesap makinesi: (x, y) merkez; ekran yazısı; k ölçek; rot derece
function hesapMak(K, x, y, ekran, { k = 1, rot = 0 } = {}) {
  const { ctx } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R); ctx.scale(k, k);
  K.rect(-60 + 6, -85 + 8, 120, 170, INK, 0, 14);
  K.rect(-60, -85, 120, 170, '#3E4A48', LW * 0.8, 14);
  K.rect(-50, -74, 100, 60, '#C9D8B4', LW * 0.6, 6);
  ctx.save(); ctx.beginPath(); ctx.rect(-48, -72, 96, 56); ctx.clip();
  K.text(ekran, 44, -27, 46, '#1F2A22', 900, 'right'); ctx.restore();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) K.rect(-44 + c * 31, -2 + r * 21, 25, 15, r === 3 && c === 2 ? PAL.coral : '#D7CFC0', 2.5, 4);
  ctx.restore();
}
// Katlanır metre: merkez (cx, cy); u 0 katlı (zikzak), 1 açık. Dönen: pt(s, off) → dünya noktası (off: dik yönde, yukarı −)
function metreGeo(cx, cy, u) {
  const th = (1 - u) * 84 * D2R, c = Math.cos(th), s = Math.sin(th), x0 = cx - R_L * c / 2, y0 = cy - R_SEG * s / 2;
  const P = [[x0, y0]];
  for (let k = 0; k < R_N; k++) { const sg = k % 2 ? -1 : 1, q = P[k]; P.push([q[0] + R_SEG * c, q[1] + sg * R_SEG * s]); }
  const ang = k => Math.atan2(P[k + 1][1] - P[k][1], P[k + 1][0] - P[k][0]);
  const pt = (sa, off = 0) => {
    const k = Math.min(R_N - 1, Math.max(0, Math.floor(sa / R_SEG))), l = sa - k * R_SEG, a = ang(k);
    return [P[k][0] + Math.cos(a) * l - Math.sin(a) * off, P[k][1] + Math.sin(a) * l + Math.cos(a) * off];
  };
  return { P, ang, pt };
}
function metre(K, cx, cy, u) {
  const { ctx } = K, G = metreGeo(cx, cy, u);
  // önce zikzakta arkada kalan parçalar (tek), sonra öndekiler (çift)
  const sira = [...Array(R_N).keys()].sort((a, b) => (a % 2) - (b % 2));
  for (const k of sira) {
    const a = G.ang(k), s0 = k * R_SEG;
    ctx.save(); ctx.translate(G.P[k][0], G.P[k][1]); ctx.rotate(a);
    K.rect(-2, -R_H / 2, R_SEG + 4, R_H, k % 2 ? '#E2B04A' : '#EBC05A', LW * 0.7, 4);
    for (let v = 20; v <= 60; v += 2) {
      const l = sV(v) - s0; if (l < 2 || l > R_SEG - 2) continue;
      const maj = v % 10 === 0; K.line(l, -R_H / 2, l, -R_H / 2 + (maj ? 16 : 9), maj ? 3.5 : 2.5, INK);
    }
    for (let v = 20; v <= 60; v += 10) { const l = sV(v) - s0; if (l > 14 && l < R_SEG - 14) K.text(String(v), l, R_H / 2 - 7, 40, INK, 900); }
    ctx.restore();
  }
  for (let k = 1; k < R_N; k++) K.circ(G.P[k][0], G.P[k][1], 5, '#8C6A44', 2.5);
  return G;
}
// Koli (ön yüz önden): (x, y) ön yüzün ortası. plk: plaka 1 ayakta, 0 yatık; metreVar: katlı metre içinde; hesap: makine üstte
function koli(K, x, y, { plk = 1, metreVar = true, hesap = false } = {}) {
  const w = 150, h = 108, ust = y - h / 2;
  if (metreVar) { const { ctx } = K; ctx.save(); ctx.translate(x - 30, ust + 6); ctx.scale(0.62, 0.62); metre(K, 0, 0, 0); ctx.restore(); }
  if (hesap) hesapMak(K, x + 42, ust - 8, '0', { k: 0.5, rot: 10 });
  plaka(K, x + 14, ust + 10, HIK_YAS, plk);
  K.poly([[x - w / 2, ust], [x - w / 2 - 26, ust - 22], [x - 30, ust - 12], [x - 22, ust]], '#B88F57', LW * 0.7);
  K.poly([[x + w / 2, ust], [x + w / 2 + 26, ust - 22], [x + 30, ust - 12], [x + 22, ust]], '#B88F57', LW * 0.7);
  K.rect(x - w / 2, ust, w, h, '#C9A26B', LW, 4);
  K.line(x - w / 2 + 16, ust + 30, x + w / 2 - 16, ust + 30, 5, '#A88350');
  K.rect(x - 26, ust + 48, 52, 34, '#E9DCC2', 2.5, 3);          // etiket kâğıdı (yazısız)
}
// Necmi'nin fotoğrafları: (x, y) merkez. tur 'dede' (büyükler masası) | 'torun' (çocuklar masası)
function foto(K, x, y, tur, rot = 0) {
  const { ctx } = K, w = 150, h = 114;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * D2R);
  K.rect(-w / 2 + 5, -h / 2 + 7, w, h, INK, 0, 4);
  K.rect(-w / 2, -h / 2, w, h, '#FFFFFF', LW * 0.7, 4);
  K.rect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 30, tur === 'dede' ? '#E8C9A0' : '#CFE0D4', 0, 2);
  const bas = (bx, by, r, sac, ozel) => {
    K.circ(bx, by + r * 1.9, r * 1.25, ozel === 'necmi' ? '#7E8460' : tur === 'dede' ? '#8C6A44' : '#D9603F', 2.5);
    K.circ(bx, by, r, '#E3AF86', 2.5);
    if (ozel === 'necmi') { K.line(bx - r * 0.95, by - r * 0.1, bx - r * 0.7, by - r * 0.75, 4, '#A39C94'); K.line(bx + r * 0.95, by - r * 0.1, bx + r * 0.7, by - r * 0.75, 4, '#A39C94'); K.line(bx - r * 0.5, by + 1, bx + r * 0.5, by + 1, 2.5, INK); }
    else { ctx.beginPath(); ctx.arc(bx, by - 1, r, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = r * 0.5; ctx.strokeStyle = sac; ctx.stroke(); }
  };
  if (tur === 'dede') { bas(-38, -16, 14, '#F2EFE8'); bas(38, -16, 14, '#E4E0D8'); bas(0, -12, 13, null, 'necmi'); }
  else { bas(-44, -2, 10, '#3A2418'); bas(44, -2, 10, '#1E1915'); bas(-20, 2, 9, '#6B4A2E'); bas(10, -16, 14, null, 'necmi'); }
  K.rect(-w / 2 + 9, h / 2 - 34, w - 18, 12, PAL.woodTop, 2.5, 2);   // masa kenarı
  ctx.restore();
}
// Su sebili (koridor döngüsü: kabarcık)
function sebil(K, x, t) {
  K.rect(x - 46, 1180, 92, 320, '#E9E4DA', LW, 10);
  K.rect(x - 22, 1250, 44, 26, '#8FA093', 3, 4);
  K.rect(x - 40, 1010, 80, 176, '#BFD6DA', LW, 22);
  for (let i = 0; i < 3; i++) { const u = ((t * 0.7 + i / 3) % 1); K.circ(x - 10 + 14 * Math.sin(i * 2.1 + u * 3), 1170 - u * 140, 6 + 3 * u, '#E8F1F2', 2.5); }
}
// Masa (oda içi; karakterlerden sonra çizilir, bacakları örter)
function masa(K, x, w = 186) {
  K.rect(x - w / 2 + 8, TZ + 12, w - 16, 1500 - TZ, PAL.wood, LW, 6);
  K.rect(x - w / 2 + 24, TZ + 40, w - 48, 90, PAL.woodTop, LW * 0.6, 6);
  K.rect(x - w / 2, TZ - 6, w, 22, PAL.woodTop, LW, 6);
}
// Monitör (bilgi işlem döngüsü: kod satırları kayar, imleç yanıp söner)
function monitor(K, x, t, i) {
  K.rect(x - 8, TZ - 50, 16, 46, '#3B3F45', 3);
  K.rect(x - 58, TZ - 140, 116, 92, '#2F3338', LW * 0.8, 8);
  K.rect(x - 48, TZ - 131, 96, 72, '#1C3638', 0, 4);
  const off = Math.floor(t * 2 + i * 1.3);
  for (let r = 0; r < 4; r++) { const n = (r + off) % 5, w = 24 + ((n * 37 + i * 11) % 50); K.line(x - 40, TZ - 120 + r * 16, x - 40 + w, TZ - 120 + r * 16, 5, [PAL.mustard, PAL.green, '#9FC3C0', PAL.coral, '#9FC3C0'][n]); }
  if (Math.floor(t * 2.5 + i) % 2 === 0) K.rect(x + 22, TZ - 78, 10, 12, '#E8F1F2', 0);
}
function cay(K, x, yb, t) {
  K.ell(x, yb + 1, 22, 5, PAL.cream, 2.5);
  K.poly([[x - 14, yb - 32], [x + 14, yb - 32], [x + 9, yb - 18], [x + 12, yb - 5], [x + 10, yb], [x - 10, yb], [x - 12, yb - 5], [x - 9, yb - 18]], '#A8401F', 2.4);
  H.buhar(K, x, yb - 38, t, { k: 0.34, n: 2, ara: 9, boy: 50 });
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(KOR, {
  gen: [-300, 1400], dongu: ['su sebilinde kabarcık', 'duvar saatinin saniye kolu'],
  capa: { muhKapi: [MUH_X, 1500], bilKapi: [BIL_X, 1500] }, kadraj: { genis: [0.97, 540, 1000] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -400, x1: 1500, isik, duvar: 'duz', zemin: 'karo' });
    K.rect(-400, 1060, 1900, 14, '#24494C', 0);                  // duvar şeridi
    M.kapi(K, MUH_X - KAPI_W / 2, KAPI_Y, KAPI_W, KAPI_H, { acik: durum.muhAcik, yon: 1, ic: '#3E3A35', isik });
    M.kapi(K, BIL_X - KAPI_W / 2, KAPI_Y, KAPI_W, KAPI_H, { acik: durum.bilAcik, yon: -1, ic: '#1C3638', isik });
    tabela(K, MUH_X, 'Muhasebe', RENK.muh, durum.muh, durum.nabM);
    tabela(K, BIL_X, 'Bilgi İşlem', RENK.bil, durum.bil, durum.nabB);
    sebil(K, 40, t);
    M.duvarSaati(K, 1010, 720, 52, 10.3 + t / 60, t);
  },
});
M.mekanEkle(ODA_M, {
  gen: [-300, 1400], dongu: ['duvar saati', 'çay buharı', 'pencerede martı'],
  capa: { bosMasa: [MUH_MASA[3], TZ] }, kadraj: { genis: [1.0, 520, 1130] },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -400, x1: 1500, isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, -150, 640, 250, 300, { isik, t });
    M.duvarSaati(K, 905, 790, 48, 10.3 + t / 60, t);
    K.rect(250, 716, 360, 74, RENK.muh, LW, 12); K.text('MUHASEBE', 430, 770, 48, PAL.paper, 900);
    for (let i = 0; i < 4; i++) K.rect(1000 + i * 52, 900, 46, 140, [PAL.teal, PAL.mustard, '#8E2A2E', '#E9DCC2'][i], LW * 0.6, 4);
  },
});
M.mekanEkle(ODA_B, {
  gen: [-300, 1400], dongu: ['monitörlerde kod', 'sunucu ışıkları'],
  capa: { bosMasa: [BIL_MASA[0], TZ] }, kadraj: { genis: [0.97, 560, 1130] },
  arka(K, t, { isik, durum }) {
    M.oda(K, { x0: -400, x1: 1500, isik, duvar: 'duz', zemin: 'karo' });
    M.kapi(K, 20, KAPI_Y + 10, 170, KAPI_H - 10, { acik: durum.kapi, yon: 1, ic: '#B9C7BD', isik });
    K.rect(420, 716, 400, 74, RENK.bil, LW, 12); K.text('BİLGİ İŞLEM', 620, 770, 48, PAL.paper, 900);
    // sunucu dolabı (döngü: yanıp sönen ışıklar)
    K.rect(985, 760, 150, 560, '#2F3338', LW, 8);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++) { const on = Math.floor(t * 3 + r * 1.7 + c * 2.3) % 3 !== 0; K.circ(1012 + c * 22, 800 + r * 54, 6, on ? [PAL.green, PAL.mustard, PAL.coral][(r + c) % 3] : '#4B565D', 0); }
  },
});

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05,
    kMuh: T('h1:2'), kVar: T('h1:6') - 0.2, kBil: T('h1:6') - 0.04,
    kesMuh: T('h1>') - 0.08, kesBil: T('h2a:2') - 0.1, bilVar: T('h2a:4') - 0.2, kimse: T('h2a:4'), kapan: T('h2a:8'),
    kesKor: T('h2b') - 0.1, ikiBirim: T('h2b:1'), yuks: T('h2b:6'), nasil: T('h2b:7'),
    d2: T('d2'), biri: T('d2:1'), oteki: T('d2:3'), hd: T('hd'), yalan: T('hd:2'), bak: T('hd:4'),
    nKes: T('n1') - 0.25, dede: T('n1:1'), torun: T('n1:4'),
    cevap: Math.max(T('d3:2') - 0.1, T('d3') + 0.82), ac: T('d3:2'),
    eMuh: T('d4') - 0.04, eHik: T('d4:2') - 0.04, eBil: T('d4:3') - 0.04, eYasli: T('d4:5'),
    yurT0: T('d5:1') - 0.12, yurT1: T('d5:7') - 0.08, fMuh: T('d5:3') - 0.04, fBil: T('d5:7') - 0.04,
    espri: T('h4') - 0.22, ortH: T('h4:4'), ben: T('h4:5'), cta: T('d6') - 0.15,
  };
  // sayaç: Hikmet makineyi verir; Defne muhasebeyi, sonra bilgi işlemi hesaplar; tabelalara bakar; düşünür. Necmi gelir.
  tm.ver = cd0 + 0.25;
  tm.hes1 = [cd0 + 1.5, cd0 + 1.8, cd0 + 2.1];
  tm.bakM = cd0 + 2.6;
  tm.hes2 = [cd0 + 3.7, cd0 + 4.0, cd0 + 4.3];
  tm.bakB = cd0 + 4.8;
  tm.dusun = [cd0 + 5.8, cd - 0.55];
  tm.nYur = [cd - 4.7, cd - 3.0];
  tm.ekran = [
    [-1e9, '0'], [tm.bak - 0.02, String(ORT.bilSonra)],
    [tm.hes1[0], String(top(MUH))], [tm.hes1[1], '÷' + MUH.length], [tm.hes1[2], String(ORT.muhSonra)],
    [tm.hes2[0], String(top([...BIL, HIK_YAS]))], [tm.hes2[1], '÷' + (BIL.length + 1)], [tm.hes2[2], String(ORT.bilSonra)],
  ];
  // tabelalar (ve cevaptaki oklar) aynı olay listesini okur
  tm.tabM = [[tm.kMuh, ORT.muhSonra, true], [tm.cevap, ORT.muhOnce, false], [tm.fMuh, ORT.muhSonra, true]];
  tm.tabB = [[tm.kBil, ORT.bilSonra, true], [tm.cevap, ORT.bilOnce, false], [tm.fBil, ORT.bilSonra, true]];

  const GEN = [0.97, 540, 1000];
  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, 0.99, 548, 1000], [tm.kVar, 1.0, 600, 1000]] },
    { id: 'muh', t0: tm.kesMuh, cam: [[0, 1.0, 520, 1130], [tm.kesBil, 1.02, 530, 1128]] },
    { id: 'bil', t0: tm.kesBil, cam: [[0, 0.97, 560, 1130], [tm.kimse, 1.0, 545, 1126], [tm.kapan, 1.0, 575, 1122]] },
    { id: 'kor', t0: tm.kesKor, cam: [[0, ...GEN], [tm.nasil, 0.99, 610, 1000], [tm.d2 - 0.1, 1.06, 640, 1012], [tm.bak, 1.09, 650, 1018]] },
    { id: 'sayac', t0: cd0 - 0.05, cam: [[0, 0.97, 540, 946], [cd0 + 5, 0.98, 540, 952], [cd - 1.2, 0.98, 536, 958]] /* daire iki tabelanın arasında kalsın: cx sabit */ },
    { id: 'necmi', t0: tm.nKes, cam: [[0, 1.38, 336, 1088], [T('n1>'), 1.42, 340, 1084]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 540, 1080]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, 1.0, 545, 1150], [tm.eYasli, 1.01, 548, 1148], [tm.fBil, 1.0, 556, 1150]] },
    { id: 'espri', t0: tm.espri, cam: [[0, 1.32, 845, 1085], [tm.ben, 1.35, 850, 1082]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, 1.3, 565, 1092], [tm.cta + 1.8, 1.33, 562, 1088]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // ——— pozlar (önden; koridor ölçeği) ———
  const hikBase = H.kisi('hikmet', { x: HIK_KAPI, s: sOf('hikmet'), expr: 'mutlu', head: { tilt: -4, look: [-0.5, 0.2] }, ...POZ.dur });
  const hik = [
    [tm.kVar + 0.05, { expr: 'mutlu', head: { tilt: -4, look: [-0.2, 0.1] } }, 0.3],
    [tm.kesKor, { expr: 'mutlu', head: { tilt: -3, look: [-0.7, 0.1] } }, 0.01],
    [tm.ikiBirim, { head: { tilt: 3, look: [-0.6, -0.7] } }, 0.3],
    [tm.yuks - 0.3, { head: { tilt: 2, look: [0.05, -0.8] } }, 0.3],
    [tm.nasil, { expr: 'mutlu', head: { tilt: -5, look: [-0.1, 0.05] } }, 0.3],
    [tm.d2, { expr: 'notr', head: { tilt: -4, look: [-0.8, 0.1] } }, 0.3],
    [tm.hd, { expr: 'mutlu', head: { tilt: 4, look: [-0.6, 0.4] } }, 0.3],
    [tm.bak, { head: { tilt: -3, look: [-0.8, 0.1] } }, 0.25],
    [cd0 + 1.4, { expr: 'mutlu', ...POZ.belde, head: { tilt: 3, look: [-0.7, 0.3] } }, 0.4],
    [tm.nYur[0] + 0.4, { head: { tilt: -3, look: [-0.9, 0.1] } }, 0.35],
    [cd - 0.3, { expr: 'notr', armL: POZ.dur.armL, head: { tilt: -2, look: [-0.8, 0.2] } }, 0.35],
    [tm.buldum - 0.05, { expr: 'saskin', head: { tilt: -4, look: [-0.9, 0.0] } }, 0.25],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, s: sOf('defne'), expr: 'saskin', head: { tilt: -3, look: [0.6, 0.1] }, ...POZ.dur });
  const def = [
    [0.4, { head: { tilt: -2, look: [0.7, 0.15] } }, 0.4],
    [1.2, { head: { tilt: 3, look: [0.9, 0.05] } }, 0.45],
    [tm.kVar, { expr: 'saskin', head: { tilt: 4, look: [0.8, 0.0] } }, 0.35],
    [tm.kesKor, { expr: 'notr', head: { tilt: 3, look: [0.8, 0.1] } }, 0.01],
    [tm.ikiBirim, { head: { tilt: -4, look: [-0.6, -0.8] } }, 0.3],
    [tm.yuks - 0.1, { expr: 'saskin', head: { tilt: 4, look: [0.6, -0.8] } }, 0.3],
    [tm.nasil, { head: { tilt: 3, look: [0.8, 0.0] } }, 0.3],
    [tm.d2 - 0.05, { expr: 'kizgin', head: { tilt: -2, look: [0.3, -0.1] }, armL: { sh: 40, el: -50 }, armR: { sh: 40, el: -50 } }, 0.3],
    [tm.biri - 0.08, { expr: 'mutlu', head: { tilt: -6, look: [-0.5, -0.7] }, armL: { sh: 132, el: -24 } }, 0.32],
    [tm.oteki - 0.08, { head: { tilt: 5, look: [0.6, 0.6] }, armL: { sh: 70, el: -30 }, armR: { sh: 48, el: 6 } }, 0.32],
    [tm.hd - 0.1, { expr: 'notr', ...POZ.dur, head: { tilt: 3, look: [0.7, 0.3] } }, 0.35],
    [tm.bak + 0.05, { expr: 'saskin', head: { tilt: -4, look: [0.6, 0.35] } }, 0.2],
    [tm.ver, { expr: 'notr', head: { tilt: 4, look: [0.2, 0.6] } }, 0.3],
    [tm.bakM, { expr: IFADE.dusun, head: { tilt: -5, look: [-0.6, -0.8] } }, 0.35],
    [tm.hes2[0] - 0.3, { expr: 'notr', head: { tilt: 4, look: [0.2, 0.6] } }, 0.3],
    [tm.bakB, { expr: IFADE.dusun, head: { tilt: 5, look: [0.6, -0.8] } }, 0.35],
    [tm.dusun[0], { expr: IFADE.dusun, armL: { sh: 18, el: -168 }, head: { tilt: 6, look: [0.3, -0.5] } }, 0.4],
    [tm.dusun[1], { expr: 'saskin', armL: POZ.dur.armL, head: { tilt: -3, look: [-0.4, -0.1] } }, 0.3],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 4, look: [0.0, 0.8] } }, 0.01],
    [tm.eMuh, { head: { tilt: -3, look: [-0.5, 0.75] } }, 0.3],
    [tm.eBil, { head: { tilt: 4, look: [0.7, 0.75] } }, 0.3],
    [tm.yurT0, { head: { tilt: -4, look: [-0.8, 0.1] } }, 0.3],
    [tm.yurT0 + 1.2, { head: { tilt: 3, look: [0.6, 0.1] } }, 0.6],
    [tm.fBil + 0.2, { head: { tilt: 4, look: [0.8, 0.1] } }, 0.3],
    [tm.cta, { expr: 'mutlu', head: { tilt: 4, look: [0.5, 0.2] } }, 0.01],
    [tm.cta + 0.5, { head: { tilt: -6, look: [0.05, 0.05] } }, 0.35],
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, s: sOf('necmi'), expr: 'mutlu', head: { tilt: 3, look: [0.7, 0.1] }, ...POZ.dur });
  const nec = [
    [tm.nKes, { expr: 'mutlu', head: { tilt: -3, look: [0.1, 0.1] } }, 0.01],
    [tm.dede - 0.1, { head: { tilt: -6, look: [-0.6, -0.2] } }, 0.3],
    [tm.torun - 0.1, { head: { tilt: 6, look: [0.6, -0.2] } }, 0.3],
    [tm.torun + 1.1, { head: { tilt: 2, look: [0.0, 0.05] } }, 0.3],
    [tm.cevap, { expr: 'mutlu', head: { tilt: 4, look: [0.8, 0.4] } }, 0.01],
  ];
  // ——— figüranlar (oda içi) ———
  const fig = (key, x, expr, keys) => ({ key, base: H.kisi(key, { x, s: sOf(key, KS_I), expr, ...POZ.dur, head: { tilt: 0, look: [0.6, 0.1] } }), keys });
  const muhF = [
    fig('b057_y40', MUH_MASA[0], 'notr', [[0, { head: { tilt: 4, look: [0.85, 0.15] } }], [tm.kesMuh + 0.6, { head: { tilt: 2, look: [0.3, 0.6] } }, 0.35]]),
    fig('b057_y50', MUH_MASA[1], 'saskin', [[0, { head: { tilt: -3, look: [0.9, 0.1] } }]]),
    fig('b057_y60', MUH_MASA[2], 'notr', [[0, { head: { tilt: 5, look: [0.9, 0.3] } }], [tm.kesMuh + 0.4, { expr: 'yorgun', head: { tilt: -3, look: [0.5, 0.0] } }, 0.35]]),
  ];
  const bilF = [
    fig('b057_y20', BIL_MASA[1], 'mutlu', [[0, { head: { tilt: 4, look: [0.5, 0.6] } }], [tm.kimse - 0.1, { expr: 'saskin', head: { tilt: -5, look: [-0.9, 0.1] } }, 0.3]]),
    fig('b057_y22', BIL_MASA[2], 'notr', [[0, { head: { tilt: -3, look: [0.4, 0.6] } }], [tm.kimse + 0.15, { expr: 'mutlu', head: { tilt: 4, look: [-0.9, 0.15] } }, 0.3]]),
    fig('b057_y24', BIL_MASA[3], 'notr', [[0, { head: { tilt: 2, look: [-0.3, 0.6] } }], [tm.kimse + 0.3, { expr: 'saskin', head: { tilt: -3, look: [-0.95, 0.1] } }, 0.3]]),
  ];
  return { tm, film, hikBase, hik, defBase, def, necBase, nec, muhF, bilF };
}

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  split: { h2a: 5 },
  kartSon: -1,   // kart ve sayaç ekran katmanında çizilir (sayaç bu bölüme özel: tabelaları örtmez)
  kuyruksuz: (t, B) => B.sc.id === 'muh' || B.sc.id === 'cevap',   // cevapta kuyruk Hikmet'in okunu kesmesin
  dunya(K, t, B) {
    const id = B.sc.id;
    if (id === 'muh') muhOda(K, t, tl, S, B);
    else if (id === 'bil') bilOda(K, t, tl, S, B);
    else koridor(K, t, tl, S, B);
  },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.cevap) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
    if (id === 'cevap') oklar(K, t, S, B);
  },
});

// Cevap: metrenin üstünde muhasebe ve bilgi işlem okları, altında Hikmet'in oku (ekran uzayı; tabelalarla aynı olay listesi)
function oklar(K, t, S, B) {
  const { tm } = S, G = metreGeo(DEF_X, R_Y, 1), son = tm.espri - 0.2;
  const ok = (st, a, renk) => {
    const v = lerp(st.eski, st.val, ease.state(st.u)), lab = st.u < 0.5 ? st.eski : st.val;
    const p = B.ekr(G.pt(sV(v), -R_H / 2 - 6));
    okEtiket(K, t, a, son, p, String(lab), renk, PAL.paper, 1, st.anim && t < st.ta + 0.6 ? [st.ta + 0.1] : []);
  };
  ok(tabelaAt(ORT.muhOnce, tm.tabM, t), tm.eMuh, RENK.muh);
  ok(tabelaAt(ORT.bilOnce, tm.tabB, t), tm.eBil, RENK.bil);
  okEtiket(K, t, tm.eHik, son, B.ekr(G.pt(sV(HIK_YAS), R_H / 2 + 6)), 'HİKMET ' + HIK_YAS, PAL.mustard, INK, -1, [tm.eYasli, tm.fBil + 0.25]);
}
// Oklu etiket (ekran): uç (x, y) noktasında; yon 1 → etiket üstte, ok aşağı · −1 → etiket altta, ok yukarı
function okEtiket(K, t, a, b, [x, y], metin, dolgu, yazi, yon, nabiz = []) {
  if (t < a - 0.001 || t > b + 0.2) return;
  const { ctx } = K, v = H.spring(t - a, H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, b, 0.2));
  let pu = 1; for (const p of nabiz) pu += 0.16 * Math.sin(Math.PI * seg(t, p - 0.04, 0.34));
  const size = 46; ctx.font = `900 ${size}px Rubik`;
  const w = ctx.measureText(metin).width + 44, h = 64, cy = -yon * (h / 2 + 18), k = (0.6 + 0.4 * v) * out * pu;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = clamp01(v * 1.6) * out;
  K.rect(-w / 2 + 6, cy - h / 2 + 8, w, h, INK, 0, h / 2);
  K.poly([[-17, cy + yon * (h / 2 - 6)], [17, cy + yon * (h / 2 - 6)], [0, 0]], dolgu, LW * 0.8);
  K.rect(-w / 2, cy - h / 2, w, h, dolgu, LW * 0.8, h / 2);
  K.text(metin, 0, cy + size * 0.36, size, yazi, 900);
  ctx.restore();
}

// "SEN DE DÜŞÜN!" sayacı (b051 uyarlaması): başlık kartın altında, daire iki tabelanın arasında, paylaşım hapı altyazı yerinde.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.05 || t >= t1 + 0.35) return;                  // sayaç kesmeyle (cd0 − 0,05) birlikte gelir
  const { ctx } = K, inU = H.spring(t - (t0 - 0.05), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 540, y = 700, r = 84;
  ctx.save(); ctx.translate(x, 556); ctx.scale(inU * out, inU * out);
  ctx.font = '900 56px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 64;
  K.rect(-bw / 2 + 8, -40 + 9, bw, 80, INK, 0, 40); K.rect(-bw / 2, -40, bw, 80, PAL.mustard, LW, 40);
  K.text('SEN DE DÜŞÜN!', 0, 20, 56, INK, 900);
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(9, 11, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 26, 72, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(540, 1366); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    ctx.font = '900 46px Rubik'; const sw = ctx.measureText(share).width + 64;
    K.rect(-sw / 2 + 8, -46 + 10, sw, 92, INK, 0, 46); K.rect(-sw / 2, -46, sw, 92, PAL.coral, LW, 46); K.text(share, 0, 16, 46, PAL.paper, 900);
    ctx.restore();
  }
}

// ——— Hikmet koliyi taşırken: önden iki el yanlarda; yandan yakın el altta ———
function koliTut(p, x, y) {
  if (p.view === 'side') { const f = p.facing || 1; return { R: [[x - f * 34, y + 40], 1, 'A'], L: [[x - f * 10, y + 44], 1, 'A'] }; }
  return { L: [[x - 70, y + 14], 1, 'A'], R: [[x + 70, y + 14], 1, 'A'] };
}

// ═══════════════════════════ Koridor (kanca, soru, deneme, sayaç, ipucu, Buldum, cevap, espri, çağrı) ═══════════════════════════
function koridor(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id, sK = sOf('hikmet');
  const cevapta = t >= tm.cevap;
  const VA = [688, 1146], VB = [618, 1226], vr = H.elVer(t, tm.ver, VA, VB);
  const durum = {
    muhAcik: t < tm.kesMuh ? 1 - W(t, 1.25, 0.45) : cevapta ? 1 - W(t, tm.yurT0 + 1.1, 0.45) : 0,
    bilAcik: t < tm.kesMuh ? 0 : 1,
    muh: tabelaAt(ORT.muhOnce, tm.tabM, t), bil: tabelaAt(ORT.bilOnce, tm.tabB, t),
    nabM: H.nabiz(t, tm.yuks, 0.4), nabB: H.nabiz(t, tm.yuks + 0.08, 0.4),
  };
  M.mekanCiz(K, KOR, 'arka', t, { isik: M.ISIK.gunduz, durum });
  if (t >= tm.kesKor && !cevapta) koli(K, KOLI_YER[0], KOLI_YER[1] - 54, { metreVar: true });   // Hikmet koliyi yere bırakmış

  // ——— Hikmet ———
  let hp, hO = { heads }, koliP = null, hesapP = null, hIs = null, plk = 1;
  if (t < tm.kesMuh) {                                            // kanca: muhasebeden çıkar, koridoru geçer, bilgi işlemin önünde döner
    if (t < tm.kVar) hp = H.yuru('hikmet', t, { t0: 0, t1: tm.kVar, x0: 390, x1: HIK_KAPI, s: sK, poz: { expr: 'mutlu', head: { tilt: 3, look: [0.4, 0.15] } } });
    else hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
    koliP = hp.view === 'side' ? [hp.x + 84, KOLI_Y] : [hp.x, KOLI_Y];
    Object.assign(hO, koliTut(hp, ...koliP));
  } else if (!cevapta) {
    hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
    // makine sol elde (Defne'ye doğru); h2b'de "yükseldi"de sağ elle tabelayı gösterir; hd'de makineyi uzatır ve "bak"ta tuşa basar
    const uz = W(t, tm.hd - 0.05, 0.4);
    const elde = kar([700, 1262], [664, 1182], uz);              // uzatılan makine çenenin altında kalır
    if (t < vr.tB + 0.3) { if (t < vr.tB) hesapP = t >= tm.ver ? vr.p : elde; hO.L = [[(hesapP || vr.p)[0] + 8, (hesapP || vr.p)[1] + 50], t >= tm.ver ? vr.verW : 1, 'A']; }
    const wY = pIn(t, tm.yuks - 0.3, tm.nasil + 0.1, 0.3);
    if (wY > 0.01) { hO.R = [H.elYeri('hikmet', hp, 'R', 'yukari'), wY, 'B']; if (wY > 0.6) hIs = [BIL_X + 30, TAB_Y + TAB_H + 10]; }
    const wB = pIn(t, tm.bak - 0.32, tm.bak + 0.55, 0.26);
    if (wB > 0.01 && hesapP) { hO.R = [[hesapP[0] + 26, hesapP[1] + 6], wB, 'A']; if (wB > 0.6) hIs = [hesapP[0] + 18, hesapP[1] + 2 + 6 * H.nabiz(t, tm.bak, 0.2)]; }
  } else {                                                        // cevap: aynı geçiş, metrenin arkasından; espride plakayı yatırır
    if (t < tm.yurT0) hp = H.kisi('hikmet', { x: HIK_M, s: sK, expr: 'mutlu', head: { tilt: 4, look: [0.6, 0.3] }, ...POZ.dur });
    else if (t < tm.yurT1) hp = H.yuru('hikmet', t, { t0: tm.yurT0, t1: tm.yurT1, x0: HIK_M, x1: HIK_SON, s: sK, poz: { expr: 'mutlu', head: { tilt: 3, look: [0.3, 0.1] } } });
    else {
      const e = t >= tm.espri;
      hp = H.kisi('hikmet', { x: HIK_SON, s: sK, expr: e ? (t > tm.ben - 0.4 ? 'yorgun' : 'notr') : 'mutlu', ...POZ.dur,
        head: e ? { tilt: t > tm.ben - 0.4 ? 8 : -4, look: t > tm.ortH - 0.3 ? [-0.1, 0.8] : [-0.2, 0.2] } : { tilt: -3, look: [-0.8, 0.3] } });
      if (t >= tm.cta) hp.head = { ...hp.head, tilt: 5, look: [-0.8, 0.2] };
    }
    koliP = hp.view === 'side' ? [hp.x + 84, KOLI_Y] : [hp.x, KOLI_Y];
    Object.assign(hO, koliTut(hp, ...koliP));
    const wP = pIn(t, tm.ben - 0.55, tm.ben + 0.5, 0.28);
    if (wP > 0.01) hO.R = [[koliP[0] + 18, koliP[1] - 78], wP, 'A'];
    plk = 1 - ease.state(seg(t, tm.ben - 0.12, 0.3));
  }
  if (id === 'sayac') H.glance(hp, t, tm.cd - 0.5, 9.5);

  // ——— Defne ———
  const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
  if (t < tm.kesMuh) dp.x = DEF_K;                                // kancada Hikmet'in yolunun dışında, solda
  const dO = { heads };
  let dIs = null, metreU = 0, metreY = R_Y;
  if (t >= tm.ver && t < tm.cevap) {
    if (t >= vr.tK - 0.3 && t < tm.buldum - 0.06) {
      if (t < vr.tS) { dO.R = [[vr.p[0] - 8, vr.p[1] + 50], vr.alW, 'A']; if (t >= vr.tB) hesapP = vr.p; }
      else { hesapP = VB; dO.R = [[VB[0] - 8, VB[1] + 50], 1, 'A']; }
      // tuşlara dokunur (sol el)
      for (const grup of [tm.hes1, tm.hes2]) {
        const w = pIn(t, grup[0] - 0.32, grup[2] + 0.3, 0.26);
        if (w > 0.01) { const p = H.dokunYolu(t, grup.map((a, i) => [a, [600 + i * 20, 1240 + (i % 2) * 18]]), { yuksel: 18, sure: 0.14 }); dO.L = [[p[0] - 10, p[1] + 26], w, 'A']; if (w > 0.6) dIs = p; }
      }
    }
  }
  if (cevapta) {
    metreU = ease.state(seg(t, tm.ac, 0.75));
    metreY = R_Y - 40 * ease.state(seg(t, tm.cta + 0.3, 0.45));
    const G = metreGeo(DEF_X, metreY, metreU);
    dO.L = [G.pt(310, 4), 1, 'A']; dO.R = [G.pt(430, 4), 1, 'A'];
  }

  // ——— Necmi (sayaçta gelir; ipucu; cevapta kenarda) ———
  let np = null; const nO = { heads };
  let fotoL = null, fotoR = null;
  if (id === 'sayac' && t >= tm.nYur[0]) {
    np = t < tm.nYur[1] ? H.yuru('necmi', t, { t0: tm.nYur[0], t1: tm.nYur[1], x0: -170, x1: NEC_X, s: sOf('necmi'), poz: { expr: 'mutlu', head: { tilt: 3, look: [0.5, 0.1] } } })
      : H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
  } else if (id === 'necmi' || id === 'buldum') {
    np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    const uL = W(t, tm.dede - 0.3, 0.38), uR = W(t, tm.torun - 0.3, 0.38);
    fotoL = kar([272, 1296], [180, 1004], uL); fotoR = kar([392, 1296], [492, 1004], uR);
    nO.L = [[fotoL[0] + 6, fotoL[1] + 50], 1, 'A']; nO.R = [[fotoR[0] - 6, fotoR[1] + 50], 1, 'A'];
    if (id === 'buldum') { fotoL = fotoR = null; delete nO.L; delete nO.R; }
  } else if (cevapta) np = H.kisi('necmi', { x: 70, s: sOf('necmi'), expr: 'mutlu', ...POZ.dur, head: { tilt: 4, look: [0.8, 0.3] } });

  // ——— çizim ———
  const hikOnde = !cevapta;                                      // kancada Hikmet Defne'nin önünden geçer; cevapta arkasından
  let hc = null, dc;
  if (!hikOnde) { hc = oyna(K, t, tl, 'hikmet', hp, hO); koli(K, koliP[0], koliP[1], { metreVar: false, plk }); hc.tut('L'); hc.tut('R'); }   // cevapta koli Hikmet'le birlikte Defne'nin arkasında
  const nc = np ? oyna(K, t, tl, 'necmi', np, nO) : null;
  dc = oyna(K, t, tl, 'defne', dp, dO);
  if (hikOnde) hc = oyna(K, t, tl, 'hikmet', hp, hO);
  if (koliP && hikOnde) {
    koli(K, koliP[0], koliP[1], { metreVar: !cevapta, hesap: t < tm.kesMuh, plk });
    hc.tut('L'); hc.tut('R');
  }
  if (cevapta) { metre(K, DEF_X, metreY, metreU); dc.tut('L'); dc.tut('R'); }
  if (hesapP) {
    const ek = ekranAt(tm.ekran, t);
    const hikte = t < vr.tB, defte = t >= vr.tK;
    hesapMak(K, hesapP[0], hesapP[1], ek, { k: 1, rot: defte && !hikte ? -6 : 6 });
    if (hikte) hc.tut('L');
    if (defte) dc.tut('R');
  }
  if (hIs) hc.isaret('R', hIs);
  if (dIs) dc.isaret('L', dIs);
  if (fotoL) { foto(K, fotoL[0], fotoL[1], 'dede', -5); nc.tut('L'); }
  if (fotoR) { foto(K, fotoR[0], fotoR[1], 'torun', 5); nc.tut('R'); }
  if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof, k: dp.s / 245 });
}
function ekranAt(liste, t) { let s = liste[0][1]; for (const [a, v] of liste) if (t >= a) s = v; return s; }

// ═══════════════════════════ Muhasebe odası (h2a "Muhasebeden"): üç kişi, Hikmet'in masası boş ═══════════════════════════
function muhOda(K, t, tl, S, B) {
  M.mekanCiz(K, ODA_M, 'arka', t, { isik: M.ISIK.gunduz });
  S.muhF.forEach(f => { const p = H.poseAt(H.CARDS[f.key], f.base, f.keys, t); oyna(K, t, null, f.key, p, { heads: B.heads }); });
  MUH_MASA.forEach(x => masa(K, x));
  MUH.forEach((yas, i) => plaka(K, MUH_MASA[i] - 30, TZ - 4, yas));
  // boş masa: plakanın tozlu izi, kalem kutusu
  const bx = MUH_MASA[3] - 30; K.ctx.save(); K.ctx.setLineDash([10, 8]); K.rect(bx - 52, TZ - 14, 104, 10, null, 3, 3); K.ctx.restore();
  K.rect(MUH_MASA[3] + 50, TZ - 52, 34, 48, '#7E8460', 3, 4);
  // masa üstleri: dosya yığını, hesap makinesi, çay
  K.rect(MUH_MASA[0] + 46, TZ - 34, 70, 30, PAL.mustard, 3, 3); K.rect(MUH_MASA[0] + 42, TZ - 58, 70, 26, PAL.teal, 3, 3);
  hesapMak(K, MUH_MASA[1] + 62, TZ - 48, '', { k: 0.5, rot: 0 });
  cay(K, MUH_MASA[2] + 60, TZ - 6, t);
}

// ═══════════════════════════ Bilgi işlem odası (h2a "bilgi işleme geçtim"): Hikmet koliyle girer ═══════════════════════════
function bilOda(K, t, tl, S, B) {
  const { tm } = S, sK = sOf('hikmet', KS_I);
  M.mekanCiz(K, ODA_B, 'arka', t, { isik: M.ISIK.gunduz, durum: { kapi: 1 - W(t, tm.kapan, 0.4) } });
  S.bilF.forEach(f => { const p = H.poseAt(H.CARDS[f.key], f.base, f.keys, t); oyna(K, t, null, f.key, p, { heads: B.heads }); });
  const yT0 = tm.kesBil - 0.35;
  let hp;
  if (t < tm.bilVar) hp = H.yuru('hikmet', t, { t0: yT0, t1: tm.bilVar, x0: 40, x1: BIL_MASA[0], s: sK, poz: { expr: 'mutlu', head: { tilt: 3, look: [0.4, 0.1] } } });
  else hp = H.kisi('hikmet', { x: BIL_MASA[0], s: sK, expr: 'mutlu', ...POZ.dur, head: t < tm.kimse + 0.6 ? { tilt: -3, look: [0.1, 0.1] } : { tilt: 4, look: [0.8, 0.15] } });
  const kp = hp.view === 'side' ? [hp.x + 80, 1222] : [hp.x, 1222];
  const hc = oyna(K, t, tl, 'hikmet', hp, { heads: B.heads, ...koliTut(hp, ...kp) });
  BIL_MASA.forEach(x => masa(K, x, 176));
  BIL.forEach((yas, i) => { plaka(K, BIL_MASA[i + 1] - 34, TZ - 4, yas); monitor(K, BIL_MASA[i + 1] + 50, t, i); });
  koli(K, kp[0], kp[1], { metreVar: true, hesap: true });
  hc.tut('L'); hc.tut('R');
}
