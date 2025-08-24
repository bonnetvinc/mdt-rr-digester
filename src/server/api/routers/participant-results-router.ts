import z from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const participantResultsRouter = createTRPCRouter({
  getParticipantsCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.participant.findMany({
      distinct: ['contest'], // 👈 déduplique directement en SQL
      select: {
        contest: true
      }
    });

    return categories.map(c => c.contest);
  }),

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
  }),

  getSortedParticipantsResults: publicProcedure
    .input(z.object({ contest: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.participant.findMany({
        where: input.contest ? { contest: input.contest } : {},
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

      // Calculer totalPoints pour chaque participant sans muter l'objet original
      const participantsWithStats = results
        ?.filter(participant => participant.laps.length > 0)
        .map(participant => {
          const totals = participant.laps
            .filter(lap => lap.endTimestamp !== null)
            .reduce(
              (acc, lap) => {
                lap.events.forEach(event => {
                  if (event.segment) {
                    acc.points += event.segment.points || 0;
                    acc.distance += event.segment.distance || 0;
                    acc.elevation += event.segment.elevation || 0;
                  }
                });
                return acc;
              },
              { points: 0, distance: 0, elevation: 0 }
            );

          return {
            ...participant,
            totalPoints: totals.points,
            totalDistance: totals.distance,
            totalElevation: totals.elevation
          };
        });

      // Trier les participants selon le nombre de points puis le nombre de tours finis (finishedLaps)
      const sortedData = participantsWithStats?.sort((a, b) => {
        const aFinishedLaps = a.laps.filter(lap => lap.endTimestamp !== null).length;
        const bFinishedLaps = b.laps.filter(lap => lap.endTimestamp !== null).length;
        return b.totalPoints - a.totalPoints || bFinishedLaps - aFinishedLaps;
      });

      return sortedData;
    }),

  getAllParticipants: publicProcedure.query(async ({ ctx }) => {
    const participants = await ctx.db.participant.findMany();
    return participants;
  })
});
