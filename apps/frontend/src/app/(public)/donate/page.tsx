'use client'

import { useState } from "react";
import { Copy, Heart, Check, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Stripe donation amounts (in USD for international donors)
const DONATION_AMOUNTS = [
  { value: 500, label: "$5", npr: "Rs. 650" },
  { value: 1000, label: "$10", npr: "Rs. 1,300" },
  { value: 2500, label: "$25", npr: "Rs. 3,250" },
  { value: 5000, label: "$50", npr: "Rs. 6,500" },
  { value: 10000, label: "$100", npr: "Rs. 13,000" },
];

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
  {
    id: "stripe",
    label: "Credit/Debit Card",
    subtitle: "via Stripe",
    logo: null,
    recommended: false,
    comingSoon: false,
  },
];

// Stripe Payment Section Component
function StripePaymentSection() {
  const [selectedAmount, setSelectedAmount] = useState(1000); // $10 default
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonate = async () => {
    const amount = customAmount ? parseInt(customAmount) * 100 : selectedAmount;
    
    if (amount < 100) {
      toast.error("Minimum donation is $1");
      return;
    }

    setIsProcessing(true);
    toast.loading("Redirecting to Stripe Checkout...");

    try {
      // Call backend to create checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { url } = await response.json();
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.dismiss();
      toast.error("Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/20">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">Donate via Credit/Debit Card</h3>
          <p className="text-sm text-muted-foreground">Secure payment powered by Stripe</p>
        </div>
      </div>

      {/* Preset Amounts */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Select Amount</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {DONATION_AMOUNTS.map((amount) => (
            <button
              key={amount.value}
              onClick={() => {
                setSelectedAmount(amount.value);
                setCustomAmount("");
              }}
              className={cn(
                "rounded-lg border p-3 text-center transition-all",
                selectedAmount === amount.value && !customAmount
                  ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                  : "border-border/70 hover:border-primary/40"
              )}
            >
              <div className="font-bold">{amount.label}</div>
              <div className="text-xs text-muted-foreground">{amount.npr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Or Enter Custom Amount (USD)</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-background px-4 py-2 pl-7 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        {customAmount && parseInt(customAmount) > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            ≈ Rs. {(parseInt(customAmount) * 130).toLocaleString()}
          </p>
        )}
      </div>

      {/* Donate Button */}
      <Button
        onClick={handleDonate}
        disabled={isProcessing}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Donate {customAmount ? `$${customAmount}` : `$${selectedAmount / 100}`}
          </>
        )}
      </Button>

      {/* Info */}
      <div className="mt-6 space-y-3 rounded-md border border-border/70 bg-secondary/40 p-4 text-sm">
        <div className="flex gap-2">
          <span className="text-success">✓</span>
          <p className="text-muted-foreground">Secure payment processed by Stripe</p>
        </div>
        <div className="flex gap-2">
          <span className="text-success">✓</span>
          <p className="text-muted-foreground">All major credit and debit cards accepted</p>
        </div>
        <div className="flex gap-2">
          <span className="text-success">✓</span>
          <p className="text-muted-foreground">Instant email receipt after donation</p>
        </div>
      </div>

      {/* Test Mode Notice */}
      <div className="mt-4 rounded-md border border-warning/40 bg-warning/10 p-3">
        <p className="text-xs font-semibold text-warning">🧪 Test Mode Active</p>
        <p className="mt-1 text-xs text-foreground/80">
          Use test card: <code className="rounded bg-muted px-1">4242 4242 4242 4242</code> with any future date and CVC.
        </p>
      </div>
    </div>
  );
}

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
      <section className="relative px-5 py-20 lg:py-28 text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-accent/30 bg-accent/10 backdrop-blur-sm shadow-lg">
            <Heart className="h-10 w-10 text-accent" />
          </div>
          <h1 className="font-display text-5xl lg:text-6xl font-bold tracking-tight">
            Support Our Mission
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Your donation funds rescue equipment, volunteer training, and wildlife education in Rupandehi District.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-16">
        {/* Donation Impact Cards */}
        <div className="mb-16">
          <h2 className="mb-8 text-center font-display text-3xl font-bold">
            Your Donation Impact
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {donationImpacts.map((impact, idx) => (
              <div
                key={idx}
                className="group cursor-pointer rounded-xl border border-border/30 bg-background/60 backdrop-blur-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-accent/50"
              >
                <div className="mb-4 text-5xl">{impact.icon}</div>
                <div className="font-display text-2xl font-bold text-accent">
                  {impact.amount}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {impact.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Payment Method Selection */}
          <div>
            <h2 className="mb-6 font-display text-xl font-bold">
              Choose Payment Method
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => !method.comingSoon && setSelectedMethod(method.id)}
                  disabled={method.comingSoon}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    method.comingSoon && "cursor-not-allowed opacity-50",
                    !method.comingSoon && selectedMethod === method.id
                      ? "border-accent/60 bg-accent/10 shadow-md ring-2 ring-accent/30"
                      : "border-border/30 bg-background/40 backdrop-blur-sm hover:border-accent/40 hover:shadow-sm"
                  )}
                >
                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-white p-1 shrink-0">
                    {method.logo ? (
                      <Image
                        src={method.logo}
                        alt={method.label}
                        width={40}
                        height={40}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                        💳
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{method.label}</p>
                      {method.recommended && (
                        <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">
                          •
                        </span>
                      )}
                      {method.comingSoon && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          SOON
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{method.subtitle}</p>
                  </div>
                  {!method.comingSoon && selectedMethod === method.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="rounded-2xl border border-border/30 bg-background/60 backdrop-blur-2xl shadow-md p-6 lg:p-8">
            {selectedMethod === "stripe" && (
              <StripePaymentSection />
            )}

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
        <div className="mt-20 rounded-2xl border border-border/30 bg-background/60 backdrop-blur-2xl shadow-lg p-10 text-center lg:p-16">
          <div className="mb-5 text-6xl">🙏</div>
          <h2 className="font-display text-3xl font-bold">Thank You for Your Support</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Every donation — no matter the size — directly supports snake rescue operations, wildlife education, and community awareness across Rupandehi District. You are a hero to both humans and wildlife.
          </p>
        </div>
      </div>
    </div>
  );
}
