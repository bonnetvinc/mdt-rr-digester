import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { fetchParticipants } from '~/server/import/import-participants';

export const adminActionRouter = createTRPCRouter({
  clearParticipantResults: publicProcedure.mutation(async ({ ctx }) => {
    // Clear all participant results
    // Delete in the correct order due to foreign key constraints
    await ctx.db.lapEvent.deleteMany({});
    await ctx.db.lap.deleteMany({});
    await ctx.db.participant.deleteMany({});

    return { success: true, message: 'All participant results cleared' };
  }),

  // Import participants from external API
  importParticipants: publicProcedure.mutation(async ({ ctx }) => {
    const participants = await fetchParticipants();

    console.info('Fetched participants:', participants);

    // Map and save participants to the database
    await Promise.all(
      participants.map(p =>
        ctx.db.participant.upsert({
          where: { bib: p.Bib },
          create: {
            bib: p.Bib,
            name: p.Name
            // team: p.Club
          },
          update: {
            name: p.Name
            // team: p.Club
          }
        })
      )
    );
  })
});
