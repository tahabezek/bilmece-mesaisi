// Bölüm 21 · CUMA VE SALI (v4 "hikâye" dili; storyboard: hikayeler/bolum_019-027_v4.md § 021).
// Logline: Hikmet Bey Cuma'yı Salı'nın önüne koyar ve bunun her hafta olduğu bir yer bulunduğunu söyler. Defne cevabı
// kürede arar; cevap arşivdeki en kalın kitaptan çıkar.
// Akılda kalacak tek şey: sözlükte Cuma, Salı'dan yüzlerce sayfa önce gelir.
// İki mekân aynı dünyada yan yanadır (M.yanYana): Hikmet'in odası → kapı → arşiv. Her şey t'nin saf fonksiyonudur;
// bütün anlar ses çizelgesindeki kelime çapalarından okunur (ses saattir). Ortak motor: hikaye.js + mekan.js.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, kisi, oyna, POZ, IFADE } = H;

// ═══════════════════════════ Ölçüler (dünya pikseli) ═══════════════════════════
const ODA = 'b021_oda', ARS = 'b021_arsiv', OX = 1556;          // OX: arşivin dünya kayması (oda 1500 + bölme 56)
const MASA_Y = 1340;                                            // iki masanın da üst yüzü
const HIK_X = 600, DEF_X = 975, HIK_A = OX + 350, DEF_A = OX + 930, NEC_X = OX + 1500;
const MASA = { x: 180, w: 980 }, AMASA = { x: OX + 240, w: 900 };
const KUR = { x: 430, w: 180, y1: 1244, y2: 1290 };             // iki basamaklı kürsü: 1 (yüksek, solda) · 2 (alçak)
const KW = 176, KH = 88, KOSE = [KW / 2 - 6, -KH / 2 - 4];                                        // gün kartı
const P_CUMA = [KUR.x + 90, KUR.y1 - KH / 2], P_SALI = [KUR.x + 270, KUR.y2 - KH / 2];
const KURE = { x: 860, y: 1170, r: 84 }, JAP = [KURE.x + 36, KURE.y - 20], JAP_EL = [JAP[0] + 50, JAP[1] + 14];
const G_SALI = [796, 1206];                                     // SALI kartı kürenin üstünde (parmağın önünde)
const VER_A = [888, 1170], VER_B = [DEF_X + 95, 1140];           // CUMA: Hikmet uzatır → Defne göğsünde tutar
const TAK = { x: 60, y: 760, w: 250, h: 250 };                   // duvar takvimi (haftalık yapraklar)
const SAAT = [785, 832], SAAT_KAC = 16.2;
// arşiv (yerel x; dünyada OX eklenir)
const KITX = 590, RAFX = 530, RAF_Y = 1040, KIT = { PW: 250, T: 116, C: 8, PH: 146 }, HC = KIT.T + 2 * KIT.C, AX = 205;
const DOLX = 1635, DOLY = 1028, CEK_H = 92, ACIK = 50, DFX = OX + DOLX + 60, PADX = OX + 880;
const cekY = i => DOLY + 8 + i * CEK_H;
const F_CUMA = 0.12, F_SALI = 0.75, GIRIS = [[F_CUMA, 'cuma'], [0.2, 'defne'], [0.4, 'hikmet'], [F_SALI, 'salı']];
const ALF = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ', HARF_IZ = [[0, 0], [F_CUMA, 2], [0.2, 4], [0.4, 9], [F_SALI, 21], [1, 28]];
const harfAt = u => { for (let i = 1; i < HARF_IZ.length; i++) if (u <= HARF_IZ[i][0]) { const [u0, a] = HARF_IZ[i - 1], [u1, b] = HARF_IZ[i]; return ALF[Math.round(lerp(a, b, (u - u0) / (u1 - u0)))]; } return 'Z'; };
const KAPAK = '#A8322B', KAPAK2 = '#8E2A2E', SAYFA = '#FBF6EC', KENAR = '#EFE4C8', KENAR2 = '#CDBF9F', YALDIZ = '#E3B94F';

// ——— küçük yardımcılar ———
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));                                          // 0 → 1 (a'da başlar)
const pw = (t, a, b, d0 = 0.28, d1 = 0.3) => W(t, a - d0, d0) * (1 - W(t, b, d1));               // a'da tam, b'den sonra bırakır
const ekle = (p, d) => [p[0] + d[0], p[1] + d[1]];
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// İz (hedefi işlev olabilen): anahtarlar [t, nokta | t => nokta, süre = 0.3, eğri, lift]
function izF(keys, t) {
  const val = k => typeof k === 'function' ? k(t) : k; let v = val(keys[0][1]);
  for (const [tk, tgt, d = 0.3, curve = ease.state, lift = 0] of keys) { if (tk > t) break; const u = d > 0 ? curve(seg(t, tk, d)) : 1, g = val(tgt); v = [lerp(v[0], g[0], u), lerp(v[1], g[1], u) - lift * 4 * u * (1 - u)]; }
  return v;
}
// Ön kol + el, nesnenin ÜSTÜNE (masa önde durduğu için kitaba ya da küreye uzanan kol nesnenin altında kalmasın)
function kolUst(K, key, p, side) {
  const c = H.CARDS[key], { ctx } = K, e = H.eklem(key, p, 'el' + side), h = H.eklem(key, p, 'hand' + side), w = c.arm.w * p.s, lw = c.line * p.s;
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(h[0], h[1]);
  ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = c.arm.color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  H.grip(K, key, h, p.s);
}

// ═══════════════════════════ Nesneler ═══════════════════════════
function masa(K, x, w) {
  K.rect(x + 300, MASA_Y + 36, w - 600, 190, PAL.woodDark, LW);   // ortada içeri çekik perde, iki yanda çekmeceli ayak
  for (const x0 of [x + 24, x + w - 324]) { K.rect(x0, MASA_Y + 36, 300, 300, PAL.wood, LW, 4); for (const dy of [62, 196]) { K.rect(x0 + 26, MASA_Y + dy, 248, 104, PAL.woodTop, LW, 6); K.line(x0 + 118, MASA_Y + dy + 52, x0 + 182, MASA_Y + dy + 52, 8); } }
  K.rect(x, MASA_Y, w, 40, PAL.woodTop, LW, 8);
}
function kursu(K, t, tm) {
  const { x, w, y1, y2 } = KUR, { ctx } = K, k1 = 1 + 0.2 * (H.nabiz(t, tm.h1Once) + H.nabiz(t, tm.kon1 + 0.04));
  K.rect(x + w, y2, w, MASA_Y - y2, '#E6DAC0', LW, 5); K.rect(x, y1, w, MASA_Y - y1, PAL.cream, LW, 5);
  ctx.save(); ctx.translate(x + w / 2, y1 + 50); ctx.scale(k1, k1); K.text('1', 0, 24, 68, INK, 900); ctx.restore();
  K.text('2', x + w * 1.5, y2 + 43, 46, INK, 900);
}
// Gün kartı: CUMA hardal, SALI mercan. eksen: dönüşün merkezi (kartın merkezine göre; tutulan nokta)
function kart(K, o, ad) {
  if (!o) return; const { ctx } = K, cum = ad === 'cuma', e = o.eksen || [0, 0];
  ctx.save(); ctx.translate(o.p[0] + e[0], o.p[1] + e[1]); ctx.rotate(o.rot || 0); ctx.scale(o.k || 1, o.k || 1); ctx.translate(-e[0], -e[1]);
  K.rect(-KW / 2 + 5, -KH / 2 + 7, KW, KH, INK, 0, 12); K.rect(-KW / 2, -KH / 2, KW, KH, cum ? PAL.mustard : PAL.coral, LW, 12);
  K.text(K.up(cum ? 'cuma' : 'salı'), 0, 17, 46, cum ? INK : PAL.paper, 900);
  ctx.restore();
}
// Masa küresi: kıtalar boylamla döner (rot azaldıkça yüzey soldan sağa akar); Japonya'da küçük bayraklı iğne. gun: doğan güneş 0..1
const KITA = [[-0.25, 0.42, 0.5, 0.3, '#9CC08A'], [-0.55, -0.1, 0.22, 0.2, '#9CC08A'], [-1.75, 0.1, 0.3, 0.44, '#8FB87E'], [2.7, 0.3, 0.3, 0.36, '#9CC08A'], [3.05, -0.4, 0.2, 0.3, '#8FB87E'], [1.0, -0.5, 0.2, 0.13, '#9CC08A']];
function kure(K, rot, gun, sx = 0) {
  const { ctx } = K, { y, r } = KURE, x = KURE.x + sx;
  if (gun > 0.01) {   // güneş kürenin arkasından doğar (düz renk; parlama yok)
    const gx = x - 70 - 30 * gun, gy = y - 20 - 100 * gun;
    ctx.save(); ctx.globalAlpha = clamp01(gun * 1.5); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2; K.line(gx + Math.cos(a) * 32, gy + Math.sin(a) * 32, gx + Math.cos(a) * 43, gy + Math.sin(a) * 43, 6, '#E8B23A'); } ctx.restore();
    K.circ(gx, gy, 23, '#F2C14E', LW * 0.8);
  }
  K.rect(x - r * 0.55, MASA_Y - 22, r * 1.1, 22, '#5A615E', LW, 6); K.line(x, y + r, x, MASA_Y - 22, 10);
  ctx.beginPath(); ctx.arc(x, y, r * 1.14, Math.PI * 0.6, Math.PI * 1.6); ctx.lineWidth = 9; ctx.strokeStyle = '#B8933A'; ctx.stroke(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  K.circ(x, y, r, '#6FA6B8');
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  for (const [lon, lat, a, b, col] of KITA) { const d = lon - rot, c = Math.cos(d); if (c > 0.04) K.ell(x + r * Math.cos(lat) * Math.sin(d), y - r * Math.sin(lat), Math.max(2, a * r * c), b * r, col, LW * 0.6); }
  ctx.restore(); K.circ(x, y, r, null);
  const d = JLON - rot, c = Math.cos(d);   // Japonya iğnesi: beyaz bayrak, kırmızı benek
  if (c > 0.25) { const px = x + r * Math.cos(JLAT) * Math.sin(d), py = y - r * Math.sin(JLAT); K.line(px, py, px, py - 44, 5); K.rect(px, py - 50, 46 * c, 31, '#FBF6EC', LW * 0.6, 2); K.circ(px + 23 * c, py - 34.5, 8 * c, PAL.red, 0); }
}
const JLAT = Math.asin(20 / KURE.r), JLON = Math.asin(36 / (KURE.r * Math.cos(JLAT)));   // rot = 0 iken iğne JAP noktasında

