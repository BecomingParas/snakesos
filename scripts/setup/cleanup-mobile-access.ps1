# ============================================================================
# Snake Rescue - Mobile Access Cleanup Script
# ============================================================================
# This script removes the mobile access configuration
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mobile Access Cleanup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script needs Administrator privileges." -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Remove firewall rules
Write-Host "Removing firewall rules..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="Next.js Dev Server" 2>$null
netsh advfirewall firewall delete rule name="Backend GraphQL Server" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Firewall rules removed" -ForegroundColor Green
} else {
    Write-Host "⚠️  No firewall rules found (already cleaned)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: The project.json changes will remain." -ForegroundColor Yellow
Write-Host "This won't affect normal development." -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to close"
