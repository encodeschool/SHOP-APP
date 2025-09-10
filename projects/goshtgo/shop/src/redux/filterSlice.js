import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  inStock: false,
  priceRange: [0, 220],
  sort: 'default',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setInStock: (state, action) => {
      state.inStock = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setBrands, setInStock, setPriceRange, setSort, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
