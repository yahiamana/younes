import { cookies, headers } from "next/headers";
import { prisma } from "./db";
import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";
import { logSecurityEvent } from "./security/audit";

const SESSION_SECRET = process.env.SESSION_SECRET || "fallback-secret-at-least-32-chars-long";
const key = new TextEncoder().encode(SESSION_SECRET);

const isProd = process.env.NODE_ENV === "production";
export const SESSION_COOKIE_NAME = isProd ? "__Host-admin_session" : "admin_session";

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

/**
 * Creates a new secure session in the database and sets an httpOnly cookie.
 */
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Use cryptographically secure random token
  const sessionToken = crypto.randomBytes(32).toString("hex");

  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0].trim() || headersList.get("x-real-ip") || "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";
  
  // Basic device inference from User-Agent for the dashboard
  const isMobile = /mobile/i.test(userAgent);
  const browserMatch = userAgent.match(/(firefox|msie|chrome|safari|trident)/i);
  const browser = browserMatch ? browserMatch[1].toLowerCase() : "unknown";
  const osMatch = userAgent.match(/(windows nt|mac os x|linux|android|ios)/i);
  const os = osMatch ? osMatch[1].toLowerCase() : "unknown";
  const deviceInfo = `${os.toUpperCase()} | ${browser.toUpperCase()} ${isMobile ? "(Mobile)" : "(Desktop)"}`;

  // Create database session for revocation capability
  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken,
      expiresAt,
      userAgent,
      ipAddress,
      deviceInfo,
      isValid: true,
    },
  });

  // Create JWT for the cookie
  const jwtToken = await encrypt({ sessionToken, userId });

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, jwtToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return session;
}

/**
 * Verifies the session from the cookie and database.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const payload = await decrypt(token);
    const session = await prisma.session.findUnique({
      where: { sessionToken: payload.sessionToken },
      include: { user: true },
    });

    // Check if session is expired or manually revoked (isValid = false)
    if (!session || !session.isValid || session.expiresAt < new Date()) {
      if (session) await deleteSession(); // cleanup cookie
      return null;
    }

    // Update lastActive timestamp occasionally (e.g. 1% of requests) to save DB writes
    if (Math.random() < 0.01) {
      await prisma.session.update({
        where: { id: session.id },
        data: { lastActive: new Date() }
      }).catch(() => null);
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Deletes the session from the database and clears the cookie.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      const payload = await decrypt(token);
      await prisma.session.deleteMany({
        where: { sessionToken: payload.sessionToken },
      });
      await logSecurityEvent("LOGOUT", "LOW", { sessionToken: payload.sessionToken.substring(0, 8) + "..." });
    } catch {}
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Manually revokes a specific session remotely (used in Security Dashboard)
 */
export async function revokeSession(sessionId: string) {
  const session = await getSession();
  if (!session) return false;
  
  await prisma.session.update({
    where: { id: sessionId },
    data: { isValid: false }
  });
  
  await logSecurityEvent("SESSION_REVOKED", "MEDIUM", { adminUserId: session.userId, revokedSessionId: sessionId });
  return true;
}

/**
 * Manually checks authorization levels.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
