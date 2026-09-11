/**
 * Create Rescue Request Tool
 * 
 * Creates a new snake rescue request.
 * This is a WRITE operation that requires confirmation.
 */

import { z } from 'zod';
import { BaseTool } from '../base.tool';
import { ToolDefinition } from '../../types/tool.types';
import { prisma } from '@snake-rescue/database';

const inputSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  municipality: z.string().min(2),
  address: z.string().min(5),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  snakeDescription: z.string().optional(),
  isEmergency: z.boolean().optional().default(false),
});

type CreateRescueRequestInput = z.infer<typeof inputSchema>;

interface RescueRequestResult {
  id: string;
  referenceNumber: string;
  status: string;
  createdAt: Date;
  message: string;
}

/**
 * Create Rescue Request Tool
 */
export class CreateRescueRequestTool extends BaseTool<
  CreateRescueRequestInput,
  RescueRequestResult
> {
  readonly definition: ToolDefinition = {
    name: 'createRescueRequest',
    description:
      'Create a new snake rescue request. Use this when someone needs professional help to remove or relocate a snake. Requires name, phone, location, and address. This action will dispatch a rescuer.',
    category: 'action',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'Name of the person requesting rescue',
        required: true,
      },
      {
        name: 'phone',
        type: 'string',
        description: 'Contact phone number',
        required: true,
      },
      {
        name: 'email',
        type: 'string',
        description: 'Email address (optional)',
        required: false,
      },
      {
        name: 'municipality',
        type: 'string',
        description: 'Municipality/city name',
        required: true,
      },
      {
        name: 'address',
        type: 'string',
        description: 'Detailed address with landmarks',
        required: true,
      },
      {
        name: 'latitude',
        type: 'number',
        description: 'Latitude coordinate',
        required: true,
      },
      {
        name: 'longitude',
        type: 'number',
        description: 'Longitude coordinate',
        required: true,
      },
      {
        name: 'snakeDescription',
        type: 'string',
        description: 'Description of the snake (color, size, behavior)',
        required: false,
      },
      {
        name: 'isEmergency',
        type: 'boolean',
        description: 'Is this an emergency situation?',
        required: false,
      },
    ],
    requiredPermissions: [],
    requiresConfirmation: true,
    isReadOnly: false,
    visibleToRoles: ['PUBLIC', 'CITIZEN', 'VOLUNTEER', 'VERIFIED_RESCUER', 'ADMIN', 'SUPER_ADMIN'],
    schema: inputSchema,
    exampleUsage:
      'createRescueRequest({ name: "John Doe", phone: "9841234567", municipality: "Butwal", address: "Near City Hospital", latitude: 27.7006, longitude: 83.4484 })',
  };

  protected async executeImpl(
    input: CreateRescueRequestInput
  ): Promise<RescueRequestResult> {
    // Generate reference number
    const refNumber = await this.generateReferenceNumber();

    // Create rescue request
    const rescueRequest = await prisma.rescueRequest.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        municipality: input.municipality,
        address: input.address,
        lat: input.latitude,
        lng: input.longitude,
        snakeDescription: input.snakeDescription,
        isEmergency: input.isEmergency || false,
        status: 'PENDING',
        priority: input.isEmergency ? 'CRITICAL' : 'MEDIUM',
        source: 'AI_CHAT',
        referenceNumber: refNumber,
        stillPresent: true,
      },
    });

    return {
      id: rescueRequest.id,
      referenceNumber: refNumber,
      status: rescueRequest.status,
      createdAt: rescueRequest.createdAt,
      message: `Rescue request created successfully. Reference number: ${refNumber}. A rescuer will be assigned shortly.`,
    };
  }

  /**
   * Generate unique reference number
   */
  private async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.rescueRequest.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `BR-${year}-${sequence}`;
  }
}
