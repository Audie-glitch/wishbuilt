# Wishbuilt — Decision Layer

## Context

Wishbuilt already exists, is tested, and is published. It catalogs 187 unique concepts merged
from a research table of 204 demand signals harvested from Reddit, Hacker News, and Indie
Hackers between 2026-08-23 and 2026-08-25. Each concept has a page with its unmet need, niche,
monetization, source threads, and an in-browser prototype sketch.

A coverage audit against the authoritative 204-row table confirms the corpus is complete: all
172 distinct source URLs are present and there are no extra or invented URLs. Two gaps remain:

1. **Provenance.** The 204-row table is not in the repository, so nothing can verify the
   catalog against its source, and 30 source titles were shortened when the data was
   hand-entered (e.g. "Tool to query complex enterprise architectures and generate scoped
   sub-diagrams" drops the trailing "dynamically"). Only 190 of the 204 rows survive as
   distinct source entries.
2. **No decision layer.** The catalog tells you what people asked for. It cannot tell you
   which of the 187 concepts is worth building or how to start. That judgment is the whole
   point of collecting demand signals, and it is currently left entirely to the reader.

This plan closes both gaps. It is an increment on working code — do not rewrite or restyle
what already works.

## Global Constraints

These bind every task. Reviewers use them as the attention lens.

1. **`data/signals.tsv` is the source of truth.** It holds exactly 204 data rows plus 1 header
   row, 7 tab-separated columns each (`date_discovered`, `platform`, `title`, `unmet_need`,
   `concept`, `monetization`, `source_url`). Never edit it to make code pass. Never invent,
   drop, or reword rows. Source `title`, `date`, `platform`, and `url` must reach the UI
   **verbatim** from this file.
2. **Merging is allowed; losing rows is not.** Several rows are independent requests for the
   same product and are legitimately merged onto one concept page. Every one of the 204 rows
   must still appear as its own source entry under whichever concept it was merged into, so
   the count of source entries across all concepts is exactly 204.
3. **Everything derived is deterministic and pure.** No network calls, no API keys, no LLM
   calls, no environment variables, at build time or runtime. Every score and generated spec
   is a pure function of the concept's own stored text. The app must build with networking
   disabled, and `next build` must keep working with no pre-step.
4. **Every score is explainable.** No opaque numbers. Every score carries the factors that
   produced it, each with a human-readable label, its numeric contribution, and the evidence
   (the matched keyword or rule) that triggered it. A test must assert that a score always
   equals its baseline plus the sum of its factor contributions.
5. **Derived data is labelled as inference.** Scores, effort estimates, and build specs are
   Wishbuilt's own heuristics, not claims from the source posts. The UI must mark them
   distinctly from verbatim source text so a reader never mistakes a heuristic for a quote.
   The README's existing "What this is not" honesty must extend to cover scoring.
6. **Respect the existing codebase.** Keep the current visual language (Newsreader display
   font, `rounded-2xl` cards, `bg-card`/`text-muted-foreground` tokens, uppercase tracked
   section labels), the existing shadcn/ui primitives in `src/components/ui/`, the static
   export config, and the port 43177 dev server. Add components alongside the current ones.
   Do not introduce a new component library, a state management library, or a CSS approach.
   Do not reformat files you are not changing.
7. **TypeScript strict.** No `any`, no non-null assertions to silence the compiler, no
   `@ts-expect-error`. The app is a static export, so every new page must be statically
   renderable.
8. **Tests are real.** Every test asserts a specific expected value. No test that only checks
   a function does not throw, and no snapshot-only coverage of logic.
9. **Accessible and responsive.** Works at 375px and 1440px. Every interactive control is
   keyboard reachable with a visible focus ring and an accessible name. Color is never the
   only carrier of meaning — a score shown by color must also be shown as a number or label.

## Conventions

- `npm test` (vitest), `npm run typecheck` if present else `npx tsc --noEmit`, `npm run build`
  (static export to `out/`), `npm run dev` (port 43177).
- `npm run data` regenerates `src/data/opportunities.ts` from `scripts/build-opportunities.mjs`.
  That generated file is committed. Never hand-edit it; change the script and regenerate.
- Derived logic goes in `src/lib/`. Pure modules, no React imports.
- Commit per task with a descriptive message.

## Task 1 — Provenance and verbatim source fidelity

**Goal:** Make the catalog verifiable against the 204-row table, and restore every row.

**Deliverables**

1. `data/signals.tsv` is committed as-is (204 data rows + header). It is already present in the
   working tree; do not modify its contents.
2. `scripts/verify-corpus.mjs` — a checker, runnable via a new `"verify"` npm script, that
   loads `data/signals.tsv` and the generated `src/data/opportunities.ts` and fails with a
   clear, specific message (naming the offending TSV row number and field) when:
   - the TSV does not have exactly 204 data rows with 7 non-empty fields each,
   - the set of distinct `source_url` values in the catalog differs from the TSV's (report
     missing and extra URLs separately),
   - the total number of source entries across all concepts is not exactly 204,
   - any catalog source entry's `title`, `date`, or `platform` is not byte-identical to the
     TSV row it corresponds to (match rows to entries by `source_url` + `date` + `title`),
   - any concept slug is duplicated, or any concept has zero sources.
