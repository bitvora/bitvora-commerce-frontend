'use server';

import { cookies } from 'next/headers';
import { SessionPayload } from '@/lib/types';

const SECRET_KEY = process.env.SESSION_SECRET!;
const IV_LENGTH = 16;

async function getKey() {
  const keyData = new TextEncoder().encode(SECRET_KEY);
  return await crypto.subtle.importKey('raw', keyData, { name: 'AES-CBC' }, false, [
    'encrypt',
    'decrypt'
  ]);
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  const text = JSON.stringify(payload);

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await getKey();

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    new TextEncoder().encode(text)
  );

  return `${Buffer.from(iv).toString('base64')}:${Buffer.from(encrypted).toString('base64')}`;
}

export async function decrypt(encryptedText: string): Promise<SessionPayload> {
  const [ivBase64, encryptedBase64] = encryptedText.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  const key = await getKey();

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encrypted);
  const decryptedPayload = new TextDecoder().decode(decrypted);

  return decryptedPayload ? JSON.parse(decryptedPayload) : ({} as SessionPayload);
}

export async function login(payload: SessionPayload) {
  const encryptedSession = await encrypt(payload);

  (await cookies()).set('session', encryptedSession, { httpOnly: true });
}

export async function logout() {
  (await cookies()).delete('session');
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    return await decrypt(session);
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

export async function setActiveAccount(accountId: string) {
  const session = await getSession();
  if (!session) return;

  session.activeAccount = accountId;
  const updatedSession = await encrypt(session);

  (await cookies()).set('session', updatedSession, {
    httpOnly: true
  });
}
