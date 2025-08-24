'use client';

import { api } from '~/trpc/react';
import EditDisplaySettingsForm from './EditDisplaySettings';

export default function DisplaySettingsForm() {
  const { data: settings, isLoading } = api.displaySettings.getSettings.useQuery();

  if (isLoading) return <div>Chargement...</div>;

  if (!settings) return <div>Aucun paramètre trouvé</div>;

  return <EditDisplaySettingsForm initialValues={{ timerDelay: settings?.timerDelay, pageSize: settings?.pageSize }} />;
}
