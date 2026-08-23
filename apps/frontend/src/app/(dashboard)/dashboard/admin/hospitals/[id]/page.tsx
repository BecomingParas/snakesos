'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  MapPin,
  Phone,
  Shield,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useHospital,
  useDeleteHospital,
  useUpdateHospital,
} from '@/lib/graphql/hooks/hospital.hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PageProps {
  params: Promise<{ id: string }>;
}

type HospitalDetail = {
  id: string;
  name: string;
  address?: string;
  municipality?: string;
  ward?: number;
  district?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  emergencyPhone?: string;
  emergency24x7?: boolean;
  snakebiteTreatmentAvailable?: boolean;
  treatmentCenterType?: string;
  antivenomStatus?: string;
  antivenomVerificationFreshness?: string;
  antivenomLastVerifiedAt?: string;
  antivenomVerifiedBy?: string;
  ventilatorAvailable?: boolean;
  icuAvailable?: boolean;
  ambulanceAvailable?: boolean;
  bloodBankAvailable?: boolean;
  hospitalType?: string;
  officialTreatmentCenter?: boolean;
  verificationStatus?: string;
  source?: string;
  notes?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

type HospitalQueryData = { hospital?: HospitalDetail | null };

export default function HospitalDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editProvince, setEditProvince] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editLatitude, setEditLatitude] = useState('');
  const [editLongitude, setEditLongitude] = useState('');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState('');
  const [editSnakebiteTreatment, setEditSnakebiteTreatment] = useState(false);
  const [editEmergency24x7, setEditEmergency24x7] = useState(false);
  const [editVentilator, setEditVentilator] = useState(false);
  const [editOfficialCenter, setEditOfficialCenter] = useState(false);
  const [editSource, setEditSource] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const { data, loading, error } = useHospital(id);
  const hospital = (data as HospitalQueryData | undefined)?.hospital;
  const [deleteHospital, { loading: deleting }] = useDeleteHospital();
  const [updateHospital, { loading: updating }] = useUpdateHospital();

  const openEdit = () => {
    if (!hospital) return;
    setEditName(hospital.name);
    setEditAddress(hospital.address || '');
    setEditPhone(hospital.phone || '');
    setEditProvince(hospital.province || '');
    setEditDistrict(hospital.district || '');
    setEditLatitude(hospital.latitude?.toString() || '');
    setEditLongitude(hospital.longitude?.toString() || '');
    setEditEmergencyPhone(hospital.emergencyPhone || '');
    setEditSnakebiteTreatment(Boolean(hospital.snakebiteTreatmentAvailable));
    setEditEmergency24x7(Boolean(hospital.emergency24x7));
    setEditVentilator(Boolean(hospital.ventilatorAvailable));
    setEditOfficialCenter(Boolean(hospital.officialTreatmentCenter));
    setEditSource(hospital.source || '');
    setEditNotes(hospital.notes || '');
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      await updateHospital({
        variables: {
          id,
          input: {
            name: editName.trim(),
            address: editAddress.trim(),
            province: editProvince,
            district: editDistrict.trim(),
            phone: editPhone.trim() || undefined,
            emergencyPhone: editEmergencyPhone.trim() || undefined,
            latitude: editLatitude ? Number(editLatitude) : undefined,
            longitude: editLongitude ? Number(editLongitude) : undefined,
            emergency24x7: editEmergency24x7,
            snakebiteTreatmentAvailable: editSnakebiteTreatment,
            ventilatorAvailable: editVentilator,
            officialTreatmentCenter: editOfficialCenter,
            notes: editNotes.trim() || undefined,
          },
        },
      });
      toast.success('Hospital updated successfully');
      setEditOpen(false);
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to update hospital',
      );
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteHospital({ variables: { id } });
      toast.success('Hospital deleted successfully');
      router.push('/dashboard/admin/hospitals');
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to delete hospital',
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/admin/hospitals')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to hospitals
        </Button>
        <Card className="p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-3 text-xl font-semibold">Hospital not found</h1>
          <p className="mt-2 text-muted-foreground">
            {error?.message || 'This hospital record is unavailable.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-6">
      <Button
        variant="outline"
        onClick={() => router.push('/dashboard/admin/hospitals')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to hospitals
      </Button>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{hospital.name}</h1>
            <Badge>{hospital.status || 'ACTIVE'}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Hospital record and antivenom verification details
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hospital</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Update this hospital record. Ensure all information is accurate.
            </p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hospital-name">Hospital Name *</Label>
              <Input
                id="hospital-name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Province *</Label>
                <Select
                  value={editProvince.toLowerCase()}
                  onValueChange={setEditProvince}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Koshi',
                      'Madhesh',
                      'Bagmati',
                      'Gandaki',
                      'Lumbini',
                      'Karnali',
                      'Sudurpaschim',
                    ].map((province) => (
                      <SelectItem key={province} value={province.toLowerCase()}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hospital-district">District *</Label>
                <Input
                  id="hospital-district"
                  value={editDistrict}
                  onChange={(event) => setEditDistrict(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hospital-address">Address *</Label>
              <Input
                id="hospital-address"
                value={editAddress}
                onChange={(event) => setEditAddress(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hospital-latitude">Latitude *</Label>
                <Input
                  id="hospital-latitude"
                  type="number"
                  value={editLatitude}
                  onChange={(event) => setEditLatitude(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hospital-longitude">Longitude *</Label>
                <Input
                  id="hospital-longitude"
                  type="number"
                  value={editLongitude}
                  onChange={(event) => setEditLongitude(event.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hospital-phone">Phone</Label>
                <Input
                  id="hospital-phone"
                  value={editPhone}
                  onChange={(event) => setEditPhone(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hospital-emergency-phone">
                  Emergency Phone
                </Label>
                <Input
                  id="hospital-emergency-phone"
                  value={editEmergencyPhone}
                  onChange={(event) =>
                    setEditEmergencyPhone(event.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Capabilities</Label>
              <div className="space-y-2">
                {[
                  [
                    editSnakebiteTreatment,
                    setEditSnakebiteTreatment,
                    'Snakebite Treatment Available',
                  ],
                  [editEmergency24x7, setEditEmergency24x7, '24/7 Emergency'],
                  [editVentilator, setEditVentilator, 'Ventilator Available'],
                  [
                    editOfficialCenter,
                    setEditOfficialCenter,
                    'Official Treatment Center',
                  ],
                ].map(([checked, setter, label]) => (
                  <label
                    className="flex items-center gap-2 text-sm"
                    key={label as string}
                  >
                    <input
                      type="checkbox"
                      checked={checked as boolean}
                      onChange={(event) =>
                        (setter as (value: boolean) => void)(
                          event.target.checked,
                        )
                      }
                    />
                    {label as string}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hospital-source">Data Source</Label>
              <Input
                id="hospital-source"
                value={editSource}
                onChange={(event) => setEditSource(event.target.value)}
                placeholder="e.g., EDCD, Provincial Health Directorate"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hospital-notes">Notes</Label>
              <Textarea
                id="hospital-notes"
                value={editNotes}
                onChange={(event) => setEditNotes(event.target.value)}
                placeholder="Additional information..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                updating ||
                !editName.trim() ||
                !editAddress.trim() ||
                !editDistrict.trim() ||
                !editProvince ||
                !editLatitude ||
                !editLongitude
              }
              onClick={saveEdit}
            >
              {updating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete hospital?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {hospital.name} from the active hospital list.
              This action cannot be undone from the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete hospital
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5" />
            Location and contact
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>{hospital.address || 'Address not available'}</p>
            <p>
              {hospital.municipality || hospital.district}, {hospital.province}
            </p>
            <p className="flex gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {hospital.phone || 'No phone number'}
            </p>
            {hospital.emergencyPhone && (
              <p className="flex gap-2">
                <Phone className="h-4 w-4 text-red-500" />
                Emergency: {hospital.emergencyPhone}
              </p>
            )}
            <p>
              <strong>Coordinates:</strong> {hospital.latitude ?? 'N/A'},{' '}
              {hospital.longitude ?? 'N/A'}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-5 w-5" />
            Antivenom verification
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>
              <strong>Status:</strong>{' '}
              <Badge>{hospital.antivenomStatus || 'UNKNOWN'}</Badge>
            </p>
            <p className="flex items-center gap-2">
              <strong>Freshness:</strong>
              {hospital.antivenomVerificationFreshness === 'FRESH' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              {hospital.antivenomVerificationFreshness || 'NEVER'}
            </p>
            <p>
              <strong>Verification:</strong>{' '}
              {hospital.verificationStatus || 'UNVERIFIED'}
            </p>
            <p>
              <strong>Last verified:</strong>{' '}
              {hospital.antivenomLastVerifiedAt
                ? new Date(hospital.antivenomLastVerifiedAt).toLocaleString()
                : 'Never'}
            </p>
            <p>
              <strong>Verified by:</strong>{' '}
              {hospital.antivenomVerifiedBy || 'Not available'}
            </p>
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Capabilities and metadata</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <p>
              <strong>Snakebite treatment:</strong>{' '}
              {hospital.snakebiteTreatmentAvailable
                ? 'Available'
                : 'Not available'}
            </p>
            <p>
              <strong>24/7 emergency:</strong>{' '}
              {hospital.emergency24x7 ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Ventilator:</strong>{' '}
              {hospital.ventilatorAvailable ? 'Available' : 'No'}
            </p>
            <p>
              <strong>ICU:</strong> {hospital.icuAvailable ? 'Available' : 'No'}
            </p>
            <p>
              <strong>Hospital type:</strong>{' '}
              {hospital.hospitalType || 'Not specified'}
            </p>
            <p>
              <strong>Source:</strong> {hospital.source || 'Not specified'}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(hospital.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated:</strong>{' '}
              {new Date(hospital.updatedAt).toLocaleDateString()}
            </p>
          </div>
          {hospital.notes && (
            <p className="mt-4 border-t pt-4 text-sm">
              <strong>Notes:</strong> {hospital.notes}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
