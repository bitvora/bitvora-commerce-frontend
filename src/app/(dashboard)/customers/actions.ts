import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';
import { CreateProductType, UpdateProductType } from '@/lib/types';
import { CreateCustomerType } from '@/types/customers';

export async function getCustomers() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/customer/account/${session?.activeAccount}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function createCustomer(payload: CreateCustomerType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/customer',
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
      return { success: false, error: errorData.message || 'Failed to create customer' };
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

export async function updateCustomer(id: string, payload: CreateCustomerType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/customer/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to update customer' };
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

export async function deleteCustomer(id: string) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/customer/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to delete customer' };
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
