import { NextResponse } from 'next/server';
import { getRegional } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ regional: await getRegional() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
