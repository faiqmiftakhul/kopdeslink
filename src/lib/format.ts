// Util format aman-untuk-klien (tanpa 'server-only').
export const rupiah = (n: number) =>
  'Rp' + Math.round(n).toLocaleString('id-ID');

export const rupiahShort = (n: number) => {
  if (n >= 1_000_000_000) return 'Rp' + (n / 1_000_000_000).toFixed(1) + ' M';
  if (n >= 1_000_000) return 'Rp' + (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return 'Rp' + (n / 1_000).toFixed(0) + ' rb';
  return 'Rp' + n;
};

export const statusColor: Record<string, string> = {
  kritis: 'bg-red-100 text-red-700 border-red-300',
  menipis: 'bg-amber-100 text-amber-700 border-amber-300',
  aman: 'bg-emerald-100 text-emerald-700 border-emerald-300',
};

export const statusLabel: Record<string, string> = {
  kritis: 'Kritis', menipis: 'Menipis', aman: 'Aman',
};
