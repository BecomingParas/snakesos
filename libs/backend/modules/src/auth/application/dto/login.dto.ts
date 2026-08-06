/**
 * Login DTOs
 */

import { z } from '@snake-rescue/shared';

export const LoginInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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
  expiresIn: number;
}
