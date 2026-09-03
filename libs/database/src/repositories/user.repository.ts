/**
 * User Repository
 * Database operations for User entity
 */

import { PrismaClient, User, Prisma } from '../prisma/generated/client';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'User');
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by email with relations
   */
  async findByEmailWithRelations(email: string) {
    return this.model.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find user with rescue requests
   */
  async findWithRescues(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        rescueRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Search users by name or email
   */
  async search(query: string, limit: number = 10): Promise<User[]> {
    return this.model.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  }

  /**
   * Get users by role
   */
  async findByRole(roleName: string): Promise<User[]> {
    return this.model.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: roleName,
            },
          },
        },
      },
    });
  }

  /**
   * Update last login
   */
  async updateLastLogin(id: string): Promise<User> {
    return this.model.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
