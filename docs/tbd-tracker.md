# TBD Tracker

Updated: 2026-04-24

## Summary

Total open TBDs: **50** (down from 70 after the verified-spec pass)

## Categories of open TBDs

1. **Numbers strip** — annual capacity, OEM project count, countries shipped (`home-en.json`, `home-zh-TW.json`) — 6 TBDs
2. **Certifications** — confirm scope strings for ISO 9001, IATF 16949, RoHS, REACH (`certifications.json`) — 4 TBDs
3. **Milestones** — fill in years 2002, 2010, 2018 with real titles + bodies (`milestones-en.json`, `milestones-zh-TW.json`) — 12 TBDs
4. **Contact** — street address only; email + phone resolved to `sales@sen-tech.com` / `+886-4-2493-3297` from official site (`settings-en.json`, `settings-zh-TW.json`, `SiteFooter.astro`) — 2 TBDs
5. **Hosting** — custom domain, Web3Forms access key (deferred to Plan 3)
6. **Photography** — replace stock fill placeholders once SEN TECH supplies real factory + product photos (`src/assets/stock/_attribution.json` × 5 slots) — ~15 TBDs

## Resolved in this pass

- All 16 product markdown files now carry verified specs (operating range, tolerance, B-value availability, dissipation constant, thermal time constant, max power) sourced from sen-tech.com product pages (HT, HAT, GB, IN, PM, TS, TA-4, TJ series).
- `(unverified)` markers fully removed from product front-matter.
- Contact email + phone filled from official site footer; only street address still pending.

## Owner

SEN TECH product / marketing team — responses required before public launch.

## Raw report

See `docs/tbd-tracker-raw.txt` for the per-line list (top 50 + count).

## Update process

- Re-run `npm run tbd` after content updates to refresh the count
- When a TBD is filled, replace `[TBD: ...]` with the real value in source
- Decrement count and update this tracker periodically
