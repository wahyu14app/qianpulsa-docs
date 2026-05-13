# Fitur: Transaksi & Markup

Dokumen ini mendefinisikan alur transaksi, perhitungan harga, dan mekanisme loyalty.

## 1. Strategi Pricing (Markup)
Harga Jual = Harga Modal + Markup.

- **Hierarki Markup (Waterfall)**:
  1. **Markup Kategori (StoreMarkupRule)**: Berdasarkan Rentang Harga Dasar.
  2. **Markup Global / Default (Store)**: Digunakan jika tidak ada Markup Kategori.
- **Pascabayar**: Tidak menerapkan markup, menggunakan sistem komisi provider.

## 2. Alur Transaksi (Flow)
- **Model Produk**: 1 Produk = 1 Checkout = 1 Pembayaran (Direct Pay). Tidak mendukung keranjang belanja (cart) atau beli banyak produk sekaligus.
- **Proses Eksekusi**:
  1. Pelanggan memilih produk.
  2. Saat checkout, sistem langsung memotong saldo pelanggan.
  3. Sistem mengirimkan API request langsung ke API PPOB Provider (Digiflazz) milik seller.
- **Mekanisme Callback & Status**:
  - Menunggu callback dari provider.
  - Untuk transaksi berstatus `PENDING` atau `PROSES`, sistem melakukan pengecekan status (polling) ke API Provider secara berkala (contoh: setiap 5 menit).

## 3. Kapabilitas per Aplikasi

### [Admin App]
- Audit transaksi lintas toko.

### [Seller App]
- Konfigurasi Markup (Global & Kategori).
- Pengaturan persentase cashback.
- Pengaturan komisi referral.

### [Store App]
- Transaksi Instan (Instant Checkout, No Shopping Cart).
- Menampilkan harga setelah markup secara real-time.
- Riwayat transaksi & penggunaan cashback.
- Penarikan saldo referral.

## 4. Rute API Utama
- `/api/v1/store/prepaid/*`
- `/api/v1/store/postpaid/*`
- `/api/v1/orders/*`
- `/api/v1/transactions/*`
