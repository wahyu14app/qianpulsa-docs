# Panduan Teknologi & Arsitektur Backend (Tech Stack)

Dokumen ini berisi instruksi dan standar tumpukan teknologi (tech stack) yang **wajib** digunakan oleh Pengembang (Developer) atau AI Agent ketika memulai penulisan kode sumber (coding) untuk `core-app`.

Mengingat proyek ini adalah sebuah layanan **100% API (Headless)** tanpa antarmuka pengguna (UI), fokus utama pengembangan diarahkan untuk menciptakan layanan server yang *fast*, *type-safe*, stabil, dan aman menangani transaksi finansial (PPOB & Ekosistem Multitenant).

## 1. Tumpukan Teknologi Utama (Core Stack)

1. **Runtime:** [Node.js](https://nodejs.org/) (Rekomendasi versi LTS terbaru, e.g., v20+).
2. **Framework Web:** [Express.js](https://expressjs.com/). Digunakan sebagai fondasi server HTTP. Express.js adalah framework Node.js yang paling umum digunakan dan didukung secara penuh oleh ekosistem platform ini. Karena kita beroperasi dalam lingkungan *full-stack* (Express + Vite middlewares jika ada), Node.js dengan Express adalah kerangka utama untuk membangun Core API B2B2C ini.
3. **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/). Ditetapkan dalam bentuk `strict mode` untuk meminimalkan *runtime error*, meningkatkan keakuratan intellisense/LLM Context, dan melindungi struktur transaksi objek B2C/B2B.
4. **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) berpasangan dengan [Prisma ORM](https://www.prisma.io/). Digunakan untuk manajemen dan migrasi struktur Database (RDBMS). Memudahkan deklarasi *schema-first* yang dikompilasi langsung menjadi *types* untuk TypeScript.

## 2. Library & Pustaka Backend Pendukung

Demi mendukung skalabilitas dan sistem keamanan dari serangan eksploitasi, sistem mewajibkan penggabungan beberapa pustaka spesifik berikut ke dalam rantai `Express`:

- **Validasi Data:** [`zod`](https://zod.dev/). Wajib dimanfaatkan sebagai *schema validation* untuk segala bentuk request yang masuk (`Body`, `Params`, maupun `Query`). Mencegah SQL Injection non-langsung dan manipulasi *payload*.
- **Kriptografi & Keamanan Kata Sandi:** [`argon2`](https://github.com/ranisalt/node-argon2) (Sangat direkomendasikan karena tahan terhadap eksploitasi GPU cracking) ATAU [`bcrypt`](https://github.com/kelektiv/node.bcrypt.js). Wajib digunakan pada entitas yang memiliki password (Admin, Seller, dll).
- **Autentikasi Stateless:** [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken). Berguna untuk membuat Access Token (`Header Authorization Bearer`) guna autentikasi RBAC (*Role-Based Access Control*).
- **Proteksi HTTP & CORS:** [`helmet`](https://helmetjs.github.io/) (Untuk menutupi *footprint* server di Header HTTP) dan [`cors`](https://github.com/expressjs/cors).
- **Anti-Brute Force:** [`express-rate-limit`](https://github.com/express-rate-limit/express-rate-limit). Sangat wajib dipasang pada *endpoint* login, pendaftaran pengguna, dan *endpoint Webhook* (Payment Gateway / PPOB Callback) untuk menghindari pengurasan resos via manipulasi pemanggilan (DDoS/Spam).

## 3. Struktur Direktori Proyek (Monolith-Modular Boilerplate)

Susunan direktori pada `core-app` berbasis Express disepakati dengan konsep **Layered Architecture**. Pemisahan batas yang jelas (Clean Code) direkomendasikan dengan kerangka ini:

```text
/src
  ├── /config             # Menyimpan setelan koneksi (Database, Node.js ENV, API Clients).
  ├── /controllers        # Jembatan antara HTTP Request ke Services (Tidak boleh ada logic tebal di sini).
  ├── /middlewares        # Filter global / Express Middlewares (Auth JWT verification, Error Handler, Vite Middleware).
  ├── /routes             # Pengkategorian Endpoint secara Namespace (e.g. /api/v1/admin, /api/v1/store).
  ├── /services           # Murni Core Business Logic (pemotongan saldo, validasi kuota, interaksi API ke Vendor).
  ├── /utils              # Fungsi helper global (Formatter response JSON API, Encryption class).
  ├── /validators         # Tempat penulisan tipe Skema Zod.
  ├── app.ts              # Registrasi konfigurasi awal Express (API routes dan middlewares).
  └── server.ts           # Entry point (menjalankan server pada port 3000 dan meng-host frontend SPA/Vite fallback).
```

## 4. Standar Aturan & Pola Pengkodean (Coding Patterns)

Sebagai sistem berbasis 100% API, patuhi prinsip arsitektur ini:

1. **Strict Service-Layer Pattern (Fat Service, Skinny Controller)**
   *Controller* dilarang keras berisikan rantai kondisi penentuan kelayakan saldo atau integrasi ke Digiflazz! Tugas Controller hanyalah membongkar `request.body` dari pengguna, melempar data bersih ke *Service*, lalu melakukan `reply.send(responseService)`. Semua kompleksitas harus terisolasi di *Service*.

2. **Global Error Handling API**
   Server tidak boleh menampilkan pesan baris "Stack Trace" ke End-User. Buat Global Error Middleware pada Express. Jika terjadi kondisi saldo tidak cukup, *Service* melemparkan error (`throw new AppError("Saldo PPOB tidak cukup", 400)`), lalu Error Middleware otomatis mengubahnya menjadi standar format respons API JSON yang layak (e.g. `res.status(err.statusCode).json({ error: ... })`).

3. **Rest API Murni tanpa Session Storage**
   Setiap request masuk bersifat merdeka (*stateless*) yang selalu divalidasi lewat verifikasi JWT Middleware di atas.

4. **Kredensial Dinamis (Bukan .env)**
   Kembali ditekankan bahwa untuk proses interaksi *Payment Gateway* dan `vendor` untuk *Store B2C*, sistem dilarang memanggil variabel global `.env`. Konteks kredensial dijalankan via query DB secara dinamis melalui pola parameter. (Sesuai `docs/limits-and-constraints.md`).

## 5. Instruksi Instalasi Awal (AI Workflow)

Tahapan untuk AI/Developer dalam mengkonfigurasi `core-app` awal:

1. Inisialisasi: `npm init -y` (jika belum ada).
2. Konfigurasi Typescript: Buat `tsconfig.json` dengan nilai `"strict": true`, dan `"esModuleInterop": true`.
3. Pasang dependency inti:
   ```bash
   npm install express cors helmet jsonwebtoken express-rate-limit zod argon2 dotenv prisma @prisma/client
   ```
4. Pasang dev-dependency:
   ```bash
   npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken tsx
   ```
5. Siapkan `server.ts` dan pastikan mem-bind ke post `3000` (host `0.0.0.0`) sesuai dengan standar *environment* AI Studio.
6. Tulis Endpoint **Health Check** standar `/api/health` guna mengetahui status online API dan kondisi konektivitas ke Postgres (Prisma Test Payload).
