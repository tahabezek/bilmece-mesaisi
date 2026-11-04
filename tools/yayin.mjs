// Yayın planlayıcı: önümüzdeki N saatin boş yuvalarını bulur, hazır videoyu (prebuilt/) GitHub Pages'e koyar,
// Buffer'a customScheduled + dueAt ile tek denemede planlar. CI'da render yoktur: her bölüm yerelde render edilip
// `node tools/yayin.mjs --hazirla` ile prebuilt/<id>.mp4 olarak aynı commit'e girer.
//
//   node tools/yayin.mjs              → normal çalışma (Actions)
//   node tools/yayin.mjs --dry        → yalnızca plan (medya/Buffer yok, anahtar gerekmez)
//   node tools/yayin.mjs --status     → kanal sağlığı, kuyruk, kalan bölüm stoğu
//   node tools/yayin.mjs --kanallar   → Buffer'daki kurum ve kanal kimlikleri (config.json'u doldurmak için)
//   node tools/yayin.mjs --hazirla    → out/bolum_<id>.mp4 → prebuilt/<id>.mp4 (yalnız eksik ya da yeni olanlar)
//
// Önceki kanalın dersleri: gerçeğin kaynağı Buffer kuyruğu (yuva doluysa atla), yayın çağrısı tek deneme,
// geçmişe ya da çok yakına planlama yok, firstComment yok, medya yönlendirmesiz statik URL.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gql, channelHealth, postsBetween, createReel, createShort } from './buffer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const LEDGER = path.join(root, 'state', 'ledger.json');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const summary = [];
const NOT_USED = new Set(['failed', 'skipped']);   // bu durumdaki bölüm stoğa geri döner

function loadLedger() { return fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : { slots: {} }; }
function saveLedger(l) { fs.mkdirSync(path.dirname(LEDGER), { recursive: true }); fs.writeFileSync(LEDGER, JSON.stringify(l, null, 2) + '\n'); }

// ——— yuvalar (TR saati sabit UTC+3); açılış günü fazladan bir yuva ———
function upcomingSlots(now) {
  const out = [];
  const trNow = new Date(now.getTime() + cfg.trUtcOffsetHours * 3600e3);
  for (let d = -1; d <= Math.ceil(cfg.horizonHours / 24) + 1; d++) {
    const y = trNow.getUTCFullYear(), m = trNow.getUTCMonth(), day = trNow.getUTCDate() + d;
    const dayStr = new Date(Date.UTC(y, m, day)).toISOString().slice(0, 10);
    const list = [...cfg.slotsTR, ...(cfg.launchDate === dayStr && cfg.launchExtraSlotTR ? [cfg.launchExtraSlotTR] : [])];
    for (const s of list) {
      const [hh, mm] = s.split(':').map(Number);
      const t = new Date(Date.UTC(y, m, day, hh - cfg.trUtcOffsetHours, mm));
      const lead = (t - now) / 60e3;
      if (cfg.launchDate && dayStr < cfg.launchDate) continue;   // açılıştan önce yayın yok
      if (lead >= cfg.minLeadMinutes && lead <= cfg.horizonHours * 60) out.push(t);
    }
  }
  return out.sort((a, b) => a - b);
}
const slotKey = t => t.toISOString().slice(0, 16) + 'Z';

// ——— bölüm stoğu: bolumler/*.json, numara sırasıyla; yalnız hazır videosu olanlar ———
const video = e => path.join(root, 'prebuilt', `${e.id}.mp4`);
function episodes() {
  return fs.readdirSync(path.join(root, 'bolumler')).filter(f => f.endsWith('.json')).sort()
    .map(f => JSON.parse(fs.readFileSync(path.join(root, 'bolumler', f), 'utf8')))
    .filter(e => !e.disabled && e.caption)
    .sort((a, b) => (a.sira ?? 1000 + a.num) - (b.sira ?? 1000 + b.num));   // yayın sırası (sira) önce; yoksa üretim numarası
}
function usedEpisodes(ledger) { return new Set(Object.values(ledger.slots).filter(s => !NOT_USED.has(s.status)).map(s => s.episode)); }
function nextEpisode(ledger, taken) {
  const used = usedEpisodes(ledger);
  return episodes().find(e => !used.has(e.id) && !taken.has(e.id) && fs.existsSync(video(e)));
}
const mediaName = ep => `v/${ep.id}.mp4`;
const postText = ep => [ep.caption, (ep.hashtags || []).join(' ')].filter(Boolean).join('\n\n');

