/**
 * Snake Conservation and Safety Awareness Section
 * Educational content about snake species and safety
 */

import Link from "next/link";
import { BookOpen, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const snakeSpecies = [
  {
    id: "spectacled-cobra",
    name: "Spectacled Cobra",
    description: "Highly venomous. Hood with spectacle mark. Smooth scales.",
    venomous: true,
    icon: "🐍",
  },
  {
    id: "common-krait",
    name: "Common Krait",
    description: "Highly venomous. Glossy black with white bands. Hexagonal vertebral scales.",
    venomous: true,
    icon: "🐍",
  },
  {
    id: "russells-viper",
    name: "Russell's Viper",
    description: "Highly venomous. Chain of dark ovals. Loud hiss.",
    venomous: true,
    icon: "🐍",
  },
  {
    id: "rat-snake",
    name: "Rat Snake",
    description: "Non-venomous. Long slender body. Large eyes.",
    venomous: false,
    icon: "🐍",
  },
];

export function ConservationAwareness() {
  return (
    <div className="bg-gradient-to-b from-background to-card/30">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Snake Conservation and Safety Awareness
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Snakes play an essential role in keeping crop pests and agricultural rodent populations
              controlled in Rupandehi. Learn to identify local venomous species and read snakebite
              first aid guides.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 gap-2">
                <Link href="/identify">
                  <BookOpen className="h-4 w-4" />
                  Snake Identification Directory
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2">
                <Link href="/community">
                  <Hospital className="h-4 w-4" />
                  First Aid & Hospital List
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 rounded-xl border border-border/70 bg-card/60 p-6">
              <h3 className="font-display text-lg font-bold">Did you know?</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Most snakes avoid humans and only bite when threatened or cornered.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Snakes help farmers by controlling rodent populations naturally.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Only 15% of snake species in Nepal are venomous to humans.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Never attempt to handle or kill a snake - call our 24/7 hotline instead.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Snake Species Cards */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {snakeSpecies.map((snake) => (
                <Link
                  key={snake.id}
                  href="/identify"
                  className="group rounded-xl border border-border/70 bg-card/60 p-6 transition-all hover:border-primary/40 hover:shadow-lg"
                >
                  <div
                    className={cn(
                      "mb-4 grid h-12 w-12 place-items-center rounded-lg text-2xl",
                      snake.venomous
                        ? "bg-destructive/15 ring-1 ring-destructive/30"
                        : "bg-success/15 ring-1 ring-success/30"
                    )}
                  >
                    {snake.icon}
                  </div>

                  <h3 className="font-display text-lg font-bold group-hover:text-primary">
                    {snake.name}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">{snake.description}</p>

                  <div className="mt-4">
                    {snake.venomous ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold text-destructive">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                        Venomous
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Non-venomous
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
