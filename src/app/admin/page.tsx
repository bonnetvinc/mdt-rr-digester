"use client"

import React from 'react'
import { api } from '~/trpc/react';

function page() {

    const { mutate: clearParticipantResults } = api.adminActions.clearParticipantResults.useMutation({
        onSuccess: () => {
            alert("Participant results cleared successfully");
        },
        onError: (error) => {
            console.error("Error clearing participant results:", error);
            alert("Failed to clear participant results");
        }
    });

  return (
    <>
        <div>Admin Page</div>
        <button type="button" onClick={() => clearParticipantResults()} className="bg-red-500 text-white px-4 py-2 rounded">
            Clear Participant Results
        </button>
    </>

  )
}

export default page
  