"use server";

import { prisma } from "@/lib/db";
import { requireAuth, revokeSession as coreRevokeSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAuditLogs() {
  await requireAuth();
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Show last 100
  });
}

export async function getSecurityEvents() {
  await requireAuth();
  return prisma.securityEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getActiveSessions() {
  await requireAuth();
  return prisma.session.findMany({
    where: { isValid: true, expiresAt: { gt: new Date() } },
    orderBy: { lastActive: "desc" },
    include: { user: { select: { email: true } } }
  });
}

export async function revokeActiveSession(sessionId: string) {
  const session = await requireAuth();
  
  // Don't let admin revoke their own CURRENT session this way (they should logout)
  // Wait, they can. But let's verify.
  if (session.id === sessionId) {
    return { error: "Cannot revoke current session. Please log out instead." };
  }

  await coreRevokeSession(sessionId);
  revalidatePath("/admin/security");
  return { success: true };
}
