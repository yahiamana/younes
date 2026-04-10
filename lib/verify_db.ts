import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const count = await prisma.skill.count();
  console.log("Skill count:", count);
  const skills = await prisma.skill.findMany({ take: 5 });
  console.log("Sample skills:", skills.map(s => s.name));
  await prisma.$disconnect();
}

main();
