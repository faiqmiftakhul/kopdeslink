'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import type { StockItem } from '@/lib/types';
import { rupiah, statusColor, statusLabel } from '@/lib/format';

export default function PosPage() {
  const { activeKopdesRef, activeKopdes } = useApp();
  const [items, setItems] = useState<StockItem[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ item: StockItem } | null>(null);

  const load = useCallback(async () => {
    if (!activeKopdesRef) return;
    const r = await fetch(`/api/inventory?koperasi=${activeKopdesRef}`);
    const d = await r.json();
    setItems(d.items ?? []);
  }, [activeKopdesRef]);

  useEffect(() => { load(); }, [load]);

  const sell = async (it: StockItem, qty: number) => {
    setBusy(it.produk_sample_id);
    const r = await fetch('/api/pos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ koperasi: activeKopdesRef, produk: it.produk_sample_id, qty }),
    });
    const d = await r.json();
    setBusy(null);
    if (d.item) { setFlash({ item: d.item }); await load(); }
  };

  const filtered = useMemo(
    () => items.filter((i) => i.nama_produk.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Kasir (POS)</h1>
          <p className="text-sm text-slate-500">{activeKopdes?.nama} — setiap penjualan mengurangi stok secara real-time.</p>
        </div>
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Cari produk…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {flash && (
        <div className="card flex items-center justify-between gap-3 border-emerald-300 bg-emerald-50 p-3 text-sm">
          <span>
            ✅ Terjual <b>{flash.item.nama_produk}</b>. Sisa stok: <b>{flash.item.qty} {flash.item.unit}</b>
            {flash.item.status !== 'aman' && flash.item.days_to_stockout != null && (
              <> — <span className="font-semibold text-red-600">prediksi habis ± {flash.item.days_to_stockout} hari!</span></>
            )}
          </span>
          {flash.item.status !== 'aman' && (
            <Link href={`/matchmaking?produk=${flash.item.produk_sample_id}`} className="btn-primary text-xs shrink-0">
              Cari dari tetangga →
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((it) => (
          <div key={it.produk_sample_id} className="card flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-slate-800">{it.nama_produk}</p>
                <span className={`badge ${statusColor[it.status]}`}>{statusLabel[it.status]}</span>
              </div>
              <p className="text-xs text-slate-500">
                {rupiah(it.harga_jual)} · stok <b>{it.qty}</b> {it.unit}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {[1, 5].map((n) => (
                <button
                  key={n} disabled={busy === it.produk_sample_id || it.qty < n}
                  onClick={() => sell(it, n)}
                  className="btn-ghost px-3 py-1.5 text-xs"
                >+{n} jual</button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-400">Tidak ada produk.</p>}
      </div>
    </div>
  );
}
