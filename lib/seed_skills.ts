import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const skillsData = [
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

async function main() {
  console.log("Cleaning old skills...");
  try {
    await prisma.skill.deleteMany({});
    
    console.log("Injecting new skills...");
    for (const skill of skillsData) {
      await prisma.skill.create({ data: skill });
    }
    console.log("Successfully seeded skills!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
