![Banner](https://darikami.vercel.app/dariKami_thumbnail.svg)
## 📢 Dapatkan Update Terbaru (Apabila ada tambahan Fitur)
# Daftar Versi #
-   [ ] 1.0.0 (Versi Awal) 18 Juli 2025
-   [x] 1.0.1 (Versi saat ini) terakhir diperbarui 21 Juli 2025
[![Ikuti Saluran WhatsApp](https://img.shields.io/badge/Ikuti%20di-WhatsApp-green?logo=whatsapp)](https://whatsapp.com/channel/0029Vb6WmoKGpLHOdbB4NS3I)
# dariKami! ~ buat Jajan V1.0.1 (21 Juli 2025)
```💬 “Karena kadang, apresiasi gak perlu rumit. Cukup... dari kami, buat jajan.”
Halaman Dukungan Kreator 100% Gratis via QRIS
```
![Lisensi MIT](https://img.shields.io/badge/Lisensi-MIT-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-14.x-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

Selamat datang di **dariKami!** Sebuah proyek *open-source* yang menyediakan kode halaman dukungan untuk para kreator, streamer, developer, atau siapa pun yang ingin menerima dukungan finansial dari audiens mereka.

Tujuan utama dari proyek ini adalah menyediakan solusi yang **100% gratis tanpa potongan biaya platform**, di mana semua dukungan langsung masuk ke tangan kreator melalui QRIS.

Proyek ini masih dalam tahap pengembangan aktif. Fitur utama yang sedang dikembangkan adalah kemampuan untuk memecah QRIS statis menjadi dinamis, memungkinkan setiap transaksi memiliki kode QR unik. Kami percaya pada kekuatan komunitas, dan kontribusi Anda sangat kami harapkan untuk pengembangan di masa depan!

---

## ✨ Fitur Utama

-   ✅ **100% Gratis & Open Source:** Tidak ada biaya platform, tidak ada potongan tersembunyi.
-   💳 **Pembayaran via QRIS:** Memanfaatkan QRIS sebagai metode pembayaran utama yang universal di Indonesia.
-   📱 **Desain Responsif:** Tampilan yang optimal di semua perangkat, baik desktop maupun mobile.
-   📄 **Invoice Dukungan:** Pengguna dapat mengunduh bukti pembayaran dalam bentuk invoice yang rapi.
-   ⏳ **Timer Pembayaran:** Batas waktu pembayaran 5 menit di modal QRIS untuk memastikan transaksi diselesaikan.
-   📂 **Riwayat Dukungan:** Riwayat dukungan disimpan di sisi pengguna (*local storage*) untuk kemudahan pelacakan.
-   🔧 **Mudah Dikonfigurasi:** Cukup dengan satu file environment (`.env`) untuk mengatur data QRIS statis Anda.

---

## 🚀 Dibangun Dengan

Proyek ini dibangun menggunakan teknologi modern untuk memastikan performa, keamanan, dan kemudahan pengembangan.

-   [Next.js](https://nextjs.org/) - Framework React untuk aplikasi web modern.
-   [React](https://reactjs.org/) - Library JavaScript untuk membangun antarmuka pengguna.
-   [TypeScript](https://www.typescriptlang.org/) - Menambahkan tipe statis pada JavaScript untuk kode yang lebih solid.
-   [html2canvas](https://html2canvas.hertzen.com/) - Untuk membuat gambar invoice dari elemen HTML.
-   [qrcode](https://github.com/soldair/node-qrcode) - Untuk generate data QR code di sisi server.

---

## 🛠️ Panduan Instalasi

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut.

### Prasyarat

Pastikan Anda sudah menginstal:
* Node.js (v18.x atau lebih baru)
* npm atau yarn

### Langkah-langkah

1.  **Clone Repositori**
    ```sh
    git clone [https://github.com/awusahrul/dariKami.git](https://github.com/awusahrul/dariKami.git)
    cd dariKami
    ```

2.  **Instal Dependensi**
    ```sh
    npm install
    ```
    atau jika menggunakan yarn:
    ```sh
    yarn install
    ```

3.  **Konfigurasi Environment Variable (Langkah Paling Penting)**
    
    Proyek ini membutuhkan data QRIS statis Anda yang disimpan dalam *environment variable*.

    a. Buat file baru di direktori utama proyek bernama `.env.local`.
    
    b. Salin konten di bawah ini ke dalam file `.env.local` tersebut dan **ganti nilainya** dengan string QRIS statis milik Anda.
    
    ```env
    # /.env.local
    
    # Ganti dengan string data QRIS statis Anda
    # Ini adalah data yang akan digunakan untuk generate QR code pembayaran
    AWUSAHRUL_QRIS_STATIS="PASTE_STRING_QRIS_STATIS_ANDA_DI_SINI"
    ```

    > **Penting:** Pastikan file `.env.local` sudah ditambahkan ke dalam `.gitignore` Anda agar tidak terunggah ke repositori publik.

4.  **Jalankan Server Pengembangan**
    ```sh
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya. Halaman dukungan akan tersedia di [http://localhost:3000/dukungan](http://localhost:3000/dukungan).

---

## 🗺️ Rencana Pengembangan (Roadmap)

Proyek ini memiliki potensi besar dan berikut adalah beberapa fitur yang direncanakan untuk pengembangan di masa depan:

-   [x] Implementasi penuh QRIS Dinamis.
-   [ ] Notifikasi dukungan secara real-time (misalnya via WebSockets).
-   [ ] Halaman dashboard sederhana untuk kreator.
-   [ ] Opsi kustomisasi tema dan tampilan.

Punya ide lain? Jangan ragu untuk membuka *issue* atau *pull request*!

---

## 🤝 Berkontribusi

Kontribusi Anda sangat berarti untuk membuat proyek ini lebih baik! Jika Anda ingin berkontribusi, silakan:

1.  **Fork** repositori ini.
2.  Buat **Branch** baru (`git checkout -b fitur/FiturKeren`).
3.  **Commit** perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`).
4.  **Push** ke Branch Anda (`git push origin fitur/FiturKeren`).
5.  Buka sebuah **Pull Request**.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT**. Lihat file `LICENSE` untuk detailnya.
