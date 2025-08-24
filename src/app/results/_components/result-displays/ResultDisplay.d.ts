export type ResultDisplayProps =
  | {
      totalPoints: number;
      totalDistance: number;
      totalElevation: number;
      laps: ({
        events: ({
          segment: {
            id: number;
            name: string;
            color: string;
            type: $Enums.SegmentType;
            elevation: number;
            points: number;
            equipmentId: string | null;
            distance: number;
          };
        } & {
          id: number;
          timestamp: number;
          lapId: number;
          segmentId: number;
        })[];
      } & {
        id: number;
        startTimestamp: number;
        endTimestamp: number | null;
        participantId: number;
      })[];
      id: number;
      bib: number;
      name: string | null;
      team: string | null;
      contest: string;
      position: number;
    }[]
  | undefined;
