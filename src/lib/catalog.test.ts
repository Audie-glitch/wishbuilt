import { describe, expect, it } from "vitest";
import { opportunities } from "@/data/opportunities";
import { filterOpportunities } from "./catalog";

describe("filterOpportunities", () => {
  it("returns all items when query and category are open", () => {
    expect(filterOpportunities(opportunities, "", "All")).toHaveLength(
      opportunities.length,
    );
  });

  it("filters by category", () => {
    const result = filterOpportunities(opportunities, "", "Developer Tools");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.category === "Developer Tools")).toBe(
      true,
    );
  });

  it("matches concept, need, and platform text", () => {
    const bookmark = filterOpportunities(opportunities, "bookmark", "All");
    expect(bookmark.length).toBeGreaterThan(0);
    expect(bookmark.length).toBeLessThan(opportunities.length);
    expect(bookmark.some((item) => item.slug === "universal-bookmark-hub")).toBe(
      true,
    );
  });

  it("returns an empty list for nonsense", () => {
    expect(
      filterOpportunities(opportunities, "zzzxq-not-a-real-need", "All"),
    ).toHaveLength(0);
  });
});

describe("opportunity catalog integrity", () => {
  it("has unique slugs", () => {
    const slugs = opportunities.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("requires a source url and concept for every row", () => {
    for (const item of opportunities) {
      expect(item.concept.length).toBeGreaterThan(8);
      expect(item.need.length).toBeGreaterThan(20);
      expect(item.sources.length).toBeGreaterThan(0);
      expect(item.sources[0]?.url.startsWith("http")).toBe(true);
    }
  });
});
