import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@snake-rescue/database';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/nearest-emergency
 * Find nearest hospital and rescuer based on location
 * Query params: lat, lng
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Please provide lat and lng.' },
        { status: 400 }
      );
    }

    // Find nearest hospital with antivenom (using simple distance calculation)
    // In production, you'd use PostGIS or more sophisticated geospatial queries
    const hospitals = await prisma.hospital.findMany({
      where: {
        status: 'ACTIVE',
        snakebiteTreatmentAvailable: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        emergencyPhone: true,
        latitude: true,
        longitude: true,
        antivenomStatus: true,
        snakebiteTreatmentAvailable: true,
      },
    });

    // Calculate distances and find nearest
    const hospitalsWithDistance = hospitals.map((hospital) => {
      const distance = calculateDistance(
        lat,
        lng,
        hospital.latitude,
        hospital.longitude
      );
      return {
        ...hospital,
        distance,
      };
    });

    const nearestHospital =
      hospitalsWithDistance.length > 0
        ? hospitalsWithDistance.sort((a, b) => a.distance - b.distance)[0]
        : null;

    // Find nearest available rescuer
    const rescuers = await prisma.volunteer.findMany({
      where: {
        status: 'VERIFIED',
        isAvailableNow: true,
        currentLat: { not: null },
        currentLng: { not: null },
      },
      select: {
        id: true,
        name: true,
        contact: true,
        experience: true,
        currentLat: true,
        currentLng: true,
        rating: true,
        totalRescues: true,
      },
    });

    const rescuersWithDistance = rescuers
      .filter((r) => r.currentLat && r.currentLng)
      .map((rescuer) => {
        const distance = calculateDistance(
          lat,
          lng,
          rescuer.currentLat!,
          rescuer.currentLng!
        );
        return {
          ...rescuer,
          distance,
        };
      });

    const nearestRescuer =
      rescuersWithDistance.length > 0
        ? rescuersWithDistance.sort((a, b) => a.distance - b.distance)[0]
        : null;

    return NextResponse.json({
      success: true,
      data: {
        nearestHospital: nearestHospital
          ? {
              name: nearestHospital.name,
              address: nearestHospital.address,
              phone: nearestHospital.phone,
              emergencyPhone: nearestHospital.emergencyPhone,
              distance: nearestHospital.distance,
              antivenomStatus: nearestHospital.antivenomStatus,
              snakebiteTreatmentAvailable:
                nearestHospital.snakebiteTreatmentAvailable,
            }
          : null,
        nearestRescuer: nearestRescuer
          ? {
              name: nearestRescuer.name,
              contact: nearestRescuer.contact,
              experience: nearestRescuer.experience,
              distance: nearestRescuer.distance,
              rating: nearestRescuer.rating,
              totalRescues: nearestRescuer.totalRescues,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching nearest emergency:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch nearest emergency contacts',
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
