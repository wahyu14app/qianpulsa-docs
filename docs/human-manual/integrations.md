# Fitur: Integrasi Pihak Ketiga (3rd Party Integrations)

Dokumen ini mendefinisikan penyedia layanan pihak ketiga yang digunakan dalam ekosistem QianPulsa dan bagaimana integrasi tersebut dikelola secara logika bisnis.

## 1. Penyedia Layanan Induk (Core Providers)

### [PPOB (Prepaid & Postpaid)]
- **Digiflazz**: Digunakan sebagai penyedia utama produk digital (Pulsa, Token PLN, E-Wallet, Pascabayar, dll). Transaksi produk akan dihubungkan langsung ke API Digiflazz.

### [Payment Gateway]
- **Fazz (Fazz Business / Payfazz)**: Digunakan sebagai jalur pembayaran utama pelanggan untuk menyelesaikan transaksi (Virtual Account, QRIS, Retail, E-Wallet).

### [Komunikasi & Notifikasi]
- **Fonnte**: Layanan WhatsApp Gateway untuk pengiriman notifikasi (OTP, resi transaksi, pengingat, dll) ke pengguna dan seller.
- **Resend**: Layanan email gateway untuk mengirim email seperti lupa password, OTP email, dan notifikasi transaksi.

## 2. Kapabilitas per Aplikasi

### [Admin App]
- Mengawasi keseluruhan log integrasi atau kendala di server.

### [Seller App]
- **Wajib Konfigurasi Mandiri**: Masing-masing Toko/Seller **WAJIB** mensetting kredensial API mereka sendiri secara mandiri (seperti API Digiflazz untuk produk, dan API Fazz untuk Payment Gateway) melalui panel Seller App.
- Seller dapat menentukan metode pembayaran apa saja yang ingin diaktifkan di tokonya (via Payment Gateway).

### [Store App]
- Menggunakan channel pembayaran secara seamless.
- Menerima OTP dan notifikasi via Email atau WhatsApp.

## 3. Data Terkait
- Log Endpoint / Log Transaksi
- Konfigurasi Payment Gateway di `Store`
