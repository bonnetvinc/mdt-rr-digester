'use client';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

type Segment = {
  id: number;
  name: string;
  equipmentId: string | null;
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
    <div className="flex w-full items-center gap-2 border-slate-200 border-b px-2 py-1">
      {isEditing ? (
        <>
          <input
            className="w-32 rounded border px-1 py-0.5 text-sm"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
          />
          <input
            className="w-32 rounded border px-1 py-0.5 text-sm"
            value={formData.equipmentId ?? ''}
            onChange={e => handleChange('equipmentId', e.target.value)}
          />
          <input
            className="w-32 rounded border px-1 py-0.5 text-sm"
            value={formData.type}
            onChange={e => handleChange('type', e.target.value)}
          />
          <input
            className="w-16 rounded border px-1 py-0.5 text-sm"
            type="number"
            value={formData.points}
            onChange={e => handleChange('points', Number(e.target.value))}
          />
          <input
            className="w-16 rounded border px-1 py-0.5 text-sm"
            type="number"
            value={formData.distance}
            onChange={e => handleChange('distance', Number(e.target.value))}
          />
          <input
            className="w-16 rounded border px-1 py-0.5 text-sm"
            type="number"
            value={formData.elevation}
            onChange={e => handleChange('elevation', Number(e.target.value))}
          />

          <div className="ml-auto flex gap-1">
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
        </>
      ) : (
        <>
          <span className="w-32 font-semibold">{formData.name}</span>
          <span className="w-32">{formData.equipmentId}</span>
          <span className="w-16">{formData.type}</span>
          <span className="w-16">{formData.points} pts</span>
          <span className="w-16">{formData.distance} m</span>
          <span className="w-16">{formData.elevation} m</span>

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
        </>
      )}
    </div>
  );
}
