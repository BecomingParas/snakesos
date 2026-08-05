// ===================================================================
// ROLE & PERMISSION SYSTEM
// ===================================================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DISTRICT_COORDINATOR = 'DISTRICT_COORDINATOR',
  VERIFIED_RESCUER = 'VERIFIED_RESCUER',
  VOLUNTEER = 'VOLUNTEER',
  RESEARCHER = 'RESEARCHER',
  CONTENT_EDITOR = 'CONTENT_EDITOR',
  CITIZEN = 'CITIZEN',
}

export enum Permission {
  // Users
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',
  
  // Rescues
  MANAGE_RESCUES = 'MANAGE_RESCUES',
  ASSIGN_RESCUES = 'ASSIGN_RESCUES',
  VIEW_RESCUES = 'VIEW_RESCUES',
  CREATE_RESCUE = 'CREATE_RESCUE',
  
  // Volunteers
  MANAGE_VOLUNTEERS = 'MANAGE_VOLUNTEERS',
  APPROVE_VOLUNTEERS = 'APPROVE_VOLUNTEERS',
  VIEW_VOLUNTEERS = 'VIEW_VOLUNTEERS',
  
  // Content
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  PUBLISH_CONTENT = 'PUBLISH_CONTENT',
  UPLOAD_MEDIA = 'UPLOAD_MEDIA',
  
  // Analytics
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_DATA = 'EXPORT_DATA',
  
  // Payments
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',
  VIEW_DONATIONS = 'VIEW_DONATIONS',
  
  // System
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  VIEW_LOGS = 'VIEW_LOGS',
}

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  
  [UserRole.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_RESCUES,
    Permission.ASSIGN_RESCUES,
    Permission.VIEW_RESCUES,
    Permission.MANAGE_VOLUNTEERS,
    Permission.APPROVE_VOLUNTEERS,
    Permission.VIEW_VOLUNTEERS,
    Permission.MANAGE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.UPLOAD_MEDIA,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_PAYMENTS,
    Permission.VIEW_DONATIONS,
  ],
  
  [UserRole.DISTRICT_COORDINATOR]: [
    Permission.VIEW_USERS,
    Permission.MANAGE_RESCUES,
    Permission.ASSIGN_RESCUES,
    Permission.VIEW_RESCUES,
    Permission.APPROVE_VOLUNTEERS,
    Permission.VIEW_VOLUNTEERS,
    Permission.VIEW_ANALYTICS,
  ],
  
  [UserRole.VERIFIED_RESCUER]: [
    Permission.VIEW_RESCUES,
    Permission.CREATE_RESCUE,
    Permission.VIEW_VOLUNTEERS,
  ],
  
  [UserRole.VOLUNTEER]: [
    Permission.VIEW_RESCUES,
    Permission.CREATE_RESCUE,
  ],
  
  [UserRole.CONTENT_EDITOR]: [
    Permission.MANAGE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.UPLOAD_MEDIA,
  ],
  
  [UserRole.RESEARCHER]: [
    Permission.VIEW_RESCUES,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
  ],
  
  [UserRole.CITIZEN]: [
    Permission.CREATE_RESCUE,
  ],
};
