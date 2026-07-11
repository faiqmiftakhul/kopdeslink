'use client';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { DashboardData, RegionalItem } from '@/lib/types';
import { rupiah, rupiahShort } from '@/lib/format';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [regional, setRegional] = useState<RegionalItem[]>([]);

  useEffect(() => {
    const load = () => fetch('/api/dashboard').then((r) => r.json()).then(setData);
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch('/api/regional').then((r) => r.json()).then((d) => setRegional(d.regional ?? []));
  }, []);

  const regionalMarkers = useMemo(() => {
    if (!regional.length) return [];
    const maxK = Math.max(...regional.map((r) => r.kritis_count));
    return regional.map((r) => {
      // skala akar agar outlier (mis. 1 provinsi sangat tinggi) tak mendominasi peta
      const ratio = Math.sqrt(r.kritis_count / (maxK || 1));
      const color = ratio > 0.66 ? '#b91c1c' : ratio > 0.4 ? '#ef4444' : '#f59e0b';
      return {
        lat: r.lat, lng: r.lng, color, radius: 6 + Math.round(ratio * 16),
        label: `${r.wilayah}: ${r.top_produk} (${r.kritis_count} item kritis)`,
      };
    });
  }, [regional]);

  const markers = useMemo(() => {
    if (!data) return [];
    return data.kopdes.map((k) => ({ lat: k.lat, lng: k.lng, label: k.nama, color: '#64748b', radius: 7 }));
  }, [data]);

  const lines = useMemo(() => {
    if (!data) return [];
    return data.aliran.map((a) => ({
      from: [a.dari.lat, a.dari.lng] as [number, number],
      to: [a.ke.lat, a.ke.lng] as [number, number],
      label: `${a.dari.nama} → ${a.ke.nama}: ${a.qty}× ${a.nama_produk}`,
    }));
  }, [data]);

  if (!data) return <p className="text-sm text-slate-400">Memuat dashboard…</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Dashboard Pemerintah (Kementerian / Dinas Koperasi)</h1>
        <p className="text-sm text-slate-500">Visibilitas rantai pasok antar-desa yang tidak ada di SIMKOPDES.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Kopdes terhubung" value={String(data.total_kopdes)} accent="brand" />
        <Stat label="Transaksi gotong-royong" value={String(data.request_disetujui)} accent="leaf" sub={`${data.total_request} total permintaan`} />
        <Stat label="Omzet terselamatkan" value={rupiahShort(data.omzet_terselamatkan)} accent="leaf" sub={rupiah(data.omzet_terselamatkan)} />
        <Stat label="Biaya logistik terpangkas" value={rupiahShort(data.biaya_logistik_terpangkas)} accent="brand" sub="estimasi vs distributor pusat" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-1">
          <h2 className="section-title"><span className="h-4 w-1 rounded-full bg-brand" /> Barang Paling Rawan Kosong</h2>
          <p className="mb-2 mt-1 text-xs text-slate-400">Jumlah Kopdes berstatus kritis</p>
          <div className="space-y-2">
            {data.barang_rawan_kosong.length === 0 && <p className="text-sm text-slate-400">Tidak ada barang kritis. 🎉</p>}
            {data.barang_rawan_kosong.map((b, i) => {
              const max = data.barang_rawan_kosong[0]?.jumlah_kopdes_kritis || 1;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{b.nama_produk}</span>
                    <span className="text-slate-500">{b.jumlah_kopdes_kritis}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-red-500" style={{ width: `${(b.jumlah_kopdes_kritis / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <h2 className="mb-2 section-title"><span className="h-4 w-1 rounded-full bg-leaf" /> Peta Aliran Barang Antar-Desa</h2>
          <MapView markers={markers} lines={lines} height={380} />
          <p className="mt-2 text-xs text-slate-400">Garis putus-putus = transaksi B2B gotong-royong yang telah disetujui.</p>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="section-title"><span className="h-4 w-1 rounded-full bg-red-500" /> Peta Sebaran Barang Rawan Kosong (Nasional)</h2>
        <p className="mb-3 mt-1 text-xs text-slate-400">Ukuran &amp; warna titik menunjukkan tingkat kekosongan stok per wilayah. Arahkan kursor untuk melihat barang paling kosong di tiap provinsi.</p>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MapView markers={regionalMarkers} height={440} zoom={5} center={[-2.5, 118]} />
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full" style={{ background: '#b91c1c' }} /> Paling rawan</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full" style={{ background: '#ef4444' }} /> Sedang</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full" style={{ background: '#f59e0b' }} /> Ringan</span>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-slate-700">Wilayah paling rawan</h3>
            <div className="space-y-1.5">
              {regional.slice(0, 8).map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 text-sm">
                  <span className="text-slate-700">{r.wilayah}</span>
                  <span className="text-right text-xs text-slate-500">{r.top_produk}<br /><b className="text-red-600">{r.kritis_count} kritis</b></span>
                </div>
              ))}
              {regional.length === 0 && <p className="text-sm text-slate-400">Memuat data wilayah…</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: 'brand' | 'leaf' }) {
  const tint = accent === 'leaf' ? 'border-leaf/40 bg-leaf-50' : accent === 'brand' ? 'border-brand/20 bg-brand-50' : '';
  const text = accent === 'leaf' ? 'text-leaf-dark' : accent === 'brand' ? 'text-brand' : 'text-slate-800';
  const bar = accent === 'leaf' ? 'bg-leaf' : 'bg-brand';
  return (
    <div className={`card relative overflow-hidden p-4 ${tint}`}>
      <span className={`absolute left-0 top-0 h-full w-1 ${bar}`} />
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${text}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
