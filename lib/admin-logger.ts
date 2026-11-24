/**
 * Silk Admin Logger — Serverless-compatible structured logging
 * Writes single-line JSON to stdout/stderr (captured by Netlify / Vercel / any PaaS).
 * No filesystem writes — works in Edge, Lambda, and serverless runtimes.
 */

function maskSensitive(value: string): string {
  // Mask phone numbers: show last 4 digits
  const masked = value.replace(
    /(\+?\d{1,4})\d{4,}(\d{4})/g,
    "$1****$2"
  );
  // Mask emails: show first 2 chars + domain
  return masked.replace(
    /([a-zA-Z0-9_.+-]{2})[a-zA-Z0-9_.+-]*@/g,
    "$1***@"
  );
}

export function writeSecurityLog(ip: string, event: string, details: string) {
  const entry = {
    level: "warn",
    source: "silk-admin-security",
    timestamp: new Date().toISOString(),
    ip,
    event,
    details: maskSensitive(details),
  };
  console.warn(JSON.stringify(entry));
}

// In-memory revoked sessions set (serverless: per-instance lifetime)
const revokedSessions = new Set<string>();

export function getRevokedSessionsFromFile(): string[] {
  return Array.from(revokedSessions);
}

export function addRevokedSessionToFile(jti: string) {
  if (jti) {
    revokedSessions.add(jti);
  }
}
