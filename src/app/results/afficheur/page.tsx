'use client';
import { api } from '~/trpc/react';
import AutoTabs from '../_components/result-tabs/AutoTabs';

function DisplayResults() {
  const { data: categories, isLoading } = api.participantResults.getParticipantsCategories.useQuery();

  if (!categories) return null;

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des catégories...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <AutoTabs categories={categories ?? []} timerDelayDefault={10000} pageSize={10} />
    </div>
  );
}

export default DisplayResults;
