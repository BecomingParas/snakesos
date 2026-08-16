/**
 * Apollo Client Hooks Re-export
 * Workaround for Turbopack module resolution issues
 */

'use client';

export { useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client/react';
export type { QueryHookOptions, MutationHookOptions, SubscriptionHookOptions, LazyQueryHookOptions } from '@apollo/client/react';
