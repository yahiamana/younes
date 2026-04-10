"use server";

import { z } from "zod";
import { verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { logSecurityEvent, logAudit } from "@/lib/security/audit";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginState = {
  error?: string;
  success?: boolean;
} | null;

export async function loginAction(prevState: any, formData: FormData): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe") === "on";

  // 0. Extract headers for logging (IP/UA)
  const headerList = await headers();
  const ipAddress = headerList.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "unknown";

  // 1. Zod Validation
  const validatedFields = loginSchema.safeParse({ email, password, rememberMe });
  if (!validatedFields.success) {
    return { error: "Invalid input. Please check your credentials." };
  }

  // 2. Rate Limit Check (Defense in Depth -> DB backed)
  const rateLimitStatus = await rateLimit(ipAddress, "login");
  if (!rateLimitStatus.success) {
    return { error: `Too many login attempts. Try again in ${rateLimitStatus.retryAfter} seconds.` };
  }

  // 3. Authenticate
  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (!user) {
    // SECURITY: Use generic message to prevent email enumeration
    await logSecurityEvent("FAILED_LOGIN", "MEDIUM", { reason: "User not found", email });
    return { error: "Invalid email or password." };
  }

  const isPasswordValid = await verifyPassword(password, user.hashedPassword);

  if (!isPasswordValid) {
    await logSecurityEvent("FAILED_LOGIN", "MEDIUM", { reason: "Wrong password", email, userId: user.id });
    return { error: "Invalid email or password." };
  }

  // 4. Success Flow
  await logAudit(user.id, "LOGIN", "AuthSystem");
  await createSession(user.id);

  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
