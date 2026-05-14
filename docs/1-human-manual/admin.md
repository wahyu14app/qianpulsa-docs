# Ekosistem: Admin (Platform Induk)

## 1. Ikhtisar & Peran
Dokumen ini menjelaskan alur, kapabilitas, dan tanggung jawab entitas Admin dalam ekosistem QianPulsa. Admin berfokus sebagai pengelola infrastruktur dan pengawas (*monitoring*), bukan operator teknis toko.

## 2. Alur Kerja Utama (*Key Workflows*)
- **Auth & Role Management**: `SUPER_ADMIN` mengelola daftar jabatan (Roles) dan akses izin berdasarkan *route access*. Mengelola pembuatan dan penugasan akun staf admin.
- **Monitoring Entitas**: Memantau daftar Seller, Toko, dan Customer (Read-only).
- **Manajemen Operasional**: Mengelola **Subscription Plan** (Tingkatan fitur/Tier langganan) dan **Platform Media** (Media distribusi produk: Web/Android/iOS) serta memonitor deposit Seller.

## 3. Data & Batasan (*Constraints*)
- **Entitas Utama**: `Admin`, `AdminStaff`, `PlatformType`, `SubscriptionPlan`, `SystemTask`.
- **Definisi Mutlak**: 
  - **Platform (Media Distribusi)**: Medium di mana toko akan ditampilkan (Web, Android, iOS). Seller wajib membeli rilis media ini agar.
  - **Subscription Plan (Paket Langganan)**: Tingkatan level fitur operasional toko (misal: Starter, Pro, Enterprise). Ini dibeli *setelah* toko memiliki wujud Platform.
- **Batasan**: Platform tidak menahan uang transaksi B2C; dana masuk ke Payment Gateway Seller. Admin memonitor deposit Seller untuk fee langganan/platform saja.

## 4. Ketetapan Sistem (*System Rulings*)
- *Apa wewenang absolut dari `SUPER_ADMIN` yang tidak boleh diakses oleh staf biasa?* -> Mengelola dan membuat konfigurasi *Roles*, membuat akun Staf Admin, melakukan setup **Platform Media** dasar (Web/iOS/Android), dan mengatur kredensial Payment Gateway Induk plafrom.
- *Dalam manajemen jabatan, apakah daftar *permissions* bersifat dinamis (di-DB) atau *hardcoded* dalam sistem?* -> Dinamis dan disimpan di dalam Database (array routing access/permissions, contoh `["read:/sellers", "readWrite:/platform"]`).
- *Apa yang terjadi jika langganan Seller kedaluwarsa? Apakah toko ditutup paksa sementara?* -> **Ya**. Front-end *Store App* beralih ke Mode Maintenance ("Toko Sedang Tutup"). Menu operasional di *Seller App* akan terkunci (ter-lock) kembali ke mode *Onboarding* di mana mereka hanya bisa mengakses menu Deposit dan Pembelian Paket.
- *Apakah ada *task* rekonsiliasi data selain interaksi API pihak ketiga?* -> **Ya**. Terdapat *Cron Job* reguler di sisi Core API untuk mengecek pemutusan langganan (*Subscription Expired*) dan mengeksekusi reset transaksi yang terlalu lama *stuck/pending*.
