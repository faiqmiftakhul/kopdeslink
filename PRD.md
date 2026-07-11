# PRD — KopdesLink
### Jaringan Rantai Pasok Gotong-Royong Antar Koperasi Desa Merah Putih

**Versi:** 1.0 (MVP Hackathon)
**Tanggal:** 9 Juli 2026
**Durasi pengerjaan:** 24 jam
**Status ide:** Lolos 100 Besar → Target: **3 Besar**
**Tim:** Hackathon Simkopdes

---

## 0. Ringkasan Eksekutif (Elevator Pitch)

> **SIMKOPDES mencatat stok satu koperasi. KopdesLink menghubungkan stok 80.000 koperasi.**

Pemerintah, melalui **Inpres No. 9 Tahun 2025**, membangun **80.000 Koperasi Desa/Kelurahan Merah Putih (KDMP)** dengan **PT Agrinas Pangan Nusantara** sebagai operator selama 2 tahun. Setiap koperasi wajib menjalankan **7 unit usaha** dan sudah dicatat lewat sistem resmi pemerintah, **SIMKOPDES**.

Namun SIMKOPDES dan operasional Agrinas bersifat **vertikal**: setiap Kopdes mencatat stoknya sendiri lalu dipasok dari atas (Agrinas → Kopdes). Ketika satu Kopdes kehabisan barang, ia menunggu pasokan dari distributor/pusat yang jauh — **padahal Kopdes tetangga sering punya surplus barang yang sama**.

**KopdesLink adalah lapisan jaringan horizontal** yang duduk di atas ekosistem ini: mengubah data stok tiap koperasi menjadi **jaringan pasok kolektif antar-desa**, sehingga kekosongan stok satu Kopdes ditutup oleh surplus Kopdes tetangga secara otomatis. Inilah **digitalisasi prinsip gotong-royong** — dan sekaligus memberi Agrinas & Kemenkop **peta rantai pasok nasional** yang selama ini tidak terlihat.

---

## 1. Konteks Strategis & Keselarasan Kebijakan

> Bagian ini adalah "senjata" untuk penjurian: MVP harus terasa **nyambung dengan program pemerintah yang sedang berjalan**, bukan ide di ruang hampa.

### 1.1 Fakta Program Kopdes Merah Putih (per 2025–2026)

| Aspek | Fakta | Implikasi untuk KopdesLink |
|---|---|---|
| **Dasar hukum** | Inpres No. 9/2025; Permenkop No. 1/2026 | KopdesLink diposisikan sebagai enabler program nasional, bukan produk lepas |
| **Skala** | Target **80.000** Kopdes; ±29.000 dibangun, ribuan gerai diresmikan (1.061 gerai diresmikan Presiden di Nganjuk, 16 Mei 2026) | Efek jaringan (network effect) baru bernilai pada skala ribuan node — justru itu peluangnya |
| **Operator** | **PT Agrinas Pangan Nusantara** ditugaskan mengoperasikan 2 tahun, lalu diserahkan ke desa | KopdesLink jadi alat transisi: menyiapkan desa mandiri saat Agrinas exit |
| **7 Unit Usaha wajib** | Kantor koperasi, **Kios/Gerai Sembako**, Simpan Pinjam, Klinik Desa, **Apotek Desa**, **Cold Storage/Pergudangan**, **Logistik Desa** | Fokus MVP pada unit yang **berbasis stok fisik**: Gerai Sembako, Apotek, Pergudangan, Logistik |
| **Peran ekonomi** | Kopdes sebagai **offtaker** hasil tani (gabah, jagung) + penyalur sembako, pupuk, LPG 3kg | Rantai pasok punya 2 arah: barang masuk (offtake) & barang jual (sembako) — keduanya butuh visibilitas stok |
| **Skema bagi hasil** | 97% laba kembali ke desa; 82% dibagikan bulanan ke warga (kupon/voucher belanja) | Efisiensi stok = laba naik = manfaat warga naik. Metrik dampak yang menjual |
| **Sistem resmi** | **SIMKOPDES** (Sistem Informasi Manajemen Koperasi Desa) — 92,69% Kopdes sudah terintegrasi; mencatat transaksi, stok, pinjaman, laporan keuangan; terhubung data pajak, Dukcapil, dana desa, lahan Agrinas | **KopdesLink TIDAK menggantikan SIMKOPDES.** KopdesLink adalah lapisan jaringan di atasnya |

### 1.2 Gap yang Belum Dijawab Ekosistem Saat Ini

SIMKOPDES + operasional Agrinas sangat kuat secara **vertikal** (pencatatan per-koperasi + oversight pemerintah + pasokan dari pusat). Yang **belum ada**:

1. **Tidak ada koneksi horizontal antar-Kopdes.** Data stok tiap koperasi terkurung di silonya sendiri. Kopdes A tidak tahu Kopdes B (5 km) punya surplus beras.
2. **Rantai pasok masih satu arah & lambat.** Stockout → tunggu pasokan pusat/distributor → biaya logistik tinggi, waktu lama, omzet hilang.
3. **Pemerintah/Agrinas tidak punya peta aliran barang antar-desa real-time** untuk keputusan redistribusi dan kebijakan.

