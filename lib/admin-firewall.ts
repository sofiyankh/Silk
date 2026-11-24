// Fuzzing, Exploit & Probe Signatures
export const FUZZING_PATTERNS: RegExp[] = [
  // SQL Injection
  /(%27)|(')|(--)|(%23)|(#)/i,
  /\w*((\%27)|('))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
  /exec(\s|\+)+(s|x)p\w+/i,
  /union(\s|\+)+(all(\s|\+)+)?select/i,
  /select(\s|\+)+.*\bfrom\b/i,
  /\b(sleep|benchmark|waitfor delay)\b/i,

  // XSS & Code Injection
  /<script\b[^>]*>/i,
  /javascript\s*:/i,
  /onload\s*=/i,
  /eval\s*\(/i,
  /base64_decode/i,

  // Path Traversal & Probes
  /\.\.\/|\.\.\\/i,
  /(%2e%2e%2f)|(%2e%2e\/)/i,
  /\/etc\/(passwd|shadow|hosts)/i,
  /\.env|\.git|\.htaccess|\.ssh/i,
  /\bwp-(admin|login|content|includes)\b/i,
  /\b(phpinfo|phpmyadmin)\b/i,
  /\b(cmd|powershell|bin\/sh|bin\/bash)\b/i,
];

export interface BlockedRecord {
  ip: string;
  blockedUntil: number;
  reason: string;
  violationsCount: number;
}

// In-memory blacklist cache
const blockedIPsMap = new Map<string, BlockedRecord>();

// Request velocity tracker: max 25 requests per 10-second window
interface VelocityRecord {
  count: number;
  windowStart: number;
}
const requestVelocityMap = new Map<string, VelocityRecord>();

// Failed Auth tracker: max 3 attempts before 30-min ban
interface FailedAuthRecord {
  attempts: number;
  firstAttempt: number;
}
const failedAuthMap = new Map<string, FailedAuthRecord>();

// Optional external log listener (attached in Node runtime)
type LogCallback = (ip: string, event: string, details: string) => void;
let externalLogCallback: LogCallback | null = null;

export function registerFirewallLogger(callback: LogCallback) {
  externalLogCallback = callback;
}

function notifySecurityEvent(ip: string, event: string, details: string) {
  const timestamp = new Date().toISOString();
  console.warn(`🚨 [FIREWALL] [${timestamp}] [IP: ${ip}] [${event}] ${details}`);
  if (externalLogCallback) {
    try {
      externalLogCallback(ip, event, details);
    } catch (e) {
      // ignore callback error
    }
  }
}

/**
 * Check if a client IP is currently blocked
 */
export function isIPBlocked(ip: string): { isBlocked: boolean; reason?: string; remainingSeconds?: number } {
  const record = blockedIPsMap.get(ip);
  if (!record) return { isBlocked: false };

  const now = Date.now();
  if (record.blockedUntil > now) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { isBlocked: true, reason: record.reason, remainingSeconds };
  }

  // Ban expired
  blockedIPsMap.delete(ip);
  return { isBlocked: false };
}

/**
 * Immediately block an IP for a specific duration (default: 60 minutes)
 */
export function blockIP(ip: string, reason: string, durationMinutes = 60) {
  const now = Date.now();
  const blockedUntil = now + durationMinutes * 60 * 1000;
  const existing = blockedIPsMap.get(ip);
  const violationsCount = (existing?.violationsCount || 0) + 1;

  blockedIPsMap.set(ip, {
    ip,
    blockedUntil,
    reason,
    violationsCount,
  });

  notifySecurityEvent(
    ip,
    "IP_BLOCKED",
    `${reason} (Banned for ${durationMinutes} minutes, total violations: ${violationsCount})`
  );
}

/**
 * Inspect an incoming request for fuzzing signatures and velocity spikes
 */
export function inspectRequest(
  ip: string,
  pathname: string,
  queryString = "",
  userAgent = "",
  bodyString = ""
): { allowed: boolean; reason?: string } {
  // 1. Check if already blocked
  const status = isIPBlocked(ip);
  if (status.isBlocked) {
    return {
      allowed: false,
      reason: `Access Denied: Your IP is blacklisted (${status.reason}). Retry in ${status.remainingSeconds}s.`,
    };
  }

  // 2. Velocity check: max 25 requests per 10-second window to admin routes
  const now = Date.now();
  const velocity = requestVelocityMap.get(ip) || { count: 0, windowStart: now };

  if (now - velocity.windowStart > 10000) {
    // Reset window
    velocity.count = 1;
    velocity.windowStart = now;
  } else {
    velocity.count += 1;
    if (velocity.count > 25) {
      blockIP(ip, "Excessive request velocity / Denial of Service attempt", 30);
      return {
        allowed: false,
        reason: "Access Denied: Excessive request rate detected. IP has been temporarily blocked.",
      };
    }
  }
  requestVelocityMap.set(ip, velocity);

  // 3. Fuzzing & Exploit inspection
  const testPayloads = [pathname, queryString, userAgent, bodyString].join(" ");

  for (const pattern of FUZZING_PATTERNS) {
    if (pattern.test(testPayloads)) {
      blockIP(ip, `Fuzzing / Exploit payload signature detected: ${pattern.toString()}`, 60);
      return {
        allowed: false,
        reason: "Security Alert: Malicious request payload / fuzzing probe detected and blocked.",
      };
    }
  }

  return { allowed: true };
}

/**
 * Record a failed authentication attempt for an IP
 */
export function recordAuthFailure(ip: string): { attemptsLeft: number; isBlocked: boolean } {
  const now = Date.now();
  const record = failedAuthMap.get(ip) || { attempts: 0, firstAttempt: now };

  // Reset if older than 10 minutes
  if (now - record.firstAttempt > 10 * 60 * 1000) {
    record.attempts = 1;
    record.firstAttempt = now;
  } else {
    record.attempts += 1;
  }

  failedAuthMap.set(ip, record);
  notifySecurityEvent(ip, "AUTH_FAILURE", `Failed admin login attempt (${record.attempts}/3)`);

  if (record.attempts >= 3) {
    blockIP(ip, "Brute-force attack detected (3 failed admin credentials)", 30);
    failedAuthMap.delete(ip);
    return { attemptsLeft: 0, isBlocked: true };
  }

  return { attemptsLeft: 3 - record.attempts, isBlocked: false };
}

/**
 * Clear failure count on successful authentication
 */
export function clearAuthFailure(ip: string) {
  failedAuthMap.delete(ip);
}
