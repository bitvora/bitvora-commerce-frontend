import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getSubscription(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/subscription/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return [];
  }
}
