/**
 * E2E Tests for User Registration
 * Tests the complete signup flow from form fill to dashboard
 */

describe('User Registration Flow', () => {
  beforeEach(() => {
    // Visit the registration page
    cy.visit('/register');
  });

  describe('✅ Registration Page', () => {
    it('should display the registration form', () => {
      cy.contains('Create Account').should('be.visible');
      cy.contains('Join our wildlife rescue community').should('be.visible');
    });

    it('should display all form fields', () => {
      cy.get('input[placeholder="John Doe"]').should('be.visible');
      cy.get('input[placeholder="you@example.com"]').should('be.visible');
      cy.get('input[placeholder="+977 98XXXXXXXX"]').should('be.visible');
      cy.get('input[placeholder="Create a strong password"]').should('be.visible');
      cy.get('input[placeholder="Confirm your password"]').should('be.visible');
    });

    it('should display terms checkbox', () => {
      cy.contains('I agree to the').should('be.visible');
      cy.contains('Terms of Service').should('be.visible');
      cy.contains('Privacy Policy').should('be.visible');
    });

    it('should display social login buttons', () => {
      cy.contains('button', 'Google').should('be.visible');
      cy.contains('button', 'GitHub').should('be.visible');
    });

    it('should display link to login page', () => {
      cy.contains('Already have an account').should('be.visible');
      cy.contains('Sign In Instead').should('have.attr', 'href', '/login');
    });
  });

  describe('✅ Form Validation', () => {
    it('should show error when submitting empty form', () => {
      cy.contains('button', 'Create Account').click();
      cy.contains('Please fill in all required fields').should('be.visible');
    });

    it('should show error for weak password', () => {
      cy.get('input[placeholder="John Doe"]').type('Test User');
      cy.get('input[placeholder="you@example.com"]').type('test@example.com');
      cy.get('input[placeholder="Create a strong password"]').type('weak');
      cy.get('input[placeholder="Confirm your password"]').type('weak');
      
      cy.contains('button', 'Create Account').click();
      cy.contains('Password must be at least 8 characters long').should('be.visible');
    });

    it('should show error when passwords do not match', () => {
      cy.get('input[placeholder="John Doe"]').type('Test User');
      cy.get('input[placeholder="you@example.com"]').type('test@example.com');
      cy.get('input[placeholder="Create a strong password"]').type('password123');
      cy.get('input[placeholder="Confirm your password"]').type('password456');
      
      cy.contains('button', 'Create Account').click();
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should show error when terms are not accepted', () => {
      cy.get('input[placeholder="John Doe"]').type('Test User');
      cy.get('input[placeholder="you@example.com"]').type('test@example.com');
      cy.get('input[placeholder="Create a strong password"]').type('password123');
      cy.get('input[placeholder="Confirm your password"]').type('password123');
      
      cy.contains('button', 'Create Account').click();
      cy.contains('Please accept the terms and conditions').should('be.visible');
    });
  });

  describe('✅ Successful Registration', () => {
    it('should successfully register a new user with valid data', () => {
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;

      // Fill the form
      cy.get('input[placeholder="John Doe"]').type('Test User');
      cy.get('input[placeholder="you@example.com"]').type(email);
      cy.get('input[placeholder="Create a strong password"]').type('TestPassword123');
      cy.get('input[placeholder="Confirm your password"]').type('TestPassword123');
      
      // Accept terms
      cy.get('input[type="checkbox"]#terms').check();
      
      // Submit form
      cy.contains('button', 'Create Account').click();
      
      // Should show loading state
      cy.contains('Creating account...', { timeout: 1000 }).should('be.visible');
      
      // Should redirect to verify email page
      cy.url({ timeout: 10000 }).should('include', '/verify-email');
      cy.contains('Verify Your Email').should('be.visible');
    });

    it('should include phone number when provided', () => {
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;

      cy.get('input[placeholder="John Doe"]').type('Test User');
      cy.get('input[placeholder="you@example.com"]').type(email);
      cy.get('input[placeholder="+977 98XXXXXXXX"]').type('+9779812345678');
      cy.get('input[placeholder="Create a strong password"]').type('TestPassword123');
      cy.get('input[placeholder="Confirm your password"]').type('TestPassword123');
      cy.get('input[type="checkbox"]#terms').check();
      
      cy.contains('button', 'Create Account').click();
      
      cy.url({ timeout: 10000 }).should('include', '/verify-email');
    });
  });

  describe('✅ Navigation', () => {
    it('should navigate to login page when clicking login link', () => {
      cy.contains('Sign In Instead').click();
      cy.url().should('include', '/login');
      cy.contains('Welcome Back').should('be.visible');
    });

    it('should navigate to terms page when clicking terms link', () => {
      cy.contains('Terms of Service').should('have.attr', 'href', '/terms');
    });

    it('should navigate to privacy page when clicking privacy link', () => {
      cy.contains('Privacy Policy').should('have.attr', 'href', '/privacy');
    });
  });

  describe('✅ Password Field', () => {
    it('should toggle password visibility', () => {
      cy.get('input[placeholder="Create a strong password"]')
        .should('have.attr', 'type', 'password');
      
      // Find and click the password toggle button
      cy.get('input[placeholder="Create a strong password"]')
        .parent()
        .find('button')
        .click();
      
      cy.get('input[placeholder="Create a strong password"]')
        .should('have.attr', 'type', 'text');
    });
  });
});
