"use client";

import { api } from "~/trpc/react";
import RaceResultRawDisplay from "./_components/race-result-raw-display";
import type { RawPassing } from "@prisma/client/edge";

export default function TeamChallenge() {
  const {isLoading, data, error}= api.raceResultRaw.getAllRaws.useQuery<RawPassing[]>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data === null) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Raw Data</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((rawData) => (
          <RaceResultRawDisplay key={rawData.id} data={rawData} />
        ))}
      </div>
    </div>
  );
}
