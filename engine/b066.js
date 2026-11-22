// Bölüm 66 · DUVARIN ÖBÜR YANI (v4 "hikâye" dili, cevapsız tasarım; storyboard: hikayeler/bolum_066_v5.md).
// Mekanizma: Türkçede nezaket sözü, söyleyenin rolünü bildirir ("Güle güle"yi kalan söyler).
// Logline: Hikmet'in salonunda bir vazo kırılmış. Hikmet "Ben eczaneye indim" der, Necmi "Hikmet Bey evden hiç çıkmadı,
// beni kapıdan kendisi uğurladı" der. Duvar komşusu yalnız Necmi'nin sesini duyar; dün duvardan sırayla dört söz duymuş.
// Akılda kalacak tek şey: nezaket sözü, kimin gelip kimin gittiğini ele verir.
// Görsel metafor: iki odanın arasındaki tuğla duvar kesiti ve duvardan çıkıp ekranda kalan dört balon.
// Sızıntı yasağı: dört balon aynı renk, aynı punto, aynı açılış; komşu dört sözde de aynı biçimde başını çevirir.
// "Dün" kadrajında yalnız duvar ve komşunun odası vardır; Hikmet'in evinin dünü hiç gösterilmez.
// Her kare t'nin saf fonksiyonudur; Math.random yok; anlar ses çizelgesindeki çapalardan okunur.
import * as H from './hikaye.js';
import * as M from './mekan.js';
const { ease, seg, clamp01, lerp, PAL, INK, LW, oyna, POZ, IFADE } = H;
const D2R = Math.PI / 180, TAU = Math.PI * 2;

// ═══════════════════════════ Şartlar (değişmez) ═══════════════════════════
const SOZLER = ['Hoş bulduk!', 'Sen de gör!', 'Ellerine sağlık!', 'Güle güle!'];

// ═══════════════════════════ Ölçüler ═══════════════════════════
const SALON = 'b066_salon', KOMSU_ODA = 'b066_komsu', KMS_K = 'b066_komsu';
const DUV = [1000, 1090];                                    // b066_duvar: tuğla kesit (dünya x)
const HIK_X = 215, NEC_X = 640, DEF_X = 850;                // salonda duruş yerleri
const HW_X = 856, DW_X = 864;                                // duvar dibinde Hikmet / Defne
const MASA = { x: 425, w: 236, y: 1170 };                    // dantelli orta masa (tabla üstü)
const KAPI = { x: 335, y: 672, w: 190, h: 828 };
const BAL = { x: 1112, y: [622, 708, 794, 880], h: 72, boy: 42 };   // balon sütunu (dünya); 1,25x'te yazı 52 px
const KMS = { x: 1690, seat: 1240, s: 190 };                 // komşu teyze, berjer koltukta
const BUFE = { x0: 1120, x1: 1432, y: 1190 };
const YUMAK = [1492, 1474];
// kadrajlar [zoom, cx, cy]
const G = [1.42, 428, 1036];                                 // kanca: Hikmet + kırık vazo + Necmi
const DEFC = [1.5, 905, 1050];                               // Defne yakın + duvar kesiti
const HIKC = [1.5, 258, 1012];                               // Hikmet yakın
const VAZO = [1.55, 420, 1022];                              // sıkı ikili: Hikmet + masa + Necmi
const NECC = [1.55, 600, 1040];                              // Necmi yakın
const DOLL = [1.25, 1150, 962];                              // duvar kesiti: solda salonun kenarı, sağda balonlar
const KOM = [1.25, 1470, 962];                               // komşunun duvar dibi (salon kadraj dışında)
const W = (t, a, d = 0.28) => ease.state(seg(t, a, d));
const pIn = (t, a, b, d = 0.28) => W(t, a, d) * (1 - W(t, b, d));
const kar = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// ifadeler (kart ifadelerinden türetilir). Hikmet ile Necmi aynı kararlı ifadeyi kullanır.
const KARARLI = { brow: -0.01, browTilt: 0.28, eye: 0.95, pupil: 1, curve: -0.08, open: 0, w: 1 };
const KARARLI_N = { ...KARARLI, eye: 1.22 };   // Necmi'nin kartında göz kapağı daha kapalı: açıklık Hikmet'le eşitlenir (kaçamak görünmesin)
const MERAK = { brow: 0.07, browTilt: -0.12, eye: 1.1, pupil: 1, curve: 0.22, open: 0, w: 0.9 };
const exprKar = (a, b, u) => { const o = {}; for (const k of Object.keys(a)) o[k] = lerp(a[k], b[k], u); return o; };

// ═══════════════════════════ Figüran: komşu teyze (b066_komsu) ═══════════════════════════
// Kadro kartlarına dokunulmaz; figüran Defne iskeletinden türetilir. Ak topuz, okuma gözlüğü, bordo hırka.
if (!H.CARDS[KMS_K]) {
  const b = H.CARDS.defne;
  H.CARDS[KMS_K] = {
    ...b, key: KMS_K, name: 'Komşu teyze', role: 'figüran', seed: 661,
    torso: { ...b.torso, color: '#8E3B46', shade: '#74303A', belly: 0.06 },
    arm: { ...b.arm, color: '#8E3B46', shade: '#74303A' },
    leg: { ...b.leg, color: '#4A3E33', shade: '#3A3028' }, shoe: { ...b.shoe, color: '#6B4A3A' },
    skin: '#E3AF86', skinShade: '#C9946C', hair: '#E4E0D8', idle: { blink: [2.8, 5.6] },
    features: ['cardigan', 'bun', 'glassesReading', 'earrings'],
  };
}

