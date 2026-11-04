// Bilmece Mesaisi: ofis sahnesi ve ortak grafik dili (kalın mürekkep çizgisi, düz renk, gölgesiz ışık).
// Her çizim fonksiyonu ctx üstünde, t'nin saf fonksiyonu; rastgelelik tohumlu.
import { mulberry32 } from './core.js';
import { INK, teaGlass } from './cast.js';

export const PAL = {
  ink: INK, paper: '#F4EDE0', cream: '#FBF6EC',
  wall: '#2E5B5E', wallDark: '#24494C', trim: '#E9DCC2', floor: '#B8925E', floorDark: '#9C7A4C',
  wood: '#A8743F', woodTop: '#C48C52', woodDark: '#86592E', metal: '#8FA093', metalDark: '#728276',
  mustard: '#D19A2E', coral: '#D9603F', teal: '#2F7F7A', red: '#C2412F', green: '#5E9A4E', sky: '#E8C9A0',
};
export const LW = 6;

export function kit(ctx) {
  const path = (pts, close = true) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (close) ctx.closePath(); };
  const fs = (fill, lw = LW) => { if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); } };
  const poly = (pts, fill, lw = LW) => { path(pts); fs(fill, lw); };
  const rect = (x, y, w, h, fill, lw = LW, r = 0) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); fs(fill, lw); };
  const circ = (x, y, r, fill, lw = LW) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); fs(fill, lw); };
  const ell = (x, y, rx, ry, fill, lw = LW, a = 0) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, a, 0, Math.PI * 2); fs(fill, lw); };
  const line = (x0, y0, x1, y1, lw = LW, col = INK) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); };
  const text = (s, x, y, size, col = INK, weight = 800, align = 'center', base = 'alphabetic') => {
    ctx.font = `${weight} ${size}px Rubik`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(s, x, y); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  };
  const up = s => s.toLocaleUpperCase('tr-TR');
  return { ctx, path, fs, poly, rect, circ, ell, line, text, up };
}

// ——— arka plan: petrol duvar, krem süpürgelik, ahşap zemin; pencerede İstanbul silueti ———
export function room(K, { x0 = -200, x1 = 1280, floorY = 1500, window: win = true, t = 0 } = {}) {
  const { ctx, rect, line, poly, circ, ell } = K;
  ctx.fillStyle = PAL.wall; ctx.fillRect(x0, -400, x1 - x0, floorY + 400);
  // ince dikey duvar kâğıdı çizgileri
  ctx.globalAlpha = 0.18; for (let x = x0; x < x1; x += 46) line(x, -400, x, floorY - 160, 3, PAL.wallDark); ctx.globalAlpha = 1;
  rect(x0, floorY - 160, x1 - x0, 160, PAL.wallDark, 0);
  rect(x0 - 10, floorY - 172, x1 - x0 + 20, 22, PAL.trim);
  ctx.fillStyle = PAL.floor; ctx.fillRect(x0, floorY, x1 - x0, 900);
  for (let i = 0; i < 14; i++) line(x0 + i * 140, floorY, x0 + i * 140 - 260, floorY + 900, 3, PAL.floorDark);
  line(x0, floorY, x1, floorY, LW);
}