> **Positioning KopdesLink (kalimat kunci untuk juri):**
> *"KopdesLink adalah 'lapisan gotong-royong' di atas SIMKOPDES — mengubah 80.000 koperasi dari 80.000 pulau data menjadi satu jaringan pasok nasional. Kami tidak menyaingi sistem pemerintah; kami membuatnya saling terhubung."*

### 1.3 Bagaimana Konteks Ini Membentuk Arsitektur MVP

Setiap keputusan teknis di PRD ini diikat ke fakta di atas:

- **Karena SIMKOPDES sudah jadi sistem of-record** → KopdesLink dirancang **API-first / interoperable** (menampilkan "Sinkron dengan SIMKOPDES" sebagai integrasi masa depan, di MVP disimulasikan via import/seed data). Ini menghindari kesan "bikin sistem tandingan".
- **Karena Agrinas operator 2 tahun lalu diserahkan ke desa** → ada **peran/role "Agrinas/Dinas"** di dashboard agregat, menegaskan alat ini berguna bagi operator saat ini *dan* desa mandiri nanti.
- **Karena unit usaha berbasis stok fisik (sembako, apotek, pergudangan)** → modul POS & stok fokus ke kategori barang nyata program (sembako, pupuk, LPG, obat).
- **Karena skema bagi hasil 97% ke desa** → dashboard menonjolkan metrik **omzet terselamatkan & biaya logistik terpangkas** = laba naik = manfaat warga naik.
- **Karena desa punya koneksi terbatas** → dibangun sebagai **PWA installable**; modul POS diarahkan **offline-first** (antrean transaksi lokal lalu sinkron saat online) sebagai roadmap, sedangkan matchmaking tetap online karena butuh data lintas-Kopdes.

### 1.4 Keselarasan dengan TOR Hackathon Kemenkop 2026

**Tema yang disasar:** KopdesLink menembak **dua tema sekaligus** — kekuatan besar di penjurian:

| Tema TOR | Kecocokan KopdesLink | Bukti dari TOR |
|---|---|---|
| **Tema 1 — Peningkatan Volume Usaha Koperasi** (utama) | POS, efisiensi stok, prediksi, monitoring kesehatan usaha | Contoh solusi TOR: *"Digitalisasi Operasional Koperasi", "Predictive Analytics", "Business Intelligence Dashboard"* |
| **Tema 2 — Optimalisasi Potensi Desa** (pendukung) | Matchmaking antar-Kopdes, rantai pasok, offtaker | Challenge question TOR (verbatim): *"Bagaimana mempertemukan koperasi dengan buyer atau offtaker yang tepat?"* · Contoh solusi: *"Supply Chain Monitoring System", "Business Matching Platform"* |

> KopdesLink secara harfiah menjawab *challenge question* dan *contoh solusi* yang tertulis di TOR. Ini poin **Relevansi (bobot 25%)** yang sangat kuat.

**Peta kriteria penilaian → kekuatan KopdesLink** (8 metrik, bobot resmi TOR):

| Kriteria (bobot) | Bagaimana KopdesLink menang |
|---|---|
| **Relevansi (25%)** | Menjawab challenge question TOR persis; berjalan di atas data SIMKOPDES nyata; menyentuh Tema 1 & 2 |
| **Inovasi & Kreativitas (20%)** | Inter-Kopdes matchmaking = lapisan horizontal yang belum ada di SIMKOPDES/POS manapun |
| **Dampak & Manfaat (20%)** | Omzet terselamatkan, biaya logistik turun, terhubung laba 97% milik desa, skalabel ke 80.000 Kopdes |
| **Kemudahan Implementasi (15%)** | Jalan di atas database & SIMKOPDES yang sudah ada — tanpa pengumpulan data baru; PWA low-friction |
| **Kualitas Teknologi (15%)** | GCP Cloud Run, integrasi Postgres nyata, geospasial, predictive analytics, PWA installable |
| **Presentasi & Pitch (5%)** | Satu skenario demo yang bercerita (lihat §4) |

### 1.5 KopdesLink Berjalan di Atas DATA NYATA (bukan data karangan)

**Temuan kunci:** Database bersama hackathon (Shared Postgres panitia) **sudah berisi data Kopdes nyata** dengan 27 tabel — termasuk profil koperasi berkoordinat, inventaris stok, transaksi penjualan, dan komoditas desa. **KopdesLink tidak perlu data seed karangan** — ia membaca data pemerintah yang sebenarnya. Ini bukti nyata "interoperabilitas dengan SIMKOPDES" yang kita klaim, dan lompatan besar untuk skor **Relevansi + Kemudahan Implementasi + Kualitas Teknologi**.

**Pemetaan konsep KopdesLink → tabel nyata di database:**

