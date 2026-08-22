// Comprehensive seed script for Snake Rescue Platform
// Populates all tables with substantial test data

import { UserRole, UserStatus, RescueStatus, RescuePriority, VolunteerStatus, PaymentMethod, PaymentStatus, DangerLevel } from '../src/prisma/generated/client.js';
import { prisma } from '../src/client.js';
import bcrypt from 'bcryptjs';

// Import sub-seeds
import { seedHotspots } from './seeds/hotspots.seed.js';

const hashedPassword = await bcrypt.hash('password123', 10);

// Nepali names for realistic data
const firstNames = [
  'Bikash', 'Anjali', 'Sabina', 'Dipesh', 'Nisha', 'Prabin', 'Sunita', 'Ramesh', 
  'Krishna', 'Meera', 'Hari', 'Prakash', 'Sita', 'Binod', 'Kamala', 'Raju',
  'Devi', 'Ganesh', 'Parvati', 'Shyam', 'Radha', 'Bishnu', 'Saraswati', 'Nabin',
  'Geeta', 'Arjun', 'Laxmi', 'Mohan', 'Kiran', 'Puspa', 'Santosh', 'Muna',
  'Rajesh', 'Anita', 'Suresh', 'Maya', 'Dinesh', 'Rita', 'Mahesh', 'Sumitra',
  'Ravi', 'Sangita', 'Anil', 'Bina', 'Kumar', 'Sapana', 'Naresh', 'Lila'
];

const lastNames = [
  'Thapa', 'Rai', 'Tamang', 'Lama', 'Poudel', 'Sah', 'Maharjan', 'Shrestha',
  'Gurung', 'Adhikari', 'Baral', 'Yadav', 'Magar', 'Sherpa', 'KC', 'BK',
  'Sharma', 'Karki', 'Pandey', 'Bhattarai', 'Subedi', 'Acharya', 'Regmi', 'Khadka',
  'Ghimire', 'Parajuli', 'Basnet', 'Lamichhane', 'Pokharel', 'Dhakal'
];

const municipalities = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Bharatpur', 'Biratnagar',
  'Janakpur', 'Dharan', 'Butwal', 'Hetauda', 'Birgunj', 'Nepalgunj',
  'Dhangadhi', 'Itahari', 'Damak', 'Tulsipur', 'Ghorahi', 'Bhairahawa'
];

const districts = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kaski', 'Chitwan', 'Morang',
  'Dhanusha', 'Sunsari', 'Rupandehi', 'Makwanpur', 'Parsa', 'Banke',
  'Kailali', 'Jhapa', 'Dang', 'Bardiya', 'Siraha', 'Sarlahi'
];

