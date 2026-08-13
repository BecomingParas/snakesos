/**
 * Email Module - Public API
 * Export all email service functionality
 */

export { EmailService, getEmailService } from './email.service.js';
export type { EmailOptions, EmailConfig } from './email.service.js';

export { generateBaseTemplate } from './templates/base-template.js';
export type { BaseTemplateProps } from './templates/base-template.js';

export {
  generateWelcomeEmail,
  generateVerifyEmail,
  generateVerificationSuccess,
  generatePasswordReset,
  generatePasswordChanged,
  generateSecurityAlert,
  generateRescuerApproved,
  generateRescuerRejected,
} from './templates/auth-templates.js';

export type {
  WelcomeEmailProps,
  VerifyEmailProps,
  VerificationSuccessProps,
  PasswordResetProps,
  PasswordChangedProps,
  SecurityAlertProps,
  RoleAssignmentProps,
  RescuerApprovedProps,
  RescuerRejectedProps,
} from './templates/auth-templates.js';