// ═══════════════════════════ Nesneler ═══════════════════════════
// b066_duvar: tuğla duvar kesiti. İki yüzünde ince sıva; zeminin altına temel olarak iner.
function duvarKesit(K) {
  const { ctx } = K, [x0, x1] = DUV, w = x1 - x0;
  K.rect(x0, -900, w, 3600, '#B9583C', 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, -900, w, 3600); ctx.clip();
  for (let r = 0, y = -900; y < 2700; y += 42, r++) {
    K.line(x0, y, x1, y, 4, '#EAD9BC');
    const u = r % 2 ? 0.32 : 0.7; K.line(x0 + w * u, y, x0 + w * u, y + 42, 4, '#EAD9BC');
  }
  ctx.restore();
  K.rect(x0, -900, 11, 3600, '#EDE1C8', 0); K.rect(x1 - 11, -900, 11, 3600, '#F3E6CC', 0);   // sıva
  K.line(x0, -900, x0, 2700, LW); K.line(x1, -900, x1, 2700, LW);
}
// Konuşma balonu (dünya): sol kenarı BAL.x, kuyruğu duvarın yüzüne değer. a: açılış 0..1 (yay 320/30). Dördü de aynı biçim.
function balonW(K, i) { const { ctx } = K; ctx.font = `800 ${BAL.boy}px Rubik`; return ctx.measureText(SOZLER[i]).width + 52; }
function balon(K, i, a) {
  if (a <= 0.001) return;
  const { ctx } = K, w = balonW(K, i), h = BAL.h, x = BAL.x, y = BAL.y[i], yc = y + h / 2, uc = [DUV[1] + 3, yc];
  ctx.save(); ctx.translate(uc[0], uc[1]); ctx.scale(a, a); ctx.translate(-uc[0], -uc[1]);
  ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.roundRect(x + 6, y + 8, w, h, h / 2); ctx.fillStyle = INK; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 6, yc - 15); ctx.lineTo(uc[0], uc[1]); ctx.lineTo(x + 6, yc + 15); ctx.closePath();
  ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 5, yc - 11); ctx.lineTo(x + 5, yc + 11); ctx.lineWidth = LW + 3; ctx.strokeStyle = '#FFFFFF'; ctx.stroke();
  K.text(SOZLER[i], x + w / 2, yc + BAL.boy * 0.36, BAL.boy, INK, 800);
  ctx.restore();
}
// Ses izi: söz duvardan çıkarken duvar yüzünde iki yay bir kez açılıp söner (dördünde de aynı)
function sesIzi(K, t, a, yc) {
  const u = seg(t, a - 0.05, 0.42); if (u <= 0 || u >= 1) return;
  const { ctx } = K; ctx.save(); ctx.globalAlpha = 1 - u; ctx.lineCap = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = INK;
  for (const r of [22, 40]) { ctx.beginPath(); ctx.arc(DUV[1] - 4, yc, r + 26 * ease.enter(u), -0.62, 0.62); ctx.stroke(); }
  ctx.restore();
}
// Dantelli orta masa ve kırık vazo. sal: büyük parçanın sallanması (−1..1)
const VAZO_R = '#2F7F7A', VAZO_BANT = '#F4EDE0', VAZO_IC = '#1C4B48';
function masaCiz(K, t, sal) {
  const { ctx } = K, { x, w, y } = MASA;
  K.ell(x + 92, 1503, 30, 7, '#BFE0E0', 3);                                         // yerdeki su
  K.rect(x - 15, y + 20, 30, 1500 - y - 50, PAL.woodDark, LW, 6);                    // ayak
  K.poly([[x - 78, 1500], [x - 44, 1458], [x + 44, 1458], [x + 78, 1500]], PAL.wood, LW);
  K.rect(x - w / 2, y, w, 26, PAL.woodTop, LW, 8);                                    // tabla
  // dantel örtü: tablanın önünden sarkan oymalı kenar
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 12, y + 3);
  const n = 7, dw = (w - 24) / n;
  for (let i = 0; i < n; i++) { const a = x - w / 2 + 12 + i * dw; ctx.quadraticCurveTo(a + dw / 2, y + 62, a + dw, y + 3); }
  ctx.closePath(); K.fs('#FBF6EC', LW * 0.7);
  for (let i = 0; i < n; i++) K.circ(x - w / 2 + 12 + (i + 0.5) * dw, y + 20, 5, '#D8CDB6', 0);
  K.ell(x + 40, y + 2, 70, 6, '#BFE0E0', 3);                                          // masadaki su
  H.damlaDongu(K, x + 92, y + 34, 1494, t, { periyot: 1.25, r: 8 });
  // çiçekler: saplar masaya yatmış, başları masanın iki ucundan sarkıyor
  const bx = x + 2;
  for (const [x1, y1] of [[x + 126, y - 6], [x - 124, y - 8]]) { K.line(bx, y - 30, x1, y1, 9, '#3F6E35'); K.line(bx, y - 30, x1, y1, 5, PAL.green); }
  for (const [fx, fy, c] of [[x + 132, y - 4, PAL.coral], [x - 132, y - 8, PAL.mustard]]) {
    for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + 0.3; K.circ(fx + Math.cos(a) * 15, fy + Math.sin(a) * 15, 12, c, 3.5); }
    K.circ(fx, fy, 9, '#F6E3BC', 3.5);
  }
  // vazonun gövdesi: ayakta kalmış, ağzı kırık (karınlı, sırlı seramik; iki krem kuşak)
  K.poly([[bx - 30, y - 60], [bx + 30, y - 60], [bx + 44, y - 92], [bx - 44, y - 84]], VAZO_IC, 0);   // kırık ağızdan görünen iç
  K.poly([[bx - 32, y], [bx + 32, y], [bx + 52, y - 40], [bx + 50, y - 96], [bx + 32, y - 72], [bx + 16, y - 128], [bx - 4, y - 78], [bx - 26, y - 118], [bx - 50, y - 86], [bx - 54, y - 40]], VAZO_R, LW);
  K.line(bx - 50, y - 36, bx + 50, y - 36, 9, VAZO_BANT); K.line(bx - 44, y - 18, bx + 44, y - 18, 5, VAZO_BANT);
  K.line(bx - 4, y - 78, bx - 12, y - 56, 3.5); K.line(bx - 12, y - 56, bx - 2, y - 44, 3.5); K.line(bx + 32, y - 72, bx + 26, y - 50, 3.5);   // çatlaklar
  // vazonun boynu: masaya devrilmiş, ağız kenarı solda; 0,3 sn'de sallanıp oturur (ilk hareket)
  ctx.save(); ctx.translate(x - 76, y); ctx.rotate((8 - sal * 16) * D2R); ctx.translate(0, -27);
  K.poly([[40, -24], [28, -8], [38, 6], [26, 24], [-22, 18], [-38, 30], [-46, 30], [-46, -30], [-38, -30], [-22, -18]], VAZO_R, LW);
  K.line(22, -17, 22, 19, 7, VAZO_BANT); K.ell(-46, 0, 7, 30, VAZO_IC, LW * 0.7);
  ctx.restore();
  // sağ yanda iki küçük, yatık parça
  K.poly([[x + 62, y - 2], [x + 94, y - 2], [x + 86, y - 24], [x + 68, y - 16]], VAZO_R, LW * 0.8);
  K.poly([[x + 100, y - 2], [x + 114, y - 2], [x + 110, y - 14]], VAZO_R, LW * 0.7);
}
// Defne'nin not defteri (sol elde) ve kalemi
function defter(K, [hx, hy]) {
  const { ctx } = K; ctx.save(); ctx.translate(hx - 6, hy - 26); ctx.rotate(-7 * D2R);
  K.rect(-36 + 5, -50 + 6, 72, 100, INK, 0, 6); K.rect(-36, -50, 72, 100, '#FBF6EC', LW * 0.8, 6);
  for (let i = 0; i < 5; i++) K.circ(-24 + i * 12, -50, 5, '#8FA093', 2.5);
  for (let i = 0; i < 4; i++) K.line(-24, -26 + i * 18, 22 - (i % 2) * 14, -26 + i * 18, 4, '#9FAAA3');
  ctx.restore();
}
function kalem(K, [hx, hy], uc) {
  const d = H.unit([hx, hy], uc), a = [hx - d[0] * 22, hy - d[1] * 22], b = [hx + d[0] * 54, hy + d[1] * 54];
  K.line(a[0], a[1], b[0], b[1], 13, INK); K.line(a[0], a[1], b[0], b[1], 8, PAL.mustard);
  K.line(b[0] - d[0] * 10, b[1] - d[1] * 10, b[0], b[1], 6, INK);
}
// Çay bardağı (ince belli) ve buharı
function cay(K, x, yb, t) {
  K.ell(x, yb + 1, 24, 5, PAL.cream, 2.5);
  K.poly([[x - 15, yb - 36], [x + 15, yb - 36], [x + 10, yb - 20], [x + 13, yb - 5], [x + 11, yb], [x - 11, yb], [x - 13, yb - 5], [x - 10, yb - 20]], '#A8401F', 2.6);
  H.buhar(K, x, yb - 42, t, { k: 0.36, n: 2, ara: 9, boy: 54 });
}

