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

export async function updateAccount(id: string, payload: CreateAccountType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/account/${id}`,
      {
        method: 'PUT',
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
      return { success: false, error: errorData.message || 'Failed to update account' };
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

export async function getWallets() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/wallet/account/${session?.activeAccount}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch wallets');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return [];
  }
}

export async function deleteAccount(id: string) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/account/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      session
    );

    if (!response) {
      return { success: false, error: 'Session expired or unauthorized' };
    }

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to delete account' };
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

export async function getAccount(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/account/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting account:', error);
    return [];
  }
}

export async function getBalance(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/wallet/balance?account_id=${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch wallet balance');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return [];
  }
}