import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { sendSecurityAlert } from "../email";

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export async function logAudit(
  userId: string,
  action: string,
  targetResource: string,
  targetId?: string | null,
  details?: Record<string, any>
) {
  try {
    const headersList = await headers();
    // In strict Next.js environments, relying purely on headers for IP might need adjustment per deployment (Vercel uses x-forwarded-for)
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0].trim() || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetResource,
        targetId,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to write to audit log:", error);
  }
}

export async function logSecurityEvent(
  type: string,
  severity: Severity,
  metadata?: Record<string, any>
) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0].trim() || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    await prisma.securityEvent.create({
      data: {
        type,
        ipAddress,
        userAgent,
        severity,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Trigger proactive email alerts for high-risk events
    if (severity === "HIGH" || severity === "CRITICAL") {
      await sendSecurityAlert({
        type,
        severity,
        ipAddress,
        metadata,
      }).catch(err => console.error("Proactive security alert email failed:", err));
    }
  } catch (error) {
    console.error("Failed to write security event:", error);
  }
}
