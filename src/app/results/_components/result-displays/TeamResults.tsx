'use client';
import { FlagIcon, GaugeCircleIcon, MountainSnowIcon } from 'lucide-react';
import Link from 'next/link';
import { metersToKm } from '~/lib/convertKm';
import PositionMarker from './PositionMarker';
import type { ResultDisplayProps } from './ResultDisplay';
import SegmentLap from './SegmentLap';

interface TeamResultsProps {
  data: ResultDisplayProps;
  isLoading: boolean;
}

function TeamResults({ data, isLoading }: TeamResultsProps) {
  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des résultats...</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg bg-gray-900">
      {/* Table Header */}
      <div className="hidden grid-cols-12 gap-2 bg-gradient-to-r from-green-700 via-orange-700 to-red-700 px-4 py-2 font-bold text-sm sm:grid">
        <div className="col-span-1 text-start">Position</div>
        <div className="col-span-2 text-start">Coureur</div>
        <div className="col-span-1 text-start">Plaque</div>
        <div className="col-span-2 text-start">Précédent tour</div>
        <div className="col-span-2 text-start">Dernier départ</div>
        <div className="col-span-1 text-start">Tours</div>
        <div className="col-span-1 text-start">Distance</div>
        <div className="col-span-1 text-start">Dénivelé</div>
        <div className="col-span-1 text-start">Pts</div>
      </div>

      {/* Results Rows */}
      {data?.map(participant => {
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

        const isTopThree = participant.position <= 3;

        return (
          <Link
            key={participant.id}
            href={`/results/${participant.id}`}
            tabIndex={0}
            className={`grid grid-cols-2 items-center gap-2 border-gray-800 border-b px-4 py-2 text-sm transition-colors hover:bg-gray-800 sm:grid-cols-12 ${isTopThree ? 'bg-gradient-to-r' : 'bg-gray-900'} 
                ${participant.position === 1 ? 'border-l-4 border-l-yellow-400 from-yellow-900/20 to-transparent' : ''} 
                ${participant.position === 2 ? 'border-l-4 border-l-gray-400 from-gray-700/20 to-transparent' : ''} 
                ${participant.position === 3 ? 'border-l-4 border-l-orange-400 from-orange-900/20 to-transparent' : ''}`}
          >
            <div className="col-span-1">
              <PositionMarker position={participant.position} />
            </div>

            <div className="col-span-1 text-start sm:col-span-2">
              <div className="truncate font-bold text-white">{participant.name}</div>
            </div>

            <div className="col-span-2 text-start font-mono text-orange-400 sm:col-span-1">{participant.bib}</div>

            <div className="col-span-1 sm:col-span-2">
              <SegmentLap lap={lastLapData} />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <SegmentLap lap={currentLapData} />
            </div>

            <div className="col-span-1 text-start">
              <div className="flex items-center justify-start gap-1">
                <FlagIcon className="h-3 w-3 text-red-400" />
                <span className="font-bold text-red-400">{finishedLaps}</span>
              </div>
            </div>

            <div className="col-span-1 text-start">
              <div className="flex items-center justify-start gap-1">
                <GaugeCircleIcon className="h-3 w-3 text-orange-400" />
                <span className="font-bold text-orange-400">{metersToKm(participant.totalDistance)} km</span>
              </div>
            </div>

            <div className="col-span-1 text-start">
              <div className="flex items-center justify-start gap-1">
                <MountainSnowIcon className="h-3 w-3 text-green-400" />
                <span className="font-bold text-green-400">{participant.totalElevation} m</span>
              </div>
            </div>

            <div className="col-span-1 text-start">
              <div
                className={`rounded px-2 py-1 font-bold text-sm ${participant.position === 1 ? 'bg-yellow-600 text-white' : ''} 
                    ${participant.position === 2 ? 'bg-gray-500 text-white' : ''} 
                    ${participant.position === 3 ? 'bg-orange-800 text-white' : ''} 
                    ${participant.position > 3 ? 'bg-green-600 text-white' : ''}`}
              >
                {participant.totalPoints} Pts
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default TeamResults;
