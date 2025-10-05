# 【Genesis Factory OS 專案初始化指引】v1.1
## 給 Claude Code 的企業級專案啟動手冊

**文件名**: `CLAUDE_GENESIS_FACTORY_OS.md`
**版本**: v1.1 (企業級戰略強化版)
**更新日期**: 2025-10-05
**用途**: 當 Claude Code 開啟 genesis-factory-os 專案時的首要參考文檔
**重要性**: ⭐⭐⭐⭐⭐ (必讀，所有開發決策的最高指引)

---

## 📋 目錄

1. [專案核心定位](#專案核心定位)
2. [技術棧決策](#技術棧決策)
3. [專案目錄結構](#專案目錄結構)
4. [開發規則 (強制遵守)](#開發規則)
5. [環境變數管理 (NEW)](#環境變數管理)
6. [數據模型規範](#數據模型規範)
7. [初始數據植入 (NEW)](#初始數據植入)
8. [tRPC Router 規範](#trpc-router-規範)
9. [結構化日誌策略 (NEW)](#結構化日誌策略)
10. [系統間 API 金鑰生命週期 (NEW)](#系統間-api-金鑰生命週期)
11. [UI/UX 規範](#uiux-規範)
12. [命名規範](#命名規範)
13. [安全規範](#安全規範)
14. [測試規範](#測試規範)
15. [文檔規範](#文檔規範)
16. [Git 工作流程](#git-工作流程)
17. [與 ai-agent-team-v1 協作指南](#與-ai-agent-team-v1-協作指南)
18. [常見陷阱與避免方法](#常見陷阱與避免方法)
19. [每日檢查清單](#每日檢查清單)
20. [Phase 0 特別提醒](#phase-0-特別提醒)

---

## 🎯 專案核心定位

### What (這是什麼專案)

**Genesis Factory OS** 是一個**化妝品工廠的雲端作業系統 (Cloud-based Factory Operating System)**。

**核心價值主張**:
- 從傳統的本地系統轉型為**多租戶 SaaS 平台**
- 打通 **WMS (倉儲) → MES (製造) → QMS (品質) → R&D (研發)** 的全業務流程
- 符合 **GMP (良好作業規範)** 和**化妝品法規**要求
- 與 **ai-agent-team-v1 (GAC) 共生**，實現 AI 輔助決策

### Why (為什麼要做這個專案)

**問題陳述**:
傳統化妝品工廠面臨：
- ❌ 紙本作業，效率低落
- ❌ 數據孤島，無法追溯
- ❌ 缺乏即時洞察
- ❌ 難以符合法規稽核
- ❌ 系統之間無法互通

**解決方案**:
- ✅ 全數位化、無紙化作業
- ✅ 全流程數據追溯 (原料 → 成品)
- ✅ AI 輔助決策 (與 ai-agent-team-v1 共生)
- ✅ 符合 GMP/ISO 22716 標準
- ✅ 實時可觀測性與審計

### How (如何實現)

**技術棧決策** (不可變更):
```
前端: Next.js 15 (App Router) + React 18 + TypeScript + Tailwind CSS
API: tRPC (Type-safe API without REST)
數據庫: PostgreSQL (Supabase/NAS) + Prisma ORM
認證: Supabase Auth
日誌: Pino (結構化日誌)
部署: Vercel (前端) + Supabase/NAS (數據庫)
AI 輔助: ai-agent-team-v1 (GAC)
可觀測性: Structured Logging + Health Endpoints
```

### 數據庫架構演進策略 (NEW)

**當前狀態** (Sprint 1):
- **開發環境**: Supabase PostgreSQL (Singapore 區域)
- **選擇原因**:
  1. 網段隔離問題 (Mac: 192.168.50.x ≠ NAS: 192.168.1.x)
  2. 開發效率優先，可在任何網絡環境工作
  3. 內建可視化管理工具，優秀的開發者體驗
  4. 零配置，快速啟動

**未來規劃** (Phase 1+):
- **選項 A**: 繼續使用 Supabase PostgreSQL
  - ✅ 優勢: 託管服務、高可用、自動備份、全球 CDN
  - ⚠️ 考量: 成本評估 (Free Tier: 500MB, Paid: $25/月起)

- **選項 B**: 遷移至 NAS PostgreSQL
  - ✅ 優勢: 完全本地化、零雲端成本、數據主權
  - ⚠️ 考量: 需配置 Cloudflare Tunnel 或同網段部署

**遷移成本**: 極低 ⭐
- Prisma 已抽象數據庫層，只需更改 `DATABASE_URL`
- Schema 完全兼容 (都是 PostgreSQL)
- 遷移工具: `pg_dump` + `pg_restore` 或 Prisma Migrate

**決策點**: Sprint 2 結束時評估
- 若 Free Tier 足夠 → 繼續 Supabase
- 若需本地化 → 配置 NAS 網絡後遷移

**架構原則** (必須遵守):
1. **多租戶優先**: 每個功能都必須支持租戶隔離
2. **類型安全**: 100% TypeScript Strict Mode
3. **無 REST**: 全部使用 tRPC，禁止創建 REST API
4. **審計追蹤**: 所有關鍵操作都需要記錄 (created_by, updated_by)
5. **批號追溯**: 從原料到成品的完整追溯鏈
6. **可觀測性優先**: 所有請求都必須有結構化日誌
7. **安全至上**: API Key 生命週期管理、最小權限原則

---

## 📁 專案目錄結構 (強制規範)

```
genesis-factory-os/
├── prisma/
│   ├── schema.prisma          # 數據模型定義
│   ├── seed.ts                # 初始數據植入 (NEW)
│   └── migrations/            # 數據庫遷移記錄
├── src/
│   ├── app/                   # Next.js App Router 頁面
│   │   ├── (auth)/           # 認證相關頁面
│   │   ├── (dashboard)/      # 主應用頁面
│   │   └── api/
│   │       └── trpc/[trpc]/  # tRPC API 端點
│   ├── components/            # React 組件
│   │   ├── ui/               # 基礎 UI 組件 (Shadcn/ui)
│   │   ├── forms/            # 表單組件
│   │   └── modules/          # 業務模組組件
│   ├── server/                # 伺服器端代碼
│   │   ├── routers/          # tRPC Routers
│   │   │   ├── _app.ts      # Root Router
│   │   │   ├── health.ts    # Health Check Router
│   │   │   ├── material.ts
│   │   │   └── ...
│   │   ├── middlewares/      # tRPC 中間件
│   │   │   ├── auth.ts      # 認證中間件
│   │   │   ├── tenant.ts    # 租戶過濾中間件
│   │   │   └── logging.ts   # 日誌中間件 (NEW)
│   │   └── trpc.ts           # tRPC 設定
│   ├── lib/                   # 工具函數
│   │   ├── prisma.ts         # Prisma Client
│   │   ├── auth.ts           # Supabase Auth
│   │   ├── logger.ts         # 結構化日誌 (NEW)
│   │   └── utils.ts
│   └── types/                 # TypeScript 類型定義
├── public/                    # 靜態資源
├── docs/                      # 專案文檔
│   ├── ARCHITECTURE.md       # 架構文檔
│   ├── API.md                # API 文檔
│   ├── DEVELOPMENT.md        # 開發指南
│   ├── ENVIRONMENT.md        # 環境變數文檔 (NEW)
│   └── API-KEYS.md           # API 金鑰管理 SOP (NEW)
├── .env.example               # 環境變數範本 (NEW)
├── .eslintrc.json            # ESLint 配置
├── tsconfig.json             # TypeScript 配置
├── tailwind.config.js        # Tailwind 配置
├── package.json              # 包含 prisma:seed 指令 (NEW)
├── CLAUDE_GENESIS_FACTORY_OS.md  # ← 本文檔 (必讀)
├── GAC_DEV_LOG.md            # GAC 輔助開發日誌
└── README.md
```

**目錄規則**:
1. ✅ **所有新文件都必須放在正確的目錄**
2. ❌ **嚴禁在根目錄創建業務代碼文件**
3. ✅ **組件必須使用 PascalCase 命名**
4. ✅ **工具函數必須使用 camelCase 命名**
5. ✅ **文檔必須放在 docs/ 目錄**

---

## 🚨 開發規則 (強制遵守)

### Rule 1: 搜索優先原則 (SEARCH FIRST)

**在創建任何新文件前，必須先搜索**：

```bash
# 例如：要創建 Material 相關功能前
Grep(pattern="material", glob="**/*.{ts,tsx}")
Grep(pattern="Material", glob="**/*.{ts,tsx}")
```

**決策樹**：
```
發現類似功能存在？
├─ YES → 擴展現有代碼 (Edit)
└─ NO  → 創建新文件 (Write)
        └─ 必須記錄在 CHANGELOG.md
```

---

### Rule 2: Prisma Schema 優先 (Schema First)

**所有數據模型必須先在 Prisma Schema 中定義**：

```prisma
// ✅ 正確：先定義模型
model Material {
  id         String @id @default(cuid())
  tenant_id  String
  code       String
  name       String
  // ...

  tenant     Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@unique([tenant_id, code])
  @@index([tenant_id])
}

// 然後執行 Migration
// npx prisma migrate dev --name add_material
```

**禁止**：
- ❌ 直接在數據庫中手動建表
- ❌ 繞過 Prisma 使用原始 SQL (除非性能調優)

---

### Rule 3: 環境變數顯性化 (Explicit ENV)

**所有環境變數必須在 .env.example 中明確列出**：

```bash
# ❌ 錯誤：直接在代碼中使用未聲明的環境變數
const secret = process.env.MY_SECRET

# ✅ 正確：在 .env.example 中聲明
# 並在開機時驗證
```

**開機檢查** (必須實現)：

```typescript
// src/lib/env.ts
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GAC_API_KEY',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required environment variable: ${envVar}. Please check .env.example`)
  }
}
```

---

### Rule 4: 日誌結構化 (Structured Logging)

**禁止使用 console.log，必須使用結構化日誌**：

```typescript
// ❌ 錯誤
console.log('User created', userId)

// ✅ 正確
logger.info({
  requestId: ctx.requestId,
  tenantId: ctx.user.tenant_id,
  actorId: ctx.user.id,
  event: 'user.created',
  userId,
})
```

---

### Rule 5: 多租戶隔離 (強制)

**所有數據模型都必須包含 `tenant_id`**：

```prisma
// ✅ 正確
model AnyEntity {
  id         String @id @default(cuid())
  tenant_id  String  // 必須
  // ...

  tenant     Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@index([tenant_id])  // 必須建立索引
}
```

---

## 🔐 環境變數管理

### 原則

1. **嚴格區分環境**: development / staging / production
2. **完整文檔**: `.env.example` 必須完整列出所有必要鍵
3. **零明文**: 禁止在 repo 存任何真值
4. **輪替機制**: 規劃 API Key 和密碼的定期輪替
5. **最小權限**: 每個服務只取得必要的環境變數

### 必備環境變數清單

創建 `.env.example`:

```bash
# ==========================================
# Database (NAS PostgreSQL)
# ==========================================
# 格式: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
# 取得方式: NAS 管理員提供，或查看 NAS PostgreSQL 容器配置
DATABASE_URL="postgresql://user:password@192.168.1.114:5532/factory_os"

# ==========================================
# Supabase Auth
# ==========================================
# 取得方式: https://supabase.com/dashboard/project/YOUR-PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"  # ⚠️ 僅伺服器端使用，勿洩漏

# ==========================================
# Interop with ai-agent-team-v1 (GAC)
# ==========================================
# Phase 0: 使用 UUID 佔位
# Phase 1: 改用租戶級 API Key 管理（見章「API 金鑰生命週期」）
GAC_API_KEY="a-secure-random-string-for-gac-to-use"

# ==========================================
# Observability (建議)
# ==========================================
LOG_LEVEL="info"         # debug|info|warn|error
APP_ENV="development"    # development|staging|production
APP_VERSION="0.1.0+dev"  # CI/CD 注入 git sha

# ==========================================
# JWT Secret (用於內部 Token 簽名)
# ==========================================
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### 開機驗證 (必須實現)

創建 `src/lib/env.ts`:

```typescript
/**
 * Environment Variables Validation
 * 在應用啟動時驗證所有必要的環境變數
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GAC_API_KEY',
  'JWT_SECRET',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach((key) => console.error(`   - ${key}`))
    console.error('\n📄 Please check .env.example for reference')
    process.exit(1)
  }

  console.log('✅ All required environment variables are set')
}

// 在 next.config.js 中調用
validateEnv()
```

### 環境變數文檔

創建 `docs/ENVIRONMENT.md`:

```markdown
# 環境變數管理文檔

## 變數清單

| 變數名 | 用途 | 取得方式 | 輪替週期 | 責任人 |
|--------|------|---------|---------|--------|
| DATABASE_URL | PostgreSQL 連線 | NAS 管理員 | 季度 | DevOps |
| SUPABASE_SERVICE_ROLE_KEY | Supabase 管理操作 | Supabase Dashboard | 半年 | Tech Lead |
| GAC_API_KEY | 與 GAC 互認 | 內部生成 | 季度 | Tech Lead |
| JWT_SECRET | Token 簽名 | 隨機生成 | 半年 | Security Team |

## 輪替流程

### DATABASE_URL 輪替

1. 在 NAS 創建新的 PostgreSQL 用戶
2. 授予相同權限
3. 更新 Vercel 環境變數
4. 驗證連接
5. 撤銷舊用戶權限

### API Key 輪替

1. 使用租戶級 API Key 管理功能生成新 Key
2. 通知 GAC 團隊
3. 設置寬限期 (72小時)
4. 撤銷舊 Key

## 異常處理

- 發現洩漏：立即輪替所有受影響的密鑰
- 遺失訪問：使用應急恢復流程
- 合規審計：提供環境變數變更日誌
```

---

## 🌱 初始數據植入

### 目標

- 自動化產出第一個 **Tenant**、首位**系統管理員**、**核心字典資料**
- 避免手動 SQL 帶來環境不一致與合規風險
- 支持**冪等**執行 (多次運行結果一致)
- **環境感知** (dev 可豐富、prod 僅最小)

### 原則

1. **冪等性**: 多次執行結果一致，使用 `upsert` 而非 `create`
2. **環境感知**: 開發環境可插入樣例數據，生產環境僅最小集
3. **無硬編密碼**: 敏感值改為「一次性設置流程」
4. **審計軌跡**: 所有 seed 寫入審計記錄

### 配置 package.json

```json
{
  "scripts": {
    "prisma:seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts",
    "db:seed": "npm run prisma:seed",
    "db:reset": "npx prisma migrate reset && npm run prisma:seed"
  }
}
```

### 實現 prisma/seed.ts

```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  const env = process.env.APP_ENV || 'development'
  console.log(`📦 Environment: ${env}`)

  // ==========================================
  // 1. 創建第一個 Tenant
  // ==========================================
  const tenant = await prisma.tenant.upsert({
    where: { code: 'demo' },
    update: {},
    create: {
      code: 'demo',
      name: 'Genesis Demo Factory',
      subdomain: 'demo',
    },
  })
  console.log('✅ Tenant created:', tenant.name)

  // ==========================================
  // 2. 創建系統管理員
  // ==========================================
  // ⚠️ 注意: 實際密碼應通過 Supabase Auth 創建
  // 這裡僅創建 User 記錄以建立關聯
  const adminUser = await prisma.user.upsert({
    where: {
      tenant_id_email: {
        tenant_id: tenant.id,
        email: 'admin@genesis-demo.com',
      },
    },
    update: {},
    create: {
      tenant_id: tenant.id,
      email: 'admin@genesis-demo.com',
      name: 'System Administrator',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // ==========================================
  // 3. 創建核心字典資料 - 單位 (Unit)
  // ==========================================
  const units = ['kg', 'g', 'mg', 'L', 'ml', 'piece', 'box', 'carton']

  for (const unitCode of units) {
    await prisma.unit.upsert({
      where: {
        tenant_id_code: {
          tenant_id: tenant.id,
          code: unitCode,
        },
      },
      update: {},
      create: {
        tenant_id: tenant.id,
        code: unitCode,
        name: unitCode.toUpperCase(),
      },
    })
  }
  console.log(`✅ Units created: ${units.length}`)

  // ==========================================
  // 4. 創建倉庫 (Warehouse)
  // ==========================================
  const warehouses = [
    { code: 'WH-01', name: '原料倉' },
    { code: 'WH-02', name: '包材倉' },
    { code: 'WH-03', name: '成品倉' },
  ]

  for (const wh of warehouses) {
    await prisma.warehouse.upsert({
      where: {
        tenant_id_code: {
          tenant_id: tenant.id,
          code: wh.code,
        },
      },
      update: {},
      create: {
        tenant_id: tenant.id,
        code: wh.code,
        name: wh.name,
      },
    })
  }
  console.log(`✅ Warehouses created: ${warehouses.length}`)

  // ==========================================
  // 5. 開發環境：插入樣例數據
  // ==========================================
  if (env === 'development') {
    console.log('📦 Inserting sample data for development...')

    // 樣例供應商
    const supplier = await prisma.supplier.upsert({
      where: {
        tenant_id_code: {
          tenant_id: tenant.id,
          code: 'SUP-001',
        },
      },
      update: {},
      create: {
        tenant_id: tenant.id,
        code: 'SUP-001',
        name: 'Sample Supplier Co.',
        contact_person: 'John Doe',
        contact_phone: '02-1234-5678',
      },
    })

    // 樣例物料
    const materials = [
      {
        code: 'RM-001',
        name: '玻尿酸原液',
        category: 'RAW_MATERIAL',
        unit: 'kg',
        min_stock: 10,
      },
      {
        code: 'PM-001',
        name: '50ml 玻璃瓶',
        category: 'PACKAGING',
        unit: 'piece',
        min_stock: 1000,
      },
    ]

    for (const mat of materials) {
      await prisma.material.upsert({
        where: {
          tenant_id_code: {
            tenant_id: tenant.id,
            code: mat.code,
          },
        },
        update: {},
        create: {
          tenant_id: tenant.id,
          supplier_id: supplier.id,
          code: mat.code,
          name: mat.name,
          category: mat.category as any,
          unit: mat.unit,
          min_stock: mat.min_stock,
          current_stock: 0,
        },
      })
    }
    console.log(`✅ Sample materials created: ${materials.length}`)
  }

  // ==========================================
  // 6. 記錄審計日誌
  // ==========================================
  await prisma.auditLog.create({
    data: {
      tenant_id: tenant.id,
      actor_id: adminUser.id,
      action: 'DATABASE_SEED',
      entity_type: 'SYSTEM',
      entity_id: 'seed',
      metadata: {
        environment: env,
        timestamp: new Date().toISOString(),
      },
    },
  })
  console.log('✅ Audit log recorded')

  console.log('✨ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 使用方式

```bash
# 初次執行 seed
npm run db:seed

# 重置數據庫並 seed (⚠️ 會刪除所有數據)
npm run db:reset

# 驗證 seed 冪等性 (多次執行應無錯誤)
npm run db:seed
npm run db:seed
npm run db:seed
```

### 驗收標準

- ✅ 重複執行 seed 無報錯
- ✅ Tenant × User 關係唯一
- ✅ 字典資料完整 (Unit, Warehouse)
- ✅ 開發環境有樣例數據，生產環境無
- ✅ 審計表有 seed 記錄

---

## 📝 數據模型規範

### 核心模型擴展 (整合 API Key 生命週期)

```prisma
// prisma/schema.prisma

model Tenant {
  id         String   @id @default(cuid())
  code       String   @unique
  name       String
  subdomain  String   @unique

  // API Key 管理 (NEW)
  apiKeyHash        String?   // 單向雜湊，不存明文
  apiKeyCreatedAt   DateTime?
  apiKeyLastUsedAt  DateTime?
  apiKeyScopes      String[]  // ["read:health", "read:capabilities"]

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  users      User[]
  materials  Material[]
  suppliers  Supplier[]
  auditLogs  AuditLog[]

  @@index([subdomain])
  @@index([apiKeyCreatedAt])
}

model User {
  id         String   @id @default(cuid())
  tenant_id  String
  email      String
  name       String?
  role       String   @default("USER") // ADMIN, USER, VIEWER
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  tenant     Tenant   @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@unique([tenant_id, email])
  @@index([tenant_id])
  @@index([email])
}

model AuditLog {
  id          String   @id @default(cuid())
  tenant_id   String
  actor_id    String
  action      String   // DATABASE_SEED, API_KEY_GENERATED, etc.
  entity_type String
  entity_id   String
  metadata    Json?
  created_at  DateTime @default(now())

  tenant      Tenant   @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@index([tenant_id])
  @@index([actor_id])
  @@index([action])
  @@index([created_at])
}

// 其他模型...
model Material {
  id            String   @id @default(cuid())
  tenant_id     String
  code          String
  name          String
  name_en       String?
  category      MaterialCategory
  unit          String
  supplier_id   String?
  cas_number    String?
  gmp_approved  Boolean  @default(false)
  min_stock     Float    @default(0)
  current_stock Float    @default(0)
  specifications Json?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  tenant        Tenant         @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
  supplier      Supplier?      @relation(fields: [supplier_id], references: [id], onDelete: SetNull)

  @@unique([tenant_id, code])
  @@index([tenant_id, category])
  @@index([supplier_id])
}

enum MaterialCategory {
  RAW_MATERIAL
  PACKAGING
  SEMI_FINISHED
  FINISHED_GOODS
}

model Supplier {
  id             String   @id @default(cuid())
  tenant_id      String
  code           String
  name           String
  contact_person String?
  contact_phone  String?
  contact_email  String?
  created_at     DateTime @default(now())
  updated_at     DateTime @updatedAt

  tenant         Tenant   @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
  materials      Material[]

  @@unique([tenant_id, code])
  @@index([tenant_id])
}

model Unit {
  id         String   @id @default(cuid())
  tenant_id  String
  code       String   // kg, g, L, ml
  name       String
  created_at DateTime @default(now())

  tenant     Tenant   @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@unique([tenant_id, code])
  @@index([tenant_id])
}

model Warehouse {
  id         String   @id @default(cuid())
  tenant_id  String
  code       String
  name       String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  tenant     Tenant   @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@unique([tenant_id, code])
  @@index([tenant_id])
}
```

---

## 🔍 結構化日誌策略

### 目標

在 Vercel serverless + NAS 架構下，提供：
- ✅ **可追溯**: 每個請求有唯一 ID
- ✅ **可匯集**: 結構化 JSON 日誌便於分析
- ✅ **可審計**: 符合 GMP/法規要求

### 原則

1. **結構化 JSON**: 使用 Pino 或等價方案
2. **關聯 ID**: 每個請求附上 `x-request-id`
3. **最小必填欄位**: timestamp, level, requestId, tenantId, actorId, path, type, duration_ms, ok
4. **隱私保護**: 不記錄 PII/密鑰，必要時遮罩

### 實現

#### 安裝依賴

```bash
npm install pino pino-pretty
npm install --save-dev @types/pino
```

#### 創建 Logger (src/lib/logger.ts)

```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
})

export type LogContext = {
  requestId: string
  tenantId?: string
  actorId?: string
  path: string
  method: string
  duration_ms?: number
  ok?: boolean
  error?: {
    code: string
    message: string
  }
}
```

#### tRPC 日誌中間件 (src/server/middlewares/logging.ts)

```typescript
import { TRPCError } from '@trpc/server'
import { middleware } from '../trpc'
import { logger } from '@/lib/logger'
import { randomUUID } from 'crypto'

export const loggingMiddleware = middleware(async ({ ctx, next, path, type }) => {
  const requestId = randomUUID()
  const startTime = Date.now()

  // 記錄請求開始
  logger.info({
    requestId,
    tenantId: ctx.user?.tenant_id,
    actorId: ctx.user?.id,
    path,
    type,
    event: 'request.start',
  })

  try {
    const result = await next({
      ctx: {
        ...ctx,
        requestId,
      },
    })

    const duration_ms = Date.now() - startTime

    // 記錄成功
    logger.info({
      requestId,
      tenantId: ctx.user?.tenant_id,
      actorId: ctx.user?.id,
      path,
      type,
      duration_ms,
      ok: true,
      event: 'request.success',
    })

    return result
  } catch (error) {
    const duration_ms = Date.now() - startTime

    // 記錄錯誤
    if (error instanceof TRPCError) {
      logger.error({
        requestId,
        tenantId: ctx.user?.tenant_id,
        actorId: ctx.user?.id,
        path,
        type,
        duration_ms,
        ok: false,
        error: {
          code: error.code,
          message: error.message,
        },
        event: 'request.error',
      })
    } else {
      logger.error({
        requestId,
        tenantId: ctx.user?.tenant_id,
        actorId: ctx.user?.id,
        path,
        type,
        duration_ms,
        ok: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        event: 'request.error',
      })
    }

    throw error
  }
})
```

#### 在 tRPC 中使用

```typescript
// src/server/trpc.ts
import { loggingMiddleware } from './middlewares/logging'

export const publicProcedure = t.procedure.use(loggingMiddleware)
export const protectedProcedure = publicProcedure.use(authMiddleware)
```

### Health 端點擴展

```typescript
// src/server/routers/health.ts
import { router, publicProcedure } from '../trpc'

export const healthRouter = router({
  ping: publicProcedure.query(() => ({
    message: 'pong',
    timestamp: new Date().toISOString(),
    status: 'healthy',
  })),

  version: publicProcedure.query(() => ({
    version: process.env.APP_VERSION || '0.1.0',
    environment: process.env.APP_ENV || 'development',
    node_version: process.version,
  })),

  migrations: publicProcedure.query(async ({ ctx }) => {
    // 查詢 Prisma migrations 狀態
    const result = await ctx.prisma.$queryRaw`
      SELECT migration_name, finished_at
      FROM _prisma_migrations
      ORDER BY finished_at DESC
      LIMIT 5
    `
    return {
      latest_migrations: result,
      status: 'up-to-date',
    }
  }),
})
```

---

## 🔑 系統間 API 金鑰生命週期

### 目標

與 **ai-agent-team-v1 (GAC)** 之間的租戶級互信：
- ✅ 從 Day 1 有**生成/輪替/撤銷**能力
- ✅ 全程**可審計**
- ✅ 支持**範圍控制** (scopes)
- ✅ 支持**寬限期輪替** (雙活)

### 數據模型 (已在 Prisma Schema 中定義)

```prisma
model Tenant {
  // ...
  apiKeyHash        String?   // 單向雜湊 (bcrypt)
  apiKeyCreatedAt   DateTime?
  apiKeyLastUsedAt  DateTime?
  apiKeyScopes      String[]  // ["read:health", "read:capabilities", "write:ingest"]
  // ...
}
```

### API 端點實現

創建 `src/server/routers/api-keys.ts`:

```typescript
import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { hash, compare } from 'bcrypt'
import { randomBytes } from 'crypto'
import { TRPCError } from '@trpc/server'

export const apiKeysRouter = router({
  /**
   * 生成新的 API Key
   * ⚠️ 只有 ADMIN 角色可執行
   */
  generate: protectedProcedure
    .input(z.object({
      scopes: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 權限檢查
      if (ctx.user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can generate API keys',
        })
      }

      // 生成 API Key (明文)
      const apiKey = `gf_${randomBytes(32).toString('hex')}`

      // 雜湊後儲存
      const apiKeyHash = await hash(apiKey, 10)

      // 更新 Tenant
      await ctx.prisma.tenant.update({
        where: { id: ctx.user.tenant_id },
        data: {
          apiKeyHash,
          apiKeyCreatedAt: new Date(),
          apiKeyScopes: input.scopes || ['read:health'],
        },
      })

      // 記錄審計
      await ctx.prisma.auditLog.create({
        data: {
          tenant_id: ctx.user.tenant_id,
          actor_id: ctx.user.id,
          action: 'API_KEY_GENERATED',
          entity_type: 'TENANT',
          entity_id: ctx.user.tenant_id,
          metadata: {
            scopes: input.scopes,
            requestId: ctx.requestId,
          },
        },
      })

      // ⚠️ 明文僅返回這一次
      return {
        apiKey, // 明文，請立即妥善保存
        scopes: input.scopes || ['read:health'],
        createdAt: new Date(),
        message: '⚠️ This key will only be shown once. Please save it securely.',
      }
    }),

  /**
   * 撤銷 API Key
   */
  revoke: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can revoke API keys',
        })
      }

      await ctx.prisma.tenant.update({
        where: { id: ctx.user.tenant_id },
        data: {
          apiKeyHash: null,
          apiKeyScopes: [],
        },
      })

      // 記錄審計
      await ctx.prisma.auditLog.create({
        data: {
          tenant_id: ctx.user.tenant_id,
          actor_id: ctx.user.id,
          action: 'API_KEY_REVOKED',
          entity_type: 'TENANT',
          entity_id: ctx.user.tenant_id,
          metadata: {
            requestId: ctx.requestId,
          },
        },
      })

      return { success: true, message: 'API Key revoked successfully' }
    }),

  /**
   * 查看當前 API Key 狀態 (不返回明文)
   */
  status: protectedProcedure
    .query(async ({ ctx }) => {
      const tenant = await ctx.prisma.tenant.findUnique({
        where: { id: ctx.user.tenant_id },
        select: {
          apiKeyHash: true,
          apiKeyCreatedAt: true,
          apiKeyLastUsedAt: true,
          apiKeyScopes: true,
        },
      })

      return {
        exists: !!tenant?.apiKeyHash,
        createdAt: tenant?.apiKeyCreatedAt,
        lastUsedAt: tenant?.apiKeyLastUsedAt,
        scopes: tenant?.apiKeyScopes || [],
      }
    }),
})
```

### API Key 驗證中間件

創建 `src/server/middlewares/api-key.ts`:

```typescript
import { TRPCError } from '@trpc/server'
import { compare } from 'bcrypt'
import { middleware } from '../trpc'

/**
 * API Key 驗證中間件
 * 用於機器對機器端點 (如 GAC 調用的端點)
 */
export const apiKeyMiddleware = middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req?.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid authorization header',
    })
  }

  const apiKey = authHeader.substring(7)

  // 從 API Key 前綴提取租戶 (如果使用 gf_tenantid_xxx 格式)
  // 或者從請求中的其他地方獲取租戶信息

  // 查詢所有租戶的 API Key (簡化版，生產環境應優化)
  const tenants = await ctx.prisma.tenant.findMany({
    where: {
      apiKeyHash: { not: null },
    },
    select: {
      id: true,
      apiKeyHash: true,
      apiKeyScopes: true,
    },
  })

  let matchedTenant = null

  // 驗證 API Key
  for (const tenant of tenants) {
    if (tenant.apiKeyHash && await compare(apiKey, tenant.apiKeyHash)) {
      matchedTenant = tenant
      break
    }
  }

  if (!matchedTenant) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid API key',
    })
  }

  // 更新最後使用時間
  await ctx.prisma.tenant.update({
    where: { id: matchedTenant.id },
    data: {
      apiKeyLastUsedAt: new Date(),
    },
  })

  // 記錄 API Key 使用
  await ctx.prisma.auditLog.create({
    data: {
      tenant_id: matchedTenant.id,
      actor_id: 'api-key',
      action: 'API_KEY_USED',
      entity_type: 'API',
      entity_id: ctx.path,
      metadata: {
        requestId: ctx.requestId,
        scopes: matchedTenant.apiKeyScopes,
      },
    },
  })

  return next({
    ctx: {
      ...ctx,
      apiKeyTenant: matchedTenant,
    },
  })
})

// 受 API Key 保護的 Procedure
export const apiKeyProcedure = t.procedure.use(apiKeyMiddleware)
```

### 使用範例

```typescript
// src/server/routers/gac-integration.ts
import { router, apiKeyProcedure } from '../trpc'

export const gacRouter = router({
  /**
   * GAC 健康檢查端點
   * 使用 API Key 驗證
   */
  healthCheck: apiKeyProcedure
    .query(async ({ ctx }) => {
      return {
        status: 'healthy',
        tenant_id: ctx.apiKeyTenant.id,
        timestamp: new Date().toISOString(),
      }
    }),

  /**
   * GAC 獲取系統能力
   */
  capabilities: apiKeyProcedure
    .query(async ({ ctx }) => {
      // 檢查 scope
      if (!ctx.apiKeyTenant.apiKeyScopes.includes('read:capabilities')) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'API key does not have read:capabilities scope',
        })
      }

      return {
        features: ['wms', 'mes', 'qms'],
        version: '1.0.0',
      }
    }),
})
```

### API Keys 管理 SOP

創建 `docs/API-KEYS.md`:

```markdown
# API Keys 管理 SOP

