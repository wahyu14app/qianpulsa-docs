# Core App: Spesifikasi Modul Store (B2C)

Modul Store (`/api/v1/store/*`) adalah tulang punggung (backbone) bagi aplikasi _Front-End_ milik pelanggan (B2C). Modul ini didesain agar sangat ringan, mobile-friendly (PWA/Android/iOS Ready), dan tanggap menghadapi _request_ publik.

**Identifikasi Toko (Routing & Custom Domain)**
Setiap request ke endpoint publik Store **WAJIB** melampirkan identifikasi toko. Arsitektur Store-App mendukung dua mode identifikasi:

1. **Sub-Path Routing (Slug)**: Melalui _URL Path_ seperti `qianpulsa.com/:slug` (Header `x-store-slug: nama-toko`)
2. **Custom Domain**: Menggunakan domain khusus milik Seller (Header `x-store-domain: store.sellerku.com`)
   Tujuannya agar `core-app` dapat melayani _database_ dan profil Toko yang tepat walau diakses dari satu server tersentral.

## 1. Pengambilan Informasi Etalase

Proses ini dibagi menjadi dua bagian agar muatan _loading_ aplikasi tetap cepat.

### A. Inisialisasi Cepat (Init)

Di-hit pertama kali saat _Store App_ dibuka. Data esensial ini dieksekusi sebelum _routing_ frontend.

- **GET `/api/v1/store/init`**
  _Request Header:_ `x-store-domain: namatoko.mainsite.com`
  _Response (Public):_
  ```json
  {
    "success": true,
    "data": {
      "storeName": "QianPulsa",
      "themeColor": "#3b82f6",
      "useSplashScreen": true,
      "activeDepositMethod": "PAYMENT_GATEWAY"
    }
  }
  ```

### B. Konten Publik (Landing Page)

Digunakan khusus saat pelanggan belum login dan diarahkan ke rute `/landing-page`. Berisi ulasan panjang yang tidak perlu memberatkan inisialisasi awal.

- **GET `/api/v1/store/landing-page`**
  _Request Header:_ `x-store-domain: namatoko.mainsite.com`
  _Response (Public):_
  ```json
  {
    "success": true,
    "data": {
      "slogan": "Pulsa Murah Meriah",
      "shortDescription": "Solusi PPOB Terbaik",
      "longDescription": "Selamat datang di toko kami, kami menyediakan layanan topup tercepat...",
      "featuredCategories": ["Pulsa", "Data", "PLN"]
    }
  }
  ```

## 2. Autentikasi Pengguna B2C (Customer)

Sistem routing web-nya telah diatur `Store-App`: `/auth/{register/login/forgot-password}`.

- **POST `/api/v1/store/auth/register`**: Registrasi pelanggan baru. Request wajib menyertakan identifikasi domain agar pelanggan dibuatkan entitas dan direlasikan ke `Store` yang bersangkutan.
- **POST `/api/v1/store/auth/login`**: Jika berhasil, mengembalikan **User JWT Bearer Token** dan informasi profil pelanggan.

## 3. Dashboard Pelanggan, Tier (Level), & Katalog PPOB

Pada `Store-App`, setelah login, user akan otomatis dialihkan ke Beranda `/`. Rute Backend pendukung dashboard:

- **GET `/api/v1/store/dashboard/banners`**
  Mengambil daftar banner aktif dari tabel `StoreBanner`.

- **GET `/api/v1/store/dashboard/docs`**
  Mengambil daftar dokumen artikel/FAQ aktif dari tabel `StoreDoc`.

- **GET `/api/v1/store/products` (atau `/categories`)**
  PENTING: Harga yang diekspos kepada pelanggan adalah **Customer Price**. Saat memanggil rute ini, core-app akan menghitung _Real-Time_: Base Price (dari Provider) + Markup Rules (Sesuai Kategori / Default). Customer menanggung harga akhir.

- **GET `/api/v1/store/me`** (Butuh JWT `Customer`)
  Digunakan secara konsisten untuk merender _Card Saldo_ dan _Level / Tier_ di pojok atas Dashboard. Setiap Customer memiliki Tier (`CustomerTier` - Misal: Biasa, Reseller, Agen) yang diset oleh Seller/Staf B2B. Tier ini bisa difungsikan ke depannya untuk bonus poin / prioritas cs.
  _Response:_ `{"balance": 150000, "name": "Budi", "tier": "Reseller", "phone": "0812..."}`

