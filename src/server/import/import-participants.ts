type Participant = {
  Bib: number;
  Name: string;
  Team: string;
  ContestName: string;
};

const defaultUrl = 'https://api.raceresult.com/353920/F3KQ7PXT4GQ7D2GVM68WN9R7EJKBZZMB';

export async function fetchParticipants(url = defaultUrl): Promise<Participant[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }
  const data = await response.json();
  return data as Participant[];
}
