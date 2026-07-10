'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Kopdes, Produk, Role } from '@/lib/types';

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  kopdesList: Kopdes[];
  produkList: Produk[];
  activeKopdesRef: string;
  setActiveKopdesRef: (ref: string) => void;
  activeKopdes: Kopdes | undefined;
  loading: boolean;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('pengurus');
  const [kopdesList, setKopdesList] = useState<Kopdes[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [activeKopdesRef, setActiveRefState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('kl_role') as Role | null;
    if (savedRole) setRoleState(savedRole);
    fetch('/api/kopdes')
      .then((r) => r.json())
      .then((d) => {
        setKopdesList(d.kopdes ?? []);
        setProdukList(d.produk ?? []);
        const saved = localStorage.getItem('kl_kopdes');
        const first = d.kopdes?.[0]?.koperasi_ref ?? '';
        setActiveRefState(saved && d.kopdes?.some((k: Kopdes) => k.koperasi_ref === saved) ? saved : first);
      })
      .finally(() => setLoading(false));
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem('kl_role', r);
  }, []);

  const setActiveKopdesRef = useCallback((ref: string) => {
    setActiveRefState(ref);
    localStorage.setItem('kl_kopdes', ref);
  }, []);

  const activeKopdes = kopdesList.find((k) => k.koperasi_ref === activeKopdesRef);

  return (
    <Ctx.Provider value={{ role, setRole, kopdesList, produkList, activeKopdesRef, setActiveKopdesRef, activeKopdes, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp harus di dalam AppProvider');
  return c;
}
