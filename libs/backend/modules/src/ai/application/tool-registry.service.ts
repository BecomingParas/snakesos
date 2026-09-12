/**
 * Tool Registry Service
 * 
 * Central registry for all AI tools.
 * Manages tool discovery, validation, and execution.
 * 
 * Key Responsibilities:
 * - Register and manage tools
 * - Validate tool execution requests
 * - Enforce authorization
 * - Audit tool executions
 * - Handle confirmation workflows
 */

import {
  Tool,
  ToolDefinition,
  ToolContext,
  ToolExecutionRequest,
  ToolResult,
  ToolRegistry,
} from './types/tool.types';
import { prisma } from '@snake-rescue/database';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('ToolRegistry');

/**
 * Tool Registry Service
 */
export class ToolRegistryService implements ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  /**
   * Register a tool
   */
  register(tool: Tool): void {
    if (this.tools.has(tool.definition.name)) {
      throw new Error(`Tool already registered: ${tool.definition.name}`);
    }

    this.tools.set(tool.definition.name, tool);
    logger.info({
      name: tool.definition.name,
      category: tool.definition.category,
      readOnly: tool.definition.isReadOnly,
    }, 'Tool registered');
  }

  /**
   * Register multiple tools
   */
  registerAll(tools: Tool[]): void {
    for (const tool of tools) {
      this.register(tool);
    }
  }

  /**
   * Get a tool by name
   */
  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tools available to a user based on their role and permissions
   */
  getAvailableTools(context: ToolContext): ToolDefinition[] {
    const userRole = context.userRole || 'PUBLIC';
    const availableTools: ToolDefinition[] = [];

    for (const tool of this.tools.values()) {
      // Check if user's role can see this tool
      if (!tool.definition.visibleToRoles.includes(userRole)) {
        continue;
      }

      // Check if user has required permissions
      if (!tool.isAuthorized(context)) {
        continue;
      }

      availableTools.push(tool.definition);
    }

    return availableTools;
  }

  /**
   * Execute a tool
   */
  async executeTool(
    request: ToolExecutionRequest
  ): Promise<ToolResult> {
    const { toolName, arguments: args, context } = request;

    try {
      // Get tool
      const tool = this.getTool(toolName);
      if (!tool) {
        return {
          success: false,
          error: `Tool not found: ${toolName}`,
          errorCode: 'TOOL_NOT_FOUND',
        };
      }

      // Check if confirmation is required but not provided
      if (tool.definition.requiresConfirmation && !request.requireConfirmation) {
        return {
          success: false,
          error: 'This operation requires confirmation',
          errorCode: 'CONFIRMATION_REQUIRED',
          metadata: {
            requiresConfirmation: true,
            toolName,
            action: tool.definition.description,
          },
        };
      }

      // Execute tool
      const result = await tool.execute(args, context);

      // Audit tool execution
      await this.auditToolExecution(
        toolName,
        args,
        result,
        context
      );

      return result;
    } catch (error: any) {
      logger.error({
        tool: toolName,
        error: error.message,
      }, 'Tool execution error');

      return {
        success: false,
        error: error.message || 'Tool execution failed',
        errorCode: 'EXECUTION_ERROR',
      };
    }
  }

  /**
   * Audit tool execution to database
   */
  private async auditToolExecution(
    toolName: string,
    args: Record<string, any>,
    result: ToolResult,
    context: ToolContext
  ): Promise<void> {
    try {
      // Sanitize arguments and results (remove sensitive data)
      const sanitizedArgs = this.sanitizeData(args);
      const sanitizedResult = result.success
        ? this.sanitizeData(result.data)
        : { error: result.error };

      await prisma.aiAuditLog.create({
        data: {
          userId: context.userId,
          conversationId: context.conversationId,
          actionType: 'TOOL_EXECUTION',
          toolName,
          arguments: sanitizedArgs as any,
          result: sanitizedResult as any,
          success: result.success,
          error: result.error,
          errorCode: result.errorCode,
          executionTimeMs: result.metadata?.executionTimeMs,
          userRole: context.userRole,
          permissions: context.permissions,
          authorized: true, // Only authorized executions reach here
          ipAddress: context.ipAddress,
        },
      });
    } catch (error: any) {
      // Don't fail tool execution if audit fails
      logger.error({
        tool: toolName,
        error: error.message,
      }, 'Failed to audit tool execution');
    }
  }

  /**
   * Sanitize data for audit logging
   * Removes sensitive information
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    // Deep clone to avoid modifying original
    const sanitized = JSON.parse(JSON.stringify(data));

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'apiKey',
      'token',
      'secret',
      'privateKey',
      'accessToken',
      'refreshToken',
    ];

    const sanitizeObject = (obj: any): void => {
      if (typeof obj !== 'object' || obj === null) return;

      for (const key in obj) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    };

    sanitizeObject(sanitized);
    return sanitized;
  }

  /**
   * Get tool definitions in Gemini function calling format
   */
  getToolDefinitionsForGemini(context: ToolContext): any[] {
    const availableTools = this.getAvailableTools(context);

    return availableTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: this.convertParametersToSchema(tool.parameters),
        required: tool.parameters
          .filter((p) => p.required)
          .map((p) => p.name),
      },
    }));
  }

  /**
   * Convert tool parameters to JSON schema format
   */
  private convertParametersToSchema(
    parameters: any[]
  ): Record<string, any> {
    const schema: Record<string, any> = {};

    for (const param of parameters) {
      schema[param.name] = {
        type: param.type,
        description: param.description,
      };

      if (param.enum) {
        schema[param.name].enum = param.enum;
      }

      if (param.type === 'object' && param.properties) {
        schema[param.name].properties =
          this.convertParametersToSchema(Object.values(param.properties));
      }

      if (param.type === 'array' && param.items) {
        schema[param.name].items = {
          type: param.items.type,
          description: param.items.description,
        };
      }
    }

    return schema;
  }
}
