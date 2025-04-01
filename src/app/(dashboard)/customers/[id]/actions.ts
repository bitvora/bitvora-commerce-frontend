import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getCustomer(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/customer/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get customer');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting customer:', error);
    return [];
  }
}
