import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJWT } from "@/lib/admin-crypto";
import { inspectRequest } from "@/lib/admin-firewall";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const clientIp =
    request.headers.get("x-nf-client-connection-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const userAgent = request.headers.get("user-agent") || "";

  // =========================================================================
  // 1. ADMIN FIREWALL — Inspect for fuzzing/exploit signatures
  // =========================================================================
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const firewallResult = inspectRequest(clientIp, pathname, search, userAgent);
    if (!firewallResult.allowed) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            error: firewallResult.reason || "Access blocked by Silk Security Firewall.",
            ip: clientIp,
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }

      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <title>403 Forbidden - Silk Security Firewall</title>
  <style>
    body { background: #0c0c0c; color: #ff5252; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { background: #171717; border: 1px solid #3d1b1b; padding: 32px; border-radius: 6px; max-width: 500px; text-align: center; }
    h1 { font-size: 18px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; color: #ff4757; }
    p { font-size: 13px; color: #bbb; line-height: 1.6; }
    .ip { color: #f1f2f6; font-family: monospace; background: #222; padding: 4px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>🚨 Access Blocked by Security Firewall</h1>
    <p>${firewallResult.reason || "Suspicious activity or exploit signature detected."}</p>
    <p>Client IP: <span class="ip">${clientIp}</span></p>
  </div>
</body>
</html>`,
        {
          status: 403,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }
  }

  // =========================================================================
  // 2. ADMIN AUTHENTICATION VERIFICATION (JWT in httpOnly cookie)
  // =========================================================================
  const checkAdminSession = async () => {
    const adminToken = request.cookies.get("silk_admin_token")?.value;
    if (!adminToken) return null;
    return await verifyAdminJWT(adminToken);
  };

  const adminSession = await checkAdminSession();
  const isAdmin = adminSession !== null && adminSession.role === "ADMIN";

  // If already logged in and visiting /admin/login -> redirect to /admin
  if (pathname === "/admin/login") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Guard /admin routes — redirect unauthenticated to /admin/login
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      if (request.cookies.get("silk_admin_token")) {
        res.cookies.delete("silk_admin_token");
      }
      return res;
    }
  }

  // Guard /api/admin routes (except login/logout/secure-auth endpoints)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/secure-auth") &&
    !pathname.startsWith("/api/admin/auth/login") &&
    !pathname.startsWith("/api/admin/auth/logout")
  ) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Valid admin session required" },
        { status: 401 }
      );
    }
  }

  // =========================================================================
  // 3. CUSTOMER ACCOUNTS — Redirect to shop (COD guest checkout only)
  // =========================================================================
  if (pathname.startsWith("/account") || pathname === "/register") {
    return NextResponse.redirect(new URL("/shop", request.url));
  }

  // Security Headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account/:path*",
    "/register",
  ],
};
