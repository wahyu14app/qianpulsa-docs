# Ekosistem: Store (Toko)

## 1. Ikhtisar & Peran
Entitas *Store* adalah infrastruktur layanan B2C. Berbasis *multitenancy* di mana setiap *Store* menempati domain/subdomain unik untuk identitas *brand* toko digital Seller.

## 2. Alur Kerja Utama (*Key Workflows*)
- **Identity Setup**: Pembuatan domain/subdomain toko oleh Seller.
- **Produk**: Sinkronisasi katalog produk dari akun PPOB Seller (Direct Integration).
- **Strategi Harga**: Penerapan Markup (Flat/Persentase) global atau per kategori.
- **Transaksi**: Layanan B2C (Direct Pay), pembayaran manual (WA) atau otomatis (PG).

## 3. Data & Batasan (*Constraints*)
- **Entitas Utama**: `Store`, `StoreDomain`, `StorePaymentMethod`, `StoreMarkupRule`, `StoreCategory`.
- **Batasan**: Konfigurasi toko (metode pembayaran, aktif tidaknya CS) tergantung pada paket langganan yang dibeli Seller. Operasional toko (termasuk CS B2C) sepenuhnya tanggung jawab Seller.

## 4. Ketetapan Sistem (*System Rulings*)
- *Bagaimana penanganan konflik jika dua *Store* mencoba memakai domain/subdomain atau *slug* yang sama?* -> Sistem Core API menerapkan validasi *Unique Constraint*. Pendaftar pertama berhak atas *slug* subdomain tersebut (First Come First Serve).
- *Berapa frekuensi *Auto-sync* katalog produk dari provider? Apakah dilakukan secara *realtime* atau terjadwal (cron job)?* -> Data *Base Price* ditarik melalui *Daily Cron Job* pasif (misal tengah malam). Namun, ketersediaan Stok Riil (Empty/Available) hanya akan dicek sesaat ketika Customer menekan produk atau mengakses form *Checkout* demi meminimalisasi *rate-limit* Digiflazz.
- *Pada *Payment Method* manual (WA), bagaimana alur verifikasi pesanan oleh CS *Seller* dilakukan di dalam sistem agar transaksi berubah menjadi sukses?* -> CS Seller akan mendapatkan pemberitahuan form via WA, lalu masuk ke Web *Seller App* -> Menu Deposit / Pesanan, kemudian menekan tombol "Setujui Manual". Aksi Web ini yang akan mentrigger injeksi saldo deposit ke Customer.
