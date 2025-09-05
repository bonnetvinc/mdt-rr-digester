'use client';

import { FlagIcon, GaugeCircleIcon, MountainSnowIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Button } from '~/components/ui/button';
import { metersToKm } from '~/lib/convertKm';
import { convertRaceTimestamp, formatTimeHMS } from '~/lib/formatTime';
import { api } from '~/trpc/react';

type Params = Promise<{ id: string }>;

export default function Page({ params }: { params: Params }) {
  const { id } = use(params);
  const router = useRouter();
  const idNumber = Number(id);

  const { data: participant, isLoading } = api.participantResults.getParticipantResult.useQuery(idNumber, {
    enabled: !isNaN(idNumber)
  });

  if (isNaN(idNumber)) return <div>ID manquant</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!participant) return <div>Participant non trouvé</div>;

  const finishedLaps = participant.laps.filter(l => l.endTimestamp != null);
  const currentLap = participant.laps.find(l => l.endTimestamp == null);

  const { totalPoints, totalDistance, totalElevation } = computeTotals(participant);

  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-lg bg-gray-900 p-4 text-white shadow-md">
      <ParticipantInfo
        participant={participant}
        finishedLaps={finishedLaps}
        totalPoints={totalPoints}
        totalDistance={totalDistance}
        totalElevation={totalElevation}
      />

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Tours finis</h3>
        {finishedLaps.map((lap, idx) => (
          <LapCard key={lap.id} lap={lap} index={idx} />
        ))}
      </div>

      {currentLap && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Tour en cours</h3>
          <CurrentLapCard lap={currentLap} index={finishedLaps.length} raceStart="2025-08-24T12:00:00" />
        </div>
      )}

      <Button onClick={() => router.back()} className="mb-4 bg-blue-400">
        Retour
      </Button>
    </div>
  );
}

/* ------------------- Subcomponents ------------------- */

function ParticipantInfo({
  participant,
  finishedLaps,
  totalPoints,
  totalDistance,
  totalElevation
}: {
  participant: any;
  finishedLaps: any[];
  totalPoints: number;
  totalDistance: number;
  totalElevation: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-bold text-xl">
          {participant.name} (#{participant.bib})
        </h2>
        <p className="text-gray-400">{participant.team}</p>
        <p className="text-gray-400 italic">{participant.contest}</p>
      </div>
      <div className="space-y-1 text-right">
        <InfoLine icon={<FlagIcon className="h-5 w-5 text-red-400" />} text={`${finishedLaps.length} Tours finis`} />
        <InfoLine
          icon={<GaugeCircleIcon className="h-5 w-5 text-orange-400" />}
          text={`${metersToKm(totalDistance)} km`}
        />
        <InfoLine icon={<MountainSnowIcon className="h-5 w-5 text-green-400" />} text={`${totalElevation} m`} />
        <div className="flex items-center gap-2 font-bold text-lg">Total Points: {totalPoints}</div>
      </div>
    </div>
  );
}

function InfoLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function LapCard({ lap, index }: { lap: any; index: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-gray-800 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full justify-between sm:w-auto sm:justify-start sm:gap-4">
        <span className="font-bold">Tour {index + 1}</span>
        <span className="text-gray-300 text-sm">{formatTimeHMS(lap.endTimestamp! - lap.startTimestamp)}</span>
      </div>

      <EventBadges events={lap.events} />
    </div>
  );
}

function CurrentLapCard({ lap, index, raceStart }: { lap: any; index: number; raceStart: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-yellow-800 p-2">
      <span>Tour {index + 1}</span>
      <span>{lap.startTimestamp ? convertRaceTimestamp(raceStart, lap.startTimestamp) : '--:--'}</span>
      <EventBadges events={lap.events} />
    </div>
  );
}

function EventBadges({ events }: { events: any[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {events.map(e => (
        <div
          key={e.id}
          className="rounded bg-blue-400 px-2 py-1 font-bold text-black text-xs"
          title={`${e.segment.name}: ${e.segment.points} pts`}
        >
          {e.segment.name} {e.segment.points > 0 && `${e.segment.points}pts`}
        </div>
      ))}
    </div>
  );
}

/* ------------------- Helpers ------------------- */

function computeTotals(participant: any) {
  const lapSums = participant.laps
    .filter((l: any) => l.endTimestamp != null)
    .map((lap: any) =>
      lap.events.reduce(
        (acc: any, e: any) => ({
          points: acc.points + (e.segment.points ?? 0),
          distance: acc.distance + (e.segment.distance ?? 0),
          elevation: acc.elevation + (e.segment.elevation ?? 0)
        }),
        { points: 0, distance: 0, elevation: 0 }
      )
    );

  return {
    totalPoints: lapSums.reduce((acc: number, l: any) => acc + l.points, 0),
    totalDistance: lapSums.reduce((acc: number, l: any) => acc + l.distance, 0),
    totalElevation: lapSums.reduce((acc: number, l: any) => acc + l.elevation, 0)
  };
}
