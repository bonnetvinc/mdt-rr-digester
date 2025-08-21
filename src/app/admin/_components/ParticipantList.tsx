'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { api } from '~/trpc/react';

function ParticipantList() {
  const { data, error, isLoading } = api.participantResults.getAllParticipants.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching participants</div>;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full table-fixed border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4 truncate">Name</TableHead>
            <TableHead className="w-1/8 truncate">Bib</TableHead>
            <TableHead className="w-1/2 truncate">Contest</TableHead>
            <TableHead className="w-1/4 truncate text-right">Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(participant => (
            <TableRow key={participant.id}>
              <TableCell className="truncate font-medium">{participant.name}</TableCell>
              <TableCell className="truncate">{participant.bib}</TableCell>
              <TableCell className="truncate">{participant.contest}</TableCell>
              <TableCell className="truncate text-right">{participant.team}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ParticipantList;
