import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import dynamic from 'next/dynamic';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MapMarker, SeriesPoint, StatDef } from "@/lib/dashboard-data";
import { getIcon } from "./icons";

// Dynamic import for the active rescue map
const RescueMap = dynamic(
  () => import('@/components/map/GoogleRescueMap').then(mod => ({ default: mod.GoogleRescueMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center bg-secondary/40 rounded-xl border border-border/70">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export function StatisticsCard({ stat, loading }: { stat: StatDef; loading?: boolean }) {
  const Icon = getIcon(stat.icon);
  const up = stat.change > 0;
  const flat = stat.change === 0;
  const Trend = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;

  if (loading) return <Skeleton className="h-28 w-full rounded-xl" />;

  // Icon color mapping for light mode
  const iconColorClasses: Record<string, string> = {
    siren: 'icon-rose',
    clock: 'icon-amber',
    map: 'icon-blue',
    wallet: 'icon-emerald',
    shield: 'icon-teal',
    heart: 'icon-rose',
    users: 'icon-violet',
    activity: 'icon-blue',
  };

  const iconClass = iconColorClasses[stat.icon] || 'icon-emerald';

  return (
    <div className="group relative rounded-xl border border-border/40 bg-card text-card-foreground p-5 backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-float dark:hover:border-primary/40">
      {/* Subtle gradient overlay for depth (light mode only) */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-60 dark:opacity-0" />
      
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
        <span className={cn(
          "grid h-9 w-9 place-items-center rounded-lg transition-transform group-hover:scale-110",
          iconClass,
          "dark:bg-primary/15"
        )}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="relative mt-4 font-display text-3xl font-bold tracking-tight">{stat.value}</p>
      <p
        className={cn(
          "relative mt-2 flex items-center gap-1.5 text-xs font-medium",
          flat ? "text-muted-foreground" : up ? "text-success dark:text-success" : "text-destructive",
        )}
      >
        <Trend className="h-3.5 w-3.5" />
        {flat ? "No change" : `${Math.abs(stat.change)}%`}
        <span className="text-muted-foreground">{stat.period}</span>
      </p>
    </div>
  );
}

export function ChartCard({
  title,
  description,
  type,
  data,
  breakdown,
  action,
  dataLabels,
}: {
  title: string;
  description?: string;
  type: "area" | "bar" | "pie";
  data?: SeriesPoint[];
  breakdown?: { label: string; value: number }[];
  action?: React.ReactNode;
  dataLabels?: { primary?: string; secondary?: string };
}) {
  const pieColors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ];

  // Shared so tooltip text is never hardcoded gray/black — follows the active theme.
  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-popover)",
      border: "1px solid var(--color-border)",
      borderRadius: 8,
      fontSize: 12,
    },
    labelStyle: { color: "var(--color-foreground)", fontWeight: 500 },
    itemStyle: { color: "var(--color-foreground)" },
  };

  // Custom formatter for tooltip to show meaningful labels
  const formatTooltipLabel = (dataKey: string) => {
    if (dataKey === 'value' && dataLabels?.primary) return dataLabels.primary;
    if (dataKey === 'secondary' && dataLabels?.secondary) return dataLabels.secondary;
    return dataKey;
  };

  return (
    <div className="rounded-xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 text-card-foreground p-4 backdrop-blur-sm shadow-lg overflow-hidden">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-primary to-chart-4 rounded-full" />
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === "pie" ? (
            <PieChart>
              <defs>
                {pieColors.map((color, index) => (
                  <linearGradient
                    key={index}
                    id={`pieGradient${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={breakdown ?? []}
                cx="50%"
                cy="50%"
                labelLine={{
                  stroke: 'var(--color-muted-foreground)',
                  strokeWidth: 1,
                }}
                label={({ cx, cy, midAngle, outerRadius, label, percent }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 18;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="var(--color-foreground)"
                      fontSize={11}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {`${label} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                dataKey="value"
                nameKey="label"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={3}
              >
                {(breakdown ?? []).map((_, i) => (
                  <Cell
                    key={i}
                    fill={`url(#pieGradient${i % pieColors.length})`}
                    stroke="var(--color-card)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          ) : type === "bar" ? (
            <BarChart data={data ?? []}>
              <defs>
                <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeOpacity={0.6} vertical={false} />
              <XAxis
                dataKey="label"
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
                fontSize={11}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
                fontSize={11}
              />
              <Tooltip 
                cursor={{ fill: "var(--color-secondary)" }} 
                {...tooltipStyle}
                formatter={(value: number, name: string) => [value, formatTooltipLabel(name)]}
              />
              <Bar 
                dataKey="value" 
                name={dataLabels?.primary || 'value'}
                fill="url(#barGradient1)" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="secondary" 
                name={dataLabels?.secondary || 'secondary'}
                fill="url(#barGradient2)" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          ) : (
            <AreaChart data={data ?? []} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                tick={{ fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <Tooltip
                {...tooltipStyle}
                cursor={{
                  stroke: 'var(--color-primary)',
                  strokeWidth: 1,
                  strokeDasharray: '5 5',
                }}
                formatter={(value: number, name: string) => [value, formatTooltipLabel(name)]}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={dataLabels?.primary || 'value'}
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillPrimary)"
                dot={{
                  fill: 'var(--color-chart-1)',
                  strokeWidth: 2,
                  r: 3,
                }}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
              {data && data[0]?.secondary !== undefined && (
                <Area
                  type="monotone"
                  dataKey="secondary"
                  name={dataLabels?.secondary || 'secondary'}
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fillSecondary)"
                  dot={{
                    fill: 'var(--color-chart-2)',
                    strokeWidth: 2,
                    r: 3,
                  }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function LoadingSkeleton({
  variant,
  count = 3,
}: {
  variant: "text" | "card" | "table" | "chart" | "list";
  count?: number;
}) {
  if (variant === "chart") return <Skeleton className="h-64 w-full rounded-xl" />;
  if (variant === "card")
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={variant === "table" ? "h-10 w-full" : "h-4 w-full"} />
      ))}
    </div>
  );
}

const markerTone: Record<MapMarker["priority"], string> = {
  EMERGENCY: "bg-destructive shadow-[0_0_0_6px_color-mix(in_oklab,var(--destructive)_25%,transparent)]",
  HIGH: "bg-warning",
  MEDIUM: "bg-accent",
  LOW: "bg-primary",
};

// NEW: Live Field Map with Leaflet
export function LiveFieldMap({
  markers,
  onMarkerClick,
}: {
  markers: MapMarker[];
  onMarkerClick?: (m: MapMarker) => void;
}) {
  // Separate markers by type for better visibility
  const rescueMarkers = markers.filter(m => m.type === 'rescue');
  const handlerMarkers = markers.filter(m => m.type === 'rescuer');
  const facilityMarkers = markers.filter(m => m.type === 'sighting');
  
  console.log('[LiveFieldMap] Marker breakdown:', {
    rescues: rescueMarkers.length,
    handlers: handlerMarkers.length,
    facilities: facilityMarkers.length,
    total: markers.length,
  });
  
  // Convert MapMarkers to rescue/rescuer/hospital format for RescueMap component
  // Map percentage-based x,y coordinates to actual Nepal lat/lng
  
  const rescues = rescueMarkers.map(marker => {
    // Normalize x (0-100) and y (0-100) to Nepal's geographic bounds
    // Nepal bounds: Lat 26.3-30.4, Lng 80.0-88.2
    const latRange = 30.4 - 26.3; // 4.1 degrees
    const lngRange = 88.2 - 80.0; // 8.2 degrees
    
    // Convert percentage coordinates to actual coordinates
    const lat = 26.3 + (latRange * (1 - marker.y / 100));
    const lng = 80.0 + (lngRange * (marker.x / 100));
    
    return {
      id: marker.id,
      lat,
      lng,
      address: marker.label,
      municipality: marker.label.split('·')[1]?.trim() || marker.label,
      status: marker.status,
      priority: marker.priority === 'EMERGENCY' ? 'CRITICAL' : marker.priority,
      name: `${marker.type} request`,
      phone: '+977-9800000000',
      snakeDescription: marker.label.split('·')[0]?.trim() || 'Snake sighting',
    };
  });

  const rescuers = handlerMarkers.map(marker => {
    const latRange = 30.4 - 26.3;
    const lngRange = 88.2 - 80.0;
    const lat = 26.3 + (latRange * (1 - marker.y / 100));
    const lng = 80.0 + (lngRange * (marker.x / 100));
    
    return {
      id: marker.id,
      name: marker.label.split('·')[0]?.trim() || 'Volunteer',
      lat,
      lng,
      phone: '+977-9800000000',
      status: marker.status === 'PENDING' || marker.status === 'COMPLETED' || marker.status === 'CANCELLED' ? 'AVAILABLE' : 'EN_ROUTE',
      experience: 'INTERMEDIATE',
    };
  });

  const hospitals = facilityMarkers.map(marker => {
    const latRange = 30.4 - 26.3;
    const lngRange = 88.2 - 80.0;
    const lat = 26.3 + (latRange * (1 - marker.y / 100));
    const lng = 80.0 + (lngRange * (marker.x / 100));
    
    return {
      id: marker.id,
      name: marker.label.split('·')[0]?.trim() || 'Hospital',
      latitude: lat,
      longitude: lng,
      address: marker.label,
      municipality: marker.label.split('·')[1]?.trim() || '',
      district: '',
      phone: '',
      emergencyPhone: '',
      antivenomStatus: 'UNKNOWN',
      emergency24x7: true,
      snakebiteTreatmentAvailable: true,
      ventilatorAvailable: false,
    };
  });

  return (
    <div className="relative w-full" style={{ height: '400px' }}>
      <RescueMap
        rescues={rescues}
        rescuers={rescuers}
        hospitals={hospitals}
        center={[27.7172, 85.324]} // Kathmandu center
        zoom={7} // Show most of Nepal
        showAccuracyCircle={false}
        onRescueClick={(rescueId) => {
          const marker = markers.find(m => m.id === rescueId);
          if (marker && onMarkerClick) onMarkerClick(marker);
        }}
      />
    </div>
  );
}

// LEGACY: Keep old InteractiveMap for backward compatibility
export function InteractiveMap({
  markers,
  onMarkerClick,
}: {
  markers: MapMarker[];
  onMarkerClick?: (m: MapMarker) => void;
}) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/70 surface-scale">
      <div className="absolute inset-0 scale-pattern opacity-60" />
      {markers.map((m) => (
        <button
          key={m.id}
          onClick={() => onMarkerClick?.(m)}
          aria-label={m.label}
          title={`${m.label} · ${m.priority}`}
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          className={cn(
            "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background transition-transform hover:scale-150",
            markerTone[m.priority],
            m.priority === "EMERGENCY" && "animate-pulse",
          )}
        />
      ))}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-[11px] backdrop-blur">
        {(["EMERGENCY", "HIGH", "MEDIUM", "LOW"] as const).map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5 uppercase tracking-wider">
            <span className={cn("h-2 w-2 rounded-full", markerTone[p])} />
            {p.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-xl border border-border/40 bg-card text-card-foreground p-5 backdrop-blur-md shadow-soft hover:shadow-float transition-all">
      {/* Subtle top gradient (light mode) */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/3 to-transparent rounded-t-xl opacity-70 dark:opacity-0" />
      
      <div className="relative">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {description && <p className="mb-4 text-xs text-muted-foreground mt-1">{description}</p>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
