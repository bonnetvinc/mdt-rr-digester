'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

type EditDisplaySettingsFormProps = {
  initialValues: {
    timerDelay: number;
    pageSize: number;
  };
};

export default function EditDisplaySettingsForm({ initialValues }: EditDisplaySettingsFormProps) {
  const utils = api.useUtils();
  const mutation = api.displaySettings.updateSettings.useMutation({
    onSuccess: () => {
      console.log('Display settings updated successfully');
      utils.displaySettings.getSettings.invalidate(); // refresh après update
      toast.success('Paramètres mis à jour !');
    },
    onError: err => {
      console.error('Error updating display settings:', err);
      toast.error('Erreur : ' + err.message);
    }
  });

  const [timerDelay, setTimerDelay] = useState(initialValues.timerDelay);
  const [pageSize, setPageSize] = useState(initialValues.pageSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ timerDelay: Number(timerDelay), pageSize: Number(pageSize) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-1">
        <label htmlFor="pageSize" className="font-medium text-sm">
          Délai du timer (ms)
        </label>
        <input
          id="timerDelay"
          type="number"
          value={timerDelay}
          onChange={e => setTimerDelay(Number(e.target.value))}
          min={1000}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="pageSize" className="font-medium text-sm">
          Taille de page (participants)
        </label>
        <input
          id="pageSize"
          type="number"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          min={1}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <Button type="submit" className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
        Enregistrer
      </Button>
    </form>
  );
}
