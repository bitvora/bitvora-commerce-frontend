import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getProduct(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/product/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting product:', error);
    return [];
  }
}
