import { BlogPost, Author, Amenity, Location, Developer, Compound, Property, PropertyImage, Partner, Testimonial, ContactFormSubmission } from './types';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser uses relative path
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://127.0.0.1:3000'; // Fallback for local SSR
};

const API_BASE_URL = `${getBaseUrl()}/api/`;
const ADMIN_API_BASE_URL = `${getBaseUrl()}/api/`;

// Token storage utility
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

interface ApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Filter interfaces
interface PropertyFilters {
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  compound?: string | number;
  developer?: string | number;
  is_featured?: boolean;
  is_new_launch?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

interface CompoundFilters {
  developer?: string | number;
  location?: string | number;
  search?: string;
  page?: number;
  page_size?: number;
}

interface DeveloperFilters {
  search?: string;
  page?: number;
  page_size?: number;
}

interface BlogPostFilters {
  author?: string | number;
  status?: 'Published' | 'Draft';
  search?: string;
  page?: number;
  page_size?: number;
}

export interface BlogPostInput extends Partial<Omit<BlogPost, 'author'>> {
  author?: number | null;
}

interface TestimonialFilters {
  page?: number;
  page_size?: number;
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
  return response.json();
}

export async function fetchApiWithParams<T>(endpoint: string, params?: Record<string, any>, baseURL?: string): Promise<ApiResponse<T>> {
  try {
    const base = (baseURL || API_BASE_URL).replace(/\/$/, '');
    const absoluteBase = base.startsWith('http') ? base : (typeof window !== 'undefined' ? window.location.origin + (base.startsWith('/') ? '' : '/') + base : base);
    const url = new URL(endpoint.replace(/^\//, ''), absoluteBase.endsWith('/') ? absoluteBase : absoluteBase + '/');
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available (for admin calls)
    const token = getAuthToken();
    if (token && (url.toString().includes('/admin/') || url.toString().includes(ADMIN_API_BASE_URL))) {
      headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(url.toString(), {
      headers,
      // Next.js 15 cache settings (default is no-store in dev, but helps in prod)
      next: { revalidate: 60 } 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

async function genericFetch<T>(url: string, method: string = 'GET', data?: any): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token && (url.includes('/admin/') || url.includes(ADMIN_API_BASE_URL))) {
    headers['Authorization'] = `Token ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    cache: 'no-store', // Ensure fresh data for mutations and specific gets
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  if (method === 'DELETE') return {} as T;
  return response.json();
}

// ===== PROPERTIES API =====
export async function getProperties(filters?: PropertyFilters, useAdminApi: boolean = false): Promise<ApiResponse<Property>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.location) params.location = filters.location;
    if (filters?.property_type) params.property_type = filters.property_type;
    if (filters?.min_price) params.min_price = filters.min_price;
    if (filters?.max_price) params.max_price = filters.max_price;
    if (filters?.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters?.bathrooms) params.bathrooms = filters.bathrooms;
    if (filters?.compound) params.compound = filters.compound;
    if (filters?.developer) params.developer = filters.developer;
    if (filters?.is_featured !== undefined) params.is_featured = filters.is_featured;
    if (filters?.is_new_launch !== undefined) params.is_new_launch = filters.is_new_launch;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    const baseUrl = useAdminApi ? ADMIN_API_BASE_URL : API_BASE_URL;
    return await fetchApiWithParams<Property>('properties/', params, baseUrl);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getAdminProperties(filters?: PropertyFilters): Promise<ApiResponse<Property>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.location) params.location = filters.location;
    if (filters?.property_type) params.property_type = filters.property_type;
    if (filters?.min_price) params.min_price = filters.min_price;
    if (filters?.max_price) params.max_price = filters.max_price;
    if (filters?.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters?.bathrooms) params.bathrooms = filters.bathrooms;
    if (filters?.compound) params.compound = filters.compound;
    if (filters?.developer) params.developer = filters.developer;
    if (filters?.is_featured !== undefined) params.is_featured = filters.is_featured;
    if (filters?.is_new_launch !== undefined) params.is_new_launch = filters.is_new_launch;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    return await fetchApiWithParams<Property>('properties/', params, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    return await genericFetch<Property>(`${API_BASE_URL}properties/${id}/`);
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    return null;
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const data = await fetchApiWithParams<Property>('properties/', { slug });
    return data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error fetching property by slug:', error);
    return null;
  }
}

export async function createProperty(data: Partial<Property>): Promise<Property> {
  try {
    return await genericFetch<Property>(`${ADMIN_API_BASE_URL}properties/`, 'POST', data);
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

export async function updateProperty(id: number, data: Partial<Property>): Promise<Property> {
  try {
    return await genericFetch<Property>(`${ADMIN_API_BASE_URL}properties/${id}/`, 'PUT', data);
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

export async function deleteProperty(id: number): Promise<void> {
  try {
    await genericFetch(`${ADMIN_API_BASE_URL}properties/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}

export async function getFeaturedProperties(): Promise<ApiResponse<Property>> {
  try {
    return await fetchApiWithParams<Property>('properties/', { is_featured: true }, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getNewLaunches(): Promise<ApiResponse<Property>> {
  try {
    return await fetchApiWithParams<Property>('properties/', { is_new_launch: true }, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching new launches:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

// ===== COMPOUNDS API =====
export async function getCompounds(filters?: CompoundFilters, useAdminApi: boolean = false): Promise<ApiResponse<Compound>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.developer) params.developer = filters.developer;
    if (filters?.location) params.location = filters.location;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    const baseUrl = useAdminApi ? ADMIN_API_BASE_URL : API_BASE_URL;
    return await fetchApiWithParams<Compound>('compounds/', params, baseUrl);
  } catch (error) {
    console.error('Error fetching compounds:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getAdminCompounds(filters?: CompoundFilters): Promise<ApiResponse<Compound>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.developer) params.developer = filters.developer;
    if (filters?.location) params.location = filters.location;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    return await fetchApiWithParams<Compound>('compounds/', params, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching admin compounds:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getCompoundById(id: string): Promise<Compound | null> {
  try {
    return await genericFetch<Compound>(`${API_BASE_URL}compounds/${id}/`);
  } catch (error) {
    console.error('Error fetching compound by ID:', error);
    return null;
  }
}

export async function getAdminCompoundById(id: string): Promise<Compound | null> {
  try {
    return await genericFetch<Compound>(`${ADMIN_API_BASE_URL}compounds/${id}/`);
  } catch (error) {
    console.error('Error fetching admin compound by ID:', error);
    return null;
  }
}

export async function getCompoundBySlug(slug: string): Promise<Compound | null> {
  try {
    const data = await fetchApiWithParams<Compound>('compounds/', { slug });
    return data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error fetching compound by slug:', error);
    return null;
  }
}

export async function createCompound(data: Partial<Compound>): Promise<Compound> {
  try {
    return await genericFetch<Compound>(`${ADMIN_API_BASE_URL}compounds/`, 'POST', data);
  } catch (error) {
    console.error('Error creating compound:', error);
    throw error;
  }
}

export async function updateCompound(id: number, data: Partial<Compound>): Promise<Compound> {
  try {
    return await genericFetch<Compound>(`${ADMIN_API_BASE_URL}compounds/${id}/`, 'PUT', data);
  } catch (error) {
    console.error('Error updating compound:', error);
    throw error;
  }
}

export async function deleteCompound(id: number): Promise<void> {
  try {
    await genericFetch(`${ADMIN_API_BASE_URL}compounds/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error deleting compound:', error);
    throw error;
  }
}

// ===== DEVELOPERS API =====
export async function getDevelopers(filters?: DeveloperFilters, useAdminApi: boolean = false): Promise<ApiResponse<Developer>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    const baseUrl = useAdminApi ? ADMIN_API_BASE_URL : API_BASE_URL;
    return await fetchApiWithParams<Developer>('developers/', params, baseUrl);
  } catch (error) {
    console.error('Error fetching developers:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getAdminDevelopers(filters?: DeveloperFilters): Promise<ApiResponse<Developer>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    return await fetchApiWithParams<Developer>('developers/', params, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching admin developers:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getDeveloperById(id: string): Promise<Developer | null> {
  try {
    return await genericFetch<Developer>(`${API_BASE_URL}developers/${id}/`);
  } catch (error) {
    console.error('Error fetching developer by ID:', error);
    return null;
  }
}

export async function getAdminDeveloperById(id: string): Promise<Developer | null> {
  try {
    return await genericFetch<Developer>(`${ADMIN_API_BASE_URL}developers/${id}/`);
  } catch (error) {
    console.error('Error fetching admin developer by ID:', error);
    return null;
  }
}

export async function getDeveloperBySlug(slug: string): Promise<Developer | null> {
  try {
    const data = await fetchApiWithParams<Developer>('developers/', { slug });
    return data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error fetching developer by slug:', error);
    return null;
  }
}

export async function createDeveloper(data: Partial<Developer>): Promise<Developer> {
  try {
    return await genericFetch<Developer>(`${ADMIN_API_BASE_URL}developers/`, 'POST', data);
  } catch (error) {
    console.error('Error creating developer:', error);
    throw error;
  }
}

export async function updateDeveloper(id: number, data: Partial<Developer>): Promise<Developer> {
  try {
    return await genericFetch<Developer>(`${ADMIN_API_BASE_URL}developers/${id}/`, 'PUT', data);
  } catch (error) {
    console.error('Error updating developer:', error);
    throw error;
  }
}

export async function deleteDeveloper(id: number): Promise<void> {
  try {
    await genericFetch(`${ADMIN_API_BASE_URL}developers/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error deleting developer:', error);
    throw error;
  }
}

// ===== LOCATIONS API =====
export async function getLocations(params?: Record<string, any>): Promise<ApiResponse<Location>> {
  try {
    return await fetchApiWithParams<Location>('locations/', params || {});
  } catch (error) {
    console.error('Error fetching locations:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getLocationById(id: string): Promise<Location | null> {
  try {
    return await genericFetch<Location>(`${API_BASE_URL}locations/${id}/`);
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    return null;
  }
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  try {
    const data = await fetchApiWithParams<Location>('locations/', { slug });
    return data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error fetching location by slug:', error);
    return null;
  }
}

export async function createLocation(data: Partial<Location>): Promise<Location> {
  try {
    return await genericFetch<Location>(`${ADMIN_API_BASE_URL}locations/`, 'POST', data);
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
}

export async function updateLocation(id: number, data: Partial<Location>): Promise<Location> {
  try {
    return await genericFetch<Location>(`${ADMIN_API_BASE_URL}locations/${id}/`, 'PUT', data);
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}

export async function deleteLocation(id: number): Promise<void> {
  try {
    await genericFetch(`${ADMIN_API_BASE_URL}locations/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
}

// ===== AMENITIES API =====
export async function getAmenities(useAdminApi: boolean = false, params?: Record<string, any>): Promise<ApiResponse<Amenity>> {
  try {
    const baseURL = useAdminApi ? ADMIN_API_BASE_URL : API_BASE_URL;
    return await fetchApiWithParams<Amenity>('amenities/', params || {}, baseURL);
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function createAmenity(data: Partial<Amenity>): Promise<Amenity> {
  try {
    return await genericFetch<Amenity>(`${ADMIN_API_BASE_URL}amenities/`, 'POST', data);
  } catch (error) {
    console.error('Error creating amenity:', error);
    throw error;
  }
}

export async function updateAmenity(id: number, data: Partial<Amenity>): Promise<Amenity> {
  try {
    return await genericFetch<Amenity>(`${ADMIN_API_BASE_URL}amenities/${id}/`, 'PUT', data);
  } catch (error) {
    console.error('Error updating amenity:', error);
    throw error;
  }
}

export async function deleteAmenity(id: number): Promise<void> {
  try {
    await genericFetch(`${ADMIN_API_BASE_URL}amenities/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error deleting amenity:', error);
    throw error;
  }
}

// ===== BLOG POSTS API =====
export async function getBlogPosts(filters?: BlogPostFilters): Promise<ApiResponse<BlogPost>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.author) params.author = filters.author;
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    return await fetchApiWithParams<BlogPost>('blog-posts/', params);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getAdminBlogPosts(filters?: BlogPostFilters): Promise<ApiResponse<BlogPost>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.author) params.author = filters.author;
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    return await fetchApiWithParams<BlogPost>('blog-posts/', params, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching admin blog posts:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getBlogPostById(id: string, useAdminApi: boolean = false): Promise<BlogPost | null> {
  try {
    const baseUrl = useAdminApi ? ADMIN_API_BASE_URL : API_BASE_URL;
    return await genericFetch<BlogPost>(`${baseUrl}blog-posts/${id}/`);
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const data = await fetchApiWithParams<BlogPost>('blog-posts/', { slug });
    return data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function createBlogPost(data: BlogPostInput): Promise<BlogPost> {
  try {
    return await genericFetch<BlogPost>(`${ADMIN_API_BASE_URL}blog-posts/`, 'POST', data);
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

export async function updateBlogPost(id: number, data: BlogPostInput): Promise<BlogPost> {
  try {
    return await genericFetch<BlogPost>(`${ADMIN_API_BASE_URL}blog-posts/${id}/`, 'PUT', data);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
}

export async function deleteBlogPost(id: number): Promise<void> {
  try {
    await genericFetch(`${ADMIN_API_BASE_URL}blog-posts/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
}

// ===== AUTHORS API =====
export async function getAuthors(): Promise<ApiResponse<Author>> {
  try {
    return await fetchApiWithParams<Author>('authors/', {});
  } catch (error) {
    console.error('Error fetching authors:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getAdminAuthors(): Promise<ApiResponse<Author>> {
  try {
    return await fetchApiWithParams<Author>('authors/', {}, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching admin authors:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getBlogPostWithAdminAuthors(id: string): Promise<{ post: BlogPost | null; authors: Author[] }> {
  const [post, authors] = await Promise.all([
    getBlogPostById(id, true),
    getAdminAuthors(),
  ]);

  return {
    post,
    authors: authors.results,
  };
}

export async function getAuthorById(id: string): Promise<Author | null> {
  try {
    return await genericFetch<Author>(`${API_BASE_URL}authors/${id}/`);
  } catch (error) {
    console.error('Error fetching author by ID:', error);
    return null;
  }
}

export async function createAuthor(data: Partial<Author>): Promise<Author> {
  try {
    return await genericFetch<Author>(`${ADMIN_API_BASE_URL}authors/`, 'POST', data);
  } catch (error) {
    console.error('Error creating author:', error);
    throw error;
  }
}

export async function updateAuthor(id: number, data: Partial<Author>): Promise<Author> {
  try {
    return await genericFetch<Author>(`${ADMIN_API_BASE_URL}authors/${id}/`, 'PUT', data);
  } catch (error) {
    console.error('Error updating author:', error);
    throw error;
  }
}

export async function deleteAuthor(id: number): Promise<void> {
  try {
    await genericFetch(`${ADMIN_API_BASE_URL}authors/${id}/`, 'DELETE');
  } catch (error) {
    console.error('Error deleting author:', error);
    throw error;
  }
}

// ===== PARTNERS API =====
export async function getPartners(): Promise<ApiResponse<Partner>> {
  try {
    return await fetchApiWithParams<Partner>('partners/', {}, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

// ===== TESTIMONIALS API =====
export async function getTestimonials(filters?: TestimonialFilters): Promise<ApiResponse<Testimonial>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    return await fetchApiWithParams<Testimonial>('testimonials/', params, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

// ===== CONTACT FORM SUBMISSIONS API =====
export async function getContactSubmissions(filters?: { page?: number; page_size?: number }): Promise<ApiResponse<ContactFormSubmission>> {
  try {
    const params: Record<string, any> = {};

    if (filters?.page) params.page = filters.page;
    if (filters?.page_size) params.page_size = filters.page_size;

    return await fetchApiWithParams<ContactFormSubmission>('contact-submissions/', params, ADMIN_API_BASE_URL);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

export async function getContactSubmissionById(id: string): Promise<ContactFormSubmission | null> {
  try {
    return await genericFetch<ContactFormSubmission>(`${ADMIN_API_BASE_URL}contactformsubmissions/${id}/`);
  } catch (error) {
    console.error('Error fetching contact submission by ID:', error);
    return null;
  }
}

// ===== CONTACT FORM API =====
export async function submitContactForm(submission: Omit<ContactFormSubmission, 'id' | 'submitted_at'>): Promise<ContactFormSubmission> {
  try {
    return await genericFetch<ContactFormSubmission>(`${API_BASE_URL}contact-submissions/`, 'POST', submission);
  } catch (error) {
    throw new Error(`Contact form submission failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ===== LEGACY FUNCTIONS (for backward compatibility) =====
export async function getPosts(): Promise<BlogPost[]> {
  const data = await getBlogPosts();
  return data.results;
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  return getBlogPostBySlug(slug);
}

export async function getSuggestedPosts(currentPostSlug: string): Promise<BlogPost[]> {
  const allPosts = await getPosts();
  return allPosts.filter(post => post.slug !== currentPostSlug).sort(() => 0.5 - Math.random()).slice(0, 3);
}

export async function getDeveloper(slug: string): Promise<Developer | null> {
  return getDeveloperBySlug(slug);
}

export async function getLocation(slug: string): Promise<Location | null> {
  return getLocationBySlug(slug);
}

export async function getCompound(slug: string): Promise<Compound | null> {
  return getCompoundBySlug(slug);
}

export async function getAllProperties(): Promise<Property[]> {
  const data = await getProperties({});
  return data.results;
}

export async function getProperty(slug: string): Promise<Property | null> {
  return getPropertyBySlug(slug);
}

export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  try {
    const data = await fetchApiWithParams<PropertyImage>('propertyimages/', { property: propertyId });
    return data.results;
  } catch (error) {
    console.error('Error fetching property images:', error);
    return [];
  }
}
