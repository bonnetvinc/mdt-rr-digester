'use client';

import ResultCard from '~/app/results/_components/ResultCard';
import { api } from '~/trpc/react';

function IndividualResultList() {
  const { data, isLoading } = api.participantResults.getSortedParticipantsResults.useQuery(undefined, {
    refetchInterval: 5000
  });

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des résultats...</div>;
  }

  return (
    <div className="mx-auto w-full space-y-1 p-2">
      {data?.map((participant, index) => {
        // Laps finis
        const finishedLapsList = participant.laps.filter(lap => lap.endTimestamp != null);
        const finishedLaps = finishedLapsList.length;

        // Dernier tour fini
        const lastFinishedLap = participant.laps
          .filter(l => l.endTimestamp != null)
          .reduce(
            (latest, lap) => (!latest || lap.endTimestamp! > latest.endTimestamp! ? lap : latest),
            undefined as (typeof participant.laps)[0] | undefined
          );

        // Tour en cours
        const currentLap = participant.laps.find(l => l.endTimestamp == null);

        const mapLap = (lap?: typeof lastFinishedLap, isCurrent = false) => ({
          starttime: lap?.startTimestamp ?? 0,
          endtime: isCurrent ? undefined : (lap?.endTimestamp ?? 0),
          segments:
            lap?.events?.map(e => ({
              equipmentId: e.segment?.equipmentId ?? '',
              label: e.segment?.name ?? '',
              points: e.segment?.points ?? 0
            })) ?? []
        });

        // Données prêtes pour UI
        const lastLapData = mapLap(lastFinishedLap);
        const currentLapData = mapLap(currentLap, true);

        return (
          <ResultCard
            key={participant.id}
            id={participant.id}
            position={index + 1}
            finishedLaps={finishedLaps}
            participantBib={participant.bib}
            teamName={participant.name ?? ''}
            totalDistance={participant.totalDistance}
            totalElevation={participant.totalElevation}
            totalPoints={participant.totalPoints}
            lastLap={lastLapData}
            currentLap={currentLapData}
          />
        );
      })}
    </div>
  );
}

export default IndividualResultList;
