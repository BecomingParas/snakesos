# Quick Test Registration Email
# Run: .\quick-test-registration.ps1

Write-Host "`n🧪 Quick Test: Registration Email Flow`n" -ForegroundColor Cyan

# Step 1: Check environment variables
Write-Host "📋 Step 1: Checking SMTP configuration..." -ForegroundColor Yellow
$smtpHost = $env:SMTP_HOST
$smtpUser = $env:SMTP_USER

if (-not $smtpHost -or -not $smtpUser) {
    Write-Host "❌ SMTP not configured in environment!" -ForegroundColor Red
    Write-Host "   Loading from .env file..." -ForegroundColor Yellow
    
    # Load .env file
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
    
    Write-Host "✅ Loaded .env file" -ForegroundColor Green
}

Write-Host "   SMTP_HOST: $env:SMTP_HOST" -ForegroundColor Gray
Write-Host "   SMTP_USER: $env:SMTP_USER" -ForegroundColor Gray
Write-Host ""

# Step 2: Test email service
Write-Host "📧 Step 2: Testing email service..." -ForegroundColor Yellow

$testEmail = Read-Host "Enter your email address to receive test"

Write-Host "   Sending test email to $testEmail..." -ForegroundColor Gray

$result = npx tsx test-email-brevo.ts $testEmail 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Test email sent successfully!" -ForegroundColor Green
    Write-Host "   Check your inbox: $testEmail" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Test email failed!" -ForegroundColor Red
    Write-Host $result
    Write-Host ""
    Write-Host "⚠️  Fix email service before testing registration" -ForegroundColor Yellow
    exit 1
}

# Step 3: Instructions for GraphQL test
Write-Host "🚀 Step 3: Test registration in GraphQL Playground" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start backend:" -ForegroundColor White
Write-Host "   yarn dev:backend" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Open GraphQL Playground:" -ForegroundColor White
Write-Host "   http://localhost:4000/graphql" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Run this mutation:" -ForegroundColor White
Write-Host @"
   mutation {
     register(input: {
       email: "$testEmail"
       password: "Test@123456"
       name: "Test User"
     }) {
       user {
         id
         email
         emailVerified
       }
     }
   }
"@ -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Check backend console for:" -ForegroundColor White
Write-Host "   [INFO] Email sent successfully" -ForegroundColor Green
Write-Host ""
Write-Host "5. Check your email inbox!" -ForegroundColor White
Write-Host ""

Write-Host "✨ Test complete! Email service is ready.`n" -ForegroundColor Green
