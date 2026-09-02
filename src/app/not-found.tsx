import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-newsreader)] text-4xl">
        That gap is not on the radar.
      </h1>
      <p className="mt-3 text-muted-foreground">
        The slug may have been merged into another concept, or it never existed.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to the catalog</Link>
      </Button>
    </div>
  );
}
