import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl mb-2">Genesis Factory OS</CardTitle>
          <CardDescription className="text-lg">
            化妝品工廠的雲端作業系統
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">🏭 WMS - 倉儲管理</h3>
              <p className="text-muted-foreground">物料庫存與倉庫管理</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">⚙️ MES - 製造執行</h3>
              <p className="text-muted-foreground">生產排程與執行追蹤</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">✅ QMS - 品質管理</h3>
              <p className="text-muted-foreground">品質檢驗與稽核</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">🔬 R&D - 研發管理</h3>
              <p className="text-muted-foreground">配方與實驗管理</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">登入系統</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">註冊帳號</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
