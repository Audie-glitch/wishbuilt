# Wishbuilt

A public radar of validated “somebody make this” software gaps collected from Reddit, Hacker News, and Indie Hackers.

Each unique concept has its own page: the unmet need, the niche, how it could pay, the original threads, and a working in-browser prototype. Duplicate posts are merged onto one page.

## Run locally

```bash
npm install
npm test
npm run dev
```

The app listens on [http://127.0.0.1:43177](http://127.0.0.1:43177).

## Published

- Live: [https://wishbuilt.pages.dev](https://wishbuilt.pages.dev)
- Source: [https://github.com/Audie-glitch/wishbuilt](https://github.com/Audie-glitch/wishbuilt)

## Build a static site

```bash
npm run build
```

Output lands in `out/` (Next.js static export). Deploy that folder to Cloudflare Pages, Vercel, or any static host.

```bash
npx wrangler pages deploy out --project-name wishbuilt
```

## Data

Opportunity rows live in `scripts/build-opportunities.mjs`. Regenerate the typed module with:

```bash
npm run data
```

## What this is not

Wishbuilt is a catalog of demand signals plus interaction sketches. It is not 180 production SaaS products, and it does not call third-party social APIs.
