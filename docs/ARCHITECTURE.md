# Genesis Factory OS - 架構文檔

## 系統架構概覽

Genesis Factory OS 是一個多租戶 SaaS 平台，採用現代化的雲原生架構。

### 技術棧

```
┌─────────────────────────────────────────────┐
│         前端層 (Next.js 14 App Router)      │
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
│  │  PostgreSQL on NAS (192.168.1.114)  │   │
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
│        Local NAS (Synology DS918+)       │
│  ┌────────────────────────────────────┐  │
│  │  PostgreSQL Container              │  │
│  │  Port: 5532                        │  │
│  │  - Multi-tenant Database           │  │
│  │  - Automated Backups               │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

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
