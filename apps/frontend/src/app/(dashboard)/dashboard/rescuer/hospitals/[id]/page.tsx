'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHospital } from '@/lib/graphql/hooks/hospital.hooks';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface HospitalDetail {
  id: string;
  name: string;
  address?: string | null;
  municipality?: string | null;
  ward?: number | null;
  district?: string | null;
  province?: string | null;
  phone?: string | null;
  emergencyPhone?: string | null;
  emergencyAvailable?: boolean;
  emergency24x7?: boolean;
  snakebiteTreatmentAvailable?: boolean;
  treatmentCenterType?: string | null;
  antivenomStatus?: string | null;
  antivenomVerificationFreshness?: string | null;
  antivenomLastVerifiedAt?: string | null;
  ventilatorAvailable?: boolean;
  icuAvailable?: boolean;
  ambulanceAvailable?: boolean;
  bloodBankAvailable?: boolean;
  hospitalType?: string | null;
  status?: string | null;
  verificationRecords?: Array<{
    id: string;
    verificationDate?: string | null;
    antivenomStatus?: string | null;
    notes?: string | null;
  }>;
}

function statusClass(status?: string | null) {
  if (status === 'AVAILABLE') return 'bg-success/15 text-success';
  if (status === 'LOW_STOCK') return 'bg-warning/15 text-warning';
  if (status === 'OUT_OF_STOCK') return 'bg-destructive/15 text-destructive';
  return 'bg-muted text-muted-foreground';
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

export default function RescuerHospitalDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useHospital(id);
  const hospital = (data as { hospital?: HospitalDetail | null } | undefined)
    ?.hospital;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/rescuer/hospitals')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to hospitals
        </Button>
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">Hospital not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || 'This hospital record is unavailable.'}
          </p>
        </Card>
      </div>
    );
  }

  const phone = hospital.emergencyPhone || hospital.phone;
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Button
        variant="outline"
        onClick={() => router.push('/dashboard/rescuer/hospitals')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to hospitals
      </Button>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold sm:text-3xl">{hospital.name}</h1>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {hospital.address ||
              hospital.municipality ||
              'Location not recorded'}
            {hospital.ward ? `, Ward ${hospital.ward}` : ''}
          </p>
        </div>
        <Badge>{hospital.status || 'ACTIVE'}</Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Treatment and emergency care</h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail
                label="Snakebite treatment"
                value={
                  hospital.snakebiteTreatmentAvailable
                    ? 'Available'
                    : 'Not confirmed'
                }
              />
              <Detail
                label="Treatment center"
                value={
                  hospital.treatmentCenterType ||
                  hospital.hospitalType ||
                  'Not recorded'
                }
              />
              <Detail
                label="Emergency service"
                value={
                  hospital.emergency24x7 || hospital.emergencyAvailable
                    ? 'Available'
                    : 'Not confirmed'
                }
              />
              <Detail
                label="Antivenom status"
                value={hospital.antivenomStatus || 'Unknown'}
              />
              <Detail
                label="ICU"
                value={hospital.icuAvailable ? 'Available' : 'Not confirmed'}
              />
              <Detail
                label="Ambulance"
                value={
                  hospital.ambulanceAvailable ? 'Available' : 'Not confirmed'
                }
              />
              <Detail
                label="Ventilator"
                value={
                  hospital.ventilatorAvailable ? 'Available' : 'Not confirmed'
                }
              />
              <Detail
                label="Blood bank"
                value={
                  hospital.bloodBankAvailable ? 'Available' : 'Not confirmed'
                }
              />
            </div>
          </Card>
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Antivenom verification</h2>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge className={statusClass(hospital.antivenomStatus)}>
                Antivenom: {hospital.antivenomStatus || 'UNKNOWN'}
              </Badge>
              <Badge variant="outline">
                {hospital.antivenomVerificationFreshness || 'NEVER'}
              </Badge>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Last verified:{' '}
              {hospital.antivenomLastVerifiedAt
                ? new Date(hospital.antivenomLastVerifiedAt).toLocaleString()
                : 'Not recorded'}
            </p>
            {hospital.verificationRecords?.[0]?.notes && (
              <p className="mt-3 text-sm">
                Note: {hospital.verificationRecords[0].notes}
              </p>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <h2 className="font-semibold">Contact</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {hospital.address ||
                hospital.municipality ||
                'Location not recorded'}
              {hospital.district ? `, ${hospital.district}` : ''}
              {hospital.province ? `, ${hospital.province}` : ''}
            </p>
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="mt-5 inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                Phone not recorded
              </p>
            )}
          </Card>
          <Card className="border-warning/30 bg-warning/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <p className="text-sm leading-6">
                Call ahead to confirm antivenom and emergency capacity before
                transporting a patient.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
