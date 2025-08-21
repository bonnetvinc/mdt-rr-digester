'use client';

import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

function ImportParticipants() {
  const { mutate: importParticipants } = api.adminActions.importParticipants.useMutation({
    onSuccess: () => {
      toast.success('Participants imported successfully');
    },
    onError: (error: any) => {
      console.error('Error importing participants:', error);
      toast.error('Failed to import participants');
    }
  });

  return (
    <Button type="button" onClick={() => importParticipants()} className="rounded bg-blue-500 px-4 py-2 text-white">
      Import Participants
    </Button>
  );
}

export default ImportParticipants;
