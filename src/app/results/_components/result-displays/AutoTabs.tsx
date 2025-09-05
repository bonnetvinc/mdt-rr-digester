'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { api } from '~/trpc/react';
import TeamResults from './TeamResults';

interface AutoTabsProps {
  categories: string[];
  timerDelayDefault: number;
  pageSize: number;
  disabled?: boolean;
}

export default function AutoTabs({ categories, timerDelayDefault, pageSize, disabled = false }: AutoTabsProps) {
  const initialTab = categories?.[0] ?? '';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [page, setPage] = useState(0);
  const [timerDelay, setTimerDelay] = useState(timerDelayDefault);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Changement d'onglet
  function handleNextTab() {
    if (!categories.length) return;
    const currentIndex = categories.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % categories.length;
    setActiveTab(categories[nextIndex] ?? initialTab);
    setPage(0);
  }

  // Requête pour l'onglet actif
  const { data, isLoading } = api.participantResults.getSortedParticipantsResults.useQuery(
    { contest: activeTab },
    { refetchInterval: timerDelay }
  );

  const totalResults = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  // Calcul dynamique du timer selon le nombre de pages
  useEffect(() => {
    setTimerDelay(timerDelayDefault + (totalPages % 3) * 2000);
  }, [totalResults, pageSize, timerDelayDefault, totalPages]);

  // Gestion du timer pour pagination et changement d'onglet
  useEffect(() => {
    if (!activeTab) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (totalPages <= 1 || page + 1 >= totalPages) {
        handleNextTab();
      } else {
        setPage(p => p + 1);
      }
    }, timerDelay);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, page, totalPages, timerDelay, categories]);

  // Slice pour la page actuelle
  const paginatedData = data?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

  return (
    <div className="relative px-4 text-center">
      <Tabs value={activeTab} className="flex w-full justify-center py-4" onValueChange={setActiveTab}>
        <TabsList className="flex space-x-2">
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              disabled={disabled}
              className="px-4 py-2 font-bold transition-colors data-[state=active]:bg-green-600 data-[state=inactive]:bg-gray-200 data-[state=active]:text-black data-[state=inactive]:text-gray-400"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <TeamResults data={paginatedData} isLoading={isLoading} disabled/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
