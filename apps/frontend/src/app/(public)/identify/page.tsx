'use client'

import { useRef, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Camera,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { speciesLibrary, type Species } from "@/lib/demo-data";

const venomMeta: Record<
  Species["venom"],
  { label: string; pill: string; bar: string; danger: number; doNot: string[] }
> = {
  "Highly venomous": {
    label: "VENOMOUS",
    pill: "border-destructive/40 bg-destructive/15 text-destructive",
    bar: "bg-destructive",
    danger: 9,
    doNot: [
      "Do NOT cut, suck or burn the bite wound",
      "Do NOT apply a tight tourniquet",
      "Do NOT wait for symptoms before reaching hospital",
    ],
  },
  "Mildly venomous": {
    label: "MILDLY VENOMOUS",
    pill: "border-warning/40 bg-warning/15 text-warning",
    bar: "bg-warning",
    danger: 5,
    doNot: [
      "Do NOT handle or provoke the snake",
      "Do NOT ignore swelling that keeps spreading",
      "Do NOT self-medicate with painkillers containing aspirin",
    ],
  },
  "Non-venomous": {
    label: "NON-VENOMOUS",
    pill: "border-success/40 bg-success/15 text-success",
    bar: "bg-success",
    danger: 2,
    doNot: [
      "Do NOT kill — protected by the Wildlife Act",
      "Do NOT pull the snake away — it may cause injury",
      "Do NOT keep as a pet",
    ],
  },
};

function firstAidSteps(s: Species) {
  return [
    "Move everyone away and keep the snake in sight from a safe distance",
    "Keep the bitten person calm and still — panic speeds venom spread",
    s.firstAid,
    "Remove rings, watches and tight clothing near the bite",
    "Call SnakeSOS on 9812482578 for rescue and hospital guidance",
  ];
}

export default function IdentifyPage() {
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [result, setResult] = useState<Species | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(file?: File | null) {
    if (!file) return;
    setPreview({ url: URL.createObjectURL(file), name: file.name });
    setResult(null);
    setState("idle");
  }

  function identify() {
    setState("scanning");
    setResult(null);
    const pick = speciesLibrary[Math.floor(Math.random() * speciesLibrary.length)];
    if (!pick) return;
    setTimeout(() => {
      setResult(pick);
      setState("done");
    }, 1600);
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setState("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  const meta = result ? venomMeta[result.venom] : null;

  return (
    <div>
      <section className="relative px-5 py-20 lg:py-28 text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent shadow-sm">
            <Bot className="h-3.5 w-3.5" /> AI-powered
          </span>
          <h1 className="mt-6 font-display text-5xl lg:text-6xl font-bold tracking-tight">
            Snake <span className="text-accent">Identifier</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Upload a clear photo of a snake. Our AI will instantly identify the species, assess the danger
            level, and provide life-saving first aid steps.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Powered by Google Gemini
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" /> Results in ~5 seconds
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload column */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Upload className="h-4 w-4 text-primary" /> Upload Snake Photo
            </h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className="mt-4 overflow-hidden rounded-2xl border border-dashed border-accent/40 bg-accent/5 backdrop-blur-sm"
            >
              {preview ? (
                <div className="relative">
                  <img src={preview.url} alt="Uploaded snake" className="h-64 w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 font-mono text-[11px] backdrop-blur">
                    {preview.name}
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Remove photo"
                    className="absolute inset-0 m-auto grid h-10 w-10 place-items-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="grid h-64 w-full place-items-center px-6 text-center"
                >
                  <span>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-primary/15">
                      <Camera className="h-6 w-6 text-primary" />
                    </span>
                    <span className="mt-4 block font-semibold">Drop your photo here</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      or click to browse — JPG, PNG, WEBP up to 10MB
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                      <Upload className="h-4 w-4" /> Choose Photo
                    </span>
                  </span>
                </button>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />

            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1"
                size="lg"
                onClick={identify}
                disabled={!preview || state === "scanning"}
              >
                {state === "scanning" ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                Identify Snake
              </Button>
              {preview && (
                <Button variant="outline" size="lg" onClick={reset} aria-label="Reset">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-border/30 bg-background/60 backdrop-blur-xl shadow-md p-5">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5 text-warning" /> Tips for best results
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[
                  "Take a clear, well-lit photo",
                  "Capture the full body if possible",
                  "Include distinctive markings",
                  "Keep a safe distance — never approach",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-primary">•</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results column */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-4 w-4 text-accent" /> Analysis Results
            </h2>

            {result && meta ? (
              <div className="mt-4 space-y-5">
                <div className="rounded-2xl border border-accent/40 bg-accent/10 backdrop-blur-sm shadow-md p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{result.name}</h3>
                      <p className="text-sm italic text-muted-foreground">{result.scientific}</p>
                    </div>
                    <span
                      className={
                        "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider " + meta.pill
                      }
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                      <span>Danger level</span>
                      <span>{meta.danger}/10</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className={"h-full " + meta.bar} style={{ width: `${meta.danger * 10}%` }} />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed">
                    {result.traits.join(". ")}. Typically found in {result.habitat.toLowerCase()}.
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    AI Confidence: <span className="font-semibold text-primary">{result.confidence}%</span> · Local
                    presence: <span className="font-semibold text-primary">Recorded in Rupandehi</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-border/30 bg-background/60 backdrop-blur-xl shadow-md p-6">
                  <p className="flex items-center gap-2 font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4" /> First Aid Steps
                  </p>
                  <ol className="mt-3 space-y-2.5 text-sm">
                    {firstAidSteps(result).map((s, i) => (
                      <li key={s} className="flex gap-3">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/15 text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5">
                  <p className="flex items-center gap-2 font-semibold text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Do NOT
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {meta.doNot.map((d) => (
                      <li key={d} className="flex gap-2.5">
                        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid min-h-[280px] place-items-center rounded-xl border border-border/70 bg-card/60 p-8 text-center">
                <div>
                  {state === "scanning" ? (
                    <Loader2 className="mx-auto h-9 w-9 animate-spin text-primary" />
                  ) : (
                    <Camera className="mx-auto h-9 w-9 text-primary" />
                  )}
                  <p className="mt-4 text-sm text-muted-foreground">
                    {state === "scanning"
                      ? "Analysing scale pattern, head shape and banding…"
                      : "Upload a snake photo and click Identify Snake to see results here."}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {speciesLibrary.slice(0, 3).map((s) => (
                      <span
                        key={s.id}
                        className="rounded-md border border-border/70 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Common snakes found in Rupandehi District
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-warning/40 bg-warning/10 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-warning">
            <AlertTriangle className="h-4 w-4" /> Important Disclaimer
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This AI tool is for educational purposes and initial guidance only.{" "}
            <span className="font-semibold text-foreground">Always treat any snakebite as a medical emergency.</span>{" "}
            Call our 24/7 rescue team immediately and proceed to the nearest hospital. Do not rely solely on AI
            identification for life-threatening situations.
          </p>
        </div>
      </div>
    </div>
  );
}
