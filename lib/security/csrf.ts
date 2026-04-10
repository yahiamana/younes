import { cookies, headers } from "next/headers";
import { randomBytes, createHmac, timingSafeEqual } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.SESSION_SECRET || "fallback-csrf-secret-at-least-32-chars";
const CSRF_COOKIE_NAME = "__Host-csrf_token"; // Use __Host- prefix in production for extra security if HTTPS

export async function generateCsrfToken() {
  const token = randomBytes(32).toString("hex");
  const hash = createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
  const value = `${token}.${hash}`;

  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  
  // Conditionally use __Host- prefix based on environment
  const cookieName = isProd ? CSRF_COOKIE_NAME : "csrf_token";

  cookieStore.set(cookieName, value, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax", // Lax allows the cookie to be sent on top-level navigations but strict on POST
    path: "/",
  });

  return value;
}

export async function validateCsrfToken(tokenFromRequest: string | null) {
  if (!tokenFromRequest) return false;

  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  const cookieName = isProd ? CSRF_COOKIE_NAME : "csrf_token";
  const tokenFromCookie = cookieStore.get(cookieName)?.value;

  if (!tokenFromCookie) return false;

  // Use timing-safe equal to prevent timing attacks
  try {
    const reqBuffer = Buffer.from(tokenFromRequest);
    const cookieBuffer = Buffer.from(tokenFromCookie);
    
    if (reqBuffer.length !== cookieBuffer.length) return false;
    if (!timingSafeEqual(reqBuffer, cookieBuffer)) return false;

    // Verify cryptographic signature to ensure cookie wasn't forged
    const [token, hash] = tokenFromCookie.split(".");
    const expectedHash = createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
    
    const hashBuffer = Buffer.from(hash);
    const expectedHashBuffer = Buffer.from(expectedHash);

    if (hashBuffer.length !== expectedHashBuffer.length) return false;
    return timingSafeEqual(hashBuffer, expectedHashBuffer);
  } catch {
    return false;
  }
}

export async function verifyOrigin() {
  // Strict origin verification for Server Actions & API routes
  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("host");

  if (!origin || !host) return false;

  try {
    const originUrl = new URL(origin);
    const isSafe = originUrl.host === host;
    return isSafe;
  } catch {
    return false;
  }
}
