'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollBy = (distance: number) => {
    containerRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  };

  useEffect(() => {
    if (categories) {
      setActiveTab(categories[0] ?? '');
    }
  }, [categories]);

  useEffect(() => {
    updateScroll();
  }, [categories]);

  if (!categories) return null;

  if (isLoadingCategories) return <div className="text-center text-gray-500">Chargement des catégories...</div>;

  return (
    <div className="relative px-4">
      {/* Flèche gauche */}
      {canScrollLeft && (
        <div
          className="absolute top-0 left-0 z-10 flex h-10 cursor-pointer items-center"
          style={{ transform: 'translateY(50%)' }} // centre vertical sur la moitié du conteneur
          onClick={() => scrollBy(-100)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-gray-900 to-transparent">
            <span className="font-bold text-lg text-white">{'<'}</span>
          </div>
        </div>
      )}

      {/* Onglets scrollables */}
      <div
        ref={containerRef}
        onScroll={updateScroll}
        className="flex gap-2 overflow-x-auto scroll-smooth whitespace-nowrap py-2"
      >
        {categories.map(category => (
          <Button
            key={category}
            variant="outline"
            onClick={() => setActiveTab(category)}
            className={`inline-block px-4 py-2 font-bold ${
              activeTab === category ? 'bg-green-600 text-black' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Flèche droite */}
      {canScrollRight && (
        <div
          className="absolute top-0 right-0 z-10 flex h-10 cursor-pointer items-center"
          style={{ transform: 'translateY(50%)' }}
          onClick={() => scrollBy(100)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-l from-gray-900 to-transparent">
            <span className="font-bold text-lg text-white">{'>'}</span>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="mt-4 w-full">
        <TeamResults data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ManualTabs;
