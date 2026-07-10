import { NextRequest, NextResponse } from 'next/server';
import { findMatches } from '@/lib/store';
import { MATCH_RADIUS_KM } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const koperasi = p.get('koperasi');
  const produk = p.get('produk');
  const radius = Number(p.get('radius') ?? MATCH_RADIUS_KM);
  if (!koperasi || !produk) {
    return NextResponse.json({ error: 'param koperasi & produk wajib' }, { status: 400 });
  }
  try {
    return NextResponse.json({ matches: await findMatches(koperasi, produk, radius) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
