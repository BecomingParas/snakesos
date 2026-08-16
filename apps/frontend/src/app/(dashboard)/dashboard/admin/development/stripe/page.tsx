'use client';

import { useQuery } from '@/lib/apollo/hooks';
import { STRIPE_CONNECTION_STATUS } from '@/lib/graphql/queries/payments.queries';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, RefreshCw, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Stripe Development Testing Page
 * DEVELOPMENT ONLY - Tests Stripe SDK connectivity
 * Does NOT process payments or collect card information
 */
export default function StripeDevelopmentPage() {
  // Define the expected type for the query result
  interface StripeConnectionStatusQuery {
    stripeConnectionStatus: {
      connected: boolean;
      mode: string;
      accountId: string;
      livemode: boolean;
      message: string;
    };
  }

  const { data, loading, error, refetch } = useQuery<StripeConnectionStatusQuery>(STRIPE_CONNECTION_STATUS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const handleTestConnection = async () => {
    try {
      toast.loading('Testing Stripe connection...');
      await refetch();
      toast.dismiss();
      
      // Now data is properly typed
      if (data?.stripeConnectionStatus.connected) {
        toast.success('Stripe connection successful!');
      } else {
        toast.error('Stripe connection failed');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to test Stripe connection');
      console.error('Stripe connection test error:', err);
    }
  };

  // Simplified status assignment with optional chaining
  const status = data?.stripeConnectionStatus;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">
                Stripe Development Testing
              </h1>
              <p className="text-sm text-muted-foreground">
                Connection testing only • No payment processing
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 rounded-lg border border-warning/40 bg-warning/10 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="font-semibold text-warning">Development Mode Only</p>
              <p className="mt-1 text-sm text-foreground/80">
                This page only tests Stripe SDK connectivity. It does NOT:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                <li>• Process real payments</li>
                <li>• Collect card information</li>
                <li>• Create payment intents</li>
                <li>• Charge any accounts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Connection Status Card */}
        <div className="rounded-lg border border-border/70 bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              Connection Status
            </h2>
            <Button
              onClick={handleTestConnection}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Test Connection
            </Button>
          </div>

          {loading && (
            <div className="space-y-3">
              <div className="h-8 w-1/3 animate-pulse rounded bg-muted"></div>
              <div className="h-6 w-2/3 animate-pulse rounded bg-muted"></div>
              <div className="h-6 w-1/2 animate-pulse rounded bg-muted"></div>
            </div>
          )}

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">GraphQL Error</p>
                  <p className="mt-1 text-sm text-foreground/80">
                    {error.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && status && (
            <div className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-start gap-3 rounded-md border border-border/70 bg-secondary/40 p-4">
                {status.connected ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
                ) : (
                  <AlertCircle className="h-6 w-6 shrink-0 text-destructive" />
                )}
                <div>
                  <p className="font-semibold">
                    {status.connected ? '🟢 Connected' : '🔴 Not Connected'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {status.message}
                  </p>
                </div>
              </div>

              {/* Mode */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-border/70 bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Mode
                  </p>
                  <p className="mt-2 font-mono text-lg font-bold">
                    {status.mode.toUpperCase()}
                  </p>
                  {status.mode === 'test' && (
                    <p className="mt-1 text-xs text-success">
                      ✓ Test mode is safe for development
                    </p>
                  )}
                  {status.mode === 'live' && (
                    <p className="mt-1 text-xs text-warning">
                      ⚠ Live mode detected
                    </p>
                  )}
                </div>

                <div className="rounded-md border border-border/70 bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Live Mode
                  </p>
                  <p className="mt-2 font-mono text-lg font-bold">
                    {status.livemode ? 'TRUE' : 'FALSE'}
                  </p>
                  {!status.livemode && (
                    <p className="mt-1 text-xs text-success">
                      ✓ Test mode active
                    </p>
                  )}
                </div>
              </div>

              {/* Account ID */}
              {status.accountId && (
                <div className="rounded-md border border-border/70 bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Stripe Account
                  </p>
                  <p className="mt-2 font-mono text-sm">{status.accountId}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 rounded-lg border border-border/70 bg-card p-6">
          <h3 className="mb-4 font-display text-lg font-bold">
            Setup Instructions
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                1
              </div>
              <div>
                <p className="font-semibold">Get Stripe Test Keys</p>
                <p className="mt-1 text-muted-foreground">
                  Visit{' '}
                  <a
                    href="https://dashboard.stripe.com/test/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline"
                  >
                    Stripe Dashboard
                  </a>{' '}
                  to get your test API keys
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                2
              </div>
              <div>
                <p className="font-semibold">Update Environment Variables</p>
                <p className="mt-1 text-muted-foreground">
                  Add these to your <code className="rounded bg-muted px-1">.env</code> file:
                </p>
                <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-xs">
{`STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_DEV_TESTING=true`}
                </pre>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                3
              </div>
              <div>
                <p className="font-semibold">Restart Backend Server</p>
                <p className="mt-1 text-muted-foreground">
                  Restart your backend to load the new environment variables
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                4
              </div>
              <div>
                <p className="font-semibold">Test Connection</p>
                <p className="mt-1 text-muted-foreground">
                  Click "Test Connection" above to verify Stripe connectivity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 rounded-lg border border-border/70 bg-card p-6">
          <h3 className="mb-4 font-display text-lg font-bold">
            🔒 Security Notes
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ STRIPE_SECRET_KEY is never exposed to the frontend</li>
            <li>✓ All Stripe operations happen on the backend only</li>
            <li>✓ This diagnostic is disabled in production environments</li>
            <li>✓ Always use TEST MODE keys (sk_test_...) for development</li>
            <li>✓ Never commit real Stripe keys to version control</li>
          </ul>
        </div>
      </div>
    </div>
  );
}