'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Heart, Home, Receipt } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Optionally fetch session details from backend
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSessionData(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="mx-auto max-w-2xl">
        {/* Success Icon */}
        <div className="mb-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-success/20">
            <CheckCircle2 className="h-14 w-14 text-success" />
          </div>
        </div>

        {/* Success Message */}
        <div className="rounded-lg border border-border/70 bg-card p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <h1 className="font-display text-3xl font-bold mb-3">
            Thank You for Your Donation! 🙏
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Your generous support helps save snakes and protect communities across Rupandehi District.
          </p>

          {!loading && sessionData && (
            <div className="mb-6 rounded-md border border-border/70 bg-secondary/40 p-4">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Donation Amount
              </p>
              <p className="text-2xl font-bold text-primary">
                ${(sessionData.amount_total / 100).toFixed(2)}
              </p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="mb-8 rounded-lg border border-border/70 bg-card p-6 text-left">
            <h3 className="font-display text-lg font-bold mb-4">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Receipt className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Email Receipt</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a payment receipt via email shortly
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Heart className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Immediate Impact</p>
                  <p className="text-sm text-muted-foreground">
                    Your donation goes directly to rescue operations and wildlife education
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/gallery">
                View Our Rescue Gallery
              </Link>
            </Button>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <p className="text-sm text-muted-foreground mb-4">
            Help us reach more supporters by sharing our mission
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://twitter.com/intent/tweet?text=I%20just%20donated%20to%20SnakeSOS%20to%20support%20snake%20rescue%20operations%20in%20Nepal!&url=https://snakesos.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Share on Twitter
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://snakesos.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Share on Facebook
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
