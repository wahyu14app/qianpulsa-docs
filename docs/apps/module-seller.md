# Core App: Spesifikasi Modul Seller

Dokumen ini memandu AI Studio dalam memahami alur bisnis Modul Seller (`/api/v1/seller/*`). Modul ini mewadahi seluruh aktivitas kepemilikan mitra toko B2B.

**ALUR BISNIS SELLER (WAJIB BERURUTAN):**

1. **Registrasi & Login**: Mendaftar dan mengakses dasbor.
2. **Deposit Saldo**: Mengisi saldo akun seller (`Seller.balance`) melalui integrasi Xendit terpusat.
3. **Pembelian Platform**: Minimal harus punya 1 platform (Web/Android/iOS) sebelum bisa bikin toko. Memotong `balance`.
4. **Pembelian Paket Langganan**: Memilih durasi layanan per bulan. Memotong `balance`.
5. **Manajemen Toko (Store)**: Pengaturan _Storefront_, pembuatan domain.
6. **Setting Deposit Store B2C**: Seller menentukan metode topup aktif (`MANUAL` / `PAYMENT_GATEWAY` / `CEK_MUTASI`) agar Customer (B2C) dapat mengisi saldo dompet Toko mereka.
   - Seller juga berwenang mengatur **Biaya Admin (Fee)** untuk Pelanggan Toko. Biaya Payment Gateway (PG) dapat dialokasikan dengan opsi: dipotong dari margin seller (`feePaidBy: "SELLER"`) atau ditanggung pelanggan (`feePaidBy: "CUSTOMER"`).
7. **Pengaturan API Provider**: Fitur _custom api credential_. Mendukung arsitektur **Multi-Provider** (seperti Digiflazz, VIP Reseller, dll). Karenanya, Seller diwajibkan untuk memantau dan melakukan top-up Saldo Provider secara mandiri di dashboard masing-masing Provider PPOB.
8. **Pengaturan Staf Toko**: Mendelegasikan peran ke staf operasional.
9. **Strategi Pricing & Markup**: Mengatur margin (keuntungan seller) di antarmuka Store B2C.

_(Catatan AI: Selalu rujuk field dan relasi pada [Skema Database Global](/docs/database-schema))._

## 1. Autentikasi Seller (Register & Login)

Mitra B2B mendaftar secara mandiri. Auth rute ini terbuka.

- **POST `/api/v1/seller/auth/register`**: Register Seller (`name`, `email`, `phone`, `password`).
- **POST `/api/v1/seller/auth/login`**: Login dan mengembalikan JWT dengan `role: SELLER_OWNER` (Untuk akun utama) atau `role: SELLER_STAFF` beserta tier `CS / FINANCE / OPERATOR` untuk staf.

## 2. Management Saldo Seller (Deposit Xendit Pusat)

Core-App menyiapkan integrasi _invoice_ Xendit bagi Seller untuk deposit saldo yang nantinya digunakan untuk membayar langganan.

- **POST `/api/v1/seller/deposits`**:
  _Payload:_ `{ "amount": 500000 }`
  _Alur:_ Buat invoice ke Xendit. Simpan ke database `SellerDeposit` dengan status `PENDING`. Kembalikan URL pembayaran Xendit.
  _(Webhook server yang akan mengurus pergantian ke SUCCESS dan penambahan saldo otomatis ke `Seller.balance`)._

## 3. Pembelian Platform (Web, Android, iOS)

Syarat wajib. Seller harus mentransaksikan `balance`-nya untuk membeli akses platform.

- **POST `/api/v1/seller/platforms/purchase`**:
  _Payload:_ `{ "platformTypeId": "uuid-platform" }`
  _Alur (Transaksi Database Atomik):_
  1.  Cek saldo seller apakah >= harga `PlatformType`. Tolak dengan error 400 jika tidak cukup.
  2.  Kurangi `balance` Seller.
  3.  Simpan data kepemilikan platform di tabel `SellerPlatform`.

