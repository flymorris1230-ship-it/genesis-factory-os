import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // 獲取 Factory OS 用戶資訊
  const factoryUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { tenant: true },
  })

  if (!factoryUser) {
    // 用戶不存在於 Factory OS 數據庫，需要進行初始化
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>歡迎使用 Genesis Factory OS</CardTitle>
            <CardDescription>
              您的帳號尚未完成設置，請聯繫系統管理員。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email: {user.email}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Genesis Factory OS
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {factoryUser.tenant.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {factoryUser.name || user.email}
                </p>
                <p className="text-xs text-gray-600">
                  {factoryUser.role}
                </p>
              </div>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  登出
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>倉儲管理 (WMS)</CardTitle>
              <CardDescription>物料庫存與倉庫管理</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                即將推出
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>製造執行 (MES)</CardTitle>
              <CardDescription>生產排程與執行追蹤</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                即將推出
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>品質管理 (QMS)</CardTitle>
              <CardDescription>品質檢驗與稽核</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                即將推出
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>研發管理 (R&D)</CardTitle>
              <CardDescription>配方與實驗管理</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                即將推出
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系統資訊</CardTitle>
              <CardDescription>當前系統狀態</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">租戶代碼:</span>
                <span className="font-medium">{factoryUser.tenant.code}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">子域名:</span>
                <span className="font-medium">{factoryUser.tenant.subdomain}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">用戶 ID:</span>
                <span className="font-mono text-xs">{factoryUser.id.slice(0, 8)}...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
