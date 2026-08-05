import { GraphQLError } from 'graphql';
import { requireAuth, GraphQLContext } from './authenticated.guard.js';
import { UserRole } from '../roles/index.js';

export function requireRole(
  context: GraphQLContext,
  allowedRoles: UserRole[]
) {
  const user = requireAuth(context);
  
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { 
        code: 'FORBIDDEN',
        requiredRoles: allowedRoles,
        userRole: user.role 
      },
    });
  }
  
  return user;
}
