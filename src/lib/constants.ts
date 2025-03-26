export const app_routes = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  forgot_password: '/auth/forgot-password',
  dashboard: '/dashboard'
};

export const api_url = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';