// Duvar takvimi: haftalık yapraklar; her yaprakta 7 gün karesi (2. mercan = Salı, 5. hardal = Cuma)
function takvim(K, t, tm) {
  const { x, y, w, h } = TAK, { ctx } = K, N = 4, dt = (tm.takSon - tm.tak0) / N, fl = dt * 0.92;
  let hafta = 1, u = 0; for (let i = 0; i < N; i++) { const v = seg(t, tm.tak0 + i * dt, fl); if (v >= 1) hafta = i + 2; else if (v > 0) { hafta = i + 1; u = v; } }
  K.line(x + w / 2, y - 40, x + w / 2, y + 6, 5); K.circ(x + w / 2, y - 42, 8, '#5A615E', 3);
  const yaprak = (n, sy) => {
    ctx.save(); ctx.translate(x, y + 40); ctx.scale(1, sy);
    K.rect(0, 0, w, h - 40, PAL.cream, LW, 6);
    if (sy > 0.5) { K.text(K.up(`${n}. hafta`), w / 2, 86, 44, INK, 900); for (let i = 0; i < 7; i++) K.rect(18 + i * 31, 124, 26, 44, i === 1 ? PAL.coral : i === 4 ? PAL.mustard : '#D9CFB8', LW * 0.5, 4); }
    ctx.restore();
  };
  if (u > 0) { yaprak(hafta + 1, 1); yaprak(hafta, 1 - ease.state(u)); } else yaprak(hafta, 1);
  K.rect(x - 6, y, w + 12, 46, PAL.red, LW, 8); for (let i = 0; i < 6; i++) K.circ(x + 34 + i * 36, y + 6, 8, PAL.cream, LW * 0.6);
}
const takvimFiske = (t, tm) => { const N = 4, dt = (tm.takSon - tm.tak0) / N; let v = 0; for (let i = 0; i < N; i++) v = Math.max(v, Math.sin(Math.PI * seg(t, tm.tak0 + i * dt - 0.04, dt * 0.9))); return v; };
function saksi(K, x, y, t) {
  for (let i = 0; i < 5; i++) H.yaprak(K, x, y - 96, 150 + (i % 2) * 44, -0.9 + i * 0.45 + 0.04 * Math.sin(t * 1.2 + i), i % 2 ? PAL.green : '#4C8240', 1);
  K.poly([[x - 58, y - 110], [x + 58, y - 110], [x + 44, y], [x - 44, y]], '#B5673F', LW);
}
// Tavan vantilatörü (döngü): üç kanat elips üstünde döner; arkadaki kanatlar göbekten önce çizilir
function vantilator(K, x, y, t) {
  const R = 210, ky = 0.17, kan = on => { for (let i = 0; i < 3; i++) { const a = t * 5.2 + i * Math.PI * 2 / 3, s = Math.sin(a); if ((s >= 0) !== on) continue; const c = Math.cos(a), n = [-s * 26, c * 26 * ky + 5]; K.poly([[x + c * 30 - n[0] * 0.5, y + s * 30 * ky - n[1] * 0.5], [x + c * R - n[0], y + s * R * ky - n[1]], [x + c * R + n[0], y + s * R * ky + n[1]], [x + c * 30 + n[0] * 0.5, y + s * 30 * ky + n[1] * 0.5]], on ? '#E9DCC2' : '#D3C6AA', LW * 0.8); } };
  K.rect(x - 8, -600, 16, y + 574, '#5A615E', LW * 0.7); kan(false); K.rect(x - 30, y - 32, 60, 40, PAL.metal, LW, 12); K.ell(x, y + 6, 38, 13, PAL.metalDark, LW); kan(true);
}
// Kâğıt: (x, y) sol üst; serbest alt ucu vantilatörün esintisiyle kıpırdar (döngü)
function kagit(K, x, y, w, h, t, i, renk = PAL.cream) {
  const d = 9 + 7 * Math.sin(t * 6.1 + i * 1.7) + 4 * Math.sin(t * 9.7 + i * 0.9);
  K.poly([[x, y], [x + w, y], [x + w - d * 0.5, y + h - d], [x - d * 0.25, y + h - d * 0.4]], renk, LW * 0.6);
  for (let j = 1; j < 3; j++) K.line(x + 9, y + j * h * 0.27, x + w - 12, y + j * h * 0.27, 3, '#CFC4AA');
}
function raf(K, x, y, w) { K.rect(x, y, w, 18, PAL.woodTop, LW, 5); for (const dx of [26, w - 36]) K.poly([[x + dx, y + 18], [x + dx + 10, y + 18], [x + dx + 10, y + 52]], PAL.woodDark, LW * 0.7); }
// Dosya dolabı: beş çekmece (A–Ç, D, E–Ğ, H, I–K). D ve H açık durur: gövde yukarıda kalır, ön yüz aşağı ve izleyiciye doğru gelir.
const CEKMECE = ['', 'D', '', 'H', ''];   // yalnız iki çekmecenin harfi yazılı (ötekilerin etiketi boş çizgi)
function dolap(K, x, t, tm) {
  const { ctx } = K, w = 300, cx = x + w / 2;
  K.rect(x + 20, DOLY + 462, 26, 16, '#5D6A61', LW * 0.7); K.rect(x + w - 46, DOLY + 462, 26, 16, '#5D6A61', LW * 0.7);
  K.rect(x, DOLY, w, 472, PAL.metalDark, LW, 8);
  const on = (i, acik) => {
    const y0 = cekY(i) + (acik ? ACIK : 0), g = acik ? 6 : 0, nb = 1 + 0.2 * H.nabiz(t, i === 1 ? tm.dBirak + 0.12 : i === 3 ? tm.hBirak + 0.12 : -9);
    if (acik) { K.rect(x + 14, cekY(i), w - 28, ACIK + 10, '#3B4640', LW * 0.7, 4); for (let j = 0; j < 4; j++) K.rect(x + 30 + j * 62, cekY(i) + 16 + (j % 2) * 7, 46, 60, '#D9BE8A', LW * 0.5, 4); }
    K.rect(x + 12 - g, y0, w - 24 + 2 * g, CEK_H - 6, acik ? '#9DAEA1' : PAL.metal, LW, 6);
    ctx.save(); ctx.translate(cx, y0 + 30); ctx.scale(nb, nb); K.rect(-64, -23, 128, 46, PAL.cream, LW * 0.6, 5); if (CEKMECE[i]) K.text(CEKMECE[i], 0, 14, 38, INK, 900); else K.line(-40, 0, 40, 0, 6, '#CFC4AA'); ctx.restore();
    K.rect(cx - 40, y0 + 62, 80, 13, '#5D6A61', LW * 0.7, 7);
  };
  for (const i of [0, 2, 4]) on(i, false); for (const i of [1, 3]) on(i, true);
}
// Dosya: (x, y) sol üst; üst bandında ad. kes: çekmecenin ön yüzünün üst kenarı (dosya çekmeceye girince altı görünmez)
function dosya(K, o, ad) {
  const { ctx } = K, [x, y] = o.p; ctx.save();
  if (o.kes) { ctx.beginPath(); ctx.rect(x - 30, y - 80, 260, o.kes - (y - 80)); ctx.clip(); }
  K.rect(x, y, 180, 104, '#E3C58E', LW, 6); K.rect(x + 8, y + 6, 164, 42, PAL.cream, LW * 0.6, 4); K.text(K.up(ad), x + 90, y + 40, 36, INK, 900);
  ctx.restore();
}
// Yapışkan ayraç (kartlarla aynı renk): (x, y) üst orta
const ayrac = (K, [x, y], renk, w = 48, h = 36) => K.rect(x - w / 2, y, w, h, renk, LW * 0.7, 4);

