'use client'

import { useState } from "react";
import { Award, GraduationCap, Heart, Phone, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { volunteers } from "@/lib/demo-data";

const heroStats = [
  { value: "25+", label: "Active volunteers" },
  { value: "500+", label: "Rescues completed" },
  { value: "5", label: "Coverage zones" },
  { value: "24/7", label: "Emergency response" },
];

const benefits = [
  {
    icon: GraduationCap,
    title: "Professional Training",
    body: "Free snake handling & rescue training from experts.",
    tone: "text-primary",
  },
  {
    icon: Award,
    title: "Wildlife Certificate",
    body: "Official certificate from the SnakeSOS rescue network.",
    tone: "text-warning",
  },
  {
    icon: Zap,
    title: "Emergency Skills",
    body: "Learn life-saving first aid and crisis response.",
    tone: "text-accent",
  },
  {
    icon: Heart,
    title: "Community Impact",
    body: "Make a real difference in Rupandehi communities.",
    tone: "text-destructive",
  },
];

const municipalities = ["Butwal", "Tilottama", "Siddharthanagar", "Devdaha", "Other"];

export default function VolunteersPage() {
  const [selected, setSelected] = useState<string[]>(["Butwal"]);

  function toggle(m: string) {
    setSelected((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  return (
    <div>
      <section className="border-b border-border/70 bg-gradient-to-b from-primary/10 to-transparent px-5 py-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          <Users className="h-3.5 w-3.5" /> Join our team
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Become a Volunteer
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Help protect wildlife and save lives in Rupandehi. No prior experience required — we provide full
          training.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border/70 bg-card/60 p-5 text-center"
            >
              <p className="font-display text-2xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-xl font-bold">Why Volunteer With Us?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-4 rounded-xl border border-border/70 bg-card/60 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border/70 bg-secondary/60">
                <b.icon className={"h-4 w-4 " + b.tone} />
              </span>
              <span>
                <span className="block font-semibold text-primary">{b.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{b.body}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <h2 className="text-2xl font-bold">Meet Our Rescuers</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-primary/80">
            The brave individuals dedicating their time to save both humans and snakes across Rupandehi.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {volunteers.slice(0, 6).map((v) => (
            <div key={v.id} className="overflow-hidden rounded-xl border border-border/70 bg-card/60">
              <div className="relative grid h-44 place-items-center bg-primary/15">
                <span className="font-display text-4xl font-extrabold text-primary/70">{v.initials}</span>
                <span
                  className={
                    "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider " +
                    (v.status === "available"
                      ? "bg-success/20 text-success"
                      : v.status === "on-rescue"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-accent/20 text-accent")
                  }
                >
                  {v.status.replace("-", " ")}
                </span>
              </div>
              <div className="p-5 text-center">
                <p className="font-semibold">{v.name}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {v.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/50 px-3 py-1 font-mono text-xs">
                  <Phone className="h-3 w-3 text-primary" /> {v.district}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {v.rescues} rescues · ★ {v.rating} · since {v.since}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-border/70 bg-card/60 p-6">
          <h2 className="text-lg font-bold">Volunteer Application</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your details — we'll contact you within 3-5 days.
          </p>

          <form
            className="mt-6 grid gap-5 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Application submitted — our coordinator will call you soon.");
            }}
          >
            <Field label="Full Name *">
              <Input required placeholder="Your full name" />
            </Field>
            <Field label="Phone / Contact *">
              <Input required placeholder="98XXXXXXXX" inputMode="tel" />
            </Field>
            <Field label="Address">
              <Input placeholder="Your home address" />
            </Field>
            <Field label="Municipality">
              <Input defaultValue="Butwal" />
            </Field>

            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground">Available Municipalities</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {municipalities.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggle(m)}
                    className={
                      "rounded-lg border px-3 py-2 text-xs font-medium transition-colors " +
                      (selected.includes(m)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground")
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Experience Level">
              <select className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm">
                <option>Beginner</option>
                <option>Some experience</option>
                <option>Trained handler</option>
              </select>
            </Field>
            <Field label="Vehicle">
              <select className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm">
                <option>None</option>
                <option>Bicycle</option>
                <option>Motorbike</option>
                <option>Car / Jeep</option>
              </select>
            </Field>
            <Field label="Available Time">
              <select className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm">
                <option>Anytime</option>
                <option>Daytime only</option>
                <option>Night only</option>
                <option>Weekends</option>
              </select>
            </Field>
            <Field label="Emergency Availability">
              <select className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm">
                <option>Yes — I'm available for emergencies</option>
                <option>No — scheduled shifts only</option>
              </select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Skills / Background (Optional)">
                <Textarea
                  rows={3}
                  placeholder="e.g. First aid certified, wildlife photography, veterinary student…"
                />
              </Field>
            </div>

            <Button type="submit" size="lg" className="md:col-span-2">
              <Heart className="mr-1.5 h-4 w-4" /> Submit Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-primary/90">{label}</span>
      {children}
    </label>
  );
}
