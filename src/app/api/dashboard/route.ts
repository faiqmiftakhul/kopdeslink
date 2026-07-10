import { NextResponse } from 'next/server';
import { getDashboard } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getDashboard());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
