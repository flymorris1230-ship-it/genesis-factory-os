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

// 環境變數類型定義
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  GAC_API_KEY: process.env.GAC_API_KEY!,
  JWT_SECRET: process.env.JWT_SECRET!,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  APP_ENV: process.env.APP_ENV || 'development',
  APP_VERSION: process.env.APP_VERSION || '0.1.0+dev',
  NODE_ENV: process.env.NODE_ENV || 'development',
}
