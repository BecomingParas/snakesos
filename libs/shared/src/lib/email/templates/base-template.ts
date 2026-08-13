/**
 * Base Email Template
 * Professional responsive HTML email template with SnakeSOS branding
 */

export interface BaseTemplateProps {
  title: string;
  preheader?: string;
  content: string;
  footerContent?: string;
  year?: number;
}

/**
 * Generate base HTML email template
 * Industry-standard responsive design compatible with all email clients
 */
export function generateBaseTemplate(props: BaseTemplateProps): string {
  const { title, preheader, content, footerContent, year = new Date().getFullYear() } = props;

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    
    img {
      border: 0;
      display: block;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    
    a {
      color: #16a34a;
      text-decoration: none;
    }
    
    a:hover {
      color: #15803d;
      text-decoration: underline;
    }
    
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #16a34a;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      mso-padding-alt: 0;
    }
    
    .button:hover {
      background-color: #15803d;
      text-decoration: none;
    }
    
    .button-secondary {
      background-color: #ffffff;
      color: #16a34a !important;
      border: 2px solid #16a34a;
    }
    
    .button-secondary:hover {
      background-color: #f0fdf4;
      color: #15803d !important;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 0 10px !important;
      }
      
      .content {
        padding: 24px 20px !important;
      }
      
      .button {
        display: block !important;
        width: 100% !important;
        padding: 14px 20px !important;
      }
      
      h1 {
        font-size: 24px !important;
      }
      
      h2 {
        font-size: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  ${preheader ? `
  <!-- Preheader text (hidden in email client but shows in preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; visibility: hidden; mso-hide: all;">
    ${preheader}
  </div>
  ` : ''}
  
  <!-- Email Container -->
  <table role="presentation" style="width: 100%; background-color: #f5f5f5; margin: 0; padding: 0;" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <!-- Main Content Card -->
        <table role="presentation" class="container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <table role="presentation" style="width: 100%;" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Logo -->
                    <div style="background-color: #ffffff; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                      <span style="font-size: 40px; line-height: 1;">🐍</span>
                    </div>
                    
                    <!-- Platform Name -->
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                      SnakeSOS
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">
                      Nepal Snake Rescue Platform
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              ${footerContent || `
              <table role="presentation" style="width: 100%;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">
                      <strong>Need help?</strong> Contact us at 
                      <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@snakesos.org'}" style="color: #16a34a; text-decoration: none;">
                        ${process.env.SUPPORT_EMAIL || 'support@snakesos.org'}
                      </a>
                    </p>
                    
                    <div style="margin: 20px 0; height: 1px; background-color: #e5e7eb;"></div>
                    
                    <p style="margin: 16px 0 8px 0; font-size: 12px; color: #9ca3af;">
                      © ${year} SnakeSOS Platform. All rights reserved.
                    </p>
                    
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
                      This is an automated email. Please do not reply directly.
                    </p>
                    
                    <p style="margin: 12px 0 0 0; font-size: 12px;">
                      <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="color: #16a34a; margin: 0 8px;">Visit Website</a>
                      <span style="color: #d1d5db;">•</span>
                      <a href="${process.env.APP_URL || 'http://localhost:3000'}/about" style="color: #16a34a; margin: 0 8px;">About Us</a>
                      <span style="color: #d1d5db;">•</span>
                      <a href="${process.env.APP_URL || 'http://localhost:3000'}/privacy" style="color: #16a34a; margin: 0 8px;">Privacy</a>
                    </p>
                  </td>
                </tr>
              </table>
              `}
            </td>
          </tr>
          
        </table>
        <!-- End Main Content Card -->
        
      </td>
    </tr>
  </table>
  <!-- End Email Container -->
  
</body>
</html>
  `.trim();
}
