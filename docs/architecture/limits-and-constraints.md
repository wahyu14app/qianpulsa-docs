# Ekosistem QianPulsa: Batasan & Validasi Standar (Limits & Constraints)

Untuk menjaga stabilitas, efisiensi penyimpanan (_storage_), keamanan data, serta User Experience (UX), Backend API wajib menerapkan fungsi _Sanitize_ & Validasi pada setiap Payload masuk.

Dokumen ini mendefinisikan batasan wajar (Normal Limits) pada berbagai entitas berdasarkan praktik terbaik pengembangan aplikasi modern.

## 1. Batasan Berkas (File Uploads)

Proses unggah dokumen dari sisi UI _(Front-End)_ maupun API _(Back-End)_ wajib di-filter dengan batas maksimal ukuran (_Max File Size_) dan _MIME TYPE_ berikut:

| Entitas Target                                              | Format Diizinkan (_Mime Types_)          | Maks. Ukuran | Catatan Tambahan (Rekomendasi UI)                                    |
| :---------------------------------------------------------- | :--------------------------------------- | :----------- | :------------------------------------------------------------------- |
| **Banner (Promo / Info)** <br> (Support-API: `AdminBanner`, `StoreBanner`) | `.jpg`, `.jpeg`, `.png`, `.webp`         | **2 MB**     | Dimensi lanskap 16:9 atau 21:9.                                      |
| **Ikon / Logo Toko**                                        | `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg` | **1 MB**     | Dimensi _square_ (1:1), direkomendasikan min. 256x256 px.            |
| **Foto Profil** <br> `Customer`, `Seller`, `Staff`          | `.jpg`, `.jpeg`, `.png`, `.webp`         | **1 MB**     | Sebaiknya dikompres _Client-side_ terlebih dahulu ke format `.webp`. |
| **Foto KYC / KTP (Identitas)**                              | `.jpg`, `.jpeg`, `.png`, `.pdf`          | **3 MB**     | Resolusi harus tajam karena sering diperlukan untuk _OCR_ admin.     |
| **Lampiran Chat Support (Tiket)** <br> (Support-API)        | `.jpg`, `.jpeg`, `.png`, `.webp`         | **2 MB**     | Berupa screenshot/foto bukti kendala.                                |

> **Catatan Endpoint (`multipart/form-data`)**: Back-End harus mengembalikan status `HTTP 413 Payload Too Large` jika ada file yang dikirim melampaui batasan di atas.

## 2. Batasan Jumlah Karakter (String Length Constraints)

Panjang `String` yang diterima oleh Endpoint API harus selalu dilimit secara eksplisit (misalnya via _Zod_ / _Joi Validation_ di Back-End) sebelum masuk ke _Database_.

### a. Profil Akun & Data Diri Dasar

- **`name` / Nama Lengkap** : Min 3 Karakter, Maks **50 Karakter**.
- **`email`** : Validasi Email Standar RFC, Maks **100 Karakter**.
- **`phone` / Nomor WhatsApp** : Maks **15 Angka** (Hanya numerik setelah dibersihkan dari simbol `+` atau `-`).
- **`password` (Pendaftaran)** : Min 8 Karakter, kombinasi _alphanumeric_ direkomendasikan. Maks **64 Karakter** di _Raw Input_ (Bebas di sisi Hash DB).

### b. Konten dan Publikasi (Dokumen / Notifikasi)

Pada fitur-fitur seperti _Docs_ dan _Blast Notification_ (yang kini ditangani oleh **Support-API**), kita menggunakan tipe data Text panjang, namun Endpoint tidak boleh tanpa filter:

- **`title` (Judul)** `AdminDoc`, `StoreDoc` : Maks **100 Karakter**.
- **Judul Tiket (`subject`)** `SupportTicket` : Maks **100 Karakter**.
- **`content` (Isi Dokumen Markdown)** `AdminDoc`, `StoreDoc` : Maks **15.000 Karakter** (Kurang lebih 2000-2500 kata).
- **Isi Pesan Chat (`content`)** `SupportMessage` : Maks **1.000 Karakter**.
- **Isi Pesan Notifikasi (`content`)** `StoreNotification`, `AdminNotification`, `CustomerNotification` : Maks **255 Karakter** atau **500 Karakter** bergantung gaya UI _Push Notification_ / _Card_. Pesan blast sebaiknya tidak terlalu panjang, referensi _Keep It Short_ agar UI Card di Mobile tidak pecah. Gunakan `docId` jika ingin memuat informasi lengkap.

### c. Konfigurasi Toko (UX / Branding)

- **Nama Toko (`name`)** : Maks **50 Karakter**.
- **Deskripsi Singkat / Slogan Toko** : Maks **150 Karakter**.
- **URL Pihak Ketiga (Web/Medsos/Link Tautan Opsional)** : Maks **255 Karakter**.

