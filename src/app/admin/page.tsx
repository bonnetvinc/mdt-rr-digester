import { Card } from '~/components/ui/card';
import ClearAllDatas from '../_components/clear/ClearAllDatas';
import ManageEquipment from '../_components/segment/ManageSegment';

function page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-100 to-slate-200 px-2 py-8">
      <h1 className="mb-8 font-bold text-3xl text-slate-700 drop-shadow-sm">Admin Panel</h1>
      <div className="flex w-full max-w-3xl flex-col justify-center gap-8">
        <Card className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="mb-4 font-semibold text-slate-600 text-xl">Données</h2>
          <ClearAllDatas />
        </Card>
        <Card className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="mb-4 font-semibold text-slate-600 text-xl">Segments</h2>
          <ManageEquipment />
        </Card>
      </div>
    </main>
  );
}

export default page;
