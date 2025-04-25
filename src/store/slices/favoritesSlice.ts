import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface FavoritesState {
  coinIds: string[];
}

// Load favorites from local storage if available
const loadFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('favorites');
  return saved ? JSON.parse(saved) : [];
};

const initialState: FavoritesState = {
  coinIds: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.coinIds.includes(action.payload)) {
        state.coinIds.push(action.payload);
        // Save to local storage
        localStorage.setItem('favorites', JSON.stringify(state.coinIds));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.coinIds = state.coinIds.filter((id) => id !== action.payload);
      // Save to local storage
      localStorage.setItem('favorites', JSON.stringify(state.coinIds));
    },
    clearFavorites: (state) => {
      state.coinIds = [];
      // Clear local storage
      localStorage.removeItem('favorites');
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export const selectFavorites = (state: RootState) => state.favorites.coinIds;
export const selectIsFavorite = (state: RootState, coinId: string) => 
  state.favorites.coinIds.includes(coinId);

export default favoritesSlice.reducer;