import './_env';
import { getPool } from '../lib/db';
import { T, FOCUS_KODE_WILAYAH } from '../lib/env';

// Membuat tabel milik KopdesLink (ber-prefix) + seed indonesiacerah_stok_live
// dari data NYATA (inventaris_produk) untuk 1 kecamatan fokus.
// Jalankan: npm run db:init
async function main() {
  const pool = getPool();

  console.log('🔧 Membuat tabel ber-prefix:', T.stokLive, T.penjualan, T.request);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${T.stokLive} (
      koperasi_ref text NOT NULL,
      produk_sample_id text NOT NULL,
      kode_barcode text,
      nama_produk text,
      unit text,
      qty numeric NOT NULL DEFAULT 0,
      harga_jual numeric NOT NULL DEFAULT 0,
      ambang_batas numeric NOT NULL DEFAULT 15,
      buffer_surplus numeric NOT NULL DEFAULT 10,
      updated_at timestamp DEFAULT now(),
      PRIMARY KEY (koperasi_ref, produk_sample_id)
    );
    CREATE INDEX IF NOT EXISTS ${T.stokLive}_barcode_idx ON ${T.stokLive} (kode_barcode);

    CREATE TABLE IF NOT EXISTS ${T.penjualan} (
      id bigserial PRIMARY KEY,
      koperasi_ref text NOT NULL,
      produk_sample_id text NOT NULL,
      qty numeric NOT NULL,
      harga numeric NOT NULL DEFAULT 0,
      waktu timestamp DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS ${T.request} (
      id text PRIMARY KEY,
      koperasi_peminta_ref text NOT NULL,
      koperasi_pemasok_ref text NOT NULL,
      produk_sample_id text NOT NULL,
      kode_barcode text,
      nama_produk text,
      qty numeric NOT NULL,
      harga numeric NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'pending',
      dibuat_pada timestamp DEFAULT now(),
      disetujui_pada timestamp
    );
  `);

  // Tentukan kecamatan fokus.
  let focus = FOCUS_KODE_WILAYAH;
  if (!focus) {
    const { rows } = await pool.query(
      `SELECT substring(w.kode_wilayah from 1 for 8) AS kode_kec, COUNT(*)::int AS n
         FROM profil_koperasi p
         JOIN referensi_koperasi_wilayah kw ON kw.koperasi_ref = p.koperasi_ref
         JOIN referensi_wilayah w ON w.kode_wilayah = kw.kode_wilayah
        WHERE p.koordinat_dibulatkan IS NOT NULL
        GROUP BY kode_kec ORDER BY n DESC LIMIT 1`
    );
    focus = rows[0]?.kode_kec ?? '';
    console.log(`ℹ️  FOCUS_KODE_WILAYAH kosong → auto-pilih kecamatan terpadat: ${focus} (${rows[0]?.n} kopdes)`);
    console.log('   (set FOCUS_KODE_WILAYAH di .env.local untuk mengunci pilihan)');
  }
  if (!focus) throw new Error('Tidak menemukan kecamatan dengan koordinat. Cek koneksi/data.');

  console.log('🌱 Seeding', T.stokLive, 'dari inventaris_produk untuk kecamatan', focus);
  await pool.query(`TRUNCATE ${T.stokLive}`);
  const seed = await pool.query(
    `INSERT INTO ${T.stokLive}
        (koperasi_ref, produk_sample_id, kode_barcode, nama_produk, unit, qty, harga_jual, ambang_batas, buffer_surplus)
     SELECT i.koperasi_ref, i.produk_sample_id, p.kode_barcode, p.nama_produk, p.unit,
            i.stok,
            COALESCE(bm.harga_jual, 0),
            GREATEST(5, ROUND(COALESCE(s.avg_daily, 1) * 3)),
            GREATEST(5, ROUND(COALESCE(s.avg_daily, 1) * 2))
       FROM inventaris_produk i
       JOIN produk_koperasi p ON p.produk_sample_id = i.produk_sample_id
       JOIN referensi_koperasi_wilayah kw ON kw.koperasi_ref = i.koperasi_ref
       JOIN referensi_wilayah w ON w.kode_wilayah = kw.kode_wilayah
       LEFT JOIN LATERAL (
         SELECT harga_jual FROM barang_masuk_produk b
          WHERE b.produk_sample_id = i.produk_sample_id
          ORDER BY tanggal_masuk DESC NULLS LAST LIMIT 1
       ) bm ON true
       LEFT JOIN (
         SELECT produk_sample_id, koperasi_ref, SUM(jumlah_keluar) / 30.0 AS avg_daily
           FROM barang_keluar_produk GROUP BY 1, 2
       ) s ON s.koperasi_ref = i.koperasi_ref AND s.produk_sample_id = i.produk_sample_id
      WHERE w.kode_wilayah LIKE $1
     ON CONFLICT (koperasi_ref, produk_sample_id) DO NOTHING`,
    [`${focus}%`]
  );
  console.log(`✅ Seed selesai: ${seed.rowCount} baris stok.`);

  const { rows: chk } = await pool.query(
    `SELECT COUNT(DISTINCT koperasi_ref)::int AS kopdes, COUNT(*)::int AS baris FROM ${T.stokLive}`
  );
  console.log(`📦 ${T.stokLive}: ${chk[0].kopdes} kopdes, ${chk[0].baris} baris.`);
  if (chk[0].kopdes < 2) {
    console.log('⚠️  <2 kopdes di kecamatan ini → matchmaking butuh minimal 2. Pilih kecamatan lain (lihat npm run db:ping).');
  }
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Gagal:', e.message);
  process.exit(1);
});
