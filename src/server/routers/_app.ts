import { router } from '../trpc'
import { healthRouter } from './health'

/**
 * Root tRPC Router
 *
 * 所有子 router 都在這裡註冊
 */
export const appRouter = router({
  health: healthRouter,
})

export type AppRouter = typeof appRouter
