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

const getPositionStyle = (position: number) => {
  switch (position) {
    case 1:
      return 'bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50 border-l-4 border-l-yellow-400 shadow-yellow-100';
    case 2:
      return 'bg-gradient-to-r from-slate-50 via-slate-100 to-gray-50 border-l-4 border-l-slate-400 shadow-slate-100';
    case 3:
      return 'bg-gradient-to-r from-orange-50 via-orange-100 to-amber-50 border-l-4 border-l-orange-400 shadow-orange-100';
    default:
      return 'bg-white border-l-4 border-l-slate-200 hover:border-l-blue-300';
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
      className={`${getPositionStyle(position)} group rounded-2xl border border-slate-100 p-2 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        {/* Section gauche - Position et infos principales */}
        <div className="flex flex-1 items-center gap-4">
          {/* Position */}
          <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-slate-800 shadow-md">
            {getPositionIcon(position)}
          </div>

          {/* Infos participant */}
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-md text-slate-800 transition-colors group-hover:text-blue-600">
                  {teamName}
                </h3>
              </div>

              <div className="flex items-center gap-6 text-slate-500 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="font-semibold">{finishedLaps} tours</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="font-semibold">{totalDistance ?? 0} km</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  <span className="font-semibold">{totalElevation ?? 0} m</span>
                </div>

                <div className="flex items-center gap-2 text-blue-1000">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span className="font-bold">{totalPoints ?? 0} pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lastLap && <SegmentLap title="Dernier tour:" participantBib={participantBib} lap={lastLap} />}

      {currentLap && <SegmentLap title="Tour actuel:" participantBib={participantBib} lap={currentLap} />}
    </div>
  );
}

export default ResultCard;
