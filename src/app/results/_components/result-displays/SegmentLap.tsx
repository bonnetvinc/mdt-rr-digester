import { FlagTriangleRightIcon, Star } from 'lucide-react';

interface SegmentLapProps {
  lap: {
    starttime: number;
    endtime?: number;
    segments: Array<{
      equipmentId: string;
      label: string;
      points: number;
    }>;
  };
  lapNumber: number;
}

function SegmentLap({ lap, lapNumber }: SegmentLapProps) {
  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2).padStart(5, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  //   const formatTime = (timestamp: number) => {
  //     const date = new Date(timestamp);
  //     return date.toLocaleTimeString('fr-FR', {
  //       hour: '2-digit',
  //       minute: '2-digit'
  //     });
  //   };

  const isActive = !lap.endtime;
  const isNotStarted = !lap.starttime;

  if (isNotStarted) {
    return '-';
  }

  return (
    <div className="flex items-center gap-2">
      <FlagTriangleRightIcon
        className={`h-3 w-3 ${isActive ? 'animate-pulse text-red-500' : 'text-green-500'}`}
      ></FlagTriangleRightIcon>
      <div className="flex items-center gap-1">
        <div className="text-xs">
          <span className="font-medium">{lapNumber}</span>
          <span className="ml-1 text-gray-400">
            {lap.endtime ? formatTime(lap.endtime - lap.starttime) : formatTime(lap.starttime)}
          </span>
        </div>
      </div>
      {lap.segments && lap.segments.length > 0 && (
        <div className="flex items-center gap-1">
          <div
            className={`flex items-center gap-0.5 rounded px-2 py-1 font-bold text-white text-xs ${isActive ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-green-600'}`}
          >
            {lap.segments.reduce((sum, segment) => sum + segment.points, 0)}
            <span className="ml-1">pts</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SegmentLap;
