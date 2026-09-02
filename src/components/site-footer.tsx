import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Wishbuilt publishes validated unmet needs. Each page is a concept
          prototype — not a production vendor claim.
        </p>
        <div className="flex gap-4">
          <Link href="/about/" className="hover:text-foreground">
            How this was sourced
          </Link>
        </div>
      </div>
    </footer>
  );
}
