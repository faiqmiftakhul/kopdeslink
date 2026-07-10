import './_env';
import { getPool } from '../lib/db';

// Cek koneksi DB bersama + tampilkan kandidat kecamatan untuk fokus demo.
// Jalankan: npm run db:ping
async function main() {
  const pool = getPool();
  const { rows: ping } = await pool.query('SELECT 1 AS ok');
  console.log('✅ Koneksi DB OK:', ping[0]);

  const { rows: cnt } = await pool.query('SELECT COUNT(*)::int AS n FROM profil_koperasi');
  console.log(`📊 Total profil_koperasi: ${cnt[0].n}`);

  const { rows: kec } = await pool.query(
    `SELECT w.provinsi, w.kab_kota, w.kecamatan,
            substring(w.kode_wilayah from 1 for 8) AS kode_kec,
            COUNT(*)::int AS jumlah_kopdes
       FROM profil_koperasi p
       JOIN referensi_koperasi_wilayah kw ON kw.koperasi_ref = p.koperasi_ref
       JOIN referensi_wilayah w ON w.kode_wilayah = kw.kode_wilayah
      WHERE p.koordinat_dibulatkan IS NOT NULL
      GROUP BY w.provinsi, w.kab_kota, w.kecamatan, kode_kec
      ORDER BY jumlah_kopdes DESC LIMIT 15`
  );
  console.log('\n🏘️  Kecamatan terpadat (kandidat FOCUS_KODE_WILAYAH):');
  for (const r of kec) {
    console.log(`   ${r.kode_kec}  ${r.kecamatan}, ${r.kab_kota}, ${r.provinsi}  → ${r.jumlah_kopdes} kopdes`);
  }
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Gagal:', e.message);
  process.exit(1);
});
