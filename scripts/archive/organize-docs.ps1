# PowerShell script to organize all documentation files into docs folder
# Keeps only essential MD files in root (README.md, START_HERE.md)

Write-Host "🗂️  Organizing documentation files..." -ForegroundColor Cyan

# Files to keep in root
$keepInRoot = @(
    "README.md",
    "START_HERE.md"
)

# Get all MD files in root
$mdFiles = Get-ChildItem -Path . -Filter "*.md" -File | Where-Object { 
    $_.Name -notin $keepInRoot 
}

$moved = 0
$skipped = 0

foreach ($file in $mdFiles) {
    $destPath = Join-Path "docs" $file.Name
    
    # Check if file already exists in docs
    if (Test-Path $destPath) {
        Write-Host "⏭️  Skipping $($file.Name) (already exists in docs)" -ForegroundColor Yellow
        $skipped++
    }
    else {
        Move-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "✅ Moved: $($file.Name)" -ForegroundColor Green
        $moved++
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   Moved: $moved files" -ForegroundColor Green
Write-Host "   Skipped: $skipped files (already in docs)" -ForegroundColor Yellow
Write-Host "   Kept in root: $($keepInRoot.Count) files (README.md, START_HERE.md)" -ForegroundColor Blue
Write-Host "`n✨ Root directory is now clean!" -ForegroundColor Green
