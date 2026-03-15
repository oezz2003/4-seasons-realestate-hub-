import axios from 'axios';

const API_BASE_URL = '/api/';

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

// Create axios instance for auth
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Auth API functions
export const authApiFunctions = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await authApi.post<LoginResponse>('auth/login/', credentials);

      // Store token
      tokenStorage.set(response.data.token);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.message || 'Login failed';
        throw new Error(message);
      }
      throw new Error('An unexpected error occurred');
    }
  },

  logout: (): void => {
    tokenStorage.remove();
  },

  verifyToken: async (token: string): Promise<User> => {
    try {
      const response = await authApi.get<User>('auth/me/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          tokenStorage.remove();
          throw new Error('Token expired or invalid');
        }
        const message = error.response?.data?.detail || error.message || 'Token verification failed';
        throw new Error(message);
      }
      throw new Error('An unexpected error occurred');
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

// Set up axios interceptor to include token in requests
authApi.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up axios interceptor to handle 401 responses
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.remove();
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;

