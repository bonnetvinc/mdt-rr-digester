'use client';

import { api } from '~/trpc/react';
import ShowSegment from './_components/ShowSegment';

function ManageSegment() {
  const { data } = api.segments.listSegments.useQuery();

  return (
    <div>
      {data?.map(item => (
        <ShowSegment key={item.id} segment={item} />
      ))}
    </div>
  );
}

export default ManageSegment;
