# Fix all incorrect utils imports in UI library

Write-Host "🔧 Fixing utils imports in UI library..." -ForegroundColor Cyan
Write-Host ""

$uiLibPath = "libs\frontend\ui\src\lib"
$files = Get-ChildItem -Path $uiLibPath -Filter "*.tsx" -Recurse

$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Fix pattern 1: ../../lib/utils -> ./utils
    $content = $content -replace "from ['""]\.\.\/\.\.\/lib\/utils['""]", "from './utils'"
    
    # Fix pattern 2: @/lib/utils -> ./utils
    $content = $content -replace "from ['""]@\/lib\/utils['""]", "from './utils'"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✅ Fixed: $($file.Name)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Fixed $fixedCount files!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now try running:" -ForegroundColor Yellow
Write-Host "  yarn dev:frontend" -ForegroundColor White
Write-Host ""