## 4. Pusat Informasi Toko & Notifikasi Personal In-App

Terkait dengan instruksi fitur Navigasi **Info** pada `Store-App`.

- **GET `/api/v1/store/announcements`** (Public/JWT)
  Menampilkan dafar pesan _blast_ pengumuman / peringatan massal dari pemilik toko (contoh: "Promo Kemerdekaan", "Server Telkomsel Gangguan"). Mengambil tipe row dari tabel `StoreNotification`.

- **GET `/api/v1/store/notifications/me`** (Wajib JWT `Customer`)
  Menampilkan notifikasi _Personal / In-App Notifications_ khusus untuk Customer tersebut.
  - Hanya berjalan jika Toko tersebut telah diaktifkan fitur `hasB2CInAppNotif` (Berdasarkan langganan Seller).
  - Berisi informasi rekam jejak pribadi (sistem-sent) seperti: **Status Pendaftaran Berhasil**, **Topup Deposit Berhasil/Gagal**, dan **Transaksi Sukses/Gagal**.
  - Merujuk pada tabel database `CustomerNotification`.

## 5. Fitur Topup (Isi Saldo)

Sesuai Navigasi **Isi Saldo** pada `Store-App`. Menyesuaikan fleksibilitas `activeDepositMethod`.

- **GET `/api/v1/store/payment-methods`**
  Menampilkan daftar rekening/metode pembayaran (termasuk PG). **PENTING**: UI Store-App wajib memampang dengan sangat jelas nominal **Biaya Admin (Fee)** ke Pelanggan Toko. Biaya ini bisa ditunjukkan sebagai _Rp 0_ (jika Seller memilih opsi menanggung fee di panelnya), atau sejumlah nominal spesifik yang dihitung/ditarik dari Payment Gateway.

- **POST `/api/v1/store/deposits`**
  Memproses keinginan pelanggan (`Customer`) untuk melakukan pengisian saldo (Top-up dompet B2C). Backend `core-app` akan mendeteksi apa metode aktif (_activeDepositMethod_) dari toko saat _request_ masuk, entah itu meneruskan pembuatan `Xendit Invoice`, atau mencetak Rekening Bank untuk _Manual Transfer_. Meng-insert histori ke `CustomerDeposit` beserta total tagihan riil (termasuk fee B2C jika ada).

## 6. Riwayat Transaksi

Sesuai Navigasi **Riwayat** pada `Store-App`.

- **GET `/api/v1/store/orders`**: Mengambil daftar transaksi belania produk PPOB (Pulsa, PLN, dll). Merujuk pada tabel `StoreOrder`. Termasuk detail Serial Number (sn) atau Nomor Token Listrik.
- **GET `/api/v1/store/deposits`**: Mengambil riwayat pengisian saldo dompet (`CustomerDeposit`) dari pengguna itu sendiri.

## Referensi Arsitektur Frontend B2C Khusus (Store-App)

Ketika agent AI lain ditugaskan untuk membuat `store-app`, panduan _routing_ dan desain yang harus diikuti:

1. **Routing Rules**:
   - `/` : Dasboard App. (Guard: _Redirect ke `/landing-page` jika belum login_).
   - `/landing-page` : Halaman sambutan (_guest_).
   - `/auth/login`, `/auth/register` : Otentikasi mandiri.
   - `/{pageName}` : Halaman internal jika sudah login.
   - `/error/{errorCode}` : Halaman _fallback_ pesen kegagalan.
2. **Theming Rule**: Halaman publik (Landing Page & Auth) **WAJIB TERANG**. Tema Gelap/Terang boleh diterapkan untuk halaman selain publik jika dikehendaki user.
3. **Navigasi Dasar**: Menggunakan _Bottom Navigation_ bergaya aplikasi _Native_ (Beranda, Riwayat, Isi Saldo, Info, Akun).
4. **Respon Web Cepat**: _Splash screen_ dan konfigurasi lainnya mengambil porsi kecil (_init_ API), di-_cache_, dan tidak memberatkan loading awal.
