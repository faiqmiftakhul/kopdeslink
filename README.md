# KopdesLink

**Jaringan Rantai Pasok Gotong-Royong Antar Koperasi Desa Merah Putih**
Hackathon Digital Cooperatives Expo — Kementerian Koperasi 2026 · Tim **Indonesia Cerah**

> SIMKOPDES mencatat stok *satu* koperasi. **KopdesLink menghubungkan stok antar koperasi** —
> kekosongan stok satu Kopdes ditutup surplus Kopdes tetangga. Lapisan jaringan horizontal
> di atas ekosistem SIMKOPDES/Agrinas.

---

## ✨ Fitur MVP

1. **POS & Stok Real-Time** — tiap penjualan mengurangi stok; prediksi "habis dalam ± X hari" dari rata-rata penjualan.
2. **Smart Reorder Alert** — status Aman / Menipis / Kritis + peringatan proaktif.
3. **Inter-Kopdes Matchmaking** (inti kebaruan) — cari surplus Kopdes terdekat via radius (Haversine atas `koordinat_dibulatkan`), tampil di **peta**, ajukan **permintaan B2B**, pemasok **menyetujui**.
4. **Dashboard Pemerintah** (Agrinas/Dinas) — peta aliran barang antar-desa, barang rawan kosong, omzet terselamatkan & biaya logistik terpangkas.

## 🧱 Arsitektur

| Lapisan | Teknologi |
|---|---|
| Frontend | **Next.js 14 (App Router)** + React + Tailwind, dikonfigurasi **PWA** (installable; offline-first POS di roadmap) |
| Peta | **Leaflet + OpenStreetMap** (tanpa API key) |
| API | Next.js Route Handlers (Node runtime) |
| Data | **Shared Postgres hackathon** (`hackathon_2026`, READ-ONLY) via `pg` — atau **mode mock** tanpa DB |
| Geospasial | **Haversine** dari `koordinat_dibulatkan` (PostGIS tak diperlukan) |
| Deploy | **GCP Cloud Run** (lihat `Dockerfile`) |

**Pola data — hybrid (baca-nyata, tulis-di-app):** Kredensial panitia bersifat **READ-ONLY**
(tidak bisa `CREATE`/`INSERT` — sudah diverifikasi). Karena itu KopdesLink **membaca data nyata**
dari 27 tabel bawaan lalu menjalankan lapisan tulis (snapshot stok, POS, request B2B, transfer)
**di memori aplikasi**. Ini justru sesuai narasi: *lapisan di atas SIMKOPDES yang tidak mengubah
system-of-record*. (Prefix `indonesiacerah_` disiapkan untuk mode DB tim yang bisa ditulis, mis.
Cloud SQL sendiri — lihat `src/scripts/init-db.ts`.)

Pemetaan ke data nyata: `profil_koperasi`(+koordinat) → node · `inventaris_produk` → stok ·
`produk_koperasi`(+kode_barcode) → katalog & **kunci pencocokan lintas-Kopdes** ·
`barang_masuk_produk` → harga · `barang_keluar_produk` → prediksi · `referensi_wilayah` → wilayah.
Lihat `PRD.md` §1.5 & §6.

### ✅ Skenario demo NYATA (terverifikasi) — Kota Kupang, NTT
`FOCUS_KODE_WILAYAH=53.71`: **7 Koperasi Kelurahan Merah Putih** asli (jarak maks 8,3 km).
Produk **Beras SPHP 5KG** (barcode `8994209001796`): Kopdes *Madani Tirta Bakunase* stoknya
**−100 (backorder)**, sementara *Angkasa Fatubesi* surplus **1000**, *Kelurahan Asri* 385,
*Agung Namosain* 217. Alur: login sbg Bakunase → Cari Tetangga → ajukan → approve sbg pemasok →
stok berpindah → dashboard menampilkan aliran gotong-royong.

## 🚀 Cara Menjalankan

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment
cp .env.example .env.local      # lalu isi kredensial DB (JANGAN commit .env.local)

# 3a. Jalankan dengan DATA CONTOH (tanpa jaringan hackathon) — default
#     .env.local → DATA_SOURCE=mock
npm run dev                     # buka http://localhost:3000

# 3b. Jalankan dengan DATABASE NYATA hackathon (READ-ONLY, mode hybrid)
#     .env.local → DATA_SOURCE=db, DB_SSL=true, isi DB_PASSWORD,
#                  FOCUS_KODE_WILAYAH=53.71 (Kota Kupang, siap demo)
npm run db:ping                 # cek koneksi + lihat kecamatan terpadat
npm run dev                     # app langsung baca data nyata; tulis di memori app
```

> `npm run db:init` **hanya** untuk skenario DB milik tim yang bisa ditulis (mis. Cloud SQL
> sendiri). Pada DB bersama panitia yang read-only, langkah ini tidak diperlukan & akan ditolak.
> `DB_SSL=true` **wajib** — server menolak koneksi tanpa enkripsi.

### Demo (± 3 menit)
1. **Kasir (POS)** → jual *Beras Premium 5kg* beberapa kali sampai menembus ambang.
2. **Stok & Alert** → muncul prediksi "habis ± X hari".
3. **Cari Tetangga** → surplus Kopdes terdekat di peta → **Ajukan permintaan**.
4. Ganti Kopdes ke pemasok → **Permintaan** → **Setujui**.
5. Ganti peran ke **Agrinas/Dinas** → **Dashboard** aliran gotong-royong.

> Ganti **peran** (Pengurus / Agrinas-Dinas) dan **Kopdes aktif** di kanan atas.

## 🔐 Keamanan & Kepatuhan

- **Kredensial TIDAK di-commit.** `.env.local`, `gcloud_database.txt`, dan file metadata sudah di-`.gitignore`. Gunakan `.env.example` sebagai template.
- **Table prefix `indonesiacerah_`** untuk semua tabel milik tim; tabel bawaan read-only.

## 🤖 Penggunaan AI (Disclosure — sesuai TOR Bagian J)

Ide inti KopdesLink (jaringan gotong-royong antar-Kopdes sebagai lapisan di atas SIMKOPDES)
merupakan **gagasan asli tim**. AI generatif digunakan **hanya sebagai alat bantu** pada:
- riset pendukung & perapian dokumentasi (PRD, README),
- bantuan penulisan/*debugging* kode (coding assistant),

dan **tidak** untuk menghasilkan ide/konsep inti solusi. Alat yang digunakan: asisten AI berbasis Claude.

## 📄 Deliverables
Repo publik ini + `PRD.md` + pitch deck (PDF, terpisah) + URL demo Cloud Run + akun uji juri.

## 📁 Struktur
```
src/
  app/            # halaman (pos, inventory, matchmaking, requests, dashboard) + api routes
  components/     # TopBar, MapView, RegisterSW
  context/        # AppContext (role & kopdes aktif)
  lib/            # store (mock+db), dbStore, geo, derive, types, env, format
  scripts/        # db:ping, db:init (seed dari data nyata)
```
