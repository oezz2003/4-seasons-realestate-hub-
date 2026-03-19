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

const ADMIN_API_BASE_URL = (process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || '/api/').replace(/\/$/, '') + '/';

interface ApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Custom fetcher to replace axios instance
const fetcher = async <T>(endpoint: string, options: RequestInit = {}, params?: Record<string, any>): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Token ${token}`);
  }

  let urlString = `${ADMIN_API_BASE_URL}${endpoint.replace(/^\//, '')}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      urlString += (urlString.includes('?') ? '&' : '?') + queryString;
    }
  }

  const response = await fetch(urlString, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
};

// Properties API
export const propertiesApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Property>>('properties/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Property>(`properties/${id}/`);
  },
  create: async (data: Partial<Property>) => {
    return fetcher<Property>('properties/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Property>) => {
    return fetcher<Property>(`properties/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`properties/${id}/`, {
      method: 'DELETE',
    });
  },
  getFeatured: async () => {
    return fetcher<ApiResponse<Property>>('properties/featured/');
  },
  getNewLaunches: async () => {
    return fetcher<ApiResponse<Property>>('properties/new-launches/');
  },
};

// Compounds API
export const compoundsApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Compound>>('compounds/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Compound>(`compounds/${id}/`);
  },
  create: async (data: Partial<Compound>) => {
    return fetcher<Compound>('compounds/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Compound>) => {
    return fetcher<Compound>(`compounds/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`compounds/${id}/`, {
      method: 'DELETE',
    });
  },
  getProperties: async (id: number) => {
    return fetcher<ApiResponse<Property>>(`compounds/${id}/properties/`);
  },
};

// Developers API
export const developersApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Developer>>('developers/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Developer>(`developers/${id}/`);
  },
  create: async (data: Partial<Developer>) => {
    return fetcher<Developer>('developers/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Developer>) => {
    return fetcher<Developer>(`developers/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`developers/${id}/`, {
      method: 'DELETE',
    });
  },
  getCompounds: async (id: number) => {
    return fetcher<ApiResponse<Compound>>(`developers/${id}/compounds/`);
  },
};

// Blog Posts API
export const blogApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<BlogPost>>('blog-posts/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<BlogPost>(`blog-posts/${id}/`);
  },
  create: async (data: Partial<BlogPost>) => {
    return fetcher<BlogPost>('blog-posts/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<BlogPost>) => {
    return fetcher<BlogPost>(`blog-posts/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`blog-posts/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Locations API
export const locationsApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Location>>('locations/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Location>(`locations/${id}/`);
  },
  create: async (data: Partial<Location>) => {
    return fetcher<Location>('locations/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Location>) => {
    return fetcher<Location>(`locations/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`locations/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Amenities API
export const amenitiesApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Amenity>>('amenities/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Amenity>(`amenities/${id}/`);
  },
  create: async (data: Partial<Amenity>) => {
    return fetcher<Amenity>('amenities/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Amenity>) => {
    return fetcher<Amenity>(`amenities/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`amenities/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Authors API
export const authorsApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Author>>('authors/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Author>(`authors/${id}/`);
  },
  create: async (data: Partial<Author>) => {
    return fetcher<Author>('authors/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Author>) => {
    return fetcher<Author>(`authors/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`authors/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Partners API
export const partnersApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Partner>>('partners/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Partner>(`partners/${id}/`);
  },
  create: async (data: Partial<Partner>) => {
    return fetcher<Partner>('partners/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Partner>) => {
    return fetcher<Partner>(`partners/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`partners/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Testimonials API
export const testimonialsApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<Testimonial>>('testimonials/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<Testimonial>(`testimonials/${id}/`);
  },
  create: async (data: Partial<Testimonial>) => {
    return fetcher<Testimonial>('testimonials/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Testimonial>) => {
    return fetcher<Testimonial>(`testimonials/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return fetcher<void>(`testimonials/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Contact Submissions API
export const contactSubmissionsApi = {
  getAll: async (params?: Record<string, any>) => {
    return fetcher<ApiResponse<ContactFormSubmission>>('contact-submissions/', {}, params);
  },
  getById: async (id: number) => {
    return fetcher<ContactFormSubmission>(`contact-submissions/${id}/`);
  },
  delete: async (id: number) => {
    return fetcher<void>(`contact-submissions/${id}/`, {
      method: 'DELETE',
    });
  },
};

// File Upload API
export const uploadApi = {
  uploadImage: async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return fetcher<any>('upload/image/', {
      method: 'POST',
      body: formData,
    });
  },
  uploadMultipleImages: async (files: File[], type: string) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('image', file);
    });
    formData.append('type', type);

    return fetcher<any>('upload/image/', {
      method: 'POST',
      body: formData,
    });
  },
};

export default fetcher;
