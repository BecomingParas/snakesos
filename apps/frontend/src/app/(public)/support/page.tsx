'use client'

import { useState } from "react";
import { Copy, Heart, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const donationImpacts = [
  {
    amount: "Rs. 500",
    icon: "🔦",
    description: "Funds one rescue mission fuel & equipment",
  },
  {
    amount: "Rs. 1,500",
    icon: "🧤",
    description: "Provides snake-handling gloves for a volunteer",
  },
  {
    amount: "Rs. 5,000",
    icon: "🎒",
    description: "Covers full rescue kit & medical supplies",
  },
  {
    amount: "Rs. 15,000",
    icon: "🏫",
    description: "Sponsors a volunteer training session for 5 people",
  },
];

const paymentMethods = [
  {
    id: "esewa",
    label: "eSewa",
    subtitle: "@snakesos01",
    logo: "/wallets/esewa.png",
    recommended: true,
  },
  {
    id: "khalti",
    label: "Khalti",
    subtitle: "khalti.com",
    logo: "/wallets/khalti.png",
    recommended: false,
  },
  {
    id: "bank",
    label: "Bank Transfer",
    subtitle: "Nepal Bank",
    logo: "/wallets/bank.jpg",
    recommended: false,
  },
];

export default function SupportPage() {
  const [selectedMethod, setSelectedMethod] = useState("esewa");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    void navigator.clipboard?.writeText(text);
    setCopiedField(fieldId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-5 py-16 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border-2 border-destructive/40 bg-destructive/15">
          <Heart className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Support Our Mission
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Your donation funds rescue equipment, volunteer training, and wildlife education in Rupandehi District.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-16">
        {/* Donation Impact Cards */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-6 duration-700 delay-150">
          <h2 className="mb-6 text-center font-display text-2xl font-bold">
            Your Donation Impact
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {donationImpacts.map((impact, idx) => (
              <div
                key={idx}
                className="group cursor-pointer rounded-lg border border-border/70 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-3 text-4xl">{impact.icon}</div>
                <div className="font-display text-xl font-bold text-primary">
                  {impact.amount}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {impact.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] animate-in fade-in slide-in-from-top-8 duration-700 delay-300">
          {/* Payment Method Selection */}
          <div>
            <h2 className="mb-4 font-display text-xl font-bold">
              Choose Payment Method
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all",
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/50"
                      : "border-border/70 bg-card hover:border-primary/30"
                  )}
                >
                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-white p-1">
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                      {method.label[0]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{method.label}</p>
                      {method.recommended && (
                        <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">
                          •
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{method.subtitle}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="rounded-lg border border-border/70 bg-card p-6 lg:p-8">
            {selectedMethod === "esewa" && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/20 text-2xl font-bold text-primary">
                    e
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Donate via eSewa</h3>
                    <p className="text-sm text-muted-foreground">Butwal Snake Rescuers</p>
                  </div>
                </div>

                <div className="mb-6 rounded-md border border-border/70 bg-secondary/40 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account ID
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-lg font-bold">9856034050</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("9856034050", "esewa-id")}
                      className="gap-2 bg-primary/10 hover:bg-primary/20"
                    >
                      {copiedField === "esewa-id" ? (
                        <>
                          <Check className="h-4 w-4 text-primary" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 rounded-md border border-border/70 bg-card p-3">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Open the eSewa app on your phone
                    </p>
                  </div>
                  <div className="flex gap-3 rounded-md border border-border/70 bg-card p-3">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tap "Send Money" → "To eSewa ID"
                    </p>
                  </div>
                  <div className="flex gap-3 rounded-md border border-border/70 bg-card p-3">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter ID: 9856034050
                    </p>
                  </div>
                  <div className="flex gap-3 rounded-md border border-border/70 bg-card p-3">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      4
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter amount and add note "Donation"
                    </p>
                  </div>
                  <div className="flex gap-3 rounded-md border border-border/70 bg-card p-3">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      5
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Confirm and send
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-md border border-warning/40 bg-warning/10 p-4">
                  <p className="mb-2 text-sm font-bold text-warning">After donating:</p>
                  <p className="text-sm text-foreground">
                    Please send a screenshot of your transaction to our{" "}
                    <a href="https://wa.me/9856034050" className="font-bold underline text-warning">
                      WhatsApp: 9856034050
                    </a>{" "}
                    so we can send you a thank-you message and receipt.
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === "khalti" && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/20 text-2xl font-bold text-primary">
                    K
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Donate via Khalti</h3>
                    <p className="text-sm text-muted-foreground">Butwal Snake Rescuers</p>
                  </div>
                </div>

                <div className="mb-6 rounded-md border border-border/70 bg-secondary/40 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account ID
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-lg font-bold">9856034050</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("9856034050", "khalti-id")}
                      className="gap-2 bg-primary/10 hover:bg-primary/20"
                    >
                      {copiedField === "khalti-id" ? (
                        <>
                          <Check className="h-4 w-4 text-primary" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Open the Khalti app on your phone",
                    'Tap "Transfer" → "Send Money"',
                    "Enter Khalti ID: 9856034050",
                    "Enter the donation amount",
                    'Add purpose: "Wildlife Rescue Donation" and confirm',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3 rounded-md border border-border/70 bg-card p-3">
                      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-md border border-warning/40 bg-warning/10 p-4">
                  <p className="mb-2 text-sm font-bold text-warning">After donating:</p>
                  <p className="text-sm text-foreground">
                    Please send a screenshot of your transaction to our{" "}
                    <a href="https://wa.me/9856034050" className="font-bold underline text-warning">
                      WhatsApp: 9856034050
                    </a>
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === "bank" && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/20 text-2xl font-bold text-primary">
                    🏦
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Donate via Bank Transfer</h3>
                    <p className="text-sm text-muted-foreground">Butwal Snake Rescuers Society</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Bank: NIC Asia Bank, Butwal Branch",
                    "Account Name: Butwal Snake Rescuers Society",
                    "Account Number: 32100876543001S",
                    'Use "Wildlife Donation" as the transfer note',
                    "Send transfer receipt to our WhatsApp: 9856034050",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3 rounded-md border border-border/70 bg-card p-3">
                      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-md border border-warning/40 bg-warning/10 p-4">
                  <p className="mb-2 text-sm font-bold text-warning">After donating:</p>
                  <p className="text-sm text-foreground">
                    Please send a screenshot of your transaction to our{" "}
                    <a href="https://wa.me/9856034050" className="font-bold underline text-warning">
                      WhatsApp: 9856034050
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thank You Section */}
        <div className="mt-16 rounded-md border border-border/70 bg-card p-8 text-center lg:p-12 animate-in fade-in slide-in-from-top-10 duration-700 delay-500">
          <div className="mb-4 text-5xl">🙏</div>
          <h2 className="font-display text-2xl font-bold">Thank You for Your Support</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every donation — no matter the size — directly supports snake rescue operations, wildlife education, and community awareness across Rupandehi District. You are a hero to both humans and wildlife.
          </p>
        </div>
      </div>
    </div>
  );
}