// ═══════════════════════════ Mekânlar ═══════════════════════════
const KOMSU_I = { ...M.ISIK.gunduz, duvar: '#C98C68', bant: '#B07552', trim: '#F3E6CC', zemin: '#B79A72', zeminCizgi: '#9C8160' };
M.mekanEkle(SALON, {
  gen: [-700, DUV[0]], dongu: ['masadan damlayan su', 'duvar saati', 'pencerede martı'],
  capa: { masa: [MASA.x, MASA.y], kapi: [KAPI.x + KAPI.w / 2, KAPI.y + 200] }, kadraj: { grup: G, hikmet: HIKC, necmi: NECC, vazo: VAZO },
  arka(K, t, { isik }) {
    M.oda(K, { x0: -800, x1: DUV[0], isik, duvar: 'cizgili', zemin: 'ahsap' });
    M.pencere(K, -190, 650, 250, 330, { isik, t });
    K.rect(-214, 986, 298, 22, isik.trim, LW, 4);                                   // pencere pervazı
    M.kapi(K, KAPI.x, KAPI.y, KAPI.w, KAPI.h, { acik: 0, isik });
    K.rect(KAPI.x + 30, KAPI.y + 60, KAPI.w - 60, 250, null, LW * 0.6, 6); K.rect(KAPI.x + 30, KAPI.y + 370, KAPI.w - 60, 400, null, LW * 0.6, 6);   // kapı tablaları
    M.duvarSaati(K, 600, 800, 46, 15.3 + t / 60, t);
    K.rect(-420, 1250, 190, 250, PAL.wood, LW, 8);                                    // köşe sehpası (yakın planlarda kadraj dışı)
  },
});
M.mekanEkle(KOMSU_ODA, {
  gen: [DUV[1], 2400], dongu: ['örgü şişleri', 'yün yumağı', 'çay buharı', 'pencerede martı'],
  capa: { koltuk: [KMS.x, KMS.seat], balon: [BAL.x, BAL.y[0]] }, kadraj: { dun: KOM, kesit: DOLL },
  arka(K, t) {
    const { ctx } = K;
    M.oda(K, { x0: DUV[1], x1: 2600, isik: KOMSU_I, duvar: 'cizgili', zemin: 'karo' });
    // pencere ve tül
    const p = M.pencere(K, 1596, 722, 200, 160, { isik: M.ISIK.gunduz, t: t + 4 });
    ctx.save(); ctx.globalAlpha = 0.78; ctx.beginPath(); ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 92, p.y); ctx.quadraticCurveTo(p.x + 84, p.y + 108, p.x + 26, p.y + p.h); ctx.lineTo(p.x, p.y + p.h); ctx.closePath(); ctx.fillStyle = '#FBF6EC'; ctx.fill(); ctx.restore();
    K.rect(p.x - 26, p.y - 34, p.w + 52, 20, '#8C6A44', LW, 8);                       // korniş
    // halı
    K.ell(1560, 1574, 380, 50, PAL.teal, LW); K.ell(1560, 1574, 320, 36, '#E9DCC2', 0); K.ell(1560, 1574, 262, 26, PAL.teal, 0);
    // büfe: iki kapak, üstünde dantel, radyo, çerçeve, çay, saksı
    const { x0, x1, y } = BUFE, bw = x1 - x0;
    K.rect(x0 + 6, y + 20, bw - 12, 1500 - y - 20, '#9C7146', LW, 6);
    for (const k of [0, 1]) { K.rect(x0 + 22 + k * (bw / 2 - 12), y + 46, bw / 2 - 34, 1500 - y - 80, '#B98A57', LW * 0.6, 6); K.circ(x0 + bw / 2 + (k ? 14 : -14), y + 150, 7, PAL.mustard, 3); }
    K.rect(x0, y, bw, 26, '#B98A57', LW, 8);
    ctx.beginPath(); ctx.moveTo(x0 + 40, y + 2);
    for (let i = 0; i < 5; i++) { const a = x0 + 40 + i * 46; ctx.quadraticCurveTo(a + 23, y + 44, a + 46, y + 2); }
    ctx.closePath(); K.fs('#FBF6EC', LW * 0.6);
    // radyo
    K.rect(x0 + 24, y - 82, 128, 82, '#E9DCC2', LW, 12);
    for (let i = 0; i < 4; i++) K.line(x0 + 40, y - 64 + i * 13, x0 + 96, y - 64 + i * 13, 4, '#9C7146');
    K.circ(x0 + 124, y - 54, 13, PAL.mustard, 3); K.circ(x0 + 124, y - 22, 8, '#9C7146', 3);
    K.line(x0 + 44, y - 82, x0 + 20, y - 150, 4);
    // çerçeve
    K.rect(x0 + 176, y - 78, 58, 78, '#8C6A44', LW * 0.8, 4); K.rect(x0 + 186, y - 68, 38, 52, '#E8C9A0', 0); K.circ(x0 + 205, y - 46, 10, '#C9946C', 0);
    // saksı
    K.poly([[x1 - 62, y - 44], [x1 - 14, y - 44], [x1 - 22, y], [x1 - 54, y]], PAL.coral, LW * 0.8);
    for (const [a, L] of [[-0.55, 78], [0, 96], [0.5, 74]]) H.yaprak(K, x1 - 38, y - 44, L, a + 0.03 * Math.sin(t * 1.1 + a * 5), PAL.green, 1);
    cay(K, x0 + 256, y - 2, t);
  },
});

