// Bölüm 2 · İŞKUR. Mekân: koridor, Hikmet Bey'in kapısı ve asansör. Bütün anlar ses çizelgesinden okunur.
// Yön: soldan sağa (Defne → tabela → asansör), çözümde İŞKUR binasına kesme.
import { ease, seg, spring, clamp01, lerp } from './core.js';
import { INK, CARDS } from './cast.js';
import { PAL, LW, room, calendar, door, sign, riddleCard, counter, plant } from './office.js';
import { at } from './zaman.js';
import { UI, BIG, camAt, applyCam, toScreen, poseAt, charBase, drawChar, talkAt, captionAt, caption, endCard } from './sahne.js';

export function build(ep, tl) {
  const T = e => at(tl, e), L = tl.L;
  const tm = {
    hits: [0.03, 0.27], hammerDown: T('h2'), sat: T('h3:1'), think0: T('h3>'), cnt0: T('g1') - 5.9, cnt1: T('g1') - 0.9,
    panels: [T('d2:0'), T('d2:2')], checks: [T('d2:1'), T('d2:5')],
    lift: T('g1') - 0.9, genc0: T('g1') - 0.5, genc1: T('g1') + 0.25, point: T('g1:5'), shrug: T('g1:10'), aha: T('g1:13'),
    buldum: T('d3'), iskur: T('d4') - 0.05, slam: T('d4:5'), kimse: T('d4:7'),
    defeat: T('d4>') + 0.1, cta: T('d5') - 0.2, end: T('d5>') + 0.1,
  };
  const cam = [
    [0, 1, 540, 960, 'cut'],
    [0.6, 1.05, 520, 1000],
    [L.d1.t0, 1.15, 400, 1080],
    [T('h2:2'), 1.42, 520, 960],
    [T('h2:9'), 1.1, 640, 1020],
    [tm.sat - 0.25, 1.6, 330, 820],
    [tm.think0 + 0.1, 1.3, 270, 1230],
    [tm.lift, 1.0, 790, 1000],
    [tm.point, 1.18, 840, 980],
    [tm.buldum, 1.28, 230, 1150, 'cut'],
    [tm.iskur, 1, 540, 960, 'cut'],
    [tm.defeat, 1.5, 680, 1000, 'cut'],
    [tm.cta, 1.7, 250, 1180, 'cut'],
    [tm.end, 1, 540, 960, 'cut'],
  ];
  const hikBase = charBase('hikmet', { x: 820, y: 1620, s: 240, view: 'side', facing: -1, expr: 'mutlu', armL: { sh: 125, el: 25 }, armR: { sh: 15, el: 30 } });
  const hik = [
    [0.55, { armL: { sh: 45, el: 40 }, armR: { sh: 10, el: 20 }, head: { tilt: -6, look: [-0.6, 0.2] } }, 0.4],
    [T('h2'), { armL: { sh: 8, el: 10 } }, 0.4],
    [T('h2:9'), { armR: { sh: 150, el: 10 } }, 0.35, ease.enter],
    [tm.sat - 0.2, { armR: { sh: 72, el: -18 }, head: { tilt: 4, look: [-0.9, -0.3] } }, 0.35, ease.enter],
    [tm.think0 + 0.3, { armR: { sh: 10, el: 20 }, expr: 'mutlu', head: { tilt: -4, look: [-0.6, 0.2] } }],
    [tm.lift + 0.2, { head: { tilt: 0, look: [0.9, 0] }, expr: 'saskin' }, 0.3],
    [tm.lift + 0.35, { x: 740, facing: 1 }, 0.4],
    [tm.genc1, { head: { tilt: -4, look: [0.6, 0.1] }, expr: 'notr' }],
    [tm.aha, { expr: 'korku', head: { tilt: 8, look: [-0.3, 0.3] } }, 0.3],
    [tm.defeat, { facing: -1, expr: 'yorgun', head: { tilt: 10, look: [-0.6, 0.6] }, armR: { sh: 70, el: 40 }, armL: { sh: 70, el: 40 }, lean: 6 }, 0.6],
  ];
  const defBase = charBase('defne', { x: 200, y: 1640, s: 250, expr: 'saskin', head: { tilt: 6, look: [0.8, -0.3] }, armR: { sh: 40, el: 70 }, armL: { sh: 12, el: -10 }, props: { R: 'folder' }, blink: 0 });
  const def = [
    [L.d1.t0, { expr: { brow: -0.01, browTilt: 0.05, eye: 0.55, pupil: 1, curve: -0.05, open: 0, w: 0.85 }, blink: null, head: { tilt: -4, look: [0.9, -0.1] } }],
    [T('d1:4'), { x: 150 }, 0.45],
    [T('h2:2'), { expr: 'notr', head: { tilt: 4, look: [0.7, -0.6] } }],
    [tm.sat, { expr: 'saskin', head: { tilt: -8, look: [-0.4, -0.7] }, blink: 0 }, 0.25, ease.enter],
    [tm.think0 + 0.1, { blink: null, expr: { brow: 0.05, browTilt: 0.25, eye: 0.9, pupil: 1, curve: -0.1, open: 0, w: 0.8 }, head: { tilt: -10, look: [0.5, -0.9] }, armL: { sh: 18, el: -168 } }],
    [tm.checks[0], { head: { tilt: 8, look: [0.6, -0.7] } }, 0.4],
    [tm.checks[1], { expr: 'yorgun', head: { tilt: -6, look: [0.3, 0.3] }, armL: { sh: 12, el: -10 } }, 0.5],
    [tm.lift + 0.2, { expr: 'notr', head: { tilt: 0, look: [0.9, 0] } }, 0.3],
    [tm.aha, { expr: 'saskin', head: { tilt: -6, look: [0.9, -0.2] }, blink: 0 }, 0.25, ease.enter],
    [tm.buldum - 0.05, { y: 1530, blink: null, expr: 'mutlu', head: { tilt: 6, look: [0, -0.3] }, armR: { sh: 165, el: -10 }, armL: { sh: 165, el: -10 }, props: {} }, 0.25, ease.enter],
    [tm.cta - 0.2, { y: 1640, expr: 'mutlu', head: { tilt: 6, look: [0, 0] }, armR: { sh: 125, el: -50 }, armL: { sh: 12, el: -10 } }, 0.01],
    [tm.cta + 0.4, { armR: { sh: 140, el: -70 } }, 0.5],
  ];
  const gencBase = charBase('genc', { x: 1030, y: 1610, s: 235, view: 'side', facing: -1, expr: 'notr', props: { R: 'folder' }, armR: { sh: 30, el: 60 } });
  const genc = [
    [tm.point, { armL: { sh: 150, el: 10 }, head: { tilt: -6, look: [-0.8, -0.4] } }, 0.35, ease.enter],
    [tm.shrug, { armR: { sh: 35, el: 70 }, expr: 'mutlu', head: { tilt: 6, look: [-0.6, 0.1] } }, 0.4],
  ];
  return { tm, cam, hik, hikBase, def, defBase, genc, gencBase };
}

