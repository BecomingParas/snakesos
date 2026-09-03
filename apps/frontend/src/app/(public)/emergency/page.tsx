'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql } from '@apollo/client';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  FileText,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Send,
  TriangleAlert,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useMutation } from '@/lib/apollo/hooks';

const HOTLINE = '9816482570';
const STEPS = ['Contact Info', 'Location', 'Details', 'Submit'] as const;
const MUNICIPALITIES = [
  'Butwal',
  'Tilottama',
  'Siddharthanagar',
  'Devdaha',
  'Other',
] as const;

const SUBMIT_PUBLIC_EMERGENCY_REQUEST = gql`
  mutation SubmitPublicEmergencyRequest($input: PublicEmergencyRequestInput!) {
    submitPublicEmergencyRequest(input: $input) {
      success
      referenceNumber
      publicStatus
      createdAt
    }
  }
`;

type EmergencyFormFields = {
  name: string;
  phone: string;
};

function getGraphQLFieldErrors(error: unknown) {
  const graphQLErrors = (
    error as {
      graphQLErrors?: Array<{
        extensions?: {
          context?: { errors?: Array<{ path?: string; message?: string }> };
        };
      }>;
    }
  ).graphQLErrors;

  return (
    graphQLErrors?.flatMap(
      (graphQLError) => graphQLError.extensions?.context?.errors || [],
    ) || []
  );
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('977') && digits.length === 13
    ? digits.slice(3)
    : digits;
}

