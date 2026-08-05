import { EmailTemplate } from '../templates/email-templates.js';

export class EmailService {
  private templates = new EmailTemplate();

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(email: string, name: string) {
    const subject = 'Welcome to Snake Rescue Platform';
    const html = this.templates.welcomeEmail(name);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    const subject = 'Verify Your Email - Snake Rescue Platform';
    const html = this.templates.emailVerification(verificationUrl);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    const subject = 'Reset Your Password - Snake Rescue Platform';
    const html = this.templates.passwordReset(name, resetUrl);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send password changed confirmation
   */
  async sendPasswordChangedEmail(email: string, name: string) {
    const subject = 'Password Changed - Snake Rescue Platform';
    const html = this.templates.passwordChanged(name);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send role assignment notification
   */
  async sendRoleAssignedEmail(email: string, name: string, role: string) {
    const subject = 'Role Updated - Snake Rescue Platform';
    const html = this.templates.roleAssigned(name, role);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send account suspension notification
   */
  async sendAccountSuspendedEmail(email: string, name: string, reason: string) {
    const subject = 'Account Suspended - Snake Rescue Platform';
    const html = this.templates.accountSuspended(name, reason);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Core email sending method
   * TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
   */
  private async sendEmail(to: string, subject: string, html: string) {
    // For development: Log emails
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Preview URL: http://localhost:3000/email-preview');
      return { success: true, mode: 'development' };
    }

    // TODO: Implement actual email sending
    // Example with nodemailer:
    /*
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    */

    return { success: true, to, subject };
  }
}
