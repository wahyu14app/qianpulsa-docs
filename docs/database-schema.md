# Core App: Skema Database Global (Prisma)

**PERINTAH UNTUK AI:** Saat membuat API atau Query, gunakan _exact definition_ dari skema di bawah. Skema ini telah mendukung secara utuh Relasi Pembelian Platform, Langganan, Deposit Seller (Topup) via Payment Gateway, dan Pengaturan Rekening Manual & API Provider untuk Seller.

## Skema Prisma Terpusat

```prisma
// -----------------------------------------------------
// Konfigurasi Klien dan Provider
// -----------------------------------------------------
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // WAJIB PostgreSQL (Dev & Prod). SQLite tidak didukung karena penggunaan `enum` dan `Json`.
  url      = env("DATABASE_URL")
}

enum DepositMethod {
  MANUAL
  PAYMENT_GATEWAY
  CEK_MUTASI
}

// -----------------------------------------------------
// 1. Modul Pengguna (Admin & Staf)
// -----------------------------------------------------
enum AdminRole {
  SUPER_ADMIN
  STAFF
}

model Admin {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String    // Wajib di-hash (Bcrypt/Argon2)
  name      String
  role      AdminRole @default(STAFF)
  isActive  Boolean   @default(true) // Untuk mematikan akses tanpa menghapus histori
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  tickets   SupportTicket[]
}

// Dokumen markdown yang dibuat Admin tanpa batas
model AdminDoc {
  id        String   @id @default(uuid())
  title     String
  content   String   @db.Text // Isi markdown
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  adminBanners AdminBanner[]
  adminNotifs  AdminNotification[]
}

// Notifikasi sistem ke Seller App, selalu tampil hingga dinonaktifkan Admin
model AdminNotification {
  id        String   @id @default(uuid())
  title     String
  content   String   @db.Text
  isActive  Boolean  @default(true)
  docId     String?  // Berlaku opsional jika dikaitkan dengan dokumen
  createdAt DateTime @default(now())

  doc       AdminDoc? @relation(fields: [docId], references: [id], onDelete: SetNull)
}

// Banner sistem ke Seller App, tanpa batas
model AdminBanner {
  id        String   @id @default(uuid())
  title     String
  imageUrl  String
  isActive  Boolean  @default(true)
  docId     String?
  createdAt DateTime @default(now())

  doc       AdminDoc? @relation(fields: [docId], references: [id], onDelete: SetNull)
}

// -----------------------------------------------------
// 2. Modul Seller (Pemilik Toko B2B)
// -----------------------------------------------------
model Seller {
  id        String   @id @default(uuid())
  phone     String   @unique
  email     String   @unique
  password  String
  name      String
  balance   Decimal  @default(0.00) @db.Decimal(15, 2) // Dipakai untuk membeli platform/langganan
  status    String   @default("ACTIVE") // ACTIVE, SUSPENDED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  stores        Store[]
  depositTrans  SellerDeposit[]
  platforms     SellerPlatform[]
  subscriptions SellerSubscription[]
  apiSettings   SellerApiSetting?
  alertSettings SellerAlertSetting?
  tickets       SupportTicket[]
}

// Akun Staf Toko. Tabel terpisah agar email staf tetap bisa daftar sebagai Seller mandiri
model SellerStaff {
  id          String   @id @default(uuid())
  storeId     String
  email       String
  password    String   // Hashed
  name        String
  role        String   @default("CS") // CS, FINANCE, OPERATOR
  isActive    Boolean  @default(true)
  isSuspended Boolean  @default(false) // Jika limit kuota terlampaui saat downgrade paket
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  // Dalam 1 toko tidak boleh ada email duplikat, namun 1 email bisa memegang staf di toko lain.
  @@unique([storeId, email])
}

// Histori topup deposit saldo Seller (Integrasi Xendit Payment Gateway aplikasi pusat)
model SellerDeposit {
  id          String   @id @default(uuid())
  sellerId    String
  amount      Decimal  @db.Decimal(15, 2)
  status      String   @default("PENDING") // PENDING, SUCCESS, FAILED
  paymentUrl  String?  // URL Checkout Xendit
  xenditId    String?  @unique // Invoice ID Xendit
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  seller      Seller   @relation(fields: [sellerId], references: [id])
}

// --- Manajemen Platform & Berlangganan Seller ---

model PlatformType {
  id          String   @id @default(uuid())
  name        String   @unique // Contoh: "WEB", "ANDROID", "IOS"
  price       Decimal  @db.Decimal(15, 2)
  description String?

  sellerPlatforms SellerPlatform[]
}

model SubscriptionPlan {
  id              String   @id @default(uuid())
  level           Int      @unique // 3 Tingkatan (Paten: 1=BASIC, 2=PRO, 3=ENTERPRISE)
  name            String   @unique // Hanya bisa diedit (Nama, Harga, Fitur), tapi row TIDAK BOLEH dihapus
  price           Decimal  @db.Decimal(15, 2)
  durationDays    Int      @default(30)
  autoSyncEnabled Boolean  @default(false) // Jadwal 1 jam sekali sinkronisasi harga ke provider

  // -- Tipe Quota (Reset Bulanan) --
  maxMonthlyNotif Int      @default(0) // Kuota broadcast notifikasi Store per bulan

  // -- Tipe Limit Tetap (Fixed Static) --
  maxBanners      Int      @default(0) // Kuota maksimal banner yang bisa dipasang di Store
  maxDocs         Int      @default(0) // Kuota maksimal dokumen (.md) yang bisa dibuat Store
  maxStaffs       Int      @default(0) // Kuota maksimal staff yang bisa ditambahkan oleh Seller

  // -- Tipe Akses (Boolean) --
  hasLiveChat     Boolean  @default(false) // Boleh pasang widget Live Chat atau tidak
  hasWhatsappNotif Boolean @default(false) // Boleh menetapkan notifikasi via WhatsApp (Fonnte)
  hasEmailNotif   Boolean  @default(false) // Boleh menetapkan notifikasi via Email (Gmail API)
  hasB2CInAppNotif Boolean @default(false) // Boleh mengaktifkan Notifikasi In-App (Personal) untuk Customer di Store B2C

  sellerSubs      SellerSubscription[]
}

model SellerPlatform {
  id             String   @id @default(uuid())
  sellerId       String
  platformTypeId String
  createdAt      DateTime @default(now())

  seller         Seller       @relation(fields: [sellerId], references: [id])
  platformType   PlatformType @relation(fields: [platformTypeId], references: [id])

  @@unique([sellerId, platformTypeId])
}

model SellerSubscription {
  id                 String   @id @default(uuid())
  sellerId           String
  subscriptionPlanId String
  startDate          DateTime @default(now())
  endDate            DateTime
  isActive           Boolean  @default(true)

  seller             Seller           @relation(fields: [sellerId], references: [id])
  subscriptionPlan   SubscriptionPlan @relation(fields: [subscriptionPlanId], references: [id])
}

// Konfigurasi Kredensial Pihak ke-3 Milik Seller
model SellerApiSetting {
  id              String   @id @default(uuid())
  sellerId        String   @unique
  xenditKey       String?  // Kunci Rahasia Xendit milik Seller pribadi
  midtransKey     String?
  digiflazzUser   String?  // Username Digiflazz Seller
  digiflazzKey    String?  // API Key Digiflazz Seller
  
  // Konfigurasi Multi-Provider PPOB lainnya (Selain Digiflazz)
  // Struktur JSON wajib mengikuti spesifikasi di docs/module-seller.md (Section 10)
  providerConfigs Json?    
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  seller          Seller   @relation(fields: [sellerId], references: [id], onDelete: Cascade)
}

// Preferensi Notifikasi Sistem untuk Seller via Email / WhatsApp
model SellerAlertSetting {
  id                String   @id @default(uuid())
  sellerId          String   @unique
  activeChannel     String   @default("EMAIL") // "EMAIL", "WHATSAPP", atau "NONE"
  waNumber          String?  // Tujuan notifikasi jika pilih WHATSAPP
  emailAddress      String?  // Tujuan notifikasi jika pilih EMAIL

  // Opsi Enable/Disable Event
  notifyNewDeposit  Boolean  @default(true) // Deposit baru dari sub-agen/customer
  notifyNewCustomer Boolean  @default(true) // Registrasi Pelanggan Toko baru
  notifyTxSuccess   Boolean  @default(false) // Transaksi sukses
  notifyTxFailed    Boolean  @default(true)  // Transaksi gagal (Butuh intervensi/refund)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  seller            Seller   @relation(fields: [sellerId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------
// 3. Modul Store (Toko B2C)
// -----------------------------------------------------
model Store {
  id          String   @id @default(uuid())
  sellerId    String
  slug        String   @unique // URL Path routing, cth: qianpulsa.com/:slug
  domain      String?  @unique // Mendukung Custom Domain
  name                String
  themeColor          String?        @default("#111827")
  activeDepositMethod         DepositMethod  @default(MANUAL)

  // UI & Branding Configurations
  useSplashScreen             Boolean        @default(false)
  landingPageConfig           Json?          // JSON Data berstruktur untuk Landing Page (slogan, deskripsi, fitur, dll)

  // Aturan Harga Default (Bila tidak ada aturan per-kategori yang cocok)
  globalMarkupFlat            Decimal        @default(0.00) @db.Decimal(15, 2)
  globalMarkupPercent         Decimal        @default(0.00) @db.Decimal(5, 2)

  // --- SNAPSHOT PAKET LANGGANAN (Copy State) ---
  // Data berikut di-copy dari tabel Subscription saat perpanjang/upgrade untuk menjaga resiliensi fitur
  subMaxBanners               Int            @default(0)     // Limit tetap (maks banner di Store)
  subMaxDocs                  Int            @default(0)     // Limit tetap (maks dokumen di Store)
  subMaxStaffs                Int            @default(0)     // Limit tetap (maks staff toko di Store)
  subMaxNotifQuota            Int            @default(0)     // Kuota bulanan
  subNotifUsed                Int            @default(0)     // Track kuota terpakai (direset bulanan)
  subHasLiveChat              Boolean        @default(false) // Akses fitur boolean
  subHasWhatsappNotif         Boolean        @default(false)
  subHasEmailNotif            Boolean        @default(false)
  subHasB2CInAppNotif         Boolean        @default(false)
  // ---------------------------------------------

  createdAt                   DateTime       @default(now())
  updatedAt                   DateTime       @updatedAt

  seller          Seller               @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  customers       Customer[]
  paymentMethods  StorePaymentMethod[]
  customerDeposits CustomerDeposit[]
  notifications   StoreNotification[]
  banners         StoreBanner[]
  docs            StoreDoc[]
  staffs          SellerStaff[]
  markupRules     StoreMarkupRule[]
  customerTiers   CustomerTier[]
  orders          StoreOrder[]
  tickets         SupportTicket[]
}

// -----------------------------------------------------
// Aturan Markup berdasarkan Rentang Harga (Per Kategori)
// -----------------------------------------------------
model StoreMarkupRule {
  id              String   @id @default(uuid())
  storeId         String
  categoryId      String   // ID Kategori PPOB (Contoh: "PULSA_REGULER")
  minBasePrice    Decimal  @default(0.00) @db.Decimal(15, 2)
  maxBasePrice    Decimal? @db.Decimal(15, 2) // Jika null, tak terhingga
  markupFlat      Decimal  @default(0.00) @db.Decimal(15, 2)
  markupPercent   Decimal  @default(0.00) @db.Decimal(5, 2)
  createdAt       DateTime @default(now())

  store           Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
}

// Metode Deposit Rekening Manual untuk Pelanggan (Customer B2C)
model StorePaymentMethod {
  id          String   @id @default(uuid())
  storeId     String
  bankName    String   // Contoh: BCA, BNI, DANA, XENDIT_QRIS
  accountNo   String
  accountName String
  isActive    Boolean  @default(true)
  type        String   @default("MANUAL") // "MANUAL", "PAYMENT_GATEWAY", "CEK_MUTASI"
  feePaidBy   String   @default("CUSTOMER") // Siapa yang menanggung biaya PG ("CUSTOMER" atau "SELLER")
  adminFee    Decimal  @default(0.00) @db.Decimal(15, 2) // Nominal statis fee, atau 0 (disesuaikan dengan API PG)

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------
// 4. Modul Pelanggan (Pengguna Store B2C)
// -----------------------------------------------------
model CustomerTier {
  id              String   @id @default(uuid())
  storeId         String
  name            String   // Contoh: Member Biasa, Reseller, VIP
  pointsMultiplier Decimal  @default(1.0) @db.Decimal(5, 2)
  createdAt       DateTime @default(now())

  store           Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  customers       Customer[]

  @@unique([storeId, name])
}

model Customer {
  id        String   @id @default(uuid())
  storeId   String
  tierId    String?
  phone     String
  email     String?
  password  String   // Hashed
  name      String
  balance   Decimal  @default(0.00) @db.Decimal(15, 2)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  store     Store         @relation(fields: [storeId], references: [id], onDelete: Cascade)
  tier      CustomerTier? @relation(fields: [tierId], references: [id])
  deposits  CustomerDeposit[]
  notifications CustomerNotification[]
  orders    StoreOrder[]
  tickets   SupportTicket[]

  // Unique constraint: No duplicate phone numbers per store (setiap toko punya basis data pelanggan tersendiri)
  @@unique([storeId, phone])
}

// Notifikasi Personal (In-App) untuk tipe kejadian spesifik (Success Deposit, Tx Gagal, dll.)
model CustomerNotification {
  id          String   @id @default(uuid())
  customerId  String
  title       String
  content     String   @db.Text
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())

  customer    Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
}

// Histori topup deposit saldo Pelanggan (Customer B2C)
model CustomerDeposit {
  id              String        @id @default(uuid())
  customerId      String
  storeId         String
  amount          Decimal       @db.Decimal(15, 2)
  methodType      DepositMethod
  status          String        @default("PENDING") // PENDING, SUCCESS, FAILED

  // Fleksibilitas data deposit:
  // Menyimpan snapshot data bank manual, paymentUrl Xendit, atau instruksi cek mutasi.
  paymentDetails  Json?
  referenceId     String?       // ID acuan Webhook PG atau tiket mutasi

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  customer        Customer      @relation(fields: [customerId], references: [id], onDelete: Cascade)
  store           Store         @relation(fields: [storeId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------
// 5. Fitur Pendukung Store B2C
// -----------------------------------------------------

// Dokumen (artikel/FAQ/Blog) yang dibuat oleh Seller untuk Store B2C
model StoreDoc {
  id          String   @id @default(uuid())
  storeId     String
  title       String
  content     String   @db.Text
  isVisible   Boolean  @default(true)
  isSuspended Boolean  @default(false) // Jika kuota paket downgrade membatasi jumlah dokumen aktif
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  banners     StoreBanner[]
  notifs      StoreNotification[]
}

// Banner Store B2C
model StoreBanner {
  id          String   @id @default(uuid())
  storeId     String
  title       String
  imageUrl    String
  isActive    Boolean  @default(true)
  isSuspended Boolean  @default(false) // Dikenakan suspend otomatis apabila paket downgrade mengurangi limit
  docId       String?
  createdAt   DateTime @default(now())

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  doc         StoreDoc? @relation(fields: [docId], references: [id], onDelete: SetNull)
}

// Notifikasi/Info (Blast) dari Seller ke Pelanggan B2C
model StoreNotification {
  id          String   @id @default(uuid())
  storeId     String
  title       String
  content     String   @db.Text
  docId       String?
  createdAt   DateTime @default(now())

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  doc         StoreDoc? @relation(fields: [docId], references: [id], onDelete: SetNull)
}

// -----------------------------------------------------
// 6. Transaksi PPOB (Penjualan / Pembelian Produk)
// -----------------------------------------------------

// Tabel ini mencatat setiap pembelanjaan produk (Pulsa, PLN, dll) oleh Customer.
model StoreOrder {
  id              String   @id @default(uuid())
  storeId         String
  customerId      String

  // Informasi Produk & Provider
  productCode     String   // Kode produk provider (misal: "TSEL100")
  productName     String   // Nama produk (misal: "Telkomsel 100.000")
  category        String   // Kategori (misal: "Pulsa", "Data", "PLN")
  targetNumber    String   // Nomor tujuan isi ulang / ID Pelanggan PLN

  // Keuangan & Harga (Snapshot at the time of purchase)
  basePrice       Decimal  @db.Decimal(15, 2) // Harga asli dari vendor (Digiflazz)
  markup          Decimal  @db.Decimal(15, 2) // Margin/Keuntungan Seller
  customerPrice   Decimal  @db.Decimal(15, 2) // Harga final yang dipotong dari dompet Customer (basePrice + markup)

  // Status & Respon Vendor
  status          String   @default("PENDING") // PENDING, PROCESSING, SUCCESS, FAILED
  providerId      String?  // ID/Ref transaksi balasan dari vendor pihak ketiga (contoh: Digiflazz Trx ID)
  sn              String?  // Serial Number atau Token Listrik (Bila sukses)
  failureReason   String?  // Alasan gagal jika status FAILED (Untuk keperluan refund otomatis)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  customer        Customer @relation(fields: [customerId], references: [id])
  store           Store    @relation(fields: [storeId], references: [id])
}

// -----------------------------------------------------
// 7. Modul Chat Support (Ticketing)
// -----------------------------------------------------

enum TicketType {
  ADMIN_SELLER    // Tiket antara Admin dan Seller
  SELLER_CUSTOMER // Tiket antara Seller dan Customer
}

model SupportTicket {
  id           String   @id @default(uuid())
  type         TicketType

  // ============================================
  // Pemisah Ruang Obrolan Ketat (Isolation)
  // ============================================
  // Jika type = ADMIN_SELLER
  adminId      String?  // (Opsional) Staff Admin spesifik yang menangani
  sellerId     String?  // (Wajib) Identifier Seller

  // Jika type = SELLER_CUSTOMER
  storeId      String?  // (Wajib) Identifier Toko Store-App
  customerId   String?  // (Wajib) Identifier Pelanggan B2C yang membuat tiket

  status       String   @default("OPEN") // OPEN, CLOSED
  subject      String
  closedAt     DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  messages     SupportMessage[]

  // Relasi Fisik Ketat
  admin        Admin?    @relation(fields: [adminId], references: [id])
  seller       Seller?   @relation(fields: [sellerId], references: [id])
  store        Store?    @relation(fields: [storeId], references: [id])
  customer     Customer? @relation(fields: [customerId], references: [id])
}

model SupportMessage {
  id           String   @id @default(uuid())
  ticketId     String
  senderType   String   // "ADMIN", "SELLER", "CUSTOMER", "SYSTEM"
  senderId     String?  // ID pengirim sebenarnya, bisa null jika SYSTEM
  content      String   @db.Text
  attachmentUrl String? // Mendukung upload gambar
  createdAt    DateTime @default(now())

  ticket       SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
}

// Template Pesan Chat Cepat (Quick Reply)
model SupportTemplate {
  id           String   @id @default(uuid())
  type         TicketType // Menentukan di jalur chat mana template ini muncul
  creatorType  String     // "ADMIN" atau "SELLER"
  creatorId    String     // ID pembuatnya
  title        String     // Label template (Contoh: "Sapaan Pagi")
  content      String     @db.Text
  createdAt    DateTime   @default(now())
}

// -----------------------------------------------------
// 8. Double-Entry Ledger (Log Keuangan Ketat)
// -----------------------------------------------------

// Wajib dieksekusi secara atomic (DB Transaction) setiap kali terjadi perpindahan dana
model WalletMutation {
  id              String   @id @default(uuid())
  walletOwnerType String   // "SELLER" atau "CUSTOMER"
  walletOwnerId   String   // ID dari Seller atau Customer
  type            String   // "DEBIT" (Keluar), "CREDIT" (Masuk)
  amount          Decimal  @db.Decimal(15, 2)
  balanceBefore   Decimal  @db.Decimal(15, 2)
  balanceAfter    Decimal  @db.Decimal(15, 2)
  referenceType   String   // "TRANSACTION", "DEPOSIT", "REFUND", "FEE", dsb
  referenceId     String   // ID dari transaksi / deposit
  description     String
  createdAt       DateTime @default(now())

  @@index([walletOwnerId, walletOwnerType])
}
```

