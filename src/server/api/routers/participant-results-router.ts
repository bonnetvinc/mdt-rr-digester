import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const participantResultsRouter = createTRPCRouter({
  getParticipantsResults: publicProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.participant.findMany({
      include: {
        laps: {
          include: {
            events: {
              include: {
                segment: true
              }
            }
          }
        }
      }
    });
    return results;
  })
});
