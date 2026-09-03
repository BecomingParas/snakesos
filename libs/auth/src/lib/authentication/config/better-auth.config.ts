import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';
import { prisma } from '@snake-rescue/database';
import bcrypt from 'bcryptjs';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000/api/auth',
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'dev-secret-change-in-production',

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    // Tell Better Auth about our custom table names (@@map in Prisma schema)
    // Better Auth expects lowercase singular table names by default
    // Our schema uses: @@map("users"), @@map("accounts"), @@map("sessions")
    useSingularTableNames: false, // Use plural table names (users, accounts, sessions)
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled for now - users are pre-verified in seed
    // Use bcrypt instead of scrypt (default) for compatibility with seeded users
    password: {
      hash: async (password: string) => {
        return bcrypt.hash(password, 10);
      },
      verify: async (data: { password: string; hash: string }) => {
        return bcrypt.compare(data.password, data.hash);
      },
    },
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  advanced: {
    cookiePrefix: 'snake_rescue',
    crossSubDomainCookies: {
      enabled: !!process.env.COOKIE_DOMAIN,
      domain: process.env.COOKIE_DOMAIN,
    },
  },

  // Security settings
  rateLimit: {
    enabled: true,
    window: 15 * 60, // 15 minutes
    max: 10, // 10 requests per window
  },

  trustedOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  
  // Enable Bearer token authentication for JWT support
  plugins: [
    bearer({
      requireSignature: process.env.NODE_ENV === 'production',
    }),
  ],
});
