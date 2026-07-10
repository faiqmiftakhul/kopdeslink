import 'server-only';
import { query } from './db';
import { FOCUS_KODE_WILAYAH } from './env';
import { parseKoordinat } from './geo';
import type { StockRaw } from './derive';
import type { Kopdes, Produk } from './types';

// ============================================================================
// dbRead — LOADER READ-ONLY dari DB bersama hackathon.
// Kredensial panitia hanya punya hak baca (tidak bisa CREATE/INSERT), jadi
// KopdesLink MEMBACA data nyata lalu menjalankan lapisan tulis di memori app
// (lihat store.ts). Ini justru sesuai narasi: lapisan di atas SIMKOPDES tanpa
// mengubah system-of-record. 27 tabel bawaan = sumber; tidak pernah ditulis.
// ============================================================================

const focusClause = (col: string, params: any[]) => {
  if (!FOCUS_KODE_WILAYAH) return '';
  params.push(`${FOCUS_KODE_WILAYAH}%`);
  return ` AND ${col} LIKE $${params.length}`;
};

export async function loadKopdes(): Promise<Kopdes[]> {
  const params: any[] = [];
  const rows = await query<any>(
    `SELECT p.koperasi_ref, p.nama_koperasi AS nama, p.koordinat_dibulatkan,
            COALESCE(p.kategori_usaha,'Koperasi') AS kategori_usaha,
            w.desa_kelurahan AS desa, w.kecamatan, w.kab_kota AS kabupaten, w.provinsi
       FROM profil_koperasi p
       JOIN referensi_koperasi_wilayah kw ON kw.koperasi_ref = p.koperasi_ref
       JOIN referensi_wilayah w ON w.kode_wilayah = kw.kode_wilayah
      WHERE p.koordinat_dibulatkan IS NOT NULL${focusClause('kw.kode_wilayah', params)}
      ORDER BY p.nama_koperasi
      LIMIT 500`,
    params
  );
  return rows
    .map((r) => {
      const c = parseKoordinat(r.koordinat_dibulatkan);
      if (!c) return null;
      return { ...r, lat: c[0], lng: c[1] } as Kopdes;
    })
    .filter(Boolean) as Kopdes[];
}

export async function loadProduk(): Promise<Produk[]> {
  const params: any[] = [];
  const rows = await query<any>(
    `SELECT DISTINCT ON (p.kode_barcode) p.produk_sample_id, p.nama_produk, p.unit, p.kode_barcode
       FROM produk_koperasi p
       JOIN referensi_koperasi_wilayah kw ON kw.koperasi_ref = p.koperasi_ref
       JOIN referensi_wilayah w ON w.kode_wilayah = kw.kode_wilayah
      WHERE p.kode_barcode IS NOT NULL${focusClause('kw.kode_wilayah', params)}
      LIMIT 1000`,
    params
  );
  return rows.map((r) => ({ ...r, kategori: '' }));
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

// Muat stok awal (read-only) untuk kopdes dalam fokus → StockRaw untuk memori app.
export async function loadStock(): Promise<StockRaw[]> {
  const params: any[] = [];
  const rows = await query<any>(
    `SELECT i.koperasi_ref, i.produk_sample_id, p.kode_barcode, p.nama_produk, p.unit,
            i.stok::float AS qty,
            COALESCE(NULLIF(bm.harga_jual,0), gp.avg_price, 0)::float AS harga_jual,
            COALESCE(s.avg_daily,0)::float AS avg_daily_sales
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
         SELECT produk_sample_id, koperasi_ref, SUM(jumlah_keluar)/30.0 AS avg_daily
           FROM barang_keluar_produk GROUP BY 1, 2
       ) s ON s.koperasi_ref = i.koperasi_ref AND s.produk_sample_id = i.produk_sample_id
       LEFT JOIN (
         SELECT p2.kode_barcode, AVG(NULLIF(b2.harga_jual,0)) AS avg_price
           FROM barang_masuk_produk b2 JOIN produk_koperasi p2 ON p2.produk_sample_id = b2.produk_sample_id
          WHERE b2.harga_jual > 0 GROUP BY p2.kode_barcode
       ) gp ON gp.kode_barcode = p.kode_barcode
      WHERE p.nama_produk NOT ILIKE '%jasa%'${focusClause('kw.kode_wilayah', params)}`,
    params
  );

  return rows.map((r) => {
    const avg = Number(r.avg_daily_sales) || 0;
    return {
      koperasi_ref: r.koperasi_ref,
      produk_sample_id: r.produk_sample_id,
      match_key: r.kode_barcode ? `bc:${r.kode_barcode}` : `nm:${norm(r.nama_produk)}`,
      nama_produk: r.nama_produk,
      unit: r.unit ?? '',
      kategori: '',
      qty: Number(r.qty) || 0,
      ambang_batas: Math.max(5, Math.round(avg * 3)),
      buffer_surplus: Math.max(5, Math.round(avg * 2)),
      harga_jual: Number(r.harga_jual) || 0,
      avg_daily_sales: avg,
    } as StockRaw;
  });
}
