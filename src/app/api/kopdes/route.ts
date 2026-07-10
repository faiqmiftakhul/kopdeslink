import { NextResponse } from 'next/server';
import { getKopdesList, getProdukList } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [kopdes, produk] = await Promise.all([getKopdesList(), getProdukList()]);
    return NextResponse.json({ kopdes, produk });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
