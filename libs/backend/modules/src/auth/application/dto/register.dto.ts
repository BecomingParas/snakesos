/**
 * Register DTOs
 */

import { z } from '@snake-rescue/shared';

export const RegisterInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
