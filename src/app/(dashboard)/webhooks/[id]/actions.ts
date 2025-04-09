import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

export async function getWebhook(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/webhook/${id}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to get webhook');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting webhook:', error);
    return [];
  }
}

export async function getWebhookDeliveries(id: string) {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/webhook/${id}/deliveries`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch webhooks deliveries');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching webhooks deliveries:', error);
    return [];
  }
}
