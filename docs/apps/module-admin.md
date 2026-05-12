# Core App: Spesifikasi Modul Admin

Modul Admin (`/api/v1/admin/*`) adalah rute eksklusif yang mengamankan fungsionalitas panel kontrol utama (God-Mode). (Struktur tabel merujuk pada `Admin` di [Skema Database Global](/docs/database-schema)).

## 1. Skema Profit Platform (Penting!)

Sumber pendapatan atau keuntungan (Profit) bagi pemilik platform (Admin QianPulsa) **MURNI** berasal dari dua sumber:

1. **Pembelian Platform (Platform Type)**: Seller yang ingin aplikasinya dibuatkan dalam bentuk Android atau iOS akan membayar (sekali bayar). _Catatan: Pembuatan Android/iOS ini pada dasarnya adalah membungkus web (Web-to-APK / WebView/PWA) ke dalam aplikasi native._
2. **Biaya Langganan (SaaS Subscription)**: Seller membayar langganan per bulan untuk mengaktifkan tokonya.

**PENTING**: Admin QianPulsa **TIDAK** mengambil margin per-transaksi (potongan / markup / biaya layanan per-transaksi PPOB pembeli). Margin transaksi prabayar sepenuhnya milik Seller yang memiliki toko tempat transaksi tersebut berlangsung.

## 2. Manajemen Paket Langganan SaaS (Subscription Plans)

Paket langganan (`SubscriptionPlan`) sengaja dipatenkan menjadi **tepat 3 tingkatan (Paten: 1=BASIC, 2=PRO, 3=ENTERPRISE)**.

- Admin **TIDAK DIIZINKAN** untuk menghapus (DELETE) tabel/row paket berlangganan ini demi menjaga agar sistem tidak bingung.
- Admin hanya diperbolehkan melakukan Edit (UPDATE) pada Nama Paket, Harga, maupun fasilitas fiturnya (Fitur Reset Quota bulanan, Fitur Limit tetap, dan Fitur Akses Boolean).
- **Mekanisme Copy State Fleksibel**: Ketika ada perubahan data paket oleh Admin, Toko (Store) yang sebelumnya terdaftar _TIDAK AKAN RUSAK_. Karena setiap tabel `Store` menyimpan/meng-copy langsung kapabilitas paket (seperti batas maksimal banner, kuota maksimal notifikasi bulanan, atau akses widget live chat) sesaat setelah Seller meng-_upgrade/downgrade_ langganannya.

## 3. Dokumentasi, Banner, & Notifikasi Platform (Ditangani oleh Support-API)

Admin dapat mempublikasikan informasi sistem (pengumuman, panduan, dsb) kepada seluruh jaringan _Seller_. **Catatan:** Seluruh fitur berikut kini diolah dan dilayani melalui rute/layanan **Support-API**:

- **Dokumentasi (`AdminDoc`)**: Admin dapat membuat dan menerbitkan file dokumentasi berformat _.md (markdown)_ **tanpa batas**. Dokumen ini dapat diatur visibilitasnya (ditampilkan/disembunyikan).
- **Banner (`AdminBanner`)**: Admin dapat mengunggah dan menampilkan _banner_ sistem **tanpa batas** kuota. Banner ini bisa disematkan tautan langsung ke _Dokumentasi (`AdminDoc`)_ yang sudah dibuat sebelumnya.
- **Notifikasi (`AdminNotification`)**: Admin dapat mem-broadcast pesan _In-App_ yang terikat ke suatu _Dokumentasi_. Notifikasi dari Admin ini **selalu tampil mengambang di _Seller App_** sampai Admin yang bersangkutan menonaktifkan atau menghapusnya.

## 4. Autentikasi Admin (Only Login)

Panel admin bersifat tertutup (private). **Tidak ada endpoint registrasi otomatis untuk Admin/Staff dari sisi front-end.** Akun Admin pertama (Super Admin) dibuat melalui skrip _Database Seeding_ saat inisialisasi aplikasi. Kredensial default untuk environment awal adalah email: **wahyu14app@gmail.com** dan password: **password123**.

**Endpoint:** `POST /api/v1/admin/auth/login`

- **Request Payload:**
  ```json
  {
    "email": "admin@qianpulsa.com",
    "password": "securepassword"
  }
  ```
- **Response Sukses:**
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
      "user": {
        "id": "uuid-abcd...",
        "name": "Super Admin",
        "email": "admin@qianpulsa.com",
        "role": "SUPER_ADMIN"
      }
    }
  }
  ```

## 5. Management Staff

Fitur Manajemen Staff hanya dapat diakses oleh role `SUPER_ADMIN`.

**Apa itu Staff?**
Staff adalah pekerja operasional harian yang membantu merespon kendala seller, mengecek riwayat transaksi (PPOB), dan menyetujui mutasi saldo secara manual jika _payment gateway_ sedang bermasalah.

**Perbedaan Kemampuan (Capabilities):**

- **SUPER_ADMIN:** Memiliki hak istimewa penuh. Dapat menambah/mengedit akun Staff, menonaktifkan (_suspend_) akses Staff, mengubah konfigurasi global PPOB, melihat _revenue/profit_, dan menghapus data.
- **STAFF:** Hanya dapat melakukan aksi _Read_ atau manipulasi ringan seperti merespon komplain, melihat transaksi pelanggan, namun TIDAK BISA mengakses menu "Management Staff" atau laci keuangan global.

### A. Endpoint Tambah Staff (Create)

**Endpoint:** `POST /api/v1/admin/staffs` (Hanya bisa diakses JWT beralamat `role: SUPER_ADMIN`).

- **Request Payload:**
  ```json
  {
    "name": "Budi Staff",
    "email": "budi.ops@qianpulsa.com",
    "password": "initialpassword123"
  }
  ```
  _(Backend akan men-hash password lalu menaruh default role "STAFF")_
- **Response Sukses:**
  ```json
  {
    "success": true,
    "message": "Akun staff berhasil dibuat.",
    "data": {
      "id": "uuid-xyz...",
      "name": "Budi Staff",
      "email": "budi.ops@qianpulsa.com",
      "role": "STAFF",
      "isActive": true
    }
  }
  ```

### B. Endpoint Daftar Staff (Read)

**Endpoint:** `GET /api/v1/admin/staffs`

- **Response Sukses:**
  ```json
  {
    "success": true,
    "message": "Data staff berhasil diambil",
    "data": [
      {
        "id": "uuid-xyz...",
        "name": "Budi Staff",
        "email": "budi.ops@qianpulsa.com",
        "role": "STAFF",
        "isActive": true,
        "createdAt": "2024-05-10T12:00:00Z"
      }
    ],
    "meta": { "total": 1 }
  }
  ```

### C. Endpoint Nonaktifkan Staff (Suspend/Update)

Jika staff _resign_ atau diberhentikan, Admin menggunakan endpoint ini untuk mencabut akses (Soft-Delete / Set Inactive). Jangan gunakan perintah `DELETE` di DB agar pelacakan history (audit trails) transaksi yang dilakukan oleh Staff tersebut tidak terputus (_broken relationship_).

**Endpoint:** `PUT /api/v1/admin/staffs/{id}/status`

- **Request Payload:**
  ```json
  {
    "isActive": false
  }
  ```
- **Response Sukses:**
  ```json
  {
    "success": true,
    "message": "Status staff berhasil diperbarui."
  }
  ```
