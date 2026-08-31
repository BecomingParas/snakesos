/**
 * Create Rescue DTOs
 * Matches Prisma RescueRequest schema fields
 */

import { z } from '@snake-rescue/shared';

export const CreateRescueInputSchema = z.object({
  // Reporter Information (matches Prisma: name, phone, email)
  name: z.string().min(2, 'Contact name required'),
  phone: z
    .string()
    .transform((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.startsWith('977') && digits.length === 13
        ? digits.slice(3)
        : digits;
    })
    .pipe(z.string().regex(/^[0-9]{10}$/, 'Invalid phone number')),
  email: z.string().email().optional(),

  // Location Details (matches Prisma: municipality, ward, address, landmark, lat, lng)
  municipality: z.string().min(2, 'Municipality required'),
  ward: z.number().int().positive().optional(),
  address: z.string().min(5, 'Address required'),
  landmark: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),

  // Snake Information (matches Prisma: snakeDescription, snakeSize, snakeColor, snakeImageUrl)
  snakeDescription: z
    .string()
    .min(10, 'Snake description must be at least 10 characters')
    .optional(),
  snakeSize: z
    .enum(['Small (<1ft)', 'Medium (1-3ft)', 'Large (>3ft)'])
    .optional(),
  snakeColor: z.string().optional(),
  snakeImageUrl: z.string().optional(),
  snakeImages: z.array(z.string()).optional(),

  // Rescue Details (matches Prisma: priority, notes, isEmergency)
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  notes: z.string().max(2000).optional(),
  publicIdempotencyKey: z.string().max(100).optional(),
  isEmergency: z.boolean().optional(),
  emergencyDetails: z.string().optional(),
  hasBite: z.boolean().optional(),
  biteDetails: z.string().optional(),
});

export type CreateRescueInput = z.infer<typeof CreateRescueInputSchema>;

export interface CreateRescueResponse {
  success: boolean;
  message?: string;
  rescue?: {
    id: string;
    address: string;
    municipality: string;
    status: string;
    priority: string;
    createdAt: Date;
  };
}
