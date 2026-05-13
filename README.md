# 📚 QianPulsa Ecosystem Documentation Hub (AI Central Directive)

Sebuah repositori referensi yang didekasikan secara eksklusif untuk spesifikasi arsitektur, basis data, panduan API, serta aturan bisnis ekosistem SaaS QianPulsa.

**🤖 AI INSTRUCTION (READ THIS FIRST)**
Jika kamu adalah agen AI (AI Code Editor / AI Coding Assistant) yang ditautkan ke repositori ini untuk mempelajari dokumentasi, **LANGKAH PERTAMAMU ADALAH MEMBACA SELURUH README INI**. File ini menjelaskan pembagian tugas dan menuntunmu menuju dokumen spesifikasi yang tepat untuk menyelesaikan _prompt_ dari _User_.

---

## 🎯 1. Gambaran Besar Ekosistem (Ecosystem Overview)

QianPulsa adalah platform SaaS PPOB Multi-Tenant (B2B2C). Alih-alih membuat banyak modul komputasi (backend), QianPulsa menggunakan arsitektur **Centralized Core API (`core-app`)**. Semua operasi dari segala jenis aktor bermuara pada satu server terpadu.

Berikut pembagian aplikasinya:

1. **Core App (Backend API)**
   Pusat pemrosesan data, database Prisma, logika bisnis PPOB, otentikasi JWT, webhook, manajemen saldo, dan keamanan lintas-origin.
2. **Admin App (Web Front-End Admin)**
   Sistem panel kontrol super-admin (God-Mode).
3. **Seller App (Web/PWA Front-End Seller)**
   Dashboard bagi Mitra/Seller untuk mengelola dan memonitor toko PPOB mereka secara mandiri.
4. **Store App (Web/PWA Front-End B2C)**
   Aplikasi antarmuka publik atau etalase toko (_Storefront_) tempat pelanggan riil berbelanja produk.

---

## 🛠️ 2. Pembagian Tugas & Navigasi AI (AI Task Delegation)

Sebagai Agen AI, identifikasi aplikasi mana yang diminta oleh pengguna untuk kamu bangun/rawat. Lalu telusuri referensi spesifikasinya berikut. **Dilarang keras berimajinasi (halusinasi) pembuatan kode tanpa membaca pedoman ini!**

### 🧪 Jalur Pengujian E2E (QA Automation)
Jika kamu ditugaskan untuk melakukan pengujian otomatis (E2E) menggunakan Playwright:
- Panduan Pengujian E2E: 📖 [`/docs/architecture/e2e-testing.md`](docs/architecture/e2e-testing.md)

> **🤖 Catatan Pemrosesan URL (Untuk AI)**:  
> Jika kamu membaca file `README.md` ini melalui tautan mentah (_Raw URL_ seperti `raw.githubusercontent.com`), harap sadari bahwa tautan internal berawalan `/docs/` di bawah ini merujuk pada hierarki file repositori. Ganti jalur file `/README.md` dengan direktori/kredensial terkait di URL awal kamu untuk melakukan _fetch_ dan menjemput isi _Markdown_ spesifikasinya. Kumpulkan konteksnya secara lengkap sebelum membuat arsitektur aplikasi!

### ⚙️ Jalur Pembuatan Backend & API (Core App)

Jika kamu ditugaskan membangun, mengedit, atau menambahkan fitur Backend API:

1. Gerbang utama Backend: 📖 [`/docs/intro.md`](docs/intro.md)
2. Skema & Model Database: 📖 [`/docs/architecture/database-schema.md`](docs/architecture/database-schema.md)
3. Endpoint & Namespace Rute: 📖 [`/docs/architecture/routing.md`](docs/architecture/routing.md)
4. Fitur Tiket & Chat Bantuan: 📖 [`/docs/support-api/module-chat-support.md`](docs/support-api/module-chat-support.md)
5. Proteksi, Batasan Payload & Standar Respon: 📖 [`/docs/architecture/authentication.md`](docs/architecture/authentication.md), 📖 [`/docs/architecture/limits-and-constraints.md`](docs/architecture/limits-and-constraints.md) dan 📖 [`/docs/architecture/request-response.md`](docs/architecture/request-response.md)
6. Pedoman Desain & Tema UI: 📖 [`/docs/architecture/ui-theme-guidelines.md`](docs/architecture/ui-theme-guidelines.md)
7. **Panduan Implementasi Spesifik**:
   - 📖 [Roadmap: Core App](/docs/core-api/roadmap-core-app.md)
   - 📖 [Roadmap: Support API](/docs/support-api/roadmap-support-api.md)
   - 📖 [Roadmap: Admin App](/docs/apps/roadmap-admin-app.md)
   - 📖 [Roadmap: Seller App](/docs/apps/roadmap-seller-app.md)
   - 📖 [Roadmap: Store App](/docs/apps/roadmap-store-app.md)
8. **Checklist Pengujian**: 📖 [`/docs/architecture/verification-checklist.md`](docs/architecture/verification-checklist.md)

### 🤵 Jalur Pembuatan Web Admin (God-Mode)

Jika kamu ditugaskan membangun Front-End Admin:

- Baca detail kapabilitas dan fungsionalitas admin: 📖 [`/docs/apps/module-admin.md`](docs/apps/module-admin.md)

### 🏪 Jalur Pembuatan Web Seller (B2B Panel)

