import { Award, Medal, Trophy } from 'lucide-react';

function PositionMarker({ position }: { position: number }) {
  const getPositionStyle = () => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-700 to-orange-800 text-white';
      default:
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    }
  };

  const getIcon = () => {
    switch (position) {
      case 1:
        return <Trophy className="h-2.5 w-2.5" />;
      case 2:
        return <Medal className="h-2.5 w-2.5" />;
      case 3:
        return <Award className="h-2.5 w-2.5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${getPositionStyle()} relative flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm`}
    >
      {position <= 3 && <div className="-top-0.5 -right-0.5 absolute">{getIcon()}</div>}
      {position}
    </div>
  );
}

export default PositionMarker;
