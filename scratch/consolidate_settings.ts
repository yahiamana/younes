import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is missing')

  const pool = new pg.Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const allSettings = await prisma.siteSettings.findMany({
      orderBy: { updatedAt: 'desc' }
    })

    console.log(`Found ${allSettings.length} SiteSettings records.`)

    if (allSettings.length > 1) {
      const primary = allSettings[0]
      const toDelete = allSettings.slice(1)
      
      console.log(`Keeping record: ${primary.id} (last updated: ${primary.updatedAt})`)
      
      for (const record of toDelete) {
        await prisma.siteSettings.delete({ where: { id: record.id } })
        console.log(`Deleted duplicate record: ${record.id}`)
      }
      
      console.log('Database consolidated successfully.')
    } else if (allSettings.length === 0) {
      await prisma.siteSettings.create({ data: {} })
      console.log('No settings found. Created initial record.')
    } else {
      console.log('Database already clean (only one record exists).')
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(console.error)
