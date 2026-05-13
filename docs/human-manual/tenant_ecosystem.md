# Fitur: Tenant & Ekosistem

Dokumen ini mendefinisikan hubungan antara entitas Admin, Seller, dan Store dalam ekosistem QianPulsa.

## 1. Konsep Tenant & Toko
Platform berbasis multitenancy. Satu Seller dapat memiliki banyak Toko (Store) dengan identitas mandiri. Satu Toko (Store) hanya dapat memiliki satu domain atau subdomain.

## 2. Kapabilitas per Aplikasi

### [Admin App]
- Memantau ekosistem secara makro (Tenant Overview).
- Mengelola akun Seller (B2B).
- Memantau operasional dan status toko (Store).
- Melacak transaksi finansial lintas toko (Audit).

### [Seller App]
- Mengelola Toko (Buka/Tutup, Konfigurasi Identitas Toko).
- Konfigurasi API Integration untuk masing-masing Toko (PPOB & Payment Provider).
- Manajemen Staf Toko (SellerStaff).

### [Store App]
- Menampilkan halaman Storefront masing-masing berdasarkan domain/subdomain toko.

## 3. Data Terkait
- `Tenant` (Organization)
- `Seller` (Account Owner)
- `Store` (Operational Unit)
- `SellerStaff`
