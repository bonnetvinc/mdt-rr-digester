import { Award, Medal, Trophy } from 'lucide-react';
import SegmentLap from './SegmentLap';

type ResultCardProps = {
  id: number;
  position: number;
  teamName: string;
  participantBib?: number;
  finishedLaps: number;
  totalPoints?: number;
  totalElevation?: number;
  totalDistance?: number;
  lastLap?: ResultLap;
  currentLap?: ResultLap;
};

export type ResultLap = {
  starttime: number;
  endtime?: number;
  segments?: ResultSegment[];
};

export type ResultSegment = {
  equipmentId: string;
  label: string;
  points: number;
  color?: string; // Optional color for bonus segments
};

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="h-4 w-4 text-yellow-400" />;
    case 2:
      return <Medal className="h-4 w-4 text-slate-300" />;
    case 3:
      return <Award className="h-4 w-4 text-orange-400" />;
    default:
      return (
        <div className="flex h-4 w-4 items-center justify-center font-bold text-slate-400 text-xs">#{position}</div>
      );
  }
};

function ResultCard({
  id,
  position,
  teamName,
  participantBib,
  finishedLaps,
  totalDistance,
  totalElevation,
  totalPoints,
  lastLap,
  currentLap
}: ResultCardProps) {
  return (
    <div
      key={id}
      className="group relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:scale-[1.01]"
    >
      {/* Ligne principale */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* Position + équipe */}
        <div className="flex min-w-[160px] items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm">
            {getPositionIcon(position)}
          </div>
          <span className="truncate font-semibold text-slate-800 text-sm">{teamName}</span>
          {participantBib && <span className="text-slate-400 text-xs">#{participantBib}</span>}
        </div>

        {/* Tours */}
        <div className="flex flex-1 items-center justify-center gap-3 px-4">
          {lastLap?.starttime ? <SegmentLap lap={lastLap} lapNumber={finishedLaps} /> : '-'}
          {lastLap && currentLap && <div className="text-slate-300">|</div>}
          {currentLap?.starttime ? <SegmentLap lap={currentLap} lapNumber={finishedLaps + 1} /> : '-'}
        </div>

        {/* Stats */}
        <div className="flex min-w-[220px] items-center justify-end gap-4 text-slate-600 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>{finishedLaps}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>{totalDistance ?? 0} km</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
            <span>{totalElevation ?? 0} m</span>
          </div>
          <div className="flex items-center gap-1 font-bold">
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
            <span>{totalPoints ?? 0} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