// Komşu teyze: berjerde, önden; örgü örer. dinle 0..1: başını duvara çevirir, şişler durur. orgu: örgünün boyu 0..1
function komsuCiz(K, t, { dinle = 0, orgu = 0.4 } = {}) {
  const { ctx } = K, key = KMS_K, c = H.CARDS[key], s = KMS.s, x = KMS.x, SEAT = KMS.seat;
  const KOLTUK = '#E9DCC2', KOLTUK_G = '#CDBF9F';
  // koltuğun sırtı ve gövdesi
  K.rect(x - 140, SEAT - 318, 280, 360, KOLTUK, LW, 54);
  for (const dx of [-62, 0, 62]) K.circ(x + dx, SEAT - 232, 6, KOLTUK_G, 0);
  K.rect(x - 122, SEAT + 6, 244, 1500 - SEAT - 40, KOLTUK_G, LW, 8);
  for (const dx of [-108, 108]) K.rect(x + dx - 11, 1466, 22, 34, PAL.woodDark, LW * 0.8, 4);
  // minder ve ayak taburesi
  K.rect(x - 128, SEAT - 4, 256, 46, KOLTUK, LW, 18);
  const kneeY = SEAT + 0.14 * s, etek = 1394, ayakY = 1412;
  K.rect(x - 98, ayakY + 2, 196, 1500 - ayakY - 24, PAL.teal, LW, 14);
  for (const dx of [-70, 70]) K.rect(x + dx - 9, 1476, 18, 24, PAL.woodDark, LW * 0.8, 4);
  // poz
  const expr = exprKar(H.EXPR.notr, MERAK, dinle);
  const p = H.charBase(key, {
    view: 'front', x, y: 0, s, legL: { hip: 14, knee: 176 }, legR: { hip: 14, knee: 176 },
    head: { tilt: lerp(3, -13, dinle), look: [lerp(0.05, -0.95, dinle), lerp(0.8, -0.2, dinle)], nod: 0 }, expr,
  });
  p.y = SEAT - 0.02 * s - H.eklem(key, p, 'pelvis')[1];
  const nk = H.eklem(key, p, 'neck'), pl = H.eklem(key, p, 'pelvis'), yK = lerp(nk[1], pl[1], 0.6);
  const calis = 1 - dinle, f = Math.sin(t * TAU * 1.7), g = Math.sin(t * TAU * 1.7 + 1.2);
  const eL = [x - 0.2 * s + 8 * f * calis, yK + 7 * g * calis], eR = [x + 0.2 * s - 8 * f * calis, yK - 7 * g * calis];
  H.reach(key, p, 'L', eL, 1, 'B'); H.reach(key, p, 'R', eR, 1, 'B');
  // bacaklar: uzun etek minderin ucundan (dizlerden) aşağı sarkar, ayaklar taburede
  for (const sx of [-1, 1]) {
    const fx = x + sx * 0.2 * s;
    K.line(fx, etek - 8, fx, ayakY - 0.05 * s, c.leg.w * 0.8 * s + LW * 2, INK); K.line(fx, etek - 8, fx, ayakY - 0.05 * s, c.leg.w * 0.8 * s, c.skin);
    K.ell(fx + sx * 0.03 * s, ayakY - 0.03 * s, c.shoe.len * 0.42 * s, c.shoe.h * 0.62 * s, c.shoe.color, LW * 0.8);
  }
  K.poly([[pl[0] - 0.36 * s, pl[1] - 0.08 * s], [pl[0] + 0.36 * s, pl[1] - 0.08 * s], [x + 0.47 * s, kneeY], [x + 0.41 * s, etek], [x - 0.41 * s, etek], [x - 0.47 * s, kneeY]], c.leg.color, LW);
  K.line(x - 0.4 * s, kneeY + 6, x + 0.4 * s, kneeY + 6, LW * 0.6, c.leg.shade); K.line(x, kneeY + 10, x, etek - 8, LW * 0.6, c.leg.shade);   // diz çizgisi ve etek kıvrımı
  ctx.save(); ctx.beginPath(); ctx.rect(x - 3 * s, -5000, 6 * s, pl[1] + 0.02 * s + 5000); ctx.clip();
  const r = H.drawChar(ctx, key, p, t);
  ctx.restore();
  // koltuğun kolları (gövdenin önünde)
  for (const sx of [-1, 1]) K.rect(x + sx * 146 - 29, SEAT - 70, 58, 1500 - SEAT + 36, KOLTUK, LW, 22);
  // örgü: iki elin arasından kucağa sarkar
  const boy = lerp(0.3, 0.74, orgu) * s, ust = (r.handL[1] + r.handR[1]) / 2 + 4;
  ctx.save(); ctx.beginPath(); ctx.moveTo(r.handL[0] + 6, ust); ctx.lineTo(r.handR[0] - 6, ust); ctx.lineTo(r.handR[0] - 2, ust + boy); ctx.lineTo(r.handL[0] + 2, ust + boy); ctx.closePath();
  K.fs('#FBF6EC', LW * 0.8); ctx.clip();
  for (let yy = ust + 16; yy < ust + boy; yy += 30) K.line(r.handL[0] - 10, yy, r.handR[0] + 10, yy, 9, PAL.coral);
  ctx.restore();
  // yün ipi: örgünün alt köşesinden yerdeki yumağa
  const yum = yumakAt(t), ip0 = [r.handL[0] + 4, ust + boy - 4];
  ctx.beginPath(); ctx.moveTo(ip0[0], ip0[1]); ctx.quadraticCurveTo(ip0[0] - 70, 1500, yum[0] + 10, yum[1] + 12);
  ctx.lineWidth = 5; ctx.strokeStyle = PAL.coral; ctx.lineCap = 'round'; ctx.stroke();
  // şişler
  const sal = 0.085 * s * f * calis;
  for (const [el, sx] of [[r.handL, 1], [r.handR, -1]]) {
    const uc = [el[0] + sx * (0.36 * s) + sx * sal, el[1] - 0.44 * s - sal * 0.6], dip = [el[0] - sx * 0.1 * s, el[1] + 0.12 * s];
    K.line(dip[0], dip[1], uc[0], uc[1], 9, INK); K.line(dip[0], dip[1], uc[0], uc[1], 5, '#C9CDC6');
    K.circ(dip[0], dip[1], 6, PAL.mustard, 3);
  }
  H.grip(K, key, r.handL, s); H.grip(K, key, r.handR, s);
  return r;
}
// Yün yumağı: yerde ağır ağır yuvarlanır (döngü)
const yumakAt = t => [YUMAK[0] + 46 * Math.sin(t * 1.25), YUMAK[1]];
function yumakCiz(K, t) {
  const { ctx } = K, [x, y] = yumakAt(t), r = 26, rot = 46 * Math.sin(t * 1.25) / r;
  K.circ(x, y, r, PAL.coral, LW * 0.8);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, r - 3, 0, TAU); ctx.clip();
  for (const o of [-14, 0, 14]) { ctx.beginPath(); ctx.ellipse(o, 0, 9, r + 6, 0.5, 0, TAU); ctx.lineWidth = 3.5; ctx.strokeStyle = '#B84D31'; ctx.stroke(); }
  ctx.restore();
}

