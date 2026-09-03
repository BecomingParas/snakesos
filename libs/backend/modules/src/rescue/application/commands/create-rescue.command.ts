/**
 * Create Rescue Command
 * Command pattern for write operations
 */

import { RescueRepository } from '@snake-rescue/database';
import type { CreateRescueInput } from '../dto/index';
import { Prisma } from '@snake-rescue/database';

function createReferenceNumber() {
  return `BR-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export class CreateRescueCommand {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(input: CreateRescueInput, reporterId?: string) {
    // Prepare data for Prisma - matches RescueRequest schema
    const data: Prisma.RescueRequestCreateInput = {
      // Reporter Information
      name: input.name,
      phone: input.phone,
      email: input.email,

      // Location Details
      municipality: input.municipality,
      ward: input.ward ?? null,
      address: input.address,
      landmark: input.landmark,
      lat: input.lat ?? null,
      lng: input.lng ?? null,

      // Snake Information
      snakeDescription: input.snakeDescription,
      snakeSize: input.snakeSize,
      snakeColor: input.snakeColor,
      snakeImageUrl: input.snakeImageUrl ?? input.snakeImages?.[0],
      snakeImages: input.snakeImages ?? [],

      // Rescue Details
      priority:
        input.isEmergency || input.hasBite ? 'HIGH' : (input.priority as any),
      notes: input.notes,
      isEmergency: input.isEmergency,
      emergencyDetails: input.emergencyDetails,
      hasBite: input.hasBite,
      biteDetails: input.biteDetails,

      // Status
      status: 'PENDING',
      stillPresent: true,
      referenceNumber: createReferenceNumber(),
      publicIdempotencyKey: input.publicIdempotencyKey,

      // Connect to user if provided
      user: reporterId
        ? {
            connect: { id: reporterId },
          }
        : undefined,
    };

    // Create rescue request
    const rescue = await this.rescueRepository.create(data as any);

    return rescue;
  }
}
