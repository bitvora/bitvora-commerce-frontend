import { app_routes } from '@/lib/constants';
import { NextRouter } from 'next/router';

async function getSessionFromServer() {
  try {
    const response = await fetch('/api/session', { credentials: 'include' });
    if (!response.ok) throw new Error('Session fetch failed');

    const data = await response.json();
    return data.session;
  } catch (error) {
    console.error('Failed to fetch session:', error);
    return null;
  }
}

// API utility for authenticated requests
const api = {
  fetch: async (url: string, options: RequestInit = {}, router: NextRouter | null = null) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';
    const session = await getSessionFromServer();

    if (!session && router) {
      router.push('/login');
      return null;
    }

    const headers = {
      ...options.headers,
      'Session-ID': session ? JSON.stringify(session) : ''
    };

    try {
      const response = await fetch(`${apiUrl}${url}`, {
        ...options,
        headers
      });

      // Handle authentication errors
      if (response.status === 401 && router) {
        localStorage.removeItem('session_id');
        router.push(app_routes.login);
        return null;
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

export default api;
