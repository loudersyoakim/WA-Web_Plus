# 🌿 WA-Web CTL (Custom Tool Line)
**Enhancing Privacy and Personalization for WhatsApp Web with Precision.**

![Version](https://img.shields.io/badge/version-1.1.0-blue) 
![Manifest](https://img.shields.io/badge/Manifest-V3-green) 
![License](https://img.shields.io/badge/License-MIT-orange)

---

## 📌 Tentang Proyek
**WA-Web CTL** adalah ekstensi Chrome eksperimental yang dirancang untuk meningkatkan privasi dan kustomisasi visual saat menggunakan WhatsApp Web. Proyek ini bermula dari pengembangan sederhana (iseng) untuk mempermudah penggunaan pribadi, namun tetap mengutamakan stabilitas fungsionalitas. 

Jika Anda ingin mengembangkan lebih lanjut atau menggunakannya sebagai referensi pembelajaran, silakan melakukan *fork* atau kontribusi pada repositori ini.

---

## ✨ Fitur Utama

### 🔒 Modul Privasi (Privacy Guard)
Lindungi tampilan layar Anda dari pantauan orang sekitar:
* **Smart Blur**: Mengaburkan cuplikan pesan terbaru, nama kontak, foto profil, dan isi percakapan secara terpisah.
* **Group Sender Privacy**: Fitur untuk menyembunyikan nama pengirim pesan di dalam grup untuk meningkatkan anonimitas.
* **Message Recovery**: Mendeteksi dan menampilkan kembali pesan yang telah dihapus atau ditarik oleh lawan bicara.

### 🎨 Modul Kustomisasi (Advanced Customization)
Personalisasi antarmuka WhatsApp Web sesuai selera estetika Anda:
* **Independent Status Downloader**: Tombol unduh status mandiri yang ditempatkan secara strategis tanpa mengganggu navigasi asli WhatsApp.
* **Analog-Controlled Wallpaper**: Fitur kustomisasi latar belakang chat yang dinamis:
    * **Analog Position Control**: Mengatur letak gambar (X & Y) secara bebas menggunakan kontrol analog bulat.
    * **Visual Filters**: Mendukung pengaturan *Opacity* (transparansi), *Blur* gambar, dan rotasi yang presisi.
    * **Edge Feathering**: Memberikan efek pudar di tepian gambar agar menyatu halus dengan latar belakang chat.

---

## 🚀 Instalasi Lokal

1.  **Unduh (Download)** atau **Clone** repositori ini ke penyimpanan lokal Anda.
2.  Buka browser Google Chrome dan akses `chrome://extensions/`.
3.  Aktifkan **Developer Mode** di pojok kanan atas halaman.
4.  Klik tombol **Load unpacked**.
5.  Pilih folder **WA-Web CTL** yang telah Anda unduh.
6.  Buka [WhatsApp Web](https://web.whatsapp.com) dan tekan **F5** untuk memuat ulang skrip.

---

## 🛠️ Catatan Teknis
* **Pure JavaScript & CSS**: Dibangun tanpa menggunakan *framework* pihak ketiga yang berat untuk menjaga performa tetap ringan.
* **Modular Scripts**: Kode dipisahkan berdasarkan fungsinya.
* **Reactive Sync**: Menggunakan *Chrome Storage Listener* sehingga perubahan di menu popup langsung diterapkan tanpa perlu memuat ulang halaman.

---

## ✒️ Pengembang
Proyek ini dikembangkan dengan keisengan oleh **Louders**.
*Proyek ini bersifat terbuka untuk pengembangan lebih lanjut.*
