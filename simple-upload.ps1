# Simple GitHub Upload Script
Write-Host "Starting simple upload..." -ForegroundColor Green

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git..." -ForegroundColor Cyan
    git init
}

# Add files (excluding problematic directories)
Write-Host "Adding files..." -ForegroundColor Cyan
git add . --ignore-errors

# Create commit
Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Doctor booking system"

# Get repository URL
Write-Host ""
Write-Host "Enter GitHub repository URL:" -ForegroundColor Yellow
$repoUrl = Read-Host "URL"

if ($repoUrl) {
    # Add remote
    Write-Host "Adding remote..." -ForegroundColor Cyan
    git remote add origin $repoUrl
    
    # Push to master (not main)
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success!" -ForegroundColor Green
    } else {
        Write-Host "Failed to push" -ForegroundColor Red
    }
} else {
    Write-Host "No URL provided" -ForegroundColor Red
}
