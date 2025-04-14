import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';
import { CreatePaymentLinkType } from '@/types/payment-links';

export async function getPaymentLinks() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(
      `/payment-link/account/${session?.activeAccount}`,
      {},
      session
    );
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch payment links');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment links:', error);
    return [];
  }
}

export async function createPaymentLink(payload: CreatePaymentLinkType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/payment-link',
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
      return { success: false, error: errorData.message || 'Failed to create payment links' };
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

export async function updatePaymentLink(id: string, payload: CreatePaymentLinkType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/payment-link/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to update payment link' };
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

export async function deletePaymentLink(id: string) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/payment-link/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to delete payment link' };
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
