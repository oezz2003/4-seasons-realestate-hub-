import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Compound } from '@/lib/types';

interface CompoundsState {
  compounds: Compound[];
  currentCompound: Compound | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  filters: {
    search: string;
    developer: string;
    location: string;
    status: string;
  };
}

const initialState: CompoundsState = {
  compounds: [],
  currentCompound: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  filters: {
    search: '',
    developer: '',
    location: '',
    status: '',
  },
};

// Async thunks
export const fetchCompounds = createAsyncThunk(
  'compounds/fetchAll',
  async (params: { page?: number; filters?: Partial<CompoundsState['filters']> } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, filters = {} } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== '')),
      });

      const response = await fetch(`/api/compounds/?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch compounds');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchCompound = createAsyncThunk(
  'compounds/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compounds/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch compound');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createCompound = createAsyncThunk(
  'compounds/create',
  async (compoundData: Partial<Compound>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compounds/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compoundData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create compound');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateCompound = createAsyncThunk(
  'compounds/update',
  async ({ id, data }: { id: string; data: Partial<Compound> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compounds/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update compound');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteCompound = createAsyncThunk(
  'compounds/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compounds/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return rejectWithValue('Failed to delete compound');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const compoundsSlice = createSlice({
  name: 'compounds',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CompoundsState['filters']>>) => {
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
    setCurrentCompound: (state, action: PayloadAction<Compound | null>) => {
      state.currentCompound = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Compounds
      .addCase(fetchCompounds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompounds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.compounds = action.payload.results;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(fetchCompounds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Compound
      .addCase(fetchCompound.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompound.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCompound = action.payload;
        state.error = null;
      })
      .addCase(fetchCompound.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Compound
      .addCase(createCompound.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCompound.fulfilled, (state, action) => {
        state.isLoading = false;
        state.compounds.unshift(action.payload);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createCompound.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Compound
      .addCase(updateCompound.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCompound.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.compounds.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.compounds[index] = action.payload;
        }
        if (state.currentCompound?.id === action.payload.id) {
          state.currentCompound = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCompound.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Compound
      .addCase(deleteCompound.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCompound.fulfilled, (state, action) => {
        state.isLoading = false;
        state.compounds = state.compounds.filter(c => c.id !== Number(action.payload));
        state.totalCount -= 1;
        if (state.currentCompound?.id === Number(action.payload)) {
          state.currentCompound = null;
        }
        state.error = null;
      })
      .addCase(deleteCompound.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError, setCurrentCompound } = compoundsSlice.actions;
export default compoundsSlice.reducer;