| Konsep KopdesLink | Tabel & Field Sumber (read-only) | Catatan |
|---|---|---|
| **Node Kopdes + lokasi** (peta & radius) | `profil_koperasi` (nama_koperasi, **koordinat_dibulatkan**, kategori_usaha, alamat_lengkap) → `referensi_koperasi_wilayah` → `referensi_wilayah` (provinsi/kab/kec/desa) | `koordinat_dibulatkan` = lat,long dibulatkan → cukup untuk cari Kopdes tetangga via Haversine |
| **Katalog produk** | `produk_koperasi` (nama_produk, kode_barcode, unit) | join via `produk_sample_id` |
| **Stok real-time** (Lapisan 1) | `inventaris_produk` (**stok**, produk_sample_id, koperasi_ref) | sumber level stok awal |
| **Riwayat penjualan → POS & prediksi** | `transaksi_penjualan` (total_pembayaran, tanggal) + `barang_keluar_produk` (jumlah_keluar, harga, tanggal_keluar) | data historis nyata → moving average prediksi habis |
| **Pasokan masuk & harga** | `barang_masuk_produk` (jumlah_masuk, harga_beli, harga_jual) | dasar harga & margin di matchmaking |
| **7 unit usaha / jenis gerai** | `gerai_koperasi` → `referensi_gerai_koperasi` (nama_jenis_gerai: *Apotek Desa, Cold Storage, Kantor Koperasi, Klinik Desa,* dst) | fokus MVP: gerai berbasis stok fisik |
| **Potensi desa / offtaker** (Tema 2) | `referensi_komoditas_desa` (nama_komoditas, nilai_potensi_desa, volume, luas_area) → `referensi_wilayah` | untuk fitur pencocokan komoditas/offtaker |
| **Demografi & dana desa** (dampak) | `referensi_profil_desa` (total_penduduk, anggaran_dana_desa) | konteks dampak sosial di dashboard |

**Hub relasi:** semua tabel berpusat pada `koperasi_ref` (join ke `referensi_koperasi_wilayah`), lalu `kode_wilayah` (join ke `referensi_wilayah`). Ini tulang punggung query KopdesLink.

---

## 2. Problem Statement

**Untuk siapa:** Pengurus/manajer Koperasi Desa Merah Putih (khususnya unit Gerai Sembako, Apotek, Pergudangan) yang mengelola stok fisik dengan literasi teknologi terbatas.

**Masalah inti:**
1. **Pencatatan manual → blind spot stok.** Stockout dan stok mati tidak terdeteksi → omzet hilang, kerugian, pelayanan anggota terganggu.
2. **Pemenuhan stok reaktif & mahal.** Saat habis, cari pasokan ke distributor jauh; padahal Kopdes tetangga punya surplus barang sama.
3. **Silo data.** Tidak ada sistem yang menghubungkan stok antar-Kopdes → potensi gotong-royong ekonomi mati.
4. **Pemerintah buta peta pasok mikro.** Agrinas/Kemenkop tidak punya visibilitas real-time barang apa yang sering kosong & bagaimana aliran distribusi antar-desa.

**Dampak jika tak diselesaikan:** Volume usaha koperasi sulit tumbuh, posisi tawar terhadap distributor lemah, laba (yang 97%-nya milik warga desa) tergerus, dan transisi menuju desa mandiri pasca-Agrinas rapuh.

---

## 3. Solusi & Kebaruan (3 Lapisan)

```
                    ┌─────────────────────────────────────────────┐
                    │   LAPISAN 3 — DASHBOARD PEMERINTAH           │
                    │   (Agrinas / Dinas Koperasi / Kemenkop)      │
                    │   Peta aliran barang antar-desa,             │
                    │   barang paling sering kosong, dampak        │
                    └────────────────────▲────────────────────────┘
                                         │ agregasi
        ┌────────────────────────────────┴────────────────────────────────┐
        │   LAPISAN 2 — INTER-KOPDES MATCHMAKING  ★ INTI KEBARUAN ★        │
        │   Stok kosong di A → scan Kopdes surplus terdekat →              │
        │   tampil di peta (jarak, harga, qty) → request B2B → approve     │
        └────────────────────────────────▲────────────────────────────────┘
                                         │ sinyal reorder & surplus
        ┌────────────────────────────────┴────────────────────────────────┐
        │   LAPISAN 1 — POS + STOK REAL-TIME + SMART REORDER               │
        │   Jual → stok turun otomatis; opname digital; prediksi habis     │
        └───────────────────────────────────────────────────────────────────┘
                                         ▲
                          (interop) SIMKOPDES / Agrinas — system of record
```

### Lapisan 1 — POS & Stok Real-Time + Smart Reorder
- Setiap transaksi penjualan otomatis mengurangi stok (real-time).
- Stok opname digital cepat via ponsel.
- **Smart Reorder Alert:** saat stok ≤ ambang batas → peringatan.
- **Prediksi sederhana:** rata-rata penjualan harian (moving average) → estimasi "habis dalam X hari" → reorder proaktif.

### Lapisan 2 — Inter-Kopdes Matchmaking ★ (Inti Kebaruan)
- Kopdes butuh barang → sistem scan Kopdes terdekat yang **surplus** barang serupa dalam radius tertentu.
- Tampilkan **peta**: jarak, harga, kuantitas tersedia.
- Pengurus ajukan **permintaan B2B** → Kopdes pemilik surplus dapat **notifikasi** → setujui/tolak → transaksi tercatat.
- **Inilah yang tidak dilakukan SIMKOPDES** — mengubah data stok individual jadi jaringan pasok kolektif.

