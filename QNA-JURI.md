# Q&A Persiapan Penjurian — KopdesLink

> **Cara pakai:** tiap pertanyaan punya **jawaban singkat (1 kalimat lisan)** + **jawaban lengkap (untuk pendalaman)**. Hafal betul bagian **★ Pertanyaan Kunci**. Jangan membaca — **ceritakan**. Setiap anggota harus bisa membela gagasan sendiri (juri bisa minta *live defense*).

**Kalimat jangkar (ulang di banyak jawaban):**
> *"SIMKOPDES Hub menghubungkan tiap Kopdes ke **pemerintah** — vertikal, untuk pemantauan. KopdesLink menghubungkan Kopdes **satu sama lain** — horizontal, untuk aksi. Kami membaca data yang sudah dipusatkan Hub, lalu mengubahnya jadi **transaksi gotong-royong nyata**."*

**Fakta yang membedakan kami dari peserta lain (sebut sesering mungkin):**
> *"Demo kami **bukan data karangan** — kami berjalan di atas **data nyata** database resmi hackathon: 7 Koperasi Kelurahan Merah Putih asli di **Kota Kupang**, produk **Beras SPHP 5KG** dengan barcode nyata, satu Kopdes backorder −100 karung ditutup surplus tetangga 3,7 km."*

---

## ★ BAGIAN A — POSISI TERHADAP SIMKOPDES HUB (paling mungkin ditanya)

### A1. "SIMKOPDES Hub kan sudah ada dan sudah memusatkan semua data koperasi. Bukankah KopdesLink tumpang tindih / tidak perlu?" ★★★

**Jawaban singkat (hafalkan):**
> *"Tidak tumpang tindih — kami melengkapi. SIMKOPDES Hub adalah **sistem pencatatan & pengawasan** (registrasi, profil, kesehatan keuangan, RAT, inventarisasi lahan, integrasi lintas-kementerian). Ia **memusatkan data secara vertikal**, tapi tidak melakukan **aksi horizontal**: tidak mempertemukan stok kosong Kopdes A dengan surplus Kopdes B lalu mengeksekusi transaksinya. Itulah yang kami kerjakan."*

**Jawaban lengkap:**
- SIMKOPDES Hub unggul sebagai **system-of-record + monitoring**: 92,69% (76.733) Kopdes sudah punya akun; terintegrasi data pajak, Dukcapil, dana desa, dan lahan Agrinas. Fungsinya: pemantauan, kepatuhan, transparansi, tata kelola.
- Yang **belum ada**: lapisan **operasional peer-to-peer**. Data pasokan terpusat, tapi *dipakai untuk melaporkan*, bukan untuk *bertindak*. Tidak ada alur bagi manajer Kopdes: "cari surplus terdekat → ajukan → disetujui → stok berpindah".
- KopdesLink = **lapisan aplikasi di atas data Hub** yang menutup celah itu.
- **Justru karena Hub sudah memusatkan data, kami diuntungkan:** integrasi kami cukup **satu titik** (API Hub), bukan 80.000 koneksi. (lihat A3)
- Kalimat penutup kuat: *"Hub menjawab 'bagaimana kondisi tiap Kopdes?'. KopdesLink menjawab 'Kopdes ini kehabisan beras — siapa tetangga yang bisa menutup, sekarang?'. Dua pertanyaan berbeda, dua sistem yang saling melengkapi."*

---

### A2. "Kalau Hub sudah punya semua data stok terpusat, kenapa Hub tidak sekalian menambah fitur matchmaking? Buat apa aplikasi terpisah?" ★★★

**Jawaban singkat:**
> *"Bisa saja suatu hari — dan KopdesLink justru mempercepatnya, karena kami sudah membuktikan produk, algoritma, dan UX-nya. Tapi matchmaking transaksional adalah kebutuhan yang berbeda dari pencatatan/pengawasan: butuh mesin geospasial, alur persetujuan B2B, dan antarmuka manajer di lapangan — bukan tugas alami sebuah sistem pelaporan."*

