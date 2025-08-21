'use client';
import { FlagIcon, FlagTriangleRightIcon, GaugeCircleIcon, MountainSnowIcon } from 'lucide-react';
import { api } from '~/trpc/react';
import PositionMarker from './PositionMarker';
import SegmentLap from './SegmentLap';

function TeamResultV2() {
  const { data, isLoading } = api.participantResults.getSortedParticipantsResults.useQuery(undefined, {
    refetchInterval: 5000
  });

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des résultats...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="overflow-hidden rounded-lg bg-gray-900">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-green-700 via-orange-700 to-red-700 px-4 py-2 font-bold text-xs">
          <div className="col-span-1">Position</div>
          <div className="col-span-2">Coureur</div>
          <div className="col-span-1">DOS</div>
          <div className="col-span-2">Dernier tour</div>
          <div className="col-span-2">En Cours</div>
          <div className="col-span-1">Tours</div>
          <div className="col-span-1">Km</div>
          <div className="col-span-1">Dénivelé</div>
          <div className="col-span-1">Pts</div>
        </div>

        {/* Results Rows */}
        {data?.map((participant, index) => {
          const finishedLapsList = participant.laps.filter(lap => lap.endTimestamp != null);
          const finishedLaps = finishedLapsList.length;

          const lastFinishedLap = participant.laps
            .filter(l => l.endTimestamp != null)
            .reduce(
              (latest, lap) => (!latest || lap.endTimestamp! > latest.endTimestamp! ? lap : latest),
              undefined as (typeof participant.laps)[0] | undefined
            );

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

          const lastLapData = mapLap(lastFinishedLap);
          const currentLapData = mapLap(currentLap, true);

          const isTopThree = index < 3;

          return (
            <div
              key={participant.id}
              className={`grid grid-cols-12 items-center gap-2 border-gray-800 border-b px-4 py-2 text-sm transition-colors hover:bg-gray-800 ${isTopThree ? 'bg-gradient-to-r' : 'bg-gray-900'} ${index === 0 ? 'border-l-4 border-l-yellow-400 from-yellow-900/20 to-transparent' : ''} ${index === 1 ? 'border-l-4 border-l-gray-400 from-gray-700/20 to-transparent' : ''} ${index === 2 ? 'border-l-4 border-l-orange-400 from-orange-900/20 to-transparent' : ''} `}
            >
              <div className="col-span-1">
                <PositionMarker position={index + 1} />
              </div>

              <div className="col-span-2">
                <div className="truncate font-bold text-white">{participant.name}</div>
              </div>

              <div className="col-span-1 font-mono text-orange-400">{participant.bib}</div>

              <div className="col-span-2">
                <SegmentLap lap={lastLapData} lapNumber={finishedLaps} />
              </div>

              <div className="col-span-2">
                <SegmentLap lap={currentLapData} lapNumber={finishedLaps + 1} />
              </div>

              <div className="col-span-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-red-400">{finishedLaps}</span>
                  <FlagIcon className="h-3 w-3 text-red-400" />
                </div>
              </div>

              <div className="col-span-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-orange-400">{participant.totalDistance}</span>
                  <GaugeCircleIcon className="h-3 w-3 text-orange-400" />
                </div>
              </div>

              <div className="col-span-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-green-400">{participant.totalElevation}</span>
                  <MountainSnowIcon className="h-3 w-3 text-green-400" />
                </div>
              </div>

              <div className="col-span-1 text-center">
                <div
                  className={`rounded px-2 py-1 font-bold text-sm ${index === 0 ? 'bg-yellow-600 text-white' : ''} ${index === 1 ? 'bg-gray-500 text-white' : ''} ${index === 2 ? 'bg-orange-600 text-white' : ''} ${index > 2 ? 'bg-green-600 text-white' : ''} `}
                >
                  {participant.totalPoints} Pts
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamResultV2;
