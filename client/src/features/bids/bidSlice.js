import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bids/';

const config = {
    withCredentials: true,
};

// Place Bid
export const placeBid = createAsyncThunk('bids/create', async (bidData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, bidData, config);
        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Bids for Gig
export const getBids = createAsyncThunk('bids/get', async (gigId, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + gigId, config);
        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Hire Freelancer
export const hireFreelancer = createAsyncThunk('bids/hire', async (bidId, thunkAPI) => {
    try {
        const response = await axios.patch(API_URL + bidId + '/hire', {}, config);
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
    bids: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const bidSlice = createSlice({
    name: 'bid',
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
            // Place Bid
            .addCase(placeBid.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(placeBid.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // state.bids.push(action.payload); // Don't necessarily need to push if we re-fetch or if logic differs
            })
            .addCase(placeBid.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Bids
            .addCase(getBids.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBids.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bids = action.payload;
            })
            .addCase(getBids.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Hire
            .addCase(hireFreelancer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(hireFreelancer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Logic: update bid status in local state if viewing list
                const index = state.bids.findIndex(bid => bid._id === action.payload.bid._id);
                if (index !== -1) {
                    state.bids[index].status = 'hired';
                    // Set others to rejected
                    state.bids.forEach(bid => {
                        if (bid._id !== action.payload.bid._id) bid.status = 'rejected';
                    });
                }
            })
            .addCase(hireFreelancer.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = bidSlice.actions;
export default bidSlice.reducer;
