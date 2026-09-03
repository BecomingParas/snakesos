/**
 * Authentication Email Templates
 * Professional branded templates for all authentication workflows
 */

import { generateBaseTemplate } from './base-template';

export interface WelcomeEmailProps {
  userName: string;
  verificationUrl?: string;
}

export interface VerifyEmailProps {
  userName: string;
  verificationUrl: string;
  verificationCode?: string;
  expiresIn?: string;
}

export interface VerificationSuccessProps {
  userName: string;
  dashboardUrl: string;
}

export interface PasswordResetProps {
  userName: string;
  resetUrl: string;
  expiresIn?: string;
  ipAddress?: string;
}

export interface PasswordChangedProps {
  userName: string;
  changeDate: string;
  ipAddress?: string;
  undoUrl?: string;
}

export interface SecurityAlertProps {
  userName: string;
  alertType: string;
  alertDetails: string;
  actionRequired?: string;
  actionUrl?: string;
}

export interface RoleAssignmentProps {
  userName: string;
  newRole: string;
  permissions: string[];
  dashboardUrl: string;
}

export interface RescuerApprovedProps {
  userName: string;
  approvalDate: string;
  nextSteps: string[];
  dashboardUrl: string;
}

export interface RescuerRejectedProps {
  userName: string;
  rejectionReason: string;
  feedback?: string;
  reapplyUrl?: string;
}

/**
 * Welcome Email Template
 */
export function generateWelcomeEmail(props: WelcomeEmailProps): string {
  const { userName, verificationUrl } = props;

  const content = `
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827;">
      Welcome to SnakeSOS! 🎉
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Thank you for joining SnakeSOS - Nepal's premier snake rescue and conservation platform. 
      We're excited to have you as part of our community working to protect both humans and snakes across Nepal.
    </p>
    
    ${verificationUrl ? `
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      To get started, please verify your email address:
    </p>
    
    <table role="presentation" style="width: 100%; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${verificationUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>
    ` : ''}
    
    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #166534;">
        What you can do on SnakeSOS:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #166534;">
        <li style="margin-bottom: 8px;">Request emergency snake rescue services</li>
        <li style="margin-bottom: 8px;">Identify snakes using AI-powered recognition</li>
        <li style="margin-bottom: 8px;">Learn about snake species and safety</li>
        <li style="margin-bottom: 8px;">Access first-aid information for snake bites</li>
        <li style="margin-bottom: 8px;">Connect with verified rescuers</li>
      </ul>
    </div>
    
    <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
      Together, we're creating a safer Nepal for both people and snakes.
    </p>
  `;

  return generateBaseTemplate({
    title: 'Welcome to SnakeSOS',
    preheader: `Welcome aboard, ${userName}! Let's get started.`,
    content,
  });
}

/**
 * Email Verification Template
 */
export function generateVerifyEmail(props: VerifyEmailProps): string {
  const { userName, verificationUrl, verificationCode, expiresIn = '24 hours' } = props;

  const content = `
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827;">
      Verify Your Email Address
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Thanks for signing up! Please verify your email address to activate your SnakeSOS account and access all features.
    </p>
    
    ${verificationCode ? `
    <div style="background-color: #f0fdf4; border: 2px solid #16a34a; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #166534; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Your Verification Code
      </p>
      <div style="font-size: 36px; font-weight: 700; color: #16a34a; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0 0 12px 0;">
        ${verificationCode}
      </div>
      <p style="margin: 0; font-size: 13px; color: #166534;">
        Enter this code on the verification page
      </p>
    </div>
    ` : ''}
    
    <table role="presentation" style="width: 100%; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${verificationUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; text-align: center;">
      Or copy and paste this link in your browser:
    </p>
    
    <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 24px; word-break: break-all;">
      <a href="${verificationUrl}" style="font-size: 13px; color: #16a34a; text-decoration: none;">
        ${verificationUrl}
      </a>
    </div>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        <strong>⏱️ Important:</strong> This verification ${verificationCode ? 'code' : 'link'} expires in <strong>${expiresIn}</strong>. 
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
    
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #9ca3af; line-height: 1.6;">
      <strong>Security Tip:</strong> Never share this verification ${verificationCode ? 'code' : 'link'} with anyone. 
      SnakeSOS will never ask for your password via email.
    </p>
  `;

  return generateBaseTemplate({
    title: 'Verify Your Email Address',
    preheader: `Verify your email to activate your SnakeSOS account`,
    content,
  });
}

