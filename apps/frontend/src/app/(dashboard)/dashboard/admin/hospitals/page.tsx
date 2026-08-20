/**
 * Hospital Management Page (Admin)
 * 
 * Manage hospitals, verify antivenom availability, and view verification status
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  // TODO: Replace with actual GraphQL query
  const mockHospitals = [
    {
      id: '1',
      name: 'Bharatpur Hospital',
      district: 'Chitwan',
      province: 'Bagmati',
      snakebiteTreatmentAvailable: true,
      antivenomStatus: 'AVAILABLE',
      antivenomVerificationFreshness: 'FRESH',
      antivenomLastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'VERIFIED',
      officialTreatmentCenter: true,
      phone: '056-123456',
    },
    {
      id: '2',
      name: 'Bir Hospital',
      district: 'Kathmandu',
      province: 'Bagmati',
      snakebiteTreatmentAvailable: true,
      antivenomStatus: 'UNKNOWN',
      antivenomVerificationFreshness: 'STALE',
      antivenomLastVerifiedAt: '2024-01-15T10:00:00Z',
      verificationStatus: 'HISTORICAL',
      officialTreatmentCenter: true,
      phone: '01-4221119',
    },
    {
      id: '3',
      name: 'Patan Hospital',
      district: 'Lalitpur',
      province: 'Bagmati',
      snakebiteTreatmentAvailable: true,
      antivenomStatus: 'LOW_STOCK',
      antivenomVerificationFreshness: 'FRESH',
      antivenomLastVerifiedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      verificationStatus: 'VERIFIED',
      officialTreatmentCenter: true,
      phone: '01-5522295',
    },
  ];

  const getAntivenomStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-100 text-green-800">✓ Available</Badge>;
      case 'LOW_STOCK':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠ Low Stock</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge className="bg-red-100 text-red-800">✕ Out of Stock</Badge>;
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
        return <Badge className="bg-blue-100 text-blue-800">Verified</Badge>;
      case 'HISTORICAL':
        return <Badge className="bg-yellow-100 text-yellow-800">Historical</Badge>;
      case 'STALE':
        return <Badge variant="outline">Stale</Badge>;
      case 'UNVERIFIED':
        return <Badge variant="secondary">Unverified</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleVerify = (hospital: any) => {
    setSelectedHospital(hospital);
    setIsVerifyDialogOpen(true);
  };

  const handleSubmitVerification = () => {
    // TODO: Implement GraphQL mutation
    toast.success('Hospital verification updated successfully');
    setIsVerifyDialogOpen(false);
  };

  const handleAddHospital = () => {
    // TODO: Implement GraphQL mutation
    toast.success('Hospital added successfully');
    setIsAddDialogOpen(false);
  };

  const filteredHospitals = mockHospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'needs_verification') {
      return matchesSearch && hospital.antivenomVerificationFreshness !== 'FRESH';
    }
    if (filterStatus === 'verified') {
      return matchesSearch && hospital.antivenomVerificationFreshness === 'FRESH';
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hospital Management</h1>
        <p className="text-muted-foreground">
          Manage hospital records and verify antivenom availability
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHospitals.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockHospitals.filter(h => h.officialTreatmentCenter).length} treatment centers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Antivenom</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockHospitals.filter(h => 
                h.antivenomStatus === 'AVAILABLE' && h.antivenomVerificationFreshness === 'FRESH'
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Verification</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockHospitals.filter(h => h.antivenomVerificationFreshness !== 'FRESH').length}
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
              {mockHospitals.filter(h => h.antivenomStatus === 'OUT_OF_STOCK').length}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="needs_verification">Needs Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Hospital
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Hospital</DialogTitle>
                  <DialogDescription>
                    Add a new hospital to the system. Ensure all information is accurate.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Hospital Name *</Label>
                    <Input id="name" placeholder="e.g., Bharatpur Hospital" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="province">Province *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="koshi">Koshi</SelectItem>
                          <SelectItem value="madhesh">Madhesh</SelectItem>
                          <SelectItem value="bagmati">Bagmati</SelectItem>
                          <SelectItem value="gandaki">Gandaki</SelectItem>
                          <SelectItem value="lumbini">Lumbini</SelectItem>
                          <SelectItem value="karnali">Karnali</SelectItem>
                          <SelectItem value="sudurpaschim">Sudurpaschim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="district">District *</Label>
                      <Input id="district" placeholder="e.g., Chitwan" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" placeholder="Full address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input id="latitude" type="number" step="0.000001" placeholder="27.7172" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input id="longitude" type="number" step="0.000001" placeholder="85.3240" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="01-1234567" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emergency-phone">Emergency Phone</Label>
                      <Input id="emergency-phone" placeholder="01-1234567" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Capabilities</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Snakebite Treatment Available</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">24/7 Emergency</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Ventilator Available</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Official Treatment Center</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="source">Data Source</Label>
                    <Input id="source" placeholder="e.g., EDCD, Provincial Health Directorate" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Additional information..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHospital}>Add Hospital</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredHospitals.map((hospital) => (
                <TableRow key={hospital.id}>
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
                      <div className="text-muted-foreground">{hospital.province}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {hospital.snakebiteTreatmentAvailable ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getAntivenomStatusBadge(hospital.antivenomStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFreshnessIcon(hospital.antivenomVerificationFreshness)}
                      {getVerificationStatusBadge(hospital.verificationStatus)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerify(hospital)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verify Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Hospital Capability</DialogTitle>
            <DialogDescription>
              Update antivenom availability and hospital capabilities. Only verified information should be entered.
            </DialogDescription>
          </DialogHeader>
          {selectedHospital && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Hospital</Label>
                <div className="font-medium">{selectedHospital.name}</div>
                <div className="text-sm text-muted-foreground">{selectedHospital.district}, {selectedHospital.province}</div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="antivenom-status">Antivenom Status *</Label>
                <Select defaultValue={selectedHospital.antivenomStatus}>
                  <SelectTrigger>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                    <SelectItem value="SITE_VISIT">Site Visit</SelectItem>
                    <SelectItem value="OFFICIAL_DOCUMENT">Official Document</SelectItem>
                    <SelectItem value="HOSPITAL_REPORT">Hospital Report</SelectItem>
                    <SelectItem value="PROVINCIAL_HEALTH">Provincial Health Authority</SelectItem>
                    <SelectItem value="EDCD_RECORD">EDCD Record</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input id="contact-person" placeholder="Name of contact at hospital" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Verification Notes *</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Details about verification, who you spoke with, etc."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitVerification}>Submit Verification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
