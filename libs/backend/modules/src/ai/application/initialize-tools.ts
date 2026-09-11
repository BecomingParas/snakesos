/**
 * Initialize AI Tools
 * 
 * Sets up the tool registry with all available tools.
 * Called during application startup.
 */

import { ToolRegistryService } from './tool-registry.service';
import { SearchKnowledgeTool } from './tools/knowledge/search-knowledge.tool';
import { FindNearestRescuerTool } from './tools/rescue/find-nearest-rescuer.tool';
import { FindNearbyHospitalsTool } from './tools/hospital/find-nearby-hospitals.tool';
import { CreateRescueRequestTool } from './tools/rescue/create-rescue-request.tool';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('InitializeTools');

/**
 * Initialize and register all AI tools
 * 
 * @returns Initialized tool registry
 */
export function initializeTools(): ToolRegistryService {
  const registry = new ToolRegistryService();

  try {
    // Knowledge Tools
    registry.register(new SearchKnowledgeTool());

    // Rescue Tools
    registry.register(new FindNearestRescuerTool());
    registry.register(new CreateRescueRequestTool());

    // Hospital Tools
    registry.register(new FindNearbyHospitalsTool());

    logger.info('All AI tools registered successfully', {
      totalTools: registry.getAllTools().length,
    });

    return registry;
  } catch (error: any) {
    logger.error('Failed to initialize tools', { error: error.message });
    throw error;
  }
}

/**
 * Get singleton tool registry instance
 */
let toolRegistryInstance: ToolRegistryService | null = null;

export function getToolRegistry(): ToolRegistryService {
  if (!toolRegistryInstance) {
    toolRegistryInstance = initializeTools();
  }
  return toolRegistryInstance;
}
