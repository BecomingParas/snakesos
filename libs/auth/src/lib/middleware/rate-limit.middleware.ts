import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Use default key generator which handles IPv6 properly
  // Skip rate limiting in development
  skip: (req) => {
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true') {
      return true;
    }
    return false;
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Use default key generator which handles IPv6 properly
  // Skip rate limiting in development
  skip: (req) => {
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true') {
      return true;
    }
    return false;
  },
});

/**
 * Snake Identification Rate Limiter
 * 
 * Conservative limits to prevent abuse of AI services (Gemini, Python ML, etc.)
 * 
 * RATIONALE:
 * - AI inference is expensive (API costs, compute resources)
 * - Prevents automated scraping/abuse
 * - Allows legitimate users reasonable access
 * - Protects against accidental DoS from frontend bugs
 * 
 * LIMITS:
 * - 20 identifications per 15 minutes per IP
 * - Balances user experience with API cost protection
 * - Authenticated users could have higher limits (future enhancement)
 */
export const snakeIdentificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 identification requests per window
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many snake identification requests. Please try again in 15 minutes.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  
  // Use default key generator which properly handles IPv4 and IPv6
  // No custom keyGenerator needed - the default handles IP addresses correctly

  // Skip rate limiting for certain conditions (optional)
  skip: (req) => {
    // Skip for development/testing if needed
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true') {
      return true;
    }
    return false;
  },

  // Custom handler when rate limit is exceeded
  handler: (req, res) => {
    console.warn({
      msg: 'Snake identification rate limit exceeded',
      ip: req.ip,
      path: req.path,
    });

    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many snake identification requests. Please try again later.',
        retryAfter: 900, // 15 minutes in seconds
      },
    });
  },
});
