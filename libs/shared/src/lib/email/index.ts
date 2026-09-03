/**
 * Email Module - Public API
 * Export all email service functionality
 */

export { EmailService, getEmailService } from './email.service';
export type { EmailOptions, EmailConfig } from './email.service';

export { generateBaseTemplate } from './templates/base-template';
export type { BaseTemplateProps } from './templates/base-template';

export {
  generateWelcomeEmail,
  generateVerifyEmail,
  generateVerificationSuccess,
  generatePasswordReset,
  generatePasswordChanged,
  generateSecurityAlert,
  generateRescuerApproved,
  generateRescuerRejected,
} from './templates/auth-templates';

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
} from './templates/auth-templates';
