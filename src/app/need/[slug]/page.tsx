import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getOpportunity, opportunities } from "@/data/opportunities";
import { Badge } from "@/components/ui/badge";
import { Prototype } from "@/components/prototype";

export function generateStaticParams() {
  return opportunities.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getOpportunity(slug);
  if (!item) return { title: "Not found" };
  return {
    title: item.concept,
    description: item.need,
  };
}

export default async function NeedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getOpportunity(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All gaps
      </Link>
      <div className="mt-6 flex flex-wrap gap-2">
        <Badge>{item.category}</Badge>
        {item.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-newsreader)] text-4xl leading-tight sm:text-5xl">
        {item.concept}
      </h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border bg-card p-5 sm:p-7">
          <Prototype opportunity={item} />
        </section>
        <aside className="space-y-6">
          <section>
            <h2 className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Unmet need
            </h2>
            <p className="mt-2 text-base leading-relaxed">{item.need}</p>
          </section>
          <section>
            <h2 className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Monetization
            </h2>
            <p className="mt-2 text-base leading-relaxed">{item.monetization}</p>
          </section>
          <section>
            <h2 className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Sources
            </h2>
            <ul className="mt-3 space-y-3">
              {item.sources.map((source) => (
                <li key={source.url + source.title}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start justify-between gap-3 rounded-lg border bg-card px-3 py-3 hover:border-primary/40"
                  >
                    <div>
                      <p className="text-sm font-medium group-hover:underline">
                        {source.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {source.date} · {source.platform}
                      </p>
                    </div>
                    <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </article>
  );
}
