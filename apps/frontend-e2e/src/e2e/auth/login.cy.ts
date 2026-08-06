/**
 * E2E Tests for User Login
 * Tests the complete login flow from credentials to dashboard
 */

describe('User Login Flow', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('/login');
  });

  describe('✅ Login Page', () => {
    it('should display the login form', () => {
      cy.contains('Welcome Back').should('be.visible');
      cy.contains('Sign in to access your account').should('be.visible');
    });

    it('should display all form fields', () => {
      cy.get('input[placeholder="you@example.com"]').should('be.visible');
      cy.get('input[placeholder="Enter your password"]').should('be.visible');
    });

    it('should display remember me checkbox', () => {
      cy.contains('Remember me for 30 days').should('be.visible');
    });

    it('should display forgot password link', () => {
      cy.contains('Forgot password?')
        .should('be.visible')
        .and('have.attr', 'href', '/forgot-password');
    });

    it('should display social login buttons', () => {
      cy.contains('button', 'Google').should('be.visible');
      cy.contains('button', 'GitHub').should('be.visible');
    });

    it('should display link to register page', () => {
      cy.contains("Don't have an account").should('be.visible');
      cy.contains('Create New Account').should('be.visible');
    });
  });

  describe('✅ Form Validation', () => {
    it('should show error when submitting empty form', () => {
      cy.contains('button', 'Sign In').click();
      cy.contains('Please fill in all fields').should('be.visible');
    });

    it('should show error when only email is provided', () => {
      cy.get('input[placeholder="you@example.com"]').type('test@example.com');
      cy.contains('button', 'Sign In').click();
      cy.contains('Please fill in all fields').should('be.visible');
    });

    it('should show error when only password is provided', () => {
      cy.get('input[placeholder="Enter your password"]').type('password123');
      cy.contains('button', 'Sign In').click();
      cy.contains('Please fill in all fields').should('be.visible');
    });
  });

  describe('✅ Successful Login', () => {
    it('should successfully login with valid credentials', () => {
      // Fill the form
      cy.get('input[placeholder="you@example.com"]').type('test@example.com');
      cy.get('input[placeholder="Enter your password"]').type('password123');
      
      // Submit form
      cy.contains('button', 'Sign In').click();
      
      // Should show loading state
      cy.contains('Signing in...', { timeout: 1000 }).should('be.visible');
      
      // Should redirect to dashboard
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
      cy.contains('Welcome back').should('be.visible');
    });

    it('should persist remember me preference', () => {
      cy.get('input[type="checkbox"]#remember').should('not.be.checked');
      cy.get('input[type="checkbox"]#remember').check();
      cy.get('input[type="checkbox"]#remember').should('be.checked');
    });
  });

  describe('✅ Error Handling', () => {
    it('should display error for invalid credentials', () => {
      cy.get('input[placeholder="you@example.com"]').type('wrong@example.com');
      cy.get('input[placeholder="Enter your password"]').type('wrongpassword');
      
      cy.contains('button', 'Sign In').click();
      
      // Mock auth will show generic error
      cy.get('[class*="bg-red"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'Invalid');
    });
  });

  describe('✅ Navigation', () => {
    it('should navigate to register page when clicking register link', () => {
      cy.contains('Create New Account').click();
      cy.url().should('include', '/register');
      cy.contains('Create Account').should('be.visible');
    });

    it('should navigate to forgot password page', () => {
      cy.contains('Forgot password?').click();
      cy.url().should('include', '/forgot-password');
      cy.contains('Forgot Password?').should('be.visible');
    });
  });

  describe('✅ Password Field', () => {
    it('should toggle password visibility', () => {
      cy.get('input[placeholder="Enter your password"]')
        .should('have.attr', 'type', 'password');
      
      // Find and click the password toggle button
      cy.get('input[placeholder="Enter your password"]')
        .parent()
        .find('button')
        .click();
      
      cy.get('input[placeholder="Enter your password"]')
        .should('have.attr', 'type', 'text');
    });
  });

  describe('✅ Social Login', () => {
    it('should handle Google login click', () => {
      // Intercept console logs to verify click
      cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLog');
      });

      cy.contains('button', 'Google').click();
      
      cy.get('@consoleLog').should('be.calledWith', 'Social login with Google - Coming soon');
    });

    it('should handle GitHub login click', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLog');
      });

      cy.contains('button', 'GitHub').click();
      
      cy.get('@consoleLog').should('be.calledWith', 'Social login with GitHub - Coming soon');
    });
  });
});
