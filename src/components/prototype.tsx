"use client";

import { useMemo, useState } from "react";
import type { Opportunity } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function seedItems(op: Opportunity): string[] {
  const words = op.concept.split(/[&,]/).map((s) => s.trim()).filter(Boolean);
  return [
    words[0] ?? "Primary item",
    words[1] ?? "Follow-up item",
    `${op.tags[0] ?? "core"} checkpoint`,
    `Review ${op.category.toLowerCase()} signal`,
  ];
}

function FocusDemo({ op }: { op: Opportunity }) {
  const queue = useMemo(() => seedItems(op), [op]);
  const [index, setIndex] = useState(0);
  const [dump, setDump] = useState("");
  const [parsed, setParsed] = useState<string[]>([]);
  const current = queue[index];

  return (
    <div className="space-y-4">
      {current ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Only this · {index + 1} of {queue.length}
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-newsreader)] text-3xl">
            {current}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Everything else is hidden. Complete this, and the next blocked item
            promotes automatically.
          </p>
          <Button
            type="button"
            className="mt-6"
            onClick={() => setIndex((i) => i + 1)}
          >
            Done — pull next
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-[family-name:var(--font-newsreader)] text-2xl">
            Queue clear
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setIndex(0)}>
            Restart sprint
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-sm font-medium">Brain dump</p>
        <Textarea
          value={dump}
          onChange={(e) => setDump(e.target.value)}
          placeholder="Unload the swirl. We'll scaffold it into actions."
        />
        <Button
          variant="secondary"
          onClick={() => {
            const bits = dump
              .split(/[,.]/)
              .map((s) => s.trim())
              .filter((s) => s.length > 2)
              .slice(0, 6);
            setParsed(bits.length ? bits : ["Capture one concrete next action"]);
          }}
        >
          Scaffold into tasks
        </Button>
        {parsed.length > 0 && (
          <ul className="space-y-1 text-sm">
            {parsed.map((item) => (
              <li key={item} className="rounded-md bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function InboxDemo({ op }: { op: Opportunity }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(() =>
    seedItems(op).map((title, i) => ({
      id: `${i}`,
      title,
      tag: op.tags[i % op.tags.length] ?? "saved",
    })),
  );
  const [draft, setDraft] = useState("");
  const visible = items.filter((item) =>
    `${item.title} ${item.tag}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search saved items…"
        />
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Capture…"
          />
          <Button
            onClick={() => {
              if (!draft.trim()) return;
              setItems((prev) => [
                {
                  id: crypto.randomUUID(),
                  title: draft.trim(),
                  tag: op.tags[0] ?? "inbox",
                },
                ...prev,
              ]);
              setDraft("");
            }}
          >
            Save
          </Button>
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Nothing matches. Clear the search or capture a new item.
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
            >
              <span>{item.title}</span>
              <Badge variant="secondary">{item.tag}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RadarDemo({ op }: { op: Opportunity }) {
  const [severity, setSeverity] = useState<"all" | "high" | "med">("all");
  const signals = useMemo(
    () => [
      { title: `Competitor complaint: ${op.tags[0] ?? "gap"}`, level: "high" as const },
      { title: `Feature request matching “${op.concept.split(" ")[0]}”`, level: "high" as const },
      { title: `Quiet praise on ${op.sources[0]?.platform ?? "the open web"}`, level: "med" as const },
      { title: "Renewal risk mentioned twice this week", level: "med" as const },
    ],
    [op],
  );
  const visible = signals.filter((s) => severity === "all" || s.level === severity);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["all", "high", "med"] as const).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={severity === key ? "default" : "outline"}
            onClick={() => setSeverity(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      <ul className="space-y-2">
        {visible.map((signal) => (
          <li key={signal.title} className="rounded-lg border bg-card px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">{signal.title}</p>
              <Badge variant={signal.level === "high" ? "default" : "secondary"}>
                {signal.level}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CanvasDemo({ op }: { op: Opportunity }) {
  const [nodes, setNodes] = useState(() =>
    seedItems(op).map((label, i) => ({ id: `${i}`, label, x: 8 + i * 18, y: 20 + (i % 2) * 28 })),
  );
  const [label, setLabel] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Drop a card on the canvas…"
        />
        <Button
          onClick={() => {
            if (!label.trim()) return;
            setNodes((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                label: label.trim(),
                x: 12 + (prev.length % 4) * 20,
                y: 16 + Math.floor(prev.length / 4) * 22,
              },
            ]);
            setLabel("");
          }}
        >
          Pin
        </Button>
      </div>
      <div className="relative h-64 overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_20%_20%,oklch(0.94_0.03_80),transparent_45%),radial-gradient(circle_at_80%_70%,oklch(0.93_0.03_50),transparent_40%)]">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            className="absolute max-w-36 rounded-md border bg-card px-2 py-1 text-left text-xs shadow-sm"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => setNodes((prev) => prev.filter((n) => n.id !== node.id))}
          >
            {node.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Click a card to remove it.</p>
    </div>
  );
}

function ParserDemo({ op }: { op: Opportunity }) {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<{ field: string; value: string }[]>([]);

  return (
    <div className="space-y-3">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Paste messy ${op.tags[0] ?? "source"} text, a listing, or a transcript…`}
      />
      <Button
        onClick={() => {
          const lines = input
            .split(/\n|,/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (!lines.length) {
            setRows([
              { field: "status", value: "waiting for input" },
              { field: "hint", value: "Paste anything unstructured — this demo extracts fields locally." },
            ]);
            return;
          }
          setRows(
            lines.slice(0, 8).map((line, i) => ({
              field: op.tags[i % op.tags.length] ?? `col_${i + 1}`,
              value: line,
            })),
          );
        }}
      >
        Parse locally
      </Button>
      {rows.length > 0 && (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-3 py-2">Field</th>
                <th className="px-3 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.field + row.value} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{row.field}</td>
                  <td className="px-3 py-2">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TrackerDemo({ op }: { op: Opportunity }) {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(seedItems(op).slice(0, 3).map((name) => [name, 0])),
  );

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Object.entries(counts).map(([name, count]) => (
        <button
          key={name}
          type="button"
          onClick={() =>
            setCounts((prev) => ({ ...prev, [name]: prev[name] + 1 }))
          }
          className="rounded-xl border bg-card p-4 text-left transition hover:border-primary/40"
        >
          <p className="text-xs text-muted-foreground">{op.tags[0] ?? "log"}</p>
          <p className="mt-1 text-sm font-medium">{name}</p>
          <p className="mt-3 font-[family-name:var(--font-newsreader)] text-3xl">
            {count}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">tap to log</p>
        </button>
      ))}
    </div>
  );
}

function MarketplaceDemo({ op }: { op: Opportunity }) {
  const [offer, setOffer] = useState("");
  const [sent, setSent] = useState(false);
  const listings = seedItems(op).slice(0, 3);

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <div key={listing} className="rounded-lg border bg-card px-3 py-3">
          <p className="font-medium">{listing}</p>
          <p className="text-xs text-muted-foreground">{op.monetization}</p>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          value={offer}
          onChange={(e) => {
            setOffer(e.target.value);
            setSent(false);
          }}
          placeholder="Blind offer or bounty note…"
        />
        <Button onClick={() => offer.trim() && setSent(true)}>Send</Button>
      </div>
      {sent && (
        <p className="text-sm text-muted-foreground">
          Offer held privately until the other side matches or claims.
        </p>
      )}
    </div>
  );
}

function DevtoolsDemo({ op }: { op: Opportunity }) {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-3">
        <div>
          <p className="text-sm font-medium">Pipeline</p>
          <p className="text-xs text-muted-foreground">{op.concept}</p>
        </div>
        <Button
          size="sm"
          disabled={running}
          onClick={() => {
            setRunning(true);
            setLog(["queued"]);
            window.setTimeout(() => setLog(["queued", "asserting outcomes"]), 250);
            window.setTimeout(() => {
              setLog(["queued", "asserting outcomes", "reconciled · ok"]);
              setRunning(false);
            }, 700);
          }}
        >
          {running ? "Running…" : "Run check"}
        </Button>
      </div>
      <pre className="min-h-24 rounded-lg bg-foreground p-3 font-mono text-xs text-background">
        {log.length ? log.map((line) => `› ${line}`).join("\n") : "› idle"}
      </pre>
    </div>
  );
}

function WellnessDemo({ op }: { op: Opportunity }) {
  const [intent, setIntent] = useState("");
  const [minutes, setMinutes] = useState(10);
  const [locked, setLocked] = useState(false);

  return (
    <div className="space-y-3">
      <Input
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="What are you opening this for?"
      />
      <div className="flex items-center gap-3">
        <Input
          type="number"
          min={1}
          max={90}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">minute session</span>
      </div>
      <Button onClick={() => intent.trim() && setLocked(true)}>
        Unlock with intention
      </Button>
      {locked && (
        <p className="rounded-lg bg-muted px-3 py-3 text-sm">
          Gate open for {minutes} minutes to “{intent}”. {op.tags.join(" · ")}{" "}
          stays in the background until the timer ends.
        </p>
      )}
    </div>
  );
}

function SearchDemo({ op }: { op: Opportunity }) {
  const corpus = useMemo(
    () => [
      op.need,
      op.monetization,
      ...seedItems(op),
      `${op.sources[0]?.title ?? "source"} excerpt`,
    ],
    [op],
  );
  const [q, setQ] = useState("");
  const hits = q.trim()
    ? corpus.filter((c) => c.toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <div className="space-y-3">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Local semantic-ish search (keyword, on-device)…"
      />
      {q && hits.length === 0 && (
        <p className="text-sm text-muted-foreground">No local excerpts matched.</p>
      )}
      <ul className="space-y-2">
        {hits.map((hit) => (
          <li key={hit} className="rounded-lg border bg-card px-3 py-2 text-sm">
            {hit}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialDemo({ op }: { op: Opportunity }) {
  const [yours, setYours] = useState("");
  const [theirs, setTheirs] = useState("");
  const match =
    yours.trim().length > 2 &&
    yours.trim().toLowerCase() === theirs.trim().toLowerCase();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">You</p>
        <Input
          value={yours}
          onChange={(e) => setYours(e.target.value)}
          placeholder="Private desire or plan…"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Them</p>
        <Input
          value={theirs}
          onChange={(e) => setTheirs(e.target.value)}
          placeholder="Independent entry…"
        />
      </div>
      <div
        className="sm:col-span-2 rounded-lg border bg-card p-4 text-sm"
        data-testid="match-status"
        aria-live="polite"
      >
        {match
          ? `Match revealed: ${yours}. Both sides entered it independently.`
          : `Held encrypted. ${op.concept.split(" ")[0]} stays hidden until both sides type the same thing.`}
      </div>
    </div>
  );
}

function FinanceDemo({ op }: { op: Opportunity }) {
  const [burn, setBurn] = useState(18000);
  const cash = 214000;
  const runway = Math.max(0, Math.round((cash / Math.max(burn, 1)) * 10) / 10);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cash</CardTitle>
          </CardHeader>
          <CardContent className="font-[family-name:var(--font-newsreader)] text-3xl">
            ${cash.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly burn</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={burn}
              onChange={(e) => setBurn(Number(e.target.value))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Runway</CardTitle>
          </CardHeader>
          <CardContent className="font-[family-name:var(--font-newsreader)] text-3xl">
            {runway} mo
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">{op.need}</p>
    </div>
  );
}

function DesktopDemo({ op }: { op: Opportunity }) {
  const [active, setActive] = useState<string | null>(null);
  const presets = ["Focus / Work", "Review / Calls", "Evening / Games"];

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {presets.map((preset) => (
          <Button
            key={preset}
            variant={active === preset ? "default" : "outline"}
            onClick={() => setActive(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>
      <div className="rounded-xl border bg-muted/50 p-4 text-sm">
        {active
          ? `${active} loaded. Windows snap to the saved ${op.tags[0] ?? "layout"} coordinates. ${op.concept} stays one hotkey away.`
          : "No preset loaded. Pick a workspace to launch the saved window map."}
      </div>
    </div>
  );
}

export function Prototype({ opportunity }: { opportunity: Opportunity }) {
  const kind = opportunity.demo;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Live prototype
          </p>
          <p className="text-sm text-muted-foreground">
            Client-side only. Nothing leaves this browser.
          </p>
        </div>
        <Badge variant="outline">{kind}</Badge>
      </div>
      {kind === "focus" && <FocusDemo op={opportunity} />}
      {kind === "inbox" && <InboxDemo op={opportunity} />}
      {kind === "radar" && <RadarDemo op={opportunity} />}
      {kind === "canvas" && <CanvasDemo op={opportunity} />}
      {kind === "parser" && <ParserDemo op={opportunity} />}
      {kind === "tracker" && <TrackerDemo op={opportunity} />}
      {kind === "marketplace" && <MarketplaceDemo op={opportunity} />}
      {kind === "devtools" && <DevtoolsDemo op={opportunity} />}
      {kind === "wellness" && <WellnessDemo op={opportunity} />}
      {kind === "search" && <SearchDemo op={opportunity} />}
      {kind === "social" && <SocialDemo op={opportunity} />}
      {kind === "finance" && <FinanceDemo op={opportunity} />}
      {kind === "desktop" && <DesktopDemo op={opportunity} />}
    </div>
  );
}