## 4. Pemilihan Paket Berlangganan

Setelah memiliki _platform_, seller wajib berlangganan bulanan.

- **POST `/api/v1/seller/subscriptions/purchase`**:
  _Payload:_ `{ "subscriptionPlanId": "uuid-plan" }`
  _Alur:_
  1.  Validasi: Apakah Seller sudah memiliki setidaknya 1 platform di tabel `SellerPlatform`? Jika Nol, tolak (`403 Forbidden`).
  2.  Cek Saldo dan kurangi saldo.
  3.  Tambahkan rekam perpanjangan waktu layanan dengan men set `endDate` pada tabel `SellerSubscription`.

## 5. Manajemen Toko & Etalase (Store)

Barulah setelah Platform & Langganan aktif, Seller dapat membuat B2C Store Front-nya.

- **POST `/api/v1/seller/stores`**:
  _Payload:_ `{ "name": "QianPulsa", "domain": "store.qianpulsa.com", "themeColor": "#3b82f6" }`
  _Validasi:_ Tolak permintaan ini jika `SellerSubscription` seller sudah kadaluwarsa (`endDate` lewatan) atau tidak aktif.

## 6. Pengaturan Deposit Pelanggan/Customer (B2C)

Seller membutuhkan cara agar _Customer B2C_-nya bisa topup saldo dompet Toko. PENTING: Toko hanya dapat mengaktifkan **1 (satu) tipe metode** deposit dalam satu waktu.

Namun, riwayat deposit (`CustomerDeposit`) dirancang **fleksibel** (menyimpan `methodType` dan snapshot di `paymentDetails`). Sehingga jika hari ini Seller mengaktifkan `MANUAL` lalu besok mengubah konfigurasi Toko ke `PAYMENT_GATEWAY`, webhook atau verifikasi pelunasan untuk transaksi `MANUAL` sebelumnya tidak akan rusak/error karena datanya telah direkam secara mandiri pada row transaksi tersebut.

### A. Aktifkan Tipe Deposit di Toko

- **PUT `/api/v1/seller/stores/{storeId}/deposit-method`**:
  _Payload:_ `{ "activeDepositMethod": "PAYMENT_GATEWAY" }` // Enum: MANUAL, PAYMENT*GATEWAY, CEK_MUTASI
  \_Alur:* Memperbarui field `activeDepositMethod` pada tabel `Store`.

### B. Konfigurasi Rekening (Jika Pakai MANUAL)

Jika memilih MANUAL, seller wajib mengatur rekening bank tampilannya.

- **POST `/api/v1/seller/stores/{storeId}/payment-methods`**:
  _Payload:_
  ```json
  {
    "bankName": "BCA",
    "accountNo": "1234567890",
    "accountName": "Bapak Wahyu",
    "isActive": true
  }
  ```
- _Catatan:_ Data (`StorePaymentMethod`) ini akan diekspos melalui API Store untuk instruksi transfer bagi pembeli B2C. Khusus metode `PAYMENT_GATEWAY` kredensial diambil dari `SellerApiSetting`.

### C. Manajemen UI, Beranda, & Informasi

Untuk menunjang fitur _Front-End Store-App_ (PWA/Android/iOS Ready), Seller dapat meramu etalasenya:

- **PUT `/api/v1/seller/stores/{storeId}/ui-config`**: Menyimpan referensi _Splash Screen_, tema, dan _Landing Page Config_ (JSON).
  _Payload:_
  ```json
  {
    "useSplashScreen": true,
    "landingPageConfig": {
      "slogan": "Pulsa Murah Meriah",
      "shortDescription": "Solusi PPOB",
      "longDescription": "Selamat datang...",
      "featuredCategories": ["Pulsa", "PLN"]
    }
  }
  ```

## 7. Pengaturan API Provider

Untuk Seller besar yang ingin memakai akun PPOB (Vendor Digiflazz) atau Payment Gateway sendiri alih-alih ikut sistem pusat.

