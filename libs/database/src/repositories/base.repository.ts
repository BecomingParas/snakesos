/**
 * Base Repository
 * Generic CRUD operations for all repositories
 */

import { PrismaClient, Prisma } from '@prisma/client';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(where?: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
  count(where?: any): Promise<number>;
}

export abstract class BaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereInput = any
> implements IBaseRepository<T> {
  
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: Prisma.ModelName
  ) {}

  /**
   * Get the Prisma model delegate
   */
  protected get model(): any {
    return (this.prisma as any)[this.modelName.toLowerCase()];
  }

  /**
   * Find by ID
   */
  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  /**
   * Find many records
   */
  async findMany(params: {
    where?: WhereInput;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  } = {}): Promise<T[]> {
    return this.model.findMany(params);
  }

  /**
   * Find first matching record
   */
  async findFirst(params: {
    where?: WhereInput;
    include?: any;
    orderBy?: any;
  }): Promise<T | null> {
    return this.model.findFirst(params);
  }

  /**
   * Create a new record
   */
  async create(data: CreateInput, include?: any): Promise<T> {
    return this.model.create({
      data,
      include,
    });
  }

  /**
   * Update a record
   */
  async update(id: string, data: UpdateInput, include?: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
      include,
    });
  }

  /**
   * Delete a record (hard delete)
   */
  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Soft delete a record
   */
  async softDelete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Count records
   */
  async count(where?: WhereInput): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Check if record exists
   */
  async exists(where: WhereInput): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Execute in transaction
   */
  async transaction<R>(
    fn: (tx: Prisma.TransactionClient) => Promise<R>
  ): Promise<R> {
    return this.prisma.$transaction(fn);
  }
}