### Lapisan 3 — Dashboard Pemerintah (Agrinas/Dinas/Kemenkop)
- Peta **aliran barang antar-desa** (siapa memasok siapa).
- **Heatmap barang paling sering kosong** per wilayah → dasar kebijakan pasokan Agrinas.
- Metrik dampak: omzet terselamatkan, biaya logistik terpangkas, jumlah transaksi gotong-royong.

**Kebaruan inti:** Aplikasi POS-stok umumnya berhenti di level satu toko. **KopdesLink menjadikan surplus satu koperasi sebagai solusi kekosongan koperasi lain** — memangkas biaya logistik, mempercepat pemenuhan, memperkuat posisi tawar kolektif, dan mewujudkan gotong-royong koperasi secara digital pada skala nasional.

---

## 4. Persona & User Journey (Demo)

| Persona | Peran | Kebutuhan utama |
|---|---|---|
| **Bu Sari** | Kasir/Pengurus Gerai Sembako — Kopdes Sukamaju | Jualan cepat, tahu stok mau habis, cari pasokan darurat |
| **Pak Budi** | Manajer Gerai — Kopdes Mekarsari (punya surplus) | Terima & setujui permintaan tetangga, jual surplus |
| **Ibu Dinas / Agrinas** | Pengawas wilayah | Lihat peta pasok & barang rawan kosong se-kecamatan |

**Alur demo utama (happy path — "beras hampir habis"):**
1. Bu Sari melayani beberapa transaksi POS → stok **Beras 5kg** turun menembus ambang.
2. Muncul **Smart Reorder Alert**: *"Beras 5kg akan habis dalam ±2 hari."*
3. Bu Sari klik **"Cari dari Kopdes Tetangga"** → peta menampilkan **Kopdes Mekarsari (4,2 km)** surplus 40 karung @ Rp62.000.
4. Bu Sari ajukan permintaan 20 karung → status *Menunggu Persetujuan*.
5. **Ganti peran ke Pak Budi** → notifikasi masuk → **Setujui** → stok Mekarsari turun 20, order tercatat.
6. **Ganti peran ke Dashboard Pemerintah** → transaksi gotong-royong muncul di peta aliran + metrik terupdate.

Alur ini menceritakan **ketiga lapisan dalam 1 skenario < 3 menit** — ideal untuk penjurian.

---

## 5. Scope MVP (24 Jam)

> Prinsip: **satu alur demo yang mulus > banyak fitur setengah jadi.** Data di-seed; fokus pada momen "wow" matchmaking + peta.

### 5.1 P0 — WAJIB (jadi tulang punggung demo)
- [ ] **Koneksi ke DB bersama** + pilih **1 kecamatan** yang punya beberapa Kopdes berkoordinat (`profil_koperasi` + `koordinat_dibulatkan`); init `kopdeslink_stok_live` dari `inventaris_produk`. *(Data nyata, bukan seed karangan — lihat §1.5. Jika data satu kecamatan terlalu jarang, pilih kecamatan lain yang padat; siapkan sedikit data pelengkap ber-prefix bila perlu untuk memastikan skenario matchmaking punya minimal 1 pasangan.)*
- [ ] **POS**: pilih produk → jual → stok berkurang real-time (tulis ke tabel ber-prefix).
- [ ] **Daftar stok** per Kopdes + indikator status (Aman / Menipis / Kritis).
- [ ] **Smart Reorder Alert** berbasis ambang + estimasi hari-habis (moving average dari data seed).
- [ ] **Matchmaking**: cari Kopdes surplus terdekat (radius/Haversine) → tampil **peta** + jarak + harga + qty.
- [ ] **Request B2B → Approve**: alur permintaan lintas Kopdes dengan **role switcher** (tanpa auth rumit).
- [ ] **Realtime sync**: perubahan stok tercermin antar layar/tab.
- [ ] **Dashboard Pemerintah**: peta aliran antar-desa + daftar/heatmap barang sering kosong + 3 metrik dampak.

### 5.2 P1 — JIKA SEMPAT (nilai tambah)
- [ ] PWA installable (sudah ada). Offline-first POS (antrean transaksi lokal + banner sinkron) = roadmap, di luar cakupan MVP.
- [ ] Notifikasi in-app (badge) saat request masuk.
- [ ] Grafik tren penjualan sederhana per produk.
- [ ] Toggle "Sinkron dengan SIMKOPDES" (simulasi — menegaskan interoperabilitas).
- [ ] Scan barcode via kamera untuk POS/opname.

### 5.3 OUT OF SCOPE (eksplisit — jangan disentuh)
- Autentikasi/otorisasi produksi (pakai role selector).
- Pembayaran/settlement uang sungguhan.
- Integrasi API SIMKOPDES nyata (hanya disimulasikan/di-mock).
- Modul simpan-pinjam, klinik, akuntansi penuh.
- Multi-bahasa, manajemen user, audit log.
- Machine learning prediksi kompleks (cukup moving average).

