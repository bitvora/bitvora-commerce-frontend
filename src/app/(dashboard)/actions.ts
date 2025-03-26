import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getAccounts() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch('/account', {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
}

export async function fetchSession() {
  const response = await fetch('/api/session', { credentials: 'include' });
  const data = await response.json();

  return data.session;
}
