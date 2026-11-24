import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminJWT, revokeAdminSession } from "@/lib/admin-crypto";
import { addRevokedSessionToFile, writeSecurityLog } from "@/lib/admin-logger";

export async function POST(req: Request) {
  const clientIp =
    req.headers.get("x-nf-client-connection-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const cookieStore = cookies();
  const token = cookieStore.get("silk_admin_token")?.value;

  if (token) {
    const verified = await verifyAdminJWT(token);
    if (verified && verified.jti) {
      revokeAdminSession(verified.jti);
      addRevokedSessionToFile(verified.jti);
      writeSecurityLog(clientIp, "SESSION_TERMINATED", `Session revoked early. JTI: ${verified.jti}`);
    }
  }

  cookieStore.delete("silk_admin_token");
  return NextResponse.json({
    success: true,
    message: "Admin session safely terminated and invalidated.",
  });
}

export async function GET(req: Request) {
  const clientIp =
    req.headers.get("x-nf-client-connection-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const cookieStore = cookies();
  const token = cookieStore.get("silk_admin_token")?.value;

  if (token) {
    const verified = await verifyAdminJWT(token);
    if (verified && verified.jti) {
      revokeAdminSession(verified.jti);
      addRevokedSessionToFile(verified.jti);
      writeSecurityLog(clientIp, "SESSION_TERMINATED", `Session revoked early via GET. JTI: ${verified.jti}`);
    }
  }

  cookieStore.delete("silk_admin_token");
  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}