---

## 6. Arsitektur Teknis MVP

> Arsitektur diselaraskan dengan **fasilitas resmi hackathon**: Google Cloud Credit ($60) + **Shared Postgres Database** (endpoint panitia — lihat `gcloud_database.txt`, tidak di-commit). Deployment di **GCP** dan sumber data dari **database bersama** = nilai plus untuk kriteria *Kualitas Teknologi* & *Kemudahan Implementasi*, sekaligus memaksimalkan fasilitas yang disediakan panitia.

### 6.1 Stack

| Komponen | Pilihan | Alasan |
|---|---|---|
| **Frontend** | Next.js (React) + Tailwind, dikonfigurasi **PWA** | Satu codebase web+mobile; PWA installable (offline-first POS di roadmap) |
| **Peta** | **Leaflet + OpenStreetMap** | Gratis, tanpa API key; cukup untuk pin Kopdes + garis aliran; parse `koordinat_dibulatkan` |
| **Backend/API** | Next.js API routes / Node (satu service) | Ringkas untuk sprint 24 jam |
| **Database** | **Shared Postgres hackathon** (`hackathon_2026`) | Sudah berisi data Kopdes nyata (27 tabel); wajib dipakai per fasilitas panitia |
| **Geospasial** | **Haversine di SQL/app** dari `koordinat_dibulatkan` | Cari Kopdes surplus dalam radius. *(PostGIS kemungkinan tak bisa di-CREATE EXTENSION di DB bersama tanpa hak superuser → pakai rumus Haversine biasa)* |
| **Realtime sync** | **Polling ringan (2–3 dtk)** atau SSE | DB bersama tanpa layanan realtime bawaan; polling cukup untuk efek "stok berubah langsung terlihat" di demo |
| **Deploy** | **GCP Cloud Run** + Cloud SQL Auth/koneksi ke shared DB; domain demo publik | Pakai kredit $60; URL PWA untuk juri |
| **Auth/role** | Role switcher sederhana (Pengurus A / Pengurus B / Agrinas-Dinas) | Demo tanpa auth produksi; sediakan akun uji juri |

### 6.2 Pola Data: Baca Nyata, Tulis di Lapisan App (Hybrid)

> **⚠️ TEMUAN TERVERIFIKASI (cek langsung ke DB panitia):** kredensial peserta bersifat **READ-ONLY penuh** — `has_schema_privilege(...'public','CREATE')=false`, `CREATE SCHEMA` ditolak, hanya `TEMP TABLE` yang boleh. Selain itu **`DB_SSL=true` wajib** (server menolak `no encryption`). Maka pola "tulis ke tabel ber-prefix di DB bersama" **tidak mungkin** dengan kredensial ini.
>
> **Keputusan arsitektur → HYBRID:** KopdesLink **membaca data nyata** (read-only) lalu menjalankan lapisan tulis (snapshot stok, POS, request B2B, transfer) **di memori aplikasi**. Ini malah memperkuat narasi: *lapisan di atas SIMKOPDES yang tidak mengubah system-of-record*. Prefix `indonesiacerah_` tetap disiapkan untuk skenario DB tim yang writable (mis. Cloud SQL sendiri saat produksi). Pencocokan lintas-Kopdes memakai **`kode_barcode`** (produk per-koperasi punya id unik, tetapi barcode sama → 2.752 barcode dipakai >1 Kopdes).
>
> **Skenario demo nyata terverifikasi — Kota Kupang (`53.71`):** 7 Koperasi Kelurahan Merah Putih, Beras SPHP 5KG surplus 1000 vs backorder −100, jarak maks 8,3 km. Alur match→request→approve→transfer→dashboard berjalan penuh di data asli.

> **(Untuk mode DB tim yang writable — referensi):** DB dipakai bersama 100 tim → **setiap tabel milik tim WAJIB memakai prefix nama tim** (`indonesiacerah_`). Melanggar = data antar-tim tumpang tindih.

**Prinsip:** 27 tabel bawaan diperlakukan **READ-ONLY** (sumber data bersama, jangan diubah). Semua tulisan KopdesLink masuk ke **tabel ber-prefix milik sendiri**.

```
-- SUMBER (read-only, sudah ada di DB bersama):
profil_koperasi, referensi_koperasi_wilayah, referensi_wilayah,
produk_koperasi, inventaris_produk, transaksi_penjualan,
barang_keluar_produk, barang_masuk_produk,
gerai_koperasi, referensi_gerai_koperasi, referensi_komoditas_desa, ...

-- MILIK KOPDESLINK (ditulis app, WAJIB ber-prefix):
kopdeslink_stok_live(koperasi_ref, produk_sample_id, qty, ambang_batas, buffer_surplus, updated_at)
    -- di-seed sekali dari inventaris_produk.stok; POS men-decrement DI SINI (bukan di tabel bersama)
kopdeslink_penjualan(id, koperasi_ref, produk_sample_id, qty, harga, waktu)
    -- transaksi POS demo ditulis di sini agar data bersama tetap bersih
kopdeslink_request_b2b(id, koperasi_peminta_ref, koperasi_pemasok_ref,
                       produk_sample_id, qty, harga, status, dibuat_pada, disetujui_pada)
    -- status: pending | approved | rejected  → jantung fitur matchmaking
kopdeslink_ambang(koperasi_ref, produk_sample_id, ambang_batas, buffer_surplus)
    -- ambang reorder & threshold surplus (tidak ada di data sumber → dihitung/di-set KopdesLink)
```

