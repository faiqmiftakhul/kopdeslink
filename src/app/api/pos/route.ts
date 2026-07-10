import { NextRequest, NextResponse } from 'next/server';
import { recordSale } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { koperasi, produk, qty } = await req.json();
    if (!koperasi || !produk || !qty) {
      return NextResponse.json({ error: 'koperasi, produk, qty wajib' }, { status: 400 });
    }
    const item = await recordSale(koperasi, produk, Number(qty));
    return NextResponse.json({ item });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
