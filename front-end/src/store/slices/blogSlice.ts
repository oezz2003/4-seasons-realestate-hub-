import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BlogPost } from '@/lib/types';

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  filters: {
    search: string;
    author: string;
    status: string;
  };
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  filters: {
    search: '',
    author: '',
    status: '',
  },
};

// Async thunks
export const fetchBlogPosts = createAsyncThunk(
  'blog/fetchAll',
  async (params: { page?: number; filters?: Partial<BlogState['filters']> } = {}, { getState, rejectWithValue }) => {
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

      const response = await fetch(`http://127.0.0.1:8000/api/admin/blog-posts/?${queryParams}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch blog posts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchBlogPost = createAsyncThunk(
  'blog/fetchOne',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/admin/blog-posts/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch blog post');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createBlogPost = createAsyncThunk(
  'blog/create',
  async (postData: Partial<BlogPost>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch('http://127.0.0.1:8000/api/admin/blog-posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create blog post');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  'blog/update',
  async ({ id, data }: { id: string; data: Partial<BlogPost> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/admin/blog-posts/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update blog post');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blog/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/admin/blog-posts/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to delete blog post');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<BlogState['filters']>>) => {
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
    setCurrentPost: (state, action: PayloadAction<BlogPost | null>) => {
      state.currentPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blog Posts
      .addCase(fetchBlogPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.results;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Blog Post
      .addCase(fetchBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Blog Post
      .addCase(createBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Blog Post
      .addCase(updateBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Blog Post
      .addCase(deleteBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(p => p.id !== Number(action.payload));
        state.totalCount -= 1;
        if (state.currentPost?.id === Number(action.payload)) {
          state.currentPost = null;
        }
        state.error = null;
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError, setCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;
