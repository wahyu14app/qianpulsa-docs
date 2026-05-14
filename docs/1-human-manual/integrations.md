# Ekosistem: Integrasi Pihak Ketiga (3rd Party Integrations)

## 1. Ikhtisar & Peran
Dokumen ini mendefinisikan layanan pihak ketiga penggerak operasional sistem QianPulsa. Mengusung konsep *Decentralized Credentials*, platform (SaaS) hanya menyediakan "Mesin Integrasi", sementara "Bahan Bakar" (API Key) dipasok dari akun masing-masing Seller. Pengecualian hanya pada integrasi yang bersifat global platform (seperti email/notifikasi).

## 2. Alur Kerja Utama (*Key Workflows*)
- **Product & Fulfillment (PPOB)**:
  - **Digiflazz**: Penyedia tunggal/utama untuk produk digital instan. URL Callback dari Digiflazz akan secara otomatis di-routing oleh *Core API* ke transaksi *StoreOrder* yang sesuai.
- **Payment Gateway (PG)**:
  - Dukungan modul terintegrasi untuk: **Xendit, Midtrans, Cek Mutasi, dan TokoPay**.
  - Pembayaran pembelian Platform (oleh Seller) akan masuk ke PG milik Admin.
  - Pembayaran B2C (oleh Customer) akan masuk langsung ke PG milik Seller (*Direct Settlement*).
- **Notifikasi & Komunikasi**:
  - **Fonnte**: WhatsApp Gateway untuk notifikasi pendaftaran, OTP, verifikasi, dan penyelesaian transaksi.
  - **Resend**: Platform layanan email relasional untuk *invoice*, *forgot password*, dan pemberitahuan berlangganan.

## 3. Data & Batasan (*Constraints*)
- **Entitas Utama**: `SellerApiSetting`, `StorePaymentMethod`, `WebhookLog`.
- **Batasan**: Platform secara bawaan tidak menyediakan produk fisik. *Uptime* atau ketersediaan stok seutuhnya bergantung pada ketersediaan API pihak ketiga.

## 4. Ketetapan Sistem (*System Rulings*)
- *Bagaimana penanganan jika callback dari Payment Gateway hilang/gagal mencapai server?* -> Di dalam *Store App* maupun *Seller App*, disediakan tombol khusus "Check Payment Status" yang akan melakukan sinkronisasi paksa dengan menembak API PG (REST API GET) untuk mencari status mutakhir tanpa perlu menunggu *webhook*.
- *Apakah PPOB & PG milik Seller dienkripsi dalam database?* -> **Ya**, seluruh *API Key* dan *Secret* disimpan dengan enkripsi *symmetric* pada level database untuk memitigasi kebocoran kredensial (kecuali *webhook URL* yang bersifat publik).
- *Apakah notifikasi WA(Fonnte)/Email(Resend) juga membutuhkan akun Seller?* -> **Tidak**. Layanan notifikasi menggunakan *shared credentials* (biaya operasional ditanggung) dari platform induk (Admin) demi menjaga keandalan infrastruktur OTP dan *invoice*. Kustomisasi pesan hanya memungkinkan jika di-izinkan di paket langganan tinggi.
