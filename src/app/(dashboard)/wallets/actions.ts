import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function connectWallet(payload: { account_id: string; wallet_connect: string }) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/wallet',
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
      return { success: false, error: errorData.message || 'Failed to connect wallet' };
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

export async function withdrawBitcoin(payload: {
  account_id: string;
  recipient: string;
  amount: number;
}) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/wallet/withdraw',
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
      return { success: false, error: errorData.message || 'Failed to withdraw' };
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

export async function getWalletTransactions({
  account_id,
  limit,
  offset
}: {
  account_id: string;
  limit: number;
  offset: number;
}) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/wallet/transactions?account_id=${account_id}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
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
      return { success: false, error: errorData.message || 'Failed to get wallet transactions' };
    }

    const data = await response.json();

    return { success: true, data: data?.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong'
    };
  }
}
