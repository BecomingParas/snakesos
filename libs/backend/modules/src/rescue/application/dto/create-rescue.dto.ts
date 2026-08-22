/**
 * Create Rescue DTOs
 * Matches Prisma RescueRequest schema fields
 */

import { z } from '@snake-rescue/shared';

export const CreateRescueInputSchema = z.object({
  // Reporter Information (matches Prisma: name, phone, email)
  name: z.string().min(2, 'Contact name required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
  
  // Location Details (matches Prisma: municipality, ward, address, landmark, lat, lng)
  municipality: z.string().min(2, 'Municipality required'),
  ward: z.number().int().positive().optional(),
  address: z.string().min(5, 'Address required'),
  landmark: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  
  // Snake Information (matches Prisma: snakeDescription, snakeSize, snakeColor, snakeImageUrl)
  snakeDescription: z
    .string()
    .min(10, 'Snake description must be at least 10 characters')
    .optional(),
  snakeSize: z.enum(['Small (<1ft)', 'Medium (1-3ft)', 'Large (>3ft)']).optional(),
  snakeColor: z.string().optional(),
  snakeImageUrl: z.string().optional(),
  snakeImages: z.array(z.string()).optional(),
  
  // Rescue Details (matches Prisma: priority, notes, isEmergency)
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  notes: z.string().optional(),
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
