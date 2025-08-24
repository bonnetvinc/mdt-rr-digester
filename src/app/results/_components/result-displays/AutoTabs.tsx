'use client';

import { ClockIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { api } from '~/trpc/react';
import TeamResults from './TeamResults';

interface AutoTabsProps {
  categories: string[];
  timerDelayDefault: number; // délai de base pour chaque page/onglet
  pageSize: number; // nombre de participants par page
}

export default function AutoTabs({ categories, timerDelayDefault, pageSize }: AutoTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(categories?.[0] ?? '');
  const [page, setPage] = useState(0);
  const [timerDelay, setTimerDelay] = useState(timerDelayDefault);

  // Requête pour l'onglet actif
  const { data, isLoading } = api.participantResults.getSortedParticipantsResults.useQuery(
    { contest: activeTab },
    { refetchInterval: timerDelay }
  );

  const totalResults = data?.length ?? 0;
  const totalPages = Math.ceil(totalResults / pageSize);

  // Pagination interne et changement d'onglet automatique
  useEffect(() => {
    if (!activeTab) return;

    const interval = setInterval(() => {
      if (totalPages <= 1) {
        handleNextTab();
      } else {
        if (page + 1 < totalPages) {
          setPage(p => p + 1);
        } else {
          handleNextTab();
        }
      }
    }, timerDelay);

    return () => clearInterval(interval);
  }, [activeTab, page, totalPages, timerDelay]);

  // Passer à l'onglet suivant
  const handleNextTab = () => {
    const currentIndex = categories.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % categories.length;
    setActiveTab(categories[nextIndex] ?? '');
    setPage(0);
  };

  useEffect(() => {
    const pageCount = Math.max(1, Math.ceil(totalResults / pageSize));
    // Par exemple, plus il y a de pages, plus le délai augmente légèrement
    setTimerDelay(timerDelayDefault + (pageCount % 3) * 2000);
  }, [totalResults, pageSize]);

  // Slice pour la page actuelle
  const paginatedData = data?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

  return (
    <div className="relative px-4 text-center">
      {/* Icône discrète pour indiquer le timer */}
      <div className="absolute top-4 right-4">
        <ClockIcon className="h-5 w-5 animate-spin-slow text-green-500" />
      </div>

      <Tabs value={activeTab} className="flex w-full justify-center py-4">
        <TabsList className="flex space-x-2">
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              className="px-4 py-2 font-bold transition-colors data-[state=active]:bg-green-600 data-[state=inactive]:bg-gray-200 data-[state=active]:text-black data-[state=inactive]:text-gray-400 "
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <TeamResults data={paginatedData} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
