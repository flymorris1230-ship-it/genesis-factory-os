import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

/**
 * 創建 Supabase Server Client
 * 用於 Server Components 和 Server Actions
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerComponentClient({ cookies: () => cookieStore })
}

/**
 * 獲取當前用戶 Session
 */
export async function getServerSession() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * 獲取當前用戶
 */
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * 根據 Supabase User 獲取 Factory OS User
 * 包含租戶和角色信息
 */
export async function getFactoryOSUser(supabaseUserId: string) {
  const user = await prisma.user.findFirst({
    where: {
      // 假設我們在創建用戶時使用 Supabase User ID 作為 ID
      // 或者使用 email 匹配
      id: supabaseUserId,
    },
    include: {
      tenant: true,
    },
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenant_id: user.tenant_id,
    tenant: {
      id: user.tenant.id,
      code: user.tenant.code,
      name: user.tenant.name,
      subdomain: user.tenant.subdomain,
    },
  }
}
