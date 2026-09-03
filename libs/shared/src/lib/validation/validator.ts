/**
 * Validation Utility
 * Wraps Zod validation with custom error handling
 */

import { z, ZodSchema } from 'zod';
import { ValidationError } from '../errors/index';

export class Validator {
  /**
   * Validate data against a Zod schema
   */
  static validate<T>(schema: ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        throw new ValidationError('Validation failed', { errors });
      }
      throw error;
    }
  }

  /**
   * Validate data and return result (doesn't throw)
   */
  static safeParse<T>(schema: ZodSchema<T>, data: unknown) {
    return schema.safeParse(data);
  }
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  uuid: z.string().uuid('Invalid UUID'),
  url: z.string().url('Invalid URL'),
  positiveInt: z.number().int().positive('Must be a positive integer'),
  nonEmptyString: z.string().min(1, 'Cannot be empty'),
  
  // Pagination
  pagination: z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }).optional(),
};
