# Genesis Factory OS - 架構文檔

## 系統架構概覽

Genesis Factory OS 是一個多租戶 SaaS 平台，採用現代化的雲原生架構。

### 技術棧

```
┌─────────────────────────────────────────────┐
│         前端層 (Next.js 15 App Router)      │
│  ┌─────────────────────────────────────┐   │
│  │  React 18 + TypeScript + Tailwind   │   │
│  │  tRPC Client + React Query          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│          API 層 (tRPC on Next.js)          │
│  ┌─────────────────────────────────────┐   │
│  │  Type-safe API without REST         │   │
│  │  Zod Validation + Middleware        │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│        業務邏輯層 (Server Functions)        │
│  ┌─────────────────────────────────────┐   │
│  │  多租戶過濾 + 權限控制              │   │
│  │  審計日誌 + 結構化日誌              │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│        數據持久層 (Prisma + PostgreSQL)     │
│  ┌─────────────────────────────────────┐   │
│  │  Supabase PostgreSQL (Singapore)    │   │
│  │  Prisma ORM + Type-safe Queries     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 部署架構

```
┌──────────────────────────────────────────┐
│         Vercel Edge Network              │
│  ┌────────────────────────────────────┐  │
│  │  Next.js App (Serverless Functions)│  │
│  │  - API Routes (tRPC)               │  │
│  │  - Static Assets (CDN)             │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
                  ▼
┌──────────────────────────────────────────┐
│      Supabase Cloud (Singapore)          │
│  ┌────────────────────────────────────┐  │
│  │  PostgreSQL Database               │  │
│  │  - Connection Pooling (Port 6543)  │  │
│  │  - Direct Connection (Port 5432)   │  │
│  │  - Multi-tenant Database           │  │
│  │  - Automated Backups               │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## 數據庫架構演進

### Phase 0-1: Supabase PostgreSQL (當前)

**採用時間**: Sprint 1 (2025-10-06)

**選擇原因**:
1. **網段隔離問題**: 開發環境 (192.168.50.x) 無法直連 NAS (192.168.1.x)
2. **開發效率優先**: 可在任何網絡環境工作，無需配置
3. **優秀工具鏈**: 內建可視化管理、實時監控、自動備份
4. **零配置啟動**: 快速驗證架構和業務邏輯

**技術優勢**:
- ✅ 完全託管的 PostgreSQL 服務
- ✅ 全球 CDN 加速數據庫連接
- ✅ 自動擴展和高可用性
- ✅ Point-in-time Recovery (PITR) 備份
- ✅ Connection Pooling 內建支援

**成本考量**:
- Free Tier: 500MB 數據庫、1GB 文件存儲、50,000 月活躍用戶
- Paid Plan: $25/月起 (8GB 數據庫、100GB 文件存儲)

### Phase 2+: 遷移評估 (未來)

**選項 A: 繼續 Supabase** ⭐ (推薦)
- 適用場景: Free Tier 足夠或成本可接受
- 優勢: 免運維、高可用、全球加速
- 劣勢: 月費成本、數據在雲端

**選項 B: 遷移至 NAS PostgreSQL**
- 適用場景: 需本地化部署或降低長期成本
- 優勢: 完全控制、零雲端費用、數據主權
- 劣勢: 需配置網絡 (Cloudflare Tunnel)、自行維護

### 遷移成本分析

**技術複雜度**: 極低 ⭐⭐⭐⭐⭐
- Prisma ORM 已抽象數據庫層
- Schema 完全兼容 (PostgreSQL → PostgreSQL)
- 只需更改 `DATABASE_URL` 環境變數
- 遷移工具: `pg_dump` + `pg_restore` 或 Prisma Migrate

**操作步驟** (如需遷移):
```bash
# 1. 從 Supabase 導出數據
pg_dump $SUPABASE_URL > backup.sql

# 2. 導入 NAS PostgreSQL
psql $NAS_DATABASE_URL < backup.sql

# 3. 更新環境變數
# .env
DATABASE_URL="postgresql://postgres:***@192.168.1.114:5532/genesis_factory_os"

# 4. 驗證連接
npm run prisma:migrate
npm run db:seed
```