**Alur baca/tulis:**
1. **Init:** snapshot `inventaris_produk` (real) → `kopdeslink_stok_live`; hitung ambang default (mis. dari rata-rata `barang_keluar_produk`).
2. **POS/opname:** tulis ke `kopdeslink_stok_live` + `kopdeslink_penjualan` → data bersama tak tersentuh, aturan prefix terpenuhi.
3. **Prediksi habis:** `qty ÷ rata-rata penjualan harian` (gabungan `barang_keluar_produk` historis + `kopdeslink_penjualan` live).
4. **Matchmaking:** cari Kopdes lain dengan `qty − ambang > buffer_surplus` dalam radius (Haversine atas `koordinat_dibulatkan`).
5. **Request B2B:** insert `kopdeslink_request_b2b (pending)` → approve → update qty kedua Kopdes di `kopdeslink_stok_live`.
6. **Dashboard pemerintah:** agregasi `kopdeslink_request_b2b` (aliran antar-desa) + frekuensi stok kritis + join `referensi_wilayah` untuk peta.

### 6.3 Bagaimana Arsitektur Mencerminkan Konteks Pemerintah

- **Role "Agrinas/Dinas"** hadir sebagai peran dashboard → alat relevan bagi operator saat ini & desa mandiri saat Agrinas exit (2 tahun).
- **Data nyata program**: node = `profil_koperasi` nyata, jenis gerai = 7 unit usaha KDMP (`referensi_gerai_koperasi`), komoditas = potensi desa (`referensi_komoditas_desa`).
- **Interop SIMKOPDES bukan klaim kosong**: KopdesLink benar-benar membaca database resmi hackathon (proksi SIMKOPDES), menambah lapisan jaringan di atasnya tanpa mengubah system-of-record.
- **Metrik bagi hasil**: dashboard hitung "omzet terselamatkan" & "biaya logistik terpangkas" → dikaitkan laba 97% milik desa & `anggaran_dana_desa`.

---

## 7. Rencana Eksekusi 24 Jam

Asumsi tim 2–4 orang (FE, BE/data, integrasi/demo). Jika solo, kerjakan P0 berurutan & pangkas P1.

| Jam | Fase | Output |
|---|---|---|
| **0–2** | Setup | Repo (public, `.env` gitignore), Next.js+PWA skeleton, **koneksi ke shared Postgres**, buat tabel ber-prefix, deploy Cloud Run pertama hidup |
| **2–5** | Data nyata & Lapisan 1a | Query `profil_koperasi`/`inventaris_produk` 1 kecamatan; init `kopdeslink_stok_live`; layar POS jual → stok turun (polling) |
| **5–8** | Lapisan 1b | Daftar stok + status; Smart Reorder Alert + estimasi hari-habis |
| **8–13** | Lapisan 2 ★ | Query Kopdes terdekat; peta Leaflet + pin + info; request B2B → approve; role switcher |
| **13–16** | Lapisan 3 | Dashboard pemerintah: peta aliran + barang sering kosong + metrik dampak |
| **16–19** | Polish P1 | Polish PWA installable, notif in-app, toggle "Sinkron SIMKOPDES", tren penjualan |
| **19–22** | Data demo & QA | Rapikan skenario "beras habis", uji happy path lintas peran, perbaiki bug |
| **22–24** | Pitch | Skrip demo < 3 menit, slide 1-halaman narasi kebijakan, latihan presentasi |

**Checkpoint kritis (jam 13):** Jika Lapisan 2 (matchmaking + peta) belum jalan, **hentikan penambahan fitur** dan selesaikan ini — tanpa Lapisan 2 tidak ada kebaruan yang dijurikan.

---

## 8. Metrik Sukses

### 8.1 Sukses Demo (yang dinilai juri)
- Happy path "beras habis" berjalan mulus lintas 3 peran < 3 menit.
- Momen "wow": alert prediktif → peta surplus tetangga → approve → update dashboard.
- Narasi kebijakan tersampaikan: *lapisan gotong-royong di atas SIMKOPDES/Agrinas*.

### 8.2 Metrik Produk (ditampilkan di dashboard, dari data demo)
- **Omzet terselamatkan** (Rp): nilai penjualan yang tak jadi hilang karena stok tertutup surplus tetangga.
- **Biaya logistik terpangkas** (%): pasok tetangga vs distributor pusat.
- **Waktu pemenuhan stok**: jam vs hari.
- **Transaksi gotong-royong**: jumlah B2B antar-Kopdes.
- **Barang paling rawan kosong**: top-5 per wilayah.

