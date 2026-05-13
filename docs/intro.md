# 📖 Pengenalan Struktur Dokumentasi QianPulsa

Dokumentasi ini telah dibagi menjadi **Dua Sistem Utama** untuk memudahkan navigasi antara Manusia (Human) dan AI (Agentic Assistant).

## 1. 🧑‍💻 Panduan Bisnis (Human Manual) - `/docs/human-manual/`
Folder ini ditujukan terutama untuk **Manusia (Tim Bisnis, Product Owner, dsb)** meskipun AI akan tetap membacanya untuk memahami konteks fitur.
Berisi definisi bisnis, kemampuan aplikasi (Admin, Seller, Store), dan arsitektur fitur.

**Daftar Dokumen Bisnis:**
- 📖 [Pengenalan Human Manual](/docs/human-manual/intro.md)
- 🏢 [Pengenalan Ekosistem & Tenant](/docs/human-manual/tenant_ecosystem.md)
- 💰 [Sistem Transaksi, Cashback & Referral](/docs/human-manual/transaction.md)
- 👥 [Manajemen Pengguna & Role](/docs/human-manual/user_management.md)
- 🔌 [Integrasi Pihak Ketiga](/docs/human-manual/integrations.md)

## 2. 🤖 Panduan Eksekusi AI (AI Prompts) - `/docs/ai-prompts/`
Folder ini dirancang **Eksklusif untuk AI Assistant**. Berisi *prompt step-by-step* untuk mengerjakan tugas pemrograman secara bertahap.
AI **Wajib** menjadikan file di folder ini sebagai acuan eksekusi teknis.

**Daftar Instruksi Pengerjaan (Roadmap):**
- 📋 [Standar Alur Kerja & Prasyarat Coding](/docs/ai-prompts/00-workflow-standard.md)
- ⚙️ [Tahap 1: Core App & API Engine](/docs/ai-prompts/step-02-core-api.md)
- 🤵 [Tahap 2: Admin App](/docs/ai-prompts/step-03-admin-app.md)
- 🏪 [Tahap 3: Seller App](/docs/ai-prompts/step-04-seller-app.md)
- 🛒 [Tahap 4: Store App](/docs/ai-prompts/step-05-store-app.md)

## 3. 🏗️ Referensi Arsitektur Sistem - `/docs/architecture/`
Dokumentasi teknis yang dibaca oleh manusia & AI untuk merancang integrasi dan struktur kode yang seragam.
- 🗄️ [Skema Database Global](/docs/architecture/database-schema.md)
- 📡 [Standar Konektivitas Rest/API](/docs/architecture/request-response.md)
- 🗺️ [Struktur Routing Endpoints](/docs/architecture/routing.md)
- 🔑 [Setup Autentikasi JWT](/docs/architecture/authentication.md)
- 🔌 [Integrasi 3rd Party API](/docs/architecture/integrations.md)

---
**PENGINGAT UNTUK AI:** Saat menerima instruksi, pastikan Anda merujuk pada:
1. **Human Manual** (Untuk memahami *What* dan *Why* dari sebuah fitur).
2. **Architecture** (Untuk memahami struktur tabel dan data).
3. **AI Prompts** (Untuk mengeksekusi urutan langkah coding *How-to* secara sistematis).