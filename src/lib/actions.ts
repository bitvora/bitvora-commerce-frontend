import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';
import { CreateAccountType } from '@/lib/types';

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

export async function createAccount(payload: CreateAccountType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/account',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      },
      session
    );

    if (!response) {
      return { success: false, error: 'Session expired or unauthorized' };
    }

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to create account' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong'
    };
  }
}

export async function fetchSession() {
  const response = await fetch('/api/session', { credentials: 'include' });
  const data = await response.json();

  return data.session;
}
