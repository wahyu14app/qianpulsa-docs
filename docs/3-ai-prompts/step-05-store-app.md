# Panduan AI: Pembuatan Store App (B2C Storefront)

Fokus utama: Menjadi aplikasi penyaji (Front-end Web) etalase toko yang dilihat dan digunakan oleh pelanggan akhir (Customer).

## Aturan Fundamental (Absolute Law)
Aplikasi Store ini bersifat *Domain Driven*. AI WAJIB membangun sistem *middleware* atau *host checking* yang mendeteksi URL mana yang dikunjungi pengunjung (`tokosaya.com` atau `tokoanda.qianpulsa.com`), lalu secara dinamis menarik konfigurasi tema, API Keys, dan katalog produk yang terkait khusus secara **Terisolasi** (Toko A vs Toko B). Jangan sampai produk toko A masuk keranjang toko B. TIDAK ADA KERANJANG BELANJA (No Cart) - sistem beroperasi 1:1 Instant Checkout.

## Fase 1: Ekstraksi Identitas & Etalase Katalog
1.  **Multitenant Router/Middleware**: Mendeteksi ID Store dari domain.
2.  **Landing Page & UI**: Menampilkan UI Toko yang informasinya *(Logo, Banner, Warna Tema)* dinamis ditarik dari konfigurasi Seller.
3.  **Dynamic Catalog**: Menampilkan produk (harga sudah final ditambah markup Seller).

## Fase 2: Autentikasi & Akun Pelanggan
1.  **Mandatory Login**: Pembatasan mutlak. Pengunjung hanya bisa berbelanja jika memiliki akun *Customer* di *Store* spesifik tersebut.
2.  **Customer Deposit Area**: Halaman untuk Pelanggan melakukan Top-Up saldo. Sistem akan menampilkan pilihan *Payment Gateway* yang di-set oleh Seller-nya.
3.  **Transaction History**: Riwayat transaksi B2C dari Customer tersebut saja.

## Fase 3: Alur Transaksi Direct-Pay
1.  **Instant Checkout Workflow**: Setelah klik produk dan memasukkan Parameter (misal. No HP, ID Game), konfirmasi klik beli akan secara mutlak/instan **MEMOTONG** saldo akun pelanggan. (Uang Customer dijamin sudah ditarik di detik pertama).
2.  **Order Generation**: Membentuk tiket pesanan B2C (StoreOrder).
3.  **Trigger Core**: Memanggil `Core API` untuk meneruskan tembakan pembelian pulsa secara mandiri ke API Digiflazz milik Seller di-balik layer sistem.

## Fase 4: Status Monitor & Komunikasi
1.  **Live Polling Track**: Halaman detail transaksi akan terus melakukan *refresh asinkron otomatis* setiap interval waktu menunggu status `PENDING` berubah dari server.
2.  **Auto Refund Trigger**: Jika status final divalidasi `GAGAL` oleh layanan pusat, sistem harus mengembalikan secara mandiri saldo dipotong tadi *(100% refund balance otomatis)* dan status menjadi `FAILED`.
3.  **Live Widget Helpdesk**: Jika difasilitasi, pelanggan bisa memicu percakapan Live Chat untuk menyambungkan aduan ke `Support App` tim Seller.

---
**Status**: Siap untuk dieksekusi berdasarkan fase. Saat memulai tugas, AI **HARUS** mendeklarasikan fase mana yang sedang dikerjakan.
