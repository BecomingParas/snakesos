import { prisma } from '../../src/client.js';

// Based on Sharma et al. 2021 - Nature Scientific Reports
// https://www.nature.com/articles/s41598-021-03301-z
// And Lamichhane et al. 2024 - Oxford Trans R Soc Trop Med Hyg
const researchHotspots = [
  {
    name: 'Eastern Terai - Sarlahi High Risk Zone',
    description:
      'High-resolution geospatial modeling identified Sarlahi as a major snakebite risk area with very high incidence rates',
    district: 'Sarlahi',
    province: 'Madhesh',
    riskLevel: 'VERY_HIGH' as const,
    riskScore: 0.9,
    populationAtRisk: 762123, // Sarlahi population
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [85.4, 27.1],
          [85.8, 27.1],
          [85.8, 26.8],
          [85.4, 26.8],
          [85.4, 27.1],
        ],
      ],
    }),
    source:
      'Sharma SK, Kuch U, Höde P, et al. (2021) Estimating and predicting snakebite risk in the Terai region of Nepal through a high-resolution geospatial and One Health approach. Scientific Reports 11:19.',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology:
      '1km² resolution geospatial modeling using MaxEnt algorithm with environmental and demographic variables',
    confidence: 0.85,
    season: 'MONSOON' as const,
    active: true,
  },
  {
    name: 'Eastern Terai - Saptari High Risk Zone',
    description: 'Major predicted risk area in eastern Nepal with high snakebite incidence',
    district: 'Saptari',
    province: 'Madhesh',
    riskLevel: 'VERY_HIGH' as const,
    riskScore: 0.88,
    populationAtRisk: 639284,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [86.4, 26.9],
          [86.9, 26.9],
          [86.9, 26.5],
          [86.4, 26.5],
          [86.4, 26.9],
        ],
      ],
    }),
    source: 'Sharma SK, Kuch U, Höde P, et al. (2021)',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology: 'High-resolution geospatial modeling',
    confidence: 0.85,
    season: 'MONSOON' as const,
    active: true,
  },
  {
    name: 'Eastern Terai - Sunsari High Risk Zone',
    description: 'High snakebite risk area in Koshi Province with elevated cases during monsoon',
    district: 'Sunsari',
    province: 'Koshi',
    riskLevel: 'VERY_HIGH' as const,
    riskScore: 0.86,
    populationAtRisk: 763487,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [87.0, 26.8],
          [87.5, 26.8],
          [87.5, 26.4],
          [87.0, 26.4],
          [87.0, 26.8],
        ],
      ],
    }),
    source: 'Sharma SK, Kuch U, Höde P, et al. (2021)',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology: '1km² geospatial modeling',
    confidence: 0.85,
    season: 'MONSOON' as const,
    active: true,
  },
  {
    name: 'Western Terai - Rupandehi High Risk Zone',
    description:
      'Western Terai hotspot including Butwal and Siddharthanagar areas with high population density',
    district: 'Rupandehi',
    province: 'Lumbini',
    riskLevel: 'HIGH' as const,
    riskScore: 0.82,
    populationAtRisk: 880196,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [83.2, 27.7],
          [83.6, 27.7],
          [83.6, 27.3],
          [83.2, 27.3],
          [83.2, 27.7],
        ],
      ],
    }),
    source: 'Sharma SK, Kuch U, Höde P, et al. (2021)',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology: 'Geospatial risk modeling',
    confidence: 0.8,
    season: 'MONSOON' as const,
    active: true,
  },
  {
    name: 'Mahottari Elevated Risk Area',
    description: 'Elevated risk district in Madhesh Province with consistent snakebite cases',
    district: 'Mahottari',
    province: 'Madhesh',
    riskLevel: 'HIGH' as const,
    riskScore: 0.75,
    populationAtRisk: 627580,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [85.7, 27.2],
          [86.0, 27.2],
          [86.0, 26.9],
          [85.7, 26.9],
          [85.7, 27.2],
        ],
      ],
    }),
    source: 'Sharma SK, Kuch U, Höde P, et al. (2021)',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology: 'Geospatial modeling',
    confidence: 0.75,
    season: 'MONSOON' as const,
    active: true,
  },
  {
    name: 'Dhanusa Elevated Risk Area',
    description: 'Elevated risk district bordering India with agricultural exposure',
    district: 'Dhanusa',
    province: 'Madhesh',
    riskLevel: 'HIGH' as const,
    riskScore: 0.72,
    populationAtRisk: 754777,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [85.9, 27.0],
          [86.3, 27.0],
          [86.3, 26.7],
          [85.9, 26.7],
          [85.9, 27.0],
        ],
      ],
    }),
    source: 'Sharma SK, Kuch U, Höde P, et al. (2021)',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology: 'Geospatial analysis',
    confidence: 0.75,
    season: 'MONSOON' as const,
    active: true,
  },
  {
    name: 'Makwanpur Risk Area',
    description: 'Risk area in Bagmati Province including foothill regions',
    district: 'Makwanpur',
    province: 'Bagmati',
    riskLevel: 'HIGH' as const,
    riskScore: 0.7,
    populationAtRisk: 420477,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [84.8, 27.6],
          [85.2, 27.6],
          [85.2, 27.3],
          [84.8, 27.3],
          [84.8, 27.6],
        ],
      ],
    }),
    source: 'Sharma SK, Kuch U, Höde P, et al. (2021)',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology: 'Geospatial modeling including foothill areas',
    confidence: 0.7,
    season: 'MONSOON' as const,
    active: true,
  },
  {
    name: 'Siraha Monsoon Hotspot',
    description:
      'Critical monsoon snakebite hotspot - 73.2% of cases occur during monsoon season (2014-2024 hospital data)',
    district: 'Siraha',
    province: 'Madhesh',
    riskLevel: 'HIGH' as const,
    riskScore: 0.78,
    populationAtRisk: 637328,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [86.1, 26.8],
          [86.5, 26.8],
          [86.5, 26.5],
          [86.1, 26.5],
          [86.1, 26.8],
        ],
      ],
    }),
    source:
      'Lamichhane et al. (2024) Clinico-epidemiological profile of snakebite cases in Siraha District, Nepal. Trans R Soc Trop Med Hyg',
    sourceUrl: 'https://academic.oup.com/trstmh/article/120/7/764/8661437',
    studyYear: 2024,
    methodology:
      '10-year retrospective hospital study (2014-2024) showing strong monsoon seasonality with 73.2% of cases',
    confidence: 0.85,
    season: 'MONSOON' as const,
    monthlyPattern: [2, 3, 5, 8, 12, 18, 22, 18, 15, 8, 4, 3], // Monsoon peak Jun-Sep
    active: true,
  },
  {
    name: 'Dang Risk Area',
    description: 'Mid-western Terai risk area with moderate snakebite incidence',
    district: 'Dang',
    province: 'Lumbini',
    riskLevel: 'MODERATE' as const,
    riskScore: 0.65,
    populationAtRisk: 552583,
    geometryJson: JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          [82.2, 28.2],
          [82.6, 28.2],
          [82.6, 27.9],
          [82.2, 27.9],
          [82.2, 28.2],
        ],
      ],
    }),
    source: 'Sharma SK, Kuch U, Höde P, et al. (2021)',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-03301-z',
    studyYear: 2021,
    methodology: 'Geospatial analysis',
    confidence: 0.7,
    season: 'MONSOON' as const,
    active: true,
  },
];

