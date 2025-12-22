import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentCompanyUser } from '@/service/company.service';

export interface CompanyProfile {
  uuid: string;
  name: string;
  address: string;
  telephone: string;
  email: string;
  website: string;
  logo: string;
  description: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  webSite: string;
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
    const result = await getCurrentCompanyUser();
    return result.data;
  }
);

const companyProfileSlice = createSlice({
  name: 'companyProfile',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCompany: (state, action: PayloadAction<CompanyProfile>) => {
      state.profile = action.payload;
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
  },
});

export const {
  setError,
  setCompany,
} = companyProfileSlice.actions;

export default companyProfileSlice.reducer;
