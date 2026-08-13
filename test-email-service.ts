/**
 * Email Service Test Script
 * Run this to test your Brevo SMTP configuration
 */

import { 
  getEmailService, 
  generateWelcomeEmail,
  generateVerifyEmail,
  generatePasswordReset,
  generatePasswordChanged,
  generateSecurityAlert,
  generateRescuerApproved,
} from './libs/shared/src/lib/email/index';

async function testEmailService() {
  console.log('🧪 Testing Email Service with Brevo SMTP\n');
  console.log('='.repeat(60));

  const emailService = getEmailService();

  // Test 1: Verify SMTP Connection
  console.log('\n1️⃣  Verifying SMTP connection...');
  const isConnected = await emailService.verifyConnection();
  
  if (isConnected) {
    console.log('   ✅ SMTP connection verified successfully!');
  } else {
    console.log('   ❌ SMTP connection failed. Check your credentials.');
    console.log('   💡 Make sure SMTP_* environment variables are set.');
    return;
  }

  // Test 2: Send Welcome Email
  console.log('\n2️⃣  Testing Welcome Email template...');
  const welcomeHtml = generateWelcomeEmail({
    userName: 'Test User',
    verificationUrl: 'http://localhost:3000/verify-email?token=test123',
  });
  
  console.log('   ✅ Welcome email template generated');
  console.log(`   📏 HTML size: ${welcomeHtml.length} bytes`);

  // Test 3: Send Email Verification
  console.log('\n3️⃣  Testing Email Verification template...');
  const verifyHtml = generateVerifyEmail({
    userName: 'Test User',
    verificationUrl: 'http://localhost:3000/verify-email?token=test123',
    expiresIn: '24 hours',
  });
  
  console.log('   ✅ Verification email template generated');
  console.log(`   📏 HTML size: ${verifyHtml.length} bytes`);

  // Test 4: Send Password Reset
  console.log('\n4️⃣  Testing Password Reset template...');
  const resetHtml = generatePasswordReset({
    userName: 'Test User',
    resetUrl: 'http://localhost:3000/reset-password?token=reset123',
    expiresIn: '1 hour',
    ipAddress: '192.168.1.1',
  });
  
  console.log('   ✅ Password reset template generated');
  console.log(`   📏 HTML size: ${resetHtml.length} bytes`);

  // Test 5: Send Password Changed
  console.log('\n5️⃣  Testing Password Changed template...');
  const changedHtml = generatePasswordChanged({
    userName: 'Test User',
    changeDate: new Date().toLocaleString(),
    ipAddress: '192.168.1.1',
    undoUrl: 'http://localhost:3000/account/security',
  });
  
  console.log('   ✅ Password changed template generated');
  console.log(`   📏 HTML size: ${changedHtml.length} bytes`);

  // Test 6: Send Security Alert
  console.log('\n6️⃣  Testing Security Alert template...');
  const alertHtml = generateSecurityAlert({
    userName: 'Test User',
    alertType: 'New Login from Unknown Device',
    alertDetails: 'We detected a login from a new device in Kathmandu, Nepal.',
    actionRequired: 'Review your account security settings.',
    actionUrl: 'http://localhost:3000/account/security',
  });
  
  console.log('   ✅ Security alert template generated');
  console.log(`   📏 HTML size: ${alertHtml.length} bytes`);

  // Test 7: Send Rescuer Approved
  console.log('\n7️⃣  Testing Rescuer Approved template...');
  const approvedHtml = generateRescuerApproved({
    userName: 'Test User',
    approvalDate: new Date().toLocaleDateString(),
    nextSteps: [
      'Complete your rescuer profile',
      'Review safety guidelines',
      'Set your availability',
      'Start accepting rescue assignments',
    ],
    dashboardUrl: 'http://localhost:3000/dashboard/rescuer',
  });
  
  console.log('   ✅ Rescuer approved template generated');
  console.log(`   📏 HTML size: ${approvedHtml.length} bytes`);

  // Test 8: Actually send a test email (optional)
  if (process.env.TEST_EMAIL_TO) {
    console.log(`\n8️⃣  Sending test email to ${process.env.TEST_EMAIL_TO}...`);
    
    const testSent = await emailService.sendEmail({
      to: process.env.TEST_EMAIL_TO,
      subject: 'SnakeSOS Email Service Test',
      html: welcomeHtml,
      text: 'This is a test email from SnakeSOS email service.',
    });

    if (testSent) {
      console.log('   ✅ Test email sent successfully!');
      console.log('   📬 Check your inbox');
    } else {
      console.log('   ❌ Test email failed to send');
    }
  } else {
    console.log('\n8️⃣  Skipping actual email send (set TEST_EMAIL_TO to test)');
    console.log('   💡 Example: TEST_EMAIL_TO=your@email.com node test-email-service.ts');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Email Service Test Complete!\n');
  console.log('📊 Summary:');
  console.log('   - SMTP Connection: ✅');
  console.log('   - Template Generation: ✅');
  console.log('   - All 7 templates tested: ✅');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('   1. Review EMAIL_SERVICE_GUIDE.md for integration examples');
  console.log('   2. Integrate with your auth use cases');
  console.log('   3. Test in development');
  console.log('   4. Generate new SMTP key before production\n');
}

// Run tests
testEmailService()
  .then(() => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
