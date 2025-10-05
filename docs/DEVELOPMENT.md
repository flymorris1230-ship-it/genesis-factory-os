# 開發指南

## 快速開始

### 環境要求

- Node.js 18+ (建議使用 20+)
- npm 或 yarn
- PostgreSQL 15+ (NAS 上運行)
- Git

### 初始設置

1. **克隆專案**
```bash
git clone git@github.com:flymorris1230-ship-it/genesis-factory-os.git
cd genesis-factory-os
```

2. **安裝依賴**
```bash
npm install
```

3. **設置環境變數**
```bash
cp .env.example .env
# 編輯 .env 填入真實值
```

4. **設置數據庫**
```bash
# 生成 Prisma Client
npm run prisma:generate

# 執行遷移
npm run prisma:migrate

# 植入初始數據
npm run db:seed
```

5. **啟動開發伺服器**
```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 開發工作流程

### 創建新功能

1. **搜索優先** - 在創建新文件前先搜索
```bash
# 搜索相關功能
grep -r "material" src/
```

2. **Schema First** - 先定義 Prisma 模型
```prisma
// prisma/schema.prisma
model NewEntity {
  id         String   @id @default(cuid())
  tenant_id  String
  // ...
}
```

3. **執行遷移**
```bash
npm run prisma:migrate
```

4. **創建 tRPC Router**
```typescript
// src/server/routers/new-entity.ts
export const newEntityRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // ...
  }),
})
```

5. **註冊 Router**
```typescript
// src/server/routers/_app.ts
export const appRouter = router({
  health: healthRouter,
  newEntity: newEntityRouter, // 新增
})
```

### 代碼風格

#### TypeScript

```typescript
// ✅ 使用 interface 定義數據結構
interface MaterialListProps {
  page: number
  pageSize: number
}

// ✅ 使用 type 定義聯合類型
type MaterialCategory = 'RAW_MATERIAL' | 'PACKAGING'

// ✅ 函數使用 camelCase
function calculateTotalStock() {}

// ✅ 組件使用 PascalCase
function MaterialList() {}
```

#### Prisma

```prisma
// ✅ 模型名稱：PascalCase 單數
model Material {}

// ✅ 欄位名稱：snake_case
model Material {
  tenant_id String
  created_at DateTime
}
```

### Git Commit 規範

使用 Conventional Commits：

```bash
# 新功能
git commit -m "feat: add material CRUD API"

# 修復
git commit -m "fix: resolve tenant_id filtering issue"

# 文檔
git commit -m "docs: update API documentation"

# 重構
git commit -m "refactor: simplify material query logic"
```

## 測試

### 單元測試 (待實現)

```bash
npm run test
```

### 端對端測試 (待實現)

```bash
npm run test:e2e
```

## 數據庫管理

### Prisma Studio

視覺化數據庫管理工具：

```bash
npm run db:studio
```

### 常用命令

```bash
# 生成 Prisma Client
npm run prisma:generate

# 創建新遷移
npm run prisma:migrate

# 重置數據庫 (⚠️ 會刪除所有數據)
npm run db:reset

# 植入數據
npm run db:seed
```

### 遷移最佳實踐

1. **命名清晰**
```bash
npx prisma migrate dev --name add_material_category_index
```

2. **小步前進** - 每次遷移只做一件事

3. **測試遷移** - 在開發環境先測試

4. **備份生產數據** - 執行生產遷移前先備份

## 除錯

### 啟用 Prisma 查詢日誌

```typescript
// src/lib/prisma.ts
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

### 啟用 tRPC 除錯

```typescript
// src/server/trpc.ts
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  isDev: process.env.NODE_ENV === 'development',
})
```

### 查看結構化日誌

```bash
# 設置日誌等級
export LOG_LEVEL=debug

# 啟動開發伺服器
npm run dev
```

## 常見問題

### Q: 為什麼 Prisma 查詢沒有自動過濾 tenant_id？

A: 目前需要手動在每個查詢中添加：
```typescript
where: { tenant_id: ctx.user.tenant_id }
```

### Q: 如何添加新的環境變數？

A:
1. 在 `.env.example` 中聲明
2. 在 `src/lib/env.ts` 中添加驗證
3. 更新 `docs/ENVIRONMENT.md` 文檔

### Q: tRPC 調用失敗怎麼辦？

A: 檢查：
1. Router 是否正確註冊在 `_app.ts`
2. Procedure 權限是否正確 (public/protected)
3. 查看瀏覽器 Network 面板的錯誤訊息

## 工具推薦

### VSCode 擴展

- **Prisma** - Prisma schema 語法高亮
- **ESLint** - 代碼檢查
- **Tailwind CSS IntelliSense** - Tailwind 自動完成
- **TypeScript Error Translator** - 更友善的錯誤訊息

### 開發工具

- **Prisma Studio** - 數據庫 GUI
- **React Query Devtools** - 查看 React Query 狀態
- **Postman** - API 測試 (雖然我們用 tRPC)

## 相關文檔

- [CLAUDE_GENESIS_FACTORY_OS.md](../CLAUDE_GENESIS_FACTORY_OS.md) - 專案啟動手冊
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架構文檔
- [ENVIRONMENT.md](./ENVIRONMENT.md) - 環境變數管理
