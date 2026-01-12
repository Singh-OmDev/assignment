import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/gigs/';

// Get Gigs
export const getGigs = createAsyncThunk('gigs/getAll', async (search, thunkAPI) => {
    try {
        const query = search ? `?search=${search}` : '';
        const response = await axios.get(API_URL + query);
        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Single Gig
export const getGig = createAsyncThunk('gigs/getOne', async (gigId, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + gigId);
        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create Gig
export const createGig = createAsyncThunk('gigs/create', async (gigData, thunkAPI) => {
    try {
        // Get token
        const token = thunkAPI.getState().auth.user.token; // Wait, I use Cookies. Do I need token in header?
        // Logic: AuthMiddleware checks cookies. Axios needs `withCredentials: true`.
        // The token is HttpOnly cookie, so I don't need to send it in header manually if browser handles it.
        // My authSlice login sets user in localStorage but NOT the token string if it's HttpOnly.
        // Backend `generateToken` sets cookie.
        // Frontend `axios` needs `withCredentials: true`.

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        const response = await axios.post(API_URL, gigData, config);
        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    gigs: [],
    currentGig: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const gigSlice = createSlice({
    name: 'gig',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGigs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getGigs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.gigs = action.payload;
            })
            .addCase(getGigs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getGig.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getGig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.currentGig = action.payload;
            })
            .addCase(getGig.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createGig.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createGig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.gigs.push(action.payload);
            })
            .addCase(createGig.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = gigSlice.actions;
export default gigSlice.reducer;
