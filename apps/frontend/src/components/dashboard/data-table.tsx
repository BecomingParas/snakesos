import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Columns3,
  Download,
  Inbox,
  Loader2,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TableDef, Row } from "@/lib/dashboard-data";
import { EmptyState } from "./widgets";

const toneFor = (value: string) => {
  const v = value.toUpperCase();
  if (["EMERGENCY", "FAILED", "CANCELLED", "REJECTED", "ERROR"].includes(v))
    return "border-destructive/40 bg-destructive/15 text-destructive";
  if (["HIGH", "PENDING", "BUSY", "REFUNDED", "WARNING"].includes(v))
    return "border-warning/40 bg-warning/15 text-warning";
  if (["COMPLETED", "APPROVED", "AVAILABLE", "SUCCESS"].includes(v))
    return "border-success/40 bg-success/15 text-success";
  if (["IN_PROGRESS", "ASSIGNED", "MEDIUM", "SUBSCRIPTION"].includes(v))
    return "border-accent/40 bg-accent/15 text-accent";
  return "border-border bg-muted text-muted-foreground";
};

export function BadgeCell({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        toneFor(value),
      )}
    >
      {value.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}

function csvEscape(value: string | number) {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function DataTable({
  table,
  loading = false,
  pageSize = 8,
  selectable = true,
  exportable = true,
}: {
  table: TableDef;
  loading?: boolean;
  pageSize?: number;
  selectable?: boolean;
  exportable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  const columns = table.columns.filter((c) => !hidden.has(c.key));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? table.rows.filter((r) =>
          Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
        )
      : table.rows;
    if (!sort) return base;
    const sorted = [...base].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
    return sort.dir === "asc" ? sorted : sorted.reverse();
  }, [table.rows, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * pageSize, current * pageSize + pageSize);

  const toggleSort = (key: string) =>
    setSort((s) =>
      s?.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" },
    );

  const rowIndex = (r: Row) => table.rows.indexOf(r);
  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(rowIndex(r)));

  const exportCsv = () => {
    setExporting(true);
    const source = selected.size
      ? table.rows.filter((_, i) => selected.has(i))
      : filtered;
    const header = columns.map((c) => csvEscape(c.label)).join(",");
    const body = source
      .map((r) => columns.map((c) => csvEscape(r[c.key] ?? "")).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${table.name}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    toast.success(`Exported ${source.length} rows`, { description: `${table.name}.csv` });
  };

  if (loading) {
    return (
      <div className="space-y-3 rounded-xl border border-border/70 bg-card text-card-foreground dark:bg-card dark:text-card-foreground p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card text-card-foreground dark:bg-card dark:text-card-foreground backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search this table…"
            aria-label="Search table"
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="mr-1.5 h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
            {table.columns.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.key}
                checked={!hidden.has(c.key)}
                onCheckedChange={(v) =>
                  setHidden((h) => {
                    const next = new Set(h);
                    if (v) next.delete(c.key);
                    else next.add(c.key);
                    return next;
                  })
                }
              >
                {c.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {exportable && (
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={exporting}>
            {exporting ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1.5 h-4 w-4" />
            )}
            Export CSV
          </Button>
        )}
      </div>

      {selectable && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-secondary/50 px-3 py-2 text-sm">
          <span className="font-medium">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toast.success(`Assigned ${selected.size} records`)}
            >
              <UserCheck className="mr-1.5 h-4 w-4" /> Assign
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                toast("Archived", { description: `${selected.size} records archived` });
                setSelected(new Set());
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Archive
            </Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No matching records"
          description="Try a different search term or clear the filters to see everything again."
          action={{ label: "Clear search", onClick: () => setQuery("") }}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {selectable && (
                    <th className="w-10 px-3 py-2.5">
                      <Checkbox
                        checked={allOnPageSelected}
                        aria-label="Select all rows on page"
                        onCheckedChange={(v) =>
                          setSelected((s) => {
                            const next = new Set(s);
                            rows.forEach((r) =>
                              v ? next.add(rowIndex(r)) : next.delete(rowIndex(r)),
                            );
                            return next;
                          })
                        }
                      />
                    </th>
                  )}
                  {columns.map((c) => {
                    const active = sort?.key === c.key;
                    const Arrow = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
                    return (
                      <th key={c.key} className={cn("px-3 py-2.5", c.align === "right" && "text-right")}>
                        <button
                          onClick={() => toggleSort(c.key)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded transition-colors hover:text-foreground",
                            active && "text-foreground",
                          )}
                          aria-label={`Sort by ${c.label}`}
                        >
                          {c.label}
                          <Arrow className="h-3 w-3" />
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const idx = rowIndex(r);
                  return (
                    <tr
                      key={idx}
                      tabIndex={0}
                      className="border-b border-border/40 outline-none transition-colors last:border-0 hover:bg-secondary/40 focus-visible:bg-secondary/60"
                    >
                      {selectable && (
                        <td className="px-3 py-2.5">
                          <Checkbox
                            checked={selected.has(idx)}
                            aria-label="Select row"
                            onCheckedChange={(v) =>
                              setSelected((s) => {
                                const next = new Set(s);
                                if (v) next.add(idx);
                                else next.delete(idx);
                                return next;
                              })
                            }
                          />
                        </td>
                      )}
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={cn(
                            "px-3 py-2.5",
                            c.align === "right" && "text-right tabular-nums",
                          )}
                        >
                          {c.badge ? <BadgeCell value={String(r[c.key])} /> : String(r[c.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border/50 md:hidden">
            {rows.map((r) => {
              const idx = rowIndex(r);
              return (
                <div key={idx} className="space-y-1.5 p-3 text-sm">
                  {columns.map((c) => (
                    <div key={c.key} className="flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {c.label}
                      </span>
                      {c.badge ? (
                        <BadgeCell value={String(r[c.key])} />
                      ) : (
                        <span className="text-right">{String(r[c.key] ?? "—")}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/70 px-3 py-2.5 text-xs text-muted-foreground">
            <span>
              Showing {current * pageSize + 1}–{Math.min((current + 1) * pageSize, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <span>
                Page {current + 1} / {pageCount}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
