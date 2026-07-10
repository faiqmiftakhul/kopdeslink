import { NextRequest, NextResponse } from 'next/server';
import { listRequests, createRequest } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const koperasi = req.nextUrl.searchParams.get('koperasi') ?? undefined;
  try {
    return NextResponse.json(await listRequests(koperasi));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.koperasi_peminta_ref || !b.koperasi_pemasok_ref || !b.produk_sample_id || !b.qty) {
      return NextResponse.json({ error: 'field wajib kurang' }, { status: 400 });
    }
    const request = await createRequest({
      koperasi_peminta_ref: b.koperasi_peminta_ref,
      koperasi_pemasok_ref: b.koperasi_pemasok_ref,
      produk_sample_id: b.produk_sample_id,
      qty: Number(b.qty),
      harga: Number(b.harga ?? 0),
    });
    return NextResponse.json({ request });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
