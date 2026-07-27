# 🏢 HRIS - Employee Management System

Sistem Informasi Sumber Daya Manusia (**Human Resource Information System / HRIS**) modern yang dibangun untuk mengelola data karyawan, presensi/kehadiran, pengajuan cuti, penggajian (payroll), pengumuman internal, serta analitik HR secara efisien dan terintegrasi.

---

## 🚀 Fitur Utama

### 👥 1. Manajemen Karyawan (Employee Management)
- Kelola data karyawan lengkap (Nama, Email, Jabatan, Departemen, Status Kerja, No. Telepon, Foto Profil).
- Fitur role-based access control ( **ADMIN** & **EMPLOYEE** ).
- Status pekerjaan yang fleksibel (*Tetap, Kontrak, Magang*).
- Upload foto profil karyawan menggunakan **UploadThing**.

### 🏢 2. Manajemen Departemen (Department Management)
- Pengelompokan karyawan berdasarkan divisi/departemen perusahaan.
- Monitoring jumlah anggota di setiap departemen.

### ⏱️ 3. Presensi & Pengaturan Jam Kerja (Attendance & Schedule)
- Fitur **Clock-in / Clock-out** presensi harian secara real-time.
- Pencatatan otomatis status kehadiran (*Hadir, Terlambat, Alfa*).
- Pengaturan batas jam kerja dan toleransi keterlambatan (*Late Tolerance*).
- Ekspor rekapitulasi presensi ke format **Excel (.xlsx)**.

### 🏖️ 4. Manajemen Cuti & Izin (Leave Management)
- Karyawan dapat mengajukan permohonan cuti dengan alasan dan rentang tanggal.
- Admin dapat meninjau, menyetujui, atau menolak permohonan cuti (*Pending, Disetujui, Ditolak*).
- Ekspor data riwayat cuti ke format **Excel**.

### 💰 5. Penggajian (Payroll System)
- Perhitungan slip gaji bulanan (Gaji Pokok, Tunjangan, Potongan, & Gaji Bersih / *Net Salary*).
- Pengelolaan status pembayaran gaji (*Draft / Paid*).
- Generasi slip gaji digital interaktif.

### 📢 6. Pengumuman Internal (Announcements)
- Publikasi pengumuman penting perusahaan kepada seluruh staf/karyawan.

### 📊 7. HR Analytics & Dashboard Interactive
- Ringkasan statistik cepat (Total Karyawan, Departemen, Kehadiran Hari Ini, Permohonan Cuti).
- Visualisasi grafik interaktif menggunakan **Chart.js** untuk tren kehadiran dan distribusi departemen.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

* **Frontend & Backend Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **UI Library & Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), & [Lucide Icons](https://lucide.dev/)
* **Database & ORM:** [PostgreSQL](https://www.postgresql.org/), [Prisma ORM 7](https://www.prisma.io/), & [Kysely](https://kysely.dev/)
* **Autentikasi & Keamanan:** [Better Auth](https://www.better-auth.com/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
* **File Upload:** [UploadThing](https://uploadthing.com/)
* **Grafik & Analitik:** [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
* **Ekspor Data:** [XLSX (SheetJS)](https://sheetjs.com/)
* **Form & Validasi:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 📁 Struktur Direktori Proyek

```text
employee-management-system/
├── app/                      # Next.js App Router (Halaman, API Routes, & Server Actions)
│   ├── (auth)/               # Halaman Autentikasi (Login)
│   ├── actions/              # Server Actions (Employees, Attendance, Leave, Payroll, etc.)
│   ├── api/                  # API endpoints (Auth, UploadThing)
│   └── dashboard/            # Halaman-halaman Dashboard Utama
├── components/               # Komponen UI Reusable
│   ├── announcements/        # Komponen Pengumuman
│   ├── attendance/           # Komponen Presensi
│   ├── departments/          # Komponen Departemen
│   ├── employees/            # Komponen Karyawan
│   ├── leaves/               # Komponen Cuti
│   ├── payroll/              # Komponen Payroll & Slip Gaji
│   ├── settings/             # Komponen Pengaturan Jam Kerja & Profil
│   └── ui/                   # Komponen Base UI (Shadcn/Radix)
├── lib/                      # Helper Utilities, Validasi Zod, Auth Config, Prisma Instance
├── prisma/                   # Prisma Schema & Database Migrations / Seed script
├── utils/                    # Utility Tambahan (Uploadthing Client)
└── public/                   # Static Assets
```

---

## ⚡ Cara Menjalankan Proyek (Getting Started)

### 1. Prasyarat (Prerequisites)
Pastikan kamu telah menginstall:
* [Node.js](https://nodejs.org/) (v18+ direkomendasikan)
* [pnpm](https://pnpm.io/) / npm / yarn
* Database [PostgreSQL](https://www.postgresql.org/)

### 2. Clone & Install Dependensi
```bash
git clone https://github.com/BayuWinataa/hris-system.git
cd employee-management-system
pnpm install
```

### 3. Konfigurasi Environment Variable (`.env`)
Buat file `.env` pada direktori utama proyek dan sesuaikan variabel konfigurasi berikut:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hris_db?schema=public"
BETTER_AUTH_SECRET="your-super-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# UploadThing Credentials (untuk fitur upload foto profil)
UPLOADTHING_TOKEN="your_uploadthing_token"
```

### 4. Setup Database & Migration
Jalankan migrasi Prisma untuk membuat tabel-tabel di database:

```bash
npx prisma migrate dev
```

*(Opsional)* Jalankan seeder data awal jika tersedia:
```bash
npx tsx prisma/seed.ts
```

### 5. Jalankan Server Development
```bash
pnpm dev
```

Buka peramban (browser) dan akses [http://localhost:3000](http://localhost:3000).

---

## 📝 Lisensi
Proyek ini dibuat untuk keperluan pengelolaan internal dan pengembangan aplikasi HRIS.
