const RETRYABLE_PRISMA_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);
const RETRY_DELAYS_MS = [500, 1500];

function isRetryableDbError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { name?: string; code?: string };
  if (e.name === "PrismaClientInitializationError") return true;
  if (e.code && RETRYABLE_PRISMA_CODES.has(e.code)) return true;
  return false;
}

/**
 * Retries a database call up to 3 attempts (500ms then 1500ms delays)
 * only for Prisma connection/timeout errors. Other errors are rethrown immediately.
 */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  const maxAttempts = RETRY_DELAYS_MS.length + 1; // 3 attempts total
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isRetryableDbError(err) || attempt === maxAttempts) {
        throw err;
      }
      const delayMs = RETRY_DELAYS_MS[attempt - 1];
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
