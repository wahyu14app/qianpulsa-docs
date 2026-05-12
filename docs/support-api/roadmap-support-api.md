# Roadmap: Support-API

Fokus utama: Memisahkan fitur pendukung dari Core-API dan memastikan stabilitas layanan non-finansial.

## Fase 1: Setup & Integrasi Dasar
1.  **Environment Setup**: Konfigurasi Fastify, TypeScript, dan koneksi ke database pendukung (misal: Firebase/MongoDB/Postgres terpisah).
2.  **Authentication Middleware**: Implementasi validasi JWT untuk memastikan akses hanya dilakukan oleh user yang sah.
3.  **Basic Routing**: Implementasi *endpoint* awal untuk informasi toko dan manajemen banner.

## Fase 2: Implementasi Fitur Konten & Notifikasi
1.  **Banner/Konten**: Migrasi/Pembuatan *endpoint* CRUD untuk banner dan konten aplikasi.
2.  **Notifikasi**: Implementasi dasar manajemen notifikasi (bisa terintegrasi dengan Firebase/Pusher).
3.  **Webhook-Task Listener**: Implementasi *worker* atau *listener* sederhana untuk mengambil *task* dari Core-API.

## Fase 3: Fitur Real-time & Dukungan
1.  **Chat Support**: Implementasi fitur percakapan (WebSocket).
2.  **Task Processor**: Penyempurnaan mekanisme penghapusan/update task berdasarkan hasil eksekusi setelah chat/notifikasi terkirim.
3.  **Monitoring**: Integrasi logging khusus untuk memantau trafik di Support-API.