3. Fix the data in `scripts/build-opportunities.mjs` so `npm run verify` passes:
   - Restore all 30 shortened source titles to the exact TSV text.
   - Add the 14 rows that are currently absent as source entries, each attached to the concept
     that already represents it (these are the corpus's genuine repeat requests — for example
     the private styling-feedback request appears three times across r/AppIdeas on two dates,
     and the narrative/worldbuilding format request appears twice). Do not create new concepts
     for them and do not drop any.
   - Leave `concept`, `need`, `monetization`, `category`, `demo`, and `tags` alone. Those are
     Wishbuilt's own editorial summaries, which is fine and already disclosed; only the four
     source-record fields must be verbatim.
   - Regenerate `src/data/opportunities.ts` with `npm run data` and commit it.
4. `src/lib/__tests__/corpus.test.ts` (or the repo's existing test location convention) —
   asserting: the catalog has exactly 204 source entries; 172 distinct source URLs; every
   concept has at least one source; all slugs unique; the concept count is stable and stated
   as a single exported constant rather than a magic number repeated across files; and a
   verbatim spot-check of at least 3 specific source titles read from `data/signals.tsv`
   (including one of the previously truncated ones) asserted as exact full strings.
5. Update the README "Data" section to document `data/signals.tsv` as the provenance file, the
   204-row/187-concept relationship, and `npm run verify`.

**Verification:** `npm run verify` exits 0. `npm test`, `npx tsc --noEmit`, and `npm run build`
all pass. `npm run data` is idempotent (running it produces no git diff).

## Task 2 — Explainable scoring engine

**Goal:** Score every concept on four transparent axes so the catalog can be ranked.

**Deliverables**

1. `src/lib/scoring.ts` — pure module, no React. Exports:
   - `type Factor = { label: string; delta: number; evidence: string }`
   - `type Score = { value: number; baseline: number; factors: Factor[] }`
   - `scoreOpportunity(o: Opportunity): OpportunityScores` returning four sub-scores plus a
     composite, each a `Score` clamped to 0–100 and rounded to an integer:
     - **`demand`** — how strong the evidence of want is. Driven by the number of independent
       source entries (repeat requests are the strongest signal available in this corpus),
       the number of distinct communities and distinct dates the requests span, and
       explicit-absence phrasing in the source titles ("is there a tool", "why is there no",
       "looking for an app", "I wish"). Being asked for three times across two subreddits must
       score materially higher than a single mention.
     - **`feasibility`** — **higher means easier to ship.** Penalize signals whose text implies
       on-device ML, OS-level or kernel hooks, hardware/acoustic sensing, telephony, bank
       connections, native multi-platform work, or a two-sided marketplace. Reward
       single-surface CRUD, browser extensions, and static or derived-data products.
     - **`moat`** — durability of the business. Penalize dependence on third-party platform
       APIs that can revoke access (named consumer social platforms), single-OS lock-in, and
       thin wrappers. Reward local-first/privacy positioning, regulated-domain trust
       requirements, proprietary data accumulation, and workflow lock-in.
     - **`revenue`** — quality of the stated business model. Reward a concrete stated price, a
       professional or business buyer, recurring over one-time, and higher price points.
       Penalize vague monetization and consumer micro-pricing.
     - **`composite`** — the weighted blend. Weights live in one exported constant
       `SCORE_WEIGHTS` that must sum to 1, so the blend is inspectable and testable.
   - `SCORE_WEIGHTS`, and the keyword rule tables, exported so tests and UI can read them.
   Rule tables must be data, not sprawling `if` chains, so a reader can see every rule at once.
2. `src/lib/pricing.ts` — `parsePricing(monetization: string)` extracting each dollar figure
   with its cadence (`per-month`, `per-year`, `one-time`, `per-seat-month`, `per-unit`,
   `percentage`), plus a normalized monthly-equivalent for ranking (annual ÷ 12; one-time is
   kept as its own cadence and **not** converted to monthly) and the raw matched substrings.
   Must handle every shape in the corpus, including `$5–10/mo` (note: the data uses en-dashes),
   `$19–$79/mo`, `$0.0005 per execution second`, `$499–$1,500/year`, `10–15%`,
   `$29/mo or $249/yr`, `$3/contractor/mo`, `$299/semester/course`, and text with no figure.
3. `src/lib/scores-data.ts` (or equivalent) — computes scores for all concepts once at module
   scope and exports the lookup plus derived rank, so pages never recompute per render.
4. Tests:
   - All 187 concepts produce integer sub-scores within 0–100.
   - The factor-sum identity (`value === clamp(baseline + sum(factors.delta))`) holds for every
     sub-score of every concept.
   - `SCORE_WEIGHTS` sums to 1 and `composite` matches the weighted blend for a hand-computed
     example.
   - Scoring is pure: two calls on the same input are deeply equal.
   - Ordering assertions that encode the intent rather than a snapshot: a concept with three
     independent sources scores higher on `demand` than an otherwise comparable
     single-source concept; a concept whose text implies on-device ML scores lower on
     `feasibility` than a browser-extension concept; a concept dependent on a named consumer
     social platform's API scores lower on `moat` than a local-first desktop concept.
   - `parsePricing` returns the specific expected figures and cadences for at least 10 named
     corpus strings, covering every awkward shape listed above.
   - Every factor has a non-empty label and non-empty evidence, and no factor has a zero delta
     (a factor that changes nothing must not be reported as a factor).

**Verification:** `npm test` and `npx tsc --noEmit` pass.

## Task 3 — Build spec generator

**Goal:** Turn each concept into a concrete "how would I actually start this" brief.

**Deliverables**

1. `src/lib/build-spec.ts` — pure module. `generateBuildSpec(o: Opportunity): BuildSpec` with:
   - `stack`: 3–5 technology choices, each with a one-line rationale, selected from rule tables
     keyed on the concept's `demo` kind, `category`, and detected traits (e.g. a local-first
     desktop concept implies Tauri + SQLite and explicitly no server; an API/infra concept
     implies a queue and idempotency keys).
   - `mvpScope`: `{ must: string[]; later: string[]; excluded: string[] }` — the thin first
     slice, deferred work, and what to deliberately not build. Entries must be concrete
     capabilities derived from the concept's own need text, not generic filler.
   - `dataModel`: 3–6 core entities, each with its key fields.
   - `risks`: the specific risks implied by detected traits, each with a mitigation. A concept
     depending on a third-party platform API must always surface an API-access risk; a
     regulated-domain concept (medical, banking, legal, tenancy) must always surface a
     compliance risk; an AI/ML-dependent concept must always surface an accuracy/evaluation
     risk.
   - `milestones`: exactly 3 ordered milestones, each with a name and a verifiable exit
     criterion.
   - `pricing`: a recommended entry price and model anchored on the concept's own stated
     monetization, citing the figures parsed in Task 2, with a rationale.
   - `distribution`: 2–4 concrete first-user channels, biased toward the communities the
     concept was actually discovered in (its own subreddit or HN thread is the warmest
     channel available and must be named).
   - `provenance`: an explicit note that the spec is rule-generated from the concept's text,
     listing which rules fired.