**決策點**: Sprint 2 結束 (2025-10-20)
- 評估數據庫使用量
- 評估 Supabase 成本
- 評估 NAS 網絡配置可行性

## 多租戶架構

### 數據隔離策略

採用 **Row-Level Multi-tenancy**：
- 所有數據表都包含 `tenant_id` 欄位
- 使用 Prisma 中間件自動過濾租戶數據
- 索引優化：所有查詢都包含 tenant_id

### 租戶識別流程

```typescript
用戶登入 (Supabase Auth)
  ↓
提取 tenant_id from JWT
  ↓
存入 tRPC Context
  ↓
自動過濾所有數據庫查詢
```

## 安全架構

### 認證流程 (Supabase Auth)

```
1. 用戶登入 → Supabase Auth
2. 獲取 JWT Token (含 tenant_id)
3. 前端發送請求時附帶 Token
4. tRPC 中間件驗證 Token
5. 提取用戶信息 + tenant_id
6. 注入到 Context
```

### 授權機制

- **角色**:
  - `ADMIN`: 租戶管理員 (完整權限)
  - `USER`: 一般用戶 (業務操作)
  - `VIEWER`: 只讀用戶 (查詢)

- **權限控制**: 在 tRPC Procedure 層級實現

### API Key 管理

- 用於系統間調用 (如與 GAC 整合)
- 租戶級 API Key (一對一)
- 支持生成/輪替/撤銷
- 使用 bcrypt 雜湊存儲

## 數據模型

### 核心實體關係

```
Tenant (租戶)
  ├─ User (用戶)
  ├─ Material (物料)
  │   └─ Supplier (供應商)
  ├─ Unit (單位)
  ├─ Warehouse (倉庫)
  └─ AuditLog (審計日誌)
```

### 審計追蹤

所有關鍵操作都記錄在 `audit_logs` 表：
- 操作人 (actor_id)
- 操作類型 (action)
- 實體類型 (entity_type)
- 實體 ID (entity_id)
- 元數據 (metadata JSON)
- 時間戳 (created_at)

## 可觀測性

### 結構化日誌 (Pino)

```typescript
{
  "requestId": "uuid",
  "tenantId": "tenant-id",
  "actorId": "user-id",
  "path": "material.list",
  "type": "query",
  "duration_ms": 42,
  "ok": true
}
```

### Health Endpoints

- `GET /api/trpc/health.ping` - 快速健康檢查
- `GET /api/trpc/health.version` - 版本資訊
- `GET /api/trpc/health.migrations` - 數據庫遷移狀態

## 開發環境

### 本地開發

```bash
# 啟動開發伺服器
npm run dev

# 開啟 Prisma Studio (數據庫 GUI)
npm run db:studio
```

### 環境變數

參考 `.env.example` 和 `docs/ENVIRONMENT.md`

## 生產環境

### 部署流程

1. 代碼推送到 GitHub
2. Vercel 自動觸發部署
3. 建置 Next.js 應用
4. 執行 Prisma 遷移 (如需要)
5. 部署到 Edge Network

### 監控與告警

- Vercel Analytics (性能監控)
- Vercel Logs (應用日誌)
- NAS 監控 (數據庫健康)

## 擴展性考量

### 水平擴展

- Vercel Serverless 自動擴展
- PostgreSQL Connection Pooling
- CDN 快取靜態資源

### 垂直擴展

- 升級 NAS 硬體 (RAM/CPU)
- PostgreSQL 調優 (索引/查詢優化)

## 相關文檔

- [ENVIRONMENT.md](./ENVIRONMENT.md) - 環境變數管理
- [API-KEYS.md](./API-KEYS.md) - API 金鑰管理
- [CLAUDE_GENESIS_FACTORY_OS.md](../CLAUDE_GENESIS_FACTORY_OS.md) - 專案啟動手冊
