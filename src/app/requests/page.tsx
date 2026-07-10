'use client';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { RequestB2B } from '@/lib/types';
import { rupiah } from '@/lib/format';

const statusBadge: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-300',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  rejected: 'bg-slate-100 text-slate-500 border-slate-300',
};

export default function RequestsPage() {
  const { activeKopdesRef, activeKopdes } = useApp();
  const [incoming, setIncoming] = useState<RequestB2B[]>([]);
  const [outgoing, setOutgoing] = useState<RequestB2B[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activeKopdesRef) return;
    const r = await fetch(`/api/requests?koperasi=${activeKopdesRef}`);
    const d = await r.json();
    setIncoming(d.incoming ?? []);
    setOutgoing(d.outgoing ?? []);
  }, [activeKopdesRef]);

  useEffect(() => {
    load();
    const t = setInterval(load, 3000); // notifikasi real-time (polling)
    return () => clearInterval(t);
  }, [load]);

  const decide = async (id: string, action: 'approve' | 'reject') => {
    setBusy(id);
    await fetch('/api/requests/decide', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    setBusy(null);
    await load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Permintaan B2B Antar-Kopdes</h1>
        <p className="text-sm text-slate-500">{activeKopdes?.nama} — sebagai <b>pemasok</b> (masuk) & <b>peminta</b> (keluar).</p>
      </div>

      <section>
        <h2 className="mb-2 flex items-center gap-2 font-bold text-slate-700">
          📥 Permintaan Masuk
          {incoming.filter((r) => r.status === 'pending').length > 0 && (
            <span className="badge bg-red-100 text-red-700 border-red-300">
              {incoming.filter((r) => r.status === 'pending').length} baru
            </span>
          )}
        </h2>
        <div className="space-y-2">
          {incoming.length === 0 && <p className="text-sm text-slate-400">Belum ada permintaan masuk.</p>}
          {incoming.map((r) => (
            <div key={r.id} className="card flex flex-wrap items-center justify-between gap-3 p-3">
              <div>
                <p className="text-sm"><b>{r.peminta_nama}</b> meminta <b>{r.qty}× {r.nama_produk}</b></p>
                <p className="text-xs text-slate-500">{r.id} · {rupiah(r.qty * r.harga)} · <span className={`badge ${statusBadge[r.status]}`}>{r.status}</span></p>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => decide(r.id, 'approve')} disabled={busy === r.id} className="btn-primary text-xs">Setujui</button>
                  <button onClick={() => decide(r.id, 'reject')} disabled={busy === r.id} className="btn-ghost text-xs">Tolak</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-bold text-slate-700">📤 Permintaan Keluar</h2>
        <div className="space-y-2">
          {outgoing.length === 0 && <p className="text-sm text-slate-400">Belum ada permintaan keluar.</p>}
          {outgoing.map((r) => (
            <div key={r.id} className="card flex items-center justify-between gap-3 p-3">
              <div>
                <p className="text-sm">Ke <b>{r.pemasok_nama}</b>: <b>{r.qty}× {r.nama_produk}</b></p>
                <p className="text-xs text-slate-500">{r.id} · {rupiah(r.qty * r.harga)}</p>
              </div>
              <span className={`badge ${statusBadge[r.status]}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
