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
      <section className="border-b border-border/70 bg-gradient-to-b from-primary/10 to-transparent px-5 py-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          <ImageIcon className="h-3.5 w-3.5" /> Rescue diaries
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Photo Gallery</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Glimpses from our field operations, safe snake releases, and community awareness programs in Rupandehi.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={
                "rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors " +
                (active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 text-muted-foreground hover:text-foreground")
              }
            >
              {c}
            </button>
          ))}
        </div>

        {list.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <figure
                key={p.id}
                className="group overflow-hidden rounded-xl border border-border/70 bg-card/60"
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
