'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useHospital,
  useUpdateHospital,
} from '@/lib/graphql/hooks/hospital.hooks';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

type HospitalFormData = {
  name: string;
  address: string;
  municipality: string;
  district: string;
  province: string;
  ward: string;
  phone: string;
  emergencyPhone: string;
  latitude: string;
  longitude: string;
  emergency24x7: boolean;
  snakebiteTreatmentAvailable: boolean;
  ventilatorAvailable: boolean;
  icuAvailable: boolean;
  ambulanceAvailable: boolean;
  bloodBankAvailable: boolean;
  notes: string;
};

type HospitalData = Partial<HospitalFormData> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type HospitalQueryData = { hospital?: HospitalData | null };

const emptyForm: HospitalFormData = {
  name: '',
  address: '',
  municipality: '',
  district: '',
  province: '',
  ward: '',
  phone: '',
  emergencyPhone: '',
  latitude: '',
  longitude: '',
  emergency24x7: false,
  snakebiteTreatmentAvailable: false,
  ventilatorAvailable: false,
  icuAvailable: false,
  ambulanceAvailable: false,
  bloodBankAvailable: false,
  notes: '',
};

export default function HospitalEditPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useHospital(id);
  const hospital = (data as HospitalQueryData | undefined)?.hospital;
  const [form, setForm] = useState<HospitalFormData>(emptyForm);
  const [updateHospital, { loading: saving }] = useUpdateHospital();

  useEffect(() => {
    if (!hospital) return;
    setForm({
      name: hospital.name || '',
      address: hospital.address || '',
      municipality: hospital.municipality || '',
      district: hospital.district || '',
      province: hospital.province || '',
      ward: hospital.ward?.toString() || '',
      phone: hospital.phone || '',
      emergencyPhone: hospital.emergencyPhone || '',
      latitude: hospital.latitude?.toString() || '',
      longitude: hospital.longitude?.toString() || '',
      emergency24x7: hospital.emergency24x7 || false,
      snakebiteTreatmentAvailable:
        hospital.snakebiteTreatmentAvailable || false,
      ventilatorAvailable: hospital.ventilatorAvailable || false,
      icuAvailable: hospital.icuAvailable || false,
      ambulanceAvailable: hospital.ambulanceAvailable || false,
      bloodBankAvailable: hospital.bloodBankAvailable || false,
      notes: hospital.notes || '',
    });
  }, [hospital]);

  const setField = <Key extends keyof HospitalFormData>(
    key: Key,
    value: HospitalFormData[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    if (
      !form.name.trim() ||
      !form.address.trim() ||
      !form.district.trim() ||
      !form.province.trim()
    ) {
      toast.error('Name, address, district, and province are required');
      return;
    }
    try {
      await updateHospital({
        variables: {
          id,
          input: {
            ...form,
            ward: form.ward ? Number(form.ward) : undefined,
            latitude: form.latitude ? Number(form.latitude) : undefined,
            longitude: form.longitude ? Number(form.longitude) : undefined,
          },
        },
      });
      toast.success('Hospital updated successfully');
      router.push(`/dashboard/admin/hospitals/${id}`);
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to update hospital',
      );
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error || !hospital)
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/admin/hospitals')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to hospitals
        </Button>
        <Card className="p-8 text-center">Hospital not found</Card>
      </div>
    );

  return (
    <div className="min-h-screen space-y-6 p-6">
      <Button
        variant="outline"
        onClick={() => router.push(`/dashboard/admin/hospitals/${id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to hospital
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Edit hospital</h1>
        <p className="mt-1 text-muted-foreground">
          Update the hospital record and treatment capabilities.
        </p>
      </div>
      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {(
            [
              'name',
              'address',
              'municipality',
              'district',
              'province',
              'ward',
              'phone',
              'emergencyPhone',
              'latitude',
              'longitude',
            ] as const
          ).map((key) => (
            <div className="grid gap-2" key={key}>
              <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1')}</Label>
              <Input
                id={key}
                value={form[key]}
                onChange={(event) => setField(key, event.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              'emergency24x7',
              'snakebiteTreatmentAvailable',
              'ventilatorAvailable',
              'icuAvailable',
              'ambulanceAvailable',
              'bloodBankAvailable',
            ] as const
          ).map((key) => (
            <label className="flex items-center gap-2 text-sm" key={key}>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) => setField(key, event.target.checked)}
              />
              <span>{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={save}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
