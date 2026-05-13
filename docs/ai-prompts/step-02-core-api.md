# 🚀 Roadmap: Core App (Backend & API Engine)

**PENTING UNTUK AI:** Baca 📋 [Standar Alur Kerja & Prasyarat Coding](/docs/ai-workflow-standard.md) sebelum memulai pengerjaan fase manapun.

Fokus utama: Membangun ekosistem backend yang stabil, aman, modular, dan handal secara finansial.

---

## 📅 Fase 1: Fondasi & Basis Data
*Fase ini menentukan stabilitas seluruh aplikasi.*
1.  **Environment Setup**: Konfigurasi Fastify, TypeScript, dan Prisma.
2.  **Database Migration**: Eksekusi `prisma migrate` berdasarkan `/docs/architecture/database-schema.md`.
3.  **Basic Seeding**: Membuat data Super Admin, Kategori awal, dan Paket Langganan Global.
4.  **Security Layer**: Implementasi JWT Auth, Password Hashing, dan Middleware Rate Limiting.

## 📅 Fase 2: Integrasi Vendor & Gateway (Multitenant)
*Fase ini membangun *mesin* penghubung ke pihak luar menggunakan parameter dinamis.*
1.  **PPOB Provider Engine**: Implementasi *logic switch* vendor. Kredensial (API Key, Secret) **wajib** diambil secara dinamis dari tabel `SellerApiSetting` berdasarkan `sellerId`.
2.  **Digiflazz & Vendor Engine**: Implementasi fungsionalitas (cek saldo, transaksi) yang menerima parameter kredensial dinamis.
3.  **Payment Gateway (Xendit/Midtrans)**: Implementasi penagihan dan webhook yang mendukung integrasi akun pribadi seller.
4.  **Notification Gateway**: Integrasi Fonnte & Gmail API (Kredensial per-seller).

## 📅 Fase 3: Logika Transaksi & Multitenancy
*Fase ini mengelola alur bisnis utama dan isolasi data.*

### Fase 3a: Core Multitenancy & Domain Management
- **Fokus**: Identifikasi dan isolasi toko secara dinamis.
- **Rute Utama**: `/api/v1/tenant/*` (Setup toko baru, mapping domain, konfigurasi identitas toko, konfigurasi *markup* harga).

### Fase 3b: Seller Content Management (Product, Stock, Category)
- **Fokus**: Operasional penuh untuk Seller App (B2B Dashboard).
- **Rute Utama**: 
  - `/api/v1/seller/products/*` (CRUD produk, harga, deskripsi)
  - `/api/v1/seller/categories/*` (Manajemen kategori spesifik toko)
  - `/api/v1/seller/stocks/*` (Manajemen stok barang)

### Fase 3c: Storefront & Customer Purchasing (Store App - B2C)
- **Fokus**: Operasional Storefront bagi konsumen akhir (PWA/Mobile).
- **Alur Pengambilan Produk (Katalog)**:
  1. Store mengambil kategori Prabayar dan Pascabayar sekaligus.
  2. Store mengambil Brand dari Kategori yang dipilih.
  3. Store mengambil Produk dari Kategori dan Brand yang dipilih.
- **Rute Utama**:
  - `/api/v1/store/catalog/*` (Listing produk publik per toko)
  - `/api/v1/store/cart/*` (Manajemen keranjang belanja)
  - `/api/v1/store/checkout/*` (Inisialisasi pembayaran)

### Fase 3d: Atomic Transaction & Order Processing
- **Fokus**: Eksekusi transaksi, integrasi *Atomic Transaction* (ACID), dan *Order Lifecycle*.
- **Rute Utama**:
  - `/api/v1/orders/*` (Pembuatan pesanan, status *tracking*, pembatalan)
  - `/api/v1/transactions/*` (Debit/Credit saldo, log transaksi, mekanisme *refund*)

## 📅 Fase 4: Reliabilitas & Integritas Finansial
*Fase ini memastikan sistem tahan terhadap kegagalan.*
1.  **Auto-Refund Mechanism**: Logika pengembalian saldo otomatis jika vendor gagal memproses pesanan.
2.  **Transaction Reconciliation**: Sistem pengecekan status transaksi antara DB lokal dan Vendor secara berkala (Cron Job).
3.  **Audit Logging**: Pencatatan log setiap perubahan saldo atau data sensitif.

## 📅 Fase 5: Monitoring & Optimasi (Maintenance)
1.  **Performance Tuning**: Optimasi query Prisma & caching (Redis).
2.  **Monitoring & Error Reporting**: Integrasi logging error ke *Support-API* jika terjadi kegagalan sistem.

---
**Status**: Siap untuk dieksekusi berdasarkan fase. Saat memulai tugas, AI **HARUS** mendeklarasikan fase mana yang sedang dikerjakan.

**ATURAN EKSEKUSI (PENTING)**:
1. Kerjakan **HANYA SATU FASE** dari daftar di atas.
2. Setelah selesai, **EDIT DOKUMEN INI** (tambahkan tanda `[x]` atau `(SELESAI)` pada nama fase yang berhasil diselesaikan) untuk mencatat progress.
3. **BERHENTI SEPENUHNYA** dan berikan laporan selesainya fase tersebut kepada User.
4. Tunggu persetujuan User ("Lanjut ke Fase X") sebelum menulis kode untuk fase berikutnya.

**Prasyarat Pekerjaan**:
- Pastikan semua file di `/docs/architecture/` sudah dipahami sebelum menyentuh kode.
- Selalu merujuk pada `/docs/architecture/database-schema.md` sebelum melakukan perubahan skema.

