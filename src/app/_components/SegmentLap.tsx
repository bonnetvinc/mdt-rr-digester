import { Award, Clock, Target, Zap } from 'lucide-react';
import type { ResultSegment } from './ResultCard';

type SegmentLapProps = {
  participantBib?: number;
  title?: string;
  segments: ResultSegment[];
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

function SegmentLap({ participantBib, segments, title }: SegmentLapProps) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="font-semibold text-sm">{title}</span>
        {participantBib && <span className="rounded-lg text-black text-xs">#{participantBib}</span>}
        <div className="flex flex-wrap justify-end gap-1">
          {segments.map(segment => (
            <div
              key={segment.equipmentId}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-xs shadow-sm ${getBonusColor(segment.equipmentId)} transition-transform hover:scale-105`}
            >
              {segment.label && getBonusIcon(segment.label)}
              <span className="max-w-16 truncate">{segment.label}</span>
              <span className="font-bold">+{segment.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SegmentLap;
