/**
 * Fix Hospital Coordinates using OpenStreetMap Geocoding (FREE)
 * This will get accurate coordinates for each hospital based on their address
 */

import { prisma } from './libs/database/src/client.js';

// OpenStreetMap Nominatim API (FREE)
async function geocodeAddress(address: string, municipality: string, district: string): Promise<{ lat: number; lng: number } | null> {
  const query = `${address}, ${municipality}, ${district}, Nepal`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  
  try {
    console.log(`🔍 Geocoding: ${query}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SnakeSOS-Hospital-Locator',
      },
    });
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      console.log(`   ✅ Found: ${lat}, ${lng}`);
      return { lat, lng };
    } else {
      console.log(`   ❌ Not found`);
      return null;
    }
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    return null;
  }
}

// Delay between requests (Nominatim requires 1 second between requests)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fixHospitalCoordinates() {
  console.log('🏥 Fixing hospital coordinates using OpenStreetMap...\n');
  
  const hospitals = await prisma.hospital.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      municipality: true,
      district: true,
      latitude: true,
      longitude: true,
    },
  });
  
  console.log(`Found ${hospitals.length} hospitals to process\n`);
  
  let updated = 0;
  let failed = 0;
  
  for (const hospital of hospitals) {
    console.log(`\n📍 ${hospital.name}`);
    console.log(`   Current: ${hospital.latitude}, ${hospital.longitude}`);
    
    const coords = await geocodeAddress(hospital.address, hospital.municipality, hospital.district);
    
    if (coords) {
      // Update the hospital with new coordinates
      await prisma.hospital.update({
        where: { id: hospital.id },
        data: {
          latitude: coords.lat,
          longitude: coords.lng,
        },
      });
      
      console.log(`   ✅ Updated to: ${coords.lat}, ${coords.lng}`);
      updated++;
    } else {
      console.log(`   ⚠️  Keeping original coordinates`);
      failed++;
    }
    
    // Wait 1 second between requests (OpenStreetMap requirement)
    await delay(1100);
  }
  
  console.log('\n\n📊 Summary:');
  console.log(`   ✅ Updated: ${updated} hospitals`);
  console.log(`   ⚠️  Failed: ${failed} hospitals`);
  console.log(`   📍 Total: ${hospitals.length} hospitals\n`);
  
  await prisma.$disconnect();
}

fixHospitalCoordinates()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
