import { prisma } from '../libs/database/src/client.js';

const fixes = [
  {
    name: 'Lumbini Provincial Hospital',
    district: 'Rupandehi',
    latitude: 27.6969,
    longitude: 83.4562,
  },
];

async function main() {
  console.log('🔧 Fixing hospital coordinates...\n');

  let updated = 0;

  for (const fix of fixes) {
    try {
      const result = await prisma.hospital.updateMany({
        where: {
          name: fix.name,
          district: fix.district,
        },
        data: {
          latitude: fix.latitude,
          longitude: fix.longitude,
        },
      });

      if (result.count > 0) {
        console.log(`✓ Updated ${fix.name}: [${fix.latitude}, ${fix.longitude}]`);
        updated += result.count;
      } else {
        console.log(`⚠ ${fix.name} not found`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${fix.name}:`, error.message);
    }
  }

  // Also delete the duplicate Mahendranagar from Madhesh
  const deleted = await prisma.hospital.deleteMany({
    where: {
      name: 'Mahendranagar District Hospital',
      province: 'Madhesh',
    },
  });

  if (deleted.count > 0) {
    console.log(`✓ Removed duplicate Mahendranagar District Hospital from Madhesh province`);
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated} hospitals`);
  console.log(`   Deleted: ${deleted.count} duplicate entries`);
  console.log('\n✅ Hospital coordinates fixed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
