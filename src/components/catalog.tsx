"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { opportunities, categories } from "@/data/opportunities";
import type { Category } from "@/data/types";
import { filterOpportunities } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const visible = useMemo(
    () => filterOpportunities(opportunities, query, category),
    [query, category],
  );

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search needs, platforms, monetization…"
          className="h-12 pl-10"
          aria-label="Search opportunities"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <Button
          type="button"
          size="sm"
          variant={category === "All" ? "default" : "outline"}
          aria-pressed={category === "All"}
          onClick={() => setCategory("All")}
        >
          All
        </Button>
        {categories.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={category === item ? "default" : "outline"}
            aria-pressed={category === item}
            onClick={() => setCategory(item as Category)}
          >
            {item}
          </Button>
        ))}
      </div>
      <p
        className="mt-5 text-sm text-muted-foreground"
        data-testid="result-count"
        aria-live="polite"
      >
        {visible.length} of {opportunities.length} published gaps
        {query.trim() ? ` matching “${query.trim()}”` : ""}
        {category !== "All" ? ` in ${category}` : ""}
      </p>
      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed p-10 text-center">
          <p className="font-[family-name:var(--font-newsreader)] text-2xl">
            No matches
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader term, or reset the category filter.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {visible.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/need/${item.slug}/`}
                className="block h-full rounded-2xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.sources[0]?.platform}
                  </span>
                </div>
                <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-xl leading-snug">
                  {item.concept}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {item.need}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {item.monetization}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