**Jawaban lengkap:**
- **Pemisahan concern:** platform pengawasan dioptimalkan untuk *audit, kepatuhan, konsistensi data*. Marketplace operasional dioptimalkan untuk *kecepatan baca geospasial, alur transaksi, UX manajer awam teknologi*. Menyatukannya memperlambat keduanya.
- **De-risking untuk Kemenkop:** membangun fitur ini langsung di dalam Hub berisiko (menyentuh sistem kritis nasional). KopdesLink membuktikannya di luar dulu — kalau terbukti, kami bisa jadi **modul resmi** yang menyalakan fitur ini di ekosistem Hub. Pemerintah dapat inovasi tanpa risiko ke system-of-record.
- **Analogi:** *"Bank punya core banking (system-of-record). Tapi 'cari ATM/merchant terdekat + bayar' dikerjakan aplikasi di atasnya, bukan oleh core banking itu sendiri. Kami adalah lapisan aplikasi itu untuk pasokan antar-Kopdes."*

---

### A3. "Bagaimana persisnya KopdesLink terhubung ke data 80.000 Kopdes? API? Federated database?" ★★★

**Jawaban singkat (hafalkan):**
> *"Satu titik integrasi: **API SIMKOPDES Hub**. Karena Hub sudah mengagregasi data nasional, kami **tidak** perlu menembak 80.000 database atau federated query. Kami tarik data pasokan minimum dari Hub ke **read-model** kami yang ter-index geospasial, lalu matchmaking dilayani dari situ dalam milidetik. Di MVP ini kami **sudah membuktikannya** dengan membaca database resmi hackathon secara langsung."*

**Jawaban lengkap — model interoperabilitas:**

| Lapis | Mekanisme | Fungsi |
|---|---|---|
| **1. Ingest** | **Baca dari API/DB SIMKOPDES Hub (read-only)** — di MVP ini **sudah nyata**: kami baca `profil_koperasi`, `inventaris_produk`, `produk_koperasi`, `barang_keluar_produk` dari DB resmi hackathon. | Ambil field minimum: `kopdes, produk/barcode, qty, koordinat`. Bukan data keuangan/anggota. |
| **2. Read-model** | Salinan ringkas ter-index geospasial (Haversine/PostGIS), dipartisi per wilayah. | Inilah yang di-query saat matchmaking → "surplus dalam radius X km" milidetik. |
| **3. Write-layer** | Di MVP: **di memori aplikasi** (kredensial panitia read-only). Di produksi: **write-back transaksi** ke Hub agar mutasi tercatat resmi. | SIMKOPDES tetap sumber kebenaran; kami tak pernah mengubahnya diam-diam. |

- **Kenapa bukan federated query?** latensi (fan-out lintas puluhan ribu node tak bisa <1 dtk), kerapuhan (1 node mati → query gagal), kedaulatan data. Read-model = baca cepat + tahan gagal (pola **CQRS**).
- **Kunci pencocokan lintas-Kopdes = `kode_barcode`.** Kami verifikasi di data nyata: **2.752 barcode** dipakai >1 Kopdes (mis. Beras SPHP `8994209001796`) — inilah yang menyambungkan surplus & kebutuhan antar koperasi berbeda.

---

### A4. "Kenapa di MVP menulis di memori aplikasi, bukan ke database?" ★★

**Jawaban singkat:**
> *"Karena kredensial database hackathon bersifat read-only — kami verifikasi langsung, tak bisa CREATE/INSERT. Itu justru memaksa desain yang benar: **baca system-of-record, jangan mengubahnya**; lapisan transaksi berjalan di aplikasi kami di atasnya. Di produksi, transaksi ditulis-balik lewat API transaksional Hub."*