export function windowIst(K, x, y, w, h, t = 0) {
  const { ctx, rect, poly, circ, line } = K;
  rect(x - 14, y - 14, w + 28, h + 28, PAL.trim);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = '#E9C99C'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#F0D8B2'; ctx.beginPath(); ctx.arc(x + w * 0.78, y + h * 0.35, 46, 0, Math.PI * 2); ctx.fill();
  // martı (yavaş süzülür)
  const gx = x + ((t * 22) % (w + 80)) - 40, gy = y + h * 0.22 + 6 * Math.sin(t * 1.3);
  ctx.beginPath(); ctx.moveTo(gx - 16, gy); ctx.quadraticCurveTo(gx - 8, gy - 9, gx, gy); ctx.quadraticCurveTo(gx + 8, gy - 9, gx + 16, gy); ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.stroke();
  // siluet: kubbe + iki minare, Galata Kulesi, evler
  const base = y + h * 0.78, s = '#7E8E86';
  ctx.fillStyle = s; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  const sil = () => {
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.lineTo(x + w * 0.08, base); ctx.lineTo(x + w * 0.08, base - 40); ctx.lineTo(x + w * 0.16, base - 40); ctx.lineTo(x + w * 0.16, base);
    // cami
    ctx.lineTo(x + w * 0.2, base); ctx.lineTo(x + w * 0.2, base - 60); ctx.arc(x + w * 0.32, base - 60, w * 0.12, Math.PI, 0); ctx.lineTo(x + w * 0.44, base);
    // Galata
    ctx.lineTo(x + w * 0.58, base); ctx.lineTo(x + w * 0.58, base - 120); ctx.lineTo(x + w * 0.565, base - 120); ctx.lineTo(x + w * 0.62, base - 175); ctx.lineTo(x + w * 0.675, base - 120); ctx.lineTo(x + w * 0.66, base - 120); ctx.lineTo(x + w * 0.66, base);
    ctx.lineTo(x + w * 0.8, base); ctx.lineTo(x + w * 0.8, base - 50); ctx.lineTo(x + w * 0.9, base - 50); ctx.lineTo(x + w * 0.9, base); ctx.lineTo(x + w, base);
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath();
  };
  sil(); ctx.fill(); ctx.stroke();
  for (const mx of [0.205, 0.435]) { ctx.beginPath(); ctx.rect(x + w * mx - 5, base - 150, 10, 150); ctx.fill(); ctx.stroke(); poly([[x + w * mx - 7, base - 150], [x + w * mx, base - 172], [x + w * mx + 7, base - 150]], s, 4); }
  ctx.fillStyle = '#6E9A9A'; ctx.fillRect(x, base + 4, w, h);
  line(x, base + 4, x + w, base + 4, 4);
  ctx.restore();
  rect(x, y, w, h, null);
  line(x + w / 2, y, x + w / 2, y + h, LW); line(x, y + h * 0.5, x + w, y + h * 0.5, LW);
}

// duvar saati: gerçek saat (saat h, dakika m), saniye kolu t ile döner
export function clock(K, x, y, r, h = 9, m = 5, t = 0) {
  const { ctx, circ, line } = K;
  circ(x, y, r, PAL.cream);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78, x + Math.sin(a) * r * 0.88, y - Math.cos(a) * r * 0.88, 4); }
  const am = (m / 60) * Math.PI * 2, ah = ((h % 12) / 12 + m / 720) * Math.PI * 2, as = (t % 60) / 60 * Math.PI * 2;
  line(x, y, x + Math.sin(ah) * r * 0.5, y - Math.cos(ah) * r * 0.5, 8);
  line(x, y, x + Math.sin(am) * r * 0.72, y - Math.cos(am) * r * 0.72, 6);
  line(x, y, x + Math.sin(as) * r * 0.8, y - Math.cos(as) * r * 0.8, 3, PAL.red);
  circ(x, y, 7, INK, 0);
}

// duvar takvimi: ay adı + gün ızgarası; vurgulu günler (renk haritası)
export function calendar(K, x, y, w, month = 'KASIM', marks = {}) {
  const { rect, text, line } = K;
  const h = w * 1.15;
  rect(x, y, w, h, PAL.cream, LW, 6);
  rect(x, y, w, h * 0.2, PAL.red, LW, 6);
  text(month, x + w / 2, y + h * 0.15, w * 0.15, PAL.cream, 900);
  const cw = (w - 24) / 7;
  for (let i = 0; i < 30; i++) {
    const cx = x + 12 + (i % 7) * cw, cy = y + h * 0.26 + Math.floor(i / 7) * cw;
    if (marks[i + 1]) rect(cx + 2, cy + 2, cw - 4, cw - 4, marks[i + 1], 0, 4);
    text(String(i + 1), cx + cw / 2, cy + cw * 0.7, cw * 0.48, INK, 700);
  }
}

// masa (önden): üst tabla + ön panel; masanın arkasındaki her şey önce çizilir
export function desk(K, x, y, w, { h = 360 } = {}) {
  const { rect, line } = K;
  rect(x, y, w, 40, PAL.woodTop, LW, 8);
  rect(x + 16, y + 40, w - 32, h, PAL.wood);
  rect(x + 40, y + 70, w * 0.36, 110, PAL.woodTop, LW, 6);
  line(x + 40 + w * 0.18 - 30, y + 125, x + 40 + w * 0.18 + 30, y + 125, 8);
}

