'use client';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

type Segment = {
  id: number;
  name: string;
  equipmentId: string;
  points: number;
  type: 'START' | 'FINISH' | 'BONUS';
  distance: number;
  elevation: number;
};

type ShowSegmentProps = {
  segment: Segment;
  handleDelete: (id: number) => void;
};

export default function ShowSegment({ segment, handleDelete }: ShowSegmentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...segment });

  const updateMutation = api.segments.updateSegment.useMutation({
    onSuccess: updated => {
      setFormData(updated);
      setIsEditing(false);
    }
  });

  const handleChange = (key: keyof Segment, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate({ id: segment.id, data: formData });
  };

  const handleCancel = () => {
    setFormData({ ...segment });
    setIsEditing(false);
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-2 border-slate-200 border-b px-2 py-2">
      {isEditing ? (
        <div className="flex w-full flex-wrap gap-2">
          <div className="flex min-w-[120px] flex-col">
            <label htmlFor="name" className="font-medium text-sm">
              Name
            </label>
            <input
              className="rounded border px-1 py-0.5 text-sm"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </div>
          <div className="flex min-w-[120px] flex-col">
            <label htmlFor="equipmentId" className="font-medium text-sm">
              Equipment ID
            </label>
            <input
              className="rounded border px-1 py-0.5 text-sm"
              value={formData.equipmentId}
              onChange={e => handleChange('equipmentId', e.target.value)}
            />
          </div>
          <div className="flex min-w-[100px] flex-col">
            <label htmlFor="type" className="font-medium text-sm">
              Type
            </label>
            <input
              className="rounded border px-1 py-0.5 text-sm"
              value={formData.type}
              onChange={e => handleChange('type', e.target.value)}
            />
          </div>
          <div className="flex min-w-[80px] flex-col">
            <label htmlFor="points" className="font-medium text-sm">
              Points
            </label>
            <input
              className="rounded border px-1 py-0.5 text-sm"
              type="number"
              value={formData.points}
              onChange={e => handleChange('points', Number(e.target.value))}
            />
          </div>
          <div className="flex min-w-[80px] flex-col">
            <label htmlFor="distance" className="font-medium text-sm">
              Distance (m)
            </label>
            <input
              className="rounded border px-1 py-0.5 text-sm"
              type="number"
              value={formData.distance}
              onChange={e => handleChange('distance', Number(e.target.value))}
            />
          </div>
          <div className="flex min-w-[80px] flex-col">
            <label htmlFor="elevation" className="font-medium text-sm">
              Elevation (m)
            </label>
            <input
              className="rounded border px-1 py-0.5 text-sm"
              type="number"
              value={formData.elevation}
              onChange={e => handleChange('elevation', Number(e.target.value))}
            />
          </div>
          <div className="mt-2 flex w-full justify-end gap-1">
            <Button
              className="rounded bg-green-500 px-2 py-0.5 text-white text-xs hover:bg-green-600"
              onClick={handleSave}
              type="button"
            >
              Save
            </Button>
            <Button
              className="rounded bg-gray-300 px-2 py-0.5 text-gray-700 text-xs hover:bg-gray-400"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-wrap items-center gap-2">
          <span className="min-w-[120px] font-semibold">{formData.name}</span>
          <span className="min-w-[120px]">{formData.equipmentId}</span>
          <span className="min-w-[100px]">{formData.type}</span>
          <span className="min-w-[80px]">{formData.points} pts</span>
          <span className="min-w-[80px]">{formData.distance} m</span>
          <span className="min-w-[80px]">{formData.elevation} m</span>
          <div className="ml-auto flex gap-1">
            <Button
              onClick={() => setIsEditing(true)}
              type="button"
              className="rounded bg-blue-500 px-3 py-1 text-white text-xs hover:bg-blue-600"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(segment.id)}
              type="button"
              className="rounded bg-red-500 px-3 py-1 text-white text-xs hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
