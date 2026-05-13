# 📋 Standar Alur Kerja & Prasyarat Coding

Dokumen ini adalah **Wajib Baca** bagi setiap agen AI sebelum memulai tugas coding. Kegagalan mematuhi alur ini akan menyebabkan penolakan atau *refactoring* paksa.

## 1. Aturan Eksekusi Berfase (Phasing & Pausing Rule) - PENTING!

Agen AI **HANYA BOLEH MENGERJAKAN SATU FASE** dalam satu waktu (satu putaran eksekusi/prompt).
1. **Pilih Fase:** Deklarasikan fase apa yang akan dikerjakan di awal respons.
2. **Kerjakan Fase:** Selesaikan seluruh instruksi pada fase tersebut (Konteks, Implementasi, Verifikasi).
3. **Catat Progress:** Setelah menyelesaikan fase, edit file roadmap terkait (seperti `step-XX-*.md`) untuk menandai item/langkah fase tersebut telah selesai (misalnya tambahkan `[x]` atau keterangan `(SELESAI)`).
4. **BERHENTI! (PAUSE):** Setelah progress dicatat, **JANGAN** melanjutkan ke fase berikutnya. Ringkas apa yang sudah diselesaikan, laporkan, lalu akhir sesi Anda (stop generation) dan tunggu persetujuan dari manusia ("Silakan lanjut ke fase X").

## 2. Golden Rule AI Workflow

Setiap tugas/fase pengembangan **HARUS** melalui 3 tahapan iteratif ini:

### Tahap A: Konteks & Prasyarat (Context Awareness)
Sebelum menulis satu barispun kode:
1. **Periksa Prasyarat**: Temukan file dependensi atau skema database yang relevan.
   * *Contoh*: Jika ingin membangun API User, baca `/docs/architecture/database-schema.md` terlebih dahulu untuk memastikan nama kolom dan relasi.
2. **Periksa Aturan**: Baca `/docs/architecture/limits-and-constraints.md` untuk mengetahui batasan teknologi (misal: dilarang `.env` di lingkungan tertentu).

### Tahap B: Implementasi (Execution)
1. **Modularitas**: Kode harus dipisah berdasarkan tanggung jawab (Service, Controller, Route).
2. **Validasi (Zod)**: Gunakan Zod wajib untuk setiap payload request.
3. **Dokumentasi**: Jika mengubah alur bisnis atau API, Anda WAJIB memperbarui Markdown di `/docs/` yang relevan sebelum/bersamaan dengan *commit* kode.

### Tahap C: Verifikasi (Verification)
1. **Checklist**: Jalankan verifikasi berdasarkan `/docs/architecture/verification-checklist.md`.
2. **Linting & Build**: Jalankan `lint_applet` dan `compile_applet` (sesuai arahan tool).

## 3. Tabel Matriks Prasyarat Coding

| Target Tugas | Prasyarat Wajib Baca (Sesi Konteks) |
| :--- | :--- |
| **API Endpoints** | `architecture/routing.md`, `architecture/request-response.md` |
| **Database/Prisma** | `architecture/database-schema.md` |
| **Autentikasi** | `architecture/authentication.md` |
| **Modul Bisnis (Apps)** | `apps/module-*.md` dan API teknis terkait |
| **Integrasi** | `human-manual/integrations.md`, `architecture/integrations.md` |

---
**Pesan Akhir:** Jika Anda menemukan dokumentasi yang usang, bentrok, atau kurang informatif saat menjalankan alur ini, **tugas pertama Anda adalah memperbaiki dokumentasi tersebut** sebelum melanjutkan coding. Jangan mengasumsikan apapun.