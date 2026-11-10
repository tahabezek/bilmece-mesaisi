// v4 "hikâye" dili (2026-11-10): hikayeler/bolum_019-027_v4.md storyboard'undaki kart ve replik tablolarını
// bolumler/<id>.json dosyalarına işler. sira, disabled, caption, hashtags, music korunur; sfx'i bölüm sahnesi yazılırken
// ajan doldurur (burada yalnız yanlış deneme vızıltısı).
//   node tools/v4_json.mjs [019 021 …]     → argüman yoksa 019–027 hepsi
import fs from 'node:fs';

const md = fs.readFileSync('hikayeler/bolum_019-027_v4.md', 'utf8');
const GAP = { h1: 0.4, d1: 0.25, h2a: 0.3, h2b: 0.3, h2c: 0.35, h3: 0.4, d2: 0.6, hd: 0.45, n1: 5.6, d3: 0.35, d4: 0.4, d5: 0.45, h4: 1.1, d6: 0.55 };
const WHO = { Hikmet: 'hikmet', Defne: 'defne', Necmi: 'necmi' };
// kararlar (2026-11-10): 025 kısaltıldı (h3 yok, h4 değişti); 025 kartında kurye yerine Kerem
const PATCH = {
  '025': {
    drop: ['h3'],
    text: { h4: 'Kerem! O yirmiyi geri getir!' },
    card: ["Herkes 90 ödedi: 270. Kerem'de 20.", '290 eder. Kayıp 10 lira nerede?'],
  },
};

const want = process.argv.slice(2).length ? process.argv.slice(2) : ['019', '020', '021', '022', '023', '024', '025', '026', '027'];
const secs = md.split(/^## (?=\d{3} · )/m).slice(1);
for (const sec of secs) {
  const num = sec.slice(0, 3);
  if (!want.includes(num)) continue;
  const file = fs.readdirSync('bolumler').find(f => f.startsWith(num + '-') && f.endsWith('.json'));
  const ep = JSON.parse(fs.readFileSync('bolumler/' + file, 'utf8'));
  const P = PATCH[num] || {};
  const card = P.card || [...sec.matchAll(/^- \*\*Kart:\*\* `([^`]+)` \(\d+\) \/ `([^`]+)`/gm)][0]?.slice(1, 3);
  if (!card) throw new Error(num + ': kart bulunamadı');
  const lines = [];
  for (const m of sec.matchAll(/^\| (h\w+|d\w+|n\w+) \| (Hikmet|Defne|Necmi) \| (.+?) \| \d+ \| [^|]+\|$/gm)) {
    const [, id, who, raw] = m;
    if (P.drop?.includes(id)) continue;
    const text = P.text?.[id] || raw.trim();
    const tts = text.replace(/'/g, '').replace(/…/g, '.');
    lines.push({ id, who: WHO[who], gap: GAP[id] ?? 0.4, text, ...(tts !== text ? { tts } : {}) });
  }
  const ids = lines.map(l => l.id);
  for (const k of ['h1', 'h2a', 'd2', 'hd', 'n1', 'd3', 'd4', 'h4', 'd6']) if (!ids.includes(k)) throw new Error(`${num}: ${k} yok`);
  const music = { ...(ep.music || {}) };
  if (!ids.includes('h3')) music.think = [(ids.includes('h2c') ? 'h2c' : 'h2b') + '>', 'd3'];
  const out = {
    ...ep, card, voice: { tight: 0.28, tail: 2.4, lines }, music,
    countdown: 'n1-0.3', cdShare: 'Bunu bir arkadaşına sor!', sfx: [['buzz', 'hd:0']], v4: true,
  };
  fs.writeFileSync('bolumler/' + file, JSON.stringify(out, null, 1) + '\n');
  console.log(file, card.map(s => s.length).join('+'), 'harf ·', lines.length, 'replik ·', lines.reduce((a, l) => a + l.text.split(/\s+/).length, 0), 'kelime');
}