// ——— medya: 'media' dalına yetim commit, eski dosyalar budanır (git plumbing; çalışma ağacına dokunmaz) ———
function git(a, opts = {}) {
  const r = spawnSync('git', a, { cwd: root, encoding: 'utf8', ...opts });
  if (r.status !== 0) throw new Error(`git ${a.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
}
function publishMedia(ledger, newFiles) {
  const dir = path.join(root, '.media');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'v'), { recursive: true });
  let hasBranch = true;
  try { git(['fetch', '--depth=1', 'origin', cfg.mediaBranch]); } catch { hasBranch = false; }
  const keepAfter = Date.now() - cfg.mediaKeepDays * 86400e3;
  const keep = new Set(Object.entries(ledger.slots).filter(([k]) => new Date(k).getTime() > keepAfter).map(([, s]) => s.media));
  if (hasBranch) {
    for (const f of git(['ls-tree', '-r', '--name-only', 'FETCH_HEAD']).split('\n')) {
      if (keep.has(f)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), spawnSync('git', ['show', `FETCH_HEAD:${f}`], { cwd: root, maxBuffer: 1 << 30 }).stdout); }
    }
  }
  for (const [rel, src] of newFiles) { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.copyFileSync(src, path.join(dir, rel)); }
  fs.writeFileSync(path.join(dir, '.nojekyll'), '');
  fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Bilmece Mesaisi medya</title>');
  const env = { ...process.env, GIT_INDEX_FILE: path.join(root, '.git', 'media-index') };
  fs.rmSync(env.GIT_INDEX_FILE, { force: true });
  git(['--work-tree', dir, 'add', '-A', '.'], { env });
  const tree = git(['write-tree'], { env });
  const commit = git(['commit-tree', tree, '-m', `medya ${new Date().toISOString()}`], { env });
  git(['push', '--force', 'origin', `${commit}:refs/heads/${cfg.mediaBranch}`]);
  log(`medya dalı güncellendi (${newFiles.length} yeni dosya)`);
}

// Pages yayına alınana kadar bekle: 200, video/mp4, boyut birebir aynı
async function waitLive(url, size, timeoutMs = 12 * 60e3) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try {
      const r = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(15000) });
      if (r.status === 200 && Number(r.headers.get('content-length')) === size && /video\/mp4/.test(r.headers.get('content-type') || '')) return true;
    } catch { /* yeniden dene */ }
    await new Promise(r => setTimeout(r, 15000));
  }
  return false;
}

// ——— yardımcı komutlar ———
function prepare() {
  // render çıktısını yayına hazır dosyaya kopyalar; 100 MB üstü GitHub'a girmez → CRF 21 ile yeniden kodlanır
  const ff = path.join(root, 'node_modules', 'ffmpeg-static', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
  fs.mkdirSync(path.join(root, 'prebuilt'), { recursive: true });
  for (const e of episodes()) {
    const src = path.join(root, 'out', `bolum_${e.id}.mp4`), dst = video(e);
    if (!fs.existsSync(src)) { log(`yok   ${e.id} (önce render)`); continue; }
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) { log(`güncel ${e.id}`); continue; }
    if (fs.statSync(src).size > 95e6) spawnSync(ff, ['-v', 'error', '-y', '-i', src, '-c:v', 'libx264', '-crf', '21', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', dst]);
    else fs.copyFileSync(src, dst);
    log(`hazır ${e.id} (${(fs.statSync(dst).size / 1e6).toFixed(1)} MB)`);
  }
}
async function channels() {
  const d = await gql(`query { account { organizations { id name } } }`);
  for (const o of d.account.organizations) {
    const c = await gql(`query($o: OrganizationId!) { channels(input: { organizationId: $o }) { id name service isDisconnected } }`, { o: o.id });
    console.log(`kurum ${o.id} ${o.name}`);
    for (const ch of c.channels) console.log(`  kanal ${ch.id} ${ch.service} ${ch.name}${ch.isDisconnected ? ' (bağlantı kopuk)' : ''}`);
  }
}
async function status() {
  const ch = await channelHealth(cfg.channelId);
  const now = new Date();
  const posts = await postsBetween(cfg.organizationId, cfg.channelId, new Date(now - 5 * 86400e3).toISOString(), new Date(now.getTime() + 7 * 86400e3).toISOString());
  const used = usedEpisodes(loadLedger());
  const left = episodes().filter(e => !used.has(e.id) && fs.existsSync(video(e))).length;
  console.log(JSON.stringify({
    channel: ch,
    stock: { readyEpisodes: left, days: +(left / cfg.slotsTR.length).toFixed(1) },
    posts: posts.sort((a, b) => (a.dueAt < b.dueAt ? -1 : 1)).map(p => ({ dueAt: p.dueAt, status: p.status, error: p.error?.message, text: p.text.slice(0, 50) })),
  }, null, 2));
}

async function main() {
  if (args.has('--hazirla')) return prepare();
  if (args.has('--kanallar')) return channels();
  if (args.has('--status')) return status();
  if (process.env.BILMECE_PAUSED === 'true') { log('BILMECE_PAUSED=true → hiçbir şey yapılmadı'); return; }
  if (cfg.paused) { log(`config.json paused: ${cfg.paused} → hiçbir şey yapılmadı`); return; }
  if (!DRY && (!cfg.channelId || !cfg.organizationId || !cfg.mediaBaseUrl)) throw new Error('config.json eksik: organizationId, channelId, mediaBaseUrl');

  const now = new Date();
  const ledger = loadLedger();
  if (!DRY) {
    const ch = await channelHealth(cfg.channelId);
    if (ch.isDisconnected || ch.isLocked) throw new Error(`Buffer kanalı kullanılamıyor: ${JSON.stringify(ch)}`);
    if (ch.isQueuePaused) summary.push('⚠️ Buffer kuyruğu duraklatılmış; planlanan gönderiler çıkmaz.');
  }
  const slots = upcomingSlots(now);
  const tol = cfg.slotToleranceMinutes * 60e3;
  const existing = DRY ? [] : await postsBetween(cfg.organizationId, cfg.channelId,
    new Date(now.getTime() - 3600e3).toISOString(), new Date(now.getTime() + (cfg.horizonHours + 2) * 3600e3).toISOString());
  const filled = t => existing.some(p => p.dueAt && Math.abs(new Date(p.dueAt) - t) <= tol);

  const plan = [], taken = new Set(), empty = [];
  for (const t of slots) {
    if (filled(t)) { log(`dolu  ${slotKey(t)}`); continue; }
    const prev = ledger.slots[slotKey(t)];
    const ep = prev && prev.status === 'failed' ? episodes().find(e => e.id === prev.episode) : nextEpisode(ledger, taken);
    if (!ep) { empty.push(slotKey(t)); continue; }
    taken.add(ep.id);
    plan.push({ t, ep, mp4: video(ep), rel: mediaName(ep), url: cfg.mediaBaseUrl + mediaName(ep) });
    log(`boş   ${slotKey(t)} → ${ep.id}`);
  }
  if (empty.length) summary.push(`${empty.some(k => new Date(k) - now < 24 * 3600e3) ? '⚠️' : 'ℹ️'} Hazır bölüm yok; ${empty.length} yuva boş geçildi (${empty.join(', ')}).`);
  if (DRY) {
    for (const p of plan) log(`dry: ${slotKey(p.t)} ${p.ep.id}\n${postText(p.ep)}\n`);
    return finish(ledger, false);
  }
  if (!plan.length) { log('tüm yuvalar dolu'); await youtube(ledger, now); return finish(ledger); }

  for (const p of plan) ledger.slots[slotKey(p.t)] = { episode: p.ep.id, media: p.rel, status: 'media', at: now.toISOString() };
  saveLedger(ledger);
  publishMedia(ledger, plan.map(p => [p.rel, p.mp4]));

  for (const p of plan) {   // her yuva için tek deneme
    const k = slotKey(p.t), size = fs.statSync(p.mp4).size;
    if (!(await waitLive(p.url, size))) { Object.assign(ledger.slots[k], { status: 'failed', error: 'medya yayına çıkmadı' }); summary.push(`❌ ${k}: medya URL'si canlı değil`); continue; }
    if ((p.t - Date.now()) / 60e3 < cfg.minLeadMinutes) { Object.assign(ledger.slots[k], { status: 'failed', error: 'süre geçti' }); summary.push(`⚠️ ${k}: süre geçti, atlandı`); continue; }
    const again = await postsBetween(cfg.organizationId, cfg.channelId, new Date(p.t - tol).toISOString(), new Date(p.t.getTime() + tol).toISOString());
    if (again.length) { Object.assign(ledger.slots[k], { status: 'skipped', note: 'yuvada başka gönderi vardı' }); log(`dolu (yarış) ${k}`); continue; }
    ledger.slots[k].status = 'sending'; saveLedger(ledger);
    try {
      const post = await createReel({ channelId: cfg.channelId, text: postText(p.ep), videoUrl: p.url, dueAtISO: p.t.toISOString(), thumbnailOffsetMs: Math.round((p.ep.coverAt ?? 0) * 1000), shareToFeed: cfg.shareToFeed });
      Object.assign(ledger.slots[k], { status: 'scheduled', postId: post.id, dueAt: post.dueAt });
      summary.push(`✅ ${k} → ${p.ep.id}`);
    } catch (e) {
      Object.assign(ledger.slots[k], { status: 'failed', error: String(e.message).slice(0, 300) });   // tekrar yok; sonraki çalıştırma bakar
      summary.push(`❌ ${k}: ${e.message}`);
    }
    saveLedger(ledger);
  }
  await youtube(ledger, now);
  return finish(ledger);
}

