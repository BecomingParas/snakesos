# ============================================================================
# Snake Rescue - Mobile Access Setup Script
# ============================================================================
# This script will automatically configure your system to access the 
# development server from mobile devices on the same network.
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Snake Rescue - Mobile Access Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script needs Administrator privileges to configure Windows Firewall." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please do ONE of the following:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell and select 'Run as Administrator', then run this script again" -ForegroundColor White
    Write-Host "2. Or run this command in Administrator PowerShell:" -ForegroundColor White
    Write-Host "   Set-ExecutionPolicy Bypass -Scope Process -Force; .\setup-mobile-access.ps1" -ForegroundColor Green
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "✓ Running with Administrator privileges" -ForegroundColor Green
Write-Host ""

# Step 1: Get the computer's IP address
Write-Host "[1/4] Finding your computer's IP address..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -and $_.IPAddress -notlike "169.254.*" }).IPAddress

if (-not $ipAddress) {
    # Fallback to Ethernet if Wi-Fi not found
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Ethernet*" -and $_.IPAddress -notlike "169.254.*" -and $_.IPAddress -notlike "127.*" }).IPAddress | Select-Object -First 1
}

if (-not $ipAddress) {
    Write-Host "❌ Could not detect your IP address automatically." -ForegroundColor Red
    Write-Host "Please run 'ipconfig' and find your IPv4 Address manually." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "   Your IP Address: $ipAddress" -ForegroundColor Green
Write-Host ""

# Step 2: Configure Windows Firewall
Write-Host "[2/4] Configuring Windows Firewall..." -ForegroundColor Yellow

# Remove existing rules if they exist (to avoid duplicates)
netsh advfirewall firewall delete rule name="Next.js Dev Server" 2>$null | Out-Null
netsh advfirewall firewall delete rule name="Backend GraphQL Server" 2>$null | Out-Null

# Add new firewall rules
$result1 = netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=4200
$result2 = netsh advfirewall firewall add rule name="Backend GraphQL Server" dir=in action=allow protocol=TCP localport=4000

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Port 4200 (Frontend) - Opened" -ForegroundColor Green
    Write-Host "   ✓ Port 4000 (Backend) - Opened" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to configure firewall" -ForegroundColor Red
}
Write-Host ""

# Step 3: Update project.json
Write-Host "[3/4] Updating project.json configuration..." -ForegroundColor Yellow

$projectJsonPath = "apps\frontend\project.json"

if (Test-Path $projectJsonPath) {
    try {
        # Read and parse JSON
        $json = Get-Content $projectJsonPath -Raw | ConvertFrom-Json
        
        # Add hostname to serve options
        $json.targets.serve.options | Add-Member -NotePropertyName "hostname" -NotePropertyValue "0.0.0.0" -Force
        
        # Save back to file with proper formatting
        $json | ConvertTo-Json -Depth 10 | Set-Content $projectJsonPath
        
        Write-Host "   ✓ Added hostname configuration" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Could not update project.json automatically" -ForegroundColor Yellow
        Write-Host "   Please manually add: `"hostname`": `"0.0.0.0`" to serve options" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  project.json not found" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Create mobile environment file
Write-Host "[4/4] Creating mobile environment configuration..." -ForegroundColor Yellow

$envMobileContent = @"
# ===================================================================
# MOBILE DEVELOPMENT CONFIGURATION
# ===================================================================
# Use this configuration when testing on mobile devices
# Copy this to .env.local when needed, or use: npm run dev:mobile

# Backend API Configuration (Using your computer's IP)
NEXT_PUBLIC_API_URL=http://${ipAddress}:4000
NEXT_PUBLIC_GRAPHQL_URL=http://${ipAddress}:4000/graphql
NEXT_PUBLIC_AUTH_URL=http://${ipAddress}:4000/api/auth

# Frontend Configuration
NEXT_PUBLIC_FRONTEND_URL=http://${ipAddress}:4200

# ===================================================================
# To use this configuration:
# 1. Backup current .env.local: cp apps/frontend/.env.local apps/frontend/.env.local.backup
# 2. Copy this file: cp apps/frontend/.env.mobile apps/frontend/.env.local
# 3. Restart dev server: npm run dev
# ===================================================================
"@

$envMobilePath = "apps\frontend\.env.mobile"
$envMobileContent | Set-Content $envMobilePath -Encoding UTF8

Write-Host "   ✓ Created .env.mobile with your IP address" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Quick Start:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. (Optional) Use mobile environment:" -ForegroundColor White
Write-Host "   Copy-Item apps\frontend\.env.mobile apps\frontend\.env.local -Force" -ForegroundColor Green
Write-Host ""
Write-Host "2. Start your dev server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "3. On your mobile (same Wi-Fi):" -ForegroundColor White
Write-Host "   Open browser and go to:" -ForegroundColor White
Write-Host "   http://${ipAddress}:4200" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Mobile Access URL:" -ForegroundColor Yellow
Write-Host "   http://${ipAddress}:4200" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "📋 Copy this URL and paste in your mobile browser" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Remember:" -ForegroundColor Yellow
Write-Host "   - Both devices must be on the same Wi-Fi" -ForegroundColor White
Write-Host "   - Dev server must be running (npm run dev)" -ForegroundColor White
Write-Host ""

# Save info to a file
$infoContent = @"
========================================
Snake Rescue - Mobile Access Information
========================================

Your Computer IP: $ipAddress
Frontend URL: http://${ipAddress}:4200
Backend URL: http://${ipAddress}:4000

Setup Date: $(Get-Date -Format "yyyy-MM-dd HH:mm")

To access from mobile:
1. Connect mobile to same Wi-Fi
2. Open: http://${ipAddress}:4200

To undo this setup, run:
  .\cleanup-mobile-access.ps1
========================================
"@

$infoContent | Set-Content "MOBILE_ACCESS_INFO.txt" -Encoding UTF8
Write-Host "💾 Saved access info to: MOBILE_ACCESS_INFO.txt" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to close"
