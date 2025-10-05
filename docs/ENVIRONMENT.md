# 環境變數管理文檔

## 變數清單

| 變數名 | 用途 | 取得方式 | 輪替週期 | 責任人 |
|--------|------|---------|---------|--------|
| DATABASE_URL | PostgreSQL 連線 | NAS 管理員 | 季度 | DevOps |
| NEXT_PUBLIC_SUPABASE_URL | Supabase 專案 URL | Supabase Dashboard | N/A | Tech Lead |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase 公開金鑰 | Supabase Dashboard | 半年 | Tech Lead |
| SUPABASE_SERVICE_ROLE_KEY | Supabase 管理操作 | Supabase Dashboard | 半年 | Tech Lead |
| GAC_API_KEY | 與 GAC 互認 | 內部生成 | 季度 | Tech Lead |
| JWT_SECRET | Token 簽名 | 隨機生成 | 半年 | Security Team |
| LOG_LEVEL | 日誌等級 | 配置 | N/A | DevOps |
| APP_ENV | 應用環境 | 配置 | N/A | DevOps |
| APP_VERSION | 應用版本 | CI/CD 注入 | 每次部署 | CI/CD |

## 環境區分

### Development (開發環境)

```bash
APP_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://dev:dev@localhost:5432/factory_os_dev
```

### Staging (預發環境)

```bash
APP_ENV=staging
LOG_LEVEL=info
DATABASE_URL=postgresql://staging:***@nas:5532/factory_os_staging
```

### Production (生產環境)

```bash
APP_ENV=production
LOG_LEVEL=warn
DATABASE_URL=postgresql://prod:***@nas:5532/factory_os_prod
```

## 輪替流程

### DATABASE_URL 輪替

1. 在 NAS 創建新的 PostgreSQL 用戶
```sql
CREATE USER new_user WITH PASSWORD 'new_password';
GRANT ALL PRIVILEGES ON DATABASE factory_os TO new_user;
```

2. 更新 Vercel 環境變數
```bash
vercel env add DATABASE_URL production
```

3. 驗證連接
```bash
psql $DATABASE_URL -c "SELECT 1"
```

4. 撤銷舊用戶權限
```sql
REVOKE ALL PRIVILEGES ON DATABASE factory_os FROM old_user;
DROP USER old_user;
```

### API Key 輪替

1. 使用租戶級 API Key 管理功能生成新 Key
2. 通知 GAC 團隊
3. 設置寬限期 (72小時)
4. 撤銷舊 Key

## 異常處理

### 發現洩漏

1. **立即撤銷** 所有受影響的密鑰
2. 生成新的密鑰
3. 更新所有環境
4. 審查訪問日誌
5. 記錄事故報告

### 遺失訪問

1. 使用應急恢復流程
2. 從備份系統恢復
3. 聯繫 Supabase 支援 (如適用)
4. 記錄恢復過程

### 合規審計

- 保留環境變數變更日誌
- 記錄輪替時間和操作人
- 提供審計報告

## 安全最佳實踐

### ✅ 應該做的

- 使用強隨機密碼生成器
- 定期輪替所有密鑰
- 使用環境變數管理系統 (Vercel Env)
- 限制訪問權限 (最小權限原則)
- 記錄所有變更

### ❌ 不應該做的

- 將密鑰寫在代碼中
- 提交 `.env` 到 Git
- 在日誌中記錄密鑰
- 共享密鑰給未授權人員
- 使用弱密碼

## 故障排除

### 連接數據庫失敗

```bash
# 檢查 DATABASE_URL 格式
echo $DATABASE_URL

# 測試連接
psql $DATABASE_URL -c "SELECT 1"

# 檢查 NAS 防火牆
ping 192.168.1.114
telnet 192.168.1.114 5532
```

### Supabase Auth 失敗

```bash
# 檢查 Supabase 專案狀態
curl https://{YOUR_PROJECT}.supabase.co/rest/v1/

# 驗證 ANON_KEY
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 相關資源

- [Supabase 環境變數文檔](https://supabase.com/docs/guides/auth)
- [Vercel 環境變數管理](https://vercel.com/docs/concepts/projects/environment-variables)
- [PostgreSQL 安全指南](https://www.postgresql.org/docs/current/user-manag.html)
