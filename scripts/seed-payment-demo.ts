import { prisma } from '../libs/database/src/client.js';

const DEMO_REFERENCE = 'PAYMENT-DEMO-10';
const DEMO_PAYMENT_REFERENCE = 'demo_session_10_npr';

async function main() {
  const citizen = await prisma.user.findFirst({
    where: { role: 'CITIZEN' },
    orderBy: { createdAt: 'asc' },
  });
  const rescuer = await prisma.volunteer.findFirst({
    where: { status: 'VERIFIED' },
    orderBy: { createdAt: 'asc' },
  });

  if (!citizen)
    throw new Error('No citizen user exists. Run the database seed first.');
  if (!rescuer)
    throw new Error('No verified rescuer exists. Run the database seed first.');

  const rescue = await prisma.rescueRequest.upsert({
    where: { referenceNumber: DEMO_REFERENCE },
    create: {
      referenceNumber: DEMO_REFERENCE,
      userId: citizen.id,
      name: citizen.name,
      phone: citizen.phone || '+9779800000000',
      email: citizen.email,
      municipality: 'Butwal',
      ward: 8,
      address: 'Payment demo lane',
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
    update: { status: 'COMPLETED', assignedTo: rescuer.id, userId: citizen.id },
  });

  const charge = await prisma.rescueCharge.upsert({
    where: { rescueId: rescue.id },
    create: {
      rescueId: rescue.id,
      rescuerId: rescuer.id,
      currency: 'NPR',
      grossAmount: '10.00',
      platformCommissionRate: '0',
      platformCommissionAmount: '0',
      rescuerAmount: '10.00',
      netAmount: '10.00',
      status: 'PAID',
      finalizedAt: new Date(),
    },
    update: { status: 'PAID', rescuerId: rescuer.id, finalizedAt: new Date() },
  });

  const transaction = await prisma.financialTransaction.upsert({
    where: { rescueChargeId: charge.id },
    create: {
      type: 'RESCUE_CHARGE',
      status: 'PAID',
      currency: 'NPR',
      rescueChargeId: charge.id,
      provider: 'STRIPE',
      externalReference: DEMO_PAYMENT_REFERENCE,
      idempotencyKey: 'demo-transaction:10-npr',
      grossAmount: '10.00',
      platformCommissionAmount: '0',
      rescuerAmount: '10.00',
      netAmount: '10.00',
      finalizedAt: new Date(),
    },
    update: {
      status: 'PAID',
      externalReference: DEMO_PAYMENT_REFERENCE,
      finalizedAt: new Date(),
    },
  });

  await prisma.paymentIntent.upsert({
    where: { idempotencyKey: 'demo-payment:10-npr' },
    create: {
      rescueChargeId: charge.id,
      provider: 'STRIPE',
      amount: '10.00',
      currency: 'NPR',
      status: 'SUCCEEDED',
      providerReference: DEMO_PAYMENT_REFERENCE,
      idempotencyKey: 'demo-payment:10-npr',
    },
    update: { status: 'SUCCEEDED', providerReference: DEMO_PAYMENT_REFERENCE },
  });

  const settlement = await prisma.settlement.upsert({
    where: { rescueChargeId: charge.id },
    create: {
      transactionId: transaction.id,
      rescueChargeId: charge.id,
      rescuerId: rescuer.id,
      amount: '10.00',
      currency: 'NPR',
      status: 'ELIGIBLE',
      eligibleAt: new Date(),
    },
    update: { status: 'ELIGIBLE', eligibleAt: new Date() },
  });

  const payout = await prisma.payout.upsert({
    where: { idempotencyKey: 'demo-payout:10-npr' },
    create: {
      settlementId: settlement.id,
      rescuerId: rescuer.id,
      amount: '10.00',
      currency: 'NPR',
      status: 'PENDING',
      paymentMethod: 'BANK_TRANSFER',
      idempotencyKey: 'demo-payout:10-npr',
    },
    update: { status: 'PENDING', settlementId: settlement.id },
  });

  console.log(
    JSON.stringify(
      {
        citizenEmail: citizen.email,
        rescueReference: rescue.referenceNumber,
        rescueId: rescue.id,
        paymentIntentId: (
          await prisma.paymentIntent.findUnique({
            where: { idempotencyKey: 'demo-payment:10-npr' },
          })
        )?.id,
        settlementId: settlement.id,
        payoutId: payout.id,
        amount: 'NPR 10.00',
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
