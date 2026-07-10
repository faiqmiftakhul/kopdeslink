import 'server-only';
import { DATA_SOURCE, MATCH_RADIUS_KM } from './env';
import { haversineKm } from './geo';
import { buildStockItem, surplusOf, type StockRaw } from './derive';
import { MOCK_KOPDES, MOCK_PRODUK, buildMockStock } from './mockData';
import * as dbRead from './dbStore';
import type { Kopdes, Produk, StockItem, Match, RequestB2B, DashboardData } from './types';

// ============================================================================
// STORE — satu mesin in-memory untuk seluruh API.
//   DATA_SOURCE=mock → di-seed dari data contoh (jalan tanpa jaringan).
//   DATA_SOURCE=db   → di-seed dari DATA NYATA DB bersama (READ-ONLY), lalu
//                      seluruh operasi tulis (POS, request, transfer) di memori.
// Kredensial panitia read-only (tak bisa CREATE/INSERT), jadi pendekatan ini
// yang paling tepat: baca system-of-record, tulis di lapisan app di atasnya.
// ============================================================================

interface MemState {
  stock: Map<string, StockRaw>; // key: `${koperasi_ref}|${produk_sample_id}`
  requests: (RequestB2B & { match_key?: string })[];
  seq: number;
  kopdes: Kopdes[];
  produk: Produk[];
}

const g = globalThis as unknown as { _klState?: Promise<MemState> };

async function build(): Promise<MemState> {
  const stock = new Map<string, StockRaw>();
  if (DATA_SOURCE === 'db') {
    const [kopdes, produk, rows] = await Promise.all([dbRead.loadKopdes(), dbRead.loadProduk(), dbRead.loadStock()]);
    for (const r of rows) stock.set(`${r.koperasi_ref}|${r.produk_sample_id}`, r);
    return { stock, requests: [], seq: 1, kopdes, produk };
  }
  for (const r of buildMockStock()) stock.set(`${r.koperasi_ref}|${r.produk_sample_id}`, r);
  return { stock, requests: [], seq: 1, kopdes: MOCK_KOPDES, produk: MOCK_PRODUK };
}

function ensureState(): Promise<MemState> {
  if (!g._klState) g._klState = build();
  return g._klState;
}

const rank: Record<string, number> = { kritis: 0, menipis: 1, aman: 2 };

// ---------------------------------------------------------------------------

export async function getKopdesList(): Promise<Kopdes[]> {
  return (await ensureState()).kopdes;
}

export async function getProdukList(): Promise<Produk[]> {
  return (await ensureState()).produk;
}

export async function getInventory(koperasiRef: string): Promise<StockItem[]> {
  const s = await ensureState();
  return [...s.stock.values()]
    .filter((r) => r.koperasi_ref === koperasiRef)
    .map(buildStockItem)
    .sort((a, b) => rank[a.status] - rank[b.status] || (a.days_to_stockout ?? 1e9) - (b.days_to_stockout ?? 1e9));
}

export async function recordSale(koperasiRef: string, produkId: string, qty: number): Promise<StockItem> {
  const s = await ensureState();
  const r = s.stock.get(`${koperasiRef}|${produkId}`);
  if (!r) throw new Error('Produk tidak ditemukan di inventaris Kopdes ini');
  r.qty = Math.max(0, r.qty - qty);
  return buildStockItem(r);
}

export async function findMatches(koperasiRef: string, produkId: string, radiusKm = MATCH_RADIUS_KM): Promise<Match[]> {
  const s = await ensureState();
  const origin = s.kopdes.find((k) => k.koperasi_ref === koperasiRef);
  const originStock = s.stock.get(`${koperasiRef}|${produkId}`);
  if (!origin || !originStock) return [];
  const key = originStock.match_key;

  const byRef = new Map(s.kopdes.map((k) => [k.koperasi_ref, k]));
  const matches: Match[] = [];
  for (const r of s.stock.values()) {
    if (r.koperasi_ref === koperasiRef || r.match_key !== key) continue;
    const surplus = surplusOf(r.qty, r.ambang_batas, r.buffer_surplus);
    if (surplus <= 0) continue;
    const k = byRef.get(r.koperasi_ref);
    if (!k) continue;
    const jarak = haversineKm(origin.lat, origin.lng, k.lat, k.lng);
    if (jarak > radiusKm) continue;
    matches.push({
      kopdes: k,
      produk_sample_id: r.produk_sample_id,
      nama_produk: r.nama_produk,
      unit: r.unit,
      qty_tersedia: r.qty,
      surplus,
      harga_jual: r.harga_jual,
      jarak_km: Math.round(jarak * 10) / 10,
    });
  }
  return matches.sort((a, b) => a.jarak_km - b.jarak_km);
}