## 生成 API Key

### 誰可以生成
- 只有租戶的 **ADMIN** 角色可以生成

### 生成流程
1. 登入 Factory OS 管理後台
2. 進入「設定」→「API Keys」
3. 點擊「生成新 Key」
4. 選擇授權範圍 (Scopes):
   - `read:health` - 讀取健康狀態
   - `read:capabilities` - 讀取系統能力
   - `write:ingest` - 寫入數據 (⚠️ 高風險)
5. 點擊「生成」
6. **立即複製並妥善保存 API Key** (只顯示一次)
7. 將 API Key 提供給需要整合的系統 (如 GAC)

### 安全注意事項
- ✅ API Key 應存儲在環境變數或祕密管理系統
- ❌ 禁止將 API Key 提交到 Git
- ❌ 禁止在日誌中記錄 API Key
- ✅ 定期輪替 (建議每季度)

## 輪替 API Key

### 為什麼需要輪替
- 定期更換密鑰是安全最佳實踐
- 懷疑洩漏時立即輪替
- 員工離職時輪替

### 輪替流程 (零停機)
1. 生成新的 API Key (保留舊 Key)
2. 設置寬限期 (建議 72 小時)
3. 通知整合方 (如 GAC 團隊)
4. 整合方更新為新 Key
5. 驗證新 Key 可用
6. 寬限期結束後，撤銷舊 Key

