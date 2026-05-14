# Ekosistem: Customer (Pelanggan)

## 1. Ikhtisar & Peran
Customer adalah pengguna akhir (pembeli) dalam ekosistem *Store* B2C. Mereka berinteraksi langsung dengan katalog toko digital milik Seller.

## 2. Alur Kerja Utama (*Key Workflows*)
- **Akses**: Pengunjung publik (View-only), Member terdaftar (Transaction/Saldo).
- **Checkout**: Model 1:1 (1 Produk + 1 Transaksi = 1 Pembayaran langsung/Direct Pay), tanpa *Cart*.
- **Tracking**: Pelanggan memantau status pesanan (status berubah via *Polling* sistem jika tidak ada *Callback*).
- **Keuangan**: Deposit saldo untuk kemudahan transaksi (Auto-refund jika gagal).

## 3. Data & Batasan (*Constraints*)
- **Entitas Utama**: `Customer`, `CustomerTier`, `CustomerDeposit`, `StoreOrder`.
- **Batasan**: Saldo Customer terikat pada per satu Toko (*multitenant*). Pendaftaran dilakukan secara mandiri oleh pembeli. Autentikasi wajib untuk akses transaksi.

## 4. Ketetapan Sistem (*System Rulings*)
- *Apakah Tier (`CustomerTier`) dan *pointsMultiplier* saat ini adalah fitur aktif atau fitur legacy yang tidak diimplementasikan?* -> Fitur loyalty/Cashback adalah fitur **Aktif**. *Points Multiplier* berfungsi sebagai pengali nilai Cashback poin saat Customer berbelanja, yang mana konfigurasi persentasenya diatur asali oleh Seller. Poin dapat dicairkan kembali menjadi Saldo Deposit toko.
- *Jika provider PPOB mengembalikan status "Pending" dalam waktu lama, adakah batasan waktu (misal: 24 jam) di mana sistem akan memaksa pembatalan transaksi dan melakukan *Auto-refund*?* -> **Ada (24 Jam)**. Sinkronisasi *cron job* memastikan tidak ada transaksi yang menggantung lewat dari 1 hari kalender. Dana otomatis di*refund* 100% jika status melewati batas tersebut.
- *Jika Seller melakukan intervensi manual terhadap transaksi Customer, bagaimana pemberitahuan (notifikasi) perubahannya dikirim kepada Customer?* -> Customer akan diberi tahu via **WhatsApp** (melalui Fonnte Integrations) seketika detik itu juga dan riwayat di halaman *Store App* secara reaktif (*realtime*) berubah warna/label (Misal: dari Kuning ke Hijau/Merah).