// çekiç kolu: iki vuruş (0,03 ve 0,27 sn), sonra dinlenme
function hammerArm(t, hits) {
  const down = 125, up = 168;
  if (t < hits[0]) return lerp(up - 20, down, ease.enter(clamp01((t + 0.1) / (hits[0] + 0.1))));
  if (t < hits[1]) { const u = (t - hits[0]) / (hits[1] - hits[0]); return u < 0.55 ? lerp(down, up, ease.state(u / 0.55)) : lerp(up, down, ease.exit((u - 0.55) / 0.45)); }
  return lerp(down, up - 10, ease.state(seg(t, hits[1], 0.25)));
}

function elevator(K, x, y, w, h, open, t) {
  const { rect, circ, text } = K;
  rect(x - 22, y - 70, w + 44, h + 70, '#9AA59E', LW, 6);
  rect(x + w / 2 - 50, y - 58, 100, 40, INK, LW * 0.6, 8);
  text('3', x + w / 2, y - 26, 32, open > 0 ? PAL.mustard : '#5A615E', 900);
  rect(x, y, w, h, '#1C3638');
  const g = (w / 2) * open;
  rect(x, y, w / 2 - g, h, '#B9C4BD', LW);
  rect(x + w / 2 + g, y, w / 2 - g, h, '#B9C4BD', LW);
  circ(x + w + 44, y + h * 0.5, 14, open > 0 && open < 1 ? PAL.mustard : '#C9C3B6', LW * 0.7);
}

