# BLUEPRINT PROYEK: AURORA SKETCHPAD (Nama Sementara)

**Versi Dokumen:** 1.0
**Tipe Proyek:** Web-based Drawing Application
**Tema Utama:** Futuristik, Glassmorphism, Vibrant Chibi Aesthetics.

---

## 1. RINGKASAN EKSEKUTIF

Tujuan proyek ini adalah membangun aplikasi menggambar berbasis web yang modern dan ringan. Aplikasi ini tidak hanya menyediakan alat untuk menggambar, tetapi juga menawarkan pengalaman visual yang imersif. Antarmuka pengguna akan terasa seperti panel kontrol pesawat ruang angkasa holografik (futuristik) yang terbuat dari kaca buram (glassmorphism), dengan palet warna yang diambil langsung dari maskot karakter chibi yang disediakan.

Target audiens adalah seniman digital pemula hingga menengah, penggemar gaya anime/chibi, dan pengguna yang menghargai estetika UI yang unik.

---

## 2. IDENTITAS VISUAL & BRANDING

### A. Palet Warna (Diambil dari Karakter)

Palet ini harus digunakan secara konsisten di seluruh UI.

| Peran Warna                | Deskripsi                 | Contoh Hex Code (Estimasi)              | Penggunaan dalam UI                                              |
| :------------------------- | :------------------------ | :-------------------------------------- | :--------------------------------------------------------------- |
| **Primary Accent**   | Cyan/Turquoise Bercahaya  | `#00F0FF` atau `#34E4EA`            | Tombol aktif, garis seleksi, efek*glow* pada ikon, kursor.     |
| **Secondary Accent** | Emas/Kuning Metalik       | `#FFD700` atau `#E6C85D`            | Notifikasi penting, bingkai panel khusus,*highlight* sekunder. |
| **UI Base (Glass)**  | Putih/Abu-abu Transparan  | `rgba(255, 255, 255, 0.15)`           | Latar belakang panel alat, header, latar belakang layer.         |
| **UI Text/Dark**     | Biru Tua/Arang            | `#2A2A3A` atau `#1F2430`            | Teks utama, ikon saat tidak aktif, bayangan dalam.               |
| **Special Brand**    | Rainbow Gradient (Pastel) | (Linear Gradient) Pink-Kuning-Cyan-Ungu | Logo, latar belakang*loading screen*, brush khusus "Rainbow".  |

### B. Konsep Logo (Tanpa Teks)

* **Bentuk:** Sebuah simbol abstrak yang menggabungkan elemen alat gambar dan futurisme.
* **Ide Visual:** Sebuah bentuk **cincin orbital** (seperti orbit planet) yang miring, terbuat dari cahaya cyan yang berpendar. Di tengah cincin tersebut, ada **jejak kuas melengkung** yang warnanya bergradasi pelangi (seperti rambut karakter), seolah-olah kuas tersebut sedang melukis orbit cahaya itu.
* **Kesan:** Dinamis, digital, magis, dan berteknologi tinggi.

### C. Ilustrasi Maskot

Karakter chibi yang ada akan menjadi "pemandu" aplikasi. Kita perlu ilustrasi baru di mana dia sedang beraksi.

* **Pose:** Karakter duduk mengambang di udara (atau di kursi futuristik transparan).
* **Aktivitas:** Dia memegang *stylus* yang ujungnya menyala cyan. Di depannya, ada **kanvas holografik** yang melayang.
* **Detail:** Dia sedang menarik garis pada kanvas tersebut. Garis yang ditariknya mengeluarkan partikel cahaya pelangi. Seragamnya mungkin memiliki sedikit tambahan pendaran cahaya *cybernetic* di bagian bahu atau headsetnya. Ekspresinya fokus tapi ceria.

---

## 3. BAHASA DESAIN: FUTURISTIC GLASSMORPHISM

Ini adalah aturan bagaimana UI harus dibangun untuk mencapai kesan tersebut.

### Aturan Glassmorphism:

1. **Transparansi & Blur:** Semua panel UI (toolbar, layer panel) tidak boleh solid. Mereka harus semi-transparan dengan efek buram di belakangnya.
   * *CSS:* `background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px);`
