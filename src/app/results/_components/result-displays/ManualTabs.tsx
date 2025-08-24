'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { api } from '~/trpc/react';
import TeamResults from './TeamResults';

function ManualTabs() {
  const { data: categories, isLoading: isLoadingCategories } =
    api.participantResults.getParticipantsCategories.useQuery();
  const [activeTab, setActiveTab] = useState<string>(categories?.[0] ?? '');
  const { data, isLoading } = api.participantResults.getSortedParticipantsResults.useQuery(
    { contest: activeTab },
    { refetchOnWindowFocus: true, enabled: !!activeTab }
  );

  if (!categories) return null;

  if (isLoadingCategories) return <div className="text-center text-gray-500">Chargement des catégories...</div>;

  return (
    <div className="px-4 text-center">
      <Tabs defaultValue={categories?.[0]} className="flex w-full justify-center py-4">
        <TabsList>
          {categories?.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveTab(category)}
              className="px-4 py-2 font-bold transition-colors data-[state=active]:bg-green-600 data-[state=inactive]:bg-gray-200 data-[state=active]:text-black data-[state=inactive]:text-gray-800 "
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab}>
          <TeamResults data={data} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ManualTabs;
