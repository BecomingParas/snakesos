import { GraphQLError } from 'graphql';
import { requireAuth, GraphQLContext } from './authenticated.guard.js';
import { UserRole } from '../roles/index.js';

export function requireOwnerOrRole(
  context: GraphQLContext,
  resourceOwnerId: string,
  allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN]
) {
  const user = requireAuth(context);
  
  // Check if user is the owner
  const isOwner = user.id === resourceOwnerId;
  
  // Check if user has elevated role
  const hasElevatedRole = allowedRoles.includes(user.role as UserRole);
  
  if (!isOwner && !hasElevatedRole) {
    throw new GraphQLError('Access denied. You can only access your own resources.', {
      extensions: { 
        code: 'FORBIDDEN',
        reason: 'OWNERSHIP_OR_ROLE_REQUIRED'
      },
    });
  }
  
  return user;
}
