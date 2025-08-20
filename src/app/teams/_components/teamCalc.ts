import { Parser } from 'json2csv';

export type ParticipantEvent = {
  segment?: {
    points?: number;
    distance?: number;
    elevation?: number;
  };
};

export type Lap = {
  events: ParticipantEvent[];
};

export type Participant = {
  bib: number;
  name: string;
  teamName?: string;
  laps: Lap[];
};

// Fonction qui calcule les totaux pour chaque participant
export function computeParticipantsStats(participants: Participant[]) {
  return participants.map(participant => {
    const totals = participant.laps.reduce(
      (acc, lap) => {
        lap.events.forEach(event => {
          if (event.segment) {
            acc.points += event.segment.points || 0;
            acc.distance += event.segment.distance || 0;
            acc.elevation += event.segment.elevation || 0;
          }
        });
        return acc;
      },
      { points: 0, distance: 0, elevation: 0 }
    );

    return {
      ...participant,
      totalPoints: totals.points,
      totalDistance: totals.distance,
      totalElevation: totals.elevation
    };
  });
}

// Fonction pour générer un CSV à partir des participants
export function exportParticipantsToCSV(participants: Participant[]) {
  const stats = computeParticipantsStats(participants);

  const fields = ['bib', 'name', 'teamName', 'totalPoints', 'totalDistance', 'totalElevation'];
  const parser = new Parser({ fields });
  const csv = parser.parse(stats);

  return csv;
}
