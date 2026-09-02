import type { Metadata } from "next";
import { opportunities } from "@/data/opportunities";

export const metadata: Metadata = {
  title: "About",
  description: "How Wishbuilt sources and publishes validated software gaps.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <h1 className="font-[family-name:var(--font-newsreader)] text-4xl sm:text-5xl">
        A radar, not a graveyard of half-built apps.
      </h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          Between 23–25 August 2026, founders and operators posted the same
          pattern across Reddit, Hacker News, and Indie Hackers: a concrete
          unmet need, a proposed niche, and a guess at how it could pay.
        </p>
        <p>
          Wishbuilt publishes all {opportunities.length} unique concepts from
          that harvest. Duplicate threads (the same gift vault, the same outfit
          review exchange, the same calendar Pomodoro) are merged onto one page
          with every source linked.
        </p>
        <p>
          Each page includes a working in-browser prototype so you can feel the
          interaction, not just read a pitch. Prototypes run entirely on-device.
          No accounts, no telemetry, no vendor lock-in.
        </p>
        <p>
          This is a catalog of demand signals — a Somebody-Make-This index you
          can search, filter, and ship from.
        </p>
      </div>
    </div>
  );
}
