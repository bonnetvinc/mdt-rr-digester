"use client";

import { api } from "~/trpc/react";
import RaceResultRawDisplay from "./_components/race-result-raw-display";

export default function TeamChallenge() {
  const {isLoading, data, error}= api.raceResultRaw.getAllRaws.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data === null) {
    return <div>Error</div>;
  }

  return (
    <RaceResultRawDisplay
        data={data ?? []} />
  );
}
