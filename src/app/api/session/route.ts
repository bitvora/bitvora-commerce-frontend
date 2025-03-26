import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ session: null }, { status: 401 });
  }

  try {
    const session = await decrypt(sessionCookie);

    return NextResponse.json({ session });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ session: null }, { status: 401 });
  }
}
