import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/30 bg-background/40 backdrop-blur-sm">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-bold">
            <img 
              src="/logo.jpg" 
              alt="SnakeSOS Logo" 
              className="h-12 w-12 object-contain"
            /> SnakeSOS
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Protecting human lives and conserving Rupandehi biodiversity through safe, 24/7 emergency
            snake rescue, local community education, and snakebite first aid.
          </p>
          <div className="mt-5 flex gap-2">
            {['Facebook', 'Instagram', 'Youtube'].map((name, i) => (
              <span
                key={i}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border/30 bg-background/40 backdrop-blur-sm text-muted-foreground text-xs transition-all hover:border-accent/40 hover:text-accent hover:shadow-sm cursor-pointer"
                title={name}
              >
                {name[0]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Coverage Areas</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {[
              "Butwal Municipality",
              "Tilottama Municipality",
              "Siddharthanagar",
              "Devdaha Municipality",
              "Rupandehi Surrounding Zones",
            ].map((a) => (
              <li key={a} className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {a}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
            Useful Information
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {[
              { href: "/rescues", label: "Emergency Rescue" },
              { href: "/identify", label: "Snake DB & AI" },
              { href: "/community", label: "First Aid" },
              { href: "/volunteers", label: "Volunteer" },
              { href: "/support", label: "Donate" },
              { href: "/dashboard", label: "Admin Login" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-primary">
                  <span className="text-primary">›</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
            24/7 Hotline Contacts
          </p>
          <div className="mt-4 space-y-3">
            {["9812482578", "9807591342"].map((num, i) => (
              <div
                key={num}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3",
                  i === 0
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border/70 bg-secondary/50",
                )}
              >
                <Phone className={cn("h-4 w-4", i === 0 ? "text-destructive" : "text-primary")} />
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Emergency {i + 1}
                  </span>
                  <span className="block font-mono text-sm font-bold">{num}</span>
                </span>
              </div>
            ))}
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" /> hotline@snakesos.org
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SnakeSOS. All rights reserved. Rupandehi, Nepal.</p>
          <p>24/7 hotline 1166 · demo data only</p>
        </div>
      </div>
    </footer>
  );
}
