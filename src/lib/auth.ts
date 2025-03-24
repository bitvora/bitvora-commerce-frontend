import { cookies } from 'next/headers';
import { SessionPayload, User } from '@/lib/types';
import crypto from 'crypto';

const SECRET_KEY = process.env.SESSION_SECRET;
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

function decrypt(encryptedText: string): string {
  const [ivBase64, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function login({
  user,
  accessToken,
  expires
}: {
  user: User;
  accessToken: string;
  expires: Date;
}) {
  const session = JSON.stringify({ user, expires, accessToken });
  const encryptedSession = encrypt(session);

  (await cookies()).set('session', encryptedSession, { expires, httpOnly: true });
}

export async function logout() {
  (await cookies()).set('session', '', { expires: new Date(0) });
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    return JSON.parse(decrypt(session));
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}