/**
 * Email Verification Success Template
 */
export function generateVerificationSuccess(props: VerificationSuccessProps): string {
  const { userName, dashboardUrl } = props;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: #d1fae5; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <span style="font-size: 40px;">✅</span>
      </div>
    </div>
    
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
      Email Verified Successfully!
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Great news! Your email address has been verified successfully. Your SnakeSOS account is now fully active.
    </p>
    
    <table role="presentation" style="width: 100%; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${dashboardUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Go to Dashboard
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6; text-align: center;">
      Ready to make a difference? Start exploring the platform now.
    </p>
  `;

  return generateBaseTemplate({
    title: 'Email Verified Successfully',
    preheader: 'Your email has been verified!',
    content,
  });
}

/**
 * Password Reset Template
 */
export function generatePasswordReset(props: PasswordResetProps): string {
  const { userName, resetUrl, expiresIn = '1 hour', ipAddress } = props;

  const content = `
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827;">
      Reset Your Password
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      We received a request to reset your password for your SnakeSOS account. 
      Click the button below to create a new password:
    </p>
    
    <table role="presentation" style="width: 100%; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${resetUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; text-align: center;">
      Or copy and paste this link in your browser:
    </p>
    
    <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 24px; word-break: break-all;">
      <a href="${resetUrl}" style="font-size: 13px; color: #16a34a; text-decoration: none;">
        ${resetUrl}
      </a>
    </div>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        <strong>⏱️ Important:</strong> This reset link expires in <strong>${expiresIn}</strong>.
      </p>
      ${ipAddress ? `
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #92400e;">
        Request made from IP: <code style="background-color: #ffffff; padding: 2px 6px; border-radius: 3px;">${ipAddress}</code>
      </p>
      ` : ''}
    </div>
    
    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #991b1b; line-height: 1.6;">
        <strong>⚠️ Didn't request this?</strong> If you didn't request a password reset, 
        please ignore this email and ensure your account is secure. 
        Consider changing your password if you suspect unauthorized access.
      </p>
    </div>
  `;

  return generateBaseTemplate({
    title: 'Reset Your Password',
    preheader: 'Reset your SnakeSOS password',
    content,
  });
}

/**
 * Password Changed Notification Template
 */
export function generatePasswordChanged(props: PasswordChangedProps): string {
  const { userName, changeDate, ipAddress, undoUrl } = props;

  const content = `
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827;">
      Password Changed Successfully
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      This is a confirmation that your SnakeSOS account password was changed successfully on <strong>${changeDate}</strong>.
    </p>
    
    ${ipAddress ? `
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; margin: 24px 0; border-radius: 6px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">
        Change Details:
      </h3>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        <strong>Date:</strong> ${changeDate}<br>
        <strong>IP Address:</strong> <code style="background-color: #ffffff; padding: 2px 6px; border-radius: 3px;">${ipAddress}</code>
      </p>
    </div>
    ` : ''}
    
    ${undoUrl ? `
    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #991b1b; line-height: 1.6;">
        <strong>⚠️ Wasn't you?</strong> If you didn't change your password, your account may be compromised. 
        Secure your account immediately:
      </p>
      <table role="presentation" style="width: 100%;" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="${undoUrl}" class="button" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              Secure My Account
            </a>
          </td>
        </tr>
      </table>
    </div>
    ` : `
    <div style="background-color: #d1fae5; border-left: 4px solid: #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #065f46; line-height: 1.6;">
        <strong>✅ All set!</strong> Your account is secure. No further action is needed.
      </p>
    </div>
    `}
    
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #9ca3af; line-height: 1.6;">
      <strong>Security Tip:</strong> Never share your password with anyone. 
      SnakeSOS will never ask for your password via email or phone.
    </p>
  `;

  return generateBaseTemplate({
    title: 'Password Changed',
    preheader: 'Your password was changed successfully',
    content,
  });
}

/**
 * Security Alert Template
 */
export function generateSecurityAlert(props: SecurityAlertProps): string {
  const { userName, alertType, alertDetails, actionRequired, actionUrl } = props;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: #fee2e2; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <span style="font-size: 40px;">🔒</span>
      </div>
    </div>
    
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
      Security Alert: ${alertType}
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      We detected unusual activity on your SnakeSOS account and wanted to alert you immediately.
    </p>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">
        Alert Details:
      </h3>
      <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        ${alertDetails}
      </p>
    </div>
    
    ${actionRequired ? `
    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #991b1b; line-height: 1.6;">
        <strong>⚠️ Action Required:</strong> ${actionRequired}
      </p>
      ${actionUrl ? `
      <table role="presentation" style="width: 100%;" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="${actionUrl}" class="button" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              Take Action Now
            </a>
          </td>
        </tr>
      </table>
      ` : ''}
    </div>
    ` : ''}
    
    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #166534;">
        Security Recommendations:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px;">
        <li style="margin-bottom: 8px;">Use a strong, unique password</li>
        <li style="margin-bottom: 8px;">Enable two-factor authentication</li>
        <li style="margin-bottom: 8px;">Review your recent account activity</li>
        <li style="margin-bottom: 8px;">Never share your password with anyone</li>
      </ul>
    </div>
  `;

  return generateBaseTemplate({
    title: `Security Alert: ${alertType}`,
    preheader: 'Important security notification for your account',
    content,
  });
}

