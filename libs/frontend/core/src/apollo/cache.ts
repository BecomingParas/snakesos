/**
 * Apollo Cache Configuration
 * - InMemoryCache with field policies
 * - Relay-style pagination
 * - Type policies for normalization
 * - Custom merge functions
 */
import { InMemoryCache, TypePolicies } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

// Type policies for entity normalization and custom behaviors
const typePolicies: TypePolicies = {
  Query: {
    fields: {
      // Relay-style pagination for rescues
      rescues: relayStylePagination(),
      
      // Relay-style pagination for volunteers
      volunteers: relayStylePagination(),
      
      // Relay-style pagination for snakes
      snakes: relayStylePagination(),
      
      // Relay-style pagination for notifications
      notifications: relayStylePagination(),
      
      // Relay-style pagination for blog posts
      blogPosts: relayStylePagination(),
      
      // Relay-style pagination for gallery images
      galleryImages: relayStylePagination(),
      
      // Offset-based pagination for activity logs
      activityLogs: {
        keyArgs: ['filters'],
        merge(existing, incoming, { args }) {
          if (!existing) return incoming;
          if (!args?.offset || args.offset === 0) return incoming;
          
          return {
            ...incoming,
            nodes: [...(existing.nodes || []), ...(incoming.nodes || [])],
          };
        },
      },
      
      // Custom merge for dashboard stats (always replace)
      dashboardStats: {
        merge(_, incoming) {
          return incoming;
        },
      },
    },
  },
  
  // User entity
  User: {
    keyFields: ['id'],
    fields: {
      // Custom merge for user profile
      profile: {
        merge(existing, incoming) {
          return { ...existing, ...incoming };
        },
      },
    },
  },
  
  // Rescue entity
  RescueRequest: {
    keyFields: ['id'],
    fields: {
      // Timeline items sorted by timestamp
      timeline: {
        merge(existing = [], incoming, { readField }) {
          const merged = [...existing, ...incoming];
          const unique = Array.from(
            new Map(merged.map((item) => [readField('id', item), item])).values()
          );
          return unique.sort((a, b) => {
            const aTime = readField<string>('timestamp', a) || '';
            const bTime = readField<string>('timestamp', b) || '';
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });
        },
      },
    },
  },
  
  // Volunteer entity
  Volunteer: {
    keyFields: ['id'],
    fields: {
      location: {
        merge(existing, incoming) {
          return incoming; // Always use latest location
        },
      },
    },
  },
  
  // Snake species entity
  SnakeSpecies: {
    keyFields: ['id'],
  },
  
  // AI Identification entity
  AIIdentification: {
    keyFields: ['id'],
  },
  
  // Notification entity
  Notification: {
    keyFields: ['id'],
    fields: {
      read: {
        read(existing = false) {
          return existing;
        },
      },
    },
  },
  
  // Blog post entity
  BlogPost: {
    keyFields: ['id'],
  },
  
  // Gallery image entity
  GalleryImage: {
    keyFields: ['id'],
  },
  
  // Donation entity
  Donation: {
    keyFields: ['id'],
  },
  
  // Training entity
  Training: {
    keyFields: ['id'],
  },
  
  // Contact message entity
  ContactMessage: {
    keyFields: ['id'],
  },
  
  // Activity log entity
  ActivityLog: {
    keyFields: ['id'],
  },
};

// Create and configure Apollo InMemoryCache
export const createCache = () => {
  return new InMemoryCache({
    typePolicies,
    possibleTypes: {
      // Add possible types for interfaces/unions from fragment matcher
      // This will be populated by GraphQL Code Generator
    },
  });
};

// Export cache instance
export const cache = createCache();

// Utility functions for cache manipulation
export const cacheUtils = {
  /**
   * Clear entire cache
   */
  clearAll: () => {
    cache.reset();
  },
  
  /**
   * Evict specific entity from cache
   */
  evict: (id: string, fieldName?: string) => {
    cache.evict({ id, fieldName });
    cache.gc(); // Garbage collect
  },
  
  /**
   * Modify cache data
   */
  modify: (options: any) => {
    cache.modify(options);
  },
  
  /**
   * Read from cache
   */
  readQuery: <T = any>(options: { query: any; variables?: any }): T | null => {
    return cache.readQuery(options);
  },
  
  /**
   * Write to cache
   */
  writeQuery: <T = any>(options: { query: any; variables?: any; data: T }) => {
    cache.writeQuery(options);
  },
  
  /**
   * Read fragment from cache
   */
  readFragment: <T = any>(options: {
    id: string;
    fragment: any;
    fragmentName?: string;
  }): T | null => {
    return cache.readFragment(options);
  },
  
  /**
   * Write fragment to cache
   */
  writeFragment: <T = any>(options: {
    id: string;
    fragment: any;
    fragmentName?: string;
    data: T;
  }) => {
    cache.writeFragment(options);
  },
};
