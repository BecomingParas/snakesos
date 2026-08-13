/**
 * Email Service using Brevo (Sendinblue) SMTP
 * Handles all email sending operations with retry logic
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { createLogger } from '../logger/logger.js';

const logger = createLogger('EmailService');

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
  }>;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    email: string;
    name: string;
  };
}

/**
 * Email Service
 * Singleton service for sending emails via Brevo SMTP
 */
export class EmailService {
  private static instance: EmailService;
  private transporter: Transporter | null = null;
  private config: EmailConfig;
  private isConfigured = false;

  private constructor() {
    this.config = this.loadConfig();
    this.initializeTransporter();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Load email configuration from environment
   */
  private loadConfig(): EmailConfig {
    return {
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
      from: {
        email: process.env.SMTP_FROM_EMAIL || 'noreply@snakesos.org',
        name: process.env.SMTP_FROM_NAME || 'SnakeSOS Platform',
      },
    };
  }

  /**
   * Initialize Nodemailer transporter
   */
  private initializeTransporter(): void {
    try {
      if (!this.config.auth.user || !this.config.auth.pass) {
        logger.warn('SMTP credentials not configured. Email sending will be disabled.');
        this.isConfigured = false;
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.auth.user,
          pass: this.config.auth.pass,
        },
        pool: true, // Use pooled connections
        maxConnections: 5,
        maxMessages: 10,
        rateDelta: 1000, // 1 second between messages
        rateLimit: 5, // Max 5 messages per rateDelta
      });

      this.isConfigured = true;
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize email service');
      this.isConfigured = false;
    }
  }

  /**
   * Verify SMTP connection
   */
  public async verifyConnection(): Promise<boolean> {
    if (!this.transporter || !this.isConfigured) {
      logger.warn('Email service not configured');
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('SMTP connection verified successfully');
      return true;
    } catch (error) {
      logger.error({ error }, 'SMTP connection verification failed');
      return false;
    }
  }

  /**
   * Send email with retry logic
   */
  public async sendEmail(options: EmailOptions, retries = 3): Promise<boolean> {
    if (!this.transporter || !this.isConfigured) {
      logger.warn({ to: options.to, subject: options.subject }, 'Email service not configured. Logging email instead');
      
      // In development, log the email instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📧 EMAIL (NOT SENT - Development Mode)');
        console.log('━'.repeat(60));
        console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log('━'.repeat(60));
        console.log(options.text || 'No plain text version');
        console.log('━'.repeat(60));
        console.log('HTML version available but not displayed');
        console.log('━'.repeat(60) + '\n');
      }
      
      return false;
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const mailOptions = {
          from: options.from || `"${this.config.from.name}" <${this.config.from.email}>`,
          to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
          subject: options.subject,
          text: options.text,
          html: options.html,
          replyTo: options.replyTo,
          attachments: options.attachments,
        };

        const info = await this.transporter.sendMail(mailOptions);

        logger.info({
          messageId: info.messageId,
          to: options.to,
          subject: options.subject,
          attempt,
        }, 'Email sent successfully');

        return true;
      } catch (error) {
        lastError = error as Error;
        logger.warn({
          error: error instanceof Error ? error.message : error,
          to: options.to,
          subject: options.subject,
        }, `Email send attempt ${attempt} failed`);

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    logger.error({
      error: lastError?.message,
      to: options.to,
      subject: options.subject,
      retries,
    }, 'Email send failed after all retries');

    return false;
  }

  /**
   * Send bulk emails (with rate limiting)
   */
  public async sendBulkEmails(emails: EmailOptions[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      const success = await this.sendEmail(email);
      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Rate limiting: wait 200ms between emails
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    logger.info({ sent, failed, total: emails.length }, 'Bulk email send completed');

    return { sent, failed };
  }

  /**
   * Close transporter
   */
  public async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      logger.info('Email service closed');
    }
  }
}

/**
 * Get email service instance
 */
export const getEmailService = (): EmailService => {
  return EmailService.getInstance();
};
