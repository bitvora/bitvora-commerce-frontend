import { api_url, app_routes } from '@/lib/constants';
import { SessionPayload } from '@/lib/types';
import { redirect } from 'next/navigation';

const redirectTo = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  } else {
    redirect(path);
  }
};

const api = {
  fetch: async (url: string, options: RequestInit = {}, session?: SessionPayload) => {
    if (!session) {
      redirectTo(app_routes.home);
      return null;
    }

    const headers = {
      ...options.headers,
      'Session-ID': session.id
    };

    try {
      const response = await fetch(`${api_url}${url}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        redirectTo(app_routes.home);

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
