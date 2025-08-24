import z from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const displaySettingsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) => {
    // On prend le premier enregistrement, sinon valeurs par défaut
    const settings = await ctx.db.displaySettings.findFirst();

    return {
      timerDelay: settings?.timerDelay ?? 8000,
      pageSize: settings?.pageSize ?? 10
    };
  }),
  updateSettings: publicProcedure
    .input(z.object({ timerDelay: z.number().min(1000), pageSize: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const settings = await ctx.db.displaySettings.findFirst();
      if (settings) {
        return ctx.db.displaySettings.update({
          where: { id: settings.id },
          data: input
        });
      } else {
        return ctx.db.displaySettings.create({ data: input });
      }
    })
});
