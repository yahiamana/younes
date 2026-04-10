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

  const name = "Younes Benali"
  const title = "Data Scientist | ML & DL Engineer"
  const heroHeadline = "Turning Data into Intelligence & Impact"
  const heroSubtext = "Advanced Machine Learning | Deep Learning | NLP & AI Architecture"

  try {
    const settings = await prisma.siteSettings.findFirst()
    
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          name,
          title,
          heroHeadline,
          heroSubtext,
        }
      })
      console.log('Successfully updated Hero Settings')
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(console.error)
