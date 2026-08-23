const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const pending = await p.rescueRequest.findMany({
    where: { status: 'PENDING' },
    select: { id: true, status: true, stillPresent: true, assignedTo: true, municipality: true }
  });
  console.log('PENDING rescues:', JSON.stringify(pending, null, 2));

  const queue = await p.rescueRequest.findMany({
    where: { status: 'PENDING', assignedTo: null, stillPresent: true },
    select: { id: true, status: true, stillPresent: true, assignedTo: true, municipality: true }
  });
  console.log('Queue eligible:', JSON.stringify(queue, null, 2));

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
