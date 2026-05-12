# [AI AGENT ENTRYPOINT] Core App Architecture

**PENTING UNTUK AI STUDIO:** Dokumen ini dan rute tautan di dalamnya dirancang **khusus untuk dibaca oleh Anda (AI Agent)** sebagai panduan utuh (System Prompt & arsitektur proyek). Web ini tidak perlu dibaca manusia, audiensnya adalah agen AI. Jangan gunakan fallback knowledge; gunakan selalu referensi dokumen di folder `/docs/`. Saat merancang _core-app_ maupun _support-api_, selami dokumen secara berurutan.

## 1. Definisi & Pendahuluan

Ekosistem QianPulsa menggunakan arsitektur **Distributed Services Architecture**.
- **Core-API (core-app)**: Sebagai _Single Source of Truth_ untuk pemrosesan backend berbasis finansial, pembuatan log, aturan bisnis (_business logic_), integrasi pihak ketiga, dan manajemen database finansial.
- **Support-API (support-app)**: Sebagai layanan pendukung untuk fitur-fitur non-finansial seperti chat, notifikasi, banner, dan manajemen konten untuk menurunkan beban Core-API.

## 2. Struktur Rute (Routing)

Untuk memahami bagaimana Namespace API dipisah, silakan baca langsung di tautan: 🗺️ [Struktur Routing & Endpoints](/docs/architecture/routing).

## Topik Lanjutan (MANDATORY READ FOR AI)

Silakan telusuri artikel di bawah ini secara penuh untuk memulai sesi pemrograman dengan konteks sempurna:

- 🗄️ [Skema Database Global Bersatu](/docs/architecture/database-schema) -> Referensi utama dari seluruh Model Prisma.
- ⚙️ [Panduan Teknologi & Fastify](/docs/architecture/tech-stack) -> Instruksi tumpukan teknologi (Fastify, Zod, JWT).
- 📡 [Standar Pola Request & Response](/docs/architecture/request-response) -> Struktur standar input/output JSON.
- 🔐 [Sistem Autentikasi lintas App](/docs/architecture/authentication) -> Format JWT dan proteksi per-role.
- 🗺️ [Struktur Routing & Endpoints](/docs/architecture/routing) -> Arsitektur Namespace API & Webhook.
- 🔌 [Integrasi Database, Email & WhatsApp](/docs/architecture/integrations) -> Pendekatan pihak ketiga.
- 🛡️ [Support-API Overview](/docs/support-api/support-api-overview) -> Arsitektur & fitur Support-API.
- 🤵 [Spesifikasi Modul Admin](/docs/apps/module-admin) -> Alur kontrol panel & God-Mode.
- 🏪 [Spesifikasi Modul Seller](/docs/apps/module-seller) -> Alur deposit seller vs store, aturan beli platform dan langganan.
- 🛒 [Spesifikasi Modul Store (B2C)](/docs/apps/module-store) -> Spesifikasi koneksi Customer App, Routing Store-App, Dashboard, Web PWA/Mobile.
- 🚀 **Roadmap Pengerjaan**:
  - [Core App (Backend)](/docs/core-api/roadmap-core-app)
  - [Support App (Support API)](/docs/support-api/roadmap-support-api)
  - [Admin App (God Mode)](/docs/apps/roadmap-admin-app)
  - [Seller App (B2B Dashboard)](/docs/apps/roadmap-seller-app)
  - [Store App (B2C Storefront)](/docs/apps/roadmap-store-app)
- ✅ [Panduan Verifikasi & Checklist](/docs/architecture/verification-checklist) -> Standar pengujian aplikasi.
