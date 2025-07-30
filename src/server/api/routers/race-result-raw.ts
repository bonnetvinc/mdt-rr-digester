import type { RawPassing } from "@prisma/client/edge";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const raceResultRawRouter = createTRPCRouter({
    getAllRaws: publicProcedure.query(async ({ ctx }) => {
        const raceResultRaw = await ctx.db.rawPassing.findMany<RawPassing>({
            orderBy: { id: "desc" },
        });

        return raceResultRaw ?? [];
    }),
});
