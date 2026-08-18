/**
 * Citizen Hospital Finder Page
 * Find nearby hospitals with antivenom availability
 */

'use client';

import { HospitalMapWithData } from '@/components/map/HospitalMapWithData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, AlertTriangle, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CitizenHospitalsPage() {
  const handleHospitalClick = (hospitalId: string) => {
    console.log('Hospital clicked:', hospitalId);
    // TODO: Open hospital details modal or navigate to details page
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Find Nearby Hospitals</h1>
        <p className="text-sm md:text-base text-slate-600 mt-2">
          Locate hospitals with snakebite treatment and antivenom availability across Nepal
        </p>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-900">
          <strong className="block mb-1">🚨 For Snake Bite Emergencies</strong>
          <p className="text-sm text-red-700">
            If you've been bitten by a snake, seek medical attention immediately. 
            Call emergency services or go to the nearest hospital.
            <strong className="block mt-2">Emergency Hotline: 102</strong>
          </p>
        </AlertDescription>
      </Alert>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-green-600"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Green Marker</p>
                <p className="text-xs text-slate-600">Antivenom Available (Verified)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-yellow-600"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Yellow Marker</p>
                <p className="text-xs text-slate-600">Treatment Center (Status Unknown)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Phone className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Emergency</p>
                <p className="text-xs text-slate-600">Click markers to call hospital</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospital Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[500px] md:h-[600px] w-full">
            <HospitalMapWithData
              useUserLocation={true}
              radiusKm={50}
              snakebiteTreatmentOnly={true}
              zoom={12}
              onHospitalClick={handleHospitalClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Understanding the Map</CardTitle>
          <CardDescription>
            Color-coded markers help you identify hospital capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-600 border-2 border-white shadow flex-shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Green - Available</p>
                <p className="text-xs text-slate-600">
                  Verified antivenom available within last 24 hours. Safe to visit for snakebite treatment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-yellow-600 border-2 border-white shadow flex-shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Yellow - Unknown</p>
                <p className="text-xs text-slate-600">
                  Snakebite treatment center, but antivenom status not recently verified. Call ahead to confirm.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow flex-shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Red - Out of Stock</p>
                <p className="text-xs text-slate-600">
                  Verified out of stock. Seek alternative hospitals or call for updates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-500 border-2 border-white shadow flex-shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Gray - General</p>
                <p className="text-xs text-slate-600">
                  General hospital without confirmed snakebite treatment capability.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Distance:</strong> Distances and travel times are estimates. 
              Actual travel time may vary based on traffic and road conditions.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Always Call Ahead:</strong> Even for green markers, call the hospital 
              before traveling to confirm antivenom availability and emergency readiness.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Navigation className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Get Directions:</strong> Click any hospital marker to see details 
              and get directions via Google Maps.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Medical Emergency:</strong> In case of snakebite, prioritize reaching 
              ANY medical facility quickly over waiting for verified antivenom status.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => window.location.href = 'tel:102'}
        >
          <Phone className="h-5 w-5 mr-2" />
          Call Emergency (102)
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => window.location.href = '/dashboard/citizen/requests/create'}
        >
          <MapPin className="h-5 w-5 mr-2" />
          Request Snake Rescue
        </Button>
      </div>
    </div>
  );
}
