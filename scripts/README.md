# Scripts Directory

Utility scripts, tests, and tools for the Snake Rescue platform.

## 📁 Directory Structure

```
scripts/
├── tests/          # Test and verification scripts
├── setup/          # Setup and installation scripts
├── utils/          # Utility and helper scripts
├── sql/            # SQL migration and query files
└── archive/        # Old/archived files
```

## 🧪 Tests (`tests/`)

Testing and verification scripts for various features:

- **`check-all-verifications.ts`** - Verify all verification codes in database
- **`check-otp.ts`** - Check OTP generation and validation
- **`test-backend-connection.js`** - Test backend API connectivity
- **`test-email-brevo.ts`** - Test Brevo email service integration
- **`test-email-service.ts`** - Test generic email service
- **`test-stripe-setup.ts`** - Verify Stripe payment integration
- **`quick-test-registration.ps1`** - Quick user registration test

### Running Tests

```bash
# Run TypeScript test files
npx ts-node scripts/tests/check-otp.ts

# Run JavaScript test files
node scripts/tests/test-backend-connection.js

# Run PowerShell tests
pwsh scripts/tests/quick-test-registration.ps1
```

## 🔧 Setup (`setup/`)

Installation and configuration scripts:

- **`setup-mobile-access.ps1`** - Configure mobile network access
- **`cleanup-mobile-access.ps1`** - Clean up mobile network config
- **`install-all.bat`** - Windows installation script
- **`install-all.sh`** - Unix/Linux installation script

### Running Setup Scripts

```bash
# Unix/Linux/Mac
bash scripts/setup/install-all.sh

# Windows
scripts\setup\install-all.bat

# PowerShell
pwsh scripts/setup/setup-mobile-access.ps1
```

## 🛠️ Utils (`utils/`)

Helper and utility scripts:

- **`clean-build.js`** - Clean build artifacts
- **`fix_passwords.js`** - Password hash fixes
- **`gen_hash.js`** - Generate password hashes
- **`fix-utils-imports.ps1`** - Fix import paths (PowerShell)
- **`fix-utils-imports.sh`** - Fix import paths (Bash)
- **`cleanup-broken-verification.ts`** - Clean up broken verification records
- **`openrouter-client.ts`** - OpenRouter API client

### Running Utils

```bash
# Node.js utilities
node scripts/utils/clean-build.js
node scripts/utils/gen_hash.js

# TypeScript utilities
npx ts-node scripts/utils/cleanup-broken-verification.ts

# Shell scripts
bash scripts/utils/fix-utils-imports.sh
```

## 💾 SQL (`sql/`)

SQL queries and migration files:

- **`check-verification-codes.sql`** - Query verification codes
- **`hospital_migration.sql`** - Hospital data migration

### Running SQL Scripts

```bash
# Using Prisma
npx prisma db execute --file=scripts/sql/hospital_migration.sql --schema=libs/database/prisma/schema.prisma

# Direct PostgreSQL
psql -U postgres -d snake_rescue -f scripts/sql/hospital_migration.sql
```

## 📦 Archive (`archive/`)

Old files kept for reference:

- Build outputs
- Old organization scripts
- Legacy configuration files

## 🎯 Best Practices

1. **Test Scripts**: Always test in development environment first
2. **Backup**: Backup database before running SQL scripts
3. **Environment**: Ensure `.env` is configured correctly
4. **Dependencies**: Install all npm packages before running Node/TS scripts
5. **Permissions**: Make scripts executable: `chmod +x scripts/**/*.sh`

## 📝 Adding New Scripts

When adding new scripts:

1. Place in appropriate subdirectory
2. Add documentation in this README
3. Include usage examples
4. Add error handling
5. Test thoroughly

## 🔒 Security Notes

- Never commit `.env` files
- Don't hardcode API keys or passwords
- Use environment variables for sensitive data
- Review scripts before running in production

---

**Last Updated:** January 2025
