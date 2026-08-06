/**
 * E2E Tests for Complete Authentication Flow
 * Tests the end-to-end user journey from signup to dashboard
 */

describe('Complete Authentication Flow', () => {
  const testUser = {
    name: 'Cypress Test User',
    email: `cypress${Date.now()}@test.com`,
    phone: '+9779812345678',
    password: 'CypressTest123!',
  };

  describe('✅ Full Registration to Dashboard Flow', () => {
    it('should complete the entire signup journey', () => {
      // Step 1: Visit home page
      cy.visit('/');
      cy.contains('SnakeSOS').should('be.visible');

      // Step 2: Click Sign Up button in navbar
      cy.contains('Sign Up').click();
      cy.url().should('include', '/register');

      // Step 3: Fill registration form
      cy.get('input[placeholder="John Doe"]').type(testUser.name);
      cy.get('input[placeholder="you@example.com"]').type(testUser.email);
      cy.get('input[placeholder="+977 98XXXXXXXX"]').type(testUser.phone);
      cy.get('input[placeholder="Create a strong password"]').type(testUser.password);
      cy.get('input[placeholder="Confirm your password"]').type(testUser.password);
      cy.get('input[type="checkbox"]#terms').check();

      // Step 4: Submit registration
      cy.contains('button', 'Create Account').click();

      // Step 5: Verify email page
      cy.url({ timeout: 10000 }).should('include', '/verify-email');
      cy.contains('Verify Your Email').should('be.visible');
      cy.contains(testUser.email).should('be.visible');

      // Step 6: Click "I've Verified My Email"
      cy.contains("I've Verified My Email").click();

      // Step 7: Email verified success page
      cy.url({ timeout: 5000 }).should('include', '/email-verified');
      cy.contains('Email Verified!').should('be.visible');

      // Step 8: Either wait for auto-redirect or click button
      cy.contains('Complete Your Profile').click();

      // Step 9: Complete profile page
      cy.url({ timeout: 5000 }).should('include', '/complete-profile');
      cy.contains('Complete Your Profile').should('be.visible');

      // Step 10: Skip or fill profile
      cy.contains('Skip for Now').click();

      // Step 11: Dashboard
      cy.url({ timeout: 5000 }).should('include', '/dashboard');
      cy.contains('Welcome back').should('be.visible');
    });
  });

  describe('✅ Login After Registration', () => {
    it('should logout and login again', () => {
      // Assuming user is already logged in from previous test
      cy.visit('/dashboard');

      // Find and click user avatar/menu
      cy.get('[class*="bg-emerald"]').first().click();

      // Click logout
      cy.contains('Logout').click();

      // Should redirect to home
      cy.url({ timeout: 5000 }).should('not.include', '/dashboard');

      // Navigate to login
      cy.visit('/login');

      // Login with same credentials
      cy.get('input[placeholder="you@example.com"]').type(testUser.email);
      cy.get('input[placeholder="Enter your password"]').type(testUser.password);
      cy.contains('button', 'Sign In').click();

      // Should redirect to dashboard
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
      cy.contains('Welcome back').should('be.visible');
    });
  });

  describe('✅ Navbar Auth State', () => {
    it('should show correct UI for guest users', () => {
      cy.visit('/');
      
      // Should show Login and Sign Up buttons
      cy.contains('button', 'Login').should('be.visible');
      cy.contains('button', 'Sign Up').should('be.visible');
    });

    it('should show correct UI for authenticated users', () => {
      // Login first
      cy.visit('/login');
      cy.get('input[placeholder="you@example.com"]').type('test@example.com');
      cy.get('input[placeholder="Enter your password"]').type('password123');
      cy.contains('button', 'Sign In').click();

      // Wait for dashboard
      cy.url({ timeout: 10000 }).should('include', '/dashboard');

      // Navigate to home
      cy.visit('/');

      // Should NOT show Login/Sign Up buttons
      cy.contains('button', 'Login').should('not.exist');
      cy.contains('button', 'Sign Up').should('not.exist');

      // Should show user menu
      cy.get('[class*="bg-emerald"]').should('exist');
    });
  });

  describe('✅ Protected Routes', () => {
    it('should redirect to login when accessing dashboard without auth', () => {
      // Clear any existing session
      cy.clearCookies();
      cy.clearLocalStorage();

      // Try to access dashboard
      cy.visit('/dashboard');

      // Should redirect to login
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('should allow access to dashboard when authenticated', () => {
      // Login
      cy.visit('/login');
      cy.get('input[placeholder="you@example.com"]').type('test@example.com');
      cy.get('input[placeholder="Enter your password"]').type('password123');
      cy.contains('button', 'Sign In').click();

      // Should access dashboard
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
      cy.contains('Welcome back').should('be.visible');
    });
  });
});
