
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSystemRole } from '@/service/role.service';
export interface ISystemRoleState {
    uuid: string;
    name: string;
    description: string;
}

interface IROleSlice {
    system: ISystemRoleState[];
    loading: boolean;
    error: string | null;
}

const initState: IROleSlice = {
    system: [],
    loading: false,
    error: null
}

export const readSystemRole = createAsyncThunk('systemRole', async () => {
    const results = await getSystemRole()
    return results.data;
})

const roleSlice = createSlice({
    name: 'role',
    initialState: initState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(readSystemRole.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(readSystemRole.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.system = action.payload
        })
    }
})

export default roleSlice.reducer