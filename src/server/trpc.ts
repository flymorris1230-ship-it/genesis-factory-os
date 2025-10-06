import { initTRPC, TRPCError } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import superjson from 'superjson'
import { randomUUID } from 'crypto'

/**
 * 創建 tRPC context
 * 包含 Prisma client、Supabase session 和用戶信息
 */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const requestId = randomUUID()

  // 從 Request header 中提取 Authorization token
  const authHeader = opts.req.headers.get('authorization')
  let user = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)

    // 創建 Supabase client 驗證 token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser(token)

    if (!error && supabaseUser) {
      // 從數據庫中獲取完整的用戶信息（包含租戶和角色）
      const factoryUser = await prisma.user.findUnique({
        where: { id: supabaseUser.id },
        include: { tenant: true },
      })

      if (factoryUser) {
        user = {
          id: factoryUser.id,
          email: factoryUser.email,
          name: factoryUser.name,
          tenant_id: factoryUser.tenant_id,
          role: factoryUser.role,
          tenant: {
            id: factoryUser.tenant.id,
            code: factoryUser.tenant.code,
            name: factoryUser.tenant.name,
          },
        }
      }
    }
  }

  return {
    prisma,
    user,
    requestId,
    req: opts.req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

/**
 * Protected Procedure
 * 要求用戶已登入
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // 確保 user 不為 null
    },
  })
})
