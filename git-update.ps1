# سكريبت تلقائي لرفع التحديثات إلى GitHub
# Auto GitHub Update Script

Write-Host "🚀 بدء رفع التحديثات إلى GitHub..." -ForegroundColor Green

# التحقق من وجود Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git غير مثبت على النظام!" -ForegroundColor Red
    exit 1
}

# التحقق من وجود repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ هذا المجلد ليس Git repository!" -ForegroundColor Red
    Write-Host "يرجى تشغيل 'git init' أولاً" -ForegroundColor Yellow
    exit 1
}

# إضافة جميع الملفات
Write-Host "📁 إضافة الملفات..." -ForegroundColor Cyan
git add .

# التحقق من وجود تغييرات
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ لا توجد تغييرات جديدة!" -ForegroundColor Green
    exit 0
}

# إنشاء رسالة commit تلقائية
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "🔄 تحديث تلقائي - $timestamp"

Write-Host "💾 إنشاء commit..." -ForegroundColor Cyan
git commit -m $commitMessage

# التحقق من وجود remote origin
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "❌ لا يوجد remote origin!" -ForegroundColor Red
    Write-Host "يرجى إضافة remote origin أولاً:" -ForegroundColor Yellow
    Write-Host "git remote add origin <your-repo-url>" -ForegroundColor Yellow
    exit 1
}

# رفع التحديثات
Write-Host "⬆️ رفع التحديثات إلى GitHub..." -ForegroundColor Cyan
try {
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ تم رفع التحديثات بنجاح!" -ForegroundColor Green
        Write-Host "🔗 Repository: $remoteUrl" -ForegroundColor Blue
    } else {
        # محاولة رفع إلى master إذا فشل main
        Write-Host "🔄 محاولة رفع إلى master..." -ForegroundColor Yellow
        git push origin master
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ تم رفع التحديثات بنجاح إلى master!" -ForegroundColor Green
        } else {
            Write-Host "❌ فشل في رفع التحديثات!" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "❌ خطأ في رفع التحديثات: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 تم الانتهاء بنجاح!" -ForegroundColor Green
Write-Host "⏰ الوقت: $timestamp" -ForegroundColor Gray
