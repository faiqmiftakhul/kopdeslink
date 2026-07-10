# Panduan Submit Deliverables — KopdesLink (Tim Indonesia Cerah)

> Dikumpulkan lewat **portal SIMKOPDES** sebelum batas waktu sprint. **Terlambat 1 detik = otomatis gugur** dari Pitching Day. **Target internal: submit T-30 menit.**

---

## 0. Ringkasan 3 Deliverable Wajib (TOR §F)

| # | Deliverable | Format | Status |
|---|---|---|---|
| 1 | **Repositori kode publik** (+ README) | URL GitHub/GitLab/Bitbucket | ⬜ siapkan repo publik |
| 2 | **Pitch Deck** | PDF, maks 10–12 slide | ✅ `pitch-deck.html` → ekspor PDF |
| 3 | **Demo aplikasi berjalan** + kredensial juri | URL PWA/web (atau APK) | ⬜ deploy Cloud Run |
| 4 | Video demo (opsional) | YouTube unlisted, maks 3 menit | ⬜ opsional |

---

## 1. Repositori Kode (Deliverable #1)

**Syarat TOR:** URL publik, memuat seluruh source code MVP, + `README.md` (cara menjalankan + arsitektur). ✅ README sudah ada.

### 1a. 🔴 WAJIB — pastikan TIDAK ada rahasia ter-commit
Repo bersifat **publik**. Jalankan cek ini sebelum push:
```bash
# pastikan file rahasia diabaikan git
git check-ignore .env.local gcloud_database.txt metadata_database_hackathon_final.xlsx
# → ketiganya harus muncul (artinya di-ignore). Kalau kosong, JANGAN push.

# scan working tree untuk kebocoran kredensial
# (ganti <HOST>/<USER>/<PASS> dengan nilai asli dari gcloud_database.txt saat menjalankan; jangan simpan hasilnya)
git grep -nEi "db_password\s*=\s*[^<[:space:]]|<HOST>|<USER>" || echo "OK: tidak ada kredensial di kode"
```
`.gitignore` sudah memblok `.env.local`, `gcloud_database.txt`, dan file metadata. `.env.example` (tanpa nilai rahasia) yang di-commit.

### 1b. Inisialisasi & push (repo BARU, publik)
```bash
git init
git add .
git status                       # pastikan .env.local & gcloud_database.txt TIDAK terdaftar
git commit -m "KopdesLink MVP — Hackathon Kemenkop 2026 (Tim Indonesia Cerah)"
# buat repo publik dulu di GitHub, lalu:
git branch -M main
git remote add origin https://github.com/<user>/kopdeslink.git
git push -u origin main
```
> Jika pakai `gh`: `gh repo create kopdeslink --public --source=. --push`.

### 1c. Verifikasi akhir
- [ ] Repo bisa dibuka tanpa login (publik)
- [ ] `README.md` tampil di halaman utama repo
- [ ] Tidak ada `.env.local` / `gcloud_database.txt` di daftar file
- [ ] Bagian **Penggunaan AI** ada di README (disclosure TOR Bagian J)

---

## 2. Pitch Deck PDF (Deliverable #2)

Sumber: **`pitch-deck.html`** (12 slide, palet Kemenkop). Ekspor ke PDF:
1. Buka `pitch-deck.html` di **Google Chrome/Edge**.
2. **Ctrl/Cmd + P** → Tujuan **"Save as PDF"**.
3. Layout **Landscape** · Margins **None** · aktifkan **Background graphics**.
4. Simpan sebagai **`KopdesLink-PitchDeck.pdf`** → cek tepat **12 halaman** (1 slide/halaman).

Isi sudah sesuai TOR: Problem Statement · Solution & Architecture · Business & Impact Model · Team Profile.

> Sebelum submit: ganti placeholder **Team Profile** (slide 12) dengan nama & peran anggota tim yang sebenarnya.

---

## 3. Demo Aplikasi + Kredensial Juri (Deliverable #3)

### 3a. Akun uji coba juri
Aplikasi punya gerbang login demo. Sertakan di kolom deskripsi submission:

| Field | Nilai |
|---|---|
| **URL** | (isi URL Cloud Run setelah deploy) |
| **Username** | `juri` |
| **Password** | `kopdeslink2026` |

> Ada juga tombol **"Lanjut sebagai tamu"** bila juri ingin langsung masuk tanpa akun.