## 3. Limitasi Pagination dan Query List

Endpoint dengan metode pengembalian _Array of Data_ (daftar trx, daftar history saldo, list dokumen) harus menggunakan konsep **Pagination**.

- **`limit` per-Halaman Default** : 10 atau 20 item.
- **`limit` Maksimal yang dapat di-request** : **100 item** (Jangan _allow_ pemanggilan 10.000 data sekaligus, yang mana berpotensi mengakibatkan serangan _Denial of Service_ dan memperlambat _Memory Backend_).

## 4. Pengendalian _Rate Limiting_ Dasar (Proteksi API)

Direkomendasikan agar sistem menambahkan _Rate Limit Interceptor/Middleware_ pada _API Gateway_ B2C dan B2B untuk mencegah eksekusi berlebihan:

- **Endpoint Biasa (GET, POST JSON)** : 100 Request per Menit per IP Address / Token.
- **Upload File Endpoint** : 15 Request per Menit per IP Address.
- **Endpoint Autentikasi / OTP** : Maks 5 Request per Menit per Nomod Whatsapp/Email.

## 5. Batasan Database & Lingkungan Pengembangan (Enviroment Constraints)

Dalam perancangan sistem berbasis **Prisma ORM**, pemilihan jenis database (Provider) sangat memengaruhi fungsionalitas yang tersedia.

- **Dilarang Menggunakan SQLite untuk Development:**
  Anda TIDAK BISA dan dilarang menggunakan `SQLite` di lingkungan _Development_ dan `PostgreSQL` di lingkungan _Production_ secara bersamaan pada skema tunggal Prisma ini. Hal ini dikarenakan skema database kita (lihat `/docs/database-schema.md`) menggunakan fitur-fitur tingkat lanjut seperti `enum`, `Json`, dan tipe data yang HANYA didukung secara primitif oleh PostgreSQL. Jika Anda memaksa menggunakan SQLite, Prisma tidak bermigrasi atau memaksa Anda menghapus fungsionalitas enum/json secara manual, yang justru akan merusak kode dan arsitektur data.

- **Cara Optimal & Wajib: Gunakan PostgreSQL di Semua Lingkungan (Dev & Prod)**
  Agar lingkungan _Development_ 100% konsisten dengan _Production_, gunakan PostgreSQL untuk keduanya. Untuk memudahkan _setup_ bagi _Developer_ di tingkat lokal tanpa perlu instalasi rumit, sangat disarankan untuk menggunakan containerisasi (Docker).

  Berikut adalah contoh standar file `docker-compose.yml` untuk menyalakan database lokal secara terisolasi tanpa mempengaruhi mesin host:

  ```yaml
  version: "3.8"
  services:
    postgres:
      image: postgres:15-alpine
      container_name: qianpulsa_pg_dev
      environment:
        POSTGRES_USER: user
        POSTGRES_PASSWORD: password
        POSTGRES_DB: qianpulsa
      ports:
        - "5432:5432"
      volumes:
        - pg_data:/var/lib/postgresql/data
      restart: unless-stopped

  volumes:
    pg_data:
  ```

  _(Dengan skrip ini, developer hanya perlu menjalankan `docker-compose up -d` lalu mengatur `DATABASE_URL` pada file `.env` di tahap lokal ke `"postgresql://user:password@localhost:5432/qianpulsa?schema=public"`.)_

## 6. Larangan Hardcoding Kredensial Vendor (Multitenancy Safety)

Ekosistem QianPulsa adalah platform **SaaS berbayar**, di mana setiap Toko (Store) atau Seller (B2B) dapat menggunakan akun PPOB (Digiflazz) atau Payment Gateway miliknya sendiri.

**Aturan Emas Penggunaan API Key:**
1. **DILARANG KERAS** menyimpan kredensial Digiflazz, Xendit (Key Milik Seller), Fonnte, atau Gmail API pribadi milik Seller di dalam file `.env`.
2. File `.env` HANYA digunakan untuk kredensial **Admin Platform** (Internal), seperti kunci enkripsi JWT, koneksi database (`DATABASE_URL`), dan API Key Admin untuk penagihan langganan (SaaS Billing).
3. **Pemuatan Dinamis**: Semua integrasi vendor di level transaksi Customer B2C wajib memuat kredensial secara dinamis dari tabel `SellerApiSetting` melalui Query Database saat proses eksekusi berlangsung.
4. **Pencegahan Kebocoran**: Kegagalan mematuhi aturan ini (hardcoding kredensial seller ke global config) dianggap sebagai **Vulnerability Keamanan Kritis** karena menyebabkan satu toko menggunakan saldo/api milik orang lain.