// bilgisayar monitörü (arkası izleyiciye dönük değil: ekran yana bakar)
export function monitor(K, x, y, w, glow = 0) {
  const { rect, poly, line } = K;
  rect(x - w * 0.08, y + w * 0.62, w * 0.16, w * 0.16, '#5A615E');
  rect(x - w * 0.25, y + w * 0.76, w * 0.5, 22, '#5A615E', LW, 6);
  rect(x - w / 2, y, w, w * 0.64, '#4A5150', LW, 14);
  rect(x - w / 2 + 16, y + 16, w - 32, w * 0.64 - 32, glow ? '#CFE3D8' : '#A9C2B6', LW * 0.7, 6);
  for (let i = 0; i < 4; i++) line(x - w / 2 + 40, y + 50 + i * 34, x - w / 2 + 40 + (w - 90) * (0.4 + 0.15 * ((i * 7) % 4)), y + 50 + i * 34, 7, '#7E978B');
}

// Necmi Abi'nin dosya dolabı: open = çekmece açıklığı (0..1)
export function cabinet(K, x, y, w, h, open = 0) {
  const { rect, line } = K;
  rect(x, y, w, h, PAL.metal, LW, 8);
  const dh = (h - 30) / 3;
  for (let i = 0; i < 3; i++) {
    const dy = y + 15 + i * dh, o = i === 1 ? open * 70 : 0;
    if (o > 0) { rect(x + 10 - o * 0.4, dy + 6 - 0, w - 20 + o * 0.8, dh - 12 + o * 0.3, PAL.metalDark, LW, 6); }
    rect(x + 12 - o * 0.4, dy + 4 + o * 0.3, w - 24 + o * 0.8, dh - 8, PAL.metal, LW, 6);
    rect(x + w / 2 - 38 - o * 0.4 * 0, dy + dh / 2 - 8 + o * 0.3, 76, 16, '#5D6A61', LW * 0.7, 8);
    rect(x + w / 2 - 34, dy + 14 + o * 0.3, 68, 22, PAL.cream, LW * 0.5, 3);
  }
}

// saksıda kauçuk bitkisi; t ile hafif yaprak salınımı
export function plant(K, x, y, k = 1, t = 0) {
  const { ctx, poly, ell } = K;
  for (let i = 0; i < 6; i++) {
    const a = -1.2 + i * 0.48 + 0.04 * Math.sin(t * 1.1 + i), L = (150 + (i % 3) * 40) * k;
    ctx.save(); ctx.translate(x, y - 40 * k); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-34 * k, -L * 0.6, 0, -L); ctx.quadraticCurveTo(34 * k, -L * 0.6, 0, 0);
    ctx.fillStyle = i % 2 ? PAL.green : '#4C8240'; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
    ctx.restore();
  }
  poly([[x - 60 * k, y - 60 * k], [x + 60 * k, y - 60 * k], [x + 46 * k, y + 50 * k], [x - 46 * k, y + 50 * k]], PAL.coral);
}

// kapı: buzlu cam ve isim levhası; sign: { text, rot } kapıdaki tabela
export function door(K, x, y, w, h, plate = 'MÜDÜR') {
  const { rect, text, circ } = K;
  rect(x - 16, y - 16, w + 32, h + 16, PAL.trim);
  rect(x, y, w, h, '#8C6A44');
  rect(x + w * 0.14, y + h * 0.08, w * 0.72, h * 0.34, '#CFDCD4', LW, 6);
  rect(x + w * 0.2, y + h * 0.18, w * 0.6, h * 0.08, PAL.cream, LW * 0.6, 4);
  text(plate, x + w / 2, y + h * 0.245, h * 0.05, INK, 800);
  circ(x + w * 0.84, y + h * 0.56, 16, PAL.mustard);
}

// asılı tabela: kendi merkezi etrafında hafif sallanır
export function sign(K, x, y, w, h, lines, { rot = 0, fill = PAL.cream, color = INK, nail = true } = {}) {
  const { ctx, rect, text, circ, line } = K;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (nail) { line(-w * 0.3, -h / 2, 0, -h / 2 - 50, 4); line(w * 0.3, -h / 2, 0, -h / 2 - 50, 4); circ(0, -h / 2 - 50, 8, '#5A615E', 3); }
  rect(-w / 2, -h / 2, w, h, fill, LW, 10);
  const fsz = h / (lines.length + 0.9);
  lines.forEach((s, i) => text(s, 0, -h / 2 + fsz * (i + 1.15), fsz * 0.86, color, 900));
  ctx.restore();
}

