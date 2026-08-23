import 'dotenv/config';
import { prisma } from '../libs/database/src/client.js';
import {
  RescuePriority,
  RescueStatus,
  UserRole,
  UserStatus,
  VolunteerStatus,
} from '../libs/database/src/prisma/generated/client.js';

const DEMO_REQUEST_REFERENCE = 'DEMO-BUTWAL-001';

async function main() {
  const rescuers = [
    {
      email: 'demo.rescuer1@snakerescue.com',
      name: 'Demo Rescuer One',
      phone: '+9779800000001',
      lat: 27.7005,
      lng: 83.4484,
    },
    {
      email: 'demo.rescuer2@snakerescue.com',
      name: 'Demo Rescuer Two',
      phone: '+9779800000002',
      lat: 27.705,
      lng: 83.452,
    },
  ];

  const volunteerIds: string[] = [];

  for (const rescuer of rescuers) {
    const user = await prisma.user.upsert({
      where: { email: rescuer.email },
      update: {
        name: rescuer.name,
        phone: rescuer.phone,
        role: UserRole.VERIFIED_RESCUER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      create: {
        email: rescuer.email,
        name: rescuer.name,
        phone: rescuer.phone,
        role: UserRole.VERIFIED_RESCUER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });

    const volunteer = await prisma.volunteer.upsert({
      where: { userId: user.id },
      update: {
        name: rescuer.name,
        contact: rescuer.phone,
        email: rescuer.email,
        municipality: 'Butwal Sub-Metropolitan',
        ward: 8,
        isAvailableNow: true,
        emergencyAvailability: true,
        status: VolunteerStatus.VERIFIED,
        currentLat: rescuer.lat,
        currentLng: rescuer.lng,
        lastKnownLatitude: rescuer.lat,
        lastKnownLongitude: rescuer.lng,
        lastLocationUpdate: new Date(),
        lastLocationUpdateFromTracking: new Date(),
      },
      create: {
        userId: user.id,
        name: rescuer.name,
        contact: rescuer.phone,
        email: rescuer.email,
        address: 'Butwal',
        municipality: 'Butwal Sub-Metropolitan',
        ward: 8,
        experience: 'INTERMEDIATE',
        experienceYears: 3,
        vehicle: 'BIKE',
        skills: ['Snake handling', 'First aid'],
        certifications: ['Demo verification'],
        availableTime: 'ANYTIME',
        availableDays: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        isAvailableNow: true,
        emergencyAvailability: true,
        status: VolunteerStatus.VERIFIED,
        verifiedAt: new Date(),
        currentLat: rescuer.lat,
        currentLng: rescuer.lng,
        lastKnownLatitude: rescuer.lat,
        lastKnownLongitude: rescuer.lng,
        lastLocationUpdate: new Date(),
        lastLocationUpdateFromTracking: new Date(),
      },
    });

    volunteerIds.push(volunteer.id);
  }

  const citizen = await prisma.user.upsert({
    where: { email: 'demo.citizen@snakerescue.com' },
    update: {
      name: 'Demo Citizen',
      phone: '+9779800000010',
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'demo.citizen@snakerescue.com',
      name: 'Demo Citizen',
      phone: '+9779800000010',
      role: UserRole.CITIZEN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  const request = await prisma.rescueRequest.upsert({
    where: { referenceNumber: DEMO_REQUEST_REFERENCE },
    update: {
      userId: citizen.id,
      name: citizen.name,
      phone: citizen.phone || '+9779800000010',
      email: citizen.email,
      municipality: 'Butwal Sub-Metropolitan',
      ward: 8,
      address: 'Demo rescue location, Butwal Ward 8',
      landmark: 'Near Demo Community Park',
      lat: 27.7001,
      lng: 83.45,
      snakeDescription: 'Demo cobra reported near a residential area',
      status: RescueStatus.PENDING,
      priority: RescuePriority.HIGH,
      stillPresent: true,
      assignedTo: null,
      assignedAt: null,
      assignedBy: null,
      acceptedAt: null,
      startedAt: null,
      arrivedAt: null,
      completedAt: null,
    },
    create: {
      userId: citizen.id,
      name: citizen.name,
      phone: citizen.phone || '+9779800000010',
      email: citizen.email,
      municipality: 'Butwal Sub-Metropolitan',
      ward: 8,
      address: 'Demo rescue location, Butwal Ward 8',
      landmark: 'Near Demo Community Park',
      lat: 27.7001,
      lng: 83.45,
      snakeDescription: 'Demo cobra reported near a residential area',
      snakeSize: 'Medium',
      snakeColor: 'Brown',
      snakeImages: [],
      rescueImages: [],
      status: RescueStatus.PENDING,
      priority: RescuePriority.HIGH,
      stillPresent: true,
      isEmergency: false,
      hasBite: false,
      referenceNumber: DEMO_REQUEST_REFERENCE,
      source: 'WEB',
    },
  });

  console.log(`Demo request ready: ${request.referenceNumber} (${request.id})`);
  console.log(`Available verified rescuers ready: ${volunteerIds.length}`);
  console.log(
    'Open Admin > All Rescues, click Assign, then choose a demo rescuer.',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
