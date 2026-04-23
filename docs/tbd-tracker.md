# TBD Tracker

Updated: 2026-04-23

## Summary

Total open TBDs after Foundation slice: **70**

## Categories of open TBDs

1. **Numbers strip** — annual capacity, OEM project count, countries shipped (`home-en.json`, `home-zh-TW.json`)
2. **Certifications** — confirm which apply (ISO 9001, IATF 16949, RoHS, REACH) and exact scope (`certifications.json`)
3. **Milestones** — fill in years 2002, 2010, 2018 with real titles + bodies (`milestones-en.json`, `milestones-zh-TW.json`)
4. **Contact** — street address, phone, email (`SiteFooter.astro`, `settings-en.json`, `settings-zh-TW.json`)
5. **Hosting** — custom domain, Web3Forms access key (deferred to Plan 3)
6. **Product specs** — verify every spec marked `(unverified)` against actual datasheets (`src/content/products/*.md`)
7. **Photography** — replace stock fill placeholders once SEN TECH supplies real factory + product photos (`src/assets/stock/_attribution.json` × 5 slots, ~15 TBDs)
8. **Per-product / per-application body details** — biocompatibility certs, AEC-Q200 status, exact dimensions, lead options (in product/application markdown bodies)

## Owner

SEN TECH product / marketing team — responses required before public launch.

## Raw report

See `docs/tbd-tracker-raw.txt` for the per-line list (top 50 + count).

## Update process

- Re-run `npm run tbd` after content updates to refresh the count
- When a TBD is filled, replace `[TBD: ...]` with the real value in source
- Decrement count and update this tracker periodically
