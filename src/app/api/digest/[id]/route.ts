import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import type { RawPassingInput } from '~/types/race-result-output';

type CustomRawPassingInput = {
  bib: number;
  transponder?: string;
  timeinseconds: number; // Optional, if you want to store time in seconds
  borne: string;
};

const START_BORNE = 'START';
const FINISH_BORNE = 'FINISH';

function convertToCustomRawPassingInput(input: RawPassingInput): CustomRawPassingInput {
  return {
    bib: input.Bib,
    transponder: input.Passing.Transponder,
    timeinseconds: input.Time,
    borne: input.TimingPoint
  };
}

async function computeUserLap(input: RawPassingInput) {
  if (input.Invalid) {
    console.warn(`Ignoring invalid input for bib ${input.Bib}`);
    return;
  }

  const convertedInput = convertToCustomRawPassingInput(input);
  const isBoundary = convertedInput.borne === FINISH_BORNE || convertedInput.borne === START_BORNE;

  // find or create racer
  const participant = await db.participant.upsert({
    where: { bib: convertedInput.bib },
    create: { bib: convertedInput.bib },
    update: {}
  });

  if (isBoundary) {
    // If the participant is already on a lap, we must close it
    await createNewLap();
  } else {
    // If the participant is not at a start or finish point, we do nothing
    const segment = await db.segment.findFirst({
      where: { equipmentId: convertedInput.borne }
    });

    if (!segment) {
      console.warn(`No segment found for borne ${convertedInput.borne}`);
      return;
    }

    // Add the segment to the current lap
    const openLap = await db.lap.findFirst({
      where: {
        participantId: participant.id,
        endTimestamp: null // Only consider open laps
      }
    });

    if (!openLap) {
      console.warn(`No open lap found for participant ${participant.bib}`);
      return;
    }

    // Add the segment to the current lap
    await db.lap.update({
      where: { id: openLap.id },
      data: {
        segments: {
          connect: { id: segment.id }
        }
      }
    });

    console.log(`Segment ${segment.id} added to lap for participant ${participant.bib} `);
  }

  async function createNewLap() {
    const openLap = await db.lap.findFirst({
      where: {
        participantId: participant.id,
        endTimestamp: null
      }
    });

    if (openLap) {
      await db.lap.update({
        where: { id: openLap.id },
        data: { endTimestamp: convertedInput.timeinseconds }
      });
    }

    // Create a new Lap
    await db.lap.create({
      data: {
        participantId: participant.id,
        startTimestamp: convertedInput.timeinseconds,
        endTimestamp: null
      }
    });

    console.log(`Lap created for participant ${participant.bib}`);
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
