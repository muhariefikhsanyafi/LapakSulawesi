![Banner](https://darikami.vercel.app/dariKami_thumbnail.svg)

# dariKami V2! ~ Buat Jajan

[![Ikuti Saluran WhatsApp](https://img.shields.io/badge/Ikuti%20di-WhatsApp-green?logo=whatsapp)](https://whatsapp.com/channel/0029Vb6WmoKGpLHOdbB4NS3I)
[![Versi](https://img.shields.io/badge/Versi-2.0-blueviolet)](https://github.com/awusahrul/dariKami)
![Lisensi MIT](https://img.shields.io/badge/Lisensi-MIT-blue.svg)

```💬 "Karena apresiasi itu gak perlu ribet. Cukup... dari kami, buat jajan."
Halaman Dukungan Kreator 100% Gratis yang Dikelola Sepenuhnya via GitHub.
````

Selamat datang di **dariKami V2!** 🎉

Versi 2 ini mengubah **dariKami** dari sekadar halaman donasi statis menjadi platform dukungan **headless** yang dinamis. Semua data transaksi dukungan kini disimpan dan dikelola langsung dari **repositori GitHub pribadi Anda**, memberikan Anda kontrol penuh atas data tanpa perlu database.

Dengan dariKami V2, setiap dukungan yang masuk akan otomatis tercatat di file `public/data/darikami.json` pada repo GitHub Anda, yang kemudian bisa Anda tampilkan di halaman dashboard.

> *"Ini dari kami, untukmu. Teruslah berkarya!"*

-----

## 🤔 Bagaimana Cara Kerjanya? (Arsitektur V2)

Sistem V2 bekerja dengan memisahkan antara tampilan, logika, dan data:

1.  **Frontend (Halaman Dukungan & Dashboard):** Dibuat dengan Next.js, berjalan di Vercel. Ini adalah bagian yang dilihat oleh pengguna.
2.  **Backend (API):** Sebuah API route di Next.js yang berfungsi sebagai perantara aman antara frontend dan GitHub.
3.  **Database (GitHub Repository):** Sebuah repositori GitHub **pribadi** milik Anda digunakan sebagai tempat penyimpanan file `data.json` yang berisi semua catatan transaksi.

-----

## ✨ Fitur Utama V2

  * ✅ **Penyimpanan Data di GitHub** – Gunakan repo GitHub pribadi sebagai database gratis dan aman.
  * ✅ **Dashboard Transaksi** – Pantau dan ubah status semua dukungan yang masuk melalui halaman dashboard.
  * ✅ **Gratis & Open Source** – Tanpa biaya platform, tanpa potongan tersembunyi.
  * 💳 **Dukungan Instan via QRIS Dinamis** – QR code unik dibuat untuk setiap nominal transaksi.
  * 📱 **Desain Responsif** – Tampilan optimal di desktop & mobile.
  * 📄 **Invoice Dukungan** – Bukti pembayaran bisa diunduh dengan tampilan rapi.
  * ⏳ **Timer Pembayaran** – Mengingatkan penyelesaian transaksi dalam 5 menit.

-----

## 🚀 Dibangun Dengan

  * [Next.js](https://nextjs.org/) – Framework React modern.
  * [React](https://reactjs.org/) – Library untuk antarmuka interaktif.
  * [TypeScript](https://www.typescriptlang.org/) – JavaScript dengan tipe yang lebih aman.
  * [GitHub API](https://docs.github.com/en/rest) – Digunakan sebagai backend untuk menyimpan dan membaca data.
  * [html2canvas](https://html2canvas.hertzen.com/) – Membuat tangkapan layar invoice dari HTML.
  * [qrcode](https://github.com/soldair/node-qrcode) – Generate QR code di sisi server.

-----

## 🛠️ Panduan Instalasi & Deployment

Proses instalasi V2 sedikit lebih detail karena membutuhkan koneksi ke GitHub. Ikuti langkah-langkah ini dengan saksama.

### Bagian 1: Persiapan Repositori Data di GitHub

Anda memerlukan **repositori kedua** yang bersifat **pribadi (private)** untuk menyimpan data transaksi.

1.  Buat repositori baru di GitHub dan atur visibilitasnya ke **Private**. Beri nama bebas, contoh: `data-dukungan`.
2.  Di dalam repositori baru tersebut, buat struktur folder dan file berikut: `public/data/darikami.json`.
3.  Isi file `data.json` dengan objek JSON kosong sebagai permulaan:
    ```json
    {}
    ```

### Bagian 2: Cara Membuat GitHub Token

API kita butuh "kunci" untuk bisa mengakses dan mengubah file di repositori pribadi Anda. Kunci ini disebut Personal Access Token.

1.  Buka **Settings** di akun GitHub Anda (klik foto profil Anda di pojok kanan atas).
2.  Di menu kiri bawah, klik **Developer settings**.
3.  Pilih **Personal access tokens** -\> **Tokens (classic)**.
4.  Klik tombol **Generate new token** -\> **Generate new token (classic)**.
5.  **Note:** Beri nama token yang deskriptif, contoh: `dariKami API Token`.
6.  **Expiration:** Pilih durasi masa aktif token (misalnya, 90 hari atau `No expiration` untuk kemudahan).
7.  **Select scopes:** Centang kotak di sebelah **`repo`**. Ini memberikan izin penuh untuk mengakses repositori Anda.
8.  Klik **Generate token**.
9.  **SEGERA SALIN TOKEN ANDA\!** Simpan di tempat yang aman. Anda tidak akan bisa melihatnya lagi setelah meninggalkan halaman ini.

### Bagian 3: Instalasi Lokal (Untuk Development)

1.  **Clone Repository `dariKami`**

    ```sh
    git clone [https://github.com/awusahrul/dariKami.git](https://github.com/awusahrul/dariKami.git)
    cd dariKami
    ```

2.  **Instal Dependensi**

    ```sh
    npm install
    ```

3.  **Konfigurasi Environment `.env.local`**
    Buat file `.env.local` di direktori utama `dariKami` dan isi dengan semua variabel berikut:

    ```env
    # Ganti dengan informasi Anda
    GITHUB_TOKEN="ghp_TOKENYANGANDASALINTADI"
    REPO_OWNER="username-github-anda"
    REPO_NAME="nama-repo-data-pribadi-anda" # Contoh: data-dukungan
    BRANCH="main"
    JSON_FILE_PATH="public/data/darikami.json"

    # Ganti dengan string QRIS statis Anda yang asli
    DATA_STATIS_QRIS="PASTE_STRING_QRIS_STATIS_ANDA_DI_SINI"
    ```

4.  **Jalankan Server Development**

    ```sh
    npm run dev
    ```

    Buka [http://localhost:3000/dukungan](https://www.google.com/search?q=http://localhost:3000/dukungan) di browser Anda.

### Bagian 4: Deployment ke Vercel (Rekomendasi)

1.  Daftar atau login ke [Vercel](https://vercel.com) menggunakan akun GitHub Anda.
2.  Dari dashboard Vercel, klik **Add New...** -\> **Project**.
3.  Pilih repositori `dariKami` Anda dan klik **Import**.
4.  Buka bagian **Environment Variables**.
5.  Masukkan **semua variabel** yang ada di file `.env.local` Anda satu per satu (`GITHUB_TOKEN`, `REPO_OWNER`, `REPO_NAME`, dll.). Pastikan nilainya benar.
6.  Klik **Deploy**. Tunggu beberapa saat, dan aplikasi Anda akan online\!

-----

## 🗺️ Roadmap

  - [x] QRIS Dinamis untuk setiap transaksi.
  - [x] Penyimpanan data transaksi via GitHub API.
  - [x] Dashboard Transaksi Interaktif.
  - [ ] Notifikasi dukungan real-time (misalnya via Telegram Bot).
  - [ ] Pilihan kustomisasi tema & tampilan dari halaman dashboard.
  - [ ] Analitik sederhana di halaman dashboard.

-----

## 🤝 Kontribusi

Kontribusi Anda sangat diterima\! Silakan fork repositori ini dan buka *pull request* untuk ide-ide baru.

-----

## 📄 Lisensi

Dirilis di bawah **MIT License**. Lihat file `LICENSE` untuk detail.

-----

© 2025 **dariKami** | Dibuat oleh [@awusahrul](https://github.com/awusahrul)

```
```
