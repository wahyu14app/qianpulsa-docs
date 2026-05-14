# Arsitektur Database: Skema Terdistribusi (Prisma)

**PERINTAH UNTUK AI:** Skema di bawah ini adalah acuan utama untuk *Core API Database* yang akan melayani ketiga entitas: Admin, Seller, dan Store. Seluruh tabel digabungkan menjadi satu skema Prisma (PostgreSQL).

## 1. Skema Database B2B2C (Finansial, User, & Support)

Core-API menjadi _Single Source of Truth_ untuk Entitas Pengguna, Mutasi Saldo, Mutasi Deposit, dan Transaksi Pembelian.

```prisma
// -----------------------------------------------------
// Konfigurasi Klien dan Provider (Core)
// -----------------------------------------------------
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // WAJIB PostgreSQL
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
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
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
  balance   Decimal  @default(0.00) @db.Decimal(15, 2)
  status    String   @default("ACTIVE") // ACTIVE, SUSPENDED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  stores        Store[]
  depositTrans  SellerDeposit[]
  platforms     SellerPlatform[]
  subscriptions SellerSubscription[]
  apiSettings   SellerApiSetting?
  alertSettings SellerAlertSetting?
}

// Akun Staf Toko.
model SellerStaff {
  id          String   @id @default(uuid())
  storeId     String
  email       String
  password    String   // Hashed
  name        String
  role        String   @default("CS") // CS, FINANCE, OPERATOR
  isActive    Boolean  @default(true)
  isSuspended Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  @@unique([storeId, email])
}

// Histori topup deposit saldo Seller (Xendit dll)
model SellerDeposit {
  id          String   @id @default(uuid())
  sellerId    String
  amount      Decimal  @db.Decimal(15, 2)
  status      String   @default("PENDING") // PENDING, SUCCESS, FAILED
  paymentUrl  String?  
  xenditId    String?  @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  seller      Seller   @relation(fields: [sellerId], references: [id])
}

// --- Manajemen Platform & Berlangganan Seller ---

model PlatformType {
  id          String   @id @default(uuid())
  name        String   @unique 
  price       Decimal  @db.Decimal(15, 2)
  description String?

  sellerPlatforms SellerPlatform[]
}

model SubscriptionPlan {
  id              String   @id @default(uuid())
  level           Int      @unique 
  name            String   @unique 
  price           Decimal  @db.Decimal(15, 2)
  durationDays    Int      @default(30)
  autoSyncEnabled Boolean  @default(false)

  // -- Quotas --
  maxMonthlyNotif Int      @default(0) 
  maxBanners      Int      @default(0) 
  maxDocs         Int      @default(0) 
  maxStaffs       Int      @default(0) 

  // -- Feature Access --
  hasLiveChat     Boolean  @default(false) 
  hasWhatsappNotif Boolean @default(false) 
  hasEmailNotif   Boolean  @default(false) 
  hasB2CInAppNotif Boolean @default(false) 

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
  xenditKey       String?  
  midtransKey     String?
  digiflazzUser   String?  
  digiflazzKey    String?  
  providerConfigs Json?    
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  seller          Seller   @relation(fields: [sellerId], references: [id], onDelete: Cascade)
}

// Preferensi Notifikasi Sistem (Terkait Core-API)
model SellerAlertSetting {
  id                String   @id @default(uuid())
  sellerId          String   @unique
  activeChannel     String   @default("EMAIL") 
  waNumber          String?  
  emailAddress      String?  

  notifyNewDeposit  Boolean  @default(true) 
  notifyNewCustomer Boolean  @default(true) 
  notifyTxSuccess   Boolean  @default(false) 
  notifyTxFailed    Boolean  @default(true)  

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
  slug        String   @unique 
  domain      String?  @unique 
  name                String
  themeColor          String?        @default("#111827")
  activeDepositMethod         DepositMethod  @default(MANUAL)

  useSplashScreen             Boolean        @default(false)
  landingPageConfig           Json?          

  globalMarkupFlat            Decimal        @default(0.00) @db.Decimal(15, 2)
  globalMarkupPercent         Decimal        @default(0.00) @db.Decimal(5, 2)

  // SNAPSHOT PAKET LANGGANAN
  subMaxBanners               Int            @default(0)     
  subMaxDocs                  Int            @default(0)     
  subMaxStaffs                Int            @default(0)     
  subMaxNotifQuota            Int            @default(0)     
  subNotifUsed                Int            @default(0)     
  subHasLiveChat              Boolean        @default(false) 
  subHasWhatsappNotif         Boolean        @default(false)
  subHasEmailNotif            Boolean        @default(false)
  subHasB2CInAppNotif         Boolean        @default(false)
  
  createdAt                   DateTime       @default(now())
  updatedAt                   DateTime       @updatedAt

  seller          Seller               @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  customers       Customer[]
  paymentMethods  StorePaymentMethod[]
  customerDeposits CustomerDeposit[]
  staffs          SellerStaff[]
  markupRules     StoreMarkupRule[]
  customerTiers   CustomerTier[]
  orders          StoreOrder[]
}

model StoreMarkupRule {
  id              String   @id @default(uuid())
  storeId         String
  categoryId      String   
  minBasePrice    Decimal  @default(0.00) @db.Decimal(15, 2)
  maxBasePrice    Decimal? @db.Decimal(15, 2) 
  markupFlat      Decimal  @default(0.00) @db.Decimal(15, 2)
  markupPercent   Decimal  @default(0.00) @db.Decimal(5, 2)
  createdAt       DateTime @default(now())

  store           Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
}

model StorePaymentMethod {
  id          String   @id @default(uuid())
  storeId     String
  bankName    String   
  accountNo   String
  accountName String
  isActive    Boolean  @default(true)
  type        String   @default("MANUAL") 
  feePaidBy   String   @default("CUSTOMER") 
  adminFee    Decimal  @default(0.00) @db.Decimal(15, 2) 

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------
// 4. Modul Pelanggan (Pengguna Store B2C)
// -----------------------------------------------------
model CustomerTier {
  id              String   @id @default(uuid())
  storeId         String
  name            String   
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
  orders    StoreOrder[]

  @@unique([storeId, phone])
}

model CustomerDeposit {
  id              String        @id @default(uuid())
  customerId      String
  storeId         String
  amount          Decimal       @db.Decimal(15, 2)
  methodType      DepositMethod
  status          String        @default("PENDING") 
  paymentDetails  Json?
  referenceId     String?       
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  customer        Customer      @relation(fields: [customerId], references: [id], onDelete: Cascade)
  store           Store         @relation(fields: [storeId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------
// 5. Transaksi PPOB (Penjualan / Pembelian Produk)
// -----------------------------------------------------
model StoreOrder {
  id              String   @id @default(uuid())
  storeId         String
  customerId      String

  productCode     String   
  productName     String   
  category        String   
  targetNumber    String   

  basePrice       Decimal  @db.Decimal(15, 2) 
  markup          Decimal  @db.Decimal(15, 2) 
  customerPrice   Decimal  @db.Decimal(15, 2) 

  status          String   @default("PENDING") 
  providerId      String?  
  sn              String?  
  failureReason   String?  

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  customer        Customer @relation(fields: [customerId], references: [id])
  store           Store    @relation(fields: [storeId], references: [id])
}

// -----------------------------------------------------
// 6. Double-Entry Ledger (Log Keuangan Ketat)
// -----------------------------------------------------
model WalletMutation {
  id              String   @id @default(uuid())
  walletOwnerType String   
  walletOwnerId   String   
  type            String   
  amount          Decimal  @db.Decimal(15, 2)
  balanceBefore   Decimal  @db.Decimal(15, 2)
  balanceAfter    Decimal  @db.Decimal(15, 2)
  referenceType   String   
  referenceId     String   
  description     String
  createdAt       DateTime @default(now())

  @@index([walletOwnerId, walletOwnerType])
}

// -----------------------------------------------------
// 7. Event & Task Queue
// -----------------------------------------------------
// Menyimpan perintah eksekusi background (cth: kirim email, broadcast notif)
model SystemTask {
  id              String   @id @default(uuid())
  taskType        String   // Misalnya: "SEND_EMAIL", "SEND_WHATSAPP", "BROADCAST_NOTIF"
  payload         Json     // Beban data (contoh: { to: "email@x", body: "Halo" })
  status          String   @default("PENDING") // PENDING, PROCESSING, FAILED, COMPLETED
  attempts        Int      @default(0) // Hitung seberapa sering gagal (maks 10 misal)
  lastError       String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// -----------------------------------------------------
// 8. Modul Support & Resolusi Konflik
// -----------------------------------------------------
model Ticket {
  id              String   @id @default(uuid())
  storeId         String?  // Null jika tiket B2B (Seller ke Admin)
  sellerId        String?  // Identitas Seller (B2B atau pemilik toko B2C)
  customerId      String?  // Identitas Customer jika B2C
  subject         String
  status          String   @default("OPEN") // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  priority        String   @default("NORMAL") // LOW, NORMAL, HIGH, URGENT
  referenceId     String?  // ID Transaksi (StoreOrder ID) terkait masalah ini
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  messages        TicketMessage[]
}

model TicketMessage {
  id              String   @id @default(uuid())
  ticketId        String
  senderId        String   // ID dari pengirim (Bisa Admin, SellerStaff, atau Customer)
  senderType      String   // ADMIN, SELLER_STAFF, CUSTOMER
  message         String   @db.Text
  attachments     Json?    // Array of URLs for images/docs
  createdAt       DateTime @default(now())

  ticket          Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
}

```

