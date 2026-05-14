# Ekosistem: Support (Pusat Bantuan)

## 1. Ikhtisar & Peran
Support App adalah infrastruktur layanan pelanggan terpusat yang menangani komunikasi penyelesaian masalah teknis dan transaksional. Aplikasi ini memisahkan beban kerja komunikasi dari dashboard utama (Admin/Seller) agar tim Customer Service (CS) dapat bekerja fokus tanpa mengganggu operasional inti.

## 2. Alur Kerja Utama (*Key Workflows*)
Karena sifat platform adalah B2B2C, Support App beroperasi pada dua dimensi resolusi konflik:
- **Dimensi B2B (Seller ke Admin)**: 
  - Seller mengalami kendala di platform (contoh: *bug* saat *setup* toko, gagal bayar tagihan langganan). 
  - Akses login: `ADMIN_STAFF` (Support Tier) melayani `SELLER` / `SELLER_STAFF`.
- **Dimensi B2C (Customer ke Seller)**: 
  - Pembeli akhir (*Customer*) mengalami kendala transaksi (contoh: pulsa belum masuk padahal saldo sudah terpotong, salah nomor).
  - Akses login: `SELLER_STAFF` (sebagai agen CS toko) melayani `CUSTOMER` yang komplain via *Live Chat / Ticket* dari *Store App*.

## 3. Data & Batasan (*Constraints*)
- **Entitas Utama**: `Ticket`, `TicketMessage`, `LiveChatSession`.
- **Batasan Privasi**: Admin Induk **TIDAK** diperbolehkan membaca chat/tiket komplain antara *Customer* dan *Seller*, kecuali dilaporkan secara spesifik. 
- **Otomatisasi**: Support App mengandalkan notifikasi asinkron (misal via Webhook/WebSocket) dan dapat menampilkan status transaksi langsung di samping jendela *chat* berdasarkan ID Transaksi yang dilampirkan.

## 4. Ketetapan Sistem (*System Rulings*)
- *Apakah Support App berbasis *Real-time Live Chat* (seperti Intercom/Crisp) atau *Ticket-based Email/Form* (seperti Zendesk)?* -> **Ticket-based Chat** (mirip inboxt Tokopedia/Shopee). Percakapan bersifat sinkron di dalam tab tiket yang spesifik membahas 1 konteks masalah (misal: "Kendala Transaksi #TRX-123"). Tiket berawal dari pengajuan form pendek dan berakhir jika tombol *Mark as Resolved* ditekan oleh CS.
- *Pada masalah B2C, jika sengketa tidak diselesaikan oleh Seller, apakah Customer memiliki tombol "Eskalasi ke Admin Platform"?* -> **Tidak**. Admin (QianPulsa) berprinsip SaaS lepas tangan (Liability-Free). Seluruh sengketa uang B2C harus diselesaikan pada ruang lingkup Seller. UI *Customer Store* tidak memiliki celah routing untuk komplain ke Admin Induk.
