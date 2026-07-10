'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import type { StockItem } from '@/lib/types';
import { rupiah, statusColor, statusLabel } from '@/lib/format';

export default function InventoryPage() {
  const { activeKopdesRef, activeKopdes } = useApp();
  const [items, setItems] = useState<StockItem[]>([]);

  const load = useCallback(async () => {
    if (!activeKopdesRef) return;
    const r = await fetch(`/api/inventory?koperasi=${activeKopdesRef}`);
    const d = await r.json();
    setItems(d.items ?? []);
  }, [activeKopdesRef]);

  useEffect(() => {
    load();
    const t = setInterval(load, 4000); // polling sinkron real-time
    return () => clearInterval(t);
  }, [load]);

  const alerts = items.filter((i) => i.status !== 'aman');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Stok & Smart Reorder Alert</h1>
        <p className="text-sm text-slate-500">{activeKopdes?.nama} — prediksi habis dari rata-rata penjualan.</p>
      </div>

      {alerts.length > 0 && (
        <div className="card border-amber-300 bg-amber-50 p-4">
          <h2 className="font-bold text-amber-800">⚠️ {alerts.length} barang perlu perhatian</h2>
          <div className="mt-2 space-y-1.5">
            {alerts.map((it) => (
              <div key={it.produk_sample_id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  <span className={`badge ${statusColor[it.status]}`}>{statusLabel[it.status]}</span>{' '}
                  <b>{it.nama_produk}</b> — sisa {it.qty} {it.unit}
                  {it.days_to_stockout != null && <> · habis ± <b>{it.days_to_stockout} hari</b></>}
                </span>
                <Link href={`/matchmaking?produk=${it.produk_sample_id}`} className="btn-primary text-xs">
                  Cari dari Kopdes tetangga →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Produk</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Stok</th>
              <th className="px-4 py-2 text-right">Ambang</th>
              <th className="px-4 py-2 text-right">Habis (hari)</th>
              <th className="px-4 py-2 text-right">Surplus</th>
              <th className="px-4 py-2 text-right">Harga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((it) => (
              <tr key={it.produk_sample_id}>
                <td className="px-4 py-2 font-medium text-slate-800">{it.nama_produk}</td>
                <td className="px-4 py-2"><span className={`badge ${statusColor[it.status]}`}>{statusLabel[it.status]}</span></td>
                <td className="px-4 py-2 text-right font-semibold">{it.qty} <span className="text-xs text-slate-400">{it.unit}</span></td>
                <td className="px-4 py-2 text-right text-slate-500">{it.ambang_batas}</td>
                <td className="px-4 py-2 text-right">{it.days_to_stockout ?? '—'}</td>
                <td className="px-4 py-2 text-right">{it.surplus > 0 ? <span className="font-semibold text-emerald-600">+{it.surplus}</span> : '—'}</td>
                <td className="px-4 py-2 text-right text-slate-500">{rupiah(it.harga_jual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
