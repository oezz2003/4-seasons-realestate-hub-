import axios from 'axios';
import {
  Property,
  Compound,
  Developer,
  BlogPost,
  Location,
  Amenity,
  Author,
  Partner,
  Testimonial,
  ContactFormSubmission
} from './types';

const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || '/api/';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

interface ApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Properties API
export const propertiesApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Property>>('properties/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Property>(`properties/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Property>) => {
    const response = await adminApi.post<Property>('properties/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Property>) => {
    const response = await adminApi.put<Property>(`properties/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`properties/${id}/`);
  },
  getFeatured: async () => {
    const response = await adminApi.get<ApiResponse<Property>>('properties/featured/');
    return response.data;
  },
  getNewLaunches: async () => {
    const response = await adminApi.get<ApiResponse<Property>>('properties/new-launches/');
    return response.data;
  },
};

// Compounds API
export const compoundsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Compound>>('compounds/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Compound>(`compounds/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Compound>) => {
    const response = await adminApi.post<Compound>('compounds/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Compound>) => {
    const response = await adminApi.put<Compound>(`compounds/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`compounds/${id}/`);
  },
  getProperties: async (id: number) => {
    const response = await adminApi.get<ApiResponse<Property>>(`compounds/${id}/properties/`);
    return response.data;
  },
};

// Developers API
export const developersApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Developer>>('developers/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Developer>(`developers/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Developer>) => {
    const response = await adminApi.post<Developer>('developers/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Developer>) => {
    const response = await adminApi.put<Developer>(`developers/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`developers/${id}/`);
  },
  getCompounds: async (id: number) => {
    const response = await adminApi.get<ApiResponse<Compound>>(`developers/${id}/compounds/`);
    return response.data;
  },
};

// Blog Posts API
export const blogApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<BlogPost>>('blog-posts/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<BlogPost>(`blog-posts/${id}/`);
    return response.data;
  },
  create: async (data: Partial<BlogPost>) => {
    const response = await adminApi.post<BlogPost>('blog-posts/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<BlogPost>) => {
    const response = await adminApi.put<BlogPost>(`blog-posts/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`blog-posts/${id}/`);
  },
};

// Locations API
export const locationsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Location>>('locations/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Location>(`locations/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Location>) => {
    const response = await adminApi.post<Location>('locations/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Location>) => {
    const response = await adminApi.put<Location>(`locations/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`locations/${id}/`);
  },
};

// Amenities API
export const amenitiesApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Amenity>>('amenities/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Amenity>(`amenities/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Amenity>) => {
    const response = await adminApi.post<Amenity>('amenities/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Amenity>) => {
    const response = await adminApi.put<Amenity>(`amenities/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`amenities/${id}/`);
  },
};

// Authors API
export const authorsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Author>>('authors/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Author>(`authors/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Author>) => {
    const response = await adminApi.post<Author>('authors/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Author>) => {
    const response = await adminApi.put<Author>(`authors/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`authors/${id}/`);
  },
};

// Partners API
export const partnersApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Partner>>('partners/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Partner>(`partners/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Partner>) => {
    const response = await adminApi.post<Partner>('partners/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Partner>) => {
    const response = await adminApi.put<Partner>(`partners/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`partners/${id}/`);
  },
};

// Testimonials API
export const testimonialsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<Testimonial>>('testimonials/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<Testimonial>(`testimonials/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Testimonial>) => {
    const response = await adminApi.post<Testimonial>('testimonials/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Testimonial>) => {
    const response = await adminApi.put<Testimonial>(`testimonials/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`testimonials/${id}/`);
  },
};

// Contact Submissions API
export const contactSubmissionsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await adminApi.get<ApiResponse<ContactFormSubmission>>('contact-submissions/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await adminApi.get<ContactFormSubmission>(`contact-submissions/${id}/`);
    return response.data;
  },
  delete: async (id: number) => {
    await adminApi.delete(`contact-submissions/${id}/`);
  },
};

// File Upload API
export const uploadApi = {
  uploadImage: async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await adminApi.post('/upload/image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadMultipleImages: async (files: File[], type: string) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('image', file);
    });
    formData.append('type', type);

    const response = await adminApi.post('/upload/image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default adminApi;

