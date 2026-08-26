/**
 * Authentication GraphQL Mutations
 */

import { gql } from '@apollo/client';

/**
 * User Fragment - Core user fields
 */
export const USER_FIELDS_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    name
    role
    phone
    emailVerified
    createdAt
    updatedAt
  }
`;

/**
 * Registration Payload Fragment - Registration response fields (no auth tokens)
 */
export const REGISTRATION_PAYLOAD_FRAGMENT = gql`
  ${USER_FIELDS_FRAGMENT}

  fragment RegistrationPayloadFields on RegistrationPayload {
    user {
      ...UserFields
    }
  }
`;

/**
 * Auth Payload Fragment - Authentication response fields
 */
export const AUTH_PAYLOAD_FRAGMENT = gql`
  ${USER_FIELDS_FRAGMENT}

  fragment AuthPayloadFields on AuthPayload {
    accessToken
    refreshToken
    expiresIn
    user {
      ...UserFields
    }
  }
`;

/**
 * Register Mutation - Create a new user account
 * Returns user data only (no tokens until email is verified and user logs in)
 */
export const REGISTER_MUTATION = gql`
  ${REGISTRATION_PAYLOAD_FRAGMENT}

  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...RegistrationPayloadFields
    }
  }
`;

/**
 * Login Mutation - Authenticate user
 */
export const LOGIN_MUTATION = gql`
  ${AUTH_PAYLOAD_FRAGMENT}

  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...AuthPayloadFields
    }
  }
`;

/**
 * Logout Mutation - End user session
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

/**
 * Refresh Token Mutation - Get new access token
 */
export const REFRESH_TOKEN_MUTATION = gql`
  ${AUTH_PAYLOAD_FRAGMENT}

  mutation RefreshToken {
    refreshToken {
      ...AuthPayloadFields
    }
  }
`;

/**
 * Forgot Password Mutation - Request password reset
 */
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      expiresAt
    }
  }
`;

/**
 * Reset Password Mutation - Reset password with token
 */
export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

/**
 * Verify Email Mutation - Verify email address with token
 */
export const VERIFY_EMAIL_MUTATION = gql`
  ${USER_FIELDS_FRAGMENT}

  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      success
      message
      user {
        ...UserFields
      }
    }
  }
`;

/**
 * Resend Verification Mutation - Resend email verification
 */
export const RESEND_VERIFICATION_MUTATION = gql`
  mutation ResendVerification($input: ResendVerificationInput!) {
    resendVerification(input: $input)
  }
`;

/**
 * Change Password Mutation - Change user password
 */
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;

/**
 * Update Profile Mutation - Update user profile
 */
export const UPDATE_PROFILE_MUTATION = gql`
  ${USER_FIELDS_FRAGMENT}

  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
`;