### 8.3 Metrik Dampak (narasi skala nasional)
- Kaitkan efisiensi stok → laba naik → **97% laba milik desa** → **82% ke warga** (kupon). Efisiensi = manfaat langsung warga.

---

## 9. Strategi Menang (Dari 100 Besar → 3 Besar)

Apa yang membuat 100 besar jadi 3 besar — bukan lebih banyak fitur, tapi **kelayakan & keselarasan**:

1. **Nyambung ke program nyata.** Sebut Inpres 9/2025, Agrinas, 7 unit usaha, SIMKOPDES, skema 97%. Juri melihat tim paham lapangan.
2. **Bukan sistem tandingan.** Posisikan sebagai **lapisan komplementer di atas SIMKOPDES** → menghapus keberatan "pemerintah kan sudah punya sistem".
3. **Kebaruan yang jelas & tunggal.** Semua energi ke **inter-Kopdes matchmaking** — satu ide yang belum ada di ekosistem, mudah "dijual" dalam satu kalimat.
4. **Efek jaringan = moat.** Nilai tumbuh seiring jumlah Kopdes → selaras target 80.000. Skalanya justru kekuatan.
5. **Demo bercerita, bukan mendaftar fitur.** Satu skenario manusiawi (Bu Sari) yang menyentuh 3 lapisan.
6. **Dampak terukur & pro-rakyat.** Hubungkan langsung ke laba warga (82% kupon) — resonan dengan tujuan program.
7. **Jalur adopsi realistis.** Alat transisi menuju desa mandiri saat Agrinas exit (2 tahun) — menjawab "lalu setelah ini apa?".

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Kredensial ter-commit ke repo publik** | Fatal — keamanan & pelanggaran instruksi panitia | `.env` di-gitignore sejak commit pertama; `.env.example` tanpa nilai; cek `git log` sebelum submit |
| **Lupa table prefix** di DB bersama | Tumpang tindih data antar-tim, gugur teknis | Semua tabel diawali `kopdeslink_`; source 27 tabel read-only |
| Data 1 kecamatan terlalu jarang (tak ada pasangan surplus) | Skenario matchmaking gagal | Survei data lebih dulu (jam 2–5); pilih kecamatan padat; siapkan sedikit data pelengkap ber-prefix |
| `koordinat_dibulatkan` presisi rendah | Jarak kurang akurat | Cukup untuk radius "tetangga"; tampilkan jarak sebagai estimasi |
| Latensi/limit DB bersama (100 tim) | Query lambat saat demo | Cache hasil query di app; batasi ke 1 kecamatan; siapkan mode fallback data lokal |
| Terlalu banyak fitur | Tak ada yang selesai | Kunci scope P0; P1 hanya jika P0 solid |
| Kesan "menyaingi SIMKOPDES" | Juri skeptis | Tekankan "lapisan di atas SIMKOPDES"; tunjukkan baca data resmi |
| Demo gagal live (jaringan Jakarta) | Panik saat pitch | Rekam video cadangan happy path + mode data lokal offline |
| Deadline mepet (gugur 1 detik) | Diskualifikasi | Target submit T-30 menit; siapkan draft submission lebih awal |

---

## 11. Deliverables, Deployment & Kepatuhan TOR

> Bagian ini menentukan **lolos/gugur secara administratif** — sekuat apa pun produknya, kesalahan di sini menggugurkan tim. Timeline juga menyediakan slot khusus (jam 22–24).

### 11.1 Deliverables Wajib (dikumpulkan via portal SIMKOPDES sebelum deadline)

| # | Deliverable | Syarat TOR |
|---|---|---|
| 1 | **Repositori kode publik** | URL GitHub/GitLab/Bitbucket publik, berisi seluruh source code MVP + **README.md** (cara menjalankan / installation guide + penjelasan arsitektur) |
| 2 | **Pitch Deck (PDF)** | Maks **10–12 slide**: Problem Statement · Solution & Architecture · Business & Impact Model · Team Profile |
| 3 | **Demo aplikasi berjalan** | URL PWA/web aktif **atau** APK; + **akun uji coba juri** (username & password) di kolom deskripsi jika ada login |
| 4 | **Video demo (opsional)** | Screen-recording maks **3 menit**, YouTube unlisted / Google Drive |

**Ketegasan deadline:** terlambat **1 detik pun otomatis gugur** dari Pitching Day. → Target internal: submit **T-30 menit** sebelum batas.

### 11.2 Kepatuhan Keamanan & Aturan (JANGAN SAMPAI SALAH)

- 🔴 **Repo publik = kredensial TIDAK BOLEH ter-commit.** File `gcloud_database.txt` bertuliskan *"jangan push ke GitHub"*. Semua kredensial DB, akun GCP, password → `.env` yang **di-`.gitignore`**. Sertakan `.env.example` tanpa nilai rahasia.
- 🔴 **Wajib table prefix** (`kopdeslink_`) untuk semua tabel milik tim di DB bersama (§6.2). Perlakukan 27 tabel bawaan sebagai read-only.
- 🟡 **Ganti password default GCP** setelah login pertama (diwajibkan panitia).
- 🟡 **Akun uji coba juri** disiapkan & dicantumkan saat submit (role switcher tetap perlu satu jalur login sederhana untuk juri).
- 🟡 **HAKI:** jika lolos **10 besar**, ada pengalihan HAKI ke Kemenkop RI (konsekuensi consent form) — informasikan ke seluruh anggota tim sejak awal.

