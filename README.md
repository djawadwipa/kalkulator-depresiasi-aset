# Kalkulator Depresiasi Aset Perusahaan

Aplikasi Android/PWA berbasis React + TypeScript + Vite + Capacitor yang dibuat dari struktur workbook Excel **Kalkulator Depresiasi Aset Perusahaan.xlsx**.

Aplikasi ini menghitung:

- Dashboard eksekutif aset
- Input data aset
- Kalkulator depresiasi metode garis lurus
- Jadwal depresiasi bulanan
- Jadwal depresiasi tahunan
- Register aset
- Analisis nilai buku
- Master data
- Panduan penggunaan

Logo yang sudah terpasang:

- `public/assets/logo-horizontal.png` untuk dashboard, sidebar, header, dan branding aplikasi.
- `public/assets/icon-square.png` untuk favicon, PWA icon, app icon, dan splash screen.
- `resources/icon.png` dan `resources/splash.png` untuk Android icon/splash melalui Capacitor Assets.

---

## 1. Menjalankan aplikasi di Termux / lokal

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts openjdk-17 -y

cd storage/downloads/kalkulator-depresiasi-aset
npm install
npm run dev
```

Buka alamat lokal yang muncul dari Vite.

---

## 2. Build web/PWA

```bash
npm run build
```

Output web akan berada di folder:

```text
dist/
```

---

## 3. Upload project ke GitHub via Termux

Ganti `USERNAME`, `NAMA-REPOSITORY`, dan email GitHub sesuai akun Anda.

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts openjdk-17 -y

git config --global user.name "Nama Anda"
git config --global user.email "emailgithubanda@example.com"

cd storage/downloads/kalkulator-depresiasi-aset

git init
git add .
git commit -m "Initial commit Kalkulator Depresiasi Aset"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPOSITORY.git
git push -u origin main
```

Jika diminta password saat `git push`, gunakan **GitHub Personal Access Token**, bukan password akun biasa.

---

## 4. Build APK otomatis di GitHub Actions

Setelah project berhasil di-push:

1. Buka repository GitHub.
2. Masuk tab **Actions**.
3. Pilih workflow **Android Debug APK**.
4. Tunggu sampai status workflow hijau.
5. Buka run terbaru.
6. Scroll ke bagian **Artifacts**.
7. Download file:

```text
Kalkulator-Depresiasi-Aset-debug.apk
```

---

## 5. Install APK di Android

1. Download APK dari GitHub Actions.
2. Buka file APK di HP Android.
3. Izinkan **Install from unknown sources** jika diminta.
4. Setelah install, ikon aplikasi akan memakai logo kotak.
5. Saat aplikasi dibuka, splash screen akan memakai logo kotak.
6. Dashboard dan sidebar akan menampilkan logo horizontal.

---

## 6. Troubleshooting

### APK blank setelah install

Pastikan file berikut benar:

```ts
// vite.config.ts
base: './'
```

Dan:

```ts
// capacitor.config.ts
webDir: 'dist'
```

Workflow sudah memakai konfigurasi tersebut.

### Logo tidak muncul

Pastikan file ada di:

```text
public/assets/logo-horizontal.png
public/assets/icon-square.png
resources/icon.png
resources/splash.png
```

### Artifact tidak muncul

Cek tab **Actions** lalu buka log build. Pastikan step **Upload APK artifact** berhasil.

### Build Gradle gagal

Workflow sudah memakai Java 17. Jika masih gagal, buka log error Gradle di tab Actions dan cek dependency Android yang gagal diunduh.

### Push GitHub gagal dari Termux

Gunakan GitHub Personal Access Token. Jangan gunakan password biasa.

---

## 7. Catatan rumus depresiasi

Metode utama yang digunakan adalah **Garis Lurus**.

```text
Umur Ekonomis Bulan = Umur Ekonomis Tahun × 12
Dasar Depresiasi = Harga Beli - Nilai Residu
Depresiasi Tahunan = Dasar Depresiasi / Umur Ekonomis Tahun
Depresiasi Bulanan = Dasar Depresiasi / Umur Ekonomis Bulan
Akumulasi Depresiasi = Depresiasi Bulanan × Jumlah Bulan Berjalan
Nilai Buku = Harga Beli - Akumulasi Depresiasi
Nilai Buku minimum = Nilai Residu
```

Status otomatis:

- **Aktif**: aset masih sehat.
- **Mendekati Habis Umur Ekonomis**: rasio depresiasi minimal 80%.
- **Fully Depreciated**: nilai buku sudah mencapai nilai residu.
- **Dijual/Rusak/Dihapuskan**: mengikuti status manual.
- **Bernilai Tinggi**: nilai buku minimal Rp100.000.000.

---

## 8. Struktur file penting

```text
.github/workflows/android-debug-apk.yml
public/assets/logo-horizontal.png
public/assets/icon-square.png
public/manifest.webmanifest
public/service-worker.js
resources/icon.png
resources/splash.png
src/data/sampleAssets.ts
src/data/masterData.ts
src/utils/depreciation.ts
src/pages/Dashboard.tsx
src/pages/InputDataAset.tsx
src/pages/KalkulatorDepresiasi.tsx
src/pages/JadwalBulanan.tsx
src/pages/JadwalTahunan.tsx
src/pages/RegisterAset.tsx
src/pages/AnalisisNilaiBuku.tsx
capacitor.config.ts
vite.config.ts
```
