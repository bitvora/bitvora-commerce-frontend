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
