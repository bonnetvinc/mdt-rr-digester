import { Award, Clock, Medal, Target, Trophy, Zap } from 'lucide-react';

type ResultCardProps = {
  id: number;
  position: number;
  teamName: string;
  participantBib?: number;
  finishedLaps: number;
  totalPoints?: number;
  totalElevation?: number;
  totalDistance?: number;
  lastLap?: ResultCardLap;
};

type ResultCardLap = {
  timestamp: number;
  bonuses?: ResultCardBonus[];
};

type ResultCardBonus = {
  id: number;
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

const getBonusIcon = (id: string) => {
  switch (id) {
    case 'BONUS 1':
      return <Zap className="h-3 w-3" />;
    case 'BONUS 2':
      return <Target className="h-3 w-3" />;
    case 'BONUS 3':
      return <Clock className="h-3 w-3" />;
    case 'BONUS 4':
      return <Award className="h-3 w-3" />;
    default:
      return <Award className="h-3 w-3" />;
  }
};

const getBonusColor = (id: number) => {
  switch (id) {
    case 3:
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    case 4:
      return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
    case 5:
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    case 6:
      return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-black';
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
  lastLap
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

      {lastLap && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-semibold text-sm">Dernier tour:</span>
            {participantBib && <span className="rounded-lg text-black text-xs">#{participantBib}</span>}
            <div className="flex flex-wrap justify-end gap-1">
              {lastLap.bonuses?.map(bonus => (
                <div
                  key={bonus.id}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-xs shadow-sm ${getBonusColor(bonus.id)} transition-transform hover:scale-105`}
                >
                  {bonus.label && getBonusIcon(bonus.label)}
                  <span className="max-w-16 truncate">{bonus.label}</span>
                  <span className="font-bold">+{bonus.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
