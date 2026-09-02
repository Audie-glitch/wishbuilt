import Link from "next/link";

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
      <Link
        href="/"
        className="mt-6 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Back to the catalog
      </Link>
    </div>
  );
}
