/**
 * Hospital List Component
 * Displays list of hospitals with sorting and filtering
 */

'use client';

import { useState, useMemo } from 'react';
import { HospitalInfoCard } from './HospitalInfoCard';
import type { HospitalLocation } from './HospitalMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, MapPin, ArrowUpDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HospitalListProps {
  hospitals: HospitalLocation[];
  onHospitalSelect?: (hospital: HospitalLocation) => void;
  onCallClick?: (hospital: HospitalLocation) => void;
  onDirectionsClick?: (hospital: HospitalLocation) => void;
  onRouteClick?: (hospital: HospitalLocation) => void;
  maxHeight?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  defaultSortBy?: 'distance' | 'name' | 'antivenom';
}

type SortOption = 'distance' | 'name' | 'antivenom';
type FilterOption = 'all' | 'snakebite' | 'antivenom' | 'emergency';

export function HospitalList({
  hospitals,
  onHospitalSelect,
  onCallClick,
  onDirectionsClick,
  onRouteClick,
  maxHeight = '600px',
  showSearch = true,
  showFilters = true,
  defaultSortBy = 'distance',
}: HospitalListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(defaultSortBy);
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter hospitals
  const filteredHospitals = useMemo(() => {
    let filtered = [...hospitals];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.address.toLowerCase().includes(query) ||
          h.district?.toLowerCase().includes(query) ||
          h.municipality?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'snakebite':
        filtered = filtered.filter((h) => h.snakebiteTreatmentAvailable);
        break;
      case 'antivenom':
        filtered = filtered.filter(
          (h) =>
            h.antivenomStatus === 'AVAILABLE' &&
            h.antivenomVerificationFreshness === 'FRESH'
        );
        break;
      case 'emergency':
        filtered = filtered.filter((h) => h.emergency24x7);
        break;
    }

    return filtered;
  }, [hospitals, searchQuery, filterBy]);

  // Sort hospitals
  const sortedHospitals = useMemo(() => {
    const sorted = [...filteredHospitals];

    switch (sortBy) {
      case 'distance':
        sorted.sort((a, b) => {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'antivenom':
        sorted.sort((a, b) => {
          const priority = {
            AVAILABLE: 0,
            LOW_STOCK: 1,
            UNKNOWN: 2,
            OUT_OF_STOCK: 3,
            NOT_SUPPORTED: 4,
          };
          const aPriority = priority[a.antivenomStatus] ?? 5;
          const bPriority = priority[b.antivenomStatus] ?? 5;
          return aPriority - bPriority;
        });
        break;
    }

    return sorted;
  }, [filteredHospitals, sortBy]);

  // Count hospitals by category
  const counts = useMemo(() => {
    return {
      total: hospitals.length,
      snakebite: hospitals.filter((h) => h.snakebiteTreatmentAvailable).length,
      antivenom: hospitals.filter(
        (h) =>
          h.antivenomStatus === 'AVAILABLE' &&
          h.antivenomVerificationFreshness === 'FRESH'
      ).length,
      emergency: hospitals.filter((h) => h.emergency24x7).length,
    };
  }, [hospitals]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Nearby Hospitals ({sortedHospitals.length})
          </h3>
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Filter & Sort Controls */}
        {showFilterMenu && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Filter by</label>
              <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals ({counts.total})</SelectItem>
                  <SelectItem value="snakebite">🐍 Snakebite Treatment ({counts.snakebite})</SelectItem>
                  <SelectItem value="antivenom">💉 Antivenom Available ({counts.antivenom})</SelectItem>
                  <SelectItem value="emergency">🚑 24/7 Emergency ({counts.emergency})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sort by</label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Distance
                    </div>
                  </SelectItem>
                  <SelectItem value="name">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3 w-3" />
                      Name
                    </div>
                  </SelectItem>
                  <SelectItem value="antivenom">💉 Antivenom Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(filterBy !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1.5 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterBy !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Filter: {filterBy}
                <button
                  onClick={() => setFilterBy('all')}
                  className="ml-1.5 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Hospital List */}
      <ScrollArea style={{ maxHeight }}>
        <div className="p-4 space-y-3">
          {sortedHospitals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No hospitals found</p>
              <p className="text-xs mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            sortedHospitals.map((hospital) => (
              <div
                key={hospital.id}
                onClick={() => onHospitalSelect?.(hospital)}
                className="cursor-pointer"
              >
                <HospitalInfoCard
                  hospital={hospital}
                  showDistance={hospital.distance !== undefined}
                  showRoute={!!onRouteClick}
                  onCallClick={() => onCallClick?.(hospital)}
                  onDirectionsClick={() => onDirectionsClick?.(hospital)}
                  onRouteClick={() => onRouteClick?.(hospital)}
                  compact={false}
                />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
