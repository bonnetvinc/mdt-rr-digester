import { SegmentType } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import type { RawPassingInput } from '~/types/race-result-output';

type CustomRawPassingInput = {
  bib: number;
  transponder?: string;
  timeinseconds: number;
  borne: string;
};

async function computeUserLap(input: RawPassingInput) {
  if (input.Invalid) {
    console.warn(`Ignoring invalid input for bib ${input.Bib}`);
    return;
  }

  const convertedInput: CustomRawPassingInput = {
    bib: input.Bib,
    transponder: input.Passing.Transponder,
    timeinseconds: input.Time,
    borne: input.TimingPoint
  };

  // Récupérer les bornes START et FINISH depuis la BD
  const boundarySegments = await db.segment.findMany({
    where: { type: { in: [SegmentType.START, SegmentType.FINISH] } },
    select: { equipmentId: true, type: true }
  });

  const startBorne = boundarySegments.find(s => s.type === SegmentType.START)?.equipmentId;
  const finishBorne = boundarySegments.find(s => s.type === SegmentType.FINISH)?.equipmentId;

  const isStartBoundary = convertedInput.borne === startBorne;
  const isFinishBoundary = convertedInput.borne === finishBorne;

  // find or create participant
  const participant = await db.participant.upsert({
    where: { bib: convertedInput.bib },
    create: { bib: convertedInput.bib },
    update: {}
  });

  // find segment
  const segment = await db.segment.findFirst({
    where: { equipmentId: convertedInput.borne }
  });

  if (!segment) {
    console.warn(`No segment found for borne ${convertedInput.borne}`);
    return;
  }

  // Check for an open lap
  let openLap = await db.lap.findFirst({
    where: { participantId: participant.id, endTimestamp: null }
  });

  if (isFinishBoundary) {
    if (openLap) {
      await db.lap.update({
        where: { id: openLap.id },
        data: { endTimestamp: convertedInput.timeinseconds }
      });

      await db.lapEvent.create({
        data: {
          lapId: openLap.id,
          segmentId: segment.id,
          timestamp: convertedInput.timeinseconds
        }
      });
    }
  } else if (isStartBoundary) {
     openLap = await db.lap.create({
      data: { participantId: participant.id, startTimestamp: convertedInput.timeinseconds }
    });
  }

  if (!isStartBoundary && !isFinishBoundary && openLap) {
    // For bonus segments only
    await db.lapEvent.create({
      data: {
        lapId: openLap.id,
        segmentId: segment.id,
        timestamp: convertedInput.timeinseconds
      }
    });

    console.log(`Segment ${segment.name} added to lap for participant ${participant.bib}`);
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
