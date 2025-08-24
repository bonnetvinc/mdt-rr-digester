import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { adminActionRouter } from './routers/admin-actions-router';
import { displaySettingsRouter } from './routers/display-settings';
import { participantResultsRouter } from './routers/participant-results-router';
import { segmentRouter } from './routers/segment-manager';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  participantResults: participantResultsRouter,
  adminActions: adminActionRouter,
  segments: segmentRouter,
  displaySettings: displaySettingsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