// ═══════════════════════════ build ═══════════════════════════
export function build(ep, tl) {
  const T = e => H.at(tl, e), cd = T(ep.countdown), cd0 = cd - (ep.cdSure || 10);
  const ln = ep.voice.lines.find(l => l.id === 'n0b');
  if (ln.text !== SOZLER.join(' ')) throw new Error('b066: dört söz replik metniyle aynı değil');
  const soz = ln.soz.map(v => tl.L.n0b.t0 + v);                // dört sözün ölçülmüş başlangıcı (sesin enerjisinden)
  const tm = {
    cd, cd0, end: T('d6>') + 0.1, buldum: T('d3'), proof: T('d3>') + 0.05, soz,
    sal: 0.3, kes1: T('d1:3') - 0.12, dort: T('d1:4'),
    h1: T('h1'), hNecmi: T('h1:3'), hBen: T('h1:5'), ecz: T('h1:8'), dondu: T('h1:10'), kirik: T('h1:12'),
    n0: T('n0'), hic: T('n0:3'), kalk: T('n0:5'), kapidan: T('n0:7'), ugur: T('n0:9'), n0s: T('n0>'),
    d2: T('d2'), dHik: T('d2:2'), dNec: T('d2:6'), dun: T('d2:8') - 0.04,
    h3: T('h3'), nez: T('h3:1'), kimin: T('h3:3'), gost: T('h3:6'),
    n1: T('n1'), n1b: T('n1:5'), n1s: T('n1>'), n1soy: T('n1:4'), hangi: T('n1:7'), olab: T('n1:10'), d4n: T('d4:4'), d4g: T('d4:7'), d4k: T('d4:10'), cevap: T('d3>') + 0.25, gule: T('d4'), cta: T('d6') - 0.15,
  };
  tm.don = tm.h3 - 0.62;                                       // geri dönüşten çıkış: 0,5 sn'lik kayış burada başlar
  tm.tik = [tm.h3 + 0.14, tm.nez + 0.12];                      // Hikmet duvara vurur
  tm.dinleTik = [cd0 + 1.7, cd0 + 2.2];                        // sayaçta kulağı duvarda, iki kez tıklatır
  tm.kay1 = cd0 + 3.4; tm.kay2 = cd0 + 8.3;                    // sayaçta kayışlar
  tm.swap = cd0 + 6.2;                                         // salon kadraj dışındayken duvar dibine Defne gelir
  tm.komBak = cd0 + 6.3;                                       // komşu bir kez duvara bakar

  const film = H.sahneler([
    { id: 'kanca', t0: 0, cam: [[0, ...G]] },
    { id: 'defne', t0: tm.kes1, cam: [[0, ...DEFC], [tm.dort + 0.5, 1.53, 907, 1048]] },
    { id: 'hikmet', t0: tm.h1 - 0.1, cam: [[0, ...HIKC], [tm.ecz - 0.3, 1.53, 268, 1008]] },
    { id: 'vazo', t0: tm.dondu - 0.1, cam: [[0, ...VAZO]] },
    { id: 'necmi', t0: tm.n0 - 0.1, cam: [[0, ...NECC], [tm.kalk - 0.2, 1.58, 590, 1037]] },
    { id: 'dw', t0: tm.d2 - 0.1, cam: [[0, 1.5, 908, 1050]] },
    { id: 'dun', t0: tm.dun, geri: true, cam: [[0, ...KOM]] },                         // kamera() sabitler
    { id: 'duvar', t0: tm.don, kesme: false, cam: [[0, ...DOLL]] },                    // h3 + sayaç + ipucu; kamera() kapalı formül
    { id: 'buldum', t0: tm.buldum - 0.05, kisa: true, cam: [[0, 1.35, 900, 1012]] },
    { id: 'cevap', t0: tm.cevap, cam: [[0, ...DOLL]] },
    { id: 'cta', t0: tm.cta, kesme: false, cam: [[0, ...DOLL], [tm.cta + 0.5, 1.4, 930, 1040]] },
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();

  // altyazı çizelgesi: n0b'nin altyazısı yok (söz balonda yazılı; altyazı dördünü birden gösterirdi);
  // n1 son repliktir (cevapsız kesim): altyazısı "Buldum!"a kadar ekranda kalır
  // (yerleşik altyazı son 0,12 sn'de solar; solma kesimden sonraya kalsın diye arşivdeki d3 altyazısı 0,1 sn geç başlar)
  // d2'nin ikinci cümlesi ("Dün sırayla…") geri dönüşün üstüne düşer: yerleşik altyazı komşunun ellerini örtüyordu; o cümle ekran()'da solda çizilir
  const tlA = { ...tl, lines: tl.lines.filter(l => l.id !== 'n0b').map(l => l.id === 'n1' ? { ...l, t1: T('d3') } : l.id === 'd3' ? { ...l, t0: l.t0 + 0.1 }
    : l.id === 'd2' ? { ...l, text: l.text.split(' ').slice(0, 8).join(' '), words: l.words.slice(0, 8), t1: tm.dun - 0.3 } : l) };

  // ——— pozlar (önden) ———
  const hikBase = H.kisi('hikmet', { x: HIK_X, expr: KARARLI, head: { tilt: 4, look: [0.85, 0.05] }, ...POZ.dur });
  const hik = [
    [tm.h1 - 0.1, { head: { tilt: 2, look: [0.3, 0.0] } }, 0.01],
    [tm.hNecmi - 0.25, { head: { tilt: 5, look: [0.9, 0.05] } }, 0.25],
    [tm.hBen - 0.15, { head: { tilt: -2, look: [0.08, 0.0] } }, 0.25],
    [tm.ecz - 0.3, { head: { tilt: 4, look: [0.7, -0.45] } }, 0.3],
    [tm.dondu - 0.1, { head: { tilt: 4, look: [0.55, 0.8] } }, 0.01],
    [tm.kirik + 0.1, { head: { tilt: 5, look: [0.9, 0.15] } }, 0.3],
    [tm.don - 0.02, { x: HW_X, expr: KARARLI, head: { tilt: 3, look: [0.6, 0.05] } }, 0.01],
    [tm.kimin - 0.15, { head: { tilt: -3, look: [0.05, 0.0] } }, 0.3],
    [tm.gost - 0.1, { expr: MERAK }, 0.3],
    [cd0 + 0.25, { x: HW_X + 24, expr: IFADE.dusun, head: { tilt: 13, look: [0.85, -0.15] } }, 0.5],
    [cd0 + 2.45, { x: HW_X, expr: MERAK, head: { tilt: -3, look: [0.05, 0.0] } }, 0.4],   // ses yok: duvardan çekilir, kameraya bakar
  ];
  const necBase = H.kisi('necmi', { x: NEC_X, expr: KARARLI_N, head: { tilt: -4, look: [-0.85, -0.15] }, ...POZ.dur });
  const nec = [
    [tm.dondu - 0.1, { head: { tilt: -3, look: [-0.5, 0.7] } }, 0.01],
    [tm.kirik + 0.05, { head: { tilt: -5, look: [-0.9, -0.2] } }, 0.3],
    [tm.n0 - 0.1, { head: { tilt: -3, look: [-0.75, -0.15] } }, 0.01],
    [tm.kalk - 0.15, { head: { tilt: 2, look: [0.0, 0.0] } }, 0.3],
    [tm.kapidan - 0.25, { head: { tilt: -5, look: [-0.8, -0.45] } }, 0.3],
    [tm.ugur, { head: { tilt: 2, look: [0.05, 0.0] } }, 0.3],
  ];
  const defBase = H.kisi('defne', { x: DEF_X, expr: 'notr', head: { tilt: -4, look: [0.05, 0.0] }, ...POZ.dur });
  const def = [
        [tm.kes1, { head: { tilt: -4, look: [0.05, 0.0] } }, 0.01],
    [tm.dort - 0.2, { expr: MERAK, head: { tilt: 3, look: [0.05, 0.0] } }, 0.3],
    [tm.d2 - 0.1, { expr: 'notr', head: { tilt: 5, look: [0.85, 0.0] } }, 0.01],
    [tm.dHik - 0.15, { head: { tilt: -4, look: [-0.8, 0.0] } }, 0.3],
    [tm.dNec - 0.1, { head: { tilt: 2, look: [0.05, 0.0] } }, 0.3],
    [tm.swap, { x: DW_X, expr: IFADE.dusun, head: { tilt: 5, look: [0.8, -0.4] } }, 0.01],
    [tm.n1 - 0.2, { expr: 'notr', head: { tilt: 4, look: [0.8, -0.3] } }, 0.3],
    [tm.n1b - 0.15, { expr: MERAK, head: { tilt: -5, look: [0.05, 0.0] } }, 0.35],
    [tm.hangi - 0.1, { head: { tilt: 4, look: [0.12, 0.05] } }, 0.3],
    [tm.olab - 0.1, { head: { tilt: -4, look: [0.0, 0.0] } }, 0.3],
    [tm.n1s + 0.1, { head: { tilt: 6, look: [0.85, -0.35] } }, 0.35],            // replik bitti: bir kez duvara (sütunun bütününe) bakar
    [tm.n1s + 0.56, { head: { tilt: -4, look: [0.05, 0.0] } }, 0.3],             // yine kameraya: soru izleyicide
    [tm.buldum - 0.05, { expr: 'mutlu', head: { tilt: -6, look: [0.2, -0.3] }, ...POZ.yukari }, 0.25, ease.enter],
    [tm.cevap, { expr: 'mutlu', armR: POZ.dur.armR, head: { tilt: 5, look: [0.85, -0.1] } }, 0.01],
    [tm.d4n - 0.1, { head: { tilt: -4, look: [0.05, 0.0] } }, 0.3],
    [tm.d4g - 0.1, { head: { tilt: 5, look: [0.85, -0.1] } }, 0.3],
    [tm.d4k - 0.1, { head: { tilt: -3, look: [0.05, 0.0] } }, 0.3],
    [tm.cta, { head: { tilt: -5, look: [0.05, 0.05] } }, 0.4],
  ];
  return { tm, film, tlA, hikBase, hik, necBase, nec, defBase, def };
}

// Kamera: komşu kadrajının ağırlığı (0 = duvar kesiti, 1 = komşunun duvar dibi). Kapalı formül; kayışlar doğrusal.
function komK(S, t) {
  const { tm } = S, u = t - tm.cd0;
  if (t < tm.don) return 1;
  if (t < tm.don + 0.5) return 1 - (t - tm.don) / 0.5;
  if (u < 3.4) return 0;
  if (u < 5.2) return (u - 3.4) / 1.8;
  if (u < 8.3) return 1;
  if (u < 9.5) return 1 - (u - 8.3) / 1.2;
  return 0;
}
const balA = (t, a) => t < a ? 0 : Math.min(1, H.spring(t - a, H.UI[0], H.UI[1]));

// ═══════════════════════════ draw ═══════════════════════════
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, S.tlA, S, {
  kartSon: -1,   // kart ve sayaç ekran katmanında (sayaç bu bölümde alt bantta, perdesiz)
  kuyruksuz: (t, B) => B.sc.id === 'dun',
  kamera(cam, t, B) {
    const id = B.sc.id;
    if (id === 'dun') Object.assign(cam, { zoom: KOM[0], cx: KOM[1], cy: KOM[2] });
    if (id === 'duvar') Object.assign(cam, { zoom: DOLL[0], cx: lerp(DOLL[1], KOM[1], komK(S, t)), cy: DOLL[2] });
    if (id === 'cevap') Object.assign(cam, { zoom: DOLL[0], cx: DOLL[1], cy: DOLL[2] });
  },
  dunya(K, t, B) { sahne(K, t, tl, S, B); },
  ekran(K, t, B) {
    const { tm } = S, id = B.sc.id;
    if (t < tm.proof) H.riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 54 });
    if (id === 'dw') H.saatRozet(K, t, tm.dun, { x: 868, y: 632, r: 58, saat: 15.4 });
    if (id === 'dun') H.zamanHapi(K, t, tm.dun + 0.2, tm.don - 0.05, 'DÜN', { x: 800, y: 566, saat: 15.4 });
    const d2 = tl.L.d2, d2b = d2.t1 + 0.3;
    if (t >= tm.dun && t < d2b) { K.ctx.save(); K.ctx.translate(-150, 0); H.caption(K, { line: d2, text: d2.text.split(' ').slice(8).join(' '), age: t - tm.dun, left: d2b - t }, { y: 1255, head: null }); K.ctx.restore(); }
    sayac(K, t, tm.cd, { share: ep.cdShare, dur: ep.cdSure || 10 });
  },
});

