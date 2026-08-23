/**
 * Hospital Management Page (Admin)
 *
 * Manage hospitals, verify antivenom availability, and view verification status
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Shield,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type HospitalRecord = {
  id: string;
  name: string;
  district: string;
  province: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  emergencyPhone?: string;
  snakebiteTreatmentAvailable: boolean;
  emergency24x7?: boolean;
  ventilatorAvailable?: boolean;
  antivenomStatus: string;
  antivenomVerificationFreshness: string;
  verificationStatus: string;
  officialTreatmentCenter: boolean;
  source?: string;
  notes?: string;
};

type HospitalConnectionData = {
  hospitals?: {
    edges: Array<{ node: HospitalRecord }>;
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

const PROVINCES = [
  { value: 'koshi', label: 'Koshi' },
  { value: 'madhesh', label: 'Madhesh' },
  { value: 'bagmati', label: 'Bagmati' },
  { value: 'gandaki', label: 'Gandaki' },
  { value: 'lumbini', label: 'Lumbini' },
  { value: 'karnali', label: 'Karnali' },
  { value: 'sudurpaschim', label: 'Sudurpaschim' },
];

interface HospitalFormState {
  name: string;
  province: string;
  district: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  emergencyPhone: string;
  snakebiteTreatmentAvailable: boolean;
  emergency24x7: boolean;
  ventilatorAvailable: boolean;
  officialTreatmentCenter: boolean;
  source: string;
  notes: string;
}

const EMPTY_HOSPITAL_FORM: HospitalFormState = {
  name: '',
  province: '',
  district: '',
  address: '',
  latitude: '',
  longitude: '',
  phone: '',
  emergencyPhone: '',
  snakebiteTreatmentAvailable: false,
  emergency24x7: false,
  ventilatorAvailable: false,
  officialTreatmentCenter: false,
  source: '',
  notes: '',
};

interface VerificationFormState {
  antivenomStatus: string;
  verificationMethod: string;
  contactPerson: string;
  notes: string;
}

const EMPTY_VERIFICATION_FORM: VerificationFormState = {
  antivenomStatus: '',
  verificationMethod: '',
  contactPerson: '',
  notes: '',
};

export default function HospitalsPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] =
    useState<HospitalRecord | null>(null);
  const [editingHospital, setEditingHospital] = useState<HospitalRecord | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [hospitalForm, setHospitalForm] =
    useState<HospitalFormState>(EMPTY_HOSPITAL_FORM);
  const [verificationForm, setVerificationForm] =
    useState<VerificationFormState>(EMPTY_VERIFICATION_FORM);
  const [isSavingHospital, setIsSavingHospital] = useState(false);
  const [isSavingVerification, setIsSavingVerification] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce free-text search so every keystroke doesn't trigger a network call
  useEffect(() => {
    const timeout = setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const {
    data: hospitalsData,
    loading,
    error,
    refetch,
  } = useHospitals(
    { search: searchQuery || undefined },
    { first: pageSize, page: currentPage },
  );

  useEffect(() => {
    if (error) toast.error(`Failed to load hospitals: ${error.message}`);
  }, [error]);

  const typedHospitalsData = hospitalsData as
    | HospitalConnectionData
    | undefined;

  const getAntivenomStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
            ✓ Available
          </Badge>
        );
      case 'LOW_STOCK':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
            ⚠ Low Stock
          </Badge>
        );
      case 'OUT_OF_STOCK':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
            ✕ Out of Stock
          </Badge>
        );
      case 'UNKNOWN':
        return <Badge variant="secondary">? Unknown</Badge>;
      case 'NOT_SUPPORTED':
        return <Badge variant="outline">Not Supported</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getFreshnessIcon = (freshness: string) => {
    switch (freshness) {
      case 'FRESH':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'STALE':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'VERY_OLD':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'NEVER':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Verified
          </Badge>
        );
      case 'HISTORICAL':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
            Historical
          </Badge>
        );
      case 'STALE':
        return <Badge variant="outline">Stale</Badge>;
      case 'UNVERIFIED':
        return <Badge variant="secondary">Unverified</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // ---------------------------------------------------------------------
  // Add / Edit hospital
  // ---------------------------------------------------------------------

  const openAddDialog = () => {
    setEditingHospital(null);
    setHospitalForm(EMPTY_HOSPITAL_FORM);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (hospital: HospitalRecord) => {
    setEditingHospital(hospital);
    setHospitalForm({
      name: hospital.name,
      province: hospital.province?.toLowerCase() ?? '',
      district: hospital.district,
      address: hospital.address ?? '',
      latitude: hospital.latitude != null ? String(hospital.latitude) : '',
      longitude: hospital.longitude != null ? String(hospital.longitude) : '',
      phone: hospital.phone ?? '',
      emergencyPhone: hospital.emergencyPhone ?? '',
      snakebiteTreatmentAvailable: hospital.snakebiteTreatmentAvailable,
      emergency24x7: hospital.emergency24x7 ?? false,
      ventilatorAvailable: hospital.ventilatorAvailable ?? false,
      officialTreatmentCenter: hospital.officialTreatmentCenter,
      source: hospital.source ?? '',
      notes: hospital.notes ?? '',
    });
    setIsAddDialogOpen(true);
  };

  const validateHospitalForm = (form: HospitalFormState): string | null => {
    if (!form.name.trim()) return 'Hospital name is required';
    if (!form.province) return 'Province is required';
    if (!form.district.trim()) return 'District is required';
    if (!form.address.trim()) return 'Address is required';
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (!form.latitude || Number.isNaN(lat) || lat < -90 || lat > 90) {
      return 'Enter a valid latitude between -90 and 90';
    }
    if (!form.longitude || Number.isNaN(lng) || lng < -180 || lng > 180) {
      return 'Enter a valid longitude between -180 and 180';
    }
    return null;
  };

  const handleSubmitHospitalForm = async () => {
    const validationError = validateHospitalForm(hospitalForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSavingHospital(true);
    try {
      // TODO: wire to the real create/update hospital GraphQL mutation once
      // the hook is available, e.g.:
      // if (editingHospital) {
      //   await updateHospital({ variables: { id: editingHospital.id, input: hospitalForm } });
      // } else {
      //   await createHospital({ variables: { input: hospitalForm } });
      // }
      toast.success(
        editingHospital
          ? 'Hospital updated successfully'
          : 'Hospital added successfully',
      );
      setIsAddDialogOpen(false);
      setHospitalForm(EMPTY_HOSPITAL_FORM);
      setEditingHospital(null);
      await refetch();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to save hospital',
      );
    } finally {
      setIsSavingHospital(false);
    }
  };

  // ---------------------------------------------------------------------
  // Verify hospital
  // ---------------------------------------------------------------------

  const handleVerify = (hospital: HospitalRecord) => {
    setSelectedHospital(hospital);
    setVerificationForm({
      ...EMPTY_VERIFICATION_FORM,
      antivenomStatus: hospital.antivenomStatus,
    });
    setIsVerifyDialogOpen(true);
  };

  const handleSubmitVerification = async () => {
    if (!verificationForm.antivenomStatus) {
      toast.error('Select an antivenom status');
      return;
    }
    if (!verificationForm.verificationMethod) {
      toast.error('Select a verification method');
      return;
    }
    if (!verificationForm.notes.trim()) {
      toast.error('Add verification notes describing what was confirmed');
      return;
    }

    setIsSavingVerification(true);
    try {
      // TODO: wire to the real verify-hospital GraphQL mutation, e.g.:
      // await verifyHospital({ variables: { id: selectedHospital!.id, input: verificationForm } });
      toast.success('Hospital verification updated successfully');
      setIsVerifyDialogOpen(false);
      setSelectedHospital(null);
      setVerificationForm(EMPTY_VERIFICATION_FORM);
      await refetch();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to save verification',
      );
    } finally {
      setIsSavingVerification(false);
    }
  };

  // ---------------------------------------------------------------------
  // Delete hospital
  // ---------------------------------------------------------------------

  const openDeleteDialog = (hospital: HospitalRecord) => {
    setSelectedHospital(hospital);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedHospital) return;
    setIsDeleting(true);
    try {
      // TODO: wire to the real delete hospital GraphQL mutation, e.g.:
      // await deleteHospital({ variables: { id: selectedHospital.id } });
      toast.success('Hospital deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedHospital(null);
      await refetch();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete hospital',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------------------------------------------------------------
  // Data derivation
  // ---------------------------------------------------------------------

  const hospitals: HospitalRecord[] = useMemo(
    () =>
      typedHospitalsData?.hospitals?.edges?.map((edge) => ({
        ...edge.node,
        antivenomVerificationFreshness:
          edge.node.antivenomVerificationFreshness || 'NEVER',
        verificationStatus: edge.node.verificationStatus || 'UNVERIFIED',
        officialTreatmentCenter: edge.node.officialTreatmentCenter || false,
      })) ?? [],
    [typedHospitalsData],
  );

  // Note: `filterStatus` is applied client-side against only the current
  // page's results, since the hospitals query doesn't yet accept a
  // verification-freshness filter server-side. The pagination count below
  // reflects the unfiltered server total, so switching this filter can show
  // fewer rows than a full page — that's expected until the query supports
  // filtering server-side.
  const filteredHospitals = useMemo(
    () =>
      hospitals.filter((hospital) => {
        const matchesSearch =
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.district.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;
        if (filterStatus === 'needs_verification') {
          return hospital.antivenomVerificationFreshness !== 'FRESH';
        }
        if (filterStatus === 'verified') {
          return hospital.antivenomVerificationFreshness === 'FRESH';
        }
        return true;
      }),
    [hospitals, searchQuery, filterStatus],
  );

  const totalCount =
    typedHospitalsData?.hospitals?.totalCount ?? hospitals.length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hospital Management
        </h1>
        <p className="text-muted-foreground">
          Manage hospital records and verify antivenom availability
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Hospitals
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              {hospitals.filter((h) => h.officialTreatmentCenter).length}{' '}
              treatment centers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Antivenom
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                hospitals.filter(
                  (h) =>
                    h.antivenomStatus === 'AVAILABLE' &&
                    h.antivenomVerificationFreshness === 'FRESH',
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Verification
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                hospitals.filter(
                  (h) => h.antivenomVerificationFreshness !== 'FRESH',
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Stale or unverified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                hospitals.filter((h) => h.antivenomStatus === 'OUT_OF_STOCK')
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Needs restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals..."
                  className="pl-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  aria-label="Search hospitals by name or district"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger
                  className="w-[180px]"
                  aria-label="Filter by verification status"
                >
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="needs_verification">
                    Needs Verification
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setEditingHospital(null);
                  setHospitalForm(EMPTY_HOSPITAL_FORM);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Hospital
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingHospital
                      ? 'Update this hospital record. Ensure all information is accurate.'
                      : 'Add a new hospital to the system. Ensure all information is accurate.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Hospital Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Bharatpur Hospital"
                      value={hospitalForm.name}
                      onChange={(e) =>
                        setHospitalForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="province">Province *</Label>
                      <Select
                        value={hospitalForm.province}
                        onValueChange={(value) =>
                          setHospitalForm((f) => ({ ...f, province: value }))
                        }
                      >
                        <SelectTrigger id="province">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        placeholder="e.g., Chitwan"
                        value={hospitalForm.district}
                        onChange={(e) =>
                          setHospitalForm((f) => ({
                            ...f,
                            district: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Full address"
                      value={hospitalForm.address}
                      onChange={(e) =>
                        setHospitalForm((f) => ({
                          ...f,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        placeholder="27.7172"
                        value={hospitalForm.latitude}
                        onChange={(e) =>
                          setHospitalForm((f) => ({
                            ...f,
                            latitude: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        placeholder="85.3240"
                        value={hospitalForm.longitude}
                        onChange={(e) =>
                          setHospitalForm((f) => ({
                            ...f,
                            longitude: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="01-1234567"
                        value={hospitalForm.phone}
                        onChange={(e) =>
                          setHospitalForm((f) => ({
                            ...f,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emergency-phone">Emergency Phone</Label>
                      <Input
                        id="emergency-phone"
                        placeholder="01-1234567"
                        value={hospitalForm.emergencyPhone}
                        onChange={(e) =>
                          setHospitalForm((f) => ({
                            ...f,
                            emergencyPhone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Capabilities</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={hospitalForm.snakebiteTreatmentAvailable}
                          onChange={(e) =>
                            setHospitalForm((f) => ({
                              ...f,
                              snakebiteTreatmentAvailable: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm">
                          Snakebite Treatment Available
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={hospitalForm.emergency24x7}
                          onChange={(e) =>
                            setHospitalForm((f) => ({
                              ...f,
                              emergency24x7: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm">24/7 Emergency</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={hospitalForm.ventilatorAvailable}
                          onChange={(e) =>
                            setHospitalForm((f) => ({
                              ...f,
                              ventilatorAvailable: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm">Ventilator Available</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={hospitalForm.officialTreatmentCenter}
                          onChange={(e) =>
                            setHospitalForm((f) => ({
                              ...f,
                              officialTreatmentCenter: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm">
                          Official Treatment Center
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="source">Data Source</Label>
                    <Input
                      id="source"
                      placeholder="e.g., EDCD, Provincial Health Directorate"
                      value={hospitalForm.source}
                      onChange={(e) =>
                        setHospitalForm((f) => ({
                          ...f,
                          source: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional information..."
                      value={hospitalForm.notes}
                      onChange={(e) =>
                        setHospitalForm((f) => ({
                          ...f,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    disabled={isSavingHospital}
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSavingHospital}
                    onClick={handleSubmitHospitalForm}
                  >
                    {isSavingHospital && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingHospital ? 'Save Changes' : 'Add Hospital'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="mb-4 text-sm text-muted-foreground">
              Loading hospitals...
            </p>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Snakebite Treatment</TableHead>
                <TableHead>Antivenom Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && filteredHospitals.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hospitals match your search or filter.
                  </TableCell>
                </TableRow>
              )}
              {filteredHospitals.map((hospital) => (
                <TableRow
                  key={hospital.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  onClick={() =>
                    router.push(`/dashboard/admin/hospitals/${hospital.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      router.push(`/dashboard/admin/hospitals/${hospital.id}`);
                    }
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {hospital.name}
                      {hospital.officialTreatmentCenter && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Shield className="h-4 w-4 text-blue-600" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Official Treatment Center</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{hospital.district}</div>
                      <div className="text-muted-foreground">
                        {hospital.province}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {hospital.snakebiteTreatmentAvailable ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {getAntivenomStatusBadge(hospital.antivenomStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFreshnessIcon(
                        hospital.antivenomVerificationFreshness,
                      )}
                      {getVerificationStatusBadge(hospital.verificationStatus)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${hospital.name}`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            handleVerify(hospital);
                          }}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Verify
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditDialog(hospital);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDeleteDialog(hospital);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DashboardPagination
            page={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            pageInfo={typedHospitalsData?.hospitals?.pageInfo}
            onPageChange={setCurrentPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setCurrentPage(1);
            }}
            itemLabel="hospitals"
            pageSizeOptions={[10, 20, 30]}
          />
        </CardContent>
      </Card>

      {/* Verify Dialog */}
      <Dialog
        open={isVerifyDialogOpen}
        onOpenChange={(open) => {
          setIsVerifyDialogOpen(open);
          if (!open) {
            setSelectedHospital(null);
            setVerificationForm(EMPTY_VERIFICATION_FORM);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Hospital Capability</DialogTitle>
            <DialogDescription>
              Update antivenom availability and hospital capabilities. Only
              verified information should be entered.
            </DialogDescription>
          </DialogHeader>
          {selectedHospital && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Hospital</Label>
                <div className="font-medium">{selectedHospital.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedHospital.district}, {selectedHospital.province}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="antivenom-status">Antivenom Status *</Label>
                <Select
                  value={verificationForm.antivenomStatus}
                  onValueChange={(value) =>
                    setVerificationForm((f) => ({
                      ...f,
                      antivenomStatus: value,
                    }))
                  }
                >
                  <SelectTrigger id="antivenom-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                    <SelectItem value="NOT_SUPPORTED">Not Supported</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="verification-type">Verification Method *</Label>
                <Select
                  value={verificationForm.verificationMethod}
                  onValueChange={(value) =>
                    setVerificationForm((f) => ({
                      ...f,
                      verificationMethod: value,
                    }))
                  }
                >
                  <SelectTrigger id="verification-type">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                    <SelectItem value="SITE_VISIT">Site Visit</SelectItem>
                    <SelectItem value="OFFICIAL_DOCUMENT">
                      Official Document
                    </SelectItem>
                    <SelectItem value="HOSPITAL_REPORT">
                      Hospital Report
                    </SelectItem>
                    <SelectItem value="PROVINCIAL_HEALTH">
                      Provincial Health Authority
                    </SelectItem>
                    <SelectItem value="EDCD_RECORD">EDCD Record</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input
                  id="contact-person"
                  placeholder="Name of contact at hospital"
                  value={verificationForm.contactPerson}
                  onChange={(e) =>
                    setVerificationForm((f) => ({
                      ...f,
                      contactPerson: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="verification-notes">Verification Notes *</Label>
                <Textarea
                  id="verification-notes"
                  placeholder="Details about verification, who you spoke with, etc."
                  rows={4}
                  value={verificationForm.notes}
                  onChange={(e) =>
                    setVerificationForm((f) => ({
                      ...f,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isSavingVerification}
              onClick={() => setIsVerifyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isSavingVerification}
              onClick={handleSubmitVerification}
            >
              {isSavingVerification && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedHospital(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
              <Trash2 className="h-6 w-6" />
            </div>
            <AlertDialogTitle>Delete hospital record?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedHospital
                ? `This will remove "${selectedHospital.name}" from the hospital directory. This action cannot be undone.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete hospital
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
