type Participant = {
  Bib: number;
  Name: string;
  Club: string;
  Equipe: string;
};

export async function fetchParticipants() {
  const url = 'https://api.raceresult.com/353920/F3KQ7PXT4GQ7D2GVM68WN9R7EJKBZZMB';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }
  const data = await response.json();
  return data as Participant[];
}
