/**
 * Seed script to add sample hospital and rescuer data
 * Run with: npx tsx scripts/seed-emergency-data.ts
 */

import { prisma } from '@snake-rescue/database';

async function seedEmergencyData() {
  console.log('🌱 Seeding emergency data (hospitals & rescuers)...\n');

  // Seed Hospitals in Nepal (Rupandehi area)
  const hospitals = [
    {
      name: 'Universal College of Medical Sciences (UCMS)',
      address: 'Bhairahawa, Rupandehi',
      municipality: 'Siddharthanagar',
      ward: 5,
      district: 'Rupandehi',
      province: 'Lumbini',
      latitude: 27.5089,
      longitude: 83.4610,
      phone: '071-525252',
      emergencyPhone: '071-527266',
      snakebiteTreatmentAvailable: true,
      treatmentCenterType: 'SPECIALIZED',
      antivenomStatus: 'AVAILABLE',
      emergencyAvailable: true,
      emergency24x7: true,
      icuAvailable: true,
      ventilatorAvailable: true,
      ambulanceAvailable: true,
      hospitalType: 'PRIVATE',
      edcdCertified: true,
      status: 'ACTIVE',
    },
    {
      name: 'Lumbini Provincial Hospital',
      address: 'Butwal, Rupandehi',
      municipality: 'Butwal',
      ward: 11,
      district: 'Rupandehi',
      province: 'Lumbini',
      latitude: 27.7000,
      longitude: 83.4667,
      phone: '071-540112',
      emergencyPhone: '071-540199',
      snakebiteTreatmentAvailable: true,
      treatmentCenterType: 'DISTRICT',
      antivenomStatus: 'AVAILABLE',
      emergencyAvailable: true,
      emergency24x7: true,
      icuAvailable: true,
      ventilatorAvailable: true,
      hospitalType: 'GOVERNMENT',
      edcdCertified: true,
      status: 'ACTIVE',
    },
    {
      name: 'Devdaha Medical College & Research Institute',
      address: 'Devdaha, Rupandehi',
      municipality: 'Devdaha',
      ward: 1,
      district: 'Rupandehi',
      province: 'Lumbini',
      latitude: 27.5656,
      longitude: 83.4328,
      phone: '071-589100',
      emergencyPhone: '071-589111',
      snakebiteTreatmentAvailable: true,
      treatmentCenterType: 'SPECIALIZED',
      antivenomStatus: 'AVAILABLE',
      emergencyAvailable: true,
      emergency24x7: true,
      icuAvailable: true,
      ventilatorAvailable: true,
      ambulanceAvailable: true,
      hospitalType: 'PRIVATE',
      status: 'ACTIVE',
    },
    {
      name: 'Siddhartha Medical Hospital',
      address: 'Tilottama, Rupandehi',
      municipality: 'Tilottama',
      ward: 8,
      district: 'Rupandehi',
      province: 'Lumbini',
      latitude: 27.6850,
      longitude: 83.4550,
      phone: '071-525000',
      emergencyPhone: '071-525099',
      snakebiteTreatmentAvailable: true,
      treatmentCenterType: 'PRIMARY',
      antivenomStatus: 'LOW_STOCK',
      emergencyAvailable: true,
      emergency24x7: true,
      hospitalType: 'PRIVATE',
      status: 'ACTIVE',
    },
  ];

  console.log('📍 Creating hospitals...');
  for (const hospital of hospitals) {
    const created = await prisma.hospital.upsert({
      where: { 
        // Use a combination that's likely unique
        latitude_longitude: {
          latitude: hospital.latitude,
          longitude: hospital.longitude,
        }
      },
      update: hospital,
      create: hospital,
    });
    console.log(`  ✓ ${created.name}`);
  }

  // Seed Verified Rescuers
  console.log('\n🦸 Creating verified rescuers...');
  
  const rescuers = [
    {
      name: 'Rajesh Thapa',
      contact: '9812482578',
      email: 'rajesh@snakesos.org',
      address: 'Butwal-11, Rupandehi',
      municipality: 'Butwal',
      ward: 11,
      experience: 'Expert',
      experienceYears: 8,
      vehicle: 'Bike',
      status: 'VERIFIED',
      isAvailableNow: true,
      currentLat: 27.7000,
      currentLng: 83.4667,
      rating: 4.8,
      totalRescues: 245,
      completedRescues: 240,
      serviceRadiusKm: 25,
      skills: ['Snake Handling', 'First Aid', 'Species Identification'],
      equipment: ['Snake Hook', 'Tongs', 'Bag', 'Boots', 'Gloves'],
      hasEquipment: true,
    },
    {
      name: 'Suresh Gautam',
      contact: '9807591342',
      email: 'suresh@snakesos.org',
      address: 'Tilottama-5, Rupandehi',
      municipality: 'Tilottama',
      ward: 5,
      experience: 'Expert',
      experienceYears: 6,
      vehicle: 'Both',
      status: 'VERIFIED',
      isAvailableNow: true,
      currentLat: 27.6850,
      currentLng: 83.4550,
      rating: 4.9,
      totalRescues: 198,
      completedRescues: 195,
      serviceRadiusKm: 20,
      skills: ['Snake Handling', 'First Aid', 'Public Education'],
      equipment: ['Snake Hook', 'Tongs', 'Bag', 'Boots'],
      hasEquipment: true,
    },
    {
      name: 'Bikash Chaudhary',
      contact: '9845123456',
      address: 'Siddharthanagar-10, Rupandehi',
      municipality: 'Siddharthanagar',
      ward: 10,
      experience: 'Intermediate',
      experienceYears: 3,
      vehicle: 'Bike',
      status: 'VERIFIED',
      isAvailableNow: true,
      currentLat: 27.5089,
      currentLng: 83.4610,
      rating: 4.6,
      totalRescues: 87,
      completedRescues: 85,
      serviceRadiusKm: 15,
      skills: ['Snake Handling', 'First Aid'],
      equipment: ['Snake Hook', 'Bag', 'Boots'],
      hasEquipment: true,
    },
  ];

  for (const rescuer of rescuers) {
    const created = await prisma.volunteer.upsert({
      where: { 
        contact: rescuer.contact 
      },
      update: rescuer,
      create: rescuer,
    });
    console.log(`  ✓ ${created.name} (${created.contact})`);
  }

  console.log('\n✅ Emergency data seeded successfully!');
  console.log('\nSummary:');
  const hospitalCount = await prisma.hospital.count({ where: { status: 'ACTIVE', snakebiteTreatmentAvailable: true } });
  const rescuerCount = await prisma.volunteer.count({ where: { status: 'VERIFIED', isAvailableNow: true } });
  console.log(`  🏥 Active hospitals: ${hospitalCount}`);
  console.log(`  🦸 Available rescuers: ${rescuerCount}`);
}

seedEmergencyData()
  .catch((error) => {
    console.error('❌ Error seeding emergency data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