function formatNepalDateTime(value: string) {
  return new Intl.DateTimeFormat('en-NP', {
    timeZone: 'Asia/Kathmandu',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function EmergencyPage() {
  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EmergencyFormFields>();
  const [step, setStep] = useState(0);
  const [ticket, setTicket] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `public-emergency-${Date.now()}`,
  );
  const [deviceId] = useState(() => {
    if (typeof window === 'undefined') return 'server';
    const storageKey = 'snake-rescue-device-id';
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;
    const created =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `device-${Date.now()}`;
    window.localStorage.setItem(storageKey, created);
    return created;
  });
  const [submitEmergency, { loading: submitting }] = useMutation<
    {
      submitPublicEmergencyRequest: {
        success: boolean;
        referenceNumber: string;
        publicStatus?: string | null;
        createdAt?: string | null;
      };
    },
    {
      input: {
        fullName: string;
        phone: string;
        municipality: string;
        generalArea: string;
        address: string;
        latitude?: number | null;
        longitude?: number | null;
        snakeDescription?: string;
        urgency?: string;
        isEmergency?: boolean;
        hasBite?: boolean;
        notes?: string;
        idempotencyKey?: string;
        deviceId?: string;
      };
    }
  >(SUBMIT_PUBLIC_EMERGENCY_REQUEST);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    municipality: 'Butwal',
    address: '',
    notes: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (ticket)
    return (
      <SuccessCard ticket={ticket} submittedAt={submittedAt} form={form} />
    );

  return (
    <div className="pb-16">
      <div className="bg-destructive px-5 py-3 text-center text-sm font-semibold text-destructive-foreground">
        <span className="mr-2">●</span> Life-threatening? Call directly:{' '}
        <a href={`tel:${HOTLINE}`} className="underline underline-offset-4">
          {HOTLINE}
        </a>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black dark:text-white shadow-sm">
          Emergency Request
        </span>
        <h1 className="mt-6 font-display text-5xl lg:text-6xl font-bold">
          Request Snake Rescue
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our team responds within 30 minutes across Rupandehi District.
        </p>

        <ol className="mx-auto mt-9 flex max-w-xl items-start">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className="relative flex flex-1 flex-col items-center"
            >
              {i > 0 && (
                <span
                  className={cn(
                    'absolute left-[-50%] top-4 h-px w-full',
                    i <= step ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
              <span
                className={cn(
                  'relative grid h-8 w-8 place-items-center rounded-full border text-xs font-bold',
                  i < step
                    ? 'border-primary bg-primary text-primary-foreground'
                    : i === step
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-secondary/50 text-muted-foreground',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  'mt-2 text-xs',
                  i === step
                    ? 'font-semibold text-primary'
                    : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-10 max-w-xl px-5">
        <div className="rounded-2xl border border-border/30 bg-background/60 backdrop-blur-2xl shadow-lg p-7 text-left">
          {step === 0 && (
            <>
              <StepHead
                icon={User}
                title="Your Contact Details"
                sub="So our team can reach you"
              />
              <Field label="Full Name *">
                <Input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Your full name"
                />
              </Field>
              <Field label="Phone Number *">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...register('phone')}
                    className="pl-9"
                    value={form.phone}
                    onChange={(e) => {
                      clearErrors('phone');
                      set('phone', e.target.value);
                    }}
                    placeholder="98XXXXXXXX"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </Field>
              <Button
                className="mt-6 w-full"
                size="lg"
                disabled={!form.name.trim() || !form.phone.trim()}
                onClick={() => setStep(1)}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <StepHead
                icon={MapPin}
                title="Your Location"
                sub="Where is the snake sighting?"
              />
              <p className="mb-2 text-sm text-muted-foreground">Municipality</p>
              <div className="flex flex-wrap gap-2">
                {MUNICIPALITIES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => set('municipality', m)}
                    className={cn(
                      'flex-1 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm transition-colors',
                      form.municipality === m
                        ? 'border-primary/60 bg-primary/15 font-semibold text-primary'
                        : 'border-border/70 bg-secondary/50 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <Button
                variant="secondary"
                className="mt-4 w-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                size="lg"
                onClick={() =>
                  navigator.geolocation?.getCurrentPosition((p) =>
                    setForm((current) => ({
                      ...current,
                      address: 'Current GPS location captured',
                      latitude: p.coords.latitude,
                      longitude: p.coords.longitude,
                    })),
                  )
                }
              >
                <Navigation className="h-4 w-4" /> Use My Current GPS Location
              </Button>
              <Field label="Address / Landmark *">
                <Textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="e.g. Near Buddha Chowk, opposite petrol pump, house no. 45..."
                />
              </Field>
              <NavRow
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
                nextDisabled={!form.address.trim()}
              />
            </>
          )}

          {step === 2 && (
            <>
              <StepHead
                icon={Eye}
                title="Additional Details"
                sub="Optional but helpful for our team"
              />
              <Field label="Any notes (snake description, is anyone bitten, etc.)">
                <Textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="e.g. Black snake about 1 meter, coiled near drain. No one bitten."
                />
              </Field>
              <div className="mt-4 flex gap-3 rounded-lg border border-warning/50 bg-warning/10 p-4 text-sm">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-muted-foreground">
                  <span className="block font-semibold text-warning">
                    If someone is bitten:
                  </span>
                  Go to Lumbini Provincial Hospital immediately. Do NOT suck the
                  venom or apply tourniquet.
                </p>
              </div>
              <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} />
            </>
          )}

          {step === 3 && (
            <>
              <StepHead
                icon={FileText}
                title="Review & Submit"
                sub="Confirm details before submitting"
              />
              <div className="space-y-3">
                {[
                  ['Name', form.name],
                  ['Phone', form.phone],
                  ['Municipality', form.municipality],
                  ['Address', form.address],
                  ['Notes', form.notes || '—'],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-lg border border-border/70 bg-secondary/40 px-4 py-3"
                  >
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  disabled={submitting}
                  onClick={async () => {
                    setSubmitError(null);
                    try {
                      const result = await submitEmergency({
                        variables: {
                          input: {
                            fullName: form.name.trim(),
                            phone: normalizePhone(form.phone),
                            municipality: form.municipality,
                            generalArea: form.address.trim(),
                            address: form.address.trim(),
                            latitude: form.latitude,
                            longitude: form.longitude,
                            snakeDescription: form.notes.trim() || undefined,
                            urgency: 'CRITICAL',
                            isEmergency: true,
                            hasBite: /bite|bitten/i.test(form.notes),
                            notes: form.notes.trim() || undefined,
                            idempotencyKey,
                            deviceId,
                          },
                        },
                      });
                      const referenceNumber =
                        result.data?.submitPublicEmergencyRequest
                          ?.referenceNumber;
                      if (!referenceNumber)
                        throw new Error('Emergency report was not confirmed');
                      setSubmittedAt(
                        result.data?.submitPublicEmergencyRequest?.createdAt ||
                          new Date().toISOString(),
                      );
                      setTicket(referenceNumber);
                    } catch (error) {
                      const fieldErrors = getGraphQLFieldErrors(error);
                      const phoneError = fieldErrors.find(
                        (fieldError) => fieldError.path === 'phone',
                      );
                      if (phoneError?.message) {
                        setError('phone', {
                          type: 'server',
                          message: phoneError.message,
                        });
                      }
                      setSubmitError(
                        phoneError
                          ? null
                          : error instanceof Error
                            ? error.message
                            : 'Unable to submit emergency request',
                      );
                    }
                  }}
                >
                  <Send className="h-4 w-4" />{' '}
                  {submitting ? 'Submitting...' : 'Submit Emergency Request'}
                </Button>
              </div>
              {submitError && (
                <p className="mt-3 text-sm text-destructive">
                  We couldn&apos;t submit your emergency request. {submitError}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Having trouble? Call us directly:
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <Button
              asChild
              variant="secondary"
              className="border border-primary/40 bg-primary/10 text-primary"
            >
              <a href={`tel:${HOTLINE}`}>
                <Phone className="h-4 w-4" /> {HOTLINE}
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="border border-primary/40 bg-primary/10 text-primary"
            >
              <a
                href={`https://wa.me/977${HOTLINE}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHead({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof User;
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-primary/40 bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <span>
        <span className="block text-lg font-bold">{title}</span>
        <span className="block text-sm text-muted-foreground">{sub}</span>
      </span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1.5 block text-sm text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function NavRow({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <Button variant="outline" size="lg" onClick={onBack}>
        Back
      </Button>
      <Button size="lg" onClick={onNext} disabled={nextDisabled}>
        Continue <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SuccessCard({
  ticket,
  submittedAt,
  form,
}: {
  ticket: string;
  submittedAt: string | null;
  form: { phone: string; address: string; municipality: string };
}) {
  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <div className="rounded-2xl border border-border/30 bg-background/60 backdrop-blur-2xl shadow-xl p-8 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-primary/40 bg-primary/15">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">
          Help Is Coming!
        </h1>
        <p className="mt-1 font-semibold text-primary">
          Rescue team has been alerted
        </p>

        <div className="mt-6 rounded-xl border border-border/70 bg-secondary/40 px-4 py-4">
          <p className="text-sm text-muted-foreground">Reference Number</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-primary">
            {ticket}
          </p>
        </div>

        {submittedAt && (
          <p className="mt-3 text-sm text-muted-foreground">
            Received {formatNepalDateTime(submittedAt)} (Nepal time)
          </p>
        )}

        <div className="mt-4 space-y-2.5 text-left text-sm">
          <p className="flex items-center gap-2 rounded-lg border border-border/70 bg-secondary/40 px-4 py-3 text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" /> Our team will call{' '}
            <span className="font-semibold text-foreground">{form.phone}</span>{' '}
            within 5–10 minutes
          </p>
          <p className="flex items-center gap-2 rounded-lg border border-border/70 bg-secondary/40 px-4 py-3 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" /> Location:{' '}
            <span className="font-semibold text-foreground">
              {form.address}, {form.municipality}
            </span>
          </p>
        </div>

        <div className="mt-6 border-t border-border/70 pt-5">
          <p className="text-sm text-muted-foreground">
            While you wait — STAY SAFE:
          </p>
          <ul className="mt-3 space-y-2 text-left text-sm">
            {[
              'Keep distance from the snake (≥ 3 meters)',
              'Photo from safe distance — DO NOT touch',
              'Close doors/windows if indoors',
              'If bitten, go to Lumbini Provincial Hospital immediately',
            ].map((t) => (
              <li
                key={t}
                className="rounded-lg border border-border/70 bg-secondary/40 px-4 py-2.5"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg">
            <a href={`tel:${HOTLINE}`}>
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
