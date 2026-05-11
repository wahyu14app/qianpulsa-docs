# 🚀 Roadmap: Core App (Backend & API Engine)

Fokus utama: Membangun fondasi sistem, manajemen database, keamanan, dan integrasi vendor PPOB/Payment.

## Fase 1: Fondasi & Basis Data
1.  **Environment Setup**: Konfigurasi Express, TypeScript, dan Prisma.
2.  **Database Migration**: Eksekusi `prisma migrate` berdasarkan `database-schema.md`.
3.  **Basic Seeding**: Membuat data Super Admin, Kategori awal, dan Paket Langganan Global.
4.  **Security Layer**: Implementasi JWT Auth, Password Hashing (Argon2/Bcrypt), dan Rate Limiting.

## Fase 2: Integrasi Vendor (Gateway Multitenant)
1.  **PPOB Provider Engine**: Membangun *logic switch* vendor. Sistem **TIDAK BOLEH** hardcode API Key di `.env`. Kredensial wajib diambil secara dinamis dari tabel `SellerApiSetting` berdasarkan `sellerId` pemilik transaksi.
2.  **Digiflazz Integration**: Implementasi fungsionalitas (cek saldo, transaksi) yang menerima parameter kredensial dinamis.
3.  **Payment Gateway (Xendit/Midtrans)**: Implementasi penagihan dan webhook yang mendukung integrasi akun pribadi Seller (dari Database).
4.  **Notification Gateway**: Integrasi Fonnte & Gmail API (Kredensial per-seller).

## Fase 3: Logika Transaksi & Multitenancy
1.  **Tenant Middleware**: Logika identifikasi toko berdasarkan domain/subdomain.
2.  **Atomic Transaction**: Memastikan mutasi saldo (Debit/Credit) bersifat ACID guna mencegah *double spending*.
3.  **Auto-Refund Mechanism**: Logika pengembalian saldo otomatis jika vendor gagal memproses pesanan.

---
**Status Selesai**: API terdokumentasi lengkap di `/docs/request-response.md` dan siap dikonsumsi oleh aplikasi Frontend.
