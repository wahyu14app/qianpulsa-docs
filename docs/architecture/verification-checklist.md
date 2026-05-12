# ✅ Panduan Tahap Pengecekan (Verification Checklist)

Gunakan checklist ini setelah menyelesaikan sebuah fitur atau sebelum melakukan *deployment* untuk memastikan aplikasi berjalan sesuai standar.

---

## 1. Pengecekan Database & Skema
- [ ] **Data Integrity**: Apakah `prisma migrate` sudah sinkron dengan `database-schema.md`?
- [ ] **Seeder Check**: Apakah data Super Admin dan Paket Langganan sudah ada di DB?
- [ ] **Relations**: Apakah penghapusan data (misal menghapus Store) menangani relasi dengan benar (Protect/Cascade)?

## 2. Keamanan & Autentikasi
- [ ] **JWT Guard**: Apakah route `/api/v1/admin/*` menolak token milik Seller?
- [ ] **Role Validation**: Apakah Seller tidak bisa merubah harga `GlobalProduct` (Hanya bisa merubah `StoreProduct`)?
- [ ] **Webhook Security**: Apakah endpoint Xendit memverifikasi `x-callback-token`?
- [ ] **No Hardcoded Keys**: Apakah sistem mengambil kredensial Digiflazz/Xendit secara dinamis dari DB (Bukan dari `.env`) untuk transaksi B2C?
- [ ] **Zod Parsing**: Apakah input string kosong atau tipe data salah pada Request Body tertangkap oleh validator?

## 3. Logika Bisnis & Saldo (Kritis)
- [ ] **Double Spending**: Apakah sistem menolak jika Seller melakukan klik beli 2x secara sangat cepat (uji dengan konkurensi)?
- [ ] **Idempotency**: Apakah Webhook Xendit yang dipanggil 2x untuk Invoice yang sama tidak menambah saldo 2x?
- [ ] **Markup Logic**: Apakah harga yang dibayar pembeli sudah termasuk (Harga Modal + Markup)?
- [ ] **Audit Trail**: Apakah setiap perubahan saldo (Seller/Buyer) tercacat di tabel riwayat transaksi?

## 4. Multitenancy (Store App)
- [ ] **Domain Isolation**: Apakah data produk Toko A bocor saat diakses via domain Toko B?
- [ ] **Header Presence**: Apakah API Storefront mengirimkan error `400` jika header `x-store-domain` hilang?

## 5. Integrasi Pihak Ketiga
- [ ] **Digiflazz Connection**: Apakah saldo vendor terbaca di Dashboard Admin?
- [ ] **Gmail Service**: Apakah OTP terkirim ke email dalam waktu kurang dari 10 detik?
- [ ] **Fonnte/WA**: Apakah notifikasi transaksi berhasil terkirim ke WhatsApp user?

## 6. Performa & Batasan
- [ ] **Pagination Check**: Apakah list produk sudah menggunakan `limit` dan `page`?
- [ ] **Error Message**: Apakah format error sudah mengikuti standar JSON `{ success: false, message: "..." }` (Tanpa membocorkan stack trace ke klien)?

---

**STATUS AKHIR**: Aplikasi dinyatakan **Siap Produksi** jika tingkat kelulusan checklist di atas mencapai **100%**.