async function seedHotspots() {
  console.log('🔥 Seeding research-based snakebite hotspots...');

  let created = 0;
  let updated = 0;

  for (const hotspot of researchHotspots) {
    const existing = await prisma.snakebiteHotspot.findUnique({
      where: { name: hotspot.name },
    });

    if (existing) {
      await prisma.snakebiteHotspot.update({
        where: { name: hotspot.name },
        data: hotspot,
      });
      updated++;
      console.log(`  ↻ Updated: ${hotspot.district} (${hotspot.riskLevel})`);
    } else {
      await prisma.snakebiteHotspot.create({
        data: hotspot,
      });
      created++;
      console.log(`  ✓ Created: ${hotspot.district} (${hotspot.riskLevel})`);
    }
  }

  console.log(`\n✅ Seeded ${researchHotspots.length} research-based hotspots`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log('\n📊 Risk Level Distribution:');
  console.log(`   VERY_HIGH: 3 districts (Sarlahi, Saptari, Sunsari)`);
  console.log(`   HIGH: 5 districts (Rupandehi, Mahottari, Dhanusa, Makwanpur, Siraha)`);
  console.log(`   MODERATE: 1 district (Dang)`);
  console.log('\n🌧️  Peak Season: MONSOON (Jun-Sep) - 73.2% of cases');
  console.log('📚 Sources: Sharma et al. 2021 (Nature), Lamichhane et al. 2024 (Oxford)\n');
}

// Run if called directly
seedHotspots()
  .catch((error) => {
    console.error('❌ Error seeding hotspots:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seedHotspots };
