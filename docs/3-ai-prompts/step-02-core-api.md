# Panduan AI: Core API & Database (Layanan Pusat)

Fokus utama: Membangun satu-satunya Backend Service yang menangani semua logika terpusat untuk Admin, Seller, Store, dan Support.

## Aturan Fundamental (Absolute Law)
Backend bertindak sebagai otak B2B2C. Karena `Seller` memiliki kredensial API (Payment Gateway & PPOB) mereka **sendiri-sendiri**, Core API WAJIB menggunakan abstraksi/factory pattern untuk memuat kredensial API secara dinamis berdasarkan ID Toko (`storeId` / `sellerId`) yang sedang diakses. JANGAN PERNAH me-load kredensial dari `.env` untuk transaksi Store, `.env` hanya untuk pembayaran langganan (Subscription) ke Admin!

## Fase 1: Database & ORM Setup
1.  **Prisma Initialization**: Membuat skema database menggunakan postgreSQL (Prisma).
2.  **Auth & IAM**: Mendefinisikan model `User`, `Staff`, `Customer`, beserta relasi *Role/Permissions* dinamik (khusus Admin).
3.  **Tenant Isolation**: Semua entri transaksional (`StoreOrder`, `CustomerDeposit`) WAJIB terhubung erat dengan `storeId`.

## Fase 2: Gateway Layer & Layanan Eksternal
1.  **Dynamic Provider Service**: Layanan yang menarik API Key PPOB dan Payment Gateway dari tabel `SellerApiSetting`.
2.  **Callback / Webhook Handler**: 
    - `POST /api/webhooks/payment`: Menangkap notifikasi dari Payment Gateway (Fazz/Tripay dll) untuk update transaksi sukses/gagal.
    - `POST /api/webhooks/ppob`: Menangkap notifikasi dari Digiflazz jika status pending berubah.
3.  **System Polling / Queue**: Job otomatis untuk mengecek status transaksi berulang kali bagi transaksi `PENDING` yang telat merespon.

## Fase 3: Rute API Dasar
1.  **Auth Routes**: `/api/auth/*` (Login Admin, Seller, dll).
2.  **B2B Routes (Admin & Seller)**: `/api/admin/*` dan `/api/seller/*`.
3.  **B2C Routes (Storefront)**: `/api/store/*` (Harus menggunakan pengecekan *Origin Domain* untuk mendeteksi ID Toko secara otomatis).
