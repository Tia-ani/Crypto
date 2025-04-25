import React, { useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectTheme } from '../../store/slices/themeSlice';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useAppSelector(selectTheme);
  
  useEffect(() => {
    // Apply theme to document element
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;