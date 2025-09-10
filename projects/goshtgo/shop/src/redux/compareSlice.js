// redux/compareSlice.js
import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists && state.items.length < 4) {
        state.items.push(action.payload);
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCompare: (state) => {
      state.items = [];
    },
  },
});

// ✅ safe and memoized selector
export const selectCompareItems = createSelector(
  (state) => state.compare?.items ?? [],
  (items) => items
);

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
