import { initTRPC } from '@trpc/server'
import { prisma } from '@/lib/prisma'
import superjson from 'superjson'

/**
 * 創建 tRPC context
 * 包含 Prisma client 和用戶信息
 */
export const createContext = async () => {
  return {
    prisma,
    user: null as {
      id: string
      email: string
      tenant_id: string
      role: string
    } | null,
    requestId: '',
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware
