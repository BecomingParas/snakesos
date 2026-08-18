/**
 * Test Email Service with Brevo SMTP
 * Run: npx tsx test-email-brevo.ts
 */

import 'dotenv/config';
import { getEmailService, generateVerifyEmail } from './libs/shared/src/index.js';

async function testEmailService() {
  console.log('\n🧪 Testing Brevo Email Service...\n');
  
  // Log SMTP configuration (without showing password)
  console.log('📧 SMTP Configuration:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  Password:', process.env.SMTP_PASSWORD ? '****' + process.env.SMTP_PASSWORD.slice(-8) : 'NOT SET');
  console.log('  From Email:', process.env.SMTP_FROM_EMAIL);
  console.log('  From Name:', process.env.SMTP_FROM_NAME);
  console.log();

  // Get email service instance
  const emailService = getEmailService();

  // Test 1: Verify SMTP connection
  console.log('🔌 Step 1: Testing SMTP connection...');
  const isConnected = await emailService.verifyConnection();
  
  if (!isConnected) {
    console.error('❌ SMTP connection failed!');
    console.error('   Check your SMTP credentials in .env file');
    process.exit(1);
  }
  
  console.log('✅ SMTP connection successful!\n');

  // Test 2: Send test verification email
  console.log('📨 Step 2: Sending test verification email...');
  
  // CHANGE THIS TO YOUR EMAIL ADDRESS
  const testEmail = process.argv[2] || 'your-email@example.com';
  
  if (testEmail === 'your-email@example.com') {
    console.log('\n⚠️  Please provide your email address as an argument:');
    console.log('   npx tsx test-email-brevo.ts your-email@gmail.com\n');
    process.exit(1);
  }

  const verificationCode = '123456';
  const verificationToken = 'test-token-123456';
  const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}&code=${verificationCode}`;

  const emailHtml = generateVerifyEmail({
    userName: 'Test User',
    verificationUrl,
    verificationCode,
    expiresIn: '24 hours',
  });

  const success = await emailService.sendEmail({
    to: testEmail,
    subject: 'Test Email - SnakeSOS Verification',
    html: emailHtml,
    text: `Hi Test User, Your verification code is: ${verificationCode}. Visit: ${verificationUrl}`,
  });

  if (success) {
    console.log('✅ Test email sent successfully!');
    console.log(`📬 Check your inbox: ${testEmail}`);
    console.log('📋 Verification Code: 123456');
  } else {
    console.error('❌ Failed to send test email');
    console.error('   Check the logs above for details');
  }

  // Close email service
  await emailService.close();
  
  console.log('\n✨ Test complete!\n');
}

// Run the test
testEmailService().catch((error) => {
  console.error('\n❌ Test failed with error:');
  console.error(error);
  process.exit(1);
});
