'use client';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { activeKopdes, loading } = useApp();
  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-brand via-brand to-leaf-dark p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-24 h-48 w-48 rounded-full bg-leaf/20" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Koperasi Desa Merah Putih</p>
          <h1 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight sm:text-3xl">
            KopdesLink — Jaringan Pasok Gotong-Royong Antar Kopdes
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            SIMKOPDES mencatat stok <em>satu</em> koperasi. KopdesLink menghubungkan stok
            <strong> antar </strong> koperasi — kekosongan stok satu Kopdes ditutup surplus tetangga.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/pos" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-white/90">
              Mulai dari Kasir →
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
              Lihat Dashboard Pemerintah
            </Link>
          </div>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          <Feature n="1" title="POS & Stok Real-Time" desc="Jual → stok turun otomatis. Prediksi kapan barang habis." href="/pos" cta="Buka Kasir" />
          <Feature n="2" title="Matchmaking Antar-Kopdes" desc="Stok kritis? Temukan surplus Kopdes tetangga di peta." href="/matchmaking" cta="Cari Tetangga" highlight />
          <Feature n="3" title="Dashboard Pemerintah" desc="Peta aliran barang & barang rawan kosong untuk Kementerian/Dinas." href="/dashboard" cta="Lihat Dashboard" />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="section-title">
          <span className="h-4 w-1 rounded-full bg-leaf" /> Skenario Demo (± 3 menit)
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Kopdes aktif: <strong className="text-brand-dark">{loading ? '…' : activeKopdes?.nama ?? '—'}</strong>. Ganti peran & Kopdes di kanan atas.
        </p>
        <ol className="mt-4 space-y-2.5 text-sm text-slate-700">
          <Step n={1}>Buka <b>Kasir (POS)</b> → jual <b>Beras Premium 5kg</b> beberapa kali sampai stok menembus ambang.</Step>
          <Step n={2}>Buka <b>Stok & Alert</b> → muncul peringatan “akan habis dalam ± X hari”.</Step>
          <Step n={3}>Klik <b>Cari dari Kopdes Tetangga</b> → lihat surplus Kopdes terdekat di peta, ajukan permintaan.</Step>
          <Step n={4}>Ganti Kopdes ke <b>pemasok</b> → buka <b>Permintaan</b> → <b>Setujui</b>.</Step>
          <Step n={5}>Ganti peran ke <b>Kementerian/Dinas</b> → <b>Dashboard</b> menampilkan aliran gotong-royong & dampaknya.</Step>
        </ol>
      </section>
    </div>
  );
}

function Feature({ n, title, desc, href, cta, highlight }: { n: string; title: string; desc: string; href: string; cta: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 transition hover:shadow-soft ${highlight ? 'border-leaf/50 bg-leaf-50' : 'border-slate-200'}`}>
      <div className="flex items-center gap-2">
        <span className={`grid h-6 w-6 place-items-center rounded-lg text-xs font-bold text-white ${highlight ? 'bg-leaf-dark' : 'bg-brand'}`}>{n}</span>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
      <Link href={href} className={`${highlight ? 'btn-secondary' : 'btn-primary'} mt-3 text-xs`}>{cta}</Link>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">{n}</span>
      <span>{children}</span>
    </li>
  );
}
