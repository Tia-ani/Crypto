import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../../types';
import { RootState } from '..';

const initialState: FilterState = {
  sort: {
    field: 'market_cap',
    direction: 'desc',
  },
  search: '',
  currency: 'usd',
  page: 1,
  perPage: 50,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) => {
      state.sort = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      // Reset to first page when searching
      state.page = 1;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      // Reset to first page when changing items per page
      state.page = 1;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSort,
  setSearch,
  setCurrency,
  setPage,
  setPerPage,
  resetFilters,
} = filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;

export default filtersSlice.reducer;