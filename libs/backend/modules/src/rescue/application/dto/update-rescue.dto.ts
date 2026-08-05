/**
 * Update Rescue DTOs
 */

import { z } from '@snake-rescue/shared';

export const UpdateRescueStatusInputSchema = z.object({
  rescueId: z.string().uuid('Invalid rescue ID'),
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
});

export type UpdateRescueStatusInput = z.infer<typeof UpdateRescueStatusInputSchema>;

export const AssignVolunteerInputSchema = z.object({
  rescueId: z.string().uuid('Invalid rescue ID'),
  volunteerId: z.string().uuid('Invalid volunteer ID'),
});

export type AssignVolunteerInput = z.infer<typeof AssignVolunteerInputSchema>;

export interface UpdateRescueResponse {
  success: boolean;
  message?: string;
  rescue?: {
    id: string;
    status: string;
    updatedAt: Date;
  };
}
