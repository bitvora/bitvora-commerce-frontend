import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getCheckout(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/c/${id}`, {}, session);
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
    const response = await api.fetch(`/checkout/${id}/poll`, {}, session);
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
