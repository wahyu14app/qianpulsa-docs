# Core App: Pola Request dan Response

Sistem ini mewajibkan adopsi standar tanggapan (Response Format) yang konsisten agar setiap Front-End App (Admin-App, Seller-App, Store-App) bisa memproses _Error Handling_ dan _State Management_ dengan sebuah _interceptor_ tunggal (misal pada Axios).

## 1. Standar JSON Response

### Sukses (HTTP 200 - 201)

Semua respons sukses harus dibungkus dengan meta `success: true` serta menyertakan `data` utama.

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {
    "id": "123",
    "name": "Produk Telkomsel 10K",
    "price": 10500
  }
}
```

_Jika berupa list/pagination:_

```json
{
  "success": true,
  "message": "List produk berhasil diambil",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150
  }
}
```

### Gagal / Validasi / Unauthorized (HTTP 400 - 404 - 401 - 403)

Respons error harus mengembalikan kode HTTP Error yang tepat serta menyertakan `success: false` beserta pesan rinci (atau validasi).

```json
{
  "success": false,
  "message": "Validasi gagal, silakan periksa inputan Anda",
  "errors": {
    "email": "Format email tidak valid",
    "password": "Password terlalu pendek"
  }
}
```

_Error Server (HTTP 500):_

```json
{
  "success": false,
  "message": "Terjadi kesalahan internal pada server kami."
}
```

## 2. Pola Request Headers

Karena sistem melayani Multiple Front-End, API Core membutuhkan cara untuk mengetahui dari mana asal permintaan klien.

Setiap Front-End Client (saat request ke backend) **wajib menyertakan Header berikut**:

1. `Authorization: Bearer <TOKEN_JWT_DISINI>` (Jika endpoint membutuhkan otentikasi)
2. `x-app-origin: <admin | seller | store>` (Identifikasi tipe Front-End yang memanggil API)
3. Khusus klien `store`:
   - `x-store-domain: <DOMAIN_TOKO_YANG_SEDANG_DIAKSES>` (Penting untuk backend menentukan konfigurasi harga _markup_ dan tema warna).

## 3. Payload Request & Validasi (Zod)

Untuk endpoint mutasi data (POST / PUT / PATCH), sistem menerima input dengan `Content-Type: application/json` atau `multipart/form-data` untuk unggahan berkas gambar (contoh: unggah KTP/Logo Toko).

Untuk menjaga konsistensi dan integritas data sebelum menyentuh Model Prisma, **semua payload Request dari Klien** Wajib di-verifikasi pada level API menggunakan **Zod**.

1.  Setiap Request (_body params, query params_) diparalelkan dengan Skema _Zod_.
2.  Jika _parsing_ _Zod_ gagal (menghasilkan _ZodError_), _backend_ harus mencegat _error_ tersebut dan mengirim respons berformat HTTP 400 (atau 422) dengan objek daftar `errors` sebagaimana digambarkan di atas (lihat bagian "Gagal / Validasi").
3.  Tidak ada Payload luar yang boleh diteruskan (_bypass_) ke dalam eksekusi fungsi Database tanpa melewati perlindungan _Zod_.

---

Panduan lain:

- [Autentikasi Lintas Aplikasi](/docs/authentication.md)
- [Integrasi Database & Pihak Ketiga](/docs/integrations.md)
- [Batasan Entitas & Batas File](/docs/limits-and-constraints.md)
