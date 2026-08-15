import { createSlice } from '@reduxjs/toolkit';

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            return true;
        }
        return false;
    } catch {
        return true;
    }
};

const initialToken = localStorage.getItem('token');
const validInitialToken = initialToken && !isTokenExpired(initialToken) ? initialToken : null;
if (initialToken && !validInitialToken) {
    localStorage.removeItem('token');
}

const initialState = {
    token: validInitialToken,
    isAuthenticated: !!validInitialToken,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload;
            state.error = null;
            localStorage.setItem('token', action.payload);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;