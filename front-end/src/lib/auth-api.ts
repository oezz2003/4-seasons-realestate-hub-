export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

const API_BASE_URL = '/api/';

// Token storage utilities
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  },
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
  },
};

// Helper for auth requests
const authFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint.replace(/^\//, '')}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.remove();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || errorData.error || `Auth error: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
};

// Auth API functions
export const authApiFunctions = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const data = await authFetch<LoginResponse>('auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Store token
      tokenStorage.set(data.token);

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  },

  logout: (): void => {
    tokenStorage.remove();
  },

  verifyToken: async (token: string): Promise<User> => {
    try {
      return await authFetch<User>('auth/me/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        tokenStorage.remove();
        throw new Error('Token expired or invalid');
      }
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = tokenStorage.get();
    if (!token) return null;

    try {
      return await authApiFunctions.verifyToken(token);
    } catch (error) {
      return null;
    }
  },
};

export default authFetch;
