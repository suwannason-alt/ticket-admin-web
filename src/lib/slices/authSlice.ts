import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profile } from '@/service/user.service';

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  plan: string;
  status: 'active' | 'trial' | 'inactive';
}

export interface AuthUser {
  uuid?: string;
  displayName?: string;
  pictureUrl?: string;
  company?: string;
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  currentCompany: Company | null;
  availableCompanies: Company[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  switchingCompany: boolean;
}

const initialState: AuthState = {
  user: null,
  currentCompany: null,
  availableCompanies: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  switchingCompany: false,
};

// Mock companies data
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    description: 'Leading provider of innovative solutions',
    logo: 'https://via.placeholder.com/40x40?text=AC',
    plan: 'Enterprise',
    status: 'active',
  },
  {
    id: '2',
    name: 'TechStart Inc.',
    description: 'Startup focused on emerging technologies',
    logo: 'https://via.placeholder.com/40x40?text=TS',
    plan: 'Professional',
    status: 'active',
  },
  {
    id: '3',
    name: 'Global Solutions Ltd.',
    description: 'International consulting services',
    logo: 'https://via.placeholder.com/40x40?text=GS',
    plan: 'Basic',
    status: 'trial',
  },
];


export const logout = createAsyncThunk('auth/logout', async () => {
  // Mock API call
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  // Mock API call to get current user from token
  const response = await profile();
  return new Promise<{ user: AuthUser; currentCompany: Company }>((resolve) => {
      const user: AuthUser = {
        uuid: response.data.uuid,
        displayName: response.data.displayName,
        pictureUrl: '',
        email: response.data.email,
      };
      resolve({ user, currentCompany: mockCompanies[0] });

  });
});

export const switchCompany = createAsyncThunk(
  'auth/switchCompany',
  async (companyId: string) => {
    // Mock API call to switch company context
    return new Promise<Company>((resolve, reject) => {
      setTimeout(() => {
        const company = mockCompanies.find(c => c.id === companyId);
        if (company) {
          resolve(company);
        } else {
          reject(new Error('Company not found'));
        }
      }, 1000);
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.currentCompany = null;
        state.availableCompanies = [];
        state.isAuthenticated = false;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.currentCompany = action.payload.currentCompany;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Switch company
      .addCase(switchCompany.pending, (state) => {
        state.switchingCompany = true;
        state.error = null;
      })
      .addCase(switchCompany.fulfilled, (state, action) => {
        state.switchingCompany = false;
        state.currentCompany = action.payload;
      })
      .addCase(switchCompany.rejected, (state, action) => {
        state.switchingCompany = false;
        state.error = action.error.message || 'Failed to switch company';
      });
  },
});

export const { setError, clearError } = authSlice.actions;

export default authSlice.reducer;