// hayal balonu: küçük bina + kapısında kırmızı tabela; ok: yeşil tik
function thought(K, kind, x, y, u, okU) {
  const { ctx, rect, circ, text, line, poly } = K;
  ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
  rect(-118, -110, 236, 220, '#FFFFFF', LW, 40);
  if (kind === 'hastane') {
    rect(-80, -60, 160, 140, '#F4EFE3', LW * 0.8, 6); rect(-22, -88, 44, 44, PAL.red, LW * 0.6, 6);
    rect(-6, -82, 12, 32, '#FFF', 0); rect(-16, -72, 32, 12, '#FFF', 0);
  } else {
    poly([[-90, -50], [0, -94], [90, -50]], '#E9DCC2', LW * 0.8); rect(-84, -50, 168, 130, '#E9DCC2', LW * 0.8, 4);
    for (const cx of [-56, 56]) rect(cx - 9, -40, 18, 74, '#F4EFE3', LW * 0.5, 3);
  }
  rect(-26, 20, 52, 60, '#8C6A44', LW * 0.7, 4);
  rect(-44, -14, 88, 30, PAL.red, LW * 0.6, 5); line(-30, -4, 30, -4, 4, PAL.paper); line(-30, 6, 18, 6, 4, PAL.paper);
  if (okU > 0) {
    ctx.save(); ctx.translate(86, -82); ctx.scale(okU, okU);
    circ(0, 0, 34, PAL.green, LW * 0.8); K.line(-14, 0, -3, 12, 8, PAL.paper); K.line(-3, 12, 16, -12, 8, PAL.paper);
    ctx.restore();
  }
  ctx.restore();
  void text;
}

// sıradaki iş arayanlar (yüzsüz siluetler); dir: −1 kapıya dönük
function seeker(K, x, y, col, dir, k = 1) {
  const { rect, circ, ell } = K;
  ell(x, y + 4, 46 * k, 10 * k, 'rgba(31,36,33,0.18)', 0);
  rect(x - 34 * k, y - 210 * k, 68 * k, 150 * k, col, LW, 26 * k);
  rect(x - 26 * k, y - 66 * k, 22 * k, 66 * k, '#2E4057', LW * 0.8, 6);
  rect(x + 4 * k, y - 66 * k, 22 * k, 66 * k, '#2E4057', LW * 0.8, 6);
  circ(x + dir * 4 * k, y - 250 * k, 40 * k, '#D9A27A', LW);
  circ(x + dir * 14 * k - 9 * k, y - 256 * k, 4.5 * k, INK, 0); circ(x + dir * 14 * k + 9 * k, y - 256 * k, 4.5 * k, INK, 0);
  K.line(x + dir * 14 * k - 8 * k, y - 234 * k, x + dir * 14 * k + 8 * k, y - 234 * k, 3.5, INK);
  rect(x - 46 * k * -dir - 14 * k, y - 160 * k, 28 * k, 40 * k, '#D9A75A', LW * 0.7, 4);   // elde dosya
}