// ——— sözlük ———
// Rafta: yatık durur, sırtı izleyiciye dönük (başlık sırtta). Masada: sayfa kenarları izleyiciye dönük, kapağı üstte.
function sozlukRaf(K, x, y) {
  const { PW } = KIT;
  K.poly([[x + 4, y - HC], [x + PW - 4, y - HC], [x + PW - 14, y - HC - 24], [x + 14, y - HC - 24]], KAPAK2, LW);
  K.rect(x, y - HC, PW, HC, KAPAK, LW, 8);
  for (const dy of [14, HC - 20]) K.rect(x + 8, y - HC + dy, PW - 16, 6, YALDIZ, 0);
  K.text(K.up('sözlük'), x + PW / 2, y - HC / 2 + 18, 50, PAL.cream, 900);
}
// kb = { x (sırt), y (taban), kapak 0..1, u (soldaki sayfa oranı), akis 0..1, hiz, yon, kelime, nab, ayrac: [[f, renk]…] }
function sozluk(K, kb, t) {
  const { ctx } = K, { PW, T, C, PH } = KIT, { x, y: yb, u } = kb, acik = kb.kapak >= 1;
  const hL = acik ? C + T * u : 0, hR = C + T * (1 - u) + (kb.kapak <= 0 ? C : 0), yL = yb - hL, yR = yb - hR;
  const yuz = (x0, y0, h) => { if (h < 2) return; K.rect(x0, y0, PW, h, KENAR, LW * 0.7); for (let i = 1; i * 8 < h - 3; i++) K.line(x0 + 6, y0 + i * 8, x0 + PW - 6, y0 + i * 8, 2, KENAR2); };
  const ust = (sol, y0, renk) => K.poly(sol ? [[x - PW, y0], [x, y0], [x - 5, y0 - PH], [x - PW + 10, y0 - PH]] : [[x, y0], [x + PW, y0], [x + PW - 10, y0 - PH], [x + 5, y0 - PH]], renk, LW);
  const satir = (x0, y0, n, a = 0) => { for (let i = a; i < n; i++) K.line(x0 + 24, y0 - 24 - i * 24, x0 + PW - 30 - (i % 2) * 26, y0 - 24 - i * 24, 7, '#DDD2B8'); };
  // ön yüzler: alt kapak şeridi + sayfa kenarları
  if (acik) { K.rect(x - PW - 3, yb - C, PW + 3, C, KAPAK, LW * 0.7, 3); yuz(x - PW, yL, hL - C); }
  K.rect(x, yb - C, PW + 3, C, KAPAK, LW * 0.7, 3);
  if (kb.kapak <= 0) { K.rect(x, yR, PW + 3, C + 2, KAPAK, LW * 0.7, 3); yuz(x, yR + C, hR - 2 * C); K.rect(x - 7, yR, 12, hR, KAPAK2, LW * 0.7, 5); } else yuz(x, yR, hR - C);
  // ayraçlar: yapıştığı sayfanın alt kenarından sarkar; sayfa hangi yığındaysa o yığının ön yüzünde, kendi derinliğinde durur
  for (const [f, renk] of kb.ayrac) { const solda = acik && f < u - 1e-4; ayrac(K, [solda ? x - AX : x + AX, (solda ? yL + (u - f) * T : yR + (kb.kapak <= 0 ? C : 0) + Math.max(0, f - u) * T) - 6], renk); }
  // üst yüzler (alçak olan önce), aradaki sayfa basamağı
  if (kb.kapak <= 0) {
    ust(false, yR, KAPAK); ctx.save(); ctx.beginPath(); ctx.moveTo(x + 13, yR - 12); ctx.lineTo(x + PW - 13, yR - 12); ctx.lineTo(x + PW - 21, yR - PH + 12); ctx.lineTo(x + 17, yR - PH + 12); ctx.closePath(); ctx.lineWidth = 5; ctx.strokeStyle = YALDIZ; ctx.stroke(); ctx.restore();
    K.text(K.up('sözlük'), x + PW / 2, yR - PH / 2 + 17, 48, PAL.cream, 900);
    return;
  }
  const sag = () => {
    ust(false, yR, SAYFA);
    if (kb.kelime) {   // madde başı: Defne'nin turunda sağ altta (ayracın üstünde), Hikmet'in turunda sırtın yanında (parmağının ucunda)
      satir(x, yR - 50, 4, 1); ctx.save(); ctx.translate(kb.sagda ? x + PW - 26 : x + 22, yR - 20); ctx.scale(1 + 0.16 * kb.nab, 1 + 0.16 * kb.nab); K.text(kb.kelime, 0, 0, 48, INK, 900, kb.sagda ? 'right' : 'left'); ctx.restore();
    } else satir(x, yR, 4);
    K.text(harfAt(u), x + PW - 42, yR - PH + 58, 54, '#A99F88', 900);
  };
  const sol = () => { if (acik) { ust(true, yL, SAYFA); satir(x - PW + 8, yL, 4); } };
  const basamak = () => { if (acik && Math.abs(hR - hL) > 3) K.poly([[x, yR], [x, yL], [x + (hR > hL ? -5 : 5), yL - PH], [x + (hR > hL ? 5 : -5), yR - PH]], '#E2D6B8', LW * 0.6); };
  if (hR >= hL) { sol(); basamak(); sag(); } else { sag(); basamak(); sol(); }
  // uçan yapraklar: sırt çevresinde sağdan sola (yon = −1: geri) döner; ph 0 sağ yüzde, 1 sol yüzde
  const ucan = (ph, renk, lw) => { const th = ph * Math.PI, c = Math.cos(th), s = Math.sin(th), y0 = lerp(yR, acik ? yL : yb - C, ph), fy = y0 - PW * s * 0.38; K.poly([[x, y0], [x + PW * c, fy], [x + (PW - 10) * c, fy - PH], [x + 5 * c, y0 - PH]], renk, lw); };
  if (kb.akis > 0.02) { const n = kb.hiz > 4 ? 4 : 2; for (let i = 0; i < n; i++) { let ph = ((t * kb.hiz / n + i / n) % 1 + 1) % 1; if (kb.yon < 0) ph = 1 - ph; ucan(lerp(ph < 0.5 ? 0 : 1, ph, kb.akis), ph > 0.5 ? '#F1E8D2' : SAYFA, LW * 0.6); } }
  if (kb.kapak < 1) ucan(kb.kapak, kb.kapak > 0.5 ? KENAR : KAPAK, LW);   // kapak açılırken / kapanırken
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
M.mekanEkle(ODA, {
  gen: [0, 1500], dongu: ['pencerede martı', 'duvar saatinin saniye kolu'],
  capa: { kursu1: P_CUMA, kursu2: P_SALI, kure: [KURE.x, KURE.y], takvim: [TAK.x + TAK.w, TAK.y + TAK.h] },
  kadraj: { masa: [1.12, 800, 1140], genis: [1.0, 572, 1150], bahis: [1.3, 858, 1096], kure: [1.36, 880, 1076] },
  arka(K, t, { isik, durum: { tm } }) {
    M.oda(K, { x0: -700, x1: 1560, isik });
    M.pencere(K, 880, 700, 380, 420, { isik, t: t + 7 });
    M.duvarSaati(K, SAAT[0], SAAT[1], 48 * (1 + 0.24 * H.nabiz(t, tm.erken, 0.45)), SAAT_KAC, t);   // "erken çıkarsın": saat bir kez kabarır
    takvim(K, t, tm); saksi(K, 1396, 1500, t);
    K.rect(1300, 742, 192, 78, PAL.cream, LW * 0.7, 6); K.text(K.up('arşiv'), 1378, 800, 48, INK, 900); K.poly([[1452, 766], [1480, 781], [1452, 796]], INK, 0);   // kapının yanındaki levha
    K.rect(1500, 640, 60, 860, '#17302F', 0);   // kapı boşluğu: duvarın kalınlığı
  },
});
M.mekanEkle(ARS, {
  gen: [0, 2000], dongu: ['tavan vantilatörü', 'kıpırdayan kâğıt uçları'],
  capa: { sozlukRaf: [RAFX + KIT.PW / 2, RAF_Y], masa: [KITX, MASA_Y], cekD: [DOLX + 150, cekY(1)], cekH: [DOLX + 150, cekY(3)] },
  kadraj: { ipucu: [1.25, 1705, 1245], buldum: [1.35, 905, 1100], kitap: [1.3, 640, 1140], kapali: [1.32, 648, 1156] },
  arka(K, t, { isik, durum: { tm } }) {
    M.oda(K, { x0: 0, x1: 2800, isik, duvar: 'duz', zemin: 'karo' });
    K.rect(18, 650, 216, 850, '#8C6A44', LW, 4); K.rect(40, 880, 172, 250, '#9A7650', LW * 0.7, 4); K.rect(40, 1170, 172, 280, '#9A7650', LW * 0.7, 4);   // açık kapı kanadı
    K.circ(212, 1150, 14, PAL.mustard, LW * 0.8);
    vantilator(K, 700, 560, t);
    raf(K, RAFX - 30, RAF_Y, 330);
    if (t < tm.proof) sozlukRaf(K, RAFX, RAF_Y);   // kesmeden sonra Defne'nin elinde, masaya iner
    raf(K, 1100, 1010, 250);   // klasör rafı: aralardan sarkan kâğıtlar kıpırdar
    [['#6E8B8A', 150], ['#B9A27A', 166], ['#8FA093', 142], ['#7E6B55', 160]].forEach(([c, h], i) => K.rect(1116 + i * 54, 1010 - h, 46, h, c, LW, 5));
    for (let i = 0; i < 3; i++) kagit(K, 1128 + i * 66, 1030, 52, 74, t, i, i === 1 ? '#F3E3B0' : PAL.cream);
    dolap(K, DOLX, t, tm);
    K.rect(DOLX + 22, DOLY - 22, 150, 22, PAL.cream, LW * 0.7, 3); for (let i = 0; i < 2; i++) kagit(K, DOLX + 30 + i * 40, DOLY - 30 - i * 5, 120, 26, t, i + 4);
    M.duvarSaati(K, DOLX + 232, 930, 46, SAAT_KAC, t);
  },
});
const D = M.yanYana([[ODA], [ARS]]);

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - 5;
  const tm = {
    in: 0.3, h1Cuma: T('h1:2'), h1Sali: T('h1:3'), h1Once: T('h1:4'),
    h2a: T('h2a'), tak0: T('h2a:1') - 0.04, takSon: T('h2a:5') + 0.1,
    h2b: T('h2b'), kal: T('h2b') - 0.12, kon2: T('h2b:2'), kon1: T('h2b:3'),
    h3: T('h3'), al: T('h3:1') - 0.05, salla: T('h3:2') - 0.05, erken: T('h3:3'), ver: T('h3:4') + 0.05,
    d2: T('d2'), cevir: T('d2') - 0.04, bas: T('d2:1') - 0.08, gun: T('d2:2') - 0.04,
    hd: T('hd'), saliAl: T('hd') - 0.43, saliVur: T('hd') + 0.02, hdSali: T('hd:4'),
    cd, cd0, topla: cd0 - 0.2, yurD: cd0 + 0.15, varD: cd - 0.25, yurH: cd0 + 1.0, varH: cd + 0.25,
    clue: T('n1'), nBey: T('n1:2'), dAl: T('n1:4') - 0.3, dBirak: T('n1:5'), hBirak: T('n1:7'),
    buldum: T('d3'), sozluk: T('d3:1') - 0.05, cek: T('d3:1') + 0.36, proof: T('d3>') + 0.05,
    gum: T('d4'), ac: T('d4:1') - 0.05, akA: T('d4:2') - 0.1, durC: T('d4:5') - 0.66, cumaAy: T('d4:5'),
    akS0: T('d4:6') + 0.04, durS: T('d4:9') - 0.33, saliAy: T('d4:9'), kapat: T('d4>'), kapandi: T('d4>') + 0.36,
    h4: T('h4'), kap: T('h4') - 0.3, hAc: T('h4:1') - 0.02, hDefne: T('h4:3'), hAk: T('h4:4') - 0.05, hHikmet: T('h4:5'), hKapat: T('h4>') + 0.08,
    cta: T('d6') - 0.15, ctaCuma: T('d6:1'), end: T('d6>') + 0.1,
  };
  tm.yolA = cd0 - 0.25; tm.yolB = tm.clue + 0.25;   // yürüyüşte kamerayı bölüm yönetir (kamera())
  // Kamera: kart ekrandayken başlar kartın altında kalır; masa üstü (1340) altyazının üstünde.
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, ...M.kadraj(ODA, 'masa')], [tm.h2a - 0.08, ...M.kadraj(ODA, 'genis')], [tm.h2b - 0.05, 1.1, 815, 1142], [tm.h3 - 0.05, ...M.kadraj(ODA, 'bahis')]] },
    { id: 'kure', t0: tm.d2 - 0.1, cam: [[0, ...M.kadraj(ODA, 'kure')], [tm.hd - 0.05, 1.4, 878, 1078]] },                    // bakış kesmesi: Defne küreye bakar
    { id: 'yol', t0: tm.yolA, kesme: false, cam: [[0, ...D.kadraj(1, 'ipucu')], [tm.clue + 0.9, 1.27, OX + 1712, 1246], [tm.dBirak + 0.1, 1.29, OX + 1722, 1250]] },
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, ...D.kadraj(1, 'buldum')]] },
    { id: 'cevap', t0: tm.proof, cam: [[0, ...D.kadraj(1, 'kitap')], [tm.kapat, ...D.kadraj(1, 'kapali')], [tm.h4 - 0.2, 1.3, OX + 632, 1138]] },
    { id: 'cta', t0: tm.cta, cam: [[0, 1.22, OX + 880, 1118], [tm.cta + 1.3, 1.26, OX + 882, 1112]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();
  const WD = { t0: tm.yurD, x0: DEF_X, x1: DEF_A, t1: tm.varD, poz: { expr: IFADE.dusun, head: { tilt: 9, look: [0.5, 0.7] } } };
  const WH = { t0: tm.yurH, x0: HIK_X, x1: HIK_A, t1: tm.varH, poz: { expr: 'notr', head: { tilt: 2, look: [0.6, 0.15] } } };

  // ——— Hikmet: odada (kürsünün arkasında) ———
  const hikBase = kisi('hikmet', { x: HIK_X, expr: 'mutlu', head: { tilt: -4, look: [-0.35, 0.75] }, ...POZ.rahat });
  const hik = [
    [0.5, { head: { tilt: 3, look: [0.85, 0.1] } }, 0.35],
    [tm.h1Cuma - 0.1, { head: { tilt: -5, look: [-0.4, 0.75] } }, 0.25],
    [tm.h1Sali - 0.12, { head: { tilt: 3, look: [0.45, 0.8] } }, 0.25],
    [tm.h1Once + 0.25, { head: { tilt: 5, look: [0.85, 0.05] } }, 0.3],
    [tm.h2a - 0.25, { expr: 'notr', lean: -6, head: { tilt: -8, look: [-0.9, -0.15] } }, 0.3],                     // takvime döner
    [tm.h2b - 0.55, { lean: 0, head: { tilt: 0, look: [0.1, 0.75] } }, 0.3],
    [tm.kon1 + 0.12, { expr: 'mutlu', head: { tilt: 5, look: [0.85, 0.05] } }, 0.3],
    [tm.h3 - 0.15, { armL: POZ.belde.armL, head: { tilt: 3, look: [-0.3, 0.7] } }, 0.35],
    [tm.salla, { lean: 7, head: { tilt: 6, look: [0.9, 0.2] } }, 0.4],
    [tm.ver + 0.55, { lean: 0, head: { tilt: 3, look: [0.85, 0.1] } }, 0.4],
    [tm.d2 - 0.3, { expr: 'notr', armL: POZ.rahat.armL, head: { tilt: 4, look: [0.8, 0.65] } }, 0.35],     // küreyi izler
    [tm.bas + 0.35, { expr: 'mutlu', head: { tilt: -3, look: [0.85, 0.3] } }, 0.3],
    [tm.hd - 0.08, { lean: 5, head: { tilt: 7, look: [0.85, 0.3] } }, 0.25, ease.enter],                      // "Olmaz!"
    [tm.hd + 0.9, { lean: 0 }, 0.4],
    [tm.hdSali - 0.1, { head: { tilt: -3, look: [0.6, 0.75] } }, 0.3],
    [tm.topla + 0.1, { expr: 'notr', head: { tilt: 3, look: [0.9, 0.3] } }, 0.3],
  ];
  // ——— Hikmet: arşivde (masanın solunda) ———
  const hikBaseA = kisi('hikmet', { x: HIK_A, expr: 'notr', head: { tilt: 4, look: [0.85, 0.1] }, ...POZ.rahat });
  const hikA = [
    [tm.clue + 0.2, { head: { tilt: 6, look: [0.95, 0.05] } }, 0.3],
    [tm.dBirak, { expr: 'saskin' }, 0.25],
    [tm.buldum, { head: { tilt: 2, look: [0.9, 0] } }, 0.2],
    [tm.proof, { lean: 5, head: { tilt: 7, look: [0.6, 0.75] } }, 0.01],
    [tm.ac + 0.1, { expr: 'notr' }, 0.3],
    [tm.cumaAy, { expr: 'saskin', head: { tilt: 9, look: [0.7, 0.8] } }, 0.25],
    [tm.akS0 + 0.2, { expr: 'notr', head: { tilt: 6, look: [0.45, 0.85] } }, 0.4],
    [tm.saliAy + 0.1, { expr: 'saskin', head: { tilt: 8, look: [0.55, 0.85] } }, 0.25],
    [tm.kapandi + 0.15, { expr: 'yorgun', head: { tilt: 9, look: [0.6, 0.85] } }, 0.3],
    [tm.h4 - 0.1, { expr: 'notr', lean: 8, head: { tilt: 8, look: [0.4, 0.85] } }, 0.3],
    [tm.hDefne, { expr: 'saskin' }, 0.2],
    [tm.hHikmet, { expr: 'yorgun', head: { tilt: 11, look: [0.35, 0.85] } }, 0.3],
    [tm.hHikmet + 0.55, { head: { tilt: 4, look: [0.9, 0.15] } }, 0.35],
    [tm.hKapat + 0.02, { lean: 0, x: HIK_A - 70, head: { tilt: -4, look: [0.9, 0.1] } }, 0.25],   // pes eder, bir adım çekilir
  ];
  // ——— Defne: odada ———
  const defBase = kisi('defne', { x: DEF_X, expr: 'saskin', head: { tilt: -4, look: [-0.85, 0.5] }, ...POZ.dur });
  const def = [
    [0.75, { head: { tilt: 5, look: [-0.75, 0.5] } }, 0.4],
    [tm.h1Sali, { head: { tilt: 0, look: [-0.55, 0.65] } }, 0.25],
    [tm.h1Once + 0.25, { expr: 'notr', head: { tilt: -7, look: [-0.85, 0.05] } }, 0.35],
    [tm.h2a + 0.15, { head: { tilt: -5, look: [-0.9, -0.3] } }, 0.35],                                    // takvime bakar
    [tm.h2b - 0.1, { head: { tilt: 2, look: [-0.8, 0.5] } }, 0.3],
    [tm.kon1 + 0.2, { expr: IFADE.dusun, ...POZ.dusun, head: { tilt: -8, look: [-0.5, -0.3] } }, 0.4],
    [tm.h3 + 0.2, { expr: 'notr', armR: POZ.dur.armR, head: { tilt: 4, look: [-0.8, 0.25] } }, 0.35],
    [tm.erken, { expr: 'mutlu', head: { tilt: 6, look: [-0.6, 0.35] } }, 0.3],
    [tm.ver + 0.55, { head: { tilt: -3, look: [0.2, 0.7] } }, 0.3],
    [tm.d2 - 0.3, { lean: -5, head: { tilt: -6, look: [-0.75, 0.7] } }, 0.25],                             // küreye bakar; 6 kare sonra kesme
    [tm.bas + 0.5, { head: { tilt: 5, look: [-0.85, 0.1] } }, 0.3],
    [tm.hd + 0.1, { expr: 'saskin', lean: 0, head: { tilt: 3, look: [-0.65, 0.6] } }, 0.25, ease.enter],
    [tm.hdSali + 0.4, { expr: IFADE.dusun, head: { tilt: -6, look: [-0.5, 0.6] } }, 0.35],
    [tm.topla + 0.2, { head: { tilt: 4, look: [0, 0.75] } }, 0.3],
  ];
  // ——— Defne: arşivde (masanın sağında) ———
  const defBaseA = kisi('defne', { x: DEF_A, expr: IFADE.dusun, head: { tilt: 4, look: [0.3, 0.65] }, ...POZ.dur });
  const defA = [
    [tm.clue + 0.15, { expr: 'notr', head: { tilt: 5, look: [0.95, 0.05] } }, 0.3],
    [tm.dBirak + 0.1, { expr: 'saskin', head: { tilt: 2, look: [0.95, 0.15] } }, 0.25],
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] } }, 0.25, ease.enter],
    [tm.sozluk, { head: { tilt: -8, look: [-0.8, -0.15] } }, 0.25],
    [tm.cek, { lean: -5, head: { tilt: -10, look: [-0.85, -0.05] } }, 0.3],
    [tm.proof, { expr: IFADE.zorlanma, lean: -8, head: { tilt: -6, look: [-0.7, 0.65] } }, 0.01],
    [tm.gum + 0.1, { expr: 'mutlu', lean: -3 }, 0.3],
    [tm.durC - 0.1, { lean: -8, head: { tilt: -8, look: [-0.7, 0.75] } }, 0.3],
    [tm.cumaAy + 0.2, { head: { tilt: -3, look: [-0.85, 0.3] } }, 0.25],                                   // "Cuma": Hikmet'e bakar
    [tm.akS0, { lean: -6, expr: 'notr', head: { tilt: -8, look: [-0.7, 0.75] } }, 0.3],
    [tm.saliAy - 0.5, { lean: -20 }, 0.35],
    [tm.saliAy + 0.22, { expr: 'mutlu', lean: -4, head: { tilt: 4, look: [-0.85, 0.2] } }, 0.3],
    [tm.kapat + 0.05, { lean: 0, head: { tilt: 5, look: [-0.7, 0.6] } }, 0.3],
    [tm.h4 - 0.15, { armL: POZ.belde.armL, head: { tilt: 6, look: [-0.85, 0.35] } }, 0.35],
    [tm.hHikmet + 0.2, { head: { tilt: 9, look: [-0.85, 0.2] } }, 0.25],
  ];
  // ——— Necmi: dosya dolabının başında ———
  const necBase = kisi('necmi', { x: NEC_X, expr: 'notr', head: { tilt: 5, look: [0.75, 0.3] }, ...POZ.rahat });
  const nec = [
    [tm.clue - 0.12, { expr: 'mutlu', head: { tilt: -6, look: [-0.85, 0.05] } }, 0.3],                      // "Kusura bakmayın…": onlara döner
    [tm.dAl, { expr: 'notr', head: { tilt: 6, look: [0.7, 0.35] } }, 0.3],                                  // çekmecelere bakar
    [tm.dBirak + 0.1, { head: { tilt: 8, look: [0.6, 0.8] } }, 0.3],
    [tm.hBirak + 0.3, { expr: 'mutlu', head: { tilt: -6, look: [-0.85, 0] } }, 0.3],
    [tm.buldum, { expr: 'saskin' }, 0.25],
  ];
  const S = { tm, film, WD, WH, hik, hikBase, hikA, hikBaseA, def, defBase, defA, defBaseA, nec, necBase };
  S.camG = film.cam(tm.yolA);   // yürüyüş başlamadan önceki kadraj (küre yakın planı)
  return S;
}

