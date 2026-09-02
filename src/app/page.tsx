import { Catalog } from "@/components/catalog";
import { opportunities } from "@/data/opportunities";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Public demand radar
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-newsreader)] text-4xl leading-tight sm:text-6xl">
          {opportunities.length} validated software gaps, each with a working
          prototype.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Sourced from Reddit, Hacker News, and Indie Hackers. Browse the unmet
          need, the niche, the monetization, the original thread — then try the
          concept in the browser.
        </p>
      </div>
      <div className="mt-10">
        <Catalog />
      </div>
    </div>
  );
}
