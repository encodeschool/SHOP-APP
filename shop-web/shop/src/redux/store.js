// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import checkoutReducer from '../redux/checkoutSlice';
import filterReducer from '../redux/filterSlice';
import compareReducer from '../redux/compareSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
    filters: filterReducer,
    compare: compareReducer
  },
});