**Jawaban lengkap:**
- Kami cek hak akses: `has_schema_privilege('public','CREATE') = false`, `CREATE SCHEMA` ditolak. Jadi menulis ke DB bersama memang tidak dimungkinkan panitia.
- Kami ubah jadi **arsitektur hybrid**: **baca data nyata** (read-only) + **lapisan tulis di aplikasi** (snapshot stok, POS, request B2B, transfer).
- Ini **bukan kompromi, tapi pola yang benar**: aplikasi di atas system-of-record seharusnya tidak memutasi sumber kebenaran secara langsung. Prinsip *data minimization* + *SIMKOPDES tetap pemilik data*.
- Prefix `indonesiacerah_` sudah kami siapkan untuk skenario DB tim yang writable (mis. Cloud SQL sendiri) saat produksi.

---

### A5. "Kalau API Hub belum terbuka untuk pihak ketiga, gimana?" ★

**Jawaban singkat:**
> *"Integrasi bertahap, dan produk tetap berguna sejak Kopdes pertama. MVP sudah jalan dengan membaca data langsung; begitu endpoint resmi Hub dibuka, kami tinggal ganti adapter karena arsitektur sudah API-first."*

**Jawaban lengkap:**
- **Fase 0 (sekarang):** baca data (di demo: DB resmi hackathon). KopdesLink berdiri sendiri — POS + prediksi + matchmaking lokal tetap bernilai.
- **Fase 1:** konektor **read** resmi ke API Hub.
- **Fase 2:** **write-back** transaksi dua arah.
- Menyambung ke API resmi = menambah *adapter*, bukan menulis ulang → menurunkan risiko adopsi pemerintah.

---

## BAGIAN B — KEBIJAKAN & KESELARASAN

### B1. "Apa dasar hukum / keselarasan dengan program pemerintah?"
> *"Inpres No. 9/2025 dan Permenkop No. 1/2026. Program menargetkan 80.000 Kopdes dengan 7 unit usaha wajib, dioperasikan PT Agrinas Pangan Nusantara 2 tahun sebelum diserahkan ke desa. Kami fokus ke unit berbasis stok fisik — gerai sembako, apotek, pergudangan, logistik — dan menyediakan peran dashboard untuk Agrinas/Dinas. Kami enabler program, bukan produk lepas."*

### B2. "Apa untungnya buat pemerintah/Agrinas?"
> *"Untuk pertama kalinya mereka punya **peta rantai pasok mikro antar-desa real-time**: barang apa paling sering kosong per wilayah, siapa memasok siapa, ke mana redistribusi diarahkan. Dasar kebijakan pasokan Agrinas, sekaligus alat transisi menuju desa mandiri saat Agrinas exit di tahun ke-2."*

### B3. "Setelah Agrinas keluar (2 tahun), apa relevansinya?"
> *"Justru makin relevan. Saat Agrinas exit, desa harus mandiri mengatur pasok. KopdesLink adalah infrastruktur gotong-royong yang membuat antar-desa saling menutupi kekosongan tanpa operator pusat. Kami alat transisi menuju kemandirian itu."*

### B4. "Ini menembak tema yang mana?"
> *"Dua sekaligus — Tema 1 (Peningkatan Volume Usaha) lewat POS, prediksi, efisiensi stok; dan Tema 2 (Optimalisasi Potensi Desa) lewat business matching & supply chain. Bahkan challenge question TOR menuliskan persis 'mempertemukan koperasi dengan buyer/offtaker yang tepat' dan contoh solusi 'Supply Chain Monitoring System'."*

---

## BAGIAN C — MODEL BISNIS & DAMPAK

### C1. "Bagaimana menghasilkan uang?"
> *"Tiga opsi selaras program: (1) fee transaksi kecil per matchmaking B2B berhasil; (2) SaaS/lisensi ke Kemenkop-Agrinas sebagai infrastruktur nasional; (3) modul analitik premium untuk Dinas. Fase awal fokus adopsi & bukti dampak — karena 97% laba koperasi milik desa, model kami harus menambah nilai bersih ke desa, bukan menggerusnya."*

