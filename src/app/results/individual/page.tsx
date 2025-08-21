import { Clock } from 'lucide-react';
import TeamResultV2 from '../_components/result-displays/TeamResultV2';

function DisplayResults() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Compact Header for Display */}
      <div className="bg-gradient-to-r from-green-600 via-orange-600 to-red-600 py-3 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-2xl">DÉFI 24H LACOURSE</h1>
              <div className="animate-pulse rounded-full bg-red-500 px-3 py-1 font-bold text-sm">LIVE</div>
            </div>
            <div className="text-right text-sm">
              <div className="flex items-center gap-1 text-xl">
                <Clock className="h-4 w-4 " />
                {/* {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TeamResultV2 />
    </div>
  );
}

export default DisplayResults;
