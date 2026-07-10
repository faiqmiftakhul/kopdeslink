'use client';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import type { StockItem, Match } from '@/lib/types';
import { rupiah } from '@/lib/format';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

function Matchmaking() {
  const { activeKopdesRef, activeKopdes } = useApp();
  const params = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>([]);
  const [produk, setProduk] = useState<string>(params.get('produk') ?? '');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  // Muat inventaris untuk memilih produk yang mau dicari.
  useEffect(() => {
    if (!activeKopdesRef) return;
    fetch(`/api/inventory?koperasi=${activeKopdesRef}`).then((r) => r.json()).then((d) => {
      setItems(d.items ?? []);
      if (!produk && d.items?.length) {
        const kritis = d.items.find((i: StockItem) => i.status !== 'aman');
        setProduk(kritis?.produk_sample_id ?? d.items[0].produk_sample_id);
      }
    });
  }, [activeKopdesRef]); // eslint-disable-line

  const search = useCallback(async () => {
    if (!activeKopdesRef || !produk) return;
    setLoading(true); setDone(null);
    const r = await fetch(`/api/matchmaking?koperasi=${activeKopdesRef}&produk=${produk}`);
    const d = await r.json();
    setMatches(d.matches ?? []);
    setLoading(false);
  }, [activeKopdesRef, produk]);

  useEffect(() => { if (produk) search(); }, [produk, search]);

  const ajukan = async (m: Match, qty: number) => {
    setSending(m.kopdes.koperasi_ref);
    const r = await fetch('/api/requests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        koperasi_peminta_ref: activeKopdesRef,
        koperasi_pemasok_ref: m.kopdes.koperasi_ref,
        produk_sample_id: m.produk_sample_id,
        qty, harga: m.harga_jual,
      }),
    });
    const d = await r.json();
    setSending(null);
    if (d.request) setDone(`Permintaan ${d.request.id} terkirim ke ${m.kopdes.nama}. Menunggu persetujuan.`);
  };

  const markers = useMemo(() => {
    const arr: any[] = [];
    if (activeKopdes) arr.push({ lat: activeKopdes.lat, lng: activeKopdes.lng, label: `📍 ${activeKopdes.nama} (Anda)`, color: '#065366', radius: 12 });
    for (const m of matches) arr.push({ lat: m.kopdes.lat, lng: m.kopdes.lng, label: `${m.kopdes.nama} · surplus ${m.surplus} · ${m.jarak_km} km`, color: '#5faf78' });
    return arr;
  }, [activeKopdes, matches]);

  const lines = useMemo(
    () => (activeKopdes ? matches.map((m) => ({ from: [activeKopdes.lat, activeKopdes.lng] as [number, number], to: [m.kopdes.lat, m.kopdes.lng] as [number, number], label: `${m.jarak_km} km` })) : []),
    [activeKopdes, matches]
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Cari Surplus dari Kopdes Tetangga</h1>
        <p className="text-sm text-slate-500">Inti KopdesLink: menutup kekosongan stok dengan surplus koperasi terdekat.</p>
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-3">
        <label className="text-sm font-medium text-slate-600">Produk dicari:</label>
        <select value={produk} onChange={(e) => { setProduk(e.target.value); router.replace(`/matchmaking?produk=${e.target.value}`); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          {items.map((i) => <option key={i.produk_sample_id} value={i.produk_sample_id}>{i.nama_produk} (sisa {i.qty})</option>)}
        </select>
        <button onClick={search} className="btn-ghost text-sm">🔄 Cari ulang</button>
      </div>

      {done && <div className="card border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">✅ {done} <a href="/requests" className="font-semibold underline">Lihat permintaan →</a></div>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {loading && <p className="text-sm text-slate-400">Memindai Kopdes terdekat…</p>}
          {!loading && matches.length === 0 && (
            <div className="card p-4 text-sm text-slate-500">Belum ada Kopdes dengan surplus produk ini dalam radius. Coba produk lain.</div>
          )}
          {matches.map((m) => (
            <div key={m.kopdes.koperasi_ref} className="card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800">{m.kopdes.nama}</p>
                  <p className="text-xs text-slate-500">{m.kopdes.desa}, {m.kopdes.kecamatan} · <b>{m.jarak_km} km</b></p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">surplus {m.surplus} {m.unit}</p>
                  <p className="text-xs text-slate-500">{rupiah(m.harga_jual)}/{m.unit}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <QtyRequest max={m.surplus} onSubmit={(qty) => ajukan(m, qty)} busy={sending === m.kopdes.koperasi_ref} />
              </div>
            </div>
          ))}
        </div>

        <MapView markers={markers} lines={lines} height={420} />
      </div>
    </div>
  );
}

function QtyRequest({ max, onSubmit, busy }: { max: number; onSubmit: (qty: number) => void; busy: boolean }) {
  const [qty, setQty] = useState(Math.min(10, max));
  return (
    <>
      <input type="number" min={1} max={max} value={qty}
        onChange={(e) => setQty(Math.max(1, Math.min(max, Number(e.target.value))))}
        className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
      <button onClick={() => onSubmit(qty)} disabled={busy} className="btn-primary text-xs">
        {busy ? 'Mengirim…' : `Ajukan permintaan ${qty}`}
      </button>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-400">Memuat…</p>}>
      <Matchmaking />
    </Suspense>
  );
}
