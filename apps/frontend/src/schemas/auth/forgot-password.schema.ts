/**
 * Forgot Password Form Validation Schema
 */

import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
