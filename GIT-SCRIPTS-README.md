# 🚀 سكريبتات GitHub التلقائية

## 📋 السكريبتات المتاحة

### 1. `setup-github.ps1` - إعداد أولي
```powershell
.\setup-github.ps1
```
- يهيئ Git repository
- يرفع المشروع لأول مرة إلى GitHub
- يطلب منك رابط repository

### 2. `git-update.ps1` - تحديث شامل
```powershell
.\git-update.ps1
```
- يضيف جميع التغييرات
- ينشئ commit مع timestamp
- يرفع التحديثات تلقائياً
- يتعامل مع الأخطاء

### 3. `quick-update.ps1` - تحديث سريع
```powershell
.\quick-update.ps1
```
- تحديث سريع بدون تفاصيل
- مناسب للتحديثات البسيطة

### 4. `git-update.bat` - نسخة Windows Batch
```cmd
git-update.bat
```
- نفس وظيفة PowerShell لكن لـ Command Prompt

## 🎯 كيفية الاستخدام

### للمرة الأولى:
1. أنشئ repository جديد على GitHub
2. شغل: `.\setup-github.ps1`
3. أدخل رابط repository

### للتحديثات المستقبلية:
- **تحديث شامل**: `.\git-update.ps1`
- **تحديث سريع**: `.\quick-update.ps1`

## ⚡ نصائح سريعة

- استخدم `quick-update.ps1` للتحديثات البسيطة
- استخدم `git-update.ps1` للتحديثات المهمة
- السكريبتات تتعامل مع main/master تلقائياً
- جميع السكريبتات تدعم اللغة العربية

## 🔧 متطلبات

- Git مثبت على النظام
- PowerShell (للسكريبتات .ps1)
- Command Prompt (للسكريبتات .bat)

## 📞 في حالة المشاكل

1. تأكد من تثبيت Git
2. تأكد من صحة رابط repository
3. تأكد من صلاحيات الكتابة على repository