### 11.3 Kepatuhan Aturan AI / Orisinalitas (Bagian J TOR) — WAJIB DIBACA TIM

TOR menegaskan **prinsip orisinalitas**: ide & konsep inti harus **pemikiran asli tim**, bukan dihasilkan langsung oleh AI generatif. AI generatif **boleh** sebagai alat bantu: *coding assistance & debugging, riset pendukung/referensi, perapian tata bahasa, pembuatan aset/ilustrasi/dokumentasi teknis*. AI **tidak boleh** menggantikan ideasi & analisis masalah inti. **Wajib disclosure**: cantumkan alat AI yang dipakai dan bagian mana yang dibantu — keterbukaan tidak mengurangi nilai; penyembunyian bisa **diskualifikasi**. Juri dapat menguji orisinalitas lewat **live defense** (tanya jawab/pembelaan gagasan).

**Implikasi untuk tim:**
- ✅ Ide inti KopdesLink (jaringan gotong-royong antar-Kopdes) berasal dari tim → **aman & orisinal**.
- ✅ Tambahkan bagian **"Penggunaan AI"** di README & 1 baris di pitch deck: sebutkan AI dipakai untuk *bantuan riset, penyusunan dokumentasi/PRD, dan coding assistance* — bukan untuk menghasilkan ide inti.
- ✅ **Setiap anggota harus bisa mempertahankan gagasan tanpa contekan** di sesi live defense — pahami betul "kenapa matchmaking antar-Kopdes", "kenapa lapisan di atas SIMKOPDES", dan angka dampaknya.

---

## 12. Roadmap Pasca-Hackathon (untuk pertanyaan juri "lalu apa?")

- **Fase 1:** Integrasi API SIMKOPDES nyata (baca stok resmi) — jadi lapisan jaringan legal di atas sistem pemerintah.
- **Fase 2:** Pilot 1 kecamatan bersama Dinas Koperasi + Agrinas; ukur omzet terselamatkan & biaya logistik.
- **Fase 3:** Skala provinsi; tambah settlement B2B & prediksi ML; jadi tulang punggung redistribusi Agrinas.
- **Fase 4:** Nasional — peta rantai pasok Kopdes real-time sebagai dasar kebijakan Kemenkop.

---

## Sumber Riset

- [Agrinas Diberi Mandat Mengoperasikan Koperasi Merah Putih Dua Tahun — Kompas](https://www.kompas.id/artikel/en-agrinas-diberi-mandat-mengoperasikan-koperasi-merah-putih-dua-tahun)
- [Agrinas Kelola Kopdes Merah Putih 2 Tahun, Setelah Itu Diserahkan ke Desa — Kompas](https://money.kompas.com/read/2026/03/31/154006026/agrinas-kelola-kopdes-merah-putih-2-tahun-setelah-itu-diserahkan-ke-desa)
- [Agrinas Pangan Bakal Jadi Operator Kopdes Merah Putih, Begini Skema Bagi Hasilnya — SWA](https://swa.co.id/read/470943/agrinas-pangan-bakal-jadi-operator-kopdes-merah-putih-begini-skema-bagi-hasilnya)
- [Kemenkop: 92,69% Koperasi Merah Putih Sudah Terintegrasi SIMKOPDES — Investortrust](https://investortrust.id/business/86237/kemenkop-92-69-koperasi-merah-putih-sudah-terintegrasi-simkopdes)
- [Koperasi Desa Merah Putih Wajib Punya 7 Unit Bisnis — Tempo](https://www.tempo.co/ekonomi/koperasi-desa-merah-putih-wajib-punya-7-unit-bisnis-1231242)
- [7 Unit Bisnis Ini Harus Ada di Kopdes Merah Putih — Kompas](https://money.kompas.com/read/2025/04/15/143700026/7-unit-bisnis-ini-harus-ada-di-kopdes-merah-putih-apa-saja)
- [Menkop: 1.061 Kopdes Merah Putih Siap Serap Produk Desa — ANTARA](https://jambi.antaranews.com/berita/656973/menkop-1061-kopdes-merah-putih-siap-serap-produk-desa)
- [Dirut Agrinas: 29 ribu Kopdes Merah Putih Dibangun, 857 Unit Rampung — ANTARA](https://www.antaranews.com/berita/5410962/dirut-agrinas-29-ribu-kopdes-merah-putih-dibangun-857-unit-rampung)
- [APINDO dan Agrinas Bahas Peran Kopdes Merah Putih sebagai Kanal Distribusi — APINDO](https://apindo.or.id/id/media/apindo-dan-agrinas-bahas-peran-koperasi-desa-kelurahan-merah-putih-sebagai-kanal-distribusi-produk-industri-dan-umkm)
- [Koperasi Desa/Kelurahan Merah Putih (portal resmi)](https://merahputih.kop.id/)
