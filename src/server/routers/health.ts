import { router, publicProcedure } from '../trpc'

/**
 * Health Check Router
 *
 * 提供系統健康檢查和版本資訊
 */
export const healthRouter = router({
  /**
   * Ping 端點
   * 用於快速健康檢查
   */
  ping: publicProcedure.query(() => ({
    message: 'pong',
    timestamp: new Date().toISOString(),
    status: 'healthy',
  })),

  /**
   * 版本資訊
   * 返回應用版本和環境資訊
   */
  version: publicProcedure.query(() => ({
    version: process.env.APP_VERSION || '0.1.0',
    environment: process.env.APP_ENV || 'development',
    node_version: process.version,
  })),

  /**
   * 數據庫遷移狀態
   * 返回最近的 Prisma migrations
   */
  migrations: publicProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.prisma.$queryRaw<Array<{
        migration_name: string
        finished_at: Date | null
      }>>`
        SELECT migration_name, finished_at
        FROM _prisma_migrations
        ORDER BY finished_at DESC
        LIMIT 5
      `

      return {
        latest_migrations: result,
        status: 'up-to-date',
      }
    } catch (error) {
      return {
        latest_migrations: [],
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }),
})
