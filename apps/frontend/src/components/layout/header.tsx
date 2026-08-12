'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/rescues", label: "Rescues" },
  { href: "/identify", label: "AI ID" },
  { href: "/gallery", label: "Gallery" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/support", label: "Donate" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [nepali, setNepali] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center gap-4 px-5">
        <Link href="/" className="flex items-center">
          <img 
            src="/snakesoslogo.png" 
            alt="SnakeSOS Logo" 
            className="h-20 w-20 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-[19px] font-extrabold tracking-tight">
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
                  "rounded-lg px-3.5 py-2 text-[15px] transition-colors hover:bg-secondary hover:text-foreground",
                  isActive
                    ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/40"
                    : "text-muted-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={() => setNepali((v) => !v)}
            aria-label="Toggle language"
            className="hidden h-10 w-11 place-items-center rounded-lg border border-border/70 bg-secondary/60 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:grid"
          >
            {nepali ? "EN" : "ने"}
          </button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="destructive" className="h-10 rounded-lg px-4 font-semibold">
            <Link href="/emergency">
              <Phone className="h-4 w-4" />
              Emergency
            </Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("border-t border-border/70 lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-3">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm",
                  isActive 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground"
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

