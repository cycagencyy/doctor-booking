
# GitHub Setup Script
Write-Host "Starting GitHub setup..." -ForegroundColor Green

# Check if Git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed!" -ForegroundColor Red
    Write-Host "Please download Git from: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit 1
}

# Check if repository exists
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
}

# Add all files
Write-Host "Adding all files..." -ForegroundColor Cyan
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Doctor booking system"

# Request GitHub repository URL
Write-Host ""
Write-Host "Please enter GitHub repository URL:" -ForegroundColor Yellow
Write-Host "Example: https://github.com/username/repository-name.git" -ForegroundColor Gray
$repoUrl = Read-Host "Repository URL"

if (-not $repoUrl) {
    Write-Host "Repository URL is required!" -ForegroundColor Red
    exit 1
}

# Add remote origin
Write-Host "Adding remote origin..." -ForegroundColor Cyan
git remote add origin $repoUrl

# Push project
Write-Host "Pushing project to GitHub..." -ForegroundColor Cyan
try {
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Project uploaded successfully!" -ForegroundColor Green
        Write-Host "Repository: $repoUrl" -ForegroundColor Blue
    } else {
        Write-Host "Failed to upload project!" -ForegroundColor Red
        Write-Host "Check repository URL and permissions" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Error uploading project: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel and connect the new repository" -ForegroundColor White
Write-Host "2. Use git-update.ps1 for future updates" -ForegroundColor White
Write-Host "3. Use quick-update.ps1 for quick updates" -ForegroundColor White
https://github.com/cycagencyy/doc