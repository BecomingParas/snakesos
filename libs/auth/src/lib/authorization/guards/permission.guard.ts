import { GraphQLError } from 'graphql';
import { requireAuth, GraphQLContext } from './authenticated.guard';
import { Permission } from '../roles/index';

export async function requirePermission(
  context: GraphQLContext,
  permission: Permission
) {
  const user = requireAuth(context);
  
  // Check if user has permission through their roles
  const hasPermission = await context.prisma.userRoleAssignment.findFirst({
    where: {
      userId: user.id,
      role: {
        permissions: {
          some: {
            permission: {
              name: permission,
            },
          },
        },
      },
    },
  });
  
  if (!hasPermission) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { 
        code: 'FORBIDDEN', 
        permission,
        userId: user.id 
      },
    });
  }
  
  return user;
}