### 緊急輪替 (發現洩漏)
1. 立即撤銷舊 Key
2. 立即生成新 Key
3. 緊急通知整合方
4. 調查洩漏原因
5. 記錄事故報告

## 撤銷 API Key

### 何時撤銷
- 不再需要整合
- 發現 Key 洩漏
- 安全審計要求

### 撤銷流程
1. 確認影響範圍 (哪些系統使用此 Key)
2. 通知相關方
3. 執行撤銷
4. 驗證撤銷生效 (測試調用應返回 401)

## 審計與合規

### 審計記錄
所有 API Key 操作都會記錄在 `audit_logs` 表：
- 生成時間、操作人
- 最後使用時間
- 撤銷時間、操作人
- 每次使用記錄

### 定期檢查 (每月)
- [ ] 檢查所有 API Key 的最後使用時間
- [ ] 撤銷超過 90 天未使用的 Key
- [ ] 檢查異常使用模式
- [ ] 更新 API Key 清單文檔

### 合規要求
- 符合 ISO 27001 密鑰管理要求
- 符合 GMP 系統訪問控制要求
- 保留審計記錄至少 2 年

## 常見問題

### Q: API Key 忘記保存怎麼辦？
A: 必須撤銷舊 Key 並生成新 Key，無法恢復。

