# 🚀 Roadmap: Admin App (Pusat Kontrol)

Fokus utama: Panel manajemen untuk pemilik platform (Super Admin).

## Fase 1: Autentikasi Admin
1.  **Secure Login**: Akses khusus untuk peran Admin.
2.  **Admin Profile**: Pengaturan akun dan log aktivitas admin.

## Fase 2: Master Data & Konfigurasi
1.  **Global Product Management**: Sinkronisasi produk dari Digiflazz ke katalog pusat.
2.  **Subscription Tier Management**: Mengatur harga dan limit paket (Basic, Pro, Enterprise).
3.  **Category Mapping**: Mengatur kategori produk (Pulsa, Data, Game, E-Wallet).

## Fase 3: Pengawasan Seller & Sistem Bantuan
1.  **Seller Verification**: Menyetujui atau menolak pendaftaran Seller baru.
2.  **Balance Monitoring**: Melihat dan melakukan intervensi manual pada saldo Seller jika diperlukan.
3.  **Support Center**: Membalas dan menutup tiket bantuan dari Seller.

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