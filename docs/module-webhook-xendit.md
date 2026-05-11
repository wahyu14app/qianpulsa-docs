# Core App: Merancang Webhook Payment Gateway (Xendit)

Dokumen ini adalah panduan teknis bagi _AI Implementor_ dalam membangun arsitektur Webhook untuk mendengarkan (_listen_) callback dari **Xendit**, khususnya untuk fitur **Deposit Saldo Seller** (`SellerDeposit`).

Endpoint yang akan dirancang: `POST /api/v1/webhook/payment/xendit`

## 1. Alur Logika (Idempotency & Security)

Karena API Webhook dapat dipanggil berulang kali oleh sistem Xendit (karena _network timeout_ atau kendala asinkron lainnya), endpoint ini **wajib** dirancang bersifat _Idempotent_. Artinya, meskipun di-ping 10 kali dengan data transaksi yang sama, saldo Seller hanya akan bertambah 1 kali.

### A. Proteksi Token

Setiap panggilan webhook dari Xendit akan selalu menyertakan header `x-callback-token`.
Backend **WAJIB** mencocokkan header ini dengan Environment Variable:
`process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN`.
Jika tidak cocok, langsung tolak dengan `403 Forbidden` atau `401 Unauthorized`.

### B. Validasi Zod (Payload)

Xendit mengirim _payload_ berformat JSON. Untuk transaksi _Invoice_, _payload_ yang umumnya dikirim berisi:

- `id`: (String) ID invoice Xendit.
- `external_id`: (String) ID yang kita kirim ke Xendit saat membuat invoice (disarankan kita melempar `SellerDeposit.id`).
- `status`: (String) Status terbaru, contoh: `"PAID"`, `"SETTLED"`, atau `"EXPIRED"`.
- `paid_amount`: (Number) Jumlah uang riil yang dibayar.

Pastikan memvalidasi ini menggunakan **Zod**.

```typescript
import { z } from "zod";

export const xenditWebhookSchema = z.object({
  id: z.string(),
  external_id: z.string(),
  status: z.string(),
  paid_amount: z.number().optional(), // mungkin tidak ada jika status EXPIRED
});
```

_(Catatan: Xendit mungkin mengirim nama properti yang berbeda tergantung jenis/metode pembayaran, pastikan AI Developer membaca log/tipe payload Invoice Xendit terbaru)._

---

## 2. Abstraksi Database (Prisma Transaction)

Proses penambahan saldo berjalan di atas fondasi Database Relasional. Oleh karena itu, kita **WAJIB** menggunakan `prisma.$transaction` agar jika ada kendala di tengah jalan (misal gagal mencatat status berhasil), penambahan saldo di-`rollback` secara otomatis guna mencegah kebocoran uang platform.

### Algoritma Logika (Langkah demi Langkah):

1. Cari `SellerDeposit` berdasarkan `xenditId` atau `id` (menggunakan data `external_id` dari payload).
2. Jika tidak ditemukan, kembalikan response HTTP `404 Not Found`.
3. **Pemeriksaan Idempotency**: Jika status `SellerDeposit` di database **BUKAN** `"PENDING"` (contoh: sudah `SUCCESS` atau `FAILED`), maka abaikan prosesnya dan langsung kembalikan HTTP `200 OK` ke Xendit.
4. Jika payload status Xendit adalah `"PAID"` atau `"SETTLED"`:
   - Buat blok _Prisma Transaction_:
     a. Lakukan _Update_ tabel `SellerDeposit`, ubah `status` menjadi `"SUCCESS"`.
     b. Lakukan _Update_ tabel `Seller`, gunakan fungsi `increment` pada kolom `balance` sebesar `amount` yang ada di database.
     *(Catatan Keamanan: Ingat bahwa fee deposit ditanggung Admin! Oleh karena itu, kita menggunakan nilai `amount` dari database yang di-*request* oleh Seller saat *checkout*, BUKAN dari `paid_amount` Xendit. Ini mencegah eksploitasi di mana pihak eksternal memanipulasi bayaran, meskipun nominal biasanya selalu sama).*
5. Jika payload status Xendit adalah `"EXPIRED"`:
   - Cukup update `SellerDeposit.status` menjadi `"FAILED"`.
6. Kembalikan respons HTTP `200 OK` (dalam format JSON `{ "success": true }`) ke Xendit agar mereka tahu bahwa notifikasi telah diterima, dan tidak melakukan _retry/ping_ ping kembali.

---

## 3. Template Skema Operasional (Pseudo-code untuk AI)

```typescript
// middlewares/xenditAuthMiddleware.ts
export function verifyXenditWebhook(req, res, next) {
  const token = req.headers["x-callback-token"];
  if (token !== process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN) {
    return res.status(403).json({ error: "Invalid Xendit Callback Token" });
  }
  next();
}

// controllers/webhook.controller.ts
export async function handleXenditInvoice(req, res) {
  const payload = xenditWebhookSchema.parse(req.body);

  const deposit = await prisma.sellerDeposit.findUnique({
    where: { id: payload.external_id }, // atau berdasarkan xenditId
  });

  if (!deposit) return res.status(404).json({ error: "Deposit Not Found" });

  // Idempotency Gate
  if (deposit.status !== "PENDING") {
    return res.status(200).json({ message: "Already processed" });
  }

  if (payload.status === "PAID" || payload.status === "SETTLED") {
    // Jalankan transaksi Atomik
    await prisma.$transaction([
      prisma.sellerDeposit.update({
        where: { id: deposit.id },
        data: { status: "SUCCESS" },
      }),
      prisma.seller.update({
        where: { id: deposit.sellerId },
        data: { balance: { increment: deposit.amount } },
      }),
    ]);
  } else if (payload.status === "EXPIRED") {
    await prisma.sellerDeposit.update({
      where: { id: deposit.id },
      data: { status: "FAILED" },
    });
  }

  return res.status(200).json({ success: true });
}
```

## 4. Pentingnya Eksekusi

Bagi rekan _AI Implementor_, silakan langsung membangun kode logika Webhook Xendit ini di proyek backend `core-app`, pastikan Rute (Route), Pengendali (Controller), serta _Zod Validator_-nya tersedia dan rapi! Jika ada ambiguitas perihal "fee" dari Invoice Xendit (_Virtual Account, E-Wallet, Retail_), acuhkan saja perhitungan fee untuk saat ini, lakukan penambahan saldo murni dari _Amount target_.
