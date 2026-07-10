'use client';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapMarker {
  lat: number; lng: number; label: string; color?: string; radius?: number;
}
export interface MapLine {
  from: [number, number]; to: [number, number]; label?: string;
}

export default function MapView({
  markers, lines = [], height = 360,
}: { markers: MapMarker[]; lines?: MapLine[]; height?: number }) {
  const pts = markers.length ? markers : [{ lat: -6.9, lng: 107.63, label: '', color: '#065366' }];
  const center: [number, number] = [
    pts.reduce((s, m) => s + m.lat, 0) / pts.length,
    pts.reduce((s, m) => s + m.lng, 0) / pts.length,
  ];

  return (
    <div style={{ height }} className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lines.map((l, i) => (
          <Polyline key={i} positions={[l.from, l.to]} pathOptions={{ color: '#065366', weight: 3, dashArray: '6 6' }}>
            {l.label && <Tooltip>{l.label}</Tooltip>}
          </Polyline>
        ))}
        {markers.map((m, i) => (
          <CircleMarker
            key={i}
            center={[m.lat, m.lng]}
            radius={m.radius ?? 10}
            pathOptions={{ color: m.color ?? '#065366', fillColor: m.color ?? '#065366', fillOpacity: 0.85, weight: 2 }}
          >
            <Tooltip direction="top">{m.label}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
