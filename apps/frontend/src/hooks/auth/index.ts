/**
 * Authentication Hooks - Barrel Export
 */

export { useSignup } from './useSignup';
export { useLogin } from './useLogin';
export { useLogout } from './useLogout';
export { useForgotPassword } from './useForgotPassword';
export { useResetPassword } from './useResetPassword';
export { useVerifyEmail, useResendVerification } from './useVerifyEmail';

export type { SignupInput, SignupResult } from './useSignup';
export type { LoginInput, LoginResult } from './useLogin';
export type { ForgotPasswordResult } from './useForgotPassword';
export type { ResetPasswordInput } from './useResetPassword';
export type { VerifyEmailResult } from './useVerifyEmail';