### Q: 可以同時有多個 API Key 嗎？
A: 目前每個租戶只能有一個有效 Key。如需多個，請聯繫技術團隊。

### Q: API Key 的權限如何控制？
A: 通過 Scopes 控制，生成時選擇授權範圍。

### Q: 如何測試 API Key 是否有效？
A: 使用 curl 測試：
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://factory-os.your-domain.com/api/trpc/gac.healthCheck
```

## 責任人

- **API Key 生成**: 租戶管理員
- **API Key 輪替**: DevOps 團隊
- **安全審計**: Security Team
- **緊急響應**: On-call Engineer

## 聯絡方式

- 技術支援: tech-support@your-company.com
- 安全事件: security@your-company.com
- 緊急熱線: (02) 1234-5678
```

---

## 🎨 tRPC Router 規範

**每個業務模組必須有獨立的 Router**：

```typescript
// src/server/routers/material.ts
import { router, protectedProcedure, publicProcedure } from '../trpc'
import { z } from 'zod'

export const materialRouter = router({
  // ✅ 正確：使用 Zod 驗證
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      category: z.enum(['RAW_MATERIAL', 'PACKAGING', 'FINISHED_GOODS']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, category } = input

      // ✅ 正確：自動過濾 tenant_id
      const materials = await ctx.prisma.material.findMany({
        where: {
          tenant_id: ctx.user.tenant_id, // 多租戶過濾
          ...(category && { category }),
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
      })

      const total = await ctx.prisma.material.count({
        where: {
          tenant_id: ctx.user.tenant_id,
          ...(category && { category }),
        },
      })

      return {
        materials,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      }
    }),

  // ✅ 正確：使用 mutation 處理寫操作
  create: protectedProcedure
    .input(z.object({
      code: z.string().min(1),
      name: z.string().min(1),
      category: z.enum(['RAW_MATERIAL', 'PACKAGING', 'FINISHED_GOODS']),
      unit: z.string(),
      min_stock: z.number().min(0).default(0),
      supplier_id: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const material = await ctx.prisma.material.create({
          data: {
            ...input,
            tenant_id: ctx.user.tenant_id, // 自動添加 tenant_id
            current_stock: 0,
          },
        })

        // 記錄審計
        await ctx.prisma.auditLog.create({
          data: {
            tenant_id: ctx.user.tenant_id,
            actor_id: ctx.user.id,
            action: 'MATERIAL_CREATED',
            entity_type: 'MATERIAL',
            entity_id: material.id,
            metadata: {
              requestId: ctx.requestId,
              code: material.code,
            },
          },
        })

        return material
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Material code already exists',
          })
        }
        throw error
      }
    }),
})
```

