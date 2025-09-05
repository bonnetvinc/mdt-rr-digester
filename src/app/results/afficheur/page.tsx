'use client';
import { api } from '~/trpc/react';
import AutoTabs from '../_components/result-displays/AutoTabs';

function DisplayResults() {
  const { data: categories, isLoading } = api.participantResults.getParticipantsCategories.useQuery();

  const { data: settings, isLoading: isLoadingSettings } = api.displaySettings.getSettings.useQuery();

  const timerDelay = settings?.timerDelay ?? 5000;
  const pageSize = settings?.pageSize ?? 2;

  if (!categories) return null;

  if (isLoading || isLoadingSettings) {
    return <div className="text-center text-gray-500">loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <AutoTabs categories={categories ?? []} timerDelayDefault={timerDelay} pageSize={pageSize} disabled={true} />
    </div>
  );
}

export default DisplayResults;