**PERHATIAN:** AI (Agent) yang bertugas membangun `store-app`, `seller-app`, atau pun `core-app` wajib menyesuaikan struktur database ini tanpa ragu. Jika terdapat penambahan _field_ baru yang relevan dengan UI secara mendadak, Anda boleh menambahkan ke tabel Prisma secara logis.

## Database Seeder (Prisma Seed)

Untuk mempermudah proses pengembangan, pengujian UI, dan _testing_ API, Anda (AI Developer) **DIWAJIBKAN** untuk membuat sistem Seeder Prisma (`prisma/seed.ts`) yang komprehensif. Seeder ini setidaknya harus membangun _dummy data_ berikut saat dieksekusi:

1.  **Satu Akun Super Admin** (Tabel `Admin` dengan `role` = `SUPER_ADMIN`).
2.  **Daftar Paket Langganan (GlobalSubscription)** yang realistis dengan batasan fitur (Free, Pro, Enterprise).
3.  **Satu Akun Seller Utama** beserta Data Toko (Tabel `Store`), di mana Seller tersebut direlasikan ke langganan tertentu.
4.  **Satu Akun Customer** yang masuk ke Toko milik Seller tersebut.
5.  **Produk B2B (Global Product)** dan **Produk Etalase (Store Product)** secara logis.

Pastikan proses seeder ini aman dari replikasi ganda (gunakan `upsert` pada Prisma).
