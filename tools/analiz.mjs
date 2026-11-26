// Instagram analizi: Buffer'daki gönderilmiş Reels'lerin metriklerini (Instagram'ın kendi sayıları) çeker,
// ledger'daki bölümle eşleştirir, bölümün özelliklerini (süre, format, mekanizma etiketi) ekler.
//   node --env-file=.env tools/analiz.mjs [gün=40]   → research/analiz_veri_<tarih>.json ve tablo çıktısı
import fs from 'node:fs';
import path from 'node:path';
import { gql } from './buffer.mjs';

const cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const gun = Number(process.argv[2] || 40), now = new Date();
const ledger = JSON.parse(fs.readFileSync('state/ledger.json', 'utf8')).slots;
const byPost = new Map(Object.entries(ledger).filter(([, s]) => s.postId).map(([k, s]) => [s.postId, { slot: k, ...s }]));

const posts = []; let after = null;
do {   // Buffer sayfalı döndürür (sayfa başı 10)
  const d = await gql(`query($in: PostsInput!, $after: String) { posts(input: $in, first: 50, after: $after) { pageInfo { hasNextPage endCursor } edges { node {
    id status dueAt sentAt text externalLink metrics { type value } } } } }`,
    { after, in: { organizationId: cfg.organizationId, filter: { channelIds: [cfg.channelId], status: ['sent'],
      dueAt: { start: new Date(now - gun * 86400e3).toISOString(), end: now.toISOString() } } } });
  posts.push(...(d.posts.edges || []).map(e => e.node));
  after = d.posts.pageInfo?.hasNextPage ? d.posts.pageInfo.endCursor : null;
} while (after);
posts.sort((a, b) => (a.sentAt < b.sentAt ? -1 : 1));

const sure = id => { try { const tl = JSON.parse(fs.readFileSync(`assets/voice/${id}/timeline.json`, 'utf8')); const ep = JSON.parse(fs.readFileSync(`bolumler/${id}.json`, 'utf8'));
  return ep.cevapsiz ? +(ep.cevapsiz.kesim + tl.duration - ep.cevapsiz.kart).toFixed(1) : +tl.duration.toFixed(1); } catch { return null; } };
const rows = posts.map(p => {
  const l = byPost.get(p.id), id = l?.episode || null;
  const ep = id && fs.existsSync(`bolumler/${id}.json`) ? JSON.parse(fs.readFileSync(`bolumler/${id}.json`, 'utf8')) : {};
  const m = Object.fromEntries((p.metrics || []).map(x => [x.type, x.value]));
  return { id, sira: ep.sira ?? null, sentAt: p.sentAt, link: p.externalLink, sure: id ? sure(id) : null,
    cevapsiz: !!ep.cevapsiz, kart: (ep.card || []).join(' / '), etiket: (ep.hashtags || []).slice(2).join(' '), metin: p.text.slice(0, 90), ...m };
});
const tarih = now.toISOString().slice(0, 10), out = path.join('research', `analiz_veri_${tarih}.json`);
fs.writeFileSync(out, JSON.stringify(rows, null, 1) + '\n');
const keys = [...new Set(rows.flatMap(r => Object.keys(r)))].filter(k => !['id', 'sira', 'sentAt', 'link', 'sure', 'cevapsiz', 'kart', 'etiket', 'metin'].includes(k));
console.log('metrikler:', keys.join(', '));
for (const r of rows) console.log([r.sentAt?.slice(5, 16), r.id, r.sure, r.cevapsiz ? 'C' : '-', ...keys.map(k => `${k}=${r[k] ?? ''}`)].join(' | '));
console.log('yazıldı:', out, rows.length, 'gönderi');
