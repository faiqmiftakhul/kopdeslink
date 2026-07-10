import type { StockItem, StockStatus } from './types';

// Estimasi berapa hari lagi stok habis berdasar rata-rata penjualan harian.
export function daysToStockout(qty: number, avgDaily: number): number | null {
  if (!avgDaily || avgDaily <= 0) return null;
  return qty / avgDaily;
}

// Aturan status: kritis bila hampir habis, menipis bila di bawah ambang.
export function stockStatus(qty: number, ambang: number, days: number | null): StockStatus {
  if (qty <= ambang * 0.5 || (days !== null && days <= 2)) return 'kritis';
  if (qty <= ambang) return 'menipis';
  return 'aman';
}

// Jumlah yang bisa dibagi ke Kopdes lain (di atas ambang + buffer aman).
export function surplusOf(qty: number, ambang: number, buffer: number): number {
  return Math.max(0, qty - ambang - buffer);
}

export interface StockRaw {
  koperasi_ref: string;
  produk_sample_id: string;
  // Kunci pencocokan lintas-Kopdes: kode_barcode (data nyata) atau produk_sample_id (mock).
  match_key: string;
  nama_produk: string;
  unit: string;
  kategori: string;
  qty: number;
  ambang_batas: number;
  buffer_surplus: number;
  harga_jual: number;
  avg_daily_sales: number;
}

export function buildStockItem(r: StockRaw): StockItem {
  const days = daysToStockout(r.qty, r.avg_daily_sales);
  return {
    ...r,
    days_to_stockout: days === null ? null : Math.round(days * 10) / 10,
    status: stockStatus(r.qty, r.ambang_batas, days),
    surplus: surplusOf(r.qty, r.ambang_batas, r.buffer_surplus),
  };
}
