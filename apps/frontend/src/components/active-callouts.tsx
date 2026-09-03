/**
 * Active Call-outs Section
 * Shows live rescue requests on the landing page
 */

import Link from 'next/link';
import { Clock, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { rescues, type Urgency } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

const urgencyColors: Record<Urgency, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/50',
  high: 'bg-warning/15 text-warning border-warning/50',
  routine: 'bg-muted text-muted-foreground border-border',
};

const statusColors = {
  new: 'bg-warning/15 text-warning border-warning/50',
  assigned: 'bg-accent/15 text-accent border-accent/50',
  'en-route': 'bg-primary/15 text-primary border-primary/50',
  'on-site': 'bg-success/15 text-success border-success/50',
  released: 'bg-muted text-muted-foreground border-border',
  closed: 'bg-muted text-muted-foreground border-border',
};

export function ActiveCallouts() {
  // Show only active rescues (not released/closed)
  const activeRescues = rescues
    .filter((r) => !['released', 'closed'].includes(r.status))
    .slice(0, 4);

  return (
    <div className="bg-gradient-to-b from-background via-primary/5 to-background border-t border-border/20">
      <div className="mx-auto max-w-[1400px] px-5 py-20 lg:py-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
              Live Board
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Active call-outs
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
              Incoming reports triaged by urgency, with the nearest certified
              handler assigned automatically.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex hover:border-primary/50 transition-all"
          >
            <Link href="/rescues">View all rescues</Link>
          </Button>
        </div>

        {/* Rescue Cards Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {activeRescues.map((rescue) => (
            <div
              key={rescue.id}
              className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/60 p-6 backdrop-blur-xl shadow-md transition-all hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-muted-foreground">
                      {rescue.code}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider',
                        urgencyColors[rescue.urgency],
                      )}
                    >
                      {rescue.urgency}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider',
                        statusColors[rescue.status],
                      )}
                    >
                      {rescue.status.replace('-', ' ')}
                    </Badge>
                    {rescue.venomous && (
                      <Badge
                        variant="outline"
                        className="bg-destructive/15 text-destructive border-destructive/50 text-[10px] font-bold uppercase tracking-wider"
                      >
                        Venomous
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Species */}
                <h3 className="mt-4 text-xl font-bold text-foreground">
                  {rescue.species}
                </h3>

                {/* Location */}
                <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {rescue.location} · {rescue.district}
                  </span>
                </div>

                {/* Notes */}
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {rescue.notes}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-border/30 pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{rescue.reportedAt}</span>
                  </div>
                  {rescue.responder && (
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>{rescue.responder}</span>
                    </div>
                  )}
                  {!rescue.responder && (
                    <span className="text-xs font-semibold text-destructive">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Features */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/60 p-7 backdrop-blur-xl shadow-md hover:shadow-lg hover:border-primary/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shadow-sm">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Triage in seconds
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Reports are scored by venom risk, crowd exposure and distance
                before a handler is paged.
              </p>
              <Link
                href="/rescues"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
              >
                Dispatch board
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/60 p-7 backdrop-blur-xl shadow-md hover:shadow-lg hover:border-primary/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-success/10 text-success shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Ready responders
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                5 handlers on duty across six districts, with certifications and
                drill history tracked.
              </p>
              <Link
                href="/volunteers"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
              >
                Volunteer roster
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/60 p-7 backdrop-blur-xl shadow-md hover:shadow-lg hover:border-primary/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gray-300 dark:bg-gray-600 text-black dark:text-white shadow-sm">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Community first
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Awareness posts, school sessions and first-aid guidance that
                reduce bites before they happen.
              </p>
              <Link
                href="/community"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
              >
                Community hub
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/rescues">View all rescues</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
