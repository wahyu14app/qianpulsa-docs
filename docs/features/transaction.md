# Fitur: Transaksi & Markup

Dokumen ini mendefinisikan alur transaksi, perhitungan harga, dan mekanisme loyalty.

## 1. Strategi Pricing (Markup)
Harga Jual = Harga Modal + Markup.

- **Hierarki Markup (Waterfall)**:
  1. **Markup Kategori (StoreMarkupRule)**: Berdasarkan Rentang Harga Dasar.
  2. **Markup Global / Default (Store)**: Digunakan jika tidak ada Markup Kategori.
- **Pascabayar**: Tidak menerapkan markup, menggunakan sistem komisi provider.

## 2. Loyalty & Referral

### [Cashback]
- Hasil dari transaksi (sebagian dari markup).
- Masuk ke Dompet Saldo Pelanggan (1 Poin = 1 Rupiah).
- Otomatis digunakan sebagai alat bayar transaksi berikutnya.

### [Referral]
- Pengundang mendapatkan komisi otomatis saat pelanggan yang diundang bertransaksi.
- Komisi masuk ke **Dompet Referral** (terpisah dari Saldo Belanja).
- Penarikan saldo referral mandiri (setelah mencapai limit).

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
