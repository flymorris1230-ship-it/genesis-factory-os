import { PrismaClient } from '@prisma/client'

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
      apiKeyScopes: [],
    },
  })
  console.log('✅ Tenant created:', tenant.name)

  // ==========================================
  // 2. 創建系統管理員
  // ==========================================
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