**命名規範**：
- `list` - 列表查詢 (帶分頁)
- `get` - 單筆查詢
- `create` - 新增
- `update` - 更新
- `delete` - 刪除 (軟刪除優先)

---

## 🎨 UI/UX 規範

### 使用 Shadcn/ui 組件庫

**安裝**：
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
```

**組件使用規範**：
```typescript
// ✅ 正確：使用 Shadcn/ui
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table } from '@/components/ui/table'

// ❌ 錯誤：手寫基礎組件
const MyButton = () => <button>...</button>
```

### 表單規範

**使用 React Hook Form + Zod**：

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const materialSchema = z.object({
  code: z.string().min(1, '物料代碼為必填'),
  name: z.string().min(1, '物料名稱為必填'),
  category: z.enum(['RAW_MATERIAL', 'PACKAGING', 'FINISHED_GOODS']),
  unit: z.string().min(1),
  min_stock: z.number().min(0).default(0),
})

type MaterialFormData = z.infer<typeof materialSchema>

export function MaterialForm() {
  const { toast } = useToast()
  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  })

  const createMaterial = trpc.material.create.useMutation({
    onSuccess: () => {
      toast({
        title: '創建成功',
        description: '物料已成功創建',
      })
      form.reset()
    },
    onError: (error) => {
      toast({
        title: '創建失敗',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (data: MaterialFormData) => {
    await createMaterial.mutateAsync(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>物料代碼</label>
        <Input {...form.register('code')} />
        {form.formState.errors.code && (
          <p className="text-red-600 text-sm">{form.formState.errors.code.message}</p>
        )}
      </div>

      {/* 其他欄位... */}

      <Button type="submit" disabled={createMaterial.isLoading}>
        {createMaterial.isLoading ? '創建中...' : '創建'}
      </Button>
    </form>
  )
}
```

