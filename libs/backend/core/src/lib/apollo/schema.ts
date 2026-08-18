/**
 * GraphQL Schema Builder
 * Merges all feature module schemas into a single executable schema
 */

import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

// Import GraphQL contracts
import { graphqlSchema } from '@snake-rescue/contracts';

// Base resolvers (will be extended by app)
const baseResolvers = {
  Query: {
    _empty: () => 'Empty query placeholder',
  },
  Mutation: {
    _empty: () => 'Empty mutation placeholder',
  },
  Subscription: {
    _empty: () => 'Empty subscription placeholder',
  },
};

/**
 * Create the executable GraphQL schema
 * @param additionalResolvers - Resolvers from feature modules (provided by app)
 */
export function createGraphQLSchema(additionalResolvers: any[] = []) {
  // Use the schema from contracts library
  const typeDefs = graphqlSchema;

  // Merge all resolvers
  const mergedResolvers = mergeResolvers([
    baseResolvers,
    ...additionalResolvers,
  ]);

  // Create executable schema
  return makeExecutableSchema({
    typeDefs,
    resolvers: mergedResolvers,
    // Some hospital resolvers are transitional while their names migrate to the
    // shared contract. Do not fail server startup for those extra resolvers.
    resolverValidationOptions: {
      requireResolversToMatchSchema: 'ignore',
    },
  });
}
