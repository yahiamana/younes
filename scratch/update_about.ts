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

  const aboutText = `I am Younes Benali, a dedicated Data Scientist and Deep Learning Engineer focused on architecting intelligent systems that bridge the gap between complex data and real-world impact. Specializing in NLP and advanced AI, I build high-fidelity models that do more than just predict—they solve. My approach combines mathematical precision with a product-driven mindset, ensuring that every neural network refined and every algorithm deployed serves a strategic purpose. From engineering sophisticated NLP pipelines to crafting scalable machine learning architectures, I am committed to turning raw information into powerful, actionable intelligence.`

  const aboutHighlights = JSON.stringify({
    experience: "3+ Years",
    specialization: "ML/DL & NLP",
    impact: "Global Scale",
    focus: "High-Fidelity AI"
  })

  try {
    const settings = await prisma.siteSettings.findFirst()
    
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          aboutText,
          aboutHighlights,
        }
      })
      console.log('Successfully updated SiteSettings')
    } else {
      await prisma.siteSettings.create({
        data: {
          aboutText,
          aboutHighlights,
        }
      })
      console.log('Successfully created SiteSettings')
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(console.error)
