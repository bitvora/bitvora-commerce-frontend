import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';
import { CreateSubscriptionType } from '@/types/subscriptions';

export async function getSubscriptions() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(
      `/subscription/account/${session?.activeAccount}`,
      {},
      session
    );
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}

export async function deleteSubscription(id: string) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/subscription/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to delete subscription' };
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

export async function createSubscription(payload: CreateSubscriptionType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/subscription',
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
      return { success: false, error: errorData.message || 'Failed to create subscription' };
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

export async function updateSubscription(id: string, payload: CreateSubscriptionType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/subscription/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to update subscription' };
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
