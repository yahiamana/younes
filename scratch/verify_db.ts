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
    const settings = await prisma.siteSettings.findFirst()
    console.log('Current Settings in DB:', JSON.stringify(settings, null, 2))
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(console.error)
