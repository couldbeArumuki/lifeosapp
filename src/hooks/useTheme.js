import { createContext, useContext } from 'react';

export const ThemeContext = createContext({ isDark: false, toggleTheme: () => {}, accent: 'blue', setAccent: () => {} });

export const useTheme = () => useContext(ThemeContext);
