# Gambaran Umum: Support-API

`Support-API` adalah layanan pendukung dalam ekosistem QianPulsa yang dirancang untuk menangani fitur-fitur non-finansial dan *non-critical*. Dengan memisahkan layanan ini dari `Core-API`, kita dapat mengalokasikan sumber daya server secara lebih efisien dan meminimalisir dampak kegagalan layanan non-kritis terhadap proses transaksi finansial.

## Tujuan Utama
1. **Delegasi Beban**: Memindahkan beban pemrosesan fitur seperti Chat, Notifikasi, Konten, dan Informasi Toko dari Core-API.
2. **Skalabilitas**: Mengembangkan fitur-fitur pendukung secara independen tanpa risiko *regression* pada logika finansial.
3. **Peningkatan Performa Core**: Memastikan Core-API hanya fokus pada pemrosesan transaksi yang membutuhkan waktu respons super cepat dan konsistensi data yang tinggi.

## Fitur Utama yang Dikelola
- **Chat Support**: Manajemen komunikasi antara pelanggan dengan admin atau seller.
- **Notifikasi**: Sistem pengiriman pesan pemberitahuan (system/promotion).
- **Banner/Konten**: Manajemen data promo (`banner`), artikel, dan informasi aplikasi.
- **Informasi Toko**: Data deskripsi toko, jam operasional, dan konten pendukung lain yang bersifat *public* atau *lookup-heavy*.

## Arsitektur
- **Runtime**: Node.js dengan [Fastify](https://fastify.dev/) (konsisten dengan Core-API agar mudah dipelajari tim).
- **Strategi Database**: Dapat menggunakan database yang berbeda dari Core-API (misalnya MongoDB untuk data chat/notifikasi, atau database PostgreSQL terpisah untuk efisiensi kueri).
- **Stateless**: Semua komunikasi bersifat *stateless* dan divalidasi menggunakan token autentikasi (JWT) yang diterbitkan oleh sistem autentikasi pusat.
- **Task-Driven**: Berinteraksi dengan Core-API melalui sistem penghantaran *task* atau *queue* untuk proses yang memerlukan sinkronisasi data antar modul.
