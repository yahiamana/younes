import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Reverting to stable PG driver to resolve SSL/Connection compatibility issues.
// Increased pool limits maintained for production high-availability.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const isProd = process.env.NODE_ENV === "production";

  if (!connectionString) {
    console.warn("DATABASE_URL is missing. Database access will fail.");
    return new PrismaClient();
  }

  try {
    const pool = new pg.Pool({ 
      connectionString, 
      max: isProd ? 10 : 5, 
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Higher timeout for cold starts
      ssl: connectionString.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
    });
    
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("Prisma constructor failed:", err);
    return new PrismaClient(); // Fallback to avoid top-level crash
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
