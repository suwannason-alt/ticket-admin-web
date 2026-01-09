import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getENV from '@/app/env';


export interface IEnvState {
  userAPI: string;
  credentialAPI: string;
  service: string;
  authWeb: string;
  loading: boolean;
  basePath: string;
  assetPrefix: string;
}

export const readENV = createAsyncThunk('env', async () => {
    const env = await getENV()
    return env;
})

const envSlice = createSlice({
    name: 'env',
    initialState: {
        userAPI: '',
        credentialAPI: '',
        service: '',
        authWeb: '',
        loading: true,
        basePath: '',
        assetPrefix: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(readENV.fulfilled, (state, action) => {
            state.userAPI = action.payload.userAPI;
            state.credentialAPI = action.payload.credentialAPI;
            state.service = action.payload.service;
            state.authWeb = action.payload.authWeb;
            state.basePath = action.payload.basePath;
            state.assetPrefix = action.payload.assetPrefix;
            state.loading = false;
        });
    }
})

export default envSlice.reducer;

