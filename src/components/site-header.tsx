import Link from "next/link";
import { Sparkles } from "lucide-react";
import { opportunities } from "@/data/opportunities";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="font-[family-name:var(--font-newsreader)] text-lg tracking-tight">
            Wishbuilt
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Radar
          </Link>
          <Link href="/about/" className="hover:text-foreground">
            About
          </Link>
          <span className="hidden rounded-full border border-border bg-card px-2.5 py-1 text-xs sm:inline">
            {opportunities.length} gaps
          </span>
        </nav>
      </div>
    </header>
  );
}
