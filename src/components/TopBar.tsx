'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const pengurusNav = [
  { href: '/', label: 'Beranda' },
  { href: '/pos', label: 'Kasir (POS)' },
  { href: '/inventory', label: 'Stok & Alert' },
  { href: '/matchmaking', label: 'Cari Tetangga' },
  { href: '/requests', label: 'Permintaan' },
];
const pemerintahNav = [
  { href: '/', label: 'Beranda' },
  { href: '/dashboard', label: 'Dashboard Pemerintah' },
];

export default function TopBar() {
  const { role, setRole, kopdesList, activeKopdesRef, setActiveKopdesRef } = useApp();
  const path = usePathname();
  const nav = role === 'pengurus' ? pengurusNav : pemerintahNav;

  return (
    <header className="sticky top-0 z-20 border-b border-brand/10 bg-white/85 backdrop-blur-md">
      <div className="h-1 w-full bg-gradient-to-r from-brand via-brand-light to-leaf" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/kopdeslink_logo.png" alt="KopdesLink" className="h-9 w-auto" />
            <span className="hidden leading-tight sm:block">
              <span className="block font-extrabold text-brand-dark">KopdesLink</span>
              <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Jaringan Pasok Antar Kopdes
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {role === 'pengurus' && (
              <select
                value={activeKopdesRef}
                onChange={(e) => setActiveKopdesRef(e.target.value)}
                className="max-w-[210px] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                title="Kopdes aktif"
              >
                {kopdesList.map((k) => (
                  <option key={k.koperasi_ref} value={k.koperasi_ref}>{k.nama}</option>
                ))}
              </select>
            )}
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setRole('pengurus')}
                className={`rounded-md px-2.5 py-1 transition ${role === 'pengurus' ? 'bg-brand text-white shadow-sm' : 'text-slate-500 hover:text-brand-dark'}`}
              >Pengurus</button>
              <button
                onClick={() => setRole('pemerintah')}
                className={`rounded-md px-2.5 py-1 transition ${role === 'pemerintah' ? 'bg-leaf-dark text-white shadow-sm' : 'text-slate-500 hover:text-brand-dark'}`}
              >Agrinas/Dinas</button>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-2">
          {nav.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active ? 'bg-brand/10 text-brand-dark' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >{n.label}</Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
