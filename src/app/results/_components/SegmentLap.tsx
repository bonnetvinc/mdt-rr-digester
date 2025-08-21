import { Badge } from '~/components/ui/badge';
import type { ResultLap } from './ResultCard';

type SegmentLapProps = {
  lap: ResultLap;
  lapNumber: number;
};

function formatToMinSec(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2).padStart(5, '0');
  return `${minutes} min ${remainingSeconds}`;
}

function SegmentLap({ lap, lapNumber = 0 }: SegmentLapProps) {
  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Bandeau avec numéro du tour */}
      <div className="flex min-w-[70px] items-center justify-center bg-blue-500 px-4 py-3 font-bold text-white text-xs">
        #{lapNumber}
      </div>

      {/* Segments */}
      <div className="flex gap-1">
        {lap?.segments?.map(segment => (
          <Badge key={segment.equipmentId} className={`bg-blue-500 text-white dark:bg-blue-600`}>
            <span className="truncate">{segment.label}</span>
            <span className="font-bold text-xs">+{segment.points}</span>
          </Badge>
        ))}
      </div>

      {/* Temps ou statut */}
      <div className="min-w-[90px] flex-shrink-0 px-3 py-2 text-right">
        {!lap?.endtime ? (
          <span className="font-semibold text-orange-500 text-xs">En Cours</span>
        ) : (
          <span className="font-bold text-slate-700 text-xs">{formatToMinSec(lap.endtime - lap.starttime)}</span>
        )}
      </div>
    </div>
  );
}

export default SegmentLap;
