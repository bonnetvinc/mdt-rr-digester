'use client';

import { ClockIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { api } from '~/trpc/react';
import TeamResults from '../result-displays/TeamResults';

interface AutoTabsProps {
  categories: string[];
  timerDelay?: number; // délai de base pour chaque page/onglet
  pageSize?: number; // nombre de participants par page
}

export default function AutoTabs({ categories, timerDelay = 5000, pageSize = 2 }: AutoTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(categories?.[0] ?? '');
  const [page, setPage] = useState(0);
  const [timerProgress, setTimerProgress] = useState(0);

  // Requête pour l'onglet actif
  const { data, isLoading } = api.participantResults.getSortedParticipantsResults.useQuery(
    { contest: activeTab },
    { refetchInterval: timerDelay }
  );

  const totalResults = data?.length ?? 0;
  const totalPages = Math.ceil(totalResults / pageSize);

  // Calcul du temps réel pour chaque intervalle en tenant compte de la pagination
  const effectiveTimer = timerDelay * Math.max(1, totalPages);

  // Passer à l'onglet suivant
  const handleNextTab = () => {
    const currentIndex = categories.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % categories.length;
    setActiveTab(categories[nextIndex] ?? '');
    setPage(0);
    setTimerProgress(0);
  };

  // Gestion du timer et de l'animation de l'icône
  useEffect(() => {
    const intervalTime = 100; // ms
    const steps = effectiveTimer / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setTimerProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          // Si pagination, passer à la page suivante
          if (totalPages > 1 && page + 1 < totalPages) {
            setPage(p => p + 1);
          } else {
            handleNextTab();
          }
          return 0;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [activeTab, page, totalPages, effectiveTimer]);

  // Slice pour la page actuelle
  const paginatedData = data?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

  return (
    <div className="relative px-4 text-center">
      {/* Icône discrète pour indiquer le timer */}
      <div className="absolute top-4 right-4">
        <ClockIcon
          className="h-5 w-5 animate-spin-slow text-green-500"
          style={{ transform: `rotate(${timerProgress * 3.6}deg)` }}
        />
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
