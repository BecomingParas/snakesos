import { prisma } from './libs/database/src/client.js';

// Correct coordinates for Bir Hospital (verified from Google Maps)
// Bir Hospital is located at Mahabouddha, near Kantipath
const BIR_HOSPITAL_LAT = 27.7042;
const BIR_HOSPITAL_LNG = 85.3138;

async function fixBirHospital() {
  console.log('🏥 Fixing Bir Hospital coordinates...\n');
  
  const result = await prisma.hospital.updateMany({
    where: {
      name: {
        contains: 'Bir Hospital',
      },
    },
    data: {
      latitude: BIR_HOSPITAL_LAT,
      longitude: BIR_HOSPITAL_LNG,
      address: 'Mahabouddha, Kathmandu',
    },
  });
  
  console.log(`✅ Updated ${result.count} hospital(s)\n`);
  
  const hospital = await prisma.hospital.findFirst({
    where: {
      name: {
        contains: 'Bir Hospital',
      },
    },
    select: {
      name: true,
      address: true,
      latitude: true,
      longitude: true,
    },
  });
  
  console.log('📍 Bir Hospital location:');
  console.log(`   Name: ${hospital?.name}`);
  console.log(`   Address: ${hospital?.address}`);
  console.log(`   Coordinates: ${hospital?.latitude}, ${hospital?.longitude}`);
  console.log('\n✅ Bir Hospital is now at the correct location!\n');
  
  await prisma.$disconnect();
}

fixBirHospital();
