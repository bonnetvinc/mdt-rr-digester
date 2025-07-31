import { Equipment, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
    // Reset the DB
    await prisma.lapEvent.deleteMany();
    await prisma.lap.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.team.deleteMany();
    await prisma.bonus.deleteMany();

    // Crée des bonus prédéfinis
    await prisma.bonus.createMany({
        data: [
            { name: 'Start', equipment: Equipment.START, points: 0 },
            { name: 'Finish', equipment: Equipment.FINISH, points: 5 },
            { name: 'Rockgarden Master', equipment: Equipment.ROCKGARDEN, points: 5 },
            { name: 'Dual Sprint', equipment: Equipment.DUAL, points: 3 },
            { name: 'Expert', equipment: Equipment.EXPERT, points: 3 },
            { name: 'One or Two', equipment: Equipment.ONEORTWO, points: 2 },
        ],
        skipDuplicates: true,
    });

    const bonuses = await prisma.bonus.findMany();

    // Crée deux équipes
    const teamA = await prisma.team.create({
        data: {
            name: 'Team A',
            transponder: 1111,
        },
    });

    const teamB = await prisma.team.create({
        data: {
            name: 'Team B',
            transponder: 2222,
        },
    });

    // Crée les participants
    const [alice, bob, charlie, diana] = await Promise.all([
        prisma.participant.create({
            data: { bib: 101, name: 'Alice', teamId: teamA.id },
        }),
        prisma.participant.create({
            data: { bib: 102, name: 'Bob', teamId: teamA.id },
        }),
        prisma.participant.create({
            data: { bib: 201, name: 'Charlie', teamId: teamB.id },
        }),
        prisma.participant.create({
            data: { bib: 202, name: 'Diana', teamId: teamB.id },
        }),
    ]);

    // Crée un lap pour chaque participant
    const now = new Date();
    const laps = await Promise.all([
        prisma.lap.create({
            data: {
                participantId: alice.id,
                startTimestamp: now,
                endTimestamp: new Date(now.getTime() + 1000 * 60 * 30),
            },
        }),
        prisma.lap.create({
            data: {
                participantId: bob.id,
                startTimestamp: now,
                endTimestamp: new Date(now.getTime() + 1000 * 60 * 32),
            },
        }),
        prisma.lap.create({
            data: {
                participantId: charlie.id,
                startTimestamp: now,
                endTimestamp: new Date(now.getTime() + 1000 * 60 * 28),
            },
        }),
        prisma.lap.create({
            data: {
                participantId: diana.id,
                startTimestamp: now,
                endTimestamp: new Date(now.getTime() + 1000 * 60 * 31),
            },
        }),
    ]);

    // Crée des LapEvents avec des bonus
    await prisma.lapEvent.createMany({
        data: [
            {
                lapId: laps[0].id,
                equipment: Equipment.START,
                timestamp: now,
            },
            {
                lapId: laps[0].id,
                equipment: Equipment.ROCKGARDEN,
                timestamp: new Date(now.getTime() + 1000 * 60 * 10),
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                bonusId: bonuses.find(b => b.equipment === Equipment.ROCKGARDEN)?.id!,
            },
            {
                lapId: laps[0].id,
                equipment: Equipment.FINISH,
                timestamp: new Date(now.getTime() + 1000 * 60 * 30),
            },
            {
                lapId: laps[1].id,
                equipment: Equipment.START,
                timestamp: now,
            },
            {
                lapId: laps[1].id,
                equipment: Equipment.DUAL,
                timestamp: new Date(now.getTime() + 1000 * 60 * 12),
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                bonusId: bonuses.find(b => b.equipment === Equipment.DUAL)?.id!,
            },
        ],
    });

    console.log('✅ Seed completed');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
