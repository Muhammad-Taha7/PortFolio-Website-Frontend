import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});