2. **Layering & Depth:** Panel harus terlihat "mengambang" di atas kanvas. Gunakan bayangan halus dan border tipis yang bercahaya.
   * *CSS:* `box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3);`
3. **Refleksi Cahaya:** Tambahkan gradient halus putih transparan dari sudut kiri atas ke kanan bawah pada panel untuk memberikan kesan permukaan kaca yang memantulkan cahaya.

### Elemen Futuristik:

1. **Glowing Edges:** Saat tombol di-hover atau aktif, berikan efek pendaran (glow) berwarna Cyan (`box-shadow` dengan warna cyan dan spread yang besar).
2. **Ikonografi:** Gunakan ikon bergaya *line-art* yang bersih. Hindari ikon yang terlalu padat/berisi.
3. **HUD Elements:** Tambahkan elemen dekoratif halus seperti garis kisi-kisi (grid lines) tipis yang nyaris tidak terlihat di latar belakang, atau sudut-sudut bingkai digital pada area kanvas.

---

## 4. ARSITEKTUR TEKNIS (TECH STACK)

Rekomendasi teknologi untuk membangun *Drawing App* yang performanya tinggi.

* **Frontend Framework:** **React** (dengan TypeScript). React sangat baik untuk mengelola *state* UI yang kompleks (seperti panel layer yang bisa digeser, pilihan warna, dll). TypeScript wajib digunakan untuk mencegah error tipe data pada logika penggambaran yang rumit.
* **Canvas Engine (Inti Aplikasi):** **Konva.js**.
  * *Alasan:* Konva.js sangat baik menangani canvas 2D dengan performa tinggi. Ia memiliki sistem objek bawaan, memudahkan untuk mengelola "goresan kuas" sebagai objek, melakukan transformasi (rotate/scale), dan yang terpenting: sistem **Layers** dan **Caching** yang sangat dibutuhkan aplikasi gambar.
* **State Management:** **Zustand** atau **Redux Toolkit**. Untuk menyimpan data global seperti: warna yang sedang dipilih, ukuran brush saat ini, urutan layer.
* **Styling:** **Tailwind CSS** (untuk struktur cepat) dikombinasikan dengan custom CSS untuk efek *glassmorphism* dan *glow* yang spesifik.

---

## 5. FITUR INT (MVP - Minimum Viable Product)

Fase 1 pembangunan harus fokus pada fitur dasar ini agar aplikasi bisa digunakan:

1. **Canvas Interaktif:**
   * Bisa menggambar (tracking mouse/touch).
   * Zoom in / Zoom out.
   * Pan (menggeser area kanvas).
2. **Brush System Dasar:**
   * Pen Tool (Garis tajam/ink).
   * Eraser Tool (Penghapus).
   * Pengatur ukuran brush (slider futuristik).
   * *Fitur Kunci:* **Stabilizer/Smoothing**. Wajib ada agar garis terlihat mulus seperti contoh art chibi.
3. **Color System:**
   * Color Picker (Roda warna atau kotak).
   * Palet warna tersimpan (Warna-warna karakter sudah di-preset di sini).
4. **Layer System (Esensial):**
   * Menambah, menghapus, dan menyembunyikan layer.
   * Mengubah urutan layer (drag and drop).
   * Mengatur Opacity layer.
5. **Export:**
   * Simpan hasil gambar sebagai PNG/JPG.

---

## 6. TATA LETAK UI (WIREFLAME MENTAL)

Bayangkan layar terbagi menjadi beberapa panel kaca mengambang:

* **Tengah (Dominan):** Area Kanvas Tempat Menggambar.
* **Kiri (Panel Vertikal Kaca):** **Toolbar**. Berisi ikon alat (Brush, Eraser, Move Tool). Ikon aktif menyala cyan. Di bawahnya ada slider ukuran brush.
* **Kanan Atas (Panel Kotak Kaca):** **Color Panel**. Roda warna dan preset warna karakter.
* **Kanan Bawah (Panel Vertikal Kaca):** **Layers Panel**. Daftar layer dengan thumbnail kecil. Tombol "New Layer" yang terlihat futuristik.
* **Pojok Kiri Atas:** Logo Cincin Orbital (tanpa teks).
* **Pojok Kanan Bawah (Kecil, Transparan):** Ilustrasi Maskot Chibi yang sedang menggambar, seolah mengawasi user.
