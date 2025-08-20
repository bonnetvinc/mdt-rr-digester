import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Reset the DB
  // await prisma.lap.deleteMany();
  // await prisma.participant.deleteMany();
  // await prisma.team.deleteMany();
  // await prisma.segment.deleteMany();
  // await prisma.equipment.deleteMany();

  // Crée les équipements prédéfinis
  const equipmentNames = ['BONUS 1', 'BONUS 2', 'BONUS 3', 'BONUS 4'];


  // Crée des segments prédéfinis
  await prisma.segment.createMany({
    data: [
      { name: 'Start', equipmentId: 'START', points: 0 },
      { name: 'Finish', equipmentId: 'FINISH', points: 5 },
      { name: 'Rockgarden Master', equipmentId: 'BONUS 1', points: 5 },
      { name: 'Dual Sprint', equipmentId: 'BONUS 2', points: 3 },
      { name: 'Expert', equipmentId: 'BONUS 3', points: 3 },
      { name: 'One or Two', equipmentId: 'BONUS 4', points: 2 }
    ],
    skipDuplicates: true
  });

  const segments = await prisma.segment.findMany();

  // Crée deux équipes
  const teamA = await prisma.team.create({
    data: {
      name: 'Team A',
      transponder: 1111
    }
  });

  const teamB = await prisma.team.create({
    data: {
      name: 'Team B',
      transponder: 2222
    }
  });

  // Crée les participants
  const [alice, bob, charlie, diana] = await Promise.all([
    prisma.participant.create({
      data: { bib: 101, name: 'Alice', teamId: teamA.id }
    }),
    prisma.participant.create({
      data: { bib: 102, name: 'Bob', teamId: teamA.id }
    }),
    prisma.participant.create({
      data: { bib: 201, name: 'Charlie', teamId: teamB.id }
    }),
    prisma.participant.create({
      data: { bib: 202, name: 'Diana', teamId: teamB.id }
    })
  ]);

  // Crée un lap pour chaque participant
  const laps = await Promise.all([
    prisma.lap.create({
      data: {
        participantId: alice.id,
        startTimestamp: 1,
        endTimestamp: 4,
        segments: {
          connect: [{ id: segments[0]?.id }, { id: segments[1]?.id }]
        }
      }
    }),
    prisma.lap.create({
      data: {
        participantId: bob.id,
        startTimestamp: 4,
        endTimestamp: 8,
        segments: {
          connect: [{ id: segments[0]?.id }, { id: segments[1]?.id }, { id: segments[2]?.id }]
        }
      }
    }),
    prisma.lap.create({
      data: {
        participantId: charlie.id,
        startTimestamp: 8,
        endTimestamp: 67,
        segments: {
          connect: [{ id: segments[0]?.id }, { id: segments[1]?.id }]
        }
      }
    }),
    prisma.lap.create({
      data: {
        participantId: diana.id,
        startTimestamp: 1,
        endTimestamp: 44,
        segments: {
          connect: [{ id: segments[0]?.id }, { id: segments[1]?.id }]
        }
      }
    })
  ]);

  console.log('✅ Seed completed');
}

main()
  .catch(e => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
