import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import TopBar from '@/components/TopBar';
import RegisterSW from '@/components/RegisterSW';
import AuthGate from '@/components/AuthGate';

export const metadata: Metadata = {
  title: 'KopdesLink — Jaringan Pasok Antar Kopdes',
  description: 'Stok real-time & matchmaking gotong-royong antar Koperasi Desa Merah Putih',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/kopdeslink_logo.png', shortcut: '/kopdeslink_logo.png', apple: '/kopdeslink_logo.png' },
};

export const viewport: Viewport = {
  themeColor: '#065366',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AppProvider>
          <RegisterSW />
          <AuthGate />
          <TopBar />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