/**
 * Rescuer Approved Template
 */
export function generateRescuerApproved(props: RescuerApprovedProps): string {
  const { userName, approvalDate, nextSteps, dashboardUrl } = props;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: #d1fae5; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <span style="font-size: 40px;">🎉</span>
      </div>
    </div>
    
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
      Congratulations! You're Now a Verified Rescuer
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Great news! Your application to become a Verified Rescuer has been approved on <strong>${approvalDate}</strong>. 
      You can now accept rescue assignments and help protect both people and snakes across Nepal.
    </p>
    
    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #166534;">
        Next Steps:
      </h3>
      <ol style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px;">
        ${nextSteps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
      </ol>
    </div>
    
    <table role="presentation" style="width: 100%; margin: 24px 0;" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${dashboardUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Go to Rescuer Dashboard
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6; text-align: center;">
      Thank you for your commitment to snake conservation and public safety!
    </p>
  `;

  return generateBaseTemplate({
    title: 'Rescuer Application Approved',
    preheader: 'Your rescuer application has been approved!',
    content,
  });
}

/**
 * Rescuer Rejected Template
 */
export function generateRescuerRejected(props: RescuerRejectedProps): string {
  const { userName, rejectionReason, feedback, reapplyUrl } = props;

  const content = `
    <h2 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #111827;">
      Rescuer Application Update
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong>${userName}</strong>,
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Thank you for your interest in becoming a Verified Rescuer on SnakeSOS. 
      After careful review, we're unable to approve your application at this time.
    </p>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">
        Reason:
      </h3>
      <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        ${rejectionReason}
      </p>
    </div>
    
    ${feedback ? `
    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #166534;">
        Feedback:
      </h3>
      <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.6;">
        ${feedback}
      </p>
    </div>
    ` : ''}
    
    ${reapplyUrl ? `
    <p style="margin: 24px 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      You're welcome to reapply after addressing the feedback above. We appreciate your commitment to snake conservation.
    </p>
    
    <table role="presentation" style="width: 100%; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${reapplyUrl}" class="button button-secondary" style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #16a34a; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; border: 2px solid #16a34a;">
            Reapply as Rescuer
          </a>
        </td>
      </tr>
    </table>
    ` : ''}
    
    <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
      In the meantime, you can continue using SnakeSOS as a volunteer to report rescues and contribute to conservation efforts.
    </p>
  `;

  return generateBaseTemplate({
    title: 'Rescuer Application Update',
    preheader: 'Update on your rescuer application',
    content,
  });
}
