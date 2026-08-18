'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";

const links = [
  { href: "/", label: "Home" },
  { href: "/rescues", label: "Rescues" },
  { href: "/identify", label: "AI ID" },
  { href: "/gallery", label: "Gallery" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/donate", label: "Donate" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [nepali, setNepali] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/20 bg-background/60 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-5">
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/snakesoslogo.png" 
            alt="SnakeSOS Logo" 
            className="h-20 w-20 object-contain transition-transform group-hover:scale-105"
          />
          <span className="leading-tight">
            <span className="block text-[19px] font-extrabold tracking-tight text-foreground">
              Snake<span className="text-primary">SOS</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              24/7 wildlife rescue
            </span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setNepali((v) => !v)}
            aria-label="Toggle language"
            className="hidden h-10 w-11 place-items-center rounded-lg border border-border/30 bg-secondary/40 text-sm font-semibold text-foreground transition-all hover:bg-secondary/60 hover:border-border/50 sm:grid"
          >
            {nepali ? "EN" : "ने"}
          </button>
          <Button asChild size="sm" variant="ghost" className="hover:bg-secondary/50">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="destructive" className="h-10 rounded-lg px-4 font-semibold shadow-md hover:shadow-lg transition-all">
            <Link href="/emergency">
              <Phone className="h-4 w-4" />
              Emergency
            </Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary/50 transition-colors lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("border-t border-border/20 bg-background/40 backdrop-blur-xl lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-3">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

