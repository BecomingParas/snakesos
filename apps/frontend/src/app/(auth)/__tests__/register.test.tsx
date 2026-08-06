/**
 * Registration Page Tests
 * Tests the complete signup flow including form validation and submission
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterPage from '../register/page';
import { useAuth } from '@snake-rescue/features';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@snake-rescue/features', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-icons/fc', () => ({
  FcGoogle: () => <div>Google Icon</div>,
}));

jest.mock('lucide-react', () => ({
  User: () => <div>User Icon</div>,
  Loader2: () => <div>Loading Icon</div>,
  AlertCircle: () => <div>Alert Icon</div>,
  Github: () => <div>Github Icon</div>,
}));

describe('RegisterPage', () => {
  const mockPush = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      isLoading: false,
    });
  });

  describe('✅ Page Rendering', () => {
    it('should render the registration form', () => {
      render(<RegisterPage />);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join our wildlife rescue community and help save lives')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<RegisterPage />);

      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+977 98XXXXXXXX')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    });

    it('should render social login buttons', () => {
      render(<RegisterPage />);

      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('should render terms and conditions checkbox', () => {
      render(<RegisterPage />);

      expect(screen.getByText(/I agree to the/)).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });
  });

  describe('✅ Form Validation', () => {
    it('should show error when required fields are empty', async () => {
      render(<RegisterPage />);

      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
      });
    });

    it('should show error for weak password', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });

      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should show error when terms are not accepted', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please accept the terms and conditions')).toBeInTheDocument();
      });
    });
  });

  describe('✅ Successful Registration', () => {
    it('should submit form successfully with valid data', async () => {
      mockRegister.mockResolvedValueOnce(undefined);

      render(<RegisterPage />);

      // Fill form
      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const termsCheckbox = screen.getByRole('checkbox', { name: /I agree to the/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(termsCheckbox);

      // Submit
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          phone: '',
          password: 'password123',
        });
        expect(mockPush).toHaveBeenCalledWith('/verify-email');
      });
    });

    it('should include phone number if provided', async () => {
      mockRegister.mockResolvedValueOnce(undefined);

      render(<RegisterPage />);

      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const phoneInput = screen.getByPlaceholderText('+977 98XXXXXXXX');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const termsCheckbox = screen.getByRole('checkbox', { name: /I agree to the/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '+9779812345678' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(termsCheckbox);

      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+9779812345678',
          password: 'password123',
        });
      });
    });
  });

  describe('✅ Error Handling', () => {
    it('should display error message on registration failure', async () => {
      mockRegister.mockRejectedValueOnce(new Error('Email already exists'));

      render(<RegisterPage />);

      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const termsCheckbox = screen.getByRole('checkbox', { name: /I agree to the/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(termsCheckbox);

      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });
  });

  describe('✅ Loading State', () => {
    it('should show loading state during registration', () => {
      (useAuth as jest.Mock).mockReturnValue({
        register: mockRegister,
        isLoading: true,
      });

      render(<RegisterPage />);

      expect(screen.getByText('Creating account...')).toBeInTheDocument();
    });
  });

  describe('✅ Navigation Links', () => {
    it('should have link to login page', () => {
      render(<RegisterPage />);

      const loginLink = screen.getByText('Sign In Instead');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });
});
