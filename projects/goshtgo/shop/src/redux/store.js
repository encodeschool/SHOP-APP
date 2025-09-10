// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';
import filterReducer from './filterSlice';
import compareReducer from './compareSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
    filters: filterReducer,
    compare: compareReducer
  },
});
