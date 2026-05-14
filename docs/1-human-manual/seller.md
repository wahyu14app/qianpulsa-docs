# Ekosistem: Seller (Pemilik Toko)

## 1. Ikhtisar & Peran
Seller merupakan target B2B dari platform QianPulsa, yang memposisikan diri sebagai agen distributor/pemasalah produk PPOB. Seller mengelola entitas **Toko (Store)**.

## 2. Alur Kerja Utama (*Key Workflows*)
- **Pendaftaran**: Pendaftaran otomatis disetujui. Setelah daftar, akun dalam kondisi *Suspended* (hanya akses Menu Deposit).
- **Onboarding**: Beli **Platform Media** (Beli wujud toko: Web/Android/iOS) -> Beli **Paket Langganan / Subscription Plan** (Beli tier fitur operasional) -> Toko diaktifkan (Kanvas kosong).
- **Konfigurasi Operasional**: Integrasi API PPOB (Digiflazz) & Payment Gateway (milik seller sendiri), Markup harga, Manajemen Status Transaksi.
- **Manajemen Staf**: `ROOT_SELLER` dapat mengelola beberapa akun `SELLER_STAFF` (email unik & independen).

## 3. Data & Batasan (*Constraints*)
- **Entitas Utama**: `Seller`, `SellerStaff`, `SellerApiSetting`, `SellerDeposit`, `Store`.
- **Batasan**: Platform bertindak sebagai SaaS, *Direct Integration* (dana masuk ke Payment Gateway Seller sendiri, bukan platform). Tidak ada fitur *Withdrawal* karena tidak menahan uang B2C.
- **Intervensi Transaksi**: Seller mengelola transaksi `PENDING`. Perubahan manual status transaksi (gagal/sukses) memiliki konsekuensi otomatis pada saldo Customer (refund/tetap).

## 4. Ketetapan Sistem (*System Rulings*)
- *Jika API Gateway Seller (Payment/PPOB) *down* atau kredensial tidak valid, bagaimana penanganan *user experience* pada level Toko?* -> Sistem akan otomatis menonaktifkan fitur bersangkutan. Jika PPOB *down*/salah, produk berubah menjadi abu-abu (*Stock Empty/Gangguan*). Jika Payment Gateway salah, pembayaran otomatis disembunyikan dari *Store Checkout*.
- *Apakah Seller diperbolehkan memberi hak akses *custom* bagi staf, atau hak akses sudah terikat/ *hardcoded* pada peran?* -> Sudah **Hardcoded** sesuai *Role Enum* (`CS`, `FINANCE`, `OPERATOR`) demi menyederhanakan *user experience* Seller dari beban manajemen mikro.
- *Bagaimana jika *callback* provider tidak masuk (transaksi *stuck* di *Pending*)? Adakah batas waktu otomatis gagal?* -> **Ya**, terdapat *Cron Job* dengan Time-to-Live 24 Jam. Transaksi B2C yang bergantung (stuck) di atas 24 jam akan secara mandiri dipaksa berstatus *FAILED* dan saldo akan langsung direfund otomatis ke dompet *Customer*.
