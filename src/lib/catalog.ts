import type { Category, Opportunity } from "@/data/types";

export function filterOpportunities(
  items: Opportunity[],
  query: string,
  category: Category | "All",
): Opportunity[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (!q) return true;
    const hay = [
      item.concept,
      item.need,
      item.monetization,
      item.tags.join(" "),
      item.sources.map((s) => `${s.platform} ${s.title}`).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
