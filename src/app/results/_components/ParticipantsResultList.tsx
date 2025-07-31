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

  return (
    <ul>
        {data?.map(participant => (
        <li key={participant.id}>
            {participant.name} (Bib: {participant.bib}) - Laps: {participant.laps.length}
        </li>
        ))}
    </ul>
  )
}

export default ParticipantsResultList