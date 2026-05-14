# 📖 Pengenalan Struktur Dokumentasi QianPulsa

Dokumentasi ini telah dirancang untuk memudahkan penyampaian konteks fungsionalitas aplikasi dan standar arsitektur teknis secara harmonis antara Pemilik Produk (Manusia) dan Agen Developer (AI).

## 1. 🧑‍💻 Manual Bisnis (Human Manual) - `/docs/1-human-manual/`
Folder ini ditujukan membahas alur logika operasional dan batasan bisnis secara komprehensif. Menjawab *What* (Apa Fiturnya) dan *Why* (Kenapa dibutuhkan).

Daftar Dokumen:
- [README.md](/docs/1-human-manual/README.md) - Pengenalan Entitas
- [admin.md](/docs/1-human-manual/admin.md) - Hak & Siklus Admin
- [seller.md](/docs/1-human-manual/seller.md) - Hak & Siklus Seller
- [store.md](/docs/1-human-manual/store.md) - Ekosistem Toko (Multitenant)
- [customer.md](/docs/1-human-manual/customer.md) - Pembeli & Transaksi B2C
- [support.md](/docs/1-human-manual/support.md) - Sistem Bantuan (Pusat Resolusi)
- [integrations.md](/docs/1-human-manual/integrations.md) - Ekosistem Vendor API

## 2. 🏗️ Referensi Arsitektur - `/docs/2-architecture/`
Dokumentasi teknis yang dibaca oleh manusia & AI untuk merancang integrasi, standar kode, dan topologi *database* yang seragam.
- [tech-stack.md](/docs/2-architecture/tech-stack.md) - Tumpukan Teknologi
- [database-schema.md](/docs/2-architecture/database-schema.md) - Prisma Schema
- [authentication.md](/docs/2-architecture/authentication.md) - Alur Keamanan Mutlak
- [routing.md](/docs/2-architecture/routing.md) - Namespace Standar API
- DLL (Lihat isi folder)

## 3. 🤖 Panduan Eksekusi Khusus (AI Prompts) - `/docs/3-ai-prompts/`
Folder eksklusif ini memandu AI Assistant mengerjakan dan membangun aplikasi (*coding*) secara berurutan dan tuntas. Menjawab *How* (Bagaimana mengeksekusinya).

Daftar Target Eksekusi (Roadmap Progress):
- [00-workflow-standard.md](/docs/3-ai-prompts/00-workflow-standard.md) - Aturan Fundamental Kerja
- [step-02-core-api.md](/docs/3-ai-prompts/step-02-core-api.md) - Pembuatan Backend/Database
- [step-03-admin-app.md](/docs/3-ai-prompts/step-03-admin-app.md) - Pembuatan Aplikasi Panel Pusat
- [step-04-seller-app.md](/docs/3-ai-prompts/step-04-seller-app.md) - Pembuatan Aplikasi Panel Mitra
- [step-05-store-app.md](/docs/3-ai-prompts/step-05-store-app.md) - Pembuatan Halaman Toko B2C
- [step-06-support-app.md](/docs/3-ai-prompts/step-06-support-app.md) - Pembuatan Modul CS & Bantuan

---
**PENGINGAT UNTUK AI:** Saat mengeksekusi instruksi:
1. Pastikan mengacu pada **1-human-manual** untuk rules B2C/B2B yang mutlak.
2. Mengacu **2-architecture** untuk standar schema database dan nama file yang legal.
3. Jalankan sesuai urutan tasking dari **3-ai-prompts**.