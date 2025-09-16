# Dockerfile للنشر الاحترافي
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package.json
COPY server/package*.json ./
COPY client/package*.json ./client/

# تثبيت dependencies
RUN npm install
RUN cd client && npm install

# نسخ الكود
COPY server/ ./
COPY client/ ./client/

# بناء العميل
RUN cd client && npm run build

# تعيين متغيرات البيئة
ENV NODE_ENV=production
ENV PORT=5000

# فتح المنفذ
EXPOSE 5000

# تشغيل الخادم
CMD ["node", "index.js"]