---

## 📝 命名規範

### 資料庫命名

```prisma
// ✅ 模型名稱：PascalCase 單數
model Material { }
model StockTransaction { }

// ✅ 欄位名稱：snake_case
model Material {
  tenant_id String
  created_at DateTime
}

// ✅ 關聯名稱：camelCase
model Material {
  stockTransactions StockTransaction[]
}
```

### TypeScript 命名

```typescript
// ✅ 介面：PascalCase
interface MaterialListProps { }

// ✅ 類型：PascalCase
type MaterialCategory = 'RAW_MATERIAL' | 'PACKAGING'

// ✅ 函數：camelCase
function calculateTotalStock() { }

// ✅ 常數：UPPER_SNAKE_CASE
const MAX_BATCH_SIZE = 1000

// ✅ 組件：PascalCase
function MaterialList() { }
```

---

## 🔐 安全規範

### 認證與授權

**Supabase Auth 整合**：

```typescript
// src/lib/auth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
```

**tRPC Context**：

```typescript
// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const createContext = async () => {
  const session = await getServerSession()

  return {
    prisma,
    session,
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      tenant_id: session.user.user_metadata.tenant_id,
      role: session.user.user_metadata.role,
    } : null,
  }
}

const t = initTRPC.context<typeof createContext>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx })
})
```

