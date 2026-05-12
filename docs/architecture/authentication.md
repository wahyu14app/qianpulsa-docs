# Core App: Authentication & Authorization

Pusat Keamanan & Autentikasi dalam **Core App** dipecah menjadi 3 lapis sistem tiket otorisasi (JWT). Core App menerbitkan semua JWT Token untuk mengautentikasi tiap entitas terpisah, sesuai dengan jalur aplikasi fron-end (Admin-App, Seller-App, Store-App).

Setiap payload JWT _wajib_ disisipi `role` agar token tidak dapat dipakai silang antar aplikasi.

## 1. Autentikasi untuk `admin-app`

Aplikasi God-Mode ini memegang kendali tertinggi (Root / Staff Level).

- **Rute Backend:** `[URL_CORE]/api/v1/admin/*`
- **Tugas Otentikasi:** Saat staf login di `admin-app`, API mengirimkan JWT Bearer dengan payload data `{ id, email, role: 'SUPER_ADMIN' | 'STAFF' }`.
- **Middleware Proteksi:** Middleware API wajib mengecek jika peran (role) dari token bukanlah keluarga `ADMIN`, kembalikan kode `403 Forbidden`.

### Pembatasan Hak Akses (RBAC) Admin

1. **`SUPER_ADMIN`**: Akses mutlak ke seluruh sumber daya internal. Dapat mengatur konfigurasi Webhook Payment Gateway Pusat, menghapus akun, melihat keseluruhan _Cashflow_ sistem, serta menambah dan mendepak akun staff lainnya.
2. **`STAFF`**: Akses bersifat _Data Entry / Customer Support_.
   - **Bisa**: Membuka dashboard, melihat metrik dasar harian, membalas obrolan/Tiket dari Seller, menyetujui (`Approve`) _Top-up_ mutasi secara manual dari Seller.
   - **Tidak Bisa**: Mengakses laporan keuntungan finansial (laba kotor bersih), mengatur parameter konfigurasi global, serta dilarang mengakses menu CRUD manajemen staf admin.

## 2. Autentikasi untuk `seller-app`

Aplikasi B2B Seller Panel, dimana pemegang agen mendaftarkan diri, melakukan Topup Saldo, dan membuka toko/domain.

- **Rute Backend:** `[URL_CORE]/api/v1/seller/*`
- **Tugas Otentikasi:** Saat mitra / staf toko login di `seller-app`, API mengeluarkan token JWT berisikan `{ id (sellerId / staffId), role: 'SELLER_OWNER' | 'SELLER_STAFF', staffTier?: 'CS' | 'FINANCE' | 'OPERATOR' }`.
- **Middleware Proteksi:** Rute ini bertugas mengolah produk & pengaturan _storefront_ toko berdasarkan subjek yang melekat di JWT.

### Pembatasan Hak Akses (RBAC) Seller

1. **`SELLER_OWNER` (Pemilik Inti)**: Mengendalikan penuh aspek bisnis tokonya.
   - **Hanya Owner yang Bisa**: Membeli/upgrade Paket Langganan bulanan dari pusat, mengisi saldo Topup deposit pusat, mengatur Kredensial API Pihak Ketiga (Digiflazz/Xendit), menetapkan Custom Domain, dan menambah/menghapus akses akun Staf Toko.
2. **`SELLER_STAFF` (Karyawan Toko)**: Akun turunan dari tabel `SellerStaff`. Wewenang dibatasi berdasarkan jabatannya (`role`):
   - **`CS` (Customer Service)**: Pekerja front-line. Hanya bisa melihat daftar pelanggan, melihat histori pesanan untuk melacak kesuksesan PPOB, serta membuat/membalas **Tiket Support Chat** dari Customer.
   - **`FINANCE`**: Fokus pada arus perputaran uang. Tidak bisa membalas Chat. **Bisa**: Mengatur Aturan Harga (Markup/Margin), melihat riwayat mutasi/transaksi di toko, menyetujui transfer mutasi manual dari pelanggan B2C.
   - **`OPERATOR`**: Mengelola _Storefront_. **Bisa**: Membuat Banner diskon, melakukan broadcast notifikasi (Doc/Notif), merubah parameter UI landing page (selain domain).

## 3. Autentikasi untuk `store-app`

Aplikasi B2C Store Front tempat pelanggan mendaftar sebagai konsumen dari _Seller_ terkait.

- **Rute Backend:** `[URL_CORE]/api/store/*`
- **Perlakuan Khusus Multi-Tenant:** `store-app` diakses via banyak sub-domain/domain. Selain mengecek otoritas JWT Pengguna B2C ({ `customerId`, `role: 'CUSTOMER'` }), middleware **WAJIB** mencek keberadaan header HTTP `x-store-domain`.
- **Alur Keamanan:** Core App akan memverifikasi apakah `x-store-domain` tersebut terdaftar dan valid di sistem/milik seller siapa. Jika valid, dan pelanggan sudah teregistrasi pada toko tersebut, barulah token JWT pelanggan dianggap sah. Pelanggan di `toko1.com` tidak serta-merta bisa login di `toko2.com` jika seller memberlakukan privasi terpisah (Database Isolation Logic).

## Prinsip Keamanan & Enkripsi

Sistem wajib men-hash password menggunakan algoritma Bcrypt/Argon2 sebelum masuk DB, baik untuk registrasi Admin, Seller, maupun Store Customer.

## 4. Keamanan API (Client App Validation)

Selain memvalidasi **siapa** yang mengakses API melalui JWT Token, `core-app` juga memiliki kewajiban memvalidasi **sumber aplikasi** untuk memastikan hanya aplikasi resmi di ekosistem kita (Admin, Seller, Store) yang boleh menggunakan API ini.

- **CORS Policy (Web):** Server wajib memberlakukan CORS secara ketat. Server hanya menerima permintaan dari domain atau subdomain yang telah masuk _whitelist_ (termasuk list domain kustom yang disimpan di tabel `Store`).
- **Client API App-Key:** Untuk pencegahan _hit_ palsu melalui Postman atau aplikasi pihak luar, setiap front-end klien _(Web, Android, iOS)_ wajib menyematkan Secret Header Statis bawaan build, contoh `x-app-client-key: <CLIENT_SECRET_KEY>`.
  - Jika key tidak cocok dengan yang ada di _environment variable_ `core-app`, permintaan akan ditolak di level paling awal (sebelum masuk pengecekan JWT).
- **Layer Keamanan Ganda (Zero Trust):**
  1. **Validasi Aplikasi Sistem**: "Benarkah request ini berasal dari App milikku?" (Via Cors & App-Key Header).
  2. **Validasi Aktor/User**: "Apakah aktor di balik App ini punya izin mengakses rute ini?" (Via `role` JWT Token).
