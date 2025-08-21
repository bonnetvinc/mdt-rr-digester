export type ResultDisplayProps = {
  participant: {
    id: string;
    name: string;
    bib: string;
    laps: Array<{
      startTimestamp: number;
      endTimestamp: number | null;
      events: Array<{
        segment: {
          equipmentId: string;
          name: string;
          points: number;
        } | null;
      }>;
    }>;
    totalPoints: number;
    totalDistance: number;
  };
};

