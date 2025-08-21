'use client';

import { FlagTriangleRightIcon, GaugeCircleIcon, MountainSnowIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { api } from '~/trpc/react';
import PositionIcon from './PositionMarker';
import PositionMarker from './PositionMarker';
import SegmentLap from './SegmentLap';

function IndividualResultTable() {
  const { data, isLoading } = api.participantResults.getParticipantsResults.useQuery(undefined, {
    refetchInterval: 5000
  });

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des résultats...</div>;
  }

  // Calculer totalPoints pour chaque participant sans muter l'objet original
  const participantsWithStats = data?.map(participant => {
    const totals = participant.laps.reduce(
      (acc, lap) => {
        lap.events.forEach(event => {
          if (event.segment) {
            acc.points += event.segment.points || 0;
            acc.distance += event.segment.distance || 0;
            acc.elevation += event.segment.elevation || 0;
          }
        });
        return acc;
      },
      { points: 0, distance: 0, elevation: 0 }
    );

    return {
      ...participant,
      totalPoints: totals.points,
      totalDistance: totals.distance,
      totalElevation: totals.elevation
    };
  });

  // Trier les participants selon le nombre de points puis le nombre de tours finis (finishedLaps)
  const sortedData = participantsWithStats?.sort((a, b) => {
    const aFinishedLaps = a.laps.filter(lap => lap.endTimestamp !== null).length;
    const bFinishedLaps = b.laps.filter(lap => lap.endTimestamp !== null).length;
    return b.totalPoints - a.totalPoints || bFinishedLaps - aFinishedLaps;
  });

  console.info('Sorted participant data:', sortedData);

  return (
    <div className="mx-auto w-full space-y-1 p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Pos</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Numéro de dossard</TableHead>
            <TableHead>Dernier tour</TableHead>
            <TableHead>En cours</TableHead>
            <TableHead>Tours</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Elevation</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData?.map((participant, index) => {
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
              <TableRow key={participant.id}>
                <TableCell className="font-medium">
                  <PositionMarker position={index + 1} />
                </TableCell>
                <TableCell>{participant.name}</TableCell>

                <TableCell>{participant.bib}</TableCell>
                <TableCell>
                  <SegmentLap lap={lastLapData} lapNumber={finishedLaps} />
                </TableCell>
                <TableCell>
                  <SegmentLap lap={currentLapData} lapNumber={finishedLaps + 1} />
                </TableCell>

                <TableCell>
                  <span className="font-bold text-blue-500">{finishedLaps}</span>
                  <span>&nbsp;</span>
                  <FlagTriangleRightIcon className="inline h-4 w-4 text-blue-500" />
                </TableCell>
                <TableCell>
                  <span className="font-bold text-green-500">{participant.totalDistance}</span>
                  <span>&nbsp;</span>
                  <GaugeCircleIcon className="inline h-4 w-4 text-green-500" />
                </TableCell>
                <TableCell>
                  <span className="font-bold text-black-500">{participant.totalElevation}</span>
                  <span>&nbsp;</span>
                  <MountainSnowIcon className="inline h-4 w-4 text-black-500" />
                </TableCell>
                <TableCell className="rounded-lg border border-blue-500 px-2 py-1 text-right font-bold">
                  <span className="font-bold text-blue-500">{participant.totalPoints}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default IndividualResultTable;
