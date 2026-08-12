'use client'

import { useMemo, useState } from "react";
import { Clock, MapPin, Phone, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Pill, StatusPill, UrgencyPill } from "@/components/ui-bits";
import { rescues, volunteers, type Rescue } from "@/lib/demo-data";

const filters = ["all", "critical", "unassigned", "closed"] as const;

export default function RescuesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [selected, setSelected] = useState<Rescue>(rescues[0] as Rescue);

  const list = useMemo(() => {
    if (filter === "critical") return rescues.filter((r) => r.urgency === "critical");
    if (filter === "unassigned") return rescues.filter((r) => !r.responder);
    if (filter === "closed") return rescues.filter((r) => r.status === "closed" || r.status === "released");
    return rescues;
  }, [filter]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <PageHeader
        eyebrow="Dispatch"
        title="Rescue call-out board"
        description="Every report that reaches the hotline lands here. Triage by venom risk and exposure, then page the nearest certified handler."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors " +
              (filter === f
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {list.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={
                "w-full rounded-xl border p-4 text-left transition-colors " +
                (selected.id === r.id
                  ? "border-primary/60 bg-primary/5"
                  : "border-border/70 bg-card/60 hover:border-border")
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
                <UrgencyPill urgency={r.urgency} />
                <StatusPill status={r.status} />
              </div>
              <p className="mt-2 font-semibold">{r.species}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {r.location}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {r.reportedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> {r.responder ?? "Unassigned"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border/70 bg-card/70">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{selected.code}</span>
                {selected.venomous && (
                  <span className="rounded-full border border-destructive/40 bg-destructive/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-destructive">
                    Venomous
                  </span>
                )}
                <StatusPill status={selected.status} />
              </div>
              <h2 className="mt-3 text-2xl font-bold">{selected.species}</h2>

              <div className="mt-4 scale-pattern relative h-44 overflow-hidden rounded-lg border border-border/70 bg-secondary/40">
                <span
                  className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-destructive/25 text-sm"
                  style={{ left: `${selected.coords.x}%`, top: `${selected.coords.y}%` }}
                >
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-destructive" />
                </span>
                <span className="absolute bottom-2 left-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {selected.district} sector map
                </span>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Location", selected.location],
                  ["Reported by", selected.reportedBy],
                  ["Contact", selected.phone],
                  ["Responder", selected.responder ?? "Awaiting assignment"],
                  ["Field notes", selected.notes],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => toast.success(`Handler paged for ${selected.code}`)}>
                  Assign nearest handler
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast(`Calling ${selected.reportedBy}…`)}>
                  <Phone className="mr-1.5 h-3.5 w-3.5" /> Call reporter
                </Button>
              </div>

              <div className="mt-5 border-t border-border/70 pt-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Nearby available handlers</p>
                <div className="mt-3 space-y-2">
                  {volunteers
                    .filter((v) => v.status === "available" || v.status === "on-call")
                    .slice(0, 3)
                    .map((v) => (
                      <div key={v.id} className="flex items-center justify-between text-sm">
                        <span>
                          {v.name} <span className="text-muted-foreground">· {v.district}</span>
                        </span>
                        <Pill className="border-primary/40 bg-primary/10 text-primary">{v.status}</Pill>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <ReportForm />
        </div>
      </div>
    </div>
  );
}

function ReportForm() {
  return (
    <Card className="border-border/70 bg-card/70">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold">Report a snake sighting</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep everyone at a distance of at least 5 metres while you fill this in.
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Report submitted — a handler will call you within 2 minutes.");
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" placeholder="Sunita M." required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+977 …" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="loc">Location</Label>
            <Input id="loc" placeholder="Landmark, ward, district" required />
          </div>
          <div className="space-y-1.5">
            <Label>Urgency</Label>
            <Select defaultValue="high">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical — people at immediate risk</SelectItem>
                <SelectItem value="high">High — snake inside a building</SelectItem>
                <SelectItem value="routine">Routine — snake in open area</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">What do you see?</Label>
            <Textarea id="desc" rows={3} placeholder="Size, colour, where it is hiding…" />
          </div>
          <Button type="submit" className="w-full">
            <Send className="mr-1.5 h-4 w-4" /> Send report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
