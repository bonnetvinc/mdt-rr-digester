import { Award, Medal, Trophy } from 'lucide-react';

type PositionIconProps = {
  position: number;
};

function PositionIcon({ position }: PositionIconProps) {
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
}

function PositionMarker({ position }: PositionIconProps) {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm">
      <PositionIcon position={position} />
    </div>
  );
}

export default PositionMarker;