Jika kamu ditugaskan membangun Front-End Seller (Manajemen Toko PPOB):

- Baca alur bisnis seller, paket langganan, dan manajemen tokonya: 📖 [`/docs/apps/module-seller.md`](docs/apps/module-seller.md)

### 🛒 Jalur Pembuatan Web Store (B2C Storefront)

Jika kamu ditugaskan membangun Front-End Etalase Toko untuk pelanggan akhir:

- Pahami rute web, manajemen state, inisialisasi API yang digunakan: 📖 [`/docs/apps/module-store.md`](docs/apps/module-store.md)

---

## 📝 3. Aturan Tambahan (The Golden Rules)

1. **SSOT (Single Source of Truth):** Repo ini adalah wujud kebenaran mutlak arsitektur aplikasi (khususnya untuk penamaan kolom/relasi pada database Prisma di `/docs/architecture/database-schema.md`).
2. **No Coding in Repo:** Repositori ini murni tempat dokumentasi teks (`.md`).
3. **Pahami Batasan:** AI dilarang mengubah aturan baku yang sudah ditetapkan di sini, jika terdapat improvisasi, tambahkan/ubah Markdown di dokumentasi ini terlebih dahulu sebelum memproduksi kode-nya.
4. **Indeks Raw Mode:** Untuk Robot/AI yang membaca basis data dokumen ini tanpa fasilitas terminal (`ls`, `tree`), bisa mengambil rute `https://wahyu14app.github.io/qianpulsa-docs/raw/index.html` (atau membaca raw mentah di folder `/raw/data.json`) untuk mengambil susunan penuh *tree index* dokumentasi.

---

## 🤖 4. Pemberdayaan AI Developer (Implementor) & Roadmap Pengerjaan

### A. Rekomendasi Urutan Pengerjaan (Roadmap)

Untuk menjaga agar proses _development_ rapi dan struktur tidak berantakan, _AI Developer_ disarankan mengikuti urutan pembedahan modul berikut:

1.  **Fase 1: Core App & Base Config**
    Kembangkan inisiasi server backend. Bentuk skema database Prisma, Zod validator, dan _Authentication Middleware_. Jangan lupa buat _Seeder_ untuk data-data awal!
2.  **Fase 2: Admin API (God Mode)**
    Bangun seluruh rute Admin terlebih dahulu. Backend tidak akan lengkap jika "Pemilik Semesta" belum punya akses manajemen (Misal: persetujuan paket berlangganan, list seller).
3.  **Fase 3: Webhook & Integrasi Eksternal**
    Siapkan endpoint dan jembatan ke Payment Gateway (Xendit), Provider PPOB (Fonnte/Wa, dsb). Pastikan saldo bisa bertambah (secara API logic).
4.  **Fase 4: Seller API (B2B Panel)**
    Bangun rute bagi Seller agar mereka bisa login, melihat etalase, membeli harga _markup_, dll.
5.  **Fase 5: Store API (B2C Panel)**
    Fase terakhir di bagian sistem, buat Endpoint _Storefront_ yang hanya dapat merender toko dan pembelian berdasar dari _domain/subdomain_ tenant.

### B. Otonomi Developer

1. **Kritik & Saran Diizinkan**: Jika Anda melihat ada kelemahan logika, potensi _security hole_, atau celah arsitektur pada dokumentasi kami saat Anda menulis kode, **Bebas untuk memberikan komentar (inline comments `// TODO: ...`)** di dalam kode Anda atau meminta User agar memberitahu AI Dokumentator.
2. **Fleksibilitas Logis**: Jika Anda butuh sebuah _field_ tambahan di DB untuk mendukung UI yang bagus (contoh: `hexColor` di tabel `Store`), Anda dipersilakan untuk menumbuhkannya di Prisma Schema atau menambahkannya sendiri jika masuk akal. Inisiatif Anda dihargai!

---

## 📥 5. Instruksi Pengunduhan Dokumentasi (Untuk AI Developer)

Jika Anda (AI Implementor) memulai proyek di *repository* atau *workspace* baru, dan Anda belum memiliki folder `docs/` dengan isi yang lengkap, Anda **DIWAJIBKAN** untuk **mengunduh/menyalin seluruh dokumen arsitektur ini** ke dalam direktori `/docs/` proyek Anda sebelum menulis kode apapun.

**Prosedur Inisialisasi AI Developer:**
1.  **Identifikasi Peran**: Tentukan apakah Anda sedang membangun *Core App*, *Admin App*, *Seller App*, atau *Store App*.
2.  **Kumpulkan Amunisi**: Unduh semua file `.md` yang ada di folder `docs/` repositori ini. Seluruh pengetahuan sistem QianPulsa ada di sana.
3.  **Pelajari Blueprint**: Baca `database-schema.md` (untuk Backend) atau modul terkait (untuk Frontend) untuk memahami standar penamaan dan alur kerja.
4.  **Eksekusi**: Mulailah pengerjaan berdasarkan **Roadmap Spesifik** (Core, Admin, Seller, atau Store) yang sedang Anda bangun dan pastikan hasil akhirnya lolos `verification-checklist.md`.

*(AI Implementor dibebaskan menggunakan alat bantu atau perintah shell untuk mengambil data dari repositori dokumentasi ini secara massal, yang terpenting adalah dokumentasi tersebut menjadi landasan utama pengerjaan sistem).*
