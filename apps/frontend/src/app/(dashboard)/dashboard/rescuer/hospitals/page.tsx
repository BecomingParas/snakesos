'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Building2,
  Grid2X2,
  Loader2,
  List,
  MapPin,
  Phone,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HospitalMapWithData } from '@/components/map/HospitalMapWithData';
import { useHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface HospitalRecord {
  id: string;
  name: string;
  address?: string | null;
  municipality?: string | null;
  district?: string | null;
  province?: string | null;
  phone?: string | null;
  emergencyPhone?: string | null;
  snakebiteTreatmentAvailable?: boolean;
  antivenomStatus?: string | null;
  emergency24x7?: boolean;
}

interface HospitalsData {
  hospitals?: {
    edges: Array<{ node: HospitalRecord }>;
    totalCount: number;
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
  };
}

function antivenomClass(status?: string | null) {
  if (status === 'AVAILABLE') return 'bg-success/15 text-success';
  if (status === 'LOW_STOCK') return 'bg-warning/15 text-warning';
  if (status === 'OUT_OF_STOCK') return 'bg-destructive/15 text-destructive';
  return 'bg-muted text-muted-foreground';
}

export default function RescuerHospitalsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  const { data, loading, error } = useHospitals(
    { search: search.trim() || undefined },
    { first: pageSize, page: currentPage },
  );
  const hospitals = useMemo(
    () =>
      (data as HospitalsData | undefined)?.hospitals?.edges.map(
        (edge) => edge.node,
      ) || [],
    [data],
  );
  const hospitalConnection = (data as HospitalsData | undefined)?.hospitals;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Rescue operations
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Nearby hospitals
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find snakebite treatment centers and confirm emergency resources while
          responding.
        </p>
      </header>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold">Hospitals near your location</h2>
              <p className="text-sm text-muted-foreground">
                Use your current location to see the closest treatment
                facilities.
              </p>
            </div>
          </div>
        </div>
        <div className="h-105 w-full sm:h-130">
          <HospitalMapWithData
            useUserLocation
            radiusKm={50}
            snakebiteTreatmentOnly
            zoom={11}
          />
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Hospital directory</h2>
            <p className="text-sm text-muted-foreground">
              Read-only operational information from the admin hospital
              registry.
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search hospitals"
              className="pl-9"
            />
          </div>
          <div className="flex shrink-0 items-center rounded-md border border-border p-1">
            <Button
              type="button"
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              aria-label="Grid view"
              title="Grid view"
              onClick={() => setView('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              aria-label="List view"
              title="List view"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading && (
          <Card className="flex items-center justify-center p-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </Card>
        )}
        {error && (
          <Card className="flex items-center gap-3 p-5 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Unable to load hospitals: {error.message}
          </Card>
        )}
        {!loading && !error && hospitals.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            No hospitals found.
          </Card>
        )}
        {view === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {!loading &&
              hospitals.map((hospital) => (
                <Card
                  key={hospital.id}
                  className="cursor-pointer p-5 transition-colors hover:border-primary"
                  onClick={() =>
                    router.push(`/dashboard/rescuer/hospitals/${hospital.id}`)
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <Building2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <h3 className="font-semibold">{hospital.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {hospital.address ||
                            hospital.municipality ||
                            hospital.district ||
                            'Location not recorded'}
                        </p>
                      </div>
                    </div>
                    {hospital.snakebiteTreatmentAvailable && (
                      <Badge className="shrink-0 bg-success/15 text-success">
                        Snakebite care
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge className={antivenomClass(hospital.antivenomStatus)}>
                      Antivenom: {hospital.antivenomStatus || 'UNKNOWN'}
                    </Badge>
                    {hospital.emergency24x7 && (
                      <Badge variant="outline">24/7 emergency</Badge>
                    )}
                  </div>
                  {(hospital.emergencyPhone || hospital.phone) && (
                    <a
                      href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Phone className="h-4 w-4" />
                      {hospital.emergencyPhone || hospital.phone}
                    </a>
                  )}
                </Card>
              ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Antivenom</TableHead>
                <TableHead>Emergency</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading &&
                hospitals.map((hospital) => (
                  <TableRow
                    key={hospital.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/rescuer/hospitals/${hospital.id}`)
                    }
                  >
                    <TableCell className="min-w-52 font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 shrink-0 text-primary" />
                        {hospital.name}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-56 text-muted-foreground">
                      {hospital.address ||
                        hospital.municipality ||
                        hospital.district ||
                        'Location not recorded'}
                    </TableCell>
                    <TableCell>
                      {hospital.snakebiteTreatmentAvailable ? (
                        <Badge className="bg-success/15 text-success">
                          Snakebite care
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          General care
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={antivenomClass(hospital.antivenomStatus)}
                      >
                        {hospital.antivenomStatus || 'UNKNOWN'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {hospital.emergency24x7 ? (
                        <Badge variant="outline">24/7</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Standard
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {hospital.emergencyPhone || hospital.phone ? (
                        <a
                          href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Phone className="h-4 w-4" />
                          {hospital.emergencyPhone || hospital.phone}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Not recorded
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        <DashboardPagination
          page={currentPage}
          pageSize={pageSize}
          totalCount={hospitalConnection?.totalCount || 0}
          pageInfo={hospitalConnection?.pageInfo}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
          itemLabel="hospitals"
          alwaysShow
        />
      </section>
    </div>
  );
}
