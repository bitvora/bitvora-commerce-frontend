import { api_url } from '@/lib/constants';
import { SessionPayload } from '@/lib/types';

const api = {
  fetch: async (url: string, options: RequestInit = {}, session?: SessionPayload) => {
    const headers = {
      ...options.headers,
      'Session-ID': session.id
    };

    try {
      const response = await fetch(`${api_url}${url}`, {
        ...options,
        headers
      });

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

export default api;
