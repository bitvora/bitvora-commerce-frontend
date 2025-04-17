import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getPaymentLinkDetails(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/l/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get payment link detail');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment link detail:', error);
    return [];
  }
}
