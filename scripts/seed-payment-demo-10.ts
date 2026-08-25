import { prisma } from '../libs/database/src/client.js';

const COUNT = 10;
const AMOUNTS = [
  '2150.00',
  '2280.00',
  '2395.00',
  '2475.00',
  '2560.00',
  '2640.00',
  '2735.00',
  '2810.00',
  '2925.00',
  '3000.00',
];

async function main() {
  const rescuers = await prisma.volunteer.findMany({
    where: { status: 'VERIFIED' },
    orderBy: { createdAt: 'asc' },
    take: COUNT,
  });
  const citizens = await prisma.user.findMany({
    where: { role: 'CITIZEN' },
    orderBy: { createdAt: 'asc' },
    take: COUNT,
  });
  if (rescuers.length < COUNT)
    throw new Error(
      `Need ${COUNT} verified rescuers, found ${rescuers.length}`,
    );
  if (!citizens.length)
    throw new Error('No citizen users exist. Run the database seed first.');

  for (let index = 0; index < COUNT; index += 1) {
    const number = String(index + 1).padStart(2, '0');
    const amount = AMOUNTS[index];
    const commissionRate = index % 2 === 0 ? 10 : 20;
    const commissionAmount = ((Number(amount) * commissionRate) / 100).toFixed(
      2,
    );
    const rescuerAmount = (Number(amount) - Number(commissionAmount)).toFixed(
      2,
    );
    const rescuer = rescuers[index];
    const citizen = citizens[index % citizens.length];
    const paymentReference = `demo_rescue_payment_${number}`;
    const rescue = await prisma.rescueRequest.upsert({
      where: { referenceNumber: `PAYMENT-DEMO-${number}` },
      create: {
        referenceNumber: `PAYMENT-DEMO-${number}`,
        userId: citizen.id,
        name: citizen.name,
        phone: citizen.phone || '+9779800000000',
        email: citizen.email,
        municipality: 'Butwal',
        ward: index + 1,
        address: `Payment demo lane ${index + 1}`,
        snakeDescription: 'Development payment demonstration rescue',
        snakeSize: 'Medium (1-3ft)',
        snakeColor: 'Brown',
        status: 'COMPLETED',
        stillPresent: false,
        isEmergency: false,
        hasBite: false,
        assignedTo: rescuer.id,
        completedAt: new Date(),
        source: 'WEB',
      },
      update: {
        status: 'COMPLETED',
        assignedTo: rescuer.id,
        userId: citizen.id,
      },
    });
    const charge = await prisma.rescueCharge.upsert({
      where: { rescueId: rescue.id },
      create: {
        rescueId: rescue.id,
        rescuerId: rescuer.id,
        currency: 'NPR',
        grossAmount: amount,
        platformCommissionRate: commissionRate,
        platformCommissionAmount: commissionAmount,
        rescuerAmount,
        netAmount: amount,
        status: 'PAID',
        finalizedAt: new Date(),
      },
      update: {
        status: 'PAID',
        rescuerId: rescuer.id,
        platformCommissionRate: commissionRate,
        platformCommissionAmount: commissionAmount,
        rescuerAmount,
        grossAmount: amount,
        netAmount: amount,
        finalizedAt: new Date(),
      },
    });
    const transaction = await prisma.financialTransaction.upsert({
      where: { rescueChargeId: charge.id },
      create: {
        type: 'RESCUE_CHARGE',
        status: 'PAID',
        currency: 'NPR',
        rescueChargeId: charge.id,
        provider: 'STRIPE',
        externalReference: paymentReference,
        idempotencyKey: `demo-transaction:${number}`,
        grossAmount: amount,
        platformCommissionAmount: commissionAmount,
        rescuerAmount,
        netAmount: amount,
        finalizedAt: new Date(),
      },
      update: {
        status: 'PAID',
        grossAmount: amount,
        platformCommissionAmount: commissionAmount,
        rescuerAmount,
        netAmount: amount,
        externalReference: paymentReference,
        finalizedAt: new Date(),
      },
    });
    await prisma.paymentIntent.upsert({
      where: { idempotencyKey: `demo-payment:${number}-npr` },
      create: {
        rescueChargeId: charge.id,
        provider: 'STRIPE',
        amount,
        currency: 'NPR',
        status: 'SUCCEEDED',
        providerReference: paymentReference,
        idempotencyKey: `demo-payment:${number}-npr`,
      },
      update: {
        status: 'SUCCEEDED',
        amount,
        providerReference: paymentReference,
      },
    });
    const settlement = await prisma.settlement.upsert({
      where: { rescueChargeId: charge.id },
      create: {
        transactionId: transaction.id,
        rescueChargeId: charge.id,
        rescuerId: rescuer.id,
        amount: rescuerAmount,
        currency: 'NPR',
        status: 'ELIGIBLE',
        eligibleAt: new Date(),
      },
      update: {
        status: 'ELIGIBLE',
        amount: rescuerAmount,
        rescuerId: rescuer.id,
        eligibleAt: new Date(),
      },
    });
    await prisma.payout.upsert({
      where: { idempotencyKey: `demo-payout:${number}-npr` },
      create: {
        settlementId: settlement.id,
        rescuerId: rescuer.id,
        amount: rescuerAmount,
        currency: 'NPR',
        status: 'PENDING',
        paymentMethod: 'BANK_TRANSFER',
        idempotencyKey: `demo-payout:${number}-npr`,
      },
      update: {
        status: 'PENDING',
        amount: rescuerAmount,
        settlementId: settlement.id,
        rescuerId: rescuer.id,
      },
    });
  }
  console.log(
    JSON.stringify(
      {
        transactionCount: COUNT,
        amountRange: 'NPR 2,000 - NPR 3,000',
        total: `NPR ${AMOUNTS.reduce((total, value) => total + Number(value), 0).toLocaleString()}`,
        rescuers: rescuers.map(({ id, name }, index) => ({
          id,
          name,
          amount: `NPR ${AMOUNTS[index]}`,
          commissionRate: `${index % 2 === 0 ? 10 : 20}%`,
        })),
      },
      null,
      2,
    ),
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