// ═══════════════════════════ t anındaki durumlar ═══════════════════════════
const defneX = (t, S) => t < S.tm.yurD ? DEF_X : t < S.tm.varD ? H.yuru('defne', t, S.WD).x : DEF_A;
const hikmetX = (t, S) => t < S.tm.yurH ? HIK_X : t < S.tm.varH ? H.yuru('hikmet', t, S.WH).x : HIK_A;
// Yürüyüş kamerası: ikisinin ortasını izler (sayaç halkası aralarında kalır), sonra Necmi'nin dolabına kayar
function yolKamera(cam, t, S) {
  const { tm } = S; if (t <= tm.yolA || t >= tm.yolB) return;
  const yol = { zoom: 0.96, cx: (defneX(t, S) + hikmetX(t, S)) / 2 + 70, cy: 960 };   // başlar sayaç halkasının iki yanında, pankartın altında kalır
  const a = H.kamKaris(S.camG, yol, W(t, tm.yolA, 0.8));
  Object.assign(cam, H.kamKaris(a, cam, W(t, tm.cd - 0.2, tm.yolB - tm.cd + 0.2)));
}
const kureRot = (t, tm) => 10.2 * (1 - ease.enter(seg(t, tm.cevir, 0.95)));   // 1,6 tur döner, Japonya öne gelince durur
const gunesAt = (t, tm) => ease.enter(seg(t, tm.gun, 0.45)) * (1 - ease.exit(seg(t, tm.saliVur - 0.02, 0.22)));

