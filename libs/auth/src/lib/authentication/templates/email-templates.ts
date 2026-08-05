export class EmailTemplate {
  private readonly baseStyles = `
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .container {
        background: #f9fafb;
        border-radius: 8px;
        padding: 30px;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #10b981;
      }
      .content {
        background: white;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      h1 {
        color: #1f2937;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        background: #10b981;
        color: white !important;
        text-decoration: none;
        padding: 12px 30px;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: 600;
      }
      .button:hover {
        background: #059669;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #6b7280;
        font-size: 14px;
      }
      .warning {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .info {
        background: #dbeafe;
        border-left: 4px solid #3b82f6;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
      }
    </style>
  `;

  /**
   * Welcome email for new users
   */
  welcomeEmail(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>${this.baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐍 Snake Rescue Platform</div>
            </div>
            <div class="content">
              <h1>Welcome, ${name}! 🎉</h1>
              <p>Thank you for joining the Snake Rescue Platform. We're excited to have you as part of our community dedicated to snake conservation and rescue operations.</p>
              
              <div class="info">
                <strong>What's Next?</strong>
                <ul>
                  <li>Verify your email address</li>
                  <li>Complete your profile</li>
                  <li>Explore our snake species database</li>
                  <li>Report rescue requests in your area</li>
                </ul>
              </div>

              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Best regards,<br/>
              Snake Rescue Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Snake Rescue Platform. All rights reserved.</p>
              <p>Butwal, Nepal</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Email verification template
   */
  emailVerification(verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>${this.baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐍 Snake Rescue Platform</div>
            </div>
            <div class="content">
              <h1>Verify Your Email Address</h1>
              <p>Thank you for registering with Snake Rescue Platform. Please verify your email address to activate your account.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice</strong><br/>
                This link will expire in 24 hours. If you didn't create this account, please ignore this email.
              </div>

              <p>Or copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Snake Rescue Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Password reset template
   */
  passwordReset(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>${this.baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐍 Snake Rescue Platform</div>
            </div>
            <div class="content">
              <h1>Reset Your Password</h1>
              <p>Hi ${name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice</strong><br/>
                This link will expire in 24 hours. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </div>

              <p>Or copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Snake Rescue Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Password changed confirmation
   */
  passwordChanged(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>${this.baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐍 Snake Rescue Platform</div>
            </div>
            <div class="content">
              <h1>Password Changed Successfully</h1>
              <p>Hi ${name},</p>
              <p>This is a confirmation that your password was recently changed.</p>
              
              <div class="info">
                <strong>✅ Your account is secure</strong><br/>
                If you made this change, no further action is required.
              </div>

              <div class="warning">
                <strong>⚠️ Didn't change your password?</strong><br/>
                If you did not make this change, please contact our support team immediately at support@snakerescue.com
              </div>

              <p>Best regards,<br/>
              Snake Rescue Security Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Snake Rescue Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Role assigned notification
   */
  roleAssigned(name: string, role: string): string {
    const roleDescriptions: Record<string, string> = {
      SUPER_ADMIN: 'full system access and administrative privileges',
      ADMIN: 'platform management and user administration',
      DISTRICT_COORDINATOR: 'regional coordination and rescue assignment',
      VERIFIED_RESCUER: 'verified rescue operations and volunteer management',
      VOLUNTEER: 'rescue operations and community support',
      CONTENT_EDITOR: 'content management and publishing',
      RESEARCHER: 'data access and analytics',
      CITIZEN: 'basic platform access and rescue reporting',
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>${this.baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐍 Snake Rescue Platform</div>
            </div>
            <div class="content">
              <h1>Role Updated</h1>
              <p>Hi ${name},</p>
              <p>Your role on the Snake Rescue Platform has been updated.</p>
              
              <div class="info">
                <strong>New Role: ${role}</strong><br/>
                You now have ${roleDescriptions[role] || 'updated permissions'}.
              </div>

              <p>Log in to your account to explore your new capabilities.</p>

              <p>Best regards,<br/>
              Snake Rescue Admin Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Snake Rescue Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Account suspended notification
   */
  accountSuspended(name: string, reason: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>${this.baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐍 Snake Rescue Platform</div>
            </div>
            <div class="content">
              <h1>Account Suspended</h1>
              <p>Hi ${name},</p>
              <p>Your account on the Snake Rescue Platform has been suspended.</p>
              
              <div class="warning">
                <strong>Reason:</strong><br/>
                ${reason}
              </div>

              <p>If you believe this is a mistake or would like to appeal this decision, please contact our support team at support@snakerescue.com</p>

              <p>Best regards,<br/>
              Snake Rescue Moderation Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Snake Rescue Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
