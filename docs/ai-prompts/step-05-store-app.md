# 🚀 Roadmap: Store App (B2C Storefront)

Fokus utama: Antarmuka pembeli akhir (Customer) yang cepat, responsif, dan mudah digunakan.

## Fase 1: Routing & Brand Identity
1.  **Dynamic Theming**: Render warna dan logo toko berdasarkan data dari database (sesuai domain yang diakses).
2.  **Navigation**: Menu kategori produk yang dinamis.

## Fase 2: Pengalaman Berbelanja
1.  **Quick Purchase**: Form order tanpa login (untuk pengunjung umum).
2.  **Balance System (Member)**: Sistem deposit saldo bagi pelanggan yang memiliki akun di toko tersebut.
3.  **Transaction Tracking**: Halaman cek status pesanan menggunakan nomor HP atau ID Transaksi.

## Fase 3: Keamanan & Kepercayaan
1.  **OTP Verification**: Verifikasi nomor HP saat pendaftaran pelanggan.
2.  **Invoice Generation**: Tampilan struk sukses yang bisa di-download atau di-share.
3.  **Responsive Design**: Optimasi PWA (Mobile-first) agar nyaman diakses lewat smartphone.

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