import type { Kopdes, Produk, RegionalItem } from './types';
import type { StockRaw } from './derive';

// Sebaran barang rawan kosong per provinsi (mock, untuk peta nasional pemerintah).
export const MOCK_REGIONAL: RegionalItem[] = [
  { wilayah: 'Jawa Barat', lat: -6.9, lng: 107.6, kritis_count: 42, kopdes_count: 20, top_produk: 'Minyak Goreng 2L' },
  { wilayah: 'Jawa Timur', lat: -7.6, lng: 112.5, kritis_count: 35, kopdes_count: 16, top_produk: 'Gula Pasir 1kg' },
  { wilayah: 'Sumatera Selatan', lat: -3.3, lng: 104.0, kritis_count: 28, kopdes_count: 9, top_produk: 'Beras SPHP 5KG' },
  { wilayah: 'Sulawesi Selatan', lat: -5.1, lng: 119.4, kritis_count: 24, kopdes_count: 8, top_produk: 'Minyak Goreng 2L' },
  { wilayah: 'Sumatera Utara', lat: 3.0, lng: 98.7, kritis_count: 22, kopdes_count: 8, top_produk: 'Gula Pasir 1kg' },
  { wilayah: 'Kalimantan Timur', lat: -0.5, lng: 117.1, kritis_count: 20, kopdes_count: 7, top_produk: 'Beras SPHP 5KG' },
  { wilayah: 'Nusa Tenggara Timur', lat: -10.2, lng: 123.6, kritis_count: 18, kopdes_count: 7, top_produk: 'Beras SPHP 5KG' },
  { wilayah: 'Nusa Tenggara Barat', lat: -8.6, lng: 116.1, kritis_count: 16, kopdes_count: 6, top_produk: 'Beras SPHP 5KG' },
  { wilayah: 'Riau', lat: 0.5, lng: 101.4, kritis_count: 15, kopdes_count: 6, top_produk: 'Pupuk Urea 50kg' },
  { wilayah: 'Papua', lat: -3.3, lng: 138.0, kritis_count: 14, kopdes_count: 4, top_produk: 'Beras SPHP 5KG' },
  { wilayah: 'DKI Jakarta', lat: -6.2, lng: 106.85, kritis_count: 12, kopdes_count: 6, top_produk: 'LPG 3kg' },
  { wilayah: 'Sulawesi Tenggara', lat: -4.0, lng: 122.5, kritis_count: 11, kopdes_count: 4, top_produk: 'Minyak Goreng 2L' },
  { wilayah: 'Bali', lat: -8.4, lng: 115.1, kritis_count: 9, kopdes_count: 5, top_produk: 'Telur Ayam 1kg' },
];

// ============================================================================
// DATA CONTOH (mock) — 1 kecamatan, 5 Kopdes, 10 produk.
// Dipakai saat DATA_SOURCE=mock agar app jalan tanpa jaringan hackathon.
// Bentuk data sengaja meniru hasil join tabel nyata (profil_koperasi,
// produk_koperasi, inventaris_produk) supaya jalur DB tinggal ganti sumber.
// ============================================================================

export const MOCK_KOPDES: Kopdes[] = [
  { koperasi_ref: 'KOP-SUKAMAJU01', nama: 'Kopdes Merah Putih Sukamaju', desa: 'Sukamaju', kecamatan: 'Cibeunying', kabupaten: 'Bandung', provinsi: 'Jawa Barat', lat: -6.89, lng: 107.61, kategori_usaha: 'Gerai Sembako' },
  { koperasi_ref: 'KOP-MEKARSARI2', nama: 'Kopdes Merah Putih Mekarsari', desa: 'Mekarsari', kecamatan: 'Cibeunying', kabupaten: 'Bandung', provinsi: 'Jawa Barat', lat: -6.92, lng: 107.63, kategori_usaha: 'Gerai Sembako' },
  { koperasi_ref: 'KOP-CIBEUREUM3', nama: 'Kopdes Merah Putih Cibeureum', desa: 'Cibeureum', kecamatan: 'Cibeunying', kabupaten: 'Bandung', provinsi: 'Jawa Barat', lat: -6.905, lng: 107.655, kategori_usaha: 'Gerai Sembako' },
  { koperasi_ref: 'KOP-MARGAHAYU4', nama: 'Kopdes Merah Putih Margahayu', desa: 'Margahayu', kecamatan: 'Cibeunying', kabupaten: 'Bandung', provinsi: 'Jawa Barat', lat: -6.94, lng: 107.6, kategori_usaha: 'Gerai Sembako' },
  { koperasi_ref: 'KOP-TANJUNGSA5', nama: 'Kopdes Merah Putih Tanjungsari', desa: 'Tanjungsari', kecamatan: 'Cibeunying', kabupaten: 'Bandung', provinsi: 'Jawa Barat', lat: -6.87, lng: 107.68, kategori_usaha: 'Gerai Sembako' },
];

