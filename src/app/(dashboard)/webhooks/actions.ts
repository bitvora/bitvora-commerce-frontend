import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';
import { CreateWebhookType } from '@/types/webhooks';

export async function getWebhooks() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/webhook/account/${session?.activeAccount}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch webhooks');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return [];
  }
}

export async function createWebhook(payload: CreateWebhookType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/webhook',
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
      return { success: false, error: errorData.message || 'Failed to create webhook' };
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

export async function updateWebhook(id: string, payload: CreateWebhookType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/webhook/${id}`,
      {
        method: 'PUT',
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
      return { success: false, error: errorData.message || 'Failed to update webhook' };
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

export async function deleteWebhook(id: string) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/webhook/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      session
    );

    if (!response) {
      return { success: false, error: 'Session expired or unauthorized' };
    }

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to delete webhook' };
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