// Kartlar: { cuma, sali } → { p (merkez), rot, k, eksen, e (elVer) } | null
function kartlar(t, S, X, by, hop, sc) {
  const { tm } = S;
  if (sc.id === 'cta') return { cuma: { p: [X + 182, 1004], rot: -0.12, k: 1 + 0.1 * H.nabiz(t, tm.ctaCuma) }, sali: null };
  if (t >= tm.proof) return { cuma: null, sali: null };
  if (t >= tm.varD) {   // arşiv: iki kart sağ elde; "Buldum!"da havaya kalkar
    const r = ease.enter(seg(t, tm.buldum - 0.05, 0.25)) * (1 - W(t, tm.cek, 0.3));
    return { r, cuma: { p: [lerp(X + 112, X + 200, r), lerp(1232, 902, r) - hop], rot: lerp(0.12, 0.22, r) }, sali: { p: [lerp(X + 94, X + 160, r), lerp(1208, 884, r) - hop], rot: lerp(-0.1, -0.12, r) } };
  }
  if (t >= tm.yurD) {   // yürürken: yer değiştirir, üst üste koyar, ters çevirir, yan tarafa indirir
    const a = tm.yurD, LOW = [X + 114, 1190 - by], UPP = [X + 120, 1088 - by];
    const s1 = W(t, a + 1.0, 0.5), s2 = W(t, a + 2.3, 0.4), s4 = W(t, a + 3.95, 0.4);
    let c = [lerp(LOW[0], UPP[0], s1) + 56 * Math.sin(Math.PI * s1), lerp(LOW[1], UPP[1], s1)], s = [lerp(UPP[0], LOW[0], s1) - 40 * Math.sin(Math.PI * s1), lerp(UPP[1], LOW[1], s1)];
    c = kar(c, [LOW[0] + 12, LOW[1] - 16], s2);
    c = kar(c, [X + 112, 1232], s4); s = kar(s, [X + 94, 1208], s4);
    return { cuma: { p: c, rot: 2 * Math.PI * W(t, a + 3.05, 0.75) + 0.12 * s4 }, sali: { p: s, rot: -0.1 * s4 } };
  }
  // oda
  let cuma, sali;
  if (t < tm.kal) cuma = { p: H.dus(t, 0, tm.in, [P_CUMA[0] - 46, P_CUMA[1] - 76], P_CUMA), k: 1 + 0.1 * (H.nabiz(t, tm.h1Cuma) + H.nabiz(t, tm.h1Once)) };
  else if (t < tm.kon1) { const up = [P_CUMA[0] - 16, P_CUMA[1] - 116]; cuma = { p: t < tm.kon1 - 0.2 ? H.yay(P_CUMA, up, ease.enter(seg(t, tm.kal, 0.4))) : H.dus(t, tm.kon1 - 0.2, tm.kon1, up, P_CUMA), rot: 0.12 * Math.sin(2 * Math.PI * 2.6 * (t - tm.h2b)) * seg(t, tm.h2b, 0.1) * (1 - seg(t, tm.h2b + 0.5, 0.2)) }; }
  else if (t < tm.al) cuma = { p: P_CUMA, k: 1 + 0.1 * H.nabiz(t, tm.kon1 + 0.04) };
  else if (t < tm.ver) cuma = {   // Hikmet alır, Defne'ye uzatır, sallar (üst kenarından tutar)
    p: H.iz([[0, P_CUMA], [tm.al, [P_CUMA[0] + 70, P_CUMA[1] - 30], 0.24, ease.enter], [tm.salla, VER_A, 0.4, ease.state, 26]], t), eksen: [0, -KH / 2],
    rot: 0.17 * Math.sin(2 * Math.PI * 2.4 * (t - tm.erken)) * seg(t, tm.erken - 0.05, 0.15) * (1 - seg(t, tm.ver - 0.22, 0.2)),
  };
  else {   // Defne alır, göğsünde tutar; "…önce Salı gelir"de kart elinde düşer
    const e = H.elVer(t, tm.ver, VER_A, VER_B, { bulus: [VER_A[0] + 8, VER_A[1] - 4] }), u = W(t, tm.topla, 0.3), dn = W(t, tm.hdSali + 0.1, 0.35);
    cuma = { e, p: kar([e.p[0], e.p[1] + 24 * dn], [DEF_X + 40, 1200], u), rot: (0.1 * W(t, e.tB, 0.4) + 0.13 * dn) * (1 - u) };
  }
  if (t < tm.kal) sali = { p: P_SALI, k: 1 + 0.1 * H.nabiz(t, tm.h1Sali) };
  else if (t < tm.kon2) { const up = [P_SALI[0] + 14, P_SALI[1] - 96]; sali = { p: t < tm.kon2 - 0.2 ? H.yay(P_SALI, up, ease.enter(seg(t, tm.kal, 0.4))) : H.dus(t, tm.kon2 - 0.2, tm.kon2, up, P_SALI) }; }
  else if (t < tm.saliAl) sali = { p: P_SALI, k: 1 + 0.1 * H.nabiz(t, tm.kon2 + 0.04) };
  else if (t < tm.topla) { const v = seg(t, tm.saliAl, tm.saliVur - tm.saliAl), u = v * v * (3 - 2 * v); sali = { p: H.yay(P_SALI, G_SALI, u, 44), rot: -0.1 * u + 0.07 * Math.sin(2 * Math.PI * 3.2 * (t - tm.hd - 0.76)) * seg(t, tm.hd + 0.76, 0.1) * (1 - seg(t, tm.hd + 1.35, 0.2)), k: 1 + 0.12 * H.nabiz(t, tm.hdSali) }; }   // "Orada da…": kartı küreye iki kez vurur
  else { const u = W(t, tm.topla + 0.02, 0.32); sali = { p: H.yay(G_SALI, [DEF_X - 20, 1108], u, 16), rot: -0.1 * (1 - u) }; }
  return { cuma, sali };
}

