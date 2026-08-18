'use client'

import { useState } from "react";
import { ImageIcon } from "lucide-react";

const categories = ["All", "Rescue", "Release", "Awareness", "School"] as const;

const photos = [
  {
    id: "g1",
    src: "/gallery/rescue.jpg",
    category: "Rescue",
    title: "Night call-out in Butwal-11",
    caption: "Cobra safely secured from a family kitchen at 11:40 pm.",
  },
  {
    id: "g2",
    src: "/gallery/release.jpg",
    category: "Release",
    title: "Release at Tilottama forest edge",
    caption: "Rat snake returned to habitat, 6 km from the rescue point.",
  },
  {
    id: "g3",
    src: "/gallery/awareness.jpg",
    category: "Awareness",
    title: "Ward-level awareness session",
    caption: "First aid and prevention training for 60 residents in Devdaha.",
  },
  {
    id: "g4",
    src: "/gallery/school.jpg",
    category: "School",
    title: "School safety program",
    caption: "Students learning what to do when a snake enters the classroom.",
  },
  {
    id: "g5",
    src: "/gallery/rescue.jpg",
    category: "Rescue",
    title: "Granary rescue, Siddharthanagar",
    caption: "Krait removed from a stored-grain shed before dawn.",
  },
  {
    id: "g6",
    src: "/gallery/awareness.jpg",
    category: "Awareness",
    title: "Monsoon prevention drive",
    caption: "Household checklists handed out ahead of the rainy season.",
  },
] as const;

export default function GalleryPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const list = active === "All" ? photos : photos.filter((p) => p.category === active);

  return (
    <div>
      <section className="relative px-5 py-20 lg:py-28 text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent shadow-sm">
            <ImageIcon className="h-3.5 w-3.5" /> Rescue diaries
          </span>
          <h1 className="mt-6 font-display text-5xl lg:text-6xl font-bold tracking-tight">Photo Gallery</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Glimpses from our field operations, safe snake releases, and community awareness programs in Rupandehi.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={
                "rounded-full border px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all " +
                (active === c
                  ? "border-accent bg-accent text-accent-foreground shadow-md"
                  : "border-border/30 bg-background/40 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-accent/40")
              }
            >
              {c}
            </button>
          ))}
        </div>

        {list.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <figure
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-border/30 bg-background/60 backdrop-blur-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="h-52 w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
                <figcaption className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{p.category}</span>
                  <p className="mt-1 font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-16 grid place-items-center py-16 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/60" />
            <p className="mt-4 text-lg text-muted-foreground">No images found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
