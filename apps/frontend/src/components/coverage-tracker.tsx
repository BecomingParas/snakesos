'use client'

import { useState } from "react";
import dynamic from 'next/dynamic';

import { coverageZones, coverageSummary } from "@/lib/coverage-zones";
import { cn } from "@/lib/utils";

// Use Next.js dynamic import with ssr: false for client-only component
const CoverageMap = dynamic(() => import("@/components/coverage-map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center bg-secondary/40 text-xs text-muted-foreground">
      Loading satellite coverage…
    </div>
  );
}

export function CoverageTracker({ className }: { className?: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const active = coverageZones.find((z) => z.id === selected) ?? null;

  return (
    <div className={cn("grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]", className)}>
      <div className="h-[420px] overflow-hidden rounded-xl border border-border/70 sm:h-[520px]">
        <CoverageMap selected={selected} onSelect={setSelected} />
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <h3 className="font-display text-lg font-bold">Coverage Municipalities</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click any pulsing zone marker on the map to inspect nearby rescuer density and dispatch
            status.
          </p>
          <ul className="mt-4 space-y-2.5">
            {coverageZones.map((zone) => (
              <li key={zone.id}>
                <button
                  type="button"
                  onClick={() => setSelected(zone.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg border border-transparent bg-secondary/60 px-3.5 py-3 text-left transition-colors hover:bg-secondary",
                    selected === zone.id && "border-primary/60 bg-secondary",
                  )}
                >
                  <span>
                    <span className="block text-sm font-semibold">
                      {zone.name} ({zone.nepali})
                    </span>
                    <span className="block text-xs text-muted-foreground">{zone.coverage}</span>
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                      zone.status === "ready"
                        ? "bg-primary/15 text-primary"
                        : "bg-warning/15 text-warning",
                    )}
                  >
                    {zone.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/70 bg-card p-5">
          <div>
            <p className="text-xs text-muted-foreground">Ready Responders</p>
            <p className="mt-1 font-mono text-xl font-bold text-primary">
              {active ? active.rescuers : coverageSummary.readyResponders} Online
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Avg Dispatch Time</p>
            <p className="mt-1 font-display text-xl font-bold">
              {active ? active.avgResponse : coverageSummary.avgDispatch}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
