"use client"
import { api } from "~/trpc/react"

function ParticipantsResultList() {
  const { data, isLoading } = api.participantResults.getParticipantsResults.useQuery(
    undefined,
    {
      refetchInterval: 5000,
    }
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Trier par nombre de tours finis (décroissant)
  const sortedData = data?.sort((a, b) => {
    // Compter les tours finis (avec endTimestamp)
    const aFinishedLaps = a.laps.filter(lap => lap.endTimestamp !== null).length;
    const bFinishedLaps = b.laps.filter(lap => lap.endTimestamp !== null).length;
    
    // Tri décroissant par nombre de tours finis
    return bFinishedLaps - aFinishedLaps;
  });

  return (
    <ul>
        {sortedData?.map(participant => {
          const finishedLaps = participant.laps.filter(lap => lap.endTimestamp !== null).length;
          
          return (
            <li key={participant.id}>
              #{participant.bib} - Tours finis: {finishedLaps}
              {participant.name && ` - ${participant.name}`}
            </li>
          );
        })}
    </ul>
  )
}

export default ParticipantsResultList