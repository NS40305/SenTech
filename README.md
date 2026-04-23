# SEN TECH Website

Production static site for SEN TECH (sen-tech.com), bilingual EN / 繁中.

## Stack

- **Astro 6** + TypeScript strict
- CSS custom properties (no Tailwind)
- Native Astro i18n (`/` for EN, `/zh-tw/` for 繁中)
- Content collections (zod-validated) for products, applications, certifications, milestones, settings, home
- **Web3Forms** for the RFQ contact form (no backend needed)
- **Vercel** for hosting (static output)

## Local development

```bash
npm install
cp .env.example .env       # add your PUBLIC_WEB3FORMS_KEY
npm run dev                # http://localhost:4321
npm run build              # outputs to dist/
npm run test               # vitest
npm run tbd                # report remaining [TBD] markers
```

## Web3Forms setup

1. Sign up at https://web3forms.com (free tier: 250 submissions / month)
2. Bind it to a destination email address (e.g. `sales@sen-tech.com`)
3. Copy the **public access key** and put it in:
   - `.env` for local dev (`PUBLIC_WEB3FORMS_KEY=...`)
   - **Vercel → Project Settings → Environment Variables** for production
4. The key is a *public* identifier — it's safe to ship in client HTML; it can only POST to the email you bound.

The form lives at `/contact` (EN) and `/zh-tw/contact` (繁中). It does an AJAX POST to `https://api.web3forms.com/submit`; if JS is disabled it gracefully falls back to a native form POST that Web3Forms handles server-side.

## Deployment — Vercel

### One-time setup

1. Push this repo to GitHub / GitLab / Bitbucket.
2. In Vercel: **New Project → Import Git Repository → select this repo**. Vercel auto-detects Astro.
3. **Build & Output Settings** (Vercel pre-fills these from `vercel.json`):
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. **Environment Variables** → add `PUBLIC_WEB3FORMS_KEY` for *Production*, *Preview*, and *Development* scopes.
5. Click **Deploy**. Subsequent pushes to `main` deploy automatically; PRs get preview URLs.

### Local Vercel parity

```bash
npm install -g vercel
vercel link               # link this folder to the Vercel project
vercel pull               # pull env vars into .vercel/
vercel build              # produce .vercel/output identical to a prod build
vercel deploy --prebuilt  # ship the prebuilt output
```

### Custom domain

In Vercel **Settings → Domains** add `sen-tech.com` (or staging subdomain). DNS records are issued by Vercel. HTTPS is automatic.

## Project structure

```
src/
  components/
    home/        # 11 home-section components (Hero, NumbersStrip, …)
    layout/     # SiteHeader, SiteFooter, Container, Section, FloatingRfqButton, LangSwitcher
    primitives/ # Button, Eyebrow, Stat, Icon
    forms/      # FormField, FormSuccess, RfqForm
  content/      # zod-validated content collections (products, applications, …)
  i18n/ui.ts    # UI string table + `t()` + `localizedPath()` helpers
  layouts/      # BaseLayout
  pages/        # `/`, `/contact`, `/zh-tw/`, `/zh-tw/contact`
  styles/       # tokens.css + global.css
public/
  images/       # scraped + renamed product / hero / OEM / app photos + logo
docs/
  superpowers/  # spec + plan markdown (Foundation, Sections, Launch)
  tbd-tracker.md
tools/
  scrape-sentech-images.mjs
  check-tbd.mjs
vercel.json     # Vercel deploy config (cleanUrls, headers, redirects)
```

See `docs/superpowers/specs/2026-04-23-sentech-redesign-design.md` for the full design spec, and `docs/tbd-tracker.md` for outstanding content items needing input from SEN TECH.
