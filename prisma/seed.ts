import { PrismaClient, SegmentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // // Reset the DB
  // await prisma.lapEvent.deleteMany();
  // await prisma.lap.deleteMany();
  // await prisma.participant.deleteMany();
  // await prisma.team.deleteMany();
  // await prisma.segment.deleteMany();
  // await prisma.equipment.deleteMany();

  // Crée les équipements prédéfinis
  const equipmentNames = ['START', 'FINISH', 'BONUS 1', 'BONUS 2', 'BONUS 3', 'BONUS 4'];

  await Promise.all(
    equipmentNames.map(name =>
      prisma.equipment.upsert({
        where: { id: name },
        update: {}, // rien à mettre à jour
        create: { id: name }
      })
    )
  );
  // Crée des segments prédéfinis
  await prisma.segment.createMany({
    data: [
      { name: 'Start', equipmentId: 'START', type: SegmentType.START, points: 0, distance: 0, elevation: 0 },
      { name: 'Finish', equipmentId: 'FINISH', type: SegmentType.FINISH, points: 5, distance: 100, elevation: 10 },
      {
        name: 'Rockgarden Master',
        equipmentId: 'BONUS 1',
        type: SegmentType.BONUS,
        points: 5,
        distance: 200,
        elevation: 20
      },
      { name: 'Dual Sprint', equipmentId: 'BONUS 2', type: SegmentType.BONUS, points: 3, distance: 150, elevation: 15 },
      { name: 'Expert', equipmentId: 'BONUS 3', type: SegmentType.BONUS, points: 3, distance: 250, elevation: 25 },
      { name: 'Two', equipmentId: 'BONUS 4', type: SegmentType.BONUS, points: 2, distance: 300, elevation: 30 }
    ],
    skipDuplicates: true
  });

  const segments = await prisma.segment.findMany();

  // Crée les participants
  const [alice, bob, charlie, diana] = await Promise.all([
    prisma.participant.upsert({
      where: { bib: 101 },
      update: {},
      create: { bib: 101, name: 'Alice', team: 'les A', contest: 'Contest 1' }
    }),
    prisma.participant.upsert({
      where: { bib: 102 },
      update: {},
      create: { bib: 102, name: 'Bob', team: 'les B', contest: 'Contest 1' }
    }),
    prisma.participant.upsert({
      where: { bib: 201 },
      update: {},
      create: { bib: 201, name: 'Charlie', team: 'les B', contest: 'Contest 1' }
    }),
    prisma.participant.upsert({
      where: { bib: 202 },
      update: {},
      create: { bib: 202, name: 'Diana', team: 'les B', contest: 'Contest 2' }
    })
  ]);

  // Crée un lap pour chaque participant
  // Création de laps et événements associés
  const now = Date.now() / 1000; // timestamp en secondes

  // Alice : START → BONUS 1 → FINISH
  const lapAlice = await prisma.lap.create({
    data: {
      startTimestamp: now,
      endTimestamp: now + 600, // 10 min plus tard
      participantId: alice.id,
      events: {
        create: [{ segmentId: segments.find(s => s.name === 'Rockgarden Master')!.id, timestamp: now + 300 }]
      }
    }
  });

  // Bob : START → FINISH
  const lapBob = await prisma.lap.create({
    data: {
      startTimestamp: now + 100,
      endTimestamp: now + 700,
      participantId: bob.id
    }
  });

  // Charlie : 2 tours, avec BONUS 2 et BONUS 3
  const lapCharlie1 = await prisma.lap.create({
    data: {
      startTimestamp: now + 200,
      endTimestamp: now + 800,
      participantId: charlie.id,
      events: {
        create: [{ segmentId: segments.find(s => s.name === 'Dual Sprint')!.id, timestamp: now + 400 }]
      }
    }
  });

  const lapCharlie2 = await prisma.lap.create({
    data: {
      startTimestamp: now + 900,
      endTimestamp: now + 1500,
      participantId: charlie.id,
      events: {
        create: [{ segmentId: segments.find(s => s.name === 'Expert')!.id, timestamp: now + 1100 }]
      }
    }
  });

  // Diana : START → BONUS 4 → BONUS 1 → FINISH
  const lapDiana = await prisma.lap.create({
    data: {
      startTimestamp: now + 300,
      endTimestamp: now + 1000,
      participantId: diana.id,
      events: {
        create: [
          { segmentId: segments.find(s => s.name === 'Two')!.id, timestamp: now + 500 },
          { segmentId: segments.find(s => s.name === 'Rockgarden Master')!.id, timestamp: now + 700 }
        ]
      }
    }
  });

  // Alice : START → BONUS 1 → FINISH
  const lapAliceOuvert = await prisma.lap.create({
    data: {
      startTimestamp: now,
      participantId: alice.id,
      events: {
        create: [{ segmentId: segments.find(s => s.name === 'Rockgarden Master')!.id, timestamp: now + 300 }]
      }
    }
  });

  // Bob : START → FINISH
  const lapBobOuvert = await prisma.lap.create({
    data: {
      startTimestamp: now + 100,
      participantId: bob.id
    }
  });

  const lapCharlieOouvert = await prisma.lap.create({
    data: {
      startTimestamp: now + 900,
      participantId: charlie.id,
      events: {
        create: [{ segmentId: segments.find(s => s.name === 'Expert')!.id, timestamp: now + 1100 }]
      }
    }
  });

  // Diana : START → BONUS 4 → BONUS 1 → FINISH
  const lapDianaOuvert = await prisma.lap.create({
    data: {
      startTimestamp: now + 300,
      participantId: diana.id,
      events: {
        create: [
          { segmentId: segments.find(s => s.name === 'Two')!.id, timestamp: now + 500 },
          { segmentId: segments.find(s => s.name === 'Rockgarden Master')!.id, timestamp: now + 700 }
        ]
      }
    }
  });

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
