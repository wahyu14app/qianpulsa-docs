# Keuangan: Alur Pembayaran & Profit

Dokumen ini menjelaskan mengapa tidak ada fitur pemotongan saldo atau penarikan (withdrawal) di platform ini.

## 1. Model Integrasi Langsung (Direct Integration)
Platform ini menerapkan model SaaS (Software as a Service) murni untuk penyewaan toko produk digital:
- Seller **mengintegrasikan akun/kredensial API Digiflazz mereka sendiri**.
- Seller **mengintegrasikan akun Payment Gateway mereka sendiri**.

## 2. Pengelolaan Profit
- Karena seluruh API terhubung langsung ke milik Seller, maka **seluruh pendapatan/keuntungan (profit)** dari transaksi pelanggan akan langsung masuk ke rekening/akun Payment Gateway milik Seller.
- Platform **tidak bertindak sebagai escrow/penengah keuangan**. Oleh karena itu, fitur penarikan saldo (withdrawal) tidak diperlukan karena dana tidak pernah singgah di platform.
