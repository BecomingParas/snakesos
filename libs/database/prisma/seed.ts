// Now import everything AFTER environment is loaded (via dotenv-cli)
import { UserRole, UserStatus, RescueStatus, RescuePriority, VolunteerStatus, PaymentMethod, PaymentStatus } from '../src/prisma/generated/client.js';
import { DangerLevel } from '../src/prisma/generated/client.js';
import { prisma } from '../src/client.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🗑️  Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.rescueRequest.deleteMany();
  await prisma.snakeSpecies.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // Hash password properly with bcryptjs
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ===== CREATE USERS =====
  console.log('\n👤 Creating users...');
  
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
  console.log(`  ✓ Created admin: ${adminUser.email}`);

  // Create citizen users (from rescue demo data)
  const citizenUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sunita.maharjan@example.com',
        name: 'Sunita Maharjan',
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851234412',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ramesh.shrestha@example.com',
        name: 'Ramesh Shrestha',
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851231180',
      },
    }),
    prisma.user.create({
      data: {
        email: 'krishna.gurung@example.com',
        name: 'Krishna Gurung',
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851237729',
      },
    }),
    prisma.user.create({
      data: {
        email: 'meera.adhikari@example.com',
        name: 'Meera Adhikari',
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851233055',
      },
    }),
    prisma.user.create({
      data: {
        email: 'hari.baral@example.com',
        name: 'Hari Baral',
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851239901',
      },
    }),
    prisma.user.create({
      data: {
        email: 'prakash.yadav@example.com',
        name: 'Prakash Yadav',
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851232287',
      },
    }),
  ]);
  console.log(`  ✓ Created ${citizenUsers.length} citizen users`);

  // Create volunteer users
  const volunteerUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'bikash.thapa@snakerescue.com',
        name: 'Bikash Thapa',
        role: UserRole.VERIFIED_RESCUER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851230001',
      },
    }),
    prisma.user.create({
      data: {
        email: 'anjali.rai@snakerescue.com',
        name: 'Anjali Rai',
        role: UserRole.VERIFIED_RESCUER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851230002',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sabina.tamang@snakerescue.com',
        name: 'Sabina Tamang',
        role: UserRole.VERIFIED_RESCUER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851230003',
      },
    }),
    prisma.user.create({
      data: {
        email: 'dipesh.lama@snakerescue.com',
        name: 'Dipesh Lama',
        role: UserRole.VERIFIED_RESCUER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851230004',
      },
    }),
    prisma.user.create({
      data: {
        email: 'nisha.poudel@snakerescue.com',
        name: 'Nisha Poudel',
        role: UserRole.VOLUNTEER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851230005',
      },
    }),
    prisma.user.create({
      data: {
        email: 'prabin.sah@snakerescue.com',
        name: 'Prabin Sah',
        role: UserRole.VOLUNTEER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+9779851230006',
      },
    }),
  ]);
  console.log(`  ✓ Created ${volunteerUsers.length} volunteer users`);

  // Create credential accounts for all users
  const allUsers = [adminUser, ...citizenUsers, ...volunteerUsers];
  for (const user of allUsers) {
    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: 'credential',
        accountId: user.email,
        password: hashedPassword,
      },
    });
  }
  console.log(`  ✓ Created credential accounts for ${allUsers.length} users`);

  // ===== CREATE SNAKE SPECIES =====
  console.log('\n🐍 Creating snake species...');
  
  const species = await Promise.all([
    prisma.snakeSpecies.create({
      data: {
        name: 'Spectacled Cobra',
        scientificName: 'Naja naja',
        nepaliName: 'गोमन सर्प',
        venomous: true,
        dangerLevel: DangerLevel.HIGHLY_DANGEROUS,
        identificationGuide: 'Hood with spectacle mark, smooth scales, raises front third',
        habitat: 'Farmland, village outskirts, granaries',
        distinctiveFeatures: ['Spectacle mark on hood', 'Smooth scales', 'Raises front third of body'],
      },
    }),
    prisma.snakeSpecies.create({
      data: {
        name: 'Common Krait',
        scientificName: 'Bungarus caeruleus',
        nepaliName: 'गोमन करैत',
        venomous: true,
        dangerLevel: DangerLevel.HIGHLY_DANGEROUS,
        identificationGuide: 'Glossy black with white bands, hexagonal vertebral scales, nocturnal',
        habitat: 'Inside homes at night, rubble piles',
        distinctiveFeatures: ['Glossy black with white bands', 'Hexagonal vertebral scales', 'Nocturnal'],
      },
    }),
    prisma.snakeSpecies.create({
      data: {
        name: "Russell's Viper",
        scientificName: 'Daboia russelii',
        nepaliName: 'चन्द्रबोरा',
        venomous: true,
        dangerLevel: DangerLevel.HIGHLY_DANGEROUS,
        identificationGuide: 'Chain of dark ovals, loud hiss, triangular head',
        habitat: 'Grassland, paddy edges, scrub',
        distinctiveFeatures: ['Chain of dark ovals', 'Loud hiss', 'Triangular head'],
      },
    }),
    prisma.snakeSpecies.create({
      data: {
        name: 'Rat Snake',
        scientificName: 'Ptyas mucosa',
        nepaliName: 'ढमनी सर्प',
        venomous: false,
        dangerLevel: DangerLevel.HARMLESS,
        identificationGuide: 'Long slender body, large eyes, fast mover',
        habitat: 'Barns, fields, roof spaces',
        distinctiveFeatures: ['Long slender body', 'Large eyes', 'Fast mover'],
      },
    }),
    prisma.snakeSpecies.create({
      data: {
        name: 'Checkered Keelback',
        scientificName: 'Fowlea piscator',
        nepaliName: 'पानी सर्प',
        venomous: false,
        dangerLevel: DangerLevel.HARMLESS,
        identificationGuide: 'Checkerboard pattern, keeled scales, strong swimmer',
        habitat: 'Ponds, canals, wetlands',
        distinctiveFeatures: ['Checkerboard pattern', 'Keeled scales', 'Strong swimmer'],
      },
    }),
    prisma.snakeSpecies.create({
      data: {
        name: 'Monocled Cobra',
        scientificName: 'Naja kaouthia',
        nepaliName: 'काली नाग',
        venomous: true,
        dangerLevel: DangerLevel.HIGHLY_DANGEROUS,
        identificationGuide: 'Single circular mark on hood, aggressive when cornered',
        habitat: 'Temple courtyards, drains, agricultural areas',
        distinctiveFeatures: ['Single circular mark on hood', 'Aggressive when cornered'],
      },
    }),
  ]);
  console.log(`  ✓ Created ${species.length} snake species`);

  // ===== CREATE VOLUNTEER PROFILES =====
  console.log('\n🦸 Creating volunteer profiles...');
  
  const volunteerProfilesData = [
    {
      userId: volunteerUsers[0].id,
      name: volunteerUsers[0].name,
      contact: volunteerUsers[0].phone || '+9779851230001',
      email: volunteerUsers[0].email,
      address: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan',
      ward: 10,
      experience: 'EXPERT',
      experienceYears: 7,
      vehicle: 'BOTH',
      bio: 'Lead handler with expertise in venomous species and night operations. Certified trainer.',
      skills: ['Venomous handling', 'Night ops', 'Trainer'],
      certifications: ['Advanced Venomous Handler', 'Emergency Response', 'Training Instructor'],
      assignedZone: 'Kathmandu',
      emergencyAvailability: true,
      isAvailableNow: true,
      availableTime: 'ANYTIME',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      status: VolunteerStatus.VERIFIED,
      completedRescues: 412,
      totalRescues: 430,
      rating: 4.9,
      verifiedAt: new Date('2019-01-01'),
    },
    {
      userId: volunteerUsers[1].id,
      name: volunteerUsers[1].name,
      contact: volunteerUsers[1].phone || '+9779851230002',
      email: volunteerUsers[1].email,
      address: 'Lalitpur',
      municipality: 'Lalitpur Sub-Metropolitan',
      ward: 5,
      experience: 'EXPERT',
      experienceYears: 6,
      vehicle: 'BIKE',
      bio: 'Lead handler specializing in community education and first aid. Patient and thorough.',
      skills: ['Venomous handling', 'First aid', 'Community talks'],
      certifications: ['Advanced Venomous Handler', 'First Aid Certified', 'Public Speaker'],
      assignedZone: 'Lalitpur',
      emergencyAvailability: true,
      isAvailableNow: true,
      availableTime: 'ANYTIME',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      status: VolunteerStatus.VERIFIED,
      completedRescues: 288,
      totalRescues: 305,
      rating: 4.8,
      verifiedAt: new Date('2020-03-15'),
    },
    {
      userId: volunteerUsers[2].id,
      name: volunteerUsers[2].name,
      contact: volunteerUsers[2].phone || '+9779851230003',
      email: volunteerUsers[2].email,
      address: 'Pokhara',
      municipality: 'Pokhara Metropolitan',
      ward: 12,
      experience: 'INTERMEDIATE',
      experienceYears: 4,
      vehicle: 'CAR',
      bio: 'Certified handler with focus on wetland releases and wildlife photography documentation.',
      skills: ['Wetland release', 'Photography'],
      certifications: ['Certified Handler', 'Habitat Assessment'],
      assignedZone: 'Pokhara',
      emergencyAvailability: true,
      isAvailableNow: false,
      availableTime: 'WEEKENDS',
      availableDays: ['Saturday', 'Sunday'],
      status: VolunteerStatus.VERIFIED,
      completedRescues: 164,
      totalRescues: 172,
      rating: 4.7,
      verifiedAt: new Date('2021-06-01'),
    },
    {
      userId: volunteerUsers[3].id,
      name: volunteerUsers[3].name,
      contact: volunteerUsers[3].phone || '+9779851230004',
      email: volunteerUsers[3].email,
      address: 'Chitwan',
      municipality: 'Bharatpur Metropolitan',
      ward: 8,
      experience: 'INTERMEDIATE',
      experienceYears: 3,
      vehicle: 'BOTH',
      bio: 'Certified handler experienced with farm rescues and rural transport logistics.',
      skills: ['Farm rescues', 'Transport'],
      certifications: ['Certified Handler', 'Rural Operations'],
      assignedZone: 'Chitwan',
      emergencyAvailability: true,
      isAvailableNow: true,
      availableTime: 'EVENINGS',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
      status: VolunteerStatus.VERIFIED,
      completedRescues: 121,
      totalRescues: 135,
      rating: 4.6,
      verifiedAt: new Date('2022-02-20'),
    },
    {
      userId: volunteerUsers[4].id,
      name: volunteerUsers[4].name,
      contact: volunteerUsers[4].phone || '+9779851230005',
      email: volunteerUsers[4].email,
      address: 'Bharatpur',
      municipality: 'Bharatpur Metropolitan',
      ward: 15,
      experience: 'BEGINNER',
      experienceYears: 1,
      vehicle: 'NONE',
      bio: 'Trainee handler focusing on non-venomous species and data logging.',
      skills: ['Non-venomous handling', 'Data logging'],
      certifications: ['Basic Handler Training'],
      assignedZone: 'Bharatpur',
      emergencyAvailability: false,
      isAvailableNow: true,
      availableTime: 'WEEKENDS',
      availableDays: ['Saturday', 'Sunday'],
      status: VolunteerStatus.APPROVED,
      completedRescues: 23,
      totalRescues: 25,
      rating: 4.4,
      verifiedAt: new Date('2025-01-10'),
    },
    {
      userId: volunteerUsers[5].id,
      name: volunteerUsers[5].name,
      contact: volunteerUsers[5].phone || '+9779851230006',
      email: volunteerUsers[5].email,
      address: 'Janakpur',
      municipality: 'Janakpur Sub-Metropolitan',
      ward: 3,
      experience: 'INTERMEDIATE',
      experienceYears: 2,
      vehicle: 'CAR',
      bio: 'Transport specialist with vehicle and release logistics expertise.',
      skills: ['Vehicle', 'Release logistics'],
      certifications: ['Transport Coordinator'],
      assignedZone: 'Janakpur',
      emergencyAvailability: false,
      isAvailableNow: false,
      availableTime: 'WEEKENDS',
      availableDays: ['Saturday'],
      status: VolunteerStatus.VERIFIED,
      completedRescues: 58,
      totalRescues: 62,
      rating: 4.5,
      verifiedAt: new Date('2023-08-12'),
    },
  ];

  // Create volunteer profiles and store the created records
  const volunteerProfiles = [];
  for (const profileData of volunteerProfilesData) {
    const profile = await prisma.volunteer.create({ data: profileData });
    volunteerProfiles.push(profile);
  }
  console.log(`  ✓ Created ${volunteerProfiles.length} volunteer profiles`);

  // ===== CREATE RESCUE REQUESTS =====
  console.log('\n🚨 Creating rescue requests...');
  
  const rescues = [
    {
      userId: citizenUsers[0].id,
      name: citizenUsers[0].name,
      phone: citizenUsers[0].phone || '+9779851234412',
      speciesId: species[0].id, // Spectacled Cobra
      assignedTo: volunteerProfiles[0].id, // Bikash Thapa (volunteer profile ID)
      address: 'Kalimati Vegetable Market, storage shed',
      municipality: 'Kathmandu Metropolitan',
      ward: 10,
      lat: 27.6988,
      lng: 85.2924,
      notes: 'Snake coiled behind crates. Crowd gathered, area being cleared.',
      status: RescueStatus.IN_PROGRESS,
      priority: RescuePriority.CRITICAL,
      createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 min ago
    },
    {
      userId: citizenUsers[1].id,
      name: citizenUsers[1].name,
      phone: citizenUsers[1].phone || '+9779851231180',
      speciesId: species[1].id, // Common Krait
      assignedTo: volunteerProfiles[1].id, // Anjali Rai (volunteer profile ID)
      address: 'Residential bedroom, ground floor',
      municipality: 'Lalitpur Sub-Metropolitan',
      ward: 5,
      lat: 27.6710,
      lng: 85.3240,
      notes: 'Family relocated to neighbour\'s house. Hook and tube ready.',
      status: RescueStatus.IN_PROGRESS,
      priority: RescuePriority.CRITICAL,
      createdAt: new Date(Date.now() - 41 * 60 * 1000), // 41 min ago
    },
    {
      userId: citizenUsers[2].id,
      name: citizenUsers[2].name,
      phone: citizenUsers[2].phone || '+9779851237729',
      speciesId: species[3].id, // Rat Snake
      assignedTo: volunteerProfiles[3].id, // Dipesh Lama (volunteer profile ID)
      address: 'Poultry farm, feed room',
      municipality: 'Bharatpur Metropolitan',
      ward: 8,
      lat: 27.5291,
      lng: 84.3542,
      notes: 'Likely hunting rodents. Owner asked for relocation, not harm.',
      status: RescueStatus.ASSIGNED,
      priority: RescuePriority.LOW,
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hr ago
    },
    {
      userId: citizenUsers[3].id,
      name: citizenUsers[3].name,
      phone: citizenUsers[3].phone || '+9779851233055',
      speciesId: species[2].id, // Russell's Viper
      address: 'Schoolyard hedge near gate 2',
      municipality: 'Bharatpur Metropolitan',
      ward: 15,
      lat: 27.6768,
      lng: 84.4345,
      notes: 'Students kept indoors. Needs responder within 30 minutes.',
      status: RescueStatus.PENDING,
      priority: RescuePriority.HIGH,
      createdAt: new Date(Date.now() - 80 * 60 * 1000), // 1 hr 20 min ago
    },
    {
      userId: citizenUsers[4].id,
      name: citizenUsers[4].name,
      phone: citizenUsers[4].phone || '+9779851239901',
      speciesId: species[4].id, // Checkered Keelback
      assignedTo: volunteerProfiles[2].id, // Sabina Tamang (volunteer profile ID)
      address: 'Irrigation canal beside paddy field',
      municipality: 'Pokhara Metropolitan',
      ward: 12,
      lat: 28.2096,
      lng: 83.9856,
      notes: 'Released into Begnas wetland buffer. Health good.',
      status: RescueStatus.COMPLETED,
      priority: RescuePriority.LOW,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hrs ago
      completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      userId: citizenUsers[5].id,
      name: citizenUsers[5].name,
      phone: citizenUsers[5].phone || '+9779851232287',
      speciesId: species[5].id, // Monocled Cobra
      assignedTo: volunteerProfiles[0].id, // Bikash Thapa (volunteer profile ID)
      address: 'Temple courtyard drain',
      municipality: 'Janakpur Sub-Metropolitan',
      ward: 3,
      lat: 26.7288,
      lng: 85.9254,
      notes: 'Relocated 9 km away. Community briefing delivered on site.',
      status: RescueStatus.COMPLETED,
      priority: RescuePriority.HIGH,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      completedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    },
  ];

  for (const rescue of rescues) {
    await prisma.rescueRequest.create({ data: rescue });
  }
  console.log(`  ✓ Created ${rescues.length} rescue requests`);

  // ===== CREATE DONATIONS =====
  console.log('\n💰 Creating donations...');
  
  const donations = [
    {
      donorId: citizenUsers[0].id,
      donorName: citizenUsers[0].name,
      donorEmail: citizenUsers[0].email,
      donorPhone: citizenUsers[0].phone || undefined,
      amount: 5000,
      paymentMethod: PaymentMethod.ESEWA,
      paymentGateway: 'esewa',
      status: PaymentStatus.COMPLETED,
      transactionId: 'ESW' + Date.now(),
      message: 'For rescue operations',
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      donorId: citizenUsers[1].id,
      donorName: citizenUsers[1].name,
      donorEmail: citizenUsers[1].email,
      donorPhone: citizenUsers[1].phone || undefined,
      amount: 12000,
      paymentMethod: PaymentMethod.KHALTI,
      paymentGateway: 'khalti',
      status: PaymentStatus.COMPLETED,
      transactionId: 'KHL' + Date.now(),
      message: 'Antivenom support',
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      donorId: citizenUsers[2].id,
      donorName: citizenUsers[2].name,
      donorEmail: citizenUsers[2].email,
      donorPhone: citizenUsers[2].phone || undefined,
      amount: 1500,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      paymentGateway: 'bank',
      status: PaymentStatus.COMPLETED,
      transactionId: 'BANK' + Date.now(),
      message: 'Field kit donation',
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      donorId: citizenUsers[3].id,
      donorName: citizenUsers[3].name,
      donorEmail: citizenUsers[3].email,
      donorPhone: citizenUsers[3].phone || undefined,
      amount: 5000,
      paymentMethod: PaymentMethod.ESEWA,
      paymentGateway: 'esewa',
      status: PaymentStatus.PENDING,
      transactionId: 'ESW' + (Date.now() + 1),
      message: 'Fuel support',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ];

  for (const donation of donations) {
    await prisma.donation.create({ data: donation });
  }
  console.log(`  ✓ Created ${donations.length} donations`);

  // ===== CREATE ACTIVITY LOGS =====
  console.log('\n📋 Creating activity logs...');
  
  const activityLogs = [
    {
      userId: volunteerUsers[0].id,
      action: 'RESCUE_ASSIGNED',
      description: 'Assigned to rescue SR-2418 (Spectacled Cobra)',
      createdAt: new Date(Date.now() - 12 * 60 * 1000),
    },
    {
      userId: volunteerUsers[1].id,
      action: 'RESCUE_COMPLETED',
      description: 'Completed rescue SR-2417 (Common Krait)',
      createdAt: new Date(Date.now() - 41 * 60 * 1000),
    },
    {
      userId: volunteerUsers[2].id,
      action: 'RESCUE_COMPLETED',
      description: 'Released Checkered Keelback into Begnas wetland',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      action: 'USER_VERIFIED',
      description: 'Verified volunteer status for Bikash Thapa',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      userId: volunteerUsers[0].id,
      action: 'RESCUE_ASSIGNED',
      description: 'SR-2418 escalated to EMERGENCY by dispatch',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      userId: volunteerUsers[0].id,
      action: 'RESCUE_ASSIGNED',
      description: 'Bikash Thapa marked en-route to Kalimati',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      userId: citizenUsers[0].id,
      action: 'RESCUE_COMPLETED',
      description: 'AI identified Common Krait at 94% confidence',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      userId: volunteerUsers[2].id,
      action: 'RESCUE_COMPLETED',
      description: 'SR-2412 completed — rat snake released in buffer zone',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      action: 'USER_VERIFIED',
      description: 'Terai Snake Rescue verified by super admin',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      userId: volunteerUsers[4].id,
      action: 'VOLUNTEER_APPLICATION',
      description: 'Volunteer application from Nisha Poudel received',
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      action: 'ROLE_UPDATED',
      description: 'Role updated for Anjali Rai to VERIFIED_RESCUER',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      userId: citizenUsers[3].id,
      action: 'RESCUE_ASSIGNED',
      description: "Russell's viper reported inside a school kitchen in Bharatpur",
      createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
    },
    {
      userId: volunteerUsers[4].id,
      action: 'TRAINING_COMPLETED',
      description: 'Nisha Poudel completed level-2 certification',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      userId: citizenUsers[2].id,
      action: 'DONATION_RECEIVED',
      description: 'NPR 24,000 donation received',
      createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
    },
  ];

  for (const log of activityLogs) {
    await prisma.activityLog.create({ data: log });
  }
  console.log(`  ✓ Created ${activityLogs.length} activity logs`);

  // ===== SUMMARY =====
  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Database Summary:');
  console.log(`  • ${allUsers.length} users created`);
  console.log(`  • ${species.length} snake species`);
  console.log(`  • ${volunteerProfiles.length} volunteer profiles`);
  console.log(`  • ${rescues.length} rescue requests`);
  console.log(`  • ${donations.length} donations`);
  console.log(`  • ${activityLogs.length} activity logs`);
  console.log('\n🔐 Test credentials (all passwords: password123):');
  console.log('  • admin@snakerescue.com (ADMIN)');
  console.log('  • bikash.thapa@snakerescue.com (VERIFIED_RESCUER)');
  console.log('  • anjali.rai@snakerescue.com (VERIFIED_RESCUER)');
  console.log('  • sunita.maharjan@example.com (CITIZEN)');
  console.log('\n🎯 Dashboard Testing:');
  console.log('  • Admin dashboard: Login as admin@snakerescue.com');
  console.log('  • Rescuer dashboard: Login as bikash.thapa@snakerescue.com (412 rescues completed)');
  console.log('  • Citizen dashboard: Login as sunita.maharjan@example.com (1 active rescue request)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
