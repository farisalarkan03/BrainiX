# 🚀 BRAINIX Deployment Guide

Panduan lengkap untuk men-deploy aplikasi BRAINIX ke platform online menggunakan Vercel.

## 📋 Prasyarat

- Akun Git (GitHub, GitLab, atau Bitbucket) - **GRATIS**
- Akun Vercel - **GRATIS** di [vercel.com](https://vercel.com)
- File `.env` dengan Firebase credentials yang valid

---

## 🎯 Metode 1: Deploy via Git (Recommended)

### Step 1: Push ke Git Repository

1. **Inisialisasi Git** (jika belum):
   ```bash
   cd "d:\PROJEXT DEZIGN\BRAINIX PROJECT\BRAINIX"
   git init
   ```

2. **Buat repository di GitHub/GitLab** dan copy URL-nya

3. **Push code ke repository**:
   ```bash
   git add .
   git commit -m "Initial commit - BRAINIX Project"
   git branch -M main
   git remote add origin <YOUR_REPOSITORY_URL>
   git push -u origin main
   ```

### Step 2: Import Project ke Vercel

1. **Login ke Vercel**: Buka [vercel.com](https://vercel.com) dan sign in dengan GitHub/GitLab
2. **Import Project**: 
   - Klik tombol "Add New..." → "Project"
   - Pilih repository BRAINIX Anda
   - Klik "Import"

### Step 3: Configure Environment Variables

Di halaman konfigurasi project Vercel:

1. Expand bagian **"Environment Variables"**
2. Tambahkan semua variabel dari file `.env` Anda:

   | Name | Value |
   |------|-------|
   | `VITE_FIREBASE_API_KEY` | `<your_api_key>` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `<your_project_id>.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `<your_project_id>` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `<your_project_id>.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `<your_sender_id>` |
   | `VITE_FIREBASE_APP_ID` | `<your_app_id>` |
   | `VITE_FIREBASE_MEASUREMENT_ID` | `<your_measurement_id>` |

3. **Klik "Deploy"**

### Step 4: Selesai! 🎉

- Vercel akan otomatis build dan deploy aplikasi Anda
- Setelah selesai, Anda akan mendapat URL seperti: `https://brainix.vercel.app`
- Setiap kali Anda push ke Git, Vercel akan otomatis re-deploy

---

## 🎯 Metode 2: Deploy Manual (Tanpa Git)

### Step 1: Build Project Lokal

```bash
cd "d:\PROJEXT DEZIGN\BRAINIX PROJECT\BRAINIX"
npm run build
```

Folder `dist` akan berisi production build.

### Step 2: Deploy ke Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   # ... tambahkan semua env variables
   ```

5. **Production Deploy**:
   ```bash
   vercel --prod
   ```

---

## 🔧 Konfigurasi Firebase (Penting!)

### Whitelist Domain Vercel di Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project BRAINIX Anda
3. Ke **Authentication** → **Settings** → **Authorized domains**
4. Tambahkan domain Vercel Anda:
   - `<your-project>.vercel.app`
   - Dan custom domain jika ada

### CORS Configuration (jika menggunakan Storage)

Di Firebase Storage Rules, pastikan domain Vercel di-whitelist.

---

## 🌐 Custom Domain (Opsional)

Jika Anda punya domain sendiri (misal: `brainix.com`):

1. Di dashboard Vercel, buka project → **Settings** → **Domains**
2. Klik **"Add"** dan masukkan domain Anda
3. Ikuti instruksi untuk set DNS records di domain registrar Anda
4. Tunggu propagasi DNS (biasanya 5-10 menit)

---

## 🧪 Testing Deployment

Setelah deployment berhasil, test fitur-fitur berikut:

- [ ] **Authentication**: Login & Signup berfungsi
- [ ] **Admin Dashboard**: Akses dengan developer credentials
- [ ] **Content Management**: Create, edit, delete chapters & questions
- [ ] **QR Code Generation**: Generate dan scan QR codes
- [ ] **Boss Challenge**: Players dapat mengakses challenges
- [ ] **PWA**: Install aplikasi ke home screen di mobile
- [ ] **Responsive**: Test di mobile, tablet, dan desktop
- [ ] **Firebase**: Data sync real-time berfungsi

---

## 🐛 Troubleshooting

### ❌ Build Failed

**Problem**: Build error saat deployment

**Solution**:
1. Cek log error di Vercel dashboard
2. Pastikan build berhasil di lokal: `npm run build`
3. Pastikan semua dependencies terinstall: `npm install`

### ❌ Firebase Connection Error

**Problem**: "Firebase not initialized" atau connection errors

**Solution**:
1. Verifikasi environment variables di Vercel sudah benar
2. Pastikan domain Vercel sudah masuk authorized domains di Firebase
3. Cek Firebase project status di console

### ❌ Routing 404 Error

**Problem**: Direct access ke route seperti `/admin` gives 404

**Solution**:
- File `vercel.json` sudah menghandle SPA routing
- Pastikan file tersebut ada di root project

### ❌ Environment Variables Tidak Terdeteksi

**Problem**: App tidak bisa connect ke Firebase

**Solution**:
1. Pastikan semua env variables diawali dengan `VITE_`
2. Re-deploy setelah menambah env variables
3. Vercel membutuhkan rebuild setelah env changes

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- Secara otomatis tersedia di dashboard Vercel
- Monitor performance, page views, dan errors

### Firebase Analytics
- Sudah terintegrasi via `VITE_FIREBASE_MEASUREMENT_ID`
- Lihat data di Firebase Console → Analytics

---

## 🔄 Update & Maintenance

### Auto-Deploy (Git Method)
Setiap push ke branch `main`:
```bash
git add .
git commit -m "Update: description"
git push
```
Vercel otomatis detect dan deploy.

### Manual Re-deploy
Di Vercel dashboard → Deployments → Pilih deployment → "Redeploy"

---

## 💡 Tips & Best Practices

1. **Environment Variables**: Jangan pernah commit file `.env` ke Git
2. **Preview Deployments**: Setiap branch/PR dapat preview URL sendiri
3. **Rollback**: Vercel simpan semua deployment history, bisa rollback kapan saja
4. **Performance**: Vercel menyediakan CDN global, app Anda akan cepat worldwide
5. **SSL**: HTTPS otomatis enabled dan gratis
6. **Custom Headers**: Sudah dikonfigurasi untuk optimal caching di `vercel.json`

---

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **BRAINIX Issues**: Buat issue di Git repository

---

**🎉 Selamat! Aplikasi BRAINIX Anda sekarang online dan dapat diakses dari mana saja!**
