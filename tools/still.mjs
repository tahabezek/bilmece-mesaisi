// Tek kare yakalama: proje kökünü geçici sunucuyla açar, sayfanın window.__ready olmasını bekler, PNG kaydeder.
// Kullanım: node tools/still.mjs "engine/sheet.html?c=defne" out/sheet_defne.png [genişlik] [yükseklik]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };

export function findChrome() {
  const c = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'];
  const p = c.find(p => p && fs.existsSync(p));
  if (!p) throw new Error('Chrome bulunamadı (CHROME_PATH ayarla)');
  return p;
}

export function staticServer() {
  const srv = http.createServer((req, res) => {
    const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.statusCode = 404; return res.end(); }
    res.setHeader('Content-Type', types[path.extname(p)] || 'application/octet-stream');
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

export async function openBrowser() {
  return puppeteer.launch({
    executablePath: findChrome(), headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-accelerated-2d-canvas', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [url, out, w = '1080', h = '1920'] = process.argv.slice(2);
  const srv = await staticServer();
  const browser = await openBrowser();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
    page.on('pageerror', e => console.error('sayfa hatası:', e.message));
    page.on('console', m => { if (m.type() === 'error') console.error('konsol:', m.text()); });
    await page.goto(`http://127.0.0.1:${srv.address().port}/${url}`);
    await page.waitForFunction('window.__ready === true', { timeout: 30000 });
    fs.mkdirSync(path.dirname(path.resolve(root, out)), { recursive: true });
    const el = await page.$('canvas');
    await el.screenshot({ path: path.resolve(root, out) });
    console.log('yazıldı:', out);
  } finally { await browser.close(); srv.close(); }
}
