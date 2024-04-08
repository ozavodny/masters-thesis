import { createTRPCRouter } from '~/server/api/trpc'
import { memeRouter } from '~/server/api/routers/meme.router'
import { templateRouter } from './routers/template.router'
import { userRouter } from './routers/user.router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    meme: memeRouter,
    template: templateRouter,
    user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
