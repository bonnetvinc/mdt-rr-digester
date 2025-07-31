"use client";

import { api } from "~/trpc/react"
import ParticipantsResultList from "./_components/ParticipantsResultList"

function DisplayResults() {

  const { data, isLoading } = api.participantResults.getParticipantsResults.useQuery(
    undefined,
    {
      refetchInterval: 5000,
    }
  )

  return (
    <>
      <div>SoloResultPage</div>
      <ParticipantsResultList />
    </>
  )
}

export default DisplayResults
