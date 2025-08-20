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
      className="group relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02]"
    >
      {/* Barre verticale pour la position */}
      <div className={`absolute left-0 top-0 h-full w-1 ${position <= 3 ? 'bg-yellow-400' : 'bg-slate-300'}`}></div>

      {/* Ligne principale : position + infos */}
      <div className="flex items-center justify-between p-2 pl-4">
        {/* Position */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white text-xs font-bold shadow-sm">
            {getPositionIcon(position)}
          </div>
          <span className="font-semibold text-sm text-slate-800">{teamName}</span>
        </div>

        {/* Stats principales */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
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
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
            <span className="font-bold">{totalPoints ?? 0} pts</span>
          </div>
        </div>
      </div>

      {/* Tours */}
      <div className="flex flex-col gap-1 border-t border-slate-100 px-2 py-1">
        {lastLap && <SegmentLap title="Dernier tour" participantBib={participantBib} lap={lastLap} compact />}
        {currentLap && <SegmentLap title="Tour actuel" participantBib={participantBib} lap={currentLap} compact />}
      </div>
    </div>
  );
}


export default ResultCard;
