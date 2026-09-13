const { PrismaClient } = require('@snake-rescue/database');
const prisma = new PrismaClient();

async function checkData() {
  const hospitals = await prisma.hospital.count({
    where: {
      status: 'ACTIVE',
      snakebiteTreatmentAvailable: true
    }
  });
  
  const rescuers = await prisma.volunteer.count({
    where: {
      status: 'VERIFIED',
    }
  });
  
  console.log('Active hospitals with snakebite treatment:', hospitals);
  console.log('Verified rescuers:', rescuers);
  
  await prisma.$disconnect();
}

checkData();
