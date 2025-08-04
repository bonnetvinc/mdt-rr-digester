import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const adminActionRouter = createTRPCRouter({
  clearParticipantResults: publicProcedure.mutation(async ({ ctx }) => {
    // Clear all participant results
    // Delete in the correct order due to foreign key constraints
    await ctx.db.lap.deleteMany({});

    return { success: true, message: 'All participant results cleared' };
  })
});
