# Panduan AI: Pembuatan Support App

Fokus utama: Membangun portal resolusi konflik (Customer Service) dengan paradigma Multi-Tenant. 

## Aturan Fundamental (Absolute Law)
Aplikasi Support adalah satu dashboard yang dapat diakses oleh Admin Staff dan Seller Staff, namun UI dan Data yang disajikan dibatasi ketat:
- **Jika Seller Staff login**: HANYA melihat tiket/chat masuk dari `Customer` toko miliknya.
- **Jika Admin Staff login**: HANYA melihat tiket/chat masuk dari `Seller` yang mengalami kendala sistem platform QianPulsa.
(Admin JANGAN dapat melihat urusan dapur atau percakapan B2C antara Seller dan Customer!)

## Fase 1: Infrastruktur Komunikasi
1.  **Live Polling / WebSocket**: Setup mekanisme realtime. Karena aplikasi berjalan di serverless, gunakan metode SWR (Stale-While-Revalidate) short-polling jika web socket native sulit diimplementasikan, atau integrasikan Firebase Realtime Database.
2.  **Data Isolation**: Terapkan middleware absolut `where: { storeId: seller.storeId }` pada *end-point* pengambilan pesan (untuk Seller).

## Fase 2: Dashboard UI
1.  **Ticket Queue Layout**: Desain Split-View. Kiri = Daftar Chat/Tiket, Kanan = Ruang Percakapan dan Detail Pengirim.
2.  **Context Panel**: Di sebelah kanan chat box, WAJIB tampilkan **Detail Transaksi Terakhir** dari pengirim (Customer) atau **Detail Subscription** pengirim (Seller). Ini sangat krusial agar CS tidak membuang waktu menanyakan ID transaksi.

## Fase 3: Aksi Solutif (Actionable Chat)
1.  **Magic Commands / Buttons**: CS memiliki tombol interaktif di dalam ruang *chat* untuk aksi instan:
    - *Tombol "Refund Saldo"* (Untuk CS Seller ke Customer).
    - *Tombol "Check API Status"* untuk melacak status transaksi secara *live* dari provider.

---
**Status**: Siap untuk dieksekusi berdasarkan fase. Saat memulai tugas, AI **HARUS** mendeklarasikan fase mana yang sedang dikerjakan.