---

## 🧪 測試規範

### 單元測試

**使用 Vitest**：

```typescript
// src/server/routers/material.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { appRouter } from './_app'
import { createContext } from '../trpc'

describe('Material Router', () => {
  let ctx: any

  beforeEach(async () => {
    ctx = await createContext()
  })

  it('should list materials', async () => {
    const caller = appRouter.createCaller(ctx)

    const result = await caller.material.list({
      page: 1,
      pageSize: 20
    })

    expect(result).toBeDefined()
    expect(Array.isArray(result.materials)).toBe(true)
    expect(result.pagination).toBeDefined()
  })

  it('should create material', async () => {
    const caller = appRouter.createCaller(ctx)

    const material = await caller.material.create({
      code: 'TEST-001',
      name: 'Test Material',
      category: 'RAW_MATERIAL',
      unit: 'kg',
      min_stock: 10,
    })

    expect(material.code).toBe('TEST-001')
    expect(material.tenant_id).toBe(ctx.user.tenant_id)
  })
})
```

---

## 📚 文檔規範

### API 文檔

**每個 Router 都必須有註釋**：

```typescript
/**
 * Material Router
 *
 * 物料主資料管理 API
 *
 * @module material
 */
export const materialRouter = router({
  /**
   * 查詢物料清單
   *
   * @param page - 頁碼 (從 1 開始)
   * @param pageSize - 每頁筆數 (1-100)
   * @param category - 物料類別 (可選)
   *
   * @returns 物料清單與分頁資訊
   *
   * @example
   * ```typescript
   * const materials = await trpc.material.list.query({
   *   page: 1,
   *   pageSize: 20,
   *   category: 'RAW_MATERIAL'
   * })
   * ```
   */
  list: protectedProcedure
    .input(z.object({ ... }))
    .query(async ({ ctx, input }) => { ... }),
})
```

