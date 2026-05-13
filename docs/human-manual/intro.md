# 📖 Pengenalan Human Manual (Panduan Bisnis)

Selamat datang di **Human Manual QianPulsa**. Folder ini dirancang khusus untuk dibaca oleh **Manusia** (Tim Bisnis, Product Owner, System Analyst) yang ingin memahami dasar-dasar konsep, logika bisnis, dan definisi fitur-fitur yang ada di dalam ekosistem QianPulsa.

AI juga akan membaca dokumen di dalam folder ini untuk memahami **konteks, batasan (rules), dan tujuan (What & Why)** dari sebuah fitur sebelum mengeksekusi penulisan kode teknis.

## 🎯 Tujuan Panduan Ini:
1. **Definisi Fitur:** Menjelaskan secara gamblang tentang apa itu sebuah fitur dan bagaimana cara kerjanya secara logika bisnis.
2. **Kapabilitas Aplikasi:** Memetakan batasan wewenang untuk masing-masing aplikasi:
   - **Admin App:** Apa saja yang bisa dikelola oleh Super Admin.
   - **Seller App:** Apa saja yang bisa dikonfigurasi oleh Pemilik Toko.
   - **Store App:** Apa saja yang bisa dilakukan oleh Pelanggan (Customer).
3. **Keterkaitan Data:** Penjelasan singkat mengenai data/tabel apa saja yang relevan dengan fitur tersebut di sisi database.

## 📂 Daftar Dokumen Bisnis:
Silakan jelajahi dokumen berikut untuk memahami detail logika bisnis untuk tiap modul:

- 🏢 **[Ekosistem & Tenant](./tenant_ecosystem.md)**: Konsep multi-tenant, hierarki toko, dan arsitektur B2B2C.
- 💰 **[Transaksi, Cashback, & Referral](./transaction.md)**: Logika markup harga, komisi rujukan (referral), dan alur cashback secara finansial.
- 👥 **[Manajemen Pengguna](./user_management.md)**: Definisi hak akses untuk Admin, Seller, Staff, dan Customer.
- 🔌 **[Integrasi Pihak Ketiga](./integrations.md)**: Gambaran layanan pendukung luar (PPOB, Payment Gateway, Notifikasi) dan perannya dalam ekosistem.

*Catatan: Dokumen ini berfokus pada alur bisnis dan **TIDAK** berisi baris kode atau detail endpoints API. Untuk panduan teknis implementasi, silakan rujuk folder `/docs/ai-prompts/` atau `/docs/architecture/`.*
