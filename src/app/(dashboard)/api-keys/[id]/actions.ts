import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getAPIKey(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/api-key/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get api key');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting api key:', error);
    return [];
  }
}
