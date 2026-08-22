/**
 * Map Controls Component
 * Legend, layer toggles, and map controls for emergency map
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapIcon,
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MapControlsProps {
  showIncident?: boolean;
  showRescuers?: boolean;
  showHospitals?: boolean;
  showRoute?: boolean;
  onToggleIncident?: (show: boolean) => void;
  onToggleRescuers?: (show: boolean) => void;
  onToggleHospitals?: (show: boolean) => void;
  onToggleRoute?: (show: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitBounds?: () => void;
  className?: string;
  compact?: boolean;
}

export function MapControls({
  showIncident = true,
  showRescuers = true,
  showHospitals = true,
  showRoute = true,
  onToggleIncident,
  onToggleRescuers,
  onToggleHospitals,
  onToggleRoute,
  onZoomIn,
  onZoomOut,
  onFitBounds,
  className = '',
  compact = false,
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  if (compact && !isExpanded) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="w-full"
        >
          <Layers className="h-4 w-4 mr-2" />
          Map Layers
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            Map Controls
          </CardTitle>
          {compact && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground">Map Legend</h4>
          <div className="space-y-2">
            {/* Incident Markers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-sm border-2 border-white shadow">
                    🐍
                  </div>
                  <span className="text-xs font-medium">Snake Incident</span>
                </div>
                {onToggleIncident && (
                  <Switch
                    checked={showIncident}
                    onCheckedChange={onToggleIncident}
                    className="scale-75"
                  />
                )}
              </div>
              <div className="pl-8 space-y-0.5">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
                  <span>Critical Priority</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-orange-600 border border-white"></div>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-yellow-600 border border-white"></div>
                  <span>Medium Priority</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Rescuer Markers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-sm border-2 border-white shadow">
                    🧑‍🚒
                  </div>
                  <span className="text-xs font-medium">Rescuers</span>
                </div>
                {onToggleRescuers && (
                  <Switch
                    checked={showRescuers}
                    onCheckedChange={onToggleRescuers}
                    className="scale-75"
                  />
                )}
              </div>
              <div className="pl-8 space-y-0.5">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-green-600 border border-white"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-blue-600 border border-white"></div>
                  <span>En Route</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-yellow-600 border border-white"></div>
                  <span>On Site</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Hospital Markers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-sm border-2 border-white shadow">
                    🏥
                  </div>
                  <span className="text-xs font-medium">Hospitals</span>
                </div>
                {onToggleHospitals && (
                  <Switch
                    checked={showHospitals}
                    onCheckedChange={onToggleHospitals}
                    className="scale-75"
                  />
                )}
              </div>
              <div className="pl-8 space-y-0.5">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-green-600 border border-white"></div>
                  <span>Verified Antivenom</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-yellow-600 border border-white"></div>
                  <span>Treatment Available (Unverified)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
                  <span>Out of Stock</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-gray-500 border border-white"></div>
                  <span>General Hospital</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Route */}
            {onToggleRoute && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-blue-600 rounded"></div>
                  <span className="text-xs font-medium">Route</span>
                </div>
                <Switch
                  checked={showRoute}
                  onCheckedChange={onToggleRoute}
                  className="scale-75"
                />
              </div>
            )}
          </div>
        </div>

        {/* Zoom Controls */}
        {(onZoomIn || onZoomOut || onFitBounds) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground">View Controls</h4>
              <div className="grid grid-cols-3 gap-2">
                {onZoomIn && (
                  <Button variant="outline" size="sm" onClick={onZoomIn} className="text-xs">
                    <Maximize2 className="h-3 w-3 mr-1" />
                    Zoom In
                  </Button>
                )}
                {onZoomOut && (
                  <Button variant="outline" size="sm" onClick={onZoomOut} className="text-xs">
                    <Minimize2 className="h-3 w-3 mr-1" />
                    Zoom Out
                  </Button>
                )}
                {onFitBounds && (
                  <Button variant="outline" size="sm" onClick={onFitBounds} className="text-xs">
                    <Layers className="h-3 w-3 mr-1" />
                    Fit All
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Info */}
        <div className="pt-2 border-t">
          <p className="text-[10px] text-muted-foreground text-center">
            Click markers for detailed information
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Minimal floating legend for compact view
 */
export function FloatingLegend({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="shadow-lg"
      >
        <Layers className="h-4 w-4 mr-2" />
        Legend
        {isOpen ? <EyeOff className="h-3 w-3 ml-2" /> : <Eye className="h-3 w-3 ml-2" />}
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 w-64 shadow-xl z-10">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-xs">
                🐍
              </div>
              <span className="text-xs">Snake Incident</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-xs">
                🧑‍🚒
              </div>
              <span className="text-xs">Rescuer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-xs">
                🏥
              </div>
              <span className="text-xs">Hospital (Verified Antivenom)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-600 flex items-center justify-center text-xs">
                🏥
              </div>
              <span className="text-xs">Hospital (Unverified)</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