- **PUT `/api/v1/seller/api-settings`**:
  _Payload:_
  ```json
  {
    "xenditKey": "xnd_development_O...",
    "midtransKey": "SB-Mid-server-...",
    "digiflazzUser": "wahyu_hoki",
    "digiflazzKey": "keydigiflazz..."
  }
  ```
  Ini akan secara langsung me-replace atau membuat instance row pada tabel `SellerApiSetting`.

## 8. Manajemen Staff Toko

Sebagai pemilik _Store_ (Mitra B2B), Seller dapat mendelegasikan akses tokonya kepada staf:

- Staf _Seller_ tidak menyatu dengan tabel `Seller` utama, melainkan menggunakan `SellerStaff`.
- Aturan ini memungkinkan satu email `Staf` dapat dijadikan akun utama (owner) di platform Seller apabila dia ingin membuka usahanya sendiri.
- Endpoint pengelolaan Staf meliputi CREATE, READ, UPDATE status (ACTIVE/INACTIVE). Autentikasi dan JWT staf bermuara ke `role: SELLER_STAFF`. Kewenangan dibatasi oleh `role` bawaan tabel (`CS`, `FINANCE`, `OPERATOR`).
- **Limit Quota Staf**: Jumlah staf yang bisa ditambahkan oleh Seller sangat bergantung pada batas **`maxStaffs`** di Paket Langganan mereka.
- **Mekanisme Suspend Downgrade**: Serupa dengan Banner dan Dokumen, apabila Seller turun paket (_downgrade_) ke batas `maxStaffs` yang lebih kecil, staf berlebih/lainnya akan dinonaktifkan sementara dan dilabeli **`isSuspended: true`**. Staf yang terkena _suspend_ tidak dapat ditukar-tukar statusnya. Staf*suspend* tersebut tidak dapat login sampai Seller melakukan _upgrade_ paket.

## 9. Skema Harga, Margin, & Refund (Pricing Strategy)

Seller meraup keuntungan dari selisih Harga _Provider_ (Pusat / Digiflazz) ditambah dengan **Markup**.

- **Logika Markup Prabayar**:
  Terdiri dari Flat (Rp) + Persentase (%). Terdapat dua jenis aturan Markup:
  1. **Markup Kategori (StoreMarkupRule)**: Menggunakan Rentang Harga Dasar (Min - Max Base Price). Jika harga provider cocok dengan rentang ini, akan diperlakukan aturan ini. (Contoh: "Kategori PULSA_REGULER, min 0, max 10.000, markup Rp 1.000").
  2. **Markup Global / Default (Store)**: Disimpan di Tabel `Store` (`globalMarkupFlat`, `globalMarkupPercent`). Ini digunakan jika Harga Provider tidak cocok dengan aturan rentang Kategori manapun.

  **Hierarki Prioritas (Waterfall):**
  1. Sistem mencari **Markup Kategori** yang sesuai dengan `categoryId` dan rentang harga produk.
  2. Jika poin 1 tidak ditemukan, sistem menggunakan **Markup Global / Default (Store)**.
  3. Margin keuntungan dihitung dari total penambahan (Flat + Persentase).
- **Harga Realtime**: Penyimpanan ke Database hanya berupa `basePrice` (Harga Dasaran Asli Provider). Sedangkan harga yang dilihat atau dibayarkan _Customer_ akan dikalkulasi **Real-Time** (_Customer Price = Base Price + Markup_). Hal ini membuat fluktuasi harga Provider tidak akan merugikan Seller.
- **Auto-Refund Transaksi Gagal**:
  Jika API Provider membalas dengan status transaksi GAGAL (Contoh: Nomor Salah atau Gangguan), core-app akan **secara otomatis (`Auto-Refund`)** mengembalikan _Customer Price_ tersebut ke **Saldo Dompet Customer (`Customer.balance`)**. Transaksi ini dicatat ketat dengan Double-Entry (log di `WalletMutation`) dengan `type: "CREDIT"`, `referenceType: "REFUND"`.

---

