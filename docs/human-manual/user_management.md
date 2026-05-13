# Fitur: Manajemen Pengguna & Autentikasi

Dokumen ini mendefinisikan peran pengguna dan mekanisme akses dalam sistem.

## 1. Peran Pengguna (Roles)
- **SUPER_ADMIN**: Panel Kontrol God-Mode (Admin App).
- **SELLER**: Pemilik Toko, konfigurasi API/Markup (Seller App).
- **SELLER_STAFF**: Staf toko, hak terbatas (Seller App).
- **CUSTOMER**: Pelanggan toko (Store App).

## 2. Kapabilitas per Aplikasi

- **Admin App**: Autentikasi `SUPER_ADMIN`.
- **Seller App**: Autentikasi `SELLER` atau `SELLER_STAFF`. Email staf unik/independen.
- **Store App**: Autentikasi `CUSTOMER`. Untuk akses penuh (transaksi), wajib login. Pengunjung yang belum login hanya dapat melihat landing page toko dan informasi publik yang disediakan oleh Seller.

## 3. Data Terkait
- `User` (Global)
- `Admin`
- `Seller`
- `SellerStaff`
- `Customer`
