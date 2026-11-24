import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  createChallengeToken,
  verifyChallengeToken,
  signAdminJWT,
  getAdminSecurityKey,
  constantTimeCompare,
  ADMIN_SESSION_DURATION_SECONDS,
} from "@/lib/admin-crypto";
import {
  inspectRequest,
  recordAuthFailure,
  clearAuthFailure,
  isIPBlocked,
} from "@/lib/admin-firewall";
import { writeSecurityLog } from "@/lib/admin-logger";

export async function POST(req: Request) {
  try {
    const clientIp =
      req.headers.get("x-nf-client-connection-ip")?.trim() ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "";
    const url = new URL(req.url);

    // 1. IP & Firewall Check (Velocity, Fuzzing & Blacklist)
    const firewallCheck = inspectRequest(clientIp, url.pathname, url.search, userAgent);
    if (!firewallCheck.allowed) {
      writeSecurityLog(clientIp, "FIREWALL_BLOCKED", firewallCheck.reason || "Blocked by firewall");
      return NextResponse.json(
        { error: firewallCheck.reason || "Access blocked by security firewall." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { step, email, password, challengeToken, securityKey } = body;

    // =========================================================================
    // STEP 2: Secondary 32-Character Security Key Verification
    // =========================================================================
    if (step === 2 || challengeToken || securityKey) {
      if (!challengeToken || !securityKey) {
        return NextResponse.json(
          { error: "Both challenge token and 32-character security key are required." },
          { status: 400 }
        );
      }

      // Verify challenge token authenticity & 5-minute expiry
      const challenge = await verifyChallengeToken(challengeToken);
      if (!challenge) {
        recordAuthFailure(clientIp);
        writeSecurityLog(clientIp, "CHALLENGE_EXPIRED", "Expired or forged challenge token submitted");
        return NextResponse.json(
          { error: "Security challenge has expired or is invalid. Please restart login." },
          { status: 401 }
        );
      }

      const expectedKey = getAdminSecurityKey();
      const providedKey = String(securityKey || "").trim();
      const isKeyValid = constantTimeCompare(providedKey, expectedKey);

      if (!isKeyValid) {
        const failure = recordAuthFailure(clientIp);
        writeSecurityLog(
          clientIp,
          "SECURITY_KEY_FAILURE",
          `Invalid secondary key submitted. Attempts left: ${failure.attemptsLeft}`
        );

        const errorMsg = failure.isBlocked
          ? "Maximum failed attempts exceeded. IP temporarily banned for 30 minutes."
          : `Invalid 32-character security key. (${failure.attemptsLeft} attempt(s) remaining)`;

        return NextResponse.json({ error: errorMsg }, { status: 401 });
      }

      // Success: Fetch admin user
      let user = await db.user.findUnique({
        where: { id: challenge.userId },
      });

      if (!user) {
        user = await db.user.findUnique({
          where: { email: challenge.email },
        });
      }

      if (!user) {
        return NextResponse.json({ error: "Administrator record not found." }, { status: 404 });
      }

      // Clear failed auth counters
      clearAuthFailure(clientIp);

      // Generate 4-Hour JWT
      const { token, payload } = await signAdminJWT({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      // Issue cookie
      const cookieStore = cookies();
      cookieStore.set("silk_admin_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ADMIN_SESSION_DURATION_SECONDS, // Exactly 4 Hours (14,400s)
      });

      writeSecurityLog(
        clientIp,
        "ADMIN_LOGIN_SUCCESS",
        `Full two-factor admin session granted to ${user.email}. JTI: ${payload.jti}`
      );

      return NextResponse.json({
        success: true,
        message: "Two-step administrative authentication complete. Session active for 4 hours.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: "ADMIN",
        },
        session: {
          jti: payload.jti,
          expiresIn: ADMIN_SESSION_DURATION_SECONDS,
          expiresAt: payload.exp * 1000,
        },
      });
    }

    // =========================================================================
    // STEP 1: Email + Master Admin Password Verification
    // =========================================================================
    if (!email || !password) {
      return NextResponse.json(
        { error: "Admin email and master password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const envAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "";

    const matchesEnv = cleanEmail === envAdminEmail && password === envAdminPassword;

    let user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    let isValid = false;

    if (user) {
      if (user.role !== "ADMIN" || !user.isActive) {
        recordAuthFailure(clientIp);
        writeSecurityLog(clientIp, "UNAUTHORIZED_ROLE", `Non-admin user attempted admin login: ${cleanEmail}`);
        return NextResponse.json(
          { error: "Access Denied: Restricted strictly to Silk Administrators." },
          { status: 403 }
        );
      }

      const hashMatches = await bcrypt.compare(password, user.passwordHash);
      if (hashMatches || matchesEnv) {
        isValid = true;
        // Auto-sync DB hash if password was updated via .env
        if (matchesEnv && !hashMatches) {
          const newHash = await bcrypt.hash(password, 10);
          await db.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash, isActive: true },
          });
        }
      }
    } else if (matchesEnv) {
      const newHash = await bcrypt.hash(password, 10);
      user = await db.user.create({
        data: {
          email: cleanEmail,
          passwordHash: newHash,
          name: "Silk Admin",
          role: "ADMIN",
          locale: "fr",
          isActive: true,
        },
      });
      isValid = true;
    }

    if (!isValid || !user) {
      const failed = recordAuthFailure(clientIp);
      writeSecurityLog(
        clientIp,
        "STEP1_AUTH_FAILURE",
        `Failed Step 1 credentials for ${cleanEmail}. Attempts left: ${failed.attemptsLeft}`
      );

      const remainingNotice = failed.isBlocked
        ? "Access temporarily blocked for 30 minutes due to repeated failed attempts."
        : `Invalid administrator credentials. (${failed.attemptsLeft} attempt(s) remaining)`;

      return NextResponse.json({ error: remainingNotice }, { status: 401 });
    }

    // Step 1 Passed: Generate temporary challenge token (valid for 5 minutes)
    const challengeTokenIssued = await createChallengeToken(user.id, user.email);

    writeSecurityLog(
      clientIp,
      "STEP1_SUCCESS",
      `Step 1 passed for ${user.email}. Challenge token issued. Awaiting 32-char security key.`
    );

    return NextResponse.json({
      success: true,
      challengeRequired: true,
      challengeToken: challengeTokenIssued,
      email: user.email,
      message: "Step 1 verified. Please provide the 32-character secondary security key.",
    });
  } catch (err: any) {
    console.error("Secure auth error:", err);
    return NextResponse.json(
      { error: err.message || "Administrative authentication error" },
      { status: 500 }
    );
  }
}

// Current session status
export async function GET(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("silk_admin_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { verifyAdminJWT } = await import("@/lib/admin-crypto");
  const payload = await verifyAdminJWT(token);

  if (!payload) {
    return NextResponse.json({ authenticated: false, reason: "Session expired or invalid" }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    },
    session: {
      jti: payload.jti,
      expiresAt: payload.exp * 1000,
      remainingSeconds: payload.exp - Math.floor(Date.now() / 1000),
    },
  });
}
