# Panduan AI: Pembuatan Admin App

Fokus utama: Membangun Panel B2B God-Mode (Admin Dashboard).

## Aturan Fundamental (Absolute Law)
Aplikasi Admin BUKAN untuk mengurusi uang transaksi jualan pulsa atau mengurusi kenapa deposit pelanggan telat, melainkan murni infrastruktur **Penyewaan SaaS**. Admin Apps hanya menangani pengelolaan `Store` (pendaftaran/pembekuan Seller) dan pengelolaan `Subscription Plan`.

## Fase 1: Autentikasi & Akses
1.  **Secure Login**: Akses khusus untuk Admin (`SUPER_ADMIN`, `ADMIN_STAFF`).
2.  **Admin Profile**: Pengaturan akun.

## Fase 2: Manajemen Staff
1.  **Manajemen Jabatan (Roles)**: Mengelola daftar jabatan dan mengatur perizinan (permissions) dinamis (*read/write/delete*) untuk manajemen rute panel Admin.
2.  **Staff Accounts**: Pembuatan akun staf admin dan penetapan jabatan.

## Fase 3: Manajemen Seller & Tenant
1.  **Data Seller**: Pemantauan daftar seller (Otomatis disetujui setelah sign-up).
2.  **Kontrol Status**: Pembekuan (`SUSPEND`) akun seller jika melanggar Syarat dan Ketentuan, yang berdampak pada mode "Maintenance" di toko milik mereka.
3.  **Deposit Seller**: Monitoring arus masuk uang dari Seller yang mendeposit (via Payment Gateway Induk platform) yang tujuannya untuk membayar biaya platform bulanan/tahunan.

## Fase 4: Manajemen Platform & Berlangganan (SaaS)
1.  **Master Platform**: Setup tipe-tipe Platform yang dapat disewa Seller (Web App, Android, iOS APK) beserta setting tarif perilisannya.
2.  **Subscription Tier Management**: Mengatur limitasi teknis, harga fitur, dan siklus tagihan tier langganan untuk Seller.

## Fase 5: Manajemen Store & Laporan (Read-Only)
1.  **Data Store**: Melihat agregat domain/subdomain toko yang hidup di bawah naungan platform.
2.  **Log Aktivitas**: Peninjauan performa API secara agregat global untuk *engineering monitoring*.

---
**Status**: Siap untuk dieksekusi berdasarkan fase. Saat memulai tugas, AI **HARUS** mendeklarasikan fase mana yang sedang dikerjakan.
