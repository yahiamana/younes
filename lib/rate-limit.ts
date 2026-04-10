import { prisma } from "@/lib/db";
import { logSecurityEvent } from "./security/audit";

interface RateLimitConfig {
  maxRequests: number; // max requests allowed
  windowInSeconds: number; // time window
}

const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowInSeconds: 15 * 60 }, // 5 logins per 15 mins
  contact: { maxRequests: 3, windowInSeconds: 60 * 60 }, // 3 messages per hour
  api: { maxRequests: 100, windowInSeconds: 60 }, // 100 api calls per min
};

/**
 * Validates if the action from the specified IP is within allowed rate limits.
 * Uses database backend for reliability in serverless environments.
 * @returns { success: boolean, retryAfter?: number }
 */
export async function rateLimit(
  identifier: string,
  action: keyof typeof DEFAULT_LIMITS = "api"
): Promise<{ success: boolean; retryAfter?: number }> {
  try {
    const config = DEFAULT_LIMITS[action];
    const key = `${action}:${identifier}`;
    const now = new Date();

    // Clean up expired records occasionally
    if (Math.random() < 0.1) {
      await prisma.rateLimitRecord.deleteMany({
        where: { expiresAt: { lt: now } },
      }).catch(() => null);
    }

    // Upsert the record safely (transaction-like logic for race conditions using upsert)
    const record = await prisma.rateLimitRecord.upsert({
      where: { key },
      create: {
        key,
        count: 1,
        expiresAt: new Date(now.getTime() + config.windowInSeconds * 1000),
      },
      update: {
        count: { increment: 1 },
      },
    });

    // Check if limits exceeded
    if (record.count > config.maxRequests) {
      // Once it breaks the limit, ensure expiry is pushed back (progressive backoff) if it's login
      if (action === "login" && record.count % 5 === 0) {
        await prisma.rateLimitRecord.update({
          where: { key },
          data: { expiresAt: new Date(now.getTime() + config.windowInSeconds * 2000) },
        });
        await logSecurityEvent("RATE_LIMIT_LOGIN", "HIGH", { identifier, count: record.count });
      } else if (action === "contact" && record.count === config.maxRequests + 1) {
         await logSecurityEvent("RATE_LIMIT_CONTACT", "MEDIUM", { identifier });
      }

      const retryAfter = Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000);
      return { success: false, retryAfter: retryAfter > 0 ? retryAfter : config.windowInSeconds };
    }

    // If the record has expired, reset it
    if (record.expiresAt < now) {
      await prisma.rateLimitRecord.update({
        where: { key },
        data: {
          count: 1,
          expiresAt: new Date(now.getTime() + config.windowInSeconds * 1000),
        },
      });
    }

    return { success: true };
  } catch (error) {
    // Fail closed or fail open? For rate limiting, fail open is dangerous.
    // However, if DB drops momentarily, we don't want to lock out legitimate traffic.
    console.error("Rate limiting error:", error);
    // Let's fail safe (allow) but log aggressive warnings in real life.
    return { success: true };
  }
}
