import { Button } from '~/components/ui/button';

type ShowSegmentProps = {
  segment: {
    id: number;
    name: string;
    points: number;
    distance: number;
    elevation: number;
  };
};

function ShowSegment({ segment }: ShowSegmentProps) {
  return (
    <div className="flex w-full items-center gap-4 border-slate-200 border-b px-1 py-2">
      <span className="font-semibold text-slate-700">{segment.name}</span>
      <span className="text-slate-400 text-xs">ID: {segment.id}</span>
      <span className="text-slate-600">{segment.points} pts</span>
      <span className="text-slate-600">{segment.distance} m</span>
      <span className="text-slate-600">{segment.elevation} m</span>
      <Button type="button" className="rounded bg-blue-500 px-3 py-1 text-white transition hover:bg-blue-600">
        Edit
      </Button>
      <Button type="button" className="rounded bg-red-500 px-3 py-1 text-white transition hover:bg-red-600">
        Delete
      </Button>
    </div>
  );
}

export default ShowSegment;
