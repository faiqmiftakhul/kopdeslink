export type StockStatus = 'aman' | 'menipis' | 'kritis';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type Role = 'pengurus' | 'pemerintah';

export interface Kopdes {
  koperasi_ref: string;
  nama: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  lat: number;
  lng: number;
  kategori_usaha: string;
}

export interface Produk {
  produk_sample_id: string;
  nama_produk: string;
  unit: string;
  kode_barcode: string;
  kategori: string;
}

export interface StockItem {
  koperasi_ref: string;
  produk_sample_id: string;
  nama_produk: string;
  unit: string;
  kategori: string;
  qty: number;
  ambang_batas: number;
  buffer_surplus: number;
  harga_jual: number;
  avg_daily_sales: number;
  days_to_stockout: number | null; // null = tak terprediksi (belum ada penjualan)
  status: StockStatus;
  surplus: number; // qty di atas (ambang + buffer); >0 = bisa dibagi
}

export interface Match {
  kopdes: Kopdes;
  produk_sample_id: string;
  nama_produk: string;
  unit: string;
  qty_tersedia: number;
  surplus: number;
  harga_jual: number;
  jarak_km: number;
}

export interface RequestB2B {
  id: string;
  koperasi_peminta_ref: string;
  peminta_nama: string;
  koperasi_pemasok_ref: string;
  pemasok_nama: string;
  produk_sample_id: string;
  nama_produk: string;
  qty: number;
  harga: number;
  status: RequestStatus;
  dibuat_pada: string;
  disetujui_pada: string | null;
}

export interface RegionalItem {
  wilayah: string;      // nama provinsi
  lat: number;
  lng: number;
  kritis_count: number; // jumlah item stok kosong/kritis di wilayah
  kopdes_count: number;
  top_produk: string;   // barang paling sering kosong di wilayah
}

export interface DashboardData {
  total_kopdes: number;
  total_request: number;
  request_disetujui: number;
  omzet_terselamatkan: number;
  biaya_logistik_terpangkas: number;
  barang_rawan_kosong: { nama_produk: string; jumlah_kopdes_kritis: number }[];
  aliran: {
    id: string;
    dari: { nama: string; lat: number; lng: number };
    ke: { nama: string; lat: number; lng: number };
    nama_produk: string;
    qty: number;
  }[];
  kopdes: Kopdes[];
}
