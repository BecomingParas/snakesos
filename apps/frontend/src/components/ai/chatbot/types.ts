/**
 * AI Chatbot Types
 * Shared type definitions for the SnakeSOS AI Assistant
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export type ToolStatus = 'pending' | 'running' | 'success' | 'error';

export interface UserContext {
  id?: string;
  name?: string;
  role: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date | string;
  imageUrl?: string;
  toolsUsed?: string[];
  toolStatus?: ToolStatus;
  toolProgress?: string;
  blocks?: StructuredBlock[];
  error?: string;
}

export type AIBlockType =
  | 'text'
  | 'alert'
  | 'snake-card'
  | 'rescuer-card'
  | 'hospital-card'
  | 'rescue-request-card'
  | 'stats-card'
  | 'table'
  | 'chart'
  | 'map'
  | 'confirmation';

export interface StructuredBlock {
  type: 'snake-card' | 'rescuer-card' | 'alert' | 'action-buttons';
  data: any;
}

export interface BaseAIBlock {
  id: string;
  type: AIBlockType;
}

export interface TextBlock extends BaseAIBlock {
  type: 'text';
  content: string;
}

export interface AlertBlock extends BaseAIBlock {
  type: 'alert';
  variant: 'default' | 'warning' | 'danger' | 'info' | 'success';
  title?: string;
  content: string;
}

export interface SnakeCardBlock extends BaseAIBlock {
  type: 'snake-card';
  species: {
    id: string;
    name: string;
    scientificName?: string;
    venomous: boolean;
    dangerLevel?: string;
    imageUrl?: string;
  };
  confidence?: number;
  classification?: string;
  description?: string;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface RescuerCardBlock extends BaseAIBlock {
  type: 'rescuer-card';
  rescuer: {
    id: string;
    name: string;
    verified: boolean;
    distance?: number;
    available: boolean;
    rating?: number;
    completedRescues?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface HospitalCardBlock extends BaseAIBlock {
  type: 'hospital-card';
  hospital: {
    id: string;
    name: string;
    distance?: number;
    hasAntivenom: boolean;
    emergency: boolean;
    phone?: string;
    address?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface RescueRequestCardBlock extends BaseAIBlock {
  type: 'rescue-request-card';
  request: {
    id: string;
    status: string;
    urgency?: string;
    location?: string;
    description?: string;
    assignedRescuer?: {
      id: string;
      name: string;
    };
    timeline?: Array<{
      status: string;
      timestamp: string;
      completed: boolean;
    }>;
    createdAt: string;
  };
}

export interface StatsCardBlock extends BaseAIBlock {
  type: 'stats-card';
  title: string;
  stats: Array<{
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}

export interface TableBlock extends BaseAIBlock {
  type: 'table';
  title?: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}

export interface ChartBlock extends BaseAIBlock {
  type: 'chart';
  chartType: 'line' | 'bar' | 'pie' | 'area';
  title?: string;
  data: any; // Chart-specific data structure
}

export interface MapBlock extends BaseAIBlock {
  type: 'map';
  title?: string;
  markers: Array<{
    id: string;
    type: 'rescuer' | 'hospital' | 'request' | 'incident';
    position: {
      latitude: number;
      longitude: number;
    };
    label?: string;
    data?: any;
  }>;
  center?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
}

export interface ConfirmationBlock extends BaseAIBlock {
  type: 'confirmation';
  action: string;
  description: string;
  risks?: string[];
  reversible: boolean;
  data: Record<string, any>;
}

export type AIBlock =
  | TextBlock
  | AlertBlock
  | SnakeCardBlock
  | RescuerCardBlock
  | HospitalCardBlock
  | RescueRequestCardBlock
  | StatsCardBlock
  | TableBlock
  | ChartBlock
  | MapBlock
  | ConfirmationBlock;

export interface Suggestion {
  id: string;
  icon?: string;
  label: string;
  message: string;
}

export interface Conversation {
  id: string;
  title: string;
  context: 'public' | 'rescuer' | 'admin';
  lastMessage?: string;
  updatedAt: Date;
  messageCount: number;
}
