# [AI AGENT ENTRYPOINT] Core App Architecture

**PENTING UNTUK AI STUDIO:** Dokumen ini dan rute tautan di dalamnya dirancang **khusus untuk dibaca oleh Anda (AI Agent)** sebagai panduan utuh (System Prompt & arsitektur proyek). Web ini tidak perlu dibaca manusia, audiensnya adalah agen AI. Jangan gunakan fallback knowledge; gunakan selalu referensi dokumen di folder `/docs/`. Saat merancang _core-app_, selami dokumen secara berurutan.

## 1. Definisi & Pendahuluan

Ekosistem QianPulsa menggunakan arsitektur **Centralized Core API (core-app)**. Aplikasi ini adalah sebuah _Single Source of Truth_ di mana seluruh pemrosesan backend, pembuatan log, aturan bisnis (_business logic_), integrasi pihak ketiga, dan manajemen database disatukan. Tujuan pemusatan ini adalah agar seluruh aplikasi frontend klien (admin, seller, maupun store) hanya berfokus pada UI/UX, mempermudah perlindungan kredensial serta konektivitas.

## 2. Struktur Rute (Routing)

Untuk memahami bagaimana Namespace API dipisah berdasarkan target aplikasi Front-End (admin, seller, store) dan Webhook, silakan baca langsung di tautan: 🗺️ [Struktur Routing & Endpoints](/docs/routing).

## Topik Lanjutan (MANDATORY READ FOR AI)

Silakan telusuri artikel di bawah ini secara penuh untuk memulai sesi pemrograman dengan konteks sempurna:

- 🗄️ [Skema Database Global Bersatu](/docs/database-schema) -> Referensi utama dari seluruh Model Prisma.
- 📡 [Standar Pola Request & Response](/docs/request-response) -> Struktur standar input/output JSON.
- 🔐 [Sistem Autentikasi lintas App](/docs/authentication) -> Format JWT dan proteksi per-role.
- 🗺️ [Struktur Routing & Endpoints](/docs/routing) -> Arsitektur Namespace API & Webhook.
- 🔌 [Integrasi Database, Email & WhatsApp](/docs/integrations) -> Pendekatan pihak ketiga.
- 🤵 [Spesifikasi Modul Admin](/docs/module-admin) -> Alur kontrol panel & God-Mode.
- 🏪 [Spesifikasi Modul Seller](/docs/module-seller) -> Alur deposit seller vs store, aturan beli platform dan langganan.
- 🛒 [Spesifikasi Modul Store (B2C)](/docs/module-store) -> Spesifikasi koneksi Customer App, Routing Store-App, Dashboard, Web PWA/Mobile.
- 🚀 **Roadmap Pengerjaan**:
  - [Core App (Backend)](/docs/roadmap-core-app)
  - [Admin App (God Mode)](/docs/roadmap-admin-app)
  - [Seller App (B2B Dashboard)](/docs/roadmap-seller-app)
  - [Store App (B2C Storefront)](/docs/roadmap-store-app)
- ✅ [Panduan Verifikasi & Checklist](/docs/verification-checklist) -> Standar pengujian aplikasi.
