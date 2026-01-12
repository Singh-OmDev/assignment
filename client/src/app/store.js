import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gigReducer from '../features/gigs/gigSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        gigs: gigReducer,
    },
});
