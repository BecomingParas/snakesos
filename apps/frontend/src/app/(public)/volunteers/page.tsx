'use client';

import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileText,
  GraduationCap,
  Heart,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { volunteers } from '@/lib/demo-data';
import { useApplyVolunteerMutation } from '@/lib/graphql/hooks/volunteer.hooks';
import { MediaUploader } from '@/components/media/MediaUploader';
import { PaymentMethod, PaymentMethodSelector } from '@/components/payment';

const heroStats = [
  { value: '25+', label: 'Active volunteers' },
  { value: '500+', label: 'Rescues completed' },
  { value: '5', label: 'Coverage zones' },
  { value: '24/7', label: 'Emergency response' },
];

const benefits = [
  {
    icon: GraduationCap,
    title: 'Professional Training',
    body: 'Free snake handling & rescue training from experts.',
    tone: 'text-primary',
  },
  {
    icon: Award,
    title: 'Wildlife Certificate',
    body: 'Official certificate from the SnakeSOS rescue network.',
    tone: 'text-warning',
  },
  {
    icon: Zap,
    title: 'Emergency Skills',
    body: 'Learn life-saving first aid and crisis response.',
    tone: 'text-accent',
  },
  {
    icon: Heart,
    title: 'Community Impact',
    body: 'Make a real difference in Rupandehi communities.',
    tone: 'text-destructive',
  },
];

const municipalities = [
  'Butwal',
  'Tilottama',
  'Siddharthanagar',
  'Devdaha',
  'Other',
];

// Card shell reused across the page so every panel matches
const PANEL =
  'rounded-2xl border border-border/30 bg-background/60 backdrop-blur-xl shadow-md';

