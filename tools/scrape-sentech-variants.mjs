#!/usr/bin/env node
// Scrapes per-product variant matrices (B-value × R25 × accuracy)
// from sen-tech.com/zh_TW/shop/category/<slug>-<id> pages.
//
//   npm run scrape:variants
//
// Uses ?page=N pagination, stops when a page returns no new unique
// variants. Writes one JSON per product slug into src/content/variants/.
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const ORIGIN = 'https://www.sen-tech.com';
const LOCALE_PATH = '/zh_TW';
const MAX_PAGES = 30;

const CATEGORIES = [
  { slug: 'nti-interchangeable',  catId: 6,  catSlug: 'interchangeable-ntc-thermistors' },
  { slug: 'glass-bead',           catId: 27, catSlug: 'glass-bead-ntc-thermistor' },
  { slug: 'single-point-matched', catId: 28, catSlug: 'point-matched-ntc-thermistors' },
  { slug: 'ht-high-precision',    catId: 29, catSlug: 'high-precision-ntc-thermistors' },
  { slug: 'hat-high-precision',   catId: 30, catSlug: 'high-precision-at-type-ntc-thermistors' },
  { slug: 'ts-body-temperature',  catId: 31, catSlug: 'temperature-sensing-ntc-thermistors' },
  { slug: 'ta-4-flex',            catId: 32, catSlug: 'flexible-lead-ntc-thermistors' },
  { slug: 'tj-thin-film',         catId: 33, catSlug: 'thin-film-ntc-thermistors' },
  { slug: 'dt-diode',             catId: 34, catSlug: 'diode-type-ntc-thermistors' },
  { slug: 'ct-smd-chip',          catId: 35, catSlug: 'surface-mount-chip-ntc-thermistors' },
  { slug: 'sm-smd-ceramic',       catId: 36, catSlug: 'surface-mount-ceramic-type-ntc-thermistors' },
  { slug: 'tr-transducer',        catId: 37, catSlug: 'transducer-type-ntc-thermistor' },
  { slug: 'ls-life-sciences',     catId: 38, catSlug: 'life-sciences-temperature-probes' },
  { slug: 'lsmn-mini-probe',      catId: 39, catSlug: 'life-sciences-miniature-temperature-probes' },
  { slug: 'lsmc-micro-probe',     catId: 40, catSlug: 'life-sciences-micro-temperature-probes' },
  { slug: 'custom-assembly',      catId: 41, catSlug: 'custom-ntc-thermistor-sensors' },
];

const OUT_DIR = resolve(process.cwd(), 'src/content/variants');
const MANIFEST = resolve(OUT_DIR, '_manifest.json');

const VARIANT_RE =
  /B[\s值]*[:：]\s*(\d{3,4})\s*\/\s*R\s*\(K?[Ω]\)\s*[值]?\s*[:：]\s*([\d.]+)[\s\S]{0,200}?精度\s*[:：]\s*([^<\n]+?)\s*</g;

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; sentech-scraper/1.0)', Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseVariants(html, seen) {
  const added = [];
  for (const m of html.matchAll(VARIANT_RE)) {
    const b = parseInt(m[1], 10);
    const r = parseFloat(m[2]);
    const accuracy = m[3].trim().replace(/\s+/g, '').replace(/℃/g, '°C').replace(/Ω/g, 'Ω');
    const key = `${b}|${r}|${accuracy}`;
    if (seen.has(key)) continue;
    seen.add(key);
    added.push({ bValue: b, r25: r, accuracy });
  }
  return added;
}

async function crawlCategory({ catSlug, catId }) {
  const all = [];
  const seen = new Set();
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${ORIGIN}${LOCALE_PATH}/shop/category/${catSlug}-${catId}?page=${page}`;
    let html;
    try {
      html = await fetchPage(url);
    } catch {
      break;
    }
    const added = parseVariants(html, seen);
    if (added.length === 0) break;
    all.push(...added);
  }
  return all;
}

function sortNumeric(arr) {
  return [...arr].sort((a, b) => a - b);
}

function summarize(variants) {
  const bValues = sortNumeric([...new Set(variants.map((v) => v.bValue))]);
  const r25Values = sortNumeric([...new Set(variants.map((v) => v.r25))]);
  const accuracies = [...new Set(variants.map((v) => v.accuracy))];
  // Sort variants for stable output: B asc → R asc → accuracy asc
  const matrix = [...variants].sort(
    (a, b) =>
      a.bValue - b.bValue || a.r25 - b.r25 || a.accuracy.localeCompare(b.accuracy)
  );
  return { count: variants.length, bValues, r25Values, accuracies, matrix };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = {
    capturedAt: new Date().toISOString(),
    source: `${ORIGIN}${LOCALE_PATH}/shop/category/`,
    note: 'Per-product variant matrices scraped from SEN TECH zh_TW shop. Re-run via npm run scrape:variants.',
    files: [],
  };
  let total = 0;

  for (const cat of CATEGORIES) {
    process.stdout.write(`-> ${cat.slug.padEnd(24)} ... `);
    try {
      const variants = await crawlCategory(cat);
      const summary = summarize(variants);
      const file = resolve(OUT_DIR, `${cat.slug}.json`);
      await writeFile(
        file,
        JSON.stringify({ slug: cat.slug, sourceCatId: cat.catId, ...summary }, null, 2)
      );
      total += summary.count;
      manifest.files.push({
        slug: cat.slug,
        file: `src/content/variants/${cat.slug}.json`,
        count: summary.count,
        bValues: summary.bValues,
        r25Values: summary.r25Values,
        accuracies: summary.accuracies,
      });
      console.log(`${String(summary.count).padStart(3)} variants  (B:${summary.bValues.length} R:${summary.r25Values.length} Acc:${summary.accuracies.length})`);
    } catch (err) {
      console.log(`FAIL  ${err.message}`);
      manifest.files.push({ slug: cat.slug, error: err.message });
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\nDone. Total ${total} variants across ${CATEGORIES.length} lines.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