2. No generated string may contain a placeholder token — no `TODO`, no `Lorem`, no `{{`, no
   empty strings, no doubled spaces.
3. Tests:
   - Generating specs for all 187 concepts yields no empty arrays where the type promises
     content, `mvpScope.must` has 3–6 entries, and `milestones` has exactly 3, for every
     concept.
   - No placeholder tokens in any generated string across the whole corpus.
   - The three trait→risk implications above hold for every concept carrying that trait.
   - Generation is pure (two calls deeply equal).
   - At least 3 named concepts produce specs asserted to contain specific expected substrings —
     e.g. `bank-statement-parser` mentions extraction accuracy, `local-semantic-search`
     recommends a local-first stack and names no server, and `multi-os-sandbox-api` surfaces
     isolation/untrusted-code risk.
   - Every concept's `distribution` names at least one of its own source platforms.

**Verification:** `npm test` and `npx tsc --noEmit` pass.

## Task 4 — Surface scores and specs in the UI

**Goal:** Make the ranking and the specs usable from the catalog and the concept pages.

**Deliverables**

1. `src/components/score-bar.tsx` (or similar) — a small reusable score display: the four
   sub-scores as compact labelled bars plus the composite as a number. Must show the numeric
   value as text, not color alone, and be marked as a Wishbuilt estimate.
