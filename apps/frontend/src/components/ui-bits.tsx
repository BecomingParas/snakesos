import { cn } from "@/lib/utils";
import type { RescueStatus, Urgency } from "@/lib/demo-data";

const urgencyStyles: Record<Urgency, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/40",
  high: "bg-warning/15 text-warning border-warning/40",
  routine: "bg-muted text-muted-foreground border-border",
};

const statusStyles: Record<RescueStatus, string> = {
  new: "bg-destructive/15 text-destructive border-destructive/40",
  assigned: "bg-accent/15 text-accent border-accent/40",
  "en-route": "bg-accent/15 text-accent border-accent/40",
  "on-site": "bg-primary/15 text-primary border-primary/40",
  released: "bg-success/15 text-success border-success/40",
  closed: "bg-muted text-muted-foreground border-border",
};

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function UrgencyPill({ urgency }: { urgency: Urgency }) {
  return <Pill className={urgencyStyles[urgency]}>{urgency}</Pill>;
}

export function StatusPill({ status }: { status: RescueStatus }) {
  return <Pill className={statusStyles[status]}>{status.replace("-", " ")}</Pill>;
}

export function VenomPill({ venomous }: { venomous: boolean }) {
  return (
    <Pill className={venomous ? "border-destructive/40 bg-destructive/15 text-destructive" : "border-success/40 bg-success/15 text-success"}>
      {venomous ? "Venomous" : "Non-venomous"}
    </Pill>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
