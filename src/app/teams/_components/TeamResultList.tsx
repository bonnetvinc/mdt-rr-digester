'use client';

import ResultCard from '~/app/_components/ResultCard';
import { api } from '~/trpc/react';

function IndividualResultList() {
  const { data, isLoading } = api.participantResults.getParticipantsResults.useQuery(undefined, {
    refetchInterval: 5000
  });

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des résultats...</div>;
  }

  const sortedData = data?.sort((a, b) => {
    const aFinishedLaps = a.laps.filter(lap => lap.endTimestamp !== null).length;
    const bFinishedLaps = b.laps.filter(lap => lap.endTimestamp !== null).length;
    return bFinishedLaps - aFinishedLaps;
  });

  return (
    <div className="mx-auto w-full space-y-4 p-4">
      {sortedData?.map((participant, index) => {
        const finishedLapsList = participant.laps.filter(lap => lap.endTimestamp !== null);
        const finishedLaps = finishedLapsList.length;
        // Dernier tour fini (le plus récent)
        const lastFinishedLap = finishedLapsList.reduce(
          (latest, lap) => {
            if (!latest) return lap;
            if (lap.endTimestamp && latest.endTimestamp && new Date(lap.endTimestamp) > new Date(latest.endTimestamp)) {
              return lap;
            }
            return latest;
          },
          undefined as (typeof finishedLapsList)[0] | undefined
        );

        return (
          <ResultCard
            key={participant.id}
            id={participant.id}
            position={index + 1}
            finishedLaps={finishedLaps}
            participantBib={participant.bib}
            teamName={participant.name ?? ''}
            totalDistance={0}
            totalElevation={0}
            totalPoints={0}
            lastLap={{
              timestamp: 111,
              bonuses:
                lastFinishedLap?.segments.map(segment => ({
                  id: segment.id,
                  label: segment.name,
                  points: segment.points
                })) ?? []
            }}
          />
        );
      })}
    </div>
  );
}

export default IndividualResultList;
