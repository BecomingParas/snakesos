import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        emergency: "bg-destructive/10 text-destructive border-destructive/20",
        pending: "bg-warning/10 text-warning border-warning/20",
        assigned: "bg-info/10 text-info border-info/20",
        enroute: "bg-primary/10 text-primary border-primary/20",
        arrived: "bg-info/10 text-info border-info/20",
        rescued: "bg-success/10 text-success border-success/20",
        completed: "bg-success/10 text-success border-success/20",
        cancelled: "bg-muted text-muted-foreground border-muted-foreground/20",
        rejected: "bg-destructive/10 text-destructive border-destructive/20",
        available: "bg-success/10 text-success border-success/20",
        offline: "bg-muted text-muted-foreground border-muted-foreground/20",
        default: "bg-secondary text-secondary-foreground border-border",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props} />
  )
}

export { StatusBadge, statusBadgeVariants }