export async function createRequest(input: {
  koperasi_peminta_ref: string;
  koperasi_pemasok_ref: string;
  produk_sample_id: string;
  qty: number;
  harga: number;
}): Promise<RequestB2B> {
  const s = await ensureState();
  const namaKopdes = (ref: string) => s.kopdes.find((k) => k.koperasi_ref === ref)?.nama ?? ref;
  const supStock = s.stock.get(`${input.koperasi_pemasok_ref}|${input.produk_sample_id}`);
  const req: RequestB2B & { match_key?: string } = {
    id: `REQ-${String(s.seq++).padStart(4, '0')}`,
    koperasi_peminta_ref: input.koperasi_peminta_ref,
    peminta_nama: namaKopdes(input.koperasi_peminta_ref),
    koperasi_pemasok_ref: input.koperasi_pemasok_ref,
    pemasok_nama: namaKopdes(input.koperasi_pemasok_ref),
    produk_sample_id: input.produk_sample_id,
    nama_produk: supStock?.nama_produk ?? input.produk_sample_id,
    qty: input.qty,
    harga: input.harga,
    status: 'pending',
    dibuat_pada: new Date().toISOString(),
    disetujui_pada: null,
    match_key: supStock?.match_key,
  };
  s.requests.unshift(req);
  return req;
}

export async function listRequests(koperasiRef?: string): Promise<{
  incoming: RequestB2B[]; outgoing: RequestB2B[]; all: RequestB2B[];
}> {
  const s = await ensureState();
  const all = s.requests;
  return {
    all,
    incoming: koperasiRef ? all.filter((r) => r.koperasi_pemasok_ref === koperasiRef) : [],
    outgoing: koperasiRef ? all.filter((r) => r.koperasi_peminta_ref === koperasiRef) : [],
  };
}

export async function decideRequest(id: string, action: 'approve' | 'reject'): Promise<RequestB2B> {
  const s = await ensureState();
  const req = s.requests.find((r) => r.id === id);
  if (!req) throw new Error('Permintaan tidak ditemukan');
  if (req.status !== 'pending') return req;
  if (action === 'reject') {
    req.status = 'rejected';
    return req;
  }
  // Pindahkan stok pemasok → peminta (peminta dicocokkan via match_key).
  const sup = s.stock.get(`${req.koperasi_pemasok_ref}|${req.produk_sample_id}`);
  if (sup) sup.qty = Math.max(0, sup.qty - req.qty);
  const key = req.match_key ?? sup?.match_key;
  // Cari entri peminta dgn match_key sama; jika tak ada, buat baru.
  const dst = key
    ? [...s.stock.values()].find((r) => r.koperasi_ref === req.koperasi_peminta_ref && r.match_key === key)
    : undefined;
  if (dst) {
    dst.qty += req.qty;
  } else if (sup) {
    const clone: StockRaw = { ...sup, koperasi_ref: req.koperasi_peminta_ref, qty: req.qty };
    s.stock.set(`${req.koperasi_peminta_ref}|${clone.produk_sample_id}`, clone);
  }
  req.status = 'approved';
  req.disetujui_pada = new Date().toISOString();
  return req;
}

export async function getDashboard(): Promise<DashboardData> {
  const s = await ensureState();
  const approved = s.requests.filter((r) => r.status === 'approved');

  const kritisCount = new Map<string, number>();
  for (const r of s.stock.values()) {
    if (buildStockItem(r).status === 'kritis') {
      kritisCount.set(r.nama_produk, (kritisCount.get(r.nama_produk) ?? 0) + 1);
    }
  }
  const barang_rawan_kosong = [...kritisCount.entries()]
    .map(([nama_produk, jumlah_kopdes_kritis]) => ({ nama_produk, jumlah_kopdes_kritis }))
    .sort((a, b) => b.jumlah_kopdes_kritis - a.jumlah_kopdes_kritis)
    .slice(0, 5);

  const omzet = approved.reduce((sum, r) => sum + r.qty * r.harga, 0);
  const byRef = new Map(s.kopdes.map((k) => [k.koperasi_ref, k]));
  const aliran = approved
    .map((r) => {
      const dari = byRef.get(r.koperasi_pemasok_ref);
      const ke = byRef.get(r.koperasi_peminta_ref);
      if (!dari || !ke) return null;
      return {
        id: r.id,
        dari: { nama: dari.nama, lat: dari.lat, lng: dari.lng },
        ke: { nama: ke.nama, lat: ke.lat, lng: ke.lng },
        nama_produk: r.nama_produk,
        qty: r.qty,
      };
    })
    .filter(Boolean) as DashboardData['aliran'];

  return {
    total_kopdes: s.kopdes.length,
    total_request: s.requests.length,
    request_disetujui: approved.length,
    omzet_terselamatkan: omzet,
    biaya_logistik_terpangkas: Math.round(omzet * 0.6 * 0.05),
    barang_rawan_kosong,
    aliran,
    kopdes: s.kopdes,
  };
}
