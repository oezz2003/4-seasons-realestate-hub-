import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Developer } from '@/lib/types';

interface DevelopersState {
  developers: Developer[];
  currentDeveloper: Developer | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  filters: {
    search: string;
  };
}

const initialState: DevelopersState = {
  developers: [],
  currentDeveloper: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  filters: {
    search: '',
  },
};

// Async thunks
export const fetchDevelopers = createAsyncThunk(
  'developers/fetchAll',
  async (params: { page?: number; filters?: Partial<DevelopersState['filters']> } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const { page = 1, filters = {} } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== '')),
      });

      const response = await fetch(`http://127.0.0.1:8000/api/admin/developers/?${queryParams}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch developers');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchDeveloper = createAsyncThunk(
  'developers/fetchOne',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/admin/developers/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch developer');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createDeveloper = createAsyncThunk(
  'developers/create',
  async (developerData: Partial<Developer>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch('http://127.0.0.1:8000/api/admin/developers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(developerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create developer');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateDeveloper = createAsyncThunk(
  'developers/update',
  async ({ id, data }: { id: string; data: Partial<Developer> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/admin/developers/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update developer');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteDeveloper = createAsyncThunk(
  'developers/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/admin/developers/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to delete developer');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const developersSlice = createSlice({
  name: 'developers',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<DevelopersState['filters']>>) => {
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
    setCurrentDeveloper: (state, action: PayloadAction<Developer | null>) => {
      state.currentDeveloper = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Developers
      .addCase(fetchDevelopers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevelopers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.developers = action.payload.results;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(fetchDevelopers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Developer
      .addCase(fetchDeveloper.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeveloper.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDeveloper = action.payload;
        state.error = null;
      })
      .addCase(fetchDeveloper.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Developer
      .addCase(createDeveloper.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDeveloper.fulfilled, (state, action) => {
        state.isLoading = false;
        state.developers.unshift(action.payload);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createDeveloper.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Developer
      .addCase(updateDeveloper.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDeveloper.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.developers.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.developers[index] = action.payload;
        }
        if (state.currentDeveloper?.id === action.payload.id) {
          state.currentDeveloper = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDeveloper.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Developer
      .addCase(deleteDeveloper.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDeveloper.fulfilled, (state, action) => {
        state.isLoading = false;
        state.developers = state.developers.filter(d => d.id !== Number(action.payload));
        state.totalCount -= 1;
        if (state.currentDeveloper?.id === Number(action.payload)) {
          state.currentDeveloper = null;
        }
        state.error = null;
      })
      .addCase(deleteDeveloper.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError, setCurrentDeveloper } = developersSlice.actions;
export default developersSlice.reducer;