2. Catalog (`src/components/catalog.tsx`, `src/lib/catalog.ts`) — extend, do not rewrite:
   - A sort control: composite score (default), demand, easiest to build, strongest moat,
     revenue potential, most-requested, and A–Z. Sorting must be stable and deterministic.
   - A "requested more than once" filter toggle, showing how many concepts qualify.
   - Each card gains the composite score and its source-entry count when > 1.
   - The existing search and category filters, the result-count line, and the empty state must
     keep working exactly as they do now, and the existing catalog tests must still pass
     unchanged. Extend `filterOpportunities` (or add a sibling) without breaking its signature
     used by current tests.
3. Concept page (`src/app/need/[slug]/page.tsx`) — add two sections below the existing content,
   keeping the prototype and source list where they are:
   - **Assessment** — the four sub-scores and composite, each expandable via real disclosure
     semantics (`<details>` or the shadcn primitive) to show every factor's label,
     contribution, and evidence, and stating the baseline so the arithmetic reconciles
     visibly. Clearly labelled as Wishbuilt's own heuristic estimate, not source data.
   - **Build spec** — the Task 3 output rendered as a readable brief: stack with rationales,
     MVP scope split into must/later/excluded, data-model entities, risks with mitigations,
     the 3 milestones with exit criteria, the pricing recommendation, distribution channels,
     and the provenance note.
   - When a concept has more than one source entry, add a short line framing them as
     independent requests for the same thing.
4. Responsive and keyboard accessible; verify the catalog and a concept page at 375px and
   1440px.

**Verification:** `npm test` (including the pre-existing catalog tests, unchanged),
`npx tsc --noEmit`, and `npm run build` all pass. The static export still emits a page per
concept.

## Task 5 — Shortlist, exports, and the corpus overview

**Goal:** Close the loop from browsing to a decision and an artifact.

**Deliverables**

1. `src/lib/shortlist.ts` + a React hook — shortlist persisted to `localStorage` under a
   versioned key. Must degrade to in-memory without throwing when storage is unavailable,
   disabled, or holds corrupt JSON; unknown slugs in stored data are dropped on read. No
   server-side `localStorage` access and no hydration mismatch (server renders the empty
   state; the client reconciles after mount). Unit-tested against a stubbed storage that
   throws, and against corrupt stored JSON.
2. A shortlist toggle on the concept page and on catalog cards, with an accessible pressed
   state.
3. `src/app/shortlist/page.tsx` — the shortlisted concepts compared across the four sub-scores,
   composite, category, and recommended entry price, with the best value per numeric column
   marked (and marked in text, not color alone). A real empty state linking back to the
   catalog. Remove-one and clear-all.
4. `src/lib/export.ts` — three pure exporters returning strings:
   - a Markdown build brief (per concept: sources, scores, full build spec) suitable for
     pasting into an issue tracker,
   - JSON of the full enriched records,
   - CSV with RFC 4180 quoting — fields containing a comma, double quote, or newline are
     quoted and inner quotes doubled, and no field is allowed to begin with `=`, `+`, `-`, or
     `@` unescaped (formula injection).
   Download via a Blob object URL that is revoked after use. Tests must assert the exact
   quoting behavior for a field with a comma, a field with a double quote, and a field with a
   newline, and that the JSON export round-trips the four verbatim source fields intact.
5. `src/app/overview/page.tsx` — corpus overview, all figures computed from the data and never
   hardcoded: totals (204 signals → 187 concepts → 172 threads), distribution by category,
   platform, and demo kind, the most-requested concepts (largest source-entry counts), a
   feasibility-vs-composite scatter as inline SVG with a text alternative conveying the same
   information, and the top 10 by composite score.
6. Header navigation gains Overview and Shortlist links, matching the existing header style.
7. README updated: the scoring model and its four axes explained, the build-spec generator
   described as rule-based, `npm run verify` documented, and the "What this is not" section
   extended to state plainly that scores and specs are transparent heuristics computed from
   the signal text — not market research, revenue projections, or investment advice.

**Verification:** `npm test`, `npx tsc --noEmit`, and `npm run build` all pass. Overview
figures match the dataset. Exports produce valid, correctly quoted files.