// dünya küresi (masa üstü), rot: dönüş fazı
export function globe(K, x, y, r, rot = 0) {
  const { ctx, circ, line, rect, ell } = K;
  rect(x - r * 0.5, y + r * 1.25, r, 22, '#5A615E', LW, 6);
  line(x, y + r, x, y + r * 1.25, 10);
  ctx.beginPath(); ctx.arc(x, y, r * 1.12, Math.PI * 0.6, Math.PI * 1.6); ctx.lineWidth = 9; ctx.strokeStyle = '#B8933A'; ctx.stroke(); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  circ(x, y, r, '#6FA6B8');
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  const r0 = mulberry32(17);
  for (let i = 0; i < 5; i++) {
    const cx = x + (((i * 0.43 + rot) % 1.4) - 0.7) * r * 2.2, cy = y + (r0() - 0.5) * r * 1.3;
    ell(cx, cy, r * (0.25 + r0() * 0.25), r * (0.15 + r0() * 0.2), '#9CC08A', LW * 0.7, r0());
  }
  ctx.restore();
  circ(x, y, r, null);
}

// ——— marka öğeleri ———
// bilmece kartı: üst güvenli alanda; num rozeti; lines tam cümle satırları
export function riddleCard(K, x, y, w, lines, num, { size = 62, a = 1 } = {}) {
  const { ctx, rect, text, up } = K;
  ctx.save(); ctx.globalAlpha = a;
  // yazı güvenli alanda kalsın (x 90–920 → en geniş satır ≤ 780 px): sığmazsa punto küçülür
  ctx.font = `800 ${size}px Rubik`;
  const widest = Math.max(...lines.map(s => ctx.measureText(s).width));
  if (widest > 780) size = Math.floor(size * 780 / widest);
  const lh = size * 1.18, h = lines.length * lh + 70;
  rect(x + 10, y + 12, w, h, INK, 0, 26);
  rect(x, y, w, h, PAL.paper, LW, 26);
  lines.forEach((s, i) => text(s, x + w / 2, y + 52 + size * 0.78 + i * lh, size, INK, 800));
  // rozet
  const bw = 290;
  rect(x + 36, y - 32, bw, 62, PAL.mustard, LW, 31);
  text(up(`Bilmece #${num}`), x + 36 + bw / 2, y + 12, 36, INK, 900);
  ctx.restore();
  return h;
}

// konuşma balonu: (x, y) sol üst; tail: kuyruğun ucu
export function bubble(K, x, y, w, lines, tail, { size = 46, fill = '#FFFFFF' } = {}) {
  const { ctx, text } = K;
  const lh = size * 1.22, h = lines.length * lh + 44;
  const tx = Math.min(Math.max(tail[0], x + 60), x + w - 60);
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 34);
  ctx.fillStyle = fill; ctx.fill();
  ctx.beginPath(); ctx.moveTo(tx - 34, y + h - 4); ctx.lineTo(tail[0], tail[1]); ctx.lineTo(tx + 20, y + h - 4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 34); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx - 34, y + h); ctx.lineTo(tail[0], tail[1]); ctx.lineTo(tx + 20, y + h); ctx.stroke();
  ctx.fillStyle = fill; ctx.fillRect(tx - 30, y + h - LW, 48, LW * 1.6);
  lines.forEach((s, i) => text(s, x + w / 2, y + 22 + size * 0.86 + i * lh, size, INK, 700));
  return h;
}

// düşünme sayacı: kalan saniye halkası
export function counter(K, x, y, r, frac, label) {
  const { ctx, circ, text } = K;
  circ(x, y, r, PAL.paper);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r - 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.closePath(); ctx.fillStyle = PAL.mustard; ctx.fill();
  circ(x, y, r * 0.62, PAL.paper, LW * 0.8);
  text(label, x, y + r * 0.24, r * 0.66, INK, 900);
}

export { teaGlass };
