// Konfigurasi terpusat, dibaca dari environment (lihat .env.example).
export const DATA_SOURCE = (process.env.DATA_SOURCE ?? 'mock').toLowerCase();
export const USE_DB = DATA_SOURCE === 'db';

// Prefix WAJIB untuk semua tabel milik tim di DB bersama (aturan panitia).
export const TABLE_PREFIX = process.env.TABLE_PREFIX ?? 'indonesiacerah_';

export const MATCH_RADIUS_KM = Number(process.env.MATCH_RADIUS_KM ?? 15);
export const FOCUS_KODE_WILAYAH = process.env.FOCUS_KODE_WILAYAH ?? '';

export const DB_CONFIG = {
  host: process.env.DB_HOST ?? '',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_DATABASE ?? 'hackathon_2026',
  user: process.env.DB_USERNAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  ssl: (process.env.DB_SSL ?? 'false') === 'true' ? { rejectUnauthorized: false } : undefined,
};

// Nama tabel milik KopdesLink (selalu ber-prefix).
export const T = {
  stokLive: `${TABLE_PREFIX}stok_live`,
  penjualan: `${TABLE_PREFIX}penjualan`,
  request: `${TABLE_PREFIX}request_b2b`,
  ambang: `${TABLE_PREFIX}ambang`,
};
