import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

// Prisma 7 requires an explicit adapter for serverless/edge environments.
// Neon's serverless driver is significantly more stable on Vercel than standard PG.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
  }

  try {
    // Neon Serverless Pool is optimized for HTTP-based proxy connection
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("Prisma constructor failed:", err);
    throw err;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
