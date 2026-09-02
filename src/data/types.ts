export type DemoKind =
  | "focus"
  | "inbox"
  | "radar"
  | "canvas"
  | "parser"
  | "tracker"
  | "marketplace"
  | "devtools"
  | "wellness"
  | "search"
  | "social"
  | "finance"
  | "desktop";

export type Category =
  | "Productivity"
  | "Developer Tools"
  | "SaaS / B2B"
  | "Consumer"
  | "Health & ADHD"
  | "Travel & Local"
  | "Commerce"
  | "Desktop Utilities"
  | "Creative"
  | "Data & AI"
  | "Finance";

export type Source = {
  date: string;
  platform: string;
  title: string;
  url: string;
};

export type Opportunity = {
  slug: string;
  concept: string;
  need: string;
  monetization: string;
  category: Category;
  demo: DemoKind;
  tags: string[];
  sources: Source[];
};
