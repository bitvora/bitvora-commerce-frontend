import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    await login(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: 'Failed to set session' }, { status: 500 });
  }
}
