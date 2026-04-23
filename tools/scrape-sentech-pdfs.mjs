#!/usr/bin/env node
// Scrapes catalog/spec PDFs from sen-tech.com (Odoo CMS) for each product line
// and saves them under public/pdfs/<slug>.pdf. Re-run any time to refresh.
//
//   node tools/scrape-sentech-pdfs.mjs
//
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const ORIGIN = 'https://www.sen-tech.com';

// Each entry: { slug used in product schema, source page (for context),
//              odoo content path with access_token }
const SOURCES = [
  {
    slug: 'nti-interchangeable',
    page: `${ORIGIN}/ntc_01.html`,
    pdfPath:
      '/web/content/2407?access_token=f34e2b6e-9505-4d98-8a64-a22e6246e85c&unique=b581b1c37731e7c16cc718fe6baf3411e30406ba&download=true',
  },
  {
    slug: 'single-point-matched',
    page: `${ORIGIN}/ntc_02.html`,
    pdfPath:
      '/web/content/3834?access_token=50067f9e-f500-400a-b896-323c07bd31d7&unique=4e840710ef603519748dbf7e6de4a7b4f9847e97&download=true',
  },
  {
    slug: 'ht-high-precision',
    page: `${ORIGIN}/ntc_03.html`,
    pdfPath:
      '/web/content/3832?access_token=f2df57c7-5b22-43f0-b067-793eb7bed934&unique=393146efc6ac715341a896fd1629083921f01456&download=true',
  },
  {
    slug: 'hat-high-precision',
    page: `${ORIGIN}/ntc_04.html`,
    pdfPath:
      '/web/content/3839?access_token=edfcc86f-102b-494b-9850-bf58b60afe02&unique=d9c835318edf182a50ef4deec595e2e8b1877aad&download=true',
  },
  {
    slug: 'ts-body-temperature',
    page: `${ORIGIN}/ntc_05.html`,
    pdfPath:
      '/web/content/3841?access_token=f7dbce1b-4095-47a1-a1b1-84fd4a52f563&unique=0be7993e57e5f83ee6a20e92986d45df9b06e776&download=true',
  },
  {
    slug: 'ta-4-flex',
    page: `${ORIGIN}/ntc_06.html`,
    pdfPath:
      '/web/content/4037?access_token=506046b7-206e-4cdb-bf64-d757286fedd3&unique=677e2fff7fdf2de2c0b2bb28c34b99ab097c2b27&download=true',
  },
  {
    slug: 'tj-thin-film',
    page: `${ORIGIN}/ntc_07.html`,
    pdfPath:
      '/web/content/4038?access_token=1428250e-4528-4d37-a965-fd829e4b2ffc&unique=0a3b5145555f1ab311531cb357eb9e0a83ec5c88&download=true',
  },
  {
    slug: 'glass-bead',
    page: `${ORIGIN}/ntc_16.html`,
    pdfPath:
      '/web/content/3827?access_token=9bd185dc-e6c7-425c-a532-453bdf8b318d&unique=8af093cf6d916bdf2fca99bc017dcedf1a23a937&download=true',
  },
];

const OUT_DIR = resolve(process.cwd(), 'public/pdfs');
const MANIFEST = resolve(OUT_DIR, '_manifest.json');

async function fetchPdf(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; sen-tech-redesign-scraper/1.0; +contact@sen-tech.com)',
      Accept: 'application/pdf,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100 || !buf.slice(0, 5).toString('latin1').startsWith('%PDF-')) {
    throw new Error(`Response is not a valid PDF (${buf.length} bytes)`);
  }
  return buf;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = {
    capturedAt: new Date().toISOString(),
    source: ORIGIN,
    note: 'Scraped from sen-tech.com Odoo CMS. Replace via npm run scrape:pdfs.',
    files: [],
  };

  let ok = 0;
  let fail = 0;
  for (const item of SOURCES) {
    const url = `${ORIGIN}${item.pdfPath}`;
    const outPath = resolve(OUT_DIR, `${item.slug}.pdf`);
    process.stdout.write(`-> ${item.slug.padEnd(24)} ... `);
    try {
      const buf = await fetchPdf(url);
      await writeFile(outPath, buf);
      manifest.files.push({
        slug: item.slug,
        sourcePage: item.page,
        sourcePdf: url,
        localPath: `/pdfs/${item.slug}.pdf`,
        bytes: buf.length,
      });
      ok++;
      console.log(`OK  ${(buf.length / 1024).toFixed(1)} KB`);
    } catch (err) {
      fail++;
      console.log(`FAIL  ${err.message}`);
      manifest.files.push({
        slug: item.slug,
        sourcePage: item.page,
        sourcePdf: url,
        error: err.message,
      });
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ${ok} ok, ${fail} failed. Manifest -> ${MANIFEST}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
