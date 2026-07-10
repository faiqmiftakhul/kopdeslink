# Panduan Deploy — KopdesLink ke Google Cloud Run

> Menghasilkan **URL demo publik** (Deliverable #3 TOR). Aplikasi = Next.js 14 (output `standalone`) + `Dockerfile` yang sudah siap. Sumber data: DB bersama panitia (read-only) atau mode `mock`.
>
> ⚠️ **Rahasia (host/username/password DB) diambil dari `gcloud_database.txt` — JANGAN ketik nilai aslinya ke file yang di-commit.** Di panduan ini semua ditulis sebagai `<...>`.

---

## 0. Prasyarat

- **Google Cloud SDK (`gcloud`)** terpasang → cek: `gcloud version`
  (belum ada? Install: https://cloud.google.com/sdk/docs/install)
- **Akun GCP hackathon**: `hackaton.group27a@pendamping.kop.id` (atau b/c) — **ganti password default dulu** saat login pertama.
- **Kredit $60** aktif di project GCP tim.
- Berada di folder proyek (ada `Dockerfile`, `package.json`).

---

## 1. Login & Konfigurasi Awal

```bash
# login (buka browser)
gcloud auth login

# lihat project yang tersedia, lalu set salah satu
gcloud projects list
gcloud config set project <PROJECT_ID>

# region Jakarta
gcloud config set run/region asia-southeast2

# aktifkan API yang diperlukan (sekali saja)
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

> Jika di sesi interaktif Claude Code, jalankan login lewat prefix `!`:
> ketik `! gcloud auth login` di prompt agar outputnya masuk ke sesi.

---

## 2. Deploy

`gcloud run deploy --source .` akan otomatis mem-build image dari `Dockerfile`
lewat Cloud Build, lalu men-deploy-nya. **Kredensial DB dikirim saat deploy (runtime), bukan dari repo.**

### Opsi A — Cepat (env var langsung) — cocok untuk sprint

```bash
gcloud run deploy kopdeslink \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --set-env-vars "DATA_SOURCE=db,DB_SSL=true,TABLE_PREFIX=indonesiacerah_,FOCUS_KODE_WILAYAH=53.71,MATCH_RADIUS_KM=15" \
  --set-env-vars "DB_HOST=<DB_HOST>,DB_PORT=5432,DB_DATABASE=<DB_DATABASE>,DB_USERNAME=<DB_USERNAME>" \
  --set-env-vars "DB_PASSWORD=<DB_PASSWORD>"
```

- `<...>` diisi dari `gcloud_database.txt`.
- **Backup demo tanpa DB:** ganti `DATA_SOURCE=db` → `DATA_SOURCE=mock` (env DB boleh dikosongkan).

### Opsi B — Lebih aman (password via Secret Manager)

```bash
# simpan password DB sebagai secret (sekali saja)
printf '%s' '<DB_PASSWORD>' | gcloud secrets create kopdeslink-db-pass --data-file=-

# beri akses service account Cloud Run ke secret
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding kopdeslink-db-pass \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# deploy — password diinjeksi dari secret
gcloud run deploy kopdeslink \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --port 8080 --memory 512Mi \
  --set-env-vars "DATA_SOURCE=db,DB_SSL=true,TABLE_PREFIX=indonesiacerah_,FOCUS_KODE_WILAYAH=53.71,MATCH_RADIUS_KM=15,DB_HOST=<DB_HOST>,DB_PORT=5432,DB_DATABASE=<DB_DATABASE>,DB_USERNAME=<DB_USERNAME>" \
  --update-secrets "DB_PASSWORD=kopdeslink-db-pass:latest"
```

Proses build+deploy ± 3–6 menit. URL muncul di akhir, mis:
`https://kopdeslink-xxxxxxxx-et.a.run.app`

---

## 3. Uji Setelah Deploy

```bash
# ambil URL layanan
gcloud run services describe kopdeslink --region asia-southeast2 --format='value(status.url)'
```

Buka URL, lalu cek:
- [ ] Layar login muncul → masuk `juri` / `kopdeslink2026` (atau **Lanjut sebagai tamu**)
- [ ] Data nyata tampil (7 Kopdes Kota Kupang) — atau data mock bila `DATA_SOURCE=mock`
- [ ] Alur demo jalan: pilih **Madani Tirta Bakunase** → **Cari Tetangga** → ajukan → setujui → dashboard
- [ ] Dites dari perangkat lain (HP), bukan hanya laptop tim

Cek cepat dari terminal:
```bash
URL=$(gcloud run services describe kopdeslink --region asia-southeast2 --format='value(status.url)')
curl -s -o /dev/null -w "home %{http_code}\n" "$URL/"
curl -s "$URL/api/kopdes" | head -c 200; echo
```

---

## 4. Update / Redeploy (setelah ubah kode)

Cukup jalankan ulang perintah `gcloud run deploy` yang sama — Cloud Run membuat revisi baru
dan mengalihkan trafik otomatis. Untuk mengubah **hanya** env (tanpa build ulang):

```bash
gcloud run services update kopdeslink --region asia-southeast2 \
  --update-env-vars "FOCUS_KODE_WILAYAH=53.71,MATCH_RADIUS_KM=15"
```

---

## 5. Troubleshooting

| Gejala | Penyebab & Solusi |
|---|---|
| `pg_hba.conf ... no encryption` / koneksi DB gagal | Wajib `DB_SSL=true`. Pastikan env ini ter-set. |
| Halaman 500 / data kosong | Cek log: `gcloud run services logs read kopdeslink --region asia-southeast2 --limit 50`. Biasanya kredensial DB salah atau `FOCUS_KODE_WILAYAH` tak ada datanya. |
| `permission denied for schema public` saat init | Normal — kredensial panitia **read-only**. KopdesLink memang **tidak** menulis ke DB (mode hybrid, tulis di memori app). Jangan jalankan `db:init` ke DB bersama. |
| Build gagal di Cloud Build | Cek `Dockerfile` & `package-lock.json` ikut ter-commit. Lihat log build di Console → Cloud Build. |
| Container gagal start / port | Cloud Run mengirim `PORT=8080`; `Dockerfile` sudah `ENV PORT=8080` + `node server.js` (Next standalone menghormati `PORT`). Pastikan `--port 8080`. |
| Lambat saat pertama diakses (cold start) | Set `--min-instances 1` agar selalu hangat saat penjurian (menambah sedikit biaya kredit). |
| Kehabisan memori saat build/run | Naikkan `--memory 512Mi` → `1Gi`. |

Lihat log real-time:
```bash
gcloud run services logs tail kopdeslink --region asia-southeast2
```

---

## 6. Hemat Kredit (opsional, setelah penjurian)

```bash
# hapus layanan agar berhenti memakai kredit
gcloud run services delete kopdeslink --region asia-southeast2
```
`--min-instances 0` (default di Opsi A) sudah membuat biaya ~nol saat tidak diakses.

---

## 7. Ringkasan Variabel Lingkungan

| Variabel | Nilai demo | Keterangan |
|---|---|---|
| `DATA_SOURCE` | `db` | `db` = data nyata; `mock` = data contoh (tanpa DB) |
| `DB_SSL` | `true` | **wajib** — server DB menolak tanpa enkripsi |
| `DB_HOST` `DB_PORT` `DB_DATABASE` `DB_USERNAME` `DB_PASSWORD` | `<dari gcloud_database.txt>` | kredensial DB bersama |
| `TABLE_PREFIX` | `indonesiacerah_` | prefix tabel tim (untuk mode DB writable; read-only tak menulis) |
| `FOCUS_KODE_WILAYAH` | `53.71` | Kota Kupang, NTT — skenario demo terverifikasi |
| `MATCH_RADIUS_KM` | `15` | radius pencarian Kopdes tetangga |

> Setelah deploy berhasil, salin URL ke `SUBMISSION.md` dan kolom deskripsi submission (beserta akun juri).
