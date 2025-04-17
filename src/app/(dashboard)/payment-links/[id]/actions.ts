import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getPaymentLink(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/payment-link/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get payment link');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment link:', error);
    return [];
  }
}
