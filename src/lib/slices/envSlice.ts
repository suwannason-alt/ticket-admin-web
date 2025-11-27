import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getENV from '@/app/env';


export interface IEnvState {
  userAPI: string;
  credentialAPI: string;
  service: string;
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
        service: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(readENV.fulfilled, (state, action) => {
            state.userAPI = action.payload.userAPI;
            state.credentialAPI = action.payload.credentialAPI;
            state.service = action.payload.service;
        });
    }
})

export default envSlice.reducer;

