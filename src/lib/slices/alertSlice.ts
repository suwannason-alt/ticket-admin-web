
import { createSlice } from '@reduxjs/toolkit';

export interface IAlertState {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | null;
    open: boolean;
}

const initState: IAlertState = {
    message: '',
    type: null,
    open: false,
}

const alertSlice = createSlice({
    name: 'alert',
    initialState: initState,
    reducers: {
        showAlert: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.open = true;
        },
        hideAlert: (state) => {
            state.open = false;
        }
    }
})

export const { showAlert, hideAlert } = alertSlice.actions
export default alertSlice.reducer;