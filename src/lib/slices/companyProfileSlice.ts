import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  settings: {
    timezone: string;
    currency: string;
    dateFormat: string;
    language: string;
  };
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'trial';
    expiresAt?: string;
    features: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface CompanyProfileState {
  profile: CompanyProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCompanyProfile = createAsyncThunk(
  'companyProfile/fetchProfile',
  async () => {
    // Mock API call
    return new Promise<CompanyProfile>((resolve) => {
      setTimeout(() => {
        const profile: CompanyProfile = {
          id: '1',
          name: 'Acme Corporation',
          description: 'Leading provider of innovative solutions',
          logo: 'https://via.placeholder.com/150x150?text=ACME',
          website: 'https://acme.com',
          email: 'info@acme.com',
          phone: '+1 (555) 123-4567',
          address: {
            street: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
          },
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            language: 'en',
          },
          subscription: {
            plan: 'Enterprise',
            status: 'active',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            features: ['User Management', 'Advanced Analytics', 'API Access', 'Priority Support'],
          },
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(profile);
      }, 1000);
    });
  }
);

export const updateCompanyProfile = createAsyncThunk(
  'companyProfile/updateProfile',
  async (updates: Partial<CompanyProfile>) => {
    // Mock API call
    return new Promise<CompanyProfile>((resolve) => {
      setTimeout(() => {
        // In a real app, this would merge with existing data from the server
        const updatedProfile: CompanyProfile = {
          ...updates,
          id: '1',
          updatedAt: new Date().toISOString(),
        } as CompanyProfile;
        resolve(updatedProfile);
      }, 1000);
    });
  }
);

const companyProfileSlice = createSlice({
  name: 'companyProfile',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateProfileField: (state, action: PayloadAction<{ field: keyof CompanyProfile; value: any }>) => {
      if (state.profile) {
        (state.profile as any)[action.payload.field] = action.payload.value;
      }
    },
    updateAddress: (state, action: PayloadAction<Partial<CompanyProfile['address']>>) => {
      if (state.profile) {
        state.profile.address = { ...state.profile.address, ...action.payload };
      }
    },
    updateSettings: (state, action: PayloadAction<Partial<CompanyProfile['settings']>>) => {
      if (state.profile) {
        state.profile.settings = { ...state.profile.settings, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch company profile
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch company profile';
      })
      // Update company profile
      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateCompanyProfile.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to update company profile';
      });
  },
});

export const {
  setError,
  updateProfileField,
  updateAddress,
  updateSettings,
} = companyProfileSlice.actions;

export default companyProfileSlice.reducer;
