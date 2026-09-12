/**
 * Base Tool Implementation
 * 
 * Abstract base class for all AI tools.
 * Provides common functionality for validation, authorization, and error handling.
 */

import { z } from 'zod';
import {
  Tool,
  ToolDefinition,
  ToolContext,
  ToolResult,
} from '../types/tool.types';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('BaseTool');

/**
 * Abstract base tool class
 */
export abstract class BaseTool<TInput = any, TOutput = any>
  implements Tool<TInput, TOutput>
{
  abstract readonly definition: ToolDefinition;

  /**
   * Execute the tool (must be implemented by subclasses)
   */
  protected abstract executeImpl(
    input: TInput,
    context: ToolContext
  ): Promise<TOutput>;

  /**
   * Execute the tool with error handling and logging
   */
  async execute(
    input: TInput,
    context: ToolContext
  ): Promise<ToolResult<TOutput>> {
    const startTime = Date.now();

    try {
      // Validate input
      const validation = this.validateInput(input);
      if (!validation.valid) {
        return {
          success: false,
          error: `Invalid input: ${validation.errors?.join(', ')}`,
          errorCode: 'INVALID_INPUT',
        };
      }

      // Check authorization
      if (!this.isAuthorized(context)) {
        logger.warn({
          tool: this.definition.name,
          userId: context.userId,
          userRole: context.userRole,
        }, 'Unauthorized tool execution attempt');

        return {
          success: false,
          error: 'Not authorized to execute this tool',
          errorCode: 'UNAUTHORIZED',
        };
      }

      // Execute tool
      logger.info({
        tool: this.definition.name,
        userId: context.userId,
        category: this.definition.category,
      }, 'Executing tool');

      const result = await this.executeImpl(input, context);
      const executionTime = Date.now() - startTime;

      logger.info({
        tool: this.definition.name,
        executionTime,
      }, 'Tool execution successful');

      return {
        success: true,
        data: result,
        metadata: {
          executionTimeMs: executionTime,
          toolName: this.definition.name,
          category: this.definition.category,
        },
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      logger.error({
        tool: this.definition.name,
        error: error.message,
        executionTime,
      }, 'Tool execution failed');

      return {
        success: false,
        error: error.message || 'Tool execution failed',
        errorCode: error.code || 'EXECUTION_ERROR',
        metadata: {
          executionTimeMs: executionTime,
          toolName: this.definition.name,
        },
      };
    }
  }

  /**
   * Validate input using Zod schema (if defined)
   */
  validateInput(input: any): { valid: boolean; errors?: string[] } {
    if (!this.definition.schema) {
      // No schema defined, skip validation
      return { valid: true };
    }

    try {
      this.definition.schema.parse(input);
      return { valid: true };
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(
          (err) => `${err.path.join('.')}: ${err.message}`
        );
        return { valid: false, errors };
      }

      return {
        valid: false,
        errors: [error.message || 'Validation failed'],
      };
    }
  }

  /**
   * Check if user is authorized to execute this tool
   */
  isAuthorized(context: ToolContext): boolean {
    // Check if user's role is allowed
    const userRole = context.userRole || 'PUBLIC';
    if (!this.definition.visibleToRoles.includes(userRole)) {
      return false;
    }

    // Check if user has required permissions
    if (this.definition.requiredPermissions.length === 0) {
      return true;
    }

    return this.definition.requiredPermissions.every((permission) =>
      context.permissions.includes(permission)
    );
  }

  /**
   * Sanitize output for audit logging
   * Override this to remove sensitive data
   */
  protected sanitizeForAudit(data: any): any {
    // Remove common sensitive fields
    const sanitized = { ...data };
    const sensitiveFields = [
      'password',
      'apiKey',
      'token',
      'secret',
      'privateKey',
    ];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
