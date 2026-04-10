import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET || "fallback-secret-at-least-32-chars-long";
const key = new TextEncoder().encode(SESSION_SECRET);

const isProd = process.env.NODE_ENV === "production";
const SESSION_COOKIE_NAME = isProd ? "__Host-admin_session" : "admin_session";

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // 1. Basic properties
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiUpload = pathname === "/api/upload";
  const requestMethod = request.method;

  // 2. (Defense against CSRF for API routes)
  // We bypass the strict origin check for the login page to prevent lockouts during setup/recovery
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(requestMethod) && !isLoginPage) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");

    if (host) {
      const isDev = process.env.NODE_ENV !== "production";
      
      // Verification logic
      let isValid = false;
      
      if (origin) {
        try {
          const originUrl = new URL(origin);
          // Standard check: Host must match exactly. 
          // Port check is ignored in dev to handle local server fluctuations.
          isValid = isDev ? (originUrl.hostname === host.split(':')[0]) : (originUrl.host === host);
        } catch {
          isValid = false;
        }
      } else if (referer) {
        try {
          const refererUrl = new URL(referer);
          isValid = isDev ? (refererUrl.hostname === host.split(':')[0]) : (refererUrl.host === host);
        } catch {
          isValid = false;
        }
      }

      if (!isValid && !isDev) {
        // Log rejection for debugging purposes (visible in Vercel logs)
        console.error(`[Middleware Rejection] Path: ${pathname}, Method: ${requestMethod}, Origin: ${origin}, Referer: ${referer}, Dest Host: ${host}`);
        return new NextResponse("Forbidden Mutation: Origin/Referer Mismatch or Missing", { status: 403 });
      }
    }
  }

  // 3. Identify session cookie
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 4. Admin Guard
  if (isAdminPath && !isLoginPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verify the signed JWT (Edge compatible)
      await jwtVerify(token, key, { algorithms: ["HS256"] });
      
      const response = NextResponse.next();
      addSecurityHeaders(response);
      return response;
    } catch {
      // Invalid token
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  // 5. Removed: Let the login page handle logged-in users natively.
  // If the JWT is valid but the DB session is dead, redirecting them from login to dashboard causes an infinite loop.

  // 6. Protect Upload API Route identically to Admin routes
  if (isApiUpload) {
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    try {
      await jwtVerify(token, key, { algorithms: ["HS256"] });
    } catch {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY"); // Prevent Clickjacking entirely
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  // Content Security Policy
  // Allow Cloudinary for images, allow self for scripts, styles.
  const scriptSrc = process.env.NODE_ENV === "production" ? "'self' 'unsafe-inline'" : "'self' 'unsafe-inline' 'unsafe-eval'";
  const isDev = process.env.NODE_ENV !== "production";
  
  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com;
    font-src 'self' data:;
    connect-src 'self' https://api.cloudinary.com https://*.cloudinary.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    ${!isDev ? "upgrade-insecure-requests;" : ""}
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set("Content-Security-Policy", csp);

  // New Permissions-Policy standard
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
