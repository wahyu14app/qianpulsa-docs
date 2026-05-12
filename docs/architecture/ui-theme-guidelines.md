# Pedoman Desain & Tema UI (UI/UX & Theming Guidelines)

Dokumen ini memuat standar desain, pemilihan warna, dan pengelolaan tema (Light/Dark Mode) untuk tiga aplikasi utama dalam Ekosistem QianPulsa: **Admin App**, **Seller App**, dan **Store App**. Seluruh AI atau Front-End Developer wajib mematuhi pedoman ini saat membangun antarmuka pengguna _(User Interface)_.

## 1. Aturan Mode Gelap (Dark Mode) & Terang (Light Mode)

- **Halaman Publik (Guest Area)**: Seluruh halaman yang bersifat publik atau diakses sebelum login (seperti Landing Page utaman, halaman Tentang Kami, atau halaman Login/Register) **HANYA BOLEH menggunakan Mode Terang (Light Mode)**. Dilarang mengimplementasi Dark Mode pada halaman-halaman guest ini agar konsistensi _branding_ awal tetap terjaga.
- **Halaman Dashboard (Protected Area)**: Baik Admin App, Seller App, maupun Store App (setelah login) harus mendukung peralihan **Mode Terang** dan **Mode Gelap**.
- **Warna Identitas Dark Mode**: Jika pengguna mengaktifkan Mode Gelap, latar belakang (background) kanvas utama **WAJIB** menggunakan warna **Hex `#000000`** (Hitam Pekat / _True Pitch Black_). Dilarang menggunakan warna _Dark Gray_ standar Tailwind seperti `zinc-900` atau `slate-900` sebagai _background body_ utama di Dark Mode. Tujuannya adalah memberikan kontras maksimal dan menghemat baterai layar OLED.

## 2. Branding & Warna Utama (Primary Color)

Setiap aplikasi Frontend memiliki identitas warna _Primary_ tersendiri yang wajib diadopsi dalam tombol aksi utama, navigasi aktif, dan elemen interaktif lainnya:

### A. Admin App

- **Primary Color**: **Kuning (Yellow)**.
- Seluruh elemen aksi (tombol _Approve_, ikon notifikasi, garis tepi kanvas yang aktif) harus berpusat pada hierarki warna Kuning. Cocok disandingkan dengan background Light (putih murni) atau Dark (`#000000`).

### B. Seller App (Panel B2B)

- **Primary Color**: **Kuning (Yellow)**.
- Layaknya panel Admin, Seller App memiliki skema profesional bernuansa Kuning. Hal ini untuk menyatukan mental model antara pengelola pusat dan "Agen Pengelola" bahwa mereka berada di dapur sistem.

### C. Store App (Toko Pelanggan B2C)

- **Primary Color**: **Dinamis (Dynamic/White-Label)**.
- Warna utama Store App **TIDAK** dipaksa Kuning. Warna utama komponen UI dalam Store App **wajib dirender (diambil) berdasarkan konfigurasi `themeColor`** pada tabel database `Store` yang telah diset oleh Seller.
- AI Front-End yang membangun _Store App_ wajib memastikan sistem CSS (_seperti variabel CSS Tailwind / Styled Components_) memuat warna _Primary_ dari API Respons Store Profile secara _real-time_.

## 3. Implementasi Frontend & Naming Convention (Opsional/Rekomendasi)

- **Komponen**: Direkomendasikan menggunakan perpaduan **Tailwind CSS** untuk kecepatan _styling_ dan Headless UI (seperti _Radix_ atau _shadcn/ui_) untuk aksesibilitas komponen kompleks.
- **Variables**: Siapkan CSS Variable Global di `index.css` atau `globals.css` (Contoh: `--color-primary`, `--bg-base`, dsb) agar mempermudah perpindahan warna `#000000` dan manipulasi tema adaptif pada _Store App_.
