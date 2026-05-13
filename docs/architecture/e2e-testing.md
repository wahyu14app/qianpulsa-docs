# Pengujian E2E (QA Automation) - Playwright

Panduan ini mendefinisikan strategi dan implementasi pengujian End-to-End (E2E) menggunakan **Node.js** dan **Playwright** untuk memastikan stabilitas sistem.

## 1. Tujuan
Menjalankan skenario navigasi kritis dan mengumpulkan setiap error (sistem maupun UI) ke dalam laporan JSON untuk kebutuhan analisis *debugging*.

## 2. Kebutuhan Teknis
- **Runtime**: Node.js
- **Tool**: Playwright
- **Output**: File `error-report-[timestamp].json`

## 3. Skenario Pengujian

### Skenario 1: Autentikasi (Login)
- Membuka halaman login.
- Mengisi kredensial (username/password).
- Validasi pesan error jika login gagal.

### Skenario 2: Akses Dashboard
- Menunggu redirect ke Dashboard.
- Validasi elemen utama di Dashboard.
- Memastikan tidak ada penolakan akses (403) atau kegagalan muat (500).

## 4. Implementasi Listener (Global)

Implementasikan listener berikut dalam script pengujian untuk menangkap error secara *real-time*:

1.  **Console Browser Listener**: Menangkap error *client-side* (React/Next.js/JS errors).
2.  **Network Request Listener**: Menangkap API/Resource yang gagal (status 500, CORS, dsb).

## 5. Mekanisme Pelaporan Error
Semua error dikumpulkan ke dalam *array* selama pengujian berjalan, kemudian disimpan dalam file JSON pada blok `finally` di akhir eksekusi pengujian.

```json
// Format Laporan
{
  "timestamp": "2026-05-13T14:42:00Z",
  "errors": [
    {
      "stage": "Auth",
      "type": "NetworkError",
      "message": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)",
      "url": "https://api.example.com/login"
    }
  ]
}
```