## 10. Detail Struktur Multi-Provider (providerConfigs)

Pada tabel `SellerApiSetting`, terdapat field `providerConfigs`. AI Implementor wajib mengikuti struktur JSON berikut untuk mendukung skalabilitas vendor:

```json
{
  "activeProvider": "DIGIFLAZZ", // Vendor aktif saat ini
  "additionalProviders": [
    {
      "name": "VIP_RESELLER",
      "apiUrl": "https://vip-reseller.co.id/api",
      "apiId": "123",
      "apiKey": "abc...",
      "isActive": false
    },
    {
      "name": "APIGAMES",
      "apiUrl": "https://apigames.id/v2",
      "apiKey": "xyz...",
      "isActive": false
    }
  ]
}
```

---

## 11. Langganan SaaS, Reset Quota & Mekanisme Auto-Renewal

Toko (Store) diwajibkan berlangganan (Basic, Pro, atau Enterprise) untuk bisa beroperasi.

- **Snapshot Data Paket**: Saat _Seller_ membeli/memperbarui paket langganan, **seluruh spesifikasi paket** (seperti _max banners, max notifications, live chat access_) di-copy/disalin langsung ke _row_ data `Store`. Ini merupakan tindakan pengamanan (_resilience_); sehingga jika Admin mengganti limit/harga suatu paket di kemudian hari, operasional Toko tidak akan rusak atau berubah secara mendadak.
- **Auto-Renewal & Reset Quota**:
  - Kuota bulanan (seperti batas broadcast notifikasi) di-reset setiap siklus terlewati.
  - Khusus bagi toko yang masa kedaluwarsanya di hari H, **Reset Quota beserta eksekusi perpanjangan dilakukan serentak pada Jam 12 Malam (± 00:00)** melalui proses sinkronisasi berkala (Cron Job).
  - Di Aplikasi Store (atau Seller App), UI wajib memberikan notifikasi bahwa _\"Kuota akan direset setelah ± jam 12 malam\"_, sehingga tidak ada kasus pembatasan akses prematur karena terlambat melakukan reset manual.
  - **Pembatasan akses toko HANYA diizinkan** _apabila_ pada jam 12 malam tersebut sistem mendeteksi Saldo Seller tidak mencukupi untuk melakukan pemotongan tagihan langganan (Auto-Renewal gagal).
- **Auto-Sync Harga Provider**: Paket langganan level tertentu (misal: Enterprise) dapat menikmati fitur `autoSyncEnabled`, yaitu penjadwalan otomatis (1 jam sekali) sinkronisasi pembaruan harga master PPOB dari pusat ke database.

## 12. Notifikasi & Komunikasi (Seller ke Customer)

Secara bawaan (_default_), notifikasi yang berjalan di aplikasi adalah **Notifikasi In-App** (di dalam aplikasi). Baik itu notifikasi dari Admin ke Seller, maupun dari Seller ke Customer (seperti promo, struk, peringatan, dll).
Namun, apabila Toko (Store) berlangganan paket yang lebih tinggi, mereka mendapatkan hak istimewa untuk menetapkan dan mengirimkan notifikasi eksternal:

- **Email Notification**: Menggunakan integrasi **Gmail API**.
- **WhatsApp Notification**: Menggunakan integrasi API **Fonnte**.

## 13. Sistem Deposit Saldo Virtual Platform (Ke Admin)

Seluruh operasional pembayaran antara Seller dan Admin (pembayaran biaya langganan SaaS, pembelian Platform Web-to-APK) menggunakan sistem deduksi/potongan dari **Saldo Virtual Platform (`Seller.balance`)**.

