'use server';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function getSessionFromServer() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    return await decrypt(sessionCookie);
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}
