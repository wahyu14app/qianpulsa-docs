# Core App: Struktur Routing & Endpoint

Untuk menjaga _skalabilitas_ aplikasi, kemudahan manajemen versi (versioning), dan menjaga _separation of concerns_, Core App memisahkan rute-rute API secara tegas ke dalam beberapa ruang nama (namespace). Seluruh rute utama menggunakan _prefix_ versi, misalnya `/api/v1`.

## 1. Pemisahan Modul Klien (Client-Facing APIs)

API yang diakses oleh _front-end_ klien dipisahkan berdasarkan peran penggunanya:

- **`/api/v1/admin/...`**
  Rute khusus untuk aplikasi **admin-app** (God-Mode).
  _Contoh:_ `/api/v1/admin/staffs`, `/api/v1/admin/users`, `/api/v1/admin/tickets`
  _Proteksi:_ JWT Staf/Admin (`SUPER_ADMIN` atau `STAFF`).

- **`/api/v1/seller/...`**
  Rute khusus untuk aplikasi **seller-app** (Dasbor Pemilik Toko).
  _Contoh:_ `/api/v1/seller/stores`, `/api/v1/seller/deposits`, `/api/v1/seller/tickets`
  _Proteksi:_ JWT Seller Inti / Staf Toko.

- **`/api/v1/store/...`**
  Rute khusus untuk aplikasi **store-app** (Etalase Konsumen B2C).
  _Contoh:_ `/api/v1/store/init`, `/api/v1/store/products`, `/api/v1/store/tickets`
  _Proteksi:_ JWT Konsumen + Header `x-store-domain`.

## 2. Struktur Webhook & Callback

Panggilan otomatis dari layanan pihak ketiga (seperti notifikasi pembayaran sukses dari Midtrans atau update status transaksi pulsa dari Digiflazz) dikelompokkan dalam direktori _webhook_. Rute ini **tidak** menggunakan JWT, melainkan bergantung pada otentikasi _Signature/Hash Key_ bawaan masing-masing vendor.

Pola Standar Webhook:
`/api/v1/webhook/{kategori}/{nama_vendor}`

_Contoh Implementasi:_

- **Payment Gateway (Notifikasi Pembayaran):**
  - `/api/v1/webhook/payment/midtrans` (Callback dari Midtrans)
  - `/api/v1/webhook/payment/xendit` (Callback dari Xendit)
  - `/api/v1/webhook/payment/tripay` (Callback dari Tripay)

- **Provider PPOB (Status Trx Pulsa/Game):**
  - `/api/v1/webhook/provider/digiflazz` (Callback notifikasi sukses/gagal dari Digiflazz)
  - `/api/v1/webhook/provider/apigames` (Bila di kemudian hari berekspansi ke API Games)

## 3. Rekomendasi Struktur Direktori (Backend)

Saat mulai merakit kode (seperti di Node.js / Express / Fastify), struktur berkas rute sebaiknya mencerminkan arsitektur di atas:

```text
/src
  /routes
    /v1
      /admin
        - staffs.routes.ts
        - configs.routes.ts
      /seller
        - stores.routes.ts
        - deposits.routes.ts
      /store
        - init.routes.ts
        - dashboard.routes.ts
      /webhook
        - midtrans.webhook.ts
        - digiflazz.webhook.ts
```

Pemisahan ini akan menghindari konflik kode dan memudahkan para pengembang untuk fokus pada satu batasan logic pada satu waktu.