### C2. "Apa dampak terukurnya?"
> *"Empat metrik di dashboard: **omzet terselamatkan**, **biaya logistik terpangkas**, **waktu pemenuhan stok** (jam vs hari), **jumlah transaksi gotong-royong**. Di demo Kupang, satu transaksi saja menyelamatkan omzet **Rp10 juta**. Semua bermuara ke laba naik → 97% milik desa → 82% ke warga lewat kupon."*

### C3. "Kenapa Kopdes surplus mau menjual ke tetangga, bukan simpan sendiri?"
> *"Karena surplus = modal mati yang berisiko rusak/kedaluwarsa (sembako & obat). Menjual surplus mengubah stok menganggur jadi pendapatan, dengan harga lebih baik daripada dikembalikan ke distributor. Kedua Kopdes untung — gotong-royong yang berkelanjutan secara ekonomi, bukan amal."*

---

## BAGIAN D — TEKNIS PRODUK

### D1. "Prediksi 'habis dalam X hari' pakai machine learning?"
> *"Di MVP sengaja sederhana: **moving average** penjualan harian dari data `barang_keluar_produk` nyata dibagi stok sekarang. Cukup akurat & transparan untuk pengurus awam. ML musiman ada di roadmap — tapi kami tak mau over-engineer yang sudah 80% selesai dengan moving average."*

### D2. "Pencarian Kopdes terdekat teknisnya bagaimana?"
> *"Query geospasial. Tiap Kopdes punya koordinat (`koordinat_dibulatkan` di data nyata). Kami pakai **Haversine** (PostGIS opsional) untuk mencari Kopdes dengan surplus barang yang dicari dalam radius, diurutkan jarak. Di Kupang, 7 Kopdes rapat dalam radius 8,3 km."*

### D3. "Bagaimana real-time sync antar layar di demo?"
> *"Polling ringan (2–3 detik) ke read-model kami — saat stok berubah, layar lain ikut terupdate. Untuk skala produksi, ingest bersifat event-driven (webhook/CDC dari Hub), bukan polling penuh. Kami sengaja pilih yang sederhana dan tahan-jaringan untuk demo desa."*

### D4. "Desa banyak sinyalnya buruk. Bagaimana?"
> *"Aplikasi **PWA offline-friendly**. Shell & data ter-cache; transaksi POS bisa jalan saat sinyal turun dan tersinkron kembali. Keputusan sadar karena konteks konektivitas desa, bukan afterthought."*

### D5. "Kenapa stack ini (Next.js + Postgres + Leaflet)?"
> *"Dipilih untuk kecepatan sprint + kebutuhan geospasial & interop. Next.js (PWA) satu codebase web+mobile; membaca **Postgres resmi hackathon** langsung (bukti interop nyata); Leaflet+OpenStreetMap gratis tanpa API key. Deploy ke **GCP Cloud Run** pakai kredit panitia. Komponen bisa ditingkatkan untuk skala nasional (event stream, sharding regional) — tak terkunci vendor."*

### D6. "Bagaimana mencegah stok fiktif / harga tidak wajar di matchmaking?"
> *"Berlapis: (1) semua transaksi terekonsiliasi ke SIMKOPDES → auditable Dinas/Agrinas; (2) konfirmasi dua langkah — pemasok harus approve, tidak otomatis; (3) fase lanjut: rating antar-Kopdes & rentang harga acuan wilayah. Di MVP fokus happy-path, tapi kerangka pengawasan sudah jadi bagian desain lewat dashboard pemerintah."*

---

## BAGIAN E — PERTANYAAN JEBAKAN / SKEPTIS

### E1. "Ini kan cuma POS biasa + fitur cari tetangga. Apa kebaruannya?"
> *"POS-stok umumnya berhenti di level satu toko. Kebaruan tunggal kami: **menjadikan surplus satu koperasi sebagai solusi kekosongan koperasi lain, otomatis, pada skala nasional** — belum ada di ekosistem SIMKOPDES/Agrinas. POS hanya pintu masuk data; nilainya di lapisan jaringan horizontal."*

