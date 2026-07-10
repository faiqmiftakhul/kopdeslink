import { NextRequest, NextResponse } from 'next/server';
import { getInventory } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const koperasi = req.nextUrl.searchParams.get('koperasi');
  if (!koperasi) return NextResponse.json({ error: 'param koperasi wajib' }, { status: 400 });
  try {
    return NextResponse.json({ items: await getInventory(koperasi) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
