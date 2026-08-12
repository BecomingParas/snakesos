/**
 * Active Call-outs Section
 * Shows live rescue requests on the landing page
 */

import Link from "next/link";
import { Clock, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rescues, type Urgency } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const urgencyColors: Record<Urgency, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/50",
  high: "bg-warning/15 text-warning border-warning/50",
  routine: "bg-muted text-muted-foreground border-border",
};

const statusColors = {
  new: "bg-warning/15 text-warning border-warning/50",
  assigned: "bg-accent/15 text-accent border-accent/50",
  "en-route": "bg-primary/15 text-primary border-primary/50",
  "on-site": "bg-success/15 text-success border-success/50",
  released: "bg-muted text-muted-foreground border-border",
  closed: "bg-muted text-muted-foreground border-border",
};

export function ActiveCallouts() {
  // Show only active rescues (not released/closed)
  const activeRescues = rescues
    .filter((r) => !["released", "closed"].includes(r.status))
    .slice(0, 4);

  return (
    <div className="bg-card/30 border-t border-border/70">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Live Board
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Active call-outs
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Incoming reports triaged by urgency, with the nearest certified handler assigned
              automatically.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/rescues">View all rescues</Link>
          </Button>
        </div>

        {/* Rescue Cards Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {activeRescues.map((rescue) => (
            <div
              key={rescue.id}
              className="group rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-muted-foreground">
                    {rescue.code}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] font-bold uppercase", urgencyColors[rescue.urgency])}
                  >
                    {rescue.urgency}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] font-bold uppercase", statusColors[rescue.status])}
                  >
                    {rescue.status.replace("-", " ")}
                  </Badge>
                  {rescue.venomous && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/15 text-destructive border-destructive/50 text-[10px] font-bold uppercase"
                    >
                      Venomous
                    </Badge>
                  )}
                </div>
              </div>

              {/* Species */}
              <h3 className="mt-3 font-display text-xl font-bold">{rescue.species}</h3>

              {/* Location */}
              <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{rescue.location} · {rescue.district}</span>
              </div>

              {/* Notes */}
              <p className="mt-3 text-sm text-muted-foreground">{rescue.notes}</p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-border/50 pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{rescue.reportedAt}</span>
                </div>
                {rescue.responder && (
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span>{rescue.responder}</span>
                  </div>
                )}
                {!rescue.responder && (
                  <span className="text-xs font-semibold text-destructive">Unassigned</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Features */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-card/40 p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/15">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold">Triage in seconds</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Reports are scored by venom risk, crowd exposure and distance before a handler is paged.
            </p>
            <Link
              href="/rescues"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              Dispatch board →
            </Link>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/40 p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-success/15">
              <User className="h-5 w-5 text-success" />
            </div>
            <h3 className="font-display text-lg font-bold">Ready responders</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              5 handlers on duty across six districts, with certifications and drill history tracked.
            </p>
            <Link
              href="/volunteers"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              Volunteer roster →
            </Link>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/40 p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-accent/15">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-display text-lg font-bold">Community first</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Awareness posts, school sessions and first-aid guidance that reduce bites before they happen.
            </p>
            <Link
              href="/community"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              Community hub →
            </Link>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/rescues">View all rescues</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
