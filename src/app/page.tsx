export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Genesis Factory OS
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          化妝品工廠雲端作業系統
        </p>
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">🚀 Phase 0: 專案初始化中</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>✅ Next.js 14 + TypeScript</li>
            <li>✅ Tailwind CSS</li>
            <li>⏳ Prisma ORM + PostgreSQL</li>
            <li>⏳ tRPC API</li>
            <li>⏳ Supabase Auth</li>
            <li>⏳ 結構化日誌系統</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
