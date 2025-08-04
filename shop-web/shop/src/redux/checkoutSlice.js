// checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  checkoutInfo: JSON.parse(localStorage.getItem('checkoutInfo')) || null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    saveCheckoutInfo: (state, action) => {
      state.checkoutInfo = action.payload;
      localStorage.setItem('checkoutInfo', JSON.stringify(action.payload));
    },
    clearCheckoutInfo: (state) => {
      state.checkoutInfo = null;
      localStorage.removeItem('checkoutInfo');
    }
  },
});

export const { saveCheckoutInfo, clearCheckoutInfo } = checkoutSlice.actions;
export default checkoutSlice.reducer;
