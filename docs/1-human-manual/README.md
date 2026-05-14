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

- 👑 **[Admin (Platform Induk)](./admin.md)**: Kapabilitas dan peran pengelola utama.
- 🏪 **[Seller (Pemilik Toko)](./seller.md)**: Onboarding, batasan fitur, finansial B2B dan manajemen API mandiri pemilik tenant.
- 🛍️ **[Store (Toko)](./store.md)**: Definisi domain tenant, strategi harga (markup), dan alur pelayanan integrasi yang mendukung jalannya sebuah brand tenant.
- 👥 **[Customer (Pelanggan)](./customer.md)**: Interaksi ujung transaksi dari pembeli (B2C), proses auth, deposit dan aturan main sistem pembayaran di platform.
- 🎧 **[Support (Pusat Bantuan)](./support.md)**: Ekosistem komunikasi untuk resolusi konflik antara CS Admin-Seller maupun CS Seller-Customer.
- 🔌 **[Integrasi Pihak Ketiga](./integrations.md)**: Gambaran layanan pendukung luar (PPOB, Payment Gateway, Notifikasi) dan perannya dalam ekosistem.

> **Catatan Struktur**: Setiap dokumen menggunakan standar template yang mencakup *Ikhtisar, Alur Kerja Utama, Data & Batasan, serta Pertanyaan Klarifikasi*. Bagian *Pertanyaan Klarifikasi* adalah daftar poin yang harus dijawab/dikonfirmasi untuk menetapkan parameter fitur sebelum diimplementasikan ke dalam kode.

*Catatan: Dokumen ini berfokus pada alur bisnis dan **TIDAK** berisi baris kode atau detail endpoints API. Untuk panduan teknis implementasi, silakan rujuk folder `/docs/3-ai-prompts/` atau `/docs/2-architecture/`.*
