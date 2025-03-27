import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: [],
    reducers: {
        addFeed: (state, action) => action.payload,
        updateFeed: (state, action) => {
            const userId = action.payload;
            return state.filter((user) => user._id !== userId);
        },
        clearFeed: () => []
    }
});

export const { addFeed, updateFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
