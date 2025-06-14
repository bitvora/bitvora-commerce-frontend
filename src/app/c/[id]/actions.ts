import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getCheckout(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/checkout/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get checkout');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting checkout:', error);
    return [];
  }
}

export async function pollCheckout(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/c/${id}/poll`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to poll checkout');
    }

    return await response.json();
  } catch (error) {
    console.error('Error polling checkout:', error);
    return [];
  }
}

export async function subscribeCheckout(
  id: string,
  payload: {
    wallet_connect: string;
  }
) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(
      `/checkout/${id}/subscribe`,
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
      return { success: false, error: errorData.message || 'Failed to subscribe' };
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
