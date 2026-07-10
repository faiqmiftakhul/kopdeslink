'use client';
import { useEffect, useState } from 'react';

// Gerbang login ringan untuk penjurian (bukan sistem keamanan produksi).
// Menyediakan "akun uji coba juri" sesuai TOR, dengan opsi lanjut sebagai tamu
// agar tidak pernah memblokir demo.
const AKUN_UJI: Record<string, string> = {
  juri: 'kopdeslink2026',
  demo: 'demo',
};

export default function AuthGate() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    setMounted(true);
    setAuthed(localStorage.getItem('kl_auth') === '1');
  }, []);

  const masuk = (asGuest = false) => {
    if (!asGuest && AKUN_UJI[u.trim().toLowerCase()] !== p) {
      setErr('Username atau password salah. Coba akun uji coba, atau lanjut sebagai tamu.');
      return;
    }
    localStorage.setItem('kl_auth', '1');
    setAuthed(true);
  };

  if (!mounted || authed) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-brand via-brand-dark to-leaf-dark p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img src="/kopdeslink_logo.png" alt="KopdesLink" className="h-16 w-auto" />
          <h1 className="mt-3 text-xl font-extrabold text-brand-dark">KopdesLink</h1>
          <p className="text-xs text-slate-500">Jaringan Pasok Gotong-Royong Antar Kopdes</p>
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => { e.preventDefault(); masuk(false); }}
        >
          <div>
            <label className="text-xs font-medium text-slate-600">Username</label>
            <input
              value={u} onChange={(e) => { setU(e.target.value); setErr(''); }}
              placeholder="juri"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Password</label>
            <input
              type="password" value={p} onChange={(e) => { setP(e.target.value); setErr(''); }}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <button type="submit" className="btn-primary w-full">Masuk</button>
          <button type="button" onClick={() => masuk(true)} className="btn-ghost w-full">
            Lanjut sebagai tamu
          </button>
        </form>

        <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-center text-xs text-brand-dark">
          Akun uji coba juri: <b>juri</b> / <b>kopdeslink2026</b>
        </p>
      </div>
    </div>
  );
}
