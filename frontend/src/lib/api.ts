import { useAuthStore } from '../store/authStore';

export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const { session } = useAuthStore.getState();
  const token = session?.access_token;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure Content-Type is set for POST/PUT requests if not already present
  if ((options.method === 'POST' || options.method === 'PUT') && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};
