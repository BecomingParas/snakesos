/**
 * Signup Schema Test - Run this in the browser console to verify Zod validation
 */

import { signupSchema } from './signup.schema';

export function testSignupSchema() {
  console.group('🧪 [ZOD] Testing Signup Schema');
  
  // Test 1: Empty form
  console.log('\n--- Test 1: Empty Form ---');
  const emptyResult = signupSchema.safeParse({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  if (!emptyResult.success) {
    console.log('❌ Validation failed (expected)');
    console.table(emptyResult.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })));
  } else {
    console.log('✅ Validation passed (unexpected!)');
  }
  
  // Test 2: Invalid email
  console.log('\n--- Test 2: Invalid Email ---');
  const invalidEmailResult = signupSchema.safeParse({
    name: 'Test User',
    email: 'invalid-email',
    password: 'Password123',
    confirmPassword: 'Password123',
  });
  
  if (!invalidEmailResult.success) {
    console.log('❌ Validation failed (expected)');
    console.table(invalidEmailResult.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })));
  } else {
    console.log('✅ Validation passed (unexpected!)');
  }
  
  // Test 3: Password mismatch
  console.log('\n--- Test 3: Password Mismatch ---');
  const mismatchResult = signupSchema.safeParse({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    confirmPassword: 'Password456',
  });
  
  if (!mismatchResult.success) {
    console.log('❌ Validation failed (expected)');
    console.table(mismatchResult.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })));
  } else {
    console.log('✅ Validation passed (unexpected!)');
  }
  
  // Test 4: Weak password
  console.log('\n--- Test 4: Weak Password ---');
  const weakPasswordResult = signupSchema.safeParse({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    confirmPassword: 'password',
  });
  
  if (!weakPasswordResult.success) {
    console.log('❌ Validation failed (expected)');
    console.table(weakPasswordResult.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })));
  } else {
    console.log('✅ Validation passed (unexpected!)');
  }
  
  // Test 5: Valid form
  console.log('\n--- Test 5: Valid Form ---');
  const validResult = signupSchema.safeParse({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
  });
  
  if (validResult.success) {
    console.log('✅ Validation passed (expected)');
    console.log('Parsed data:', {
      ...validResult.data,
      password: '[REDACTED]',
      confirmPassword: '[REDACTED]',
    });
  } else {
    console.log('❌ Validation failed (unexpected!)');
    console.table(validResult.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })));
  }
  
  console.groupEnd();
}
