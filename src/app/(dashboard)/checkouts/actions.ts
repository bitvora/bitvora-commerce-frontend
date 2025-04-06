import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';
import { CreateCheckoutType } from '@/types/checkout';

export async function getCheckouts() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/checkout/account/${session?.activeAccount}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch checkouts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching checkouts:', error);
    return [];
  }
}

export async function createCheckout(payload: CreateCheckoutType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/checkout',
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
      return { success: false, error: errorData.message || 'Failed to create checkout' };
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
