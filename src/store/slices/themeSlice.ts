import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState } from '../../types';
import { RootState } from '..';

// Helper to detect system preference
const getPreferredTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  
  // Check local storage first
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (savedTheme) return savedTheme;
  
  // Otherwise check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: ThemeState = {
  mode: getPreferredTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      // Save to local storage
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save to local storage
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.mode;

export default themeSlice.reducer;