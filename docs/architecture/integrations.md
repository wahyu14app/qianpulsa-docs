# Core App: Integrasi Pihak Ketiga & Database

Aplikasi **Core App** bertanggung jawab untuk menangani seluruh konektivitas ke layanan eksternal (Third-Party Services) dan abstraksi Database. Semua aplikasi frontend (Admin, Seller, Store) **tidak diizinkan** melakukan panggilan langsung ke pihak ketiga, melainkan harus melewati rute API yang disediakan oleh Core App.

## 1. Konfigurasi Database (PostgreSQL & SQLite)

Sistem ini menggunakan ORM (Object-Relational Mapping) seperti Prisma atau Drizzle untuk mengelola multi-environment database.

- **Production & Development Mode:** Wajib menggunakan **PostgreSQL**. Karena skema database kita menggunakan fitur `enum`, `Json`, dan tipe data spesifik PostgreSQL, penggunaan `SQLite` dilarang keras karena akan merusak fungsionalitas ORM dan integritas data.

_Perintah untuk AI:_
Pastikan koneksi database selalu merujuk ke URL PostgreSQL.

## 2. Integrasi Pengiriman Email (Gmail API)

Digunakan untuk pengiriman notifikasi via surel seperti verifikasi pendaftaran, reset password, dan pemberitahuan invoice berhasil.

- Transport mailer disarankan menggunakan **Nodemailer** yang dikombinasikan dengan kredensial OAuth2 **Gmail API** atau App Password.
- Semua fungsi pengirim email harus dideklarasikan sebagai service worker tunggal `/services/emailService.js` untuk memudahkan testing.

## 3. Integrasi Notifikasi WhatsApp (Fonnte API)

Digunakan untuk mengirim pemberitahuan instan via pesan WhatsApp ke pengguna (B2B maupun B2C).

- **Vendor:** [Fonnte](https://fonnte.com/)
- **Kegunaan:** Pengiriman OTP (One Time Password), alert transaksi pending, dan status PPOB sukses/gagal.
- **Implementasi:** Seluruh request ke endpoint Fonnte harus dibalut dalam _try-catch_ secara _asynchronous / non-blocking_ sehingga tidak menghambat response API utama untuk mempercepat pengalaman pengguna.

---

## 4. Variabel Lingkungan (.env)

Struktur file `.env` di **core-app** HANYA memuat kredensial **Platform Admin** (Internal). Kredensial milik Seller (Digiflazz, Key pribadi) **DILARANG** masuk ke sini dan wajib disimpan di Database secara dinamis.

```env
# Koneksi Database (Wajib PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/qianpulsa?schema=public"

# Integrasi SaaS Billing Platform (Xendit Milik Admin)
# Digunakan untuk top-up saldo Seller ke platform
XENDIT_API_KEY=""
XENDIT_WEBHOOK_VERIFICATION_TOKEN=""

# Platform Notification (Fonnte) - Milik Admin
FONNTE_TOKEN=""

# Platform Email Service (Gmail API) - Milik Admin
GMAIL_CLIENT_ID=""
GMAIL_CLIENT_SECRET=""
GMAIL_REFRESH_TOKEN=""
GMAIL_USER=""

# Keamanan Admin
ADMIN_ALLOWED_DEVICES=""

# Routing Frontend
VITE_ADMIN_API_URL="http://localhost:3000/api/v1/admin"
VITE_SELLER_API_URL="http://localhost:3000/api/v1/seller"
VITE_STORE_API_URL="http://localhost:3000/api/v1/store"

# Kunci Rahasia JWT
JWT_SECRET="changethisinproduction"
```

---

Baca Selanjutnya: [Pola Request dan Response](/docs/request-response.md)
