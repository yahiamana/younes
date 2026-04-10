import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required for seeding");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@younes.dev";
  const password = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  const hashedPassword = await bcrypt.hash(password, 12);

  // Upsert admin user
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      hashedPassword,
      name: "Younes",
      role: "admin",
    },
  });

  // Create default site settings if none exist
  const existing = await prisma.siteSettings.findFirst();
  if (!existing) {
    await prisma.siteSettings.create({
      data: {
        name: "Younes",
        title: "Data Scientist & ML/DL Engineer",
        heroHeadline: "Transforming Data Into Intelligence",
        heroSubtext:
          "Crafting intelligent systems through data science, machine learning, and deep learning — turning complex datasets into actionable insights and powerful predictive models.",
        aboutText:
          "I am a passionate Data Scientist and Machine Learning / Deep Learning Engineer with a strong foundation in statistical analysis, predictive modeling, and neural network architectures. My work focuses on building intelligent systems that solve real-world problems through data-driven approaches.\n\nWith expertise spanning the full data science lifecycle — from data collection and preprocessing to model deployment and monitoring — I deliver end-to-end solutions that drive measurable impact. I am committed to continuous learning and staying at the forefront of AI innovation.",
        aboutHighlights: JSON.stringify({
          experience: "3+",
          projects: "20+",
          certificates: "10+",
          specialization: "ML/DL",
        }),
        phone: "0561020056",
        email: "younes.bnl@yahoo.com",
        seoTitle: "Younes — Data Scientist & ML/DL Engineer Portfolio",
        seoDescription:
          "Portfolio of Younes, a Data Scientist and Machine Learning / Deep Learning Engineer specializing in building intelligent systems and data-driven solutions.",
      },
    });
  }

  // Seed default skills
  const skills = [
    { name: "Machine Learning", category: "Machine Learning / AI", order: 1 },
    { name: "Deep Learning", category: "Machine Learning / AI", order: 2 },
    { name: "PyTorch", category: "Machine Learning / AI", order: 3 },
    { name: "Scikit-Learn", category: "Machine Learning / AI", order: 4 },
    
    { name: "Python (Programming Language)", category: "Languages & Tools", order: 1 },
    { name: "C++", category: "Languages & Tools", order: 2 },
    { name: "SQL", category: "Languages & Tools", order: 3 },
    { name: "Git", category: "Languages & Tools", order: 4 },

    { name: "Data Science", category: "Data Ecosystem", order: 1 },
    { name: "Big Data", category: "Data Ecosystem", order: 2 },
    { name: "Data Analysis", category: "Data Ecosystem", order: 3 },
    { name: "Data Cleaning", category: "Data Ecosystem", order: 4 },
    { name: "Databases", category: "Data Ecosystem", order: 5 },

    { name: "Pandas (Software)", category: "Libraries & Viz", order: 1 },
    { name: "NumPy", category: "Libraries & Viz", order: 2 },
    { name: "Matplotlib", category: "Libraries & Viz", order: 3 },
    { name: "Seaborn", category: "Libraries & Viz", order: 4 },
    { name: "Plotly", category: "Libraries & Viz", order: 5 },
    { name: "Tableau", category: "Libraries & Viz", order: 6 },

    { name: "Mathematics", category: "Mathematical Theory", order: 1 },
    { name: "Statistics", category: "Mathematical Theory", order: 2 },
    { name: "Probability", category: "Mathematical Theory", order: 3 },

    { name: "Vibe Coding", category: "Superpowers", order: 1 },
  ];

  // Refresh skills
  console.log("Cleaning old skills...");
  await prisma.skill.deleteMany({});
  
  console.log("Injecting new skills...");
  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  // Seed social links
  const existingSocials = await prisma.socialLink.count();
  if (existingSocials === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: "GitHub", url: "https://github.com/younes", order: 1 },
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/in/younes",
          order: 2,
        },
        { platform: "Twitter", url: "https://twitter.com/younes", order: 3 },
      ],
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
