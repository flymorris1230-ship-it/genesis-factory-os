# Genesis Factory OS

化妝品工廠雲端作業系統 (Cloud-based Factory Operating System)

## 📚 專案文檔

- **[CLAUDE_GENESIS_FACTORY_OS.md](./CLAUDE_GENESIS_FACTORY_OS.md)** - 企業級專案啟動手冊 (必讀 ⭐⭐⭐⭐⭐)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - 架構文檔
- [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) - 環境變數管理
- [docs/API-KEYS.md](./docs/API-KEYS.md) - API 金鑰管理 SOP

## 🎯 核心價值主張

- 從傳統本地系統轉型為**多租戶 SaaS 平台**
- 打通 **WMS → MES → QMS → R&D** 全業務流程
- 符合 **GMP** 和**化妝品法規**要求
- 與 **ai-agent-team-v1 (GAC)** 共生，實現 AI 輔助決策

## 🛠️ 技術棧

- **前端**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **API**: tRPC (Type-safe API without REST)
- **數據庫**: PostgreSQL (NAS) + Prisma ORM
- **認證**: Supabase Auth
- **日誌**: Pino (結構化日誌)
- **部署**: Vercel (前端) + NAS (數據庫)

## 🚀 快速開始

### 環境要求

- Node.js 18+
- npm 或 yarn
- PostgreSQL (NAS 上運行)
- Supabase 專案

### 安裝依賴

```bash
npm install
```

### 環境設置

1. 複製環境變數範本:
```bash
cp .env.example .env
```

2. 填寫必要的環境變數 (見 `.env.example`)

### 數據庫設置

```bash
# 生成 Prisma Client
npm run prisma:generate

# 執行數據庫遷移
npm run prisma:migrate

# 植入初始數據
npm run db:seed
```

### 開發

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用。

### 建置

```bash
npm run build
npm run start
```

## 📋 腳本命令

- `npm run dev` - 啟動開發伺服器 (使用 Turbopack)
- `npm run build` - 建置生產版本
- `npm run start` - 啟動生產伺服器
- `npm run lint` - 執行 ESLint 檢查
- `npm run prisma:generate` - 生成 Prisma Client
- `npm run prisma:migrate` - 執行數據庫遷移
- `npm run db:seed` - 植入初始數據
- `npm run db:reset` - 重置數據庫並重新植入
- `npm run db:studio` - 啟動 Prisma Studio

## 🏗️ 專案結構

```
genesis-factory-os/
├── prisma/              # Prisma schema 和遷移
├── src/
│   ├── app/            # Next.js App Router 頁面
│   ├── components/     # React 組件
│   ├── server/         # tRPC 伺服器端代碼
│   ├── lib/            # 工具函數
│   └── types/          # TypeScript 類型定義
├── docs/               # 專案文檔
└── public/             # 靜態資源
```

## 🔐 安全注意事項

- ⚠️ **切勿** 將 `.env` 文件提交到 Git
- ⚠️ **切勿** 在日誌中記錄敏感信息
- ✅ 定期輪替 API Keys (建議每季度)
- ✅ 遵循最小權限原則

## 📞 支援與聯絡

- 技術文檔: [CLAUDE_GENESIS_FACTORY_OS.md](./CLAUDE_GENESIS_FACTORY_OS.md)
- 架構問題: 查看 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- 環境配置: 查看 [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md)

## 📄 授權

Private - 僅供內部使用

---

**版本**: v0.1.0 (Phase 0)
**最後更新**: 2025-10-05