async function main() {
  console.log('🌱 Starting FULL database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.rescueRequest.deleteMany();
  await prisma.snakeSpecies.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.snakebiteHotspot.deleteMany();
  await prisma.hospitalVerification.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Cleared all tables\n');

  // ===== CREATE REAL HOSPITALS FROM AUTHORITATIVE SEED DATA =====
  console.log('🏥 Creating hospitals from authoritative seed data...');
  
  // Import the seedHospitals function from hospitals.seed.ts
  const { seedHospitals } = await import('./seeds/hospitals.seed.js');
  
  // Execute the hospital seeding
  await seedHospitals();
  
  const hospitalCount = await prisma.hospital.count();
  console.log(`✓ Created ${hospitalCount} hospitals from authoritative data\n`);

  // ===== CREATE 70+ VOLUNTEER/RESCUER USERS =====
  console.log('👥 Creating 70+ rescuers/volunteers...');
  const volunteerUsers = [];
  
  for (let i = 0; i < 75; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@snakerescue.com`;
    
    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: i < 50 ? UserRole.VERIFIED_RESCUER : UserRole.VOLUNTEER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: `+977985${String(1230000 + i).slice(-7)}`,
      },
    });
    
    // Create credential account
    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: 'credential',
        accountId: user.email,
        password: hashedPassword,
      },
    });
    
    volunteerUsers.push(user);
  }
  console.log(`✓ Created ${volunteerUsers.length} volunteer users\n`);

  // ===== CREATE ADMIN & CITIZEN USERS (40 total) =====
  console.log('👤 Creating admin and citizen users...');
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@snakerescue.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '+9779851234567',
    },
  });
  
  await prisma.account.create({
    data: {
      userId: adminUser.id,
      providerId: 'credential',
      accountId: adminUser.email,
      password: hashedPassword,
    },
  });

  const citizenUsers = [];
  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[(i + 20) % firstNames.length];
    const lastName = lastNames[(i + 10) % lastNames.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    
    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: `+977985${String(1240000 + i).slice(-7)}`,
      },
    });
    
    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: 'credential',
        accountId: user.email,
        password: hashedPassword,
      },
    });
    
    citizenUsers.push(user);
  }
  console.log(`✓ Created 1 admin + ${citizenUsers.length} citizens\n`);

  // ===== CREATE 75 VOLUNTEER PROFILES =====
  console.log('🦸 Creating 75 volunteer profiles...');
  const volunteerProfiles = [];
  
  for (let i = 0; i < volunteerUsers.length; i++) {
    const user = volunteerUsers[i];
    const experience = i < 30 ? 'EXPERT' : i < 55 ? 'INTERMEDIATE' : 'BEGINNER';
    const experienceYears = i < 30 ? 5 + (i % 5) : i < 55 ? 2 + (i % 3) : 1;
    
    // Generate Nepal coordinates within bounds
    const getNepalCoordinates = () => {
      const lat = 26.3 + Math.random() * (30.4 - 26.3);
      const lng = 80.0 + Math.random() * (88.2 - 80.0);
      return { lat, lng };
    };
    
    const coords = getNepalCoordinates();
    
    const profile = await prisma.volunteer.create({
      data: {
        userId: user.id,
        name: user.name,
        contact: user.phone || `+977985${String(1230000 + i).slice(-7)}`,
        email: user.email,
        address: municipalities[i % municipalities.length],
        municipality: municipalities[i % municipalities.length],
        ward: (i % 20) + 1,
        experience,
        experienceYears,
        vehicle: i % 4 === 0 ? 'BOTH' : i % 4 === 1 ? 'CAR' : i % 4 === 2 ? 'BIKE' : 'NONE',
        bio: `Experienced snake rescuer specializing in ${experience.toLowerCase()} level operations.`,
        skills: i % 3 === 0 ? ['Venomous handling', 'Night ops'] : ['Non-venomous', 'Transport'],
        certifications: i % 2 === 0 ? ['Certified Handler'] : ['Basic Training'],
        assignedZone: municipalities[i % municipalities.length],
        emergencyAvailability: i % 3 !== 0,
        isAvailableNow: i % 2 === 0,
        availableTime: i % 4 === 0 ? 'ANYTIME' : i % 4 === 1 ? 'MORNINGS' : i % 4 === 2 ? 'EVENINGS' : 'WEEKENDS',
        availableDays: i % 2 === 0 
          ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          : ['Saturday', 'Sunday'],
        status: i % 5 === 0 ? VolunteerStatus.APPROVED : VolunteerStatus.VERIFIED,
        completedRescues: experience === 'EXPERT' ? 200 + (i * 10) : experience === 'INTERMEDIATE' ? 50 + (i * 5) : i * 2,
        totalRescues: experience === 'EXPERT' ? 220 + (i * 10) : experience === 'INTERMEDIATE' ? 60 + (i * 5) : (i * 2) + 3,
        rating: 4.3 + (Math.random() * 0.7),
        verifiedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        // Add location coordinates so they can be found by proximity search
        lastKnownLatitude: coords.lat,
        lastKnownLongitude: coords.lng,
        lastLocationUpdate: new Date(),
      },
    });
    
    volunteerProfiles.push(profile);
  }
  console.log(`✓ Created ${volunteerProfiles.length} volunteer profiles\n`);

  // ===== CREATE 150+ SNAKE SPECIES =====
  console.log('🐍 Creating 150+ snake species...');
  
  const venomousSnakes = [
    { name: 'Spectacled Cobra', scientific: 'Naja naja', nepali: 'गोमन सर्प', danger: DangerLevel.HIGHLY_DANGEROUS },
    { name: 'Common Krait', scientific: 'Bungarus caeruleus', nepali: 'गोमन करैत', danger: DangerLevel.HIGHLY_DANGEROUS },
    { name: "Russell's Viper", scientific: 'Daboia russelii', nepali: 'चन्द्रबोरा', danger: DangerLevel.HIGHLY_DANGEROUS },
    { name: 'Monocled Cobra', scientific: 'Naja kaouthia', nepali: 'काली नाग', danger: DangerLevel.HIGHLY_DANGEROUS },
    { name: 'King Cobra', scientific: 'Ophiophagus hannah', nepali: 'राज नाग', danger: DangerLevel.HIGHLY_DANGEROUS },
    { name: 'Banded Krait', scientific: 'Bungarus fasciatus', nepali: 'पहेंलो करैत', danger: DangerLevel.HIGHLY_DANGEROUS },
    { name: 'Green Pit Viper', scientific: 'Trimeresurus albolabris', nepali: 'हरियो सर्प', danger: DangerLevel.DANGEROUS },
    { name: 'Saw-scaled Viper', scientific: 'Echis carinatus', nepali: 'फुर्के', danger: DangerLevel.DANGEROUS },
  ];

  const nonVenomousSnakes = [
    { name: 'Rat Snake', scientific: 'Ptyas mucosa', nepali: 'ढमनी सर्प', danger: DangerLevel.HARMLESS },
    { name: 'Checkered Keelback', scientific: 'Fowlea piscator', nepali: 'पानी सर्प', danger: DangerLevel.HARMLESS },
    { name: 'Common Wolf Snake', scientific: 'Lycodon aulicus', nepali: 'घरमा भेटिने', danger: DangerLevel.HARMLESS },
    { name: 'Trinket Snake', scientific: 'Coelognathus helena', nepali: 'पहाडी ढमनी', danger: DangerLevel.HARMLESS },
    { name: 'Common Sand Boa', scientific: 'Eryx conicus', nepali: 'बालुवा सर्प', danger: DangerLevel.HARMLESS },
    { name: 'Striped Keelback', scientific: 'Amphiesma stolatum', nepali: 'धारे पानी सर्प', danger: DangerLevel.HARMLESS },
  ];

  const allSnakeTemplates = [...venomousSnakes, ...nonVenomousSnakes];
  const species = [];
  
  for (let i = 0; i < 150; i++) {
    const template = allSnakeTemplates[i % allSnakeTemplates.length];
    const variant = Math.floor(i / allSnakeTemplates.length);
    
    const snake = await prisma.snakeSpecies.create({
      data: {
        name: variant > 0 ? `${template.name} (Variant ${variant})` : template.name,
        scientificName: variant > 0 ? `${template.scientific}_v${variant}` : template.scientific,
        nepaliName: template.nepali,
        venomous: template.danger === DangerLevel.HIGHLY_DANGEROUS || template.danger === DangerLevel.DANGEROUS,
        dangerLevel: template.danger,
        identificationGuide: `Identification guide for ${template.name}${variant > 0 ? ` variant ${variant}` : ''}`,
        habitat: i % 3 === 0 ? 'Farmland' : i % 3 === 1 ? 'Forest' : 'Wetland',
        distinctiveFeatures: [`Feature ${i + 1}`, `Feature ${i + 2}`],
      },
    });
    
    species.push(snake);
  }
  console.log(`✓ Created ${species.length} snake species\n`);

  // ===== CREATE 50+ RESCUE REQUESTS =====
  console.log('🚨 Creating 50+ rescue requests...');
  
  // Nepal bounding box
  const NEPAL_LAT_MIN = 26.3;
  const NEPAL_LAT_MAX = 30.4;
  const NEPAL_LNG_MIN = 80.0;
  const NEPAL_LNG_MAX = 88.2;
  
  // Function to generate random coordinates within Nepal
  const getNepalCoordinates = () => {
    const lat = NEPAL_LAT_MIN + Math.random() * (NEPAL_LAT_MAX - NEPAL_LAT_MIN);
    const lng = NEPAL_LNG_MIN + Math.random() * (NEPAL_LNG_MAX - NEPAL_LNG_MIN);
    return { lat, lng };
  };
  
  for (let i = 0; i < 55; i++) {
    const citizen = citizenUsers[i % citizenUsers.length];
    const snakeSpecies = species[i % species.length];
    const volunteer = i % 3 !== 0 ? volunteerProfiles[i % volunteerProfiles.length] : null;
    
    const statuses = [RescueStatus.PENDING, RescueStatus.ASSIGNED, RescueStatus.IN_PROGRESS, RescueStatus.COMPLETED, RescueStatus.CANCELLED];
    const status = statuses[i % statuses.length];
    
    const { lat, lng } = getNepalCoordinates();
    
    await prisma.rescueRequest.create({
      data: {
        userId: citizen.id,
        name: citizen.name,
        phone: citizen.phone || `+977985${String(1240000 + i).slice(-7)}`,
        speciesId: snakeSpecies.id,
        assignedTo: volunteer?.id,
        address: `House ${i + 1}, ${municipalities[i % municipalities.length]}`,
        municipality: municipalities[i % municipalities.length],
        ward: (i % 20) + 1,
        lat,
        lng,
        notes: `Rescue request #${i + 1}`,
        status,
        priority: i % 4 === 0 ? RescuePriority.CRITICAL : i % 4 === 1 ? RescuePriority.HIGH : i % 4 === 2 ? RescuePriority.MEDIUM : RescuePriority.LOW,
        createdAt: new Date(Date.now() - (i * 60 * 60 * 1000)),
        completedAt: status === RescueStatus.COMPLETED ? new Date(Date.now() - ((i - 2) * 60 * 60 * 1000)) : null,
      },
    });
  }
  console.log(`✓ Created 55 rescue requests\n`);

  // ===== CREATE 40+ DONATIONS =====
  console.log('💰 Creating 40+ donations...');
  
  for (let i = 0; i < 45; i++) {
    const donor = citizenUsers[i % citizenUsers.length];
    const paymentMethods = [PaymentMethod.ESEWA, PaymentMethod.KHALTI, PaymentMethod.BANK_TRANSFER, PaymentMethod.FONEPAY];
    const statuses = [PaymentStatus.COMPLETED, PaymentStatus.COMPLETED, PaymentStatus.COMPLETED, PaymentStatus.PENDING];
    
    await prisma.donation.create({
      data: {
        donorId: donor.id,
        donorName: donor.name,
        donorEmail: donor.email,
        donorPhone: donor.phone || undefined,
        amount: 1000 + (i * 500),
        paymentMethod: paymentMethods[i % paymentMethods.length],
        paymentGateway: paymentMethods[i % paymentMethods.length].toLowerCase(),
        status: statuses[i % statuses.length],
        transactionId: `TXN${Date.now()}${i}`,
        message: `Donation for rescue operations #${i + 1}`,
        paidAt: statuses[i % statuses.length] === PaymentStatus.COMPLETED 
          ? new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
          : null,
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
      },
    });
  }
  console.log(`✓ Created 45 donations\n`);

  // ===== CREATE 100+ ACTIVITY LOGS =====
  console.log('📋 Creating 100+ activity logs...');
  
  const actions = [
    'RESCUE_ASSIGNED', 'RESCUE_COMPLETED', 'USER_VERIFIED', 'ROLE_UPDATED',
    'VOLUNTEER_APPLICATION', 'TRAINING_COMPLETED', 'DONATION_RECEIVED'
  ];
  
  for (let i = 0; i < 120; i++) {
    const user = i % 2 === 0 
      ? volunteerUsers[i % volunteerUsers.length]
      : citizenUsers[i % citizenUsers.length];
    
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: actions[i % actions.length],
        description: `Activity log entry #${i + 1} - ${actions[i % actions.length]}`,
        createdAt: new Date(Date.now() - (i * 30 * 60 * 1000)),
      },
    });
  }
  console.log(`✓ Created 120 activity logs\n`);

  // ===== CREATE HOTSPOTS (imported seed) =====
  console.log('🔥 Creating snakebite hotspots...');
  await seedHotspots();
  console.log('✓ Hotspots created\n');

  // ===== SUMMARY =====
  const counts = {
    hospitals: await prisma.hospital.count(),
    users: await prisma.user.count(),
    volunteers: await prisma.volunteer.count(),
    species: await prisma.snakeSpecies.count(),
    rescues: await prisma.rescueRequest.count(),
    donations: await prisma.donation.count(),
    activityLogs: await prisma.activityLog.count(),
    hotspots: await prisma.snakebiteHotspot.count(),
  };

  console.log('\n✅ FULL SEED COMPLETED SUCCESSFULLY!\n');
  console.log('📊 Database Summary:');
  console.log(`   • ${counts.hospitals} hospitals`);
  console.log(`   • ${counts.users} users (1 admin + 40 citizens + 75 volunteers)`);
  console.log(`   • ${counts.volunteers} volunteer profiles`);
  console.log(`   • ${counts.species} snake species`);
  console.log(`   • ${counts.rescues} rescue requests`);
  console.log(`   • ${counts.donations} donations`);
  console.log(`   • ${counts.activityLogs} activity logs`);
  console.log(`   • ${counts.hotspots} snakebite hotspots`);
  console.log('\n🔐 Test credentials (password: password123):');
  console.log('   • admin@snakerescue.com (ADMIN)');
  console.log('   • bikash.thapa0@snakerescue.com (VERIFIED_RESCUER)');
  console.log('   • sunita.maharjan0@example.com (CITIZEN)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
