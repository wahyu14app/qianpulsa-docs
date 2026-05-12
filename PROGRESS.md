# System Understanding Summary

Project: QianPulsa Ecosystem Documentation Hub
A SaaS PPOB (Payment Point Online Bank) system divided into 3 main apps:

1. **Admin App**: Super admin dashboard, managing API connections (Digiflazz), financial endpoints (Xendit), monitoring, and system management. Works in "God Mode" and embeds management iframes without directly hitting API.
2. **Seller App**: Merchant operational dashboard for configuring marking up, UI theme, monitoring sales, commissions. Employs decoupled architecture with SSO JWT token for accessing Store configuration.
3. **Store App**: Customer-facing B2C storefront where transaction happens. Features management via micro-frontend embedded as iframe in Admin and Seller App using Asymmetric JWT SSO for security.

Core Architecture Philosophy:

- **Decoupled Apps**: Admin, Seller, and Store are separated completely, each having their own databases (or isolated schema), removing heavy Inter-Service APIs.
- **Micro-Frontend/Iframe based management**: Instead of API push/pull, Seller accesses Store configuration directly through securely embedded iframes (`/internal-admin/*`).
- **Security**: Asymmetric RSA JWT tokens via HTML POST target frame are heavily used to establish cross-app authentication (SSO Init), bypassing third-party cookie restrictions and preventing XSS/Session Hijacking.
- **No Balances on Seller App**: Seller has no e-wallet/balance. Billing and platform subscriptions are processed instantly via payment gateway. Store subscription balance is topped up directly via iframe rendered from Store App.

---

# Documentation Tree

- `/docs/`
  - `public/` (General infrastructure, global DB, JWT, Microfrontend logic)
    - `01-Pengenalan-Layanan.md`
    - `02-Pengenalan-Tiga-Aplikasi.md`
    - `03-Fokus-AI-Studio.md`
    - `04-Detail-Aplikasi.md`
    - `05-Aturan-Pengembangan.md`
    - `06-Struktur-Database-Global.md`
    - `07-Aturan-Req-Res-API.md`
    - `08-Ketentuan-Tema-Aplikasi.md`
    - `09-Infrastruktur-dan-Integrasi.md`
    - `10-Protokol-Inisialisasi-AI.md`
    - `11-Alur-Bisnis-dan-User-Journey.md`
    - `12-Logika-Keuangan-dan-Harga.md`
    - `13-Panduan-Iframe-dan-Cookie-JWT.md`
    - `14-Kode-Referensi-Microfrontend.md`
    - `15-Pedoman-File-dan-KYC.md`
    - `16-Pengaitan-Akun-dan-Pembuatan-Store.md`
  - `admin-app/` (Admin-specific docs)
    - `01-Dokumentasi-Pengembangan-Admin.md`
    - `02-Aturan-Pengembangan-Admin.md`
    - ...
  - `seller-app/` (Seller user journeys, boundaries, rules)
    - `01-Dokumentasi-Pengembangan-Seller.md`
    - `...`
  - `store-app/` (Store B2C flow, Iframe rendering, rules)
    - `01-Dokumentasi-Pengembangan-Store.md`
    - `...`

Fase	Status	Fitur Utama	
Fase 1	✅ Fondasi, DB Schema, Security, JWT, Zod, Seeder	
Fase 2	✅ Auth 3 App, Chat Support, Wallet Ledger, Store Init	
Fase 3	✅ Digiflazz, Xendit, Midtrans, Webhook, Auto-Refund, Notifikasi	
Fase 4	✅ Markup Rules, Customer Tiers, Subscriptions, Staff CRUD, Analytics
Fase 5	🔄 Audit API: QA Endpoint, Cek Integritas Saldo (Ledger), Load/Concurrency Testing, Security & Penetration Testing, Bug Fixing.

---

# Audit Queue

| Priority | File / Scope                                      | Reason                                                                                           |
| -------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| DONE     | `public/13-Panduan-Iframe-dan-Cookie-JWT.md`      | Aligned to Asymmetric SSO POST.                                                                  |
| DONE     | `public/14-Kode-Referensi-Microfrontend.md`       | Code ref aligned to Form POST JWT.                                                               |
| DONE     | `public/16-Pengaitan-Akun-dan-Pembuatan-Store.md` | Aligned to Asymmetric JWT & No saldo on Seller.                                                  |
| DONE     | `public/06-Struktur-Database-Global.md`           | Data alignment especially related to Seller vs Store balance separation.                         |
| DONE     | `public/11-Alur-Bisnis-dan-User-Journey.md`       | Business logic validation, payment gateway handling.                                             |
| DONE     | `public/12-Logika-Keuangan-dan-Harga.md`          | Pricing, margin, topups, financial boundaries.                                                   |
| DONE     | `seller-app/*`                                    | Verified all docs no longer mention old cookie or saldo logic.                                   |
| DONE     | `store-app/*`                                     | Fixed legacy mention of cross-domain cookie in 05-Cakupan and corrected top-up logic in 04-Alur. |
| DONE     | `admin-app/*`                                     | Auth mechanism updated from Cross-domain cookies to POST SSO JWT Asymmetric.                     |

---

# Cross File Validation

- [x] Dependency Validation: The separation of `seller_db` and `store_db` is respected.
- [x] Architecture Validation: SSO Form POST Iframe is implemented universally.
- [x] Transaction Validation: Payment for Platform Creation is in `seller_db`/Seller App, while Subscription/Deposit is in `store_db`/Store App. User/Customer Transactions use Seller's PG and PPOB APIs exclusively.
- [x] Role Validation: Admin (God Mode) uses SSO POST via Admin app. Seller uses SSO POST via Seller App. Customer uses traditional session/JWT.
- [x] **Super Admin Default Rule**: Seeding system must inject `wahyu14app@gmail.com` | `password123`.
- [x] **External Provider Rule**: All applications must integrate Gmail API and Fonnte API for unified Notifications/OTP, strictly requiring standard `.env` variables (`FONNTE_TOKEN`, `GMAIL_CLIENT_ID`, etc).
- [x] **Iframe Fallback UI**: Admin App and Seller App must provide visual error handling and a "Reload Iframe" button for failed/timed-out iframe integrations.
- [x] **Navigation & Iframe Mapping**: Created `17-Pemetaan-Navigasi-dan-Iframe.md` to cleanly separate Native vs Iframe routes for both consumers and B2B management.
- [x] Global Production Review: Everything aligned, safe, scalable, and follows the architectural paradigm of independent, decoupled Node.js systems working seamlessly without centralized B2B APIs.

---

# Audit Progress

| File        | Status | Risk | Dependency | Notes                                    |
| ----------- | ------ | ---- | ---------- | ---------------------------------------- |
| `README.md` | DONE   | LOW  | None       | Project structure, definition of 3 apps. |
