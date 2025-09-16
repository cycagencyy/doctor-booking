# 📤 رفع المشروع على GitHub

## 🎯 الخطوات:

### 1. إنشاء حساب GitHub (إذا لم يكن لديك):
1. اذهب إلى: https://github.com
2. اضغط "Sign up"
3. سجل بحساب Gmail
4. اختر username مناسب

### 2. إنشاء repository جديد:
1. في GitHub، اضغط "New repository"
2. اكتب اسم المشروع: `doctor-booking-system`
3. اختر "Public" (مجاني)
4. **لا تضع علامة** على "Add a README file"
5. اضغط "Create repository"

### 3. رفع الملفات:

#### الطريقة الأولى: استخدام GitHub Desktop (الأسهل)
1. حمل GitHub Desktop من: https://desktop.github.com
2. سجل دخول بحساب GitHub
3. اضغط "Clone a repository from the Internet"
4. اختر الـ repository الذي أنشأته
5. اسحب جميع ملفات المشروع إلى مجلد الـ repository
6. اكتب رسالة: "Initial commit - Doctor booking system"
7. اضغط "Commit to main"
8. اضغط "Push origin"

#### الطريقة الثانية: استخدام Git Command Line
```bash
# 1. افتح Command Prompt في مجلد المشروع
cd C:\Users\MOHAMMED ELBADRY\Desktop\doc

# 2. ابدأ Git repository
git init

# 3. أضف جميع الملفات
git add .

# 4. اكتب رسالة commit
git commit -m "Initial commit - Doctor booking system"

# 5. اربط بالـ repository على GitHub
git remote add origin https://github.com/YOUR_USERNAME/doctor-booking-system.git

# 6. ارفع الملفات
git push -u origin main
```

#### الطريقة الثالثة: رفع مباشر من GitHub
1. في صفحة الـ repository، اضغط "uploading an existing file"
2. اسحب جميع ملفات المشروع
3. اكتب رسالة commit
4. اضغط "Commit changes"

### 4. إعدادات مهمة:

#### إضافة .gitignore:
أنشئ ملف `.gitignore` في مجلد المشروع:
```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
dist/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
```

## 🔗 ربط GitHub مع Vercel و Railway:

### 1. Vercel:
1. في Vercel، اضغط "New Project"
2. اختر "Import Git Repository"
3. اختر الـ repository من GitHub
4. اختر مجلد `client` كـ Root Directory
5. اضغط "Deploy"

### 2. Railway:
1. في Railway، اضغط "New Project"
2. اختر "Deploy from GitHub repo"
3. اختر الـ repository من GitHub
4. اختر مجلد `server` كـ Root Directory
5. اضغط "Deploy"

## ✅ النتيجة:
- مشروعك الآن على GitHub
- يمكن لأي شخص رؤيته
- يمكنك تحديثه بسهولة
- يمكن ربطه بخدمات النشر

## 🎉 مبروك!
مشروعك الآن متاح للجميع على GitHub!

