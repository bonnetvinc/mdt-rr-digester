import { FlagTriangleRightIcon } from 'lucide-react';

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
}

function SegmentLap({ lap }: SegmentLapProps) {
  function formatTime(seconds: number) {
    // const minutes = Math.floor(seconds / 60);
    // const remainingSeconds = (seconds % 60).toFixed(2).padStart(5, '0');
    // return `${minutes}:${remainingSeconds}`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  }

  function formatTimeHHMMSS(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
  }

  function convertRaceTimestamp(raceStart: string, timestampSeconds: number): string {
    const startDate = new Date(raceStart);
    const realTime = new Date(startDate.getTime() + timestampSeconds * 1000);
    return formatTimeHHMMSS(realTime);
  }

  const isActive = !lap.endtime;
  const isNotStarted = !lap.starttime;

  if (isNotStarted) {
    return '-';
  }

  return (
    <div className="flex items-center">
      <FlagTriangleRightIcon className={`mr-2 h-3 w-3 ${isActive ? 'animate-pulse text-red-500' : 'text-green-500'}`} />

      <span className="min-w-[50px] text-right text-gray-400 text-xs">
        {lap.endtime
          ? formatTime(lap.endtime - lap.starttime)
          : `à ${convertRaceTimestamp('2025-08-24T12:00:00', lap.starttime)}`}
      </span>

      {lap.segments && lap.segments.length > 0 && (
        <div
          className={`ml-3 flex items-center rounded px-2 py-0.5 font-bold text-white text-xs ${
            isActive ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-green-600'
          }`}
        >
          {lap.segments.reduce((sum, segment) => sum + segment.points, 0)}
          <span className="ml-1">pts</span>
        </div>
      )}
    </div>
  );
}

export default SegmentLap;
