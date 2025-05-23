import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';
import { CreateProductType, UpdateProductType } from '@/lib/types';

export async function getProducts() {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/product/account/${session?.activeAccount}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function createProduct(payload: CreateProductType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      '/product',
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
      return { success: false, error: errorData.message || 'Failed to create product' };
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

export async function updateProduct(id: string, payload: UpdateProductType) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/product/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to update product' };
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

export async function deleteProduct(id: string) {
  try {
    const session = await getSessionFromServer();

    const response = await api.fetch(
      `/product/${id}`,
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
      return { success: false, error: errorData.message || 'Failed to delete product' };
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
