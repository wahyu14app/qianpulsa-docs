# Panduan AI: Pembuatan Seller App (Pemilik Toko)

Fokus utama: Dashboard operasi B2B bagi pemilik toko untuk mengelola infrastruktur retail mereka sendiri.

## Aturan Fundamental (Absolute Law)
Halaman awal dashboard ini **bergantung sepenuhnya** pada status penyewaan toko. Khusus untuk AI: Pahami secara absolut perbedaan **Platform Media** (wujud toko: Web, Android, iOS) dan **Subscription** (tier langganan fitur). Seller harus mempunyai Platform, lalu mensubscribe Paket Fitur.

Jika Seller baru saja mendaftar, **KUNCI SEMUA MENU** kecuali menu "Pilih Platform", "Pilih Paket Langganan" & "Deposit ke Admin Platform". Hanya setelah mereka memiliki Platform Media DAN langganan aktif, menu operasional terbuka. Semua keuntungan markup produk masuk ke akun Payment Gateway Seller secara mandiri, bukan ke platform Qianpulsa.

## Fase 1: Onboarding & Pembatasan Akun
1.  **Registration & Login**: Akses `SELLER` dan `SELLER_STAFF`.
2.  **The Paywall (Gerbang Berbayar)**: Jika belum memenuhi syarat operasional -> Layar hanya menampilkan billing/tagihan.
    - **Step 1:** Seller harus membeli **Platform Media** (Memilih berwujud Web, Android, atau iOS) agar tokonya memiliki eksistensi tayang.
    - **Step 2:** Seller harus membeli **Paket Langganan / Subscription** (Tingkatan fitur/tier) untuk membuka akses fungsional toko.
3.  **Store Configuration (Unlocked)**: Jika **kedua** syarat di atas (*Platform & Subscription*) dalam kondisi Aktif -> Pengaturan nama Toko, Domain/Subdomain, dan Banner Toko terbuka.

## Fase 2: Integrasi API Finansial & Provider (Krusial)
1.  **PG Keys**: Halaman bagi Seller untuk menyimpan kredensial Payment Gateway (Misal: API Key Xendit/Fazz/Tripay) SECARA AMAN di database `SellerApiSetting`.
2.  **PPOB Keys**: Halaman untuk menyimpan kunci Secret Digiflazz/MedanPedia milik Seller.
3.  **Connection Test**: Fitur untuk ping/validasi apakah API Key yang dipasang valid/aktif.

## Fase 3: Manajemen Produk & Pricing Strategy (Markup)
1.  **Synchronize Root Catalog**: Menarik daftar kategori dan produk pasif (dari Digiflazz asli).
2.  **Rule Editor (Markup)**: Layar pengatur strategi laba (Contoh: Kategori `Telkomsel` ditambah margin Rp 500, Kategori `Games` ditambah 2%). 
3.  **Active Storefront List**: Menampilkan etalase produk final (Harga Base + Markup) dan mendeteksi ketersediaan stok riil.

## Fase 4: Operasional CS & Intervensi Transaksi
1.  **Transaction History B2C**: Rekap pelanggan yang membeli di etalase/Store.
2.  **Manual Intervention**: **BAHAYA!** Fitur untuk mengubah status transaksi. Jika sebuah status transaksi = `PENDING`, berikan opsi tombol `Check Provider Status` (Sync realtime), `Paksa Gagal`, atau `Paksa Sukses`.  *(Ingatkan seller via peringatan UI Red-Dialog Alert mengenai risiko potong saldo manual jika memaksakan status).*
3.  **Customer Management**: Layar pengelola daftar pelanggan toko mereka. Dapat melakukan aksi klik untuk menambahkan/memotong saldo deposit (Manual Balance Adjustment) beserta memo alasannya (contoh: kompensasi, koreksi error).

---
**Status**: Siap untuk dieksekusi berdasarkan fase. Saat memulai tugas, AI **HARUS** mendeklarasikan fase mana yang sedang dikerjakan.