export function draw(K, t, ep, tl, S) {
  const { ctx } = K, { tm } = S;
  const cam = camAt(S.cam, t);
  if (t >= tm.end) return endCard(K, t, t - tm.end);
  if (t >= tm.iskur && t < tm.defeat) return iskur(K, t, tl, S);

  ctx.save(); applyCam(ctx, cam);
  room(K, { x0: -400, x1: 1500, floorY: 1500, t });
  // takvim: cumartesi (7 Kasım) kırmızı yanar
  const su = ease.enter(seg(t, tm.sat - 0.04, 0.25));
  calendar(K, 60, 620, 210, 'KASIM', su > 0 ? { 7: PAL.red } : {});
  if (su > 0) { ctx.save(); ctx.globalAlpha = su; K.ctx.beginPath(); ctx.ellipse(60 + 12 + 6 * 26.6 + 13, 620 + 210 * 1.15 * 0.26 + 15, 26 * (1.6 - 0.4 * su), 22 * (1.6 - 0.4 * su), 0, 0, Math.PI * 2); ctx.lineWidth = 6; ctx.strokeStyle = PAL.red; ctx.stroke(); ctx.restore(); }
  door(K, 400, 700, 400, 800, 'MÜDÜR');
  if (t >= tm.hammerDown) { ctx.save(); ctx.translate(820, 1490); ctx.rotate(-1.35); K.rect(-9, -90, 18, 104, PAL.woodDark, LW, 6); K.rect(-46, -128, 92, 40, '#5A615E', LW, 6); ctx.restore(); }
  const lo = ease.state(seg(t, tm.lift + 0.05, 0.4)) * (1 - ease.state(seg(t, tm.genc1 + 0.9, 0.4)));
  elevator(K, 940, 640, 220, 860, lo, t);
  plant(K, 1290, 1500, 0.9, t);
  // tabela: kapıda; yenilgide Hikmet Bey söküp kucağına alır
  const off = ease.state(seg(t, tm.defeat + 0.3, 0.9));
  const sx = lerp(500, 600, off), sy = lerp(930, 1340, off), srot = lerp(-0.05, 0.12, off);
  // genç: asansörden çıkıp sola yürür
  let g = null;
  if (t >= tm.lift + 0.2 && t < tm.buldum) {
    const p = poseAt(CARDS.genc, S.gencBase, S.genc, t), u = ease.state(seg(t, tm.genc0, tm.genc1 - tm.genc0));
    p.x = lerp(1060, 1020, u);
    if (u > 0 && u < 1) { const a = (1060 - p.x) / 80 * Math.PI * 2; p.legL = { hip: Math.sin(a) * 20, knee: 4 + Math.max(0, Math.sin(a + 1.7)) * 30 }; p.legR = { hip: Math.sin(a + Math.PI) * 20, knee: 4 + Math.max(0, Math.sin(a + Math.PI + 1.7)) * 30 }; p.bob = (1 - Math.abs(Math.cos(a))) * 0.03; }
    p.talk = talkAt(tl, 'genc', t);
    g = drawChar(ctx, 'genc', p, t);
  }
  // Hikmet Bey (yan, sola bakar) + çekiç
  const hp = poseAt(CARDS.hikmet, S.hikBase, S.hik, t); hp.talk = talkAt(tl, 'hikmet', t);
  if (t < 0.55) hp.armL = { sh: hammerArm(t, tm.hits), el: 25 };
  const h = t >= tm.cta ? null : drawChar(ctx, 'hikmet', hp, t);
  if (off < 0.5) sign(K, sx, sy, 340, 150, ['İŞİ OLMAYAN', 'GİREMEZ'], { rot: srot, fill: PAL.red, color: PAL.paper, nail: false });
  if (h && t < S.tm.hammerDown) {   // çekiç arka elde; soru başlayınca kapının dibine bırakılır
    ctx.save(); ctx.translate(h.handL[0], h.handL[1]); ctx.rotate(t < 0.55 ? 0.45 : -0.9); K.rect(-9, -90, 18, 104, PAL.woodDark, LW, 6); K.rect(-46, -128, 92, 40, '#5A615E', LW, 6); ctx.restore();
  }
  if (off >= 0.5 && h) sign(K, sx, sy, 340, 150, ['İŞİ OLMAYAN', 'GİREMEZ'], { rot: srot, fill: PAL.red, color: PAL.paper, nail: false });
  // Defne
  const dp = poseAt(CARDS.defne, S.defBase, S.def, t); dp.talk = talkAt(tl, 'defne', t);
  const offL = toScreen(cam, [dp.x, dp.y])[0] < -60 * cam.zoom;
  const d = (t >= tm.defeat && t < tm.cta) || offL ? null : drawChar(ctx, 'defne', dp, t);
  ctx.restore();

  // ── ekran katmanı ──
  if (t >= tm.defeat) return caption(K, captionAt(tl, t), { y: 300, head: toScreen(cam, t >= tm.cta ? d.head : h.head) });
  riddleCard(K, 70, 300, 940, ep.card, ep.num, { size: 60 });
  // hayal balonları: hastane, banka; "asabilir"de yeşil tik
  if (t >= tm.panels[0] - 0.1 && t < tm.lift + 0.4) {
    const out = 1 - ease.exit(seg(t, tm.lift, 0.3));
    ['hastane', 'banka'].forEach((k, i) => {
      const a = tm.panels[i] - 0.04; if (t < a) return;
      thought(K, k, 790, 690 + i * 260, spring(t - a, UI[0], UI[1]) * out, spring(t - (tm.checks[i] - 0.04), UI[0], UI[1]));
    });
    // düşünce kabarcıkları balondan Defne'ye
    if (d) { const hd = toScreen(cam, d.head); for (let j = 0; j < 3; j++) { const u = clamp01((t - tm.panels[0] - j * 0.08) / 0.2) * out; if (u > 0) K.circ(lerp(hd[0] + 120, 660, j / 3), lerp(hd[1] - 120, 740, j / 3), (10 + j * 6) * u, '#FFFFFF', LW * 0.6); } }
  }
  if (t >= tm.cnt0 - 0.2 && t < tm.cnt1 + 0.6) {
    const u = spring(t - (tm.cnt0 - 0.2), UI[0], UI[1]), out = 1 - ease.exit(seg(t, tm.cnt1 + 0.25, 0.3)), left = Math.max(0, tm.cnt1 - t);
    ctx.save(); ctx.translate(190, 1110); ctx.scale(u * out, u * out); counter(K, 0, 0, 92, left / 5, String(Math.ceil(left - 1e-6))); ctx.restore();
  }
  const cap = captionAt(tl, t), who = cap?.line.who;
  const head = who === 'hikmet' ? h?.head : who === 'defne' ? d?.head : who === 'genc' ? g?.head : null;
  caption(K, cap, { y: 1240, head: head && toScreen(cam, head) });
}

