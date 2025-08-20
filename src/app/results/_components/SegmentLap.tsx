import { Award, Clock, Target, Zap } from 'lucide-react';
import type { ResultLap } from './ResultCard';

type SegmentLapProps = {
  participantBib?: number;
  title?: string;
  lap?: ResultLap;
};

const getBonusIcon = (equipmentId: string) => {
  switch (equipmentId) {
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

const getBonusColor = (equipmentId: string) => {
  switch (equipmentId) {
    case 'BONUS 1':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    case 'BONUS 2':
      return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
    case 'BONUS 3':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    case 'BONUS 4':
      return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-black';
  }
};

function formatToMinSec(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2).padStart(5, '0');
  return `${minutes}:${remainingSeconds}`;
}

function SegmentLap({ participantBib, lap, title }: SegmentLapProps) {
  return (
    <div className="flex w-full items-center gap-2 text-xs">
      {/* Titre et numéro */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="font-semibold">{title}</span>
        {participantBib && (
          <span className="rounded-lg bg-slate-200 px-1 py-0.5 font-medium text-black">#{participantBib}</span>
        )}
      </div>

      {/* Segments du tour */}
      <div className="flex flex-1 flex-wrap gap-1">
        {lap?.segments?.map(segment => (
          <div
            key={segment.equipmentId}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 shadow-sm ${getBonusColor(
              segment.equipmentId
            )} transition-transform hover:scale-105`}
          >
            {segment.label && getBonusIcon(segment.label)}
            <span className="max-w-[60px] truncate">{segment.label}</span>
            <span className="font-bold">+{segment.points}</span>
          </div>
        ))}
      </div>

      {/* Statut / temps aligné à droite */}
      <div className="flex-shrink-0 text-slate-500">
        {!lap?.endtime ? (
          <span className="font-semibold">En Cours</span>
        ) : (
          <span>
            Temps: <span className="font-bold">{formatToMinSec(lap.endtime - lap.starttime)}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default SegmentLap;