// Sözlük (kesmeden sonra, arşiv masasında)
function kitapAt(t, S) {
  const { tm } = S, KX = OX + KITX; if (t < tm.proof) return null;
  const pencere = (a, b) => Math.min(seg(t, a, 0.1), 1 - seg(t, b - 0.1, 0.1));
  const kb = { x: KX, y: MASA_Y, kapak: 0, u: 0, akis: 0, hiz: 3.2, yon: 1, kelime: null, nab: 0, ayrac: [] };
  if (t >= tm.cumaAy) kb.ayrac.push([F_CUMA, PAL.mustard]); if (t >= tm.saliAy) kb.ayrac.push([F_SALI, PAL.coral]);
  if (t < tm.gum) { const v = seg(t, tm.proof, tm.gum - tm.proof); kb.x = KX - 72 * (1 - v); kb.y = MASA_Y - 130 * (1 - v * v); return kb; }
  if (t < tm.hAc) {   // Defne'nin turu: açar, C'ye kadar çevirir, S'ye akıtır; Hikmet kapatır
    const geri = W(t, tm.kapat, 0.3);
    kb.kapak = W(t, tm.ac, 0.34) * (1 - W(t, tm.kapat + 0.22, 0.14));
    kb.u = H.iz([[0, 0.02], [tm.akA, F_CUMA, tm.durC - tm.akA], [tm.akS0, F_SALI, tm.durS - tm.akS0]], t) * (1 - geri);
    if (t < tm.durC) kb.akis = pencere(tm.akA, tm.durC);
    else if (t < tm.kapat) { kb.akis = pencere(tm.akS0, tm.durS); kb.hiz = 12; }
    else { kb.akis = pencere(tm.kapat, tm.kapat + 0.3); kb.hiz = 14; kb.yon = -1; }
    kb.x = KX - 70 * W(t, tm.kap + 0.12, 0.3);
  } else {            // Hikmet'in turu: kendine çeker, açar, "defne"yi, sonra çok geride "hikmet"i bulur
    kb.x = KX - 70; kb.kapak = W(t, tm.hAc, 0.3) * (1 - W(t, tm.hKapat + 0.2, 0.14));
    kb.u = H.iz([[0, 0.02], [tm.hAc + 0.14, 0.2, tm.hDefne - 0.1 - tm.hAc - 0.14], [tm.hAk, 0.4, tm.hHikmet - 0.08 - tm.hAk]], t) * (1 - W(t, tm.hKapat, 0.26));
    kb.akis = Math.max(pencere(tm.hAc + 0.14, tm.hDefne - 0.1), pencere(tm.hAk, tm.hHikmet - 0.08)); kb.hiz = 9;
    if (t >= tm.hKapat) { kb.akis = pencere(tm.hKapat, tm.hKapat + 0.28); kb.hiz = 14; kb.yon = -1; }   // pes eder: sözlüğü kapatır
  }
  if (kb.kapak >= 1 && kb.akis <= 0) for (const [f, w] of GIRIS) if (Math.abs(kb.u - f) < 0.004) { kb.kelime = w; kb.nab = H.nabiz(t, tm.cumaAy) + H.nabiz(t, tm.saliAy) + H.nabiz(t, tm.hDefne) + H.nabiz(t, tm.hHikmet); }
  return kb;
}
const yRof = kb => kb.y - (KIT.C + KIT.T * (1 - kb.u));   // sağ sayfanın yüzü (y)

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  kamera(cam, t) { yolKamera(cam, t, S); },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, { ekr }) {
    const { tm } = S;
    H.mark(K, t, tm.saliVur + 0.14, tm.topla - 0.1, ekr([KURE.x - 100, KURE.y - 120]), false);        // "Olmaz!": güneşin yerinde çarpı
    H.mark(K, t, tm.kapandi + 0.1, tm.kap + 0.1, ekr([OX + KITX + 24, MASA_Y - HC - KIT.PH - 36]), true);          // kapanan sözlük: yeşil onay
  },
});