// "SEN DE DÜŞÜN!" sayacı (bölüme özel yerleşim): balonlar ve komşunun elleri açık kalsın diye alt bantta, solda; perde yok.
function sayac(K, t, t1, { share = null, dur = 10 } = {}) {
  const t0 = t1 - dur;
  if (t < t0 - 0.3 || t >= t1 + 0.35) return;
  const { ctx } = K, inU = H.spring(t - (t0 - 0.25), H.UI[0], H.UI[1]), out = 1 - ease.exit(seg(t, t1, 0.3));
  const left = Math.max(0, t1 - t), n = Math.min(dur, Math.ceil(left - 1e-6)), since = 1 - (left % 1 || 1);
  const pulse = 1 + 0.16 * (1 - ease.enter(clamp01(since / 0.35)));
  const hot = n <= 3, x = 162, y = 1268, r = 64;
  ctx.save(); ctx.translate(x, y); ctx.scale(inU * out, inU * out);
  K.circ(8, 10, r, INK, 0); K.circ(0, 0, r, PAL.paper, LW);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 11, -Math.PI / 2, -Math.PI / 2 + TAU * (left / dur)); ctx.closePath();
  ctx.fillStyle = hot ? PAL.coral : PAL.mustard; ctx.fill();
  K.circ(0, 0, r * 0.66, PAL.paper, LW * 0.8);
  ctx.save(); ctx.scale(pulse, pulse); K.text(String(Math.max(n, 0)), 0, 21, 58, hot ? PAL.red : INK, 900); ctx.restore();
  ctx.restore();
  ctx.font = '900 48px Rubik'; const bw = ctx.measureText('SEN DE DÜŞÜN!').width + 58, bx = 248 + bw / 2;
  ctx.save(); ctx.translate(bx, y); ctx.scale(inU * out, inU * out);
  K.rect(-bw / 2 + 8, -38 + 9, bw, 76, INK, 0, 38); K.rect(-bw / 2, -38, bw, 76, PAL.mustard, LW, 38);
  K.text('SEN DE DÜŞÜN!', 0, 17, 48, INK, 900);
  ctx.restore();
  if (share && t >= t0 + 0.9) {
    ctx.font = '900 44px Rubik'; const sw = ctx.measureText(share).width + 56, sx = 96 + sw / 2;
    const v = H.spring(t - (t0 + 0.9), H.UI[0], H.UI[1]) * out; ctx.save(); ctx.translate(sx, 1372); ctx.scale(0.7 + 0.3 * v, 0.7 + 0.3 * v); ctx.globalAlpha = clamp01(v * 1.6);
    K.rect(-sw / 2 + 8, -38 + 9, sw, 76, INK, 0, 38); K.rect(-sw / 2, -38, sw, 76, PAL.coral, LW, 38); K.text(share, 0, 15, 44, PAL.paper, 900);
    ctx.restore();
  }
}

