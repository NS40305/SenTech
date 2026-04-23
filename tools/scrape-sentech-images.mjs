#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../src/assets/scraped');
mkdirSync(outDir, { recursive: true });

const targets = [
  'https://www.sen-tech.com/zh_TW',
];

const manifest = { capturedAt: new Date().toISOString(), images: [] };

async function fetchPage(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'sentech-redesign-asset-scrape/1.0' } });
  if (!r.ok) throw new Error(`Fetch failed ${url}: ${r.status}`);
  return await r.text();
}

function extractImageUrls(html, baseUrl) {
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const found = new Set();
  let m;
  while ((m = re.exec(html))) {
    const src = m[1];
    try {
      const abs = new URL(src, baseUrl).toString();
      if (/\.(jpe?g|png|webp|svg)(\?|$)/i.test(abs)) found.add(abs);
    } catch {}
  }
  return [...found];
}

async function downloadOne(url) {
  const safeName = url.replace(/[^a-z0-9.]+/gi, '_').slice(-80);
  const ext = extname(new URL(url).pathname) || '.jpg';
  const filename = `${safeName.replace(/\.[^.]+$/, '')}${ext}`;
  const target = resolve(outDir, filename);
  if (existsSync(target)) return { url, filename, skipped: true };
  const r = await fetch(url, { headers: { 'User-Agent': 'sentech-redesign-asset-scrape/1.0' } });
  if (!r.ok) throw new Error(`Image fetch failed ${url}: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(target, buf);
  return { url, filename, bytes: buf.length };
}

for (const page of targets) {
  console.log(`Scanning ${page}...`);
  const html = await fetchPage(page);
  const urls = extractImageUrls(html, page);
  console.log(`Found ${urls.length} images.`);
  for (const u of urls) {
    try {
      const info = await downloadOne(u);
      manifest.images.push(info);
      console.log(`  ${info.skipped ? '∙' : '✓'} ${info.filename}`);
    } catch (e) {
      console.log(`  ✗ ${u} — ${e.message}`);
    }
  }
}

writeFileSync(resolve(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Done. Manifest at ${outDir}/_manifest.json`);