// çözüm: İŞKUR'un kapısında "BUYURSUN"; Hikmet Bey'in tabelası asılırsa sıra kapıda kalır
function iskur(K, t, tl, S) {
  const { ctx, rect, text } = K, { tm } = S, u = t - tm.iskur;
  ctx.fillStyle = '#E9C99C'; ctx.fillRect(0, 0, 1080, 1920);
  const z = 1 + 0.02 * u; ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
  rect(120, 620, 840, 900, '#E2D6BC'); rect(120, 560, 840, 90, PAL.teal);
  text('İŞKUR', 540, 632, 78, PAL.paper, 900);
  for (const wx of [180, 400, 740]) rect(wx, 720, 160, 200, '#9FC3C0', LW, 6);
  rect(400, 1060, 280, 460, '#3D2E22');
  ctx.fillStyle = PAL.floor; ctx.fillRect(0, 1520, 1080, 400); K.line(0, 1520, 1080, 1520, LW);
  // sıra: kapıya yürür; tabela çakılınca durur, "kimse"de geri döner
  const cols = ['#8A9A6B', '#B5523B', '#5E7C8C'], stop = tm.slam;
  cols.forEach((c, i) => {
    const walk = Math.min(t, stop) - tm.iskur, x0 = 760 + i * 130;
    let x = x0 - walk * 70;
    const back = ease.state(seg(t, tm.kimse + i * 0.08, 0.4));
    x += back * 60;
    seeker(K, x, 1520, c, back > 0.5 ? 1 : -1, 0.9);
    const xu = spring(t - (tm.kimse + i * 0.08), UI[0], UI[1]);
    if (t >= tm.kimse + i * 0.08) { ctx.save(); ctx.translate(x, 1300); ctx.scale(xu, xu); K.circ(0, 0, 30, PAL.red, LW * 0.8); K.line(-12, -12, 12, 12, 7, PAL.paper); K.line(12, -12, -12, 12, 7, PAL.paper); ctx.restore(); }
  });
  // İŞKUR'un gerçek tabelası
  sign(K, 540, 1000, 360, 160, ['İŞİ OLMAYAN', 'BUYURSUN'], { rot: 0.03, fill: PAL.green, color: PAL.paper, nail: false });
  // Hikmet Bey'in tabelası üstüne çakılır
  if (t >= tm.slam - 0.12) {
    const s = 1 + 0.5 * (1 - ease.enter(seg(t, tm.slam - 0.12, 0.12)));
    ctx.save(); ctx.translate(540, 1000); ctx.scale(s, s); ctx.translate(-540, -1000);
    sign(K, 540, 1000, 360, 160, ['İŞİ OLMAYAN', 'GİREMEZ'], { rot: -0.04, fill: PAL.red, color: PAL.paper, nail: false });
    ctx.restore();
  }
  ctx.restore();
  // Defne altta anlatır
  const dp = charBase('defne', { x: 230, y: 1890, s: 250, expr: 'mutlu', armR: { sh: 120 + 25 * ease.state(seg(t, tm.slam, 0.4)), el: -20 }, head: { tilt: 8, look: [0.6, -0.2] } });
  dp.talk = talkAt(tl, 'defne', t);
  const d = drawChar(ctx, 'defne', dp, t);
  caption(K, captionAt(tl, t), { y: 1120, head: d.head, maxW: 560 });
}
