import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Prisma 7 requires an explicit adapter for direct database connections in Node.js.
// We use the standard 'pg' driver with '@prisma/adapter-pg' for maximum stability.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const isProd = process.env.NODE_ENV === "production";

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
  }

  try {
    // Optimization: In serverless (Vercel), handle pool limits reasonably.
    // 10 is a standard safe number for Neon/Vercel serverless functions.
    const pool = new pg.Pool({ 
      connectionString, 
      max: isProd ? 10 : 5, 
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    const adapter = new PrismaPg(pool);
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
