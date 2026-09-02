# Wishbuilt — Validated Opportunity Catalog (SDD Plan)

## Goal

Publish every listed "somebody make this" opportunity as a live, searchable catalog with a dedicated page and an interactive prototype per concept. One Next.js app, static-exportable, deployed to Cloudflare Pages.

## Product

**Wishbuilt** is a public radar of validated software gaps collected from Reddit, Hacker News, and Indie Hackers. Visitors can browse, filter, search, and try a working prototype of each niche.

## Global Constraints

- Next.js App Router, TypeScript, Tailwind, shadcn/ui
- All opportunities live in one typed data module (`src/data/opportunities.ts`)
- Unique slug per concept; duplicate source posts merge onto the same page
- Real copy only — no lorem
- Client-side search/filter works on static export (`output: "export"`)
- No auth, no database, no secrets in the repo
- Do not commit Cloudflare or GitHub tokens
- Desktop and mobile layouts
- Empty / no-results / loading states covered

## Tasks

1. Scaffold Next.js + shadcn + static export
2. Encode all opportunities (merged duplicates)
3. Catalog home, filters, opportunity pages, prototypes
4. README + Cloudflare publish
