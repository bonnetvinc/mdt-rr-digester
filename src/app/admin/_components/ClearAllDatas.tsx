'use client';

import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

function ClearAllDatas() {
  const { mutate: clearParticipantResults } = api.adminActions.clearParticipantResults.useMutation({
    onSuccess: () => {
      alert('Participant results cleared successfully');
    },
    onError: (error: any) => {
      console.error('Error clearing participant results:', error);
      alert('Failed to clear participant results');
    }
  });

  return (
    <Button type="button" onClick={() => clearParticipantResults()} className="rounded bg-red-500 px-4 py-2 text-white">
      Clear Participant Results
    </Button>
  );
}

export default ClearAllDatas;
