/**
 * Login Page Tests
 * Tests the complete login flow including form validation and submission
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '../login/page';
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
  Loader2: () => <div>Loading Icon</div>,
  AlertCircle: () => <div>Alert Icon</div>,
  Github: () => <div>Github Icon</div>,
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });
  });

  describe('✅ Page Rendering', () => {
    it('should render the login form', () => {
      render(<LoginPage />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to access your account and continue rescue operations')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<LoginPage />);

      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    it('should render remember me checkbox', () => {
      render(<LoginPage />);

      expect(screen.getByText('Remember me for 30 days')).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      render(<LoginPage />);

      const forgotLink = screen.getByText('Forgot password?');
      expect(forgotLink).toBeInTheDocument();
      expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    });

    it('should render social login buttons', () => {
      render(<LoginPage />);

      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });
  });

  describe('✅ Form Validation', () => {
    it('should show error when fields are empty', async () => {
      render(<LoginPage />);

      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
      });
    });

    it('should show error when only email is provided', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('you@example.com');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
      });
    });

    it('should show error when only password is provided', async () => {
      render(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
      });
    });
  });

  describe('✅ Successful Login', () => {
    it('should submit form successfully with valid credentials', async () => {
      mockLogin.mockResolvedValueOnce(undefined);

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should handle remember me checkbox', async () => {
      render(<LoginPage />);

      const rememberCheckbox = screen.getByRole('checkbox', { name: /Remember me/i });
      expect(rememberCheckbox).not.toBeChecked();

      fireEvent.click(rememberCheckbox);
      expect(rememberCheckbox).toBeChecked();
    });
  });

  describe('✅ Error Handling', () => {
    it('should display error message on login failure', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('should display generic error for unknown failures', async () => {
      mockLogin.mockRejectedValueOnce(new Error());

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('you@example.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });
  });

  describe('✅ Loading State', () => {
    it('should show loading state during login', () => {
      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: true,
      });

      render(<LoginPage />);

      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });

    it('should disable submit button during loading', () => {
      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: true,
      });

      render(<LoginPage />);

      const submitButton = screen.getByText('Signing in...');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('✅ Navigation Links', () => {
    it('should have link to register page', () => {
      render(<LoginPage />);

      const registerLink = screen.getByText('Create New Account');
      expect(registerLink).toBeInTheDocument();
    });

    it('should have link to forgot password page', () => {
      render(<LoginPage />);

      const forgotLink = screen.getByText('Forgot password?');
      expect(forgotLink).toBeInTheDocument();
      expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    });
  });

  describe('✅ Social Login', () => {
    it('should handle Google login click', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      render(<LoginPage />);

      const googleButton = screen.getByText('Google').closest('button');
      fireEvent.click(googleButton!);

      expect(consoleSpy).toHaveBeenCalledWith('Social login with Google - Coming soon');
      consoleSpy.mockRestore();
    });

    it('should handle GitHub login click', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      render(<LoginPage />);

      const githubButton = screen.getByText('GitHub').closest('button');
      fireEvent.click(githubButton!);

      expect(consoleSpy).toHaveBeenCalledWith('Social login with GitHub - Coming soon');
      consoleSpy.mockRestore();
    });
  });
});
