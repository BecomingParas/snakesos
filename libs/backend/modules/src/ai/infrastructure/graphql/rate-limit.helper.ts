/**
 * GraphQL Rate Limiting Helper for Snake Identification
 * 
 * Simple in-memory rate limiting for the identifySnake mutation
 * Tracks requests per IP address within a time window
 * 
 * PRODUCTION CONSIDERATIONS:
 * - For multi-server deployments, use Redis-based rate limiting
 * - Consider user-based limits for authenticated requests
 * - Monitor and adjust limits based on usage patterns
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class SnakeIdentificationRateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 20) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request is allowed
   * Returns true if within limit, false if rate limited
   */
  checkLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // No previous requests or window expired
    if (!entry || now >= entry.resetAt) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return { allowed: true };
    }

    // Within window - check if under limit
    if (entry.count < this.maxRequests) {
      entry.count += 1;
      return { allowed: true };
    }

    // Rate limited
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000); // seconds
    return { allowed: false, retryAfter };
  }

  /**
   * Get current usage for an identifier
   */
  getUsage(identifier: string): { count: number; limit: number; resetAt: number } {
    const entry = this.requests.get(identifier);
    const now = Date.now();

    if (!entry || now >= entry.resetAt) {
      return {
        count: 0,
        limit: this.maxRequests,
        resetAt: now + this.windowMs,
      };
    }

    return {
      count: entry.count,
      limit: this.maxRequests,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetAt) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.requests.delete(key);
    }

    if (expiredKeys.length > 0) {
      console.log(`🧹 Cleaned up ${expiredKeys.length} expired rate limit entries`);
    }
  }

  /**
   * Destroy the rate limiter and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.requests.clear();
  }
}

// Singleton instance
export const snakeIdentificationRateLimiter = new SnakeIdentificationRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20 // 20 requests per window
);

/**
 * Get identifier for rate limiting
 * Uses IP address, with fallback to user ID for authenticated requests
 */
export function getRateLimitIdentifier(context: {
  req?: { ip?: string; socket?: { remoteAddress?: string } };
  user?: { id?: string };
}): string {
  // Prefer user ID for authenticated requests
  if (context.user?.id) {
    return `user:${context.user.id}`;
  }

  // Fall back to IP address
  const ip =
    context.req?.ip ||
    context.req?.socket?.remoteAddress ||
    'unknown';

  return `ip:${ip}`;
}

/**
 * Check rate limit and throw error if exceeded
 */
export function checkSnakeIdentificationRateLimit(context: {
  req?: { ip?: string; socket?: { remoteAddress?: string } };
  user?: { id?: string };
}): void {
  // Skip in development if explicitly disabled
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true') {
    return;
  }

  const identifier = getRateLimitIdentifier(context);
  const result = snakeIdentificationRateLimiter.checkLimit(identifier);

  if (!result.allowed) {
    const error = new Error('RATE_LIMIT_EXCEEDED') as Error & {
      extensions?: Record<string, unknown>;
    };
    error.extensions = {
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: result.retryAfter,
      message: `Too many snake identification requests. Please try again in ${result.retryAfter} seconds.`,
    };
    throw error;
  }
}