// ——— isteğe bağlı YouTube Shorts: planlanmış her Reels aynı dakikada (config.youtube doluysa) ———
async function youtube(ledger, now) {
  if (!cfg.youtube?.channelId) return;
  const tol = cfg.slotToleranceMinutes * 60e3;
  const yt = await postsBetween(cfg.organizationId, cfg.youtube.channelId, new Date(now.getTime() - 3600e3).toISOString(), new Date(now.getTime() + (cfg.horizonHours + 2) * 3600e3).toISOString());
  for (const [k, slot] of Object.entries(ledger.slots)) {
    if (slot.status !== 'scheduled' || !slot.dueAt || slot.yt?.postId) continue;
    const due = new Date(slot.dueAt), ep = episodes().find(e => e.id === slot.episode);
    if (!ep || (due - now) / 60e3 < cfg.minLeadMinutes || yt.some(p => p.dueAt && Math.abs(new Date(p.dueAt) - due) <= tol)) continue;
    try {
      const post = await createShort({ cfgYt: cfg.youtube, title: ep.caption.split('\n')[0].replace(/^Zeka sorusu:\s*/, ''), text: postText(ep), videoUrl: cfg.mediaBaseUrl + slot.media, dueAtISO: due.toISOString() });
      slot.yt = { postId: post.id, status: 'scheduled', dueAt: post.dueAt };
      summary.push(`✅ ${k} youtube → ${ep.id}`);
    } catch (e) { slot.yt = { status: 'failed', error: String(e.message).slice(0, 300) }; summary.push(`⚠️ ${k} youtube: ${e.message}`); }
    saveLedger(ledger);
  }
}

function finish(ledger, save = true) {
  if (save) saveLedger(ledger);
  const used = usedEpisodes(ledger);
  const left = episodes().filter(e => !used.has(e.id) && fs.existsSync(video(e))).length;
  const days = left / cfg.slotsTR.length;
  if (days < cfg.lowBacklogWarnDays) summary.push(`⚠️ Hazır bölüm stoğu azaldı: ${left} bölüm (${days.toFixed(1)} gün).`);
  const text = summary.join('\n') || 'değişiklik yok';
  log(text);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Bilmece Mesaisi\n${text}\n`);
  // uyarı da hata sayılır: başarısız çalıştırma GitHub'dan e-posta olarak gelir, sessiz kalmaz
  if (!DRY && summary.some(s => s.startsWith('❌') || s.startsWith('⚠️'))) process.exitCode = 1;
}

main().catch(e => { console.error(e); process.exitCode = 1; });
