/**
 * AI Tool System Types
 * 
 * Defines the core types for the AI function calling system.
 * Tools are functions that the AI agent can execute to interact with the application.
 */

import { z } from 'zod';

/**
 * Tool execution context
 * Provides information about the user and their permissions
 */
export interface ToolContext {
  userId?: string;
  userRole?: string;
  permissions: string[];
  sessionId?: string;
  ipAddress?: string;
  conversationId?: string;
}

/**
 * Tool execution result
 */
export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  metadata?: Record<string, any>;
}

/**
 * Tool parameter definition
 */
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  enum?: string[];
  properties?: Record<string, ToolParameter>; // For object types
  items?: ToolParameter; // For array types
}

/**
 * Tool definition
 */
export interface ToolDefinition {
  name: string;
  description: string;
  category: 'knowledge' | 'rescue' | 'hospital' | 'snake' | 'admin' | 'action';
  parameters: ToolParameter[];
  requiredPermissions: string[];
  requiresConfirmation: boolean;
  isReadOnly: boolean;
  visibleToRoles: string[]; // PUBLIC, CITIZEN, RESCUER, ADMIN, SUPER_ADMIN
  exampleUsage?: string;
  schema?: z.ZodSchema; // Zod schema for validation
}

/**
 * Tool execution request
 */
export interface ToolExecutionRequest {
  toolName: string;
  arguments: Record<string, any>;
  context: ToolContext;
  requireConfirmation?: boolean;
}

/**
 * Base tool interface
 * All tools must implement this interface
 */
export interface Tool<TInput = any, TOutput = any> {
  /**
   * Tool definition (metadata)
   */
  readonly definition: ToolDefinition;

  /**
   * Execute the tool with given inputs
   * 
   * @param input - Tool input arguments
   * @param context - Execution context
   * @returns Tool execution result
   */
  execute(input: TInput, context: ToolContext): Promise<ToolResult<TOutput>>;

  /**
   * Validate input arguments
   * 
   * @param input - Input to validate
   * @returns Validation result
   */
  validateInput(input: any): { valid: boolean; errors?: string[] };

  /**
   * Check if user has permission to execute this tool
   * 
   * @param context - Execution context
   * @returns True if authorized
   */
  isAuthorized(context: ToolContext): boolean;
}

/**
 * Tool registry interface
 */
export interface ToolRegistry {
  /**
   * Register a tool
   */
  register(tool: Tool): void;

  /**
   * Get a tool by name
   */
  getTool(name: string): Tool | undefined;

  /**
   * Get all tools available to a user
   */
  getAvailableTools(context: ToolContext): ToolDefinition[];

  /**
   * Execute a tool
   */
  executeTool(request: ToolExecutionRequest): Promise<ToolResult>;
}

/**
 * Confirmation request for write operations
 */
export interface ConfirmationRequest {
  toolName: string;
  action: string;
  description: string;
  arguments: Record<string, any>;
  risks: string[];
  reversible: boolean;
}

/**
 * Confirmation response
 */
export interface ConfirmationResponse {
  confirmed: boolean;
  reason?: string;
}