// Duvara vurma: el tk anından 0,2 sn önce geri çekilir, tk'da duvara değer (temas karesinde durur)
const vurus = (t, tiks) => tiks.reduce((v, tk) => v + Math.sin(Math.PI * seg(t, tk - 0.2, 0.2)), 0);

function sahne(K, t, tl, S, B) {
  const { tm } = S, { heads, sc } = B, id = sc.id;

  // ——— mekânlar: salon, komşunun odası, aradaki duvar ———
  M.mekanCiz(K, SALON, 'arka', t, { isik: M.ISIK.gunduz });
  M.mekanCiz(K, KOMSU_ODA, 'arka', t, {});
  duvarKesit(K);

  // ——— komşu teyze: dün her sözde başını duvara çevirir (dördünde de aynı); bugün örgüsü uzamış ———
  const bugun = t >= tm.don + 0.5;   // örgünün boyu, komşu kadrajdan çıkınca değişir
  let dinle = 0;
  if (!bugun) for (const a of tm.soz) dinle = Math.max(dinle, pIn(t, a + 0.06, a + 0.86, 0.22));
  else dinle = pIn(t, tm.komBak, tm.komBak + 0.9, 0.25);
  komsuCiz(K, t, { dinle, orgu: bugun ? 1 : 0.25 });
  yumakCiz(K, t);

  // ——— Hikmet ———
  const hVar = id === 'kanca' || id === 'hikmet' || id === 'vazo' || (id === 'duvar' && t < tm.swap);
  let hc = null, hIs = null;
  if (hVar) {
    const hp = H.poseAt(H.CARDS.hikmet, S.hikBase, S.hik, t);
    if (id === 'kanca') {            // Necmi'yi gösterir; 0,3'te ve 1,05'te parmağını ileri uzatır
      const j = H.nabiz(t, 0.3, 0.36) + H.nabiz(t, 1.05, 0.36), jab = 30 * j;
      hp.x += 10 * j; hp.head = { ...hp.head, tilt: hp.head.tilt + 5 * j };
      H.reach('hikmet', hp, 'R', [HIK_X + 118 + jab, 1040], 1, 'A'); hIs = [NEC_X - 70, 1046];
    } else if (id === 'hikmet') {    // "Necmi"de sağı, "ben"de kendini, "eczaneye"de kapıyı gösterir
      const a = pIn(t, tm.hNecmi - 0.3, tm.hBen - 0.15), b = pIn(t, tm.hBen - 0.15, tm.ecz - 0.35), c = W(t, tm.ecz - 0.35);
      if (a > 0.01) { H.reach('hikmet', hp, 'R', [HIK_X + 150, 1050], a, 'A'); if (a > 0.5) hIs = [NEC_X, 1020]; }
      if (b > 0.01) H.reach('hikmet', hp, 'R', [HIK_X + 46, 1118], b, 'A');
      if (c > 0.01) { H.reach('hikmet', hp, 'R', [HIK_X + 178, 980], c, 'A'); if (c > 0.5) hIs = [KAPI.x + KAPI.w / 2, 880]; }
    } else if (id === 'vazo') {      // kırık parçaları gösterir
      H.reach('hikmet', hp, 'R', [HIK_X + 120, 1058 + 8 * H.nabiz(t, tm.kirik - 0.5, 0.3)], 1, 'A'); hIs = [MASA.x - 10, MASA.y - 80];
    } else {                         // duvar dibinde: h3'te duvara iki kez vurur; sayaçta kulağını dayar, iki kez tıklatır
      const sayacta = t >= tm.cd0;
      const wV = sayacta ? pIn(t, tm.cd0 + 0.9, tm.cd0 + 2.45, 0.35) : 1 - W(t, tm.kimin - 0.2, 0.3);
      const salla = sayacta ? 0 : pIn(t, tm.nez + 0.42, tm.kimin - 0.3, 0.12) * (0.5 - 0.5 * Math.cos((t - tm.nez - 0.42) * TAU * 2.4));   // "sözü"nde elini duvara doğru iki kez sallar
      const el = [DUV[0] - 10 - 26 * vurus(t, sayacta ? tm.dinleTik : tm.tik) - 40 * salla, (sayacta ? 1078 : 1016) - 14 * salla];
      if (wV > 0.01) H.reach('hikmet', hp, 'R', el, wV, 'A');
      const env = pIn(t, tm.kimin - 0.05, tm.gost - 0.2, 0.15), sl = Math.sin((t - tm.kimin) * TAU * 1.9) * env;   // "Kimin doğru söylediğini"de başını iki yana sallar
      hp.head = { ...hp.head, tilt: hp.head.tilt + 5 * sl, look: [hp.head.look[0] + 0.28 * sl, hp.head.look[1]] };
      const sag = hp.armR; H.omuzSilk(hp, t, tm.gost - 0.12, 0.55); H.omuzSilk(hp, t, tm.cd0 + 2.9, 0.3); hp.armR = sag;   // tek omuz: sağ kol duvarın öbür yanına taşmasın
      const wA = pIn(t, tm.gost - 0.15, tm.cd0 + 0.2, 0.3);
      if (wA > 0.01) H.reach('hikmet', hp, 'R', [HW_X + 84, 1120], wA, 'A');                             // avuç açık, göğüs hizasında
    }
    hc = oyna(K, t, tl, 'hikmet', hp, { heads });
  }

  // ——— Necmi ———
  const nVar = id === 'kanca' || id === 'vazo' || id === 'necmi';
  let nc = null, nIs = null;
  if (nVar) {
    const np = H.poseAt(H.CARDS.necmi, S.necBase, S.nec, t);
    if (id === 'kanca') {            // Hikmet'i gösterir; 0,7'de parmağını ileri uzatır
      const j = H.nabiz(t, 0.68, 0.36) + H.nabiz(t, 1.4, 0.36), jab = 30 * j;
      np.x -= 10 * j; np.head = { ...np.head, tilt: np.head.tilt - 5 * j };
      H.reach('necmi', np, 'L', [NEC_X - 92 - jab, 1134], 1, 'A'); nIs = [HIK_X + 100, 1050];
    } else if (id === 'vazo') {      // "kırıktı"da itiraz için elini kaldırır
      const a = W(t, tm.kirik - 0.1, 0.3);
      if (a > 0.01) H.reach('necmi', np, 'L', [NEC_X - 128, 1128], a, 'A');
    } else {                         // "hiç çıkmadı"da başını sallar ve Hikmet'i gösterir; "kapıdan"da kapıyı gösterir
      const env = pIn(t, tm.hic - 0.05, tm.hic + 0.9, 0.15), sl = Math.sin((t - tm.hic) * TAU * 2.3) * env;
      np.head = { ...np.head, tilt: np.head.tilt + 6 * sl, look: [np.head.look[0] + 0.3 * sl, np.head.look[1]] };
      const a = pIn(t, tm.n0 - 0.4, tm.kalk - 0.1), b = W(t, tm.kapidan - 0.4);
      if (a > 0.01) { H.reach('necmi', np, 'L', [NEC_X - 132, 1124], a, 'A'); if (a > 0.5) nIs = [HIK_X + 60, 1030]; }
      if (b > 0.01) { H.reach('necmi', np, 'L', [NEC_X - 142, 1106], b, 'A'); if (b > 0.5) nIs = [KAPI.x + KAPI.w / 2, 900]; }
      H.onayla(np, t, tm.ugur + 0.15, 1, 0.4);
    }
    nc = oyna(K, t, tl, 'necmi', np, { heads });
  }

  // ——— Defne: sol elde defter, sağ elde kalem ———
  const dVar = id === 'defne' || id === 'dw' || (id === 'duvar' && t >= tm.swap) || id === 'buldum' || id === 'cevap' || id === 'cta';
  let dc = null, dParmak = 0, kalemUc = null, dIs = null, dp = null;
  if (dVar) {
    dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, tm.buldum);
    const x = dp.x, yaz = 0;
    H.reach('defne', dp, 'L', [x - 56, 1206], 1, 'A');
    let sag = [x + 22 + yaz, 1196 - Math.abs(yaz) * 0.6]; kalemUc = [x - 30, 1150];   // varsayılan: kalem defterin üstünde
    if (id !== 'buldum') H.reach('defne', dp, 'R', sag, 1, 'A');
    if (id === 'defne') {            // "dört"te dört parmağını kaldırır
      const a = W(t, tm.dort - 0.3, 0.3);
      if (a > 0.01) { H.reach('defne', dp, 'R', [x + 78, 1140], a, 'A'); if (a > 0.6) { dParmak = 4 * ease.enter(seg(t, tm.dort - 0.1, 0.36)); kalemUc = null; } }   // el göğüs hizasında: selam gibi görünmez, yüze ve duvara binmez
    } else if (id === 'dw') {        // kalemle duvarı gösterir, "Duvar"da duvara vurur
      const el = [DUV[0] - 58 - 20 * vurus(t, [tm.d2 + 0.12]), 1150];
      H.reach('defne', dp, 'R', el, 1, 'A'); kalemUc = [DUV[0] + 40, 1144];
    } else if (id === 'duvar') {     // sayacın sonunda kalem çenede; n1'de duvarı (sütunun ortasını) gösterir; "Her birini"de kalem yine çenede
      const g = pIn(t, tm.n1 - 0.3, tm.n1b - 0.2, 0.3), cene = 1 - g;
      const ws = ease.enter(seg(t, tm.olab - 0.12, 0.25)) * (1 - ease.state(seg(t, tm.olab + 0.6, 0.3)));   // "olabilir?"de iki eli birden kaldırır (soru)
      if (ws > 0.01) { H.reach('defne', dp, 'L', [x - 70, 1160], ws, 'A'); dp.head = { ...dp.head, tilt: dp.head.tilt + 6 * ws }; }
      const cev = pIn(t, tm.n1b, tm.n1s + 0.1, 0.2), fi = (t - tm.n1b) * TAU * 1.3, ce = [x + 58 + 12 * cev * Math.cos(fi) + 16 * ws, 1150 + 9 * cev * Math.sin(fi) - 44 * ws];   // soruyu sorarken kalemi çevirir
      if (cene > 0.01) { H.reach('defne', dp, 'R', ce, cene, 'A'); kalemUc = [ce[0] + 18, ce[1] - 70]; }
      // "Dört sözü de": kalem sütunu yukarıdan aşağı süzer, sonra sütunun ortasına döner (dördüne eşit; hiçbir balonda durmaz)
      const sd = tm.n1soy + 0.35 - tm.n1, sup = ease.state(seg(t, tm.n1 - 0.05, 0.6 * sd)) - 0.5 * ease.state(seg(t, tm.n1 - 0.05 + 0.6 * sd, 0.4 * sd));
      if (g > 0.01) { H.reach('defne', dp, 'R', [DUV[0] - 50 - 16 * Math.sin(Math.PI * sup), lerp(1118, 1186, sup)], g, 'A'); if (g > 0.5) kalemUc = [DUV[0] + 60, lerp(BAL.y[0] + 36, BAL.y[3] + 36, sup)]; }
      dp.head = { ...dp.head, tilt: dp.head.tilt + g * lerp(4, -5, sup), look: [dp.head.look[0], dp.head.look[1] + g * lerp(-0.3, 0.55, sup)] };   // bakışı kalemle birlikte sütunu süzer
      dp.x += 8 * g * Math.sin(Math.PI * sup);
      H.onayla(dp, t, tm.n1soy + 0.3, 1, 0.42);
    } else if (id === 'cevap' || id === 'cta') {
      const g = pIn(t, tm.gule - 0.1, tm.cta, 0.3), fi = (t - tm.gule) * TAU * 1.1;
      if (g > 0.01) { H.reach('defne', dp, 'R', [DUV[0] - 50 + 8 * Math.cos(fi), 1140 + 12 * Math.sin(fi)], g, 'A'); kalemUc = [DUV[0] + 60, BAL.y[3] + 32]; }
    }
    dc = oyna(K, t, tl, 'defne', dp, { heads });
  }

  // ——— masa ve vazo (karakterlerin önünde), sonra eller ———
  if (id !== 'defne' && id !== 'dw') masaCiz(K, t, H.sars(t, tm.sal, 0.9, 3.4));   // Defne'nin yakın planında masanın ucu kadraja girmesin
  if (hc && hIs) hc.isaret('R', hIs);
  if (nc && nIs) nc.isaret('L', nIs);
  if (dc) {
    defter(K, dc.handL); dc.tut('L');
    if (dParmak > 0) dc.parmak('R', dParmak, { toplam: 4, ac: 0.24 });
    else if (id !== 'buldum' && kalemUc) { kalem(K, dc.handR, kalemUc); dc.tut('R'); }
    if (id === 'buldum') H.buldumIsin(K, t, tm.buldum, H.eklem('defne', dp, 'head'), { son: tm.proof });
  }

  // ——— dört balon: duvardan çıktığı sırayla, yukarıdan aşağıya; hepsi aynı biçimde, hiçbiri vurgulanmaz ———
  tm.soz.forEach((a, i) => sesIzi(K, t, a, BAL.y[i] + BAL.h / 2));
  tm.soz.forEach((a, i) => balon(K, i, balA(t, a - 0.02)));
}
