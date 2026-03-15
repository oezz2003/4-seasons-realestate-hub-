import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '@/lib/types';

const ADMIN_API_BASE_URL = '/api/';

interface PropertiesState {
  properties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  filters: {
    search: string;
    property_type: string;
    location: string;
    developer: string;
    min_price: string;
    max_price: string;
    min_area: string;
    max_area: string;
    bedrooms: string;
    bathrooms: string;
    is_featured: boolean | null;
    is_new_launch: boolean | null;
  };
}

const initialState: PropertiesState = {
  properties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  filters: {
    search: '',
    property_type: '',
    location: '',
    developer: '',
    min_price: '',
    max_price: '',
    min_area: '',
    max_area: '',
    bedrooms: '',
    bathrooms: '',
    is_featured: null,
    is_new_launch: null,
  },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (params: { page?: number; filters?: Partial<PropertiesState['filters']> } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const { page = 1, filters: overrideFilters = {} } = params;
      const mergedFilters = { ...initialState.filters, ...overrideFilters };

      const searchParams = new URLSearchParams();
      searchParams.set('page', page.toString());

      if (mergedFilters.search) searchParams.set('search', mergedFilters.search);
      if (mergedFilters.property_type) searchParams.set('property_type', mergedFilters.property_type);
      if (mergedFilters.location) searchParams.set('location', mergedFilters.location);
      if (mergedFilters.developer) searchParams.set('developer', mergedFilters.developer);
      if (mergedFilters.min_price) searchParams.set('min_price', mergedFilters.min_price);
      if (mergedFilters.max_price) searchParams.set('max_price', mergedFilters.max_price);
      if (mergedFilters.min_area) searchParams.set('min_area', mergedFilters.min_area);
      if (mergedFilters.max_area) searchParams.set('max_area', mergedFilters.max_area);
      if (mergedFilters.bedrooms) searchParams.set('bedrooms', mergedFilters.bedrooms);
      if (mergedFilters.bathrooms) searchParams.set('bathrooms', mergedFilters.bathrooms);
      if (mergedFilters.is_featured !== null) searchParams.set('is_featured', String(mergedFilters.is_featured));
      if (mergedFilters.is_new_launch !== null) searchParams.set('is_new_launch', String(mergedFilters.is_new_launch));

      const requestUrl = `${ADMIN_API_BASE_URL}properties/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.detail || 'Failed to fetch properties';
        return rejectWithValue(message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error occurred';
      return rejectWithValue(message);
    }
  }
);

export const fetchProperty = createAsyncThunk(
  'properties/fetchOne',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`/api/properties/${id}/`);

      if (!response.ok) {
        return rejectWithValue('Failed to fetch property');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/create',
  async (propertyData: Partial<Property>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch('/api/properties/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create property');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/update',
  async ({ id, data }: { id: string; data: Partial<Property> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`/api/properties/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update property');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`/api/properties/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return rejectWithValue('Failed to delete property');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PropertiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProperty: (state, action: PayloadAction<Property | null>) => {
      state.currentProperty = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload.results;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Property
      .addCase(fetchProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProperty = action.payload;
        state.error = null;
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties.unshift(action.payload);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Property
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.properties.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.currentProperty?.id === action.payload.id) {
          state.currentProperty = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = state.properties.filter(p => p.id !== Number(action.payload));
        state.totalCount -= 1;
        if (state.currentProperty?.id === Number(action.payload)) {
          state.currentProperty = null;
        }
        state.error = null;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError, setCurrentProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;
