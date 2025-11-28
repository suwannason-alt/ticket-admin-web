import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getENV from '@/app/env';


export interface IEnvState {
  userAPI: string;
  credentialAPI: string;
  service: string;
  authWeb: string;
  loading: boolean;
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
        loading: true
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(readENV.fulfilled, (state, action) => {
            state.userAPI = action.payload.userAPI;
            state.credentialAPI = action.payload.credentialAPI;
            state.service = action.payload.service;
            state.authWeb = action.payload.authWeb;
            state.loading = false;
        });
    }
})

export default envSlice.reducer;

