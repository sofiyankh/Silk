/**
 * Universal Web Crypto & JWT Security Module for Silk Administrator
 * Works in both Edge Runtime (middleware) and Node.js
 */

export function getAdminSecurityKey(): string {
  const key = (process.env.ADMIN_SECURITY_KEY || "")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!key) {
    throw new Error("ADMIN_SECURITY_KEY is not configured.");
  }

  if (!/^[A-Za-z0-9]{32}$/.test(key)) {
    throw new Error("ADMIN_SECURITY_KEY must be exactly 32 alphanumeric characters [A-Za-z0-9].");
  }

  return key;
}

export function constantTimeCompare(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBuf = enc.encode(a);
  const bBuf = enc.encode(b);
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < aBuf.length; i++) {
    diff |= aBuf[i] ^ bBuf[i];
  }
  return diff === 0;
}

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (() => { throw new Error("ADMIN_JWT_SECRET or NEXTAUTH_SECRET must be set"); })();

function getCompositeSecret(): string {
  return `${JWT_SECRET}::${getAdminSecurityKey()}`;
}

// 4 Hours JWT session lifetime in seconds (14,400s)
export const ADMIN_SESSION_DURATION_SECONDS = 4 * 60 * 60;

export interface AdminJWTPayload {
  jti: string; // Unique Session ID
  sub: string; // User ID
  email: string;
  name: string;
  role: "ADMIN";
  iat: number; // Issued At (epoch seconds)
  exp: number; // Expiration (epoch seconds)
  secKeyHash?: string; // Verification fingerprint
}

export interface AdminChallengePayload {
  type: "ADMIN_CHALLENGE";
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// In-memory revocation cache for instant invalidation
const revokedSessionsCache = new Set<string>();

/**
 * Base64URL encoding (RFC 7515 / 7519)
 */
function base64UrlEncode(str: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(str, "utf8").toString("base64")
      : btoa(str);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Base64URL decoding (RFC 7515 / 7519)
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return typeof Buffer !== "undefined"
    ? Buffer.from(base64, "base64").toString("utf8")
    : atob(base64);
}

/**
 * Web Crypto HMAC-SHA256 signature
 */
async function computeHmacSha256(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(signature).toString("base64")
      : btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Universal UUID generator
 */
function generateUUID(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a 5-minute temporary Challenge Token for Step 1 -> Step 2
 */
export async function createChallengeToken(userId: string, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminChallengePayload = {
    type: "ADMIN_CHALLENGE",
    userId,
    email,
    iat: now,
    exp: now + 5 * 60, // 5 minutes
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const data = base64UrlEncode(JSON.stringify(payload));
  const signature = await computeHmacSha256(getCompositeSecret(), `${header}.${data}`);

  return `${header}.${data}.${signature}`;
}

/**
 * Verify Step 1 temporary challenge token
 */
export async function verifyChallengeToken(tokenString: string): Promise<AdminChallengePayload | null> {
  if (!tokenString || typeof tokenString !== "string") return null;

  const parts = tokenString.split(".");
  if (parts.length !== 3) return null;

  const [header, data, signature] = parts;
  const expectedSig = await computeHmacSha256(getCompositeSecret(), `${header}.${data}`);
  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(data)) as AdminChallengePayload;
    if (payload.type !== "ADMIN_CHALLENGE") return null;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null; // Expired
    return payload;
  } catch {
    return null;
  }
}

/**
 * Generate 4-Hour JWT Session Token using 32-char Security Key + Date/Time
 */
export async function signAdminJWT(user: { id: string; email: string; name?: string | null }): Promise<{
  token: string;
  payload: AdminJWTPayload;
}> {
  const now = Math.floor(Date.now() / 1000);
  const jti = generateUUID();

  // Combine security key with issuance timestamp fingerprint
  const secFingerprint = await computeHmacSha256(getAdminSecurityKey(), `${user.id}:${now}`);

  const payload: AdminJWTPayload = {
    jti,
    sub: user.id,
    email: user.email,
    name: user.name || "Silk Administrator",
    role: "ADMIN",
    iat: now,
    exp: now + ADMIN_SESSION_DURATION_SECONDS, // Exactly 4 Hours
    secKeyHash: secFingerprint.substring(0, 16),
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const data = base64UrlEncode(JSON.stringify(payload));
  const signature = await computeHmacSha256(getCompositeSecret(), `${header}.${data}`);

  return {
    token: `${header}.${data}.${signature}`,
    payload,
  };
}

/**
 * Verify Admin JWT session token (Checks signature, 4hr expiry, and revocation)
 */
export async function verifyAdminJWT(tokenString: string): Promise<AdminJWTPayload | null> {
  if (!tokenString || typeof tokenString !== "string") return null;

  // Check 3-part standard JWT
  const parts = tokenString.split(".");
  if (parts.length === 3) {
    const [header, data, signature] = parts;
    const expectedSig = await computeHmacSha256(getCompositeSecret(), `${header}.${data}`);
    if (signature !== expectedSig) return null;

    try {
      const payload = JSON.parse(base64UrlDecode(data)) as AdminJWTPayload;
      if (payload.role !== "ADMIN") return null;

      // Check 4-hour expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return null; // Expired
      }

      // Check if session has been explicitly terminated / revoked
      if (payload.jti && revokedSessionsCache.has(payload.jti)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Terminate / Revoke an active session before 4hrs
 */
export function revokeAdminSession(jti: string) {
  if (!jti) return;
  revokedSessionsCache.add(jti);
}

/**
 * Check if a session has been revoked
 */
export function isSessionRevoked(jti: string): boolean {
  return revokedSessionsCache.has(jti);
}

// Backward-compatibility wrappers
export async function signAdminToken(payload: {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
  timestamp: number;
}): Promise<string> {
  const result = await signAdminJWT({ id: payload.id, email: payload.email, name: payload.name });
  return result.token;
}

export async function verifyAdminToken(tokenString: string) {
  const verified = await verifyAdminJWT(tokenString);
  if (!verified) return null;
  return {
    id: verified.sub,
    email: verified.email,
    name: verified.name,
    role: verified.role,
    timestamp: verified.iat * 1000,
  };
}