---

## 🚀 Git 工作流程

### Commit 規範

**使用 Conventional Commits**：

```bash
# ✅ 正確
git commit -m "feat: add material CRUD API"
git commit -m "fix: resolve tenant_id filtering issue"
git commit -m "docs: update API documentation"
git commit -m "chore: add environment validation"

# 類型：
# feat: 新功能
# fix: 修復
# docs: 文檔
# style: 格式
# refactor: 重構
# test: 測試
# chore: 雜項
```

---

## 🤝 與 ai-agent-team-v1 協作指南

### 何時使用 GAC

**適合使用 GAC 的場景**：
1. ✅ **規劃階段**：請 Product Manager Agent 撰寫 PRD
2. ✅ **設計階段**：請 Solution Architect Agent 設計架構
3. ✅ **前端開發**：請 Frontend Developer Agent 生成 React 組件
4. ✅ **Code Review**：請 Backend Developer Agent 審查代碼質量

**不適合使用 GAC 的場景**：
1. ❌ **後端代碼生成**：Backend Developer Agent 目前不生成實際代碼
2. ❌ **複雜業務邏輯**：GAC 缺乏領域知識
3. ❌ **性能調優**：需要人工分析

### 使用 GAC 的流程

**必須在 GAC_DEV_LOG.md 中記錄每次使用**

---

## ⚠️ 常見陷阱與避免方法

### 陷阱 1: 多租戶數據洩漏

```typescript
// ❌ 危險：忘記過濾 tenant_id
const materials = await prisma.material.findMany()

// ✅ 安全：始終過濾 tenant_id
const materials = await prisma.material.findMany({
  where: { tenant_id: ctx.user.tenant_id }
})
```

### 陷阱 2: 環境變數未驗證

```typescript
// ❌ 危險：直接使用可能不存在的環境變數
const dbUrl = process.env.DATABASE_URL

// ✅ 安全：開機時驗證
validateEnv() // 在 next.config.js 中調用
```

### 陷阱 3: 日誌記錄敏感信息

```typescript
// ❌ 危險：記錄密碼
logger.info({ password: user.password })

// ✅ 安全：遮罩敏感信息
logger.info({
  email: user.email,
  // 不記錄密碼
})
```

---

## 📋 每日檢查清單

### 開發前檢查

- [ ] 已閱讀本文檔 (CLAUDE_GENESIS_FACTORY_OS.md)
- [ ] 已閱讀當前 Sprint 的 JOURNAL
- [ ] 已更新 `git pull origin main`
- [ ] 已確認 Factory OS 和 NAS PostgreSQL 正常運行
- [ ] 已驗證環境變數完整

### 開發後檢查

- [ ] 代碼已通過 TypeScript 編譯 (`npm run build`)
- [ ] 代碼已通過 ESLint (`npm run lint`)
- [ ] 已添加必要的註釋
- [ ] 已更新相關文檔
- [ ] 已提交 Git Commit (Conventional Commits)
- [ ] 已記錄在今日 JOURNAL
- [ ] 日誌輸出結構正確
- [ ] 多租戶過濾正確

### 使用 GAC 後檢查

- [ ] 已在 GAC_DEV_LOG.md 記錄
- [ ] 已評估 GAC 輸出質量
- [ ] 已決定採用率
- [ ] 已記錄經驗教訓

---

## 🎯 Phase 0 特別提醒

### Sprint 1 (Day 1-3) 必須交付

1. ✅ Next.js + Prisma + tRPC 骨架
2. ✅ 連接 NAS PostgreSQL
3. ✅ Supabase Auth 整合
4. ✅ Health Router (含 version, migrations 端點)
5. ✅ Tenant + User 數據模型
6. ✅ 環境變數驗證機制
7. ✅ 結構化日誌系統
8. ✅ 初始數據 Seed

### Sprint 2 (Day 4-5) 必須交付

1. ✅ Factory OS Client 可成功調用 API
2. ✅ Cron 自動健康檢查
3. ✅ API Key 生成/撤銷功能
4. ✅ 共生驗證報告

### 不要做的事

- ❌ 不要急著開發業務功能
- ❌ 不要偏離技術棧決策
- ❌ 不要忽略多租戶隔離
- ❌ 不要跳過文檔記錄
- ❌ 不要使用 console.log
- ❌ 不要在 repo 存環境變數真值

---

## 📞 緊急聯絡人

**當您遇到以下情況時，請立即詢問總導演**：

1. 🚨 **架構決策衝突**
2. 🚨 **技術棧變更需求**
3. 🚨 **重大 Bug** (數據洩漏或安全漏洞)
4. 🚨 **進度嚴重延遲**

**可以自行決策的情況**：

1. ✅ 組件內部實現細節
2. ✅ 變數命名
3. ✅ CSS 樣式調整
4. ✅ 小型 Bug 修復

---

## ✅ 確認理解

**在開始開發前，請確認您已理解**：

- [ ] 本專案是多租戶 SaaS 平台
- [ ] 所有數據模型都必須包含 tenant_id
- [ ] 使用 tRPC，不使用 REST API
- [ ] 使用 Prisma，不直接寫 SQL
- [ ] 搜索優先，避免重複創建
- [ ] 所有操作都必須記錄在 JOURNAL
- [ ] 使用 GAC 時必須記錄在 GAC_DEV_LOG.md
- [ ] 必須使用結構化日誌 (Pino)
- [ ] 環境變數必須驗證
- [ ] API Key 有完整生命週期管理

---

**文檔版本**: v1.1 (企業級戰略強化版)
**最後更新**: 2025-10-05
**維護者**: Morris Lin
**版本歷史**: 查看 Git Commit History
