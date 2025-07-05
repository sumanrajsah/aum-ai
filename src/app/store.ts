// store.ts
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
    verified: false, // Single state variable
};

// Create a slice
const verifiedSlice = createSlice({
    name: 'verified', // Slice name
    initialState, // Initial state
    reducers: {
        // Reducer to set the verified state
        setVerified(state, action) {
            state.verified = action.payload;
        },
        // Optional: Reducer to toggle the verified state
        toggleVerified(state) {
            state.verified = !state.verified;
        },
    },
});

// Export the action creators
export const { setVerified, toggleVerified } = verifiedSlice.actions;

// Create the store
const store = configureStore({
    reducer: verifiedSlice.reducer, // Use the slice's reducer
});

// Export RootState for useSelector
export type RootState = ReturnType<typeof store.getState>;

export default store;