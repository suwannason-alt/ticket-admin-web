import { configureStore } from '@reduxjs/toolkit';
import userManagementReducer from './slices/userManagementSlice';
import companyProfileReducer from './slices/companyProfileSlice';
import authReducer from './slices/authSlice';
import envReducer from './slices/envSlice';
import roleSlice from './slices/roleSlice'

export const store = configureStore({
  reducer: {
    userManagement: userManagementReducer,
    companyProfile: companyProfileReducer,
    auth: authReducer,
    env: envReducer,
    role: roleSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
