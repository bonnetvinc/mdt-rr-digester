'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { api } from '~/trpc/react';
import TeamResultV2 from '../result-displays/TeamResultV2';

function ResultCategories() {
  const { data: categories } = api.participantResults.getParticipantsCategories.useQuery();

  if (!categories) return null;

  return (
    <div className="px-4 text-center">
      <Tabs defaultValue={categories?.[0]} className="flex w-full justify-center py-4">
        <TabsList>
          {categories?.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories?.map(category => (
          <TabsContent key={category} value={category}>
            <TeamResultV2 contest={category} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default ResultCategories;