### E2. "Kalau idenya bagus, kenapa belum ada yang buat?"
> *"Karena prasyaratnya baru terpenuhi. Efek jaringan baru bernilai saat ada ribuan node — dan program Kopdes Merah Putih baru membangun 80.000 node sejak 2025. Sebelum SIMKOPDES Hub mendigitalkan & memusatkan data 92% Kopdes, tidak ada data untuk dihubungkan. Kami datang tepat saat fondasi Hub siap."*

### E3. "Bagaimana kalau Kopdes tetangga sama-sama kosong (panen gagal se-wilayah)?"
> *"Sistem memperluas radius; kalau se-wilayah kosong, itu sinyal berharga yang naik ke **dashboard pemerintah** sebagai 'barang rawan kosong regional' → memicu redistribusi dari Agrinas/pusat. Matchmaking lokal & pasokan vertikal saling melengkapi."*

### E4. "Demo cuma 7 Kopdes. Yakin jalan di 80.000?"
> *"Justru arsitektur kami membuat 7 dan 80.000 tidak berbeda secara logika. Matchmaking selalu **lokal** (puluhan tetangga dalam radius), bukan global — kami tak pernah menyentuh 80.000 sekaligus. 7 Kopdes Kupang mensimulasikan 1 kluster; menambah wilayah = menambah shard, bukan mengubah algoritma. Dan integrasi tetap satu titik: API Hub."*

### E5. "Apa risiko terbesar proyek ini?"
> *"Jujur: **adopsi & akses API Hub**, bukan teknologi. Mitigasi: (1) produk berguna mandiri sejak Kopdes pertama (POS + prediksi), tak menunggu massa kritis; (2) arsitektur API-first agar integrasi resmi jadi sambungan, bukan tulis ulang; (3) posisi sebagai enabler pemerintah, bukan pesaing Hub — menurunkan friksi adopsi."*

### E6. "Kalian pakai AI generatif? (aturan orisinalitas TOR Bagian J)"
> *"Ide inti — jaringan gotong-royong antar-Kopdes sebagai lapisan horizontal di atas SIMKOPDES — adalah gagasan asli tim. AI kami pakai sebagai alat bantu: riset pendukung, penyusunan dokumentasi, dan coding assistant — bukan untuk menghasilkan ide inti. Ini kami cantumkan terbuka di README, sesuai kewajiban disclosure TOR."*

---

## Lampiran — Diagram Interkoneksi (untuk whiteboard)

```
   SIMKOPDES HUB  (System of Record — 80.000 Kopdes, data terpusat)
   profil • stok • keuangan • RAT • lahan • integrasi lintas-K/L
                     │  (vertikal: Kopdes → pemerintah, untuk PEMANTAUAN)
                     │
                     │  (1) INGEST: 1 titik — API/DB Hub (read-only, minim field)
                     ▼
   ┌───────────────────────────────────────────────┐
   │  KOPDESLINK — Read-model (CQRS) + Matchmaking  │
   │  kopdes, barcode, qty_surplus, lat/lng          │
   │  index geospasial (Haversine/PostGIS) + cache   │
   │  dipartisi per wilayah (sharding)               │
   └───────────────────────────────────────────────┘
        │  (horizontal: Kopdes ↔ Kopdes, untuk AKSI)       ▲
        ▼                                                  │
   Cari surplus tetangga → ajukan → setujui → transfer   (3) WRITE-BACK
   (dashboard Agrinas/Dinas: peta aliran & rawan kosong)  transaksi → Hub
```

**Tiga kata kunci wajib keluar saat ditanya interkoneksi:**
**(1) Hub = 1 titik integrasi** (bukan 80.000, bukan federated). **(2) Read-model / CQRS** (baca cepat, tahan gagal). **(3) Lokalitas geografis + sharding** (makanya 80.000 tidak jadi beban). — dan selalu tutup dengan: *"Hub vertikal untuk pemantauan; kami horizontal untuk aksi."*
