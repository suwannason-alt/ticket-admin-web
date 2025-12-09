import { createSlice } from '@reduxjs/toolkit';

export interface INaveState {
    title: string;
    path: string;
    id: string;
}

const initState: INaveState = {
    title: '',
    path: '/',
    id: 'dashboard'
}

const navSlice = createSlice({
    name: 'nav',
    initialState: initState,
    reducers: {
        setNav: (state, action) => {
            state.title = action.payload.title
            state.path = action.payload.path
            state.id = action.payload.id
        }
    }
})

export const { setNav } = navSlice.actions
export default navSlice.reducer;