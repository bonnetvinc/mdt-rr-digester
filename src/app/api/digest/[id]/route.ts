import { NextResponse, type NextRequest } from 'next/server';
import { db } from '~/server/db';
import type { RawPassingInput } from '~/types/race-result-output';


type CustomRawPassingInput = {
    bib: number;
    transponder?: string;
    timestamp: number;
    borne: string;
};

function convertToCustomRawPassingInput(input: RawPassingInput): CustomRawPassingInput {
    return {
        bib: input.Bib,
        transponder: input.Passing.Transponder,
        timestamp: new Date(input.Passing.UTCTime).getTime(),
        borne: input.TimingPoint,
    };
}


async function computeUserLap(input: RawPassingInput) {

    const convertedInput = convertToCustomRawPassingInput(input);

    // find or create racer
    const participant = await db.participant.upsert({
        where: { bib: convertedInput.bib },
        create: { bib: convertedInput.bib },
        update: {},
    });

    if (convertedInput.borne === 'FINISH' || convertedInput.borne === 'START') {

        // If the participant is already on a lap, we must close it
        const openLap = await db.lap.findFirst({
            where: {
                participantId: participant.id,
                endTimestamp: null,
            },
        });

        if (openLap) {
            await db.lap.update({
                where: { id: openLap.id },
                data: { endTimestamp: new Date(convertedInput.timestamp) },
            });
        }

        // Create a new Lap
        const lap = await db.lap.create({
            data: {
                participantId: participant.id,
                startTimestamp: new Date(convertedInput.timestamp),
                endTimestamp: null,
            },
        });
    }



}


export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RawPassingInput;
        console.log('📩 Received data:', body);
        await computeUserLap(body);
        return NextResponse.json({ status: 'ok' });
    } catch (err) {
        console.error('❌ Error while saving:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

