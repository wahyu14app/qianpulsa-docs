# 🚀 Roadmap: Seller App (B2B Dashboard)

Fokus utama: Dashboard bagi pemilik toko untuk mengelola bisnis mereka.

## Fase 1: Onboarding & Pengaturan Toko
1.  **Registration & Login**: Pendaftaran Seller dan verifikasi akun.
2.  **Store Discovery**: Membuat entitas Toko (Store) dan menentukan domain/subdomain.
3.  **Subscription Purchase**: Membeli atau memperpanjang paket langganan menggunakan Saldo Virtual.

## Fase 2: Manajemen Produk & Markup
1.  **Store Catalog**: Memilih produk dari katalog global untuk ditampilkan di toko sendiri.
2.  **Pricing Strategy**: Mengatur rules markup (Flat & Persentase) baik global maupun per kategori.
3.  **Inventory Monitoring**: Memantau stok (dari provider) dan status aktif produk.

## Fase 3: Operasional & Laporan
1.  **Transaction History**: Melihat semua transaksi yang terjadi di Store miliknya (B2C).
2.  **Finance Report**: Laporan laba/rugi berdasarkan margin markup.
3.  **Customer Management**: Mengelola daftar pembeli terdaftar dan mengubah status akun mereka.

---
**Status**: Siap untuk dieksekusi berdasarkan fase. Saat memulai tugas, AI **HARUS** mendeklarasikan fase mana yang sedang dikerjakan.

**ATURAN EKSEKUSI (PENTING)**:
1. Kerjakan **HANYA SATU FASE** dari daftar di atas.
2. Setelah selesai, **EDIT DOKUMEN INI** (tambahkan tanda `[x]` atau `(SELESAI)` pada nama fase yang berhasil diselesaikan) untuk mencatat progress.
3. **BERHENTI SEPENUHNYA** dan berikan laporan selesainya fase tersebut kepada User.
4. Tunggu persetujuan User ("Lanjut ke Fase X") sebelum menulis kode untuk fase berikutnya.

**Prasyarat Pekerjaan**:
- Pastikan semua file di `/docs/architecture/` sudah dipahami sebelum menyentuh kode.
- Selalu merujuk pada `/docs/architecture/database-schema.md` sebelum melakukan perubahan skema.