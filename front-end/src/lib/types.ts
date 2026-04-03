// Mock types for the blog
export interface FlatPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: {
    url: string | null;
    alt: string | null;
  };
  author: {
    name:string;
    pictureUrl: string | null;
  }
}

// Blog Post Types
export interface Author {
  id: number;
  name: string;
  picture: string | null;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publish_date: string;
  author: Author | null; // Full Author object
  image: string;
  status: 'Published' | 'Draft';
}

// Property Types
export interface Amenity {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  map_url: string | null;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  projects_count: number;
}

export interface LuxuryDeveloper extends Developer {
  main_image?: string;
  representative_image?: string | null;
  tier?: 'GLOBAL TIER' | 'URBAN FOCUS' | 'MARKET LEADER' | 'EMERGING FORCE';
  rating?: number;
  experience?: string;
  active_projects?: string;
  category?: 'Residential' | 'Commercial' | 'Coastal' | 'Mixed-Use';
}

export interface Compound {
  id: number;
  name: string;
  slug: string;
  developer: Developer; // Full Developer object
  location: Location; // Full Location object
  main_image: string;
  description: string;
  status: string;
  delivery_date: string;
  amenities: Amenity[]; // Array of Amenity objects
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  compound: Compound | null; // Full Compound object or null
  developer: Developer | null; // Full Developer object or null
  location: Location | null; // Full Location object or null
  property_type: string;
  price: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  main_image: string;
  floor_plan_image: string | null;
  map_image: string | null;
  is_new_launch: boolean;
  is_featured: boolean;
  amenities: Amenity[]; // Array of Amenity objects
  gallery_images: PropertyImage[]; // Array of PropertyImage objects
}

export interface PropertyImage {
  id: number;
  property: number; // Property ID
  image: string;
  alt_text: string;
}

// Partner Type
export interface Partner {
  id: number;
  name: string;
  logo: string;
}

// Testimonial Type
export interface Testimonial {
  id: number;
  client_name: string;
  client_photo?: string; // For backward compatibility
  client_avatar?: string; // Alias for client_photo
  testimonial_text: string; // The main testimonial content
  quote?: string; // Alias for testimonial_text
  rating: number;
  image?: string; // For fallback in the UI
}

// Contact Form Submission Type
export interface ContactFormSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  submitted_at: string;
}

// Page Content Type for CMS
export interface PageContent {
  id?: number;
  slug: string;
  title: string;
  subtitle?: string;
  content: string; // Dynamic HTML or JSON string
  hero_image?: string;
  metadata?: Record<string, any>; // For extra fields (vision, mission, etc.)
  updated_at?: string;
}