export const MOCK_PRODUK: Produk[] = [
  { produk_sample_id: 'P01', nama_produk: 'Beras Premium 5kg', unit: 'karung', kode_barcode: '8990001000011', kategori: 'sembako' },
  { produk_sample_id: 'P02', nama_produk: 'Minyak Goreng 2L', unit: 'pouch', kode_barcode: '8990001000028', kategori: 'sembako' },
  { produk_sample_id: 'P03', nama_produk: 'Gula Pasir 1kg', unit: 'pak', kode_barcode: '8990001000035', kategori: 'sembako' },
  { produk_sample_id: 'P04', nama_produk: 'Telur Ayam 1kg', unit: 'kg', kode_barcode: '8990001000042', kategori: 'sembako' },
  { produk_sample_id: 'P05', nama_produk: 'Tepung Terigu 1kg', unit: 'pak', kode_barcode: '8990001000059', kategori: 'sembako' },
  { produk_sample_id: 'P06', nama_produk: 'Mie Instan (dus 40)', unit: 'dus', kode_barcode: '8990001000066', kategori: 'sembako' },
  { produk_sample_id: 'P07', nama_produk: 'LPG 3kg', unit: 'tabung', kode_barcode: '8990001000073', kategori: 'energi' },
  { produk_sample_id: 'P08', nama_produk: 'Pupuk Urea 50kg', unit: 'sak', kode_barcode: '8990001000080', kategori: 'pertanian' },
  { produk_sample_id: 'P09', nama_produk: 'Beras Medium 10kg', unit: 'karung', kode_barcode: '8990001000097', kategori: 'sembako' },
  { produk_sample_id: 'P10', nama_produk: 'Paracetamol 500mg', unit: 'strip', kode_barcode: '8990001000103', kategori: 'obat' },
];

const HARGA: Record<string, number> = {
  P01: 68000, P02: 38000, P03: 17000, P04: 29000, P05: 13000,
  P06: 115000, P07: 22000, P08: 260000, P09: 125000, P10: 8000,
};

const AMBANG: Record<string, number> = {
  P01: 20, P02: 25, P03: 20, P04: 15, P05: 20,
  P06: 8, P07: 30, P08: 10, P09: 15, P10: 30,
};

// Override untuk skenario demo "beras hampir habis" + surplus tetangga.
// key = `${koperasi_ref}|${produk}` → { qty, avg }
const OVERRIDE: Record<string, { qty: number; avg: number }> = {
  'KOP-SUKAMAJU01|P01': { qty: 6, avg: 8 },     // KRITIS: ~0.75 hari lagi habis
  'KOP-SUKAMAJU01|P07': { qty: 18, avg: 4 },    // LPG menipis
  'KOP-MEKARSARI2|P01': { qty: 120, avg: 3 },   // SURPLUS beras 80 karung
  'KOP-CIBEUREUM3|P01': { qty: 74, avg: 2 },    // surplus beras juga (opsi kedua)
  'KOP-MEKARSARI2|P08': { qty: 40, avg: 1 },    // surplus pupuk
  'KOP-MARGAHAYU4|P07': { qty: 90, avg: 2 },    // surplus LPG
};

// Bangun matriks stok Kopdes × Produk secara deterministik (tanpa random).
export function buildMockStock(): StockRaw[] {
  const rows: StockRaw[] = [];
  MOCK_KOPDES.forEach((k, i) => {
    MOCK_PRODUK.forEach((p, j) => {
      const key = `${k.koperasi_ref}|${p.produk_sample_id}`;
      const o = OVERRIDE[key];
      const qty = o ? o.qty : ((i * 7 + j * 11) % 9) * 12 + 8; // 8..104
      const avg = o ? o.avg : ((i * 3 + j * 5) % 5) + 1; // 1..5
      rows.push({
        koperasi_ref: k.koperasi_ref,
        produk_sample_id: p.produk_sample_id,
        match_key: p.produk_sample_id, // mock: produk_sample_id sama antar-kopdes
        nama_produk: p.nama_produk,
        unit: p.unit,
        kategori: p.kategori,
        qty,
        ambang_batas: AMBANG[p.produk_sample_id] ?? 15,
        buffer_surplus: 10,
        harga_jual: HARGA[p.produk_sample_id] ?? 10000,
        avg_daily_sales: avg,
      });
    });
  });
  return rows;
}
