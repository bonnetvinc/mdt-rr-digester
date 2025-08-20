'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import ConfirmationAlert from './ConfirmationAlert';
import ShowSegment from './ShowSegment';

function ManageSegment() {
  const { data } = api.segments.listSegments.useQuery();
  const { mutate: deleteSegment } = api.segments.deleteSegment.useMutation({
    onSuccess: () => {
      alert('Segment deleted successfully');
    },
    onError: error => {
      console.error('Error deleting segment:', error);
      alert('Failed to delete segment: avez vous supprimé les datas de course');
    }
  });

  const [selectedSegmentId, setSelectedSegmentId] = useState<number | null>(null);

  const handleDelete = (id: number | null) => {
    if (id) {
      deleteSegment({ id });
      setSelectedSegmentId(null);
    }
  };

  return (
    <>
      {data?.map(item => (
        <ShowSegment
          key={item.id}
          segment={item}
          handleDelete={() => setSelectedSegmentId(item.id)}
          handleEdit={() => console.log('Edit segment', item.id)}
        />
      ))}
      <ConfirmationAlert
        title="Supprimer le segment"
        description="Êtes-vous sûr de vouloir supprimer ce segment ?"
        confirmActionLabel="Supprimer"
        confirmActionHandler={() => handleDelete(selectedSegmentId)}
        confirmActionType="danger"
        cancelActionLabel="Annuler"
        cancelActionHandler={() => setSelectedSegmentId(null)}
        showConfirmationAlert={!!selectedSegmentId}
      />
    </>
  );
}

export default ManageSegment;
