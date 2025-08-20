import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const segmentRouter = createTRPCRouter({
  listSegments: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.segment.findMany();
  }),

  createSegment: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(['START', 'FINISH', 'BONUS']),
        equipmentId: z.string().nullable().optional(),
        points: z.number().int().default(0),
        distance: z.number().default(0),
        elevation: z.number().default(0)
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.segment.create({
        data: input
      });
    }),

  deleteSegment: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.segment.delete({
        where: { id: input.id }
      });
    }),

  updateSegment: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().min(1),
          type: z.enum(['START', 'FINISH', 'BONUS']),
          equipmentId: z.string().nullable().optional(),
          points: z.number().int().default(0),
          distance: z.number().default(0),
          elevation: z.number().default(0)
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.segment.update({
        where: { id: input.id },
        data: input.data
      });
    })
});
