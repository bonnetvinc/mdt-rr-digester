'use client';
import { FlagIcon, GaugeCircleIcon, MountainSnowIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { use } from 'react';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

interface PageProps {
  id: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function Page({ params }: { params: Promise<PageProps> }) {
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

  const totalPoints = participant.laps.reduce((acc, lap) => {
    return acc + lap.events.reduce((sum, e) => sum + (e.segment.points ?? 0), 0);
  }, 0);

  const totalDistance = participant.laps.reduce((acc, lap) => {
    return acc + lap.events.reduce((sum, e) => sum + (e.segment.distance ?? 0), 0);
  }, 0);

  const totalElevation = participant.laps.reduce((acc, lap) => {
    return acc + lap.events.reduce((sum, e) => sum + (e.segment.elevation ?? 0), 0);
  }, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-lg bg-gray-900 p-4 text-white shadow-md">
      {/* Participant Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl">
            {participant.name} (#{participant.bib})
          </h2>
          <p className="text-gray-400">{participant.team}</p>
          <p className="text-gray-400 italic">{participant.contest}</p>
        </div>
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5 text-red-400" />
            <span>{finishedLaps.length} Tours finis</span>
          </div>
          <div className="flex items-center gap-2">
            <GaugeCircleIcon className="h-5 w-5 text-orange-400" />
            <span>{totalDistance} m</span>
          </div>
          <div className="flex items-center gap-2">
            <MountainSnowIcon className="h-5 w-5 text-green-400" />
            <span>{totalElevation} m</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-lg">Total Points: {totalPoints}</div>
        </div>
      </div>

      {/* Finished Laps */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Tours finis</h3>
        {finishedLaps.map((lap, idx) => (
          <div key={lap.id} className="flex items-center justify-between rounded-md bg-gray-800 p-2">
            <span>Tour {idx + 1}</span>
            <span>{formatTime(lap.endTimestamp! - lap.startTimestamp)}</span>
            <div className="flex gap-2">
              {lap.events.map(e => (
                <div
                  key={e.id}
                  className={`rounded px-2 py-1 font-bold text-white text-xs`}
                  style={{ backgroundColor: e.segment.color }}
                  title={`${e.segment.name}: ${e.segment.points} pts`}
                >
                  {e.segment.points} pts
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Current Lap */}
      {currentLap && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Tour en cours</h3>
          <div className="flex items-center justify-between rounded-md bg-yellow-800 p-2">
            <span>Tour {finishedLaps.length + 1}</span>
            <span>
              {currentLap.startTimestamp ? formatTime(Date.now() / 1000 - currentLap.startTimestamp) : '--:--'}
            </span>
            <div className="flex gap-2">
              {currentLap.events.map(e => (
                <div
                  key={e.id}
                  className={`rounded px-2 py-1 font-bold text-white text-xs`}
                  style={{ backgroundColor: e.segment.color }}
                  title={`${e.segment.name}: ${e.segment.points} pts`}
                >
                  {e.segment.points} pts
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Button onClick={() => router.back()} className="mb-4">
        Retour
      </Button>
    </div>
  );
}

export default Page;