- Seller diwajibkan melakukan _Top Up_ / Deposit Saldo (Top Up Deposit Seller ke Admin).
- Proses _Top Up_ ini menggunakan integrasi Payment Gateway dari sisi Admin (misal: **Xendit API**).
- **Kebijakan Fee (Biaya Transaksi)**: Biaya layanan/fee Payment Gateway atas _Top Up_ ini **sepenuhnya ditanggung oleh Admin**. Artinya jika Seller melakukan deposit sebesar Rp 100.000, maka Saldo Virtual Platform Seller akan bertambah pas Rp 100.000, meskipun uang riil yang masuk ke rekening Admin mungkin telah dipotong fee (misal masuk 95.000). Hal ini untuk mempermudah kalkulasi biaya langganan secara bulat.

## 14. Manajemen Konten Store (Dokumen, Banner & Notifikasi - Support-API)

**Catatan:** Pemrosesan endpoint untuk artikel, banner, dan blast notifikasi kini berada di rute **Support-API** (sistem terpisah). Seller dapat mengelola tampilan dan informasi untuk antarmuka Toko B2C miliknya dengan batasan berdasarkan Paket Langganan (_Subscription Plan_):

- **Dokumentasi (`StoreDoc`)**: Seller bisa membuat artikel/panduan berformat markdown (.md) untuk dilihat Pelanggan Toko. Opsi ini dibatasi oleh limit paket.
- **Notifikasi B2C (`StoreNotification`)**: Seller bisa mem-_blast_ notifikasi ke pelanggannya dengan menyematkan link/tautan ke Dokumentasi (`StoreDoc`). Dibatasi oleh _Limit Quota Bulanan_ langganan.
- **Banner (`StoreBanner`)**: Seller bisa memasang banner di Dashboard pelanggan dengan tautan ke Dokumentasi (`StoreDoc`). Dibatasi oleh _Limit Tetap_ langganan.

**Mekanisme Suspend Downgrade (Resiliensi Limit)**:
Apabila Seller berada di batas maksimum, lalu melakukan _downgrade_ ke paket yang lebih rendah, **Sistem akan melakukan Suspend Otomatis** pada sisa kelebihannya.
_Contoh Kasus_: Seller di **Paket PRO** membuat maksimal 5 Banner. Esoknya ia langganannya turun ke **Paket BASIC** (maksimal 1 Banner). Maka 1 Banner terlama/terpilih akan tetap aktif, sedangkan **4 Banner sisanya akan otomatis ter-suspend (`isSuspended: true`)**.

1. **Tidak bisa ditukar**: Banner/Dokumentasi yang berstatus _Suspend_ **TIDAK BISA DIUBAH** atau ditukar-tukar dengan yang sedang aktif.
2. **Re-aktivasi**: _Suspend_ hanya bisa pulih/aktif kembali jika limit Store-nya sudah mencukupi (misalnya Seller melakukan pelunasan _Upgrade Paket_ lagi).

## 15. Preferensi Notifikasi Sistem untuk Seller (Seller Alert Settings)

Seller dapat mengatur preferensi bagaimana mereka menerima notifikasi sistem dari platform (contoh: Saat ada Deposit B2C masuk, ada Pendaftaran Customer Baru B2C, atau Transaksi Sukses/Gagal). Preferensi ini dikelola melalui tabel `SellerAlertSetting` (satu-ke-satu dengan `Seller`).

Fitur ini terikat pada Hak Akses Paket Langganan:

- **Tersedia apabila**: Paket yang dipilih mengaktifkan `hasEmailNotif` atau `hasWhatsappNotif`.
- **Media Pengiriman (Channel)**: Seller wajib memilih **salah satu** jalur notifikasi via kolom `activeChannel` (opsi: `EMAIL` atau `WHATSAPP`).
- **Pesan ke Support-API via SystemTask**: Jika Core-API mendeteksi suatu event, ia tidak langsung mengirim pesan. Melainkan, Core-API akan menyisipkan _Task_ di tabel `SystemTask` yang nantinya diproses dan dieksekusi oleh Worker _Support-API_.
- **Kostumisasi Peringatan (Toggles)**: Seller dapat memilih peringatan mana saja yang ingin mereka terima (misal: hanya men-_centang_ `notifyNewDeposit` dan mematikan `notifyTxSuccess`) agar terhindar dari _Spamming_.
