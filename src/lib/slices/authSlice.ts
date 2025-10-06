import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  plan: string;
  status: 'active' | 'trial' | 'inactive';
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: string;
    name: string;
    permissions: Array<{
      serviceName: string;
      featureName: string;
      view: boolean;
      insert: boolean;
      update: boolean;
      delete: boolean;
    }>;
  };
  companies: Company[];
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

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    // Mock API call
    return new Promise<{ user: AuthUser; currentCompany: Company }>((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@company.com' && credentials.password === 'password') {
          const user: AuthUser = {
            id: '1',
            email: 'admin@company.com',
            firstName: 'John',
            lastName: 'Doe',
            companies: mockCompanies,
            role: {
              id: '1',
              name: 'Administrator',
              permissions: [
                {
                  serviceName: 'User Management',
                  featureName: 'Users',
                  view: true,
                  insert: true,
                  update: true,
                  delete: true,
                },
                {
                  serviceName: 'User Management',
                  featureName: 'Roles',
                  view: true,
                  insert: true,
                  update: true,
                  delete: true,
                },
                {
                  serviceName: 'Company Profile',
                  featureName: 'Profile',
                  view: true,
                  insert: false,
                  update: true,
                  delete: false,
                },
              ],
            },
          };
          resolve({ user, currentCompany: mockCompanies[0] });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }
);

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
  return new Promise<{ user: AuthUser; currentCompany: Company }>((resolve) => {
    setTimeout(() => {
      const user: AuthUser = {
        id: '1',
        email: 'admin@company.com',
        firstName: 'John',
        lastName: 'Doe',
        companies: mockCompanies,
        role: {
          id: '1',
          name: 'Administrator',
          permissions: [
            {
              serviceName: 'User Management',
              featureName: 'Users',
              view: true,
              insert: true,
              update: true,
              delete: true,
            },
            {
              serviceName: 'User Management',
              featureName: 'Roles',
              view: true,
              insert: true,
              update: true,
              delete: true,
            },
            {
              serviceName: 'Company Profile',
              featureName: 'Profile',
              view: true,
              insert: false,
              update: true,
              delete: false,
            },
          ],
        },
      };
      resolve({ user, currentCompany: mockCompanies[0] });
    }, 500);
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
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.currentCompany = action.payload.currentCompany;
        state.availableCompanies = action.payload.user.companies;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      })
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
        state.availableCompanies = action.payload.user.companies;
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