export default function VolunteersPage() {
  const [selected, setSelected] = useState<string[]>(['Butwal']);
  const [submitted, setSubmitted] = useState(false);
  const [profileVideoUploaded, setProfileVideoUploaded] = useState(false);
  const [identityDocumentUploaded, setIdentityDocumentUploaded] =
    useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [applicationReference, setApplicationReference] = useState<
    string | null
  >(null);
  const [applyVolunteer, { loading: submitting }] = useApplyVolunteerMutation();

  function toggle(m: string) {
    setSelected((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!paymentComplete) {
      toast.error('Complete the NPR 1,000 application-fee payment first.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const getValue = (name: string) => String(formData.get(name) || '').trim();
    const experience = getValue('experience');
    const vehicle = getValue('vehicle');
    const availableTime = getValue('availableTime');
    const equipment = getValue('equipment');

    try {
      const result = await applyVolunteer({
        variables: {
          input: {
            name: getValue('name'),
            contact: getValue('contact'),
            email: getValue('email'),
            address: getValue('address'),
            municipality: getValue('municipality'),
            experience,
            experienceYears: Number(getValue('experienceYears') || 0),
            vehicle,
            vehicleDetails: equipment,
            skills: getValue('skills')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            certifications: getValue('certifications')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            availableTime,
            availableDays: [
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
              'SUNDAY',
            ],
            emergencyAvailability: getValue('emergencyAvailability') === 'true',
            assignedZone: selected.join(', '),
            coverageRadius: 20,
            bio: getValue('experienceDescription'),
            hasEquipment: Boolean(equipment),
            equipment: equipment
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          },
        },
      });
      setApplicationReference(result.data?.applyVolunteer.id || null);
      setSubmitted(true);
      toast.success('Application submitted for admin verification.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to submit application',
      );
    }
  }

  async function handleDemoPayment() {
    if (!paymentMethod) {
      toast.error('Choose a payment method first.');
      return;
    }

    setPaymentProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setPaymentComplete(true);
    setPaymentProcessing(false);
    toast.success(
      'Development payment completed. You can now submit your application.',
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16">
        <div className={`${PANEL} border-primary/30 p-8`}>
          <div className="flex items-center gap-3 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              Application received
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-bold">
            Your rescuer application is in review
          </h1>
          {applicationReference && (
            <p className="mt-2 text-sm font-semibold text-primary">
              Application ID: {applicationReference}
            </p>
          )}
          <p className="mt-3 max-w-2xl text-muted-foreground">
            We have received your profile, experience, and evidence. An
            administrator will review your application, verify your credentials,
            and contact you if any additional information is required.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Application submitted',
                detail: 'Your profile and experience details were captured',
              },
              {
                title: 'Evidence review',
                detail:
                  'Admin checks your training, references, and rescue history',
              },
              {
                title: 'Verification decision',
                detail: 'Approved, needs more info, or rejected',
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border/40 bg-secondary/30 p-4"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                  Step {i + 1}
                </span>
                <p className="mt-1 font-semibold">{step.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <Button className="mt-8" onClick={() => setSubmitted(false)}>
            Submit another application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-20 text-center lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent shadow-sm">
            <Users className="h-3.5 w-3.5" /> Join our team
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight lg:text-6xl">
            Apply to Become a Rescuer
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            This is the onboarding form for new rescuers. Applications are
            reviewed before access is granted to the operational rescuer
            dashboard where live rescue assignments are managed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((s) => (
            <div
              key={s.label}
              className={`${PANEL} p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <p className="font-display text-2xl font-extrabold text-primary">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <h2 className="mt-16 text-2xl font-bold">Why Volunteer With Us?</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              className={`${PANEL} flex gap-4 p-6 transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border/70 bg-secondary/60">
                <b.icon className={`h-4 w-4 ${b.tone}`} />
              </span>
              <span>
                <span className="block font-semibold text-primary">
                  {b.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {b.body}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Rescuers */}
        <div className="mt-14 text-center">
          <h2 className="text-2xl font-bold">Meet Our Rescuers</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-primary/80">
            The brave individuals dedicating their time to save both humans and
            snakes across Rupandehi.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {volunteers.slice(0, 6).map((v) => (
            <div
              key={v.id}
              className={`${PANEL} overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="relative grid h-44 place-items-center bg-primary/15">
                <span className="font-display text-4xl font-extrabold text-primary/70">
                  {v.initials}
                </span>
                <span
                  className={
                    'absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ' +
                    (v.status === 'available'
                      ? 'bg-success/20 text-success'
                      : v.status === 'on-rescue'
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-accent/20 text-accent')
                  }
                >
                  {v.status.replace('-', ' ')}
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

        {/* Application */}
        <div className={`${PANEL} mt-16 p-8`}>
          <h2 className="text-lg font-bold">Rescuer Application</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your details — this is not the live rescue dashboard.
            Approved rescuers get dashboard access after verification.
          </p>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Important: public application and assignment selection are
              separate. A submitted application does not mean a rescuer is
              active or eligible to receive rescue requests.
            </span>
          </div>

          <form className="mt-8" onSubmit={handleSubmit}>
            {/* 01 — Applicant details */}
            <SectionHeader
              icon={Users}
              index="01"
              title="Applicant details"
              description="Who you are and how we reach you."
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full Name *">
                <Input required name="name" placeholder="Your full name" />
              </Field>
              <Field label="Phone / Contact *">
                <Input
                  required
                  name="contact"
                  placeholder="98XXXXXXXX"
                  inputMode="tel"
                />
              </Field>
              <Field label="Email *">
                <Input
                  required
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                />
              </Field>
              <Field label="Municipality *">
                <Input required name="municipality" defaultValue="Butwal" />
              </Field>
              <Field label="District">
                <Input placeholder="Rupandehi" />
              </Field>
              <Field label="Province">
                <Input placeholder="Lumbini" />
              </Field>
              <div className="md:col-span-2">
                <Field label="General Location *">
                  <Input
                    name="address"
                    required
                    placeholder="Near Butwal, ward 10"
                  />
                </Field>
              </div>
            </div>

            <Divider />

            {/* 02 — Service area */}
            <SectionHeader
              icon={MapPin}
              index="02"
              title="Service area"
              description="Pick every zone you're able to cover."
            />
            <div className="grid gap-2 sm:grid-cols-3">
              {municipalities.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggle(m)}
                  className={
                    'rounded-xl border px-4 py-3 text-sm font-medium transition-all ' +
                    (selected.includes(m)
                      ? 'border-accent bg-accent text-accent-foreground shadow-md'
                      : 'border-border/30 bg-background/40 text-muted-foreground backdrop-blur-sm hover:border-accent/40 hover:text-foreground')
                  }
                >
                  {m}
                </button>
              ))}
            </div>

            <Divider />

            {/* 03 — Experience & skills */}
            <SectionHeader
              icon={GraduationCap}
              index="03"
              title="Experience & skills"
              description="What you've handled and what you bring."
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Years of experience">
                <Input
                  name="experienceYears"
                  type="number"
                  min={0}
                  placeholder="0"
                />
              </Field>
              <Field label="Experience level">
                <select
                  name="experience"
                  className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="EXPERT">Advanced</option>
                </select>
              </Field>
              <Field label="Snake rescue experience">
                <select
                  name="snakeExperience"
                  className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm"
                >
                  <option value="BEGINNER">None</option>
                  <option value="INTERMEDIATE">1-20 rescues</option>
                  <option value="EXPERT">20+ rescues</option>
                </select>
              </Field>
              <Field label="Animal rescue experience">
                <select className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm">
                  <option>No</option>
                  <option>Some</option>
                  <option>Moderate</option>
                  <option>Extensive</option>
                </select>
              </Field>
              <Field label="Skills">
                <Input
                  name="skills"
                  placeholder="Snake rescue, first aid, public safety"
                />
              </Field>
              <Field label="Training & certifications">
                <Input
                  name="certifications"
                  placeholder="Snake handling, first aid, wildlife rescue"
                />
              </Field>
              <Field label="Certificate expiry">
                <Input type="date" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Experience Description *">
                  <Textarea
                    name="experienceDescription"
                    rows={4}
                    required
                    placeholder="Describe your previous snake rescue and wildlife response experience, organizations you worked with, and any training you have received."
                  />
                </Field>
              </div>
            </div>

            <Divider />

            {/* 04 — Availability & logistics */}
            <SectionHeader
              icon={Zap}
              index="04"
              title="Availability & logistics"
              description="When you can respond, and what you'll bring."
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Vehicle / transport">
                <select
                  name="vehicle"
                  className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm"
                >
                  <option value="NONE">None</option>
                  <option value="BIKE">Bicycle or motorbike</option>
                  <option value="CAR">Car / Jeep</option>
                </select>
              </Field>
              <Field label="Available time">
                <select
                  name="availableTime"
                  className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm"
                >
                  <option value="ANYTIME">Anytime</option>
                  <option value="WEEKDAYS">Daytime only</option>
                  <option value="EVENINGS">Night only</option>
                  <option value="WEEKENDS">Weekends</option>
                </select>
              </Field>
              <Field label="Emergency availability">
                <select
                  name="emergencyAvailability"
                  className="h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm"
                >
                  <option value="true">Yes — available for emergencies</option>
                  <option value="false">No — scheduled shifts only</option>
                </select>
              </Field>
              <Field label="Equipment available">
                <Input
                  name="equipment"
                  placeholder="Snake hook, gloves, flashlight, first aid kit"
                />
              </Field>
            </div>

            <Divider />

            {/* 05 — Evidence & verification */}
            <SectionHeader
              icon={ShieldCheck}
              index="05"
              title="Evidence & verification"
              description="Used only for rescuer verification and review."
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Profile video">
                <div className="rounded-md border border-dashed border-border bg-secondary/30 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Video className="h-4 w-4" />
                    <span>MP4, WebM, or MOV up to 50 MB</span>
                  </div>
                  <MediaUploader
                    mediaType="RESCUER_PROFILE_VIDEO"
                    accept="video/mp4,video/webm,video/quicktime"
                    label={
                      profileVideoUploaded
                        ? 'Video uploaded'
                        : 'Upload short introduction video'
                    }
                    onUploaded={() => {
                      setProfileVideoUploaded(true);
                      toast.success('Profile video uploaded for review.');
                    }}
                  />
                </div>
              </Field>
              <Field label="Identity document">
                <div className="rounded-md border border-dashed border-border bg-secondary/30 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span>JPG, PNG, WebP, or PDF up to 10 MB</span>
                  </div>
                  <MediaUploader
                    mediaType="RESCUER_VERIFICATION_DOCUMENT"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    label={
                      identityDocumentUploaded
                        ? 'ID uploaded'
                        : 'Upload ID for verification'
                    }
                    onUploaded={() => {
                      setIdentityDocumentUploaded(true);
                      toast.success('Identity document uploaded for review.');
                    }}
                  />
                </div>
              </Field>
              <div className="md:col-span-2">
                <Field label="Reference details (Optional)">
                  <Textarea
                    rows={3}
                    placeholder="Reference name, organization, phone, relationship, and context of support."
                  />
                </Field>
              </div>

              <div className="rounded-2xl border border-border/40 bg-secondary/20 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="h-4 w-4" />
                  <span className="font-semibold">Required evidence</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Past rescue photos or videos</li>
                  <li>• Training certificates</li>
                  <li>• Proof of relevant experience</li>
                  <li>• Reference or recommendation</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/40 bg-secondary/20 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold">Operational area</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Province and district are recorded separately from private
                    address
                  </li>
                  <li>• Service radius is reviewed by administrators</li>
                  <li>• Only verified rescuers are included in dispatch</li>
                </ul>
              </div>
            </div>

            <Divider />

            <section className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Application fee
                  </p>
                  <h3 className="mt-1 text-xl font-bold">NPR 1,000</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Required for administrative review and rescuer verification.
                  </p>
                </div>
                {paymentComplete && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" /> Paid
                  </span>
                )}
              </div>

              {!paymentComplete ? (
                <div className="mt-5 space-y-4">
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onSelect={setPaymentMethod}
                  />
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      Total due
                    </span>
                    <span className="font-mono text-lg font-bold">
                      NPR 1,000
                    </span>
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleDemoPayment}
                    disabled={!paymentMethod || paymentProcessing}
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" /> Pay NPR 1,000 &
                        continue
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-warning">
                    Development mode: this simulates payment and does not charge
                    a card.
                  </p>
                </div>
              ) : (
                <p className="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
                  Payment complete for development. Your application can now be
                  submitted for admin review.
                </p>
              )}
            </section>

            <Button
              type="submit"
              size="lg"
              className="mt-8 w-full"
              disabled={submitting}
            >
              <Heart className="mr-1.5 h-4 w-4" /> Submit rescuer application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  index,
  title,
  description,
}: {
  icon: React.ElementType;
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
          Section {index}
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-8 h-px w-full bg-border/40" />;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-primary/90">{label}</span>
      {children}
    </label>
  );
}