### 3b. Deploy ke GCP Cloud Run (pakai kredit $60 panitia)
`Dockerfile` sudah siap (`output: standalone`). Login GCP (akun `hackaton.group27x@pendamping.kop.id`), lalu:
```bash
# set project & region
gcloud config set project <PROJECT_ID>
gcloud config set run/region asia-southeast2      # Jakarta

# build & deploy sekaligus, sambil set environment (JANGAN taruh rahasia di repo)
gcloud run deploy kopdeslink \
  --source . \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "DATA_SOURCE=db,DB_SSL=true,TABLE_PREFIX=indonesiacerah_,FOCUS_KODE_WILAYAH=53.71,MATCH_RADIUS_KM=15,DB_HOST=<DB_HOST>,DB_PORT=5432,DB_DATABASE=<DB_DATABASE>,DB_USERNAME=<DB_USERNAME>" \
  --set-env-vars "DB_PASSWORD=<DB_PASSWORD>"
  # nilai <...> diambil dari gcloud_database.txt (JANGAN commit)
```
> Kredensial DB dikirim lewat `--set-env-vars` saat deploy (runtime), **bukan** dari file di repo.
> Untuk backup demo tanpa jaringan, set `DATA_SOURCE=mock`.

**Alternatif cepat (kalau Cloud Run bermasalah saat sprint):** jalankan lokal + tunnel publik
(`npm run build && npm start`, lalu `cloudflared tunnel --url http://localhost:3000` atau `ngrok http 3000`).

### 3c. Uji sebelum submit
- [ ] URL terbuka dari perangkat lain (bukan hanya laptop tim)
- [ ] Login `juri` / `kopdeslink2026` berhasil (atau tombol tamu)
- [ ] Data nyata muncul (7 Kopdes Kupang) — atau mock sebagai cadangan
- [ ] Alur demo mulus (lihat §5)

---

## 4. Teks Siap-Tempel untuk Kolom Deskripsi Submission

```
KopdesLink — Jaringan Rantai Pasok Gotong-Royong Antar Koperasi Desa Merah Putih
Tim: Indonesia Cerah | Tema 1 (Peningkatan Volume Usaha) & Tema 2 (Optimalisasi Potensi Desa)

Ringkasan:
SIMKOPDES Hub menghubungkan tiap Kopdes ke pemerintah (vertikal, untuk pemantauan).
KopdesLink menghubungkan Kopdes satu sama lain (horizontal, untuk aksi) — mengubah data
pasokan yang sudah terpusat menjadi transaksi gotong-royong nyata. Kekosongan stok satu
Kopdes ditutup surplus tetangga terdekat, otomatis, berbasis lokasi.

Demo:
- URL: <URL_CLOUD_RUN>
- Akun uji coba juri: username "juri" / password "kopdeslink2026"
  (atau klik "Lanjut sebagai tamu")
- Demo berjalan di DATA NYATA database resmi hackathon: 7 Koperasi Kelurahan Merah Putih
  di Kota Kupang, produk Beras SPHP 5KG. Pilih Kopdes "Madani Tirta Bakunase" (kanan atas),
  buka menu "Cari Tetangga".

Repositori: <URL_REPO_PUBLIK>
Video demo (opsional): <URL_YOUTUBE_UNLISTED>

Stack: Next.js (PWA) + Postgres (read-only, hybrid) + Leaflet/OpenStreetMap, deploy GCP Cloud Run.

Penggunaan AI (disclosure TOR Bagian J): ide inti asli tim; AI generatif dipakai sebagai
alat bantu riset, penyusunan dokumentasi, dan coding assistant — bukan untuk menghasilkan
ide/konsep inti.
```

---

## 5. Panduan Cepat untuk Juri (Skenario Demo ± 3 menit)

1. Login (`juri`/`kopdeslink2026`) atau **Lanjut sebagai tamu**.
2. Di kanan atas, pilih Kopdes **"Madani Tirta Bakunase"** (peran: Pengurus).
3. **Stok & Alert** → Beras SPHP berstatus **Kritis** (stok minus, backorder).
4. **Cari Tetangga** → muncul 3 Kopdes surplus di peta; terdekat **Angkasa Fatubesi (3,7 km, surplus 1000)** → **Ajukan permintaan**.
5. Ganti Kopdes aktif ke **Angkasa Fatubesi** → menu **Permintaan** → **Setujui**.
6. Ganti peran ke **Agrinas/Dinas** → **Dashboard**: aliran gotong-royong di peta + omzet terselamatkan (± Rp10 juta) + barang rawan kosong.

---

## 6. Checklist Final Sebelum Klik Submit

- [ ] Repo publik, tanpa kredensial, README + disclosure AI ✔
- [ ] `KopdesLink-PitchDeck.pdf` (12 slide) — Team Profile sudah diisi nama asli
- [ ] URL demo hidup + diuji dari perangkat lain
- [ ] Akun juri dicantumkan di deskripsi
- [ ] (Opsional) video ≤ 3 menit, YouTube unlisted
- [ ] Semua tautan dites sekali lagi (repo, demo, video)
- [ ] **Submit T-30 menit sebelum deadline** — jangan menunggu detik terakhir
