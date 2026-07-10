import { NextRequest, NextResponse } from 'next/server';
import { decideRequest } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'id & action(approve|reject) wajib' }, { status: 400 });
    }
    const request = await decideRequest(id, action);
    return NextResponse.json({ request });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