function sahne(K, t, tl, S, { heads, sc }) {
  const { tm } = S, hop = H.buldumHop(t, tm.buldum), durum = { tm }, ust = [];   // ust: nesnelerden sonra çizilecek eller
  D.ciz(K, 'arka', t, { [ODA]: { durum }, [ARS]: { durum } });

  // ——— Necmi: iki dosya sağ elinde (DEFNE arkada ve yukarıda, HİKMET önde); önce D'ye, sonra H'ye bırakır ———
  {
    const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    np.lean = H.iz([[0, 0], [tm.dBirak + 0.1, 16, 0.42], [tm.hBirak + 0.3, 0, 0.4]], t);
    H.onayla(np, t, tm.nBey - 0.05, 1, 0.4); H.onayla(np, t, tm.hBirak + 0.45, 1, 0.4);
    const yelp = pw(t, tm.nBey - 0.1, tm.dAl - 0.3, 0.3, 0.25), ara = [26 + 46 * yelp, 54 + 14 * yelp];   // "Müdür Bey": iki dosyayı yelpaze gibi ayırıp gösterir
    const el0 = [NEC_X + 140, 1010 - 22 * H.nabiz(t, tm.clue + 0.3, 0.6)], onD = [DFX, cekY(1) - 48], onH = [DFX, cekY(3) - 48];
    const dD = t < tm.dBirak ? { p: H.iz([[0, el0], [tm.dAl, onD, tm.dBirak - tm.dAl - 0.08, ease.state, 20]], t) } : { p: H.dus(t, tm.dBirak, tm.dBirak + 0.12, onD, [DFX, cekY(1) + 4]), kes: cekY(1) + ACIK };
    const hH = t < tm.dBirak + 0.06 ? { p: ekle(dD.p[1] > onD[1] ? onD : dD.p, ara) } : t < tm.hBirak ? { p: H.iz([[0, ekle(onD, [26, 54])], [tm.dBirak + 0.06, onH, tm.hBirak - tm.dBirak - 0.16]], t) } : { p: H.dus(t, tm.hBirak, tm.hBirak + 0.12, onH, [DFX, cekY(3) + 4]), kes: cekY(3) + ACIK };
    const a = oyna(K, t, tl, 'necmi', np, { heads, R: [ekle(hH.p, [4, 62]), 1 - W(t, tm.hBirak + 0.03, 0.3)] });
    dosya(K, dD, 'defne'); dosya(K, hH, 'hikmet');
    if (t < tm.hBirak + 0.05) a.tut('R');
  }

  // ——— pozlar ve nesne durumları ———
  const yolH = t >= tm.yurH && t < tm.varH, yolD = t >= tm.yurD && t < tm.varD;
  const hp = yolH ? H.yuru('hikmet', t, S.WH) : t < tm.yurH ? H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t) : H.poseAt(H.CARDS.hikmet, S.hikBaseA, S.hikA, t);
  const dp = sc.id === 'cta' ? kisi('defne', { x: DEF_A, expr: 'mutlu', head: { tilt: 8, look: [0, 0.05] }, armL: POZ.belde.armL, armR: POZ.dur.armR })
    : yolD ? H.yuru('defne', t, S.WD) : t < tm.yurD ? H.poseAt(H.CARDS.defne, S.defBase, S.def, t) : H.poseAt(H.CARDS.defne, S.defBaseA, S.defA, t);
  dp.y -= hop;
  const X = dp.x, kt = kartlar(t, S, X, yolD ? dp.bob * dp.s : 0, hop, sc), c = kt.cuma, s = kt.sali, kb = kitapAt(t, S), KX = OX + KITX;
  let ayracEl = null;   // elde taşınan ayraç: [nokta, renk]

  // ——— Hikmet'in elleri ———
  if (t < tm.yurH) {
    // sol el: kare 0'da CUMA'yı indirir · "önce"de karta dokunur · takvimi tarar · h2b'de CUMA'yı kaldırıp indirir
    const w0 = 1 - W(t, 0.7, 0.3), wT = pw(t, tm.h1Once - 0.03, tm.h1Once + 0.45), wK = pw(t, tm.h2a + 0.05, tm.h2b - 0.6, 0.3, 0.24), wC = pw(t, tm.kal - 0.1, tm.kon1 + 0.3, 0.26);
    H.reach('hikmet', hp, 'L', ekle(c.p, [-KOSE[0], KOSE[1]]), w0);
    H.reach('hikmet', hp, 'L', [P_CUMA[0] - 30, P_CUMA[1] - KH / 2 - 12 - 22 * (1 - seg(t, tm.h1Once - 0.12, 0.1))], wT);
    H.reach('hikmet', hp, 'L', [TAK.x + TAK.w - 6, TAK.y + TAK.h - 6 - 16 * takvimFiske(t, tm)], wK);
    H.reach('hikmet', hp, 'L', ekle(c.p, [-KOSE[0], KOSE[1]]), wC);
    if ((w0 > 0.5 && t < 1) || wC > 0.5 || wT > 0.5) ust.push(a => a.h.tut('L'));
    // sağ el: "Salı'dan"da SALI'ya dokunur · h2b'de SALI'yı kaldırıp indirir · h3'te CUMA'yı uzatır · hd'de SALI'yı küreye dayar
    const wS = pw(t, tm.h1Sali - 0.03, tm.h1Once + 0.55), wS2 = pw(t, tm.kal - 0.1, tm.kon2 + 0.35, 0.26), wA = t < tm.al - 0.4 || t >= tm.topla ? 0 : W(t, tm.al - 0.38) * (c.e ? c.e.verW : 1), wG = pw(t, tm.saliAl - 0.1, tm.topla + 0.24, 0.3);
    H.reach('hikmet', hp, 'R', [P_SALI[0] + 30, P_SALI[1] - KH / 2 - 12 - 20 * (1 - seg(t, tm.h1Sali - 0.12, 0.1))], wS);
    H.reach('hikmet', hp, 'R', ekle(s.p, KOSE), wS2);
    H.reach('hikmet', hp, 'R', ekle(c.p, [0, -KH / 2 - 14]), wA);
    H.reach('hikmet', hp, 'R', ekle(s.p, [-66, -34]), wG);
    if (wS > 0.5 || wS2 > 0.5 || wA > 0.5 || wG > 0.5) ust.push(a => (wA > 0.5 && t >= tm.salla) || (wG > 0.5 && t >= tm.saliVur - 0.12) ? kolUst(K, 'hikmet', hp, 'R') : a.h.tut('R'));   // uzanan kol kürenin önünde
  } else if (!yolH && kb) {
    // sağ el: sözlüğü kapatır (sol yığını sağa devirir), kendine çeker, açar; parmağı sırtın üstünden maddeyi gösterir
    const hL = KIT.C + KIT.T * kb.u, kalk = 42 * Math.sin(Math.PI * seg(t, tm.hAk - 0.05, tm.hHikmet - tm.hAk + 0.05));
    const P = izF([[0, [KX - KIT.PW + 14, MASA_Y - 132]],
      [tm.kapat, [KX - 28, MASA_Y - HC - 66], 0.2, ease.enter, 10], [tm.kapat + 0.22, () => [kb.x - 6, MASA_Y - HC - 44], 0.2],
      [tm.hAc, () => [kb.x - 20, MASA_Y - HC - 96], 0.2, ease.enter], [tm.hAc + 0.22, () => [kb.x - 62, yRof(kb) - 70], 0.25],
      [tm.hDefne - 0.16, () => [kb.x - 62, yRof(kb) - 8 - kalk], 0.14],
      [tm.hKapat - 0.22, () => [kb.x - KIT.PW + 14, MASA_Y - 104], 0.2], [tm.hKapat, () => [kb.x - 28, MASA_Y - HC - 66], 0.2, ease.enter, 10], [tm.hKapat + 0.22, () => [kb.x - 6, MASA_Y - HC - 44], 0.2]], t);
    const wR = sc.id === 'cta' ? 0 : W(t, tm.kapat - 0.3);   // son planda elini çekmiştir
    H.reach('hikmet', hp, 'R', P, wR);
    if (wR > 0.5) ust.push(a => { kolUst(K, 'hikmet', hp, 'R'); if (kb.kelime) a.h.isaret('R', [kb.x + 20, yRof(kb) - 34]); });
    void hL;
  }
  // ——— Defne'nin elleri ———
  if (sc.id === 'cta') { H.reach('defne', dp, 'R', [X + 134, 1056], 1, 'B'); ust.push(a => a.d.tut('R')); }
  else if (t < tm.yurD) {
    // sağ el: CUMA'yı alır, göğsünde tutar · sol el: küreyi çevirir, Japonya'ya basar, sonra SALI'yı alır
    const wR = c.e ? c.e.alW : 0, wF = pw(t, tm.cevir - 0.1, tm.cevir + 0.2, 0.26, 0.22), wB = pw(t, tm.bas, tm.hd + 0.8, 0.26, 0.35), wT = W(t, tm.topla - 0.3);
    H.reach('defne', dp, 'R', ekle(c.p, KOSE), wR);
    H.reach('defne', dp, 'L', [KURE.x - 20 + 80 * W(t, tm.cevir, 0.16), KURE.y + 24], wF);
    H.reach('defne', dp, 'L', JAP_EL, wB);
    H.reach('defne', dp, 'L', ekle(s.p, KOSE), wT);
    if (wR > 0.5) ust.push(a => a.d.tut('R'));
    if (wF > 0.4 || wB > 0.4) ust.push(a => { kolUst(K, 'defne', dp, 'L'); if (wB > 0.6) a.d.isaret('L', JAP); });
    else if (wT > 0.5) ust.push(a => a.d.tut('L'));
  } else if (yolD) {
    H.reach('defne', dp, 'R', ekle(c.p, [-KOSE[0], -KOSE[1]]), 1); H.reach('defne', dp, 'L', ekle(s.p, [-KOSE[0], -KOSE[1]]), 1 - W(t, tm.yurD + 3.95, 0.3));
    ust.push(a => { a.d.tut('R'); if (t < tm.yurD + 4.1) a.d.tut('L'); });
  } else if (t < tm.proof) {
    // sağ el kartlarda ("Buldum!"da havada) · sol el sözlüğü gösterir, sonra ucundan tutup çeker
    H.reach('defne', dp, 'R', [lerp(X + 62, X + 118, kt.r), lerp(1244, 962, kt.r) - hop], 1, 'B');
    const wI = W(t, tm.sozluk - 0.2, 0.25), raf = [OX + RAFX + KIT.PW / 2 + 30, RAF_Y - 40];
    H.reach('defne', dp, 'L', [OX + RAFX + KIT.PW / 2 + 30, RAF_Y + 66 - hop * 0.5], wI);
    ust.push(a => { a.d.tut('R'); if (wI > 0.6) a.d.isaret('L', raf); });
  } else if (kb) {
    // sağ el: yalnız inişte kitabın ucunda · sol el: kapağı açar, sayfaları çevirir, kutudan ayraç alıp yapıştırır
    const wR = 1 - W(t, tm.gum - 0.14, 0.22), yR = () => yRof(kb), cevir = () => [KX + KIT.PW - 8, yR() - 24 - 12 * kb.akis * Math.abs(Math.sin(t * 19))];
    const yapis = () => [KX + AX + 4, yR() + 8], cekil = () => [KX + KIT.PW + 40, yR() + 36];
    H.reach('defne', dp, 'R', [kb.x + KIT.PW + 6, kb.y - 76], wR);
    const P = izF([[0, () => [kb.x + KIT.PW - 44, kb.y - 4]],
      [tm.ac - 0.3, [KX + KIT.PW - 14, MASA_Y - HC - 18], 0.2], [tm.ac, [KX + 90, MASA_Y - HC - 126], 0.2, ease.enter], [tm.ac + 0.22, cevir, 0.28],
      [tm.cumaAy - 0.42, [PADX - 16, MASA_Y - 72], 0.2], [tm.cumaAy - 0.17, yapis, 0.17], [tm.cumaAy + 0.14, cekil, 0.22],
      [tm.akS0 - 0.1, cevir, 0.25],
      [tm.saliAy - 0.42, [PADX + 16, MASA_Y - 72], 0.2], [tm.saliAy - 0.17, yapis, 0.17], [tm.saliAy + 0.14, cekil, 0.22],
      [tm.kapat - 0.1, [KX + KIT.PW + 88, MASA_Y - 58], 0.3]], t);
    const wL = 1 - W(t, tm.h4 - 0.3, 0.35);
    H.reach('defne', dp, 'L', P, wL);
    if (t >= tm.cumaAy - 0.22 && t < tm.cumaAy) ayracEl = [[P[0] - 4, P[1] - 12], PAL.mustard];
    if (t >= tm.saliAy - 0.22 && t < tm.saliAy) ayracEl = [[P[0] - 4, P[1] - 12], PAL.coral];
    ust.push(a => { if (wR > 0.5) a.d.tut('R'); if (wL > 0.5) kolUst(K, 'defne', dp, 'L'); });
  }

  // ——— karakterler ———
  const h = oyna(K, t, tl, 'hikmet', hp, { heads });
  H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  const d = oyna(K, t, tl, 'defne', dp, { heads });

  // ——— oda: masa, kürsü, küre, kartlar ———
  masa(K, MASA.x, MASA.w); kursu(K, t, tm);
  kure(K, kureRot(t, tm), gunesAt(t, tm), 5 * H.sars(t, tm.saliVur, 0.35, 13));
  // ——— arşiv: masa, ayraç kutusu, sözlük ———
  masa(K, AMASA.x, AMASA.w);
  K.rect(PADX - 40, MASA_Y - 26, 80, 26, PAL.cream, LW * 0.8, 6);
  if (t < tm.cumaAy - 0.22) ayrac(K, [PADX - 16, MASA_Y - 66], PAL.mustard, 26, 46); if (t < tm.saliAy - 0.22) ayrac(K, [PADX + 16, MASA_Y - 66], PAL.coral, 26, 46);
  if (kb) {
    sozluk(K, kb, t);
    if (kb.kapak <= 0 && t >= tm.kapandi && t < tm.hAc) { const y0 = kb.y - HC + KIT.C, bx = kb.x + AX - 52; H.dimLine(K, [bx, y0 + F_CUMA * KIT.T + 8], [bx, y0 + F_SALI * KIT.T + 8], ease.enter(seg(t, tm.kapandi + 0.05, 0.3)), PAL.cream, 7); }   // iki ayracın arası: yüzlerce sayfa
  }
  if (ayracEl) ayrac(K, ayracEl[0], ayracEl[1], 34, 40);
  // ——— kartlar (SALI altta, CUMA üstte) ve eller ———
  kart(K, s, 'sali'); kart(K, c, 'cuma');
  for (const f of ust) f({ h, d });

  // ——— kapı: iki oda arasındaki duvarın kesiti (üst kısım); yürüyenler altından geçer ———
  K.rect(1500, -700, 56, 1340, '#1B3A3C', LW); K.rect(1490, 628, 76, 22, PAL.trim, LW, 4);
}
