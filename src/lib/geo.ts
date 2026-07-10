// Utilitas geospasial ringan — cukup untuk radius "Kopdes tetangga".
// PostGIS kemungkinan tak bisa dipasang di DB bersama (tanpa superuser),
// jadi jarak dihitung dengan rumus Haversine.

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371; // radius bumi (km)
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// `koordinat_dibulatkan` di data sumber berupa string "lat, long".
// Kembalikan [lat, lng] atau null bila tak bisa di-parse.
export function parseKoordinat(raw: unknown): [number, number] | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  const m = s.match(/(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return [lat, lng];
}
