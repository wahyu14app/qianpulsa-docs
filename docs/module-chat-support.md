# Modul Chat Support (Ticketing In-App)

Ekosistem QianPulsa menyediakan layanan Customer Support interaktif dua arah yang berbasis **Tiket (Ticket-Based)**.

## 1. Arsitektur Komunikasi

Terdapat dua kanal (jalur) utama jenis tiket (`TicketType`) yang didukung:

1. **`ADMIN_SELLER`**: Tiket diskusi antara Seller dengan pusat sistem (Admin QianPulsa / Staf B2B).
2. **`SELLER_CUSTOMER`**: Tiket keluhan/tanya-jawab antara Customer (Pelanggan PPOB) di Store B2C dengan agen tokonya (Seller / Staf Toko).

> **Akses Penutupan Tiket:** Baik Admin, Seller, staf terkait maupun Customer (di Store tokonya) memiliki wewenang untuk menekan tombol **"Tutup Tiket"** manakala permasalahan dirasa telah usai.

## 2. Fitur Balasan & Lampiran (Attachments)

- Pesan tiket mendukung upload **Gambar Attachment** dari UI klien (sebagai bukti error/struk pembayaran otomatis).
- Lihat `docs/limits-and-constraints.md` untuk merujuk pada standar batas unggahan gambar (Max 2MB per gambar).

## 3. Pesan Otomatis & Template

Sistem dirancang untuk mempercepat respon terhadap masalah pengguna, maka diberlakukan:

- **Pesan Otomatis (System Greeting)**: Setiap tiket baru yang terbuka oleh Seller/Customer wajib ditimpali pesan _Greeting_ pertama secara otomatis dari sisi bot backend.
  - _Contoh System Message ke Customer_: "Halo, keluhan Anda telah kami terima dengan Nomor Tiket #XXXXX. Harap tunggu balasan Admin Toko sesaat lagi."
- **Template Pesan Cepat (Quick Reply)**:
  - Tersedia menu pembuatan template pesan oleh Admin bagi internal mereka (Untuk membalas Seller).
  - Tersedia pula menu _Add Template_ bagi Seller untuk mempermudah CS toko membalas keluhan pelanggan.
  - Template Chat disimpan di tabel `SupportTemplate`.

## 4. Cronjob Lifecycle & Auto-Close

Agar _database_ chat bersih dan performa indeks terjaga, _Backend Core_ perlu menerapkan _Job Scheduler / Cronjob / Queue_ (atau _Event Bridge_ jika _Serverless_) untuk mengeksekusi dua _lifecycle_ wajib:

1. **Auto-Close Inactive Tickets**:
   Sistem akan secara terpadu menscan seluruh Tiket berstatus `OPEN`. Apabila **tidak ada pergerakan/pesan lanjutan** dari hari ke hari dan melampaui masa `30 Hari` sejak pesan terakhir, tiket **WAJIB ditutup otomatis (`CLOSED`)** dengan pesan intervensi dari sistem.
2. **Auto-Delete Old Data**:
   Seluruh Tiket berstatus `CLOSED` yang lama tidak aktif dan telah melewati masa tenggang **Lebih dari 2 Tahun** wajib **Dihapus Permanen (`DELETE` secara hard-delete / Cascade ke Message-nya)** dari Database tanpa ampun. Hal ini menghemat _Storage_.

## 5. Rute Dasar (Endpoint)

### Jalur Admin <-> Seller (`TicketType = ADMIN_SELLER`)

- **POST `/api/v1/seller/tickets`**: Seller membuka tiket baru untuk bertanya kepada Pusat.
- **GET `/api/v1/admin/tickets`**: Admin melihat daftar tiket dari para Seller.
- **POST `/api/v1/admin/tickets/{ticketId}/messages`**: Admin me-reply tiket dari Seller.
- **PATCH `/api/v1/admin/tickets/{ticketId}/close`**: Admin menutup tiket (atau jika Seller `.../seller/tickets/{ticketId}/close`).
- **CRUD `/api/v1/admin/ticket-templates`**: Manajemen Quick Reply oleh Admin.

### Jalur Seller <-> Customer (`TicketType = SELLER_CUSTOMER`)

- **POST `/api/v1/store/tickets`**: Customer (dari Store-App) membuat tiket keluhan untuk Penjualnya (Seller).
- **GET `/api/v1/seller/store-tickets`**: Seller (dari Seller-App/B2B panel) membuka kotak pesan dari pelanggan tokonya.
- **POST `/api/v1/seller/store-tickets/{ticketId}/messages`**: CS Toko/Seller merespon tiket Customer.
- **PATCH `/api/v1/store/tickets/{ticketId}/close`**: Customer menyudahi percakapan dan menutup tiket di tokonya.
- **CRUD `/api/v1/seller/ticket-templates`**: Seller menyusun template Quick Reply khusus untuk toko mereka.
