# Catalog PDFs

## Per-product datasheets (8) — auto-scraped from sen-tech.com

| Slug                   | File                          | Source page                                |
| ---------------------- | ----------------------------- | ------------------------------------------ |
| nti-interchangeable    | `nti-interchangeable.pdf`     | https://www.sen-tech.com/ntc_01.html       |
| single-point-matched   | `single-point-matched.pdf`    | https://www.sen-tech.com/ntc_02.html       |
| ht-high-precision      | `ht-high-precision.pdf`       | https://www.sen-tech.com/ntc_03.html       |
| hat-high-precision     | `hat-high-precision.pdf`      | https://www.sen-tech.com/ntc_04.html       |
| ts-body-temperature    | `ts-body-temperature.pdf`     | https://www.sen-tech.com/ntc_05.html       |
| ta-4-flex              | `ta-4-flex.pdf`               | https://www.sen-tech.com/ntc_06.html       |
| tj-thin-film           | `tj-thin-film.pdf`            | https://www.sen-tech.com/ntc_07.html       |
| glass-bead             | `glass-bead.pdf`              | https://www.sen-tech.com/ntc_16.html       |

These datasheets are referenced by each product's `pdfUrl` front-matter field and surface via the ProductCard "PDF Specification" button + modal preview.

To re-fetch (e.g. after SEN TECH updates the source PDFs or rotates Odoo access tokens):

```bash
npm run scrape:pdfs
```

`_manifest.json` tracks source URLs, sizes, and capture timestamp.

## Main bilingual catalog (TBD)

The Hero "Download Catalog" CTA currently uses `sentech-catalog-placeholder.pdf` (auto-generated, ~1.5 KB). Drop a real combined catalog at `sentech-catalog.pdf` once SEN TECH supplies one, and update the Hero's `catalogPdfUrl` prop or set it to `/pdfs/sentech-catalog.pdf`.

Regenerate the placeholder any time with:

```bash
node tools/make-placeholder-pdf.mjs
```
